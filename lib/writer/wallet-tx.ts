/**
 * Bitcoin Writer ↔ BRC-100 wallet (bWalletX first; any BRC-100 wallet works).
 *
 * Shared by the browser bundle (client/writer-wallet.ts) and the tests. Only @bsv/sdk and relative
 * imports, so it bundles for the browser.
 *
 * Keys never leave the wallet:
 *   - content: wallet.encrypt / decrypt (BRC-2, keys from BRC-42/43), protocol [1, 'bitcoin writer'],
 *     keyID = the document's key_id, counterparty 'self'.
 *   - chain UTXO: P2PKH to the wallet's derived key, protocol [2, 'bitcoin writer chain'],
 *     keyID = `${key_id}/chain`, counterparty 'self'. The next save spends it with a signature the
 *     wallet makes over the BIP143/FORKID sighash (createSignature with hashToDirectlySign).
 *   - funding, change and the one-sheet approval: the wallet's own createAction.
 */

import {
  Hash,
  Signature,
  Transaction,
  TransactionSignature,
  UnlockingScript,
  Utils,
  LockingScript,
  type CreateActionArgs,
  type WalletInterface,
  type WalletProtocol,
} from '@bsv/sdk';

export const CONTENT_PROTOCOL: WalletProtocol = [1, 'bitcoin writer'];
export const CHAIN_PROTOCOL: WalletProtocol = [2, 'bitcoin writer chain'];
export const chainKeyID = (keyId: string) => `${keyId}/chain`;
/** Unlocking script for a P2PKH input: <sig (≤73)> <pubkey 33> plus push opcodes. */
export const P2PKH_UNLOCK_LENGTH = 108;
const SIGHASH_ALL_FORKID = TransactionSignature.SIGHASH_ALL | TransactionSignature.SIGHASH_FORKID;

/** One planned output, as the server's /api/writer/wallet/prepare returns it. */
export interface PlannedOutput {
  lockingScript: string; // hex
  satoshis: number;
  outputDescription: string;
  basket?: string;
  tags?: string[];
  customInstructions?: string;
}

export interface WalletPlan {
  kind: 'save' | 'fork';
  keyId: string;
  description: string;
  /** The chain UTXO this save spends (null for a document's first save). */
  prev: { txid: string; vout: number; satoshis: number; lockingScript: string } | null;
  /** BEEF (hex) containing prev's transaction. */
  inputBEEF: string | null;
  outputs: PlannedOutput[];
  quote: { minerSats: number; serviceSats: number; fundingSats: number; totalSats: number; bytes: number };
}

// ---------- keys & encryption ----------

export async function chainPublicKey(wallet: WalletInterface, keyId: string): Promise<string> {
  const { publicKey } = await wallet.getPublicKey({ protocolID: CHAIN_PROTOCOL, keyID: chainKeyID(keyId), counterparty: 'self', forSelf: true });
  return publicKey;
}

export async function encryptContent(wallet: WalletInterface, keyId: string, plaintext: number[]): Promise<number[]> {
  const { ciphertext } = await wallet.encrypt({ plaintext, protocolID: CONTENT_PROTOCOL, keyID: keyId, counterparty: 'self' });
  return Array.from(ciphertext);
}

export async function decryptContent(wallet: WalletInterface, keyId: string, ciphertext: number[]): Promise<number[]> {
  const { plaintext } = await wallet.decrypt({ ciphertext, protocolID: CONTENT_PROTOCOL, keyID: keyId, counterparty: 'self' });
  return Array.from(plaintext);
}

// ---------- the save transaction ----------

/** The createAction arguments for a plan. Outputs keep their order: vout 0 (and 1 for a fork) are the chain UTXOs. */
export function createActionArgs(plan: WalletPlan): CreateActionArgs {
  const args: CreateActionArgs = {
    description: plan.description,
    labels: ['bitcoin writer'],
    outputs: plan.outputs.map((o) => ({
      lockingScript: o.lockingScript,
      satoshis: o.satoshis,
      outputDescription: o.outputDescription,
      ...(o.basket ? { basket: o.basket } : {}),
      ...(o.tags ? { tags: o.tags } : {}),
      ...(o.customInstructions ? { customInstructions: o.customInstructions } : {}),
    })),
    options: { randomizeOutputs: false, acceptDelayedBroadcast: false },
  };
  if (plan.prev) {
    if (!plan.inputBEEF) throw new Error('Missing the previous save transaction');
    args.inputBEEF = Utils.toArray(plan.inputBEEF, 'hex');
    args.inputs = [
      {
        outpoint: `${plan.prev.txid}.${plan.prev.vout}`,
        unlockingScriptLength: P2PKH_UNLOCK_LENGTH,
        inputDescription: 'Previous save (chain UTXO)',
      },
    ];
  }
  return args;
}

/**
 * Sign the chain input of a wallet's signable transaction. Returns the input index and the unlocking
 * script (hex). `prev` supplies the source satoshis/script when the BEEF doesn't carry the source tx.
 */
export async function signChainInput(
  wallet: WalletInterface,
  signableTx: number[],
  keyId: string,
  prev: NonNullable<WalletPlan['prev']>
): Promise<{ index: number; unlockingScript: string }> {
  const tx = Transaction.fromAtomicBEEF(signableTx);
  const index = tx.inputs.findIndex(
    (i) => (i.sourceTXID ?? i.sourceTransaction?.id('hex')) === prev.txid && i.sourceOutputIndex === prev.vout
  );
  if (index < 0) throw new Error('The wallet left out the previous save');
  const input = tx.inputs[index];
  const source = input.sourceTransaction?.outputs[prev.vout];
  const sourceSatoshis = source?.satoshis ?? prev.satoshis;
  const subscript = source?.lockingScript ?? LockingScript.fromHex(prev.lockingScript);

  const preimage = TransactionSignature.format({
    sourceTXID: prev.txid,
    sourceOutputIndex: prev.vout,
    sourceSatoshis,
    transactionVersion: tx.version,
    otherInputs: tx.inputs.filter((_, i) => i !== index),
    inputIndex: index,
    outputs: tx.outputs,
    inputSequence: input.sequence ?? 0xffffffff,
    subscript,
    lockTime: tx.lockTime,
    scope: SIGHASH_ALL_FORKID,
  });

  const { signature } = await wallet.createSignature({
    hashToDirectlySign: Hash.hash256(preimage),
    protocolID: CHAIN_PROTOCOL,
    keyID: chainKeyID(keyId),
    counterparty: 'self',
  });
  const publicKey = Utils.toArray(await chainPublicKey(wallet, keyId), 'hex');
  const der = Signature.fromDER(Array.from(signature));
  const sig = new TransactionSignature(der.r, der.s, SIGHASH_ALL_FORKID).toChecksigFormat();
  const unlocking = new UnlockingScript([
    { op: sig.length, data: sig },
    { op: publicKey.length, data: publicKey },
  ]);
  return { index, unlockingScript: unlocking.toHex() };
}

/** Run the plan through the wallet: one createAction (the wallet's one-sheet approval), then signAction for the chain input. */
export async function commitWithWallet(wallet: WalletInterface, plan: WalletPlan): Promise<{ txid: string; tx?: number[] }> {
  const created = await wallet.createAction(createActionArgs(plan));
  if (created.signableTransaction) {
    if (!plan.prev) throw new Error('Unexpected signable transaction');
    const { index, unlockingScript } = await signChainInput(wallet, Array.from(created.signableTransaction.tx), plan.keyId, plan.prev);
    const signed = await wallet.signAction({
      reference: created.signableTransaction.reference,
      spends: { [index]: { unlockingScript } },
      options: { acceptDelayedBroadcast: false },
    });
    if (!signed.txid) throw new Error('The wallet did not return a transaction id');
    return { txid: signed.txid, tx: signed.tx ? Array.from(signed.tx) : undefined };
  }
  if (!created.txid) throw new Error('The wallet did not return a transaction id');
  return { txid: created.txid, tx: created.tx ? Array.from(created.tx) : undefined };
}
