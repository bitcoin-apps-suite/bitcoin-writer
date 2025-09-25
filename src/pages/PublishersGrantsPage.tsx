import React, { useState, useEffect } from 'react';
import './ContractsPage.css';
import Footer from '../components/Footer';

interface PublisherGrant {
  id: string;
  title: string;
  description: string;
  organization: string;
  amount: string;
  duration: string;
  deadline: string;
  status: 'open' | 'awarded' | 'closed';
  category: 'platform' | 'content' | 'distribution' | 'innovation' | 'infrastructure';
  requirements: string[];
  tags: string[];
}

const PublishersGrantsPage: React.FC = () => {
  const [grants, setGrants] = useState<PublisherGrant[]>([]);
  const [selectedGrant, setSelectedGrant] = useState<PublisherGrant | null>(null);
  const [showApplicationModal, setShowApplicationModal] = useState(false);
  const [devSidebarCollapsed, setDevSidebarCollapsed] = useState(() => {
    const saved = localStorage.getItem('devSidebarCollapsed');
    return saved === 'true';
  });
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  
  const [applicationForm, setApplicationForm] = useState({
    publisherName: '',
    email: '',
    website: '',
    experience: '',
    audience: '',
    timeline: '',
    strategy: ''
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
        id: 'pub-grant-001',
        title: 'Blockchain Media Platform Development',
        description: 'Build comprehensive media platform for blockchain content distribution with integrated micropayments and content monetization features.',
        organization: 'Digital Publishing Alliance',
        amount: '$75,000',
        duration: '8 months',
        deadline: '35 days',
        status: 'open',
        category: 'platform',
        requirements: ['Publishing platform experience', 'Blockchain integration knowledge', 'Content management expertise'],
        tags: ['Platform', 'Micropayments', 'Content', 'Monetization']
      },
      {
        id: 'pub-grant-002',
        title: 'Content Distribution Network',
        description: 'Develop decentralized content distribution network leveraging BSV blockchain for transparent royalty distribution and content verification.',
        organization: 'Content Creators Collective',
        amount: '$50,000',
        duration: '6 months',
        deadline: '28 days',
        status: 'open',
        category: 'distribution',
        requirements: ['CDN development experience', 'Blockchain technology', 'Scalable architecture design'],
        tags: ['CDN', 'Distribution', 'Royalties', 'Verification']
      },
      {
        id: 'pub-grant-003',
        title: 'Educational Content Publishing Initiative',
        description: 'Create comprehensive educational publishing platform for blockchain learning materials with interactive features and progress tracking.',
        organization: 'Education Innovation Fund',
        amount: '$40,000',
        duration: '5 months',
        deadline: '21 days',
        status: 'open',
        category: 'content',
        requirements: ['Educational technology background', 'Publishing experience', 'Interactive content development'],
        tags: ['Education', 'Interactive', 'Learning', 'Tracking']
      },
      {
        id: 'pub-grant-004',
        title: 'Decentralized Publishing Protocol',
        description: 'Research and develop innovative publishing protocol enabling censorship-resistant content distribution with built-in monetization.',
        organization: 'Freedom Press Foundation',
        amount: '$100,000',
        duration: '12 months',
        deadline: '45 days',
        status: 'awarded',
        category: 'innovation',
        requirements: ['Protocol development', 'Distributed systems', 'Publishing industry knowledge'],
        tags: ['Protocol', 'Censorship-resistant', 'Innovation', 'Monetization']
      },
      {
        id: 'pub-grant-005',
        title: 'Publisher Analytics Dashboard',
        description: 'Build comprehensive analytics platform for blockchain publishers with real-time metrics, revenue tracking, and audience insights.',
        organization: 'Publisher Tech Alliance',
        amount: '$30,000',
        duration: '4 months',
        deadline: '18 days',
        status: 'open',
        category: 'platform',
        requirements: ['Analytics platform experience', 'Data visualization', 'Publishing metrics knowledge'],
        tags: ['Analytics', 'Dashboard', 'Metrics', 'Revenue']
      },
      {
        id: 'pub-grant-006',
        title: 'Content Infrastructure Scaling',
        description: 'Develop scalable infrastructure solutions for high-volume content publishing on blockchain with optimized storage and retrieval.',
        organization: 'Blockchain Infrastructure Consortium',
        amount: '$60,000',
        duration: '7 months',
        deadline: '30 days',
        status: 'open',
        category: 'infrastructure',
        requirements: ['Infrastructure development', 'Scaling expertise', 'Blockchain storage solutions'],
        tags: ['Infrastructure', 'Scaling', 'Storage', 'Performance']
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
          ? { ...g, status: 'awarded' as PublisherGrant['status'] }
          : g
      );
      setGrants(updatedGrants);
    }
    
    setShowApplicationModal(false);
    setSelectedGrant(null);
    setApplicationForm({
      publisherName: '',
      email: '',
      website: '',
      experience: '',
      audience: '',
      timeline: '',
      strategy: ''
    });
  };

  const getStatusColor = (status: PublisherGrant['status']) => {
    switch (status) {
      case 'open': return '#22c55e';
      case 'awarded': return '#3b82f6';
      case 'closed': return '#6b7280';
      default: return '#6b7280';
    }
  };

  const getCategoryColor = (category: PublisherGrant['category']) => {
    switch (category) {
      case 'platform': return '#FF6B35';
      case 'content': return '#F7931E';
      case 'distribution': return '#3b82f6';
      case 'innovation': return '#8b5cf6';
      case 'infrastructure': return '#22c55e';
      default: return '#6b7280';
    }
  };

  return (
    <div className="App">
      <div className={`contracts-page ${!isMobile && !devSidebarCollapsed ? 'with-sidebar-expanded' : ''} ${!isMobile && devSidebarCollapsed ? 'with-sidebar-collapsed' : ''}`}>
        <div className="contracts-container">
          <section className="contracts-hero">
            <h1>Publishing <span style={{color: '#ffffff'}}>Grants</span></h1>
            <p className="contracts-tagline">
              Scale your publishing platform with blockchain technology funding
            </p>
            <div className="contracts-badge">PUBLISHERS</div>
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
                
                <h2>Apply for Publishing Grant</h2>
                <p>Submit your proposal for: {selectedGrant.title}</p>
                
                <div className="claim-form">
                  <div className="form-group">
                    <label>Publisher/Organization Name *</label>
                    <input 
                      type="text"
                      value={applicationForm.publisherName}
                      onChange={(e) => setApplicationForm({...applicationForm, publisherName: e.target.value})}
                      placeholder="Digital Publishing Co."
                    />
                  </div>
                  
                  <div className="form-group">
                    <label>Email *</label>
                    <input 
                      type="email"
                      value={applicationForm.email}
                      onChange={(e) => setApplicationForm({...applicationForm, email: e.target.value})}
                      placeholder="publisher@example.com"
                    />
                  </div>
                  
                  <div className="form-group">
                    <label>Website/Platform URL</label>
                    <input 
                      type="url"
                      value={applicationForm.website}
                      onChange={(e) => setApplicationForm({...applicationForm, website: e.target.value})}
                      placeholder="https://your-platform.com"
                    />
                  </div>
                  
                  <div className="form-group">
                    <label>Publishing Experience *</label>
                    <textarea 
                      value={applicationForm.experience}
                      onChange={(e) => setApplicationForm({...applicationForm, experience: e.target.value})}
                      placeholder="Describe your publishing background, platform experience, and relevant achievements"
                      rows={3}
                    />
                  </div>
                  
                  <div className="form-group">
                    <label>Target Audience & Reach</label>
                    <textarea 
                      value={applicationForm.audience}
                      onChange={(e) => setApplicationForm({...applicationForm, audience: e.target.value})}
                      placeholder="Describe your target audience, current reach, and distribution channels"
                      rows={3}
                    />
                  </div>
                  
                  <div className="form-group">
                    <label>Proposed Timeline</label>
                    <input 
                      type="text"
                      value={applicationForm.timeline}
                      onChange={(e) => setApplicationForm({...applicationForm, timeline: e.target.value})}
                      placeholder="8 months with quarterly milestones"
                    />
                  </div>
                  
                  <div className="form-group">
                    <label>Implementation Strategy *</label>
                    <textarea 
                      value={applicationForm.strategy}
                      onChange={(e) => setApplicationForm({...applicationForm, strategy: e.target.value})}
                      placeholder="Outline your technical approach, implementation plan, and expected outcomes"
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
                      disabled={!applicationForm.publisherName || !applicationForm.email || !applicationForm.experience || !applicationForm.strategy}
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

export default PublishersGrantsPage;