import React, { useState, useEffect } from 'react';
import './ContractsPage.css';
import Footer from '../components/Footer';

interface PublisherContract {
  id: string;
  title: string;
  description: string;
  author: string;
  authorRating: number;
  status: 'draft' | 'active' | 'in_review' | 'completed' | 'disputed';
  budget: string;
  wordCount: string;
  deadline: string;
  deliveredOn?: string;
  type: 'article' | 'blog' | 'technical' | 'whitepaper' | 'guide' | 'copy' | 'tutorial';
  escrowStatus: 'not_funded' | 'funded' | 'released' | 'refunded';
  aiVerification?: {
    plagiarism: number;
    quality: number;
    relevance: number;
  };
}

const PublisherContractsPage: React.FC = () => {
  const [contracts, setContracts] = useState<PublisherContract[]>([]);
  const [selectedContract, setSelectedContract] = useState<PublisherContract | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [devSidebarCollapsed, setDevSidebarCollapsed] = useState(() => {
    const saved = localStorage.getItem('devSidebarCollapsed');
    return saved === 'true';
  });
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  
  // Form state for creating new contract
  const [createForm, setCreateForm] = useState({
    title: '',
    description: '',
    type: 'article',
    budget: '',
    currency: 'BSV',
    customToken: '',
    wordCount: '',
    deadline: '',
    requirements: ''
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
    
    // Load sample publisher contracts
    setContracts([
      {
        id: 'pub-001',
        title: 'BSV Integration Guide for E-commerce',
        description: 'Comprehensive guide on integrating BSV payments into e-commerce platforms',
        author: 'John Smith',
        authorRating: 4.8,
        status: 'active',
        budget: '750 $BWRITER',
        wordCount: '3,500 words',
        deadline: '2025-02-15',
        type: 'guide',
        escrowStatus: 'funded'
      },
      {
        id: 'pub-002',
        title: 'Weekly Blockchain News Articles',
        description: 'Series of 4 weekly articles covering latest developments in blockchain',
        author: 'Sarah Johnson',
        authorRating: 4.9,
        status: 'in_review',
        budget: '1,200 $BWRITER',
        wordCount: '2,000 words each',
        deadline: '2025-02-28',
        deliveredOn: '2025-02-10',
        type: 'article',
        escrowStatus: 'funded',
        aiVerification: {
          plagiarism: 2,
          quality: 92,
          relevance: 95
        }
      },
      {
        id: 'pub-003',
        title: 'Smart Contract Security Best Practices',
        description: 'Technical whitepaper on security considerations for BSV smart contracts',
        author: 'Michael Chen',
        authorRating: 5.0,
        status: 'completed',
        budget: '2,500 $BWRITER',
        wordCount: '8,000 words',
        deadline: '2025-01-30',
        deliveredOn: '2025-01-28',
        type: 'whitepaper',
        escrowStatus: 'released',
        aiVerification: {
          plagiarism: 0,
          quality: 98,
          relevance: 100
        }
      },
      {
        id: 'pub-004',
        title: 'Marketing Copy for DeFi Platform',
        description: 'Website copy and marketing materials for new DeFi application',
        author: 'Emma Wilson',
        authorRating: 4.7,
        status: 'active',
        budget: '500 $BWRITER',
        wordCount: '1,500 words',
        deadline: '2025-02-20',
        type: 'copy',
        escrowStatus: 'funded'
      },
      {
        id: 'pub-005',
        title: 'NFT Marketplace Tutorial Series',
        description: 'Step-by-step tutorials for using our NFT marketplace',
        author: 'Not Assigned',
        authorRating: 0,
        status: 'draft',
        budget: '900 $BWRITER',
        wordCount: '4,000 words',
        deadline: '2025-03-01',
        type: 'tutorial',
        escrowStatus: 'not_funded'
      }
    ]);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('resize', handleResize);
      clearInterval(checkSidebarState);
    };
  }, []);

  const handleCreateContract = () => {
    const newContract: PublisherContract = {
      id: `pub-${Date.now()}`,
      title: createForm.title,
      description: createForm.description,
      author: 'Not Assigned',
      authorRating: 0,
      status: 'draft',
      budget: createForm.budget,
      wordCount: createForm.wordCount,
      deadline: createForm.deadline,
      type: createForm.type as PublisherContract['type'],
      escrowStatus: 'not_funded'
    };
    
    setContracts([newContract, ...contracts]);
    setShowCreateModal(false);
    
    // Reset form
    setCreateForm({
      title: '',
      description: '',
      type: 'article',
      budget: '',
      currency: 'BSV',
      customToken: '',
      wordCount: '',
      deadline: '',
      requirements: ''
    });
  };

  const handleFundEscrow = (contractId: string) => {
    setContracts(contracts.map(c => 
      c.id === contractId 
        ? { ...c, escrowStatus: 'funded' as PublisherContract['escrowStatus'], status: 'active' as PublisherContract['status'] }
        : c
    ));
  };

  const handleApproveWork = (contractId: string) => {
    setContracts(contracts.map(c => 
      c.id === contractId 
        ? { ...c, status: 'completed' as PublisherContract['status'], escrowStatus: 'released' as PublisherContract['escrowStatus'] }
        : c
    ));
  };

  const getStatusColor = (status: PublisherContract['status']) => {
    switch (status) {
      case 'draft': return '#6b7280';
      case 'active': return '#22c55e';
      case 'in_review': return '#f59e0b';
      case 'completed': return '#3b82f6';
      case 'disputed': return '#ef4444';
      default: return '#6b7280';
    }
  };

  const getEscrowStatusColor = (status: PublisherContract['escrowStatus']) => {
    switch (status) {
      case 'not_funded': return '#6b7280';
      case 'funded': return '#22c55e';
      case 'released': return '#3b82f6';
      case 'refunded': return '#ef4444';
      default: return '#6b7280';
    }
  };

  return (
    <div className="App">
      <div className={`contracts-page ${!isMobile && !devSidebarCollapsed ? 'with-sidebar-expanded' : ''} ${!isMobile && devSidebarCollapsed ? 'with-sidebar-collapsed' : ''}`}>
        <div className="contracts-container">
          {/* Hero Section */}
          <section className="contracts-hero">
            <h1>Publisher <span style={{color: '#ffffff'}}>Dashboard</span></h1>
            <p className="contracts-tagline">
              Create contracts, manage writers, approve content with AI verification
            </p>
            <div className="contracts-badge">PUBLISHERS</div>
          </section>

          <div className="contracts-stats">
            <div className="stat-card">
              <span className="stat-value">{contracts.filter(c => c.status === 'draft').length}</span>
              <span className="stat-label">Drafts</span>
            </div>
            <div className="stat-card">
              <span className="stat-value">{contracts.filter(c => c.status === 'active').length}</span>
              <span className="stat-label">Active</span>
            </div>
            <div className="stat-card">
              <span className="stat-value">{contracts.filter(c => c.status === 'in_review').length}</span>
              <span className="stat-label">In Review</span>
            </div>
            <div className="stat-card">
              <span className="stat-value">{contracts.filter(c => c.status === 'completed').length}</span>
              <span className="stat-label">Completed</span>
            </div>
          </div>

          <div className="publisher-actions" style={{ display: 'flex', justifyContent: 'center', marginBottom: '30px' }}>
            <button 
              className="create-contract-btn" 
              onClick={() => {
                console.log('Create New Offer clicked!');
                setShowCreateModal(true);
              }}
            >
              + Create New Offer
            </button>
          </div>

          <div className="contracts-grid">
            {contracts.map(contract => (
              <div 
                key={contract.id} 
                className="contract-card publisher-card"
                onClick={() => setSelectedContract(contract)}
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
                  <span className="contract-type" style={{ background: '#FF6B35', color: '#fff', padding: '4px 10px', borderRadius: '12px', fontSize: '12px' }}>
                    {contract.type}
                  </span>
                  <span className="contract-budget">{contract.budget}</span>
                  <span className="contract-words">{contract.wordCount}</span>
                </div>

                <div className="contract-details">
                  <div className="detail-row">
                    <span className="detail-label">Author:</span>
                    <span className="detail-value">
                      {contract.author}
                      {contract.authorRating > 0 && (
                        <span style={{ color: '#FFC107', marginLeft: '8px' }}>
                          ★ {contract.authorRating}
                        </span>
                      )}
                    </span>
                  </div>
                  <div className="detail-row">
                    <span className="detail-label">Deadline:</span>
                    <span className="detail-value">{new Date(contract.deadline).toLocaleDateString()}</span>
                  </div>
                  <div className="detail-row">
                    <span className="detail-label">Escrow:</span>
                    <span 
                      className="detail-value"
                      style={{ color: getEscrowStatusColor(contract.escrowStatus) }}
                    >
                      {contract.escrowStatus.replace('_', ' ')}
                    </span>
                  </div>
                </div>

                {contract.aiVerification && (
                  <div className="ai-verification">
                    <div className="ai-metric">
                      <span className="metric-label">Plagiarism:</span>
                      <span className="metric-value" style={{ color: contract.aiVerification.plagiarism < 10 ? '#22c55e' : '#ef4444' }}>
                        {contract.aiVerification.plagiarism}%
                      </span>
                    </div>
                    <div className="ai-metric">
                      <span className="metric-label">Quality:</span>
                      <span className="metric-value" style={{ color: contract.aiVerification.quality > 80 ? '#22c55e' : '#f59e0b' }}>
                        {contract.aiVerification.quality}%
                      </span>
                    </div>
                    <div className="ai-metric">
                      <span className="metric-label">Relevance:</span>
                      <span className="metric-value" style={{ color: contract.aiVerification.relevance > 80 ? '#22c55e' : '#f59e0b' }}>
                        {contract.aiVerification.relevance}%
                      </span>
                    </div>
                  </div>
                )}
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
                  <span className="status-badge" style={{ background: getStatusColor(selectedContract.status) }}>
                    {selectedContract.status.replace('_', ' ')}
                  </span>
                  <span className="budget-badge">{selectedContract.budget}</span>
                  <span className="deadline-badge">Due: {new Date(selectedContract.deadline).toLocaleDateString()}</span>
                </div>
                
                <div className="modal-section">
                  <h3>Description</h3>
                  <p>{selectedContract.description}</p>
                </div>
                
                <div className="modal-section">
                  <h3>Contract Details</h3>
                  <div className="contract-info-grid">
                    <div className="info-item">
                      <label>Type:</label>
                      <span>{selectedContract.type}</span>
                    </div>
                    <div className="info-item">
                      <label>Word Count:</label>
                      <span>{selectedContract.wordCount}</span>
                    </div>
                    <div className="info-item">
                      <label>Author:</label>
                      <span>
                        {selectedContract.author}
                        {selectedContract.authorRating > 0 && (
                          <span style={{ color: '#FFC107', marginLeft: '8px' }}>
                            ★ {selectedContract.authorRating}
                          </span>
                        )}
                      </span>
                    </div>
                    <div className="info-item">
                      <label>Escrow Status:</label>
                      <span style={{ color: getEscrowStatusColor(selectedContract.escrowStatus) }}>
                        {selectedContract.escrowStatus.replace('_', ' ')}
                      </span>
                    </div>
                  </div>
                </div>
                
                {selectedContract.aiVerification && (
                  <div className="modal-section">
                    <h3>AI Verification Results</h3>
                    <div className="ai-results">
                      <div className="ai-result-item">
                        <label>Plagiarism Check:</label>
                        <div className="progress-bar">
                          <div 
                            className="progress-fill"
                            style={{ 
                              width: `${100 - selectedContract.aiVerification.plagiarism}%`,
                              background: selectedContract.aiVerification.plagiarism < 10 ? '#22c55e' : '#ef4444'
                            }}
                          />
                        </div>
                        <span>{selectedContract.aiVerification.plagiarism}% detected</span>
                      </div>
                      <div className="ai-result-item">
                        <label>Quality Score:</label>
                        <div className="progress-bar">
                          <div 
                            className="progress-fill"
                            style={{ 
                              width: `${selectedContract.aiVerification.quality}%`,
                              background: selectedContract.aiVerification.quality > 80 ? '#22c55e' : '#f59e0b'
                            }}
                          />
                        </div>
                        <span>{selectedContract.aiVerification.quality}%</span>
                      </div>
                      <div className="ai-result-item">
                        <label>Content Relevance:</label>
                        <div className="progress-bar">
                          <div 
                            className="progress-fill"
                            style={{ 
                              width: `${selectedContract.aiVerification.relevance}%`,
                              background: selectedContract.aiVerification.relevance > 80 ? '#22c55e' : '#f59e0b'
                            }}
                          />
                        </div>
                        <span>{selectedContract.aiVerification.relevance}%</span>
                      </div>
                    </div>
                  </div>
                )}
                
                <div className="modal-actions">
                  {selectedContract.status === 'draft' && selectedContract.escrowStatus === 'not_funded' && (
                    <button 
                      className="fund-button"
                      onClick={() => handleFundEscrow(selectedContract.id)}
                    >
                      Fund Escrow & Publish
                    </button>
                  )}
                  {selectedContract.status === 'in_review' && (
                    <>
                      <button 
                        className="reject-button"
                        onClick={() => setSelectedContract(null)}
                      >
                        Request Revision
                      </button>
                      <button 
                        className="approve-button"
                        onClick={() => handleApproveWork(selectedContract.id)}
                      >
                        Approve & Release Payment
                      </button>
                    </>
                  )}
                  {selectedContract.status === 'completed' && (
                    <button className="download-button">
                      Download Content
                    </button>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Create BSV Escrow Offer Modal */}
          {showCreateModal && (
            <div className="claim-modal-overlay" onClick={() => setShowCreateModal(false)}>
              <div className="claim-modal" onClick={(e) => e.stopPropagation()}>
                <button className="modal-close" onClick={() => setShowCreateModal(false)} style={{position: 'absolute', top: '15px', right: '15px', background: 'none', border: 'none', color: '#ffffff', fontSize: '28px', cursor: 'pointer'}}>×</button>
                
                <div className="claim-modal-header">
                  <h2>Create BSV Escrow Offer</h2>
                  <p>Create a blockchain-secured writing contract with automatic BSV escrow</p>
                </div>
                
                <div style={{padding: '0 24px 24px'}}>
                
                <div className="escrow-info" style={{background: 'rgba(255, 107, 53, 0.1)', padding: '15px', borderRadius: '8px', marginBottom: '20px', border: '1px solid rgba(255, 107, 53, 0.2)'}}>
                  <h4 style={{color: '#FF6B35', margin: '0 0 10px 0', fontSize: '14px'}}>How BSV Escrow Works:</h4>
                  <ul style={{margin: '0', paddingLeft: '20px', fontSize: '12px', color: 'rgba(255,255,255,0.8)'}}>
                    <li>You sign this offer with Google/Twitter + HandCash authentication</li>
                    <li>Your BSV payment is locked in on-chain escrow until deadline</li>
                    <li>Authors can accept by signing with their accounts + HandCash</li>
                    <li>Contract locks both parties until completion or expiry</li>
                    <li>You approve final work to release BSV from escrow</li>
                  </ul>
                </div>
                
                <div className="claim-form">
                  <div className="form-group">
                    <label>Contract Title *</label>
                    <input 
                      type="text"
                      value={createForm.title}
                      onChange={(e) => setCreateForm({...createForm, title: e.target.value})}
                      placeholder="e.g., Technical Blog Post on Blockchain"
                    />
                  </div>
                  
                  <div className="form-group">
                    <label>Description *</label>
                    <textarea 
                      value={createForm.description}
                      onChange={(e) => setCreateForm({...createForm, description: e.target.value})}
                      placeholder="Detailed description of what you need..."
                      rows={3}
                    />
                  </div>
                  
                  <div className="form-group">
                    <label>Content Type</label>
                    <select 
                      value={createForm.type}
                      onChange={(e) => setCreateForm({...createForm, type: e.target.value})}
                    >
                      <option value="article">Article</option>
                      <option value="blog">Blog Post</option>
                      <option value="technical">Technical Writing</option>
                      <option value="whitepaper">Whitepaper</option>
                      <option value="guide">Guide</option>
                      <option value="tutorial">Tutorial</option>
                      <option value="copy">Marketing Copy</option>
                    </select>
                  </div>
                  
                  <div className="form-row" style={{display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '15px'}}>
                    <div className="form-group">
                      <label>Escrow Amount *</label>
                      <input 
                        type="number"
                        step="0.001"
                        value={createForm.budget}
                        onChange={(e) => setCreateForm({...createForm, budget: e.target.value})}
                        placeholder={createForm.currency === 'USD' ? '500.00' : createForm.currency === 'BSV' ? '0.1' : '1000'}
                      />
                      <small style={{color: 'rgba(255,255,255,0.6)', fontSize: '11px'}}>
                        {createForm.currency === 'USD' ? 'USD payment will be converted to BSV at time of escrow' : 
                         createForm.currency === 'BSV' ? 'BSV will be locked in escrow until completion' :
                         createForm.currency === 'BWRITER' ? '$BWRITER tokens locked until completion' :
                         'Custom BSV token will be locked in escrow'}
                      </small>
                    </div>
                    
                    <div className="form-group">
                      <label>Currency *</label>
                      <select 
                        value={createForm.currency}
                        onChange={(e) => setCreateForm({...createForm, currency: e.target.value, customToken: ''})}
                        style={{width: '100%', padding: '12px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '6px', color: '#fff'}}
                      >
                        <option value="USD">USD ($)</option>
                        <option value="BSV">BSV</option>
                        <option value="BWRITER">$BWRITER</option>
                        <option value="OTHER">Other BSV Token</option>
                      </select>
                    </div>
                  </div>
                  
                  {createForm.currency === 'OTHER' && (
                    <div className="form-group">
                      <label>Custom Token Name *</label>
                      <input 
                        type="text"
                        value={createForm.customToken}
                        onChange={(e) => setCreateForm({...createForm, customToken: e.target.value})}
                        placeholder="e.g., SHUA, RUN, etc. (must be on BSV network)"
                      />
                      <small style={{color: '#FF6B35', fontSize: '11px'}}>⚠️ Token must exist on the BSV blockchain</small>
                    </div>
                  )}
                  
                  <div className="form-group">
                    <label>Word Count *</label>
                    <input 
                      type="text"
                      value={createForm.wordCount}
                      onChange={(e) => setCreateForm({...createForm, wordCount: e.target.value})}
                      placeholder="2,000 words"
                    />
                  </div>
                  
                  <div className="form-group">
                    <label>Deadline *</label>
                    <input 
                      type="date"
                      value={createForm.deadline}
                      onChange={(e) => setCreateForm({...createForm, deadline: e.target.value})}
                    />
                  </div>
                  
                  <div className="form-group">
                    <label>Additional Requirements</label>
                    <textarea 
                      value={createForm.requirements}
                      onChange={(e) => setCreateForm({...createForm, requirements: e.target.value})}
                      placeholder="Keywords, style guide, references, etc."
                      rows={3}
                    />
                  </div>
                  
                  {/* Authentication Section */}
                  <div className="auth-section" style={{background: 'rgba(255,255,255,0.02)', padding: '15px', borderRadius: '8px', margin: '20px 0'}}>
                    <h4 style={{color: '#ffffff', fontSize: '14px', marginBottom: '15px'}}>Sign & Create Escrow Offer</h4>
                    
                    <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '15px'}}>
                      <button className="auth-btn" style={{padding: '8px 12px', background: '#4285f4', color: 'white', border: 'none', borderRadius: '4px', fontSize: '12px'}}>
                        🔒 Sign with Google
                      </button>
                      <button className="auth-btn" style={{padding: '8px 12px', background: '#1DA1F2', color: 'white', border: 'none', borderRadius: '4px', fontSize: '12px'}}>
                        🔒 Sign with Twitter
                      </button>
                    </div>
                    
                    <button className="handcash-btn" style={{padding: '10px', background: 'linear-gradient(90deg, #FF6B35, #F7931E)', color: '#000', border: 'none', borderRadius: '6px', width: '100%', fontWeight: 'bold', fontSize: '13px'}}>
                      🔐 Sign with HandCash & Lock Funds in Escrow
                    </button>
                    
                    <div style={{fontSize: '11px', color: 'rgba(255,255,255,0.5)', marginTop: '10px', textAlign: 'center'}}>
                      By signing, you create a blockchain contract and lock {createForm.budget || '0'} {createForm.currency === 'OTHER' ? createForm.customToken || 'tokens' : createForm.currency} in escrow
                    </div>
                  </div>
                  
                  <div className="claim-actions">
                    <button 
                      className="cancel-button"
                      onClick={() => setShowCreateModal(false)}
                    >
                      Cancel
                    </button>
                    <button 
                      className="submit-claim-button"
                      onClick={handleCreateContract}
                      disabled={!createForm.title || !createForm.description || !createForm.budget || !createForm.wordCount || !createForm.deadline}
                    >
                      Create Escrow Offer
                    </button>
                  </div>
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

export default PublisherContractsPage;