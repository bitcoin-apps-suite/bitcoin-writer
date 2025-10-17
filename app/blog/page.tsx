'use client'

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import './blog.css';

interface BlogPost {
  id: string;
  title: string;
  content: string;
  slug: string;
  timestamp: string;
  wordCount: number;
  charCount: number;
  cost: number;
  author: string;
  excerpt: string;
  tags: string[];
}

export default function BlogPage() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'recent' | 'popular'>('recent');

  useEffect(() => {
    loadBlogPosts();
  }, [filter]);

  const loadBlogPosts = async () => {
    setIsLoading(true);
    try {
      // Mock data for now - this would come from blockchain/API
      const mockPosts: BlogPost[] = [
        {
          id: '1',
          title: 'The Future of Decentralized Publishing on Bitcoin',
          content: '<p>As we move toward a more decentralized web, Bitcoin is emerging as the backbone for permanent content storage and micropayment systems...</p>',
          slug: 'future-of-decentralized-publishing-on-bitcoin',
          timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
          wordCount: 1245,
          charCount: 7832,
          cost: 0.07832,
          author: '@alice_writer',
          excerpt: 'Exploring how Bitcoin is revolutionizing content creation and monetization for writers worldwide.',
          tags: ['Bitcoin', 'Publishing', 'Decentralization']
        },
        {
          id: '2',
          title: 'Understanding Smart Contracts for Writers',
          content: '<p>Smart contracts are transforming how writers get paid, eliminating the need for intermediaries and ensuring instant payments...</p>',
          slug: 'understanding-smart-contracts-for-writers',
          timestamp: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
          wordCount: 892,
          charCount: 5623,
          cost: 0.05623,
          author: '@bob_blockchain',
          excerpt: 'A comprehensive guide to smart contracts and how they benefit content creators.',
          tags: ['Smart Contracts', 'Writers', 'Blockchain']
        },
        {
          id: '3',
          title: 'Micropayments: The New Economics of Content',
          content: '<p>Traditional content monetization models are broken. Micropayments on Bitcoin offer a new way for creators to earn directly from their audience...</p>',
          slug: 'micropayments-new-economics-of-content',
          timestamp: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
          wordCount: 1567,
          charCount: 9845,
          cost: 0.09845,
          author: '@charlie_crypto',
          excerpt: 'How micropayments are changing the economics of content creation and consumption.',
          tags: ['Micropayments', 'Economics', 'Content']
        }
      ];

      // Sort based on filter
      let sortedPosts = [...mockPosts];
      if (filter === 'recent') {
        sortedPosts.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
      } else if (filter === 'popular') {
        sortedPosts.sort((a, b) => b.wordCount - a.wordCount);
      }

      setPosts(sortedPosts);
    } catch (error) {
      console.error('Failed to load blog posts:', error);
      setPosts([]);
    } finally {
      setIsLoading(false);
    }
  };

  const formatDate = (timestamp: string) => {
    return new Date(timestamp).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatCost = (cost: number): string => {
    if (cost < 0.01) {
      return `$${cost.toFixed(6)}`;
    }
    return `$${cost.toFixed(4)}`;
  };

  return (
    <div className="blog-page">
      <div className="blog-container">
        {/* Header */}
        <div className="blog-header">
          <h1 className="blog-title">Bitcoin Writer Blog</h1>
          <p className="blog-subtitle">
            Insights, tutorials, and stories from the decentralized writing community
          </p>
          
          <div className="blog-actions">
            <Link href="/blog/editor" className="btn-primary">
              <span>Write a Post</span>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <path d="M12 4v16m8-8H4" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              </svg>
            </Link>
          </div>
        </div>

        {/* Filters */}
        <div className="blog-filters">
          <button 
            className={`filter-btn ${filter === 'all' ? 'active' : ''}`}
            onClick={() => setFilter('all')}
          >
            All Posts
          </button>
          <button 
            className={`filter-btn ${filter === 'recent' ? 'active' : ''}`}
            onClick={() => setFilter('recent')}
          >
            Recent
          </button>
          <button 
            className={`filter-btn ${filter === 'popular' ? 'active' : ''}`}
            onClick={() => setFilter('popular')}
          >
            Popular
          </button>
        </div>

        {/* Content */}
        {isLoading ? (
          <div className="blog-loading">
            <div className="loading-spinner"></div>
            <p>Loading posts...</p>
          </div>
        ) : posts.length === 0 ? (
          <div className="blog-empty">
            <h3>No posts yet</h3>
            <p>Be the first to publish a post on Bitcoin Writer!</p>
            <Link href="/blog/editor" className="btn-secondary">
              Start Writing
            </Link>
          </div>
        ) : (
          <div className="blog-posts">
            {posts.map(post => (
              <article key={post.id} className="blog-post-card">
                <div className="post-header">
                  <h2 className="post-title">
                    <Link href={`/blog/${post.slug}`}>{post.title}</Link>
                  </h2>
                  <div className="post-meta">
                    <span className="post-author">{post.author}</span>
                    <span className="post-date">{formatDate(post.timestamp)}</span>
                  </div>
                </div>

                <div className="post-content">
                  <p className="post-excerpt">{post.excerpt}</p>
                </div>

                <div className="post-footer">
                  <div className="post-tags">
                    {post.tags.map(tag => (
                      <span key={tag} className="post-tag">{tag}</span>
                    ))}
                  </div>
                  
                  <div className="post-stats">
                    <span className="post-stat">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                        <path d="M9 12h6m-3-3v6m5 5H7a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v12a2 2 0 01-2 2z" stroke="currentColor" strokeWidth="2"/>
                      </svg>
                      {post.wordCount} words
                    </span>
                    <span className="post-stat">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                        <path d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" stroke="currentColor" strokeWidth="2"/>
                      </svg>
                      {formatCost(post.cost)}
                    </span>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}