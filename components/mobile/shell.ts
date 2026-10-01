/**
 * Mobile / bWallet shell detection (see MOBILE-BWALLET.md).
 *
 * - In-wallet mode: the page is loaded inside bWallet's in-app browser
 *   (UA contains "bWallet/"). The wallet already provides navigation, so the
 *   Bitcoin OS dock and the proof-of-concept banner are hidden.
 * - Compact mode: in-wallet OR viewport <= 768px. Desktop is untouched.
 *
 * Classes set on <html>: "bw-inwallet", "bw-compact". CSS in mobile-bwallet.css
 * keys off these so the same change works in every suite repo.
 */
import { useEffect, useState } from 'react';

export const COMPACT_MAX_WIDTH = 768;

export function isInWallet(): boolean {
  if (typeof navigator === 'undefined') return false;
  if (/\bbWallet\//.test(navigator.userAgent)) return true;
  // Allow forcing in-wallet mode for testing: ?inwallet=1
  try {
    return new URLSearchParams(window.location.search).get('inwallet') === '1';
  } catch {
    return false;
  }
}

export function isCompact(): boolean {
  if (typeof window === 'undefined') return false;
  return isInWallet() || window.innerWidth <= COMPACT_MAX_WIDTH;
}

export function applyShellClasses(): void {
  if (typeof document === 'undefined') return;
  const root = document.documentElement;
  const update = () => {
    root.classList.toggle('bw-inwallet', isInWallet());
    root.classList.toggle('bw-compact', isCompact());
  };
  update();
  window.addEventListener('resize', update);
}

/** React hook: true when dock / PoC banner should be hidden. */
export function useCompactShell(): boolean {
  const [compact, setCompact] = useState(isCompact);
  useEffect(() => {
    const onResize = () => setCompact(isCompact());
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);
  return compact;
}
