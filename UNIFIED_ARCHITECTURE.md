# Bitcoin Writer - Unified Multi-Platform Architecture

**Goal**: Write code once, deploy to Web, PWA, Chrome Extension, and Electron with minimal platform-specific changes.

---

## Architecture Overview

```
┌─────────────────────────────────────────────────────────────┐
│                    SHARED CORE PACKAGE                       │
│              @bitcoin-writer/core                            │
│  ┌──────────────────────────────────────────────────────┐  │
│  │ • React Components (Editor, Modals, UI)              │  │
│  │ • Business Logic (Document management, blockchain)   │  │
│  │ • Services (HandCash, Storage, API clients)          │  │
│  │ • State Management (Zustand/Context)                 │  │
│  │ • Types & Utilities                                  │  │
│  └──────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
                          ↓ ↓ ↓ ↓
        ┌─────────────────┴─┴─┴─┴─────────────────┐
        ↓                 ↓     ↓                  ↓
┌───────────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐
│   WEB APP     │  │   PWA    │  │  CHROME  │  │ ELECTRON │
│   (Next.js)   │  │ (Next.js)│  │   EXT    │  │  (macOS/ │
│               │  │  +SW     │  │          │  │  Win/Lin)│
│ Platform:     │  │ Platform:│  │ Platform:│  │ Platform:│
│ • Routing     │  │ • SW     │  │ • Popup  │  │ • Menu   │
│ • SEO         │  │ • Install│  │ • BG Svc │  │ • Tray   │
│ • SSR         │  │ • Offline│  │ • Storage│  │ • Auto-  │
│               │  │          │  │          │  │   update │
└───────────────┘  └──────────┘  └──────────┘  └──────────┘
```

---

## Project Structure (Monorepo with pnpm Workspaces)

```
bitcoin-OS/
├── pnpm-workspace.yaml               # Already exists!
├── package.json                      # Root package
├── packages/                         # Shared packages
│   ├── bitcoin-writer-core/         # 🎯 THE CORE - 95% of code here
│   │   ├── src/
│   │   │   ├── components/          # All React components
│   │   │   │   ├── editor/
│   │   │   │   │   ├── DocumentEditor.tsx
│   │   │   │   │   ├── EditorToolbar.tsx
│   │   │   │   │   ├── SaveToChainModal.tsx
│   │   │   │   │   └── index.ts
│   │   │   │   ├── ui/
│   │   │   │   │   ├── Button.tsx
│   │   │   │   │   ├── Modal.tsx
│   │   │   │   │   └── index.ts
│   │   │   │   └── index.ts
│   │   │   ├── services/            # Business logic
│   │   │   │   ├── blockchain/
│   │   │   │   │   ├── BlockchainDocumentService.ts
│   │   │   │   │   └── HandCashService.ts
│   │   │   │   ├── storage/
│   │   │   │   │   ├── StorageAdapter.ts     # Abstract
│   │   │   │   │   ├── LocalStorageAdapter.ts
│   │   │   │   │   ├── ChromeStorageAdapter.ts
│   │   │   │   │   └── ElectronStorageAdapter.ts
│   │   │   │   ├── api/
│   │   │   │   │   └── ExchangeAPIClient.ts
│   │   │   │   └── index.ts
│   │   │   ├── store/               # State management
│   │   │   │   ├── documentStore.ts
│   │   │   │   ├── authStore.ts
│   │   │   │   └── index.ts
│   │   │   ├── hooks/               # Shared React hooks
│   │   │   │   ├── useDocument.ts
│   │   │   │   ├── useBlockchain.ts
│   │   │   │   └── index.ts
│   │   │   ├── types/               # TypeScript types
│   │   │   │   ├── document.ts
│   │   │   │   ├── blockchain.ts
│   │   │   │   └── index.ts
│   │   │   ├── utils/               # Utilities
│   │   │   │   ├── format.ts
│   │   │   │   ├── validation.ts
│   │   │   │   └── index.ts
│   │   │   ├── styles/              # Shared CSS
│   │   │   │   ├── globals.css
│   │   │   │   └── theme.css
│   │   │   └── index.ts             # Main export
│   │   ├── package.json
│   │   └── tsconfig.json
│   │
│   ├── bitcoin-os-dock/             # Already exists
│   └── bitcoin-os-state/            # Already exists
│
└── apps/                            # Platform-specific apps
    ├── bitcoin-writer/              # 🌐 Web App (Next.js)
    │   ├── app/
    │   │   ├── page.tsx             # Uses @bitcoin-writer/core
    │   │   ├── write/page.tsx
    │   │   └── layout.tsx
    │   ├── package.json
    │   └── next.config.js
    │
    ├── bitcoin-writer-pwa/          # 📱 PWA (Next.js + SW)
    │   ├── app/
    │   │   └── (same as web)
    │   ├── public/
    │   │   ├── manifest.json
    │   │   └── sw.js               # Service Worker
    │   └── package.json
    │
    ├── bitcoin-writer-extension/    # 🧩 Chrome Extension
    │   ├── src/
    │   │   ├── popup/
    │   │   │   └── index.tsx       # Uses @bitcoin-writer/core
    │   │   ├── background/
    │   │   │   └── service-worker.ts
    │   │   ├── content/
    │   │   │   └── content-script.ts
    │   │   └── manifest.json
    │   ├── package.json
    │   └── webpack.config.js
    │
    └── bitcoin-writer-desktop/      # 💻 Electron
        ├── src/
        │   ├── main/                # Electron main process
        │   │   ├── main.ts
        │   │   ├── menu.ts
        │   │   └── auto-updater.ts
        │   ├── preload/
        │   │   └── preload.ts
        │   └── renderer/            # Uses @bitcoin-writer/core
        │       └── index.tsx
        ├── package.json
        └── electron-builder.yml
```

---

## Key Principle: Abstract Platform Differences

### Storage Abstraction Example

**Core Package** (`@bitcoin-writer/core`):
```typescript
// packages/bitcoin-writer-core/src/services/storage/StorageAdapter.ts
export interface StorageAdapter {
  get(key: string): Promise<string | null>;
  set(key: string, value: string): Promise<void>;
  remove(key: string): Promise<void>;
  clear(): Promise<void>;
}

// packages/bitcoin-writer-core/src/services/storage/LocalStorageAdapter.ts
export class LocalStorageAdapter implements StorageAdapter {
  async get(key: string): Promise<string | null> {
    return localStorage.getItem(key);
  }

  async set(key: string, value: string): Promise<void> {
    localStorage.setItem(key, value);
  }

  async remove(key: string): Promise<void> {
    localStorage.removeItem(key);
  }

  async clear(): Promise<void> {
    localStorage.clear();
  }
}

// packages/bitcoin-writer-core/src/services/storage/ChromeStorageAdapter.ts
export class ChromeStorageAdapter implements StorageAdapter {
  async get(key: string): Promise<string | null> {
    const result = await chrome.storage.local.get(key);
    return result[key] || null;
  }

  async set(key: string, value: string): Promise<void> {
    await chrome.storage.local.set({ [key]: value });
  }

  async remove(key: string): Promise<void> {
    await chrome.storage.local.remove(key);
  }

  async clear(): Promise<void> {
    await chrome.storage.local.clear();
  }
}

// packages/bitcoin-writer-core/src/services/storage/ElectronStorageAdapter.ts
import { ipcRenderer } from 'electron';

export class ElectronStorageAdapter implements StorageAdapter {
  async get(key: string): Promise<string | null> {
    return ipcRenderer.invoke('storage:get', key);
  }

  async set(key: string, value: string): Promise<void> {
    await ipcRenderer.invoke('storage:set', key, value);
  }

  async remove(key: string): Promise<void> {
    await ipcRenderer.invoke('storage:remove', key);
  }

  async clear(): Promise<void> {
    await ipcRenderer.invoke('storage:clear');
  }
}

// packages/bitcoin-writer-core/src/services/storage/index.ts
export * from './StorageAdapter';
export * from './LocalStorageAdapter';
export * from './ChromeStorageAdapter';
export * from './ElectronStorageAdapter';
```

### Using the Abstraction in Apps

**Web App** (`apps/bitcoin-writer`):
```typescript
// apps/bitcoin-writer/app/page.tsx
import { DocumentEditor, LocalStorageAdapter } from '@bitcoin-writer/core';

export default function Page() {
  const storageAdapter = new LocalStorageAdapter();

  return <DocumentEditor storage={storageAdapter} />;
}
```

**Chrome Extension** (`apps/bitcoin-writer-extension`):
```typescript
// apps/bitcoin-writer-extension/src/popup/index.tsx
import { DocumentEditor, ChromeStorageAdapter } from '@bitcoin-writer/core';

export default function Popup() {
  const storageAdapter = new ChromeStorageAdapter();

  return <DocumentEditor storage={storageAdapter} />;
}
```

**Electron** (`apps/bitcoin-writer-desktop`):
```typescript
// apps/bitcoin-writer-desktop/src/renderer/index.tsx
import { DocumentEditor, ElectronStorageAdapter } from '@bitcoin-writer/core';

export default function App() {
  const storageAdapter = new ElectronStorageAdapter();

  return <DocumentEditor storage={storageAdapter} />;
}
```

---

## Development Workflow

### Step 1: Work in Core Package (95% of time)

```bash
cd packages/bitcoin-writer-core

# Make changes to components, services, etc.
# Everything is platform-agnostic

# Watch mode for development
pnpm dev
```

### Step 2: Test Across Platforms (5% of time)

```bash
# Web app
cd apps/bitcoin-writer
pnpm dev

# Chrome extension
cd apps/bitcoin-writer-extension
pnpm dev

# Electron
cd apps/bitcoin-writer-desktop
pnpm dev
```

### Step 3: Build All Platforms (Automated)

```bash
# From root
pnpm build:all

# This runs:
# - pnpm --filter @bitcoin-writer/core build
# - pnpm --filter bitcoin-writer build
# - pnpm --filter bitcoin-writer-extension build
# - pnpm --filter bitcoin-writer-desktop build
```

---

## Build Pipeline (CI/CD)

### GitHub Actions Workflow

```yaml
# .github/workflows/build-all-platforms.yml
name: Build All Platforms

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  build-core:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: pnpm/action-setup@v2
        with:
          version: 8
      - uses: actions/setup-node@v3
        with:
          node-version: 18
          cache: 'pnpm'

      - run: pnpm install
      - run: pnpm --filter @bitcoin-writer/core build
      - run: pnpm --filter @bitcoin-writer/core test

      # Cache core build for other jobs
      - uses: actions/cache@v3
        with:
          path: packages/bitcoin-writer-core/dist
          key: core-${{ github.sha }}

  build-web:
    needs: build-core
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: pnpm/action-setup@v2
      - uses: actions/setup-node@v3
        with:
          node-version: 18
          cache: 'pnpm'

      - run: pnpm install
      - run: pnpm --filter bitcoin-writer build

      # Deploy to Vercel
      - uses: amondnet/vercel-action@v25
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}

  build-extension:
    needs: build-core
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: pnpm/action-setup@v2
      - uses: actions/setup-node@v3

      - run: pnpm install
      - run: pnpm --filter bitcoin-writer-extension build

      - uses: actions/upload-artifact@v3
        with:
          name: chrome-extension
          path: apps/bitcoin-writer-extension/dist/

  build-desktop:
    needs: build-core
    strategy:
      matrix:
        os: [macos-latest, ubuntu-latest, windows-latest]
    runs-on: ${{ matrix.os }}
    steps:
      - uses: actions/checkout@v3
      - uses: pnpm/action-setup@v2
      - uses: actions/setup-node@v3

      - run: pnpm install
      - run: pnpm --filter bitcoin-writer-desktop build
      - run: pnpm --filter bitcoin-writer-desktop dist

      - uses: actions/upload-artifact@v3
        with:
          name: desktop-${{ matrix.os }}
          path: apps/bitcoin-writer-desktop/dist/
```

---

## Package Configuration

### Root `pnpm-workspace.yaml` (Already exists!)

```yaml
packages:
  - 'apps/*'
  - 'packages/*'
```

### Root `package.json`

```json
{
  "name": "bitcoin-os-monorepo",
  "version": "1.0.0",
  "private": true,
  "scripts": {
    "dev": "pnpm --parallel --filter \"@bitcoin-writer/*\" dev",
    "dev:web": "pnpm --filter bitcoin-writer dev",
    "dev:extension": "pnpm --filter bitcoin-writer-extension dev",
    "dev:desktop": "pnpm --filter bitcoin-writer-desktop dev",

    "build": "pnpm --filter \"@bitcoin-writer/*\" build",
    "build:core": "pnpm --filter @bitcoin-writer/core build",
    "build:web": "pnpm --filter bitcoin-writer build",
    "build:extension": "pnpm --filter bitcoin-writer-extension build",
    "build:desktop": "pnpm --filter bitcoin-writer-desktop build",
    "build:all": "pnpm build:core && pnpm --parallel build:web build:extension build:desktop",

    "test": "pnpm --recursive test",
    "lint": "pnpm --recursive lint",
    "clean": "pnpm --recursive clean && rm -rf node_modules"
  },
  "devDependencies": {
    "@types/node": "^20.0.0",
    "typescript": "^5.3.0",
    "turbo": "^1.11.0"
  }
}
```

### Core Package `packages/bitcoin-writer-core/package.json`

```json
{
  "name": "@bitcoin-writer/core",
  "version": "1.0.0",
  "main": "./dist/index.js",
  "types": "./dist/index.d.ts",
  "exports": {
    ".": {
      "import": "./dist/index.js",
      "types": "./dist/index.d.ts"
    },
    "./components": {
      "import": "./dist/components/index.js",
      "types": "./dist/components/index.d.ts"
    },
    "./services": {
      "import": "./dist/services/index.js",
      "types": "./dist/services/index.d.ts"
    },
    "./styles": "./dist/styles/globals.css"
  },
  "scripts": {
    "dev": "tsup --watch",
    "build": "tsup",
    "test": "vitest",
    "lint": "eslint src/"
  },
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "zustand": "^4.4.0",
    "@tiptap/react": "^2.1.0",
    "@tiptap/starter-kit": "^2.1.0"
  },
  "devDependencies": {
    "@types/react": "^18.2.0",
    "tsup": "^8.0.0",
    "typescript": "^5.3.0",
    "vitest": "^1.0.0"
  },
  "peerDependencies": {
    "react": "^18.0.0",
    "react-dom": "^18.0.0"
  }
}
```

### Core Package `tsup.config.ts` (Build Configuration)

```typescript
import { defineConfig } from 'tsup';

export default defineConfig({
  entry: {
    index: 'src/index.ts',
    components: 'src/components/index.ts',
    services: 'src/services/index.ts',
    hooks: 'src/hooks/index.ts',
  },
  format: ['esm'],
  dts: true,
  clean: true,
  sourcemap: true,
  external: ['react', 'react-dom'],
  // Copy CSS files
  onSuccess: 'cp -r src/styles dist/styles',
});
```

---

## Migration Plan (From Current State)

### Phase 1: Create Core Package (Week 1)

```bash
# 1. Create core package structure
mkdir -p packages/bitcoin-writer-core/src
cd packages/bitcoin-writer-core

# 2. Initialize package
pnpm init

# 3. Install dependencies
pnpm add react react-dom zustand @tiptap/react @tiptap/starter-kit
pnpm add -D tsup typescript @types/react vitest

# 4. Move shared code from apps/bitcoin-writer to core
# Move components/, services/, hooks/, types/, utils/
mv ../../apps/bitcoin-writer/components ./src/
mv ../../apps/bitcoin-writer/services ./src/
mv ../../apps/bitcoin-writer/hooks ./src/ (if exists)
# etc.

# 5. Create index.ts exports
# packages/bitcoin-writer-core/src/index.ts
```

### Phase 2: Update Web App to Use Core (Week 1)

```bash
cd apps/bitcoin-writer

# 1. Add core package as dependency
pnpm add @bitcoin-writer/core@workspace:*

# 2. Update imports in app/
# Before:
# import { DocumentEditor } from '../components/editor/DocumentEditor'

# After:
# import { DocumentEditor } from '@bitcoin-writer/core/components'

# 3. Remove local copies of moved files
rm -rf components/ services/ hooks/

# 4. Test that web app still works
pnpm dev
```

### Phase 3: Create Extension & Desktop Apps (Week 2)

```bash
# Create extension app
mkdir -p apps/bitcoin-writer-extension
cd apps/bitcoin-writer-extension
pnpm init
pnpm add @bitcoin-writer/core@workspace:*
# ... set up extension-specific code

# Create desktop app (update existing macos-app)
mkdir -p apps/bitcoin-writer-desktop
# Use existing /macos-app as base
# Update to use @bitcoin-writer/core
```

### Phase 4: Set Up CI/CD (Week 2)

```bash
# Create GitHub Actions workflows
mkdir -p .github/workflows
# Add build-all-platforms.yml
```

---

## Platform-Specific Code (The 5%)

### What Goes in Each App?

**Web App** (`apps/bitcoin-writer`):
- Next.js routing (`app/` directory)
- SEO metadata
- Server-side rendering logic
- API routes (if any)
- `next.config.js`

**PWA** (`apps/bitcoin-writer-pwa`):
- Service worker (`public/sw.js`)
- Web app manifest (`public/manifest.json`)
- Install prompt logic
- Offline caching strategy

**Chrome Extension** (`apps/bitcoin-writer-extension`):
- `manifest.json`
- Background service worker
- Content scripts (if needed)
- Popup UI (just renders core components)
- Chrome APIs usage

**Electron** (`apps/bitcoin-writer-desktop`):
- Main process code (`src/main/`)
- Menu bar integration
- System tray
- Auto-updater
- IPC handlers
- Preload script

---

## Benefits of This Architecture

### ✅ Single Source of Truth
- All business logic in `@bitcoin-writer/core`
- Fix a bug once, fixed everywhere

### ✅ Type Safety
- TypeScript across all platforms
- Shared types ensure consistency

### ✅ Easy Testing
- Test core package independently
- Mock platform APIs in tests

### ✅ Fast Iteration
- Change core, see updates in all platforms
- Hot reload in development

### ✅ Code Reuse
- 95% of code shared
- Only 5% platform-specific wrappers

### ✅ Easy Onboarding
- New developers work in core package
- Don't need to understand all platforms

---

## Development Commands Reference

```bash
# Install all dependencies
pnpm install

# Develop core package (watch mode)
pnpm --filter @bitcoin-writer/core dev

# Develop web app
pnpm --filter bitcoin-writer dev

# Develop all platforms in parallel
pnpm --parallel dev

# Build everything
pnpm build:all

# Test everything
pnpm test

# Lint everything
pnpm lint

# Clean everything
pnpm clean

# Add dependency to core
cd packages/bitcoin-writer-core
pnpm add some-package

# Add dependency to web app
cd apps/bitcoin-writer
pnpm add some-package

# Link core to all apps (automatic with pnpm workspace)
pnpm install
```

---

## Example: Adding a New Feature

**Scenario**: Add a "Word Count" feature

### Step 1: Add to Core (One Place)

```typescript
// packages/bitcoin-writer-core/src/hooks/useWordCount.ts
import { useMemo } from 'react';

export function useWordCount(content: string) {
  return useMemo(() => {
    return content.trim().split(/\s+/).length;
  }, [content]);
}

// packages/bitcoin-writer-core/src/components/editor/WordCount.tsx
import React from 'react';
import { useWordCount } from '../../hooks/useWordCount';

export function WordCount({ content }: { content: string }) {
  const count = useWordCount(content);

  return (
    <div className="word-count">
      {count} words
    </div>
  );
}

// Export it
// packages/bitcoin-writer-core/src/index.ts
export { WordCount } from './components/editor/WordCount';
export { useWordCount } from './hooks/useWordCount';
```

### Step 2: Build Core

```bash
cd packages/bitcoin-writer-core
pnpm build
```

### Step 3: Use in All Apps (Automatic!)

**Web**:
```typescript
// apps/bitcoin-writer/app/write/page.tsx
import { WordCount } from '@bitcoin-writer/core';

export default function WritePage() {
  return <WordCount content={content} />;
}
```

**Extension**:
```typescript
// apps/bitcoin-writer-extension/src/popup/index.tsx
import { WordCount } from '@bitcoin-writer/core';

export default function Popup() {
  return <WordCount content={content} />;
}
```

**Electron**:
```typescript
// apps/bitcoin-writer-desktop/src/renderer/index.tsx
import { WordCount } from '@bitcoin-writer/core';

export default function App() {
  return <WordCount content={content} />;
}
```

**Result**: Feature added to all 4 platforms by writing code once!

---

## Next Steps

1. **This Week**: Create `packages/bitcoin-writer-core/` structure
2. **Week 1**: Migrate shared code to core package
3. **Week 1**: Update web app to use core
4. **Week 2**: Create extension and desktop app wrappers
5. **Week 2**: Set up CI/CD pipeline
6. **Week 3+**: Develop new features in core, enjoy automatic platform updates!

This architecture will save you months of duplicate work and ensure all platforms stay in sync.
