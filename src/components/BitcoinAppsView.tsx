import React from 'react';
import './BitcoinAppsView.css';

interface BitcoinAppsViewProps {
  isOpen: boolean;
  onClose: () => void;
}

const BitcoinAppsView: React.FC<BitcoinAppsViewProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const liveApps = [
    {
      name: 'Bitcoin Drive',
      description: 'Decentralized cloud storage with blockchain security. Store, sync, and share files on the Bitcoin network.',
      url: 'https://drive.bitcoin.com',
      color: '#22c55e',
      icon: '💾'
    },
    {
      name: 'Bitcoin Email',
      description: 'Encrypted email service with Bitcoin-powered features. Send, receive, and secure communications on-chain.',
      url: 'https://mail.bitcoin.com',
      color: '#06b6d4',
      icon: '📧'
    },
    {
      name: 'Bitcoin Spreadsheets',
      description: 'Blockchain-based spreadsheet application. Create, calculate, and collaborate with data integrity guarantees.',
      url: 'https://sheets.bitcoin.com',
      color: '#3b82f6',
      icon: '📊'
    },
    {
      name: 'Bitcoin Exchange',
      description: 'Decentralized document marketplace. Trade, buy, and sell digital content with transparent pricing.',
      url: 'https://exchange.bitcoin.com',
      color: '#8b5cf6',
      icon: '📈'
    },
    {
      name: 'Bitcoin Wallet',
      description: 'Secure Bitcoin SV wallet with advanced features. Manage your coins, NFTs, and digital assets seamlessly.',
      url: 'https://wallet.bitcoin.com',
      color: '#f59e0b',
      icon: '👛'
    },
    {
      name: 'Bitcoin Auth',
      description: 'Decentralized authentication system. Secure identity management powered by blockchain technology.',
      url: 'https://auth.bitcoin.com',
      color: '#ef4444',
      icon: '🔐'
    }
  ];

  const comingSoonApps = [
    { name: 'Bitcoin Chat', description: 'Decentralized messaging platform', icon: '💬' },
    { name: 'Bitcoin Domains', description: 'Blockchain domain name system', icon: '🌐' },
    { name: 'Bitcoin Draw', description: 'Vector graphics and design tools', icon: '✏️' },
    { name: 'Bitcoin Music', description: 'Decentralized music streaming', icon: '🎵' },
    { name: 'Bitcoin Paint', description: 'Digital art creation platform', icon: '🎨' },
    { name: 'Bitcoin Pics', description: 'Image storage and sharing', icon: '📸' },
    { name: 'Bitcoin Registry', description: 'Decentralized asset registry', icon: '📋' },
    { name: 'Bitcoin Shares', description: 'Digital equity platform', icon: '📜' },
    { name: 'Bitcoin Video', description: 'Video streaming and storage', icon: '🎬' }
  ];

  return (
    <div className="bitcoin-apps-view">
      <div className="bitcoin-apps-header">
        <h1>🌐 Bitcoin Apps Suite</h1>
        <button className="apps-close" onClick={onClose} title="Close Bitcoin Apps">
          ×
        </button>
      </div>

      <div className="bitcoin-apps-content">
        <div className="welcome-section">
          <p>
            Welcome to the Bitcoin Apps ecosystem! Explore our comprehensive suite of 
            decentralized applications built on Bitcoin SV. Each app leverages the power 
            of blockchain technology to provide secure, scalable, and innovative solutions.
          </p>
        </div>

        <div className="apps-section">
          <h2>📱 Available Apps</h2>
          <div className="apps-grid">
            {liveApps.map((app, index) => (
              <div key={index} className="app-card live-app" style={{ borderLeftColor: app.color }}>
                <div className="app-header">
                  <span className="app-icon">{app.icon}</span>
                  <h3 className="app-name">₿ {app.name}</h3>
                  <span className="app-status live">LIVE</span>
                </div>
                <p className="app-description">{app.description}</p>
                <div className="app-actions">
                  <a 
                    href={app.url} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="app-launch-btn"
                    style={{ backgroundColor: app.color }}
                  >
                    Launch App
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="apps-section">
          <h2>🚀 Coming Soon</h2>
          <div className="apps-grid coming-soon">
            {comingSoonApps.map((app, index) => (
              <div key={index} className="app-card coming-soon-app">
                <div className="app-header">
                  <span className="app-icon">{app.icon}</span>
                  <h3 className="app-name">₿ {app.name}</h3>
                  <span className="app-status coming-soon">COMING SOON</span>
                </div>
                <p className="app-description">{app.description}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="ecosystem-footer">
          <div className="footer-content">
            <h3>🔗 The Bitcoin Ecosystem</h3>
            <p>
              All Bitcoin Apps are built on Bitcoin SV, the original Bitcoin protocol that scales 
              without limits. Experience true peer-to-peer electronic cash with unlimited potential.
            </p>
            <div className="footer-links">
              <a href="https://bitcoinsv.com" target="_blank" rel="noopener noreferrer">
                Learn about Bitcoin SV
              </a>
              <a href="https://handcash.io" target="_blank" rel="noopener noreferrer">
                HandCash Wallet
              </a>
              <a href="https://docs.bsvblockchain.org" target="_blank" rel="noopener noreferrer">
                Developer Docs
              </a>
            </div>
            <p className="built-with">
              Built with ❤️ on Bitcoin SV | <strong>Scaling today, for tomorrow</strong>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BitcoinAppsView;