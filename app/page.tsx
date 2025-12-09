/**
 * Bitcoin Writer - A blockchain-based writing application
 * Copyright (C) 2025 The Bitcoin Corporation LTD
 */

'use client';

import { useState, useEffect } from 'react';
import LoadingDoor from '../components/LoadingDoor';

export default function Home() {
  const [isLoading, setIsLoading] = useState(true);

  return (
    <>
      {/* Loading Door Animation - overlays content */}
      {isLoading && <LoadingDoor onComplete={() => setIsLoading(false)} />}
      
      {/* Main app content - Just the iframe, no duplicate UI */}
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
      </div>
    </>
  );
}