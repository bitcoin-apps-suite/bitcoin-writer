import React, { useState, useEffect } from 'react';
import { HandCashService } from '../services/HandCashService';
import GigQueueView from './GigQueueView';
import { BlockchainDocumentService } from '../services/BlockchainDocumentService';

interface BlogEditorProps {
  onClose?: () => void;
}

const BlogEditor: React.FC<BlogEditorProps> = ({ onClose }) => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [wordCount, setWordCount] = useState(0);
  const [charCount, setCharCount] = useState(0);
  const [publishCost, setPublishCost] = useState(0);
  const [isPublishing, setIsPublishing] = useState(false);
  const [publishStatus, setPublishStatus] = useState('');
  const [showJobsQueue, setShowJobsQueue] = useState(true);
  const [documentService] = useState<BlockchainDocumentService | null>(null);

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
      
      // Clear form after successful publish
      setTimeout(() => {
        setTitle('');
        setContent('');
        setPublishStatus('');
      }, 3000);

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
    <div style={{
      display: 'flex',
      flex: 1,
      height: '100vh',
      backgroundColor: '#1a1a1a',
      color: '#e0e0e0'
    }}>
      {/* Jobs Queue Sidebar */}
      {showJobsQueue && (
        <div style={{
          width: '400px',
          borderRight: '1px solid #333',
          backgroundColor: '#1a1a1a',
          display: 'flex',
          flexDirection: 'column'
        }}>
          <div style={{
            padding: '1rem',
            borderBottom: '1px solid #333',
            backgroundColor: '#2a2a2a'
          }}>
            <h3 style={{ 
              color: '#ff9500', 
              margin: 0, 
              fontSize: '1.2rem' 
            }}>
              Available Writing Jobs
            </h3>
          </div>
          <div style={{ flex: 1, overflow: 'auto' }}>
            <GigQueueView
              documentService={documentService}
              isAuthenticated={true}
              onAcceptGig={handleAcceptGig}
            />
          </div>
        </div>
      )}

      {/* Main Editor Section */}
      <div style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column'
      }}>
        {/* Header */}
        <div style={{
          padding: '1rem 2rem',
          borderBottom: '1px solid #333',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <h1 style={{ 
            color: '#ff9500', 
            fontSize: '1.8rem', 
            margin: 0 
          }}>
            Blog Editor
          </h1>
          <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
            <button
              onClick={() => setShowJobsQueue(!showJobsQueue)}
              style={{
                background: showJobsQueue ? '#ff9500' : 'none',
                border: '1px solid #ff9500',
                color: showJobsQueue ? '#000' : '#ff9500',
                padding: '0.5rem 1rem',
                borderRadius: '4px',
                cursor: 'pointer',
                fontSize: '0.9rem'
              }}
            >
              {showJobsQueue ? 'Hide Jobs' : 'Show Jobs'}
            </button>
            {onClose && (
              <button
                onClick={onClose}
                style={{
                  background: 'none',
                  border: '1px solid #555',
                  color: '#ccc',
                  padding: '0.5rem 1rem',
                  borderRadius: '4px',
                  cursor: 'pointer'
                }}
              >
                Close
              </button>
            )}
          </div>
        </div>

        {/* Editor Content */}
        <div style={{
          flex: 1,
          padding: '2rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '1rem',
          maxWidth: showJobsQueue ? '800px' : '1200px',
          margin: '0 auto',
          width: '100%'
        }}>
          {/* Title Input */}
          <div>
            <label style={{ 
              display: 'block', 
              marginBottom: '0.5rem',
              color: '#ff9500',
              fontWeight: 'bold'
            }}>
              Post Title
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter your blog post title..."
              style={{
                width: '100%',
                padding: '1rem',
                backgroundColor: '#2a2a2a',
                border: '1px solid #444',
                borderRadius: '4px',
                color: '#e0e0e0',
                fontSize: '1.2rem',
                fontFamily: 'inherit'
              }}
            />
            {title && (
              <div style={{ 
                marginTop: '0.5rem', 
                fontSize: '0.9rem', 
                color: '#999' 
              }}>
                URL: /blog/{generateSlug(title)}
              </div>
            )}
          </div>

          {/* Content Editor */}
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
            <label style={{ 
              display: 'block', 
              marginBottom: '0.5rem',
              color: '#ff9500',
              fontWeight: 'bold'
            }}>
              Content (HTML supported)
            </label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Write your blog post here... HTML tags like <h2>, <p>, <strong>, <em>, <ul>, <li> are supported."
              style={{
                flex: 1,
                minHeight: '400px',
                padding: '1rem',
                backgroundColor: '#2a2a2a',
                border: '1px solid #444',
                borderRadius: '4px',
                color: '#e0e0e0',
                fontSize: '1rem',
                fontFamily: 'Monaco, "Lucida Console", monospace',
                lineHeight: '1.6',
                resize: 'vertical'
              }}
            />
          </div>

          {/* Stats and Publishing */}
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '1rem',
            backgroundColor: '#2a2a2a',
            borderRadius: '4px',
            border: '1px solid #444'
          }}>
            <div style={{ display: 'flex', gap: '2rem' }}>
              <div>
                <span style={{ color: '#999' }}>Words: </span>
                <span style={{ color: '#ff9500', fontWeight: 'bold' }}>{wordCount}</span>
              </div>
              <div>
                <span style={{ color: '#999' }}>Characters: </span>
                <span style={{ color: '#ff9500', fontWeight: 'bold' }}>{charCount}</span>
              </div>
              <div>
                <span style={{ color: '#999' }}>Publishing cost: </span>
                <span style={{ color: '#ff9500', fontWeight: 'bold' }}>{formatCost(publishCost)}</span>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              {publishStatus && (
                <div style={{ 
                  color: publishStatus.includes('Successfully') ? '#4ade80' : publishStatus.includes('failed') ? '#ef4444' : '#fbbf24',
                  fontSize: '0.9rem'
                }}>
                  {publishStatus}
                </div>
              )}
              
              <button
                onClick={handlePublish}
                disabled={isPublishing || !title.trim() || !content.trim()}
                style={{
                  backgroundColor: isPublishing ? '#555' : '#ff9500',
                  color: '#000',
                  border: 'none',
                  padding: '0.75rem 1.5rem',
                  borderRadius: '4px',
                  fontSize: '1rem',
                  fontWeight: 'bold',
                  cursor: isPublishing ? 'not-allowed' : 'pointer',
                  opacity: isPublishing || !title.trim() || !content.trim() ? 0.6 : 1
                }}
              >
                {isPublishing ? 'Publishing...' : 'Publish to Blockchain'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BlogEditor;