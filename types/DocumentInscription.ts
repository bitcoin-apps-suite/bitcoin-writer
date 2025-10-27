/**
 * Document Inscription Types for Bitcoin Writer Work Tree
 * 
 * These types define the structure for git-style versioning with blockchain integration
 */

export interface DocumentInscriptionMetadata {
  title: string;
  author: string;
  authorHandle?: string;
  version: number;
  previousInscriptionId?: string;
  genesisInscriptionId?: string;
  contentType: string;
  contentHash: string;
  wordCount: number;
  characterCount: number;
  createdAt: number;
  inscribedAt?: number;
  isPublished: boolean;
  isPaid: boolean;
  description?: string;
  genre?: string;
  tags?: string[];
  branchName?: string;
  parentVersion?: number;
  isBranch?: boolean;
  shareTokens?: {
    totalSupply: number;
    symbol: string;
    pricePerShare: number;
    availableShares: number;
  };
  blockchainProtocol?: string;
  blockchainReference?: string;
  bicoUrl?: string;
  storageCost?: number;
}

export interface DocumentInscription {
  localId: string;
  inscriptionId?: string;
  txId?: string;
  ordinalNumber?: number;
  satoshiNumber?: number;
  content: string;
  metadata: DocumentInscriptionMetadata;
  status: 'draft' | 'pending' | 'inscribed' | 'failed';
  estimatedFee?: number;
  inscriptionFee?: number;
  error?: string;
}

export interface DocumentVersionChain {
  documentId: string;
  versions: DocumentInscription[];
  genesisInscription?: DocumentInscription;
  latestPublishedVersion?: DocumentInscription;
  isValid: boolean;
  lastVerified: number;
  totalVersions: number;
  totalWordCount: number;
  creationSpan: number;
  publishedVersions: DocumentInscription[];
}

export interface InscriptionConfig {
  network: 'mainnet' | 'testnet';
  feeRate: number;
  compressionEnabled: boolean;
  metadataInContent: boolean;
  autoCreateShares: boolean;
  defaultShareCount: number;
}

export interface InscriptionProgress {
  stage: 'preparing' | 'signing' | 'broadcasting' | 'confirming' | 'confirmed';
  progress: number;
  message: string;
  txId?: string;
}

export interface InscriptionError {
  code: string;
  message: string;
  details?: any;
}