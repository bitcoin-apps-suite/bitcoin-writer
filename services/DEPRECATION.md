# BSVStorageService Deprecation Guide

## ⚠️ Status: DEPRECATED

`BSVStorageService` is **deprecated** and will be removed in a future version.

## Why?

The service has been refactored into three focused, platform-agnostic services in `@bitcoin-writer/core`:

1. **PricingService** - BSV pricing and cost estimation
2. **DocumentProtocolService** - Protocol selection and blockchain storage
3. **DocumentStorageService** - Document persistence and CRUD operations

This provides:
- ✅ Platform independence (Web, PWA, Chrome Extension, Electron)
- ✅ Better testability (single responsibility)
- ✅ Improved maintainability
- ✅ Code reusability across platforms

## Migration Guide

### 1. Pricing / Cost Estimation

**OLD (BSVStorageService):**
```typescript
import BSVStorageService from './services/BSVStorageService';

const bsvStorage = new BSVStorageService(handcashService);
const quote = bsvStorage.calculateStorageCost(wordCount, encrypted);
const realTimeQuote = await bsvStorage.calculateStorageCostRealTime(wordCount, encrypted);
const bsvPrice = await bsvStorage.getCurrentBSVPrice();
```

**NEW (PricingService):**
```typescript
import { PricingService } from '@bitcoin-writer/core/services';

const pricingService = new PricingService();
const quote = pricingService.calculateStorageCost(wordCount, encrypted);
const realTimeQuote = await pricingService.calculateStorageCostRealTime(wordCount, encrypted);
const bsvPrice = await pricingService.getCurrentBSVPrice();

// NEW: Protocol cost comparison
const comparison = await pricingService.compareAllProtocols(content, encrypted);
console.log('Recommended protocol:', comparison.recommended);
```

### 2. Blockchain Storage

**OLD (BSVStorageService):**
```typescript
const result = await bsvStorage.storeDocument(content, title, author, encrypted);
console.log('Transaction:', result.transactionId);
console.log('Cost:', result.storageCost.totalUSD);
```

**NEW (DocumentProtocolService):**
```typescript
import { DocumentProtocolService } from '@bitcoin-writer/core/services';

const protocolService = new DocumentProtocolService(
  bProtocolService,
  dProtocolService,
  bcatProtocolService,
  storageAdapter
);

const result = await protocolService.store(content, title, {
  protocol: 'auto', // Or 'B', 'D', 'Bcat', 'UHRP'
  encrypt: true,
  compress: true
});

console.log('Protocol used:', result.protocol);
console.log('Reference:', result.reference);
console.log('Transaction:', result.txId);
console.log('Cost:', result.cost.usd);
```

### 3. Document Retrieval

**OLD (BSVStorageService):**
```typescript
const document = await bsvStorage.retrieveDocument(txid);
```

**NEW (DocumentProtocolService):**
```typescript
const content = await protocolService.retrieve(reference);
// Works with B://, D://, Bcat, or UHRP URLs
```

### 4. Document Storage Options

**OLD (BSVStorageService):**
```typescript
const result = await bsvStorage.storeDocumentWithOptions(content, {
  encryption: true,
  encryptionMethod: 'notesv',
  encryptionPassword: 'password',
  metadata: {
    title: 'My Document',
    description: 'A test',
    tags: ['test']
  }
}, author);
```

**NEW (DocumentProtocolService + DocumentStorageService):**
```typescript
import { DocumentStorageService } from '@bitcoin-writer/core/services';

const storageService = new DocumentStorageService(storageAdapter);

// Store on blockchain
const protocolResult = await protocolService.store(content, 'My Document', {
  encrypt: true,
  protocol: 'auto'
});

// Persist document metadata
const document = await storageService.createDocument(
  'My Document',
  content,
  {
    author: currentUser.handle,
    blockchain_tx: protocolResult.txId,
    storage_cost: protocolResult.cost.usd
  },
  {
    encrypt: true,
    encryptionPassword: 'password'
  }
);
```

## Files Using BSVStorageService

The following files still use `BSVStorageService` and need migration:

### Services
- ❌ `services/BlockchainDocumentService.ts` → ✅ Use `BlockchainDocumentService.refactored.ts`
- ❌ `services/HandCashNFTService.ts` → Migrate to use PricingService
- ❌ `services/BWRITERTokenService.ts` → Migrate to use PricingService

### Components
- ❌ `components/editor/DocumentEditor.tsx` → Use BlockchainDocumentService instead
- ❌ `components/editor/DocumentUnlock.tsx` → Use DocumentProtocolService
- ❌ `components/BudgetPrompt.tsx` → Use PricingService
- ❌ `components/PricingDisplay.tsx` → Use PricingService

### Scripts
- ❌ `scripts/deploy-bwriter-token.ts` → Migrate to use PricingService

## Recommended Migration Path

1. **Phase 1**: Start using `BlockchainDocumentService.refactored.ts`
   ```bash
   mv services/BlockchainDocumentService.ts services/BlockchainDocumentService.old.ts
   mv services/BlockchainDocumentService.refactored.ts services/BlockchainDocumentService.ts
   ```

2. **Phase 2**: Update components to use new services
   - Replace `BSVStorageService` imports with `PricingService`
   - Update method calls according to this guide

3. **Phase 3**: Test thoroughly
   - Verify pricing calculations match
   - Test document storage and retrieval
   - Ensure backward compatibility

4. **Phase 4**: Remove BSVStorageService
   ```bash
   rm services/BSVStorageService.ts
   ```

## Benefits After Migration

- ✅ **66% of code is platform-agnostic** (works on Web, PWA, Extension, Electron)
- ✅ **Better testing** (each service has one responsibility)
- ✅ **Improved performance** (5-minute price caching in PricingService)
- ✅ **Protocol flexibility** (auto-select optimal protocol based on content size)
- ✅ **Future-proof** (easy to add new protocols)

## Need Help?

If you encounter issues during migration:

1. Check the examples in `/packages/bitcoin-writer-core/README.md`
2. Review the refactored `BlockchainDocumentService.refactored.ts`
3. Look at the service source code in `/packages/bitcoin-writer-core/src/services/`

## Timeline

- **Now**: BSVStorageService marked as deprecated (warnings in console)
- **Next Release**: Remove BSVStorageService entirely
- **Migration Window**: Update your code before next release

---

**Last Updated**: January 2026
