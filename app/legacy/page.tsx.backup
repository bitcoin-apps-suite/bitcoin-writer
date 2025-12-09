/**
 * Bitcoin Writer - A blockchain-based writing application
 * Copyright (C) 2025 The Bitcoin Corporation LTD
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as published
 * by the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program. If not, see <https://www.gnu.org/licenses/>.
 *
 * For commercial licensing options, please contact The Bitcoin Corporation LTD.
 */

'use client';

import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { BlockchainDocumentService, BlockchainDocument } from '../services/BlockchainDocumentService';
import { HandCashService } from '../services/HandCashService';
import LoadingDoor from '../components/LoadingDoor';

// Dynamic imports for client-side components
const DocumentSidebar = dynamic(() => import('../components/editor/DocumentSidebar'), { 
  ssr: false,
  loading: () => <div className="sidebar-skeleton" />
});
const TickerSidebar = dynamic(() => import('../components/ui/TickerSidebar'), { 
  ssr: false
});

export default function Home() {
  const [documentService, setDocumentService] = useState<BlockchainDocumentService | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentDocument, setCurrentDocument] = useState<BlockchainDocument | null>(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [showMobileSidebar, setShowMobileSidebar] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(true); // Start collapsed
  const [tickerSidebarCollapsed, setTickerSidebarCollapsed] = useState(true); // Start collapsed
  const [isLoading, setIsLoading] = useState(true);
  const [isMobile, setIsMobile] = useState(false);

  // Check if mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    // Initialize services
    const handcashService = new HandCashService();
    if (handcashService.isAuthenticated()) {
      setIsAuthenticated(true);
      const docService = new BlockchainDocumentService(handcashService);
      setDocumentService(docService);
    }
  }, []);

  const handleNewDocument = () => {
    setCurrentDocument(null);
    setShowMobileSidebar(false);
  };

  const handleDocumentSelect = (doc: BlockchainDocument) => {
    setCurrentDocument(doc);
    setShowMobileSidebar(false);
  };

  const handleDocumentSaved = () => {
    setRefreshTrigger(prev => prev + 1);
  };

  const handlePublishDocument = (doc: BlockchainDocument) => {
    console.log('Publishing document:', doc);
    // Implement publishing logic here
  };

  return (
    <>
      {/* Loading Door Animation - overlays content */}
      {isLoading && <LoadingDoor onComplete={() => setIsLoading(false)} />}
      
      {/* Main app content - visible immediately, revealed by sliding door */}
      <div className="app-wrapper">
        {/* App Header */}
        <div className="app-header">
          <div className="header-content">
            <div className="header-logo">
              <div className="logo-icon">
                <svg width="32" height="32" viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <rect width="200" height="200" rx="40" fill="url(#gradient)"/>
                  <path d="M50 150 Q80 40 150 50 Q120 80 100 120 L90 130 Q70 140 50 150 Z" fill="#2D3748" stroke="#2D3748" strokeWidth="2"/>
                  <path d="M70 100 Q90 80 110 90" stroke="#2D3748" strokeWidth="1.5" fill="none"/>
                  <path d="M80 120 Q95 105 115 110" stroke="#2D3748" strokeWidth="1.5" fill="none"/>
                  <defs>
                    <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" style={{stopColor:"#FF8C00", stopOpacity:1}} />
                      <stop offset="100%" style={{stopColor:"#FF6B35", stopOpacity:1}} />
                    </linearGradient>
                  </defs>
                </svg>
              </div>
              <span className="logo-text">Bitcoin</span>
              <span className="logo-writer">Writer</span>
            </div>
            <p className="header-tagline">Encrypt, publish and sell shares in your work</p>
            <a 
              href="/editor" 
              className="launch-editor-btn"
              style={{
                marginLeft: 'auto',
                padding: '10px 20px',
                background: 'linear-gradient(135deg, #FF8C00, #FF6B35)',
                color: 'white',
                borderRadius: '8px',
                textDecoration: 'none',
                fontWeight: 'bold',
                fontSize: '14px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                transition: 'transform 0.2s, box-shadow 0.2s',
                boxShadow: '0 2px 8px rgba(255,140,0,0.3)'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 4px 12px rgba(255,140,0,0.4)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 2px 8px rgba(255,140,0,0.3)';
              }}
            >
              <span>✨</span> Launch Standalone Editor
            </a>
          </div>
        </div>
        
        <div className="main-container">
          {/* Mobile Sidebar Toggle */}
          <button 
            className="mobile-sidebar-toggle"
            onClick={() => setShowMobileSidebar(!showMobileSidebar)}
            aria-label="Toggle sidebar"
          >
            ☰
          </button>

          {/* Mobile Sidebar Overlay */}
          {showMobileSidebar && (
            <div 
              className="mobile-sidebar-overlay"
              onClick={() => setShowMobileSidebar(false)}
            />
          )}

          {/* Document Sidebar */}
          <div className={`sidebar-container ${showMobileSidebar ? 'mobile-visible' : ''} ${sidebarCollapsed ? 'collapsed' : ''}`}>
            <DocumentSidebar
              documentService={documentService}
              isAuthenticated={isAuthenticated}
              onDocumentSelect={handleDocumentSelect}
              onNewDocument={handleNewDocument}
              onPublishDocument={handlePublishDocument}
              currentDocumentId={currentDocument?.id}
              refreshTrigger={refreshTrigger}
              onCollapsedChange={setSidebarCollapsed}
            />
          </div>

          {/* Document Editor - Using our standalone browser version */}
          <div className="editor-container">
            <iframe 
              src="/editor-standalone.html"
              style={{ 
                width: '100%', 
                height: '100%', 
                border: 'none',
                margin: 0,
                padding: 0,
                backgroundColor: '#1b1b1b'
              }}
              title="Bitcoin Writer Editor"
            />
          </div>

          {/* Ticker Sidebar (desktop only) */}
          {!isMobile && (
            <div className={`ticker-container ${tickerSidebarCollapsed ? 'collapsed' : ''}`}>
              <TickerSidebar 
                isEditorMode={true}
                compactMode={false}
                onCollapsedChange={setTickerSidebarCollapsed}
              />
            </div>
          )}
        </div>
      </div>
    </>
  );
}