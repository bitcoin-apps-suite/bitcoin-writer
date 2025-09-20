import React from 'react';
import './DocsPage.css';

const DocsPage: React.FC = () => {
  return (
    <div className="docs-page">
      {/* Header */}
      <header className="docs-header">
        <div className="container">
          <h1>Bitcoin Writer Documentation</h1>
          <p>Complete guide to writing, encrypting, and publishing documents on the Bitcoin blockchain</p>
        </div>
      </header>

      {/* Navigation */}
      <nav className="docs-nav">
        <div className="container">
          <ul className="nav-links">
            <li><a href="#getting-started">Getting Started</a></li>
            <li><a href="#writing">Writing</a></li>
            <li><a href="#blockchain">Blockchain Features</a></li>
            <li><a href="#monetization">Monetization</a></li>
            <li><a href="#api">API Reference</a></li>
            <li><a href="#troubleshooting">Troubleshooting</a></li>
          </ul>
        </div>
      </nav>

      {/* Content */}
      <main className="docs-content">
        <div className="container">
          {/* Getting Started */}
          <section id="getting-started" className="docs-section">
            <h2>Getting Started</h2>
            
            <div className="subsection">
              <h3>Authentication</h3>
              <p>Bitcoin Writer supports multiple authentication methods:</p>
              <ul>
                <li><strong>HandCash:</strong> Recommended for Bitcoin payments and blockchain features</li>
                <li><strong>Google:</strong> For cloud storage and collaboration features</li>
              </ul>
              
              <div className="code-block">
                <h4>Connecting with HandCash</h4>
                <ol>
                  <li>Click "Sign in with HandCash" in the top right</li>
                  <li>Authorize Bitcoin Writer in your HandCash app</li>
                  <li>Return to Bitcoin Writer - you're now connected!</li>
                </ol>
              </div>
            </div>

            <div className="subsection">
              <h3>Your First Document</h3>
              <ol>
                <li>Click "New Document" from the sidebar or use <kbd>⌘N</kbd></li>
                <li>Start typing in the editor</li>
                <li>Save to blockchain using <kbd>⌘B</kbd> or the save button</li>
                <li>Choose your storage method (see Storage Options below)</li>
              </ol>
            </div>
          </section>

          {/* Writing */}
          <section id="writing" className="docs-section">
            <h2>Writing & Editing</h2>
            
            <div className="subsection">
              <h3>Editor Features</h3>
              <ul>
                <li><strong>Rich Text:</strong> Bold, italic, underline formatting</li>
                <li><strong>Auto-save:</strong> Documents save automatically as you type</li>
                <li><strong>Version History:</strong> Every save creates a blockchain version</li>
                <li><strong>Word Count:</strong> Real-time tracking in the status bar</li>
              </ul>
            </div>

            <div className="subsection">
              <h3>Keyboard Shortcuts</h3>
              <div className="shortcuts-grid">
                <div className="shortcut">
                  <kbd>⌘N</kbd>
                  <span>New Document</span>
                </div>
                <div className="shortcut">
                  <kbd>⌘S</kbd>
                  <span>Save Document</span>
                </div>
                <div className="shortcut">
                  <kbd>⌘B</kbd>
                  <span>Save to Blockchain</span>
                </div>
                <div className="shortcut">
                  <kbd>⌘L</kbd>
                  <span>Encrypt Document</span>
                </div>
                <div className="shortcut">
                  <kbd>⌘Z</kbd>
                  <span>Undo</span>
                </div>
                <div className="shortcut">
                  <kbd>⇧⌘Z</kbd>
                  <span>Redo</span>
                </div>
              </div>
            </div>

            <div className="subsection">
              <h3>Document Management</h3>
              <p>All your documents appear in the left sidebar. You can:</p>
              <ul>
                <li>Click any document to open it</li>
                <li>Right-click for options (rename, delete, publish)</li>
                <li>Use the search bar to find documents quickly</li>
                <li>Sort by creation date, name, or last modified</li>
              </ul>
            </div>
          </section>

          {/* Blockchain Features */}
          <section id="blockchain" className="docs-section">
            <h2>Blockchain Features</h2>
            
            <div className="subsection">
              <h3>Storage Options</h3>
              
              <div className="storage-option">
                <h4>🔗 Direct On-Chain (OP_RETURN)</h4>
                <p>Store documents directly on Bitcoin blockchain</p>
                <ul>
                  <li><strong>Pros:</strong> Permanent, immutable, decentralized</li>
                  <li><strong>Cons:</strong> Size limited to 100KB, higher cost</li>
                  <li><strong>Best for:</strong> Important documents, legal contracts</li>
                  <li><strong>Cost:</strong> ~$1-5 per document</li>
                </ul>
              </div>

              <div className="storage-option">
                <h4>🌐 IPFS with Hash</h4>
                <p>Store content on IPFS, hash on blockchain</p>
                <ul>
                  <li><strong>Pros:</strong> Unlimited size, lower cost, fast access</li>
                  <li><strong>Cons:</strong> Requires IPFS network availability</li>
                  <li><strong>Best for:</strong> Large documents, multimedia content</li>
                  <li><strong>Cost:</strong> ~$0.10-0.50 per document</li>
                </ul>
              </div>

              <div className="storage-option">
                <h4>☁️ Cloud Providers</h4>
                <p>Store in traditional cloud, hash on blockchain</p>
                <ul>
                  <li><strong>Supported:</strong> Google Drive, AWS S3, Supabase, Cloudflare R2, Azure Blob</li>
                  <li><strong>Pros:</strong> Fast access, familiar interface, backup redundancy</li>
                  <li><strong>Cons:</strong> Centralized, requires provider account</li>
                  <li><strong>Best for:</strong> Draft versions, collaborative documents</li>
                </ul>
              </div>
            </div>

            <div className="subsection">
              <h3>Encryption</h3>
              <p>Protect your documents with military-grade encryption:</p>
              <ul>
                <li><strong>AES-256:</strong> Industry standard encryption</li>
                <li><strong>Password Protection:</strong> Set custom passwords</li>
                <li><strong>Key Derivation:</strong> PBKDF2 with 100,000 iterations</li>
                <li><strong>Metadata Protection:</strong> Titles and descriptions encrypted too</li>
              </ul>
              
              <div className="warning-box">
                <strong>⚠️ Important:</strong> Lost passwords cannot be recovered. Store them securely!
              </div>
            </div>

            <div className="subsection">
              <h3>Version Control</h3>
              <p>Every save creates a new blockchain version with:</p>
              <ul>
                <li><strong>Timestamp:</strong> Exact save time</li>
                <li><strong>Hash:</strong> Cryptographic fingerprint</li>
                <li><strong>Word Count:</strong> Document length tracking</li>
                <li><strong>Author:</strong> Your HandCash handle</li>
                <li><strong>Chain Link:</strong> Connection to previous version</li>
              </ul>
            </div>
          </section>

          {/* Monetization */}
          <section id="monetization" className="docs-section">
            <h2>Monetization</h2>
            
            <div className="subsection">
              <h3>Create NFTs</h3>
              <p>Turn your documents into tradeable NFTs:</p>
              <ol>
                <li>Click the "Create NFT" button or use Blockchain → Create NFT</li>
                <li>Set your NFT metadata (title, description, image)</li>
                <li>Choose rarity and supply (1 for unique, more for limited editions)</li>
                <li>Pay the inscription fee (~$5-20)</li>
                <li>Your NFT is minted on Bitcoin as an Ordinal!</li>
              </ol>
            </div>

            <div className="subsection">
              <h3>Issue File Shares</h3>
              <p>Let readers invest in your work as it develops:</p>
              <ul>
                <li><strong>1 Million Shares:</strong> Per document version</li>
                <li><strong>Progressive Pricing:</strong> Early versions cheaper</li>
                <li><strong>Automatic Royalties:</strong> Share revenue with investors</li>
                <li><strong>Tradeable:</strong> Investors can buy/sell shares</li>
              </ul>
              
              <div className="example-box">
                <h4>Example: Novel Chapters</h4>
                <ul>
                  <li>Chapter 1: 100 sats/share</li>
                  <li>Chapter 5: 250 sats/share</li>
                  <li>Final Version: 500 sats/share</li>
                  <li>Early investors earn 5x returns!</li>
                </ul>
              </div>
            </div>

            <div className="subsection">
              <h3>Paywall Documents</h3>
              <p>Charge readers to access your content:</p>
              <ol>
                <li>Write your document</li>
                <li>Click "Set Paywall" or use Blockchain → Set Paywall</li>
                <li>Choose price in satoshis</li>
                <li>Publish to the Document Exchange</li>
                <li>Earn Bitcoin when readers pay to unlock!</li>
              </ol>
            </div>

            <div className="subsection">
              <h3>Document Exchange</h3>
              <p>Browse and trade documents from other writers:</p>
              <ul>
                <li><strong>Discover:</strong> Find interesting content to read/invest in</li>
                <li><strong>Preview:</strong> See excerpts before purchasing</li>
                <li><strong>Ratings:</strong> Rate documents after reading</li>
                <li><strong>Categories:</strong> Fiction, journalism, research, business</li>
              </ul>
            </div>
          </section>

          {/* API Reference */}
          <section id="api" className="docs-section">
            <h2>API Reference</h2>
            
            <div className="subsection">
              <h3>Authentication</h3>
              <div className="code-block">
                <pre>{`// HandCash Connect SDK
import { HandCashConnect } from '@handcash/handcash-connect';

const handCashConnect = new HandCashConnect({
  appId: 'your-app-id',
  appSecret: 'your-app-secret'
});`}</pre>
              </div>
            </div>

            <div className="subsection">
              <h3>Document Operations</h3>
              
              <h4>Create Document</h4>
              <div className="code-block">
                <pre>{`POST /api/documents
{
  "title": "My Document",
  "content": "Document content...",
  "storage": "blockchain",
  "encrypted": false
}`}</pre>
              </div>

              <h4>Get Document</h4>
              <div className="code-block">
                <pre>{`GET /api/documents/:id
Response:
{
  "id": "doc_123",
  "title": "My Document", 
  "content": "Document content...",
  "createdAt": "2024-01-01T00:00:00Z",
  "blockchain": {
    "txid": "abc123...",
    "hash": "def456..."
  }
}`}</pre>
              </div>

              <h4>List Documents</h4>
              <div className="code-block">
                <pre>{`GET /api/documents
Response:
{
  "documents": [
    {
      "id": "doc_123",
      "title": "My Document",
      "createdAt": "2024-01-01T00:00:00Z",
      "wordCount": 1250
    }
  ]
}`}</pre>
              </div>
            </div>

            <div className="subsection">
              <h3>Blockchain Operations</h3>
              
              <h4>Save to Blockchain</h4>
              <div className="code-block">
                <pre>{`POST /api/blockchain/save
{
  "documentId": "doc_123",
  "storage": "op_return", // "op_return" | "ipfs" | "cloud"
  "provider": "aws-s3" // for cloud storage
}`}</pre>
              </div>

              <h4>Create NFT</h4>
              <div className="code-block">
                <pre>{`POST /api/nft/create
{
  "documentId": "doc_123",
  "metadata": {
    "name": "My NFT",
    "description": "A unique document NFT",
    "image": "data:image/png;base64,..."
  },
  "supply": 1
}`}</pre>
              </div>
            </div>
          </section>

          {/* Troubleshooting */}
          <section id="troubleshooting" className="docs-section">
            <h2>Troubleshooting</h2>
            
            <div className="subsection">
              <h3>Common Issues</h3>
              
              <div className="faq-item">
                <h4>Q: My HandCash login isn't working</h4>
                <p><strong>A:</strong> Make sure you have the latest HandCash app installed and try clearing your browser cache. If problems persist, try incognito mode.</p>
              </div>

              <div className="faq-item">
                <h4>Q: Document won't save to blockchain</h4>
                <p><strong>A:</strong> Check your HandCash balance - blockchain saves require a small fee. Also ensure you're connected to the internet.</p>
              </div>

              <div className="faq-item">
                <h4>Q: Can't decrypt my document</h4>
                <p><strong>A:</strong> Double-check your password. Bitcoin Writer cannot recover lost passwords for security reasons.</p>
              </div>

              <div className="faq-item">
                <h4>Q: NFT creation failed</h4>
                <p><strong>A:</strong> NFT creation requires sufficient funds in your HandCash wallet. Check your balance and try again.</p>
              </div>

              <div className="faq-item">
                <h4>Q: Document Exchange not loading</h4>
                <p><strong>A:</strong> The exchange requires an internet connection to load published documents. Check your network connection.</p>
              </div>
            </div>

            <div className="subsection">
              <h3>Getting Help</h3>
              <ul>
                <li><strong>GitHub Issues:</strong> <a href="https://github.com/bitcoin-apps-suite/bitcoin-writer/issues" target="_blank">Report bugs and feature requests</a></li>
                <li><strong>Twitter Support:</strong> <a href="https://twitter.com/bitcoin_writer" target="_blank">@bitcoin_writer</a></li>
                <li><strong>Developer Contact:</strong> <a href="https://twitter.com/b0ase" target="_blank">@b0ase</a></li>
                <li><strong>HandCash Support:</strong> <a href="https://handcash.io/support" target="_blank">For payment issues</a></li>
              </ul>
            </div>

            <div className="subsection">
              <h3>System Requirements</h3>
              <ul>
                <li><strong>Browser:</strong> Chrome 90+, Firefox 90+, Safari 14+, Edge 90+</li>
                <li><strong>JavaScript:</strong> Must be enabled</li>
                <li><strong>Local Storage:</strong> Required for document caching</li>
                <li><strong>Internet:</strong> Required for blockchain features</li>
                <li><strong>HandCash App:</strong> For Bitcoin payments and blockchain features</li>
              </ul>
            </div>
          </section>
        </div>
      </main>

      {/* Footer */}
      <footer className="docs-footer">
        <div className="container">
          <div className="footer-content">
            <div className="footer-section">
              <h4>Bitcoin Writer</h4>
              <p>Transforming writing into digital assets on the Bitcoin blockchain</p>
              <div className="footer-links">
                <a href="/">← Back to Editor</a>
                <a href="/features">Features</a>
                <a href="/token">$BWRITER Token</a>
              </div>
            </div>
            
            <div className="footer-section">
              <h4>Quick Links</h4>
              <ul>
                <li><a href="#getting-started">Getting Started</a></li>
                <li><a href="#writing">Writing Guide</a></li>
                <li><a href="#blockchain">Blockchain Features</a></li>
                <li><a href="#api">API Reference</a></li>
              </ul>
            </div>
            
            <div className="footer-section">
              <h4>Community</h4>
              <ul>
                <li><a href="https://github.com/bitcoin-apps-suite/bitcoin-writer" target="_blank">GitHub</a></li>
                <li><a href="https://twitter.com/bitcoin_writer" target="_blank">Twitter</a></li>
                <li><a href="https://handcash.io" target="_blank">HandCash</a></li>
                <li><a href="https://whatsonchain.com" target="_blank">Bitcoin Explorer</a></li>
              </ul>
            </div>
          </div>
          
          <div className="footer-bottom">
            <p>© 2024 Bitcoin Writer. Open source on the BSV blockchain.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default DocsPage;