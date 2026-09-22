/**
 * Bitcoin Writer — saves as a UTXO chain-of-proof (UTXO-CHAIN-SPEC.md).
 *
 * Every save spends the previous save's chain UTXO. Content is encrypted here with an AES-256-GCM key
 * derived from the user's HandCash keypair (per document `key_id`); the server builds the transaction,
 * HandCash pays for it, and the history graph (WorkTreeCanvas, rendered by /app) reads the chain index.
 *
 * Talks to the /app shell via postMessage:
 *   editor → shell: bw:state { doc, dirty }, bw:toggle-history, bw:committed
 *   shell → editor: bw:checkout { txid, vout?, branch? }, bw:fork { tip }, bw:refresh
 */
(function () {
  'use strict';

  const WOC_TX = 'https://whatsonchain.com/tx/';

  const state = { user: null, pricing: null };

  // ---------- utils ----------

  const $ = (sel, root = document) => root.querySelector(sel);
  const enc = new TextEncoder();
  const dec = new TextDecoder();

  const b64 = (bytes) => {
    let s = '';
    const arr = new Uint8Array(bytes);
    for (let i = 0; i < arr.length; i += 0x8000) s += String.fromCharCode.apply(null, arr.subarray(i, i + 0x8000));
    return btoa(s);
  };
  const unb64 = (str) => Uint8Array.from(atob(str), (c) => c.charCodeAt(0));
  const hex = (bytes) => Array.from(bytes, (b) => b.toString(16).padStart(2, '0')).join('');
  const shortTx = (txid) => (txid ? `${txid.slice(0, 6)}…${txid.slice(-4)}` : '');
  const escapeHtml = (text) => {
    const div = document.createElement('div');
    div.textContent = text == null ? '' : String(text);
    return div.innerHTML;
  };

  async function sha256Hex(text) {
    return hex(new Uint8Array(await crypto.subtle.digest('SHA-256', enc.encode(text))));
  }

  async function api(path, options = {}) {
    const res = await fetch(path, {
      credentials: 'same-origin',
      headers: options.body ? { 'Content-Type': 'application/json' } : undefined,
      ...options,
    });
    const data = await res.json().catch(() => ({}));
    if (res.status === 401) {
      window.top.location.href = '/';
      throw new Error('Not signed in');
    }
    if (!res.ok) {
      const err = new Error(data.error || `Request failed (${res.status})`);
      Object.assign(err, data, { status: res.status });
      throw err;
    }
    return { ...data, httpStatus: res.status };
  }

  function formatSats(sats) {
    const rate = state.pricing && state.pricing.bsvUsd;
    const usd = rate ? (sats / 1e8) * rate : null;
    const usdText =
      usd == null ? '' : usd < 0.0001 ? ' · <$0.0001' : usd < 0.01 ? ` · $${usd.toFixed(4)}` : ` · $${usd.toFixed(2)}`;
    return `${sats.toLocaleString()} sats${usdText}`;
  }

  function toast(html, kind = 'info', ms = 6000) {
    const el = document.createElement('div');
    el.className = `bw-toast bw-toast-${kind}`;
    el.innerHTML = html;
    document.body.appendChild(el);
    requestAnimationFrame(() => el.classList.add('bw-show'));
    setTimeout(() => {
      el.classList.remove('bw-show');
      setTimeout(() => el.remove(), 300);
    }, ms);
  }

  const toShell = (message) => {
    if (window.parent !== window) window.parent.postMessage(message, window.location.origin);
  };

  // ---------- documents ----------

  const tabs = () => window.documentTabsManager;
  const editorEl = () => document.getElementById('editor');

  function currentDoc() {
    const manager = tabs();
    if (!manager) return null;
    manager.saveCurrentDocument();
    return manager.getCurrentDocument();
  }

  function editorHtml() {
    const editor = editorEl();
    if (!editor) return '';
    const clone = editor.cloneNode(true);
    const placeholder = clone.querySelector('#animatedPlaceholder');
    if (placeholder) placeholder.remove();
    return clone.innerHTML.trim();
  }

  const docHash = (title) => sha256Hex(editorHtml() + '\u0000' + title);

  async function isDirty(doc) {
    return !doc.chain || !doc.chain.head || (await docHash(doc.title)) !== doc.chain.headHash;
  }

  // Local mirror of the chain index, used when the server index is unavailable.
  const mirrorKey = () => `bw-chain-v1:${state.user ? state.user.handle : 'anon'}`;
  function readMirror() {
    try {
      return JSON.parse(localStorage.getItem(mirrorKey()) || '[]');
    } catch {
      return [];
    }
  }
  function writeMirror(commit) {
    const commits = readMirror().filter((c) => c.txid !== commit.txid);
    commits.push(commit);
    localStorage.setItem(mirrorKey(), JSON.stringify(commits));
  }

  // ---------- keys & encryption ----------

  const keyCache = new Map();
  async function contentKey(keyId) {
    if (!keyCache.has(keyId)) {
      const { key } = await api(`/api/writer/key/${keyId}`);
      keyCache.set(keyId, crypto.subtle.importKey('raw', unb64(key), 'AES-GCM', false, ['encrypt', 'decrypt']));
    }
    return keyCache.get(keyId);
  }

  async function encryptDoc(keyId, title, html) {
    const iv = crypto.getRandomValues(new Uint8Array(12));
    const plaintextHash = await sha256Hex(html);
    const body = enc.encode(JSON.stringify({ v: 1, title, html, sha256: plaintextHash }));
    const ciphertext = new Uint8Array(await crypto.subtle.encrypt({ name: 'AES-GCM', iv }, await contentKey(keyId), body));
    return { iv: b64(iv), ciphertext: b64(ciphertext), bytes: ciphertext.length };
  }

  async function decryptCommit(txid) {
    let commit = await api(`/api/writer/commit/${txid}`);
    // A fork carries no content: open the save it split from.
    if (commit.type === 'chainproof_fork') commit = await api(`/api/writer/commit/${commit.parent.txid}`);
    const key = await contentKey(commit.fields.key_id);
    const plain = await crypto.subtle.decrypt({ name: 'AES-GCM', iv: unb64(commit.fields.iv) }, key, unb64(commit.ciphertext));
    const body = JSON.parse(dec.decode(plain));
    return { commit, title: body.title, html: body.html };
  }

  // ---------- counter ----------

  function estimate(doc) {
    const p = state.pricing;
    if (!p || !doc) return null;
    const isGenesis = !(doc.chain && doc.chain.head);
    const plaintext = enc.encode(JSON.stringify({ v: 1, title: doc.title, html: editorHtml(), sha256: 'x'.repeat(64) })).length;
    // ciphertext + GCM tag, B:// + CHAINPROOF pushes (~520 B), inputs (148 B each), outputs, tx overhead
    const bytes = plaintext + 16 + 520 + (isGenesis ? 148 : 296) + 34 * 2 + 10;
    const minerSats = Math.ceil((bytes + 4) * p.feeRate);
    const fundingSats = minerSats + (isGenesis ? p.chainDust : 0);
    const serviceSats = Math.ceil(minerSats * (p.serviceMarkup - 1));
    return { bytes, minerSats, fundingSats, serviceSats, totalSats: fundingSats + serviceSats };
  }

  let counterTimer = null;
  function scheduleUpdate() {
    clearTimeout(counterTimer);
    counterTimer = setTimeout(async () => {
      const doc = currentDoc();
      if (!doc) return;
      const el = document.getElementById('estimated-cost');
      const q = estimate(doc);
      if (el && q) {
        el.textContent = `≈ ${formatSats(q.totalSats)}`;
        el.title = `≈ ${q.bytes.toLocaleString()} bytes · ${q.minerSats} sats miner fee + ${q.serviceSats} sats service` +
          (doc.chain && doc.chain.head ? '' : ` + ${state.pricing.chainDust} sats chain UTXO`);
      }
      const dirty = await isDirty(doc);
      refreshStatus(doc, dirty);
      toShell({ type: 'bw:state', doc: { id: doc.id, title: doc.title, chain: doc.chain || null }, dirty, text: editorEl().innerText });
    }, 250);
  }

  function refreshStatus(doc, dirty) {
    const el = document.getElementById('bwCommitStatus');
    if (!el) return;
    const chain = doc.chain;
    if (!chain || !chain.head) {
      el.innerHTML = '<span class="bw-pill">Not saved to chain</span>';
      return;
    }
    el.innerHTML =
      `<span class="bw-pill">${escapeHtml(chain.branch)}</span> v${chain.version} ` +
      `<a href="${WOC_TX + chain.head.txid}" target="_blank" rel="noopener">${shortTx(chain.head.txid)}</a>` +
      (dirty ? ' <span class="bw-dirty">● unsaved changes</span>' : ' <span class="bw-clean">✓ on chain</span>');
  }

  // ---------- modal ----------

  function modal(id, title, bodyHtml, footerHtml) {
    closeModal(id);
    const wrap = document.createElement('div');
    wrap.id = id;
    wrap.className = 'bw-modal';
    wrap.innerHTML = `
      <div class="bw-dialog" role="dialog" aria-modal="true" aria-labelledby="${id}-title">
        <div class="bw-dialog-head">
          <h2 id="${id}-title">${title}</h2>
          <button class="bw-icon-btn" data-close aria-label="Close">×</button>
        </div>
        <div class="bw-dialog-body">${bodyHtml}</div>
        ${footerHtml ? `<div class="bw-dialog-foot">${footerHtml}</div>` : ''}
      </div>`;
    wrap.addEventListener('click', (e) => {
      if (e.target === wrap || e.target.closest('[data-close]')) closeModal(id);
    });
    wrap.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') closeModal(id);
    });
    document.body.appendChild(wrap);
    return wrap;
  }

  function closeModal(id) {
    const el = document.getElementById(id);
    if (el) el.remove();
  }

  function priceRows(quote) {
    return `
      <div class="bw-price">
        <div><span>Miner fee</span><span>${formatSats(quote.minerSats)}</span></div>
        ${quote.fundingSats > quote.minerSats ? `<div><span>New chain UTXO${quote.fundingSats - quote.minerSats > 546 ? 's' : ''}</span><span>${formatSats(quote.fundingSats - quote.minerSats)}</span></div>` : ''}
        <div><span>Service fee</span><span>${formatSats(quote.serviceSats)}</span></div>
        <div class="bw-total"><span>Total · ${quote.bytes.toLocaleString()} byte transaction</span><span>${formatSats(quote.totalSats)}</span></div>
      </div>`;
  }

  function paymentError(error) {
    return (
      escapeHtml(error.message) +
      (error.spendLimitsUrl ? ` <a href="${error.spendLimitsUrl}" target="_blank" rel="noopener">Adjust HandCash spend limits</a>` : '')
    );
  }

  // ---------- save ----------

  async function openSaveModal() {
    const doc = currentDoc();
    if (!doc) return;
    if (!(editorEl().textContent || '').trim()) {
      toast('Write something before saving to chain.', 'warn');
      return;
    }
    if (doc.chain && doc.chain.head && !(await isDirty(doc))) {
      toast('No changes since the last save.', 'info', 3000);
      return;
    }

    const chain = doc.chain || {};
    const isGenesis = !chain.head;
    const keyId = chain.keyId || hex(crypto.getRandomValues(new Uint8Array(16)));

    const m = modal(
      'bwSaveModal',
      isGenesis ? 'Save to chain · new document' : `Save to chain · v${chain.version + 1}`,
      `
      <label class="bw-field">
        <span>Message <small>public</small></span>
        <input id="bwMessage" type="text" maxlength="280" placeholder="e.g. Tighten the opening" autocomplete="off" />
      </label>
      ${isGenesis ? `
      <label class="bw-field">
        <span>Branch <small>public</small></span>
        <input id="bwBranch" type="text" maxlength="64" value="main" />
      </label>` : ''}
      <dl class="bw-facts">
        <div><dt>Spends</dt><dd>${isGenesis ? 'Nothing — this save is the genesis' : `<a href="${WOC_TX + chain.head.txid}" target="_blank" rel="noopener">${shortTx(chain.head.txid)}:${chain.head.vout}</a> (${escapeHtml(chain.branch)})`}</dd></div>
        <div><dt>Encryption</dt><dd>AES-256-GCM · key derived from @${escapeHtml(state.user.handle)}</dd></div>
      </dl>
      <div id="bwQuote"><p class="bw-muted">Encrypting and pricing…</p></div>
      <p class="bw-error" id="bwError" hidden></p>`,
      `<button class="bw-btn" data-close>Cancel</button>
       <button class="bw-btn bw-btn-primary" id="bwConfirm" disabled>Pay &amp; save with HandCash</button>`
    );
    $('#bwMessage', m).focus();

    const errorEl = $('#bwError', m);
    const button = $('#bwConfirm', m);
    let payload;

    try {
      const html = editorHtml();
      const encrypted = await encryptDoc(keyId, doc.title, html);
      const text = editorEl().innerText || '';
      payload = {
        keyId,
        prev: chain.head || null,
        iv: encrypted.iv,
        ciphertext: encrypted.ciphertext,
        wordCount: text.trim() ? text.trim().split(/\s+/).length : 0,
        charCount: text.length,
        html,
      };
    } catch (error) {
      $('#bwQuote', m).innerHTML = '';
      errorEl.hidden = false;
      errorEl.innerHTML = paymentError(error);
      return;
    }

    const fields = () => {
      const branchInput = $('#bwBranch', m);
      return {
        message: $('#bwMessage', m).value.trim(),
        branch: branchInput ? branchInput.value.trim() || 'main' : undefined,
      };
    };

    // The message and branch name are part of the transaction, so re-price as they change.
    let quoteSeq = 0;
    const requote = async () => {
      const seq = ++quoteSeq;
      button.disabled = true;
      try {
        const { quote, fundId } = await api('/api/writer/save', {
          method: 'POST',
          body: JSON.stringify({ ...payload, html: undefined, ...fields(), mode: 'quote', fundId: payload.fundId }),
        });
        if (seq !== quoteSeq) return;
        payload.fundId = fundId;
        $('#bwQuote', m).innerHTML = priceRows(quote);
        errorEl.hidden = true;
        button.disabled = false;
      } catch (error) {
        if (seq !== quoteSeq) return;
        $('#bwQuote', m).innerHTML = '';
        errorEl.hidden = false;
        errorEl.innerHTML = paymentError(error);
      }
    };
    let requoteTimer = null;
    m.addEventListener('input', () => {
      button.disabled = true;
      clearTimeout(requoteTimer);
      requoteTimer = setTimeout(requote, 400);
    });
    await requote();

    const confirm = async () => {
      if (button.disabled) return;
      button.disabled = true;
      button.textContent = 'Waiting for HandCash…';
      errorEl.hidden = true;
      try {
        const result = await api('/api/writer/save', {
          method: 'POST',
          body: JSON.stringify({ ...payload, html: undefined, ...fields(), mode: 'commit' }),
        });
        const c = result.commit;
        doc.chain = {
          keyId,
          docId: c.doc_id,
          head: { txid: c.txid, vout: 0 },
          version: c.version,
          branch: c.branch,
          headHash: await sha256Hex(payload.html + '\u0000' + doc.title),
        };
        doc.isDirty = false;
        writeMirror(c);
        tabs().persist();
        closeModal('bwSaveModal');
        toast(
          result.broadcastError
            ? `Paid and signed, but broadcast is pending: ${escapeHtml(result.broadcastError)}. It will be retried from History.`
            : `Saved v${c.version} on <em>${escapeHtml(c.branch)}</em> · <a href="${WOC_TX + c.txid}" target="_blank" rel="noopener">${shortTx(c.txid)}</a> · ${formatSats(result.quote.totalSats)}`,
          result.broadcastError ? 'warn' : 'ok',
          8000
        );
        toShell({ type: 'bw:committed', commit: c });
        scheduleUpdate();
      } catch (error) {
        errorEl.hidden = false;
        errorEl.innerHTML = paymentError(error);
        button.disabled = false;
        button.textContent = 'Pay & save with HandCash';
      }
    };
    button.addEventListener('click', confirm);
    m.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' && e.target.tagName === 'INPUT') confirm();
    });
  }

  // ---------- fork ----------

  async function openForkModal(tip) {
    const doc = currentDoc();
    const chain = doc && doc.chain;
    if (!chain || !chain.keyId) return;

    const m = modal(
      'bwForkModal',
      'Fork branch',
      `
      <p class="bw-muted">A fork spends <a href="${WOC_TX + tip.txid}" target="_blank" rel="noopener">${shortTx(tip.txid)}:${tip.vout}</a> into two chain UTXOs, so both branches can keep saving from here.</p>
      <div class="bw-row">
        <label class="bw-field"><span>Continue as <small>public</small></span><input id="bwBranchA" type="text" maxlength="64" value="${escapeHtml(tip.branch || chain.branch)}" /></label>
        <label class="bw-field"><span>New branch <small>public</small></span><input id="bwBranchB" type="text" maxlength="64" placeholder="alt-ending" /></label>
      </div>
      <label class="bw-field"><span>Reason <small>public, optional</small></span><input id="bwReason" type="text" maxlength="140" /></label>
      <div id="bwQuote"></div>
      <p class="bw-error" id="bwError" hidden></p>`,
      `<button class="bw-btn" data-close>Cancel</button>
       <button class="bw-btn" id="bwPrice">Get price</button>
       <button class="bw-btn bw-btn-primary" id="bwConfirm" disabled>Pay &amp; fork with HandCash</button>`
    );
    $('#bwBranchB', m).focus();
    const errorEl = $('#bwError', m);
    const body = () => ({
      keyId: chain.keyId,
      tip: { txid: tip.txid, vout: tip.vout },
      branchA: $('#bwBranchA', m).value.trim(),
      branchB: $('#bwBranchB', m).value.trim(),
      reason: $('#bwReason', m).value.trim(),
    });
    let fundId = null;

    $('#bwPrice', m).addEventListener('click', async () => {
      errorEl.hidden = true;
      try {
        const res = await api('/api/writer/fork', { method: 'POST', body: JSON.stringify({ ...body(), mode: 'quote' }) });
        fundId = res.fundId;
        $('#bwQuote', m).innerHTML = priceRows(res.quote);
        $('#bwConfirm', m).disabled = false;
      } catch (error) {
        errorEl.hidden = false;
        errorEl.innerHTML = paymentError(error);
      }
    });
    m.addEventListener('input', () => ($('#bwConfirm', m).disabled = true));

    $('#bwConfirm', m).addEventListener('click', async () => {
      const button = $('#bwConfirm', m);
      button.disabled = true;
      button.textContent = 'Waiting for HandCash…';
      try {
        const { branchA, branchB } = body();
        const result = await api('/api/writer/fork', { method: 'POST', body: JSON.stringify({ ...body(), mode: 'commit', fundId }) });
        writeMirror(result.commit);
        // Keep editing on the new branch; the other branch's tip is vout 0.
        if (chain.head && chain.head.txid === tip.txid && chain.head.vout === tip.vout) {
          doc.chain = { ...chain, head: { txid: result.commit.txid, vout: 1 }, branch: branchB };
          tabs().persist();
        }
        closeModal('bwForkModal');
        toast(`Forked into <em>${escapeHtml(branchA)}</em> and <em>${escapeHtml(branchB)}</em> · <a href="${WOC_TX + result.commit.txid}" target="_blank" rel="noopener">${shortTx(result.commit.txid)}</a>`, 'ok', 8000);
        toShell({ type: 'bw:committed', commit: result.commit });
        scheduleUpdate();
      } catch (error) {
        errorEl.hidden = false;
        errorEl.innerHTML = paymentError(error);
        button.disabled = false;
        button.textContent = 'Pay & fork with HandCash';
      }
    });
  }

  // ---------- checkout ----------

  /**
   * Open a version from chain. `head` is the unspent chain UTXO the next save will spend — the
   * version's own output if it's a branch tip, otherwise the tip of its branch (so saving an older
   * version restores it on top of that branch).
   */
  async function checkout(txid, head, { newTab = false } = {}) {
    const manager = tabs();
    let doc = currentDoc();
    if (!newTab && doc && doc.chain && doc.chain.head && (await isDirty(doc))) {
      if (!confirm('This tab has unsaved changes. Replace them with the selected version?')) return;
    }
    toast('Decrypting from chain…', 'info', 2000);
    try {
      const { commit, title, html } = await decryptCommit(txid);
      const docId = commit.fields.genesis || commit.txid;
      if (newTab || !doc || (doc.chain && doc.chain.docId && doc.chain.docId !== docId)) {
        manager.createNewDocument(title);
        doc = manager.getCurrentDocument();
      }
      doc.title = title;
      doc.content = html;
      manager.renameTab(doc.id, title);
      manager.switchToDocument(doc.id);

      const target = head || { txid: commit.txid, vout: 0, branch: commit.fields.branch, version: commit.fields.version };
      doc.chain = {
        keyId: commit.fields.key_id,
        docId,
        head: { txid: target.txid, vout: target.vout },
        version: target.version,
        branch: target.branch,
        // Only "clean" if the editor now holds the head's own content.
        headHash: target.txid === commit.txid ? await docHash(title) : null,
      };
      doc.isDirty = false;
      manager.persist();
      scheduleUpdate();
      toast(
        target.txid === commit.txid
          ? `Opened v${commit.fields.version} on <em>${escapeHtml(commit.fields.branch)}</em>.`
          : `Opened v${commit.fields.version}. Saving will restore it as the next version on <em>${escapeHtml(target.branch)}</em>.`,
        'ok',
        5000
      );
    } catch (error) {
      toast(`Couldn't open ${shortTx(txid)}: ${escapeHtml(error.message)}`, 'error');
    }
  }

  function openFromChain() {
    const txid = (prompt('Save transaction ID (txid):') || '').trim().toLowerCase();
    if (!txid) return;
    if (!/^[0-9a-f]{64}$/.test(txid)) {
      toast('That is not a valid txid.', 'warn');
      return;
    }
    checkout(txid, null, { newTab: true });
  }

  // ---------- chrome & wiring ----------

  function mountChrome() {
    const menuBar = document.querySelector('.browser-menu-bar');
    if (menuBar && !document.getElementById('bwUser')) {
      const user = document.createElement('div');
      user.id = 'bwUser';
      user.className = 'bw-user';
      user.innerHTML = `
        ${state.user.avatarUrl ? `<img src="${escapeHtml(state.user.avatarUrl)}" alt="" width="18" height="18" />` : ''}
        <span>@${escapeHtml(state.user.handle)}</span>
        <form method="post" action="/api/auth/logout" target="_top"><button type="submit">Sign out</button></form>`;
      menuBar.appendChild(user);
    }
    const statusLeft = document.querySelector('.status-left');
    if (statusLeft && !document.getElementById('bwCommitStatus')) {
      const status = document.createElement('div');
      status.className = 'status-item';
      status.id = 'bwCommitStatus';
      statusLeft.insertBefore(status, statusLeft.children[1] || null);
    }
  }

  function bindShortcuts() {
    document.addEventListener(
      'keydown',
      (e) => {
        const mod = e.metaKey || e.ctrlKey;
        if (mod && !e.shiftKey && e.key.toLowerCase() === 's') {
          e.preventDefault();
          e.stopImmediatePropagation();
          openSaveModal();
        } else if (mod && e.shiftKey && e.key.toLowerCase() === 'h') {
          e.preventDefault();
          toShell({ type: 'bw:toggle-history' });
        }
      },
      true
    );
  }

  window.addEventListener('message', (e) => {
    if (e.origin !== window.location.origin || !e.data || typeof e.data.type !== 'string') return;
    const { type } = e.data;
    if (type === 'bw:checkout') checkout(e.data.txid, e.data.head || null, { newTab: !!e.data.newTab });
    else if (type === 'bw:fork') openForkModal(e.data.tip);
    else if (type === 'bw:save') openSaveModal();
    else if (type === 'bw:refresh') scheduleUpdate();
  });

  async function init() {
    try {
      state.user = (await api('/api/writer/me'));
    } catch {
      return; // api() already redirects on 401
    }
    try {
      state.pricing = await api('/api/writer/pricing');
    } catch (error) {
      console.error('Pricing unavailable:', error);
    }
    mountChrome();
    bindShortcuts();
    const editor = editorEl();
    if (editor) editor.addEventListener('input', scheduleUpdate);
    document.addEventListener('bw:document-switched', scheduleUpdate);
    scheduleUpdate();
  }

  window.bitcoinWriter = {
    openSaveModal,
    openFromChain,
    checkout,
    openHistory: () => toShell({ type: 'bw:toggle-history', open: true }),
    readMirror,
  };

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
