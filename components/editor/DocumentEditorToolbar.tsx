import React from 'react';
import './DocumentEditorToolbar.css';

interface ToolbarProps {
  // Row 1 - Tabs
  activeTab: 'jobs' | 'available' | 'my-jobs';
  onTabChange: (tab: 'jobs' | 'available' | 'my-jobs') => void;
  
  // Row 2 - Actions
  onSave: () => void;
  onExport: () => void;
  onWorkTree: () => void;
  onEncryptChain: () => void;
  onPublishChain: () => void;
  onSchedulePublication: () => void;
  onAddImage: () => void;
  onSetPrice: () => void;
  onPostTwitter: () => void;
  onToggleDarkMode: () => void;
  
  // Row 3 - Import/Export
  onImportWord: () => void;
  onImportText: () => void;
  onGoogleDocs: () => void;
  onNotion: () => void;
  onOtherApps: () => void;
  onExportWord: () => void;
  onExportHTML: () => void;
  onRulers: () => void;
  
  // States
  isDarkMode: boolean;
  isLoading: boolean;
  wordCount: number;
  currentPrice: string;
  unsavedChanges: boolean;
  readPrice: number;
  isAuthenticated: boolean;
  documentTitle: string;
  onTitleChange: (title: string) => void;
}

const DocumentEditorToolbar: React.FC<ToolbarProps> = ({
  activeTab,
  onTabChange,
  onSave,
  onExport,
  onWorkTree,
  onEncryptChain,
  onPublishChain,
  onSchedulePublication,
  onAddImage,
  onSetPrice,
  onPostTwitter,
  onToggleDarkMode,
  onImportWord,
  onImportText,
  onGoogleDocs,
  onNotion,
  onOtherApps,
  onExportWord,
  onExportHTML,
  onRulers,
  isDarkMode,
  isLoading,
  wordCount,
  currentPrice,
  unsavedChanges,
  readPrice,
  isAuthenticated,
  documentTitle,
  onTitleChange
}) => {
  return (
    <div className="document-editor-toolbar">
      <div className="toolbar-desktop">
        {/* Document Title Input */}
        <div className="document-title">
          <input
            type="text"
            value={documentTitle}
            onChange={(e) => onTitleChange(e.target.value)}
            placeholder="Untitled Document"
          />
        </div>

        {/* Row 1 - Tabs */}
        <div className="toolbar-row-1">
          <div className="document-tabs">
            <button 
              className={`tab-button ${activeTab === 'jobs' ? 'active' : ''}`}
              onClick={() => onTabChange('jobs')}
            >
              Jobs Queue
            </button>
            <button 
              className={`tab-button ${activeTab === 'available' ? 'active' : ''}`}
              onClick={() => onTabChange('available')}
            >
              Available
            </button>
            <button 
              className={`tab-button ${activeTab === 'my-jobs' ? 'active' : ''}`}
              onClick={() => onTabChange('my-jobs')}
            >
              My Jobs
            </button>
            <span style={{ marginLeft: '10px', fontSize: '12px', color: '#888' }}>
              My Docs
            </span>
          </div>
        </div>

        {/* Row 2 - Main Actions */}
        <div className="toolbar-row-2">
          <div className="button-group">
            <button 
              onClick={onSave}
              disabled={isLoading || wordCount === 0}
              className={`action-button ${wordCount > 0 ? 'primary' : ''}`}
              title="Save to Chain - Hash your writing to Bitcoin blockchain"
            >
              💾 Save to Chain
            </button>
            {wordCount > 0 && (
              <span className="price-display">
                {currentPrice}
              </span>
            )}
            {unsavedChanges && <span style={{ color: '#f7931a' }}>•</span>}
          </div>

          <div className="button-divider" />

          <div className="button-group">
            <button onClick={onExport} className="action-button">
              📁 Export...
            </button>
            <button onClick={onWorkTree} className="action-button">
              🌳 Work Tree
            </button>
          </div>

          <div className="button-divider" />

          <div className="button-group">
            <button 
              onClick={onEncryptChain}
              disabled={isLoading}
              className="action-button"
            >
              🔒 Encrypt on Chain
            </button>
            <button 
              onClick={onPublishChain}
              disabled={isLoading}
              className="action-button"
            >
              🌍 Publish to Chain
            </button>
            <button 
              onClick={onSchedulePublication}
              disabled={isLoading}
              className="action-button"
            >
              📅 Schedule Publication
            </button>
          </div>

          <div className="button-divider" />

          <div className="button-group">
            <button onClick={onAddImage} className="action-button">
              🖼 Add Image
            </button>
            <button 
              onClick={onSetPrice}
              disabled={isLoading}
              className="action-button"
            >
              💰 Set Price to Read
              {readPrice > 0 && <span style={{ marginLeft: '4px' }}>(${readPrice})</span>}
            </button>
            <button 
              onClick={onPostTwitter}
              disabled={isLoading}
              className="action-button"
            >
              🐦 Post to Twitter
            </button>
            <button onClick={onToggleDarkMode} className="action-button">
              {isDarkMode ? '☀️' : '🌙'}
            </button>
          </div>
        </div>

        {/* Row 3 - Import/Export Options */}
        <div className="toolbar-row-3">
          <div className="button-group">
            <button onClick={onImportWord} className="action-button">
              📥 Import Word
            </button>
            <button onClick={onImportText} className="action-button">
              📄 Import Text
            </button>
            <button onClick={onGoogleDocs} className="action-button">
              📑 Google Docs
            </button>
            <button onClick={onNotion} className="action-button">
              📝 Notion
            </button>
            <button onClick={onOtherApps} className="action-button">
              ⚡ Other Apps
            </button>
          </div>

          <div className="button-divider" />

          <div className="button-group">
            <button onClick={onExportWord} className="action-button">
              📤 Export Word
            </button>
            <button onClick={onExportHTML} className="action-button">
              🌐 Export HTML
            </button>
          </div>

          <div className="button-divider" />

          <div className="button-group">
            <button onClick={onRulers} className="action-button">
              📏 Rulers
            </button>
          </div>

          <div style={{ marginLeft: 'auto', display: 'flex', gap: '10px', fontSize: '12px', color: '#888' }}>
            <span>{wordCount} words</span>
            <span>0 characters</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DocumentEditorToolbar;