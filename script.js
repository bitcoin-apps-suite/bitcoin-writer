class ScreenWriter {
    constructor() {
        this.editor = document.getElementById('editor');
        this.wordCount = document.getElementById('word-count');
        this.charCount = document.getElementById('char-count');
        this.cursorPosition = document.getElementById('cursor-position');
        this.fileName = document.getElementById('file-name');
        this.autoSaveStatus = document.getElementById('auto-save-status');
        this.fileInput = document.getElementById('file-input');
        this.imageInput = document.getElementById('image-input');
        this.currentFilePath = null;
        this.isFullscreen = false;
        this.isElectron = typeof window.electronAPI !== 'undefined';
        this.writingFolderPath = null;
        
        this.initializeEventListeners();
        this.updateCounts();
        this.updateCursorPosition();
        this.focusEditor();
        
        if (this.isElectron) {
            this.initializeElectronEvents();
        }
    }
    
    initializeEventListeners() {
        // Editor events
        this.editor.addEventListener('input', () => this.updateCounts());
        this.editor.addEventListener('keyup', () => this.updateCursorPosition());
        this.editor.addEventListener('click', () => this.updateCursorPosition());
        this.editor.addEventListener('paste', (e) => this.handlePaste(e));

        // Drag and drop events - Editor level
        this.editor.addEventListener('dragenter', (e) => this.handleDragEnter(e));
        this.editor.addEventListener('dragover', (e) => this.handleDragOver(e));
        this.editor.addEventListener('dragleave', (e) => this.handleDragLeave(e));
        this.editor.addEventListener('drop', (e) => this.handleDrop(e));

        // Prevent default browser behavior for drag events on the entire document
        document.addEventListener('dragenter', (e) => {
            e.preventDefault();
            e.stopPropagation();
        });
        document.addEventListener('dragover', (e) => {
            e.preventDefault();
            e.stopPropagation();
        });
        document.addEventListener('dragleave', (e) => {
            e.preventDefault();
            e.stopPropagation();
            // If dragging leaves the window entirely, remove drag feedback
            this.editor.classList.remove('drag-over');
        });
        document.addEventListener('drop', (e) => {
            e.preventDefault();
            e.stopPropagation();

            // If the drop happened outside the editor and contains files, show a message
            if (e.dataTransfer.types.includes('Files')) {
                const rect = this.editor.getBoundingClientRect();
                const x = e.clientX;
                const y = e.clientY;

                if (!(x >= rect.left && x <= rect.right && y >= rect.top && y <= rect.bottom)) {
                    this.showNotification('Please drop images directly into the writing area', 'error');
                }
            }
        });

        // Handle window-level drag leave to ensure cleanup
        window.addEventListener('dragend', () => {
            this.editor.classList.remove('drag-over');
        });
        
        // Button events
        document.getElementById('new-doc').addEventListener('click', () => this.newDocument());
        document.getElementById('open-file').addEventListener('click', () => this.openFile());
        document.getElementById('save-file').addEventListener('click', () => this.saveFile());
        document.getElementById('insert-image').addEventListener('click', () => this.insertImage());
        document.getElementById('quit-app').addEventListener('click', () => this.quitApp());
        document.getElementById('fullscreen-toggle').addEventListener('click', () => this.toggleFullscreen());

        // File input events (for web version)
        this.fileInput.addEventListener('change', (e) => this.handleFileSelect(e));
        this.imageInput.addEventListener('change', (e) => this.handleImageSelect(e));
        
        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => this.handleKeyboardShortcuts(e));
        
        // Auto-save
        setInterval(() => this.autoSave(), 30000); // Auto-save every 30 seconds
        
        // Focus management
        this.editor.addEventListener('blur', () => this.handleEditorBlur());
        this.editor.addEventListener('focus', () => this.handleEditorFocus());
    }
    
    initializeElectronEvents() {
        // Listen for Electron events
        window.electronAPI.onNewDocument(() => this.newDocument());
        window.electronAPI.onFileOpened((event, data) => this.handleFileOpened(data));
        window.electronAPI.onSaveRequested(() => this.saveFile());
        window.electronAPI.onSaveAsRequested(() => this.saveFileAs());
        window.electronAPI.onImageInserted((event, data) => this.handleImageInserted(data));

        // Get current file path and writing folder on startup
        window.electronAPI.getCurrentFilePath().then(filePath => {
            if (filePath) {
                this.currentFilePath = filePath;
                this.fileName.textContent = this.getFileNameFromPath(filePath);
            }
        });

        // Get writing folder path
        window.electronAPI.getWritingFolderPath().then(folderPath => {
            this.writingFolderPath = folderPath;
            if (folderPath) {
                const folderName = folderPath.split('/').pop();
                this.autoSaveStatus.textContent = `📁 Auto-saving to ~/${folderName}`;
                this.autoSaveStatus.style.color = '#666';
                // Clear the status after 5 seconds
                setTimeout(() => {
                    this.autoSaveStatus.textContent = '';
                }, 5000);
            }
        });
    }
    
    focusEditor() {
        this.editor.focus();
        // Move cursor to end if content is just "Start writing..."
        if (this.editor.textContent.trim() === 'Start writing...') {
            this.editor.innerHTML = '<p><br></p>';
            this.setCursorToEnd();
        }
    }
    
    setCursorToEnd() {
        const range = document.createRange();
        const selection = window.getSelection();
        range.selectNodeContents(this.editor);
        range.collapse(false);
        selection.removeAllRanges();
        selection.addRange(range);
    }
    
    updateCounts() {
        const text = this.editor.textContent || '';

        // Don't count the placeholder text
        const isPlaceholder = text.trim() === 'Start writing...';
        if (isPlaceholder) {
            this.wordCount.textContent = '0 words';
            this.charCount.textContent = '0 characters';
            return;
        }

        const words = text.trim() ? text.trim().split(/\s+/).length : 0;
        const chars = text.length;

        this.wordCount.textContent = `${words} word${words !== 1 ? 's' : ''}`;
        this.charCount.textContent = `${chars} character${chars !== 1 ? 's' : ''}`;
    }
    
    updateCursorPosition() {
        const selection = window.getSelection();
        if (selection.rangeCount > 0) {
            const range = selection.getRangeAt(0);
            const preCaretRange = range.cloneRange();
            preCaretRange.selectNodeContents(this.editor);
            preCaretRange.setEnd(range.endContainer, range.endOffset);
            
            const text = preCaretRange.toString();
            const lines = text.split('\n');
            const line = lines.length;
            const column = lines[lines.length - 1].length + 1;
            
            this.cursorPosition.textContent = `Line ${line}, Column ${column}`;
        }
    }
    
    handlePaste(e) {
        e.preventDefault();
        const text = e.clipboardData.getData('text/plain');
        document.execCommand('insertText', false, text);
    }
    
    newDocument() {
        if (this.hasUnsavedChanges()) {
            if (confirm('You have unsaved changes. Are you sure you want to create a new document?')) {
                this.clearEditor();
            }
        } else {
            this.clearEditor();
        }
    }
    
    clearEditor() {
        this.editor.innerHTML = '<p><br></p>';
        this.currentFilePath = null;
        this.fileName.textContent = 'Untitled';
        if (this.isElectron) {
            window.electronAPI.setCurrentFilePath(null);
        }
        this.focusEditor();
        this.updateCounts();
    }
    
    openFile() {
        if (this.isElectron) {
            // Electron will handle file opening through the menu
            return;
        }
        this.fileInput.click();
    }
    
    handleFileSelect(e) {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (event) => {
                this.editor.textContent = event.target.result;
                this.fileName.textContent = file.name;
                this.updateCounts();
                this.focusEditor();
            };
            reader.readAsText(file);
        }
    }

    insertImage() {
        if (this.isElectron) {
            window.electronAPI.insertImage();
            return;
        }
        this.imageInput.click();
    }

    handleImageSelect(e) {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (event) => {
                this.insertImageIntoEditor(event.target.result, file.name);
            };
            reader.readAsDataURL(file);
        }
    }

    insertImageIntoEditor(imageSrc, fileName) {
        const img = document.createElement('img');
        img.src = imageSrc;
        img.alt = fileName;
        img.style.maxWidth = '100%';
        img.style.height = 'auto';
        img.style.margin = '10px 0';
        img.style.borderRadius = '4px';

        // Get current selection
        const selection = window.getSelection();
        const range = selection.getRangeAt(0);

        // Insert the image
        range.insertNode(img);

        // Move cursor after the image
        range.setStartAfter(img);
        range.setEndAfter(img);
        selection.removeAllRanges();
        selection.addRange(range);

        // Update counts and focus
        this.updateCounts();
        this.focusEditor();
    }

    handleDragEnter(e) {
        e.preventDefault();
        e.stopPropagation();

        // Only show drag feedback for files, not other content
        if (e.dataTransfer.types.includes('Files')) {
            e.dataTransfer.dropEffect = 'copy';
            this.editor.classList.add('drag-over');
        }
    }

    handleDragOver(e) {
        e.preventDefault();
        e.stopPropagation();

        // Only show drag feedback for files, not other content
        if (e.dataTransfer.types.includes('Files')) {
            e.dataTransfer.dropEffect = 'copy';
            this.editor.classList.add('drag-over');
        } else {
            this.editor.classList.remove('drag-over');
        }
    }

    handleDragLeave(e) {
        e.preventDefault();
        e.stopPropagation();

        // Only remove the class if we're actually leaving the editor area
        const rect = this.editor.getBoundingClientRect();
        const x = e.clientX;
        const y = e.clientY;

        // Check if we're leaving the editor bounds or if the drag has left the window
        if (x < rect.left || x > rect.right || y < rect.top || y > rect.bottom ||
            x === 0 || y === 0 || x >= window.innerWidth || y >= window.innerHeight) {
            this.editor.classList.remove('drag-over');
        }
    }

    handleDrop(e) {
        e.preventDefault();
        e.stopPropagation();
        this.editor.classList.remove('drag-over');

        const files = e.dataTransfer.files;
        if (files.length > 0) {
            // Check if we're dropping over the editor area
            const rect = this.editor.getBoundingClientRect();
            const x = e.clientX;
            const y = e.clientY;

            if (x >= rect.left && x <= rect.right && y >= rect.top && y <= rect.bottom) {
                this.processDroppedFiles(files);
            }
        }
    }

    processDroppedFiles(files) {
        const imageFiles = Array.from(files).filter(file => {
            return file.type.startsWith('image/');
        });

        if (imageFiles.length === 0) {
            this.showNotification('No image files found in dropped items', 'error');
            return;
        }

        // Process each image file
        imageFiles.forEach((file, index) => {
            const reader = new FileReader();
            reader.onload = (event) => {
                // Add a small delay between images for better UX
                setTimeout(() => {
                    this.insertImageIntoEditor(event.target.result, file.name);
                    if (index === imageFiles.length - 1) {
                        // Removed notification for image insertion
                    }
                }, index * 100);
            };
            reader.readAsDataURL(file);
        });
    }
    
    handleFileOpened(data) {
        // Check if content contains HTML
        if (data.content.includes('<img') || data.content.includes('<p>') || data.content.includes('<div>')) {
            this.editor.innerHTML = data.content;
        } else {
            this.editor.textContent = data.content;
        }
        this.currentFilePath = data.filePath;
        this.fileName.textContent = data.fileName;
        this.updateCounts();
        this.focusEditor();
    }

    handleImageInserted(data) {
        this.insertImageIntoEditor(data.imageSrc, data.fileName);
    }
    
    async saveFile() {
        const content = this.getEditorHTML();
        
        if (this.isElectron) {
            try {
                const result = await window.electronAPI.saveFile(content);
                if (result.success) {
                    this.currentFilePath = result.filePath;
                    this.fileName.textContent = this.getFileNameFromPath(result.filePath);
                    this.showNotification('File saved successfully');
                } else {
                    this.showNotification('Error saving file: ' + result.error, 'error');
                }
            } catch (error) {
                this.showNotification('Error saving file: ' + error.message, 'error');
            }
        } else {
            // Web version - fallback to download
            const isHTML = content.includes('<img') || content.includes('<p>') || content.includes('<div>');
            const mimeType = isHTML ? 'text/html' : 'text/plain';
            const defaultName = isHTML ? 'document.html' : 'document.txt';

            const blob = new Blob([content], { type: mimeType });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = this.fileName.textContent !== 'Untitled' ? this.fileName.textContent : defaultName;
            a.click();
            URL.revokeObjectURL(url);
        }
    }
    
    async saveFileAs() {
        const content = this.getEditorHTML();
        
        if (this.isElectron) {
            try {
                const result = await window.electronAPI.saveFileAs(content);
                if (result.success) {
                    this.currentFilePath = result.filePath;
                    this.fileName.textContent = result.fileName;
                    this.showNotification('File saved successfully');
                } else {
                    this.showNotification('Error saving file: ' + result.error, 'error');
                }
            } catch (error) {
                this.showNotification('Error saving file: ' + error.message, 'error');
            }
        } else {
            // Web version - same as saveFile
            this.saveFile();
        }
    }
    
    toggleFullscreen() {
        const appContainer = document.querySelector('.app-container');

        if (!this.isFullscreen) {
            appContainer.classList.add('fullscreen');
            this.isFullscreen = true;
            document.getElementById('fullscreen-toggle').textContent = '⛶';
        } else {
            appContainer.classList.remove('fullscreen');
            this.isFullscreen = false;
            document.getElementById('fullscreen-toggle').textContent = '⛶';
        }

        this.focusEditor();
    }

    quitApp() {
        this.doQuit();
    }

    doQuit() {
        if (this.isElectron) {
            // Use Electron's quit API
            window.electronAPI.quitApp();
        } else {
            // For web version, just close the window
            window.close();
        }
    }
    
    handleKeyboardShortcuts(e) {
        // Handle quit shortcut regardless of focus
        if ((e.ctrlKey || e.metaKey) && e.key === 'q') {
            e.preventDefault();
            this.quitApp();
            return;
        }

        // Only handle other shortcuts when editor is focused
        if (document.activeElement !== this.editor) return;
        
        // Ctrl/Cmd + S: Save
        if ((e.ctrlKey || e.metaKey) && e.key === 's') {
            e.preventDefault();
            this.saveFile();
        }
        
        // Ctrl/Cmd + N: New document
        if ((e.ctrlKey || e.metaKey) && e.key === 'n') {
            e.preventDefault();
            this.newDocument();
        }
        
        // Ctrl/Cmd + O: Open file
        if ((e.ctrlKey || e.metaKey) && e.key === 'o') {
            e.preventDefault();
            this.openFile();
        }
        
        // Ctrl/Cmd + Shift + S: Save As
        if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'S') {
            e.preventDefault();
            this.saveFileAs();
        }
        
        // F11: Toggle fullscreen
        if (e.key === 'F11') {
            e.preventDefault();
            this.toggleFullscreen();
        }
        
        // Tab: Insert tab character
        if (e.key === 'Tab') {
            e.preventDefault();
            document.execCommand('insertText', false, '    ');
        }
    }
    
    hasUnsavedChanges() {
        // Simple check - could be enhanced with more sophisticated change tracking
        return this.editor.textContent.trim() !== '' && 
               this.editor.textContent.trim() !== 'Start writing...';
    }
    
    autoSave() {
        if (this.hasUnsavedChanges() && this.isElectron && this.writingFolderPath) {
            // Show saving indicator
            this.autoSaveStatus.textContent = '💾 Saving...';
            this.autoSaveStatus.style.color = '#888';

            const content = this.getEditorHTML();
            const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, -5);
            const filename = `autosave-${timestamp}.html`;

            window.electronAPI.saveToWritingFolder(content, filename).then(result => {
                if (result.success) {
                    console.log('Auto-saved to:', result.filePath);
                    // Show success indicator briefly
                    this.autoSaveStatus.textContent = '✓ Saved';
                    this.autoSaveStatus.style.color = '#4CAF50';
                    setTimeout(() => {
                        this.autoSaveStatus.textContent = '';
                    }, 2000);
                } else {
                    console.error('Auto-save failed:', result.error);
                    this.autoSaveStatus.textContent = '❌ Save failed';
                    this.autoSaveStatus.style.color = '#f44336';
                    setTimeout(() => {
                        this.autoSaveStatus.textContent = '';
                    }, 3000);
                }
            }).catch(error => {
                console.error('Auto-save error:', error);
                this.autoSaveStatus.textContent = '❌ Save failed';
                this.autoSaveStatus.style.color = '#f44336';
                setTimeout(() => {
                    this.autoSaveStatus.textContent = '';
                }, 3000);
            });
        }
    }
    
    loadAutoSave() {
        const savedContent = localStorage.getItem('screenWriter_autosave');
        const timestamp = localStorage.getItem('screenWriter_autosave_timestamp');
        
        if (savedContent && timestamp) {
            const age = Date.now() - parseInt(timestamp);
            const maxAge = 24 * 60 * 60 * 1000; // 24 hours
            
            if (age < maxAge) {
                if (confirm('Found auto-saved content. Would you like to restore it?')) {
                    this.editor.textContent = savedContent;
                    this.updateCounts();
                    this.focusEditor();
                } else {
                    localStorage.removeItem('screenWriter_autosave');
                    localStorage.removeItem('screenWriter_autosave_timestamp');
                }
            } else {
                localStorage.removeItem('screenWriter_autosave');
                localStorage.removeItem('screenWriter_autosave_timestamp');
            }
        }
    }
    
    handleEditorBlur() {
        this.autoSave();
    }
    
    handleEditorFocus() {
        // Remove placeholder text when focusing
        if (this.editor.textContent.trim() === 'Start writing...') {
            this.editor.innerHTML = '<p><br></p>';
            this.setCursorToEnd();
        }
    }
    
    getFileNameFromPath(filePath) {
        return filePath.split(/[\\/]/).pop();
    }

    getEditorHTML() {
        // Get the HTML content including images
        return this.editor.innerHTML;
    }
    
    showNotification(message, type = 'success') {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.textContent = message;
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background-color: ${type === 'error' ? '#ff4444' : '#44ff44'};
            color: white;
            padding: 12px 20px;
            border-radius: 6px;
            z-index: 10000;
            font-size: 14px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.3);
            transition: opacity 0.3s ease;
        `;
        
        document.body.appendChild(notification);
        
        // Remove after 3 seconds
        setTimeout(() => {
            notification.style.opacity = '0';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        }, 3000);
    }
}

// Initialize the app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    const app = new ScreenWriter();
    
    // Load auto-saved content if available
    setTimeout(() => app.loadAutoSave(), 100);
    
    // Handle beforeunload to warn about unsaved changes
    window.addEventListener('beforeunload', (e) => {
        if (app.hasUnsavedChanges()) {
            e.preventDefault();
            e.returnValue = '';
        }
    });
}); 