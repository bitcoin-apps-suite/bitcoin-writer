import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import './OfferPage.css';
import Footer from '../components/Footer';

const OfferPage: React.FC = () => {
  const location = useLocation();
  const isDeveloper = location.pathname.includes('/developer/');
  const isAuthor = location.pathname.includes('/author/');
  const [devSidebarCollapsed, setDevSidebarCollapsed] = useState(() => {
    const saved = localStorage.getItem('devSidebarCollapsed');
    return saved === 'true';
  });
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [createForm, setCreateForm] = useState({
    title: '',
    description: '',
    type: 'article',
    rate: '',
    currency: 'USD',
    customToken: '',
    deliveryTime: '',
    languages: '',
    expertise: ''
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
    // In a real app, this would submit to blockchain
    console.log('Submitting offer:', createForm);
    alert('Offer submitted! It will appear in the marketplace after blockchain confirmation.');
    // Reset form
    setCreateForm({
      title: '',
      description: '',
      type: 'article',
      rate: '',
      currency: 'USD',
      customToken: '',
      deliveryTime: '',
      languages: '',
      expertise: ''
    });
  };

  return (
    <div className="App">
      <div className={`offer-page ${!isMobile && !devSidebarCollapsed ? 'with-sidebar-expanded' : ''} ${!isMobile && devSidebarCollapsed ? 'with-sidebar-collapsed' : ''}`}>
        <div className="offer-container">
          {/* Hero Section */}
          <section className="offer-hero">
            <h1>Create Your <span style={{color: '#FF6B35'}}>{isDeveloper ? 'Development' : 'Writing'} Offer</span></h1>
            <p className="offer-tagline">
              {isDeveloper 
                ? 'List your development services and connect with publishers looking for technical talent'
                : 'List your writing services and connect with publishers looking for quality content'}
            </p>
          </section>

          {/* Form Section */}
          <section className="offer-form-section">
            <div className="offer-form-card">
              <h2>Service Details</h2>
              
              <div className="offer-form">
                <div className="form-group">
                  <label>Service Title</label>
                  <input
                    type="text"
                    placeholder={isDeveloper ? "e.g., Full-Stack BSV Development" : "e.g., Technical Documentation & API Guides"}
                    value={createForm.title}
                    onChange={(e) => setCreateForm({...createForm, title: e.target.value})}
                  />
                </div>

                <div className="form-group">
                  <label>Description</label>
                  <textarea
                    placeholder="Describe your expertise and what you offer..."
                    value={createForm.description}
                    onChange={(e) => setCreateForm({...createForm, description: e.target.value})}
                    rows={4}
                  />
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>{isDeveloper ? 'Service Type' : 'Content Type'}</label>
                    <select value={createForm.type} onChange={(e) => setCreateForm({...createForm, type: e.target.value})}>
                      {isDeveloper ? (
                        <>
                          <option value="fullstack">Full-Stack Development</option>
                          <option value="frontend">Frontend Development</option>
                          <option value="backend">Backend Development</option>
                          <option value="smart-contract">Smart Contract Development</option>
                          <option value="api">API Development</option>
                          <option value="integration">BSV Integration</option>
                          <option value="consulting">Technical Consulting</option>
                          <option value="audit">Code Audit</option>
                        </>
                      ) : (
                        <>
                          <option value="article">Article</option>
                          <option value="tutorial">Tutorial</option>
                          <option value="documentation">Documentation</option>
                          <option value="whitepaper">Whitepaper</option>
                          <option value="research">Research Report</option>
                          <option value="analysis">Market Analysis</option>
                          <option value="blog">Blog Post</option>
                          <option value="social">Social Content</option>
                        </>
                      )}
                    </select>
                  </div>

                  <div className="form-group">
                    <label>{isDeveloper ? 'Rate (per hour)' : 'Rate (per 1000 words)'}</label>
                    <input
                      type="text"
                      placeholder={isDeveloper ? "e.g., 150" : "e.g., 250"}
                      value={createForm.rate}
                      onChange={(e) => setCreateForm({...createForm, rate: e.target.value})}
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
                    <label>Delivery Time</label>
                    <input
                      type="text"
                      placeholder="e.g., 3-5 days"
                      value={createForm.deliveryTime}
                      onChange={(e) => setCreateForm({...createForm, deliveryTime: e.target.value})}
                    />
                  </div>

                  <div className="form-group">
                    <label>Languages</label>
                    <input
                      type="text"
                      placeholder="e.g., English, Spanish"
                      value={createForm.languages}
                      onChange={(e) => setCreateForm({...createForm, languages: e.target.value})}
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label>Areas of Expertise</label>
                  <input
                    type="text"
                    placeholder={isDeveloper ? "e.g., BSV, React, Node.js, Smart Contracts" : "e.g., Blockchain, Technical Writing, API Docs"}
                    value={createForm.expertise}
                    onChange={(e) => setCreateForm({...createForm, expertise: e.target.value})}
                  />
                </div>

                <div className="auth-section">
                  <h3>Sign Your Offer</h3>
                  <p>Authenticate your identity and digitally sign this contractual offer</p>
                  
                  <div className="auth-steps">
                    <div className="auth-step">
                      <span className="step-number">1</span>
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
                      <span className="step-number">2</span>
                      <div className="step-content">
                        <h4>Sign with HandCash Wallet</h4>
                        <p>Create a legally binding smart contract on the BSV blockchain</p>
                        <button className="handcash-button" onClick={handleSubmit}>
                          Sign & Submit with HandCash
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
            <h2>How It Works</h2>
            <div className="steps-grid">
              <div className="step">
                <div className="step-number">1</div>
                <h4>Create Your Offer</h4>
                <p>Fill in your service details and rates</p>
              </div>
              <div className="step">
                <div className="step-number">2</div>
                <h4>Sign & Submit</h4>
                <p>Authenticate and sign your offer on the blockchain</p>
              </div>
              <div className="step">
                <div className="step-number">3</div>
                <h4>Get Discovered</h4>
                <p>Your offer appears in the marketplace for publishers</p>
              </div>
              <div className="step">
                <div className="step-number">4</div>
                <h4>Receive Contracts</h4>
                <p>Publishers create contracts based on your offers</p>
              </div>
            </div>
          </section>
        </div>
        <Footer />
      </div>
    </div>
  );
};

export default OfferPage;