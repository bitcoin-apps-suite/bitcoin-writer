/**
 * Stripe Checkout Session Handler
 * Handles both Pro subscriptions and BSV top-up payments
 */

const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

const createCheckoutSession = async (req, res) => {
  try {
    const {
      priceId,
      userEmail,
      handcashHandle,
      mode = 'subscription',
      topUpOption,
      productType,
      successUrl,
      cancelUrl,
      amount,
      currency = 'usd'
    } = req.body;

    if (!userEmail || !handcashHandle) {
      return res.status(400).json({
        error: 'User email and HandCash handle are required'
      });
    }

    let sessionConfig = {
      payment_method_types: ['card'],
      customer_email: userEmail,
      client_reference_id: handcashHandle,
      success_url: successUrl || `${req.headers.origin}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: cancelUrl || `${req.headers.origin}/cancel`,
      metadata: {
        handcash_handle: handcashHandle,
        product_type: productType,
        user_email: userEmail
      }
    };

    if (mode === 'subscription') {
      // Bitcoin Writer Pro subscription
      if (!priceId) {
        return res.status(400).json({
          error: 'Price ID is required for subscriptions'
        });
      }

      sessionConfig = {
        ...sessionConfig,
        mode: 'subscription',
        line_items: [{
          price: priceId,
          quantity: 1,
        }],
        subscription_data: {
          metadata: {
            handcash_handle: handcashHandle,
            product_type: 'pro_subscription'
          }
        }
      };
    } else if (mode === 'payment') {
      // BSV Top-up one-time payment
      if (!amount || !topUpOption) {
        return res.status(400).json({
          error: 'Amount and top-up option are required for payments'
        });
      }

      sessionConfig = {
        ...sessionConfig,
        mode: 'payment',
        line_items: [{
          price_data: {
            currency: currency,
            product_data: {
              name: topUpOption.name,
              description: `Add ${(topUpOption.bsvSatoshis / 1000000).toFixed(1)}M satoshis to your Bitcoin Writer balance${topUpOption.bonus ? ` + ${(topUpOption.bonus / 1000000).toFixed(1)}M bonus!` : ''}`,
              metadata: {
                bsv_satoshis: topUpOption.bsvSatoshis.toString(),
                bonus_satoshis: (topUpOption.bonus || 0).toString(),
                top_up_id: topUpOption.id
              }
            },
            unit_amount: amount,
          },
          quantity: 1,
        }],
        payment_intent_data: {
          metadata: {
            handcash_handle: handcashHandle,
            product_type: 'bsv_topup',
            bsv_satoshis: topUpOption.bsvSatoshis.toString(),
            bonus_satoshis: (topUpOption.bonus || 0).toString(),
            top_up_id: topUpOption.id
          }
        }
      };
    } else {
      return res.status(400).json({
        error: 'Invalid mode. Must be "subscription" or "payment"'
      });
    }

    const session = await stripe.checkout.sessions.create(sessionConfig);

    console.log('Checkout session created:', {
      sessionId: session.id,
      mode,
      productType,
      handcashHandle,
      userEmail
    });

    res.json({
      sessionId: session.id,
      url: session.url
    });

  } catch (error) {
    console.error('Error creating checkout session:', error);
    res.status(500).json({
      error: error.message || 'Failed to create checkout session'
    });
  }
};

module.exports = createCheckoutSession;