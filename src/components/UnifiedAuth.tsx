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
  const [showSubstackModal, setShowSubstackModal] = useState(false);

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
                <h2>Connect to Bitcoin Writer</h2>
                <button className="modal-close" onClick={() => setShowAuthModal(false)}>×</button>
              </div>
              
              <div className="auth-modal-content">
                <div className="auth-options">
                  <div className="google-btn-wrapper">
                    <GoogleAuthButton 
                      onAuthSuccess={(user) => {
                        setGoogleUser(user);
                        setShowAuthModal(false);
                      }}
                      onAuthFailure={() => {
                        console.error('Google auth failed');
                      }}
                    />
                  </div>
                  
                  <button 
                    className="handcash-login-btn full-width"
                    onClick={() => {
                      onHandCashLogin();
                      setShowAuthModal(false);
                    }}
                  >
                    <img src="https://handcash.io/favicon.ico" alt="HandCash" style={{ width: '20px', height: '20px', marginRight: '8px' }} />
                    Connect HandCash Wallet
                  </button>
                  
                  <button 
                    className="twitter-login-btn full-width"
                    onClick={() => {
                      handleTwitterConnect();
                      setShowAuthModal(false);
                    }}
                  >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" style={{ marginRight: '8px' }}>
                      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                    </svg>
                    Connect X (Twitter)
                  </button>
                  
                  
                  <button 
                    className="substack-login-btn full-width"
                    onClick={() => {
                      setShowSubstackModal(true);
                    }}
                  >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="#000000" style={{ marginRight: '8px' }}>
                      <path d="M22.539 8.242H1.46V5.406h21.08v2.836zM1.46 10.812V24L12 18.11 22.54 24V10.812H1.46zM22.54 0H1.46v2.836h21.08V0z"/>
                    </svg>
                    Connect Substack
                  </button>
                </div>
                
                <div className="auth-benefits">
                  <h3>Why connect?</h3>
                  <p className="simple-explanation">
                    Bitcoin Writer allows you to write documents directly on the blockchain, encrypt, timelock, publish, charge for access, post to Twitter and Substack, and backup to Google Drive or send via Gmail. Connect your HandCash wallet to receive payments, tokenize your documents and issue dividend bearing shares in the revenue they generate that can be independently traded on decentralized exchanges. Subscribe to top-up with monthly bitcoin straight to your HandCash wallet or directly to your Bitcoin Writer wallet.
                  </p>
                  
                  {!process.env.REACT_APP_GOOGLE_CLIENT_ID || process.env.REACT_APP_GOOGLE_CLIENT_ID === 'YOUR_GOOGLE_CLIENT_ID_HERE' ? (
                    <div className="config-notice">
                      <h4>⚠️ Google Integration Setup Required</h4>
                      <p>To enable Google features, add your Google Client ID to the .env file:</p>
                      <code>REACT_APP_GOOGLE_CLIENT_ID=your-actual-client-id.apps.googleusercontent.com</code>
                    </div>
                  ) : null}
                  
                  <button className="premium-subscribe-btn" onClick={() => {
                    console.log('Opening premium subscription flow');
                  }}>
                    <img src="/logo.svg" alt="Bitcoin Writer" style={{ width: '20px', height: '20px', marginRight: '8px' }} />
                    Subscribe Now - $9.99/month
                  </button>
                </div>
              </div>
            </div>
          </>
        )}
        
        {/* Substack Modal */}
        {showSubstackModal && (
          <>
            <div className="auth-modal-overlay" onClick={() => setShowSubstackModal(false)} />
            <div className="substack-modal">
              <div className="substack-modal-header">
                <h2>😅 Oops!</h2>
                <button className="modal-close" onClick={() => setShowSubstackModal(false)}>×</button>
              </div>
              <div className="substack-modal-content">
                <div className="substack-message">
                  <h3>Substack doesn't do OAuth, sucker!</h3>
                  <p>They keep their API locked up tighter than Fort Knox. 🔒</p>
                  <p>But hey, you can still copy/paste your articles manually like it's 1999! 📋</p>
                  <button 
                    className="substack-ok-btn"
                    onClick={() => setShowSubstackModal(false)}
                  >
                    Thanks for Nothing, Substack
                  </button>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    );
  }

  // If we have at least one auth, show unified interface with orange button style
  return (
    <div className="unified-auth-container">
      <button 
        className="sign-in-btn"
        onClick={() => setShowAuthModal(true)}
      >
        <div className="auth-avatars">
          {hasGoogle && (
            <img 
              src={googleUser.picture} 
              alt={googleUser.name}
              className="auth-avatar google-avatar"
              title={`Google: ${googleUser.name}`}
              style={{width: '20px', height: '20px', borderRadius: '50%'}}
            />
          )}
          {hasHandCash && (
            <div 
              className="auth-avatar handcash-avatar"
              title={`HandCash: $${currentHandCashUser?.handle}`}
              style={{width: '20px', height: '20px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px'}}
            >
              💰
            </div>
          )}
          {hasTwitter && (
            <div 
              className="auth-avatar twitter-avatar"
              title={`Twitter: @${twitterUser?.username}`}
              style={{width: '20px', height: '20px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px'}}
            >
              🕊️
            </div>
          )}
        </div>
        <span>
          {hasFullAuth ? 'Manage Connections' : 
           hasGoogle || hasHandCash || hasTwitter ? 'Add More' : 'Sign In'}
        </span>
      </button>

      {/* Use the same modal for connected users */}
      {showAuthModal && (
        <>
          <div className="auth-modal-overlay" onClick={() => setShowAuthModal(false)} />
          <div className="auth-modal">
            <div className="auth-modal-header">
              <h2>Manage Connections</h2>
              <button className="modal-close" onClick={() => setShowAuthModal(false)}>×</button>
            </div>
            
            <div className="auth-modal-content">
              <div className="auth-options">
                <div className="google-btn-wrapper">
                  {hasGoogle ? (
                    <div className="connected-account-card google-connected">
                      <img src={googleUser.picture} alt="" className="connected-avatar" />
                      <div className="connected-info">
                        <div className="connected-name">{googleUser.name}</div>
                        <div className="connected-email">{googleUser.email}</div>
                      </div>
                      <button className="disconnect-btn" onClick={handleGoogleLogout}>
                        Disconnect
                      </button>
                    </div>
                  ) : (
                    <GoogleAuthButton 
                      onAuthSuccess={(user) => {
                        setGoogleUser(user);
                        setShowAuthModal(false);
                      }}
                      onAuthFailure={() => {
                        console.error('Google auth failed');
                      }}
                    />
                  )}
                </div>
                
                {hasHandCash ? (
                  <div className="connected-account-card handcash-connected">
                    <div className="connected-avatar">
                      {currentHandCashUser?.avatarUrl ? (
                        <img src={currentHandCashUser.avatarUrl} alt="HandCash Avatar" style={{width: '100%', height: '100%', borderRadius: '50%'}} />
                      ) : (
                        <img src="https://handcash.io/favicon.ico" alt="HandCash" style={{width: '20px', height: '20px'}} />
                      )}
                    </div>
                    <div className="connected-info">
                      <div className="connected-name">${currentHandCashUser?.handle}</div>
                      <div className="connected-email">{currentHandCashUser?.paymail}</div>
                    </div>
                    <button className="disconnect-btn" onClick={handleHandCashLogout}>
                      Disconnect
                    </button>
                  </div>
                ) : (
                  <button 
                    className="handcash-login-btn full-width"
                    onClick={() => {
                      onHandCashLogin();
                      setShowAuthModal(false);
                    }}
                  >
                    <img src="https://handcash.io/favicon.ico" alt="HandCash" style={{ width: '20px', height: '20px', marginRight: '8px' }} />
                    Connect HandCash Wallet
                  </button>
                )}
                
                {hasTwitter ? (
                  <div className="connected-account-card twitter-connected">
                    <div className="connected-avatar">
                      {twitterUser?.profile_image_url ? (
                        <img src={twitterUser.profile_image_url} alt="Twitter Avatar" style={{width: '100%', height: '100%', borderRadius: '50%'}} />
                      ) : (
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                        </svg>
                      )}
                    </div>
                    <div className="connected-info">
                      <div className="connected-name">@{twitterUser?.username}</div>
                      <div className="connected-email">{twitterUser?.name}</div>
                    </div>
                    <button className="disconnect-btn" onClick={handleTwitterLogout}>
                      Disconnect
                    </button>
                  </div>
                ) : (
                  <button 
                    className="twitter-login-btn full-width"
                    onClick={() => {
                      handleTwitterConnect();
                      setShowAuthModal(false);
                    }}
                  >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" style={{ marginRight: '8px' }}>
                      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                    </svg>
                    Connect X (Twitter)
                  </button>
                )}
                
                <button 
                  className="substack-login-btn full-width"
                  onClick={() => {
                    setShowSubstackModal(true);
                  }}
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="#000000" style={{ marginRight: '8px' }}>
                    <path d="M22.539 8.242H1.46V5.406h21.08v2.836zM1.46 10.812V24L12 18.11 22.54 24V10.812H1.46zM22.54 0H1.46v2.836h21.08V0z"/>
                  </svg>
                  Connect Substack
                </button>
              </div>
              
              <div className="auth-benefits">
                <h3>Why connect?</h3>
                <p className="simple-explanation">
                  Bitcoin Writer allows you to write documents directly on the blockchain, encrypt, timelock, publish, charge for access, post to Twitter and Substack, and backup to Google Drive or send via Gmail. Connect your HandCash wallet to receive payments, tokenize your documents and issue dividend bearing shares in the revenue they generate that can be independently traded on decentralized exchanges. Subscribe to top-up with monthly bitcoin straight to your HandCash wallet or directly to your Bitcoin Writer wallet.
                </p>
                
                <button className="premium-subscribe-btn" onClick={() => {
                  console.log('Opening premium subscription flow');
                }}>
                  <img src="/logo.svg" alt="Bitcoin Writer" style={{ width: '20px', height: '20px', marginRight: '8px' }} />
                  Subscribe Now - $9.99/month
                </button>
              </div>
            </div>
          </div>
        </>
      )}
      
      {/* Substack Modal */}
      {showSubstackModal && (
        <>
          <div className="auth-modal-overlay" onClick={() => setShowSubstackModal(false)} />
          <div className="substack-modal">
            <div className="substack-modal-header">
              <h2>😅 Oops!</h2>
              <button className="modal-close" onClick={() => setShowSubstackModal(false)}>×</button>
            </div>
            <div className="substack-modal-content">
              <div className="substack-message">
                <h3>Substack doesn't do OAuth, sucker!</h3>
                <p>They keep their API locked up tighter than Fort Knox. 🔒</p>
                <p>But hey, you can still copy/paste your articles manually like it's 1999! 📋</p>
                <button 
                  className="substack-ok-btn"
                  onClick={() => setShowSubstackModal(false)}
                >
                  Thanks for Nothing, Substack
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default UnifiedAuth;