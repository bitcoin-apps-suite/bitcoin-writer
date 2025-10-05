import React, { useState, useEffect } from 'react';
import './LoadingDoor.css';

interface LoadingDoorProps {
  onComplete?: () => void;
}

const LoadingDoor: React.FC<LoadingDoorProps> = ({ onComplete }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    // Start opening animation after a brief delay
    const openTimer = setTimeout(() => {
      setIsOpen(true);
    }, 800);

    // Hide the component completely after animation
    const hideTimer = setTimeout(() => {
      setIsVisible(false);
      if (onComplete) {
        onComplete();
      }
    }, 3800);

    return () => {
      clearTimeout(openTimer);
      clearTimeout(hideTimer);
    };
  }, [onComplete]);

  if (!isVisible) return null;

  return (
    <div className={`loading-door-container ${isOpen ? 'open' : ''}`}>
      {/* Single sliding door */}
      <div className="door-panel">
        <div className="door-content">
          <div className="bitcoin-logo">₿</div>
          <h1 className="door-title">
            <span className="bitcoin-text">Bitcoin</span>
            <span className="writer-text">Writer</span>
          </h1>
        </div>
      </div>
    </div>
  );
};

export default LoadingDoor;