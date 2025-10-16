import React, { useState } from 'react';
import './ModalStyles.css';

interface EncryptionSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const EncryptionSettingsModal: React.FC<EncryptionSettingsModalProps> = ({ isOpen, onClose }) => {
  const [encryptionMethod, setEncryptionMethod] = useState('aes256');
  const [autoEncrypt, setAutoEncrypt] = useState(true);
  const [keyDerivation, setKeyDerivation] = useState('pbkdf2');
  const [iterations, setIterations] = useState('100000');

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Encryption Settings</h2>
          <button className="modal-close" onClick={onClose}>×</button>
        </div>
        
        <div className="modal-body">
          <div className="preference-section">
            <h3>Encryption Method</h3>
            <div className="preference-item">
              <label>Algorithm</label>
              <select value={encryptionMethod} onChange={(e) => setEncryptionMethod(e.target.value)}>
                <option value="aes256">AES-256-CBC</option>
                <option value="aes128">AES-128-CBC</option>
                <option value="3des">3DES</option>
              </select>
            </div>
            <div className="preference-item">
              <label>
                <input 
                  type="checkbox" 
                  checked={autoEncrypt} 
                  onChange={(e) => setAutoEncrypt(e.target.checked)}
                />
                Auto-encrypt all documents
              </label>
            </div>
          </div>

          <div className="preference-section">
            <h3>Key Derivation</h3>
            <div className="preference-item">
              <label>Method</label>
              <select value={keyDerivation} onChange={(e) => setKeyDerivation(e.target.value)}>
                <option value="pbkdf2">PBKDF2</option>
                <option value="scrypt">Scrypt</option>
                <option value="argon2">Argon2</option>
              </select>
            </div>
            <div className="preference-item">
              <label>Iterations</label>
              <input 
                type="number" 
                value={iterations} 
                onChange={(e) => setIterations(e.target.value)}
                min="10000"
                max="1000000"
              />
            </div>
          </div>

          <div className="preference-section">
            <h3>Security</h3>
            <div className="preference-item">
              <label>
                <input type="checkbox" defaultChecked />
                Clear clipboard after 30 seconds
              </label>
            </div>
            <div className="preference-item">
              <label>
                <input type="checkbox" defaultChecked />
                Require password for decryption
              </label>
            </div>
            <div className="preference-item">
              <label>
                <input type="checkbox" />
                Enable two-factor authentication
              </label>
            </div>
          </div>
        </div>

        <div className="modal-footer">
          <button className="btn-secondary" onClick={onClose}>Cancel</button>
          <button className="btn-primary" onClick={onClose}>Save Settings</button>
        </div>
      </div>
    </div>
  );
};

export default EncryptionSettingsModal;