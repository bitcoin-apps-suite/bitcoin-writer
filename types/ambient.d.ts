/**
 * Ambient declarations for things the compiler cannot discover on its own.
 *
 * ⚠ EACH ENTRY HERE IS A STATEMENT ABOUT THE WORLD, so each one says what it is asserting
 * and why that assertion is safe. A declaration file is the one place where a wrong guess
 * silences the compiler permanently, so nothing is declared here that could be typed
 * properly somewhere else instead.
 */

/**
 * CSS imported for its side effect.
 *
 * `QuillEditorDirect` does `await import('quill/dist/quill.snow.css')` to pull in the
 * editor's stylesheet. Next handles the import at build time; TypeScript has no idea what a
 * `.css` module is and reports TS2307. The module has no runtime export worth naming, so
 * this declares exactly that and nothing more.
 */
declare module '*.css';

/**
 * `@babbage/sdk` ships JavaScript with no bundled types.
 *
 * ⚠ THE FUNCTIONS ARE DECLARED INDIVIDUALLY RATHER THAN THE MODULE BEING BLANKET-`any`.
 * `declare module '@babbage/sdk';` would have silenced TS7016 in one line and also erased
 * every call signature in `lib/metanet-integration.ts` — including `encrypt` and `decrypt`,
 * where an argument in the wrong position is not a type error you find later, it is
 * ciphertext nobody can read. Naming the four functions the code actually imports keeps the
 * arity checked; the argument types are `unknown`-ish because the SDK's real shapes are not
 * knowable from here, and pretending otherwise would be the same mistake in a different
 * place.
 */
declare module '@babbage/sdk' {
    export function createAction(args: Record<string, unknown>): Promise<Record<string, unknown>>;
    export function encrypt(args: Record<string, unknown>): Promise<string | Uint8Array>;
    export function decrypt(args: Record<string, unknown>): Promise<string | Uint8Array>;
    export function getPublicKey(args: Record<string, unknown>): Promise<string>;
}

/**
 * The editor iframe publishes a small command surface on its own `window`.
 *
 * `CleanTaskbar` reaches into `iframe.contentWindow.app` to drive the editor loaded inside
 * it — File ▸ Open and friends. That object is defined by `public/editor-standalone.html`,
 * not by anything the compiler can see, so it has to be declared.
 *
 * ⚠ EVERY MEMBER IS OPTIONAL, AND THE CALL SITES ALREADY CHECK. The taskbar guards with
 * `if (iframe.contentWindow.app && iframe.contentWindow.app.showOpenDialog)` before calling,
 * which is correct: an iframe on a different page, or one that has not finished loading,
 * has no `app` at all. Declaring these as required would delete exactly the guard that
 * makes the code safe.
 */
interface EditorIframeApi {
    showOpenDialog?: () => void;
    showSaveDialog?: () => void;
    newDocument?: () => void;
    print?: () => void;
}

interface Window {
    app?: EditorIframeApi;
}
