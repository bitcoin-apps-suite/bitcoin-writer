# Accessibility Notes

This document summarizes baseline accessibility support for Bitcoin Writer.

## Current Improvements

- Added a global "Skip to main content" link (`#main-content`).
- Switched the main page content wrapper to a semantic `<main>` landmark.
- Added global `:focus-visible` styles for keyboard navigation.
- Added keyboard escape behavior to close Taskbar menus (`Esc`).
- Added ARIA metadata to Taskbar toggles and icon-only navigation links.
- Added ARIA metadata to the market ticker toggle and live update region.
- Added ARIA labels and current-page metadata for dock app buttons.

## Keyboard Behavior

- `Tab`/`Shift+Tab`: navigate controls.
- `Enter`/`Space`: activate buttons and links.
- `Esc`: close open taskbar menus and mobile menu overlay.

## Manual QA Checklist

- [ ] Skip link is visible when tabbing from the top of the page.
- [ ] Focus ring is visible on links, buttons, and form controls.
- [ ] Taskbar menus open/close with keyboard and close on `Esc`.
- [ ] Icon-only links have descriptive screen-reader names.
- [ ] Ticker updates are announced politely (without interrupting reading).
- [ ] Main flows are usable on mobile and desktop with keyboard only.
