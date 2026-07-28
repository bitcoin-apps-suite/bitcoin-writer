/**
 * Bitcoin Writer - A blockchain-based writing application
 * Copyright © 2025 The Bitcoin Corporation LTD
 * Registered in England and Wales • Company No. 16735102
 *
 * Licensed under the Open BSV License version 5.
 * The Software and any derivative works may only be used on the
 * Bitcoin SV blockchains. See the LICENSE file in the project root
 * for the full license text.
 */

import React from 'react';
import { Github, Twitter, MessageCircle } from 'lucide-react';
import '../Footer.css';

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
            <li><a href="/proof-of-work-paradigm">PoW Paradigm</a></li>
            <li><a href="/docs">Documentation</a></li>
            <li><a href="/signup">Sign Up</a></li>
          </ul>
        </div>

        <div className="footer-section">
          <h4>Community</h4>
          <ul>
            <li>
              <a href="https://github.com/bitcoin-apps-suite/bitcoin-writer" target="_blank" rel="noopener noreferrer" className="social-link">
                <Github size={18} />
                GitHub
              </a>
            </li>
            <li>
              <a href="https://x.com/bitcoin_writer" target="_blank" rel="noopener noreferrer" className="social-link">
                <Twitter size={18} />
                Twitter/X
              </a>
            </li>
            <li>
              <a href="https://discord.gg/xBB8r8dj" target="_blank" rel="noopener noreferrer" className="social-link">
                <MessageCircle size={18} />
                Discord
              </a>
            </li>
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
        <div className="footer-copyright">
          <p>© 2025 The Bitcoin Corporation LTD</p>
          <p>Registered in England and Wales • Company No. 16735102</p>
          <p>Licensed under <a href="/LICENSE.txt" target="_blank" rel="noopener noreferrer">Open BSV License v5</a></p>
          <p>Built on Bitcoin SV blockchain</p>
          <p className="footer-links">
            <a href="/terms">Terms of Service</a>
            <span className="separator">•</span>
            <a href="/privacy">Privacy Policy</a>
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;