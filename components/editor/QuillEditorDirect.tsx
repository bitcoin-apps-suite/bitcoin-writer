'use client';

import React, { useEffect, useRef, useState } from 'react';
import AnimatedPlaceholder from '../AnimatedPlaceholder';
import ImportSourcesModal from '../modals/ImportSourcesModal';
import EditorRulers from './EditorRulers';

interface QuillEditorProps {
  content: string;
  onChange: (content: string) => void;
  onTextChange?: (text: string) => void;
  placeholder?: string;
  wordCount?: number;
  charCount?: number;
}

const QuillEditorDirect: React.FC<QuillEditorProps> = ({
  content,
  onChange,
  onTextChange,
  placeholder = "Start writing your next masterpiece...",
}) => {
  const editorRef = useRef<HTMLDivElement>(null);
  const quillRef = useRef<any>(null);
  const [isEmpty, setIsEmpty] = useState(true);
  const [showRulers, setShowRulers] = useState(true);
  const [showImportModal, setShowImportModal] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined' || !editorRef.current || isInitialized) return;

    const initQuill = async () => {
      try {
        // Dynamically import Quill to avoid SSR issues
        const Quill = (await import('quill')).default;
        await import('quill/dist/quill.snow.css');

        // Initialize Quill with minimal formatting toolbar
        const quill = new Quill(editorRef.current, {
          theme: 'snow',
          placeholder: '',
          modules: {
            toolbar: [
              ['bold', 'italic', 'underline'],
              [{ 'list': 'ordered'}, { 'list': 'bullet' }],
              [{ 'header': [1, 2, 3, false] }],
              [{ 'align': [] }]
            ]
          }
        });

        quillRef.current = quill;

        // Set initial content
        if (content && content !== '<p><br></p>') {
          quill.clipboard.dangerouslyPasteHTML(content);
        }

        // Handle text changes
        quill.on('text-change', () => {
          const html = quill.root.innerHTML;
          const text = quill.getText();
          
          onChange(html);
          
          if (onTextChange) {
            onTextChange(text);
          }

          // Check if empty
          setIsEmpty(!text.trim());
        });

        setIsInitialized(true);
      } catch (error) {
        console.error('Failed to initialize Quill:', error);
      }
    };

    initQuill();
  }, []);

  // Update content when prop changes
  useEffect(() => {
    if (!quillRef.current || !isInitialized) return;
    
    const quill = quillRef.current;
    const currentContent = quill.root.innerHTML;
    
    if (content !== currentContent) {
      const selection = quill.getSelection();
      quill.clipboard.dangerouslyPasteHTML(content);
      if (selection) {
        quill.setSelection(selection);
      }
    }
  }, [content, isInitialized]);

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
        <div 
          ref={editorRef}
          className={`quill-editor ${showRulers ? 'with-rulers' : ''}`}
        />
        <EditorRulers showRulers={showRulers} />
        {isEmpty && !isInitialized && <AnimatedPlaceholder />}
      </div>
    </div>
  );
};

export default QuillEditorDirect;