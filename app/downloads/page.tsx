'use client'

import React from 'react';
import './DownloadsPage.css';

export default function DownloadsPage() {
  return (
    <div className="App">
      <div className="downloads-page">
      <div className="downloads-container">
        {/* Hero Section */}
        <section className="downloads-hero">
          <h1><span style={{color: '#ffffff'}}>Download</span> <span style={{color: '#f7931a'}}>Bitcoin Writer</span></h1>
          <p className="downloads-tagline">
            Professional writing software with blockchain integration
          </p>
          <div className="version-badge">Version 1.4.0</div>
        </section>

        {/* Downloads Section */}
        <section className="downloads-section">
          <h2>Desktop Applications</h2>
          <div className="downloads-grid">
            <div className="download-card">
              <div className="platform-icon apple-silicon"></div>
              <h3>Apple Silicon</h3>
              <p className="system-requirements">
                For M1, M2, and M3 Macs<br />
                macOS 11.0 or later<br />
                Optimized for ARM architecture
              </p>
              <a 
                href="https://github.com/bitcoin-apps-suite/bitcoin-writer/releases/download/v1.4.0/Bitcoin.Writer-1.0.0-arm64.dmg"
                className="download-button"
                download
              >
                Download
                <span className="file-info">104 MB • DMG</span>
              </a>
            </div>

            <div className="download-card">
              <div className="platform-icon intel"></div>
              <h3>Intel Mac</h3>
              <p className="system-requirements">
                For Intel-based Macs<br />
                macOS 10.13 or later<br />
                Universal x64 compatibility
              </p>
              <a 
                href="https://github.com/bitcoin-apps-suite/bitcoin-writer/releases/download/v1.4.0/Bitcoin.Writer-1.0.0.dmg"
                className="download-button"
                download
              >
                Download
                <span className="file-info">109 MB • DMG</span>
              </a>
            </div>
          </div>
        </section>

        {/* Installation Section */}
        <section className="installation-section">
          <h2>Installation Instructions</h2>
          <div className="installation-card">
            <h3>macOS Security Notice</h3>
            <p className="notice-text">
              If you see an "app is damaged" error when opening Bitcoin Writer:
            </p>
            <ol className="installation-steps">
              <li>Open Terminal (found in Applications → Utilities)</li>
              <li>
                Run this command:
                <code className="terminal-command">
                  xattr -cr "/Applications/Bitcoin Writer.app"
                </code>
              </li>
              <li>The app will now open normally</li>
            </ol>
            <p className="notice-subtext">
              This removes the quarantine flag Apple adds to unsigned apps. Bitcoin Writer is safe and open source.
            </p>
          </div>
        </section>

        {/* Features Section */}
        <section className="features-section">
          <h2>Key Features</h2>
          <div className="features-grid">
            <div className="feature">
              <h4>Professional Editor</h4>
              <p>Full Microsoft Word-style interface with ribbon tabs, comprehensive formatting tools, and familiar keyboard shortcuts</p>
            </div>
            <div className="feature">
              <h4>Blockchain Storage</h4>
              <p>Save documents directly to the Bitcoin SV blockchain for permanent, tamper-proof storage with cryptographic verification</p>
            </div>
            <div className="feature">
              <h4>Dark & Light Themes</h4>
              <p>Carefully designed themes for comfortable writing in any lighting condition, with smooth transitions between modes</p>
            </div>
            <div className="feature">
              <h4>Multiple Export Formats</h4>
              <p>Export your documents as HTML, plain text, or other formats. Import existing documents seamlessly</p>
            </div>
            <div className="feature">
              <h4>Offline First</h4>
              <p>Full functionality without internet connection. Sync to blockchain when you're ready</p>
            </div>
            <div className="feature">
              <h4>Privacy Focused</h4>
              <p>No tracking, no cloud dependencies, no subscriptions. Your documents remain yours</p>
            </div>
          </div>
        </section>

        {/* Web Version Section */}
        <section className="web-version-section">
          <h2>Try Before You Download</h2>
          <p className="web-description">
            Experience Bitcoin Writer directly in your browser with no installation required.
            Full functionality, instant access.
          </p>
          <a 
            href="/editor"
            className="web-app-button"
          >
            Launch Web App
          </a>
        </section>

        {/* Release Notes Section */}
        <section className="release-section">
          <h2>Version 1.4.0 Release Notes</h2>
          <div className="release-grid">
            <div className="release-item">All Microsoft Word-style ribbon tabs fully functional</div>
            <div className="release-item">Complete dark/light theme switching system</div>
            <div className="release-item">Enhanced browser menu bar with full keyboard shortcuts</div>
            <div className="release-item">Improved blockchain integration</div>
            <div className="release-item">Better document handling and auto-save</div>
            <div className="release-item">Performance optimizations</div>
          </div>
          
          <div className="github-link">
            <a href="https://github.com/bitcoin-apps-suite/bitcoin-writer" target="_blank" rel="noopener noreferrer">
              View on GitHub →
            </a>
          </div>
        </section>
      </div>
      </div>
    </div>
  );
}