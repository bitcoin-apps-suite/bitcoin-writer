import React, { useState, useEffect, useRef } from 'react';
import './QuillEditor.css';

interface SimpleEditorProps {
  content: string;
  onChange: (content: string) => void;
  onTextChange?: (text: string) => void;
  placeholder?: string;
  wordCount?: number;
  charCount?: number;
}

const SimpleEditor: React.FC<SimpleEditorProps> = ({
  content,
  onChange,
  onTextChange,
  placeholder = 'Start writing your document...',
  wordCount = 0,
  charCount = 0
}) => {
  const editorRef = useRef<HTMLDivElement>(null);
  const [localContent, setLocalContent] = useState(content);
  const [isEmpty, setIsEmpty] = useState(true);

  useEffect(() => {
    if (editorRef.current && content !== editorRef.current.innerHTML) {
      editorRef.current.innerHTML = content;
      updateEmptyState(content);
    }
  }, [content]);

  const updateEmptyState = (html: string) => {
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = html;
    const text = tempDiv.textContent || tempDiv.innerText || '';
    setIsEmpty(text.trim().length === 0);
  };

  const handleInput = () => {
    if (editorRef.current) {
      const html = editorRef.current.innerHTML;
      setLocalContent(html);
      onChange(html);
      updateEmptyState(html);
      
      if (onTextChange) {
        const text = editorRef.current.textContent || editorRef.current.innerText || '';
        onTextChange(text);
      }
    }
  };

  const execCommand = (command: string, value?: string) => {
    document.execCommand(command, false, value);
    handleInput();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    // Handle keyboard shortcuts
    if (e.ctrlKey || e.metaKey) {
      switch (e.key) {
        case 'b':
          e.preventDefault();
          execCommand('bold');
          break;
        case 'i':
          e.preventDefault();
          execCommand('italic');
          break;
        case 'u':
          e.preventDefault();
          execCommand('underline');
          break;
      }
    }
  };

  return (
    <div className="simple-editor-container">
      {/* Toolbar */}
      <div className="simple-editor-toolbar">
        <div className="toolbar-group">
          <select 
            onChange={(e) => execCommand('formatBlock', e.target.value)}
            className="toolbar-select"
          >
            <option value="p">Normal</option>
            <option value="h1">Heading 1</option>
            <option value="h2">Heading 2</option>
            <option value="h3">Heading 3</option>
            <option value="h4">Heading 4</option>
          </select>
        </div>

        <div className="toolbar-separator" />

        <div className="toolbar-group">
          <button 
            className="toolbar-btn"
            onClick={() => execCommand('bold')}
            title="Bold (Ctrl+B)"
          >
            <strong>B</strong>
          </button>
          <button 
            className="toolbar-btn"
            onClick={() => execCommand('italic')}
            title="Italic (Ctrl+I)"
          >
            <em>I</em>
          </button>
          <button 
            className="toolbar-btn"
            onClick={() => execCommand('underline')}
            title="Underline (Ctrl+U)"
          >
            <u>U</u>
          </button>
          <button 
            className="toolbar-btn"
            onClick={() => execCommand('strikeThrough')}
            title="Strikethrough"
          >
            <s>S</s>
          </button>
        </div>

        <div className="toolbar-separator" />

        <div className="toolbar-group">
          <button 
            className="toolbar-btn"
            onClick={() => execCommand('insertUnorderedList')}
            title="Bullet list"
          >
            • List
          </button>
          <button 
            className="toolbar-btn"
            onClick={() => execCommand('insertOrderedList')}
            title="Numbered list"
          >
            1. List
          </button>
        </div>

        <div className="toolbar-separator" />

        <div className="toolbar-group">
          <button 
            className="toolbar-btn"
            onClick={() => execCommand('justifyLeft')}
            title="Align left"
          >
            ⬅
          </button>
          <button 
            className="toolbar-btn"
            onClick={() => execCommand('justifyCenter')}
            title="Align center"
          >
            ⬌
          </button>
          <button 
            className="toolbar-btn"
            onClick={() => execCommand('justifyRight')}
            title="Align right"
          >
            ➡
          </button>
        </div>

        <div className="toolbar-separator" />

        <div className="toolbar-group">
          <button 
            className="toolbar-btn"
            onClick={() => {
              const url = prompt('Enter URL:');
              if (url) execCommand('createLink', url);
            }}
            title="Insert link"
          >
            🔗
          </button>
          <button 
            className="toolbar-btn"
            onClick={() => execCommand('removeFormat')}
            title="Clear formatting"
          >
            ✖
          </button>
        </div>
      </div>

      {/* Editor */}
      <div className="simple-editor-wrapper">
        {isEmpty && (
          <div className="simple-editor-placeholder">
            {placeholder}
          </div>
        )}
        <div
          ref={editorRef}
          className="simple-editor-content"
          contentEditable
          onInput={handleInput}
          onKeyDown={handleKeyDown}
          suppressContentEditableWarning
          style={{
            minHeight: '400px',
            padding: '20px',
            fontSize: '16px',
            lineHeight: '1.6',
            outline: 'none',
            backgroundColor: '#fff',
            overflow: 'auto'
          }}
        />
      </div>

      {/* Status bar */}
      <div className="editor-status-bar">
        <span>{wordCount} words</span>
        <span className="separator">|</span>
        <span>{charCount} characters</span>
      </div>

      <style jsx>{`
        .simple-editor-container {
          display: flex;
          flex-direction: column;
          height: 100%;
          background: #fff;
        }

        .simple-editor-toolbar {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 10px;
          border-bottom: 1px solid #ddd;
          background: #f8f8f8;
          flex-wrap: wrap;
        }

        .toolbar-group {
          display: flex;
          gap: 5px;
        }

        .toolbar-separator {
          width: 1px;
          height: 24px;
          background: #ddd;
        }

        .toolbar-btn {
          padding: 5px 10px;
          border: 1px solid #ddd;
          background: #fff;
          cursor: pointer;
          border-radius: 3px;
          font-size: 14px;
        }

        .toolbar-btn:hover {
          background: #f0f0f0;
        }

        .toolbar-select {
          padding: 5px;
          border: 1px solid #ddd;
          background: #fff;
          border-radius: 3px;
        }

        .simple-editor-wrapper {
          position: relative;
          flex: 1;
          overflow: auto;
        }

        .simple-editor-placeholder {
          position: absolute;
          top: 20px;
          left: 20px;
          color: #999;
          pointer-events: none;
          user-select: none;
        }

        .simple-editor-content {
          min-height: 100%;
        }

        .simple-editor-content:focus {
          outline: none;
        }

        .editor-status-bar {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 10px;
          border-top: 1px solid #ddd;
          background: #f8f8f8;
          font-size: 12px;
          color: #666;
        }

        .separator {
          color: #999;
        }
      `}</style>
    </div>
  );
};

export default SimpleEditor;