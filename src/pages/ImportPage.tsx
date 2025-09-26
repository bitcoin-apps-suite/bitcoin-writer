import React, { useState } from 'react';
import './ImportPage.css';
import ImportSourcesModal from '../components/ImportSourcesModal';
import Footer from '../components/Footer';

const ImportPage: React.FC = () => {
  const [showImportModal, setShowImportModal] = useState(false);
  const [devSidebarCollapsed, setDevSidebarCollapsed] = useState(() => {
    const saved = localStorage.getItem('devSidebarCollapsed');
    return saved === 'true';
  });
  const [isMobile] = useState(window.innerWidth <= 768);

  React.useEffect(() => {
    // Listen for storage changes to detect sidebar collapse state
    const handleStorageChange = () => {
      const saved = localStorage.getItem('devSidebarCollapsed');
      setDevSidebarCollapsed(saved === 'true');
    };
    
    window.addEventListener('storage', handleStorageChange);
    
    // Check for sidebar state changes via polling
    const checkSidebarState = setInterval(() => {
      const saved = localStorage.getItem('devSidebarCollapsed');
      setDevSidebarCollapsed(saved === 'true');
    }, 100);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      clearInterval(checkSidebarState);
    };
  }, []);

  const features = [
    {
      icon: (
        <svg width="32" height="32" viewBox="0 0 24 24" fill="#4285F4">
          <path d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18,20H6V4H13V9H18V20M10,13H16V14H10M10,16H16V17H10M10,10H16V11H10"/>
        </svg>
      ),
      title: "Google Docs",
      description: "Import documents directly from Google Docs with formatting preserved"
    },
    {
      icon: (
        <svg width="32" height="32" viewBox="0 0 24 24" fill="#2B579A">
          <path d="M15.5,2H8.5A1.5,1.5 0 0,0 7,3.5V20.5A1.5,1.5 0 0,0 8.5,22H18.5A1.5,1.5 0 0,0 20,20.5V6.5L15.5,2M17,20H10V19H17V20M17,17H10V16H17V17M14,9L17,6V9H14M11.7,12.2L12.4,15.3L13.1,12.2H14.3L13,16.8H11.8L11,13.9L10.2,16.8H9L7.7,12.2H8.9L9.6,15.3L10.3,12.2H11.7Z"/>
        </svg>
      ),
      title: "Microsoft Word",
      description: "Native support for .docx and .doc files with full compatibility"
    },
    {
      icon: (
        <svg width="32" height="32" viewBox="0 0 24 24" fill="currentColor">
          <path d="M4.5,3H19.5A1.5,1.5 0 0,1 21,4.5V19.5A1.5,1.5 0 0,1 19.5,21H4.5A1.5,1.5 0 0,1 3,19.5V4.5A1.5,1.5 0 0,1 4.5,3M7.88,17.25L6.62,16L10.38,12.25L6.63,8.5L7.88,7.25L12.38,11.75V7H14.38V11.75L18.88,7.25L20.13,8.5L16.38,12.25L20.13,16L18.88,17.25L14.38,12.75V17.5H12.38V12.75L7.88,17.25Z"/>
        </svg>
      ),
      title: "Notion",
      description: "Seamlessly import from your Notion workspace and pages"
    },
    {
      icon: (
        <svg width="32" height="32" viewBox="0 0 24 24" fill="#7C3AED">
          <path d="M12,2L2,12L12,22L22,12L12,2M12,4.5L19.5,12L12,19.5L4.5,12L12,4.5M12,7L7,12L12,17L17,12L12,7Z"/>
        </svg>
      ),
      title: "Obsidian",
      description: "Bring your markdown notes from Obsidian with links intact"
    }
  ];

  const supportedServices = [
    "Google Docs", "Microsoft Word", "Dropbox Paper", "Quip", "Scrivener",
    "Ulysses", "iA Writer", "Hemingway", "Notion", "Obsidian", "Roam Research",
    "Evernote", "OneNote", "Bear", "Craft", "Logseq", "Joplin", "RemNote",
    "Google Drive", "OneDrive", "Dropbox", "Box", "iCloud", "WordPress",
    "Medium", "Substack", "Ghost", "LinkedIn", "Twitter/X", "And many more..."
  ];

  return (
    <div className={`import-page ${!isMobile ? (devSidebarCollapsed ? 'with-sidebar-collapsed' : 'with-sidebar-expanded') : ''}`}>
      {/* Hero Section */}
      <div id="hero" className="import-hero">
        <div className="import-badge">Universal Import</div>
        <h1>Import From Anywhere</h1>
        <p className="import-tagline">
          Connect to 40+ writing platforms and import your documents seamlessly. 
          Keep your workflow uninterrupted.
        </p>
        <button 
          className="import-hero-cta"
          onClick={() => setShowImportModal(true)}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" style={{marginRight: '8px'}}>
            <path d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18,20H6V4H13V9H18V20Z"/>
            <path d="M12,11L8,15H11V19H13V15H16L12,11Z"/>
          </svg>
          Open Import Modal
        </button>
      </div>

      {/* Main Content */}
      <div className="import-container">
        {/* Demo Section */}
        <section id="demo" className="import-demo-section">
          <h2>See It In Action</h2>
          <p className="import-section-subtitle">
            Click the button above to explore our comprehensive import interface
          </p>
          <div className="import-preview-card">
            <div className="import-preview-header">
              <div className="import-preview-dots">
                <span></span><span></span><span></span>
              </div>
              <span className="import-preview-title">Import Modal Preview</span>
            </div>
            <div className="import-preview-content">
              <div className="import-preview-categories">
                <span className="category-tag active">All Sources</span>
                <span className="category-tag">Writing Apps</span>
                <span className="category-tag">Note-taking</span>
                <span className="category-tag">Cloud Storage</span>
                <span className="category-tag">CMS & Blogs</span>
                <span className="category-tag">Social</span>
              </div>
              <div className="import-preview-grid">
                {features.map((feature, index) => (
                  <div key={index} className="import-preview-item">
                    <div className="import-preview-icon">{feature.icon}</div>
                    <span className="import-preview-name">{feature.title}</span>
                  </div>
                ))}
                <div className="import-preview-more">
                  <span>+36 More</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Grid */}
        <section id="features" className="import-features-section">
          <h2>Powerful Import Capabilities</h2>
          <div className="import-features-grid">
            {features.map((feature, index) => (
              <div key={index} className="import-feature-card">
                <div className="import-feature-icon">{feature.icon}</div>
                <h3>{feature.title}</h3>
                <p>{feature.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* How It Works */}
        <section id="how-it-works" className="import-how-section">
          <h2>How It Works</h2>
          <div className="import-steps">
            <div className="import-step">
              <div className="import-step-number">1</div>
              <h3>Choose Your Source</h3>
              <p>Select from 40+ supported writing platforms and file formats</p>
            </div>
            <div className="import-step-connector"></div>
            <div className="import-step">
              <div className="import-step-number">2</div>
              <h3>Connect or Upload</h3>
              <p>Authorize the service or upload your document files directly</p>
            </div>
            <div className="import-step-connector"></div>
            <div className="import-step">
              <div className="import-step-number">3</div>
              <h3>Encrypt & Mint as NFT</h3>
              <p>Encrypt and mint your work as NFTs on the blockchain for permanent ownership</p>
            </div>
            <div className="import-step-connector"></div>
            <div className="import-step">
              <div className="import-step-number">4</div>
              <h3>Sell Selective Access</h3>
              <p>Sell selective access with configurable options, pricing tiers, and reader permissions</p>
            </div>
            <div className="import-step-connector"></div>
            <div className="import-step">
              <div className="import-step-number">5</div>
              <h3>Issue Shares & Revenue Sharing</h3>
              <p>Issue shares in your work, enable revenue sharing, and trade them on the Bitcoin Writer exchange</p>
            </div>
          </div>
        </section>

        {/* Supported Services */}
        <section id="supported-services" className="import-services-section">
          <h2>All Supported Services</h2>
          <p className="import-section-subtitle">
            We support imports from all major writing platforms
          </p>
          <div className="import-services-list">
            {supportedServices.map((service, index) => (
              <span key={index} className="import-service-tag">
                {service}
              </span>
            ))}
          </div>
        </section>

        {/* Benefits */}
        <section id="benefits" className="import-benefits-section">
          <h2>Why Universal Import?</h2>
          <div className="import-benefits-grid">
            <div className="import-benefit">
              <svg width="48" height="48" viewBox="0 0 24 24" fill="#f7931a">
                <path d="M12,2C17.53,2 22,6.47 22,12C22,17.53 17.53,22 12,22C6.47,22 2,17.53 2,12C2,6.47 6.47,2 12,2M15.59,7L12,10.59L8.41,7L7,8.41L10.59,12L7,15.59L8.41,17L12,13.41L15.59,17L17,15.59L13.41,12L17,8.41L15.59,7Z"/>
              </svg>
              <h3>No Lock-In</h3>
              <p>Your content is never trapped. Import from anywhere, export to anywhere.</p>
            </div>
            <div className="import-benefit">
              <svg width="48" height="48" viewBox="0 0 24 24" fill="#f7931a">
                <path d="M12,18.17L8.83,15L7.42,16.41L12,21L16.59,16.41L15.17,15M12,5.83L15.17,9L16.58,7.59L12,3L7.41,7.59L8.83,9L12,5.83Z"/>
              </svg>
              <h3>Preserve Formatting</h3>
              <p>Maintain your document structure, styles, and formatting during import.</p>
            </div>
            <div className="import-benefit">
              <svg width="48" height="48" viewBox="0 0 24 24" fill="#f7931a">
                <path d="M13,9H11V7H13M13,17H11V11H13M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2Z"/>
              </svg>
              <h3>Quick Migration</h3>
              <p>Move your entire writing library to Bitcoin Writer in minutes, not hours.</p>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section id="get-started" className="import-cta-section">
          <h2>Ready to Import Your Content?</h2>
          <p>Start bringing your documents into the decentralized future</p>
          <button 
            className="import-cta-button"
            onClick={() => setShowImportModal(true)}
          >
            Try Import Now
          </button>
        </section>
      </div>

      {/* Import Modal */}
      {showImportModal && (
        <ImportSourcesModal 
          isOpen={showImportModal}
          onClose={() => setShowImportModal(false)}
          onImport={(content: string) => {
            console.log('Content imported:', content);
            setShowImportModal(false);
          }}
        />
      )}

      <Footer />
    </div>
  );
};

export default ImportPage;