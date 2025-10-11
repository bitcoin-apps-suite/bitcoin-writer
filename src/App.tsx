// Open BSV License version 5
// Copyright © 2025 The Bitcoin Corporation LTD
// Registered in England and Wales • Company No. 16735102
// This software can only be used on BSV blockchains

import { useState, useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import './App.css';
import FeaturesPage from './pages/FeaturesPage';
import TokenPage from './pages/TokenPage';
import BWriterContributionsPage from './pages/BWriterContributionsPage';
import DocsPage from './pages/DocsPage';
import TasksPage from './pages/TasksPage';
import ContractsPage from './pages/ContractsPage';
import PlatformPage from './pages/PlatformPage';
import SignupPage from './pages/SignupPage';
import CommissionsPage from './pages/CommissionsPage';
import OfferPage from './pages/OfferPage';
import OffersPage from './pages/OffersPage';
import GrantsPage from './pages/GrantsPage';
import ApiPage from './pages/ApiPage';
import ChangelogPage from './pages/ChangelogPage';
import StatusPage from './pages/StatusPage';
import DeveloperContractsPage from './pages/DeveloperContractsPage';
import PublisherOfferPage from './pages/PublisherOfferPage';
import AuthorOffersPage from './pages/AuthorOffersPage';
import DevelopersGrantsPage from './pages/DevelopersGrantsPage';
import AuthorsGrantsPage from './pages/AuthorsGrantsPage';
import PublishersGrantsPage from './pages/PublishersGrantsPage';
import ImportPage from './pages/ImportPage';
import EncryptPage from './pages/EncryptPage';
import TermsPage from './pages/TermsPage';
import PrivacyPage from './pages/PrivacyPage';
import ContactPage from './pages/ContactPage';
import MarketPage from './pages/MarketPage';
import MarketBodyPage from './pages/MarketBodyPage';
import ArticlePage from './pages/ArticlePage';
import AuthorsPage from './pages/AuthorsPage';
import AuthorPage from './pages/AuthorPage';
import IdeasPage from './pages/IdeasPage';
import AuthorCardFixPage from './pages/AuthorCardFixPage';
import NotFoundPage from './pages/NotFoundPage';
import MockupArticlePage from './pages/MockupArticlePage';
import FutureOfDesktopPublishingArticle from './pages/FutureOfDesktopPublishingArticle';
import DocumentEditor from './components/DocumentEditor';
import DocumentSidebar from './components/DocumentSidebar';
import HandCashCallback from './components/HandCashCallback';
import BapPage from './pages/BapPage';
import MAIPPage from './pages/MAIPPage';
import { BlockchainDocumentService, BlockchainDocument } from './services/BlockchainDocumentService';
import { HandCashService, HandCashUser } from './services/HandCashService';
import { GoogleAuthProvider } from './components/GoogleAuth';
import UnifiedAuth from './components/UnifiedAuth';
import CleanTaskbar from './components/CleanTaskbar';
import Footer from './components/Footer';
import ProofOfConceptBanner from './components/ProofOfConceptBanner';
import DevSidebar from './components/DevSidebar';
import DocumentExchangeView from './components/DocumentExchangeView';
import ExchangeStandalonePage from './pages/ExchangeStandalonePage';
import BitcoinAppsView from './components/BitcoinAppsView';
import TickerSidebar from './components/TickerSidebar';
import BitcoinAppOverviews from './components/BitcoinAppOverviews';
import { BitcoinAppEvents } from './utils/appEvents';
import { cleanupEmptyDocuments } from './utils/cleanupDocuments';
import { useBitcoinOS } from './utils/useBitcoinOS';
import JobsQueuePage from './pages/JobsQueuePage';
import BWriterProPage from './pages/BWriterProPage';
import AuthorArticleService from './services/AuthorArticleService';
import ServiceWorkerRegistration from './components/ServiceWorkerRegistration';
import LoadingDoor from './components/LoadingDoor';
// import { BitcoinDock, defaultBitcoinApps } from 'bitcoin-os-dock';
import MinimalDock from './components/MinimalDock';
import SubscriptionModal from './components/SubscriptionModal';
import TopUpModal from './components/TopUpModal';



function App() {
  const [documentService, setDocumentService] = useState<BlockchainDocumentService | null>(null);
  const [handcashService] = useState<HandCashService>(new HandCashService());
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const { isInOS, setTitle } = useBitcoinOS();
  const [currentUser, setCurrentUser] = useState<HandCashUser | null>(null);
  const [googleUser, setGoogleUser] = useState<any>(null);
  const [showAIChat, setShowAIChat] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [authorArticleService] = useState(() => new AuthorArticleService());
  const [showLoadingDoor, setShowLoadingDoor] = useState(() => {
    // Don't show loading door if this is an auth callback or if already shown
    const hasShownDoor = sessionStorage.getItem('hasShownLoadingDoor') || 
                        localStorage.getItem('hasShownLoadingDoor');
    const isAuthCallback = window.location.pathname.includes('/auth/') || 
                          window.location.search.includes('authToken') ||
                          window.location.search.includes('code=');
    return !hasShownDoor && !isAuthCallback;
  });
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
  const [devSidebarCollapsed, setDevSidebarCollapsed] = useState(() => {
    const saved = localStorage.getItem('devSidebarCollapsed');
    return saved === 'true';
  });
  const [marketSidebarCollapsed, setMarketSidebarCollapsed] = useState(() => {
    const saved = localStorage.getItem('marketSidebarCollapsed');
    return saved === 'true';
  });
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [showSubscriptionModal, setShowSubscriptionModal] = useState(false);
  const [showTopUpModal, setShowTopUpModal] = useState(false);

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Handle dev sidebar body classes for layout adjustments
  useEffect(() => {
    if (!isMobile && !isInOS) {
      if (devSidebarCollapsed) {
        document.body.classList.add('dev-sidebar-collapsed');
        document.body.classList.remove('dev-sidebar-expanded');
      } else {
        document.body.classList.add('dev-sidebar-expanded');
        document.body.classList.remove('dev-sidebar-collapsed');
      }
    } else {
      // Remove both classes on mobile/OS
      document.body.classList.remove('dev-sidebar-collapsed', 'dev-sidebar-expanded');
    }
    
    return () => {
      document.body.classList.remove('dev-sidebar-collapsed', 'dev-sidebar-expanded');
    };
  }, [devSidebarCollapsed, isMobile, isInOS]);

  // Handle market sidebar body classes for layout adjustments
  useEffect(() => {
    if (!isMobile) {
      if (marketSidebarCollapsed) {
        document.body.classList.add('market-sidebar-collapsed');
        document.body.classList.remove('market-sidebar-expanded');
      } else {
        document.body.classList.add('market-sidebar-expanded');
        document.body.classList.remove('market-sidebar-collapsed');
      }
    } else {
      // Remove both classes on mobile
      document.body.classList.remove('market-sidebar-collapsed', 'market-sidebar-expanded');
    }
    
    return () => {
      document.body.classList.remove('market-sidebar-collapsed', 'market-sidebar-expanded');
    };
  }, [marketSidebarCollapsed, isMobile]);

  // Listen for subscription modal event
  useEffect(() => {
    const handleOpenSubscriptionModal = () => {
      setShowSubscriptionModal(true);
    };
    window.addEventListener('openSubscriptionModal', handleOpenSubscriptionModal);
    
    return () => {
      window.removeEventListener('openSubscriptionModal', handleOpenSubscriptionModal);
    };
  }, []);

  // Listen for top-up modal event
  useEffect(() => {
    const handleOpenTopUpModal = () => {
      setShowTopUpModal(true);
    };
    window.addEventListener('openTopUpModal', handleOpenTopUpModal);
    
    return () => {
      window.removeEventListener('openTopUpModal', handleOpenTopUpModal);
    };
  }, []);

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

  // Set app title when running in Bitcoin OS
  useEffect(() => {
    if (isInOS) {
      setTitle('Bitcoin Writer');
    }
  }, [isInOS, setTitle]);

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

  

  const location = useLocation();

  const EditorPage = () => {
    if (showFeatures) {
        return (
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
        );
    }

    if (showExchange) {
        return (
            <DocumentExchangeView 
                onSelectDocument={(doc) => {
                    console.log('Selected document from exchange:', doc);
                }}
                userDocuments={publishedDocuments}
                onClose={() => setShowExchange(false)}
            />
        );
    }

    if (showBitcoinApps) {
        return (
            <BitcoinAppsView 
                isOpen={showBitcoinApps}
                onClose={() => setShowBitcoinApps(false)}
            />
        );
    }

    if (activeAppOverview) {
        return (
            <BitcoinAppOverviews
                activeApp={activeAppOverview}
                onClose={() => setActiveAppOverview(null)}
            />
        );
    }

    return (
        <DocumentEditor 
            documentService={documentService}
            isAuthenticated={isAuthenticated}
            currentDocument={currentDocument}
            onDocumentUpdate={setCurrentDocument}
            onDocumentSaved={() => {
                setSidebarRefresh(prev => prev + 1);
            }}
            showAIChat={showAIChat}
            onToggleAIChat={() => setShowAIChat(!showAIChat)}
        />
    );
  };

  return (
    <>
      <ServiceWorkerRegistration />
      {/* Loading Door Animation - Only on first visit */}
      {showLoadingDoor && (
        <LoadingDoor onComplete={() => {
          setShowLoadingDoor(false);
          sessionStorage.setItem('hasShownLoadingDoor', 'true');
          localStorage.setItem('hasShownLoadingDoor', 'true');
        }} />
      )}
      {/* Proof of Concept Banner - positioned at the very top */}
      {!isInOS && <ProofOfConceptBanner />}
      
      <GoogleAuthProvider>
        {/* Global elements that appear on all pages */}
        {!isLoading && !isInOS && <CleanTaskbar
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
            isMarketSidebarCollapsed={marketSidebarCollapsed}
        />}
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
                      marginRight: '16px',
                      marginTop: '4px',
                      verticalAlign: 'baseline'
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
                      cursor: 'pointer',
                      paddingTop: '10px',
                      marginLeft: '-12px'
                    }}
                    title="Return to main view"
                  >
                    <span style={{color: '#ff9500'}}>Bitcoin</span> Writer{location.pathname === '/market' && ' Market'}
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
                          setSidebarRefresh(prev => prev + 1);
                        }}
                        onPublishDocument={(doc) => {
                          setPublishedDocuments(prev => {
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
                        🎨 Save as Bitcoin OS Asset
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
            {!isMobile && !isInOS && <DevSidebar onCollapsedChange={setDevSidebarCollapsed} />}
            {location.pathname === '/' && (
                <DocumentSidebar
                    documentService={documentService}
                    isAuthenticated={isAuthenticated}
                    onDocumentSelect={(doc) => setCurrentDocument(doc)}
                    onNewDocument={() => {
                        setCurrentDocument(null);
                        setShowExchange(false);
                        setSidebarRefresh(prev => prev + 1);
                    }}
                    onPublishDocument={(doc) => {
                        setPublishedDocuments(prev => {
                        if (prev.some(d => d.id === doc.id)) {
                            return prev;
                        }
                        return [...prev, doc];
                        });
                    }}
                    currentDocumentId={currentDocument?.id}
                    refreshTrigger={sidebarRefresh}
                />
            )}
            <main>
                <Routes>
                    <Route path="/auth/handcash/callback" element={<HandCashCallback />} />
                    <Route path="/bitcoin-writer/bap" element={<BapPage />} />
                    <Route path="/features" element={<FeaturesPage />} />
                    <Route path="/jobs-queue" element={<JobsQueuePage />} />
                    <Route path="/bwriter-pro" element={<BWriterProPage />} />
                    <Route path="/token" element={<TokenPage />} />
                    <Route path="/tasks" element={<TasksPage />} />
                    <Route path="/contracts" element={<ContractsPage />} />
                    <Route path="/import" element={<ImportPage />} />
                    <Route path="/encrypt" element={<EncryptPage />} />
                    <Route path="/terms" element={<TermsPage />} />
                    <Route path="/privacy" element={<PrivacyPage />} />
                    <Route path="/contact" element={<ContactPage />} />
                    <Route path="/exchange" element={<ExchangeStandalonePage />} />
                    
                    {/* Developer Routes - Symmetrical */}
                    <Route path="/developer/offer" element={<OfferPage />} />
                    <Route path="/developer/offers" element={<DeveloperContractsPage />} />
                    
                    {/* Author Routes - Symmetrical */}
                    <Route path="/author/offer" element={<OfferPage />} />
                    <Route path="/author/offers" element={<AuthorOffersPage />} />
                    
                    {/* Publisher Routes - Symmetrical */}
                    <Route path="/publisher/offer" element={<PublisherOfferPage />} />
                    <Route path="/publisher/offers" element={<OffersPage />} />
                    
                    {/* Grants Routes */}
                    <Route path="/developers/grants" element={<DevelopersGrantsPage />} />
                    <Route path="/authors/grants" element={<AuthorsGrantsPage />} />
                    <Route path="/publishers/grants" element={<PublishersGrantsPage />} />
                    
                    {/* Other Routes */}
                    <Route path="/contributions" element={<BWriterContributionsPage />} />
                    <Route path="/docs" element={<DocsPage />} />
                    <Route path="/enterprise" element={<CommissionsPage />} />
                    <Route path="/grants" element={<GrantsPage />} />
                    <Route path="/maip" element={<MAIPPage />} />
                    <Route path="/api" element={<ApiPage />} />
                    <Route path="/changelog" element={<ChangelogPage />} />
                    <Route path="/status" element={<StatusPage />} />
                    <Route path="/platform" element={<PlatformPage />} />
                    <Route path="/signup" element={<SignupPage />} />

                    <Route path="/market" element={<MarketPage />} />
                    <Route path="/market/body" element={<MarketBodyPage />} />
                    <Route path="/market/article/:slug" element={<MockupArticlePage />} />
                    <Route path="/ideas" element={<IdeasPage />} />
                    <Route path="/authors" element={
                      <AuthorsPage 
                        currentUser={currentUser ? {
                          handle: currentUser.handle,
                          displayName: currentUser.displayName || currentUser.handle,
                          avatarUrl: currentUser.avatarUrl || '',
                          articles: authorArticleService.getPublishedArticles(currentUser.handle)
                        } : undefined}
                        isAuthenticated={isAuthenticated}
                      />
                    } />
                    <Route path="/authors/:authorId" element={<AuthorPage />} />
                    <Route path="/authors/:authorId/card-fix" element={<AuthorCardFixPage />} />

                    {/* Catch-all route for 404 - should be last */}
                    <Route path="/404" element={<NotFoundPage />} />
                    <Route path="/*" element={<EditorPage />} />
                </Routes>
            </main>
            {!isMobile && (
                <TickerSidebar 
                    userHandle={currentUser?.handle}
                    currentJobToken={undefined}
                    onCollapsedChange={setMarketSidebarCollapsed}
                />
            )}
        </div>
        <Footer />
        <MinimalDock />
    </GoogleAuthProvider>

    {/* Payment Modals */}
    {isAuthenticated && currentUser && (
      <>
        <SubscriptionModal
          isOpen={showSubscriptionModal}
          onClose={() => setShowSubscriptionModal(false)}
          userEmail={currentUser.paymail}
          handcashHandle={currentUser.handle}
        />
        <TopUpModal
          isOpen={showTopUpModal}
          onClose={() => setShowTopUpModal(false)}
          userEmail={currentUser.paymail}
          handcashHandle={currentUser.handle}
        />
      </>
    )}
    </>
  );
}

export default App;