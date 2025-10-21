'use client'

import React, { useState, useEffect } from 'react';
import { 
  Cpu, 
  DollarSign, 
  Users, 
  FileText, 
  Upload, 
  GitBranch, 
  Zap, 
  Shield,
  CheckCircle,
  AlertCircle,
  Clock,
  Wallet
} from 'lucide-react';
import './developer-grants.css';

interface GrantApplication {
  projectTitle: string;
  description: string;
  category: string;
  estimatedHours: number;
  tokenReward: number;
  githubRepo: string;
  walletAddress: string;
  teamMembers: string;
  timeline: string;
  technicalDetails: string;
  previousWork: string;
  files: FileList | null;
}

export default function DeveloperGrantsPage() {
  const [mounted, setMounted] = useState(false);
  const [devSidebarCollapsed, setDevSidebarCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [formData, setFormData] = useState<GrantApplication>({
    projectTitle: '',
    description: '',
    category: '',
    estimatedHours: 0,
    tokenReward: 0,
    githubRepo: '',
    walletAddress: '',
    teamMembers: '',
    timeline: '',
    technicalDetails: '',
    previousWork: '',
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
      
      // Add all form fields
      Object.entries(formData).forEach(([key, value]) => {
        if (key !== 'files') {
          submissionData.append(key, value.toString());
        }
      });

      // Add files
      if (formData.files) {
        Array.from(formData.files).forEach((file, index) => {
          submissionData.append(`file_${index}`, file);
        });
      }

      // Submit to API
      const response = await fetch('/api/grants/developer/submit', {
        method: 'POST',
        body: submissionData
      });

      if (response.ok) {
        setSubmitStatus('success');
        // Reset form
        setFormData({
          projectTitle: '',
          description: '',
          category: '',
          estimatedHours: 0,
          tokenReward: 0,
          githubRepo: '',
          walletAddress: '',
          teamMembers: '',
          timeline: '',
          technicalDetails: '',
          previousWork: '',
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

  const categories = [
    'Infrastructure Development',
    'Protocol Innovation', 
    'Developer Tooling',
    'Research Projects',
    'Platform Integration',
    'Security Enhancement',
    'Performance Optimization',
    'Educational Tools'
  ];

  return (
    <div className="App">
      <div className={`developer-grants-page ${mounted && !isMobile && !devSidebarCollapsed ? 'with-sidebar-expanded' : ''} ${mounted && !isMobile && devSidebarCollapsed ? 'with-sidebar-collapsed' : ''}`}>
        <div className="developer-grants-container">
          {/* Hero Section */}
          <section className="developer-grants-hero">
            <div className="developer-grants-hero-icon">
              <Cpu size={64} />
            </div>
            <h1>Developer <span style={{color: '#FF6B35'}}>Grant Application</span></h1>
            <p className="developer-grants-tagline">
              Submit your blockchain development project for $BWRITER token funding
            </p>
            <div className="developer-grants-badge">DEVELOPER PROGRAM</div>
          </section>

          {/* Form Section */}
          <section className="grant-form-section">
            <div className="form-container">
              <form onSubmit={handleSubmit} className="grant-form">
                {/* Project Details */}
                <div className="form-group">
                  <h3><Zap size={20} style={{marginRight: '8px', verticalAlign: 'middle'}} />Project Details</h3>
                  
                  <div className="input-group">
                    <label htmlFor="projectTitle">Project Title *</label>
                    <input
                      type="text"
                      id="projectTitle"
                      name="projectTitle"
                      value={formData.projectTitle}
                      onChange={handleInputChange}
                      placeholder="Enter your project title"
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
                      placeholder="Describe your project, its goals, and impact on the BSV ecosystem"
                      rows={4}
                      required
                    />
                  </div>

                  <div className="input-row">
                    <div className="input-group">
                      <label htmlFor="category">Category *</label>
                      <select
                        id="category"
                        name="category"
                        value={formData.category}
                        onChange={handleInputChange}
                        required
                      >
                        <option value="">Select Category</option>
                        {categories.map(cat => (
                          <option key={cat} value={cat}>{cat}</option>
                        ))}
                      </select>
                    </div>

                    <div className="input-group">
                      <label htmlFor="estimatedHours">Estimated Hours *</label>
                      <input
                        type="number"
                        id="estimatedHours"
                        name="estimatedHours"
                        value={formData.estimatedHours}
                        onChange={handleInputChange}
                        placeholder="0"
                        min="1"
                        required
                      />
                    </div>
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

                {/* Technical Details */}
                <div className="form-group">
                  <h3><GitBranch size={20} style={{marginRight: '8px', verticalAlign: 'middle'}} />Technical Details</h3>
                  
                  <div className="input-group">
                    <label htmlFor="githubRepo">GitHub Repository</label>
                    <input
                      type="url"
                      id="githubRepo"
                      name="githubRepo"
                      value={formData.githubRepo}
                      onChange={handleInputChange}
                      placeholder="https://github.com/username/repository"
                    />
                  </div>

                  <div className="input-group">
                    <label htmlFor="technicalDetails">Technical Implementation *</label>
                    <textarea
                      id="technicalDetails"
                      name="technicalDetails"
                      value={formData.technicalDetails}
                      onChange={handleInputChange}
                      placeholder="Describe the technical approach, architecture, technologies used, and implementation details"
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
                      placeholder="Link to previous projects, GitHub contributions, or relevant experience"
                      rows={3}
                    />
                  </div>
                </div>

                {/* Team & Timeline */}
                <div className="form-group">
                  <h3><Users size={20} style={{marginRight: '8px', verticalAlign: 'middle'}} />Team & Timeline</h3>
                  
                  <div className="input-group">
                    <label htmlFor="teamMembers">Team Members</label>
                    <textarea
                      id="teamMembers"
                      name="teamMembers"
                      value={formData.teamMembers}
                      onChange={handleInputChange}
                      placeholder="List team members, their roles, and relevant experience"
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
                      placeholder="Break down project milestones and estimated completion dates"
                      rows={3}
                      required
                    />
                  </div>
                </div>

                {/* Wallet & Files */}
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
                      accept=".pdf,.doc,.docx,.txt,.md,.zip"
                    />
                    <small>Upload project specifications, mockups, or additional documentation (PDF, DOC, TXT, MD, ZIP)</small>
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
                <p>Applications are reviewed within 7-14 days. We evaluate technical merit, feasibility, and potential impact on the BSV ecosystem.</p>
              </div>
              <div className="info-card">
                <DollarSign size={32} />
                <h4>Token Rewards</h4>
                <p>$BWRITER tokens are awarded based on project scope and complexity. Typical ranges: 10K-1M tokens for development projects.</p>
              </div>
              <div className="info-card">
                <Users size={32} />
                <h4>Public Discovery</h4>
                <p>Approved applications become publicly visible for independent funding opportunities beyond Bitcoin Writer grants.</p>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}