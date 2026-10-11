# SDK Implementation Guide

## 📦 Overview
This guide provides implementation details for the `@bitcoin-writer/core` package and platform-specific SDKs.

## 🛠️ Shared Services

### HandCashService
The core service for authentication and wallet operations.
```typescript
import { HandCashService } from '@/services/HandCashService';

const handcash = new HandCashService();
await handcash.login();
const balance = await handcash.getBalance();
```

### BlockchainDocumentService
Handles content hashing and blockchain storage.
```typescript
import { BlockchainDocumentService } from '@/services/BlockchainDocumentService';

const docService = new BlockchainDocumentService();
const txId = await docService.publishToChain(documentContent);
```

## 🌍 Platform Specifics

### JavaScript / TypeScript
Use the core React hooks for state and operations:
- `useAuth()`: Session management.
- `useDocument()`: CRUD operations with auto-save.
- `useBlockchain()`: Pricing estimation and broadcasting.

### Python Integration
Communicate with the backend via REST:
```python
import requests

def get_stats():
    response = requests.get('https://api.bitcoin-writer.com/api/bwriter/stats')
    return response.json()
```

## 🛡️ Best Practices
1. **Never store private keys**: Always use HandCash for signing.
2. **Handle 402 Errors**: Blockchain writes require satoshis; prompt users for funding.
3. **Local First**: Use `localStorage` via `StorageAdapter` before syncing to chain.
