# Phase 4: Feature Services Migration Plan

## Summary

**Status**:
- ❌ 7 duplicate services to remove (~700 lines)
- 🔍 4 feature services to analyze
- ✅ ~30 app-specific services to keep

---

## Part A: Remove Duplicate Services (HIGH PRIORITY)

### Services to Delete (Already in Core)

| Service | Size | Core Replacement | Action |
|---------|------|------------------|--------|
| BProtocolService.ts | 14K | `@bitcoin-writer/core/services` | DELETE |
| DProtocolService.ts | 16K | `@bitcoin-writer/core/services` | DELETE |
| BcatProtocolService.ts | 22K | `@bitcoin-writer/core/services` | DELETE |
| BicoMediaService.ts | 14K | `@bitcoin-writer/core/services` | DELETE |
| UHRPService.ts | 7.4K | `@bitcoin-writer/core/services` | DELETE |
| NoteSVEncryption.ts | 6.7K | `@bitcoin-writer/core/services` | DELETE |
| PriceService.ts | 13K | `@bitcoin-writer/core/services` (PricingService) | DELETE |

**Total**: ~93K / ~700 lines of duplicate code

### Migration Steps

1. ✅ **Find all imports** (script provided in CLEANUP-DUPLICATES.md)
2. ✅ **Update imports** to use `@bitcoin-writer/core/services`
3. ✅ **Rename** `PriceService` → `PricingService`
4. ✅ **Delete** duplicate files
5. ✅ **Test** build and functionality

**Estimated Time**: 1-2 hours
**Risk**: Low (identical APIs)

---

## Part B: Analyze Feature Services

### 1. **AIService.ts** (10K / ~300 lines)

**Purpose**: Multi-provider AI completions (Gemini, OpenAI, Claude, Local LLM)

**Analysis**:
- ❌ Uses `localStorage` for API key storage (lines 43, 55)
- ✅ Platform-agnostic AI API calls
- ✅ Interaction chain tracking
- ✅ UTXO-based versioning

**Recommendation**: **MIGRATE TO CORE** with modifications

**Changes Needed**:
1. Replace `localStorage` with `StorageAdapter`
2. Remove HandCashService dependency (pass as parameter)
3. Create as `@bitcoin-writer/core/services/ai/AIService.ts`

**Benefits**:
- Reusable across all platforms
- Consistent AI integration
- ~300 lines to core

**Migration Priority**: Medium

---

### 2. **SignatureEncryption.ts** (6.4K / ~200 lines)

**Purpose**: Cryptographic signature-based encryption

**Analysis**:
- ✅ Pure cryptographic operations
- ✅ No platform dependencies
- ✅ No storage dependencies
- ✅ Uses CryptoJS (same as NoteSVEncryption)

**Recommendation**: **MIGRATE TO CORE**

**Changes Needed**:
1. Move to `@bitcoin-writer/core/services/encryption/`
2. Export from encryption index
3. Add comprehensive type definitions

**Benefits**:
- Platform-agnostic encryption
- Reusable security primitive
- ~200 lines to core

**Migration Priority**: High (encryption is core functionality)

---

###3. **SmartStorageService.ts** (8.5K / ~250 lines)

**Purpose**: Intelligent storage optimization and protocol selection

**Analysis**:
- ❓ May have localStorage dependencies (needs full review)
- ✅ Storage optimization logic
- ✅ Protocol selection heuristics
- ❓ May overlap with DocumentProtocolService

**Recommendation**: **REVIEW FIRST**, then decide

**Options**:
- **A)** Merge features into `DocumentProtocolService` if duplicate
- **B)** Migrate to core as separate optimization service
- **C)** Keep in app if too app-specific

**Next Step**: Full code review required

**Migration Priority**: Low (review first)

---

### 4. **DocumentInscriptionService.ts** (10K / ~300 lines)

**Purpose**: Document inscription on blockchain (ordinals-style)

**Analysis**:
- ❌ Extends Node.js `EventEmitter` (platform-specific)
- ❌ Depends on `MicroOrdinalsService` (app-specific)
- ✅ Document inscription logic could be abstracted

**Recommendation**: **KEEP IN APP** for now

**Reasons**:
- EventEmitter is Node.js/browser-specific
- Depends on app-specific services
- Inscription is a specialized feature, not core

**Alternative**: Create platform-agnostic inscription interface in core if needed later

**Migration Priority**: Not recommended

---

## Part C: App-Specific Services (Keep in App)

These services are **correctly placed** in the app and should NOT migrate:

### Payment & Monetization
- ✅ MonetizationService.ts (already refactored)
- ✅ StripePaymentService.ts
- ✅ StripeSubscriptionService.ts
- ✅ BWRITERTokenService.ts

### NFT & Items
- ✅ HandCashNFTService.ts
- ✅ HandCashItemsService.ts
- ✅ NFTService.ts
- ✅ MicroOrdinalsService.ts

### OAuth & Auth
- ✅ TwitterAuthService.ts
- ✅ GitHubAuthService.ts

### App Features
- ✅ GrantSubmissionService.ts
- ✅ TaskContractService.ts
- ✅ IntegratedWorkTreeService.ts
- ✅ DocumentInscriptionService.ts

**Total**: ~30 services staying in app

---

## Phase 4 Execution Plan

### Step 1: Remove Duplicates (Today)
- [ ] Create import replacement script
- [ ] Update all imports in app
- [ ] Delete 7 duplicate service files
- [ ] Test build
- [ ] **Impact**: -700 lines, cleaner codebase

### Step 2: Migrate SignatureEncryption (Today)
- [ ] Move to `@bitcoin-writer/core/services/encryption/`
- [ ] Update type definitions
- [ ] Export from core
- [ ] Update app imports
- [ ] **Impact**: +200 lines to core

### Step 3: Migrate AIService (Optional - Next Session)
- [ ] Refactor to use StorageAdapter
- [ ] Remove platform dependencies
- [ ] Move to `@bitcoin-writer/core/services/ai/`
- [ ] Create comprehensive documentation
- [ ] **Impact**: +300 lines to core

### Step 4: Review SmartStorageService (Optional - Later)
- [ ] Full code analysis
- [ ] Check for overlaps with DocumentProtocolService
- [ ] Decide: merge, migrate, or keep
- [ ] **Impact**: TBD

---

## Expected Results After Phase 4

| Metric | Before | After | Change |
|--------|--------|-------|--------|
| **App Service Files** | 28 | 21 | -7 duplicates |
| **Duplicate Code** | ~700 lines | 0 | -700 lines |
| **Core Package** | 1,275 lines | 1,775+ lines | +500 lines |
| **Portability** | 66% | 72%+ | +6% |

---

## Next Steps

**Immediate** (This Session):
1. Remove 7 duplicate services
2. Migrate SignatureEncryption

**Optional** (This Session or Next):
3. Migrate AIService with StorageAdapter

**Future**:
4. Review SmartStorageService

---

**Priority**: High
**Estimated Time**: 2-3 hours
**Risk**: Low (mostly deletions and clean imports)
