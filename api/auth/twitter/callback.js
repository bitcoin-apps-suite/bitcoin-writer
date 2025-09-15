// api/auth/twitter/callback.js
// Vercel serverless function to handle Twitter OAuth 2.0 callback

export default async function handler(req, res) {
  const { code, state } = req.query;
  
  if (!code) {
    return res.status(400).send('Authorization code missing');
  }

  const clientId = process.env.TWITTER_CLIENT_ID;
  const clientSecret = process.env.TWITTER_CLIENT_SECRET;
  
  if (!clientId || !clientSecret) {
    return res.status(500).send('Twitter credentials not configured');
  }

  try {
    // Build redirect URI - VERCEL_URL doesn't include protocol
    const baseUrl = process.env.VERCEL_URL 
      ? `https://${process.env.VERCEL_URL}` 
      : 'http://localhost:3000';
    const redirectUri = `${baseUrl}/api/auth/twitter/callback`;

    // Exchange authorization code for access token
    const tokenResponse = await fetch('https://api.twitter.com/2/oauth2/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': `Basic ${Buffer.from(`${clientId}:${clientSecret}`).toString('base64')}`
      },
      body: new URLSearchParams({
        code,
        grant_type: 'authorization_code',
        redirect_uri: redirectUri,
        code_verifier: 'challenge'
      })
    });

    const tokenData = await tokenResponse.json();
    
    if (!tokenResponse.ok) {
      throw new Error(tokenData.error || 'Failed to get access token');
    }

    // Fetch user data using the access token
    const userResponse = await fetch('https://api.twitter.com/2/users/me?user.fields=profile_image_url,name,username', {
      headers: {
        'Authorization': `Bearer ${tokenData.access_token}`
      }
    });

    const userData = await userResponse.json();
    
    if (!userResponse.ok) {
      throw new Error('Failed to get user data');
    }

    // Prepare user data for client
    const twitterUser = {
      id: userData.data.id,
      username: userData.data.username,
      name: userData.data.name,
      profile_image_url: userData.data.profile_image_url,
      access_token: tokenData.access_token // Be careful with this in production
    };

    // Return HTML that sends the user data to the opener window and closes itself
    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Twitter Authorization</title>
          <style>
            body {
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
              display: flex;
              justify-content: center;
              align-items: center;
              height: 100vh;
              margin: 0;
              background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
              color: white;
            }
            .message {
              text-align: center;
              padding: 2rem;
              background: rgba(255, 255, 255, 0.1);
              border-radius: 10px;
              backdrop-filter: blur(10px);
            }
          </style>
        </head>
        <body>
          <div class="message">
            <h2>✓ Successfully connected to Twitter!</h2>
            <p>You can close this window now.</p>
          </div>
          <script>
            // Send the user data to the opener window
            if (window.opener) {
              window.opener.postMessage({
                type: 'twitter-auth-success',
                user: ${JSON.stringify(twitterUser)}
              }, '${baseUrl}');
            }
            // Store in localStorage as backup
            localStorage.setItem('twitterUser', JSON.stringify(${JSON.stringify(twitterUser)}));
            // Close the window after a short delay
            setTimeout(() => window.close(), 2000);
          </script>
        </body>
      </html>
    `;
    
    res.setHeader('Content-Type', 'text/html');
    res.status(200).send(html);
    
  } catch (error) {
    console.error('Twitter OAuth error:', error);
    res.status(500).send(`
      <!DOCTYPE html>
      <html>
        <head><title>Authorization Failed</title></head>
        <body>
          <h2>Twitter authorization failed</h2>
          <p>${error.message}</p>
          <p>You can close this window and try again.</p>
          <script>setTimeout(() => window.close(), 5000);</script>
        </body>
      </html>
    `);
  }
}