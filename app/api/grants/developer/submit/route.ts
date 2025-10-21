import { NextRequest, NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';
import { existsSync } from 'fs';

interface GrantApplication {
  id: string;
  type: 'developer';
  projectTitle: string;
  description: string;
  category: string;
  estimatedHours: number;
  tokenReward: number;
  githubRepo: string;
  walletAddress: string;
  teamMembers: string;
  timeline: string;
  technicalDetails: string;
  previousWork: string;
  submittedAt: string;
  status: 'pending' | 'under_review' | 'approved' | 'rejected';
  files: string[];
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    
    // Extract form fields
    const applicationData: Partial<GrantApplication> = {
      id: `dev_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      type: 'developer',
      projectTitle: formData.get('projectTitle') as string,
      description: formData.get('description') as string,
      category: formData.get('category') as string,
      estimatedHours: parseInt(formData.get('estimatedHours') as string) || 0,
      tokenReward: parseInt(formData.get('tokenReward') as string) || 0,
      githubRepo: formData.get('githubRepo') as string,
      walletAddress: formData.get('walletAddress') as string,
      teamMembers: formData.get('teamMembers') as string,
      timeline: formData.get('timeline') as string,
      technicalDetails: formData.get('technicalDetails') as string,
      previousWork: formData.get('previousWork') as string,
      submittedAt: new Date().toISOString(),
      status: 'pending',
      files: []
    };

    // Validate required fields
    const requiredFields = ['projectTitle', 'description', 'category', 'estimatedHours', 'walletAddress', 'technicalDetails', 'timeline'];
    for (const field of requiredFields) {
      if (!applicationData[field as keyof GrantApplication]) {
        return NextResponse.json(
          { error: `Missing required field: ${field}` },
          { status: 400 }
        );
      }
    }

    // Create uploads directory
    const uploadsDir = join(process.cwd(), 'uploads', 'grants', 'developer', applicationData.id!);
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
    let grantsList: GrantApplication[] = [];
    
    try {
      if (existsSync(indexFile)) {
        const indexData = await import(indexFile);
        grantsList = indexData.default || [];
      }
    } catch (error) {
      console.log('Creating new grants index');
    }

    grantsList.push(applicationData as GrantApplication);
    await writeFile(indexFile, JSON.stringify(grantsList, null, 2));

    // Send confirmation email (placeholder)
    // await sendConfirmationEmail(applicationData);

    return NextResponse.json({
      success: true,
      message: 'Grant application submitted successfully',
      applicationId: applicationData.id
    });

  } catch (error) {
    console.error('Grant submission error:', error);
    return NextResponse.json(
      { error: 'Failed to submit grant application' },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({ message: 'Grant submission endpoint' });
}