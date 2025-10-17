'use client';

import React from 'react';
import { useParams } from 'next/navigation';

// Note: Article data is stored in data/articles.json
// Using getStaticProps to pre-render article pages at build time for better performance and SEO.

// Placeholder for article content
const articles = {
  '1': {
    title: 'Revolutionizing Writing with Bitcoin Writer',
    content: `<img src="/bitcoin-writer-intro.jpg" alt="Revolutionizing Writing with Bitcoin Writer" class="article-image" /><p><br></p><p>In an era where content creators struggle to monetize their work and maintain ownership of their intellectual property, Bitcoin Writer emerges as a revolutionary platform that transforms the landscape of digital publishing.</p><p><br></p><div class="subtitle">The Problem with Traditional Publishing</div><p><br></p><p>Traditional publishing platforms often leave writers at the mercy of changing algorithms, demonetization policies, and centralized control. Writers invest countless hours creating valuable content, only to see their work buried by platform changes or their revenue streams disrupted without warning.</p><p><br></p><div class="subtitle">Enter Bitcoin Writer: A Paradigm Shift</div><p><br></p><p>Bitcoin Writer leverages the power of blockchain technology to give writers true ownership of their content. By storing documents on the Bitcoin SV blockchain, writers can:</p><p><br></p><p>• Encrypt and control access to their work with unbreakable cryptographic security</p><p>• Tokenize content to create new revenue streams and allow readers to invest in writing</p><p>• Maintain permanent ownership through immutable blockchain records</p><p>• Monetize directly without platform intermediaries taking excessive cuts</p><p><br></p><div class="subtitle">Key Features That Change Everything</div><p><br></p><p><strong>1. Blockchain-Based Ownership</strong></p><p>Every document is cryptographically signed and stored on the blockchain, creating an immutable record of ownership and authorship. This eliminates disputes over intellectual property and ensures writers always maintain control.</p><p><br></p><p><strong>2. Encrypted Publishing</strong></p><p>Writers can publish content with multiple access levels - from completely public to premium encrypted content that requires payment to unlock. This creates new monetization opportunities while protecting valuable intellectual property.</p><p><br></p><p><strong>3. Tokenization and Investment</strong></p><p>Transform your writing into digital assets that readers can purchase shares in. As your work gains value and recognition, early supporters benefit alongside the author, creating a new economy around quality content.</p><p><br></p><p><strong>4. Direct Monetization</strong></p><p>Skip the platform middlemen. Bitcoin Writer enables direct payment from readers to writers using Bitcoin microtransactions, ensuring creators keep the majority of revenue from their work.</p><p><br></p><div class="subtitle">The Impact on Content Creation</div><p><br></p><p>This technology doesn't just change how content is published - it fundamentally alters the relationship between writers and readers. Instead of competing for algorithmic favor, writers can focus on creating high-quality content that directly serves their audience.</p><p><br></p><p>The result is a more sustainable content ecosystem where quality trumps quantity, readers become investors in content they value, writers build direct relationships with their audience, and content retains value over time rather than becoming lost in endless feeds.</p><p><br></p><div class="subtitle">Looking Forward</div><p><br></p><p>Bitcoin Writer represents the first step toward a truly decentralized content economy. As more writers adopt blockchain-based publishing, we're moving toward a future where content creators have unprecedented control over their work and their economic destiny.</p><p><br></p><p>The writing revolution has begun. The question isn't whether blockchain will transform publishing - it's whether you'll be part of shaping that future.</p><p><br></p><p>---</p><p><br></p><p><em>This article was published on Bitcoin Writer, demonstrating the platform's capabilities for long-form content creation and blockchain-based publishing.</em></p>`,
    author: 'b0ase',
    date: '2024-01-15'
  },
  '2': {
    title: 'Bitcoin Writer: The Uberfication of Writing',
    content: 'Placeholder content for article 2. Replace with actual content from historical data or React deployment.',
    author: 'b0ase',
    date: '2023-12-02'
  },
  '3': {
    title: 'Ideological Oversimplification: Dissecting a Shallow Critique of Debt and Money',
    content: 'Placeholder content for article 3. Replace with actual content from historical data or React deployment.',
    author: 'b0ase',
    date: '2023-12-03'
  },
  '4': {
    title: 'How to Build a \'bOS\': A Pragmatic Strategic Plan for Decentralized Finance',
    content: `<img src="/bitcoin-os-header.jpg" alt="How to Build a 'bOS': A Pragmatic Strategic Plan for Decentralized Finance" class="article-image" /><p><br></p><p>The concept of a Bitcoin Operating System (bOS) represents the next evolution in decentralized computing infrastructure. This comprehensive strategic plan outlines how to build a self-governing computational ecosystem that rewards service providers with direct payment and corporate equity.</p><p><br></p><div class="subtitle">Executive Summary</div><p><br></p><p>The bOS vision encompasses a distributed operating system where applications, services, and infrastructure components operate autonomously on the Bitcoin SV blockchain. Unlike traditional centralized systems, bOS creates a truly decentralized economy where participants are rewarded proportionally to their contributions.</p><p><br></p><div class="subtitle">Core Architecture Principles</div><p><br></p><p><strong>1. Self-Sovereign Infrastructure</strong></p><p>Every component of bOS operates independently while contributing to the larger ecosystem. Service providers maintain full control over their infrastructure while participating in a collaborative network that benefits all participants.</p><p><br></p><p><strong>2. Direct Payment Protocols</strong></p><p>All services within bOS utilize Bitcoin microtransactions for immediate, direct payment. This eliminates the need for traditional payment processing and reduces transaction costs to negligible amounts.</p><p><br></p><p><strong>3. Equity-Based Incentives</strong></p><p>Long-term contributors to the bOS ecosystem receive equity stakes in the overall network value. This creates aligned incentives where the success of individual services contributes to collective wealth generation.</p><p><br></p><div class="subtitle">Implementation Roadmap</div><p><br></p><p><strong>Phase 1: Foundation Layer (Months 1-6)</strong></p><p>• Identity Management: Implement HandCash-based identity verification</p><p>• Payment Infrastructure: Deploy microtransaction protocols</p><p>• Basic Services: Launch core utilities (storage, computation, networking)</p><p>• Governance Framework: Establish decision-making protocols</p><p><br></p><p><strong>Phase 2: Service Ecosystem (Months 7-12)</strong></p><p>• Application Layer: Deploy productivity applications (like Bitcoin Writer)</p><p>• Developer Tools: Create SDKs and APIs for third-party development</p><p>• Economic Protocols: Implement equity distribution mechanisms</p><p>• Quality Assurance: Establish service quality metrics and standards</p><p><br></p><p><strong>Phase 3: Network Effects (Months 13-24)</strong></p><p>• Third-Party Integration: Onboard external service providers</p><p>• Advanced Features: Implement AI and machine learning services</p><p>• Global Distribution: Deploy infrastructure across multiple continents</p><p>• Enterprise Adoption: Target business and institutional users</p><p><br></p><div class="subtitle">Economic Model</div><p><br></p><p><strong>Revenue Streams</strong></p><p>1. Transaction Fees: Small percentage of all platform transactions</p><p>2. Service Premiums: Enhanced features and priority access</p><p>3. Data Analytics: Anonymized usage insights (with user consent)</p><p>4. Enterprise Licensing: Custom deployments for large organizations</p><p><br></p><p><strong>Equity Distribution</strong></p><p>Service providers receive equity based on computational resources contributed, user satisfaction ratings, network uptime and reliability, and innovation and feature development.</p><p><br></p><div class="subtitle">Technical Infrastructure</div><p><br></p><p><strong>Blockchain Layer</strong></p><p>Bitcoin SV provides the foundational layer for immutable transaction records, smart contract execution, data storage and retrieval, and identity verification.</p><p><br></p><p><strong>Application Layer</strong></p><p>Distributed applications run on a hybrid architecture with client-side processing for immediate responsiveness, blockchain integration for data persistence, P2P networking for service discovery, and economic protocols for automatic payment processing.</p><p><br></p><div class="subtitle">Risk Mitigation</div><p><br></p><p><strong>Technical Risks</strong></p><p>• Scalability: Implement sharding and layer-2 solutions</p><p>• Security: Multi-signature protocols and regular audits</p><p>• Reliability: Redundant infrastructure and failover mechanisms</p><p><br></p><p><strong>Economic Risks</strong></p><p>• Market Volatility: Stable coin integration for price stability</p><p>• Adoption Curves: Gradual rollout and user education programs</p><p>• Competition: Focus on unique value propositions and network effects</p><p><br></p><div class="subtitle">Success Metrics</div><p><br></p><p><strong>Year 1 Targets</strong></p><p>• 1,000+ active service providers</p><p>• 10,000+ daily active users</p><p>• $1M+ in monthly transaction volume</p><p>• 99.9% network uptime</p><p><br></p><p><strong>Year 3 Targets</strong></p><p>• 100,000+ service providers</p><p>• 1M+ daily active users</p><p>• $100M+ in monthly transaction volume</p><p>• Global infrastructure presence</p><p><br></p><div class="subtitle">Conclusion</div><p><br></p><p>The bOS represents a fundamental shift from centralized computing toward a truly decentralized digital economy. By aligning economic incentives with technical contribution, we can create a self-sustaining ecosystem that grows stronger with each new participant.</p><p><br></p><p>The key to success lies not in revolutionary technology alone, but in pragmatic implementation that creates immediate value for users while building toward the larger vision of decentralized computing.</p><p><br></p><p>This strategic plan provides the roadmap. The next step is execution.</p><p><br></p><p>---</p><p><br></p><p><em>This strategic plan was developed as part of the Bitcoin Operating System initiative, demonstrating the practical application of blockchain technology for enterprise-scale decentralized systems.</em></p>`,
    author: 'b0ase',
    date: '2024-01-10'
  },
  '5': {
    title: 'Crypto Content Monetization',
    content: 'Placeholder content for article 5. Replace with actual content from historical data or React deployment.',
    author: 'Satoshi Writer',
    date: '2023-12-05'
  },
  '6': {
    title: 'NFT Publishing Revolution',
    content: 'Placeholder content for article 6. Replace with actual content from historical data or React deployment.',
    author: 'NFT Creator',
    date: '2023-12-06'
  }
  // Add more articles as needed based on historical data
};

const ArticlePage = () => {
  const params = useParams();
  const id = params.id as string;
  const article = articles[id as keyof typeof articles];
  
  if (!article) {
    return (
      <div className="container mx-auto p-4">
        <h1 className="text-3xl font-bold mb-4">Article Not Found</h1>
        <p>The requested article could not be found.</p>
      </div>
    );
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: '#0a0a0a',
      color: '#ffffff',
      fontFamily: "'SF Pro Display', 'Helvetica Neue', 'Segoe UI', -apple-system, BlinkMacSystemFont, sans-serif"
    }}>
      {/* Header matching the main site */}
      <div className="app-header">
        <div className="header-content">
          <div className="header-logo">
            <div className="logo-icon">
              <svg width="32" height="32" viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect width="200" height="200" rx="40" fill="url(#gradient)"/>
                <path d="M50 150 Q80 40 150 50 Q120 80 100 120 L90 130 Q70 140 50 150 Z" fill="#2D3748" stroke="#2D3748" strokeWidth="2"/>
                <path d="M70 100 Q90 80 110 90" stroke="#2D3748" strokeWidth="1.5" fill="none"/>
                <path d="M80 120 Q95 105 115 110" stroke="#2D3748" strokeWidth="1.5" fill="none"/>
                <defs>
                  <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" style={{stopColor:"#FF8C00", stopOpacity:1}} />
                    <stop offset="100%" style={{stopColor:"#FF6B35", stopOpacity:1}} />
                  </linearGradient>
                </defs>
              </svg>
            </div>
            <span 
              className="logo-text"
              onClick={() => window.location.href = '/'}
              style={{ cursor: 'pointer' }}
              title="Return to main view"
            >
              Bitcoin
            </span>
            <span className="logo-writer">Writer</span>
          </div>
        </div>
      </div>
      
      <div style={{
        maxWidth: '800px',
        margin: '0 auto',
        padding: '2rem',
        paddingTop: '1rem'
      }}>
        <div style={{
          marginBottom: '2rem',
          padding: '1rem',
          background: 'rgba(255, 255, 255, 0.05)',
          borderRadius: '8px',
          border: '1px solid rgba(255, 255, 255, 0.1)'
        }}>
          <p style={{ color: '#888', fontSize: '14px', margin: '0 0 8px 0' }}>
            By {article.author} | {article.date}
          </p>
          <a 
            href="/market" 
            style={{ 
              color: '#f7931a', 
              textDecoration: 'none',
              fontSize: '14px',
              fontWeight: '500'
            }}
            onMouseOver={(e) => e.target.style.textDecoration = 'underline'}
            onMouseOut={(e) => e.target.style.textDecoration = 'none'}
          >
            ← Back to Market
          </a>
        </div>
        
        <article style={{
          lineHeight: '1.7',
          fontSize: '16px'
        }}>
          <h1 style={{
            fontSize: '2.5rem',
            fontWeight: '700',
            color: '#ff9500',
            margin: '2rem 0 1.5rem 0',
            lineHeight: '1.2',
            borderBottom: '2px solid rgba(255, 149, 0, 0.3)',
            paddingBottom: '0.5rem'
          }}>
            {article.title}
          </h1>
          <div 
            className="article-content"
            dangerouslySetInnerHTML={{ __html: article.content }}
            style={{
              color: '#ffffff'
            }}
          />
        </article>
      </div>
    </div>
  );
};


export default ArticlePage;
