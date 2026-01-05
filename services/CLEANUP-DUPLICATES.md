# Service Cleanup: Remove Duplicates

## ❌ Duplicate Services to Remove

The following services exist in both the app and `@bitcoin-writer/core`. The app versions are **duplicates** and should be removed:

### Protocol Services (Already in Core)
1. **BProtocolService.ts** (14K) → Use `@bitcoin-writer/core/services`
2. **DProtocolService.ts** (16K) → Use `@bitcoin-writer/core/services`
3. **BcatProtocolService.ts** (22K) → Use `@bitcoin-writer/core/services`
4. **BicoMediaService.ts** (14K) → Use `@bitcoin-writer/core/services`
5. **UHRPService.ts** (7.4K) → Use `@bitcoin-writer/core/services`

### Encryption Services (Already in Core)
6. **NoteSVEncryption.ts** (6.7K) → Use `@bitcoin-writer/core/services`

### Pricing Services (Already in Core)
7. **PriceService.ts** (13K) → Use `@bitcoin-writer/core/services` (PricingService)

**Total duplicate code**: ~102K / ~700 lines

## Migration Steps

### Step 1: Update Imports

**Before:**
```typescript
// OLD - local imports
import BProtocolService from './services/BProtocolService';
import DProtocolService from './services/DProtocolService';
import { NoteSVEncryption } from './services/NoteSVEncryption';
import PriceService from './services/PriceService';
```

**After:**
```typescript
// NEW - core imports
import {
  BProtocolService,
  DProtocolService,
  BcatProtocolService,
  BicoMediaService,
  UHRPService,
  NoteSVEncryption,
  PricingService  // Note: renamed from PriceService
} from '@bitcoin-writer/core/services';
```

### Step 2: Find All Files Using These Services

```bash
cd /Users/b0ase/Projects/Bitcoin-OS/apps/bitcoin-writer

# Find all imports
grep -r "from.*'\.\/.*\/BProtocolService'" . --include="*.ts" --include="*.tsx"
grep -r "from.*'\.\/.*\/DProtocolService'" . --include="*.ts" --include="*.tsx"
grep -r "from.*'\.\/.*\/NoteSVEncryption'" . --include="*.ts" --include="*.tsx"
grep -r "from.*'\.\/.*\/PriceService'" . --include="*.ts" --include="*.tsx"
```

### Step 3: Update Each File

For each file found:
1. Replace local import with core import
2. Update `PriceService` to `PricingService` (renamed)
3. Verify no breaking changes in API

### Step 4: Remove Duplicate Files

```bash
cd /Users/b0ase/Projects/Bitcoin-OS/apps/bitcoin-writer/services

# Backup first (optional)
mkdir -p .duplicates-backup
mv BProtocolService.ts .duplicates-backup/
mv DProtocolService.ts .duplicates-backup/
mv BcatProtocolService.ts .duplicates-backup/
mv BicoMediaService.ts .duplicates-backup/
mv UHRPService.ts .duplicates-backup/
mv NoteSVEncryption.ts .duplicates-backup/
mv PriceService.ts .duplicates-backup/

# Or delete directly
rm BProtocolService.ts DProtocolService.ts BcatProtocolService.ts BicoMediaService.ts UHRPService.ts NoteSVEncryption.ts PriceService.ts
```

### Step 5: Test

```bash
# Build core
pnpm build:core

# Build app
pnpm build

# Run tests if available
pnpm test
```

## Benefits After Cleanup

- ✅ Remove ~700 lines of duplicate code
- ✅ Single source of truth for each service
- ✅ Automatic updates when core is improved
- ✅ Consistent behavior across app
- ✅ Smaller app bundle size

## Files Using These Services (To Update)

Run these commands to find all files that need import updates:

```bash
# Find BProtocolService usage
grep -r "BProtocolService" apps/bitcoin-writer --include="*.ts" --include="*.tsx" | grep "import"

# Find DProtocolService usage
grep -r "DProtocolService" apps/bitcoin-writer --include="*.ts" --include="*.tsx" | grep "import"

# Find NoteSVEncryption usage
grep -r "NoteSVEncryption" apps/bitcoin-writer --include="*.ts" --include="*.tsx" | grep "import"

# Find PriceService usage
grep -r "PriceService" apps/bitcoin-writer --include="*.ts" --include="*.tsx" | grep "import"
```

---

**Priority**: High
**Estimated Time**: 1-2 hours
**Risk**: Low (services have identical APIs)
