/**
 * Task Contract Service
 * Manages developer task assignments with smart contracts
 */

interface TaskContract {
  taskId: string;
  githubIssueNumber: number;
  githubUsername: string;
  handCashHandle: string;
  tokenReward: number; // Percentage of total tokens
  tokenAmount: number; // Actual token amount
  deadline: Date;
  status: 'pending' | 'active' | 'completed' | 'expired' | 'disputed';
  signedAt?: Date;
  completedAt?: Date;
  prUrl?: string;
  contractHash?: string;
}

interface ContractSignature {
  githubId: string;
  handCashHandle: string;
  timestamp: number;
  signature: string;
}

export class TaskContractService {
  private contracts: Map<string, TaskContract> = new Map();
  private readonly CONTRACT_DURATION_DAYS = 30; // Default 30 days to complete
  private readonly TOTAL_TOKENS = 1000000000; // 1 billion tokens

  /**
   * Create a new task contract
   */
  async createContract(
    taskId: string,
    githubIssueNumber: number,
    githubUsername: string,
    handCashHandle: string,
    tokenRewardPercentage: number,
    customDeadlineDays?: number
  ): Promise<TaskContract> {
    const deadline = new Date();
    deadline.setDate(deadline.getDate() + (customDeadlineDays || this.CONTRACT_DURATION_DAYS));

    const contract: TaskContract = {
      taskId,
      githubIssueNumber,
      githubUsername,
      handCashHandle,
      tokenReward: tokenRewardPercentage,
      tokenAmount: Math.floor(this.TOTAL_TOKENS * (tokenRewardPercentage / 100)),
      deadline,
      status: 'pending',
      signedAt: undefined
    };

    // Generate contract hash
    contract.contractHash = await this.generateContractHash(contract);
    
    this.contracts.set(taskId, contract);
    return contract;
  }

  /**
   * Sign a task contract
   */
  async signContract(
    taskId: string,
    signature: ContractSignature
  ): Promise<TaskContract> {
    const contract = this.contracts.get(taskId);
    if (!contract) {
      throw new Error('Contract not found');
    }

    if (contract.status !== 'pending') {
      throw new Error('Contract already signed or expired');
    }

    // Verify signature
    const isValid = await this.verifySignature(contract, signature);
    if (!isValid) {
      throw new Error('Invalid signature');
    }

    contract.status = 'active';
    contract.signedAt = new Date();

    // Store on blockchain (mock for now)
    await this.storeContractOnBlockchain(contract);

    return contract;
  }

  /**
   * Complete a task contract when PR is merged
   */
  async completeContract(
    taskId: string,
    prUrl: string
  ): Promise<TaskContract> {
    const contract = this.contracts.get(taskId);
    if (!contract) {
      throw new Error('Contract not found');
    }

    if (contract.status !== 'active') {
      throw new Error('Contract not active');
    }

    contract.status = 'completed';
    contract.completedAt = new Date();
    contract.prUrl = prUrl;

    // Trigger token distribution
    await this.distributeTokens(contract);

    return contract;
  }

  /**
   * Check and expire overdue contracts
   */
  async checkExpiredContracts(): Promise<void> {
    const now = new Date();
    
    for (const [taskId, contract] of Array.from(this.contracts.entries())) {
      if (contract.status === 'active' && contract.deadline < now) {
        contract.status = 'expired';
        // Release the task for others to claim
        await this.releaseTask(taskId);
      }
    }
  }

  /**
   * Generate contract hash for verification
   */
  private async generateContractHash(contract: TaskContract): Promise<string> {
    const contractData = {
      taskId: contract.taskId,
      githubIssueNumber: contract.githubIssueNumber,
      githubUsername: contract.githubUsername,
      handCashHandle: contract.handCashHandle,
      tokenReward: contract.tokenReward,
      deadline: contract.deadline.toISOString()
    };

    const encoder = new TextEncoder();
    const data = encoder.encode(JSON.stringify(contractData));
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    
    return hashHex;
  }

  /**
   * Verify contract signature
   */
  private async verifySignature(
    contract: TaskContract,
    signature: ContractSignature
  ): Promise<boolean> {
    // Verify GitHub ID matches
    if (signature.githubId !== contract.githubUsername) {
      return false;
    }

    // Verify HandCash handle matches
    if (signature.handCashHandle !== contract.handCashHandle) {
      return false;
    }

    // TODO: Implement actual signature verification with HandCash
    // For now, return true if basic checks pass
    return true;
  }

  /**
   * Store contract on blockchain
   */
  private async storeContractOnBlockchain(contract: TaskContract): Promise<void> {
    // TODO: Implement actual blockchain storage
    console.log('Storing contract on blockchain:', contract.contractHash);
    
    // Mock implementation
    localStorage.setItem(
      `contract_${contract.taskId}`,
      JSON.stringify(contract)
    );
  }

  /**
   * Distribute tokens to developer
   */
  private async distributeTokens(contract: TaskContract): Promise<void> {
    // TODO: Implement actual token distribution
    console.log(`Distributing ${contract.tokenAmount} tokens to ${contract.handCashHandle}`);
    
    // Mock implementation - record distribution
    const distributions = JSON.parse(
      localStorage.getItem('token_distributions') || '[]'
    );
    
    distributions.push({
      taskId: contract.taskId,
      recipient: contract.handCashHandle,
      amount: contract.tokenAmount,
      timestamp: new Date().toISOString()
    });
    
    localStorage.setItem('token_distributions', JSON.stringify(distributions));
  }

  /**
   * Release task for others to claim
   */
  private async releaseTask(taskId: string): Promise<void> {
    console.log(`Releasing task ${taskId} for others to claim`);
    // TODO: Update GitHub issue status
    // TODO: Notify original assignee
  }

  /**
   * Get contract by task ID
   */
  getContract(taskId: string): TaskContract | undefined {
    return this.contracts.get(taskId);
  }

  /**
   * Get all contracts for a GitHub user
   */
  getContractsByGithubUser(username: string): TaskContract[] {
    return Array.from(this.contracts.values()).filter(
      contract => contract.githubUsername === username
    );
  }

  /**
   * Get all active contracts
   */
  getActiveContracts(): TaskContract[] {
    return Array.from(this.contracts.values()).filter(
      contract => contract.status === 'active'
    );
  }

  /**
   * Calculate time remaining for a contract
   */
  getTimeRemaining(contract: TaskContract): {
    days: number;
    hours: number;
    minutes: number;
    expired: boolean;
  } {
    const now = new Date();
    const diff = contract.deadline.getTime() - now.getTime();
    
    if (diff <= 0) {
      return { days: 0, hours: 0, minutes: 0, expired: true };
    }

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

    return { days, hours, minutes, expired: false };
  }
}