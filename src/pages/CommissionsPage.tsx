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
          <h1>Bitcoin Writer <span style={{color: '#ffffff'}}>Enterprise</span></h1>
          <p className="commissions-tagline">
            Rebrand and repackage Bitcoin Writer for your publishing platform
          </p>
          <div className="commissions-badge">WHITE LABEL</div>
        </section>

        {/* Overview Section */}
        <section className="overview-section">
          <h2>White Label Licensing</h2>
          <div className="overview-content">
            <p>
              Publishers can rebrand and repackage Bitcoin Writer for their own platforms. While our 
              open-source nature means you could do this yourself, licensing through us provides 
              strategic advantages that multiply your platform's value.
            </p>
            <p>
              <strong>Why license instead of fork?</strong> By staying connected to the $BWRITER ecosystem, 
              you gain instant access to thousands of verified writers, developers, and publishers already 
              using the network. Your users can transact with the entire Bitcoin Writer community.
            </p>
            <div className="commission-points">
              <div className="point">
                <h3>Network Effects</h3>
                <p>Tap into our existing pool of writers and developers</p>
              </div>
              <div className="point">
                <h3>$BWRITER Integration</h3>
                <p>Native token support gives liquidity and instant utility</p>
              </div>
              <div className="point">
                <h3>Continuous Updates</h3>
                <p>Benefit from ongoing platform improvements</p>
              </div>
            </div>
          </div>
        </section>

        {/* Services Section */}
        <section className="services-section">
          <h2>What's Included</h2>
          <div className="services-grid">
            <div className="service-card">
              <h3>Platform Licensing</h3>
              <ul>
                <li>Full white-label rights to Bitcoin Writer</li>
                <li>Your branding, colors, and identity</li>
                <li>Custom domain and deployment</li>
                <li>Remove or customize Bitcoin Writer branding</li>
              </ul>
            </div>
            <div className="service-card">
              <h3>$BWRITER Ecosystem</h3>
              <ul>
                <li>Native $BWRITER token integration</li>
                <li>Access to global writer/developer pool</li>
                <li>Cross-platform content contracts</li>
                <li>Shared liquidity and network effects</li>
              </ul>
            </div>
            <div className="service-card">
              <h3>Technical Support</h3>
              <ul>
                <li>Setup and deployment assistance</li>
                <li>Ongoing platform updates</li>
                <li>Priority bug fixes and features</li>
                <li>Direct developer support channel</li>
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
              <h3>License Agreement</h3>
              <p>Simple licensing terms with affordable annual fee</p>
            </div>
            <div className="step">
              <div className="step-number">2</div>
              <h3>Customization</h3>
              <p>Apply your branding and configure platform settings</p>
            </div>
            <div className="step">
              <div className="step-number">3</div>
              <h3>Token Integration</h3>
              <p>Connect to $BWRITER ecosystem for instant liquidity</p>
            </div>
            <div className="step">
              <div className="step-number">4</div>
              <h3>Launch</h3>
              <p>Go live with access to our entire writer/developer network</p>
            </div>
          </div>
        </section>

        {/* Pricing Section */}
        <section className="pricing-section">
          <h2>Transparent Pricing</h2>
          <div className="pricing-content">
            <p>
              Our licensing fee is intentionally affordable because Bitcoin Writer is open-source. 
              You're not paying for the code - you're investing in network access and ecosystem benefits.
            </p>
            <div className="pricing-options">
              <div className="pricing-card">
                <h3>Startup</h3>
                <div className="price">$500/year</div>
                <p>Perfect for new publishers</p>
                <ul style={{textAlign: 'left', marginTop: '10px'}}>
                  <li>Full platform access</li>
                  <li>$BWRITER integration</li>
                  <li>Basic support</li>
                </ul>
              </div>
              <div className="pricing-card featured">
                <h3>Publisher</h3>
                <div className="price">$2,000/year</div>
                <p>For established platforms</p>
                <ul style={{textAlign: 'left', marginTop: '10px'}}>
                  <li>Everything in Startup</li>
                  <li>Priority support</li>
                  <li>Custom branding</li>
                  <li>API priority</li>
                </ul>
              </div>
              <div className="pricing-card">
                <h3>Enterprise</h3>
                <div className="price">$10,000/year</div>
                <p>Full white-label solution</p>
                <ul style={{textAlign: 'left', marginTop: '10px'}}>
                  <li>Everything in Publisher</li>
                  <li>Dedicated support</li>
                  <li>Custom features</li>
                  <li>SLA guarantee</li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="cta-section">
          <h2>Ready to Launch Your Platform?</h2>
          <p>Join the $BWRITER ecosystem and access thousands of writers instantly</p>
          <div className="cta-buttons">
            <a 
              href="mailto:licensing@bitcoinwriter.io" 
              className="cta-button primary"
            >
              Get Licensed
            </a>
            <a 
              href="https://github.com/bitcoin-apps-suite/bitcoin-writer" 
              className="cta-button secondary"
              target="_blank"
              rel="noopener noreferrer"
            >
              View Source Code
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