import React, { useState } from 'react';
import './TestPage.css';

const TestPage: React.FC = () => {
  const [showDropdown, setShowDropdown] = useState(false);

  return (
    <div className="test-page">
      {/* Taskbar */}
      <div className="test-taskbar">
        <div className="test-taskbar-content">
          <span className="test-logo">₿ Bitcoin Writer</span>
          
          <div className="test-menu-container">
            <button 
              className="test-menu-button"
              onClick={() => setShowDropdown(!showDropdown)}
            >
              File
            </button>
            
            {showDropdown && (
              <div className="test-dropdown">
                <div className="test-menu-item">New Document</div>
                <div className="test-menu-item">Open Document</div>
                <div className="test-menu-item">Save Document</div>
                <div className="test-divider"></div>
                <div className="test-menu-item">Export as PDF</div>
                <div className="test-menu-item">Print</div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="test-content">
        <h1>Z-Index Test Page</h1>
        <p>This page tests the layering of taskbar menus vs editor rulers.</p>
        
        {/* Editor Container */}
        <div className="test-editor-container">
          {/* Horizontal Ruler */}
          <div className="test-horizontal-ruler">
            <div className="test-ruler-label">Horizontal Ruler (z-index: 100)</div>
          </div>
          
          {/* Vertical Ruler */}
          <div className="test-vertical-ruler">
            <div className="test-ruler-label">Vertical Ruler (z-index: 99)</div>
          </div>
          
          {/* Editor Content */}
          <div className="test-editor-content">
            <p>Editor content area</p>
            <p>Click the "File" menu in the taskbar above to test if the dropdown appears in front of the rulers.</p>
            <p>The dropdown should have z-index: 10001 and appear above everything.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TestPage;