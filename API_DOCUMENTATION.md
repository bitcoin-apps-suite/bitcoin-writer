# Bitcoin Writer - API Documentation

This document provides a comprehensive overview of the core service architecture and API interfaces for the Bitcoin Writer platform.

## Core Services

The platform follows a service-oriented architecture, with each core functionality encapsulated in a dedicated service class located in `/services/`.

### 1. AIService
Handles interactions with multiple LLM providers (Gemini, OpenAI, Claude, Local) and maintains an on-chain interaction chain.

**Interface:**
```typescript
interface AIProvider {
  id: string;
  name: string;
  apiKeyRequired: boolean;
  endpoint?: string;
}

interface AIMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

interface AIResponse {
  content: string;
  tokensUsed?: number;
  model?: string;
  utxoHash?: string;
}
```

**Methods:**
- `generateResponse(prompt: string, provider: string, context?: AIMessage[]): Promise<AIResponse>`: Main entry point for generating AI content.
- `setApiKey(provider: string, apiKey: string): void`: Configure API keys for specific providers.
- `getProviders(): AIProvider[]`: List available AI providers and their requirements.
- `getInteractionChain(): AIInteraction[]`: Retrieve the history of AI interactions.

---

### 2. HandCashService
Manages authentication, user profiles, and blockchain payments via the HandCash SDK.

**Key Methods:**
- `authenticate(): Promise<void>`: Initiate HandCash OAuth flow.
- `getCurrentUser(): any`: Get authenticated user profile data.
- `pay(amount: number, currency: string, destination: string): Promise<string>`: Execute an on-chain payment.

---

### 3. BlockchainDocumentService
Handles the persistence of documents to the BSV blockchain using various protocols (Bcat, B, D).

**Key Features:**
- **Immutable Storage**: Documents are inscribed as UTXOs.
- **Version Control**: Uses a hash-chain mechanism to track document revisions on-chain.
- **Metadata Management**: Stores titles, tags, and license info in the D-protocol.

---

### 4. MonetizationService
Orchestrates content gating and payment verification.

**Methods:**
- `isContentUnlocked(txid: string): Promise<boolean>`: Verify if a document has been paid for by the current user.
- `createPaymentRequest(amount: number): Promise<string>`: Generate a payment URI for content access.

---

## Data Models

### Document Schema
```typescript
interface BlockchainDocument {
  txid?: string;
  title: string;
  content: string;
  author: string;
  timestamp: number;
  tags: string[];
  license: string;
  version: string;
  previousTxid?: string;
}
```

## Editor Components

### QuillEditor
A React component wrapper for the Quill editor with integrated writing analytics.

**Props:**
```typescript
interface QuillEditorProps {
  content: string;
  onChange: (content: string) => void;
  onTextChange?: (text: string) => void;
  placeholder?: string;
}
```

### WritingAnalytics
A sub-component that calculates real-time metrics.

**Features:**
- **Word/Char Count**: Live tracking.
- **Time Estimates**: Reading and Speaking time.
- **Productivity**: 🔥 Daily streaks and target word goals (configured via `LocalStorage`).

---

## Integration Guide

To integrate a new service, follow the pattern established in `AIService`:
1. Define clear interfaces in the service file.
2. Maintain state using a combination of class properties and `LocalStorage` for persistence.
3. Inject the `HandCashService` if blockchain interactions are required.
