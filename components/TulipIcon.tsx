import React from 'react';

interface TulipIconProps {
  size?: number;
  className?: string;
}

const TulipIcon: React.FC<TulipIconProps> = ({ size = 20, className }) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="none" 
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    {/* Left petal - wide and open */}
    <path 
      d="M12 2C8.5 2 6 5 6 9.5C6 11.5 7 13 9 14C10 14.5 11 14.8 12 14.8" 
      stroke="currentColor" 
      strokeWidth="1.5" 
      fill="currentColor" 
      opacity="0.7"
    />
    
    {/* Right petal - wide and open */}
    <path 
      d="M12 2C15.5 2 18 5 18 9.5C18 11.5 17 13 15 14C14 14.5 13 14.8 12 14.8" 
      stroke="currentColor" 
      strokeWidth="1.5" 
      fill="currentColor" 
      opacity="0.7"
    />
    
    {/* Center petal - creates the tulip cup shape */}
    <path 
      d="M12 14.8C11 14.8 10 14.5 9 14C9.5 13.5 10.5 13 12 13C13.5 13 14.5 13.5 15 14C14 14.5 13 14.8 12 14.8Z" 
      fill="currentColor" 
      opacity="0.9"
    />
    
    {/* Main stem */}
    <line 
      x1="12" 
      y1="14.8" 
      x2="12" 
      y2="20" 
      stroke="currentColor" 
      strokeWidth="1.8" 
      opacity="0.8"
    />
    
    {/* Side leaf coming off the stem */}
    <path 
      d="M12 16.5C10 17 8 18 7.5 19.5C7.3 20.2 7.8 20.5 8.5 20C9.5 19.2 11 18 12 17.5" 
      stroke="currentColor" 
      strokeWidth="1.2" 
      fill="currentColor" 
      opacity="0.6"
    />
  </svg>
);

export default TulipIcon;