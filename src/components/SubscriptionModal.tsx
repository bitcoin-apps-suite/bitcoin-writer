import React, { useState, useEffect } from 'react';
import StripePaymentService, { ProSubscription } from '../services/StripePaymentService';
import StripeSubscriptionService, { SubscriptionPlan } from '../services/StripeSubscriptionService';
import './SubscriptionModal.css';

interface SubscriptionModalProps {
  isOpen: boolean;
  onClose: () => void;
  userEmail: string;
  handcashHandle: string;
}

const SubscriptionModal: React.FC<SubscriptionModalProps> = ({
  isOpen,
  onClose,
  userEmail,
  handcashHandle
}) => {
  const [paymentService] = useState(() => new StripePaymentService());
  const [subscriptionService] = useState(() => new StripeSubscriptionService());
  const [currentSubscription, setCurrentSubscription] = useState<ProSubscription | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedPlan, setSelectedPlan] = useState<'pro' | 'tiered'>('pro');
  const [selectedTier, setSelectedTier] = useState<string>('regular');

  useEffect(() => {
    if (isOpen && handcashHandle) {
      loadSubscriptionStatus();
    }
  }, [isOpen, handcashHandle]);

  const loadSubscriptionStatus = async () => {
    try {
      const subscription = await paymentService.getProSubscriptionStatus(handcashHandle);
      setCurrentSubscription(subscription);
    } catch (error) {
      console.error('Error loading subscription:', error);
    }
  };

  const handleSubscribe = async () => {
    setLoading(true);
    setError(null);

    try {
      if (selectedPlan === 'pro') {
        await paymentService.redirectToProSubscriptionCheckout(userEmail, handcashHandle);
      } else {
        await subscriptionService.redirectToCheckout(selectedTier, userEmail, handcashHandle);
      }
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to start subscription');
      setLoading(false);
    }
  };

  const handleTieredSubscribe = async (planId: string) => {
    setLoading(true);
    setError(null);

    try {
      await subscriptionService.redirectToCheckout(planId, userEmail, handcashHandle);
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to start subscription');
      setLoading(false);
    }
  };

  const handleCancelSubscription = async () => {
    if (!currentSubscription || !window.confirm('Are you sure you want to cancel your Pro subscription?')) {
      return;
    }

    setLoading(true);
    try {
      const success = await paymentService.cancelProSubscription(currentSubscription.id);
      if (success) {
        setCurrentSubscription(null);
        alert('Subscription canceled successfully');
      } else {
        setError('Failed to cancel subscription');
      }
    } catch (error) {
      setError('Error canceling subscription');
    }
    setLoading(false);
  };

  const proDetails = paymentService.getProSubscriptionDetails();
  const subscriptionPlans = subscriptionService.getSubscriptionPlans();
  const userCurrency = subscriptionService.getUserCurrency();

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="subscription-modal" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Bitcoin Writer Pro</h2>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>

        <div className="modal-content">
          {currentSubscription ? (
            <div className="current-subscription">
              <div className="subscription-status">
                <h3>✅ You're subscribed to Pro!</h3>
                <div className="subscription-details">
                  <p><strong>Status:</strong> {currentSubscription.status}</p>
                  <p><strong>Next billing:</strong> {currentSubscription.currentPeriodEnd.toLocaleDateString()}</p>
                  <p><strong>Price:</strong> ${currentSubscription.price}/month</p>
                </div>
              </div>

              <div className="pro-features active">
                <h4>Your Pro Features:</h4>
                <ul>
                  {currentSubscription.features.map((feature, index) => (
                    <li key={index}>✓ {feature}</li>
                  ))}
                </ul>
              </div>

              <div className="subscription-actions">
                <button 
                  className="cancel-subscription-btn"
                  onClick={handleCancelSubscription}
                  disabled={loading}
                >
                  Cancel Subscription
                </button>
              </div>
            </div>
          ) : (
            <div className="subscription-offer">
              <div className="plan-selector">
                <div className="selector-buttons">
                  <button 
                    className={`selector-btn ${selectedPlan === 'pro' ? 'active' : ''}`}
                    onClick={() => setSelectedPlan('pro')}
                  >
                    Bitcoin Writer Pro
                  </button>
                  <button 
                    className={`selector-btn ${selectedPlan === 'tiered' ? 'active' : ''}`}
                    onClick={() => setSelectedPlan('tiered')}
                  >
                    Storage Plans
                  </button>
                </div>
              </div>

              {selectedPlan === 'tiered' ? (
                <div className="tiered-plans">
                  <div className="plans-grid">
                    {subscriptionPlans.map((plan) => (
                      <div key={plan.id} className={`plan-card ${plan.recommended ? 'recommended' : ''}`}>
                        {plan.recommended && <div className="recommended-badge">Recommended</div>}
                        <h4>{plan.name}</h4>
                        <div className="plan-price">
                          <span className="currency">{userCurrency === 'GBP' ? '£' : '$'}</span>
                          <span className="amount">{userCurrency === 'GBP' ? plan.priceGBP : plan.price}</span>
                          <span className="period">/{plan.interval}</span>
                        </div>
                        <p className="plan-description">{plan.description}</p>
                        <div className="plan-details">
                          <p><strong>BSV Amount:</strong> {(plan.bsvAmount / 100000000).toFixed(4)} BSV</p>
                          <p><strong>Est. Storage:</strong> {subscriptionService.calculateStorageCapacity(plan).description}</p>
                        </div>
                        <button 
                          className="subscribe-btn primary"
                          onClick={() => handleTieredSubscribe(plan.id)}
                          disabled={loading}
                        >
                          {loading ? 'Processing...' : 'Subscribe'}
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="pro-subscription-option">
              <div className="pricing-header">
                <div className="price-display">
                  <span className="currency">$</span>
                  <span className="amount">9.99</span>
                  <span className="period">/month</span>
                </div>
                <p className="price-description">Unlock all Pro features</p>
              </div>

              <div className="pro-features">
                <h4>Pro Features Include:</h4>
                <ul>
                  {proDetails.features.map((feature, index) => (
                    <li key={index}>✓ {feature}</li>
                  ))}
                </ul>
              </div>

              <div className="value-proposition">
                <div className="highlight-box">
                  <h4>🚀 Perfect for Professional Writers</h4>
                  <p>Get unlimited blockchain storage, advanced features, and priority support for less than the cost of a coffee per week!</p>
                </div>
              </div>

              {error && (
                <div className="error-message">
                  {error}
                </div>
              )}

              <div className="subscription-actions">
                <button 
                  className="subscribe-btn primary"
                  onClick={handleSubscribe}
                  disabled={loading}
                >
                  {loading ? 'Processing...' : 'Subscribe to Pro'}
                </button>
                <p className="billing-note">
                  Cancel anytime. No long-term commitment.
                </p>
              </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SubscriptionModal;