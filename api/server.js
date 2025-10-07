// Simple Express server for local API endpoints
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');

// Load environment variables from parent directory
dotenv.config({ path: path.resolve(__dirname, '../.env.local') });
dotenv.config({ path: path.resolve(__dirname, '../.env') });

const app = express();
const PORT = process.env.API_PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Import the HandCash profile handler
const handcashProfileHandler = require('./handcash-profile');

// Import the HandCash Items handler
const handcashItemsHandler = require('./handcash-items');

// Import Twitter routes
const twitterRoutes = require('./routes/twitter');

// Import Marketplace handler
const marketplaceHandler = require('./marketplace');

// Import Stripe handlers
const createCheckoutSession = require('./stripe/create-checkout-session');
const getSubscriptionStatus = require('./stripe/subscription-status');
const getBSVBalance = require('./stripe/bsv-balance');
const cancelSubscription = require('./stripe/cancel-subscription');
const handleWebhook = require('./stripe/webhook');

// Webhook endpoint needs raw body for signature verification
app.use('/api/stripe/webhook', express.raw({type: 'application/json'}));

// Routes
app.post('/api/handcash-profile', handcashProfileHandler);
app.post('/api/handcash-items', handcashItemsHandler);
app.post('/api/marketplace', marketplaceHandler);

// Twitter API routes
app.use('/api/twitter', twitterRoutes);

// Stripe API routes
app.post('/api/stripe/create-checkout-session', createCheckoutSession);
app.get('/api/stripe/subscription-status', getSubscriptionStatus);
app.get('/api/stripe/bsv-balance', getBSVBalance);
app.post('/api/stripe/cancel-subscription', cancelSubscription);
app.post('/api/stripe/webhook', handleWebhook);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'ok',
    handcash: {
      appId: process.env.REACT_APP_HANDCASH_APP_ID ? 'configured' : 'not configured',
      appSecret: process.env.REACT_APP_HANDCASH_APP_SECRET ? 'configured' : 'not configured'
    },
    stripe: {
      publishableKey: process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY ? 'configured' : 'not configured',
      secretKey: process.env.STRIPE_SECRET_KEY ? 'configured' : 'not configured',
      webhookSecret: process.env.STRIPE_WEBHOOK_SECRET ? 'configured' : 'not configured'
    }
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`API server running on http://localhost:${PORT}`);
  console.log('HandCash App ID:', process.env.REACT_APP_HANDCASH_APP_ID ? 'Configured' : 'NOT CONFIGURED');
  console.log('HandCash App Secret:', process.env.REACT_APP_HANDCASH_APP_SECRET ? 'Configured' : 'NOT CONFIGURED');
});