import React, { useState, useEffect } from 'react';
import './ModalStyles.css';

interface StorageCalculatorModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const StorageCalculatorModal: React.FC<StorageCalculatorModalProps> = ({ isOpen, onClose }) => {
  const [wordCount, setWordCount] = useState('1000');
  const [storageMethod, setStorageMethod] = useState('op_return');
  const [documentCount, setDocumentCount] = useState('1');
  
  const [cost, setCost] = useState({
    perDocument: 0.01,
    total: 0.01,
    bytes: 0,
    satoshis: 0
  });

  useEffect(() => {
    calculateCost();
  }, [wordCount, storageMethod, documentCount]);

  const calculateCost = () => {
    const words = parseInt(wordCount) || 0;
    const docs = parseInt(documentCount) || 1;
    const avgCharsPerWord = 5;
    const bytes = words * avgCharsPerWord;
    
    let perDocCost = 0.01; // Base cost
    
    if (storageMethod === 'op_pushdata4') {
      perDocCost = 0.01 + (bytes / 100000) * 0.01; // Extra cost for larger storage
    } else if (storageMethod === 'nft') {
      perDocCost = 0.05; // Higher cost for NFT minting
    } else if (storageMethod === 'multisig') {
      perDocCost = 0.02; // Multisig cost
    }
    
    const totalCost = perDocCost * docs;
    const satoshis = Math.round(totalCost * 100000000 / 30000); // Assuming $30k/BTC
    
    setCost({
      perDocument: perDocCost,
      total: totalCost,
      bytes: bytes,
      satoshis: satoshis
    });
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Storage Cost Calculator</h2>
          <button className="modal-close" onClick={onClose}>×</button>
        </div>
        
        <div className="modal-body">
          <div className="preference-section">
            <h3>Document Details</h3>
            <div className="preference-item">
              <label>Word Count</label>
              <input 
                type="number" 
                value={wordCount} 
                onChange={(e) => setWordCount(e.target.value)}
                min="1"
              />
            </div>
            <div className="preference-item">
              <label>Number of Documents</label>
              <input 
                type="number" 
                value={documentCount} 
                onChange={(e) => setDocumentCount(e.target.value)}
                min="1"
              />
            </div>
            <div className="preference-item">
              <label>Storage Method</label>
              <select value={storageMethod} onChange={(e) => setStorageMethod(e.target.value)}>
                <option value="op_return">OP_RETURN (Metadata)</option>
                <option value="op_pushdata4">OP_PUSHDATA4 (Full)</option>
                <option value="multisig">Multisig P2SH</option>
                <option value="nft">NFT Creation</option>
              </select>
            </div>
          </div>

          <div className="calculator-result">
            <h4>Cost Breakdown</h4>
            <div className="calculator-item">
              <span>Document Size:</span>
              <span>{cost.bytes.toLocaleString()} bytes</span>
            </div>
            <div className="calculator-item">
              <span>Cost per Document:</span>
              <span>${cost.perDocument.toFixed(2)}</span>
            </div>
            <div className="calculator-item">
              <span>Total Documents:</span>
              <span>{documentCount}</span>
            </div>
            <div className="calculator-item" style={{borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '8px', marginTop: '8px', fontWeight: 'bold'}}>
              <span>Total Cost:</span>
              <span>${cost.total.toFixed(2)}</span>
            </div>
            <div className="calculator-item">
              <span>In Satoshis:</span>
              <span>{cost.satoshis.toLocaleString()} sats</span>
            </div>
          </div>

          <div className="preference-section" style={{marginTop: '20px'}}>
            <p style={{color: 'rgba(255,255,255,0.7)', fontSize: '13px'}}>
              Note: Actual costs may vary based on network fees and BSV price. 
              NFT creation includes minting and smart contract deployment fees.
            </p>
          </div>
        </div>

        <div className="modal-footer">
          <button className="btn-primary" onClick={onClose}>Close</button>
        </div>
      </div>
    </div>
  );
};

export default StorageCalculatorModal;