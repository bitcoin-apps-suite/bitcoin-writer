/**
 * BSV Balance Handler
 * Get user's BSV balance and top-up history
 */

const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

const getBSVBalance = async (req, res) => {
  try {
    const { handle } = req.query;

    if (!handle) {
      return res.status(400).json({
        error: 'HandCash handle is required'
      });
    }

    // Search for successful BSV top-up payments
    const paymentIntents = await stripe.paymentIntents.list({
      limit: 100,
      created: {
        gte: Math.floor(Date.now() / 1000) - (365 * 24 * 60 * 60) // Last year
      }
    });

    let currentBalance = 0;
    let totalTopUps = 0;
    const recentTopUps = [];

    // Filter payments for this HandCash handle
    for (const payment of paymentIntents.data) {
      if (payment.status === 'succeeded' && 
          payment.metadata && 
          payment.metadata.handcash_handle === handle &&
          payment.metadata.product_type === 'bsv_topup') {
        
        const bsvSatoshis = parseInt(payment.metadata.bsv_satoshis) || 0;
        const bonusSatoshis = parseInt(payment.metadata.bonus_satoshis) || 0;
        const totalSatoshis = bsvSatoshis + bonusSatoshis;
        
        currentBalance += totalSatoshis;
        totalTopUps += payment.amount / 100; // Convert from cents to dollars

        recentTopUps.push({
          amount: totalSatoshis,
          usdAmount: payment.amount / 100,
          date: new Date(payment.created * 1000),
          status: payment.status,
          topUpId: payment.metadata.top_up_id || 'unknown'
        });
      }
    }

    // Also check for checkout sessions that might have completed recently
    const checkoutSessions = await stripe.checkout.sessions.list({
      limit: 50,
      created: {
        gte: Math.floor(Date.now() / 1000) - (30 * 24 * 60 * 60) // Last 30 days
      }
    });

    for (const session of checkoutSessions.data) {
      if (session.payment_status === 'paid' &&
          session.metadata &&
          session.metadata.handcash_handle === handle &&
          session.metadata.product_type === 'bsv_topup') {
        
        // Get the payment intent to get the BSV amount
        if (session.payment_intent) {
          try {
            const paymentIntent = await stripe.paymentIntents.retrieve(session.payment_intent);
            if (paymentIntent.metadata && 
                paymentIntent.metadata.bsv_satoshis && 
                !paymentIntents.data.find(p => p.id === paymentIntent.id)) {
              
              const bsvSatoshis = parseInt(paymentIntent.metadata.bsv_satoshis) || 0;
              const bonusSatoshis = parseInt(paymentIntent.metadata.bonus_satoshis) || 0;
              const totalSatoshis = bsvSatoshis + bonusSatoshis;
              
              currentBalance += totalSatoshis;
              totalTopUps += session.amount_total / 100;
              
              recentTopUps.push({
                amount: totalSatoshis,
                usdAmount: session.amount_total / 100,
                date: new Date(session.created * 1000),
                status: 'completed',
                topUpId: paymentIntent.metadata.top_up_id || 'unknown'
              });
            }
          } catch (error) {
            console.error('Error retrieving payment intent:', error);
          }
        }
      }
    }

    // Sort recent top-ups by date (newest first)
    recentTopUps.sort((a, b) => b.date - a.date);

    // TODO: In a real implementation, you would also subtract any BSV spent
    // on blockchain storage operations. For now, we just return the accumulated top-ups.

    console.log('BSV balance calculated for', handle, {
      currentBalance,
      totalTopUps,
      recentTopUpsCount: recentTopUps.length
    });

    res.json({
      currentBalance,
      totalTopUps,
      recentTopUps: recentTopUps.slice(0, 10) // Return last 10 top-ups
    });

  } catch (error) {
    console.error('Error fetching BSV balance:', error);
    res.status(500).json({
      error: 'Failed to fetch BSV balance'
    });
  }
};

module.exports = getBSVBalance;