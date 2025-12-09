/**
 * Bitcoin Writer - A blockchain-based writing application
 * Copyright (C) 2025 The Bitcoin Corporation LTD
 */

'use client';

'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function Home() {
  const router = useRouter();
  const [isHovered, setIsHovered] = useState(false);
  
  const handleClick = () => {
    // Open in new tab/window
    window.open('/write', '_blank');
  };
  
  return (
    <div style={{ 
      width: '100vw', 
      height: '100vh', 
      margin: 0, 
      padding: 0,
      overflow: 'hidden',
      position: 'fixed',
      top: 0,
      left: 0
    }}>
      {/* Hover overlay */}
      <div
        style={{
          position: 'absolute',
          top: '72px', // Below POC bar and menu bar
          left: '60px', // After collapsed DevSidebar
          right: '0', // Include the full app area up to the tickerbar
          bottom: '32px', // Above MinimalDock
          width: 'calc(100% - 60px - 60px)', // Full width minus DevSidebar and TickerSidebar
          pointerEvents: isHovered ? 'auto' : 'none',
          cursor: isHovered ? 'pointer' : 'default',
          border: isHovered ? '3px solid #F7931A' : 'none',
          borderRadius: '4px',
          transition: 'all 0.3s ease',
          zIndex: isHovered ? 9999 : -1,
          background: isHovered ? 'rgba(247, 147, 26, 0.05)' : 'transparent'
        }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onClick={handleClick}
      />
      
      <iframe 
        src="/editor-standalone.html"
        style={{ 
          width: '100%', 
          height: '100%', 
          border: 'none',
          margin: 0,
          padding: 0,
          backgroundColor: '#1b1b1b'
        }}
        title="Bitcoin Writer"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      />
    </div>
  );
}