'use client'

import React from 'react';
import './ProofOfWorkPage.css';

export default function ProofOfWorkParadigmPage() {
  return (
    <div className="App">
      <div className="proof-of-work-page">
      <div className="proof-of-work-container">
        {/* Hero Section */}
        <section className="proof-of-work-hero">
          <h1><span style={{color: '#ffffff'}}>Proof of Work</span> <span style={{color: '#f7931a'}}>Paradigm</span></h1>
          <p className="proof-of-work-tagline">
            Build, create, and hash your work progressively to the chain
          </p>
          <div className="proof-of-work-badge">BUILD & HASH</div>
        </section>

        {/* Core Paradigm Section */}
        <section className="paradigm-section">
          <h2>The bApp Proof-of-Work Philosophy</h2>
          <div className="paradigm-content">
            <p>
              The <strong>Proof of Work Paradigm</strong> for bApps (Bitcoin Applications) represents a 
              fundamental shift in how we think about digital creation and ownership. Rather than working 
              in isolation and publishing finished products, creators continuously build and hash their 
              work to the chain throughout the creative process.
            </p>
            <p>
              Every save, every iteration, every improvement becomes a permanent record on Bitcoin. Over time, 
              creators build up a verifiable body of work that can be traced all the way back to their genesis 
              - the moment they first started hashing their work to the chain.
            </p>
            <div className="paradigm-points">
              <div className="point">
                <h3>Progressive Building</h3>
                <p>Create iteratively, save continuously, improve constantly</p>
              </div>
              <div className="point">
                <h3>Chain of Proof</h3>
                <p>Every version links to the previous, creating unbreakable history</p>
              </div>
              <div className="point">
                <h3>Genesis to Present</h3>
                <p>Trace any work back to its original creation moment</p>
              </div>
            </div>
          </div>
        </section>

        {/* How It Works Section */}
        <section className="how-it-works-section">
          <h2>How the PoW Paradigm Works</h2>
          <div className="work-steps">
            <div className="step">
              <div className="step-number">1</div>
              <h3>Create & Build</h3>
              <p>Start working on your project - document, code, design, or any digital creation</p>
            </div>
            <div className="step">
              <div className="step-number">2</div>
              <h3>Save to Chain</h3>
              <p>Use the "Save to Chain" button to hash your current progress to Bitcoin</p>
            </div>
            <div className="step">
              <div className="step-number">3</div>
              <h3>Iterate & Improve</h3>
              <p>Continue working, making changes, and improvements to your creation</p>
            </div>
            <div className="step">
              <div className="step-number">4</div>
              <h3>Hash Again</h3>
              <p>Regularly save new versions to the chain, creating a progressive record</p>
            </div>
          </div>

          <div className="work-examples">
            <h3>What Gets Hashed</h3>
            <ul>
              <li>✅ Document content and metadata</li>
              <li>✅ Timestamp of creation/modification</li>
              <li>✅ Author identification and signature</li>
              <li>✅ Previous version references (chain)</li>
              <li>✅ Content hash for integrity verification</li>
              <li>✅ License and usage permissions</li>
            </ul>
          </div>
        </section>

        {/* Lifecycle Section */}
        <section className="lifecycle-section">
          <h2>Creator Lifecycle Journey</h2>
          <div className="lifecycle-content">
            <p className="intro">
              Every creator's journey on the Bitcoin chain follows a natural progression from genesis 
              to mastery, with each step verifiably recorded.
            </p>

            <div className="lifecycle-model">
              <h3>The Creator's Chain</h3>
              <div className="lifecycle-streams">
                <div className="stream">
                  <h4>Genesis Block</h4>
                  <p>Your first hash to the chain</p>
                  <p className="price">Block #1</p>
                </div>
                <div className="stream featured">
                  <h4>Building Phase</h4>
                  <p>Regular saves creating work history</p>
                  <p className="price">Blocks #2-1000</p>
                </div>
                <div className="stream">
                  <h4>Mastery Era</h4>
                  <p>Established body of proven work</p>
                  <p className="price">Blocks #1000+</p>
                </div>
              </div>
              
              <h3 style={{marginTop: '40px'}}>Value Accumulation</h3>
              <div className="lifecycle-streams">
                <div className="stream">
                  <h4>Proof of Work</h4>
                  <p>Verifiable creation history on-chain</p>
                  <p className="price">Immutable</p>
                </div>
                <div className="stream featured">
                  <h4>Reputation</h4>
                  <p>Track record of quality and consistency</p>
                  <p className="price">Algorithmic</p>
                </div>
                <div className="stream">
                  <h4>Portfolio Value</h4>
                  <p>Accumulated works increase in worth</p>
                  <p className="price">Market-driven</p>
                </div>
              </div>
            </div>

            <div className="value-flow">
              <h3>Progressive Value Creation</h3>
              <div className="flow-diagram">
                <div className="flow-item">
                  <span>Create & Hash Work</span>
                  <span className="arrow">→</span>
                </div>
                <div className="flow-item">
                  <span>Build Chain of Proof</span>
                  <span className="arrow">→</span>
                </div>
                <div className="flow-item">
                  <span>Establish Reputation</span>
                  <span className="arrow">→</span>
                </div>
                <div className="flow-item">
                  <span>Monetize Body of Work</span>
                </div>
              </div>
              <p style={{textAlign: 'center', marginTop: '20px', fontSize: '14px', color: 'rgba(255, 255, 255, 0.6)'}}>
                Each hash to the chain strengthens your proof of work, building an immutable 
                portfolio that grows in value and credibility over time.
              </p>
            </div>
          </div>
        </section>

        {/* Benefits Section */}
        <section className="benefits-section">
          <h2>Benefits of the PoW Paradigm</h2>
          <div className="benefits-content">
            <div className="benefits-list">
              <div className="benefit-item">
                <div className="benefit-icon">🔗</div>
                <div>
                  <h4>Unbreakable Provenance</h4>
                  <p>Every piece of work is cryptographically linked to you and timestamped</p>
                </div>
              </div>
              <div className="benefit-item">
                <div className="benefit-icon">⚡</div>
                <div>
                  <h4>Real-time Protection</h4>
                  <p>No waiting to publish - protect your ideas the moment you create them</p>
                </div>
              </div>
              <div className="benefit-item">
                <div className="benefit-icon">📈</div>
                <div>
                  <h4>Cumulative Value</h4>
                  <p>Each addition to your chain increases the total value of your body of work</p>
                </div>
              </div>
              <div className="benefit-item">
                <div className="benefit-icon">🌐</div>
                <div>
                  <h4>Global Recognition</h4>
                  <p>Your proof of work is recognized anywhere Bitcoin is accepted</p>
                </div>
              </div>
              <div className="benefit-item">
                <div className="benefit-icon">🛡️</div>
                <div>
                  <h4>Anti-Plagiarism</h4>
                  <p>Impossible to fake creation times or steal attribution with cryptographic proof</p>
                </div>
              </div>
              <div className="benefit-item">
                <div className="benefit-icon">💰</div>
                <div>
                  <h4>Monetization Ready</h4>
                  <p>Proven work history enables premium pricing and exclusive opportunities</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Technical Implementation */}
        <section className="technical-section">
          <h2>Technical Implementation</h2>
          <div className="technical-info">
            <div className="technical-details">
              <h3>Chain Architecture</h3>
              <div className="technical-item">
                <strong>Hash Function:</strong>
                <span>SHA-256 for content integrity</span>
              </div>
              <div className="technical-item">
                <strong>Storage:</strong>
                <span>Bitcoin OP_RETURN + IPFS hybrid</span>
              </div>
              <div className="technical-item">
                <strong>Linking:</strong>
                <span>Previous hash reference creates chain</span>
              </div>
              <div className="technical-item">
                <strong>Signature:</strong>
                <span>ECDSA for author verification</span>
              </div>
              <div className="technical-item">
                <strong>Timestamping:</strong>
                <span>Bitcoin block height + transaction time</span>
              </div>
            </div>
          </div>
        </section>

        {/* Examples Section */}
        <section className="examples-section">
          <h2>Real-World Examples</h2>
          <div className="examples-grid">
            <div className="example">
              <h3>The Author</h3>
              <p className="example-description">Sarah starts her novel</p>
              <ul className="example-timeline">
                <li>Day 1: Hashes initial outline (Genesis)</li>
                <li>Day 3: Saves Chapter 1 draft</li>
                <li>Day 7: Updates with revisions</li>
                <li>Day 15: Completes first draft</li>
                <li>Day 30: Final published version</li>
              </ul>
              <p className="example-result">
                <strong>Result:</strong> Unbreakable proof of creative process and ownership
              </p>
            </div>
            <div className="example">
              <h3>The Developer</h3>
              <p className="example-description">Alex builds an open-source library</p>
              <ul className="example-timeline">
                <li>Block 1: Initial commit and architecture</li>
                <li>Block 5: Core functionality added</li>
                <li>Block 12: API stabilization</li>
                <li>Block 20: Documentation complete</li>
                <li>Block 25: v1.0 release</li>
              </ul>
              <p className="example-result">
                <strong>Result:</strong> Verifiable contribution history for career advancement
              </p>
            </div>
            <div className="example">
              <h3>The Designer</h3>
              <p className="example-description">Maya creates a brand identity</p>
              <ul className="example-timeline">
                <li>Hash 1: Brand research and mood board</li>
                <li>Hash 4: Logo concept variations</li>
                <li>Hash 8: Final logo selection</li>
                <li>Hash 12: Complete style guide</li>
                <li>Hash 15: Asset package delivery</li>
              </ul>
              <p className="example-result">
                <strong>Result:</strong> Protected design process and anti-counterfeiting
              </p>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="cta-section">
          <h2>Start Building Your Chain</h2>
          <div className="cta-buttons">
            <a 
              href="/" 
              className="cta-btn primary"
            >
              <svg height="20" width="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18,20H6V4H13V9H18V20Z"/>
              </svg>
              Create Your Genesis
            </a>
            <a 
              href="/docs" 
              className="cta-btn secondary"
            >
              Learn More
            </a>
          </div>
        </section>
      </div>
    </div>
    </div>
  );
}