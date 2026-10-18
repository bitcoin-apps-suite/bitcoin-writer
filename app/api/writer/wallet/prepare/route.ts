/**
 * POST /api/writer/wallet/prepare — plan a save or fork for the user's BRC-100 wallet to pay and sign.
 * Body: { kind: 'save' | 'fork', chainPublicKey, ...SaveRequest (enc: 'brc2') | ...ForkRequest }
 * Returns the outputs (in order), the previous chain UTXO + its BEEF, and the price quote in sats.
 * Nothing is spent here; the wallet's createAction does that after the user approves.
 */
import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/writer/session';
import { planWalletFork, planWalletSave } from '@/lib/writer/wallet-chain';
import { errorResponse } from '@/lib/writer/route-helpers';

export async function POST(request: NextRequest) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: 'Not signed in' }, { status: 401 });
  const body = await request.json().catch(() => null);
  if (!body) return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
  try {
    const plan = body.kind === 'fork'
      ? await planWalletFork(session, body.chainPublicKey, body)
      : await planWalletSave(session, body.chainPublicKey, body);
    return NextResponse.json({ plan }, { headers: { 'Cache-Control': 'no-store' } });
  } catch (error) {
    return errorResponse(error, 'Could not plan the save');
  }
}
