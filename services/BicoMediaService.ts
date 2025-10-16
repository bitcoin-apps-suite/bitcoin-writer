/**
 * Bico.Media Integration Service
 * Provides CDN functionality and advanced protocol features
 * Supports B://eard templating, B://inject includes, and global content delivery
 */

import { BProtocolResult } from './BProtocolService';

export interface BicoMediaOptions {
  enableTemplating?: boolean; // Enable B://eard Mustache templating
  enableIncludes?: boolean; // Enable B://inject content inclusion
  templateData?: Record<string, any>; // Data for template processing
  fileExtension?: string; // Force specific file extension processing
  customMimeType?: string; // Override MIME type detection
}

export interface BicoUploadOptions {
  encrypt?: boolean;
  gzip?: boolean;
  metadata?: {
    title?: string;
    description?: string;
    tags?: string[];
  };
}

export interface BicoTemplateResult {
  processedContent: string;
  templateVariables: string[];
  includedReferences: string[];
  processingTime: number;
}

export interface BicoCDNMetrics {
  region: string;
  latency: number;
  cacheHit: boolean;
  dataCenter: string;
}

export interface BicoServiceResult {
  url: string;
  txId: string;
  bicoUrl: string;
  cdnUrls: string[];
  metrics: BicoCDNMetrics;
  template?: BicoTemplateResult;
}

export class BicoMediaService {
  private readonly BICO_BASE_URL = 'https://bico.media';
  private readonly BICO_ADD_URL = 'https://add.bico.media';
  private readonly BICO_BETA_URL = 'https://add.bico.media/beta';

  /**
   * Upload content to Bico.Media with optional processing
   */
  async uploadContent(
    content: string,
    options: BicoUploadOptions = {}
  ): Promise<BicoServiceResult> {
    try {
      console.log('Uploading content to Bico.Media...');
      
      // Prepare content for upload
      const processedContent = await this.prepareContentForUpload(content, options);
      
      // Upload to Bico.Media (beta version for price preview)
      const uploadResult = await this.performUpload(processedContent, options);
      
      // Get CDN information
      const cdnInfo = await this.getCDNInfo(uploadResult.txId);
      
      return {
        url: uploadResult.url,
        txId: uploadResult.txId,
        bicoUrl: `${this.BICO_BASE_URL}/${uploadResult.txId}`,
        cdnUrls: this.generateCDNUrls(uploadResult.txId),
        metrics: cdnInfo
      };
      
    } catch (error) {
      console.error('Failed to upload to Bico.Media:', error);
      throw error;
    }
  }

  /**
   * Retrieve and process content from Bico.Media with template support
   */
  async retrieveContent(
    reference: string,
    options: BicoMediaOptions = {}
  ): Promise<{ content: string; template?: BicoTemplateResult }> {
    try {
      const txId = this.extractTxId(reference);
      const url = this.buildBicoUrl(txId, options);
      
      console.log('Retrieving content from Bico.Media:', url);
      
      const response = await fetch(url, {
        headers: {
          'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
          'User-Agent': 'Bitcoin-Writer/1.0'
        }
      });
      
      if (!response.ok) {
        throw new Error(`Bico.Media returned ${response.status}: ${response.statusText}`);
      }
      
      const content = await response.text();
      
      // Process templates if enabled
      let templateResult: BicoTemplateResult | undefined;
      if (options.enableTemplating && this.isTemplateContent(content)) {
        templateResult = await this.processTemplate(content, options.templateData || {});
      }
      
      return {
        content: templateResult ? templateResult.processedContent : content,
        template: templateResult
      };
      
    } catch (error) {
      console.error('Failed to retrieve from Bico.Media:', error);
      throw error;
    }
  }

  /**
   * Process B://eard Mustache templates with data
   */
  async processTemplate(
    content: string,
    data: Record<string, any>
  ): Promise<BicoTemplateResult> {
    const startTime = Date.now();
    
    try {
      // Check if content is marked as a Mustache template
      if (!content.includes('{{mustache=B://}}')) {
        return {
          processedContent: content,
          templateVariables: [],
          includedReferences: [],
          processingTime: Date.now() - startTime
        };
      }
      
      // Extract template variables and B:// references
      const templateVariables = this.extractTemplateVariables(content);
      const includedReferences = this.extractBReferences(content);
      
      // Load data from B:// references
      const loadedData = { ...data };
      for (const ref of includedReferences) {
        try {
          const refContent = await this.retrieveContent(ref.url);
          loadedData[ref.name] = this.parseReferenceContent(refContent.content);
        } catch (error) {
          console.warn(`Failed to load B:// reference ${ref.url}:`, error);
          loadedData[ref.name] = `Error loading ${ref.url}`;
        }
      }
      
      // Process Mustache template (simplified implementation)
      let processedContent = content;
      
      // Replace template variables
      for (const variable of templateVariables) {
        const value = this.getNestedValue(loadedData, variable);
        const regex = new RegExp(`{{${variable}}}`, 'g');
        processedContent = processedContent.replace(regex, String(value || ''));
      }
      
      // Remove template markers
      processedContent = processedContent.replace(/{{mustache=B:\/\/}}/g, '');
      
      return {
        processedContent,
        templateVariables,
        includedReferences: includedReferences.map(ref => ref.url),
        processingTime: Date.now() - startTime
      };
      
    } catch (error) {
      console.error('Template processing failed:', error);
      throw error;
    }
  }

  /**
   * Process B://inject content includes
   */
  async processIncludes(content: string): Promise<string> {
    try {
      // Find all B://inject references
      const includePattern = /{{B:\/\/([a-f0-9]{64})}}/gi;
      const includes = [];
      let match;
      
      while ((match = includePattern.exec(content)) !== null) {
        includes.push({
          fullMatch: match[0],
          txId: match[1]
        });
      }
      
      // Process each include
      let processedContent = content;
      for (const include of includes) {
        try {
          const includeContent = await this.retrieveContent(include.txId);
          processedContent = processedContent.replace(include.fullMatch, includeContent.content);
        } catch (error) {
          console.warn(`Failed to process include ${include.txId}:`, error);
          processedContent = processedContent.replace(include.fullMatch, `[Error loading ${include.txId}]`);
        }
      }
      
      return processedContent;
      
    } catch (error) {
      console.error('Include processing failed:', error);
      return content; // Return original content on error
    }
  }

  /**
   * Get CDN performance metrics
   */
  async getCDNMetrics(txId: string): Promise<BicoCDNMetrics> {
    try {
      // In production, this would query Bico.Media's CDN API
      // For now, return mock metrics
      return {
        region: 'US-East',
        latency: Math.random() * 50 + 10, // 10-60ms
        cacheHit: Math.random() > 0.3, // 70% cache hit rate
        dataCenter: 'Virginia-1'
      };
      
    } catch (error) {
      console.error('Failed to get CDN metrics:', error);
      // Return default metrics on error
      return {
        region: 'Unknown',
        latency: 999,
        cacheHit: false,
        dataCenter: 'Unknown'
      };
    }
  }

  /**
   * Generate preview URL for cost estimation
   */
  getPreviewUrl(content: string): string {
    // Use beta version for price preview
    return `${this.BICO_BETA_URL}?preview=true&size=${encodeURIComponent(content.length.toString())}`;
  }

  /**
   * Check if Bico.Media service is available
   */
  async checkServiceHealth(): Promise<{ available: boolean; latency: number; version: string }> {
    const startTime = Date.now();
    
    try {
      const response = await fetch(this.BICO_BASE_URL, { method: 'HEAD' });
      const latency = Date.now() - startTime;
      
      return {
        available: response.ok,
        latency,
        version: response.headers.get('X-Bico-Version') || 'unknown'
      };
      
    } catch (error) {
      return {
        available: false,
        latency: Date.now() - startTime,
        version: 'unknown'
      };
    }
  }

  /**
   * Prepare content for upload to Bico.Media
   */
  private async prepareContentForUpload(
    content: string,
    options: BicoUploadOptions
  ): Promise<{ content: string; metadata: any }> {
    let processedContent = content;
    
    // Add metadata if provided
    if (options.metadata?.title || options.metadata?.description) {
      const metaHeader = `<!--
Title: ${options.metadata.title || 'Untitled'}
Description: ${options.metadata.description || ''}
Tags: ${options.metadata.tags?.join(', ') || ''}
Generated by Bitcoin Writer
-->
`;
      processedContent = metaHeader + processedContent;
    }
    
    return {
      content: processedContent,
      metadata: options.metadata || {}
    };
  }

  /**
   * Perform actual upload to Bico.Media
   */
  private async performUpload(
    processedContent: { content: string; metadata: any },
    options: BicoUploadOptions
  ): Promise<{ url: string; txId: string }> {
    try {
      // In production, integrate with Bico.Media upload API
      // For now, simulate upload and return mock result
      
      const mockTxId = this.generateMockTxId(processedContent.content);
      
      console.log('Mock upload to Bico.Media completed:', {
        txId: mockTxId,
        size: processedContent.content.length,
        metadata: processedContent.metadata
      });
      
      return {
        url: `${this.BICO_BASE_URL}/${mockTxId}`,
        txId: mockTxId
      };
      
    } catch (error) {
      console.error('Upload to Bico.Media failed:', error);
      throw error;
    }
  }

  /**
   * Get CDN information for a transaction
   */
  private async getCDNInfo(txId: string): Promise<BicoCDNMetrics> {
    // In production, query actual CDN metrics
    return await this.getCDNMetrics(txId);
  }

  /**
   * Build Bico.Media URL with options
   */
  private buildBicoUrl(txId: string, options: BicoMediaOptions): string {
    let url = `${this.BICO_BASE_URL}/${txId}`;
    
    // Add file extension for content processing
    if (options.fileExtension) {
      url += `.${options.fileExtension}`;
    }
    
    // Add custom MIME type
    if (options.customMimeType) {
      const [type, subtype] = options.customMimeType.split('/');
      url += `/${type}/${subtype}`;
    }
    
    return url;
  }

  /**
   * Generate CDN URLs for different regions
   */
  private generateCDNUrls(txId: string): string[] {
    // Bico.Media automatically provides global CDN
    // These would be actual CDN endpoints in production
    return [
      `${this.BICO_BASE_URL}/${txId}`, // Primary
      `https://us-east.bico.media/${txId}`, // US East
      `https://eu-west.bico.media/${txId}`, // EU West
      `https://asia-south.bico.media/${txId}` // Asia South
    ];
  }

  /**
   * Extract transaction ID from various formats
   */
  private extractTxId(reference: string): string {
    if (reference.startsWith('b://')) {
      return reference.substring(4);
    }
    
    if (reference.includes('bico.media/')) {
      const parts = reference.split('/');
      const txPart = parts[parts.length - 1];
      return txPart.split('.')[0]; // Remove file extension if present
    }
    
    // Assume it's already a transaction ID
    if (/^[a-f0-9]{64}$/i.test(reference)) {
      return reference;
    }
    
    throw new Error(`Invalid reference format: ${reference}`);
  }

  /**
   * Check if content contains template markers
   */
  private isTemplateContent(content: string): boolean {
    return content.includes('{{mustache=B://}}') || 
           content.includes('{{') || 
           content.includes('{{B://');
  }

  /**
   * Extract template variables from content
   */
  private extractTemplateVariables(content: string): string[] {
    const variablePattern = /{{([^}]+)}}/g;
    const variables = [];
    let match;
    
    while ((match = variablePattern.exec(content)) !== null) {
      const variable = match[1].trim();
      // Skip special markers and B:// references
      if (!variable.startsWith('mustache=') && !variable.startsWith('B://') && !variable.includes('=B://')) {
        variables.push(variable);
      }
    }
    
    return Array.from(new Set(variables)); // Remove duplicates
  }

  /**
   * Extract B:// references with variable assignments
   */
  private extractBReferences(content: string): Array<{ name: string; url: string }> {
    const bRefPattern = /{{([^=]+)=B:\/\/([a-f0-9]{64})}}/gi;
    const references = [];
    let match;
    
    while ((match = bRefPattern.exec(content)) !== null) {
      references.push({
        name: match[1].trim(),
        url: `b://${match[2]}`
      });
    }
    
    return references;
  }

  /**
   * Parse content from B:// reference
   */
  private parseReferenceContent(content: string): any {
    try {
      // Try to parse as JSON first
      return JSON.parse(content);
    } catch {
      // Return as string if not JSON
      return content;
    }
  }

  /**
   * Get nested value from object using dot notation
   */
  private getNestedValue(obj: any, path: string): any {
    return path.split('.').reduce((current, key) => current?.[key], obj);
  }

  /**
   * Generate mock transaction ID for testing
   */
  private generateMockTxId(content: string): string {
    const CryptoJS = require('crypto-js');
    return CryptoJS.SHA256(content + Date.now().toString()).toString();
  }

  /**
   * Get protocol badge information for Bico.Media content
   */
  getProtocolBadge(txId: string): { name: string; description: string; color: string; icon: string } | null {
    if (!txId) return null;
    
    return {
      name: 'Bico.Media',
      description: 'Global CDN with B://eard templating, B://inject includes, and advanced protocol features for high-performance content delivery',
      color: '#00CED1', // Dark turquoise
      icon: '🌐' // Globe icon representing global CDN
    };
  }
}

export default BicoMediaService;