import React, { useState, useRef } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import EditorRulers from '../components/EditorRulers';
import AnimatedPlaceholder from '../components/AnimatedPlaceholder';
import DocumentSidebar from '../components/DocumentSidebar';
import { BlockchainDocument } from '../services/BlockchainDocumentService';
import './TestEditorPage.css';

const TestEditorPage: React.FC = () => {
  const [content, setContent] = useState('');
  const [textCount, setTextCount] = useState(0);
  const [showRulers, setShowRulers] = useState(true);
  const [isEmpty, setIsEmpty] = useState(true);
  const [currentDocumentId, setCurrentDocumentId] = useState<string | undefined>(undefined);
  const quillRef = useRef<ReactQuill>(null);

  // Quill modules configuration
  const modules = {
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
      ]
    },
    clipboard: {
      matchVisual: false,
    },
    history: {
      delay: 1000,
      maxStack: 500,
      userOnly: true
    }
  };

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

  const handleContentChange = (value: string, delta: any, source: string, editor: any) => {
    setContent(value);
    const text = editor.getText();
    setIsEmpty(text.trim().length === 0);
    // Count words
    const words = text.trim().split(/\s+/).filter((word: string) => word.length > 0);
    setTextCount(words.length);
  };

  return (
    <div className="test-editor-page">
{/* DocumentSidebar removed - using the one from App.tsx */}
      
      <div className="test-main-content">
        
      
      <div className="test-editor-container">
        {/* Toolbar */}
        <div className="toolbar-desktop">
          <div className="toolbar-left">
            <button 
              onClick={() => setShowRulers(!showRulers)}
              className={`ruler-toggle-btn ${showRulers ? 'active' : ''}`}
              title={showRulers ? "Hide Rulers" : "Show Rulers"}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" style={{marginRight: '8px'}}>
                <path d="M3,5V7H7V5H3M13,5V11H21V5H13M15,7H19V9H15V7M3,11V13H7V11H3M15,13V19H21V13H15M17,15H19V17H17V15M3,17V19H7V17H3M9,5V7H11V5H9M9,9V19H13V9H9M11,11V13H11.5V11H11M11,15V17H11.5V15H11Z"/>
              </svg>
              Rulers
            </button>
            
            <button 
              onClick={() => console.log('Save clicked')}
              title="Save"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" style={{marginRight: '8px'}}>
                <path d="M15,9H5V5H15M12,19A3,3 0 0,1 9,16A3,3 0 0,1 12,13A3,3 0 0,1 15,16A3,3 0 0,1 12,19M17,3H5C3.89,3 3,3.9 3,5V19A2,2 0 0,0 5,21H19A2,2 0 0,0 21,19V7L17,3Z"/>
              </svg>
              Save
            </button>
            
            <button 
              onClick={() => console.log('Work Tree clicked')}
              title="Work Tree"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" style={{ marginRight: '6px', verticalAlign: 'middle' }}>
                <rect x="11" y="16" width="2" height="6" fill="#8b4513" />
                <circle cx="12" cy="8" r="6" fill="#22c55e" opacity="0.9" />
                <circle cx="12" cy="10" r="5" fill="#16a34a" opacity="0.8" />
                <circle cx="12" cy="12" r="4" fill="#15803d" opacity="0.7" />
                <path d="M8 10l2-1M16 10l-2-1M9 12l1.5-0.5M15 12l-1.5-0.5" stroke="#0f5132" strokeWidth="1" strokeLinecap="round" />
              </svg>
              Work Tree
            </button>
            
            <button 
              onClick={() => console.log('Encrypt on Chain clicked')}
              title="Encrypt on Chain"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" style={{marginRight: '8px'}}>
                <path d="M12,1L3,5V11C3,16.55 6.84,21.74 12,23C17.16,21.74 21,16.55 21,11V5L12,1M12,7C13.4,7 14.8,8.6 14.8,10V11H15C15.6,11 16,11.4 16,12V18C16,18.6 15.6,19 15,19H9C8.4,19 8,18.6 8,18V12C8,11.4 8.4,11 9,11H9.2V10C9.2,8.6 10.6,7 12,7M12,8.2C11.2,8.2 10.2,8.7 10.2,10V11H13.8V10C13.8,8.7 12.8,8.2 12,8.2Z"/>
              </svg>
              Encrypt on Chain
            </button>
            
            <button 
              onClick={() => console.log('Publish to Chain clicked')}
              title="Publish to Chain"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" style={{marginRight: '8px'}}>
                <path d="M17.9,17.39C17.64,16.59 16.89,16 16,16H15V13A1,1 0 0,0 14,12H8V10H10A1,1 0 0,0 11,9V7H13A2,2 0 0,0 15,5V4.59C17.93,5.77 20,8.64 20,12C20,14.08 19.2,15.97 17.9,17.39M11,19.93C7.05,19.44 4,16.08 4,12C4,11.38 4.08,10.78 4.21,10.21L9,15V16A2,2 0 0,0 11,18M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2Z"/>
              </svg>
              Publish to Chain
            </button>
            
            <button 
              onClick={() => console.log('Schedule Publication clicked')}
              title="Schedule Publication"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" style={{marginRight: '8px'}}>
                <path d="M19,19H5V8H19M16,1V3H8V1H6V3H5C3.89,3 3,3.89 3,5V19A2,2 0 0,0 5,21H19A2,2 0 0,0 21,19V5C21,3.89 20.1,3 19,3H18V1M17,12H12V17H17V12Z"/>
              </svg>
              Schedule Publication
            </button>
            
            <button 
              onClick={() => {
                const input = document.createElement('input');
                input.type = 'file';
                input.accept = 'image/*';
                input.onchange = (e) => {
                  const file = (e.target as HTMLInputElement).files?.[0];
                  if (file) {
                    console.log('Add Image:', file.name);
                  }
                };
                input.click();
              }}
              title="Add Image"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" style={{marginRight: '8px'}}>
                <path d="M9,2V7.38L10.5,8.88L12,7.38V2H9M20,5V19C20,20.1 19.1,21 18,21H6C4.89,21 4,20.1 4,19V5C4,3.89 4.89,3 6,3H7V9L9.5,6.5L12,9V3H18C19.1,3 20,3.89 20,5Z"/>
              </svg>
              Add Image
            </button>
            
            <button 
              onClick={() => {
                const price = prompt('Set price to read (in USD):', '0');
                if (price !== null) {
                  console.log('Set Price to Read:', price);
                }
              }}
              title="Set Price to Read"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" style={{marginRight: '8px'}}>
                <path d="M7,15H9C9,16.08 10.37,17 12,17C13.63,17 15,16.08 15,15C15,13.9 13.96,13.5 11.76,12.97C9.64,12.44 7,11.78 7,9C7,7.21 8.47,5.69 10.5,5.18V3H13.5V5.18C15.53,5.69 17,7.21 17,9H15C15,7.92 13.63,7 12,7C10.37,7 9,7.92 9,9C9,10.1 10.04,10.5 12.24,11.03C14.36,11.56 17,12.22 17,15C17,16.79 15.53,18.31 13.5,18.82V21H10.5V18.82C8.47,18.31 7,16.79 7,15Z"/>
              </svg>
              Set Price to Read
            </button>
          </div>
        </div>
        
        {/* Editor with Rulers and Placeholder */}
        <div className="quill-editor-wrapper" style={{ position: 'relative' }}>
          <ReactQuill
            ref={quillRef}
            theme="snow"
            value={content}
            onChange={handleContentChange}
            modules={modules}
            formats={formats}
            placeholder=""
            className={`test-quill-editor ${showRulers ? 'with-rulers' : ''}`}
          />
          <EditorRulers showRulers={showRulers} />
          {isEmpty && <AnimatedPlaceholder />}
        </div>
      </div>
      </div>
    </div>
  );
};

export default TestEditorPage;