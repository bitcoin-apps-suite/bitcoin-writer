'use client';

import React from 'react';
import './platform.css';

export default function PlatformPage() {
  return (
    <div className="App">
      <div className="platform-page">
      <div className="platform-container">
        {/* Hero Section */}
        <section className="platform-hero">
          <h1><span style={{color: '#ffffff'}}>The</span> <span style={{color: '#f7931a'}}>Bitcoin Writer</span> <span style={{color: '#ffffff'}}>Platform</span></h1>
          <p className="platform-tagline">
            Where content meets blockchain permanence
          </p>
          <div className="platform-badge">BITCOIN SV</div>
        </section>

        {/* Philosophy Section */}
        <section className="philosophy-section">
          <h2>Our Platform Philosophy</h2>
          <div className="philosophy-content">
            <p>
              Bitcoin Writer represents a <strong>paradigm shift</strong> in digital publishing. 
              We believe that writers should own their work permanently, readers should pay fair prices, 
              and the middlemen extracting value should be replaced by direct creator-to-consumer relationships.
            </p>
            <p>
              Built on Bitcoin SV's unbounded scaling, we store entire documents on-chain, creating an 
              immutable library of human knowledge while enabling instant micropayments for content consumption.
            </p>
            <div className="philosophy-points">
              <div className="point">
                <h3>True Ownership</h3>
                <p>Your content, your keys, your revenue</p>
              </div>
              <div className="point">
                <h3>Permanent Storage</h3>
                <p>Written once, preserved forever on-chain</p>
              </div>
              <div className="point">
                <h3>Direct Monetization</h3>
                <p>No intermediaries, instant settlement</p>
              </div>
            </div>
          </div>
        </section>

        {/* Platform Model Section */}
        <section className="platform-model-section">
          <h2>The Bitcoin Writer Ecosystem</h2>
          <div className="model-card">
            <h3>Core Capabilities</h3>
            <ul>
              <li>
                <strong>On-Chain Storage:</strong> Documents stored directly on Bitcoin SV blockchain, 
                not just hashes or pointers. Your content exists forever, uncensorable and immutable.
              </li>
              <li>
                <strong>Micropayment Rails:</strong> Charge per word, per page, per document, or flat fees. 
                Readers pay exactly what content is worth, down to fractions of a cent.
              </li>
              <li>
                <strong>Encryption Layer:</strong> Military-grade encryption with key management. 
                Control access at the individual reader level or create subscriber groups.
              </li>
              <li>
                <strong>Tokenization Protocol:</strong> Transform any document into a tradeable asset. 
                Issue shares, create limited editions, enable secondary markets.
              </li>
              <li>
                <strong>Smart Contracts:</strong> Automated royalties, collaboration splits, 
                and conditional access rules executed trustlessly on-chain.
              </li>
            </ul>
          </div>

          <div className="model-card warning">
            <h3>Platform Advantages</h3>
            <ul>
              <li>
                <strong>Zero Platform Risk:</strong> Your content can't be deplatformed, deleted, or 
                censored. If our servers disappear tomorrow, your content remains on the blockchain.
              </li>
              <li>
                <strong>Instant Global Reach:</strong> No geographic restrictions, no payment processor 
                limitations, no currency conversions. Bitcoin is universal.
              </li>
              <li>
                <strong>True Digital Scarcity:</strong> Create genuine limited editions, not database 
                entries. Cryptographic proof of authenticity and ownership.
              </li>
              <li>
                <strong>Composable Content:</strong> Documents can reference, include, and build upon 
                each other, creating a web of interconnected knowledge.
              </li>
            </ul>
          </div>
        </section>

        {/* Business Model Section */}
        <section className="business-section">
          <h2>Platform Economics</h2>
          <div className="business-content">
            <p className="intro">
              Bitcoin Writer operates on a sustainable economic model that aligns platform success 
              with creator success.
            </p>

            <div className="business-model">
              <h3>Creator Revenue Model</h3>
              <div className="revenue-streams">
                <div className="stream">
                  <h4>Direct Sales</h4>
                  <p>Sell documents directly</p>
                  <p className="price">Keep 95%</p>
                </div>
                <div className="stream featured">
                  <h4>Subscriptions</h4>
                  <p>Recurring reader revenue</p>
                  <p className="price">Keep 90%</p>
                </div>
                <div className="stream">
                  <h4>Token Sales</h4>
                  <p>Sell shares in your work</p>
                  <p className="price">Keep 97.5%</p>
                </div>
              </div>
              
              <h3 style={{marginTop: '40px'}}>Platform Services</h3>
              <div className="revenue-streams">
                <div className="stream">
                  <h4>Free Tier</h4>
                  <p>10 documents/month</p>
                  <p className="price">$0/month</p>
                </div>
                <div className="stream featured">
                  <h4>Professional</h4>
                  <p>Unlimited + analytics</p>
                  <p className="price">$29/month</p>
                </div>
                <div className="stream">
                  <h4>Enterprise</h4>
                  <p>White-label + API</p>
                  <p className="price">$299/month</p>
                </div>
              </div>
            </div>

            <div className="value-flow">
              <h3>Value Flow</h3>
              <div className="flow-diagram">
                <div className="flow-item">
                  <span>Writers create content</span>
                  <span className="arrow">→</span>
                </div>
                <div className="flow-item">
                  <span>Readers pay micropayments</span>
                  <span className="arrow">→</span>
                </div>
                <div className="flow-item">
                  <span>95% to creators instantly</span>
                  <span className="arrow">→</span>
                </div>
                <div className="flow-item">
                  <span>5% sustains platform development</span>
                </div>
              </div>
              <p style={{textAlign: 'center', marginTop: '20px', fontSize: '14px', color: 'rgba(255, 255, 255, 0.6)'}}>
                Compare this to traditional publishing where authors receive 10-15% of revenue 
                after months of delay.
              </p>
            </div>
          </div>
        </section>

        {/* How It Works Section */}
        <section className="contribute-section">
          <h2>How It Works</h2>
          <div className="contribute-steps">
            <div className="step">
              <div className="step-number">1</div>
              <h3>Write</h3>
              <p>Create in our editor or import from Word, Google Docs, Markdown</p>
            </div>
            <div className="step">
              <div className="step-number">2</div>
              <h3>Configure</h3>
              <p>Set price, encryption, tokenization parameters</p>
            </div>
            <div className="step">
              <div className="step-number">3</div>
              <h3>Publish</h3>
              <p>One click to store permanently on Bitcoin SV</p>
            </div>
            <div className="step">
              <div className="step-number">4</div>
              <h3>Earn</h3>
              <p>Instant micropayments flow directly to your wallet</p>
            </div>
          </div>

          <div className="contribution-examples">
            <h3>What You Can Build</h3>
            <ul>
              <li>✅ Books and novels with per-chapter pricing</li>
              <li>✅ Academic papers with citation tracking</li>
              <li>✅ Technical documentation with version control</li>
              <li>✅ News articles with micropayment paywalls</li>
              <li>✅ Legal contracts with tamper-proof storage</li>
              <li>✅ Investment research with token-gated access</li>
            </ul>
          </div>
        </section>

        {/* Use Cases Section */}
        <section className="stats-section">
          <h2>Use Cases</h2>
          <div className="use-cases-grid">
            <div className="stat-card">
              <h3>Authors & Writers</h3>
              <ul className="use-case-list">
                <li>Publish directly, keep 95% of revenue</li>
                <li>No publisher gatekeepers</li>
                <li>Instant global distribution</li>
                <li>Build direct reader relationships</li>
              </ul>
            </div>
            <div className="stat-card">
              <h3>Journalists</h3>
              <ul className="use-case-list">
                <li>Uncensorable reporting</li>
                <li>Timestamped proof of stories</li>
                <li>Micropayment monetization</li>
                <li>Verifiable work history</li>
              </ul>
            </div>
            <div className="stat-card">
              <h3>Academic Researchers</h3>
              <ul className="use-case-list">
                <li>Immutable publication dates</li>
                <li>Priority claims for discoveries</li>
                <li>Open access with attribution</li>
                <li>Collaborative research networks</li>
              </ul>
            </div>
            <div className="stat-card">
              <h3>Legal Professionals</h3>
              <ul className="use-case-list">
                <li>Tamper-proof contracts</li>
                <li>Chain of custody tracking</li>
                <li>Automated smart contracts</li>
                <li>Encrypted client documents</li>
              </ul>
            </div>
            <div className="stat-card">
              <h3>Enterprises</h3>
              <ul className="use-case-list">
                <li>Secure documentation systems</li>
                <li>Compliance audit trails</li>
                <li>IP portfolio management</li>
                <li>Confidential distribution</li>
              </ul>
            </div>
            <div className="stat-card">
              <h3>Publishers</h3>
              <ul className="use-case-list">
                <li>90% lower distribution costs</li>
                <li>Blockchain piracy prevention</li>
                <li>Automated royalty splits</li>
                <li>Instant global markets</li>
              </ul>
            </div>
          </div>
        </section>

        {/* Technology Section */}
        <section className="stats-section">
          <h2>Technology Stack</h2>
          <div className="contract-info">
            <div className="contract-details">
              <h3>Core Infrastructure</h3>
              <div className="contract-item">
                <strong>Blockchain:</strong>
                <span>Bitcoin SV (unlimited scaling)</span>
              </div>
              <div className="contract-item">
                <strong>Storage Cost:</strong>
                <span>~$0.0001 per KB</span>
              </div>
              <div className="contract-item">
                <strong>Transaction Speed:</strong>
                <span>Instant (0-conf)</span>
              </div>
              <div className="contract-item">
                <strong>Data Protocol:</strong>
                <span>Metanet graph structure</span>
              </div>
              <div className="contract-item">
                <strong>Payment Layer:</strong>
                <span>Paymail + HandCash Connect</span>
              </div>
              <div className="contract-item">
                <strong>Encryption:</strong>
                <span>AES-256 + ECIES</span>
              </div>
            </div>
          </div>
        </section>

        {/* Platform Statistics */}
        <section className="stats-section">
          <h2>Platform Statistics</h2>
          <div className="stats-grid">
            <div className="stat">
              <h3>Documents Stored</h3>
              <p className="stat-value">1,247</p>
              <p className="stat-label">On-chain forever</p>
            </div>
            <div className="stat">
              <h3>Total Value Locked</h3>
              <p className="stat-value">127 BSV</p>
              <p className="stat-label">In document tokens</p>
            </div>
            <div className="stat">
              <h3>Active Writers</h3>
              <p className="stat-value">89</p>
              <p className="stat-label">Publishing monthly</p>
            </div>
            <div className="stat">
              <h3>Micropayments</h3>
              <p className="stat-value">47,382</p>
              <p className="stat-label">Transactions processed</p>
            </div>
          </div>
        </section>

        {/* Legal Section */}
        <section className="legal-section">
          <h2>Important Considerations</h2>
          <div className="legal-content">
            <p>
              <strong>Permanence:</strong> Once published to the blockchain, content cannot be deleted 
              or modified. Think carefully before publishing sensitive or time-sensitive information.
            </p>
            <p>
              <strong>Regulatory Compliance:</strong> Users are responsible for ensuring their content 
              complies with local laws and regulations. Bitcoin Writer provides tools but not legal advice.
            </p>
            <p>
              <strong>Key Management:</strong> Loss of private keys means loss of access to encrypted 
              content and earnings. We cannot recover lost keys. Always maintain secure backups.
            </p>
          </div>
        </section>

        {/* CTA Section */}
        <section className="cta-section">
          <h2>Ready to Own Your Content?</h2>
          <div className="cta-buttons">
            <a 
              href="/" 
              className="cta-btn primary"
            >
              Launch Bitcoin Writer
            </a>
            <a 
              href="/docs" 
              className="cta-btn secondary"
            >
              Read Documentation
            </a>
          </div>
        </section>
      </div>
    </div>
    </div>
  );
}