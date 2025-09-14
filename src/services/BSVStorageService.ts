import { Transaction, Script, PrivateKey, PublicKey, Hash, P2PKH, ARC } from '@bsv/sdk';
import CryptoJS from 'crypto-js';

export interface PricingTier {
  name: string;
  maxWords: number;
  priceUSD: number;
  description: string;
  features: string[];
}

export interface StorageQuote {
  tier: PricingTier;
  wordCount: number;
  bytes: number;
  minerFeeSats: number;
  serviceFeeSats: number;
  totalSats: number;
  totalUSD: number;
  savingsPercent?: number;
}

export interface DocumentPackage {
  version: string;
  timestamp: number;
  author: string;
  title: string;
  content: string;
  contentHash: string;
  encrypted: boolean;
  wordCount: number;
  characterCount: number;
}

export interface StorageResult {
  transactionId: string;
  documentHash: string;
  storageCost: StorageQuote;
  timestamp: number;
  explorerUrl: string;
}

export class BSVStorageService {
  private static readonly BSV_PRICE_USD = 60; // Current BSV price, should be fetched dynamically
  private static readonly SATS_PER_BSV = 100_000_000;
  private static readonly BYTES_PER_WORD = 5; // Average bytes per word
  private static readonly MIN_SATS_PER_BYTE = 0.01; // BSV accepts fractional sats/byte
  
  // Simple flat fee pricing - 1 penny per document
  public static readonly DOCUMENT_PRICE_USD = 0.01; // 1 penny flat fee
  public static readonly DOCUMENT_FEATURES = [
    'Permanent blockchain storage',
    'Immutable proof of authorship', 
    'Timestamp verification',
    'Content hash proof',
    'Public or encrypted storage',
    'Instant global access'
  ];

  private privateKey: PrivateKey | null = null;
  private publicKey: PublicKey | null = null;
  private address: string | null = null;

  constructor() {
    // Initialize with a demo private key (in production, this would come from user's wallet)
    this.initializeKeys();
  }

  private initializeKeys(): void {
    try {
      // Demo private key - in production, this would be derived from user's HandCash auth
      const wif = 'L1PCKrdYNMpYL3QdVbhXqCYeFbN8qKGkFrPxAe6wjVjxYMZQwvKz';
      this.privateKey = PrivateKey.fromWif(wif);
      this.publicKey = this.privateKey.toPublicKey();
      this.address = this.publicKey.toAddress();
      
      console.log('BSV Storage Service initialized');
      console.log('Address:', this.address);
    } catch (error) {
      console.error('Failed to initialize BSV keys:', error);
    }
  }

  // Calculate storage cost - flat 1 penny per document
  public calculateStorageCost(wordCount: number): StorageQuote {
    const bytes = wordCount * BSVStorageService.BYTES_PER_WORD;
    
    // Flat pricing - 1 penny per document regardless of size
    const tier: PricingTier = {
      name: 'standard',
      maxWords: Infinity,
      priceUSD: BSVStorageService.DOCUMENT_PRICE_USD,
      description: `${wordCount.toLocaleString()} words`,
      features: BSVStorageService.DOCUMENT_FEATURES
    };
    
    // Calculate actual BSV miner fees (incredibly low)
    const minerFeeSats = Math.ceil(bytes * BSVStorageService.MIN_SATS_PER_BYTE);
    
    // Convert penny to sats and calculate service fee
    const totalSatsForPenny = this.usdToSats(BSVStorageService.DOCUMENT_PRICE_USD);
    const serviceFeeSats = totalSatsForPenny - minerFeeSats;
    
    const totalSats = totalSatsForPenny;
    const totalUSD = BSVStorageService.DOCUMENT_PRICE_USD;
    
    // Show how much of a bargain this is
    const costPerWord = totalUSD / wordCount;
    const costPerMB = totalUSD / (bytes / 1_000_000);
    
    return {
      tier,
      wordCount,
      bytes,
      minerFeeSats,
      serviceFeeSats,
      totalSats,
      totalUSD,
      savingsPercent: 99 // Always 99% cheaper than traditional storage
    };
  }

  // Store document directly on BSV blockchain
  public async storeDocument(
    content: string,
    title: string,
    author: string,
    encrypted: boolean = false
  ): Promise<StorageResult> {
    if (!this.privateKey) {
      throw new Error('BSV service not initialized');
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
      // Build transaction with OP_FALSE OP_RETURN for unlimited data
      const tx = await this.buildDataTransaction(documentData, quote);
      
      // In production, broadcast to BSV network
      // For now, simulate the transaction
      const txid = await this.simulateBroadcast(tx);
      
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

  // Build BSV transaction with document data
  private async buildDataTransaction(data: Buffer, quote: StorageQuote): Promise<Transaction> {
    if (!this.privateKey || !this.address) {
      throw new Error('Keys not initialized');
    }

    // Create new transaction
    const tx = new Transaction();
    
    // Create a mock source transaction for demo (in production, fetch real UTXOs)
    const mockInputSatoshis = 10000;
    const mockSourceTx = new Transaction();
    mockSourceTx.addOutput({
      lockingScript: new P2PKH().lock(this.address),
      satoshis: mockInputSatoshis
    });
    
    // Add input from mock source transaction
    tx.addInput({
      sourceTransaction: mockSourceTx,
      sourceOutputIndex: 0,
      unlockingScriptTemplate: new P2PKH().unlock(this.privateKey),
    });
    
    // Add data output using OP_FALSE OP_RETURN pattern for unlimited size
    const dataScript = Script.fromASM(`OP_FALSE OP_RETURN ${data.toString('hex')}`);
    tx.addOutput({
      lockingScript: dataScript,
      satoshis: 0 // Data outputs don't need satoshis
    });
    
    // Add change output (remaining funds back to sender)
    const changeAmount = mockInputSatoshis - quote.totalSats;
    if (changeAmount > 546) { // Dust limit
      tx.addOutput({
        lockingScript: new P2PKH().lock(this.address),
        satoshis: changeAmount
      });
    }
    
    // Sign the transaction
    await tx.sign();
    
    // Verify the transaction
    await tx.verify();
    
    return tx;
  }

  // Retrieve document from BSV blockchain
  public async retrieveDocument(txid: string): Promise<DocumentPackage | null> {
    try {
      // In production, fetch from BSV network
      // For demo, retrieve from localStorage simulation
      const storedTx = localStorage.getItem(`bsv_tx_${txid}`);
      if (!storedTx) {
        return null;
      }
      
      const documentPackage: DocumentPackage = JSON.parse(storedTx);
      
      // Decrypt if necessary
      if (documentPackage.encrypted && this.privateKey) {
        documentPackage.content = this.decryptContent(documentPackage.content);
      }
      
      return documentPackage;
    } catch (error) {
      console.error('Failed to retrieve document:', error);
      return null;
    }
  }

  // Simulate broadcast (in production, use ARC or other BSV node API)
  private async simulateBroadcast(tx: Transaction): Promise<string> {
    const txid = tx.id('hex');
    
    // Store in localStorage for demo
    const txData = tx.toHex();
    localStorage.setItem(`bsv_tx_${txid}`, txData);
    
    console.log('Transaction "broadcast" (simulated):', {
      txid,
      size: txData.length / 2,
      fee: tx.getFee()
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

  // Get current BSV price (in production, fetch from API)
  public async getCurrentBSVPrice(): Promise<number> {
    // In production, fetch from price API
    return BSVStorageService.BSV_PRICE_USD;
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