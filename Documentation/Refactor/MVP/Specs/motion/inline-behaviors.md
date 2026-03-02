---
title: "Inline Behaviors"
date: 2026-03-02
type: spec
scope: mvp
status: active
---

# Inline Behaviors

> Complete specification of all JavaScript behaviors from the inline `<script>` block in design-reference.html (lines 7293--8349).

Cross-references: [[keyframes]] (CSS keyframes triggered by JS), [[animation-classes]] (CSS classes toggled by JS), [[motion]] (timing/easing tokens referenced in JS).

---

## Global Setup

The entire script is wrapped in an IIFE with `'use strict'` mode:

```js
(function () {
  'use strict';
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  // ... all behaviors ...
})();
```

The `prefersReduced` boolean is checked by multiple behaviors to skip or simplify animations.

---

## 1. Theme Toggle

**Trigger**: Click on `#theme-toggle` button, OS color scheme change.

**DOM targets**: `document.documentElement` (`<html>` element).

**Algorithm**:
1. Read saved theme from `localStorage.getItem('delightful-theme')`
2. Clean up legacy 3-state key (`delightful-theme-mode`) if present
3. Initialize: use saved theme if `'light'` or `'dark'`, otherwise defer to OS preference via `window.matchMedia('(prefers-color-scheme: dark)')`
4. Call `applyTheme(theme, persist)` which sets `data-theme` attribute on `<html>` and optionally writes to localStorage
5. On click: toggle between `'light'` and `'dark'`, optionally using `document.startViewTransition()` if available
6. On OS preference change: only apply if no explicit user preference stored

**Function signatures**:

```js
function applyTheme(theme, persist = false) {
  html.setAttribute('data-theme', theme);
  html.removeAttribute('data-theme-mode');
  if (persist) localStorage.setItem('delightful-theme', theme);
}
```

**Parameters**:
- localStorage key: `'delightful-theme'`
- Legacy key cleaned up: `'delightful-theme-mode'`
- `data-theme` attribute values: `'light'` | `'dark'`

**Animation approach**: Uses `document.startViewTransition()` (View Transitions API) if available for the theme switch. Falls back to instant attribute change.

**`prefers-reduced-motion` handling**: None directly. The View Transition API respects the browser's reduced-motion setting natively.

---

## 2. Toast System

**Trigger**: Called programmatically via `window.showToast(type, title, msg)`.

**DOM targets**: `#toast-container`, dynamically created `.toast` elements.

**Algorithm**:
1. Create a `<div class="toast">` with stripe, icon, content, close button, and progress bar
2. Append to `#toast-container`
3. On next frame: set `opacity: 1` and `transform: translateY(0)` via inline styles with transition
4. If `!prefersReduced`: apply `progress-shrink` animation to progress bar (5s linear)
5. After 5000ms: fade out with `opacity: 0` and `transform: translateX(80px)`, then remove after 300ms
6. Enforce max 3 visible toasts -- remove oldest if exceeded

**Function signature**:

```js
window.showToast = function (type, title, msg) { ... }
```

**Parameters**:
- `type`: `'success'` | `'error'` | `'warning'` | `'info'`
- `title`: String -- bold heading text
- `msg`: String -- description text
- `MAX_TOASTS`: `3` (hard-coded constant)
- Auto-dismiss duration: `5000ms`
- Exit transition: `300ms`

**Toast icons** (SVG per type):
- `success`: Checkmark circle
- `error`: X circle
- `warning`: Triangle with exclamation
- `info`: Info circle

**Toast colors** (per type):
- `success`: `var(--accent-green)`
- `error`: `var(--accent-danger)`
- `warning`: `var(--accent-gold)`
- `info`: `var(--accent-primary)`

**Animation approach**: CSS transitions for enter/exit (inline styles), CSS `animation` for progress bar (`progress-shrink 5s linear forwards`).

**`prefers-reduced-motion` handling**: Progress bar animation is skipped when `prefersReduced` is true. Enter/exit transitions still apply (the global CSS reduce override handles them).

---

## 3. Command Palette

**Trigger**: `Cmd+K` / `Ctrl+K` keyboard shortcut, or click on `#cmd-k-trigger` / `#open-cmdpal`.

**DOM targets**: `#cmd-palette-overlay`, `#cmd-palette-input`, `#cmd-palette-list`.

**Algorithm**:
1. On `Cmd+K`/`Ctrl+K`: toggle palette open/closed
2. On open: add `.active` class to overlay, clear input, render full section list, focus input
3. On input: filter sections by `label` or `id` (case-insensitive `includes()` match)
4. Render filtered results as `<li>` elements with colored dot, section name
5. Keyboard navigation:
   - `ArrowDown`: move active index down, scroll into view
   - `ArrowUp`: move active index up, scroll into view
   - `Enter`: navigate to active section
   - `Escape`: close palette
6. Mouse: `mouseenter` on items updates active index; `click` navigates
7. Navigation: `closeCmdPalette()` then either toggle theme, scroll to top, or `scrollIntoView({ behavior: 'smooth' })`
8. Click outside overlay closes palette

**ARIA pattern**: Combobox with listbox. Input has `role="combobox"`, `aria-expanded`, `aria-activedescendant`. List items have `role="option"`, `aria-selected`.

**Section data** (14 entries):

```js
const cmdSections = [
  { id: 'philosophy', label: 'Philosophy', color: 'var(--accent-primary)' },
  { id: 'color', label: 'Color System', color: 'var(--accent-primary)' },
  { id: 'typography', label: 'Typography', color: 'var(--accent-gold)' },
  { id: 'spacing', label: 'Spacing & Layout', color: 'var(--accent-cyan)' },
  { id: 'components', label: 'Components', color: 'var(--accent-green)' },
  { id: 'icons', label: 'Iconography', color: 'var(--accent-purple)' },
  { id: 'motion', label: 'Motion & Easing', color: 'var(--accent-danger)' },
  { id: 'micro', label: 'Micro-Interactions', color: 'var(--accent-primary)' },
  { id: 'loading', label: 'Loading & Transitions', color: 'var(--accent-gold)' },
  { id: 'overlays', label: 'Overlays & Feedback', color: 'var(--accent-cyan)' },
  { id: 'signature', label: 'Signature Effects', color: 'var(--accent-green)' },
  { id: 'compositions', label: 'Compositions', color: 'var(--accent-purple)' },
  { id: '_toggle-theme', label: 'Toggle Dark Mode', color: 'var(--accent-gold)', action: true },
  { id: '_back-to-top', label: 'Back to Top', color: 'var(--text-muted)', action: true },
];
```

**Function signatures**:

```js
function renderCmdList(filter) { ... }
function openCmdPalette() { ... }
function closeCmdPalette() { ... }
function navigateToSection(id) { ... }
```

**Animation approach**: CSS class toggle (`.active` on overlay), no JS-driven animation.

**`prefers-reduced-motion` handling**: None directly. Overlay transitions are CSS-based and subject to the global reduce override.

---

## 4. Data Table Sorting

**Trigger**: Click on sortable column header (calls `window.sortTable(tableId, colIndex)`).

**DOM targets**: Table identified by `tableId`, its `<tbody>` rows, `<th>` headers.

**Algorithm**:
1. Find the `<th>` at `colIndex`
2. Check if column is already ascending (`sorted-asc` class)
3. Remove all sort classes from all sortable headers
4. Add `sorted-desc` if was ascending, `sorted-asc` otherwise
5. Convert `<tbody>` rows to array
6. Sort by comparing `<td>` values at `colIndex`:
   - Use `data-sort` attribute if present, otherwise `textContent.trim()`
   - Attempt numeric parse (`parseFloat`); if both are numbers, sort numerically
   - Otherwise use `localeCompare()` for string sort
7. Re-append sorted rows to `<tbody>` (DOM reorder)

**Function signature**:

```js
window.sortTable = function (tableId, colIndex) { ... }
```

**Parameters**:
- `tableId`: String -- DOM id of the `<table>`
- `colIndex`: Number -- 0-based column index

**Animation approach**: None -- instant DOM reorder.

**`prefers-reduced-motion` handling**: N/A (no animation).

---

## 5. Row Selection

**Trigger**: Click on table rows / header checkbox.

**DOM targets**: Table rows (`<tr>`), checkboxes (`input[type="checkbox"]` or `.check-box`).

**Algorithm**:

### `toggleRow(rowElement)`:
1. Find `input[type="checkbox"]` or `.check-box` in the row
2. Toggle its checked state
3. Toggle `.selected` class on the row

### `toggleAllRows(headerElement, tableId)`:
1. Stop event propagation
2. Toggle header checkbox state
3. Find all `<tbody>` rows in the table
4. Set all row checkboxes and `.selected` classes to match header state

**Function signatures**:

```js
window.toggleRow = function (rowElement) { ... }
window.toggleAllRows = function (headerElement, tableId) { ... }
```

**Animation approach**: None -- instant class toggle.

**`prefers-reduced-motion` handling**: N/A (no animation).

---

## 6. Stepper Navigation

**Trigger**: Click on `#stepper-next`, `#stepper-prev`, `#stepper-reset` buttons.

**DOM targets**: `#stepper-track .stepper-step` elements, `.stepper-indicator` within each step.

**Algorithm**:
1. Track `stepperCurrent` index (0-based, initial value `1`)
2. `updateStepper()` iterates all steps:
   - Steps before `stepperCurrent`: add `.completed` class, replace indicator with SVG checkmark
   - Step at `stepperCurrent`: add `.active` class, show step number
   - Steps after: show step number only, no special class
3. Next button: increment `stepperCurrent` (max: `steps.length - 1`)
4. Prev button: decrement `stepperCurrent` (min: `0`)
5. Reset button: set `stepperCurrent = 0`

**Function signature**:

```js
function updateStepper() { ... }
```

**Checkmark SVG**: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round"><polyline points="20 6 9 17 4 12"/></svg>`

**Animation approach**: None from JS -- CSS transitions on `.stepper-indicator` and `.stepper-step` handle visual changes.

**`prefers-reduced-motion` handling**: N/A (CSS transitions subject to global reduce override).

---

## 7. Splash & Pop Particle Engine

**Trigger**: `mousedown` on any `.btn` or `.card` element.

**DOM targets**: Dynamically created `.splash-container`, `.splash-dot` (x6), `.splash-ripple` (x1) elements appended to the clicked target.

**Algorithm**:
1. Check `prefersReduced` -- if true, return immediately
2. Check if target (or closest `.btn`/`.card`) exists and is not disabled
3. Get target's bounding rect
4. Ensure target has `position: relative` (set if currently `static`)
5. Create `.splash-container` div
6. Calculate click position relative to target: `x = e.clientX - rect.left`, `y = e.clientY - rect.top`
7. Generate 6 particle dots:
   - Random size: `Math.random() * 6 + 4` (4--10px)
   - Position at click point
   - Calculate angle: `(Math.PI * 2 / 6) * i + Math.random() * 0.5` (evenly distributed with jitter)
   - Calculate velocity: `Math.random() * 24 + 16` (16--40px)
   - Set `--tx` and `--ty` CSS variables: `Math.cos(angle) * velocity` and `Math.sin(angle) * velocity`
8. Generate 1 ripple element positioned at click point
9. Append container to target
10. Remove container after `600ms`

**Parameters**:
- Particle count: `6`
- Particle size range: `4px` to `10px`
- Angle distribution: 60 degrees apart (`PI*2/6`) with `+Math.random()*0.5` jitter
- Velocity range: `16px` to `40px`
- Cleanup delay: `600ms`

**Animation approach**: CSS animations on the created elements (`pop-anim` for dots, `ripple-anim` for ripple). JS only creates DOM and sets CSS custom properties.

**`prefers-reduced-motion` handling**: JS checks `prefersReduced` at the top and returns early. No particles/ripple are created.

---

## 8. Skeleton Loading Toggle

**Trigger**: Click on `#skel-toggle` (mode switch), click on `#skel-load` (load/reset content).

**DOM targets**: `.skel` elements, `#skel-card-1`, `#skel-card-2`, `#skel-card-3`.

**Algorithm**:

### Mode Toggle (`#skel-toggle`):
1. Toggle `skelMode` between `'shimmer'` and `'pulse'`
2. Update all `.skel` elements: set `className` to `'skel skel-shimmer'` or `'skel skel-pulse'`

### Load Content (`#skel-load`):
1. If already loaded (reset flow):
   - Disable button
   - Fade out all 3 cards (`opacity: 0`, `transition: opacity var(--motion-fast) ease-out`)
   - After 200ms: restore original skeleton HTML (cached on init), re-apply current skeleton mode, set `opacity: 1`
   - Re-enable button, set text to "Load Content"
2. If not loaded (load flow):
   - Disable button, set text to "Loading..."
   - After 600ms: fade out skeleton cards (`opacity: 0`)
   - After another 200ms: swap content with staggered reveal:
     - For each card (120ms stagger): replace innerHTML, set initial state (`opacity: 0`, `translateY(12px)`), then animate in via double-rAF (`opacity: 1`, `translateY(0)`)
   - After all cards animated: re-enable button, set text to "Reset"

**Content data**:

```js
const cards = [
  { title: 'Design Tokens', desc: 'Centralized design decisions as data' },
  { title: 'Component Library', desc: 'Production-ready building blocks' },
  { title: 'Animation System', desc: 'Spring-based motion patterns' }
];
```

**Parameters**:
- Initial loading delay: `600ms`
- Fade-out duration: `var(--motion-fast)` (160ms)
- Content swap delay: `200ms` after fade-out
- Stagger interval: `120ms` per card
- Content enter transition: `opacity var(--motion-base) var(--ease-out), transform var(--motion-base) var(--ease-smooth)`

**Animation approach**: Inline style transitions. Double `requestAnimationFrame` to ensure initial state is painted before transition starts.

**`prefers-reduced-motion` handling**: No explicit check. Relies on global CSS `prefers-reduced-motion: reduce` override.

---

## 9. Page Transition Demo

**Trigger**: Called via `window.pageTransition(type)`.

**DOM targets**: `#pt-page-a`, `#pt-page-b`.

**Algorithm**:
1. Check `prefersReduced` -- if true, return immediately
2. Determine entering/leaving pages based on `ptCurrentPage` state (`'a'` or `'b'`)
3. Apply transition based on `type`:

### Crossfade:
- Leaving: `opacity: 0` with `transition: opacity 0.3s ease-out`, `transform: translateX(0)`
- Entering: `opacity: 1` with `transition: opacity 0.3s ease-out 0.15s` (150ms delay), `transform: translateX(0)`

### Slide-Left:
- Leaving: `transform: translateX(-100%)`, `opacity: 0` with `transition: transform 0.4s cubic-bezier(0.22,1,0.36,1), opacity 0.3s ease-out`
- Entering: start at `translateX(100%)` `opacity: 0`, then on next frame `translateX(0)` `opacity: 1`

### Slide-Right:
- Leaving: `transform: translateX(100%)`, `opacity: 0`
- Entering: start at `translateX(-100%)` `opacity: 0`, then on next frame `translateX(0)` `opacity: 1`

4. Toggle `ptCurrentPage` between `'a'` and `'b'`

**Function signature**:

```js
window.pageTransition = function (type) { ... }
```

**Parameters**:
- `type`: `'crossfade'` | `'slide-left'` | `'slide-right'`
- Crossfade duration: `0.3s` with `0.15s` enter delay
- Slide duration: `0.4s` for transform, `0.3s` for opacity
- Slide easing: `cubic-bezier(0.22, 1, 0.36, 1)` (ease-smooth)

**Animation approach**: Direct inline style manipulation with CSS transitions. Uses `requestAnimationFrame` for slide-left/slide-right to ensure entering page starts off-screen before transitioning in.

**`prefers-reduced-motion` handling**: Returns immediately when `prefersReduced` is true.

---

## 10. Easing Demonstrations

**Trigger**: Click on `#play-easings` button.

**DOM targets**: 5 dot elements: `#dot-ease-out`, `#dot-ease-bounce`, `#dot-ease-smooth`, `#dot-ease-slam`, `#dot-ease-elastic`.

**Algorithm**:
1. For each of the 5 easings:
   - Reset dot to `left: 0` with `transition: none`
   - On next frame: set `transition: left 1s <easing>` and `left: calc(100% - 12px)`
   - After `1200ms`: set `transition: left 1s <easing>` and `left: 0` (return trip)

**Easing map**:

```js
const easings = {
  'dot-ease-out': 'cubic-bezier(0.16,1,0.3,1)',
  'dot-ease-bounce': 'cubic-bezier(0.34,1.56,0.64,1)',
  'dot-ease-smooth': 'cubic-bezier(0.22,1,0.36,1)',
  'dot-ease-slam': 'cubic-bezier(0.55,0.06,0.68,0.19)',
  'dot-ease-elastic': 'cubic-bezier(0.68,-0.55,0.265,1.55)'
};
```

**Parameters**:
- Forward duration: `1s`
- Pause at end: `200ms` (1200ms timeout - 1000ms animation)
- Return duration: `1s`

**Animation approach**: CSS transitions via inline style manipulation.

**`prefers-reduced-motion` handling**: None explicitly. Relies on global CSS override.

---

## 11. Scroll Progress Bar

**Trigger**: Automatic via `animation-timeline: scroll()` (CSS-only, no JS).

The scroll progress bar is entirely CSS-driven. See [[animation-classes]] section 14 for the `.scroll-progress` and `.scroll-reveal` class definitions.

No JavaScript is involved in the scroll progress behavior.

---

## 12. Back-to-Top Button

**Trigger**: `IntersectionObserver` on `.hero` section, click on `#back-to-top`.

**DOM targets**: `#back-to-top` button, `.hero` section.

**Algorithm**:
1. Create `IntersectionObserver` with `threshold: 0`
2. Observe the `.hero` section
3. When hero is not intersecting (user scrolled past): add `.visible` class to button
4. When hero is intersecting: remove `.visible` class
5. On button click: `window.scrollTo({ top: 0, behavior: 'smooth' })`

**Implementation**:

```js
const btt = document.getElementById('back-to-top');
const heroSection = document.querySelector('.hero');
if (btt && heroSection) {
  const bttObserver = new IntersectionObserver(([entry]) => {
    btt.classList.toggle('visible', !entry.isIntersecting);
  }, { threshold: 0 });
  bttObserver.observe(heroSection);
  btt.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}
```

**CSS for `.back-to-top`**:
- Default: `opacity: 0`, `pointer-events: none`
- `.visible`: `opacity: 1`, `pointer-events: auto`
- Transition: `opacity var(--motion-fast) var(--ease-out)`
- Hover: `translateY(-2px)`, `box-shadow: var(--shadow-md)`

**Animation approach**: CSS transitions via class toggle. IntersectionObserver for visibility.

**`prefers-reduced-motion` handling**: None explicitly. CSS transitions subject to global reduce override. `behavior: 'smooth'` on scroll is browser-handled.

---

## Additional Behaviors

These behaviors are also present in the script block but were not in the original task list. Documented here for completeness.

### 13. Nav Reveal Animation

**Trigger**: First visit only (checks `localStorage`/`sessionStorage` for `'delightful-nav-revealed'`).

**Algorithm**:
1. If `prefersReduced`, return
2. If already revealed (session or local storage), return
3. Create 4 page name labels (Design, Color, Motion, Animation) with accent colors
4. Stagger them in at 60ms intervals with `translateY(-8px) scale(0.9)` -> `translateY(0) scale(1)`
5. After 680ms: collapse them back up at 40ms intervals
6. After 400ms more: fade in chevron, remove container
7. Mark as revealed in both localStorage and sessionStorage

### 14. Hero Word Reveal

**Function**: `initHeroReveal()` and `window.replayHero()`

**Algorithm**:
1. Find `#hero-headline`
2. Split text nodes into words, wrap each in `<span class="word">` with `--word-i` CSS variable
3. If not `prefersReduced`: stagger-animate each word at `200 + i * 80`ms with `opacity`, `transform`, `filter` transitions
4. `replayHero()`: reset all words to `opacity: 0`, `blur(4px)`, `translateY(16px)`, then re-animate

**Parameters**:
- Initial delay: `200ms`
- Per-word stagger: `80ms`
- Transition duration: `0.5s`
- Easing: `cubic-bezier(0.22, 1, 0.36, 1)` (ease-smooth)

### 15. Scroll Spy

**Trigger**: `IntersectionObserver` on all `.ds-section[id]` and `.hero[id]` elements.

**Algorithm**: Update `.active` class on nav links as sections enter the viewport. Uses `rootMargin: '-20% 0px -70% 0px'`.

### 16. Staggered Reveal

**Trigger**: Page load + click on `#stagger-replay`.

**Function signatures**:

```js
function staggerRevealGroup(selector, delay, easing, duration) { ... }
function staggerRevealAll() { ... }
```

**3 configurations**:

| Selector | Delay | Easing | Duration |
|---|---|---|---|
| `.stagger-snappy` | `30ms` | `cubic-bezier(0.34, 1.56, 0.64, 1)` (ease-bounce) | `200ms` |
| `.stagger-standard` | `50ms` | `cubic-bezier(0.22, 1, 0.36, 1)` (ease-smooth) | `300ms` |
| `.stagger-gentle` | `80ms` | `cubic-bezier(0.16, 1, 0.3, 1)` (ease-out) | `400ms` |

**Algorithm**:
1. Set all items to `opacity: 0`, `translateY(16px) scale(0.95)`, `transition: none`
2. On next frame: for each item at index `i`, after `i * delay`ms, apply transition and animate to `opacity: 1`, `translateY(0) scale(1)`
3. After all items complete: clean up inline styles

### 17. Modal

**Trigger**: Click on `#open-modal`.

Uses native `<dialog>` element with `.showModal()` / `.close()`. Click on backdrop (the dialog element itself) also closes.

### 18. Drawer

**Trigger**: Click on `#open-drawer`.

Same pattern as modal -- native `<dialog>` with `.showModal()` / `.close()`.

### 19. Success Feedback

**Trigger**: Click on `#success-trigger`.

Shows `#success-msg` with `.feedback-enter` class (scale-in animation), hides after 2000ms.

### 20. Brand Dropdown

**Trigger**: Click on `#brand-trigger`.

Toggles `aria-expanded` and `.open` class. Closes on outside click or Escape key.

### 21. Click to Copy

**Trigger**: Click on `[data-copy]` elements or `.swatch` elements.

Copies value to clipboard via `navigator.clipboard.writeText()`, shows success toast.

### 22. Contrast Checker

**Trigger**: Input on `#cc-bg` and `#cc-fg` color inputs.

Uses canvas-based color conversion to calculate WCAG contrast ratio. Reports AAA / AA / AA Large / Fail.

### 23. Type Tester

**Trigger**: Input on weight/size/tracking controls.

Updates `#tt-preview` inline styles. Preset function `window.setTypePreset(preset)` with 4 presets: headline, body, label, code.

### 24. Token Architecture Visualization

**Trigger**: Click on `.arch-family-btn` buttons (6 color families).

Renders semantic and component token lists for selected family, updates preview.
