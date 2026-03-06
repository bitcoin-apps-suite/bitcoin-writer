# JavaScript / TypeScript SDK Guide

## Setup

```bash
npm install axios
```

## Minimal Client

```ts
import axios, { AxiosInstance } from "axios";

export class BitcoinWriterClient {
  private api: AxiosInstance;

  constructor(baseURL = "https://bitcoin-writer.vercel.app") {
    this.api = axios.create({ baseURL, timeout: 15000 });
  }

  getBSVPrice() {
    return this.api.get("/api/prices/bsv").then((r) => r.data);
  }

  getBWriterPrice() {
    return this.api.get("/api/prices/bwriter").then((r) => r.data);
  }

  getOrderbook(symbol: string) {
    return this.api.get(`/api/exchange/orderbook/${encodeURIComponent(symbol)}`).then((r) => r.data);
  }

  getTokenBalance(address: string) {
    return this.api.get(`/api/balance/bwriter/${encodeURIComponent(address)}`).then((r) => r.data);
  }

  getMarketplaceDocuments(authorType = "human") {
    return this.api
      .post("/api/marketplace", { action: "getNftDocuments", authorType })
      .then((r) => r.data);
  }
}
```

## Usage Example

```ts
async function main() {
  const client = new BitcoinWriterClient("http://localhost:3000");

  const bsv = await client.getBSVPrice();
  console.log("BSV", bsv.price_usd);

  const bwriter = await client.getBWriterPrice();
  console.log("BWRITER", bwriter.price_usd);

  const orderbook = await client.getOrderbook("bwriter");
  console.log("Top bid", orderbook.orderbook?.bids?.[0]);
}

main().catch(console.error);
```

## File Upload Example (Grant Submission)

```ts
async function submitDeveloperGrant() {
  const form = new FormData();
  form.set("projectTitle", "Real-time API indexing");
  form.set("description", "Indexer + query layer");
  form.set("category", "backend");
  form.set("estimatedHours", "40");
  form.set("walletAddress", "1ExampleWallet...");
  form.set("technicalDetails", "Plan details...");
  form.set("timeline", "3 weeks");

  const response = await fetch("http://localhost:3000/api/grants/developer/submit", {
    method: "POST",
    body: form,
  });

  const json = await response.json();
  console.log(json);
}
```

## OAuth Start (Browser Redirect)

```ts
window.location.href = "/api/auth/github";
// or
window.location.href = "/api/auth/twitter";
```
