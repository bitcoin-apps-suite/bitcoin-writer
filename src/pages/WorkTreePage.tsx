import React, { useState, useEffect } from 'react';
import './WorkTreePage.css';
import Footer from '../components/Footer';

const WorkTreePage: React.FC = () => {
  const [devSidebarCollapsed, setDevSidebarCollapsed] = useState(() => {
    const saved = localStorage.getItem('devSidebarCollapsed');
    return saved === 'true';
  });
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

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

  return (
    <div className="App">
      <div className={`worktree-page ${!isMobile && !devSidebarCollapsed ? 'with-sidebar-expanded' : ''} ${!isMobile && devSidebarCollapsed ? 'with-sidebar-collapsed' : ''}`}>
        <div className="worktree-container">
          
          {/* Hero Section */}
          <section className="worktree-hero">
            <div className="worktree-icon">🌳</div>
            <h1><span style={{color: '#f7931a'}}>Work Tree</span> - Git for IP Creation</h1>
            <p className="worktree-tagline">
              Revolutionary document versioning system that applies Git's powerful branching model to intellectual property creation, enabling granular tokenization and securitization of creative work.
            </p>
            <div className="worktree-badge">INTELLECTUAL PROPERTY INNOVATION</div>
          </section>

          {/* Core Concept */}
          <section className="concept-section">
            <div className="concept-grid">
              <div className="concept-text">
                <h2>🎯 The Revolutionary Concept</h2>
                <p>
                  Work Tree transforms how intellectual property is created, tracked, and monetized by applying 
                  <strong> Git's version control methodology</strong> to document creation with blockchain-backed provenance.
                </p>
                <p>
                  Every keystroke, every revision, every creative decision becomes part of an immutable, 
                  traceable tree of intellectual property that can be <strong>tokenized, licensed, and securitized</strong> 
                  at the commit level.
                </p>
                <div className="concept-highlights">
                  <div className="highlight-item">
                    <span className="highlight-icon">⚡</span>
                    <span><strong>Real-time SHA256 hashing</strong> of content as you type</span>
                  </div>
                  <div className="highlight-item">
                    <span className="highlight-icon">🌿</span>
                    <span><strong>Visual git-style branching</strong> with curved connections</span>
                  </div>
                  <div className="highlight-item">
                    <span className="highlight-icon">🔄</span>
                    <span><strong>Time travel editing</strong> - checkout any historical state</span>
                  </div>
                  <div className="highlight-item">
                    <span className="highlight-icon">🏛️</span>
                    <span><strong>Commit-level tokenization</strong> for IP licensing</span>
                  </div>
                </div>
              </div>
              <div className="concept-visual">
                <div className="mock-tree">
                  <div className="tree-timeline">
                    <div className="commit-node genesis">
                      <span className="node-number">1</span>
                      <div className="node-label">Genesis</div>
                    </div>
                    <div className="connection-line"></div>
                    <div className="commit-node">
                      <span className="node-number">2</span>
                      <div className="node-label">Chapter 1</div>
                    </div>
                    <div className="connection-branch"></div>
                    <div className="commit-node branch-node">
                      <span className="node-number">3a</span>
                      <div className="node-label">Poetry Branch</div>
                    </div>
                    <div className="connection-line"></div>
                    <div className="commit-node">
                      <span className="node-number">3</span>
                      <div className="node-label">Chapter 2</div>
                    </div>
                    <div className="connection-line"></div>
                    <div className="commit-node current">
                      <span className="current-hash">a1b2c3d4</span>
                      <div className="node-label">CURRENT</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Git Operations Applied to IP */}
          <section className="git-operations-section">
            <h2>🔧 Git Operations Applied to IP Creation</h2>
            <div className="operations-grid">
              
              <div className="operation-card">
                <div className="operation-header">
                  <span className="operation-icon">📝</span>
                  <h3>Commit = IP Milestone</h3>
                </div>
                <p>Every save creates a commit with cryptographic hash verification. Each commit represents a discrete, tradeable unit of intellectual property.</p>
                <div className="operation-example">
                  <code>git commit -m "Add character backstory for protagonist"</code>
                  <small>→ Creates tradeable IP asset with provable creation time</small>
                </div>
              </div>

              <div className="operation-card">
                <div className="operation-header">
                  <span className="operation-icon">🌿</span>
                  <h3>Branch = Creative Direction</h3>
                </div>
                <p>Explore different creative paths without losing work. Each branch can be developed independently and later merged or kept separate.</p>
                <div className="operation-example">
                  <code>git checkout -b "alternate-ending"</code>
                  <small>→ Creates new IP direction while preserving original</small>
                </div>
              </div>

              <div className="operation-card">
                <div className="operation-header">
                  <span className="operation-icon">🔄</span>
                  <h3>Checkout = Time Travel</h3>
                </div>
                <p>Return to any previous state of your work. Double-click any commit to instantly restore your document to that exact version.</p>
                <div className="operation-example">
                  <code>git checkout abc123</code>
                  <small>→ Restore document to historical state, branch from there</small>
                </div>
              </div>

              <div className="operation-card">
                <div className="operation-header">
                  <span className="operation-icon">🔀</span>
                  <h3>Merge = Collaboration</h3>
                </div>
                <p>Combine different creative directions. Merge branches to integrate collaborative work or alternative approaches.</p>
                <div className="operation-example">
                  <code>git merge feature-branch</code>
                  <small>→ Integrate collaborative IP while maintaining attribution</small>
                </div>
              </div>

              <div className="operation-card">
                <div className="operation-header">
                  <span className="operation-icon">📊</span>
                  <h3>Diff = Change Tracking</h3>
                </div>
                <p>See exactly what changed between versions. Critical for IP litigation, attribution, and collaborative agreements.</p>
                <div className="operation-example">
                  <code>git diff HEAD~1</code>
                  <small>→ Legal proof of contribution and creative development</small>
                </div>
              </div>

              <div className="operation-card">
                <div className="operation-header">
                  <span className="operation-icon">🏷️</span>
                  <h3>Tag = Release Milestone</h3>
                </div>
                <p>Mark important versions like "v1.0-published" or "draft-for-review". Tags become reference points for licensing agreements.</p>
                <div className="operation-example">
                  <code>git tag -a "v1.0-published"</code>
                  <small>→ Create licensable milestone version</small>
                </div>
              </div>

            </div>
          </section>

          {/* Live Demo Screenshots Section */}
          <section className="demo-section">
            <h2>📸 Work Tree in Action</h2>
            <p>Interactive demonstrations of the Work Tree interface and functionality:</p>
            
            <div className="demo-grid">
              <div className="demo-item">
                <div className="demo-mockup genesis-demo">
                  <div className="mockup-header">
                    <span className="mockup-title">🌳 Work Tree</span>
                    <button className="mockup-close">×</button>
                  </div>
                  <div className="mockup-canvas">
                    <div className="demo-tree-structure">
                      <div className="current-node genesis pulsing">
                        <span className="node-content">Genesis</span>
                        <div className="hash-display">SHA: a1b2c3d4</div>
                      </div>
                    </div>
                    <div className="demo-tabs">
                      <span className="demo-tab active">Create Version</span>
                      <span className="demo-tab">History</span>
                      <span className="demo-tab">Stats</span>
                    </div>
                  </div>
                </div>
                <h4>1. Genesis State</h4>
                <p>Clean slate with current node showing live SHA256 hash of document content. Hash updates in real-time as you type.</p>
              </div>

              <div className="demo-item">
                <div className="demo-mockup linear-demo">
                  <div className="mockup-header">
                    <span className="mockup-title">🌳 Work Tree</span>
                    <button className="mockup-close">×</button>
                  </div>
                  <div className="mockup-canvas">
                    <div className="demo-tree-structure">
                      <div className="committed-node">
                        <span className="node-content">v1.0</span>
                        <div className="hash-display">SHA: 4f3a8b2c</div>
                      </div>
                      <div className="tree-connection"></div>
                      <div className="committed-node">
                        <span className="node-content">v1.1</span>
                        <div className="hash-display">SHA: 7e9d5a1f</div>
                      </div>
                      <div className="tree-connection"></div>
                      <div className="current-node pulsing">
                        <span className="node-content">Current</span>
                        <div className="hash-display">SHA: b8e4c2a9</div>
                      </div>
                    </div>
                  </div>
                </div>
                <h4>2. Linear Development</h4>
                <p>Sequential commits showing document evolution. Each node represents a saved version with cryptographic hash integrity.</p>
              </div>

              <div className="demo-item">
                <div className="demo-mockup branching-demo">
                  <div className="mockup-header">
                    <span className="mockup-title">🌳 Work Tree</span>
                    <button className="mockup-close">×</button>
                  </div>
                  <div className="mockup-canvas">
                    <div className="demo-tree-structure complex">
                      <div className="committed-node main">
                        <span className="node-content">Main</span>
                        <div className="hash-display">SHA: 4f3a8b2c</div>
                      </div>
                      <div className="branch-split">
                        <div className="branch main-branch">
                          <div className="tree-connection"></div>
                          <div className="committed-node">
                            <span className="node-content">v1.1</span>
                            <div className="hash-display">SHA: 7e9d5a1f</div>
                          </div>
                        </div>
                        <div className="branch feature-branch">
                          <div className="curved-connection"></div>
                          <div className="committed-node feature">
                            <span className="node-content">Feature</span>
                            <div className="hash-display">SHA: a2f8d9e1</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <h4>3. Creative Branching</h4>
                <p>Git-style branching for exploring alternative creative directions. Curved connections show parent-child relationships.</p>
              </div>

              <div className="demo-item">
                <div className="demo-mockup checkout-demo">
                  <div className="mockup-header">
                    <span className="mockup-title">🌳 Work Tree</span>
                    <button className="mockup-close">×</button>
                  </div>
                  <div className="mockup-canvas">
                    <div className="demo-tree-structure">
                      <div className="committed-node selected">
                        <span className="node-content">v1.0 ✓</span>
                        <div className="hash-display">SHA: 4f3a8b2c</div>
                      </div>
                      <div className="tree-connection"></div>
                      <div className="committed-node">
                        <span className="node-content">v1.1</span>
                        <div className="hash-display">SHA: 7e9d5a1f</div>
                      </div>
                    </div>
                    <div className="checkout-indicator">
                      <span className="checkout-text">🔄 Double-click to checkout</span>
                    </div>
                  </div>
                </div>
                <h4>4. Time Travel Checkout</h4>
                <p>Double-click any node to restore document content to that exact state. Perfect for exploring revision history.</p>
              </div>

              <div className="demo-item">
                <div className="demo-mockup inscription-demo">
                  <div className="mockup-header">
                    <span className="mockup-title">🌳 Work Tree</span>
                    <button className="mockup-close">×</button>
                  </div>
                  <div className="mockup-canvas">
                    <div className="demo-tree-structure">
                      <div className="committed-node inscribed">
                        <span className="node-content">v1.0 ⚡</span>
                        <div className="hash-display">SHA: 4f3a8b2c</div>
                        <div className="inscription-id">Ord: #12345678</div>
                      </div>
                    </div>
                    <div className="demo-tabs">
                      <span className="demo-tab">Create Version</span>
                      <span className="demo-tab active">History</span>
                      <span className="demo-tab">Stats</span>
                    </div>
                  </div>
                </div>
                <h4>5. Bitcoin Inscription</h4>
                <p>Inscribed versions show ordinal numbers and blockchain transaction IDs. These become permanent, tradeable assets.</p>
              </div>

              <div className="demo-item">
                <div className="demo-mockup stats-demo">
                  <div className="mockup-header">
                    <span className="mockup-title">🌳 Work Tree</span>
                    <button className="mockup-close">×</button>
                  </div>
                  <div className="mockup-canvas">
                    <div className="demo-stats-grid">
                      <div className="stat-card">
                        <div className="stat-label">Total Versions</div>
                        <div className="stat-value">12</div>
                      </div>
                      <div className="stat-card">
                        <div className="stat-label">Published</div>
                        <div className="stat-value">5</div>
                      </div>
                      <div className="stat-card">
                        <div className="stat-label">Chain Integrity</div>
                        <div className="stat-value valid">✅ Valid</div>
                      </div>
                    </div>
                    <div className="demo-tabs">
                      <span className="demo-tab">Create Version</span>
                      <span className="demo-tab">History</span>
                      <span className="demo-tab active">Stats</span>
                    </div>
                  </div>
                </div>
                <h4>6. Chain Statistics</h4>
                <p>Comprehensive analytics showing version history, word counts, creation timeline, and cryptographic integrity verification.</p>
              </div>
            </div>
          </section>

          {/* Tokenization Section */}
          <section className="tokenization-section">
            <h2>🪙 Progressive Tokenization & Commodification</h2>
            <div className="tokenization-content">
              <div className="tokenization-explanation">
                <h3>The Commodification Pipeline</h3>
                <p>
                  Work Tree enables the <strong>progressive commodification of intellectual property</strong> by converting 
                  creative work into tradeable, divisible assets at the commit level.
                </p>
                
                <div className="commodification-stages">
                  <div className="stage">
                    <div className="stage-number">1</div>
                    <div className="stage-content">
                      <h4>Creation → Inscription</h4>
                      <p>Each commit becomes a Bitcoin Ordinal inscription with immutable provenance and timestamp.</p>
                    </div>
                  </div>

                  <div className="stage">
                    <div className="stage-number">2</div>
                    <div className="stage-content">
                      <h4>Inscription → Token</h4>
                      <p>Ordinals are wrapped as BRC-100 tokens, making them divisible and transferable.</p>
                    </div>
                  </div>

                  <div className="stage">
                    <div className="stage-number">3</div>
                    <div className="stage-content">
                      <h4>Token → Securities</h4>
                      <p>Tokens can have additional securities issued against them - shares in future royalties.</p>
                    </div>
                  </div>

                  <div className="stage">
                    <div className="stage-number">4</div>
                    <div className="stage-content">
                      <h4>Securities → Markets</h4>
                      <p>IP securities trade on secondary markets with price discovery and liquidity.</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="tokenization-example">
                <h3>📖 Real-World Example</h3>
                <div className="example-case">
                  <h4>Stephen King's "The Dark Tower" - Reimagined</h4>
                  <div className="example-timeline">
                    <div className="timeline-item">
                      <strong>Commit 1:</strong> "Initial world-building - Mid-World concept"
                      <div className="token-info">→ BRC-100 Token: KING001 (1000 shares @ 100 sats each)</div>
                    </div>
                    <div className="timeline-item">
                      <strong>Commit 47:</strong> "Roland character development breakthrough"  
                      <div className="token-info">→ BRC-100 Token: KING047 (500 shares @ 500 sats each)</div>
                    </div>
                    <div className="timeline-item">
                      <strong>Branch: alternate-ending:</strong> "Ka-tet survives ending"
                      <div className="token-info">→ BRC-100 Token: KING_ALT (250 shares @ 1000 sats each)</div>
                    </div>
                  </div>
                  
                  <div className="licensing-scenarios">
                    <h5>Licensing Scenarios:</h5>
                    <ul>
                      <li><strong>Netflix:</strong> Buys 40% of KING047 for TV adaptation rights to Roland's character arc</li>
                      <li><strong>Gaming Studio:</strong> Licenses 25% of KING001 for Mid-World game setting</li>
                      <li><strong>Fan Film Makers:</strong> Purchase micro-licenses (1 share) for homage content</li>
                      <li><strong>Academic Researchers:</strong> Citation licenses for literary analysis</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Securitization Section */}
          <section className="securitization-section">
            <h2>🏦 Securitization of Work Product</h2>
            <div className="securitization-grid">
              
              <div className="securitization-concept">
                <h3>💼 What is IP Securitization?</h3>
                <p>
                  <strong>Securitization</strong> is the process of creating tradeable securities backed by the future 
                  cash flows of intellectual property. In traditional finance, this might be mortgage-backed securities. 
                  In Work Tree, it's <strong>IP-backed securities</strong>.
                </p>
                
                <div className="securitization-formula">
                  <div className="formula-box">
                    <code>IP Asset + Future Royalties → Securities → Market Trading</code>
                  </div>
                </div>

                <h4>🎯 Why This Matters:</h4>
                <ul>
                  <li><strong>Liquidity:</strong> Convert future IP earnings into immediate capital</li>
                  <li><strong>Risk Distribution:</strong> Spread investment risk across many IP assets</li>
                  <li><strong>Price Discovery:</strong> Market determines true value of creative work</li>
                  <li><strong>Democratization:</strong> Anyone can invest in IP creation</li>
                </ul>
              </div>

              <div className="securitization-examples">
                <h3>🏛️ Securitization Models</h3>
                
                <div className="model-card">
                  <h4>📚 Literary Portfolio Securities</h4>
                  <p>Bundle multiple commits from different authors into diversified IP portfolios.</p>
                  <div className="model-example">
                    <strong>Example:</strong> "SciFi Futures Fund" - 1000 commits from 100 authors
                    <br />
                    <small>Risk: Diversified | Returns: Streaming royalties + adaptation rights</small>
                  </div>
                </div>

                <div className="model-card">
                  <h4>🎭 Character Development Bonds</h4>
                  <p>Securities backed specifically by character-creation commits across multiple works.</p>
                  <div className="model-example">
                    <strong>Example:</strong> All commits containing "Hermione Granger" development
                    <br />
                    <small>Risk: Character popularity | Returns: Merchandising + spin-off rights</small>
                  </div>
                </div>

                <div className="model-card">
                  <h4>🌍 World-Building Asset Pools</h4>
                  <p>Securitize commits that establish fictional worlds and their rules/lore.</p>
                  <div className="model-example">
                    <strong>Example:</strong> "Middle-earth Economic Zone" - all Tolkien world-building commits
                    <br />
                    <small>Risk: World consistency | Returns: Expanded universe licensing</small>
                  </div>
                </div>

                <div className="model-card">
                  <h4>🔬 Technical Innovation Derivatives</h4>
                  <p>Code commits and technical documentation as securitized assets.</p>
                  <div className="model-example">
                    <strong>Example:</strong> "Blockchain Protocol Evolution Fund" - protocol improvement commits
                    <br />
                    <small>Risk: Adoption rate | Returns: Implementation licensing fees</small>
                  </div>
                </div>
              </div>
            </div>

            <div className="securitization-warning">
              <h3>⚠️ Important Considerations</h3>
              <div className="warning-grid">
                <div className="warning-item">
                  <strong>Legal Framework:</strong> Securities laws vary by jurisdiction. Proper compliance required.
                </div>
                <div className="warning-item">
                  <strong>Valuation Complexity:</strong> IP valuation is subjective and market-dependent.
                </div>
                <div className="warning-item">
                  <strong>Attribution Integrity:</strong> Blockchain ensures immutable authorship records.
                </div>
                <div className="warning-item">
                  <strong>Fair Use Impact:</strong> May need to consider fair use and derivative work rights.
                </div>
              </div>
            </div>
          </section>

          {/* Use Cases */}
          <section className="use-cases-section">
            <h2>🎯 Revolutionary Use Cases</h2>
            <div className="use-cases-grid">
              
              <div className="use-case-card">
                <div className="use-case-icon">📖</div>
                <h3>Author Revenue Streams</h3>
                <p>Writers can monetize individual chapters, character developments, or world-building elements separately.</p>
                <div className="use-case-benefit">💰 Immediate income from work-in-progress</div>
              </div>

              <div className="use-case-card">
                <div className="use-case-icon">🎬</div>
                <h3>Hollywood Adaptation Rights</h3>
                <p>Studios can license specific story elements without acquiring entire IP, reducing costs and risks.</p>
                <div className="use-case-benefit">🎭 Granular rights management</div>
              </div>

              <div className="use-case-card">
                <div className="use-case-icon">🎮</div>
                <h3>Game Development Licensing</h3>
                <p>Game studios license world-building commits for setting design while leaving story rights with authors.</p>
                <div className="use-case-benefit">🌍 Shared universe economics</div>
              </div>

              <div className="use-case-card">
                <div className="use-case-icon">🏛️</div>
                <h3>Academic Citation Markets</h3>
                <p>Researchers can license specific methodologies, findings, or theoretical frameworks at the commit level.</p>
                <div className="use-case-benefit">📚 Micro-attribution economics</div>
              </div>

              <div className="use-case-card">
                <div className="use-case-icon">💼</div>
                <h3>Corporate IP Investment</h3>
                <p>Companies invest in IP creation portfolios, similar to venture capital but for creative assets.</p>
                <div className="use-case-benefit">📈 New asset class for institutions</div>
              </div>

              <div className="use-case-card">
                <div className="use-case-icon">🤖</div>
                <h3>AI Training Data Licensing</h3>
                <p>AI companies pay writers for high-quality training data with provable authorship and attribution.</p>
                <div className="use-case-benefit">🧠 Ethical AI development funding</div>
              </div>
            </div>
          </section>

          {/* Technical Implementation */}
          <section className="technical-section">
            <h2>⚙️ Technical Implementation</h2>
            <div className="tech-grid">
              
              <div className="tech-item">
                <h3>🔐 Cryptographic Integrity</h3>
                <ul>
                  <li><strong>SHA-256 Hashing:</strong> Real-time content verification</li>
                  <li><strong>Merkle Trees:</strong> Efficient batch verification of commits</li>
                  <li><strong>Digital Signatures:</strong> Cryptographic proof of authorship</li>
                </ul>
              </div>

              <div className="tech-item">
                <h3>⛓️ Blockchain Integration</h3>
                <ul>
                  <li><strong>Bitcoin Ordinals:</strong> Immutable inscription storage</li>
                  <li><strong>BRC-100 Tokens:</strong> Divisible IP ownership</li>
                  <li><strong>Smart Contracts:</strong> Automated royalty distribution</li>
                </ul>
              </div>

              <div className="tech-item">
                <h3>🎨 User Experience</h3>
                <ul>
                  <li><strong>Visual Git Tree:</strong> Intuitive branching interface</li>
                  <li><strong>Real-time Hashing:</strong> Live feedback as you type</li>
                  <li><strong>Time Travel:</strong> One-click historical restoration</li>
                </ul>
              </div>

              <div className="tech-item">
                <h3>📊 Attribution Engine</h3>
                <ul>
                  <li><strong>Git Integration:</strong> Full GPL-2.0 compliant implementation</li>
                  <li><strong>Diff Analysis:</strong> Precise contribution tracking</li>
                  <li><strong>Collaboration Tools:</strong> Multi-author workflow support</li>
                </ul>
              </div>
            </div>
          </section>

          {/* Get Started */}
          <section className="get-started-section">
            <div className="get-started-content">
              <h2>🚀 Experience the Future of IP Creation</h2>
              <p>
                Work Tree represents a fundamental shift in how intellectual property is created, tracked, and monetized. 
                Every keystroke becomes part of a tradeable, verifiable asset with immutable provenance.
              </p>
              
              <div className="cta-buttons">
                <a href="/" className="cta-button primary">
                  Try Work Tree Now
                </a>
                <a href="/docs" className="cta-button secondary">
                  Technical Documentation
                </a>
              </div>

              <div className="attribution-note">
                <p>
                  <strong>Open Source:</strong> Work Tree integrates Git (GPL-2.0) with full attribution to the Git development community. 
                  This innovation extends Git's revolutionary version control to the realm of intellectual property tokenization.
                </p>
              </div>
            </div>
          </section>

        </div>
        <Footer />
      </div>
    </div>
  );
};

export default WorkTreePage;