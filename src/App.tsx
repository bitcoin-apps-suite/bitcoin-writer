// Open BSV License version 5
// Copyright (c) 2025 @b0ase
// This software can only be used on BSV blockchains

import React, { useState, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import './App.css';
import FeaturesPage from './pages/FeaturesPage';
import TokenPage from './pages/TokenPage';
import BWriterContributionsPage from './pages/BWriterContributionsPage';
import DocsPage from './pages/DocsPage';
import TasksPage from './pages/TasksPage';
import DocumentEditor from './components/DocumentEditor';
import DocumentSidebar from './components/DocumentSidebar';
import HandCashCallback from './components/HandCashCallback';
import BapPage from './pages/BapPage';
import { BlockchainDocumentService, BlockchainDocument } from './services/BlockchainDocumentService';
import { HandCashService, HandCashUser } from './services/HandCashService';
import { GoogleAuthProvider } from './components/GoogleAuth';
import UnifiedAuth from './components/UnifiedAuth';
import CleanTaskbar from './components/CleanTaskbar';
import ProofOfConceptBanner from './components/ProofOfConceptBanner';
import DocumentExchangeView from './components/DocumentExchangeView';
import BitcoinAppsView from './components/BitcoinAppsView';
import BitcoinAppOverviews from './components/BitcoinAppOverviews';
import { BitcoinAppEvents } from './utils/appEvents';
import { cleanupEmptyDocuments } from './utils/cleanupDocuments';

function App() {
  const [documentService, setDocumentService] = useState<BlockchainDocumentService | null>(null);
  const [handcashService] = useState<HandCashService>(new HandCashService());
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentUser, setCurrentUser] = useState<HandCashUser | null>(null);
  const [googleUser, setGoogleUser] = useState<any>(null);
  const [showAIChat, setShowAIChat] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [currentDocument, setCurrentDocument] = useState<BlockchainDocument | null>(null);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const [showBitcoinMenu, setShowBitcoinMenu] = useState(false);
  const [showWriterMenu, setShowWriterMenu] = useState(false);
  const [showDevelopersMenu, setShowDevelopersMenu] = useState(false);
  const [sidebarRefresh, setSidebarRefresh] = useState(0);
  const [showExchange, setShowExchange] = useState(false);
  const [showFeatures, setShowFeatures] = useState(false);
  const [showBitcoinApps, setShowBitcoinApps] = useState(false);
  const [activeAppOverview, setActiveAppOverview] = useState<string | null>(null);
  const [publishedDocuments, setPublishedDocuments] = useState<BlockchainDocument[]>([]);

  // Listen for Document Exchange open event
  useEffect(() => {
    const handleOpenExchange = () => setShowExchange(true);
    window.addEventListener('openDocumentExchange', handleOpenExchange);
    return () => window.removeEventListener('openDocumentExchange', handleOpenExchange);
  }, []);

  // Listen for Features page open event
  useEffect(() => {
    const handleShowFeatures = () => {
      setShowFeatures(true);
      setShowExchange(false); // Close exchange if open
    };
    window.addEventListener('showFeaturesPage', handleShowFeatures);
    return () => window.removeEventListener('showFeaturesPage', handleShowFeatures);
  }, []);

  // Listen for Bitcoin Apps open event
  useEffect(() => {
    const handleOpenBitcoinApps = () => setShowBitcoinApps(true);
    window.addEventListener('loadBitcoinApps', handleOpenBitcoinApps);
    return () => window.removeEventListener('loadBitcoinApps', handleOpenBitcoinApps);
  }, []);

  // Listen for individual app events
  useEffect(() => {
    const appEventHandlers: { [key: string]: EventListener } = {};
    
    // Create handlers for each app except Exchange (which already has its own handler)
    Object.values(BitcoinAppEvents).forEach(eventName => {
      if (eventName !== BitcoinAppEvents.EXCHANGE && eventName !== BitcoinAppEvents.APPS) {
        appEventHandlers[eventName] = () => {
          setActiveAppOverview(eventName);
          setShowBitcoinApps(false);
          setShowExchange(false);
        };
        window.addEventListener(eventName, appEventHandlers[eventName]);
      }
    });

    return () => {
      Object.entries(appEventHandlers).forEach(([eventName, handler]) => {
        window.removeEventListener(eventName, handler);
      });
    };
  }, []);

  // Clean up empty/test documents on startup
  useEffect(() => {
    const deletedCount = cleanupEmptyDocuments();
    if (deletedCount > 0) {
      console.log(`Cleaned up ${deletedCount} empty/test documents`);
      // Refresh the sidebar to reflect the cleanup
      setSidebarRefresh(prev => prev + 1);
    }
  }, []);

  useEffect(() => {
    // Check for Google user first
    const storedGoogleUser = localStorage.getItem('googleUser');
    if (storedGoogleUser) {
      try {
        const user = JSON.parse(storedGoogleUser);
        setGoogleUser(user);
        console.log('Google user restored:', user);
      } catch (error) {
        console.error('Failed to parse Google user:', error);
      }
    }

    // Check if we're coming back from HandCash with an authToken
    const urlParams = new URLSearchParams(window.location.search);
    const hashParams = new URLSearchParams(window.location.hash.replace('#', ''));
    
    // Check multiple possible parameter names HandCash might use
    const authToken = urlParams.get('authToken') || 
                     urlParams.get('auth_token') || 
                     urlParams.get('access_token') || 
                     urlParams.get('token') ||
                     hashParams.get('authToken') ||
                     hashParams.get('auth_token') ||
                     hashParams.get('access_token') ||
                     hashParams.get('token');
    
    console.log('=== App Initialization ===');
    console.log('HandCash App ID:', process.env.REACT_APP_HANDCASH_APP_ID ? 'Configured' : 'NOT CONFIGURED');
    console.log('Current URL:', window.location.href);
    console.log('URL params:', Array.from(urlParams.entries()));
    console.log('Hash params:', Array.from(hashParams.entries()));
    console.log('Auth token found:', authToken ? 'Yes' : 'No');
    
    if (authToken) {
      // We have an authToken, handle the callback
      console.log('Found authToken, handling callback...');
      const handcashService = new HandCashService();
      handcashService.handleCallback(authToken).then(user => {
        console.log('Callback processed, user:', user);
        handleLogin(user);
        // Clean up URL after successful auth
        window.history.replaceState({}, document.title, window.location.pathname);
      }).catch(err => {
        console.error('Failed to handle callback:', err);
        alert('HandCash authentication failed. Please try again.');
      });
    } else {
      // Check existing authentication
      checkAuthentication();
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const checkAuthentication = () => {
    // Check if user is already logged in
    if (handcashService.isAuthenticated()) {
      const user = handcashService.getCurrentUser();
      setCurrentUser(user);
      setIsAuthenticated(true);
      initializeDocumentService();
    }
    setIsLoading(false);
  };

  const initializeDocumentService = async () => {
    const service = new BlockchainDocumentService(handcashService);
    await service.reconnect();
    setDocumentService(service);
  };

  const handleLogin = (user: HandCashUser) => {
    console.log('=== User Successfully Authenticated ===');
    console.log('User handle:', user.handle);
    console.log('User paymail:', user.paymail);
    console.log('=====================================');
    setCurrentUser(user);
    setIsAuthenticated(true);
    initializeDocumentService();
  };

  const handleLogout = () => {
    console.log('=== COMPLETE LOGOUT ===');
    
    // Use HandCash service logout
    handcashService.logout();
    
    // Clear EVERYTHING
    localStorage.clear();
    sessionStorage.clear();
    
    // Clear all cookies
    document.cookie.split(";").forEach(function(c) { 
      document.cookie = c.replace(/^ +/, "").replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/"); 
    });
    
    // Reset state
    setIsAuthenticated(false);
    setCurrentUser(null);
    setDocumentService(null);
    setCurrentDocument(null);
    
    console.log('Logout complete - refreshing page...');
    
    // Force hard reload to clear all memory
    setTimeout(() => {
      window.location.replace('/');
    }, 100);
  };

  return (
    <>
      <ProofOfConceptBanner />
      <GoogleAuthProvider>
        <Routes>
      <Route path="/auth/handcash/callback" element={<HandCashCallback />} />
      <Route path="/bitcoin-writer/bap" element={<BapPage />} />
      <Route path="/features" element={<FeaturesPage />} />
      <Route path="/token" element={<TokenPage />} />
      <Route path="/tasks" element={<TasksPage />} />
      <Route path="/contributions" element={<BWriterContributionsPage />} />
      <Route path="/docs" element={<DocsPage />} />
      <Route path="/*" element={
        isLoading ? (
          <div className="App">
            <div className="loading">Loading Bitcoin Writer...</div>
          </div>
        ) : (
          <div className="App">
            {/* Clean taskbar with proper spacing */}
            <CleanTaskbar
              isAuthenticated={isAuthenticated}
              currentUser={currentUser}
              onLogout={handleLogout}
              onNewDocument={() => {
                setCurrentDocument(null);
                setShowExchange(false);
              }}
              onSaveDocument={() => {
                const saveBtn = document.querySelector('.save-btn-mobile, [title*="Save"]') as HTMLElement;
                saveBtn?.click();
              }}
              onOpenTokenizeModal={() => {
                window.dispatchEvent(new CustomEvent('openTokenizeModal'));
              }}
              onOpenTwitterModal={() => {
                window.dispatchEvent(new CustomEvent('openTwitterModal'));
              }}
              documentService={documentService}
              onToggleAIChat={() => setShowAIChat(!showAIChat)}
            />
            
            {/* Old macOS-style taskbar (kept for reference, can be removed later) */}
            <div className="taskbar" style={{display: 'none'}}>
              <div className="taskbar-left">
                <div className="bitcoin-menu-container">
                  <button 
                    className="bitcoin-logo-button"
                    onClick={() => setShowBitcoinMenu(!showBitcoinMenu)}
                    aria-label="Bitcoin Menu"
                  >
                    <span className="bitcoin-logo">₿</span>
                  </button>
                  {showBitcoinMenu && (
                    <>
                      <div className="menu-overlay" onClick={() => setShowBitcoinMenu(false)} />
                      <div className="bitcoin-menu">
                        <div className="menu-header">
                          <div className="bitcoin-logo-small">₿</div>
                          <span>Bitcoin Writer</span>
                        </div>
                        <div className="menu-separator" />
                        <div className="menu-item" onClick={() => {
                          alert('Bitcoin Writer v1.0\n\nSecure blockchain document writing platform\n\n© @b0ase 2025\nBuilt on Bitcoin SV blockchain');
                          setShowBitcoinMenu(false);
                        }}>
                          <span>ℹ️</span> About Bitcoin Writer
                        </div>
                        <div className="menu-separator" />
                        {isAuthenticated && (
                          <div className="menu-item" onClick={() => {
                            handleLogout();
                            setShowBitcoinMenu(false);
                          }}>
                            <span>🚪</span> Sign Out
                          </div>
                        )}
                      </div>
                    </>
                  )}
                </div>
                
                <div className="writer-menu-container">
                  <button 
                    className="writer-menu-button"
                    onClick={() => setShowWriterMenu(!showWriterMenu)}
                    aria-label="Writer Menu"
                  >
                    Bitcoin Writer
                  </button>
                  {showWriterMenu && (
                    <>
                      <div className="menu-overlay" onClick={() => setShowWriterMenu(false)} />
                      <div className="writer-menu">
                        <div className="menu-item" onClick={() => {
                          // TODO: Implement Open
                          alert('Open functionality coming soon');
                          setShowWriterMenu(false);
                        }}>
                          <span>📂</span> Open
                        </div>
                        <div className="menu-item" onClick={() => {
                          // TODO: Implement Save
                          (document.querySelector('.save-btn-mobile, [title*="Save"]') as HTMLElement)?.click();
                          setShowWriterMenu(false);
                        }}>
                          <span>💾</span> Save
                        </div>
                        <div className="menu-item" onClick={() => {
                          // TODO: Implement Save As
                          alert('Save As functionality coming soon');
                          setShowWriterMenu(false);
                        }}>
                          <span>📋</span> Save As
                        </div>
                        <div className="menu-separator" />
                        <div className="menu-item" onClick={() => {
                          // TODO: Implement Encrypt
                          (document.querySelector('[title*="Encrypt"]') as HTMLElement)?.click();
                          setShowWriterMenu(false);
                        }}>
                          <span>🔒</span> Encrypt
                        </div>
                        <div className="menu-item" onClick={() => {
                          // TODO: Implement Decrypt
                          (document.querySelector('[title*="Decrypt"]') as HTMLElement)?.click();
                          setShowWriterMenu(false);
                        }}>
                          <span>🔓</span> Decrypt
                        </div>
                        <div className="menu-separator" />
                        <div className="menu-item" onClick={() => {
                          // Dispatch event to open tokenize modal
                          window.dispatchEvent(new CustomEvent('openTokenizeModal'));
                          setShowWriterMenu(false);
                        }}>
                          <span>🎨</span> Tokenize
                        </div>
                        <div className="menu-item" onClick={() => {
                          // TODO: Implement Paywall
                          (document.querySelector('[title*="Set price"]') as HTMLElement)?.click();
                          setShowWriterMenu(false);
                        }}>
                          <span>💰</span> Paywall
                        </div>
                        <div className="menu-item" onClick={() => {
                          // TODO: Implement Publish
                          (document.querySelector('[title*="Publish"]') as HTMLElement)?.click();
                          setShowWriterMenu(false);
                        }}>
                          <span>🌍</span> Publish
                        </div>
                        <div className="menu-item" onClick={() => {
                          // Dispatch event to open Twitter modal
                          window.dispatchEvent(new CustomEvent('openTwitterModal'));
                          setShowWriterMenu(false);
                        }}>
                          <span>🐦</span> Post to Twitter
                        </div>
                      </div>
                    </>
                  )}
                </div>
                
                <div className="developers-menu-container">
                  <button 
                    className="developers-menu-button"
                    onClick={() => setShowDevelopersMenu(!showDevelopersMenu)}
                    aria-label="Developers Menu"
                  >
                    Developers
                  </button>
                  {showDevelopersMenu && (
                    <>
                      <div className="menu-overlay" onClick={() => setShowDevelopersMenu(false)} />
                      <div className="developers-menu">
                        <div className="menu-header">
                          <span>Developer Resources</span>
                        </div>
                        <div className="menu-separator" />
                        <div className="menu-item" onClick={() => {
                          window.open('/bitcoin-writer/bap', '_blank');
                          setShowDevelopersMenu(false);
                        }}>
                          <span>📑</span> BAP Executive Summary
                        </div>
                        <div className="menu-item" onClick={() => {
                          window.open('https://github.com/bitcoin-apps-suite/bitcoin-writer', '_blank');
                          setShowDevelopersMenu(false);
                        }}>
                          <span>📂</span> GitHub Repository
                        </div>
                        <div className="menu-item" onClick={() => {
                          window.open('https://docs.handcash.io', '_blank');
                          setShowDevelopersMenu(false);
                        }}>
                          <span>📚</span> HandCash API Docs
                        </div>
                        <div className="menu-separator" />
                        <div className="menu-item" onClick={() => {
                          window.open('https://github.com/bitcoin-apps-suite/blockchain-spreadsheet', '_blank');
                          setShowDevelopersMenu(false);
                        }}>
                          <span>📊</span> Blockchain Spreadsheet
                        </div>
                        <div className="menu-item" onClick={() => {
                          window.open('https://github.com/bitcoin-apps-suite/bitcoin-drive', '_blank');
                          setShowDevelopersMenu(false);
                        }}>
                          <span>💾</span> Bitcoin Drive
                        </div>
                        <div className="menu-separator" />
                        <div className="menu-item" onClick={() => {
                          alert('Bitcoin Writer API\n\nEndpoints:\n• POST /api/documents - Create document\n• GET /api/documents - List documents\n• GET /api/documents/:id - Get document\n• DELETE /api/documents/:id - Delete document\n\nBuilt on Bitcoin SV blockchain');
                          setShowDevelopersMenu(false);
                        }}>
                          <span>🔌</span> API Documentation
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </div>
              <div className="taskbar-center">
                {/* Window controls area */}
              </div>
              <div className="taskbar-right">
                <a 
                  href="https://x.com/bitcoin_writer" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="taskbar-link"
                  aria-label="Follow on X"
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                  </svg>
                </a>
              </div>
            </div>
            
            <header className="App-header">
              
              {/* Logo and title in center */}
              <div className="title-section">
                <div className="app-title-container">
                  <img 
                    src="/logo.svg" 
                    alt="Bitcoin Writer Logo" 
                    className="app-logo"
                    style={{
                      width: '32px',
                      height: '32px',
                      marginRight: '12px'
                    }}
                  />
                  <h1 
                    onClick={() => {
                      setShowFeatures(false);
                      setShowExchange(false);
                      setShowBitcoinApps(false);
                      setActiveAppOverview(null);
                    }}
                    style={{
                      cursor: 'pointer'
                    }}
                    title="Return to main view"
                  >
                    <span style={{color: '#ff9500'}}>Bitcoin</span> Writer
                  </h1>
                </div>
                <p className="app-subtitle">Encrypt, publish and sell shares in your work</p>
              </div>
              
              {/* Auth and mobile menu on the right */}
              <div className="header-right">
                <UnifiedAuth
                  googleUser={googleUser}
                  setGoogleUser={setGoogleUser}
                  isHandCashAuthenticated={isAuthenticated}
                  currentHandCashUser={currentUser}
                  handcashService={handcashService}
                  onHandCashLogin={() => handcashService.login()}
                  onHandCashLogout={handleLogout}
                />
                <button 
                  className="mobile-menu-toggle"
                  onClick={() => setShowMobileMenu(!showMobileMenu)}
                  aria-label="Toggle menu"
                >
                  <span className="hamburger-line"></span>
                  <span className="hamburger-line"></span>
                  <span className="hamburger-line"></span>
                </button>
              </div>

            </header>

            {/* Click overlay to close dropdowns */}
            {(showUserDropdown || showMobileMenu || showBitcoinMenu || showWriterMenu) && (
              <div 
                className="overlay" 
                onClick={() => {
                  setShowUserDropdown(false);
                  setShowMobileMenu(false);
                  setShowBitcoinMenu(false);
                  setShowWriterMenu(false);
                }}
                style={{
                  position: 'fixed',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  zIndex: showMobileMenu ? 999 : 100,
                  background: showMobileMenu ? 'rgba(0, 0, 0, 0.8)' : 'transparent'
                }}
              />
            )}

            {/* Mobile Menu Overlay */}
            {showMobileMenu && (
              <div className="mobile-menu-overlay">
                <div className="mobile-menu" onClick={(e) => e.stopPropagation()}>
                  <div className="mobile-menu-header">
                    <h3>Platform Features</h3>
                    <button 
                      className="close-mobile-menu"
                      onClick={() => setShowMobileMenu(false)}
                      aria-label="Close menu"
                    >
                      ×
                    </button>
                  </div>
                  
                  <div className="mobile-menu-content">
                    {isAuthenticated && (
                      <>
                        <div className="mobile-menu-section">
                          <h4>My Documents</h4>
                          <button 
                            className="mobile-menu-item"
                            onClick={() => {
                              setCurrentDocument(null);
                              setShowExchange(false);
                              setShowMobileMenu(false);
                            }}
                          >
                            📄 New Document
                          </button>
                          <DocumentSidebar
                            documentService={documentService}
                            isAuthenticated={isAuthenticated}
                            onDocumentSelect={(doc) => {
                              setCurrentDocument(doc);
                              setShowMobileMenu(false);
                            }}
                            onNewDocument={() => {
                              setCurrentDocument(null);
                              setShowExchange(false);
                              setShowMobileMenu(false);
                              // Trigger immediate sidebar refresh
                              setSidebarRefresh(prev => prev + 1);
                            }}
                            onPublishDocument={(doc) => {
                              // Add document to published list for the exchange
                              setPublishedDocuments(prev => {
                                // Check if already published
                                if (prev.some(d => d.id === doc.id)) {
                                  console.log('Document already published');
                                  return prev;
                                }
                                console.log('Publishing document to exchange:', doc);
                                return [...prev, doc];
                              });
                              setShowMobileMenu(false);
                            }}
                            currentDocumentId={currentDocument?.id}
                            isMobile={true}
                            refreshTrigger={sidebarRefresh}
                          />
                        </div>

                        <div className="mobile-menu-section">
                          <h4>Document Actions</h4>
                          <button className="mobile-menu-item">
                            💾 Save to Blockchain
                          </button>
                          <button className="mobile-menu-item">
                            🌍 Publish Document
                          </button>
                        </div>

                        <div className="mobile-menu-section">
                          <h4>Security & Monetization</h4>
                          <button className="mobile-menu-item">
                            🔒 Encrypt Document
                          </button>
                          <button className="mobile-menu-item">
                            💰 Set Price to Unlock
                          </button>
                          <button className="mobile-menu-item">
                            🎨 Create NFT
                          </button>
                          <button className="mobile-menu-item">
                            📈 Issue File Shares
                          </button>
                        </div>

                        <div className="mobile-menu-section">
                          <h4>Blockchain Storage</h4>
                          <button className="mobile-menu-item">
                            ⚡ OP_RETURN (Fast)
                          </button>
                          <button className="mobile-menu-item">
                            🔐 OP_PUSHDATA4 (Secure)
                          </button>
                          <button className="mobile-menu-item">
                            🧩 Multisig P2SH
                          </button>
                        </div>
                      </>
                    )}

                    <div className="mobile-menu-section">
                      <h4>Help & Info</h4>
                      <button className="mobile-menu-item">
                        ❓ How It Works
                      </button>
                      <button className="mobile-menu-item">
                        💡 Storage Options Guide
                      </button>
                      <button className="mobile-menu-item">
                        📊 Pricing Calculator
                      </button>
                    </div>

                    {!isAuthenticated && (
                      <div className="mobile-menu-section">
                        <button 
                          className="mobile-menu-login"
                          onClick={() => {
                            handcashService.login();
                            setShowMobileMenu(false);
                          }}
                        >
                          🔑 Sign in with HandCash
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
            <div className="app-container">
              <DocumentSidebar
                documentService={documentService}
                isAuthenticated={isAuthenticated}
                onDocumentSelect={(doc) => setCurrentDocument(doc)}
                onNewDocument={() => {
                  setCurrentDocument(null);
                  setShowExchange(false);
                  // Trigger immediate sidebar refresh
                  setSidebarRefresh(prev => prev + 1);
                }}
                onPublishDocument={(doc) => {
                  // Add document to published list for the exchange
                  setPublishedDocuments(prev => {
                    // Check if already published
                    if (prev.some(d => d.id === doc.id)) {
                      console.log('Document already published');
                      return prev;
                    }
                    console.log('Publishing document to exchange:', doc);
                    return [...prev, doc];
                  });
                }}
                currentDocumentId={currentDocument?.id}
                refreshTrigger={sidebarRefresh}
              />
              <main>
                {showFeatures ? (
                  <div className="features-view-wrapper">
                    <button 
                      className="features-close-btn"
                      onClick={() => setShowFeatures(false)}
                      title="Close Features"
                    >
                      ✕
                    </button>
                    <FeaturesPage />
                  </div>
                ) : showExchange ? (
                  <DocumentExchangeView 
                    onSelectDocument={(doc) => {
                      console.log('Selected document from exchange:', doc);
                      // Could open the document in an editor modal or side panel
                    }}
                    userDocuments={publishedDocuments} // Documents published from sidebar
                    onClose={() => setShowExchange(false)} // Return to editor view
                  />
                ) : showBitcoinApps ? (
                  <BitcoinAppsView 
                    isOpen={showBitcoinApps}
                    onClose={() => setShowBitcoinApps(false)}
                  />
                ) : activeAppOverview ? (
                  <BitcoinAppOverviews
                    activeApp={activeAppOverview}
                    onClose={() => setActiveAppOverview(null)}
                  />
                ) : (
                  <DocumentEditor 
                    documentService={documentService}
                    isAuthenticated={isAuthenticated}
                    currentDocument={currentDocument}
                    onDocumentUpdate={setCurrentDocument}
                    onDocumentSaved={() => {
                      // Trigger sidebar refresh after document is saved
                      setSidebarRefresh(prev => prev + 1);
                    }}
                    showAIChat={showAIChat}
                    onToggleAIChat={() => setShowAIChat(!showAIChat)}
                  />
                )}
              </main>
            </div>
          </div>
        )}
      />
      </Routes>
    </GoogleAuthProvider>
    </>
  );
}

export default App;