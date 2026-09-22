/** GET — a chainproof transaction parsed from chain (public data: metadata + ciphertext). */
import { NextResponse } from 'next/server';
import { Utils } from '@bsv/sdk';
import { loadCommit } from '@/lib/writer/chain';
import { outputAddress } from '@/lib/writer/chainproof';
import { errorResponse } from '@/lib/writer/route-helpers';

export async function GET(_request: Request, { params }: { params: Promise<{ txid: string }> }) {
  const { txid } = await params;
  try {
    const commit = await loadCommit(txid);
    return NextResponse.json({
      txid: commit.txid,
      type: commit.type,
      fields: commit.fields,
      parent: commit.parent,
      chainOutputs: commit.chainOutputs.map((vout) => ({ vout, address: outputAddress(commit.tx, vout) })),
      ciphertext: commit.type === 'chainproof' ? Utils.toBase64(commit.ciphertext) : undefined,
    });
  } catch (error) {
    return errorResponse(error, 'Commit not found');
  }
}
