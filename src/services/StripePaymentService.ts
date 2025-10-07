/**
 * Stripe Payment Service for Bitcoin Writer
 * Handles both:
 * 1. $9.99/month Bitcoin Writer Pro subscription
 * 2. One-time BSV balance top-up payments
 */

import { loadStripe, Stripe } from '@stripe/stripe-js';

export interface ProSubscription {
  id: string;
  status: 'active' | 'inactive' | 'past_due' | 'canceled';
  currentPeriodStart: Date;
  currentPeriodEnd: Date;
  price: number;
  features: string[];
}

export interface TopUpOption {
  id: string;
  name: string;
  usdAmount: number;
  bsvSatoshis: number;
  bonus?: number; // Extra satoshis bonus
  popular?: boolean;
}

export interface TopUpResult {
  success: boolean;
  paymentIntentId?: string;
  clientSecret?: string;
  error?: string;
}

export interface SubscriptionResult {
  success: boolean;
  subscriptionId?: string;
  clientSecret?: string;
  error?: string;
}

export class StripePaymentService {
  private stripe: Stripe | null = null;
  private readonly STRIPE_PUBLISHABLE_KEY = process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY || '';
  private userCurrency: 'USD' | 'GBP' = 'USD';
  
  // Bitcoin Writer Pro subscription
  private readonly PRO_SUBSCRIPTION = {
    priceId: 'price_1SFXZiK3jRGhq0emFQQzhLK6',
    priceIdGBP: 'price_1SFXoXK3jRGhq0emBceGTf05',
    name: 'Bitcoin Writer Pro',
    price: 9.99,
    priceGBP: 7.99,
    interval: 'month',
    features: [
      'Unlimited blockchain storage',
      'Advanced encryption options',
      'Priority support',
      'Export to multiple formats',
      'NFT minting capabilities',
      'Document monetization',
      'Advanced analytics'
    ]
  };

  // BSV Top-up options (one-time payments)
  private readonly TOP_UP_OPTIONS: TopUpOption[] = [
    {
      id: 'micro',
      name: 'Micro Top-up',
      usdAmount: 5,
      bsvSatoshis: 500000,
      bonus: 0
    },
    {
      id: 'small',
      name: 'Small Top-up',
      usdAmount: 10,
      bsvSatoshis: 1000000,
      bonus: 50000 // 5% bonus
    },
    {
      id: 'medium',
      name: 'Medium Top-up',
      usdAmount: 25,
      bsvSatoshis: 2500000,
      bonus: 250000, // 10% bonus
      popular: true
    },
    {
      id: 'large',
      name: 'Large Top-up',
      usdAmount: 50,
      bsvSatoshis: 5000000,
      bonus: 750000 // 15% bonus
    },
    {
      id: 'mega',
      name: 'Mega Top-up',
      usdAmount: 100,
      bsvSatoshis: 10000000,
      bonus: 2000000 // 20% bonus
    }
  ];

  constructor() {
    this.initializeStripe();
    this.detectUserCurrency();
  }

  private async initializeStripe(): Promise<void> {
    if (!this.STRIPE_PUBLISHABLE_KEY) {
      console.error('Stripe publishable key not found');
      return;
    }

    try {
      this.stripe = await loadStripe(this.STRIPE_PUBLISHABLE_KEY);
    } catch (error) {
      console.error('Failed to initialize Stripe:', error);
    }
  }

  /**
   * Detect user's currency based on location/timezone
   */
  private detectUserCurrency(): void {
    try {
      const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
      const locale = navigator.language || 'en-US';
      
      // Check for UK/Ireland timezone or locale
      if (timezone.includes('London') || timezone.includes('Dublin') || 
          locale.startsWith('en-GB') || locale.startsWith('en-IE')) {
        this.userCurrency = 'GBP';
      } else {
        this.userCurrency = 'USD';
      }
    } catch (error) {
      console.warn('Could not detect currency, defaulting to USD:', error);
      this.userCurrency = 'USD';
    }
  }

  /**
   * Get the appropriate Pro subscription price ID based on user's currency
   */
  private getProPriceId(): string {
    return this.userCurrency === 'GBP' ? this.PRO_SUBSCRIPTION.priceIdGBP : this.PRO_SUBSCRIPTION.priceId;
  }

  /**
   * Get the appropriate Pro subscription price based on user's currency
   */
  private getProPrice(): number {
    return this.userCurrency === 'GBP' ? this.PRO_SUBSCRIPTION.priceGBP : this.PRO_SUBSCRIPTION.price;
  }

  /**
   * Get user's current currency
   */
  getUserCurrency(): 'USD' | 'GBP' {
    return this.userCurrency;
  }

  /**
   * Set user's currency manually
   */
  setUserCurrency(currency: 'USD' | 'GBP'): void {
    this.userCurrency = currency;
  }

  /**
   * Get Bitcoin Writer Pro subscription details
   */
  getProSubscriptionDetails() {
    return this.PRO_SUBSCRIPTION;
  }

  /**
   * Get all BSV top-up options
   */
  getTopUpOptions(): TopUpOption[] {
    return this.TOP_UP_OPTIONS;
  }

  /**
   * Get specific top-up option
   */
  getTopUpOption(id: string): TopUpOption | null {
    return this.TOP_UP_OPTIONS.find(option => option.id === id) || null;
  }

  /**
   * Create Bitcoin Writer Pro subscription
   */
  async createProSubscription(
    userEmail: string,
    handcashHandle: string
  ): Promise<SubscriptionResult> {
    try {
      const response = await fetch('/api/stripe/create-subscription', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          priceId: this.getProPriceId(),
          userEmail,
          handcashHandle,
          productType: 'pro_subscription',
          currency: this.userCurrency
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        return { success: false, error: data.error || 'Failed to create subscription' };
      }

      return {
        success: true,
        subscriptionId: data.subscriptionId,
        clientSecret: data.clientSecret
      };
    } catch (error) {
      console.error('Error creating Pro subscription:', error);
      return { success: false, error: 'Network error' };
    }
  }

  /**
   * Create one-time BSV top-up payment
   */
  async createTopUpPayment(
    topUpId: string,
    userEmail: string,
    handcashHandle: string
  ): Promise<TopUpResult> {
    const topUpOption = this.getTopUpOption(topUpId);
    if (!topUpOption) {
      return { success: false, error: 'Invalid top-up option' };
    }

    try {
      const response = await fetch('/api/stripe/create-payment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount: topUpOption.usdAmount * 100, // Stripe uses cents
          currency: 'usd',
          userEmail,
          handcashHandle,
          topUpOption,
          productType: 'bsv_topup'
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        return { success: false, error: data.error || 'Failed to create payment' };
      }

      return {
        success: true,
        paymentIntentId: data.paymentIntentId,
        clientSecret: data.clientSecret
      };
    } catch (error) {
      console.error('Error creating top-up payment:', error);
      return { success: false, error: 'Network error' };
    }
  }

  /**
   * Redirect to Stripe Checkout for Pro subscription
   */
  async redirectToProSubscriptionCheckout(
    userEmail: string, 
    handcashHandle: string
  ): Promise<void> {
    if (!this.stripe) {
      throw new Error('Stripe not initialized');
    }

    try {
      const response = await fetch('/api/stripe/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          priceId: this.getProPriceId(),
          userEmail,
          handcashHandle,
          mode: 'subscription',
          productType: 'pro_subscription',
          currency: this.userCurrency,
          successUrl: `${window.location.origin}/subscription/success`,
          cancelUrl: `${window.location.origin}/subscription/cancel`
        }),
      });

      const { sessionId } = await response.json();

      const { error } = await (this.stripe as any)!.redirectToCheckout({
        sessionId,
      });

      if (error) {
        throw new Error(error.message);
      }
    } catch (error) {
      console.error('Error redirecting to Pro subscription checkout:', error);
      throw error;
    }
  }

  /**
   * Redirect to Stripe Checkout for BSV top-up
   */
  async redirectToTopUpCheckout(
    topUpId: string,
    userEmail: string, 
    handcashHandle: string
  ): Promise<void> {
    if (!this.stripe) {
      throw new Error('Stripe not initialized');
    }

    const topUpOption = this.getTopUpOption(topUpId);
    if (!topUpOption) {
      throw new Error('Invalid top-up option');
    }

    try {
      const response = await fetch('/api/stripe/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount: topUpOption.usdAmount * 100,
          currency: 'usd',
          userEmail,
          handcashHandle,
          mode: 'payment',
          topUpOption,
          productType: 'bsv_topup',
          successUrl: `${window.location.origin}/topup/success`,
          cancelUrl: `${window.location.origin}/topup/cancel`
        }),
      });

      const { sessionId } = await response.json();

      const { error } = await (this.stripe as any)!.redirectToCheckout({
        sessionId,
      });

      if (error) {
        throw new Error(error.message);
      }
    } catch (error) {
      console.error('Error redirecting to top-up checkout:', error);
      throw error;
    }
  }

  /**
   * Get user's Pro subscription status
   */
  async getProSubscriptionStatus(handcashHandle: string): Promise<ProSubscription | null> {
    try {
      const response = await fetch(`/api/stripe/subscription-status?handle=${handcashHandle}`);
      
      if (!response.ok) {
        return null;
      }

      const data = await response.json();
      return data.subscription || null;
    } catch (error) {
      console.error('Error fetching subscription status:', error);
      return null;
    }
  }

  /**
   * Get user's BSV balance and top-up history
   */
  async getBSVBalance(handcashHandle: string): Promise<{
    currentBalance: number;
    totalTopUps: number;
    recentTopUps: Array<{
      amount: number;
      date: Date;
      status: string;
    }>;
  }> {
    try {
      const response = await fetch(`/api/stripe/bsv-balance?handle=${handcashHandle}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch BSV balance');
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching BSV balance:', error);
      return {
        currentBalance: 0,
        totalTopUps: 0,
        recentTopUps: []
      };
    }
  }

  /**
   * Cancel Pro subscription
   */
  async cancelProSubscription(subscriptionId: string): Promise<boolean> {
    try {
      const response = await fetch('/api/stripe/cancel-subscription', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ subscriptionId }),
      });

      return response.ok;
    } catch (error) {
      console.error('Error canceling subscription:', error);
      return false;
    }
  }

  /**
   * Calculate estimated storage capacity for different amounts
   */
  calculateStorageEstimate(satoshis: number): {
    estimatedDocuments: number;
    estimatedKB: number;
    description: string;
  } {
    // Rough estimates based on average costs
    const avgCostPerDocument = 10000; // 10k satoshis per typical document
    const estimatedDocuments = Math.floor(satoshis / avgCostPerDocument);
    const estimatedKB = Math.floor(satoshis / 100); // Very rough estimate

    let description = '';
    if (estimatedDocuments < 10) {
      description = 'Good for small documents';
    } else if (estimatedDocuments < 50) {
      description = 'Perfect for regular use';
    } else if (estimatedDocuments < 200) {
      description = 'Great for heavy publishing';
    } else {
      description = 'Ideal for professional use';
    }

    return {
      estimatedDocuments,
      estimatedKB,
      description
    };
  }
}

export default StripePaymentService;