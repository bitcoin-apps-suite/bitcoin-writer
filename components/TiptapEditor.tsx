import React, { useState, useEffect, useMemo } from 'react';
import { useEditor, EditorContent, Editor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import mammoth from 'mammoth';
import { Document, Packer, Paragraph, TextRun } from 'docx';
import { saveAs } from 'file-saver';
import AnimatedPlaceholder from './AnimatedPlaceholder';
import ImportSourcesModal from './ImportSourcesModal';
import SaveToBlockchainModal, { BlockchainSaveOptions } from './SaveToBlockchainModal';
import BSVStorageService from '../lib/BSVStorageService';
import { HandCashService } from '../lib/HandCashService';
import './TiptapEditor.css';
import {
  Bold, Italic, Strikethrough, Code, Pilcrow, Heading1, Heading2, Heading3, List, ListOrdered, Code2, Quote, Minus, CornerUpLeft, CornerUpRight
} from 'lucide-react';

interface TiptapEditorProps {
  content: string;
  onChange: (content: string) => void;
  onTextChange?: (text: string) => void;
  placeholder?: string;
}

const MenuBar = ({ editor }: { editor: Editor | null }) => {
  if (!editor) {
    return null;
  }

  return (
    <div className="tiptap-menu-bar">
      <button onClick={() => editor.chain().focus().toggleBold().run()} disabled={!editor.can().chain().focus().toggleBold().run()} className={editor.isActive('bold') ? 'is-active' : ''}><Bold size={16} /></button>
      <button onClick={() => editor.chain().focus().toggleItalic().run()} disabled={!editor.can().chain().focus().toggleItalic().run()} className={editor.isActive('italic') ? 'is-active' : ''}><Italic size={16} /></button>
      <button onClick={() => editor.chain().focus().toggleStrike().run()} disabled={!editor.can().chain().focus().toggleStrike().run()} className={editor.isActive('strike') ? 'is-active' : ''}><Strikethrough size={16} /></button>
      <button onClick={() => editor.chain().focus().toggleCode().run()} disabled={!editor.can().chain().focus().toggleCode().run()} className={editor.isActive('code') ? 'is-active' : ''}><Code size={16} /></button>
      <button onClick={() => editor.chain().focus().setParagraph().run()} className={editor.isActive('paragraph') ? 'is-active' : ''}><Pilcrow size={16} /></button>
      <button onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()} className={editor.isActive('heading', { level: 1 }) ? 'is-active' : ''}><Heading1 size={16} /></button>
      <button onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} className={editor.isActive('heading', { level: 2 }) ? 'is-active' : ''}><Heading2 size={16} /></button>
      <button onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()} className={editor.isActive('heading', { level: 3 }) ? 'is-active' : ''}><Heading3 size={16} /></button>
      <button onClick={() => editor.chain().focus().toggleBulletList().run()} className={editor.isActive('bulletList') ? 'is-active' : ''}><List size={16} /></button>
      <button onClick={() => editor.chain().focus().toggleOrderedList().run()} className={editor.isActive('orderedList') ? 'is-active' : ''}><ListOrdered size={16} /></button>
      <button onClick={() => editor.chain().focus().toggleCodeBlock().run()} className={editor.isActive('codeBlock') ? 'is-active' : ''}><Code2 size={16} /></button>
      <button onClick={() => editor.chain().focus().toggleBlockquote().run()} className={editor.isActive('blockquote') ? 'is-active' : ''}><Quote size={16} /></button>
      <button onClick={() => editor.chain().focus().setHorizontalRule().run()}><Minus size={16} /></button>
      <button onClick={() => editor.chain().focus().undo().run()} disabled={!editor.can().chain().focus().undo().run()}><CornerUpLeft size={16} /></button>
      <button onClick={() => editor.chain().focus().redo().run()} disabled={!editor.can().chain().focus().redo().run()}><CornerUpRight size={16} /></button>
    </div>
  );
};

const TiptapEditor: React.FC<TiptapEditorProps> = ({
  content,
  onChange,
  onTextChange,
  placeholder = 'Start writing your document...'
}) => {
  const [isReady, setIsReady] = useState(false);
  const [showImportModal, setShowImportModal] = useState(false);
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const handcashService = useMemo(() => new HandCashService(), []);
  const bsvService = useMemo(() => new BSVStorageService(handcashService), [handcashService]);
  const [isEmpty, setIsEmpty] = useState(() => content.trim().length === 0);

  const editor = useEditor({
    extensions: [StarterKit],
    content: content,
    onUpdate: ({ editor }) => {
      const html = editor.getHTML();
      onChange(html);
      if (onTextChange) {
        onTextChange(editor.getText());
      }
      setIsEmpty(editor.getText().trim().length === 0);
    },
  });

  useEffect(() => {
    if (editor) {
      setIsReady(true);
    }
  }, [editor]);

  useEffect(() => {
    if (editor && content !== editor.getHTML()) {
      editor.commands.setContent(content);
    }
  }, [content, editor]);

  // Import .docx file
  const importDocx = async (file: File) => {
    try {
      const arrayBuffer = await file.arrayBuffer();
      const result = await mammoth.convertToHtml({ arrayBuffer });
      if (editor) {
        editor.commands.setContent(result.value);
      }
    } catch (error) {
      console.error('Error importing .docx file:', error);
      alert('Failed to import document. Please try again.');
    }
  };

  // Export to .docx
  const exportToDocx = async (title: string = 'document') => {
    try {
      if (!editor) return;
      const text = editor.getText();
      const doc = new Document({
        sections: [{
          properties: {},
          children: text.split('\n').map(line => 
            new Paragraph({
              children: [new TextRun(line)]
            })
          )
        }]
      });
      const blob = await Packer.toBlob(doc);
      saveAs(blob, `${title}.docx`);
    } catch (error) {
      console.error('Error exporting to .docx:', error);
      alert('Failed to export document. Please try again.');
    }
  };

  // Export to HTML
  const exportToHtml = (title: string = 'document') => {
    if (!editor) return;
    const html = editor.getHTML();
    const fullHtml = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>${title}</title>
  <style>
    body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 800px; margin: 40px auto; padding: 20px; }
    h1 { color: #2c3e50; }
    h2 { color: #34495e; }
    blockquote { border-left: 4px solid #3498db; padding-left: 16px; color: #7f8c8d; }
    pre { background: #f4f4f4; padding: 12px; border-radius: 4px; }
    img { max-width: 100%; height: auto; }
  </style>
</head>
<body>
  ${html}
</body>
</html>`;
    const blob = new Blob([fullHtml], { type: 'text/html' });
    saveAs(blob, `${title}.html`);
  };

  // Handle Save to Blockchain
  const handleSaveToBlockchain = async (options: BlockchainSaveOptions) => {
    setIsSaving(true);
    try {
      if (!editor) {
        throw new Error('Editor not ready');
      }
      const text = editor.getText();
      const isAuthenticated = handcashService.isAuthenticated();
      const author = isAuthenticated ? handcashService.getCurrentUser()?.handle || 'Anonymous' : 'Anonymous';
      const result = await bsvService.storeDocumentWithOptions(text, options, author);
      alert(`Document saved to blockchain!\n\nTransaction ID: ${result.transactionId}\n\nExplorer: ${result.explorerUrl}`);
      setShowSaveModal(false);
    } catch (error) {
      console.error('Failed to save to blockchain:', error);
      alert(`Failed to save document: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsSaving(false);
    }
  };

  const getWordCount = (): number => {
    if (!editor) return 0;
    const text = editor.getText();
    return text.trim().split(/\s+/).filter(word => word.length > 0).length;
  };

  const getEstimatedSize = (): number => {
    if (!editor) return 0;
    const text = editor.getText();
    return new Blob([text]).size;
  };

  const handleFileImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.name.endsWith('.docx')) {
      importDocx(file);
    } else {
      alert('Please select a .docx file');
    }
  };

  return (
    <div className="tiptap-editor-container">
      <div className="tiptap-toolbar-extra">
        <MenuBar editor={editor} />
        <input type="file" accept=".docx" onChange={handleFileImport} style={{ display: 'none' }} id="docx-import" />
        <button onClick={() => document.getElementById('docx-import')?.click()} className="import-btn">Import Word</button>
        <button onClick={() => exportToDocx('bitcoin-writer-document')} className="export-btn">Export Word</button>
        <button onClick={() => exportToHtml('bitcoin-writer-document')} className="export-btn">Export HTML</button>
        <button onClick={() => setShowSaveModal(true)} className="save-blockchain-btn">Save to Blockchain</button>
      </div>
      
      {showImportModal && (
        <ImportSourcesModal 
          isOpen={showImportModal}
          onClose={() => setShowImportModal(false)}
          onImport={(content: string) => {
            editor?.commands.setContent(content);
            setShowImportModal(false);
          }}
        />
      )}
      
      <div className="tiptap-editor-wrapper" style={{ position: 'relative', flex: 1 }}>
        <EditorContent editor={editor} />
        {isEmpty && <div className="placeholder">{placeholder}</div>}
      </div>
      
      {showSaveModal && (
        <SaveToBlockchainModal
          isOpen={showSaveModal}
          onClose={() => setShowSaveModal(false)}
          onSave={handleSaveToBlockchain}
          documentTitle="Bitcoin Writer Document"
          wordCount={getWordCount()}
          estimatedSize={getEstimatedSize()}
          isAuthenticated={handcashService.isAuthenticated()}
        />
      )}
    </div>
  );
};

export default TiptapEditor;