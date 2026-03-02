# Textarea

> Multi-line text input with the same border/shadow treatment as the single-line input. Supports vertical resize and `field-sizing: content` for automatic height adjustment. Focus state uses the branded pink shadow.

Cross-references: [[input]] (shares identical border, shadow, and focus treatment), [[shadows]] (uses `--shadow-sm`), [[radius]] (uses `--radius-sm`).

Visual reference: Section "05 -- Components", subsection "Textarea" in `design-reference.html` (lines ~5600-5606).

---

## 1. HTML Structure

### 1.1 Basic Textarea

```html
<div class="form-group">
  <label class="form-label" for="form-description">Description</label>
  <textarea class="textarea" id="form-description" rows="3">A design system built with warm boldness and confident color.</textarea>
</div>
```

---

## 2. CSS Classes

### 2.1 `.textarea`

| Property | Value | Token |
|---|---|---|
| `height` | `auto` | Overrides fixed control height |
| `min-height` | `80px` | Minimum visible area |
| `padding` | `var(--space-3)` | `12px` all sides |
| `resize` | `vertical` | User can resize vertically |
| `field-sizing` | `content` | Auto-sizes based on content (progressive enhancement) |
| `font-family` | `var(--font-sans)` | -- |
| `font-size` | `0.875rem` | 14px |
| `color` | `var(--text-primary)` | -- |
| `background` | `var(--bg-surface)` | -- |
| `border` | `2px solid var(--border-default)` | -- |
| `border-radius` | `var(--radius-sm)` | `10px` |
| `line-height` | `1.5` | -- |
| `transition` | `border-color var(--motion-fast) var(--ease-out), box-shadow var(--motion-instant) linear` | -- |
| `box-shadow` | `var(--shadow-sm)` | `2px 2px 0 var(--border-default)` |

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

### 3.3 Disabled

The textarea does not have explicit disabled styling in the reference, but inherits from `.input:disabled` patterns when the `disabled` attribute is applied.

---

## 4. Responsive Behavior

No textarea-specific responsive breakpoints. The textarea is `width: auto` (determined by container) with vertical resize. The `field-sizing: content` property is a progressive enhancement -- browsers that do not support it fall back to the explicit `rows` attribute.

---

## 5. Accessibility

- Every textarea must have an associated `<label>` with matching `for`/`id` attributes.
- The `rows` attribute provides an initial visible height hint.
- For error states, use `aria-invalid="true"` and `aria-describedby` pointing to the error message, following the same pattern as `.input`.
- `resize: vertical` allows users to adjust height for comfort; do not use `resize: none` unless there is a strong UX reason.

---

## 6. Token Dependencies

### Tier 2 (Semantic)

- `--border-default`, `--bg-surface`
- `--text-primary`
- `--accent-primary` (focus border and shadow)
- `--shadow-sm`

### Tier 3 (Component)

- `--space-3` (`12px`)
- `--font-sans`
- `--radius-sm` (`10px`)
- `--motion-fast` (`160ms`), `--motion-instant` (`100ms`)
- `--ease-out`

---

## 7. Test Specification

### 7.1 Computed Style Assertions

- `.textarea` has `min-height: 80px`
- `.textarea` has `border-radius` resolving to `10px`
- `.textarea` has `resize: vertical`
- `.textarea` has `box-shadow` matching `--shadow-sm`
- `.textarea` has `line-height: 1.5`
- `.textarea` has `padding` of `12px` on all sides

### 7.2 Interaction Assertions

- `.textarea:focus` has `border-color` matching `--accent-primary` and `box-shadow: 4px 4px 0` with matching color
- `.textarea` is resizable vertically (drag handle present)

### 7.3 Visual Regression Scenarios

- Default textarea with content (light mode)
- Textarea in focus state
- Textarea in dark mode
- Textarea with field-sizing: content (auto-growing with content)

### 7.4 Reduced Motion Compliance

- With `prefers-reduced-motion: reduce`, transitions resolve in 0.01ms

---

## 8. Implementation CSS

```css
@layer component {
  .textarea {
    height: auto;
    min-height: 80px;
    padding: var(--space-3);
    resize: vertical;
    field-sizing: content;
    font-family: var(--font-sans);
    font-size: 0.875rem;
    color: var(--text-primary);
    background: var(--bg-surface);
    border: 2px solid var(--border-default);
    border-radius: var(--radius-sm);
    line-height: 1.5;
    transition: border-color var(--motion-fast) var(--ease-out),
                box-shadow var(--motion-instant) linear;
    box-shadow: var(--shadow-sm);
  }

  .textarea:focus {
    outline: none;
    border-color: var(--accent-primary);
    box-shadow: 4px 4px 0 var(--accent-primary);
  }
}
```
