import React, { useState, useEffect } from 'react';
import './GrantsPage.css';
import Footer from '../components/Footer';

const GrantsPage: React.FC = () => {
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
      <div className={`grants-page ${!isMobile && !devSidebarCollapsed ? 'with-sidebar-expanded' : ''} ${!isMobile && devSidebarCollapsed ? 'with-sidebar-collapsed' : ''}`}>
      <div className="grants-container">
        {/* Hero Section */}
        <section className="grants-hero">
          <h1>Bitcoin Writer <span style={{color: '#ffffff'}}>Grants</span></h1>
          <p className="grants-tagline">
            Funding innovation in BSV development and adoption
          </p>
          <div className="grants-badge">GRANTS</div>
        </section>

        {/* Overview Section */}
        <section className="overview-section">
          <h2>Developer Grant Program</h2>
          <div className="overview-content">
            <p>
              The Bitcoin Writer Grant Program provides funding for developers building 
              innovative features, integrations, and applications that enhance the Bitcoin 
              Writer ecosystem.
            </p>
            <p>
              We allocate grants quarterly to projects that demonstrate technical merit, 
              community value, and alignment with our open-source mission.
            </p>
            <div className="grant-stats">
              <div className="stat">
                <div className="stat-value">$100,000</div>
                <div className="stat-label">Annual Budget</div>
              </div>
              <div className="stat">
                <div className="stat-value">$1-25K</div>
                <div className="stat-label">Per Grant</div>
              </div>
              <div className="stat">
                <div className="stat-value">Q1 2025</div>
                <div className="stat-label">Next Round</div>
              </div>
            </div>
          </div>
        </section>

        {/* Grant Categories Section */}
        <section className="categories-section">
          <h2>What We Fund</h2>
          <div className="categories-grid">
            <div className="category-card">
              <h3>Core Development</h3>
              <p>
                Improvements to the Bitcoin Writer core application, including 
                performance optimizations, new features, and bug fixes.
              </p>
              <div className="grant-range">$5,000 - $25,000</div>
            </div>

            <div className="category-card">
              <h3>Integrations</h3>
              <p>
                Connect Bitcoin Writer with other BSV applications, services, 
                and platforms to expand functionality.
              </p>
              <div className="grant-range">$2,500 - $15,000</div>
            </div>

            <div className="category-card">
              <h3>UI/UX Innovation</h3>
              <p>
                Design improvements, accessibility features, and user experience 
                enhancements that make Bitcoin Writer better for everyone.
              </p>
              <div className="grant-range">$1,000 - $10,000</div>
            </div>

            <div className="category-card">
              <h3>Documentation</h3>
              <p>
                Comprehensive guides, tutorials, API documentation, and educational 
                content for developers and users.
              </p>
              <div className="grant-range">$500 - $5,000</div>
            </div>

            <div className="category-card">
              <h3>Research</h3>
              <p>
                Blockchain research, cryptographic innovations, and experimental 
                features that push the boundaries.
              </p>
              <div className="grant-range">$5,000 - $20,000</div>
            </div>

            <div className="category-card">
              <h3>Community Tools</h3>
              <p>
                Tools, plugins, and applications that help the community 
                use and extend Bitcoin Writer.
              </p>
              <div className="grant-range">$1,000 - $7,500</div>
            </div>
          </div>
        </section>

        {/* Recent Grants Section */}
        <section className="recent-grants-section">
          <h2>Recent Grant Recipients</h2>
          <div className="grants-list">
            <div className="grant-item">
              <div className="grant-header">
                <h3>Markdown Export Plugin</h3>
                <span className="grant-amount">$3,500</span>
              </div>
              <p>Advanced markdown export with preservation of blockchain metadata</p>
              <div className="grant-meta">
                <span className="grant-developer">@devuser1</span>
                <span className="grant-date">December 2024</span>
              </div>
            </div>

            <div className="grant-item">
              <div className="grant-header">
                <h3>HandCash Wallet Integration</h3>
                <span className="grant-amount">$7,500</span>
              </div>
              <p>Seamless payment integration with HandCash Connect SDK</p>
              <div className="grant-meta">
                <span className="grant-developer">@blockchain_dev</span>
                <span className="grant-date">November 2024</span>
              </div>
            </div>

            <div className="grant-item">
              <div className="grant-header">
                <h3>Accessibility Improvements</h3>
                <span className="grant-amount">$5,000</span>
              </div>
              <p>Screen reader support and keyboard navigation enhancements</p>
              <div className="grant-meta">
                <span className="grant-developer">@a11y_expert</span>
                <span className="grant-date">October 2024</span>
              </div>
            </div>
          </div>
        </section>

        {/* Application Process Section */}
        <section className="process-section">
          <h2>How to Apply</h2>
          <div className="process-steps">
            <div className="step">
              <div className="step-number">1</div>
              <h3>Submit Proposal</h3>
              <p>Create a detailed proposal outlining your project and budget</p>
            </div>
            <div className="step">
              <div className="step-number">2</div>
              <h3>Review Period</h3>
              <p>Our team reviews proposals and may request additional information</p>
            </div>
            <div className="step">
              <div className="step-number">3</div>
              <h3>Approval</h3>
              <p>Approved grants receive initial funding to begin development</p>
            </div>
            <div className="step">
              <div className="step-number">4</div>
              <h3>Milestones</h3>
              <p>Receive remaining funds as you complete project milestones</p>
            </div>
          </div>
        </section>

        {/* Evaluation Criteria Section */}
        <section className="criteria-section">
          <h2>Evaluation Criteria</h2>
          <div className="criteria-grid">
            <div className="criterion">
              <h3>Technical Merit</h3>
              <p>Sound technical approach and feasibility of implementation</p>
            </div>
            <div className="criterion">
              <h3>Community Impact</h3>
              <p>Benefit to Bitcoin Writer users and the broader BSV ecosystem</p>
            </div>
            <div className="criterion">
              <h3>Innovation</h3>
              <p>Novel approaches and creative solutions to existing problems</p>
            </div>
            <div className="criterion">
              <h3>Team Experience</h3>
              <p>Demonstrated ability to deliver on proposed objectives</p>
            </div>
            <div className="criterion">
              <h3>Open Source</h3>
              <p>Commitment to open-source principles and collaboration</p>
            </div>
            <div className="criterion">
              <h3>Sustainability</h3>
              <p>Long-term viability and maintenance plan for the project</p>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="cta-section">
          <h2>Ready to Build the Future?</h2>
          <p>Apply for a grant and help shape the future of decentralized writing</p>
          <div className="cta-buttons">
            <a 
              href="https://github.com/bitcoin-apps-suite/bitcoin-writer/issues/new?template=grant-proposal.md" 
              className="cta-button primary"
              target="_blank"
              rel="noopener noreferrer"
            >
              Submit Proposal
            </a>
            <a 
              href="/docs#grants" 
              className="cta-button secondary"
            >
              Grant Guidelines
            </a>
          </div>
        </section>
      </div>
      <Footer />
      </div>
    </div>
  );
};

export default GrantsPage;