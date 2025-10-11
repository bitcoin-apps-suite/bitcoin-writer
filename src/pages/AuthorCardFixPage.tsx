import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getArticleUrl } from '../utils/slugUtils';
import './AuthorPage.css';
import AuthorArticleService from '../services/AuthorArticleService';

interface Article {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  readTime: number;
  engagement: number;
  publishDate: string;
  sharePrice: number;
  shareChange24h: number;
  totalShares: number;
  marketCap: number;
  ticker: string;
}

interface AuthorData {
  id: string;
  name: string;
  handle: string;
  handcashHandle?: string;
  avatar: string;
  bio: string;
  longBio: string;
  articlesCount: number;
  totalShares: number;
  joinDate: string;
  articles: Article[];
}

const AuthorCardFixPage: React.FC = () => {
  const { authorId } = useParams<{ authorId: string }>();
  const [author, setAuthor] = useState<AuthorData | null>(null);
  const [authorArticleService] = useState(() => new AuthorArticleService());

  useEffect(() => {
    // Fixed author data with working thumbnail URLs
    const authorData: Record<string, AuthorData> = {
      'b0ase': {
        id: 'b0ase',
        name: 'b0ase',
        handle: '@b0ase',
        handcashHandle: '$b0ase',
        avatar: '/images/b0ase-logo.jpeg',
        bio: 'Creator and lead developer of Bitcoin Writer. Passionate about decentralized publishing and the future of content monetization.',
        longBio: 'b0ase is the visionary creator behind Bitcoin Writer, a revolutionary platform that transforms how content creators monetize their work. With over a decade of experience in blockchain technology and digital publishing, b0ase has been at the forefront of the Web3 content revolution. His work focuses on creating sustainable economic models for creators while empowering readers to invest directly in the content they value.',
        articlesCount: 3,
        totalShares: 15420000,
        joinDate: '2024-01-15',
        articles: [
          {
            id: '1',
            title: 'The Future of Digital Publishing',
            description: 'How blockchain technology is revolutionizing content creation and monetization',
            thumbnail: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjI1MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KICA8ZGVmcz4KICAgIDxsaW5lYXJHcmFkaWVudCBpZD0iZ3JhZGllbnQiIHgxPSIwJSIgeTE9IjAlIiB4Mj0iMTAwJSIgeTI9IjEwMCUiPgogICAgICA8c3RvcCBvZmZzZXQ9IjAlIiBzdHlsZT0ic3RvcC1jb2xvcjojNEY0NkU1O3N0b3Atb3BhY2l0eToxIiAvPgogICAgICA8c3RvcCBvZmZzZXQ9IjEwMCUiIHN0eWxlPSJzdG9wLWNvbG9yOiM3QzNBRUQ7c3RvcC1vcGFjaXR5OjEiIC8+CiAgICA8L2xpbmVhckdyYWRpZW50PgogIDwvZGVmcz4KICA8cmVjdCB3aWR0aD0iNDAwIiBoZWlnaHQ9IjI1MCIgZmlsbD0idXJsKCNncmFkaWVudCkiLz4KICA8dGV4dCB4PSIyMDAiIHk9IjEzMCIgZm9udC1mYW1pbHk9IkFyaWFsLCBzYW5zLXNlcmlmIiBmb250LXNpemU9IjI0IiBmaWxsPSJ3aGl0ZSIgdGV4dC1hbmNob3I9Im1pZGRsZSI+RGlnaXRhbCBQdWJsaXNoaW5nPC90ZXh0Pgo8L3N2Zz4K',
            readTime: 8,
            engagement: 1520,
            publishDate: '2024-10-01',
            sharePrice: 0.000024,
            shareChange24h: 5.2,
            totalShares: 5000000,
            marketCap: 120.00,
            ticker: '$bWriter_b0ase_Future-of-digital-publishing'
          },
          {
            id: '7',
            title: 'Crypto Content Monetization',
            description: 'How to earn Bitcoin through content creation and publishing',
            thumbnail: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjI1MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KICA8ZGVmcz4KICAgIDxsaW5lYXJHcmFkaWVudCBpZD0iZ3JhZGllbnQyIiB4MT0iMCUiIHkxPSIwJSIgeDI9IjEwMCUiIHkyPSIxMDAlIj4KICAgICAgPHN0b3Agb2Zmc2V0PSIwJSIgc3R5bGU9InN0b3AtY29sb3I6I0ZGOTUwMDtzdG9wLW9wYWNpdHk6MSIgLz4KICAgICAgPHN0b3Agb2Zmc2V0PSIxMDAlIiBzdHlsZT0ic3RvcC1jb2xvcjojRkY2QjAwO3N0b3Atb3BhY2l0eToxIiAvPgogICAgPC9saW5lYXJHcmFkaWVudD4KICA8L2RlZnM+CiAgPHJlY3Qgd2lkdGg9IjQwMCIgaGVpZ2h0PSIyNTAiIGZpbGw9InVybCgjZ3JhZGllbnQyKSIvPgogIDx0ZXh0IHg9IjIwMCIgeT0iMTMwIiBmb250LWZhbWlseT0iQXJpYWwsIHNhbnMtc2VyaWYiIGZvbnQtc2l6ZT0iMjQiIGZpbGw9IndoaXRlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIj5DcnlwdG8gQ29udGVudDwvdGV4dD4KPC9zdmc+Cg==',
            readTime: 9,
            engagement: 1890,
            publishDate: '2024-09-15',
            sharePrice: 0.000031,
            shareChange24h: -2.1,
            totalShares: 5200000,
            marketCap: 161.20,
            ticker: '$bWriter_b0ase_Crypto-content-monetization'
          },
          {
            id: '12',
            title: 'Web3 Publishing Future',
            description: 'The next frontier of digital content creation',
            thumbnail: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjI1MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KICA8ZGVmcz4KICAgIDxsaW5lYXJHcmFkaWVudCBpZD0iZ3JhZGllbnQzIiB4MT0iMCUiIHkxPSIwJSIgeDI9IjEwMCUiIHkyPSIxMDAlIj4KICAgICAgPHN0b3Agb2Zmc2V0PSIwJSIgc3R5bGU9InN0b3AtY29sb3I6IzRDQUY1MDtzdG9wLW9wYWNpdHk6MSIgLz4KICAgICAgPHN0b3Agb2Zmc2V0PSIxMDAlIiBzdHlsZT0ic3RvcC1jb2xvcjojNDVBMDQ5O3N0b3Atb3BhY2l0eToxIiAvPgogICAgPC9saW5lYXJHcmFkaWVudD4KICA8L2RlZnM+CiAgPHJlY3Qgd2lkdGg9IjQwMCIgaGVpZ2h0PSIyNTAiIGZpbGw9InVybCgjZ3JhZGllbnQzKSIvPgogIDx0ZXh0IHg9IjIwMCIgeT0iMTMwIiBmb250LWZhbWlseT0iQXJpYWwsIHNhbnMtc2VyaWYiIGZvbnQtc2l6ZT0iMjQiIGZpbGw9IndoaXRlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIj5XZWIzIFB1Ymxpc2hpbmc8L3RleHQ+Cjwvc3ZnPgo=',
            readTime: 14,
            engagement: 2890,
            publishDate: '2024-08-20',
            sharePrice: 0.000018,
            shareChange24h: 8.7,
            totalShares: 5220000,
            marketCap: 93.96,
            ticker: '$bWriter_b0ase_Web3-publishing-future'
          }
        ]
      }
    };

    if (authorId && authorData[authorId]) {
      setAuthor(authorData[authorId]);
    } else if (authorId) {
      // Try to find dynamic author based on their handle
      const allProfiles = authorArticleService.getAllAuthoredArticles();
      
      for (const [handle, articles] of Object.entries(allProfiles)) {
        const cleanHandle = handle.replace('@', '').replace('$', '').toLowerCase();
        if (cleanHandle === authorId) {
          const profile = authorArticleService.getAuthorProfile(handle);
          if (profile && articles.length > 0) {
            const convertedArticles: Article[] = articles
              .filter(article => article.status === 'published' || article.status === 'tokenized')
              .map(article => ({
                id: article.id,
                title: article.title,
                description: article.description,
                thumbnail: article.thumbnail || 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjI1MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KICA8cmVjdCB3aWR0aD0iNDAwIiBoZWlnaHQ9IjI1MCIgZmlsbD0iIzMzMzMzMyIvPgogIDx0ZXh0IHg9IjIwMCIgeT0iMTMwIiBmb250LWZhbWlseT0iQXJpYWwsIHNhbnMtc2VyaWYiIGZvbnQtc2l6ZT0iMjQiIGZpbGw9IndoaXRlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIj5BcnRpY2xlPC90ZXh0Pgo8L3N2Zz4K',
                readTime: article.readTime,
                engagement: Math.floor(Math.random() * 2000) + 500,
                publishDate: article.createdAt.split('T')[0],
                sharePrice: article.sharePrice || 0.000001,
                shareChange24h: article.shareChange24h || 0,
                totalShares: article.totalShares || 1000000,
                marketCap: (article.sharePrice || 0.000001) * (article.totalShares || 1000000),
                ticker: article.ticker || `$bWriter_${cleanHandle}_${article.title.toLowerCase().replace(/\s+/g, '-')}`
              }));

            const dynamicAuthor: AuthorData = {
              id: cleanHandle,
              name: profile.displayName,
              handle: profile.handle,
              handcashHandle: profile.handle.replace('@', '$'),
              avatar: profile.avatarUrl,
              bio: profile.bio,
              longBio: profile.bio,
              articlesCount: convertedArticles.length,
              totalShares: profile.totalShares,
              joinDate: profile.joinDate,
              articles: convertedArticles
            };
            
            setAuthor(dynamicAuthor);
            break;
          }
        }
      }
    }
  }, [authorId, authorArticleService]);

  if (!author) {
    return (
      <div className="author-page">
        <div className="author-container">
          <div className="author-not-found">
            <h1>Author Not Found</h1>
            <p>The author you're looking for doesn't exist or isn't available yet.</p>
            <Link to="/authors" className="back-link">← Back to Authors</Link>
          </div>
        </div>
      </div>
    );
  }

  const formatPrice = (price: number): string => {
    if (price >= 0.01) {
      return `$${price.toFixed(4)}`;
    } else {
      return `$${price.toFixed(8)}`;
    }
  };

  const formatMarketCap = (marketCap: number): string => {
    if (marketCap >= 1000) {
      return `$${(marketCap / 1000).toFixed(1)}K`;
    }
    return `$${marketCap.toFixed(2)}`;
  };

  const formatShares = (shares: number): string => {
    if (shares >= 1000000) {
      return `${(shares / 1000000).toFixed(1)}M`;
    }
    if (shares >= 1000) {
      return `${(shares / 1000).toFixed(1)}K`;
    }
    return shares.toString();
  };

  return (
    <div className="author-page">
      <div className="author-container">
        <Link to="/authors" className="back-link">← Back to Authors</Link>
        
        <div className="author-profile">
          <div className="author-header">
            <div className="author-avatar-large">
              <img src={author.avatar} alt={author.name} />
            </div>
            <div className="author-details">
              <h1 className="author-name">{author.name}</h1>
              <p className="author-handle">{author.handle}</p>
              {author.handcashHandle && (
                <p className="handcash-handle">{author.handcashHandle}</p>
              )}
              <div className="author-stats-header">
                <div className="stat">
                  <span className="stat-value">{author.articlesCount}</span>
                  <span className="stat-label">Articles Published</span>
                </div>
                <div className="stat">
                  <span className="stat-value">{formatShares(author.totalShares)}</span>
                  <span className="stat-label">Total Shares Issued</span>
                </div>
                <div className="stat">
                  <span className="stat-value">{author.joinDate}</span>
                  <span className="stat-label">Member Since</span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="author-bio-section">
            <h2>About {author.name}</h2>
            <p className="author-long-bio">{author.longBio}</p>
          </div>
        </div>

        <div className="author-articles">
          <h2>📰 Published Articles (FIXED)</h2>
          <div className="articles-grid">
            {author.articles.map(article => (
              <div key={article.id} className="article-card">
                <Link to={getArticleUrl(article.title, article.id)} className="article-link">
                  <div className="article-thumbnail">
                    <img 
                      src={article.thumbnail} 
                      alt={article.title}
                      style={{
                        backgroundColor: '#444',
                        minHeight: '200px',
                        display: 'block'
                      }}
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjI1MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KICA8cmVjdCB3aWR0aD0iNDAwIiBoZWlnaHQ9IjI1MCIgZmlsbD0iIzMzMzMzMyIvPgogIDx0ZXh0IHg9IjIwMCIgeT0iMTMwIiBmb250LWZhbWlseT0iQXJpYWwsIHNhbnMtc2VyaWYiIGZvbnQtc2l6ZT0iMjQiIGZpbGw9IndoaXRlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIj5BcnRpY2xlPC90ZXh0Pgo8L3N2Zz4K';
                      }}
                    />
                    <div className="article-overlay">
                      <div className="share-price-display">
                        <span className="share-price">{formatPrice(article.sharePrice)}</span>
                        <span className={`share-change ${article.shareChange24h >= 0 ? 'positive' : 'negative'}`}>
                          {article.shareChange24h >= 0 ? '↗' : '↘'} {Math.abs(article.shareChange24h).toFixed(1)}%
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="article-info">
                    <h3 className="article-title">{article.title}</h3>
                    <p className="article-description">{article.description}</p>
                    
                    <div className="article-meta">
                      <span className="publish-date">{article.publishDate}</span>
                      <span className="read-time">{article.readTime} min read</span>
                      <span className="engagement">👁 {article.engagement}</span>
                    </div>
                    
                    <div className="share-details">
                      <div className="ticker-name">{article.ticker}</div>
                      <div className="share-stats">
                        <div className="share-stat">
                          <span className="stat-label">Market Cap</span>
                          <span className="stat-value">{formatMarketCap(article.marketCap)}</span>
                        </div>
                        <div className="share-stat">
                          <span className="stat-label">Total Shares</span>
                          <span className="stat-value">{formatShares(article.totalShares)}</span>
                        </div>
                        <div className="share-stat">
                          <span className="stat-label">Share Price</span>
                          <span className="stat-value">{formatPrice(article.sharePrice)}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthorCardFixPage;