import React, { useState } from 'react';
import './PlatformPage.css';
import Footer from '../components/Footer';

interface PublishingPlatform {
  id: string;
  name: string;
  description: string;
  logo: string;
  category: 'traditional' | 'crypto' | 'open-source' | 'social';
  features: string[];
  integration: boolean;
  website: string;
  tokenization: boolean;
}

const PlatformPage: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState<'all' | 'traditional' | 'crypto' | 'open-source' | 'social'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const publishingPlatforms: PublishingPlatform[] = [
    {
      id: 'medium',
      name: 'Medium',
      description: 'Professional publishing platform with built-in audience',
      logo: '📝',
      category: 'traditional',
      features: ['Partner Program', 'Large Audience', 'Editorial Support'],
      integration: true,
      website: 'https://medium.com',
      tokenization: false
    },
    {
      id: 'substack',
      name: 'Substack',
      description: 'Newsletter platform for independent writers',
      logo: '📧',
      category: 'traditional',
      features: ['Paid Subscriptions', 'Email Lists', 'Analytics'],
      integration: true,
      website: 'https://substack.com',
      tokenization: false
    },
    {
      id: 'ghost',
      name: 'Ghost',
      description: 'Open-source publishing platform for creators',
      logo: '👻',
      category: 'open-source',
      features: ['Self-hosted', 'Custom Themes', 'Membership'],
      integration: false,
      website: 'https://ghost.org',
      tokenization: false
    },
    {
      id: 'mirror',
      name: 'Mirror',
      description: 'Decentralized publishing on Web3',
      logo: '🪞',
      category: 'crypto',
      features: ['NFT Publishing', 'Token Gating', 'DAO Integration'],
      integration: true,
      website: 'https://mirror.xyz',
      tokenization: true
    },
    {
      id: 'hashnode',
      name: 'Hashnode',
      description: 'Developer-focused blogging platform',
      logo: '💻',
      category: 'traditional',
      features: ['Custom Domain', 'SEO Optimized', 'Developer Tools'],
      integration: false,
      website: 'https://hashnode.com',
      tokenization: false
    },
    {
      id: 'devto',
      name: 'Dev.to',
      description: 'Community-driven platform for developers',
      logo: '🛠️',
      category: 'social',
      features: ['Open Source', 'Community', 'Free'],
      integration: false,
      website: 'https://dev.to',
      tokenization: false
    },
    {
      id: 'wordpress',
      name: 'WordPress',
      description: 'World\'s most popular content management system',
      logo: '📰',
      category: 'open-source',
      features: ['Plugins', 'Themes', 'SEO'],
      integration: false,
      website: 'https://wordpress.org',
      tokenization: false
    },
    {
      id: 'linkedin',
      name: 'LinkedIn',
      description: 'Professional networking with publishing features',
      logo: '💼',
      category: 'social',
      features: ['Professional Network', 'Career Growth', 'B2B Audience'],
      integration: true,
      website: 'https://linkedin.com',
      tokenization: false
    }
  ];

  const filteredPlatforms = publishingPlatforms.filter(platform => {
    const matchesCategory = activeCategory === 'all' || platform.category === activeCategory;
    const matchesSearch = searchQuery === '' || 
      platform.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      platform.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="platform-page">
      <div className="platform-header">
        <h1><span style={{color: '#f7931a'}}>Bitcoin Writer</span> Platform</h1>
        <p className="tagline">Write Once, Preserve Forever on the Blockchain</p>
      </div>

      <section className="platform-section">
        <h2>What is Bitcoin Writer?</h2>
        <p>
          Bitcoin Writer is a revolutionary document platform that transforms your writing into 
          verifiable blockchain assets. Every keystroke is automatically hashed to the Bitcoin SV 
          blockchain, creating a permanent, timestamped record of your work with cryptographic 
          proof of authorship and version history.
        </p>
      </section>

      <section className="platform-section">
        <h2>How It Works</h2>
        <div className="how-it-works-grid">
          <div className="step">
            <div className="step-number">1</div>
            <h3>Write Your Document</h3>
            <p>
              Start writing in our editor. As you type, your document is automatically saved 
              and prepared for blockchain storage.
            </p>
          </div>
          <div className="step">
            <div className="step-number">2</div>
            <h3>Automatic Hashing</h3>
            <p>
              When you stop typing, Bitcoin Writer creates a cryptographic hash of your 
              document. Each new version contains the hash of the previous version, 
              creating an unbreakable chain of authenticity.
            </p>
          </div>
          <div className="step">
            <div className="step-number">3</div>
            <h3>Blockchain Storage</h3>
            <p>
              Your document is inscribed onto the Bitcoin SV blockchain using micro-ordinals, 
              making it permanently accessible and verifiable by anyone, forever.
            </p>
          </div>
          <div className="step">
            <div className="step-number">4</div>
            <h3>Value Creation</h3>
            <p>
              Your document becomes a unique digital asset (UTXO) that accretes value over 
              time. Each revision adds to its history and worth, like a coin collecting 
              inscriptions.
            </p>
          </div>
        </div>
      </section>

      <section className="platform-section">
        <h2>Key Features</h2>
        <div className="features-grid">
          <div className="feature">
            <div className="feature-icon">🔒</div>
            <h3>Immutable Storage</h3>
            <p>Once written to the blockchain, your documents cannot be altered or deleted</p>
          </div>
          <div className="feature">
            <div className="feature-icon">⏰</div>
            <h3>Timestamped Forever</h3>
            <p>Every version has a permanent timestamp proving when it was created</p>
          </div>
          <div className="feature">
            <div className="feature-icon">🔐</div>
            <h3>End-to-End Encryption</h3>
            <p>Optional encryption ensures only you and chosen readers can access content</p>
          </div>
          <div className="feature">
            <div className="feature-icon">💎</div>
            <h3>Bitcoin OS Assets</h3>
            <p>Save documents as Bitcoin OS assets with built-in ownership and royalties</p>
          </div>
          <div className="feature">
            <div className="feature-icon">🌍</div>
            <h3>Global Publishing Network</h3>
            <p>Publish to a legally compliant, scalable network that respects both creators and law</p>
          </div>
          <div className="feature">
            <div className="feature-icon">💰</div>
            <h3>Micropayments</h3>
            <p>Readers can pay tiny amounts to access premium content instantly</p>
          </div>
        </div>
      </section>

      <section className="platform-section">
        <h2>For Developers</h2>
        <div className="developer-info">
          <h3>Open Source & Decentralized</h3>
          <p>
            Bitcoin Writer is built on open-source principles with a decentralized architecture. 
            Developers can contribute to the platform, build integrations, or fork the project 
            to create their own blockchain-based writing applications.
          </p>
          
          <h3>Technical Stack</h3>
          <ul>
            <li><strong>Frontend:</strong> React, TypeScript, Web3 Integration</li>
            <li><strong>Blockchain:</strong> Bitcoin SV, Micro-ordinals Protocol</li>
            <li><strong>Storage:</strong> IPFS for large files, BSV for metadata</li>
            <li><strong>Payments:</strong> HandCash Connect SDK</li>
            <li><strong>Smart Contracts:</strong> sCrypt for advanced features</li>
          </ul>

          <h3>BWRITER Token</h3>
          <p>
            The platform uses BWRITER tokens to incentivize development and reward contributors. 
            Developers earn tokens by completing tasks, fixing bugs, and adding features. 
            The token distribution is transparent and managed through GitHub issues.
          </p>
        </div>
      </section>

      <section className="platform-section">
        <h2>Use Cases</h2>
        <div className="use-cases">
          <div className="use-case">
            <h3>📚 Authors & Publishers</h3>
            <p>Publish books with proof of authorship and automatic royalty distribution</p>
          </div>
          <div className="use-case">
            <h3>📰 Journalists</h3>
            <p>Create articles with verifiable timestamps and cryptographic proof of authorship</p>
          </div>
          <div className="use-case">
            <h3>🎓 Academics</h3>
            <p>Establish priority for research with immutable publication dates</p>
          </div>
          <div className="use-case">
            <h3>⚖️ Legal Documents</h3>
            <p>Store contracts and agreements with cryptographic proof of authenticity</p>
          </div>
          <div className="use-case">
            <h3>💭 Personal Archives</h3>
            <p>Preserve memoirs, journals, and family histories forever</p>
          </div>
          <div className="use-case">
            <h3>🎨 Creative Writing</h3>
            <p>Monetize poetry, stories, and scripts with micropayment access</p>
          </div>
        </div>
      </section>

      <section className="platform-section">
        <h2>The Vision</h2>
        <p className="vision-text">
          Bitcoin Writer reimagines publishing for the digital age. By combining the permanence 
          of blockchain with the flexibility of modern writing tools, we're creating a new 
          paradigm where writers truly own their work, readers can verify authenticity, and 
          great writing becomes a lasting digital asset.
        </p>
        <p className="vision-text">
          In a world where digital content can be easily copied, modified, or deleted, 
          Bitcoin Writer provides the solution: immutable, verifiable, and valuable writing 
          that exists forever on the world's most secure distributed ledger.
        </p>
      </section>

      {/* Publishing Platform Integration Section */}
      <section className="platform-section">
        <h2>🚀 Platform Integrations</h2>
        <p>Integrate Bitcoin Writer with your favorite publishing platforms to reach wider audiences while maintaining blockchain provenance.</p>
        
        <div className="platforms-header">
          <div className="platforms-controls">
            <input
              type="text"
              placeholder="Search platforms..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="platform-search"
            />
            <div className="category-filters">
              <button 
                className={`filter-btn ${activeCategory === 'all' ? 'active' : ''}`}
                onClick={() => setActiveCategory('all')}
              >
                All
              </button>
              <button 
                className={`filter-btn ${activeCategory === 'traditional' ? 'active' : ''}`}
                onClick={() => setActiveCategory('traditional')}
              >
                Traditional
              </button>
              <button 
                className={`filter-btn ${activeCategory === 'crypto' ? 'active' : ''}`}
                onClick={() => setActiveCategory('crypto')}
              >
                Crypto
              </button>
              <button 
                className={`filter-btn ${activeCategory === 'open-source' ? 'active' : ''}`}
                onClick={() => setActiveCategory('open-source')}
              >
                Open Source
              </button>
              <button 
                className={`filter-btn ${activeCategory === 'social' ? 'active' : ''}`}
                onClick={() => setActiveCategory('social')}
              >
                Social
              </button>
            </div>
          </div>
        </div>

        <div className="platforms-grid">
          {filteredPlatforms.map(platform => (
            <div key={platform.id} className={`platform-card ${platform.category}`}>
              <div className="platform-header">
                <div className="platform-logo">{platform.logo}</div>
                <div className="platform-info">
                  <h3>{platform.name}</h3>
                  <p>{platform.description}</p>
                </div>
                <div className="platform-badges">
                  {platform.integration && <span className="badge integration">🔗 Integrated</span>}
                  {platform.tokenization && <span className="badge crypto">₿ Tokenizable</span>}
                </div>
              </div>
              
              <div className="platform-features">
                <h4>Key Features:</h4>
                <ul>
                  {platform.features.map((feature, index) => (
                    <li key={index}>{feature}</li>
                  ))}
                </ul>
              </div>
              
              <div className="platform-actions">
                {platform.integration ? (
                  <button className="btn-primary">Publish Here</button>
                ) : (
                  <button className="btn-secondary">Learn More</button>
                )}
                <button 
                  className="btn-outline"
                  onClick={() => window.open(platform.website, '_blank')}
                >
                  Visit Site
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="platform-section cta-section">
        <h2>Get Started</h2>
        <p>Join the future of decentralized publishing</p>
        <div className="cta-buttons">
          <a href="/signup" className="cta-button primary">Sign Up for Updates</a>
          <a href="/docs" className="cta-button secondary">Read Documentation</a>
          <a href="https://github.com/bitcoin-apps-suite/bitcoin-writer" 
             target="_blank" 
             rel="noopener noreferrer" 
             className="cta-button secondary">
            View on GitHub
          </a>
        </div>
      </section>
      <Footer />
    </div>
  );
};

export default PlatformPage;