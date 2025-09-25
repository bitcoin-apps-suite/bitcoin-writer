import React, { useState, useEffect } from 'react';
import './OfferPage.css';
import Footer from '../components/Footer';

const PublisherOfferPage: React.FC = () => {
  const [devSidebarCollapsed, setDevSidebarCollapsed] = useState(() => {
    const saved = localStorage.getItem('devSidebarCollapsed');
    return saved === 'true';
  });
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
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
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('resize', handleResize);
      clearInterval(checkSidebarState);
    };
  }, []);

  const handleSubmit = () => {
    // In a real app, this would create a smart contract with escrow
    console.log('Creating commission:', createForm);
    alert('Commission created! Authors can now apply for this work.');
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

  return (
    <div className="App">
      <div className={`offer-page ${!isMobile && !devSidebarCollapsed ? 'with-sidebar-expanded' : ''} ${!isMobile && devSidebarCollapsed ? 'with-sidebar-collapsed' : ''}`}>
        <div className="offer-container">
          {/* Hero Section */}
          <section className="offer-hero">
            <h1>Create Your <span style={{color: '#4CAF50'}}>Commission</span></h1>
            <p className="offer-tagline">
              Post a job for talented writers and developers with BSV escrow protection
            </p>
          </section>

          {/* Form Section */}
          <section className="offer-form-section">
            <div className="offer-form-card">
              <h2>Commission Details</h2>
              
              <div className="offer-form">
                <div className="form-group">
                  <label>Project Title</label>
                  <input
                    type="text"
                    placeholder="e.g., Technical Documentation for BSV Integration"
                    value={createForm.title}
                    onChange={(e) => setCreateForm({...createForm, title: e.target.value})}
                  />
                </div>

                <div className="form-group">
                  <label>Description</label>
                  <textarea
                    placeholder="Describe what you need, deliverables, and any specific requirements..."
                    value={createForm.description}
                    onChange={(e) => setCreateForm({...createForm, description: e.target.value})}
                    rows={4}
                  />
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Content Type</label>
                    <select value={createForm.type} onChange={(e) => setCreateForm({...createForm, type: e.target.value})}>
                      <option value="article">Article</option>
                      <option value="tutorial">Tutorial</option>
                      <option value="documentation">Documentation</option>
                      <option value="whitepaper">Whitepaper</option>
                      <option value="research">Research Report</option>
                      <option value="analysis">Market Analysis</option>
                      <option value="blog">Blog Post</option>
                      <option value="development">Development Work</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label>Budget</label>
                    <input
                      type="text"
                      placeholder="e.g., 1000"
                      value={createForm.budget}
                      onChange={(e) => setCreateForm({...createForm, budget: e.target.value})}
                    />
                  </div>

                  <div className="form-group">
                    <label>Currency</label>
                    <select value={createForm.currency} onChange={(e) => setCreateForm({...createForm, currency: e.target.value})}>
                      <option value="USD">USD ($)</option>
                      <option value="BSV">BSV</option>
                      <option value="BWRITER">$BWRITER</option>
                      <option value="OTHER">Other BSV Token</option>
                    </select>
                  </div>
                </div>

                {createForm.currency === 'OTHER' && (
                  <div className="form-group">
                    <label>Custom Token Symbol</label>
                    <input
                      type="text"
                      placeholder="e.g., USDC"
                      value={createForm.customToken}
                      onChange={(e) => setCreateForm({...createForm, customToken: e.target.value})}
                    />
                  </div>
                )}

                <div className="form-row">
                  <div className="form-group">
                    <label>Word Count / Scope</label>
                    <input
                      type="text"
                      placeholder="e.g., 3000 words"
                      value={createForm.wordCount}
                      onChange={(e) => setCreateForm({...createForm, wordCount: e.target.value})}
                    />
                  </div>

                  <div className="form-group">
                    <label>Deadline</label>
                    <input
                      type="date"
                      value={createForm.deadline}
                      onChange={(e) => setCreateForm({...createForm, deadline: e.target.value})}
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label>Specific Requirements</label>
                  <textarea
                    placeholder="Any specific skills, experience, or requirements for this commission..."
                    value={createForm.requirements}
                    onChange={(e) => setCreateForm({...createForm, requirements: e.target.value})}
                    rows={3}
                  />
                </div>

                <div className="auth-section" style={{background: 'rgba(76, 175, 80, 0.05)', border: '1px solid rgba(76, 175, 80, 0.2)'}}>
                  <h3 style={{color: '#4CAF50'}}>Fund & Sign Commission</h3>
                  <p>Lock BSV in escrow and create a smart contract for this commission</p>
                  
                  <div className="auth-steps">
                    <div className="auth-step">
                      <span className="step-number" style={{background: '#4CAF50'}}>1</span>
                      <div className="step-content">
                        <h4>Authenticate Identity</h4>
                        <p>Sign in with Google or Twitter to verify your identity</p>
                        <div className="auth-buttons">
                          <button className="auth-button google">
                            Sign with Google
                          </button>
                          <button className="auth-button twitter">
                            Sign with Twitter
                          </button>
                        </div>
                      </div>
                    </div>

                    <div className="auth-step">
                      <span className="step-number" style={{background: '#4CAF50'}}>2</span>
                      <div className="step-content">
                        <h4>Fund Escrow with HandCash</h4>
                        <p>Lock your budget in BSV escrow - released only when you approve the work</p>
                        <button className="handcash-button" onClick={handleSubmit}>
                          Fund & Create Commission
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* How It Works */}
          <section className="how-it-works-section">
            <h2>How Commissions Work</h2>
            <div className="steps-grid">
              <div className="step">
                <div className="step-number" style={{background: '#4CAF50'}}>1</div>
                <h4>Create Commission</h4>
                <p>Define your requirements and budget</p>
              </div>
              <div className="step">
                <div className="step-number" style={{background: '#4CAF50'}}>2</div>
                <h4>Fund Escrow</h4>
                <p>Lock BSV to show you're serious</p>
              </div>
              <div className="step">
                <div className="step-number" style={{background: '#4CAF50'}}>3</div>
                <h4>Receive Applications</h4>
                <p>Authors and developers apply for your work</p>
              </div>
              <div className="step">
                <div className="step-number" style={{background: '#4CAF50'}}>4</div>
                <h4>Release Payment</h4>
                <p>Approve work to release escrow automatically</p>
              </div>
            </div>
          </section>
        </div>
        <Footer />
      </div>
    </div>
  );
};

export default PublisherOfferPage;