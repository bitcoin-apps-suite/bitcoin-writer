/**
 * Bitcoin Writer - Standalone Editor
 * Copyright (C) 2025 The Bitcoin Corporation LTD
 */

'use client';

export default function EditorPage() {
  return (
    <div style={{ width: '100vw', height: '100vh', margin: 0, padding: 0 }}>
      <iframe 
        src="/editor-standalone.html"
        style={{ 
          width: '100%', 
          height: '100%', 
          border: 'none',
          margin: 0,
          padding: 0
        }}
        title="Bitcoin Writer Editor"
      />
    </div>
  );
}