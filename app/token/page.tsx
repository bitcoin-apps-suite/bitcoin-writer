'use client'

import React from 'react';
import './TokenPage.css';
import Footer from '../../components/ui/Footer';

export default function TokenPage() {
  return (
    <div className="token-page">
      <div className="token-container">
        {/* Hero Section */}
        <section className="token-hero">
          <h1><span style={{color: '#ffffff'}}>The</span> Bitcoin Writer <span style={{color: '#ffffff'}}>Token</span></h1>
          <p className="token-tagline">
            Open-source development meets sustainable economics
          </p>
          <div className="token-badge">$BWRITER</div>
        </section>

        {/* Philosophy Section */}
        <section className="philosophy-section">
          <h2>Our Open-Source Philosophy</h2>
          <div className="philosophy-content">
            <p>
              Bitcoin Writer is an <strong>open-source project</strong> licensed under MIT and BSV licenses. 
              Our intention is to foster an open culture where forking, cloning, and adding to the code 
              and features is welcomed and encouraged.
            </p>
            <p>
              However, <strong>open-source development requires sustainable funding</strong>. The BWRITER token 
              creates a mechanism for contributors to be rewarded for their work while keeping the project 
              completely free and open.
            </p>
          </div>
        </section>

        {/* Token Economics */}
        <section className="tokenomics-section">
          <h2>Token Economics</h2>
          <div className="tokenomics-grid">
            <div className="tokenomics-card">
              <h3>💰 Total Supply</h3>
              <div className="big-number">21,000,000</div>
              <p>Fixed supply matching Bitcoin's 21M cap</p>
            </div>
            
            <div className="tokenomics-card">
              <h3>⚡ Distribution</h3>
              <div className="distribution-list">
                <div className="distribution-item">
                  <span>Community & Contributors</span>
                  <span>60%</span>
                </div>
                <div className="distribution-item">
                  <span>Development Fund</span>
                  <span>25%</span>
                </div>
                <div className="distribution-item">
                  <span>Initial Team</span>
                  <span>15%</span>
                </div>
              </div>
            </div>

            <div className="tokenomics-card">
              <h3>📈 Utility</h3>
              <ul>
                <li>Governance voting rights</li>
                <li>Premium feature access</li>
                <li>Revenue sharing from platform fees</li>
                <li>Contributor rewards</li>
              </ul>
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section className="how-works-section">
          <h2>How Token Rewards Work</h2>
          <div className="how-works-grid">
            <div className="step-card">
              <div className="step-number">1</div>
              <h3>Contribute</h3>
              <p>Submit code, documentation, designs, or other valuable contributions</p>
            </div>
            <div className="step-card">
              <div className="step-number">2</div>
              <h3>Review</h3>
              <p>Community reviews and approves contributions through our governance process</p>
            </div>
            <div className="step-card">
              <div className="step-number">3</div>
              <h3>Earn</h3>
              <p>Receive BWRITER tokens based on the value and impact of your contribution</p>
            </div>
          </div>
        </section>

        {/* Value Proposition */}
        <section className="value-section">
          <h2>Why BWRITER Has Value</h2>
          <div className="value-grid">
            <div className="value-card">
              <div className="value-icon">🚀</div>
              <h3>Platform Growth</h3>
              <p>As Bitcoin Writer grows, token demand increases through platform usage and premium features</p>
            </div>
            
            <div className="value-card">
              <div className="value-icon">💸</div>
              <h3>Revenue Sharing</h3>
              <p>Token holders receive a percentage of platform transaction fees and premium subscriptions</p>
            </div>
            
            <div className="value-card">
              <div className="value-icon">🏛️</div>
              <h3>Governance Power</h3>
              <p>Vote on new features, funding allocation, and platform direction</p>
            </div>
            
            <div className="value-card">
              <div className="value-icon">⭐</div>
              <h3>Premium Access</h3>
              <p>Unlock advanced features, analytics, and priority support</p>
            </div>
          </div>
        </section>

        {/* Roadmap */}
        <section className="roadmap-section">
          <h2>Token Launch Roadmap</h2>
          <div className="roadmap-timeline">
            <div className="timeline-item completed">
              <div className="timeline-marker"></div>
              <div className="timeline-content">
                <h3>Phase 1: Foundation</h3>
                <p>Core platform development, initial community building</p>
                <span className="timeline-status">✅ Completed</span>
              </div>
            </div>
            
            <div className="timeline-item current">
              <div className="timeline-marker"></div>
              <div className="timeline-content">
                <h3>Phase 2: Token Creation</h3>
                <p>BWRITER token launch, initial distribution to early contributors</p>
                <span className="timeline-status">🚀 Current</span>
              </div>
            </div>
            
            <div className="timeline-item">
              <div className="timeline-marker"></div>
              <div className="timeline-content">
                <h3>Phase 3: Governance</h3>
                <p>DAO formation, community voting implementation</p>
                <span className="timeline-status">⏳ Q2 2024</span>
              </div>
            </div>
            
            <div className="timeline-item">
              <div className="timeline-marker"></div>
              <div className="timeline-content">
                <h3>Phase 4: Expansion</h3>
                <p>Exchange listings, institutional partnerships, global scaling</p>
                <span className="timeline-status">📅 Q4 2024</span>
              </div>
            </div>
          </div>
        </section>

        {/* Contributors */}
        <section className="contributors-section">
          <h2>Current Contributors</h2>
          <p>These community members have earned BWRITER tokens for their contributions:</p>
          <div className="contributors-grid">
            <div className="contributor-card">
              <div className="contributor-avatar">BC</div>
              <h4>Bitcoin Corporation</h4>
              <p>Core Development</p>
              <div className="contribution-badge">🏗️ Founder</div>
            </div>
            
            <div className="contributor-card">
              <div className="contributor-avatar">OS</div>
              <h4>Open Source Community</h4>
              <p>Various Contributions</p>
              <div className="contribution-badge">👥 125 Contributors</div>
            </div>
            
            <div className="contributor-card">
              <div className="contributor-avatar">YN</div>
              <h4>Your Name Here</h4>
              <p>Future Contributor</p>
              <div className="contribution-badge">⭐ Join Us</div>
            </div>
          </div>
        </section>

        {/* Get Started */}
        <section className="get-started-section">
          <h2>Start Contributing Today</h2>
          <p>Ready to earn BWRITER tokens for your contributions?</p>
          <div className="cta-buttons">
            <button className="btn-primary" onClick={() => window.location.href = '/contributions'}>
              View Open Tasks
            </button>
            <button className="btn-secondary" onClick={() => window.location.href = 'https://github.com/bitcoin-writer'}>
              GitHub Repository
            </button>
          </div>
        </section>
      </div>
      <Footer />
    </div>
  );
}