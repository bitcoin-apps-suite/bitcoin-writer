/**
 * Bitcoin Writer — marketing site
 * Copyright (C) 2025 The Bitcoin Corporation LTD
 */

import Link from 'next/link';
import { redirect } from 'next/navigation';
import { getSession } from '@/lib/writer/session';
import { CHAIN_DUST } from '@/lib/writer/chainproof';
import { getBsvUsdRate, getFeeRate, SERVICE_MARKUP, serviceFee } from '@/lib/writer/pricing';
import styles from './landing.module.css';

export const dynamic = 'force-dynamic';

const DOWNLOAD_URL =
  process.env.NEXT_PUBLIC_DESKTOP_DOWNLOAD_URL || 'https://github.com/bitcoin-apps-suite/bitcoin-writer/releases/latest';

// Rough size of a save transaction: ~6 bytes of HTML per word, plus CHAINPROOF metadata,
// two inputs and the chain/data outputs (~900 bytes).
const examples = [
  { label: 'A short note', words: 150 },
  { label: 'A 1,000-word essay', words: 1000 },
  { label: 'A 5,000-word chapter', words: 5000 },
];

function formatUsd(sats: number, rate: number | null) {
  if (!rate) return '—';
  const usd = (sats / 1e8) * rate;
  return usd < 0.01 ? `$${usd.toFixed(4)}` : `$${usd.toFixed(2)}`;
}

export default async function Home({ searchParams }: { searchParams: Promise<Record<string, string | undefined>> }) {
  const params = await searchParams;
  // HandCash may be configured to redirect back to the site root.
  if (params.authToken) redirect(`/api/auth/handcash/callback?authToken=${encodeURIComponent(params.authToken)}`);

  const [session, rate, feeRate] = await Promise.all([getSession(), getBsvUsdRate(), getFeeRate()]);
  const primaryHref = session ? '/app' : '/api/auth/handcash/login';
  const primaryLabel = session ? 'Open Bitcoin Writer' : 'Connect HandCash';

  return (
    <div className={styles.page}>
      <header className={styles.nav}>
        <div className={styles.container}>
          <Link href="/" className={styles.brand}>
            <span className={styles.mark} aria-hidden>₿</span>
            Bitcoin Writer
          </Link>
          <nav className={styles.navLinks} aria-label="Primary">
            <a href="#how">How it works</a>
            <a href="#pricing">Pricing</a>
            <a href="#desktop">Desktop</a>
            <a href={primaryHref} className={styles.navCta}>
              {session ? `@${session.handle}` : 'Sign in'}
            </a>
          </nav>
        </div>
      </header>

      <main>
        <section className={styles.hero}>
          <div className={styles.container}>
            {params.auth === 'failed' && (
              <p className={styles.notice} role="alert">HandCash sign-in didn&apos;t complete. Please try again.</p>
            )}
            <h1 className={styles.heroTitle}>
              Write privately.<br />
              <span className={styles.accent}>Keep every version on Bitcoin.</span>
            </h1>
            <p className={styles.heroSub}>
              Bitcoin Writer encrypts your document in the browser and saves it to the BSV blockchain.
              Every save spends the one before it, so your history is an unbroken chain that only you control.
              You pay only for the bytes you write.
            </p>
            <div className={styles.ctaRow}>
              <a href={primaryHref} className={styles.btnPrimary}>{primaryLabel}</a>
              <a href="#desktop" className={styles.btnGhost}>Download for desktop</a>
            </div>

            <div className={styles.frame} aria-hidden>
              <div className={styles.frameBar}>
                <span /><span /><span />
                <div className={styles.frameTitle}>Chapter 3 — Bitcoin Writer</div>
              </div>
              <div className={styles.frameBody}>
                <div className={styles.doc}>
                  <div className={styles.docTitle}>Chapter 3</div>
                  <div className={styles.line} style={{ width: '92%' }} />
                  <div className={styles.line} style={{ width: '88%' }} />
                  <div className={styles.line} style={{ width: '95%' }} />
                  <div className={styles.line} style={{ width: '61%' }} />
                  <div className={styles.lineGap} />
                  <div className={styles.line} style={{ width: '90%' }} />
                  <div className={styles.line} style={{ width: '84%' }} />
                  <div className={styles.line} style={{ width: '73%' }} />
                </div>
                <aside className={styles.history}>
                  <div className={styles.historyHead}>Work Tree · main</div>
                  {[
                    ['Tighten the opening', 'a41f…9c2e', 'HEAD'],
                    ['Add the harbour scene', '7be0…11d4', ''],
                    ['Second draft', 'c93a…0f7b', ''],
                    ['First draft', '2d18…e6a0', 'genesis'],
                  ].map(([msg, tx, tag]) => (
                    <div key={tx} className={styles.commit}>
                      <span className={styles.dot} />
                      <div>
                        <div className={styles.commitMsg}>{msg}</div>
                        <div className={styles.commitTx}>{tx}{tag && <em>{tag}</em>}</div>
                      </div>
                    </div>
                  ))}
                  <div className={styles.counter}>
                    <span>Next save</span>
                    <strong>1,284 sats</strong>
                  </div>
                </aside>
              </div>
            </div>
          </div>
        </section>

        <section id="how" className={styles.section}>
          <div className={styles.container}>
            <h2 className={styles.h2}>How it works</h2>
            <ol className={styles.steps}>
              <li>
                <span className={styles.stepNum}>01</span>
                <h3>Connect HandCash</h3>
                <p>No accounts or passwords. Your HandCash wallet is your sign-in and pays for each save. Your document keys are derived from your HandCash account, so they work on any device.</p>
              </li>
              <li>
                <span className={styles.stepNum}>02</span>
                <h3>Write, then save to chain</h3>
                <p>When a draft is worth keeping, save it with a short message. It&apos;s encrypted with AES-256 before it leaves your device, and only your HandCash account can open it.</p>
              </li>
              <li>
                <span className={styles.stepNum}>03</span>
                <h3>Browse and fork your history</h3>
                <p>Each save spends the previous save&apos;s output, so the order can&apos;t be faked. Reopen any version from the Work Tree, fork a branch from any tip, and verify the whole chain back to the first save.</p>
              </li>
            </ol>
          </div>
        </section>

        <section id="pricing" className={styles.section}>
          <div className={styles.container}>
            <div className={styles.split}>
              <div>
                <h2 className={styles.h2}>Priced by the byte</h2>
                <p className={styles.lead}>
                  No subscription. A live counter shows what the next save will cost: the miner fee for that
                  transaction, which you pay straight into your document&apos;s chain, plus a service fee of the same size.
                </p>
                <p className={styles.fine}>
                  Network fee rate {feeRate} sat/byte, service fee {SERVICE_MARKUP}× the miner fee. A new document&apos;s
                  first save also funds its {CHAIN_DUST}-sat chain UTXO.
                  {rate ? ` USD at today’s rate of $${rate.toFixed(2)}/BSV.` : ''}
                </p>
              </div>
              <table className={styles.priceTable}>
                <thead>
                  <tr><th scope="col">Save</th><th scope="col">Size</th><th scope="col">Cost</th></tr>
                </thead>
                <tbody>
                  {examples.map(({ label, words }) => {
                    const bytes = words * 6 + 900;
                    const minerSats = Math.ceil(bytes * feeRate);
                    const q = { totalSats: minerSats + serviceFee(minerSats) };
                    return (
                      <tr key={label}>
                        <td>{label}</td>
                        <td>{(bytes / 1000).toFixed(1)} kB</td>
                        <td>
                          <strong>{q.totalSats.toLocaleString()} sats</strong>
                          <span>{formatUsd(q.totalSats, rate)}</span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        <section id="desktop" className={styles.section}>
          <div className={styles.container}>
            <div className={styles.desktop}>
              <div>
                <h2 className={styles.h2}>On your desktop, too</h2>
                <p className={styles.lead}>
                  The desktop app works the same way as the web app: same editor, same HandCash sign-in, same
                  encrypted saves to chain. It adds native menus, keyboard shortcuts and saving to local files.
                </p>
              </div>
              <div className={styles.downloads}>
                <a href={DOWNLOAD_URL} className={styles.btnPrimary}>Download for macOS</a>
                <a href={DOWNLOAD_URL} className={styles.btnGhost}>Windows &amp; Linux</a>
              </div>
            </div>
          </div>
        </section>

        <section className={styles.section}>
          <div className={styles.container}>
            <h2 className={styles.h2}>Questions</h2>
            <dl className={styles.faq}>
              <div>
                <dt>Can anyone read what I publish?</dt>
                <dd>No. Titles and content are encrypted. Each save&apos;s public metadata is its version number, branch, save message, word and character counts, author paymail and timestamp.</dd>
              </div>
              <div>
                <dt>What if Bitcoin Writer goes away?</dt>
                <dd>Your saves stay on the BSV blockchain, and every key can be re-derived from your HandCash account and the document&apos;s key ID stored with each save.</dd>
              </div>
              <div>
                <dt>Should I put anything sensitive in a save message?</dt>
                <dd>No. Save messages and branch names are public so the history can be rebuilt from the chain.</dd>
              </div>
            </dl>
          </div>
        </section>

        <section className={styles.finalCta}>
          <div className={styles.container}>
            <h2 className={styles.h2}>Make your first save</h2>
            <a href={primaryHref} className={styles.btnPrimary}>{primaryLabel}</a>
          </div>
        </section>
      </main>

      <footer className={styles.footer}>
        <div className={styles.container}>
          <span>© The Bitcoin Corporation LTD · Company No. 16735102</span>
          <nav aria-label="Footer">
            <Link href="/docs">Docs</Link>
            <Link href="/bwriter/dashboard">$bWriter</Link>
            <a href="https://github.com/bitcoin-apps-suite/bitcoin-writer">GitHub</a>
          </nav>
        </div>
      </footer>
    </div>
  );
}
