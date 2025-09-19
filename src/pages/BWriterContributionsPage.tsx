// Open BSV License version 5
// Copyright (c) 2025 @b0ase
// This software can only be used on BSV blockchains

import React, { useState, useEffect } from 'react';
import './BWriterContributionsPage.css';

interface Contributor {
  login: string;
  avatar_url: string;
  contributions: number;
  html_url: string;
}

interface TodoItem {
  id: string;
  title: string;
  description: string;
  difficulty: 'easy' | 'medium' | 'hard' | 'expert';
  tokenReward: number; // Percentage of tokens offered
  status: 'open' | 'in-progress' | 'review' | 'completed';
  assignee?: string;
  prNumber?: number;
  category: string;
}

const BWriterContributionsPage: React.FC = () => {
  const [contributors, setContributors] = useState<Contributor[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'contributions' | 'todo' | 'tokenomics'>('contributions');
  
  // Token distribution tracking
  const TOTAL_TOKENS = 100000000; // 100 million tokens
  const [tokenDistribution, setTokenDistribution] = useState({
    allocated: 0,
    reserved: 51, // 51% reserved for core team
    available: 49
  });

  // Todo items for development
  const [todoItems] = useState<TodoItem[]>([
    {
      id: '1',
      title: 'Implement IPFS Storage Option',
      description: 'Add IPFS as an alternative storage backend for documents, with pinning service integration',
      difficulty: 'hard',
      tokenReward: 0.8,
      status: 'open',
      category: 'Storage'
    },
    {
      id: '2',
      title: 'Add Markdown Export',
      description: 'Enable users to export documents as Markdown files with proper formatting',
      difficulty: 'easy',
      tokenReward: 0.3,
      status: 'open',
      category: 'Features'
    },
    {
      id: '3',
      title: 'Implement Collaborative Editing',
      description: 'Add real-time collaborative editing using WebRTC and CRDTs',
      difficulty: 'expert',
      tokenReward: 1.0,
      status: 'open',
      category: 'Features'
    },
    {
      id: '4',
      title: 'Create Mobile App',
      description: 'Build React Native mobile app for iOS and Android with full feature parity',
      difficulty: 'expert',
      tokenReward: 1.0,
      status: 'open',
      category: 'Mobile'
    },
    {
      id: '5',
      title: 'Add Document Templates',
      description: 'Create a template library for common document types (contracts, letters, resumes)',
      difficulty: 'medium',
      tokenReward: 0.5,
      status: 'open',
      category: 'Features'
    },
    {
      id: '6',
      title: 'Implement Version History',
      description: 'Add document version tracking and rollback functionality on-chain',
      difficulty: 'hard',
      tokenReward: 0.7,
      status: 'open',
      category: 'Blockchain'
    },
    {
      id: '7',
      title: 'Add PDF Import',
      description: 'Enable users to import and convert PDF documents for editing',
      difficulty: 'medium',
      tokenReward: 0.6,
      status: 'open',
      category: 'Features'
    },
    {
      id: '8',
      title: 'Create API Documentation',
      description: 'Write comprehensive API documentation with examples and SDK guides',
      difficulty: 'medium',
      tokenReward: 0.4,
      status: 'open',
      category: 'Documentation'
    },
    {
      id: '9',
      title: 'Implement Smart Contract Templates',
      description: 'Create reusable smart contract templates for document agreements',
      difficulty: 'expert',
      tokenReward: 1.0,
      status: 'open',
      category: 'Blockchain'
    },
    {
      id: '10',
      title: 'Add Multi-language Support',
      description: 'Implement i18n for supporting multiple languages in the UI',
      difficulty: 'medium',
      tokenReward: 0.5,
      status: 'open',
      category: 'UI/UX'
    },
    {
      id: '11',
      title: 'Optimize Performance',
      description: 'Improve document loading times and reduce bundle size by 30%',
      difficulty: 'hard',
      tokenReward: 0.7,
      status: 'open',
      category: 'Performance'
    },
    {
      id: '12',
      title: 'Add Voice Dictation',
      description: 'Implement voice-to-text functionality using Web Speech API',
      difficulty: 'medium',
      tokenReward: 0.6,
      status: 'open',
      category: 'Features'
    },
    {
      id: '13',
      title: 'Create Browser Extension',
      description: 'Build Chrome/Firefox extension for quick document creation from any webpage',
      difficulty: 'hard',
      tokenReward: 0.8,
      status: 'open',
      category: 'Extensions'
    },
    {
      id: '14',
      title: 'Implement Document Analytics',
      description: 'Add analytics dashboard for document views, shares, and earnings',
      difficulty: 'medium',
      tokenReward: 0.5,
      status: 'open',
      category: 'Analytics'
    },
    {
      id: '15',
      title: 'Add E-Signature Support',
      description: 'Integrate digital signature functionality with blockchain verification',
      difficulty: 'hard',
      tokenReward: 0.9,
      status: 'open',
      category: 'Blockchain'
    }
  ]);

  useEffect(() => {
    fetchContributors();
    calculateTokenDistribution();
  }, []);

  const fetchContributors = async () => {
    try {
      const response = await fetch('https://api.github.com/repos/bitcoin-apps-suite/bitcoin-writer/contributors');
      if (response.ok) {
        const data = await response.json();
        setContributors(data);
      }
    } catch (error) {
      console.error('Failed to fetch contributors:', error);
    } finally {
      setLoading(false);
    }
  };

  const calculateTokenDistribution = () => {
    const allocatedTokens = todoItems
      .filter(item => item.status === 'completed')
      .reduce((sum, item) => sum + item.tokenReward, 0);
    
    setTokenDistribution({
      allocated: allocatedTokens,
      reserved: 51,
      available: 49 - allocatedTokens
    });
  };

  const getDifficultyColor = (difficulty: TodoItem['difficulty']) => {
    switch (difficulty) {
      case 'easy': return '#4CAF50';
      case 'medium': return '#FF9800';
      case 'hard': return '#F44336';
      case 'expert': return '#9C27B0';
      default: return '#757575';
    }
  };

  const getStatusBadge = (status: TodoItem['status']) => {
    switch (status) {
      case 'open': return '🟢 Open';
      case 'in-progress': return '🟡 In Progress';
      case 'review': return '🔵 In Review';
      case 'completed': return '✅ Completed';
      default: return status;
    }
  };

  return (
    <div className="bwriter-contributions-page">
      <div className="contributions-header">
        <h1>$BWriter Development Hub</h1>
        <p>Contribute to Bitcoin Writer and earn $BWriter tokens</p>
        
        <div className="tab-navigation">
          <button 
            className={`tab-btn ${activeTab === 'contributions' ? 'active' : ''}`}
            onClick={() => setActiveTab('contributions')}
          >
            Contributors
          </button>
          <button 
            className={`tab-btn ${activeTab === 'todo' ? 'active' : ''}`}
            onClick={() => setActiveTab('todo')}
          >
            Development Tasks
          </button>
          <button 
            className={`tab-btn ${activeTab === 'tokenomics' ? 'active' : ''}`}
            onClick={() => setActiveTab('tokenomics')}
          >
            Token Distribution
          </button>
        </div>
      </div>

      {activeTab === 'contributions' && (
        <div className="contributions-content">
          <div className="github-section">
            <h2>GitHub Contributors</h2>
            <div className="repo-link">
              <a 
                href="https://github.com/bitcoin-apps-suite/bitcoin-writer" 
                target="_blank" 
                rel="noopener noreferrer"
                className="github-link"
              >
                <svg className="github-icon" viewBox="0 0 24 24" width="20" height="20">
                  <path fill="currentColor" d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                </svg>
                bitcoin-apps-suite/bitcoin-writer
              </a>
            </div>
            
            {loading ? (
              <div className="loading">Loading contributors...</div>
            ) : (
              <div className="contributors-grid">
                {contributors.map((contributor) => (
                  <div key={contributor.login} className="contributor-card">
                    <img 
                      src={contributor.avatar_url} 
                      alt={contributor.login}
                      className="contributor-avatar"
                    />
                    <div className="contributor-info">
                      <a 
                        href={contributor.html_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="contributor-name"
                      >
                        {contributor.login}
                      </a>
                      <span className="contribution-count">
                        {contributor.contributions} commits
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {activeTab === 'todo' && (
        <div className="todo-content">
          <div className="todo-header">
            <h2>Open Development Tasks</h2>
            <p>Pick a task, submit a PR, and earn $BWriter tokens!</p>
          </div>

          <div className="todo-stats">
            <div className="stat-card">
              <span className="stat-value">{todoItems.filter(item => item.status === 'open').length}</span>
              <span className="stat-label">Open Tasks</span>
            </div>
            <div className="stat-card">
              <span className="stat-value">{todoItems.reduce((sum, item) => sum + item.tokenReward, 0).toFixed(1)}%</span>
              <span className="stat-label">Total Rewards</span>
            </div>
            <div className="stat-card">
              <span className="stat-value">{tokenDistribution.available.toFixed(1)}%</span>
              <span className="stat-label">Tokens Available</span>
            </div>
          </div>

          <div className="todo-list">
            {todoItems.map((item) => (
              <div key={item.id} className="todo-item">
                <div className="todo-header-row">
                  <h3>{item.title}</h3>
                  <div className="todo-meta">
                    <span className="category-badge">{item.category}</span>
                    <span 
                      className="difficulty-badge" 
                      style={{ backgroundColor: getDifficultyColor(item.difficulty) }}
                    >
                      {item.difficulty}
                    </span>
                    <span className="status-badge">{getStatusBadge(item.status)}</span>
                  </div>
                </div>
                <p className="todo-description">{item.description}</p>
                <div className="todo-footer">
                  <div className="token-reward">
                    <span className="reward-label">Token Reward:</span>
                    <span className="reward-value">{item.tokenReward}%</span>
                    <span className="reward-amount">
                      ({(TOTAL_TOKENS * item.tokenReward / 100).toLocaleString()} $BWriter)
                    </span>
                  </div>
                  {item.status === 'open' && (
                    <a 
                      href={`https://github.com/bitcoin-apps-suite/bitcoin-writer/issues/new?title=${encodeURIComponent(item.title)}&body=${encodeURIComponent(`I would like to work on: ${item.title}\n\n${item.description}`)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="claim-btn"
                    >
                      Claim Task
                    </a>
                  )}
                  {item.assignee && (
                    <span className="assignee">Assigned to: {item.assignee}</span>
                  )}
                </div>
              </div>
            ))}
          </div>

          <div className="contribution-guidelines">
            <h3>How to Contribute</h3>
            <ol>
              <li>Choose an open task from the list above</li>
              <li>Click "Claim Task" to create a GitHub issue</li>
              <li>Fork the repository and create a feature branch</li>
              <li>Implement the feature following our coding standards</li>
              <li>Submit a pull request referencing the issue</li>
              <li>Once merged, receive your $BWriter tokens!</li>
            </ol>
            
            <div className="guidelines-note">
              <strong>Note:</strong> All contributions must pass code review and testing. 
              Token rewards are distributed after successful merge to the main branch.
            </div>
          </div>
        </div>
      )}

      {activeTab === 'tokenomics' && (
        <div className="tokenomics-content">
          <h2>$BWriter Token Distribution</h2>
          
          <div className="token-overview">
            <div className="total-supply">
              <h3>Total Supply</h3>
              <div className="supply-value">{TOTAL_TOKENS.toLocaleString()} $BWriter</div>
            </div>
          </div>

          <div className="distribution-chart">
            <div className="distribution-bar">
              <div 
                className="bar-segment reserved" 
                style={{ width: `${tokenDistribution.reserved}%` }}
              >
                <span>Core Team Reserve: {tokenDistribution.reserved}%</span>
              </div>
              <div 
                className="bar-segment allocated" 
                style={{ width: `${tokenDistribution.allocated}%` }}
              >
                <span>Allocated: {tokenDistribution.allocated}%</span>
              </div>
              <div 
                className="bar-segment available" 
                style={{ width: `${tokenDistribution.available}%` }}
              >
                <span>Available: {tokenDistribution.available}%</span>
              </div>
            </div>
          </div>

          <div className="distribution-details">
            <div className="distribution-card">
              <h3>Core Team Reserve</h3>
              <div className="percentage">{tokenDistribution.reserved}%</div>
              <div className="token-amount">
                {(TOTAL_TOKENS * tokenDistribution.reserved / 100).toLocaleString()} tokens
              </div>
              <p>Maintained for platform governance and future development</p>
            </div>

            <div className="distribution-card">
              <h3>Developer Rewards</h3>
              <div className="percentage">{tokenDistribution.allocated}%</div>
              <div className="token-amount">
                {(TOTAL_TOKENS * tokenDistribution.allocated / 100).toLocaleString()} tokens
              </div>
              <p>Already distributed to contributors</p>
            </div>

            <div className="distribution-card">
              <h3>Available for Tasks</h3>
              <div className="percentage">{tokenDistribution.available}%</div>
              <div className="token-amount">
                {(TOTAL_TOKENS * tokenDistribution.available / 100).toLocaleString()} tokens
              </div>
              <p>Ready to be earned by completing development tasks</p>
            </div>
          </div>

          <div className="token-utility">
            <h3>$BWriter Token Utility</h3>
            <ul>
              <li>Governance voting on platform features</li>
              <li>Premium feature access</li>
              <li>Reduced transaction fees</li>
              <li>Revenue sharing from platform fees</li>
              <li>Priority support and beta access</li>
              <li>NFT minting discounts</li>
            </ul>
          </div>

          <div className="vesting-schedule">
            <h3>Vesting Schedule</h3>
            <p>Developer rewards are distributed immediately upon PR merge</p>
            <p>Core team tokens are vested over 24 months with 6-month cliff</p>
          </div>
        </div>
      )}

      <div className="contributions-footer">
        <p>Join our community and help build the future of decentralized document management!</p>
        <div className="social-links">
          <a href="https://x.com/bitcoin_writer" target="_blank" rel="noopener noreferrer">
            Twitter
          </a>
          <a href="https://github.com/bitcoin-apps-suite" target="_blank" rel="noopener noreferrer">
            GitHub
          </a>
          <a href="https://discord.gg/bitcoin-writer" target="_blank" rel="noopener noreferrer">
            Discord
          </a>
        </div>
      </div>
    </div>
  );
};

export default BWriterContributionsPage;