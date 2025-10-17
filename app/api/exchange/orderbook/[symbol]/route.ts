import { NextRequest, NextResponse } from 'next/server'

// Get order book for a specific token
export async function GET(
  request: NextRequest,
  { params }: { params: { symbol: string } }
) {
  try {
    const symbol = params.symbol
    
    if (!symbol) {
      return NextResponse.json({
        success: false,
        error: 'Symbol is required'
      }, { status: 400 })
    }

    // For BWRITER token, return demo order book
    if (symbol.toLowerCase() === 'bwriter') {
      const orderBook = {
        symbol: 'bWriter',
        bids: [
          { price: 0.000001, amount: 1000000, total: 1.0, timestamp: Date.now() - 3600000 },
          { price: 0.0000008, amount: 2500000, total: 2.0, timestamp: Date.now() - 7200000 },
          { price: 0.0000006, amount: 5000000, total: 3.0, timestamp: Date.now() - 10800000 }
        ],
        asks: [
          { price: 0.0000012, amount: 500000, total: 0.6, timestamp: Date.now() - 1800000 },
          { price: 0.0000015, amount: 750000, total: 1.125, timestamp: Date.now() - 3600000 },
          { price: 0.000002, amount: 1000000, total: 2.0, timestamp: Date.now() - 5400000 }
        ],
        spread: 0.0000002, // 0.2 satoshis
        last_updated: new Date().toISOString()
      }

      // In a real implementation, this would:
      // 1. Connect to 1sat.market API
      // 2. Fetch real order book data
      // 3. Parse BSV-20 token exchange orders
      // 4. Calculate real-time bid/ask spreads

      return NextResponse.json({
        success: true,
        orderbook: orderBook,
        market: 'BSV-20',
        source: 'bitcoin-writer-exchange'
      })
    }

    return NextResponse.json({
      success: false,
      error: 'Token not supported'
    }, { status: 404 })

  } catch (error) {
    console.error('Order book error:', error)
    return NextResponse.json({
      success: false,
      error: 'Failed to fetch order book'
    }, { status: 500 })
  }
}