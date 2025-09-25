import React from 'react';
import { useNavigate } from 'react-router-dom';

// This page has been replaced by PublisherOfferPage
// Keeping this file to avoid breaking imports
const PublisherContractsPage: React.FC = () => {
  const navigate = useNavigate();
  
  React.useEffect(() => {
    // Redirect to the new page
    navigate('/publisher/offer');
  }, [navigate]);
  
  return <div>Redirecting...</div>;
};

export default PublisherContractsPage;