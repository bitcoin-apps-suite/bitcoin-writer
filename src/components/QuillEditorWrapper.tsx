import React, { useState, useRef, useEffect, useMemo } from 'react';
import AnimatedPlaceholder from './AnimatedPlaceholder';
import ImportSourcesModal from './ImportSourcesModal';
import EditorRulers from './EditorRulers';
import mammoth from 'mammoth';
import { Document, Packer, Paragraph, TextRun } from 'docx';
import { saveAs } from 'file-saver';

// Dynamic import for ReactQuill to avoid SSR issues
let ReactQuill: any = null;
if (typeof window !== 'undefined') {
  ReactQuill = require('react-quill');
  require('react-quill/dist/quill.snow.css');
}

interface QuillEditorProps {
  content: string;
  onChange: (content: string) => void;
  onTextChange?: (text: string) => void;
  placeholder?: string;
  wordCount?: number;
  charCount?: number;
}

const QuillEditorWrapper: React.FC<QuillEditorProps> = ({
  content,
  onChange,
  onTextChange,
  placeholder = 'Start writing your document...',
  wordCount = 0,
  charCount = 0
}) => {
  const [mounted, setMounted] = useState(false);
  const quillRef = useRef<any>(null);
  const [isReady, setIsReady] = useState(false);
  const [showImportModal, setShowImportModal] = useState(false);
  const [showRulers, setShowRulers] = useState(true);
  const [isEmpty, setIsEmpty] = useState(() => {
    if (typeof window === 'undefined') return true;
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = content;
    const text = tempDiv.textContent || tempDiv.innerText || '';
    return text.trim().length === 0;
  });

  useEffect(() => {
    setMounted(true);
  }, []);

  // Quill modules configuration
  const modules = useMemo(() => ({
    toolbar: {
      container: [
        [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
        [{ 'font': [] }],
        [{ 'size': ['small', false, 'large', 'huge'] }],
        
        ['bold', 'italic', 'underline', 'strike'],
        [{ 'color': [] }, { 'background': [] }],
        [{ 'script': 'sub'}, { 'script': 'super' }],
        
        [{ 'list': 'ordered'}, { 'list': 'bullet' }],
        [{ 'indent': '-1'}, { 'indent': '+1' }],
        [{ 'direction': 'rtl' }],
        [{ 'align': [] }],
        
        ['blockquote', 'code-block'],
        ['link', 'image', 'video'],
        
        ['clean']
      ],
      handlers: {
        image: function() {
          const input = document.createElement('input');
          input.setAttribute('type', 'file');
          input.setAttribute('accept', 'image/*');
          input.click();
          
          input.onchange = async () => {
            const file = input.files?.[0];
            if (file) {
              const reader = new FileReader();
              reader.onload = (e) => {
                const quill = quillRef.current?.getEditor();
                if (quill) {
                  const range = quill.getSelection();
                  quill.insertEmbed(range?.index || 0, 'image', e.target?.result);
                }
              };
              reader.readAsDataURL(file);
            }
          };
        }
      }
    },
    clipboard: {
      matchVisual: false
    }
  }), []);

  const formats = [
    'header', 'font', 'size',
    'bold', 'italic', 'underline', 'strike',
    'color', 'background',
    'script',
    'list', 'bullet', 'indent',
    'direction', 'align',
    'blockquote', 'code-block',
    'link', 'image', 'video',
    'clean'
  ];

  useEffect(() => {
    if (mounted && quillRef.current) {
      setIsReady(true);
    }
  }, [mounted]);

  const handleChange = (value: string) => {
    onChange(value);
    
    // Check if content is empty
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = value;
    const text = tempDiv.textContent || tempDiv.innerText || '';
    setIsEmpty(text.trim().length === 0);
    
    if (onTextChange) {
      onTextChange(text);
    }
  };

  const handleImportClick = (source: string) => {
    if (source === 'upload') {
      const input = document.createElement('input');
      input.type = 'file';
      input.accept = '.txt,.md,.html,.docx';
      input.onchange = async (e) => {
        const file = (e.target as HTMLInputElement).files?.[0];
        if (file) {
          await handleFileImport(file);
        }
      };
      input.click();
    }
    setShowImportModal(false);
  };

  const handleFileImport = async (file: File) => {
    const fileType = file.name.split('.').pop()?.toLowerCase();
    
    try {
      if (fileType === 'docx') {
        const arrayBuffer = await file.arrayBuffer();
        const result = await mammoth.convertToHtml({ arrayBuffer });
        onChange(result.value);
      } else {
        const text = await file.text();
        if (fileType === 'md') {
          // Basic markdown to HTML conversion
          let html = text
            .replace(/^### (.*$)/gim, '<h3>$1</h3>')
            .replace(/^## (.*$)/gim, '<h2>$1</h2>')
            .replace(/^# (.*$)/gim, '<h1>$1</h1>')
            .replace(/\*\*(.*)\*\*/g, '<strong>$1</strong>')
            .replace(/\*(.*)\*/g, '<em>$1</em>')
            .replace(/\n/g, '<br>');
          onChange(html);
        } else {
          onChange(text);
        }
      }
    } catch (error) {
      console.error('Failed to import file:', error);
      alert('Failed to import file. Please try again.');
    }
  };

  const handleExport = async (format: string) => {
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = content;
    const text = tempDiv.textContent || tempDiv.innerText || '';
    
    switch (format) {
      case 'txt':
        const blob = new Blob([text], { type: 'text/plain' });
        saveAs(blob, 'document.txt');
        break;
        
      case 'html':
        const htmlBlob = new Blob([content], { type: 'text/html' });
        saveAs(htmlBlob, 'document.html');
        break;
        
      case 'docx':
        const doc = new Document({
          sections: [{
            properties: {},
            children: [
              new Paragraph({
                children: [
                  new TextRun(text)
                ]
              })
            ]
          }]
        });
        
        const buffer = await Packer.toBlob(doc);
        saveAs(buffer, 'document.docx');
        break;
    }
  };

  // Don't render on server
  if (!mounted || !ReactQuill) {
    return (
      <div className="quill-loading">
        <p>Loading editor...</p>
      </div>
    );
  }

  return (
    <div className="quill-container">
      <div className="quill-toolbar-extra">
        <button 
          className="toolbar-btn"
          onClick={() => setShowImportModal(true)}
          title="Import document"
        >
          📥 Import
        </button>
        <div className="toolbar-separator" />
        <button 
          className="toolbar-btn"
          onClick={() => handleExport('txt')}
          title="Export as TXT"
        >
          📄 TXT
        </button>
        <button 
          className="toolbar-btn"
          onClick={() => handleExport('html')}
          title="Export as HTML"
        >
          🌐 HTML
        </button>
        <button 
          className="toolbar-btn"
          onClick={() => handleExport('docx')}
          title="Export as DOCX"
        >
          📝 DOCX
        </button>
        <div className="toolbar-separator" />
        <button 
          className="toolbar-btn"
          onClick={() => setShowRulers(!showRulers)}
          title="Toggle rulers"
        >
          📏 Rulers
        </button>
      </div>

      <div className="quill-editor-container">
        {showRulers && <EditorRulers />}
        
        {isEmpty && (
          <AnimatedPlaceholder text={placeholder} />
        )}
        
        <div className="quill-editor-wrapper" style={{ position: 'relative', flex: 1 }}>
          <ReactQuill
            ref={quillRef}
            theme="snow"
            value={content}
            onChange={handleChange}
            modules={modules}
            formats={formats}
            placeholder=""
          />
        </div>
      </div>

      {showImportModal && (
        <ImportSourcesModal
          onClose={() => setShowImportModal(false)}
          onSelectSource={handleImportClick}
        />
      )}

      <div className="editor-status-bar">
        <span>{wordCount} words</span>
        <span className="separator">|</span>
        <span>{charCount} characters</span>
      </div>
    </div>
  );
};

export default QuillEditorWrapper;