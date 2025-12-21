/**
 * Bitcoin Writer - A blockchain-based writing application
 * Copyright (C) 2025 The Bitcoin Corporation LTD
 */

'use client';

import { useState, useEffect } from 'react';

export default function Home() {
  const [mounted, setMounted] = useState(false);
  const [showPopOutButton, setShowPopOutButton] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handlePopOut = () => {
    // Open editor in new window with app-like styling
    const popOutWindow = window.open(
      '/editor-standalone.html', 
      'BitcoinWriter',
      'width=1200,height=800,scrollbars=no,resizable=yes,status=no,toolbar=no,menubar=no,location=no'
    );
    
    if (popOutWindow) {
      popOutWindow.focus();
      // Optional: Close the main window or redirect to a minimal landing page
      // window.location.href = '/about'; // Uncomment if you want to redirect main window
    }
  };

  // Don't render until mounted to avoid hydration issues
  if (!mounted) {
    return null;
  }
  
  return (
    <div 
      style={{ 
        width: '100vw', 
        height: '100vh', 
        margin: 0, 
        padding: 0,
        background: '#1b1b1b',
        position: 'relative'
      }}
      onMouseMove={(e) => {
        // Show pop-out button when mouse is near top-right corner
        setShowPopOutButton(e.clientX > window.innerWidth - 120 && e.clientY < 60);
      }}
      onMouseLeave={() => {
        setShowPopOutButton(false);
      }}
    >
      {/* Editor iframe - full size */}
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
      />

      {/* Header overlay - positioned below iframe's menu bar */}
      <div style={{
        position: 'absolute',
        top: '60px', // Position further below the iframe's internal menu bar
        left: 0,
        right: 0,
        background: 'linear-gradient(to bottom, rgba(27, 27, 27, 0.95), rgba(27, 27, 27, 0.85))',
        backdropFilter: 'blur(10px)',
        borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
        padding: '1.25rem 0',
        zIndex: 1000,
        pointerEvents: 'none' // Allow clicks to pass through to iframe
      }}>
        <div style={{
          maxWidth: '1200px',
          margin: '0 auto',
          padding: '0 2rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center', // Center the content
          textAlign: 'center'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{
              width: '28px',
              height: '28px',
              background: 'linear-gradient(135deg, #FF8C00 0%, #FF6B35 100%)',
              borderRadius: '6px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#2D3748',
              fontSize: '14px',
              fontWeight: '600'
            }}>
              ₿
            </div>
            <div>
              <span 
                style={{ 
                  color: '#f7931a', 
                  fontSize: '1.5rem', 
                  fontWeight: '300', // Thin weight
                  letterSpacing: '0.02em',
                  fontFamily: "'SF Pro Display', 'Helvetica Neue', 'Segoe UI', -apple-system, BlinkMacSystemFont, sans-serif"
                }}
              >
                Bitcoin
              </span>
              <span style={{ 
                color: '#ffffff', 
                fontSize: '1.5rem', 
                fontWeight: '300', // Thin weight
                marginLeft: '4px',
                letterSpacing: '0.02em',
                fontFamily: "'SF Pro Display', 'Helvetica Neue', 'Segoe UI', -apple-system, BlinkMacSystemFont, sans-serif"
              }}>
                Writer
              </span>
            </div>
          </div>
        </div>
        <p style={{ 
          color: '#888', 
          fontSize: '13px', 
          margin: '4px 0 0 0',
          fontStyle: 'italic',
          textAlign: 'center',
          fontWeight: '300',
          letterSpacing: '0.01em',
          fontFamily: "'SF Pro Display', 'Helvetica Neue', 'Segoe UI', -apple-system, BlinkMacSystemFont, sans-serif"
        }}>
          Encrypt, publish and sell shares in your work
        </p>
      </div>

      {/* Pop Out Button */}
      <button
        onClick={handlePopOut}
        style={{
          position: 'absolute',
          top: '140px', // Below the overlay header
          right: '20px',
          padding: '8px 16px',
          background: '#f7931a',
          color: '#1b1b1b',
          border: 'none',
          borderRadius: '4px',
          fontSize: '14px',
          fontWeight: '600',
          cursor: 'pointer',
          zIndex: 10000,
          opacity: showPopOutButton ? 1 : 0,
          transform: showPopOutButton ? 'translateX(0)' : 'translateX(100px)',
          transition: 'all 0.3s ease',
          pointerEvents: showPopOutButton ? 'auto' : 'none',
          display: 'flex',
          alignItems: 'center',
          gap: '6px'
        }}
        title="Pop out to standalone window"
      >
        <span>🗗</span>
        Pop Out
      </button>
    </div>
  );
}