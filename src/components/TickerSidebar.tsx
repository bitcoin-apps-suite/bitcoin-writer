import React, { useState, useEffect } from 'react';
import { PriceService, TokenPrice as ServiceTokenPrice } from '../services/PriceService';
import './TickerSidebar.css';

interface TokenPrice extends ServiceTokenPrice {
  change24h: number;
  changePercent: number;
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
    // Subscribe to price updates
    const subscription = PriceService.subscribeAll((updatedPrices) => {
      // Map service prices to component format
      const formattedPrices = updatedPrices.map(p => ({
        ...p,
        change24h: p.change_24h,
        changePercent: p.change_percent_24h
      }));
      
      // Add user's handle token if available and not in list
      if (userHandle && !formattedPrices.find(p => p.symbol === `$${userHandle.toUpperCase()}`)) {
        formattedPrices.push({
          symbol: `$${userHandle.toUpperCase()}`,
          name: `${userHandle} Token`,
          price: 0.00156,
          price_usd: 0.00156,
          change24h: 0.00012,
          changePercent: 8.33,
          change_24h: 0.00012,
          change_percent_24h: 8.33,
          volume_24h: 5000,
          last_updated: new Date(),
          source: 'Mock'
        });
      }

      // Add current job token if available and not in list
      if (currentJobToken && !formattedPrices.find(p => p.symbol === currentJobToken.symbol)) {
        formattedPrices.push({
          symbol: currentJobToken.symbol,
          name: currentJobToken.name,
          price: 0.0089,
          price_usd: 0.0089,
          change24h: -0.0003,
          changePercent: -3.26,
          change_24h: -0.0003,
          change_percent_24h: -3.26,
          volume_24h: 12000,
          last_updated: new Date(),
          source: 'Mock'
        });
      }

      setPrices(formattedPrices);
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
              
              <div className="ticker-name">{token.name}</div>
              
              <div className="ticker-price-row">
                <span className="ticker-price">{formatPrice(token.price)}</span>
              </div>
              
              {token.volume_24h && (
                <div className="ticker-volume">
                  Vol: {formatVolume(token.volume_24h)}
                </div>
              )}
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