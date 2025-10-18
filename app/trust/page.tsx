'use client'

import React from 'react';
import './trust.css';
import Footer from '../../components/ui/Footer';

export default function TrustPage() {
  return (
    <div className="trust-page">
      {/* Hero Section */}
      <section className="trust-hero">
        <div className="container">
          <div className="trust-badge">BITCOIN ORDINALS TOKEN</div>
          <h1 className="trust-title">
            The <span className="gradient-text">$bWriter Trust</span>
          </h1>
          <p className="trust-description">
            A BSV21 ordinals token representing ownership stake in the Bitcoin Writer ecosystem. 
            Built on Bitcoin's most scalable blockchain with transparent, immutable governance.
          </p>
          <div className="trust-buttons">
            <button 
              className="btn-primary" 
              onClick={() => window.open('https://1sat.market/market/bsv21/cff66b3f44c6a31a0b3f09d24785b1baa87e96bd1fb0d6c4d2fb6158130ddae4_1', '_blank')}
            >
              <span>View on 1Sat Market</span>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6m4-3h6v6m-11 5L21 3" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              </svg>
            </button>
            <button className="btn-secondary" onClick={() => window.location.href = '/exchange'}>
              Trade BWRITER Tokens
            </button>
          </div>
          
          {/* Token Stats */}
          <div className="token-stats">
            <div className="stat">
              <span className="stat-value">BSV21</span>
              <span className="stat-label">Token Standard</span>
            </div>
            <div className="stat">
              <span className="stat-value">Limited</span>
              <span className="stat-label">Supply</span>
            </div>
            <div className="stat">
              <span className="stat-value">Ordinals</span>
              <span className="stat-label">Protocol</span>
            </div>
          </div>
        </div>
      </section>

      {/* What is the Trust */}
      <section className="trust-about">
        <div className="container">
          <div className="about-grid">
            <div className="about-content">
              <h2>What is the $bWriter Trust?</h2>
              <p>
                The $bWriter Trust is a BSV21 ordinals token that represents fractional ownership 
                in the Bitcoin Writer ecosystem. Built on Bitcoin SV, each token provides holders 
                with governance rights and revenue participation in the platform's growth.
              </p>
              <div className="trust-features">
                <div className="feature-item">
                  <div className="feature-icon">🏛️</div>
                  <div>
                    <h4>Governance Rights</h4>
                    <p>Vote on platform decisions, feature prioritization, and ecosystem development</p>
                  </div>
                </div>
                <div className="feature-item">
                  <div className="feature-icon">💰</div>
                  <div>
                    <h4>Revenue Sharing</h4>
                    <p>Receive proportional dividends from platform fees and premium services</p>
                  </div>
                </div>
                <div className="feature-item">
                  <div className="feature-icon">🔒</div>
                  <div>
                    <h4>Immutable Ownership</h4>
                    <p>Bitcoin ordinals ensure permanent, transparent, and transferable ownership</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="about-visual">
              <div className="token-card">
                <div className="token-header">
                  <div className="token-logo">₿</div>
                  <div className="token-info">
                    <h3>$bWriter Trust</h3>
                    <p>BSV21 Ordinals Token</p>
                  </div>
                </div>
                <div className="token-id">
                  <span>Token ID:</span>
                  <span className="token-hash">cff66b3f...130ddae4_1</span>
                </div>
                <div className="token-details">
                  <div className="detail-row">
                    <span>Standard:</span>
                    <span>BSV21</span>
                  </div>
                  <div className="detail-row">
                    <span>Blockchain:</span>
                    <span>Bitcoin SV</span>
                  </div>
                  <div className="detail-row">
                    <span>Type:</span>
                    <span>Governance Token</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="trust-how-it-works">
        <div className="container">
          <h2>How the Trust Works</h2>
          <div className="steps-grid">
            <div className="step-card">
              <div className="step-number">01</div>
              <h3>Acquire Tokens</h3>
              <p>Purchase $bWriter Trust tokens on 1Sat Market or through direct trades</p>
            </div>
            <div className="step-card">
              <div className="step-number">02</div>
              <h3>Participate in Governance</h3>
              <p>Use your tokens to vote on platform proposals and development decisions</p>
            </div>
            <div className="step-card">
              <div className="step-number">03</div>
              <h3>Earn Dividends</h3>
              <p>Receive regular distributions based on platform revenue and your token holdings</p>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits for Holders */}
      <section className="trust-benefits">
        <div className="container">
          <div className="benefits-grid">
            <div className="benefits-content">
              <h2>Trust Token Benefits</h2>
              <div className="benefits-list">
                <div className="benefit-item">
                  <div className="benefit-icon">🗳️</div>
                  <div>
                    <h4>Democratic Governance</h4>
                    <p>Shape the future of Bitcoin Writer through transparent, on-chain voting</p>
                  </div>
                </div>
                <div className="benefit-item">
                  <div className="benefit-icon">📈</div>
                  <div>
                    <h4>Platform Growth Rewards</h4>
                    <p>Benefit directly from increased platform usage and revenue growth</p>
                  </div>
                </div>
                <div className="benefit-item">
                  <div className="benefit-icon">🌍</div>
                  <div>
                    <h4>Global Liquidity</h4>
                    <p>Trade your tokens 24/7 on Bitcoin ordinals marketplaces worldwide</p>
                  </div>
                </div>
                <div className="benefit-item">
                  <div className="benefit-icon">🛡️</div>
                  <div>
                    <h4>Bitcoin Security</h4>
                    <p>Backed by Bitcoin's proof-of-work security and immutable ledger</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="benefits-visual">
              <div className="governance-card">
                <h3>Recent Governance Proposals</h3>
                <div className="proposal-list">
                  <div className="proposal-item">
                    <span className="proposal-title">Implement AI Writing Assistant</span>
                    <span className="proposal-status passed">Passed</span>
                  </div>
                  <div className="proposal-item">
                    <span className="proposal-title">Expand to Multi-chain</span>
                    <span className="proposal-status active">Voting</span>
                  </div>
                  <div className="proposal-item">
                    <span className="proposal-title">Revenue Distribution Model</span>
                    <span className="proposal-status pending">Pending</span>
                  </div>
                </div>
                <div className="voting-power">
                  <span>Your Voting Power: <strong>0.00%</strong></span>
                  <button className="connect-wallet-btn">Connect Wallet</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Technical Details */}
      <section className="trust-technical">
        <div className="container">
          <h2>Technical Specifications</h2>
          <div className="technical-grid">
            <div className="tech-card">
              <div className="tech-icon">⚡</div>
              <h3>BSV21 Standard</h3>
              <p>Built on Bitcoin SV's scalable blockchain with instant transactions and micro-fees</p>
            </div>
            <div className="tech-card">
              <div className="tech-icon">🎨</div>
              <h3>Ordinals Protocol</h3>
              <p>Each token is a unique ordinal inscription, making it truly non-fungible and collectible</p>
            </div>
            <div className="tech-card">
              <div className="tech-icon">🔍</div>
              <h3>Full Transparency</h3>
              <p>All transactions and governance decisions are permanently recorded on-chain</p>
            </div>
            <div className="tech-card">
              <div className="tech-icon">🌐</div>
              <h3>Cross-Platform Trading</h3>
              <p>Compatible with all BSV ordinals wallets and marketplaces</p>
            </div>
          </div>
        </div>
      </section>

      {/* How to Get Started */}
      <section className="trust-get-started">
        <div className="container">
          <div className="get-started-content">
            <h2>Ready to Join the Trust?</h2>
            <p>Start participating in Bitcoin Writer's governance and revenue sharing today</p>
            <div className="getting-started-steps">
              <div className="start-step">
                <span className="step-num">1</span>
                <span>Set up a BSV ordinals wallet</span>
              </div>
              <div className="start-step">
                <span className="step-num">2</span>
                <span>Visit 1Sat Market to purchase tokens</span>
              </div>
              <div className="start-step">
                <span className="step-num">3</span>
                <span>Connect your wallet to start voting</span>
              </div>
            </div>
            <div className="cta-buttons">
              <button 
                className="btn-primary" 
                onClick={() => window.open('https://1sat.market/market/bsv21/cff66b3f44c6a31a0b3f09d24785b1baa87e96bd1fb0d6c4d2fb6158130ddae4_1', '_blank')}
              >
                Buy $bWriter Trust Tokens
              </button>
              <button className="btn-secondary" onClick={() => window.location.href = '/docs'}>
                Read Documentation
              </button>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}