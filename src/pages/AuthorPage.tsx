import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { getArticleUrl } from '../utils/slugUtils';
import WeatherWidget from '../components/WeatherWidget';
import StockTickerCard from '../components/StockTickerCard';
import AdCard from '../components/AdCard';
import './MarketBodyPage.css';

interface Article {
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
  publishDate: string;
}

interface AuthorProfile {
  name: string;
  handle: string;
  bio: string;
  avatar: string;
  twitter: string;
  handcash: string;
  website?: string;
  specialties: string[];
  totalArticles: number;
  totalEngagement: number;
  joinDate: string;
}

const AuthorPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();

  // Author profiles data
  const authorProfiles: Record<string, AuthorProfile> = {
    'b0ase': {
      name: 'b0ase',
      handle: '@b0ase',
      bio: 'Creator of Bitcoin Writer, revolutionizing content monetization on the blockchain. Bitcoin entrepreneur and strategist behind the Bitcoin Operating System (bOS) framework.',
      avatar: '/avatar-b0ase.jpg',
      twitter: '@b0ase',
      handcash: '$boase',
      website: 'https://bitcoin-writer.vercel.app',
      specialties: ['Blockchain Technology', 'Economics', 'Platform Strategy', 'Entrepreneurship'],
      totalArticles: 4,
      totalEngagement: 8380,
      joinDate: 'October 2025'
    }
  };

  // Author's articles - these are now moved from the main market
  const authorArticles: Record<string, Article[]> = {
    'b0ase': [
      {
        id: '2',
        title: 'Bitcoin Writer: The Uberfication of Writing',
        description: 'A thoughtful examination and response to Anna Iversen\'s concerns about modern work platforms, from the perspective of a 7-year Uber driver who built Bitcoin Writer',
        author: 'b0ase',
        authorHandle: '@b0ase',
        platform: 'Bitcoin Writer',
        category: 'Technology',
        readTime: 5,
        engagement: 2150,
        thumbnail: '/uber-driving.jpg',
        price: 0.01,
        isTokenized: true,
        trending: true,
        publishDate: 'October 12, 2025'
      },
      {
        id: '3',
        title: 'Ideological Oversimplification: Dissecting a Shallow Critique of Debt and Money',
        description: 'A critique of Iversen\'s rhetorical framework which relies on flawed economic analogies to misrepresent the nature of debt in traditional financial systems',
        author: 'b0ase',
        authorHandle: '@b0ase',
        platform: 'Bitcoin Writer',
        category: 'Economics',
        readTime: 18,
        engagement: 1780,
        thumbnail: '/corn.jpg',
        price: 0.01,
        isTokenized: true,
        trending: true,
        publishDate: 'October 12, 2025'
      }
    ]
  };

  const author = authorProfiles[slug || ''];
  const articles = authorArticles[slug || ''] || [];

  if (!author) {
    return (
      <div className="market-body-page">
        <header className="App-header" style={{ marginTop: '72px' }}>
          <div className="title-section">
            <div className="app-title-container">
              <img 
                src="/logo.svg" 
                alt="Bitcoin Writer Logo" 
                className="app-logo"
                style={{
                  width: '32px',
                  height: '32px',
                  marginRight: '16px',
                  marginTop: '4px',
                  verticalAlign: 'baseline'
                }}
              />
              <h1 
                onClick={() => {
                  window.location.href = '/';
                }}
                style={{
                  cursor: 'pointer',
                  paddingTop: '10px',
                  marginLeft: '-12px'
                }}
                title="Return to main view"
              >
                <span style={{color: '#ff9500'}}>Bitcoin</span> Writer
              </h1>
            </div>
            <p className="app-subtitle">Encrypt, publish and sell shares in your work</p>
          </div>
        </header>

        <div className="market-body-layout">
          <div className="market-body-content" style={{ textAlign: 'center', padding: '40px' }}>
            <h1 style={{ color: '#fff', marginBottom: '20px' }}>Author Not Found</h1>
            <p style={{ color: '#ccc', marginBottom: '20px' }}>
              The author profile you're looking for doesn't exist.
            </p>
            <Link to="/market" style={{ color: '#ff9500', textDecoration: 'none' }}>
              ← Back to Market
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="market-body-page">
      <header className="App-header" style={{ marginTop: '72px' }}>
        <div className="title-section">
          <div className="app-title-container">
            <img 
              src="/logo.svg" 
              alt="Bitcoin Writer Logo" 
              className="app-logo"
              style={{
                width: '32px',
                height: '32px',
                marginRight: '16px',
                marginTop: '4px',
                verticalAlign: 'baseline'
              }}
            />
            <h1 
              onClick={() => {
                window.location.href = '/';
              }}
              style={{
                cursor: 'pointer',
                paddingTop: '10px',
                marginLeft: '-12px'
              }}
              title="Return to main view"
            >
              <span style={{color: '#ff9500'}}>Bitcoin</span> Writer
            </h1>
          </div>
          <p className="app-subtitle">Encrypt, publish and sell shares in your work</p>
        </div>
      </header>
      
      <div className="market-body-layout">
        <div className="market-body-content">
          {/* Author Profile Header */}
          <section style={{ marginBottom: '40px' }}>
            <nav style={{ marginBottom: '20px' }}>
              <Link to="/market" style={{ color: '#ff9500', textDecoration: 'none' }}>
                ← Back to Market
              </Link>
            </nav>

            <div style={{ 
              display: 'flex', 
              gap: '30px', 
              alignItems: 'flex-start',
              marginBottom: '30px',
              flexWrap: 'wrap'
            }}>
              <div style={{ 
                width: '120px', 
                height: '120px', 
                borderRadius: '50%', 
                background: 'linear-gradient(135deg, #ff9500, #ffb347)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '48px',
                fontWeight: 'bold',
                color: '#000',
                flexShrink: 0
              }}>
                {author.name.charAt(0).toUpperCase()}
              </div>
              
              <div style={{ flex: 1, minWidth: '300px' }}>
                <h1 style={{ 
                  fontSize: '2.5em', 
                  marginBottom: '10px', 
                  color: '#fff',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '15px',
                  flexWrap: 'wrap'
                }}>
                  {author.name}
                  <span style={{ 
                    fontSize: '0.6em', 
                    color: '#ff9500',
                    fontWeight: 'normal'
                  }}>
                    {author.handle}
                  </span>
                </h1>
                
                <p style={{ 
                  color: '#ccc', 
                  lineHeight: '1.6', 
                  marginBottom: '20px',
                  fontSize: '1.1em'
                }}>
                  {author.bio}
                </p>
                
                <div style={{ 
                  display: 'flex', 
                  gap: '20px', 
                  marginBottom: '20px',
                  flexWrap: 'wrap'
                }}>
                  <a 
                    href={`https://twitter.com/${author.twitter.replace('@', '')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ 
                      color: '#ff9500', 
                      textDecoration: 'none',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '5px'
                    }}
                  >
                    🐦 {author.twitter}
                  </a>
                  <span style={{ color: '#ffb347' }}>
                    💰 {author.handcash}
                  </span>
                  {author.website && (
                    <a 
                      href={author.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{ color: '#ff9500', textDecoration: 'none' }}
                    >
                      🌐 Website
                    </a>
                  )}
                </div>
                
                <div style={{ 
                  display: 'flex', 
                  gap: '10px', 
                  flexWrap: 'wrap',
                  marginBottom: '20px'
                }}>
                  {author.specialties.map((specialty, index) => (
                    <span 
                      key={index}
                      style={{
                        background: 'rgba(255, 149, 0, 0.2)',
                        color: '#ff9500',
                        padding: '4px 12px',
                        borderRadius: '16px',
                        fontSize: '0.9em',
                        border: '1px solid rgba(255, 149, 0, 0.3)'
                      }}
                    >
                      {specialty}
                    </span>
                  ))}
                </div>
                
                <div style={{ 
                  display: 'flex', 
                  gap: '30px', 
                  color: '#ccc',
                  fontSize: '0.9em',
                  flexWrap: 'wrap'
                }}>
                  <span><strong>{author.totalArticles}</strong> Articles</span>
                  <span><strong>{author.totalEngagement.toLocaleString()}</strong> Total Views</span>
                  <span>Joined <strong>{author.joinDate}</strong></span>
                </div>
              </div>
            </div>
          </section>

          {/* Author's Articles */}
          <section>
            <h2 style={{ 
              color: '#fff', 
              marginBottom: '20px',
              fontSize: '1.8em',
              borderBottom: '2px solid #ff9500',
              paddingBottom: '10px'
            }}>
              Published Articles
            </h2>
            
            {articles.length === 0 ? (
              <p style={{ color: '#ccc', textAlign: 'center', padding: '40px' }}>
                No articles published yet.
              </p>
            ) : (
              <div className="content-grid">
                {articles.map(article => (
                  <Link 
                    key={article.id} 
                    to={`/market/article/${article.id}`}
                    className="content-card trending"
                  >
                    <div className="content-thumbnail">
                      <img src={article.thumbnail} alt={article.title} />
                      <div className="content-badges">
                        {article.trending && <span className="badge trending">🔥 Trending</span>}
                        {article.isTokenized && <span className="badge tokenized">₿ Tokenized</span>}
                      </div>
                    </div>
                    <div className="content-info">
                      <h3>{article.title}</h3>
                      <p>{article.description}</p>
                      <div className="content-meta">
                        <span className="author-name">{article.author}</span>
                        <span className="platform">{article.platform}</span>
                        <span className="read-time">{article.readTime} min read</span>
                      </div>
                      <div className="content-stats">
                        <span className="engagement">👁 {article.engagement}</span>
                        {article.price && (
                          <div className="price-display">
                            <span className="price-usd">${article.price.toFixed(2)}</span>
                          </div>
                        )}
                      </div>
                      <div style={{ fontSize: '0.8em', color: '#999', marginTop: '10px' }}>
                        Published {article.publishDate}
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
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
              title="Support This Author"
              description={`Send tips to ${author.handcash} for quality content creation`}
              imageUrl="https://images.unsplash.com/photo-1640340434855-6084b1f4901c?w=400&h=250&fit=crop&crop=center"
              actionText="Send Tip"
              brand="HandCash"
              sponsored={false}
            />
          </div>
          <div className="widget-item">
            <AdCard
              type="service"
              title="Collaborate"
              description={`Connect with ${author.name} for writing collaborations and projects`}
              imageUrl="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=400&h=250&fit=crop&crop=center"
              actionText="Contact"
              brand="Bitcoin Writer"
              sponsored={false}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthorPage;