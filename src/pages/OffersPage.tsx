import React, { useState, useEffect } from 'react';
import './OffersPage.css';
import Footer from '../components/Footer';

const OffersPage: React.FC = () => {
  const [devSidebarCollapsed, setDevSidebarCollapsed] = useState(() => {
    const saved = localStorage.getItem('devSidebarCollapsed');
    return saved === 'true';
  });
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [activeTab, setActiveTab] = useState<'platform' | 'marketplace'>('marketplace');

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
      <div className={`offers-page ${!isMobile && !devSidebarCollapsed ? 'with-sidebar-expanded' : ''} ${!isMobile && devSidebarCollapsed ? 'with-sidebar-collapsed' : ''}`}>
      <div className="offers-container">
        {/* Hero Section */}
        <section className="offers-hero">
          <h1>Bitcoin Writer <span style={{color: '#ffffff'}}>Marketplace</span></h1>
          <p className="offers-tagline">
            Connect authors with publishers through smart contracts on the blockchain
          </p>
          <div className="offers-badge">MARKETPLACE</div>
        </section>

        {/* Tab Navigation */}
        <section className="offers-tabs-section">
          <div className="offers-tabs">
            <button 
              className={activeTab === 'marketplace' ? 'active' : ''}
              onClick={() => setActiveTab('marketplace')}
            >
              Author Marketplace
            </button>
            <button 
              className={activeTab === 'platform' ? 'active' : ''}
              onClick={() => setActiveTab('platform')}
            >
              Platform Offers
            </button>
          </div>
        </section>

        {/* Marketplace Section */}
        {activeTab === 'marketplace' && (
          <section className="marketplace-section">
            <h2>Author Services Marketplace</h2>
            <p className="marketplace-description">
              Authors offer their writing services directly to publishers. All contracts are recorded on the BSV blockchain
              with escrow payments and AI-verified deliverables.
            </p>
            
            <div className="marketplace-grid">
              {/* Author Offer Example 1 */}
              <div className="author-offer-card">
                <div className="author-header">
                  <div className="author-avatar">JD</div>
                  <div className="author-info">
                    <h3>John Doe</h3>
                    <div className="author-badges">
                      <span className="badge verified">Verified</span>
                      <span className="badge rating">★ 4.9</span>
                    </div>
                  </div>
                </div>
                <h4>Technical Documentation & API Guides</h4>
                <p>I specialize in creating comprehensive technical documentation, API references, and developer guides for blockchain projects.</p>
                <div className="offer-details">
                  <div className="detail-item">
                    <span className="label">Rate:</span>
                    <span className="value">$250 per 1000 words</span>
                  </div>
                  <div className="detail-item">
                    <span className="label">Delivery:</span>
                    <span className="value">3-5 days</span>
                  </div>
                  <div className="detail-item">
                    <span className="label">Languages:</span>
                    <span className="value">English, Spanish</span>
                  </div>
                </div>
                <div className="offer-tags">
                  <span className="tag">Blockchain</span>
                  <span className="tag">Technical Writing</span>
                  <span className="tag">API Docs</span>
                </div>
                <button className="hire-button">Create Contract →</button>
              </div>

              {/* Author Offer Example 2 */}
              <div className="author-offer-card">
                <div className="author-header">
                  <div className="author-avatar">SM</div>
                  <div className="author-info">
                    <h3>Sarah Mitchell</h3>
                    <div className="author-badges">
                      <span className="badge verified">Verified</span>
                      <span className="badge rating">★ 5.0</span>
                    </div>
                  </div>
                </div>
                <h4>Cryptocurrency Market Analysis & Reports</h4>
                <p>Professional market analysis, trend reports, and investment research for crypto publications and trading platforms.</p>
                <div className="offer-details">
                  <div className="detail-item">
                    <span className="label">Rate:</span>
                    <span className="value">$500 per report</span>
                  </div>
                  <div className="detail-item">
                    <span className="label">Delivery:</span>
                    <span className="value">24-48 hours</span>
                  </div>
                  <div className="detail-item">
                    <span className="label">Expertise:</span>
                    <span className="value">DeFi, NFTs, BSV</span>
                  </div>
                </div>
                <div className="offer-tags">
                  <span className="tag">Market Analysis</span>
                  <span className="tag">Trading</span>
                  <span className="tag">Research</span>
                </div>
                <button className="hire-button">Create Contract →</button>
              </div>

              {/* Author Offer Example 3 */}
              <div className="author-offer-card">
                <div className="author-header">
                  <div className="author-avatar">AK</div>
                  <div className="author-info">
                    <h3>Alex Kim</h3>
                    <div className="author-badges">
                      <span className="badge verified">Verified</span>
                      <span className="badge rating">★ 4.8</span>
                    </div>
                  </div>
                </div>
                <h4>Web3 Content Marketing & Blog Posts</h4>
                <p>Engaging content for Web3 startups, including blog posts, whitepapers, and social media content strategies.</p>
                <div className="offer-details">
                  <div className="detail-item">
                    <span className="label">Rate:</span>
                    <span className="value">$150 per article</span>
                  </div>
                  <div className="detail-item">
                    <span className="label">Delivery:</span>
                    <span className="value">2-3 days</span>
                  </div>
                  <div className="detail-item">
                    <span className="label">Package:</span>
                    <span className="value">10 articles/month</span>
                  </div>
                </div>
                <div className="offer-tags">
                  <span className="tag">Content Marketing</span>
                  <span className="tag">SEO</span>
                  <span className="tag">Web3</span>
                </div>
                <button className="hire-button">Create Contract →</button>
              </div>

              {/* Add Your Offer Card */}
              <div className="author-offer-card add-offer">
                <div className="add-offer-content">
                  <h3>Are You an Author?</h3>
                  <p>List your writing services and connect with publishers looking for quality content.</p>
                  <button className="create-offer-button">Create Your Offer →</button>
                </div>
              </div>
            </div>

            {/* How It Works Section */}
            <div className="how-it-works">
              <h3>How the Marketplace Works</h3>
              <div className="steps-grid">
                <div className="step">
                  <div className="step-number">1</div>
                  <h4>Browse & Connect</h4>
                  <p>Publishers browse author offers and select writers that match their needs</p>
                </div>
                <div className="step">
                  <div className="step-number">2</div>
                  <h4>Smart Contract</h4>
                  <p>Agreement terms are encoded in a BSV smart contract with escrow payment</p>
                </div>
                <div className="step">
                  <div className="step-number">3</div>
                  <h4>Create & Deliver</h4>
                  <p>Authors create content, AI verifies quality and originality</p>
                </div>
                <div className="step">
                  <div className="step-number">4</div>
                  <h4>Automatic Payment</h4>
                  <p>Upon approval, payment is released from escrow to the author</p>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Platform Offers Section */}
        {activeTab === 'platform' && (
        <section className="current-offers-section">
          <h2>Bitcoin Writer Platform Offers</h2>
          <p className="platform-description">
            Special programs and opportunities offered by Bitcoin Writer to developers, partners, and the community.
          </p>
          <div className="offers-grid">
            <div className="offer-card featured">
              <div className="offer-type">Partnership</div>
              <h3>Early Contributor Program</h3>
              <p>
                Join as an early contributor and receive enhanced token allocations 
                for your contributions during our launch phase.
              </p>
              <ul>
                <li>2x token multiplier for Q1 2025 contributions</li>
                <li>Priority access to new features</li>
                <li>Direct collaboration with core team</li>
                <li>Governance voting rights</li>
              </ul>
              <div className="offer-cta">
                <a href="https://github.com/bitcoin-apps-suite/bitcoin-writer" target="_blank" rel="noopener noreferrer">
                  Apply Now →
                </a>
              </div>
            </div>

            <div className="offer-card">
              <div className="offer-type">Integration</div>
              <h3>BSV App Integration</h3>
              <p>
                Integrate your BSV application with Bitcoin Writer and receive 
                marketing support plus revenue sharing.
              </p>
              <ul>
                <li>Featured placement in app directory</li>
                <li>Co-marketing opportunities</li>
                <li>Revenue sharing on referred users</li>
                <li>Technical integration support</li>
              </ul>
              <div className="offer-cta">
                <a href="mailto:partnerships@bitcoinwriter.io">
                  Learn More →
                </a>
              </div>
            </div>

            <div className="offer-card">
              <div className="offer-type">Development</div>
              <h3>Bug Bounty Program</h3>
              <p>
                Find and report security vulnerabilities or critical bugs 
                to earn rewards up to $10,000.
              </p>
              <ul>
                <li>Critical security: $5,000 - $10,000</li>
                <li>High severity: $1,000 - $5,000</li>
                <li>Medium severity: $500 - $1,000</li>
                <li>Low severity: $100 - $500</li>
              </ul>
              <div className="offer-cta">
                <a href="https://github.com/bitcoin-apps-suite/bitcoin-writer/security" target="_blank" rel="noopener noreferrer">
                  Report Bug →
                </a>
              </div>
            </div>

            <div className="offer-card">
              <div className="offer-type">Content</div>
              <h3>Technical Writer Program</h3>
              <p>
                Create documentation, tutorials, and technical content 
                for Bitcoin Writer and earn tokens.
              </p>
              <ul>
                <li>$100-500 per technical article</li>
                <li>$500-2000 per video tutorial</li>
                <li>Ongoing documentation maintenance</li>
                <li>Attribution and portfolio building</li>
              </ul>
              <div className="offer-cta">
                <a href="mailto:content@bitcoinwriter.io">
                  Submit Proposal →
                </a>
              </div>
            </div>

            <div className="offer-card">
              <div className="offer-type">Enterprise</div>
              <h3>Pilot Program</h3>
              <p>
                Be among the first enterprises to adopt Bitcoin Writer 
                with special pricing and support.
              </p>
              <ul>
                <li>50% discount for first year</li>
                <li>Dedicated onboarding team</li>
                <li>Custom feature prioritization</li>
                <li>Case study collaboration</li>
              </ul>
              <div className="offer-cta">
                <a href="mailto:enterprise@bitcoinwriter.io">
                  Contact Sales →
                </a>
              </div>
            </div>

            <div className="offer-card">
              <div className="offer-type">Community</div>
              <h3>Ambassador Program</h3>
              <p>
                Represent Bitcoin Writer in your community and earn 
                rewards for growth and engagement.
              </p>
              <ul>
                <li>Monthly token rewards</li>
                <li>Exclusive merchandise</li>
                <li>Event speaking opportunities</li>
                <li>Direct team access</li>
              </ul>
              <div className="offer-cta">
                <a href="https://discord.gg/xBB8r8dj" target="_blank" rel="noopener noreferrer">
                  Join Discord →
                </a>
              </div>
            </div>
          </div>
        </section>
        )}

        {/* Partner Benefits Section - Only show for platform offers */}
        {activeTab === 'platform' && (
        <section className="benefits-section">
          <h2>Why Partner With Us</h2>
          <div className="benefits-grid">
            <div className="benefit">
              <div className="benefit-icon">💰</div>
              <h3>Revenue Sharing</h3>
              <p>Earn ongoing revenue from users and transactions</p>
            </div>
            <div className="benefit">
              <div className="benefit-icon">🚀</div>
              <h3>Early Access</h3>
              <p>Get new features and integrations before public release</p>
            </div>
            <div className="benefit">
              <div className="benefit-icon">🤝</div>
              <h3>Co-Marketing</h3>
              <p>Joint marketing campaigns and promotional support</p>
            </div>
            <div className="benefit">
              <div className="benefit-icon">🛠️</div>
              <h3>Technical Support</h3>
              <p>Dedicated technical resources for integration</p>
            </div>
            <div className="benefit">
              <div className="benefit-icon">📈</div>
              <h3>Growth Opportunities</h3>
              <p>Scale with us as the platform grows</p>
            </div>
            <div className="benefit">
              <div className="benefit-icon">🏆</div>
              <h3>Recognition</h3>
              <p>Featured partner status and visibility</p>
            </div>
          </div>
        </section>
        )}

        {/* CTA Section - Only show for platform offers */}
        {activeTab === 'platform' && (
        <section className="cta-section">
          <h2>Don't See What You're Looking For?</h2>
          <p>We're always open to new partnership opportunities</p>
          <div className="cta-buttons">
            <a 
              href="mailto:partnerships@bitcoinwriter.io" 
              className="cta-button primary"
            >
              Propose Partnership
            </a>
            <a 
              href="/docs" 
              className="cta-button secondary"
            >
              View Documentation
            </a>
          </div>
        </section>
        )}
      </div>
      <Footer />
      </div>
    </div>
  );
};

export default OffersPage;