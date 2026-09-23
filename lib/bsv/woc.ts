/**
 * WhatsOnChain helpers shared by server-side BSV code
 * (document save chains in lib/writer/).
 */

export const WOC_API_BASE = 'https://api.whatsonchain.com/v1/bsv/main';

export interface WocUTXO {
  txid: string;
  vout: number;
  satoshis: bigint;
  script: string;
}

function wocHeaders(extra: Record<string, string> = {}): Record<string, string> {
  const headers: Record<string, string> = { Accept: 'application/json', ...extra };
  if (process.env.WHATSONCHAIN_API_KEY) headers['woc-api-key'] = process.env.WHATSONCHAIN_API_KEY;
  return headers;
}

/** Fetch UTXOs for an address from WhatsOnChain */
export async function fetchUTXOs(address: string): Promise<WocUTXO[]> {
  const response = await fetch(`${WOC_API_BASE}/address/${address}/unspent`, { headers: wocHeaders() });
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

/** Fetch a raw transaction (hex) by txid */
export async function fetchRawTransaction(txid: string): Promise<string> {
  if (!/^[0-9a-f]{64}$/i.test(txid)) throw new Error('Invalid txid');
  const response = await fetch(`${WOC_API_BASE}/tx/${txid}/hex`, { headers: wocHeaders() });
  if (!response.ok) throw new Error(`Transaction ${txid.slice(0, 8)}… not found (${response.status})`);
  return (await response.text()).trim();
}

/** Broadcast a raw transaction to the BSV network; returns the txid */
export async function broadcastTransaction(rawTxHex: string): Promise<string> {
  const response = await fetch(`${WOC_API_BASE}/tx/raw`, {
    method: 'POST',
    headers: wocHeaders({ 'Content-Type': 'application/json' }),
    body: JSON.stringify({ txhex: rawTxHex }),
  });
  if (!response.ok) {
    const errorBody = await response.text();
    throw new Error(`Broadcast failed: ${response.status} - ${errorBody}`);
  }
  // WoC returns the txid as a plain string
  const txid = await response.text();
  return txid.replace(/"/g, '').trim();
}

/**
 * Network fee rate in satoshis per byte, with the same endpoint and fallback
 * as BSVStorageService.getNetworkFeeRate().
 */
export async function fetchFeeRateSatPerByte(fallback = 0.05): Promise<number> {
  try {
    const response = await fetch(`${WOC_API_BASE}/fees`, { headers: wocHeaders() });
    if (response.ok) {
      const feeData = await response.json();
      const rate = parseFloat(feeData.standard);
      if (Number.isFinite(rate) && rate > 0) return rate;
    }
  } catch {
    // fall through
  }
  return fallback;
}
