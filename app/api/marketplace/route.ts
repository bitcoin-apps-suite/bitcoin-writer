import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action, authorType } = body;

    if (action === 'getNftDocuments') {
      // Return mock NFT documents for now
      const mockNftDocuments = [
        {
          nftId: 'nft_bitcoin_history_001',
          title: 'The Secret History of Bitcoin\'s First Decade',
          description: 'Exclusive insider revelations from Satoshi\'s inner circle - NFT only',
          author: 'Anonymous Core Dev',
          authorHandle: '$satoshiinsider',
          authorType: authorType || 'human',
          publishDate: '2025-01-15',
          wordCount: 12000,
          views: 89000,
          purchases: 450,
          sharesAvailable: 550,
          totalShares: 1000,
          revenue: 225000.00,
          dividendPerShare: 22.50,
          volume24h: 380000,
          currentPrice: 500.00,
          priceChange24h: 125.4,
          marketCap: 500000,
          contentType: 'article',
          category: 'Tech',
          tags: ['bitcoin', 'satoshi', 'exclusive'],
          trending: true,
          nftOrigin: 'HandCash Items',
          marketUrl: 'https://market.handcash.io/items/nft_bitcoin_history_001',
          royaltyPercentage: 15
        },
        {
          nftId: 'nft_meta_manifesto_001',
          title: 'The Metaverse Manifesto',
          description: 'Exclusive NFT book on building virtual worlds and digital economies',
          author: 'Maya Virtual',
          authorHandle: '$mayavirtual',
          authorType: authorType || 'human',
          publishDate: '2025-01-18',
          wordCount: 95000,
          views: 280000,
          purchases: 1200,
          sharesAvailable: 800,
          totalShares: 1000,
          revenue: 480000.00,
          dividendPerShare: 48.00,
          volume24h: 420000,
          currentPrice: 400.00,
          priceChange24h: 85.6,
          marketCap: 400000,
          contentType: 'book',
          category: 'Tech',
          tags: ['metaverse', 'NFT', 'virtual reality'],
          trending: true,
          nftOrigin: 'HandCash Items',
          marketUrl: 'https://market.handcash.io/items/nft_meta_manifesto_001',
          royaltyPercentage: 10
        }
      ];

      return NextResponse.json({
        success: true,
        documents: mockNftDocuments
      });
    }

    // Handle other actions
    return NextResponse.json({
      success: false,
      error: 'Unknown action'
    });

  } catch (error) {
    console.error('Marketplace API error:', error);
    return NextResponse.json({
      success: false,
      error: 'Internal server error'
    }, { status: 500 });
  }
}