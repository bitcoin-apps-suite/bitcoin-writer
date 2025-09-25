import React, { useState, useEffect } from 'react';
import './OffersPage.css';
import Footer from '../components/Footer';

const OffersPage: React.FC = () => {
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
      <div className={`offers-page ${!isMobile && !devSidebarCollapsed ? 'with-sidebar-expanded' : ''} ${!isMobile && devSidebarCollapsed ? 'with-sidebar-collapsed' : ''}`}>
      <div className="offers-container">
        {/* Hero Section */}
        <section className="offers-hero">
          <h1>Bitcoin Writer <span style={{color: '#ffffff'}}>Offers</span></h1>
          <p className="offers-tagline">
            Special opportunities for developers and partners
          </p>
          <div className="offers-badge">OFFERS</div>
        </section>

        {/* Current Offers Section */}
        <section className="current-offers-section">
          <h2>Active Offers</h2>
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

        {/* Partner Benefits Section */}
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

        {/* CTA Section */}
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
      </div>
      <Footer />
      </div>
    </div>
  );
};

export default OffersPage;