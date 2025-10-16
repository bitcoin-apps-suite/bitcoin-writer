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
  const instanceId = useRef(Math.random().toString(36).substr(2, 9));

  useEffect(() => {
    if (typeof window === 'undefined' || !editorRef.current) return;
    
    // Check if this specific editor instance is already initialized
    const editorElement = editorRef.current;
    if (editorElement.dataset.quillInitialized === 'true') {
      console.log(`Skipping Quill init for instance ${instanceId.current} - already initialized`);
      return;
    }

    const initQuill = async () => {
      console.log(`Initializing Quill instance ${instanceId.current}`);
      // Clean up any existing Quill instances and toolbars
      const container = editorRef.current;
      if (!container) return;
      
      // Find and remove ALL existing toolbars in the entire wrapper
      const wrapper = container.closest('.quill-editor-wrapper');
      const existingToolbars = wrapper?.querySelectorAll('.ql-toolbar');
      existingToolbars?.forEach((toolbar, index) => {
        console.log(`Removing existing toolbar ${index + 1} from wrapper`);
        toolbar.remove();
      });
      
      // Also check parent element for toolbars
      const parent = container.parentElement;
      const parentToolbars = parent?.querySelectorAll('.ql-toolbar');
      parentToolbars?.forEach((toolbar, index) => {
        console.log(`Removing parent toolbar ${index + 1}`);
        toolbar.remove();
      });
      
      // Clean up the editor container if it already has Quill classes
      if (container.classList.contains('ql-container')) {
        console.log('Editor already has Quill classes, resetting');
        container.innerHTML = '';
        container.className = 'quill-editor with-rulers';
        // Remove the data attribute to allow reinit if needed
        delete container.dataset.quillInitialized;
      }
      try {
        // Dynamically import Quill to avoid SSR issues
        const Quill = (await import('quill')).default;
        await import('quill/dist/quill.snow.css');

        // Initialize Quill with minimal formatting toolbar
        console.log('Initializing Quill editor...');
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
        
        // Mark this editor instance as initialized
        editorElement.dataset.quillInitialized = 'true';

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
    
    // Cleanup function
    return () => {
      if (quillRef.current) {
        console.log(`Cleaning up Quill instance ${instanceId.current}`);
        // Clean up event listeners
        quillRef.current.off('text-change');
        quillRef.current = null;
        
        // Clear the initialization flag
        if (editorRef.current) {
          delete editorRef.current.dataset.quillInitialized;
        }
      }
    };
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
        {isEmpty && <AnimatedPlaceholder />}
      </div>
    </div>
  );
};

export default QuillEditorDirect;