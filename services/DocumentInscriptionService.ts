import { PrivateKey } from 'bsv';
import MicroOrdinalsService from './MicroOrdinalsService';
import BSVStorageService from './BSVStorageService';

export interface InscriptionResult {
  inscriptionId: string;
  txId: string;
  status: 'pending' | 'confirmed' | 'failed';
  timestamp: number;
}

export interface DocumentMetadata {
  txId: string;
  dataSize: number;
  timestamp: number;
  network: 'mainnet' | 'testnet';
  status?: 'pending' | 'confirmed' | 'failed';
}

class DocumentInscriptionService {
  private static instance: DocumentInscriptionService;
  private microOrdinals: MicroOrdinalsService;
  private storage: BSVStorageService;

  private constructor() {
    this.microOrdinals = new MicroOrdinalsService();
    this.storage = new BSVStorageService();
  }

  public static getInstance(): DocumentInscriptionService {
    if (!DocumentInscriptionService.instance) {
      DocumentInscriptionService.instance = new DocumentInscriptionService();
    }
    return DocumentInscriptionService.instance;
  }

  public async inscribeDocument(
    documentData: any, 
    privateKey: PrivateKey | string, 
    network: 'mainnet' | 'testnet' = 'mainnet'
  ): Promise<InscriptionResult> {
    try {
      const pk = typeof privateKey === 'string' ? PrivateKey.fromString(privateKey) : privateKey;
      const dataBuffer = Buffer.from(JSON.stringify(documentData), 'utf8');
      
      const tx = await this.microOrdinals.createInscriptionTx(dataBuffer, pk, network);
      const txId = await this.microOrdinals.broadcastTransaction(tx, network);
      const inscriptionId = `${txId}i0`;
      
      await this.storage.saveInscriptionMapping(inscriptionId, {
        txId,
        dataSize: dataBuffer.length,
        timestamp: Date.now(),
        network,
        status: 'pending'
      });

      return {
        inscriptionId,
        txId,
        status: 'pending',
        timestamp: Date.now()
      };
    } catch (error: any) {
      console.error('[DocumentInscriptionService] Inscription failed:', error);
      if (error.message && error.message.toLowerCase().includes('network')) {
        await new Promise(resolve => setTimeout(resolve, 3000));
        return this.inscribeDocument(documentData, privateKey, network);
      }
      throw new Error(`Inscription failed: ${error.message || 'Unknown error'}`);
    }
  }

  public async getDocument(inscriptionId: string): Promise<any> {
    try {
      const mapping = await this.storage.getInscriptionMapping(inscriptionId);
      if (!mapping) throw new Error(`Inscription ${inscriptionId} not found.`);
      const rawData = await this.microOrdinals.extractInscriptionData(mapping.txId, mapping.network);
      return JSON.parse(rawData.toString('utf8'));
    } catch (error: any) {
      console.error(`[DocumentInscriptionService] Failed to retrieve document for ${inscriptionId}:`, error);
      throw error;
    }
  }

  public async getInscriptionStatus(inscriptionId: string): Promise<'pending' | 'confirmed' | 'failed'> {
    try {
      const mapping = await this.storage.getInscriptionMapping(inscriptionId);
      if (!mapping) return 'failed';
      const status = await this.microOrdinals.getTransactionStatus(mapping.txId, mapping.network);
      if (status === 'confirmed' && mapping.status !== 'confirmed') {
        await this.storage.saveInscriptionMapping(inscriptionId, { ...mapping, status: 'confirmed' });
      }
      return status;
    } catch (error) {
      return 'failed';
    }
  }
}

export default DocumentInscriptionService.getInstance();