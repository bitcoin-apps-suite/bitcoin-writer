# $BWRITER — what it is, and what must not be published

**Written 22 September 2026. Read this before touching anything token-related in this repo.**

## What changed today

The `/token` page was already removed into `.cleanup-backup/removed-routes/token/`. It stated
a **1,000,000,000 total supply** (which settles the supply question — see below) and this:

> **Revenue Sharing Model:** …token holders may receive dividends based on platform revenues
> from subscriptions and exchange fees.
>
> **Trading & Liquidity:** …intended to be freely tradable on the Bitcoin Writer Exchange…
> We encourage an active secondary market to provide liquidity and price discovery.

Revenue share + free transferability + an issuer who manages the underlying property is, in
UK terms, close to the definition of a **collective investment scheme** (FSMA 2000 s.235).
Operating an unauthorised one engages the general prohibition, and s.238 restricts promoting
one *even privately*. Free tradability also makes the token a *readily convertible asset*,
which puts PAYE and NIC on the company for anything paid to a contributor in it.

**`app/api/pdf/term-sheet/route.ts` has been closed** (returns 404 behind
`BWRITER_TERM_SHEET_APPROVED`). It served — unauthenticated, to anyone with the URL — a term
sheet naming bCorp as issuer, "Security Type: bWriter Shares", and **"Offering: 10%
(100,000,000 bWriter shares) for $10,000"** at a $100,000 post-money valuation. bCorp is a
private company and CA 2006 s.755 prohibits a private company offering securities to the
public. The route's own header explains what must happen before it reopens.

Still present and **authenticated**, so not public offers, but built for the model being
replaced — review before relying on them:
`app/api/bwriter/dividend-address/route.ts`, `app/api/bwriter/stake/route.ts`,
`components/bwriter/WithdrawalAddressForm.tsx`.

## The supply, settled

**1,000,000,000.** Confirmed in the removed `/token` page, `app/api/bwriter/stake/route.ts`
(max 1e9), `app/api/pdf/term-sheet/route.ts` and `components/ui/DevSidebar.tsx`.

⚠ **Therefore five of the six rewarded issues are wrong by a factor of 1,000:**

| Issue | Tokens | Says | Correct at 1B supply |
|---|---|---|---|
| #48 | 10,000 | 0.001% | ✅ correct |
| #49 | 10,000 | 1.0% | 0.001% |
| #50 | 8,000 | 0.8% | 0.0008% |
| #51 | 9,000 | 0.9% | 0.0009% |
| #52 | 10,000 | 1.0% | 0.001% |
| #53 | 7,000 | 0.7% | 0.0007% |

Those five imply a 1,000,000 supply. As written they offer **4.4% of the company** for six
pieces of work; the intended total is about **0.0044%**.

## The structure being built instead

> **The token is a record. The contract is the claim.**

1. **Public GitHub issues describe the WORK only.** No percentage, no token count, no
   valuation. A public issue stating a price is an offer of securities to the public and is
   the single thing that breaks this.
2. **The offer is made privately**, in the product's bit-sign room, to a named person, under
   a Financial Promotion Order exemption (art 43 members/creditors, art 48 certified high net
   worth, or art 50A self-certified sophisticated — the 2024 thresholds moved twice, so
   confirm the current figures rather than trusting a remembered number).
3. **The instrument is either** a contingent entitlement deed
   (`bitcoin-corp/contracts/templates/Contributor_Entitlement_Deed_TEMPLATE_NDS.html`) **or**
   a real share in an alphabet/tracking class of bCorp whose dividend rights follow this
   product. The second is what this repo's own term sheet already describes when it says
   *"bWriter Shares (product-specific voting rights)"* — and it gives real shares, real
   dividends and private transferability without incorporating a new company.
4. **bit-sign is a registrar and a document tool. It must never be a market.** Bringing
   buyers and sellers of shares together is *arranging deals in investments* (RAO art 25) and
   requires FCA authorisation. Transfers happen bilaterally: the parties agree, the company
   approves under its articles, a J30 is executed, stamp duty at 0.5% applies over £1,000.

⚠ **Note what issues #48–#53 actually are:** the exchange frontend, the exchange backend
APIs, exchange security, exchange deployment, and ordinals marketplace integration. They are
a plan to build an order book for these tokens — i.e. precisely the thing at (4) that would
require authorisation. That is worth deciding on before paying for any of it.

## Outstanding — none of this is legal advice

One hour with a solicitor, covering:
1. Can bCorp create a **bWriter tracking share class** in its articles, and on what terms?
2. Which **FPO exemption** covers offering it to a developer first reached through a public
   GitHub issue?
3. Does anything **already published** need withdrawing — the term sheet was live, and the
   `/token` page was live before it was removed?
4. Is the contingent entitlement at clause 4 of the deed a **specified investment** or a
   **CIS interest**?
5. **ITEPA 2003 Part 7** (employment-related securities) — anything reportable on grant?
