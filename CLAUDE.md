# Bitcoin Writer — CLAUDE.md

## What This Is

Decentralized writing platform on Bitcoin SV. Writers create, save to blockchain, earn tokens, and get paid via micropayments. Uses Quill editor, HandCash wallet auth, and BSV inscription protocols.

**Live at**: bitcoin-writer.vercel.app
**Token**: $bWriter (BSV-20, 1B supply)

## Tech Stack

- **Framework**: Next.js 16.1.6 (App Router + Pages Router for auth callbacks)
- **Editor**: Quill 2.0.3 via react-quill (+ standalone HTML editor in public/)
- **Blockchain**: @bsv/sdk, micro-ordinals, B/BCAT/D protocols
- **Auth**: HandCash OAuth (primary), GitHub OAuth, Twitter OAuth
- **Payments**: Stripe + HandCash BSV micropayments
- **Database**: Shared Supabase on Hetzner (via b0ase.com infra)
- **Package Manager**: pnpm
- **Styling**: Tailwind CSS + custom CSS per page

## Key Architecture

```
app/
├── page.tsx             # Landing page with embedded editor iframe
├── write/               # Full-screen writing mode
├── editor/              # Alternative editor page
├── docs/                # User documentation
├── bwriter/dashboard/   # $bWriter staking dashboard
├── api/
│   ├── bwriter/         # Staking APIs (dashboard, stake, unstake, stats, dividend-address)
│   ├── cron/bwriter/    # Cron: confirm-deposits (hourly), distribute-dividends (daily)
│   ├── pdf/             # PDF generation (subscription-agreement, term-sheet, KYC, AML)
│   └── auth/            # OAuth callbacks (github, twitter) — Pages Router
```

## Services Layer

| Service | File | Purpose |
|---------|------|---------|
| HandCashService | services/HandCashService.ts | Wallet auth, payments, tx signing |
| HandCashAuthService | services/HandCashAuthService.ts | OAuth flow + REST API |
| HandCashNFTService | services/HandCashNFTService.ts | Mint documents as NFTs |
| BSVStorageService | services/BSVStorageService.ts | Multi-protocol blockchain storage |
| DocumentInscriptionService | services/DocumentInscriptionService.ts | Document inscriptions + version chains |
| MicroOrdinalsService | services/MicroOrdinalsService.ts | 1sat ordinal inscriptions |
| TaskContractService | services/TaskContractService.ts | Developer task contracts |
| PriceService | services/PriceService.ts | Live token prices + document tokenization |
| AIService | services/AIService.ts | Gemini AI writing assistant |

## Environment Variables

Required in `.env.local` (gitignored):

```
# Supabase (shared with b0ase.com)
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
DATABASE_URL=

# HandCash
HANDCASH_APP_ID=
HANDCASH_APP_SECRET=
NEXT_PUBLIC_HANDCASH_APP_ID=

# $bWriter Staking
BWRITER_MULTISIG_ADDRESS=1Dd3iSFQEM8spmdLbqwxMenWEryNnBBHM6
CRON_SECRET=
ADMIN_API_KEY=

# Optional
WHATSONCHAIN_API_KEY=
BWRITER_MULTISIG_PRIVATE_KEY=  # Required for actual BSV dividend payouts
```

## Key Decisions

1. **TypeScript errors ignored in build** (`next.config.js`) — legacy code has many type issues
2. **Shared Supabase** — same database as b0ase.com, tables prefixed with `bwriter_` or `user_bwriter_`
3. **Two HandCashService files** — `components/services/HandCashService.ts` re-exports from `services/HandCashService.ts`
4. **Quill editor** — primary editor uses Quill 2.0; standalone HTML editor in `public/editor-standalone.html`
5. **Cron jobs** — configured in `vercel.json`, requires `CRON_SECRET` header validation

## Database Tables (on Hetzner Supabase)

- `user_bwriter_balance` — token balances
- `user_bwriter_stakes` — staking records
- `user_bwriter_dividends_owed` — pending dividends
- `user_bwriter_dividend_addresses` — BSV withdrawal addresses
- `bwriter_cap_table` — ownership percentages
- `bwriter_multisig_deposits` — pending blockchain deposits
- `bwriter_dividend_distributions` — distribution history
- `bwriter_revenue_accumulated` — platform revenue

## Development

```bash
pnpm install
pnpm dev          # http://localhost:3000
pnpm build        # Production build
```

## What's Implemented (as of 2026-03-31)

- Document creation/editing with Quill
- Auto-save to localStorage
- HandCash wallet authentication
- BSV blockchain inscription (B, BCAT, D protocols)
- Document version chains with content hashing
- Share token creation for document ownership
- $bWriter staking dashboard with live stats from Supabase
- BSV dividend transfer service (requires BWRITER_MULTISIG_PRIVATE_KEY)
- Live BSV price from CoinGecko/WhatsOnChain
- Task contract service with SHA-256 signatures
- PDF generation (legal agreements)
- Cron jobs for deposit confirmation and dividend distribution
- AI writing assistant (Gemini)
- GitHub + Twitter OAuth

## Known Limitations

- `ignoreBuildErrors: true` — many TS errors exist in legacy code
- BRC100 token deployment sends metadata but needs proper OP_RETURN tx construction
- DEX listing records intent locally but doesn't connect to an actual exchange API
- No test suite
