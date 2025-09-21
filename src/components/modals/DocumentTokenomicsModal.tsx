// Open BSV License version 5
// Copyright (c) 2025 The Bitcoin Corporation LTD
// This software can only be used on BSV blockchains

import React, { useState } from 'react';
import './DocumentTokenomicsModal.css';

interface TokenomicsConfig {
  // Access Model
  accessModel: 'paywall' | 'shares' | 'subscription' | 'free';
  
  // Share Configuration
  shareConfig?: {
    totalSupply: number;
    pricePerShare: number;
    shareFunction: 'view' | 'edit' | 'ownership';
    resellable: boolean;
    royaltyRate: number; // % on secondary sales
    vestingSchedule?: {
      enabled: boolean;
      releasePercentage: number;
      releaseInterval: 'daily' | 'weekly' | 'monthly';
    };
  };
  
  // Paywall Configuration
  paywallConfig?: {
    price: number;
    currency: 'USD' | 'BSV';
    trial?: {
      enabled: boolean;
      paragraphs: number;
    };
  };
  
  // Revenue Splits
  revenueSplits?: {
    recipients: Array<{
      paymail: string;
      percentage: number;
      role: string;
    }>;
  };
  
  // Market Making
  marketMaking?: {
    enabled: boolean;
    initialLiquidity: number; // BSV amount
    priceFloor: number;
    priceCeiling: number;
    autoMarketMaker: boolean;
  };
}

interface Props {
  isOpen: boolean;
  onClose: () => void;
  documentId?: string;
  currentConfig?: TokenomicsConfig;
  onSave: (config: TokenomicsConfig) => void;
}

const DocumentTokenomicsModal: React.FC<Props> = ({ 
  isOpen, 
  onClose, 
  documentId,
  currentConfig,
  onSave 
}) => {
  const [activeTab, setActiveTab] = useState<'basic' | 'shares' | 'revenue' | 'advanced'>('basic');
  const [config, setConfig] = useState<TokenomicsConfig>(currentConfig || {
    accessModel: 'shares',
    shareConfig: {
      totalSupply: 10_000_000,
      pricePerShare: 0.01,
      shareFunction: 'view',
      resellable: true,
      royaltyRate: 10
    }
  });

  // Preset templates
  const templates = {
    viral: {
      name: 'Viral Content',
      description: 'High supply, low price for maximum reach',
      config: {
        totalSupply: 100_000_000,
        pricePerShare: 0.001,
        royaltyRate: 5
      }
    },
    premium: {
      name: 'Premium Research',
      description: 'Low supply, high price for exclusive content',
      config: {
        totalSupply: 1_000,
        pricePerShare: 10,
        royaltyRate: 20
      }
    },
    balanced: {
      name: 'Balanced',
      description: 'Medium supply and price for steady growth',
      config: {
        totalSupply: 10_000_000,
        pricePerShare: 0.01,
        royaltyRate: 10
      }
    }
  };

  const calculateMetrics = () => {
    if (!config.shareConfig) return null;
    
    const { totalSupply, pricePerShare, royaltyRate } = config.shareConfig;
    const maxRevenue = totalSupply * pricePerShare;
    const ifAllSoldOut = maxRevenue * 0.9; // 90% to author
    const avgSecondaryRoyalty = maxRevenue * (royaltyRate / 100) * 0.5; // Estimate 50% resell
    
    return {
      maxRevenue: maxRevenue.toFixed(2),
      authorRevenue: ifAllSoldOut.toFixed(2),
      estimatedRoyalties: avgSecondaryRoyalty.toFixed(2),
      breakEvenReaders: Math.ceil(100 / pricePerShare) // Assume $100 target
    };
  };

  const metrics = calculateMetrics();

  if (!isOpen) return null;

  return (
    <>
      <div className="modal-overlay" onClick={onClose} />
      <div className="tokenomics-modal">
        <div className="modal-header">
          <h2>📊 Configure Document Economics</h2>
          <button className="close-btn" onClick={onClose}>✕</button>
        </div>

        <div className="modal-tabs">
          <button 
            className={`tab ${activeTab === 'basic' ? 'active' : ''}`}
            onClick={() => setActiveTab('basic')}
          >
            Basic Setup
          </button>
          <button 
            className={`tab ${activeTab === 'shares' ? 'active' : ''}`}
            onClick={() => setActiveTab('shares')}
          >
            Share Config
          </button>
          <button 
            className={`tab ${activeTab === 'revenue' ? 'active' : ''}`}
            onClick={() => setActiveTab('revenue')}
          >
            Revenue Splits
          </button>
          <button 
            className={`tab ${activeTab === 'advanced' ? 'active' : ''}`}
            onClick={() => setActiveTab('advanced')}
          >
            Advanced
          </button>
        </div>

        <div className="modal-content">
          {activeTab === 'basic' && (
            <div className="basic-setup">
              <h3>Choose Your Monetization Model</h3>
              
              <div className="model-options">
                <label className={`model-option ${config.accessModel === 'shares' ? 'selected' : ''}`}>
                  <input
                    type="radio"
                    name="model"
                    value="shares"
                    checked={config.accessModel === 'shares'}
                    onChange={(e) => setConfig({...config, accessModel: 'shares' as any})}
                  />
                  <div className="option-content">
                    <h4>🎫 Share-Based Access</h4>
                    <p>Issue limited shares, each grants one view. Resellable on secondary market.</p>
                    <div className="benefits">
                      ✓ Creates scarcity
                      ✓ Price discovery
                      ✓ Secondary royalties
                    </div>
                  </div>
                </label>

                <label className={`model-option ${config.accessModel === 'paywall' ? 'selected' : ''}`}>
                  <input
                    type="radio"
                    name="model"
                    value="paywall"
                    checked={config.accessModel === 'paywall'}
                    onChange={(e) => setConfig({...config, accessModel: 'paywall' as any})}
                  />
                  <div className="option-content">
                    <h4>💰 Traditional Paywall</h4>
                    <p>One-time payment for permanent access.</p>
                    <div className="benefits">
                      ✓ Simple pricing
                      ✓ Familiar model
                      ✓ No complexity
                    </div>
                  </div>
                </label>

                <label className={`model-option ${config.accessModel === 'free' ? 'selected' : ''}`}>
                  <input
                    type="radio"
                    name="model"
                    value="free"
                    checked={config.accessModel === 'free'}
                    onChange={(e) => setConfig({...config, accessModel: 'free' as any})}
                  />
                  <div className="option-content">
                    <h4>🎁 Free Access</h4>
                    <p>No payment required. Build audience first.</p>
                    <div className="benefits">
                      ✓ Maximum reach
                      ✓ Build reputation
                      ✓ Accept donations
                    </div>
                  </div>
                </label>
              </div>

              <div className="quick-templates">
                <h4>Quick Templates</h4>
                <div className="template-grid">
                  {Object.entries(templates).map(([key, template]) => (
                    <button
                      key={key}
                      className="template-btn"
                      onClick={() => {
                        setConfig({
                          ...config,
                          shareConfig: {
                            ...config.shareConfig!,
                            ...template.config
                          }
                        });
                      }}
                    >
                      <strong>{template.name}</strong>
                      <span>{template.description}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'shares' && config.accessModel === 'shares' && (
            <div className="shares-config">
              <h3>Share Configuration</h3>

              <div className="config-group">
                <label>
                  Total Supply
                  <input
                    type="number"
                    value={config.shareConfig?.totalSupply || 10_000_000}
                    onChange={(e) => setConfig({
                      ...config,
                      shareConfig: {
                        ...config.shareConfig!,
                        totalSupply: parseInt(e.target.value)
                      }
                    })}
                  />
                  <span className="helper">Total number of shares to issue</span>
                </label>

                <label>
                  Price per Share ($)
                  <input
                    type="number"
                    step="0.001"
                    value={config.shareConfig?.pricePerShare || 0.01}
                    onChange={(e) => setConfig({
                      ...config,
                      shareConfig: {
                        ...config.shareConfig!,
                        pricePerShare: parseFloat(e.target.value)
                      }
                    })}
                  />
                  <span className="helper">Initial price for each share</span>
                </label>

                <label>
                  Secondary Sale Royalty (%)
                  <input
                    type="number"
                    min="0"
                    max="50"
                    value={config.shareConfig?.royaltyRate || 10}
                    onChange={(e) => setConfig({
                      ...config,
                      shareConfig: {
                        ...config.shareConfig!,
                        royaltyRate: parseInt(e.target.value)
                      }
                    })}
                  />
                  <span className="helper">Your cut when shares are resold</span>
                </label>
              </div>

              <div className="share-function">
                <h4>What does each share grant?</h4>
                <div className="function-options">
                  <label>
                    <input
                      type="radio"
                      name="function"
                      value="view"
                      checked={config.shareConfig?.shareFunction === 'view'}
                      onChange={(e) => setConfig({
                        ...config,
                        shareConfig: {
                          ...config.shareConfig!,
                          shareFunction: 'view'
                        }
                      })}
                    />
                    <span>One View</span>
                  </label>
                  <label>
                    <input
                      type="radio"
                      name="function"
                      value="edit"
                      checked={config.shareConfig?.shareFunction === 'edit'}
                      onChange={(e) => setConfig({
                        ...config,
                        shareConfig: {
                          ...config.shareConfig!,
                          shareFunction: 'edit'
                        }
                      })}
                    />
                    <span>Edit Rights</span>
                  </label>
                  <label>
                    <input
                      type="radio"
                      name="function"
                      value="ownership"
                      checked={config.shareConfig?.shareFunction === 'ownership'}
                      onChange={(e) => setConfig({
                        ...config,
                        shareConfig: {
                          ...config.shareConfig!,
                          shareFunction: 'ownership'
                        }
                      })}
                    />
                    <span>Ownership %</span>
                  </label>
                </div>
              </div>

              {metrics && (
                <div className="revenue-projections">
                  <h4>Revenue Projections</h4>
                  <div className="metrics-grid">
                    <div className="metric">
                      <span className="label">If All Shares Sell</span>
                      <span className="value">${metrics.maxRevenue}</span>
                    </div>
                    <div className="metric">
                      <span className="label">Your Revenue (90%)</span>
                      <span className="value">${metrics.authorRevenue}</span>
                    </div>
                    <div className="metric">
                      <span className="label">Est. Royalties</span>
                      <span className="value">${metrics.estimatedRoyalties}</span>
                    </div>
                    <div className="metric">
                      <span className="label">Break-even Readers</span>
                      <span className="value">{metrics.breakEvenReaders}</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === 'revenue' && (
            <div className="revenue-splits">
              <h3>Revenue Distribution</h3>
              <p>Split revenue with collaborators, editors, or investors</p>

              <div className="splits-list">
                <div className="split-item">
                  <input type="text" placeholder="paymail@domain.com" />
                  <input type="number" placeholder="%" min="0" max="100" />
                  <input type="text" placeholder="Role (e.g., Editor)" />
                  <button className="remove-btn">✕</button>
                </div>
              </div>

              <button className="add-split-btn">+ Add Recipient</button>

              <div className="split-summary">
                <div className="summary-item">
                  <span>Your Share:</span>
                  <strong>70%</strong>
                </div>
                <div className="summary-item">
                  <span>Platform Fee:</span>
                  <strong>10%</strong>
                </div>
                <div className="summary-item">
                  <span>Collaborators:</span>
                  <strong>20%</strong>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'advanced' && (
            <div className="advanced-settings">
              <h3>Advanced Options</h3>

              <div className="setting-group">
                <h4>🚀 Release Schedule</h4>
                <label>
                  <input type="checkbox" />
                  Enable vesting schedule
                </label>
                <p>Release shares gradually over time to maintain interest</p>
                
                <div className="vesting-options">
                  <label>
                    Release %
                    <input type="number" placeholder="10" />
                  </label>
                  <label>
                    Interval
                    <select>
                      <option>Daily</option>
                      <option>Weekly</option>
                      <option>Monthly</option>
                    </select>
                  </label>
                </div>
              </div>

              <div className="setting-group">
                <h4>📈 Automated Market Maker</h4>
                <label>
                  <input type="checkbox" />
                  Enable AMM
                </label>
                <p>Provide liquidity for instant buy/sell</p>
                
                <div className="amm-options">
                  <label>
                    Initial Liquidity (BSV)
                    <input type="number" step="0.01" placeholder="1.0" />
                  </label>
                  <label>
                    Price Floor ($)
                    <input type="number" step="0.001" placeholder="0.005" />
                  </label>
                  <label>
                    Price Ceiling ($)
                    <input type="number" step="0.01" placeholder="1.00" />
                  </label>
                </div>
              </div>

              <div className="setting-group">
                <h4>🔒 Transfer Restrictions</h4>
                <label>
                  <input type="checkbox" checked={config.shareConfig?.resellable} />
                  Allow resale on secondary market
                </label>
                <label>
                  <input type="checkbox" />
                  Require KYC for large purchases
                </label>
                <label>
                  <input type="checkbox" />
                  Geographic restrictions
                </label>
              </div>
            </div>
          )}
        </div>

        <div className="modal-footer">
          <button className="cancel-btn" onClick={onClose}>Cancel</button>
          <button 
            className="save-btn"
            onClick={() => {
              onSave(config);
              onClose();
            }}
          >
            Deploy Token Economics
          </button>
        </div>
      </div>
    </>
  );
};

export default DocumentTokenomicsModal;