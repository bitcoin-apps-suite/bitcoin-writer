/**
 * Cancel Subscription Handler
 * Cancel Bitcoin Writer Pro subscription
 */

const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

const cancelSubscription = async (req, res) => {
  try {
    const { subscriptionId } = req.body;

    if (!subscriptionId) {
      return res.status(400).json({
        error: 'Subscription ID is required'
      });
    }

    // Cancel the subscription at the end of the current period
    const canceledSubscription = await stripe.subscriptions.update(subscriptionId, {
      cancel_at_period_end: true,
      metadata: {
        ...req.body.metadata,
        canceled_at: new Date().toISOString(),
        canceled_reason: 'user_requested'
      }
    });

    console.log('Subscription canceled:', {
      subscriptionId,
      cancelAtPeriodEnd: canceledSubscription.cancel_at_period_end,
      currentPeriodEnd: new Date(canceledSubscription.current_period_end * 1000)
    });

    res.json({
      success: true,
      subscription: {
        id: canceledSubscription.id,
        status: canceledSubscription.status,
        cancelAtPeriodEnd: canceledSubscription.cancel_at_period_end,
        currentPeriodEnd: new Date(canceledSubscription.current_period_end * 1000)
      }
    });

  } catch (error) {
    console.error('Error canceling subscription:', error);
    
    if (error.type === 'StripeInvalidRequestError') {
      return res.status(400).json({
        error: 'Invalid subscription ID'
      });
    }

    res.status(500).json({
      error: 'Failed to cancel subscription'
    });
  }
};

module.exports = cancelSubscription;