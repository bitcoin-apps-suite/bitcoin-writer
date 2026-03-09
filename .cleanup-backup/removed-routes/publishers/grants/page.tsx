'use client'

import React, { useState, useEffect } from 'react';
import { 
  Building2, 
  DollarSign, 
  BookOpen, 
  FileText, 
  Upload, 
  PenTool, 
  Zap, 
  Shield,
  CheckCircle,
  AlertCircle,
  Clock,
  Wallet,
  Globe,
  Users,
  Target,
  Megaphone
} from 'lucide-react';
import './publisher-grants.css';

interface PublisherGrantApplication {
  platformName: string;
  description: string;
  platformType: string;
  targetAudience: string;
  contentTypes: string;
  expectedTraffic: number;
  tokenReward: number;
  walletAddress: string;
  timeline: string;
  technicalSpecs: string;
  marketingPlan: string;
  revenueModel: string;
  previousPlatforms: string;
  teamSize: number;
  partnerships: string;
  files: FileList | null;
}

export default function PublisherGrantsPage() {
  const [mounted, setMounted] = useState(false);
  const [devSidebarCollapsed, setDevSidebarCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [formData, setFormData] = useState<PublisherGrantApplication>({
    platformName: '',
    description: '',
    platformType: '',
    targetAudience: '',
    contentTypes: '',
    expectedTraffic: 0,
    tokenReward: 0,
    walletAddress: '',
    timeline: '',
    technicalSpecs: '',
    marketingPlan: '',
    revenueModel: '',
    previousPlatforms: '',
    teamSize: 0,
    partnerships: '',
    files: null
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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'number' ? parseInt(value) || 0 : value
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      files: e.target.files
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus('idle');

    try {
      const submissionData = new FormData();
      
      Object.entries(formData).forEach(([key, value]) => {
        if (key !== 'files') {
          submissionData.append(key, value.toString());
        }
      });

      if (formData.files) {
        Array.from(formData.files).forEach((file, index) => {
          submissionData.append(`file_${index}`, file);
        });
      }

      const response = await fetch('/api/grants/publisher/submit', {
        method: 'POST',
        body: submissionData
      });

      if (response.ok) {
        setSubmitStatus('success');
        setFormData({
          platformName: '',
          description: '',
          platformType: '',
          targetAudience: '',
          contentTypes: '',
          expectedTraffic: 0,
          tokenReward: 0,
          walletAddress: '',
          timeline: '',
          technicalSpecs: '',
          marketingPlan: '',
          revenueModel: '',
          previousPlatforms: '',
          teamSize: 0,
          partnerships: '',
          files: null
        });
      } else {
        setSubmitStatus('error');
      }
    } catch (error) {
      console.error('Submission error:', error);
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const platformTypes = [
    'News & Media Platform',
    'Educational Hub',
    'Content Aggregator',
    'Digital Magazine',
    'Podcast Network',
    'Video Platform',
    'Newsletter Service',
    'Community Forum',
    'Publishing Platform',
    'Documentation Site',
    'Course Platform',
    'Research Portal'
  ];

  const audienceTypes = [
    'Bitcoin Enthusiasts',
    'Developers & Builders',
    'Investors & Traders',
    'General Crypto Community',
    'Business Leaders',
    'Academic Researchers',
    'Content Creators',
    'General Public',
    'Technical Professionals',
    'Media & Journalists'
  ];

  return (
    <div className="App">
      <div className={`publisher-grants-page ${mounted && !isMobile && !devSidebarCollapsed ? 'with-sidebar-expanded' : ''} ${mounted && !isMobile && devSidebarCollapsed ? 'with-sidebar-collapsed' : ''}`}>
        <div className="publisher-grants-container">
          {/* Hero Section */}
          <section className="publisher-grants-hero">
            <div className="publisher-grants-hero-icon">
              <Building2 size={64} />
            </div>
            <h1>Publisher <span style={{color: '#10B981'}}>Grant Application</span></h1>
            <p className="publisher-grants-tagline">
              Build educational platforms and content distribution networks with $BWRITER token funding
            </p>
            <div className="publisher-grants-badge">PUBLISHER PROGRAM</div>
          </section>

          {/* Form Section */}
          <section className="grant-form-section">
            <div className="form-container">
              <form onSubmit={handleSubmit} className="grant-form">
                {/* Platform Details */}
                <div className="form-group">
                  <h3><Globe size={20} style={{marginRight: '8px', verticalAlign: 'middle'}} />Platform Details</h3>
                  
                  <div className="input-group">
                    <label htmlFor="platformName">Platform Name *</label>
                    <input
                      type="text"
                      id="platformName"
                      name="platformName"
                      value={formData.platformName}
                      onChange={handleInputChange}
                      placeholder="Enter your platform or publication name"
                      required
                    />
                  </div>

                  <div className="input-group">
                    <label htmlFor="description">Platform Description *</label>
                    <textarea
                      id="description"
                      name="description"
                      value={formData.description}
                      onChange={handleInputChange}
                      placeholder="Describe your platform, its educational mission, and how it will serve the Bitcoin community"
                      rows={4}
                      required
                    />
                  </div>

                  <div className="input-row">
                    <div className="input-group">
                      <label htmlFor="platformType">Platform Type *</label>
                      <select
                        id="platformType"
                        name="platformType"
                        value={formData.platformType}
                        onChange={handleInputChange}
                        required
                      >
                        <option value="">Select Platform Type</option>
                        {platformTypes.map(type => (
                          <option key={type} value={type}>{type}</option>
                        ))}
                      </select>
                    </div>

                    <div className="input-group">
                      <label htmlFor="targetAudience">Primary Audience *</label>
                      <select
                        id="targetAudience"
                        name="targetAudience"
                        value={formData.targetAudience}
                        onChange={handleInputChange}
                        required
                      >
                        <option value="">Select Target Audience</option>
                        {audienceTypes.map(audience => (
                          <option key={audience} value={audience}>{audience}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="input-row">
                    <div className="input-group">
                      <label htmlFor="expectedTraffic">Expected Monthly Traffic</label>
                      <input
                        type="number"
                        id="expectedTraffic"
                        name="expectedTraffic"
                        value={formData.expectedTraffic}
                        onChange={handleInputChange}
                        placeholder="Monthly unique visitors/users"
                        min="0"
                      />
                      <small>Estimated monthly unique visitors or active users</small>
                    </div>

                    <div className="input-group">
                      <label htmlFor="tokenReward">Requested $BWRITER Token Reward</label>
                      <input
                        type="number"
                        id="tokenReward"
                        name="tokenReward"
                        value={formData.tokenReward}
                        onChange={handleInputChange}
                        placeholder="Enter requested token amount"
                        min="0"
                      />
                      <small>Leave blank for Bitcoin Writer to determine reward amount</small>
                    </div>
                  </div>
                </div>

                {/* Content & Strategy */}
                <div className="form-group">
                  <h3><Target size={20} style={{marginRight: '8px', verticalAlign: 'middle'}} />Content & Strategy</h3>
                  
                  <div className="input-group">
                    <label htmlFor="contentTypes">Content Types & Categories *</label>
                    <textarea
                      id="contentTypes"
                      name="contentTypes"
                      value={formData.contentTypes}
                      onChange={handleInputChange}
                      placeholder="Describe the types of content you'll publish (articles, tutorials, research, news, etc.)"
                      rows={3}
                      required
                    />
                  </div>

                  <div className="input-group">
                    <label htmlFor="marketingPlan">Marketing & Growth Strategy *</label>
                    <textarea
                      id="marketingPlan"
                      name="marketingPlan"
                      value={formData.marketingPlan}
                      onChange={handleInputChange}
                      placeholder="Describe your strategy for growing audience, promoting content, and building community engagement"
                      rows={4}
                      required
                    />
                  </div>

                  <div className="input-group">
                    <label htmlFor="revenueModel">Revenue & Sustainability Model</label>
                    <textarea
                      id="revenueModel"
                      name="revenueModel"
                      value={formData.revenueModel}
                      onChange={handleInputChange}
                      placeholder="Explain how the platform will be financially sustainable beyond the initial grant"
                      rows={3}
                    />
                  </div>
                </div>

                {/* Technical & Team */}
                <div className="form-group">
                  <h3><Zap size={20} style={{marginRight: '8px', verticalAlign: 'middle'}} />Technical & Team</h3>
                  
                  <div className="input-group">
                    <label htmlFor="technicalSpecs">Technical Infrastructure *</label>
                    <textarea
                      id="technicalSpecs"
                      name="technicalSpecs"
                      value={formData.technicalSpecs}
                      onChange={handleInputChange}
                      placeholder="Describe your platform's technical architecture, CMS, hosting, and any special features"
                      rows={4}
                      required
                    />
                  </div>

                  <div className="input-row">
                    <div className="input-group">
                      <label htmlFor="teamSize">Team Size</label>
                      <input
                        type="number"
                        id="teamSize"
                        name="teamSize"
                        value={formData.teamSize}
                        onChange={handleInputChange}
                        placeholder="Number of team members"
                        min="1"
                      />
                      <small>Total number of people working on the platform</small>
                    </div>

                    <div className="input-group">
                      <label htmlFor="timeline">Launch Timeline *</label>
                      <input
                        type="text"
                        id="timeline"
                        name="timeline"
                        value={formData.timeline}
                        onChange={handleInputChange}
                        placeholder="Expected launch date or timeline"
                        required
                      />
                    </div>
                  </div>

                  <div className="input-group">
                    <label htmlFor="partnerships">Partnerships & Collaborations</label>
                    <textarea
                      id="partnerships"
                      name="partnerships"
                      value={formData.partnerships}
                      onChange={handleInputChange}
                      placeholder="List any existing or planned partnerships with other platforms, organizations, or content creators"
                      rows={3}
                    />
                  </div>
                </div>

                {/* Experience & Documentation */}
                <div className="form-group">
                  <h3><BookOpen size={20} style={{marginRight: '8px', verticalAlign: 'middle'}} />Experience & Documentation</h3>
                  
                  <div className="input-group">
                    <label htmlFor="previousPlatforms">Previous Publishing Experience</label>
                    <textarea
                      id="previousPlatforms"
                      name="previousPlatforms"
                      value={formData.previousPlatforms}
                      onChange={handleInputChange}
                      placeholder="Describe any previous publishing platforms, media experience, or content distribution work"
                      rows={3}
                    />
                  </div>

                  <div className="input-group">
                    <label htmlFor="walletAddress">BSV Wallet Address *</label>
                    <input
                      type="text"
                      id="walletAddress"
                      name="walletAddress"
                      value={formData.walletAddress}
                      onChange={handleInputChange}
                      placeholder="1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa"
                      required
                    />
                    <small>Address where $BWRITER tokens will be sent if approved</small>
                  </div>

                  <div className="input-group">
                    <label htmlFor="files">Supporting Documents</label>
                    <input
                      type="file"
                      id="files"
                      name="files"
                      onChange={handleFileChange}
                      multiple
                      accept=".pdf,.doc,.docx,.txt,.md,.png,.jpg,.jpeg"
                    />
                    <small>Upload platform mockups, business plans, or demo content (PDF, DOC, TXT, MD, images)</small>
                  </div>
                </div>

                {/* Submit Button */}
                <div className="form-submit">
                  {submitStatus === 'success' && (
                    <div className="status-message success">
                      <CheckCircle size={20} />
                      <span>Application submitted successfully! You'll receive a confirmation email shortly.</span>
                    </div>
                  )}
                  
                  {submitStatus === 'error' && (
                    <div className="status-message error">
                      <AlertCircle size={20} />
                      <span>Error submitting application. Please try again.</span>
                    </div>
                  )}

                  <button 
                    type="submit" 
                    className="submit-btn"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <>
                        <Clock size={20} className="spinning" />
                        Submitting Application...
                      </>
                    ) : (
                      <>
                        <FileText size={20} />
                        Submit Grant Application
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </section>

          {/* Info Section */}
          <section className="grant-info">
            <div className="info-cards">
              <div className="info-card">
                <Shield size={32} />
                <h4>Review Process</h4>
                <p>Platform proposals are evaluated for educational impact, technical feasibility, and growth potential. Review typically takes 14-21 days.</p>
              </div>
              <div className="info-card">
                <DollarSign size={32} />
                <h4>Token Rewards</h4>
                <p>$BWRITER tokens awarded based on platform scope and impact potential. Typical ranges: 50K-2M tokens for publishing platforms.</p>
              </div>
              <div className="info-card">
                <Megaphone size={32} />
                <h4>Platform Promotion</h4>
                <p>Approved platforms get featured in Bitcoin Writer network and receive ongoing marketing support and content collaboration opportunities.</p>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}