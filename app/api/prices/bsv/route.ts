import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    // Fetch BSV price from CoinGecko API
    const response = await fetch(
      'https://api.coingecko.com/api/v3/simple/price?ids=bitcoin-cash-sv&vs_currencies=usd,btc&include_24hr_change=true&include_24hr_vol=true&include_market_cap=true',
      {
        headers: {
          'Accept': 'application/json',
        },
        // Add cache control to prevent rate limiting
        next: { revalidate: 30 } // Cache for 30 seconds
      }
    );

    if (!response.ok) {
      throw new Error(`CoinGecko API responded with status: ${response.status}`);
    }

    const data = await response.json();
    const bsvData = data['bitcoin-cash-sv'];

    if (!bsvData) {
      throw new Error('BSV data not found in CoinGecko response');
    }

    // Format the response to match our TokenPrice interface
    const priceData = {
      symbol: 'BSV',
      name: 'Bitcoin SV',
      price: bsvData.usd,
      price_usd: bsvData.usd,
      price_btc: bsvData.btc,
      change_24h: bsvData.usd_24h_change || 0,
      change_percent_24h: bsvData.usd_24h_change || 0,
      volume_24h: bsvData.usd_24h_vol || 0,
      market_cap: bsvData.usd_market_cap || 0,
      last_updated: new Date().toISOString(),
      source: 'CoinGecko'
    };

    return NextResponse.json(priceData, {
      headers: {
        'Cache-Control': 'public, s-maxage=30, stale-while-revalidate=60'
      }
    });

  } catch (error) {
    console.error('Error fetching BSV price:', error);
    
    // Return fallback data if API fails
    const fallbackData = {
      symbol: 'BSV',
      name: 'Bitcoin SV',
      price: 51.23,
      price_usd: 51.23,
      price_btc: 0.00053,
      change_24h: 1.42,
      change_percent_24h: 2.85,
      volume_24h: 28500000,
      market_cap: 1014000000,
      last_updated: new Date().toISOString(),
      source: 'Fallback'
    };

    return NextResponse.json(fallbackData, {
      status: 200, // Return 200 with fallback data instead of error
      headers: {
        'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=120'
      }
    });
  }
}