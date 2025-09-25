import React, { useState, useEffect } from 'react';
import './ChangelogPage.css';
import Footer from '../components/Footer';

const ChangelogPage: React.FC = () => {
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
      <div className={`changelog-page ${!isMobile && !devSidebarCollapsed ? 'with-sidebar-expanded' : ''} ${!isMobile && devSidebarCollapsed ? 'with-sidebar-collapsed' : ''}`}>
      <div className="changelog-container">
        {/* Hero Section */}
        <section className="changelog-hero">
          <h1>Bitcoin Writer <span style={{color: '#ffffff'}}>Changelog</span></h1>
          <p className="changelog-tagline">
            Track every improvement, feature, and update
          </p>
          <div className="changelog-badge">VERSION 1.0.0</div>
        </section>

        {/* Version 1.0.0 */}
        <section className="changelog-entry">
          <div className="version-header">
            <h2>Version 1.0.0</h2>
            <span className="release-date">January 15, 2025</span>
          </div>
          <div className="version-tag major">Major Release</div>
          
          <div className="changes-section">
            <h3>Features</h3>
            <ul>
              <li>Initial public release of Bitcoin Writer</li>
              <li>Full BSV blockchain integration for document storage</li>
              <li>Real-time collaborative editing with WebRTC</li>
              <li>HandCash wallet integration for payments</li>
              <li>Developer Hub with task management</li>
              <li>Token system for contributor rewards</li>
              <li>API for third-party integrations</li>
            </ul>
          </div>

          <div className="changes-section">
            <h3>Improvements</h3>
            <ul>
              <li>Optimized blockchain writes for reduced transaction costs</li>
              <li>Enhanced editor performance for large documents</li>
              <li>Improved mobile responsiveness</li>
              <li>Dark mode optimization</li>
            </ul>
          </div>

          <div className="changes-section">
            <h3>Developer Tools</h3>
            <ul>
              <li>REST API v1.0 release</li>
              <li>JavaScript/TypeScript SDK</li>
              <li>Python SDK</li>
              <li>Comprehensive documentation</li>
            </ul>
          </div>
        </section>

        {/* Version 0.9.5 */}
        <section className="changelog-entry">
          <div className="version-header">
            <h2>Version 0.9.5 Beta</h2>
            <span className="release-date">December 20, 2024</span>
          </div>
          <div className="version-tag beta">Beta Release</div>
          
          <div className="changes-section">
            <h3>Features</h3>
            <ul>
              <li>Added grant program for developers</li>
              <li>Commission marketplace launched</li>
              <li>Special offers system implemented</li>
              <li>Enhanced contributor tracking</li>
            </ul>
          </div>

          <div className="changes-section">
            <h3>Bug Fixes</h3>
            <ul>
              <li>Fixed wallet connection issues on mobile</li>
              <li>Resolved document sync conflicts</li>
              <li>Corrected token distribution calculations</li>
              <li>Fixed DevSidebar positioning issues</li>
            </ul>
          </div>
        </section>

        {/* Version 0.9.0 */}
        <section className="changelog-entry">
          <div className="version-header">
            <h2>Version 0.9.0 Beta</h2>
            <span className="release-date">November 15, 2024</span>
          </div>
          <div className="version-tag beta">Beta Release</div>
          
          <div className="changes-section">
            <h3>Features</h3>
            <ul>
              <li>Introduced $BWRITER token</li>
              <li>Task management system</li>
              <li>Contract templates</li>
              <li>GitHub integration</li>
            </ul>
          </div>

          <div className="changes-section">
            <h3>Improvements</h3>
            <ul>
              <li>Faster document loading</li>
              <li>Reduced memory usage</li>
              <li>Better error handling</li>
              <li>Improved accessibility</li>
            </ul>
          </div>

          <div className="changes-section">
            <h3>Security</h3>
            <ul>
              <li>Enhanced encryption for stored documents</li>
              <li>Improved authentication flow</li>
              <li>Added rate limiting to API endpoints</li>
            </ul>
          </div>
        </section>

        {/* Version 0.8.0 */}
        <section className="changelog-entry">
          <div className="version-header">
            <h2>Version 0.8.0 Alpha</h2>
            <span className="release-date">October 1, 2024</span>
          </div>
          <div className="version-tag alpha">Alpha Release</div>
          
          <div className="changes-section">
            <h3>Features</h3>
            <ul>
              <li>Basic document editor</li>
              <li>BSV blockchain writing</li>
              <li>User authentication</li>
              <li>Document verification</li>
            </ul>
          </div>

          <div className="changes-section">
            <h3>Known Issues</h3>
            <ul>
              <li>Limited mobile support</li>
              <li>Performance issues with large documents</li>
              <li>Wallet integration incomplete</li>
            </ul>
          </div>
        </section>

        {/* Upcoming Section */}
        <section className="upcoming-section">
          <h2>Upcoming in v1.1.0</h2>
          <div className="upcoming-grid">
            <div className="upcoming-card">
              <h3>NFT Support</h3>
              <p>Create and trade document NFTs</p>
            </div>
            <div className="upcoming-card">
              <h3>AI Assistant</h3>
              <p>AI-powered writing suggestions</p>
            </div>
            <div className="upcoming-card">
              <h3>Advanced Analytics</h3>
              <p>Document performance metrics</p>
            </div>
            <div className="upcoming-card">
              <h3>Plugin System</h3>
              <p>Extensible plugin architecture</p>
            </div>
            <div className="upcoming-card">
              <h3>Team Workspaces</h3>
              <p>Collaborative team environments</p>
            </div>
            <div className="upcoming-card">
              <h3>Mobile Apps</h3>
              <p>Native iOS and Android apps</p>
            </div>
          </div>
        </section>

        {/* Subscribe Section */}
        <section className="subscribe-section">
          <h2>Stay Updated</h2>
          <p>Get notified about new releases and features</p>
          <div className="subscribe-buttons">
            <a 
              href="https://github.com/bitcoin-apps-suite/bitcoin-writer/releases" 
              className="subscribe-button primary"
              target="_blank"
              rel="noopener noreferrer"
            >
              Watch on GitHub
            </a>
            <a 
              href="https://discord.gg/xBB8r8dj" 
              className="subscribe-button secondary"
              target="_blank"
              rel="noopener noreferrer"
            >
              Join Discord
            </a>
          </div>
        </section>
      </div>
      <Footer />
      </div>
    </div>
  );
};

export default ChangelogPage;