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
      
      // Set sample contracts as fallback
      setContracts([
        {
          id: 'sample-1',
          title: 'Implement Markdown Import/Export',
          description: 'Add support for importing and exporting documents in Markdown format',
          difficulty: 'Medium',
          priority: 'High',
          reward: '35,000 BWRITER',
          status: 'available',
          deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
          skills: ['TypeScript', 'React', 'Markdown'],
          githubIssue: 1,
          estimatedHours: 25
        },
        {
          id: 'sample-2',
          title: 'Add Version Control System',
          description: 'Implement document versioning with diff view and rollback capabilities',
          difficulty: 'Hard',
          priority: 'Medium',
          reward: '75,000 BWRITER',
          status: 'available',
          deadline: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000).toISOString(),
          skills: ['TypeScript', 'React', 'Git', 'Diff Algorithms'],
          githubIssue: 2,
          estimatedHours: 60
        },
        {
          id: 'sample-3',
          title: 'Integrate Spell Check API',
          description: 'Add real-time spell checking with suggestions and auto-correction',
          difficulty: 'Easy',
          priority: 'Low',
          reward: '20,000 BWRITER',
          status: 'available',
          deadline: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(),
          skills: ['TypeScript', 'React', 'APIs'],
          githubIssue: 3,
          estimatedHours: 15
        },
        {
          id: 'sample-4',
          title: 'Build Plugin Architecture',
          description: 'Create extensible plugin system for third-party integrations',
          difficulty: 'Critical',
          priority: 'High',
          reward: '150,000 BWRITER',
          status: 'claimed',
          deadline: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000).toISOString(),
          skills: ['TypeScript', 'React', 'Plugin Architecture', 'API Design'],
          githubIssue: 4,
          estimatedHours: 100,
          assignee: {
            githubUsername: 'developer123',
            handcashHandle: '$dev123'
          }
        },
        {
          id: 'sample-5',
          title: 'Add Tables Support',
          description: 'Implement table creation and editing with formatting options',
          difficulty: 'Medium',
          priority: 'Medium',
          reward: '40,000 BWRITER',
          status: 'in_progress',
          deadline: new Date(Date.now() + 21 * 24 * 60 * 60 * 1000).toISOString(),
          skills: ['TypeScript', 'React', 'CSS', 'ContentEditable'],
          githubIssue: 5,
          estimatedHours: 30,
          assignee: {
            githubUsername: 'contributor456',
            handcashHandle: '$contrib456'
          },
          progress: 65
        },
        {
          id: 'sample-note',
          title: '⚠️ Unable to Load Live Contracts',
          description: 'These are sample contracts. Visit GitHub to see the latest available contracts. The API may be temporarily unavailable.',
          difficulty: 'Easy',
          priority: 'Low',
          reward: 'Various',
          status: 'available',
          deadline: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
          skills: ['GitHub'],
          githubIssue: 0,
          estimatedHours: 1
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
            <h1>Developer <span style={{color: '#ffffff'}}>Contracts</span></h1>
            <p className="contracts-tagline">
              Claim contracts, deliver code, earn BWRITER tokens
            </p>
            <div className="contracts-badge">CONTRACTS</div>
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
        <div className="contracts-loading">Loading contracts...</div>
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

            <div className="contract-actions">
              <a 
                href={selectedContract.githubIssueUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="github-button"
              >
                View on GitHub →
              </a>
              <button 
                className="claim-button"
                onClick={() => setShowClaimModal(true)}
                disabled={!isAuthenticated}
              >
                {isAuthenticated ? 'Claim Contract' : 'Login to Claim'}
              </button>
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