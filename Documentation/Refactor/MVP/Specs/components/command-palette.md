---
title: "Command Palette"
date: 2026-03-02
type: spec
scope: mvp
status: active
---

# Command Palette

> Full-screen overlay command palette triggered by Cmd+K (or Ctrl+K). Features an ARIA combobox search input with real-time filtering, keyboard navigation (arrow keys, Enter, Escape), result list with colored section dots, and animated entrance/exit via scale+opacity transitions.

Cross-references: [[topnav]] (Cmd+K trigger lives in topnav-right as `.topnav-kbd`), [[modal]] (overlay pattern similar to modal backdrop), [[token-tiers]] (z-index, spacing, typography, radius, motion, easing tokens).

Visual reference: Section "COMMAND PALETTE" in `design-reference.html` (lines ~3735-3792 CSS, lines ~7180-7186 HTML, lines ~8064-8191 JS).

---

## 1. HTML Structure

```html
<div class="cmd-palette-overlay" id="cmd-palette-overlay">
  <div class="cmd-palette" role="dialog" aria-label="Quick navigation">
    <input class="cmd-palette-input" id="cmd-palette-input"
           type="text"
           placeholder="Jump to section..."
           autocomplete="off"
           role="combobox"
           aria-controls="cmd-palette-list"
           aria-autocomplete="list"
           aria-expanded="false" />
    <ul class="cmd-palette-list" id="cmd-palette-list" role="listbox"></ul>
  </div>
</div>
```

Result items are dynamically generated:

```html
<li class="cmd-palette-item active" id="cmd-option-philosophy" role="option" aria-selected="true" data-section-id="philosophy">
  <span class="cmd-section-dot" style="background:var(--accent-primary)"></span>
  Philosophy
</li>
```

Empty state:

```html
<li class="cmd-palette-empty">No sections found</li>
```

---

## 2. CSS Classes

### 2.1 `.cmd-palette-overlay`

| Property | Value | Token |
|---|---|---|
| `position` | `fixed` | -- |
| `inset` | `0` | -- |
| `z-index` | `var(--z-modal)` | `1000` |
| `background` | `var(--overlay-bg)` | -- |
| `display` | `none` | -- |
| `align-items` | `flex-start` | -- |
| `justify-content` | `center` | -- |
| `padding-top` | `20vh` | -- |
| `opacity` | `0` | -- |
| `transition` | `opacity 200ms var(--ease-out), display 200ms var(--ease-out) allow-discrete` | -- |

### 2.2 `.cmd-palette-overlay.active`

| Property | Value |
|---|---|
| `display` | `flex` |
| `opacity` | `1` |

Uses `@starting-style { opacity: 0; }` for entry animation.

### 2.3 `.cmd-palette`

| Property | Value | Token |
|---|---|---|
| `width` | `100%` | -- |
| `max-width` | `520px` | -- |
| `background` | `var(--bg-elevated)` | -- |
| `border` | `2px solid var(--border-default)` | -- |
| `border-radius` | `var(--radius-lg)` | `24px` |
| `box-shadow` | `var(--shadow-lg)` | -- |
| `overflow` | `hidden` | -- |
| `transform` | `scale(0.95) translateY(-10px)` | Initial (hidden) state |
| `opacity` | `0` | Initial (hidden) state |
| `transition` | `transform 240ms var(--ease-smooth), opacity 240ms var(--ease-smooth)` | -- |

When active (`.cmd-palette-overlay.active .cmd-palette`):
- `transform: scale(1) translateY(0)`
- `opacity: 1`
- `@starting-style { transform: scale(0.95) translateY(-10px); opacity: 0; }`

### 2.4 `.cmd-palette-input`

| Property | Value | Token |
|---|---|---|
| `width` | `100%` | -- |
| `padding` | `var(--space-4) var(--space-6)` | `16px 24px` |
| `font-family` | `var(--font-sans)` | -- |
| `font-size` | `var(--step-0)` | Fluid ~16-20px |
| `border` | `none` | -- |
| `border-bottom` | `2px solid var(--border-subtle)` | -- |
| `background` | `transparent` | -- |
| `color` | `var(--text-primary)` | -- |
| `outline` | `none` | -- |

Placeholder: `color: var(--text-muted)`.

### 2.5 `.cmd-palette-list`

| Property | Value | Token |
|---|---|---|
| `list-style` | `none` | -- |
| `max-height` | `320px` | -- |
| `overflow-y` | `auto` | -- |
| `padding` | `var(--space-2) 0` | `8px 0` |

### 2.6 `.cmd-palette-item`

| Property | Value | Token |
|---|---|---|
| `padding` | `var(--space-2) var(--space-6)` | `8px 24px` |
| `font-size` | `var(--ui-text-md)` | `14px` |
| `color` | `var(--text-secondary)` | -- |
| `cursor` | `pointer` | -- |
| `display` | `flex` | -- |
| `align-items` | `center` | -- |
| `gap` | `var(--space-3)` | `12px` |
| `transition` | `transform var(--motion-instant) linear, background var(--motion-fast) var(--ease-out), color var(--motion-fast) var(--ease-out)` | -- |

### 2.7 `.cmd-palette-item:hover`, `.cmd-palette-item.active`

| Property | Value |
|---|---|
| `background` | `var(--bg-subtle)` |
| `color` | `var(--text-primary)` |

### 2.8 `.cmd-palette-item:active`

| Property | Value |
|---|---|
| `transform` | `translateY(1px)` |

### 2.9 `.cmd-section-dot`

| Property | Value |
|---|---|
| `width` | `6px` |
| `height` | `6px` |
| `border-radius` | `50%` |
| `flex-shrink` | `0` |

### 2.10 `.cmd-palette-empty`

| Property | Value | Token |
|---|---|---|
| `padding` | `var(--space-4) var(--space-6)` | `16px 24px` |
| `color` | `var(--text-muted)` | -- |
| `font-size` | `var(--ui-text-sm)` | `13px` |
| `text-align` | `center` | -- |

---

## 3. States

| State | CSS Changes |
|---|---|
| Hidden | Overlay: `display: none; opacity: 0`. Panel: `scale(0.95) translateY(-10px); opacity: 0` |
| Visible (`.active`) | Overlay: `display: flex; opacity: 1`. Panel: `scale(1) translateY(0); opacity: 1` |
| Item hover / active | `background: var(--bg-subtle); color: var(--text-primary)` |
| Item pressed | `transform: translateY(1px)` |
| Empty state | "No sections found" centered text |

---

## 4. JavaScript Behavior

### 4.1 Section Data

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

### 4.2 Core Functions

**`openCmdPalette()`**: Adds `.active` to overlay, clears input, sets `aria-expanded="true"`, renders unfiltered list, focuses input.

**`closeCmdPalette()`**: Removes `.active` from overlay, clears input, sets `aria-expanded="false"`.

**`renderCmdList(filter)`**: Filters `cmdSections` by lowercase match against `label` or `id`. Creates `<li>` elements with `role="option"`, `aria-selected`, colored dot, and label text. First item gets `.active` class and `aria-selected="true"`. Sets `aria-activedescendant` on input.

**`navigateToSection(id)`**: Closes palette, then either:
- `_toggle-theme`: clicks the theme toggle button
- `_back-to-top`: `window.scrollTo({ top: 0, behavior: 'smooth' })`
- Otherwise: `document.getElementById(id).scrollIntoView({ behavior: 'smooth' })`

### 4.3 Keyboard Navigation

On the input element (`keydown`):

| Key | Behavior |
|---|---|
| `ArrowDown` | Moves active index down (clamped to list length - 1), updates `.active` class and `aria-selected`, scrolls item into view |
| `ArrowUp` | Moves active index up (clamped to 0), updates `.active` class and `aria-selected`, scrolls item into view |
| `Enter` | Navigates to the active item's section |
| `Escape` | Closes the command palette |

### 4.4 Global Keyboard Trigger

```js
document.addEventListener('keydown', (e) => {
  if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
    e.preventDefault();
    // Toggle open/close
  }
});
```

### 4.5 Backdrop Click

Clicking on the overlay (not the palette panel) closes the palette.

### 4.6 Additional Triggers

- `#cmd-k-trigger` (`.topnav-kbd`): click opens palette
- `#open-cmdpal` button: click opens palette

---

## 5. Responsive Behavior

The palette uses `max-width: 520px` and `width: 100%`, so it naturally shrinks on smaller viewports. The `padding-top: 20vh` positions it in the upper portion of the screen.

---

## 6. Accessibility

- Overlay has `role="dialog"` with `aria-label="Quick navigation"`
- Input uses `role="combobox"` with `aria-controls`, `aria-autocomplete="list"`, `aria-expanded`
- List uses `role="listbox"`, items use `role="option"` with `aria-selected`
- `aria-activedescendant` on input tracks the active option
- Escape closes the palette
- Mouse hover on items updates the active index for keyboard users who switch to mouse

---

## 7. Token Dependencies

### Tier 2 (Semantic)

- `--bg-elevated`, `--bg-subtle`
- `--text-primary`, `--text-secondary`, `--text-muted`
- `--border-default`, `--border-subtle`
- `--overlay-bg`
- `--shadow-lg`
- `--accent-primary`, `--accent-gold`, `--accent-cyan`, `--accent-green`, `--accent-purple`, `--accent-danger`

### Tier 3 (Component)

- `--z-modal` (`1000`)
- `--space-2` (`8px`), `--space-3` (`12px`), `--space-4` (`16px`), `--space-6` (`24px`)
- `--radius-lg` (`24px`)
- `--step-0` (fluid font size)
- `--ui-text-sm` (`13px`), `--ui-text-md` (`14px`)
- `--font-sans`
- `--motion-instant` (`100ms`), `--motion-fast` (`160ms`)
- `--ease-out`, `--ease-smooth`

---

## 8. Test Specification

### 8.1 Computed Style Assertions

- `.cmd-palette-overlay` has `z-index: 1000`
- `.cmd-palette` has `max-width: 520px` and `border-radius: 24px`
- `.cmd-palette-list` has `max-height: 320px`
- `.cmd-palette-item` has `font-size` resolving to `14px`

### 8.2 Interaction Assertions

- Cmd+K opens the palette (overlay gains `.active` class)
- Cmd+K again closes it
- Typing in input filters the list in real-time
- ArrowDown moves highlight to next item
- ArrowUp moves highlight to previous item
- Enter navigates to highlighted section
- Escape closes the palette
- Clicking overlay backdrop closes the palette
- Clicking a list item navigates to that section

### 8.3 Visual Regression Scenarios

- Command palette open with no filter (light mode)
- Command palette open with no filter (dark mode)
- Command palette with filter text showing 3 results
- Command palette with no results (empty state)
- Active item highlight

### 8.4 Reduced Motion Compliance

- With `prefers-reduced-motion: reduce`, entry/exit animations complete in 0.01ms

## Implementation CSS

```css
@layer component {
  .cmd-palette-overlay {
    position: fixed;
    inset: 0;
    z-index: var(--z-modal);
    background: var(--overlay-bg);
    display: flex;
    align-items: flex-start;
    justify-content: center;
    padding-top: 20vh;
    opacity: 0;
    pointer-events: none;
    transition: opacity var(--motion-fast) var(--ease-out);
  }
  .cmd-palette-overlay.active { opacity: 1; pointer-events: auto; }

  .cmd-palette {
    width: 560px;
    max-width: 90vw;
    background: var(--bg-surface);
    border: 2px solid var(--border-default);
    border-radius: var(--radius-lg);
    box-shadow: var(--shadow-lg);
    overflow: hidden;
  }

  .cmd-palette-input {
    width: 100%;
    padding: var(--space-4);
    border: none;
    border-bottom: 2px solid var(--border-default);
    background: transparent;
    color: var(--text-primary);
    font-size: 1rem;
    font-family: var(--font-sans);
    outline: none;
  }

  .cmd-palette-list {
    max-height: 320px;
    overflow-y: auto;
    padding: var(--space-2);
  }

  .cmd-palette-item {
    display: flex;
    align-items: center;
    gap: var(--space-3);
    padding: var(--space-3) var(--space-4);
    border-radius: var(--radius-md);
    cursor: pointer;
    transition: background var(--motion-fast) var(--ease-out);
  }
  .cmd-palette-item:hover,
  .cmd-palette-item.active { background: var(--bg-subtle); }
  .cmd-palette-item:active { transform: scale(0.98); }

  .cmd-section-dot {
    width: 8px;
    height: 8px;
    border-radius: var(--radius-full);
    flex-shrink: 0;
  }

  .cmd-palette-empty {
    padding: var(--space-6);
    text-align: center;
    color: var(--text-muted);
  }
}
```
