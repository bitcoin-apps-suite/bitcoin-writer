'use client';

/**
 * /app shell: the editor (public/editor-standalone.html) plus the Work Tree drawer.
 * The drawer renders the existing WorkTreeCanvas from the document's UTXO chain
 * (bwriter_commits index + the editor's local mirror) and talks to the editor via postMessage.
 */

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import WorkTreeCanvas from '@/components/WorkTreeCanvas';
import type { DocumentInscription } from '@/types/DocumentInscription';

interface ChainCommit {
  txid: string;
  type: 'chainproof' | 'chainproof_fork';
  doc_id: string;
  key_id: string;
  version: number;
  branch: string;
  message: string;
  parent_txid: string | null;
  parent_vout: number | null;
  byte_size: number;
  miner_sats: number;
  service_sats: number;
  status: 'broadcast' | 'pending';
  created_at: string;
}

interface EditorDoc {
  id: string;
  title: string;
  chain: { keyId: string; docId: string; head: { txid: string; vout: number }; version: number; branch: string } | null;
}

interface Tip {
  txid: string;
  vout: number;
  branch: string;
  version: number;
}

const WOC_TX = 'https://whatsonchain.com/tx/';
const shortTx = (txid: string) => `${txid.slice(0, 6)}…${txid.slice(-4)}`;

/** Unspent chain UTXOs: every chain output (saves: vout 0, forks: vouts 0 and 1) not spent by another commit. */
function findTips(commits: ChainCommit[]): Tip[] {
  const spent = new Set(commits.filter((c) => c.parent_txid).map((c) => `${c.parent_txid}:${c.parent_vout}`));
  const tips: Tip[] = [];
  for (const c of commits) {
    const outputs =
      c.type === 'chainproof_fork'
        ? c.branch.split(',').map((branch, vout) => ({ vout, branch }))
        : [{ vout: 0, branch: c.branch }];
    for (const { vout, branch } of outputs) {
      if (!spent.has(`${c.txid}:${vout}`)) tips.push({ txid: c.txid, vout, branch, version: c.version });
    }
  }
  return tips;
}

function toInscription(c: ChainCommit, title: string): DocumentInscription {
  const isFork = c.type === 'chainproof_fork';
  return {
    localId: c.txid,
    inscriptionId: c.txid,
    txId: c.txid,
    content: '',
    status: c.status === 'pending' ? 'pending' : 'inscribed',
    metadata: {
      title: c.message || (isFork ? 'Fork' : `v${c.version}`),
      author: '',
      version: c.version,
      previousInscriptionId: c.parent_txid ?? undefined,
      genesisInscriptionId: c.doc_id,
      contentType: 'application/octet-stream',
      contentHash: '',
      wordCount: 0,
      characterCount: 0,
      createdAt: new Date(c.created_at).getTime(),
      isPublished: false,
      isPaid: false,
      branchName: isFork ? `fork: ${c.branch.replace(',', ' / ')}` : c.branch,
      description: title,
    },
  };
}

export default function AppShell() {
  const frameRef = useRef<HTMLIFrameElement>(null);
  const [open, setOpen] = useState(false);
  const [handle, setHandle] = useState<string | null>(null);
  const [doc, setDoc] = useState<EditorDoc | null>(null);
  const [dirty, setDirty] = useState(false);
  const [text, setText] = useState('');
  const [commits, setCommits] = useState<ChainCommit[]>([]);
  const [indexAvailable, setIndexAvailable] = useState(true);
  const [selected, setSelected] = useState<string | null>(null);
  const [verify, setVerify] = useState<string | null>(null);
  const [busy, setBusy] = useState<string | null>(null);

  const toEditor = useCallback((message: Record<string, unknown>) => {
    frameRef.current?.contentWindow?.postMessage(message, window.location.origin);
  }, []);

  useEffect(() => {
    fetch('/api/writer/me')
      .then((r) => (r.ok ? r.json() : null))
      .then((me) => me && setHandle(me.handle));
  }, []);

  useEffect(() => {
    const onMessage = (e: MessageEvent) => {
      if (e.origin !== window.location.origin || !e.data || typeof e.data.type !== 'string') return;
      if (e.data.type === 'bw:state') {
        setDoc(e.data.doc);
        setDirty(!!e.data.dirty);
        setText(e.data.text || '');
      } else if (e.data.type === 'bw:toggle-history') {
        setOpen((value) => (e.data.open ? true : !value));
      } else if (e.data.type === 'bw:committed') {
        setCommits((list) => [...list.filter((c) => c.txid !== e.data.commit.txid), e.data.commit]);
      }
    };
    window.addEventListener('message', onMessage);
    return () => window.removeEventListener('message', onMessage);
  }, []);

  const docId = doc?.chain?.docId;

  const loadCommits = useCallback(async () => {
    if (!docId) {
      setCommits([]);
      return;
    }
    let remote: ChainCommit[] = [];
    try {
      const res = await fetch(`/api/writer/commits?docId=${docId}`);
      const data = await res.json();
      remote = data.commits ?? [];
      setIndexAvailable(data.indexAvailable !== false);
    } catch {
      setIndexAvailable(false);
    }
    let mirror: ChainCommit[] = [];
    try {
      mirror = JSON.parse(localStorage.getItem(`bw-chain-v1:${handle}`) || '[]').filter((c: ChainCommit) => c.doc_id === docId);
    } catch {
      // ignore
    }
    const byTx = new Map<string, ChainCommit>();
    [...mirror, ...remote].forEach((c) => byTx.set(c.txid, { ...byTx.get(c.txid), ...c }));
    setCommits(Array.from(byTx.values()));
  }, [docId, handle]);

  useEffect(() => {
    if (open) loadCommits();
  }, [open, loadCommits]);

  const tips = useMemo(() => findTips(commits), [commits]);
  const versions = useMemo(() => commits.map((c) => toInscription(c, doc?.title ?? '')), [commits, doc?.title]);
  const currentHead = useMemo(
    () => versions.find((v) => v.txId === doc?.chain?.head.txid) ?? null,
    [versions, doc?.chain?.head.txid]
  );
  const selectedCommit = commits.find((c) => c.txid === selected) ?? null;
  const selectedTips = selectedCommit ? tips.filter((t) => t.txid === selectedCommit.txid) : [];

  /** The chain UTXO the next save should spend after opening `commit`. */
  const headFor = (commit: ChainCommit): Tip | undefined => {
    const own = tips.find((t) => t.txid === commit.txid && (commit.type !== 'chainproof_fork' || t.branch === doc?.chain?.branch)) ??
      tips.find((t) => t.txid === commit.txid);
    if (own) return own;
    const branch = commit.type === 'chainproof_fork' ? commit.branch.split(',')[0] : commit.branch;
    return tips.filter((t) => t.branch === branch).sort((a, b) => b.version - a.version)[0];
  };

  const checkout = (txid: string, newTab = false) => {
    const commit = commits.find((c) => c.txid === txid);
    if (!commit) return;
    toEditor({ type: 'bw:checkout', txid, head: headFor(commit), newTab });
  };

  const verifyChain = async () => {
    if (!doc?.chain) return;
    setVerify('Walking the chain back to genesis…');
    try {
      const res = await fetch(`/api/writer/verify/${doc.chain.head.txid}`).then((r) => r.json());
      setVerify(
        res.valid
          ? `✓ ${res.length} transaction${res.length === 1 ? '' : 's'} linked by UTXO spends back to genesis ${shortTx(res.docId)}`
          : `✗ ${res.error || (res.truncated ? 'Chain too long to verify in one pass' : 'Chain does not reach its genesis')}`
      );
    } catch (error) {
      setVerify(`✗ ${(error as Error).message}`);
    }
  };

  const rebroadcast = async (txid: string) => {
    setBusy(txid);
    try {
      const res = await fetch(`/api/writer/rebroadcast/${txid}`, { method: 'POST' });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setCommits((list) => list.map((c) => (c.txid === txid ? { ...c, status: 'broadcast' } : c)));
    } catch (error) {
      setVerify(`✗ Rebroadcast failed: ${(error as Error).message}`);
    } finally {
      setBusy(null);
    }
  };

  return (
    <div className="bw-shell">
      <iframe ref={frameRef} src="/editor-standalone.html" title="Bitcoin Writer" className="bw-shell-editor" />

      {open && (
        <section className="bw-tree" aria-label="Work Tree">
          <header className="bw-tree-head">
            <div>
              <strong>Work Tree</strong>
              <span className="bw-tree-sub">
                {doc?.chain
                  ? `${doc.title} · ${doc.chain.branch} · v${doc.chain.version} · ${tips.length} tip${tips.length === 1 ? '' : 's'}`
                  : 'This document has not been saved to chain yet'}
                {!indexAvailable && ' · index offline, showing this device’s saves'}
              </span>
            </div>
            <div className="bw-tree-actions">
              {doc?.chain && (
                <button type="button" onClick={verifyChain}>
                  Verify chain
                </button>
              )}
              <button type="button" onClick={loadCommits}>
                Refresh
              </button>
              <button type="button" onClick={() => setOpen(false)} aria-label="Close Work Tree">
                ×
              </button>
            </div>
          </header>

          <div className="bw-tree-body">
            {versions.length > 0 ? (
              <WorkTreeCanvas
                versions={versions}
                currentHead={currentHead}
                currentContent={dirty ? text : ''}
                documentTitle={doc?.title}
                selectedVersion={versions.find((v) => v.txId === selected) ?? null}
                onVersionSelect={(v) => setSelected(v.txId ?? null)}
                onVersionCheckout={(v) => v.txId && checkout(v.txId)}
              />
            ) : (
              <p className="bw-tree-empty">
                {doc?.chain ? 'Loading saves…' : 'Press ⌘S to make the genesis save. Each later save spends the one before it.'}
              </p>
            )}
          </div>

          <footer className="bw-tree-foot">
            {selectedCommit ? (
              <>
                <div className="bw-tree-detail">
                  <span className="bw-tree-msg">
                    {selectedCommit.type === 'chainproof_fork' ? 'Fork' : `v${selectedCommit.version}`} ·{' '}
                    {selectedCommit.message || 'no message'}
                  </span>
                  <a href={WOC_TX + selectedCommit.txid} target="_blank" rel="noopener noreferrer">
                    {shortTx(selectedCommit.txid)}
                  </a>
                  <span>{selectedCommit.branch.replace(',', ' / ')}</span>
                  <span>{selectedCommit.byte_size.toLocaleString()} B</span>
                  <span>{(selectedCommit.miner_sats + selectedCommit.service_sats).toLocaleString()} sats</span>
                  <span>{selectedTips.length ? 'tip' : 'spent'}</span>
                  {selectedCommit.status === 'pending' && <span className="bw-tree-pending">broadcast pending</span>}
                </div>
                <div className="bw-tree-actions">
                  <button type="button" onClick={() => checkout(selectedCommit.txid)}>
                    Open
                  </button>
                  <button type="button" onClick={() => checkout(selectedCommit.txid, true)}>
                    Open in new tab
                  </button>
                  {selectedTips.map((tip) => (
                    <button key={tip.vout} type="button" onClick={() => toEditor({ type: 'bw:fork', tip })}>
                      Fork {tip.branch}
                    </button>
                  ))}
                  {selectedCommit.status === 'pending' && (
                    <button type="button" disabled={busy === selectedCommit.txid} onClick={() => rebroadcast(selectedCommit.txid)}>
                      Rebroadcast
                    </button>
                  )}
                </div>
              </>
            ) : (
              <span className="bw-tree-hint">{verify ?? 'Click a save to inspect it · double-click to open it'}</span>
            )}
          </footer>
          {selectedCommit && verify && <div className="bw-tree-verify">{verify}</div>}
        </section>
      )}
    </div>
  );
}
