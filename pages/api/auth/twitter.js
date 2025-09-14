import { TwitterApi } from 'twitter-api-v2';

export default async function handler(req, res) {
  const { method } = req;

  // Only allow GET requests
  if (method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Initialize Twitter API client
    const client = new TwitterApi({
      clientId: process.env.TWITTER_CLIENT_ID,
      clientSecret: process.env.TWITTER_CLIENT_SECRET,
    });

    // Generate OAuth 2.0 authorization URL
    const { url, codeVerifier, state } = client.generateOAuth2AuthLink(
      process.env.TWITTER_REDIRECT_URI,
      {
        scope: ['tweet.read', 'users.read', 'tweet.write', 'offline.access']
      }
    );

    // Store state and code verifier in secure HTTP-only cookies
    // In production, you'd want to use a more secure method
    res.setHeader('Set-Cookie', [
      `oauth_state=${state}; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=600`,
      `code_verifier=${codeVerifier}; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=600`
    ]);

    // Redirect user to Twitter for authorization
    return res.redirect(url);

  } catch (error) {
    console.error('Twitter auth initiation error:', error);
    return res.status(500).json({
      error: 'Failed to initiate Twitter authentication',
      message: process.env.NODE_ENV === 'development' ? error.message : 'Something went wrong'
    });
  }
}
