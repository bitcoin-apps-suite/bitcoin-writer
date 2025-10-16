import React, { useState, useEffect } from 'react';
import StripePaymentService, { TopUpOption } from '../services/StripePaymentService';
import './TopUpModal.css';

interface TopUpModalProps {
  isOpen: boolean;
  onClose: () => void;
  userEmail: string;
  handcashHandle: string;
}

const TopUpModal: React.FC<TopUpModalProps> = ({
  isOpen,
  onClose,
  userEmail,
  handcashHandle
}) => {
  const [paymentService] = useState(() => new StripePaymentService());
  const [selectedTopUp, setSelectedTopUp] = useState<string | null>(null);
  const [currentBalance, setCurrentBalance] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen && handcashHandle) {
      loadCurrentBalance();
    }
  }, [isOpen, handcashHandle]);

  const loadCurrentBalance = async () => {
    try {
      const balanceData = await paymentService.getBSVBalance(handcashHandle);
      setCurrentBalance(balanceData.currentBalance);
    } catch (error) {
      console.error('Error loading balance:', error);
    }
  };

  const handleTopUp = async () => {
    if (!selectedTopUp) return;

    setLoading(true);
    setError(null);

    try {
      await paymentService.redirectToTopUpCheckout(selectedTopUp, userEmail, handcashHandle);
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to process top-up');
      setLoading(false);
    }
  };

  const topUpOptions = paymentService.getTopUpOptions();

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="topup-modal" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Add BSV Balance</h2>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>

        <div className="modal-content">
          <div className="current-balance">
            <h3>Current Balance</h3>
            <div className="balance-display">
              <span className="balance-amount">{(currentBalance / 100000000).toFixed(8)}</span>
              <span className="balance-unit">BSV</span>
            </div>
            <p className="balance-note">
              ≈ {(currentBalance / 1000000).toFixed(2)} million satoshis
            </p>
          </div>

          <div className="topup-options">
            <h4>Choose Top-up Amount:</h4>
            <div className="options-grid">
              {topUpOptions.map((option) => {
                const estimate = paymentService.calculateStorageEstimate(
                  option.bsvSatoshis + (option.bonus || 0)
                );
                const isSelected = selectedTopUp === option.id;

                return (
                  <div
                    key={option.id}
                    className={`topup-option ${isSelected ? 'selected' : ''} ${option.popular ? 'popular' : ''}`}
                    onClick={() => setSelectedTopUp(option.id)}
                  >
                    {option.popular && <div className="popular-badge">Most Popular</div>}
                    
                    <div className="option-header">
                      <h5>{option.name}</h5>
                      <div className="price">${option.usdAmount}</div>
                    </div>

                    <div className="option-details">
                      <div className="satoshis">
                        <strong>{(option.bsvSatoshis / 1000000).toFixed(1)}M</strong> satoshis
                      </div>
                      
                      {option.bonus && (
                        <div className="bonus">
                          + {(option.bonus / 1000000).toFixed(1)}M bonus!
                        </div>
                      )}

                      <div className="estimate">
                        <p>≈ {estimate.estimatedDocuments} documents</p>
                        <p className="estimate-note">{estimate.description}</p>
                      </div>
                    </div>

                    <div className="total-amount">
                      Total: <strong>{((option.bsvSatoshis + (option.bonus || 0)) / 1000000).toFixed(1)}M</strong> sats
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="topup-info">
            <div className="info-box">
              <h4>💡 How it works:</h4>
              <ul>
                <li>Pay with card, get BSV balance instantly</li>
                <li>Use balance for blockchain storage costs</li>
                <li>Larger amounts include bonus satoshis</li>
                <li>No expiration - balance stays forever</li>
              </ul>
            </div>
          </div>

          {error && (
            <div className="error-message">
              {error}
            </div>
          )}

          <div className="modal-footer">
            <button className="cancel-btn" onClick={onClose}>
              Cancel
            </button>
            <button 
              className="topup-btn primary"
              onClick={handleTopUp}
              disabled={!selectedTopUp || loading}
            >
              {loading ? 'Processing...' : 'Add Balance'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TopUpModal;