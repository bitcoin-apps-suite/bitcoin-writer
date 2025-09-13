const express = require('express');
const router = express.Router();
const { TwitterApi } = require('twitter-api-v2');
const crypto = require('crypto');

// Store OAuth tokens temporarily (in production, use Redis or a database)
const oauthTokens = new Map();

// Twitter API configuration
const twitterClient = new TwitterApi({
  appKey: process.env.TWITTER_API_KEY || 'your-api-key',
  appSecret: process.env.TWITTER_API_SECRET || 'your-api-secret',
  accessToken: process.env.TWITTER_ACCESS_TOKEN,
  accessSecret: process.env.TWITTER_ACCESS_SECRET,
});

// Generate OAuth URL for Twitter authentication
router.get('/auth/url', async (req, res) => {
  try {
    const callbackUrl = process.env.TWITTER_CALLBACK_URL || 'http://localhost:3000/auth/twitter/callback';
    
    // Generate OAuth link
    const authLink = await twitterClient.generateAuthLink(callbackUrl, { linkMode: 'authorize' });
    
    // Store the OAuth token secret temporarily
    oauthTokens.set(authLink.oauth_token, {
      oauth_token_secret: authLink.oauth_token_secret,
      timestamp: Date.now()
    });
    
    // Clean up old tokens (older than 10 minutes)
    for (const [token, data] of oauthTokens.entries()) {
      if (Date.now() - data.timestamp > 600000) {
        oauthTokens.delete(token);
      }
    }
    
    res.json({ authUrl: authLink.url });
  } catch (error) {
    console.error('Failed to generate Twitter auth URL:', error);
    res.status(500).json({ error: 'Failed to initialize Twitter authentication' });
  }
});

// Handle OAuth callback
router.post('/auth/callback', async (req, res) => {
  try {
    const { oauthToken, oauthVerifier } = req.body;
    
    // Retrieve the stored OAuth token secret
    const tokenData = oauthTokens.get(oauthToken);
    if (!tokenData) {
      return res.status(400).json({ error: 'Invalid or expired OAuth token' });
    }
    
    const { oauth_token_secret } = tokenData;
    
    // Create a client with the OAuth token and secret
    const client = new TwitterApi({
      appKey: process.env.TWITTER_API_KEY || 'your-api-key',
      appSecret: process.env.TWITTER_API_SECRET || 'your-api-secret',
      accessToken: oauthToken,
      accessSecret: oauth_token_secret,
    });
    
    // Get the access token
    const { client: loggedClient, accessToken, accessSecret } = await client.login(oauthVerifier);
    
    // Get user information
    const user = await loggedClient.v2.me();
    
    // Generate a session token for our app
    const sessionToken = crypto.randomBytes(32).toString('hex');
    
    // In production, store this in a database with the user info and Twitter tokens
    // For now, we'll just return it to the client
    
    // Clean up the temporary OAuth token
    oauthTokens.delete(oauthToken);
    
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
    
    // In production, verify the session token against your database
    // For now, we'll just check if it exists and is valid format
    if (!sessionToken || sessionToken.length !== 64) {
      return res.status(401).json({ error: 'Invalid authentication token' });
    }
    
    // Return user info (in production, fetch from database)
    res.json({
      user: {
        id: 'demo-user',
        username: 'demo',
        name: 'Demo User'
      }
    });
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
    
    const { text, replyToId, mediaIds } = req.body;
    
    if (!text || text.length === 0) {
      return res.status(400).json({ error: 'Tweet text is required' });
    }
    
    if (text.length > 280) {
      return res.status(400).json({ error: 'Tweet text exceeds 280 characters' });
    }
    
    // In production, you would:
    // 1. Verify the session token
    // 2. Retrieve the user's Twitter access tokens from database
    // 3. Create a client with those tokens
    // 4. Post the tweet
    
    // For demo purposes, we'll simulate a successful post
    const tweetId = Date.now().toString();
    
    res.json({
      data: {
        id: tweetId,
        text: text
      }
    });
    
    /* Production code would look like:
    const userClient = new TwitterApi({
      appKey: process.env.TWITTER_API_KEY,
      appSecret: process.env.TWITTER_API_SECRET,
      accessToken: userAccessToken,
      accessSecret: userAccessSecret,
    });
    
    const tweet = await userClient.v2.tweet({
      text,
      reply: replyToId ? { in_reply_to_tweet_id: replyToId } : undefined,
      media: mediaIds ? { media_ids: mediaIds } : undefined
    });
    
    res.json({ data: tweet.data });
    */
  } catch (error) {
    console.error('Failed to post tweet:', error);
    res.status(500).json({ error: 'Failed to post to Twitter' });
  }
});

module.exports = router;