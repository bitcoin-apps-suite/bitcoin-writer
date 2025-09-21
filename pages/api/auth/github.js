export default async function handler(req, res) {
  const { method } = req;

  // Only allow GET requests
  if (method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const clientId = process.env.GITHUB_CLIENT_ID;
    const redirectUri = process.env.GITHUB_REDIRECT_URI || 
      `${req.headers.origin || 'http://localhost:3000'}/api/auth/callback/github`;

    if (!clientId) {
      throw new Error('GitHub client ID not configured');
    }

    // Generate state for CSRF protection
    const state = Math.random().toString(36).substring(2, 15) + 
                  Math.random().toString(36).substring(2, 15);

    // Store state in secure HTTP-only cookie
    res.setHeader('Set-Cookie', [
      `github_oauth_state=${state}; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=600`
    ]);

    // Build GitHub OAuth authorization URL
    const params = new URLSearchParams({
      client_id: clientId,
      redirect_uri: redirectUri,
      scope: 'user:email read:user',
      state: state,
      allow_signup: 'true'
    });

    const authUrl = `https://github.com/login/oauth/authorize?${params.toString()}`;

    // Redirect user to GitHub for authorization
    return res.redirect(authUrl);

  } catch (error) {
    console.error('GitHub auth initiation error:', error);
    return res.status(500).json({
      error: 'Failed to initiate GitHub authentication',
      message: process.env.NODE_ENV === 'development' ? error.message : 'Something went wrong'
    });
  }
}