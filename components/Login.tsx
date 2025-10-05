import React, { useState } from 'react';
import { HandCashService, HandCashUser } from '../services/HandCashService';

interface LoginProps {
  onLogin: (user: HandCashUser) => void;
}

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [handcashService] = useState(new HandCashService());

  const handleLogin = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      await handcashService.login();
    } catch (error) {
      console.error('Login failed:', error);
      setError(error instanceof Error ? error.message : 'Login failed');
      setIsLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <div className="logo-section">
          <h1>Bitcoin Writer</h1>
          <p className="tagline">Blockchain-powered writing with HandCash</p>
        </div>
        
        <div className="features-section">
          <h3>Why Bitcoin Writer?</h3>
          <ul>
            <li>🔑 Only you can access them with your HandCash login</li>
            <li>🌐 Access your work from anywhere, anytime</li>
            <li>💎 Built on Bitcoin SV for permanent storage</li>
          </ul>
        </div>

        <div className="login-section">
          <p>Sign in with your HandCash wallet to get started</p>
          
          {error && (
            <div className="error-message">
              {error}
            </div>
          )}
          
          <button 
            className="handcash-login-btn" 
            onClick={handleLogin}
            disabled={isLoading}
          >
            {isLoading ? (
              <span>
                <span className="spinner"></span>
                Connecting to HandCash...
              </span>
            ) : (
              <span>
                <span style={{ marginRight: '8px', fontSize: '18px' }}>💰</span>
                Sign in with HandCash
              </span>
            )}
          </button>

          <div className="privacy-note">
            <small>
              We use HandCash for secure authentication. Your private keys never leave your wallet.
            </small>
          </div>
        </div>
      </div>
      
      <div className="demo-section">
        <h4>New to HandCash?</h4>
        <p>
          HandCash is a Bitcoin wallet that makes it easy to use Bitcoin SV applications.
          <a href="https://handcash.io" target="_blank" rel="noopener noreferrer">
            Get HandCash →
          </a>
        </p>
      </div>
    </div>
  );
};

export default Login;