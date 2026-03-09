import { NextRequest, NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';
import { existsSync } from 'fs';

interface PublisherGrantApplication {
  id: string;
  type: 'publisher';
  platformName: string;
  description: string;
  platformType: string;
  targetAudience: string;
  contentTypes: string;
  expectedTraffic: number;
  tokenReward: number;
  walletAddress: string;
  timeline: string;
  technicalSpecs: string;
  marketingPlan: string;
  revenueModel: string;
  previousPlatforms: string;
  teamSize: number;
  partnerships: string;
  submittedAt: string;
  status: 'pending' | 'under_review' | 'approved' | 'rejected';
  files: string[];
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    
    // Extract form fields
    const applicationData: Partial<PublisherGrantApplication> = {
      id: `pub_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      type: 'publisher',
      platformName: formData.get('platformName') as string,
      description: formData.get('description') as string,
      platformType: formData.get('platformType') as string,
      targetAudience: formData.get('targetAudience') as string,
      contentTypes: formData.get('contentTypes') as string,
      expectedTraffic: parseInt(formData.get('expectedTraffic') as string) || 0,
      tokenReward: parseInt(formData.get('tokenReward') as string) || 0,
      walletAddress: formData.get('walletAddress') as string,
      timeline: formData.get('timeline') as string,
      technicalSpecs: formData.get('technicalSpecs') as string,
      marketingPlan: formData.get('marketingPlan') as string,
      revenueModel: formData.get('revenueModel') as string,
      previousPlatforms: formData.get('previousPlatforms') as string,
      teamSize: parseInt(formData.get('teamSize') as string) || 0,
      partnerships: formData.get('partnerships') as string,
      submittedAt: new Date().toISOString(),
      status: 'pending',
      files: []
    };

    // Validate required fields
    const requiredFields = [
      'platformName', 'description', 'platformType', 'targetAudience', 
      'contentTypes', 'walletAddress', 'timeline', 'technicalSpecs', 'marketingPlan'
    ];
    
    for (const field of requiredFields) {
      if (!applicationData[field as keyof PublisherGrantApplication]) {
        return NextResponse.json(
          { error: `Missing required field: ${field}` },
          { status: 400 }
        );
      }
    }

    // Create uploads directory
    const uploadsDir = join(process.cwd(), 'uploads', 'grants', 'publisher', applicationData.id!);
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
    let grantsList: PublisherGrantApplication[] = [];
    
    try {
      if (existsSync(indexFile)) {
        const indexData = await import(indexFile);
        grantsList = indexData.default || [];
      }
    } catch (error) {
      console.log('Creating new grants index');
    }

    grantsList.push(applicationData as PublisherGrantApplication);
    await writeFile(indexFile, JSON.stringify(grantsList, null, 2));

    return NextResponse.json({
      success: true,
      message: 'Publisher grant application submitted successfully',
      applicationId: applicationData.id
    });

  } catch (error) {
    console.error('Publisher grant submission error:', error);
    return NextResponse.json(
      { error: 'Failed to submit publisher grant application' },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({ message: 'Publisher grant submission endpoint' });
}