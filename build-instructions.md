# Building Screen Writer as an Electron App

## Prerequisites

Make sure you have Node.js installed on your system (version 14 or higher).

## Setup Instructions

### 1. Install Dependencies

```bash
npm install
```

### 2. Run the App in Development Mode

```bash
npm start
```

### 3. Build the App for Distribution

#### For macOS:
```bash
npm run build-mac
```

#### For Windows:
```bash
npm run build-win
```

#### For Linux:
```bash
npm run build-linux
```

#### For all platforms:
```bash
npm run build
```

## File Format Support

The app saves files in open, standard formats:

- **Text Files (.txt)** - Plain text format, readable by any text editor
- **Markdown Files (.md)** - Markdown format, compatible with most word processors and note-taking apps
- **All Files (*)** - Any file extension you choose

## Features

✅ **Native Desktop App** - Runs as a standalone application
✅ **Open File Formats** - Saves in .txt and .md formats for maximum compatibility
✅ **Native File Dialogs** - Uses your system's file open/save dialogs
✅ **Menu Integration** - Full application menu with keyboard shortcuts
✅ **Auto-save** - Automatically saves your work
✅ **Cross-platform** - Works on Windows, macOS, and Linux

## Keyboard Shortcuts

- **Ctrl/Cmd + N**: New document
- **Ctrl/Cmd + O**: Open file
- **Ctrl/Cmd + S**: Save file
- **Ctrl/Cmd + Shift + S**: Save As
- **Ctrl/Cmd + Q**: Quit (macOS: Cmd+Q, Windows/Linux: Ctrl+Q)

## Installation

After building, the app will be available in the `dist` folder. You can:

1. **macOS**: Double-click the `.dmg` file and drag to Applications
2. **Windows**: Run the `.exe` installer
3. **Linux**: Install the `.AppImage` or `.deb` package

The app will appear in your applications list and can be pinned to your taskbar/dock for quick access. 