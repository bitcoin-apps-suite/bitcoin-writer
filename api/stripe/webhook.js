/**
 * Stripe Webhook Handler
 * Process payment and subscription events
 */

const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

const handleWebhook = async (req, res) => {
  const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;
  
  let event;

  try {
    const sig = req.headers['stripe-signature'];
    
    if (!endpointSecret) {
      console.warn('Stripe webhook secret not configured. Processing event without verification.');
      event = req.body;
    } else {
      event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
    }
  } catch (err) {
    console.error('Webhook signature verification failed:', err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  console.log('Received Stripe webhook event:', event.type);

  try {
    switch (event.type) {
      case 'checkout.session.completed':
        await handleCheckoutSessionCompleted(event.data.object);
        break;
        
      case 'payment_intent.succeeded':
        await handlePaymentSucceeded(event.data.object);
        break;
        
      case 'invoice.payment_succeeded':
        await handleSubscriptionPayment(event.data.object);
        break;
        
      case 'customer.subscription.created':
        await handleSubscriptionCreated(event.data.object);
        break;
        
      case 'customer.subscription.updated':
        await handleSubscriptionUpdated(event.data.object);
        break;
        
      case 'customer.subscription.deleted':
        await handleSubscriptionCanceled(event.data.object);
        break;
        
      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    res.json({ received: true });
  } catch (error) {
    console.error('Error processing webhook:', error);
    res.status(500).json({ error: 'Webhook processing failed' });
  }
};

/**
 * Handle successful checkout sessions
 */
async function handleCheckoutSessionCompleted(session) {
  console.log('Checkout session completed:', session.id);
  
  const { metadata } = session;
  if (!metadata || !metadata.handcash_handle) {
    console.error('Missing HandCash handle in session metadata');
    return;
  }

  if (metadata.product_type === 'pro_subscription') {
    console.log('Pro subscription checkout completed for:', metadata.handcash_handle);
    // TODO: Activate Pro features for user
    // TODO: Send welcome email
    // TODO: Update user database
  } else if (metadata.product_type === 'bsv_topup') {
    console.log('BSV top-up checkout completed for:', metadata.handcash_handle);
    // TODO: Add BSV balance to user account
    // TODO: Send confirmation email
  }
}

/**
 * Handle successful one-time payments (BSV top-ups)
 */
async function handlePaymentSucceeded(paymentIntent) {
  console.log('Payment succeeded:', paymentIntent.id);
  
  const { metadata } = paymentIntent;
  if (!metadata || !metadata.handcash_handle) {
    console.error('Missing HandCash handle in payment metadata');
    return;
  }

  if (metadata.product_type === 'bsv_topup') {
    const bsvSatoshis = parseInt(metadata.bsv_satoshis) || 0;
    const bonusSatoshis = parseInt(metadata.bonus_satoshis) || 0;
    const totalSatoshis = bsvSatoshis + bonusSatoshis;
    
    console.log('Adding BSV balance:', {
      handle: metadata.handcash_handle,
      satoshis: totalSatoshis,
      bonus: bonusSatoshis
    });
    
    // TODO: Add BSV balance to user's account
    // TODO: Record transaction in database
    // TODO: Send confirmation notification
  }
}

/**
 * Handle successful subscription payments (recurring)
 */
async function handleSubscriptionPayment(invoice) {
  console.log('Subscription payment succeeded:', invoice.id);
  
  if (invoice.subscription) {
    const subscription = await stripe.subscriptions.retrieve(invoice.subscription);
    
    if (subscription.metadata && subscription.metadata.handcash_handle) {
      console.log('Subscription renewed for:', subscription.metadata.handcash_handle);
      // TODO: Extend Pro subscription
      // TODO: Record payment in database
      // TODO: Send renewal confirmation
    }
  }
}

/**
 * Handle new subscription creation
 */
async function handleSubscriptionCreated(subscription) {
  console.log('Subscription created:', subscription.id);
  
  const { metadata } = subscription;
  if (!metadata || !metadata.handcash_handle) {
    console.error('Missing HandCash handle in subscription metadata');
    return;
  }

  if (metadata.product_type === 'pro_subscription') {
    console.log('Pro subscription activated for:', metadata.handcash_handle);
    // TODO: Activate Pro features
    // TODO: Update user status in database
    // TODO: Send welcome email with Pro features
  }
}

/**
 * Handle subscription updates (including cancellations)
 */
async function handleSubscriptionUpdated(subscription) {
  console.log('Subscription updated:', subscription.id, 'Status:', subscription.status);
  
  const { metadata } = subscription;
  if (!metadata || !metadata.handcash_handle) {
    console.error('Missing HandCash handle in subscription metadata');
    return;
  }

  if (subscription.cancel_at_period_end) {
    console.log('Subscription will be canceled at period end for:', metadata.handcash_handle);
    // TODO: Send cancellation confirmation
    // TODO: Schedule Pro feature deactivation
  }
}

/**
 * Handle subscription cancellation/deletion
 */
async function handleSubscriptionCanceled(subscription) {
  console.log('Subscription canceled:', subscription.id);
  
  const { metadata } = subscription;
  if (!metadata || !metadata.handcash_handle) {
    console.error('Missing HandCash handle in subscription metadata');
    return;
  }

  if (metadata.product_type === 'pro_subscription') {
    console.log('Pro subscription canceled for:', metadata.handcash_handle);
    // TODO: Deactivate Pro features
    // TODO: Update user status in database
    // TODO: Send cancellation confirmation
  }
}

module.exports = handleWebhook;