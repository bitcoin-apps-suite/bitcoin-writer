import { bsv } from 'scrypt-ts';
import CryptoJS from 'crypto-js';
import { HandCashService, HandCashUser } from './HandCashService';

export interface DocumentData {
  id: string;
  title: string;
  content: string;
  owner: string;
  publicKey?: string;
  lastUpdated: number;
  wordCount: number;
  charCount: number;
  encrypted: boolean;
}

export interface DocumentMetadata {
  id: string;
  title: string;
  lastUpdated: number;
  wordCount: number;
  charCount: number;
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
  async createDocument(title: string, content: string = ''): Promise<DocumentData> {
    if (!this.isConnected || !this.currentUser) {
      throw new Error('User not authenticated');
    }

    const documentId = `doc_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const encryptedContent = this.encryptContent(content);
    
    const document: DocumentData = {
      id: documentId,
      title,
      content: encryptedContent,
      owner: this.currentUser.handle,
      publicKey: this.currentUser.publicKey,
      lastUpdated: Date.now(),
      wordCount: this.countWords(content),
      charCount: this.countCharacters(content),
      encrypted: true
    };

    // In production, this would create an encrypted on-chain record
    console.log('Creating encrypted document on Bitcoin:', {
      id: document.id,
      title: document.title,
      owner: document.owner,
      contentLength: content.length
    });

    // Store document metadata locally for quick access
    this.storeDocumentMetadata(document);

    // Simulate blockchain transaction delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    return document;
  }

  // Update an existing document
  async updateDocument(documentId: string, title: string, content: string): Promise<void> {
    if (!this.isConnected || !this.currentUser) {
      throw new Error('User not authenticated');
    }

    const encryptedContent = this.encryptContent(content);
    
    const updatedDocument: DocumentData = {
      id: documentId,
      title,
      content: encryptedContent,
      owner: this.currentUser.handle,
      publicKey: this.currentUser.publicKey,
      lastUpdated: Date.now(),
      wordCount: this.countWords(content),
      charCount: this.countCharacters(content),
      encrypted: true
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

  // Get list of user's documents (metadata only)
  async getDocumentList(): Promise<DocumentMetadata[]> {
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
      return JSON.parse(storedMetadata);
    } catch (error) {
      console.error('Failed to parse document metadata:', error);
      return [];
    }
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
    let metadata: DocumentMetadata[] = [];
    
    try {
      const existing = localStorage.getItem(metadataKey);
      if (existing) {
        metadata = JSON.parse(existing);
      }
    } catch (error) {
      console.error('Failed to parse existing metadata:', error);
    }
    
    // Update or add document metadata
    const existingIndex = metadata.findIndex(m => m.id === document.id);
    const newMetadata: DocumentMetadata = {
      id: document.id,
      title: document.title,
      lastUpdated: document.lastUpdated,
      wordCount: document.wordCount,
      charCount: document.charCount
    };
    
    if (existingIndex >= 0) {
      metadata[existingIndex] = newMetadata;
    } else {
      metadata.push(newMetadata);
    }
    
    // Sort by last updated (newest first)
    metadata.sort((a, b) => b.lastUpdated - a.lastUpdated);
    
    localStorage.setItem(metadataKey, JSON.stringify(metadata));
    
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
        let metadata: DocumentMetadata[] = JSON.parse(existing);
        metadata = metadata.filter(m => m.id !== documentId);
        localStorage.setItem(metadataKey, JSON.stringify(metadata));
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