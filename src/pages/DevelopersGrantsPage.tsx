import React, { useState, useEffect } from 'react';
import './ContractsPage.css';
import '../components/GrantSubmissionForm.css';
import Footer from '../components/Footer';
import GrantSubmissionForm from '../components/GrantSubmissionForm';
import { GrantSubmission } from '../types/NFTTypes';

interface DeveloperGrant {
  id: string;
  title: string;
  description: string;
  organization: string;
  amount: string;
  duration: string;
  deadline: string;
  status: 'open' | 'awarded' | 'closed';
  category: 'infrastructure' | 'protocol' | 'tooling' | 'research' | 'education';
  requirements: string[];
  tags: string[];
}

const DevelopersGrantsPage: React.FC = () => {
  const [grants, setGrants] = useState<DeveloperGrant[]>([]);
  const [selectedGrant, setSelectedGrant] = useState<DeveloperGrant | null>(null);
  const [showApplicationModal, setShowApplicationModal] = useState(false);
  const [showSubmissionForm, setShowSubmissionForm] = useState(false);
  const [submissions, setSubmissions] = useState<GrantSubmission[]>([]);
  const [devSidebarCollapsed, setDevSidebarCollapsed] = useState(() => {
    const saved = localStorage.getItem('devSidebarCollapsed');
    return saved === 'true';
  });
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  
  const [applicationForm, setApplicationForm] = useState({
    developerName: '',
    email: '',
    github: '',
    experience: '',
    timeline: '',
    budget: '',
    proposal: ''
  });

  useEffect(() => {
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
    
    setGrants([
      {
        id: 'dev-grant-001',
        title: 'BSV Scaling Solutions Development',
        description: 'Build innovative scaling solutions for Bitcoin SV blockchain including layer-2 protocols, payment channels, and transaction optimization tools.',
        organization: 'BSV Foundation',
        amount: '$50,000',
        duration: '6 months',
        deadline: '30 days',
        status: 'open',
        category: 'protocol',
        requirements: ['Blockchain development experience', 'Bitcoin protocol knowledge', 'Go or C++ proficiency'],
        tags: ['Scaling', 'Layer-2', 'Performance', 'Protocol']
      },
      {
        id: 'dev-grant-002',
        title: 'Smart Contract Developer Tools',
        description: 'Create comprehensive developer tools for BSV smart contracts including IDE plugins, testing frameworks, and deployment automation.',
        organization: 'SmartBSV Labs',
        amount: '$35,000',
        duration: '4 months',
        deadline: '21 days',
        status: 'open',
        category: 'tooling',
        requirements: ['JavaScript/TypeScript expertise', 'Smart contract experience', 'Tool development background'],
        tags: ['Smart Contracts', 'Developer Tools', 'IDE', 'Testing']
      },
      {
        id: 'dev-grant-003',
        title: 'Blockchain Infrastructure Research',
        description: 'Research and develop next-generation blockchain infrastructure focusing on consensus mechanisms, network optimization, and security protocols.',
        organization: 'Bitcoin Research Institute',
        amount: '$75,000',
        duration: '12 months',
        deadline: '45 days',
        status: 'open',
        category: 'research',
        requirements: ['PhD in Computer Science or equivalent', 'Distributed systems expertise', 'Published research'],
        tags: ['Research', 'Consensus', 'Security', 'Infrastructure']
      },
      {
        id: 'dev-grant-004',
        title: 'Educational Platform Development',
        description: 'Build interactive learning platform for blockchain development with hands-on tutorials, code examples, and real-time compilation.',
        organization: 'CryptoEd Foundation',
        amount: '$25,000',
        duration: '3 months',
        deadline: '14 days',
        status: 'awarded',
        category: 'education',
        requirements: ['Full-stack development', 'Educational content creation', 'UI/UX design skills'],
        tags: ['Education', 'Platform', 'Interactive', 'Tutorials']
      },
      {
        id: 'dev-grant-005',
        title: 'Cross-Chain Bridge Protocol',
        description: 'Develop secure cross-chain bridge enabling seamless asset transfers between BSV and other major blockchain networks.',
        organization: 'Interchain Labs',
        amount: '$100,000',
        duration: '8 months',
        deadline: '60 days',
        status: 'open',
        category: 'infrastructure',
        requirements: ['Cross-chain protocol experience', 'Cryptography knowledge', 'Security audit experience'],
        tags: ['Cross-Chain', 'Bridge', 'Interoperability', 'Security']
      }
    ]);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('resize', handleResize);
      clearInterval(checkSidebarState);
    };
  }, []);

  const handleApplyToGrant = () => {
    console.log('Grant application submitted:', applicationForm);
    
    if (selectedGrant) {
      const updatedGrants = grants.map(g => 
        g.id === selectedGrant.id 
          ? { ...g, status: 'awarded' as DeveloperGrant['status'] }
          : g
      );
      setGrants(updatedGrants);
    }
    
    setShowApplicationModal(false);
    setSelectedGrant(null);
    setApplicationForm({
      developerName: '',
      email: '',
      github: '',
      experience: '',
      timeline: '',
      budget: '',
      proposal: ''
    });
  };

  const getStatusColor = (status: DeveloperGrant['status']) => {
    switch (status) {
      case 'open': return '#22c55e';
      case 'awarded': return '#3b82f6';
      case 'closed': return '#6b7280';
      default: return '#6b7280';
    }
  };

  const getCategoryColor = (category: DeveloperGrant['category']) => {
    switch (category) {
      case 'infrastructure': return '#FF6B35';
      case 'protocol': return '#F7931E';
      case 'tooling': return '#3b82f6';
      case 'research': return '#8b5cf6';
      case 'education': return '#22c55e';
      default: return '#6b7280';
    }
  };

  const handleSubmissionComplete = (submission: GrantSubmission) => {
    setSubmissions(prev => [submission, ...prev]);
    setShowSubmissionForm(false);
  };

  return (
    <div className="App">
      <div className={`contracts-page ${!isMobile && !devSidebarCollapsed ? 'with-sidebar-expanded' : ''} ${!isMobile && devSidebarCollapsed ? 'with-sidebar-collapsed' : ''}`}>
        <div className="contracts-container">
          {showSubmissionForm ? (
            <>
              <div className="back-navigation">
                <button 
                  onClick={() => setShowSubmissionForm(false)}
                  className="back-button"
                >
                  ← Back to Developer Grants
                </button>
              </div>
              <GrantSubmissionForm 
                applicantType="developer"
                onSubmissionComplete={handleSubmissionComplete}
              />
            </>
          ) : (
            <>
              <section className="contracts-hero">
                <h1>Development <span style={{color: '#ffffff'}}>Grants</span></h1>
                <p className="contracts-tagline">
                  Build the future of blockchain technology with funding support
                </p>
                <div className="contracts-badge">DEVELOPERS</div>
                
                <div className="hero-actions">
                  <button 
                    onClick={() => setShowSubmissionForm(true)}
                    className="primary-cta-button"
                  >
                    Submit New Grant Application (.nft)
                  </button>
                </div>
              </section>

          <div className="contracts-stats">
            <div className="stat-card">
              <span className="stat-value">{grants.filter(g => g.status === 'open').length}</span>
              <span className="stat-label">Open</span>
            </div>
            <div className="stat-card">
              <span className="stat-value">{grants.filter(g => g.status === 'awarded').length}</span>
              <span className="stat-label">Awarded</span>
            </div>
            <div className="stat-card">
              <span className="stat-value">{grants.reduce((sum, g) => sum + parseInt(g.amount.replace(/[^0-9]/g, '')), 0).toLocaleString()}</span>
              <span className="stat-label">Total Funding</span>
            </div>
            <div className="stat-card">
              <span className="stat-value">{Math.round(grants.reduce((sum, g) => sum + parseInt(g.duration.replace(/[^0-9]/g, '')), 0) / grants.length)}</span>
              <span className="stat-label">Avg Duration (mo)</span>
            </div>
          </div>

          {submissions.length > 0 && (
            <section className="submissions-section">
              <h2>Your Recent Submissions</h2>
              <div className="submissions-grid">
                {submissions.map((submission, index) => (
                  <div key={index} className="submission-card">
                    <h3>{submission.metadata.title}</h3>
                    <p>Status: {submission.metadata.grantInfo?.applicationStatus}</p>
                    {submission.metadata.grantInfo?.bwriterAward && (
                      <div className="bwriter-award">
                        Awarded: {submission.metadata.grantInfo.bwriterAward} $BWRITER
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </section>
          )}

          <div className="contracts-grid">
            {grants.map(grant => (
              <div 
                key={grant.id} 
                className={`contract-card ${grant.status !== 'open' ? 'contract-unavailable' : ''}`}
                onClick={() => grant.status === 'open' && setSelectedGrant(grant)}
              >
                <div className="contract-header">
                  <h3>{grant.title}</h3>
                  <span 
                    className="contract-status"
                    style={{ background: getStatusColor(grant.status) }}
                  >
                    {grant.status.toUpperCase()}
                  </span>
                </div>
                
                <p className="contract-description">{grant.description}</p>
                
                <div className="contract-meta">
                  <span 
                    className="contract-type"
                    style={{ background: getCategoryColor(grant.category), color: '#fff', padding: '4px 10px', borderRadius: '12px', fontSize: '12px' }}
                  >
                    {grant.category}
                  </span>
                  <span className="contract-reward">{grant.amount}</span>
                  <span className="contract-words">{grant.duration}</span>
                </div>

                <div className="contract-details">
                  <div className="detail-row">
                    <span className="detail-label">Organization:</span>
                    <span className="detail-value">{grant.organization}</span>
                  </div>
                  <div className="detail-row">
                    <span className="detail-label">Deadline:</span>
                    <span className="detail-value">{grant.deadline}</span>
                  </div>
                </div>

                <div className="contract-topics">
                  {grant.tags.slice(0, 3).map((tag, index) => (
                    <span key={index} className="topic-tag">{tag}</span>
                  ))}
                  {grant.tags.length > 3 && (
                    <span className="topic-tag">+{grant.tags.length - 3}</span>
                  )}
                </div>
              </div>
            ))}
          </div>

          {selectedGrant && (
            <div className="contract-modal" onClick={() => setSelectedGrant(null)}>
              <div className="contract-modal-content" onClick={(e) => e.stopPropagation()}>
                <button className="modal-close" onClick={() => setSelectedGrant(null)}>×</button>
                
                <h2>{selectedGrant.title}</h2>
                
                <div className="modal-meta">
                  <span 
                    className="type-badge"
                    style={{ background: getCategoryColor(selectedGrant.category), color: '#fff' }}
                  >
                    {selectedGrant.category}
                  </span>
                  <span className="reward-badge">{selectedGrant.amount}</span>
                  <span className="words-badge">{selectedGrant.duration}</span>
                  <span className="deadline-badge">{selectedGrant.deadline}</span>
                </div>
                
                <div className="modal-section">
                  <h3>Organization</h3>
                  <p>{selectedGrant.organization}</p>
                </div>
                
                <div className="modal-section">
                  <h3>Description</h3>
                  <p>{selectedGrant.description}</p>
                </div>

                <div className="modal-section">
                  <h3>Requirements</h3>
                  <ul>
                    {selectedGrant.requirements.map((req, index) => (
                      <li key={index}>{req}</li>
                    ))}
                  </ul>
                </div>
                
                <div className="modal-section">
                  <h3>Tags</h3>
                  <div className="topics-list">
                    {selectedGrant.tags.map((tag, index) => (
                      <span key={index} className="topic-badge">{tag}</span>
                    ))}
                  </div>
                </div>
                
                <div className="modal-actions">
                  <button 
                    className="claim-button"
                    onClick={() => setShowApplicationModal(true)}
                  >
                    Apply for Grant
                  </button>
                </div>
              </div>
            </div>
          )}

          {showApplicationModal && selectedGrant && (
            <div className="claim-modal" onClick={() => setShowApplicationModal(false)}>
              <div className="claim-modal-content" onClick={(e) => e.stopPropagation()}>
                <button className="modal-close" onClick={() => setShowApplicationModal(false)}>×</button>
                
                <h2>Apply for Development Grant</h2>
                <p>Submit your proposal for: {selectedGrant.title}</p>
                
                <div className="claim-form">
                  <div className="form-group">
                    <label>Your Name *</label>
                    <input 
                      type="text"
                      value={applicationForm.developerName}
                      onChange={(e) => setApplicationForm({...applicationForm, developerName: e.target.value})}
                      placeholder="John Doe"
                    />
                  </div>
                  
                  <div className="form-group">
                    <label>Email *</label>
                    <input 
                      type="email"
                      value={applicationForm.email}
                      onChange={(e) => setApplicationForm({...applicationForm, email: e.target.value})}
                      placeholder="developer@example.com"
                    />
                  </div>
                  
                  <div className="form-group">
                    <label>GitHub Profile *</label>
                    <input 
                      type="url"
                      value={applicationForm.github}
                      onChange={(e) => setApplicationForm({...applicationForm, github: e.target.value})}
                      placeholder="https://github.com/username"
                    />
                  </div>
                  
                  <div className="form-group">
                    <label>Relevant Experience</label>
                    <textarea 
                      value={applicationForm.experience}
                      onChange={(e) => setApplicationForm({...applicationForm, experience: e.target.value})}
                      placeholder="Describe your relevant experience and previous projects"
                      rows={3}
                    />
                  </div>
                  
                  <div className="form-group">
                    <label>Proposed Timeline</label>
                    <input 
                      type="text"
                      value={applicationForm.timeline}
                      onChange={(e) => setApplicationForm({...applicationForm, timeline: e.target.value})}
                      placeholder="6 months"
                    />
                  </div>
                  
                  <div className="form-group">
                    <label>Budget Breakdown</label>
                    <textarea 
                      value={applicationForm.budget}
                      onChange={(e) => setApplicationForm({...applicationForm, budget: e.target.value})}
                      placeholder="Provide a detailed budget breakdown"
                      rows={3}
                    />
                  </div>
                  
                  <div className="form-group">
                    <label>Project Proposal *</label>
                    <textarea 
                      value={applicationForm.proposal}
                      onChange={(e) => setApplicationForm({...applicationForm, proposal: e.target.value})}
                      placeholder="Detailed technical proposal outlining your approach, milestones, and deliverables"
                      rows={6}
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
                      onClick={handleApplyToGrant}
                      disabled={!applicationForm.developerName || !applicationForm.email || !applicationForm.proposal}
                    >
                      Submit Application
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
            </>
          )}
        </div>
        <Footer />
      </div>
    </div>
  );
};

export default DevelopersGrantsPage;