import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getArticleUrl } from '../utils/slugUtils';
import { getAuthorSlugFromName } from '../utils/authorUtils';
import WeatherWidget from '../components/WeatherWidget';
import StockTickerCard from '../components/StockTickerCard';
import AdCard from '../components/AdCard';
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

const MarketPage: React.FC = () => {
  const [selectedContent, setSelectedContent] = useState<FeaturedContent | null>(null);
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

  const featuredContent: FeaturedContent[] = [
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
      id: '3',
      title: 'Open Source Publishing Tools',
      description: 'Discover the best tools for independent publishers and content creators',
      author: 'Dev Community',
      authorHandle: '@devcommunity',
      platform: 'Dev.to',
      category: 'Development',
      readTime: 6,
      engagement: 890,
      thumbnail: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=400&h=250&fit=crop&crop=center',
      isTokenized: false,
      trending: false
    },
    {
      id: '4',
      title: 'Newsletter Growth Strategies',
      description: 'Proven tactics to grow your newsletter audience and increase engagement',
      author: 'Emma Wilson',
      authorHandle: '@emmawilson',
      platform: 'Substack',
      category: 'Marketing',
      readTime: 10,
      engagement: 1780,
      thumbnail: 'https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=400&h=250&fit=crop&crop=center',
      isTokenized: false,
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
      id: '6',
      title: 'Professional Writing in 2025',
      description: 'Career opportunities and challenges for writers in the digital age',
      author: 'Career Coach',
      authorHandle: '@careercoach',
      platform: 'LinkedIn',
      category: 'Career',
      readTime: 7,
      engagement: 1240,
      thumbnail: 'https://images.unsplash.com/photo-1486312338219-ce68e2c6b7eb?w=400&h=250&fit=crop&crop=center',
      isTokenized: false,
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
      id: '8',
      title: 'Medium Partner Program Guide',
      description: 'Maximize your earnings on Medium\'s partner program',
      author: 'Content Strategist',
      authorHandle: '@contentstrat',
      platform: 'Medium',
      category: 'Marketing',
      readTime: 11,
      engagement: 1456,
      thumbnail: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?w=400&h=250&fit=crop&crop=center',
      isTokenized: false,
      trending: false
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
      id: '10',
      title: 'Ghost CMS Setup Guide',
      description: 'Complete tutorial for setting up your own publishing platform',
      author: 'Tech Tutorial',
      authorHandle: '@techtutorial',
      platform: 'Ghost',
      category: 'Development',
      readTime: 20,
      engagement: 967,
      thumbnail: 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=400&h=250&fit=crop&crop=center',
      isTokenized: false,
      trending: false
    },
    {
      id: '11',
      title: 'Substack Monetization Tips',
      description: 'Build a profitable newsletter with proven strategies',
      author: 'Newsletter Pro',
      authorHandle: '@newsletterpro',
      platform: 'Substack',
      category: 'Business',
      readTime: 8,
      engagement: 1654,
      thumbnail: 'https://images.unsplash.com/photo-1434626881859-194d67b2b86f?w=400&h=250&fit=crop&crop=center',
      isTokenized: false,
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

  const trendingContent = featuredContent.filter(content => content.trending);
  const tokenizedContent = featuredContent.filter(content => content.isTokenized);

  return (
    <div className="market-body-page">
      {/* Main content layout without sidebar constraints */}
      <div className="market-body-layout">
        {/* Left side - Article content */}
        <div className="market-body-content">
          {/* Featured Content Section */}
          <section className="featured-section">
            <h2>🔥 Trending Content</h2>
            <div className="content-grid">
              {trendingContent.map(content => (
                <Link 
                  key={content.id} 
                  to={getArticleUrl(content.title, content.id)}
                  className="content-card trending"
                >
                  <div className="content-thumbnail">
                    <img src={content.thumbnail} alt={content.title} />
                    <div className="content-badges">
                      {content.trending && <span className="badge trending">🔥 Trending</span>}
                      {content.isTokenized && <span className="badge tokenized">₿ Tokenized</span>}
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
                      <span className="read-time">{content.readTime} min read</span>
                    </div>
                    <div className="content-stats">
                      <span className="engagement">👁 {content.engagement}</span>
                      {content.price && (
                        <div className="price-display">
                          <span className="price-usd">${content.price?.toFixed(2) || '0.01'}</span>
                          <span className="price-bsv">₿ {formatBSVAmount(content.price || 0.01)} BSV</span>
                        </div>
                      )}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </section>

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

        {/* Right side - Widget sidebar */}
        <div className="market-body-sidebar">
            <div className="widget-item">
              <WeatherWidget />
            </div>
            <div className="widget-item">
              <StockTickerCard />
            </div>
            <div className="widget-item">
              <AdCard
                type="banner"
                title="Boost Your Writing Career"
                description="Join thousands of writers earning Bitcoin through quality content creation"
                imageUrl="https://images.unsplash.com/photo-1486312338219-ce68e2c6b7eb?w=400&h=250&fit=crop&crop=center"
                actionText="Join Now"
                brand="Bitcoin Writer"
                sponsored={true}
              />
            </div>
            <div className="widget-item">
              <AdCard
                type="product"
                title="Premium Writing Tools"
                description="Advanced editing features and analytics to improve your content performance"
                imageUrl="https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&h=250&fit=crop&crop=center"
                actionText="Upgrade"
                brand="WritePro"
                sponsored={true}
              />
            </div>
            <div className="widget-item">
              <AdCard
                type="service"
                title="Editorial Services"
                description="Professional editing and proofreading to make your content shine"
                imageUrl="https://images.unsplash.com/photo-1455390582262-044cdead277a?w=400&h=250&fit=crop&crop=center"
                actionText="Learn More"
                brand="Editor Plus"
                sponsored={true}
              />
            </div>
            <div className="widget-item">
              <AdCard
                type="sponsored"
                title="Crypto News Platform"
                description="Stay updated with the latest cryptocurrency and blockchain developments"
                imageUrl="https://images.unsplash.com/photo-1621761191319-c6fb62004040?w=400&h=250&fit=crop&crop=center"
                actionText="Subscribe"
                brand="CoinDesk"
                sponsored={true}
              />
            </div>
        </div>
      </div>
    </div>
  );
};

export default MarketPage;