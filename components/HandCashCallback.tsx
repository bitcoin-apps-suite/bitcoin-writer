import React, { useEffect, useState } from 'react';
import { HandCashService } from '../services/HandCashService';

const HandCashCallback: React.FC = () => {
  const [error, setError] = useState<string | null>(null);
  const [status, setStatus] = useState<string>('Processing authentication...');

  useEffect(() => {
    const handleCallback = async () => {
      try {
        // Log the full callback URL for debugging
        const fullUrl = window.location.href;
        console.log('=== HandCash OAuth Callback ===');
        console.log('Full URL:', fullUrl);
        console.log('Search params:', window.location.search);
        console.log('Hash params:', window.location.hash);
        
        // Parse URL parameters
        const urlParams = new URLSearchParams(window.location.search);
        const hashParams = new URLSearchParams(window.location.hash.replace('#', ''));
        
        // Log all parameters for debugging
        console.log('URL parameters:', Array.from(urlParams.entries()));
        console.log('Hash parameters:', Array.from(hashParams.entries()));
        
        // Check for OAuth error
        const errorParam = urlParams.get('error') || hashParams.get('error');
        if (errorParam) {
          const errorDescription = urlParams.get('error_description') || hashParams.get('error_description') || 'Unknown error';
          setError(`Authentication failed: ${errorParam} - ${errorDescription}`);
          setTimeout(() => window.location.href = '/', 3000);
          return;
        }
        
        // HandCash returns authToken directly, not OAuth code
        // Check all possible parameter names and locations
        const authToken = urlParams.get('authToken') || 
                         hashParams.get('authToken') ||
                         urlParams.get('auth_token') || 
                         hashParams.get('auth_token') ||
                         urlParams.get('token') ||
                         hashParams.get('token') ||
                         urlParams.get('access_token') || 
                         hashParams.get('access_token');
        
        // Also check if the entire hash might be the token
        const hashOnly = window.location.hash.replace('#', '');
        const isJustToken = hashOnly && !hashOnly.includes('=') && !hashOnly.includes('&');
        const finalAuthToken = authToken || (isJustToken ? hashOnly : null);
        
        console.log('Looking for authToken...');
        console.log('Found in params:', authToken);
        console.log('Hash only:', hashOnly);
        console.log('Final authToken:', finalAuthToken);
        
        if (finalAuthToken) {
          setStatus('Processing HandCash authentication...');
          
          const handcashService = new HandCashService();
          
          // Pass the full URL for the service to handle
          console.log('Calling handleCallback with full URL');
          console.log('Token length:', finalAuthToken.length);
          console.log('Token preview:', finalAuthToken.substring(0, 20) + '...');
          
          const user = await handcashService.handleCallback(finalAuthToken);
          
          console.log('Callback completed, user:', user);
          
          setStatus('Authentication successful! Redirecting...');
          
          // Clear the URL parameters for security
          window.history.replaceState({}, document.title, '/');
          
          // Small delay to show success message
          setTimeout(() => {
            window.location.href = '/';
          }, 1000);
        } else {
          // No auth data found
          console.error('No authorization code or token found in callback');
          console.log('Expected parameters: code, access_token, or authToken');
          
          // Check if user is already authenticated
          const handcashService = new HandCashService();
          if (handcashService.isAuthenticated()) {
            setStatus('Already authenticated. Redirecting...');
            setTimeout(() => window.location.href = '/', 1000);
          } else {
            setError('Authentication incomplete - no authorization data received');
            setTimeout(() => window.location.href = '/', 3000);
          }
        }
      } catch (err: any) {
        console.error('Callback error:', err);
        setError(err.message || 'Failed to complete authentication');
        setTimeout(() => window.location.href = '/', 3000);
      }
    };

    handleCallback();
  }, []);

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      height: '100vh',
      backgroundColor: '#000',
      color: '#fff',
      fontFamily: 'system-ui, -apple-system, sans-serif'
    }}>
      {error ? (
        <>
          <h2 style={{ color: '#ff4444' }}>Authentication Error</h2>
          <p>{error}</p>
          <p style={{ opacity: 0.7 }}>Redirecting to home...</p>
        </>
      ) : (
        <>
          <h2>HandCash Authentication</h2>
          <p>{status}</p>
          <div style={{
            marginTop: '20px',
            width: '40px',
            height: '40px',
            border: '4px solid #333',
            borderTop: '4px solid #4CAF50',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite'
          }} />
          <style>{`
            @keyframes spin {
              0% { transform: rotate(0deg); }
              100% { transform: rotate(360deg); }
            }
          `}</style>
        </>
      )}
    </div>
  );
};

export default HandCashCallback;