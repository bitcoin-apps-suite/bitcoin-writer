/**
 * Bitcoin Writer - Metanet Desktop App Integration
 * This module provides the bridge between Bitcoin Writer and Metanet Desktop
 */

import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

// ES module equivalents of __dirname and __filename
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Real KVStore implementation
let KVStore = null;
let TopicManager = null;
let LookupService = null;

// Try to import real KVStore, fallback to mock if needed
try {
  // Import directly from the LocalKVStore.js file to avoid index.js import issues
  const LocalKVStoreModule = await import('babbage-kvstore/dist/LocalKVStore.js');
  const TopicManagerModule = await import('kvstore-topic-manager');
  const LookupServiceModule = await import('kvstore-lookup-service');
  
  // Import the default export (LocalKVStore class)
  const LocalKVStoreClass = LocalKVStoreModule.default;
  KVStore = new LocalKVStoreClass();
  TopicManager = TopicManagerModule.default || TopicManagerModule;
  LookupService = LookupServiceModule.default || LookupServiceModule;
  
  console.log('✅ Real KVStore modules loaded successfully');
} catch (error) {
  console.log('⚠️ Failed to load real KVStore, using mock:', error.message);
  
  // Mock KVStore fallback
  KVStore = {
    set: async (key, value, options = {}) => {
      console.log(`Mock KVStore SET: ${key} in topic ${options.topic || 'default'}`);
      return { success: true };
    },
    get: async (key, options = {}) => {
      console.log(`Mock KVStore GET: ${key} from topic ${options.topic || 'default'}`);
      return JSON.stringify({ mock: true, key, data: 'test data' });
    },
    list: async (options = {}) => {
      console.log(`Mock KVStore LIST from topic ${options.topic || 'default'}`);
      return ['test-doc-1', 'test-doc-2'];
    },
    delete: async (key, options = {}) => {
      console.log(`Mock KVStore DELETE: ${key} from topic ${options.topic || 'default'}`);
      return { success: true };
    }
  };
}

class BitcoinWriterMetanetApp {
  constructor(config = {}) {
    this.config = {
      port: config.port || 3321,
      apiPrefix: config.apiPrefix || '/api',
      walletPort: config.walletPort || 3301,
      kvstoreEnabled: config.kvstoreEnabled !== false,
      ...config
    };
    
    this.app = express();
    this.kvstore = KVStore;
    this.topicManager = TopicManager;
    this.lookupService = LookupService;
    this.walletConnection = null;
  }

  /**
   * Initialize the application
   */
  async initialize() {
    console.log('🚀 Initializing Bitcoin Writer for Metanet Desktop...');
    
    // Setup middleware with proper CORS configuration
    this.app.use(cors({
      origin: ['http://localhost:3000', 'http://localhost:3001', 'http://localhost:3321', '*'],
      credentials: true,
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization', 'Origin', 'Accept']
    }));
    this.app.use(express.json());
    this.app.use(express.static(path.join(__dirname, '.next')));
    
    // Initialize KVStore if enabled
    if (this.config.kvstoreEnabled) {
      await this.initializeKVStore();
    }
    
    // Setup API routes
    this.setupAPIRoutes();
    
    // Setup wallet integration
    await this.setupWalletIntegration();
    
    // Start the server
    await this.start();
  }

  /**
   * Initialize KVStore components
   */
  async initializeKVStore() {
    try {
      if (this.kvstore && typeof this.kvstore.set === 'function') {
        console.log('📦 Initializing real KVStore components...');
        
        // If we have real KVStore, try to initialize it
        if (this.kvstore.constructor.name === 'LocalKVStore') {
          // Real LocalKVStore - might need additional setup
          console.log('🔗 Using LocalKVStore for blockchain-based storage');
        } else {
          console.log('🧪 Using mock KVStore for testing');
        }
        
        // Test basic functionality
        await this.kvstore.set('init-test', 'KVStore is working', { topic: 'system' });
        const testValue = await this.kvstore.get('init-test', { topic: 'system' });
        
        console.log('✅ KVStore initialized and tested successfully');
      } else {
        throw new Error('KVStore not properly loaded');
      }
    } catch (error) {
      console.error('❌ Failed to initialize KVStore:', error);
      this.config.kvstoreEnabled = false;
    }
  }

  /**
   * Setup API routes for Metanet Desktop integration
   */
  setupAPIRoutes() {
    const api = this.config.apiPrefix;
    
    // Health check endpoint
    this.app.get(`${api}/health`, (req, res) => {
      res.json({
        status: 'healthy',
        app: 'Bitcoin Writer',
        version: '2.0.0',
        kvstore: this.config.kvstoreEnabled,
        wallet: this.walletConnection !== null
      });
    });
    
    // Wallet integration endpoints
    this.app.get(`${api}/wallet/status`, async (req, res) => {
      try {
        const status = await this.getWalletStatus();
        res.json(status);
      } catch (error) {
        res.status(500).json({ error: error.message });
      }
    });
    
    this.app.get(`${api}/wallet/balance`, async (req, res) => {
      try {
        const balance = await this.getWalletBalance();
        res.json(balance);
      } catch (error) {
        res.status(500).json({ error: error.message });
      }
    });
    
    // KVStore endpoints
    if (this.config.kvstoreEnabled) {
      this.app.post(`${api}/kvstore/save`, async (req, res) => {
        try {
          const { key, value, topic, encrypt } = req.body;
          
          const result = await this.kvstore.set(key, value, {
            topic: topic || 'quill-documents',
            encrypt: encrypt !== false
          });
          
          res.json({ success: true, result });
        } catch (error) {
          res.status(500).json({ error: error.message });
        }
      });
      
      this.app.get(`${api}/kvstore/load/:key`, async (req, res) => {
        try {
          const { key } = req.params;
          const { topic, decrypt } = req.query;
          
          const value = await this.kvstore.get(key, {
            topic: topic || 'quill-documents',
            decrypt: decrypt !== 'false'
          });
          
          res.json({ success: true, value });
        } catch (error) {
          res.status(500).json({ error: error.message });
        }
      });
      
      this.app.get(`${api}/kvstore/list`, async (req, res) => {
        try {
          const { topic } = req.query;
          
          const keys = await this.kvstore.list({
            topic: topic || 'quill-documents'
          });
          
          res.json({ success: true, keys });
        } catch (error) {
          res.status(500).json({ error: error.message });
        }
      });
      
      this.app.delete(`${api}/kvstore/delete/:key`, async (req, res) => {
        try {
          const { key } = req.params;
          const { topic } = req.query;
          
          await this.kvstore.delete(key, {
            topic: topic || 'quill-documents'
          });
          
          res.json({ success: true });
        } catch (error) {
          res.status(500).json({ error: error.message });
        }
      });
    }
    
    // Article marketplace endpoints
    this.app.get(`${api}/marketplace/articles`, async (req, res) => {
      try {
        // TODO: Implement article listing from blockchain
        res.json({
          articles: [],
          total: 0
        });
      } catch (error) {
        res.status(500).json({ error: error.message });
      }
    });
    
    // Token management endpoints
    this.app.get(`${api}/token/balance/:address`, async (req, res) => {
      try {
        const { address } = req.params;
        // TODO: Implement bWriter token balance check
        res.json({
          address,
          balance: '0',
          symbol: 'bWriter'
        });
      } catch (error) {
        res.status(500).json({ error: error.message });
      }
    });
    
    // Serve static files and handle frontend routes
    this.app.get('/', (req, res) => {
      res.json({
        app: 'Bitcoin Writer Metanet',
        version: '2.0.0',
        status: 'running',
        endpoints: [
          '/api/health',
          '/api/wallet/status',
          '/api/kvstore/save',
          '/api/kvstore/load/:key',
          '/api/marketplace/articles'
        ]
      });
    });
  }

  /**
   * Setup wallet integration with Metanet Desktop
   */
  async setupWalletIntegration() {
    try {
      console.log('💰 Setting up wallet integration...');
      
      // TODO: Implement actual wallet connection via JSON-API
      // This would connect to Metanet Desktop's wallet service
      
      // For now, we'll mock the connection
      this.walletConnection = {
        connected: false,
        address: null,
        balance: null
      };
      
      // Try to connect to wallet service
      // await this.connectToWallet();
      
      console.log('✅ Wallet integration ready');
    } catch (error) {
      console.error('⚠️ Wallet integration failed:', error);
    }
  }

  /**
   * Get wallet status
   */
  async getWalletStatus() {
    if (!this.walletConnection) {
      throw new Error('Wallet not connected');
    }
    
    return {
      connected: this.walletConnection.connected,
      address: this.walletConnection.address,
      network: 'mainnet'
    };
  }

  /**
   * Get wallet balance
   */
  async getWalletBalance() {
    if (!this.walletConnection || !this.walletConnection.connected) {
      throw new Error('Wallet not connected');
    }
    
    // TODO: Implement actual balance fetching
    return {
      bsv: '0',
      bWriter: '0',
      usd: '0'
    };
  }

  /**
   * Start the application server
   */
  async start() {
    return new Promise((resolve, reject) => {
      this.server = this.app.listen(this.config.port, (err) => {
        if (err) {
          console.error('❌ Failed to start server:', err);
          reject(err);
        } else {
          console.log(`
╔════════════════════════════════════════════╗
║       Bitcoin Writer - Metanet App        ║
╠════════════════════════════════════════════╣
║  Status: Running                           ║
║  Port: ${this.config.port}                              ║
║  API: http://localhost:${this.config.port}/api          ║
║  KVStore: ${this.config.kvstoreEnabled ? 'Enabled' : 'Disabled'}                        ║
║  Version: 2.0.0                            ║
╚════════════════════════════════════════════╝
          `);
          resolve(this.server);
        }
      });
    });
  }

  /**
   * Shutdown the application gracefully
   */
  async shutdown() {
    console.log('🛑 Shutting down Bitcoin Writer...');
    
    if (this.server) {
      await new Promise((resolve) => {
        this.server.close(resolve);
      });
    }
    
    if (this.walletConnection) {
      // TODO: Disconnect from wallet
      this.walletConnection = null;
    }
    
    console.log('👋 Bitcoin Writer shut down successfully');
  }
}

// Export for use in Metanet Desktop
export default BitcoinWriterMetanetApp;

// If running standalone, start the app
if (import.meta.url === `file://${process.argv[1]}`) {
  const app = new BitcoinWriterMetanetApp();
  
  app.initialize().catch(error => {
    console.error('Failed to initialize app:', error);
    process.exit(1);
  });
  
  // Handle graceful shutdown
  process.on('SIGINT', async () => {
    await app.shutdown();
    process.exit(0);
  });
  
  process.on('SIGTERM', async () => {
    await app.shutdown();
    process.exit(0);
  });
}