import React from 'react';
import { Link } from 'react-router-dom';
import './NotFoundPage.css';

const NotFoundPage: React.FC = () => {
  return (
    <div className="not-found-page">
      <div className="not-found-container">
        <div className="not-found-content">
          <div className="error-code">404</div>
          <h1>Page Not Found</h1>
          <p>The page you're looking for doesn't exist or has been moved.</p>
          
          <div className="not-found-actions">
            <Link to="/" className="btn-primary">
              📝 Go to Editor
            </Link>
            <Link to="/market" className="btn-secondary">
              📈 Browse Market
            </Link>
            <Link to="/authors" className="btn-secondary">
              ✍️ View Authors
            </Link>
          </div>

          <div className="help-section">
            <h3>What you can do:</h3>
            <ul>
              <li>Start writing your first article</li>
              <li>Browse published content in the market</li>
              <li>Discover featured authors</li>
              <li>Sign in with HandCash to publish your work</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotFoundPage;