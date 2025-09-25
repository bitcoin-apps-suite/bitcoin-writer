import React, { useState, useEffect } from 'react';
import './ContractsPage.css';
import { HandCashService } from '../services/HandCashService';
import Footer from '../components/Footer';

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

const DeveloperContractsPage: React.FC = () => {
  const [contracts, setContracts] = useState<Contract[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedContract, setSelectedContract] = useState<Contract | null>(null);
  const [showClaimModal, setShowClaimModal] = useState(false);
  const [handcashService] = useState(new HandCashService());
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [devSidebarCollapsed, setDevSidebarCollapsed] = useState(() => {
    const saved = localStorage.getItem('devSidebarCollapsed');
    return saved === 'true';
  });
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  
  // Form state for claim modal
  const [claimForm, setClaimForm] = useState({
    githubUsername: '',
    handcashHandle: '',
    estimatedDays: 7
  });

  useEffect(() => {
    fetchContracts();
    checkAuthentication();
    
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
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('resize', handleResize);
      clearInterval(checkSidebarState);
    };
  }, []);

  const checkAuthentication = () => {
    setIsAuthenticated(handcashService.isAuthenticated());
  };

  const fetchContracts = async () => {
    try {
      // Fetch GitHub issues
      const response = await fetch('https://api.github.com/repos/bitcoin-apps-suite/bitcoin-writer/issues?state=all&per_page=100');
      
      if (!response.ok) {
        console.warn('GitHub API response not OK:', response.status);
        throw new Error(`GitHub API error: ${response.status}`);
      }
      
      const issues = await response.json();
      
      if (issues.message && issues.message.includes('rate limit')) {
        console.warn('GitHub API rate limited');
        throw new Error('Rate limited');
      }
      
      if (!Array.isArray(issues)) {
        throw new Error('Invalid response format');
      }
      
      // Also fetch pull requests to match with issues
      const prsResponse = await fetch('https://api.github.com/repos/bitcoin-apps-suite/bitcoin-writer/pulls?state=all&per_page=100');
      const pullRequests = prsResponse.ok ? await prsResponse.json() : [];
      
      // Map issues to contracts - ONLY DEVELOPER CONTRACTS
      const mappedContracts = issues.map((issue: any): Contract | null => {
        const body = issue.body || '';
        
        let priorityMatch = body.match(/\*\*Priority:\*\*\s*(Critical|High|Medium|Low)/i);
        let hoursMatch = body.match(/\*\*Estimated Hours:\*\*\s*([\d,]+)/i);
        let rewardMatch = body.match(/\*\*Token Reward:\*\*\s*([\d,]+)\s*BWRITER/i);
        
        // Find matching PR if exists
        const matchingPR = pullRequests.find((pr: any) => 
          pr.body && pr.body.includes(`#${issue.number}`)
        );
        
        // Extract description
        let description = '';
        const descMatch = body.match(/##\s*(?:📋\s*)?Description\s*\n([\s\S]*?)(?=##|$)/i);
        if (descMatch) {
          description = descMatch[1].trim().split('\n\n')[0];
        } else {
          description = body.split('## Requirements')[0].replace('## Description', '').trim();
        }
        
        // Parse requirements section for skills
        let skills: string[] = ['TypeScript', 'React'];
        const requirementsMatch = body.match(/##\s*(?:🎯\s*)?Requirements\s*\n([\s\S]*?)(?=##|$)/i);
        if (requirementsMatch) {
          const requirements = requirementsMatch[1];
          if (requirements.includes('OAuth')) skills.push('OAuth');
          if (requirements.includes('Google')) skills.push('Google APIs');
          if (requirements.includes('PDF')) skills.push('PDF Generation');
          if (requirements.includes('blockchain') || requirements.includes('BSV')) skills.push('BSV');
          if (requirements.includes('HandCash')) skills.push('HandCash SDK');
          if (requirements.includes('WebRTC')) skills.push('WebRTC');
          if (requirements.includes('smart contract')) skills.push('Smart Contracts');
        }
        
        // Handle bounty format from older issues
        if (!rewardMatch) {
          const bountyMatch = body.match(/([\d.]+)%\s*(?:of\s+tokens|Bounty)/i);
          if (bountyMatch) {
            const percentage = parseFloat(bountyMatch[1]);
            const tokens = Math.round(percentage * 10000000);
            rewardMatch = ['', tokens.toLocaleString()];
          }
        }
        
        // Extract deliverables
        const deliverables: string[] = [];
        const criteriaMatch = body.match(/##\s*(?:✅\s*)?Acceptance Criteria\s*\n([\s\S]*?)(?=##|$)/i);
        if (criteriaMatch) {
          const criteria = criteriaMatch[1];
          const items = criteria.match(/- \[ \] .*/g) || [];
          items.forEach((item: string) => {
            deliverables.push(item.replace('- [ ] ', '').trim());
          });
        }
        
        // Determine contract status
        let status: Contract['status'] = 'available';
        if (issue.state === 'closed') {
          status = 'completed';
        } else if (matchingPR) {
          if (matchingPR.state === 'closed' && matchingPR.merged_at) {
            status = 'completed';
          } else if (matchingPR.state === 'open') {
            status = 'submitted';
          }
        } else if (issue.assignee) {
          status = 'in_progress';
        }
        
        // Determine category - exclude writing contracts
        const titleLower = issue.title.toLowerCase();
        const bodyLower = body.toLowerCase();
        
        if (titleLower.includes('content') || titleLower.includes('writing') || 
            titleLower.includes('documentation') || titleLower.includes('article') ||
            titleLower.includes('blog') || titleLower.includes('guide') ||
            titleLower.includes('tutorial') || titleLower.includes('copy') ||
            bodyLower.includes('content writing') || bodyLower.includes('technical writing') ||
            bodyLower.includes('blog post') || bodyLower.includes('article writing')) {
          return null; // Skip writing contracts
        }
        
        // Get contract from localStorage if it exists
        const storedContract = localStorage.getItem(`contract-${issue.number}`);
        const contractData = storedContract ? JSON.parse(storedContract) : null;
        
        return {
          id: `contract-${issue.number}`,
          githubIssueNumber: issue.number,
          githubIssueUrl: issue.html_url,
          title: issue.title,
          description: description,
          reward: rewardMatch ? `${rewardMatch[1]} BWRITER` : '2,000 BWRITER',
          estimatedHours: hoursMatch ? parseInt(hoursMatch[1].replace(/,/g, '')) : 8,
          priority: (priorityMatch ? priorityMatch[1] : 'Medium') as Contract['priority'],
          category: 'developer' as const,
          status,
          assignee: contractData?.assignee || (issue.assignee ? {
            githubUsername: issue.assignee.login,
            claimedAt: issue.assigned_at || new Date().toISOString(),
            deadline: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString()
          } : undefined),
          pullRequest: matchingPR ? {
            number: matchingPR.number,
            url: matchingPR.html_url,
            status: matchingPR.state
          } : undefined,
          skills,
          deliverables
        };
      });
      
      const filteredContracts: Contract[] = mappedContracts.filter((contract: Contract | null): contract is Contract => contract !== null);
      
      setContracts(filteredContracts);
      setLoading(false);
    } catch (error) {
      console.error('Failed to fetch contracts:', error);
      
      // Show a message directing users to GitHub
      setContracts([{
        id: 'github-redirect',
        githubIssueNumber: 0,
        githubIssueUrl: 'https://github.com/bitcoin-apps-suite/bitcoin-writer/issues',
        title: '📋 View Developer Contracts on GitHub',
        description: 'Unable to load contracts from GitHub API. Click to view all available developer contracts directly on GitHub.',
        priority: 'Low' as const,
        reward: 'Various',
        status: 'available' as const,
        category: 'developer' as const,
        estimatedHours: 0,
        skills: ['Visit GitHub'],
        deliverables: ['View and claim contracts on GitHub']
      }]);
      setLoading(false);
    }
  };

  const handleClaimContract = async () => {
    if (!selectedContract || !claimForm.githubUsername) return;
    
    // Store claim in localStorage
    const contractClaim = {
      id: selectedContract.id,
      githubIssueNumber: selectedContract.githubIssueNumber,
      assignee: {
        githubUsername: claimForm.githubUsername,
        handcashHandle: claimForm.handcashHandle,
        claimedAt: new Date().toISOString(),
        deadline: new Date(Date.now() + claimForm.estimatedDays * 24 * 60 * 60 * 1000).toISOString()
      }
    };
    
    localStorage.setItem(`contract-${selectedContract.githubIssueNumber}`, JSON.stringify(contractClaim));
    
    // Update local state
    const updatedContracts = contracts.map(c => 
      c.id === selectedContract.id 
        ? { ...c, status: 'claimed' as Contract['status'], assignee: contractClaim.assignee }
        : c
    );
    setContracts(updatedContracts);
    
    // Close modals
    setShowClaimModal(false);
    setSelectedContract(null);
    
    // Reset form
    setClaimForm({
      githubUsername: '',
      handcashHandle: '',
      estimatedDays: 7
    });
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

  return (
    <div className="App">
      <div className={`contracts-page ${!isMobile && !devSidebarCollapsed ? 'with-sidebar-expanded' : ''} ${!isMobile && devSidebarCollapsed ? 'with-sidebar-collapsed' : ''}`}>
        <div className="contracts-container">
          {/* Hero Section */}
          <section className="contracts-hero">
            <h1>Developer <span style={{color: '#ffffff'}}>Contracts</span></h1>
            <p className="contracts-tagline">
              Build features, fix bugs, earn BWRITER tokens
            </p>
            <div className="contracts-badge">DEVELOPER</div>
          </section>

          <div className="contracts-stats">
            <div className="stat-card">
              <span className="stat-value">{contracts.filter(c => c.status === 'available').length}</span>
              <span className="stat-label">Available</span>
            </div>
            <div className="stat-card">
              <span className="stat-value">{contracts.filter(c => c.status === 'in_progress' || c.status === 'claimed').length}</span>
              <span className="stat-label">In Progress</span>
            </div>
            <div className="stat-card">
              <span className="stat-value">{contracts.filter(c => c.status === 'submitted').length}</span>
              <span className="stat-label">Under Review</span>
            </div>
            <div className="stat-card">
              <span className="stat-value">{contracts.filter(c => c.status === 'completed').length}</span>
              <span className="stat-label">Completed</span>
            </div>
          </div>

          {loading ? (
            <div className="contracts-loading">Loading developer contracts...</div>
          ) : (
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
                <button className="modal-close" onClick={() => setSelectedContract(null)}>×</button>
                
                <h2>{selectedContract.title}</h2>
                
                <div className="modal-meta">
                  <span className={`priority-badge ${selectedContract.priority}`}>
                    {selectedContract.priority} Priority
                  </span>
                  <span className="reward-badge">{selectedContract.reward}</span>
                  <span className="time-badge">{selectedContract.estimatedHours} hours</span>
                </div>
                
                <div className="modal-section">
                  <h3>Description</h3>
                  <p>{selectedContract.description}</p>
                </div>
                
                <div className="modal-section">
                  <h3>Required Skills</h3>
                  <div className="skills-list">
                    {selectedContract.skills.map((skill, index) => (
                      <span key={index} className="skill-badge">{skill}</span>
                    ))}
                  </div>
                </div>
                
                {selectedContract.deliverables.length > 0 && (
                  <div className="modal-section">
                    <h3>Deliverables</h3>
                    <ul className="deliverables-list">
                      {selectedContract.deliverables.map((deliverable, index) => (
                        <li key={index}>{deliverable}</li>
                      ))}
                    </ul>
                  </div>
                )}
                
                <div className="modal-actions">
                  <a 
                    href={selectedContract.githubIssueUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="github-link"
                  >
                    View on GitHub →
                  </a>
                  <button 
                    className="claim-button"
                    onClick={() => setShowClaimModal(true)}
                  >
                    Claim Contract
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Claim Contract Modal */}
          {showClaimModal && selectedContract && (
            <div className="claim-modal" onClick={() => setShowClaimModal(false)}>
              <div className="claim-modal-content" onClick={(e) => e.stopPropagation()}>
                <button className="modal-close" onClick={() => setShowClaimModal(false)}>×</button>
                
                <h2>Claim Contract</h2>
                <p>Please provide your details to claim this contract</p>
                
                <div className="claim-form">
                  <div className="form-group">
                    <label>GitHub Username *</label>
                    <input 
                      type="text"
                      value={claimForm.githubUsername}
                      onChange={(e) => setClaimForm({...claimForm, githubUsername: e.target.value})}
                      placeholder="your-github-username"
                    />
                  </div>
                  
                  <div className="form-group">
                    <label>HandCash Handle (optional)</label>
                    <input 
                      type="text"
                      value={claimForm.handcashHandle}
                      onChange={(e) => setClaimForm({...claimForm, handcashHandle: e.target.value})}
                      placeholder="$yourhandle"
                    />
                  </div>
                  
                  <div className="form-group">
                    <label>Estimated Days to Complete</label>
                    <input 
                      type="number"
                      value={claimForm.estimatedDays}
                      onChange={(e) => setClaimForm({...claimForm, estimatedDays: parseInt(e.target.value) || 7})}
                      min="1"
                      max="30"
                    />
                  </div>
                  
                  <div className="claim-actions">
                    <button 
                      className="cancel-button"
                      onClick={() => setShowClaimModal(false)}
                    >
                      Cancel
                    </button>
                    <button 
                      className="submit-claim-button"
                      onClick={handleClaimContract}
                      disabled={!claimForm.githubUsername}
                    >
                      Claim Contract
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

export default DeveloperContractsPage;