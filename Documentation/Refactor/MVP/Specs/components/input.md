---
title: "Input"
date: 2026-03-02
type: spec
scope: mvp
status: active
---

# Input

> Text input field with focus border/shadow treatment, error state, disabled state, and placeholder styling. Used for single-line text entry (names, emails, dates, etc.). Shares the neo-brutalist shadow aesthetic with a colored focus ring.

Cross-references: [[shadows]] (uses `--shadow-sm`, colored focus shadow), [[token-tiers]] (input tokens documented but not yet defined as custom properties), [[radius]] (uses `--radius-sm`), [[typography]] (uses `--ui-text-md`), [[select]] (shares identical border/shadow treatment), [[textarea]] (multi-line variant with same styling).

Visual reference: Section "05 -- Components", subsection "Form Elements" / "Text Inputs" in `design-reference.html` (lines ~5520-5555).

---

## 1. HTML Structure

### 1.1 Basic Input

```html
<div class="form-group">
  <label class="form-label" for="form-fullname">Full name</label>
  <input class="input" id="form-fullname" type="text" placeholder="Enter your name" value="Alex Morgan">
</div>
```

### 1.2 Email Input

```html
<div class="form-group">
  <label class="form-label" for="form-email">Email address</label>
  <input class="input" id="form-email" type="email" placeholder="you@example.com">
</div>
```

### 1.3 Error State Input

```html
<div class="form-group">
  <label class="form-label" for="error-input">Error state</label>
  <input class="input input-error" type="text" value="invalid@" id="error-input" aria-invalid="true" aria-describedby="error-input-msg">
  <div class="form-error-text" id="error-input-msg" role="alert">Please enter a valid email address</div>
</div>
```

### 1.4 Disabled Input

```html
<div class="form-group">
  <label class="form-label" for="form-disabled">Disabled</label>
  <input class="input" id="form-disabled" type="text" value="Cannot edit" disabled>
</div>
```

### 1.5 Input with Icon

```html
<div class="form-group">
  <label class="form-label" for="form-date">Date</label>
  <div class="input-icon-wrap">
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
      <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
      <line x1="16" y1="2" x2="16" y2="6" />
      <line x1="8" y1="2" x2="8" y2="6" />
      <line x1="3" y1="10" x2="21" y2="10" />
    </svg>
    <input class="input" id="form-date" type="text" placeholder="Select date" value="Oct 24, 2026">
  </div>
</div>
```

---

## 2. CSS Classes

### 2.1 `.form-group` (wrapper)

| Property | Value | Token |
|---|---|---|
| `display` | `flex` | -- |
| `flex-direction` | `column` | -- |
| `gap` | `var(--space-1)` | `4px` |

### 2.2 `.form-label`

| Property | Value | Token |
|---|---|---|
| `font-size` | `0.8125rem` | 13px |
| `font-weight` | `550` | -- |
| `color` | `var(--text-primary)` | -- |

### 2.3 `.form-hint`

| Property | Value | Token |
|---|---|---|
| `font-size` | `0.75rem` | 12px |
| `color` | `var(--text-muted)` | -- |

### 2.4 `.form-error-text`

| Property | Value | Token |
|---|---|---|
| `font-size` | `var(--ui-text-xs)` | `0.75rem` (12px) |
| `color` | `var(--accent-danger)` | -- |

### 2.5 `.input` (the input field)

| Property | Value | Token |
|---|---|---|
| `width` | `100%` | -- |
| `height` | `var(--control-md)` | `36px` |
| `padding` | `0 var(--space-3)` | `0 12px` |
| `font-family` | `var(--font-sans)` | -- |
| `font-size` | `var(--ui-text-md)` | `0.875rem` (14px) |
| `color` | `var(--text-primary)` | -- |
| `background` | `var(--bg-surface)` | -- |
| `border` | `2px solid var(--border-default)` | -- |
| `border-radius` | `var(--radius-sm)` | `10px` |
| `transition` | `border-color var(--motion-fast) var(--ease-out), box-shadow var(--motion-instant) linear` | -- |
| `box-shadow` | `var(--shadow-sm)` | `2px 2px 0 var(--border-default)` |

Placeholder:

```css
.input::placeholder {
  color: var(--text-muted);
}
```

### 2.6 `.input-error` (error state class)

| Property | Value |
|---|---|
| `border-color` | `var(--accent-danger)` |

Focus override for error state:

```css
.input-error:focus {
  border-color: var(--accent-danger);
  box-shadow: 4px 4px 0 var(--accent-danger);
}
```

### 2.7 `.input:user-invalid` (native validation)

Same styling as `.input-error` -- triggers automatically via CSS `:user-invalid` pseudo-class.

### 2.8 `.input-icon-wrap` (icon input wrapper)

| Property | Value |
|---|---|
| `position` | `relative` |

Child overrides:

```css
.input-icon-wrap .input {
  padding-left: 36px;
}
.input-icon-wrap svg {
  position: absolute;
  left: 12px;
  top: 50%;
  transform: translateY(-50%);
  color: var(--text-muted);
  pointer-events: none;
}
```

---

## 3. States

### 3.1 Default

| Property | Value |
|---|---|
| `border-color` | `var(--border-default)` |
| `box-shadow` | `var(--shadow-sm)` = `2px 2px 0 var(--border-default)` |

### 3.2 Focus

| Property | Value |
|---|---|
| `outline` | `none` (overrides default) |
| `border-color` | `var(--accent-primary)` |
| `box-shadow` | `4px 4px 0 var(--accent-primary)` |

The focus shadow uses the accent-primary color (pink) instead of the neutral border-default, creating a branded focus indicator.

### 3.3 Error

| Property | Value |
|---|---|
| `border-color` | `var(--accent-danger)` |

Error + Focus:

| Property | Value |
|---|---|
| `border-color` | `var(--accent-danger)` |
| `box-shadow` | `4px 4px 0 var(--accent-danger)` |

### 3.4 Disabled

| Property | Value |
|---|---|
| `opacity` | `0.5` |
| `cursor` | `not-allowed` |
| `background` | `var(--bg-subtle)` |

---

## 4. Responsive Behavior

No input-specific responsive breakpoints. Inputs are `width: 100%` and adapt to their container. The form grid layout (e.g., 2-column grid) collapses at `max-width: 768px`.

---

## 5. Accessibility

- Every input must have an associated `<label>` with matching `for`/`id` attributes.
- Error state inputs must have `aria-invalid="true"` and `aria-describedby` pointing to the error message element.
- Error messages should use `role="alert"` for immediate screen reader announcement.
- Disabled inputs use the native `disabled` attribute.
- Placeholder text is not a substitute for labels.
- Icon inputs: the SVG icon should have `aria-hidden="true"` since the label provides the accessible name.
- Focus is managed by the `:focus` pseudo-class (not `:focus-visible`) because text inputs always show focus styling.

---

## 6. Token Dependencies

### Tier 2 (Semantic)

- `--border-default`, `--bg-surface`, `--bg-subtle`
- `--text-primary`, `--text-muted`
- `--accent-primary` (focus border and shadow)
- `--accent-danger` (error border and shadow)
- `--shadow-sm` (`2px 2px 0 var(--border-default)`)

### Tier 3 (Component)

- `--control-md` (`36px`)
- `--space-1` (`4px`), `--space-3` (`12px`)
- `--font-sans`
- `--ui-text-md` (`0.875rem`), `--ui-text-xs` (`0.75rem`)
- `--radius-sm` (`10px`)
- `--motion-fast` (`160ms`), `--motion-instant` (`100ms`)
- `--ease-out`

---

## 7. Test Specification

### 7.1 Computed Style Assertions

- `.input` has `height: 36px`
- `.input` has `border-radius` resolving to `10px`
- `.input` has `border: 2px solid` with color matching `--border-default`
- `.input` has `font-size` resolving to approximately `14px`
- `.input` has `box-shadow` matching `--shadow-sm`
- `.input::placeholder` color matches `--text-muted`

### 7.2 Interaction Assertions

- `.input:focus` has `border-color` matching `--accent-primary` and `box-shadow: 4px 4px 0` with matching color
- `.input.input-error` has `border-color` matching `--accent-danger`
- `.input.input-error:focus` has `box-shadow: 4px 4px 0` with color matching `--accent-danger`
- `.input:disabled` has `opacity: 0.5` and `cursor: not-allowed`

### 7.3 Visual Regression Scenarios

- Default input with value (light mode)
- Empty input with placeholder
- Input in focus state
- Input in error state (with error message)
- Input in error + focus state
- Disabled input
- Icon input variant
- All states in dark mode

### 7.4 Reduced Motion Compliance

- With `prefers-reduced-motion: reduce`, border-color and box-shadow transitions resolve in 0.01ms

---

## 8. Implementation CSS

```css
@layer component {
  .form-group {
    display: flex;
    flex-direction: column;
    gap: var(--space-1);
  }

  .form-label {
    font-size: 0.8125rem;
    font-weight: 550;
    color: var(--text-primary);
  }

  .form-hint {
    font-size: 0.75rem;
    color: var(--text-muted);
  }

  .form-error-text {
    font-size: var(--ui-text-xs);
    color: var(--accent-danger);
  }

  .input {
    width: 100%;
    height: var(--control-md);
    padding: 0 var(--space-3);
    font-family: var(--font-sans);
    font-size: var(--ui-text-md);
    color: var(--text-primary);
    background: var(--bg-surface);
    border: 2px solid var(--border-default);
    border-radius: var(--radius-sm);
    transition: border-color var(--motion-fast) var(--ease-out),
                box-shadow var(--motion-instant) linear;
    box-shadow: var(--shadow-sm);
  }

  .input::placeholder {
    color: var(--text-muted);
  }

  .input:focus {
    outline: none;
    border-color: var(--accent-primary);
    box-shadow: 4px 4px 0 var(--accent-primary);
  }

  .input:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    background: var(--bg-subtle);
  }

  .input-error,
  .input:user-invalid {
    border-color: var(--accent-danger);
  }

  .input-error:focus,
  .input:user-invalid:focus {
    border-color: var(--accent-danger);
    box-shadow: 4px 4px 0 var(--accent-danger);
  }

  .input-icon-wrap {
    position: relative;
  }
  .input-icon-wrap .input {
    padding-left: 36px;
  }
  .input-icon-wrap svg {
    position: absolute;
    left: 12px;
    top: 50%;
    transform: translateY(-50%);
    color: var(--text-muted);
    pointer-events: none;
  }
}
```
