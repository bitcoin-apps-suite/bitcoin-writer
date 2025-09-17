// Document Inscription Types for Bitcoin Ordinals
export interface DocumentInscriptionMetadata {
  // Basic document info
  title: string;
  description?: string;
  author: string;           // Bitcoin address or public key
  authorHandle?: string;    // Human readable handle
  
  // Version chain info
  version: number;          // 1, 2, 3, etc.
  previousInscriptionId?: string;  // Link to previous version
  genesisInscriptionId?: string;   // Link to first version
  
  // Content info
  contentType: 'text/plain' | 'text/html' | 'text/markdown' | 'application/json';
  contentHash: string;      // SHA256 hash of content for integrity
  wordCount: number;
  characterCount: number;
  
  // Timestamps
  createdAt: number;        // Unix timestamp when version was created
  inscribedAt?: number;     // Unix timestamp when inscribed to Bitcoin
  
  // Publishing & monetization
  isPublished: boolean;
  isPaid: boolean;          // Whether this is premium content
  shareTokens?: {
    totalSupply: number;
    symbol: string;         // e.g., "BOOK001"
    pricePerShare: number;  // In satoshis
    availableShares: number;
  };
  
  // Content categorization
  genre?: string;
  tags?: string[];
  language?: string;
  
  // Chain of custody
  signature?: string;       // Author's signature of content hash
  publicKey?: string;       // Author's public key for verification
}

export interface DocumentInscription {
  // Ordinal info
  inscriptionId?: string;   // Will be set after inscription
  ordinalNumber?: number;   // Ordinal number assigned by Bitcoin
  satoshiNumber?: number;   // Specific satoshi this is inscribed on
  
  // Content
  content: string;          // The actual document content
  metadata: DocumentInscriptionMetadata;
  
  // Transaction info
  txId?: string;           // Bitcoin transaction ID
  outputIndex?: number;    // Output index in transaction
  
  // Local tracking
  localId: string;         // Local UUID for tracking before inscription
  status: 'draft' | 'pending' | 'inscribed' | 'failed';
  
  // Cost tracking
  inscriptionFee?: number; // Cost in satoshis to inscribe
  estimatedFee?: number;   // Estimated cost before inscription
}

export interface DocumentVersionChain {
  documentId: string;           // Local document ID
  genesisInscription?: DocumentInscription;
  versions: DocumentInscription[];
  
  // Chain verification
  isValid: boolean;            // Whether the chain is cryptographically valid
  lastVerified: number;        // When chain was last verified
  
  // Aggregated stats
  totalVersions: number;
  totalWordCount: number;
  creationSpan: number;        // Time between first and last version
  
  // Publishing status
  publishedVersions: DocumentInscription[];
  latestPublishedVersion?: DocumentInscription;
}

export interface InscriptionError {
  code: 'INSUFFICIENT_FUNDS' | 'INVALID_CONTENT' | 'NETWORK_ERROR' | 'SIGNATURE_FAILED';
  message: string;
  details?: any;
}

export interface InscriptionProgress {
  stage: 'preparing' | 'signing' | 'broadcasting' | 'confirming' | 'confirmed';
  progress: number;        // 0-100
  message: string;
  txId?: string;
  estimatedConfirmTime?: number;
}

// Configuration for inscription creation
export interface InscriptionConfig {
  network: 'mainnet' | 'testnet' | 'regtest';
  feeRate: number;         // Satoshis per byte
  compressionEnabled: boolean;
  metadataInContent: boolean;  // Whether to embed metadata in content
  autoCreateShares: boolean;   // Auto-create share tokens
  defaultShareCount: number;   // Default number of shares to create
}