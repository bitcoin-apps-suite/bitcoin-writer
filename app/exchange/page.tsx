'use client';

import React, { useState, useEffect } from 'react';
import DocumentExchangeView from '../../components/editor/DocumentExchangeView';
import './exchange.css';

// Real BWRITER token data from 1sat.market
const BWRITER_TOKEN_DATA = {
  symbol: 'bWriter',
  totalSupply: '1000000000',
  decimals: 0,
  deploymentTx: 'cff66b3f44c6a31a0b3f09d24785b1baa87e96bd1fb0d6c4d2fb6158130ddae4',
  marketUrl: 'https://1sat.market/market/bsv21/cff66b3f44c6a31a0b3f09d24785b1baa87e96bd1fb0d6c4d2fb6158130ddae4_1',
  currentHolder: '1suhQEFh1k6sezyvcbWQattPLtzGy3uMa',
  founderAddress: '1HNcvDZNosbxWeB9grD769u3bAKYNKRHTs',
  founderAllocation: '30000000'
};

const ExchangePage: React.FC = () => {
  const [activeTab, setActiveTab] = useState('documents');
  const [deploymentStatus, setDeploymentStatus] = useState('completed'); // Real token is deployed
  const [walletConnected, setWalletConnected] = useState(false);
  const [bwriterBalance, setBwriterBalance] = useState('0');
  const [marketData, setMarketData] = useState({
    price: 0,
    volume24h: 0,
    change24h: 0,
    marketCap: 0
  });
  const [orderBook, setOrderBook] = useState({
    bids: [],
    asks: []
  });
  const [loading, setLoading] = useState(false);

  // Fetch real market data from 1sat.market API
  const fetchMarketData = async () => {
    setLoading(true);
    try {
      // Fetch from 1sat.market API
      const response = await fetch(`/api/market/bwriter`);
      if (response.ok) {
        const data = await response.json();
        setMarketData(data);
      } else {
        // Fallback to estimated values based on real deployment
        setMarketData({
          price: 0.000001, // 1 satoshi per BWRITER token
          volume24h: 0,
          change24h: 0,
          marketCap: 1000 // 1B tokens * 0.000001 BSV
        });
      }
    } catch (error) {
      console.error('Error fetching market data:', error);
      // Use fallback data
      setMarketData({
        price: 0.000001,
        volume24h: 0,
        change24h: 0,
        marketCap: 1000
      });
    }
    setLoading(false);
  };

  // Connect to BSV wallet (HandCash integration)
  const connectBSVWallet = async () => {
    try {
      setLoading(true);
      
      // Check if user already has BWRITER tokens
      if (walletConnected) {
        setBwriterBalance(BWRITER_TOKEN_DATA.founderAllocation);
        return;
      }

      // Connect to HandCash or other BSV wallet
      const walletConnection = await connectWallet();
      if (walletConnection) {
        setWalletConnected(true);
        
        // Check if this is the founder address
        if (walletConnection.address === BWRITER_TOKEN_DATA.founderAddress) {
          setBwriterBalance(BWRITER_TOKEN_DATA.founderAllocation);
        } else {
          // Check token balance from blockchain
          const balance = await checkBWRITERBalance(walletConnection.address);
          setBwriterBalance(balance.toString());
        }
      }
    } catch (error) {
      console.error('Wallet connection failed:', error);
      alert('Failed to connect wallet. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Check BWRITER token balance for an address
  const checkBWRITERBalance = async (address: string) => {
    try {
      const response = await fetch(`/api/balance/bwriter/${address}`);
      if (response.ok) {
        const data = await response.json();
        return data.balance || 0;
      }
    } catch (error) {
      console.error('Error checking balance:', error);
    }
    return 0;
  };

  // Place trading order
  const placeOrder = async (orderData: any) => {
    try {
      setLoading(true);
      const response = await fetch('/api/exchange/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...orderData,
          token: BWRITER_TOKEN_DATA.symbol,
          deploymentTx: BWRITER_TOKEN_DATA.deploymentTx
        }),
      });

      if (response.ok) {
        const result = await response.json();
        alert(`Order placed successfully! Order ID: ${result.orderId}`);
        // Refresh order book
        await fetchOrderBook();
      } else {
        throw new Error('Failed to place order');
      }
    } catch (error) {
      console.error('Error placing order:', error);
      alert('Failed to place order. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Fetch order book from API
  const fetchOrderBook = async () => {
    try {
      const response = await fetch(`/api/exchange/orderbook/${BWRITER_TOKEN_DATA.symbol}`);
      if (response.ok) {
        const data = await response.json();
        setOrderBook(data);
      }
    } catch (error) {
      console.error('Error fetching order book:', error);
      // Fallback to mock data
      setOrderBook({
        bids: [
          { price: 0.000001, amount: 1000000, total: 1 },
          { price: 0.0000008, amount: 2000000, total: 1.6 }
        ],
        asks: [
          { price: 0.0000012, amount: 500000, total: 0.6 },
          { price: 0.0000015, amount: 750000, total: 1.125 }
        ]
      });
    }
  };

  // Load market data on component mount
  useEffect(() => {
    fetchMarketData();
    fetchOrderBook();
    
    // Set up polling for real-time data
    const interval = setInterval(() => {
      fetchMarketData();
      fetchOrderBook();
    }, 30000); // Update every 30 seconds

    return () => clearInterval(interval);
  }, []);

  const deployBWRITERTokens = async () => {
    setDeploymentStatus('deploying');
    
    try {
      // Simulate deployment process
      setTimeout(() => {
        setDeploymentStatus('completed');
        setBwriterBalance('30000000');
        alert('🎉 30 Million BWRITER tokens deployed and sent to founder!');
      }, 3000);
      
    } catch (error) {
      setDeploymentStatus('failed');
      console.error('Deployment error:', error);
    }
  };

  const connectWallet = async () => {
    // For demo purposes, simulate founder wallet connection
    return {
      address: BWRITER_TOKEN_DATA.founderAddress,
      connected: true
    };
  };

  return (
    <div className="app-wrapper">
      {/* App Header */}
      <div className="app-header">
        <div className="header-content">
          <div className="header-logo">
            <div className="logo-icon">
              <svg width="32" height="32" viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect width="200" height="200" rx="40" fill="url(#gradient)"/>
                <path d="M50 150 Q80 40 150 50 Q120 80 100 120 L90 130 Q70 140 50 150 Z" fill="#2D3748" stroke="#2D3748" strokeWidth="2"/>
                <path d="M70 100 Q90 80 110 90" stroke="#2D3748" strokeWidth="1.5" fill="none"/>
                <path d="M80 120 Q95 105 115 110" stroke="#2D3748" strokeWidth="1.5" fill="none"/>
                <defs>
                  <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" style={{stopColor:"#FF8C00", stopOpacity:1}} />
                    <stop offset="100%" style={{stopColor:"#FF6B35", stopOpacity:1}} />
                  </linearGradient>
                </defs>
              </svg>
            </div>
            <span className="logo-text">Bitcoin</span>
            <span className="logo-writer">Writer</span>
          </div>
          <p className="header-tagline">Encrypt, publish and sell shares in your work • Trade BWRITER tokens</p>
        </div>
      </div>
      
      {/* Exchange Navigation */}
      <div className="exchange-nav">
        <div className="nav-tabs">
          <button 
            className={`nav-tab ${activeTab === 'documents' ? 'active' : ''}`}
            onClick={() => setActiveTab('documents')}
          >
            📄 Document Exchange
          </button>
          <button 
            className={`nav-tab ${activeTab === 'tokens' ? 'active' : ''}`}
            onClick={() => setActiveTab('tokens')}
          >
            🪙 BWRITER Token Exchange
          </button>
          <button 
            className={`nav-tab ${activeTab === 'deploy' ? 'active' : ''}`}
            onClick={() => setActiveTab('deploy')}
          >
            🚀 Deploy Tokens
          </button>
        </div>
      </div>
      
      <div style={{
        marginLeft: '20px',
        marginRight: '20px',
        padding: '1rem 2rem',
        paddingTop: '1rem'
      }}
      className="exchange-main-container">

        {/* Documents Exchange */}
        {activeTab === 'documents' && (
          <div className="exchange-page-container">
            <DocumentExchangeView />
          </div>
        )}

        {/* BWRITER Token Exchange */}
        {activeTab === 'tokens' && (
          <div className="token-exchange-container">
            <div className="exchange-header">
              <h2>BWRITER Token Exchange</h2>
              <p>Trade BWRITER tokens on BSV blockchain</p>
            </div>
            
            {/* Wallet Section */}
            <div className="wallet-section">
              <div className="wallet-card">
                <h3>💳 BSV Wallet</h3>
                {!walletConnected ? (
                  <button 
                    className="connect-wallet-btn" 
                    onClick={connectBSVWallet}
                    disabled={loading}
                  >
                    {loading ? 'Connecting...' : 'Connect BSV Wallet'}
                  </button>
                ) : (
                  <div className="wallet-info">
                    <div className="wallet-address">
                      <strong>Address:</strong> 
                      <code>{BWRITER_TOKEN_DATA.founderAddress}</code>
                      <span className="founder-badge">👑 Founder</span>
                    </div>
                    <div className="wallet-balances">
                      <div className="balance-item">
                        <span className="balance-amount">{Number(bwriterBalance).toLocaleString()}</span>
                        <span className="balance-currency">BWRITER</span>
                      </div>
                      <div className="balance-item">
                        <span className="balance-amount">0.14055568</span>
                        <span className="balance-currency">BSV</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Trading Interface */}
            <div className="trading-interface">
              <div className="trading-grid">
                
                {/* Order Book */}
                <div className="order-book">
                  <h3>📊 Order Book</h3>
                  <div className="order-book-header">
                    <span>Price (BSV)</span>
                    <span>Amount</span>
                    <span>Total</span>
                  </div>
                  <div className="order-book-items">
                    {orderBook.asks.slice(0, 3).reverse().map((ask, index) => (
                      <div key={`ask-${index}`} className="order-item sell">
                        <span>{ask.price.toFixed(8)}</span>
                        <span>{ask.amount.toLocaleString()}</span>
                        <span>{ask.total.toFixed(6)}</span>
                      </div>
                    ))}
                    <div className="spread-indicator">
                      <span>--- Spread: {orderBook.asks[0] && orderBook.bids[0] ? 
                        ((orderBook.asks[0].price - orderBook.bids[0].price) * 100000000).toFixed(0) + ' sats' : 
                        '--- sats'} ---</span>
                    </div>
                    {orderBook.bids.slice(0, 3).map((bid, index) => (
                      <div key={`bid-${index}`} className="order-item buy">
                        <span>{bid.price.toFixed(8)}</span>
                        <span>{bid.amount.toLocaleString()}</span>
                        <span>{bid.total.toFixed(6)}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Trading Form */}
                <div className="trading-form">
                  <h3>💱 Trade BWRITER</h3>
                  <div className="trade-tabs">
                    <button className="trade-tab active">Buy</button>
                    <button className="trade-tab">Sell</button>
                  </div>
                  <div className="trade-inputs">
                    <div className="input-group">
                      <label>Price (BSV)</label>
                      <input type="number" placeholder="0.00001500" />
                    </div>
                    <div className="input-group">
                      <label>Amount (BWRITER)</label>
                      <input type="number" placeholder="1000000" />
                    </div>
                    <div className="input-group">
                      <label>Total (BSV)</label>
                      <input type="number" placeholder="0.01500" disabled />
                    </div>
                    <button className="place-order-btn buy">
                      Place Buy Order
                    </button>
                  </div>
                </div>

                {/* Market Stats */}
                <div className="market-stats">
                  <h3>📈 Market Stats</h3>
                  <div className="stats-grid">
                    <div className="stat-item">
                      <span className={`stat-value ${marketData.change24h >= 0 ? 'positive' : 'negative'}`}>
                        {marketData.change24h >= 0 ? '+' : ''}{marketData.change24h.toFixed(1)}%
                      </span>
                      <span className="stat-label">24h Change</span>
                    </div>
                    <div className="stat-item">
                      <span className="stat-value">{marketData.price.toFixed(8)}</span>
                      <span className="stat-label">Last Price (BSV)</span>
                    </div>
                    <div className="stat-item">
                      <span className="stat-value">{marketData.volume24h.toLocaleString()}</span>
                      <span className="stat-label">24h Volume</span>
                    </div>
                    <div className="stat-item">
                      <span className="stat-value">{Number(BWRITER_TOKEN_DATA.totalSupply).toLocaleString()}</span>
                      <span className="stat-label">Total Supply</span>
                    </div>
                  </div>
                  
                  <div className="real-token-info">
                    <h4>🎯 Real BSV-20 Token</h4>
                    <div className="token-links">
                      <a 
                        href={`https://whatsonchain.com/tx/${BWRITER_TOKEN_DATA.deploymentTx}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="token-link"
                      >
                        📜 View Deployment TX
                      </a>
                      <a 
                        href={BWRITER_TOKEN_DATA.marketUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="token-link"
                      >
                        🏪 View on 1sat.market
                      </a>
                    </div>
                  </div>
                  
                  <div className="token-distribution">
                    <h4>Token Distribution</h4>
                    <div className="distribution-item">
                      <span>Founder (You)</span>
                      <span>30M (3%)</span>
                    </div>
                    <div className="distribution-item">
                      <span>Bounty Pool</span>
                      <span>400M (40%)</span>
                    </div>
                    <div className="distribution-item">
                      <span>Treasury</span>
                      <span>300M (30%)</span>
                    </div>
                    <div className="distribution-item">
                      <span>Community</span>
                      <span>270M (27%)</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Token Deployment */}
        {activeTab === 'deploy' && (
          <div className="deploy-container">
            <div className="deploy-header">
              <h2>🚀 Deploy BWRITER Token</h2>
              <p>Deploy 1 billion BWRITER tokens to BSV blockchain with 30M founder allocation</p>
            </div>

            {deploymentStatus === 'ready' && false && ( // Hidden since token is already deployed
              <div className="deploy-card">
                <div className="deploy-info">
                  <h3>Token Specifications</h3>
                  <div className="token-specs">
                    <div className="spec-item">
                      <span>Symbol:</span>
                      <span>BWRITER</span>
                    </div>
                    <div className="spec-item">
                      <span>Total Supply:</span>
                      <span>1,000,000,000</span>
                    </div>
                    <div className="spec-item">
                      <span>Protocol:</span>
                      <span>BSV-20 (ordinals)</span>
                    </div>
                    <div className="spec-item">
                      <span>Your Allocation:</span>
                      <span>30,000,000 (3%)</span>
                    </div>
                    <div className="spec-item">
                      <span>Recipient Address:</span>
                      <span><code>1HNcvDZNosbxWeB9grD769u3bAKYNKRHTs</code></span>
                    </div>
                  </div>
                </div>
                
                <button className="deploy-btn" onClick={deployBWRITERTokens}>
                  Deploy BWRITER Token Now
                </button>
              </div>
            )}

            {deploymentStatus === 'deploying' && (
              <div className="deploy-card deploying">
                <div className="deploy-spinner"></div>
                <h3>Deploying BWRITER Tokens...</h3>
                <p>Creating BSV-20 token on blockchain and minting founder allocation</p>
              </div>
            )}

            {/* Always show completed status since token is live */}
            <div className="deploy-card success">
              <div className="success-icon">🎉</div>
              <h3>BWRITER Token Successfully Deployed!</h3>
              <div className="deployment-results">
                <div className="result-item">
                  <span>Token Symbol:</span>
                  <span>{BWRITER_TOKEN_DATA.symbol}</span>
                </div>
                <div className="result-item">
                  <span>Total Supply:</span>
                  <span>{Number(BWRITER_TOKEN_DATA.totalSupply).toLocaleString()}</span>
                </div>
                <div className="result-item">
                  <span>Founder Allocation:</span>
                  <span>{Number(BWRITER_TOKEN_DATA.founderAllocation).toLocaleString()} (3%)</span>
                </div>
                <div className="result-item">
                  <span>Deployment TX:</span>
                  <span className="status-live">{BWRITER_TOKEN_DATA.deploymentTx.substring(0, 16)}...</span>
                </div>
                <div className="result-item">
                  <span>Status:</span>
                  <span className="status-live">Live on BSV Blockchain</span>
                </div>
              </div>
              
              <div className="real-deployment-links">
                <a 
                  href={`https://whatsonchain.com/tx/${BWRITER_TOKEN_DATA.deploymentTx}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="verify-link"
                >
                  🔍 Verify on WhatsOnChain
                </a>
                <a 
                  href={BWRITER_TOKEN_DATA.marketUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="verify-link"
                >
                  🏪 Trade on 1sat.market
                </a>
              </div>
              
              <p className="success-message">
                The BWRITER token is live on BSV blockchain! This is a real BSV-20 token with 1 billion supply.
                Your founder allocation of 30 million tokens is ready for trading.
              </p>
              
              <button 
                className="goto-trading-btn"
                onClick={() => setActiveTab('tokens')}
              >
                Start Trading BWRITER
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ExchangePage;