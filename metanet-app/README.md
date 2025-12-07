# Bitcoin Writer - Metanet Desktop App

## Overview

Bitcoin Writer is a professional blockchain-based writing platform now available for Metanet Desktop. This integration brings the full power of decentralized content creation, KVStore persistence, and $bWriter token economy to your desktop.

## Features

### 🖊️ Advanced Editor with KVStore Integration
- Rich text editing with Quill
- Automatic saving to KVStore
- Encrypted content storage
- Configurable save operations (set vs call)
- Document versioning and recovery

### 💰 Token Economy
- Native $bWriter token support
- Article marketplace
- Token exchange functionality
- Grant proposal system

### 🔐 Wallet Integration
- Seamless integration with Metanet Desktop wallet
- BRC100 protocol support
- 1Sat Ordinals compatibility
- Secure transaction signing

### 📦 KVStore Features
- Multiple topic management
- Encrypted storage options
- Auto-save functionality
- Document synchronization

## Installation

### From Metanet App Store

1. Open Metanet Desktop
2. Navigate to App Store
3. Search for "Bitcoin Writer"
4. Click Install

### Manual Installation

1. Clone this repository:
```bash
git clone https://github.com/bitcoin-apps-suite/bitcoin-writer.git
cd bitcoin-writer/metanet-app
```

2. Install dependencies:
```bash
npm install
```

3. Build the application:
```bash
npm run build
```

4. Start the app:
```bash
npm start
```

## Configuration

The app can be configured through `manifest.json`:

```json
{
  "kvstore_integration": {
    "enabled": true,
    "topics": ["blog-posts", "quill-documents"],
    "features": ["auto_save", "encrypted_storage"]
  },
  "api_endpoints": {
    "json_api": {
      "port": 3321,
      "enabled": true
    }
  }
}
```

## API Endpoints

The app exposes the following API endpoints on port 3321:

### Health & Status
- `GET /api/health` - Application health check
- `GET /api/wallet/status` - Wallet connection status
- `GET /api/wallet/balance` - Get wallet balances

### KVStore Operations
- `POST /api/kvstore/save` - Save document to KVStore
- `GET /api/kvstore/load/:key` - Load document from KVStore
- `GET /api/kvstore/list` - List all documents
- `DELETE /api/kvstore/delete/:key` - Delete document

### Marketplace
- `GET /api/marketplace/articles` - List available articles
- `GET /api/token/balance/:address` - Check $bWriter balance

## Usage

### Saving Documents with KVStore

```javascript
// Save with encryption
await fetch('http://localhost:3321/api/kvstore/save', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    key: 'my-document',
    value: documentContent,
    topic: 'blog-posts',
    encrypt: true
  })
});

// Load document
const response = await fetch('http://localhost:3321/api/kvstore/load/my-document?topic=blog-posts&decrypt=true');
const { value } = await response.json();
```

### Configuring Save Behavior

Users can choose between 'set' and 'call' operations for saves:

1. Open Settings in the editor
2. Toggle "Use 'call' for save operations"
3. When enabled, saves will use blockchain calls (may incur fees)
4. When disabled, saves use standard set operations

## Permissions

The app requires the following permissions:
- `wallet:read` - Read wallet information
- `wallet:write` - Create transactions
- `kvstore:read` - Read from KVStore
- `kvstore:write` - Write to KVStore
- `network:access` - Network connectivity
- `storage:local` - Local storage for cache

## Development

### Running Tests
```bash
npm test
```

### Building for Production
```bash
npm run build
```

### Creating Distribution Package
```bash
npm run package
```

This creates `bitcoin-writer-metanet.zip` ready for distribution.

## Architecture

```
metanet-app/
├── manifest.json       # App manifest for Metanet Desktop
├── index.js           # Main application entry point
├── package.json       # Dependencies and scripts
├── README.md         # This file
└── .next/            # Built Next.js application (after build)
```

## Integration with Metanet Desktop

The app communicates with Metanet Desktop through:
1. JSON-API on port 3321
2. Wallet Wire on port 3301 (planned)
3. KVStore integration for persistent storage
4. WAB authentication

## Troubleshooting

### KVStore Connection Issues
- Ensure Metanet Desktop is running
- Check that KVStore service is enabled
- Verify network connectivity

### Wallet Not Connecting
- Confirm wallet is unlocked in Metanet Desktop
- Check permissions in manifest.json
- Verify JSON-API is enabled on port 3321

### Documents Not Saving
- Check KVStore is enabled in settings
- Verify you have write permissions
- Ensure sufficient wallet balance for 'call' operations

## Support

- Email: support@bitcoincorp.com
- Discord: https://discord.gg/bitcoin-writer
- Documentation: https://docs.bitcoin-writer.com
- GitHub Issues: https://github.com/bitcoin-apps-suite/bitcoin-writer/issues

## License

AGPL-3.0 - See LICENSE file for details

## Credits

Built by The Bitcoin Corporation LTD for the BSV blockchain ecosystem.