import React, { useState, useEffect } from 'react';
import { useDocumentVersioning } from '../../hooks/useDocumentVersioning';
import './DocumentVersioningModal.css';

interface DocumentVersioningModalProps {
  isOpen: boolean;
  onClose: () => void;
  documentId: string;
  currentContent: string;
  documentTitle: string;
  authorAddress: string;
  authorHandle?: string;
}

const DocumentVersioningModal: React.FC<DocumentVersioningModalProps> = ({
  isOpen,
  onClose,
  documentId,
  currentContent,
  documentTitle,
  authorAddress,
  authorHandle
}) => {
  const {
    versionChain,
    isInscribing,
    inscriptionProgress,
    inscriptionError,
    createVersion,
    inscribeVersion,
    createAndInscribeVersion,
    getChainStats,
    verifyChain,
    getLatestVersion
  } = useDocumentVersioning(documentId);

  const [activeTab, setActiveTab] = useState<'create' | 'history' | 'stats'>('create');
  const [isCreatingVersion, setIsCreatingVersion] = useState(false);
  const [privateKey, setPrivateKey] = useState('');
  const [versionMetadata, setVersionMetadata] = useState({
    description: '',
    genre: '',
    tags: '',
    isPublished: false,
    isPaid: false,
    createShares: false,
    shareCount: 1000,
    pricePerShare: 100
  });

  const chainStats = getChainStats();
  const latestVersion = getLatestVersion();

  // Reset form when modal opens
  useEffect(() => {
    if (isOpen) {
      setVersionMetadata({
        description: '',
        genre: '',
        tags: '',
        isPublished: false,
        isPaid: false,
        createShares: false,
        shareCount: 1000,
        pricePerShare: 100
      });
      setPrivateKey('');
    }
  }, [isOpen]);

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

      await createVersion(currentContent, metadata);
      alert('Version created successfully!');
      
    } catch (error) {
      console.error('Failed to create version:', error);
      alert('Failed to create version. Please try again.');
    } finally {
      setIsCreatingVersion(false);
    }
  };

  const handleInscribeLatest = async () => {
    if (!latestVersion) {
      alert('No version to inscribe');
      return;
    }

    if (!privateKey.trim()) {
      alert('Private key is required for inscription');
      return;
    }

    try {
      await inscribeVersion(latestVersion, privateKey);
      alert('Version inscribed successfully!');
      setPrivateKey(''); // Clear for security
      
    } catch (error) {
      console.error('Failed to inscribe version:', error);
      alert('Failed to inscribe version. Please try again.');
    }
  };

  const handleCreateAndInscribe = async () => {
    if (!currentContent.trim()) {
      alert('Cannot create version with empty content');
      return;
    }

    if (!privateKey.trim()) {
      alert('Private key is required for inscription');
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

      await createAndInscribeVersion(currentContent, metadata, privateKey);
      alert('Version created and inscribed successfully!');
      setPrivateKey(''); // Clear for security
      
    } catch (error) {
      console.error('Failed to create and inscribe version:', error);
      alert('Failed to create and inscribe version. Please try again.');
    } finally {
      setIsCreatingVersion(false);
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

  return (
    <div className="modal-overlay">
      <div className="versioning-modal">
        <div className="modal-header">
          <h2>📝 Document Versioning & Inscription</h2>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>

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
                    checked={versionMetadata.createShares}
                    onChange={(e) => setVersionMetadata(prev => ({ ...prev, createShares: e.target.checked }))}
                  />
                  Create Share Tokens
                </label>
              </div>

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
                  disabled={isCreatingVersion || isInscribing}
                  className="btn-create"
                >
                  {isCreatingVersion ? 'Creating...' : 'Create Version (Local)'}
                </button>

                <div className="inscription-section">
                  <div className="form-group">
                    <label>Private Key (for inscription)</label>
                    <input
                      type="password"
                      value={privateKey}
                      onChange={(e) => setPrivateKey(e.target.value)}
                      placeholder="Enter private key to inscribe to Bitcoin..."
                    />
                  </div>

                  <button 
                    onClick={handleCreateAndInscribe}
                    disabled={isCreatingVersion || isInscribing || !privateKey.trim()}
                    className="btn-inscribe"
                  >
                    {isInscribing ? 'Inscribing...' : 'Create & Inscribe to Bitcoin'}
                  </button>
                </div>
              </div>

              {latestVersion && latestVersion.status === 'draft' && (
                <div className="existing-version-section">
                  <h4>Inscribe Latest Version</h4>
                  <p>Version {latestVersion.metadata.version} is ready to be inscribed to Bitcoin.</p>
                  <button 
                    onClick={handleInscribeLatest}
                    disabled={isInscribing || !privateKey.trim()}
                    className="btn-inscribe"
                  >
                    {isInscribing ? 'Inscribing...' : 'Inscribe Latest Version'}
                  </button>
                </div>
              )}
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

        {/* Inscription Progress */}
        {inscriptionProgress && (
          <div className="inscription-progress">
            <div className="progress-header">
              <span>{inscriptionProgress.message}</span>
              <span>{inscriptionProgress.progress}%</span>
            </div>
            <div className="progress-bar">
              <div 
                className="progress-fill" 
                style={{ width: `${inscriptionProgress.progress}%` }}
              />
            </div>
            {inscriptionProgress.txId && (
              <p className="tx-info">Transaction: {inscriptionProgress.txId}</p>
            )}
          </div>
        )}

        {/* Inscription Error */}
        {inscriptionError && (
          <div className="inscription-error">
            <h4>⚠️ Inscription Error</h4>
            <p>{inscriptionError.message}</p>
            <small>Error code: {inscriptionError.code}</small>
          </div>
        )}
      </div>
    </div>
  );
};

export default DocumentVersioningModal;