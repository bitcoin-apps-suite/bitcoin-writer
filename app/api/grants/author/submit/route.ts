import { NextRequest, NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';
import { existsSync } from 'fs';

interface AuthorGrantApplication {
  id: string;
  type: 'author';
  projectTitle: string;
  description: string;
  contentType: string;
  targetAudience: string;
  estimatedLength: number;
  tokenReward: number;
  walletAddress: string;
  timeline: string;
  writingSamples: string;
  previousWork: string;
  researchPlan: string;
  collaborators: string;
  submittedAt: string;
  status: 'pending' | 'under_review' | 'approved' | 'rejected';
  files: string[];
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    
    // Extract form fields
    const applicationData: Partial<AuthorGrantApplication> = {
      id: `auth_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      type: 'author',
      projectTitle: formData.get('projectTitle') as string,
      description: formData.get('description') as string,
      contentType: formData.get('contentType') as string,
      targetAudience: formData.get('targetAudience') as string,
      estimatedLength: parseInt(formData.get('estimatedLength') as string) || 0,
      tokenReward: parseInt(formData.get('tokenReward') as string) || 0,
      walletAddress: formData.get('walletAddress') as string,
      timeline: formData.get('timeline') as string,
      writingSamples: formData.get('writingSamples') as string,
      previousWork: formData.get('previousWork') as string,
      researchPlan: formData.get('researchPlan') as string,
      collaborators: formData.get('collaborators') as string,
      submittedAt: new Date().toISOString(),
      status: 'pending',
      files: []
    };

    // Validate required fields
    const requiredFields = [
      'projectTitle', 'description', 'contentType', 'targetAudience', 
      'estimatedLength', 'walletAddress', 'timeline', 'writingSamples', 'researchPlan'
    ];
    
    for (const field of requiredFields) {
      if (!applicationData[field as keyof AuthorGrantApplication]) {
        return NextResponse.json(
          { error: `Missing required field: ${field}` },
          { status: 400 }
        );
      }
    }

    // Create uploads directory
    const uploadsDir = join(process.cwd(), 'uploads', 'grants', 'author', applicationData.id!);
    if (!existsSync(uploadsDir)) {
      await mkdir(uploadsDir, { recursive: true });
    }

    // Handle file uploads
    const uploadedFiles: string[] = [];
    let fileIndex = 0;
    
    while (formData.has(`file_${fileIndex}`)) {
      const file = formData.get(`file_${fileIndex}`) as File;
      if (file && file.size > 0) {
        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);
        
        // Generate safe filename
        const timestamp = Date.now();
        const safeFileName = `${timestamp}_${file.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`;
        const filePath = join(uploadsDir, safeFileName);
        
        await writeFile(filePath, buffer);
        uploadedFiles.push(safeFileName);
      }
      fileIndex++;
    }

    applicationData.files = uploadedFiles;

    // Save application data to JSON file
    const dataDir = join(process.cwd(), 'data', 'grants');
    if (!existsSync(dataDir)) {
      await mkdir(dataDir, { recursive: true });
    }

    const applicationFile = join(dataDir, `${applicationData.id}.json`);
    await writeFile(applicationFile, JSON.stringify(applicationData, null, 2));

    // Add to grants index
    const indexFile = join(dataDir, 'index.json');
    let grantsList: AuthorGrantApplication[] = [];
    
    try {
      if (existsSync(indexFile)) {
        const indexData = await import(indexFile);
        grantsList = indexData.default || [];
      }
    } catch (error) {
      console.log('Creating new grants index');
    }

    grantsList.push(applicationData as AuthorGrantApplication);
    await writeFile(indexFile, JSON.stringify(grantsList, null, 2));

    return NextResponse.json({
      success: true,
      message: 'Author grant application submitted successfully',
      applicationId: applicationData.id
    });

  } catch (error) {
    console.error('Author grant submission error:', error);
    return NextResponse.json(
      { error: 'Failed to submit author grant application' },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({ message: 'Author grant submission endpoint' });
}