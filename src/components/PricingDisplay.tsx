import React, { useState, useEffect } from 'react';
import { 
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
  onPriceUpdate?: (price: string) => void;
  isMobile?: boolean;
}

const PricingDisplay: React.FC<PricingDisplayProps> = ({
  wordCount,
  characterCount,
  content,
  isAuthenticated,
  onStorageMethodSelect,
  onPriceUpdate,
  isMobile = false
}) => {
  const [selectedOption, setSelectedOption] = useState<StorageOption>(STORAGE_OPTIONS[0]);
  const [pricing, setPricing] = useState<PricingBreakdown | null>(null);
  const [bsvQuote, setBsvQuote] = useState<StorageQuote | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [showBudgetPrompt, setShowBudgetPrompt] = useState(false);
  const [bsvService] = useState(() => new BSVStorageService());
  const [currentBudget, setCurrentBudget] = useState(BSVStorageService.DEFAULT_BUDGET_USD);
  const [isEncrypted] = useState(false);

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
        
        // Notify parent of price update
        if (onPriceUpdate) {
          // Format cost for display
          const cost = quote.totalUSD;
          let formattedPrice;
          if (cost < 0.000001) {
            formattedPrice = `${(cost * 100).toFixed(8)}¢`;
          } else if (cost < 0.0001) {
            formattedPrice = `${(cost * 100).toFixed(6)}¢`;
          } else if (cost < 0.01) {
            formattedPrice = `${(cost * 100).toFixed(4)}¢`;
          } else {
            formattedPrice = `${(cost * 100).toFixed(2)}¢`;
          }
          onPriceUpdate(formattedPrice);
        }
      }
    };
    
    updatePricing();
  }, [wordCount, characterCount, bsvService, currentBudget, isEncrypted, showBudgetPrompt, onPriceUpdate]);

  if (!pricing || wordCount === 0) {
    // Notify parent of zero price
    if (onPriceUpdate) {
      onPriceUpdate('0.000000¢');
    }
    
    return isMobile ? (
      <span className="mobile-pricing-hint">💰 0.000000¢</span>
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
    // Always show at least 6 decimal places for small amounts
    if (cost < 0.000001) {
      return `${(cost * 100).toFixed(8)}¢`;
    } else if (cost < 0.0001) {
      return `${(cost * 100).toFixed(6)}¢`;
    } else if (cost < 0.01) {
      return `${(cost * 100).toFixed(4)}¢`;
    }
    return `${(cost * 100).toFixed(2)}¢`;
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
        <span 
          className="pricing-amount" 
          style={{ 
            color: bsvQuote?.budget.requiresIncrease ? '#ff9900' : '#00ff00', 
            fontWeight: 'bold',
            cursor: 'pointer' 
          }}
          onClick={() => setShowModal(true)}
          title="Click to see storage options"
        >
          {formatCost(pricing.totalCostUSD)}
        </span>
        {getBudgetStatus() && (
          <span className="budget-status">
            {getBudgetStatus()}
          </span>
        )}
        
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