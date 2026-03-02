---
title: "Checkbox"
date: 2026-03-02
type: spec
scope: mvp
status: active
---

# Checkbox

> Custom checkbox with a checkmark SVG animation. Uses a hidden native `<input type="checkbox">` paired with a visible `.check-box` span. Supports checked, unchecked, disabled, and focus states. The native input drives all states through sibling selectors.

Cross-references: [[radio]] (shares the `.check-group` pattern), [[toggle]] (alternative binary control), [[token-tiers]] (accent-primary for checked state).

Visual reference: Section "05 -- Components", subsection "Checkboxes, Radios & Toggle" in `design-reference.html` (lines ~5608-5622).

---

## 1. HTML Structure

### 1.1 Checked Checkbox

```html
<label class="check-group">
  <input type="checkbox" class="sr-only" checked>
  <span class="check-box" aria-hidden="true">
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" aria-hidden="true">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  </span>
  Enable dark mode
</label>
```

### 1.2 Unchecked Checkbox

```html
<label class="check-group">
  <input type="checkbox" class="sr-only">
  <span class="check-box" aria-hidden="true">
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" aria-hidden="true">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  </span>
  Send notifications
</label>
```

---

## 2. CSS Classes

### 2.1 `.check-group` (wrapper label)

| Property | Value | Token |
|---|---|---|
| `display` | `flex` | -- |
| `align-items` | `center` | -- |
| `gap` | `var(--space-2)` | `8px` |
| `cursor` | `pointer` | -- |
| `font-size` | `0.875rem` | 14px |

### 2.2 `.sr-only` (screen-reader only -- hides native input)

| Property | Value |
|---|---|
| `position` | `absolute` |
| `width` | `1px` |
| `height` | `1px` |
| `padding` | `0` |
| `margin` | `-1px` |
| `overflow` | `hidden` |
| `clip` | `rect(0, 0, 0, 0)` |
| `white-space` | `nowrap` |
| `border-width` | `0` |

### 2.3 `.check-box` (visual indicator)

| Property | Value | Token |
|---|---|---|
| `width` | `18px` | -- |
| `height` | `18px` | -- |
| `border` | `2px solid var(--border-strong)` | -- |
| `background` | `var(--bg-surface)` | -- |
| `display` | `flex` | -- |
| `align-items` | `center` | -- |
| `justify-content` | `center` | -- |
| `flex-shrink` | `0` | -- |
| `cursor` | `pointer` | -- |
| `border-radius` | `4px` | Hardcoded (not tokenized) |
| `transition` | `transform var(--motion-instant) linear, background var(--motion-fast) var(--ease-out), border-color var(--motion-fast) var(--ease-out)` | -- |

---

## 3. States

### 3.1 Unchecked (default)

| Property | Value |
|---|---|
| `background` | `var(--bg-surface)` |
| `border-color` | `var(--border-strong)` |
| SVG checkmark | Hidden (white on white, or invisible when unchecked via `color: currentColor` against white bg) |

### 3.2 Checked

Driven by `input:checked + .check-box`:

| Property | Value |
|---|---|
| `background` | `var(--accent-primary)` |
| `border-color` | `var(--accent-primary)` |
| SVG `color` | `var(--text-on-accent)` (white checkmark visible) |

### 3.3 Active (pressed)

| Property | Value |
|---|---|
| `transform` | `scale(0.85)` |

### 3.4 Focus-visible

Driven by `input:focus-visible + .check-box`:

| Property | Value |
|---|---|
| `outline` | `2px solid var(--accent-primary)` |
| `outline-offset` | `-2px` |

### 3.5 Disabled

Not explicitly defined in the reference CSS for checkboxes. When `disabled` is on the native input, the `.check-group`'s `cursor: pointer` should be overridden to `not-allowed` and `opacity` reduced.

### 3.6 Legacy Class Fallback

`.check-box.checked` applies the same styles as `input:checked + .check-box` for cases where JavaScript manages state via classes (e.g., table row checkboxes).

---

## 4. Checkmark Animation

With `prefers-reduced-motion: no-preference`, the checkmark uses a stroke-dashoffset animation:

```css
@keyframes checkmark-draw {
  from { stroke-dashoffset: 24; }
  to { stroke-dashoffset: 0; }
}
```

This creates a "drawing" effect where the checkmark path animates from invisible to visible.

---

## 5. Responsive Behavior

No checkbox-specific responsive breakpoints.

At `@media (pointer: coarse)`:
- `.check-group` gets `min-height: 44px; min-width: 44px` for touch targets
- `.check-group` gets `padding: var(--space-1) 0` for additional touch area

---

## 6. Accessibility

- The native `<input type="checkbox">` is visually hidden with `.sr-only` but remains accessible to screen readers and keyboard.
- The `<label>` wrapping the entire group makes the text clickable and associates it with the input.
- `.check-box` has `aria-hidden="true"` since it is a decorative visual representation.
- The SVG checkmark also has `aria-hidden="true"`.
- Focus state is visible on the `.check-box` element when the hidden input receives focus (via `input:focus-visible + .check-box`).
- Keyboard: Space bar toggles the checkbox (handled natively by the `<input>`).

---

## 7. Token Dependencies

### Tier 2 (Semantic)

- `--border-strong` (unchecked border)
- `--bg-surface` (unchecked background)
- `--accent-primary` (checked background and border, focus outline)
- `--text-on-accent` (checkmark color when checked)

### Tier 3 (Component)

- `--space-2` (`8px`)
- `--motion-instant` (`100ms`), `--motion-fast` (`160ms`)
- `--ease-out`

### Hardcoded Values

- `border-radius: 4px` on `.check-box` (not tokenized)
- `width: 18px; height: 18px` on `.check-box`

---

## 8. Test Specification

### 8.1 Computed Style Assertions

- `.check-box` has `width: 18px` and `height: 18px`
- `.check-box` has `border-radius: 4px`
- `.check-box` has `border: 2px solid` with color matching `--border-strong`
- When checked, `.check-box` background matches `--accent-primary`
- When checked, `.check-box` border-color matches `--accent-primary`
- `.sr-only` has `position: absolute` and `width: 1px`

### 8.2 Interaction Assertions

- Clicking the label toggles the checkbox state
- `.check-box:active` has `transform: scale(0.85)`
- `input:focus-visible + .check-box` has outline matching `--accent-primary`

### 8.3 Visual Regression Scenarios

- Unchecked checkbox (light mode)
- Checked checkbox (light mode)
- Checkbox in focus state
- Checkbox in active (pressed) state
- Dark mode comparison
- Touch target size at `pointer: coarse`

### 8.4 Reduced Motion Compliance

- Checkmark draw animation resolves in 0.01ms with `prefers-reduced-motion: reduce`

---

## 9. Implementation CSS

```css
@layer component {
  .check-group {
    display: flex;
    align-items: center;
    gap: var(--space-2);
    cursor: pointer;
    font-size: 0.875rem;
  }

  .sr-only {
    position: absolute;
    width: 1px;
    height: 1px;
    padding: 0;
    margin: -1px;
    overflow: hidden;
    clip: rect(0, 0, 0, 0);
    white-space: nowrap;
    border-width: 0;
  }

  .check-box {
    width: 18px;
    height: 18px;
    border: 2px solid var(--border-strong);
    background: var(--bg-surface);
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    cursor: pointer;
    border-radius: 4px;
    transition: transform var(--motion-instant) linear,
                background var(--motion-fast) var(--ease-out),
                border-color var(--motion-fast) var(--ease-out);
  }

  .check-box:active {
    transform: scale(0.85);
  }

  .check-group input:checked + .check-box {
    background: var(--accent-primary);
    border-color: var(--accent-primary);
  }

  .check-group input:checked + .check-box svg {
    color: var(--text-on-accent);
  }

  .check-group input:focus-visible + .check-box {
    outline: 2px solid var(--accent-primary);
    outline-offset: -2px;
  }

  /* Legacy class-based fallback */
  .check-box.checked {
    background: var(--accent-primary);
    border-color: var(--accent-primary);
  }
  .check-box.checked svg {
    color: var(--text-on-accent);
  }
}
```
