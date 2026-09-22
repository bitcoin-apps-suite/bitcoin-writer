/**
 * POST /api/writer/fork — quote or commit a fork (1-in-2-out) of a branch tip.
 * Body: { mode: 'quote' | 'commit', keyId, tip: {txid,vout}, branchA, branchB, reason?, fundId? }
 */
import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/writer/session';
import { getHandCash, getUserEncryptionKeys } from '@/lib/writer/handcash';
import { commitPrepared, prepareFork } from '@/lib/writer/chain';
import { errorResponse } from '@/lib/writer/route-helpers';

export async function POST(request: NextRequest) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: 'Not signed in' }, { status: 401 });
  const body = await request.json().catch(() => null);
  if (!body) return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });

  try {
    const { privateKey } = await getUserEncryptionKeys(session.authToken);
    const prepared = await prepareFork(session, privateKey, body);
    if (body.mode !== 'commit') {
      return NextResponse.json({ quote: prepared.quote, fundId: prepared.fundId, fundingAddress: prepared.fundingKey.toAddress() });
    }
    const result = await commitPrepared(session, prepared);
    return NextResponse.json(result, { status: result.broadcastError ? 202 : 200 });
  } catch (error) {
    const response = errorResponse(error, 'Fork failed');
    if (response.status === 402) {
      const data = await response.json();
      return NextResponse.json({ ...data, spendLimitsUrl: getHandCash().getChangeSpendLimitsUrl() }, { status: 402 });
    }
    return response;
  }
}
