import React, { useState, useRef, useEffect, useMemo } from 'react';
import dynamic from 'next/dynamic';
import 'react-quill/dist/quill.snow.css';
import mammoth from 'mammoth';
import { Document, Packer, Paragraph, TextRun } from 'docx';
import { saveAs } from 'file-saver';
import AnimatedPlaceholder from './AnimatedPlaceholder';
import ImportSourcesModal from './ImportSourcesModal';
import EditorRulers from './EditorRulers';

// Dynamic import QuillWrapper to avoid SSR and findDOMNode issues
const QuillWrapper = dynamic(
  () => import('./QuillWrapper'),
  { 
    ssr: false,
    loading: () => <div>Loading editor...</div>
  }
);

interface QuillEditorProps {
  content: string;
  onChange: (content: string) => void;
  onTextChange?: (text: string) => void;
  placeholder?: string;
  wordCount?: number;
  charCount?: number;
}

const QuillEditor: React.FC<QuillEditorProps> = ({
  content,
  onChange,
  onTextChange,
  placeholder = "Start writing your next masterpiece...",
  wordCount: propWordCount,
  charCount: propCharCount
}) => {
  const quillRef = useRef<any>(null);
  const [wordCount, setWordCount] = useState(0);
  const [charCount, setCharCount] = useState(0);
  const [isEmpty, setIsEmpty] = useState(true);
  const [showRulers, setShowRulers] = useState(true);
  const [showImportModal, setShowImportModal] = useState(false);

  // Calculate if content is empty
  useEffect(() => {
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = content;
    const textContent = tempDiv.textContent || tempDiv.innerText || '';
    const empty = !textContent.trim();
    setIsEmpty(empty);
  }, [content]);

  const handleChange = (value: string) => {
    onChange(value);
    
    // Extract plain text for word/char count
    if (quillRef.current) {
      const quill = quillRef.current.getEditor();
      const text = quill.getText();
      const words = text.trim() ? text.trim().split(/\s+/).length : 0;
      const chars = text.length;
      
      setWordCount(words);
      setCharCount(chars);
      
      if (onTextChange) {
        onTextChange(text);
      }
    }
  };

  // Export document handler - defined before modules
  const exportDocument = async () => {
    if (!quillRef.current) return;
    
    const quill = quillRef.current.getEditor();
    const delta = quill.getContents();
    
    // Create Word document
    const doc = new Document({
      sections: [{
        properties: {},
        children: [
          new Paragraph({
            children: [
              new TextRun({
                text: quill.getText(),
                size: 24
              })
            ]
          })
        ]
      }]
    });
    
    // Generate and save
    const blob = await Packer.toBlob(doc);
    saveAs(blob, 'document.docx');
  };

  // Custom toolbar with import/export buttons
  const modules = useMemo(() => ({
    toolbar: {
      container: [
        [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
        ['bold', 'italic', 'underline', 'strike'],
        ['blockquote', 'code-block'],
        [{ 'list': 'ordered'}, { 'list': 'bullet' }],
        [{ 'script': 'sub'}, { 'script': 'super' }],
        [{ 'indent': '-1'}, { 'indent': '+1' }],
        [{ 'direction': 'rtl' }],
        [{ 'color': [] }, { 'background': [] }],
        [{ 'font': [] }],
        [{ 'align': [] }],
        ['link', 'image', 'video'],
        ['clean'],
        ['import', 'export', 'ruler'] // Custom buttons
      ],
      handlers: {
        'import': () => setShowImportModal(true),
        'export': exportDocument,
        'ruler': () => setShowRulers(!showRulers)
      }
    },
    clipboard: {
      matchVisual: false
    }
  }), [showRulers]);

  const formats = [
    'header',
    'bold', 'italic', 'underline', 'strike', 
    'blockquote', 'code-block',
    'list', 'bullet', 'indent',
    'script',
    'direction',
    'color', 'background',
    'font',
    'align',
    'link', 'image', 'video'
  ];

  // Import document handler
  const handleImportClick = async (source: string) => {
    if (source === 'local') {
      const input = document.createElement('input');
      input.type = 'file';
      input.accept = '.docx,.doc,.txt,.rtf';
      input.onchange = async (e: any) => {
        const file = e.target.files[0];
        if (file) {
          if (file.name.endsWith('.docx') || file.name.endsWith('.doc')) {
            const arrayBuffer = await file.arrayBuffer();
            const result = await mammoth.extractRawText({ arrayBuffer });
            onChange(result.value);
          } else if (file.name.endsWith('.txt')) {
            const text = await file.text();
            onChange(text);
          }
        }
      };
      input.click();
    }
    // Handle other import sources...
  };

  // Add custom toolbar buttons
  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    // Import Quill directly since we're using a wrapper
    import('react-quill').then((module) => {
      const Quill = (module as any).Quill;
      if (!Quill) return;
      
      const icons = Quill.import('ui/icons');
      icons['import'] = '<svg viewBox="0 0 24 24"><path d="M19 9h-4V3H9v6H5l7 7 7-7zM5 18v2h14v-2H5z"/></svg>';
      icons['export'] = '<svg viewBox="0 0 24 24"><path d="M9 16h6v-6h4l-7-7-7 7h4v6zm-4 2h14v2H5v-2z"/></svg>';
      icons['ruler'] = '<svg viewBox="0 0 24 24"><path d="M3 13h2v-2H3v2zm0 4h2v-2H3v2zm0-8h2V7H3v2zm4 4h14v-2H7v2zm0 4h14v-2H7v2zm0-10v2h14V7H7z"/></svg>';
    });
  }, []);

  return (
    <div className="quill-container">
      {showImportModal && (
        <ImportSourcesModal 
          isOpen={showImportModal}
          onClose={() => setShowImportModal(false)}
          onImport={(content: string) => {
            onChange(content);
            setShowImportModal(false);
          }}
        />
      )}
      
      <div className="quill-editor-wrapper" style={{ position: 'relative', flex: 1 }}>
        <QuillWrapper
          forwardedRef={quillRef}
          value={content}
          onChange={handleChange}
          modules={modules}
          formats={formats}
          placeholder="" // Disable default placeholder when using animated one
          className={`quill-editor ${showRulers ? 'with-rulers' : ''}`}
        />
        <EditorRulers showRulers={showRulers} />
        {isEmpty && <AnimatedPlaceholder />}
      </div>
    </div>
  );
};

export default QuillEditor;