/**
 * Bitcoin Writer - A blockchain-based writing application
 * Copyright (C) 2025 The Bitcoin Corporation LTD
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as published
 * by the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
import CleanTaskbar from "../components/ui/CleanTaskbar";
 *
 * For commercial licensing options, please contact The Bitcoin Corporation LTD.
 */

'use client';

import React, { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import './globals.css';
import '../components/ProofOfConceptBanner.css';
import '../components/DevSidebar.css';
import '../components/TickerSidebar.css';
import '../components/MinimalDock.css';
import '../components/Footer.css';
import dynamic from 'next/dynamic';

// Dynamic imports for components to avoid SSR issues
const ProofOfConceptBanner = dynamic(() => import('../components/ProofOfConceptBanner'), { ssr: false });
const Navigation = dynamic(() => import('../components/Navigation'), { ssr: false });
const CleanTaskbar = dynamic(() => import('../components/ui/CleanTaskbar'), { ssr: false });
const DevSidebar = dynamic(() => import('../components/ui/DevSidebar'), { ssr: false });
const TickerSidebar = dynamic(() => import('../components/ui/TickerSidebar'), { ssr: false });
const DockManager = dynamic(() => import('../components/ui/DockManager'), { ssr: false });
const Footer = dynamic(() => import('../components/ui/Footer'), { ssr: false });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname();
  const [devSidebarCollapsed, setDevSidebarCollapsed] = useState(true);
  const [tickerSidebarCollapsed, setTickerSidebarCollapsed] = useState(true);
  const isWritePage = pathname === '/write';
  
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
        <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
        <link rel="alternate icon" type="image/svg+xml" href="/logo.svg" />
      </head>
      <body>
        <div className="App">
          {/* Proof of Concept Banner - hide on /write page */}
          {!isWritePage && <ProofOfConceptBanner />}
          
          {/* Clean Taskbar */}
          <CleanTaskbar tickerCollapsed={tickerSidebarCollapsed} isWritePage={isWritePage} />
          
          {/* Dev Sidebar (desktop only, hide on /write page) */}
          {!isMobile && !isWritePage && (
            <DevSidebar onCollapsedChange={setDevSidebarCollapsed} />
          )}
          
          {/* Ticker Sidebar (desktop only, hide on /write page) */}
          {!isMobile && !isWritePage && (
            <TickerSidebar onCollapsedChange={setTickerSidebarCollapsed} />
          )}
          
          {/* Main Content */}
          <div className={`main-content ${devSidebarCollapsed ? 'sidebar-collapsed' : 'sidebar-expanded'}`}>
            {children}
          </div>
          
          {/* Dock - hide on /write page */}
          {!isWritePage && <DockManager currentApp="bitcoin-writer" />}
          
          {/* Footer - hide on /write page */}
          {!isWritePage && <Footer />}
        </div>
      </body>
    </html>
  )
}
