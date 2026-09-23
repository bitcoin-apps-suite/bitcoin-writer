# PHP SDK Guide

## Setup

PHP 8.1+ with cURL extension enabled.

## Minimal Client

```php
<?php

class BitcoinWriterClient {
    private string $baseUrl;

    public function __construct(string $baseUrl = 'https://bitcoin-writer.vercel.app') {
        $this->baseUrl = rtrim($baseUrl, '/');
    }

    private function request(string $method, string $path, ?array $payload = null): array {
        $ch = curl_init($this->baseUrl . $path);
        $headers = ['Accept: application/json'];

        if ($method === 'POST') {
            curl_setopt($ch, CURLOPT_POST, true);
            if ($payload !== null) {
                $headers[] = 'Content-Type: application/json';
                curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($payload));
            }
        }

        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($ch, CURLOPT_TIMEOUT, 15);
        curl_setopt($ch, CURLOPT_HTTPHEADER, $headers);

        $raw = curl_exec($ch);
        $status = curl_getinfo($ch, CURLINFO_HTTP_CODE);
        curl_close($ch);

        if ($status >= 400) {
            throw new RuntimeException("HTTP {$status}: {$raw}");
        }

        return json_decode($raw, true);
    }

    public function getBSVPrice(): array {
        return $this->request('GET', '/api/prices/bsv');
    }

    public function getBWriterPrice(): array {
        return $this->request('GET', '/api/prices/bwriter');
    }

    public function getOrderbook(string $symbol): array {
        return $this->request('GET', '/api/exchange/orderbook/' . rawurlencode($symbol));
    }

    public function getBalance(string $address): array {
        return $this->request('GET', '/api/balance/bwriter/' . rawurlencode($address));
    }

    public function getMarketplaceDocuments(string $authorType = 'human'): array {
        return $this->request('POST', '/api/marketplace', [
            'action' => 'getNftDocuments',
            'authorType' => $authorType
        ]);
    }
}
```

## Usage Example

```php
<?php
require_once 'BitcoinWriterClient.php';

$client = new BitcoinWriterClient('http://localhost:3000');
$bsv = $client->getBSVPrice();
echo "BSV USD: " . $bsv['price_usd'] . PHP_EOL;

$book = $client->getOrderbook('bwriter');
print_r($book['orderbook']['bids'][0] ?? null);
```

## OAuth Start

For browser apps, redirect users to:

- `/api/auth/github`
- `/api/auth/twitter`
