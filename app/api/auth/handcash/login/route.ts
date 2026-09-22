import { NextResponse } from 'next/server';
import { getHandCash } from '@/lib/writer/handcash';

export async function GET() {
  try {
    // The redirect target is configured in the HandCash developer dashboard;
    // point it at /api/auth/handcash/callback (the landing page also forwards ?authToken=).
    return NextResponse.redirect(getHandCash().getRedirectionUrl());
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}
