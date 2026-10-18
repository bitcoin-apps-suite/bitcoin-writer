/** POST /api/writer/wallet/record { txid, tx (hex: Atomic BEEF / BEEF / raw) } — index a save the wallet made. */
import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/writer/session';
import { recordWalletCommit } from '@/lib/writer/wallet-chain';
import { errorResponse } from '@/lib/writer/route-helpers';

export async function POST(request: NextRequest) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: 'Not signed in' }, { status: 401 });
  const body = await request.json().catch(() => null);
  if (!body) return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
  try {
    const result = await recordWalletCommit(session, body);
    return NextResponse.json(result, { status: result.broadcastError ? 202 : 200 });
  } catch (error) {
    return errorResponse(error, 'Could not record the save');
  }
}
