import React, { useState, useEffect } from 'react';
import './ContractsPage.css';
import Footer from '../components/Footer';

interface WritingContract {
  id: string;
  title: string;
  description: string;
  client: string;
  reward: string;
  wordCount: string;
  deadline: string;
  status: 'available' | 'in_progress' | 'submitted' | 'completed';
  type: 'article' | 'blog' | 'technical' | 'whitepaper' | 'guide' | 'copy' | 'tutorial';
  topics: string[];
}

const AuthorsContractsPage: React.FC = () => {
  const [contracts, setContracts] = useState<WritingContract[]>([]);
  const [selectedContract, setSelectedContract] = useState<WritingContract | null>(null);
  const [showApplicationModal, setShowApplicationModal] = useState(false);
  const [devSidebarCollapsed, setDevSidebarCollapsed] = useState(() => {
    const saved = localStorage.getItem('devSidebarCollapsed');
    return saved === 'true';
  });
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  
  // Form state for application modal
  const [applicationForm, setApplicationForm] = useState({
    authorName: '',
    email: '',
    portfolio: '',
    estimatedDays: 3,
    proposedRate: '',
    coverLetter: ''
  });

  useEffect(() => {
    // Listen for storage changes to detect sidebar collapse state
    const handleStorageChange = () => {
      const saved = localStorage.getItem('devSidebarCollapsed');
      setDevSidebarCollapsed(saved === 'true');
    };
    
    // Handle window resize
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    
    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('resize', handleResize);
    
    // Check for sidebar state changes via polling
    const checkSidebarState = setInterval(() => {
      const saved = localStorage.getItem('devSidebarCollapsed');
      setDevSidebarCollapsed(saved === 'true');
    }, 100);
    
    // Load sample writing contracts
    setContracts([
      {
        id: 'write-001',
        title: 'Technical Documentation for BSV Smart Contracts',
        description: 'Create comprehensive documentation for our new smart contract platform, including API references, code examples, and best practices guide.',
        client: 'BSV Labs',
        reward: '$500',
        wordCount: '3,000-5,000',
        deadline: '7 days',
        status: 'available',
        type: 'technical',
        topics: ['Blockchain', 'Smart Contracts', 'API Documentation', 'BSV']
      },
      {
        id: 'write-002',
        title: 'Series of Blog Posts on DeFi Applications',
        description: 'Write 5 engaging blog posts about decentralized finance applications on BSV, targeting both technical and non-technical audiences.',
        client: 'CryptoMedia Inc.',
        reward: '$750',
        wordCount: '1,500 per post',
        deadline: '14 days',
        status: 'available',
        type: 'blog',
        topics: ['DeFi', 'Blockchain', 'BSV', 'Finance', 'Technology']
      },
      {
        id: 'write-003',
        title: 'Whitepaper for New NFT Protocol',
        description: 'Research and write a technical whitepaper for our innovative NFT protocol that enables fractional ownership and cross-chain compatibility.',
        client: 'NFT Innovations',
        reward: '$2,000',
        wordCount: '8,000-10,000',
        deadline: '21 days',
        status: 'available',
        type: 'whitepaper',
        topics: ['NFTs', 'Protocol Design', 'Blockchain', 'Technical Writing']
      },
      {
        id: 'write-004',
        title: 'User Guide for Bitcoin Wallet Application',
        description: 'Create user-friendly guides and tutorials for our mobile Bitcoin wallet, including setup, security best practices, and troubleshooting.',
        client: 'WalletCo',
        reward: '$400',
        wordCount: '2,500',
        deadline: '5 days',
        status: 'in_progress',
        type: 'guide',
        topics: ['Bitcoin', 'Mobile Apps', 'User Documentation', 'Security']
      },
      {
        id: 'write-005',
        title: 'Marketing Copy for Blockchain Gaming Platform',
        description: 'Write compelling website copy, product descriptions, and marketing materials for our new blockchain gaming platform launch.',
        client: 'GameChain Studios',
        reward: '$600',
        wordCount: '2,000',
        deadline: '4 days',
        status: 'available',
        type: 'copy',
        topics: ['Gaming', 'Blockchain', 'Marketing', 'Web3']
      },
      {
        id: 'write-006',
        title: 'Research Article on BSV Scalability',
        description: 'Deep-dive research article analyzing BSV blockchain scalability, comparing with other chains, and discussing future implications.',
        client: 'Blockchain Research Institute',
        reward: '$800',
        wordCount: '4,000',
        deadline: '10 days',
        status: 'available',
        type: 'article',
        topics: ['BSV', 'Scalability', 'Research', 'Blockchain Technology']
      }
    ]);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('resize', handleResize);
      clearInterval(checkSidebarState);
    };
  }, []);

  const handleApplyToContract = () => {
    // In a real app, this would submit to a backend
    console.log('Application submitted:', applicationForm);
    
    // Update contract status locally
    if (selectedContract) {
      const updatedContracts = contracts.map(c => 
        c.id === selectedContract.id 
          ? { ...c, status: 'in_progress' as WritingContract['status'] }
          : c
      );
      setContracts(updatedContracts);
    }
    
    // Close modals and reset form
    setShowApplicationModal(false);
    setSelectedContract(null);
    setApplicationForm({
      authorName: '',
      email: '',
      portfolio: '',
      estimatedDays: 3,
      proposedRate: '',
      coverLetter: ''
    });
  };

  const getStatusColor = (status: WritingContract['status']) => {
    switch (status) {
      case 'available': return '#22c55e';
      case 'in_progress': return '#3b82f6';
      case 'submitted': return '#8b5cf6';
      case 'completed': return '#6b7280';
      default: return '#6b7280';
    }
  };

  const getTypeColor = (type: WritingContract['type']) => {
    switch (type) {
      case 'article': return '#FF6B35';
      case 'blog': return '#F7931E';
      case 'technical': return '#3b82f6';
      case 'whitepaper': return '#8b5cf6';
      case 'guide': return '#22c55e';
      case 'copy': return '#ec4899';
      default: return '#6b7280';
    }
  };

  return (
    <div className="App">
      <div className={`contracts-page ${!isMobile && !devSidebarCollapsed ? 'with-sidebar-expanded' : ''} ${!isMobile && devSidebarCollapsed ? 'with-sidebar-collapsed' : ''}`}>
        <div className="contracts-container">
          {/* Hero Section */}
          <section className="contracts-hero">
            <h1>Writing <span style={{color: '#ffffff'}}>Contracts</span></h1>
            <p className="contracts-tagline">
              Find writing opportunities, create content, get paid instantly
            </p>
            <div className="contracts-badge">AUTHORS</div>
          </section>

          <div className="contracts-stats">
            <div className="stat-card">
              <span className="stat-value">{contracts.filter(c => c.status === 'available').length}</span>
              <span className="stat-label">Available</span>
            </div>
            <div className="stat-card">
              <span className="stat-value">{contracts.filter(c => c.status === 'in_progress').length}</span>
              <span className="stat-label">In Progress</span>
            </div>
            <div className="stat-card">
              <span className="stat-value">{contracts.filter(c => c.status === 'submitted').length}</span>
              <span className="stat-label">Submitted</span>
            </div>
            <div className="stat-card">
              <span className="stat-value">{contracts.filter(c => c.status === 'completed').length}</span>
              <span className="stat-label">Completed</span>
            </div>
          </div>

          <div className="contracts-grid">
            {contracts.map(contract => (
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
                  <span 
                    className="contract-type"
                    style={{ background: getTypeColor(contract.type), color: '#fff', padding: '4px 10px', borderRadius: '12px', fontSize: '12px' }}
                  >
                    {contract.type}
                  </span>
                  <span className="contract-reward">{contract.reward}</span>
                  <span className="contract-words">{contract.wordCount} words</span>
                </div>

                <div className="contract-details">
                  <div className="detail-row">
                    <span className="detail-label">Client:</span>
                    <span className="detail-value">{contract.client}</span>
                  </div>
                  <div className="detail-row">
                    <span className="detail-label">Deadline:</span>
                    <span className="detail-value">{contract.deadline}</span>
                  </div>
                </div>

                <div className="contract-topics">
                  {contract.topics.slice(0, 3).map((topic, index) => (
                    <span key={index} className="topic-tag">{topic}</span>
                  ))}
                  {contract.topics.length > 3 && (
                    <span className="topic-tag">+{contract.topics.length - 3}</span>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Contract Details Modal */}
          {selectedContract && (
            <div className="contract-modal" onClick={() => setSelectedContract(null)}>
              <div className="contract-modal-content" onClick={(e) => e.stopPropagation()}>
                <button className="modal-close" onClick={() => setSelectedContract(null)}>×</button>
                
                <h2>{selectedContract.title}</h2>
                
                <div className="modal-meta">
                  <span 
                    className="type-badge"
                    style={{ background: getTypeColor(selectedContract.type), color: '#fff' }}
                  >
                    {selectedContract.type}
                  </span>
                  <span className="reward-badge">{selectedContract.reward}</span>
                  <span className="words-badge">{selectedContract.wordCount} words</span>
                  <span className="deadline-badge">{selectedContract.deadline}</span>
                </div>
                
                <div className="modal-section">
                  <h3>Client</h3>
                  <p>{selectedContract.client}</p>
                </div>
                
                <div className="modal-section">
                  <h3>Description</h3>
                  <p>{selectedContract.description}</p>
                </div>
                
                <div className="modal-section">
                  <h3>Topics</h3>
                  <div className="topics-list">
                    {selectedContract.topics.map((topic, index) => (
                      <span key={index} className="topic-badge">{topic}</span>
                    ))}
                  </div>
                </div>
                
                <div className="modal-actions">
                  <button 
                    className="claim-button"
                    onClick={() => setShowApplicationModal(true)}
                  >
                    Apply for Contract
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Application Modal */}
          {showApplicationModal && selectedContract && (
            <div className="claim-modal" onClick={() => setShowApplicationModal(false)}>
              <div className="claim-modal-content" onClick={(e) => e.stopPropagation()}>
                <button className="modal-close" onClick={() => setShowApplicationModal(false)}>×</button>
                
                <h2>Apply for Writing Contract</h2>
                <p>Submit your application for: {selectedContract.title}</p>
                
                <div className="claim-form">
                  <div className="form-group">
                    <label>Your Name *</label>
                    <input 
                      type="text"
                      value={applicationForm.authorName}
                      onChange={(e) => setApplicationForm({...applicationForm, authorName: e.target.value})}
                      placeholder="John Doe"
                    />
                  </div>
                  
                  <div className="form-group">
                    <label>Email *</label>
                    <input 
                      type="email"
                      value={applicationForm.email}
                      onChange={(e) => setApplicationForm({...applicationForm, email: e.target.value})}
                      placeholder="author@example.com"
                    />
                  </div>
                  
                  <div className="form-group">
                    <label>Portfolio Link</label>
                    <input 
                      type="url"
                      value={applicationForm.portfolio}
                      onChange={(e) => setApplicationForm({...applicationForm, portfolio: e.target.value})}
                      placeholder="https://your-portfolio.com"
                    />
                  </div>
                  
                  <div className="form-group">
                    <label>Proposed Rate (if different from listed)</label>
                    <input 
                      type="text"
                      value={applicationForm.proposedRate}
                      onChange={(e) => setApplicationForm({...applicationForm, proposedRate: e.target.value})}
                      placeholder="$500"
                    />
                  </div>
                  
                  <div className="form-group">
                    <label>Estimated Days to Complete</label>
                    <input 
                      type="number"
                      value={applicationForm.estimatedDays}
                      onChange={(e) => setApplicationForm({...applicationForm, estimatedDays: parseInt(e.target.value) || 3})}
                      min="1"
                      max="30"
                    />
                  </div>
                  
                  <div className="form-group">
                    <label>Cover Letter</label>
                    <textarea 
                      value={applicationForm.coverLetter}
                      onChange={(e) => setApplicationForm({...applicationForm, coverLetter: e.target.value})}
                      placeholder="Why are you the best writer for this project?"
                      rows={4}
                    />
                  </div>
                  
                  <div className="claim-actions">
                    <button 
                      className="cancel-button"
                      onClick={() => setShowApplicationModal(false)}
                    >
                      Cancel
                    </button>
                    <button 
                      className="submit-claim-button"
                      onClick={handleApplyToContract}
                      disabled={!applicationForm.authorName || !applicationForm.email}
                    >
                      Submit Application
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
        <Footer />
      </div>
    </div>
  );
};

export default AuthorsContractsPage;