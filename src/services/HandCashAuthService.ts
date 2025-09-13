// HandCash Authentication Service - REST API Implementation
// This service handles OAuth2 flow with HandCash without SDK dependencies

export interface HandCashConfig {
  appId: string;
  appSecret?: string;
  redirectUrl: string;
  environment: 'production' | 'development';
}

export interface HandCashUser {
  handle: string;
  paymail: string;
  publicKey?: string;
  avatarUrl?: string;
  displayName?: string;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken?: string;
  expiresIn?: number;
  tokenType?: string;
}

export class HandCashAuthService {
  private config: HandCashConfig;
  private currentUser: HandCashUser | null = null;
  private tokens: AuthTokens | null = null;
  
  // HandCash API endpoints
  private readonly HANDCASH_AUTH_URL = 'https://app.handcash.io/auth/authorize';
  private readonly HANDCASH_API_BASE = 'https://api.handcash.io';
  private readonly HANDCASH_CONNECT_BASE = 'https://connect.handcash.io/v3';

  constructor() {
    // Initialize configuration from environment variables
    this.config = {
      appId: process.env.REACT_APP_HANDCASH_APP_ID || '',
      appSecret: process.env.REACT_APP_HANDCASH_APP_SECRET,
      redirectUrl: process.env.REACT_APP_HANDCASH_REDIRECT_URL || `${window.location.origin}/auth/handcash/callback`,
      environment: process.env.NODE_ENV === 'production' ? 'production' : 'development'
    };

    // Load existing session if available
    this.loadSession();
  }

  // Load session from localStorage
  private loadSession(): void {
    try {
      const savedTokens = localStorage.getItem('handcash_tokens');
      const savedUser = localStorage.getItem('handcash_user');
      
      if (savedTokens && savedUser) {
        const tokens = JSON.parse(savedTokens);
        const user = JSON.parse(savedUser);
        
        // Clear old sessions with generic "handcash_user" handle
        if (user.handle === 'handcash_user') {
          console.log('Clearing old session with generic username');
          this.clearSession();
          return;
        }
        
        // Validate session is not expired
        if (this.isSessionValid(tokens)) {
          this.tokens = tokens;
          this.currentUser = user;
        } else {
          // Clear expired session
          this.clearSession();
        }
      }
    } catch (error) {
      console.error('Failed to load session:', error);
      this.clearSession();
    }
  }

  // Check if session is still valid
  private isSessionValid(tokens: AuthTokens): boolean {
    if (!tokens.accessToken) return false;
    
    // If we have expiry info, check it
    if (tokens.expiresIn) {
      const savedAt = localStorage.getItem('handcash_tokens_saved_at');
      if (savedAt) {
        const expiryTime = parseInt(savedAt) + (tokens.expiresIn * 1000);
        return Date.now() < expiryTime;
      }
    }
    
    // Default to valid if we can't determine
    return true;
  }

  // Save session to localStorage
  private saveSession(): void {
    if (this.tokens) {
      localStorage.setItem('handcash_tokens', JSON.stringify(this.tokens));
      localStorage.setItem('handcash_tokens_saved_at', Date.now().toString());
    }
    if (this.currentUser) {
      localStorage.setItem('handcash_user', JSON.stringify(this.currentUser));
    }
  }

  // Clear session
  private clearSession(): void {
    this.tokens = null;
    this.currentUser = null;
    localStorage.removeItem('handcash_tokens');
    localStorage.removeItem('handcash_tokens_saved_at');
    localStorage.removeItem('handcash_user');
    // Also clear old format data
    localStorage.removeItem('handcash_auth_token');
    // Clear sessionStorage too
    sessionStorage.clear();
  }

  // Generate HandCash authorization URL
  public getAuthorizationUrl(): string {
    if (!this.config.appId) {
      throw new Error('HandCash App ID is not configured');
    }

    // According to HandCash documentation, the correct format is:
    // https://app.handcash.io/#/authorizeApp?appId=${appId}
    // The redirect URL is configured in the HandCash dashboard, not passed as parameter
    
    const authUrl = `https://app.handcash.io/#/authorizeApp?appId=${this.config.appId}`;
    
    // Store state for CSRF protection (even though HandCash doesn't use it in the URL)
    this.generateState();
    
    return authUrl;
  }

  // Generate random state for CSRF protection
  private generateState(): string {
    const state = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    sessionStorage.setItem('handcash_oauth_state', state);
    return state;
  }

  // Start OAuth login flow
  public async login(): Promise<void> {
    try {
      const authUrl = this.getAuthorizationUrl();
      console.log('=== HandCash OAuth2 Authentication ===');
      console.log('App ID:', this.config.appId);
      console.log('Redirect URL:', this.config.redirectUrl);
      console.log('Authorization URL:', authUrl);
      console.log('=====================================');
      
      // Redirect to HandCash for authorization
      window.location.href = authUrl;
    } catch (error) {
      console.error('Failed to start OAuth flow:', error);
      throw error;
    }
  }

  // Handle HandCash callback - HandCash returns authToken directly
  public async handleCallback(callbackUrl: string): Promise<HandCashUser> {
    try {
      console.log('=== HandCash Callback Handler ===');
      console.log('Full callback URL:', callbackUrl);
      
      const url = new URL(callbackUrl);
      
      // HandCash returns the authToken in the hash fragment
      // Format: #authToken=xxx or sometimes just #xxx
      let authToken: string | null = null;
      
      // First check hash fragment
      if (url.hash) {
        const hashContent = url.hash.substring(1); // Remove #
        console.log('Hash content:', hashContent);
        
        // Check if it's a parameter format (#authToken=xxx)
        if (hashContent.includes('=')) {
          const hashParams = new URLSearchParams(hashContent);
          authToken = hashParams.get('authToken') || hashParams.get('token');
        } else if (hashContent.length > 20) {
          // Might be just the token (#xxx)
          authToken = hashContent;
        }
      }
      
      // Also check query params as fallback
      if (!authToken) {
        const urlParams = new URLSearchParams(url.search);
        authToken = urlParams.get('authToken') || 
                   urlParams.get('auth_token') ||
                   urlParams.get('token');
      }
      
      // Check for errors
      const urlParams = new URLSearchParams(url.search);
      const hashParams = url.hash ? new URLSearchParams(url.hash.substring(1)) : new URLSearchParams();
      const error = urlParams.get('error') || hashParams.get('error');
      
      console.log('Extracted authToken:', authToken);
      console.log('Found error:', error);
      
      // Check for errors
      if (error) {
        const errorDescription = urlParams.get('error_description') || hashParams.get('error_description');
        throw new Error(`HandCash error: ${error} - ${errorDescription || 'Unknown error'}`);
      }
      
      if (!authToken) {
        console.error('No authToken found in callback URL');
        console.log('URL hash:', url.hash);
        console.log('URL search:', url.search);
        throw new Error('No authToken received from HandCash. Check the console for debug information.');
      }
      
      // HandCash directly provides the authToken, no exchange needed
      this.tokens = {
        accessToken: authToken,
        tokenType: 'Bearer'
      };
      
      // Try to fetch user profile using the authToken
      const user = await this.fetchUserProfile();
      this.currentUser = user;
      
      // Save session
      this.saveSession();
      
      return user;
    } catch (error) {
      console.error('Callback handling failed:', error);
      throw error;
    }
  }

  // Fetch user profile from HandCash
  private async fetchUserProfile(): Promise<HandCashUser> {
    if (!this.tokens?.accessToken) {
      throw new Error('No access token available');
    }

    // Try to decode the authToken if it's a JWT
    try {
      const tokenParts = this.tokens.accessToken.split('.');
      if (tokenParts.length === 3) {
        const payload = JSON.parse(atob(tokenParts[1]));
        console.log('Decoded token payload:', payload);
        
        if (payload.handle || payload.user || payload.username) {
          return {
            handle: payload.handle || payload.user || payload.username,
            paymail: payload.paymail || `${payload.handle || payload.user || 'user'}@handcash.io`,
            publicKey: payload.publicKey || payload.id,
            avatarUrl: payload.avatarUrl || payload.avatar,
            displayName: payload.displayName || payload.name
          };
        }
      }
    } catch (decodeError) {
      console.log('Token is not a JWT or could not be decoded');
    }
    
    // Fallback - create a unique identifier from the token
    console.warn('Using fallback user data - Enable API endpoint for real profile');
    
    // Generate a consistent username from the token
    const tokenHash = this.tokens.accessToken.substring(0, 8).toLowerCase();
    const fallbackHandle = `user_${tokenHash}`;
    
    return {
      handle: fallbackHandle,
      paymail: `${fallbackHandle}@handcash.io`,
      publicKey: this.tokens.accessToken.substring(0, 20),
      avatarUrl: undefined,
      displayName: `User ${tokenHash.toUpperCase()}`
    };
  }

  // Make authenticated API request
  public async makeAuthenticatedRequest(endpoint: string, options: RequestInit = {}): Promise<any> {
    if (!this.tokens?.accessToken) {
      throw new Error('Not authenticated');
    }

    const response = await fetch(endpoint, {
      ...options,
      headers: {
        ...options.headers,
        'Authorization': `${this.tokens.tokenType || 'Bearer'} ${this.tokens.accessToken}`,
        'Accept': 'application/json'
      }
    });

    if (!response.ok) {
      if (response.status === 401) {
        // Token expired, clear session
        this.clearSession();
        throw new Error('Authentication expired, please login again');
      }
      throw new Error(`API request failed: ${response.statusText}`);
    }

    return response.json();
  }

  // Public methods
  public logout(): void {
    this.clearSession();
  }

  public isAuthenticated(): boolean {
    return this.tokens !== null && this.currentUser !== null;
  }

  public getCurrentUser(): HandCashUser | null {
    return this.currentUser;
  }

  public getAccessToken(): string | null {
    return this.tokens?.accessToken || null;
  }
}