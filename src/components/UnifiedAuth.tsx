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
    // For development, open Twitter's actual OAuth URL directly
    // This avoids conflicts with Google SSO
    const width = 600;
    const height = 700;
    const left = (window.screen.width - width) / 2;
    const top = (window.screen.height - height) / 2;
    
    // Check if we have Vercel API configured
    const useVercelApi = process.env.REACT_APP_USE_VERCEL_API === 'true';
    
    if (useVercelApi) {
      // Use Vercel API route - open directly to avoid popup blocker
      const authUrl = '/api/auth/twitter/authorize';
      const windowName = 'TwitterAuthWindow' + Date.now();
      
      // Open the window directly on user click to avoid popup blocker
      const authWindow = window.open(
        authUrl,
        windowName,
        `width=${width},height=${height},left=${left},top=${top},toolbar=no,menubar=no,scrollbars=yes,resizable=yes`
      );
      
      if (!authWindow || authWindow.closed || typeof authWindow.closed === 'undefined') {
        alert('Please allow popups for Twitter authentication. Check your browser\'s address bar for a blocked popup notification.');
        return;
      }
      
      // Listen for messages from the popup
      const handleMessage = (event: MessageEvent) => {
        if (event.origin !== window.location.origin) return;
        
        if (event.data.type === 'twitter-auth-success') {
          setTwitterUser(event.data.user);
          localStorage.setItem('twitterUser', JSON.stringify(event.data.user));
          window.removeEventListener('message', handleMessage);
          setShowAuthModal(false);
        }
      };
      
      window.addEventListener('message', handleMessage);
    } else {
      // For now, use mock connection to avoid OAuth conflicts
      // Close the modal first to prevent confusion
      setShowAuthModal(false);
      
      // Simulate a delay as if OAuth is happening
      setTimeout(() => {
        const mockTwitterUser = {
          username: 'bitcoin_writer',
          name: 'Bitcoin Writer',
          profile_image_url: 'https://pbs.twimg.com/profile_images/1844449428127928320/C0dTi8M4_400x400.jpg'
        };
        setTwitterUser(mockTwitterUser);
        localStorage.setItem('twitterUser', JSON.stringify(mockTwitterUser));
      }, 500);
    }
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
                  
                  {!process.env.TWITTER_CLIENT_ID ? (
                    <div className="config-notice">
                      <h4>⚠️ Twitter/X Integration Setup Required</h4>
                      <p>To enable Twitter features, add these to your Vercel environment variables:</p>
                      <code>TWITTER_CLIENT_ID=your-twitter-client-id</code>
                      <code>TWITTER_CLIENT_SECRET=your-twitter-client-secret</code>
                      <p>Set your Twitter App callback URL to:</p>
                      <code>{window.location.origin}/api/auth/twitter/callback</code>
                    </div>
                  ) : null}
                  
                  <div className="topup-buttons-section">
                    <h4>Quick Top-up</h4>
                    <div className="topup-buttons">
                      <button className="topup-btn" onClick={() => {
                        console.log('Opening $5 BSV top-up');
                      }}>
                        <svg width="16" height="16" viewBox="0 0 32 32" fill="#FFD700" style={{ marginRight: '6px' }}>
                          <text x="16" y="26" font-family="Arial, sans-serif" font-size="28" font-weight="bold" fill="#FFD700" text-anchor="middle">B</text>
                        </svg>
                        $5
                      </button>
                      <button className="topup-btn" onClick={() => {
                        console.log('Opening $10 BSV top-up');
                      }}>
                        <svg width="16" height="16" viewBox="0 0 32 32" fill="#FFD700" style={{ marginRight: '6px' }}>
                          <text x="16" y="26" font-family="Arial, sans-serif" font-size="28" font-weight="bold" fill="#FFD700" text-anchor="middle">B</text>
                        </svg>
                        $10
                      </button>
                      <button className="topup-btn" onClick={() => {
                        console.log('Opening $50 BSV top-up');
                      }}>
                        <svg width="16" height="16" viewBox="0 0 32 32" fill="#FFD700" style={{ marginRight: '6px' }}>
                          <text x="16" y="26" font-family="Arial, sans-serif" font-size="28" font-weight="bold" fill="#FFD700" text-anchor="middle">B</text>
                        </svg>
                        $50
                      </button>
                    </div>
                  </div>
                  
                  <button className="premium-subscribe-btn" onClick={() => {
                    console.log('Opening premium subscription flow');
                  }}>
                    <svg width="20" height="20" viewBox="0 0 32 32" fill="#FFD700" style={{ marginRight: '8px' }}>
                      <path d="M16 0C7.164 0 0 7.164 0 16s7.164 16 16 16 16-7.164 16-16S24.836 0 16 0zm7.015 17.002c-.236 1.578-1.043 2.754-2.277 3.317-.614.281-1.334.425-2.151.425v3.256h-2v-3.183c-.522 0-1.056-.005-1.601-.014v3.197h-2v-3.256c-.437-.004-.862-.009-1.271-.009l-2.609-.002.002-2.139s1.52.025 1.496.001c.549 0 .728-.23.78-.604l.003-4.589-.003-3.403c-.098-.488-.363-.74-.975-.74.023-.022-1.496-.001-1.496-.001L8.91 7H11.7c.399 0 .833.004 1.287.01V4h2v2.943c.541-.007 1.067-.011 1.577-.011V4h2v3.026c1.297.065 2.341.332 3.089.898 1.037.784 1.558 2.003 1.362 3.078z"/>
                    </svg>
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
                
                <div className="topup-buttons-section">
                  <h4>Quick Top-up</h4>
                  <div className="topup-buttons">
                    <button className="topup-btn" onClick={() => {
                      console.log('Opening $5 BSV top-up');
                    }}>
                      <svg width="20" height="20" viewBox="0 0 32 32" style={{ marginRight: '6px' }}>
                        <text x="16" y="26" font-family="Arial, sans-serif" font-size="28" font-weight="bold" fill="#FFD700" text-anchor="middle">B</text>
                      </svg>
                      $5
                    </button>
                    <button className="topup-btn" onClick={() => {
                      console.log('Opening $10 BSV top-up');
                    }}>
                      <svg width="20" height="20" viewBox="0 0 32 32" style={{ marginRight: '6px' }}>
                        <text x="16" y="26" font-family="Arial, sans-serif" font-size="28" font-weight="bold" fill="#FFD700" text-anchor="middle">B</text>
                      </svg>
                      $10
                    </button>
                    <button className="topup-btn" onClick={() => {
                      console.log('Opening $50 BSV top-up');
                    }}>
                      <svg width="20" height="20" viewBox="0 0 32 32" style={{ marginRight: '6px' }}>
                        <text x="16" y="26" font-family="Arial, sans-serif" font-size="28" font-weight="bold" fill="#FFD700" text-anchor="middle">B</text>
                      </svg>
                      $50
                    </button>
                  </div>
                </div>
                
                <button className="premium-subscribe-btn" onClick={() => {
                  console.log('Opening premium subscription flow');
                }}>
                  <svg width="24" height="24" viewBox="0 0 32 32" style={{ marginRight: '8px' }}>
                    <text x="16" y="26" font-family="Arial, sans-serif" font-size="28" font-weight="bold" fill="#FFD700" text-anchor="middle">B</text>
                  </svg>
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