/** POST { identityKey } → a sign-in challenge for the wallet to sign. */
import { NextRequest, NextResponse } from 'next/server';
import { appOrigin, createChallenge } from '@/lib/writer/bwalletx-auth';

export async function POST(request: NextRequest) {
  const origin = appOrigin(request.url);
  if (request.headers.get('origin') !== origin) return NextResponse.json({ error: 'Bad origin' }, { status: 403 });
  const body = await request.json().catch(() => null);
  try {
    return NextResponse.json(createChallenge(origin, body?.identityKey), { headers: { 'Cache-Control': 'no-store' } });
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 400 });
  }
}
