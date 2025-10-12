import React from 'react';
import { useParams, Link } from 'react-router-dom';

interface ArticlePageProps {}

const ArticlePage: React.FC<ArticlePageProps> = () => {
  const { id } = useParams<{ id: string }>();

  // Article content for different IDs
  const articles = {
    '1': {
    id: '1',
    title: 'Revolutionizing Writing with Bitcoin Writer',
    author: 'b0ase',
    authorHandle: '@b0ase',
    publishDate: 'October 12, 2025',
    readTime: '12 min read',
    content: `
Bitcoin Writer represents a paradigm shift in how we think about content creation, ownership, and monetization. Built on the Bitcoin blockchain, this platform transforms traditional writing into a new form of digital asset creation.

## The Problem with Traditional Publishing

Traditional publishing platforms have several fundamental issues:

- **Centralized Control**: Platform owners control distribution and monetization
- **Limited Ownership**: Writers don't truly own their content once published
- **Revenue Sharing**: Platforms take significant cuts of earnings
- **Lack of Transparency**: Opaque algorithms determine reach and engagement

## The Bitcoin Writer Solution

Bitcoin Writer addresses these issues through blockchain technology:

### 1. True Content Ownership
Every document is hashed and stored on the Bitcoin blockchain, creating an immutable record of ownership. Writers retain full control over their intellectual property.

### 2. Tokenized Equity
Content can be tokenized, allowing writers to:
- Issue shares in their work's future royalties
- Create new revenue streams through equity ownership
- Enable community investment in promising content

### 3. Encrypted Publishing
Writers can:
- Encrypt their content before publishing
- Set micropayment prices for access
- Control who can read their work

### 4. Direct Monetization
No intermediaries between writers and readers:
- Instant Bitcoin payments
- Micropayments as low as 1 cent
- 100% of payments go to content creators

## Technical Implementation

Bitcoin Writer leverages several key technologies:

- **OP_RETURN**: For fast, lightweight content hashing
- **OP_PUSHDATA4**: For secure, larger content storage
- **Multisig P2SH**: For collaborative content ownership
- **HandCash Integration**: For seamless payment processing

## The Future of Writing

This platform represents the "Uberfication of Writing" - transforming writing from a traditional craft into a modern, technology-enabled profession where:

- Writers have multiple revenue streams
- Content becomes tradeable assets
- Community ownership drives engagement
- Blockchain ensures transparency and trust

## Getting Started

Ready to revolutionize your writing career? Bitcoin Writer makes it simple:

1. **Sign up** with HandCash for instant Bitcoin payments
2. **Create** your first encrypted document
3. **Publish** with custom pricing and access controls
4. **Tokenize** successful content for ongoing revenue

The future of writing is here. Own your words, own your future.

*Ready to get started? Visit [Bitcoin Writer](/) and begin your journey into blockchain-powered publishing.*
    `
    },
    '2': {
      id: '2',
      title: 'Bitcoin Writer: The Uberfication of Writing',
      author: 'b0ase',
      authorHandle: '@b0ase',
      publishDate: 'October 12, 2025',
      readTime: '15 min read',
      content: `
@b0ase

Anna Iversen's "Uberfication—Entropy Dressed in the Language of the Gig Economy" reads like a lament for a world that's gone — a eulogy for craftsmanship. It's elegant prose, but it's full of misconceptions, errors, and in the end, it misses the point entirely. And since I actually drove Uber in London for seven years and racked up over eleven thousand trips, I think I know what I'm talking about.

It's actually a little too easy for me to tear Anna Iversen's latest article limb from limb for being lazy and convenient — which is a shame, since I shared my vision of Uberfying writing with her in *Bitcoin Writer* two days ago, and her apparent response was to tear it down immediately, despite the fact that it employs the very technology she supports — Bitcoin — and could revolutionize the writing industry in a way I think is actually pretty cool, and for someone like me, welcome.

And so, while it's difficult to be nice to her, let's at least be generous: she took a swing at *Bitcoin Writer* as "The Uberfication of Writing." Now it's my turn to dismantle her ideas.

Having worked as an Uber driver, I know how convenient, how easy, how enjoyable it is to work that way. I valued the chance to be valuable — to take people where they needed to go, to be of service — and I valued not having to waste considerable amounts of time and money learning "The Knowledge," which London black cab drivers still do, at a price tag of around £50k over two years. Nice if you can afford it, but frankly, a massive racket run by TfL in an age where GPS is ubiquitous, accurate, and, you know, traceable.

So who exactly is Iversen? She's obviously a Tominaga fan of some description, making allusions to the problem of money, but she seems to have missed the point about tokenized equity and remuneration in the gig economy — which is precisely what *bWriter* (Bitcoin Writer) is seeking to address. And while it's straightforward to dismantle her ideas, I'll try to be kind — since Bitcoin is, in some ways, a complex topic — but I do so with reluctance. Every writer chafes at the idea of pulling their punches, and I'm no exception.

## The Uber Driver Reality

First off, let's put to bed the idea that Uber drivers in London are having a bad time of it. The reality is that most are immigrants, driving very comfortable, modern cars in what is, for all intents and purposes, the lap of luxury. I'll get into why that is later, but suffice it to say for now that left-wing journalism about Uber drivers usually comes from a place of liberal guilt — and in some ways, it does more harm than good.

Case in point: the left rallied hard to make Uber drivers employees of Uber — which we didn't want to be. It affected timetabling, scheduling, and was, frankly, a pain. Classic liberal concern-trolling at its finest. In my estimation, it wasn't motivated by sympathy for Uber drivers, but by anger at capitalism itself ("How dare the CEO earn so much off poor Uber drivers' backs?"). Yes, true — how dare Travis Kalanick make so much money off me, the bastard! But you have to understand: those guys and girls in the C-suite have already won. The money's offshore, protected. If you attack the company itself, you're actually just sticking up for the entrenched, corrupt taxi cartel that already has Londoners by the throat — which is exactly what Iversen is doing in her latest piece.

Why? Because she frames taxis in some nostalgic "old-timey" way — the "handsome cab" fantasy (for those who can afford such luxuries) — clearly trying to balance her despair and cynicism after years in the City with her liberal guilt and the exhaustion that comes from taking so many quick, cheap, comfortable Uber rides. All summoned with a tap on her iPhone, driven by cheerful, relaxed Pakistanis who know gold when they've struck it.

Sorry if that sounds harsh, but the outrage is manufactured. Newsflash: journalists *love* taking Ubers. Everyone does. Fast, cheap, comfortable — what's not to love? But according to Anna the sage, Uber drivers are no longer judged by integrity or mastery — which is simply untrue. In fact, it's precisely the reverse. That's exactly what they're judged on and rated for, and the best ones survive a long time because they're careful, professional, and conscientious.

## The Autonomy Question

"Autonomy becomes an illusion," she writes. No, it doesn't. As an Uber driver, you've got all the autonomy you could want. You can go anywhere, work anytime, clock off when you please, and refuse jobs all day long if that's what you want.

The reality is you're freer as an Uber driver than in almost any other job I can think of. If it weren't that way, I wouldn't have done it for so long. I genuinely value my freedom and autonomy, and Uber genuinely gave me both — which is why I despair when I read screeds like Iversen's.

She goes on: "The driver cannot choose his journeys." Well, I've dealt with this already. Yes, they can. Categorically. But it's not like drivers were ever in control of where their passengers wanted to go under any previous taxi paradigm either. My philosophy when I was driving was simple: I was either working — and I'd take you where you wanted to go — or I was going home. That was that.

The wonderful thing about Uber and modern satnav and radar was that I could set my tools to take me home and pick up passengers on the way. Which just makes Iversen's commentary all the worse for its careless assumptions and lack of knowledge about the tools Uber drivers use — every single day.

## What Iversen Misses

So does Iversen get anything right? Hard to say.

She doesn't land the ultimate punch: that Uber drivers could receive equity in Uber Inc. for completing trips — and that equity could be tokenized on-chain. That's a major omission, and possibly her worst offence. Because she takes aim at (of all things) the *velocity of money*, hinting only at inflation, and never confronts the reality that Uber (and Travis et al.) had *every* opportunity to reward drivers with company equity on the blockchain — and never once took it seriously. They never even hinted at it, which is pure greed.

Maybe she's a hardliner for the number 21M — I don't know. Don't get me wrong, I'm all for "number go up." But I'm also a keen advocate of, you know, number not go *down* drastically when I'm about to buy coffee in the morning. So while hard money is nice some of the time, soft money sure has its place too. Generally speaking, I'm a fan of both kinds — and I rather cherish little features like price stability. (Call me old-fashioned.)

## The Desktop Publishing Analogy

But Anna won't budge. Desktop publishing didn't free mothers to work from home — it chained them to their desks, babies screaming at their ankles. Just like the oft-repeated Twitter line that women want AI to do the dishes, not write their poetry. Never mind that dishwashers — a hundred-year-old invention — already freed women from that task and gave them time to write poetry… until, presumably, they decided dishwashers were the "Uberfication of crockery" and took a stand against them too.

Anyway, according to Iversen, being a cab driver was an art form — not, as cab drivers would tell you, a bloody nightmare. The same drunk, abusive, smelly locals wanting a ride home from the pub every damn night, paying in filthy crumpled notes if they paid at all, and worst of all — wanting to *get to know you.*

Yeah. No thanks, mate. You can keep your cigarette breath and Tennents Pilsner to yourself.

## The Reality of Platform Work

Yes, yes — Uber is "placeless, faceless, and generic." But in practice, it's bliss. It means that as an Uber driver you're constantly meeting fascinating, tidy, polite (young) professionals from all over the world, having fantastic, interesting conversations with them — and then, joy of joys, moving on! You can make twenty best friends a day, play therapist, confidant, tour guide, and teacher (or student), and payment is instant, automatic, perfectly logged, and tracked.

And the mutual rating system means — lo and behold — drivers can choose not to pick up unpleasant passengers because they can see their ratings in advance. Uber can see it too, which further destroys Iversen's preconceptions. She's not just wrong — she's profoundly wrong.

The reality is that drivers, like every worker, are judged by their craft, care, attentiveness, cleanliness, punctuality, speed, and skill — not *sometimes*, but *all the time.* And that makes for conscientious drivers — which is a very good thing. You want drivers to be careful, attentive, and good. And if you, dear reader, are so worried about Uber drivers' wages, it's worth remembering that tipping is the passenger's prerogative. It's not against the law to tip — it's just not done in the UK (unlike in the US).

## The Multi-Platform Reality

Moving on to her criticism of the gig economy in general, her concerns are again misplaced and totally out of touch with reality. Why? Because workers in the gig economy don't "just" drive for one platform anymore. Most work across multiple apps. That's why Uber drivers also drive for Lyft and Bolt, and passengers have choices too.

Sometimes platforms pay more — like when Bolt raised rates to lure drivers from Uber. That's the beauty of the free market: competition. Drivers are self-employed and free to be entrepreneurial. Most long-term Uber drivers collect cars and rent them out until they've built their own fleets. That's how it works. You get entrepreneurial. You have to.

## The Depth Fallacy

Yet Iversen continues labouring under a slew of misapprehensions: "Uber teaches us to value immediacy over depth," she says — as if we ever relied on taxi drivers for *depth.* The idea is comical. A chauffeur? Perhaps. A therapist? Maybe. But a cab driver? Please. Taxis are for speed and convenience, not depth.

If you want reflection and refinement, as Iversen claims she does, taxis aren't in that business. It's not the *Orient Express.* It's Uber. It's in the name. Uber was born because Travis Kalanick couldn't get a taxi in Paris in the rain, in the middle of the night — because he didn't speak French, had no cab numbers, and couldn't hail one. It was born of necessity, technology, and opportunity — which are nothing without execution and drive. It didn't just happen "by accident," and he didn't just "get lucky." It takes brains, skill, and hard work to build something like Uber. But anyway, I digress. I've laid out my criticisms of Kalanick already.

## The Substack Irony

So Iversen's "origin story" is inaccurate at best and a misguided criticism of late-stage capitalism at worst. What's oddly ironic to me is that it's delivered on *Substack* — the very platform that provoked me into creating *Bitcoin Writer.*

*bWriter* is intended, in time, to become the "Uber of Writing." If built correctly and methodically, it will let writers publish their work directly on-chain as encrypted documents, issue shares in their work's royalties, and even trade them. It will allow them to charge micropayments, accept cash instantly, offer contracts to publishers, accept commissions, and provide a steady work queue — so they can actually write the things publishers will pay for and readers will pay to read. Just like an Uber driver.

## The Blockchain Insight

And that's the beauty of blockchain. Micropayments alone won't save the world. That's like imagining YouTube will save us from state propaganda, or TikTok will save us from boredom. The reality, as we've seen, is profoundly messy. Solana and Ethereum have shown the way: tokenized equity, startups on-chain, financial chaos, hacks, collapses, and yes, financial crime galore — it's the Wild West.

The market has gone wild with naïve implementations (and often not-so-naïve ones) that destroy user privacy. But even good implementations for wallets and on-chain privacy won't stop the same kind of chaos we find on TikTok or Solana.

The real insight — the one Iversen misses — is that the Uberfication of everything, from driving to writing, isn't just capitalism eating itself; it's shareholder capitalism distributing equity to those who do the work. If done right, blockchain doesn't destroy labour — it formalizes it. It turns effort into tradable value. It creates new forms of ownership, accountability, and yes, risk — but also freedom.

## The Bitcoin Writer Vision

So *Bitcoin Writer* isn't just about paying writers. It's about turning writers' contributions into a real stake in a real economy. It's about hashing every word into an "asset tree" — a work tree — and turning every participant into a shareholder in their own creative economy.

Iversen dresses up nostalgia as philosophy. She's not entirely wrong to criticise the massive centralisation of power in a few hands — but she misses the crucial point. Yes, *Bitcoin Writer* is the "Uberisation of Writing," but it's also the democratisation of stakeholder capitalism. It will enfranchise writers, not destroy them. It will make work more pleasurable, less worrisome. Iversen makes the mistake of thinking coherence comes from slowing things down, rather than aligning incentives properly. The blockchain doesn't dissolve meaning; it measures it. Equity on-chain, transparent ownership, and automated rewards are coherence — not entropy.

And that's the part most people still can't see: that blockchain isn't about money.

It's about work.

*Published on Bitcoin Writer - Own your words, own your future.*
      `
    },
    '3': {
      id: '3',
      title: 'Ideological Oversimplification: Dissecting Iversen\'s Shallow Critique of Debt and Money',
      author: 'b0ase',
      authorHandle: '@b0ase',
      publishDate: 'October 12, 2025',
      readTime: '18 min read',
      content: `
This analysis is not a critique of the technical architecture of Wright's version of Bitcoin, which I agree is the correct protocol for a scalable digital commodity. Rather, it is a critique of Iversen's rhetorical framework, which relies on flawed economic analogies and conceptual inconsistencies to brand her favourite tech-stack as "coherent" by misrepresenting the nature of debt in the traditional financial system.

## The Closed-Loop Farmer Fallacy (Failing Basic Economics)

Iversen's primary argument against the "entropic" debt-based system rests on a fundamental arithmetic error, equating all credit with a destructive siphon.

In her analogy, a farmer borrows $100 at 10% interest, resulting in a $110 obligation to repay. She concludes that the extra $10 "does not exist" and must be siphoned from someone else, labor, or nature, rather than 'created'. This argument collapses because it treats the monetary system as a closed loop, ignoring the productive power of credit (leverage).

The reality is that the farmer borrows $100 at 10% to produce $1,000 dollars of crops. Nature is abundant, and the farmer's labour easily outpaces the lender's interest. Where is the new money coming from? Simple answer of course, it's in 'the ground'. So why would Iversen (and others) ignore this most basic principle of finance?

Yes, debt today incurs interest; because the farmer is competing to borrow that money from other productive farmers who might produce more spectacular gains than them. It's a money 'market', so why treat capital as if its' something limitless, when clearly it is limited by the willingness of those who actually have it to lend?

This is the kind of shallow thinking that is constantly repeated by those unwilling or unable to accept the reality of debt, of scarcity, of credit and interest, moreover, it's shallow because it ignores the primary use case of a technology like bitcoin that will be the most abundant of all, 'the tokenisation of debt-based, government issued, fiat money itself'. So let's examine it again:

**Iversen's Focus:** The $10 debt deficit ($110 obligation - $100 principal).

**The Missing Reality:** The $100 loan was used to buy seed and labor, which, if successful, must generate a value significantly higher than the debt—perhaps $1,000 worth of harvest taken from the ground. Does nature miss it? Did it exist before? No. It was the productive labour of the farmer, his willingness to work and take risk to borrow the money for seed that led to both the crop, the ability to pay, and food on Iversen's table.

**Conclusion:** The farmer is not a victim of a debt siphon; he is a successful (hopefully) entrepreneur using productive credit to create $890 in new, actual wealth (net of debt repayment). Iversen confuses consumptive debt (e.g., payday loans) with productive credit (e.g., business financing), thereby invalidating her entire premise that all interest-bearing credit is entropic and consumes its own foundation.

This selective focus on the $10 cost while ignoring the $900+ gain is a rhetorical device designed to sensationalize her anti-fiat position, not a serious economic critique. She quotes Alexander Hamilton ("Credit is the invigorating principle of modern industry") but immediately ignores the principle in her defining analogy.

## The Coherence-Debt Switcheroo: Structural Debt in PoW

Iversen attempts to define the most occluded bitcoin fork as the ultimate expression of "coherence"—a value-based commodity that multiplies "without depletion" that is not debt-based. However, the mechanism used to secure this commodity, Proof-of-Work (PoW), immediately introduces a profound structural debt by default and by design. Her argument merely trades one form of debt (fiat's inflationary/monetary debt) for another, embracing a massive operational/capital debt.

The security and existence of the Bitcoin ledger are fundamentally reliant on three forms of continuous obligation:

### The Debt of Capital Expenditure (CapEx)

Iversen's claim that BSV represents "Money as a Record of Contribution" is undermined because miners incur massive financial debt—literal loans—to finance the specialized hardware (ASICs) and infrastructure required to compete. The block subsidy is thus primarily generated to service this initial Capital Expenditure Debt, not purely as a record of "contribution" in her philosophical sense.

### The Future Obligation of Security (Economic Debt of Vision)

Her concept of "Immutability/Permanence" is structurally fragile not because of inherent fee scarcity, but because the system is permanently indebted to the realization of its maximalist vision. Miners make massive, sunk Capital Expenditure (CapEx) investments (the 'principal debt') based entirely on the future promise (the 'collateral') that exponentially increasing global data and transaction markets will materialize. If the economic reality (actual transaction volume) does not keep pace with the maximalist prophecy, the massive capital investment is exposed. This reliance on a future, world-changing outcome to service present-day fixed capital costs is the very definition of an Economic Debt and a structural fragility that Iversen conveniently ignores.

### Externalized Debt (Environmental Liability)

Her assertion of "Growth without Depletion" fails because the non-stop, competitive energy consumption required for PoW is a form of Externalized Debt placed upon the environment and society. This entropic consumption of non-renewable resources directly contradicts her claim that BSV is solely a "mirror of true value created."

| Iversen's "Coherence" Claim | The Structural Debt Reality (PoW) |
|---|---|
| "Growth without Depletion" | Requires constant Externalized Debt (Environmental Liability) through non-stop, competitive energy consumption. |
| "Money as a Record of Contribution" | The block reward is primarily generated to service massive Capital Expenditure (CapEx) Debt for ASICs and data centers. |
| "Immutability/Permanence" | The network's security is fundamentally indebted to the realization of the hyper-scaling vision to ensure the miner's costly CapEx investment is profitable. |

## Conclusion: An Ideological Mouthpiece

Iversen's narrative therefore is a classic case of an ideological shill: she misrepresents the "old order" with simplistic arithmetic fallacies and then presents her favored technology (BSV) as a debt-free solution, despite the fact that its own operational backbone (PoW) is structurally dependent on massive, future-revenue-dependent capital debt.

She successfully reframes a technical reality (high PoW cost) as a philosophical virtue ("energy cost of integrity") but fails to provide a serious economic model that addresses the operational debt required to maintain that integrity. While the BSV protocol is technically sound and presents a superior path forward for a digital commodity, her rhetoric undermines the very coherence she claims to be championing.

*Published on Bitcoin Writer - Own your words, own your future.*
      `
    }
  };

  const article = articles[id as keyof typeof articles];

  if (!article) {
    // Show not found message for articles that don't exist
    return (
      <div className="article-page">
        <header className="App-header" style={{ marginTop: '72px' }}>
          <div className="title-section">
            <div className="app-title-container">
              <img 
                src="/logo.svg" 
                alt="Bitcoin Writer Logo" 
                className="app-logo"
                style={{
                  width: '32px',
                  height: '32px',
                  marginRight: '16px',
                  marginTop: '4px',
                  verticalAlign: 'baseline'
                }}
              />
              <h1 
                onClick={() => {
                  window.location.href = '/';
                }}
                style={{
                  cursor: 'pointer',
                  paddingTop: '10px',
                  marginLeft: '-12px'
                }}
                title="Return to main view"
              >
                <span style={{color: '#ff9500'}}>Bitcoin</span> Writer
              </h1>
            </div>
            <p className="app-subtitle">Encrypt, publish and sell shares in your work</p>
          </div>
        </header>

        <div className="article-container" style={{ maxWidth: '800px', margin: '0 auto', padding: '20px', textAlign: 'center' }}>
          <h1 style={{ color: '#fff', marginBottom: '20px' }}>Article Not Found</h1>
          <p style={{ color: '#ccc', marginBottom: '20px' }}>
            The article you're looking for doesn't exist or has been moved.
          </p>
          <Link to="/market" style={{ color: '#ff9500', textDecoration: 'none' }}>
            ← Back to Market
          </Link>
        </div>
      </div>
    );
  }

  // Render the found article
  return (
    <div className="article-page">
      <header className="App-header" style={{ marginTop: '72px' }}>
        <div className="title-section">
          <div className="app-title-container">
            <img 
              src="/logo.svg" 
              alt="Bitcoin Writer Logo" 
              className="app-logo"
              style={{
                width: '32px',
                height: '32px',
                marginRight: '16px',
                marginTop: '4px',
                verticalAlign: 'baseline'
              }}
            />
            <h1 
              onClick={() => {
                window.location.href = '/';
              }}
              style={{
                cursor: 'pointer',
                paddingTop: '10px',
                marginLeft: '-12px'
              }}
              title="Return to main view"
            >
              <span style={{color: '#ff9500'}}>Bitcoin</span> Writer
            </h1>
          </div>
          <p className="app-subtitle">Encrypt, publish and sell shares in your work</p>
        </div>
      </header>

      <div className="article-container" style={{ maxWidth: '800px', margin: '0 auto', padding: '20px' }}>
        <nav style={{ marginBottom: '20px' }}>
          <Link to="/market" style={{ color: '#ff9500', textDecoration: 'none' }}>
            ← Back to Market
          </Link>
        </nav>

        <article>
          <header style={{ marginBottom: '30px', borderBottom: '1px solid #333', paddingBottom: '20px' }}>
            <h1 style={{ fontSize: '2.5em', marginBottom: '10px', color: '#fff' }}>
              {article.title}
            </h1>
            <div style={{ display: 'flex', gap: '20px', color: '#ccc', fontSize: '0.9em' }}>
              <span>By {article.author}</span>
              <span>{article.publishDate}</span>
              <span>{article.readTime}</span>
            </div>
          </header>

          <div 
            style={{ 
              lineHeight: '1.8', 
              color: '#e0e0e0', 
              fontSize: '1.1em',
              whiteSpace: 'pre-line'
            }}
            dangerouslySetInnerHTML={{ 
              __html: article.content
                .replace(/^# (.*$)/gm, '<h1 style="color: #ff9500; font-size: 2em; margin: 30px 0 20px 0;">$1</h1>')
                .replace(/^## (.*$)/gm, '<h2 style="color: #fff; font-size: 1.5em; margin: 25px 0 15px 0;">$1</h2>')
                .replace(/^### (.*$)/gm, '<h3 style="color: #fff; font-size: 1.2em; margin: 20px 0 10px 0;">$1</h3>')
                .replace(/^\- (.*$)/gm, '<li style="margin: 8px 0;">$1</li>')
                .replace(/\*\*(.*?)\*\*/g, '<strong style="color: #fff;">$1</strong>')
                .replace(/\*(.*?)\*/g, '<em>$1</em>')
                .replace(/\n\n/g, '<br><br>')
            }}
          />
        </article>

        <footer style={{ marginTop: '50px', padding: '20px 0', borderTop: '1px solid #333' }}>
          <div style={{ textAlign: 'center', color: '#ccc' }}>
            <p>Published on Bitcoin Writer - Own your words, own your future.</p>
            <Link to="/market" style={{ color: '#ff9500', textDecoration: 'none' }}>
              ← Back to Market
            </Link>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default ArticlePage;