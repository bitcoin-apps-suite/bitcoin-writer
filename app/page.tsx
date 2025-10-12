'use client'

// Open BSV License version 5
// Copyright © 2025 The Bitcoin Corporation LTD
// Registered in England and Wales • Company No. 16735102
// This software can only be used on BSV blockchains

import React, { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';

const DocumentEditor = dynamic(() => import('../src/components/DocumentEditor'), { 
  ssr: false,
  loading: () => <div>Loading editor...</div>
});
import DocumentSidebar from '../components/DocumentSidebar';
import { BlockchainDocumentService, BlockchainDocument } from '../lib/BlockchainDocumentService';
import { HandCashService, HandCashUser } from '../lib/HandCashService';
import { GoogleAuthProvider } from '../components/GoogleAuth';
import UnifiedAuth from '../components/UnifiedAuth';
import CleanTaskbar from '../components/CleanTaskbar';
import Footer from '../components/Footer';
import ProofOfConceptBanner from '../components/ProofOfConceptBanner';
import DevSidebar from '../components/DevSidebar';
import DocumentExchangeView from '../components/DocumentExchangeView';
import BitcoinAppsView from '../components/BitcoinAppsView';
import BitcoinAppOverviews from '../components/BitcoinAppOverviews';
import { BitcoinAppEvents } from '../utils/appEvents';
import { cleanupEmptyDocuments } from '../utils/cleanupDocuments';
import { useBitcoinOS } from '../utils/useBitcoinOS';
import ServiceWorkerRegistration from '../components/ServiceWorkerRegistration';
import LoadingDoor from '../components/LoadingDoor';
import Dock from '../components/Dock';
import './globals.css';

export default function Home() {
  const [documentService, setDocumentService] = useState<BlockchainDocumentService | null>(null);
  const [handcashService] = useState<HandCashService>(new HandCashService());
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const { isInOS, setTitle } = useBitcoinOS();
  const [currentUser, setCurrentUser] = useState<HandCashUser | null>(null);
  const [googleUser, setGoogleUser] = useState<any>(null);
  const [showAIChat, setShowAIChat] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [showLoadingDoor, setShowLoadingDoor] = useState(false);
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
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('devSidebarCollapsed');
      return saved === 'true';
    }
    return false;
  });
  const [isMobile, setIsMobile] = useState(false);

  // Handle window resize
  useEffect(() => {
    if (typeof window !== 'undefined') {
      setIsMobile(window.innerWidth <= 768);
      const handleResize = () => {
        setIsMobile(window.innerWidth <= 768);
      };
      window.addEventListener('resize', handleResize);
      return () => window.removeEventListener('resize', handleResize);
    }
  }, []);

  // Handle loading door logic on client side only
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const hasShownDoor = sessionStorage.getItem('hasShownLoadingDoor');
      if (!hasShownDoor) {
        setShowLoadingDoor(true);
      }
    }
  }, []);

  // Set app title when running in Bitcoin OS
  useEffect(() => {
    if (isInOS) {
      setTitle('Bitcoin Writer');
    }
  }, [isInOS, setTitle]);

  // Initialize authentication and services
  useEffect(() => {
    const initializeApp = async () => {
      // Check for Google user first
      if (typeof window !== 'undefined') {
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

        // Check existing authentication
        if (handcashService.isAuthenticated()) {
          const user = handcashService.getCurrentUser();
          setCurrentUser(user);
          setIsAuthenticated(true);
          await initializeDocumentService();
        }
        setIsLoading(false);

        // Clean up empty documents
        const deletedCount = cleanupEmptyDocuments();
        if (deletedCount > 0) {
          console.log(`Cleaned up ${deletedCount} empty/test documents`);
          setSidebarRefresh(prev => prev + 1);
        }
      }
    };

    initializeApp();
  }, [handcashService]);

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
    
    handcashService.logout();
    
    if (typeof window !== 'undefined') {
      localStorage.clear();
      sessionStorage.clear();
      
      // Clear all cookies
      document.cookie.split(";").forEach(function(c) { 
        document.cookie = c.replace(/^ +/, "").replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/"); 
      });
    }
    
    setIsAuthenticated(false);
    setCurrentUser(null);
    setDocumentService(null);
    setCurrentDocument(null);
    
    console.log('Logout complete - refreshing page...');
    
    if (typeof window !== 'undefined') {
      setTimeout(() => {
        window.location.replace('/');
      }, 100);
    }
  };

  return (
    <>
      <ServiceWorkerRegistration />
      {/* Loading Door Animation - Only on first visit */}
      {showLoadingDoor && (
        <LoadingDoor onComplete={() => {
          setShowLoadingDoor(false);
          if (typeof window !== 'undefined') {
            sessionStorage.setItem('hasShownLoadingDoor', 'true');
          }
        }} />
      )}
      {/* Proof of Concept Banner - positioned at the very top */}
      {!isInOS && <ProofOfConceptBanner />}
      
      <GoogleAuthProvider>
        {/* Global elements that appear on all pages */}
        {!isLoading && (
          <>
            {/* Developer Sidebar - Desktop Only */}
            {!isMobile && !isInOS && <DevSidebar onCollapsedChange={setDevSidebarCollapsed} />}
            
            {/* Clean taskbar with proper spacing */}
            {!isInOS && <CleanTaskbar
              isAuthenticated={isAuthenticated}
              currentUser={currentUser}
              onLogout={handleLogout}
              onNewDocument={() => {
                setCurrentDocument(null);
                setShowExchange(false);
              }}
              onSaveDocument={() => {
                if (typeof document !== 'undefined') {
                  const saveBtn = document.querySelector('.save-btn-mobile, [title*="Save"]') as HTMLElement;
                  saveBtn?.click();
                }
              }}
              onOpenTokenizeModal={() => {
                if (typeof window !== 'undefined') {
                  window.dispatchEvent(new CustomEvent('openTokenizeModal'));
                }
              }}
              onOpenTwitterModal={() => {
                if (typeof window !== 'undefined') {
                  window.dispatchEvent(new CustomEvent('openTwitterModal'));
                }
              }}
              documentService={documentService}
              onToggleAIChat={() => setShowAIChat(!showAIChat)}
            />}
          </>
        )}

        {isLoading ? (
          <div className="App">
            <div className="loading">Loading Bitcoin Writer...</div>
          </div>
        ) : (
          <div className="App">
            
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

            <div className={`app-container ${isInOS ? '' : (!isMobile && devSidebarCollapsed ? 'with-dev-sidebar-collapsed' : '')} ${isInOS ? '' : (!isMobile && !devSidebarCollapsed ? 'with-dev-sidebar' : '')}`}>
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
                  <div>Features Page</div>
                ) : showExchange ? (
                  <DocumentExchangeView 
                    onSelectDocument={(doc) => {
                      console.log('Selected document from exchange:', doc);
                    }}
                    userDocuments={publishedDocuments}
                    onClose={() => setShowExchange(false)}
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
                      setSidebarRefresh(prev => prev + 1);
                    }}
                    showAIChat={showAIChat}
                    onToggleAIChat={() => setShowAIChat(!showAIChat)}
                  />
                )}
              </main>
            </div>
            <Footer />
            {/* Bitcoin OS Dock - Only show when not running in Bitcoin OS */}
            {!isInOS && <Dock />}
          </div>
        )}
      </GoogleAuthProvider>
    </>
  );
}