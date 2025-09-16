// Marketplace API endpoints for Bitcoin Writer
// Handles fetching and managing document NFTs from all users

const { HandCashConnect } = require('@handcash/handcash-connect');

module.exports = async function handler(req, res) {
  console.log('Marketplace API called with action:', req.body?.action);

  const { action } = req.body;

  try {
    switch (action) {
      case 'getDocumentNFTs':
        return await getDocumentNFTs(req, res);
      case 'getDocumentContent':
        return await getDocumentContent(req, res);
      case 'searchNFTs':
        return await searchNFTs(req, res);
      default:
        return res.status(400).json({
          success: false,
          error: 'Invalid action'
        });
    }
  } catch (error) {
    console.error('Marketplace API error:', error);
    return res.status(500).json({
      success: false,
      error: 'Internal server error',
      details: error.message
    });
  }
};

async function getDocumentNFTs(req, res) {
  try {
    // For now, return mock data
    // In production, this would query the HandCash Items marketplace
    // or maintain a database of all Bitcoin Writer NFTs
    
    const mockNFTs = [
      {
        id: 'nft-1',
        origin: 'bitcoin-writer',
        name: 'The Future of Digital Publishing',
        description: 'An in-depth analysis of how blockchain technology is revolutionizing the publishing industry',
        author: {
          name: 'Sarah Chen',
          handle: '$sarahchen',
          verified: true
        },
        stats: {
          readers: 1250,
          shares: 89,
          revenue: '$2,450'
        },
        nft: {
          quantity: 100,
          available: 45,
          price: 25,
          royaltyPercentage: 10,
          marketUrl: 'https://market.handcash.io/item/bitcoin-writer/nft-1'
        },
        trending: true,
        createdAt: new Date(Date.now() - 86400000).toISOString()
      },
      {
        id: 'nft-2',
        origin: 'bitcoin-writer',
        name: 'Smart Contracts for Beginners',
        description: 'A comprehensive guide to understanding and implementing smart contracts on BSV',
        author: {
          name: 'Alex Rivera',
          handle: '$alexr',
          verified: false
        },
        stats: {
          readers: 890,
          shares: 156,
          revenue: '$1,780'
        },
        nft: {
          quantity: 50,
          available: 12,
          price: 35,
          royaltyPercentage: 15,
          marketUrl: 'https://market.handcash.io/item/bitcoin-writer/nft-2'
        },
        trending: false,
        createdAt: new Date(Date.now() - 172800000).toISOString()
      },
      {
        id: 'nft-3',
        origin: 'bitcoin-writer',
        name: 'Micropayments Revolution',
        description: 'How micropayments are changing content monetization forever',
        author: {
          name: 'Jordan Lee',
          handle: '$jlee',
          verified: true
        },
        stats: {
          readers: 2100,
          shares: 234,
          revenue: '$4,200'
        },
        nft: {
          quantity: 200,
          available: 178,
          price: 20,
          royaltyPercentage: 8,
          marketUrl: 'https://market.handcash.io/item/bitcoin-writer/nft-3'
        },
        trending: true,
        createdAt: new Date(Date.now() - 259200000).toISOString()
      }
    ];

    // Filter by query if provided
    const { query, sortBy } = req.body;
    let filteredNFTs = [...mockNFTs];

    if (query) {
      const searchTerm = query.toLowerCase();
      filteredNFTs = filteredNFTs.filter(nft => 
        nft.name.toLowerCase().includes(searchTerm) ||
        nft.description.toLowerCase().includes(searchTerm) ||
        nft.author.name.toLowerCase().includes(searchTerm)
      );
    }

    // Sort results
    if (sortBy === 'price') {
      filteredNFTs.sort((a, b) => a.nft.price - b.nft.price);
    } else if (sortBy === 'readers') {
      filteredNFTs.sort((a, b) => b.stats.readers - a.stats.readers);
    } else if (sortBy === 'newest') {
      filteredNFTs.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    }

    return res.json({
      success: true,
      nfts: filteredNFTs,
      totalCount: filteredNFTs.length,
      message: 'Document NFTs fetched successfully'
    });

  } catch (error) {
    console.error('Error fetching document NFTs:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to fetch document NFTs',
      details: error.message
    });
  }
}

async function getDocumentContent(req, res) {
  try {
    const { nftId, authToken } = req.body;

    if (!nftId) {
      return res.status(400).json({
        success: false,
        error: 'NFT ID is required'
      });
    }

    // In production, verify ownership or purchase status
    // For now, return mock content
    const mockContent = {
      id: nftId,
      title: 'The Future of Digital Publishing',
      content: '<h1>The Future of Digital Publishing</h1><p>Content would be loaded here after verifying ownership...</p>',
      author: 'Sarah Chen',
      owned: true,
      canRead: true
    };

    return res.json({
      success: true,
      document: mockContent,
      message: 'Document content fetched successfully'
    });

  } catch (error) {
    console.error('Error fetching document content:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to fetch document content',
      details: error.message
    });
  }
}

async function searchNFTs(req, res) {
  try {
    const { searchTerm, filters } = req.body;

    // Implement search logic
    // For now, redirect to getDocumentNFTs with query
    req.body.query = searchTerm;
    return getDocumentNFTs(req, res);

  } catch (error) {
    console.error('Error searching NFTs:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to search NFTs',
      details: error.message
    });
  }
}