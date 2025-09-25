import React, { useState, useRef, useEffect, useMemo } from 'react';
import ReactQuill, { Quill } from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import mammoth from 'mammoth';
import { Document, Packer, Paragraph, TextRun } from 'docx';
import { saveAs } from 'file-saver';
import AnimatedPlaceholder from './AnimatedPlaceholder';

interface QuillEditorProps {
  content: string;
  onChange: (content: string) => void;
  onTextChange?: (text: string) => void;
  placeholder?: string;
}

const QuillEditor: React.FC<QuillEditorProps> = ({
  content,
  onChange,
  onTextChange,
  placeholder = 'Start writing your document...'
}) => {
  const quillRef = useRef<ReactQuill>(null);
  const [isReady, setIsReady] = useState(false);
  const [isEmpty, setIsEmpty] = useState(() => {
    // Check if initial content is empty
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = content;
    const text = tempDiv.textContent || tempDiv.innerText || '';
    return text.trim().length === 0;
  });

  // Quill modules configuration - comprehensive Word-like toolbar
  const modules = useMemo(() => ({
    toolbar: {
      container: [
        [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
        [{ 'font': [] }],
        [{ 'size': ['small', false, 'large', 'huge'] }],
        
        ['bold', 'italic', 'underline', 'strike'],
        [{ 'color': [] }, { 'background': [] }],
        [{ 'script': 'sub'}, { 'script': 'super' }],
        
        [{ 'list': 'ordered'}, { 'list': 'bullet' }, { 'list': 'check' }],
        [{ 'indent': '-1'}, { 'indent': '+1' }],
        [{ 'direction': 'rtl' }],
        
        [{ 'align': [] }],
        ['blockquote', 'code-block'],
        
        ['link', 'image', 'video', 'formula'],
        
        ['clean']
      ],
      handlers: {
        // Custom handlers can be added here
      }
    },
    clipboard: {
      matchVisual: false,
    },
    history: {
      delay: 1000,
      maxStack: 500,
      userOnly: true
    }
  }), []);

  // Quill formats
  const formats = [
    'header', 'font', 'size',
    'bold', 'italic', 'underline', 'strike',
    'color', 'background',
    'script',
    'list', 'bullet', 'check',
    'indent', 'direction', 'align',
    'blockquote', 'code-block',
    'link', 'image', 'video', 'formula'
  ];

  useEffect(() => {
    if (quillRef.current) {
      setIsReady(true);
    }
  }, []);

  // Update isEmpty when content changes from outside
  useEffect(() => {
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = content;
    const text = tempDiv.textContent || tempDiv.innerText || '';
    setIsEmpty(text.trim().length === 0);
  }, [content]);

  const handleChange = (value: string, delta: any, source: string, editor: any) => {
    onChange(value);
    const text = editor.getText();
    setIsEmpty(text.trim().length === 0);
    if (onTextChange) {
      onTextChange(text);
    }
  };

  // Import .docx file
  const importDocx = async (file: File) => {
    try {
      const arrayBuffer = await file.arrayBuffer();
      const result = await mammoth.convertToHtml({ arrayBuffer });
      
      if (quillRef.current) {
        const editor = quillRef.current.getEditor();
        editor.clipboard.dangerouslyPasteHTML(result.value);
      }
    } catch (error) {
      console.error('Error importing .docx file:', error);
      alert('Failed to import document. Please try again.');
    }
  };

  // Export to .docx
  const exportToDocx = async (title: string = 'document') => {
    try {
      if (!quillRef.current) return;
      
      const editor = quillRef.current.getEditor();
      const text = editor.getText();
      
      // Create a simple docx with the text content
      // Note: This is basic - formatting will be lost
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
    if (!quillRef.current) return;
    
    const editor = quillRef.current.getEditor();
    const html = editor.root.innerHTML;
    
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

  // Handle file input for import
  const handleFileImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.name.endsWith('.docx')) {
      importDocx(file);
    } else {
      alert('Please select a .docx file');
    }
  };

  return (
    <div className="quill-editor-container">
      <div className="quill-toolbar-extra">
        <input
          type="file"
          accept=".docx"
          onChange={handleFileImport}
          style={{ display: 'none' }}
          id="docx-import"
        />
        <input
          type="file"
          accept=".txt,.md,.rtf"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) {
              const reader = new FileReader();
              reader.onload = (event) => {
                const text = event.target?.result as string;
                if (file.name.endsWith('.md')) {
                  // Convert markdown to HTML for Quill
                  onChange(text.replace(/\n/g, '<br>'));
                } else {
                  onChange(text.replace(/\n/g, '<br>'));
                }
              };
              reader.readAsText(file);
            }
            e.target.value = '';
          }}
          style={{ display: 'none' }}
          id="text-import"
        />
        
        <button 
          onClick={() => document.getElementById('docx-import')?.click()}
          className="import-btn"
          title="Import Microsoft Word (.docx)"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" style={{marginRight: '8px'}}>
            <path d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18,20H6V4H13V9H18V20Z"/>
            <path d="M12,11L8,15H11V19H13V15H16L12,11Z"/>
          </svg>
          Import Word
        </button>
        
        <button 
          onClick={() => document.getElementById('text-import')?.click()}
          className="import-btn"
          title="Import Text/Markdown/RTF (.txt, .md, .rtf)"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" style={{marginRight: '8px'}}>
            <path d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18,20H6V4H13V9H18V20Z"/>
            <path d="M12,11L8,15H11V19H13V15H16L12,11Z"/>
          </svg>
          Import Text
        </button>
        
        <button 
          onClick={() => {
            const googleDocsUrl = prompt('Paste your Google Docs share link (must be public or have link sharing enabled):');
            if (googleDocsUrl) {
              // Extract document ID from Google Docs URL
              const docIdMatch = googleDocsUrl.match(/\/document\/d\/([a-zA-Z0-9-_]+)/);
              if (docIdMatch) {
                const docId = docIdMatch[1];
                const exportUrl = `https://docs.google.com/document/d/${docId}/export?format=txt`;
                
                // Open export URL to let user download and manually import
                alert('Google Docs will open for export. Download the text file, then use "Import Text" to upload it.');
                window.open(exportUrl, '_blank');
              } else {
                alert('Please provide a valid Google Docs URL');
              }
            }
          }}
          className="import-btn"
          title="Import from Google Docs (via export link)"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" style={{marginRight: '8px'}}>
            <path d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18,20H6V4H13V9H18V20Z"/>
            <path d="M21,5C19.89,4.65 18.67,4.5 17.5,4.5C15.55,4.5 13.45,4.9 12,6C10.55,4.9 8.45,4.5 6.5,4.5C4.55,4.5 2.45,4.9 1,6V20.65C1,20.9 1.25,21.15 1.5,21.15C1.6,21.15 1.65,21.1 1.75,21.1C3.1,20.45 5.05,20.3 6.5,20.3C8.45,20.3 10.55,20.7 12,21.8C13.35,21.15 15.8,20.3 17.5,20.3C19.15,20.3 20.85,20.65 22.25,21.1C22.35,21.1 22.4,21.15 22.5,21.15C22.75,21.15 23,20.9 23,20.65V6C22.4,5.55 21.75,5.25 21,5M21,18.5C19.9,18.15 18.7,18 17.5,18C15.8,18 13.35,18.85 12,19.5V8C13.35,7.15 15.8,6.3 17.5,6.3C18.7,6.3 19.9,6.45 21,6.8V18.5Z"/>
          </svg>
          Google Docs
        </button>
        
        <button 
          onClick={() => {
            const notionUrl = prompt('Paste your Notion page export link or upload exported Markdown/HTML file:');
            if (notionUrl) {
              alert('For Notion: Export your page as Markdown or HTML, then use "Import Text" or create a new export.');
            }
          }}
          className="import-btn"
          title="Import from Notion (via export)"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" style={{marginRight: '8px'}}>
            <path d="M4,1V23L6,21V3H18V1H4M19,5V21H21V5H19M7,7V19H17V7H7M9,9H15V11H9V9M9,13H15V15H9V13Z"/>
          </svg>
          Notion
        </button>
        
        <button 
          onClick={() => {
            const url = prompt('Paste content or URL from:\n• Obsidian (paste markdown)\n• Roam Research (paste text)\n• Bear notes (paste markdown)\n• Any other writing app:');
            if (url) {
              if (url.startsWith('http')) {
                alert('For web content, please copy and paste the text directly instead.');
              } else {
                // Treat as text content
                onChange(url.replace(/\n/g, '<br>'));
              }
            }
          }}
          className="import-btn"
          title="Import from other writing apps (Obsidian, Roam, Bear, etc.)"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" style={{marginRight: '8px'}}>
            <path d="M12,2L13.09,8.26L22,9L13.09,9.74L12,16L10.91,9.74L2,9L10.91,8.26L12,2M6.5,12.5L7.5,16.5L11.5,17.5L7.5,18.5L6.5,22.5L5.5,18.5L1.5,17.5L5.5,16.5L6.5,12.5M17.5,12.5L18.5,16.5L22.5,17.5L18.5,18.5L17.5,22.5L16.5,18.5L12.5,17.5L16.5,16.5L17.5,12.5Z"/>
          </svg>
          Other Apps
        </button>
        <button 
          onClick={() => exportToDocx('bitcoin-writer-document')}
          className="export-btn"
          title="Export as .docx"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" style={{marginRight: '8px'}}>
            <path d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18,20H6V4H13V9H18V20Z"/>
            <path d="M12,11L16,15H13V19H11V15H8L12,11Z"/>
          </svg>
          Export Word
        </button>
        <button 
          onClick={() => exportToHtml('bitcoin-writer-document')}
          className="export-btn"
          title="Export as HTML"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" style={{marginRight: '8px'}}>
            <path d="M12,17.56L16.07,16.43L16.62,10.33H9.38L9.2,8.3H16.8L17,6.31H7L7.56,12.32H14.45L14.22,14.9L12,15.5L9.78,14.9L9.64,13.24H7.64L7.93,16.43L12,17.56M4.07,3H19.93L18.5,19.2L12,21L5.5,19.2L4.07,3Z"/>
          </svg>
          Export HTML
        </button>
      </div>
      
      <div className="quill-editor-wrapper" style={{ position: 'relative', flex: 1 }}>
        <ReactQuill
          ref={quillRef}
          theme="snow"
          value={content}
          onChange={handleChange}
          modules={modules}
          formats={formats}
          placeholder="" // Disable default placeholder when using animated one
          className="quill-editor"
        />
        {isEmpty && <AnimatedPlaceholder />}
      </div>
    </div>
  );
};

export default QuillEditor;