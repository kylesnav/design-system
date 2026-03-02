# Select

> Custom-styled dropdown select with a custom arrow indicator. Uses the same border/shadow treatment as the input component -- `--shadow-sm` at rest, pink focus border and shadow escalation. Native `<select>` with `appearance: none` for visual control.

Cross-references: [[input]] (shares identical border, shadow, and focus treatment), [[shadows]] (uses `--shadow-sm`), [[radius]] (uses `--radius-sm`), [[typography]] (uses `--ui-text-md`).

Visual reference: Section "05 -- Components", subsection "Select, Date & Tags" in `design-reference.html` (lines ~5557-5581).

---

## 1. HTML Structure

### 1.1 Basic Select

```html
<div class="form-group">
  <label class="form-label" for="form-project-type">Project type</label>
  <div class="select-wrap">
    <select class="select" id="form-project-type">
      <option>Web Application</option>
      <option>Marketing Site</option>
      <option>Dashboard</option>
      <option>Mobile App</option>
    </select>
    <span class="select-arrow">
      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
        <polyline points="6 9 12 15 18 9" />
      </svg>
    </span>
  </div>
</div>
```

---

## 2. CSS Classes

### 2.1 `.select-wrap` (positioning container)

| Property | Value |
|---|---|
| `position` | `relative` |

### 2.2 `.select`

| Property | Value | Token |
|---|---|---|
| `appearance` | `none` | Removes native browser styling |
| `width` | `100%` | -- |
| `height` | `var(--control-md)` | `36px` |
| `padding` | `0 32px 0 var(--space-3)` | Right padding accommodates arrow |
| `font-family` | `var(--font-sans)` | -- |
| `font-size` | `var(--ui-text-md)` | `0.875rem` (14px) |
| `color` | `var(--text-primary)` | -- |
| `background` | `var(--bg-surface)` | -- |
| `border` | `2px solid var(--border-default)` | -- |
| `border-radius` | `var(--radius-sm)` | `10px` |
| `cursor` | `pointer` | -- |
| `transition` | `border-color var(--motion-fast) var(--ease-out), box-shadow var(--motion-instant) linear` | -- |
| `box-shadow` | `var(--shadow-sm)` | `2px 2px 0 var(--border-default)` |

### 2.3 `.select-arrow`

| Property | Value |
|---|---|
| `position` | `absolute` |
| `right` | `10px` |
| `top` | `50%` |
| `transform` | `translateY(-50%)` |
| `pointer-events` | `none` |
| `color` | `var(--text-muted)` |

---

## 3. States

### 3.1 Default

| Property | Value |
|---|---|
| `border-color` | `var(--border-default)` |
| `box-shadow` | `var(--shadow-sm)` |

### 3.2 Focus

| Property | Value |
|---|---|
| `outline` | `none` |
| `border-color` | `var(--accent-primary)` |
| `box-shadow` | `4px 4px 0 var(--accent-primary)` |

---

## 4. Responsive Behavior

No select-specific responsive breakpoints. Selects are `width: 100%` and adapt to their container.

---

## 5. Accessibility

- Every select must have an associated `<label>` with matching `for`/`id` attributes.
- The custom arrow SVG has `aria-hidden="true"` and `pointer-events: none` -- it is purely decorative.
- Native `<select>` maintains keyboard accessibility (arrow keys, Enter, Escape).
- The `.select-wrap` wrapper does not require ARIA attributes -- it is for positioning only.

---

## 6. Token Dependencies

### Tier 2 (Semantic)

- `--border-default`, `--bg-surface`
- `--text-primary`, `--text-muted`
- `--accent-primary` (focus border and shadow)
- `--shadow-sm`

### Tier 3 (Component)

- `--control-md` (`36px`)
- `--space-3` (`12px`)
- `--font-sans`
- `--ui-text-md` (`0.875rem`)
- `--radius-sm` (`10px`)
- `--motion-fast` (`160ms`), `--motion-instant` (`100ms`)
- `--ease-out`

---

## 7. Test Specification

### 7.1 Computed Style Assertions

- `.select` has `appearance: none`
- `.select` has `height: 36px`
- `.select` has `border-radius` resolving to `10px`
- `.select` has `cursor: pointer`
- `.select` has `box-shadow` matching `--shadow-sm`
- `.select-arrow` has `pointer-events: none`

### 7.2 Interaction Assertions

- `.select:focus` has `border-color` matching `--accent-primary` and `box-shadow: 4px 4px 0` with matching color
- Select opens native dropdown on click/keyboard

### 7.3 Visual Regression Scenarios

- Default select with options (light mode)
- Select in focus state
- Select in dark mode
- Select with custom arrow indicator visible

### 7.4 Reduced Motion Compliance

- Transitions resolve in 0.01ms with `prefers-reduced-motion: reduce`

---

## 8. Implementation CSS

```css
@layer component {
  .select-wrap {
    position: relative;
  }

  .select {
    appearance: none;
    width: 100%;
    height: var(--control-md);
    padding: 0 32px 0 var(--space-3);
    font-family: var(--font-sans);
    font-size: var(--ui-text-md);
    color: var(--text-primary);
    background: var(--bg-surface);
    border: 2px solid var(--border-default);
    border-radius: var(--radius-sm);
    cursor: pointer;
    transition: border-color var(--motion-fast) var(--ease-out),
                box-shadow var(--motion-instant) linear;
    box-shadow: var(--shadow-sm);
  }

  .select:focus {
    outline: none;
    border-color: var(--accent-primary);
    box-shadow: 4px 4px 0 var(--accent-primary);
  }

  .select-arrow {
    position: absolute;
    right: 10px;
    top: 50%;
    transform: translateY(-50%);
    pointer-events: none;
    color: var(--text-muted);
  }
}
```
