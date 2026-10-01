# Mobile + bWallet shell

Goal: every Bitcoin Apps Suite bApp works on a phone and inside bWallet's
in-app browser, with **no Bitcoin OS dock** and **no "proof of concept" banner**.
Desktop is unchanged.

## Modes

| Mode | Trigger | `<html>` class |
|------|---------|----------------|
| in-wallet | UA contains `bWallet/` (bWallet sends `bWallet/1 YoursWalletMobile/1`), or `?inwallet=1` for testing | `bw-inwallet` + `bw-compact` |
| compact | in-wallet **or** viewport <= 768px | `bw-compact` |
| desktop | everything else | none, nothing changes |

## Files (copy as-is into each repo)

- `mobile/shell.ts`: `isInWallet()`, `isCompact()`, `applyShellClasses()`, `useCompactShell()` hook
- `mobile/cwi.ts`: BRC-100 sign-in through `window.CWI` (`getPublicKey({ identityKey: true })`).
  It only stores the public identity key. No keys or secrets.
- `mobile/mobile-bwallet.css`: hides `.poc-banner`, `.minimal-dock`,
  `.minimal-dock-container`, `.bitcoin-dock`, `.dev-sidebar`; removes the 40px
  banner padding; blocks horizontal page scroll (grids still scroll inside
  themselves); sets 44px touch targets, 16px inputs (no iOS zoom), safe-area
  insets, and a compact header. Banner and dock are also hidden by a plain
  `@media (max-width: 768px)` rule, so they never show on first paint.

These class names are shared by every suite repo because the shell components
(`ProofOfConceptBanner`/`PocBar`/`StandardPocBar`, `DockManager` ->
`MinimalDock`/`Dock`, `DevSidebar`) were copied from one repo into each of the
others. There is no shared package, so the same CSS works everywhere.

## Wiring

**CRA / Vite** (`src/index.tsx`): import `./mobile/mobile-bwallet.css` and call
`applyShellClasses()` after the last import. CRA's eslint `import/first` rule
fails the build if code sits between imports.

**Next.js App Router** (`app/layout.tsx`): import the CSS and render
`<MobileShellInit />` (a client component that calls `applyShellClasses()`)
as the first child of `<body>`.

**Recommended JSX gating**: render the banner, dock and dev sidebar
conditionally with `const hide = useCompactShell()`, so they never mount on
mobile.

**Sign-in**: when `hasCWI()` is true, the Connect action calls
`signInWithCWI()` and passes the returned user (same shape as `HandCashUser`)
to the existing login handler. Otherwise it falls back to HandCash. On load,
check `getStoredCWIUser()` before the HandCash session.

## Rolling out to another repo

(Script lives in bitcoin-spreadsheet, branch feat/mobile-bwallet.)

```bash
gh repo clone bitcoin-apps-suite/bitcoin-<app> -- --depth 1
/path/to/bitcoin-spreadsheet/scripts/apply-mobile-bwallet.sh ./bitcoin-<app>
# then do the manual steps the script prints, build with the repo's package manager, screenshot, commit, push the branch
```

The script creates `feat/mobile-bwallet`, detects the package manager and the
framework, copies the files and wires the entry point. It never commits or
pushes.

## Verify

At 390x844 with UA `... bWallet/1 YoursWalletMobile/1`:
`document.documentElement.scrollWidth === innerWidth`, no `.poc-banner` or
dock, and every visible button is at least 44px. At 1440px the page should
match `main` pixel for pixel.

## Notes for this repo

- JSX gating not done (Next.js SSR: `useCompactShell()` differs server vs client, would cause hydration mismatch). Banner/dock hidden by CSS only.
- TODO(CWI): several login entry points; wire `signInWithCWI()` from `mobile/cwi.ts` into the main connect handler in the layout pass.
