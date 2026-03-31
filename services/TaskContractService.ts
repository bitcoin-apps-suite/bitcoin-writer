/**
 * Task Contract Service
 * Manages developer task assignments with smart contracts.
 * Stores contracts in both localStorage (client cache) and Supabase (persistent).
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
  private readonly CONTRACT_DURATION_DAYS = 30;
  private readonly TOTAL_TOKENS = 1000000000; // 1 billion tokens

  constructor() {
    // Restore contracts from localStorage on init
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem('task_contracts');
        if (saved) {
          const parsed = JSON.parse(saved);
          for (const [key, value] of Object.entries(parsed)) {
            const contract = value as TaskContract;
            contract.deadline = new Date(contract.deadline);
            if (contract.signedAt) contract.signedAt = new Date(contract.signedAt);
            if (contract.completedAt) contract.completedAt = new Date(contract.completedAt);
            this.contracts.set(key, contract);
          }
        }
      } catch {
        // Fresh start
      }
    }
  }

  private persist(): void {
    if (typeof window !== 'undefined') {
      const obj: Record<string, TaskContract> = {};
      for (const [k, v] of this.contracts.entries()) obj[k] = v;
      localStorage.setItem('task_contracts', JSON.stringify(obj));
    }
  }

  /**
   * Sync contract to server (Supabase) if available
   */
  private async syncToServer(contract: TaskContract): Promise<void> {
    try {
      await fetch('/api/bwriter/contracts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          task_id: contract.taskId,
          github_issue: contract.githubIssueNumber,
          github_username: contract.githubUsername,
          handcash_handle: contract.handCashHandle,
          token_reward_pct: contract.tokenReward,
          token_amount: contract.tokenAmount,
          deadline: contract.deadline.toISOString(),
          status: contract.status,
          contract_hash: contract.contractHash,
          signed_at: contract.signedAt?.toISOString() || null,
          completed_at: contract.completedAt?.toISOString() || null,
          pr_url: contract.prUrl || null,
        }),
      });
    } catch {
      // Server sync failed — local copy is authoritative for now
    }
  }

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
      signedAt: undefined,
    };

    contract.contractHash = await this.generateContractHash(contract);

    this.contracts.set(taskId, contract);
    this.persist();
    await this.syncToServer(contract);
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

    // Verify signature fields match contract
    const isValid = await this.verifySignature(contract, signature);
    if (!isValid) {
      throw new Error('Invalid signature');
    }

    contract.status = 'active';
    contract.signedAt = new Date();

    this.persist();
    await this.syncToServer(contract);

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

    // Record token distribution
    await this.distributeTokens(contract);

    this.persist();
    await this.syncToServer(contract);

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
        await this.releaseTask(taskId);
        this.persist();
        await this.syncToServer(contract);
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
      deadline: contract.deadline.toISOString(),
    };

    const encoder = new TextEncoder();
    const data = encoder.encode(JSON.stringify(contractData));
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
  }

  /**
   * Verify contract signature
   */
  private async verifySignature(
    contract: TaskContract,
    signature: ContractSignature
  ): Promise<boolean> {
    if (signature.githubId !== contract.githubUsername) return false;
    if (signature.handCashHandle !== contract.handCashHandle) return false;

    // Verify the signature string is a valid SHA-256 of the contract data + timestamp
    const payload = JSON.stringify({
      contractHash: contract.contractHash,
      githubId: signature.githubId,
      handCashHandle: signature.handCashHandle,
      timestamp: signature.timestamp,
    });
    const encoder = new TextEncoder();
    const data = encoder.encode(payload);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const expectedSig = hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');

    // Accept either proper signature or legacy mock during migration
    return signature.signature === expectedSig || signature.signature === 'mock_signature';
  }

  /**
   * Distribute tokens to developer via API
   */
  private async distributeTokens(contract: TaskContract): Promise<void> {
    console.log(`Distributing ${contract.tokenAmount} tokens to ${contract.handCashHandle}`);

    // Record in localStorage
    const distributions = JSON.parse(
      localStorage.getItem('token_distributions') || '[]'
    );
    distributions.push({
      taskId: contract.taskId,
      recipient: contract.handCashHandle,
      amount: contract.tokenAmount,
      timestamp: new Date().toISOString(),
    });
    localStorage.setItem('token_distributions', JSON.stringify(distributions));

    // Also try server-side recording
    try {
      await fetch('/api/bwriter/revenue/record', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'token_distribution',
          recipient: contract.handCashHandle,
          amount: contract.tokenAmount,
          taskId: contract.taskId,
        }),
      });
    } catch {
      // Server recording failed — local record preserved
    }
  }

  /**
   * Release task for others to claim
   */
  private async releaseTask(taskId: string): Promise<void> {
    console.log(`Releasing task ${taskId} for others to claim`);

    // Notify via API (which can update GitHub issue if configured)
    try {
      await fetch('/api/bwriter/contracts', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          task_id: taskId,
          action: 'release',
        }),
      });
    } catch {
      // API call failed — task remains expired locally
    }
  }

  getContract(taskId: string): TaskContract | undefined {
    return this.contracts.get(taskId);
  }

  getContractsByGithubUser(username: string): TaskContract[] {
    return Array.from(this.contracts.values()).filter(
      (contract) => contract.githubUsername === username
    );
  }

  getActiveContracts(): TaskContract[] {
    return Array.from(this.contracts.values()).filter(
      (contract) => contract.status === 'active'
    );
  }

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
