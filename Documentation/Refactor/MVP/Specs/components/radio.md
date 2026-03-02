---
title: "Radio"
date: 2026-03-02
type: spec
scope: mvp
status: active
---

# Radio

> Custom radio button with an inner dot indicator. Uses a hidden native `<input type="radio">` paired with a visible `.radio-circle` span. Shares the `.check-group` pattern with checkboxes. The selected state shows a 6px white dot inside a pink circle.

Cross-references: [[checkbox]] (shares `.check-group` pattern and identical interaction structure), [[token-tiers]] (accent-primary for selected state).

Visual reference: Section "05 -- Components", subsection "Checkboxes, Radios & Toggle" in `design-reference.html` (lines ~5622-5625).

---

## 1. HTML Structure

### 1.1 Selected Radio

```html
<label class="check-group">
  <input type="radio" name="option-group" class="sr-only" checked>
  <span class="radio-circle" aria-hidden="true"></span>
  Option A
</label>
```

### 1.2 Unselected Radio

```html
<label class="check-group">
  <input type="radio" name="option-group" class="sr-only">
  <span class="radio-circle" aria-hidden="true"></span>
  Option B
</label>
```

### 1.3 Radio Group

```html
<label class="check-group">
  <input type="radio" name="option-group" class="sr-only" checked>
  <span class="radio-circle" aria-hidden="true"></span>
  Option A
</label>
<label class="check-group">
  <input type="radio" name="option-group" class="sr-only">
  <span class="radio-circle" aria-hidden="true"></span>
  Option B
</label>
```

---

## 2. CSS Classes

### 2.1 `.check-group` (shared wrapper -- see [[checkbox]])

Same as checkbox: `display: flex; align-items: center; gap: var(--space-2); cursor: pointer; font-size: 0.875rem;`

### 2.2 `.radio-circle` (visual indicator)

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
| `border-radius` | `50%` | Circle shape |
| `transition` | `transform var(--motion-instant) linear, background var(--motion-fast) var(--ease-out), border-color var(--motion-fast) var(--ease-out)` | -- |

---

## 3. States

### 3.1 Unselected (default)

| Property | Value |
|---|---|
| `background` | `var(--bg-surface)` |
| `border-color` | `var(--border-strong)` |
| Inner dot | Not present |

### 3.2 Selected

Driven by `input:checked + .radio-circle`:

| Property | Value |
|---|---|
| `background` | `var(--accent-primary)` |
| `border-color` | `var(--accent-primary)` |

Inner dot (via `::after` pseudo-element):

| Property | Value |
|---|---|
| `content` | `''` |
| `width` | `6px` |
| `height` | `6px` |
| `background` | `var(--text-on-accent)` |
| `border-radius` | `50%` |

### 3.3 Active (pressed)

| Property | Value |
|---|---|
| `transform` | `scale(0.85)` |

### 3.4 Focus-visible

Driven by `input:focus-visible + .radio-circle`:

| Property | Value |
|---|---|
| `outline` | `2px solid var(--accent-primary)` |
| `outline-offset` | `-2px` |

### 3.5 Legacy Class Fallback

`.radio-circle.checked` applies selected styles via class instead of native `:checked` pseudo-class.

---

## 4. Responsive Behavior

No radio-specific responsive breakpoints. Same touch target rules as checkbox: at `@media (pointer: coarse)`, `.check-group` gets `min-height: 44px; min-width: 44px`.

---

## 5. Accessibility

- Native `<input type="radio">` is hidden with `.sr-only` but remains accessible to screen readers and keyboard.
- All radios in a group share the same `name` attribute for mutual exclusion.
- The `<label>` wrapper makes text clickable and associates with the input.
- `.radio-circle` has `aria-hidden="true"`.
- Keyboard: Arrow keys navigate between radio options in a group; Space selects (native behavior).
- Consider wrapping the radio group in a `<fieldset>` with `<legend>` for group labeling.

### Recommended Enhanced Markup

```html
<fieldset>
  <legend class="form-label">Select an option</legend>
  <label class="check-group">
    <input type="radio" name="option-group" class="sr-only" checked>
    <span class="radio-circle" aria-hidden="true"></span>
    Option A
  </label>
  <label class="check-group">
    <input type="radio" name="option-group" class="sr-only">
    <span class="radio-circle" aria-hidden="true"></span>
    Option B
  </label>
</fieldset>
```

---

## 6. Token Dependencies

### Tier 2 (Semantic)

- `--border-strong` (unselected border)
- `--bg-surface` (unselected background)
- `--accent-primary` (selected background, border, and focus outline)
- `--text-on-accent` (inner dot color)

### Tier 3 (Component)

- `--space-2` (`8px`)
- `--motion-instant` (`100ms`), `--motion-fast` (`160ms`)
- `--ease-out`

### Hardcoded Values

- `border-radius: 50%` on `.radio-circle`
- `width: 18px; height: 18px` on `.radio-circle`
- `width: 6px; height: 6px` on inner dot

---

## 7. Test Specification

### 7.1 Computed Style Assertions

- `.radio-circle` has `width: 18px` and `height: 18px`
- `.radio-circle` has `border-radius: 50%`
- `.radio-circle` has `border: 2px solid` with color matching `--border-strong`
- When checked, `.radio-circle` background matches `--accent-primary`
- When checked, `.radio-circle::after` exists with `width: 6px`, `height: 6px`, `border-radius: 50%`

### 7.2 Interaction Assertions

- Clicking a radio selects it and deselects others in the same group
- `.radio-circle:active` has `transform: scale(0.85)`
- `input:focus-visible + .radio-circle` has outline matching `--accent-primary`

### 7.3 Visual Regression Scenarios

- Unselected radio (light mode)
- Selected radio with inner dot (light mode)
- Radio group with one selected
- Radio in focus state
- Dark mode comparison

### 7.4 Reduced Motion Compliance

- Background/border transitions resolve in 0.01ms with `prefers-reduced-motion: reduce`

---

## 8. Implementation CSS

```css
@layer component {
  .radio-circle {
    width: 18px;
    height: 18px;
    border: 2px solid var(--border-strong);
    background: var(--bg-surface);
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    cursor: pointer;
    border-radius: 50%;
    transition: transform var(--motion-instant) linear,
                background var(--motion-fast) var(--ease-out),
                border-color var(--motion-fast) var(--ease-out);
  }

  .radio-circle:active {
    transform: scale(0.85);
  }

  .check-group input:checked + .radio-circle {
    background: var(--accent-primary);
    border-color: var(--accent-primary);
  }

  .check-group input:checked + .radio-circle::after {
    content: '';
    width: 6px;
    height: 6px;
    background: var(--text-on-accent);
    border-radius: 50%;
  }

  .check-group input:focus-visible + .radio-circle {
    outline: 2px solid var(--accent-primary);
    outline-offset: -2px;
  }

  /* Legacy class-based fallback */
  .radio-circle.checked {
    background: var(--accent-primary);
    border-color: var(--accent-primary);
  }
  .radio-circle.checked::after {
    content: '';
    width: 6px;
    height: 6px;
    background: var(--text-on-accent);
    border-radius: 50%;
  }
}
```
