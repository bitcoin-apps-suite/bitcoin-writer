/**
 * B:// Protocol Service
 * Implements the B:// protocol for standardized content storage on BSV blockchain
 * Compatible with Bico.Media and the broader BSV ecosystem
 */

import { Transaction, Script, PrivateKey, PublicKey, P2PKH } from '@bsv/sdk';
import CryptoJS from 'crypto-js';
import { HandCashService, UTXO } from './HandCashService';

// B:// Protocol specification
export interface BProtocolTransaction {
  protocol: 'B://';
  data: Buffer;
  mediaType: string;
  encoding?: string;
  filename?: string;
}

export interface BProtocolResult {
  txId: string;
  bUrl: string; // b://txId format
  bicoUrl: string; // https://bico.media/txId
  explorerUrl: string;
  cost: {
    minerFeeSats: number;
    totalSats: number;
    totalUSD: number;
  };
  size: {
    bytes: number;
    words: number;
  };
}

export interface BProtocolOptions {
  mediaType?: string;
  encoding?: string;
  filename?: string;
  compress?: boolean;
  encrypt?: boolean;
  encryptionKey?: string;
}

export class BProtocolService {
  private handCashService: HandCashService;
  private readonly B_PROTOCOL_PREFIX = '19HxigV4QyBv3tHpQVcUEQyq1pzZVdoAut'; // B:// protocol identifier

  constructor(handCashService: HandCashService) {
    this.handCashService = handCashService;
  }

  /**
   * Store content using B:// protocol format
   */
  async storeContent(
    content: string,
    options: BProtocolOptions = {}
  ): Promise<BProtocolResult> {
    if (!this.handCashService.isAuthenticated()) {
      throw new Error('User must be authenticated to store content');
    }

    try {
      // Prepare content
      const processedContent = await this.prepareContent(content, options);
      
      // Create B:// protocol transaction
      const transaction = await this.createBProtocolTransaction(processedContent, options);
      
      // Broadcast transaction via HandCash
      const txResult = await this.broadcastTransaction(transaction);
      
      // Calculate costs
      const cost = this.calculateCost(transaction, processedContent.data.length);
      
      return {
        txId: txResult.txId,
        bUrl: `b://${txResult.txId}`,
        bicoUrl: `https://bico.media/${txResult.txId}`,
        explorerUrl: `https://whatsonchain.com/tx/${txResult.txId}`,
        cost,
        size: {
          bytes: processedContent.data.length,
          words: this.countWords(content)
        }
      };
      
    } catch (error) {
      console.error('Failed to store content with B:// protocol:', error);
      throw error;
    }
  }

  /**
   * Retrieve content from B:// URL or transaction ID
   */
  async retrieveContent(reference: string): Promise<string> {
    try {
      // Extract transaction ID from various formats
      const txId = this.extractTxId(reference);
      
      // Try Bico.Media first for fast CDN delivery
      try {
        const bicoContent = await this.retrieveFromBico(txId);
        if (bicoContent) {
          return bicoContent;
        }
      } catch (error) {
        console.warn('Bico.Media retrieval failed, falling back to blockchain:', error);
      }
      
      // Fallback to direct blockchain retrieval
      return await this.retrieveFromBlockchain(txId);
      
    } catch (error) {
      console.error('Failed to retrieve B:// content:', error);
      throw error;
    }
  }

  /**
   * Estimate cost for storing content with B:// protocol
   */
  async estimateCost(content: string, options: BProtocolOptions = {}): Promise<BProtocolResult['cost']> {
    const processedContent = await this.prepareContent(content, options);
    const mockTransaction = await this.createBProtocolTransaction(processedContent, options, true);
    return this.calculateCost(mockTransaction, processedContent.data.length);
  }

  /**
   * Check if a reference is a valid B:// URL
   */
  isValidBUrl(reference: string): boolean {
    const bUrlPattern = /^b:\/\/[a-f0-9]{64}$/i;
    return bUrlPattern.test(reference);
  }

  /**
   * Convert transaction ID to B:// URL
   */
  toBUrl(txId: string): string {
    if (!this.isValidTxId(txId)) {
      throw new Error('Invalid transaction ID');
    }
    return `b://${txId}`;
  }

  /**
   * Prepare content for B:// protocol storage
   */
  private async prepareContent(
    content: string, 
    options: BProtocolOptions
  ): Promise<{ data: Buffer; mediaType: string; encoding?: string; filename?: string }> {
    let processedContent = content;
    let mediaType = options.mediaType || 'text/plain';
    let encoding = options.encoding;
    let filename = options.filename;

    // Encrypt if requested
    if (options.encrypt && options.encryptionKey) {
      processedContent = CryptoJS.AES.encrypt(content, options.encryptionKey).toString();
      mediaType = 'application/encrypted';
    }

    // Compress if requested or if content is large
    if (options.compress || processedContent.length > 50000) {
      // Note: In production, implement gzip compression
      // For now, we'll flag it for future implementation
      console.log('Compression requested - to be implemented');
    }

    // Auto-detect media type for common content types
    if (!options.mediaType) {
      mediaType = this.detectMediaType(content, filename);
    }

    // Auto-detect encoding
    if (!encoding && mediaType.startsWith('text/')) {
      encoding = 'utf-8';
    }

    return {
      data: Buffer.from(processedContent, 'utf-8'),
      mediaType,
      encoding,
      filename
    };
  }

  /**
   * Create B:// protocol transaction
   */
  private async createBProtocolTransaction(
    content: { data: Buffer; mediaType: string; encoding?: string; filename?: string },
    options: BProtocolOptions,
    estimateOnly: boolean = false
  ): Promise<Transaction> {
    try {
      // Get current user for transaction signing
      const user = this.handCashService.getCurrentUser();
      if (!user && !estimateOnly) {
        throw new Error('User authentication required for B:// protocol transactions');
      }

      // Create OP_RETURN script with B:// protocol format
      const opReturnData = [
        Buffer.from(this.B_PROTOCOL_PREFIX, 'utf-8'), // Protocol identifier: 19HxigV4QyBv3tHpQVcUEQyq1pzZVdoAut
        content.data, // Content data
        Buffer.from(content.mediaType, 'utf-8'), // Media type
        content.encoding ? Buffer.from(content.encoding, 'utf-8') : Buffer.alloc(0), // Encoding (optional)
        content.filename ? Buffer.from(content.filename, 'utf-8') : Buffer.alloc(0) // Filename (optional)
      ];

      // Build OP_RETURN script using BSV SDK
      const script = new Script();
      
      // Add OP_RETURN opcode
      script.writeOpCode(106); // OP_RETURN
      
      // Add protocol data chunks
      opReturnData.forEach(data => {
        if (data.length > 0) {
          // Convert Buffer to number array for BSV SDK
          const dataArray = Array.from(data);
          script.writeBin(dataArray);
        }
      });

      // Create transaction
      const transaction = new Transaction();
      
      // Add OP_RETURN output
      transaction.addOutput({
        lockingScript: script,
        satoshis: 0
      });

      if (!estimateOnly && user) {
        // Get UTXOs for funding the transaction
        const utxos = await this.handCashService.getUtxos();
        if (!utxos || utxos.length === 0) {
          throw new Error('No UTXOs available for transaction funding');
        }

        // Calculate required fee (1 sat/byte + some buffer)
        const estimatedSize = transaction.toString().length / 2; // Rough estimate
        const feeRequired = Math.max(250, Math.ceil(estimatedSize * 1.2)); // Min 250 sats

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
          throw new Error(`Insufficient funds. Need ${feeRequired} sats, have ${totalInputValue} sats`);
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

        // Sign transaction with HandCash
        await this.handCashService.signTransaction(transaction);
        
        console.log('B:// protocol transaction created and signed:', transaction.id);
      }

      return transaction;
      
    } catch (error) {
      console.error('Failed to create B:// protocol transaction:', error);
      throw error;
    }
  }

  /**
   * Broadcast transaction via HandCash
   */
  private async broadcastTransaction(transaction: Transaction): Promise<{ txId: string }> {
    try {
      // Validate transaction before broadcasting
      if (!transaction.id) {
        throw new Error('Transaction must be signed before broadcasting');
      }

      // Broadcast via HandCash API
      const broadcastResult = await this.handCashService.broadcastTransaction(transaction);
      
      if (!broadcastResult || !broadcastResult.txId) {
        throw new Error('Failed to broadcast transaction - no transaction ID returned');
      }

      console.log('B:// protocol transaction broadcasted successfully:', broadcastResult.txId);
      
      // Store transaction locally for reference
      const storageKey = `b_protocol_tx_${broadcastResult.txId}`;
      localStorage.setItem(storageKey, JSON.stringify({
        txId: broadcastResult.txId,
        timestamp: new Date().toISOString(),
        protocol: 'B://',
        size: transaction.toString().length / 2
      }));
      
      return broadcastResult;
      
    } catch (error) {
      console.error('Failed to broadcast B:// protocol transaction:', error);
      throw error;
    }
  }

  /**
   * Retrieve content from Bico.Media CDN
   */
  private async retrieveFromBico(txId: string): Promise<string> {
    try {
      const response = await fetch(`https://bico.media/${txId}`);
      
      if (!response.ok) {
        throw new Error(`Bico.Media returned ${response.status}: ${response.statusText}`);
      }
      
      return await response.text();
      
    } catch (error) {
      console.error('Failed to retrieve from Bico.Media:', error);
      throw error;
    }
  }

  /**
   * Retrieve content directly from blockchain
   */
  private async retrieveFromBlockchain(txId: string): Promise<string> {
    try {
      // In production, implement direct blockchain querying
      // For now, return mock content
      console.log('Retrieving from blockchain (mock):', txId);
      return 'Mock content retrieved from blockchain';
      
    } catch (error) {
      console.error('Failed to retrieve from blockchain:', error);
      throw error;
    }
  }

  /**
   * Calculate storage costs
   */
  private calculateCost(transaction: Transaction, dataSize: number): BProtocolResult['cost'] {
    // Simplified cost calculation
    const baseFee = 500; // 500 satoshis base fee
    const dataFee = Math.ceil(dataSize / 1000) * 100; // 100 sats per KB
    const totalSats = baseFee + dataFee;
    
    // Convert to USD (mock rate - in production, use real exchange rate)
    const bsvToUsd = 50; // $50 per BSV
    const satsPerBsv = 100000000;
    const totalUSD = (totalSats / satsPerBsv) * bsvToUsd;
    
    return {
      minerFeeSats: baseFee,
      totalSats: totalSats,
      totalUSD: totalUSD
    };
  }

  /**
   * Extract transaction ID from various reference formats
   */
  private extractTxId(reference: string): string {
    // Handle b://txId format
    if (reference.startsWith('b://')) {
      return reference.substring(4);
    }
    
    // Handle bico.media URLs
    if (reference.includes('bico.media/')) {
      const parts = reference.split('/');
      return parts[parts.length - 1];
    }
    
    // Handle explorer URLs
    if (reference.includes('whatsonchain.com/tx/')) {
      const parts = reference.split('/');
      return parts[parts.length - 1];
    }
    
    // Assume it's already a transaction ID
    if (this.isValidTxId(reference)) {
      return reference;
    }
    
    throw new Error(`Invalid B:// reference format: ${reference}`);
  }

  /**
   * Detect media type from content or filename
   */
  private detectMediaType(content: string, filename?: string): string {
    // Check filename extension
    if (filename) {
      const ext = filename.split('.').pop()?.toLowerCase();
      switch (ext) {
        case 'html': return 'text/html';
        case 'md': return 'text/markdown';
        case 'json': return 'application/json';
        case 'xml': return 'application/xml';
        case 'css': return 'text/css';
        case 'js': return 'application/javascript';
      }
    }
    
    // Check content patterns
    if (content.trim().startsWith('<html') || content.includes('<!DOCTYPE html>')) {
      return 'text/html';
    }
    
    if (content.trim().startsWith('{') && content.trim().endsWith('}')) {
      try {
        JSON.parse(content);
        return 'application/json';
      } catch {
        // Not valid JSON
      }
    }
    
    // Default to plain text
    return 'text/plain';
  }

  /**
   * Validate transaction ID format
   */
  private isValidTxId(txId: string): boolean {
    return /^[a-f0-9]{64}$/i.test(txId);
  }

  /**
   * Count words in content
   */
  private countWords(content: string): number {
    return content.trim().split(/\s+/).filter(word => word.length > 0).length;
  }

  /**
   * Get protocol badge information for B:// protocol
   */
  getProtocolBadge(txId: string): { name: string; description: string; color: string; icon: string } | null {
    if (!txId) return null;
    
    return {
      name: 'B://',
      description: 'Basic file storage protocol - stores files directly on BSV blockchain with B:// addressing for immediate content retrieval',
      color: '#FF6600', // Orange
      icon: '📄' // Document icon
    };
  }
}

export default BProtocolService;