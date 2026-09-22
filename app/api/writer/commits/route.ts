import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/writer/session';
import { listCommits } from '@/lib/writer/commits';

export async function GET(request: NextRequest) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: 'Not signed in' }, { status: 401 });
  const docId = request.nextUrl.searchParams.get('docId') || undefined;
  const commits = await listCommits(session.handle, docId);
  return NextResponse.json({ commits: commits ?? [], indexAvailable: commits !== null });
}
