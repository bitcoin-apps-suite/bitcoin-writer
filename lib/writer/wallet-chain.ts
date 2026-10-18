/**
 * Saves and forks paid and signed by the user's BRC-100 wallet (bWalletX first).
 *
 * Same transaction layout and CHAINPROOF metadata as the HandCash path (chainproof.ts), so the
 * history graph, verify and checkout read both. Differences:
 *   - one transaction instead of two: the wallet adds its own funding inputs and change, so there is
 *     no separate funding payment;
 *   - the chain UTXO is locked to a key the wallet derives (wallet-tx.ts), never to a server-derived key;
 *   - content is BRC-2 wallet-encrypted (MAP enc=brc2) instead of AES-GCM with a HandCash-derived key.
 *
 * The server only plans (scripts + quote) and indexes; it never sees a key or the plaintext.
 */

import { Beef, P2PKH, PrivateKey, PublicKey, Transaction, Utils } from '@bsv/sdk';
import { broadcastTransaction, fetchBeefHex, fetchRawTransaction } from '@/lib/bsv/woc';
import { ChainError, forkParts, loadTransaction, saveParts, type ForkRequest, type SaveRequest } from './chain';
import { CHAIN_DUST, feeFor, outputAddress, parseCommitTx, quoteFunding, type Outpoint } from './chainproof';
import { recordCommit, type CommitRow } from './commits';
import { getFeeRate, serviceFee } from './pricing';
import type { WalletPlan, PlannedOutput } from './wallet-tx';
import type { WriterSession } from './session';

export const WALLET_BASKET = 'bitcoin writer';
/** Rough size the wallet adds: one P2PKH funding input and a change output. */
const WALLET_OVERHEAD_BYTES = 148 + 34;

/** Where the service fee goes for wallet saves. Unset = no service fee on wallet saves. */
function serviceAddress(): string | null {
  const address = process.env.WRITER_SERVICE_ADDRESS?.trim();
  return address ? address : null;
}

export function chainAddressFor(chainPublicKey: unknown): string {
  if (typeof chainPublicKey !== 'string' || !/^0[23][0-9a-fA-F]{64}$/.test(chainPublicKey)) {
    throw new ChainError('Invalid chain public key');
  }
  return PublicKey.fromString(chainPublicKey).toAddress();
}

function walletSession(session: WriterSession) {
  if (session.wallet !== 'bwalletx' || !session.identityKey) throw new ChainError('Sign in with a BRC-100 wallet first', 403);
  return { ...session, paymail: undefined };
}

async function inputBeefHex(prev: Outpoint, source: Transaction): Promise<string> {
  const fromWoc = await fetchBeefHex(prev.txid);
  if (fromWoc) {
    try {
      if (Beef.fromString(fromWoc, 'hex').findTxid(prev.txid)) return fromWoc;
    } catch {
      // fall through
    }
  }
  // Not indexed yet: send the bare transaction. A wallet that made the previous save already has it.
  const beef = new Beef();
  beef.mergeRawTx(source.toBinary());
  return beef.toHex();
}

async function plan(
  kind: WalletPlan['kind'],
  keyId: string,
  prev: { outpoint: Outpoint; source: Transaction } | null,
  chainAddresses: string[],
  dataScript: ReturnType<typeof import('./chainproof').saveDataScript>
): Promise<WalletPlan> {
  const feeRate = await getFeeRate();
  // Size the transaction with throwaway keys (same signature sizes), then add the wallet's own input and change.
  const sizing = await quoteFunding({
    prev: prev ? { sourceTransaction: prev.source, vout: prev.outpoint.vout, key: PrivateKey.fromRandom() } : null,
    fundingKey: PrivateKey.fromRandom(),
    chainOutputs: chainAddresses,
    dataScript,
    feeRate,
  });
  const service = serviceAddress();
  const bytes = sizing.bytes - 148 + WALLET_OVERHEAD_BYTES + (service ? 34 : 0);
  const minerSats = feeFor(bytes, feeRate);
  const serviceSats = service ? Math.max(1, serviceFee(minerSats)) : 0;
  const prevSats = prev ? prev.source.outputs[prev.outpoint.vout].satoshis ?? 0 : 0;
  const fundingSats = Math.max(0, chainAddresses.length * CHAIN_DUST + minerSats - prevSats);

  const outputs: PlannedOutput[] = chainAddresses.map((address, i) => ({
    lockingScript: new P2PKH().lock(address).toHex(),
    satoshis: CHAIN_DUST,
    outputDescription: chainAddresses.length > 1 ? `Bitcoin Writer branch ${i === 0 ? 'A' : 'B'}` : 'Bitcoin Writer chain UTXO',
    basket: WALLET_BASKET,
    tags: [`doc ${keyId}`],
    customInstructions: JSON.stringify({ protocolID: [2, 'bitcoin writer chain'], keyID: `${keyId}/chain`, counterparty: 'self' }),
  }));
  outputs.push({ lockingScript: dataScript.toHex(), satoshis: 0, outputDescription: 'Bitcoin Writer encrypted save' });
  if (service && serviceSats > 0) {
    outputs.push({ lockingScript: new P2PKH().lock(service).toHex(), satoshis: serviceSats, outputDescription: 'Bitcoin Writer service fee' });
  }

  return {
    kind,
    keyId,
    description: kind === 'fork' ? 'Bitcoin Writer fork' : 'Bitcoin Writer save',
    prev: prev
      ? {
          txid: prev.outpoint.txid,
          vout: prev.outpoint.vout,
          satoshis: prevSats,
          lockingScript: prev.source.outputs[prev.outpoint.vout].lockingScript.toHex(),
        }
      : null,
    inputBEEF: prev ? await inputBeefHex(prev.outpoint, prev.source) : null,
    outputs,
    quote: { minerSats, serviceSats, fundingSats, totalSats: fundingSats + serviceSats, bytes },
  };
}

const OWNER = 'this wallet';

export async function planWalletSave(session: WriterSession, chainPublicKey: unknown, req: SaveRequest): Promise<WalletPlan> {
  if (req.enc !== 'brc2') throw new ChainError('Wallet saves must be wallet-encrypted (enc: brc2)');
  const chainAddress = chainAddressFor(chainPublicKey);
  const s = walletSession(session);
  const { parent, dataScript } = await saveParts({ ...s, handle: s.identityKey!, paymail: undefined }, chainAddress, { ...req, iv: '' }, OWNER);
  const prev = parent && req.prev ? { outpoint: req.prev, source: parent.source } : null;
  return plan('save', req.keyId, prev, [chainAddress], dataScript);
}

export async function planWalletFork(session: WriterSession, chainPublicKey: unknown, req: ForkRequest): Promise<WalletPlan> {
  const chainAddress = chainAddressFor(chainPublicKey);
  const s = walletSession(session);
  const { parent, dataScript } = await forkParts({ ...s, handle: s.identityKey! }, chainAddress, req, OWNER);
  return plan('fork', req.keyId, { outpoint: req.tip, source: parent.source }, [chainAddress, chainAddress], dataScript);
}

function parseWalletTx(input: { tx?: unknown; txid?: unknown }): Transaction | null {
  if (typeof input.tx === 'string' && /^[0-9a-fA-F]+$/.test(input.tx)) {
    const bytes = Utils.toArray(input.tx, 'hex');
    for (const parse of [() => Transaction.fromAtomicBEEF(bytes), () => Transaction.fromBEEF(bytes), () => Transaction.fromBinary(bytes)]) {
      try {
        return parse();
      } catch {
        // try the next format
      }
    }
  }
  return null;
}

/** Index a save/fork the wallet made and broadcast (and broadcast it again, in case the wallet delayed it). */
export async function recordWalletCommit(session: WriterSession, input: { tx?: unknown; txid?: unknown }) {
  const s = walletSession(session);
  let tx = parseWalletTx(input);
  if (!tx && typeof input.txid === 'string' && /^[0-9a-f]{64}$/.test(input.txid)) {
    tx = Transaction.fromHex(await loadTransaction(input.txid).catch(() => fetchRawTransaction(input.txid as string)));
  }
  if (!tx) throw new ChainError('Send the transaction the wallet returned');
  if (typeof input.txid === 'string' && input.txid !== tx.id('hex')) throw new ChainError('txid does not match the transaction');

  const rawTx = tx.toHex();
  const parsed = parseCommitTx(rawTx);
  if (!parsed) throw new ChainError('Not a Bitcoin Writer chainproof transaction');
  if (parsed.type === 'chainproof' && parsed.fields.author !== s.identityKey) throw new ChainError('This save was made by another wallet', 403);
  if (parsed.type === 'chainproof_fork') {
    // A fork must keep both branches on the chain key of the output it spent.
    const parentRaw = await loadTransaction(parsed.parent.txid);
    const spent = outputAddress(Transaction.fromHex(parentRaw), parsed.parent.vout);
    if (!spent || outputAddress(parsed.tx, 0) !== spent || outputAddress(parsed.tx, 1) !== spent) throw new ChainError('Fork outputs left the chain key');
  }

  let status: CommitRow['status'] = 'broadcast';
  let broadcastError: string | undefined;
  try {
    await broadcastTransaction(rawTx);
  } catch (error) {
    const message = (error as Error).message;
    if (!/already|known|txn-already|duplicate/i.test(message)) {
      status = 'pending';
      broadcastError = message;
    }
  }

  let minerSats = 0;
  try {
    minerSats = tx.getFee();
  } catch {
    // source transactions not in the BEEF; fee unknown
  }
  const service = serviceAddress();
  const serviceSats = service
    ? tx.outputs.reduce((sum, _o, i) => sum + (outputAddress(tx!, i) === service ? tx!.outputs[i].satoshis ?? 0 : 0), 0)
    : 0;

  const txid = parsed.txid;
  const row: CommitRow =
    parsed.type === 'chainproof'
      ? {
          txid,
          type: 'chainproof',
          doc_id: parsed.fields.genesis ?? txid,
          key_id: parsed.fields.key_id,
          version: parsed.fields.version,
          branch: parsed.fields.branch,
          message: parsed.fields.message,
          parent_txid: parsed.parent?.txid ?? null,
          parent_vout: parsed.parent?.vout ?? null,
          content_hash: parsed.fields.content_hash,
          author_handle: s.identityKey!,
          byte_size: rawTx.length / 2,
          miner_sats: minerSats,
          service_sats: serviceSats,
          funding_txid: txid,
          raw_tx: rawTx,
          status,
        }
      : {
          txid,
          type: 'chainproof_fork',
          doc_id: parsed.fields.genesis,
          key_id: parsed.fields.key_id,
          version: parsed.fields.parent_version,
          branch: `${parsed.fields.branch_a},${parsed.fields.branch_b}`,
          message: parsed.fields.fork_reason ?? '',
          parent_txid: parsed.parent.txid,
          parent_vout: parsed.parent.vout,
          content_hash: null,
          author_handle: s.identityKey!,
          byte_size: rawTx.length / 2,
          miner_sats: minerSats,
          service_sats: serviceSats,
          funding_txid: txid,
          raw_tx: rawTx,
          status,
        };
  const indexed = await recordCommit(row);
  const { raw_tx: _raw, ...commit } = row;
  return { commit: { ...commit, created_at: new Date().toISOString() }, indexed, broadcastError };
}
