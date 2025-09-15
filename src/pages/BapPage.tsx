import React from 'react';
import './BapPage.css';

const BapPage: React.FC = () => {
  return (
    <div className="bap-page">
      <div className="bap-header">
        <div className="bap-logo">₿</div>
        <h1>Bitcoin Attestation Protocol (BAP)</h1>
        <p className="bap-tagline">Creating a Chain of Trust on the Bitcoin SV Blockchain</p>
      </div>

      <div className="bap-content">
        <section className="bap-section">
          <h2>What is BAP?</h2>
          <p>
            The Bitcoin Attestation Protocol (BAP) is a blockchain-based identity and attestation system designed 
            to create a "chain of trust for any kind of data on the Bitcoin blockchain." It enables creation of 
            unique identity keys linked to Bitcoin addresses, attestation of identity attributes by trusted 
            authorities, and supports key rotation and delegation while ensuring secure, privacy-preserving data sharing.
          </p>
        </section>

        <section className="bap-section">
          <h2>Key Features</h2>
          <div className="features-grid">
            <div className="feature-card">
              <span className="feature-icon">🔐</span>
              <h3>Identity Creation</h3>
              <p>Generate identity keys by hashing root Bitcoin addresses with key rotation</p>
            </div>
            <div className="feature-card">
              <span className="feature-icon">✅</span>
              <h3>Standardized Attestations</h3>
              <p>URN format: urn:bap:id:[Attribute]:[Value]:[Nonce]</p>
            </div>
            <div className="feature-card">
              <span className="feature-icon">🔄</span>
              <h3>Delegation Support</h3>
              <p>Delegate signing rights between identities securely</p>
            </div>
            <div className="feature-card">
              <span className="feature-icon">🛡️</span>
              <h3>Trust Management</h3>
              <p>Blacklisting and consent management capabilities</p>
            </div>
          </div>
        </section>

        <section className="bap-section">
          <h2>Transaction Types</h2>
          <div className="examples-list">
            <div className="example-item">
              <h3>🆔 ID</h3>
              <p>Establish or update an identity by linking keys to signing addresses</p>
            </div>
            <div className="example-item">
              <h3>✍️ ATTEST</h3>
              <p>Verify identity attributes with standardized URN format attestations</p>
            </div>
            <div className="example-item">
              <h3>🏢 ALIAS</h3>
              <p>Publish organizational identity information on-chain</p>
            </div>
            <div className="example-item">
              <h3>📊 DATA</h3>
              <p>Share encrypted or public data with verifiable authenticity</p>
            </div>
            <div className="example-item">
              <h3>🚫 REVOKE</h3>
              <p>Cancel previous attestations, permissions, or delegations</p>
            </div>
          </div>
        </section>

        <section className="bap-section">
          <h2>Technical Resources</h2>
          <p>
            The Bitcoin Attestation Protocol is part of the broader BSV ecosystem of overlay protocols, 
            designed to work with the Metanet protocol and other BSV standards for enhanced interoperability.
          </p>
          <div className="cta-buttons">
            <a
              href="https://github.com/icellan/bap"
              target="_blank"
              rel="noopener noreferrer"
              className="cta-btn primary"
            >
              BAP Specification
            </a>
            <a
              href="https://bsvblockchain.org/bsv_vendors/bitcoin-attestation-protocol-bap/"
              target="_blank"
              rel="noopener noreferrer"
              className="cta-btn secondary"
            >
              BSV Vendor Page
            </a>
          </div>
        </section>

        <section className="bap-section">
          <h2>Get Started</h2>
          <p>
            Ready to implement BAP in your application? Explore the official libraries and tools:
          </p>
          <div className="cta-buttons">
            <a
              href="https://github.com/BitcoinSchema/go-bap"
              target="_blank"
              rel="noopener noreferrer"
              className="cta-btn primary"
            >
              Go Library
            </a>
            <a
              href="https://tsc.bsvblockchain.org/"
              target="_blank"
              rel="noopener noreferrer"
              className="cta-btn secondary"
            >
              BSV Technical Standards
            </a>
          </div>
        </section>
      </div>
    </div>
  );
};

export default BapPage;