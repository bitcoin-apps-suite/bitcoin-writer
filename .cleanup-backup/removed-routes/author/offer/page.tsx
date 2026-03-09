'use client';

import React, { useState, useEffect } from 'react';
import './author-offer.css';

interface WritingOfferFormData {
  title: string;
  description: string;
  category: string;
  deliverables: string[];
  timeline: string;
  priceInBWRITER: string;
  authorName: string;
  authorEmail: string;
  githubUsername: string;
  handCashHandle: string;
  samples: string;
  expertise: string[];
}

const AuthorOfferPage: React.FC = () => {
  const [mounted, setMounted] = useState(false);
  const [devSidebarCollapsed, setDevSidebarCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [showOfferForm, setShowOfferForm] = useState(true);
  const [formData, setFormData] = useState<WritingOfferFormData>({
    title: '',
    description: '',
    category: '',
    deliverables: [],
    timeline: '',
    priceInBWRITER: '',
    authorName: '',
    authorEmail: '',
    githubUsername: '',
    handCashHandle: '',
    samples: '',
    expertise: []
  });

  useEffect(() => {
    setMounted(true);
    
    // Initialize state after mounting
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


  const categoryOptions = [
    'Technical Writing',
    'API Documentation', 
    'Marketing Copy',
    'User Documentation',
    'Academic Writing',
    'Blog Posts',
    'White Papers',
    'Case Studies',
    'Tutorials',
    'Grant Proposals',
    'Press Releases',
    'Product Descriptions',
    'Website Copy',
    'Social Media Content'
  ];

  const timelineOptions = [
    '1-2 days',
    '3-5 days', 
    '1 week',
    '2 weeks',
    '3-4 weeks',
    '1-2 months',
    '3+ months'
  ];

  const handleDeliverablesChange = (deliverable: string) => {
    setFormData(prev => ({
      ...prev,
      deliverables: prev.deliverables.includes(deliverable)
        ? prev.deliverables.filter(d => d !== deliverable)
        : [...prev.deliverables, deliverable]
    }));
  };

  const handleSubmitOffer = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate required fields
    if (!formData.title || !formData.description || !formData.category || !formData.authorName || !formData.authorEmail || !formData.priceInBWRITER) {
      alert('Please fill in all required fields.');
      return;
    }

    // Store writing offer (mock implementation)
    const writingOffer = {
      ...formData,
      id: `offer_${Date.now()}`,
      createdAt: new Date().toISOString(),
      status: 'active'
    };

    // Save to localStorage (in production this would go to a database)
    const existingOffers = JSON.parse(localStorage.getItem('writing_offers') || '[]');
    existingOffers.push(writingOffer);
    localStorage.setItem('writing_offers', JSON.stringify(existingOffers));

    alert('Your writing offer has been submitted! Potential clients can now see and purchase your specific writing service.');
    
    // Reset form
    setFormData({
      title: '',
      description: '',
      category: '',
      deliverables: [],
      timeline: '',
      priceInBWRITER: '',
      authorName: '',
      authorEmail: '',
      githubUsername: '',
      handCashHandle: '',
      samples: '',
      expertise: []
    });
  };


  return (
    <div className="app-wrapper">
      <div className={`author-offers-page ${mounted && !isMobile && !devSidebarCollapsed ? 'with-sidebar-expanded' : ''} ${mounted && !isMobile && devSidebarCollapsed ? 'with-sidebar-collapsed' : ''}`}>
        
        {/* Hero Section */}
        <div className="author-offers-hero">
          <h1>Create Writing Offer</h1>
          <p>Offer a specific writing service on a particular subject that clients can purchase</p>
          <div className="author-offers-badge">OFFER YOUR EXPERTISE</div>
        </div>

        <div className="author-offers-container">
          <div className="writer-form-container">
            <div className="form-header">
              <h2>Create Your Writing Offer</h2>
              <p>Define a specific writing service you want to offer to potential clients</p>
            </div>

              <form onSubmit={handleSubmitOffer} className="writer-offer-form">
                <div className="form-group">
                  <label>Offer Title *</label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({...formData, title: e.target.value})}
                    placeholder="e.g., 'I will write a comprehensive blockchain whitepaper' or 'I will create API documentation for your project'"
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Detailed Description *</label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                    placeholder="Describe exactly what you will write, the subject matter, your approach, and what makes your offer unique..."
                    rows={6}
                    required
                  />
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Category *</label>
                    <select
                      value={formData.category}
                      onChange={(e) => setFormData({...formData, category: e.target.value})}
                      required
                    >
                      <option value="">Select category</option>
                      {categoryOptions.map(category => (
                        <option key={category} value={category}>{category}</option>
                      ))}
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Timeline *</label>
                    <select
                      value={formData.timeline}
                      onChange={(e) => setFormData({...formData, timeline: e.target.value})}
                      required
                    >
                      <option value="">Select timeline</option>
                      {timelineOptions.map(timeline => (
                        <option key={timeline} value={timeline}>{timeline}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="form-group">
                  <label>What You'll Deliver</label>
                  <div className="deliverables-section">
                    <div className="deliverable-options">
                      {['Written Document', 'Research & Sources', 'Revisions Included', 'SEO Optimization', 'Graphics/Charts', 'Executive Summary'].map(deliverable => (
                        <label key={deliverable} className="expertise-checkbox">
                          <input
                            type="checkbox"
                            checked={formData.deliverables.includes(deliverable)}
                            onChange={() => handleDeliverablesChange(deliverable)}
                          />
                          <span>{deliverable}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="form-group">
                  <label>Price in $BWRITER Tokens *</label>
                  <input
                    type="number"
                    value={formData.priceInBWRITER}
                    onChange={(e) => setFormData({...formData, priceInBWRITER: e.target.value})}
                    placeholder="5000"
                    required
                  />
                  <small>Fixed price for this specific writing service</small>
                </div>

                <div className="form-group">
                  <label>Writing Samples/Portfolio</label>
                  <textarea
                    value={formData.samples}
                    onChange={(e) => setFormData({...formData, samples: e.target.value})}
                    placeholder="Provide links to relevant writing samples or describe your relevant experience..."
                    rows={3}
                  />
                </div>

                <div className="author-contact-section">
                  <h3>Contact Information</h3>
                  <div className="form-row">
                    <div className="form-group">
                      <label>Your Name *</label>
                      <input
                        type="text"
                        value={formData.authorName}
                        onChange={(e) => setFormData({...formData, authorName: e.target.value})}
                        placeholder="Your full name"
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label>Email *</label>
                      <input
                        type="email"
                        value={formData.authorEmail}
                        onChange={(e) => setFormData({...formData, authorEmail: e.target.value})}
                        placeholder="your@email.com"
                        required
                      />
                    </div>
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label>GitHub Username</label>
                      <input
                        type="text"
                        value={formData.githubUsername}
                        onChange={(e) => setFormData({...formData, githubUsername: e.target.value})}
                        placeholder="your-github-username"
                      />
                    </div>
                    <div className="form-group">
                      <label>HandCash Handle</label>
                      <input
                        type="text"
                        value={formData.handCashHandle}
                        onChange={(e) => setFormData({...formData, handCashHandle: e.target.value})}
                        placeholder="$yourhandle"
                      />
                    </div>
                  </div>
                </div>

                <div className="form-actions">
                  <button type="button" className="cancel-btn" onClick={() => window.history.back()}>
                    Cancel
                  </button>
                  <button type="submit" className="submit-btn">
                    Create Writing Offer →
                  </button>
                </div>
              </form>
            </div>
        </div>
      </div>
    </div>
  );
};

export default AuthorOfferPage;