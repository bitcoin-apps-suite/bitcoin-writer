import React, { useState } from 'react';
import { Download, Upload, FileText, AlertCircle, CheckCircle } from 'lucide-react';
import { GrantSubmissionService, GrantApplicationData } from '../services/GrantSubmissionService';
import { GrantSubmission } from '../types/NFTTypes';

interface GrantSubmissionFormProps {
  applicantType: 'developer' | 'author' | 'publisher';
  onSubmissionComplete?: (submission: GrantSubmission) => void;
}

const GrantSubmissionForm: React.FC<GrantSubmissionFormProps> = ({ 
  applicantType, 
  onSubmissionComplete 
}) => {
  const [formData, setFormData] = useState<GrantApplicationData>({
    applicantName: '',
    email: '',
    bsvAddress: '',
    applicantType,
    projectTitle: '',
    projectDescription: '',
    requestedAmount: 0,
    requestedCurrency: 'BWRITER',
    estimatedDuration: '',
    portfolio: '',
    githubProfile: '',
    previousWork: '',
    timeline: ''
  });

  const [attachments, setAttachments] = useState<File[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionResult, setSubmissionResult] = useState<{
    nft: GrantSubmission;
    fileData: ArrayBuffer;
    submissionId: string;
    publicUrl: string;
  } | null>(null);
  const [error, setError] = useState<string | null>(null);

  const grantService = new GrantSubmissionService();

  const handleInputChange = (field: keyof GrantApplicationData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    setAttachments(prev => [...prev, ...files]);
  };

  const removeAttachment = (index: number) => {
    setAttachments(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      // Validate required fields
      if (!formData.applicantName || !formData.email || !formData.bsvAddress || 
          !formData.projectTitle || !formData.projectDescription) {
        throw new Error('Please fill in all required fields');
      }

      // Create .nft submission
      const result = await grantService.createGrantSubmission({
        ...formData,
        attachments
      });

      setSubmissionResult(result);
      onSubmissionComplete?.(result.nft);

    } catch (err: any) {
      setError(err.message || 'Failed to create submission');
    } finally {
      setIsSubmitting(false);
    }
  };

  const downloadNFTFile = () => {
    if (!submissionResult) return;

    const blob = new Blob([submissionResult.fileData], { type: 'application/octet-stream' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${submissionResult.submissionId}.nft`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const getFieldPlaceholder = (field: string) => {
    const placeholders: { [key: string]: { [key: string]: string } } = {
      developer: {
        projectTitle: 'Bitcoin Writer Plugin Development',
        projectDescription: 'Describe the technical solution you want to build...',
        timeline: 'Phase 1: Research (1 month)\nPhase 2: Development (2 months)\nPhase 3: Testing & Launch (1 month)'
      },
      author: {
        projectTitle: 'STEM Education Content Series',
        projectDescription: 'Describe the educational content you want to create...',
        timeline: 'Week 1-2: Research & Outline\nWeek 3-8: Writing & Editing\nWeek 9-10: Review & Publishing'
      },
      publisher: {
        projectTitle: 'Blockchain Publishing Platform',
        projectDescription: 'Describe the publishing infrastructure you want to build...',
        timeline: 'Month 1: Platform Design\nMonth 2-4: Development\nMonth 5-6: Launch & Scaling'
      }
    };

    return placeholders[applicantType]?.[field] || '';
  };

  if (submissionResult) {
    return (
      <div className="submission-success">
        <div className="success-header">
          <CheckCircle size={48} color="#22c55e" />
          <h2>Submission Created Successfully!</h2>
          <p>Your grant application has been converted to a .nft file</p>
        </div>

        <div className="submission-details">
          <div className="detail-row">
            <strong>Submission ID:</strong> {submissionResult.submissionId}
          </div>
          <div className="detail-row">
            <strong>File Size:</strong> {Math.round(submissionResult.fileData.byteLength / 1024)} KB
          </div>
          <div className="detail-row">
            <strong>Status:</strong> Pending Review
          </div>
          <div className="detail-row">
            <strong>Public URL:</strong> 
            <a href={submissionResult.publicUrl} target="_blank" rel="noopener noreferrer">
              {submissionResult.publicUrl}
            </a>
          </div>
        </div>

        <div className="nft-info">
          <h3>About Your .nft File</h3>
          <ul>
            <li>Your application is now stored as an immutable .nft container</li>
            <li>It includes your formatted application, attachments, and metadata</li>
            <li>Bitcoin Writer will review and potentially award $BWRITER tokens</li>
            <li>The Tulip Trust can discover and fund your submission independently</li>
            <li>All funding to your BSV address will be automatically detected</li>
          </ul>
        </div>

        <div className="action-buttons">
          <button onClick={downloadNFTFile} className="download-btn">
            <Download size={20} />
            Download .nft File
          </button>
          <button 
            onClick={() => setSubmissionResult(null)} 
            className="new-submission-btn"
          >
            Submit Another Application
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="grant-submission-form">
      <div className="form-header">
        <h2>Submit {applicantType.charAt(0).toUpperCase() + applicantType.slice(1)} Grant Application</h2>
        <p>Your application will be saved as a .nft file and made publicly available for funding consideration.</p>
      </div>

      {error && (
        <div className="error-message">
          <AlertCircle size={20} />
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="submission-form">
        <div className="form-section">
          <h3>Applicant Information</h3>
          
          <div className="form-group">
            <label>Full Name *</label>
            <input
              type="text"
              value={formData.applicantName}
              onChange={(e) => handleInputChange('applicantName', e.target.value)}
              placeholder="Your full name"
              required
            />
          </div>

          <div className="form-group">
            <label>Email Address *</label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => handleInputChange('email', e.target.value)}
              placeholder="your.email@example.com"
              required
            />
          </div>

          <div className="form-group">
            <label>BSV Address *</label>
            <input
              type="text"
              value={formData.bsvAddress}
              onChange={(e) => handleInputChange('bsvAddress', e.target.value)}
              placeholder="1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa"
              required
            />
            <small>This address will be monitored for funding from the Tulip Trust</small>
          </div>

          <div className="form-group">
            <label>Portfolio/Website</label>
            <input
              type="url"
              value={formData.portfolio}
              onChange={(e) => handleInputChange('portfolio', e.target.value)}
              placeholder="https://your-portfolio.com"
            />
          </div>

          {applicantType === 'developer' && (
            <div className="form-group">
              <label>GitHub Profile</label>
              <input
                type="url"
                value={formData.githubProfile}
                onChange={(e) => handleInputChange('githubProfile', e.target.value)}
                placeholder="https://github.com/yourusername"
              />
            </div>
          )}
        </div>

        <div className="form-section">
          <h3>Project Details</h3>
          
          <div className="form-group">
            <label>Project Title *</label>
            <input
              type="text"
              value={formData.projectTitle}
              onChange={(e) => handleInputChange('projectTitle', e.target.value)}
              placeholder={getFieldPlaceholder('projectTitle')}
              required
            />
          </div>

          <div className="form-group">
            <label>Project Description *</label>
            <textarea
              value={formData.projectDescription}
              onChange={(e) => handleInputChange('projectDescription', e.target.value)}
              placeholder={getFieldPlaceholder('projectDescription')}
              rows={6}
              required
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Requested Amount *</label>
              <input
                type="number"
                value={formData.requestedAmount}
                onChange={(e) => handleInputChange('requestedAmount', parseInt(e.target.value) || 0)}
                placeholder="10000"
                required
              />
            </div>
            <div className="form-group">
              <label>Currency</label>
              <select
                value={formData.requestedCurrency}
                onChange={(e) => handleInputChange('requestedCurrency', e.target.value)}
              >
                <option value="BWRITER">$BWRITER Tokens</option>
                <option value="BSV">BSV (via Tulip Trust)</option>
              </select>
            </div>
          </div>

          <div className="form-group">
            <label>Estimated Duration</label>
            <input
              type="text"
              value={formData.estimatedDuration}
              onChange={(e) => handleInputChange('estimatedDuration', e.target.value)}
              placeholder="3 months"
            />
          </div>

          <div className="form-group">
            <label>Timeline & Milestones</label>
            <textarea
              value={formData.timeline}
              onChange={(e) => handleInputChange('timeline', e.target.value)}
              placeholder={getFieldPlaceholder('timeline')}
              rows={4}
            />
          </div>
        </div>

        <div className="form-section">
          <h3>Previous Work & Experience</h3>
          
          <div className="form-group">
            <label>Previous Work</label>
            <textarea
              value={formData.previousWork}
              onChange={(e) => handleInputChange('previousWork', e.target.value)}
              placeholder="Describe relevant previous projects, publications, or experience..."
              rows={4}
            />
          </div>
        </div>

        <div className="form-section">
          <h3>Attachments</h3>
          
          <div className="file-upload-area">
            <input
              type="file"
              multiple
              onChange={handleFileUpload}
              accept=".pdf,.doc,.docx,.txt,.png,.jpg,.jpeg"
              id="file-upload"
              style={{ display: 'none' }}
            />
            <label htmlFor="file-upload" className="upload-button">
              <Upload size={20} />
              Upload Supporting Documents
            </label>
            <small>PDF, DOC, images - Max 10MB per file</small>
          </div>

          {attachments.length > 0 && (
            <div className="attachments-list">
              {attachments.map((file, index) => (
                <div key={index} className="attachment-item">
                  <FileText size={16} />
                  <span>{file.name} ({Math.round(file.size / 1024)} KB)</span>
                  <button type="button" onClick={() => removeAttachment(index)}>×</button>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="form-actions">
          <button type="submit" disabled={isSubmitting} className="submit-button">
            {isSubmitting ? 'Creating .nft File...' : 'Submit Application'}
          </button>
        </div>
      </form>

      <div className="nft-explanation">
        <h4>What happens next?</h4>
        <ol>
          <li>Your application will be converted to a .nft container file</li>
          <li>Bitcoin Writer will review and potentially award $BWRITER tokens</li>
          <li>Your submission becomes publicly discoverable by the Tulip Trust</li>
          <li>If funded, the blockchain transaction will be automatically detected</li>
          <li>You'll have an immutable record of your successful grant application</li>
        </ol>
      </div>
    </div>
  );
};

export default GrantSubmissionForm;