import React from 'react';
import './AdCard.css';

interface AdCardProps {
  type: 'banner' | 'product' | 'service' | 'sponsored';
  title: string;
  description: string;
  imageUrl: string;
  actionText: string;
  brand: string;
  sponsored?: boolean;
}

const AdCard: React.FC<AdCardProps> = ({
  type,
  title,
  description,
  imageUrl,
  actionText,
  brand,
  sponsored = true
}) => {
  const handleAdClick = () => {
    console.log(`Ad clicked: ${title} by ${brand}`);
    // In production, this would track the click and redirect
  };

  return (
    <div className={`ad-card ad-card-${type}`} onClick={handleAdClick}>
      {sponsored && (
        <div className="ad-sponsored-label">
          <span>Sponsored</span>
        </div>
      )}
      
      <div className="ad-image">
        <img src={imageUrl} alt={title} />
        <div className="ad-overlay">
          <div className="ad-brand">{brand}</div>
        </div>
      </div>
      
      <div className="ad-content">
        <h4 className="ad-title">{title}</h4>
        <p className="ad-description">{description}</p>
        <button className="ad-action-btn">{actionText}</button>
      </div>
    </div>
  );
};

export default AdCard;