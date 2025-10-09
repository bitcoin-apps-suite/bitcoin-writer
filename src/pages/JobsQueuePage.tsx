import React, { useState, useEffect } from 'react';
import './JobsQueuePage.css';
import Footer from '../components/Footer';

const JobsQueuePage: React.FC = () => {
  const [devSidebarCollapsed, setDevSidebarCollapsed] = useState(() => {
    const saved = localStorage.getItem('devSidebarCollapsed');
    return saved === 'true';
  });
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [activeDemo, setActiveDemo] = useState<'browse' | 'accept' | 'write' | 'earn'>('browse');

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
    <div className="App">
      <div className={`jobs-queue-page ${!isMobile && !devSidebarCollapsed ? 'with-sidebar-expanded' : ''} ${!isMobile && devSidebarCollapsed ? 'with-sidebar-collapsed' : ''}`}>
      <div className="jobs-queue-container">
        {/* Hero Section */}
        <section className="jobs-hero">
          <h1><span style={{color: '#ffffff'}}>Bitcoin Writer</span> <span style={{color: '#f7931a'}}>Jobs Queue</span></h1>
          <p className="jobs-tagline">
            Connect Writers with Publishers. Get Paid in Bitcoin.
          </p>
          <div className="jobs-badge">JOBS MARKETPLACE</div>
        </section>

        {/* Philosophy Section */}
        <section className="philosophy-section">
          <h2>The Future of Content Creation</h2>
          <div className="philosophy-content">
            <p>
              The <strong>Jobs Queue</strong> transforms how writers and publishers collaborate by creating 
              a transparent, efficient marketplace for content creation. Writers find meaningful work, 
              publishers get quality content, and everyone gets paid instantly via Bitcoin.
            </p>
            <p>
              By tokenizing writing jobs and enabling direct peer-to-peer transactions, we're removing 
              the middlemen and empowering creators to earn what they deserve.
            </p>
            <div className="philosophy-points">
              <div className="point">
                <h3>Instant Payments</h3>
                <p>BSV enables immediate, low-cost transfers</p>
              </div>
              <div className="point">
                <h3>Global Access</h3>
                <p>Write from anywhere, get paid everywhere</p>
              </div>
              <div className="point">
                <h3>Fair Compensation</h3>
                <p>Market-driven rates, no platform cuts</p>
              </div>
            </div>
          </div>
        </section>

        {/* How It Works Section */}
        <section className="token-model-section">
          <h2>How the Jobs Queue Works</h2>
          
          <div className="model-card">
            <h3>For Writers</h3>
            <ul>
              <li>
                <strong>Browse Available Jobs:</strong> View all open writing opportunities with clear 
                requirements, compensation, and deadlines
              </li>
              <li>
                <strong>Accept & Write:</strong> Claim a job, write your article directly in the Bitcoin Writer 
                editor with all its powerful features
              </li>
              <li>
                <strong>Submit & Get Paid:</strong> Submit your work on-chain, receive instant payment upon 
                publisher approval
              </li>
              <li>
                <strong>Build Reputation:</strong> Complete jobs successfully to unlock higher-paying 
                opportunities and premium clients
              </li>
            </ul>
          </div>

          <div className="model-card">
            <h3>For Publishers</h3>
            <ul>
              <li>
                <strong>Post Job Requirements:</strong> Define your content needs, budget, deadline, 
                and specific guidelines
              </li>
              <li>
                <strong>Review Submissions:</strong> Receive high-quality content from verified writers 
                with on-chain proof of authorship
              </li>
              <li>
                <strong>Approve & Pay:</strong> Release payment instantly via smart contract when 
                satisfied with the work
              </li>
              <li>
                <strong>Own the Content:</strong> Receive full rights to the content with immutable 
                blockchain proof of ownership transfer
              </li>
            </ul>
          </div>
        </section>

        {/* Interactive Demo Section */}
        <section className="business-section">
          <h2>See It In Action</h2>
          <div className="business-content">
            <p className="intro">
              Experience how the Jobs Queue revolutionizes content creation workflows
            </p>

            <div className="demo-navigation">
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
                Get Paid
              </button>
            </div>

            <div className="demo-content">
              {activeDemo === 'browse' && (
                <div className="demo-section">
                  <h3>Available Writing Jobs</h3>
                  <div className="jobs-demo-list">
                    {demoJobs.map((job, index) => (
                      <div key={index} className="demo-job-card">
                        <div className="job-header">
                          <h4>{job.title}</h4>
                          <span className="job-compensation">{job.compensation}</span>
                        </div>
                        <div className="job-details">
                          <span className="job-publisher">By {job.publisher}</span>
                          <span className="job-deadline">{job.deadline}</span>
                          <span className="job-words">{job.words} words</span>
                        </div>
                        <div className="job-topics">
                          {job.topics.map((topic, i) => (
                            <span key={i} className="topic-tag">{topic}</span>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeDemo === 'accept' && (
                <div className="demo-section">
                  <h3>Accept a Job</h3>
                  <div className="accept-demo">
                    <div className="demo-message success">
                      ✓ Job "Bitcoin Mining Article" accepted successfully!
                    </div>
                    <div className="job-requirements">
                      <h4>Requirements:</h4>
                      <ul>
                        <li>1500-2000 words on Bitcoin mining economics</li>
                        <li>Include current hashrate statistics</li>
                        <li>Cover environmental considerations</li>
                        <li>Deadline: 7 days from now</li>
                      </ul>
                    </div>
                    <button className="start-writing-btn">Start Writing in Editor →</button>
                  </div>
                </div>
              )}

              {activeDemo === 'write' && (
                <div className="demo-section">
                  <h3>Write & Submit</h3>
                  <div className="editor-preview">
                    <div className="editor-mockup">
                      <div className="editor-toolbar">
                        <span>Bitcoin Mining: The Economics of Digital Gold</span>
                        <span className="word-count">1,847 words</span>
                      </div>
                      <div className="editor-content">
                        <p>Bitcoin mining has evolved from a hobbyist activity to a multi-billion dollar industry...</p>
                        <p className="dimmed">The current global hashrate stands at approximately 450 EH/s, representing...</p>
                      </div>
                      <div className="editor-actions">
                        <button className="save-draft">Save Draft</button>
                        <button className="submit-job">Submit to Publisher →</button>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeDemo === 'earn' && (
                <div className="demo-section">
                  <h3>Get Paid Instantly</h3>
                  <div className="payment-demo">
                    <div className="demo-message success">
                      ✓ Article approved by CryptoMag!
                    </div>
                    <div className="payment-details">
                      <h4>Payment Released:</h4>
                      <div className="payment-amount">0.005 BSV</div>
                      <div className="payment-usd">≈ $0.35 USD</div>
                      <div className="transaction-id">
                        TX: 7f3a2b1c9d8e5f6a4b3c2d1e9f8a7b6c5d4e3f2a1b0c9d8e7f6a5b4c3d2e1f0a
                      </div>
                    </div>
                    <div className="earnings-summary">
                      <h4>Your Earnings:</h4>
                      <div className="earnings-stats">
                        <div className="stat">
                          <span className="label">This Month</span>
                          <span className="value">0.125 BSV</span>
                        </div>
                        <div className="stat">
                          <span className="label">Jobs Completed</span>
                          <span className="value">12</span>
                        </div>
                        <div className="stat">
                          <span className="label">Rating</span>
                          <span className="value">4.9/5.0</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Features Grid Section */}
        <section className="contribute-section">
          <h2>Platform Features</h2>
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">📝</div>
              <h3>Smart Contracts</h3>
              <p>Automated escrow ensures writers get paid when work is approved</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">🌍</div>
              <h3>Global Marketplace</h3>
              <p>Connect with publishers and writers from around the world</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">⚡</div>
              <h3>Instant Payments</h3>
              <p>BSV enables immediate, low-cost payments upon job completion</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">🔒</div>
              <h3>On-Chain Proof</h3>
              <p>Immutable record of authorship and ownership on the blockchain</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">💰</div>
              <h3>Token Rewards</h3>
              <p>Earn $BWRITER tokens for completing jobs successfully</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">⭐</div>
              <h3>Reputation System</h3>
              <p>Build your profile to unlock premium opportunities</p>
            </div>
          </div>
        </section>

        {/* Tokenomics Section */}
        <section className="stats-section">
          <h2>Jobs Queue Economics</h2>
          <div className="stats-grid">
            <div className="stat">
              <h3>Platform Fee</h3>
              <p className="stat-value">2.5%</p>
              <p className="stat-label">On successful jobs</p>
            </div>
            <div className="stat">
              <h3>Average Job Value</h3>
              <p className="stat-value">$25-150</p>
              <p className="stat-label">Per article</p>
            </div>
            <div className="stat">
              <h3>Payment Speed</h3>
              <p className="stat-value">&lt; 2 sec</p>
              <p className="stat-label">BSV transactions</p>
            </div>
            <div className="stat">
              <h3>Token Rewards</h3>
              <p className="stat-value">10-100</p>
              <p className="stat-label">$BWRITER per job</p>
            </div>
          </div>

          <div className="revenue-model">
            <h3>How Writers Earn</h3>
            <div className="earning-paths">
              <div className="path">
                <h4>Direct Payments</h4>
                <p>Get paid in BSV, USD stablecoins, or publisher tokens</p>
              </div>
              <div className="path featured">
                <h4>Token Rewards</h4>
                <p>Earn $BWRITER tokens for each completed job</p>
              </div>
              <div className="path">
                <h4>Bonuses</h4>
                <p>Extra rewards for high-quality, timely delivery</p>
              </div>
            </div>
          </div>
        </section>

        {/* Use Cases Section */}
        <section className="legal-section">
          <h2>Who Uses Jobs Queue?</h2>
          <div className="legal-content">
            <div className="use-case-grid">
              <div className="use-case">
                <h3>Content Agencies</h3>
                <p>Scale content production with verified freelance writers globally</p>
              </div>
              <div className="use-case">
                <h3>Crypto Projects</h3>
                <p>Commission whitepapers, documentation, and marketing content</p>
              </div>
              <div className="use-case">
                <h3>News Platforms</h3>
                <p>Source breaking news coverage from on-the-ground reporters</p>
              </div>
              <div className="use-case">
                <h3>Freelance Writers</h3>
                <p>Find consistent work opportunities and build a portable reputation</p>
              </div>
              <div className="use-case">
                <h3>Academic Researchers</h3>
                <p>Monetize research summaries and technical analysis</p>
              </div>
              <div className="use-case">
                <h3>Marketing Teams</h3>
                <p>Order blog posts, social content, and SEO articles on-demand</p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="cta-section">
          <h2>Ready to Start Earning?</h2>
          <p className="cta-subtitle">Join the decentralized content marketplace today</p>
          <div className="cta-buttons">
            <a 
              href="/" 
              className="cta-btn primary"
            >
              Launch App
            </a>
            <a 
              href="/developers" 
              className="cta-btn secondary"
            >
              Integration Docs
            </a>
          </div>
          <div className="cta-stats">
            <span>💼 50+ Active Jobs</span>
            <span>✍️ 200+ Writers</span>
            <span>🌍 30+ Countries</span>
          </div>
        </section>
      </div>
    </div>
    <Footer />
    </div>
  );
};

export default JobsQueuePage;