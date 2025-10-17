'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import './contracts.css';

interface Contract {
  id: string;
  githubIssueNumber: number;
  githubIssueUrl: string;
  title: string;
  description: string;
  reward: string;
  estimatedHours: number;
  priority: 'Critical' | 'High' | 'Medium' | 'Low';
  status: 'available' | 'claimed' | 'in_progress' | 'submitted' | 'completed' | 'expired';
  category: 'developer' | 'writing';
  assignee?: {
    githubUsername: string;
    handcashHandle?: string;
    claimedAt: string;
    deadline: string;
  };
  pullRequest?: {
    number: number;
    url: string;
    status: 'open' | 'closed' | 'merged';
  };
  skills: string[];
  deliverables: string[];
}

const ContractsPage: React.FC = () => {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [devSidebarCollapsed, setDevSidebarCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [contracts, setContracts] = useState<Contract[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedContract, setSelectedContract] = useState<Contract | null>(null);
  const [showClaimModal, setShowClaimModal] = useState(false);
  const [activeTab, setActiveTab] = useState<'developer' | 'writing'>('developer');
  
  const [claimForm, setClaimForm] = useState({
    githubUsername: '',
    handcashHandle: '',
    estimatedDays: 7
  });

  useEffect(() => {
    setMounted(true);
    
    const saved = localStorage.getItem('devSidebarCollapsed');
    setDevSidebarCollapsed(saved === 'true');
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

    // Load sample contracts
    loadSampleContracts();
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('resize', handleResize);
      clearInterval(checkSidebarState);
    };
  }, []);

  const loadSampleContracts = () => {
    const sampleContracts: Contract[] = [
      {
        id: 'contract-47',
        githubIssueNumber: 47,
        githubIssueUrl: 'https://github.com/bitcoin-apps-suite/bitcoin-writer/issues/47',
        title: '🟠 Implement MAIP (Multi-Authoring in Public) Foundation',
        description: 'Revolutionary collaborative writing system where multiple authors work together in real-time on the blockchain, with every contribution tracked and rewarded through micropayments.',
        reward: '8,000 BWRITER (0.8%)',
        estimatedHours: 320, // 8 weeks * 40 hours
        priority: 'High',
        status: 'available',
        category: 'developer',
        skills: ['TypeScript', 'React', 'Real-time collaboration', 'BSV Blockchain', 'AI Integration', 'Smart Contracts'],
        deliverables: ['Collaborative infrastructure', 'AI valuation system', 'Payment automation', 'Public collaboration features']
      },
      {
        id: 'contract-45',
        githubIssueNumber: 45,
        githubIssueUrl: 'https://github.com/bitcoin-apps-suite/bitcoin-writer/issues/45',
        title: '🔴 Enhance Document Persistence - Users Cannot Access Published Documents',
        description: 'Users cannot see their published documents when they log back into Bitcoin Writer. Need to implement proper document persistence across sessions.',
        reward: '3,000 BWRITER (0.3%)',
        estimatedHours: 24,
        priority: 'Critical',
        status: 'available',
        category: 'developer',
        skills: ['TypeScript', 'LocalStorage', 'Blockchain Storage', 'Document Management'],
        deliverables: ['Enhanced document retrieval', 'Cross-session persistence', 'UI indicators', 'Sync functionality']
      },
      {
        id: 'contract-44',
        githubIssueNumber: 44,
        githubIssueUrl: 'https://github.com/bitcoin-apps-suite/bitcoin-writer/issues/44',
        title: 'Replace deprecated execCommand with modern alternatives',
        description: 'Replace all deprecated document.execCommand calls with modern alternatives for better browser support and future compatibility.',
        reward: '1,500 BWRITER (0.15%)',
        estimatedHours: 16,
        priority: 'Medium',
        status: 'available',
        category: 'developer',
        skills: ['JavaScript', 'DOM APIs', 'Browser Compatibility', 'Text Editing'],
        deliverables: ['Modern API implementation', 'Browser testing', 'Backward compatibility', 'Documentation']
      },
      {
        id: 'contract-43',
        githubIssueNumber: 43,
        githubIssueUrl: 'https://github.com/bitcoin-apps-suite/bitcoin-writer/issues/43',
        title: 'Implement Google Drive OAuth Integration',
        description: 'Enable users to save and load documents directly from their Google Drive, providing seamless cloud storage integration alongside blockchain storage.',
        reward: '2,000 BWRITER (0.2%)',
        estimatedHours: 20,
        priority: 'Medium',
        status: 'available',
        category: 'developer',
        skills: ['OAuth 2.0', 'Google Drive API', 'Cloud Storage', 'File Management'],
        deliverables: ['OAuth authentication flow', 'Google Drive API integration', 'File picker UI', 'Save/Load functionality']
      },
      {
        id: 'contract-3',
        githubIssueNumber: 125,
        githubIssueUrl: 'https://github.com/bitcoin-apps-suite/bitcoin-writer/issues/125',
        title: 'Smart Contract Audit and Security Review',
        description: 'Conduct thorough security audit of smart contracts and provide detailed report with recommendations.',
        reward: '8,000 BWRITER',
        estimatedHours: 24,
        priority: 'Critical',
        status: 'in_progress',
        category: 'developer',
        assignee: {
          githubUsername: 'security_expert',
          handcashHandle: '$securitydev',
          claimedAt: '2024-01-15T10:00:00Z',
          deadline: '2024-02-15T10:00:00Z'
        },
        skills: ['Smart Contracts', 'Security Audit', 'BSV', 'Solidity'],
        deliverables: ['Security audit report', 'Vulnerability assessment', 'Remediation plan']
      },
      {
        id: 'contract-4',
        githubIssueNumber: 126,
        githubIssueUrl: 'https://github.com/bitcoin-apps-suite/bitcoin-writer/issues/126',
        title: 'Bitcoin Writer Platform Overview Article',
        description: 'Write an engaging article explaining the Bitcoin Writer platform, its features, and benefits for new users.',
        reward: '2,000 BWRITER',
        estimatedHours: 8,
        priority: 'Medium',
        status: 'available',
        category: 'writing',
        skills: ['Content Writing', 'Bitcoin', 'Platform Documentation'],
        deliverables: ['Platform overview article', 'Feature descriptions', 'User benefits section']
      },
      {
        id: 'contract-5',
        githubIssueNumber: 127,
        githubIssueUrl: 'https://github.com/bitcoin-apps-suite/bitcoin-writer/issues/127',
        title: 'Mobile App UI Enhancement',
        description: 'Improve mobile user interface with responsive design and better touch interactions.',
        reward: '4,500 BWRITER',
        estimatedHours: 18,
        priority: 'High',
        status: 'submitted',
        category: 'developer',
        assignee: {
          githubUsername: 'ui_designer',
          handcashHandle: '$designer',
          claimedAt: '2024-01-10T14:00:00Z',
          deadline: '2024-02-10T14:00:00Z'
        },
        pullRequest: {
          number: 89,
          url: 'https://github.com/bitcoin-apps-suite/bitcoin-writer/pull/89',
          status: 'open'
        },
        skills: ['React Native', 'UI/UX Design', 'Mobile Development'],
        deliverables: ['Responsive design', 'Touch interactions', 'Mobile optimization']
      }
    ];

    setContracts(sampleContracts);
    setLoading(false);
  };

  const handleClaimContract = async () => {
    if (!selectedContract || !claimForm.githubUsername || !claimForm.handcashHandle) {
      alert('Please fill in all required fields');
      return;
    }
    
    const deadline = new Date();
    deadline.setDate(deadline.getDate() + claimForm.estimatedDays);
    
    const contractClaim = {
      assignee: {
        githubUsername: claimForm.githubUsername,
        handcashHandle: claimForm.handcashHandle,
        claimedAt: new Date().toISOString(),
        deadline: deadline.toISOString()
      }
    };
    
    const updatedContracts = contracts.map(c => 
      c.id === selectedContract.id 
        ? { ...c, status: 'claimed' as Contract['status'], assignee: contractClaim.assignee }
        : c
    );
    setContracts(updatedContracts);
    
    setShowClaimModal(false);
    setSelectedContract(null);
    
    alert(`Contract claimed successfully! You have ${claimForm.estimatedDays} days to complete this task.`);
  };

  const getStatusColor = (status: Contract['status']) => {
    switch (status) {
      case 'available': return '#22c55e';
      case 'claimed': return '#f59e0b';
      case 'in_progress': return '#3b82f6';
      case 'submitted': return '#8b5cf6';
      case 'completed': return '#6b7280';
      case 'expired': return '#ef4444';
      default: return '#6b7280';
    }
  };

  const getTimeRemaining = (deadline: string) => {
    const now = new Date();
    const end = new Date(deadline);
    const diff = end.getTime() - now.getTime();
    
    if (diff <= 0) return 'Expired';
    
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    
    if (days > 0) return `${days} days remaining`;
    if (hours > 0) return `${hours} hours remaining`;
    return 'Less than 1 hour';
  };

  const filteredContracts = contracts.filter(c => c.category === activeTab);

  return (
    <div className="app-wrapper">
      <div className={`contracts-page ${mounted && !isMobile && !devSidebarCollapsed ? 'with-sidebar-expanded' : ''} ${mounted && !isMobile && devSidebarCollapsed ? 'with-sidebar-collapsed' : ''}`}>
        <div className="contracts-container">
          {/* Hero Section */}
          <section className="contracts-hero">
            <h1><span style={{color: '#f7931a'}}>Bitcoin Writer</span> <span style={{color: '#ffffff'}}>Contracts</span></h1>
            <p className="contracts-tagline">
              {activeTab === 'developer' 
                ? 'Real GitHub issues as paid contracts. Claim tasks, submit PRs, earn BWRITER tokens.'
                : 'Create content, fulfill contracts, get paid in BWRITER'}
            </p>
            <div className="contracts-badge">CONTRACTS</div>
          </section>

          {/* Tab Navigation */}
          <section className="contracts-tabs-section">
            <div className="contracts-tabs">
              <button 
                className={activeTab === 'developer' ? 'active' : ''}
                onClick={() => setActiveTab('developer')}
              >
                Developer Contracts
              </button>
              <button 
                className={activeTab === 'writing' ? 'active' : ''}
                onClick={() => setActiveTab('writing')}
              >
                Writing Contracts
              </button>
            </div>
          </section>

          {/* Stats Cards */}
          <div className="contracts-stats">
            <div className="stat-card">
              <span className="stat-value">{filteredContracts.filter(c => c.status === 'available').length}</span>
              <span className="stat-label">Available</span>
            </div>
            <div className="stat-card">
              <span className="stat-value">{filteredContracts.filter(c => c.status === 'in_progress' || c.status === 'claimed').length}</span>
              <span className="stat-label">In Progress</span>
            </div>
            <div className="stat-card">
              <span className="stat-value">{filteredContracts.filter(c => c.status === 'submitted').length}</span>
              <span className="stat-label">Under Review</span>
            </div>
            <div className="stat-card">
              <span className="stat-value">{filteredContracts.filter(c => c.status === 'completed').length}</span>
              <span className="stat-label">Completed</span>
            </div>
          </div>

          {/* Contracts Grid */}
          {loading ? (
            <div className="contracts-loading">Loading contracts...</div>
          ) : (
            <div className="contracts-grid">
              {filteredContracts.map(contract => (
                <div 
                  key={contract.id} 
                  className={`contract-card ${contract.status !== 'available' ? 'contract-unavailable' : ''}`}
                  onClick={() => contract.status === 'available' && setSelectedContract(contract)}
                >
                  <div className="contract-header">
                    <h3>{contract.title}</h3>
                    <span 
                      className="contract-status"
                      style={{ background: getStatusColor(contract.status) }}
                    >
                      {contract.status.replace('_', ' ').toUpperCase()}
                    </span>
                  </div>
                  
                  <p className="contract-description">{contract.description}</p>
                  
                  <div className="contract-meta">
                    <span className={`contract-priority priority-${contract.priority.toLowerCase()}`}>
                      {contract.priority}
                    </span>
                    <span className="contract-reward">{contract.reward}</span>
                    <span className="contract-time">{contract.estimatedHours}h</span>
                  </div>

                  {contract.assignee && (
                    <div className="contract-assignee">
                      <span className="assignee-label">Assigned to:</span>
                      <span className="assignee-name">@{contract.assignee.githubUsername}</span>
                      {contract.status === 'in_progress' && (
                        <span className="assignee-deadline">
                          {getTimeRemaining(contract.assignee.deadline)}
                        </span>
                      )}
                    </div>
                  )}

                  {contract.pullRequest && (
                    <div className="contract-pr">
                      <a 
                        href={contract.pullRequest.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => e.stopPropagation()}
                      >
                        PR #{contract.pullRequest.number} ({contract.pullRequest.status})
                      </a>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Contract Details Modal */}
          {selectedContract && (
            <div className="contract-modal" onClick={() => setSelectedContract(null)}>
              <div className="contract-modal-content" onClick={(e) => e.stopPropagation()}>
                <button className="close-button" onClick={() => setSelectedContract(null)}>×</button>
                
                <h2>{selectedContract.title}</h2>
                
                <div className="contract-modal-meta">
                  <span className={`priority-badge priority-${selectedContract.priority.toLowerCase()}`}>
                    {selectedContract.priority} Priority
                  </span>
                  <span className="reward-badge">{selectedContract.reward}</span>
                  <span className="time-badge">{selectedContract.estimatedHours} hours</span>
                </div>

                <div className="contract-modal-section">
                  <h3>Description</h3>
                  <p>{selectedContract.description}</p>
                </div>

                <div className="contract-modal-section">
                  <h3>Required Skills</h3>
                  <div className="skills-list">
                    {selectedContract.skills.map(skill => (
                      <span key={skill} className="skill-badge">{skill}</span>
                    ))}
                  </div>
                </div>

                <div className="contract-modal-section">
                  <h3>Deliverables</h3>
                  <ul className="deliverables-list">
                    {selectedContract.deliverables.map((item, i) => (
                      <li key={i}>{item}</li>
                    ))}
                  </ul>
                </div>

                <div className="contract-actions">
                  <button 
                    className="claim-contract-button"
                    onClick={() => setShowClaimModal(true)}
                  >
                    Claim Contract
                  </button>
                  <a 
                    href={selectedContract.githubIssueUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="github-button"
                  >
                    View on GitHub →
                  </a>
                </div>
              </div>
            </div>
          )}

          {/* Claim Contract Modal */}
          {showClaimModal && (
            <div className="claim-modal" onClick={() => setShowClaimModal(false)}>
              <div className="claim-modal-content" onClick={(e) => e.stopPropagation()}>
                <button className="close-button" onClick={() => setShowClaimModal(false)}>×</button>
                
                <h2>Claim Contract</h2>
                <p>By claiming this contract, you agree to deliver the work within the specified timeframe.</p>
                
                <form onSubmit={(e) => { e.preventDefault(); handleClaimContract(); }}>
                  <div className="form-group">
                    <label>GitHub Username *</label>
                    <input
                      type="text"
                      value={claimForm.githubUsername}
                      onChange={(e) => setClaimForm({...claimForm, githubUsername: e.target.value})}
                      placeholder="your-github-username"
                      required
                    />
                  </div>
                  
                  <div className="form-group">
                    <label>HandCash Handle *</label>
                    <input
                      type="text"
                      value={claimForm.handcashHandle}
                      onChange={(e) => setClaimForm({...claimForm, handcashHandle: e.target.value})}
                      placeholder="$yourhandle"
                      required
                    />
                  </div>
                  
                  <div className="form-group">
                    <label>Estimated Days to Complete *</label>
                    <select
                      value={claimForm.estimatedDays}
                      onChange={(e) => setClaimForm({...claimForm, estimatedDays: parseInt(e.target.value)})}
                    >
                      <option value={3}>3 days</option>
                      <option value={5}>5 days</option>
                      <option value={7}>7 days (default)</option>
                      <option value={14}>14 days</option>
                      <option value={30}>30 days</option>
                    </select>
                  </div>
                  
                  <div className="claim-terms">
                    <h4>Terms & Conditions:</h4>
                    <ul>
                      <li>You must submit a PR within the agreed timeframe</li>
                      <li>Code must meet all acceptance criteria</li>
                      <li>Token rewards are distributed upon PR merge</li>
                      <li>Inactive contracts may be reassigned after deadline</li>
                    </ul>
                  </div>
                  
                  <button type="submit" className="submit-claim-button">
                    Accept & Claim Contract
                  </button>
                </form>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ContractsPage;