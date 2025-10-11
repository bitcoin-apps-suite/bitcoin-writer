export interface AuthoredArticle {
  id: string;
  title: string;
  description: string;
  content: string;
  thumbnail?: string;
  authorHandle: string;
  authorDisplayName: string;
  authorAvatar: string;
  createdAt: string;
  updatedAt: string;
  status: 'draft' | 'ready-to-publish' | 'published' | 'tokenized';
  wordCount: number;
  readTime: number;
  tags: string[];
  sharePrice?: number;
  shareChange24h?: number;
  totalShares?: number;
  marketCap?: number;
  ticker?: string;
  blockchainTx?: string;
  publishedUrl?: string;
}

export interface AuthorProfile {
  handle: string;
  displayName: string;
  avatarUrl: string;
  bio: string;
  articles: AuthoredArticle[];
  totalArticles: number;
  totalShares: number;
  joinDate: string;
}

export class AuthorArticleService {
  private storageKey = 'bitcoin-writer-authored-articles';
  private profileKey = 'bitcoin-writer-author-profiles';

  // Save an article to the author's portfolio
  saveAuthoredArticle(article: Omit<AuthoredArticle, 'id' | 'createdAt' | 'updatedAt' | 'readTime'>): AuthoredArticle {
    const articles = this.getAuthoredArticles(article.authorHandle);
    
    const newArticle: AuthoredArticle = {
      ...article,
      id: `article_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      readTime: this.calculateReadTime(article.content)
    };

    articles.push(newArticle);
    this.saveArticlesToStorage(article.authorHandle, articles);
    
    // Update author profile
    this.updateAuthorProfile(article.authorHandle, {
      displayName: article.authorDisplayName,
      avatarUrl: article.authorAvatar
    });

    return newArticle;
  }

  // Get all articles for a specific author
  getAuthoredArticles(authorHandle: string): AuthoredArticle[] {
    try {
      const stored = localStorage.getItem(`${this.storageKey}-${authorHandle}`);
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.error('Error loading authored articles:', error);
      return [];
    }
  }

  // Get all authored articles across all users (for development/admin)
  getAllAuthoredArticles(): { [handle: string]: AuthoredArticle[] } {
    const allArticles: { [handle: string]: AuthoredArticle[] } = {};
    
    // Get all keys that match our pattern
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith(this.storageKey + '-')) {
        const handle = key.replace(this.storageKey + '-', '');
        allArticles[handle] = this.getAuthoredArticles(handle);
      }
    }
    
    return allArticles;
  }

  // Update an existing article
  updateAuthoredArticle(authorHandle: string, articleId: string, updates: Partial<AuthoredArticle>): AuthoredArticle | null {
    const articles = this.getAuthoredArticles(authorHandle);
    const index = articles.findIndex(a => a.id === articleId);
    
    if (index === -1) {
      return null;
    }

    const updatedArticle: AuthoredArticle = {
      ...articles[index],
      ...updates,
      updatedAt: new Date().toISOString(),
      readTime: updates.content ? this.calculateReadTime(updates.content) : articles[index].readTime
    };

    articles[index] = updatedArticle;
    this.saveArticlesToStorage(authorHandle, articles);
    
    return updatedArticle;
  }

  // Publish an article (mark as published and add market data)
  publishArticle(authorHandle: string, articleId: string, publishData: {
    sharePrice: number;
    totalShares: number;
    ticker: string;
    blockchainTx?: string;
    publishedUrl?: string;
  }): AuthoredArticle | null {
    return this.updateAuthoredArticle(authorHandle, articleId, {
      status: 'published',
      sharePrice: publishData.sharePrice,
      totalShares: publishData.totalShares,
      marketCap: publishData.sharePrice * publishData.totalShares,
      ticker: publishData.ticker,
      blockchainTx: publishData.blockchainTx,
      publishedUrl: publishData.publishedUrl,
      shareChange24h: 0 // Start at 0 for new publications
    });
  }

  // Delete an article
  deleteAuthoredArticle(authorHandle: string, articleId: string): boolean {
    const articles = this.getAuthoredArticles(authorHandle);
    const filteredArticles = articles.filter(a => a.id !== articleId);
    
    if (filteredArticles.length === articles.length) {
      return false; // Article not found
    }

    this.saveArticlesToStorage(authorHandle, filteredArticles);
    return true;
  }

  // Get author profile
  getAuthorProfile(authorHandle: string): AuthorProfile | null {
    try {
      const stored = localStorage.getItem(`${this.profileKey}-${authorHandle}`);
      if (stored) {
        const profile = JSON.parse(stored);
        // Always get fresh article data
        profile.articles = this.getAuthoredArticles(authorHandle);
        profile.totalArticles = profile.articles.length;
        profile.totalShares = profile.articles.reduce((sum: number, article: AuthoredArticle) => sum + (article.totalShares || 0), 0);
        return profile;
      }
      return null;
    } catch (error) {
      console.error('Error loading author profile:', error);
      return null;
    }
  }

  // Update author profile
  updateAuthorProfile(authorHandle: string, updates: Partial<Omit<AuthorProfile, 'handle' | 'articles'>>): AuthorProfile {
    const existingProfile = this.getAuthorProfile(authorHandle);
    const articles = this.getAuthoredArticles(authorHandle);
    
    const profile: AuthorProfile = {
      handle: authorHandle,
      displayName: updates.displayName || existingProfile?.displayName || authorHandle,
      avatarUrl: updates.avatarUrl || existingProfile?.avatarUrl || '',
      bio: updates.bio || existingProfile?.bio || 'Active Bitcoin Writer author. Building a decentralized content portfolio.',
      articles: articles,
      totalArticles: articles.length,
      totalShares: articles.reduce((sum: number, article: AuthoredArticle) => sum + (article.totalShares || 0), 0),
      joinDate: existingProfile?.joinDate || new Date().toISOString().split('T')[0],
      ...updates
    };

    localStorage.setItem(`${this.profileKey}-${authorHandle}`, JSON.stringify(profile));
    return profile;
  }

  // Get articles ready to publish
  getArticlesReadyToPublish(authorHandle: string): AuthoredArticle[] {
    return this.getAuthoredArticles(authorHandle).filter(article => 
      article.status === 'ready-to-publish'
    );
  }

  // Get published articles for market display
  getPublishedArticles(authorHandle: string): AuthoredArticle[] {
    return this.getAuthoredArticles(authorHandle).filter(article => 
      article.status === 'published' || article.status === 'tokenized'
    );
  }

  // Calculate read time based on content
  private calculateReadTime(content: string): number {
    // Remove HTML tags and count words
    const text = content.replace(/<[^>]*>/g, '');
    const wordCount = text.trim().split(/\s+/).filter(word => word.length > 0).length;
    // Average reading speed is 200-250 words per minute, using 225
    return Math.max(1, Math.ceil(wordCount / 225));
  }

  // Save articles to localStorage
  private saveArticlesToStorage(authorHandle: string, articles: AuthoredArticle[]): void {
    try {
      localStorage.setItem(`${this.storageKey}-${authorHandle}`, JSON.stringify(articles));
    } catch (error) {
      console.error('Error saving authored articles:', error);
    }
  }

  // Generate article thumbnail from content
  generateThumbnail(content: string): string {
    // For now, return a placeholder. In production, this could:
    // 1. Extract the first image from content
    // 2. Generate an image from the title/content
    // 3. Use a default based on article category
    const defaultThumbnails = [
      'https://images.unsplash.com/photo-1586281380349-632531db7ed4?w=400&h=250&fit=crop&crop=center',
      'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&h=250&fit=crop&crop=center',
      'https://images.unsplash.com/photo-1521737711867-e3b97375f902?w=400&h=250&fit=crop&crop=center',
      'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=400&h=250&fit=crop&crop=center'
    ];
    
    // Use content hash to consistently pick the same thumbnail
    const hash = content.length % defaultThumbnails.length;
    return defaultThumbnails[hash];
  }

  // Generate article ticker symbol
  generateTicker(authorHandle: string, title: string): string {
    const cleanHandle = authorHandle.replace('@', '').replace('$', '');
    const cleanTitle = title
      .toLowerCase()
      .replace(/[^a-z0-9\s]/g, '')
      .replace(/\s+/g, '-')
      .substring(0, 30); // Limit length
    
    return `$bWriter_${cleanHandle}_${cleanTitle}`;
  }

  // Extract tags from content (simple implementation)
  extractTags(content: string): string[] {
    // Remove HTML tags
    const text = content.replace(/<[^>]*>/g, '');
    
    // Look for common tech/crypto keywords
    const keywords = [
      'bitcoin', 'cryptocurrency', 'blockchain', 'web3', 'defi', 'nft',
      'technology', 'ai', 'machine learning', 'programming', 'development',
      'business', 'finance', 'investment', 'economics', 'politics',
      'science', 'research', 'innovation', 'startup', 'entrepreneurship'
    ];
    
    const foundTags: string[] = [];
    const textLower = text.toLowerCase();
    
    keywords.forEach(keyword => {
      if (textLower.includes(keyword) && !foundTags.includes(keyword)) {
        foundTags.push(keyword);
      }
    });
    
    return foundTags.slice(0, 5); // Limit to 5 tags
  }

  // Clear all data for a user (for development/testing)
  clearUserData(authorHandle: string): void {
    localStorage.removeItem(`${this.storageKey}-${authorHandle}`);
    localStorage.removeItem(`${this.profileKey}-${authorHandle}`);
  }
}

export default AuthorArticleService;