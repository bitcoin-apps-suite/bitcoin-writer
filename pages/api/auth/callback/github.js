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
      console.error('GitHub OAuth error:', error, error_description);
      return res.redirect('/?error=' + encodeURIComponent(error_description || error));
    }

    // Check if we have the required parameters
    if (!code || !state) {
      return res.status(400).json({
        error: 'Missing required parameters: code and state'
      });
    }

    // Verify state parameter for CSRF protection
    const storedState = req.cookies?.github_oauth_state;
    if (!storedState || storedState !== state) {
      return res.status(400).json({ error: 'Invalid state parameter' });
    }

    const clientId = process.env.GITHUB_CLIENT_ID;
    const clientSecret = process.env.GITHUB_CLIENT_SECRET;

    if (!clientId || !clientSecret) {
      throw new Error('GitHub credentials not configured');
    }

    try {
      // Exchange code for access token
      const tokenResponse = await fetch('https://github.com/login/oauth/access_token', {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          client_id: clientId,
          client_secret: clientSecret,
          code: code,
        }),
      });

      if (!tokenResponse.ok) {
        throw new Error('Failed to exchange code for token');
      }

      const tokenData = await tokenResponse.json();
      
      if (tokenData.error) {
        throw new Error(tokenData.error_description || tokenData.error);
      }

      const accessToken = tokenData.access_token;

      // Get user information
      const userResponse = await fetch('https://api.github.com/user', {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Accept': 'application/json',
        },
      });

      if (!userResponse.ok) {
        throw new Error('Failed to fetch user data');
      }

      const userData = await userResponse.json();

      // Get user email (might be private)
      const emailResponse = await fetch('https://api.github.com/user/emails', {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Accept': 'application/json',
        },
      });

      let primaryEmail = userData.email;
      if (emailResponse.ok) {
        const emails = await emailResponse.json();
        const primary = emails.find(email => email.primary);
        if (primary) {
          primaryEmail = primary.email;
        }
      }

      // Here you would typically:
      // 1. Create/update user session
      // 2. Store user data in your database
      // 3. Set authentication cookies/tokens
      // 4. Redirect to the main app

      // For now, redirect to the contributions page with user info
      const finalUserData = {
        id: userData.id,
        login: userData.login,
        name: userData.name,
        email: primaryEmail,
        avatar_url: userData.avatar_url,
        html_url: userData.html_url,
        bio: userData.bio,
        created_at: userData.created_at,
        public_repos: userData.public_repos,
        followers: userData.followers,
        following: userData.following,
      };

      // Store user session in localStorage via client-side redirect
      // In production, you'd use proper session management
      
      // Clear OAuth cookies
      res.setHeader('Set-Cookie', [
        'github_oauth_state=; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=0'
      ]);

      // Redirect to contributions page with success
      const redirectUrl = new URL('/contributions', req.headers.origin || 'http://localhost:3000');
      redirectUrl.searchParams.set('github_login', 'success');
      redirectUrl.searchParams.set('github_user', encodeURIComponent(JSON.stringify(finalUserData)));
      redirectUrl.searchParams.set('github_token', accessToken);
      redirectUrl.hash = 'tasks';

      return res.redirect(redirectUrl.toString());

    } catch (tokenError) {
      console.error('Token exchange error:', tokenError);
      return res.redirect('/contributions?error=authentication_failed#tasks');
    }

  } catch (error) {
    console.error('GitHub callback error:', error);
    return res.status(500).json({
      error: 'Internal server error',
      message: process.env.NODE_ENV === 'development' ? error.message : 'Something went wrong'
    });
  }
}