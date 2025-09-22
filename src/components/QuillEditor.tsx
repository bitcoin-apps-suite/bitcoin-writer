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
        <button 
          onClick={() => document.getElementById('docx-import')?.click()}
          className="import-btn"
          title="Import .docx file"
        >
          📥 Import Word
        </button>
        <button 
          onClick={() => exportToDocx('bitcoin-writer-document')}
          className="export-btn"
          title="Export as .docx"
        >
          📤 Export Word
        </button>
        <button 
          onClick={() => exportToHtml('bitcoin-writer-document')}
          className="export-btn"
          title="Export as HTML"
        >
          📄 Export HTML
        </button>
      </div>
      
      <div style={{ position: 'relative' }}>
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