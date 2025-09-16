import React from 'react';
import './ModalStyles.css';

interface APIDocumentationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const APIDocumentationModal: React.FC<APIDocumentationModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{maxWidth: '800px'}}>
        <div className="modal-header">
          <h2>API Documentation</h2>
          <button className="modal-close" onClick={onClose}>×</button>
        </div>
        
        <div className="modal-body">
          <div className="preference-section">
            <h3>Authentication</h3>
            <p style={{color: 'rgba(255,255,255,0.8)', marginBottom: '16px'}}>
              All API requests require a valid HandCash access token in the Authorization header:
            </p>
            <div className="api-endpoint">
              <code style={{color: '#00ff88'}}>Authorization: Bearer YOUR_ACCESS_TOKEN</code>
            </div>
          </div>

          <div className="preference-section">
            <h3>Document Endpoints</h3>
            
            <div className="api-endpoint">
              <div style={{marginBottom: '8px'}}>
                <span className="api-method post">POST</span>
                <span className="api-path">/api/documents</span>
              </div>
              <p style={{color: 'rgba(255,255,255,0.7)', fontSize: '13px', marginBottom: '8px'}}>
                Create a new document
              </p>
              <pre style={{color: '#00ff88', fontSize: '12px', background: 'rgba(0,0,0,0.3)', padding: '8px', borderRadius: '4px'}}>
{`{
  "title": "My Document",
  "content": "Document content...",
  "encrypted": true,
  "storage_method": "op_return"
}`}
              </pre>
            </div>

            <div className="api-endpoint">
              <div style={{marginBottom: '8px'}}>
                <span className="api-method get">GET</span>
                <span className="api-path">/api/documents</span>
              </div>
              <p style={{color: 'rgba(255,255,255,0.7)', fontSize: '13px'}}>
                Get all documents for authenticated user
              </p>
            </div>

            <div className="api-endpoint">
              <div style={{marginBottom: '8px'}}>
                <span className="api-method get">GET</span>
                <span className="api-path">/api/documents/:id</span>
              </div>
              <p style={{color: 'rgba(255,255,255,0.7)', fontSize: '13px'}}>
                Get a specific document by ID
              </p>
            </div>

            <div className="api-endpoint">
              <div style={{marginBottom: '8px'}}>
                <span className="api-method put">PUT</span>
                <span className="api-path">/api/documents/:id</span>
              </div>
              <p style={{color: 'rgba(255,255,255,0.7)', fontSize: '13px'}}>
                Update an existing document
              </p>
            </div>

            <div className="api-endpoint">
              <div style={{marginBottom: '8px'}}>
                <span className="api-method delete">DELETE</span>
                <span className="api-path">/api/documents/:id</span>
              </div>
              <p style={{color: 'rgba(255,255,255,0.7)', fontSize: '13px'}}>
                Delete a document
              </p>
            </div>
          </div>

          <div className="preference-section">
            <h3>Blockchain Endpoints</h3>
            
            <div className="api-endpoint">
              <div style={{marginBottom: '8px'}}>
                <span className="api-method post">POST</span>
                <span className="api-path">/api/blockchain/encrypt</span>
              </div>
              <p style={{color: 'rgba(255,255,255,0.7)', fontSize: '13px'}}>
                Encrypt document data before storing
              </p>
            </div>

            <div className="api-endpoint">
              <div style={{marginBottom: '8px'}}>
                <span className="api-method post">POST</span>
                <span className="api-path">/api/blockchain/publish</span>
              </div>
              <p style={{color: 'rgba(255,255,255,0.7)', fontSize: '13px'}}>
                Publish document to Bitcoin SV blockchain
              </p>
            </div>

            <div className="api-endpoint">
              <div style={{marginBottom: '8px'}}>
                <span className="api-method get">GET</span>
                <span className="api-path">/api/blockchain/tx/:txid</span>
              </div>
              <p style={{color: 'rgba(255,255,255,0.7)', fontSize: '13px'}}>
                Get transaction details from blockchain
              </p>
            </div>
          </div>

          <div className="preference-section">
            <h3>Response Format</h3>
            <div className="api-endpoint">
              <pre style={{color: '#00ff88', fontSize: '12px'}}>
{`{
  "success": true,
  "data": { ... },
  "message": "Operation successful",
  "timestamp": "2025-01-01T00:00:00Z"
}`}
              </pre>
            </div>
          </div>
        </div>

        <div className="modal-footer">
          <button className="btn-secondary" onClick={() => window.open('https://github.com/b0ase/bitcoin-writer/wiki/API', '_blank')}>
            Full Documentation
          </button>
          <button className="btn-primary" onClick={onClose}>Close</button>
        </div>
      </div>
    </div>
  );
};

export default APIDocumentationModal;