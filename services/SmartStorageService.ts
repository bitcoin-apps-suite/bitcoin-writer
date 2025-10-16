/**
 * Smart Storage Service
 * Automatically chooses the best storage method based on file size and content
 * No confusing options - just works!
 */

import { SignatureEncryption } from './SignatureEncryption';

export interface SmartStorageOptions {
  encrypt: boolean;
  title?: string;
  author?: string;
}

export interface StorageResult {
  success: boolean;
  transactionId?: string;
  ipfsHash?: string;
  storageMethod: 'onchain' | 'hybrid';
  cost: number;
  error?: string;
}

export class SmartStorageService {
  // Smart thresholds
  private static readonly SMALL_FILE_THRESHOLD = 50000; // 50KB - store directly on-chain
  private static readonly MEDIUM_FILE_THRESHOLD = 1000000; // 1MB - use hybrid storage
  // Files over 1MB get compressed or chunked
  
  /**
   * Automatically determine the best storage method and store the document
   */
  static async storeDocument(
    content: string,
    options: SmartStorageOptions,
    signFunction?: (message: string) => Promise<{signature: string, publicKey: string}>
  ): Promise<StorageResult> {
    
    const contentSize = new TextEncoder().encode(content).length;
    
    try {
      // Step 1: Handle encryption if requested
      let finalContent = content;
      let metadata = {
        title: options.title,
        author: options.author,
        timestamp: Date.now(),
        encrypted: options.encrypt,
        originalSize: contentSize
      };
      
      if (options.encrypt && signFunction) {
        const encryptedPackage = await SignatureEncryption.createEncryptedPackage(
          content,
          signFunction,
          metadata
        );
        finalContent = encryptedPackage.package;
      }
      
      // Step 2: Smart storage method selection
      const finalSize = new TextEncoder().encode(finalContent).length;
      
      if (finalSize <= this.SMALL_FILE_THRESHOLD) {
        // Small files: Direct on-chain storage
        return await this.storeOnChain(finalContent, metadata);
      } else if (finalSize <= this.MEDIUM_FILE_THRESHOLD) {
        // Medium files: Hybrid storage (metadata on-chain, content on IPFS)
        return await this.storeHybrid(finalContent, metadata);
      } else {
        // Large files: Compress and try hybrid, or chunk if needed
        return await this.storeLargeFile(finalContent, metadata);
      }
      
    } catch (error) {
      return {
        success: false,
        storageMethod: 'onchain',
        cost: 0,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }
  
  /**
   * Store directly on BSV blockchain
   */
  private static async storeOnChain(content: string, metadata: any): Promise<StorageResult> {
    const contentSize = new TextEncoder().encode(content).length;
    const cost = contentSize * 0.000001; // Approximate BSV storage cost
    
    try {
      // Create BSV transaction with OP_PUSHDATA4 or OP_RETURN
      const transactionData = {
        type: 'document_storage',
        method: 'onchain',
        content: content,
        metadata: metadata
      };
      
      // In a real implementation, this would interact with BSV SDK
      const txid = await this.submitBSVTransaction(transactionData);
      
      return {
        success: true,
        transactionId: txid,
        storageMethod: 'onchain',
        cost: cost
      };
    } catch (error) {
      throw new Error(`On-chain storage failed: ${error}`);
    }
  }
  
  /**
   * Store using hybrid method (metadata on-chain, content on IPFS)
   */
  private static async storeHybrid(content: string, metadata: any): Promise<StorageResult> {
    const cost = 0.00001; // Fixed cost for hybrid storage
    
    try {
      // Step 1: Store content on IPFS
      const ipfsHash = await this.storeOnIPFS(content);
      
      // Step 2: Store metadata + IPFS hash on BSV blockchain
      const onChainData = {
        type: 'document_storage',
        method: 'hybrid',
        ipfs_hash: ipfsHash,
        metadata: metadata,
        content_hash: this.hashContent(content) // For integrity verification
      };
      
      const txid = await this.submitBSVTransaction(onChainData);
      
      return {
        success: true,
        transactionId: txid,
        ipfsHash: ipfsHash,
        storageMethod: 'hybrid',
        cost: cost
      };
    } catch (error) {
      throw new Error(`Hybrid storage failed: ${error}`);
    }
  }
  
  /**
   * Handle large files with compression and chunking
   */
  private static async storeLargeFile(content: string, metadata: any): Promise<StorageResult> {
    try {
      // Try compression first
      const compressed = await this.compressContent(content);
      
      if (new TextEncoder().encode(compressed).length <= this.MEDIUM_FILE_THRESHOLD) {
        // Compression worked, use hybrid storage
        return await this.storeHybrid(compressed, {
          ...metadata,
          compressed: true,
          compression_method: 'gzip'
        });
      } else {
        // File is too large even compressed - chunk it
        return await this.storeChunked(content, metadata);
      }
    } catch (error) {
      throw new Error(`Large file storage failed: ${error}`);
    }
  }
  
  /**
   * Store very large files by chunking
   */
  private static async storeChunked(content: string, metadata: any): Promise<StorageResult> {
    const chunkSize = this.MEDIUM_FILE_THRESHOLD / 2; // 500KB chunks
    const chunks = this.chunkContent(content, chunkSize);
    
    const chunkHashes: string[] = [];
    
    // Store each chunk on IPFS
    for (const chunk of chunks) {
      const chunkHash = await this.storeOnIPFS(chunk);
      chunkHashes.push(chunkHash);
    }
    
    // Store chunk manifest on-chain
    const manifestData = {
      type: 'document_storage',
      method: 'chunked',
      chunk_hashes: chunkHashes,
      total_chunks: chunks.length,
      metadata: {
        ...metadata,
        chunked: true,
        original_size: new TextEncoder().encode(content).length
      }
    };
    
    const txid = await this.submitBSVTransaction(manifestData);
    
    return {
      success: true,
      transactionId: txid,
      storageMethod: 'hybrid', // Technically hybrid since we use IPFS + BSV
      cost: 0.00001 + (chunks.length * 0.000001) // Manifest + chunk costs
    };
  }
  
  /**
   * Estimate storage cost before actually storing
   */
  static estimateStorageCost(content: string, encrypted: boolean = false): {
    cost: number;
    method: string;
    description: string;
  } {
    let contentSize = new TextEncoder().encode(content).length;
    
    // Add encryption overhead if applicable
    if (encrypted) {
      contentSize = Math.ceil(contentSize * 1.4); // Encryption + JSON overhead
    }
    
    if (contentSize <= this.SMALL_FILE_THRESHOLD) {
      return {
        cost: contentSize * 0.000001,
        method: 'On-Chain',
        description: 'Stored directly on BSV blockchain - permanent and secure'
      };
    } else if (contentSize <= this.MEDIUM_FILE_THRESHOLD) {
      return {
        cost: 0.00001,
        method: 'Hybrid',
        description: 'Metadata on-chain, content on IPFS - cost-effective for large files'
      };
    } else {
      const chunks = Math.ceil(contentSize / (this.MEDIUM_FILE_THRESHOLD / 2));
      return {
        cost: 0.00001 + (chunks * 0.000001),
        method: 'Chunked',
        description: 'Large file split into chunks - stored across IPFS with manifest on-chain'
      };
    }
  }
  
  // Helper methods (simplified for demo)
  private static async submitBSVTransaction(data: any): Promise<string> {
    // In real implementation, use BSV SDK to create and broadcast transaction
    // For now, return a mock transaction ID
    return 'tx_' + Math.random().toString(36).substr(2, 16);
  }
  
  private static async storeOnIPFS(content: string): Promise<string> {
    // In real implementation, upload to IPFS
    // For now, return a mock IPFS hash
    return 'Qm' + Math.random().toString(36).substr(2, 44);
  }
  
  private static hashContent(content: string): string {
    // Simple hash for integrity checking
    return btoa(content).slice(0, 32);
  }
  
  private static async compressContent(content: string): Promise<string> {
    // In real implementation, use gzip compression
    // For now, just return the content (compression would reduce size)
    return content;
  }
  
  private static chunkContent(content: string, chunkSize: number): string[] {
    const chunks: string[] = [];
    for (let i = 0; i < content.length; i += chunkSize) {
      chunks.push(content.slice(i, i + chunkSize));
    }
    return chunks;
  }
}

export default SmartStorageService;