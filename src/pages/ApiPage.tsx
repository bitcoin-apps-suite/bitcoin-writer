import React, { useState, useEffect } from 'react';
import './ApiPage.css';
import Footer from '../components/Footer';

const ApiPage: React.FC = () => {
  const [devSidebarCollapsed, setDevSidebarCollapsed] = useState(() => {
    const saved = localStorage.getItem('devSidebarCollapsed');
    return saved === 'true';
  });
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [activeSection, setActiveSection] = useState('authentication');

  useEffect(() => {
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
    <div className="App">
      <div className={`api-page ${!isMobile && !devSidebarCollapsed ? 'with-sidebar-expanded' : ''} ${!isMobile && devSidebarCollapsed ? 'with-sidebar-collapsed' : ''}`}>
      <div className="api-container">
        {/* Hero Section */}
        <section className="api-hero">
          <h1>Bitcoin Writer <span style={{color: '#ffffff'}}>API</span></h1>
          <p className="api-tagline">
            Complete API reference for integrating Bitcoin Writer
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
          <section className="api-content-section">
            <h2>Authentication</h2>
            <div className="api-description">
              <p>Bitcoin Writer API uses API keys to authenticate requests. You can view and manage your API keys in your account settings.</p>
            </div>
            
            <div className="endpoint-card">
              <div className="endpoint-header">
                <span className="method post">POST</span>
                <code className="endpoint-path">/api/auth/token</code>
              </div>
              <p>Generate an access token using your API key</p>
              <div className="code-block">
                <pre>{`curl -X POST https://api.bitcoinwriter.io/v1/auth/token \\
  -H "Content-Type: application/json" \\
  -d '{
    "api_key": "your_api_key",
    "api_secret": "your_api_secret"
  }'`}</pre>
              </div>
              <div className="response-example">
                <h4>Response</h4>
                <pre>{`{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "token_type": "Bearer",
  "expires_in": 3600
}`}</pre>
              </div>
            </div>
          </section>
        )}

        {/* Documents Section */}
        {activeSection === 'documents' && (
          <section className="api-content-section">
            <h2>Documents</h2>
            <div className="api-description">
              <p>Create, read, update, and delete documents stored on the BSV blockchain.</p>
            </div>
            
            <div className="endpoint-card">
              <div className="endpoint-header">
                <span className="method get">GET</span>
                <code className="endpoint-path">/api/documents</code>
              </div>
              <p>List all documents for the authenticated user</p>
              <div className="code-block">
                <pre>{`curl -X GET https://api.bitcoinwriter.io/v1/documents \\
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"`}</pre>
              </div>
            </div>

            <div className="endpoint-card">
              <div className="endpoint-header">
                <span className="method post">POST</span>
                <code className="endpoint-path">/api/documents</code>
              </div>
              <p>Create a new document</p>
              <div className="code-block">
                <pre>{`curl -X POST https://api.bitcoinwriter.io/v1/documents \\
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \\
  -H "Content-Type: application/json" \\
  -d '{
    "title": "My Document",
    "content": "Document content here",
    "public": true
  }'`}</pre>
              </div>
            </div>

            <div className="endpoint-card">
              <div className="endpoint-header">
                <span className="method put">PUT</span>
                <code className="endpoint-path">/api/documents/:id</code>
              </div>
              <p>Update an existing document</p>
              <div className="code-block">
                <pre>{`curl -X PUT https://api.bitcoinwriter.io/v1/documents/doc_123 \\
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \\
  -H "Content-Type: application/json" \\
  -d '{
    "content": "Updated content"
  }'`}</pre>
              </div>
            </div>

            <div className="endpoint-card">
              <div className="endpoint-header">
                <span className="method delete">DELETE</span>
                <code className="endpoint-path">/api/documents/:id</code>
              </div>
              <p>Delete a document</p>
              <div className="code-block">
                <pre>{`curl -X DELETE https://api.bitcoinwriter.io/v1/documents/doc_123 \\
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"`}</pre>
              </div>
            </div>
          </section>
        )}

        {/* Blockchain Section */}
        {activeSection === 'blockchain' && (
          <section className="api-content-section">
            <h2>Blockchain Operations</h2>
            <div className="api-description">
              <p>Interact directly with the BSV blockchain for document verification and transactions.</p>
            </div>
            
            <div className="endpoint-card">
              <div className="endpoint-header">
                <span className="method get">GET</span>
                <code className="endpoint-path">/api/blockchain/verify/:txid</code>
              </div>
              <p>Verify a document on the blockchain</p>
              <div className="code-block">
                <pre>{`curl -X GET https://api.bitcoinwriter.io/v1/blockchain/verify/abc123... \\
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"`}</pre>
              </div>
            </div>

            <div className="endpoint-card">
              <div className="endpoint-header">
                <span className="method post">POST</span>
                <code className="endpoint-path">/api/blockchain/broadcast</code>
              </div>
              <p>Broadcast a transaction to the blockchain</p>
              <div className="code-block">
                <pre>{`curl -X POST https://api.bitcoinwriter.io/v1/blockchain/broadcast \\
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \\
  -H "Content-Type: application/json" \\
  -d '{
    "raw_tx": "0100000001..."
  }'`}</pre>
              </div>
            </div>
          </section>
        )}

        {/* Payments Section */}
        {activeSection === 'payments' && (
          <section className="api-content-section">
            <h2>Payments</h2>
            <div className="api-description">
              <p>Handle BSV payments and micropayments for document access.</p>
            </div>
            
            <div className="endpoint-card">
              <div className="endpoint-header">
                <span className="method post">POST</span>
                <code className="endpoint-path">/api/payments/invoice</code>
              </div>
              <p>Create a payment invoice</p>
              <div className="code-block">
                <pre>{`curl -X POST https://api.bitcoinwriter.io/v1/payments/invoice \\
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \\
  -H "Content-Type: application/json" \\
  -d '{
    "amount": 1000,
    "currency": "satoshis",
    "description": "Document access fee"
  }'`}</pre>
              </div>
            </div>

            <div className="endpoint-card">
              <div className="endpoint-header">
                <span className="method get">GET</span>
                <code className="endpoint-path">/api/payments/status/:invoice_id</code>
              </div>
              <p>Check payment status</p>
              <div className="code-block">
                <pre>{`curl -X GET https://api.bitcoinwriter.io/v1/payments/status/inv_123 \\
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"`}</pre>
              </div>
            </div>
          </section>
        )}

        {/* Webhooks Section */}
        {activeSection === 'webhooks' && (
          <section className="api-content-section">
            <h2>Webhooks</h2>
            <div className="api-description">
              <p>Configure webhooks to receive real-time notifications about events.</p>
            </div>
            
            <div className="endpoint-card">
              <div className="endpoint-header">
                <span className="method post">POST</span>
                <code className="endpoint-path">/api/webhooks</code>
              </div>
              <p>Create a webhook endpoint</p>
              <div className="code-block">
                <pre>{`curl -X POST https://api.bitcoinwriter.io/v1/webhooks \\
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \\
  -H "Content-Type: application/json" \\
  -d '{
    "url": "https://your-server.com/webhook",
    "events": ["document.created", "payment.received"],
    "active": true
  }'`}</pre>
              </div>
            </div>

            <div className="endpoint-card">
              <div className="endpoint-header">
                <span className="method get">GET</span>
                <code className="endpoint-path">/api/webhooks</code>
              </div>
              <p>List all configured webhooks</p>
              <div className="code-block">
                <pre>{`curl -X GET https://api.bitcoinwriter.io/v1/webhooks \\
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"`}</pre>
              </div>
            </div>
          </section>
        )}

        {/* Rate Limits Section */}
        <section className="rate-limits-section">
          <h2>Rate Limits</h2>
          <div className="rate-limits-content">
            <p>API requests are subject to the following rate limits:</p>
            <div className="limits-grid">
              <div className="limit-card">
                <h3>Free Tier</h3>
                <ul>
                  <li>100 requests per hour</li>
                  <li>1,000 requests per day</li>
                  <li>10 concurrent requests</li>
                </ul>
              </div>
              <div className="limit-card">
                <h3>Pro Tier</h3>
                <ul>
                  <li>1,000 requests per hour</li>
                  <li>10,000 requests per day</li>
                  <li>50 concurrent requests</li>
                </ul>
              </div>
              <div className="limit-card">
                <h3>Enterprise</h3>
                <ul>
                  <li>Custom limits</li>
                  <li>Dedicated infrastructure</li>
                  <li>SLA guarantee</li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* SDKs Section */}
        <section className="sdks-section">
          <h2>SDKs & Libraries</h2>
          <div className="sdks-grid">
            <div className="sdk-card">
              <h3>JavaScript/TypeScript</h3>
              <code>npm install @bitcoinwriter/sdk</code>
              <a href="https://github.com/bitcoin-apps-suite/bitcoinwriter-js" target="_blank" rel="noopener noreferrer">
                View on GitHub →
              </a>
            </div>
            <div className="sdk-card">
              <h3>Python</h3>
              <code>pip install bitcoinwriter</code>
              <a href="https://github.com/bitcoin-apps-suite/bitcoinwriter-python" target="_blank" rel="noopener noreferrer">
                View on GitHub →
              </a>
            </div>
            <div className="sdk-card">
              <h3>Go</h3>
              <code>go get github.com/bitcoin-apps-suite/bitcoinwriter-go</code>
              <a href="https://github.com/bitcoin-apps-suite/bitcoinwriter-go" target="_blank" rel="noopener noreferrer">
                View on GitHub →
              </a>
            </div>
          </div>
        </section>
      </div>
      <Footer />
      </div>
    </div>
  );
};

export default ApiPage;