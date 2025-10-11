import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { extractIdFromSlug } from '../utils/slugUtils';
import './ArticlePage.css';

interface ArticleContent {
  id: string;
  title: string;
  description: string;
  content: string;
  author: string;
  authorHandle: string;
  platform: string;
  category: string;
  readTime: number;
  engagement: number;
  thumbnail: string;
  price?: number;
  isTokenized: boolean;
  trending: boolean;
  publishedDate: string;
  tags: string[];
  nftId?: string;
  transactionId?: string;
}

const ArticlePage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const [article, setArticle] = useState<ArticleContent | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!slug) {
      setError('Invalid article URL');
      setLoading(false);
      return;
    }

    const articleId = extractIdFromSlug(slug);
    if (!articleId) {
      setError('Article not found');
      setLoading(false);
      return;
    }

    // Mock data - in real implementation, this would fetch from your backend/blockchain
    const mockArticles: { [key: string]: ArticleContent } = {
      '1': {
        id: '1',
        title: 'The Future of Digital Publishing',
        description: 'How blockchain technology is revolutionizing content creation and monetization',
        content: `
# The Future of Digital Publishing

The landscape of digital publishing is undergoing a revolutionary transformation, driven by blockchain technology and decentralized platforms. This shift represents more than just a technological upgrade—it's a fundamental reimagining of how content creators can monetize their work and connect with audiences.

## The Traditional Publishing Problem

For decades, content creators have faced significant challenges in the traditional publishing landscape:

- **Platform dependency**: Writers rely on centralized platforms that can change rules arbitrarily
- **Revenue sharing**: Most platforms take substantial cuts from creator earnings
- **Content ownership**: Limited control over published content and its distribution
- **Censorship risks**: Central authorities can remove or suppress content without warning

## Blockchain as the Solution

Blockchain technology addresses these issues by providing:

### True Ownership
When content is published on blockchain networks like Bitcoin SV, creators maintain permanent ownership of their work. The content is cryptographically signed and timestamped, creating an immutable record of authorship.

### Direct Monetization
Smart contracts and micropayment systems enable direct transactions between creators and readers, eliminating intermediaries and maximizing creator revenue.

### Censorship Resistance
Decentralized storage ensures that content cannot be arbitrarily removed or censored by centralized authorities.

## The Bitcoin Writer Approach

Bitcoin Writer leverages the Bitcoin SV blockchain to provide:

1. **Immutable Publishing**: Articles are stored permanently on-chain
2. **NFT Integration**: Content can be tokenized as unique digital assets
3. **Micropayments**: Readers can support creators with small BSV payments
4. **Verifiable Authorship**: Cryptographic proof of content creation

## Real-World Impact

Early adopters of blockchain publishing have already seen significant benefits:

- Increased revenue from direct reader support
- Greater creative freedom without platform restrictions
- Building loyal communities around tokenized content
- Creating new revenue streams through NFT sales

## Looking Forward

The future of digital publishing will likely feature:

- **Hybrid models** combining traditional and blockchain approaches
- **Enhanced reader engagement** through token-based communities
- **Programmable content** with embedded smart contracts
- **Cross-platform interoperability** for seamless content distribution

As this technology matures, we can expect to see more creators embracing blockchain-based publishing as a viable alternative to traditional platforms. The key will be making these tools accessible to non-technical users while maintaining the benefits of decentralization.

## Conclusion

The future of digital publishing is being written today, one block at a time. By embracing blockchain technology, creators can reclaim control over their content, build sustainable revenue streams, and foster deeper connections with their audiences.

The revolution has begun—the question is not whether blockchain will transform publishing, but how quickly creators will adopt these powerful new tools.
        `,
        author: 'Sarah Chen',
        authorHandle: '@sarahchen',
        platform: 'Bitcoin Writer',
        category: 'Technology',
        readTime: 8,
        engagement: 1520,
        thumbnail: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=400&fit=crop&crop=center',
        price: 0.005,
        isTokenized: true,
        trending: true,
        publishedDate: '2025-01-10',
        tags: ['blockchain', 'publishing', 'web3', 'content creation', 'monetization'],
        nftId: 'nft_123456789',
        transactionId: 'tx_987654321'
      },
      '2': {
        id: '2',
        title: 'Building Sustainable Creator Economy',
        description: 'A comprehensive guide to monetizing your content in the Web3 era',
        content: `
# Building Sustainable Creator Economy

The creator economy has evolved rapidly over the past decade, but we're now entering a new phase where Web3 technologies are fundamentally changing how creators build sustainable businesses.

## Understanding the Creator Economy Shift

Traditional creator monetization has relied heavily on:
- Advertising revenue
- Platform-based subscriptions
- Brand sponsorships
- Merchandise sales

While these methods remain relevant, Web3 introduces new opportunities for more direct and sustainable revenue streams.

## Web3 Creator Monetization Strategies

### 1. Tokenized Content
Create NFTs from your best content pieces, allowing fans to own unique digital assets while supporting your work.

### 2. Creator Coins
Launch your own cryptocurrency that fans can purchase and trade, creating a community-driven economy around your content.

### 3. Decentralized Subscriptions
Use blockchain-based subscription models that eliminate intermediaries and provide better terms for creators.

### 4. Community Governance
Give your audience a voice in content direction through token-based voting systems.

## Building Your Web3 Creator Stack

To succeed in the Web3 creator economy, consider these tools:
- **Content Publishing**: Platforms like Mirror, Paragraph, or Bitcoin Writer
- **NFT Creation**: OpenSea, Foundation, or HandCash
- **Community Building**: Discord with token-gated channels
- **Analytics**: On-chain analytics tools for tracking engagement

## Success Stories

Many creators have already built sustainable businesses using Web3 tools:
- Newsletter writers earning through tokenized subscriptions
- Artists selling limited edition content NFTs
- Educators creating token-gated learning communities

## Getting Started

1. Choose your niche and platform
2. Start publishing consistently
3. Build an engaged community
4. Experiment with tokenization
5. Analyze and iterate

The key is to start small and gradually incorporate Web3 elements as you learn what resonates with your audience.
        `,
        author: 'Alex Martinez',
        authorHandle: '@alexmart',
        platform: 'Mirror',
        category: 'Business',
        readTime: 12,
        engagement: 2340,
        thumbnail: 'https://images.unsplash.com/photo-1559136555-9303baea8ebd?w=800&h=400&fit=crop&crop=center',
        price: 0.01,
        isTokenized: true,
        trending: true,
        publishedDate: '2025-01-08',
        tags: ['creator economy', 'web3', 'monetization', 'nft', 'business'],
        nftId: 'nft_234567890',
        transactionId: 'tx_876543210'
      }
      // Add more mock articles as needed
    };

    const foundArticle = mockArticles[articleId];
    if (foundArticle) {
      setArticle(foundArticle);
    } else {
      setError('Article not found');
    }
    setLoading(false);
  }, [slug]);

  const handlePurchaseAccess = () => {
    // TODO: Implement purchase logic
    alert('Purchase functionality coming soon!');
  };

  const handleBackToMarket = () => {
    navigate('/market');
  };

  if (loading) {
    return (
      <div className="article-page">
        <div className="article-loading">
          <div className="loading-spinner"></div>
          <p>Loading article...</p>
        </div>
      </div>
    );
  }

  if (error || !article) {
    return (
      <div className="article-page">
        <div className="article-error">
          <h2>Article Not Found</h2>
          <p>{error || 'The requested article could not be found.'}</p>
          <button onClick={handleBackToMarket} className="back-btn">
            ← Back to Market
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="article-page">
      <div className="article-header">
        <button onClick={handleBackToMarket} className="back-btn">
          ← Back to Market
        </button>
        
        <div className="article-badges">
          {article.trending && <span className="badge trending">🔥 Trending</span>}
          {article.isTokenized && <span className="badge tokenized">₿ NFT Article</span>}
        </div>
      </div>

      <article className="article-content">
        <div className="article-hero">
          <img src={article.thumbnail} alt={article.title} className="article-thumbnail" />
          <div className="article-overlay">
            <h1 className="article-title">{article.title}</h1>
            <p className="article-description">{article.description}</p>
          </div>
        </div>

        <div className="article-meta">
          <div className="author-info">
            <div className="author-details">
              <span className="author-name">{article.author}</span>
              <span className="author-handle">{article.authorHandle}</span>
            </div>
            <div className="article-stats">
              <span className="platform">{article.platform}</span>
              <span className="read-time">{article.readTime} min read</span>
              <span className="engagement">👁 {article.engagement}</span>
            </div>
          </div>
          
          {article.isTokenized && article.price && (
            <div className="article-pricing">
              <div className="price-info">
                <span className="price">₿ {article.price} BSV</span>
                <span className="price-label">to unlock full content</span>
              </div>
              <button onClick={handlePurchaseAccess} className="purchase-btn">
                Purchase Access
              </button>
            </div>
          )}
        </div>

        <div className="article-tags">
          {article.tags.map((tag, index) => (
            <span key={index} className="tag">#{tag}</span>
          ))}
        </div>

        <div className="article-body">
          {article.content.split('\n').map((paragraph, index) => {
            if (paragraph.startsWith('# ')) {
              return <h1 key={index}>{paragraph.substring(2)}</h1>;
            } else if (paragraph.startsWith('## ')) {
              return <h2 key={index}>{paragraph.substring(3)}</h2>;
            } else if (paragraph.startsWith('### ')) {
              return <h3 key={index}>{paragraph.substring(4)}</h3>;
            } else if (paragraph.startsWith('- ')) {
              return <li key={index}>{paragraph.substring(2)}</li>;
            } else if (paragraph.trim() === '') {
              return <br key={index} />;
            } else {
              return <p key={index}>{paragraph}</p>;
            }
          })}
        </div>

        {article.isTokenized && (
          <div className="nft-info">
            <h3>🎨 NFT Information</h3>
            <div className="nft-details">
              <div className="nft-item">
                <span className="nft-label">NFT ID:</span>
                <span className="nft-value">{article.nftId}</span>
              </div>
              <div className="nft-item">
                <span className="nft-label">Transaction ID:</span>
                <span className="nft-value">{article.transactionId}</span>
              </div>
              <div className="nft-item">
                <span className="nft-label">Blockchain:</span>
                <span className="nft-value">Bitcoin SV</span>
              </div>
            </div>
          </div>
        )}
      </article>
    </div>
  );
};

export default ArticlePage;