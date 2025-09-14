import React, { useState, useEffect, useCallback } from 'react';
import { TwitterAuthService, TwitterUser } from '../services/TwitterAuthService';

interface PostToTwitterModalProps {
  isOpen: boolean;
  onClose: () => void;
  documentTitle: string;
  documentContent: string;
}

const PostToTwitterModal: React.FC<PostToTwitterModalProps> = ({
  isOpen,
  onClose,
  documentTitle,
  documentContent
}) => {
  const [twitterService] = useState(() => TwitterAuthService.getInstance());
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentUser, setCurrentUser] = useState<TwitterUser | null>(null);
  const [tweetText, setTweetText] = useState('');
  const [isThreadMode, setIsThreadMode] = useState(false);
  const [includeLink, setIncludeLink] = useState(true);
  const [isPosting, setIsPosting] = useState(false);
  const [postSuccess, setPostSuccess] = useState(false);
  const [tweetUrl, setTweetUrl] = useState('');
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [selectedSnippet, setSelectedSnippet] = useState<'beginning' | 'custom' | 'summary'>('beginning');
  const [customStartIndex, setCustomStartIndex] = useState(0);
  const [customEndIndex, setCustomEndIndex] = useState(280);

  const checkAuthStatus = useCallback(async () => {
    const authenticated = twitterService.isAuthenticated();
    setIsAuthenticated(authenticated);
    if (authenticated) {
      setCurrentUser(twitterService.getCurrentUser());
    }
  }, [twitterService]);

  const initializeTweetText = useCallback(() => {
    // Initialize with document title and beginning of content
    const plainText = documentContent.replace(/<[^>]*>/g, '').trim();
    const preview = plainText.substring(0, 200);
    setTweetText(`📝 ${documentTitle}\n\n${preview}...`);
    setCustomEndIndex(Math.min(280, plainText.length));
  }, [documentContent, documentTitle]);

  useEffect(() => {
    if (isOpen) {
      checkAuthStatus();
      initializeTweetText();
    }
  }, [isOpen, checkAuthStatus, initializeTweetText]);

  const handleLogin = async () => {
    try {
      setIsLoggingIn(true);
      await twitterService.login();
      // The login method will handle the OAuth flow
      // We'll check auth status when the modal re-renders
    } catch (error) {
      console.error('Failed to login to Twitter:', error);
      alert('Failed to connect to Twitter. Please try again.');
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleLogout = () => {
    twitterService.logout();
    setIsAuthenticated(false);
    setCurrentUser(null);
  };

  const updateTweetFromSnippet = useCallback(() => {
    const plainText = documentContent.replace(/<[^>]*>/g, '').trim();

    switch (selectedSnippet) {
      case 'beginning':
        setTweetText(`📝 ${documentTitle}\n\n${plainText.substring(0, 200)}...`);
        break;
      case 'custom':
        const customText = plainText.substring(customStartIndex, customEndIndex);
        setTweetText(`📝 ${documentTitle}\n\n"${customText}"...`);
        break;
      case 'summary':
        // Generate a simple summary (first sentence + last sentence)
        const sentences = plainText.match(/[^.!?]+[.!?]+/g) || [];
        const firstSentence = sentences[0] || '';
        const lastSentence = sentences[sentences.length - 1] || '';
        setTweetText(`📝 ${documentTitle}\n\n${firstSentence}\n[...]\n${lastSentence}`);
        break;
    }
  }, [documentContent, documentTitle, selectedSnippet, customStartIndex, customEndIndex]);

  useEffect(() => {
    if (isOpen && documentContent) {
      updateTweetFromSnippet();
    }
  }, [selectedSnippet, customStartIndex, customEndIndex, isOpen, documentContent, updateTweetFromSnippet]);

  const handlePost = async () => {
    try {
      setIsPosting(true);
      const result = await twitterService.postToTwitter(tweetText, {
        threadMode: isThreadMode,
        includeLink: includeLink,
        documentTitle: documentTitle
      });
      
      setPostSuccess(true);
      setTweetUrl(result.url);
      
      // Reset after 3 seconds
      setTimeout(() => {
        setPostSuccess(false);
        setTweetUrl('');
        onClose();
      }, 3000);
    } catch (error) {
      console.error('Failed to post to Twitter:', error);
      alert('Failed to post to Twitter. Please try again.');
    } finally {
      setIsPosting(false);
    }
  };

  const characterCount = tweetText.length;
  const isOverLimit = characterCount > 280;
  const tweetCount = isThreadMode ? Math.ceil(characterCount / 270) : 1;

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="twitter-modal">
        <div className="modal-header">
          <h2>🐦 Post to Twitter</h2>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>

        <div className="modal-body">
          {!isAuthenticated ? (
            <div className="twitter-auth-section">
              <div className="auth-prompt">
                <svg className="twitter-logo-large" width="48" height="48" viewBox="0 0 24 24" fill="#1DA1F2">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                </svg>
                <h3>Connect Your Twitter Account</h3>
                <p>Sign in with Twitter to share your writing with your followers</p>
                <button 
                  className="twitter-login-btn"
                  onClick={handleLogin}
                  disabled={isLoggingIn}
                >
                  {isLoggingIn ? (
                    <>
                      <div className="spinner-small"></div>
                      Connecting...
                    </>
                  ) : (
                    <>
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                      </svg>
                      Sign in with Twitter
                    </>
                  )}
                </button>
              </div>
            </div>
          ) : (
            <>
              {/* User Info */}
              <div className="twitter-user-info">
                <img 
                  src={currentUser?.profile_image_url || `https://ui-avatars.com/api/?name=${currentUser?.name}&background=1DA1F2&color=fff`}
                  alt={currentUser?.name}
                  className="twitter-avatar"
                />
                <div className="twitter-user-details">
                  <div className="twitter-name">{currentUser?.name}</div>
                  <div className="twitter-handle">@{currentUser?.username}</div>
                </div>
                <button className="twitter-logout-btn" onClick={handleLogout}>
                  Sign Out
                </button>
              </div>

              {/* Document Info */}
              <div className="document-preview">
                <h3>📄 {documentTitle}</h3>
                <p className="word-count">{documentContent.replace(/<[^>]*>/g, '').split(/\s+/).length} words</p>
              </div>

              {/* Snippet Selection */}
              <div className="snippet-section">
                <h4>Choose what to share:</h4>
                <div className="snippet-options">
                  <label className="snippet-option">
                    <input
                      type="radio"
                      checked={selectedSnippet === 'beginning'}
                      onChange={() => setSelectedSnippet('beginning')}
                    />
                    <span>Beginning of document</span>
                  </label>
                  <label className="snippet-option">
                    <input
                      type="radio"
                      checked={selectedSnippet === 'summary'}
                      onChange={() => setSelectedSnippet('summary')}
                    />
                    <span>Auto-summary</span>
                  </label>
                  <label className="snippet-option">
                    <input
                      type="radio"
                      checked={selectedSnippet === 'custom'}
                      onChange={() => setSelectedSnippet('custom')}
                    />
                    <span>Custom excerpt</span>
                  </label>
                </div>

                {selectedSnippet === 'custom' && (
                  <div className="custom-range">
                    <div className="range-inputs">
                      <label>
                        Start character:
                        <input
                          type="number"
                          min="0"
                          max={documentContent.length}
                          value={customStartIndex}
                          onChange={(e) => setCustomStartIndex(Number(e.target.value))}
                        />
                      </label>
                      <label>
                        End character:
                        <input
                          type="number"
                          min="0"
                          max={documentContent.length}
                          value={customEndIndex}
                          onChange={(e) => setCustomEndIndex(Number(e.target.value))}
                        />
                      </label>
                    </div>
                  </div>
                )}
              </div>

              {/* Tweet Composer */}
              <div className="tweet-composer">
                <textarea
                  className={`tweet-input ${isOverLimit ? 'over-limit' : ''}`}
                  value={tweetText}
                  onChange={(e) => setTweetText(e.target.value)}
                  placeholder="What's happening?"
                  rows={6}
                />
                <div className="tweet-options">
                  <div className="option-group">
                    <label className="tweet-option">
                      <input
                        type="checkbox"
                        checked={isThreadMode}
                        onChange={(e) => setIsThreadMode(e.target.checked)}
                        disabled={!isOverLimit}
                      />
                      <span>Post as thread {isOverLimit && `(${tweetCount} tweets)`}</span>
                    </label>
                    <label className="tweet-option">
                      <input
                        type="checkbox"
                        checked={includeLink}
                        onChange={(e) => setIncludeLink(e.target.checked)}
                      />
                      <span>Include link to document</span>
                    </label>
                  </div>
                  <div className={`character-count ${isOverLimit ? 'over-limit' : ''}`}>
                    {characterCount}/280
                  </div>
                </div>
              </div>

              {/* Success Message */}
              {postSuccess && (
                <div className="success-message">
                  <span>✅ Posted successfully!</span>
                  <a href={tweetUrl} target="_blank" rel="noopener noreferrer">
                    View Tweet →
                  </a>
                </div>
              )}
            </>
          )}
        </div>

        {isAuthenticated && (
          <div className="modal-footer">
            <button className="cancel-btn" onClick={onClose}>Cancel</button>
            <button 
              className="post-btn"
              onClick={handlePost}
              disabled={isPosting || !tweetText.trim() || (isOverLimit && !isThreadMode)}
            >
              {isPosting ? (
                <>
                  <div className="spinner-small"></div>
                  Posting...
                </>
              ) : (
                <>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                  </svg>
                  Post to Twitter
                </>
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default PostToTwitterModal;