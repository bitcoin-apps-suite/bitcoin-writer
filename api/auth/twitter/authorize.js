// api/auth/twitter/authorize.js
// Vercel serverless function to initiate Twitter OAuth 2.0 flow

export default function handler(req, res) {
  const clientId = process.env.TWITTER_CLIENT_ID;
  
  if (!clientId) {
    return res.status(500).json({ error: 'Twitter Client ID not configured' });
  }

  // Generate a random state for security
  const state = Math.random().toString(36).substring(7);
  
  // Store state in a cookie for verification later
  res.setHeader('Set-Cookie', `twitter_oauth_state=${state}; Path=/; HttpOnly; SameSite=Lax; Max-Age=600`);

  // Build the Twitter OAuth 2.0 authorization URL
  const params = new URLSearchParams({
    response_type: 'code',
    client_id: clientId,
    redirect_uri: `${process.env.VERCEL_URL || 'http://localhost:3000'}/api/auth/twitter/callback`,
    scope: 'tweet.read tweet.write users.read offline.access',
    state: state,
    code_challenge: 'challenge',
    code_challenge_method: 'plain'
  });

  const authUrl = `https://twitter.com/i/oauth2/authorize?${params}`;
  
  // Redirect to Twitter's authorization page
  res.redirect(authUrl);
}