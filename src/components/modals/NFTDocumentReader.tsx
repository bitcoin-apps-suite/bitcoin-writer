import React, { useState, useEffect } from 'react';
import './NFTDocumentReader.css';

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
  const [documentContent, setDocumentContent] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [canRead, setCanRead] = useState(false);

  useEffect(() => {
    if (isOpen && nftId) {
      fetchDocumentContent();
    }
  }, [isOpen, nftId]);

  const fetchDocumentContent = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await fetch(`${process.env.NODE_ENV === 'production' ? '' : 'http://localhost:4000'}/api/marketplace`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'getDocumentContent',
          nftId: nftId,
          authToken: localStorage.getItem('handcash_auth_token') // If user is authenticated
        })
      });

      const result = await response.json();
      
      if (result.success && result.document) {
        setDocumentContent(result.document.content);
        setCanRead(result.document.canRead);
      } else {
        setError(result.error || 'Unable to load document');
        setCanRead(false);
      }
    } catch (err) {
      console.error('Error fetching document:', err);
      setError('Failed to load document content');
      setCanRead(false);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="nft-reader-overlay" onClick={onClose}>
      <div className="nft-reader-modal" onClick={(e) => e.stopPropagation()}>
        <div className="nft-reader-header">
          <div className="nft-reader-header-content">
            <h2>{title}</h2>
            <div className="nft-reader-meta">
              <span className="nft-author">by {author}</span>
              <span className="nft-handle">{authorHandle}</span>
              <span className="nft-badge">🎨 NFT</span>
            </div>
          </div>
          <button className="nft-reader-close" onClick={onClose}>×</button>
        </div>

        <div className="nft-reader-body">
          {isLoading && (
            <div className="nft-reader-loading">
              <div className="loading-spinner"></div>
              <p>Loading document...</p>
            </div>
          )}

          {error && !isLoading && (
            <div className="nft-reader-error">
              <h3>🔒 Document Locked</h3>
              <p>{error}</p>
              <div className="nft-reader-actions">
                <a 
                  href={marketUrl} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="btn-buy-nft"
                >
                  Buy NFT on HandCash Market
                </a>
              </div>
            </div>
          )}

          {!isLoading && !error && canRead && (
            <div className="nft-reader-content">
              <div dangerouslySetInnerHTML={{ __html: documentContent }} />
            </div>
          )}

          {!isLoading && !error && !canRead && (
            <div className="nft-reader-preview">
              <h3>📄 Document Preview</h3>
              <p>This is a preview of the NFT document. To read the full content, you need to own this NFT.</p>
              <div className="preview-content" dangerouslySetInnerHTML={{ __html: documentContent }} />
              <div className="nft-reader-actions">
                <a 
                  href={marketUrl} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="btn-buy-nft"
                >
                  Buy NFT to Read Full Document
                </a>
              </div>
            </div>
          )}
        </div>

        <div className="nft-reader-footer">
          <div className="nft-info">
            <span>Origin: {nftOrigin}</span>
            <span>NFT ID: {nftId}</span>
          </div>
          <a 
            href={marketUrl} 
            target="_blank" 
            rel="noopener noreferrer"
            className="btn-view-market"
          >
            View on HandCash Market →
          </a>
        </div>
      </div>
    </div>
  );
};

export default NFTDocumentReader;