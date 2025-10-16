# DocumentEditor Component Documentation

## Overview
The `DocumentEditor` component is the core of the Bitcoin Writer application, providing a rich text editor for creating, editing, and publishing documents to the blockchain. It integrates with Quill for text editing and includes features like tokenization, social sharing, and AI assistance.

## File Structure
- **Location**: `components/editor/DocumentEditor.tsx`
- **Sub-components**:
  - `EditorToolbar.tsx`: Handles formatting tools and save options.
  - `EditorPaper.tsx`: Displays the editable document area with styling for alignment and size.
  - `EditorControls.tsx`: Provides settings and blockchain publishing options.

## Key Features
- **Text Editing**: Uses Quill editor for rich text formatting.
- **Blockchain Publishing**: Saves documents to BSV blockchain with customizable settings.
- **Tokenization**: Allows creation of NFTs from documents.
- **Social Sharing**: Integrates with Twitter for posting content.

## Styling
- **CSS File**: `DocumentEditor.css`
- **Key Styles**:
  - Paper alignment and width are controlled to ensure the document extends on both sides (width: 1200px, margin: 0).
  - Containers are set to `display: flex; justify-content: flex-start;` to prevent centering.

## Props
- `documentService`: An instance of `BlockchainDocumentService` for blockchain operations.

## Usage
This component is dynamically imported in `app/page.tsx` to render the main editor interface.

## Notes
- Due to the component's original size (>1300 lines), it has been refactored into sub-components for maintainability.
- Ensure import paths are correct after reorganization to avoid build errors.
