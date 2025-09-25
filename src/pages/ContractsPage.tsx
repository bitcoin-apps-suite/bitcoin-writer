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

const ContractsPage: React.FC = () => {
  const [contracts, setContracts] = useState<Contract[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedContract, setSelectedContract] = useState<Contract | null>(null);
  const [showClaimModal, setShowClaimModal] = useState(false);
  const [handcashService] = useState(new HandCashService());
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [activeTab, setActiveTab] = useState<'developer' | 'writing'>('developer');
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
      
      // Check for errors
      if (!response.ok) {
        console.warn('GitHub API response not OK:', response.status);
        throw new Error(`GitHub API error: ${response.status}`);
      }
      
      const issues = await response.json();
      
      // Check for rate limiting
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
      
      // Map issues to contracts
      const mappedContracts: Contract[] = issues.map((issue: any) => {
        const body = issue.body || '';
        
        // Handle both old and new format
        let priorityMatch = body.match(/\*\*Priority:\*\*\s*(Critical|High|Medium|Low)/i);
        let hoursMatch = body.match(/\*\*Estimated Hours:\*\*\s*([\d,]+)/i);
        let rewardMatch = body.match(/\*\*Token Reward:\*\*\s*([\d,]+)\s*BWRITER/i);
        let categoryMatch = body.match(/\*\*Category:\*\*\s*([^\n]+)/i);
        
        // Find matching PR if exists
        const matchingPR = pullRequests.find((pr: any) => 
          pr.body && pr.body.includes(`#${issue.number}`)
        );
        
        // Extract description - new format with emoji headers
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
          if (requirements.includes('IPFS')) skills.push('IPFS');
          if (requirements.includes('micro-ordinals')) skills.push('Ordinals');
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
        
        // Extract deliverables - handle both formats
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
        
        // Determine category based on title, labels, and content
        let category: 'developer' | 'writing' = 'developer';
        const titleLower = issue.title.toLowerCase();
        const bodyLower = body.toLowerCase();
        
        // Check for writing-related keywords
        if (titleLower.includes('content') || titleLower.includes('writing') || 
            titleLower.includes('documentation') || titleLower.includes('article') ||
            titleLower.includes('blog') || titleLower.includes('guide') ||
            titleLower.includes('tutorial') || titleLower.includes('copy') ||
            bodyLower.includes('content writing') || bodyLower.includes('technical writing') ||
            bodyLower.includes('blog post') || bodyLower.includes('article writing')) {
          category = 'writing';
        }
        
        // Check labels if available
        if (issue.labels && Array.isArray(issue.labels)) {
          const labelNames = issue.labels.map((label: any) => 
            typeof label === 'string' ? label : label.name
          ).join(' ').toLowerCase();
          
          if (labelNames.includes('writing') || labelNames.includes('content') ||
              labelNames.includes('documentation') || labelNames.includes('blog')) {
            category = 'writing';
          }
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
          category: category,
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
          skills: Array.from(new Set(skills)), // Remove duplicates
          deliverables: deliverables.length > 0 ? deliverables.slice(0, 8) : ['See issue for details']
        };
      });
      
      setContracts(mappedContracts);
      setLoading(false);
    } catch (error) {
      console.error('Failed to fetch contracts:', error);
      
      // Show a message directing users to GitHub
      setContracts([
        {
          id: 'github-redirect',
          githubIssueNumber: 0,
          githubIssueUrl: 'https://github.com/bitcoin-apps-suite/bitcoin-writer/issues',
          title: '📋 View Contracts on GitHub',
          description: 'Unable to load contracts from GitHub API. This may be due to rate limiting or network issues. Click below to view all available contracts directly on GitHub.',
          priority: 'Low' as const,
          reward: 'Various',
          status: 'available' as const,
          category: 'developer' as const,
          estimatedHours: 0,
          skills: ['Visit GitHub'],
          deliverables: ['View and claim contracts on GitHub', 'Create new issues', 'Discuss bounties']
        }
      ]);
      setLoading(false);
    }
  };

  const handleClaimContract = async () => {
    if (!selectedContract || !claimForm.githubUsername || !claimForm.handcashHandle) {
      alert('Please fill in all required fields');
      return;
    }
    
    // Calculate deadline
    const deadline = new Date();
    deadline.setDate(deadline.getDate() + claimForm.estimatedDays);
    
    // Store contract claim locally (in production, this would go to backend)
    const contractClaim = {
      assignee: {
        githubUsername: claimForm.githubUsername,
        handcashHandle: claimForm.handcashHandle,
        claimedAt: new Date().toISOString(),
        deadline: deadline.toISOString()
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

  return (
    <div className="App">
      <div className={`contracts-page ${!isMobile && !devSidebarCollapsed ? 'with-sidebar-expanded' : ''} ${!isMobile && devSidebarCollapsed ? 'with-sidebar-collapsed' : ''}`}>
        <div className="contracts-container">
          {/* Hero Section */}
          <section className="contracts-hero">
            <h1>Bitcoin Writer <span style={{color: '#ffffff'}}>Contracts</span></h1>
            <p className="contracts-tagline">
              {activeTab === 'developer' 
                ? 'Claim contracts, deliver code, earn BWRITER tokens'
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

      <div className="contracts-stats">
        <div className="stat-card">
          <span className="stat-value">{contracts.filter(c => c.category === activeTab && c.status === 'available').length}</span>
          <span className="stat-label">Available</span>
        </div>
        <div className="stat-card">
          <span className="stat-value">{contracts.filter(c => c.category === activeTab && (c.status === 'in_progress' || c.status === 'claimed')).length}</span>
          <span className="stat-label">In Progress</span>
        </div>
        <div className="stat-card">
          <span className="stat-value">{contracts.filter(c => c.category === activeTab && c.status === 'submitted').length}</span>
          <span className="stat-label">Under Review</span>
        </div>
        <div className="stat-card">
          <span className="stat-value">{contracts.filter(c => c.category === activeTab && c.status === 'completed').length}</span>
          <span className="stat-label">Completed</span>
        </div>
      </div>

      {loading ? (
        <div className="contracts-loading">Loading contracts...</div>
      ) : (
        <div className="contracts-grid">
          {contracts.filter(c => c.category === activeTab).map(contract => (
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
                <span className="contract-priority priority-{contract.priority.toLowerCase()}">
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
              <span className="priority-badge priority-{selectedContract.priority.toLowerCase()}">
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

            <div className="contract-modal-section">
              <h3>Sign in to Claim</h3>
              <div className="auth-options">
                <button className="auth-button github-auth">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                  </svg>
                  Sign in with GitHub
                </button>
                <button className="auth-button google-auth">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                  </svg>
                  Sign in with Google
                </button>
                <button className="auth-button handcash-auth">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm.31-8.86c-1.77-.45-2.34-.94-2.34-1.67 0-.84.79-1.43 2.1-1.43 1.38 0 1.9.66 1.94 1.64h1.71c-.05-1.34-.87-2.57-2.49-2.97V5H10.9v1.69c-1.51.32-2.72 1.3-2.72 2.81 0 1.79 1.49 2.69 3.66 3.21 1.95.46 2.34 1.15 2.34 1.87 0 .53-.39 1.39-2.1 1.39-1.6 0-2.23-.72-2.32-1.64H8.04c.1 1.7 1.36 2.66 2.86 2.97V19h2.34v-1.67c1.52-.29 2.72-1.16 2.73-2.77-.01-2.2-1.9-2.96-3.66-3.42z"/>
                  </svg>
                  Sign in with HandCash
                </button>
              </div>
            </div>

            <div className="contract-actions">
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
      <Footer />
    </div>
  );
};

export default ContractsPage;