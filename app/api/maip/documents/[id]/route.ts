import { NextRequest, NextResponse } from 'next/server';
import { getDocument, addCollaborator } from '../../../../src/lib/maipStore';
import { z } from 'zod';

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  const doc = getDocument(params.id);
  if (!doc) return NextResponse.json({ error: 'Document not found' }, { status: 404 });
  return NextResponse.json(doc);
}

const collaboratorSchema = z.object({
  collaborator: z.string(),
  permission: z.enum(['read', 'write', 'admin']),
});

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await req.json();
    const { collaborator, permission } = collaboratorSchema.parse(body);
    const success = addCollaborator(params.id, collaborator, permission);
    if (!success) return NextResponse.json({ error: 'Document not found' }, { status: 404 });
    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json(
      { error: 'Invalid request', details: err instanceof Error ? err.message : err },
      { status: 400 }
    );
  }
}
