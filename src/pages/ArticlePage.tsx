import React from 'react';
import { useParams, Link } from 'react-router-dom';

interface ArticlePageProps {}

const ArticlePage: React.FC<ArticlePageProps> = () => {
  const { id } = useParams<{ id: string }>();

  // Article content for ID 1 - Bitcoin Writer platform article
  const bitcoinWriterArticle = {
    id: '1',
    title: 'Revolutionizing Writing with Bitcoin Writer',
    author: 'b0ase',
    authorHandle: '@b0ase',
    publishDate: 'December 2024',
    readTime: '12 min read',
    content: `
# Revolutionizing Writing with Bitcoin Writer

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
  };

  if (id === '1') {
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
                {bitcoinWriterArticle.title}
              </h1>
              <div style={{ display: 'flex', gap: '20px', color: '#ccc', fontSize: '0.9em' }}>
                <span>By {bitcoinWriterArticle.author}</span>
                <span>{bitcoinWriterArticle.publishDate}</span>
                <span>{bitcoinWriterArticle.readTime}</span>
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
                __html: bitcoinWriterArticle.content
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
  }

  // For other article IDs, show a not found message
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
};

export default ArticlePage;