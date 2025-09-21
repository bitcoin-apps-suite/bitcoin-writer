// Open BSV License version 5
// Copyright (c) 2025 @b0ase
// This software can only be used on BSV blockchains

import React, { useState, useEffect } from 'react';
import CleanTaskbar from '../components/CleanTaskbar';
import UnifiedAuth from '../components/UnifiedAuth';
import TaskClaimModal from '../components/TaskClaimModal';
import { HandCashService } from '../services/HandCashService';
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
  githubIssueNumber?: number;
}

const BWriterContributionsPage: React.FC = () => {
  const [contributors, setContributors] = useState<Contributor[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Initialize activeTab based on URL hash
  const getInitialTab = () => {
    const hash = window.location.hash.slice(1).toLowerCase();
    if (hash === 'tasks' || hash === 'todo') return 'todo';
    if (hash === 'tokendistribution' || hash === 'tokenomics') return 'tokenomics';
    if (hash === 'contributors' || hash === 'contributions') return 'contributions';
    return 'contributions';
  };
  
  const [activeTab, setActiveTab] = useState<'contributions' | 'todo' | 'tokenomics'>(getInitialTab());
  const [googleUser, setGoogleUser] = useState<any>(null);
  const [isHandCashAuthenticated, setIsHandCashAuthenticated] = useState(false);
  const [currentHandCashUser, setCurrentHandCashUser] = useState<any>(null);
  const [selectedTask, setSelectedTask] = useState<TodoItem | null>(null);
  const [isClaimModalOpen, setIsClaimModalOpen] = useState(false);
  const handcashService = new HandCashService();
  
  // Token distribution tracking
  const TOTAL_TOKENS = 1000000000; // 1 billion tokens
  const [tokenDistribution, setTokenDistribution] = useState({
    allocated: 7.5, // Initial 7.5% allocated to @b0ase for platform creation
    reserved: 0,
    available: 92.5
  });

  // Todo items for development
  const [todoItems] = useState<TodoItem[]>([
    // CRITICAL: Blockchain Infrastructure
    {
      id: '1',
      title: 'Implement Micro-Ordinals Inscription',
      description: 'Replace mock inscription with actual micro-ordinals implementation for document storage on BSV blockchain. Currently using localStorage as a placeholder.',
      difficulty: 'expert',
      tokenReward: 0.5,
      status: 'open',
      category: 'Blockchain',
      githubIssueNumber: 4
    },
    {
      id: '2',
      title: 'UTXO Chain Version Control',
      description: 'Implement SHA-256 hashing to chain documents as UTXOs for blockchain-based version control. This will create an immutable audit trail of document changes.',
      difficulty: 'expert',
      tokenReward: 0.4,
      status: 'open',
      category: 'Blockchain',
      githubIssueNumber: 5
    },
    {
      id: '3',
      title: 'Share Token Creation System',
      description: 'Implement document share tokens as separate inscriptions for granular access control and monetization',
      difficulty: 'hard',
      tokenReward: 0.3,
      status: 'open',
      category: 'Blockchain',
      githubIssueNumber: 6
    },
    
    // Core Editor Features
    {
      id: '4',
      title: 'Document Open/Save/SaveAs Functions',
      description: 'Implement file operations: Open documents from blockchain, Save current work, Save As with new name. Currently marked as TODO in App.tsx',
      difficulty: 'medium',
      tokenReward: 0.2,
      status: 'open',
      category: 'Core Feature',
      githubIssueNumber: 7
    },
    {
      id: '5',
      title: 'Document Encryption/Decryption',
      description: 'Implement client-side AES encryption and decryption for documents before blockchain storage. Critical for privacy.',
      difficulty: 'hard',
      tokenReward: 0.25,
      status: 'open',
      category: 'Security',
      githubIssueNumber: 8
    },
    {
      id: '6',
      title: 'Document Publishing Pipeline',
      description: 'Build complete publishing flow from draft to blockchain-inscribed final document with metadata',
      difficulty: 'hard',
      tokenReward: 0.25,
      status: 'open',
      category: 'Core Feature',
      githubIssueNumber: 9
    },
    
    // Monetization Features
    {
      id: '7',
      title: 'Paywall System Implementation',
      description: 'Create paywall functionality for monetizing documents with BSV micropayments. Enable creators to earn from their content.',
      difficulty: 'hard',
      tokenReward: 0.3,
      status: 'open',
      category: 'Monetization',
      githubIssueNumber: 10
    },
    {
      id: '8',
      title: 'Document Tokenization Logic',
      description: 'Implement actual tokenization logic in DocumentEditor.tsx to create tradeable document shares',
      difficulty: 'hard',
      tokenReward: 0.25,
      status: 'open',
      category: 'Monetization',
      githubIssueNumber: 11
    },
    {
      id: '9',
      title: 'Real BSV Price Feed Integration',
      description: 'Replace mock pricing (currently returns $30) with CoinGecko or similar API for real-time BSV/USD rates',
      difficulty: 'easy',
      tokenReward: 0.1,
      status: 'open',
      category: 'Integration',
      githubIssueNumber: 12
    },
    
    // Exchange & Trading Features
    {
      id: '10',
      title: 'Bitcoin Writer Exchange',
      description: 'Build decentralized exchange for trading document shares and NFTs with order book and liquidity pools',
      difficulty: 'expert',
      tokenReward: 0.5,
      status: 'open',
      category: 'Exchange',
      githubIssueNumber: 13
    },
    {
      id: '11',
      title: 'Document NFT Marketplace',
      description: 'Create marketplace for buying/selling document NFTs with royalty distribution',
      difficulty: 'hard',
      tokenReward: 0.3,
      status: 'open',
      category: 'Marketplace',
      githubIssueNumber: 14
    },
    
    // AI Integration (Already partially implemented)
    {
      id: '12',
      title: 'Enhance AI Assistant',
      description: 'Improve AI chat with document context awareness, auto-suggestions, and writing style learning',
      difficulty: 'medium',
      tokenReward: 0.2,
      status: 'in-progress',
      category: 'AI',
      githubIssueNumber: 15
    },
    {
      id: '13',
      title: 'AI Model Fine-tuning',
      description: 'Fine-tune language models for specific writing tasks and document types',
      difficulty: 'hard',
      tokenReward: 0.25,
      status: 'open',
      category: 'AI',
      githubIssueNumber: 16
    },
    
    // Collaboration Features
    {
      id: '14',
      title: 'Real-time Collaborative Editing',
      description: 'Add real-time collaborative editing using WebRTC and CRDTs for multiple users',
      difficulty: 'expert',
      tokenReward: 0.35,
      status: 'open',
      category: 'Collaboration',
      githubIssueNumber: 17
    },
    {
      id: '15',
      title: 'Comment & Review System',
      description: 'Implement commenting, suggestions, and review workflow for documents',
      difficulty: 'medium',
      tokenReward: 0.2,
      status: 'open',
      category: 'Collaboration',
      githubIssueNumber: 18
    },
    
    // Storage & Performance
    {
      id: '16',
      title: 'IPFS Storage Integration',
      description: 'Add IPFS as an alternative storage backend for documents, with pinning service integration',
      difficulty: 'hard',
      tokenReward: 0.2,
      status: 'open',
      category: 'Storage',
      githubIssueNumber: 19
    },
    {
      id: '17',
      title: 'Optimize Performance',
      description: 'Improve document loading times, reduce bundle size by 30%, implement code splitting',
      difficulty: 'hard',
      tokenReward: 0.175,
      status: 'open',
      category: 'Performance',
      githubIssueNumber: 20
    },
    
    // Import/Export Features
    {
      id: '18',
      title: 'Markdown Import/Export',
      description: 'Enable users to import and export documents as Markdown files with proper formatting',
      difficulty: 'easy',
      tokenReward: 0.075,
      status: 'open',
      category: 'Features',
      githubIssueNumber: 21
    },
    {
      id: '19',
      title: 'PDF Import/Export',
      description: 'Enable users to import PDF documents for editing and export as PDF',
      difficulty: 'medium',
      tokenReward: 0.15,
      status: 'open',
      category: 'Features',
      githubIssueNumber: 22
    },
    {
      id: '20',
      title: 'MS Word Import/Export',
      description: 'Add support for .docx file import and export with formatting preservation',
      difficulty: 'hard',
      tokenReward: 0.2,
      status: 'open',
      category: 'Features',
      githubIssueNumber: 23
    },
    
    // Mobile & Extensions
    {
      id: '21',
      title: 'React Native Mobile App',
      description: 'Build React Native mobile app for iOS and Android with full feature parity',
      difficulty: 'expert',
      tokenReward: 0.4,
      status: 'open',
      category: 'Mobile',
      githubIssueNumber: 24
    },
    {
      id: '22',
      title: 'Browser Extension',
      description: 'Build Chrome/Firefox extension for quick document creation and web clipping',
      difficulty: 'hard',
      tokenReward: 0.2,
      status: 'open',
      category: 'Extensions',
      githubIssueNumber: 25
    },
    
    // Templates & Productivity
    {
      id: '23',
      title: 'Document Template Library',
      description: 'Create template library for contracts, letters, resumes, invoices, and more',
      difficulty: 'medium',
      tokenReward: 0.125,
      status: 'open',
      category: 'Features',
      githubIssueNumber: 26
    },
    {
      id: '24',
      title: 'Smart Contract Templates',
      description: 'Create reusable smart contract templates for document agreements and escrow',
      difficulty: 'expert',
      tokenReward: 0.25,
      status: 'open',
      category: 'Blockchain',
      githubIssueNumber: 27
    },
    
    // Analytics & Insights
    {
      id: '25',
      title: 'Document Analytics Dashboard',
      description: 'Add analytics for document views, shares, earnings, and reader engagement',
      difficulty: 'medium',
      tokenReward: 0.125,
      status: 'open',
      category: 'Analytics',
      githubIssueNumber: 28
    },
    {
      id: '26',
      title: 'Writing Analytics',
      description: 'Track writing productivity, word count goals, and writing streaks',
      difficulty: 'easy',
      tokenReward: 0.1,
      status: 'open',
      category: 'Analytics',
      githubIssueNumber: 29
    },
    
    // Accessibility & Localization
    {
      id: '27',
      title: 'Multi-language Support (i18n)',
      description: 'Implement internationalization for UI in Spanish, Chinese, Japanese, French, German',
      difficulty: 'medium',
      tokenReward: 0.125,
      status: 'open',
      category: 'UI/UX',
      githubIssueNumber: 30
    },
    {
      id: '28',
      title: 'Accessibility Improvements',
      description: 'Ensure WCAG 2.1 AA compliance, screen reader support, keyboard navigation',
      difficulty: 'medium',
      tokenReward: 0.15,
      status: 'open',
      category: 'UI/UX',
      githubIssueNumber: 31
    },
    
    // Advanced Features
    {
      id: '29',
      title: 'Voice Dictation & Commands',
      description: 'Implement voice-to-text and voice commands using Web Speech API',
      difficulty: 'medium',
      tokenReward: 0.15,
      status: 'open',
      category: 'Features',
      githubIssueNumber: 32
    },
    {
      id: '30',
      title: 'E-Signature Integration',
      description: 'Add legally binding e-signature functionality with blockchain verification',
      difficulty: 'hard',
      tokenReward: 0.225,
      status: 'open',
      category: 'Blockchain',
      githubIssueNumber: 33
    },
    {
      id: '31',
      title: 'Version Control UI',
      description: 'Build UI for document version history, diffs, and rollback functionality',
      difficulty: 'medium',
      tokenReward: 0.175,
      status: 'open',
      category: 'UI/UX',
      githubIssueNumber: 34
    },
    
    // Documentation & Testing
    {
      id: '32',
      title: 'API Documentation',
      description: 'Write comprehensive API documentation with OpenAPI spec and SDK guides',
      difficulty: 'medium',
      tokenReward: 0.1,
      status: 'open',
      category: 'Documentation',
      githubIssueNumber: 35
    },
    {
      id: '33',
      title: 'End-to-End Testing Suite',
      description: 'Implement Cypress E2E tests for critical user flows',
      difficulty: 'medium',
      tokenReward: 0.15,
      status: 'open',
      category: 'Testing',
      githubIssueNumber: 36
    },
    {
      id: '34',
      title: 'Unit Test Coverage',
      description: 'Achieve 80% unit test coverage with Jest and React Testing Library',
      difficulty: 'medium',
      tokenReward: 0.125,
      status: 'open',
      category: 'Testing',
      githubIssueNumber: 37
    },
    
    // Security
    {
      id: '35',
      title: 'Security Audit',
      description: 'Conduct comprehensive security audit and implement recommendations',
      difficulty: 'hard',
      tokenReward: 0.2,
      status: 'open',
      category: 'Security',
      githubIssueNumber: 38
    },
    {
      id: '36',
      title: 'Two-Factor Authentication',
      description: 'Add 2FA support for enhanced account security',
      difficulty: 'medium',
      tokenReward: 0.15,
      status: 'open',
      category: 'Security',
      githubIssueNumber: 39
    }
  ]);

  useEffect(() => {
    fetchContributors();
    calculateTokenDistribution();
    
    // Listen for hash changes
    const handleHashChange = () => {
      const hash = window.location.hash.slice(1).toLowerCase();
      if (hash === 'tasks' || hash === 'todo') {
        setActiveTab('todo');
      } else if (hash === 'tokendistribution' || hash === 'tokenomics') {
        setActiveTab('tokenomics');
      } else if (hash === 'contributors' || hash === 'contributions') {
        setActiveTab('contributions');
      }
    };
    
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
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
    const foundersAllocation = 7.5; // @b0ase initial platform development
    
    const allocatedToTasks = todoItems
      .filter(item => item.status === 'completed')
      .reduce((sum, item) => sum + item.tokenReward, 0);
    
    const availableInTasks = todoItems
      .filter(item => item.status === 'open' || item.status === 'in-progress')
      .reduce((sum, item) => sum + item.tokenReward, 0);
    
    const totalAllocated = foundersAllocation + allocatedToTasks;
    const totalAvailable = 100 - totalAllocated;
    const unallocatedReserve = totalAvailable - availableInTasks;
    
    setTokenDistribution({
      allocated: totalAllocated,
      reserved: unallocatedReserve > 0 ? unallocatedReserve : 0,
      available: availableInTasks
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

  const handleClaimTask = (task: TodoItem) => {
    setSelectedTask(task);
    setIsClaimModalOpen(true);
  };

  const handleTaskClaimed = (taskId: string) => {
    // Update task status to in-progress
    console.log(`Task ${taskId} has been claimed`);
    // In a real app, you'd update the task status in your state/database
  };

  return (
    <div className="App">
      <div className="bwriter-contributions-page">
      <div className="contributions-header">
        <h1>$BWriter Development Hub</h1>
        <p>Contribute to Bitcoin Writer and earn $BWriter tokens</p>
        
        <div className="tab-navigation">
          <button 
            className={`tab-btn ${activeTab === 'contributions' ? 'active' : ''}`}
            onClick={() => {
              setActiveTab('contributions');
              window.location.hash = 'contributors';
            }}
          >
            Contributors
          </button>
          <button 
            className={`tab-btn ${activeTab === 'todo' ? 'active' : ''}`}
            onClick={() => {
              setActiveTab('todo');
              window.location.hash = 'tasks';
            }}
          >
            Development Tasks
          </button>
          <button 
            className={`tab-btn ${activeTab === 'tokenomics' ? 'active' : ''}`}
            onClick={() => {
              setActiveTab('tokenomics');
              window.location.hash = 'tokenDistribution';
            }}
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
                {/* Founder Contribution */}
                <div className="contributor-card" style={{ border: '2px solid #F7931E', background: 'rgba(247, 147, 30, 0.05)' }}>
                  <img 
                    src="https://github.com/b0ase.png" 
                    alt="b0ase"
                    className="contributor-avatar"
                  />
                  <div className="contributor-info">
                    <a 
                      href="https://github.com/b0ase"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="contributor-name"
                    >
                      @b0ase
                    </a>
                    <span className="contribution-count">
                      117 commits • Founder
                    </span>
                    <span className="token-allocation" style={{ color: '#F7931E', fontWeight: 'bold', marginTop: '4px', display: 'block', fontSize: '12px' }}>
                      7.5% tokens earned (75M $BWRITER)
                    </span>
                  </div>
                </div>
                
                {/* Other Contributors */}
                {contributors
                  .filter(c => c.login !== 'b0ase' && c.login !== 'Richard Boase')
                  .map((contributor) => (
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
              <span className="stat-value">{(100 - tokenDistribution.allocated).toFixed(1)}%</span>
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
                    <button 
                      onClick={() => handleClaimTask(item)}
                      className="claim-btn"
                    >
                      Claim Task
                    </button>
                  )}
                  {item.githubIssueNumber && (
                    <a 
                      href={`https://github.com/bitcoin-apps-suite/bitcoin-writer/issues/${item.githubIssueNumber}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="github-issue-btn"
                    >
                      View Issue #{item.githubIssueNumber}
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
              {tokenDistribution.allocated > 0 && (
                <div 
                  className="bar-segment allocated" 
                  style={{ width: `${tokenDistribution.allocated}%` }}
                  title={`Distributed to Contributors: ${tokenDistribution.allocated}%`}
                >
                  <span>Distributed: {tokenDistribution.allocated}%</span>
                </div>
              )}
              {tokenDistribution.available > 0 && (
                <div 
                  className="bar-segment available" 
                  style={{ width: `${tokenDistribution.available}%` }}
                  title={`Available for Tasks: ${tokenDistribution.available}%`}
                >
                  <span>Available: {tokenDistribution.available}%</span>
                </div>
              )}
              {tokenDistribution.reserved > 0 && (
                <div 
                  className="bar-segment reserved" 
                  style={{ width: `${tokenDistribution.reserved}%` }}
                  title={`Unallocated Reserve: ${tokenDistribution.reserved}%`}
                >
                  <span>Unallocated: {tokenDistribution.reserved}%</span>
                </div>
              )}
            </div>
          </div>

          <div className="distribution-details">
            {tokenDistribution.allocated > 0 && (
              <div className="distribution-card">
                <h3>Already Distributed</h3>
                <div className="percentage">{tokenDistribution.allocated.toFixed(1)}%</div>
                <div className="token-amount">
                  {(TOTAL_TOKENS * tokenDistribution.allocated / 100).toLocaleString()} tokens
                </div>
                <p>Earned by contributors • 7.5% to @b0ase (founder)</p>
              </div>
            )}

            {tokenDistribution.available > 0 && (
              <div className="distribution-card">
                <h3>Available for Tasks</h3>
                <div className="percentage">{tokenDistribution.available.toFixed(1)}%</div>
                <div className="token-amount">
                  {(TOTAL_TOKENS * tokenDistribution.available / 100).toLocaleString()} tokens
                </div>
                <p>Ready to be earned by completing open development tasks</p>
              </div>
            )}

            {tokenDistribution.reserved > 0 && (
              <div className="distribution-card">
                <h3>Unallocated Reserve</h3>
                <div className="percentage">{tokenDistribution.reserved.toFixed(1)}%</div>
                <div className="token-amount">
                  {(TOTAL_TOKENS * tokenDistribution.reserved / 100).toLocaleString()} tokens
                </div>
                <p>Available for future tasks, partnerships, and ecosystem growth</p>
              </div>
            )}
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
            <h3>Token Distribution Model</h3>
            <p>All tokens are allocated dynamically based on actual contributions</p>
            <p>Developer rewards are distributed immediately upon PR merge</p>
            <p>No fixed allocations - 100% merit-based distribution</p>
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
          <a href="https://discord.gg/xBB8r8dj" target="_blank" rel="noopener noreferrer">
            Discord
          </a>
        </div>
      </div>
      </div>

      {/* Task Claim Modal */}
      {selectedTask && (
        <TaskClaimModal
          isOpen={isClaimModalOpen}
          onClose={() => {
            setIsClaimModalOpen(false);
            setSelectedTask(null);
          }}
          task={selectedTask}
          onTaskClaimed={handleTaskClaimed}
        />
      )}
    </div>
  );
};

export default BWriterContributionsPage;