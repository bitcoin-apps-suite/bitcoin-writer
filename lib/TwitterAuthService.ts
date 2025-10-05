export interface TwitterUser {
  id: string;
  username: string;
  name: string;
  profile_image_url?: string;
}

export interface TwitterPostData {
  text: string;
  mediaIds?: string[];
}

export class TwitterAuthService {
  private static instance: TwitterAuthService;
  private apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:3001';
  private currentUser: TwitterUser | null = null;
  private accessToken: string | null = null;

  constructor() {
    // Load saved Twitter session from localStorage
    const savedSession = localStorage.getItem('twitter_session');
    if (savedSession) {
      try {
        const session = JSON.parse(savedSession);
        this.currentUser = session.user;
        this.accessToken = session.accessToken;
      } catch (error) {
        console.error('Failed to parse Twitter session:', error);
        localStorage.removeItem('twitter_session');
      }
    }
  }

  static getInstance(): TwitterAuthService {
    if (!TwitterAuthService.instance) {
      TwitterAuthService.instance = new TwitterAuthService();
    }
    return TwitterAuthService.instance;
  }

  async login(): Promise<void> {
    try {
      // Initiate OAuth flow
      const response = await fetch(`${this.apiUrl}/api/twitter/auth/url`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('Failed to get Twitter auth URL');
      }

      const { authUrl } = await response.json();
      
      // Open Twitter OAuth in a popup window
      const width = 600;
      const height = 700;
      const left = window.innerWidth / 2 - width / 2;
      const top = window.innerHeight / 2 - height / 2;
      
      const authWindow = window.open(
        authUrl,
        'TwitterAuth',
        `width=${width},height=${height},left=${left},top=${top}`
      );

      // Poll for completion
      const pollInterval = setInterval(() => {
        try {
          if (authWindow?.closed) {
            clearInterval(pollInterval);
            // Check if we got the token
            this.checkAuthStatus();
          }
        } catch (error) {
          console.error('Error checking auth window:', error);
          clearInterval(pollInterval);
        }
      }, 1000);
    } catch (error) {
      console.error('Twitter login failed:', error);
      throw error;
    }
  }

  async handleCallback(oauthToken: string, oauthVerifier: string): Promise<TwitterUser> {
    try {
      const response = await fetch(`${this.apiUrl}/api/twitter/auth/callback`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ oauthToken, oauthVerifier })
      });

      if (!response.ok) {
        throw new Error('Failed to complete Twitter authentication');
      }

      const { user, accessToken } = await response.json();
      
      this.currentUser = user;
      this.accessToken = accessToken;
      
      // Save session to localStorage
      localStorage.setItem('twitter_session', JSON.stringify({
        user,
        accessToken
      }));

      return user;
    } catch (error) {
      console.error('Twitter callback failed:', error);
      throw error;
    }
  }

  async checkAuthStatus(): Promise<boolean> {
    if (!this.accessToken) {
      return false;
    }

    try {
      const response = await fetch(`${this.apiUrl}/api/twitter/auth/verify`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${this.accessToken}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const { user } = await response.json();
        this.currentUser = user;
        return true;
      } else {
        this.logout();
        return false;
      }
    } catch (error) {
      console.error('Failed to verify Twitter auth:', error);
      return false;
    }
  }

  async postToTwitter(content: string, options?: { 
    threadMode?: boolean; 
    includeLink?: boolean;
    documentTitle?: string;
  }): Promise<{ id: string; url: string }> {
    if (!this.accessToken) {
      throw new Error('Not authenticated with Twitter');
    }

    try {
      let tweetText = content;
      
      // Handle thread mode (split long content into multiple tweets)
      if (options?.threadMode && content.length > 280) {
        return await this.postThread(content, options);
      }

      // Truncate if needed (leaving room for link if requested)
      const maxLength = options?.includeLink ? 250 : 280;
      if (tweetText.length > maxLength) {
        tweetText = tweetText.substring(0, maxLength - 3) + '...';
      }

      // Add link if requested
      if (options?.includeLink && options.documentTitle) {
        // This would be the published document URL
        const documentUrl = `${window.location.origin}/read/${encodeURIComponent(options.documentTitle)}`;
        tweetText += `\n\nRead more: ${documentUrl}`;
      }

      const response = await fetch(`${this.apiUrl}/api/twitter/post`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.accessToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ text: tweetText })
      });

      if (!response.ok) {
        throw new Error('Failed to post to Twitter');
      }

      const result = await response.json();
      return {
        id: result.data.id,
        url: `https://twitter.com/${this.currentUser?.username}/status/${result.data.id}`
      };
    } catch (error) {
      console.error('Failed to post to Twitter:', error);
      throw error;
    }
  }

  private async postThread(content: string, options?: { 
    includeLink?: boolean;
    documentTitle?: string;
  }): Promise<{ id: string; url: string }> {
    const tweets = this.splitIntoTweets(content);
    let previousTweetId: string | null = null;
    let firstTweetId: string | null = null;

    for (let i = 0; i < tweets.length; i++) {
      const isLast = i === tweets.length - 1;
      let tweetText = `${i + 1}/${tweets.length} ${tweets[i]}`;
      
      // Add link to the last tweet if requested
      if (isLast && options?.includeLink && options.documentTitle) {
        const documentUrl = `${window.location.origin}/read/${encodeURIComponent(options.documentTitle)}`;
        tweetText += `\n\nRead full article: ${documentUrl}`;
      }

      const response: Response = await fetch(`${this.apiUrl}/api/twitter/post`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.accessToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          text: tweetText,
          replyToId: previousTweetId
        })
      });

      if (!response.ok) {
        throw new Error(`Failed to post tweet ${i + 1} of thread`);
      }

      const result: { data: { id: string } } = await response.json();
      previousTweetId = result.data.id;
      
      if (i === 0) {
        firstTweetId = result.data.id;
      }

      // Small delay between tweets to avoid rate limiting
      if (i < tweets.length - 1) {
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
    }

    return {
      id: firstTweetId!,
      url: `https://twitter.com/${this.currentUser?.username}/status/${firstTweetId}`
    };
  }

  private splitIntoTweets(text: string): string[] {
    const maxLength = 270; // Leave room for numbering
    const tweets: string[] = [];
    const words = text.split(' ');
    let currentTweet = '';

    for (const word of words) {
      if ((currentTweet + ' ' + word).length > maxLength) {
        if (currentTweet) {
          tweets.push(currentTweet.trim());
          currentTweet = word;
        } else {
          // Single word is too long, split it
          tweets.push(word.substring(0, maxLength));
          currentTweet = word.substring(maxLength);
        }
      } else {
        currentTweet = currentTweet ? `${currentTweet} ${word}` : word;
      }
    }

    if (currentTweet) {
      tweets.push(currentTweet.trim());
    }

    return tweets;
  }

  logout(): void {
    this.currentUser = null;
    this.accessToken = null;
    localStorage.removeItem('twitter_session');
  }

  isAuthenticated(): boolean {
    return !!this.accessToken && !!this.currentUser;
  }

  getCurrentUser(): TwitterUser | null {
    return this.currentUser;
  }
}