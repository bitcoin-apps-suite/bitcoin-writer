// API endpoint to fetch HandCash user profile
// This runs server-side where we can use the HandCash SDK securely

module.exports = async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { authToken } = req.body;

    if (!authToken) {
      return res.status(400).json({ error: 'No authToken provided' });
    }

    // Import HandCash SDK (server-side only)
    const { HandCashConnect } = await import('@handcash/handcash-connect');

    // Initialize HandCash with app credentials
    const appId = process.env.REACT_APP_HANDCASH_APP_ID || process.env.HANDCASH_APP_ID;
    const appSecret = process.env.REACT_APP_HANDCASH_APP_SECRET || process.env.HANDCASH_APP_SECRET;
    
    if (!appId || !appSecret) {
      console.error('Missing HandCash credentials:', { appId: !!appId, appSecret: !!appSecret });
      return res.status(500).json({ 
        error: 'HandCash configuration missing',
        details: 'App ID or App Secret not configured in environment variables'
      });
    }
    
    const handcash = new HandCashConnect({
      appId: appId,
      appSecret: appSecret,
    });

    // Get the account using the authToken
    const account = handcash.getAccountFromAuthToken(authToken);
    
    // Fetch the user profile
    const profile = await account.profile.getCurrentProfile();

    console.log('Profile fetched from HandCash:', {
      hasPublicProfile: !!profile.publicProfile,
      hasPrivateProfile: !!profile.privateProfile,
      handle: profile.publicProfile?.handle
    });

    // Return the profile data
    return res.status(200).json({
      success: true,
      profile: {
        handle: profile.publicProfile?.handle || profile.privateProfile?.handle || 'unknown',
        paymail: profile.publicProfile?.paymail || profile.privateProfile?.email || `user@handcash.io`,
        displayName: profile.publicProfile?.displayName || profile.publicProfile?.handle || 'HandCash User',
        avatarUrl: profile.publicProfile?.avatarUrl,
        publicKey: profile.publicProfile?.id,
        // Include private profile if available
        email: profile.privateProfile?.email,
        phoneNumber: profile.privateProfile?.phoneNumber,
      }
    });
  } catch (error) {
    console.error('Error fetching HandCash profile:', error);
    
    // Return a more detailed error for debugging
    return res.status(500).json({ 
      error: 'Failed to fetch user profile',
      details: error.message,
      // In production, don't expose full error details
      ...(process.env.NODE_ENV === 'development' && { stack: error.stack })
    });
  }
}