'use client'

import React from 'react';
import './prd.css';
import Footer from '../../components/ui/Footer';

export default function PRDPage() {
  return (
    <div className="prd-page">
      {/* Header */}
      <header className="prd-header">
        <div className="container">
          <div className="header-content">
            <h1>Bitcoin Writer</h1>
            <p className="subtitle">Product Requirements Document</p>
            <div className="version-info">
              <span>Version 1.0</span>
              <span>•</span>
              <span>October 29, 2025</span>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation */}
      <nav className="prd-nav">
        <div className="container">
          <ul className="nav-links">
            <li><a href="#overview">Overview</a></li>
            <li><a href="#features">Features</a></li>
            <li><a href="#architecture">Architecture</a></li>
            <li><a href="#personas">Users</a></li>
            <li><a href="#revenue">Revenue</a></li>
            <li><a href="#roadmap">Roadmap</a></li>
          </ul>
        </div>
      </nav>

      {/* Main Content */}
      <main className="prd-content">
        <div className="container">
          
          {/* Executive Summary */}
          <section id="overview" className="section">
            <h2>Executive Summary</h2>
            <div className="summary-grid">
              <div className="summary-card">
                <h3>Vision</h3>
                <p>Create the world's first blockchain-native writing platform where creators own their content, get paid instantly, and build sustainable revenue streams without intermediaries.</p>
              </div>
              <div className="summary-card">
                <h3>Mission</h3>
                <p>Empower writers globally by providing professional tools, permanent content ownership, and direct monetization through Bitcoin's micropayment infrastructure.</p>
              </div>
              <div className="summary-card">
                <h3>Market</h3>
                <p>Professional freelance writers, content creators, publishers, and blockchain enthusiasts seeking decentralized content creation and monetization.</p>
              </div>
            </div>
          </section>

          {/* Core Features */}
          <section id="features" className="section">
            <h2>Core Features</h2>
            <div className="features-grid">
              
              <div className="feature-group">
                <h3>📝 Document Creation</h3>
                <ul>
                  <li><strong>Rich Text Editor</strong> - Quill-based WYSIWYG with advanced formatting</li>
                  <li><strong>Auto-save</strong> - Real-time saving with blockchain hashing</li>
                  <li><strong>Version Control</strong> - Git-style Work Tree functionality</li>
                  <li><strong>Multi-format Support</strong> - Import/export Word, HTML, Markdown, PDF</li>
                  <li><strong>Collaborative Editing</strong> - Multi-author document support</li>
                </ul>
              </div>

              <div className="feature-group">
                <h3>⛓️ Blockchain Integration</h3>
                <ul>
                  <li><strong>Content Hashing</strong> - SHA-256 hashing for proof of authorship</li>
                  <li><strong>Smart Storage</strong> - BSV, encrypted, scheduled publication options</li>
                  <li><strong>Permanent Storage</strong> - Immutable content on Bitcoin blockchain</li>
                  <li><strong>Cost Estimation</strong> - Real-time pricing (~$0.00000001-0.01)</li>
                </ul>
              </div>

              <div className="feature-group">
                <h3>💰 Monetization</h3>
                <ul>
                  <li><strong>Smart Contracts</strong> - Publisher-writer escrow system</li>
                  <li><strong>Micropayments</strong> - Pay-per-read with instant settlements</li>
                  <li><strong>NFT Creation</strong> - Convert documents to Bitcoin OS assets</li>
                  <li><strong>Royalty System</strong> - Ongoing revenue from resales</li>
                  <li><strong>Grant System</strong> - Community-funded opportunities</li>
                </ul>
              </div>

              <div className="feature-group">
                <h3>🤖 AI Integration</h3>
                <ul>
                  <li><strong>Writing Assistant</strong> - Gemini AI integration</li>
                  <li><strong>Content Enhancement</strong> - AI-powered editing suggestions</li>
                  <li><strong>Research Tools</strong> - AI-assisted fact-checking</li>
                  <li><strong>Translation</strong> - Multi-language support</li>
                </ul>
              </div>

              <div className="feature-group">
                <h3>🏪 Marketplace</h3>
                <ul>
                  <li><strong>Contract Creation</strong> - Publishers create writing jobs</li>
                  <li><strong>Bid System</strong> - Writers apply with proposals</li>
                  <li><strong>Escrow System</strong> - Automatic payment holding/release</li>
                  <li><strong>Quality Assurance</strong> - Review and approval workflows</li>
                </ul>
              </div>

              <div className="feature-group">
                <h3>🔐 Authentication</h3>
                <ul>
                  <li><strong>HandCash Integration</strong> - Primary wallet authentication</li>
                  <li><strong>Guest Mode</strong> - Local storage for unregistered users</li>
                  <li><strong>Profile Management</strong> - Writer reputation and stats</li>
                  <li><strong>Paymail Integration</strong> - Bitcoin address identity</li>
                </ul>
              </div>
            </div>
          </section>

          {/* Technical Architecture */}
          <section id="architecture" className="section">
            <h2>Technical Architecture</h2>
            <div className="architecture-grid">
              <div className="arch-card">
                <h3>Frontend Stack</h3>
                <ul>
                  <li>Next.js 15.5.5 with React 18</li>
                  <li>Custom CSS with responsive design</li>
                  <li>Quill.js rich text editor</li>
                  <li>React hooks and context</li>
                </ul>
              </div>
              <div className="arch-card">
                <h3>Blockchain Layer</h3>
                <ul>
                  <li>Bitcoin SV (BSV) for content storage</li>
                  <li>HandCash API for micropayments</li>
                  <li>B://, BCAT, D:// protocols</li>
                  <li>AES-256 with RSA encryption</li>
                </ul>
              </div>
              <div className="arch-card">
                <h3>Backend Services</h3>
                <ul>
                  <li>HandCash OAuth and JWT auth</li>
                  <li>BSV blockchain with local caching</li>
                  <li>Stripe payment integration</li>
                  <li>Gemini AI API integration</li>
                </ul>
              </div>
              <div className="arch-card">
                <h3>Storage Architecture</h3>
                <ul>
                  <li>Browser localStorage for drafts</li>
                  <li>BSV blockchain permanent storage</li>
                  <li>~$0.05 per KB with 2x markup</li>
                  <li>Real-time cost calculation</li>
                </ul>
              </div>
            </div>
          </section>

          {/* User Personas */}
          <section id="personas" className="section">
            <h2>User Personas</h2>
            <div className="personas-grid">
              <div className="persona-card primary">
                <h3>🖋️ Professional Freelance Writer</h3>
                <div className="persona-details">
                  <p><strong>Age:</strong> 25-45</p>
                  <p><strong>Background:</strong> Experienced content creator, familiar with traditional publishing</p>
                  <p><strong>Goals:</strong> Secure payment, protect IP, find consistent work</p>
                  <p><strong>Pain Points:</strong> Payment delays, content theft, platform fees</p>
                  <p><strong>Use Cases:</strong> Contract fulfillment, content monetization, portfolio building</p>
                </div>
              </div>
              
              <div className="persona-card secondary">
                <h3>🏢 Content Publisher</h3>
                <div className="persona-details">
                  <p><strong>Age:</strong> 30-55</p>
                  <p><strong>Background:</strong> Content manager, agency owner, publication editor</p>
                  <p><strong>Goals:</strong> Find quality writers, manage projects, control costs</p>
                  <p><strong>Pain Points:</strong> Writer reliability, payment disputes, content quality</p>
                  <p><strong>Use Cases:</strong> Contract creation, writer management, content acquisition</p>
                </div>
              </div>
              
              <div className="persona-card tertiary">
                <h3>⚡ Blockchain Enthusiast</h3>
                <div className="persona-details">
                  <p><strong>Age:</strong> 20-40</p>
                  <p><strong>Background:</strong> Early adopter, crypto-native, tech-savvy</p>
                  <p><strong>Goals:</strong> Experiment with Web3, earn crypto, support decentralization</p>
                  <p><strong>Pain Points:</strong> Complex interfaces, high fees, limited utility</p>
                  <p><strong>Use Cases:</strong> NFT creation, micropayment experimentation, community participation</p>
                </div>
              </div>
            </div>
          </section>

          {/* Revenue Model */}
          <section id="revenue" className="section">
            <h2>Revenue Model</h2>
            <div className="revenue-grid">
              <div className="revenue-streams">
                <h3>Primary Revenue Streams</h3>
                <div className="revenue-item">
                  <span className="revenue-percentage">40%</span>
                  <div>
                    <strong>Transaction Fees</strong>
                    <p>2x markup on blockchain storage costs</p>
                  </div>
                </div>
                <div className="revenue-item">
                  <span className="revenue-percentage">25%</span>
                  <div>
                    <strong>Contract Commissions</strong>
                    <p>5% fee on completed contracts</p>
                  </div>
                </div>
                <div className="revenue-item">
                  <span className="revenue-percentage">20%</span>
                  <div>
                    <strong>Premium Features</strong>
                    <p>Advanced AI tools, analytics, priority support</p>
                  </div>
                </div>
                <div className="revenue-item">
                  <span className="revenue-percentage">10%</span>
                  <div>
                    <strong>NFT Marketplace</strong>
                    <p>2.5% commission on asset sales</p>
                  </div>
                </div>
                <div className="revenue-item">
                  <span className="revenue-percentage">5%</span>
                  <div>
                    <strong>Enterprise Solutions</strong>
                    <p>Custom contracts for organizations</p>
                  </div>
                </div>
              </div>
              
              <div className="cost-structure">
                <h3>Cost Structure</h3>
                <ul>
                  <li><strong>Blockchain Storage:</strong> ~$0.05 per KB (passed to users with markup)</li>
                  <li><strong>AI API Costs:</strong> Variable based on usage</li>
                  <li><strong>Infrastructure:</strong> Cloud hosting and CDN</li>
                  <li><strong>Development:</strong> Ongoing feature development</li>
                </ul>
              </div>
            </div>
          </section>

          {/* Development Roadmap */}
          <section id="roadmap" className="section">
            <h2>Development Roadmap</h2>
            <div className="roadmap-timeline">
              <div className="phase current">
                <div className="phase-header">
                  <h3>Phase 1: Core Platform</h3>
                  <span className="phase-status current">Current</span>
                </div>
                <ul>
                  <li>✅ Document editor with blockchain storage</li>
                  <li>✅ HandCash authentication</li>
                  <li>✅ Basic contract system</li>
                  <li>✅ Micropayment integration</li>
                  <li>✅ NFT asset creation</li>
                </ul>
              </div>
              
              <div className="phase upcoming">
                <div className="phase-header">
                  <h3>Phase 2: Enhanced Features</h3>
                  <span className="phase-status upcoming">Q1 2025</span>
                </div>
                <ul>
                  <li>Advanced collaboration tools</li>
                  <li>Mobile application</li>
                  <li>Enhanced AI integration</li>
                  <li>Analytics dashboard</li>
                  <li>Enterprise features</li>
                </ul>
              </div>
              
              <div className="phase future">
                <div className="phase-header">
                  <h3>Phase 3: Ecosystem Expansion</h3>
                  <span className="phase-status future">Q2 2025</span>
                </div>
                <ul>
                  <li>Multi-blockchain support</li>
                  <li>Advanced publishing tools</li>
                  <li>Community governance</li>
                  <li>Plugin ecosystem</li>
                  <li>International expansion</li>
                </ul>
              </div>
              
              <div className="phase future">
                <div className="phase-header">
                  <h3>Phase 4: Platform Maturity</h3>
                  <span className="phase-status future">Q3-Q4 2025</span>
                </div>
                <ul>
                  <li>Advanced analytics</li>
                  <li>ML recommendations</li>
                  <li>Institutional partnerships</li>
                  <li>Regulatory compliance tools</li>
                  <li>Global scaling</li>
                </ul>
              </div>
            </div>
          </section>

          {/* Success Metrics */}
          <section className="section">
            <h2>Success Metrics</h2>
            <div className="metrics-grid">
              <div className="metric-group">
                <h3>User Acquisition</h3>
                <ul>
                  <li>Monthly Active Users (MAU)</li>
                  <li>New writer registrations</li>
                  <li>Publisher onboarding rate</li>
                  <li>Organic vs. paid acquisition cost</li>
                </ul>
              </div>
              <div className="metric-group">
                <h3>Engagement</h3>
                <ul>
                  <li>Documents created per user</li>
                  <li>Average session duration</li>
                  <li>Content published to blockchain</li>
                  <li>Contract completion rate</li>
                </ul>
              </div>
              <div className="metric-group">
                <h3>Revenue</h3>
                <ul>
                  <li>Monthly Recurring Revenue (MRR)</li>
                  <li>Average Revenue Per User (ARPU)</li>
                  <li>Contract transaction volume</li>
                  <li>NFT marketplace activity</li>
                </ul>
              </div>
              <div className="metric-group">
                <h3>Platform Health</h3>
                <ul>
                  <li>Writer retention rate</li>
                  <li>Publisher satisfaction scores</li>
                  <li>Payment processing success rate</li>
                  <li>Content quality ratings</li>
                </ul>
              </div>
            </div>
          </section>

          {/* Competitive Analysis */}
          <section className="section">
            <h2>Competitive Analysis</h2>
            <div className="competitive-grid">
              <div className="competitor-card">
                <h3>Medium</h3>
                <p className="competitor-type">Direct Competitor</p>
                <div className="pros-cons">
                  <div className="pros">
                    <h4>Strengths</h4>
                    <ul>
                      <li>Large user base</li>
                      <li>Simple interface</li>
                      <li>SEO optimized</li>
                    </ul>
                  </div>
                  <div className="cons">
                    <h4>Weaknesses</h4>
                    <ul>
                      <li>Centralized platform</li>
                      <li>Limited monetization</li>
                      <li>No content ownership</li>
                    </ul>
                  </div>
                </div>
              </div>
              
              <div className="competitor-card">
                <h3>Substack</h3>
                <p className="competitor-type">Direct Competitor</p>
                <div className="pros-cons">
                  <div className="pros">
                    <h4>Strengths</h4>
                    <ul>
                      <li>Newsletter focus</li>
                      <li>Subscription model</li>
                      <li>Creator-friendly</li>
                    </ul>
                  </div>
                  <div className="cons">
                    <h4>Weaknesses</h4>
                    <ul>
                      <li>Platform dependency</li>
                      <li>Limited to newsletters</li>
                      <li>Traditional payments</li>
                    </ul>
                  </div>
                </div>
              </div>
              
              <div className="advantage-card">
                <h3>🚀 Our Competitive Advantages</h3>
                <ul>
                  <li><strong>True Content Ownership</strong> - Blockchain-based proof of authorship</li>
                  <li><strong>Instant Global Payments</strong> - Bitcoin micropayments without intermediaries</li>
                  <li><strong>Transparent Contracts</strong> - Smart contract escrow and automation</li>
                  <li><strong>Permanent Storage</strong> - Immutable content preservation</li>
                  <li><strong>Multi-Revenue Streams</strong> - Contracts, micropayments, NFTs, royalties</li>
                </ul>
              </div>
            </div>
          </section>

          {/* Risk Assessment */}
          <section className="section">
            <h2>Risk Assessment & Mitigation</h2>
            <div className="risks-grid">
              <div className="risk-category">
                <h3>⚙️ Technical Risks</h3>
                <div className="risk-item">
                  <strong>Blockchain Scalability</strong>
                  <p><span className="risk-level medium">Medium</span> BSV transaction capacity limitations</p>
                  <p className="mitigation"><strong>Mitigation:</strong> Multi-blockchain architecture for scalability</p>
                </div>
                <div className="risk-item">
                  <strong>Cost Volatility</strong>
                  <p><span className="risk-level medium">Medium</span> Bitcoin price fluctuations affecting storage costs</p>
                  <p className="mitigation"><strong>Mitigation:</strong> Transparent pricing with cost predictions</p>
                </div>
              </div>
              
              <div className="risk-category">
                <h3>📈 Market Risks</h3>
                <div className="risk-item">
                  <strong>Adoption Barriers</strong>
                  <p><span className="risk-level high">High</span> Cryptocurrency learning curve for users</p>
                  <p className="mitigation"><strong>Mitigation:</strong> User education and simplified onboarding</p>
                </div>
                <div className="risk-item">
                  <strong>Regulatory Changes</strong>
                  <p><span className="risk-level medium">Medium</span> Potential restrictions on blockchain applications</p>
                  <p className="mitigation"><strong>Mitigation:</strong> Regulatory compliance monitoring</p>
                </div>
              </div>
            </div>
          </section>

          {/* Conclusion */}
          <section className="section conclusion">
            <h2>Conclusion</h2>
            <div className="conclusion-content">
              <p>
                Bitcoin Writer represents a paradigm shift in content creation and monetization, 
                leveraging Bitcoin's unique capabilities to solve real problems faced by writers and publishers. 
                The platform's combination of professional tools, blockchain permanence, and instant payments 
                creates a compelling value proposition for the global writing community.
              </p>
              <p>
                The product is positioned to capture the growing Web3 content creation market while remaining 
                accessible to traditional writers through its intuitive interface and optional blockchain features. 
                With strong technical foundations and clear monetization strategies, Bitcoin Writer is well-positioned 
                for sustainable growth and market leadership in the decentralized content space.
              </p>
            </div>
          </section>

        </div>
      </main>

      <Footer />
    </div>
  );
}