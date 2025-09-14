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
import BSVStorageService from '../services/BSVStorageService';

interface PricingDisplayProps {
  wordCount: number;
  characterCount: number;
  content: string;
  isAuthenticated: boolean;
  onStorageMethodSelect?: (method: StorageOption) => void;
  isMobile?: boolean;
}

const PricingDisplay: React.FC<PricingDisplayProps> = ({
  wordCount,
  characterCount,
  content,
  isAuthenticated,
  onStorageMethodSelect,
  isMobile = false
}) => {
  const [selectedOption, setSelectedOption] = useState<StorageOption>(STORAGE_OPTIONS[0]);
  const [pricing, setPricing] = useState<PricingBreakdown | null>(null);
  const [btcPrice, setBtcPrice] = useState<number>(30000);
  const [showModal, setShowModal] = useState(false);
  const [bsvService] = useState(() => new BSVStorageService());

  useEffect(() => {
    const updatePricing = async () => {
      if (wordCount > 0) {
        // Use flat penny pricing from BSV service
        const quote = bsvService.calculateStorageCost(wordCount);
        const breakdown: PricingBreakdown = {
          wordCount: wordCount,
          characterCount: characterCount,
          byteSize: quote.bytes,
          baseCostSatoshis: quote.minerFeeSats,
          serviceFee: quote.serviceFeeSats,
          totalCostSatoshis: quote.totalSats,
          totalCostUSD: quote.totalUSD, // Always $0.01
          costPerWord: quote.totalUSD / wordCount
        };
        setPricing(breakdown);
      }
    };
    
    updatePricing();
  }, [wordCount, bsvService]);

  if (!pricing || wordCount === 0) {
    return isMobile ? (
      <span className="mobile-pricing-hint">💰 $0.00</span>
    ) : (
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

  if (isMobile) {
    return (
      <>
        <span 
          className="mobile-pricing-cost"
          onClick={() => setShowModal(true)}
          style={{ color: '#00ff00', fontWeight: 'bold' }}
        >
          💰 1¢
        </span>
        
        <StorageOptionsModal
          isOpen={showModal}
          onClose={() => setShowModal(false)}
          onSelect={handleStorageSelect}
          selectedOption={selectedOption}
          pricing={pricing}
        />
      </>
    );
  }

  return (
    <>
      <div className="pricing-display">
        <button className="pricing-button" onClick={() => setShowModal(true)}>
          <span className="pricing-label">Save to BSV:</span>
          <span className="pricing-amount" style={{ color: '#00ff00', fontWeight: 'bold' }}>1¢</span>
          <span className="pricing-comparison">
            {wordCount.toLocaleString()} words • Forever on-chain
          </span>
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