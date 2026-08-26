FULL FILE:

/**
 * Integration tests for MicroOrdinalsService.
 * 
 * These tests use Jest (or compatible runners) and mock the WhatsOnChain API
 * via global.fetch. To run on a real BSV testnet, set BSV_TESTNET_PRIVATE_KEY
 * in your environment and remove the fetch mocks.
 */

import { MicroOrdinalsService } from '../../services/MicroOrdinalsService';
import { InscriptionData } from '../../types/DocumentInscription';

// Type-safe fetch mock
type FetchMock = jest.Mock;
const originalFetch = global.fetch;

function mockFetch(responses: Record<string, { ok: boolean; body: unknown; status?: number }>): FetchMock {
  const mock: FetchMock = jest.fn((url: string, init?: RequestInit) => {
    const urlStr = typeof url === 'string' ? url : (url as URL).toString();
    for (const [pattern, response] of Object.entries(responses)) {
      if (urlStr.includes(pattern)) {
        return Promise.resolve({
          ok: response.ok,
          status: response.status ?? (response.ok ? 200 : 400),
          statusText: response.ok ? 'OK' : 'Bad Request',
          json: () => Promise.resolve(response.body),
          text: () => Promise.resolve(typeof response.body === 'string' ? response.body : JSON.stringify(response.body)),
        } as Response);
      }
    }
    return Promise.resolve({
      ok: false,
      status: 404,
      statusText: 'Not Found',
      json: () => Promise.resolve({}),
      text: () => Promise.resolve('Not Found'),
    } as Response);
  });
  global.fetch = mock as unknown as typeof global.fetch;
  return mock;
}

afterEach(() => {
  global.fetch = originalFetch;
});

describe('MicroOrdinalsService', () => {
  describe('Configuration', () => {
    test('should initialize with default config', () => {
      const svc = new MicroOrdinalsService();
      expect(svc.getNetwork()).toBe('testnet');
      expect(svc.getConfig().feeRate).toBe(0.5);
      expect(svc.getConfig().maxRetries).toBe(3);
    });

    test('should accept custom config', () => {
      const svc = new MicroOrdinalsService({ network: 'mainnet', feeRate: 1.0 });
      expect(svc.getNetwork()).toBe('mainnet');
      expect(svc.getConfig().feeRate).toBe(1.0);
    });

    test('should switch network', () => {
      const svc = new MicroOrdinalsService();
      svc.setNetwork('mainnet');
      expect(svc.getNetwork()).toBe('mainnet');
    });
  });

  describe('getAddress', () => {
    test('should return null without private key', () => {
      const svc = new MicroOrdinalsService();
      expect(svc.getAddress()).toBeNull();
    });

    test('should return address with private key set', () => {
      // Testnet private key (well-known test key, not for production)
      const testWif = 'cVt4o7BGAig1UXywgGSmA5NAHwWqjS2unK6cJDEQNC8bwfNvDx9y';
      const svc = new MicroOrdinalsService({ privateKey: testWif });
      const address = svc.getAddress();
      expect(address).toBeTruthy();
      expect(typeof address).toBe('string');
    });
  });

  describe('fetchUTXOs', () => {
    test('should fetch and parse UTXOs', async () => {
      const testWif = 'cVt4o7BGAig1UXywgGSmA5NAHwWqjS2unK6cJDEQNC8bwfNvDx9y';
      const svc = new MicroOrdinalsService({ privateKey: testWif });
      const address = svc.getAddress()!;

      mockFetch({
        '/unspent': {
          ok: true,
          body: [
            { txid: 'abc123', vout: 0, satoshis: 5000, scriptPubKey: '76a9140011223344556677889900aabbccddee' },
            { txid: 'def456', vout: 1, satoshis: 3000, scriptPubKey: '76a9140011223344556677889900aabbccddee' },
          ],
        },
      });

      const balance = await svc.getBalance();
      expect(balance).toBe(8000);
    });

    test('should handle empty UTXO set', async () => {
      const testWif = 'cVt4o7BGAig1UXywgGSmA5NAHwWqjS2unK6cJDEQNC8bwfNvDx9y';
      const svc = new MicroOrdinalsService({ privateKey: testWif });

      mockFetch({
        '/unspent': { ok: true, body: [] },
      });

      const balance = await svc.getBalance();
      expect(balance).toBe(0);
    });
  });

  describe('inscribe', () => {
    const inscriptionData: InscriptionData = {
      content: 'Hello, BSV blockchain!',
      contentType: 'text/plain',
      metadata: { title: 'Test Document', documentId: 'doc-001' },
    };

    test('should throw if no private key configured', async () => {
      const svc = new MicroOrdinalsService();
      await expect(svc.inscribe(inscriptionData)).rejects.toThrow('No private key');
    });

    test('should throw if no UTXOs available', async () => {
      const testWif = 'cVt4o7BGAig1UXywgGSmA5NAHwWqjS2unK6cJDEQNC8bwfNvDx9y';
      const svc = new MicroOrdinalsService({ privateKey: testWif });

      mockFetch({
        '/unspent': { ok: true, body: [] },
      });

      await expect(svc.inscribe(inscriptionData)).rejects.toThrow('No UTXOs');
    });

    test('should throw on insufficient funds', async () => {
      const testWif = 'cVt4o7BGAig1UXywgGSmA5NAHwWqjS2unK6cJDEQNC8bwfNvDx9y';
      const svc = new MicroOrdinalsService({
        privateKey: testWif,
        dustLimit: 546,
        feeRate: 0.5,
      });

      mockFetch({
        '/unspent': {
          ok: true,
          body: [
            { txid: 'abc', vout: 0, satoshis: 100, scriptPubKey: '76a9140011223344556677889900aabbccddee' },
          ],
        },
      });

      await expect(svc.inscribe(inscriptionData)).rejects.toThrow('Insufficient funds');
    });
  });

  describe('getStatus', () => {
    test('should return broadcast status for unconfirmed tx', async () => {
      const svc = new MicroOrdinalsService();

      mockFetch({
        '/tx/hash/': {
          ok: true,
          body: { txid: 'abc123', blockhash: null, confirmations: 0 },
        },
      });

      const status = await svc.getStatus('abc123', 0);
      expect(status.status).toBe('broadcast');
      expect(status.confirmations).toBe(0);
    });

    test('should return confirmed status for mined tx', async () => {
      const svc = new MicroOrdinalsService();

      mockFetch({
        '/tx/hash/': {
          ok: true,
          body: { txid: 'abc123', blockhash: 'block123', confirmations: 5 },
        },
      });

      const status = await svc.getStatus('abc123', 0);
      expect(status.status).toBe('confirmed');
      expect(status.confirmations).toBe(5);
    });
  });

  describe('broadcastWithRetry', () => {
    test('should retry on broadcast failure', async () => {
      const testWif = 'cVt4o7BGAig1UXywgGSmA5NAHwWqjS2unK6cJDEQNC8bwfNvDx9y';
      const svc = new MicroOrdinalsService({
        privateKey: testWif,
        maxRetries: 2,
        retryDelay: 10,
      });

      let broadcastAttempts = 0;
      const mockFetchFn = jest.fn((url: string) => {
        if (url.includes('/tx/raw')) {
          broadcastAttempts++;
          if (broadcastAttempts < 2) {
            return Promise.resolve({
              ok: false,
              status: 400,
              statusText: 'Bad Request',
              json: () => Promise.resolve({ errors: ['txn-mempool-conflict'] }),
              text: () => Promise.resolve(JSON.stringify({ errors: ['txn-mempool-conflict'] })),
            } as Response);
          }
          return Promise.resolve({
            ok: true,
            status: 200,
            statusText: 'OK',
            json: () => Promise.resolve({ txid: 'success123' }),
            text: () => Promise.resolve(JSON.stringify({ txid: 'success123' })),
          } as Response);
        }
        // UTXO endpoint
        return Promise.resolve({
          ok: true,
          status: 200,
          statusText: 'OK',
          json: () => Promise.resolve([
            { txid: 'abc', vout: 0, satoshis: 100000, scriptPubKey: '76a9140011223344556677889900aabbccddee' },
          ]),
          text: () => Promise.resolve('[]'),
        } as Response);
      });

      global.fetch = mockFetchFn as unknown as typeof global.fetch;

      const result = await svc.inscribe({
        content: 'Retry test',
        contentType: 'text/plain',
      });

      expect(broadcastAttempts).toBeGreaterThanOrEqual(2);
      expect(result.status).toBe('broadcast');
    }, 15000);
  });

  describe('verifyInscription', () => {
    test('should return false for invalid inscription ID format', async () => {
      const svc = new MicroOrdinalsService();
      expect(await svc.verifyInscription('invalid')).toBe(false);
      expect(await svc.verifyInscription('')).toBe(false);
    });
  });

  describe('getExplorerUrl', () => {
    test('should return testnet URL', () => {
      const svc = new MicroOrdinalsService({ network: 'testnet' });
      expect(svc.getExplorerUrl('abc123')).toContain('test.whatsonchain.com');
    });

    test('should return mainnet URL', () => {
      const svc = new MicroOrdinalsService({ network: 'mainnet' });
      expect(svc.getExplorerUrl('abc123')).toContain('whatsonchain.com');
      expect(svc.getExplorerUrl('abc123')).not.toContain('test.');
    });
  });
});
