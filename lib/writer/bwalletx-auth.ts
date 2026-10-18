/**
 * "Sign in with bWalletX" (or any BRC-100 wallet): the challenge/verify protocol from
 * @bwalletx/connect (https://bwalletx.com/connect.md), server side.
 *
 * The wallet signs a one-time message with a key derived from its identity key (protocol
 * [2, 'bwallet sign in'], keyID = nonce, counterparty 'anyone'); we check the signature and sign the
 * user in as that identity key. Same message text and protocol as @bwalletx/connect, so the wallet's
 * sign-in sheet looks the same everywhere.
 *
 * Difference from the package: the nonce store is stateless. The nonce carries its own identity key
 * and expiry and is HMAC-sealed with SESSION_SECRET, so it works on serverless without a table. A
 * captured (nonce, signature) pair could be replayed until it expires (2 minutes); it only proves the
 * same wallet again, and it is bound to this origin.
 */

import { createHmac, randomBytes, timingSafeEqual } from 'crypto';
import { ProtoWallet, PublicKey, type WalletProtocol } from '@bsv/sdk';

export const LOGIN_PROTOCOL: WalletProtocol = [2, 'bwallet sign in'];
export const CHALLENGE_LIFETIME_MS = 2 * 60 * 1000;

function secret(): string {
  const s = process.env.SESSION_SECRET || process.env.HANDCASH_APP_SECRET;
  if (!s) throw new Error('SESSION_SECRET is not configured');
  return s;
}

export function isIdentityKey(x: unknown): x is string {
  if (typeof x !== 'string' || !/^0[23][0-9a-fA-F]{64}$/.test(x)) return false;
  try {
    PublicKey.fromString(x);
    return true;
  } catch {
    return false;
  }
}

/** The text the user signs (identical to @bwalletx/connect's loginMessage). */
export function loginMessage(origin: string, nonce: string, expiresAt: number): string {
  return [
    `Sign in to ${new URL(origin).host} with bWallet`,
    '',
    'This proves you hold this wallet. It does not spend anything.',
    '',
    `Origin: ${origin}`,
    `Nonce: ${nonce}`,
    `Expires: ${new Date(expiresAt).toISOString()}`,
  ].join('\n');
}

const mac = (body: string, origin: string, identityKey: string, key = secret()) =>
  createHmac('sha256', `bitcoin-writer-bwalletx-nonce:${key}`).update(`${body}|${origin}|${identityKey}`).digest('base64url').slice(0, 22);

/** Nonce = "<expiresAt base36>.<random>.<mac>" — at most 50 chars, safe as a wallet keyID. */
export function createChallenge(origin: string, identityKey: unknown, now = Date.now(), key?: string) {
  if (!isIdentityKey(identityKey)) throw new Error('identityKey must be a compressed public key (66 hex chars)');
  const ik = identityKey.toLowerCase();
  const expiresAt = now + CHALLENGE_LIFETIME_MS;
  const body = `${expiresAt.toString(36)}.${randomBytes(12).toString('base64url')}`;
  const nonce = `${body}.${mac(body, origin, ik, key)}`;
  return { nonce, message: loginMessage(origin, nonce, expiresAt), protocolID: LOGIN_PROTOCOL, keyID: nonce, expiresAt };
}

/** Returns the proven identity key (lowercase hex), or null. */
export async function verifySignIn(
  origin: string,
  input: { identityKey: unknown; nonce: unknown; signature: unknown },
  now = Date.now(),
  key?: string
): Promise<string | null> {
  const { nonce, signature } = input;
  if (typeof nonce !== 'string' || nonce.length > 64 || !isIdentityKey(input.identityKey)) return null;
  const ik = input.identityKey.toLowerCase();
  const parts = nonce.split('.');
  if (parts.length !== 3) return null;
  const body = `${parts[0]}.${parts[1]}`;
  const expected = Buffer.from(mac(body, origin, ik, key));
  const given = Buffer.from(parts[2]);
  if (expected.length !== given.length || !timingSafeEqual(expected, given)) return null;
  const expiresAt = parseInt(parts[0], 36);
  if (!Number.isFinite(expiresAt) || now > expiresAt) return null;

  if (!Array.isArray(signature) || signature.length < 8 || signature.length > 80 || !signature.every((b) => Number.isInteger(b) && b >= 0 && b <= 255)) {
    return null;
  }
  try {
    const { valid } = await new ProtoWallet('anyone').verifySignature({
      protocolID: LOGIN_PROTOCOL,
      keyID: nonce,
      counterparty: ik,
      data: Array.from(Buffer.from(loginMessage(origin, nonce, expiresAt), 'utf8')),
      signature: signature as number[],
    });
    return valid ? ik : null;
  } catch {
    return null; // @bsv/sdk throws on a bad signature
  }
}

/** This site's origin: APP_ORIGIN when set (recommended in production), else the request's own origin. */
export function appOrigin(requestUrl: string): string {
  return new URL(process.env.APP_ORIGIN || requestUrl).origin;
}
