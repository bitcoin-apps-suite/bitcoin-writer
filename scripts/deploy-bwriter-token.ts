#!/usr/bin/env ts-node

/**
 * BWRITER Token Deployment Script
 * Deploys the official Bitcoin Writer platform token to BSV blockchain
 * 
 * Usage: npm run deploy-token [founder-address]
 */

import { BWRITERTokenService } from '../services/BWRITERTokenService';
import { BSVStorageService } from '../services/BSVStorageService';
import { HandCashService } from '../services/HandCashService';
import { DocumentInscriptionService } from '../services/DocumentInscriptionService';

const FOUNDER_ADDRESS = process.argv[2] || 'founder_address_placeholder';

async function deployBWRITERToken() {
  console.log('🚀 Starting BWRITER Token Deployment');
  console.log('=' .repeat(60));
  console.log(`📍 Founder Address: ${FOUNDER_ADDRESS}`);
  console.log(`⏰ Deployment Time: ${new Date().toISOString()}`);
  console.log('=' .repeat(60));

  try {
    // Initialize services
    console.log('🔧 Initializing blockchain services...');
    
    const bsvStorage = new BSVStorageService();
    const handCash = new HandCashService();
    const inscription = new DocumentInscriptionService({
      network: 'mainnet',
      feeRate: 1,
      enableBatching: true
    });

    // Initialize token service
    const tokenService = new BWRITERTokenService(
      bsvStorage,
      handCash, 
      inscription
    );

    console.log('✅ Services initialized successfully');
    console.log('');

    // Deploy the complete BWRITER token ecosystem
    console.log('🌟 Deploying BWRITER Token Ecosystem...');
    const deployment = await tokenService.initializeBWRITERTokenSystem(FOUNDER_ADDRESS);

    console.log('');
    console.log('🎉 DEPLOYMENT SUCCESSFUL!');
    console.log('=' .repeat(60));
    
    // Token Details
    console.log('📊 TOKEN DETAILS:');
    console.log(`   Name: ${deployment.token.name}`);
    console.log(`   Symbol: ${deployment.token.symbol}`);
    console.log(`   Total Supply: ${deployment.token.totalSupply.toLocaleString()} BWRITER`);
    console.log(`   Decimals: ${deployment.token.decimals}`);
    console.log(`   Deployment TX: ${deployment.token.deploymentTxId}`);
    console.log('');

    // Founder Allocation
    console.log('👑 FOUNDER ALLOCATION:');
    console.log(`   Recipient: ${deployment.founderAllocation.recipientName}`);
    console.log(`   Address: ${deployment.founderAllocation.recipientAddress}`);
    console.log(`   Amount: ${deployment.founderAllocation.amount.toLocaleString()} BWRITER`);
    console.log(`   Percentage: ${deployment.founderAllocation.percentage}%`);
    console.log(`   Allocation TX: ${deployment.founderAllocation.txId}`);
    console.log('');

    // Cap Table Summary
    console.log('📋 CAP TABLE SUMMARY:');
    deployment.capTable.forEach(entry => {
      console.log(`   ${entry.holderName}: ${entry.percentage}% (${entry.currentBalance.toLocaleString()} BWRITER)`);
    });
    console.log('');

    // Blockchain Verification Links
    console.log('🔗 BLOCKCHAIN VERIFICATION:');
    console.log(`   Token Contract: https://whatsonchain.com/tx/${deployment.token.deploymentTxId}`);
    console.log(`   Founder Allocation: https://whatsonchain.com/tx/${deployment.founderAllocation.txId}`);
    console.log(`   BSV Explorer: https://whatsonchain.com/`);
    console.log('');

    // Next Steps
    console.log('📝 NEXT STEPS:');
    console.log('   1. Add /captable route to navigation');
    console.log('   2. Update contracts page with real token bounties');
    console.log('   3. Integrate wallet functionality for transfers');
    console.log('   4. Set up automated bounty distribution');
    console.log('   5. Deploy to production environment');
    console.log('');

    console.log('=' .repeat(60));
    console.log('✨ BWRITER Token is now live on BSV blockchain!');
    console.log('🌐 View cap table at: /captable');
    console.log('💼 Claim contracts at: /contracts');
    console.log('=' .repeat(60));

    // Write deployment results to file
    const deploymentRecord = {
      deployment_date: new Date().toISOString(),
      token: deployment.token,
      founder_allocation: deployment.founderAllocation,
      cap_table: deployment.capTable,
      blockchain_proofs: {
        token_deployment: `https://whatsonchain.com/tx/${deployment.token.deploymentTxId}`,
        founder_allocation: `https://whatsonchain.com/tx/${deployment.founderAllocation.txId}`
      }
    };

    // Save to local file for reference
    const fs = require('fs');
    fs.writeFileSync(
      './bwriter-token-deployment.json',
      JSON.stringify(deploymentRecord, null, 2)
    );

    console.log('💾 Deployment record saved to: ./bwriter-token-deployment.json');

  } catch (error) {
    console.error('');
    console.error('❌ DEPLOYMENT FAILED:');
    console.error('=' .repeat(60));
    console.error(error);
    console.error('=' .repeat(60));
    console.error('');
    console.error('🔧 Troubleshooting:');
    console.error('   1. Check BSV network connectivity');
    console.error('   2. Verify HandCash service authentication');
    console.error('   3. Ensure sufficient balance for transactions');
    console.error('   4. Review service configurations');
    process.exit(1);
  }
}

// Run deployment if this script is executed directly
if (require.main === module) {
  deployBWRITERToken().catch(console.error);
}

export { deployBWRITERToken };