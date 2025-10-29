import { useState, useEffect, useCallback, useRef } from 'react';
import { IntegratedWorkTreeService } from '../services/IntegratedWorkTreeService';
import { BlockchainDocumentService } from '../services/BlockchainDocumentService';
import { DocumentInscription, DocumentVersionChain } from '../types/DocumentInscription';

interface WorkTreeProgress {
  stage: string;
  progress: number;
  message: string;
  txId?: string;
}

interface WorkTreeError {
  code: string;
  message: string;
  details?: any;
}

export const useIntegratedWorkTree = (documentId: string, blockchainService: BlockchainDocumentService | null) => {
  const [versionChain, setVersionChain] = useState<DocumentVersionChain | null>(null);
  const [isOperating, setIsOperating] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);
  const [progress, setProgress] = useState<WorkTreeProgress | null>(null);
  const [error, setError] = useState<WorkTreeError | null>(null);
  const [currentHead, setCurrentHead] = useState<DocumentInscription | null>(null);

  // Service reference
  const serviceRef = useRef<IntegratedWorkTreeService | null>(null);

  // Initialize the integrated work tree service
  useEffect(() => {
    const initializeService = async () => {
      if (!blockchainService) {
        // Use a mock blockchain service if none provided
        const mockBlockchainService = {
          isReady: () => false,
          getCurrentUser: () => null,
          storeWithBSVProtocols: async () => { throw new Error('Blockchain service not available'); },
          retrieveWithBSVProtocols: async () => { throw new Error('Blockchain service not available'); },
          getProtocolCostEstimates: async () => ({
            b: { cost: 0, supported: false },
            bcat: { cost: 0, supported: false },
            d: { cost: 0, supported: false },
            uhrp: { cost: 0, supported: false },
            recommended: 'B' as const
          })
        } as BlockchainDocumentService;
        
        serviceRef.current = new IntegratedWorkTreeService(mockBlockchainService);
      } else {
        serviceRef.current = new IntegratedWorkTreeService(blockchainService);
      }

      // Set up event listeners
      const service = serviceRef.current;
      service.on('progress', setProgress);
      service.on('error', setError);

      // Initialize the service
      await service.initialize();

      // Load existing version chain
      const existingChain = service.getVersionChain(documentId);
      if (existingChain) {
        setVersionChain(existingChain);
        // Set HEAD to latest version
        if (existingChain.versions.length > 0) {
          setCurrentHead(existingChain.versions[existingChain.versions.length - 1]);
        }
      } else {
        // For testing: Create some demo versions if none exist
        console.log('No existing version chain found, creating demo versions for testing...');
        
        // Create demo versions to test checkout functionality
        try {
          console.log('🌳 Creating demo version 1...');
          const v1Content = 'This is version 1 of the document. Initial draft with basic content.';
          const v1 = await service.createVersionWithBlockchain(
            documentId,
            v1Content,
            {
              title: 'Demo Document v1',
              description: 'Initial version',
              author: 'demo-user',
              authorHandle: 'demo'
            },
            { storeOnBlockchain: false }
          );
          console.log('🌳 Demo v1 created:', { content: v1.inscription.content, length: v1.inscription.content?.length });

          console.log('🌳 Creating demo version 2...');
          const v2Content = 'This is version 2 of the document. Added more content and improved structure. Now we have multiple paragraphs and better formatting.';
          const v2 = await service.createVersionWithBlockchain(
            documentId,
            v2Content,
            {
              title: 'Demo Document v2',
              description: 'Added improvements',
              author: 'demo-user',
              authorHandle: 'demo'
            },
            { storeOnBlockchain: false }
          );
          console.log('🌳 Demo v2 created:', { content: v2.inscription.content, length: v2.inscription.content?.length });

          console.log('🌳 Creating demo version 3...');
          const v3Content = 'This is version 3 of the document. Final version with comprehensive content and formatting. This version includes multiple sections:\n\n1. Introduction\n2. Main content\n3. Conclusion\n\nThis demonstrates the full work tree functionality.';
          const v3 = await service.createVersionWithBlockchain(
            documentId,
            v3Content,
            {
              title: 'Demo Document v3',
              description: 'Final polished version',
              author: 'demo-user',
              authorHandle: 'demo'
            },
            { storeOnBlockchain: false }
          );
          console.log('🌳 Demo v3 created:', { content: v3.inscription.content, length: v3.inscription.content?.length });

          // Load the updated chain
          const updatedChain = service.getVersionChain(documentId);
          if (updatedChain) {
            setVersionChain(updatedChain);
            setCurrentHead(updatedChain.versions[updatedChain.versions.length - 1]);
          }

          console.log('Demo versions created successfully!');
        } catch (error) {
          console.error('Failed to create demo versions:', error);
        }
      }

      setIsInitialized(true);
    };

    initializeService().catch(console.error);

    return () => {
      // Cleanup event listeners
      if (serviceRef.current) {
        serviceRef.current.removeAllListeners();
      }
    };
  }, [documentId, blockchainService]);

  // Create a new version
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
  ) => {
    if (!serviceRef.current) {
      throw new Error('Work Tree service not initialized');
    }

    setIsOperating(true);
    setError(null);
    setProgress(null);

    try {
      const result = await serviceRef.current.createVersionWithBlockchain(
        documentId,
        content,
        metadata,
        options
      );

      // Update version chain
      const updatedChain = serviceRef.current.getVersionChain(documentId);
      if (updatedChain) {
        setVersionChain(updatedChain);
        // Update HEAD to the new version
        setCurrentHead(result.inscription);
      }

      return result.inscription;
    } finally {
      setIsOperating(false);
      setProgress(null);
    }
  }, [documentId]);

  // Create a new branch
  const createBranch = useCallback(async (
    documentId: string,
    branchName: string,
    content: string,
    metadata: {
      title: string;
      description?: string;
      author: string;
      authorHandle?: string;
      branchName?: string;
    }
  ) => {
    if (!serviceRef.current) {
      throw new Error('Work Tree service not initialized');
    }

    setIsOperating(true);
    setError(null);
    setProgress(null);

    try {
      const result = await serviceRef.current.createBranch(
        documentId,
        branchName,
        content,
        metadata
      );

      // Update version chain
      const updatedChain = serviceRef.current.getVersionChain(documentId);
      if (updatedChain) {
        setVersionChain(updatedChain);
        // Update HEAD to the new branch
        setCurrentHead(result);
      }

      return result;
    } finally {
      setIsOperating(false);
      setProgress(null);
    }
  }, []);

  // Checkout a specific version
  const checkoutVersion = useCallback(async (versionNumber: number) => {
    if (!serviceRef.current) {
      throw new Error('Work Tree service not initialized');
    }

    setIsOperating(true);
    setError(null);

    try {
      const result = await serviceRef.current.checkoutVersion(documentId, versionNumber);
      
      // Update HEAD to the checked out version
      setCurrentHead(result.inscription);

      return result;
    } finally {
      setIsOperating(false);
    }
  }, [documentId]);

  // Get chain statistics
  const getChainStats = useCallback(() => {
    if (!versionChain) {
      return null;
    }

    const stats = {
      totalVersions: versionChain.versions.length,
      publishedVersions: versionChain.versions.filter(v => v.metadata.isPublished).length,
      draftVersions: versionChain.versions.filter(v => v.status === 'draft').length,
      inscribedVersions: versionChain.versions.filter(v => v.status === 'inscribed').length,
      totalWordCount: versionChain.versions.reduce((sum, v) => sum + v.metadata.wordCount, 0),
      averageWordCount: versionChain.versions.length > 0 
        ? Math.round(versionChain.versions.reduce((sum, v) => sum + v.metadata.wordCount, 0) / versionChain.versions.length)
        : 0,
      creationTimespan: versionChain.versions.length > 1 
        ? versionChain.versions[versionChain.versions.length - 1].metadata.createdAt - versionChain.versions[0].metadata.createdAt
        : 0,
      isChainValid: versionChain.isValid,
      lastVerified: versionChain.lastVerified,
      genesisDate: versionChain.genesisInscription?.metadata.createdAt
    };

    return stats;
  }, [versionChain]);

  // Verify chain integrity
  const verifyChain = useCallback(async () => {
    if (!serviceRef.current) {
      throw new Error('Work Tree service not initialized');
    }

    setIsOperating(true);
    try {
      const isValid = await serviceRef.current.verifyVersionChain(documentId);
      
      // Update chain with verification result
      if (versionChain) {
        const updatedChain = { ...versionChain, isValid, lastVerified: Date.now() };
        setVersionChain(updatedChain);
      }

      return isValid;
    } finally {
      setIsOperating(false);
    }
  }, [documentId, versionChain]);

  // Get latest version
  const getLatestVersion = useCallback(() => {
    if (!versionChain || versionChain.versions.length === 0) {
      return null;
    }
    return versionChain.versions[versionChain.versions.length - 1];
  }, [versionChain]);

  // Get cost estimates
  const getCostEstimates = useCallback(async (content: string) => {
    if (!serviceRef.current) {
      throw new Error('Work Tree service not initialized');
    }

    return await serviceRef.current.getCostEstimates(content);
  }, []);

  // Check if ready for blockchain operations
  const isReady = useCallback(() => {
    return serviceRef.current?.isReady() || false;
  }, []);

  return {
    versionChain,
    isOperating,
    isInitialized,
    progress,
    error,
    currentHead,
    setCurrentHead,
    createVersion,
    createBranch,
    checkoutVersion,
    getChainStats,
    verifyChain,
    getLatestVersion,
    getCostEstimates,
    isReady
  };
};