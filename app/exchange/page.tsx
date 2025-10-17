'use client';

import React from 'react';
import DocumentExchangeView from '../../components/editor/DocumentExchangeView';
import Link from 'next/link';
import './exchange.css';

const ExchangePage: React.FC = () => {
  return (
    <div style={{
      minHeight: '100vh',
      background: '#0a0a0a',
      color: '#ffffff',
      fontFamily: "'SF Pro Display', 'Helvetica Neue', 'Segoe UI', -apple-system, BlinkMacSystemFont, sans-serif"
    }}>
      {/* Header matching the main site */}
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
            <Link href="/" style={{ textDecoration: 'none', cursor: 'pointer' }}>
              <span className="logo-text">Bitcoin</span>
            </Link>
            <span className="logo-writer">Writer</span>
            <span style={{ color: '#fff', marginLeft: '0.5rem' }}>Exchange</span>
          </div>
        </div>
      </div>

      <div style={{
        maxWidth: '1600px',
        margin: '0 auto',
        padding: '1rem 2rem',
        paddingTop: '1rem'
      }}
      className="exchange-main-container">
        {/* Navigation */}
        <nav style={{
          marginBottom: '2rem',
          padding: '1rem',
          background: 'rgba(255, 255, 255, 0.05)',
          borderRadius: '8px',
          border: '1px solid rgba(255, 255, 255, 0.1)'
        }}>
          <Link href="/" style={{ color: '#f7931a', textDecoration: 'none', fontSize: '14px', fontWeight: '500' }}>
            ← Back to Home
          </Link>
        </nav>

        {/* Exchange View Container */}
        <div className="exchange-page-container">
          <DocumentExchangeView />
        </div>
      </div>
    </div>
  );
};

export default ExchangePage;