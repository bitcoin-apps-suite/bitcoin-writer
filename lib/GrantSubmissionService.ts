import { BitcoinWriterNFTService } from './NFTService';
import { 
  NFTFile, 
  NFTContent, 
  NFTMetadata, 
  GrantSubmission 
} from '../types/NFTTypes';

export interface GrantApplicationData {
  // Basic info
  applicantName: string;
  email: string;
  bsvAddress: string;
  applicantType: 'developer' | 'author' | 'publisher';
  
  // Project details
  projectTitle: string;
  projectDescription: string;
  requestedAmount: number;
  requestedCurrency: 'BSV' | 'BWRITER';
  estimatedDuration: string;
  
  // Supporting info
  portfolio?: string;
  githubProfile?: string;
  previousWork?: string;
  timeline?: string;
  
  // Attachments
  attachments?: File[];
}

export interface GrantSubmissionResult {
  nft: GrantSubmission;
  fileData: ArrayBuffer;
  submissionId: string;
  publicUrl: string;
}

export class GrantSubmissionService {
  private nftService: BitcoinWriterNFTService;
  
  constructor() {
    this.nftService = new BitcoinWriterNFTService();
  }
  
  /**
   * Create a grant submission as an .nft file
   */
  async createGrantSubmission(applicationData: GrantApplicationData): Promise<GrantSubmissionResult> {
    // Generate submission ID
    const submissionId = this.generateSubmissionId();
    
    // Create HTML formatted content
    const htmlContent = this.formatApplicationAsHTML(applicationData);
    
    // Process attachments
    const attachments = await this.processAttachments(applicationData.attachments || []);
    
    // Create NFT content
    const content: NFTContent = {
      format: 'html',
      encoding: 'utf8',
      data: htmlContent,
      attachments
    };
    
    // Create NFT metadata
    const metadata: Omit<NFTMetadata, 'platformData'> = {
      title: `Grant Application: ${applicationData.projectTitle}`,
      description: applicationData.projectDescription,
      creatorName: applicationData.applicantName,
      creatorAddress: applicationData.bsvAddress,
      documentType: 'grant-submission',
      grantInfo: {
        applicantType: applicationData.applicantType,
        requestedAmount: applicationData.requestedAmount,
        requestedCurrency: applicationData.requestedCurrency,
        fundingAddress: applicationData.bsvAddress,
        applicationStatus: 'pending'
      },
      rights: {
        license: 'proprietary',
        commercialUse: false,
        derivatives: false
      }
    };
    
    // Create the NFT
    const nft = await this.nftService.create(content, metadata);
    
    // Add our platform signature (endorsement placeholder) and cast to GrantSubmission
    const signedNft = await this.nftService.sign(nft, 'platform_private_key_placeholder') as GrantSubmission;
    
    // Serialize to binary
    const fileData = await this.nftService.write(signedNft);
    
    // Generate public URL (would be actual hosting in production)
    const publicUrl = `/submissions/${submissionId}.nft`;
    
    return {
      nft: signedNft,
      fileData,
      submissionId,
      publicUrl
    };
  }
  
  /**
   * Award $BWRITER tokens to a submission (platform curation signal)
   */
  async awardBWriterTokens(submissionId: string, awardAmount: number, reviewNotes?: string): Promise<GrantSubmission> {
    // In production, this would load from storage
    const nft = await this.loadSubmission(submissionId);
    
    if (!nft.metadata.grantInfo) {
      throw new Error('Invalid grant submission');
    }
    
    // Update with our award
    nft.metadata.grantInfo.bwriterAward = awardAmount;
    nft.metadata.grantInfo.reviewNotes = reviewNotes;
    
    // Update platform metadata
    if (nft.metadata.platformData) {
      nft.metadata.platformData.quality_score = this.calculateQualityScore(awardAmount);
      nft.metadata.platformData.featured = awardAmount > 1000; // Feature high awards
    }
    
    // Re-sign with our updated endorsement
    const updatedNft = await this.nftService.sign(nft, 'platform_private_key_placeholder');
    
    // Save updated version
    await this.saveSubmission(submissionId, updatedNft);
    
    return updatedNft as GrantSubmission;
  }
  
  /**
   * Check for funding and update submission status
   */
  async checkForFunding(submissionId: string): Promise<GrantSubmission> {
    const nft = await this.loadSubmission(submissionId);
    const updatedNft = await this.nftService.detectFunding(nft as GrantSubmission);
    
    if (updatedNft.metadata.grantInfo?.applicationStatus === 'funded') {
      // Save updated status
      await this.saveSubmission(submissionId, updatedNft);
      
      // Notify applicant (placeholder)
      await this.notifyFundingDetected(updatedNft);
    }
    
    return updatedNft as GrantSubmission;
  }
  
  /**
   * Get public submissions gallery data
   */
  async getPublicSubmissions(filters?: {
    applicantType?: 'developer' | 'author' | 'publisher';
    status?: 'pending' | 'awarded' | 'funded';
    featured?: boolean;
  }): Promise<GrantSubmission[]> {
    // In production, this would query a database/storage
    // For now, return mock data
    const allSubmissions = await this.getAllSubmissions();
    
    if (!filters) return allSubmissions;
    
    return allSubmissions.filter(nft => {
      const grantInfo = nft.metadata.grantInfo;
      const platformData = nft.metadata.platformData;
      
      if (filters.applicantType && grantInfo?.applicantType !== filters.applicantType) {
        return false;
      }
      
      if (filters.status && grantInfo?.applicationStatus !== filters.status) {
        return false;
      }
      
      if (filters.featured && !platformData?.featured) {
        return false;
      }
      
      return true;
    });
  }
  
  /**
   * Generate summary statistics for admin dashboard
   */
  async getSubmissionStats(): Promise<{
    total: number;
    pending: number;
    awarded: number;
    funded: number;
    totalBWriterAwarded: number;
    totalFundingDetected: number;
  }> {
    const submissions = await this.getAllSubmissions();
    
    let totalBWriterAwarded = 0;
    let totalFundingDetected = 0;
    
    const stats = submissions.reduce((acc, nft) => {
      const status = nft.metadata.grantInfo?.applicationStatus;
      const bwriterAward = nft.metadata.grantInfo?.bwriterAward || 0;
      const fundingAmount = nft.metadata.grantInfo?.fundingDetected?.amount || 0;
      
      totalBWriterAwarded += bwriterAward;
      totalFundingDetected += fundingAmount;
      
      switch (status) {
        case 'pending': acc.pending++; break;
        case 'awarded': acc.awarded++; break;
        case 'funded': acc.funded++; break;
      }
      
      return acc;
    }, { pending: 0, awarded: 0, funded: 0 });
    
    return {
      total: submissions.length,
      ...stats,
      totalBWriterAwarded,
      totalFundingDetected
    };
  }
  
  // Private helper methods
  
  private generateSubmissionId(): string {
    return 'GS-' + Date.now().toString(36) + Math.random().toString(36).substr(2, 9);
  }
  
  private formatApplicationAsHTML(data: GrantApplicationData): string {
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Grant Application: ${data.projectTitle}</title>
        <style>
          body { font-family: Arial, sans-serif; max-width: 800px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(90deg, #FF6B35, #F7931E); color: white; padding: 20px; border-radius: 8px; margin-bottom: 20px; }
          .section { margin: 20px 0; padding: 15px; border: 1px solid #eee; border-radius: 5px; }
          .label { font-weight: bold; color: #333; }
          .value { margin-left: 10px; }
          .amount { font-size: 1.2em; color: #FF6B35; font-weight: bold; }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>${data.projectTitle}</h1>
          <p>Grant Application by ${data.applicantName}</p>
        </div>
        
        <div class="section">
          <h2>Applicant Information</h2>
          <p><span class="label">Name:</span><span class="value">${data.applicantName}</span></p>
          <p><span class="label">Email:</span><span class="value">${data.email}</span></p>
          <p><span class="label">BSV Address:</span><span class="value">${data.bsvAddress}</span></p>
          <p><span class="label">Type:</span><span class="value">${data.applicantType}</span></p>
          ${data.portfolio ? `<p><span class="label">Portfolio:</span><span class="value"><a href="${data.portfolio}">${data.portfolio}</a></span></p>` : ''}
          ${data.githubProfile ? `<p><span class="label">GitHub:</span><span class="value"><a href="${data.githubProfile}">${data.githubProfile}</a></span></p>` : ''}
        </div>
        
        <div class="section">
          <h2>Project Details</h2>
          <p><span class="label">Description:</span></p>
          <div class="value">${data.projectDescription.replace(/\n/g, '<br>')}</div>
          <p><span class="label">Requested Amount:</span><span class="value amount">${data.requestedAmount} ${data.requestedCurrency}</span></p>
          <p><span class="label">Estimated Duration:</span><span class="value">${data.estimatedDuration}</span></p>
          ${data.timeline ? `<p><span class="label">Timeline:</span><div class="value">${data.timeline.replace(/\n/g, '<br>')}</div></p>` : ''}
        </div>
        
        ${data.previousWork ? `
        <div class="section">
          <h2>Previous Work</h2>
          <div class="value">${data.previousWork.replace(/\n/g, '<br>')}</div>
        </div>
        ` : ''}
        
        <div class="section">
          <h2>Application Metadata</h2>
          <p><span class="label">Submitted:</span><span class="value">${new Date().toISOString()}</span></p>
          <p><span class="label">Platform:</span><span class="value">Bitcoin Writer</span></p>
          <p><span class="label">Status:</span><span class="value">Pending Review</span></p>
        </div>
      </body>
      </html>
    `;
  }
  
  private async processAttachments(files: File[]): Promise<Array<{ filename: string; mimeType: string; size: number; data: string }>> {
    const attachments = [];
    
    for (const file of files) {
      if (file.size > 10 * 1024 * 1024) { // 10MB limit
        continue;
      }
      
      const data = await this.fileToBase64(file);
      attachments.push({
        filename: file.name,
        mimeType: file.type,
        size: file.size,
        data
      });
    }
    
    return attachments;
  }
  
  private fileToBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        const result = reader.result as string;
        const base64 = result.split(',')[1]; // Remove data:mime;base64, prefix
        resolve(base64);
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  }
  
  private calculateQualityScore(awardAmount: number): number {
    // Simple quality scoring based on $BWRITER award
    return Math.min(100, Math.floor((awardAmount / 10000) * 100));
  }
  
  private async loadSubmission(submissionId: string): Promise<NFTFile> {
    // Placeholder - in production would load from storage/database
    throw new Error('loadSubmission not implemented - requires storage backend');
  }
  
  private async saveSubmission(submissionId: string, nft: NFTFile): Promise<void> {
    // Placeholder - in production would save to storage/database
    console.log(`Saving submission ${submissionId}`);
  }
  
  private async getAllSubmissions(): Promise<GrantSubmission[]> {
    // Placeholder - in production would query storage
    return [];
  }
  
  private async notifyFundingDetected(nft: NFTFile): Promise<void> {
    // Placeholder for email/notification system
    console.log(`Funding detected for: ${nft.metadata.title}`);
  }
}