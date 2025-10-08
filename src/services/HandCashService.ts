// HandCash Service - Simplified wrapper using HandCashAuthService
// This maintains backward compatibility while using the new REST API implementation

import { HandCashAuthService } from './HandCashAuthService';
import type { HandCashUser } from './HandCashAuthService';

export type { HandCashUser };

export class HandCashService {
  private authService: HandCashAuthService;

  constructor() {
    this.authService = new HandCashAuthService();
  }

  // Start the login flow
  async login(): Promise<void> {
    return this.authService.login();
  }

  // Handle OAuth callback - token is passed directly
  async handleCallback(authToken: string): Promise<HandCashUser> {
    console.log('HandCashService.handleCallback called with token:', authToken.substring(0, 20) + '...');
    
    // Store the token directly
    this.authService.tokens = {
      accessToken: authToken,
      tokenType: 'Bearer'
    };
    
    // Fetch user profile
    const user = await this.authService.fetchUserProfile();
    this.authService.currentUser = user;
    
    // Save session
    this.authService.saveSession();
    
    return user;
  }

  // Logout
  logout(): void {
    this.authService.logout();
  }

  // Check if user is logged in
  isAuthenticated(): boolean {
    return this.authService.isAuthenticated();
  }

  // Get current user
  getCurrentUser(): HandCashUser | null {
    return this.authService.getCurrentUser();
  }

  // Get access token for blockchain operations
  getAccessToken(): string | null {
    return this.authService.getAccessToken();
  }

  // Make authenticated request
  async makeAuthenticatedRequest(endpoint: string, options: RequestInit = {}): Promise<any> {
    return this.authService.makeAuthenticatedRequest(endpoint, options);
  }

  // Request magic link authentication via email
  async requestMagicLink(email: string): Promise<{ success: boolean; message: string }> {
    return this.authService.requestMagicLink(email);
  }

  // Handle magic link callback
  async handleMagicLinkCallback(token: string): Promise<HandCashUser> {
    return this.authService.handleMagicLinkCallback(token);
  }

  // Transaction-related methods for BSV protocol integration

  /**
   * Get UTXOs for transaction funding
   */
  async getUtxos(): Promise<UTXO[]> {
    try {
      const response = await this.makeAuthenticatedRequest('/wallet/utxos');
      return response.utxos || [];
    } catch (error) {
      console.error('Failed to get UTXOs:', error);
      throw new Error('Unable to fetch UTXOs for transaction funding');
    }
  }

  /**
   * Get receive address for change outputs
   */
  async getReceiveAddress(): Promise<string> {
    try {
      const response = await this.makeAuthenticatedRequest('/wallet/address');
      return response.address;
    } catch (error) {
      console.error('Failed to get receive address:', error);
      throw new Error('Unable to get receive address');
    }
  }

  /**
   * Sign transaction using HandCash
   */
  async signTransaction(transaction: any): Promise<void> {
    try {
      // Get private key or use HandCash signing API
      const response = await this.makeAuthenticatedRequest('/wallet/sign', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          transaction: transaction.toString()
        })
      });

      if (response.signedTransaction) {
        // Update transaction with signed version
        Object.assign(transaction, response.signedTransaction);
      }
    } catch (error) {
      console.error('Failed to sign transaction:', error);
      throw new Error('Unable to sign transaction with HandCash');
    }
  }

  /**
   * Broadcast transaction to BSV network
   */
  async broadcastTransaction(transaction: any): Promise<{ txId: string }> {
    try {
      const response = await this.makeAuthenticatedRequest('/wallet/broadcast', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          transaction: transaction.toString()
        })
      });

      if (!response.txId) {
        throw new Error('No transaction ID returned from broadcast');
      }

      return { txId: response.txId };
    } catch (error) {
      console.error('Failed to broadcast transaction:', error);
      throw new Error('Unable to broadcast transaction to BSV network');
    }
  }

  /**
   * Get wallet balance
   */
  async getBalance(): Promise<{ satoshis: number; usd: number }> {
    try {
      const response = await this.makeAuthenticatedRequest('/wallet/balance');
      return {
        satoshis: response.satoshis || 0,
        usd: response.usd || 0
      };
    } catch (error) {
      console.error('Failed to get wallet balance:', error);
      return { satoshis: 0, usd: 0 };
    }
  }
}

// UTXO interface for transaction inputs
export interface UTXO {
  txId: string;
  outputIndex: number;
  script: string;
  satoshis: number;
}