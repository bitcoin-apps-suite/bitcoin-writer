'use client';

import React from 'react';
import { useParams } from 'next/navigation';
import { articles } from '../../../../data/articles';

// Note: Article data is stored in data/articles.ts
// Articles are imported from a separate file to optimize bundle size

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
      <style jsx global>{`
        .article-content h2 {
          font-size: 1.8rem;
          font-weight: 600;
          color: #ff9500;
          margin: 2rem 0 1rem 0;
        }
        
        .article-content h3 {
          font-size: 1.4rem;
          font-weight: 600;
          color: #f7931a;
          margin: 1.5rem 0 0.75rem 0;
        }
        
        .article-content p {
          margin-bottom: 1rem;
          line-height: 1.7;
        }
        
        .article-content ul {
          margin: 1rem 0;
          padding-left: 2rem;
        }
        
        .article-content li {
          margin: 0.5rem 0;
        }
        
        .article-content strong {
          color: #ff9500;
          font-weight: 600;
        }
        
        .article-content em {
          color: #aaa;
        }
        
        .article-content blockquote {
          border-left: 4px solid #ff9500;
          padding-left: 1rem;
          margin: 1.5rem 0;
          font-style: italic;
          color: #ccc;
        }
        
        .article-content .subtitle {
          font-size: 1.3rem;
          font-weight: 600;
          color: #f7931a;
          margin: 1.5rem 0 0.75rem 0;
        }
        
        .article-content img {
          max-width: 100%;
          height: auto;
          border-radius: 8px;
          margin: 1.5rem 0;
        }
        
        .article-content a {
          color: #f7931a;
          text-decoration: underline;
        }
        
        .article-content a:hover {
          color: #ff9500;
        }
      `}</style>
      
      <div className="container mx-auto px-4 py-8" style={{ maxWidth: '800px' }}>
        <div style={{ 
          marginBottom: '2rem',
          padding: '1rem 0',
          borderBottom: '1px solid rgba(255, 255, 255, 0.1)'
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