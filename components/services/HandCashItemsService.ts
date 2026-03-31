// HandCash Items Service - delegates to HandCashNFTService
import { HandCashNFTService, NFTItem } from '../../services/HandCashNFTService';
import { HandCashService } from '../../services/HandCashService';

export class HandCashItemsService {
  private static nftService: HandCashNFTService | null = null;

  private static getService(): HandCashNFTService {
    if (!this.nftService) {
      this.nftService = new HandCashNFTService(new HandCashService());
    }
    return this.nftService;
  }

  static async getNftDocuments(authorType: string): Promise<{ success: boolean; documents: NFTItem[] }> {
    try {
      const items = await this.getService().getUserItems();
      const filtered = items.filter(
        (item) => item.customParameters?.documentTitle
      );
      return { success: true, documents: filtered };
    } catch (error) {
      console.error('Failed to get NFT documents:', error);
      return { success: true, documents: [] };
    }
  }

  static async listItemForSale(itemId: string, price: number, quantity: number) {
    try {
      const result = await this.getService().listItemForSale(itemId, 'default', price, 'USD', quantity);
      return { success: result.success, message: result.success ? 'Item listed for sale' : 'Failed to list' };
    } catch (error) {
      console.error('Failed to list item:', error);
      return { success: false, message: 'Failed to list item for sale' };
    }
  }

  static getMarketUrl(itemOrigin: string, itemId: string) {
    return `https://market.handcash.io/item/${itemOrigin}/${itemId}`;
  }

  static async transferItem(itemId: string, toHandle: string) {
    try {
      const result = await this.getService().transferItem(itemId, 'default', toHandle);
      return { success: result.success, message: result.success ? 'Item transferred' : 'Transfer failed' };
    } catch (error) {
      console.error('Failed to transfer item:', error);
      return { success: false, message: 'Failed to transfer item' };
    }
  }
}
