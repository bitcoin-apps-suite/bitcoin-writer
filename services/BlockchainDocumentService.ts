/**
 * Blockchain Document Service (Refactored)
 * Thin orchestration layer that composes core services
 *
 * This service delegates all work to specialized services:
 * - PricingService (core): BSV pricing & cost estimation
 * - DocumentProtocolService (core): Protocol selection & routing
 * - DocumentStorageService (core): Document CRUD & persistence
 * - MonetizationService (app): NFT minting & file shares
 */

import { HandCashService, HandCashUser } from './HandCashService';
import {
  PricingService,
  DocumentProtocolService,
  DocumentStorageService,
  LocalStorageAdapter,
  BProtocolService,
  DProtocolService,
  BcatProtocolService,
  type StorageAdapter,
  type ProtocolStoreOptions,
  type ProtocolStoreResult
} from '@bitcoin-writer/core/services';
import type { DocumentData, BlockchainDocument } from '@bitcoin-writer/core/types';
import { MonetizationService } from './MonetizationService';
import HandCashNFTService, { NFTMintOptions } from './HandCashNFTService';

export interface CreateDocumentOptions {
  storageMethod?: 'blockchain' | 'local';
  protocol?: 'auto' | 'B' | 'D' | 'Bcat' | 'UHRP';
  encrypt?: boolean;
  encryptionPassword?: string;
  compress?: boolean;
  createMutableReference?: boolean;
  mintAsNFT?: boolean;
  nftOptions?: NFTMintOptions;
  createShares?: boolean;
  sharesConfig?: {
    totalShares?: number;
    pricePerShare?: number;
    authorRoyalty?: number;
  };
}

export interface PublishResult {
  document: BlockchainDocument;
  protocolResult: ProtocolStoreResult;
  nft?: any;
  shares?: any;
}

export class BlockchainDocumentService {
  // Core services (from @bitcoin-writer/core)
  private pricingService: PricingService;
  private protocolService: DocumentProtocolService;
  private storageService: DocumentStorageService;

  // App services
  private monetizationService: MonetizationService;
  private handcashService: HandCashService;
  private nftService: HandCashNFTService;

  // State
  private isConnected: boolean = false;
  private currentUser: HandCashUser | null = null;
  private storage: StorageAdapter;

  constructor(handcashService: HandCashService, storage?: StorageAdapter) {
    this.handcashService = handcashService;
    this.storage = storage || new LocalStorageAdapter();
    this.nftService = new HandCashNFTService(handcashService);

    // Initialize protocol services (from core)
    const bProtocolService = new BProtocolService(handcashService, this.storage);
    const dProtocolService = new DProtocolService(handcashService, bProtocolService, this.storage);
    const bcatProtocolService = new BcatProtocolService(handcashService, bProtocolService, this.storage);

    // Initialize core services
    this.pricingService = new PricingService();
    this.protocolService = new DocumentProtocolService(
      bProtocolService,
      dProtocolService,
      bcatProtocolService,
      this.storage
    );
    this.storageService = new DocumentStorageService(this.storage);

    // Initialize app services
    this.monetizationService = new MonetizationService(this.storage, this.nftService);

    this.initialize();
  }

  /**
   * Initialize the service
   */
  private async initialize(): Promise<void> {
    try {
      if (this.handcashService.isAuthenticated()) {
        this.currentUser = this.handcashService.getCurrentUser();

        if (this.currentUser) {
          const authToken = this.handcashService.getAccessToken();
          this.storageService.setCurrentUser(this.currentUser.handle, authToken);
          this.monetizationService.setCurrentUser(this.currentUser.handle);
          this.isConnected = true;

          console.log('[BlockchainDocumentService] Initialized for user:', this.currentUser.handle);

          // Auto-sync documents
          await this.syncUserDocuments();
        }
      }
    } catch (error) {
      console.error('[BlockchainDocumentService] Failed to initialize:', error);
    }
  }

  /**
   * Sync user documents from storage
   */
  public async syncUserDocuments(): Promise<void> {
    if (!this.isConnected || !this.currentUser) {
      console.log('[BlockchainDocumentService] Cannot sync: user not authenticated');
      return;
    }

    try {
      await this.storageService.syncDocuments();
    } catch (error) {
      console.error('[BlockchainDocumentService] Failed to sync documents:', error);
    }
  }

  /**
   * Create and publish a document to blockchain
   */
  async createAndPublishDocument(
    title: string,
    content: string,
    options: CreateDocumentOptions = {}
  ): Promise<PublishResult> {
    if (!this.isConnected || !this.currentUser) {
      throw new Error('User not authenticated');
    }

    try {
      // 1. Store content via protocol service
      const protocolOptions: ProtocolStoreOptions = {
        protocol: options.protocol || 'auto',
        encrypt: options.encrypt,
        compress: options.compress,
        createMutableReference: options.createMutableReference
      };

      const protocolResult = await this.protocolService.store(content, title, protocolOptions);

      // 2. Create document record via storage service
      const documentData = await this.storageService.createDocument(
        title,
        content,
        {
          author: this.currentUser.handle,
          encrypted: options.encrypt,
          storage_method: protocolResult.protocol.toLowerCase(),
          blockchain_tx: protocolResult.txId,
          storage_cost: protocolResult.cost.usd
        },
        {
          encrypt: options.encrypt,
          encryptionPassword: options.encryptionPassword
        }
      );

      // Convert DocumentData to BlockchainDocument for return
      const document: BlockchainDocument = {
        id: documentData.id,
        title: documentData.title,
        content: content, // Return unencrypted content
        preview: content.substring(0, 200).replace(/<[^>]*>/g, '').trim() + '...',
        created_at: documentData.metadata.created_at,
        updated_at: documentData.metadata.updated_at,
        author: documentData.metadata.author,
        encrypted: documentData.metadata.encrypted,
        word_count: documentData.metadata.word_count,
        character_count: documentData.metadata.character_count,
        storage_method: documentData.metadata.storage_method,
        blockchain_tx: documentData.metadata.blockchain_tx,
        storage_cost: documentData.metadata.storage_cost,
        protocol: protocolResult.protocol,
        protocol_reference: protocolResult.reference,
        bico_url: protocolResult.bicoUrl
      };

      // 3. Update document index
      await this.protocolService.updateDocumentIndex(
        document.id,
        document.title,
        protocolResult.reference,
        protocolResult.protocol,
        {
          createdAt: document.created_at,
          updatedAt: document.updated_at,
          size: protocolResult.size.bytes,
          wordCount: protocolResult.size.words,
          encrypted: options.encrypt || false
        }
      );

      const result: PublishResult = {
        document,
        protocolResult
      };

      // 4. Mint as NFT if requested
      if (options.mintAsNFT) {
        result.nft = await this.monetizationService.mintDocumentAsNFT(
          documentData,
          content,
          options.nftOptions
        );
      }

      // 5. Create tokenized shares if requested
      if (options.createShares) {
        result.shares = await this.monetizationService.createFileShares(
          documentData,
          content,
          options.sharesConfig
        );
      }

      console.log('[BlockchainDocumentService] Document published:', {
        id: document.id,
        protocol: protocolResult.protocol,
        reference: protocolResult.reference,
        cost: protocolResult.cost.usd,
        nft: !!result.nft,
        shares: !!result.shares
      });

      return result;

    } catch (error) {
      console.error('[BlockchainDocumentService] Failed to create document:', error);
      throw error;
    }
  }

  /**
   * Get a document by ID
   */
  async getDocument(documentId: string): Promise<DocumentData | null> {
    if (!this.isConnected || !this.currentUser) {
      throw new Error('User not authenticated');
    }

    return await this.storageService.getDocument(documentId);
  }

  /**
   * Get all documents for current user
   */
  async getDocuments(): Promise<BlockchainDocument[]> {
    if (!this.isConnected || !this.currentUser) {
      throw new Error('User not authenticated');
    }

    return await this.storageService.getDocuments();
  }

  /**
   * Update an existing document
   */
  async updateDocument(
    documentId: string,
    title: string,
    content: string,
    options: CreateDocumentOptions = {}
  ): Promise<void> {
    if (!this.isConnected || !this.currentUser) {
      throw new Error('User not authenticated');
    }

    await this.storageService.updateDocument(
      documentId,
      title,
      content,
      {
        encrypt: options.encrypt,
        encryptionPassword: options.encryptionPassword
      }
    );
  }

  /**
   * Delete a document
   */
  async deleteDocument(documentId: string): Promise<void> {
    if (!this.isConnected || !this.currentUser) {
      throw new Error('User not authenticated');
    }

    await this.storageService.deleteDocument(documentId);
  }

  /**
   * Get cost estimates for different protocols
   */
  async getProtocolCostEstimates(content: string, encrypted: boolean = false) {
    return await this.pricingService.compareAllProtocols(content, encrypted);
  }

  /**
   * Get storage quote for document
   */
  async getStorageQuote(wordCount: number, encrypted: boolean = false) {
    return await this.pricingService.calculateStorageCostRealTime(wordCount, encrypted);
  }

  /**
   * Get protocol badge for display
   */
  getProtocolBadge(reference: string) {
    return this.protocolService.getProtocolBadge(reference);
  }

  /**
   * Get user's NFTs
   */
  async getUserNFTs() {
    return await this.monetizationService.getUserNFTs();
  }

  /**
   * Get user's file shares
   */
  async getUserFileShares() {
    return await this.monetizationService.getUserFileShares();
  }

  /**
   * Retrieve content from blockchain by reference
   */
  async retrieveWithBSVProtocols(reference: string): Promise<string> {
    return await this.protocolService.retrieve(reference);
  }

  /**
   * Check if service is ready
   */
  isReady(): boolean {
    return this.isConnected && this.currentUser !== null;
  }

  /**
   * Get current user
   */
  getCurrentUser(): HandCashUser | null {
    return this.currentUser;
  }

  /**
   * Get HandCash service
   */
  getHandCashService(): HandCashService {
    return this.handcashService;
  }

  /**
   * Get NFT service
   */
  getNFTService(): HandCashNFTService {
    return this.nftService;
  }

  /**
   * Reconnect after authentication
   */
  async reconnect(): Promise<void> {
    await this.initialize();
  }

  /**
   * Register callback for document sync events
   */
  onDocumentSync(callback: (event: any) => void): void {
    this.storageService.onSync(callback);
  }
}

export default BlockchainDocumentService;
