import React, { useEffect, useState } from 'react';
import { HandCashUser, HandCashService } from '../services/HandCashService';

interface Tweet {
  id: string;
  content: string;
  author: {
    handle: string;
    paymail: string;
  };
  timestamp: Date;
  likes: number;
  retweets: number;
  isLiked?: boolean;
  isRetweeted?: boolean;
}

interface SocialFeedProps {
  isAuthenticated: boolean;
  currentUser: HandCashUser | null;
  handcashService: HandCashService;
}

export default function SocialFeed({ isAuthenticated, currentUser, handcashService }: SocialFeedProps) {
  const [tweets, setTweets] = useState<Tweet[]>([]);
  const [newTweet, setNewTweet] = useState('');
  const [isPosting, setIsPosting] = useState(false);

  // Mock data for demonstration
  useEffect(() => {
    const mockTweets: Tweet[] = [
      {
        id: '1',
        content: 'Just published my thoughts on Bitcoin SV scaling solutions. The future of blockchain is looking bright! 🚀 #Bitcoin #BSV',
        author: {
          handle: 'bitcoinbuilder',
          paymail: 'builder@handcash.io'
        },
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
        likes: 42,
        retweets: 8
      },
      {
        id: '2',
        content: 'The Lightning Network vs Payment Channels debate continues. What are your thoughts on scalability solutions?',
        author: {
          handle: 'cryptodev',
          paymail: 'dev@handcash.io'
        },
        timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000), // 4 hours ago
        likes: 23,
        retweets: 5
      },
      {
        id: '3',
        content: 'Building on Bitcoin SV has been an incredible journey. The stability and low fees make development so much easier.',
        author: {
          handle: 'bsvbuilder',
          paymail: 'builder@example.com'
        },
        timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000), // 6 hours ago
        likes: 67,
        retweets: 12
      }
    ];
    setTweets(mockTweets);
  }, []);

  const handlePostTweet = async () => {
    if (!newTweet.trim() || !isAuthenticated || !currentUser) return;

    setIsPosting(true);
    
    // Create new tweet
    const tweet: Tweet = {
      id: Date.now().toString(),
      content: newTweet,
      author: {
        handle: currentUser.handle,
        paymail: currentUser.paymail
      },
      timestamp: new Date(),
      likes: 0,
      retweets: 0
    };

    // Add to feed
    setTweets(prev => [tweet, ...prev]);
    setNewTweet('');
    setIsPosting(false);
  };

  const handleLike = (tweetId: string) => {
    setTweets(prev => prev.map(tweet => 
      tweet.id === tweetId 
        ? { 
            ...tweet, 
            likes: tweet.isLiked ? tweet.likes - 1 : tweet.likes + 1,
            isLiked: !tweet.isLiked 
          }
        : tweet
    ));
  };

  const handleRetweet = (tweetId: string) => {
    setTweets(prev => prev.map(tweet => 
      tweet.id === tweetId 
        ? { 
            ...tweet, 
            retweets: tweet.isRetweeted ? tweet.retweets - 1 : tweet.retweets + 1,
            isRetweeted: !tweet.isRetweeted 
          }
        : tweet
    ));
  };

  const formatTimestamp = (timestamp: Date) => {
    const now = new Date();
    const diff = now.getTime() - timestamp.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor(diff / (1000 * 60));

    if (hours > 24) {
      return timestamp.toLocaleDateString();
    } else if (hours > 0) {
      return `${hours}h`;
    } else if (minutes > 0) {
      return `${minutes}m`;
    } else {
      return 'now';
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="social-feed-container">
        <div className="auth-prompt">
          <div className="auth-prompt-content">
            <h2>🚀 Welcome to Bitcoin Social</h2>
            <p>Connect with the Bitcoin community and share your thoughts on the future of money.</p>
            <button 
              className="handcash-login-btn"
              onClick={() => handcashService.login()}
            >
              🔑 Sign in with HandCash
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="social-feed-container">
      <div className="social-feed">
        {/* Header */}
        <div className="feed-header">
          <h2>🏠 Home</h2>
          <div className="user-info">
            <span className="user-handle">@{currentUser?.handle}</span>
          </div>
        </div>

        {/* Tweet Composer */}
        <div className="tweet-composer">
          <div className="composer-header">
            <div className="user-avatar">
              <span className="avatar-icon">₿</span>
            </div>
            <div className="composer-content">
              <textarea
                value={newTweet}
                onChange={(e) => setNewTweet(e.target.value)}
                placeholder="What's happening in Bitcoin?"
                className="tweet-input"
                maxLength={280}
                rows={3}
              />
              <div className="composer-footer">
                <div className="char-count">
                  <span className={newTweet.length > 250 ? 'warning' : ''}>
                    {280 - newTweet.length}
                  </span>
                </div>
                <button
                  onClick={handlePostTweet}
                  disabled={!newTweet.trim() || isPosting}
                  className="post-btn"
                >
                  {isPosting ? 'Posting...' : 'Post'}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Tweet Feed */}
        <div className="tweet-feed">
          {tweets.length === 0 ? (
            <div className="empty-feed">
              <p>No tweets yet. Be the first to share something!</p>
            </div>
          ) : (
            tweets.map((tweet) => (
              <div key={tweet.id} className="tweet-card">
                <div className="tweet-header">
                  <div className="tweet-avatar">
                    <span className="avatar-icon">₿</span>
                  </div>
                  <div className="tweet-meta">
                    <span className="tweet-author">@{tweet.author.handle}</span>
                    <span className="tweet-timestamp">• {formatTimestamp(tweet.timestamp)}</span>
                  </div>
                </div>
                <div className="tweet-content">
                  {tweet.content}
                </div>
                <div className="tweet-actions">
                  <button 
                    className={`action-btn like-btn ${tweet.isLiked ? 'active' : ''}`}
                    onClick={() => handleLike(tweet.id)}
                  >
                    ❤️ {tweet.likes}
                  </button>
                  <button 
                    className={`action-btn retweet-btn ${tweet.isRetweeted ? 'active' : ''}`}
                    onClick={() => handleRetweet(tweet.id)}
                  >
                    🔄 {tweet.retweets}
                  </button>
                  <button className="action-btn share-btn">
                    📤 Share
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Trending Sidebar */}
        <div className="trending-sidebar">
          <div className="trending-card">
            <h3>🔥 Trending</h3>
            <div className="trending-list">
              <div className="trending-item">
                <span className="trending-tag">#Bitcoin</span>
                <span className="trending-count">42.1K posts</span>
              </div>
              <div className="trending-item">
                <span className="trending-tag">#BSV</span>
                <span className="trending-count">8.5K posts</span>
              </div>
              <div className="trending-item">
                <span className="trending-tag">#HandCash</span>
                <span className="trending-count">5.2K posts</span>
              </div>
              <div className="trending-item">
                <span className="trending-tag">#Blockchain</span>
                <span className="trending-count">15.8K posts</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}