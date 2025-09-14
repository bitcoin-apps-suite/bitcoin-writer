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
import BSVStorageService, { StorageQuote } from '../services/BSVStorageService';
import BudgetPrompt from './BudgetPrompt';

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
  const [bsvQuote, setBsvQuote] = useState<StorageQuote | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [showBudgetPrompt, setShowBudgetPrompt] = useState(false);
  const [bsvService] = useState(() => new BSVStorageService());
  const [currentBudget, setCurrentBudget] = useState(BSVStorageService.DEFAULT_BUDGET_USD);
  const [isEncrypted, setIsEncrypted] = useState(false);

  useEffect(() => {
    const updatePricing = async () => {
      if (wordCount > 0) {
        // Calculate actual BSV costs with markup
        const quote = bsvService.calculateStorageCost(wordCount, isEncrypted, currentBudget);
        setBsvQuote(quote);
        
        // Check if we need to prompt for budget increase
        if (quote.budget.requiresIncrease && !showBudgetPrompt) {
          setShowBudgetPrompt(true);
        }
        
        const breakdown: PricingBreakdown = {
          wordCount: wordCount,
          characterCount: characterCount,
          byteSize: quote.bytes,
          baseCostSatoshis: quote.minerFeeSats,
          serviceFee: quote.serviceFeeSats,
          totalCostSatoshis: quote.totalSats,
          totalCostUSD: quote.totalUSD,
          costPerWord: quote.costPerWord
        };
        setPricing(breakdown);
      }
    };
    
    updatePricing();
  }, [wordCount, characterCount, bsvService, currentBudget, isEncrypted, showBudgetPrompt]);

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

  const formatCost = (cost: number) => {
    if (cost < 0.01) {
      return `${(cost * 100).toFixed(3)}¢`;
    }
    return `${Math.ceil(cost * 100)}¢`;
  };

  const getBudgetStatus = () => {
    if (!bsvQuote) return '';
    if (bsvQuote.budget.requiresIncrease) {
      return '⚠️ Exceeds budget';
    }
    if (bsvQuote.totalUSD > currentBudget * 0.8) {
      return '⚡ Near budget limit';
    }
    return '';
  };

  if (isMobile) {
    return (
      <>
        <span 
          className="mobile-pricing-cost"
          onClick={() => setShowModal(true)}
          style={{ 
            color: bsvQuote?.budget.requiresIncrease ? '#ff9900' : '#00ff00', 
            fontWeight: 'bold' 
          }}
        >
          💰 {formatCost(pricing.totalCostUSD)}
        </span>
        
        <StorageOptionsModal
          isOpen={showModal}
          onClose={() => setShowModal(false)}
          onSelect={handleStorageSelect}
          selectedOption={selectedOption}
          pricing={pricing}
        />
        
        {bsvQuote && (
          <BudgetPrompt
            isOpen={showBudgetPrompt}
            onClose={() => setShowBudgetPrompt(false)}
            currentBudget={currentBudget}
            suggestedBudget={bsvQuote.budget.suggestedLimit || currentBudget * 2}
            wordCount={wordCount}
            estimatedCost={bsvQuote.totalUSD}
            onBudgetUpdate={setCurrentBudget}
          />
        )}
      </>
    );
  }

  return (
    <>
      <div className="pricing-display">
        <button className="pricing-button" onClick={() => setShowModal(true)}>
          <span className="pricing-label">Save as NFT:</span>
          <span 
            className="pricing-amount" 
            style={{ 
              color: bsvQuote?.budget.requiresIncrease ? '#ff9900' : '#00ff00', 
              fontWeight: 'bold' 
            }}
          >
            {formatCost(pricing.totalCostUSD)}
          </span>
          <span className="pricing-comparison">
            {bsvQuote?.description} {getBudgetStatus()}
          </span>
        </button>
        
        {isEncrypted && (
          <span className="encryption-badge" title="Encrypted storage enabled">
            🔒
          </span>
        )}
      </div>
      
      <StorageOptionsModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onSelect={handleStorageSelect}
        selectedOption={selectedOption}
        pricing={pricing}
      />
      
      {bsvQuote && (
        <BudgetPrompt
          isOpen={showBudgetPrompt}
          onClose={() => setShowBudgetPrompt(false)}
          currentBudget={currentBudget}
          suggestedBudget={bsvQuote.budget.suggestedLimit || currentBudget * 2}
          wordCount={wordCount}
          estimatedCost={bsvQuote.totalUSD}
          onBudgetUpdate={setCurrentBudget}
        />
      )}
    </>
  );
};

export default PricingDisplay;