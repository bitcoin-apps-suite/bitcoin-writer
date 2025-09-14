# Twitter OAuth Setup Guide

## Environment Variables Required

Create a `.env.local` file in your project root with these variables:

```bash
# Twitter/X API Configuration
# Get these from your Twitter Developer App: https://developer.twitter.com/en/portal/dashboard

# Your Twitter App's Client ID (OAuth 2.0 Client ID)
TWITTER_CLIENT_ID=your_twitter_client_id_here

# Your Twitter App's Client Secret (OAuth 2.0 Client Secret)
TWITTER_CLIENT_SECRET=your_twitter_client_secret_here

# The callback URL you registered with Twitter (must match exactly)
TWITTER_REDIRECT_URI=https://bitcoin-writer.vercel.app/api/auth/callback/twitter

# NextAuth.js Configuration (optional, for enhanced session management)
NEXTAUTH_URL=https://bitcoin-writer.vercel.app
NEXTAUTH_SECRET=your_random_secret_string_here

# Database Configuration (optional, if you want to store user data)
DATABASE_URL=your_database_connection_string_here

# Environment
NODE_ENV=production
```

## API Routes Created

### 1. `/api/auth/twitter`
- **Purpose**: Initiates Twitter OAuth flow
- **Method**: GET
- **What it does**:
  - Generates OAuth 2.0 authorization URL
  - Sets secure cookies for state and code verifier
  - Redirects user to Twitter for authorization

### 2. `/api/auth/callback/twitter`
- **Purpose**: Handles Twitter OAuth callback
- **Method**: GET
- **What it does**:
  - Exchanges authorization code for access token
  - Retrieves user profile information
  - Handles errors and redirects appropriately
  - Sets authentication cookies

## Dependencies Required

Add this to your `package.json`:

```json
{
  "dependencies": {
    "twitter-api-v2": "^1.15.1",
    "next": "^14.0.0"
  }
}
```

## How to Use

1. **Install dependencies**:
   ```bash
   npm install twitter-api-v2
   ```

2. **Set up environment variables** as shown above

3. **Start OAuth flow**:
   ```javascript
   // Redirect user to start authentication
   window.location.href = '/api/auth/twitter';
   ```

4. **Handle callback**:
   - The callback route will handle the OAuth response
   - User will be redirected back to your app with authentication data

## Security Features

- ✅ **CSRF Protection**: State parameter verification
- ✅ **PKCE**: Code verifier for enhanced security
- ✅ **Secure Cookies**: HTTP-only, Secure, SameSite cookies
- ✅ **Error Handling**: Comprehensive error responses
- ✅ **Token Security**: Secure token storage and refresh

## Next Steps

1. Set up your Twitter Developer App with the correct permissions
2. Add the required environment variables
3. Test the OAuth flow in development
4. Deploy to Vercel
5. Test the production OAuth flow

## Troubleshooting

- **Callback URL mismatch**: Ensure the redirect URI matches exactly what you registered with Twitter
- **Invalid client**: Check your Client ID and Secret
- **State mismatch**: Clear cookies and try again
- **CORS issues**: Make sure your domain is allowed in Twitter app settings
