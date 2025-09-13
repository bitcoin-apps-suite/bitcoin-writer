import React, { useState, useEffect } from 'react';
import { 
  calculatePricing, 
  formatUSD, 
  getCostComparison,
  STORAGE_OPTIONS,
  StorageOption,
  PricingBreakdown 
} from '../utils/pricingCalculator';
import StorageOptionsModal from './StorageOptionsModal';

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
  const [showModal, setShowModal] = useState(false);

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

  const handleStorageSelect = (option: StorageOption) => {
    setSelectedOption(option);
    onStorageMethodSelect?.(option);
  };

  return (
    <>
      <div className="pricing-display">
        <button className="pricing-button" onClick={() => setShowModal(true)}>
          <span className="pricing-label">Save Cost:</span>
          <span className="pricing-amount">{formatUSD(pricing.totalCostUSD)}</span>
          <span className="pricing-comparison">{getCostComparison(pricing.totalCostUSD)}</span>
        </button>
      </div>
      
      <StorageOptionsModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onSelect={handleStorageSelect}
        selectedOption={selectedOption}
        pricing={pricing}
      />
    </>
  );
};

export default PricingDisplay;