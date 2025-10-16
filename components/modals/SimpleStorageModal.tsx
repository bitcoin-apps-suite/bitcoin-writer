import React, { useState } from 'react';
import './SimpleStorageModal.css';

interface SimpleStorageModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (encrypted: boolean) => void;
  documentTitle: string;
  estimatedSize: number;
}

const SimpleStorageModal: React.FC<SimpleStorageModalProps> = ({
  isOpen,
  onClose,
  onSave,
  documentTitle,
  estimatedSize
}) => {
  const [encrypted, setEncrypted] = useState(true);

  if (!isOpen) return null;

  // Smart cost calculation - small files go on-chain, large files use hybrid
  const isSmallFile = estimatedSize < 50000; // 50KB threshold
  const estimatedCost = isSmallFile 
    ? (estimatedSize * 0.000001) // Direct on-chain for small files
    : 0.00001; // Hybrid storage for large files

  const storageMethod = isSmallFile ? 'On-Chain' : 'Hybrid';
  const storageDescription = isSmallFile 
    ? 'Stored directly on BSV blockchain - permanent and secure'
    : 'Metadata on-chain, content on IPFS - cost-effective for large files';

  const handleSave = () => {
    onSave(encrypted);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="storage-modal simple-storage" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Save to Blockchain</h2>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>

        <div className="modal-content">
          <div className="document-info">
            <h3>{documentTitle}</h3>
            <p>Size: {(estimatedSize / 1000).toFixed(1)}KB</p>
          </div>

          <div className="storage-info">
            <div className="storage-method">
              <h4>Storage Method: {storageMethod}</h4>
              <p>{storageDescription}</p>
            </div>

            <div className="encryption-section">
              <label className="encryption-toggle">
                <input
                  type="checkbox"
                  checked={encrypted}
                  onChange={(e) => setEncrypted(e.target.checked)}
                />
                <span className="checkmark"></span>
                <div className="encryption-details">
                  <strong>Encrypt with your signature</strong>
                  <p>No password needed - uses your BSV signature for encryption</p>
                </div>
              </label>
            </div>

            <div className="cost-display">
              <div className="cost-line">
                <span>Storage Cost:</span>
                <span className="cost-amount">${estimatedCost.toFixed(6)}</span>
              </div>
              {encrypted && (
                <div className="cost-line encryption-cost">
                  <span>Encryption:</span>
                  <span className="cost-amount">Free</span>
                </div>
              )}
              <div className="cost-line total-cost">
                <span><strong>Total:</strong></span>
                <span className="cost-amount"><strong>${estimatedCost.toFixed(6)}</strong></span>
              </div>
            </div>
          </div>
        </div>

        <div className="modal-footer">
          <button className="cancel-btn" onClick={onClose}>
            Cancel
          </button>
          <button className="save-btn primary" onClick={handleSave}>
            Save to Blockchain
          </button>
        </div>
      </div>

    </div>
  );
};

export default SimpleStorageModal;