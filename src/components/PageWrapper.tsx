import React from 'react';
import DevSidebar from './DevSidebar';
import TickerSidebar from './TickerSidebar';
import DocumentSidebar from './DocumentSidebar';
import { HandCashUser } from '../services/HandCashService';
import { BlockchainDocumentService, BlockchainDocument } from '../services/BlockchainDocumentService';

interface PageWrapperProps {
  children: React.ReactNode;
  isMobile: boolean;
  isInOS: boolean;
  setDevSidebarCollapsed: (collapsed: boolean) => void;
  setMarketSidebarCollapsed: (collapsed: boolean) => void;
  currentUser: HandCashUser | null;
  showDocumentSidebar: boolean;
  documentService?: BlockchainDocumentService | null;
  isAuthenticated: boolean;
  currentDocument?: BlockchainDocument | null;
  setCurrentDocument?: (doc: BlockchainDocument | null) => void;
  sidebarRefresh?: number;
  setSidebarRefresh?: (refresh: number | ((prev: number) => number)) => void;
  setShowExchange?: (show: boolean) => void;
  setPublishedDocuments?: (documents: BlockchainDocument[] | ((prev: BlockchainDocument[]) => BlockchainDocument[])) => void;
}

const PageWrapper: React.FC<PageWrapperProps> = ({
  children,
  isMobile,
  isInOS,
  setDevSidebarCollapsed,
  setMarketSidebarCollapsed,
  currentUser,
  showDocumentSidebar,
  documentService,
  isAuthenticated,
  currentDocument,
  setCurrentDocument,
  sidebarRefresh,
  setSidebarRefresh,
  setShowExchange,
  setPublishedDocuments,
}) => {
  return (
    <div className="app-container">
      {!isMobile && !isInOS && <DevSidebar onCollapsedChange={setDevSidebarCollapsed} />}
      {showDocumentSidebar && documentService && setCurrentDocument && setSidebarRefresh && setShowExchange && setPublishedDocuments && (
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
      <main>{children}</main>
      {!isMobile && (
        <TickerSidebar 
          userHandle={currentUser?.handle}
          currentJobToken={undefined}
          onCollapsedChange={setMarketSidebarCollapsed}
        />
      )}
    </div>
  );
};

export default PageWrapper;
