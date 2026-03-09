import { NextRequest, NextResponse } from 'next/server';
import { writeFile, readFile } from 'fs/promises';
import { join } from 'path';
import { existsSync } from 'fs';

interface GrantUpdateRequest {
  id: string;
  status: 'pending' | 'under_review' | 'approved' | 'rejected';
  reviewNotes?: string;
  approvedTokenAmount?: number;
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json() as GrantUpdateRequest;
    const { id, status, reviewNotes, approvedTokenAmount } = body;

    if (!id || !status) {
      return NextResponse.json(
        { error: 'Missing required fields: id and status' },
        { status: 400 }
      );
    }

    const validStatuses = ['pending', 'under_review', 'approved', 'rejected'];
    if (!validStatuses.includes(status)) {
      return NextResponse.json(
        { error: 'Invalid status value' },
        { status: 400 }
      );
    }

    const dataDir = join(process.cwd(), 'data', 'grants');
    const grantFile = join(dataDir, `${id}.json`);

    if (!existsSync(grantFile)) {
      return NextResponse.json(
        { error: 'Grant application not found' },
        { status: 404 }
      );
    }

    // Read existing grant data
    const existingData = await readFile(grantFile, 'utf-8');
    const grantData = JSON.parse(existingData);

    // Update grant data
    grantData.status = status;
    grantData.updatedAt = new Date().toISOString();
    
    if (reviewNotes) {
      grantData.reviewNotes = reviewNotes;
    }
    
    if (approvedTokenAmount !== undefined) {
      grantData.approvedTokenAmount = approvedTokenAmount;
    }

    // Add status history
    if (!grantData.statusHistory) {
      grantData.statusHistory = [];
    }
    
    grantData.statusHistory.push({
      status,
      timestamp: new Date().toISOString(),
      notes: reviewNotes || ''
    });

    // Save updated grant data
    await writeFile(grantFile, JSON.stringify(grantData, null, 2));

    // Update index file
    const indexFile = join(dataDir, 'index.json');
    if (existsSync(indexFile)) {
      try {
        const indexData = await readFile(indexFile, 'utf-8');
        const grantsList = JSON.parse(indexData);
        
        const grantIndex = grantsList.findIndex((grant: any) => grant.id === id);
        if (grantIndex !== -1) {
          grantsList[grantIndex] = grantData;
          await writeFile(indexFile, JSON.stringify(grantsList, null, 2));
        }
      } catch (error) {
        console.error('Error updating index file:', error);
      }
    }

    return NextResponse.json({
      success: true,
      message: 'Grant status updated successfully',
      grant: {
        id: grantData.id,
        status: grantData.status,
        updatedAt: grantData.updatedAt
      }
    });

  } catch (error) {
    console.error('Error updating grant:', error);
    return NextResponse.json(
      { error: 'Failed to update grant status' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');

  if (!id) {
    return NextResponse.json(
      { error: 'Grant ID is required' },
      { status: 400 }
    );
  }

  try {
    const dataDir = join(process.cwd(), 'data', 'grants');
    const grantFile = join(dataDir, `${id}.json`);

    if (!existsSync(grantFile)) {
      return NextResponse.json(
        { error: 'Grant application not found' },
        { status: 404 }
      );
    }

    const grantData = await readFile(grantFile, 'utf-8');
    const grant = JSON.parse(grantData);

    return NextResponse.json({
      success: true,
      grant
    });

  } catch (error) {
    console.error('Error fetching grant:', error);
    return NextResponse.json(
      { error: 'Failed to fetch grant details' },
      { status: 500 }
    );
  }
}