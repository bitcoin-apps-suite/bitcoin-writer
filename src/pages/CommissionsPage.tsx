import React, { useState, useEffect } from 'react';
import './CommissionsPage.css';
import Footer from '../components/Footer';

const CommissionsPage: React.FC = () => {
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
      <div className={`commissions-page ${!isMobile && !devSidebarCollapsed ? 'with-sidebar-expanded' : ''} ${!isMobile && devSidebarCollapsed ? 'with-sidebar-collapsed' : ''}`}>
      <div className="commissions-container">
        {/* Hero Section */}
        <section className="commissions-hero">
          <h1>Bitcoin Writer <span style={{color: '#ffffff'}}>Commissions</span></h1>
          <p className="commissions-tagline">
            Custom development and bespoke features for your organization
          </p>
          <div className="commissions-badge">COMMISSIONS</div>
        </section>

        {/* Overview Section */}
        <section className="overview-section">
          <h2>Custom Development Services</h2>
          <div className="overview-content">
            <p>
              Need specific features for your organization? Our team can build custom solutions 
              tailored to your exact requirements. From enterprise integrations to specialized 
              document workflows, we deliver professional-grade customizations.
            </p>
            <p>
              All commissioned work maintains our commitment to open-source principles while 
              giving you the specific functionality your team needs to succeed.
            </p>
            <div className="commission-points">
              <div className="point">
                <h3>Enterprise Ready</h3>
                <p>Custom authentication, compliance features, and integrations</p>
              </div>
              <div className="point">
                <h3>White Label</h3>
                <p>Your branding, your domain, your rules</p>
              </div>
              <div className="point">
                <h3>Priority Support</h3>
                <p>Direct access to our development team</p>
              </div>
            </div>
          </div>
        </section>

        {/* Services Section */}
        <section className="services-section">
          <h2>Available Services</h2>
          <div className="services-grid">
            <div className="service-card">
              <h3>Custom Features</h3>
              <ul>
                <li>Specialized document types and templates</li>
                <li>Advanced workflow automation</li>
                <li>Custom blockchain integrations</li>
                <li>Proprietary encryption methods</li>
              </ul>
            </div>
            <div className="service-card">
              <h3>Enterprise Integration</h3>
              <ul>
                <li>SSO and identity management</li>
                <li>API development and webhooks</li>
                <li>Database synchronization</li>
                <li>Legacy system compatibility</li>
              </ul>
            </div>
            <div className="service-card">
              <h3>White Label Solutions</h3>
              <ul>
                <li>Custom branding and themes</li>
                <li>Private deployment options</li>
                <li>Dedicated infrastructure</li>
                <li>Custom domain setup</li>
              </ul>
            </div>
          </div>
        </section>

        {/* Process Section */}
        <section className="process-section">
          <h2>How It Works</h2>
          <div className="process-steps">
            <div className="step">
              <div className="step-number">1</div>
              <h3>Discovery</h3>
              <p>We discuss your requirements and provide a detailed proposal</p>
            </div>
            <div className="step">
              <div className="step-number">2</div>
              <h3>Development</h3>
              <p>Our team builds your custom solution with regular updates</p>
            </div>
            <div className="step">
              <div className="step-number">3</div>
              <h3>Deployment</h3>
              <p>We deploy, test, and ensure everything works perfectly</p>
            </div>
            <div className="step">
              <div className="step-number">4</div>
              <h3>Support</h3>
              <p>Ongoing maintenance and priority support for your solution</p>
            </div>
          </div>
        </section>

        {/* Pricing Section */}
        <section className="pricing-section">
          <h2>Pricing</h2>
          <div className="pricing-content">
            <p>
              Commissions are priced based on scope and complexity. We offer both fixed-price 
              and hourly engagement models.
            </p>
            <div className="pricing-options">
              <div className="pricing-card">
                <h3>Small Features</h3>
                <div className="price">$2,500 - $10,000</div>
                <p>1-2 week turnaround</p>
              </div>
              <div className="pricing-card">
                <h3>Major Features</h3>
                <div className="price">$10,000 - $50,000</div>
                <p>2-8 week development</p>
              </div>
              <div className="pricing-card">
                <h3>Enterprise</h3>
                <div className="price">Custom Quote</div>
                <p>Dedicated team & timeline</p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="cta-section">
          <h2>Ready to Build?</h2>
          <p>Let's discuss your custom development needs</p>
          <div className="cta-buttons">
            <a 
              href="mailto:commissions@bitcoinwriter.io" 
              className="cta-button primary"
            >
              Start a Project
            </a>
            <a 
              href="https://github.com/bitcoin-apps-suite/bitcoin-writer/issues/new" 
              className="cta-button secondary"
              target="_blank"
              rel="noopener noreferrer"
            >
              Submit Requirements
            </a>
          </div>
        </section>
      </div>
      <Footer />
      </div>
    </div>
  );
};

export default CommissionsPage;