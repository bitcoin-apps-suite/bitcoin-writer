'use client';
/**
 * "Connect bWalletX" — sign in with bWalletX or any BRC-100 wallet (Yours, Metanet, HandCash once it
 * ships BRC-100). The picker finds the extension, a desktop wallet on localhost:3321 (`bwalletx serve`),
 * or pairs bWalletX on a phone / web.bwalletx.com by QR. The wallet signs a one-time challenge; nothing
 * is spent.
 */
import Script from 'next/script';
import { useState } from 'react';

const connector = () => (window as unknown as { bwWallet?: { signIn(): Promise<string> } }).bwWallet;

export default function WalletSignIn({ className, label = 'Connect bWalletX' }: { className?: string; label?: string }) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function signIn() {
    setError(null);
    const bw = connector();
    if (!bw) {
      setError('The wallet connector is still loading. Try again in a moment.');
      return;
    }
    setBusy(true);
    try {
      await bw.signIn();
      window.location.href = '/app';
    } catch (e) {
      const message = (e as Error).message || 'Sign-in failed';
      setError(/no wallet chosen/i.test(message) ? null : message);
      setBusy(false);
    }
  }

  return (
    <>
      <Script src="/vendor/bwalletx-connect.global.js" strategy="afterInteractive" />
      <Script src="/writer-wallet.js" strategy="afterInteractive" />
      <button type="button" className={className} onClick={signIn} disabled={busy} aria-busy={busy}>
        {busy ? 'Check your wallet…' : label}
      </button>
      {error && (
        <p role="alert" style={{ flexBasis: '100%', margin: '8px 0 0', fontSize: 14, color: '#f87171' }}>
          {error}
        </p>
      )}
    </>
  );
}
