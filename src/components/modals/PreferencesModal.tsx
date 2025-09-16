import React, { useState } from 'react';
import './ModalStyles.css';

interface PreferencesModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const PreferencesModal: React.FC<PreferencesModalProps> = ({ isOpen, onClose }) => {
  const [autoSave, setAutoSave] = useState(true);
  const [darkMode, setDarkMode] = useState(true);
  const [fontSize, setFontSize] = useState('14');
  const [fontFamily, setFontFamily] = useState('SF Mono');
  const [defaultStorage, setDefaultStorage] = useState('op_return');

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Preferences</h2>
          <button className="modal-close" onClick={onClose}>×</button>
        </div>
        
        <div className="modal-body">
          <div className="preference-section">
            <h3>Editor</h3>
            <div className="preference-item">
              <label>Font Size</label>
              <select value={fontSize} onChange={(e) => setFontSize(e.target.value)}>
                <option value="12">12px</option>
                <option value="14">14px</option>
                <option value="16">16px</option>
                <option value="18">18px</option>
              </select>
            </div>
            <div className="preference-item">
              <label>Font Family</label>
              <select value={fontFamily} onChange={(e) => setFontFamily(e.target.value)}>
                <option value="SF Mono">SF Mono</option>
                <option value="Monaco">Monaco</option>
                <option value="Menlo">Menlo</option>
                <option value="Courier New">Courier New</option>
              </select>
            </div>
            <div className="preference-item">
              <label>
                <input 
                  type="checkbox" 
                  checked={autoSave} 
                  onChange={(e) => setAutoSave(e.target.checked)}
                />
                Auto-save documents
              </label>
            </div>
          </div>

          <div className="preference-section">
            <h3>Appearance</h3>
            <div className="preference-item">
              <label>
                <input 
                  type="checkbox" 
                  checked={darkMode} 
                  onChange={(e) => setDarkMode(e.target.checked)}
                />
                Dark Mode
              </label>
            </div>
          </div>

          <div className="preference-section">
            <h3>Blockchain</h3>
            <div className="preference-item">
              <label>Default Storage Method</label>
              <select value={defaultStorage} onChange={(e) => setDefaultStorage(e.target.value)}>
                <option value="op_return">OP_RETURN (Metadata only)</option>
                <option value="op_pushdata4">OP_PUSHDATA4 (Full document)</option>
                <option value="multisig">Multisig P2SH</option>
              </select>
            </div>
          </div>
        </div>

        <div className="modal-footer">
          <button className="btn-secondary" onClick={onClose}>Cancel</button>
          <button className="btn-primary" onClick={onClose}>Save Preferences</button>
        </div>
      </div>
    </div>
  );
};

export default PreferencesModal;