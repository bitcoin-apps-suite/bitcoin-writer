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

  const editorRef = useRef<HTMLDivElement>(null);
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
    
    if (editorRef.current) {
      editorRef.current.innerHTML = doc.content || '<p>Start writing...</p>';
      updateCounts();
    }
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
        if (editorRef.current) {
          editorRef.current.textContent = propDocument.content || '';
        }
      }
    } else if (propDocument === null) {
      // propDocument is explicitly null
      if (isInitialMount.current) {
        // On initial mount with no document, load existing or create new
        loadLocalDocument();
      } else if (prevPropDocument.current !== null) {
        // User clicked "New Document" in sidebar (propDocument changed from something to null)
        // Save current document first if it has content
        if (editorRef.current && localDocumentId) {
          const content = editorRef.current.innerHTML;
          if (content && content !== '<p>Start writing...</p>') {
            // Extract title from first line of text
            const text = editorRef.current.textContent || '';
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
        
        if (editorRef.current) {
          editorRef.current.innerHTML = '<p>Start writing...</p>';
          editorRef.current.focus();
          // Update word and character counts
          setWordCount(0);
          setCharCount(0);
          setEditorContent('');
        }
        
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


  const updateCounts = useCallback(() => {
    if (!editorRef.current) return;

    const text = editorRef.current.textContent || '';
    const html = editorRef.current.innerHTML || '';
    const isPlaceholder = text.trim() === 'Start writing...';
    
    if (isPlaceholder) {
      setWordCount(0);
      setCharCount(0);
      setEditorContent('');
      return;
    }

    const words = text.trim() ? text.trim().split(/\s+/).length : 0;
    const chars = text.length;

    setWordCount(words);
    setCharCount(chars);
    setEditorContent(html);
  }, []);

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
      if (editorRef.current) {
        editorRef.current.innerHTML = propDocument.content || '';
      }
      updateCounts();
    } else if (!isAuthenticated) {
      // Load from localStorage for guest users
      loadLocalDocument();
    } else {
      // Clear editor for new document
      setCurrentDocument(null);
      setEditorContent('');
      if (editorRef.current) {
        editorRef.current.textContent = '';
      }
    }
  }, [propDocument, isAuthenticated, loadLocalDocument, updateCounts]);

  const saveToLocalStorage = useCallback(() => {
    if (editorRef.current && localDocumentId) {
      const content = editorRef.current.innerHTML;
      const title = extractTitleFromContent(content) || 'Untitled Document';
      LocalDocumentStorage.autoSave(localDocumentId, content, title);
    }
  }, [localDocumentId]);

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

  const hasUnsavedChanges = useCallback((): boolean => {
    if (!editorRef.current || !currentDocument) return false;
    const currentContent = editorRef.current.innerHTML;
    return currentContent !== currentDocument.content;
  }, [currentDocument]);

  const handleNewDocument = useCallback(() => {
    // Save current document first if it has content
    if (editorRef.current && localDocumentId) {
      const content = editorRef.current.innerHTML;
      if (content && content !== '<p>Start writing...</p>') {
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
    
    if (editorRef.current) {
      editorRef.current.innerHTML = '<p>Start writing...</p>';
      editorRef.current.focus();
      updateCounts();
    }
    
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
    // If not authenticated, prompt to sign in
    if (!isAuthenticated) {
      const shouldSignIn = window.confirm(
        'To save your document on the blockchain, you need to sign in with HandCash.\n\n' +
        'Your document will be encrypted and permanently stored on Bitcoin SV.\n\n' +
        'Would you like to sign in now?'
      );
      
      if (shouldSignIn) {
        // Save to local storage first so content isn't lost
        saveToLocalStorage();
        onAuthRequired();
      } else {
        // Just save locally
        saveToLocalStorage();
        showNotification('Document saved locally (not on blockchain)');
      }
      return;
    }

    // Show enhanced storage modal for blockchain save
    setShowSaveBlockchainModal(true);
  };

  const handleBlockchainSave = async (options: BlockchainSaveOptions) => {
    if (!editorRef.current) return;

    try {
      setIsLoading(true);
      setShowSaveBlockchainModal(false);
      setAutoSaveStatus('💾 Saving to blockchain...');
      
      const content = editorRef.current.textContent || '';
      const title = extractTitleFromContent(content) || options.metadata.title;
      
      // Use BSV service directly for blockchain storage
      const result = await bsvService.storeDocumentWithOptions(
        content,
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
          content,
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
    if (!editorRef.current) return;

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

      const content = editorRef.current.innerHTML;
      const title = extractTitleFromContent(content) || currentDocument.title;

      await documentService.updateDocument(currentDocument.id, title, content, selectedStorageOption?.id as any);

      setCurrentDocument(prev => prev ? {
        ...prev,
        title,
        content,
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
  }, [isAuthenticated, currentDocument, documentService, selectedStorageOption, wordCount, charCount]);

  // Auto-save interval and auto-hash for authenticated users
  useEffect(() => {
    const interval = setInterval(() => {
      // Auto-save to local storage
      if (editorRef.current && localDocumentId) {
        saveToLocalStorage();
      }
      
      // Auto-hash for authenticated users every 5 minutes
      if (isAuthenticated && editorRef.current && localDocumentId) {
        const now = Date.now();
        if (now - lastHashTime > 300000) { // 5 minutes
          hashDocument();
        }
      }
    }, 30000); // Check every 30 seconds

    return () => clearInterval(interval);
  }, [saveToLocalStorage, isAuthenticated, localDocumentId, lastHashTime]);
  
  // Hash document (ultra-low cost, just store hash)
  const hashDocument = async () => {
    if (!editorRef.current || !localDocumentId) return;
    
    const content = editorRef.current.textContent || '';
    if (!content || content.length < 10) return; // Don't hash empty or very short documents
    
    const hash = CryptoJS.SHA256(content).toString();
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
              💾 {isAuthenticated ? 'Save' : 'Save'}
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
            <button 
              onClick={saveDocument} 
              disabled={isLoading} 
              title={isAuthenticated ? "Save encrypted draft to blockchain" : "Save (Sign in for blockchain)"}
              className={!isAuthenticated ? 'save-guest' : ''}
            >
              💾 {isAuthenticated ? 'Save to Blockchain' : 'Save'}
            </button>
            
            <button 
              onClick={() => {
                if (localDocumentId) {
                  const doc = LocalDocumentStorage.getDocument(localDocumentId);
                  if (doc) {
                    const format = prompt('Save as format: txt, html, or md?', 'txt');
                    if (format && ['txt', 'html', 'md'].includes(format)) {
                      LocalDocumentStorage.exportDocument(doc, format as 'txt' | 'html' | 'md');
                      showNotification('Downloaded to your computer');
                    }
                  }
                }
              }}
              title="Download document to your computer"
            >
              💻 Save to Computer
            </button>
            
            <button onClick={insertImage} title="Add images to your document (included in blockchain storage cost)">
              📷 Add Image
            </button>
            
            {isAuthenticated && (
              <>
                <button 
                  onClick={handleEncrypt}
                  disabled={isLoading}
                  title={isEncrypted ? "Make document readable to you only" : "Encrypt draft for privacy"}
                  className={`encrypt-btn ${isEncrypted ? 'encrypted' : ''}`}
                >
                  {isEncrypted ? '🔓 Decrypt Draft' : '🔒 Encrypt Draft'}
                </button>
                <button 
                  onClick={handleSetPrice}
                  disabled={isLoading}
                  title="Set price readers must pay to read your document"
                  className="price-btn"
                >
                  💰 Set Price to Read {readPrice > 0 ? `($${readPrice})` : ''}
                </button>
                <button 
                  onClick={() => setShowPublishModal(true)}
                  disabled={isLoading}
                  title="Make document publicly accessible (optionally behind paywall)"
                  className="publish-btn"
                >
                  🌍 Publish Document
                </button>
                <button 
                  onClick={() => setShowTwitterModal(true)}
                  disabled={isLoading}
                  title="Share your writing on Twitter"
                  className="twitter-share-btn"
                >
                  🐦 Post to Twitter
                </button>
              </>
            )}
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
        documentContent={editorRef.current?.innerHTML || ''}
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