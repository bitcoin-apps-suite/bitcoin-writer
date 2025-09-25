import React, { useState, useEffect } from 'react';
import './ContractsPage.css';
import Footer from '../components/Footer';

interface AuthorGrant {
  id: string;
  title: string;
  description: string;
  organization: string;
  amount: string;
  duration: string;
  deadline: string;
  status: 'open' | 'awarded' | 'closed';
  category: 'content' | 'research' | 'documentation' | 'education' | 'marketing';
  requirements: string[];
  tags: string[];
}

const AuthorsGrantsPage: React.FC = () => {
  const [grants, setGrants] = useState<AuthorGrant[]>([]);
  const [selectedGrant, setSelectedGrant] = useState<AuthorGrant | null>(null);
  const [showApplicationModal, setShowApplicationModal] = useState(false);
  const [devSidebarCollapsed, setDevSidebarCollapsed] = useState(() => {
    const saved = localStorage.getItem('devSidebarCollapsed');
    return saved === 'true';
  });
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  
  const [applicationForm, setApplicationForm] = useState({
    authorName: '',
    email: '',
    portfolio: '',
    experience: '',
    samples: '',
    timeline: '',
    approach: ''
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
        id: 'author-grant-001',
        title: 'Blockchain Education Content Series',
        description: 'Create comprehensive educational content series covering blockchain fundamentals, smart contracts, and practical applications for beginners.',
        organization: 'CryptoEd Foundation',
        amount: '$15,000',
        duration: '4 months',
        deadline: '28 days',
        status: 'open',
        category: 'education',
        requirements: ['Educational writing experience', 'Blockchain knowledge', 'Clear communication skills'],
        tags: ['Education', 'Blockchain', 'Tutorial', 'Beginner-friendly']
      },
      {
        id: 'author-grant-002',
        title: 'Technical Documentation Project',
        description: 'Develop comprehensive technical documentation for BSV protocol updates, including developer guides and API references.',
        organization: 'BSV Foundation',
        amount: '$20,000',
        duration: '3 months',
        deadline: '21 days',
        status: 'open',
        category: 'documentation',
        requirements: ['Technical writing expertise', 'Software documentation experience', 'BSV protocol knowledge'],
        tags: ['Documentation', 'Technical', 'Protocol', 'Developers']
      },
      {
        id: 'author-grant-003',
        title: 'DeFi Research Publication',
        description: 'Research and publish comprehensive analysis of decentralized finance trends, focusing on BSV ecosystem opportunities.',
        organization: 'Blockchain Research Institute',
        amount: '$25,000',
        duration: '6 months',
        deadline: '35 days',
        status: 'open',
        category: 'research',
        requirements: ['Research experience', 'Financial background', 'Published work portfolio'],
        tags: ['Research', 'DeFi', 'Analysis', 'Publication']
      },
      {
        id: 'author-grant-004',
        title: 'Community Content Campaign',
        description: 'Create engaging content campaign to promote BSV adoption including blog posts, social media content, and video scripts.',
        organization: 'BSV Marketing Collective',
        amount: '$12,000',
        duration: '2 months',
        deadline: '14 days',
        status: 'awarded',
        category: 'marketing',
        requirements: ['Marketing content experience', 'Social media expertise', 'Creative writing skills'],
        tags: ['Marketing', 'Social Media', 'Campaign', 'Community']
      },
      {
        id: 'author-grant-005',
        title: 'Industry Case Studies Collection',
        description: 'Document real-world blockchain implementations across various industries, creating detailed case studies for business audiences.',
        organization: 'Enterprise Blockchain Alliance',
        amount: '$18,000',
        duration: '5 months',
        deadline: '42 days',
        status: 'open',
        category: 'content',
        requirements: ['Business writing experience', 'Industry research skills', 'Interview capabilities'],
        tags: ['Case Studies', 'Business', 'Industry', 'Enterprise']
      },
      {
        id: 'author-grant-006',
        title: 'Developer Onboarding Guides',
        description: 'Write comprehensive onboarding guides for new blockchain developers, covering tools, best practices, and common pitfalls.',
        organization: 'Developer Relations Council',
        amount: '$10,000',
        duration: '2 months',
        deadline: '18 days',
        status: 'open',
        category: 'education',
        requirements: ['Developer experience', 'Technical writing', 'Teaching ability'],
        tags: ['Onboarding', 'Developers', 'Guides', 'Best Practices']
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
          ? { ...g, status: 'awarded' as AuthorGrant['status'] }
          : g
      );
      setGrants(updatedGrants);
    }
    
    setShowApplicationModal(false);
    setSelectedGrant(null);
    setApplicationForm({
      authorName: '',
      email: '',
      portfolio: '',
      experience: '',
      samples: '',
      timeline: '',
      approach: ''
    });
  };

  const getStatusColor = (status: AuthorGrant['status']) => {
    switch (status) {
      case 'open': return '#22c55e';
      case 'awarded': return '#3b82f6';
      case 'closed': return '#6b7280';
      default: return '#6b7280';
    }
  };

  const getCategoryColor = (category: AuthorGrant['category']) => {
    switch (category) {
      case 'content': return '#FF6B35';
      case 'research': return '#8b5cf6';
      case 'documentation': return '#3b82f6';
      case 'education': return '#22c55e';
      case 'marketing': return '#F7931E';
      default: return '#6b7280';
    }
  };

  return (
    <div className="App">
      <div className={`contracts-page ${!isMobile && !devSidebarCollapsed ? 'with-sidebar-expanded' : ''} ${!isMobile && devSidebarCollapsed ? 'with-sidebar-collapsed' : ''}`}>
        <div className="contracts-container">
          <section className="contracts-hero">
            <h1>Writing <span style={{color: '#ffffff'}}>Grants</span></h1>
            <p className="contracts-tagline">
              Fund your creative projects and contribute to blockchain education
            </p>
            <div className="contracts-badge">AUTHORS</div>
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
              <span className="stat-value">${grants.reduce((sum, g) => sum + parseInt(g.amount.replace(/[^0-9]/g, '')), 0).toLocaleString()}</span>
              <span className="stat-label">Total Funding</span>
            </div>
            <div className="stat-card">
              <span className="stat-value">{Math.round(grants.reduce((sum, g) => sum + parseInt(g.duration.replace(/[^0-9]/g, '')), 0) / grants.length)}</span>
              <span className="stat-label">Avg Duration (mo)</span>
            </div>
          </div>

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
                
                <h2>Apply for Writing Grant</h2>
                <p>Submit your proposal for: {selectedGrant.title}</p>
                
                <div className="claim-form">
                  <div className="form-group">
                    <label>Your Name *</label>
                    <input 
                      type="text"
                      value={applicationForm.authorName}
                      onChange={(e) => setApplicationForm({...applicationForm, authorName: e.target.value})}
                      placeholder="Jane Smith"
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
                    <label>Portfolio Website</label>
                    <input 
                      type="url"
                      value={applicationForm.portfolio}
                      onChange={(e) => setApplicationForm({...applicationForm, portfolio: e.target.value})}
                      placeholder="https://your-portfolio.com"
                    />
                  </div>
                  
                  <div className="form-group">
                    <label>Relevant Experience *</label>
                    <textarea 
                      value={applicationForm.experience}
                      onChange={(e) => setApplicationForm({...applicationForm, experience: e.target.value})}
                      placeholder="Describe your relevant writing experience and qualifications"
                      rows={3}
                    />
                  </div>
                  
                  <div className="form-group">
                    <label>Writing Samples</label>
                    <textarea 
                      value={applicationForm.samples}
                      onChange={(e) => setApplicationForm({...applicationForm, samples: e.target.value})}
                      placeholder="Provide links to relevant writing samples or attach excerpts"
                      rows={3}
                    />
                  </div>
                  
                  <div className="form-group">
                    <label>Proposed Timeline</label>
                    <input 
                      type="text"
                      value={applicationForm.timeline}
                      onChange={(e) => setApplicationForm({...applicationForm, timeline: e.target.value})}
                      placeholder="4 months with monthly milestones"
                    />
                  </div>
                  
                  <div className="form-group">
                    <label>Project Approach *</label>
                    <textarea 
                      value={applicationForm.approach}
                      onChange={(e) => setApplicationForm({...applicationForm, approach: e.target.value})}
                      placeholder="Outline your approach to this project, including research methods, content structure, and delivery plan"
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
                      disabled={!applicationForm.authorName || !applicationForm.email || !applicationForm.experience || !applicationForm.approach}
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

export default AuthorsGrantsPage;