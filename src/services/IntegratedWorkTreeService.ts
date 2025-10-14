import { DocumentInscriptionService } from './DocumentInscriptionService';
import { BlockchainDocumentService } from './BlockchainDocumentService';
import { 
  DocumentInscription, 
  DocumentVersionChain, 
  InscriptionConfig 
} from '../types/DocumentInscription';
import { EventEmitter } from 'events';

/**
 * Integrated Work Tree Service that connects Git-style versioning with blockchain storage
 * 
 * This service bridges the gap between:
 * - DocumentInscriptionService (git-style versioning)
 * - BlockchainDocumentService (BSV blockchain storage)
 * 
 * Enabling full Work Tree functionality with real blockchain integration
 */
export class IntegratedWorkTreeService extends EventEmitter {
  private inscriptionService: DocumentInscriptionService;
  private blockchainService: BlockchainDocumentService;
  private versionChains: Map<string, DocumentVersionChain> = new Map();

  constructor(blockchainService: BlockchainDocumentService) {
    super();
    this.blockchainService = blockchainService;
    
    // Initialize inscription service with default config
    const defaultConfig: InscriptionConfig = {
      network: 'mainnet',
      feeRate: 10,
      compressionEnabled: true,
      metadataInContent: true,
      autoCreateShares: false,
      defaultShareCount: 1000
    };
    
    this.inscriptionService = new DocumentInscriptionService(defaultConfig);
    
    // Forward events from inscription service
    this.inscriptionService.on('progress', (progress) => this.emit('progress', progress));
    this.inscriptionService.on('error', (error) => this.emit('error', error));
  }

  /**
   * Create a new Work Tree version and store it on the blockchain
   */
  async createVersionWithBlockchain(
    documentId: string,
    content: string,
    metadata: {
      title: string;
      description?: string;
      author: string;
      authorHandle?: string;
      genre?: string;
      tags?: string[];
      isPublished?: boolean;
      isPaid?: boolean;
    },
    options: {
      storeOnBlockchain?: boolean;
      protocol?: 'auto' | 'B' | 'D' | 'Bcat';
      encrypt?: boolean;
      createShares?: boolean;
      shareOptions?: {
        totalShares: number;
        pricePerShare: number;
      };
    } = {}
  ): Promise<{
    inscription: DocumentInscription;
    blockchainResult?: any;
  }> {
    
    // Get existing version chain or create new one
    let versionChain = this.versionChains.get(documentId);
    if (!versionChain) {
      versionChain = {
        documentId,
        versions: [],
        isValid: true,
        lastVerified: Date.now(),
        totalVersions: 0,
        totalWordCount: 0,
        creationSpan: 0,
        publishedVersions: []
      };
      this.versionChains.set(documentId, versionChain);
    }

    // Find current HEAD (parent for new version)
    const currentHead = versionChain.versions.length > 0 
      ? versionChain.versions[versionChain.versions.length - 1] 
      : undefined;

    // Create Work Tree version
    const inscription = await this.inscriptionService.createDocumentInscription(
      content,
      metadata,
      currentHead
    );

    // Store on blockchain if requested
    let blockchainResult;
    if (options.storeOnBlockchain && this.blockchainService.isReady()) {
      try {
        // Use BSV protocols for storage
        blockchainResult = await this.blockchainService.storeWithBSVProtocols(
          content,
          metadata.title,
          {
            protocol: options.protocol,
            encrypt: options.encrypt,
            compress: true
          }
        );

        // Update inscription with blockchain references
        inscription.inscriptionId = blockchainResult.reference;
        inscription.txId = blockchainResult.document.blockchain_tx;
        inscription.metadata.inscribedAt = Date.now();
        inscription.status = 'inscribed';
        
        // Store protocol-specific data
        inscription.metadata.blockchainProtocol = blockchainResult.protocol;
        inscription.metadata.blockchainReference = blockchainResult.reference;
        inscription.metadata.bicoUrl = blockchainResult.bicoUrl;
        inscription.metadata.storageCost = blockchainResult.cost;

        console.log(`Work Tree version stored on blockchain with ${blockchainResult.protocol}:// protocol`, {
          documentId,
          version: inscription.metadata.version,
          reference: blockchainResult.reference,
          cost: blockchainResult.cost
        });

      } catch (error) {
        console.error('Failed to store Work Tree version on blockchain:', error);
        // Continue with local version even if blockchain storage fails
        inscription.status = 'failed';
      }
    }

    // Create share tokens if requested
    if (options.createShares && options.shareOptions) {
      try {
        const shareIds = await this.inscriptionService.createShareTokens(
          inscription,
          options.shareOptions.totalShares,
          options.shareOptions.pricePerShare
        );
        
        console.log(`Created ${shareIds.length} share tokens for version ${inscription.metadata.version}`);
        
      } catch (error) {
        console.error('Failed to create share tokens:', error);
      }
    }

    // Update version chain
    const updatedChain = this.inscriptionService.createVersionChain(documentId, inscription);
    this.versionChains.set(documentId, updatedChain);

    // Persist version chain to localStorage for reliability
    this.persistVersionChain(documentId, updatedChain);

    return {
      inscription,
      blockchainResult
    };
  }

  /**
   * Retrieve content from Work Tree version using blockchain protocols
   */
  async retrieveVersionContent(inscription: DocumentInscription): Promise<string> {
    // If we have blockchain reference, retrieve from blockchain
    if (inscription.metadata.blockchainReference && this.blockchainService.isReady()) {
      try {
        return await this.blockchainService.retrieveWithBSVProtocols(
          inscription.metadata.blockchainReference
        );
      } catch (error) {
        console.error('Failed to retrieve from blockchain, falling back to local content:', error);
      }
    }
    
    // Fallback to local content
    return inscription.content;
  }

  /**
   * Get version chain for a document
   */
  getVersionChain(documentId: string): DocumentVersionChain | null {
    // Try to load from memory first
    let chain = this.versionChains.get(documentId);
    
    // If not in memory, try to load from persistence
    if (!chain) {
      const loadedChain = this.loadVersionChain(documentId);
      if (loadedChain) {
        chain = loadedChain;
        this.versionChains.set(documentId, chain);
      }
    }
    
    return chain || null;
  }

  /**
   * Checkout a specific version (like git checkout)
   */
  async checkoutVersion(
    documentId: string, 
    versionNumber: number
  ): Promise<{
    content: string;
    inscription: DocumentInscription;
  }> {
    const chain = this.getVersionChain(documentId);
    if (!chain) {
      throw new Error(`No version chain found for document ${documentId}`);
    }

    const version = chain.versions.find(v => v.metadata.version === versionNumber);
    if (!version) {
      throw new Error(`Version ${versionNumber} not found in chain`);
    }

    const content = await this.retrieveVersionContent(version);
    
    return {
      content,
      inscription: version
    };
  }

  /**
   * Create a new branch from current HEAD (like git checkout -b)
   */
  async createBranch(
    documentId: string,
    branchName: string,
    content: string,
    metadata: Parameters<typeof this.createVersionWithBlockchain>[2]
  ): Promise<DocumentInscription> {
    const chain = this.getVersionChain(documentId);
    const currentHead = chain?.versions[chain.versions.length - 1];
    
    // Create branch metadata
    const branchMetadata = {
      ...metadata,
      branchName,
      parentVersion: currentHead?.metadata.version,
      isBranch: true
    };

    const result = await this.createVersionWithBlockchain(
      documentId,
      content,
      branchMetadata
    );

    return result.inscription;
  }

  /**
   * Get all versions for a document
   */
  getAllVersions(documentId: string): DocumentInscription[] {
    const chain = this.getVersionChain(documentId);
    return chain?.versions || [];
  }

  /**
   * Get blockchain cost estimates for storing a version
   */
  async getCostEstimates(content: string): Promise<{
    b: { cost: number; supported: boolean };
    bcat: { cost: number; supported: boolean };
    d: { cost: number; supported: boolean };
    uhrp: { cost: number; supported: boolean };
    recommended: 'B' | 'Bcat' | 'D' | 'UHRP';
  }> {
    if (!this.blockchainService.isReady()) {
      return {
        b: { cost: 0, supported: false },
        bcat: { cost: 0, supported: false },
        d: { cost: 0, supported: false },
        uhrp: { cost: 0, supported: false },
        recommended: 'B'
      };
    }

    return await this.blockchainService.getProtocolCostEstimates(content);
  }

  /**
   * Verify the integrity of a version chain
   */
  async verifyVersionChain(documentId: string): Promise<boolean> {
    const chain = this.getVersionChain(documentId);
    if (!chain) return false;

    return await this.inscriptionService.verifyVersionChain(chain);
  }

  /**
   * Export version chain for backup/sharing
   */
  exportVersionChain(documentId: string): string | null {
    const chain = this.getVersionChain(documentId);
    if (!chain) return null;
    
    return JSON.stringify({
      ...chain,
      exportedAt: Date.now(),
      exportedBy: this.blockchainService.getCurrentUser()?.handle || 'unknown'
    }, null, 2);
  }

  /**
   * Import version chain from backup
   */
  async importVersionChain(jsonData: string): Promise<DocumentVersionChain> {
    const imported = JSON.parse(jsonData) as DocumentVersionChain;
    this.versionChains.set(imported.documentId, imported);
    this.persistVersionChain(imported.documentId, imported);
    return imported;
  }

  /**
   * Get statistics for all Work Tree chains
   */
  getGlobalStats(): {
    totalChains: number;
    totalVersions: number;
    totalInscribed: number;
    totalShares: number;
  } {
    let totalVersions = 0;
    let totalInscribed = 0;
    let totalShares = 0;

    this.versionChains.forEach(chain => {
      totalVersions += chain.totalVersions;
      totalInscribed += chain.versions.filter(v => v.status === 'inscribed').length;
      totalShares += chain.versions.filter(v => v.metadata.shareTokens).length;
    });

    return {
      totalChains: this.versionChains.size,
      totalVersions,
      totalInscribed,
      totalShares
    };
  }

  /**
   * Persist version chain to localStorage
   */
  private persistVersionChain(documentId: string, chain: DocumentVersionChain): void {
    try {
      const key = `worktree_chain_${documentId}`;
      localStorage.setItem(key, JSON.stringify(chain));
    } catch (error) {
      console.error('Failed to persist version chain:', error);
    }
  }

  /**
   * Load version chain from localStorage
   */
  private loadVersionChain(documentId: string): DocumentVersionChain | null {
    try {
      const key = `worktree_chain_${documentId}`;
      const stored = localStorage.getItem(key);
      if (stored) {
        return JSON.parse(stored) as DocumentVersionChain;
      }
    } catch (error) {
      console.error('Failed to load version chain:', error);
    }
    return null;
  }

  /**
   * Initialize the service
   */
  async initialize(): Promise<void> {
    // Load all persisted version chains
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key?.startsWith('worktree_chain_')) {
        const documentId = key.replace('worktree_chain_', '');
        const chain = this.loadVersionChain(documentId);
        if (chain) {
          this.versionChains.set(documentId, chain);
        }
      }
    }

    console.log(`Initialized IntegratedWorkTreeService with ${this.versionChains.size} version chains`);
  }

  /**
   * Check if the service is ready for blockchain operations
   */
  isReady(): boolean {
    return this.blockchainService.isReady();
  }

  /**
   * Get the underlying blockchain service
   */
  getBlockchainService(): BlockchainDocumentService {
    return this.blockchainService;
  }

  /**
   * Get the underlying inscription service
   */
  getInscriptionService(): DocumentInscriptionService {
    return this.inscriptionService;
  }
}