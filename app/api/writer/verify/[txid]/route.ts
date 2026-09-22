/**
 * GET — walk a document's chain back to genesis by following spent chain UTXOs (input 0).
 * Checks each link: the spent output is a chain output of its parent, every chain output is locked
 * to the same chain address, genesis ids agree, versions decrease by one per save, and each save's
 * prev_hash matches the content_hash before it.
 */
import { NextResponse } from 'next/server';
import { loadCommit } from '@/lib/writer/chain';
import { outputAddress, type ParsedCommit } from '@/lib/writer/chainproof';

const MAX_DEPTH = 500;

export async function GET(_request: Request, { params }: { params: Promise<{ txid: string }> }) {
  const { txid } = await params;
  const chain: { txid: string; type: string; version: number; branch: string }[] = [];
  let child: ParsedCommit | null = null;
  let chainAddress: string | null = null;

  try {
    let cursor: string | null = txid;
    while (cursor && chain.length < MAX_DEPTH) {
      const commit: ParsedCommit = await loadCommit(cursor);
      const address = outputAddress(commit.tx, commit.chainOutputs[0]);
      if (chainAddress && address !== chainAddress) return fail(`Chain address changes at ${cursor}`);
      chainAddress = address;

      if (child) {
        if (!child.parent || child.parent.txid !== commit.txid || !commit.chainOutputs.includes(child.parent.vout)) {
          return fail(`${child.txid} does not spend a chain output of ${commit.txid}`);
        }
        const childGenesis = child.fields.genesis;
        const genesis = commit.type === 'chainproof' ? commit.fields.genesis ?? commit.txid : commit.fields.genesis;
        if (childGenesis !== genesis) return fail(`Genesis mismatch at ${child.txid}`);
        if (child.type === 'chainproof' && commit.type === 'chainproof') {
          if (child.fields.version !== commit.fields.version + 1) return fail(`Version gap at ${child.txid}`);
          if (child.fields.prev_hash !== commit.fields.content_hash) return fail(`prev_hash mismatch at ${child.txid}`);
        }
      }

      chain.push({
        txid: commit.txid,
        type: commit.type,
        version: commit.type === 'chainproof' ? commit.fields.version : commit.fields.parent_version,
        branch: commit.type === 'chainproof' ? commit.fields.branch : `${commit.fields.branch_a},${commit.fields.branch_b}`,
      });
      child = commit;
      cursor = commit.parent?.txid ?? null;
    }

    const genesisReached = !cursor && child?.type === 'chainproof' && child.fields.version === 1;
    return NextResponse.json({ valid: genesisReached, truncated: !!cursor, docId: child?.txid, chainAddress, length: chain.length, chain });
  } catch (error) {
    return fail((error as Error).message);
  }

  function fail(error: string) {
    return NextResponse.json({ valid: false, error, chain });
  }
}
