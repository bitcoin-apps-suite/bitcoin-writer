import React, { useState } from 'react';
import './EditorModeToggle.css';

interface EditorModeToggleProps {
  currentMode: 'simple' | 'advanced';
  onModeChange: (mode: 'simple' | 'advanced') => void;
}

const EditorModeToggle: React.FC<EditorModeToggleProps> = ({ currentMode, onModeChange }) => {
  const [showModal, setShowModal] = useState(false);

  const handleAdvancedClick = () => {
    if (currentMode === 'simple') {
      setShowModal(true);
    }
  };

  const handleSimpleClick = () => {
    if (currentMode === 'advanced') {
      onModeChange('simple');
    }
  };

  return (
    <>
      <div className="editor-mode-toggle">
        <button 
          className={`mode-btn ${currentMode === 'simple' ? 'active' : ''}`}
          onClick={handleSimpleClick}
          title="Simple HTML editor"
        >
          <span className="mode-icon">✏️</span>
          <span className="mode-label">Simple Editor</span>
        </button>
        
        <button 
          className={`mode-btn ${currentMode === 'advanced' ? 'active' : ''}`}
          onClick={handleAdvancedClick}
          title="Full Word processor with Quill"
        >
          <span className="mode-icon">📝</span>
          <span className="mode-label">Word Processor</span>
          <span className="mode-badge">New!</span>
        </button>
        
        <button 
          className="mode-btn pro-mode"
          onClick={() => setShowModal(true)}
          title="Coming soon: ONLYOFFICE integration"
        >
          <span className="mode-icon">🚀</span>
          <span className="mode-label">Pro Office Suite</span>
          <span className="mode-badge coming-soon">Coming Soon</span>
        </button>
      </div>

      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setShowModal(false)}>×</button>
            
            <div className="modal-header">
              <h2>🚀 ONLYOFFICE Integration Coming Soon!</h2>
            </div>
            
            <div className="modal-body">
              <div className="feature-preview">
                <h3>Full Microsoft Office Compatibility</h3>
                <p>We're working on integrating ONLYOFFICE - a complete office suite that will give you:</p>
                
                <ul className="feature-list">
                  <li>✅ 100% Microsoft Word, Excel, PowerPoint compatibility</li>
                  <li>✅ Real-time collaboration with multiple users</li>
                  <li>✅ Advanced formatting and page layout</li>
                  <li>✅ Tables, charts, and smart art</li>
                  <li>✅ Track changes and comments</li>
                  <li>✅ Mail merge and templates</li>
                  <li>✅ Direct .docx, .xlsx, .pptx editing</li>
                </ul>

                <div className="progress-section">
                  <h4>Development Progress</h4>
                  <div className="progress-bar">
                    <div className="progress-fill" style={{ width: '35%' }}>
                      <span>35% Complete</span>
                    </div>
                  </div>
                  <p className="progress-note">
                    The ONLYOFFICE integration will be available once we successfully implement 
                    and test the current Quill word processor. Your documents will seamlessly 
                    transfer to the new system when it launches.
                  </p>
                </div>

                <div className="cta-section">
                  <h4>Try the Word Processor Now!</h4>
                  <p>While we work on ONLYOFFICE, enjoy our new Quill-based word processor with:</p>
                  <ul>
                    <li>• Rich text formatting</li>
                    <li>• Import/Export .docx files</li>
                    <li>• Images and videos</li>
                    <li>• Lists and tables</li>
                  </ul>
                  <button 
                    className="try-quill-btn"
                    onClick={() => {
                      onModeChange('advanced');
                      setShowModal(false);
                    }}
                  >
                    Try Word Processor Now
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default EditorModeToggle;