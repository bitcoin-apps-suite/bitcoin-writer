import { NextRequest, NextResponse } from 'next/server';
import { createDocument } from '../../../src/lib/maipStore';
import { z } from 'zod';

const bodySchema = z.object({
  title: z.string(),
  creator: z.string(),
  bountyPool: z.number().int().nonnegative(),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { title, creator, bountyPool } = bodySchema.parse(body);
    const doc = createDocument(title, creator, bountyPool);
    return NextResponse.json(doc, { status: 201 });
  } catch (err) {
    return NextResponse.json(
      { error: 'Invalid request', details: err instanceof Error ? err.message : err },
      { status: 400 }
    );
  }
}
