import { bsv } from 'scrypt-ts';
import CryptoJS from 'crypto-js';
import { HandCashService, HandCashUser } from './HandCashService';

export interface DocumentData {
  id: string;
  title: string;
  content: string;
  metadata: DocumentMetadata;
}

export interface DocumentMetadata {
  created_at: string;
  updated_at: string;
  author: string;
  encrypted: boolean;
  word_count: number;
  character_count: number;
  storage_method?: string;
  blockchain_tx?: string;
  storage_cost?: number;
}

export interface BlockchainDocument {
  id: string;
  title: string;
  content?: string;
  preview?: string;
  created_at: string;
  updated_at: string;
  author?: string;
  encrypted?: boolean;
  word_count?: number;
  character_count?: number;
  storage_method?: string;
  blockchain_tx?: string;
  storage_cost?: number;
}

export class BlockchainDocumentService {
  private handcashService: HandCashService;
  private encryptionKey: string | null = null;
  private isConnected: boolean = false;
  private currentUser: HandCashUser | null = null;

  constructor(handcashService: HandCashService) {
    this.handcashService = handcashService;
    this.initialize();
  }

  // Initialize the service
  private async initialize(): Promise<void> {
    try {
      if (this.handcashService.isAuthenticated()) {
        this.currentUser = this.handcashService.getCurrentUser();
        this.generateEncryptionKey();
        this.isConnected = true;
        console.log('BlockchainDocumentService initialized for user:', this.currentUser?.handle);
      }
    } catch (error) {
      console.error('Failed to initialize blockchain document service:', error);
    }
  }

  // Generate encryption key from user's authentication
  private generateEncryptionKey(): void {
    const accessToken = this.handcashService.getAccessToken();
    if (accessToken && this.currentUser) {
      // Create a deterministic encryption key from the user's access token and handle
      const keyData = `${this.currentUser.handle}_${accessToken.substring(0, 32)}`;
      this.encryptionKey = CryptoJS.SHA256(keyData).toString();
      console.log('Encryption key generated for user:', this.currentUser.handle);
    }
  }

  // Encrypt document content before storing on-chain
  private encryptContent(content: string): string {
    if (!this.encryptionKey) {
      throw new Error('No encryption key available');
    }
    return CryptoJS.AES.encrypt(content, this.encryptionKey).toString();
  }

  // Decrypt document content retrieved from chain
  private decryptContent(encryptedContent: string): string {
    if (!this.encryptionKey) {
      throw new Error('No encryption key available');
    }
    try {
      const bytes = CryptoJS.AES.decrypt(encryptedContent, this.encryptionKey);
      return bytes.toString(CryptoJS.enc.Utf8);
    } catch (error) {
      console.error('Failed to decrypt content:', error);
      throw new Error('Failed to decrypt document - invalid key or corrupted data');
    }
  }

  // Count words in text
  private countWords(text: string): number {
    if (!text || text.trim() === '') return 0;
    return text.trim().split(/\s+/).length;
  }

  // Count characters in text
  private countCharacters(text: string): number {
    return text.length;
  }

  // Create a new document
  async createDocument(title: string, content: string = '', storageMethod?: string): Promise<DocumentData> {
    if (!this.isConnected || !this.currentUser) {
      throw new Error('User not authenticated');
    }

    const documentId = `doc_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const encryptedContent = this.encryptContent(content);
    const now = new Date().toISOString();
    
    const document: DocumentData = {
      id: documentId,
      title,
      content: encryptedContent,
      metadata: {
        created_at: now,
        updated_at: now,
        author: this.currentUser.handle,
        encrypted: true,
        word_count: this.countWords(content),
        character_count: this.countCharacters(content),
        storage_method: storageMethod || 'op_return',
        blockchain_tx: `tx_${documentId}`,
        storage_cost: 0.000001 * this.countCharacters(content) * 2
      }
    };

    // In production, this would create an encrypted on-chain record
    console.log('Creating encrypted document on Bitcoin:', {
      id: document.id,
      title: document.title,
      author: document.metadata.author,
      contentLength: content.length,
      storageMethod: document.metadata.storage_method
    });

    // Store document metadata locally for quick access
    this.storeDocumentMetadata(document);

    // Simulate blockchain transaction delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    return document;
  }

  // Update an existing document
  async updateDocument(documentId: string, title: string, content: string, storageMethod?: string): Promise<void> {
    if (!this.isConnected || !this.currentUser) {
      throw new Error('User not authenticated');
    }

    const encryptedContent = this.encryptContent(content);
    const existingDoc = await this.getDocument(documentId);
    
    const updatedDocument: DocumentData = {
      id: documentId,
      title,
      content: encryptedContent,
      metadata: {
        created_at: existingDoc?.metadata.created_at || new Date().toISOString(),
        updated_at: new Date().toISOString(),
        author: this.currentUser.handle,
        encrypted: true,
        word_count: this.countWords(content),
        character_count: this.countCharacters(content),
        storage_method: storageMethod || existingDoc?.metadata.storage_method || 'op_return',
        blockchain_tx: existingDoc?.metadata.blockchain_tx || `tx_${documentId}`,
        storage_cost: existingDoc?.metadata.storage_cost || (0.000001 * this.countCharacters(content) * 2)
      }
    };

    // In production, this would update the encrypted on-chain record
    console.log('Updating encrypted document on Bitcoin:', {
      id: documentId,
      title,
      owner: this.currentUser.handle,
      contentLength: content.length
    });

    // Update local metadata
    this.storeDocumentMetadata(updatedDocument);

    // Simulate blockchain transaction delay
    await new Promise(resolve => setTimeout(resolve, 500));
  }

  // Retrieve a document by ID
  async getDocument(documentId: string): Promise<DocumentData | null> {
    if (!this.isConnected || !this.currentUser) {
      throw new Error('User not authenticated');
    }

    console.log('Retrieving document from Bitcoin:', documentId);

    // In production, this would retrieve from blockchain
    // For now, we'll simulate with localStorage
    const storedDoc = localStorage.getItem(`doc_${this.currentUser.handle}_${documentId}`);
    
    if (!storedDoc) {
      return null;
    }

    try {
      const document: DocumentData = JSON.parse(storedDoc);
      
      // Decrypt the content
      const decryptedContent = this.decryptContent(document.content);
      
      return {
        ...document,
        content: decryptedContent
      };
    } catch (error) {
      console.error('Failed to retrieve document:', error);
      return null;
    }
  }

  // Get list of user's documents
  async getDocuments(): Promise<BlockchainDocument[]> {
    if (!this.isConnected || !this.currentUser) {
      throw new Error('User not authenticated');
    }

    // In production, this would query blockchain for user's documents
    console.log('Retrieving document list for user:', this.currentUser.handle);

    const metadataKey = `docs_metadata_${this.currentUser.handle}`;
    const storedMetadata = localStorage.getItem(metadataKey);
    
    if (!storedMetadata) {
      return [];
    }

    try {
      const documents: BlockchainDocument[] = JSON.parse(storedMetadata);
      return documents;
    } catch (error) {
      console.error('Failed to parse document metadata:', error);
      return [];
    }
  }

  // Get list of user's documents (metadata only) - deprecated, use getDocuments
  async getDocumentList(): Promise<DocumentMetadata[]> {
    const documents = await this.getDocuments();
    return documents.map(doc => ({
      created_at: doc.created_at,
      updated_at: doc.updated_at,
      author: doc.author || '',
      encrypted: doc.encrypted || false,
      word_count: doc.word_count || 0,
      character_count: doc.character_count || 0,
      storage_method: doc.storage_method,
      blockchain_tx: doc.blockchain_tx,
      storage_cost: doc.storage_cost
    }));
  }

  // Store document in localStorage (simulating blockchain storage)
  private async storeDocument(document: DocumentData): Promise<void> {
    if (!this.currentUser) return;
    
    const key = `doc_${this.currentUser.handle}_${document.id}`;
    localStorage.setItem(key, JSON.stringify(document));
  }

  // Store document metadata for quick listing
  private storeDocumentMetadata(document: DocumentData): void {
    if (!this.currentUser) return;
    
    const metadataKey = `docs_metadata_${this.currentUser.handle}`;
    let documents: BlockchainDocument[] = [];
    
    try {
      const existing = localStorage.getItem(metadataKey);
      if (existing) {
        documents = JSON.parse(existing);
      }
    } catch (error) {
      console.error('Failed to parse existing metadata:', error);
    }
    
    // Update or add document
    const existingIndex = documents.findIndex(d => d.id === document.id);
    
    // Decrypt content for preview (first 200 chars)
    let preview = '';
    try {
      const decryptedContent = this.decryptContent(document.content);
      preview = decryptedContent.substring(0, 200).replace(/\n/g, ' ');
    } catch (error) {
      console.error('Failed to decrypt for preview:', error);
      preview = '';
    }
    
    const newDoc: BlockchainDocument = {
      id: document.id,
      title: document.title,
      preview,
      created_at: document.metadata.created_at,
      updated_at: document.metadata.updated_at,
      author: document.metadata.author,
      encrypted: document.metadata.encrypted,
      word_count: document.metadata.word_count,
      character_count: document.metadata.character_count,
      storage_method: document.metadata.storage_method,
      blockchain_tx: document.metadata.blockchain_tx,
      storage_cost: document.metadata.storage_cost
    };
    
    if (existingIndex >= 0) {
      documents[existingIndex] = newDoc;
    } else {
      documents.push(newDoc);
    }
    
    // Sort by last updated (newest first)
    documents.sort((a, b) => 
      new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime()
    );
    
    localStorage.setItem(metadataKey, JSON.stringify(documents));
    
    // Also store the full document
    this.storeDocument(document);
  }

  // Delete a document
  async deleteDocument(documentId: string): Promise<void> {
    if (!this.isConnected || !this.currentUser) {
      throw new Error('User not authenticated');
    }

    // In production, this would mark the document as deleted on blockchain
    console.log('Deleting document from Bitcoin:', documentId);

    // Remove from localStorage
    const docKey = `doc_${this.currentUser.handle}_${documentId}`;
    localStorage.removeItem(docKey);

    // Remove from metadata
    const metadataKey = `docs_metadata_${this.currentUser.handle}`;
    try {
      const existing = localStorage.getItem(metadataKey);
      if (existing) {
        let documents: BlockchainDocument[] = JSON.parse(existing);
        documents = documents.filter(d => d.id !== documentId);
        localStorage.setItem(metadataKey, JSON.stringify(documents));
      }
    } catch (error) {
      console.error('Failed to update metadata after deletion:', error);
    }

    // Simulate blockchain transaction delay
    await new Promise(resolve => setTimeout(resolve, 500));
  }

  // Check if service is connected and ready
  isReady(): boolean {
    return this.isConnected && this.currentUser !== null && this.encryptionKey !== null;
  }

  // Get current user
  getCurrentUser(): HandCashUser | null {
    return this.currentUser;
  }

  // Reconnect after authentication
  async reconnect(): Promise<void> {
    await this.initialize();
  }
}