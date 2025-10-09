import React, { useState, useEffect } from 'react';
import './TickerSidebar.css';

interface TokenPrice {
  symbol: string;
  name: string;
  price: number;
  change24h: number;
  changePercent: number;
  volume24h?: number;
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
    // Load initial prices
    loadPrices();
    
    // Update prices every 30 seconds
    const interval = setInterval(() => {
      loadPrices();
    }, 30000);

    return () => clearInterval(interval);
  }, [userHandle, currentJobToken]);

  const loadPrices = async () => {
    try {
      // Mock data - in production this would fetch from price APIs
      const mockPrices: TokenPrice[] = [
        {
          symbol: 'BWRITER',
          name: 'Bitcoin Writer',
          price: 0.0234,
          change24h: 0.0018,
          changePercent: 8.33,
          volume24h: 125000
        },
        {
          symbol: 'BSV',
          name: 'Bitcoin SV',
          price: 65.42,
          change24h: -2.15,
          changePercent: -3.18,
          volume24h: 45000000
        }
      ];

      // Add user's handle token if available
      if (userHandle) {
        mockPrices.push({
          symbol: `$${userHandle.toUpperCase()}`,
          name: `${userHandle} Token`,
          price: 0.00156,
          change24h: 0.00012,
          changePercent: 8.33,
          volume24h: 5000
        });
      }

      // Add current job token if available
      if (currentJobToken) {
        mockPrices.push({
          symbol: currentJobToken.symbol,
          name: currentJobToken.name,
          price: 0.0089,
          change24h: -0.0003,
          changePercent: -3.26,
          volume24h: 12000
        });
      }

      setPrices(mockPrices);
      setLastUpdate(new Date());
    } catch (error) {
      console.error('Failed to load token prices:', error);
    } finally {
      setIsLoading(false);
    }
  };

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
        <h3>Token Prices</h3>
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
              
              {token.volume24h && (
                <div className="ticker-volume">
                  Vol: {formatVolume(token.volume24h)}
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