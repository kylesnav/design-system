---
title: "Modal"
date: 2026-03-02
type: spec
scope: mvp
status: active
---

# Modal

> Centered dialog panel using the native `<dialog>` element with `showModal()`. Features scale-in entrance animation (0.95 to 1.0), backdrop with overlay dimming, close button, and action buttons. Closes on backdrop click, close button, or Escape key (native dialog behavior).

Cross-references: [[drawer]] (bottom-sliding alternative overlay), [[command-palette]] (overlay pattern), [[button]] (action buttons use btn component), [[shadows]] (modal uses `--shadow-lg`), [[token-tiers]] (spacing, radius, z-index, motion tokens).

Visual reference: Section "MODAL, DRAWER & POPOVER" in `design-reference.html` (lines ~2801-2846 CSS, lines ~7138-7156 HTML, lines ~7833-7839 JS).

---

## 1. HTML Structure

```html
<dialog class="modal-panel" id="modal-panel">
  <div class="modal-header">
    <div class="modal-title">Confirm Changes</div>
    <button class="btn btn-icon btn-sm btn-ghost" onclick="closeModal()">
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
        <line x1="18" y1="6" x2="6" y2="18" />
        <line x1="6" y1="6" x2="18" y2="18" />
      </svg>
    </button>
  </div>
  <div class="modal-body">
    <p>You have unsaved changes to your design tokens. Saving will update the token pipeline and trigger a rebuild of all dependent components.</p>
    <p style="margin-top:var(--space-3)">This action affects 24 components across 3 packages.</p>
  </div>
  <div class="modal-actions">
    <button class="btn btn-md btn-secondary" onclick="closeModal()">Cancel</button>
    <button class="btn btn-md btn-primary" onclick="closeModal()">Save Changes</button>
  </div>
</dialog>
```

---

## 2. CSS Classes

### 2.1 `.modal-panel` (native `<dialog>`)

| Property | Value | Token |
|---|---|---|
| `margin` | `auto` | Centers in viewport |
| `background` | `var(--bg-surface)` | -- |
| `border` | `2px solid var(--border-default)` | -- |
| `border-radius` | `var(--radius-lg)` | `24px` |
| `padding` | `var(--space-6)` | `24px` |
| `max-width` | `440px` | -- |
| `width` | `calc(100% - var(--space-8))` | Responsive width with margin |
| `box-shadow` | `var(--shadow-lg)` | `8px 8px 0 var(--border-default)` |
| `color` | `var(--text-primary)` | -- |

Entry/exit animation properties:

| Property | Value |
|---|---|
| `opacity` | `0` (initial) |
| `transform` | `scale(0.95)` (initial) |
| `transition` | `opacity var(--motion-base) var(--ease-out), transform var(--motion-base) var(--ease-bounce), display var(--motion-base) allow-discrete, overlay var(--motion-base) allow-discrete` |

### 2.2 `.modal-panel[open]`, `.modal-panel:popover-open`

| Property | Value |
|---|---|
| `opacity` | `1` |
| `transform` | `scale(1)` |

### 2.3 `.modal-panel::backdrop`

| Property | Value | Token |
|---|---|---|
| `background` | `var(--overlay-bg)` | -- |
| `opacity` | `0` (initial) | -- |
| `transition` | `opacity var(--motion-base) var(--ease-out), display var(--motion-base) allow-discrete, overlay var(--motion-base) allow-discrete` | -- |

### 2.4 `.modal-panel[open]::backdrop`

| Property | Value |
|---|---|
| `opacity` | `1` |

### 2.5 `@starting-style`

```css
@starting-style {
  .modal-panel[open],
  .modal-panel:popover-open {
    opacity: 0;
    transform: scale(0.95);
  }
  .modal-panel[open]::backdrop,
  .modal-panel:popover-open::backdrop {
    opacity: 0;
  }
}
```

### 2.6 `.modal-header`

| Property | Value | Token |
|---|---|---|
| `display` | `flex` | -- |
| `align-items` | `center` | -- |
| `justify-content` | `space-between` | -- |
| `margin-bottom` | `var(--space-4)` | `16px` |

### 2.7 `.modal-title`

| Property | Value |
|---|---|
| `font-size` | `1.125rem` (18px) |
| `font-weight` | `600` |

### 2.8 `.modal-body`

| Property | Value | Token |
|---|---|---|
| `font-size` | `0.9375rem` | `15px` |
| `color` | `var(--text-secondary)` | -- |
| `line-height` | `1.6` | -- |

### 2.9 `.modal-actions`

| Property | Value | Token |
|---|---|---|
| `margin-top` | `var(--space-6)` | `24px` |
| `display` | `flex` | -- |
| `gap` | `var(--space-3)` | `12px` |
| `justify-content` | `flex-end` | -- |

---

## 3. States

| State | Panel | Backdrop |
|---|---|---|
| Closed | `opacity: 0; transform: scale(0.95)` | `opacity: 0` |
| Open | `opacity: 1; transform: scale(1)` | `opacity: 1` |

The transition uses `--motion-base` (240ms) with `--ease-bounce` for the panel transform, creating a slight overshoot effect on entry.

---

## 4. Variants

No variants in the reference. Single modal style.

---

## 5. JavaScript Behavior

### 5.1 Open Modal

```js
const modalPanel = document.getElementById('modal-panel');
document.getElementById('open-modal').addEventListener('click', () => {
  modalPanel.showModal();
});
```

### 5.2 Close Modal

```js
window.closeModal = function () {
  modalPanel.close();
};
```

### 5.3 Backdrop Click to Close

```js
modalPanel.addEventListener('click', (e) => {
  if (e.target === modalPanel) modalPanel.close();
});
```

### 5.4 Escape Key

Native `<dialog>` behavior -- Escape key automatically calls `.close()`.

---

## 6. Responsive Behavior

The modal uses `max-width: 440px` and `width: calc(100% - var(--space-8))`, so it naturally shrinks on smaller viewports while maintaining a `32px` margin on each side.

---

## 7. Accessibility

- Uses native `<dialog>` element with `showModal()` which:
  - Creates a modal context (traps focus within the dialog)
  - Adds `::backdrop` pseudo-element
  - Manages Escape key closing
  - Adds `aria-modal="true"` implicitly
- Close button uses `btn btn-icon btn-ghost` with an X icon
- Action buttons provide clear labels ("Cancel", "Save Changes")
- Focus is automatically moved to the dialog when opened
- Focus returns to the triggering element when closed (native behavior)

---

## 8. Token Dependencies

### Tier 2 (Semantic)

- `--bg-surface`
- `--text-primary`, `--text-secondary`
- `--border-default`
- `--overlay-bg`
- `--shadow-lg`

### Tier 3 (Component)

- `--space-3` (`12px`), `--space-4` (`16px`), `--space-6` (`24px`), `--space-8` (`32px`)
- `--radius-lg` (`24px`)
- `--motion-base` (`240ms`)
- `--ease-out`, `--ease-bounce`

---

## 9. Test Specification

### 9.1 Computed Style Assertions

- `.modal-panel` has `border-radius: 24px`
- `.modal-panel` has `max-width: 440px`
- `.modal-panel` has `box-shadow` matching `--shadow-lg`
- `.modal-panel` (closed) has `opacity: 0` (or is not displayed)
- `.modal-panel[open]` has `opacity: 1` and `transform: scale(1)` (or near 1)
- `.modal-title` has `font-size` resolving to `18px`

### 9.2 Interaction Assertions

- Clicking the open trigger calls `showModal()` and modal becomes visible
- Clicking backdrop (`.modal-panel` element itself) closes the modal
- Clicking close button closes the modal
- Pressing Escape closes the modal
- Focus is trapped within the modal when open

### 9.3 Visual Regression Scenarios

- Modal open centered (light mode)
- Modal open centered (dark mode)
- Modal with backdrop visible

### 9.4 Reduced Motion Compliance

- With `prefers-reduced-motion: reduce`, scale/opacity transitions complete in 0.01ms

## Implementation CSS

```css
@layer component {
  .modal-panel {
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%) scale(0.95);
    width: 480px;
    max-width: 90vw;
    max-height: 85vh;
    background: var(--bg-surface);
    border: 2px solid var(--border-default);
    border-radius: var(--radius-lg);
    box-shadow: var(--shadow-lg);
    padding: 0;
    opacity: 0;
    transition: transform var(--motion-base) var(--ease-smooth),
                opacity var(--motion-base) var(--ease-out);
    overflow-y: auto;
  }
  .modal-panel[open] { transform: translate(-50%, -50%) scale(1); opacity: 1; }
  .modal-panel::backdrop { background: var(--overlay-bg); opacity: 0; transition: opacity var(--motion-base) var(--ease-out); }
  .modal-panel[open]::backdrop { opacity: 1; }

  .modal-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: var(--space-5);
    border-bottom: 2px solid var(--border-default);
  }
  .modal-title { font-weight: 700; font-size: 1.125rem; }
  .modal-body { padding: var(--space-5); }
  .modal-actions {
    display: flex;
    gap: var(--space-3);
    justify-content: flex-end;
    padding: var(--space-4) var(--space-5);
    border-top: 2px solid var(--border-default);
  }
}
```
