// HandCash Items API - Mint documents as NFTs
// This endpoint handles NFT minting using HandCash Items protocol

module.exports = async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { 
      authToken,
      action,
      itemData 
    } = req.body;

    if (!authToken) {
      return res.status(400).json({ error: 'No authToken provided' });
    }

    if (!action) {
      return res.status(400).json({ error: 'No action specified' });
    }

    // Import HandCash SDK (server-side only)
    const { HandCashConnect } = await import('@handcash/handcash-connect');

    // Initialize HandCash with app credentials
    const appId = process.env.REACT_APP_HANDCASH_APP_ID || process.env.HANDCASH_APP_ID;
    const appSecret = process.env.REACT_APP_HANDCASH_APP_SECRET || process.env.HANDCASH_APP_SECRET;
    
    if (!appId || !appSecret) {
      console.error('Missing HandCash credentials');
      return res.status(500).json({ 
        error: 'HandCash configuration missing',
        details: 'App ID or App Secret not configured'
      });
    }
    
    const handcash = new HandCashConnect({
      appId: appId,
      appSecret: appSecret,
    });

    // Get the account using the authToken
    const account = handcash.getAccountFromAuthToken(authToken);

    switch (action) {
      case 'createItem':
        // Mint a new NFT item
        return await createItem(account, itemData, res);
      
      case 'listItem':
        // List item for sale
        return await listItem(account, itemData, res);
      
      case 'getItems':
        // Get user's items
        return await getUserItems(account, res);
      
      case 'transferItem':
        // Transfer item to another user
        return await transferItem(account, itemData, res);
      
      default:
        return res.status(400).json({ error: 'Invalid action' });
    }
  } catch (error) {
    console.error('HandCash Items API error:', error);
    return res.status(500).json({ 
      error: 'Failed to process request',
      details: error.message,
      ...(process.env.NODE_ENV === 'development' && { stack: error.stack })
    });
  }
}

// Create a new NFT item (mint document as NFT)
async function createItem(account, itemData, res) {
  try {
    const {
      name,
      description,
      imageUrl,
      rarity,
      attributes,
      quantity,
      initialPrice,
      royaltyPercentage,
      documentContent,
      documentMetadata
    } = itemData;

    console.log('Creating HandCash Item:', {
      name,
      description,
      quantity,
      hasImage: !!imageUrl,
      hasContent: !!documentContent
    });

    // Prepare item creation parameters
    const itemParams = {
      name: name || 'Untitled Document',
      description: description || 'A document minted as NFT',
      rarity: rarity || 'common',
      attributes: attributes || [],
      quantity: quantity || 1,
      // HandCash expects URLs for images, not base64
      imageUrl: imageUrl || 'https://bitcoin-writer.vercel.app/document-nft-default.png',
      origin: 'bitcoin-writer',
      // Store document metadata
      externalId: documentMetadata?.id || `doc_${Date.now()}`,
      // Custom metadata for the document
      customParameters: {
        documentTitle: documentMetadata?.title,
        wordCount: documentMetadata?.wordCount,
        createdAt: documentMetadata?.createdAt,
        contentHash: documentMetadata?.contentHash,
        storageMethod: documentMetadata?.storageMethod || 'handcash',
        // If document is stored elsewhere, include the URL
        contentUrl: documentMetadata?.contentUrl,
        // Initial pricing
        price: initialPrice,
        currency: 'USD'
      }
    };

    // Add royalty if specified
    if (royaltyPercentage && royaltyPercentage > 0) {
      itemParams.royalties = [{
        to: 'creator', // This will be the item creator
        percentage: royaltyPercentage
      }];
    }

    // Create the item using HandCash Items API
    const result = await account.items.createItems([itemParams]);

    console.log('Item created successfully:', result);

    // If initial price is set, list the item for sale
    if (initialPrice && initialPrice > 0) {
      try {
        const listingResult = await account.marketplace.createListing({
          itemOrigin: result.items[0].origin,
          itemId: result.items[0].id,
          price: initialPrice,
          quantity: 1,
          currency: 'USD',
          description: `${name} - Now available for purchase`
        });

        console.log('Item listed for sale:', listingResult);

        return res.status(200).json({
          success: true,
          item: result.items[0],
          listing: listingResult,
          message: 'Document minted as NFT and listed for sale',
          marketUrl: `https://market.handcash.io/item/${result.items[0].origin}/${result.items[0].id}`
        });
      } catch (listingError) {
        console.error('Failed to list item:', listingError);
        // Item was created but not listed
        return res.status(200).json({
          success: true,
          item: result.items[0],
          message: 'Document minted as NFT (listing failed)',
          warning: 'Item created but could not be listed for sale',
          marketUrl: `https://market.handcash.io/item/${result.items[0].origin}/${result.items[0].id}`
        });
      }
    }

    return res.status(200).json({
      success: true,
      item: result.items[0],
      message: 'Document minted as NFT successfully',
      marketUrl: `https://market.handcash.io/item/${result.items[0].origin}/${result.items[0].id}`
    });
  } catch (error) {
    console.error('Error creating item:', error);
    throw error;
  }
}

// List an existing item for sale
async function listItem(account, itemData, res) {
  try {
    const { itemId, itemOrigin, price, quantity, currency } = itemData;

    const result = await account.marketplace.createListing({
      itemOrigin: itemOrigin,
      itemId: itemId,
      price: price,
      quantity: quantity || 1,
      currency: currency || 'USD'
    });

    return res.status(200).json({
      success: true,
      listing: result,
      message: 'Item listed for sale successfully'
    });
  } catch (error) {
    console.error('Error listing item:', error);
    throw error;
  }
}

// Get user's NFT items
async function getUserItems(account, res) {
  try {
    // Get items created by the user
    const items = await account.items.getItemsInventory({
      from: 0,
      to: 50 // Get up to 50 items
    });

    // Also try to get marketplace listings
    let listings = [];
    try {
      listings = await account.marketplace.getUserListings();
    } catch (e) {
      console.log('Could not fetch listings:', e.message);
    }

    return res.status(200).json({
      success: true,
      items: items.items || [],
      totalItems: items.total || 0,
      listings: listings,
      message: 'Items retrieved successfully'
    });
  } catch (error) {
    console.error('Error getting items:', error);
    throw error;
  }
}

// Transfer item to another user
async function transferItem(account, itemData, res) {
  try {
    const { 
      itemId, 
      itemOrigin, 
      destinationHandle, 
      destinationEmail 
    } = itemData;

    const result = await account.items.transfer({
      itemOrigin: itemOrigin,
      itemId: itemId,
      to: destinationHandle || destinationEmail,
      quantity: 1
    });

    return res.status(200).json({
      success: true,
      transfer: result,
      message: `Item transferred to ${destinationHandle || destinationEmail}`
    });
  } catch (error) {
    console.error('Error transferring item:', error);
    throw error;
  }
}