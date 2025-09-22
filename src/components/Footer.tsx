// Open BSV License version 5
// Copyright © 2025 The Bitcoin Corporation LTD
// Registered in England and Wales • Company No. 16735102
// This software can only be used on BSV blockchains

import React from 'react';
import './Footer.css';

const Footer: React.FC = () => {
  return (
    <footer className="app-footer">
      <div className="footer-content">
        <div className="footer-section">
          <div className="footer-logo">
            <span className="bitcoin-symbol">₿</span>
            <span className="app-name">Writer</span>
          </div>
          <p className="footer-tagline">
            Decentralized document writing on Bitcoin SV
          </p>
        </div>

        <div className="footer-section">
          <h4>Platform</h4>
          <ul>
            <li><a href="/platform">About</a></li>
            <li><a href="/features">Features</a></li>
            <li><a href="/docs">Documentation</a></li>
            <li><a href="/signup">Sign Up</a></li>
          </ul>
        </div>

        <div className="footer-section">
          <h4>Community</h4>
          <ul>
            <li><a href="https://github.com/bitcoin-apps-suite/bitcoin-writer" target="_blank" rel="noopener noreferrer">GitHub</a></li>
            <li><a href="https://twitter.com/bitcoin_writer" target="_blank" rel="noopener noreferrer">Twitter</a></li>
            <li><a href="https://discord.gg/xBB8r8dj" target="_blank" rel="noopener noreferrer">Discord</a></li>
            <li><a href="/token">$BWRITER Token</a></li>
          </ul>
        </div>

        <div className="footer-section">
          <h4>Developers</h4>
          <ul>
            <li><a href="http://localhost:2010/contributions#tasks">Jobs</a></li>
            <li><a href="/contracts">Contracts</a></li>
            <li><a href="https://github.com/bitcoin-apps-suite/bitcoin-writer/issues" target="_blank" rel="noopener noreferrer">Issues</a></li>
            <li><a href="/bap">Bitcoin App Protocol</a></li>
          </ul>
        </div>
      </div>

      <div className="footer-bottom">
        <div className="footer-legal">
          <p>© 2025 The Bitcoin Corporation LTD</p>
          <p>Registered in England and Wales • Company No. 16735102</p>
        </div>
        <div className="footer-license">
          <p>Licensed under <a href="/LICENSE" target="_blank" rel="noopener noreferrer">Open BSV License v5</a></p>
          <p>Built on Bitcoin SV blockchain</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;