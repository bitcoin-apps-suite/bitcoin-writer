/** POST — rebroadcast a signed save/fork that is still pending. */
import { NextResponse } from 'next/server';
import { getSession } from '@/lib/writer/session';
import { rebroadcast } from '@/lib/writer/chain';
import { getCommit } from '@/lib/writer/commits';
import { errorResponse } from '@/lib/writer/route-helpers';

export async function POST(_request: Request, { params }: { params: Promise<{ txid: string }> }) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: 'Not signed in' }, { status: 401 });
  const { txid } = await params;
  const row = await getCommit(txid);
  if (!row || row.author_handle !== session.handle) return NextResponse.json({ error: 'Unknown transaction' }, { status: 404 });
  try {
    await rebroadcast(txid);
    return NextResponse.json({ txid, status: 'broadcast' });
  } catch (error) {
    return errorResponse(error, 'Rebroadcast failed');
  }
}
