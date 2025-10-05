import React from 'react';
import BSVStorageService from '../services/BSVStorageService';

interface BudgetPromptProps {
  isOpen: boolean;
  onClose: () => void;
  currentBudget: number;
  suggestedBudget: number;
  wordCount: number;
  estimatedCost: number;
  onBudgetUpdate: (newBudget: number) => void;
}

const BudgetPrompt: React.FC<BudgetPromptProps> = ({
  isOpen,
  onClose,
  currentBudget,
  suggestedBudget,
  wordCount,
  estimatedCost,
  onBudgetUpdate
}) => {
  if (!isOpen) return null;

  const formatCents = (amount: number) => {
    if (amount < 0.01) {
      return `${(amount * 100).toFixed(2)}¢`;
    }
    return `${Math.ceil(amount * 100)}¢`;
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content budget-prompt" onClick={e => e.stopPropagation()}>
        <h2>📈 Increase Your Auto-Save Budget?</h2>
        
        <div className="budget-info">
          <p>Your document has grown to <strong>{wordCount.toLocaleString()} words</strong></p>
          <p>Estimated blockchain storage cost: <strong>{formatCents(estimatedCost)}</strong></p>
          <p>Current budget: <strong>{formatCents(currentBudget)}</strong></p>
        </div>

        <div className="budget-explanation">
          <p>💡 <strong>Why does this cost money?</strong></p>
          <p>
            Saving to the BSV blockchain creates a permanent, immutable NFT of your document. 
            This requires a small fee to compensate miners for storing your data forever.
          </p>
        </div>

        <div className="budget-options">
          <h3>Select your new budget limit:</h3>
          <div className="budget-buttons">
            {BSVStorageService.BUDGET_INCREMENTS
              .filter(budget => budget > currentBudget)
              .map(budget => (
                <button
                  key={budget}
                  className={`budget-option ${budget === suggestedBudget ? 'recommended' : ''}`}
                  onClick={() => {
                    onBudgetUpdate(budget);
                    onClose();
                  }}
                >
                  <span className="budget-amount">{formatCents(budget)}</span>
                  {budget === suggestedBudget && <span className="badge">Recommended</span>}
                </button>
              ))}
          </div>
        </div>

        <div className="budget-features">
          <h4>What you get:</h4>
          <ul>
            <li>✓ Permanent blockchain storage</li>
            <li>✓ Immutable proof of authorship</li>
            <li>✓ Timestamp verification</li>
            <li>✓ Optional encryption (+50% cost)</li>
          </ul>
        </div>

        <div className="modal-actions">
          <button className="btn-secondary" onClick={onClose}>
            Keep Current Budget
          </button>
          <button 
            className="btn-primary" 
            onClick={() => {
              onBudgetUpdate(suggestedBudget);
              onClose();
            }}
          >
            Increase to {formatCents(suggestedBudget)}
          </button>
        </div>
      </div>
    </div>
  );
};

export default BudgetPrompt;