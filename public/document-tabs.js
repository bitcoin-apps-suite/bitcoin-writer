/**
 * Document Tabs Manager for Bitcoin Writer
 */

class DocumentTabsManager {
  constructor() {
    this.documents = new Map();
    this.activeDocumentId = null;
    this.documentCounter = 0;
    this.init();
  }

  init() {
    console.log('Initializing Document Tabs Manager');
    this.createTabsContainer();
    this.createNewDocument('Document1');
  }

  createTabsContainer() {
    const titleBarWrapper = document.querySelector('.title-bar-wrapper');
    if (!titleBarWrapper) {
      console.error('Title bar wrapper not found');
      return;
    }

    // Remove the single document title input
    const existingTitle = titleBarWrapper.querySelector('.document-title');
    if (existingTitle) {
      existingTitle.style.display = 'none';
    }

    // Create tabs container
    const tabsContainer = document.createElement('div');
    tabsContainer.className = 'document-tabs-container';
    tabsContainer.innerHTML = `
      <div class="document-tabs">
        <div class="tabs-list" id="tabsList"></div>
        <button class="new-tab-btn" id="newTabBtn" title="New Document">+</button>
      </div>
    `;

    // Insert after title bar
    titleBarWrapper.parentNode.insertBefore(tabsContainer, titleBarWrapper.nextSibling);

    // Attach event listener to new tab button
    document.getElementById('newTabBtn').addEventListener('click', () => {
      this.createNewDocument();
    });

    console.log('Tabs container created');
  }

  generateDocumentId() {
    return `doc-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  createNewDocument(title = null) {
    this.documentCounter++;
    const docId = this.generateDocumentId();
    const docTitle = title || `Document${this.documentCounter}`;
    
    console.log('Creating new document:', docTitle);
    
    const doc = {
      id: docId,
      title: docTitle,
      content: '<p>Start typing...</p>',
      isDirty: false,
      created: new Date(),
      lastModified: new Date()
    };

    this.documents.set(docId, doc);
    this.addTab(docId, docTitle);
    this.switchToDocument(docId);
    
    return docId;
  }

  addTab(docId, title) {
    const tabsList = document.getElementById('tabsList');
    if (!tabsList) {
      console.error('Tabs list not found');
      return;
    }

    const tab = document.createElement('div');
    tab.className = 'document-tab';
    tab.dataset.docId = docId;
    tab.innerHTML = `
      <span class="tab-indicator"></span>
      <span class="tab-title">${this.escapeHtml(title)}</span>
      <button class="tab-close" title="Close">&times;</button>
    `;

    // Click to switch documents
    tab.addEventListener('click', (e) => {
      if (!e.target.classList.contains('tab-close')) {
        this.switchToDocument(docId);
      }
    });

    // Close button
    tab.querySelector('.tab-close').addEventListener('click', (e) => {
      e.stopPropagation();
      this.closeDocument(docId);
    });

    // Double-click to rename
    tab.querySelector('.tab-title').addEventListener('dblclick', (e) => {
      this.startTabRename(docId, e.target);
    });

    tabsList.appendChild(tab);
    console.log('Tab added for document:', title);
  }

  switchToDocument(docId) {
    const doc = this.documents.get(docId);
    if (!doc) {
      console.error('Document not found:', docId);
      return;
    }

    // Save current document content
    if (this.activeDocumentId && this.activeDocumentId !== docId) {
      this.saveCurrentDocument();
    }

    // Update tab styles
    document.querySelectorAll('.document-tab').forEach(tab => {
      tab.classList.remove('active');
      if (tab.dataset.docId === docId) {
        tab.classList.add('active');
        // Add animation
        tab.style.transform = 'translateY(-2px)';
        setTimeout(() => {
          tab.style.transform = 'translateY(0)';
        }, 200);
      }
    });

    // Load document content
    const editor = document.getElementById('editor');
    if (editor) {
      editor.innerHTML = doc.content;
      editor.focus();
      
      // Add a brief highlight effect to the editor
      editor.style.boxShadow = '0 0 20px rgba(247, 147, 26, 0.3)';
      setTimeout(() => {
        editor.style.boxShadow = 'none';
      }, 500);
    }

    // Update window title
    document.title = `${doc.title} - Bitcoin Writer`;
    
    // Update status bar with document name
    const statusDoc = document.querySelector('.status-item.document-name');
    if (statusDoc) {
      statusDoc.innerHTML = `<span>📄 ${doc.title}</span>`;
    }
    
    // Show active document indicator in page
    this.updateActiveDocumentIndicator(doc);
    
    this.activeDocumentId = docId;
    console.log('Switched to document:', doc.title);
  }

  updateActiveDocumentIndicator(doc) {
    // Check if indicator exists, if not create it
    let indicator = document.querySelector('.active-document-indicator');
    if (!indicator) {
      indicator = document.createElement('div');
      indicator.className = 'active-document-indicator';
      indicator.style.cssText = `
        position: fixed;
        top: 140px;
        right: 70px;
        background: rgba(247, 147, 26, 0.9);
        color: #1b1b1b;
        padding: 6px 12px;
        border-radius: 4px;
        font-size: 11px;
        font-weight: 600;
        z-index: 100;
        transition: opacity 0.3s ease;
        pointer-events: none;
      `;
      document.body.appendChild(indicator);
    }
    
    indicator.textContent = `Editing: ${doc.title}`;
    indicator.style.opacity = '1';
    
    // Fade out after 2 seconds
    setTimeout(() => {
      if (indicator) {
        indicator.style.opacity = '0';
      }
    }, 2000);
  }

  saveCurrentDocument() {
    if (!this.activeDocumentId) return;
    
    const doc = this.documents.get(this.activeDocumentId);
    if (!doc) return;

    const editor = document.getElementById('editor');
    if (editor) {
      doc.content = editor.innerHTML;
      doc.lastModified = new Date();
    }
  }

  closeDocument(docId) {
    const doc = this.documents.get(docId);
    if (!doc) return;

    if (doc.isDirty) {
      if (!confirm(`Close "${doc.title}" without saving?`)) {
        return;
      }
    }

    // Remove tab
    const tab = document.querySelector(`.document-tab[data-doc-id="${docId}"]`);
    if (tab) {
      tab.remove();
    }

    // Remove from documents
    this.documents.delete(docId);

    // If this was the active document, switch to another
    if (this.activeDocumentId === docId) {
      const remainingDocs = Array.from(this.documents.keys());
      if (remainingDocs.length > 0) {
        this.switchToDocument(remainingDocs[remainingDocs.length - 1]);
      } else {
        // Create a new document if none left
        this.createNewDocument();
      }
    }
  }

  startTabRename(docId, titleElement) {
    const doc = this.documents.get(docId);
    if (!doc) return;

    const input = document.createElement('input');
    input.type = 'text';
    input.className = 'tab-rename-input';
    input.value = doc.title;
    
    titleElement.style.display = 'none';
    titleElement.parentNode.insertBefore(input, titleElement);
    input.focus();
    input.select();

    const finishRename = () => {
      const newTitle = input.value.trim() || doc.title;
      doc.title = newTitle;
      titleElement.textContent = newTitle;
      titleElement.style.display = '';
      input.remove();
      
      if (docId === this.activeDocumentId) {
        document.title = `${newTitle} - Bitcoin Writer`;
      }
    };

    input.addEventListener('blur', finishRename);
    input.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        finishRename();
      } else if (e.key === 'Escape') {
        input.value = doc.title;
        finishRename();
      }
    });
  }

  escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }

  // Mark document as modified
  markDocumentModified(docId) {
    const doc = this.documents.get(docId);
    if (doc && !doc.isDirty) {
      doc.isDirty = true;
      const tab = document.querySelector(`.document-tab[data-doc-id="${docId}"]`);
      if (tab) {
        tab.classList.add('modified');
      }
    }
  }

  // Get current document
  getCurrentDocument() {
    return this.documents.get(this.activeDocumentId);
  }
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    window.documentTabsManager = new DocumentTabsManager();
    console.log('Document Tabs Manager initialized on DOMContentLoaded');
    
    // Make it globally accessible for debugging
    window.createNewDoc = () => {
      console.log('Global createNewDoc called');
      window.documentTabsManager.createNewDocument();
    };
  });
} else {
  window.documentTabsManager = new DocumentTabsManager();
  console.log('Document Tabs Manager initialized immediately');
  
  // Make it globally accessible for debugging
  window.createNewDoc = () => {
    console.log('Global createNewDoc called');
    window.documentTabsManager.createNewDocument();
  };
}