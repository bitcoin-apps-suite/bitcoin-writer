# $bWriter UTXO Chain-of-Proof Specification

**Version**: 1.0
**Date**: 2026-02-25
**Status**: Draft
**Author**: b0ase

---

## Abstract

This specification defines a save model for Bitcoin Writer where each document save **spends the previous save's UTXO**, creating an unbroken on-chain chain of provenance. A document with N saves becomes a chain of N linked UTXOs — a "proof coin" whose weight reflects the accumulated work embedded in it. The chain is transferable, forkable, and tradeable on the Bitcoin Exchange (`bitcoin-exchange`).

This upgrades the existing `IntegratedWorkTreeService` from **logical version pointers** (`previousInscriptionId` metadata) to **real UTXO spend chains** where each save is a transaction that consumes its predecessor.

---

## Motivation

### Current Model (Logical Pointers)

```
Save #1:  TX_A  [funding UTXO] → [OP_RETURN: content_v1, prev: null]
Save #2:  TX_B  [funding UTXO] → [OP_RETURN: content_v2, prev: TX_A]
Save #3:  TX_C  [funding UTXO] → [OP_RETURN: content_v3, prev: TX_B]
```

Each save is an independent transaction funded from the writer's wallet. The `previousInscriptionId` field creates a metadata link but no on-chain enforcement. Anyone can claim to be a successor of any document.

### Proposed Model (UTXO Spend Chain)

```
Save #1:  TX_0  [funding UTXO] → [UTXO_0: dust + OP_RETURN(content_v1)]
Save #2:  TX_1  [UTXO_0 + fee funding] → [UTXO_1: dust + OP_RETURN(content_v2)]
Save #3:  TX_2  [UTXO_1 + fee funding] → [UTXO_2: dust + OP_RETURN(content_v3)]
```

Each save SPENDS the previous save's output. The chain is cryptographically enforced by the blockchain — you cannot insert, reorder, or fake saves without controlling the private key that locks each UTXO.

### Why This Matters

1. **Proof-of-Work-Done**: A 10,000-save PhD thesis has 10,000 linked transactions. The chain length IS the proof of effort. You cannot manufacture this cheaply.

2. **Tamper-evident**: Each TX references its parent by spending it. The chain is as immutable as the blockchain itself.

3. **Transferable ownership**: The holder of the latest UTXO controls the document. Transfer the UTXO = transfer editing rights. No database entry required.

4. **Natural valuation**: A document's embedded cost = sum of all save fees. A 10,000-save document at $0.01/save = $100 of accumulated on-chain cost. This is real, verifiable, embedded value.

5. **Exchange-ready**: The final UTXO is a tradeable asset. List it on Bitcoin Exchange, sell shares via `FileSharesData`, or mint as NFT via `HandCashNFTService`.

---

## Terminology

| Term | Definition |
|------|-----------|
| **Genesis TX** | The first save of a document. Creates UTXO_0. The genesis txid becomes the permanent document identifier. |
| **Chain UTXO** | The latest unspent output in a document's save chain. Whoever controls this UTXO can make the next save. |
| **Chain Length** | Total number of saves (transactions) in the document's history. |
| **Chain Weight** | Total accumulated fees/cost across all saves. Represents embedded economic proof-of-work. |
| **Fork TX** | A save that creates TWO chain UTXOs from one input (1-in-2-out), splitting a document into two branches. |
| **Dead Chain** | A document whose chain UTXO has been spent in a non-save transaction (e.g., accidentally swept). The chain is permanently closed. |

---

## Transaction Format

### Genesis Save (Save #1)

```
Inputs:
  [0] Funding UTXO from writer's wallet (covers dust + fee + storage)

Outputs:
  [0] Chain UTXO — 546 sats (dust limit) locked to writer's address
  [1] OP_RETURN — B:// or BCAT content payload
  [2] Change (if any) back to writer's wallet

OP_RETURN payload:
  B://  |  <content>  |  text/plain  |  UTF-8  |  <filename>
  + CHAINPROOF metadata (see below)
```

### Subsequent Save (Save #N, N > 1)

```
Inputs:
  [0] Previous chain UTXO (UTXO_{N-1}) — proves chain continuity
  [1] Funding UTXO from writer's wallet (covers dust + fee + storage)

Outputs:
  [0] New chain UTXO — 546 sats locked to writer's address (or new owner's)
  [1] OP_RETURN — B:// or BCAT content payload
  [2] Change back to writer's wallet

OP_RETURN payload:
  B://  |  <content>  |  text/plain  |  UTF-8  |  <filename>
  + CHAINPROOF metadata (see below)
```

### CHAINPROOF Metadata

Embedded in OP_RETURN alongside content, using a `MAP` (Magic Attribute Protocol) prefix:

```
MAP SET app bitcoin-writer
        type chainproof
        version <save_number>
        genesis <genesis_txid>
        prev_hash <SHA-256 of previous content>
        content_hash <SHA-256 of current content>
        author <paymail or address>
        word_count <number>
        char_count <number>
        branch <branch_name or "main">
        ts <unix_timestamp>
```

This metadata is redundant with the UTXO chain itself (which already proves ordering) but enables efficient indexing without walking the full chain.

---

## Document Identity

The **genesis txid** (`TX_0`) is the permanent, immutable identifier for a document. It replaces the current `documentId` (UUID) for on-chain identity.

```typescript
// Current (UUID-based)
documentId: "550e8400-e29b-41d4-a716-446655440000"

// Proposed (genesis txid)
documentId: "a1b2c3d4e5f6...genesis_txid"  // 64-char hex
```

The genesis txid is determined at first save and never changes, regardless of how many saves, forks, or ownership transfers occur.

---

## Content Storage

### Decision: Full Content Per Save (Not Diffs)

Each save stores the **complete document content**, not a delta from the previous version.

**Rationale:**
- Any single UTXO in the chain is a self-contained snapshot. No ancestor reconstruction needed.
- B:// and BCAT protocols already handle variable-size content efficiently.
- At $0.01/page, full-content storage is economically viable for documents up to ~100 pages.
- Diffs introduce reconstruction fragility — if any ancestor TX is pruned or unavailable, the chain breaks.
- Full content enables instant verification: hash the content, compare to `content_hash` in metadata.

**Protocol selection (unchanged from current):**
- Content < 100KB: **B://** protocol (single OP_RETURN)
- Content >= 100KB: **BCAT** protocol (chunked across multiple transactions, referenced by master TX)

For BCAT saves, the chain UTXO references the BCAT master TX. The content chunks are separate transactions linked by the master.

---

## Forking

A document can fork into two independent branches via a **Fork TX**.

### Fork Transaction Format

```
Inputs:
  [0] Previous chain UTXO (UTXO_N)
  [1] Funding UTXO (covers 2x dust + fee + storage)

Outputs:
  [0] Branch A chain UTXO — 546 sats locked to Branch A author
  [1] Branch B chain UTXO — 546 sats locked to Branch B author
  [2] OP_RETURN — fork metadata
  [3] Change

OP_RETURN:
  MAP SET app bitcoin-writer
          type chainproof_fork
          genesis <genesis_txid>
          parent_version <N>
          branch_a <branch_name_a>
          branch_b <branch_name_b>
          fork_reason <optional text>
```

After forking:
- Branch A continues by spending output [0]
- Branch B continues by spending output [1]
- Both branches share the same genesis txid but diverge from save #N
- Each branch tracks its own `branch` name in CHAINPROOF metadata

### Use Cases for Forking

1. **Collaboration divergence**: Two co-authors want to take the document in different directions
2. **Draft vs published**: Fork at save #500 — branch A becomes the "published" version, branch B continues as a working draft
3. **Translation**: Fork the English version to create a Spanish branch
4. **Derivative work**: A new author forks a Creative Commons document to create their own version

### Merge

Merging two branches back is NOT supported at the protocol level. A merge is simply a new save on one branch that incorporates content from the other. The merge is semantic (the author manually combines content), not structural (no UTXO merge TX).

---

## Authorship & Ownership

### Sequential Authorship

The address that locks the chain UTXO controls editing rights. Whoever can spend the UTXO can make the next save.

```
Save #1:   Writer A creates UTXO_0 locked to Address_A
Save #2:   Writer A spends UTXO_0, creates UTXO_1 locked to Address_A
...
Save #100: Writer A spends UTXO_99, creates UTXO_100 locked to Address_B  ← TRANSFER
Save #101: Writer B spends UTXO_100, creates UTXO_101 locked to Address_B
```

Transferring editing rights = creating a save where the new chain UTXO is locked to a different address. This is visible on-chain and recorded in CHAINPROOF metadata.

### Authorship Metadata

Each save records the author in CHAINPROOF metadata (`author` field). The chain UTXO lock script determines who CAN save; the metadata records who DID save. These should match, but the metadata is informational — the UTXO lock is authoritative.

### Read Access vs Write Access

- **Write access** (editing): Controlled by the chain UTXO. Only the key holder can save.
- **Read access** (viewing): Controlled by content encryption.
  - **Public documents**: Content stored unencrypted via B://. Anyone can read.
  - **Paid documents**: Content encrypted. Decryption key sold via `MonetizationService` (pay-per-read, shares, NFT).
  - **Private documents**: Content encrypted. Key held only by author.

---

## Trading & Monetization

### Integration with FileSharesData

The existing `MonetizationService.createFileShares()` already supports tokenized document shares. The UTXO chain model extends this:

```typescript
interface ChainProofSharesData extends FileSharesData {
  // Existing fields from FileSharesData
  documentId: string;        // Now = genesis txid
  totalShares: number;       // e.g., 100
  pricePerShare: number;     // e.g., 0.01 BSV
  authorRoyalty: number;     // e.g., 5%

  // New chain-proof fields
  chainLength: number;       // Total saves in chain
  chainWeight: number;       // Total accumulated fees (sats)
  latestUtxo: string;        // Current chain UTXO txid:vout
  latestContentHash: string; // SHA-256 of latest content
  branchCount: number;       // Number of active branches
}
```

**Shares represent read access + revenue rights.** The chain UTXO holder retains write access. Selling shares does NOT transfer editing control.

### Integration with Bitcoin Exchange

Documents list on Bitcoin Exchange as tradeable assets:

```
Trading pair:  DOC_<genesis_txid_short>/BSV
Order book:    Standard limit/market orders
Metadata:      Chain length, chain weight, word count, author, branch count
```

The exchange's `Token Registry` contract indexes documents by genesis txid. The `BWRITER/BSV` pair represents the platform token; individual documents trade as separate pairs or via the NFT marketplace.

### Composite Orders

The exchange's composite order feature enables bundled purchases:

```
Buy: 10 shares of PhD thesis (DOC_abc123)
   + $B_AI_INFERENCE (for summarization)
   + $B_STORAGE_SSD (for archival)
→ Single atomic transaction
```

---

## Service Changes

### IntegratedWorkTreeService Upgrades

The existing `createVersionWithBlockchain()` method gains UTXO chain awareness:

```typescript
interface ChainSaveOptions {
  // Existing options
  storeOnBlockchain?: boolean;
  protocol?: 'auto' | 'B' | 'D' | 'Bcat';
  encrypt?: boolean;
  createShares?: boolean;

  // New UTXO chain options
  chainUtxo?: {
    txid: string;     // Previous chain UTXO txid
    vout: number;     // Output index
    satoshis: number; // Amount (should be 546 dust)
    script: string;   // Locking script
  };
  transferTo?: string;  // If set, lock new chain UTXO to this address (ownership transfer)
  fork?: {
    branchName: string;      // Name for the new branch
    originalBranch: string;  // Name for the continuing branch
  };
}
```

### DocumentInscriptionMetadata Extensions

```typescript
interface DocumentInscriptionMetadata {
  // Existing fields (unchanged)
  title: string;
  author: string;
  version: number;
  previousInscriptionId?: string;
  genesisInscriptionId?: string;
  contentHash: string;
  wordCount: number;
  characterCount: number;
  createdAt: number;
  branchName?: string;

  // New UTXO chain fields
  chainUtxoTxid?: string;      // The chain UTXO created by this save
  chainUtxoVout?: number;      // Output index (always 0 for normal saves)
  prevContentHash?: string;    // SHA-256 of previous version's content
  chainLength?: number;        // Running count of saves
  chainWeight?: number;        // Cumulative fees in sats
  isFork?: boolean;            // True if this save is a fork TX
  forkBranches?: string[];     // Branch names created by fork
  transferredFrom?: string;    // Previous owner address (if ownership changed)
  transferredTo?: string;      // New owner address (if ownership changed)
}
```

### DocumentVersionChain Extensions

```typescript
interface DocumentVersionChain {
  // Existing fields (unchanged)
  documentId: string;          // Now = genesis txid
  versions: DocumentInscription[];
  genesisInscription?: DocumentInscription;
  isValid: boolean;

  // New UTXO chain fields
  chainUtxo?: {               // Current spendable UTXO
    txid: string;
    vout: number;
    satoshis: number;
    script: string;
  };
  chainLength: number;         // Total saves
  chainWeight: number;         // Total accumulated fees
  branches: Map<string, DocumentVersionChain>;  // Named branches
  isClosed: boolean;           // True if chain UTXO was spent outside the system
}
```

---

## Chain Verification

### Full Verification (Walk the Chain)

To fully verify a document's provenance:

1. Start from the latest chain UTXO
2. Walk backward: each TX's input [0] points to the previous save TX
3. At each step, verify:
   - The OP_RETURN contains valid CHAINPROOF metadata
   - `content_hash` matches the actual content hash
   - `prev_hash` matches the previous save's `content_hash`
   - `genesis` field matches the genesis txid
   - `version` increments by 1
4. The walk ends at the genesis TX (no chain UTXO input, only funding)
5. Chain length = number of TXs walked. Chain weight = sum of fees.

### Light Verification (Spot Check)

For quick validation without walking the full chain:

1. Fetch the latest save's CHAINPROOF metadata
2. Verify `content_hash` matches current content
3. Verify `version` (chain length) is plausible
4. Check that the chain UTXO is unspent (document is still active)
5. Optionally spot-check 2-3 random points in the chain

### SPV Proof

For exchange listing and trading, a compact SPV proof contains:
- Genesis TX header
- Latest save TX header
- Merkle proofs for both
- Chain length from CHAINPROOF metadata

This proves the document exists and has N saves without transmitting the entire chain.

---

## Economics

### Save Cost Breakdown

Each save costs:
- **Storage fee**: $0.01/page (unchanged from current pricing)
- **Miner fee**: ~1 sat/byte (~$0.0001 for a typical save TX)
- **Dust output**: 546 sats (~$0.003) — recycled into the next save's input

The dust output is NOT a cost — it's recycled. Each save spends the previous 546 sats and creates a new 546-sat output. The net cost per save is storage + miner fee only.

### Chain Weight Examples

| Document Type | Saves | Pages/Save | Storage Cost | Chain Weight |
|--------------|-------|------------|--------------|-------------|
| Blog post | 10 | 2 | $0.20 | $0.20 |
| Short story | 50 | 15 | $7.50 | $7.50 |
| Novel (draft) | 500 | 300 | $1,500 | $1,500 |
| PhD thesis | 10,000 | 200 | $20,000 | $20,000 |
| Legal contract (versioned) | 100 | 5 | $50 | $50 |

A PhD thesis with 10,000 saves at $0.01/page for 200 pages = $20,000 of embedded on-chain cost. This is the "coin weight" — a tangible measure of work that cannot be faked.

> Note: Most saves will be incremental (1-5 pages of changes even if full content is stored). Practical cost is much lower. The key insight is that chain length itself is the proof, regardless of per-save content size.

---

## Migration Path

### Phase 1: Dual Mode (Non-Breaking)

Add UTXO chain support alongside the existing logical pointer model. Existing documents continue to use `previousInscriptionId`. New documents can opt into UTXO chain mode.

```typescript
// In createVersionWithBlockchain options:
saveMode: 'legacy' | 'utxo_chain'  // Default: 'legacy' for existing docs
```

### Phase 2: New Documents Default to UTXO Chain

All new documents created after a cutoff date use UTXO chain mode by default. Legacy documents remain on logical pointers.

### Phase 3: Legacy Migration (Optional)

Existing documents can be "sealed" with a migration TX that:
1. Creates a genesis-equivalent TX referencing all existing saves
2. Begins a new UTXO chain from that point
3. The pre-migration history is preserved as metadata but not UTXO-linked

---

## Edge Cases

### Accidental UTXO Sweep

If a wallet sweeps all UTXOs (including the chain UTXO), the document chain is permanently closed. The document's content is still readable on-chain, but no new saves can be made.

**Mitigation**: The chain UTXO uses a dedicated derivation path separate from spending UTXOs. Wallet software must be aware of chain UTXOs and exclude them from sweep operations.

### Double-Save Race Condition

If two parties both attempt to spend the same chain UTXO simultaneously, only one will confirm. The other is rejected as a double-spend.

**Resolution**: This is a feature, not a bug. It enforces single-writer semantics at the protocol level. The blockchain itself arbitrates conflicts.

### Large Documents (BCAT)

For documents exceeding 100KB, content is stored via BCAT (chunked across multiple TXs). The chain UTXO TX references the BCAT master TX in its OP_RETURN. The BCAT chunks are separate transactions and do not participate in the UTXO chain — only the master reference TX is chained.

### Fee Spikes

If BSV transaction fees spike, saves become more expensive. The chain weight increases faster, but the document's value proposition (proof-of-work-done) also increases.

**Mitigation**: Batch saves locally and inscribe periodically (e.g., every 10 saves instead of every save). This reduces chain length but each inscribed save contains a hash of the 10 intermediate local saves, maintaining provenance.

---

## Relationship to Existing Services

| Service | Current Role | UTXO Chain Upgrade |
|---------|-------------|-------------------|
| `IntegratedWorkTreeService` | Git-style versioning + blockchain storage | Adds UTXO spend chain management, fork TX creation |
| `DocumentInscriptionService` | Creates inscription metadata + content hash | Adds `chainUtxoTxid`, `prevContentHash`, `chainLength`, `chainWeight` |
| `BlockchainDocumentService` | B:// / BCAT storage | Unchanged — still handles content serialization and broadcast |
| `MonetizationService` | FileShares + NFT minting | Extended with `ChainProofSharesData` — chain length/weight as valuation inputs |
| `HandCashService` | Wallet + payments | Must support UTXO selection (spend specific chain UTXO, not arbitrary) |

---

## Appendix A: Example Chain Walk

```
PhD Thesis: "On the Topology of Distributed Consensus" by Dr. Alice

Genesis (2024-01-15):
  TX_0: [wallet funding] → [UTXO_0(546 sats, addr_alice), OP_RETURN(B://abstract_v1)]
  CHAINPROOF: version=1, genesis=TX_0, content_hash=abc123, word_count=250

Save #2 (2024-01-16):
  TX_1: [UTXO_0, wallet funding] → [UTXO_1(546 sats, addr_alice), OP_RETURN(B://ch1_draft)]
  CHAINPROOF: version=2, genesis=TX_0, prev_hash=abc123, content_hash=def456, word_count=3200

... 9,998 saves over 4 years ...

Save #10,000 (2028-01-10):
  TX_9999: [UTXO_9998, wallet funding] → [UTXO_9999(546 sats, addr_alice), OP_RETURN(BCAT://final)]
  CHAINPROOF: version=10000, genesis=TX_0, prev_hash=xyz789, content_hash=final_hash, word_count=95000

Chain Weight: 10,000 TXs × ~$0.05 avg = ~$500 embedded cost
Document: 95,000 words, 380 pages, 4 years of provenance
Status: UTXO_9999 is unspent — Alice still controls the document

Alice lists on Bitcoin Exchange:
  Pair: DOC_TX0_SHORT/BSV
  Ask: 2.0 BSV ($100)
  Metadata: chain_length=10000, chain_weight=500, word_count=95000
```

---

## Appendix B: Compatibility Matrix

| Feature | Logical Pointers (Current) | UTXO Chain (Proposed) |
|---------|---------------------------|----------------------|
| Version linking | Metadata field | UTXO spend |
| Ordering guarantee | Trust metadata | Blockchain-enforced |
| Ownership transfer | Database update | UTXO transfer |
| Fork support | `createBranch()` | Fork TX (1-in-2-out) |
| Merge support | Manual | Manual (same) |
| Tradeable on exchange | Via $bWriter token | Per-document listing |
| Chain verification | Walk metadata links | Walk UTXO spends |
| Tamper resistance | Hash chain (metadata) | Hash chain + UTXO chain |
| Dead chain protection | N/A | Dedicated derivation path |
| Cost | Storage only | Storage + dust recycling |

---

*End of specification.*
