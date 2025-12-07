import { useEffect, useRef, useState, useCallback } from 'react';
import type Quill from 'quill';
import { KVStoreQuillIntegration, KVStoreConfig } from '../lib/kvstore-quill-integration';

export interface UseKVStoreQuillOptions extends Partial<KVStoreConfig> {
  documentKey?: string;
  loadOnMount?: boolean;
}

export interface UseKVStoreQuillReturn {
  integration: KVStoreQuillIntegration | null;
  isLoading: boolean;
  isSaving: boolean;
  error: Error | null;
  hasUnsavedChanges: boolean;
  save: (key?: string, metadata?: Record<string, any>) => Promise<void>;
  load: (key: string) => Promise<void>;
  listDocuments: () => Promise<Array<{ key: string; metadata: any }>>;
  deleteDocument: (key: string) => Promise<void>;
  updateConfig: (config: Partial<KVStoreConfig>) => void;
}

export function useKVStoreQuill(
  quillRef: React.RefObject<Quill | null>,
  options: UseKVStoreQuillOptions = {}
): UseKVStoreQuillReturn {
  const [integration, setIntegration] = useState<KVStoreQuillIntegration | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  
  const integrationRef = useRef<KVStoreQuillIntegration | null>(null);

  const {
    documentKey,
    loadOnMount = false,
    ...kvstoreConfig
  } = options;

  // Initialize integration when Quill is ready
  useEffect(() => {
    if (!quillRef.current) return;

    const kvIntegration = new KVStoreQuillIntegration({
      ...kvstoreConfig,
      callbacks: {
        onSaveStart: () => setIsSaving(true),
        onSaveSuccess: () => {
          setIsSaving(false);
          setHasUnsavedChanges(false);
          setError(null);
        },
        onSaveError: (err) => {
          setIsSaving(false);
          setError(err);
        },
        onLoadStart: () => setIsLoading(true),
        onLoadSuccess: () => {
          setIsLoading(false);
          setError(null);
        },
        onLoadError: (err) => {
          setIsLoading(false);
          setError(err);
        },
        ...kvstoreConfig.callbacks,
      },
    });

    kvIntegration.initialize(quillRef.current);
    integrationRef.current = kvIntegration;
    setIntegration(kvIntegration);

    // Track unsaved changes
    const changeHandler = () => {
      setHasUnsavedChanges(kvIntegration.hasUnsavedChanges());
    };

    quillRef.current.on('text-change', changeHandler);

    // Load document on mount if specified
    if (loadOnMount && documentKey) {
      kvIntegration.load(documentKey).catch(setError);
    }

    // Cleanup
    return () => {
      if (quillRef.current) {
        quillRef.current.off('text-change', changeHandler);
      }
      kvIntegration.destroy();
      integrationRef.current = null;
    };
  }, [quillRef.current]); // eslint-disable-line react-hooks/exhaustive-deps

  // Save document
  const save = useCallback(async (
    key?: string,
    metadata?: Record<string, any>
  ): Promise<void> => {
    if (!integrationRef.current) {
      throw new Error('KVStore integration not initialized');
    }

    const saveKey = key || documentKey;
    if (!saveKey) {
      throw new Error('No document key provided');
    }

    await integrationRef.current.save(saveKey, metadata);
  }, [documentKey]);

  // Load document
  const load = useCallback(async (key: string): Promise<void> => {
    if (!integrationRef.current) {
      throw new Error('KVStore integration not initialized');
    }

    await integrationRef.current.load(key);
  }, []);

  // List documents
  const listDocuments = useCallback(async (): Promise<Array<{ key: string; metadata: any }>> => {
    if (!integrationRef.current) {
      throw new Error('KVStore integration not initialized');
    }

    return await integrationRef.current.listDocuments();
  }, []);

  // Delete document
  const deleteDocument = useCallback(async (key: string): Promise<void> => {
    if (!integrationRef.current) {
      throw new Error('KVStore integration not initialized');
    }

    await integrationRef.current.deleteDocument(key);
  }, []);

  // Update configuration
  const updateConfig = useCallback((config: Partial<KVStoreConfig>): void => {
    if (!integrationRef.current) {
      throw new Error('KVStore integration not initialized');
    }

    integrationRef.current.updateConfig(config);
  }, []);

  return {
    integration,
    isLoading,
    isSaving,
    error,
    hasUnsavedChanges,
    save,
    load,
    listDocuments,
    deleteDocument,
    updateConfig,
  };
}