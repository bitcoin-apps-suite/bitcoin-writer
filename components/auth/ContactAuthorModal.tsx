import React, { useState } from 'react';
import './ContactAuthorModal.css';

interface ContactAuthorModalProps {
  isOpen: boolean;
  onClose: () => void;
  authorName: string;
  authorId: string;
}

const ContactAuthorModal: React.FC<ContactAuthorModalProps> = ({
  isOpen,
  onClose,
  authorName,
  authorId
}) => {
  const [formData, setFormData] = useState({
    projectTitle: '',
    projectDescription: '',
    budget: '',
    timeline: '',
    email: '',
    message: ''
  });
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authMethod, setAuthMethod] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleGoogleSignIn = () => {
    // In production, implement Google OAuth
    console.log('Signing in with Google...');
    setIsAuthenticated(true);
    setAuthMethod('Google');
    // Set email from Google account
    setFormData(prev => ({ ...prev, email: 'user@gmail.com' }));
  };

  const handleTwitterSignIn = () => {
    // In production, implement Twitter OAuth
    console.log('Signing in with Twitter...');
    setIsAuthenticated(true);
    setAuthMethod('Twitter');
  };

  const handleHandCashSignIn = () => {
    // In production, implement HandCash authentication
    console.log('Signing in with HandCash...');
    setIsAuthenticated(true);
    setAuthMethod('HandCash');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAuthenticated) {
      alert('Please sign in to send your message');
      return;
    }
    console.log('Submitting contact form:', formData);
    alert(`Your message has been sent to ${authorName}! They will respond via ${formData.email || 'your authenticated account'}.`);
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="contact-author-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Contact {authorName}</h2>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>

        <div className="modal-content">
          {!isAuthenticated ? (
            <div className="auth-section">
              <h3>Sign in to Contact Writer</h3>
              <p>Choose your preferred authentication method:</p>
              
              <div className="auth-buttons">
                <button className="auth-btn google-auth" onClick={handleGoogleSignIn}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                  </svg>
                  Sign in with Google
                </button>

                <button className="auth-btn twitter-auth" onClick={handleTwitterSignIn}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                  </svg>
                  Sign in with Twitter
                </button>

                <button className="auth-btn handcash-auth" onClick={handleHandCashSignIn}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                    <circle cx="12" cy="12" r="10" stroke="#38CB7C" strokeWidth="2"/>
                    <path d="M12 6v12M8 10h8" stroke="#38CB7C" strokeWidth="2" strokeLinecap="round"/>
                  </svg>
                  Sign with HandCash
                </button>
              </div>
            </div>
          ) : (
            <div className="contact-form-section">
              <div className="auth-status">
                <span className="status-badge">✓ Signed in with {authMethod}</span>
              </div>

              <form onSubmit={handleSubmit}>
                <div className="form-group">
                  <label>Project Title</label>
                  <input
                    type="text"
                    value={formData.projectTitle}
                    onChange={(e) => setFormData({...formData, projectTitle: e.target.value})}
                    placeholder="Enter your project title"
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Project Description</label>
                  <textarea
                    value={formData.projectDescription}
                    onChange={(e) => setFormData({...formData, projectDescription: e.target.value})}
                    placeholder="Describe your writing needs..."
                    rows={4}
                    required
                  />
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Budget Range</label>
                    <select
                      value={formData.budget}
                      onChange={(e) => setFormData({...formData, budget: e.target.value})}
                      required
                    >
                      <option value="">Select budget</option>
                      <option value="$100-500">$100 - $500</option>
                      <option value="$500-1000">$500 - $1,000</option>
                      <option value="$1000-5000">$1,000 - $5,000</option>
                      <option value="$5000+">$5,000+</option>
                      <option value="negotiable">Negotiable</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label>Timeline</label>
                    <select
                      value={formData.timeline}
                      onChange={(e) => setFormData({...formData, timeline: e.target.value})}
                      required
                    >
                      <option value="">Select timeline</option>
                      <option value="urgent">Urgent (1-3 days)</option>
                      <option value="week">1 week</option>
                      <option value="2weeks">2 weeks</option>
                      <option value="month">1 month</option>
                      <option value="ongoing">Ongoing</option>
                    </select>
                  </div>
                </div>

                <div className="form-group">
                  <label>Your Email</label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    placeholder="your@email.com"
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Additional Message</label>
                  <textarea
                    value={formData.message}
                    onChange={(e) => setFormData({...formData, message: e.target.value})}
                    placeholder="Any additional details or requirements..."
                    rows={3}
                  />
                </div>

                <div className="form-actions">
                  <button type="button" className="cancel-btn" onClick={onClose}>
                    Cancel
                  </button>
                  <button type="submit" className="submit-btn">
                    Send Message →
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ContactAuthorModal;