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

const AuthorPage: React.FC = () => {
  const { authorId } = useParams<{ authorId: string }>();
  const [author, setAuthor] = useState<AuthorData | null>(null);
  const [authorArticleService] = useState(() => new AuthorArticleService());

  useEffect(() => {
    // Mock author data - in production, fetch from API
    const authorData: Record<string, AuthorData> = {
      'b0ase': {
        id: 'b0ase',
        name: 'b0ase',
        handle: '@b0ase',
        handcashHandle: '$b0ase',
        avatar: '/images/b0ase-logo.jpeg',
        bio: 'Creator and lead developer of Bitcoin Writer. Passionate about decentralized publishing and the future of content monetization.',
        longBio: 'b0ase is the visionary creator behind Bitcoin Writer, a revolutionary platform that transforms how content creators monetize their work. With over a decade of experience in blockchain technology and digital publishing, b0ase has been at the forefront of the Web3 content revolution. Their work focuses on creating sustainable economic models for creators while empowering readers to invest directly in the content they value.',
        articlesCount: 3,
        totalShares: 15420000,
        joinDate: '2024-01-15',
        articles: [
          {
            id: '1',
            title: 'The Future of Digital Publishing',
            description: 'How blockchain technology is revolutionizing content creation and monetization',
            thumbnail: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&h=250&fit=crop&crop=center',
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
            thumbnail: 'https://images.unsplash.com/photo-1621761191319-c6fb62004040?w=400&h=250&fit=crop&crop=center',
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
            thumbnail: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=400&h=250&fit=crop&crop=center',
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
      // Check all stored author profiles to see if one matches this authorId
      const allProfiles = authorArticleService.getAllAuthoredArticles();
      
      for (const [handle, articles] of Object.entries(allProfiles)) {
        const cleanHandle = handle.replace('@', '').replace('$', '').toLowerCase();
        if (cleanHandle === authorId) {
          // Found a dynamic author, create their profile
          const profile = authorArticleService.getAuthorProfile(handle);
          if (profile && articles.length > 0) {
            // Convert AuthoredArticle[] to Article[] format
            const convertedArticles: Article[] = articles
              .filter(article => article.status === 'published' || article.status === 'tokenized')
              .map(article => ({
                id: article.id,
                title: article.title,
                description: article.description,
                thumbnail: article.thumbnail || '',
                readTime: article.readTime,
                engagement: Math.floor(Math.random() * 2000) + 500, // Mock engagement for now
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
          <h2>📰 Published Articles</h2>
          <div className="articles-grid">
            {author.articles.map(article => (
              <div key={article.id} className="article-card">
                <Link to={getArticleUrl(article.title, article.id)} className="article-link">
                  <div className="article-thumbnail">
                    <img src={article.thumbnail} alt={article.title} />
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

export default AuthorPage;