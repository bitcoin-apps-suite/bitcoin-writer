import React, { useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import './MockupArticlePage.css';
import FutureOfDesktopPublishingArticle from './FutureOfDesktopPublishingArticle';

const MockupArticlePage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();

  // Scroll to top when component mounts
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Show the real article for ID "1"
  if (slug === '1') {
    return <FutureOfDesktopPublishingArticle />;
  }

  return (
    <div className="mockup-article-page">
      <div className="mockup-container">
        <div className="mockup-notice">
          <div className="notice-icon">📝</div>
          <h1>This is a Mockup Article</h1>
          <p>The link you followed leads to a placeholder article that doesn't exist yet.</p>
        </div>

        <div className="article-preview">
          <div className="article-header">
            <h2>Sample Article: The Future of Decentralized Publishing</h2>
            <div className="article-meta">
              <span className="author">By Sample Author</span>
              <span className="date">October 11, 2024</span>
              <span className="read-time">5 min read</span>
            </div>
          </div>

          <div className="article-content">
            <p className="intro-text">
              Welcome to Bitcoin Writer! This is what a real article would look like on our platform. 
              You can read the introduction to any article for free, but premium content is protected 
              behind a micropayment paywall.
            </p>
            
            <div className="paywall-section">
              <div className="paywall-overlay">
                <div className="paywall-content">
                  <h3>🔒 Premium Content</h3>
                  <p>The rest of this article is available to readers who purchase shares or make a one-time payment.</p>
                  <div className="payment-info">
                    <div className="share-price">
                      <span className="label">Share Price:</span>
                      <span className="price">$0.00002400</span>
                    </div>
                    <div className="one-time-price">
                      <span className="label">One-time Access:</span>
                      <span className="price">$0.05</span>
                    </div>
                  </div>
                  <button className="unlock-btn" disabled>
                    💰 Unlock Article (Demo)
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="platform-info">
          <h2>About Bitcoin Writer</h2>
          <div className="info-grid">
            <div className="info-card">
              <h3>🔓 For Readers</h3>
              <ul>
                <li>Read article introductions for free</li>
                <li>Pay small amounts to unlock full content</li>
                <li>Buy shares in articles you believe in</li>
                <li>No subscription required</li>
              </ul>
            </div>
            
            <div className="info-card">
              <h3>✍️ For Writers</h3>
              <ul>
                <li>Sign in with HandCash to start publishing</li>
                <li>Earn Bitcoin from every reader</li>
                <li>Automatic tokenization of your articles</li>
                <li>Build a following and recurring income</li>
              </ul>
            </div>
            
            <div className="info-card">
              <h3>💎 Tokenization Features</h3>
              <ul>
                <li>Every article becomes dividend shares</li>
                <li>Readers can invest in your content</li>
                <li>Earn from both views and investments</li>
                <li>Transparent blockchain-based payments</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="call-to-action">
          <div className="cta-content">
            <h2>Ready to Start Writing?</h2>
            <p>
              Join our community of writers and start earning Bitcoin through your content. 
              Sign in with HandCash to create your author profile and publish your first article.
            </p>
            <div className="cta-buttons">
              <button 
                className="cta-primary"
                onClick={() => {
                  // Trigger HandCash sign in
                  document.querySelector<HTMLButtonElement>('.sign-in-btn')?.click();
                }}
              >
                🔓 Sign in with HandCash
              </button>
              <Link to="/" className="cta-secondary">
                📝 Try the Editor
              </Link>
              <Link to="/authors" className="cta-secondary">
                ✍️ View Authors
              </Link>
            </div>
          </div>
        </div>

        <div className="debug-info">
          <h3>Debug Info</h3>
          <p><strong>Requested slug:</strong> {slug || 'none'}</p>
          <p><strong>Note:</strong> This page appears for any article link that doesn't have real content yet.</p>
        </div>
      </div>
    </div>
  );
};

export default MockupArticlePage;