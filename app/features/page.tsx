'use client'

import React from 'react';
import './features.css';
import Footer from '../../components/ui/Footer';

export default function FeaturesPage() {
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
                  <path d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" stroke="currentColor" strokeWidth="2"/>
                </svg>
              </div>
              <h3>Instant Micropayments</h3>
              <p>Get paid immediately as readers consume your content through Bitcoin micropayments</p>
            </div>

            <div className="feature-card">
              <div className="feature-icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <path d="M8 7v8a2 2 0 002 2h6M8 7V5a2 2 0 012-2h4.586a1 1 0 01.707.293l4.414 4.414a1 1 0 01.293.707V15a2 2 0 01-2 2h-2M8 7H6a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2v-2" stroke="currentColor" strokeWidth="2"/>
                </svg>
              </div>
              <h3>Multi-Authoring</h3>
              <p>Collaborate on documents with multiple authors and track individual contributions</p>
            </div>

            <div className="feature-card">
              <div className="feature-icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <path d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" stroke="currentColor" strokeWidth="2"/>
                </svg>
              </div>
              <h3>Content Encryption</h3>
              <p>Protect your work with blockchain-based encryption and controlled access</p>
            </div>

            <div className="feature-card">
              <div className="feature-icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <path d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" stroke="currentColor" strokeWidth="2"/>
                </svg>
              </div>
              <h3>NFT Documents</h3>
              <p>Turn your best work into tradeable NFTs on Bitcoin with built-in royalties</p>
            </div>
          </div>
        </div>
      </section>

      {/* Writer Benefits */}
      <section className="writer-benefits">
        <div className="container">
          <div className="benefits-grid">
            <div className="benefits-content">
              <h2>Built for Professional Writers</h2>
              <div className="benefits-list">
                <div className="benefit-item">
                  <div className="benefit-icon">💰</div>
                  <div>
                    <h4>Multiple Revenue Streams</h4>
                    <p>Contract work, micropayment content, NFT sales, and royalties</p>
                  </div>
                </div>
                <div className="benefit-item">
                  <div className="benefit-icon">⚡</div>
                  <div>
                    <h4>Instant Global Payments</h4>
                    <p>No waiting 30 days - get paid the moment your work is accepted</p>
                  </div>
                </div>
                <div className="benefit-item">
                  <div className="benefit-icon">🔒</div>
                  <div>
                    <h4>Permanent Proof of Work</h4>
                    <p>Every piece is timestamped on Bitcoin - no one can steal your ideas</p>
                  </div>
                </div>
                <div className="benefit-item">
                  <div className="benefit-icon">🌍</div>
                  <div>
                    <h4>Global Marketplace</h4>
                    <p>Connect with publishers worldwide without intermediaries</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="benefits-visual">
              <div className="benefits-card">
                <h3>Example Contract</h3>
                <div className="contract-details">
                  <div className="contract-item">
                    <span>Type:</span>
                    <span>Blog Article</span>
                  </div>
                  <div className="contract-item">
                    <span>Words:</span>
                    <span>1,500</span>
                  </div>
                  <div className="contract-item">
                    <span>Payment:</span>
                    <span className="payment-amount">$300</span>
                  </div>
                  <div className="contract-item">
                    <span>Deadline:</span>
                    <span>3 days</span>
                  </div>
                </div>
                <button className="apply-btn">Apply Now</button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Publisher Benefits */}
      <section className="publisher-benefits">
        <div className="container">
          <div className="benefits-grid reverse">
            <div className="benefits-visual">
              <div className="publisher-dashboard">
                <h3>Publisher Dashboard</h3>
                <div className="dashboard-stats">
                  <div className="dashboard-stat">
                    <span className="stat-value">15</span>
                    <span className="stat-label">Active Contracts</span>
                  </div>
                  <div className="dashboard-stat">
                    <span className="stat-value">42</span>
                    <span className="stat-label">Writers Applied</span>
                  </div>
                  <div className="dashboard-stat">
                    <span className="stat-value">$2.1K</span>
                    <span className="stat-label">In Escrow</span>
                  </div>
                </div>
                <div className="recent-contracts">
                  <div className="contract-row">
                    <span>Tech Tutorial</span>
                    <span className="status completed">Completed</span>
                  </div>
                  <div className="contract-row">
                    <span>Product Review</span>
                    <span className="status in-progress">In Progress</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="benefits-content">
              <h2>Perfect for Publishers</h2>
              <div className="benefits-list">
                <div className="benefit-item">
                  <div className="benefit-icon">🎯</div>
                  <div>
                    <h4>Quality Guaranteed</h4>
                    <p>All writers are rated and their work is blockchain-verified</p>
                  </div>
                </div>
                <div className="benefit-item">
                  <div className="benefit-icon">⚖️</div>
                  <div>
                    <h4>Smart Escrow</h4>
                    <p>Payments are held safely until work meets your standards</p>
                  </div>
                </div>
                <div className="benefit-item">
                  <div className="benefit-icon">📈</div>
                  <div>
                    <h4>Transparent Pricing</h4>
                    <p>Set your budget and let writers compete for your project</p>
                  </div>
                </div>
                <div className="benefit-item">
                  <div className="benefit-icon">🤝</div>
                  <div>
                    <h4>Direct Relationships</h4>
                    <p>Build lasting partnerships with your favorite writers</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Ecosystem Stats */}
      <section className="ecosystem-stats">
        <div className="container">
          <h2>Growing Ecosystem</h2>
          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-icon">📝</div>
              <div className="stat-number">12,847</div>
              <div className="stat-label">Documents Created</div>
            </div>
            <div className="stat-card">
              <div className="stat-icon">💰</div>
              <div className="stat-number">$127K</div>
              <div className="stat-label">Total Paid Out</div>
            </div>
            <div className="stat-card">
              <div className="stat-icon">👥</div>
              <div className="stat-number">2,156</div>
              <div className="stat-label">Active Writers</div>
            </div>
            <div className="stat-card">
              <div className="stat-icon">🏢</div>
              <div className="stat-number">342</div>
              <div className="stat-label">Publishers</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="container">
          <div className="cta-content">
            <h2>Ready to Start Earning?</h2>
            <p>Join thousands of writers already making money on Bitcoin Writer</p>
            <div className="cta-buttons">
              <button className="btn-primary" onClick={() => window.location.href = '/'}>
                Start Writing Free
              </button>
              <button className="btn-secondary" onClick={() => window.location.href = '/grants'}>
                Browse Grants
              </button>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}