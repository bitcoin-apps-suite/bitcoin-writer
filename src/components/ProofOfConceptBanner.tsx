import React, { useState } from 'react';
import './ProofOfConceptBanner.css';

const ProofOfConceptBanner: React.FC = () => {
  const [isVisible, setIsVisible] = useState(true);

  if (!isVisible) return null;

  return (
    <div className="poc-banner">
      <div className="poc-banner-content">
        <div className="poc-banner-icon">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
            <line x1="12" y1="9" x2="12" y2="13"/>
            <line x1="12" y1="17" x2="12.01" y2="17"/>
          </svg>
        </div>
        <div className="poc-banner-text">
          <span className="poc-banner-label">PROOF OF CONCEPT</span>
          <span className="poc-banner-message">
            This is a demonstration version. Features are under active development. 
            <a href="https://github.com/bitcoin-apps-suite/bitcoin-writer" target="_blank" rel="noopener noreferrer">
              Contribute on GitHub
            </a>
          </span>
        </div>
      </div>
      <button 
        className="poc-banner-close"
        onClick={() => setIsVisible(false)}
        aria-label="Close banner"
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <line x1="18" y1="6" x2="6" y2="18"/>
          <line x1="6" y1="6" x2="18" y2="18"/>
        </svg>
      </button>
    </div>
  );
};

export default ProofOfConceptBanner;