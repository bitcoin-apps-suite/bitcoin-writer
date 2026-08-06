# Bitcoin Writer API Specification

## 🚀 Overview
The Bitcoin Writer API provides endpoints for document management, blockchain integration, and monetization. It is built on Next.js 15.5.5 and integrates with the Bitcoin SV blockchain via HandCash.

## 🔑 Authentication
Authentication is handled via **HandCash Connect OAuth 2.0**.
- Header: `Authorization: Bearer <accessToken>`
- SDK: Use `HandCashAuthService` to manage tokens.

## 📝 Document API

### GET /api/documents
Fetch list of user documents.
- **Auth required**: Yes
- **Query Params**:
  - `limit`: number (default 20)
  - `offset`: number
- **Response**: `200 OK` with JSON array of documents.

### POST /api/documents/save
Save document content and generate proof-of-authorship hash.
- **Auth required**: Yes
- **Body**:
  - `title`: string
  - `content`: string (HTML/Markdown)
  - `storageType`: 'bsv' | 'encrypted' | 'local'
- **Response**: `201 Created` with `txId` and `hash`.

## 💰 Staking & Tokens (BWRITER)

### GET /api/bwriter/stats
Global aggregate stats for the BWRITER token ecosystem.
- **Auth required**: No
- **Response**:
  ```json
  {
    "totalStaked": 150000,
    "totalUsers": 45,
    "totalDistributed": 5000,
    "platformRevenue": 12000
  }
  ```

### POST /api/bwriter/stake
Stake BWRITER tokens to earn rewards.
- **Auth required**: Yes
- **Body**:
  ```json
  {
    "amount": 1000,
    "durationDays": 30
  }
  ```

## 🔗 Blockchain Protocols
The platform supports standard BSV content protocols:
- **B://**: Binary file storage.
- **BCAT**: Chunked data for large documents.
- **D://**: Dynamic metadata updates.

## 🛠️ Errors
Common HTTP status codes used:
- `401 Unauthorized`: Missing or invalid token.
- `402 Payment Required`: Insufficient satoshis for blockchain write.
- `422 Unprocessable Entity`: Validation failure.
