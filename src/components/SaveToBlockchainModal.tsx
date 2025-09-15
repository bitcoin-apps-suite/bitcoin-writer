import React, { useState } from 'react';
import './SaveToBlockchainModal.css';

export interface UnlockConditions {
  method: 'immediate' | 'timed' | 'priced' | 'timedAndPriced';
  unlockTime?: Date;
  unlockPrice?: number;
  previewLength?: number;
  tieredPricing?: {
    preview: number;
    full: number;
  };
}

export interface BlockchainSaveOptions {
  storageMethod: 'direct' | 'ipfs' | 'hybrid';
  encryption: boolean;
  encryptionMethod?: 'password' | 'multiparty' | 'timelock';
  encryptionPassword?: string;
  unlockConditions: UnlockConditions;
  monetization: {
    enableNFT: boolean;
    royaltyPercentage?: number;
    initialPrice?: number;
    maxSupply?: number;
  };
  metadata: {
    title: string;
    description?: string;
    tags?: string[];
    category?: string;
  };
}

interface SaveToBlockchainModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (options: BlockchainSaveOptions) => Promise<void>;
  documentTitle: string;
  wordCount: number;
  estimatedSize: number;
  isAuthenticated?: boolean;
  onAuthRequired?: () => void;
  preselectedMode?: 'encrypt' | 'schedule' | null;
}

const SaveToBlockchainModal: React.FC<SaveToBlockchainModalProps> = ({
  isOpen,
  onClose,
  onSave,
  documentTitle,
  wordCount,
  estimatedSize,
  isAuthenticated = false,
  onAuthRequired,
  preselectedMode
}) => {
  const [activeTab, setActiveTab] = useState<'storage' | 'access' | 'monetization'>('storage');
  const [isLoading, setIsLoading] = useState(false);
  
  // Storage options
  const [storageMethod, setStorageMethod] = useState<'direct' | 'ipfs' | 'hybrid'>('direct');
  const [encryption, setEncryption] = useState(true);
  const [encryptionMethod, setEncryptionMethod] = useState<'password' | 'multiparty' | 'timelock'>('multiparty');
  const [encryptionPassword, setEncryptionPassword] = useState('');
  
  // Access control
  const [unlockMethod, setUnlockMethod] = useState<'immediate' | 'timed' | 'priced' | 'timedAndPriced'>('immediate');
  const [unlockTime, setUnlockTime] = useState<string>('');
  const [unlockPrice, setUnlockPrice] = useState<number>(0);
  const [enablePreview, setEnablePreview] = useState(false);
  const [previewLength, setPreviewLength] = useState<number>(500);
  const [enableTieredPricing, setEnableTieredPricing] = useState(false);
  const [previewPrice, setPreviewPrice] = useState<number>(0.01);
  const [fullPrice, setFullPrice] = useState<number>(0.10);
  
  // Monetization
  const [enableNFT, setEnableNFT] = useState(false);
  const [royaltyPercentage, setRoyaltyPercentage] = useState<number>(10);
  const [nftPrice, setNftPrice] = useState<number>(1);
  const [maxSupply, setMaxSupply] = useState<number>(100);
  
  // Metadata
  const [description, setDescription] = useState('');
  const [tags, setTags] = useState('');
  const [category, setCategory] = useState('');

  // Handle preselected mode
  React.useEffect(() => {
    if (isOpen && preselectedMode) {
      if (preselectedMode === 'encrypt') {
        setEncryption(true);
        setEncryptionMethod('multiparty');
        setActiveTab('storage');
      } else if (preselectedMode === 'schedule') {
        setEncryption(true);
        setEncryptionMethod('timelock');
        setUnlockMethod('timed');
        setActiveTab('access');
        // Set default time to tomorrow at noon
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        tomorrow.setHours(12, 0, 0, 0);
        setUnlockTime(tomorrow.toISOString().slice(0, 16));
      }
    }
  }, [isOpen, preselectedMode]);

  if (!isOpen) return null;

  const calculateStorageCost = (): number => {
    const baseCost = 0.01; // Flat 1 penny base cost
    let totalCost = baseCost;
    
    if (storageMethod === 'hybrid') {
      totalCost += 0.005; // Extra for IPFS pinning
    }
    
    if (enableNFT) {
      totalCost += 0.01; // NFT minting cost
    }
    
    return totalCost;
  };

  const validateForm = (): boolean => {
    // Encryption is automatic with HandCash - no password validation needed
    
    if (unlockMethod === 'timed' || unlockMethod === 'timedAndPriced') {
      if (!unlockTime) {
        alert('Please select an unlock time');
        return false;
      }
      const unlockDate = new Date(unlockTime);
      if (unlockDate <= new Date()) {
        alert('Unlock time must be in the future');
        return false;
      }
    }
    
    if (unlockMethod === 'priced' || unlockMethod === 'timedAndPriced') {
      if (enableTieredPricing) {
        if (previewPrice <= 0 || fullPrice <= 0) {
          alert('Please enter valid prices');
          return false;
        }
      } else if (unlockPrice <= 0) {
        alert('Please enter a valid unlock price');
        return false;
      }
    }
    
    return true;
  };

  const handleSave = async () => {
    // If not authenticated, trigger auth flow
    if (!isAuthenticated) {
      if (onAuthRequired) {
        onAuthRequired();
      }
      return;
    }
    
    if (!validateForm()) return;
    
    setIsLoading(true);
    
    const unlockConditions: UnlockConditions = {
      method: unlockMethod,
      ...(unlockMethod === 'timed' || unlockMethod === 'timedAndPriced' 
        ? { unlockTime: new Date(unlockTime) } 
        : {}),
      ...(unlockMethod === 'priced' || unlockMethod === 'timedAndPriced'
        ? enableTieredPricing
          ? { tieredPricing: { preview: previewPrice, full: fullPrice } }
          : { unlockPrice }
        : {}),
      ...(enablePreview ? { previewLength } : {})
    };

    const options: BlockchainSaveOptions = {
      storageMethod,
      encryption,
      ...(encryption ? { encryptionMethod, encryptionPassword } : {}),
      unlockConditions,
      monetization: {
        enableNFT,
        ...(enableNFT ? { 
          royaltyPercentage, 
          initialPrice: nftPrice,
          maxSupply 
        } : {})
      },
      metadata: {
        title: documentTitle,
        description,
        tags: tags.split(',').map(t => t.trim()).filter(t => t),
        category
      }
    };

    try {
      await onSave(options);
      onClose();
    } catch (error) {
      console.error('Save failed:', error);
      alert('Failed to save to blockchain. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="save-blockchain-modal">
        <div className="modal-header">
          <h2>Save to Bitcoin Blockchain</h2>
          <button className="close-btn" onClick={onClose} disabled={isLoading}>×</button>
        </div>

        <div className="document-info">
          <div className="info-item">
            <span className="label">Document:</span>
            <span className="value">{documentTitle}</span>
          </div>
          <div className="info-item">
            <span className="label">Words:</span>
            <span className="value">{wordCount.toLocaleString()}</span>
          </div>
          <div className="info-item">
            <span className="label">Size:</span>
            <span className="value">{(estimatedSize / 1024).toFixed(2)} KB</span>
          </div>
        </div>

        <div className="modal-tabs">
          <button 
            className={`tab ${activeTab === 'storage' ? 'active' : ''}`}
            onClick={() => setActiveTab('storage')}
            disabled={isLoading}
          >
            Storage & Encryption
          </button>
          <button 
            className={`tab ${activeTab === 'access' ? 'active' : ''}`}
            onClick={() => setActiveTab('access')}
            disabled={isLoading}
          >
            Access Control
          </button>
          <button 
            className={`tab ${activeTab === 'monetization' ? 'active' : ''}`}
            onClick={() => setActiveTab('monetization')}
            disabled={isLoading}
          >
            Monetization
          </button>
        </div>

        <div className="modal-content">
          {activeTab === 'storage' && (
            <div className="tab-content storage-tab">
              <h3>Storage Method</h3>
              <div className="storage-options">
                <label className="radio-option">
                  <input
                    type="radio"
                    name="storage"
                    value="direct"
                    checked={storageMethod === 'direct'}
                    onChange={(e) => setStorageMethod(e.target.value as any)}
                    disabled={isLoading}
                  />
                  <div className="option-content">
                    <strong>Direct On-Chain</strong>
                    <p>Store directly on BSV blockchain. Most secure and permanent.</p>
                  </div>
                </label>
                
                <label className="radio-option">
                  <input
                    type="radio"
                    name="storage"
                    value="ipfs"
                    checked={storageMethod === 'ipfs'}
                    onChange={(e) => setStorageMethod(e.target.value as any)}
                    disabled={isLoading}
                  />
                  <div className="option-content">
                    <strong>IPFS with Hash</strong>
                    <p>Store on IPFS, save hash on-chain. Cost-effective for large files.</p>
                  </div>
                </label>
                
                <label className="radio-option">
                  <input
                    type="radio"
                    name="storage"
                    value="hybrid"
                    checked={storageMethod === 'hybrid'}
                    onChange={(e) => setStorageMethod(e.target.value as any)}
                    disabled={isLoading}
                  />
                  <div className="option-content">
                    <strong>Hybrid</strong>
                    <p>Metadata on-chain, content on IPFS. Best of both worlds.</p>
                  </div>
                </label>
              </div>

              <h3>Encryption</h3>
              <div className="encryption-notice">
                <strong>✅ Automatic Encryption Enabled</strong>
                <p>Your document will be automatically encrypted using your HandCash identity. Only you can decrypt it.</p>
              </div>
            </div>
          )}

          {activeTab === 'access' && (
            <div className="tab-content access-tab">
              <h3>Unlock Method</h3>
              <div className="unlock-options">
                <label className="radio-option">
                  <input
                    type="radio"
                    name="unlock"
                    value="immediate"
                    checked={unlockMethod === 'immediate'}
                    onChange={(e) => setUnlockMethod(e.target.value as any)}
                    disabled={isLoading}
                  />
                  <div className="option-content">
                    <strong>Immediate Public</strong>
                    <p>Anyone can read immediately after publishing</p>
                  </div>
                </label>
                
                <label className="radio-option">
                  <input
                    type="radio"
                    name="unlock"
                    value="timed"
                    checked={unlockMethod === 'timed'}
                    onChange={(e) => setUnlockMethod(e.target.value as any)}
                    disabled={isLoading}
                  />
                  <div className="option-content">
                    <strong>Timed Release</strong>
                    <p>Automatically unlocks at specified time</p>
                  </div>
                </label>
                
                <label className="radio-option">
                  <input
                    type="radio"
                    name="unlock"
                    value="priced"
                    checked={unlockMethod === 'priced'}
                    onChange={(e) => setUnlockMethod(e.target.value as any)}
                    disabled={isLoading}
                  />
                  <div className="option-content">
                    <strong>Price to Unlock</strong>
                    <p>Readers pay to access content</p>
                  </div>
                </label>
                
                <label className="radio-option">
                  <input
                    type="radio"
                    name="unlock"
                    value="timedAndPriced"
                    checked={unlockMethod === 'timedAndPriced'}
                    onChange={(e) => setUnlockMethod(e.target.value as any)}
                    disabled={isLoading}
                  />
                  <div className="option-content">
                    <strong>Timed + Priced</strong>
                    <p>Pay to unlock early, free after timer</p>
                  </div>
                </label>
              </div>

              {(unlockMethod === 'timed' || unlockMethod === 'timedAndPriced') && (
                <div className="timed-options">
                  <div className="schedule-header">
                    <span className="schedule-icon">📅</span>
                    <h4>Schedule Automatic Publication</h4>
                  </div>
                  <p className="schedule-description">
                    Your document will be encrypted until this date, then automatically become publicly readable.
                  </p>
                  <label>
                    <span className="label-text">Publication Date & Time:</span>
                    <input
                      type="datetime-local"
                      value={unlockTime}
                      onChange={(e) => setUnlockTime(e.target.value)}
                      min={new Date(Date.now() + 60000).toISOString().slice(0, 16)}
                      disabled={isLoading}
                      className="datetime-input"
                    />
                  </label>
                  {unlockTime && (
                    <div className="schedule-preview">
                      <span className="preview-label">Will publish on:</span>
                      <span className="preview-date">
                        {new Date(unlockTime).toLocaleString('en-US', {
                          weekday: 'long',
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </span>
                    </div>
                  )}
                </div>
              )}

              {(unlockMethod === 'priced' || unlockMethod === 'timedAndPriced') && (
                <div className="pricing-options">
                  <label className="checkbox-option">
                    <input
                      type="checkbox"
                      checked={enableTieredPricing}
                      onChange={(e) => setEnableTieredPricing(e.target.checked)}
                      disabled={isLoading}
                    />
                    <span>Enable tiered pricing (preview + full)</span>
                  </label>

                  {enableTieredPricing ? (
                    <>
                      <div className="price-inputs">
                        <label>
                          Preview Price (USD):
                          <input
                            type="number"
                            value={previewPrice}
                            onChange={(e) => setPreviewPrice(Number(e.target.value))}
                            min="0.01"
                            step="0.01"
                            disabled={isLoading}
                          />
                        </label>
                        <label>
                          Full Access Price (USD):
                          <input
                            type="number"
                            value={fullPrice}
                            onChange={(e) => setFullPrice(Number(e.target.value))}
                            min="0.01"
                            step="0.01"
                            disabled={isLoading}
                          />
                        </label>
                      </div>
                      <label>
                        Preview Length (characters):
                        <input
                          type="number"
                          value={previewLength}
                          onChange={(e) => setPreviewLength(Number(e.target.value))}
                          min="100"
                          max="5000"
                          step="100"
                          disabled={isLoading}
                        />
                      </label>
                    </>
                  ) : (
                    <label>
                      Unlock Price (USD):
                      <input
                        type="number"
                        value={unlockPrice}
                        onChange={(e) => setUnlockPrice(Number(e.target.value))}
                        min="0.01"
                        step="0.01"
                        disabled={isLoading}
                      />
                    </label>
                  )}
                </div>
              )}

              {unlockMethod !== 'priced' && (
                <div className="preview-options">
                  <label className="checkbox-option">
                    <input
                      type="checkbox"
                      checked={enablePreview}
                      onChange={(e) => setEnablePreview(e.target.checked)}
                      disabled={isLoading}
                    />
                    <span>Enable free preview</span>
                  </label>
                  
                  {enablePreview && (
                    <label>
                      Preview Length (characters):
                      <input
                        type="number"
                        value={previewLength}
                        onChange={(e) => setPreviewLength(Number(e.target.value))}
                        min="100"
                        max="5000"
                        step="100"
                        disabled={isLoading}
                      />
                    </label>
                  )}
                </div>
              )}
            </div>
          )}

          {activeTab === 'monetization' && (
            <div className="tab-content monetization-tab">
              <h3>NFT Options</h3>
              <label className="checkbox-option">
                <input
                  type="checkbox"
                  checked={enableNFT}
                  onChange={(e) => setEnableNFT(e.target.checked)}
                  disabled={isLoading}
                />
                <span>Mint as NFT</span>
              </label>

              {enableNFT && (
                <div className="nft-options">
                  <label>
                    Initial NFT Price (USD):
                    <input
                      type="number"
                      value={nftPrice}
                      onChange={(e) => setNftPrice(Number(e.target.value))}
                      min="0"
                      step="0.1"
                      disabled={isLoading}
                    />
                  </label>
                  
                  <label>
                    Max Supply:
                    <input
                      type="number"
                      value={maxSupply}
                      onChange={(e) => setMaxSupply(Number(e.target.value))}
                      min="1"
                      max="10000"
                      disabled={isLoading}
                    />
                  </label>
                  
                  <label>
                    Royalty Percentage:
                    <input
                      type="number"
                      value={royaltyPercentage}
                      onChange={(e) => setRoyaltyPercentage(Number(e.target.value))}
                      min="0"
                      max="50"
                      disabled={isLoading}
                    />
                    <small>You earn {royaltyPercentage}% on all secondary sales</small>
                  </label>
                </div>
              )}

              <h3>Metadata</h3>
              <div className="metadata-options">
                <label>
                  Description:
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Brief description of your document"
                    rows={3}
                    disabled={isLoading}
                  />
                </label>
                
                <label>
                  Tags (comma-separated):
                  <input
                    type="text"
                    value={tags}
                    onChange={(e) => setTags(e.target.value)}
                    placeholder="e.g., fiction, technology, tutorial"
                    disabled={isLoading}
                  />
                </label>
                
                <label>
                  Category:
                  <select 
                    value={category} 
                    onChange={(e) => setCategory(e.target.value)}
                    disabled={isLoading}
                  >
                    <option value="">Select a category</option>
                    <option value="article">Article</option>
                    <option value="story">Story</option>
                    <option value="poem">Poem</option>
                    <option value="tutorial">Tutorial</option>
                    <option value="research">Research</option>
                    <option value="other">Other</option>
                  </select>
                </label>
              </div>
            </div>
          )}
        </div>

        <div className="cost-summary">
          <div className="cost-breakdown">
            <div className="cost-item">
              <span>Base Storage:</span>
              <span>$0.01</span>
            </div>
            {storageMethod === 'hybrid' && (
              <div className="cost-item">
                <span>IPFS Pinning:</span>
                <span>$0.005</span>
              </div>
            )}
            {enableNFT && (
              <div className="cost-item">
                <span>NFT Minting:</span>
                <span>$0.01</span>
              </div>
            )}
            <div className="cost-item total">
              <span>Total Cost:</span>
              <span>${calculateStorageCost().toFixed(3)}</span>
            </div>
          </div>
        </div>

        <div className="modal-footer">
          <button 
            className="cancel-btn" 
            onClick={onClose}
            disabled={isLoading}
          >
            Cancel
          </button>
          <button 
            className={`save-btn ${!isAuthenticated ? 'handcash-btn' : ''}`}
            onClick={handleSave}
            disabled={isLoading}
          >
            {isLoading 
              ? 'Saving...' 
              : !isAuthenticated 
                ? '🤝 Sign in with HandCash to Save' 
                : 'Save to Blockchain'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default SaveToBlockchainModal;