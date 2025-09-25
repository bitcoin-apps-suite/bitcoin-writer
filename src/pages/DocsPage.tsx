import React, { useState, useEffect } from 'react';
import './DocsPage.css';
import Footer from '../components/Footer';

const DocsPage: React.FC = () => {
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
      <div className={`docs-page ${!isMobile && !devSidebarCollapsed ? 'with-sidebar-expanded' : ''} ${!isMobile && devSidebarCollapsed ? 'with-sidebar-collapsed' : ''}`}>
      <div className="docs-container">
        {/* Hero Section */}
        <section className="docs-hero">
          <h1><span style={{color: '#ffffff'}}>Bitcoin Writer</span> Documentation</h1>
          <p className="docs-tagline">
            Complete guide to writing, encrypting, and publishing documents on the Bitcoin blockchain
          </p>
          <div className="docs-badge">DOCUMENTATION</div>
        </section>

        {/* Getting Started Section */}
        <section className="getting-started-section">
          <h2>Getting Started</h2>
          <div className="getting-started-content">
            <p>
              Bitcoin Writer is a <strong>decentralized document platform</strong> that stores your work 
              permanently on the Bitcoin blockchain. Create, encrypt, and monetize your documents with 
              cryptographic proof of authorship.
            </p>
            <p>
              This guide will walk you through authentication, document creation, blockchain features, 
              and monetization options to help you get the most out of the platform.
            </p>
            <div className="getting-started-points">
              <div className="point">
                <h3>Quick Setup</h3>
                <p>Connect with HandCash or Google in under 30 seconds</p>
              </div>
              <div className="point">
                <h3>Write Instantly</h3>
                <p>Rich text editor with auto-save and version control</p>
              </div>
              <div className="point">
                <h3>Blockchain Ready</h3>
                <p>One-click publishing to Bitcoin with proof of creation</p>
              </div>
            </div>
          </div>
        </section>

        {/* Authentication Section */}
        <section className="auth-section">
          <h2>Authentication & Setup</h2>
          <div className="model-card">
            <h3>Connect Your Accounts</h3>
            <ul>
              <li>
                <strong>HandCash (Recommended):</strong> Required for Bitcoin payments and blockchain features. 
                Provides secure wallet integration for document inscription and monetization
              </li>
              <li>
                <strong>Google Account:</strong> Optional for cloud storage and Google Drive integration. 
                Enables collaborative features and document backup
              </li>
              <li>
                <strong>First Document:</strong> Click "New Document" or use ⌘N to create your first document. 
                The editor supports rich text formatting and auto-saves as you type
              </li>
              <li>
                <strong>Save to Blockchain:</strong> Use ⌘B or click the blockchain save button to store 
                your document permanently on Bitcoin with cryptographic proof
              </li>
            </ul>
          </div>

          <div className="model-card warning">
            <h3>Important Setup Notes</h3>
            <ul>
              <li>
                <strong>HandCash Required:</strong> Blockchain features require HandCash wallet connection 
                and sufficient satoshis for transaction fees
              </li>
              <li>
                <strong>Browser Requirements:</strong> Modern browsers with JavaScript enabled. 
                Local storage required for document caching
              </li>
              <li>
                <strong>Network Connection:</strong> Internet required for blockchain operations, 
                cloud storage, and real-time collaboration features
              </li>
              <li>
                <strong>Mobile Support:</strong> Fully responsive design works on desktop, tablet, 
                and mobile devices with touch-optimized interface
              </li>
            </ul>
          </div>
        </section>

        {/* Writing & Editor Section */}
        <section className="writing-section">
          <h2>Writing & Document Management</h2>
          <div className="writing-content">
            <p className="intro">
              The Bitcoin Writer editor provides a powerful yet intuitive writing experience with 
              blockchain-native features built in.
            </p>

            <div className="writing-model">
              <h3>Editor Features</h3>
              <div className="feature-streams">
                <div className="stream">
                  <h4>Rich Text</h4>
                  <p>Bold, italic, underline formatting</p>
                  <p className="price">⌘B, ⌘I, ⌘U</p>
                </div>
                <div className="stream featured">
                  <h4>Auto-Save</h4>
                  <p>Documents save automatically as you type</p>
                  <p className="price">Real-time</p>
                </div>
                <div className="stream">
                  <h4>Version Control</h4>
                  <p>Every save creates blockchain version</p>
                  <p className="price">⌘B</p>
                </div>
              </div>
              
              <h3 style={{marginTop: '40px'}}>Keyboard Shortcuts</h3>
              <div className="feature-streams">
                <div className="stream">
                  <h4>Document Control</h4>
                  <p>New: ⌘N, Save: ⌘S, Blockchain: ⌘B</p>
                  <p className="price">Essential</p>
                </div>
                <div className="stream featured">
                  <h4>Text Formatting</h4>
                  <p>Bold: ⌘B, Italic: ⌘I, Underline: ⌘U</p>
                  <p className="price">Popular</p>
                </div>
                <div className="stream">
                  <h4>Security</h4>
                  <p>Encrypt: ⌘L, Find: ⌘F, Undo: ⌘Z</p>
                  <p className="price">Advanced</p>
                </div>
              </div>
            </div>

            <div className="value-flow">
              <h3>Document Workflow</h3>
              <div className="flow-diagram">
                <div className="flow-item">
                  <span>Create Document</span>
                  <span className="arrow">→</span>
                </div>
                <div className="flow-item">
                  <span>Write & Edit</span>
                  <span className="arrow">→</span>
                </div>
                <div className="flow-item">
                  <span>Save to Blockchain</span>
                  <span className="arrow">→</span>
                </div>
                <div className="flow-item">
                  <span>Publish & Monetize</span>
                </div>
              </div>
              <p style={{textAlign: 'center', marginTop: '20px', fontSize: '14px', color: 'rgba(255, 255, 255, 0.6)'}}>
                Every document follows this simple workflow from creation to monetization,
                with each step creating permanent blockchain records.
              </p>
            </div>
          </div>
        </section>

        {/* Blockchain Features Section */}
        <section className="blockchain-section">
          <h2>Blockchain Features</h2>
          <div className="blockchain-steps">
            <div className="step">
              <div className="step-number">1</div>
              <h3>Storage Options</h3>
              <p>Choose between on-chain, IPFS, or cloud storage for your documents</p>
            </div>
            <div className="step">
              <div className="step-number">2</div>
              <h3>Encryption</h3>
              <p>AES-256 encryption with password protection and key derivation</p>
            </div>
            <div className="step">
              <div className="step-number">3</div>
              <h3>Version Control</h3>
              <p>Every save creates timestamped, cryptographically linked versions</p>
            </div>
            <div className="step">
              <div className="step-number">4</div>
              <h3>Proof System</h3>
              <p>Mathematical proof of creation time and document integrity</p>
            </div>
          </div>

          <div className="blockchain-examples">
            <h3>Storage Methods</h3>
            <ul>
              <li>✅ Direct On-Chain (OP_RETURN) - $1-5, permanent, immutable</li>
              <li>✅ IPFS with Hash - $0.10-0.50, unlimited size, decentralized</li>
              <li>✅ Cloud Providers - $0.01-0.10, fast access, familiar interface</li>
              <li>✅ Hybrid Storage - Best of both worlds, redundant backup</li>
              <li>✅ Encrypted Options - All methods support AES-256 encryption</li>
              <li>✅ Version Chains - Cryptographic links between document versions</li>
            </ul>
          </div>
        </section>

        {/* Monetization Section */}
        <section className="monetization-section">
          <h2>Monetization & NFTs</h2>
          <div className="monetization-grid">
            <div className="stat">
              <h3>NFT Creation</h3>
              <p className="stat-value">1-Click</p>
              <p className="stat-label">Turn documents into Bitcoin ordinals</p>
            </div>
            <div className="stat">
              <h3>File Shares</h3>
              <p className="stat-value">1M</p>
              <p className="stat-label">Shares per document version</p>
            </div>
            <div className="stat">
              <h3>Paywall Docs</h3>
              <p className="stat-value">Custom</p>
              <p className="stat-label">Set your own unlock price</p>
            </div>
            <div className="stat">
              <h3>Trading</h3>
              <p className="stat-value">24/7</p>
              <p className="stat-label">Document Exchange marketplace</p>
            </div>
          </div>
        </section>

        {/* API Reference Section */}
        <section className="api-section">
          <h2>API Reference</h2>
          <div className="api-content">
            <p>
              <strong>REST API:</strong> Bitcoin Writer provides a comprehensive REST API for document 
              management, blockchain operations, and user authentication. Perfect for building custom 
              integrations and third-party applications.
            </p>
            <p>
              <strong>HandCash SDK:</strong> Built on the HandCash Connect SDK for seamless Bitcoin 
              payments and wallet integration. Handles authentication, payments, and blockchain transactions 
              with enterprise-grade security.
            </p>
            <div className="api-endpoints">
              <h3>Core Endpoints</h3>
              <div className="endpoint-grid">
                <div className="endpoint">
                  <h4>Documents</h4>
                  <p>POST /api/documents - Create new document</p>
                  <p>GET /api/documents/:id - Retrieve document</p>
                  <p>PUT /api/documents/:id - Update document</p>
                  <p>DELETE /api/documents/:id - Delete document</p>
                </div>
                <div className="endpoint">
                  <h4>Blockchain</h4>
                  <p>POST /api/blockchain/save - Save to blockchain</p>
                  <p>POST /api/nft/create - Create NFT</p>
                  <p>POST /api/shares/issue - Issue file shares</p>
                  <p>GET /api/blockchain/verify - Verify integrity</p>
                </div>
                <div className="endpoint">
                  <h4>Exchange</h4>
                  <p>GET /api/exchange/browse - Browse marketplace</p>
                  <p>POST /api/exchange/purchase - Buy document</p>
                  <p>POST /api/exchange/publish - Publish for sale</p>
                  <p>GET /api/exchange/stats - Market statistics</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Troubleshooting Section */}
        <section className="troubleshooting-section">
          <h2>Troubleshooting & Support</h2>
          <div className="troubleshooting-content">
            <div className="faq-grid">
              <div className="faq-item">
                <h4>HandCash Login Issues</h4>
                <p>Clear browser cache, try incognito mode, ensure latest HandCash app installed</p>
              </div>
              <div className="faq-item">
                <h4>Document Won't Save</h4>
                <p>Check HandCash balance for fees, verify internet connection, try different storage method</p>
              </div>
              <div className="faq-item">
                <h4>Encryption Problems</h4>
                <p>Double-check password, Bitcoin Writer cannot recover lost passwords for security</p>
              </div>
              <div className="faq-item">
                <h4>NFT Creation Failed</h4>
                <p>Ensure sufficient funds in HandCash wallet, check network connectivity, try again</p>
              </div>
            </div>

            <div className="support-links">
              <h3>Get Help</h3>
              <div className="support-grid">
                <div className="support-item">
                  <h4>GitHub Issues</h4>
                  <p>Report bugs and request features</p>
                  <a href="https://github.com/bitcoin-apps-suite/bitcoin-writer/issues" target="_blank" rel="noopener noreferrer">
                    Submit Issue
                  </a>
                </div>
                <div className="support-item">
                  <h4>Twitter Support</h4>
                  <p>Quick help and updates</p>
                  <a href="https://twitter.com/bitcoin_writer" target="_blank" rel="noopener noreferrer">
                    @bitcoin_writer
                  </a>
                </div>
                <div className="support-item">
                  <h4>Developer Contact</h4>
                  <p>Direct developer access</p>
                  <a href="https://twitter.com/b0ase" target="_blank" rel="noopener noreferrer">
                    @b0ase
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="cta-section">
          <h2>Ready to Start Writing?</h2>
          <div className="cta-buttons">
            <a 
              href="/" 
              className="cta-btn primary"
            >
              <svg height="20" width="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18,20H6V4H13V9H18V20Z"/>
              </svg>
              Start Writing
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
    <Footer />
    </div>
  );
};

export default DocsPage;