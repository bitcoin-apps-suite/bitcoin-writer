import React, { useState, useEffect } from 'react';
import './MAIPPage.css';
import Footer from '../components/Footer';

const MAIPPage: React.FC = () => {
  const [devSidebarCollapsed, setDevSidebarCollapsed] = useState(() => {
    const saved = localStorage.getItem('devSidebarCollapsed');
    return saved === 'true';
  });
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  useEffect(() => {
    const handleStorageChange = () => {
      const saved = localStorage.getItem('devSidebarCollapsed');
      setDevSidebarCollapsed(saved === 'true');
    };
    
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    
    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('resize', handleResize);
    
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
      <div className={`maip-page ${!isMobile && !devSidebarCollapsed ? 'with-sidebar-expanded' : ''} ${!isMobile && devSidebarCollapsed ? 'with-sidebar-collapsed' : ''}`}>
        <div className="maip-container">
          {/* Hero Section */}
          <section className="maip-hero">
            <h1>Multi-Authoring in Public <span style={{color: '#FF6B35'}}>(MAIP)</span></h1>
            <p className="maip-tagline">
              Collaborative writing on the blockchain - where every contribution is tracked, valued, and rewarded
            </p>
            <div className="maip-badge">EXPERIMENTAL</div>
          </section>

          {/* Concept Section */}
          <section className="maip-concept">
            <h2>The Vision</h2>
            <p>
              Multi-Authoring in Public (MAIP) represents a radical new approach to collaborative content creation. 
              Instead of hidden Google Docs or private repositories, MAIP enables authors to write together in 
              real-time on the blockchain, where every keystroke can be valued and every contribution rewarded.
            </p>
            
            <div className="maip-features">
              <div className="maip-feature">
                <h3>🔄 Real-Time Collaboration</h3>
                <p>Multiple authors working on the same document simultaneously with blockchain-verified contributions</p>
              </div>
              <div className="maip-feature">
                <h3>💎 Micro-Payments</h3>
                <p>Every edit, suggestion, and improvement can trigger automatic BSV micropayments</p>
              </div>
              <div className="maip-feature">
                <h3>📊 Contribution Tracking</h3>
                <p>Immutable record of who wrote what, when, and how much value they added</p>
              </div>
              <div className="maip-feature">
                <h3>🌐 Public by Default</h3>
                <p>All writing happens in public view, creating unprecedented transparency</p>
              </div>
            </div>
          </section>

          {/* How It Works */}
          <section className="maip-how">
            <h2>How MAIP Works</h2>
            
            <div className="maip-process">
              <div className="process-step">
                <div className="step-number">1</div>
                <h4>Document Creation</h4>
                <p>An author initiates a public document on the blockchain with initial stake/bounty</p>
              </div>
              <div className="process-step">
                <div className="step-number">2</div>
                <h4>Open Contribution</h4>
                <p>Other authors join, making edits and additions tracked by smart contracts</p>
              </div>
              <div className="process-step">
                <div className="step-number">3</div>
                <h4>Value Attribution</h4>
                <p>AI and peer review determine the value of each contribution</p>
              </div>
              <div className="process-step">
                <div className="step-number">4</div>
                <h4>Automatic Rewards</h4>
                <p>Contributors receive micropayments based on their value-add</p>
              </div>
            </div>
          </section>

          {/* Use Cases */}
          <section className="maip-usecases">
            <h2>Revolutionary Use Cases</h2>
            
            <div className="usecase-grid">
              <div className="usecase-card">
                <h3>📚 Academic Papers</h3>
                <p>Researchers collaborate openly, with citations and contributions tracked immutably</p>
              </div>
              <div className="usecase-card">
                <h3>📰 News Articles</h3>
                <p>Journalists worldwide contribute facts and perspectives to breaking stories</p>
              </div>
              <div className="usecase-card">
                <h3>📖 Technical Documentation</h3>
                <p>Developers improve docs together with rewards for valuable contributions</p>
              </div>
              <div className="usecase-card">
                <h3>🎭 Creative Writing</h3>
                <p>Stories that evolve through collective imagination with royalties split automatically</p>
              </div>
              <div className="usecase-card">
                <h3>📊 Research Reports</h3>
                <p>Analysts pool knowledge with transparent attribution and compensation</p>
              </div>
              <div className="usecase-card">
                <h3>🏛️ Policy Documents</h3>
                <p>Public participation in governance with traceable contributions</p>
              </div>
            </div>
          </section>

          {/* Technical Architecture */}
          <section className="maip-technical">
            <h2>Technical Architecture</h2>
            
            <div className="tech-components">
              <div className="tech-component">
                <h4>BSV Blockchain</h4>
                <p>Every edit is a microtransaction containing document changes as OP_RETURN data</p>
              </div>
              <div className="tech-component">
                <h4>CRDTs</h4>
                <p>Conflict-free replicated data types enable real-time collaborative editing</p>
              </div>
              <div className="tech-component">
                <h4>Smart Contracts</h4>
                <p>Automated escrow and payment distribution based on contribution metrics</p>
              </div>
              <div className="tech-component">
                <h4>AI Valuation</h4>
                <p>Machine learning models assess quality and value of contributions</p>
              </div>
            </div>
          </section>

          {/* Economics */}
          <section className="maip-economics">
            <h2>The Economics of MAIP</h2>
            
            <div className="economics-model">
              <p>
                MAIP creates a new economic model for content creation where value flows directly from 
                readers/consumers to contributors without intermediaries. 
              </p>
              
              <div className="economic-flows">
                <div className="flow-item">
                  <h4>Initiation Bounties</h4>
                  <p>Document creators stake BSV to attract quality contributors</p>
                </div>
                <div className="flow-item">
                  <h4>Reader Payments</h4>
                  <p>Readers pay micropayments that flow to all contributors</p>
                </div>
                <div className="flow-item">
                  <h4>Quality Bonuses</h4>
                  <p>High-value contributions receive multiplied rewards</p>
                </div>
                <div className="flow-item">
                  <h4>Reputation Staking</h4>
                  <p>Authors stake reputation tokens to participate in high-value documents</p>
                </div>
              </div>
            </div>
          </section>

          {/* Call to Action */}
          <section className="maip-cta">
            <h2>Join the Revolution</h2>
            <p>
              MAIP is more than a feature - it's a paradigm shift in how humanity creates and shares knowledge. 
              Be part of the first generation of public multi-authors.
            </p>
            <div className="cta-buttons">
              <button className="cta-primary">Start Multi-Authoring</button>
              <button className="cta-secondary">View Live Documents</button>
            </div>
          </section>

          {/* Status */}
          <section className="maip-status">
            <div className="status-box">
              <h3>⚡ Development Status</h3>
              <p>
                MAIP is currently in conceptual development. Core infrastructure is being built 
                on BSV blockchain with expected alpha release in Q2 2025.
              </p>
              <div className="status-items">
                <div className="status-item done">✓ Concept Design</div>
                <div className="status-item in-progress">⚙ Smart Contract Development</div>
                <div className="status-item pending">○ CRDT Implementation</div>
                <div className="status-item pending">○ AI Valuation Engine</div>
                <div className="status-item pending">○ Public Beta</div>
              </div>
            </div>
          </section>
        </div>
        <Footer />
      </div>
    </div>
  );
};

export default MAIPPage;