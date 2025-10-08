/**
 * D:// Protocol Service
 * Implements the D:// (Dynamic) protocol for mutable references on BSV blockchain
 * Allows updating content while keeping the same URL
 */

import { HandCashService, UTXO } from './HandCashService';
import { BProtocolService } from './BProtocolService';
import { Transaction, Script, P2PKH } from '@bsv/sdk';

export interface DProtocolReference {
  owner: string; // Bitcoin address of the owner
  key: string; // Reference key (e.g., "documents/index.json")
  value: string; // Current value (TX ID, hash, or content)
  type: 'b' | 'c' | 'tx' | 'txt' | null; // Reference type
  sequence: number; // Sequence number for ordering updates
  lastUpdated: string; // ISO timestamp
}

export interface DProtocolResult {
  dUrl: string; // D://owner/key format
  txId: string; // Transaction ID of the state update
  sequence: number; // Sequence number
  cost: {
    totalSats: number;
    totalUSD: number;
  };
}

export interface DocumentIndex {
  version: string;
  owner: string;
  lastUpdated: string;
  documents: DocumentIndexEntry[];
}

export interface DocumentIndexEntry {
  id: string;
  title: string;
  contentProtocol: 'B' | 'D' | 'Bcat';
  contentReference: string; // TX ID or B:// URL
  metadata: {
    createdAt: string;
    updatedAt: string;
    size: number;
    wordCount: number;
    characterCount: number;
    version: number;
    encrypted: boolean;
  };
  versions?: Array<{
    version: number;
    reference: string;
    timestamp: string;
  }>;
}

export interface DProtocolOptions {
  sequence?: number; // Manual sequence override
  type?: 'b' | 'c' | 'tx' | 'txt'; // Reference type
  encrypt?: boolean; // Encrypt the reference value
}

export class DProtocolService {
  private handCashService: HandCashService;
  private bProtocolService: BProtocolService;
  private readonly D_PROTOCOL_PREFIX = '19iG3WTYSsbyos3uJ733yK4zEioi1FesNU'; // D:// protocol identifier

  constructor(handCashService: HandCashService, bProtocolService: BProtocolService) {
    this.handCashService = handCashService;
    this.bProtocolService = bProtocolService;
  }

  /**
   * Create or update a D:// reference
   */
  async createReference(
    key: string,
    value: string,
    options: DProtocolOptions = {}
  ): Promise<DProtocolResult> {
    if (!this.handCashService.isAuthenticated()) {
      throw new Error('User must be authenticated to create D:// references');
    }

    try {
      const user = this.handCashService.getCurrentUser();
      if (!user) {
        throw new Error('No authenticated user found');
      }

      // Get current sequence number
      const currentSequence = await this.getCurrentSequence(user.paymail, key);
      const nextSequence = options.sequence || (currentSequence + 1);

      // Create D:// protocol transaction
      const txResult = await this.createDProtocolTransaction(
        key,
        value,
        options.type || this.detectReferenceType(value),
        nextSequence
      );

      const dUrl = this.buildDUrl(user.paymail, key);

      return {
        dUrl,
        txId: txResult.txId,
        sequence: nextSequence,
        cost: txResult.cost
      };

    } catch (error) {
      console.error('Failed to create D:// reference:', error);
      throw error;
    }
  }

  /**
   * Update an existing D:// reference
   */
  async updateReference(
    key: string,
    newValue: string,
    options: DProtocolOptions = {}
  ): Promise<DProtocolResult> {
    // For D:// protocol, update is the same as create (state overwrites)
    return await this.createReference(key, newValue, options);
  }

  /**
   * Resolve a D:// URL to get current value
   */
  async resolveReference(dUrl: string): Promise<DProtocolReference | null> {
    try {
      const { owner, key } = this.parseDUrl(dUrl);
      
      // Query the D:// state machine for current value
      const currentState = await this.queryStateForOwnerKey(owner, key);
      
      return currentState;

    } catch (error) {
      console.error('Failed to resolve D:// reference:', error);
      return null;
    }
  }

  /**
   * Create or update user's document index
   */
  async updateDocumentIndex(
    documents: DocumentIndexEntry[]
  ): Promise<DProtocolResult> {
    if (!this.handCashService.isAuthenticated()) {
      throw new Error('User must be authenticated to update document index');
    }

    try {
      const user = this.handCashService.getCurrentUser();
      if (!user) {
        throw new Error('No authenticated user found');
      }

      // Create document index structure
      const documentIndex: DocumentIndex = {
        version: '1.0',
        owner: user.paymail,
        lastUpdated: new Date().toISOString(),
        documents: documents.sort((a, b) => 
          new Date(b.metadata.updatedAt).getTime() - new Date(a.metadata.updatedAt).getTime()
        )
      };

      // Store index as JSON content using B:// protocol
      const indexJson = JSON.stringify(documentIndex, null, 2);
      const bResult = await this.bProtocolService.storeContent(indexJson, {
        mediaType: 'application/json',
        filename: 'documents-index.json'
      });

      // Create D:// reference pointing to the B:// stored index
      const dResult = await this.createReference(
        'documents/index.json',
        bResult.txId,
        { type: 'b' }
      );

      console.log('Document index updated:', {
        dUrl: dResult.dUrl,
        bUrl: bResult.bUrl,
        documentCount: documents.length
      });

      return dResult;

    } catch (error) {
      console.error('Failed to update document index:', error);
      throw error;
    }
  }

  /**
   * Retrieve user's document index
   */
  async getDocumentIndex(userAddress?: string): Promise<DocumentIndex | null> {
    try {
      const owner = userAddress || this.handCashService.getCurrentUser()?.paymail;
      if (!owner) {
        throw new Error('No user address provided');
      }

      // Resolve D:// reference for document index
      const dUrl = this.buildDUrl(owner, 'documents/index.json');
      const reference = await this.resolveReference(dUrl);

      if (!reference || !reference.value) {
        return null;
      }

      // Retrieve content based on reference type
      let indexContent: string;
      if (reference.type === 'b') {
        indexContent = await this.bProtocolService.retrieveContent(`b://${reference.value}`);
      } else if (reference.type === 'txt') {
        indexContent = reference.value;
      } else {
        throw new Error(`Unsupported reference type for document index: ${reference.type}`);
      }

      // Parse and return document index
      return JSON.parse(indexContent) as DocumentIndex;

    } catch (error) {
      console.error('Failed to get document index:', error);
      return null;
    }
  }

  /**
   * Delete a D:// reference (set to null)
   */
  async deleteReference(key: string): Promise<DProtocolResult> {
    return await this.createReference(key, '', { type: 'txt' });
  }

  /**
   * List all active D:// references for a user
   */
  async listUserReferences(userAddress?: string): Promise<DProtocolReference[]> {
    try {
      const owner = userAddress || this.handCashService.getCurrentUser()?.paymail;
      if (!owner) {
        throw new Error('No user address provided');
      }

      // Query D:// state machine for all user references
      const references = await this.queryAllUserReferences(owner);
      
      // Filter out deleted references (type: null)
      return references.filter(ref => ref.type !== null);

    } catch (error) {
      console.error('Failed to list user references:', error);
      return [];
    }
  }

  /**
   * Check if a D:// URL is valid format
   */
  isValidDUrl(url: string): boolean {
    const dUrlPattern = /^D:\/\/[^\/]+\/.*$/i;
    return dUrlPattern.test(url);
  }

  /**
   * Build D:// URL from components
   */
  buildDUrl(owner: string, key: string): string {
    const cleanKey = key.startsWith('/') ? key.substring(1) : key;
    return `D://${owner}/${cleanKey}`;
  }

  /**
   * Parse D:// URL into components
   */
  parseDUrl(dUrl: string): { owner: string; key: string } {
    if (!this.isValidDUrl(dUrl)) {
      throw new Error(`Invalid D:// URL format: ${dUrl}`);
    }

    const urlPart = dUrl.substring(4); // Remove 'D://'
    const firstSlash = urlPart.indexOf('/');
    
    if (firstSlash === -1) {
      throw new Error(`Invalid D:// URL format - missing key: ${dUrl}`);
    }

    return {
      owner: urlPart.substring(0, firstSlash),
      key: urlPart.substring(firstSlash + 1)
    };
  }

  /**
   * Create D:// protocol transaction
   */
  private async createDProtocolTransaction(
    key: string,
    value: string,
    type: 'b' | 'c' | 'tx' | 'txt' | null,
    sequence: number
  ): Promise<{ txId: string; cost: { totalSats: number; totalUSD: number } }> {
    try {
      // Get current user for transaction signing
      const user = this.handCashService.getCurrentUser();
      if (!user) {
        throw new Error('User authentication required for D:// protocol transactions');
      }

      // Create D:// protocol OP_RETURN data
      // Following the D:// specification format:
      // OP_RETURN
      //   19iG3WTYSsbyos3uJ733yK4zEioi1FesNU (D:// protocol prefix)
      //   [key]
      //   [value] 
      //   [type]
      //   [sequence]

      const opReturnData = [
        Buffer.from(this.D_PROTOCOL_PREFIX, 'utf-8'), // Protocol identifier
        Buffer.from(key, 'utf-8'), // Reference key
        Buffer.from(value, 'utf-8'), // Reference value
        Buffer.from(type || 'txt', 'utf-8'), // Reference type
        Buffer.from(sequence.toString(), 'utf-8') // Sequence number
      ];

      // Build OP_RETURN script using BSV SDK
      const script = new Script();
      script.writeOpCode(106); // OP_RETURN
      
      // Add protocol data chunks
      opReturnData.forEach(data => {
        if (data.length > 0) {
          // Convert Buffer to number array for BSV SDK
          const dataArray = Array.from(data);
          script.writeBin(dataArray);
        }
      });

      // Create transaction
      const transaction = new Transaction();
      
      // Add OP_RETURN output
      transaction.addOutput({
        lockingScript: script,
        satoshis: 0
      });

      // Get UTXOs for funding
      const utxos = await this.handCashService.getUtxos();
      if (!utxos || utxos.length === 0) {
        throw new Error('No UTXOs available for D:// transaction funding');
      }

      // Calculate required fee
      const estimatedSize = 250; // Estimated transaction size in bytes
      const feeRequired = Math.max(250, Math.ceil(estimatedSize * 1.2)); // Min 250 sats

      // Find UTXO with sufficient balance
      let totalInputValue = 0;
      const selectedUtxos = [];
      
      for (const utxo of utxos) {
        selectedUtxos.push(utxo);
        totalInputValue += utxo.satoshis;
        
        if (totalInputValue >= feeRequired) {
          break;
        }
      }

      if (totalInputValue < feeRequired) {
        throw new Error(`Insufficient funds for D:// transaction. Need ${feeRequired} sats, have ${totalInputValue} sats`);
      }

      // Add inputs to transaction
      selectedUtxos.forEach(utxo => {
        transaction.addInput({
          sourceTXID: utxo.txId,
          sourceOutputIndex: utxo.outputIndex
        });
      });

      // Add change output if needed
      const changeAmount = totalInputValue - feeRequired;
      if (changeAmount > 0) {
        const changeAddress = await this.handCashService.getReceiveAddress();
        transaction.addOutput({
          lockingScript: new P2PKH().lock(changeAddress),
          satoshis: changeAmount
        });
      }

      // Sign transaction
      await this.handCashService.signTransaction(transaction);

      // Broadcast transaction
      const broadcastResult = await this.handCashService.broadcastTransaction(transaction);

      console.log('D:// protocol transaction created:', {
        txId: broadcastResult.txId,
        key,
        value: type === null ? 'NULL' : value,
        type: type || 'NULL',
        sequence
      });

      // Store D:// state locally for future queries
      const reference: DProtocolReference = {
        owner: user.paymail,
        key,
        value,
        type,
        sequence,
        lastUpdated: new Date().toISOString()
      };
      await this.storeDState(reference);

      // Calculate actual costs
      const cost = {
        totalSats: feeRequired,
        totalUSD: (feeRequired / 100000000) * 50 // Rough BSV to USD conversion
      };

      return { txId: broadcastResult.txId, cost };

    } catch (error) {
      console.error('Failed to create D:// protocol transaction:', error);
      throw error;
    }
  }

  /**
   * Query D:// state machine for current reference state
   */
  private async queryStateForOwnerKey(owner: string, key: string): Promise<DProtocolReference | null> {
    try {
      // In production, query the actual D:// state machine
      // For now, simulate with localStorage
      
      const stateKey = `d_state_${owner}_${key}`;
      const storedState = localStorage.getItem(stateKey);
      
      if (!storedState) {
        return null;
      }

      return JSON.parse(storedState) as DProtocolReference;

    } catch (error) {
      console.error('Failed to query D:// state:', error);
      return null;
    }
  }

  /**
   * Query all D:// references for a user
   */
  private async queryAllUserReferences(owner: string): Promise<DProtocolReference[]> {
    try {
      // In production, query the D:// state machine API
      // For now, simulate with localStorage
      
      const references: DProtocolReference[] = [];
      
      // Scan localStorage for user's D:// states
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith(`d_state_${owner}_`)) {
          const storedState = localStorage.getItem(key);
          if (storedState) {
            try {
              references.push(JSON.parse(storedState));
            } catch (error) {
              console.warn('Invalid D:// state data:', key, error);
            }
          }
        }
      }

      return references.sort((a, b) => 
        new Date(b.lastUpdated).getTime() - new Date(a.lastUpdated).getTime()
      );

    } catch (error) {
      console.error('Failed to query user references:', error);
      return [];
    }
  }

  /**
   * Get current sequence number for owner/key combination
   */
  private async getCurrentSequence(owner: string, key: string): Promise<number> {
    const currentState = await this.queryStateForOwnerKey(owner, key);
    return currentState ? currentState.sequence : 0;
  }

  /**
   * Store D:// state locally (simulation of state machine)
   */
  private async storeDState(reference: DProtocolReference): Promise<void> {
    const stateKey = `d_state_${reference.owner}_${reference.key}`;
    localStorage.setItem(stateKey, JSON.stringify(reference));
  }

  /**
   * Detect reference type based on value
   */
  private detectReferenceType(value: string): 'b' | 'c' | 'tx' | 'txt' {
    // Check if it's a transaction ID (64 hex characters)
    if (/^[a-f0-9]{64}$/i.test(value)) {
      return 'tx';
    }
    
    // Check if it's a content hash (starts with hash-like pattern)
    if (/^[a-f0-9]{40,64}$/i.test(value)) {
      return 'c';
    }
    
    // Check if it contains structured data (assume B:// reference)
    if (value.includes('{') || value.includes('b://')) {
      return 'b';
    }
    
    // Default to text content
    return 'txt';
  }

  /**
   * Generate mock transaction ID for testing
   */
  private generateMockTxId(data: any): string {
    const CryptoJS = require('crypto-js');
    return CryptoJS.SHA256(JSON.stringify(data) + Date.now().toString()).toString();
  }

  /**
   * Get protocol badge information for D:// protocol
   */
  getProtocolBadge(txId: string): { name: string; description: string; color: string; icon: string } | null {
    if (!txId) return null;
    
    return {
      name: 'D://',
      description: 'Document indexing protocol - creates searchable document directories with metadata, tags, and version control on BSV blockchain',
      color: '#4169E1', // Royal blue
      icon: '📚' // Books icon representing directories/indexing
    };
  }
}

export default DProtocolService;