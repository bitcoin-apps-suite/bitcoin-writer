'use client'

import React, { useState, useEffect } from 'react';
import { 
  Users, 
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
  GraduationCap
} from 'lucide-react';
import './author-grants.css';

interface AuthorGrantApplication {
  projectTitle: string;
  description: string;
  contentType: string;
  targetAudience: string;
  estimatedLength: number;
  tokenReward: number;
  walletAddress: string;
  timeline: string;
  writingSamples: string;
  previousWork: string;
  researchPlan: string;
  collaborators: string;
  files: FileList | null;
}

export default function AuthorGrantsPage() {
  const [mounted, setMounted] = useState(false);
  const [devSidebarCollapsed, setDevSidebarCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [formData, setFormData] = useState<AuthorGrantApplication>({
    projectTitle: '',
    description: '',
    contentType: '',
    targetAudience: '',
    estimatedLength: 0,
    tokenReward: 0,
    walletAddress: '',
    timeline: '',
    writingSamples: '',
    previousWork: '',
    researchPlan: '',
    collaborators: '',
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

      const response = await fetch('/api/grants/author/submit', {
        method: 'POST',
        body: submissionData
      });

      if (response.ok) {
        setSubmitStatus('success');
        setFormData({
          projectTitle: '',
          description: '',
          contentType: '',
          targetAudience: '',
          estimatedLength: 0,
          tokenReward: 0,
          walletAddress: '',
          timeline: '',
          writingSamples: '',
          previousWork: '',
          researchPlan: '',
          collaborators: '',
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

  const contentTypes = [
    'Educational Content',
    'Technical Documentation',
    'Research Publication',
    'Learning Resources',
    'Tutorial Series',
    'Academic Paper',
    'White Paper',
    'User Guide',
    'API Documentation',
    'Video Script',
    'Course Material',
    'Blog Series'
  ];

  const targetAudiences = [
    'Developers',
    'Students',
    'Researchers',
    'General Public',
    'Business Leaders',
    'Educators',
    'Content Creators',
    'Technical Writers'
  ];

  return (
    <div className="App">
      <div className={`author-grants-page ${mounted && !isMobile && !devSidebarCollapsed ? 'with-sidebar-expanded' : ''} ${mounted && !isMobile && devSidebarCollapsed ? 'with-sidebar-collapsed' : ''}`}>
        <div className="author-grants-container">
          {/* Hero Section */}
          <section className="author-grants-hero">
            <div className="author-grants-hero-icon">
              <Users size={64} />
            </div>
            <h1>Author <span style={{color: '#FF6B35'}}>Grant Application</span></h1>
            <p className="author-grants-tagline">
              Submit your educational writing project for $BWRITER token funding
            </p>
            <div className="author-grants-badge">AUTHOR PROGRAM</div>
          </section>

          {/* Form Section */}
          <section className="grant-form-section">
            <div className="form-container">
              <form onSubmit={handleSubmit} className="grant-form">
                {/* Content Details */}
                <div className="form-group">
                  <h3><BookOpen size={20} style={{marginRight: '8px', verticalAlign: 'middle'}} />Content Details</h3>
                  
                  <div className="input-group">
                    <label htmlFor="projectTitle">Project Title *</label>
                    <input
                      type="text"
                      id="projectTitle"
                      name="projectTitle"
                      value={formData.projectTitle}
                      onChange={handleInputChange}
                      placeholder="Enter your writing project title"
                      required
                    />
                  </div>

                  <div className="input-group">
                    <label htmlFor="description">Project Description *</label>
                    <textarea
                      id="description"
                      name="description"
                      value={formData.description}
                      onChange={handleInputChange}
                      placeholder="Describe your writing project, its educational value, and target impact"
                      rows={4}
                      required
                    />
                  </div>

                  <div className="input-row">
                    <div className="input-group">
                      <label htmlFor="contentType">Content Type *</label>
                      <select
                        id="contentType"
                        name="contentType"
                        value={formData.contentType}
                        onChange={handleInputChange}
                        required
                      >
                        <option value="">Select Content Type</option>
                        {contentTypes.map(type => (
                          <option key={type} value={type}>{type}</option>
                        ))}
                      </select>
                    </div>

                    <div className="input-group">
                      <label htmlFor="targetAudience">Target Audience *</label>
                      <select
                        id="targetAudience"
                        name="targetAudience"
                        value={formData.targetAudience}
                        onChange={handleInputChange}
                        required
                      >
                        <option value="">Select Target Audience</option>
                        {targetAudiences.map(audience => (
                          <option key={audience} value={audience}>{audience}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="input-row">
                    <div className="input-group">
                      <label htmlFor="estimatedLength">Estimated Length (words) *</label>
                      <input
                        type="number"
                        id="estimatedLength"
                        name="estimatedLength"
                        value={formData.estimatedLength}
                        onChange={handleInputChange}
                        placeholder="0"
                        min="100"
                        required
                      />
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

                {/* Writing & Research */}
                <div className="form-group">
                  <h3><PenTool size={20} style={{marginRight: '8px', verticalAlign: 'middle'}} />Writing & Research</h3>
                  
                  <div className="input-group">
                    <label htmlFor="researchPlan">Research Plan *</label>
                    <textarea
                      id="researchPlan"
                      name="researchPlan"
                      value={formData.researchPlan}
                      onChange={handleInputChange}
                      placeholder="Describe your research methodology, sources, and approach to content creation"
                      rows={4}
                      required
                    />
                  </div>

                  <div className="input-group">
                    <label htmlFor="writingSamples">Writing Samples *</label>
                    <textarea
                      id="writingSamples"
                      name="writingSamples"
                      value={formData.writingSamples}
                      onChange={handleInputChange}
                      placeholder="Provide links to your published work or paste relevant writing samples"
                      rows={4}
                      required
                    />
                  </div>

                  <div className="input-group">
                    <label htmlFor="previousWork">Previous Work & Experience</label>
                    <textarea
                      id="previousWork"
                      name="previousWork"
                      value={formData.previousWork}
                      onChange={handleInputChange}
                      placeholder="Describe your writing background, publications, and relevant experience"
                      rows={3}
                    />
                  </div>
                </div>

                {/* Collaboration & Timeline */}
                <div className="form-group">
                  <h3><GraduationCap size={20} style={{marginRight: '8px', verticalAlign: 'middle'}} />Collaboration & Timeline</h3>
                  
                  <div className="input-group">
                    <label htmlFor="collaborators">Collaborators & Contributors</label>
                    <textarea
                      id="collaborators"
                      name="collaborators"
                      value={formData.collaborators}
                      onChange={handleInputChange}
                      placeholder="List any co-authors, researchers, or contributors involved in this project"
                      rows={3}
                    />
                  </div>

                  <div className="input-group">
                    <label htmlFor="timeline">Project Timeline *</label>
                    <textarea
                      id="timeline"
                      name="timeline"
                      value={formData.timeline}
                      onChange={handleInputChange}
                      placeholder="Break down writing milestones, research phases, and estimated completion dates"
                      rows={3}
                      required
                    />
                  </div>
                </div>

                {/* Payment & Documentation */}
                <div className="form-group">
                  <h3><Wallet size={20} style={{marginRight: '8px', verticalAlign: 'middle'}} />Payment & Documentation</h3>
                  
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
                      accept=".pdf,.doc,.docx,.txt,.md"
                    />
                    <small>Upload outlines, research notes, or draft content (PDF, DOC, TXT, MD)</small>
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
                <p>Writing proposals are reviewed for educational value, accuracy, and potential impact. Review typically takes 7-14 days.</p>
              </div>
              <div className="info-card">
                <DollarSign size={32} />
                <h4>Token Rewards</h4>
                <p>$BWRITER tokens awarded based on content scope and quality. Typical ranges: 5K-500K tokens for educational content.</p>
              </div>
              <div className="info-card">
                <BookOpen size={32} />
                <h4>Publication Platform</h4>
                <p>Approved content gets featured on Bitcoin Writer platform and becomes eligible for independent funding opportunities.</p>
              </div>
            </div>
          </section>

          {/* Token Contract Information */}
          <section className="contract-info-section">
            <h2>$BWRITER Token Contract</h2>
            <div className="contract-details">
              <div className="contract-item">
                <strong>Contract ID:</strong>
                <span className="contract-id">acc6543efc620d40895004acaefecbad7cabe9dc447a84342e149eac30d979d3_1</span>
              </div>
              <div className="contract-item">
                <strong>Symbol:</strong>
                <span>$bWriter</span>
              </div>
              <div className="contract-item">
                <strong>Blockchain:</strong>
                <span>Bitcoin SV (BSV-20)</span>
              </div>
              <div className="contract-item">
                <strong>Total Supply:</strong>
                <span>1,000,000,000</span>
              </div>
              <div className="contract-item">
                <strong>1sat Market:</strong>
                <a 
                  href="https://1sat.market/market/bsv21/acc6543efc620d40895004acaefecbad7cabe9dc447a84342e149eac30d979d3_1" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="contract-link"
                >
                  View on 1sat Market
                </a>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}