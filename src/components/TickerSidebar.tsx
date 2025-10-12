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
}

interface TickerSidebarProps {
  userHandle?: string;
  currentJobToken?: {
    symbol: string;
    name: string;
  };
}

const TickerSidebar: React.FC<TickerSidebarProps> = ({
  userHandle,
  currentJobToken
}) => {
  const [prices, setPrices] = useState<TokenPrice[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date());
  const [isCollapsed, setIsCollapsed] = useState(false);

  useEffect(() => {
    // Generate trending gig tokens with contract IDs
    const generateTrendingGigs = (): TokenPrice[] => {
      const gigs = [
        { base: 'bNews', name: 'Breaking News Writer', category: 'Media', basePrice: 0.012, volatility: 0.3 },
        { base: 'bSport', name: 'Sports Coverage', category: 'Sports', basePrice: 0.008, volatility: 0.25 },
        { base: 'bTech', name: 'Tech Analysis', category: 'Technology', basePrice: 0.025, volatility: 0.4 },
        { base: 'bCrypto', name: 'Crypto Reports', category: 'Finance', basePrice: 0.035, volatility: 0.5 },
        { base: 'bAI', name: 'AI Articles', category: 'Technology', basePrice: 0.045, volatility: 0.35 },
        { base: 'bClimate', name: 'Climate Stories', category: 'Environment', basePrice: 0.006, volatility: 0.2 },
        { base: 'bHealth', name: 'Health Updates', category: 'Healthcare', basePrice: 0.015, volatility: 0.25 },
        { base: 'bPolitics', name: 'Political Analysis', category: 'Politics', basePrice: 0.018, volatility: 0.45 }
      ];

      // Generate gigs with varying liquidity to simulate market dynamics
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

      // Sort gigs by liquidity (most liquid first)
      return gigsWithLiquidity.sort((a, b) => (b.liquidity || 0) - (a.liquidity || 0));
    };

    // Subscribe to price updates
    const subscription = PriceService.subscribeAll((updatedPrices) => {
      // Get core token prices (BSV and BWRITER)
      const corePrices: TokenPrice[] = updatedPrices.filter(p => 
        p.symbol === 'BSV' || p.symbol === 'BWRITER'
      ).map(p => ({
        ...p,
        change24h: p.change_24h,
        changePercent: p.change_percent_24h,
        isSpecial: true,
        isGig: false
      }));

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
    } else {
      return `$${price.toFixed(6)}`;
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

  return (
    <div className={`ticker-sidebar ${isCollapsed ? 'collapsed' : ''}`}>
      <div className="ticker-header">
        <h3>$bWriter Market</h3>
        <div className="ticker-header-controls">
          <button 
            className="ticker-toggle"
            onClick={() => setIsCollapsed(!isCollapsed)}
            title={isCollapsed ? 'Expand ticker' : 'Collapse ticker'}
          >
            {isCollapsed ? '←' : '→'}
          </button>
        </div>
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