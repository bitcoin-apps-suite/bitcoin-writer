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
        title: 'Anna Iverson\'s "Uberfication"—A Response from 11,000 Trips',
        description: 'A response to Anna Iverson\'s critique of the gig economy from someone who actually drove for seven years',
        content: `# Anna Iverson's "Uberfication"—A Response from 11,000 Trips

Anna Iverson's *"Uberfication—Entropy Dressed in the Language of the Gig Economy"* reads like a lament for a world that's gone—a eulogy for craftsmanship. It's elegant, but it misses the point entirely: technology didn't kill dignity; bad incentives did.

It's easy for me to dismiss Anna Iverson's latest article as garbage. I drove Uber for seven years and racked up over eleven thousand trips. So let's be generous: she took a swing at me and *Bitcoin Writer* as "The Uberfication of Writing," presumably, since that is precisely how I described it in yesterday's vlog, which I sent her—kindly, I thought—to introduce her to what I think is a pretty damn good idea.

Having worked as an Uber driver, I know how convenient, how easy, how enjoyable it is to work that way. I value the chance to be valuable, to take people where they need to go, to be of service, and I valued not having to waste considerable amounts of time and money learning *The Knowledge*, which London black cab drivers still do, at a price tag of around £50k over two years. Nice if you can afford it, but frankly a massive racket run by TfL in an age where GPS is ubiquitous, accurate, and traceable.

## Who Is Anna Iverson?

So who the hell is Iverson, precisely? She's obviously a Tominaga fan of some description, making allusions to the problem of money, but she seems to have missed the point about tokenized equity and remuneration in the gig economy, which is precisely what *Bitcoin Writer* is seeking to address. And so, while it would be straightforward to dismantle her ideas, I'll try to be kind, since Bitcoin is in some ways a complex topic—but I do so with reluctance. Every writer chafes at the idea of having to pull their punches, and I'm no exception.

First off, let's put the idea to bed that Uber drivers in London are having a bad time of it. The reality is that most are immigrants, driving very comfortable, modern cars in what is pretty much "the lap of luxury" for all intents and purposes. I'll get onto the specifics of why that is later, but suffice to say for now that left-wing journalism about Uber drivers is usually coming from a place of liberal guilt and, in some ways, does more harm than good.

## The Employee Classification Problem

Case in point: the left rallied hard to make Uber drivers employees of Uber, which we didn't want to be, affected the timetabling and scheduling, and actually was kind of a pain. It was classic liberal concern trolling at its finest, and in my estimation, wasn't at all motivated by sympathy for Uber drivers, but by anger at capitalism generally ("how dare the CEO earn so much off of poor Uber drivers' backs?"). Yes! True, how dare Travis Kalanick make so much money off me, bastard! But at the same time, you have to understand, those guys and girls in the C-Suite—they've already won. The money's offshore, protected. If you attack the company itself, you're actually just sticking up for the entrenched, corrupt taxi cartel that already has Londoners by the throat—which is exactly what Iverson is doing in her latest piece.

Why? She frames taxis in some nostalgic "old-timey" way—the "handsome cab" fantasy (for those who can afford such luxuries), clearly trying to balance her despair and cynicism after years working in the City of London with her liberal guilt and the political exhaustion that comes from taking so many quick, cheap, comfortable Uber rides—all summoned with a tap on her iPhone and driven by cheerful, relaxed Pakistanis who know gold when they've struck it.

## The Integrity Myth

Sorry if that sounds harsh, but the outrage is manufactured. Newsflash: journalists LOVE taking Ubers. Everyone does! Fast, cheap, comfortable. What's not to love? But according to Anna the sage, Uber drivers are no longer judged by integrity or mastery—but that's simply not true. In fact, it's precisely the reverse. That's exactly what they're judged on, and rated for, and the best ones survive a long time because they're careful and good at their jobs. They're conscientious.

"Autonomy becomes an illusion," she writes, but that simply isn't true. As an Uber driver, you've got all the autonomy. You can go anywhere. Work anytime. Clock off when you want. Refuse jobs all day long.

The reality is that you're more free as an Uber driver than just about anything else I can think of. If it wasn't that way, I simply would not have done it for so long. I genuinely value my freedom and autonomy, and Uber genuinely let me have it, which is why I genuinely despair when I read screeds like Iverson's.

## The Journey Choice Fallacy

She goes on: "The driver cannot choose his journeys." Well, I've dealt with this already. Yes, they can. Categorically. But it's not like drivers were ever in control of where their passengers wanted to go in any previous taxi paradigm either. I had a very straightforward philosophy when I was driving: I was either working and I'd take you where you wanted to go, or I was going home. And that was that.

The wonderful thing about Uber and modern satnav and radar, etc., was also that, yes, I could set my tools to take me to my destination (usually home) and pick up passengers on the way. Which just makes Iverson's commentary all the worse for its careless assumptions and lack of knowledge about the tools which Uber drivers use… every single day.

## What She Misses About Equity

So does Iverson get anything right? Hard to say.

She doesn't land the ultimate punch: that Uber drivers could receive equity in Uber Inc. for completing trips, and that equity could be tokenized on-chain. That's a major omission, and possibly her worst offence. Because she takes aim at (of all things) the velocity of money, hinting only at the issue of inflation, and never directly confronts the reality that Uber (and Travis et al.) had EVERY opportunity to reward their drivers with company equity on the blockchain, and never even once took the idea seriously. They never even hinted at it, which is just pure greed.

Maybe she's a hard-liner for the number 21M, I don't know, and don't get me wrong—I'm all for "number go up." But I'm also a keen advocate of, you know, number not going down drastically when I'm about to buy my coffee in the morning. So while hard money is certainly nice some of the time, soft money sure has its place too. Generally speaking, I'm a fan of both kinds—and I rather cherish little features like price stability. (Call me old-fashioned.)

## Desktop Publishing and Dishwashers

But Anna won't budge. Desktop publishing didn't free mothers to work from home; instead, it chained them to their desks, babies screaming at their ankles. Just like the oft-repeated Twitter idea that women want AI to do the dishes, not write their poetry. Never mind that dishwashers—a hundred-year-old invention—already freed women from that task and gave them the time to write poetry… until, presumably, they decided dishwashers were the "Uberfication of crockery" and took a stand against them too.

Anyway, according to Iverson, being a cab driver was an art form—not, as cab drivers would tell you, a fucking nightmare. The same drunk, abusive, smelly locals wanting a ride home from the pub every damn night, paying in filthy, crumpled notes if they paid at all, and worst of all—wanting to get to know you.

Yeah. No thanks, mate. You can keep your cigarette breath and Tennents Pilsner to yourself.

## The Reality of Modern Platform Work

Yes, yes—Uber is "placeless, faceless, and generic," but in practice it's bliss. It means that as an Uber driver you're constantly meeting fascinating, tidy, polite (young) professionals from all over the world, and having fantastic, interesting conversations with them. And—joy of joys—moving on! You can make twenty best friends a day, play therapist, confidant, tour guide, and teacher (or student), and payment is instant, automatic, and perfectly logged and tracked.

A mutual rating system means—lo and behold—drivers can choose not to pick up shitty passengers because they can see their ratings in advance, and Uber can see it too, which further destroys Iverson's preconceptions. She's not just wrong; she's profoundly wrong.

The reality is that drivers (just like every worker) are judged by their craft, care, attentiveness, cleanliness, punctuality, speed, and skill. Not sometimes. All the time. And it makes for conscientious drivers, which again is a very good thing. You want drivers to be careful, conscientious, and good. And if (dear reader) you are so worried about Uber drivers' wages, it's worth remembering that tipping is the passengers' responsibility and prerogative. It's not against the law to tip, yet it's simply not done in the UK (unlike in the US).

## The Multi-Platform Reality

Moving on to her criticism of the gig economy in general, her concerns are again misplaced and totally out of touch with reality. Why? Because workers in the gig economy don't "just" drive for one platform anymore. Most work across multiple apps. That's why Uber drivers also drive for Lyft and Bolt, and passengers have choices too.

Sometimes platforms pay more—like when Bolt raised rates to lure drivers from Uber. That's the beauty of the free market: competition. Drivers are self-employed and free to be entrepreneurial. Most long-term Uber drivers collect cars and rent them out until they've built their own fleets. That's how it works. You get entrepreneurial. You have to.

## The Depth Fallacy

Yet Iverson continues laboring under a slew of misapprehensions: "Uber teaches us to value immediacy over depth," as if we ever relied on taxi drivers for depth. The idea is comical. A chauffeur? Perhaps. A therapist? Yes. But a cab driver? Are you serious? Taxis are for speed and convenience, not depth.

If you want reflection and refinement, as Iverson says she does, taxis aren't actually in that business. It's not the Orient Express. It's Uber. It's in the name. And Uber was born because Travis Kalanick couldn't get a taxi in Paris in the rain, in the middle of the night, because he didn't speak French, had no cab numbers, and couldn't hail one. It was borne of necessity, technology, and opportunity—which is nothing without execution and drive. It didn't just happen by accident, and he didn't just get lucky. It takes brains, skill, and hard work to build something like Uber… but anyway, I digress. I've laid out my criticisms of Kalanick already.

## The Substack Irony

So Iverson's "origin story" is inaccurate at best, and a nebulous (and I think misguided) criticism of late-stage capitalism at worst. But what is oddly ironic to me is that it's delivered on Substack—the very platform which provoked me into creating *Bitcoin Writer*.

*bWriter* is intended, in the fullness of time, to become "the Uber of Writing." If built correctly and methodically, it will let writers publish their work directly on-chain as encrypted documents, let them issue shares in their works' royalties, and even let them trade them. It will allow them to charge micropayments in paywalls, accept cash instantly, offer contracts to publishers, accept commissions, and provide a steady work queue so they can actually write the things that publishers will pay for and readers will pay to read on the regular—just like an Uber driver.

## The Blockchain Reality

And that's the beauty of blockchain. Micropayments alone will not save the world. This is like imagining YouTube will save us from state-run propaganda, or TikTok will save us from boredom. The reality, as we've seen, is profoundly messy. Solana and Ethereum have shown the way: tokenized equity, startups on-chain, financial chaos, hacks, collapses, and yes, financial crime galore—it's the Wild West.

The market has gone wild with naïve implementations (and often not-so-naïve ones) that destroy user privacy. But even good implementations for wallets and on-chain privacy won't stop the same kind of chaos we find on TikTok, on Solana.

## The Real Solution

The real insight—the one Iverson misses—is that the Uberfication of everything, from driving to writing, isn't just capitalism eating itself; it's shareholder capitalism distributing equity to those who do the work. If done right, blockchain doesn't destroy labour; it formalizes it. It turns effort into tradable value. It creates new forms of ownership, accountability, and yes, risk—but also freedom.

So *Bitcoin Writer* isn't just about paying writers. It's about turning writers' contributions into a real stake in a real economy. It's about hashing every word into an "asset tree," a work tree, and turning every participant into a valuable shareholder in their own creative economy.

Iverson dresses up nostalgia as philosophy. She's not entirely wrong to criticize the massive centralization of power in a few hands, but she misses the crucial point. Yes, *Bitcoin Writer* is the "Uberisation of Writing," but it's also the democratization of stakeholder capitalism. It will enfranchise writers, not destroy them. It will make work more pleasurable, less worrisome. Iverson makes the mistake of thinking coherence comes from slowing things down, rather than aligning incentives properly, and the blockchain doesn't dissolve meaning; it measures it. Equity on-chain, transparent ownership, and automated rewards are coherence—not entropy.

And that's the part most people still can't see: blockchain isn't about money. It's about work.

*Published on Bitcoin Writer - Own your words, own your future.*`,
        author: 'b0ase',
        authorHandle: '@b0ase',
        platform: 'Bitcoin Writer',
        category: 'Economics',
        readTime: 15,
        engagement: 3420,
        thumbnail: 'https://images.unsplash.com/photo-1544197150-b99a580bb7a8?w=800&h=400&fit=crop&crop=center',
        price: 0.012,
        isTokenized: true,
        trending: true,
        publishedDate: '2025-01-11',
        tags: ['economics', 'gig economy', 'uber', 'anna iverson', 'bitcoin writer', 'uberfication'],
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