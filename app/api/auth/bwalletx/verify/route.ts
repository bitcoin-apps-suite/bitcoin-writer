/** POST { identityKey, nonce, signature } → signs the user in as their wallet identity key. */
import { NextRequest, NextResponse } from 'next/server';
import { appOrigin, verifySignIn } from '@/lib/writer/bwalletx-auth';
import { SESSION_COOKIE, sealSession, sessionCookieOptions } from '@/lib/writer/session';

export async function POST(request: NextRequest) {
  const origin = appOrigin(request.url);
  if (request.headers.get('origin') !== origin) return NextResponse.json({ error: 'Bad origin' }, { status: 403 });
  const body = await request.json().catch(() => null);
  const identityKey = body ? await verifySignIn(origin, body) : null;
  if (!identityKey) return NextResponse.json({ error: 'Sign-in failed' }, { status: 401 });

  const response = NextResponse.json({ identityKey });
  response.cookies.set(
    SESSION_COOKIE,
    sealSession({ wallet: 'bwalletx', identityKey, authToken: '', handle: identityKey }),
    sessionCookieOptions
  );
  return response;
}
