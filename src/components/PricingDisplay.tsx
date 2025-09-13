import React, { useState, useEffect } from 'react';
import { 
  calculatePricing, 
  formatUSD, 
  formatSatoshis, 
  getCostComparison,
  STORAGE_OPTIONS,
  StorageOption,
  PricingBreakdown 
} from '../utils/pricingCalculator';

interface PricingDisplayProps {
  wordCount: number;
  characterCount: number;
  content: string;
  isAuthenticated: boolean;
  onStorageMethodSelect?: (method: StorageOption) => void;
}

const PricingDisplay: React.FC<PricingDisplayProps> = ({
  wordCount,
  characterCount,
  content,
  isAuthenticated,
  onStorageMethodSelect
}) => {
  const [selectedOption, setSelectedOption] = useState<StorageOption>(STORAGE_OPTIONS[0]);
  const [pricing, setPricing] = useState<PricingBreakdown | null>(null);
  const [btcPrice, setBtcPrice] = useState<number>(30000);
  const [showDetails, setShowDetails] = useState(false);

  useEffect(() => {
    const updatePricing = async () => {
      if (content) {
        const breakdown = await calculatePricing(content, selectedOption, btcPrice);
        setPricing(breakdown);
      }
    };
    
    updatePricing();
  }, [content, selectedOption, btcPrice]);

  if (!pricing || wordCount === 0) {
    return (
      <div className="pricing-display">
        <span className="pricing-hint">
          Start writing to see blockchain storage cost
        </span>
      </div>
    );
  }

  return (
    <div className="pricing-display">
      <div className="pricing-summary" onClick={() => setShowDetails(!showDetails)}>
        <span className="pricing-label">Save Cost:</span>
        <span className="pricing-amount">{formatUSD(pricing.totalCostUSD)}</span>
        <span className="pricing-comparison">{getCostComparison(pricing.totalCostUSD)}</span>
        <button className="pricing-expand">
          {showDetails ? '▼' : '▶'}
        </button>
      </div>

      {showDetails && (
        <div className="pricing-details">
          <div className="storage-options">
            <h4>Choose Storage Method:</h4>
            {STORAGE_OPTIONS.map(option => (
              <div 
                key={option.id}
                className={`storage-option ${selectedOption.id === option.id ? 'selected' : ''}`}
                onClick={() => {
                  setSelectedOption(option);
                  onStorageMethodSelect?.(option);
                }}
              >
                <div className="option-header">
                  <span className="option-icon">{option.icon}</span>
                  <span className="option-name">{option.name}</span>
                </div>
                <div className="option-description">{option.description}</div>
                <div className="option-features">
                  {option.features.map((feature, idx) => (
                    <span key={idx} className="feature-tag">✓ {feature}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className="pricing-breakdown">
            <h4>Cost Breakdown:</h4>
            <table className="breakdown-table">
              <tbody>
                <tr>
                  <td>Document Size:</td>
                  <td>{pricing.byteSize.toLocaleString()} bytes</td>
                </tr>
                <tr>
                  <td>Word Count:</td>
                  <td>{pricing.wordCount.toLocaleString()} words</td>
                </tr>
                <tr>
                  <td>Base Storage Cost:</td>
                  <td>{formatSatoshis(pricing.baseCostSatoshis)}</td>
                </tr>
                <tr>
                  <td>Service Fee (Platform):</td>
                  <td>{formatSatoshis(pricing.serviceFee)}</td>
                </tr>
                <tr className="total-row">
                  <td>Total Cost:</td>
                  <td>
                    <strong>{formatSatoshis(pricing.totalCostSatoshis)}</strong>
                    <br />
                    <span className="usd-equivalent">{formatUSD(pricing.totalCostUSD)}</span>
                  </td>
                </tr>
                <tr>
                  <td>Cost per Word:</td>
                  <td>{formatUSD(pricing.costPerWord)}</td>
                </tr>
              </tbody>
            </table>

            <div className="pricing-notes">
              <p className="note">
                💡 <strong>How it works:</strong> You pay directly to the Bitcoin network. 
                We charge 2x the base network fee to cover processing and infrastructure.
              </p>
              <p className="note">
                🔒 Your document is encrypted and permanently stored on the blockchain. 
                Only you can decrypt and read it.
              </p>
              {!isAuthenticated && (
                <p className="note highlight">
                  ⚡ Sign in with HandCash to save your document on the blockchain!
                </p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PricingDisplay;