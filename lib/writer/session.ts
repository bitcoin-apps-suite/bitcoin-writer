/**
 * Encrypted session cookie. Two kinds:
 *   - HandCash: holds the HandCash auth token (server derives keys and pays through HandCash Connect).
 *   - bWalletX / any BRC-100 wallet: holds only the wallet's identity key. The server never holds a
 *     key for these users; the wallet encrypts, derives the chain key and signs every save itself.
 * AES-256-GCM sealed with SESSION_SECRET (falls back to a hash of HANDCASH_APP_SECRET).
 */

import { createCipheriv, createDecipheriv, createHash, randomBytes } from 'crypto';
import { cookies } from 'next/headers';

export const SESSION_COOKIE = 'bw_session';
const MAX_AGE_SECONDS = 60 * 60 * 24 * 30;

export interface WriterSession {
  /** 'bwalletx' for BRC-100 wallet sessions; absent for HandCash (every session before bWalletX). */
  wallet?: 'bwalletx';
  /** BRC-100 identity key (hex). The user id for wallet sessions. */
  identityKey?: string;
  /** HandCash auth token. Empty for wallet sessions. */
  authToken: string;
  handle: string;
  paymail?: string;
  avatarUrl?: string;
  displayName?: string;
  userId?: string;
  exp: number;
}

function sessionKey(): Buffer {
  const secret = process.env.SESSION_SECRET || process.env.HANDCASH_APP_SECRET;
  if (!secret) throw new Error('SESSION_SECRET (or HANDCASH_APP_SECRET) is not configured');
  return createHash('sha256').update(`bitcoin-writer-session:${secret}`).digest();
}

export function sealSession(session: Omit<WriterSession, 'exp'>): string {
  const payload: WriterSession = { ...session, exp: Date.now() + MAX_AGE_SECONDS * 1000 };
  const iv = randomBytes(12);
  const cipher = createCipheriv('aes-256-gcm', sessionKey(), iv);
  const body = Buffer.concat([cipher.update(JSON.stringify(payload), 'utf8'), cipher.final()]);
  return Buffer.concat([iv, cipher.getAuthTag(), body]).toString('base64url');
}

export function unsealSession(value: string | undefined): WriterSession | null {
  if (!value) return null;
  try {
    const raw = Buffer.from(value, 'base64url');
    const decipher = createDecipheriv('aes-256-gcm', sessionKey(), raw.subarray(0, 12));
    decipher.setAuthTag(raw.subarray(12, 28));
    const json = Buffer.concat([decipher.update(raw.subarray(28)), decipher.final()]).toString('utf8');
    const session = JSON.parse(json) as WriterSession;
    return session.exp > Date.now() ? session : null;
  } catch {
    return null;
  }
}

export async function getSession(): Promise<WriterSession | null> {
  const store = await cookies();
  return unsealSession(store.get(SESSION_COOKIE)?.value);
}

export const sessionCookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'lax' as const,
  path: '/',
  maxAge: MAX_AGE_SECONDS,
};

export const isWalletSession = (session: WriterSession) => session.wallet === 'bwalletx';
