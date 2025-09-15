import React, { useEffect, useState } from 'react';
import { GoogleOAuthProvider, GoogleLogin, googleLogout } from '@react-oauth/google';
import { jwtDecode } from 'jwt-decode';

interface GoogleUser {
  email: string;
  name: string;
  picture: string;
  sub: string;
}

interface GoogleAuthProps {
  onAuthSuccess?: (user: GoogleUser) => void;
  onAuthFailure?: () => void;
  scopes?: string[];
}

const GoogleAuthButton: React.FC<GoogleAuthProps> = ({ 
  onAuthSuccess, 
  onAuthFailure,
  scopes = [
    'openid',
    'profile', 
    'email',
    'https://www.googleapis.com/auth/gmail.compose',
    'https://www.googleapis.com/auth/gmail.readonly',
    'https://www.googleapis.com/auth/drive.file',
    'https://www.googleapis.com/auth/calendar.events'
  ]
}) => {
  const [user, setUser] = useState<GoogleUser | null>(null);
  const clientId = process.env.REACT_APP_GOOGLE_CLIENT_ID || '';

  useEffect(() => {
    const storedUser = localStorage.getItem('googleUser');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  // Check if Google Client ID is properly configured
  if (!clientId || clientId === 'YOUR_GOOGLE_CLIENT_ID_HERE') {
    return (
      <button 
        disabled
        style={{
          padding: '8px 16px',
          fontSize: '13px',
          background: 'rgba(128, 128, 128, 0.2)',
          border: '1px solid rgba(128, 128, 128, 0.3)',
          color: '#888',
          borderRadius: '6px',
          cursor: 'not-allowed'
        }}
        title="Google sign-in not configured. Add Client ID to .env file"
      >
        🔒 Google Sign-in (Not Configured)
      </button>
    );
  }

  const handleSuccess = (credentialResponse: any) => {
    try {
      const decoded = jwtDecode<GoogleUser>(credentialResponse.credential);
      setUser(decoded);
      localStorage.setItem('googleUser', JSON.stringify(decoded));
      localStorage.setItem('googleCredential', credentialResponse.credential);
      
      if (onAuthSuccess) {
        onAuthSuccess(decoded);
      }
      // Refresh the page to update the UI
      window.location.reload();
    } catch (error) {
      console.error('Failed to decode JWT:', error);
      if (onAuthFailure) {
        onAuthFailure();
      }
    }
  };

  const handleLogout = () => {
    googleLogout();
    setUser(null);
    localStorage.removeItem('googleUser');
    localStorage.removeItem('googleCredential');
  };

  if (user) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        <img 
          src={user.picture} 
          alt={user.name}
          style={{ 
            width: '32px', 
            height: '32px', 
            borderRadius: '50%',
            border: '2px solid rgba(255, 255, 255, 0.2)'
          }}
        />
        <span style={{ fontSize: '13px', color: '#fff' }}>{user.name}</span>
        <button 
          onClick={handleLogout}
          style={{
            padding: '6px 12px',
            fontSize: '12px',
            background: 'rgba(255, 68, 68, 0.15)',
            border: '1px solid rgba(255, 68, 68, 0.4)',
            color: '#ff4444',
            borderRadius: '6px',
            cursor: 'pointer'
          }}
        >
          Sign Out
        </button>
      </div>
    );
  }

  return (
    <div style={{ width: '100%' }}>
      <GoogleLogin
        onSuccess={handleSuccess}
        onError={() => {
          console.error('Google Login Failed');
          if (onAuthFailure) {
            onAuthFailure();
          }
        }}
        useOneTap
        theme="outline"
        size="large"
        text="continue_with"
        shape="rectangular"
        width="100%"
      />
    </div>
  );
};

export const GoogleAuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const clientId = process.env.REACT_APP_GOOGLE_CLIENT_ID || '';

  // Debug logging for production
  if (process.env.NODE_ENV === 'production') {
    console.log('Production environment detected');
    console.log('REACT_APP_GOOGLE_CLIENT_ID exists:', !!process.env.REACT_APP_GOOGLE_CLIENT_ID);
    console.log('Client ID length:', clientId.length);
  }

  if (!clientId || clientId === 'YOUR_GOOGLE_CLIENT_ID_HERE') {
    console.error('⚠️ Google Client ID not configured properly!');
    console.error('Current value:', clientId || 'empty');
    console.error('Please ensure REACT_APP_GOOGLE_CLIENT_ID is set in Vercel environment variables');
    return <>{children}</>;
  }

  console.log('Google Auth initialized with Client ID:', clientId.substring(0, 10) + '...');

  return (
    <GoogleOAuthProvider clientId={clientId}>
      {children}
    </GoogleOAuthProvider>
  );
};

export default GoogleAuthButton;