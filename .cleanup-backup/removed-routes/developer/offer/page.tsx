'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import './developer-offer.css';

const DeveloperOfferPage: React.FC = () => {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [devSidebarCollapsed, setDevSidebarCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [createForm, setCreateForm] = useState({
    title: '',
    description: '',
    type: 'fullstack',
    rate: '',
    currency: 'USD',
    customToken: '',
    deliveryTime: '',
    languages: '',
    expertise: ''
  });

  useEffect(() => {
    setMounted(true);
    
    const saved = localStorage.getItem('devSidebarCollapsed');
    setDevSidebarCollapsed(saved === 'true');
    setIsMobile(window.innerWidth <= 768);

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
    console.log('Submitting developer offer:', createForm);
    alert('Developer offer submitted! It will appear in the marketplace after blockchain confirmation.');
    setCreateForm({
      title: '',
      description: '',
      type: 'fullstack',
      rate: '',
      currency: 'USD',
      customToken: '',
      deliveryTime: '',
      languages: '',
      expertise: ''
    });
  };

  return (
    <div className="app-wrapper">
      <div className={`developer-offer-page ${mounted && !isMobile && !devSidebarCollapsed ? 'with-sidebar-expanded' : ''} ${mounted && !isMobile && devSidebarCollapsed ? 'with-sidebar-collapsed' : ''}`}>
        <div className="developer-offer-container">
          {/* Hero Section */}
          <section className="developer-offer-hero">
            <h1>Create Your <span style={{color: '#FF6B35'}}>Development Offer</span></h1>
            <p className="developer-offer-tagline">
              List your development services and connect with publishers looking for technical talent
            </p>
          </section>

          {/* Form Section */}
          <section className="developer-offer-form-section">
            <div className="developer-offer-form-card">
              <h2>Development Service Details</h2>
              
              <div className="developer-offer-form">
                <div className="form-group">
                  <label>Service Title</label>
                  <input
                    type="text"
                    placeholder="e.g., Full-Stack BSV Development"
                    value={createForm.title}
                    onChange={(e) => setCreateForm({...createForm, title: e.target.value})}
                  />
                </div>

                <div className="form-group">
                  <label>Description</label>
                  <textarea
                    placeholder="Describe your development expertise and what you offer..."
                    value={createForm.description}
                    onChange={(e) => setCreateForm({...createForm, description: e.target.value})}
                    rows={4}
                  />
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Service Type</label>
                    <select value={createForm.type} onChange={(e) => setCreateForm({...createForm, type: e.target.value})}>
                      <option value="fullstack">Full-Stack Development</option>
                      <option value="frontend">Frontend Development</option>
                      <option value="backend">Backend Development</option>
                      <option value="smart-contract">Smart Contract Development</option>
                      <option value="api">API Development</option>
                      <option value="integration">BSV Integration</option>
                      <option value="consulting">Technical Consulting</option>
                      <option value="audit">Code Audit</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label>Rate (per hour)</label>
                    <input
                      type="text"
                      placeholder="e.g., 150"
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
                      placeholder="e.g., 1-2 weeks"
                      value={createForm.deliveryTime}
                      onChange={(e) => setCreateForm({...createForm, deliveryTime: e.target.value})}
                    />
                  </div>

                  <div className="form-group">
                    <label>Programming Languages</label>
                    <input
                      type="text"
                      placeholder="e.g., JavaScript, TypeScript, Python"
                      value={createForm.languages}
                      onChange={(e) => setCreateForm({...createForm, languages: e.target.value})}
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label>Technical Expertise</label>
                  <input
                    type="text"
                    placeholder="e.g., BSV, React, Node.js, Smart Contracts, API Integration"
                    value={createForm.expertise}
                    onChange={(e) => setCreateForm({...createForm, expertise: e.target.value})}
                  />
                </div>

                <div className="auth-section">
                  <h3>Sign Your Developer Offer</h3>
                  <p>Authenticate your identity and digitally sign this contractual offer</p>
                  
                  <div className="auth-steps">
                    <div className="auth-step">
                      <span className="step-number">1</span>
                      <div className="step-content">
                        <h4>Authenticate Identity</h4>
                        <p>Sign in with Google or GitHub to verify your developer identity</p>
                        <div className="auth-buttons">
                          <button className="auth-button google">
                            Sign with Google
                          </button>
                          <button className="auth-button github">
                            Sign with GitHub
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
            <h2>How Developer Marketplace Works</h2>
            <div className="steps-grid">
              <div className="step">
                <div className="step-number">1</div>
                <h4>Create Your Developer Profile</h4>
                <p>List your technical skills, rates, and availability</p>
              </div>
              <div className="step">
                <div className="step-number">2</div>
                <h4>Sign & Submit to Blockchain</h4>
                <p>Authenticate and publish your offer as a smart contract</p>
              </div>
              <div className="step">
                <div className="step-number">3</div>
                <h4>Get Discovered by Publishers</h4>
                <p>Your profile appears in the developer marketplace</p>
              </div>
              <div className="step">
                <div className="step-number">4</div>
                <h4>Receive Development Contracts</h4>
                <p>Publishers create contracts for your technical services</p>
              </div>
            </div>
          </section>

          {/* Developer Benefits */}
          <section className="developer-benefits-section">
            <h2>Why Join Our Developer Network?</h2>
            <div className="benefits-grid">
              <div className="benefit">
                <div className="benefit-icon">🔒</div>
                <h3>Secure Payments</h3>
                <p>Smart contract escrow ensures you get paid for completed work</p>
              </div>
              <div className="benefit">
                <div className="benefit-icon">⚡</div>
                <h3>Instant Settlements</h3>
                <p>Get paid immediately when work is approved via BSV blockchain</p>
              </div>
              <div className="benefit">
                <div className="benefit-icon">🌐</div>
                <h3>Global Opportunities</h3>
                <p>Connect with publishers and companies worldwide seeking BSV talent</p>
              </div>
              <div className="benefit">
                <div className="benefit-icon">📊</div>
                <h3>Build Reputation</h3>
                <p>Every completed project builds your on-chain developer reputation</p>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default DeveloperOfferPage;