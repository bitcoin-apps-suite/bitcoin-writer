import React, { useState, useCallback } from 'react';
import './DragDropZone.css';

interface DragDropZoneProps {
  onFileDrop: (files: FileList) => void;
  isAuthenticated: boolean;
  onAuthRequired: () => void;
}

const DragDropZone: React.FC<DragDropZoneProps> = ({ 
  onFileDrop, 
  isAuthenticated,
  onAuthRequired 
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [dragCounter, setDragCounter] = useState(0);

  const handleDragEnter = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragCounter(prev => prev + 1);
    
    if (e.dataTransfer.items && e.dataTransfer.items.length > 0) {
      setIsDragging(true);
    }
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragCounter(prev => {
      const newCounter = prev - 1;
      if (newCounter === 0) {
        setIsDragging(false);
      }
      return newCounter;
    });
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    setDragCounter(0);

    if (!isAuthenticated) {
      onAuthRequired();
      return;
    }

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      onFileDrop(e.dataTransfer.files);
      e.dataTransfer.clearData();
    }
  }, [isAuthenticated, onAuthRequired, onFileDrop]);

  return (
    <>
      {/* Invisible full-screen drop detector */}
      <div
        className="drop-detector"
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
      />

      {/* Visible drop zone overlay */}
      {isDragging && (
        <div className="drop-zone-overlay">
          <div className="drop-zone-content">
            <div className="drop-icon">📦</div>
            <h2>Drop to Upload to Blockchain</h2>
            <p>Release to encrypt and store your files permanently on Bitcoin SV</p>
            <div className="drop-features">
              <span>🔒 Encrypted</span>
              <span>⛓️ Immutable</span>
              <span>🌍 Decentralized</span>
            </div>
          </div>
        </div>
      )}

      {/* Floating drop pad (always visible) */}
      <div 
        className="floating-drop-pad"
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        onClick={() => {
          if (!isAuthenticated) {
            onAuthRequired();
          } else {
            // Trigger file picker
            const input = document.createElement('input');
            input.type = 'file';
            input.multiple = true;
            input.onchange = (e) => {
              const target = e.target as HTMLInputElement;
              if (target.files) {
                onFileDrop(target.files);
              }
            };
            input.click();
          }
        }}
        title="Drag files here or click to upload to blockchain"
      >
        <div className="drop-pad-icon">⬆️</div>
        <div className="drop-pad-text">Drop files here</div>
      </div>
    </>
  );
};

export default DragDropZone;