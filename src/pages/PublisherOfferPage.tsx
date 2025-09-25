import React, { useState, useEffect } from 'react';
import './PublisherOfferPage.css';
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
      <div className={`publisher-offer-page ${!isMobile && !devSidebarCollapsed ? 'with-sidebar-expanded' : ''} ${!isMobile && devSidebarCollapsed ? 'with-sidebar-collapsed' : ''}`}>
        
        {/* Hero Section */}
        <div className="publisher-offer-hero">
          <h1>Commission Quality Content</h1>
          <p>Post a job for talented writers with BSV escrow protection</p>
          <div className="publisher-offer-badge">SECURE ESCROW</div>
        </div>

        <div className="publisher-offer-container">
          {/* Info Cards */}
          <div className="publisher-info-grid">
            <div className="info-card">
              <div className="info-icon">🔒</div>
              <h3>Escrow Protection</h3>
              <p>Funds are locked in smart contract until work is approved</p>
            </div>
            <div className="info-card">
              <div className="info-icon">✍️</div>
              <h3>Quality Writers</h3>
              <p>Access our network of verified professional writers</p>
            </div>
            <div className="info-card">
              <div className="info-icon">⚡</div>
              <h3>Fast Delivery</h3>
              <p>Get your content delivered on schedule with milestones</p>
            </div>
          </div>

          {/* Form Section */}
          <section className="publisher-form-section">
            <div className="publisher-form-card">
              <h2>Commission Details</h2>
              
              <div className="publisher-form">
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
                    rows={5}
                  />
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Content Type</label>
                    <select
                      value={createForm.type}
                      onChange={(e) => setCreateForm({...createForm, type: e.target.value})}
                    >
                      <option value="article">Article</option>
                      <option value="whitepaper">White Paper</option>
                      <option value="documentation">Documentation</option>
                      <option value="blog">Blog Post</option>
                      <option value="tutorial">Tutorial</option>
                      <option value="case-study">Case Study</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Word Count</label>
                    <input
                      type="number"
                      placeholder="e.g., 2000"
                      value={createForm.wordCount}
                      onChange={(e) => setCreateForm({...createForm, wordCount: e.target.value})}
                    />
                  </div>
                </div>

                <div className="currency-row">
                  <div className="form-group">
                    <label>Budget</label>
                    <input
                      type="text"
                      placeholder="e.g., 500"
                      value={createForm.budget}
                      onChange={(e) => setCreateForm({...createForm, budget: e.target.value})}
                    />
                  </div>
                  <div className="form-group">
                    <label>Currency</label>
                    <select
                      value={createForm.currency}
                      onChange={(e) => setCreateForm({...createForm, currency: e.target.value})}
                    >
                      <option value="BSV">BSV</option>
                      <option value="USD">USD</option>
                      <option value="BWRITER">$BWRITER</option>
                      <option value="custom">Custom Token</option>
                    </select>
                  </div>
                </div>

                {createForm.currency === 'custom' && (
                  <div className="form-group">
                    <label>Token Symbol</label>
                    <input
                      type="text"
                      placeholder="e.g., USDC"
                      value={createForm.customToken}
                      onChange={(e) => setCreateForm({...createForm, customToken: e.target.value})}
                    />
                  </div>
                )}

                <div className="form-group">
                  <label>Deadline</label>
                  <input
                    type="date"
                    value={createForm.deadline}
                    onChange={(e) => setCreateForm({...createForm, deadline: e.target.value})}
                  />
                </div>

                <div className="form-group">
                  <label>Requirements & Guidelines</label>
                  <textarea
                    placeholder="Any specific requirements, style guides, references, etc..."
                    value={createForm.requirements}
                    onChange={(e) => setCreateForm({...createForm, requirements: e.target.value})}
                    rows={4}
                  />
                </div>

                {/* Escrow Info */}
                <div className="escrow-info">
                  <h3>🔐 Escrow Protection Active</h3>
                  <p>
                    Your funds will be locked in a smart contract and only released when you approve the delivered work. 
                    This protects both you and the writer, ensuring fair payment for quality content.
                  </p>
                </div>

                {/* Submit Buttons */}
                <div className="submit-section">
                  <button className="submit-button" onClick={handleSubmit}>
                    Post Commission & Fund Escrow →
                  </button>
                  <button className="cancel-button" onClick={() => window.history.back()}>
                    Cancel
                  </button>
                </div>
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