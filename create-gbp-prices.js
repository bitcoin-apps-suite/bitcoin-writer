require('dotenv').config({ path: './.env.local' });
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

async function createGBPPrices() {
  console.log('🇬🇧 Creating GBP prices for existing products...\n');
  
  // Your existing products with USD prices
  const products = [
    { id: 'prod_TBvQrTje1v0oEi', name: 'Bitcoin Writer Pro', usd: 9.99, gbp: 7.99, interval: 'month' },
    { id: 'prod_TBvRhvoZWtwSUM', name: 'Starter Writer', usd: 5.00, gbp: 4.99, interval: 'month' },
    { id: 'prod_TBvcuHgYqmeQYt', name: 'Regular Writer', usd: 15.00, gbp: 11.99, interval: 'month' },
    { id: 'prod_TBvRzhv76vTGC8', name: 'Professional Writer', usd: 50.00, gbp: 39.99, interval: 'month' },
    { id: 'prod_TBvSLMeYSqwGf7', name: 'Weekly Boost', usd: 10.00, gbp: 7.99, interval: 'week' }
  ];
  
  try {
    for (const product of products) {
      console.log(`Creating GBP price for ${product.name}...`);
      
      const gbpPrice = await stripe.prices.create({
        product: product.id,
        unit_amount: Math.round(product.gbp * 100), // Convert to pence
        currency: 'gbp',
        recurring: {
          interval: product.interval
        }
      });
      
      console.log(`✅ ${product.name}: £${product.gbp}/${product.interval} (${gbpPrice.id})`);
    }
    
    console.log('\n🎉 All GBP prices created!');
    console.log('\n💡 Next: Update your frontend to detect user location and show appropriate currency');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

createGBPPrices();