/**
 * Browser bundle (built to public/writer-wallet.js by scripts/build-wallet-client.mjs): connects a
 * BRC-100 wallet and exposes window.bwWallet to the landing page and the editor (writer-chain.js).
 *
 * Finding a wallet, in order (via @bwalletx/connect's picker, public/vendor/bwalletx-connect.global.js):
 *   1. wallets that announce themselves (bWalletX extension first, then Yours, Metanet, ...) and window.CWI
 *   2. a desktop wallet on localhost:3321 (`bwalletx serve`) or :3301
 *   3. bWalletX on a phone or web.bwalletx.com, paired by QR through the encrypted relay
 * If the picker script is missing, falls back to @bsv/sdk's WalletClient('auto').
 */

import { WalletClient, type WalletInterface } from '@bsv/sdk';
import { chainPublicKey, commitWithWallet, decryptContent, encryptContent, type WalletPlan } from '../lib/writer/wallet-tx';

interface WalletOption {
  id: string;
  kind: string;
  isBwalletX: boolean;
  connect(): Promise<{ wallet: WalletInterface | null; identityKey: string | null }>;
}

interface ConnectGlobal {
  discoverWallets(o: { probeLocal?: boolean; pairing?: () => unknown; ms?: number }): Promise<WalletOption[]>;
  pickWallet(list: WalletOption[], o?: { title?: string }): Promise<WalletOption | null>;
  pairingModal(): unknown;
}

declare global {
  interface Window {
    bWalletXConnect?: ConnectGlobal;
    bwWallet?: unknown;
  }
}

let current: { wallet: WalletInterface; identityKey: string } | null = null;

async function connect(opts: { expectIdentityKey?: string } = {}): Promise<{ wallet: WalletInterface; identityKey: string }> {
  if (current && (!opts.expectIdentityKey || current.identityKey === opts.expectIdentityKey)) return current;
  let wallet: WalletInterface | null = null;
  let identityKey: string | null = null;
  const C = window.bWalletXConnect;
  if (C) {
    const list = await C.discoverWallets({ probeLocal: true, pairing: () => C.pairingModal() });
    const only = list.filter((o: WalletOption) => o.kind !== 'pairing');
    const option = only.length === 1 && opts.expectIdentityKey ? only[0] : await C.pickWallet(list, { title: 'Connect a wallet to Bitcoin Writer' });
    if (!option) throw new Error('No wallet chosen');
    const connected = await option.connect();
    wallet = connected.wallet;
    identityKey = connected.identityKey;
  } else {
    wallet = new WalletClient('auto', window.location.host);
    identityKey = (await wallet.getPublicKey({ identityKey: true })).publicKey;
  }
  if (!wallet || !identityKey) throw new Error('That wallet does not support BRC-100');
  if (opts.expectIdentityKey && identityKey.toLowerCase() !== opts.expectIdentityKey.toLowerCase()) {
    throw new Error('This wallet is a different identity from the one you signed in with. Connect that wallet, or sign out and sign in again.');
  }
  current = { wallet, identityKey: identityKey.toLowerCase() };
  return current;
}

async function postJson(path: string, body: unknown) {
  const res = await fetch(path, { method: 'POST', credentials: 'same-origin', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw Object.assign(new Error(data.error || `Request failed (${res.status})`), data, { status: res.status });
  return data;
}

/** Sign in: the wallet signs the server's one-time challenge (spends nothing). */
async function signIn(): Promise<string> {
  const { wallet, identityKey } = await connect();
  const challenge = await postJson('/api/auth/bwalletx/challenge', { identityKey });
  const { signature } = await wallet.createSignature({
    protocolID: challenge.protocolID,
    keyID: challenge.keyID,
    counterparty: 'anyone',
    data: Array.from(new TextEncoder().encode(challenge.message)),
  });
  await postJson('/api/auth/bwalletx/verify', { identityKey, nonce: challenge.nonce, signature: Array.from(signature) });
  return identityKey;
}

const toHex = (bytes: number[]) => bytes.map((b) => b.toString(16).padStart(2, '0')).join('');

window.bwWallet = {
  connect,
  signIn,
  disconnect: () => (current = null),
  chainPublicKey: async (identityKey: string, keyId: string) => chainPublicKey((await connect({ expectIdentityKey: identityKey })).wallet, keyId),
  encrypt: async (identityKey: string, keyId: string, plaintext: Uint8Array) =>
    Uint8Array.from(await encryptContent((await connect({ expectIdentityKey: identityKey })).wallet, keyId, Array.from(plaintext))),
  decrypt: async (identityKey: string, keyId: string, ciphertext: Uint8Array) =>
    Uint8Array.from(await decryptContent((await connect({ expectIdentityKey: identityKey })).wallet, keyId, Array.from(ciphertext))),
  /** Pay + sign a planned save/fork in the wallet. Returns { txid, tx (hex) }. */
  commit: async (identityKey: string, plan: WalletPlan) => {
    const { txid, tx } = await commitWithWallet((await connect({ expectIdentityKey: identityKey })).wallet, plan);
    return { txid, tx: tx ? toHex(tx) : undefined };
  },
};
