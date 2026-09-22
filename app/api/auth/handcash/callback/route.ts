import { NextRequest, NextResponse } from 'next/server';
import { getAccount } from '@/lib/writer/handcash';
import { SESSION_COOKIE, sealSession, sessionCookieOptions } from '@/lib/writer/session';

export async function GET(request: NextRequest) {
  const authToken = request.nextUrl.searchParams.get('authToken');
  if (!authToken) return NextResponse.redirect(new URL('/?auth=missing', request.url));

  try {
    const { publicProfile } = await getAccount(authToken).profile.getCurrentProfile();
    const response = NextResponse.redirect(new URL('/app', request.url));
    response.cookies.set(
      SESSION_COOKIE,
      sealSession({
        authToken,
        handle: publicProfile.handle,
        paymail: publicProfile.paymail,
        avatarUrl: publicProfile.avatarUrl,
        displayName: publicProfile.displayName,
        userId: (publicProfile as any).id,
      }),
      sessionCookieOptions
    );
    return response;
  } catch (error) {
    console.error('[auth] HandCash callback failed:', error);
    return NextResponse.redirect(new URL('/?auth=failed', request.url));
  }
}
