import CryptoJS from 'crypto-js';
import { HandCashService, HandCashUser } from './HandCashService';
import { StorageMethod } from '../components/EnhancedStorageModal';
import BSVStorageService, { StorageQuote } from './BSVStorageService';
import HandCashNFTService, { NFTMintOptions } from './HandCashNFTService';
import { NoteSVEncryption } from './NoteSVEncryption';
import BProtocolService, { BProtocolResult, BProtocolOptions } from './BProtocolService';
import DProtocolService, { DocumentIndex, DocumentIndexEntry } from './DProtocolService';
import BcatProtocolService, { BcatResult, BcatOptions } from './BcatProtocolService';
import BicoMediaService, { BicoMediaOptions } from './BicoMediaService';
import UHRPService, { type UHRPFileMetadata } from './UHRPService';

export interface DocumentData {
  id: string;
  title: string;
  content: string;
  metadata: DocumentMetadata;
}

export interface DocumentMetadata {
  created_at: string;
  updated_at: string;
  author: string;
  encrypted: boolean;
  word_count: number;
  character_count: number;
  storage_method?: string;
  blockchain_tx?: string;
  storage_cost?: number;
}

export interface BlockchainDocument {
  id: string;
  title: string;
  content?: string;
  preview?: string;
  created_at: string;
  updated_at: string;
  author?: string;
  encrypted?: boolean;
  word_count?: number;
  character_count?: number;
  storage_method?: string;
  blockchain_tx?: string;
  storage_cost?: number;
  // BSV Protocol fields
  protocol?: 'B' | 'D' | 'Bcat' | 'UHRP' | 'legacy';
  protocol_reference?: string; // B:// URL, D:// URL, Bcat TX ID, or UHRP URL
  bico_url?: string; // Bico.Media CDN URL
  uhrp_url?: string; // UHRP content addressing URL
}

export class BlockchainDocumentService {
  public handcashService: HandCashService; // Made public for access from components
  private bsvStorage: BSVStorageService;
  private nftService: HandCashNFTService;
  private encryptionKey: string | null = null;
  private isConnected: boolean = false;
  private currentUser: HandCashUser | null = null;
  
  // BSV Protocol Services
  private bProtocolService: BProtocolService;
  private dProtocolService: DProtocolService;
  private bcatProtocolService: BcatProtocolService;
  private bicoMediaService: BicoMediaService;
  private uhrpService: typeof UHRPService;

  constructor(handcashService: HandCashService) {
    this.handcashService = handcashService;
    this.bsvStorage = new BSVStorageService(handcashService);
    this.nftService = new HandCashNFTService(handcashService);
    
    // Initialize BSV Protocol Services
    this.bProtocolService = new BProtocolService(handcashService);
    this.dProtocolService = new DProtocolService(handcashService, this.bProtocolService);
    this.bcatProtocolService = new BcatProtocolService(handcashService, this.bProtocolService);
    this.bicoMediaService = new BicoMediaService();
    this.uhrpService = UHRPService;
    
    this.initialize();
  }

  // Initialize the service
  private async initialize(): Promise<void> {
    try {
      if (this.handcashService.isAuthenticated()) {
        this.currentUser = this.handcashService.getCurrentUser();
        this.generateEncryptionKey();
        this.isConnected = true;
        console.log('BlockchainDocumentService initialized for user:', this.currentUser?.handle);
        
        // Auto-sync documents on initialization
        await this.syncUserDocuments();
      }
    } catch (error) {
      console.error('Failed to initialize blockchain document service:', error);
    }
  }

  // Sync user documents from all sources
  public async syncUserDocuments(): Promise<void> {
    if (!this.isConnected || !this.currentUser) {
      console.log('Cannot sync: user not authenticated');
      return;
    }

    try {
      console.log('Syncing documents for user:', this.currentUser.handle);
      
      // Load all documents from localStorage
      const documents = await this.getDocuments();
      console.log(`Sync complete: ${documents.length} documents available`);
      
      // Additionally, check if we have any orphaned documents that need recovery
      const publishedDocsKey = `published_docs_${this.currentUser.handle}`;
      const publishedDocs = localStorage.getItem(publishedDocsKey);
      
      if (publishedDocs) {
        try {
          const docs = JSON.parse(publishedDocs);
          if (Array.isArray(docs) && docs.length > 0) {
            console.log(`Found ${docs.length} published documents in localStorage for ${this.currentUser.handle}`);
          }
        } catch (error) {
          console.error('Error parsing published documents:', error);
        }
      }
      
      // Emit event to notify UI to refresh
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('documentsSync', { 
          detail: { count: documents.length, user: this.currentUser.handle }
        }));
      }
      
    } catch (error) {
      console.error('Failed to sync user documents:', error);
    }
  }

  // ========== BSV PROTOCOL METHODS ==========

  /**
   * Store document using optimal BSV protocol
   */
  async storeWithBSVProtocols(
    content: string,
    title: string,
    options: {
      protocol?: 'auto' | 'B' | 'D' | 'Bcat' | 'UHRP';
      encrypt?: boolean;
      compress?: boolean;
      enableTemplating?: boolean;
    } = {}
  ): Promise<{
    protocol: 'B' | 'D' | 'Bcat' | 'UHRP';
    reference: string;
    bicoUrl: string;
    cost: number;
    document: BlockchainDocument;
  }> {
    if (!this.isConnected || !this.currentUser) {
      throw new Error('User not authenticated');
    }

    try {
      const documentId = `doc_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      const now = new Date().toISOString();
      
      // Determine optimal protocol
      const selectedProtocol = this.selectOptimalProtocol(content, options.protocol);
      
      let storageResult: any;
      let protocolReference: string;
      let bicoUrl: string;

      switch (selectedProtocol) {
        case 'B':
          const bResult = await this.bProtocolService.storeContent(content, {
            mediaType: 'text/html',
            filename: `${title}.html`,
            encrypt: options.encrypt,
            compress: options.compress
          });
          storageResult = bResult;
          protocolReference = bResult.bUrl;
          bicoUrl = bResult.bicoUrl;
          break;

        case 'Bcat':
          const bcatResult = await this.bcatProtocolService.storeLargeContent(content, {
            mimeType: 'text/html',
            filename: `${title}.html`,
            compress: options.compress || true, // Auto-compress large files
            info: `Bitcoin Writer document: ${title}`
          });
          storageResult = bcatResult;
          protocolReference = bcatResult.bcatUrl;
          bicoUrl = bcatResult.bicoUrl;
          break;

        case 'D':
          // For D:// protocol, first store content with B:// then create D:// reference
          const bContentResult = await this.bProtocolService.storeContent(content, {
            mediaType: 'text/html',
            filename: `${title}.html`
          });
          
          const dResult = await this.dProtocolService.createReference(
            `documents/${documentId}`,
            bContentResult.txId,
            { type: 'b' }
          );
          
          storageResult = { ...bContentResult, dUrl: dResult.dUrl };
          protocolReference = dResult.dUrl;
          bicoUrl = bContentResult.bicoUrl;
          break;

        case 'UHRP':
          // Set identity key from user authentication
          if (this.currentUser) {
            this.uhrpService.setIdentityKey(this.currentUser.handle);
          }
          
          const uhrpResult = await this.uhrpService.uploadDocument(
            content,
            `${title}.html`,
            10080 // 7 days retention
          );
          
          if (!uhrpResult.success || !uhrpResult.uhrpUrl) {
            throw new Error(uhrpResult.error || 'UHRP upload failed');
          }
          
          storageResult = {
            txId: `uhrp_${Date.now()}`,
            cost: { totalUSD: 0.005 }, // Estimated UHRP cost
            uhrpUrl: uhrpResult.uhrpUrl
          };
          protocolReference = uhrpResult.uhrpUrl;
          bicoUrl = uhrpResult.uhrpUrl; // Use UHRP URL as reference
          break;

        default:
          throw new Error(`Unsupported protocol: ${selectedProtocol}`);
      }

      // Create document record
      const document: BlockchainDocument = {
        id: documentId,
        title,
        content,
        preview: content.substring(0, 200).replace(/<[^>]*>/g, '').trim() + '...',
        created_at: now,
        updated_at: now,
        author: this.currentUser.handle,
        encrypted: options.encrypt || false,
        word_count: this.countWords(content),
        character_count: content.length,
        storage_method: selectedProtocol === 'UHRP' ? 'uhrp' : 'bsv_protocol',
        blockchain_tx: storageResult.txId,
        storage_cost: storageResult.cost?.totalUSD || 0,
        protocol: selectedProtocol,
        protocol_reference: protocolReference,
        bico_url: bicoUrl,
        uhrp_url: selectedProtocol === 'UHRP' ? protocolReference : undefined
      };

      // Store for persistence
      await this.storePublishedDocument({
        id: documentId,
        title,
        content,
        metadata: {
          created_at: now,
          updated_at: now,
          author: this.currentUser.handle,
          encrypted: options.encrypt || false,
          word_count: document.word_count || 0,
          character_count: document.character_count || 0,
          storage_method: 'bsv_protocol',
          blockchain_tx: storageResult.txId,
          storage_cost: storageResult.cost?.totalUSD || 0
        }
      }, storageResult.txId);

      // Update user's document index
      await this.updateUserDocumentIndex(document);

      console.log(`Document stored with ${selectedProtocol}:// protocol:`, {
        reference: protocolReference,
        cost: storageResult.cost?.totalUSD
      });

      return {
        protocol: selectedProtocol,
        reference: protocolReference,
        bicoUrl,
        cost: storageResult.cost?.totalUSD || 0,
        document
      };

    } catch (error) {
      console.error('Failed to store with BSV protocols:', error);
      throw error;
    }
  }

  /**
   * Retrieve document using BSV protocols
   */
  async retrieveWithBSVProtocols(reference: string): Promise<string> {
    try {
      // Determine protocol from reference format
      if (reference.startsWith('b://')) {
        return await this.bProtocolService.retrieveContent(reference);
      } else if (reference.startsWith('D://')) {
        const resolved = await this.dProtocolService.resolveReference(reference);
        if (resolved?.value) {
          return await this.bProtocolService.retrieveContent(`b://${resolved.value}`);
        }
        throw new Error('D:// reference could not be resolved');
      } else if (reference.startsWith('bcat://')) {
        return await this.bcatProtocolService.retrieveLargeContent(reference);
      } else if (reference.startsWith('uhrp://')) {
        const downloadResult = await this.uhrpService.downloadDocument(reference);
        if (!downloadResult.success || !downloadResult.content) {
          throw new Error(downloadResult.error || 'UHRP download failed');
        }
        return downloadResult.content;
      } else {
        // Try Bico.Media direct retrieval
        const bicoResult = await this.bicoMediaService.retrieveContent(reference);
        return bicoResult.content;
      }
    } catch (error) {
      console.error('Failed to retrieve with BSV protocols:', error);
      throw error;
    }
  }

  /**
   * Get cost estimates for different protocols
   */
  async getProtocolCostEstimates(content: string): Promise<{
    b: { cost: number; supported: boolean };
    bcat: { cost: number; supported: boolean };
    d: { cost: number; supported: boolean };
    uhrp: { cost: number; supported: boolean };
    recommended: 'B' | 'Bcat' | 'D' | 'UHRP';
  }> {
    const estimates = {
      b: { cost: 0, supported: true },
      bcat: { cost: 0, supported: true },
      d: { cost: 0, supported: true },
      uhrp: { cost: 0.005, supported: true }, // Fixed UHRP cost estimate
      recommended: 'B' as 'B' | 'Bcat' | 'D' | 'UHRP'
    };

    try {
      // B:// protocol estimate
      const bCost = await this.bProtocolService.estimateCost(content);
      estimates.b.cost = bCost.totalUSD;

      // Bcat protocol estimate (for large files)
      if (content.length > 100000) {
        const bcatCost = await this.bcatProtocolService.estimateCost(content);
        estimates.bcat.cost = bcatCost.totalUSD;
        estimates.recommended = estimates.bcat.cost < estimates.b.cost ? 'Bcat' : 'B';
      } else {
        estimates.bcat.supported = false;
      }

      // D:// protocol estimate (B:// + D:// reference)
      estimates.d.cost = estimates.b.cost + 0.0005; // Additional D:// reference cost

    } catch (error) {
      console.error('Failed to get cost estimates:', error);
    }

    return estimates;
  }

  /**
   * Update user's document index with D:// protocol
   */
  private async updateUserDocumentIndex(document: BlockchainDocument): Promise<void> {
    try {
      // Get current index
      const currentIndex = await this.dProtocolService.getDocumentIndex();
      const documents = currentIndex?.documents || [];

      // Add or update document in index
      const existingIndex = documents.findIndex(d => d.id === document.id);
      const indexEntry: DocumentIndexEntry = {
        id: document.id,
        title: document.title,
        contentProtocol: document.protocol as 'B' | 'D' | 'Bcat',
        contentReference: document.protocol_reference || '',
        metadata: {
          createdAt: document.created_at,
          updatedAt: document.updated_at,
          size: document.character_count || 0,
          wordCount: document.word_count || 0,
          characterCount: document.character_count || 0,
          version: 1,
          encrypted: document.encrypted || false
        }
      };

      if (existingIndex >= 0) {
        documents[existingIndex] = indexEntry;
      } else {
        documents.unshift(indexEntry);
      }

      // Keep only last 100 documents
      if (documents.length > 100) {
        documents.splice(100);
      }

      // Update index
      await this.dProtocolService.updateDocumentIndex(documents);

    } catch (error) {
      console.error('Failed to update document index:', error);
      // Don't throw - index update is not critical
    }
  }

  /**
   * Select optimal protocol based on content and options
   */
  private selectOptimalProtocol(
    content: string,
    preferredProtocol?: 'auto' | 'B' | 'D' | 'Bcat' | 'UHRP'
  ): 'B' | 'D' | 'Bcat' | 'UHRP' {
    if (preferredProtocol && preferredProtocol !== 'auto') {
      return preferredProtocol;
    }

    const contentSize = Buffer.from(content, 'utf-8').length;

    // Use UHRP for very large content (10MB+)
    if (contentSize > 10000000) {
      return 'UHRP';
    }

    // Use Bcat for large content
    if (contentSize > 100000) {
      return 'Bcat';
    }

    // Use B:// for standard content
    return 'B';
  }

  /**
   * Count words in content
   */
  private countWords(content: string): number {
    // Strip HTML tags and count words
    const textContent = content.replace(/<[^>]*>/g, '');
    return textContent.trim().split(/\s+/).filter(word => word.length > 0).length;
  }

  // Generate encryption key from user's authentication
  private generateEncryptionKey(): void {
    const accessToken = this.handcashService.getAccessToken();
    if (accessToken && this.currentUser) {
      // Create a deterministic encryption key from the user's access token and handle
      const keyData = `${this.currentUser.handle}_${accessToken.substring(0, 32)}`;
      this.encryptionKey = CryptoJS.SHA256(keyData).toString();
      console.log('Encryption key generated for user:', this.currentUser.handle);
    }
  }

  // Encrypt document content before storing on-chain
  private encryptContent(content: string): string {
    if (!this.encryptionKey) {
      throw new Error('No encryption key available');
    }
    return CryptoJS.AES.encrypt(content, this.encryptionKey).toString();
  }

  // Decrypt document content retrieved from chain
  private decryptContent(encryptedContent: string): string {
    if (!this.encryptionKey) {
      throw new Error('No encryption key available');
    }
    try {
      const bytes = CryptoJS.AES.decrypt(encryptedContent, this.encryptionKey);
      return bytes.toString(CryptoJS.enc.Utf8);
    } catch (error) {
      console.error('Failed to decrypt content:', error);
      throw new Error('Failed to decrypt document - invalid key or corrupted data');
    }
  }


  // Count characters in text
  private countCharacters(text: string): number {
    return text.length;
  }

  // Calculate storage cost - flat 1 penny per document
  private calculateStorageCost(method: StorageMethod, contentSize: number): number {
    // Always 1 penny flat fee regardless of size or method
    return 0.01;
  }
  
  // Get storage quote from BSV service
  public getStorageQuote(wordCount: number): StorageQuote {
    return this.bsvStorage.calculateStorageCost(wordCount);
  }

  // Create a new document
  async createDocument(title: string, content: string = '', storageMethod?: StorageMethod): Promise<DocumentData> {
    if (!this.isConnected || !this.currentUser) {
      throw new Error('User not authenticated');
    }

    const documentId = `doc_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const now = new Date().toISOString();
    const method = storageMethod || 'op_return';
    const wordCount = this.countWords(content);
    const charCount = this.countCharacters(content);
    
    try {
      // Store document on BSV blockchain with real-time pricing
      const storageResult = await this.bsvStorage.storeDocument(
        content,
        title,
        this.currentUser.handle,
        true // Always encrypt for privacy
      );
      
      const document: DocumentData = {
        id: documentId,
        title,
        content: this.encryptContent(content), // Keep encrypted copy locally
        metadata: {
          created_at: now,
          updated_at: now,
          author: this.currentUser.handle,
          encrypted: true,
          word_count: wordCount,
          character_count: charCount,
          storage_method: method,
          blockchain_tx: storageResult.transactionId,
          storage_cost: storageResult.storageCost.totalUSD
        }
      };

      // Store document metadata locally for quick access
      this.storeDocumentMetadata(document);
      
      // Store document for persistence across sessions
      await this.storePublishedDocument(document, storageResult.transactionId);
      
      console.log('Document stored on BSV blockchain:', {
        txid: storageResult.transactionId,
        explorer: storageResult.explorerUrl,
        cost: `$${storageResult.storageCost.totalUSD.toFixed(2)}`
      });

      return document;
    } catch (error) {
      console.error('Failed to store document on BSV:', error);
      
      // Fallback to local storage for demo
      const document: DocumentData = {
        id: documentId,
        title,
        content: this.encryptContent(content),
        metadata: {
          created_at: now,
          updated_at: now,
          author: this.currentUser.handle,
          encrypted: true,
          word_count: wordCount,
          character_count: charCount,
          storage_method: method,
          blockchain_tx: `demo_tx_${documentId}`,
          storage_cost: 0.01
        }
      };
      
      this.storeDocumentMetadata(document);
      return document;
    }
  }

  // Process different storage methods
  private async processStorageMethod(method: StorageMethod, document: DocumentData, content: string): Promise<void> {
    console.log(`Processing ${method} storage for document:`, {
      id: document.id,
      title: document.title,
      author: document.metadata.author,
      contentLength: content.length,
      storageMethod: method
    });

    switch (method) {
      case 'op_pushdata4':
        console.log('OP_PUSHDATA4: Storing full document directly on blockchain (up to 4GB)');
        // In production: Store entire document in blockchain transaction
        break;
        
      case 'op_return':
        console.log('OP_RETURN: Storing document hash and metadata in 80-byte OP_RETURN');
        // In production: Store hash and metadata, document stored off-chain
        break;
        
      case 'multisig_p2sh':
        console.log('Multisig P2SH: Embedding data in multisig script');
        // In production: Create multisig transaction with embedded data
        break;
        
      case 'nft_creation':
        console.log('NFT Creation: Minting document as unique NFT');
        // In production: Mint NFT with document content and metadata
        await this.createNFT(document, content);
        break;
        
      case 'file_shares':
        console.log('File Shares: Creating tokenized shares for revenue sharing');
        // In production: Create tokenized shares for the document
        await this.createFileShares(document, content);
        break;
        
      default:
        console.log('Using default OP_RETURN storage method');
    }
  }

  // Create NFT for document using HandCash Items
  private async createNFT(document: DocumentData, content: string): Promise<void> {
    console.log('Minting NFT for document:', document.title);
    
    try {
      // Create document package for NFT
      const documentPackage = {
        version: '2.0',
        timestamp: Date.now(),
        author: document.metadata.author,
        title: document.title,
        content: content,
        contentHash: CryptoJS.SHA256(content).toString(),
        encrypted: document.metadata.encrypted,
        wordCount: document.metadata.word_count,
        characterCount: document.metadata.character_count
      };

      // Configure NFT mint options
      const mintOptions: NFTMintOptions = {
        name: document.title,
        description: `Unique document NFT created by ${document.metadata.author}`,
        rarity: this.determineDocumentRarity(document.metadata.word_count),
        attributes: [
          {
            name: "Storage Method",
            value: "NFT Creation",
            type: 'text'
          },
          {
            name: "Content Hash",
            value: documentPackage.contentHash.substring(0, 16) + "...",
            type: 'text'
          }
        ],
        quantity: 1,
        royaltyPercentage: 5, // 5% royalty for creator
        listForSale: false // Don't auto-list, let user decide
      };

      // Mint the NFT using HandCash Items
      const mintResult = await this.nftService.mintDocumentAsNFT(documentPackage, mintOptions);
      
      // Store NFT reference locally for quick access
      const nftKey = `nft_${document.metadata.author}_${document.id}`;
      localStorage.setItem(nftKey, JSON.stringify({
        tokenId: mintResult.item.id,
        itemOrigin: mintResult.item.origin,
        handcashItem: mintResult.item,
        marketplaceUrl: mintResult.marketUrl,
        mintDate: new Date().toISOString(),
        documentId: document.id
      }));
      
      console.log(`NFT minted successfully!`, {
        itemId: mintResult.item.id,
        marketUrl: mintResult.marketUrl
      });
      
    } catch (error) {
      console.error('Failed to mint NFT:', error);
      // Fallback to local storage for demo
      await this.createNFTFallback(document, content);
    }
  }

  // Fallback NFT creation for development
  private async createNFTFallback(document: DocumentData, content: string): Promise<void> {
    console.log('Using NFT fallback for development');
    
    const nftMetadata = {
      name: document.title,
      description: `Unique document NFT created by ${document.metadata.author}`,
      image: this.generateDocumentThumbnail(content),
      attributes: [
        {
          trait_type: "Author",
          value: document.metadata.author
        },
        {
          trait_type: "Word Count", 
          value: document.metadata.word_count
        },
        {
          trait_type: "Storage Method",
          value: "NFT Creation"
        }
      ],
      contentHash: CryptoJS.SHA256(content).toString()
    };
    
    const nftKey = `nft_${document.metadata.author}_${document.id}`;
    localStorage.setItem(nftKey, JSON.stringify({
      tokenId: document.id,
      contractAddress: 'demo_nft_contract_address',
      metadata: nftMetadata,
      owner: document.metadata.author,
      mintDate: new Date().toISOString(),
      marketplaceUrl: `https://demo-marketplace.com/nft/${document.id}`
    }));
  }

  // Determine rarity based on document characteristics
  private determineDocumentRarity(wordCount: number): 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary' {
    if (wordCount >= 50000) return 'legendary'; // 50k+ words
    if (wordCount >= 20000) return 'epic';      // 20k+ words
    if (wordCount >= 10000) return 'rare';      // 10k+ words  
    if (wordCount >= 5000) return 'uncommon';   // 5k+ words
    return 'common';                            // Under 5k words
  }

  // Create file shares for document monetization
  private async createFileShares(document: DocumentData, content: string): Promise<void> {
    console.log('Creating file shares for document:', document.title);
    
    // Default share configuration (can be customized via modal)
    const shareConfig = {
      totalShares: 100,
      pricePerShare: 0.01,
      authorRoyalty: 5, // 5% royalty on future revenue
      shareTokenSymbol: `${document.title.substring(0, 5).toUpperCase()}SHR`
    };
    
    // Create tokenized shares structure
    const sharesData = {
      documentId: document.id,
      documentTitle: document.title,
      author: document.metadata.author,
      totalShares: shareConfig.totalShares,
      availableShares: shareConfig.totalShares,
      pricePerShare: shareConfig.pricePerShare,
      totalFundraisingTarget: shareConfig.totalShares * shareConfig.pricePerShare,
      authorRoyalty: shareConfig.authorRoyalty,
      tokenSymbol: shareConfig.shareTokenSymbol,
      shareholders: [],
      revenueDistributed: 0,
      createdDate: new Date().toISOString(),
      smartContractAddress: 'demo_shares_contract_address',
      contentHash: CryptoJS.SHA256(content).toString(),
      shareTokens: Array.from({ length: shareConfig.totalShares }, (_, i) => ({
        shareId: i + 1,
        owner: null, // Available for purchase
        purchaseDate: null,
        purchasePrice: shareConfig.pricePerShare
      }))
    };
    
    // In production: Deploy smart contract for tokenized shares
    console.log('File Shares created:', {
      tokenSymbol: shareConfig.shareTokenSymbol,
      totalShares: shareConfig.totalShares,
      fundraisingTarget: `$${shareConfig.totalShares * shareConfig.pricePerShare}`,
      authorRoyalty: `${shareConfig.authorRoyalty}%`,
      contractAddress: sharesData.smartContractAddress
    });
    
    // Store shares data locally for demo
    const sharesKey = `shares_${document.metadata.author}_${document.id}`;
    localStorage.setItem(sharesKey, JSON.stringify(sharesData));
    
    console.log(`File shares issued successfully! ${shareConfig.totalShares} shares available at $${shareConfig.pricePerShare} each`);
  }

  // Update an existing document
  async updateDocument(documentId: string, title: string, content: string, storageMethod?: StorageMethod): Promise<void> {
    if (!this.isConnected || !this.currentUser) {
      throw new Error('User not authenticated');
    }

    const encryptedContent = this.encryptContent(content);
    const existingDoc = await this.getDocument(documentId);
    const method = storageMethod || (existingDoc?.metadata.storage_method as StorageMethod) || 'op_return';
    const storageCost = this.calculateStorageCost(method, this.countCharacters(content));
    
    const updatedDocument: DocumentData = {
      id: documentId,
      title,
      content: encryptedContent,
      metadata: {
        created_at: existingDoc?.metadata.created_at || new Date().toISOString(),
        updated_at: new Date().toISOString(),
        author: this.currentUser.handle,
        encrypted: true,
        word_count: this.countWords(content),
        character_count: this.countCharacters(content),
        storage_method: method,
        blockchain_tx: existingDoc?.metadata.blockchain_tx || `tx_${documentId}`,
        storage_cost: storageCost
      }
    };

    // Handle different storage methods
    await this.processStorageMethod(method, updatedDocument, content);

    // Update local metadata
    this.storeDocumentMetadata(updatedDocument);

    // Simulate blockchain transaction delay
    await new Promise(resolve => setTimeout(resolve, 500));
  }

  // Retrieve a document by ID
  async getDocument(documentId: string): Promise<DocumentData | null> {
    if (!this.isConnected || !this.currentUser) {
      throw new Error('User not authenticated');
    }

    console.log('Retrieving document:', documentId);

    // First, check if we have the document in published_docs localStorage
    const publishedDocsKey = `published_docs_${this.currentUser.handle}`;
    const publishedDocs = localStorage.getItem(publishedDocsKey);
    
    if (publishedDocs) {
      try {
        const docs: BlockchainDocument[] = JSON.parse(publishedDocs);
        const foundDoc = docs.find(doc => doc.id === documentId);
        
        if (foundDoc) {
          console.log('Found document in published_docs:', documentId);
          return {
            id: foundDoc.id,
            title: foundDoc.title,
            content: foundDoc.content || '',
            metadata: {
              created_at: foundDoc.created_at,
              updated_at: foundDoc.updated_at,
              author: foundDoc.author || this.currentUser.handle,
              encrypted: foundDoc.encrypted || false,
              word_count: foundDoc.word_count || 0,
              character_count: foundDoc.character_count || 0,
              storage_method: foundDoc.storage_method,
              blockchain_tx: foundDoc.blockchain_tx,
              storage_cost: foundDoc.storage_cost
            }
          };
        }
      } catch (error) {
        console.error('Error parsing published documents:', error);
      }
    }

    // Fallback to old storage location
    const storedDoc = localStorage.getItem(`doc_${this.currentUser.handle}_${documentId}`);
    
    if (!storedDoc) {
      console.log('Document not found in localStorage:', documentId);
      return null;
    }

    try {
      const document: DocumentData = JSON.parse(storedDoc);
      
      // Decrypt the content if needed
      const decryptedContent = this.decryptContent(document.content);
      
      return {
        ...document,
        content: decryptedContent
      };
    } catch (error) {
      console.error('Failed to retrieve document:', error);
      return null;
    }
  }

  // Get list of user's documents
  async getDocuments(): Promise<BlockchainDocument[]> {
    if (!this.isConnected || !this.currentUser) {
      throw new Error('User not authenticated');
    }

    console.log('Retrieving document list for user:', this.currentUser.handle);
    
    try {
      // Try to load from multiple sources and merge
      const documents = new Map<string, BlockchainDocument>();
      
      // 1. Load from published_docs key (where storePublishedDocument saves)
      const publishedDocsKey = `published_docs_${this.currentUser.handle}`;
      const publishedDocs = localStorage.getItem(publishedDocsKey);
      
      if (publishedDocs) {
        try {
          const parsedDocs: BlockchainDocument[] = JSON.parse(publishedDocs);
          parsedDocs.forEach(doc => documents.set(doc.id, doc));
          console.log(`Loaded ${parsedDocs.length} published documents from localStorage`);
        } catch (error) {
          console.error('Failed to parse published documents:', error);
        }
      }
      
      // 2. Also check the old metadata key for backward compatibility
      const metadataKey = `docs_metadata_${this.currentUser.handle}`;
      const storedMetadata = localStorage.getItem(metadataKey);
      
      if (storedMetadata) {
        try {
          const localDocs: BlockchainDocument[] = JSON.parse(storedMetadata);
          localDocs.forEach(doc => {
            if (!documents.has(doc.id)) {
              documents.set(doc.id, doc);
            }
          });
        } catch (error) {
          console.error('Failed to parse stored metadata:', error);
        }
      }
      
      // 3. In future: Query blockchain for user's D:// document index
      // await this.syncFromBlockchain();
      
      // Convert map to array and sort by updated date
      const result = Array.from(documents.values()).sort((a, b) => 
        new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime()
      );
      
      console.log(`Found ${result.length} blockchain documents for user:`, this.currentUser.handle);
      return result;
      
    } catch (error) {
      console.error('Failed to retrieve documents:', error);
      return [];
    }
  }

  // Get list of user's documents (metadata only) - deprecated, use getDocuments
  async getDocumentList(): Promise<DocumentMetadata[]> {
    const documents = await this.getDocuments();
    return documents.map(doc => ({
      created_at: doc.created_at,
      updated_at: doc.updated_at,
      author: doc.author || '',
      encrypted: doc.encrypted || false,
      word_count: doc.word_count || 0,
      character_count: doc.character_count || 0,
      storage_method: doc.storage_method,
      blockchain_tx: doc.blockchain_tx,
      storage_cost: doc.storage_cost
    }));
  }

  // Store document in localStorage (simulating blockchain storage)
  private async storeDocument(document: DocumentData): Promise<void> {
    if (!this.currentUser) return;
    
    const key = `doc_${this.currentUser.handle}_${document.id}`;
    localStorage.setItem(key, JSON.stringify(document));
  }

  // Store published document for persistence across sessions
  async storePublishedDocument(document: DocumentData, transactionId?: string): Promise<void> {
    if (!this.currentUser) return;
    
    const publishedDocsKey = `published_docs_${this.currentUser.handle}`;
    let publishedDocs: BlockchainDocument[] = [];
    
    try {
      const existing = localStorage.getItem(publishedDocsKey);
      if (existing) {
        publishedDocs = JSON.parse(existing);
      }
    } catch (error) {
      console.error('Failed to parse published documents:', error);
    }
    
    // Decrypt content for preview and full content storage
    let decryptedContent = '';
    let preview = '';
    
    try {
      decryptedContent = this.decryptContent(document.content);
      preview = decryptedContent.substring(0, 200).replace(/\n/g, ' ').trim();
      if (preview.length === 200) preview += '...';
    } catch (error) {
      console.error('Failed to decrypt content for storage:', error);
      preview = 'Content encrypted';
    }
    
    const blockchainDoc: BlockchainDocument = {
      id: document.id,
      title: document.title,
      content: decryptedContent, // Store decrypted for easy access
      preview: preview,
      created_at: document.metadata.created_at,
      updated_at: document.metadata.updated_at,
      author: this.currentUser.handle,
      encrypted: document.metadata.encrypted,
      word_count: document.metadata.word_count,
      character_count: document.metadata.character_count,
      storage_method: document.metadata.storage_method || 'blockchain',
      blockchain_tx: transactionId || document.metadata.blockchain_tx,
      storage_cost: document.metadata.storage_cost
    };
    
    // Update or add document
    const existingIndex = publishedDocs.findIndex(d => d.id === document.id);
    if (existingIndex >= 0) {
      publishedDocs[existingIndex] = blockchainDoc;
    } else {
      publishedDocs.unshift(blockchainDoc);
    }
    
    // Keep only the last 100 published documents to prevent storage bloat
    if (publishedDocs.length > 100) {
      publishedDocs = publishedDocs.slice(0, 100);
    }
    
    try {
      localStorage.setItem(publishedDocsKey, JSON.stringify(publishedDocs));
      console.log('Stored published document for persistence:', document.title);
    } catch (error) {
      console.error('Failed to store published document:', error);
    }
  }

  // Store document metadata for quick listing (legacy method)
  private storeDocumentMetadata(document: DocumentData): void {
    if (!this.currentUser) return;
    
    const metadataKey = `docs_metadata_${this.currentUser.handle}`;
    let documents: BlockchainDocument[] = [];
    
    try {
      const existing = localStorage.getItem(metadataKey);
      if (existing) {
        documents = JSON.parse(existing);
      }
    } catch (error) {
      console.error('Failed to parse existing metadata:', error);
    }
    
    // Update or add document
    const existingIndex = documents.findIndex(d => d.id === document.id);
    
    // Decrypt content for preview (first 200 chars)
    let preview = '';
    try {
      const decryptedContent = this.decryptContent(document.content);
      preview = decryptedContent.substring(0, 200).replace(/\n/g, ' ');
    } catch (error) {
      console.error('Failed to decrypt for preview:', error);
      preview = '';
    }
    
    const newDoc: BlockchainDocument = {
      id: document.id,
      title: document.title,
      preview,
      created_at: document.metadata.created_at,
      updated_at: document.metadata.updated_at,
      author: document.metadata.author,
      encrypted: document.metadata.encrypted,
      word_count: document.metadata.word_count,
      character_count: document.metadata.character_count,
      storage_method: document.metadata.storage_method,
      blockchain_tx: document.metadata.blockchain_tx,
      storage_cost: document.metadata.storage_cost
    };
    
    if (existingIndex >= 0) {
      documents[existingIndex] = newDoc;
    } else {
      documents.push(newDoc);
    }
    
    // Sort by last updated (newest first)
    documents.sort((a, b) => 
      new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime()
    );
    
    localStorage.setItem(metadataKey, JSON.stringify(documents));
    
    // Also store the full document
    this.storeDocument(document);
  }

  // Delete a document
  async deleteDocument(documentId: string): Promise<void> {
    if (!this.isConnected || !this.currentUser) {
      throw new Error('User not authenticated');
    }

    // In production, this would mark the document as deleted on blockchain
    console.log('Deleting document from Bitcoin:', documentId);

    // Remove from localStorage
    const docKey = `doc_${this.currentUser.handle}_${documentId}`;
    localStorage.removeItem(docKey);

    // Remove from metadata
    const metadataKey = `docs_metadata_${this.currentUser.handle}`;
    try {
      const existing = localStorage.getItem(metadataKey);
      if (existing) {
        let documents: BlockchainDocument[] = JSON.parse(existing);
        documents = documents.filter(d => d.id !== documentId);
        localStorage.setItem(metadataKey, JSON.stringify(documents));
      }
    } catch (error) {
      console.error('Failed to update metadata after deletion:', error);
    }

    // Simulate blockchain transaction delay
    await new Promise(resolve => setTimeout(resolve, 500));
  }

  // Check if service is connected and ready
  isReady(): boolean {
    return this.isConnected && this.currentUser !== null && this.encryptionKey !== null;
  }

  // Get current user
  getCurrentUser(): HandCashUser | null {
    return this.currentUser;
  }

  // Generate document thumbnail for NFT
  private generateDocumentThumbnail(content: string): string {
    // In production: Generate actual thumbnail image
    // For demo: Return placeholder image URL
    return `https://via.placeholder.com/400x600/2563eb/ffffff?text=${encodeURIComponent('Document NFT')}`;
  }
  
  // Get user's NFTs
  async getUserNFTs(): Promise<any[]> {
    if (!this.currentUser) return [];
    
    const nfts = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key?.startsWith(`nft_${this.currentUser.handle}_`)) {
        const nftData = localStorage.getItem(key);
        if (nftData) {
          nfts.push(JSON.parse(nftData));
        }
      }
    }
    return nfts;
  }
  
  // Get user's file shares
  async getUserFileShares(): Promise<any[]> {
    if (!this.currentUser) return [];
    
    const shares = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key?.startsWith(`shares_${this.currentUser.handle}_`)) {
        const shareData = localStorage.getItem(key);
        if (shareData) {
          shares.push(JSON.parse(shareData));
        }
      }
    }
    return shares;
  }

  // Reconnect after authentication
  async reconnect(): Promise<void> {
    await this.initialize();
  }

  // Get HandCash NFT service
  public getNFTService(): HandCashNFTService {
    return this.nftService;
  }

  // Get BSV storage service
  public getBSVStorageService(): BSVStorageService {
    return this.bsvStorage;
  }

  // Get UHRP service
  public getUHRPService(): typeof UHRPService {
    return this.uhrpService;
  }

  // Resolve UHRP URL to downloadable content URL
  public async resolveUHRPUrl(uhrpUrl: string): Promise<string | null> {
    try {
      if (!this.uhrpService.isValidUHRPUrl(uhrpUrl)) {
        throw new Error('Invalid UHRP URL format');
      }

      return await this.uhrpService.resolveUHRPUrl(uhrpUrl);
    } catch (error) {
      console.error('Failed to resolve UHRP URL:', error);
      return null;
    }
  }

  // Get UHRP file metadata
  public async getUHRPMetadata(uhrpUrl: string): Promise<UHRPFileMetadata | null> {
    try {
      const findResult = await this.uhrpService.findFile(uhrpUrl);
      
      if (findResult.status === 'success' && findResult.data) {
        return {
          name: findResult.data.name,
          size: findResult.data.size,
          mimeType: findResult.data.mimeType,
          expiryTime: findResult.data.expiryTime,
          uhrpUrl: uhrpUrl
        };
      }
      
      return null;
    } catch (error) {
      console.error('Failed to get UHRP metadata:', error);
      return null;
    }
  }

  // Get real-time storage quote
  public async getStorageQuoteRealTime(wordCount: number, encrypted: boolean = false): Promise<StorageQuote> {
    return await this.bsvStorage.calculateStorageCostRealTime(wordCount, encrypted);
  }

  // Create document with advanced options
  public async createDocumentAdvanced(
    title: string,
    content: string,
    options: {
      storageMethod?: StorageMethod;
      encryption?: boolean;
      encryptionMethod?: 'password' | 'notesv' | 'timelock' | 'multiparty';
      encryptionPassword?: string;
      mintAsNFT?: boolean;
      nftOptions?: NFTMintOptions;
      createShares?: boolean;
      shareOptions?: {
        totalShares: number;
        pricePerShare: number;
        royaltyPercentage: number;
      };
    } = {}
  ): Promise<DocumentData> {
    if (!this.isConnected || !this.currentUser) {
      throw new Error('User not authenticated');
    }

    const documentId = `doc_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const now = new Date().toISOString();
    const method = options.storageMethod || 'op_return';
    const wordCount = this.countWords(content);
    const charCount = this.countCharacters(content);
    
    let processedContent = content;
    let encryptionData: any = undefined;

    // Handle encryption
    if (options.encryption && options.encryptionPassword) {
      switch (options.encryptionMethod) {
        case 'notesv':
          const noteSVResult = NoteSVEncryption.encrypt(content, options.encryptionPassword);
          processedContent = noteSVResult.encryptedContent;
          encryptionData = {
            method: 'notesv',
            salt: noteSVResult.salt,
            iv: noteSVResult.iv,
            hmac: noteSVResult.hmac,
            iterations: noteSVResult.iterations
          };
          break;
        default:
          processedContent = this.encryptContent(content);
          break;
      }
    }
    
    try {
      // Store document on BSV blockchain
      const storageResult = await this.bsvStorage.storeDocument(
        processedContent,
        title,
        this.currentUser.handle,
        options.encryption || false
      );
      
      const document: DocumentData = {
        id: documentId,
        title,
        content: this.encryptContent(processedContent), // Keep encrypted copy locally
        metadata: {
          created_at: now,
          updated_at: now,
          author: this.currentUser.handle,
          encrypted: options.encryption || false,
          word_count: wordCount,
          character_count: charCount,
          storage_method: method,
          blockchain_tx: storageResult.transactionId,
          storage_cost: storageResult.storageCost.totalUSD
        }
      };

      // Mint as NFT if requested
      if (options.mintAsNFT && options.nftOptions) {
        await this.createNFT(document, content);
      }

      // Create tokenized shares if requested
      if (options.createShares) {
        await this.createFileShares(document, content);
      }

      // Store document metadata locally for quick access
      this.storeDocumentMetadata(document);
      
      // Store document for persistence across sessions
      await this.storePublishedDocument(document, storageResult.transactionId);
      
      console.log('Advanced document created:', {
        txid: storageResult.transactionId,
        explorer: storageResult.explorerUrl,
        cost: `$${storageResult.storageCost.totalUSD.toFixed(4)}`,
        encrypted: options.encryption,
        nft: options.mintAsNFT,
        shares: options.createShares
      });

      return document;
    } catch (error) {
      console.error('Failed to create advanced document:', error);
      throw new Error(`Document creation failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Get protocol badge information for a document's blockchain reference
   */
  public getProtocolBadge(document: BlockchainDocument): { name: string; description: string; color: string; icon: string } | null {
    // Handle specific protocols first
    if (document.protocol_reference) {
      switch (document.protocol) {
        case 'B':
          return this.bProtocolService.getProtocolBadge(document.protocol_reference);
        case 'D':
          return this.dProtocolService.getProtocolBadge(document.protocol_reference);
        case 'Bcat':
          return this.bcatProtocolService.getProtocolBadge(document.protocol_reference);
        case 'UHRP':
          return {
            name: 'UHRP',
            description: 'Unified Hash Resolution Protocol - Content-addressed storage',
            color: '#8b5cf6',
            icon: '🔗'
          };
      }
    }
    
    // Handle Bico.Media URLs
    if (document.bico_url) {
      const txId = this.extractTxIdFromUrl(document.bico_url);
      if (txId) {
        return this.bicoMediaService.getProtocolBadge(txId);
      }
    }
    
    return null;
  }

  /**
   * Extract transaction ID from various URL formats
   */
  private extractTxIdFromUrl(url: string): string | null {
    if (url.includes('bico.media/')) {
      const parts = url.split('/');
      const txPart = parts[parts.length - 1];
      // Remove file extension if present
      return txPart.split('.')[0];
    }
    
    if (url.startsWith('b://')) {
      return url.substring(4);
    }
    
    if (url.startsWith('d://')) {
      return url.substring(4);
    }
    
    if (url.startsWith('bcat://')) {
      return url.substring(7);
    }
    
    if (url.startsWith('uhrp://')) {
      return url.substring(7);
    }
    
    // Check if it's already a transaction ID
    if (/^[a-f0-9]{64}$/i.test(url)) {
      return url;
    }
    
    return null;
  }
}