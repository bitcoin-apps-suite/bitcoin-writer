# Bitcoin Writer - Implementation Plan

## Problem Statement
Users cannot see their published documents when they log back into Bitcoin Writer. The current system only stores metadata locally and doesn't retrieve documents from the blockchain.

## Current Architecture Analysis

### What's Working ✅
- **Local Document Storage**: Auto-save, CRUD operations, export functionality
- **Document Sidebar**: Lists local documents with search/filter
- **Blockchain Publishing**: Documents can be published to BSV blockchain
- **Version System**: Git-style versioning with WorkTree visualization
- **Authentication**: HandCash integration working

### What's Missing ❌
- **Document Retrieval**: Cannot fetch user's blockchain documents on login
- **Cross-Device Sync**: Documents saved on one device invisible on another
- **BSV Protocol Integration**: No B://, D://, Bcat protocol support
- **Document Library**: No comprehensive view of all user documents
- **Persistent User Library**: No way to rebuild document library from blockchain

## Proposed Solution: Multi-Layer Document Architecture

### Layer 1: Enhanced Local Storage
- Maintain current LocalDocumentStorage for immediate access
- Add blockchain metadata tracking (TX IDs, inscription IDs)
- Cache retrieved blockchain documents locally

### Layer 2: Blockchain Document Index (D:// Protocol)
```
D://<userAddress>/documents/index.json
{
  "documents": [
    {
      "id": "doc_123",
      "title": "My Document",
      "contentTx": "b://abc123...",
      "createdAt": "2025-01-01T00:00:00Z",
      "updatedAt": "2025-01-01T12:00:00Z",
      "version": 1,
      "size": 1024
    }
  ],
  "lastUpdated": "2025-01-01T12:00:00Z"
}
```

### Layer 3: Document Content Storage
- **Small documents (<100KB)**: Store using B:// protocol
- **Large documents (>100KB)**: Store using Bcat protocol  
- **Dynamic documents**: Use D:// protocol for mutable content

### Layer 4: Integration with Bico.Media
- Use Bico.Media as CDN for blockchain content
- Leverage their B://, Bcat, D:// protocol support
- Template system using B://eard for dynamic documents

## Implementation Phases

### Phase 1: Document Retrieval Foundation (Immediate - Week 1)
**Goal**: Users can see their blockchain documents on login

#### Tasks:
1. **Enhanced BlockchainDocumentService**
   - Add method to query user's D:// document index
   - Implement document content fetching from B://
   - Add caching layer for retrieved documents

2. **User Document Index System**
   - Create/update document index on publish
   - Store index using D:// protocol at predictable location
   - Fallback to scanning user's transactions if no index

3. **Document Sidebar Enhancement**
   - Merge local and blockchain documents
   - Add source indicators (local, blockchain, cached)
   - Implement refresh mechanism

#### Code Changes:
```typescript
// New methods in BlockchainDocumentService
async getUserDocumentIndex(): Promise<DocumentIndex>
async fetchDocumentFromBlockchain(txId: string): Promise<BlockchainDocument>
async syncUserDocuments(): Promise<void>
async updateDocumentIndex(document: BlockchainDocument): Promise<void>
```

### Phase 2: BSV Protocol Integration (Week 2-3)
**Goal**: Full B://, D://, Bcat protocol support

#### Tasks:
1. **Protocol Services**
   - BProtocolService for B:// content
   - DProtocolService for D:// mutable references  
   - BcatProtocolService for large files
   - BicoMediaService for CDN integration

2. **Smart Document Storage**
   - Auto-detect document size and choose protocol
   - Implement Bcat splitting for large documents
   - D:// references for frequently updated docs

3. **Template System Integration**
   - Support for B://eard Mustache templates
   - Document includes using B://inject
   - Dynamic content rendering

### Phase 3: Advanced Document Library (Week 4)
**Goal**: Comprehensive document management experience

#### Tasks:
1. **Enhanced Document Library View**
   - Grid/list view toggle
   - Advanced filtering (date, size, protocol, status)
   - Bulk operations (export, delete, republish)
   - Document analytics (views, edits, versions)

2. **Cross-Device Synchronization**
   - Conflict resolution for local vs blockchain versions
   - Smart sync strategies (on login, periodic, manual)
   - Offline-first with eventual consistency

3. **Version History Integration**
   - Show version tree for each document
   - Quick restore from any version
   - Compare versions visually

### Phase 4: Ecosystem Integration (Week 5-6)
**Goal**: Full BSV ecosystem integration

#### Tasks:
1. **Multi-Protocol Publishing**
   - Choose optimal protocol based on content
   - Automatic migration between protocols
   - Cost optimization suggestions

2. **Community Features**
   - Public document discovery
   - Document sharing via D:// links
   - Collaborative editing preparation (MAIP)

3. **Advanced Analytics**
   - Document performance metrics
   - Storage cost analysis
   - Protocol usage analytics

## Technical Implementation Details

### Document Index Schema
```typescript
interface DocumentIndex {
  version: string;
  owner: string;
  lastUpdated: string;
  documents: DocumentIndexEntry[];
}

interface DocumentIndexEntry {
  id: string;
  title: string;
  contentProtocol: 'B' | 'D' | 'Bcat';
  contentReference: string; // TX ID or D:// URL
  metadata: {
    createdAt: string;
    updatedAt: string;
    size: number;
    wordCount: number;
    characterCount: number;
    version: number;
    encrypted: boolean;
  };
  versions?: DocumentVersionEntry[];
}
```

### Service Architecture
```typescript
class DocumentLibraryService {
  async syncDocuments(): Promise<void>
  async getDocuments(source?: 'local' | 'blockchain' | 'all'): Promise<Document[]>
  async publishDocument(doc: Document, options: PublishOptions): Promise<string>
  async retrieveDocument(reference: string): Promise<Document>
}

class BSVProtocolService {
  async storeContent(content: string, protocol?: Protocol): Promise<string>
  async retrieveContent(reference: string): Promise<string>
  async estimateCost(content: string, protocol: Protocol): Promise<number>
}
```

### User Experience Flow
1. **User logs in** → Auto-sync documents from blockchain
2. **Document created locally** → Auto-save to localStorage
3. **Document published** → Store on blockchain + update index
4. **User switches devices** → All documents available immediately
5. **Document edited** → Smart protocol selection for updates

## Success Metrics
- ✅ Users can access documents across devices
- ✅ Zero data loss between sessions  
- ✅ <2 second load time for document library
- ✅ Automatic protocol optimization saves >50% on storage costs
- ✅ 100% compatibility with existing local documents

## Risk Mitigation
- **Data Loss**: Maintain local backups during transition
- **Performance**: Implement progressive loading and caching
- **Costs**: Provide cost estimates before publishing
- **Complexity**: Gradual migration with fallback options

## Next Steps
1. Implement Phase 1 document retrieval
2. Create GitHub issues for each phase
3. Set up project milestones
4. Begin development with Phase 1 tasks

---

*This plan leverages the full BSV ecosystem while maintaining backward compatibility and providing immediate value to users.*