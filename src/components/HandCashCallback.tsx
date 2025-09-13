import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const HandCashCallback: React.FC = () => {
  const [status, setStatus] = useState('Processing HandCash authentication...');
  const navigate = useNavigate();

  useEffect(() => {
    const handleCallback = async () => {
      try {
        // The main App component will handle the actual callback processing
        // This component just shows a loading state
        
        const urlParams = new URLSearchParams(window.location.search);
        const hashParams = new URLSearchParams(window.location.hash.replace('#', ''));
        
        const authToken = urlParams.get('authToken') || 
                         urlParams.get('auth_token') || 
                         urlParams.get('access_token') || 
                         urlParams.get('token') ||
                         hashParams.get('authToken') ||
                         hashParams.get('auth_token') ||
                         hashParams.get('access_token') ||
                         hashParams.get('token');

        const error = urlParams.get('error') || hashParams.get('error');
        
        if (error) {
          setStatus(`Authentication failed: ${error}`);
          setTimeout(() => navigate('/'), 3000);
        } else if (authToken) {
          setStatus('Authentication successful! Redirecting...');
          // Let the main app handle the callback
          navigate('/', { replace: true });
        } else {
          setStatus('No authentication token received. Redirecting...');
          setTimeout(() => navigate('/'), 2000);
        }
      } catch (error) {
        console.error('Callback error:', error);
        setStatus('Authentication failed. Redirecting...');
        setTimeout(() => navigate('/'), 3000);
      }
    };

    handleCallback();
  }, [navigate]);

  return (
    <div className="callback-container">
      <div className="callback-box">
        <div className="spinner"></div>
        <h2>HandCash Authentication</h2>
        <p>{status}</p>
      </div>
    </div>
  );
};

export default HandCashCallback;