'use client';

import React, { useState, useEffect } from 'react';
import './api.css';

const ApiPage: React.FC = () => {
  const [mounted, setMounted] = useState(false);
  const [devSidebarCollapsed, setDevSidebarCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [activeSection, setActiveSection] = useState('authentication');

  useEffect(() => {
    setMounted(true);
    
    // Initialize state after mounting
    const saved = localStorage.getItem('devSidebarCollapsed');
    setDevSidebarCollapsed(saved === 'true');
    setIsMobile(window.innerWidth <= 768);

    // Listen for storage changes to detect sidebar collapse state
    const handleStorageChange = () => {
      const saved = localStorage.getItem('devSidebarCollapsed');
      setDevSidebarCollapsed(saved === 'true');
    };
    
    // Handle window resize
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    
    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('resize', handleResize);
    
    // Check for sidebar state changes via polling
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

  return (
    <div className="app-wrapper">
      <div className={`api-page ${mounted && !isMobile && !devSidebarCollapsed ? 'with-sidebar-expanded' : ''} ${mounted && !isMobile && devSidebarCollapsed ? 'with-sidebar-collapsed' : ''}`}>
        <div className="api-container">
          {/* Hero Section */}
          <section className="api-hero">
            <h1>
              <span style={{color: '#f7931a'}}>Bitcoin Writer</span>{' '}
              <span style={{color: '#ffffff'}}>API</span>
            </h1>
            <p className="api-tagline">
              Complete API reference for integrating Bitcoin Writer into your applications
            </p>
            <div className="api-badge">API v1.0</div>
          </section>

          {/* API Navigation */}
          <section className="api-nav-section">
            <div className="api-nav">
              <button 
                className={activeSection === 'authentication' ? 'active' : ''}
                onClick={() => setActiveSection('authentication')}
              >
                Authentication
              </button>
              <button 
                className={activeSection === 'documents' ? 'active' : ''}
                onClick={() => setActiveSection('documents')}
              >
                Documents
              </button>
              <button 
                className={activeSection === 'blockchain' ? 'active' : ''}
                onClick={() => setActiveSection('blockchain')}
              >
                Blockchain
              </button>
              <button 
                className={activeSection === 'payments' ? 'active' : ''}
                onClick={() => setActiveSection('payments')}
              >
                Payments
              </button>
              <button 
                className={activeSection === 'webhooks' ? 'active' : ''}
                onClick={() => setActiveSection('webhooks')}
              >
                Webhooks
              </button>
            </div>
          </section>

          {/* Authentication Section */}
          {activeSection === 'authentication' && (
            <section className="api-section">
              <h2>Authentication</h2>
              <p>All API requests require authentication using API keys.</p>
              
              <div className="api-endpoint">
                <div className="endpoint-header">
                  <span className="method post">POST</span>
                  <span className="endpoint-url">/api/auth/login</span>
                </div>
                <div className="endpoint-description">
                  Authenticate and receive an access token
                </div>
                <div className="code-block">
                  <pre>{`curl -X POST https://api.bitcoinwriter.com/auth/login \\
  -H "Content-Type: application/json" \\
  -d '{
    "email": "user@example.com",
    "password": "your_password"
  }'`}</pre>
                </div>
              </div>

              <div className="api-endpoint">
                <div className="endpoint-header">
                  <span className="method get">GET</span>
                  <span className="endpoint-url">/api/auth/user</span>
                </div>
                <div className="endpoint-description">
                  Get current user information
                </div>
                <div className="code-block">
                  <pre>{`curl -X GET https://api.bitcoinwriter.com/auth/user \\
  -H "Authorization: Bearer your_access_token"`}</pre>
                </div>
              </div>
            </section>
          )}

          {/* Documents Section */}
          {activeSection === 'documents' && (
            <section className="api-section">
              <h2>Documents</h2>
              <p>Create, read, update, and manage documents through the API.</p>
              
              <div className="api-endpoint">
                <div className="endpoint-header">
                  <span className="method post">POST</span>
                  <span className="endpoint-url">/api/documents</span>
                </div>
                <div className="endpoint-description">
                  Create a new document
                </div>
                <div className="code-block">
                  <pre>{`curl -X POST https://api.bitcoinwriter.com/documents \\
  -H "Authorization: Bearer your_access_token" \\
  -H "Content-Type: application/json" \\
  -d '{
    "title": "My Document",
    "content": "Document content here...",
    "tags": ["bitcoin", "writing"]
  }'`}</pre>
                </div>
              </div>

              <div className="api-endpoint">
                <div className="endpoint-header">
                  <span className="method get">GET</span>
                  <span className="endpoint-url">/api/documents</span>
                </div>
                <div className="endpoint-description">
                  Get all user documents
                </div>
                <div className="code-block">
                  <pre>{`curl -X GET https://api.bitcoinwriter.com/documents \\
  -H "Authorization: Bearer your_access_token"`}</pre>
                </div>
              </div>

              <div className="api-endpoint">
                <div className="endpoint-header">
                  <span className="method get">GET</span>
                  <span className="endpoint-url">/api/documents/:id</span>
                </div>
                <div className="endpoint-description">
                  Get a specific document by ID
                </div>
                <div className="code-block">
                  <pre>{`curl -X GET https://api.bitcoinwriter.com/documents/123 \\
  -H "Authorization: Bearer your_access_token"`}</pre>
                </div>
              </div>
            </section>
          )}

          {/* Blockchain Section */}
          {activeSection === 'blockchain' && (
            <section className="api-section">
              <h2>Blockchain Integration</h2>
              <p>Interact with Bitcoin SV blockchain for document publishing and verification.</p>
              
              <div className="api-endpoint">
                <div className="endpoint-header">
                  <span className="method post">POST</span>
                  <span className="endpoint-url">/api/blockchain/publish</span>
                </div>
                <div className="endpoint-description">
                  Publish document to blockchain
                </div>
                <div className="code-block">
                  <pre>{`curl -X POST https://api.bitcoinwriter.com/blockchain/publish \\
  -H "Authorization: Bearer your_access_token" \\
  -H "Content-Type: application/json" \\
  -d '{
    "document_id": "123",
    "fee_rate": 1
  }'`}</pre>
                </div>
              </div>

              <div className="api-endpoint">
                <div className="endpoint-header">
                  <span className="method get">GET</span>
                  <span className="endpoint-url">/api/blockchain/verify/:hash</span>
                </div>
                <div className="endpoint-description">
                  Verify document on blockchain
                </div>
                <div className="code-block">
                  <pre>{`curl -X GET https://api.bitcoinwriter.com/blockchain/verify/abc123 \\
  -H "Authorization: Bearer your_access_token"`}</pre>
                </div>
              </div>
            </section>
          )}

          {/* Payments Section */}
          {activeSection === 'payments' && (
            <section className="api-section">
              <h2>Payments & Monetization</h2>
              <p>Handle payments and revenue sharing for your content.</p>
              
              <div className="api-endpoint">
                <div className="endpoint-header">
                  <span className="method post">POST</span>
                  <span className="endpoint-url">/api/payments/create</span>
                </div>
                <div className="endpoint-description">
                  Create a payment request
                </div>
                <div className="code-block">
                  <pre>{`curl -X POST https://api.bitcoinwriter.com/payments/create \\
  -H "Authorization: Bearer your_access_token" \\
  -H "Content-Type: application/json" \\
  -d '{
    "amount": 1000,
    "currency": "BSV",
    "description": "Document purchase"
  }'`}</pre>
                </div>
              </div>

              <div className="api-endpoint">
                <div className="endpoint-header">
                  <span className="method get">GET</span>
                  <span className="endpoint-url">/api/payments/history</span>
                </div>
                <div className="endpoint-description">
                  Get payment history
                </div>
                <div className="code-block">
                  <pre>{`curl -X GET https://api.bitcoinwriter.com/payments/history \\
  -H "Authorization: Bearer your_access_token"`}</pre>
                </div>
              </div>
            </section>
          )}

          {/* Webhooks Section */}
          {activeSection === 'webhooks' && (
            <section className="api-section">
              <h2>Webhooks</h2>
              <p>Set up webhooks to receive real-time notifications.</p>
              
              <div className="api-endpoint">
                <div className="endpoint-header">
                  <span className="method post">POST</span>
                  <span className="endpoint-url">/api/webhooks</span>
                </div>
                <div className="endpoint-description">
                  Create a new webhook
                </div>
                <div className="code-block">
                  <pre>{`curl -X POST https://api.bitcoinwriter.com/webhooks \\
  -H "Authorization: Bearer your_access_token" \\
  -H "Content-Type: application/json" \\
  -d '{
    "url": "https://yoursite.com/webhook",
    "events": ["document.created", "payment.completed"]
  }'`}</pre>
                </div>
              </div>

              <div className="api-endpoint">
                <div className="endpoint-header">
                  <span className="method get">GET</span>
                  <span className="endpoint-url">/api/webhooks</span>
                </div>
                <div className="endpoint-description">
                  List all webhooks
                </div>
                <div className="code-block">
                  <pre>{`curl -X GET https://api.bitcoinwriter.com/webhooks \\
  -H "Authorization: Bearer your_access_token"`}</pre>
                </div>
              </div>
            </section>
          )}

          {/* Rate Limits Section */}
          <section className="rate-limits">
            <h2>Rate Limits</h2>
            <div className="rate-limits-grid">
              <div className="rate-limit-card">
                <h3>Free Tier</h3>
                <p>100 requests/hour</p>
              </div>
              <div className="rate-limit-card">
                <h3>Pro Tier</h3>
                <p>1000 requests/hour</p>
              </div>
              <div className="rate-limit-card">
                <h3>Enterprise</h3>
                <p>Unlimited</p>
              </div>
            </div>
          </section>

          {/* SDKs Section */}
          <section className="sdks-section">
            <h2>SDKs & Libraries</h2>
            <div className="sdks-grid">
              <div className="sdk-card">
                <h3>JavaScript/Node.js</h3>
                <div className="code-block">
                  <pre>npm install bitcoin-writer-js</pre>
                </div>
              </div>
              <div className="sdk-card">
                <h3>Python</h3>
                <div className="code-block">
                  <pre>pip install bitcoin-writer</pre>
                </div>
              </div>
              <div className="sdk-card">
                <h3>Go</h3>
                <div className="code-block">
                  <pre>go get github.com/bitcoin-writer/go-sdk</pre>
                </div>
              </div>
              <div className="sdk-card">
                <h3>PHP</h3>
                <div className="code-block">
                  <pre>composer require bitcoin-writer/php-sdk</pre>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default ApiPage;