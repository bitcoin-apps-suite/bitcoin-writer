import React, { useState, useEffect, useRef, useCallback } from 'react';
import { BlockchainDocumentService, DocumentData, DocumentMetadata } from '../services/BlockchainDocumentService';

interface DocumentEditorProps {
  documentService: BlockchainDocumentService;
}

const DocumentEditor: React.FC<DocumentEditorProps> = ({ documentService }) => {
  const [currentDocument, setCurrentDocument] = useState<DocumentData | null>(null);
  const [documentList, setDocumentList] = useState<DocumentMetadata[]>([]);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [wordCount, setWordCount] = useState(0);
  const [charCount, setCharCount] = useState(0);
  const [cursorPosition, setCursorPosition] = useState('Line 1, Column 1');
  const [autoSaveStatus, setAutoSaveStatus] = useState('');
  const [showDocumentList, setShowDocumentList] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const editorRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);

  // Load document list on mount
  useEffect(() => {
    loadDocumentList();
  }, [documentService]);

  // Auto-save interval
  useEffect(() => {
    const interval = setInterval(() => {
      if (currentDocument && hasUnsavedChanges()) {
        autoSave();
      }
    }, 30000); // Auto-save every 30 seconds

    return () => clearInterval(interval);
  }, [currentDocument]);

  const loadDocumentList = async () => {
    try {
      const docs = await documentService.getDocumentList();
      setDocumentList(docs);
    } catch (error) {
      console.error('Failed to load document list:', error);
      showNotification('Failed to load documents', 'error');
    }
  };

  const updateCounts = useCallback(() => {
    if (!editorRef.current) return;

    const text = editorRef.current.textContent || '';
    const isPlaceholder = text.trim() === 'Start writing...';
    
    if (isPlaceholder) {
      setWordCount(0);
      setCharCount(0);
      return;
    }

    const words = text.trim() ? text.trim().split(/\s+/).length : 0;
    const chars = text.length;

    setWordCount(words);
    setCharCount(chars);
  }, []);

  const updateCursorPosition = useCallback(() => {
    const selection = window.getSelection();
    if (selection && selection.rangeCount > 0) {
      const range = selection.getRangeAt(0);
      const preCaretRange = range.cloneRange();
      preCaretRange.selectNodeContents(editorRef.current!);
      preCaretRange.setEnd(range.endContainer, range.endOffset);
      
      const text = preCaretRange.toString();
      const lines = text.split('\n');
      const line = lines.length;
      const column = lines[lines.length - 1].length + 1;
      
      setCursorPosition(`Line ${line}, Column ${column}`);
    }
  }, []);

  const hasUnsavedChanges = (): boolean => {
    if (!editorRef.current || !currentDocument) return false;
    const currentContent = editorRef.current.innerHTML;
    return currentContent !== currentDocument.content;
  };

  const newDocument = async () => {
    if (hasUnsavedChanges()) {
      if (!window.confirm('You have unsaved changes. Are you sure you want to create a new document?')) {
        return;
      }
    }

    try {
      setIsLoading(true);
      const doc = await documentService.createDocument('Untitled Document', '');
      setCurrentDocument(doc);
      if (editorRef.current) {
        editorRef.current.innerHTML = '<p>Start writing...</p>';
        editorRef.current.focus();
      }
      await loadDocumentList();
      showNotification('New document created');
    } catch (error) {
      console.error('Failed to create document:', error);
      showNotification('Failed to create document', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const openDocument = async (documentId: string) => {
    try {
      setIsLoading(true);
      const doc = await documentService.getDocument(documentId);
      if (doc) {
        setCurrentDocument(doc);
        if (editorRef.current) {
          editorRef.current.innerHTML = doc.content || '<p>Start writing...</p>';
          editorRef.current.focus();
        }
        setShowDocumentList(false);
        updateCounts();
        showNotification('Document loaded');
      }
    } catch (error) {
      console.error('Failed to open document:', error);
      showNotification('Failed to open document', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const saveDocument = async () => {
    if (!currentDocument || !editorRef.current) return;

    try {
      setIsLoading(true);
      setAutoSaveStatus('💾 Saving...');
      
      const content = editorRef.current.innerHTML;
      const title = extractTitleFromContent(content) || currentDocument.title;
      
      await documentService.updateDocument(currentDocument.id, title, content);
      
      // Update current document state
      setCurrentDocument(prev => prev ? {
        ...prev,
        title,
        content,
        lastUpdated: Date.now(),
        wordCount,
        charCount
      } : null);
      
      await loadDocumentList();
      setAutoSaveStatus('✅ Saved');
      setTimeout(() => setAutoSaveStatus(''), 2000);
      showNotification('Document saved');
    } catch (error) {
      console.error('Failed to save document:', error);
      setAutoSaveStatus('❌ Save failed');
      setTimeout(() => setAutoSaveStatus(''), 3000);
      showNotification('Failed to save document', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const autoSave = async () => {
    if (!currentDocument || !editorRef.current) return;

    try {
      setAutoSaveStatus('💾 Auto-saving...');
      
      const content = editorRef.current.innerHTML;
      const title = extractTitleFromContent(content) || currentDocument.title;
      
      await documentService.updateDocument(currentDocument.id, title, content);
      
      setCurrentDocument(prev => prev ? {
        ...prev,
        title,
        content,
        lastUpdated: Date.now(),
        wordCount,
        charCount
      } : null);
      
      await loadDocumentList();
      setAutoSaveStatus('✅ Auto-saved');
      setTimeout(() => setAutoSaveStatus(''), 2000);
    } catch (error) {
      console.error('Auto-save failed:', error);
      setAutoSaveStatus('❌ Auto-save failed');
      setTimeout(() => setAutoSaveStatus(''), 3000);
    }
  };

  const deleteDocument = async (documentId: string) => {
    if (!window.confirm('Are you sure you want to delete this document? This action cannot be undone.')) {
      return;
    }

    try {
      setIsLoading(true);
      await documentService.deleteDocument(documentId);
      await loadDocumentList();
      
      // If we're deleting the current document, clear the editor
      if (currentDocument && currentDocument.id === documentId) {
        setCurrentDocument(null);
        if (editorRef.current) {
          editorRef.current.innerHTML = '<p>Start writing...</p>';
        }
        updateCounts();
      }
      
      showNotification('Document deleted');
    } catch (error) {
      console.error('Failed to delete document:', error);
      showNotification('Failed to delete document', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const extractTitleFromContent = (html: string): string => {
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = html;
    const text = tempDiv.textContent || tempDiv.innerText || '';
    const firstLine = text.split('\n')[0].trim();
    return firstLine.length > 0 && firstLine.length <= 100 ? firstLine : 'Untitled Document';
  };

  const insertImage = () => {
    imageInputRef.current?.click();
  };

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          insertImageIntoEditor(event.target.result as string, file.name);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const insertImageIntoEditor = (imageSrc: string, fileName: string) => {
    if (!editorRef.current) return;

    const img = document.createElement('img');
    img.src = imageSrc;
    img.alt = fileName;
    img.style.maxWidth = '100%';
    img.style.height = 'auto';
    img.style.margin = '10px 0';
    img.style.borderRadius = '4px';

    const selection = window.getSelection();
    if (selection && selection.rangeCount > 0) {
      const range = selection.getRangeAt(0);
      range.insertNode(img);
      range.setStartAfter(img);
      range.setEndAfter(img);
      selection.removeAllRanges();
      selection.addRange(range);
    }

    updateCounts();
    editorRef.current.focus();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    // Keyboard shortcuts
    if ((e.ctrlKey || e.metaKey) && e.key === 's') {
      e.preventDefault();
      saveDocument();
    } else if ((e.ctrlKey || e.metaKey) && e.key === 'n') {
      e.preventDefault();
      newDocument();
    } else if (e.key === 'F11') {
      e.preventDefault();
      toggleFullscreen();
    } else if (e.key === 'Tab') {
      e.preventDefault();
      document.execCommand('insertText', false, '    ');
    }
  };

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const text = e.clipboardData.getData('text/plain');
    document.execCommand('insertText', false, text);
  };

  const showNotification = (message: string, type: 'success' | 'error' = 'success') => {
    // Simple notification implementation
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    notification.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      background-color: ${type === 'error' ? '#ff4444' : '#44ff44'};
      color: white;
      padding: 12px 20px;
      border-radius: 6px;
      z-index: 10000;
      font-size: 14px;
      box-shadow: 0 4px 12px rgba(0,0,0,0.3);
      transition: opacity 0.3s ease;
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
      notification.style.opacity = '0';
      setTimeout(() => {
        if (notification.parentNode) {
          notification.parentNode.removeChild(notification);
        }
      }, 300);
    }, 3000);
  };

  const formatDate = (timestamp: number): string => {
    return new Date(timestamp).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className={`document-editor ${isFullscreen ? 'fullscreen' : ''}`}>
      <div className="toolbar">
        <div className="toolbar-left">
          <button onClick={newDocument} disabled={isLoading} title="New Document">
            New
          </button>
          <button onClick={() => setShowDocumentList(true)} title="Open Document">
            Open
          </button>
          <button onClick={saveDocument} disabled={isLoading || !currentDocument} title="Save Document">
            Save
          </button>
          <button onClick={insertImage} title="Insert Image">
            📷
          </button>
          <input
            type="file"
            ref={imageInputRef}
            accept="image/*"
            style={{ display: 'none' }}
            onChange={handleImageSelect}
          />
        </div>
        
        <div className="toolbar-center">
          <span>{wordCount} word{wordCount !== 1 ? 's' : ''}</span>
          <span>{charCount} character{charCount !== 1 ? 's' : ''}</span>
        </div>
        
        <div className="toolbar-right">
          <button onClick={toggleFullscreen} title="Toggle Fullscreen">
            ⛶
          </button>
        </div>
      </div>

      <div className="editor-container">
        <div
          ref={editorRef}
          className="editor"
          contentEditable
          spellCheck
          onInput={updateCounts}
          onKeyUp={updateCursorPosition}
          onClick={updateCursorPosition}
          onKeyDown={handleKeyDown}
          onPaste={handlePaste}
          suppressContentEditableWarning
        >
          <p>Start writing...</p>
        </div>
      </div>

      <div className="status-bar">
        <span>{cursorPosition}</span>
        <span className="auto-save-status">{autoSaveStatus}</span>
        <span>{currentDocument?.title || 'Untitled'}</span>
      </div>

      {/* Document List Modal */}
      {showDocumentList && (
        <div className="modal-overlay" onClick={() => setShowDocumentList(false)}>
          <div className="document-list-modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Your Documents</h3>
              <button onClick={() => setShowDocumentList(false)}>×</button>
            </div>
            <div className="document-list">
              {documentList.length === 0 ? (
                <div className="empty-state">
                  <p>No documents found. Create your first document!</p>
                  <button onClick={() => {
                    setShowDocumentList(false);
                    newDocument();
                  }}>
                    Create New Document
                  </button>
                </div>
              ) : (
                documentList.map(doc => (
                  <div key={doc.id} className="document-item">
                    <div className="document-info" onClick={() => openDocument(doc.id)}>
                      <h4>{doc.title}</h4>
                      <div className="document-meta">
                        <span>{doc.wordCount} words</span>
                        <span>•</span>
                        <span>{formatDate(doc.lastUpdated)}</span>
                      </div>
                    </div>
                    <button 
                      className="delete-btn"
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteDocument(doc.id);
                      }}
                      title="Delete document"
                    >
                      🗑️
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}
      
      {isLoading && (
        <div className="loading-overlay">
          <div className="spinner"></div>
        </div>
      )}
    </div>
  );
};

export default DocumentEditor;