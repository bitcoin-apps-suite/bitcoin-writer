-- Bitcoin Writer: index of UTXO chain-of-proof transactions (see UTXO-CHAIN-SPEC.md).
-- The chain is the source of truth: each save spends the previous chain UTXO. This table makes
-- listing documents, branches and tips fast, and keeps signed transactions for rebroadcast.

CREATE TABLE IF NOT EXISTS bwriter_commits (
  txid           TEXT PRIMARY KEY,
  type           TEXT NOT NULL CHECK (type IN ('chainproof', 'chainproof_fork')),
  doc_id         TEXT NOT NULL,             -- genesis txid (a genesis save's own txid)
  key_id         TEXT NOT NULL,             -- derives chain/content keys from the author's HandCash keypair
  version        INTEGER NOT NULL,          -- save number; for forks, the parent version
  branch         TEXT NOT NULL,             -- for forks: "branch_a,branch_b"
  message        TEXT NOT NULL DEFAULT '',
  parent_txid    TEXT,                      -- spent chain UTXO
  parent_vout    INTEGER,
  content_hash   TEXT,                      -- sha256 of ciphertext (saves only)
  author_handle  TEXT NOT NULL,
  byte_size      INTEGER NOT NULL,
  miner_sats     INTEGER NOT NULL,
  service_sats   INTEGER NOT NULL,
  funding_txid   TEXT NOT NULL,             -- the HandCash payment that funded this transaction
  raw_tx         TEXT NOT NULL,             -- signed transaction (for rebroadcast / spending before confirmation)
  status         TEXT NOT NULL DEFAULT 'broadcast' CHECK (status IN ('broadcast', 'pending')),
  created_at     TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS bwriter_commits_author_idx ON bwriter_commits (author_handle, created_at DESC);
CREATE INDEX IF NOT EXISTS bwriter_commits_doc_idx ON bwriter_commits (doc_id, created_at);
CREATE UNIQUE INDEX IF NOT EXISTS bwriter_commits_parent_idx ON bwriter_commits (parent_txid, parent_vout)
  WHERE parent_txid IS NOT NULL;           -- a chain UTXO can only be spent once

ALTER TABLE bwriter_commits ENABLE ROW LEVEL SECURITY;
-- No policies: only the service role (server API routes) reads/writes.
