// HandCash Items Service - Handle NFT minting and marketplace operations

export interface NFTMetadata {
  name: string;
  description: string;
  imageUrl?: string;
  rarity?: 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary';
  attributes?: Array<{ name: string; value: string }>;
  quantity: number;
  initialPrice?: number;
  royaltyPercentage?: number;
}

export interface DocumentNFTData extends NFTMetadata {
  documentContent?: string;
  documentMetadata?: {
    id: string;
    title: string;
    wordCount: number;
    createdAt: string;
    contentHash?: string;
    storageMethod?: string;
    contentUrl?: string;
  };
}

export interface HandCashItem {
  id: string;
  origin: string;
  name: string;
  description: string;
  imageUrl?: string;
  quantity: number;
  rarity: string;
  attributes: any[];
  customParameters?: any;
}

export interface MarketListing {
  id: string;
  itemId: string;
  price: number;
  currency: string;
  quantity: number;
}

export class HandCashItemsService {
  private apiBase: string;
  
  constructor() {
    // Determine API endpoint based on environment
    this.apiBase = process.env.NODE_ENV === 'production' 
      ? ''  // In production, use same origin (Vercel handles /api routes)
      : 'http://localhost:4000';  // Local API server on port 4000
  }

  /**
   * Mint a document as an NFT using HandCash Items protocol
   */
  async mintDocumentNFT(authToken: string, nftData: DocumentNFTData): Promise<{
    success: boolean;
    item?: HandCashItem;
    listing?: MarketListing;
    message: string;
    marketUrl?: string;
    error?: string;
  }> {
    try {
      console.log('Minting document as NFT:', {
        name: nftData.name,
        quantity: nftData.quantity,
        price: nftData.initialPrice
      });

      const response = await fetch(`${this.apiBase}/api/handcash-items`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          authToken,
          action: 'createItem',
          itemData: nftData
        })
      });

      const data = await response.json();

      if (!response.ok) {
        console.error('NFT minting failed:', data);
        return {
          success: false,
          message: data.error || 'Failed to mint NFT',
          error: data.details
        };
      }

      console.log('NFT minted successfully:', data);
      return data;
    } catch (error: any) {
      console.error('Error minting NFT:', error);
      return {
        success: false,
        message: 'Failed to mint NFT',
        error: error.message
      };
    }
  }

  /**
   * List an existing NFT for sale on HandCash Market
   */
  async listItemForSale(
    authToken: string,
    itemId: string,
    itemOrigin: string,
    price: number,
    quantity: number = 1
  ): Promise<{
    success: boolean;
    listing?: MarketListing;
    message: string;
    error?: string;
  }> {
    try {
      const response = await fetch(`${this.apiBase}/api/handcash-items`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          authToken,
          action: 'listItem',
          itemData: {
            itemId,
            itemOrigin,
            price,
            quantity,
            currency: 'USD'
          }
        })
      });

      const data = await response.json();

      if (!response.ok) {
        return {
          success: false,
          message: data.error || 'Failed to list item',
          error: data.details
        };
      }

      return data;
    } catch (error: any) {
      console.error('Error listing item:', error);
      return {
        success: false,
        message: 'Failed to list item for sale',
        error: error.message
      };
    }
  }

  /**
   * Get user's NFT inventory
   */
  async getUserItems(authToken: string): Promise<{
    success: boolean;
    items?: HandCashItem[];
    totalItems?: number;
    listings?: MarketListing[];
    message: string;
    error?: string;
  }> {
    try {
      const response = await fetch(`${this.apiBase}/api/handcash-items`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          authToken,
          action: 'getItems'
        })
      });

      const data = await response.json();

      if (!response.ok) {
        return {
          success: false,
          message: data.error || 'Failed to get items',
          error: data.details,
          items: [],
          totalItems: 0
        };
      }

      return data;
    } catch (error: any) {
      console.error('Error getting items:', error);
      return {
        success: false,
        message: 'Failed to retrieve NFT inventory',
        error: error.message,
        items: [],
        totalItems: 0
      };
    }
  }

  /**
   * Transfer an NFT to another user
   */
  async transferItem(
    authToken: string,
    itemId: string,
    itemOrigin: string,
    destinationHandle: string
  ): Promise<{
    success: boolean;
    transfer?: any;
    message: string;
    error?: string;
  }> {
    try {
      const response = await fetch(`${this.apiBase}/api/handcash-items`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          authToken,
          action: 'transferItem',
          itemData: {
            itemId,
            itemOrigin,
            destinationHandle
          }
        })
      });

      const data = await response.json();

      if (!response.ok) {
        return {
          success: false,
          message: data.error || 'Failed to transfer item',
          error: data.details
        };
      }

      return data;
    } catch (error: any) {
      console.error('Error transferring item:', error);
      return {
        success: false,
        message: 'Failed to transfer NFT',
        error: error.message
      };
    }
  }

  /**
   * Create a shareable URL for the NFT on HandCash Market
   */
  getMarketUrl(itemOrigin: string, itemId: string): string {
    return `https://market.handcash.io/item/${itemOrigin}/${itemId}`;
  }

  /**
   * Generate a default NFT image for documents
   * In production, this could generate actual document preview images
   */
  async generateDocumentPreviewImage(
    documentTitle: string,
    documentContent: string
  ): Promise<string> {
    // For now, return a placeholder
    // In production, this could:
    // 1. Generate a preview image using Canvas API
    // 2. Upload to IPFS or cloud storage
    // 3. Return the URL
    return 'https://bitcoin-writer.vercel.app/document-nft-default.png';
  }

  /**
   * Calculate content hash for verification
   */
  calculateContentHash(content: string): string {
    // Simple hash for now - in production use proper crypto
    let hash = 0;
    for (let i = 0; i < content.length; i++) {
      const char = content.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32bit integer
    }
    return Math.abs(hash).toString(16);
  }
}