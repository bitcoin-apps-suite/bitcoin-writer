/**
 * UTXO chain-of-proof transactions — implements UTXO-CHAIN-SPEC.md.
 *
 *   Genesis save:  [funding]               → [0] chain UTXO 546 | [1] OP_RETURN B:// + MAP CHAINPROOF | [2] change?
 *   Save #N:       [prev chain UTXO, fund] → [0] chain UTXO 546 | [1] OP_RETURN B:// + MAP CHAINPROOF | [2] change?
 *   Fork:          [tip chain UTXO, fund]  → [0] branch A 546 | [1] branch B 546 | [2] OP_RETURN MAP chainproof_fork | [3] change?
 *
 * Deviations from the spec, all because documents are always encrypted:
 *   - B:// data is AES-256-GCM ciphertext (media type application/octet-stream).
 *   - content_hash / prev_hash are SHA-256 of the ciphertext, so anyone can verify them;
 *     the plaintext hash lives inside the ciphertext.
 *   - Extra MAP fields: key_id (to re-derive keys), enc + iv (decryption), message (commit message).
 *   - The genesis save has no `genesis` field (its own txid is the document id).
 */

import { Hash, OP, P2PKH, PrivateKey, Script, Transaction, Utils } from '@bsv/sdk';

export const B_PREFIX = '19HxigV4QyBv3tHpQVcUEQyq1pzZVdoAut';
export const MAP_PREFIX = '1PuQa7K62MiKCtssSLKy1kh56WWU7MtUR5';
export const CHAIN_DUST = 546;
export const APP = 'bitcoin-writer';

export interface Outpoint {
  txid: string;
  vout: number;
}

export interface SaveFields {
  version: number;
  genesis?: string;
  prev_hash?: string;
  content_hash: string;
  author: string;
  word_count: number;
  char_count: number;
  branch: string;
  ts: number;
  key_id: string;
  iv: string;
  message: string;
}

export interface ForkFields {
  genesis: string;
  parent_version: number;
  branch_a: string;
  branch_b: string;
  fork_reason?: string;
  key_id: string;
  ts: number;
}

export type ParsedCommit =
  | { type: 'chainproof'; txid: string; fields: SaveFields; ciphertext: number[]; parent: Outpoint | null; chainOutputs: number[]; tx: Transaction }
  | { type: 'chainproof_fork'; txid: string; fields: ForkFields; parent: Outpoint; chainOutputs: number[]; tx: Transaction };

const utf8 = (s: string) => Utils.toArray(s, 'utf8');

export const sha256Hex = (bytes: number[]) => Utils.toHex(Hash.sha256(bytes));

function mapPushes(type: string, fields: Record<string, string | number | undefined>): number[][] {
  const pushes = [utf8(MAP_PREFIX), utf8('SET'), utf8('app'), utf8(APP), utf8('type'), utf8(type)];
  for (const [key, value] of Object.entries(fields)) {
    if (value === undefined || value === '') continue;
    pushes.push(utf8(key), utf8(String(value)));
  }
  return pushes;
}

function opReturn(pushes: number[][]): Script {
  const script = new Script().writeOpCode(OP.OP_FALSE).writeOpCode(OP.OP_RETURN);
  for (const data of pushes) script.writeBin(data);
  return script;
}

export function saveDataScript(ciphertext: number[], fields: SaveFields): Script {
  return opReturn([
    utf8(B_PREFIX),
    ciphertext,
    utf8('application/octet-stream'),
    utf8('binary'),
    utf8(`${fields.key_id}.bwenc`),
    utf8('|'),
    ...mapPushes('chainproof', fields as unknown as Record<string, string | number>),
  ]);
}

export function forkDataScript(fields: ForkFields): Script {
  return opReturn(mapPushes('chainproof_fork', fields as unknown as Record<string, string | number>));
}

// ---------- building ----------

export interface ChainInput {
  sourceTransaction: Transaction;
  vout: number;
  key: PrivateKey;
}

/**
 * Build and sign a save or fork transaction. The fee is computed from the signed size at
 * `feeRate` sat/byte; any funding left over (≥ dust) goes to `changeAddress`.
 */
export async function buildChainTx(params: {
  prev: ChainInput | null;
  funding: ChainInput;
  chainOutputs: string[]; // chain addresses, one per chain UTXO (1 for save, 2 for fork)
  dataScript: Script;
  feeRate: number;
  changeAddress: string;
}): Promise<{ tx: Transaction; fee: number }> {
  const inputs = [params.prev, params.funding].filter(Boolean) as ChainInput[];
  const inputSats = inputs.reduce((sum, i) => sum + (i.sourceTransaction.outputs[i.vout].satoshis ?? 0), 0);
  const outputSats = params.chainOutputs.length * CHAIN_DUST;

  const assemble = (change: number) => {
    const tx = new Transaction();
    for (const input of inputs) {
      tx.addInput({
        sourceTransaction: input.sourceTransaction,
        sourceOutputIndex: input.vout,
        unlockingScriptTemplate: new P2PKH().unlock(input.key),
        sequence: 0xffffffff,
      });
    }
    for (const address of params.chainOutputs) {
      tx.addOutput({ lockingScript: new P2PKH().lock(address), satoshis: CHAIN_DUST });
    }
    tx.addOutput({ lockingScript: params.dataScript, satoshis: 0 });
    if (change > 0) tx.addOutput({ lockingScript: new P2PKH().lock(params.changeAddress), satoshis: change });
    return tx;
  };

  // Size with a change output (worst case), then decide whether change is worth keeping.
  let tx = assemble(CHAIN_DUST);
  await tx.sign();
  const withChangeFee = feeFor(tx.toBinary().length, params.feeRate);
  const change = inputSats - outputSats - withChangeFee;

  if (change >= CHAIN_DUST) {
    tx = assemble(change);
    await tx.sign();
    return { tx, fee: withChangeFee };
  }

  tx = assemble(0);
  await tx.sign();
  const fee = inputSats - outputSats;
  if (fee < feeFor(tx.toBinary().length, params.feeRate)) {
    throw new Error(`Funding too small: ${inputSats} sats in, ${outputSats} out, fee ${feeFor(tx.toBinary().length, params.feeRate)}`);
  }
  return { tx, fee };
}

/** Fee for a transaction size, with a few bytes of headroom for signature-length variance. */
export function feeFor(bytes: number, feeRate: number): number {
  return Math.max(1, Math.ceil((bytes + 4) * feeRate));
}

/**
 * Exact funding quote: builds and signs the transaction against a placeholder funding output.
 * Returns the sats the funding address must receive.
 */
export async function quoteFunding(params: {
  prev: ChainInput | null;
  fundingKey: PrivateKey;
  chainOutputs: string[];
  dataScript: Script;
  feeRate: number;
}): Promise<{ fundingSats: number; minerSats: number; bytes: number }> {
  const placeholder = new Transaction();
  placeholder.addOutput({ lockingScript: new P2PKH().lock(params.fundingKey.toAddress()), satoshis: 1e8 });

  const inputs = [params.prev, { sourceTransaction: placeholder, vout: 0, key: params.fundingKey }].filter(Boolean) as ChainInput[];
  const tx = new Transaction();
  for (const input of inputs) {
    tx.addInput({
      sourceTransaction: input.sourceTransaction,
      sourceOutputIndex: input.vout,
      unlockingScriptTemplate: new P2PKH().unlock(input.key),
      sequence: 0xffffffff,
    });
  }
  for (const address of params.chainOutputs) tx.addOutput({ lockingScript: new P2PKH().lock(address), satoshis: CHAIN_DUST });
  tx.addOutput({ lockingScript: params.dataScript, satoshis: 0 });
  await tx.sign();

  const bytes = tx.toBinary().length;
  const minerSats = feeFor(bytes, params.feeRate);
  const prevSats = params.prev ? params.prev.sourceTransaction.outputs[params.prev.vout].satoshis ?? 0 : 0;
  const fundingSats = Math.max(0, params.chainOutputs.length * CHAIN_DUST + minerSats - prevSats);
  return { fundingSats, minerSats, bytes };
}

// ---------- parsing ----------

function scriptPushes(script: Script): number[][] {
  const out: number[][] = [];
  const walk = (chunks: { op: number; data?: number[] }[]) => {
    for (const chunk of chunks) {
      if (chunk.op === OP.OP_RETURN && chunk.data) {
        // The SDK folds everything after OP_RETURN into one raw chunk; re-parse it.
        try {
          walk(Script.fromBinary(chunk.data).chunks);
        } catch {
          // malformed trailing data
        }
      } else if (chunk.data) {
        out.push(chunk.data);
      } else if (chunk.op === OP.OP_0) {
        out.push([]);
      }
    }
  };
  walk(script.chunks);
  return out;
}

function readMap(pushes: string[], start: number): Record<string, string> {
  const fields: Record<string, string> = {};
  for (let i = start; i + 1 < pushes.length; i += 2) fields[pushes[i]] = pushes[i + 1];
  return fields;
}

export function parseCommitTx(rawHex: string): ParsedCommit | null {
  const tx = Transaction.fromHex(rawHex);
  const txid = tx.id('hex');
  const parentInput = tx.inputs[0];

  for (const output of tx.outputs) {
    const pushes = scriptPushes(output.lockingScript);
    const text = pushes.map((p) => Utils.toUTF8(p));
    const mapAt = text.indexOf(MAP_PREFIX);
    if (mapAt < 0 || text[mapAt + 1] !== 'SET') continue;
    const map = readMap(text, mapAt + 2);
    if (map.app !== APP) continue;

    if (map.type === 'chainproof') {
      const bAt = text.indexOf(B_PREFIX);
      if (bAt < 0) continue;
      const fields: SaveFields = {
        version: Number(map.version),
        genesis: map.genesis || undefined,
        prev_hash: map.prev_hash || undefined,
        content_hash: map.content_hash,
        author: map.author,
        word_count: Number(map.word_count),
        char_count: Number(map.char_count),
        branch: map.branch || 'main',
        ts: Number(map.ts),
        key_id: map.key_id,
        iv: map.iv,
        message: map.message || '',
      };
      const parent = fields.version > 1 ? { txid: parentInput.sourceTXID!, vout: parentInput.sourceOutputIndex } : null;
      return { type: 'chainproof', txid, fields, ciphertext: pushes[bAt + 1], parent, chainOutputs: [0], tx };
    }

    if (map.type === 'chainproof_fork') {
      const fields: ForkFields = {
        genesis: map.genesis,
        parent_version: Number(map.parent_version),
        branch_a: map.branch_a,
        branch_b: map.branch_b,
        fork_reason: map.fork_reason || undefined,
        key_id: map.key_id,
        ts: Number(map.ts),
      };
      return {
        type: 'chainproof_fork',
        txid,
        fields,
        parent: { txid: parentInput.sourceTXID!, vout: parentInput.sourceOutputIndex },
        chainOutputs: [0, 1],
        tx,
      };
    }
  }
  return null;
}

/** Address a chain output is locked to (P2PKH), or null. */
export function outputAddress(tx: Transaction, vout: number): string | null {
  const chunks = tx.outputs[vout]?.lockingScript.chunks;
  if (!chunks || chunks.length !== 5 || chunks[0].op !== OP.OP_DUP || !chunks[2].data) return null;
  return Utils.toBase58Check(chunks[2].data, [0]);
}
