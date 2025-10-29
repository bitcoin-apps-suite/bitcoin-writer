'use client'

import React from 'react';
import './prd.css';

export default function PRDPage() {
  return (
    <div className="App">
      <div className="prd-page">
        <div className="prd-container">
          {/* Hero Section */}
          <section className="prd-hero">
            <h1><span style={{color: '#ffffff'}}>Bitcoin Writer</span> <span style={{color: '#f7931a'}}>Product Requirements</span></h1>
            <p className="prd-tagline">
              Comprehensive product specification for the decentralized writing platform
            </p>
            <div className="prd-badge">PRD v1.0</div>
          </section>

          {/* Main Content */}
          
          {/* Executive Summary */}
          <section className="overview-section">
            <h2>Executive Summary</h2>
            <div className="overview-content">
              <p>
                Bitcoin Writer is a <strong>blockchain-integrated writing platform</strong> developed by The Bitcoin Corporation LTD that enables content creators to write, 
                collaborate, and monetize their work using Bitcoin blockchain technology. The platform provides professional 
                writing tools, automatic content hashing for proof of authorship, smart contract-based publishing agreements, 
                and instant micropayment capabilities.
              </p>
              <p>
                Our vision is to create a comprehensive blockchain-native writing platform where creators can prove ownership 
                of their content, get paid instantly through Bitcoin, and build sustainable revenue streams with reduced platform fees.
              </p>
              <div className="overview-points">
                <div className="point">
                  <h3>Vision</h3>
                  <p>Blockchain-integrated platform for content creation and monetization</p>
                </div>
                <div className="point">
                  <h3>Mission</h3>
                  <p>Empower writers with professional tools and direct monetization</p>
                </div>
                <div className="point">
                  <h3>Company</h3>
                  <p>Product of The Bitcoin Corporation LTD, building on Bitcoin infrastructure</p>
                </div>
              </div>
            </div>
          </section>

          {/* Core Features */}
          <section className="features-section">
            <h2>Core Features</h2>
            <div className="feature-model">
              
              <div className="model-card">
                <h3>Document Creation & Management</h3>
                <ul>
                  <li>
                    <strong>Rich Text Editor:</strong> Quill-based WYSIWYG editor with advanced formatting, 
                    auto-save functionality, and real-time collaboration
                  </li>
                  <li>
                    <strong>Version Control:</strong> Git-style Work Tree functionality with document 
                    versioning and rollback capabilities
                  </li>
                  <li>
                    <strong>Multi-format Support:</strong> Import/export Word, HTML, Markdown, PDF 
                    with seamless conversion
                  </li>
                  <li>
                    <strong>Image Management:</strong> Inline image insertion with blockchain storage 
                    and cost optimization
                  </li>
                </ul>
              </div>

              <div className="model-card">
                <h3>Blockchain Integration</h3>
                <ul>
                  <li>
                    <strong>Content Hashing:</strong> Automatic SHA-256 hashing to Bitcoin for 
                    permanent proof of authorship and timestamping
                  </li>
                  <li>
                    <strong>Smart Storage:</strong> Multiple storage options including BSV blockchain, 
                    encrypted content, and scheduled publication
                  </li>
                  <li>
                    <strong>Cost Estimation:</strong> Real-time pricing based on content size 
                    (~$0.00000001-0.01 per document)
                  </li>
                  <li>
                    <strong>Permanent Storage:</strong> Immutable content preservation on Bitcoin 
                    blockchain with global accessibility
                  </li>
                </ul>
              </div>

              <div className="model-card">
                <h3>Monetization Features</h3>
                <ul>
                  <li>
                    <strong>Smart Contracts:</strong> Publisher-writer contract system with automatic 
                    escrow and payment release upon completion
                  </li>
                  <li>
                    <strong>Micropayments:</strong> Pay-per-read content monetization with instant 
                    Bitcoin settlements and reader analytics
                  </li>
                  <li>
                    <strong>NFT Creation:</strong> Convert documents to tradeable Bitcoin OS assets 
                    with built-in royalty mechanisms
                  </li>
                  <li>
                    <strong>Grant System:</strong> Community-funded writing opportunities with 
                    transparent allocation and tracking
                  </li>
                </ul>
              </div>
            </div>
          </section>

          {/* Technical Architecture */}
          <section className="architecture-section">
            <h2>Technical Architecture</h2>
            <div className="architecture-content">
              <p className="intro">
                Bitcoin Writer is built on a modern technology stack that combines traditional web development 
                practices with cutting-edge blockchain integration for permanent content storage and micropayments.
              </p>

              <div className="architecture-model">
                <h3>Technology Stack</h3>
                <div className="tech-streams">
                  <div className="stream">
                    <h4>Frontend</h4>
                    <p>Next.js 15.5.5 with React 18</p>
                    <p className="tech-detail">Quill.js Editor</p>
                  </div>
                  <div className="stream featured">
                    <h4>Blockchain</h4>
                    <p>Bitcoin SV (BSV) for storage</p>
                    <p className="tech-detail">HandCash Integration</p>
                  </div>
                  <div className="stream">
                    <h4>Backend</h4>
                    <p>Node.js with Express</p>
                    <p className="tech-detail">AI Service APIs</p>
                  </div>
                </div>
                
                <h3 style={{marginTop: '40px'}}>Storage & Costs</h3>
                <div className="tech-streams">
                  <div className="stream">
                    <h4>Local Storage</h4>
                    <p>Browser localStorage for drafts</p>
                    <p className="tech-detail">Free</p>
                  </div>
                  <div className="stream featured">
                    <h4>Blockchain Storage</h4>
                    <p>Permanent BSV storage</p>
                    <p className="tech-detail">~$0.05/KB</p>
                  </div>
                  <div className="stream">
                    <h4>Encrypted Storage</h4>
                    <p>AES-256 encrypted content</p>
                    <p className="tech-detail">+10% premium</p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* User Personas */}
          <section className="personas-section">
            <h2>Target Users</h2>
            <div className="personas-steps">
              <div className="step">
                <div className="step-number">1</div>
                <h3>Professional Writers</h3>
                <p>Freelance writers seeking secure payments, content ownership, and new revenue streams</p>
              </div>
              <div className="step">
                <div className="step-number">2</div>
                <h3>Content Publishers</h3>
                <p>Agencies and publications looking for quality writers with transparent project management</p>
              </div>
              <div className="step">
                <div className="step-number">3</div>
                <h3>Blockchain Enthusiasts</h3>
                <p>Early adopters experimenting with Web3 content creation and micropayment systems</p>
              </div>
              <div className="step">
                <div className="step-number">4</div>
                <h3>Content Creators</h3>
                <p>Artists and creators wanting to tokenize their work and build sustainable income</p>
              </div>
            </div>

            <div className="persona-examples">
              <h3>User Journey Examples</h3>
              <ul>
                <li>✅ Freelance writer completes $500 contract, gets paid instantly</li>
                <li>✅ Publisher finds verified writer, project completed on-time</li>
                <li>✅ Creator tokenizes popular article, earns ongoing royalties</li>
                <li>✅ Reader pays $0.01 to unlock premium content via micropayment</li>
                <li>✅ Collaborative document with 3 authors, revenue auto-split</li>
                <li>✅ Academic paper timestamped on blockchain for IP protection</li>
              </ul>
            </div>
          </section>

          {/* Revenue Model */}
          <section className="revenue-section">
            <h2>The Bitcoin Writer Business Model</h2>
            <div className="revenue-content">
              <p className="intro">
                Our revenue model balances platform sustainability with creator value, ensuring writers 
                keep the majority of their earnings while supporting ongoing development and infrastructure.
              </p>

              <div className="revenue-model">
                <h3>Revenue Streams</h3>
                <div className="revenue-streams">
                  <div className="stream">
                    <h4>Storage Fees</h4>
                    <p>2x markup on blockchain costs</p>
                    <p className="price">40% of revenue</p>
                  </div>
                  <div className="stream featured">
                    <h4>Contract Fees</h4>
                    <p>5% commission on completed work</p>
                    <p className="price">25% of revenue</p>
                  </div>
                  <div className="stream">
                    <h4>Premium Features</h4>
                    <p>AI tools, analytics, priority support</p>
                    <p className="price">20% of revenue</p>
                  </div>
                </div>
                
                <h3 style={{marginTop: '40px'}}>Marketplace Revenue</h3>
                <div className="revenue-streams">
                  <div className="stream">
                    <h4>NFT Sales</h4>
                    <p>Document tokenization marketplace</p>
                    <p className="price">2.5% fee</p>
                  </div>
                  <div className="stream featured">
                    <h4>Micropayments</h4>
                    <p>Pay-per-read content processing</p>
                    <p className="price">1% fee</p>
                  </div>
                  <div className="stream">
                    <h4>Enterprise</h4>
                    <p>Custom solutions & white-label</p>
                    <p className="price">Custom pricing</p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Development Roadmap */}
          <section className="roadmap-section">
            <h2>Development Roadmap</h2>
            <div className="roadmap-timeline">
              <div className="timeline-item completed">
                <div className="timeline-marker"></div>
                <div className="timeline-content">
                  <h3>Phase 1: Core Platform</h3>
                  <p>Document editor with blockchain storage, HandCash authentication, basic contract system, micropayment integration, and NFT asset creation.</p>
                  <div className="timeline-status">✅ Completed</div>
                </div>
              </div>
              
              <div className="timeline-item current">
                <div className="timeline-marker"></div>
                <div className="timeline-content">
                  <h3>Phase 2: Enhanced Features</h3>
                  <p>Advanced collaboration tools, mobile application, enhanced AI integration, analytics dashboard, and enterprise features.</p>
                  <div className="timeline-status">🚧 Q1 2025</div>
                </div>
              </div>
              
              <div className="timeline-item">
                <div className="timeline-marker"></div>
                <div className="timeline-content">
                  <h3>Phase 3: Ecosystem Expansion</h3>
                  <p>Multi-blockchain support, advanced publishing tools, community governance, plugin ecosystem, and international expansion.</p>
                  <div className="timeline-status">📅 Q2 2025</div>
                </div>
              </div>
              
              <div className="timeline-item">
                <div className="timeline-marker"></div>
                <div className="timeline-content">
                  <h3>Phase 4: Platform Maturity</h3>
                  <p>Advanced analytics, ML recommendations, institutional partnerships, regulatory compliance tools, and global scaling.</p>
                  <div className="timeline-status">🎯 Q3-Q4 2025</div>
                </div>
              </div>
            </div>
          </section>

          {/* Success Metrics */}
          <section className="metrics-section">
            <h2>Success Metrics</h2>
            <div className="metrics-grid">
              <div className="stat">
                <h3>Users</h3>
                <p className="stat-value">10K+</p>
                <p className="stat-label">Monthly Active Writers</p>
              </div>
              <div className="stat">
                <h3>Revenue</h3>
                <p className="stat-value">$50K</p>
                <p className="stat-label">Monthly platform revenue</p>
              </div>
              <div className="stat">
                <h3>Content</h3>
                <p className="stat-value">25K</p>
                <p className="stat-label">Documents on blockchain</p>
              </div>
              <div className="stat">
                <h3>Contracts</h3>
                <p className="stat-value">95%</p>
                <p className="stat-label">Completion rate</p>
              </div>
            </div>
          </section>

          {/* Competitive Analysis */}
          <section className="competitive-section">
            <h2>Competitive Analysis</h2>
            <div class="competitive-content">
              <p class="intro">
                Bitcoin Writer differentiates from traditional platforms by leveraging Bitcoin blockchain for content 
                timestamping, instant micropayments, and reduced platform fees compared to centralized alternatives.
              </p>
              
              <div class="competitive-model">
                <h3>Traditional Platforms vs Bitcoin Writer</h3>
                <div class="comparison-streams">
                  <div class="stream">
                    <h4>Medium</h4>
                    <p>Centralized, limited monetization</p>
                    <p class="comparison-detail">No ownership</p>
                  </div>
                  <div class="stream">
                    <h4>Substack</h4>
                    <p>Newsletter-focused, subscriptions</p>
                    <p class="comparison-detail">Platform dependent</p>
                  </div>
                  <div class="stream featured">
                    <h4>Bitcoin Writer</h4>
                    <p>Blockchain ownership, instant payments</p>
                    <p class="comparison-detail">True ownership</p>
                  </div>
                </div>
              </div>
              
              <div class="advantages">
                <h3>Our Competitive Advantages</h3>
                <ul>
                  <li>✅ <strong>Blockchain Timestamping:</strong> Proof of authorship and creation date on Bitcoin</li>
                  <li>✅ <strong>Instant Bitcoin Payments:</strong> Direct writer payments via HandCash integration</li>
                  <li>✅ <strong>Smart Contract Escrow:</strong> Automated payment release for completed work</li>
                  <li>✅ <strong>Permanent Content Storage:</strong> Optional blockchain storage for important documents</li>
                  <li>✅ <strong>Multiple Revenue Streams:</strong> Contracts, micropayments, NFTs, royalties</li>
                </ul>
              </div>
            </div>
          </section>

          {/* Risk Assessment */}
          <section className="risks-section">
            <h2>Risk Assessment & Mitigation</h2>
            <div class="risks-content">
              <div class="model-card">
                <h3>Technical Risks</h3>
                <ul>
                  <li>
                    <strong>Blockchain Scalability:</strong> BSV transaction capacity limitations could 
                    affect platform growth. Mitigation: Multi-blockchain architecture for scalability.
                  </li>
                  <li>
                    <strong>Cost Volatility:</strong> Bitcoin price fluctuations affecting storage costs. 
                    Mitigation: Transparent pricing with real-time cost predictions.
                  </li>
                  <li>
                    <strong>Integration Complexity:</strong> Third-party API dependencies may create 
                    service disruptions. Mitigation: Redundant service providers and local caching.
                  </li>
                </ul>
              </div>
              
              <div class="model-card warning">
                <h3>Market & Regulatory Risks</h3>
                <ul>
                  <li>
                    <strong>Adoption Barriers:</strong> Cryptocurrency learning curve for traditional users. 
                    Mitigation: Simplified onboarding and guest mode functionality.
                  </li>
                  <li>
                    <strong>Regulatory Changes:</strong> Potential restrictions on blockchain applications. 
                    Mitigation: Compliance monitoring and legal framework adherence.
                  </li>
                  <li>
                    <strong>Competition:</strong> Large platforms adding similar blockchain features. 
                    Mitigation: Continuous innovation and first-mover advantages.
                  </li>
                </ul>
              </div>
            </div>
          </section>

          {/* CTA Section */}
          <section className="cta-section">
            <h2>Ready to Build the Future of Writing?</h2>
            <div className="cta-buttons">
              <a 
                href="/" 
                className="cta-btn primary"
              >
                Start Writing Now
              </a>
              <a 
                href="/features" 
                className="cta-btn secondary"
              >
                Explore Features
              </a>
            </div>
          </section>

        </div>
      </div>
    </div>
  );
}