FULL FILE REPLACEMENT:

/**
 * MicroOrdinalsService
 * 
 * Implements real micro-ordinals inscription on the BSV blockchain.
 * Creates, signs, and broadcasts actual BSV transactions that embed
 * document content using the ordinal inscription envelope protocol.
 * 
 * Inscription envelope format:
 *   OP_FALSE OP_IF "ord" OP_1 <contentType> OP_0 <dataChunks> OP_ENDIF <lockingScript>
 * 
 * The OP_FALSE ensures the IF-branch is never executed but the data
 * is still permanently recorded on-chain.
 * 
 * Network operations use the WhatsOnChain API (no extra dependencies).
 * Transaction building uses the existing `bsv` library.
 */

// If your project uses @bsv/sdk instead of bsv, change this import.
import bsv from 'bsv';
import {
  InscriptionData,
  InscriptionResult,
  InscriptionConfig,
  UTXO,
  InscriptionStatus,
  InscriptionStatusResponse,
  InscriptionRetrievalResult,
  BSVNetwork,
} from '../types/DocumentInscription';

// ─── Utility: Script Push-Data Encoding ───────────────────────────

/**
 * Encode a data push operation for BSV scripts.
 * Handles OP_PUSHDATA1/2/4 for large payloads.
 */
function encodePushData(data: Buffer): Buffer {
  const len = data.length;
  if (len === 0) {
    return Buffer.from([0x00]);
  } else if (len <= 75) {
    return Buffer.concat([Buffer.from([len]), data]);
  } else if (len <= 255) {
    return Buffer.concat([Buffer.from([0x4c, len]), data]);
  } else if (len <= 65535) {
    const lenBuf = Buffer.alloc(2);
    lenBuf.writeUInt16LE(len);
    return Buffer.concat([Buffer.from([0x4d]), lenBuf, data]);
  } else {
    const lenBuf = Buffer.alloc(4);
    lenBuf.writeUInt32LE(len);
    return Buffer.concat([Buffer.from([0x4e]), lenBuf, data]);
  }
}

/**
 * Read a push-data operation from a script buffer.
 * Returns the pushed data and the offset past it, or null on failure.
 */
function readPushData(buf: Buffer, offset: number): { data: Buffer; nextOffset: number } | null {
  if (offset >= buf.length) return null;

  const opcode = buf[offset];
  offset += 1;

  // OP_0 / empty push
  if (opcode === 0x00) {
    return { data: Buffer.alloc(0), nextOffset: offset };
  }
  // Direct push: 1–75 bytes
  if (opcode >= 1 && opcode <= 75) {
    const data = buf.subarray(offset, offset + opcode);
    return { data: Buffer.from(data), nextOffset: offset + opcode };
  }
  // OP_PUSHDATA1
  if (opcode === 0x4c) {
    if (offset >= buf.length) return null;
    const len = buf[offset];
    offset += 1;
    const data = buf.subarray(offset, offset + len);
    return { data: Buffer.from(data), nextOffset: offset + len };
  }
  // OP_PUSHDATA2
  if (opcode === 0x4d) {
    if (offset + 2 > buf.length) return null;
    const len = buf.readUInt16LE(offset);
    offset += 2;
    const data = buf.subarray(offset, offset + len);
    return { data: Buffer.from(data), nextOffset: offset + len };
  }
  // OP_PUSHDATA4
  if (opcode === 0x4e) {
    if (offset + 4 > buf.length) return null;
    const len = buf.readUInt32LE(offset);
    offset += 4;
    const data = buf.subarray(offset, offset + len);
    return { data: Buffer.from(data), nextOffset: offset + len };
  }
  return null;
}

// ─── Utility: Inscription Script Building ─────────────────────────

/**
 * Build the micro-ordinals inscription envelope script as hex.
 * 
 * Envelope: OP_FALSE OP_IF "ord" OP_1 <contentType> OP_0 <dataChunks> OP_ENDIF <lockingScript>
 */
function buildInscriptionScriptHex(data: InscriptionData, lockingScriptHex: string): string {
  const parts: Buffer[] = [];

  // OP_FALSE OP_IF — start inscription envelope
  parts.push(Buffer.from([0x00, 0x63]));

  // Push "ord" protocol identifier
  parts.push(encodePushData(Buffer.from('ord', 'ascii')));

  // OP_1 (content type follows)
  parts.push(Buffer.from([0x51]));

  // Push content type
  parts.push(encodePushData(Buffer.from(data.contentType, 'utf8')));

  // OP_0 (data follows)
  parts.push(Buffer.from([0x00]));

  // Push content in chunks (BSV max push size = 520 bytes)
  const content = Buffer.isBuffer(data.content)
    ? data.content
    : Buffer.from(data.content, 'utf8');
  const MAX_PUSH_SIZE = 520;
  for (let i = 0; i < content.length; i += MAX_PUSH_SIZE) {
    const chunk = content.subarray(i, Math.min(i + MAX_PUSH_SIZE, content.length));
    parts.push(encodePushData(Buffer.from(chunk)));
  }

  // OP_ENDIF — close inscription envelope
  parts.push(Buffer.from([0x68]));

  // Append the actual locking script (typically P2PKH)
  parts.push(Buffer.from(lockingScriptHex, 'hex'));

  return Buffer.concat(parts).toString('hex');
}

/**
 * Parse an inscription envelope from a script hex string.
 * Returns the content type and reassembled content, or null if not an inscription.
 */
function parseInscriptionScript(scriptHex: string): { contentType: string; content: Buffer } | null {
  try {
    const buf = Buffer.from(scriptHex, 'hex');
    let offset = 0;

    // Expect OP_FALSE OP_IF
    if (buf[offset] !== 0x00 || buf[offset + 1] !== 0x63) return null;
    offset += 2;

    // Read "ord"
    const ordResult = readPushData(buf, offset);
    if (!ordResult || ordResult.data.toString('ascii') !== 'ord') return null;
    offset = ordResult.nextOffset;

    // Expect OP_1
    if (buf[offset] !== 0x51) return null;
    offset += 1;

    // Read content type
    const typeResult = readPushData(buf, offset);
    if (!typeResult) return null;
    offset = typeResult.nextOffset;
    const contentType = typeResult.data.toString('utf8');

    // Expect OP_0
    if (buf[offset] !== 0x00) return null;
    offset += 1;

    // Read data chunks until OP_ENDIF (0x68)
    const chunks: Buffer[] = [];
    while (offset < buf.length && buf[offset] !== 0x68) {
      const chunkResult = readPushData(buf, offset);
      if (!chunkResult) break;
      chunks.push(chunkResult.data);
      offset = chunkResult.nextOffset;
    }

    // Must end with OP_ENDIF
    if (offset >= buf.length || buf[offset] !== 0x68) return null;

    return { contentType, content: Buffer.concat(chunks) };
  } catch {
    return null;
  }
}

// ─── Utility: Transaction Size Estimation ────────────────────────

/** Compute the compact-size varint byte length for a given integer. */
function varIntSize(n: number): number {
  if (n < 0xfd) return 1;
  if (n <= 0xffff) return 3;
  if (n <= 0xffffffff) return 5;
  return 9;
}

/**
 * Estimate the serialized transaction size in bytes.
 * 
 * Base:    10 bytes (version + varints + locktime)
 * Input:   ~148 bytes per P2PKH input (txid + vout + scriptSig + sequence)
 * Output:  8 (satoshis) + varint(scriptLen) + scriptLen
 */
function estimateTxSize(inputCount: number, inscriptionScriptSize: number): number {
  const baseSize = 10;
  const inputSize = 148;
  const inscriptionOutputSize = 8 + varIntSize(inscriptionScriptSize) + inscriptionScriptSize;
  const changeOutputSize = 34; // P2PKH output
  return baseSize + inputCount * inputSize + inscriptionOutputSize + changeOutputSize;
}

// ─── MicroOrdinalsService ─────────────────────────────────────────

export class MicroOrdinalsService {
  private config: InscriptionConfig;

  private static readonly DEFAULT_CONFIG: InscriptionConfig = {
    network: 'testnet',
    feeRate: 0.5,
    maxRetries: 3,
    retryDelay: 5000,
    dustLimit: 546,
  };

  private static readonly NETWORK_ENDPOINTS: Record<BSVNetwork, {
    api: string;
    broadcast: string;
    explorer: string;
  }> = {
    mainnet: {
      api: 'https://api.whatsonchain.com/v1/bsv/main',
      broadcast: 'https://api.whatsonchain.com/v1/bsv/main/tx/raw',
      explorer: 'https://whatsonchain.com/tx/',
    },
    testnet: {
      api: 'https://api.whatsonchain.com/v1/bsv/test',
      broadcast: 'https://api.whatsonchain.com/v1/bsv/test/tx/raw',
      explorer: 'https://test.whatsonchain.com/tx/',
    },
  };

  constructor(config?: Partial<InscriptionConfig>) {
    this.config = { ...MicroOrdinalsService.DEFAULT_CONFIG, ...config };
  }

  // ── Configuration ──

  getNetwork(): BSVNetwork {
    return this.config.network;
  }

  setNetwork(network: BSVNetwork): void {
    this.config.network = network;
  }

  setPrivateKey(wifOrHex: string): void {
    this.config.privateKey = wifOrHex;
  }

  getConfig(): InscriptionConfig {
    return { ...this.config };
  }

  private get endpoints() {
    return MicroOrdinalsService.NETWORK_ENDPOINTS[this.config.network];
  }

  // ── Wallet ──

  /**
   * Get the wallet address derived from the configured private key.
   * Returns null if no private key is set.
   */
  getAddress(): string | null {
    if (!this.config.privateKey) return null;
    const privateKey = new bsv.PrivateKey(this.config.privateKey, this.config.network);
    return privateKey.toAddress().toString();
  }

  /**
   * Check the wallet balance by summing all UTXO values.
   */
  async getBalance(): Promise<number> {
    const address = this.getAddress();
    if (!address) throw new Error('No private key configured.');
    const utxos = await this.fetchUTXOs(address);
    return utxos.reduce((sum, u) => sum + u.satoshis, 0);
  }

  // ── Inscription ──

  /**
   * Inscribe data as a micro-ordinals inscription on the BSV blockchain.
   * 
   * Steps:
   *   1. Derive P2PKH locking script from private key
   *   2. Build ordinal inscription envelope script
   *   3. Fetch UTXOs for funding
   *   4. Build & sign transaction
   *   5. Broadcast with retry
   * 
   * @throws Error if no private key, insufficient funds, or broadcast failure
   */
  async inscribe(data: InscriptionData): Promise<InscriptionResult> {
    if (!this.config.privateKey) {
      throw new Error('No private key configured. Call setPrivateKey() before inscribing.');
    }

    // 1. Create private key and derive address / P2PKH script
    const privateKey = new bsv.PrivateKey(this.config.privateKey, this.config.network);
    const address = privateKey.toAddress();
    const addressStr = address.toString();
    const pubKeyBuffer = privateKey.toPublicKey().toBuffer();

    // hash160 = SHA256 then RIPEMD160
    const pubKeyHash = bsv.crypto.Hash.sha256ripemd160(pubKeyBuffer);

    // P2PKH script hex: OP_DUP OP_HASH160 <20 bytes> OP_EQUALVERIFY OP_CHECKSIG
    const p2pkhScriptHex = '76a914' + pubKeyHash.toString('hex') + '88ac';

    // 2. Build inscription script
    const inscriptionScriptHex = buildInscriptionScriptHex(data, p2pkhScriptHex);
    const inscriptionScriptSize = Buffer.from(inscriptionScriptHex, 'hex').length;

    // 3. Fetch UTXOs
    const utxos = await this.fetchUTXOs(addressStr);
    if (utxos.length === 0) {
      throw new Error(
        `No UTXOs available for address ${addressStr}. Fund this address on ${this.config.network}.`
      );
    }

    // 4. Build transaction
    const tx = new bsv.Transaction();

    // Add inputs from UTXOs
    tx.from(
      utxos.map((u) => ({
        txid: u.txid,
        vout: u.vout,
        satoshis: u.satoshis,
        scriptPubKey: u.scriptPubKey,
      }))
    );

    // Add inscription output (dust-limit satoshis)
    const inscriptionOutput = new bsv.Transaction.Output({
      satoshis: this.config.dustLimit,
      script: bsv.Script.fromHex(inscriptionScriptHex),
    });
    tx.addOutput(inscriptionOutput);

    // Add change output (send back to self)
    tx.change(address);

    // Calculate fee
    const estimatedSize = estimateTxSize(utxos.length, inscriptionScriptSize);
    const fee = Math.max(Math.ceil(estimatedSize * this.config.feeRate), 1);

    // Verify sufficient funds
    const totalInput = utxos.reduce((sum, u) => sum + u.satoshis, 0);
    if (totalInput < this.config.dustLimit + fee) {
      throw new Error(
        `Insufficient funds: need ${this.config.dustLimit + fee} satoshis, ` +
        `have ${totalInput}. Short by ${this.config.dustLimit + fee - totalInput} satoshis.`
      );
    }

    tx.fee(fee);

    // Sign transaction
    tx.sign(privateKey);

    // Serialize
    const rawTxHex = tx.serialize();
    const txid = tx.hash;

    // Find the inscription output vout (the one starting with OP_FALSE OP_IF = 0x00 0x63)
    let inscriptionVout = 0;
    for (let i = 0; i < tx.outputs.length; i++) {
      const scriptHex = tx.outputs[i].script.toHex();
      if (scriptHex.startsWith('0063')) {
        inscriptionVout = i;
        break;
      }
    }

    const inscriptionId = `${txid}:${inscriptionVout}`;

    // 5. Broadcast with retry
    await this.broadcastWithRetry(rawTxHex);

    return {
      txid,
      vout: inscriptionVout,
      inscriptionId,
      fee,
      status: 'broadcast' as InscriptionStatus,
      rawTx: rawTxHex,
    };
  }

  /**
   * Retrieve inscribed content from the blockchain.
   * Fetches the raw transaction, parses the output script, and extracts the inscription.
   */
  async getInscription(txid: string, vout: number): Promise<InscriptionRetrievalResult> {
    const rawTxHex = await this.fetchRawTx(txid);
    const tx = new bsv.Transaction(rawTxHex);

    if (vout >= tx.outputs.length) {
      throw new Error(`Output ${vout} not found in transaction ${txid} (has ${tx.outputs.length} outputs).`);
    }

    const output = tx.outputs[vout];
    const scriptHex = output.script.toHex();
    const inscription = parseInscriptionScript(scriptHex);

    if (!inscription) {
      throw new Error(`No inscription envelope found in output ${vout} of tx ${txid}.`);
    }

    return {
      content: inscription.content,
      contentType: inscription.contentType,
      inscriptionId: `${txid}:${vout}`,
      txid,
      vout,
    };
  }

  /**
   * Verify that an inscription exists on-chain.
   */
  async verifyInscription(inscriptionId: string): Promise<boolean> {
    const [txid, voutStr] = inscriptionId.split(':');
    if (!txid || !voutStr) return false;
    const vout = parseInt(voutStr, 10);
    try {
      const result = await this.getInscription(txid, vout);
      return result !== null;
    } catch {
      return false;
    }
  }

  /**
   * Check the confirmation status of an inscription's transaction.
   */
  async getStatus(txid: string, vout: number): Promise<InscriptionStatusResponse> {
    const txData = await this.fetchTxData(txid);

    let status: InscriptionStatus = 'broadcast';
    let confirmations = 0;

    if (txData.blockhash || txData.blockheight) {
      status = 'confirmed';
      confirmations = txData.confirmations ?? 1;
    }

    return {
      inscriptionId: `${txid}:${vout}`,
      status,
      confirmations,
      txid,
      vout,
    };
  }

  // ── Network: UTXOs ──

  /**
   * Fetch unspent outputs for an address from WhatsOnChain.
   */
  private async fetchUTXOs(address: string): Promise<UTXO[]> {
    const url = `${this.endpoints.api}/address/${address}/unspent`;
    const response = await fetch(url, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch UTXOs: ${response.status} ${response.statusText}`);
    }

    const data = (await response.json()) as Array<Record<string, unknown>>;
    if (!Array.isArray(data)) return [];

    return data.map((u) => ({
      txid: String(u.txid),
      vout: Number(u.vout),
      satoshis: Number(u.satoshis ?? u.value ?? 0),
      scriptPubKey: String(u.scriptPubKey ?? u.script ?? ''),
    }));
  }

  // ── Network: Broadcast ──

  /**
   * Broadcast a raw transaction hex to the BSV network via WhatsOnChain.
   */
  private async broadcastTx(rawTxHex: string): Promise<string> {
    const url = this.endpoints.broadcast;
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ txhex: rawTxHex }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      let errorMessage = `Broadcast failed: ${response.status} ${response.statusText}`;
      try {
        const errorData = JSON.parse(errorText);
        if (Array.isArray(errorData.errors)) {
          errorMessage += ' — ' + errorData.errors.join(', ');
        } else if (typeof errorData === 'string') {
          errorMessage += ' — ' + errorData;
        }
      } catch {
        if (errorText) errorMessage += ' — ' + errorText;
      }
      throw new Error(errorMessage);
    }

    const data = await response.json();
    if (data.txid) return data.txid;
    if (typeof data === 'string') return data;

    // Fallback: compute txid from the raw hex
    const tx = new bsv.Transaction(rawTxHex);
    return tx.hash;
  }

  /**
   * Broadcast with exponential backoff retry.
   */
  private async broadcastWithRetry(rawTxHex: string): Promise<string> {
    let lastError: Error | null = null;

    for (let attempt = 0; attempt <= this.config.maxRetries; attempt++) {
      try {
        return await this.broadcastTx(rawTxHex);
      } catch (error) {
        lastError = error instanceof Error ? error : new Error(String(error));

        if (attempt < this.config.maxRetries) {
 const delay = this.config.retryDelay * (attempt + 1);
          await new Promise((resolve) => setTimeout(resolve, delay));
        }
      }
    }

    throw lastError ?? new Error('Failed to broadcast transaction after all retries.');
  }

  // ── Network: Transaction Retrieval ──

  /**
   * Fetch raw transaction hex from WhatsOnChain.
   */
  private async fetchRawTx(txid: string): Promise<string> {
    const url = `${this.endpoints.api}/tx/${txid}/hex`;
    const response = await fetch(url, { method: 'GET' });

    if (!response.ok) {
      throw new Error(`Failed to fetch raw transaction ${txid}: ${response.status} ${response.statusText}`);
    }

    const data = await response.text();

    // Response may be a JSON-encoded string or raw hex
    try {
      const parsed = JSON.parse(data);
      if (typeof parsed === 'string') return parsed;
      if (parsed.hex) return parsed.hex;
      if (parsed.txid) return parsed.txid;
    } catch {
      // Not JSON — return as-is (raw hex)
    }

    return data;
  }

  /**
   * Fetch transaction metadata (blockhash, confirmations, etc.) from WhatsOnChain.
   */
  private async fetchTxData(txid: string): Promise<Record<string, unknown>> {
    const url = `${this.endpoints.api}/tx/hash/${txid}`;
    const response = await fetch(url, { method: 'GET' });

    if (!response.ok) {
      throw new Error(`Failed to fetch transaction data ${txid}: ${response.status} ${response.statusText}`);
    }

    return (await response.json()) as Record<string, unknown>;
  }

  // ── Utility ──

  /**
   * Get the explorer URL for a transaction.
   */
  getExplorerUrl(txid: string): string {
    return `${this.endpoints.explorer}${txid}`;
  }
}
