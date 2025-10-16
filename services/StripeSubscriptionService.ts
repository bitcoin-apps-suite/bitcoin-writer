/**
 * Stripe Subscription Service for BSV Top-up Subscriptions
 * Handles automatic top-ups to maintain user's blockchain storage balance
 */

import { loadStripe, Stripe } from '@stripe/stripe-js';

export interface SubscriptionPlan {
  id: string;
  name: string;
  description: string;
  price: number; // USD amount
  priceGBP: number; // GBP amount
  bsvAmount: number; // BSV satoshis equivalent 
  interval: 'month' | 'week';
  priceId: string; // USD Stripe price ID
  priceIdGBP: string; // GBP Stripe price ID
  recommended?: boolean;
}

export interface UserSubscription {
  id: string;
  planId: string;
  status: 'active' | 'inactive' | 'past_due' | 'canceled';
  currentPeriodEnd: Date;
  nextTopupAmount: number;
  totalTopups: number;
}

export interface SubscriptionResponse {
  success: boolean;
  subscriptionId?: string;
  clientSecret?: string;
  error?: string;
}

export class StripeSubscriptionService {
  private stripe: Stripe | null = null;
  private readonly STRIPE_PUBLISHABLE_KEY = process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY || '';
  private userCurrency: 'USD' | 'GBP' = 'USD';
  
  // Predefined subscription plans for BSV top-ups
  private readonly SUBSCRIPTION_PLANS: SubscriptionPlan[] = [
    {
      id: 'starter',
      name: 'Starter Writer',
      description: 'Perfect for occasional blockchain storage',
      price: 5,
      priceGBP: 4.99,
      bsvAmount: 500000, // ~$5 worth of satoshis
      interval: 'month',
      priceId: 'price_1SFXaNK3jRGhq0emG99pDpEh',
      priceIdGBP: 'price_1SFXoXK3jRGhq0emzbuJENKe',
      recommended: false
    },
    {
      id: 'regular',
      name: 'Regular Writer',
      description: 'For regular document publishing',
      price: 15,
      priceGBP: 11.99,
      bsvAmount: 1500000, // ~$15 worth of satoshis
      interval: 'month',
      priceId: 'price_1SFXl1K3jRGhq0emBdVdDeTd',
      priceIdGBP: 'price_1SFXoYK3jRGhq0emzBMG4rpy',
      recommended: true
    },
    {
      id: 'pro',
      name: 'Professional Writer',
      description: 'For heavy blockchain publishing',
      price: 50,
      priceGBP: 39.99,
      bsvAmount: 5000000, // ~$50 worth of satoshis
      interval: 'month',
      priceId: 'price_1SFXayK3jRGhq0emV2meBDzR',
      priceIdGBP: 'price_1SFXoYK3jRGhq0emolJFORAe',
      recommended: false
    },
    {
      id: 'weekly_boost',
      name: 'Weekly Boost',
      description: 'Quick weekly top-ups',
      price: 10,
      priceGBP: 7.99,
      bsvAmount: 1000000, // ~$10 worth of satoshis
      interval: 'week',
      priceId: 'price_1SFXbjK3jRGhq0em68Vk9Dsr',
      priceIdGBP: 'price_1SFXoYK3jRGhq0emcjGh6JDW',
      recommended: false
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
   * Get the appropriate price ID based on user's currency
   */
  private getPriceId(plan: SubscriptionPlan): string {
    return this.userCurrency === 'GBP' ? plan.priceIdGBP : plan.priceId;
  }

  /**
   * Get the appropriate price based on user's currency
   */
  private getPrice(plan: SubscriptionPlan): number {
    return this.userCurrency === 'GBP' ? plan.priceGBP : plan.price;
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
   * Get all available subscription plans
   */
  getSubscriptionPlans(): SubscriptionPlan[] {
    return this.SUBSCRIPTION_PLANS;
  }

  /**
   * Get a specific subscription plan by ID
   */
  getSubscriptionPlan(planId: string): SubscriptionPlan | null {
    return this.SUBSCRIPTION_PLANS.find(plan => plan.id === planId) || null;
  }

  /**
   * Create a new subscription
   */
  async createSubscription(
    planId: string, 
    userEmail: string,
    handcashHandle: string
  ): Promise<SubscriptionResponse> {
    const plan = this.getSubscriptionPlan(planId);
    if (!plan) {
      return { success: false, error: 'Invalid subscription plan' };
    }

    try {
      // Call backend API to create subscription
      const response = await fetch('/api/stripe/create-subscription', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          priceId: this.getPriceId(plan),
          userEmail,
          handcashHandle,
          planDetails: plan,
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
      console.error('Error creating subscription:', error);
      return { success: false, error: 'Network error' };
    }
  }

  /**
   * Redirect to Stripe Checkout for subscription
   */
  async redirectToCheckout(planId: string, userEmail: string, handcashHandle: string): Promise<void> {
    if (!this.stripe) {
      throw new Error('Stripe not initialized');
    }

    const plan = this.getSubscriptionPlan(planId);
    if (!plan) {
      throw new Error('Invalid subscription plan');
    }

    try {
      // Create checkout session via backend
      const response = await fetch('/api/stripe/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          priceId: this.getPriceId(plan),
          userEmail,
          handcashHandle,
          planDetails: plan,
          currency: this.userCurrency,
          successUrl: `${window.location.origin}/subscription/success`,
          cancelUrl: `${window.location.origin}/subscription/cancel`
        }),
      });

      const { sessionId } = await response.json();

      // Redirect to Stripe Checkout
      const result = await (this.stripe as any)!.redirectToCheckout({
        sessionId,
      });

      if (result.error) {
        throw new Error(result.error.message);
      }
    } catch (error) {
      console.error('Error redirecting to checkout:', error);
      throw error;
    }
  }

  /**
   * Get user's current subscriptions
   */
  async getUserSubscriptions(handcashHandle: string): Promise<UserSubscription[]> {
    try {
      const response = await fetch(`/api/stripe/subscriptions?handle=${handcashHandle}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch subscriptions');
      }

      const data = await response.json();
      return data.subscriptions || [];
    } catch (error) {
      console.error('Error fetching subscriptions:', error);
      return [];
    }
  }

  /**
   * Cancel a subscription
   */
  async cancelSubscription(subscriptionId: string): Promise<boolean> {
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
   * Update subscription plan
   */
  async updateSubscription(subscriptionId: string, newPlanId: string): Promise<boolean> {
    const newPlan = this.getSubscriptionPlan(newPlanId);
    if (!newPlan) {
      return false;
    }

    try {
      const response = await fetch('/api/stripe/update-subscription', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          subscriptionId,
          newPriceId: newPlan.priceId
        }),
      });

      return response.ok;
    } catch (error) {
      console.error('Error updating subscription:', error);
      return false;
    }
  }

  /**
   * Get subscription usage/analytics
   */
  async getSubscriptionAnalytics(handcashHandle: string): Promise<{
    totalSpent: number;
    totalTopups: number;
    averageMonthlyUsage: number;
    currentBalance: number;
  }> {
    try {
      const response = await fetch(`/api/stripe/analytics?handle=${handcashHandle}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch analytics');
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching analytics:', error);
      return {
        totalSpent: 0,
        totalTopups: 0,
        averageMonthlyUsage: 0,
        currentBalance: 0
      };
    }
  }

  /**
   * Calculate estimated storage capacity for a plan
   */
  calculateStorageCapacity(plan: SubscriptionPlan): {
    documentsPerMonth: number;
    totalStorageKB: number;
    description: string;
  } {
    // Rough estimates based on average document storage costs
    const costPerDocument = 0.00001; // $0.00001 per typical document
    const documentsPerMonth = Math.floor(plan.price / costPerDocument);
    const totalStorageKB = Math.floor(plan.bsvAmount / 1000); // Rough KB estimation

    let description = '';
    if (documentsPerMonth < 100) {
      description = 'Perfect for personal writing';
    } else if (documentsPerMonth < 500) {
      description = 'Great for regular publishing';
    } else {
      description = 'Ideal for professional publishing';
    }

    return {
      documentsPerMonth,
      totalStorageKB,
      description
    };
  }
}

export default StripeSubscriptionService;