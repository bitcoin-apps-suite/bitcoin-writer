# Bitcoin Writer

A writing platform built on Bitcoin SV. Create and edit documents, inscribe them
on-chain, tokenise them, and earn via micropayments.

**Live:** [bitcoin-writer.vercel.app](https://bitcoin-writer.vercel.app)
**Token:** $bWriter (BSV-20, 1B supply)

## License

**Open BSV License version 5** — see [LICENSE](LICENSE) for the full text.

Copyright © 2025 The Bitcoin Corporation LTD
Registered in England and Wales • Company No. 16735102

The key condition of this license is that the Software, and any software derived
from it, **may only be used on the Bitcoin SV blockchains**. Note that the Open
BSV License is source-available rather than OSI-approved open source: the
BSV-only use restriction, and the fact that permission is revocable by the BSV
Association, place it outside the OSI definition.

This project is **not** licensed under the GPL, AGPL, or any other GNU license.

No third-party source code is vendored into this repository. Where a dependency
offers a dual license that includes a GNU option, this project elects the
permissive option. See the `THIRD-PARTY COMPONENTS` section of [LICENSE](LICENSE)
for details.

## Tech stack

- **Framework:** Next.js 16 (App Router, plus Pages Router for OAuth callbacks)
- **Editor:** Quill 2.0 via react-quill
- **Blockchain:** `@bsv/sdk`, micro-ordinals, B/BCAT/D inscription protocols
- **Auth:** HandCash OAuth (primary), GitHub, Twitter
- **Payments:** Stripe and HandCash BSV micropayments
- **Database:** Supabase
- **Package manager:** pnpm

## Development

```bash
pnpm install
pnpm dev      # http://localhost:3000
pnpm build    # production build
```

Copy `.env.example` to `.env.local` and fill in the required values — HandCash
app credentials, Supabase URL and keys, and the $bWriter staking config. Never
commit `.env.local`.

## Status

Working today: document creation and editing, autosave, HandCash wallet auth,
BSV inscription with version chains and content hashing, share-token creation,
the $bWriter staking dashboard, PDF generation for legal agreements, and cron
jobs for deposit confirmation and dividend distribution.

Known gaps: there is no test suite, `ignoreBuildErrors` is enabled because of
type errors in legacy code, BRC-100 token deployment still needs proper
OP_RETURN transaction construction, and DEX listing records intent locally
without connecting to a live exchange API.
