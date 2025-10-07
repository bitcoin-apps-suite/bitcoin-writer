const express = require('express');
const router = express.Router();
const { TwitterApi } = require('twitter-api-v2');
const crypto = require('crypto');

// Store OAuth tokens and user sessions temporarily (in production, use Redis or a database)
const oauthTokens = new Map();
const userSessions = new Map();

// Twitter API configuration for OAuth 2.0
const twitterClient = new TwitterApi({
  clientId: process.env.TWITTER_CLIENT_ID,
  clientSecret: process.env.TWITTER_CLIENT_SECRET,
});

// Generate OAuth URL for Twitter authentication
router.get('/auth/url', async (req, res) => {
  try {
    const callbackUrl = process.env.TWITTER_REDIRECT_URI || 'http://localhost:3001/api/auth/callback/twitter';
    
    // Generate OAuth 2.0 link with PKCE
    const { url, codeVerifier, state } = twitterClient.generateOAuth2AuthLink(
      callbackUrl,
      { 
        scope: ['tweet.read', 'tweet.write', 'users.read', 'offline.access'],
        code_challenge_method: 'S256'
      }
    );
    
    // Store the code verifier and state temporarily
    oauthTokens.set(state, {
      codeVerifier,
      timestamp: Date.now()
    });
    
    // Clean up old tokens (older than 10 minutes)
    for (const [token, data] of oauthTokens.entries()) {
      if (Date.now() - data.timestamp > 600000) {
        oauthTokens.delete(token);
      }
    }
    
    res.json({ authUrl: url });
  } catch (error) {
    console.error('Failed to generate Twitter auth URL:', error);
    res.status(500).json({ error: 'Failed to initialize Twitter authentication' });
  }
});

// Handle OAuth callback
router.post('/auth/callback', async (req, res) => {
  try {
    const { code, state } = req.body;
    
    // Retrieve the stored code verifier
    const tokenData = oauthTokens.get(state);
    if (!tokenData) {
      return res.status(400).json({ error: 'Invalid or expired OAuth state' });
    }
    
    const { codeVerifier } = tokenData;
    
    // Exchange authorization code for access token
    const {
      client: loggedClient,
      accessToken,
      refreshToken,
      expiresIn,
    } = await twitterClient.loginWithOAuth2({
      code,
      codeVerifier,
      redirectUri: process.env.TWITTER_REDIRECT_URI || 'http://localhost:3001/api/auth/callback/twitter',
    });
    
    // Get user information with profile image
    const user = await loggedClient.v2.me({ 'user.fields': ['profile_image_url'] });
    
    // Generate a session token for our app
    const sessionToken = crypto.randomBytes(32).toString('hex');
    
    // Store the user session with their Twitter tokens
    userSessions.set(sessionToken, {
      user: {
        id: user.data.id,
        username: user.data.username,
        name: user.data.name,
        profile_image_url: user.data.profile_image_url
      },
      accessToken,
      refreshToken,
      expiresIn,
      timestamp: Date.now()
    });
    
    // Clean up old sessions (older than 1 hour)
    for (const [token, data] of userSessions.entries()) {
      if (Date.now() - data.timestamp > 3600000) {
        userSessions.delete(token);
      }
    }
    
    // Clean up the temporary OAuth token
    oauthTokens.delete(state);
    
    res.json({
      user: {
        id: user.data.id,
        username: user.data.username,
        name: user.data.name,
        profile_image_url: user.data.profile_image_url
      },
      accessToken: sessionToken
    });
  } catch (error) {
    console.error('Twitter callback error:', error);
    res.status(500).json({ error: 'Failed to complete Twitter authentication' });
  }
});

// Verify authentication status
router.get('/auth/verify', async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'No authentication token provided' });
    }
    
    const sessionToken = authHeader.substring(7);
    
    // Check if session exists
    const sessionData = userSessions.get(sessionToken);
    if (!sessionData) {
      return res.status(401).json({ error: 'Invalid or expired authentication token' });
    }
    
    // Check if session is not too old (1 hour)
    if (Date.now() - sessionData.timestamp > 3600000) {
      userSessions.delete(sessionToken);
      return res.status(401).json({ error: 'Session expired' });
    }
    
    // Verify the user still exists on Twitter by making a quick API call
    try {
      const userClient = new TwitterApi(sessionData.accessToken);
      
      // Quick verification call
      await userClient.v2.me();
      
      // Return cached user info
      res.json({
        user: sessionData.user
      });
    } catch (twitterError) {
      console.error('Twitter API verification failed:', twitterError);
      // If Twitter API call fails, remove the session
      userSessions.delete(sessionToken);
      return res.status(401).json({ error: 'Twitter authentication no longer valid' });
    }
  } catch (error) {
    console.error('Failed to verify auth:', error);
    res.status(500).json({ error: 'Failed to verify authentication' });
  }
});

// Post a tweet
router.post('/post', async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Not authenticated' });
    }
    
    const sessionToken = authHeader.substring(7);
    const { text, replyToId, mediaIds } = req.body;
    
    if (!text || text.length === 0) {
      return res.status(400).json({ error: 'Tweet text is required' });
    }
    
    if (text.length > 280) {
      return res.status(400).json({ error: 'Tweet text exceeds 280 characters' });
    }
    
    // Get user session
    const sessionData = userSessions.get(sessionToken);
    if (!sessionData) {
      return res.status(401).json({ error: 'Invalid or expired authentication token' });
    }
    
    // Check if session is not too old
    if (Date.now() - sessionData.timestamp > 3600000) {
      userSessions.delete(sessionToken);
      return res.status(401).json({ error: 'Session expired' });
    }
    
    // Create authenticated Twitter client for the user
    const userClient = new TwitterApi(sessionData.accessToken);
    
    // Post the tweet
    const tweetPayload = {
      text
    };
    
    // Add reply if specified
    if (replyToId) {
      tweetPayload.reply = { in_reply_to_tweet_id: replyToId };
    }
    
    // Add media if specified
    if (mediaIds && mediaIds.length > 0) {
      tweetPayload.media = { media_ids: mediaIds };
    }
    
    const tweet = await userClient.v2.tweet(tweetPayload);
    
    res.json({ 
      data: {
        id: tweet.data.id,
        text: tweet.data.text
      }
    });
  } catch (error) {
    console.error('Failed to post tweet:', error);
    
    // Check if it's a Twitter API error
    if (error.code === 401) {
      return res.status(401).json({ error: 'Twitter authentication expired' });
    }
    
    if (error.data && error.data.errors) {
      const twitterError = error.data.errors[0];
      return res.status(400).json({ 
        error: `Twitter API error: ${twitterError.message}`,
        code: twitterError.code
      });
    }
    
    res.status(500).json({ error: 'Failed to post to Twitter' });
  }
});

module.exports = router;