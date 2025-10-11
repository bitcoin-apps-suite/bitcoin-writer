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
        title: 'Uber, Anna Iverson, and the Reality of Modern Work',
        description: 'A response to Anna Iverson\'s critique of the gig economy from someone who actually drove 11,000 trips',
        content: `# Uber, Anna Iverson, and the Reality of Modern Work

It's easy to dismiss Anna Iverson's latest article as a load of self-serving, left-wing, bleeding-heart garbage — so let's be generous. She's clearly trying to balance her despair and cynicism after years working in the City of London as a financial advisor, while simultaneously soothing her liberal guilt and coping with the political exhaustion that comes from taking so many quick, cheap, comfortable Uber rides — all summoned with a tap on her iPhone and driven by cheerful, relaxed Pakistanis who know gold when they've struck it.

According to "Anna the Sage," Uber drivers are no longer judged by integrity or mastery — as if, in an age where every phone has affordable, instant, and accurate GPS, the London Knowledge (which takes two years and nearly £50,000 to complete) is somehow still necessary, affordable, or defensible by the bordering-on-criminal black cab cartel known as TfL. Yes, the same TfL who fleece Londoners at every opportunity. She's sticking up for them. Wow. Heroic. Colour me impressed.

## The Autonomy Myth

"Autonomy becomes an illusion," she writes — which is funny, because after seven years of driving for Uber on London's streets and completing over eleven thousand trips, I somehow didn't realize I was missing my autonomy. Maybe it disappeared somewhere between my lunch breaks, weekends off, or weeks off — all at my own discretion. One autonomy, missing. Have you seen it? Maybe it's in TfL's lost property office.

The relentless stupidity is hard to grasp, yet she continues: "The driver cannot choose his journeys." Say what now? You mean in the past drivers could just take passengers wherever they wanted? Sounds cool! "You wanted to go to Manchester, right Anna? Too bad — we're going there anyway. Driver's choice."

(No, b0ase, this is an Uber — you have to take her where she wants to go now.)

Fuck me. Damn these modern capitalist ways. It must be the money's fault!

## Desktop Publishing and Dishwashers

OK, OK, enough. Let's be kind now, b0ase. Desktop publishing didn't "free mothers to work from home" — it chained them to their desks, babies screaming at their ankles. Just like Iverson probably wants AI to do the dishes, not write her poetry. (Never mind that dishwashers — a hundred-year-old invention — already freed women from that task and gave them the time to write poetry… until, presumably, Iverson decided dishwashers were the "Uberfication" of crockery and took a stand against them too.)

According to Iverson, being a cab driver was an art form — not, as cab drivers would tell you, a fucking nightmare. The same drunk, abusive, smelly locals wanting a ride home from the pub every damn day, paying in filthy, crumpled notes (if they paid at all), and worst of all — wanting to get to know you. No thanks.

## The Reality of Modern Taxi Work

Yes, yes — Uber is "placeless, faceless, and generic," which in practice means that as an Uber driver you're constantly meeting fascinating, tidy, polite, clean professionals from all over the world, having fantastic conversations, and — joy of joys — never seeing them again. Honestly, it's bliss. You can make twenty best friends a day, play therapist, confidant, tour guide, and teacher (or student), all at once. Payment? Instant. Automatic. Perfectly logged and tracked. And a mutual rating system means — lo and behold — drivers can choose not to pick up shitty passengers. (I had a few in 11k trips, but only a very few.)

So Anna's doe-eyed nostalgia is basically unimaginative, self-indulgent crap. Drivers are judged by craft — by care, attentiveness, cleanliness, punctuality, and skill. So if you're so worried about drivers' wages, why don't you just tip them more? It's optional, you know. It's up to you. It might even stop you feeling so guilty that you have to write virtue-signalling pieces like this one to cope with the shame of not tipping properly. In the US, tipping is customary. In the UK? I can count on my fingers (and toes) how many times I was tipped.

## The Entrepreneurial Reality

Workers in the gig economy don't "just" drive for one platform anymore — that would be stupid. Most work across multiple apps. That's why Uber drivers also drive for Lyft or Bolt, and passengers have choices too. Sometimes platforms pay more — like when Bolt raised rates to lure drivers from Uber. That's the beauty of the free market: competition. Drivers are self-employed, and they're free to be entrepreneurial. Most long-term Uber drivers collect cars and rent them out until they've built their own fleets. I ran three cars myself at one point. That's how it works. You get entrepreneurial — but apparently, that's lost on Iverson.

## Uber vs. Therapy

"Uber teaches us to value immediacy over depth."

No, you silly fool. No one relies on taxis for depth. You're confusing taxi drivers with chauffeurs. Taxis are for speed, comfort, and convenience. If you want depth, get a therapist. Reflection? Refinement? Lady, this isn't the fucking Orient Express. It's Uber. It's in the name.

## The Real Origin Story

Uber was born because Travis Kalanick couldn't get a taxi in Paris in the rain, in the middle of the night, because he didn't speak French, had no cab numbers, and couldn't hail one. I know — I lived in Paris then too, suffering my own hate-hate relationship with French taxis. So Iverson's pretentious "origin story" is just nonsense — cooked up and spewed onto a non–OAuth-enabled, non–micropayment-enabled platform that doesn't let you own your own articles, doesn't let you tokenize or securitize them, doesn't offer contracts sealed on-chain — and, worst of all, is the same damn platform the creator of Bitcoin himself uses to publish on.

The irony is laughably obscene.

## Bitcoin Writer: The Real Solution

Yes, Bitcoin Writer is the Uberfication of writing — with a work queue and everything — so writers can, you know, actually write things that publishers will pay for and readers will pay to read. Rather than churning out whatever drivel is deemed "socially acceptable" or politically correct. Give me a break. Driving a taxi is the oldest profession — at least for men. It's the first thing they do in a recession: grab a car and try to be useful. And Iverson? She takes aim at this new paradigm of comfort, modernity, and convenience. Right on, sister.

Thankfully, bWriter lets you do all that — write on-chain, publish as NFTs, securitize your work, charge micropayments to read it, and even trade shares in future revenue with traders who might actually believe in you as an author.

*Published on Bitcoin Writer - Own your words, own your future.*`,
        author: 'b0ase',
        authorHandle: '@b0ase',
        platform: 'Bitcoin Writer',
        category: 'Economics',
        readTime: 12,
        engagement: 2840,
        thumbnail: 'https://images.unsplash.com/photo-1544197150-b99a580bb7a8?w=800&h=400&fit=crop&crop=center',
        price: 0.01,
        isTokenized: true,
        trending: true,
        publishedDate: '2025-01-11',
        tags: ['economics', 'gig economy', 'uber', 'work', 'response'],
        nftId: 'nft_345678901',
        transactionId: 'tx_765432109'
      },
      '3': {
        id: '3',
        title: 'Bridging the Gap: Technology, Work, and Human Dignity',
        description: 'A thoughtful examination of Anna Iverson\'s concerns about modern work platforms',
        content: `# Bridging the Gap: Technology, Work, and Human Dignity

Anna Iverson's recent essay on "Uberfication" raises important questions about the nature of work in our modern economy. While I disagree with some of her conclusions, her concerns about worker dignity and genuine value creation deserve serious consideration.

## Where Iverson Gets It Right

Iverson correctly identifies a genuine problem: many modern platforms do extract value from workers while externalizing risk and responsibility. Her observation that "the algorithm is the new employer, faceless and unaccountable" resonates with many who've experienced the frustrations of platform-mediated work.

The concern about "distributed dependency" is particularly astute. When workers become nodes in a network controlled by others, they can lose agency even as they gain flexibility. This is a real trade-off that deserves honest examination.

## The Nuanced Reality

However, Iverson's analysis misses important nuances about how these platforms actually function in practice. Having driven for Uber for seven years, I can attest that the reality is more complex than her theoretical framework suggests.

### Agency and Choice

While platforms do impose constraints, they also create new forms of agency. The ability to work across multiple platforms, set your own schedule, and build entrepreneurial ventures alongside platform work represents genuine freedom for many workers.

### Quality and Craft

Iverson suggests that platform work eliminates craftsmanship, but this isn't necessarily true. Successful platform workers develop sophisticated skills in customer service, route optimization, time management, and business development. The craft evolves; it doesn't disappear.

### Community and Connection

Her critique of "placeless, faceless" interactions overlooks the genuine human connections that can emerge through platform work. Many drivers report meaningful conversations and relationships with passengers, even if these interactions are brief.

## The Financial Architecture Problem

Iverson's most compelling argument concerns the underlying financial architecture that drives these platforms. Her point about debt-based monetary systems requiring perpetual acceleration touches on something fundamental.

The pressure for platforms to show constant growth and user engagement does create perverse incentives. When platforms must satisfy investors expecting exponential returns, workers and quality can suffer.

## A Different Vision: Ownership-Based Platforms

This is where Bitcoin Writer represents a genuinely different approach. Rather than extracting value from creators, it enables them to own their work directly. Writers can:

- Publish content that they truly own on-chain
- Monetize directly through micropayments
- Build audiences without platform intermediation
- Tokenize their work as unique digital assets

## Moving Beyond False Choices

Iverson presents a false choice between "entropy" and "coherence," between technology and tradition. But the real opportunity lies in combining technological efficiency with human values.

Blockchain technology enables new models that address her core concerns:

### True Ownership
When work is recorded on immutable ledgers, creators maintain permanent ownership rights.

### Direct Value Exchange
Micropayment systems enable direct creator-audience relationships without extractive intermediaries.

### Transparent Governance
Blockchain-based platforms can implement transparent, community-driven governance rather than algorithmic arbitrariness.

## Practical Solutions

Instead of retreating from technology, we should focus on designing better systems:

1. **Worker Ownership**: Platforms where workers collectively own equity
2. **Transparent Algorithms**: Open-source systems where rules are publicly auditable
3. **Value Preservation**: Blockchain systems that preserve creator ownership
4. **Community Governance**: Democratic decision-making processes

## Conclusion

Iverson's concerns about worker dignity and authentic value creation are valid and important. But the solution isn't to reject technological progress—it's to ensure that technology serves human flourishing rather than extraction.

Bitcoin Writer represents one attempt to build technology that enhances rather than diminishes human agency. By enabling true ownership of creative work, it points toward a future where technological efficiency and human dignity can coexist.

The question isn't whether to embrace or reject the digital economy, but how to shape it in ways that honor both innovation and humanity.

*Published on Bitcoin Writer - Technology in service of human creativity.*`,
        author: 'b0ase',
        authorHandle: '@b0ase',
        platform: 'Bitcoin Writer',
        category: 'Economics',
        readTime: 10,
        engagement: 1950,
        thumbnail: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=800&h=400&fit=crop&crop=center',
        price: 0.008,
        isTokenized: true,
        trending: false,
        publishedDate: '2025-01-11',
        tags: ['economics', 'technology', 'work', 'blockchain', 'dignity'],
        nftId: 'nft_456789012',
        transactionId: 'tx_654321098'
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