/**
 * Monetization Service
 * App-specific service for NFT minting and file shares tokenization
 * Uses StorageAdapter for cross-platform persistence
 */

import CryptoJS from 'crypto-js';
import HandCashNFTService, { NFTMintOptions } from './HandCashNFTService';
import type { DocumentData, BlockchainDocument } from './BlockchainDocumentService';

// Storage adapter interface for cross-platform persistence
export interface StorageAdapter {
  get(key: string): Promise<string | null>;
  set(key: string, value: string): Promise<void>;
  remove(key: string): Promise<void>;
}

export interface NFTMetadata {
  tokenId: string;
  itemOrigin?: string;
  handcashItem?: any;
  marketplaceUrl: string;
  mintDate: string;
  documentId: string;
  contractAddress?: string;
  metadata?: {
    name: string;
    description: string;
    image: string;
    attributes: Array<{
      trait_type: string;
      value: string | number;
    }>;
    contentHash: string;
  };
  owner?: string;
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

export interface FileSharesData {
  documentId: string;
  documentTitle: string;
  author: string;
  totalShares: number;
  availableShares: number;
  pricePerShare: number;
  totalFundraisingTarget: number;
  authorRoyalty: number;
  tokenSymbol: string;
  shareholders: any[];
  revenueDistributed: number;
  createdDate: string;
  smartContractAddress: string;
  contentHash: string;
  shareTokens: Array<{
    shareId: number;
    owner: string | null;
    purchaseDate: string | null;
    purchasePrice: number;
  }>;
}

export interface SharesConfig {
  totalShares?: number;
  pricePerShare?: number;
  authorRoyalty?: number;
  shareTokenSymbol?: string;
}

export type DocumentRarity = 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary';

export class MonetizationService {
  private storage: StorageAdapter;
  private nftService: HandCashNFTService;
  private currentUserId: string | null = null;

  constructor(storage: StorageAdapter, nftService: HandCashNFTService) {
    this.storage = storage;
    this.nftService = nftService;
  }

  /**
   * Set the current user
   */
  setCurrentUser(userId: string): void {
    this.currentUserId = userId;
  }

  /**
   * Mint document as NFT using HandCash Items
   */
  async mintDocumentAsNFT(
    document: DocumentData | BlockchainDocument,
    content: string,
    options?: NFTMintOptions
  ): Promise<NFTMetadata> {
    console.log('[MonetizationService] Minting NFT for document:', document.title);

    try {
      // Create document package for NFT
      const documentPackage: DocumentPackage = {
        version: '2.0',
        timestamp: Date.now(),
        author: 'author' in document ? document.author || '' : document.metadata.author,
        title: document.title,
        content: content,
        contentHash: CryptoJS.SHA256(content).toString(),
        encrypted: 'encrypted' in document ? document.encrypted || false : document.metadata.encrypted,
        wordCount: 'word_count' in document ? document.word_count || 0 : document.metadata.word_count,
        characterCount: 'character_count' in document ? document.character_count || 0 : document.metadata.character_count
      };

      // Configure NFT mint options
      const wordCount = documentPackage.wordCount;
      const mintOptions: NFTMintOptions = {
        name: options?.name || document.title,
        description: options?.description || `Unique document NFT created by ${documentPackage.author}`,
        rarity: options?.rarity || this.determineDocumentRarity(wordCount),
        attributes: options?.attributes || [
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
        quantity: options?.quantity || 1,
        royaltyPercentage: options?.royaltyPercentage || 5,
        listForSale: options?.listForSale || false
      };

      // Mint the NFT using HandCash Items
      const mintResult = await this.nftService.mintDocumentAsNFT(documentPackage, mintOptions);

      // Create NFT metadata
      const nftMetadata: NFTMetadata = {
        tokenId: mintResult.item.id,
        itemOrigin: mintResult.item.origin,
        handcashItem: mintResult.item,
        marketplaceUrl: mintResult.marketUrl,
        mintDate: new Date().toISOString(),
        documentId: document.id
      };

      // Store NFT reference
      await this.storeNFTMetadata(document.id, nftMetadata);

      console.log('[MonetizationService] NFT minted successfully:', {
        itemId: mintResult.item.id,
        marketUrl: mintResult.marketUrl
      });

      return nftMetadata;

    } catch (error) {
      console.error('[MonetizationService] Failed to mint NFT:', error);
      // Fallback to local storage for demo
      return await this.mintNFTFallback(document, content);
    }
  }

  /**
   * Create tokenized file shares for document
   */
  async createFileShares(
    document: DocumentData | BlockchainDocument,
    content: string,
    config: SharesConfig = {}
  ): Promise<FileSharesData> {
    console.log('[MonetizationService] Creating file shares for document:', document.title);

    const author = 'author' in document ? document.author || '' : document.metadata.author;

    // Default share configuration
    const shareConfig = {
      totalShares: config.totalShares || 100,
      pricePerShare: config.pricePerShare || 0.01,
      authorRoyalty: config.authorRoyalty || 5,
      shareTokenSymbol: config.shareTokenSymbol || `${document.title.substring(0, 5).toUpperCase()}SHR`
    };

    // Create tokenized shares structure
    const sharesData: FileSharesData = {
      documentId: document.id,
      documentTitle: document.title,
      author: author,
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
        owner: null,
        purchaseDate: null,
        purchasePrice: shareConfig.pricePerShare
      }))
    };

    // Store shares data
    await this.storeFileShares(document.id, sharesData);

    console.log('[MonetizationService] File shares created:', {
      tokenSymbol: shareConfig.shareTokenSymbol,
      totalShares: shareConfig.totalShares,
      fundraisingTarget: `$${shareConfig.totalShares * shareConfig.pricePerShare}`,
      authorRoyalty: `${shareConfig.authorRoyalty}%`,
      contractAddress: sharesData.smartContractAddress
    });

    return sharesData;
  }

  /**
   * Get all NFTs for current user
   */
  async getUserNFTs(): Promise<NFTMetadata[]> {
    if (!this.currentUserId) {
      throw new Error('No current user set');
    }

    const nfts: NFTMetadata[] = [];
    const nftPrefix = `nft_${this.currentUserId}_`;

    // Get all keys with NFT prefix
    const allKeys = await this.getAllStorageKeys();

    for (const key of allKeys) {
      if (key.startsWith(nftPrefix)) {
        const nftData = await this.storage.get(key);
        if (nftData) {
          try {
            nfts.push(JSON.parse(nftData));
          } catch (error) {
            console.error('[MonetizationService] Failed to parse NFT data:', error);
          }
        }
      }
    }

    return nfts;
  }

  /**
   * Get all file shares for current user
   */
  async getUserFileShares(): Promise<FileSharesData[]> {
    if (!this.currentUserId) {
      throw new Error('No current user set');
    }

    const shares: FileSharesData[] = [];
    const sharesPrefix = `shares_${this.currentUserId}_`;

    // Get all keys with shares prefix
    const allKeys = await this.getAllStorageKeys();

    for (const key of allKeys) {
      if (key.startsWith(sharesPrefix)) {
        const shareData = await this.storage.get(key);
        if (shareData) {
          try {
            shares.push(JSON.parse(shareData));
          } catch (error) {
            console.error('[MonetizationService] Failed to parse share data:', error);
          }
        }
      }
    }

    return shares;
  }

  /**
   * Get NFT metadata for a specific document
   */
  async getNFTForDocument(documentId: string): Promise<NFTMetadata | null> {
    if (!this.currentUserId) {
      throw new Error('No current user set');
    }

    const nftKey = `nft_${this.currentUserId}_${documentId}`;
    const nftData = await this.storage.get(nftKey);

    if (!nftData) return null;

    try {
      return JSON.parse(nftData);
    } catch (error) {
      console.error('[MonetizationService] Failed to parse NFT metadata:', error);
      return null;
    }
  }

  /**
   * Get file shares for a specific document
   */
  async getFileSharesForDocument(documentId: string): Promise<FileSharesData | null> {
    if (!this.currentUserId) {
      throw new Error('No current user set');
    }

    const sharesKey = `shares_${this.currentUserId}_${documentId}`;
    const sharesData = await this.storage.get(sharesKey);

    if (!sharesData) return null;

    try {
      return JSON.parse(sharesData);
    } catch (error) {
      console.error('[MonetizationService] Failed to parse file shares:', error);
      return null;
    }
  }

  // ========== PRIVATE METHODS ==========

  /**
   * Fallback NFT creation for development
   */
  private async mintNFTFallback(
    document: DocumentData | BlockchainDocument,
    content: string
  ): Promise<NFTMetadata> {
    console.log('[MonetizationService] Using NFT fallback for development');

    const author = 'author' in document ? document.author || '' : document.metadata.author;
    const wordCount = 'word_count' in document ? document.word_count || 0 : document.metadata.word_count;

    const nftMetadata: NFTMetadata = {
      tokenId: document.id,
      contractAddress: 'demo_nft_contract_address',
      marketplaceUrl: `https://demo-marketplace.com/nft/${document.id}`,
      mintDate: new Date().toISOString(),
      documentId: document.id,
      metadata: {
        name: document.title,
        description: `Unique document NFT created by ${author}`,
        image: this.generateDocumentThumbnail(content),
        attributes: [
          {
            trait_type: "Author",
            value: author
          },
          {
            trait_type: "Word Count",
            value: wordCount
          },
          {
            trait_type: "Storage Method",
            value: "NFT Creation"
          }
        ],
        contentHash: CryptoJS.SHA256(content).toString()
      },
      owner: author
    };

    await this.storeNFTMetadata(document.id, nftMetadata);
    return nftMetadata;
  }

  /**
   * Determine document rarity based on word count
   */
  private determineDocumentRarity(wordCount: number): DocumentRarity {
    if (wordCount >= 50000) return 'legendary'; // 50k+ words
    if (wordCount >= 20000) return 'epic';      // 20k+ words
    if (wordCount >= 10000) return 'rare';      // 10k+ words
    if (wordCount >= 5000) return 'uncommon';   // 5k+ words
    return 'common';                            // Under 5k words
  }

  /**
   * Generate document thumbnail for NFT
   */
  private generateDocumentThumbnail(content: string): string {
    // In production: Generate actual thumbnail image
    // For demo: Return placeholder image URL
    return `https://via.placeholder.com/400x600/2563eb/ffffff?text=${encodeURIComponent('Document NFT')}`;
  }

  /**
   * Store NFT metadata
   */
  private async storeNFTMetadata(documentId: string, metadata: NFTMetadata): Promise<void> {
    if (!this.currentUserId) return;

    const nftKey = `nft_${this.currentUserId}_${documentId}`;
    await this.storage.set(nftKey, JSON.stringify(metadata));
  }

  /**
   * Store file shares data
   */
  private async storeFileShares(documentId: string, shares: FileSharesData): Promise<void> {
    if (!this.currentUserId) return;

    const sharesKey = `shares_${this.currentUserId}_${documentId}`;
    await this.storage.set(sharesKey, JSON.stringify(shares));
  }

  /**
   * Get all storage keys (platform-agnostic implementation)
   * Note: This requires StorageAdapter to support key enumeration
   * For now, we'll use a workaround with known prefixes
   */
  private async getAllStorageKeys(): Promise<string[]> {
    // This is a limitation of the current StorageAdapter interface
    // In a real implementation, we'd extend StorageAdapter to support key enumeration
    // For now, we return an empty array and rely on direct key access
    console.warn('[MonetizationService] getAllStorageKeys not fully implemented - requires StorageAdapter enhancement');
    return [];
  }
}

export default MonetizationService;
