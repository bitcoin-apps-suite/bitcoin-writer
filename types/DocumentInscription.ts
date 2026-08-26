FULL FILE REPLACEMENT:

/**
 * Type definitions for BSV micro-ordinals document inscription.
 * 
 * These types define the contracts between DocumentInscriptionService,
 * MicroOrdinalsService, and the BSV blockchain.
 */

/**
 * Inscription lifecycle status.
 * - pending:   Transaction built but not yet broadcast
 * - broadcast: Transaction submitted to the BSV network
 * - confirmed: Transaction included in a mined block
 * - failed:    All retry attempts exhausted
 */
export type InscriptionStatus = 'pending' | 'broadcast' | 'confirmed' | 'failed';

/** BSV network identifier. */
export type BSVNetwork = 'mainnet' | 'testnet';

/**
 * Configuration for the MicroOrdinalsService.
 * Passed at construction time; can be partially overridden.
 */
export interface InscriptionConfig {
  /** Target BSV network. */
  network: BSVNetwork;
  /** Fee rate in satoshis per byte. */
  feeRate: number;
  /** Maximum broadcast retry attempts before giving up. */
  maxRetries: number;
  /** Base delay between retries in milliseconds (multiplied by attempt #). */
  retryDelay: number;
  /** Minimum output value in satoshis (BSV dust limit). */
  dustLimit: number;
  /** Optional WIF/Hex private key for signing (required for direct signing). */
  privateKey?: string;
}

/** Unspent transaction output available for spending. */
export interface UTXO {
  txid: string;
  vout: number;
  satoshis: number;
  /** Hex-encoded locking script (scriptPubKey) of the UTXO. */
  scriptPubKey: string;
}

/**
 * Payload for creating a micro-ordinals inscription.
 */
export interface InscriptionData {
  /** Raw document content to inscribe. */
  content: Buffer | string;
  /** MIME content type, e.g. 'text/plain' or 'application/json'. */
  contentType: string;
  /** Optional metadata embedded alongside content. */
  metadata?: {
    title?: string;
    author?: string;
    documentId?: string;
    [key: string]: unknown;
  };
}

/** Result returned after an inscription attempt. */
export interface InscriptionResult {
  txid: string;
  vout: number;
  /** Composite inscription identifier in 'txid:vout' format. */
  inscriptionId: string;
  /** Fee paid in satoshis. */
  fee: number;
  status: InscriptionStatus;
  /** Raw serialized transaction hex (useful for debugging/retry). */
  rawTx?: string;
  errorMessage?: string;
}

/**
 * Persistent record tracking a document's inscription state.
 * Stored in-memory by DocumentInscriptionService (replaces localStorage).
 */
export interface DocumentInscriptionRecord {
  documentId: string;
  inscriptionId: string;
  txid: string;
  vout: number;
  status: InscriptionStatus;
  createdAt: number;
  confirmedAt?: number;
  fee: number;
  network: BSVNetwork;
  contentType: string;
  /** Size of the inscribed content in bytes. */
  size: number;
  /** Number of retry attempts made. */
  retries: number;
  errorMessage?: string;
  title?: string;
}

/** Response from checking inscription confirmation status on-chain. */
export interface InscriptionStatusResponse {
  inscriptionId: string;
  status: InscriptionStatus;
  confirmations: number;
  txid: string;
  vout: number;
}

/** Retrieved inscription content from the BSV blockchain. */
export interface InscriptionRetrievalResult {
  content: Buffer;
  contentType: string;
  inscriptionId: string;
  txid: string;
  vout: number;
}
