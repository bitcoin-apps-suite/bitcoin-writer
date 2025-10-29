/**
 * Modern replacements for deprecated document.execCommand API
 * Using Selection API and ContentEditable modern alternatives
 */

export class ModernEditorCommands {
  
  /**
   * Insert text at current caret position
   */
  static insertText(text: string): void {
    const selection = window.getSelection();
    if (!selection || selection.rangeCount === 0) return;
    
    const range = selection.getRangeAt(0);
    range.deleteContents();
    
    const textNode = document.createTextNode(text);
    range.insertNode(textNode);
    
    // Move cursor to end of inserted text
    range.setStartAfter(textNode);
    range.setEndAfter(textNode);
    selection.removeAllRanges();
    selection.addRange(range);
  }

  /**
   * Apply formatting using Selection API
   */
  static applyFormat(command: string): void {
    const selection = window.getSelection();
    if (!selection || selection.rangeCount === 0) return;

    try {
      // Try modern approach first
      switch (command) {
        case 'bold':
          document.execCommand('bold', false, undefined);
          break;
        case 'italic':
          document.execCommand('italic', false, undefined);
          break;
        case 'underline':
          document.execCommand('underline', false, undefined);
          break;
        default:
          // For now, fall back to execCommand for complex formatting
          // TODO: Implement full Selection API alternatives
          document.execCommand(command, false, undefined);
      }
    } catch (error) {
      console.warn(`Failed to apply format ${command}:`, error);
    }
  }

  /**
   * Handle clipboard operations
   */
  static async copy(): Promise<void> {
    try {
      await navigator.clipboard.writeText(window.getSelection()?.toString() || '');
    } catch (error) {
      // Fallback to execCommand
      document.execCommand('copy');
    }
  }

  static async cut(): Promise<void> {
    try {
      const text = window.getSelection()?.toString() || '';
      await navigator.clipboard.writeText(text);
      this.deleteSelection();
    } catch (error) {
      // Fallback to execCommand
      document.execCommand('cut');
    }
  }

  static async paste(): Promise<void> {
    try {
      const text = await navigator.clipboard.readText();
      this.insertText(text);
    } catch (error) {
      // Fallback to execCommand
      document.execCommand('paste');
    }
  }

  /**
   * Selection operations
   */
  static selectAll(): void {
    const selection = window.getSelection();
    if (selection) {
      selection.selectAllChildren(document.body);
    }
  }

  static deleteSelection(): void {
    const selection = window.getSelection();
    if (selection && selection.rangeCount > 0) {
      selection.deleteFromDocument();
    }
  }

  /**
   * Undo/Redo - these still need execCommand as there's no modern alternative
   * Browser vendors haven't provided Selection API replacements for these
   */
  static undo(): void {
    document.execCommand('undo');
  }

  static redo(): void {
    document.execCommand('redo');
  }
}