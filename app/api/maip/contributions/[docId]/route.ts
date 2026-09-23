import { NextRequest, NextResponse } from 'next/server';
import { addContribution, getDocument } from '../../../../src/lib/maipStore';
import { ContributionEntry } from '../../../../src/types/maip';
import { calculateValueScore } from '../../../../src/utils/contribution';
import { z } from 'zod';

const contributionSchema = z.object({
  author: z.string(),
  changeType: z.enum(['addition', 'deletion', 'modification']),
  content: z.string(),
});

export async function POST(
  req: NextRequest,
  { params }: { params: { docId: string } }
) {
  try {
    const body = await req.json();
    const { author, changeType, content } = contributionSchema.parse(body);

    const doc = getDocument(params.docId);
    if (!doc) return NextResponse.json({ error: 'Document not found' }, { status: 404 });

    const entry: ContributionEntry = {
      author,
      timestamp: new Date().toISOString(),
      changeType,
      content,
      valueScore: calculateValueScore(content),
      payment: 0, // will be set in store
    };

    const success = addContribution(params.docId, entry);
    if (!success) return NextResponse.json({ error: 'Failed to add contribution' }, { status: 500 });

    return NextResponse.json(entry, { status: 201 });
  } catch (err) {
    return NextResponse.json(
      { error: 'Invalid request', details: err instanceof Error ? err.message : err },
      { status: 400 }
    );
  }
}
