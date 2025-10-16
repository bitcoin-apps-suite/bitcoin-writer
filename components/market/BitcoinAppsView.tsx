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
      url: 'https://bitcoin-drive.vercel.app',
      color: '#22c55e',
      icon: '💾'
    },
    {
      name: 'Bitcoin Spreadsheets',
      description: 'Blockchain-based spreadsheet application. Create, calculate, and collaborate with data integrity guarantees.',
      url: 'https://bitcoin-sheets.vercel.app',
      color: '#3b82f6',
      icon: '📊'
    },
    {
      name: 'Bitcoin Writer',
      description: 'Write, encrypt, and store documents on Bitcoin. Set paywalls, multisig conditions, and timelock access.',
      url: 'https://bitcoin-writer.vercel.app',
      color: '#ff9500',
      icon: '✍️'
    }
  ];

  const comingSoonApps = [
    { name: 'Bitcoin Auth', description: 'Decentralized authentication system', icon: '🔐' },
    { name: 'Bitcoin Chat', description: 'Decentralized messaging platform', icon: '💬' },
    { name: 'Bitcoin Domains', description: 'Blockchain domain name system', icon: '🌐' },
    { name: 'Bitcoin Draw', description: 'Vector graphics and design tools', icon: '✏️' },
    { name: 'Bitcoin Email', description: 'Encrypted email service with Bitcoin-powered features', icon: '📧' },
    { name: 'Bitcoin Exchange', description: 'Decentralized document marketplace', icon: '📈' },
    { name: 'Bitcoin Music', description: 'Decentralized music streaming', icon: '🎵' },
    { name: 'Bitcoin Paint', description: 'Digital art creation platform', icon: '🎨' },
    { name: 'Bitcoin Pics', description: 'Image storage and sharing', icon: '📸' },
    { name: 'Bitcoin Registry', description: 'Decentralized asset registry', icon: '📋' },
    { name: 'Bitcoin Shares', description: 'Digital equity platform', icon: '📜' },
    { name: 'Bitcoin Video', description: 'Video streaming and storage', icon: '🎬' },
    { name: 'Bitcoin Wallet', description: 'Secure Bitcoin SV wallet', icon: '👛' }
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
              <a href="https://bitcoin-drive.vercel.app" target="_blank" rel="noopener noreferrer">
                Bitcoin Drive
              </a>
              <a href="https://bitcoin-sheets.vercel.app" target="_blank" rel="noopener noreferrer">
                Bitcoin Sheets
              </a>
              <a href="https://bitcoin-writer.vercel.app" target="_blank" rel="noopener noreferrer">
                Bitcoin Writer
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