import React, { useState } from 'react';

export type StorageMethod = 
  | 'op_pushdata4' 
  | 'op_return' 
  | 'multisig_p2sh'
  | 'nft_creation'
  | 'file_shares';

export interface StorageOptions {
  method: StorageMethod;
  encryption: boolean;
  price?: number;
  shareCount?: number;
  sharePrice?: number;
  royalty?: number;
}

interface EnhancedStorageModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (options: StorageOptions) => void;
  documentTitle: string;
  estimatedSize: number;
}

const EnhancedStorageModal: React.FC<EnhancedStorageModalProps> = ({
  isOpen,
  onClose,
  onSave,
  documentTitle,
  estimatedSize
}) => {
  const [selectedMethod, setSelectedMethod] = useState<StorageMethod>('op_pushdata4');
  const [encryption, setEncryption] = useState(true);
  const [price, setPrice] = useState<number>(0);
  const [shareCount, setShareCount] = useState<number>(100);
  const [sharePrice, setSharePrice] = useState<number>(0.01);
  const [royalty, setRoyalty] = useState<number>(5);

  if (!isOpen) return null;

  const storageOptions = [
    {
      id: 'op_pushdata4' as StorageMethod,
      name: 'OP_PUSHDATA4',
      description: 'Store up to 4GB directly on blockchain (most expensive, most secure)',
      cost: estimatedSize * 0.000001,
      pros: ['Maximum security', 'Permanent storage', 'No dependencies'],
      cons: ['Highest cost', 'Increases blockchain size']
    },
    {
      id: 'op_return' as StorageMethod,
      name: 'OP_RETURN',
      description: 'Store up to 80 bytes metadata with hash pointer (balanced approach)',
      cost: 0.00001,
      pros: ['Lower cost', 'Fast verification', 'Prunable by nodes'],
      cons: ['Limited data size', 'Requires external storage']
    },
    {
      id: 'multisig_p2sh' as StorageMethod,
      name: 'Multisig P2SH',
      description: 'Embed data in multisig script (creative storage solution)',
      cost: estimatedSize * 0.0000005,
      pros: ['Creative approach', 'Good capacity', 'Novel storage method'],
      cons: ['Complex recovery', 'Non-standard usage']
    },
    {
      id: 'nft_creation' as StorageMethod,
      name: 'Mint as NFT',
      description: 'Create unique NFT that can be sold on marketplaces',
      cost: 0.001,
      pros: ['Sellable asset', 'Proven ownership', 'Marketplace integration'],
      cons: ['NFT market dependency', 'Higher minting cost']
    },
    {
      id: 'file_shares' as StorageMethod,
      name: 'Issue File Shares',
      description: 'Create tokenized shares for monetization and revenue sharing',
      cost: 0.002,
      pros: ['Revenue sharing', 'Community ownership', 'Investment potential'],
      cons: ['Complex tokenomics', 'Regulatory considerations']
    }
  ];

  const selectedOption = storageOptions.find(opt => opt.id === selectedMethod);

  const handleSave = () => {
    const options: StorageOptions = {
      method: selectedMethod,
      encryption,
      ...(selectedMethod === 'nft_creation' || selectedMethod === 'file_shares' ? { price } : {}),
      ...(selectedMethod === 'file_shares' ? { shareCount, sharePrice, royalty } : {})
    };
    
    onSave(options);
  };

  return (
    <div className="modal-overlay">
      <div className="storage-modal">
        <div className="modal-header">
          <h2>Enhanced Blockchain Storage Options</h2>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>

        <div className="modal-content">
          <div className="document-info">
            <h3>Document: {documentTitle}</h3>
            <p>Estimated size: {(estimatedSize / 1000).toFixed(1)}KB</p>
          </div>

          <div className="storage-methods">
            <h4>Choose Storage Method:</h4>
            {storageOptions.map((option) => (
              <div
                key={option.id}
                className={`storage-option ${selectedMethod === option.id ? 'selected' : ''}`}
                onClick={() => setSelectedMethod(option.id)}
              >
                <div className="option-header">
                  <input
                    type="radio"
                    checked={selectedMethod === option.id}
                    onChange={() => setSelectedMethod(option.id)}
                  />
                  <div className="option-details">
                    <h5>{option.name}</h5>
                    <p className="cost">Cost: ${option.cost.toFixed(6)}</p>
                  </div>
                </div>
                <p className="description">{option.description}</p>
                
                <div className="pros-cons">
                  <div className="pros">
                    <strong>Pros:</strong>
                    <ul>
                      {option.pros.map((pro, i) => (
                        <li key={i}>{pro}</li>
                      ))}
                    </ul>
                  </div>
                  <div className="cons">
                    <strong>Cons:</strong>
                    <ul>
                      {option.cons.map((con, i) => (
                        <li key={i}>{con}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="encryption-option">
            <label>
              <input
                type="checkbox"
                checked={encryption}
                onChange={(e) => setEncryption(e.target.checked)}
              />
              Encrypt document before storage
            </label>
          </div>

          {(selectedMethod === 'nft_creation' || selectedMethod === 'file_shares') && (
            <div className="monetization-options">
              <h4>Monetization Settings:</h4>
              
              {selectedMethod === 'nft_creation' && (
                <div className="nft-options">
                  <label>
                    Starting Price (USD):
                    <input
                      type="number"
                      value={price}
                      onChange={(e) => setPrice(Number(e.target.value))}
                      min="0"
                      step="0.01"
                      placeholder="0.00"
                    />
                  </label>
                  <small>Leave 0 for free mint, set price for paid NFT</small>
                </div>
              )}

              {selectedMethod === 'file_shares' && (
                <div className="shares-options">
                  <div className="shares-grid">
                    <label>
                      Total Shares:
                      <input
                        type="number"
                        value={shareCount}
                        onChange={(e) => setShareCount(Number(e.target.value))}
                        min="1"
                        max="10000"
                      />
                    </label>
                    
                    <label>
                      Price per Share (USD):
                      <input
                        type="number"
                        value={sharePrice}
                        onChange={(e) => setSharePrice(Number(e.target.value))}
                        min="0.001"
                        step="0.001"
                      />
                    </label>
                    
                    <label>
                      Your Royalty (%):
                      <input
                        type="number"
                        value={royalty}
                        onChange={(e) => setRoyalty(Number(e.target.value))}
                        min="0"
                        max="50"
                      />
                    </label>
                  </div>
                  
                  <div className="shares-summary">
                    <p>Total Fundraising: ${(shareCount * sharePrice).toFixed(2)}</p>
                    <p>Your Royalty: {royalty}% on all future revenue</p>
                  </div>
                </div>
              )}
            </div>
          )}

          <div className="cost-summary">
            <h4>Storage Cost Summary:</h4>
            <div className="cost-breakdown">
              <div className="cost-line">
                <span>Base Storage Cost:</span>
                <span>${selectedOption?.cost.toFixed(6)}</span>
              </div>
              {encryption && (
                <div className="cost-line">
                  <span>Encryption Processing:</span>
                  <span>$0.000001</span>
                </div>
              )}
              <div className="cost-line total">
                <span>Total Cost:</span>
                <span>${((selectedOption?.cost || 0) + (encryption ? 0.000001 : 0)).toFixed(6)}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="modal-footer">
          <button className="cancel-btn" onClick={onClose}>
            Cancel
          </button>
          <button className="save-btn" onClick={handleSave}>
            {selectedMethod === 'nft_creation' ? 'Mint NFT' : 
             selectedMethod === 'file_shares' ? 'Issue Shares' : 
             'Save to Blockchain'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default EnhancedStorageModal;