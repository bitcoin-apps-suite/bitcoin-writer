import React from 'react';
import './BapPage.css';

const BapPage: React.FC = () => {
  return (
    <div className="bap-page">
      <div className="bap-header">
        <div className="bap-logo">₿</div>
        <h1>Bitcoin Asset Protocol (BAP)</h1>
        <p className="bap-tagline">Transforming Digital Objects into Bitcoin-Native Assets</p>
      </div>

      <div className="bap-content">
        <section className="bap-section">
          <h2>Executive Summary</h2>
          <div className="pdf-container">
            <iframe
              src="/documents/bap_executive_summary.pdf"
              title="BAP Executive Summary"
              className="pdf-viewer"
            />
          </div>
          <a
            href="/documents/bap_executive_summary.pdf"
            download="BAP_Executive_Summary.pdf"
            className="download-btn"
          >
            📥 Download PDF
          </a>
        </section>

        <section className="bap-section">
          <h2>What is BAP?</h2>
          <p>
            The Bitcoin Asset Protocol (BAP) is a revolutionary protocol that enables the creation,
            management, and exchange of digital assets directly on the Bitcoin blockchain. BAP transforms
            any digital object into a Bitcoin-native asset with cryptographic ownership and transferability.
          </p>
        </section>

        <section className="bap-section">
          <h2>Key Features</h2>
          <div className="features-grid">
            <div className="feature-card">
              <span className="feature-icon">🔐</span>
              <h3>Cryptographic Ownership</h3>
              <p>True ownership secured by Bitcoin's immutable blockchain</p>
            </div>
            <div className="feature-card">
              <span className="feature-icon">🌐</span>
              <h3>Decentralized</h3>
              <p>No central authority required for asset management</p>
            </div>
            <div className="feature-card">
              <span className="feature-icon">⚡</span>
              <h3>Instant Transfers</h3>
              <p>Transfer assets globally with Bitcoin transactions</p>
            </div>
            <div className="feature-card">
              <span className="feature-icon">🎨</span>
              <h3>Any Digital Asset</h3>
              <p>Documents, images, videos, data - anything digital</p>
            </div>
          </div>
        </section>

        <section className="bap-section">
          <h2>Implementation Examples</h2>
          <div className="examples-list">
            <div className="example-item">
              <h3>📝 Bitcoin Writer</h3>
              <p>Store and tokenize documents on the blockchain with cryptographic proof of authorship</p>
            </div>
            <div className="example-item">
              <h3>📊 Blockchain Spreadsheet</h3>
              <p>Create immutable spreadsheets with verifiable calculations and data integrity</p>
            </div>
            <div className="example-item">
              <h3>💾 Bitcoin Drive</h3>
              <p>Decentralized file storage with permanent availability and ownership control</p>
            </div>
          </div>
        </section>

        <section className="bap-section">
          <h2>Get Started</h2>
          <p>
            Ready to build with BAP? Check out our developer resources and start creating
            Bitcoin-native digital assets today.
          </p>
          <div className="cta-buttons">
            <a
              href="https://github.com/b0ase"
              target="_blank"
              rel="noopener noreferrer"
              className="cta-btn primary"
            >
              View on GitHub
            </a>
            <a
              href="https://x.com/b0ase"
              target="_blank"
              rel="noopener noreferrer"
              className="cta-btn secondary"
            >
              Follow Updates
            </a>
          </div>
        </section>
      </div>
    </div>
  );
};

export default BapPage;