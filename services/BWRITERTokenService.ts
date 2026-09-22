/**
 * BWRITER Token Service
 * Deploys and manages the official Bitcoin Writer platform token
 * Uses BSV blockchain infrastructure for real token issuance
 */

import { BSVStorageService } from './BSVStorageService';
import { HandCashService } from './HandCashService';
import { DocumentInscriptionService } from './DocumentInscriptionService';

export interface BWRITERToken {
  name: string;
  symbol: string;
  totalSupply: number;
  decimals: number;
  deployedAt: string;
  deploymentTxId: string;
  contractAddress?: string;
  metadata: TokenMetadata;
}

export interface TokenMetadata {
  description: string;
  website: string;
  logo: string;
  social: {
    twitter: string;
    discord: string;
    github: string;
  };
  tokenomics: {
    totalSupply: number;
    founderAllocation: number; // 3%
    bountyPool: number; // 40%
    treasury: number; // 30%
    community: number; // 27%
  };
}

export interface TokenAllocation {
  recipientAddress: string;
  recipientName: string;
  amount: number;
  percentage: number;
  category: 'founder' | 'bounty' | 'treasury' | 'community';
  reason: string;
  txId: string;
  allocatedAt: string;
  vestingSchedule?: VestingSchedule;
}

export interface VestingSchedule {
  totalAmount: number;
  cliffMonths: number;
  vestingMonths: number;
  startDate: string;
  claimedAmount: number;
}

export interface CapTableEntry {
  holderAddress: string;
  holderName: string;
  currentBalance: number;
  totalAllocated: number;
  percentage: number;
  category: string;
  firstAllocation: string;
  lastUpdate: string;
  isFounder: boolean;
}

export class BWRITERTokenService {
  private bsvStorage: BSVStorageService;
  private handCash: HandCashService;
  private inscription: DocumentInscriptionService;
  private allocations: Map<string, TokenAllocation[]> = new Map();

  constructor(
    bsvStorage: BSVStorageService,
    handCash: HandCashService,
    inscription: DocumentInscriptionService
  ) {
    this.bsvStorage = bsvStorage;
    this.handCash = handCash;
    this.inscription = inscription;
  }

  /**
   * Persist a $BWRITER record on chain and return its transaction id.
   *
   * ⚠ ALWAYS PLAINTEXT, ALWAYS IMMEDIATELY READABLE, NEVER FOR SALE. These are ownership
   * records — a deployment, an allocation, a cap table. Their whole value is that anyone
   * can read them and check them, so encryption, timelocks and paywalls are all wrong here
   * by definition, and stating that once means no call site can quietly differ.
   */
  private async storeRecord(record: unknown, title: string): Promise<string> {
    const result = await this.bsvStorage.storeDocumentWithOptions(
      JSON.stringify(record),
      {
        storageMethod: 'direct',
        encryption: false,
        unlockConditions: { method: 'immediate' },
        monetization: { enableAsset: false },
        metadata: { title, category: 'bwriter-record' },
      },
      'bitcoin-writer',
    );
    return result.transactionId;
  }

  /**
   * Deploy the official BWRITER token to BSV blockchain
   */
  async deployBWRITERToken(): Promise<BWRITERToken> {
    const tokenMetadata: TokenMetadata = {
      description: "Official token of the Bitcoin Writer platform - a decentralized writing and publishing ecosystem built on BSV blockchain",
      website: "https://thebitcoincorporation.website",
      logo: "https://thebitcoincorporation.website/bitcoin-writer-logo.jpg",
      social: {
        twitter: "https://x.com/bitcoin_writer",
        discord: "https://discord.gg/xBB8r8dj",
        github: "https://github.com/bitcoin-apps-suite/bitcoin-writer"
      },
      tokenomics: {
        totalSupply: 1000000000, // 1 billion tokens
        founderAllocation: 30000000, // 3% - 30M tokens
        bountyPool: 400000000, // 40% - 400M tokens
        treasury: 300000000, // 30% - 300M tokens
        community: 270000000 // 27% - 270M tokens
      }
    };

    const token: BWRITERToken = {
      name: "Bitcoin Writer Token",
      symbol: "BWRITER",
      totalSupply: 1000000000,
      decimals: 8,
      deployedAt: new Date().toISOString(),
      deploymentTxId: '',
      metadata: tokenMetadata
    };

    // Create token deployment inscription
    const deploymentData = {
      type: 'token_deployment',
      token: token,
      deployedBy: 'Bitcoin Writer Foundation',
      deployment_method: 'BSV_Inscription',
      timestamp: Date.now()
    };

    console.log('🚀 Deploying BWRITER token to BSV blockchain...');
    
    try {
      // Deploy token contract to blockchain
      const txId = await this.storeRecord(deploymentData, '$BWRITER token deployment');

      token.deploymentTxId = txId;
      
      console.log(`✅ BWRITER token deployed successfully!`);
      console.log(`📄 Contract TX ID: ${txId}`);
      console.log(`🔗 Explorer: https://whatsonchain.com/tx/${txId}`);
      console.log(`💰 Total Supply: ${token.totalSupply.toLocaleString()} BWRITER`);

      // Store token registry
      await this.storeTokenRegistry(token);

      return token;

    } catch (error) {
      console.error('❌ Token deployment failed:', error);
      throw new Error(`Token deployment failed: ${error}`);
    }
  }

  /**
   * Allocate founder tokens (3% to platform creator)
   */
  async allocateFounderTokens(
    founderAddress: string,
    founderName: string = 'Platform Founder'
  ): Promise<TokenAllocation> {
    const allocation: TokenAllocation = {
      recipientAddress: founderAddress,
      recipientName: founderName,
      amount: 30000000, // 30M tokens = 3%
      percentage: 3.0,
      category: 'founder',
      reason: 'Platform development, blockchain infrastructure, and core feature implementation',
      txId: '',
      allocatedAt: new Date().toISOString()
    };

    console.log('👑 Allocating founder tokens...');
    console.log(`📍 Recipient: ${founderName} (${founderAddress})`);
    console.log(`💰 Amount: ${allocation.amount.toLocaleString()} BWRITER (${allocation.percentage}%)`);

    try {
      // Create allocation transaction
      const allocationData = {
        type: 'token_allocation',
        allocation: allocation,
        allocation_proof: {
          timestamp: Date.now(),
          allocator: 'Bitcoin Writer Foundation',
          authorization: 'Founder Equity Distribution'
        }
      };

      const txId = await this.storeRecord(allocationData, '$BWRITER allocation');

      allocation.txId = txId;

      // Record allocation
      this.recordAllocation(allocation);

      console.log(`✅ Founder allocation completed!`);
      console.log(`📄 Allocation TX ID: ${txId}`);
      console.log(`🔗 Proof: https://whatsonchain.com/tx/${txId}`);

      return allocation;

    } catch (error) {
      console.error('❌ Founder allocation failed:', error);
      throw new Error(`Founder allocation failed: ${error}`);
    }
  }

  /**
   * Create initial cap table with founder allocation
   */
  async createCapTable(): Promise<CapTableEntry[]> {
    const capTable: CapTableEntry[] = [
      {
        holderAddress: 'founder_address_placeholder',
        holderName: 'Platform Founder',
        currentBalance: 30000000,
        totalAllocated: 30000000,
        percentage: 3.0,
        category: 'Founder',
        firstAllocation: new Date().toISOString(),
        lastUpdate: new Date().toISOString(),
        isFounder: true
      },
      {
        holderAddress: 'bounty_pool_address',
        holderName: 'Developer Bounty Pool',
        currentBalance: 400000000,
        totalAllocated: 400000000,
        percentage: 40.0,
        category: 'Bounty Pool',
        firstAllocation: new Date().toISOString(),
        lastUpdate: new Date().toISOString(),
        isFounder: false
      },
      {
        holderAddress: 'treasury_address',
        holderName: 'Platform Treasury',
        currentBalance: 300000000,
        totalAllocated: 300000000,
        percentage: 30.0,
        category: 'Treasury',
        firstAllocation: new Date().toISOString(),
        lastUpdate: new Date().toISOString(),
        isFounder: false
      },
      {
        holderAddress: 'community_address',
        holderName: 'Community Rewards',
        currentBalance: 270000000,
        totalAllocated: 270000000,
        percentage: 27.0,
        category: 'Community',
        firstAllocation: new Date().toISOString(),
        lastUpdate: new Date().toISOString(),
        isFounder: false
      }
    ];

    // Store cap table on blockchain
    const capTableData = {
      type: 'cap_table',
      version: '1.0',
      created_at: new Date().toISOString(),
      total_supply: 1000000000,
      entries: capTable
    };

    const txId = await this.storeRecord(capTableData, '$BWRITER cap table');

    console.log(`📊 Cap table created and stored on blockchain`);
    console.log(`📄 Cap Table TX ID: ${txId}`);
    console.log(`🔗 Proof: https://whatsonchain.com/tx/${txId}`);

    return capTable;
  }

  /**
   * Distribute bounty tokens to contract claimants
   */
  async distributeBountyTokens(
    recipientAddress: string,
    amount: number,
    contractId: string,
    issueNumber: number
  ): Promise<TokenAllocation> {
    const allocation: TokenAllocation = {
      recipientAddress,
      recipientName: `Developer (Issue #${issueNumber})`,
      amount,
      percentage: (amount / 1000000000) * 100,
      category: 'bounty',
      reason: `Contract completion for GitHub Issue #${issueNumber}`,
      txId: '',
      allocatedAt: new Date().toISOString()
    };

    console.log('🎯 Distributing bounty tokens...');
    console.log(`📍 Recipient: ${recipientAddress}`);
    console.log(`💰 Amount: ${amount.toLocaleString()} BWRITER`);
    console.log(`📋 Contract: ${contractId}`);

    try {
      const bountyData = {
        type: 'bounty_distribution',
        allocation: allocation,
        contract_details: {
          contract_id: contractId,
          issue_number: issueNumber,
          completion_proof: `Contract ${contractId} completed successfully`
        }
      };

      const txId = await this.storeRecord(bountyData, '$BWRITER bounty allocation');

      allocation.txId = txId;
      this.recordAllocation(allocation);

      console.log(`✅ Bounty distribution completed!`);
      console.log(`📄 Distribution TX ID: ${txId}`);

      return allocation;

    } catch (error) {
      console.error('❌ Bounty distribution failed:', error);
      throw new Error(`Bounty distribution failed: ${error}`);
    }
  }

  /**
   * Get current token balance for an address
   */
  async getTokenBalance(address: string): Promise<number> {
    const allocations = this.allocations.get(address) || [];
    return allocations.reduce((total, allocation) => total + allocation.amount, 0);
  }

  /**
   * Get full allocation history for an address
   */
  getAllocations(address: string): TokenAllocation[] {
    return this.allocations.get(address) || [];
  }

  /**
   * Get complete cap table data
   */
  async getCapTable(): Promise<CapTableEntry[]> {
    // In a real implementation, this would query the blockchain
    // For now, return the current allocation state
    const capTable: CapTableEntry[] = [];
    
    for (const [address, allocations] of this.allocations.entries()) {
      const totalAllocated = allocations.reduce((sum, alloc) => sum + alloc.amount, 0);
      const firstAllocation = allocations[0]?.allocatedAt || '';
      const lastUpdate = allocations[allocations.length - 1]?.allocatedAt || '';
      const category = allocations[0]?.category || 'Unknown';

      capTable.push({
        holderAddress: address,
        holderName: allocations[0]?.recipientName || 'Unknown',
        currentBalance: totalAllocated,
        totalAllocated,
        percentage: (totalAllocated / 1000000000) * 100,
        category: category.charAt(0).toUpperCase() + category.slice(1),
        firstAllocation,
        lastUpdate,
        isFounder: category === 'founder'
      });
    }

    return capTable.sort((a, b) => b.percentage - a.percentage);
  }

  /**
   * Store token registry on blockchain
   */
  private async storeTokenRegistry(token: BWRITERToken): Promise<void> {
    const registry = {
      type: 'token_registry',
      version: '1.0',
      token: token,
      created_at: new Date().toISOString()
    };

    await this.storeRecord(registry, '$BWRITER holder registry');
  }

  /**
   * Record allocation in local state
   */
  private recordAllocation(allocation: TokenAllocation): void {
    const existing = this.allocations.get(allocation.recipientAddress) || [];
    existing.push(allocation);
    this.allocations.set(allocation.recipientAddress, existing);
  }

  /**
   * Initialize the complete BWRITER token ecosystem
   */
  async initializeBWRITERTokenSystem(founderAddress: string): Promise<{
    token: BWRITERToken;
    founderAllocation: TokenAllocation;
    capTable: CapTableEntry[];
  }> {
    console.log('🌟 Initializing BWRITER Token Ecosystem...');
    console.log('='.repeat(50));

    // Step 1: Deploy the token
    const token = await this.deployBWRITERToken();

    // Step 2: Allocate founder tokens
    const founderAllocation = await this.allocateFounderTokens(founderAddress);

    // Step 3: Create initial cap table
    const capTable = await this.createCapTable();

    console.log('='.repeat(50));
    console.log('🎉 BWRITER Token Ecosystem Initialized Successfully!');
    console.log(`💰 Total Supply: ${token.totalSupply.toLocaleString()} BWRITER`);
    console.log(`👑 Founder Allocation: ${founderAllocation.amount.toLocaleString()} BWRITER (${founderAllocation.percentage}%)`);
    console.log(`📊 Cap Table Entries: ${capTable.length}`);
    console.log(`🔗 All transactions recorded on BSV blockchain`);

    return {
      token,
      founderAllocation,
      capTable
    };
  }
}

// Export singleton instance
export const bwriterTokenService = new BWRITERTokenService(
  // These will be injected when the service is initialized
  {} as BSVStorageService,
  {} as HandCashService,
  {} as DocumentInscriptionService
);