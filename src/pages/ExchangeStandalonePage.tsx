import React, { useState } from 'react';
import DocumentExchange from '../components/DocumentExchange';

const ExchangeStandalonePage: React.FC = () => {
  // Always open when accessed as a standalone page
  const [isOpen] = useState(true);
  
  const handleClose = () => {
    // Navigate back or to home when closed
    window.history.back();
  };

  return (
    <div className="exchange-standalone-page">
      <DocumentExchange 
        isOpen={isOpen} 
        onClose={handleClose}
      />
    </div>
  );
};

export default ExchangeStandalonePage;