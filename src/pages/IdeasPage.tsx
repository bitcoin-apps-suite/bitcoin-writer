import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getArticleUrl } from '../utils/slugUtils';
import { getAuthorSlugFromName } from '../utils/authorUtils';
import './MarketBodyPage.css';

interface FeaturedContent {
  id: string;
  title: string;
  description: string;
  author: string;
  authorHandle: string;
  platform: string;
  category: string;
  readTime: number;
  engagement: number;
  thumbnail: string;
  price?: number;
  isTokenized: boolean;
  trending: boolean;
}

const IdeasPage: React.FC = () => {
  const [bsvPrice, setBsvPrice] = useState<number>(40.50); // Default BSV price in USD

  // Fetch real BSV price from CoinGecko
  useEffect(() => {
    const fetchBSVPrice = async () => {
      try {
        const response = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=bitcoin-sv&vs_currencies=usd');
        const data = await response.json();
        if (data['bitcoin-sv'] && data['bitcoin-sv'].usd) {
          setBsvPrice(data['bitcoin-sv'].usd);
        }
      } catch (error) {
        console.log('Failed to fetch BSV price, using default:', error);
      }
    };

    fetchBSVPrice();
    // Update price every 5 minutes
    const interval = setInterval(fetchBSVPrice, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  // Calculate BSV amount from USD price
  const calculateBSVAmount = (usdPrice: number): number => {
    return usdPrice / bsvPrice;
  };

  // Format BSV amount for display
  const formatBSVAmount = (usdPrice: number): string => {
    const bsvAmount = calculateBSVAmount(usdPrice);
    return bsvAmount.toFixed(6);
  };

  const tokenizedContent: FeaturedContent[] = [
    {
      id: '1',
      title: 'The Future of Digital Publishing',
      description: 'How blockchain technology is revolutionizing content creation and monetization',
      author: 'Sarah Chen',
      authorHandle: '@sarahchen',
      platform: 'Bitcoin Writer',
      category: 'Technology',
      readTime: 8,
      engagement: 1520,
      thumbnail: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&h=250&fit=crop&crop=center',
      price: 0.01,
      isTokenized: true,
      trending: true
    },
    {
      id: '2',
      title: 'Building Sustainable Creator Economy',
      description: 'A comprehensive guide to monetizing your content in the Web3 era',
      author: 'Alex Martinez',
      authorHandle: '@alexmart',
      platform: 'Mirror',
      category: 'Business',
      readTime: 12,
      engagement: 2340,
      thumbnail: 'https://images.unsplash.com/photo-1559136555-9303baea8ebd?w=400&h=250&fit=crop&crop=center',
      price: 0.01,
      isTokenized: true,
      trending: true
    },
    {
      id: '5',
      title: 'Decentralized Content Networks',
      description: 'Understanding the infrastructure behind Web3 publishing platforms',
      author: 'Tech Researcher',
      authorHandle: '@techresearcher',
      platform: 'Bitcoin Writer',
      category: 'Technology',
      readTime: 15,
      engagement: 3200,
      thumbnail: 'https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=400&h=250&fit=crop&crop=center',
      price: 0.01,
      isTokenized: true,
      trending: false
    },
    {
      id: '7',
      title: 'Crypto Content Monetization',
      description: 'How to earn Bitcoin through content creation and publishing',
      author: 'Satoshi Writer',
      authorHandle: '@satoshiwriter',
      platform: 'Bitcoin Writer',
      category: 'Cryptocurrency',
      readTime: 9,
      engagement: 1890,
      thumbnail: 'https://images.unsplash.com/photo-1621761191319-c6fb62004040?w=400&h=250&fit=crop&crop=center',
      price: 0.01,
      isTokenized: true,
      trending: true
    },
    {
      id: '9',
      title: 'NFT Publishing Revolution',
      description: 'Transform your articles into valuable digital assets',
      author: 'NFT Creator',
      authorHandle: '@nftcreator',
      platform: 'Mirror',
      category: 'Technology',
      readTime: 13,
      engagement: 2100,
      thumbnail: 'https://images.unsplash.com/photo-1634704784915-aacf363b021f?w=400&h=250&fit=crop&crop=center',
      price: 0.01,
      isTokenized: true,
      trending: true
    },
    {
      id: '12',
      title: 'Web3 Publishing Future',
      description: 'The next frontier of digital content creation',
      author: 'Blockchain Expert',
      authorHandle: '@blockchainexpert',
      platform: 'Bitcoin Writer',
      category: 'Technology',
      readTime: 14,
      engagement: 2890,
      thumbnail: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=400&h=250&fit=crop&crop=center',
      price: 0.01,
      isTokenized: true,
      trending: false
    }
  ];

  return (
    <div className="market-body-page">
      <div className="market-body-layout">
        <div className="market-body-content">
          {/* Tokenized Content Section */}
          <section className="tokenized-section">
            <h2>₿ Tokenized Publications</h2>
            <div className="content-grid">
              {tokenizedContent.map(content => (
                <Link 
                  key={content.id} 
                  to={getArticleUrl(content.title, content.id)}
                  className="content-card tokenized"
                >
                  <div className="content-thumbnail">
                    <img src={content.thumbnail} alt={content.title} />
                    <div className="tokenized-overlay">
                      <div className="token-price-display">
                        <span className="token-price-usd">${content.price?.toFixed(2) || '0.01'}</span>
                        <span className="token-price-bsv">₿ {formatBSVAmount(content.price || 0.01)} BSV</span>
                      </div>
                    </div>
                  </div>
                  <div className="content-info">
                    <h3>{content.title}</h3>
                    <p>{content.description}</p>
                    <div className="content-meta">
                      <Link 
                        to={`/authors/${getAuthorSlugFromName(content.author)}`} 
                        className="author-link"
                        onClick={(e) => e.stopPropagation()}
                      >
                        {content.author}
                      </Link>
                      <span className="platform">{content.platform}</span>
                    </div>
                    <div className="purchase-info">
                      <span className="purchase-text">Click to view & purchase</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </section>

          {/* Quick Actions Section */}
          <section className="quick-actions">
            <h2>⚡ Quick Actions</h2>
            <div className="actions-grid">
              <div className="action-card">
                <div className="action-icon">📝</div>
                <h3>Create Article</h3>
                <p>Start writing your next piece</p>
                <button className="action-btn">Get Started</button>
              </div>
              <div className="action-card">
                <div className="action-icon">₿</div>
                <h3>Tokenize Content</h3>
                <p>Convert your articles into tradeable assets</p>
                <button className="action-btn">Learn How</button>
              </div>
              <div className="action-card">
                <div className="action-icon">📊</div>
                <h3>Analytics Dashboard</h3>
                <p>Track performance of your content</p>
                <button className="action-btn">View Stats</button>
              </div>
              <div className="action-card">
                <div className="action-icon">🌐</div>
                <h3>Platform Integration</h3>
                <p>Connect with publishing platforms</p>
                <button className="action-btn" onClick={() => window.location.href = '/platform'}>Manage Platforms</button>
              </div>
            </div>
          </section>

          {/* Market Insights */}
          <section className="market-insights">
            <h2>💡 Market Insights</h2>
            <div className="insights-grid">
              <div className="insight-card">
                <h4>🔥 Trending Topics</h4>
                <ul>
                  <li>Blockchain Publishing</li>
                  <li>Creator Economy</li>
                  <li>Web3 Tools</li>
                  <li>Digital Monetization</li>
                  <li>Open Source Writing</li>
                </ul>
              </div>
              <div className="insight-card">
                <h4>📈 Growth Platforms</h4>
                <ul>
                  <li>Mirror.xyz (+45%)</li>
                  <li>Substack (+32%)</li>
                  <li>Bitcoin Writer (+28%)</li>
                  <li>Ghost (+15%)</li>
                  <li>Medium (+8%)</li>
                </ul>
              </div>
              <div className="insight-card">
                <h4>💰 Top Earners</h4>
                <ul>
                  <li>Tech Tutorials ($2,500/mo)</li>
                  <li>Crypto Analysis ($1,800/mo)</li>
                  <li>Business Guides ($1,200/mo)</li>
                  <li>Personal Stories ($900/mo)</li>
                  <li>How-to Guides ($750/mo)</li>
                </ul>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default IdeasPage;