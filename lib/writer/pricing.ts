/**
 * Save pricing — the counter. Same business model as BSVStorageService:
 * live network fee rate (WhatsOnChain, fallback 0.05 sat/byte) and a 2× markup on the miner fee.
 *
 *   funding  = sats the save transaction needs (miner fee, plus any new 546-sat chain outputs)
 *              → paid by the user to their own derived funding address
 *   service  = minerFee × (SERVICE_MARKUP − 1) → paid to PUBLISH_HANDCASH_DESTINATION
 *
 * BSVStorageService also charged 1.5× for encryption; every save here is encrypted, so that
 * surcharge is not applied.
 */

import { fetchFeeRateSatPerByte } from '@/lib/bsv/woc';

export const SERVICE_MARKUP = 2.0;
export const FALLBACK_SATS_PER_BYTE = 0.05;
export const MAX_CONTENT_BYTES = 1_000_000; // single B:// push; larger documents would need BCAT

export function serviceFee(minerSats: number) {
  return Math.ceil(minerSats * (SERVICE_MARKUP - 1));
}

let feeCache: { rate: number; at: number } | null = null;

export async function getFeeRate(): Promise<number> {
  if (feeCache && Date.now() - feeCache.at < 5 * 60 * 1000) return feeCache.rate;
  const rate = await fetchFeeRateSatPerByte(FALLBACK_SATS_PER_BYTE);
  feeCache = { rate, at: Date.now() };
  return rate;
}

let rateCache: { usd: number; at: number } | null = null;

export async function getBsvUsdRate(): Promise<number | null> {
  if (rateCache && Date.now() - rateCache.at < 5 * 60 * 1000) return rateCache.usd;
  try {
    const res = await fetch('https://api.whatsonchain.com/v1/bsv/main/exchangerate');
    const usd = Number((await res.json()).rate);
    if (!Number.isFinite(usd) || usd <= 0) return rateCache?.usd ?? null;
    rateCache = { usd, at: Date.now() };
    return usd;
  } catch {
    return rateCache?.usd ?? null;
  }
}
