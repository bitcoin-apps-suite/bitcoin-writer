FULL FILE:

/**
 * Integration tests for DocumentInscriptionService.
 * Tests the full document inscription flow with mocked blockchain calls.
 */

import { DocumentInscriptionService, DocumentData } from '../../services/DocumentInscriptionService';
import { MicroOrdinalsService } from '../../services/MicroOrdinalsService';

const originalFetch = global.fetch;

afterEach(() => {
  global.fetch = originalFetch;
});

describe('DocumentInscriptionService', () => {
  const sampleDocument: DocumentData = {
    id: 'doc-test-001',
    content: 'This is a test document for BSV inscription.',
    contentType: 'text/plain',
    title: 'Test Document',
    author: 'Test Author',
  };

  describe('inscribeDocument', () => {
    test('should create inscription record on success', async () => {
      const mockMicro = {
        inscribe: jest.fn().mockResolvedValue({
          txid: 'tx123',
          vout: 0,
          inscriptionId: 'tx123:0',
          fee: 250,
          status: 'broadcast',
        }),
        getNetwork: jest.fn().mockReturnValue('testnet'),
      } as unknown as MicroOrdinalsService;

      const svc = new DocumentInscriptionService(mockMicro);
      const result = await svc.inscribeDocument(sampleDocument);

      expect(result.txid).toBe('tx123');
      expect(result.inscriptionId).toBe('tx123:0');
      expect(result.status).toBe('broadcast');

      const record = svc.getRecord('doc-test-001');
      expect(record).toBeTruthy();
      expect(record!.status).toBe('broadcast');
      expect(record!.contentType).toBe('text/plain');
      expect(record!.network).toBe('testnet');
      expect(record!.title).toBe('Test Document');
      expect(record!.size).toBe(sampleDocument.content.length);
    });

    test('should set record status to failed on error', async () => {
      const mockMicro = {
        inscribe: jest.fn().mockRejectedValue(new Error('Insufficient funds')),
        getNetwork: jest.fn().mockReturnValue('testnet'),
      } as unknown as MicroOrdinalsService;

      const svc = new DocumentInscriptionService(mockMicro);

      await expect(svc.inscribeDocument(sampleDocument)).rejects.toThrow('Insufficient funds');

      const record = svc.getRecord('doc-test-001');
      expect(record).toBeTruthy();
      expect(record!.status).toBe('failed');
      expect(record!.errorMessage).toBe('Insufficient funds');
    });
  });

  describe('getRecord', () => {
    test('should return null for unknown document', () => {
      const svc = new DocumentInscriptionService(new MicroOrdinalsService());
      expect(svc.getRecord('unknown')).toBeNull();
    });
  });

  describe('getInscriptionRecords', () => {
    test('should return all records', async () => {
      const mockMicro = {
        inscribe: jest.fn().mockResolvedValue({
          txid: 'tx1', vout: 0, inscriptionId: 'tx1:0', fee: 100, status: 'broadcast',
        }),
        getNetwork: jest.fn().mockReturnValue('testnet'),
      } as unknown as MicroOrdinalsService;

      const svc = new DocumentInscriptionService(mockMicro);
      await svc.inscribeDocument({ ...sampleDocument, id: 'doc-1' });
      await svc.inscribeDocument({ ...sampleDocument, id: 'doc-2' });

      const records = svc.getInscriptionRecords();
      expect(records).toHaveLength(2);
    });
  });

  describe('getRecordsByStatus', () => {
    test('should filter records by status', async () => {
      const mockMicro = {
        inscribe: jest.fn()
          .mockResolvedValueOnce({ txid: 'tx1', vout: 0, inscriptionId: 'tx1:0', fee: 100, status: 'broadcast' })
          .mockRejectedValueOnce(new Error('Network error')),
        getNetwork: jest.fn().mockReturnValue('testnet'),
      } as unknown as MicroOrdinalsService;

      const svc = new DocumentInscriptionService(mockMicro);
      await svc.inscribeDocument({ ...sampleDocument, id: 'doc-success' });
      try { await svc.inscribeDocument({ ...sampleDocument, id: 'doc-fail' }); } catch {}

      expect(svc.getRecordsByStatus('broadcast')).toHaveLength(1);
      expect(svc.getRecordsByStatus('failed')).toHaveLength(1);
    });
  });

  describe('exportRecords / importRecords', () => {
    test('should export and import records', async () => {
      const mockMicro = {
        inscribe: jest.fn().mockResolvedValue({
          txid: 'tx1', vout: 0, inscriptionId: 'tx1:0', fee: 100, status: 'broadcast',
        }),
        getNetwork: jest.fn().mockReturnValue('testnet'),
      } as unknown as MicroOrdinalsService;

      const svc1 = new DocumentInscriptionService(mockMicro);
      await svc1.inscribeDocument({ ...sampleDocument, id: 'doc-1' });

      const exported = svc1.exportRecords();
      expect(exported).toContain('doc-1');

      const svc2 = new DocumentInscriptionService(mockMicro);
      svc2.importRecords(exported);
      expect(svc2.getRecord('doc-1')).toBeTruthy();
    });

    test('should throw on invalid import data', () => {
      const svc = new DocumentInscriptionService(new MicroOrdinalsService());
      expect(() => svc.importRecords('not valid json')).toThrow();
    });
  });

  describe('getInscriptionId', () => {
    test('should return inscription ID for known document', async () => {
      const mockMicro = {
        inscribe: jest.fn().mockResolvedValue({
          txid: 'tx1', vout: 2, inscriptionId: 'tx1:2', fee: 100, status: 'broadcast',
        }),
        getNetwork: jest.fn().mockReturnValue('testnet'),
      } as unknown as MicroOrdinalsService;

      const svc = new DocumentInscriptionService(mockMicro);
      await svc.inscribeDocument(sampleDocument);

      expect(svc.getInscriptionId('doc-test-001')).toBe('tx1:2');
    });

    test('should return null for unknown document', () => {
      const svc = new DocumentInscriptionService(new MicroOrdinalsService());
      expect(svc.getInscriptionId('unknown')).toBeNull();
    });
  });

  describe('retryInscription', () => {
    test('should return null for non-failed document', async () => {
      const mockMicro = {
        inscribe: jest.fn().mockResolvedValue({
          txid: 'tx1', vout: 0, inscriptionId: 'tx1:0', fee: 100, status: 'broadcast',
        }),
        getNetwork: jest.fn().mockReturnValue('testnet'),
      } as unknown as MicroOrdinalsService;

      const svc = new DocumentInscriptionService(mockMicro);
      await svc.inscribeDocument(sampleDocument);

      const result = await svc.retryInscription('doc-test-001');
      expect(result).toBeNull();
    });

    test('should retry and succeed for failed document', async () => {
      const mockMicro = {
        inscribe: jest.fn()
          .mockRejectedValueOnce(new Error('Network error'))
          .mockResolvedValueOnce({ txid: 'tx2', vout: 0, inscriptionId: 'tx2:0', fee: 150, status: 'broadcast' }),
        getNetwork: jest.fn().mockReturnValue('testnet'),
      } as unknown as MicroOrdinalsService;

      const svc = new DocumentInscriptionService(mockMicro);
      try { await svc.inscribeDocument(sampleDocument); } catch {}

      const record = svc.getRecord('doc-test-001');
      expect(record!.status).toBe('failed');

      const result = await svc.retryInscription('doc-test-001');
      expect(result).toBeTruthy();
      expect(result!.txid).toBe('tx2');

      const updatedRecord = svc.getRecord('doc-test-001');
      expect(updatedRecord!.status).toBe('broadcast');
      expect(updatedRecord!.retries).toBe(1);
    });
  });

  describe('createDocumentInscriptionService factory', () => {
    test('should create a configured service instance', () => {
      const { createDocumentInscriptionService } = require('../../services/DocumentInscriptionService');
      const svc = createDocumentInscriptionService({ network: 'mainnet' });
      expect(svc).toBeInstanceOf(DocumentInscriptionService);
      expect(svc.getNetwork()).toBe('mainnet');
    });
  });
});
