import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    // Try to fetch BWRITER token price from 1sat market API
    // First, we need to find the BWRITER token contract/ticker on 1sat
    
    // Note: This is a placeholder implementation since we need the actual token contract ID
    // In production, this would fetch from the real 1sat market API with the deployed BWRITER token
    
    const response = await fetch('https://api.1sat.market/api/v1/tokens/search?q=BWRITER', {
      headers: {
        'Accept': 'application/json',
      },
      next: { revalidate: 30 }
    });

    let priceData;

    if (response.ok) {
      const data = await response.json();
      
      // Check if BWRITER token exists in the response
      const bwriterToken = data.tokens?.find((token: any) => 
        token.symbol === 'BWRITER' || token.name?.toLowerCase().includes('bitcoin writer')
      );

      if (bwriterToken) {
        priceData = {
          symbol: 'BWRITER',
          name: 'Bitcoin Writer Token',
          price: bwriterToken.price || 0.0234,
          price_usd: bwriterToken.price_usd || 0.0234,
          change_24h: bwriterToken.change_24h || 0.0018,
          change_percent_24h: bwriterToken.change_percent_24h || 8.33,
          volume_24h: bwriterToken.volume_24h || 125000,
          market_cap: bwriterToken.market_cap || 234000,
          last_updated: new Date().toISOString(),
          source: '1sat Market'
        };
      }
    }

    // If no real data found, use demo data with realistic fluctuations
    if (!priceData) {
      const basePrice = 0.0234;
      const fluctuation = (Math.random() - 0.5) * 0.002; // ±0.1% random fluctuation
      const currentPrice = basePrice + fluctuation;
      const change24h = fluctuation * 10; // Amplify for 24h change
      
      priceData = {
        symbol: 'BWRITER',
        name: 'Bitcoin Writer Token',
        price: currentPrice,
        price_usd: currentPrice,
        change_24h: change24h,
        change_percent_24h: (change24h / basePrice) * 100,
        volume_24h: 125000 + Math.floor(Math.random() * 50000), // Random volume 125k-175k
        market_cap: currentPrice * 10000000, // Assuming 10M total supply
        last_updated: new Date().toISOString(),
        source: 'Demo Data'
      };
    }

    return NextResponse.json(priceData, {
      headers: {
        'Cache-Control': 'public, s-maxage=30, stale-while-revalidate=60'
      }
    });

  } catch (error) {
    console.error('Error fetching BWRITER price:', error);
    
    // Return fallback data if all methods fail
    const fallbackData = {
      symbol: 'BWRITER',
      name: 'Bitcoin Writer Token',
      price: 0.0234,
      price_usd: 0.0234,
      change_24h: 0.0018,
      change_percent_24h: 8.33,
      volume_24h: 125000,
      market_cap: 234000,
      last_updated: new Date().toISOString(),
      source: 'Fallback'
    };

    return NextResponse.json(fallbackData, {
      status: 200,
      headers: {
        'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=120'
      }
    });
  }
}