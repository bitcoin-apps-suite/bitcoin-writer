/**
 * PriceService - Real-time token price feeds
 * Fetches prices from various sources including exchanges and DEXs
 */

export interface TokenPrice {
  symbol: string;
  name: string;
  price: number;
  price_usd: number;
  price_btc?: number;
  change_24h: number;
  change_percent_24h: number;
  volume_24h: number;
  market_cap?: number;
  last_updated: Date;
  source: string;
}

export interface PriceSubscription {
  unsubscribe: () => void;
}

class PriceServiceClass {
  private prices: Map<string, TokenPrice> = new Map();
  private subscribers: Map<string, Set<(price: TokenPrice) => void>> = new Map();
  private updateInterval: number = 30000; // 30 seconds
  private intervalId?: NodeJS.Timeout;
  private wsConnections: Map<string, WebSocket> = new Map();

  constructor() {
    this.startPriceUpdates();
  }

  /**
   * Start periodic price updates
   */
  private startPriceUpdates() {
    // Initial fetch
    this.fetchAllPrices();
    
    // Set up interval
    this.intervalId = setInterval(() => {
      this.fetchAllPrices();
    }, this.updateInterval);
  }

  /**
   * Fetch all token prices
   */
  private async fetchAllPrices() {
    try {
      // Fetch BSV price from multiple sources for reliability
      await Promise.all([
        this.fetchBSVPrice(),
        this.fetchBWriterPrice(),
        this.fetchBRC100Prices(),
      ]);
    } catch (error) {
      console.error('Error fetching prices:', error);
    }
  }

  /**
   * Fetch BSV price from CoinGecko API
   */
  private async fetchBSVPrice() {
    try {
      // CoinGecko free API endpoint for BSV
      const response = await fetch(
        'https://api.coingecko.com/api/v3/simple/price?ids=bitcoin-cash-sv&vs_currencies=usd,btc&include_24hr_change=true&include_24hr_vol=true'
      );
      
      if (!response.ok) throw new Error('Failed to fetch BSV price');
      
      const data = await response.json();
      const bsvData = data['bitcoin-cash-sv'];
      
      const price: TokenPrice = {
        symbol: 'BSV',
        name: 'Bitcoin SV',
        price: bsvData.usd,
        price_usd: bsvData.usd,
        price_btc: bsvData.btc,
        change_24h: bsvData.usd_24h_change || 0,
        change_percent_24h: bsvData.usd_24h_change || 0,
        volume_24h: bsvData.usd_24h_vol || 0,
        last_updated: new Date(),
        source: 'CoinGecko'
      };
      
      this.updatePrice('BSV', price);
    } catch (error) {
      console.error('Failed to fetch BSV price:', error);
      // Try alternative source
      await this.fetchBSVPriceFromWhatsOnChain();
    }
  }

  /**
   * Alternative BSV price source from WhatsOnChain
   */
  private async fetchBSVPriceFromWhatsOnChain() {
    try {
      const response = await fetch('https://api.whatsonchain.com/v1/bsv/main/exchangerate');
      if (!response.ok) throw new Error('Failed to fetch from WhatsOnChain');
      
      const data = await response.json();
      
      const price: TokenPrice = {
        symbol: 'BSV',
        name: 'Bitcoin SV',
        price: data.rate,
        price_usd: data.rate,
        change_24h: 0, // Not provided by this API
        change_percent_24h: 0,
        volume_24h: 0,
        last_updated: new Date(),
        source: 'WhatsOnChain'
      };
      
      this.updatePrice('BSV', price);
    } catch (error) {
      console.error('Failed to fetch BSV price from WhatsOnChain:', error);
    }
  }

  /**
   * Fetch BWRITER token price
   * This would connect to a DEX or custom price oracle
   */
  private async fetchBWriterPrice() {
    try {
      // For now, we'll use a mock endpoint
      // In production, this would connect to a DEX API or price oracle
      const mockPrice: TokenPrice = {
        symbol: 'BWRITER',
        name: 'Bitcoin Writer',
        price: 0.0234,
        price_usd: 0.0234,
        change_24h: 0.0018,
        change_percent_24h: 8.33,
        volume_24h: 125000,
        market_cap: 234000,
        last_updated: new Date(),
        source: 'Mock DEX'
      };
      
      // TODO: Replace with real DEX API call
      // const response = await fetch('https://api.dex.bsv/tokens/BWRITER');
      
      this.updatePrice('BWRITER', mockPrice);
    } catch (error) {
      console.error('Failed to fetch BWRITER price:', error);
    }
  }

  /**
   * Fetch BRC100 token prices for document tokens
   */
  private async fetchBRC100Prices() {
    try {
      // BRC100 tokens would be fetched from a BSV DEX or indexer
      // For document tokens, we'd query the BRC100 indexer
      
      // Mock implementation for now
      const tokens = ['DOC', 'WRITER', 'PUB'];
      
      for (const token of tokens) {
        const mockPrice: TokenPrice = {
          symbol: token,
          name: `${token} Token`,
          price: Math.random() * 0.1,
          price_usd: Math.random() * 0.1,
          change_24h: (Math.random() - 0.5) * 0.01,
          change_percent_24h: (Math.random() - 0.5) * 10,
          volume_24h: Math.random() * 10000,
          last_updated: new Date(),
          source: 'BRC100 Indexer'
        };
        
        this.updatePrice(token, mockPrice);
      }
    } catch (error) {
      console.error('Failed to fetch BRC100 prices:', error);
    }
  }

  /**
   * Connect to WebSocket for real-time price updates
   */
  public connectWebSocket(symbol: string, wsUrl: string) {
    try {
      const ws = new WebSocket(wsUrl);
      
      ws.onmessage = (event) => {
        const data = JSON.parse(event.data);
        if (data.symbol === symbol && data.price) {
          const currentPrice = this.prices.get(symbol);
          if (currentPrice) {
            currentPrice.price = data.price;
            currentPrice.price_usd = data.price_usd || data.price;
            currentPrice.last_updated = new Date();
            this.updatePrice(symbol, currentPrice);
          }
        }
      };
      
      ws.onerror = (error) => {
        console.error(`WebSocket error for ${symbol}:`, error);
      };
      
      ws.onclose = () => {
        console.log(`WebSocket closed for ${symbol}`);
        // Attempt to reconnect after 5 seconds
        setTimeout(() => {
          this.connectWebSocket(symbol, wsUrl);
        }, 5000);
      };
      
      this.wsConnections.set(symbol, ws);
    } catch (error) {
      console.error(`Failed to connect WebSocket for ${symbol}:`, error);
    }
  }

  /**
   * Update price and notify subscribers
   */
  private updatePrice(symbol: string, price: TokenPrice) {
    this.prices.set(symbol, price);
    
    // Notify subscribers
    const subs = this.subscribers.get(symbol);
    if (subs) {
      subs.forEach(callback => callback(price));
    }
  }

  /**
   * Get current price for a token
   */
  public getPrice(symbol: string): TokenPrice | null {
    return this.prices.get(symbol) || null;
  }

  /**
   * Get all current prices
   */
  public getAllPrices(): TokenPrice[] {
    return Array.from(this.prices.values());
  }

  /**
   * Subscribe to price updates for a specific token
   */
  public subscribe(symbol: string, callback: (price: TokenPrice) => void): PriceSubscription {
    if (!this.subscribers.has(symbol)) {
      this.subscribers.set(symbol, new Set());
    }
    
    this.subscribers.get(symbol)!.add(callback);
    
    // Send current price if available
    const currentPrice = this.prices.get(symbol);
    if (currentPrice) {
      callback(currentPrice);
    }
    
    return {
      unsubscribe: () => {
        const subs = this.subscribers.get(symbol);
        if (subs) {
          subs.delete(callback);
        }
      }
    };
  }

  /**
   * Subscribe to all price updates
   */
  public subscribeAll(callback: (prices: TokenPrice[]) => void): PriceSubscription {
    const handler = () => {
      callback(this.getAllPrices());
    };
    
    // Subscribe to all existing symbols
    const symbols = new Set([...this.prices.keys(), 'BSV', 'BWRITER']);
    symbols.forEach(symbol => {
      this.subscribe(symbol, handler);
    });
    
    return {
      unsubscribe: () => {
        symbols.forEach(symbol => {
          const subs = this.subscribers.get(symbol);
          if (subs) {
            subs.delete(handler);
          }
        });
      }
    };
  }

  /**
   * Clean up resources
   */
  public destroy() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
    
    // Close all WebSocket connections
    this.wsConnections.forEach(ws => {
      ws.close();
    });
    this.wsConnections.clear();
    
    // Clear subscribers
    this.subscribers.clear();
  }
}

// Singleton instance
export const PriceService = new PriceServiceClass();

/**
 * Document Tokenization Strategy using BRC100
 * 
 * BRC100 is better than 1sat ordinals for documents because:
 * 1. Fungible tokens allow fractional ownership
 * 2. Better liquidity and trading capabilities  
 * 3. Can implement royalties and revenue sharing
 * 4. More efficient for large documents
 * 
 * Each document can be tokenized as:
 * - Total supply: 1,000,000 tokens per document
 * - Author retains: 51% (510,000 tokens)
 * - Available for sale: 49% (490,000 tokens)
 * - Readers can buy tokens to:
 *   - Access the document
 *   - Share in future revenues
 *   - Trade on secondary markets
 */
export interface DocumentToken {
  documentId: string;
  tokenId: string; // BRC100 token ID
  symbol: string; // e.g., "DOC-123"
  name: string; // Document title
  totalSupply: number;
  circulatingSupply: number;
  authorAddress: string;
  price: number; // Price per token in BSV
  deployed: boolean;
  contractAddress?: string;
}

export class DocumentTokenizationService {
  /**
   * Deploy a new BRC100 token for a document
   */
  async deployDocumentToken(
    documentId: string,
    title: string,
    authorAddress: string
  ): Promise<DocumentToken> {
    // This would interact with BRC100 protocol to deploy token
    // For now, return mock data
    
    const token: DocumentToken = {
      documentId,
      tokenId: `BRC100-${Date.now()}`,
      symbol: `DOC-${documentId.substring(0, 6).toUpperCase()}`,
      name: title,
      totalSupply: 1000000,
      circulatingSupply: 0,
      authorAddress,
      price: 0.00001, // Initial price in BSV
      deployed: false
    };
    
    // TODO: Implement actual BRC100 deployment
    // const contract = await deployBRC100Token(token);
    // token.contractAddress = contract.address;
    // token.deployed = true;
    
    return token;
  }
  
  /**
   * Mint initial token supply
   */
  async mintTokens(token: DocumentToken): Promise<boolean> {
    // Mint tokens to author's address
    // TODO: Implement BRC100 minting
    return true;
  }
  
  /**
   * List tokens for sale on DEX
   */
  async listOnDEX(token: DocumentToken, amount: number, price: number): Promise<boolean> {
    // List tokens on BSV DEX
    // TODO: Implement DEX listing
    return true;
  }
}