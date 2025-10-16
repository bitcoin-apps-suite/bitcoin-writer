/**
 * GitHub OAuth Service
 * Manages GitHub authentication for task claims
 */

export interface GitHubUser {
  id: number;
  login: string;
  name: string;
  email: string;
  avatar_url: string;
  html_url: string;
  bio?: string;
  created_at: string;
  public_repos: number;
  followers: number;
  following: number;
}

export class GitHubAuthService {
  private readonly CLIENT_ID = process.env.REACT_APP_GITHUB_CLIENT_ID || '';
  private readonly REDIRECT_URI = process.env.REACT_APP_GITHUB_REDIRECT_URI || 
    'http://localhost:3000/auth/github/callback';
  private readonly OAUTH_URL = 'https://github.com/login/oauth/authorize';
  
  private currentUser: GitHubUser | null = null;
  private accessToken: string | null = null;

  constructor() {
    // Load saved session
    this.loadSession();
  }

  /**
   * Initiate GitHub OAuth flow
   */
  login(): void {
    const params = new URLSearchParams({
      client_id: this.CLIENT_ID,
      redirect_uri: this.REDIRECT_URI,
      scope: 'user:email read:user',
      state: this.generateState()
    });

    window.location.href = `${this.OAUTH_URL}?${params.toString()}`;
  }

  /**
   * Handle OAuth callback
   */
  async handleCallback(code: string, state: string): Promise<GitHubUser> {
    // Verify state to prevent CSRF
    if (!this.verifyState(state)) {
      throw new Error('Invalid state parameter');
    }

    // Exchange code for access token
    const tokenResponse = await fetch('/api/auth/github/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ code })
    });

    if (!tokenResponse.ok) {
      throw new Error('Failed to exchange code for token');
    }

    const { access_token } = await tokenResponse.json();
    this.accessToken = access_token;

    // Fetch user data
    const user = await this.fetchUserData();
    this.currentUser = user;
    
    // Save session
    this.saveSession();

    return user;
  }

  /**
   * Fetch GitHub user data
   */
  private async fetchUserData(): Promise<GitHubUser> {
    if (!this.accessToken) {
      throw new Error('No access token available');
    }

    const response = await fetch('https://api.github.com/user', {
      headers: {
        Authorization: `Bearer ${this.accessToken}`,
        Accept: 'application/json'
      }
    });

    if (!response.ok) {
      throw new Error('Failed to fetch user data');
    }

    return response.json();
  }

  /**
   * Check if user can claim a task
   */
  async canClaimTask(issueNumber: number): Promise<{
    canClaim: boolean;
    reason?: string;
  }> {
    if (!this.currentUser) {
      return { canClaim: false, reason: 'Not authenticated with GitHub' };
    }

    // Check if issue exists and is open
    const issue = await this.getIssue(issueNumber);
    if (!issue) {
      return { canClaim: false, reason: 'Issue not found' };
    }

    if (issue.state !== 'open') {
      return { canClaim: false, reason: 'Issue is not open' };
    }

    // Check if already assigned
    if (issue.assignee && issue.assignee.login === this.currentUser.login) {
      return { canClaim: false, reason: 'You have already claimed this task' };
    }

    if (issue.assignee) {
      return { canClaim: false, reason: 'Task already claimed by another developer' };
    }

    return { canClaim: true };
  }

  /**
   * Get GitHub issue details
   */
  async getIssue(issueNumber: number): Promise<any> {
    const response = await fetch(
      `https://api.github.com/repos/bitcoin-apps-suite/bitcoin-writer/issues/${issueNumber}`,
      {
        headers: {
          Accept: 'application/json',
          ...(this.accessToken && {
            Authorization: `Bearer ${this.accessToken}`
          })
        }
      }
    );

    if (!response.ok) {
      return null;
    }

    return response.json();
  }

  /**
   * Assign issue to current user
   */
  async assignIssue(issueNumber: number): Promise<boolean> {
    if (!this.currentUser || !this.accessToken) {
      return false;
    }

    const response = await fetch(
      `https://api.github.com/repos/bitcoin-apps-suite/bitcoin-writer/issues/${issueNumber}/assignees`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${this.accessToken}`,
          Accept: 'application/json'
        },
        body: JSON.stringify({
          assignees: [this.currentUser.login]
        })
      }
    );

    return response.ok;
  }

  /**
   * Generate state for OAuth
   */
  private generateState(): string {
    const state = Math.random().toString(36).substring(2, 15);
    sessionStorage.setItem('github_oauth_state', state);
    return state;
  }

  /**
   * Verify OAuth state
   */
  private verifyState(state: string): boolean {
    const savedState = sessionStorage.getItem('github_oauth_state');
    sessionStorage.removeItem('github_oauth_state');
    return state === savedState;
  }

  /**
   * Save session to localStorage
   */
  private saveSession(): void {
    if (this.currentUser && this.accessToken) {
      localStorage.setItem('github_user', JSON.stringify(this.currentUser));
      localStorage.setItem('github_token', this.accessToken);
    }
  }

  /**
   * Load session from localStorage
   */
  private loadSession(): void {
    const userStr = localStorage.getItem('github_user');
    const token = localStorage.getItem('github_token');

    if (userStr && token) {
      try {
        this.currentUser = JSON.parse(userStr);
        this.accessToken = token;
      } catch (e) {
        this.clearSession();
      }
    }
  }

  /**
   * Clear session
   */
  clearSession(): void {
    this.currentUser = null;
    this.accessToken = null;
    localStorage.removeItem('github_user');
    localStorage.removeItem('github_token');
  }

  /**
   * Get current user
   */
  getCurrentUser(): GitHubUser | null {
    return this.currentUser;
  }

  /**
   * Check if authenticated
   */
  isAuthenticated(): boolean {
    return !!this.currentUser && !!this.accessToken;
  }

  /**
   * Logout
   */
  logout(): void {
    this.clearSession();
  }
}