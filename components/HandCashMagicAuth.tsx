import React, { useState } from 'react';
import { HandCashService } from '../services/HandCashService';

interface HandCashMagicAuthProps {
  onAuthComplete?: (user: any) => void;
  onClose?: () => void;
}

const HandCashMagicAuth: React.FC<HandCashMagicAuthProps> = ({
  onAuthComplete,
  onClose
}) => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [step, setStep] = useState<'email' | 'waiting' | 'success'>('email');

  const handcashService = new HandCashService();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setIsLoading(true);
    setMessage('');

    try {
      const result = await handcashService.requestMagicLink(email);
      
      if (result.success) {
        setStep('waiting');
        setMessage(result.message);
        
        // Start polling for authentication status
        startAuthPolling();
      } else {
        setMessage(result.message);
      }
    } catch (error: any) {
      setMessage(error.message || 'Failed to send magic link');
    } finally {
      setIsLoading(false);
    }
  };

  const startAuthPolling = () => {
    const pollInterval = setInterval(() => {
      if (handcashService.isAuthenticated()) {
        clearInterval(pollInterval);
        setStep('success');
        setMessage('Successfully authenticated!');
        
        const user = handcashService.getCurrentUser();
        if (onAuthComplete && user) {
          onAuthComplete(user);
        }
        
        setTimeout(() => {
          onClose?.();
        }, 2000);
      }
    }, 2000);

    // Stop polling after 5 minutes
    setTimeout(() => {
      clearInterval(pollInterval);
      if (step === 'waiting') {
        setMessage('Magic link expired. Please try again.');
        setStep('email');
      }
    }, 5 * 60 * 1000);
  };

  const handleTryAgain = () => {
    setStep('email');
    setMessage('');
    setEmail('');
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.8)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 10000
    }}>
      <div style={{
        backgroundColor: '#1a1a1a',
        border: '1px solid #333',
        borderRadius: '12px',
        padding: '32px',
        maxWidth: '480px',
        width: '90%',
        color: '#fff',
        fontFamily: 'system-ui, -apple-system, sans-serif'
      }}>
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          marginBottom: '24px' 
        }}>
          <h2 style={{ margin: 0, fontSize: '24px', fontWeight: '300' }}>
            🪄 HandCash Magic Link
          </h2>
          {onClose && (
            <button 
              onClick={onClose}
              style={{
                background: 'none',
                border: 'none',
                color: '#888',
                fontSize: '24px',
                cursor: 'pointer',
                padding: '4px'
              }}
            >
              ×
            </button>
          )}
        </div>

        {step === 'email' && (
          <>
            <p style={{ color: '#ccc', marginBottom: '24px', lineHeight: '1.5' }}>
              Enter your email to receive a secure authentication link from HandCash.
            </p>
            
            <form onSubmit={handleSubmit}>
              <div style={{ marginBottom: '20px' }}>
                <label style={{
                  display: 'block',
                  marginBottom: '8px',
                  fontSize: '14px',
                  fontWeight: '500',
                  color: '#ddd'
                }}>
                  Email Address
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  required
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    backgroundColor: '#2a2a2a',
                    border: '1px solid #444',
                    borderRadius: '8px',
                    color: '#fff',
                    fontSize: '16px',
                    outline: 'none'
                  }}
                />
              </div>
              
              {message && (
                <div style={{
                  marginBottom: '20px',
                  padding: '12px',
                  backgroundColor: message.includes('Failed') ? '#441a1a' : '#1a441a',
                  border: `1px solid ${message.includes('Failed') ? '#ff4444' : '#44ff44'}`,
                  borderRadius: '6px',
                  fontSize: '14px',
                  color: message.includes('Failed') ? '#ff8888' : '#88ff88'
                }}>
                  {message}
                </div>
              )}
              
              <div style={{ display: 'flex', gap: '12px' }}>
                {onClose && (
                  <button
                    type="button"
                    onClick={onClose}
                    style={{
                      flex: 1,
                      padding: '12px 24px',
                      backgroundColor: 'transparent',
                      border: '1px solid #444',
                      borderRadius: '8px',
                      color: '#ccc',
                      fontSize: '16px',
                      cursor: 'pointer'
                    }}
                  >
                    Cancel
                  </button>
                )}
                <button
                  type="submit"
                  disabled={isLoading || !email}
                  style={{
                    flex: 2,
                    padding: '12px 24px',
                    backgroundColor: isLoading ? '#444' : '#4a90e2',
                    border: 'none',
                    borderRadius: '8px',
                    color: '#fff',
                    fontSize: '16px',
                    cursor: isLoading ? 'not-allowed' : 'pointer',
                    opacity: isLoading || !email ? 0.6 : 1
                  }}
                >
                  {isLoading ? 'Sending...' : 'Send Magic Link'}
                </button>
              </div>
            </form>
          </>
        )}

        {step === 'waiting' && (
          <>
            <div style={{ textAlign: 'center', marginBottom: '24px' }}>
              <div style={{
                width: '48px',
                height: '48px',
                border: '4px solid #333',
                borderTop: '4px solid #4a90e2',
                borderRadius: '50%',
                animation: 'spin 1s linear infinite',
                margin: '0 auto 16px'
              }} />
              <h3 style={{ margin: 0, fontSize: '18px', fontWeight: '400' }}>
                Check Your Email
              </h3>
            </div>
            
            <p style={{ color: '#ccc', textAlign: 'center', lineHeight: '1.5' }}>
              We sent a secure authentication link to:
            </p>
            <p style={{ 
              color: '#4a90e2', 
              textAlign: 'center', 
              fontSize: '16px',
              fontWeight: '500',
              marginBottom: '24px'
            }}>
              {email}
            </p>
            
            <div style={{
              backgroundColor: '#2a2a2a',
              border: '1px solid #444',
              borderRadius: '8px',
              padding: '16px',
              marginBottom: '24px'
            }}>
              <p style={{ margin: 0, fontSize: '14px', color: '#ccc' }}>
                💡 <strong>Click the link in your email</strong> to authenticate with HandCash. 
                The link will automatically redirect you back here.
              </p>
            </div>

            <button
              onClick={handleTryAgain}
              style={{
                width: '100%',
                padding: '12px',
                backgroundColor: 'transparent',
                border: '1px solid #444',
                borderRadius: '8px',
                color: '#ccc',
                fontSize: '14px',
                cursor: 'pointer'
              }}
            >
              Use Different Email
            </button>

            <style>{`
              @keyframes spin {
                0% { transform: rotate(0deg); }
                100% { transform: rotate(360deg); }
              }
            `}</style>
          </>
        )}

        {step === 'success' && (
          <div style={{ textAlign: 'center' }}>
            <div style={{
              fontSize: '48px',
              marginBottom: '16px'
            }}>
              ✅
            </div>
            <h3 style={{ margin: 0, fontSize: '18px', fontWeight: '400', color: '#4a90e2' }}>
              Authentication Successful!
            </h3>
            <p style={{ color: '#ccc', margin: '16px 0 0 0' }}>
              Redirecting you back to Bitcoin Writer...
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default HandCashMagicAuth;