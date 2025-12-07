import { KVStore } from 'babbage-kvstore';
import type Quill from 'quill';
import type { Delta } from 'quill/core';

export interface KVStoreConfig {
  enabled: boolean;
  autoSave: boolean;
  autoSaveInterval: number; // milliseconds
  topicName?: string;
  encryptContent?: boolean;
  useCall?: boolean; // Use 'call' for save operations
  callbacks?: {
    onSaveStart?: () => void;
    onSaveSuccess?: (key: string) => void;
    onSaveError?: (error: Error) => void;
    onLoadStart?: () => void;
    onLoadSuccess?: (content: any) => void;
    onLoadError?: (error: Error) => void;
  };
}

export class KVStoreQuillIntegration {
  private kvstore: typeof KVStore;
  private quill: Quill | null = null;
  private config: KVStoreConfig;
  private autoSaveTimer: NodeJS.Timeout | null = null;
  private lastSavedContent: string = '';
  private isDirty: boolean = false;

  constructor(config: Partial<KVStoreConfig> = {}) {
    this.kvstore = KVStore;
    this.config = {
      enabled: true,
      autoSave: true,
      autoSaveInterval: 30000, // 30 seconds default
      topicName: 'quill-documents',
      encryptContent: true,
      useCall: false,
      ...config,
    };
  }

  /**
   * Initialize the integration with a Quill instance
   */
  public initialize(quill: Quill): void {
    this.quill = quill;

    if (!this.config.enabled) {
      console.log('KVStore integration disabled');
      return;
    }

    // Listen for text changes
    this.quill.on('text-change', () => {
      this.isDirty = true;
      
      if (this.config.autoSave) {
        this.scheduleAutoSave();
      }
    });

    // Start auto-save if enabled
    if (this.config.autoSave) {
      this.startAutoSave();
    }
  }

  /**
   * Save the current Quill content to KVStore
   */
  public async save(key: string, metadata?: Record<string, any>): Promise<void> {
    if (!this.quill) {
      throw new Error('Quill instance not initialized');
    }

    if (!this.config.enabled) {
      throw new Error('KVStore integration is disabled');
    }

    try {
      this.config.callbacks?.onSaveStart?.();

      const content = this.quill.getContents();
      const plainText = this.quill.getText();
      
      const documentData = {
        delta: content,
        plainText,
        html: this.quill.root.innerHTML,
        metadata: {
          ...metadata,
          savedAt: new Date().toISOString(),
          wordCount: plainText.trim().split(/\s+/).length,
          characterCount: plainText.length,
        },
      };

      const dataToSave = JSON.stringify(documentData);

      // Use 'call' or 'set' based on configuration
      if (this.config.useCall) {
        // Using call method for save operations (user-configurable)
        await this.kvstore.call({
          protocolID: 'kvstore',
          action: 'set',
          args: {
            key,
            value: dataToSave,
            topic: this.config.topicName,
            encrypt: this.config.encryptContent,
          },
        });
      } else {
        // Traditional set method
        await this.kvstore.set(key, dataToSave, {
          topic: this.config.topicName,
          encrypt: this.config.encryptContent,
        });
      }

      this.lastSavedContent = dataToSave;
      this.isDirty = false;
      
      this.config.callbacks?.onSaveSuccess?.(key);
    } catch (error) {
      this.config.callbacks?.onSaveError?.(error as Error);
      throw error;
    }
  }

  /**
   * Load content from KVStore into Quill
   */
  public async load(key: string): Promise<void> {
    if (!this.quill) {
      throw new Error('Quill instance not initialized');
    }

    if (!this.config.enabled) {
      throw new Error('KVStore integration is disabled');
    }

    try {
      this.config.callbacks?.onLoadStart?.();

      let dataString: string;

      // Use 'call' or 'get' based on configuration
      if (this.config.useCall) {
        // Using call method for load operations
        const result = await this.kvstore.call({
          protocolID: 'kvstore',
          action: 'get',
          args: {
            key,
            topic: this.config.topicName,
            decrypt: this.config.encryptContent,
          },
        });
        dataString = result.value;
      } else {
        // Traditional get method
        dataString = await this.kvstore.get(key, {
          topic: this.config.topicName,
          decrypt: this.config.encryptContent,
        });
      }

      const documentData = JSON.parse(dataString);
      
      // Set the content in Quill
      if (documentData.delta) {
        this.quill.setContents(documentData.delta);
      } else if (documentData.html) {
        this.quill.root.innerHTML = documentData.html;
      }

      this.lastSavedContent = dataString;
      this.isDirty = false;
      
      this.config.callbacks?.onLoadSuccess?.(documentData);
    } catch (error) {
      this.config.callbacks?.onLoadError?.(error as Error);
      throw error;
    }
  }

  /**
   * List all documents in the topic
   */
  public async listDocuments(): Promise<Array<{ key: string; metadata: any }>> {
    if (!this.config.enabled) {
      throw new Error('KVStore integration is disabled');
    }

    try {
      const keys = await this.kvstore.list({
        topic: this.config.topicName,
      });

      const documents = await Promise.all(
        keys.map(async (key: string) => {
          try {
            const dataString = await this.kvstore.get(key, {
              topic: this.config.topicName,
              decrypt: this.config.encryptContent,
            });
            const data = JSON.parse(dataString);
            return {
              key,
              metadata: data.metadata || {},
            };
          } catch (error) {
            console.error(`Failed to load metadata for ${key}:`, error);
            return {
              key,
              metadata: {},
            };
          }
        })
      );

      return documents;
    } catch (error) {
      console.error('Failed to list documents:', error);
      throw error;
    }
  }

  /**
   * Delete a document from KVStore
   */
  public async deleteDocument(key: string): Promise<void> {
    if (!this.config.enabled) {
      throw new Error('KVStore integration is disabled');
    }

    try {
      if (this.config.useCall) {
        await this.kvstore.call({
          protocolID: 'kvstore',
          action: 'delete',
          args: {
            key,
            topic: this.config.topicName,
          },
        });
      } else {
        await this.kvstore.delete(key, {
          topic: this.config.topicName,
        });
      }
    } catch (error) {
      console.error('Failed to delete document:', error);
      throw error;
    }
  }

  /**
   * Check if there are unsaved changes
   */
  public hasUnsavedChanges(): boolean {
    return this.isDirty;
  }

  /**
   * Start auto-save timer
   */
  private startAutoSave(): void {
    if (this.autoSaveTimer) {
      clearInterval(this.autoSaveTimer);
    }

    this.autoSaveTimer = setInterval(() => {
      if (this.isDirty) {
        this.autoSaveDocument();
      }
    }, this.config.autoSaveInterval);
  }

  /**
   * Schedule an auto-save
   */
  private scheduleAutoSave(): void {
    if (this.autoSaveTimer) {
      clearInterval(this.autoSaveTimer);
    }

    this.autoSaveTimer = setTimeout(() => {
      if (this.isDirty) {
        this.autoSaveDocument();
      }
      // Restart the regular auto-save interval
      this.startAutoSave();
    }, this.config.autoSaveInterval);
  }

  /**
   * Auto-save the document
   */
  private async autoSaveDocument(): Promise<void> {
    try {
      // Generate auto-save key based on timestamp
      const autoSaveKey = `autosave_${Date.now()}`;
      await this.save(autoSaveKey, { autoSave: true });
      console.log('Auto-saved document:', autoSaveKey);
    } catch (error) {
      console.error('Auto-save failed:', error);
    }
  }

  /**
   * Update configuration
   */
  public updateConfig(newConfig: Partial<KVStoreConfig>): void {
    this.config = {
      ...this.config,
      ...newConfig,
    };

    // Restart auto-save if interval changed
    if (newConfig.autoSaveInterval && this.config.autoSave) {
      this.startAutoSave();
    }
  }

  /**
   * Cleanup resources
   */
  public destroy(): void {
    if (this.autoSaveTimer) {
      clearInterval(this.autoSaveTimer);
      this.autoSaveTimer = null;
    }
    this.quill = null;
  }
}

// Export a factory function for easy integration
export function createKVStoreIntegration(config?: Partial<KVStoreConfig>): KVStoreQuillIntegration {
  return new KVStoreQuillIntegration(config);
}