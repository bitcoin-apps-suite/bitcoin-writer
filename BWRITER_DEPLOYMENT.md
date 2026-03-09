# $bWriter Staking Deployment to Bitcoin Writer

**Status**: Infrastructure Copied, Awaiting Environment Setup
**Date**: 2026-01-26

## What's Been Done

✅ Copied all $bWriter infrastructure from b0ase.com:
- API endpoints (`/app/api/bwriter/*`)
- Cron jobs (`/app/api/cron/bwriter/*`)
- Dashboard page (`/app/bwriter/dashboard/`)
- React components (`/components/bwriter/`)
- Custom hooks (`/hooks/useBwriterStaking.ts`, `/hooks/useAuth.ts`)
- Utility libraries (`/lib/bsv-transfer.ts`, `/lib/kyc.ts`, `/lib/supabase/*`, `/lib/investors/*`)

## What Needs to Be Done

### 1. Create .env.local

Create `.env.local` with:

```bash
# Supabase (shared with b0ase.com)
NEXT_PUBLIC_SUPABASE_URL=https://api.b0ase.com
NEXT_PUBLIC_SUPABASE_ANON_KEY=<from-b0ase>
SUPABASE_SERVICE_ROLE_KEY=<from-b0ase>
DATABASE_URL=<postgresql-connection-string>

# $bWriter Staking
BWRITER_MULTISIG_ADDRESS=1Dd3iSFQEM8spmdLbqwxMenWEryNnBBHM6
CRON_SECRET=b0ase-cron-secret-a90148dca317d210bec21db373ca351b
ADMIN_API_KEY=<secure-key>

# Optional
WHATSONCHAIN_API_KEY=<optional>
BWRITER_MULTISIG_PRIVATE_KEY=<for-signing>
BWRITER_REVENUE_TRACKER_ADDRESS=<optional>
```

### 2. Install Dependencies

```bash
pnpm install
# May need to add: axios react-icons @supabase/ssr
```

### 3. Update vercel.json

Ensure cron jobs are configured:

```json
{
  "crons": [
    {
      "path": "/api/cron/bwriter/confirm-deposits",
      "schedule": "0 * * * *"
    },
    {
      "path": "/api/cron/bwriter/distribute-dividends",
      "schedule": "0 0 * * *"
    }
  ]
}
```

### 4. Build and Test

```bash
# Build
pnpm build

# Test
pnpm dev

# Test endpoints
curl http://localhost:3000/api/bwriter/dashboard \
  -H "Authorization: Bearer test-token"
```

## Shared Architecture

Bitcoin Writer shares with b0ase.com:

- **Database**: Same Supabase (`https://api.b0ase.com`)
- **Multisig Address**: Same staking address
- **Cap Table**: Unified across all platforms
- **Dividends**: Calculated from all platforms' stakes

This means:
- Users who write and earn $bWriter tokens can stake on Bitcoin Writer
- Staking button can be embedded in editor UI
- Dividends include stakes from all three platforms

## Integration Points

### For Earning Tokens

```typescript
// When user saves a document and earns tokens:
const tokenAmount = calculateTokenReward(saveSize);
await recordUserBalance(userId, tokenAmount);

// User can now stake from dashboard:
// /app/bwriter/dashboard - same UI as b0ase.com
```

### For UI Integration

```jsx
// Add to editor toolbar:
<StakingButton onClick={() => navigate('/bwriter/dashboard')} />

// Or embed directly:
<StakingForm />
<StakingStatus />
```

## Testing Checklist

- [ ] Database accessible
- [ ] API endpoints responding
- [ ] Dashboard renders
- [ ] Can navigate to `/bwriter/dashboard`
- [ ] Cron jobs scheduled in Vercel
- [ ] Test stake creation (if using test balance)
- [ ] Verify shared cap table updates

## Documentation

For technical details:
- `/docs/BWRITER_STAKING.md` - Technical reference
- `/docs/BWRITER_QUICK_START.md` - Developer guide
- `/BWRITER_PHASE1_SUMMARY.md` - Implementation

---

**Last Updated**: 2026-01-26
**Status**: Ready for environment setup
**Next**: Frontend integration with editor UI
