'use client';

import React, { useState, useEffect } from 'react';
import './globals.css';
import '../components/ProofOfConceptBanner.css';
import '../components/DevSidebar.css';
import '../components/TickerSidebar.css';
import '../components/MinimalDock.css';
import '../components/Footer.css';
import dynamic from 'next/dynamic';

// Dynamic imports for components to avoid SSR issues
const ProofOfConceptBanner = dynamic(() => import('../components/ProofOfConceptBanner'), { ssr: false });
const CleanTaskbar = dynamic(() => import('../components/CleanTaskbar'), { ssr: false });
const DevSidebar = dynamic(() => import('../components/DevSidebar'), { ssr: false });
const TickerSidebar = dynamic(() => import('../components/TickerSidebar'), { ssr: false });
const MinimalDock = dynamic(() => import('../components/MinimalDock'), { ssr: false });
const Footer = dynamic(() => import('../components/Footer'), { ssr: false });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [devSidebarCollapsed, setDevSidebarCollapsed] = useState(true);
  
  // Debug: log when state changes
  useEffect(() => {
    console.log('DevSidebar collapsed state changed to:', devSidebarCollapsed);
  }, [devSidebarCollapsed]);
  const [isMobile, setIsMobile] = useState(false);
  
  // Check if mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  return (
    <html lang="en">
      <head>
        <title>Bitcoin Writer</title>
        <meta name="description" content="Encrypt, publish and sell shares in your work" />
      </head>
      <body>
        <div className="App">
          {/* Proof of Concept Banner */}
          <ProofOfConceptBanner />
          
          {/* Clean Taskbar */}
          <CleanTaskbar />
          
          {/* Dev Sidebar (desktop only) */}
          {!isMobile && (
            <DevSidebar onCollapsedChange={setDevSidebarCollapsed} />
          )}
          
          {/* Main Content */}
          <div className={`main-content ${devSidebarCollapsed ? 'sidebar-collapsed' : 'sidebar-expanded'}`}>
            {children}
          </div>
          
          {/* Footer */}
          <Footer />
          
          {/* Ticker Sidebar (desktop only) */}
          {!isMobile && (
            <TickerSidebar 
              isEditorMode={false}
              compactMode={false}
            />
          )}
          
          {/* Minimal Dock */}
          <MinimalDock />
        </div>
      </body>
    </html>
  )
}
