import React, { useState, useEffect } from 'react';
import { BlockchainDocumentService, BlockchainDocument } from '../services/BlockchainDocumentService';
import { formatUSD } from '../utils/pricingCalculator';

interface DocumentSidebarProps {
  documentService: BlockchainDocumentService | null;
  isAuthenticated: boolean;
  onDocumentSelect: (doc: BlockchainDocument) => void;
  onNewDocument: () => void;
  currentDocumentId?: string;
}

const DocumentSidebar: React.FC<DocumentSidebarProps> = ({
  documentService,
  isAuthenticated,
  onDocumentSelect,
  onNewDocument,
  currentDocumentId
}) => {
  const [documents, setDocuments] = useState<BlockchainDocument[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isCollapsed, setIsCollapsed] = useState(false);

  useEffect(() => {
    if (isAuthenticated && documentService) {
      loadDocuments();
    }
  }, [isAuthenticated, documentService]);

  const loadDocuments = async () => {
    if (!documentService) return;
    
    setIsLoading(true);
    try {
      const docs = await documentService.getDocuments();
      setDocuments(docs.sort((a, b) => 
        new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime()
      ));
    } catch (error) {
      console.error('Failed to load documents:', error);
    } finally {
      setIsLoading(false);
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
      default: return '📄';
    }
  };

  if (!isAuthenticated) {
    return (
      <div className={`document-sidebar ${isCollapsed ? 'collapsed' : ''}`}>
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
            <div className="sidebar-empty">
              <p>Sign in with HandCash to save and access your documents on the blockchain</p>
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className={`document-sidebar ${isCollapsed ? 'collapsed' : ''}`}>
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
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default DocumentSidebar;