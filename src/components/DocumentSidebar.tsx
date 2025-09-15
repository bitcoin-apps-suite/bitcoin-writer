import React, { useState, useEffect, useCallback } from 'react';
import { BlockchainDocumentService, BlockchainDocument } from '../services/BlockchainDocumentService';
import { formatUSD } from '../utils/pricingCalculator';
import { LocalDocumentStorage } from '../utils/documentStorage';

interface DocumentSidebarProps {
  documentService: BlockchainDocumentService | null;
  isAuthenticated: boolean;
  onDocumentSelect: (doc: BlockchainDocument) => void;
  onNewDocument: () => void;
  currentDocumentId?: string;
  isMobile?: boolean;
  refreshTrigger?: number;
}

const DocumentSidebar: React.FC<DocumentSidebarProps> = ({
  documentService,
  isAuthenticated,
  onDocumentSelect,
  onNewDocument,
  currentDocumentId,
  isMobile = false,
  refreshTrigger
}) => {
  const [documents, setDocuments] = useState<BlockchainDocument[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [sidebarWidth, setSidebarWidth] = useState(280);
  const [isResizing, setIsResizing] = useState(false);

  const loadDocuments = useCallback(async () => {
    setIsLoading(true);
    try {
      let allDocs: BlockchainDocument[] = [];
      
      // Load local documents (for both authenticated and guest users)
      const localDocs = LocalDocumentStorage.getAllDocuments();
      const localDocsAsBlockchain: BlockchainDocument[] = localDocs.map(doc => ({
        id: doc.id,
        title: doc.title,
        content: doc.content,
        preview: doc.content ? 
          (typeof doc.content === 'string' ? 
            doc.content.replace(/<[^>]*>/g, '').substring(0, 100) : 
            '') + '...' : '',
        created_at: doc.created_at,
        updated_at: doc.updated_at,
        author: 'Local',
        word_count: doc.word_count,
        character_count: doc.character_count,
        encrypted: false,
        storage_method: doc.is_hashed ? 'hashed' : 'local',
        blockchain_tx: doc.hash_tx
      }));
      
      allDocs = [...localDocsAsBlockchain];
      
      // If authenticated, also load blockchain documents
      if (documentService && isAuthenticated) {
        try {
          const blockchainDocs = await documentService.getDocuments();
          // Filter out any blockchain docs that might duplicate local docs
          const uniqueBlockchainDocs = blockchainDocs.filter(
            bDoc => !localDocs.some(lDoc => lDoc.id === bDoc.id)
          );
          allDocs = [...allDocs, ...uniqueBlockchainDocs];
        } catch (error) {
          console.error('Failed to load blockchain documents:', error);
        }
      }
      
      // Sort all documents by updated date
      const sortedDocs = allDocs.sort((a, b) => {
        return new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime();
      });
      
      setDocuments(sortedDocs);
    } catch (error) {
      console.error('Failed to load documents:', error);
      setDocuments([]);
    } finally {
      setIsLoading(false);
    }
  }, [documentService, isAuthenticated]);

  useEffect(() => {
    // Load documents for both authenticated and guest users
    loadDocuments();
  }, [loadDocuments]);

  // Refresh documents when current document changes or refresh is triggered
  useEffect(() => {
    if (currentDocumentId || refreshTrigger) {
      loadDocuments();
    }
  }, [currentDocumentId, refreshTrigger, loadDocuments]);

  const handleDeleteDocument = async (docId: string, docTitle: string, e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent selecting the document
    
    // First click - show confirmation state
    if (deleteConfirmId !== docId) {
      setDeleteConfirmId(docId);
      // Reset confirmation after 3 seconds
      setTimeout(() => {
        setDeleteConfirmId(null);
      }, 3000);
      return;
    }
    
    // Second click - perform deletion
    setDeleteConfirmId(null);
    
    try {
      // Check if it's a local document or blockchain document
      const doc = documents.find(d => d.id === docId);
      if (doc?.storage_method === 'local' || doc?.storage_method === 'hashed') {
        // Delete from local storage
        LocalDocumentStorage.deleteDocument(docId);
      } else if (documentService) {
        // Delete from blockchain
        await documentService.deleteDocument(docId);
      }
      
      setDocuments(prev => prev.filter(doc => doc.id !== docId));
      
      // If this was the current document, clear it
      if (currentDocumentId === docId) {
        onNewDocument();
      }
    } catch (error) {
      console.error('Failed to delete document:', error);
    }
  };

  const filteredDocuments = documents.filter(doc => 
    doc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    doc.preview?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    
    if (diffHours < 1) {
      const diffMins = Math.floor(diffMs / (1000 * 60));
      return `${diffMins} min${diffMins !== 1 ? 's' : ''} ago`;
    } else if (diffHours < 24) {
      return `${diffHours} hour${diffHours !== 1 ? 's' : ''} ago`;
    } else if (diffHours < 168) { // 7 days
      const diffDays = Math.floor(diffHours / 24);
      return `${diffDays} day${diffDays !== 1 ? 's' : ''} ago`;
    } else {
      return date.toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric',
        year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined
      });
    }
  };

  const getStorageIcon = (storageMethod?: string) => {
    switch (storageMethod) {
      case 'op_return': return '📝';
      case 'ordinals': return '🎨';
      case 'encrypted_data': return '🔐';
      case 'metanet': return '🌐';
      case 'pdf': return '📑';
      default: return '📄';
    }
  };

  // Handle resize
  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsResizing(true);
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isResizing) return;
      
      const newWidth = e.clientX;
      if (newWidth >= 200 && newWidth <= 500) {
        setSidebarWidth(newWidth);
      }
    };

    const handleMouseUp = () => {
      setIsResizing(false);
    };

    if (isResizing) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      document.body.style.cursor = 'col-resize';
      document.body.style.userSelect = 'none';
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
    };
  }, [isResizing]);

  if (isMobile) {
    return (
      <div className="mobile-sidebar-content">
        {isLoading ? (
          <div className="mobile-sidebar-loading">Loading documents...</div>
        ) : filteredDocuments.length === 0 ? (
          <div className="mobile-sidebar-empty">
            {searchQuery ? 'No documents found' : 'No documents yet. Start writing!'}
          </div>
        ) : (
          <div className="mobile-document-list">
            {filteredDocuments.map(doc => (
              <div key={doc.id} className="mobile-document-wrapper">
                <button
                  className={`mobile-document-item ${currentDocumentId === doc.id ? 'active' : ''}`}
                  onClick={() => onDocumentSelect(doc)}
                >
                  <div className="mobile-doc-header">
                    <span className="mobile-doc-icon">{getStorageIcon(doc.storage_method)}</span>
                    <span className="mobile-doc-title">{doc.title}</span>
                    <span className="mobile-doc-date">{formatDate(doc.updated_at)}</span>
                  </div>
                  {doc.preview && (
                    <div className="mobile-doc-preview">{doc.preview}</div>
                  )}
                </button>
                <button
                  className={`mobile-delete-btn ${deleteConfirmId === doc.id ? 'confirm-delete' : ''}`}
                  onClick={(e) => handleDeleteDocument(doc.id, doc.title, e)}
                  title={deleteConfirmId === doc.id ? 'Click again to delete' : `Delete ${doc.title}`}
                >
                  {deleteConfirmId === doc.id ? '⚠️' : '🗑️'}
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }

  return (
    <div 
      className={`document-sidebar ${isCollapsed ? 'collapsed' : ''}`}
      style={{ width: isCollapsed ? '50px' : `${sidebarWidth}px` }}
    >
      <div className="sidebar-header">
        <button 
          className="collapse-btn"
          onClick={() => setIsCollapsed(!isCollapsed)}
          aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {isCollapsed ? '→' : '←'}
        </button>
        {!isCollapsed && <h3>My Documents</h3>}
      </div>
      
      {!isCollapsed && (
        <div className="sidebar-content">
          <div className="sidebar-actions">
            <button className="new-document-btn" onClick={onNewDocument}>
              + New Document
            </button>
            <input
              type="text"
              className="search-input"
              placeholder="Search documents..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          {isLoading ? (
            <div className="sidebar-loading">Loading documents...</div>
          ) : filteredDocuments.length === 0 ? (
            <div className="sidebar-empty">
              {searchQuery ? 'No documents found' : 'No documents yet. Start writing!'}
            </div>
          ) : (
            <div className="document-list">
              {filteredDocuments.map(doc => (
                <div
                  key={doc.id}
                  className={`document-item ${currentDocumentId === doc.id ? 'active' : ''}`}
                >
                  <div 
                    className="document-content"
                    onClick={() => onDocumentSelect(doc)}
                  >
                    <div className="document-header">
                      <span className="document-icon">{getStorageIcon(doc.storage_method)}</span>
                      <span className="document-title">{doc.title || 'Untitled'}</span>
                    </div>
                    {doc.preview && (
                      <div className="document-preview">{doc.preview}</div>
                    )}
                    <div className="document-meta">
                      <span className="document-date">{formatDate(doc.updated_at)}</span>
                      {doc.word_count && (
                        <span className="document-words">{doc.word_count.toLocaleString()} words</span>
                      )}
                      {doc.storage_cost && (
                        <span className="document-cost">{formatUSD(doc.storage_cost)}</span>
                      )}
                    </div>
                  </div>
                  <button
                    className={`delete-btn ${deleteConfirmId === doc.id ? 'confirm-delete' : ''}`}
                    onClick={(e) => handleDeleteDocument(doc.id, doc.title || 'Untitled', e)}
                    title={deleteConfirmId === doc.id ? 'Click again to delete' : `Delete ${doc.title || 'Untitled'}`}
                  >
                    {deleteConfirmId === doc.id ? '⚠️' : '🗑️'}
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
      {!isCollapsed && (
        <div 
          className="sidebar-resize-handle"
          onMouseDown={handleMouseDown}
          style={{ cursor: 'col-resize' }}
        />
      )}
    </div>
  );
};

export default DocumentSidebar;