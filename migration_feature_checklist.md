# Bitcoin Writer Migration Feature Checklist

This checklist ensures all essential features are preserved during the transition to a fully Next.js-based codebase.

## Core Features to Preserve
- **Document Editing**: Ability to create, edit, and save documents using the Quill editor.
- **Blockchain Integration**: Saving documents to the blockchain with protocols like BSV.
- **Authentication**: Support for HandCash, Google, and potentially other auth methods.
- **NFT Creation**: Tokenization of documents as NFTs.
- **Social Sharing**: Posting to Twitter and other platforms from within the app.
- **Marketplace**: Features related to document exchange and gig queue.
- **User Interface**: Taskbars, sidebars, modals, and overall UX consistency.

## Migration Validation Steps
1. **Post-Migration Testing**: After each migration step, test the above features manually.
2. **Backup Critical Logic**: Ensure key components like `DocumentEditor.tsx`, auth flows, and blockchain interactions are backed up before changes.
3. **Incremental Migration**: Move one feature area at a time (e.g., auth, editor) to Next.js structure, testing immediately after.

## Notes
- Any feature not functioning post-migration should be debugged before proceeding to the next step.
- Multi-auth integration will be planned separately after the core migration is stable.
