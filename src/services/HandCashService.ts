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
}