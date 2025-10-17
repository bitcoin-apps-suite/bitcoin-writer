'use client'

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import GigQueueView from '../../../components/GigQueueView';
import './blog-editor.css';

export default function BlogEditorPage() {
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [wordCount, setWordCount] = useState(0);
  const [charCount, setCharCount] = useState(0);
  const [publishCost, setPublishCost] = useState(0);
  const [isPublishing, setIsPublishing] = useState(false);
  const [publishStatus, setPublishStatus] = useState('');
  const [showJobsQueue, setShowJobsQueue] = useState(true);

  // Cost calculation: 1/10,000th of a penny per character
  const COST_PER_CHAR = 0.00001; // $0.00001 per character

  const handleAcceptGig = (job: any) => {
    console.log('Accepted gig:', job);
    // TODO: Implement gig acceptance logic
  };

  useEffect(() => {
    const words = content.trim() ? content.trim().split(/\s+/).length : 0;
    const chars = content.length;
    
    setWordCount(words);
    setCharCount(chars);
    setPublishCost(chars * COST_PER_CHAR);
  }, [content]);

  const generateSlug = (title: string): string => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();
  };

  const handlePublish = async () => {
    if (!title.trim() || !content.trim()) {
      setPublishStatus('Please enter both title and content');
      return;
    }

    setIsPublishing(true);
    setPublishStatus('Publishing to blockchain...');

    try {
      const slug = generateSlug(title);
      const postData = {
        title: title.trim(),
        content: content.trim(),
        slug,
        timestamp: new Date().toISOString(),
        wordCount,
        charCount,
        cost: publishCost
      };

      // Simulate blockchain publishing (replace with actual blockchain service)
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      setPublishStatus(`Successfully published! Available at: /blog/${slug}`);
      
      // Clear form and redirect after successful publish
      setTimeout(() => {
        setTitle('');
        setContent('');
        setPublishStatus('');
        router.push(`/blog/${slug}`);
      }, 2000);

    } catch (error) {
      console.error('Publishing error:', error);
      setPublishStatus('Publishing failed. Please try again.');
    } finally {
      setIsPublishing(false);
    }
  };

  const formatCost = (cost: number): string => {
    if (cost < 0.01) {
      return `$${cost.toFixed(6)}`;
    }
    return `$${cost.toFixed(4)}`;
  };

  return (
    <div className="blog-editor-page">
      {/* Jobs Queue Sidebar */}
      {showJobsQueue && (
        <div className="jobs-sidebar">
          <div className="jobs-header">
            <h3>Available Writing Jobs</h3>
          </div>
          <div className="jobs-content">
            <GigQueueView
              documentService={null}
              isAuthenticated={true}
              onAcceptGig={handleAcceptGig}
            />
          </div>
        </div>
      )}

      {/* Main Editor Section */}
      <div className="editor-main">
        {/* Header */}
        <div className="editor-header">
          <div className="header-left">
            <Link href="/blog" className="back-link">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <path d="M19 12H5m7-7l-7 7 7 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              </svg>
              Back to Blog
            </Link>
            <h1>Blog Editor</h1>
          </div>
          
          <div className="header-actions">
            <button
              type="button"
              className={`toggle-jobs-btn ${showJobsQueue ? 'active' : ''}`}
              onClick={() => setShowJobsQueue(!showJobsQueue)}
              title={showJobsQueue ? 'Hide jobs queue' : 'Show jobs queue'}
            >
              {showJobsQueue ? 'Hide Jobs' : 'Show Jobs'}
            </button>
          </div>
        </div>

        {/* Editor Content */}
        <div className="editor-content">
          {/* Title Input */}
          <div className="input-group">
            <label htmlFor="title" className="input-label">
              Post Title
            </label>
            <input
              id="title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter your blog post title..."
              className="title-input"
            />
            {title && (
              <div className="url-preview">
                URL: /blog/{generateSlug(title)}
              </div>
            )}
          </div>

          {/* Content Editor */}
          <div className="input-group editor-group">
            <label htmlFor="content" className="input-label">
              Content (HTML supported)
            </label>
            <textarea
              id="content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Write your blog post here... HTML tags like <h2>, <p>, <strong>, <em>, <ul>, <li> are supported."
              className="content-editor"
            />
          </div>

          {/* Stats and Publishing */}
          <div className="publish-section">
            <div className="stats">
              <div className="stat">
                <span className="stat-label">Words:</span>
                <span className="stat-value">{wordCount}</span>
              </div>
              <div className="stat">
                <span className="stat-label">Characters:</span>
                <span className="stat-value">{charCount}</span>
              </div>
              <div className="stat">
                <span className="stat-label">Publishing cost:</span>
                <span className="stat-value">{formatCost(publishCost)}</span>
              </div>
            </div>

            <div className="publish-actions">
              {publishStatus && (
                <div className={`publish-status ${
                  publishStatus.includes('Successfully') ? 'success' : 
                  publishStatus.includes('failed') ? 'error' : 'info'
                }`}>
                  {publishStatus}
                </div>
              )}
              
              <button
                type="button"
                onClick={handlePublish}
                disabled={isPublishing || !title.trim() || !content.trim()}
                className="publish-btn"
              >
                {isPublishing ? 'Publishing...' : 'Publish to Blockchain'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}