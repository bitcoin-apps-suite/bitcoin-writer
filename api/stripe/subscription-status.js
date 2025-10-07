/**
 * Stripe Subscription Status Handler
 * Get Bitcoin Writer Pro subscription status for a user
 */

const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

const getSubscriptionStatus = async (req, res) => {
  try {
    const { handle } = req.query;

    if (!handle) {
      return res.status(400).json({
        error: 'HandCash handle is required'
      });
    }

    // Search for customer by metadata
    const customers = await stripe.customers.list({
      limit: 100,
      expand: ['data.subscriptions']
    });

    let userSubscription = null;

    for (const customer of customers.data) {
      // Check customer email or metadata for handcash handle
      if (customer.email && customer.email.includes(handle)) {
        // Look for active Pro subscriptions
        const activeSubscriptions = customer.subscriptions.data.filter(
          sub => sub.status === 'active' && 
                 sub.metadata && 
                 sub.metadata.product_type === 'pro_subscription'
        );

        if (activeSubscriptions.length > 0) {
          const subscription = activeSubscriptions[0];
          userSubscription = {
            id: subscription.id,
            status: subscription.status,
            currentPeriodStart: new Date(subscription.current_period_start * 1000),
            currentPeriodEnd: new Date(subscription.current_period_end * 1000),
            price: 9.99, // Bitcoin Writer Pro price
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
          break;
        }
      }
    }

    // Alternative search by subscription metadata
    if (!userSubscription) {
      const subscriptions = await stripe.subscriptions.list({
        limit: 100,
        status: 'active'
      });

      for (const subscription of subscriptions.data) {
        if (subscription.metadata && 
            subscription.metadata.handcash_handle === handle &&
            subscription.metadata.product_type === 'pro_subscription') {
          
          userSubscription = {
            id: subscription.id,
            status: subscription.status,
            currentPeriodStart: new Date(subscription.current_period_start * 1000),
            currentPeriodEnd: new Date(subscription.current_period_end * 1000),
            price: 9.99,
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
          break;
        }
      }
    }

    res.json({
      subscription: userSubscription
    });

  } catch (error) {
    console.error('Error fetching subscription status:', error);
    res.status(500).json({
      error: 'Failed to fetch subscription status'
    });
  }
};

module.exports = getSubscriptionStatus;