import { useState, useEffect, useCallback } from 'react';
import { IntegratedWorkTreeService } from '../services/IntegratedWorkTreeService';
import { BlockchainDocumentService } from '../services/BlockchainDocumentService';
import { 
  DocumentInscription, 
  DocumentVersionChain, 
  InscriptionProgress,
  InscriptionError
} from '../types/DocumentInscription';

/**
 * Integrated Work Tree Hook
 * 
 * This hook provides a complete Work Tree experience with blockchain integration:
 * - Git-style versioning with visual tree
 * - Real blockchain storage via BSV protocols 
 * - Share token creation
 * - Version integrity verification
 * - Cross-session persistence
 */
export function useIntegratedWorkTree(
  documentId: string,
  blockchainService: BlockchainDocumentService | null
) {
  const [workTreeService, setWorkTreeService] = useState<IntegratedWorkTreeService | null>(null);
  const [versionChain, setVersionChain] = useState<DocumentVersionChain | null>(null);
  const [currentHead, setCurrentHead] = useState<DocumentInscription | null>(null);
  const [isOperating, setIsOperating] = useState(false);
  const [progress, setProgress] = useState<InscriptionProgress | null>(null);
  const [error, setError] = useState<InscriptionError | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);

  // Initialize service when blockchain service is available
  useEffect(() => {
    if (blockchainService && !workTreeService) {
      const service = new IntegratedWorkTreeService(blockchainService);
      
      // Set up event listeners
      service.on('progress', setProgress);
      service.on('error', setError);
      
      // Initialize and load existing data
      service.initialize().then(() => {
        setWorkTreeService(service);
        setIsInitialized(true);
        console.log('IntegratedWorkTreeService initialized');
      });

      return () => {
        service.removeAllListeners();
      };
    }
  }, [blockchainService, workTreeService]);

  // Load version chain when service is ready
  useEffect(() => {
    if (workTreeService && documentId && isInitialized) {
      const chain = workTreeService.getVersionChain(documentId);
      setVersionChain(chain);
      
      // Set HEAD to latest version
      if (chain && chain.versions.length > 0) {
        const latest = chain.versions[chain.versions.length - 1];
        setCurrentHead(latest);
      }
    }
  }, [workTreeService, documentId, isInitialized]);

  /**
   * Create a new version with optional blockchain storage
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
    },
    options: {
      storeOnBlockchain?: boolean;
      protocol?: 'auto' | 'B' | 'D' | 'Bcat';
      encrypt?: boolean;
      createShares?: boolean;
      shareOptions?: {
        totalShares: number;
        pricePerShare: number;
      };
    } = {}
  ): Promise<DocumentInscription> => {
    
    if (!workTreeService) {
      throw new Error('Work Tree service not initialized');
    }

    setIsOperating(true);
    setError(null);
    setProgress(null);

    try {
      const result = await workTreeService.createVersionWithBlockchain(
        documentId,
        content,
        metadata,
        options
      );

      // Update local state
      const updatedChain = workTreeService.getVersionChain(documentId);
      setVersionChain(updatedChain);
      setCurrentHead(result.inscription);

      console.log('Work Tree version created:', {
        version: result.inscription.metadata.version,
        blockchain: !!result.blockchainResult,
        protocol: result.blockchainResult?.protocol
      });

      return result.inscription;

    } catch (err) {
      const error: InscriptionError = {
        code: 'CREATE_ERROR',
        message: err instanceof Error ? err.message : 'Failed to create version',
        details: err
      };
      setError(error);
      throw err;
    } finally {
      setIsOperating(false);
    }
  }, [workTreeService, documentId]);

  /**
   * Checkout a specific version (restore content)
   */
  const checkoutVersion = useCallback(async (
    versionNumber: number
  ): Promise<{ content: string; inscription: DocumentInscription }> => {
    
    if (!workTreeService) {
      throw new Error('Work Tree service not initialized');
    }

    setIsOperating(true);
    try {
      const result = await workTreeService.checkoutVersion(documentId, versionNumber);
      setCurrentHead(result.inscription);
      return result;
    } finally {
      setIsOperating(false);
    }
  }, [workTreeService, documentId]);

  /**
   * Create a new branch from current HEAD
   */
  const createBranch = useCallback(async (
    branchName: string,
    content: string,
    metadata: Parameters<typeof createVersion>[1]
  ): Promise<DocumentInscription> => {
    
    if (!workTreeService) {
      throw new Error('Work Tree service not initialized');
    }

    const branchMetadata = {
      ...metadata,
      description: `${metadata.description || ''} (Branch: ${branchName})`
    };

    return await workTreeService.createBranch(documentId, branchName, content, branchMetadata);
  }, [workTreeService, documentId]);

  /**
   * Get cost estimates for blockchain storage
   */
  const getCostEstimates = useCallback(async (content: string) => {
    if (!workTreeService) return null;
    return await workTreeService.getCostEstimates(content);
  }, [workTreeService]);

  /**
   * Verify version chain integrity
   */
  const verifyChain = useCallback(async (): Promise<boolean> => {
    if (!workTreeService) return false;
    
    setIsOperating(true);
    try {
      const isValid = await workTreeService.verifyVersionChain(documentId);
      
      // Update chain with verification result
      const updatedChain = workTreeService.getVersionChain(documentId);
      if (updatedChain) {
        updatedChain.isValid = isValid;
        updatedChain.lastVerified = Date.now();
        setVersionChain(updatedChain);
      }
      
      return isValid;
    } finally {
      setIsOperating(false);
    }
  }, [workTreeService, documentId]);

  /**
   * Export version chain for backup
   */
  const exportChain = useCallback((): string | null => {
    if (!workTreeService) return null;
    return workTreeService.exportVersionChain(documentId);
  }, [workTreeService, documentId]);

  /**
   * Import version chain from backup
   */
  const importChain = useCallback(async (jsonData: string): Promise<void> => {
    if (!workTreeService) return;
    
    const imported = await workTreeService.importVersionChain(jsonData);
    setVersionChain(imported);
    
    if (imported.versions.length > 0) {
      setCurrentHead(imported.versions[imported.versions.length - 1]);
    }
  }, [workTreeService]);

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
   * Get all versions
   */
  const getAllVersions = useCallback((): DocumentInscription[] => {
    return versionChain?.versions || [];
  }, [versionChain]);

  /**
   * Get chain statistics
   */
  const getChainStats = useCallback(() => {
    if (!versionChain) return null;

    const publishedCount = versionChain.publishedVersions.length;
    const draftCount = versionChain.totalVersions - publishedCount;
    const inscribedCount = versionChain.versions.filter(v => v.status === 'inscribed').length;
    const averageWordCount = versionChain.totalWordCount / versionChain.totalVersions;
    
    const creationTimespan = versionChain.creationSpan;
    const averageTimeBetweenVersions = creationTimespan / Math.max(1, versionChain.totalVersions - 1);

    return {
      totalVersions: versionChain.totalVersions,
      publishedVersions: publishedCount,
      draftVersions: draftCount,
      inscribedVersions: inscribedCount,
      totalWordCount: versionChain.totalWordCount,
      averageWordCount: Math.round(averageWordCount),
      creationTimespan,
      averageTimeBetweenVersions,
      isChainValid: versionChain.isValid,
      lastVerified: versionChain.lastVerified,
      genesisDate: versionChain.genesisInscription?.metadata.createdAt,
      latestPublishedVersion: versionChain.latestPublishedVersion?.metadata.version,
      hasBlockchainVersions: versionChain.versions.some(v => v.status === 'inscribed')
    };
  }, [versionChain]);

  /**
   * Get global Work Tree statistics
   */
  const getGlobalStats = useCallback(() => {
    if (!workTreeService) return null;
    return workTreeService.getGlobalStats();
  }, [workTreeService]);

  /**
   * Force refresh from persistence
   */
  const refresh = useCallback(() => {
    if (workTreeService && documentId) {
      const chain = workTreeService.getVersionChain(documentId);
      setVersionChain(chain);
      
      if (chain && chain.versions.length > 0) {
        const latest = chain.versions[chain.versions.length - 1];
        setCurrentHead(latest);
      }
    }
  }, [workTreeService, documentId]);

  return {
    // State
    versionChain,
    currentHead,
    isOperating,
    progress,
    error,
    isInitialized,
    isReady: workTreeService?.isReady() || false,
    
    // Actions
    createVersion,
    checkoutVersion,
    createBranch,
    setCurrentHead,
    
    // Utilities
    getCostEstimates,
    verifyChain,
    exportChain,
    importChain,
    refresh,
    
    // Data access
    getVersion,
    getLatestVersion,
    getAllVersions,
    getChainStats,
    getGlobalStats,
    
    // Service access
    workTreeService
  };
}