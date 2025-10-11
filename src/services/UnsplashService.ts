export interface UnsplashImage {
  id: string;
  urls: {
    raw: string;
    full: string;
    regular: string;
    small: string;
    thumb: string;
  };
  alt_description: string;
  description: string;
  user: {
    name: string;
    username: string;
  };
  width: number;
  height: number;
}

export interface UnsplashSearchResult {
  total: number;
  total_pages: number;
  results: UnsplashImage[];
}

export class UnsplashService {
  private static readonly ACCESS_KEY = process.env.REACT_APP_UNSPLASH_ACCESS_KEY || 'demo-key';
  private static readonly BASE_URL = 'https://api.unsplash.com';

  /**
   * Search for images on Unsplash
   * @param query Search query
   * @param page Page number (default: 1)
   * @param perPage Number of results per page (default: 12)
   * @returns Promise with search results
   */
  static async searchImages(
    query: string, 
    page: number = 1, 
    perPage: number = 12
  ): Promise<UnsplashSearchResult> {
    try {
      const url = new URL(`${this.BASE_URL}/search/photos`);
      url.searchParams.append('query', query);
      url.searchParams.append('page', page.toString());
      url.searchParams.append('per_page', perPage.toString());
      url.searchParams.append('orientation', 'landscape');

      const response = await fetch(url.toString(), {
        headers: {
          'Authorization': `Client-ID ${this.ACCESS_KEY}`,
        },
      });

      if (!response.ok) {
        throw new Error(`Unsplash API error: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error searching Unsplash images:', error);
      // Return fallback results if API fails
      return this.getFallbackImages(query);
    }
  }

  /**
   * Get a single random image for a specific topic
   * @param query Topic for the image
   * @param width Desired width (default: 400)
   * @param height Desired height (default: 250)
   * @returns Promise with image URL
   */
  static async getRandomImage(
    query: string, 
    width: number = 400, 
    height: number = 250
  ): Promise<string> {
    try {
      const url = new URL(`${this.BASE_URL}/photos/random`);
      url.searchParams.append('query', query);
      url.searchParams.append('orientation', 'landscape');
      url.searchParams.append('w', width.toString());
      url.searchParams.append('h', height.toString());

      const response = await fetch(url.toString(), {
        headers: {
          'Authorization': `Client-ID ${this.ACCESS_KEY}`,
        },
      });

      if (!response.ok) {
        throw new Error(`Unsplash API error: ${response.status}`);
      }

      const data = await response.json();
      return data.urls.regular || data.urls.small;
    } catch (error) {
      console.error('Error getting random Unsplash image:', error);
      // Return fallback image if API fails
      return this.getFallbackImageUrl(query, width, height);
    }
  }

  /**
   * Get curated images for content topics
   * @param topic Content topic
   * @returns Promise with curated images
   */
  static async getCuratedImages(topic: string): Promise<UnsplashImage[]> {
    const topicMap: { [key: string]: string } = {
      'technology': 'technology computer coding',
      'business': 'business meeting office',
      'writing': 'writing notebook pen',
      'blockchain': 'network technology digital',
      'cryptocurrency': 'bitcoin cryptocurrency finance',
      'publishing': 'books writing publishing',
      'marketing': 'marketing social media',
      'design': 'design graphics creative',
      'development': 'programming code computer',
      'finance': 'finance money investment',
      'education': 'education learning books',
      'health': 'health wellness medical',
      'lifestyle': 'lifestyle modern home',
      'travel': 'travel adventure explore'
    };

    const searchQuery = topicMap[topic.toLowerCase()] || topic;
    const result = await this.searchImages(searchQuery, 1, 6);
    return result.results;
  }

  /**
   * Auto-suggest image based on content title and description
   * @param title Article title
   * @param description Article description
   * @returns Promise with suggested image URL
   */
  static async autoSuggestImage(title: string, description: string = ''): Promise<string> {
    // Extract keywords from title and description
    const keywords = this.extractKeywords(title + ' ' + description);
    const query = keywords.slice(0, 3).join(' ') || 'writing';
    
    return this.getRandomImage(query);
  }

  /**
   * Extract keywords from text for image search
   * @param text Input text
   * @returns Array of keywords
   */
  private static extractKeywords(text: string): string[] {
    // Common stop words to filter out
    const stopWords = new Set([
      'the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by',
      'from', 'up', 'about', 'into', 'through', 'during', 'before', 'after', 'above', 'below',
      'is', 'are', 'was', 'were', 'be', 'been', 'being', 'have', 'has', 'had', 'do', 'does', 'did',
      'will', 'would', 'should', 'could', 'can', 'may', 'might', 'must', 'how', 'what', 'when',
      'where', 'why', 'who', 'which', 'that', 'this', 'these', 'those', 'i', 'you', 'he', 'she',
      'it', 'we', 'they', 'them', 'their', 'there', 'then', 'than', 'so', 'if', 'as', 'all', 'any'
    ]);

    return text
      .toLowerCase()
      .replace(/[^\w\s]/g, '') // Remove punctuation
      .split(/\s+/) // Split by whitespace
      .filter(word => word.length > 2 && !stopWords.has(word)) // Filter meaningful words
      .slice(0, 5); // Take top 5 keywords
  }

  /**
   * Get fallback images when API is unavailable
   * @param query Search query
   * @returns Fallback search result
   */
  private static getFallbackImages(query: string): UnsplashSearchResult {
    const fallbackImages: UnsplashImage[] = [
      {
        id: 'fallback-1',
        urls: {
          raw: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&h=250&fit=crop',
          full: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&h=250&fit=crop',
          regular: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&h=250&fit=crop',
          small: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&h=250&fit=crop',
          thumb: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=200&h=125&fit=crop'
        },
        alt_description: 'Technology and digital content',
        description: 'Digital technology concept',
        user: {
          name: 'Unsplash',
          username: 'unsplash'
        },
        width: 400,
        height: 250
      },
      {
        id: 'fallback-2',
        urls: {
          raw: 'https://images.unsplash.com/photo-1486312338219-ce68e2c6b7eb?w=400&h=250&fit=crop',
          full: 'https://images.unsplash.com/photo-1486312338219-ce68e2c6b7eb?w=400&h=250&fit=crop',
          regular: 'https://images.unsplash.com/photo-1486312338219-ce68e2c6b7eb?w=400&h=250&fit=crop',
          small: 'https://images.unsplash.com/photo-1486312338219-ce68e2c6b7eb?w=400&h=250&fit=crop',
          thumb: 'https://images.unsplash.com/photo-1486312338219-ce68e2c6b7eb?w=200&h=125&fit=crop'
        },
        alt_description: 'Professional writing workspace',
        description: 'Writing and productivity',
        user: {
          name: 'Unsplash',
          username: 'unsplash'
        },
        width: 400,
        height: 250
      }
    ];

    return {
      total: fallbackImages.length,
      total_pages: 1,
      results: fallbackImages
    };
  }

  /**
   * Get fallback image URL when API is unavailable
   * @param query Search query
   * @param width Image width
   * @param height Image height
   * @returns Fallback image URL
   */
  private static getFallbackImageUrl(query: string, width: number, height: number): string {
    const fallbackImages = [
      'https://images.unsplash.com/photo-1551288049-bebda4e38f71',
      'https://images.unsplash.com/photo-1486312338219-ce68e2c6b7eb',
      'https://images.unsplash.com/photo-1555066931-4365d14bab8c',
      'https://images.unsplash.com/photo-1563013544-824ae1b704d3'
    ];
    
    const randomIndex = Math.floor(Math.random() * fallbackImages.length);
    const baseUrl = fallbackImages[randomIndex];
    
    return `${baseUrl}?w=${width}&h=${height}&fit=crop&crop=center`;
  }

  /**
   * Format Unsplash image URL with specific dimensions
   * @param imageUrl Base Unsplash image URL
   * @param width Desired width
   * @param height Desired height
   * @returns Formatted URL
   */
  static formatImageUrl(imageUrl: string, width: number = 400, height: number = 250): string {
    if (!imageUrl.includes('unsplash.com')) {
      return imageUrl;
    }

    // Remove existing parameters and add new ones
    const baseUrl = imageUrl.split('?')[0];
    return `${baseUrl}?w=${width}&h=${height}&fit=crop&crop=center`;
  }
}

export default UnsplashService;