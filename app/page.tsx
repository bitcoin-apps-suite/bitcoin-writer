'use client';

import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { BlockchainDocumentService, BlockchainDocument } from '../services/BlockchainDocumentService';
import { HandCashService } from '../services/HandCashService';

// Dynamic imports for client-side components
const DocumentEditor = dynamic(() => import('../components/DocumentEditor'), { ssr: false });
const DocumentSidebar = dynamic(() => import('../components/DocumentSidebar'), { ssr: false });

export default function Home() {
  const [documentService, setDocumentService] = useState<BlockchainDocumentService | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentDocument, setCurrentDocument] = useState<BlockchainDocument | null>(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [showMobileSidebar, setShowMobileSidebar] = useState(false);

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
      {/* App Header */}
      <div className="app-header">
        <h1>
          <span style={{ fontSize: '36px' }}>✏️</span>
          Bitcoin Writer
        </h1>
        <p className="tagline">Encrypt, publish and sell shares in your work</p>
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
      <div className={`sidebar-container ${showMobileSidebar ? 'mobile-visible' : ''}`}>
        <DocumentSidebar
          documentService={documentService}
          isAuthenticated={isAuthenticated}
          onDocumentSelect={handleDocumentSelect}
          onNewDocument={handleNewDocument}
          onPublishDocument={handlePublishDocument}
          currentDocumentId={currentDocument?.id}
          refreshTrigger={refreshTrigger}
        />
      </div>

      {/* Document Editor */}
      <div className="editor-container">
        <DocumentEditor
          documentService={documentService}
          isAuthenticated={isAuthenticated}
          currentDocument={currentDocument}
          onDocumentUpdate={setCurrentDocument}
          onDocumentSaved={handleDocumentSaved}
        />
      </div>
      </div>
    </>
  );
}