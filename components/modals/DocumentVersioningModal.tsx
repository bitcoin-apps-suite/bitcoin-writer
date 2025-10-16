import React, { useState, useEffect, useCallback } from 'react';
import { useIntegratedWorkTree } from '../../utils/useIntegratedWorkTree';
import { BlockchainDocumentService } from '../../services/BlockchainDocumentService';
import WorkTreeCanvas from '../WorkTreeCanvas';
import './DocumentVersioningModal.css';

interface DocumentVersioningModalProps {
  isOpen: boolean;
  onClose: () => void;
  documentId: string;
  currentContent: string;
  documentTitle: string;
  authorAddress: string;
  authorHandle?: string;
  onContentRestore?: (content: string) => void;
  blockchainService?: BlockchainDocumentService | null;
}

const DocumentVersioningModal: React.FC<DocumentVersioningModalProps> = ({
  isOpen,
  onClose,
  documentId,
  currentContent,
  documentTitle,
  authorAddress,
  authorHandle,
  onContentRestore,
  blockchainService
}) => {
  const {
    versionChain,
    isOperating,
    progress,
    error,
    createVersion,
    checkoutVersion,
    getChainStats,
    verifyChain,
    getLatestVersion,
    currentHead,
    setCurrentHead,
    getCostEstimates,
    isReady,
    isInitialized
  } = useIntegratedWorkTree(documentId, blockchainService || null);

  const chainStats = getChainStats();
  const latestVersion = getLatestVersion();

  const [activeTab, setActiveTab] = useState<'create' | 'history' | 'stats'>('create');
  const [selectedVersion, setSelectedVersion] = useState(latestVersion);

  // Handle version checkout (git checkout equivalent)
  const handleVersionCheckout = useCallback(async (version: any) => {
    if (version.localId === 'current') {
      // Can't checkout current - it's already current
      return;
    }

    try {
      // Use integrated checkout which handles blockchain retrieval
      const result = await checkoutVersion(version.metadata.version);
      
      // Restore content to this version for editing
      if (onContentRestore) {
        onContentRestore(result.content);
      }
      
      // Show feedback but don't close modal so user can see the tree update
      alert(`Checked out version ${version.metadata.version} - content restored`);
    } catch (error) {
      console.error('Failed to checkout version:', error);
      alert(`Failed to checkout version ${version.metadata.version}`);
    }
  }, [onContentRestore, checkoutVersion]);
  const [isCreatingVersion, setIsCreatingVersion] = useState(false);
  const [costEstimates, setCostEstimates] = useState<any>(null);
  const [versionMetadata, setVersionMetadata] = useState({
    description: '',
    genre: '',
    tags: '',
    isPublished: false,
    isPaid: false,
    storeOnBlockchain: false,
    protocol: 'auto' as 'auto' | 'B' | 'D' | 'Bcat',
    encrypt: false,
    createShares: false,
    shareCount: 1000,
    pricePerShare: 100
  });

  // Reset form when modal opens and get cost estimates
  useEffect(() => {
    if (isOpen) {
      setVersionMetadata({
        description: '',
        genre: '',
        tags: '',
        isPublished: false,
        isPaid: false,
        storeOnBlockchain: false,
        protocol: 'auto' as 'auto' | 'B' | 'D' | 'Bcat',
        encrypt: false,
        createShares: false,
        shareCount: 1000,
        pricePerShare: 100
      });
      
      // Get cost estimates for current content
      if (currentContent && getCostEstimates) {
        getCostEstimates(currentContent).then(estimates => {
          setCostEstimates(estimates);
        }).catch(console.error);
      }
    }
  }, [isOpen, currentContent, getCostEstimates]);

  const handleCreateVersion = async () => {
    if (!currentContent.trim()) {
      alert('Cannot create version with empty content');
      return;
    }

    setIsCreatingVersion(true);
    try {
      const metadata = {
        title: documentTitle,
        description: versionMetadata.description,
        author: authorAddress,
        authorHandle,
        genre: versionMetadata.genre || undefined,
        tags: versionMetadata.tags ? versionMetadata.tags.split(',').map(t => t.trim()) : undefined,
        isPublished: versionMetadata.isPublished,
        isPaid: versionMetadata.isPaid
      };

      const options = {
        storeOnBlockchain: versionMetadata.storeOnBlockchain,
        protocol: versionMetadata.protocol,
        encrypt: versionMetadata.encrypt,
        createShares: versionMetadata.createShares,
        shareOptions: versionMetadata.createShares ? {
          totalShares: versionMetadata.shareCount,
          pricePerShare: versionMetadata.pricePerShare
        } : undefined
      };

      const inscription = await createVersion(currentContent, metadata, options);
      
      const successMessage = versionMetadata.storeOnBlockchain 
        ? `Version ${inscription.metadata.version} created and stored on blockchain!`
        : `Version ${inscription.metadata.version} created locally!`;
      
      alert(successMessage);
      
    } catch (error) {
      console.error('Failed to create version:', error);
      alert('Failed to create version. Please try again.');
    } finally {
      setIsCreatingVersion(false);
    }
  };

  // Cost calculation helper
  const getSelectedProtocolCost = () => {
    if (!costEstimates) return 0;
    
    switch (versionMetadata.protocol) {
      case 'B': return costEstimates.b.cost;
      case 'D': return costEstimates.d.cost;
      case 'Bcat': return costEstimates.bcat.cost;
      default: return costEstimates[costEstimates.recommended.toLowerCase()].cost;
    }
  };

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleString();
  };

  const formatTimespan = (milliseconds: number) => {
    const days = Math.floor(milliseconds / (1000 * 60 * 60 * 24));
    const hours = Math.floor((milliseconds % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    return `${days}d ${hours}h`;
  };

  if (!isOpen) return null;

  // Detect dev sidebar state from app container class
  const appContainer = document.querySelector('.app-container');
  const hasDevSidebar = appContainer?.classList.contains('with-dev-sidebar');
  const hasDevSidebarCollapsed = appContainer?.classList.contains('with-dev-sidebar-collapsed');
  
  let overlayClass = 'modal-overlay';
  if (hasDevSidebarCollapsed) {
    overlayClass += ' with-dev-sidebar-collapsed';
  } else if (!hasDevSidebar) {
    overlayClass += ' no-dev-sidebar';
  }

  return (
    <div className={overlayClass} onClick={onClose}>
      <div className="versioning-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>🌳 Work Tree</h2>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>

        {/* Main Content with Canvas and Tabs */}
        <div className="modal-main-content">
          {/* Work Tree Canvas */}
          <div className="worktree-canvas-container">
            <WorkTreeCanvas
              versions={versionChain ? versionChain.versions : []}
              onVersionSelect={setSelectedVersion}
              onVersionCheckout={handleVersionCheckout}
              selectedVersion={selectedVersion}
              currentContent={currentContent}
              documentTitle={documentTitle}
              currentHead={currentHead}
            />
          </div>

          {/* Tab Content Container */}
          <div className="tab-content-container">
            {/* Tab Navigation */}
            <div className="tab-navigation">
              <button 
                className={`tab ${activeTab === 'create' ? 'active' : ''}`}
                onClick={() => setActiveTab('create')}
              >
                Create Version
              </button>
              <button 
                className={`tab ${activeTab === 'history' ? 'active' : ''}`}
                onClick={() => setActiveTab('history')}
              >
                Version History
              </button>
              <button 
                className={`tab ${activeTab === 'stats' ? 'active' : ''}`}
                onClick={() => setActiveTab('stats')}
              >
                Chain Stats
              </button>
            </div>

        {/* Create Version Tab */}
        {activeTab === 'create' && (
          <div className="tab-content">
            <div className="version-form">
              <div className="form-group">
                <label>Description</label>
                <textarea
                  value={versionMetadata.description}
                  onChange={(e) => setVersionMetadata(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Describe what changed in this version..."
                  rows={3}
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Genre</label>
                  <input
                    type="text"
                    value={versionMetadata.genre}
                    onChange={(e) => setVersionMetadata(prev => ({ ...prev, genre: e.target.value }))}
                    placeholder="Fiction, Non-fiction, Technical..."
                  />
                </div>
                
                <div className="form-group">
                  <label>Tags (comma-separated)</label>
                  <input
                    type="text"
                    value={versionMetadata.tags}
                    onChange={(e) => setVersionMetadata(prev => ({ ...prev, tags: e.target.value }))}
                    placeholder="bitcoin, writing, blockchain..."
                  />
                </div>
              </div>

              <div className="form-checkboxes">
                <label>
                  <input
                    type="checkbox"
                    checked={versionMetadata.isPublished}
                    onChange={(e) => setVersionMetadata(prev => ({ ...prev, isPublished: e.target.checked }))}
                  />
                  Mark as Published
                </label>

                <label>
                  <input
                    type="checkbox"
                    checked={versionMetadata.isPaid}
                    onChange={(e) => setVersionMetadata(prev => ({ ...prev, isPaid: e.target.checked }))}
                  />
                  Paid Content
                </label>

                <label>
                  <input
                    type="checkbox"
                    checked={versionMetadata.storeOnBlockchain}
                    onChange={(e) => setVersionMetadata(prev => ({ ...prev, storeOnBlockchain: e.target.checked }))}
                    disabled={!isReady}
                  />
                  Store on Blockchain {!isReady && '(Login Required)'}
                </label>

                {versionMetadata.storeOnBlockchain && (
                  <label>
                    <input
                      type="checkbox"
                      checked={versionMetadata.encrypt}
                      onChange={(e) => setVersionMetadata(prev => ({ ...prev, encrypt: e.target.checked }))}
                    />
                    Encrypt Content
                  </label>
                )}

                <label>
                  <input
                    type="checkbox"
                    checked={versionMetadata.createShares}
                    onChange={(e) => setVersionMetadata(prev => ({ ...prev, createShares: e.target.checked }))}
                  />
                  Create Share Tokens
                </label>
              </div>

              {versionMetadata.storeOnBlockchain && (
                <div className="blockchain-options">
                  <div className="form-group">
                    <label>Storage Protocol</label>
                    <select
                      value={versionMetadata.protocol}
                      onChange={(e) => setVersionMetadata(prev => ({ 
                        ...prev, 
                        protocol: e.target.value as 'auto' | 'B' | 'D' | 'Bcat' 
                      }))}
                    >
                      <option value="auto">Auto-select (Recommended)</option>
                      <option value="B">B:// Protocol</option>
                      <option value="D">D:// Protocol</option>
                      <option value="Bcat">Bcat Protocol (Large Files)</option>
                    </select>
                  </div>
                  
                  {costEstimates && (
                    <div className="cost-estimate">
                      <small>
                        Estimated cost: ${getSelectedProtocolCost().toFixed(4)} USD
                        {costEstimates.recommended && versionMetadata.protocol === 'auto' && (
                          <span> (using {costEstimates.recommended}://)</span>
                        )}
                      </small>
                    </div>
                  )}
                </div>
              )}

              {versionMetadata.createShares && (
                <div className="form-row">
                  <div className="form-group">
                    <label>Total Shares</label>
                    <input
                      type="number"
                      value={versionMetadata.shareCount}
                      onChange={(e) => setVersionMetadata(prev => ({ ...prev, shareCount: parseInt(e.target.value) }))}
                      min="1"
                      max="1000000"
                    />
                  </div>
                  
                  <div className="form-group">
                    <label>Price per Share (sats)</label>
                    <input
                      type="number"
                      value={versionMetadata.pricePerShare}
                      onChange={(e) => setVersionMetadata(prev => ({ ...prev, pricePerShare: parseInt(e.target.value) }))}
                      min="1"
                    />
                  </div>
                </div>
              )}

              <div className="action-buttons">
                <button 
                  onClick={handleCreateVersion}
                  disabled={isCreatingVersion || isOperating || !isInitialized}
                  className="btn-create"
                >
                  {isCreatingVersion ? 'Creating...' : 
                   versionMetadata.storeOnBlockchain ? 'Create Version & Store on Blockchain' : 'Create Version (Local)'}
                </button>
                
                {!isInitialized && (
                  <div className="init-status">
                    <small>⏳ Initializing Work Tree...</small>
                  </div>
                )}
                
                {error && (
                  <div className="error-message">
                    <small>❌ {error.message}</small>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Version History Tab */}
        {activeTab === 'history' && (
          <div className="tab-content">
            <div className="version-history">
              {versionChain && versionChain.versions.length > 0 ? (
                <div className="version-list">
                  {versionChain.versions.map((version) => (
                    <div key={version.localId} className={`version-item ${version.status}`}>
                      <div className="version-header">
                        <span className="version-number">v{version.metadata.version}</span>
                        <span className={`status-badge ${version.status}`}>{version.status}</span>
                        <span className="version-date">{formatDate(version.metadata.createdAt)}</span>
                      </div>
                      
                      <div className="version-details">
                        <p className="version-description">
                          {version.metadata.description || 'No description'}
                        </p>
                        
                        <div className="version-stats">
                          <span>{version.metadata.wordCount} words</span>
                          <span>{version.metadata.characterCount} characters</span>
                          {version.metadata.genre && <span>{version.metadata.genre}</span>}
                        </div>

                        {version.metadata.tags && version.metadata.tags.length > 0 && (
                          <div className="version-tags">
                            {version.metadata.tags.map(tag => (
                              <span key={tag} className="tag">{tag}</span>
                            ))}
                          </div>
                        )}

                        {version.inscriptionId && (
                          <div className="inscription-info">
                            <p><strong>Inscription ID:</strong> {version.inscriptionId}</p>
                            {version.txId && <p><strong>TX ID:</strong> {version.txId}</p>}
                            {version.ordinalNumber && <p><strong>Ordinal:</strong> #{version.ordinalNumber}</p>}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="no-versions">
                  <p>No versions created yet. Create your first version to start the inscription chain!</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Chain Stats Tab */}
        {activeTab === 'stats' && (
          <div className="tab-content">
            <div className="chain-stats">
              {chainStats ? (
                <div className="stats-grid">
                  <div className="stat-card">
                    <h4>Total Versions</h4>
                    <div className="stat-value">{chainStats.totalVersions}</div>
                  </div>

                  <div className="stat-card">
                    <h4>Published Versions</h4>
                    <div className="stat-value">{chainStats.publishedVersions}</div>
                  </div>

                  <div className="stat-card">
                    <h4>Draft Versions</h4>
                    <div className="stat-value">{chainStats.draftVersions}</div>
                  </div>

                  <div className="stat-card">
                    <h4>Blockchain Versions</h4>
                    <div className="stat-value">{chainStats.inscribedVersions || 0}</div>
                  </div>

                  <div className="stat-card">
                    <h4>Total Word Count</h4>
                    <div className="stat-value">{chainStats.totalWordCount.toLocaleString()}</div>
                  </div>

                  <div className="stat-card">
                    <h4>Average Words</h4>
                    <div className="stat-value">{chainStats.averageWordCount}</div>
                  </div>

                  <div className="stat-card">
                    <h4>Creation Timespan</h4>
                    <div className="stat-value">{formatTimespan(chainStats.creationTimespan)}</div>
                  </div>

                  <div className="stat-card full-width">
                    <h4>Chain Integrity</h4>
                    <div className={`stat-value ${chainStats.isChainValid ? 'valid' : 'invalid'}`}>
                      {chainStats.isChainValid ? '✅ Valid' : '❌ Invalid'}
                    </div>
                    <small>Last verified: {formatDate(chainStats.lastVerified)}</small>
                  </div>

                  {chainStats.genesisDate && (
                    <div className="stat-card full-width">
                      <h4>Genesis Version</h4>
                      <div className="stat-value">{formatDate(chainStats.genesisDate)}</div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="no-stats">
                  <p>No statistics available. Create versions to see chain statistics.</p>
                </div>
              )}

              <div className="chain-actions">
                <button onClick={verifyChain} className="btn-verify">
                  🔍 Verify Chain Integrity
                </button>
              </div>
            </div>
          </div>
        )}

            {/* Operation Progress */}
            {progress && (
              <div className="operation-progress">
                <div className="progress-header">
                  <span>{progress.message}</span>
                  <span>{progress.progress}%</span>
                </div>
                <div className="progress-bar">
                  <div 
                    className="progress-fill" 
                    style={{ width: `${progress.progress}%` }}
                  />
                </div>
                {progress.txId && (
                  <p className="tx-info">Transaction: {progress.txId}</p>
                )}
              </div>
            )}

            {/* Operation Error */}
            {error && (
              <div className="operation-error">
                <h4>⚠️ Operation Error</h4>
                <p>{error.message}</p>
                <small>Error code: {error.code}</small>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DocumentVersioningModal;