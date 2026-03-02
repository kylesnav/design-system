---
title: "Drawer"
date: 2026-03-02
type: spec
scope: mvp
status: active
---

# Drawer

> Bottom-sliding panel using the native `<dialog>` element with `showModal()`. Slides up from the bottom with a bouncy transition, features a drag handle, and closes on backdrop click or Escape key. Used for forms and secondary actions on mobile-friendly surfaces.

Cross-references: [[modal]] (centered alternative overlay), [[button]] (action buttons use btn component), [[token-tiers]] (spacing, radius, motion tokens).

Visual reference: Section "MODAL, DRAWER & POPOVER" in `design-reference.html` (lines ~2873-2916 CSS, lines ~7159-7178 HTML, lines ~7841-7847 JS).

---

## 1. HTML Structure

```html
<dialog class="drawer-panel" id="drawer-panel">
  <div class="drawer-handle" id="drawer-handle"></div>
  <div class="drawer-title">Add New Token</div>
  <div class="form-group" style="margin-bottom:var(--space-4)">
    <label class="form-label" for="drawer-token-name">Token Name</label>
    <input class="input" id="drawer-token-name" type="text" placeholder="e.g., --accent-purple">
  </div>
  <div class="form-group" style="margin-bottom:var(--space-4)">
    <label class="form-label" for="drawer-token-value">Value</label>
    <input class="input" id="drawer-token-value" type="text" placeholder="oklch(0.60 0.22 300)">
  </div>
  <div class="form-group" style="margin-bottom:var(--space-6)">
    <label class="form-label" for="drawer-token-category">Category</label>
    <div class="select-wrap">
      <select class="select" id="drawer-token-category">
        <option>Primitive</option>
        <option>Semantic</option>
        <option>Component</option>
      </select>
      <span class="select-arrow">
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </span>
    </div>
  </div>
  <div class="btn-row">
    <button class="btn btn-md btn-primary" onclick="closeDrawer()">Add Token</button>
    <button class="btn btn-md btn-ghost" onclick="closeDrawer()">Cancel</button>
  </div>
</dialog>
```

---

## 2. CSS Classes

### 2.1 `.drawer-panel` (native `<dialog>`)

| Property | Value | Token |
|---|---|---|
| `margin` | `0` | -- |
| `margin-top` | `auto` | Pushes to bottom of viewport |
| `width` | `100%` | -- |
| `max-width` | `100%` | -- |
| `background` | `var(--bg-surface)` | -- |
| `border` | `none` | -- |
| `border-top` | `2px solid var(--border-default)` | -- |
| `border-radius` | `var(--radius-xl) var(--radius-xl) 0 0` | `32px 32px 0 0` |
| `padding` | `var(--space-6)` | `24px` |
| `padding-top` | `var(--space-4)` | `16px` (overrides top padding for handle space) |
| `max-height` | `80vh` | -- |
| `overflow-y` | `auto` | -- |
| `box-shadow` | `0 -8px 40px oklch(0 0 0 / 0.1)` | Custom upward shadow (not a token) |
| `color` | `var(--text-primary)` | -- |

Entry/exit animation properties:

| Property | Value |
|---|---|
| `transform` | `translateY(100%)` (initial -- off-screen below) |
| `transition` | `transform var(--motion-slow) var(--ease-bounce), display var(--motion-slow) allow-discrete, overlay var(--motion-slow) allow-discrete` |

Note: The `box-shadow` value `0 -8px 40px oklch(0 0 0 / 0.1)` is a hardcoded non-zero-blur shadow. This is the one exception to the neo-brutalist zero-blur rule -- the drawer uses a soft upward shadow for the sheet effect.

### 2.2 `.drawer-panel[open]`

| Property | Value |
|---|---|
| `transform` | `translateY(0)` |

### 2.3 `.drawer-panel::backdrop`

| Property | Value | Token |
|---|---|---|
| `background` | `var(--overlay-bg)` | -- |
| `opacity` | `0` (initial) | -- |
| `transition` | `opacity var(--motion-slow) var(--ease-out), display var(--motion-slow) allow-discrete, overlay var(--motion-slow) allow-discrete` | -- |

### 2.4 `.drawer-panel[open]::backdrop`

| Property | Value |
|---|---|
| `opacity` | `1` |

### 2.5 `@starting-style`

```css
@starting-style {
  .drawer-panel[open] {
    transform: translateY(100%);
  }
  .drawer-panel[open]::backdrop {
    opacity: 0;
  }
}
```

### 2.6 `.drawer-handle`

| Property | Value | Token |
|---|---|---|
| `width` | `36px` | -- |
| `height` | `4px` | -- |
| `background` | `var(--border-strong)` | -- |
| `border-radius` | `var(--radius-full)` | `9999px` |
| `margin` | `0 auto var(--space-4)` | Centered, `16px` bottom margin |
| `cursor` | `grab` | -- |

### 2.7 `.drawer-title`

| Property | Value | Token |
|---|---|---|
| `font-size` | `1.125rem` | `18px` |
| `font-weight` | `600` | -- |
| `margin-bottom` | `var(--space-6)` | `24px` |

---

## 3. States

| State | Panel | Backdrop |
|---|---|---|
| Closed | `transform: translateY(100%)` (below viewport) | `opacity: 0` |
| Open | `transform: translateY(0)` | `opacity: 1` |

The transition uses `--motion-slow` (360ms) with `--ease-bounce` for the panel, creating a bouncy slide-up effect.

---

## 4. Variants

No variants in the reference. Single bottom-sheet style.

---

## 5. JavaScript Behavior

### 5.1 Open Drawer

```js
const drawerPanel = document.getElementById('drawer-panel');
document.getElementById('open-drawer').addEventListener('click', () => {
  drawerPanel.showModal();
});
```

### 5.2 Close Drawer

```js
window.closeDrawer = function () {
  drawerPanel.close();
};
```

### 5.3 Backdrop Click to Close

```js
drawerPanel.addEventListener('click', (e) => {
  if (e.target === drawerPanel) drawerPanel.close();
});
```

### 5.4 Escape Key

Native `<dialog>` behavior -- Escape key automatically calls `.close()`.

### 5.5 Drag Handle

The `.drawer-handle` has `cursor: grab` but no drag-to-dismiss JavaScript is implemented in the reference. Implementing agents should consider adding touch-based swipe-down-to-close functionality.

---

## 6. Responsive Behavior

The drawer is inherently mobile-friendly: full-width, slides from bottom, max-height 80vh. No breakpoint-specific changes needed.

---

## 7. Accessibility

- Uses native `<dialog>` element with `showModal()` which:
  - Creates a modal context (traps focus within the dialog)
  - Adds `::backdrop` pseudo-element
  - Manages Escape key closing
  - Adds `aria-modal="true"` implicitly
- Form inputs have associated `<label>` elements with `for` attributes
- Action buttons provide clear labels ("Add Token", "Cancel")
- The drag handle is decorative; implementing agents should ensure it is `aria-hidden="true"`

---

## 8. Token Dependencies

### Tier 2 (Semantic)

- `--bg-surface`
- `--text-primary`
- `--border-default`, `--border-strong`
- `--overlay-bg`

### Tier 3 (Component)

- `--space-4` (`16px`), `--space-6` (`24px`)
- `--radius-xl` (`32px`), `--radius-full` (`9999px`)
- `--motion-slow` (`360ms`)
- `--ease-out`, `--ease-bounce`

---

## 9. Test Specification

### 9.1 Computed Style Assertions

- `.drawer-panel` has `border-radius` with top corners resolving to `32px` and bottom corners `0`
- `.drawer-panel` has `max-height: 80vh`
- `.drawer-panel` has `width: 100%`
- `.drawer-panel` (closed) has `transform: translateY(100%)`
- `.drawer-panel[open]` has `transform: translateY(0)` (or near 0)
- `.drawer-handle` has `width: 36px; height: 4px; border-radius: 9999px`
- `.drawer-title` has `font-size` resolving to `18px`

### 9.2 Interaction Assertions

- Clicking the open trigger calls `showModal()` and drawer slides up
- Clicking backdrop closes the drawer
- Clicking "Cancel" button closes the drawer
- Pressing Escape closes the drawer
- Focus is trapped within the drawer when open

### 9.3 Visual Regression Scenarios

- Drawer open with form contents (light mode)
- Drawer open (dark mode)
- Drawer with backdrop visible

### 9.4 Reduced Motion Compliance

- With `prefers-reduced-motion: reduce`, slide/opacity transitions complete in 0.01ms

## Implementation CSS

```css
@layer component {
  .drawer-panel {
    position: fixed;
    top: 0;
    right: 0;
    height: 100vh;
    width: 380px;
    max-width: 85vw;
    background: var(--bg-surface);
    border: none;
    border-left: 2px solid var(--border-default);
    padding: 0;
    margin: 0;
    transform: translateX(100%);
    transition: transform var(--motion-base) var(--ease-smooth),
                opacity var(--motion-base) var(--ease-out);
    opacity: 0;
    box-shadow: var(--shadow-lg);
    overflow-y: auto;
  }
  .drawer-panel[open] { transform: translateX(0); opacity: 1; }
  .drawer-panel::backdrop { background: var(--overlay-bg); opacity: 0; transition: opacity var(--motion-base) var(--ease-out); }
  .drawer-panel[open]::backdrop { opacity: 1; }

  .drawer-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: var(--space-5);
    border-bottom: 2px solid var(--border-default);
  }
  .drawer-handle {
    width: 32px;
    height: 32px;
    border-radius: var(--radius-md);
    border: 2px solid var(--border-default);
    background: var(--bg-surface);
    cursor: pointer;
    display: grid;
    place-items: center;
  }
  .drawer-title { font-weight: 700; font-size: 1.125rem; }
}
```
