# Python SDK Guide

## Setup

```bash
pip install requests
```

## Minimal Client

```python
import requests
from typing import Any, Dict


class BitcoinWriterClient:
    def __init__(self, base_url: str = "https://bitcoin-writer.vercel.app") -> None:
        self.base_url = base_url.rstrip("/")
        self.session = requests.Session()
        self.session.headers.update({"Accept": "application/json"})

    def _get(self, path: str, **kwargs) -> Dict[str, Any]:
        r = self.session.get(f"{self.base_url}{path}", timeout=15, **kwargs)
        r.raise_for_status()
        return r.json()

    def _post(self, path: str, payload: Dict[str, Any]) -> Dict[str, Any]:
        r = self.session.post(f"{self.base_url}{path}", json=payload, timeout=15)
        r.raise_for_status()
        return r.json()

    def get_bsv_price(self) -> Dict[str, Any]:
        return self._get("/api/prices/bsv")

    def get_bwriter_price(self) -> Dict[str, Any]:
        return self._get("/api/prices/bwriter")

    def get_orderbook(self, symbol: str) -> Dict[str, Any]:
        return self._get(f"/api/exchange/orderbook/{symbol}")

    def get_balance(self, address: str) -> Dict[str, Any]:
        return self._get(f"/api/balance/bwriter/{address}")

    def get_marketplace_documents(self, author_type: str = "human") -> Dict[str, Any]:
        return self._post("/api/marketplace", {"action": "getNftDocuments", "authorType": author_type})
```

## Usage Example

```python
client = BitcoinWriterClient("http://localhost:3000")

bsv = client.get_bsv_price()
print("BSV USD:", bsv.get("price_usd"))

orderbook = client.get_orderbook("bwriter")
print("Best bid:", orderbook.get("orderbook", {}).get("bids", [None])[0])
```

## Multipart Form Submission Example

```python
import requests

url = "http://localhost:3000/api/grants/author/submit"
data = {
    "projectTitle": "Research report",
    "description": "Long-form report on BSV creator economy",
    "contentType": "report",
    "targetAudience": "developers",
    "estimatedLength": "5000",
    "walletAddress": "1ExampleWallet...",
    "timeline": "2 weeks",
    "writingSamples": "https://example.com/portfolio",
    "researchPlan": "Outline + method"
}

resp = requests.post(url, data=data, timeout=30)
print(resp.status_code, resp.json())
```
