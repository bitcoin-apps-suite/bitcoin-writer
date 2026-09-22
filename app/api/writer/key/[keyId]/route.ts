/** GET — the signed-in user's AES-256-GCM content key for a document (derived from their HandCash keypair). */
import { NextResponse } from 'next/server';
import { Utils } from '@bsv/sdk';
import { getSession } from '@/lib/writer/session';
import { getUserEncryptionKeys } from '@/lib/writer/handcash';
import { documentKeys, KEY_ID_PATTERN } from '@/lib/writer/keys';
import { errorResponse } from '@/lib/writer/route-helpers';

export async function GET(_request: Request, { params }: { params: Promise<{ keyId: string }> }) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: 'Not signed in' }, { status: 401 });
  const { keyId } = await params;
  if (!KEY_ID_PATTERN.test(keyId)) return NextResponse.json({ error: 'Invalid keyId' }, { status: 400 });
  try {
    const { privateKey } = await getUserEncryptionKeys(session.authToken);
    const keys = documentKeys(privateKey, keyId);
    return NextResponse.json(
      { key: Utils.toBase64(keys.contentKey()), chainAddress: keys.chainKey.toAddress() },
      { headers: { 'Cache-Control': 'no-store' } }
    );
  } catch (error) {
    return errorResponse(error, 'Could not derive document key');
  }
}
