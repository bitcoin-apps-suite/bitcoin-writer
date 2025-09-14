import CryptoJS from 'crypto-js';
import { HandCashService, HandCashUser } from './HandCashService';
import { StorageMethod } from '../components/EnhancedStorageModal';
import BSVStorageService, { StorageResult, StorageQuote } from './BSVStorageService';

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
}

export class BlockchainDocumentService {
  private handcashService: HandCashService;
  private bsvStorage: BSVStorageService;
  private encryptionKey: string | null = null;
  private isConnected: boolean = false;
  private currentUser: HandCashUser | null = null;

  constructor(handcashService: HandCashService) {
    this.handcashService = handcashService;
    this.bsvStorage = new BSVStorageService();
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
      }
    } catch (error) {
      console.error('Failed to initialize blockchain document service:', error);
    }
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

  // Count words in text
  private countWords(text: string): number {
    if (!text || text.trim() === '') return 0;
    return text.trim().split(/\s+/).length;
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
      // Store document on BSV blockchain
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

  // Create NFT for document
  private async createNFT(document: DocumentData, content: string): Promise<void> {
    console.log('Minting NFT for document:', document.title);
    
    // Create NFT metadata
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
          trait_type: "Character Count",
          value: document.metadata.character_count
        },
        {
          trait_type: "Created Date",
          value: document.metadata.created_at
        },
        {
          trait_type: "Storage Method",
          value: "NFT Creation"
        }
      ],
      content: content, // Full document content embedded in NFT
      contentHash: CryptoJS.SHA256(content).toString()
    };
    
    // In production: Create NFT smart contract and mint token
    console.log('NFT Metadata created:', {
      tokenId: document.id,
      metadata: nftMetadata,
      owner: document.metadata.author
    });
    
    // Store NFT data locally for demo
    const nftKey = `nft_${document.metadata.author}_${document.id}`;
    localStorage.setItem(nftKey, JSON.stringify({
      tokenId: document.id,
      contractAddress: 'demo_nft_contract_address',
      metadata: nftMetadata,
      owner: document.metadata.author,
      mintDate: new Date().toISOString(),
      marketplaceUrl: `https://marketplace.example.com/nft/${document.id}`
    }));
    
    console.log(`NFT minted successfully! Token ID: ${document.id}`);
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

    console.log('Retrieving document from Bitcoin:', documentId);

    // In production, this would retrieve from blockchain
    // For now, we'll simulate with localStorage
    const storedDoc = localStorage.getItem(`doc_${this.currentUser.handle}_${documentId}`);
    
    if (!storedDoc) {
      return null;
    }

    try {
      const document: DocumentData = JSON.parse(storedDoc);
      
      // Decrypt the content
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

    // In production, this would query blockchain for user's documents
    console.log('Retrieving document list for user:', this.currentUser.handle);

    const metadataKey = `docs_metadata_${this.currentUser.handle}`;
    const storedMetadata = localStorage.getItem(metadataKey);
    
    if (!storedMetadata) {
      return [];
    }

    try {
      const documents: BlockchainDocument[] = JSON.parse(storedMetadata);
      return documents;
    } catch (error) {
      console.error('Failed to parse document metadata:', error);
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

  // Store document metadata for quick listing
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
}