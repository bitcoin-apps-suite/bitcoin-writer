import React from 'react';
import './PlatformPage.css';

const PlatformPage: React.FC = () => {
  return (
    <div className="platform-page">
      <div className="platform-header">
        <h1>Bitcoin Writer Platform</h1>
        <p className="tagline">Write Once, Preserve Forever on the Blockchain</p>
      </div>

      <section className="platform-section">
        <h2>What is Bitcoin Writer?</h2>
        <p>
          Bitcoin Writer is a revolutionary document platform that transforms your writing into 
          immutable blockchain assets. Every keystroke is automatically hashed to the Bitcoin SV 
          blockchain, creating a permanent, timestamped record of your work that can never be 
          altered, deleted, or censored.
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
            <h3>NFT Documents</h3>
            <p>Transform your writing into tradeable NFTs with built-in royalties</p>
          </div>
          <div className="feature">
            <div className="feature-icon">🌍</div>
            <h3>Decentralized Publishing</h3>
            <p>No central authority can censor or remove your published works</p>
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
            <p>Create censorship-resistant articles with verifiable timestamps</p>
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
    </div>
  );
};

export default PlatformPage;