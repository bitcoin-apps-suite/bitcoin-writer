import React, { useState, useEffect } from 'react';
import './StockTickerCard.css';

interface StockData {
  symbol: string;
  name: string;
  price: number;
  change: number;
  changePercent: number;
  volume: string;
}

const StockTickerCard: React.FC = () => {
  const [stocks, setStocks] = useState<StockData[]>([
    {
      symbol: 'BSV',
      name: 'Bitcoin SV',
      price: 42.15,
      change: 2.45,
      changePercent: 6.17,
      volume: '2.1M'
    },
    {
      symbol: 'BTC',
      name: 'Bitcoin',
      price: 67340.00,
      change: -1234.56,
      changePercent: -1.8,
      volume: '14.2B'
    },
    {
      symbol: 'ETH',
      name: 'Ethereum',
      price: 2583.42,
      change: 45.67,
      changePercent: 1.8,
      volume: '8.9B'
    },
    {
      symbol: 'TSLA',
      name: 'Tesla Inc',
      price: 248.98,
      change: -5.23,
      changePercent: -2.06,
      volume: '89.4M'
    },
    {
      symbol: 'AAPL',
      name: 'Apple Inc',
      price: 225.77,
      change: 3.21,
      changePercent: 1.44,
      volume: '45.2M'
    }
  ]);

  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    // Simulate real-time price updates
    const updatePrices = () => {
      setStocks(prevStocks => 
        prevStocks.map(stock => {
          // Random price fluctuation between -2% and +2%
          const fluctuation = (Math.random() - 0.5) * 0.04; // -2% to +2%
          const newPrice = stock.price * (1 + fluctuation);
          const priceChange = newPrice - stock.price;
          const percentChange = (priceChange / stock.price) * 100;
          
          return {
            ...stock,
            price: newPrice,
            change: priceChange,
            changePercent: percentChange
          };
        })
      );
    };

    // Update every 5 seconds
    const priceInterval = setInterval(updatePrices, 5000);

    // Rotate through stocks every 3 seconds
    const rotateInterval = setInterval(() => {
      setCurrentIndex(prev => (prev + 1) % stocks.length);
    }, 3000);

    return () => {
      clearInterval(priceInterval);
      clearInterval(rotateInterval);
    };
  }, [stocks.length]);

  const currentStock = stocks[currentIndex];

  const formatPrice = (price: number): string => {
    if (price >= 1000) {
      return price.toLocaleString('en-US', { 
        minimumFractionDigits: 2, 
        maximumFractionDigits: 2 
      });
    }
    return price.toFixed(2);
  };

  const formatChange = (change: number): string => {
    const sign = change >= 0 ? '+' : '';
    return `${sign}${change.toFixed(2)}`;
  };

  return (
    <div className="stock-ticker-card">
      <div className="stock-header">
        <h3>📈 Market Watch</h3>
        <div className="stock-rotation-indicator">
          {stocks.map((_, index) => (
            <div 
              key={index} 
              className={`rotation-dot ${index === currentIndex ? 'active' : ''}`}
            />
          ))}
        </div>
      </div>

      <div className="stock-current">
        <div className="stock-symbol-section">
          <span className="stock-symbol">{currentStock.symbol}</span>
          <span className="stock-name">{currentStock.name}</span>
        </div>

        <div className="stock-price-section">
          <div className="stock-price">
            ${formatPrice(currentStock.price)}
          </div>
          <div className={`stock-change ${currentStock.change >= 0 ? 'positive' : 'negative'}`}>
            <span className="change-amount">{formatChange(currentStock.change)}</span>
            <span className="change-percent">
              {currentStock.change >= 0 ? '↗' : '↘'} {Math.abs(currentStock.changePercent).toFixed(2)}%
            </span>
          </div>
        </div>
      </div>

      <div className="stock-details">
        <div className="stock-volume">
          <span className="volume-label">Volume</span>
          <span className="volume-value">{currentStock.volume}</span>
        </div>
        <div className="market-status">
          <span className="status-indicator">●</span>
          <span className="status-text">Market Open</span>
        </div>
      </div>

      <div className="stock-mini-chart">
        <div className="chart-placeholder">
          <div className="chart-line"></div>
          <div className="chart-data">
            {stocks.slice(0, 4).map((stock, index) => (
              <div key={stock.symbol} className="mini-stock">
                <span className="mini-symbol">{stock.symbol}</span>
                <span className={`mini-change ${stock.change >= 0 ? 'positive' : 'negative'}`}>
                  {stock.change >= 0 ? '+' : ''}{stock.changePercent.toFixed(1)}%
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StockTickerCard;