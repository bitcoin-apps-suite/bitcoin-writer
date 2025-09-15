/**
 * Local document storage management
 * Handles multiple documents in localStorage with auto-save
 */

export interface LocalDocument {
  id: string;
  title: string;
  content: string;
  created_at: string;
  updated_at: string;
  word_count: number;
  character_count: number;
  is_hashed?: boolean;
  hash?: string;
  hash_tx?: string;
}

export class LocalDocumentStorage {
  private static readonly STORAGE_KEY = 'bitcoinWriter_documents';
  private static readonly CURRENT_DOC_KEY = 'bitcoinWriter_currentDocId';
  private static readonly MAX_DOCUMENTS = 50; // Limit to prevent localStorage overflow

  /**
   * Get all documents from local storage
   */
  static getAllDocuments(): LocalDocument[] {
    try {
      const stored = localStorage.getItem(this.STORAGE_KEY);
      if (!stored) return [];
      
      const docs = JSON.parse(stored);
      // Sort by updated_at descending
      return docs.sort((a: LocalDocument, b: LocalDocument) => 
        new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime()
      );
    } catch (error) {
      console.error('Error loading local documents:', error);
      return [];
    }
  }

  /**
   * Save a document to local storage
   */
  static saveDocument(doc: LocalDocument): void {
    try {
      const docs = this.getAllDocuments();
      const existingIndex = docs.findIndex(d => d.id === doc.id);
      
      if (existingIndex >= 0) {
        // Update existing document
        docs[existingIndex] = {
          ...docs[existingIndex],
          ...doc,
          updated_at: new Date().toISOString()
        };
      } else {
        // Add new document
        docs.unshift(doc);
        
        // Remove oldest documents if we exceed the limit
        if (docs.length > this.MAX_DOCUMENTS) {
          docs.splice(this.MAX_DOCUMENTS);
        }
      }
      
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(docs));
    } catch (error) {
      console.error('Error saving document:', error);
      // If localStorage is full, try removing oldest documents
      if (error instanceof DOMException && error.name === 'QuotaExceededError') {
        this.cleanupOldDocuments();
        // Retry
        try {
          const docs = this.getAllDocuments();
          docs.unshift(doc);
          localStorage.setItem(this.STORAGE_KEY, JSON.stringify(docs.slice(0, 10)));
        } catch (retryError) {
          console.error('Failed to save even after cleanup:', retryError);
        }
      }
    }
  }

  /**
   * Get a specific document by ID
   */
  static getDocument(id: string): LocalDocument | null {
    const docs = this.getAllDocuments();
    return docs.find(d => d.id === id) || null;
  }

  /**
   * Delete a document
   */
  static deleteDocument(id: string): void {
    const docs = this.getAllDocuments();
    const filtered = docs.filter(d => d.id !== id);
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(filtered));
    
    // If this was the current document, clear it
    const currentId = localStorage.getItem(this.CURRENT_DOC_KEY);
    if (currentId === id) {
      localStorage.removeItem(this.CURRENT_DOC_KEY);
    }
  }

  /**
   * Create a new document
   */
  static createNewDocument(): LocalDocument {
    const now = new Date().toISOString();
    const id = `doc_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    return {
      id,
      title: 'Untitled Document',
      content: '',
      created_at: now,
      updated_at: now,
      word_count: 0,
      character_count: 0,
      is_hashed: false
    };
  }

  /**
   * Get current document ID
   */
  static getCurrentDocumentId(): string | null {
    return localStorage.getItem(this.CURRENT_DOC_KEY);
  }

  /**
   * Set current document ID
   */
  static setCurrentDocumentId(id: string): void {
    localStorage.setItem(this.CURRENT_DOC_KEY, id);
  }

  /**
   * Auto-save content (throttled)
   */
  private static autoSaveTimer: NodeJS.Timeout | null = null;
  
  static autoSave(docId: string, content: string, title?: string): void {
    // Clear existing timer
    if (this.autoSaveTimer) {
      clearTimeout(this.autoSaveTimer);
    }
    
    // Set new timer for debounced save
    this.autoSaveTimer = setTimeout(() => {
      const doc = this.getDocument(docId) || this.createNewDocument();
      
      // Calculate word and character counts
      const text = this.stripHtml(content);
      const words = text.trim().split(/\s+/).filter(w => w.length > 0).length;
      const chars = text.length;
      
      // Extract title from first line if not provided
      if (!title) {
        const firstLine = text.split('\n')[0]?.trim();
        title = firstLine?.substring(0, 100) || 'Untitled Document';
      }
      
      this.saveDocument({
        ...doc,
        id: docId,
        title,
        content,
        word_count: words,
        character_count: chars,
        updated_at: new Date().toISOString()
      });
    }, 1000); // Save after 1 second of inactivity
  }

  /**
   * Strip HTML tags for text analysis
   */
  private static stripHtml(html: string): string {
    const tmp = document.createElement('DIV');
    tmp.innerHTML = html;
    return tmp.textContent || tmp.innerText || '';
  }

  /**
   * Clean up old documents to free space
   */
  private static cleanupOldDocuments(): void {
    const docs = this.getAllDocuments();
    // Keep only the 10 most recent documents
    const toKeep = docs.slice(0, 10);
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(toKeep));
  }

  /**
   * Export document as file
   */
  static exportDocument(doc: LocalDocument, format: 'txt' | 'html' | 'md' = 'txt'): void {
    let content = doc.content;
    let mimeType = 'text/plain';
    let extension = 'txt';
    
    if (format === 'html') {
      content = `<!DOCTYPE html>
<html>
<head>
  <title>${doc.title}</title>
  <meta charset="utf-8">
</head>
<body>
  <h1>${doc.title}</h1>
  ${content}
  <footer>
    <p>Created: ${new Date(doc.created_at).toLocaleString()}</p>
    <p>Updated: ${new Date(doc.updated_at).toLocaleString()}</p>
    ${doc.is_hashed ? `<p>Hash: ${doc.hash}</p>` : ''}
  </footer>
</body>
</html>`;
      mimeType = 'text/html';
      extension = 'html';
    } else if (format === 'md') {
      // Convert HTML to markdown (simplified)
      content = this.htmlToMarkdown(content);
      content = `# ${doc.title}\n\n${content}\n\n---\n\nCreated: ${new Date(doc.created_at).toLocaleString()}\nUpdated: ${new Date(doc.updated_at).toLocaleString()}${doc.is_hashed ? `\nHash: ${doc.hash}` : ''}`;
      mimeType = 'text/markdown';
      extension = 'md';
    } else {
      // Plain text
      content = this.stripHtml(content);
      content = `${doc.title}\n${'='.repeat(doc.title.length)}\n\n${content}\n\n---\nCreated: ${new Date(doc.created_at).toLocaleString()}\nUpdated: ${new Date(doc.updated_at).toLocaleString()}${doc.is_hashed ? `\nHash: ${doc.hash}` : ''}`;
    }
    
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${doc.title.replace(/[^a-z0-9]/gi, '_')}.${extension}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  /**
   * Simple HTML to Markdown converter
   */
  private static htmlToMarkdown(html: string): string {
    let md = html;
    
    // Convert headers
    md = md.replace(/<h1[^>]*>(.*?)<\/h1>/gi, '# $1\n');
    md = md.replace(/<h2[^>]*>(.*?)<\/h2>/gi, '## $1\n');
    md = md.replace(/<h3[^>]*>(.*?)<\/h3>/gi, '### $1\n');
    
    // Convert bold and italic
    md = md.replace(/<strong[^>]*>(.*?)<\/strong>/gi, '**$1**');
    md = md.replace(/<b[^>]*>(.*?)<\/b>/gi, '**$1**');
    md = md.replace(/<em[^>]*>(.*?)<\/em>/gi, '*$1*');
    md = md.replace(/<i[^>]*>(.*?)<\/i>/gi, '*$1*');
    
    // Convert links
    md = md.replace(/<a[^>]+href="([^"]*)"[^>]*>(.*?)<\/a>/gi, '[$2]($1)');
    
    // Convert line breaks and paragraphs
    md = md.replace(/<br[^>]*>/gi, '\n');
    md = md.replace(/<p[^>]*>(.*?)<\/p>/gi, '$1\n\n');
    
    // Remove remaining HTML tags
    md = md.replace(/<[^>]+>/g, '');
    
    // Clean up multiple newlines
    md = md.replace(/\n{3,}/g, '\n\n');
    
    return md.trim();
  }
}