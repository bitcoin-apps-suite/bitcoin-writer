'use client';

import React, { useState, useEffect } from 'react';
import './changelog.css';

export default function ChangelogPage() {
  const [mounted, setMounted] = useState(false);
  const [devSidebarCollapsed, setDevSidebarCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    setMounted(true);
    
    if (typeof window !== 'undefined') {
      setDevSidebarCollapsed(localStorage.getItem('devSidebarCollapsed') === 'true');
      setIsMobile(window.innerWidth <= 768);
      
      const handleStorageChange = () => {
        const saved = localStorage.getItem('devSidebarCollapsed');
        setDevSidebarCollapsed(saved === 'true');
      };
      
      const handleResize = () => {
        setIsMobile(window.innerWidth <= 768);
      };
      
      window.addEventListener('storage', handleStorageChange);
      window.addEventListener('resize', handleResize);
      
      const checkSidebarState = setInterval(() => {
        const saved = localStorage.getItem('devSidebarCollapsed');
        setDevSidebarCollapsed(saved === 'true');
      }, 100);
      
      return () => {
        window.removeEventListener('storage', handleStorageChange);
        window.removeEventListener('resize', handleResize);
        clearInterval(checkSidebarState);
      };
    }
  }, []);

  if (!mounted) {
    return (
      <div className="App">
        <div className="changelog-page">
          <div className="changelog-container">
            <section className="changelog-hero">
              <h1>Bitcoin Writer <span style={{color: '#F7931E'}}>Changelog</span></h1>
              <p className="changelog-tagline">
                Track updates, features, and improvements to Bitcoin Writer
              </p>
            </section>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="App">
      <div className={`changelog-page ${mounted && !isMobile && !devSidebarCollapsed ? 'with-sidebar-expanded' : ''} ${mounted && !isMobile && devSidebarCollapsed ? 'with-sidebar-collapsed' : ''}`}>
        <div className="changelog-container">
          {/* Hero Section */}
          <section className="changelog-hero">
            <h1>Bitcoin Writer <span style={{color: '#F7931E'}}>Changelog</span></h1>
            <p className="changelog-tagline">
              Track updates, features, and improvements to Bitcoin Writer
            </p>
            <div className="changelog-badge">LATEST UPDATES</div>
          </section>

          {/* Quick Links */}
          <section className="quick-links">
            <div className="links-grid">
              <a 
                href="https://github.com/bitcoin-apps-suite/bitcoin-writer/issues" 
                target="_blank" 
                rel="noopener noreferrer"
                className="link-card"
              >
                <div className="link-icon">🐛</div>
                <h3>Report Issues</h3>
                <p>Found a bug or have a feature request? Report it on GitHub.</p>
              </a>
              <a 
                href="https://github.com/bitcoin-apps-suite/bitcoin-writer/releases" 
                target="_blank" 
                rel="noopener noreferrer"
                className="link-card"
              >
                <div className="link-icon">🚀</div>
                <h3>Releases</h3>
                <p>View all official releases and download previous versions.</p>
              </a>
              <a 
                href="/contributions" 
                className="link-card"
              >
                <div className="link-icon">🤝</div>
                <h3>Contribute</h3>
                <p>Help build Bitcoin Writer and earn $BWriter tokens.</p>
              </a>
            </div>
          </section>

          {/* Changelog Entries */}
          <section className="changelog-entries">
            <div className="changelog-entry">
              <div className="entry-header">
                <div className="version-badge">v2.0.0</div>
                <div className="entry-date">October 17, 2025</div>
              </div>
              <h2>Major Platform Migration & Developer Hub</h2>
              <div className="entry-content">
                <h3>🚀 New Features</h3>
                <ul>
                  <li>Complete migration from React to Next.js App Router</li>
                  <li>15+ new developer hub pages with comprehensive functionality</li>
                  <li>Contributions page with token distribution tracking</li>
                  <li>Contract management system with GitHub integration</li>
                  <li>Publisher/Author marketplace pages</li>
                  <li>Enterprise solutions page</li>
                  <li>Enhanced documentation and API reference</li>
                  <li>Real-time status monitoring dashboard</li>
                </ul>

                <h3>🎨 Design Improvements</h3>
                <ul>
                  <li>Consistent orange/yellow color scheme across all pages</li>
                  <li>Fixed sidebar positioning - pages now stay centered</li>
                  <li>Improved responsive design for mobile devices</li>
                  <li>Hydration-safe components preventing content shifts</li>
                </ul>

                <h3>🔧 Technical Improvements</h3>
                <ul>
                  <li>Server-side rendering optimizations</li>
                  <li>Better build performance and bundle optimization</li>
                  <li>Fixed CSS syntax errors and improved maintainability</li>
                  <li>Enhanced developer experience with proper TypeScript types</li>
                </ul>

                <h3>🐛 Bug Fixes</h3>
                <ul>
                  <li>Fixed hydration mismatches across all pages</li>
                  <li>Resolved CSS color inconsistencies</li>
                  <li>Fixed sidebar positioning issues</li>
                  <li>Corrected build errors in developer pages</li>
                </ul>
              </div>
            </div>

            <div className="changelog-entry">
              <div className="entry-header">
                <div className="version-badge">v1.9.0</div>
                <div className="entry-date">October 15, 2025</div>
              </div>
              <h2>Token Page & Sidebar Improvements</h2>
              <div className="entry-content">
                <h3>🔧 Improvements</h3>
                <ul>
                  <li>Fixed token page content shifting when dev sidebar opens</li>
                  <li>Removed sidebar state management to prevent layout shifts</li>
                  <li>Enhanced CSS classes for proper styling</li>
                </ul>
              </div>
            </div>

            <div className="changelog-entry">
              <div className="entry-header">
                <div className="version-badge">v1.8.0</div>
                <div className="entry-date">Previous Releases</div>
              </div>
              <h2>Core Platform Development</h2>
              <div className="entry-content">
                <h3>🏗️ Foundation</h3>
                <ul>
                  <li>Initial React application setup and configuration</li>
                  <li>HandCash authentication integration</li>
                  <li>Document editor with Quill.js</li>
                  <li>BSV blockchain storage service</li>
                  <li>NFT tokenization system</li>
                  <li>Document exchange marketplace</li>
                  <li>AI Chat Assistant with multiple providers</li>
                  <li>Document versioning with Ordinals</li>
                  <li>Smart contract integration</li>
                  <li>Mobile responsive design</li>
                </ul>
              </div>
            </div>
          </section>

          {/* Footer */}
          <section className="changelog-footer">
            <div className="footer-content">
              <h3>Stay Updated</h3>
              <p>Follow our development progress and get notified of new releases.</p>
              <div className="footer-links">
                <a href="https://x.com/bitcoin_writer" target="_blank" rel="noopener noreferrer">
                  Twitter
                </a>
                <a href="https://github.com/bitcoin-apps-suite/bitcoin-writer" target="_blank" rel="noopener noreferrer">
                  GitHub
                </a>
                <a href="https://discord.gg/xBB8r8dj" target="_blank" rel="noopener noreferrer">
                  Discord
                </a>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}