import React, { useState } from 'react';

interface TokenizeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onTokenize: (protocol: string, options: TokenizationOptions) => void;
  documentTitle: string;
  wordCount: number;
}

export interface TokenizationOptions {
  protocol: string;
  name: string;
  symbol: string;
  supply: number;
  decimals: number;
  description: string;
  royaltyPercentage: number;
  price?: number;
  metadata?: {
    author?: string;
    category?: string;
    tags?: string[];
    image?: string;
  };
}

const TOKENIZATION_PROTOCOLS = [
  {
    id: 'stas',
    name: 'STAS (Satoshi Token Asset Standard)',
    icon: '🎯',
    description: 'Simple and efficient token protocol for creating fungible and non-fungible tokens',
    features: ['Low fees', 'Smart contract compatible', 'Regulatory compliant', 'Atomic swaps'],
    color: '#4CAF50'
  },
  {
    id: 'run',
    name: 'RUN Protocol',
    icon: '⚡',
    description: 'Interactive token protocol with built-in smart contract capabilities',
    features: ['Interactive tokens', 'On-chain state', 'Programmable', 'Asset support'],
    color: '#2196F3'
  },
  {
    id: 'sensible',
    name: 'Sensible Contract',
    icon: '🔐',
    description: 'Advanced smart contract protocol with full programmability',
    features: ['Full smart contracts', 'Complex logic', 'DeFi ready', 'Cross-chain bridges'],
    color: '#9C27B0'
  },
  {
    id: '1sat',
    name: '1Sat Ordinals',
    icon: '🪙',
    description: 'Inscribe data directly on individual satoshis for permanent storage',
    features: ['Permanent storage', 'No smart contracts needed', 'Simple transfers', 'Collectible friendly'],
    color: '#FF9800'
  },
  {
    id: 'bsv20',
    name: 'BSV-20',
    icon: '📜',
    description: 'Token standard similar to BRC-20 but optimized for BSV',
    features: ['JSON-based', 'Simple minting', 'Wide compatibility', 'Easy integration'],
    color: '#F44336'
  },
  {
    id: 'bsv21',
    name: 'BSV-21',
    icon: '🎨',
    description: 'Bitcoin OS asset protocol for unique digital documents and collectibles',
    features: ['OS-level assets', 'Metadata support', 'Royalties built-in', 'Marketplace ready'],
    color: '#00BCD4'
  }
];

const TokenizeModal: React.FC<TokenizeModalProps> = ({
  isOpen,
  onClose,
  onTokenize,
  documentTitle,
  wordCount
}) => {
  const [selectedProtocol, setSelectedProtocol] = useState('stas');
  const [tokenName, setTokenName] = useState(documentTitle || 'My Document Token');
  const [tokenSymbol, setTokenSymbol] = useState('');
  const [totalSupply, setTotalSupply] = useState(1000);
  const [decimals, setDecimals] = useState(0);
  const [description, setDescription] = useState('');
  const [royaltyPercentage, setRoyaltyPercentage] = useState(10);
  const [tokenPrice, setTokenPrice] = useState(0.1);
  const [author, setAuthor] = useState('');
  const [category, setCategory] = useState('Literature');
  const [tags, setTags] = useState('');

  if (!isOpen) return null;

  const handleTokenize = () => {
    const options: TokenizationOptions = {
      protocol: selectedProtocol,
      name: tokenName,
      symbol: tokenSymbol,
      supply: totalSupply,
      decimals,
      description,
      royaltyPercentage,
      price: tokenPrice,
      metadata: {
        author,
        category,
        tags: tags.split(',').map(tag => tag.trim()).filter(tag => tag)
      }
    };
    
    onTokenize(selectedProtocol, options);
    onClose();
  };

  const selectedProtocolInfo = TOKENIZATION_PROTOCOLS.find(p => p.id === selectedProtocol);
  const isAsset = selectedProtocol === 'bsv21' || selectedProtocol === '1sat';

  return (
    <div className="modal-overlay">
      <div className="tokenize-modal">
        <div className="modal-header">
          <h2>🎨 Create Bitcoin OS Asset</h2>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>

        <div className="modal-body">
          {/* Document Info */}
          <div className="document-info-box">
            <h3>📄 {documentTitle || 'Untitled Document'}</h3>
            <p>{wordCount.toLocaleString()} words • Ready for tokenization</p>
          </div>

          {/* Protocol Selection */}
          <div className="protocol-section">
            <h3>Select Tokenization Protocol</h3>
            <div className="protocol-grid">
              {TOKENIZATION_PROTOCOLS.map(protocol => (
                <div
                  key={protocol.id}
                  className={`protocol-card ${selectedProtocol === protocol.id ? 'selected' : ''}`}
                  onClick={() => setSelectedProtocol(protocol.id)}
                  style={{ borderColor: selectedProtocol === protocol.id ? protocol.color : 'transparent' }}
                >
                  <div className="protocol-header">
                    <span className="protocol-icon">{protocol.icon}</span>
                    <h4>{protocol.name}</h4>
                  </div>
                  <p className="protocol-description">{protocol.description}</p>
                  <div className="protocol-features">
                    {protocol.features.map((feature, idx) => (
                      <span key={idx} className="feature-tag" style={{ backgroundColor: `${protocol.color}20`, color: protocol.color }}>
                        {feature}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Token Configuration */}
          <div className="token-config-section">
            <h3>Configure Your Token</h3>
            
            <div className="config-grid">
              <div className="form-group">
                <label>Token Name</label>
                <input
                  type="text"
                  value={tokenName}
                  onChange={(e) => setTokenName(e.target.value)}
                  placeholder="My Amazing Document"
                />
              </div>

              <div className="form-group">
                <label>Token Symbol</label>
                <input
                  type="text"
                  value={tokenSymbol}
                  onChange={(e) => setTokenSymbol(e.target.value.toUpperCase())}
                  placeholder="DOC"
                  maxLength={10}
                />
              </div>

              {!isAsset && (
                <>
                  <div className="form-group">
                    <label>Total Supply</label>
                    <input
                      type="number"
                      value={totalSupply}
                      onChange={(e) => setTotalSupply(Number(e.target.value))}
                      min="1"
                    />
                  </div>

                  <div className="form-group">
                    <label>Decimals</label>
                    <input
                      type="number"
                      value={decimals}
                      onChange={(e) => setDecimals(Number(e.target.value))}
                      min="0"
                      max="18"
                    />
                  </div>
                </>
              )}

              {isAsset && (
                <div className="form-group">
                  <label>Edition Size</label>
                  <input
                    type="number"
                    value={totalSupply}
                    onChange={(e) => setTotalSupply(Number(e.target.value))}
                    min="1"
                    placeholder="1 for unique, more for editions"
                  />
                </div>
              )}

              <div className="form-group">
                <label>Price per Token (USD)</label>
                <input
                  type="number"
                  value={tokenPrice}
                  onChange={(e) => setTokenPrice(Number(e.target.value))}
                  min="0"
                  step="0.01"
                />
              </div>

              <div className="form-group">
                <label>Royalty Percentage</label>
                <input
                  type="number"
                  value={royaltyPercentage}
                  onChange={(e) => setRoyaltyPercentage(Number(e.target.value))}
                  min="0"
                  max="50"
                />
                <small>Earn {royaltyPercentage}% on all secondary sales</small>
              </div>
            </div>

            <div className="form-group full-width">
              <label>Description</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe your token and what it represents..."
                rows={4}
              />
            </div>

            {/* Metadata Section */}
            <h4>Metadata</h4>
            <div className="config-grid">
              <div className="form-group">
                <label>Author</label>
                <input
                  type="text"
                  value={author}
                  onChange={(e) => setAuthor(e.target.value)}
                  placeholder="Your name or pseudonym"
                />
              </div>

              <div className="form-group">
                <label>Category</label>
                <select value={category} onChange={(e) => setCategory(e.target.value)}>
                  <option value="Literature">Literature</option>
                  <option value="Technical">Technical</option>
                  <option value="Research">Research</option>
                  <option value="Creative">Creative</option>
                  <option value="Business">Business</option>
                  <option value="Educational">Educational</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div className="form-group full-width">
                <label>Tags (comma separated)</label>
                <input
                  type="text"
                  value={tags}
                  onChange={(e) => setTags(e.target.value)}
                  placeholder="blockchain, writing, asset, document"
                />
              </div>
            </div>
          </div>

          {/* Cost Estimation */}
          <div className="cost-estimation">
            <h3>Estimated Costs</h3>
            <div className="cost-breakdown">
              <div className="cost-item">
                <span>Protocol Fee ({selectedProtocolInfo?.name})</span>
                <span>~$0.05</span>
              </div>
              <div className="cost-item">
                <span>Token Creation</span>
                <span>~$0.10</span>
              </div>
              <div className="cost-item">
                <span>Metadata Storage</span>
                <span>~$0.02</span>
              </div>
              <div className="cost-item total">
                <span>Total Estimated Cost</span>
                <span>~$0.17</span>
              </div>
            </div>
            <small className="cost-note">
              * Actual costs may vary based on network conditions and token complexity
            </small>
          </div>
        </div>

        <div className="modal-footer">
          <button className="cancel-btn" onClick={onClose}>Cancel</button>
          <button 
            className="tokenize-btn" 
            onClick={handleTokenize}
            style={{ backgroundColor: selectedProtocolInfo?.color }}
          >
            <span>{selectedProtocolInfo?.icon}</span>
            Create Token on {selectedProtocolInfo?.name}
          </button>
        </div>
      </div>
    </div>
  );
};

export default TokenizeModal;