# Bitcoin Writer API Reference

This document summarizes the currently implemented HTTP API surface in this repository.

Base URL (local): `http://localhost:3000`

Base URL (production): `https://bitcoin-writer.vercel.app`

OpenAPI file: [`/openapi.yaml`](../public/openapi.yaml)

Interactive explorer: [`/api-explorer.html`](../public/api-explorer.html)

## Authentication

Two OAuth providers are implemented:

- GitHub OAuth (`/api/auth/github`, `/api/auth/callback/github`, `/api/auth/github/token`)
- Twitter OAuth 2.0 (`/api/auth/twitter`, `/api/auth/callback/twitter`)

Most app-router endpoints currently use public access and do not enforce bearer token checks server-side.
OAuth endpoints use secure HttpOnly cookies to track OAuth state.

## Main REST Endpoints

### Market & Pricing

- `GET /api/prices/bsv`
- `GET /api/prices/bwriter`
- `GET /api/market/bwriter`
- `GET /api/exchange/orderbook/{symbol}`
- `GET /api/balance/bwriter/{address}`

### Marketplace

- `POST /api/marketplace`
  - Supported action now: `getNftDocuments`

### Deployment

- `POST /api/deploy-bwriter`
  - `action=deploy_and_mint`
  - `action=check_status`
- `GET /api/deploy-bwriter?action=wallet_status`
- `GET /api/deploy-bwriter?action=founder_balance`

### Grants

- `GET /api/grants/list`
- `GET /api/grants/update?id=...`
- `PUT /api/grants/update`
- `POST /api/grants/developer/submit` (multipart form-data)
- `POST /api/grants/author/submit` (multipart form-data)
- `POST /api/grants/publisher/submit` (multipart form-data)

### PDF Contracts

- `GET /api/pdf/term-sheet`
- `GET /api/pdf/subscription-agreement`
- `GET /api/pdf/shareholder-agreement`
- `GET /api/pdf/kyc-compliance`
- `GET /api/pdf/aml-compliance`

Each returns `application/pdf` if the file exists under `pdf-contracts/`, otherwise returns generated fallback content or JSON error depending on route.

## Error Handling

Common response patterns used across endpoints:

- `400` invalid action / missing field / bad query param
- `404` not found
- `405` method not allowed
- `500` internal error

Typical JSON error shape:

```json
{
  "error": "Human-readable message"
}
```

or:

```json
{
  "success": false,
  "error": "Human-readable message"
}
```

## Rate Limiting

No explicit server-side rate limiter is currently implemented in route handlers.
Price endpoints apply short cache headers and upstream API revalidation windows to reduce external API pressure.

Recommended client behavior:

- Poll market/price endpoints at `>= 30s`
- Use exponential backoff on `5xx`
- Avoid burst retries across parallel tabs/clients

## WebSocket Guide

The repository includes client-side WebSocket support in `services/PriceService.ts` via:

- `connectWebSocket(symbol, wsUrl)`

Expected message shape (from code path):

```json
{
  "symbol": "BSV",
  "price": 52.1,
  "price_usd": 52.1
}
```

Current server-side WebSocket endpoints are not exposed by Next.js route handlers in this repository.
Use WebSocket feeds from your own market data provider and pass feed URLs into `PriceService.connectWebSocket(...)`.

## API Changelog

### 2026-03-06

- Added OpenAPI 3.0 specification at `public/openapi.yaml`
- Added language-specific SDK usage guides (JavaScript/TypeScript, Python, PHP)
- Added static interactive API explorer at `public/api-explorer.html`
- Added consolidated API reference document (`docs/API_REFERENCE.md`)
