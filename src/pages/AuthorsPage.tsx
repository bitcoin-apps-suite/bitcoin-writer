import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './AuthorsPage.css';
import AuthorArticleService from '../services/AuthorArticleService';

interface Author {
  id: string;
  name: string;
  handle: string;
  handcashHandle?: string;
  avatar: string;
  bio: string;
  articlesCount: number;
  totalShares: number;
  status: 'active' | 'coming-soon';
  joinDate: string;
  isCurrentUser?: boolean;
}

interface AuthorsPageProps {
  currentUser?: {
    handle: string;
    displayName: string;
    avatarUrl: string;
    articles?: any[];
  };
  isAuthenticated?: boolean;
}

const AuthorsPage: React.FC<AuthorsPageProps> = ({ 
  currentUser, 
  isAuthenticated = false 
}) => {
  // Dynamic authors list that includes signed-in user
  const [authors, setAuthors] = useState<Author[]>([]);
  const [authorArticleService] = useState(() => new AuthorArticleService());

  useEffect(() => {
    const baseAuthors: Author[] = [
      {
        id: 'b0ase',
        name: 'b0ase',
        handle: '@b0ase',
        handcashHandle: '$b0ase',
        avatar: '/images/b0ase-logo.jpeg',
        bio: 'Creator and lead developer of Bitcoin Writer. Passionate about decentralized publishing and the future of content monetization.',
        articlesCount: 3,
        totalShares: 15420000,
        status: 'active',
        joinDate: '2024-01-15'
      },
      {
        id: 'anna-iverson',
        name: 'Anna Iverson',
        handle: '@annaiverson',
        avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face',
        bio: 'Tech journalist and blockchain enthusiast. Covering the intersection of technology and society.',
        articlesCount: 0,
        totalShares: 0,
        status: 'coming-soon',
        joinDate: 'Coming Soon'
      },
      {
        id: 'cs-tominaga',
        name: 'CS Tominaga',
        handle: '@cstominaga',
        avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
        bio: 'Computer scientist and technical writer specializing in distributed systems and cryptocurrency protocols.',
        articlesCount: 0,
        totalShares: 0,
        status: 'coming-soon',
        joinDate: 'Coming Soon'
      },
      {
        id: 'ruth-heasman',
        name: 'Ruth Heasman',
        handle: '@ruthheasman',
        avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face',
        bio: 'Content strategist and digital marketing expert. Helping creators build sustainable income streams.',
        articlesCount: 0,
        totalShares: 0,
        status: 'coming-soon',
        joinDate: 'Coming Soon'
      }
    ];

    // Add current user if signed in and not already in the list
    if (isAuthenticated && currentUser && !baseAuthors.find(a => a.handle === currentUser.handle)) {
      // Get real articles from the pipeline
      const userArticles = authorArticleService.getPublishedArticles(currentUser.handle);
      const totalShares = userArticles.reduce((sum, article) => sum + (article.totalShares || 0), 0);
      
      const userAuthor: Author = {
        id: currentUser.handle.replace('@', '').toLowerCase(),
        name: currentUser.displayName,
        handle: currentUser.handle,
        handcashHandle: currentUser.handle.replace('@', '$'),
        avatar: currentUser.avatarUrl,
        bio: 'Active Bitcoin Writer author. Building a decentralized content portfolio.',
        articlesCount: userArticles.length,
        totalShares: totalShares || (userArticles.length * 5000000), // Use real shares or estimate
        status: 'active',
        joinDate: new Date().toISOString().split('T')[0],
        isCurrentUser: true
      };
      
      // Insert current user as second (after b0ase)
      baseAuthors.splice(1, 0, userAuthor);
    }

    setAuthors(baseAuthors);
  }, [isAuthenticated, currentUser, authorArticleService]);

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
    <div className="authors-page">
      <div className="authors-container">
        <header className="authors-header">
          <h1>✍️ Featured Authors</h1>
          <p>Discover talented writers and creators on Bitcoin Writer</p>
        </header>

        <div className="authors-grid">
          {authors.map(author => (
            <div key={author.id} className={`author-card ${author.status} ${author.isCurrentUser ? 'current-user' : ''}`}>
              <Link to={`/authors/${author.id}`} className="author-link">
                <div className="author-avatar">
                  <img src={author.avatar} alt={author.name} />
                  {author.status === 'coming-soon' && (
                    <div className="coming-soon-overlay">
                      <span className="coming-soon-text">COMING SOON</span>
                    </div>
                  )}
                </div>
                
                <div className="author-info">
                  <h3 className="author-name">{author.name}</h3>
                  <p className="author-handle">{author.handle}</p>
                  {author.handcashHandle && (
                    <p className="handcash-handle">{author.handcashHandle}</p>
                  )}
                  
                  <p className="author-bio">{author.bio}</p>
                  
                  <div className="author-stats">
                    <div className="stat">
                      <span className="stat-value">{author.articlesCount}</span>
                      <span className="stat-label">Articles</span>
                    </div>
                    <div className="stat">
                      <span className="stat-value">{formatShares(author.totalShares)}</span>
                      <span className="stat-label">Total Shares</span>
                    </div>
                  </div>
                  
                  <div className="author-meta">
                    <span className="join-date">Joined {author.joinDate}</span>
                    {author.status === 'coming-soon' && (
                      <button 
                        className="handcash-signin-btn"
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          // Trigger HandCash sign in
                          document.querySelector<HTMLButtonElement>('.sign-in-btn')?.click();
                        }}
                      >
                        🔓 Sign in with HandCash
                      </button>
                    )}
                  </div>
                </div>
              </Link>
            </div>
          ))}
        </div>

        <div className="authors-cta">
          <div className="cta-card">
            <h2>Become a Featured Author</h2>
            <p>Join our community of writers and start earning Bitcoin through your content. Every article you publish automatically generates dividend shares for your readers to invest in.</p>
            <button className="cta-button">Apply to Join</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthorsPage;