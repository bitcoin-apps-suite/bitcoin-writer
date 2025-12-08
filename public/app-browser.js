/**
 * Bitcoin Writer - Browser Version with Menu Bar
 */

// Set flag to detect if script loaded
window.appBrowserLoaded = true;

// Wait for DOM
document.addEventListener('DOMContentLoaded', function() {
  
  // Initialize menu bar
  initializeMenuBar();
  
  // Make editor contenteditable
  const editor = document.getElementById('editor');
  if (editor) {
    editor.contentEditable = true;
    editor.focus();
    if (!editor.innerHTML || editor.innerHTML.trim() === '') {
      editor.innerHTML = '<p>Start typing...</p>';
    }
  }

  // Simple format function
  function format(command) {
    document.execCommand(command, false, null);
    editor.focus();
    updateButtonStates();
  }

  // Connect buttons directly
  const buttons = {
    'boldBtn': () => format('bold'),
    'italicBtn': () => format('italic'),
    'underlineBtn': () => format('underline'),
    'strikeBtn': () => format('strikethrough'),
    'subBtn': () => format('subscript'),
    'superBtn': () => format('superscript'),
    'bulletListBtn': () => format('insertUnorderedList'),
    'numberListBtn': () => format('insertOrderedList'),
    'alignLeftBtn': () => format('justifyLeft'),
    'alignCenterBtn': () => format('justifyCenter'),
    'alignRightBtn': () => format('justifyRight'),
    'alignJustifyBtn': () => format('justifyFull'),
    'indentBtn': () => format('indent'),
    'outdentBtn': () => format('outdent'),
    'undoBtn': () => format('undo'),
    'redoBtn': () => format('redo'),
    'copyBtn': () => document.execCommand('copy'),
    'cutBtn': () => document.execCommand('cut'),
    'pasteBtn': () => {
      navigator.clipboard.readText().then(text => {
        document.execCommand('insertText', false, text);
      }).catch(() => {
        document.execCommand('paste');
      });
    }
  };

  // Attach event listeners
  Object.entries(buttons).forEach(([id, handler]) => {
    const btn = document.getElementById(id);
    if (btn) {
      btn.addEventListener('click', function(e) {
        e.preventDefault();
        e.stopPropagation();
        handler();
      });
    }
  });

  // Font controls
  const fontFamily = document.getElementById('fontFamily');
  if (fontFamily) {
    fontFamily.addEventListener('change', function(e) {
      document.execCommand('fontName', false, e.target.value);
    });
  }

  const fontSize = document.getElementById('fontSize');
  if (fontSize) {
    fontSize.addEventListener('change', function(e) {
      // Simple size mapping
      const sizes = { '8': 1, '10': 2, '12': 3, '14': 4, '16': 5, '18': 6, '24': 7 };
      document.execCommand('fontSize', false, sizes[e.target.value] || 3);
    });
  }

  // Color pickers
  const textColorBtn = document.getElementById('textColorBtn');
  if (textColorBtn) {
    textColorBtn.addEventListener('click', function() {
      const input = document.createElement('input');
      input.type = 'color';
      input.onchange = (e) => document.execCommand('foreColor', false, e.target.value);
      input.click();
    });
  }

  const highlightBtn = document.getElementById('highlightBtn');
  if (highlightBtn) {
    highlightBtn.addEventListener('click', function() {
      const input = document.createElement('input');
      input.type = 'color';
      input.value = '#ffff00';
      input.onchange = (e) => document.execCommand('backColor', false, e.target.value);
      input.click();
    });
  }

  // Table button
  const insertTableBtn = document.getElementById('insertTableBtn');
  if (insertTableBtn) {
    insertTableBtn.addEventListener('click', function() {
      const rows = prompt('Rows:', '3');
      const cols = prompt('Columns:', '3');
      if (rows && cols) {
        let html = '<table style="border-collapse:collapse;width:100%">';
        for (let i = 0; i < rows; i++) {
          html += '<tr>';
          for (let j = 0; j < cols; j++) {
            html += '<td style="border:1px solid #ddd;padding:8px">&nbsp;</td>';
          }
          html += '</tr>';
        }
        html += '</table><br>';
        document.execCommand('insertHTML', false, html);
      }
    });
  }

  // Theme toggle
  const themeToggle = document.querySelector('.theme-toggle');
  if (themeToggle) {
    themeToggle.addEventListener('click', function() {
      document.body.classList.toggle('dark-theme');
      document.body.classList.toggle('light-theme');
      const isDark = document.body.classList.contains('dark-theme');
      themeToggle.querySelector('span').textContent = isDark ? '🌙' : '☀️';
      localStorage.setItem('theme', isDark ? 'dark' : 'light');
    });
  }

  // Load theme
  const savedTheme = localStorage.getItem('theme') || 'dark';
  if (savedTheme === 'dark') {
    document.body.classList.add('dark-theme');
    document.body.classList.remove('light-theme');
  } else {
    document.body.classList.add('light-theme');
    document.body.classList.remove('dark-theme');
  }

  // Update button states
  function updateButtonStates() {
    const commands = ['bold', 'italic', 'underline', 'strikethrough'];
    commands.forEach(cmd => {
      let btnId = cmd + 'Btn';
      if (cmd === 'strikethrough') btnId = 'strikeBtn';
      const btn = document.getElementById(btnId);
      if (btn) {
        if (document.queryCommandState(cmd)) {
          btn.classList.add('active');
        } else {
          btn.classList.remove('active');
        }
      }
    });
  }

  // Update on selection change
  document.addEventListener('selectionchange', updateButtonStates);

  // Word count
  function updateWordCount() {
    const text = editor.textContent || '';
    const words = text.trim().split(/\s+/).filter(w => w.length > 0);
    const wordCount = text.trim() === '' ? 0 : words.length;
    const charCount = text.length;
    
    const wordEl = document.querySelector('#wordCount span');
    const charEl = document.querySelector('#charCount span');
    if (wordEl) wordEl.textContent = wordCount + ' words';
    if (charEl) charEl.textContent = charCount + ' characters';
  }

  if (editor) {
    editor.addEventListener('input', updateWordCount);
    updateWordCount();
  }

  // Zoom controls
  const zoomSlider = document.getElementById('zoomSlider');
  const zoomValue = document.getElementById('zoomValue');
  const pageWrapper = document.querySelector('.page-wrapper');
  
  if (zoomSlider && pageWrapper) {
    zoomSlider.addEventListener('input', function(e) {
      const zoom = e.target.value;
      pageWrapper.style.transform = `scale(${zoom / 100})`;
      pageWrapper.style.transformOrigin = 'top center';
      if (zoomValue) zoomValue.textContent = zoom + '%';
    });
  }

  // Share button
  const shareBtn = document.querySelector('.share-button');
  if (shareBtn) {
    shareBtn.addEventListener('click', function() {
      const text = editor.textContent;
      if (navigator.share) {
        navigator.share({ title: 'Document', text: text });
      } else {
        navigator.clipboard.writeText(text);
        alert('Copied to clipboard!');
      }
    });
  }

  // Save function
  window.saveDocument = function() {
    const content = editor.innerHTML;
    const blob = new Blob([content], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'document.html';
    a.click();
    URL.revokeObjectURL(url);
  };

  // Export functions
  window.app = {
    newDocument: function() {
      if (confirm('Create new document? Any unsaved changes will be lost.')) {
        editor.innerHTML = '<p>Start typing...</p>';
        document.querySelector('.document-title').value = 'Document1';
        updateWordCount();
      }
    },
    showOpenDialog: function() {
      const input = document.createElement('input');
      input.type = 'file';
      input.accept = '.html,.txt';
      input.onchange = function(e) {
        const file = e.target.files[0];
        if (file) {
          const reader = new FileReader();
          reader.onload = function(e) {
            editor.innerHTML = e.target.result;
            document.querySelector('.document-title').value = file.name.replace(/\.[^/.]+$/, '');
            updateWordCount();
          };
          reader.readAsText(file);
        }
      };
      input.click();
    },
    toggleTheme: function() {
      themeToggle.click();
    },
    exportHTML: function() {
      const title = document.querySelector('.document-title').value;
      const content = editor.innerHTML;
      const html = `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>${title}</title>
  <style>
    body { font-family: Georgia, serif; max-width: 800px; margin: 40px auto; padding: 20px; }
  </style>
</head>
<body>
  ${content}
</body>
</html>`;
      const blob = new Blob([html], { type: 'text/html' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${title}.html`;
      a.click();
      URL.revokeObjectURL(url);
    },
    exportTXT: function() {
      const title = document.querySelector('.document-title').value;
      const text = editor.textContent;
      const blob = new Blob([text], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${title}.txt`;
      a.click();
      URL.revokeObjectURL(url);
    }
  };
});

// Menu bar functionality
function initializeMenuBar() {
  const menuItems = document.querySelectorAll('.menu-item');
  
  menuItems.forEach(item => {
    item.addEventListener('click', function(e) {
      e.stopPropagation();
      
      // Close other menus
      menuItems.forEach(other => {
        if (other !== item) {
          other.classList.remove('active');
        }
      });
      
      // Toggle this menu
      item.classList.toggle('active');
    });
  });
  
  // Close menus when clicking elsewhere
  document.addEventListener('click', function() {
    menuItems.forEach(item => {
      item.classList.remove('active');
    });
  });
  
  // Prevent menu options from closing menu
  const menuOptions = document.querySelectorAll('.menu-option');
  menuOptions.forEach(option => {
    option.addEventListener('click', function(e) {
      e.stopPropagation();
      // Close menu after selection
      menuItems.forEach(item => {
        item.classList.remove('active');
      });
    });
  });
}

// Zoom functions for menu
window.zoomIn = function() {
  const slider = document.getElementById('zoomSlider');
  if (slider) {
    slider.value = Math.min(500, parseInt(slider.value) + 10);
    slider.dispatchEvent(new Event('input'));
  }
};

window.zoomOut = function() {
  const slider = document.getElementById('zoomSlider');
  if (slider) {
    slider.value = Math.max(10, parseInt(slider.value) - 10);
    slider.dispatchEvent(new Event('input'));
  }
};

window.zoomReset = function() {
  const slider = document.getElementById('zoomSlider');
  if (slider) {
    slider.value = 100;
    slider.dispatchEvent(new Event('input'));
  }
};

window.toggleFullscreen = function() {
  if (!document.fullscreenElement) {
    document.documentElement.requestFullscreen();
  } else {
    document.exitFullscreen();
  }
};