import { Transaction, Script, PrivateKey, PublicKey, P2PKH } from '@bsv/sdk';
import CryptoJS from 'crypto-js';
import { EncryptionService } from '../utils/encryptionUtils';
import { NoteSVEncryption } from './NoteSVEncryption';
import { UnlockConditions, BlockchainSaveOptions } from '../components/SaveToBlockchainModal';
import { HandCashService } from './HandCashService';

export interface AutoSaveBudget {
  currentLimit: number;  // Current budget in USD (default 0.01)
  suggestedLimit?: number; // Suggested new limit when approaching current
  requiresIncrease: boolean; // True when document exceeds current budget
}

export interface StorageQuote {
  wordCount: number;
  bytes: number;
  minerFeeSats: number;
  serviceFeeSats: number;
  totalSats: number;
  totalUSD: number;
  budget: AutoSaveBudget;
  costPerWord: number;
  description: string;
}

export interface DocumentPackage {
  version: string;
  timestamp: number;
  author: string;
  title: string;
  content: string;
  contentHash: string;
  encrypted: boolean;
  encryptionData?: {
    method: 'password' | 'timelock' | 'multiparty' | 'notesv';
    salt?: string;
    iv?: string;
    unlockConditions?: any;
    // NoteSV specific fields
    hmac?: string;
    iterations?: number;
  };
  wordCount: number;
  characterCount: number;
  unlockConditions?: UnlockConditions;
  metadata?: {
    description?: string;
    tags?: string[];
    category?: string;
  };
  monetization?: {
    nft?: boolean;
    royaltyPercentage?: number;
    initialPrice?: number;
    maxSupply?: number;
  };
}

export interface StorageResult {
  transactionId: string;
  documentHash: string;
  storageCost: StorageQuote;
  timestamp: number;
  explorerUrl: string;
  unlockLink?: string;
  paymentAddress?: string;
}

export class BSVStorageService {
  private static readonly BSV_PRICE_USD = 60; // Current BSV price, should be fetched dynamically
  private static readonly SATS_PER_BSV = 100_000_000;
  private static readonly BYTES_PER_WORD = 5; // Average bytes per word
  private static readonly SATS_PER_BYTE = 0.05; // Actual BSV miner fee rate
  private static readonly SERVICE_MARKUP = 2.0; // We charge 2x the miner fee
  
  // Auto-save budget limits
  public static readonly DEFAULT_BUDGET_USD = 0.01; // 1 penny default
  public static readonly BUDGET_INCREASE_THRESHOLD = 5000; // Words before prompting
  public static readonly BUDGET_INCREMENTS = [0.01, 0.02, 0.05, 0.10]; // Budget options
  
  // Premium features pricing
  public static readonly ENCRYPTION_MULTIPLIER = 1.5; // 50% extra for encryption
  public static readonly NFT_CERTIFICATE_FEE = 0.001; // Extra for NFT minting

  private privateKey: PrivateKey | null = null;
  private publicKey: PublicKey | null = null;
  private address: string | null = null;
  private handcashService: HandCashService | null = null;

  constructor(handcashService?: HandCashService) {
    // HandCash handles all key management - no need for local keys
    this.handcashService = handcashService || null;
    console.log('BSV Storage Service initialized (using HandCash for transactions)');
  }

  private initializeKeys(): void {
    // Keys are managed by HandCash - no local initialization needed
    // This method is kept for backward compatibility but does nothing
    console.log('Using HandCash for key management');
  }

  // Calculate storage cost with actual miner fees + 2x markup
  public calculateStorageCost(
    wordCount: number, 
    encrypted: boolean = false,
    currentBudget: number = BSVStorageService.DEFAULT_BUDGET_USD
  ): StorageQuote {
    const bytes = wordCount * BSVStorageService.BYTES_PER_WORD;
    
    // Calculate actual BSV miner fees
    const minerFeeSats = Math.ceil(bytes * BSVStorageService.SATS_PER_BYTE);
    
    // Apply 2x markup for service fee
    let totalFeeSats = minerFeeSats * BSVStorageService.SERVICE_MARKUP;
    
    // Add encryption cost if enabled (50% extra)
    if (encrypted) {
      totalFeeSats = totalFeeSats * BSVStorageService.ENCRYPTION_MULTIPLIER;
    }
    
    const serviceFeeSats = totalFeeSats - minerFeeSats;
    const totalUSD = this.satsToUsd(totalFeeSats);
    
    // Determine if budget increase is needed
    const budget: AutoSaveBudget = {
      currentLimit: currentBudget,
      requiresIncrease: totalUSD > currentBudget
    };
    
    // Suggest budget increase at 5000+ words or if cost exceeds current budget
    if (wordCount >= BSVStorageService.BUDGET_INCREASE_THRESHOLD || totalUSD > currentBudget) {
      // Find next budget tier
      const nextBudget = BSVStorageService.BUDGET_INCREMENTS.find(b => b > totalUSD);
      budget.suggestedLimit = nextBudget || totalUSD * 2;
    }
    
    const costPerWord = totalUSD / wordCount;
    const costPerThousandWords = costPerWord * 1000;
    
    return {
      wordCount,
      bytes,
      minerFeeSats,
      serviceFeeSats,
      totalSats: totalFeeSats,
      totalUSD,
      budget,
      costPerWord,
      description: `${costPerThousandWords.toFixed(4)}¢ per 1k words${encrypted ? ' (encrypted)' : ''}`
    };
  }

  // Store document directly on BSV blockchain with advanced options
  public async storeDocumentWithOptions(
    content: string,
    options: BlockchainSaveOptions,
    author: string
  ): Promise<StorageResult> {
    // Check if we have HandCash service
    if (!this.handcashService || !this.handcashService.isAuthenticated()) {
      throw new Error('HandCash authentication required for blockchain storage');
    }

    const wordCount = this.countWords(content);
    const quote = this.calculateStorageCost(wordCount, options.encryption);
    
    // Handle encryption based on method
    let encryptedContent = content;
    let encryptionData: any = undefined;
    
    if (options.encryption && options.encryptionMethod) {
      switch (options.encryptionMethod) {
        case 'password':
          if (!options.encryptionPassword) throw new Error('Password required');
          const passwordResult = EncryptionService.encryptWithPassword(content, options.encryptionPassword);
          encryptedContent = passwordResult.encryptedData;
          encryptionData = {
            method: 'password',
            salt: passwordResult.salt,
            iv: passwordResult.iv
          };
          break;
          
        case 'notesv':
          if (!options.encryptionPassword) throw new Error('Password required for NoteSV encryption');
          const noteSVResult = NoteSVEncryption.encrypt(content, options.encryptionPassword);
          encryptedContent = noteSVResult.encryptedContent;
          encryptionData = {
            method: 'notesv',
            salt: noteSVResult.salt,
            iv: noteSVResult.iv,
            hmac: noteSVResult.hmac,
            iterations: noteSVResult.iterations
          };
          break;
          
        case 'timelock':
          if (!options.unlockConditions.unlockTime) throw new Error('Unlock time required');
          const timelockResult = EncryptionService.encryptWithTimelock(content, options.unlockConditions.unlockTime);
          encryptedContent = timelockResult.encryptedData;
          encryptionData = {
            method: 'timelock',
            unlockConditions: timelockResult.unlockConditions
          };
          break;
          
        case 'multiparty':
          // Use HandCash identity for encryption
          if (this.handcashService) {
            const user = this.handcashService.getCurrentUser();
            const token = this.handcashService.getAccessToken();
            if (user && token) {
              // Create a deterministic encryption key from user's HandCash identity
              const identityKey = CryptoJS.SHA256(`${user.handle}_${user.paymail}_${token.substring(0, 32)}`).toString();
              
              // Encrypt with HandCash identity
              const encrypted = CryptoJS.AES.encrypt(content, identityKey).toString();
              encryptedContent = encrypted;
              encryptionData = {
                method: 'multiparty',
                handcashIdentity: user.handle,
                description: 'Encrypted with your HandCash identity'
              };
              break;
            }
          }
          // Fallback to default multiparty if no HandCash available
          const multipartyResult = EncryptionService.encryptMultiparty(content, 2);
          encryptedContent = multipartyResult.encryptedData;
          encryptionData = {
            method: 'multiparty',
            unlockConditions: multipartyResult.unlockConditions
          };
          break;
      }
    }
    
    // Create document package with all metadata
    const documentPackage: DocumentPackage = {
      version: '2.0',
      timestamp: Date.now(),
      author,
      title: options.metadata.title,
      content: encryptedContent,
      contentHash: this.hashContent(content),
      encrypted: options.encryption,
      encryptionData,
      wordCount,
      characterCount: content.length,
      unlockConditions: options.unlockConditions,
      metadata: {
        description: options.metadata.description,
        tags: options.metadata.tags,
        category: options.metadata.category
      },
      monetization: options.monetization.enableAsset ? {
        nft: true,
        royaltyPercentage: options.monetization.royaltyPercentage,
        initialPrice: options.monetization.initialPrice,
        maxSupply: options.monetization.maxSupply
      } : undefined
    };
    
    // Convert to buffer for storage
    const documentData = Buffer.from(JSON.stringify(documentPackage));
    
    try {
      // Send data to blockchain via HandCash
      const txid = await this.broadcastViaHandCash(documentData, quote);
      
      // Generate unlock link if needed
      let unlockLink: string | undefined;
      if (options.unlockConditions.method !== 'immediate') {
        unlockLink = EncryptionService.createUnlockLink(txid, options.encryptionPassword);
      }
      
      // Generate payment address for priced content
      let paymentAddress: string | undefined;
      if (options.unlockConditions.method === 'priced' || options.unlockConditions.method === 'timedAndPriced') {
        // Use HandCash paymail for payments
        const user = this.handcashService.getCurrentUser();
        paymentAddress = user?.paymail || undefined;
      }
      
      return {
        transactionId: txid,
        documentHash: documentPackage.contentHash,
        storageCost: quote,
        timestamp: documentPackage.timestamp,
        explorerUrl: `https://whatsonchain.com/tx/${txid}`,
        unlockLink,
        paymentAddress
      };
    } catch (error) {
      console.error('Failed to store document on BSV:', error);
      throw new Error('Failed to store document on blockchain');
    }
  }
  
  // Legacy method for backward compatibility
  public async storeDocument(
    content: string,
    title: string,
    author: string,
    encrypted: boolean = false
  ): Promise<StorageResult> {
    // Check if we have HandCash service
    if (!this.handcashService || !this.handcashService.isAuthenticated()) {
      throw new Error('HandCash authentication required for blockchain storage');
    }

    const wordCount = this.countWords(content);
    const quote = this.calculateStorageCost(wordCount);
    
    // Create document package
    const documentPackage: DocumentPackage = {
      version: '1.0',
      timestamp: Date.now(),
      author,
      title,
      content: encrypted ? this.encryptContent(content) : content,
      contentHash: this.hashContent(content),
      encrypted,
      wordCount,
      characterCount: content.length
    };
    
    // Convert to buffer for storage
    const documentData = Buffer.from(JSON.stringify(documentPackage));
    
    try {
      // Send data to blockchain via HandCash
      const txid = await this.broadcastViaHandCash(documentData, quote);
      
      return {
        transactionId: txid,
        documentHash: documentPackage.contentHash,
        storageCost: quote,
        timestamp: documentPackage.timestamp,
        explorerUrl: `https://whatsonchain.com/tx/${txid}`
      };
    } catch (error) {
      console.error('Failed to store document on BSV:', error);
      throw new Error('Failed to store document on blockchain');
    }
  }

  // Broadcast transaction via BSV SDK and HandCash
  private async broadcastViaHandCash(data: Buffer, quote: StorageQuote): Promise<string> {
    if (!this.handcashService) {
      throw new Error('HandCash service not available');
    }

    try {
      // Get current user for paymail
      const user = this.handcashService.getCurrentUser();
      if (!user) {
        throw new Error('No authenticated user');
      }

      // Create real BSV transaction with data
      const txResult = await this.createRealBSVTransaction(data, quote, user.paymail);
      
      console.log('Document stored on blockchain:', txResult.txid);
      return txResult.txid;
      
    } catch (error) {
      console.error('BSV broadcast error:', error);
      // Fallback to simulation for development
      if (process.env.NODE_ENV === 'development') {
        console.log('Falling back to simulated broadcast in development mode');
        return this.simulateBroadcast(data, quote);
      }
      throw error;
    }
  }

  // Create real BSV transaction using simplified approach
  private async createRealBSVTransaction(
    data: Buffer, 
    quote: StorageQuote, 
    paymail: string
  ): Promise<{ txid: string; rawTx: string }> {
    try {
      // For now, use HandCash Connect API for data transactions
      // This is more reliable than manual transaction construction
      const dataHex = data.toString('hex');
      
      // Create HandCash data transaction payload
      const dataPayload = {
        description: 'Bitcoin Writer Document Storage',
        data: [{
          value: dataHex,
          encoding: 'hex'
        }],
        payments: [], // No payments for data-only transaction
        attachment: {
          format: 'json',
          value: {
            app: 'BitcoinWriter',
            type: 'document_storage',
            timestamp: Date.now(),
            size: data.length
          }
        }
      };

      // Make authenticated request to HandCash data endpoint
      if (!this.handcashService) {
        throw new Error('HandCash service not available');
      }

      const response = await this.handcashService.makeAuthenticatedRequest(
        '/v1/connect/data',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(dataPayload)
        }
      );

      if (response.transactionId) {
        return {
          txid: response.transactionId,
          rawTx: response.rawTransaction || 'handcash_managed'
        };
      } else {
        throw new Error('No transaction ID returned from HandCash');
      }
      
    } catch (error) {
      console.error('Failed to create BSV transaction:', error);
      throw new Error(`BSV transaction creation failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  // Split data into manageable chunks
  private splitDataIntoChunks(data: Buffer, chunkSize: number): Buffer[] {
    const chunks: Buffer[] = [];
    for (let i = 0; i < data.length; i += chunkSize) {
      chunks.push(data.slice(i, i + chunkSize));
    }
    return chunks;
  }

  // Broadcast transaction to BSV network (simplified version)
  private async broadcastToBSVNetwork(rawTx: string): Promise<string> {
    try {
      // Use WhatsOnChain API for broadcasting
      const response = await fetch('https://api.whatsonchain.com/v1/bsv/main/tx/raw', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          txhex: rawTx
        })
      });

      if (!response.ok) {
        throw new Error(`Broadcast failed: ${response.statusText}`);
      }

      const result = await response.text();
      
      // WhatsOnChain returns the txid on successful broadcast
      return result.replace(/['"]/g, ''); // Remove quotes
      
    } catch (error) {
      console.error('Failed to broadcast to BSV network:', error);
      throw new Error(`Broadcast failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  // Retrieve document from BSV blockchain
  public async retrieveDocument(txid: string): Promise<DocumentPackage | null> {
    try {
      // Fetch transaction from BSV network
      const txData = await this.fetchTransactionFromBSV(txid);
      if (!txData) {
        return null;
      }

      // Extract document data from OP_RETURN outputs
      const documentData = this.extractDocumentFromTransaction(txData);
      if (!documentData) {
        return null;
      }

      const documentPackage: DocumentPackage = JSON.parse(documentData);
      
      // Decrypt if necessary and user has access
      if (documentPackage.encrypted) {
        // For now, we'll return the encrypted version
        // Decryption should be handled by the calling code with proper credentials
        console.log('Document is encrypted, returning encrypted version');
      }
      
      return documentPackage;
    } catch (error) {
      console.error('Failed to retrieve document:', error);
      // Fallback to localStorage for development
      if (process.env.NODE_ENV === 'development') {
        const storedTx = localStorage.getItem(`bsv_tx_${txid}`);
        if (storedTx) {
          try {
            return JSON.parse(Buffer.from(storedTx, 'hex').toString());
          } catch (parseError) {
            console.error('Failed to parse stored transaction:', parseError);
          }
        }
      }
      return null;
    }
  }

  // Fetch transaction data from BSV network
  private async fetchTransactionFromBSV(txid: string): Promise<any> {
    try {
      // Use WhatsOnChain API to fetch transaction
      const response = await fetch(`https://api.whatsonchain.com/v1/bsv/main/tx/${txid}/hex`);
      
      if (!response.ok) {
        throw new Error(`Failed to fetch transaction: ${response.statusText}`);
      }

      const hexData = await response.text();
      
      // Parse the raw transaction
      const tx = Transaction.fromHex(hexData);
      
      return {
        txid,
        hex: hexData,
        transaction: tx,
        outputs: tx.outputs
      };
      
    } catch (error) {
      console.error('Failed to fetch transaction from BSV:', error);
      return null;
    }
  }

  // Extract document data from transaction outputs
  private extractDocumentFromTransaction(txData: any): string | null {
    try {
      // Look for OP_RETURN outputs containing our document data
      for (const output of txData.outputs) {
        const script = output.script;
        
        // Check if this is an OP_RETURN output
        if (script && script.chunks && script.chunks.length > 0) {
          const firstChunk = script.chunks[0];
          
          // Check for OP_RETURN opcode
          if (firstChunk.opCodeNum === 106) { // OP_RETURN opcode value
            // Combine all data chunks after OP_RETURN
            let documentData = '';
            
            for (let i = 1; i < script.chunks.length; i++) {
              const chunk = script.chunks[i];
              if (chunk.buf) {
                documentData += chunk.buf.toString();
              }
            }
            
            if (documentData) {
              return documentData;
            }
          }
        }
      }
      
      return null;
    } catch (error) {
      console.error('Failed to extract document from transaction:', error);
      return null;
    }
  }

  // Simulate broadcast for development
  private async simulateBroadcast(data: Buffer, quote: StorageQuote): Promise<string> {
    // Generate a fake but realistic looking txid
    const randomBytes = CryptoJS.lib.WordArray.random(32);
    const txid = CryptoJS.enc.Hex.stringify(randomBytes);
    
    // Store in localStorage for demo
    localStorage.setItem(`bsv_tx_${txid}`, data.toString('hex'));
    
    console.log('Transaction "broadcast" (simulated):', {
      txid,
      size: data.length,
      cost: quote.totalUSD
    });
    
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    return txid;
  }

  // Utility functions
  private countWords(text: string): number {
    return text.trim().split(/\s+/).filter(word => word.length > 0).length;
  }

  private hashContent(content: string): string {
    return CryptoJS.SHA256(content).toString();
  }

  private encryptContent(content: string): string {
    // Simple encryption for demo - in production, use user's key
    const key = 'demo-encryption-key';
    return CryptoJS.AES.encrypt(content, key).toString();
  }

  private decryptContent(encryptedContent: string): string {
    const key = 'demo-encryption-key';
    const bytes = CryptoJS.AES.decrypt(encryptedContent, key);
    return bytes.toString(CryptoJS.enc.Utf8);
  }

  private usdToSats(usd: number): number {
    return Math.ceil((usd / BSVStorageService.BSV_PRICE_USD) * BSVStorageService.SATS_PER_BSV);
  }

  private satsToUsd(sats: number): number {
    return (sats / BSVStorageService.SATS_PER_BSV) * BSVStorageService.BSV_PRICE_USD;
  }

  // Get current BSV price from multiple sources
  public async getCurrentBSVPrice(): Promise<number> {
    try {
      // Try multiple price sources for reliability
      const priceSources = [
        'https://api.coinbase.com/v2/exchange-rates?currency=BSV',
        'https://api.coingecko.com/api/v3/simple/price?ids=bitcoin-sv&vs_currencies=usd',
        'https://api.whatsonchain.com/v1/bsv/main/exchangerate'
      ];

      for (const source of priceSources) {
        try {
          const price = await this.fetchPriceFromSource(source);
          if (price && price > 0) {
            console.log(`BSV price fetched: $${price} from ${source}`);
            return price;
          }
        } catch (error) {
          console.warn(`Failed to fetch price from ${source}:`, error);
        }
      }

      // Fallback to static price
      console.warn('All price sources failed, using fallback price');
      return BSVStorageService.BSV_PRICE_USD;
      
    } catch (error) {
      console.error('Failed to get BSV price:', error);
      return BSVStorageService.BSV_PRICE_USD;
    }
  }

  // Fetch price from a specific source
  private async fetchPriceFromSource(source: string): Promise<number | null> {
    try {
      const response = await fetch(source);
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      const data = await response.json();

      // Parse different API response formats
      if (source.includes('coinbase')) {
        return parseFloat(data.data?.rates?.USD || '0');
      } else if (source.includes('coingecko')) {
        return parseFloat(data['bitcoin-sv']?.usd || '0');
      } else if (source.includes('whatsonchain')) {
        return parseFloat(data.rate || '0');
      }

      return null;
    } catch (error) {
      throw new Error(`Price fetch failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  // Get real-time fee estimation from BSV network
  public async getNetworkFeeRate(): Promise<number> {
    try {
      // Fetch current network fee rate from WhatsOnChain
      const response = await fetch('https://api.whatsonchain.com/v1/bsv/main/fees');
      
      if (response.ok) {
        const feeData = await response.json();
        // Return fee rate in satoshis per byte
        return parseFloat(feeData.standard || BSVStorageService.SATS_PER_BYTE);
      }
    } catch (error) {
      console.warn('Failed to fetch network fee rate:', error);
    }

    // Fallback to static rate
    return BSVStorageService.SATS_PER_BYTE;
  }

  // Update storage cost calculation with real-time data
  public async calculateStorageCostRealTime(
    wordCount: number, 
    encrypted: boolean = false,
    currentBudget: number = BSVStorageService.DEFAULT_BUDGET_USD
  ): Promise<StorageQuote> {
    // Get real-time BSV price and fee rate
    const [bsvPrice, feeRate] = await Promise.all([
      this.getCurrentBSVPrice(),
      this.getNetworkFeeRate()
    ]);

    const bytes = wordCount * BSVStorageService.BYTES_PER_WORD;
    
    // Calculate actual miner fees with real-time rate
    const minerFeeSats = Math.ceil(bytes * feeRate);
    
    // Apply service markup
    let totalFeeSats = minerFeeSats * BSVStorageService.SERVICE_MARKUP;
    
    // Add encryption cost if enabled
    if (encrypted) {
      totalFeeSats = totalFeeSats * BSVStorageService.ENCRYPTION_MULTIPLIER;
    }
    
    const serviceFeeSats = totalFeeSats - minerFeeSats;
    
    // Calculate USD cost with real-time price
    const totalUSD = (totalFeeSats / BSVStorageService.SATS_PER_BSV) * bsvPrice;
    
    // Determine budget requirements
    const budget: AutoSaveBudget = {
      currentLimit: currentBudget,
      requiresIncrease: totalUSD > currentBudget
    };
    
    if (wordCount >= BSVStorageService.BUDGET_INCREASE_THRESHOLD || totalUSD > currentBudget) {
      const nextBudget = BSVStorageService.BUDGET_INCREMENTS.find(b => b > totalUSD);
      budget.suggestedLimit = nextBudget || totalUSD * 2;
    }
    
    const costPerWord = totalUSD / wordCount;
    const costPerThousandWords = costPerWord * 1000;
    
    return {
      wordCount,
      bytes,
      minerFeeSats,
      serviceFeeSats,
      totalSats: totalFeeSats,
      totalUSD,
      budget,
      costPerWord,
      description: `${costPerThousandWords.toFixed(4)}¢ per 1k words${encrypted ? ' (encrypted)' : ''} (BSV: $${bsvPrice.toFixed(2)})`
    };
  }

  // Check if service is ready
  public isReady(): boolean {
    return this.privateKey !== null && this.address !== null;
  }

  // Get service address for funding
  public getAddress(): string | null {
    return this.address;
  }
}

export default BSVStorageService;