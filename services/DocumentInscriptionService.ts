FULL FILE REPLACEMENT:

/**
 * DocumentInscriptionService
 * 
 * Orchestrates document inscription on the BSV blockchain via MicroOrdinalsService.
 * Replaces the previous localStorage mock with real on-chain micro-ordinals.
 * 
 * Responsibilities:
 *   - Accept document data and delegate inscription to MicroOrdinalsService
 *   - Track inscription records in memory (documentId → InscriptionRecord)
 *   - Provide document retrieval from the blockchain
 *   - Check and update confirmation status
 *   - Retry failed inscriptions
 * 
 * Storage: In-memory Maps (no localStorage). Records can be exported/imported
 * for persistence across server restarts.
 */

import { MicroOrdinalsService } from './MicroOrdinalsService';
import {
  DocumentInscriptionRecord,
  InscriptionResult,
  InscriptionStatus,
  InscriptionConfig,
  BSVNetwork,
  InscriptionRetrievalResult,
} from '../types/DocumentInscription';

/** Document payload accepted by the service. */
export interface DocumentData {
  id: string;
  content: string | Buffer;
  contentType: string;
  title?: string;
  author?: string;
  metadata?: Record<string, unknown>;
}

export class DocumentInscriptionService {
  private microOrdinals: MicroOrdinalsService;

  /** Primary record store: documentId → inscription record. */
  private records: Map<string, DocumentInscriptionRecord> = new Map();

  /** Index: documentId → inscriptionId (for quick lookups). */
  private documentIndex: Map<string, string> = new Map();

  /** Pending documents kept in memory for retry (cleared on confirmation). */
  private pendingDocuments: Map<string, DocumentData> = new Map();

  constructor(microOrdinals: MicroOrdinalsService) {
    this.microOrdinals = microOrdinals;
  }

  // ── Inscription ──

  /**
   * Inscribe a document as a micro-ordinals inscription on the BSV blockchain.
   * 
   * This replaces the previous localStorage mock. The document content
   * is permanently recorded on-chain and retrievable via the inscription ID.
   * 
   * @param document  The document to inscribe
   * @returns        Inscription result with txid, vout, and inscriptionId
   * @throws         Error if inscription fails (insufficient funds, network error, etc.)
   */
  async inscribeDocument(document: DocumentData): Promise<InscriptionResult> {
    // Store document temporarily for potential retry
    this.pendingDocuments.set(document.id, document);

    // Create inscription payload
    const inscriptionData = {
      content: document.content,
      contentType: document.contentType,
      metadata: {
        title: document.title,
        author: document.author,
        documentId: document.id,
        ...document.metadata,
      },
    };

    // Create initial record (status: pending)
    const record: DocumentInscriptionRecord = {
      documentId: document.id,
      inscriptionId: '',
      txid: '',
      vout: 0,
      status: 'pending',
      createdAt: Date.now(),
      fee: 0,
      network: this.microOrdinals.getNetwork(),
      contentType: document.contentType,
      size: Buffer.isBuffer(document.content)
        ? document.content.length
        : Buffer.from(document.content, 'utf8').length,
      retries: 0,
      title: document.title,
    };

    try {
      // Delegate to MicroOrdinalsService for real blockchain inscription
      const result = await this.microOrdinals.inscribe(inscriptionData);

      // Update record with on-chain details
      record.inscriptionId = result.inscriptionId;
      record.txid = result.txid;
      record.vout = result.vout;
      record.status = result.status;
      record.fee = result.fee;

      // Clear pending document on success
      this.pendingDocuments.delete(document.id);
    } catch (error) {
      record.status = 'failed';
      record.errorMessage = error instanceof Error ? error.message : String(error);

      // Keep pending document for retry
    }

    // Store record regardless of outcome
    this.records.set(document.id, record);
    this.documentIndex.set(document.id, record.inscriptionId || '');

    // Re-throw if failed so the caller can handle it
    if (record.status === 'failed') {
      throw new Error(record.errorMessage || 'Inscription failed');
    }

    return {
      txid: record.txid,
      vout: record.vout,
      inscriptionId: record.inscriptionId,
      fee: record.fee,
      status: record.status,
      rawTx: undefined,
    };
  }

  // ── Retrieval ──

  /**
   * Retrieve inscribed document content from the BSV blockchain.
   * 
   * @param documentId  The internal document ID
   * @returns           The inscribed content, or null if not found
   */
  async getDocument(documentId: string): Promise<InscriptionRetrievalResult | null> {
    const record = this.records.get(documentId);
    if (!record || !record.txid) {
      return null;
    }

    try {
      return await this.microOrdinals.getInscription(record.txid, record.vout);
    } catch (error) {
 console.error(`Failed to retrieve document ${documentId} from blockchain:`, error);
      return null;
    }
  }

  /**
   * Retrieve a document by its inscription ID.
   */
  async getDocumentByInscriptionId(inscriptionId: string): Promise<InscriptionRetrievalResult | null> {
    const [txid, voutStr] = inscriptionId.split(':');
    if (!txid || !voutStr) return null;

    try {
      return await this.microOrdinals.getInscription(txid, parseInt(voutStr, 10));
    } catch {
      return null;
    }
  }

  // ── Status Tracking ──

  /**
   * Check and update the confirmation status of a document's inscription.
   * Queries the BSV network for the latest block height and confirmation count.
   */
  async getInscriptionStatus(documentId: string): Promise<InscriptionStatus | null> {
    const record = this.records.get(documentId);
    if (!record) return null;

    // Skip check for failed or pending records
    if (record.status === 'failed' || record.status === 'pending') {
      return record.status;
    }

    try {
      const statusResponse = await this.microOrdinals.getStatus(record.txid, record.vout);
      record.status = statusResponse.status;

      if (statusResponse.status === 'confirmed' && !record.confirmedAt) {
        record.confirmedAt = Date.now();
      }

      return statusResponse.status;
    } catch (error) {
 console.error(`Failed to check status for document ${documentId}:`, error);
      return record.status;
    }
  }

  /**
   * Update confirmation status for all non-confirmed records.
   * Useful as a periodic background task.
   */
  async refreshAllStatuses(): Promise<void> {
    const updatePromises: Promise<void>[] = [];

    for (const [documentId, record] of this.records) {
      if (record.status === 'broadcast' || record.status === 'pending') {
        updatePromises.push(
          this.getInscriptionStatus(documentId).then(() => undefined)
        );
      }
    }

    await Promise.allSettled(updatePromises);
  }

  // ── Retry ──

  /**
   * Retry a failed inscription.
   * Uses the stored pending document to re-attempt inscription.
   * 
   * @param documentId  The ID of the failed document
   * @returns           New inscription result, or null if no pending document
   */
  async retryInscription(documentId: string): Promise<InscriptionResult | null> {
    const record = this.records.get(documentId);
    if (!record || record.status !== 'failed') {
      return null;
    }

    const document = this.pendingDocuments.get(documentId);
    if (!document) {
      return null;
    }

    record.retries += 1;

    try {
      // Re-attempt inscription
      const result = await this.microOrdinals.inscribe({
        content: document.content,
        contentType: document.contentType,
        metadata: {
          title: document.title,
          author: document.author,
          documentId: document.id,
          ...document.metadata,
          retryAttempt: record.retries,
        },
      });

      // Update record
      record.inscriptionId = result.inscriptionId;
      record.txid = result.txid;
      record.vout = result.vout;
      record.status = result.status;
      record.fee = result.fee;
      record.errorMessage = undefined;

      this.documentIndex.set(documentId, result.inscriptionId);

      // Clear pending document on success
      this.pendingDocuments.delete(documentId);

      return result;
    } catch (error) {
      record.errorMessage = error instanceof Error ? error.message : String(error);
      throw error;
    }
  }

  // ── Record Access ──

  /** Get the inscription record for a document. */
  getRecord(documentId: string): DocumentInscriptionRecord | null {
    return this.records.get(documentId) ?? null;
  }

  /** Get all inscription records. */
  getInscriptionRecords(): DocumentInscriptionRecord[] {
    return Array.from(this.records.values());
  }

  /** Get records filtered by status. */
  getRecordsByStatus(status: InscriptionStatus): DocumentInscriptionRecord[] {
    return this.getInscriptionRecords().filter((r) => r.status === status);
  }

  /** Get the inscription ID for a document. */
  getInscriptionId(documentId: string): string | null {
    return this.documentIndex.get(documentId) || null;
  }

  // ── Persistence (replaces localStorage) ──

  /**
   * Export all records as JSON for persistence.
   * Call this before server shutdown or periodically.
   */
  exportRecords(): string {
    return JSON.stringify(
      {
        records: Array.from(this.records.values()),
        exportedAt: Date.now(),
      },
      null,
      2
    );
  }

  /**
   * Import records from a previously exported JSON string.
   * Call this on server startup to restore state.
   */
  importRecords(json: string): void {
    try {
      const parsed = JSON.parse(json);
      const records: DocumentInscriptionRecord[] = parsed.records || parsed;

      for (const record of records) {
        this.records.set(record.documentId, record);
        this.documentIndex.set(record.documentId, record.inscriptionId);
      }
    } catch (error) {
      throw new Error(`Failed to import records: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  // ── Service Config ──

  /** Get the current network. */
  getNetwork(): BSVNetwork {
    return this.microOrdinals.getNetwork();
  }

  /** Switch network (mainnet/testnet). */
  setNetwork(network: BSVNetwork): void {
    this.microOrdinals.setNetwork(network);
  }

  /** Get the current configuration. */
  getConfig(): InscriptionConfig {
    return this.microOrdinals.getConfig();
  }
}

// ─── Factory Function ─────────────────────────────────────────────

/**
 * Convenience factory for creating a fully configured DocumentInscriptionService.
 * 
 * @example
 * const service = createDocumentInscriptionService({
 *   network: 'testnet',
 *   privateKey: process.env.BSV_PRIVATE_KEY,
 * });
 */
export function createDocumentInscriptionService(
  config?: Partial<InscriptionConfig>
): DocumentInscriptionService {
  const microOrdinals = new MicroOrdinalsService(config);
  return new DocumentInscriptionService(microOrdinals);
}
