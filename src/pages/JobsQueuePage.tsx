import React, { useState } from 'react';
import './JobsQueuePage.css';

const JobsQueuePage: React.FC = () => {
  const [activeDemo, setActiveDemo] = useState<'browse' | 'accept' | 'write' | 'earn'>('browse');

  const demoJobs = [
    {
      title: 'Bitcoin Mining Article',
      publisher: 'CryptoMag',
      compensation: '0.005 BSV',
      deadline: '7 days',
      words: '1500-2000',
      topics: ['Bitcoin', 'Mining', 'Technology']
    },
    {
      title: 'DeFi Protocol Review',
      publisher: 'DeFi Daily',
      compensation: '$50 USD',
      deadline: '3 days',
      words: '800-1200',
      topics: ['DeFi', 'Finance', 'Blockchain']
    },
    {
      title: 'NFT Market Analysis',
      publisher: 'Digital Art Weekly',
      compensation: '100 DAW',
      deadline: '10 days',
      words: '2000-2500',
      topics: ['NFTs', 'Digital Art', 'Markets']
    }
  ];

  return (
    <div className="jobs-queue-page">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-content">
          <h1 className="hero-title">
            Bitcoin Writer <span className="highlight">Jobs Queue</span>
          </h1>
          <p className="hero-subtitle">
            Connect Writers with Publishers. Get Paid in Bitcoin.
          </p>
          <div className="hero-description">
            A revolutionary marketplace where publishers post writing jobs and writers earn real money.
            All powered by Bitcoin SV's instant, low-cost transactions.
          </div>
          <div className="hero-stats">
            <div className="stat">
              <div className="stat-value">$250K+</div>
              <div className="stat-label">Paid to Writers</div>
            </div>
            <div className="stat">
              <div className="stat-value">1,500+</div>
              <div className="stat-label">Jobs Completed</div>
            </div>
            <div className="stat">
              <div className="stat-value">300+</div>
              <div className="stat-label">Active Publishers</div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="how-it-works">
        <h2>How Jobs Queue Works</h2>
        <div className="steps-container">
          <div className="step">
            <div className="step-number">1</div>
            <h3>Browse Jobs</h3>
            <p>Publishers post writing opportunities with clear requirements, compensation, and deadlines.</p>
          </div>
          <div className="step">
            <div className="step-number">2</div>
            <h3>Accept & Write</h3>
            <p>Choose jobs that match your expertise. Write directly in our professional editor with AI assistance.</p>
          </div>
          <div className="step">
            <div className="step-number">3</div>
            <h3>Submit & Earn</h3>
            <p>Submit your work on-chain. Get paid instantly in BSV, USD, or publisher tokens.</p>
          </div>
        </div>
      </section>

      {/* Interactive Demo */}
      <section className="interactive-demo">
        <h2>See It In Action</h2>
        <div className="demo-container">
          <div className="demo-sidebar">
            <div className="demo-tabs">
              <button 
                className={activeDemo === 'browse' ? 'active' : ''}
                onClick={() => setActiveDemo('browse')}
              >
                Browse Jobs
              </button>
              <button 
                className={activeDemo === 'accept' ? 'active' : ''}
                onClick={() => setActiveDemo('accept')}
              >
                Accept Job
              </button>
              <button 
                className={activeDemo === 'write' ? 'active' : ''}
                onClick={() => setActiveDemo('write')}
              >
                Write & Submit
              </button>
              <button 
                className={activeDemo === 'earn' ? 'active' : ''}
                onClick={() => setActiveDemo('earn')}
              >
                Track Earnings
              </button>
            </div>
          </div>
          
          <div className="demo-content">
            {activeDemo === 'browse' && (
              <div className="demo-panel">
                <h3>Available Writing Jobs</h3>
                <div className="jobs-list-demo">
                  {demoJobs.map((job, idx) => (
                    <div key={idx} className="job-card-demo">
                      <div className="job-header">
                        <h4>{job.title}</h4>
                        <span className="job-comp">{job.compensation}</span>
                      </div>
                      <div className="job-meta">
                        <span>📢 {job.publisher}</span>
                        <span>⏰ {job.deadline}</span>
                        <span>📝 {job.words} words</span>
                      </div>
                      <div className="job-topics">
                        {job.topics.map(topic => (
                          <span key={topic} className="topic-tag">{topic}</span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            {activeDemo === 'accept' && (
              <div className="demo-panel">
                <h3>Job Details</h3>
                <div className="job-details-demo">
                  <h4>Bitcoin Mining Article</h4>
                  <p className="job-description">
                    Write a comprehensive guide on Bitcoin mining for beginners, covering hardware requirements, 
                    profitability calculations, and environmental considerations.
                  </p>
                  <div className="requirements">
                    <h5>Requirements:</h5>
                    <ul>
                      <li>Technical knowledge of Bitcoin mining</li>
                      <li>Clear explanations for beginners</li>
                      <li>Include real-world examples</li>
                      <li>Original content only</li>
                    </ul>
                  </div>
                  <button className="accept-job-btn">Accept This Job</button>
                </div>
              </div>
            )}
            
            {activeDemo === 'write' && (
              <div className="demo-panel">
                <h3>Writing Interface</h3>
                <div className="editor-demo">
                  <div className="editor-toolbar">
                    <button>B</button>
                    <button>I</button>
                    <button>U</button>
                    <button>H1</button>
                    <button>Quote</button>
                    <button>Link</button>
                  </div>
                  <div className="editor-content">
                    <h4>The Complete Guide to Bitcoin Mining</h4>
                    <p>
                      Bitcoin mining is the process of validating transactions and adding them to the blockchain...
                    </p>
                  </div>
                  <div className="editor-footer">
                    <span>Word Count: 245/1500</span>
                    <button className="submit-btn">Submit to Publisher</button>
                  </div>
                </div>
              </div>
            )}
            
            {activeDemo === 'earn' && (
              <div className="demo-panel">
                <h3>Your Earnings</h3>
                <div className="earnings-demo">
                  <div className="earnings-summary">
                    <div className="earning-stat">
                      <span className="label">This Month</span>
                      <span className="value">0.125 BSV</span>
                    </div>
                    <div className="earning-stat">
                      <span className="label">Total Earned</span>
                      <span className="value">2.45 BSV</span>
                    </div>
                    <div className="earning-stat">
                      <span className="label">Jobs Completed</span>
                      <span className="value">23</span>
                    </div>
                  </div>
                  <div className="recent-payments">
                    <h5>Recent Payments</h5>
                    <div className="payment-item">
                      <span>Bitcoin Mining Article</span>
                      <span className="amount">0.005 BSV</span>
                    </div>
                    <div className="payment-item">
                      <span>DeFi Protocol Review</span>
                      <span className="amount">$50 USD</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="features-grid">
        <h2>Why Writers Love Jobs Queue</h2>
        <div className="features-container">
          <div className="feature-card">
            <div className="feature-icon">💰</div>
            <h3>Instant Payments</h3>
            <p>Get paid immediately upon approval. No waiting for invoices or payment processing.</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">🌍</div>
            <h3>Global Marketplace</h3>
            <p>Work with publishers worldwide. No geographic restrictions or banking limitations.</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">🔒</div>
            <h3>On-Chain Contracts</h3>
            <p>Smart contracts ensure fair payment. Your work is protected and verifiable.</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">📈</div>
            <h3>Build Your Portfolio</h3>
            <p>Every completed job adds to your on-chain reputation and portfolio.</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">🤖</div>
            <h3>AI Writing Assistant</h3>
            <p>Built-in AI tools help with research, editing, and optimization.</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">💎</div>
            <h3>Token Rewards</h3>
            <p>Earn publisher tokens that can increase in value as publications grow.</p>
          </div>
        </div>
      </section>

      {/* For Publishers */}
      <section className="for-publishers">
        <div className="publishers-content">
          <div className="text-content">
            <h2>For Publishers</h2>
            <h3>Find Quality Writers. Pay Only for Results.</h3>
            <ul className="benefits-list">
              <li>
                <span className="check">✓</span>
                Access to vetted, professional writers
              </li>
              <li>
                <span className="check">✓</span>
                Set your budget and requirements
              </li>
              <li>
                <span className="check">✓</span>
                Review submissions before payment
              </li>
              <li>
                <span className="check">✓</span>
                Build long-term relationships with top writers
              </li>
              <li>
                <span className="check">✓</span>
                Pay in BSV, USD, or your own tokens
              </li>
            </ul>
            <button className="cta-button">Post Your First Job</button>
          </div>
          <div className="visual-content">
            <div className="publisher-dashboard">
              <h4>Publisher Dashboard</h4>
              <div className="dashboard-stats">
                <div className="dash-stat">
                  <span>Active Jobs</span>
                  <span className="value">12</span>
                </div>
                <div className="dash-stat">
                  <span>Submissions</span>
                  <span className="value">47</span>
                </div>
                <div className="dash-stat">
                  <span>Writers</span>
                  <span className="value">156</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Tokenomics */}
      <section className="tokenomics">
        <h2>Token Economics</h2>
        <div className="token-info">
          <div className="token-card">
            <h3>$BWRITER Token</h3>
            <p>Platform governance token. Holders get:</p>
            <ul>
              <li>Reduced fees on jobs</li>
              <li>Priority job access</li>
              <li>Voting rights on platform decisions</li>
              <li>Share of platform revenue</li>
            </ul>
          </div>
          <div className="token-card">
            <h3>Document Tokens (BRC100)</h3>
            <p>Each document becomes a tradeable asset:</p>
            <ul>
              <li>1M tokens per document</li>
              <li>Authors retain 51% control</li>
              <li>Readers buy tokens for access</li>
              <li>Trade on secondary markets</li>
            </ul>
          </div>
          <div className="token-card">
            <h3>Publisher Tokens</h3>
            <p>Custom tokens for each publisher:</p>
            <ul>
              <li>Pay writers in native tokens</li>
              <li>Build token economies</li>
              <li>Reward loyal writers</li>
              <li>Create token incentives</li>
            </ul>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <h2>Ready to Start Earning?</h2>
        <p>Join thousands of writers making money with their words.</p>
        <div className="cta-buttons">
          <button className="primary-cta">Start Writing</button>
          <button className="secondary-cta">View Available Jobs</button>
        </div>
        <div className="trust-badges">
          <span>🔒 Secure Payments</span>
          <span>⚡ Instant Transfers</span>
          <span>🌍 Global Access</span>
          <span>💎 Token Rewards</span>
        </div>
      </section>
    </div>
  );
};

export default JobsQueuePage;