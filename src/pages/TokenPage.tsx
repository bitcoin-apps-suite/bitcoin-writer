import React, { useState } from 'react';
import CleanTaskbar from '../components/CleanTaskbar';
import UnifiedAuth from '../components/UnifiedAuth';
import { HandCashService } from '../services/HandCashService';
import './TokenPage.css';

const TokenPage: React.FC = () => {
  const [googleUser, setGoogleUser] = useState<any>(null);
  const [isHandCashAuthenticated, setIsHandCashAuthenticated] = useState(false);
  const [currentHandCashUser, setCurrentHandCashUser] = useState<any>(null);
  const handcashService = new HandCashService();

  return (
    <div className="App">
      <div className="taskbar-header">
        <CleanTaskbar 
          isAuthenticated={isHandCashAuthenticated}
          currentUser={currentHandCashUser}
          onLogout={() => {
            setIsHandCashAuthenticated(false);
            setCurrentHandCashUser(null);
          }}
        />
      </div>
      <div style={{ position: 'fixed', top: '60px', right: '20px', zIndex: 1000 }}>
        <UnifiedAuth 
          googleUser={googleUser}
          setGoogleUser={setGoogleUser}
          isHandCashAuthenticated={isHandCashAuthenticated}
          currentHandCashUser={currentHandCashUser}
          handcashService={handcashService}
          onHandCashLogin={() => {
            // HandCash login logic
          }}
          onHandCashLogout={() => {
            setIsHandCashAuthenticated(false);
            setCurrentHandCashUser(null);
          }}
        />
      </div>
      <div className="token-page">
      <div className="token-container">
        {/* Hero Section */}
        <section className="token-hero">
          <h1><span style={{color: '#ffffff'}}>The</span> Bitcoin Writer <span style={{color: '#ffffff'}}>Token</span></h1>
          <p className="token-tagline">
            Open-source development meets sustainable economics
          </p>
          <div className="token-badge">$BWRITER</div>
        </section>

        {/* Philosophy Section */}
        <section className="philosophy-section">
          <h2>Our Open-Source Philosophy</h2>
          <div className="philosophy-content">
            <p>
              Bitcoin Writer is an <strong>open-source project</strong> licensed under MIT and BSV licenses. 
              Our intention is to foster an open culture where forking, cloning, and adding to the code 
              and features is welcomed and encouraged.
            </p>
            <p>
              The $BWRITER token represents our approach to creating a sustainable economic model that 
              aims to reward contributors while maintaining transparency and openness.
            </p>
            <div className="philosophy-points">
              <div className="point">
                <h3>Open Culture</h3>
                <p>MIT & BSV Licensed, fork-friendly, collaborative</p>
              </div>
              <div className="point">
                <h3>Community First</h3>
                <p>Contributors earn tokens through meaningful work</p>
              </div>
              <div className="point">
                <h3>Value Aligned</h3>
                <p>Success shared with those who build it</p>
              </div>
            </div>
          </div>
        </section>

        {/* Token Model Section */}
        <section className="token-model-section">
          <h2>The $BWRITER Token Model</h2>
          <div className="model-card">
            <h3>How It Works</h3>
            <ul>
              <li>
                <strong>Token Distribution:</strong> Tokens are allocated at our discretion to developers 
                who contribute meaningful code that gets merged into production
              </li>
              <li>
                <strong>Revenue Sharing:</strong> The Bitcoin Corporation LTD intends to distribute 
                dividends to token holders from subscription revenues and exchange fees
              </li>
              <li>
                <strong>Contribution = Ownership:</strong> Build value, receive tokens, share in success
              </li>
              <li>
                <strong>Transparent Allocation:</strong> All token grants are recorded on-chain via BSV
              </li>
            </ul>
          </div>

          <div className="model-card warning">
            <h3>Important Notices</h3>
            <ul>
              <li>
                <strong>No Guarantees:</strong> Token allocation is entirely discretionary with no promises 
                of distribution for any particular contribution
              </li>
              <li>
                <strong>Not Employment:</strong> Contributing and receiving tokens does not constitute 
                an employment relationship or contract
              </li>
              <li>
                <strong>Not a Public Offering:</strong> This is not a solicitation for investment or 
                capital raising. $BWRITER tokens are rewards for contribution, not investment instruments
              </li>
              <li>
                <strong>Future Equity:</strong> The Bitcoin Corporation LTD may incorporate and offer 
                regulated equity shares separately from the token system
              </li>
            </ul>
          </div>
        </section>

        {/* Business Model Section */}
        <section className="business-section">
          <h2>The Bitcoin Corporation LTD</h2>
          <div className="business-content">
            <p className="intro">
              Our vision is to create sustainable open-source software through a hybrid model that 
              preserves freedom while generating value.
            </p>

            <div className="business-model">
              <h3>Revenue Model</h3>
              <div className="revenue-streams">
                <div className="stream">
                  <h4>Free Tier</h4>
                  <p>Self-hosted, open-source</p>
                  <p className="price">$0/month</p>
                </div>
                <div className="stream featured">
                  <h4>Pro Tier</h4>
                  <p>Hosted service, premium features</p>
                  <p className="price">$29/month</p>
                </div>
                <div className="stream">
                  <h4>Enterprise</h4>
                  <p>Custom deployment, SLA, support</p>
                  <p className="price">$299/month</p>
                </div>
              </div>
              
              <h3 style={{marginTop: '40px'}}>Exchange Revenue</h3>
              <div className="revenue-streams">
                <div className="stream">
                  <h4>Token Sales</h4>
                  <p>Users tokenize & sell their work</p>
                  <p className="price">2.5% fee</p>
                </div>
                <div className="stream featured">
                  <h4>Share Trading</h4>
                  <p>Secondary market for document shares</p>
                  <p className="price">1.5% fee</p>
                </div>
                <div className="stream">
                  <h4>NFT Marketplace</h4>
                  <p>Premium content & collections</p>
                  <p className="price">3% fee</p>
                </div>
              </div>
            </div>

            <div className="value-flow">
              <h3>Value Flow</h3>
              <div className="flow-diagram">
                <div className="flow-item">
                  <span>Subscriptions + Exchange fees</span>
                  <span className="arrow">→</span>
                </div>
                <div className="flow-item">
                  <span>Revenue to Bitcoin Software Ltd</span>
                  <span className="arrow">→</span>
                </div>
                <div className="flow-item">
                  <span>Dividends to $BWRITER holders</span>
                  <span className="arrow">→</span>
                </div>
                <div className="flow-item">
                  <span>Contributors rewarded for building</span>
                </div>
              </div>
              <p style={{textAlign: 'center', marginTop: '20px', fontSize: '14px', color: 'rgba(255, 255, 255, 0.6)'}}>
                The Bitcoin Writer Exchange enables creators to tokenize, sell shares, and trade their work,
                generating platform fees that contribute to the ecosystem's sustainability.
              </p>
            </div>
          </div>
        </section>

        {/* How to Contribute Section */}
        <section className="contribute-section">
          <h2>How to Earn $BWRITER Tokens</h2>
          <div className="contribute-steps">
            <div className="step">
              <div className="step-number">1</div>
              <h3>Fork & Build</h3>
              <p>Fork the repository and implement features, fixes, or improvements</p>
            </div>
            <div className="step">
              <div className="step-number">2</div>
              <h3>Submit PR</h3>
              <p>Create a pull request with clear description and documentation</p>
            </div>
            <div className="step">
              <div className="step-number">3</div>
              <h3>Get Merged</h3>
              <p>Quality code that adds value gets merged into production</p>
            </div>
            <div className="step">
              <div className="step-number">4</div>
              <h3>Receive Tokens</h3>
              <p>Tokens allocated based on contribution impact and quality</p>
            </div>
          </div>

          <div className="contribution-examples">
            <h3>What We Value</h3>
            <ul>
              <li>✅ Core feature implementation</li>
              <li>✅ Performance improvements</li>
              <li>✅ Security enhancements</li>
              <li>✅ Documentation and tests</li>
              <li>✅ UI/UX improvements</li>
              <li>✅ Bug fixes and refactoring</li>
            </ul>
          </div>
        </section>

        {/* Token Stats Section */}
        <section className="stats-section">
          <h2>Token Statistics</h2>
          <div className="stats-grid">
            <div className="stat">
              <h3>Total Supply</h3>
              <p className="stat-value">1,000,000,000</p>
              <p className="stat-label">$BWRITER tokens</p>
            </div>
            <div className="stat">
              <h3>Distributed</h3>
              <p className="stat-value">0</p>
              <p className="stat-label">Tokens allocated</p>
            </div>
            <div className="stat">
              <h3>Contributors</h3>
              <p className="stat-value">1</p>
              <p className="stat-label">Active developers</p>
            </div>
            <div className="stat">
              <h3>Network</h3>
              <p className="stat-value">BSV</p>
              <p className="stat-label">Blockchain</p>
            </div>
          </div>
        </section>

        {/* Legal Section */}
        <section className="legal-section">
          <h2>Legal & Regulatory Notice</h2>
          <div className="legal-content">
            <p>
              <strong>Revenue Sharing Model:</strong> The $BWRITER token is designed to enable revenue 
              sharing with contributors through dividend distributions. Token holders may receive dividends 
              based on platform revenues from subscriptions and exchange fees.
            </p>
            <p>
              <strong>Trading & Liquidity:</strong> The $BWRITER token is intended to be freely tradable 
              on the Bitcoin Writer Exchange and associated platforms. We encourage an active secondary 
              market to provide liquidity and price discovery for contributors' work.
            </p>
            <p>
              <strong>$BSHARE Fundraising:</strong> The Bitcoin Corporation LTD intends to issue $BSHARE 
              tokens as a fundraising mechanism. These tokens will represent participation in the platform's 
              success and may be offered through appropriate channels.
            </p>
            <p>
              By participating in the token ecosystem, you acknowledge that token allocation is discretionary, 
              regulatory frameworks may evolve, and you should conduct your own due diligence regarding 
              tax and legal implications in your jurisdiction.
            </p>
          </div>
        </section>

        {/* CTA Section */}
        <section className="cta-section">
          <h2>Ready to Build the Future?</h2>
          <div className="cta-buttons">
            <a 
              href="https://github.com/bitcoin-apps-suite/bitcoin-writer" 
              target="_blank" 
              rel="noopener noreferrer"
              className="cta-btn primary"
            >
              <svg height="20" width="20" viewBox="0 0 16 16" fill="currentColor">
                <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z"/>
              </svg>
              View on GitHub
            </a>
            <a 
              href="/developers" 
              className="cta-btn secondary"
            >
              Read Developer Docs
            </a>
          </div>
        </section>
      </div>
    </div>
    </div>
  );
};

export default TokenPage;