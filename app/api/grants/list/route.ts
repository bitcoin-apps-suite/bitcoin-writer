import { NextRequest, NextResponse } from 'next/server';
import { readdir, readFile } from 'fs/promises';
import { join } from 'path';
import { existsSync } from 'fs';

interface GrantApplication {
  id: string;
  type: 'developer' | 'author' | 'publisher';
  projectTitle?: string; // developer & author
  platformName?: string; // publisher
  description: string;
  walletAddress: string;
  tokenReward: number;
  submittedAt: string;
  status: 'pending' | 'under_review' | 'approved' | 'rejected';
  files: string[];
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type'); // Optional filter by type
    const status = searchParams.get('status'); // Optional filter by status
    const limit = parseInt(searchParams.get('limit') || '50');
    const offset = parseInt(searchParams.get('offset') || '0');

    const dataDir = join(process.cwd(), 'data', 'grants');
    
    if (!existsSync(dataDir)) {
      return NextResponse.json({
        grants: [],
        total: 0,
        hasMore: false
      });
    }

    // Read all grant files
    const files = await readdir(dataDir);
    const grantFiles = files.filter(file => file.endsWith('.json') && file !== 'index.json');
    
    let grants: GrantApplication[] = [];
    
    for (const file of grantFiles) {
      try {
        const filePath = join(dataDir, file);
        const content = await readFile(filePath, 'utf-8');
        const grant = JSON.parse(content);
        grants.push(grant);
      } catch (error) {
        console.error(`Error reading grant file ${file}:`, error);
      }
    }

    // Apply filters
    if (type) {
      grants = grants.filter(grant => grant.type === type);
    }
    
    if (status) {
      grants = grants.filter(grant => grant.status === status);
    }

    // Sort by submission date (newest first)
    grants.sort((a, b) => new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime());

    // Apply pagination
    const total = grants.length;
    const paginatedGrants = grants.slice(offset, offset + limit);
    const hasMore = offset + limit < total;

    // Return public information only (remove sensitive data for public endpoints)
    const publicGrants = paginatedGrants.map(grant => ({
      id: grant.id,
      type: grant.type,
      title: grant.projectTitle || grant.platformName || 'Untitled Project',
      description: grant.description.length > 200 ? 
        grant.description.substring(0, 200) + '...' : 
        grant.description,
      tokenReward: grant.tokenReward,
      submittedAt: grant.submittedAt,
      status: grant.status
    }));

    return NextResponse.json({
      grants: publicGrants,
      total,
      hasMore,
      pagination: {
        limit,
        offset,
        currentPage: Math.floor(offset / limit) + 1,
        totalPages: Math.ceil(total / limit)
      }
    });

  } catch (error) {
    console.error('Error listing grants:', error);
    return NextResponse.json(
      { error: 'Failed to list grants' },
      { status: 500 }
    );
  }
}