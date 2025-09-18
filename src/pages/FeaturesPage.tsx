import React from 'react';
import './FeaturesPage.css';

const FeaturesPage: React.FC = () => {
  return (
    <div className="features-page">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-content">
          <h1 className="hero-title">
            <span className="gradient-text">Bitcoin Writer</span>
            <span className="subtitle">Document Versioning Revolution</span>
          </h1>
          <p className="hero-description">
            Transform your writing into immutable digital assets on Bitcoin. 
            Every edit becomes a permanent ordinal, creating unbreakable proof of authorship.
          </p>
          <div className="hero-buttons">
            <button className="btn-primary" onClick={() => window.location.href = '/'}>
              Start Writing
            </button>
            <button className="btn-secondary" onClick={() => document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth' })}>
              Learn More
            </button>
          </div>
        </div>
        <div className="hero-visual">
          <div className="chain-animation">
            <div className="version-block">v1</div>
            <div className="chain-link">⛓️</div>
            <div className="version-block">v2</div>
            <div className="chain-link">⛓️</div>
            <div className="version-block">v3</div>
          </div>
        </div>
      </section>

      {/* Problem Section */}
      <section className="problem-section">
        <div className="container">
          <h2>The Problem We Solved</h2>
          <div className="problems-grid">
            <div className="problem-card">
              <div className="problem-icon">🚫</div>
              <h3>No Proof of Originality</h3>
              <p>Anyone can copy-paste and claim authorship in the digital age</p>
            </div>
            <div className="problem-card">
              <div className="problem-icon">📉</div>
              <h3>No Investment Timeline</h3>
              <p>Readers can't invest early in promising work as it develops</p>
            </div>
            <div className="problem-card">
              <div className="problem-icon">👻</div>
              <h3>No Creation History</h3>
              <p>The creative process vanishes, leaving only the final result</p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="how-section">
        <div className="container">
          <h2>How It Works</h2>
          <p className="section-subtitle">Write Like Mining Bitcoin</p>
          
          <div className="timeline">
            <div className="timeline-item">
              <div className="timeline-number">1</div>
              <div className="timeline-content">
                <h3>Write Your Document</h3>
                <p>Start with your genesis draft in our powerful editor</p>
              </div>
            </div>
            
            <div className="timeline-item">
              <div className="timeline-number">2</div>
              <div className="timeline-content">
                <h3>Click ⛓️ to Version</h3>
                <p>Create a new version with metadata and description</p>
              </div>
            </div>
            
            <div className="timeline-item">
              <div className="timeline-number">3</div>
              <div className="timeline-content">
                <h3>Inscribe to Bitcoin</h3>
                <p>Permanently record on the blockchain as an ordinal</p>
              </div>
            </div>
            
            <div className="timeline-item">
              <div className="timeline-number">4</div>
              <div className="timeline-content">
                <h3>Enable Investment</h3>
                <p>Let readers buy shares in your evolving document</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="features-section">
        <div className="container">
          <h2>Revolutionary Features</h2>
          
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">🔐</div>
              <h3>Cryptographic Proof</h3>
              <p>Every version is cryptographically linked to the previous one, creating an unbreakable chain of authorship</p>
            </div>
            
            <div className="feature-card">
              <div className="feature-icon">💰</div>
              <h3>Progressive Investment</h3>
              <p>Readers can invest early at better prices, with 1 million shares per document version and automatic royalty distribution</p>
            </div>
            
            <div className="feature-card">
              <div className="feature-icon">📊</div>
              <h3>Version Analytics</h3>
              <p>Track word count evolution, edit frequency, creation velocity, and investment metrics in real-time</p>
            </div>
            
            <div className="feature-card">
              <div className="feature-icon">⚡</div>
              <h3>Instant Inscription</h3>
              <p>One-click Bitcoin inscription using the Ordinals protocol for permanent, immutable storage</p>
            </div>
            
            <div className="feature-card">
              <div className="feature-icon">🌍</div>
              <h3>Global Market</h3>
              <p>Anyone, anywhere can invest in your writing using Bitcoin and HandCash integration</p>
            </div>
            
            <div className="feature-card">
              <div className="feature-icon">✅</div>
              <h3>Chain Verification</h3>
              <p>Mathematical proof of document integrity and creation timeline that stands up in court</p>
            </div>
          </div>
        </div>
      </section>

      {/* Investment Model */}
      <section className="investment-section">
        <div className="container">
          <h2>The Investment Revolution</h2>
          <p className="section-subtitle">Transform Readers into Investors</p>
          
          <div className="investment-timeline">
            <div className="investment-stage">
              <div className="stage-header">
                <span className="stage-name">First Draft</span>
                <span className="stage-price">100 sats/share</span>
              </div>
              <div className="stage-bar" style={{width: '25%'}}></div>
              <p>Early believers get the best price</p>
            </div>
            
            <div className="investment-stage">
              <div className="stage-header">
                <span className="stage-name">Chapter 3 Added</span>
                <span className="stage-price">150 sats/share</span>
              </div>
              <div className="stage-bar" style={{width: '50%'}}></div>
              <p>Momentum building, quality emerging</p>
            </div>
            
            <div className="investment-stage">
              <div className="stage-header">
                <span className="stage-name">Final Edit</span>
                <span className="stage-price">300 sats/share</span>
              </div>
              <div className="stage-bar" style={{width: '75%'}}></div>
              <p>Proven quality, nearing completion</p>
            </div>
            
            <div className="investment-stage">
              <div className="stage-header">
                <span className="stage-name">Published</span>
                <span className="stage-price">500 sats/share</span>
              </div>
              <div className="stage-bar" style={{width: '100%'}}></div>
              <p>Complete work, maximum value</p>
            </div>
          </div>
        </div>
      </section>

      {/* Use Cases */}
      <section className="use-cases-section">
        <div className="container">
          <h2>Who It's For</h2>
          
          <div className="use-cases-grid">
            <div className="use-case">
              <h3>📚 Authors</h3>
              <ul>
                <li>Prove you wrote your novel first</li>
                <li>Chapter-by-chapter reader investment</li>
                <li>Create limited edition versions</li>
                <li>Build tradeable literary assets</li>
              </ul>
            </div>
            
            <div className="use-case">
              <h3>📰 Journalists</h3>
              <ul>
                <li>Timestamp breaking news permanently</li>
                <li>Create verifiable source chains</li>
                <li>Protect investigative work</li>
                <li>Enable reader-funded journalism</li>
              </ul>
            </div>
            
            <div className="use-case">
              <h3>🔬 Academics</h3>
              <ul>
                <li>Establish research priority</li>
                <li>Create citation chains</li>
                <li>Prove hypothesis timeline</li>
                <li>Enable peer investment</li>
              </ul>
            </div>
            
            <div className="use-case">
              <h3>💼 Businesses</h3>
              <ul>
                <li>Version control legal documents</li>
                <li>Create audit trails</li>
                <li>Timestamp intellectual property</li>
                <li>Enable stakeholder participation</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Technology Section */}
      <section className="tech-section">
        <div className="container">
          <h2>Built on Bitcoin</h2>
          <p className="section-subtitle">The Most Secure Blockchain in Existence</p>
          
          <div className="tech-grid">
            <div className="tech-card">
              <h3>Bitcoin Ordinals</h3>
              <p>Each version becomes a unique, numbered satoshi that's permanent, tradeable, and verifiable</p>
            </div>
            
            <div className="tech-card">
              <h3>SHA-256 Hashing</h3>
              <p>Military-grade cryptographic fingerprinting ensures content integrity and chain verification</p>
            </div>
            
            <div className="tech-card">
              <h3>HandCash Integration</h3>
              <p>Simple Bitcoin payments without technical knowledge, instant global transactions</p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="testimonials-section">
        <div className="container">
          <h2>Success Stories</h2>
          
          <div className="testimonials-grid">
            <div className="testimonial">
              <p>"I watched my novel go from 10 investors at chapter 1 to 500 investors by chapter 20. The early believers made 10x returns."</p>
              <div className="testimonial-author">— Fiction Author</div>
            </div>
            
            <div className="testimonial">
              <p>"Finally, a way to prove I wrote my research first. The timestamp saved my patent application."</p>
              <div className="testimonial-author">— Research Scientist</div>
            </div>
            
            <div className="testimonial">
              <p>"My readers became my publishers. I kept 100% ownership and still raised $50,000."</p>
              <div className="testimonial-author">— Independent Journalist</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="container">
          <h2>Start Your Chain Today</h2>
          <p>Every great work begins with a genesis version. Your words deserve to be immortalized on the world's most secure blockchain.</p>
          
          <div className="cta-buttons">
            <button className="btn-primary large" onClick={() => window.location.href = '/'}>
              Begin Writing
            </button>
            <button className="btn-secondary large" onClick={() => window.location.href = '/exchange'}>
              Browse Exchange
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="features-footer">
        <div className="container">
          <div className="footer-content">
            <div className="footer-section">
              <h4>Bitcoin Writer</h4>
              <p>Where Writing Meets the Blockchain Revolution</p>
            </div>
            
            <div className="footer-section">
              <h4>Features</h4>
              <ul>
                <li>Document Versioning</li>
                <li>Bitcoin Inscriptions</li>
                <li>Share Tokens</li>
                <li>Chain Verification</li>
              </ul>
            </div>
            
            <div className="footer-section">
              <h4>Technology</h4>
              <ul>
                <li>Bitcoin Ordinals</li>
                <li>SHA-256 Hashing</li>
                <li>HandCash Integration</li>
                <li>IPFS Backup</li>
              </ul>
            </div>
            
            <div className="footer-section">
              <h4>Resources</h4>
              <ul>
                <li>Documentation</li>
                <li>API Reference</li>
                <li>GitHub</li>
                <li>Support</li>
              </ul>
            </div>
          </div>
          
          <div className="footer-bottom">
            <p>© 2024 Bitcoin Writer. Transform your words into digital gold.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default FeaturesPage;