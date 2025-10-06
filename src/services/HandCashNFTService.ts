/**
 * HandCash NFT Service
 * Integrates with HandCash Items API to mint documents as NFTs
 */

import { HandCashService } from './HandCashService';
import { DocumentPackage } from './BSVStorageService';

export interface NFTMintOptions {
  name: string;
  description: string;
  imageUrl?: string;
  rarity?: 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary';
  attributes?: Array<{
    name: string;
    value: string | number;
    type?: 'text' | 'number' | 'date';
  }>;
  quantity?: number;
  initialPrice?: number;
  royaltyPercentage?: number;
  listForSale?: boolean;
}

export interface NFTItem {
  id: string;
  origin: string;
  name: string;
  description: string;
  rarity: string;
  imageUrl: string;
  quantity: number;
  customParameters?: {
    documentTitle?: string;
    wordCount?: number;
    createdAt?: string;
    contentHash?: string;
    storageMethod?: string;
    contentUrl?: string;
    price?: number;
    currency?: string;
  };
  marketUrl?: string;
}

export interface NFTListing {
  id: string;
  itemId: string;
  itemOrigin: string;
  price: number;
  currency: string;
  quantity: number;
  status: string;
  createdAt: string;
}

export interface NFTMintResult {
  success: boolean;
  item: NFTItem;
  listing?: NFTListing;
  message: string;
  marketUrl: string;
  warning?: string;
}

export class HandCashNFTService {
  private handcashService: HandCashService;
  private baseUrl: string;

  constructor(handcashService: HandCashService) {
    this.handcashService = handcashService;
    // Use the API endpoint in our application
    this.baseUrl = '/api/handcash-items';
  }

  /**
   * Mint a document as an NFT using HandCash Items
   */
  async mintDocumentAsNFT(
    document: DocumentPackage,
    options: NFTMintOptions
  ): Promise<NFTMintResult> {
    if (!this.handcashService.isAuthenticated()) {
      throw new Error('HandCash authentication required');
    }

    const authToken = this.handcashService.getAccessToken();
    if (!authToken) {
      throw new Error('No auth token available');
    }

    try {
      // Prepare document metadata for NFT
      const documentMetadata = {
        id: `doc_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        title: document.title,
        wordCount: document.wordCount,
        createdAt: new Date(document.timestamp).toISOString(),
        contentHash: document.contentHash,
        storageMethod: 'handcash-nft',
        author: document.author
      };

      // Generate document attributes for NFT
      const nftAttributes = [
        {
          name: 'Word Count',
          value: document.wordCount,
          type: 'number' as const
        },
        {
          name: 'Character Count', 
          value: document.characterCount,
          type: 'number' as const
        },
        {
          name: 'Created Date',
          value: new Date(document.timestamp).toLocaleDateString(),
          type: 'date' as const
        },
        {
          name: 'Author',
          value: document.author,
          type: 'text' as const
        },
        {
          name: 'Encrypted',
          value: document.encrypted ? 'Yes' : 'No',
          type: 'text' as const
        },
        ...(options.attributes || [])
      ];

      // Prepare the item data for HandCash
      const itemData = {
        name: options.name || document.title,
        description: options.description || `A document titled "${document.title}" by ${document.author}`,
        imageUrl: options.imageUrl || this.generateDocumentThumbnail(document),
        rarity: options.rarity || 'common',
        attributes: nftAttributes,
        quantity: options.quantity || 1,
        initialPrice: options.listForSale ? options.initialPrice : undefined,
        royaltyPercentage: options.royaltyPercentage || 5,
        documentContent: document.content,
        documentMetadata
      };

      // Make API call to mint NFT
      const response = await fetch(this.baseUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          authToken,
          action: 'createItem',
          itemData
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.details || errorData.error || 'Failed to mint NFT');
      }

      const result: NFTMintResult = await response.json();
      
      console.log('Document minted as NFT:', {
        itemId: result.item.id,
        name: result.item.name,
        marketUrl: result.marketUrl
      });

      return result;
      
    } catch (error) {
      console.error('Failed to mint document as NFT:', error);
      throw new Error(`NFT minting failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * List an existing NFT for sale
   */
  async listNFTForSale(
    itemId: string,
    itemOrigin: string,
    price: number,
    currency: string = 'USD',
    quantity: number = 1
  ): Promise<NFTListing> {
    if (!this.handcashService.isAuthenticated()) {
      throw new Error('HandCash authentication required');
    }

    const authToken = this.handcashService.getAccessToken();
    if (!authToken) {
      throw new Error('No auth token available');
    }

    try {
      const response = await fetch(this.baseUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          authToken,
          action: 'listItem',
          itemData: {
            itemId,
            itemOrigin,
            price,
            currency,
            quantity
          }
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.details || 'Failed to list NFT');
      }

      const result = await response.json();
      return result.listing;
      
    } catch (error) {
      console.error('Failed to list NFT for sale:', error);
      throw new Error(`Listing failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Get user's NFT collection
   */
  async getUserNFTs(): Promise<{ items: NFTItem[]; listings: NFTListing[] }> {
    if (!this.handcashService.isAuthenticated()) {
      throw new Error('HandCash authentication required');
    }

    const authToken = this.handcashService.getAccessToken();
    if (!authToken) {
      throw new Error('No auth token available');
    }

    try {
      const response = await fetch(this.baseUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          authToken,
          action: 'getItems'
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.details || 'Failed to get NFTs');
      }

      const result = await response.json();
      
      return {
        items: result.items || [],
        listings: result.listings || []
      };
      
    } catch (error) {
      console.error('Failed to get user NFTs:', error);
      throw new Error(`Failed to retrieve NFTs: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Transfer NFT to another user
   */
  async transferNFT(
    itemId: string,
    itemOrigin: string,
    destinationHandle?: string,
    destinationEmail?: string
  ): Promise<boolean> {
    if (!this.handcashService.isAuthenticated()) {
      throw new Error('HandCash authentication required');
    }

    if (!destinationHandle && !destinationEmail) {
      throw new Error('Destination handle or email required');
    }

    const authToken = this.handcashService.getAccessToken();
    if (!authToken) {
      throw new Error('No auth token available');
    }

    try {
      const response = await fetch(this.baseUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          authToken,
          action: 'transferItem',
          itemData: {
            itemId,
            itemOrigin,
            destinationHandle,
            destinationEmail
          }
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.details || 'Failed to transfer NFT');
      }

      const result = await response.json();
      return result.success;
      
    } catch (error) {
      console.error('Failed to transfer NFT:', error);
      throw new Error(`Transfer failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Generate a thumbnail URL for a document
   */
  private generateDocumentThumbnail(document: DocumentPackage): string {
    // In production, this could generate actual thumbnails
    // For now, return a default document NFT image
    const params = new URLSearchParams({
      title: document.title,
      author: document.author,
      words: document.wordCount.toString(),
      date: new Date(document.timestamp).toLocaleDateString()
    });

    return `https://bitcoin-writer.vercel.app/api/generate-nft-image?${params.toString()}`;
  }

  /**
   * Generate NFT attributes from document
   */
  public generateDocumentAttributes(document: DocumentPackage): Array<{
    name: string;
    value: string | number;
    type: 'text' | 'number' | 'date';
  }> {
    return [
      {
        name: 'Word Count',
        value: document.wordCount,
        type: 'number'
      },
      {
        name: 'Character Count',
        value: document.characterCount,
        type: 'number'
      },
      {
        name: 'Author',
        value: document.author,
        type: 'text'
      },
      {
        name: 'Created',
        value: new Date(document.timestamp).toLocaleDateString(),
        type: 'date'
      },
      {
        name: 'Version',
        value: document.version,
        type: 'text'
      },
      {
        name: 'Encrypted',
        value: document.encrypted ? 'Yes' : 'No',
        type: 'text'
      }
    ];
  }

  /**
   * Check if service is ready
   */
  public isReady(): boolean {
    return this.handcashService.isAuthenticated();
  }
}

export default HandCashNFTService;