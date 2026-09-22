/**
 * Server-side HandCash Connect helpers.
 */

import { HandCashConnect } from '@handcash/handcash-connect';
import { ECIES, PrivateKey, PublicKey, Utils } from '@bsv/sdk';

let connect: HandCashConnect | null = null;

export function getHandCash(): HandCashConnect {
  const appId = process.env.HANDCASH_APP_ID || process.env.NEXT_PUBLIC_HANDCASH_APP_ID;
  const appSecret = process.env.HANDCASH_APP_SECRET;
  if (!appId || !appSecret) throw new Error('HANDCASH_APP_ID / HANDCASH_APP_SECRET are not configured');
  if (!connect) connect = new HandCashConnect({ appId, appSecret });
  return connect;
}

export function getAccount(authToken: string) {
  return getHandCash().getAccountFromAuthToken(authToken);
}

export interface UserEncryptionKeys {
  publicKey: PublicKey;
  privateKey: PrivateKey;
}

// The keypair is stable per (app, user); cache briefly to avoid a round trip on every save/open.
const keyCache = new Map<string, { keys: UserEncryptionKeys; at: number }>();
const KEY_CACHE_MS = 5 * 60 * 1000;

/**
 * Fetch the user's app-scoped encryption keypair (requires the DECRYPTION permission).
 * HandCash returns both keys ECIES-encrypted to an ephemeral public key we supply.
 * The exact ECIES variant is not documented, so we try Electrum then Bitcore and
 * accept a result only if the private key actually derives the public key.
 */
export async function getUserEncryptionKeys(authToken: string): Promise<UserEncryptionKeys> {
  const cached = keyCache.get(authToken);
  if (cached && Date.now() - cached.at < KEY_CACHE_MS) return cached.keys;

  const account = getAccount(authToken) as any;
  const ephemeral = PrivateKey.fromRandom();
  const encrypted = await account.profile.handCashConnectService.getEncryptionKeypair(
    ephemeral.toPublicKey().toString()
  );

  const decrypters = [
    (buf: number[]) => ECIES.electrumDecrypt(buf, ephemeral),
    (buf: number[]) => ECIES.bitcoreDecrypt(buf, ephemeral),
  ];

  for (const decrypt of decrypters) {
    try {
      const priv = parseKeyMaterial(decrypt(Utils.toArray(encrypted.encryptedPrivateKeyHex, 'hex')));
      const pub = parseKeyMaterial(decrypt(Utils.toArray(encrypted.encryptedPublicKeyHex, 'hex')));
      const privateKey = PrivateKey.fromString(priv, 'hex');
      const derived = privateKey.toPublicKey().toString();
      if (pub && derived !== pub.toLowerCase()) continue;
      const keys = { privateKey, publicKey: privateKey.toPublicKey() };
      keyCache.set(authToken, { keys, at: Date.now() });
      return keys;
    } catch {
      // try the next variant
    }
  }
  throw new Error('Could not decode HandCash encryption keypair (is the DECRYPTION permission enabled?)');
}

/** Decrypted key material may be raw bytes or a hex/WIF string encoded as utf8. */
function parseKeyMaterial(bytes: number[]): string {
  const text = Utils.toUTF8(bytes).trim();
  if (/^[0-9a-fA-F]+$/.test(text) && (text.length === 64 || text.length === 66 || text.length === 130)) {
    return text;
  }
  if (/^[5KL][1-9A-HJ-NP-Za-km-z]{50,51}$/.test(text)) {
    return PrivateKey.fromWif(text).toHex();
  }
  return Utils.toHex(bytes);
}
