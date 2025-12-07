'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';
import { useKVStoreQuill } from '../../../hooks/useKVStoreQuill';
import { KVStoreSettings } from '../../../components/KVStoreSettings';
import { KVStoreConfig } from '../../../lib/kvstore-quill-integration';
import GigQueueView from '../../../components/GigQueueView';
import '../editor/blog-editor.css';

// Dynamically import Quill to avoid SSR issues
const ReactQuill = dynamic(() => import('react-quill'), { ssr: false });
import 'react-quill/dist/quill.snow.css';

export default function BlogEditorV2Page() {
  const router = useRouter();
  const quillRef = useRef<any>(null);
  const [title, setTitle] = useState('');
  const [wordCount, setWordCount] = useState(0);
  const [charCount, setCharCount] = useState(0);
  const [publishCost, setPublishCost] = useState(0);
  const [isPublishing, setIsPublishing] = useState(false);
  const [publishStatus, setPublishStatus] = useState('');
  const [showJobsQueue, setShowJobsQueue] = useState(true);
  const [showSettings, setShowSettings] = useState(false);
  const [documentKey, setDocumentKey] = useState('');
  const [documents, setDocuments] = useState<Array<{ key: string; metadata: any }>>([]);
  
  // KVStore configuration state
  const [kvstoreConfig, setKvstoreConfig] = useState<Partial<KVStoreConfig>>({
    enabled: true,
    autoSave: true,
    autoSaveInterval: 30000,
    topicName: 'blog-posts',
    encryptContent: true,
    useCall: false,
  });

  // Cost calculation: 1/10,000th of a penny per character
  const COST_PER_CHAR = 0.00001; // $0.00001 per character

  // Use KVStore integration
  const {
    integration,
    isLoading,
    isSaving,
    error,
    hasUnsavedChanges,
    save,
    load,
    listDocuments,
    deleteDocument,
    updateConfig,
  } = useKVStoreQuill(quillRef, {
    ...kvstoreConfig,
    documentKey,
    loadOnMount: false,
  });

  const handleAcceptGig = (job: any) => {
    console.log('Accepted gig:', job);
    // TODO: Implement gig acceptance logic
  };

  // Update word/char count when editor content changes
  const handleEditorChange = (content: string) => {
    const text = quillRef.current?.getEditor()?.getText() || '';
    const words = text.trim() ? text.trim().split(/\s+/).length : 0;
    const chars = text.length;
    
    setWordCount(words);
    setCharCount(chars);
    setPublishCost(chars * COST_PER_CHAR);
  };

  const generateSlug = (title: string): string => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();
  };

  // Load documents list on mount
  useEffect(() => {
    if (integration) {
      loadDocumentsList();
    }
  }, [integration]);

  const loadDocumentsList = async () => {
    try {
      const docs = await listDocuments();
      setDocuments(docs);
    } catch (err) {
      console.error('Failed to load documents:', err);
    }
  };

  const handleSave = async () => {
    if (!title.trim()) {
      setPublishStatus('Please enter a title before saving');
      return;
    }

    try {
      const key = documentKey || generateSlug(title);
      setDocumentKey(key);
      
      await save(key, {
        title: title.trim(),
        publishedAt: new Date().toISOString(),
        wordCount,
        charCount,
      });
      
      setPublishStatus('Document saved successfully!');
      await loadDocumentsList();
      
      setTimeout(() => setPublishStatus(''), 3000);
    } catch (err) {
      console.error('Save failed:', err);
      setPublishStatus('Failed to save document');
    }
  };

  const handleLoad = async (key: string) => {
    try {
      await load(key);
      setDocumentKey(key);
      
      // Extract title from metadata if available
      const doc = documents.find(d => d.key === key);
      if (doc?.metadata?.title) {
        setTitle(doc.metadata.title);
      }
      
      setPublishStatus('Document loaded successfully!');
      setTimeout(() => setPublishStatus(''), 3000);
    } catch (err) {
      console.error('Load failed:', err);
      setPublishStatus('Failed to load document');
    }
  };

  const handleDelete = async (key: string) => {
    if (!confirm(`Are you sure you want to delete "${key}"?`)) return;
    
    try {
      await deleteDocument(key);
      await loadDocumentsList();
      
      if (key === documentKey) {
        setDocumentKey('');
        setTitle('');
        quillRef.current?.getEditor()?.setText('');
      }
      
      setPublishStatus('Document deleted');
      setTimeout(() => setPublishStatus(''), 3000);
    } catch (err) {
      console.error('Delete failed:', err);
      setPublishStatus('Failed to delete document');
    }
  };

  const handlePublish = async () => {
    if (!title.trim() || !quillRef.current?.getEditor()?.getText()?.trim()) {
      setPublishStatus('Please enter both title and content');
      return;
    }

    setIsPublishing(true);
    setPublishStatus('Publishing to blockchain...');

    try {
      // Save to KVStore first if enabled
      if (kvstoreConfig.enabled) {
        await handleSave();
      }

      const slug = generateSlug(title);
      const content = quillRef.current.getEditor().root.innerHTML;
      
      const postData = {
        title: title.trim(),
        content,
        slug,
        timestamp: new Date().toISOString(),
        wordCount,
        charCount,
        cost: publishCost,
        kvstoreKey: documentKey,
      };

      // Simulate blockchain publishing (replace with actual blockchain service)
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      setPublishStatus(`Successfully published! Available at: /blog/${slug}`);
      
      // Redirect after successful publish
      setTimeout(() => {
        router.push(`/blog/${slug}`);
      }, 2000);

    } catch (error) {
      console.error('Publishing error:', error);
      setPublishStatus('Publishing failed. Please try again.');
    } finally {
      setIsPublishing(false);
    }
  };

  const handleConfigChange = (config: Partial<KVStoreConfig>) => {
    setKvstoreConfig(config);
    updateConfig(config);
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
            <h1>Blog Editor v2 (KVStore)</h1>
          </div>
          
          <div className="header-actions">
            <button
              type="button"
              className="toggle-settings-btn"
              onClick={() => setShowSettings(!showSettings)}
            >
              {showSettings ? 'Hide Settings' : 'Settings'}
            </button>
            <button
              type="button"
              className={`toggle-jobs-btn ${showJobsQueue ? 'active' : ''}`}
              onClick={() => setShowJobsQueue(!showJobsQueue)}
            >
              {showJobsQueue ? 'Hide Jobs' : 'Show Jobs'}
            </button>
          </div>
        </div>

        {/* Settings Panel */}
        {showSettings && (
          <div className="settings-panel">
            <KVStoreSettings
              config={kvstoreConfig}
              onConfigChange={handleConfigChange}
            />
            
            {/* Documents List */}
            <div className="documents-list mt-4 p-4 bg-gray-50 rounded-lg">
              <h4 className="text-md font-semibold mb-3">Saved Documents</h4>
              {documents.length === 0 ? (
                <p className="text-sm text-gray-500">No saved documents</p>
              ) : (
                <div className="space-y-2">
                  {documents.map(doc => (
                    <div key={doc.key} className="flex items-center justify-between p-2 bg-white rounded border">
                      <div className="flex-1">
                        <div className="text-sm font-medium">{doc.metadata?.title || doc.key}</div>
                        <div className="text-xs text-gray-500">
                          {doc.metadata?.savedAt && new Date(doc.metadata.savedAt).toLocaleString()}
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleLoad(doc.key)}
                          className="text-xs px-2 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
                        >
                          Load
                        </button>
                        <button
                          onClick={() => handleDelete(doc.key)}
                          className="text-xs px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
              <button
                onClick={loadDocumentsList}
                className="mt-2 text-xs px-3 py-1 bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
              >
                Refresh List
              </button>
            </div>
          </div>
        )}

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

          {/* Quill Editor */}
          <div className="input-group editor-group">
            <label className="input-label">
              Content {hasUnsavedChanges && <span className="text-orange-500">(unsaved changes)</span>}
            </label>
            <ReactQuill
              ref={quillRef}
              theme="snow"
              onChange={handleEditorChange}
              placeholder="Write your blog post here..."
              modules={{
                toolbar: [
                  [{ 'header': [1, 2, 3, false] }],
                  ['bold', 'italic', 'underline', 'strike'],
                  ['blockquote', 'code-block'],
                  [{ 'list': 'ordered'}, { 'list': 'bullet' }],
                  [{ 'script': 'sub'}, { 'script': 'super' }],
                  [{ 'indent': '-1'}, { 'indent': '+1' }],
                  ['link', 'image', 'video'],
                  ['clean']
                ],
              }}
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
              {documentKey && (
                <div className="stat">
                  <span className="stat-label">Document:</span>
                  <span className="stat-value">{documentKey}</span>
                </div>
              )}
            </div>

            <div className="publish-actions">
              {publishStatus && (
                <div className={`publish-status ${
                  publishStatus.includes('Successfully') || publishStatus.includes('success') ? 'success' : 
                  publishStatus.includes('failed') ? 'error' : 'info'
                }`}>
                  {publishStatus}
                </div>
              )}
              
              {error && (
                <div className="publish-status error">
                  Error: {error.message}
                </div>
              )}
              
              <div className="flex space-x-2">
                {kvstoreConfig.enabled && (
                  <button
                    type="button"
                    onClick={handleSave}
                    disabled={isSaving || !title.trim()}
                    className="save-btn"
                  >
                    {isSaving ? 'Saving...' : 'Save to KVStore'}
                  </button>
                )}
                
                <button
                  type="button"
                  onClick={handlePublish}
                  disabled={isPublishing || !title.trim() || isLoading}
                  className="publish-btn"
                >
                  {isPublishing ? 'Publishing...' : 'Publish to Blockchain'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}