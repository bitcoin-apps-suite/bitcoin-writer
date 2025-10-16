import React, { useState, useRef, useEffect } from 'react';
import './ProTaskbar.css';

interface TaskbarProps {
  isAuthenticated: boolean;
  currentUser: any;
  onLogout: () => void;
}

const ProTaskbar: React.FC<TaskbarProps> = ({ isAuthenticated, currentUser, onLogout }) => {
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setActiveMenu(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleMenuClick = (menuName: string) => {
    setActiveMenu(activeMenu === menuName ? null : menuName);
  };

  const handleMenuHover = (menuName: string) => {
    if (activeMenu !== null) {
      setActiveMenu(menuName);
    }
  };

  return (
    <div className="pro-taskbar" ref={menuRef}>
      {/* Bitcoin Logo */}
      <div className="taskbar-bitcoin">₿</div>

      {/* Menu Items */}
      <div className="taskbar-menus">
        {/* Bitcoin Writer Menu */}
        <div 
          className={`menu-item ${activeMenu === 'app' ? 'active' : ''}`}
          onClick={() => handleMenuClick('app')}
          onMouseEnter={() => handleMenuHover('app')}
        >
          <span className="menu-title">Bitcoin Writer</span>
          {activeMenu === 'app' && (
            <div className="menu-dropdown">
              <div className="dropdown-item">About Bitcoin Writer</div>
              <div className="dropdown-divider" />
              <div className="dropdown-item">
                <span>Preferences...</span>
                <span className="shortcut">⌘,</span>
              </div>
              <div className="dropdown-divider" />
              <div className="dropdown-item">
                <span>Hide Bitcoin Writer</span>
                <span className="shortcut">⌘H</span>
              </div>
              <div className="dropdown-item">
                <span>Hide Others</span>
                <span className="shortcut">⌥⌘H</span>
              </div>
              <div className="dropdown-item">Show All</div>
              <div className="dropdown-divider" />
              <div className="dropdown-item" onClick={onLogout}>
                <span>Quit Bitcoin Writer</span>
                <span className="shortcut">⌘Q</span>
              </div>
            </div>
          )}
        </div>

        {/* File Menu */}
        <div 
          className={`menu-item ${activeMenu === 'file' ? 'active' : ''}`}
          onClick={() => handleMenuClick('file')}
          onMouseEnter={() => handleMenuHover('file')}
        >
          <span className="menu-title">File</span>
          {activeMenu === 'file' && (
            <div className="menu-dropdown">
              <div className="dropdown-item">
                <span>New</span>
                <span className="shortcut">⌘N</span>
              </div>
              <div className="dropdown-item">
                <span>Open...</span>
                <span className="shortcut">⌘O</span>
              </div>
              <div className="dropdown-item">Open Recent</div>
              <div className="dropdown-divider" />
              <div className="dropdown-item">
                <span>Close</span>
                <span className="shortcut">⌘W</span>
              </div>
              <div className="dropdown-item">
                <span>Save</span>
                <span className="shortcut">⌘S</span>
              </div>
              <div className="dropdown-item">
                <span>Save As...</span>
                <span className="shortcut">⇧⌘S</span>
              </div>
              <div className="dropdown-divider" />
              <div className="dropdown-item">Export to PDF...</div>
              <div className="dropdown-item">Export to Word...</div>
            </div>
          )}
        </div>

        {/* Edit Menu */}
        <div 
          className={`menu-item ${activeMenu === 'edit' ? 'active' : ''}`}
          onClick={() => handleMenuClick('edit')}
          onMouseEnter={() => handleMenuHover('edit')}
        >
          <span className="menu-title">Edit</span>
          {activeMenu === 'edit' && (
            <div className="menu-dropdown">
              <div className="dropdown-item">
                <span>Undo</span>
                <span className="shortcut">⌘Z</span>
              </div>
              <div className="dropdown-item">
                <span>Redo</span>
                <span className="shortcut">⇧⌘Z</span>
              </div>
              <div className="dropdown-divider" />
              <div className="dropdown-item">
                <span>Cut</span>
                <span className="shortcut">⌘X</span>
              </div>
              <div className="dropdown-item">
                <span>Copy</span>
                <span className="shortcut">⌘C</span>
              </div>
              <div className="dropdown-item">
                <span>Paste</span>
                <span className="shortcut">⌘V</span>
              </div>
              <div className="dropdown-item">
                <span>Select All</span>
                <span className="shortcut">⌘A</span>
              </div>
              <div className="dropdown-divider" />
              <div className="dropdown-item">
                <span>Find...</span>
                <span className="shortcut">⌘F</span>
              </div>
            </div>
          )}
        </div>

        {/* View Menu */}
        <div 
          className={`menu-item ${activeMenu === 'view' ? 'active' : ''}`}
          onClick={() => handleMenuClick('view')}
          onMouseEnter={() => handleMenuHover('view')}
        >
          <span className="menu-title">View</span>
          {activeMenu === 'view' && (
            <div className="menu-dropdown">
              <div className="dropdown-item">Show Toolbar</div>
              <div className="dropdown-item">Show Sidebar</div>
              <div className="dropdown-divider" />
              <div className="dropdown-item">
                <span>Enter Full Screen</span>
                <span className="shortcut">⌃⌘F</span>
              </div>
            </div>
          )}
        </div>

        {/* Tools Menu */}
        <div 
          className={`menu-item ${activeMenu === 'tools' ? 'active' : ''}`}
          onClick={() => handleMenuClick('tools')}
          onMouseEnter={() => handleMenuHover('tools')}
        >
          <span className="menu-title">Tools</span>
          {activeMenu === 'tools' && (
            <div className="menu-dropdown">
              <div className="dropdown-item">Save to Blockchain</div>
              <div className="dropdown-item">Encrypt Document</div>
              <div className="dropdown-divider" />
              <div className="dropdown-item">Create NFT</div>
              <div className="dropdown-item">Set Paywall</div>
            </div>
          )}
        </div>

        {/* Window Menu */}
        <div 
          className={`menu-item ${activeMenu === 'window' ? 'active' : ''}`}
          onClick={() => handleMenuClick('window')}
          onMouseEnter={() => handleMenuHover('window')}
        >
          <span className="menu-title">Window</span>
          {activeMenu === 'window' && (
            <div className="menu-dropdown">
              <div className="dropdown-item">
                <span>Minimize</span>
                <span className="shortcut">⌘M</span>
              </div>
              <div className="dropdown-item">Zoom</div>
              <div className="dropdown-divider" />
              <div className="dropdown-item">Bring All to Front</div>
            </div>
          )}
        </div>

        {/* Help Menu */}
        <div 
          className={`menu-item ${activeMenu === 'help' ? 'active' : ''}`}
          onClick={() => handleMenuClick('help')}
          onMouseEnter={() => handleMenuHover('help')}
        >
          <span className="menu-title">Help</span>
          {activeMenu === 'help' && (
            <div className="menu-dropdown">
              <div className="dropdown-item">Bitcoin Writer Help</div>
            </div>
          )}
        </div>
      </div>

      {/* Right side status */}
      <div className="taskbar-status">
        {isAuthenticated && currentUser && (
          <span className="status-user">{currentUser.handle || 'Connected'}</span>
        )}
      </div>
    </div>
  );
};

export default ProTaskbar;