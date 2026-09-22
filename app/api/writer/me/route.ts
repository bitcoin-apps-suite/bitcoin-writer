import { NextResponse } from 'next/server';
import { getSession } from '@/lib/writer/session';

export async function GET() {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: 'Not signed in' }, { status: 401 });
  const { handle, paymail, avatarUrl, displayName } = session;
  return NextResponse.json({ handle, paymail, avatarUrl, displayName });
}
