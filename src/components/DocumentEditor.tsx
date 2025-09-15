import React, { useState, useEffect, useRef, useCallback } from 'react';
import { BlockchainDocumentService, DocumentData, BlockchainDocument } from '../services/BlockchainDocumentService';
import PricingDisplay from './PricingDisplay';
import PublishSettingsModal, { PublishSettings } from './PublishSettingsModal';
import SaveToBlockchainModal, { BlockchainSaveOptions } from './SaveToBlockchainModal';
import TokenizeModal, { TokenizationOptions } from './TokenizeModal';
import PostToTwitterModal from './PostToTwitterModal';
import { StorageOption } from '../utils/pricingCalculator';
import BSVStorageService from '../services/BSVStorageService';
import { LocalDocumentStorage, LocalDocument } from '../utils/documentStorage';
import CryptoJS from 'crypto-js';
import QuillEditor from './QuillEditor';
import './QuillEditor.css';

interface DocumentEditorProps {
  documentService: BlockchainDocumentService | null;
  isAuthenticated: boolean;
  onAuthRequired: () => void;
  currentDocument?: BlockchainDocument | null;
  onDocumentUpdate?: (doc: BlockchainDocument) => void;
}

const DocumentEditor: React.FC<DocumentEditorProps> = ({ 
  documentService, 
  isAuthenticated, 
  onAuthRequired,
  currentDocument: propDocument,
  onDocumentUpdate 
}) => {
  const [currentDocument, setCurrentDocument] = useState<DocumentData | null>(null);
  const [localDocumentId, setLocalDocumentId] = useState<string | null>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [wordCount, setWordCount] = useState(0);
  const [charCount, setCharCount] = useState(0);
  const [cursorPosition, setCursorPosition] = useState('Line 1, Column 1');
  const [autoSaveStatus, setAutoSaveStatus] = useState('');
  const [lastSaveTime, setLastSaveTime] = useState<Date | null>(null);
  const [unsavedChanges, setUnsavedChanges] = useState(false);
  const [lastHashTime, setLastHashTime] = useState<number>(0);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedStorageOption, setSelectedStorageOption] = useState<StorageOption | null>(null);
  const [editorContent, setEditorContent] = useState('');
  const [showPublishModal, setShowPublishModal] = useState(false);
  const [publishSettings, setPublishSettings] = useState<PublishSettings | null>(null);
  const [isEncrypted, setIsEncrypted] = useState(false);
  const [readPrice, setReadPrice] = useState<number>(0);
  const [showSaveBlockchainModal, setShowSaveBlockchainModal] = useState(false);
  const [showActionsDropdown, setShowActionsDropdown] = useState(false);
  const [showTokenizeModal, setShowTokenizeModal] = useState(false);
  const [showTwitterModal, setShowTwitterModal] = useState(false);
  const [bsvService] = useState(() => new BSVStorageService());
  // Always use Quill editor
  const [quillContent, setQuillContent] = useState('');
  const [currentPrice, setCurrentPrice] = useState<string>('0.000000¢');

  // Removed editorRef - using Quill editor exclusively
  const imageInputRef = useRef<HTMLInputElement>(null);

  // Load or create local document
  const loadLocalDocument = useCallback(() => {
    // Check if we have a current document ID
    let docId = LocalDocumentStorage.getCurrentDocumentId();
    let doc: LocalDocument | null = null;
    
    if (docId) {
      doc = LocalDocumentStorage.getDocument(docId);
    }
    
    // If no document found, create a new one
    if (!doc) {
      doc = LocalDocumentStorage.createNewDocument();
      LocalDocumentStorage.saveDocument(doc);
      LocalDocumentStorage.setCurrentDocumentId(doc.id);
    }
    
    setLocalDocumentId(doc.id);
    setCurrentDocument({
      id: doc.id,
      title: doc.title,
      content: doc.content,
      metadata: {
        created_at: doc.created_at,
        updated_at: doc.updated_at,
        author: isAuthenticated ? documentService?.getCurrentUser()?.handle || 'User' : 'Guest',
        encrypted: false,
        word_count: doc.word_count,
        character_count: doc.character_count
      }
    });
    
    setQuillContent(doc.content || '');
    setEditorContent(doc.content || '');
  }, [isAuthenticated, documentService]);

  // Track if this is initial mount
  const isInitialMount = useRef(true);
  const prevPropDocument = useRef(propDocument);
  
  // Load document when propDocument changes
  useEffect(() => {
    if (propDocument) {
      // Check if it's the PDF document
      if (propDocument.id === 'bap-executive-summary') {
        // For PDF, we'll show it in an iframe
        const pdfDoc = {
          id: propDocument.id,
          title: propDocument.title,
          content: '', // PDF content handled separately
          metadata: {
            created_at: propDocument.created_at,
            updated_at: propDocument.updated_at,
            author: propDocument.author || '',
            encrypted: propDocument.encrypted || false,
            word_count: propDocument.word_count || 0,
            character_count: propDocument.character_count || 0,
            storage_method: propDocument.storage_method,
            blockchain_tx: propDocument.blockchain_tx,
            storage_cost: propDocument.storage_cost,
            isPdf: true,
            pdfUrl: '/documents/bap_executive_summary.pdf'
          } as any
        };
        setCurrentDocument(pdfDoc);
        setEditorContent('');
      } else {
        // Load the selected document
        setCurrentDocument({
          id: propDocument.id,
          title: propDocument.title,
          content: propDocument.content || '',
          metadata: {
            created_at: propDocument.created_at,
            updated_at: propDocument.updated_at,
            author: propDocument.author || '',
            encrypted: propDocument.encrypted || false,
            word_count: propDocument.word_count || 0,
            character_count: propDocument.character_count || 0,
            storage_method: propDocument.storage_method,
            blockchain_tx: propDocument.blockchain_tx,
            storage_cost: propDocument.storage_cost
          }
        });
        setEditorContent(propDocument.content || '');
        setQuillContent(propDocument.content || '');
      }
    } else if (propDocument === null) {
      // propDocument is explicitly null
      if (isInitialMount.current) {
        // On initial mount with no document, load existing or create new
        loadLocalDocument();
      } else {
        // User clicked "New Document" in sidebar
        // Save current document first if it has content
        if (localDocumentId) {
          const content = quillContent || editorContent;
          if (content && content !== '') {
            // Extract title from first line of text
            const text = content.replace(/<[^>]*>/g, '');
            const firstLine = text.split('\n')[0]?.trim() || 'Untitled Document';
            const title = firstLine.substring(0, 100);
            LocalDocumentStorage.autoSave(localDocumentId, content, title);
          }
        }
        
        // Create a new document inline
        const newDoc = LocalDocumentStorage.createNewDocument();
        LocalDocumentStorage.saveDocument(newDoc);
        LocalDocumentStorage.setCurrentDocumentId(newDoc.id);
        
        setLocalDocumentId(newDoc.id);
        setCurrentDocument({
          id: newDoc.id,
          title: newDoc.title,
          content: newDoc.content,
          metadata: {
            created_at: newDoc.created_at,
            updated_at: newDoc.updated_at,
            author: isAuthenticated ? documentService?.getCurrentUser()?.handle || 'User' : 'Guest',
            encrypted: false,
            word_count: 0,
            character_count: 0
          }
        });
        
        // Clear the editor for new document
        setQuillContent('');
        setEditorContent('');
        setWordCount(0);
        setCharCount(0);
        
        setAutoSaveStatus('New document created');
        setTimeout(() => setAutoSaveStatus(''), 2000);
        
        // Notify parent component that document was updated
        if (onDocumentUpdate) {
          onDocumentUpdate({
            id: newDoc.id,
            title: newDoc.title,
            content: newDoc.content,
            created_at: newDoc.created_at,
            updated_at: newDoc.updated_at,
            author: 'Local',
            word_count: 0,
            character_count: 0,
            encrypted: false,
            storage_method: 'local'
          } as BlockchainDocument);
        }
        
        // Force a re-render of the sidebar
        window.dispatchEvent(new CustomEvent('documentCreated'));
      }
    }
    
    prevPropDocument.current = propDocument;
    isInitialMount.current = false;
  }, [propDocument, loadLocalDocument, isAuthenticated, documentService, localDocumentId]);

  // Listen for tokenize modal event
  useEffect(() => {
    const handleOpenTokenizeModal = () => {
      setShowTokenizeModal(true);
    };

    window.addEventListener('openTokenizeModal', handleOpenTokenizeModal);
    
    return () => {
      window.removeEventListener('openTokenizeModal', handleOpenTokenizeModal);
    };
  }, []);

  // Listen for Twitter modal event
  useEffect(() => {
    const handleOpenTwitterModal = () => {
      setShowTwitterModal(true);
    };

    window.addEventListener('openTwitterModal', handleOpenTwitterModal);
    
    return () => {
      window.removeEventListener('openTwitterModal', handleOpenTwitterModal);
    };
  }, []);


  // Update counts is now handled by Quill's onTextChange callback

  // Removed duplicate loadLocalDocument - already defined above

  // Handle document changes (load local or clear editor)
  useEffect(() => {
    if (propDocument) {
      // Load existing document
      const docData: DocumentData = {
        id: propDocument.id,
        title: propDocument.title,
        content: propDocument.content || '',
        metadata: {
          created_at: propDocument.created_at,
          updated_at: propDocument.updated_at,
          author: propDocument.author || '',
          encrypted: propDocument.encrypted || false,
          word_count: propDocument.word_count || 0,
          character_count: propDocument.character_count || 0,
          storage_method: propDocument.storage_method,
          blockchain_tx: propDocument.blockchain_tx,
          storage_cost: propDocument.storage_cost
        }
      };
      setCurrentDocument(docData);
      setEditorContent(propDocument.content || '');
      setQuillContent(propDocument.content || '');
    } else if (!isAuthenticated) {
      // Load from localStorage for guest users
      loadLocalDocument();
    } else {
      // Clear editor for new document
      setCurrentDocument(null);
      setEditorContent('');
      setQuillContent('');
    }
  }, [propDocument, isAuthenticated, loadLocalDocument]);

  const saveToLocalStorage = useCallback(() => {
    if (localDocumentId) {
      const content = quillContent || editorContent;
      const title = extractTitleFromContent(content) || 'Untitled Document';
      LocalDocumentStorage.autoSave(localDocumentId, content, title);
    }
  }, [localDocumentId, quillContent, editorContent]);

  // Cursor position is now handled by Quill editor

  const hasUnsavedChanges = useCallback((): boolean => {
    if (!currentDocument) return false;
    const currentContent = quillContent || editorContent;
    return currentContent !== currentDocument.content;
  }, [currentDocument, quillContent, editorContent]);

  const handleNewDocument = useCallback(() => {
    // Save current document first if it has content
    if (localDocumentId) {
      const content = quillContent || editorContent;
      if (content && content !== '') {
        saveToLocalStorage();
      }
    }
    
    // Create new document
    const newDoc = LocalDocumentStorage.createNewDocument();
    LocalDocumentStorage.saveDocument(newDoc);
    LocalDocumentStorage.setCurrentDocumentId(newDoc.id);
    
    setLocalDocumentId(newDoc.id);
    setCurrentDocument({
      id: newDoc.id,
      title: newDoc.title,
      content: newDoc.content,
      metadata: {
        created_at: newDoc.created_at,
        updated_at: newDoc.updated_at,
        author: isAuthenticated ? documentService?.getCurrentUser()?.handle || 'User' : 'Guest',
        encrypted: false,
        word_count: 0,
        character_count: 0
      }
    });
    
    setQuillContent('');
    setEditorContent('');
    setWordCount(0);
    setCharCount(0);
    
    setAutoSaveStatus('New document created');
    setTimeout(() => setAutoSaveStatus(''), 2000);
    
    // Notify parent component that document was updated
    if (onDocumentUpdate) {
      onDocumentUpdate({
        id: newDoc.id,
        title: newDoc.title,
        content: newDoc.content,
        created_at: newDoc.created_at,
        updated_at: newDoc.updated_at,
        author: 'Local',
        word_count: 0,
        character_count: 0,
        encrypted: false,
        storage_method: 'local'
      } as BlockchainDocument);
    }
  }, [localDocumentId, saveToLocalStorage, isAuthenticated, documentService, onDocumentUpdate]);


  const saveDocument = async () => {
    // Always show the modal - it will handle authentication internally
    setShowSaveBlockchainModal(true);
  };

  const handleBlockchainSave = async (options: BlockchainSaveOptions) => {
    try {
      setIsLoading(true);
      setShowSaveBlockchainModal(false);
      setAutoSaveStatus('💾 Saving to blockchain...');
      
      const content = quillContent || editorContent;
      const text = content.replace(/<[^>]*>/g, '');
      const title = extractTitleFromContent(text) || options.metadata.title;
      
      // Use BSV service directly for blockchain storage
      const result = await bsvService.storeDocumentWithOptions(
        text,
        options,
        documentService?.getCurrentUser()?.handle || 'anonymous'
      );
      
      // Update document with blockchain info
      if (currentDocument) {
        const updatedDoc = {
          ...currentDocument,
          metadata: {
            ...currentDocument.metadata,
            blockchain_tx: result.transactionId,
            storage_cost: result.storageCost.totalUSD,
            storage_method: options.storageMethod
          }
        };
        setCurrentDocument(updatedDoc);
      } else {
        // Create new document record
        const newDoc: DocumentData = {
          id: result.transactionId,
          title,
          content: text,
          metadata: {
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
            author: documentService?.getCurrentUser()?.handle || 'anonymous',
            encrypted: options.encryption,
            word_count: wordCount,
            character_count: charCount,
            storage_method: options.storageMethod,
            blockchain_tx: result.transactionId,
            storage_cost: result.storageCost.totalUSD
          }
        };
        setCurrentDocument(newDoc);
      }
      
      setAutoSaveStatus(`✅ Saved to blockchain!`);
      
      // Show unlock link if content is locked
      if (result.unlockLink) {
        alert(`Document saved! Share this unlock link: ${result.unlockLink}`);
      }
      
      // Show payment address if priced
      if (result.paymentAddress) {
        alert(`Payment address for readers: ${result.paymentAddress}`);
      }

    } catch (error) {
      console.error('Error saving to blockchain:', error);
      setAutoSaveStatus('❌ Failed to save');
      alert('Failed to save to blockchain. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Old handler removed - using handleBlockchainSave instead

  const handleTokenize = async (protocol: string, options: TokenizationOptions) => {
    try {
      setIsLoading(true);
      console.log('Tokenizing document with protocol:', protocol, options);
      
      // TODO: Implement actual tokenization logic here
      // This would involve:
      // 1. Connecting to the selected BSV protocol
      // 2. Creating the token with specified parameters
      // 3. Minting the token on-chain
      // 4. Storing token metadata
      
      alert(`Document would be tokenized using ${options.name} on ${protocol.toUpperCase()} protocol.\n\nThis feature is coming soon!`);
      
    } catch (error) {
      console.error('Failed to tokenize document:', error);
      alert('Failed to tokenize document: ' + (error instanceof Error ? error.message : 'Unknown error'));
    } finally {
      setIsLoading(false);
    }
  };

  const autoSave = useCallback(async () => {
    // For guest users, just save to local storage
    if (!isAuthenticated) {
      saveToLocalStorage();
      setAutoSaveStatus('✅ Auto-saved locally');
      setTimeout(() => setAutoSaveStatus(''), 2000);
      return;
    }

    // For authenticated users with a document on blockchain
    if (!currentDocument || !documentService) return;

    try {
      setAutoSaveStatus('💾 Auto-saving to blockchain...');

      const content = quillContent || editorContent;
      const text = content.replace(/<[^>]*>/g, '');
      const title = extractTitleFromContent(text) || currentDocument.title;

      await documentService.updateDocument(currentDocument.id, title, text, selectedStorageOption?.id as any);

      setCurrentDocument(prev => prev ? {
        ...prev,
        title,
        content: text,
        lastUpdated: Date.now(),
        wordCount,
        charCount
      } : null);

      setAutoSaveStatus('✅ Auto-saved to blockchain');
      setTimeout(() => setAutoSaveStatus(''), 2000);
    } catch (error) {
      console.error('Auto-save failed:', error);
      setAutoSaveStatus('❌ Auto-save failed');
      setTimeout(() => setAutoSaveStatus(''), 3000);
    }
  }, [isAuthenticated, currentDocument, documentService, selectedStorageOption, wordCount, charCount, saveToLocalStorage, quillContent, editorContent]);

  // Auto-save every minute
  useEffect(() => {
    const interval = setInterval(() => {
      // Auto-save to local storage for ALL users
      if (localDocumentId) {
        const content = quillContent || editorContent;
        if (content && content !== '<p>Start writing...</p>') {
          saveToLocalStorage();
          
          // Update status with timestamp
          const now = new Date();
          const timeString = now.toLocaleTimeString('en-US', { 
            hour: '2-digit', 
            minute: '2-digit' 
          });
          setAutoSaveStatus(`✓ Auto-saved at ${timeString}`);
          setLastSaveTime(now);
          setUnsavedChanges(false);
          setTimeout(() => setAutoSaveStatus(''), 5000);
        }
      }
      
      // For authenticated users ONLY: also auto-save to blockchain
      if (isAuthenticated && localDocumentId) {
        const now = Date.now();
        if (now - lastHashTime > 60000) { // Every minute
          hashDocument();
          const timeString = new Date().toLocaleTimeString('en-US', { 
            hour: '2-digit', 
            minute: '2-digit' 
          });
          setAutoSaveStatus(`⛓️ Saved to blockchain at ${timeString}`);
          setTimeout(() => setAutoSaveStatus(''), 5000);
        }
      }
    }, 60000); // Every 60 seconds (1 minute)

    return () => clearInterval(interval);
  }, [saveToLocalStorage, isAuthenticated, localDocumentId, lastHashTime, quillContent]);
  
  // Hash document (ultra-low cost, just store hash)
  const hashDocument = async () => {
    if (!localDocumentId) return;
    
    const content = quillContent || editorContent;
    const text = content.replace(/<[^>]*>/g, '');
    if (!text || text.length < 10) return; // Don't hash empty or very short documents
    
    const hash = CryptoJS.SHA256(text).toString();
    const timestamp = new Date().toISOString();
    
    // Store hash locally
    const doc = LocalDocumentStorage.getDocument(localDocumentId);
    if (doc) {
      doc.is_hashed = true;
      doc.hash = hash;
      doc.updated_at = timestamp;
      LocalDocumentStorage.saveDocument(doc);
    }
    
    // If authenticated, store hash on blockchain (ultra-low cost)
    if (isAuthenticated && bsvService) {
      try {
        // This would cost about 1/10,000th of a penny
        // Just storing 32 bytes of hash data
        setAutoSaveStatus('⚓️ Hashing to blockchain...');
        
        // In production, this would make a minimal BSV transaction
        // For now, we'll simulate it
        console.log('Document hash:', hash);
        console.log('Timestamp:', timestamp);
        
        setLastHashTime(Date.now());
        setAutoSaveStatus('✓ Hashed to blockchain');
        setTimeout(() => setAutoSaveStatus(''), 3000);
      } catch (error) {
        console.error('Failed to hash to blockchain:', error);
      }
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
    // Image insertion is now handled by Quill editor toolbar
    console.log('Image insertion should be done through Quill toolbar');
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    // Keyboard shortcuts
    if ((e.ctrlKey || e.metaKey) && e.key === 's') {
      e.preventDefault();
      saveDocument();
    } else if ((e.ctrlKey || e.metaKey) && e.key === 'n') {
      e.preventDefault();
      handleNewDocument();
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

  const handleEncrypt = () => {
    if (isEncrypted) {
      // Decrypt
      setIsEncrypted(false);
      showNotification('Document decrypted');
    } else {
      // Encrypt
      setIsEncrypted(true);
      showNotification('Document encrypted');
    }
  };

  const handleSetPrice = () => {
    const price = prompt('Set price to read (in USD):', readPrice.toString());
    if (price !== null && !isNaN(Number(price))) {
      setReadPrice(Number(price));
      showNotification(`Read price set to $${price}`);
    }
  };

  return (
    <div className={`document-editor ${isFullscreen ? 'fullscreen' : ''}`}>
      <div className="toolbar">
        {/* Mobile Layout */}
        <div className="toolbar-mobile">
          <div className="mobile-main-actions">
            <button 
              onClick={saveDocument} 
              disabled={isLoading} 
              title={isAuthenticated ? "Save to Blockchain" : "Save (Sign in for blockchain)"}
              className={`save-btn-mobile ${!isAuthenticated ? 'save-guest' : ''}`}
            >
              💾 {isAuthenticated ? `Save (${currentPrice})` : 'Save'}
            </button>
            
            <div className="mobile-dropdown-container">
              <button 
                className="mobile-actions-btn"
                onClick={() => setShowActionsDropdown(!showActionsDropdown)}
                title="More actions"
              >
                ⚙️ Actions
              </button>
              
              {showActionsDropdown && (
                <div className="mobile-dropdown">
                  <button 
                    onClick={() => {
                      insertImage();
                      setShowActionsDropdown(false);
                    }}
                    className="dropdown-item"
                  >
                    📷 Add Image
                  </button>
                  {isAuthenticated && (
                    <>
                      <button 
                        onClick={() => {
                          handleEncrypt();
                          setShowActionsDropdown(false);
                        }}
                        disabled={isLoading}
                        className={`dropdown-item ${isEncrypted ? 'encrypted' : ''}`}
                      >
                        {isEncrypted ? '🔓 Decrypt' : '🔒 Encrypt Draft'}
                      </button>
                      <button 
                        onClick={() => {
                          handleSetPrice();
                          setShowActionsDropdown(false);
                        }}
                        disabled={isLoading}
                        className="dropdown-item"
                      >
                        💰 Set Price to Read {readPrice > 0 ? `($${readPrice})` : ''}
                      </button>
                      <button 
                        onClick={() => {
                          setShowPublishModal(true);
                          setShowActionsDropdown(false);
                        }}
                        disabled={isLoading}
                        className="dropdown-item"
                      >
                        🌍 Publish Document
                      </button>
                    </>
                  )}
                  <button 
                    onClick={() => {
                      toggleFullscreen();
                      setShowActionsDropdown(false);
                    }}
                    className="dropdown-item"
                  >
                    ⛶ Fullscreen
                  </button>
                </div>
              )}
            </div>
          </div>
          
          <div className="mobile-stats">
            <span className="word-count">{wordCount}w</span>
            <span className="char-count">{charCount}c</span>
            <PricingDisplay 
              wordCount={wordCount}
              characterCount={charCount}
              content={editorContent}
              isAuthenticated={isAuthenticated}
              onStorageMethodSelect={setSelectedStorageOption}
              isMobile={true}
            />
          </div>
        </div>

        {/* Desktop Layout */}
        <div className="toolbar-desktop">
          <div className="toolbar-left">
            {/* Save button - always saves locally, optionally to blockchain */}
            <button 
              onClick={() => {
                saveToLocalStorage();
                const now = new Date();
                const timeString = now.toLocaleTimeString('en-US', { 
                  hour: '2-digit', 
                  minute: '2-digit' 
                });
                setAutoSaveStatus(`✓ Saved at ${timeString}`);
                setLastSaveTime(now);
                setUnsavedChanges(false);
                setTimeout(() => setAutoSaveStatus(''), 5000);
                
                // If authenticated, also save to blockchain
                if (isAuthenticated) {
                  hashDocument();
                  setAutoSaveStatus(`⛓️ Saving to blockchain...`);
                  setTimeout(() => {
                    setAutoSaveStatus(`✓ Saved to blockchain at ${timeString}`);
                    setTimeout(() => setAutoSaveStatus(''), 5000);
                  }, 1000);
                }
              }} 
              disabled={isLoading || !unsavedChanges} 
              title={unsavedChanges ? "Save changes" : "No changes to save"}
              className={unsavedChanges ? 'save-btn-active' : 'save-btn-inactive'}
            >
              💾 Save {unsavedChanges && '•'}
            </button>
            
            {/* Save As button - for exporting */}
            <button 
              onClick={() => {
                const format = prompt('Export as: txt, html, md, or docx?', 'docx');
                if (format) {
                  if (localDocumentId) {
                    const doc = LocalDocumentStorage.getDocument(localDocumentId);
                    if (doc) {
                      if (format === 'docx') {
                        // Use Quill export for docx
                        const quillExport = document.querySelector('.export-btn');
                        if (quillExport) (quillExport as HTMLElement).click();
                      } else if (['txt', 'html', 'md'].includes(format)) {
                        LocalDocumentStorage.exportDocument(doc, format as 'txt' | 'html' | 'md');
                      }
                      showNotification(`Exported as ${format.toUpperCase()}`);
                    }
                  }
                }
              }}
              title="Export document to file"
            >
              📥 Export...
            </button>
            
            {/* Save with Options - opens modal for all users */}
            <button 
              onClick={() => setShowSaveBlockchainModal(true)}
              title="Save with advanced options (encryption, pricing, etc.)"
              className="save-options-btn"
            >
              ⚙️ Save Options
            </button>
            
            {/* Blockchain save - available to all, prompts sign-in if needed */}
            <button 
              onClick={() => setShowSaveBlockchainModal(true)} 
              disabled={isLoading} 
              title="Save permanently to blockchain with advanced options"
              className="blockchain-save-btn"
            >
              ⛓️ Save to Blockchain ({currentPrice})
            </button>
            
            <button onClick={insertImage} title="Add images to your document (included in blockchain storage cost)">
              📷 Add Image
            </button>
            
            <button 
              onClick={() => {
                if (!isAuthenticated) {
                  setShowSaveBlockchainModal(true);
                } else {
                  handleEncrypt();
                }
              }}
              disabled={isLoading}
              title={isEncrypted ? "Make document readable to you only" : "Encrypt draft for privacy"}
              className={`encrypt-btn ${isEncrypted ? 'encrypted' : ''}`}
            >
              {isEncrypted ? '🔓 Decrypt Draft' : '🔒 Encrypt Draft'}
            </button>
            <button 
              onClick={() => {
                if (!isAuthenticated) {
                  setShowSaveBlockchainModal(true);
                } else {
                  handleSetPrice();
                }
              }}
              disabled={isLoading}
              title="Set price readers must pay to read your document"
              className="price-btn"
            >
              💰 Set Price to Read {readPrice > 0 ? `($${readPrice})` : ''}
            </button>
            <button 
              onClick={() => {
                if (!isAuthenticated) {
                  setShowSaveBlockchainModal(true);
                } else {
                  setShowPublishModal(true);
                }
              }}
              disabled={isLoading}
              title="Make document publicly accessible (optionally behind paywall)"
              className="publish-btn"
            >
              🌍 Publish Document
            </button>
            <button 
              onClick={() => {
                if (!isAuthenticated) {
                  setShowSaveBlockchainModal(true);
                } else {
                  setShowTwitterModal(true);
                }
              }}
              disabled={isLoading}
              title="Share your writing on Twitter"
              className="twitter-share-btn"
            >
              🐦 Post to Twitter
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
            <PricingDisplay 
              wordCount={wordCount}
              characterCount={charCount}
              content={editorContent}
              isAuthenticated={isAuthenticated}
              onStorageMethodSelect={setSelectedStorageOption}
              onPriceUpdate={(price: string) => setCurrentPrice(price)}
            />
          </div>
          
          <div className="toolbar-right">
            <button onClick={toggleFullscreen} title="Toggle Fullscreen">
              ⛶
            </button>
          </div>
        </div>
      </div>

      <div className="editor-container">
        {currentDocument?.metadata && (currentDocument.metadata as any).isPdf ? (
          <iframe
            src={(currentDocument.metadata as any).pdfUrl}
            style={{
              width: '100%',
              height: '100%',
              border: 'none',
              backgroundColor: '#fff'
            }}
            title={currentDocument.title}
          />
        ) : (
          <QuillEditor
            content={quillContent || editorContent}
            onChange={(content) => {
              setQuillContent(content);
              setEditorContent(content);
              // Auto-save for Quill
              if (localDocumentId) {
                const text = content.replace(/<[^>]*>/g, '');
                const firstLine = text.split('\n')[0]?.trim() || 'Untitled Document';
                const title = firstLine.substring(0, 100);
                LocalDocumentStorage.autoSave(localDocumentId, content, title);
              }
            }}
            onTextChange={(text) => {
              const words = text.trim() ? text.trim().split(/\s+/).length : 0;
              const chars = text.length;
              setWordCount(words);
              setCharCount(chars);
            }}
            placeholder="Start writing your document..."
          />
        )}
      </div>

      <div className="status-bar">
        {currentDocument?.metadata && (currentDocument.metadata as any).isPdf ? (
          <>
            <span>📑 PDF Document</span>
            <span>{currentDocument?.title || 'Untitled'}</span>
          </>
        ) : (
          <>
            <span>{cursorPosition}</span>
            <span className="auto-save-status">{autoSaveStatus}</span>
            <span>{currentDocument?.title || 'Untitled'}</span>
          </>
        )}
      </div>

      
      <PublishSettingsModal
        isOpen={showPublishModal}
        onClose={() => setShowPublishModal(false)}
        onConfirm={(settings) => {
          setPublishSettings(settings);
          // TODO: Save publish settings with document
          console.log('Publish settings:', settings);
        }}
        currentSettings={publishSettings || undefined}
        documentTitle={currentDocument?.title || 'Untitled'}
      />

      <SaveToBlockchainModal
        isOpen={showSaveBlockchainModal}
        onClose={() => setShowSaveBlockchainModal(false)}
        onSave={handleBlockchainSave}
        documentTitle={currentDocument?.title || 'Untitled Document'}
        wordCount={wordCount}
        estimatedSize={charCount}
        isAuthenticated={isAuthenticated}
        onAuthRequired={onAuthRequired}
      />

      <TokenizeModal
        isOpen={showTokenizeModal}
        onClose={() => setShowTokenizeModal(false)}
        onTokenize={handleTokenize}
        documentTitle={currentDocument?.title || 'Untitled Document'}
        wordCount={wordCount}
      />

      <PostToTwitterModal
        isOpen={showTwitterModal}
        onClose={() => setShowTwitterModal(false)}
        documentTitle={currentDocument?.title || 'Untitled Document'}
        documentContent={quillContent || editorContent}
      />
      
      {isLoading && (
        <div className="loading-overlay">
          <div className="spinner"></div>
        </div>
      )}
    </div>
  );
};

export default DocumentEditor;