import { useState, useEffect, useCallback } from 'react';
import { DocumentInscriptionService } from '../services/DocumentInscriptionService';
import { 
  DocumentInscription, 
  DocumentVersionChain, 
  InscriptionConfig,
  InscriptionProgress,
  InscriptionError
} from '../types/DocumentInscription';

// Default configuration for Bitcoin mainnet
const defaultConfig: InscriptionConfig = {
  network: 'mainnet',
  feeRate: 10, // 10 sats/byte
  compressionEnabled: true,
  metadataInContent: true,
  autoCreateShares: false,
  defaultShareCount: 1000
};

export function useDocumentVersioning(documentId: string) {
  const [inscriptionService] = useState(() => new DocumentInscriptionService(defaultConfig));
  const [versionChain, setVersionChain] = useState<DocumentVersionChain | null>(null);
  const [isInscribing, setIsInscribing] = useState(false);
  const [inscriptionProgress, setInscriptionProgress] = useState<InscriptionProgress | null>(null);
  const [inscriptionError, setInscriptionError] = useState<InscriptionError | null>(null);
  
  // Load existing version chain
  useEffect(() => {
    const chain = inscriptionService.getVersionChain(documentId);
    setVersionChain(chain || null);
  }, [documentId, inscriptionService]);

  // Listen to inscription events
  useEffect(() => {
    const handleProgress = (progress: InscriptionProgress) => {
      setInscriptionProgress(progress);
    };

    const handleError = (error: InscriptionError) => {
      setInscriptionError(error);
      setIsInscribing(false);
    };

    inscriptionService.on('progress', handleProgress);
    inscriptionService.on('error', handleError);

    return () => {
      inscriptionService.off('progress', handleProgress);
      inscriptionService.off('error', handleError);
    };
  }, [inscriptionService]);

  /**
   * Create a new document version
   */
  const createVersion = useCallback(async (
    content: string,
    metadata: {
      title: string;
      description?: string;
      author: string;
      authorHandle?: string;
      genre?: string;
      tags?: string[];
      isPublished?: boolean;
      isPaid?: boolean;
    }
  ): Promise<DocumentInscription> => {
    
    // Get the latest version to link to
    const latestVersion = versionChain?.versions[versionChain.versions.length - 1];
    
    // Create new inscription
    const inscription = await inscriptionService.createDocumentInscription(
      content,
      metadata,
      latestVersion
    );

    // Update version chain
    const updatedChain = inscriptionService.createVersionChain(documentId, inscription);
    setVersionChain(updatedChain);

    return inscription;
  }, [documentId, inscriptionService, versionChain]);

  /**
   * Inscribe a version to Bitcoin blockchain
   */
  const inscribeVersion = useCallback(async (
    inscription: DocumentInscription,
    privateKey: string
  ): Promise<DocumentInscription> => {
    
    setIsInscribing(true);
    setInscriptionError(null);
    setInscriptionProgress(null);

    try {
      const inscribedVersion = await inscriptionService.inscribeDocument(inscription, privateKey);
      
      // Update the version chain
      const updatedChain = inscriptionService.createVersionChain(documentId, inscribedVersion);
      setVersionChain(updatedChain);
      
      setIsInscribing(false);
      return inscribedVersion;
      
    } catch (error) {
      setIsInscribing(false);
      throw error;
    }
  }, [documentId, inscriptionService]);

  /**
   * Create and immediately inscribe a new version
   */
  const createAndInscribeVersion = useCallback(async (
    content: string,
    metadata: Parameters<typeof createVersion>[1],
    privateKey: string
  ): Promise<DocumentInscription> => {
    
    const inscription = await createVersion(content, metadata);
    return await inscribeVersion(inscription, privateKey);
    
  }, [createVersion, inscribeVersion]);

  /**
   * Verify the integrity of the current version chain
   */
  const verifyChain = useCallback(async (): Promise<boolean> => {
    if (!versionChain) return false;
    
    const isValid = await inscriptionService.verifyVersionChain(versionChain);
    
    // Update chain with verification result
    setVersionChain(prev => prev ? { ...prev, isValid } : null);
    
    return isValid;
  }, [inscriptionService, versionChain]);

  /**
   * Get chain statistics
   */
  const getChainStats = useCallback(() => {
    if (!versionChain) return null;

    const publishedCount = versionChain.publishedVersions.length;
    const draftCount = versionChain.totalVersions - publishedCount;
    const averageWordCount = versionChain.totalWordCount / versionChain.totalVersions;
    
    const creationTimespan = versionChain.creationSpan;
    const averageTimeBetweenVersions = creationTimespan / Math.max(1, versionChain.totalVersions - 1);

    return {
      totalVersions: versionChain.totalVersions,
      publishedVersions: publishedCount,
      draftVersions: draftCount,
      totalWordCount: versionChain.totalWordCount,
      averageWordCount: Math.round(averageWordCount),
      creationTimespan,
      averageTimeBetweenVersions,
      isChainValid: versionChain.isValid,
      lastVerified: versionChain.lastVerified,
      genesisDate: versionChain.genesisInscription?.metadata.createdAt,
      latestPublishedVersion: versionChain.latestPublishedVersion?.metadata.version
    };
  }, [versionChain]);

  /**
   * Export version chain for backup
   */
  const exportChain = useCallback((): string | null => {
    return inscriptionService.exportVersionChain(documentId);
  }, [inscriptionService, documentId]);

  /**
   * Get version by number
   */
  const getVersion = useCallback((versionNumber: number): DocumentInscription | null => {
    if (!versionChain) return null;
    return versionChain.versions.find(v => v.metadata.version === versionNumber) || null;
  }, [versionChain]);

  /**
   * Get latest version
   */
  const getLatestVersion = useCallback((): DocumentInscription | null => {
    if (!versionChain || versionChain.versions.length === 0) return null;
    return versionChain.versions[versionChain.versions.length - 1];
  }, [versionChain]);

  /**
   * Get all published versions
   */
  const getPublishedVersions = useCallback((): DocumentInscription[] => {
    return versionChain?.publishedVersions || [];
  }, [versionChain]);

  /**
   * Create share tokens for a version
   */
  const createShareTokens = useCallback(async (
    inscription: DocumentInscription,
    totalShares: number,
    pricePerShare: number
  ): Promise<string[]> => {
    
    const shareIds = await inscriptionService.createShareTokens(
      inscription, 
      totalShares, 
      pricePerShare
    );

    // Update the version chain to reflect the share creation
    const updatedChain = inscriptionService.createVersionChain(documentId, inscription);
    setVersionChain(updatedChain);

    return shareIds;
  }, [documentId, inscriptionService]);

  return {
    // State
    versionChain,
    isInscribing,
    inscriptionProgress,
    inscriptionError,
    
    // Actions
    createVersion,
    inscribeVersion,
    createAndInscribeVersion,
    createShareTokens,
    
    // Verification
    verifyChain,
    
    // Data access
    getVersion,
    getLatestVersion,
    getPublishedVersions,
    getChainStats,
    
    // Utilities
    exportChain,
    
    // Service access (for advanced usage)
    inscriptionService
  };
}