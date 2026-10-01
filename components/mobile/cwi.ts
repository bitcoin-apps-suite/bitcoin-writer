/**
 * BRC-100 sign-in via window.CWI (injected by bWallet / Yours Wallet Mobile).
 * No keys are ever handled here: we only ask the wallet for the user's
 * public identity key and keep it in localStorage as the session marker.
 */
/** Structurally compatible with the suite's HandCashUser shape. */
export interface CWIUser {
  handle: string;
  paymail: string;
  publicKey?: string;
  avatarUrl?: string;
  displayName?: string;
}

const STORAGE_KEY = 'bwallet_cwi_user';

interface CWILike {
  getPublicKey: (args: { identityKey?: boolean }) => Promise<{ publicKey: string }>;
  isAuthenticated?: (args?: object) => Promise<{ authenticated: boolean }>;
  waitForAuthentication?: (args?: object) => Promise<{ authenticated: boolean }>;
}

export function getCWI(): CWILike | null {
  const w = window as unknown as { CWI?: CWILike };
  return w.CWI && typeof w.CWI.getPublicKey === 'function' ? w.CWI : null;
}

export function hasCWI(): boolean {
  return getCWI() !== null;
}

function toUser(publicKey: string): CWIUser {
  const short = `${publicKey.slice(0, 6)}…${publicKey.slice(-4)}`;
  return { handle: short, paymail: '', publicKey, displayName: 'bWallet' };
}

export async function signInWithCWI(): Promise<CWIUser> {
  const cwi = getCWI();
  if (!cwi) throw new Error('bWallet (window.CWI) not available');
  if (cwi.waitForAuthentication) await cwi.waitForAuthentication({});
  const { publicKey } = await cwi.getPublicKey({ identityKey: true });
  const user = toUser(publicKey);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
  return user;
}

export function getStoredCWIUser(): CWIUser | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as CWIUser) : null;
  } catch {
    return null;
  }
}
