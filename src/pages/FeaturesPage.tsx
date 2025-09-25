import React from 'react';
import './FeaturesPage.css';
import Footer from '../components/Footer';

const FeaturesPage: React.FC = () => {
  return (
    <div className="features-page">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="container">
          <div className="hero-badge">DECENTRALIZED WRITING PLATFORM</div>
          <h1 className="hero-title">
            Write, Collaborate, <br />
            <span className="gradient-text">Earn on Bitcoin</span>
          </h1>
          <p className="hero-description">
            Transform your words into permanent digital assets. Create contracts, 
            collaborate with authors, and get paid instantly through Bitcoin micropayments.
          </p>
          <div className="hero-buttons">
            <button className="btn-primary" onClick={() => window.location.href = '/'}>
              <span>Start Writing</span>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <path d="M5 12h14m-7-7l7 7-7 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              </svg>
            </button>
            <button className="btn-secondary" onClick={() => window.location.href = '/contracts'}>
              Browse Contracts
            </button>
          </div>
          <div className="hero-stats">
            <div className="stat">
              <span className="stat-value">1M+</span>
              <span className="stat-label">BWRITER Tokens</span>
            </div>
            <div className="stat">
              <span className="stat-value">50+</span>
              <span className="stat-label">Active Contracts</span>
            </div>
            <div className="stat">
              <span className="stat-value">$100K+</span>
              <span className="stat-label">Paid to Writers</span>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="how-it-works">
        <div className="container">
          <h2>How Bitcoin Writer Works</h2>
          <div className="steps-grid">
            <div className="step-card">
              <div className="step-number">01</div>
              <h3>Write & Hash</h3>
              <p>Create content and automatically hash it to Bitcoin for permanent proof of authorship</p>
            </div>
            <div className="step-card">
              <div className="step-number">02</div>
              <h3>Smart Contracts</h3>
              <p>Publishers create contracts, writers fulfill them, payments release automatically</p>
            </div>
            <div className="step-card">
              <div className="step-number">03</div>
              <h3>Instant Payments</h3>
              <p>Receive micropayments instantly through HandCash or Bitcoin wallets</p>
            </div>
          </div>
        </div>
      </section>

      {/* Core Features */}
      <section className="core-features">
        <div className="container">
          <div className="section-header">
            <h2>Everything Writers Need</h2>
            <p>Professional tools powered by blockchain technology</p>
          </div>
          
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <path d="M9 12h6m-3-3v6m5 5H7a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v12a2 2 0 01-2 2z" stroke="currentColor" strokeWidth="2"/>
                </svg>
              </div>
              <h3>Document Hashing</h3>
              <p>Every document gets a unique hash on Bitcoin, proving when and by whom it was created</p>
            </div>

            <div className="feature-card">
              <div className="feature-icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <path d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2z" stroke="currentColor" strokeWidth="2"/>
                </svg>
              </div>
              <h3>Smart Contracts</h3>
              <p>Create and fulfill writing contracts with automatic escrow and instant payment release</p>
            </div>

            <div className="feature-card">
              <div className="feature-icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <path d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" stroke="currentColor" strokeWidth="2"/>
                </svg>
              </div>
              <h3>BWRITER Tokens</h3>
              <p>Earn tokens for contributions, stake for governance, and trade on decentralized exchanges</p>
            </div>

            <div className="feature-card">
              <div className="feature-icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <path d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" stroke="currentColor" strokeWidth="2"/>
                </svg>
              </div>
              <h3>Multi-Author Collaboration</h3>
              <p>Work together in real-time with automatic contribution tracking and revenue sharing</p>
            </div>

            <div className="feature-card">
              <div className="feature-icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <path d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" stroke="currentColor" strokeWidth="2"/>
                </svg>
              </div>
              <h3>Immutable Proof</h3>
              <p>Your work is permanently recorded on Bitcoin, providing undeniable proof of authorship</p>
            </div>

            <div className="feature-card">
              <div className="feature-icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <path d="M13 10V3L4 14h7v7l9-11h-7z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <h3>Instant Publishing</h3>
              <p>Publish directly to the blockchain or export to traditional formats with verified authorship</p>
            </div>
          </div>
        </div>
      </section>

      {/* Contract Types */}
      <section className="contract-types">
        <div className="container">
          <h2>Contract Marketplace</h2>
          <p className="section-subtitle">Find work or commission writers through smart contracts</p>
          
          <div className="contracts-grid">
            <div className="contract-card">
              <div className="contract-header">
                <span className="contract-type">Writing Contracts</span>
                <span className="contract-count">12 Active</span>
              </div>
              <h3>Content Creation</h3>
              <p>Technical documentation, blog posts, whitepapers, and marketing copy</p>
              <ul>
                <li>✓ Fixed or hourly rates</li>
                <li>✓ Milestone payments</li>
                <li>✓ Quality bonuses</li>
              </ul>
              <button className="contract-btn" onClick={() => window.location.href = '/contracts'}>
                View Writing Jobs
              </button>
            </div>

            <div className="contract-card">
              <div className="contract-header">
                <span className="contract-type">Development</span>
                <span className="contract-count">30+ Tasks</span>
              </div>
              <h3>Platform Development</h3>
              <p>Help build Bitcoin Writer and earn BWRITER tokens for contributions</p>
              <ul>
                <li>✓ Frontend features</li>
                <li>✓ Smart contracts</li>
                <li>✓ API integrations</li>
              </ul>
              <button className="contract-btn" onClick={() => window.location.href = '/tasks'}>
                Browse Dev Tasks
              </button>
            </div>

            <div className="contract-card featured">
              <div className="contract-header">
                <span className="contract-type">Publisher Offers</span>
                <span className="contract-badge">NEW</span>
              </div>
              <h3>Commission Writers</h3>
              <p>Create custom contracts and find the perfect writer for your project</p>
              <ul>
                <li>✓ Escrow protection</li>
                <li>✓ Talent matching</li>
                <li>✓ Rights management</li>
              </ul>
              <button className="contract-btn primary" onClick={() => window.location.href = '/publisher/offer'}>
                Create Contract
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Technology Stack */}
      <section className="tech-stack">
        <div className="container">
          <h2>Built on Bitcoin</h2>
          <p className="section-subtitle">Leveraging the most secure blockchain for permanent storage</p>
          
          <div className="tech-grid">
            <div className="tech-item">
              <div className="tech-logo">BSV</div>
              <h4>Bitcoin SV</h4>
              <p>Unlimited scale for data storage</p>
            </div>
            <div className="tech-item">
              <div className="tech-logo">HC</div>
              <h4>HandCash</h4>
              <p>Simple Bitcoin payments</p>
            </div>
            <div className="tech-item">
              <div className="tech-logo">1SAT</div>
              <h4>1Sat Ordinals</h4>
              <p>Document versioning system</p>
            </div>
            <div className="tech-item">
              <div className="tech-logo">IPFS</div>
              <h4>IPFS</h4>
              <p>Distributed file storage</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="container">
          <div className="cta-content">
            <h2>Ready to Start Writing on Bitcoin?</h2>
            <p>Join the decentralized writing revolution. No fees to start, earn from day one.</p>
            <div className="cta-buttons">
              <button className="btn-primary large" onClick={() => window.location.href = '/'}>
                Launch Writer
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <path d="M13 7l5 5m0 0l-5 5m5-5H6" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                </svg>
              </button>
              <button className="btn-secondary large" onClick={() => window.location.href = '/docs'}>
                Read Documentation
              </button>
            </div>
          </div>
          <div className="cta-graphic">
            <div className="floating-card">
              <div className="card-icon">📝</div>
              <div className="card-text">Write</div>
            </div>
            <div className="floating-card delay-1">
              <div className="card-icon">⛓️</div>
              <div className="card-text">Hash</div>
            </div>
            <div className="floating-card delay-2">
              <div className="card-icon">💰</div>
              <div className="card-text">Earn</div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default FeaturesPage;