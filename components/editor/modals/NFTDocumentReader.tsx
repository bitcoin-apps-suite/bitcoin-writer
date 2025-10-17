import React from 'react';

interface NFTDocumentReaderProps {
  isOpen: boolean;
  onClose: () => void;
  nftId: string;
  nftOrigin: string;
  title: string;
  author: string;
  authorHandle: string;
  marketUrl: string;
}

const NFTDocumentReader: React.FC<NFTDocumentReaderProps> = ({
  isOpen,
  onClose,
  nftId,
  nftOrigin,
  title,
  author,
  authorHandle,
  marketUrl
}) => {
  if (!isOpen) return null;

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'rgba(0, 0, 0, 0.8)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000
    }}>
      <div style={{
        background: '#1a1a1a',
        border: '1px solid #333',
        borderRadius: '8px',
        padding: '2rem',
        maxWidth: '600px',
        width: '90%',
        maxHeight: '80vh',
        overflow: 'auto'
      }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '1.5rem'
        }}>
          <h2 style={{ color: '#ff9500', margin: 0 }}>{title}</h2>
          <button
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              color: '#888',
              fontSize: '24px',
              cursor: 'pointer'
            }}
          >
            ×
          </button>
        </div>
        
        <div style={{ marginBottom: '1rem' }}>
          <p style={{ color: '#ccc', margin: 0 }}>
            By {author} ({authorHandle})
          </p>
          <p style={{ color: '#888', fontSize: '0.9rem', margin: '0.5rem 0' }}>
            NFT ID: {nftId}
          </p>
        </div>

        <div style={{
          padding: '1.5rem',
          background: '#0d0d0d',
          borderRadius: '6px',
          border: '1px solid #333',
          marginBottom: '1.5rem'
        }}>
          <p style={{ color: '#ccc', textAlign: 'center', fontStyle: 'italic' }}>
            This is an NFT document. Purchase required to view full content.
          </p>
        </div>

        <div style={{
          display: 'flex',
          gap: '1rem',
          justifyContent: 'center'
        }}>
          <button
            onClick={() => window.open(marketUrl, '_blank')}
            style={{
              background: 'linear-gradient(135deg, #ff9500 0%, #ffb347 100%)',
              color: '#000',
              border: 'none',
              padding: '10px 20px',
              borderRadius: '6px',
              cursor: 'pointer',
              fontWeight: '600'
            }}
          >
            Purchase NFT
          </button>
          <button
            onClick={onClose}
            style={{
              background: 'transparent',
              color: '#888',
              border: '1px solid #444',
              padding: '10px 20px',
              borderRadius: '6px',
              cursor: 'pointer'
            }}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default NFTDocumentReader;