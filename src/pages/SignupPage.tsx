import React, { useState } from 'react';
import './SignupPage.css';
import Footer from '../components/Footer';

const SignupPage: React.FC = () => {
  const [formData, setFormData] = useState({
    email: '',
    name: '',
    userType: 'writer',
    interests: [] as string[]
  });
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // For now, store in localStorage (in production, send to backend)
    const signups = JSON.parse(localStorage.getItem('bwriter-signups') || '[]');
    signups.push({
      ...formData,
      timestamp: new Date().toISOString()
    });
    localStorage.setItem('bwriter-signups', JSON.stringify(signups));
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    setIsLoading(false);
    setIsSubmitted(true);
  };

  const handleInterestToggle = (interest: string) => {
    setFormData(prev => ({
      ...prev,
      interests: prev.interests.includes(interest)
        ? prev.interests.filter(i => i !== interest)
        : [...prev.interests, interest]
    }));
  };

  if (isSubmitted) {
    return (
      <div className="signup-page">
        <div className="signup-container success">
          <div className="success-icon">🎉</div>
          <h1>Welcome to the Future of Writing!</h1>
          <p>Thank you for signing up. We'll keep you updated on Bitcoin Writer's development.</p>
          <p className="success-note">
            You'll be among the first to know when we launch new features, 
            and you may receive exclusive early access opportunities.
          </p>
          <button 
            className="cta-button"
            onClick={() => window.location.href = '/platform'}
          >
            Learn More About Bitcoin Writer
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="signup-page">
      <div className="signup-container">
        <div className="signup-header">
          <h1>Join Bitcoin Writer</h1>
          <p className="subtitle">Be part of the decentralized publishing revolution</p>
        </div>

        <form onSubmit={handleSubmit} className="signup-form">
          <div className="form-group">
            <label htmlFor="email">Email Address *</label>
            <input
              type="email"
              id="email"
              required
              placeholder="your@email.com"
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
            />
          </div>

          <div className="form-group">
            <label htmlFor="name">Name (Optional)</label>
            <input
              type="text"
              id="name"
              placeholder="Your name"
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
            />
          </div>

          <div className="form-group">
            <label>I'm interested in Bitcoin Writer as a:</label>
            <div className="radio-group">
              <label className="radio-option">
                <input
                  type="radio"
                  name="userType"
                  value="writer"
                  checked={formData.userType === 'writer'}
                  onChange={(e) => setFormData({...formData, userType: e.target.value})}
                />
                <span>Writer/Author</span>
              </label>
              <label className="radio-option">
                <input
                  type="radio"
                  name="userType"
                  value="developer"
                  checked={formData.userType === 'developer'}
                  onChange={(e) => setFormData({...formData, userType: e.target.value})}
                />
                <span>Developer</span>
              </label>
              <label className="radio-option">
                <input
                  type="radio"
                  name="userType"
                  value="publisher"
                  checked={formData.userType === 'publisher'}
                  onChange={(e) => setFormData({...formData, userType: e.target.value})}
                />
                <span>Publisher</span>
              </label>
              <label className="radio-option">
                <input
                  type="radio"
                  name="userType"
                  value="reader"
                  checked={formData.userType === 'reader'}
                  onChange={(e) => setFormData({...formData, userType: e.target.value})}
                />
                <span>Reader</span>
              </label>
              <label className="radio-option">
                <input
                  type="radio"
                  name="userType"
                  value="investor"
                  checked={formData.userType === 'investor'}
                  onChange={(e) => setFormData({...formData, userType: e.target.value})}
                />
                <span>Investor/Token Holder</span>
              </label>
            </div>
          </div>

          <div className="form-group">
            <label>I'm interested in: (select all that apply)</label>
            <div className="checkbox-group">
              {[
                'Decentralized publishing',
                'NFT documents',
                'Micropayments for content',
                'Censorship-resistant writing',
                'BWRITER tokens',
                'Developer opportunities',
                'Early access',
                'Investment opportunities'
              ].map(interest => (
                <label key={interest} className="checkbox-option">
                  <input
                    type="checkbox"
                    checked={formData.interests.includes(interest)}
                    onChange={() => handleInterestToggle(interest)}
                  />
                  <span>{interest}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="form-footer">
            <p className="privacy-note">
              We respect your privacy. Your email will only be used for Bitcoin Writer updates 
              and will never be shared with third parties.
            </p>
            <button type="submit" className="submit-button" disabled={isLoading}>
              {isLoading ? 'Signing Up...' : 'Sign Up for Updates'}
            </button>
          </div>
        </form>

        <div className="signup-benefits">
          <h3>What You'll Get:</h3>
          <ul>
            <li>Early access to new features</li>
            <li>Exclusive BWRITER token opportunities</li>
            <li>Platform updates and development news</li>
            <li>Invitations to beta testing</li>
            <li>Special launch day bonuses</li>
          </ul>
        </div>

        <div className="signup-stats">
          <div className="stat">
            <span className="stat-number">1,000,000</span>
            <span className="stat-label">BWRITER Tokens Reserved for Early Users</span>
          </div>
          <div className="stat">
            <span className="stat-number">∞</span>
            <span className="stat-label">Documents Preserved Forever</span>
          </div>
          <div className="stat">
            <span className="stat-number">24/7</span>
            <span className="stat-label">Blockchain Availability</span>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default SignupPage;