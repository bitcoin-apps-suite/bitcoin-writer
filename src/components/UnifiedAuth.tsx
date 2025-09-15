import React, { useState, useEffect } from 'react';
import GoogleAuthButton from './GoogleAuth';
import { HandCashService } from '../services/HandCashService';
import './UnifiedAuth.css';

interface UnifiedAuthProps {
  googleUser: any;
  setGoogleUser: (user: any) => void;
  isHandCashAuthenticated: boolean;
  currentHandCashUser: any;
  handcashService: HandCashService;
  onHandCashLogin: () => void;
  onHandCashLogout: () => void;
}

const UnifiedAuth: React.FC<UnifiedAuthProps> = ({
  googleUser,
  setGoogleUser,
  isHandCashAuthenticated,
  currentHandCashUser,
  handcashService,
  onHandCashLogin,
  onHandCashLogout
}) => {
  const [showDropdown, setShowDropdown] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [twitterUser, setTwitterUser] = useState<any>(null);

  useEffect(() => {
    // Check for stored Twitter user
    const storedTwitterUser = localStorage.getItem('twitterUser');
    if (storedTwitterUser) {
      setTwitterUser(JSON.parse(storedTwitterUser));
    }
  }, []);

  // Determine auth state
  const hasGoogle = !!googleUser;
  const hasHandCash = isHandCashAuthenticated;
  const hasTwitter = !!twitterUser;
  const hasFullAuth = hasGoogle && hasHandCash;

  const handleGoogleLogout = () => {
    localStorage.removeItem('googleUser');
    localStorage.removeItem('googleCredential');
    setGoogleUser(null);
    setShowDropdown(false);
  };

  const handleHandCashLogout = () => {
    onHandCashLogout();
    setShowDropdown(false);
  };

  const handleTwitterConnect = () => {
    // Twitter OAuth flow would go here
    // For now, simulate with mock data
    const mockTwitterUser = {
      username: 'bitcoin_writer',
      name: 'Bitcoin Writer',
      profile_image_url: 'https://pbs.twimg.com/profile_images/1234567890/avatar.jpg'
    };
    setTwitterUser(mockTwitterUser);
    localStorage.setItem('twitterUser', JSON.stringify(mockTwitterUser));
  };

  const handleTwitterLogout = () => {
    localStorage.removeItem('twitterUser');
    setTwitterUser(null);
    setShowDropdown(false);
  };

  // If no auth at all, show single sign in button
  if (!hasGoogle && !hasHandCash && !hasTwitter) {
    return (
      <div className="unified-auth-container">
        <button 
          className="sign-in-btn"
          onClick={() => setShowAuthModal(true)}
        >
          Sign In
        </button>
        
        {showAuthModal && (
          <>
            <div className="auth-modal-overlay" onClick={() => setShowAuthModal(false)} />
            <div className="auth-modal">
              <div className="auth-modal-header">
                <h2>Sign in to Bitcoin Writer</h2>
                <button className="modal-close" onClick={() => setShowAuthModal(false)}>×</button>
              </div>
              
              <div className="auth-modal-content">
                <div className="auth-options">
                  <GoogleAuthButton 
                    onAuthSuccess={(user) => {
                      setGoogleUser(user);
                      setShowAuthModal(false);
                    }}
                    onAuthFailure={() => {
                      console.error('Google auth failed');
                    }}
                  />
                  
                  <div className="auth-divider">
                    <span>or</span>
                  </div>
                  
                  <button 
                    className="handcash-login-btn full-width"
                    onClick={() => {
                      onHandCashLogin();
                      setShowAuthModal(false);
                    }}
                  >
                    💰 Sign in with HandCash
                  </button>
                  
                  <div className="auth-divider">
                    <span>or</span>
                  </div>
                  
                  <button 
                    className="twitter-login-btn full-width"
                    onClick={() => {
                      handleTwitterConnect();
                      setShowAuthModal(false);
                    }}
                  >
                    🐦 Connect X (Twitter)
                  </button>
                </div>
                
                <div className="auth-benefits">
                  <h3>Why sign in?</h3>
                  <ul>
                    <li>🔐 Secure blockchain storage</li>
                    <li>📁 Google Drive integration</li>
                    <li>📧 Share via Gmail</li>
                    <li>🐦 Post to X/Twitter</li>
                    <li>💰 BSV transactions</li>
                    <li>📅 Schedule publications</li>
                    <li>💸 Receive payments for your writing</li>
                    <li>🎯 Monetize premium content</li>
                  </ul>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    );
  }

  // If we have at least one auth, show unified interface
  return (
    <div className="unified-auth-container">
      <div 
        className="unified-auth-badge"
        onClick={() => setShowDropdown(!showDropdown)}
      >
        <div className="auth-avatars">
          {hasGoogle && (
            <img 
              src={googleUser.picture} 
              alt={googleUser.name}
              className="auth-avatar google-avatar"
              title={`Google: ${googleUser.name}`}
            />
          )}
          {hasHandCash && (
            <div 
              className="auth-avatar handcash-avatar"
              title={`HandCash: $${currentHandCashUser?.handle}`}
            >
              💰
            </div>
          )}
        </div>
        
        <div className="auth-info">
          <div className="auth-name">
            {hasGoogle ? googleUser.name : `$${currentHandCashUser?.handle}`}
          </div>
          <div className="auth-status">
            {hasFullAuth ? (
              <span className="status-full">✓ Full Access</span>
            ) : hasGoogle ? (
              <span className="status-partial">⚠️ Add HandCash for BSV</span>
            ) : (
              <span className="status-partial">⚠️ Add Google for full features</span>
            )}
          </div>
        </div>
        
        <span className="dropdown-arrow">▼</span>
      </div>

      {showDropdown && (
        <>
          <div className="dropdown-overlay" onClick={() => setShowDropdown(false)} />
          <div className="unified-dropdown">
            {/* User Info Section */}
            <div className="dropdown-section">
              <h4>Connected Accounts</h4>
              
              {hasGoogle && (
                <div className="account-item google-account">
                  <img src={googleUser.picture} alt="" className="account-avatar" />
                  <div className="account-info">
                    <div className="account-name">{googleUser.name}</div>
                    <div className="account-email">{googleUser.email}</div>
                    <div className="account-features">
                      ✓ Google Drive • ✓ Gmail • ✓ Calendar • ✓ Stripe
                    </div>
                  </div>
                  <button 
                    className="account-logout"
                    onClick={handleGoogleLogout}
                  >
                    Sign Out
                  </button>
                </div>
              )}
              
              {hasHandCash && (
                <div className="account-item handcash-account">
                  <div className="account-avatar">💰</div>
                  <div className="account-info">
                    <div className="account-name">${currentHandCashUser?.handle}</div>
                    <div className="account-email">{currentHandCashUser?.paymail}</div>
                    <div className="account-features">
                      ✓ BSV Transactions • ✓ On-chain Storage • ✓ Crypto Payments
                    </div>
                  </div>
                  <button 
                    className="account-logout"
                    onClick={handleHandCashLogout}
                  >
                    Sign Out
                  </button>
                </div>
              )}
              
              {hasTwitter && (
                <div className="account-item twitter-account">
                  <div className="account-avatar">🕊️</div>
                  <div className="account-info">
                    <div className="account-name">@{twitterUser?.username}</div>
                    <div className="account-email">{twitterUser?.name}</div>
                    <div className="account-features">
                      ✓ Post to Timeline • ✓ Schedule Tweets • ✓ Share Documents
                    </div>
                  </div>
                  <button 
                    className="account-logout"
                    onClick={handleTwitterLogout}
                  >
                    Sign Out
                  </button>
                </div>
              )}
            </div>

            {/* Add missing account section */}
            {(!hasFullAuth || !hasTwitter) && (
              <div className="dropdown-section add-account-section">
                <h4>Add More Connections</h4>
                {!hasGoogle && (
                  <div className="add-account-item">
                    <GoogleAuthButton 
                      onAuthSuccess={(user) => {
                        setGoogleUser(user);
                        setShowDropdown(false);
                      }}
                      onAuthFailure={() => {
                        console.error('Google auth failed');
                      }}
                    />
                    <span className="add-account-text">
                      Add Google for Drive, Gmail, Calendar & Stripe payments
                    </span>
                  </div>
                )}
                {!hasHandCash && (
                  <div className="add-account-item">
                    <button 
                      className="handcash-login-btn compact"
                      onClick={() => {
                        onHandCashLogin();
                        setShowDropdown(false);
                      }}
                    >
                      💰 Connect HandCash
                    </button>
                    <span className="add-account-text">
                      Add HandCash for blockchain storage & BSV transactions
                    </span>
                  </div>
                )}
                {!hasTwitter && (
                  <div className="add-account-item">
                    <button 
                      className="twitter-login-btn compact"
                      onClick={() => {
                        handleTwitterConnect();
                        setShowDropdown(false);
                      }}
                    >
                      🕊️ Connect X (Twitter)
                    </button>
                    <span className="add-account-text">
                      Add X to post documents and schedule tweets
                    </span>
                  </div>
                )}
              </div>
            )}

            {/* BSV Credits Section */}
            {hasHandCash && (
              <div className="dropdown-section bsv-credits-section">
                <h4>BSV Credits</h4>
                <div className="credits-info">
                  <div className="balance-display">
                    <div className="balance-amount">
                      <span className="balance-label">Available Balance:</span>
                      <span className="balance-value">0.00 BSV</span>
                    </div>
                    <div className="balance-usd">≈ $0.00 USD</div>
                  </div>
                  
                  <div className="buy-credits-container">
                    <button className="buy-bsv-btn" onClick={() => {
                      // This would open Stripe checkout
                      console.log('Opening BSV purchase flow');
                    }}>
                      💳 Buy BSV Credits
                    </button>
                    <div className="credit-packages">
                      <div className="package-item">
                        <span className="package-amount">$10</span>
                        <span className="package-desc">~1000 documents</span>
                      </div>
                      <div className="package-item">
                        <span className="package-amount">$25</span>
                        <span className="package-desc">~2500 documents</span>
                      </div>
                      <div className="package-item popular">
                        <span className="package-amount">$50</span>
                        <span className="package-desc">~5000 documents</span>
                        <span className="popular-badge">Most Popular</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="credits-note">
                    <p>💡 We convert your payment to BSV and add it to your HandCash wallet</p>
                    <p>📝 Each document costs ~1¢ to store permanently on blockchain</p>
                  </div>
                </div>
              </div>
            )}
            
            {/* Subscription Section - Now optional */}
            {hasGoogle && !hasHandCash && (
              <div className="dropdown-section subscription-section">
                <h4>Get Started</h4>
                <div className="subscription-info">
                  <p className="connect-prompt">Connect HandCash to start storing documents on the blockchain!</p>
                  <button 
                    className="handcash-login-btn full-width"
                    onClick={() => {
                      onHandCashLogin();
                      setShowDropdown(false);
                    }}
                  >
                    💰 Connect HandCash Wallet
                  </button>
                </div>
              </div>
            )}

            {/* Quick Actions */}
            <div className="dropdown-section actions-section">
              <button className="action-item" onClick={() => {
                setShowDropdown(false);
                // Open settings
              }}>
                ⚙️ Account Settings
              </button>
              {hasGoogle && (
                <button className="action-item" onClick={() => {
                  setShowDropdown(false);
                  // Open Google Drive
                  window.open('https://drive.google.com', '_blank');
                }}>
                  📁 Open Google Drive
                </button>
              )}
              {hasHandCash && (
                <button className="action-item" onClick={() => {
                  setShowDropdown(false);
                  // Open HandCash wallet
                  window.open('https://app.handcash.io', '_blank');
                }}>
                  💳 Open HandCash Wallet
                </button>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default UnifiedAuth;