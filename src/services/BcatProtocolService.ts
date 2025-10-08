/**
 * Bcat Protocol Service
 * Implements the Bcat (B cat) protocol for large file storage via concatenation
 * Supports files up to ~290MB by splitting across multiple BSV transactions
 */

import { HandCashService, UTXO } from './HandCashService';
import { Transaction, Script, P2PKH } from '@bsv/sdk';
import { BProtocolService } from './BProtocolService';

export interface BcatPart {
  partIndex: number;
  txId: string;
  data: Buffer;
  size: number;
}

export interface BcatTransaction {
  info: string; // Unstructured info about the transaction
  mimeType: string; // MIME type of the complete file
  encoding?: string; // Character encoding
  filename?: string; // Original filename
  flag?: string; // Processing flags (gzip, nested-gzip, etc.)
  parts: string[]; // Array of transaction IDs for parts (TX1, TX2, ..., TXn)
}

export interface BcatResult {
  bcatTxId: string; // Main Bcat transaction ID
  bcatUrl: string; // bcat://txId format
  bicoUrl: string; // https://bico.media/txId
  explorerUrl: string;
  parts: Array<{
    txId: string;
    size: number;
    index: number;
  }>;
  cost: {
    mainTxSats: number;
    partTxSats: number;
    totalSats: number;
    totalUSD: number;
  };
  size: {
    originalBytes: number;
    totalStorageBytes: number;
    compressionRatio?: number;
  };
}

export interface BcatOptions {
  mimeType?: string;
  encoding?: string;
  filename?: string;
  compress?: boolean; // Enable gzip compression
  maxPartSize?: number; // Max size per part (default ~95KB)
  info?: string; // Additional info about the file
}

export class BcatProtocolService {
  private handCashService: HandCashService;
  private bProtocolService: BProtocolService;
  
  // Protocol identifiers
  private readonly BCAT_PROTOCOL_PREFIX = '15DHFxWZJT58f9nhyGnsRBqrgwK4W6h4Up'; // Bcat main transaction
  private readonly BCAT_PART_PREFIX = '1ChDHzdd1H4wSjgGMHyndZm6qxEDGjqpJL'; // Bcat part transaction

  // Configuration
  private readonly MAX_PART_SIZE = 95000; // ~95KB per part (leaving room for transaction overhead)
  private readonly MAX_TOTAL_SIZE = 290 * 1024 * 1024; // ~290MB maximum file size

  constructor(handCashService: HandCashService, bProtocolService: BProtocolService) {
    this.handCashService = handCashService;
    this.bProtocolService = bProtocolService;
  }

  /**
   * Store large content using Bcat protocol
   */
  async storeLargeContent(
    content: string,
    options: BcatOptions = {}
  ): Promise<BcatResult> {
    if (!this.handCashService.isAuthenticated()) {
      throw new Error('User must be authenticated to store large content');
    }

    try {
      // Validate content size
      const contentBuffer = Buffer.from(content, 'utf-8');
      this.validateContentSize(contentBuffer);

      // Prepare content for storage
      const processedContent = await this.prepareContent(contentBuffer, options);

      // Split content into parts
      const parts = this.splitIntoparts(processedContent.data, options.maxPartSize || this.MAX_PART_SIZE);

      // Store each part as B:// or Bcat part transaction
      const partResults = await this.storeParts(parts);

      // Create main Bcat transaction
      const bcatResult = await this.createBcatTransaction(processedContent, partResults, options);

      console.log('Large content stored with Bcat protocol:', {
        bcatTxId: bcatResult.bcatTxId,
        totalParts: partResults.length,
        originalSize: contentBuffer.length,
        totalCost: bcatResult.cost.totalUSD
      });

      return bcatResult;

    } catch (error) {
      console.error('Failed to store large content with Bcat protocol:', error);
      throw error;
    }
  }

  /**
   * Retrieve large content from Bcat transaction
   */
  async retrieveLargeContent(bcatReference: string): Promise<string> {
    try {
      const bcatTxId = this.extractBcatTxId(bcatReference);

      // Retrieve main Bcat transaction
      const bcatTransaction = await this.retrieveBcatTransaction(bcatTxId);

      // Retrieve all parts in order
      const parts = await this.retrieveParts(bcatTransaction.parts);

      // Concatenate parts to reconstruct original content
      const reconstructedContent = this.concatenateParts(parts);

      // Apply decompression if needed
      const finalContent = await this.postProcessContent(reconstructedContent, bcatTransaction);

      return finalContent.toString('utf-8');

    } catch (error) {
      console.error('Failed to retrieve large content from Bcat:', error);
      throw error;
    }
  }

  /**
   * Estimate cost for storing large content with Bcat
   */
  async estimateCost(content: string, options: BcatOptions = {}): Promise<BcatResult['cost']> {
    const contentBuffer = Buffer.from(content, 'utf-8');
    this.validateContentSize(contentBuffer);

    const processedContent = await this.prepareContent(contentBuffer, options);
    const parts = this.splitIntoparts(processedContent.data, options.maxPartSize || this.MAX_PART_SIZE);

    // Estimate cost for each part
    const partCost = parts.length * 1000; // 1000 sats per part transaction
    const mainTxCost = 2000; // Main Bcat transaction cost
    const totalSats = partCost + mainTxCost;

    // Convert to USD (mock rate)
    const bsvToUsd = 50; // $50 per BSV
    const satsPerBsv = 100000000;
    const totalUSD = (totalSats / satsPerBsv) * bsvToUsd;

    return {
      mainTxSats: mainTxCost,
      partTxSats: partCost,
      totalSats,
      totalUSD
    };
  }

  /**
   * Check if content should use Bcat protocol
   */
  shouldUseBcat(content: string): boolean {
    const contentSize = Buffer.from(content, 'utf-8').length;
    return contentSize > 100000; // Use Bcat for files >100KB
  }

  /**
   * Get Bcat protocol information for a transaction
   */
  async getBcatInfo(bcatTxId: string): Promise<BcatTransaction | null> {
    try {
      return await this.retrieveBcatTransaction(bcatTxId);
    } catch (error) {
      console.error('Failed to get Bcat info:', error);
      return null;
    }
  }

  /**
   * Convert Bcat transaction ID to URL formats
   */
  toBcatUrl(txId: string): string {
    return `bcat://${txId}`;
  }

  /**
   * Validate content size for Bcat protocol
   */
  private validateContentSize(contentBuffer: Buffer): void {
    if (contentBuffer.length > this.MAX_TOTAL_SIZE) {
      throw new Error(`Content too large for Bcat protocol. Maximum: ${this.MAX_TOTAL_SIZE / (1024 * 1024)}MB, provided: ${contentBuffer.length / (1024 * 1024)}MB`);
    }

    if (contentBuffer.length <= this.MAX_PART_SIZE) {
      console.warn('Content is small enough for B:// protocol. Consider using BProtocolService instead.');
    }
  }

  /**
   * Prepare content for Bcat storage
   */
  private async prepareContent(
    contentBuffer: Buffer,
    options: BcatOptions
  ): Promise<{ data: Buffer; mimeType: string; encoding?: string; filename?: string; compressed: boolean }> {
    let processedData = contentBuffer;
    let compressed = false;

    // Apply compression if requested or if content is very large
    if (options.compress || contentBuffer.length > 200000) {
      // In production, implement gzip compression
      console.log('Compression would be applied here');
      compressed = true;
    }

    return {
      data: processedData,
      mimeType: options.mimeType || this.detectMimeType(options.filename),
      encoding: options.encoding || 'utf-8',
      filename: options.filename,
      compressed
    };
  }

  /**
   * Split content into manageable parts
   */
  private splitIntoparts(data: Buffer, maxPartSize: number): BcatPart[] {
    const parts: BcatPart[] = [];
    let offset = 0;
    let partIndex = 0;

    while (offset < data.length) {
      const remainingSize = data.length - offset;
      const partSize = Math.min(maxPartSize, remainingSize);
      const partData = data.subarray(offset, offset + partSize);

      parts.push({
        partIndex,
        txId: '', // Will be filled when stored
        data: partData,
        size: partSize
      });

      offset += partSize;
      partIndex++;
    }

    console.log(`Split content into ${parts.length} parts, average size: ${Math.round(data.length / parts.length)} bytes`);
    return parts;
  }

  /**
   * Store all parts as separate transactions
   */
  private async storeParts(parts: BcatPart[]): Promise<Array<{ txId: string; size: number; index: number }>> {
    const results = [];

    for (const part of parts) {
      try {
        // For meaningful parts, use B:// protocol
        // For non-meaningful chunks, use Bcat part format
        const shouldUseB = this.isPartMeaningful(part.data);

        let txId: string;
        if (shouldUseB) {
          const bResult = await this.bProtocolService.storeContent(part.data.toString('utf-8'), {
            mediaType: 'application/octet-stream'
          });
          txId = bResult.txId;
        } else {
          txId = await this.storeBcatPart(part.data);
        }

        results.push({
          txId,
          size: part.size,
          index: part.partIndex
        });

        console.log(`Stored part ${part.partIndex + 1}/${parts.length}: ${txId}`);

      } catch (error) {
        console.error(`Failed to store part ${part.partIndex}:`, error);
        throw error;
      }
    }

    return results;
  }

  /**
   * Store a single Bcat part
   */
  private async storeBcatPart(data: Buffer): Promise<string> {
    try {
      // Get current user for transaction signing
      const user = this.handCashService.getCurrentUser();
      if (!user) {
        throw new Error('User authentication required for Bcat part storage');
      }

      // Create Bcat part transaction
      // Format: OP_RETURN 1ChDHzdd1H4wSjgGMHyndZm6qxEDGjqpJL [RAW_DATA]
      
      const opReturnData = [
        Buffer.from(this.BCAT_PART_PREFIX, 'utf-8'), // Bcat part identifier
        data // Raw part data
      ];

      // Build OP_RETURN script
      const script = new Script();
      script.writeOpCode(106); // OP_RETURN
      
      opReturnData.forEach(chunk => {
        if (chunk.length > 0) {
          // Convert Buffer to number array for BSV SDK
          const dataArray = Array.from(chunk);
          script.writeBin(dataArray);
        }
      });

      // Create transaction
      const transaction = new Transaction();
      transaction.addOutput({
        lockingScript: script,
        satoshis: 0
      });

      // Get UTXOs for funding
      const utxos = await this.handCashService.getUtxos();
      if (!utxos || utxos.length === 0) {
        throw new Error('No UTXOs available for Bcat part funding');
      }

      // Calculate required fee based on transaction size
      const estimatedSize = 100 + data.length; // Base size + data
      const feeRequired = Math.max(250, Math.ceil(estimatedSize * 1.2));

      // Find UTXO with sufficient balance
      let totalInputValue = 0;
      const selectedUtxos = [];
      
      for (const utxo of utxos) {
        selectedUtxos.push(utxo);
        totalInputValue += utxo.satoshis;
        
        if (totalInputValue >= feeRequired) {
          break;
        }
      }

      if (totalInputValue < feeRequired) {
        throw new Error(`Insufficient funds for Bcat part. Need ${feeRequired} sats, have ${totalInputValue} sats`);
      }

      // Add inputs to transaction
      selectedUtxos.forEach(utxo => {
        transaction.addInput({
          sourceTXID: utxo.txId,
          sourceOutputIndex: utxo.outputIndex
        });
      });

      // Add change output if needed
      const changeAmount = totalInputValue - feeRequired;
      if (changeAmount > 0) {
        const changeAddress = await this.handCashService.getReceiveAddress();
        transaction.addOutput({
          lockingScript: new P2PKH().lock(changeAddress),
          satoshis: changeAmount
        });
      }

      // Sign and broadcast transaction
      await this.handCashService.signTransaction(transaction);
      const broadcastResult = await this.handCashService.broadcastTransaction(transaction);

      console.log('Bcat part stored:', {
        txId: broadcastResult.txId,
        size: data.length,
        fee: feeRequired
      });

      return broadcastResult.txId;

    } catch (error) {
      console.error('Failed to store Bcat part:', error);
      throw error;
    }
  }

  /**
   * Create main Bcat transaction
   */
  private async createBcatTransaction(
    content: { data: Buffer; mimeType: string; encoding?: string; filename?: string; compressed: boolean },
    parts: Array<{ txId: string; size: number; index: number }>,
    options: BcatOptions
  ): Promise<BcatResult> {
    try {
      // Create Bcat transaction following specification
      const bcatTransaction: BcatTransaction = {
        info: options.info || 'Bitcoin Writer large document',
        mimeType: content.mimeType,
        encoding: content.encoding,
        filename: content.filename,
        flag: content.compressed ? 'gzip' : undefined,
        parts: parts.map(p => p.txId)
      };

      // Create actual Bcat protocol transaction
      // Format: OP_RETURN 15DHFxWZJT58f9nhyGnsRBqrgwK4W6h4Up [info] [mimeType] [encoding] [filename] [flag] [TX1] [TX2] ... [TXn]
      
      console.log('Creating Bcat transaction:', bcatTransaction);
      
      // Build OP_RETURN data according to Bcat specification
      const opReturnData = [
        Buffer.from(this.BCAT_PROTOCOL_PREFIX, 'utf-8'), // Protocol identifier
        Buffer.from(bcatTransaction.info, 'utf-8'), // Info
        Buffer.from(bcatTransaction.mimeType, 'utf-8'), // MIME type
        bcatTransaction.encoding ? Buffer.from(bcatTransaction.encoding, 'utf-8') : Buffer.alloc(0), // Encoding
        bcatTransaction.filename ? Buffer.from(bcatTransaction.filename, 'utf-8') : Buffer.alloc(0), // Filename
        bcatTransaction.flag ? Buffer.from(bcatTransaction.flag, 'utf-8') : Buffer.alloc(0), // Flag
        ...bcatTransaction.parts.map(txId => Buffer.from(txId, 'hex')) // Part transaction IDs
      ];

      // Build OP_RETURN script
      const script = new Script();
      script.writeOpCode(106); // OP_RETURN
      
      opReturnData.forEach(chunk => {
        if (chunk.length > 0) {
          // Convert Buffer to number array for BSV SDK
          const dataArray = Array.from(chunk);
          script.writeBin(dataArray);
        }
      });

      // Create and fund transaction
      const transaction = new Transaction();
      transaction.addOutput({
        lockingScript: script,
        satoshis: 0
      });

      // Get UTXOs for funding
      const utxos = await this.handCashService.getUtxos();
      if (!utxos || utxos.length === 0) {
        throw new Error('No UTXOs available for Bcat transaction funding');
      }

      // Calculate required fee
      const estimatedSize = 200 + (bcatTransaction.parts.length * 32); // Base + part TXIDs
      const feeRequired = Math.max(250, Math.ceil(estimatedSize * 1.2));

      // Fund transaction with UTXOs
      let totalInputValue = 0;
      const selectedUtxos = [];
      
      for (const utxo of utxos) {
        selectedUtxos.push(utxo);
        totalInputValue += utxo.satoshis;
        
        if (totalInputValue >= feeRequired) {
          break;
        }
      }

      if (totalInputValue < feeRequired) {
        throw new Error(`Insufficient funds for Bcat transaction. Need ${feeRequired} sats, have ${totalInputValue} sats`);
      }

      // Add inputs
      selectedUtxos.forEach(utxo => {
        transaction.addInput({
          sourceTXID: utxo.txId,
          sourceOutputIndex: utxo.outputIndex
        });
      });

      // Add change output if needed
      const changeAmount = totalInputValue - feeRequired;
      if (changeAmount > 0) {
        const changeAddress = await this.handCashService.getReceiveAddress();
        transaction.addOutput({
          lockingScript: new P2PKH().lock(changeAddress),
          satoshis: changeAmount
        });
      }

      // Sign and broadcast transaction
      await this.handCashService.signTransaction(transaction);
      const broadcastResult = await this.handCashService.broadcastTransaction(transaction);
      
      const bcatTxId = broadcastResult.txId;

      // Calculate costs
      const cost = await this.estimateCost(content.data.toString(), options);

      // Store Bcat transaction info locally for retrieval
      this.storeBcatTransactionInfo(bcatTxId, bcatTransaction);

      return {
        bcatTxId,
        bcatUrl: this.toBcatUrl(bcatTxId),
        bicoUrl: `https://bico.media/${bcatTxId}`,
        explorerUrl: `https://whatsonchain.com/tx/${bcatTxId}`,
        parts,
        cost,
        size: {
          originalBytes: content.data.length,
          totalStorageBytes: parts.reduce((sum, p) => sum + p.size, 0),
          compressionRatio: content.compressed ? content.data.length / content.data.length : undefined
        }
      };

    } catch (error) {
      console.error('Failed to create Bcat transaction:', error);
      throw error;
    }
  }

  /**
   * Retrieve main Bcat transaction information
   */
  private async retrieveBcatTransaction(bcatTxId: string): Promise<BcatTransaction> {
    try {
      // In production, query blockchain for Bcat transaction
      // For now, retrieve from local storage
      
      const storedInfo = localStorage.getItem(`bcat_${bcatTxId}`);
      if (!storedInfo) {
        throw new Error(`Bcat transaction not found: ${bcatTxId}`);
      }

      return JSON.parse(storedInfo) as BcatTransaction;

    } catch (error) {
      console.error('Failed to retrieve Bcat transaction:', error);
      throw error;
    }
  }

  /**
   * Retrieve all parts in correct order
   */
  private async retrieveParts(partTxIds: string[]): Promise<Buffer[]> {
    const parts: Buffer[] = [];

    for (let i = 0; i < partTxIds.length; i++) {
      try {
        // Try B:// protocol first, then Bcat part format
        let partContent: string;
        
        try {
          partContent = await this.bProtocolService.retrieveContent(`b://${partTxIds[i]}`);
        } catch {
          // Fallback to Bcat part retrieval
          partContent = await this.retrieveBcatPart(partTxIds[i]);
        }

        parts.push(Buffer.from(partContent, 'utf-8'));

      } catch (error) {
        console.error(`Failed to retrieve part ${i}:`, error);
        throw error;
      }
    }

    return parts;
  }

  /**
   * Retrieve single Bcat part
   */
  private async retrieveBcatPart(txId: string): Promise<string> {
    try {
      // In production, retrieve Bcat part from blockchain
      console.log('Retrieving Bcat part (mock):', txId);
      
      // Return mock content for now
      return `Mock Bcat part content for ${txId}`;

    } catch (error) {
      console.error('Failed to retrieve Bcat part:', error);
      throw error;
    }
  }

  /**
   * Concatenate parts to reconstruct original content
   */
  private concatenateParts(parts: Buffer[]): Buffer {
    return Buffer.concat(parts);
  }

  /**
   * Post-process content (decompression, etc.)
   */
  private async postProcessContent(
    content: Buffer,
    bcatTransaction: BcatTransaction
  ): Promise<Buffer> {
    let processedContent = content;

    // Apply decompression if needed
    if (bcatTransaction.flag === 'gzip') {
      // In production, implement gzip decompression
      console.log('Decompression would be applied here');
    }

    return processedContent;
  }

  /**
   * Extract Bcat transaction ID from various reference formats
   */
  private extractBcatTxId(reference: string): string {
    if (reference.startsWith('bcat://')) {
      return reference.substring(7);
    }

    if (reference.includes('bico.media/')) {
      const parts = reference.split('/');
      return parts[parts.length - 1];
    }

    // Assume it's already a transaction ID
    if (/^[a-f0-9]{64}$/i.test(reference)) {
      return reference;
    }

    throw new Error(`Invalid Bcat reference format: ${reference}`);
  }

  /**
   * Check if a part contains meaningful content that should use B:// protocol
   */
  private isPartMeaningful(data: Buffer): boolean {
    // Simple heuristic: if it looks like text or structured data, use B://
    const text = data.toString('utf-8', 0, Math.min(100, data.length));
    
    // Check for common text patterns
    const hasText = /[a-zA-Z\s]/.test(text);
    const hasStructure = /[{}[\]<>]/.test(text);
    
    return hasText || hasStructure;
  }

  /**
   * Detect MIME type from filename
   */
  private detectMimeType(filename?: string): string {
    if (!filename) return 'application/octet-stream';

    const ext = filename.split('.').pop()?.toLowerCase();
    
    switch (ext) {
      case 'txt': return 'text/plain';
      case 'html': return 'text/html';
      case 'md': return 'text/markdown';
      case 'json': return 'application/json';
      case 'pdf': return 'application/pdf';
      case 'doc': case 'docx': return 'application/msword';
      case 'jpg': case 'jpeg': return 'image/jpeg';
      case 'png': return 'image/png';
      case 'gif': return 'image/gif';
      default: return 'application/octet-stream';
    }
  }

  /**
   * Store Bcat transaction info locally for retrieval
   */
  private storeBcatTransactionInfo(txId: string, transaction: BcatTransaction): void {
    localStorage.setItem(`bcat_${txId}`, JSON.stringify(transaction));
  }
}

export default BcatProtocolService;