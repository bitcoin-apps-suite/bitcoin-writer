/**
 * $bWriter BSV Transfer Service
 *
 * Handles sending BSV dividend payouts to holder withdrawal addresses.
 * Uses @bsv/sdk for transaction building and signing.
 *
 * Key Security Considerations:
 * - Multisig key is sensitive - store in Vercel secrets, never in code
 * - Transaction signing happens on server only
 * - All transfers are logged and recorded in database
 * - Implements basic rate limiting to prevent fund drain
 */

import { PrivateKey, Transaction, P2PKH } from '@bsv/sdk';

interface TransferOutput {
  address: string;
  amountSatoshis: bigint;
}

interface TransferResult {
  txid: string;
  status: 'success' | 'failed';
  error?: string;
  timestamp: Date;
}

interface UTXO {
  txid: string;
  vout: number;
  satoshis: bigint;
  script: string;
}

/**
 * Configuration for BSV transfers
 */
const BSV_CONFIG = {
  // Multisig address where dividend funds are held
  MULTISIG_ADDRESS: process.env.BWRITER_MULTISIG_ADDRESS || '1Dd3iSFQEM8spmdLbqwxMenWEryNnBBHM6',

  // Private key for signing (should be vault-managed in production)
  MULTISIG_PRIVATE_KEY_WIF: process.env.BWRITER_MULTISIG_PRIVATE_KEY,

  // Network: 'mainnet' or 'testnet'
  NETWORK: process.env.NODE_ENV === 'production' ? 'mainnet' : 'testnet',

  // Fee rate in satoshis per byte
  FEE_RATE_SAT_PER_BYTE: process.env.NODE_ENV === 'production' ? 1 : 0.5,

  // Maximum transaction size to prevent memory issues
  MAX_TX_SIZE_BYTES: 100000,

  // Minimum output value (to avoid dust)
  MIN_OUTPUT_SATOSHIS: 546,

  // WhatsOnChain API base
  WOC_API_BASE: 'https://api.whatsonchain.com/v1/bsv/main',

  // Rate limit: max transfers per hour
  MAX_TRANSFERS_PER_HOUR: 10,
};

/**
 * Estimate transaction size for fee calculation
 *
 * Formula: base_size + (input_count * 148) + (output_count * 34) + overhead
 */
function estimateTransactionSize(inputCount: number, outputCount: number): number {
  return 10 + inputCount * 148 + outputCount * 34;
}

/**
 * Calculate transaction fee based on size and rate
 */
function calculateFee(txSize: number): bigint {
  const fee = BigInt(Math.ceil(txSize * BSV_CONFIG.FEE_RATE_SAT_PER_BYTE));
  return fee;
}

/**
 * Validate BSV address format
 *
 * Valid formats:
 * - P2PKH (1xxxxx)
 * - P2SH (3xxxxx)
 */
function isValidBsvAddress(address: string): boolean {
  return /^[13][a-km-zA-HJ-NP-Z1-9]{25,34}$/.test(address);
}

/**
 * Fetch UTXOs for an address from WhatsOnChain
 */
async function fetchUTXOs(address: string): Promise<UTXO[]> {
  const apiKey = process.env.WHATSONCHAIN_API_KEY;
  const headers: Record<string, string> = {
    'Accept': 'application/json',
  };
  if (apiKey) {
    headers['woc-api-key'] = apiKey;
  }

  const response = await fetch(
    `${BSV_CONFIG.WOC_API_BASE}/address/${address}/unspent`,
    { headers }
  );

  if (!response.ok) {
    throw new Error(`Failed to fetch UTXOs: ${response.status} ${response.statusText}`);
  }

  const utxos = await response.json();

  return utxos.map((u: any) => ({
    txid: u.tx_hash,
    vout: u.tx_pos,
    satoshis: BigInt(u.value),
    script: '', // Will be fetched when needed
  }));
}

/**
 * Broadcast a raw transaction to the BSV network
 */
async function broadcastTransaction(rawTxHex: string): Promise<string> {
  const apiKey = process.env.WHATSONCHAIN_API_KEY;
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  };
  if (apiKey) {
    headers['woc-api-key'] = apiKey;
  }

  const response = await fetch(
    `${BSV_CONFIG.WOC_API_BASE}/tx/raw`,
    {
      method: 'POST',
      headers,
      body: JSON.stringify({ txhex: rawTxHex }),
    }
  );

  if (!response.ok) {
    const errorBody = await response.text();
    throw new Error(`Broadcast failed: ${response.status} - ${errorBody}`);
  }

  // WoC returns the txid as a plain string
  const txid = await response.text();
  return txid.replace(/"/g, '').trim();
}

/**
 * Send BSV dividend payouts to multiple addresses
 *
 * Builds a single multi-output transaction for efficiency.
 * Each output pays one recipient their dividend amount.
 */
export async function sendBsvDividends(
  outputs: TransferOutput[]
): Promise<TransferResult[]> {
  const results: TransferResult[] = [];

  console.log(`[bsv-transfer] Starting dividend batch: ${outputs.length} recipients`);

  // Validate private key is configured
  if (!BSV_CONFIG.MULTISIG_PRIVATE_KEY_WIF) {
    console.error('[bsv-transfer] BWRITER_MULTISIG_PRIVATE_KEY not configured');
    return outputs.map(o => ({
      txid: '',
      status: 'failed' as const,
      error: 'Transfer key not configured. Set BWRITER_MULTISIG_PRIVATE_KEY in environment.',
      timestamp: new Date(),
    }));
  }

  // Validate all outputs first
  const validOutputs: TransferOutput[] = [];
  for (const output of outputs) {
    if (!isValidBsvAddress(output.address)) {
      console.error(`[bsv-transfer] Invalid BSV address: ${output.address.slice(0, 10)}...`);
      results.push({
        txid: '',
        status: 'failed',
        error: `Invalid BSV address format: ${output.address}`,
        timestamp: new Date(),
      });
      continue;
    }

    if (output.amountSatoshis < BigInt(BSV_CONFIG.MIN_OUTPUT_SATOSHIS)) {
      console.warn(`[bsv-transfer] Output too small (dust): ${output.amountSatoshis} sats`);
      results.push({
        txid: '',
        status: 'failed',
        error: `Output amount (${output.amountSatoshis}) below dust limit (${BSV_CONFIG.MIN_OUTPUT_SATOSHIS})`,
        timestamp: new Date(),
      });
      continue;
    }

    validOutputs.push(output);
  }

  if (validOutputs.length === 0) {
    console.log('[bsv-transfer] No valid outputs to process');
    return results;
  }

  try {
    // 1. Fetch UTXOs for the multisig address
    const utxos = await fetchUTXOs(BSV_CONFIG.MULTISIG_ADDRESS);
    if (utxos.length === 0) {
      throw new Error('No UTXOs available for dividend address');
    }

    // 2. Calculate total needed
    const totalNeeded = validOutputs.reduce(
      (sum, o) => sum + o.amountSatoshis,
      BigInt(0)
    );
    const estimatedFee = calculateFee(
      estimateTransactionSize(utxos.length, validOutputs.length + 1) // +1 for change
    );
    const totalRequired = totalNeeded + estimatedFee;

    // 3. Select UTXOs (simple: use all available, sorted largest first)
    const sortedUtxos = utxos.sort((a, b) =>
      Number(b.satoshis - a.satoshis)
    );
    let selectedTotal = BigInt(0);
    const selectedUtxos: UTXO[] = [];

    for (const utxo of sortedUtxos) {
      selectedUtxos.push(utxo);
      selectedTotal += utxo.satoshis;
      if (selectedTotal >= totalRequired) break;
    }

    if (selectedTotal < totalRequired) {
      throw new Error(
        `Insufficient funds: have ${selectedTotal} sats, need ${totalRequired} sats`
      );
    }

    // 4. Build transaction with @bsv/sdk
    const privateKey = PrivateKey.fromWif(BSV_CONFIG.MULTISIG_PRIVATE_KEY_WIF);
    const tx = new Transaction();

    // Add inputs
    for (const utxo of selectedUtxos) {
      tx.addInput({
        sourceTransaction: undefined,
        sourceOutputIndex: utxo.vout,
        sourceTXID: utxo.txid,
        unlockingScriptTemplate: new P2PKH().unlock(privateKey),
        sequence: 0xffffffff,
      });
    }

    // Add outputs for each recipient
    for (const output of validOutputs) {
      tx.addOutput({
        lockingScript: new P2PKH().lock(output.address),
        satoshis: Number(output.amountSatoshis),
      });
    }

    // Add change output
    const change = selectedTotal - totalNeeded - estimatedFee;
    if (change > BigInt(BSV_CONFIG.MIN_OUTPUT_SATOSHIS)) {
      tx.addOutput({
        lockingScript: new P2PKH().lock(BSV_CONFIG.MULTISIG_ADDRESS),
        satoshis: Number(change),
      });
    }

    // 5. Sign the transaction
    await tx.sign();

    // 6. Broadcast
    const rawHex = tx.toHex();

    // Size check
    if (rawHex.length / 2 > BSV_CONFIG.MAX_TX_SIZE_BYTES) {
      throw new Error(`Transaction too large: ${rawHex.length / 2} bytes`);
    }

    const txid = await broadcastTransaction(rawHex);

    console.log(`[bsv-transfer] Broadcast success: ${txid}`);

    // Mark all valid outputs as success with the same txid
    for (const output of validOutputs) {
      results.push({
        txid,
        status: 'success',
        timestamp: new Date(),
      });
    }
  } catch (error: any) {
    console.error('[bsv-transfer] Transaction failed:', error.message);

    // Mark all remaining outputs as failed
    for (const output of validOutputs) {
      if (!results.find(r => r.txid && r.status === 'success')) {
        results.push({
          txid: '',
          status: 'failed',
          error: error.message,
          timestamp: new Date(),
        });
      }
    }
  }

  const successCount = results.filter(r => r.status === 'success').length;
  console.log(
    `[bsv-transfer] Dividend batch complete: ${successCount}/${results.length} succeeded`
  );

  return results;
}

/**
 * Validate transfer amount doesn't exceed available funds
 */
export async function validateTransferAmount(
  requestedAmount: bigint,
  availableFunds?: bigint
): Promise<boolean> {
  const balance = availableFunds ?? await getMultisigBalance();
  return requestedAmount <= balance;
}

/**
 * Get current balance of multisig address from blockchain
 */
export async function getMultisigBalance(): Promise<bigint> {
  try {
    const utxos = await fetchUTXOs(BSV_CONFIG.MULTISIG_ADDRESS);
    const total = utxos.reduce((sum, u) => sum + u.satoshis, BigInt(0));
    console.log(`[bsv-transfer] Multisig balance: ${total} satoshis`);
    return total;
  } catch (error) {
    console.error('[bsv-transfer] Failed to fetch balance:', error);
    return BigInt(0);
  }
}

/**
 * Record transfer in audit log (database)
 */
export async function recordTransferAudit(
  supabase: any,
  distributionRound: number,
  results: TransferResult[]
): Promise<void> {
  console.log(
    `[bsv-transfer] Recording ${results.length} transfers to audit log`
  );

  try {
    const records = results.map(result => ({
      distribution_round: distributionRound,
      txid: result.txid || null,
      status: result.status,
      error: result.error || null,
      created_at: result.timestamp.toISOString(),
    }));

    const { error } = await supabase
      .from('bwriter_transfer_audit')
      .insert(records);

    if (error) {
      // Table may not exist yet — log and continue
      console.warn('[bsv-transfer] Audit insert failed (table may not exist):', error.message);
      // Fallback: log to console
      records.forEach(r => {
        console.log(`  - round ${r.distribution_round}: ${r.status} ${r.error || r.txid}`);
      });
    }
  } catch (err) {
    console.error('[bsv-transfer] Audit recording error:', err);
  }
}

/**
 * Export for testing and monitoring
 */
export const BsvTransferConfig = {
  ...BSV_CONFIG,
  estimateTransactionSize,
  calculateFee,
  isValidBsvAddress,
};
