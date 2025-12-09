/**
 * Metanet Wallet Component for BRC100 Integration
 */

import React, { useState, useEffect } from 'react';
import { metanetIntegration } from '../lib/metanet-integration';
import MetanetModal from './MetanetModal';

interface MetanetWalletProps {
  onWalletConnected?: (publicKey: string) => void;
  onDocumentSaved?: (txid: string) => void;
}

export const MetanetWallet: React.FC<MetanetWalletProps> = ({ 
  onWalletConnected, 
  onDocumentSaved 
}) => {
  const [isConnected, setIsConnected] = useState(false);
  const [publicKey, setPublicKey] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [status, setStatus] = useState<string>('');
  const [showMetanetFeatures, setShowMetanetFeatures] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [isMinimized, setIsMinimized] = useState(true);

  // Don't auto-check wallet on mount - let users choose to connect
  useEffect(() => {
    // checkWalletConnection(); // Commented out - optional connection
  }, []);

  const checkWalletConnection = async () => {
    setIsLoading(true);
    try {
      const result = await metanetIntegration.initializeWallet();
      if (result.success) {
        setIsConnected(true);
        setPublicKey(result.publicKey || '');
        setStatus('BRC100 wallet connected');
        onWalletConnected?.(result.publicKey || '');
      }
    } catch (error) {
      console.log('Wallet not connected');
    } finally {
      setIsLoading(false);
    }
  };

  const connectWallet = async () => {
    setIsLoading(true);
    setStatus('Connecting to BRC100 wallet...');
    
    try {
      const result = await metanetIntegration.initializeWallet();
      
      if (result.success) {
        setIsConnected(true);
        setPublicKey(result.publicKey || '');
        setStatus('Wallet connected successfully!');
        onWalletConnected?.(result.publicKey || '');
        setShowModal(false);
        
        // Auto-register app after wallet connection
        await registerOnMetanet();
      } else {
        // Show the compelling modal if wallet connection fails
        setShowModal(true);
        setStatus('');
      }
    } catch (error) {
      // Show the compelling modal if there's an error
      setShowModal(true);
      setStatus('');
    } finally {
      setIsLoading(false);
    }
  };

  const registerOnMetanet = async () => {
    setStatus('Registering Bitcoin Writer on Metanet...');
    
    try {
      const result = await metanetIntegration.registerApp();
      
      if (result.success) {
        setStatus(`App registered on Metanet! TxID: ${result.txid}`);
        setShowMetanetFeatures(true);
      } else {
        setStatus('Failed to register on Metanet');
      }
    } catch (error) {
      console.error('Registration error:', error);
      setStatus('Error during Metanet registration');
    }
  };

  const saveCurrentDocument = async () => {
    setIsLoading(true);
    setStatus('Saving document to blockchain...');
    
    try {
      // Get current document content from editor
      const editor = document.getElementById('editor');
      const content = editor?.textContent || '';
      const title = (document.querySelector('.document-name span') as HTMLElement)?.textContent || 'Untitled';
      
      const result = await metanetIntegration.saveToBlockchain({
        title,
        content,
        metadata: {
          wordCount: content.split(/\s+/).length,
          charCount: content.length,
          savedAt: new Date().toISOString()
        }
      });
      
      if (result.success && result.txid) {
        setStatus(`Document saved! TxID: ${result.txid}`);
        onDocumentSaved?.(result.txid);
      } else {
        setStatus('Failed to save document');
      }
    } catch (error) {
      setStatus('Error saving document to blockchain');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSetupIdentity = () => {
    // Open Metanet Desktop download page
    window.open('https://metanet.bsvb.tech/', '_blank');
    setShowModal(false);
  };

  // Show minimized button if not expanded
  if (isMinimized) {
    return (
      <button
        onClick={() => setIsMinimized(false)}
        style={{
          position: 'fixed',
          top: '80px',
          right: '20px',
          background: 'linear-gradient(135deg, #F7931A, #FF6B35)',
          border: 'none',
          borderRadius: '12px',
          padding: '10px 16px',
          color: '#fff',
          fontSize: '14px',
          fontWeight: '600',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          boxShadow: '0 4px 12px rgba(247, 147, 26, 0.3)',
          transition: 'all 0.3s ease',
          zIndex: 10000
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = 'translateY(-2px)';
          e.currentTarget.style.boxShadow = '0 6px 20px rgba(247, 147, 26, 0.5)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = 'translateY(0)';
          e.currentTarget.style.boxShadow = '0 4px 12px rgba(247, 147, 26, 0.3)';
        }}
      >
        <span>🔗</span>
        MetaNet
      </button>
    );
  }

  return (
    <>
    <MetanetModal 
      isOpen={showModal}
      onClose={() => setShowModal(false)}
      onSetupIdentity={handleSetupIdentity}
    />
    
    <div style={{
      position: 'fixed',
      top: '80px',
      right: '20px',
      background: 'linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%)',
      border: '2px solid #F7931A',
      borderRadius: '12px',
      padding: '20px',
      minWidth: '300px',
      boxShadow: '0 8px 32px rgba(247, 147, 26, 0.3)',
      zIndex: 10000,
      fontFamily: 'system-ui, -apple-system, sans-serif'
    }}>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: '16px'
      }}>
        <h3 style={{
          margin: 0,
          color: '#F7931A',
          fontSize: '18px',
          fontWeight: '600',
          display: 'flex',
          alignItems: 'center',
          gap: '8px'
        }}>
          <span>🔗</span>
          Metanet Integration
        </h3>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          {isConnected && (
            <span style={{
              width: '10px',
              height: '10px',
              background: '#4CAF50',
              borderRadius: '50%',
              animation: 'pulse 2s infinite'
            }} />
          )}
          <button
            onClick={() => setIsMinimized(true)}
            style={{
              background: 'rgba(255, 255, 255, 0.1)',
              border: 'none',
              color: '#fff',
              fontSize: '18px',
              width: '24px',
              height: '24px',
              borderRadius: '50%',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'all 0.2s ease'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'rgba(255, 255, 255, 0.2)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)';
            }}
          >
            −
          </button>
        </div>
      </div>

      {!isConnected ? (
        <div>
          <p style={{
            color: '#b0b0b0',
            fontSize: '14px',
            marginBottom: '16px',
            lineHeight: '1.5'
          }}>
            Connect your BRC100 wallet to publish Bitcoin Writer to the Metanet App Catalog
          </p>
          
          <button
            onClick={connectWallet}
            disabled={isLoading}
            style={{
              width: '100%',
              padding: '12px 20px',
              background: isLoading ? '#666' : 'linear-gradient(135deg, #F7931A, #FF6B35)',
              color: '#fff',
              border: 'none',
              borderRadius: '8px',
              fontSize: '14px',
              fontWeight: '600',
              cursor: isLoading ? 'not-allowed' : 'pointer',
              transition: 'all 0.3s ease'
            }}
          >
            {isLoading ? 'Connecting...' : 'Connect BRC100 Wallet'}
          </button>
        </div>
      ) : (
        <div>
          <div style={{
            background: 'rgba(0, 0, 0, 0.3)',
            borderRadius: '8px',
            padding: '12px',
            marginBottom: '16px'
          }}>
            <div style={{
              fontSize: '12px',
              color: '#888',
              marginBottom: '4px'
            }}>
              Connected Wallet
            </div>
            <div style={{
              fontSize: '11px',
              color: '#F7931A',
              fontFamily: 'monospace',
              wordBreak: 'break-all'
            }}>
              {publicKey.substring(0, 20)}...{publicKey.substring(publicKey.length - 20)}
            </div>
          </div>

          {showMetanetFeatures && (
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '8px'
            }}>
              <button
                onClick={saveCurrentDocument}
                disabled={isLoading}
                style={{
                  padding: '10px 16px',
                  background: 'rgba(247, 147, 26, 0.1)',
                  color: '#F7931A',
                  border: '1px solid #F7931A',
                  borderRadius: '6px',
                  fontSize: '13px',
                  fontWeight: '500',
                  cursor: isLoading ? 'not-allowed' : 'pointer',
                  transition: 'all 0.2s ease'
                }}
              >
                📝 Save Document to Blockchain
              </button>
              
              <a
                href="https://metanetapps.com"
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  padding: '10px 16px',
                  background: 'rgba(76, 175, 80, 0.1)',
                  color: '#4CAF50',
                  border: '1px solid #4CAF50',
                  borderRadius: '6px',
                  fontSize: '13px',
                  fontWeight: '500',
                  textAlign: 'center',
                  textDecoration: 'none',
                  transition: 'all 0.2s ease'
                }}
              >
                🌐 View on Metanet App Catalog
              </a>
            </div>
          )}
        </div>
      )}

      {status && (
        <div style={{
          marginTop: '12px',
          padding: '8px',
          background: 'rgba(255, 255, 255, 0.05)',
          borderRadius: '4px',
          fontSize: '12px',
          color: status.includes('success') || status.includes('connected') ? '#4CAF50' : 
                 status.includes('Failed') || status.includes('Error') ? '#f44336' : '#b0b0b0',
          textAlign: 'center'
        }}>
          {status}
        </div>
      )}

      <style jsx>{`
        @keyframes pulse {
          0% {
            box-shadow: 0 0 0 0 rgba(76, 175, 80, 0.7);
          }
          70% {
            box-shadow: 0 0 0 10px rgba(76, 175, 80, 0);
          }
          100% {
            box-shadow: 0 0 0 0 rgba(76, 175, 80, 0);
          }
        }
      `}</style>
    </div>
    </>
  );
};

export default MetanetWallet;