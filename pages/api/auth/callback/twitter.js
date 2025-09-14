import { TwitterApi } from 'twitter-api-v2';

export default async function handler(req, res) {
  const { method } = req;

  // Only allow GET requests
  if (method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { code, state, error, error_description } = req.query;

    // Handle OAuth errors
    if (error) {
      console.error('Twitter OAuth error:', error, error_description);
      return res.redirect('/?error=' + encodeURIComponent(error_description || error));
    }

    // Check if we have the required parameters
    if (!code || !state) {
      return res.status(400).json({
        error: 'Missing required parameters: code and state'
      });
    }

    // Verify state parameter for CSRF protection
    const storedState = req.cookies?.oauth_state;
    if (!storedState || storedState !== state) {
      return res.status(400).json({ error: 'Invalid state parameter' });
    }

    // Initialize Twitter API client
    const client = new TwitterApi({
      clientId: process.env.TWITTER_CLIENT_ID,
      clientSecret: process.env.TWITTER_CLIENT_SECRET,
    });

    try {
      // Exchange code for access token
      const { accessToken, refreshToken, expiresIn } = await client.loginWithOAuth2({
        code,
        codeVerifier: req.cookies?.code_verifier,
        redirectUri: process.env.TWITTER_REDIRECT_URI,
      });

      // Get user information
      const user = await client.v2.me({
        'user.fields': ['profile_image_url', 'verified', 'public_metrics']
      });

      // Here you would typically:
      // 1. Create/update user session
      // 2. Store user data in your database
      // 3. Set authentication cookies/tokens
      // 4. Redirect to the main app

      // For now, redirect to the main app with user info
      const userData = {
        id: user.data.id,
        username: user.data.username,
        name: user.data.name,
        profileImage: user.data.profile_image_url,
      };

      // Store user session (you'll need to implement this)
      // await createUserSession(userData);

      // Clear OAuth cookies
      res.setHeader('Set-Cookie', [
        'oauth_state=; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=0',
        'code_verifier=; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=0'
      ]);

      // Redirect to main app with success
      const redirectUrl = new URL('/', process.env.NEXTAUTH_URL || 'https://bitcoin-writer.vercel.app');
      redirectUrl.searchParams.set('login', 'success');
      redirectUrl.searchParams.set('username', user.data.username);

      return res.redirect(redirectUrl.toString());

    } catch (tokenError) {
      console.error('Token exchange error:', tokenError);
      return res.redirect('/?error=authentication_failed');
    }

  } catch (error) {
    console.error('Twitter callback error:', error);
    return res.status(500).json({
      error: 'Internal server error',
      message: process.env.NODE_ENV === 'development' ? error.message : 'Something went wrong'
    });
  }
}
