/**
 * Bitcoin Writer - Clean writing interface without UI chrome
 */

'use client';

import { useState, useEffect } from 'react';

export default function WritePage() {
  const [showBackButton, setShowBackButton] = useState(false);
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => {
    setMounted(true);
    
    return () => {};
  }, []);
  
  // Don't render until mounted to avoid hydration issues
  if (!mounted) {
    return null;
  }
  
  return (
    <div style={{ 
      width: '100vw', 
      height: '100vh', 
      margin: 0, 
      padding: 0,
      paddingTop: '32px', // Space for menubar
      overflow: 'hidden',
      position: 'fixed',
      top: 0,
      left: 0,
      background: '#1b1b1b'
    }}
    onMouseMove={(e) => {
      // Show back button when mouse is near top-left corner
      setShowBackButton(e.clientX < 100 && e.clientY < 60);
    }}
    >
      {/* Back to full interface button */}
      <button
        onClick={() => window.close()}
        style={{
          position: 'fixed',
          top: '20px',
          left: '20px',
          padding: '8px 16px',
          background: '#F7931A',
          color: '#1b1b1b',
          border: 'none',
          borderRadius: '4px',
          fontSize: '14px',
          fontWeight: '600',
          cursor: 'pointer',
          zIndex: 10000,
          opacity: showBackButton ? 1 : 0,
          transform: showBackButton ? 'translateX(0)' : 'translateX(-100px)',
          transition: 'all 0.3s ease',
          pointerEvents: showBackButton ? 'auto' : 'none'
        }}
      >
        ← Back to Full View
      </button>
      
      <iframe 
        src="/editor-standalone.html?clean=true"
        style={{ 
          width: '100%', 
          height: '100%', 
          border: 'none',
          margin: 0,
          padding: 0,
          backgroundColor: '#1b1b1b'
        }}
        title="Bitcoin Writer - Focus Mode"
      />
    </div>
  );
}