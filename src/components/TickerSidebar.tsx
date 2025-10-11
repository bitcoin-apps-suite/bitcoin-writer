import React, { useState, useEffect } from 'react';
import { PriceService, TokenPrice as ServiceTokenPrice } from '../services/PriceService';
import './TickerSidebar.css';

interface TokenPrice extends ServiceTokenPrice {
  change24h: number;
  changePercent: number;
  contractId?: string;
  liquidity?: number;
  holders?: number;
  category?: string;
  isSpecial?: boolean;
  isGig?: boolean;
  totalShares?: number;
  marketCap?: number;
}

interface TickerSidebarProps {
  userHandle?: string;
  currentJobToken?: {
    symbol: string;
    name: string;
  };
  onCollapsedChange?: (collapsed: boolean) => void;
}

const TickerSidebar: React.FC<TickerSidebarProps> = ({
  userHandle,
  currentJobToken,
  onCollapsedChange
}) => {
  const [prices, setPrices] = useState<TokenPrice[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date());
  const [isCollapsed, setIsCollapsed] = useState(() => {
    const saved = localStorage.getItem('marketSidebarCollapsed');
    return saved === 'true';
  });

  useEffect(() => {
    console.log('TickerSidebar collapsed state changed:', isCollapsed);
    localStorage.setItem('marketSidebarCollapsed', isCollapsed.toString());
    onCollapsedChange?.(isCollapsed);
  }, [isCollapsed, onCollapsedChange]);

  useEffect(() => {
    // Generate article dividend share tokens and gig tokens
    const generateTrendingGigs = (): TokenPrice[] => {
      // Article dividend shares (very tiny prices as requested)
      const articles = [
        { 
          author: 'b0ase', 
          title: 'Future-of-digital-publishing', 
          name: 'Future of Digital Publishing', 
          category: 'Technology', 
          basePrice: 0.000024, // 24 micro-dollars
          volatility: 0.15,
          totalShares: 5000000
        },
        { 
          author: 'b0ase', 
          title: 'Crypto-content-monetization', 
          name: 'Crypto Content Monetization', 
          category: 'Finance', 
          basePrice: 0.000031, // 31 micro-dollars
          volatility: 0.12,
          totalShares: 5200000
        },
        { 
          author: 'b0ase', 
          title: 'Web3-publishing-future', 
          name: 'Web3 Publishing Future', 
          category: 'Technology', 
          basePrice: 0.000018, // 18 micro-dollars
          volatility: 0.18,
          totalShares: 5220000
        },
        { 
          author: 'sarahchen', 
          title: 'Building-sustainable-creator-economy', 
          name: 'Building Sustainable Creator Economy', 
          category: 'Business', 
          basePrice: 0.000027, // 27 micro-dollars
          volatility: 0.14,
          totalShares: 4800000
        },
        { 
          author: 'alexmart', 
          title: 'NFT-publishing-revolution', 
          name: 'NFT Publishing Revolution', 
          category: 'Technology', 
          basePrice: 0.000022, // 22 micro-dollars
          volatility: 0.16,
          totalShares: 4650000
        }
      ];

      // Traditional gig tokens (kept for variety)
      const gigs = [
        { base: 'bNews', name: 'Breaking News Writer', category: 'Media', basePrice: 0.012, volatility: 0.3 },
        { base: 'bSport', name: 'Sports Coverage', category: 'Sports', basePrice: 0.008, volatility: 0.25 },
        { base: 'bTech', name: 'Tech Analysis', category: 'Technology', basePrice: 0.025, volatility: 0.4 }
      ];

      // Generate article dividend shares with $bWriter format
      const articleShares = articles.map((article) => {
        // Simulate market dynamics with micro-price fluctuations
        const priceMultiplier = Math.random() * 0.4 + 0.8; // 0.8x to 1.2x variation
        const currentPrice = article.basePrice * priceMultiplier;
        const change = (Math.random() - 0.5) * currentPrice * article.volatility;
        const marketCap = currentPrice * article.totalShares;
        const volume = Math.floor(marketCap * 0.01 * (Math.random() * 2 + 0.5)); // 0.5% to 2.5% of market cap
        const holders = Math.floor(article.totalShares / 50000 + Math.random() * 50); // Realistic holder count
        
        return {
          symbol: `bWriter_${article.author}_${article.title}`,
          name: article.name,
          category: article.category,
          price: currentPrice,
          price_usd: currentPrice,
          change24h: change,
          changePercent: (change / currentPrice) * 100,
          change_24h: change,
          change_percent_24h: (change / currentPrice) * 100,
          volume_24h: volume,
          liquidity: volume,
          holders: holders,
          totalShares: article.totalShares,
          marketCap: marketCap,
          last_updated: new Date(),
          source: 'Bitcoin Writer',
          isGig: false,
          isSpecial: false
        };
      });

      // Generate traditional gigs with varying liquidity
      const gigsWithLiquidity = gigs.map((gig, index) => {
        const contractNum = Math.floor(Math.random() * 9000) + 1000;
        const contractId = `${Math.random().toString(36).substring(2, 5)}_${contractNum}`;
        
        // Simulate market dynamics with varying liquidity
        const liquidityMultiplier = Math.random() * 2 + 0.5; // 0.5x to 2.5x
        const basePrice = gig.basePrice * liquidityMultiplier;
        const change = (Math.random() - 0.5) * basePrice * gig.volatility;
        const liquidity = Math.floor(Math.random() * 100000 * liquidityMultiplier) + 5000;
        const holders = Math.floor(liquidity / 200 + Math.random() * 100);
        
        return {
          symbol: `${gig.base}_${contractId}`,
          name: gig.name,
          category: gig.category,
          contractId: contractId,
          price: basePrice,
          price_usd: basePrice,
          change24h: change,
          changePercent: (change / basePrice) * 100,
          change_24h: change,
          change_percent_24h: (change / basePrice) * 100,
          volume_24h: liquidity,
          liquidity: liquidity,
          holders: holders,
          last_updated: new Date(),
          source: 'Jobs Queue',
          isGig: true,
          isSpecial: false
        };
      });

      // Combine article shares and gigs, prioritizing article shares
      const allTokens = [
        ...articleShares.sort((a, b) => (b.marketCap || 0) - (a.marketCap || 0)), // Sort articles by market cap
        ...gigsWithLiquidity.sort((a, b) => (b.liquidity || 0) - (a.liquidity || 0)) // Sort gigs by liquidity
      ];
      
      return allTokens;
    };

    // Subscribe to price updates
    const subscription = PriceService.subscribeAll((updatedPrices) => {
      // Get core token prices (BSV first, then BWRITER)
      const allTokens = updatedPrices.filter(p => 
        p.symbol === 'BSV' || p.symbol === 'BWRITER'
      ).map(p => ({
        ...p,
        change24h: p.change_24h,
        changePercent: p.change_percent_24h,
        isSpecial: true,
        isGig: false
      }));
      
      // Ensure BSV comes first, then BWRITER
      const bsvToken = allTokens.find(p => p.symbol === 'BSV');
      const bwriterToken = allTokens.find(p => p.symbol === 'BWRITER');
      const corePrices: TokenPrice[] = [];
      if (bsvToken) corePrices.push(bsvToken);
      if (bwriterToken) corePrices.push(bwriterToken);

      // Add user's handle token if available
      let userToken: TokenPrice | null = null;
      if (userHandle) {
        userToken = {
          symbol: userHandle.toUpperCase(),
          name: `@${userHandle} Token`,
          price: 0.00156,
          price_usd: 0.00156,
          change24h: 0.00012,
          changePercent: 8.33,
          change_24h: 0.00012,
          change_percent_24h: 8.33,
          volume_24h: 15000,
          liquidity: 15000,
          holders: 42,
          last_updated: new Date(),
          source: 'HandCash',
          isSpecial: true,
          isGig: false,
          category: 'Creator'
        };
      }

      // Generate trending gig tokens
      const gigTokens = generateTrendingGigs();
      
      // Combine all prices: Special tokens at top, then sorted gigs
      const specialTokens = [...corePrices];
      if (userToken) specialTokens.push(userToken);
      
      const allPrices = [...specialTokens, ...gigTokens];
      
      setPrices(allPrices);
      setLastUpdate(new Date());
      setIsLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [userHandle, currentJobToken]);

  const formatPrice = (price: number): string => {
    if (price >= 1000) {
      return `$${price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    } else if (price >= 1) {
      return `$${price.toFixed(2)}`;
    } else if (price >= 0.01) {
      return `$${price.toFixed(4)}`;
    } else if (price >= 0.001) {
      return `$${price.toFixed(6)}`;
    } else {
      // For very small prices (dividend shares), show with full decimal precision
      return `$${price.toFixed(8)}`;
    }
  };

  const formatVolume = (volume?: number): string => {
    if (!volume) return 'N/A';
    if (volume >= 1000000) {
      return `$${(volume / 1000000).toFixed(1)}M`;
    } else if (volume >= 1000) {
      return `$${(volume / 1000).toFixed(1)}K`;
    }
    return `$${volume.toFixed(0)}`;
  };

  const formatLiquidity = (liquidity?: number): string => {
    if (!liquidity) return 'Low';
    if (liquidity >= 100000) return 'Very High';
    if (liquidity >= 50000) return 'High';
    if (liquidity >= 10000) return 'Medium';
    if (liquidity >= 5000) return 'Fair';
    return 'Low';
  };

  const getLiquidityColor = (liquidity?: number): string => {
    if (!liquidity) return '#666';
    if (liquidity >= 100000) return '#4CAF50';
    if (liquidity >= 50000) return '#8BC34A';
    if (liquidity >= 10000) return '#FFC107';
    if (liquidity >= 5000) return '#FF9800';
    return '#f44336';
  };

  const formatTime = (date: Date): string => {
    return date.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit',
      second: '2-digit' 
    });
  };

  console.log('TickerSidebar rendering, isCollapsed:', isCollapsed);
  
  return (
    <div className={`ticker-sidebar ${isCollapsed ? 'collapsed' : ''}`}>
      <div className="ticker-header">
        {!isCollapsed && (
          <div className="ticker-header-title">
            <span>$bWriter Market</span>
          </div>
        )}
        <button 
          className="ticker-header-toggle"
          onClick={() => setIsCollapsed(!isCollapsed)}
          title={isCollapsed ? "Expand Market Sidebar" : "Collapse Market Sidebar"}
        >
          {isCollapsed ? '◀' : '▶'}
        </button>
      </div>

      {!isCollapsed && (
        <>
          {isLoading ? (
            <div className="ticker-loading">Loading prices...</div>
          ) : (
            <div className="ticker-list">
              {prices.map((token, index) => {
                // Add divider after last special token
                const showDivider = token.isSpecial && 
                  index < prices.length - 1 && 
                  !prices[index + 1].isSpecial;
                
                return (
                  <React.Fragment key={token.symbol}>
                    <div className={`ticker-item ${token.isSpecial ? 'special' : ''} ${token.isGig ? 'gig' : ''}`}>
                  <div className="ticker-symbol-row">
                    <span className="ticker-symbol">${token.symbol}</span>
                    <span className={`ticker-change ${token.change24h >= 0 ? 'positive' : 'negative'}`}>
                      {token.change24h >= 0 ? '↑' : '↓'} {Math.abs(token.changePercent).toFixed(2)}%
                    </span>
                  </div>
                  
                  <div className="ticker-name">
                    {token.name}
                    {token.category && (
                      <span className="ticker-category"> • {token.category}</span>
                    )}
                  </div>
                  
                  <div className="ticker-price-row">
                    <span className="ticker-price">{formatPrice(token.price)}</span>
                    {token.contractId && (
                      <span className="ticker-contract-id">#{token.contractId}</span>
                    )}
                  </div>
                  
                  <div className="ticker-stats">
                    {token.volume_24h && (
                      <span className="ticker-volume">
                        Vol: {formatVolume(token.volume_24h)}
                      </span>
                    )}
                    {token.liquidity !== undefined && (
                      <span 
                        className="ticker-liquidity"
                        style={{ color: getLiquidityColor(token.liquidity) }}
                      >
                        {formatLiquidity(token.liquidity)}
                      </span>
                    )}
                    {token.holders !== undefined && (
                      <span className="ticker-holders">
                        {token.holders} holders
                      </span>
                    )}
                  </div>
                </div>
                {showDivider && (
                  <div className="ticker-divider">
                    <span>Active Jobs</span>
                  </div>
                )}
              </React.Fragment>
              );
            })}
            </div>
          )}
          
          <div className="ticker-footer">
            <div className="ticker-disclaimer">
              Prices update every 30s
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default TickerSidebar;