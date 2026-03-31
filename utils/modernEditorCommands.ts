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
   * Wrap selected text in a given HTML tag
   */
  private static wrapSelection(tagName: string): void {
    const selection = window.getSelection();
    if (!selection || selection.rangeCount === 0 || selection.isCollapsed) return;

    const range = selection.getRangeAt(0);

    // Check if already wrapped in this tag — if so, unwrap
    const parentEl = range.commonAncestorContainer.parentElement;
    if (parentEl && parentEl.tagName.toLowerCase() === tagName.toLowerCase()) {
      // Unwrap: replace the element with its text content
      const text = document.createTextNode(parentEl.textContent || '');
      parentEl.replaceWith(text);

      const newRange = document.createRange();
      newRange.selectNodeContents(text);
      selection.removeAllRanges();
      selection.addRange(newRange);
      return;
    }

    // Wrap selection in the tag
    const wrapper = document.createElement(tagName);
    try {
      range.surroundContents(wrapper);
    } catch {
      // surroundContents fails on partial node selections — fall back to extracting
      const fragment = range.extractContents();
      wrapper.appendChild(fragment);
      range.insertNode(wrapper);
    }

    const newRange = document.createRange();
    newRange.selectNodeContents(wrapper);
    selection.removeAllRanges();
    selection.addRange(newRange);
  }

  /**
   * Apply formatting using modern Selection API where possible
   */
  static applyFormat(command: string): void {
    const selection = window.getSelection();
    if (!selection || selection.rangeCount === 0) return;

    try {
      switch (command) {
        case 'bold':
          this.wrapSelection('strong');
          break;
        case 'italic':
          this.wrapSelection('em');
          break;
        case 'underline':
          this.wrapSelection('u');
          break;
        case 'strikethrough':
        case 'strikeThrough':
          this.wrapSelection('s');
          break;
        case 'subscript':
          this.wrapSelection('sub');
          break;
        case 'superscript':
          this.wrapSelection('sup');
          break;
        case 'insertUnorderedList':
          this.wrapSelection('ul');
          break;
        case 'insertOrderedList':
          this.wrapSelection('ol');
          break;
        default:
          // For less common commands, execCommand is still the best option
          // (browsers haven't provided modern replacements for all commands)
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
    } catch {
      document.execCommand('copy');
    }
  }

  static async cut(): Promise<void> {
    try {
      const text = window.getSelection()?.toString() || '';
      await navigator.clipboard.writeText(text);
      this.deleteSelection();
    } catch {
      document.execCommand('cut');
    }
  }

  static async paste(): Promise<void> {
    try {
      const text = await navigator.clipboard.readText();
      this.insertText(text);
    } catch {
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
