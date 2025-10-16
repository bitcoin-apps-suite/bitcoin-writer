import React, { useState, useEffect } from 'react';
import './AnimatedPlaceholder.css';

const AnimatedPlaceholder: React.FC = () => {
  const messages = [
    "Start writing here...",
    "Bitcoin Writer auto-hashes your writing to chain whenever you stop typing...",
    "Each new hash contains the previous hash, creating a chain of value...",
    "Your document becomes a 'coin' that accretes in value as a UTXO...",
    "Every word you write is permanently secured on the blockchain...",
    "Building the future of decentralized publishing, one hash at a time...",
    "Your thoughts become immutable history on Bitcoin SV...",
    "Write once, preserved forever on the timechain...",
    "Oh look, a shiny thing! ✨",
    "Start writing here..."
  ];

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(true);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    if (isPaused) return;

    const interval = setInterval(() => {
      setIsVisible(false);
      
      setTimeout(() => {
        setCurrentIndex((prev) => (prev + 1) % messages.length);
        setIsVisible(true);
      }, 500);
    }, 4000); // Show each message for 4 seconds

    return () => clearInterval(interval);
  }, [currentIndex, isPaused, messages.length]);

  const handleMouseEnter = () => {
    setIsPaused(true);
  };

  const handleMouseLeave = () => {
    setIsPaused(false);
  };

  return (
    <div 
      className="animated-placeholder"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div className={`placeholder-text ${isVisible ? 'visible' : ''}`}>
        {messages[currentIndex]}
      </div>
      <div className="placeholder-indicators">
        {messages.map((_, index) => (
          <span
            key={index}
            className={`indicator ${index === currentIndex ? 'active' : ''}`}
            onClick={() => {
              setIsVisible(false);
              setTimeout(() => {
                setCurrentIndex(index);
                setIsVisible(true);
              }, 300);
            }}
          />
        ))}
      </div>
    </div>
  );
};

export default AnimatedPlaceholder;