import React, { useState, useEffect } from 'react';
import './BWriterProPage.css';
import Footer from '../components/Footer';

const BWriterProPage: React.FC = () => {
  const [devSidebarCollapsed, setDevSidebarCollapsed] = useState(() => {
    const saved = localStorage.getItem('devSidebarCollapsed');
    return saved === 'true';
  });
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  useEffect(() => {
    // Listen for storage changes to detect sidebar collapse state
    const handleStorageChange = () => {
      const saved = localStorage.getItem('devSidebarCollapsed');
      setDevSidebarCollapsed(saved === 'true');
    };
    
    // Handle window resize
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    
    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('resize', handleResize);
    
    // Check for sidebar state changes via polling
    const checkSidebarState = setInterval(() => {
      const saved = localStorage.getItem('devSidebarCollapsed');
      setDevSidebarCollapsed(saved === 'true');
    }, 100);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('resize', handleResize);
      clearInterval(checkSidebarState);
    };
  }, []);

  return (
    <div className="App">
      <div className={`bwriter-pro-page ${!isMobile && !devSidebarCollapsed ? 'with-sidebar-expanded' : ''} ${!isMobile && devSidebarCollapsed ? 'with-sidebar-collapsed' : ''}`}>
      <div className="bwriter-pro-container">
        {/* Hero Section */}
        <section className="bwriter-pro-hero">
          <h1><span style={{color: '#ffffff'}}>Bitcoin Writer</span> <span style={{color: '#f7931a'}}>PRO</span></h1>
          <p className="bwriter-pro-tagline">
            Professional publishing with tokenization and automated revenue sharing
          </p>
          <div className="bwriter-pro-badge">PROFESSIONAL TIER</div>
        </section>

        {/* Philosophy Section */}
        <section className="philosophy-section">
          <h2>The Professional Creator Economy</h2>
          <div className="philosophy-content">
            <p>
              <strong>Bitcoin Writer PRO</strong> transforms content creators into content entrepreneurs. 
              By enabling tokenization of your work, you can build an investor base, share revenues 
              automatically, and create sustainable income from your writing.
            </p>
            <p>
              Through verified identity (KYC) and blockchain-based revenue distribution, PRO users 
              can operate legitimate content businesses with transparent financials and automated 
              dividend payments to their token holders.
            </p>
            <div className="philosophy-points">
              <div className="point">
                <h3>Verified Identity</h3>
                <p>KYC compliance for professional operations</p>
              </div>
              <div className="point">
                <h3>Tokenize Your Work</h3>
                <p>Create tradeable shares of your content</p>
              </div>
              <div className="point">
                <h3>Automated Dividends</h3>
                <p>Revenue sharing via smart contracts</p>
              </div>
            </div>
          </div>
        </section>

        {/* KYC Section */}
        <section className="token-model-section">
          <h2>Know Your Customer (KYC) Requirements</h2>
          
          <div className="model-card">
            <h3>Why KYC is Required</h3>
            <ul>
              <li>
                <strong>Regulatory Compliance:</strong> Meet international financial regulations for 
                operating a tokenized content business with revenue sharing
              </li>
              <li>
                <strong>Investor Protection:</strong> Ensure token holders can verify the identity 
                of content creators they're investing in
              </li>
              <li>
                <strong>Fraud Prevention:</strong> Protect the ecosystem from bad actors and maintain 
                platform integrity
              </li>
              <li>
                <strong>Tax Compliance:</strong> Enable proper reporting for dividend distributions 
                and capital gains
              </li>
            </ul>
          </div>

          <div className="model-card">
            <h3>KYC Process</h3>
            <ul>
              <li>
                <strong>Identity Verification:</strong> Submit government-issued ID and proof of address
              </li>
              <li>
                <strong>Biometric Check:</strong> Live selfie verification to prevent identity theft
              </li>
              <li>
                <strong>Background Screening:</strong> Basic checks for financial crimes and sanctions
              </li>
              <li>
                <strong>Approval Timeline:</strong> Typically completed within 24-48 hours
              </li>
            </ul>
          </div>
        </section>

        {/* Tokenization Section */}
        <section className="business-section">
          <h2>Content Tokenization System</h2>
          <div className="business-content">
            <p className="intro">
              Transform your writing into investable assets with automatic revenue sharing
            </p>

            <div className="business-model">
              <h3>How Tokenization Works</h3>
              <div className="revenue-streams">
                <div className="stream">
                  <h4>Create Tokens</h4>
                  <p>Issue shares of your content</p>
                  <p className="price">1-1M tokens</p>
                </div>
                <div className="stream featured">
                  <h4>Set Terms</h4>
                  <p>Define revenue share percentage</p>
                  <p className="price">10-50% to holders</p>
                </div>
                <div className="stream">
                  <h4>Sell Shares</h4>
                  <p>Investors buy your tokens</p>
                  <p className="price">Market pricing</p>
                </div>
              </div>
              
              <h3 style={{marginTop: '40px'}}>Revenue Distribution</h3>
              <div className="revenue-streams">
                <div className="stream">
                  <h4>Content Sales</h4>
                  <p>Direct purchases & subscriptions</p>
                  <p className="price">$1-100/piece</p>
                </div>
                <div className="stream featured">
                  <h4>Licensing Fees</h4>
                  <p>Commercial usage rights</p>
                  <p className="price">$100-10K/license</p>
                </div>
                <div className="stream">
                  <h4>Syndication</h4>
                  <p>Multi-platform distribution</p>
                  <p className="price">Revenue share</p>
                </div>
              </div>
            </div>

            <div className="value-flow">
              <h3>Automated Dividend Flow</h3>
              <div className="flow-diagram">
                <div className="flow-item">
                  <span>Reader purchases your content</span>
                  <span className="arrow">→</span>
                </div>
                <div className="flow-item">
                  <span>Revenue received in BSV</span>
                  <span className="arrow">→</span>
                </div>
                <div className="flow-item">
                  <span>Smart contract calculates shares</span>
                  <span className="arrow">→</span>
                </div>
                <div className="flow-item">
                  <span>Dividends auto-distributed to token holders</span>
                </div>
              </div>
              <p style={{textAlign: 'center', marginTop: '20px', fontSize: '14px', color: 'rgba(255, 255, 255, 0.6)'}}>
                Every sale triggers automatic dividend payments within seconds via Bitcoin SV smart contracts
              </p>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="contribute-section">
          <h2>PRO Features</h2>
          <div className="contribute-steps">
            <div className="step">
              <div className="step-number">1</div>
              <h3>Token Creation</h3>
              <p>Issue custom tokens for individual works or your entire portfolio</p>
            </div>
            <div className="step">
              <div className="step-number">2</div>
              <h3>Price Discovery</h3>
              <p>Let the market determine fair value through trading</p>
            </div>
            <div className="step">
              <div className="step-number">3</div>
              <h3>Revenue Tracking</h3>
              <p>Real-time dashboard showing sales and distributions</p>
            </div>
            <div className="step">
              <div className="step-number">4</div>
              <h3>Tax Reporting</h3>
              <p>Automated statements for dividend income and capital gains</p>
            </div>
          </div>

          <div className="contribution-examples">
            <h3>What You Can Tokenize</h3>
            <ul>
              <li>✅ Individual articles and essays</li>
              <li>✅ Book manuscripts and novels</li>
              <li>✅ Research papers and reports</li>
              <li>✅ Newsletter subscriptions</li>
              <li>✅ Content series and collections</li>
              <li>✅ Future writing commitments</li>
            </ul>
          </div>
        </section>

        {/* Pricing Section */}
        <section className="stats-section">
          <h2>PRO Pricing & Economics</h2>
          <div className="stats-grid">
            <div className="stat">
              <h3>Monthly Fee</h3>
              <p className="stat-value">$29</p>
              <p className="stat-label">Per month</p>
            </div>
            <div className="stat">
              <h3>Transaction Fee</h3>
              <p className="stat-value">2.5%</p>
              <p className="stat-label">On token sales</p>
            </div>
            <div className="stat">
              <h3>Distribution Fee</h3>
              <p className="stat-value">0.5%</p>
              <p className="stat-label">On dividends</p>
            </div>
            <div className="stat">
              <h3>Min Token Value</h3>
              <p className="stat-value">$0.001</p>
              <p className="stat-label">BSV equivalent</p>
            </div>
          </div>

          <div className="revenue-model">
            <h3>Example Economics</h3>
            <div className="earning-paths">
              <div className="path">
                <h4>Small Creator</h4>
                <p>100 token holders</p>
                <p>$500/month revenue</p>
                <p>= $250 distributed</p>
              </div>
              <div className="path featured">
                <h4>Growth Creator</h4>
                <p>1,000 token holders</p>
                <p>$5,000/month revenue</p>
                <p>= $2,500 distributed</p>
              </div>
              <div className="path">
                <h4>Pro Creator</h4>
                <p>10,000 token holders</p>
                <p>$50,000/month revenue</p>
                <p>= $25,000 distributed</p>
              </div>
            </div>
          </div>
        </section>

        {/* Use Cases Section */}
        <section className="legal-section">
          <h2>Who Benefits from PRO</h2>
          <div className="legal-content">
            <div className="use-case-grid">
              <div className="use-case">
                <h3>Professional Writers</h3>
                <p>Build a community of investors who benefit from your success</p>
              </div>
              <div className="use-case">
                <h3>Journalists</h3>
                <p>Fund investigative work through reader investment</p>
              </div>
              <div className="use-case">
                <h3>Academic Researchers</h3>
                <p>Monetize research with transparent revenue sharing</p>
              </div>
              <div className="use-case">
                <h3>Content Agencies</h3>
                <p>Offer clients tokenized content with built-in ROI</p>
              </div>
              <div className="use-case">
                <h3>Newsletter Authors</h3>
                <p>Convert subscribers into stakeholders</p>
              </div>
              <div className="use-case">
                <h3>Book Authors</h3>
                <p>Pre-sell book tokens to fund writing and share royalties</p>
              </div>
            </div>
          </div>
        </section>

        {/* Compliance Section */}
        <section className="legal-section">
          <h2>Legal & Compliance</h2>
          <div className="legal-content">
            <p>
              <strong>Securities Compliance:</strong> Bitcoin Writer PRO operates within applicable 
              securities regulations. Content tokens may be considered securities in some jurisdictions. 
              We work with legal partners to ensure compliance with local laws.
            </p>
            <p>
              <strong>Tax Obligations:</strong> PRO users are responsible for reporting dividend income 
              and capital gains according to their local tax laws. We provide comprehensive transaction 
              reports and 1099 forms for US users.
            </p>
            <p>
              <strong>AML/CTF:</strong> Our KYC process includes Anti-Money Laundering and Counter-Terrorism 
              Financing checks to maintain platform integrity and regulatory compliance.
            </p>
            <p>
              <strong>Data Protection:</strong> KYC data is encrypted, stored securely, and only shared 
              with authorized compliance partners. We comply with GDPR and other privacy regulations.
            </p>
          </div>
        </section>

        {/* CTA Section */}
        <section className="cta-section">
          <h2>Ready to Go PRO?</h2>
          <p className="cta-subtitle">Transform your writing into a sustainable business</p>
          <div className="cta-buttons">
            <a 
              href="/upgrade-to-pro" 
              className="cta-btn primary"
            >
              Start KYC Process
            </a>
            <a 
              href="/pro-docs" 
              className="cta-btn secondary"
            >
              Read PRO Documentation
            </a>
          </div>
          <div className="cta-stats">
            <span>📊 $2M+ Distributed</span>
            <span>✍️ 500+ PRO Writers</span>
            <span>🌍 50+ Countries</span>
          </div>
        </section>
      </div>
    </div>
    <Footer />
    </div>
  );
};

export default BWriterProPage;