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

  useEffect(() => {
    // Generate trending topic tokens with contract IDs
    const generateTrendingTokens = (): TokenPrice[] => {
      const topics = [
        { base: 'bNews', name: 'Breaking News', category: 'Media' },
        { base: 'bSport', name: 'Sports Coverage', category: 'Sports' },
        { base: 'bTech', name: 'Tech Analysis', category: 'Technology' },
        { base: 'bCrypto', name: 'Crypto Reports', category: 'Finance' },
        { base: 'bAI', name: 'AI Articles', category: 'Technology' },
        { base: 'bClimate', name: 'Climate Stories', category: 'Environment' },
        { base: 'bHealth', name: 'Health Updates', category: 'Healthcare' },
        { base: 'bPolitics', name: 'Political Analysis', category: 'Politics' }
      ];

      return topics.map((topic, index) => {
        const contractNum = Math.floor(Math.random() * 9000) + 1000;
        const contractId = `${Math.random().toString(36).substring(2, 5)}_${contractNum}`;
        const basePrice = Math.random() * 0.05 + 0.001;
        const change = (Math.random() - 0.5) * basePrice * 0.3;
        const liquidity = Math.floor(Math.random() * 50000) + 1000;
        const holders = Math.floor(Math.random() * 500) + 10;
        
        return {
          symbol: `${topic.base}_${contractId}`,
          name: topic.name,
          category: topic.category,
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
          source: 'BitcoinOS'
        };
      });
    };

    // Subscribe to price updates
    const subscription = PriceService.subscribeAll((updatedPrices) => {
      // Get BSV and BWRITER prices
      const corePrices = updatedPrices.filter(p => 
        p.symbol === 'BSV' || p.symbol === 'BWRITER'
      ).map(p => ({
        ...p,
        change24h: p.change_24h,
        changePercent: p.change_percent_24h
      }));

      // Add trending topic tokens
      const trendingTokens = generateTrendingTokens();
      
      const allPrices = [...corePrices, ...trendingTokens];
      
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
    <div className="ticker-sidebar">
      <div className="ticker-header">
        <h3>Market</h3>
        <span className="ticker-update-time" title={`Last updated: ${formatTime(lastUpdate)}`}>
          🔄
        </span>
      </div>

      {isLoading ? (
        <div className="ticker-loading">Loading prices...</div>
      ) : (
        <div className="ticker-list">
          {prices.map((token) => (
            <div key={token.symbol} className="ticker-item">
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
          ))}
        </div>
      )}

      <div className="ticker-footer">
        <div className="ticker-disclaimer">
          Prices update every 30s
        </div>
      </div>
    </div>
  );
};

export default TickerSidebar;