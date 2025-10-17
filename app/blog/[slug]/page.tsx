'use client'

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import '../blog.css';
import './blog-post.css';

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

export default function BlogPostPage() {
  const params = useParams();
  const slug = params.slug as string;
  const [post, setPost] = useState<BlogPost | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    loadBlogPost();
  }, [slug]);

  const loadBlogPost = async () => {
    setIsLoading(true);
    try {
      // Mock data for now - this would come from blockchain/API
      const mockPosts: BlogPost[] = [
        {
          id: '1',
          title: 'The Future of Decentralized Publishing on Bitcoin',
          content: `
            <h2>Introduction</h2>
            <p>As we move toward a more decentralized web, Bitcoin is emerging as the backbone for permanent content storage and micropayment systems. This transformation is not just theoretical—it's happening now, and writers are at the forefront of this revolution.</p>
            
            <h2>Why Bitcoin for Publishing?</h2>
            <p>Bitcoin offers several key advantages for content creators:</p>
            <ul>
              <li><strong>Immutability:</strong> Once published to the blockchain, your content cannot be censored or removed</li>
              <li><strong>Proof of Creation:</strong> Timestamps prove when content was created, protecting intellectual property</li>
              <li><strong>Direct Monetization:</strong> Micropayments enable new revenue models without intermediaries</li>
              <li><strong>Global Accessibility:</strong> Anyone with internet access can participate, regardless of location or banking status</li>
            </ul>

            <h2>The Writing Economy Revolution</h2>
            <p>Traditional publishing models are broken. Writers often wait months to get paid, platforms take large cuts, and censorship is always a threat. Bitcoin Writer changes this by:</p>
            
            <blockquote>
              <p>"Enabling instant payments, permanent storage, and true ownership of content for writers worldwide."</p>
            </blockquote>

            <h2>Getting Started</h2>
            <p>Ready to join the revolution? Here's how to get started:</p>
            <ol>
              <li>Create your first document in the Bitcoin Writer editor</li>
              <li>Hash your content to the Bitcoin blockchain</li>
              <li>Set up micropayment monetization</li>
              <li>Share your work and start earning</li>
            </ol>

            <h2>The Future is Now</h2>
            <p>The future of publishing is decentralized, and it's built on Bitcoin. Join us in creating a world where writers are truly free to create, publish, and profit from their work without intermediaries.</p>
          `,
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
          content: `
            <h2>What Are Smart Contracts?</h2>
            <p>Smart contracts are self-executing contracts with the terms of the agreement directly written into code. For writers, they represent a paradigm shift in how we get paid and protect our work.</p>
            
            <h2>Benefits for Writers</h2>
            <p>Smart contracts eliminate many traditional pain points in the writing industry:</p>
            <ul>
              <li>Instant payment upon contract completion</li>
              <li>No need for intermediaries or escrow services</li>
              <li>Transparent terms that cannot be changed</li>
              <li>Automatic royalty distribution</li>
            </ul>

            <h2>Real-World Applications</h2>
            <p>Here are some ways writers are already using smart contracts:</p>
            <ul>
              <li><strong>Article Commissioning:</strong> Publishers create contracts, writers fulfill them, payment releases automatically</li>
              <li><strong>Subscription Content:</strong> Readers pay, unlock premium content automatically</li>
              <li><strong>Collaborative Writing:</strong> Multiple authors share revenues based on contribution</li>
            </ul>

            <p>The future of writing is programmable, transparent, and fair. Smart contracts make this possible.</p>
          `,
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
          content: `
            <h2>The Problem with Traditional Models</h2>
            <p>Traditional content monetization is broken. Subscription fatigue, advertising revenue decline, and platform dependency have left creators struggling to make sustainable income from their work.</p>

            <h2>Enter Micropayments</h2>
            <p>Micropayments on Bitcoin offer a revolutionary alternative. Instead of large, infrequent payments, readers can pay tiny amounts (even fractions of a cent) to access individual pieces of content.</p>

            <h2>Benefits for Creators</h2>
            <ul>
              <li><strong>Lower Barrier to Entry:</strong> Readers don't need expensive subscriptions</li>
              <li><strong>Direct Relationship:</strong> No platform taking a cut</li>
              <li><strong>Global Market:</strong> Anyone with Bitcoin can pay</li>
              <li><strong>Instant Monetization:</strong> Get paid as content is consumed</li>
            </ul>

            <h2>The Network Effect</h2>
            <p>As more creators adopt micropayments, the ecosystem becomes more valuable for everyone. Readers get access to diverse content without expensive subscriptions, and creators get sustainable income streams.</p>

            <p>This is the future of content economics—and it's happening now on Bitcoin.</p>
          `,
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

      const foundPost = mockPosts.find(p => p.slug === slug);
      if (foundPost) {
        setPost(foundPost);
      } else {
        setNotFound(true);
      }
    } catch (error) {
      console.error('Failed to load blog post:', error);
      setNotFound(true);
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

  if (isLoading) {
    return (
      <div className="blog-post-page">
        <div className="blog-container">
          <div className="blog-loading">
            <div className="loading-spinner"></div>
            <p>Loading post...</p>
          </div>
        </div>
      </div>
    );
  }

  if (notFound || !post) {
    return (
      <div className="blog-post-page">
        <div className="blog-container">
          <div className="blog-empty">
            <h3>Post Not Found</h3>
            <p>The blog post you're looking for doesn't exist.</p>
            <Link href="/blog" className="btn-secondary">
              Back to Blog
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="blog-post-page">
      <div className="blog-container">
        {/* Navigation */}
        <div className="post-navigation">
          <Link href="/blog" className="back-link">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path d="M19 12H5m7-7l-7 7 7 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            </svg>
            Back to Blog
          </Link>
        </div>

        {/* Article */}
        <article className="blog-post">
          <header className="post-header-full">
            <h1 className="post-title-full">{post.title}</h1>
            
            <div className="post-meta-full">
              <div className="meta-group">
                <span className="post-author">{post.author}</span>
                <span className="meta-separator">•</span>
                <span className="post-date">{formatDate(post.timestamp)}</span>
              </div>
              
              <div className="post-stats-full">
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
                  Publishing cost: {formatCost(post.cost)}
                </span>
              </div>
            </div>

            <div className="post-tags-full">
              {post.tags.map(tag => (
                <span key={tag} className="post-tag">{tag}</span>
              ))}
            </div>
          </header>

          <div className="post-content-full">
            <div dangerouslySetInnerHTML={{ __html: post.content }} />
          </div>

          <footer className="post-footer-full">
            <div className="post-actions">
              <button type="button" className="btn-secondary">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                  <path d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" stroke="currentColor" strokeWidth="2"/>
                </svg>
                Like this post
              </button>
              
              <button type="button" className="btn-secondary">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                  <path d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" stroke="currentColor" strokeWidth="2"/>
                </svg>
                Share
              </button>
            </div>

            <div className="author-info">
              <h3>About the Author</h3>
              <p>
                <strong>{post.author}</strong> is a blockchain enthusiast and content creator 
                specializing in Bitcoin and decentralized technologies.
              </p>
            </div>
          </footer>
        </article>
      </div>
    </div>
  );
}