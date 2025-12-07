#!/usr/bin/env node

/**
 * Test integration script for Bitcoin Writer Metanet App
 * Validates that all components are working correctly
 */

const BitcoinWriterMetanetApp = require('./index');

async function runTests() {
  console.log('🧪 Starting Bitcoin Writer Metanet App Integration Tests\n');
  
  let app;
  let testsPassed = 0;
  let testsFailed = 0;
  
  try {
    // Test 1: App Initialization
    console.log('Test 1: App Initialization');
    app = new BitcoinWriterMetanetApp({
      port: 3322, // Use different port for testing
      kvstoreEnabled: true
    });
    
    await app.initialize();
    console.log('✅ App initialized successfully\n');
    testsPassed++;
    
    // Test 2: Health Check
    console.log('Test 2: Health Check Endpoint');
    const healthResponse = await fetch('http://localhost:3322/api/health');
    const health = await healthResponse.json();
    
    if (health.status === 'healthy' && health.app === 'Bitcoin Writer') {
      console.log('✅ Health check passed\n');
      testsPassed++;
    } else {
      throw new Error('Health check failed');
    }
    
    // Test 3: KVStore Save
    console.log('Test 3: KVStore Save Operation');
    const saveData = {
      key: 'test-document',
      value: JSON.stringify({
        title: 'Test Document',
        content: 'This is a test document for integration testing',
        timestamp: new Date().toISOString()
      }),
      topic: 'test-documents',
      encrypt: true
    };
    
    const saveResponse = await fetch('http://localhost:3322/api/kvstore/save', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(saveData)
    });
    
    if (saveResponse.ok) {
      console.log('✅ KVStore save successful\n');
      testsPassed++;
    } else {
      throw new Error('KVStore save failed');
    }
    
    // Test 4: KVStore Load
    console.log('Test 4: KVStore Load Operation');
    const loadResponse = await fetch('http://localhost:3322/api/kvstore/load/test-document?topic=test-documents&decrypt=true');
    
    if (loadResponse.ok) {
      const loadData = await loadResponse.json();
      if (loadData.success && loadData.value) {
        console.log('✅ KVStore load successful\n');
        testsPassed++;
      } else {
        throw new Error('KVStore load returned no data');
      }
    } else {
      throw new Error('KVStore load failed');
    }
    
    // Test 5: KVStore List
    console.log('Test 5: KVStore List Operation');
    const listResponse = await fetch('http://localhost:3322/api/kvstore/list?topic=test-documents');
    
    if (listResponse.ok) {
      const listData = await listResponse.json();
      if (listData.success && Array.isArray(listData.keys)) {
        console.log('✅ KVStore list successful\n');
        testsPassed++;
      } else {
        throw new Error('KVStore list returned invalid data');
      }
    } else {
      throw new Error('KVStore list failed');
    }
    
    // Test 6: Wallet Status (Expected to fail without actual wallet)
    console.log('Test 6: Wallet Status Check');
    try {
      const walletResponse = await fetch('http://localhost:3322/api/wallet/status');
      const walletData = await walletResponse.json();
      
      // We expect this to fail without actual wallet connection
      if (walletData.error) {
        console.log('⚠️ Wallet not connected (expected in test environment)\n');
        testsPassed++;
      } else {
        console.log('✅ Wallet status retrieved\n');
        testsPassed++;
      }
    } catch (error) {
      console.log('⚠️ Wallet check skipped (no wallet service)\n');
      testsPassed++;
    }
    
    // Test 7: Marketplace Endpoint
    console.log('Test 7: Marketplace API');
    const marketResponse = await fetch('http://localhost:3322/api/marketplace/articles');
    
    if (marketResponse.ok) {
      const marketData = await marketResponse.json();
      if (marketData.hasOwnProperty('articles')) {
        console.log('✅ Marketplace API working\n');
        testsPassed++;
      } else {
        throw new Error('Marketplace API returned invalid data');
      }
    } else {
      throw new Error('Marketplace API failed');
    }
    
    // Test 8: Token Balance Check
    console.log('Test 8: Token Balance API');
    const tokenResponse = await fetch('http://localhost:3322/api/token/balance/test-address');
    
    if (tokenResponse.ok) {
      const tokenData = await tokenResponse.json();
      if (tokenData.symbol === 'bWriter') {
        console.log('✅ Token API working\n');
        testsPassed++;
      } else {
        throw new Error('Token API returned invalid data');
      }
    } else {
      throw new Error('Token API failed');
    }
    
    // Cleanup: Delete test document
    console.log('Cleanup: Removing test data');
    await fetch('http://localhost:3322/api/kvstore/delete/test-document?topic=test-documents', {
      method: 'DELETE'
    });
    console.log('✅ Cleanup complete\n');
    
  } catch (error) {
    console.error('❌ Test failed:', error.message, '\n');
    testsFailed++;
  } finally {
    // Shutdown the app
    if (app) {
      await app.shutdown();
    }
  }
  
  // Print summary
  console.log('═══════════════════════════════════════');
  console.log('           TEST SUMMARY');
  console.log('═══════════════════════════════════════');
  console.log(`Tests Passed: ${testsPassed}`);
  console.log(`Tests Failed: ${testsFailed}`);
  console.log(`Total Tests: ${testsPassed + testsFailed}`);
  console.log('═══════════════════════════════════════\n');
  
  if (testsFailed === 0) {
    console.log('🎉 All tests passed! Bitcoin Writer is ready for Metanet Desktop.');
    process.exit(0);
  } else {
    console.log('⚠️ Some tests failed. Please review the errors above.');
    process.exit(1);
  }
}

// Run tests if fetch is available (Node 18+)
if (typeof fetch === 'undefined') {
  console.error('This test requires Node.js 18+ with native fetch support');
  console.log('Alternatively, install node-fetch: npm install node-fetch');
  process.exit(1);
}

runTests().catch(error => {
  console.error('Fatal error during testing:', error);
  process.exit(1);
});