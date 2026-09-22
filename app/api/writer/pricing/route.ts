import { NextResponse } from 'next/server';
import { CHAIN_DUST } from '@/lib/writer/chainproof';
import { getBsvUsdRate, getFeeRate, MAX_CONTENT_BYTES, SERVICE_MARKUP } from '@/lib/writer/pricing';

export async function GET() {
  const [feeRate, bsvUsd] = await Promise.all([getFeeRate(), getBsvUsdRate()]);
  return NextResponse.json({ feeRate, serviceMarkup: SERVICE_MARKUP, chainDust: CHAIN_DUST, maxContentBytes: MAX_CONTENT_BYTES, bsvUsd });
}
