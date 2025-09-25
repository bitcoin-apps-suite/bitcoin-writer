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
  storageMethod: 'direct' | 'ipfs' | 'hybrid' | 'cloud';
  cloudProvider?: 'googledrive' | 'aws-s3' | 'supabase' | 'cloudflare-r2' | 'azure-blob';
  cloudConfig?: {
    apiKey?: string;
    bucket?: string;
    region?: string;
    endpoint?: string;
    folder?: string;
  };
  encryption: boolean;
  encryptionMethod?: 'password' | 'multiparty' | 'timelock' | 'notesv';
  encryptionPassword?: string;
  unlockConditions: UnlockConditions;
  monetization: {
    enableAsset: boolean;
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
  const [activeTab, setActiveTab] = useState<'storage' | 'encryption' | 'access' | 'monetization'>('storage');
  const [isLoading, setIsLoading] = useState(false);
  
  // Storage options
  const [storageMethod, setStorageMethod] = useState<'direct' | 'ipfs' | 'hybrid' | 'cloud'>('direct');
  const [cloudProvider, setCloudProvider] = useState<'googledrive' | 'aws-s3' | 'supabase' | 'cloudflare-r2' | 'azure-blob'>('googledrive');
  const [cloudApiKey, setCloudApiKey] = useState('');
  const [cloudBucket, setCloudBucket] = useState('');
  const [cloudRegion, setCloudRegion] = useState('');
  const [encryption, setEncryption] = useState(true);
  const [encryptionMethod, setEncryptionMethod] = useState<'password' | 'multiparty' | 'timelock' | 'notesv'>('notesv');
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
  const [enableAsset, setEnableAsset] = useState(false);
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
        setActiveTab('encryption');
      } else if (preselectedMode === 'schedule') {
        setEncryption(true);
        setEncryptionMethod('timelock');
        setUnlockMethod('timed');
        setActiveTab('encryption');
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
    
    if (enableAsset) {
      totalCost += 0.01; // Asset creation cost
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
        // Close the modal so user can see the auth flow
        onClose();
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
      ...(storageMethod === 'cloud' ? {
        cloudProvider,
        cloudConfig: {
          apiKey: cloudApiKey,
          bucket: cloudBucket,
          region: cloudRegion,
          folder: 'bitcoin-writer-documents'
        }
      } : {}),
      encryption,
      ...(encryption ? { encryptionMethod, encryptionPassword } : {}),
      unlockConditions,
      monetization: {
        enableAsset,
        ...(enableAsset ? { 
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
          <h2>Publish & Monetize with Bitcoin</h2>
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
            Storage
          </button>
          <button 
            className={`tab ${activeTab === 'encryption' ? 'active' : ''}`}
            onClick={() => setActiveTab('encryption')}
            disabled={isLoading}
          >
            Encryption
          </button>
          <button 
            className={`tab ${activeTab === 'access' ? 'active' : ''}`}
            onClick={() => setActiveTab('access')}
            disabled={isLoading}
          >
            Access & Pricing
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
                
                <label className="radio-option">
                  <input
                    type="radio"
                    name="storage"
                    value="cloud"
                    checked={storageMethod === 'cloud'}
                    onChange={(e) => setStorageMethod(e.target.value as any)}
                    disabled={isLoading}
                  />
                  <div className="option-content">
                    <strong>Cloud Storage</strong>
                    <p>Store on your preferred cloud provider, hash on-chain for verification.</p>
                  </div>
                </label>
              </div>

              {storageMethod === 'cloud' && (
                <div className="cloud-options">
                  <h4>Select Cloud Provider</h4>
                  <select 
                    value={cloudProvider} 
                    onChange={(e) => setCloudProvider(e.target.value as any)}
                    disabled={isLoading}
                  >
                    <option value="googledrive">Google Drive</option>
                    <option value="aws-s3">AWS S3</option>
                    <option value="supabase">Supabase Storage</option>
                    <option value="cloudflare-r2">Cloudflare R2</option>
                    <option value="azure-blob">Azure Blob Storage</option>
                  </select>

                  {cloudProvider === 'googledrive' && (
                    <div className="provider-config">
                      <p>
                        📁 Documents will be stored in your Google Drive with blockchain verification
                      </p>
                      <button 
                        type="button"
                        onClick={() => alert('Google Drive OAuth integration coming soon!')}
                      >
                        Connect Google Drive
                      </button>
                    </div>
                  )}

                  {cloudProvider === 'aws-s3' && (
                    <div className="provider-config">
                      <label>
                        AWS Access Key:
                        <input
                          type="password"
                          value={cloudApiKey}
                          onChange={(e) => setCloudApiKey(e.target.value)}
                          placeholder="Enter your AWS access key"
                          disabled={isLoading}
                        />
                      </label>
                      <label>
                        S3 Bucket Name:
                        <input
                          type="text"
                          value={cloudBucket}
                          onChange={(e) => setCloudBucket(e.target.value)}
                          placeholder="my-documents-bucket"
                          disabled={isLoading}
                        />
                      </label>
                      <label>
                        Region:
                        <input
                          type="text"
                          value={cloudRegion}
                          onChange={(e) => setCloudRegion(e.target.value)}
                          placeholder="us-east-1"
                          disabled={isLoading}
                        />
                      </label>
                    </div>
                  )}

                  {cloudProvider === 'supabase' && (
                    <div className="provider-config">
                      <label>
                        Supabase Project URL:
                        <input
                          type="text"
                          value={cloudApiKey}
                          onChange={(e) => setCloudApiKey(e.target.value)}
                          placeholder="https://your-project.supabase.co"
                          disabled={isLoading}
                        />
                      </label>
                      <label>
                        Supabase Anon Key:
                        <input
                          type="password"
                          value={cloudBucket}
                          onChange={(e) => setCloudBucket(e.target.value)}
                          placeholder="Your public anon key"
                          disabled={isLoading}
                        />
                      </label>
                    </div>
                  )}

                  {cloudProvider === 'cloudflare-r2' && (
                    <div className="provider-config">
                      <p>
                        ☁️ Zero egress fees with Cloudflare R2 - perfect for serving paid content at scale
                      </p>
                      <label>
                        Account ID:
                        <input
                          type="text"
                          value={cloudApiKey}
                          onChange={(e) => setCloudApiKey(e.target.value)}
                          placeholder="Your Cloudflare account ID"
                          disabled={isLoading}
                        />
                      </label>
                      <label>
                        R2 Bucket:
                        <input
                          type="text"
                          value={cloudBucket}
                          onChange={(e) => setCloudBucket(e.target.value)}
                          placeholder="documents"
                          disabled={isLoading}
                        />
                      </label>
                      <div style={{ marginTop: '12px', padding: '10px', backgroundColor: 'rgba(34, 197, 94, 0.1)', border: '1px solid rgba(34, 197, 94, 0.3)', borderRadius: '6px' }}>
                        <strong>💰 CDN Ready:</strong> Your content will be served globally via Cloudflare's CDN. 
                        Readers pay micropayments directly to your HandCash wallet to access.
                      </div>
                    </div>
                  )}

                  {cloudProvider === 'azure-blob' && (
                    <div className="provider-config">
                      <label>
                        Storage Account:
                        <input
                          type="text"
                          value={cloudApiKey}
                          onChange={(e) => setCloudApiKey(e.target.value)}
                          placeholder="Your storage account name"
                          disabled={isLoading}
                        />
                      </label>
                      <label>
                        Container Name:
                        <input
                          type="text"
                          value={cloudBucket}
                          onChange={(e) => setCloudBucket(e.target.value)}
                          placeholder="documents"
                          disabled={isLoading}
                        />
                      </label>
                    </div>
                  )}

                  <div className="cloud-warning">
                    <strong>⚠️ Note:</strong> Your document hash will still be stored on-chain for immutable verification. 
                    The actual content will be served from your cloud provider.
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === 'encryption' && (
            <div className="tab-content encryption-tab">
              <h3>Document Encryption</h3>
              
              <div className="encryption-options">
                <label className="radio-option">
                  <input
                    type="radio"
                    name="encryption"
                    checked={!encryption}
                    onChange={() => setEncryption(false)}
                    disabled={isLoading}
                  />
                  <div className="option-content">
                    <strong>No Encryption</strong>
                    <p>Document stored in plain text (required for public monetization)</p>
                  </div>
                </label>

                <label className="radio-option">
                  <input
                    type="radio"
                    name="encryption"
                    checked={encryption && encryptionMethod === 'notesv'}
                    onChange={() => {
                      setEncryption(true);
                      setEncryptionMethod('notesv');
                    }}
                    disabled={isLoading}
                  />
                  <div className="option-content">
                    <strong>🔐 NoteSV Method (Recommended)</strong>
                    <p>Battle-tested AES-256 encryption from NOTE.SV - Simple & Secure</p>
                  </div>
                </label>

                <label className="radio-option">
                  <input
                    type="radio"
                    name="encryption"
                    checked={encryption && encryptionMethod === 'multiparty'}
                    onChange={() => {
                      setEncryption(true);
                      setEncryptionMethod('multiparty');
                    }}
                    disabled={isLoading}
                  />
                  <div className="option-content">
                    <strong>🆔 HandCash Identity Encryption</strong>
                    <p>Encrypted with your HandCash identity - only you can decrypt</p>
                  </div>
                </label>

                <label className="radio-option">
                  <input
                    type="radio"
                    name="encryption"
                    checked={encryption && encryptionMethod === 'password'}
                    onChange={() => {
                      setEncryption(true);
                      setEncryptionMethod('password');
                    }}
                    disabled={isLoading}
                  />
                  <div className="option-content">
                    <strong>🔑 Custom Password (Advanced)</strong>
                    <p>Our advanced encryption with custom parameters</p>
                  </div>
                </label>

                <label className="radio-option">
                  <input
                    type="radio"
                    name="encryption"
                    checked={encryption && encryptionMethod === 'timelock'}
                    onChange={() => {
                      setEncryption(true);
                      setEncryptionMethod('timelock');
                    }}
                    disabled={isLoading}
                  />
                  <div className="option-content">
                    <strong>⏰ Time-locked Encryption (Experimental)</strong>
                    <p>Automatically decrypts at a specified future time</p>
                  </div>
                </label>
              </div>

              {encryption && (encryptionMethod === 'password' || encryptionMethod === 'notesv') && (
                <div className="password-input" style={{ marginTop: '20px' }}>
                  <label>
                    Encryption Password:
                    <input
                      type="password"
                      value={encryptionPassword}
                      onChange={(e) => setEncryptionPassword(e.target.value)}
                      placeholder="Enter a strong password"
                      disabled={isLoading}
                      style={{ 
                        width: '100%', 
                        padding: '10px', 
                        marginTop: '8px',
                        background: '#1a1a1a',
                        color: '#fff',
                        border: '1px solid #444',
                        borderRadius: '6px'
                      }}
                    />
                  </label>
                  <p style={{ fontSize: '12px', color: '#888', marginTop: '8px' }}>
                    {encryptionMethod === 'notesv' ? (
                      <>✅ Using NoteSV AES-256 encryption - Proven secure by NOTE.SV password manager</>
                    ) : (
                      <>⚠️ Remember this password - it cannot be recovered if lost!</>
                    )}
                  </p>
                </div>
              )}

              {encryption && encryptionMethod === 'multiparty' && (
                <div className="encryption-notice" style={{ marginTop: '20px' }}>
                  <strong>🔐 HandCash Identity Protection</strong>
                  <p>Your document will be encrypted using your unique HandCash identity.</p>
                  <ul style={{ marginTop: '10px', paddingLeft: '20px', fontSize: '13px' }}>
                    <li>Only you can decrypt with your HandCash account</li>
                    <li>Lost account = lost access (keep recovery phrase safe!)</li>
                    <li>Perfect for private notes and sensitive documents</li>
                  </ul>
                </div>
              )}

              {encryption && encryptionMethod === 'timelock' && (
                <div className="timelock-options" style={{ marginTop: '20px' }}>
                  <label>
                    Unlock Date & Time:
                    <input
                      type="datetime-local"
                      value={unlockTime}
                      onChange={(e) => setUnlockTime(e.target.value)}
                      min={new Date(Date.now() + 60000).toISOString().slice(0, 16)}
                      disabled={isLoading}
                      style={{ 
                        width: '100%', 
                        padding: '10px', 
                        marginTop: '8px',
                        background: '#1a1a1a',
                        color: '#fff',
                        border: '1px solid #444',
                        borderRadius: '6px'
                      }}
                    />
                  </label>
                  <p style={{ fontSize: '12px', color: '#888', marginTop: '8px' }}>
                    📅 Document will automatically decrypt at this time
                  </p>
                </div>
              )}

              <div style={{ 
                marginTop: '20px', 
                padding: '15px', 
                backgroundColor: 'rgba(40, 167, 69, 0.1)', 
                border: '1px solid rgba(40, 167, 69, 0.3)', 
                borderRadius: '8px' 
              }}>
                <strong>💰 Pro Tip:</strong> Encrypted content + Paywall = Premium Access Model. 
                Set a price to automatically grant decryption keys to paying customers. Perfect for exclusive content, research papers, and premium documents.
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
                    <strong>💰 Paywall (Recommended)</strong>
                    <p>Readers pay micropayments to your HandCash wallet</p>
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
                  <div style={{ 
                    marginBottom: '20px', 
                    padding: '15px', 
                    backgroundColor: 'rgba(34, 197, 94, 0.1)', 
                    border: '1px solid rgba(34, 197, 94, 0.3)', 
                    borderRadius: '8px' 
                  }}>
                    <h4 style={{ margin: '0 0 10px 0', color: '#22c55e' }}>
                      🤝 HandCash Payment Flow
                    </h4>
                    <p style={{ margin: '0', fontSize: '13px', lineHeight: '1.6', color: '#ccc' }}>
                      When readers access your content:
                      <br />1. They see your preview/teaser
                      <br />2. Click "Pay to Read" button
                      <br />3. HandCash processes micropayment
                      <br />4. Payment goes directly to your wallet
                      <br />5. Content unlocks instantly
                    </p>
                  </div>

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
              <h3>🎨 Bitcoin OS Asset Creation</h3>
              
              <div style={{ 
                marginBottom: '20px', 
                padding: '15px', 
                backgroundColor: 'rgba(247, 147, 26, 0.1)', 
                border: '1px solid rgba(247, 147, 26, 0.3)', 
                borderRadius: '8px' 
              }}>
                <h4 style={{ margin: '0 0 10px 0', color: '#f7931a' }}>
                  🤝 HandCash Items Protocol
                </h4>
                <p style={{ margin: '0 0 10px 0', fontSize: '13px', lineHeight: '1.6', color: '#ccc' }}>
                  Save your document as a tradeable Bitcoin OS asset:
                </p>
                <ul style={{ margin: '0', paddingLeft: '20px', fontSize: '12px', color: '#aaa' }}>
                  <li>Appears in HandCash Market instantly</li>
                  <li>Built-in secondary market trading</li>
                  <li>Automatic royalty collection</li>
                  <li>No external marketplace needed</li>
                </ul>
              </div>

              <label className="checkbox-option">
                <input
                  type="checkbox"
                  checked={enableAsset}
                  onChange={(e) => setEnableAsset(e.target.checked)}
                  disabled={isLoading}
                />
                <span><strong>Create Bitcoin OS Asset</strong> - List on asset marketplace</span>
              </label>

              {enableAsset && (
                <div className="nft-options">
                  <div style={{ 
                    display: 'grid', 
                    gridTemplateColumns: '1fr 1fr', 
                    gap: '15px',
                    marginTop: '20px'
                  }}>
                    <div>
                      <label>
                        <span style={{ display: 'block', marginBottom: '5px', fontSize: '13px', fontWeight: 'bold' }}>
                          💰 Initial Sale Price
                        </span>
                        <input
                          type="number"
                          value={nftPrice}
                          onChange={(e) => setNftPrice(Number(e.target.value))}
                          min="0.10"
                          step="0.10"
                          disabled={isLoading}
                          style={{ width: '100%' }}
                          placeholder="1.00"
                        />
                        <small style={{ display: 'block', marginTop: '3px', color: '#888' }}>
                          USD via HandCash
                        </small>
                      </label>
                    </div>
                    
                    <div>
                      <label>
                        <span style={{ display: 'block', marginBottom: '5px', fontSize: '13px', fontWeight: 'bold' }}>
                          🎯 Edition Size
                        </span>
                        <select
                          value={maxSupply}
                          onChange={(e) => setMaxSupply(Number(e.target.value))}
                          disabled={isLoading}
                          style={{ width: '100%', padding: '8px' }}
                        >
                          <option value="1">1/1 (Unique)</option>
                          <option value="10">Limited (10 copies)</option>
                          <option value="100">Standard (100 copies)</option>
                          <option value="1000">Open Edition (1000)</option>
                          <option value="10000">Unlimited (10,000)</option>
                        </select>
                        <small style={{ display: 'block', marginTop: '3px', color: '#888' }}>
                          {maxSupply === 1 ? 'One-of-a-kind' : `${maxSupply} editions available`}
                        </small>
                      </label>
                    </div>
                  </div>
                  
                  <label style={{ display: 'block', marginTop: '20px' }}>
                    <span style={{ display: 'block', marginBottom: '5px', fontSize: '13px', fontWeight: 'bold' }}>
                      💎 Creator Royalty
                    </span>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <input
                        type="range"
                        value={royaltyPercentage}
                        onChange={(e) => setRoyaltyPercentage(Number(e.target.value))}
                        min="0"
                        max="25"
                        step="1"
                        disabled={isLoading}
                        style={{ flex: 1 }}
                      />
                      <span style={{ 
                        minWidth: '50px', 
                        textAlign: 'center', 
                        padding: '5px 10px',
                        background: 'rgba(247, 147, 26, 0.2)',
                        borderRadius: '4px',
                        fontWeight: 'bold'
                      }}>
                        {royaltyPercentage}%
                      </span>
                    </div>
                    <small style={{ display: 'block', marginTop: '5px', color: '#888' }}>
                      You earn {royaltyPercentage}% on every resale forever
                    </small>
                  </label>

                  <div style={{ 
                    marginTop: '20px',
                    padding: '12px',
                    background: 'rgba(34, 197, 94, 0.1)',
                    border: '1px solid rgba(34, 197, 94, 0.3)',
                    borderRadius: '6px'
                  }}>
                    <strong style={{ display: 'block', marginBottom: '5px', color: '#22c55e' }}>
                      📈 Estimated Earnings
                    </strong>
                    <div style={{ fontSize: '12px', color: '#aaa' }}>
                      <div>First sale: ${nftPrice.toFixed(2)}</div>
                      {maxSupply > 1 && (
                        <div>If all {maxSupply} sell: ${(nftPrice * maxSupply).toFixed(2)}</div>
                      )}
                      <div>Plus {royaltyPercentage}% royalties on all future sales</div>
                    </div>
                  </div>

                  <div style={{ 
                    marginTop: '15px',
                    padding: '10px',
                    background: 'rgba(59, 130, 246, 0.1)',
                    border: '1px solid rgba(59, 130, 246, 0.3)',
                    borderRadius: '6px',
                    fontSize: '12px',
                    color: '#93c5fd'
                  }}>
                    <strong>🛍️ After creation:</strong> Your document asset will appear in:
                    <ul style={{ margin: '5px 0 0 20px', padding: 0 }}>
                      <li>HandCash Market (in-app marketplace)</li>
                      <li>Your HandCash profile</li>
                      <li>Buyer's asset collection</li>
                    </ul>
                  </div>
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
              <span>Words:</span>
              <span>{wordCount.toLocaleString()}</span>
            </div>
            <div className="cost-item">
              <span>Size:</span>
              <span>{(estimatedSize / 1024).toFixed(2)} KB</span>
            </div>
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
            {storageMethod === 'cloud' && (
              <div className="cost-item">
                <span>Hash Storage:</span>
                <span>$0.001</span>
              </div>
            )}
            {enableAsset && (
              <div className="cost-item">
                <span>Asset Creation:</span>
                <span>$0.01</span>
              </div>
            )}
            <div className="cost-item total">
              <span>Total Cost:</span>
              <span>${calculateStorageCost().toFixed(3)}</span>
            </div>
          </div>
          <div className="pricing-info" style={{ marginTop: '10px', fontSize: '12px', color: '#888' }}>
            <p>
              💡 <strong>How it works:</strong> You pay directly to the Bitcoin network. 
              We charge 2x the base network fee to cover processing and infrastructure.
            </p>
          </div>
        </div>

        <div className="modal-footer">
          <div style={{ flex: 1, fontSize: '12px', color: '#888', marginRight: '20px' }}>
            {(unlockMethod === 'priced' || unlockMethod === 'timedAndPriced') && (
              <>
                <strong>After publishing:</strong> You'll get a shareable link like<br />
                <code style={{ color: '#f7931a' }}>bitcoinwriter.io/read/{documentTitle.toLowerCase().replace(/\s+/g, '-')}</code>
              </>
            )}
          </div>
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
              ? 'Publishing...' 
              : !isAuthenticated 
                ? '🤝 Sign in with HandCash to Publish' 
                : unlockMethod === 'priced' 
                  ? '💰 Publish & Monetize' 
                  : 'Save to Blockchain'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default SaveToBlockchainModal;