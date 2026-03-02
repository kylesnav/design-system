# Multi-Select

> Tag-based selection input with removable tags and an inline text input for adding more. Tags display as pills with a close button. The container shares the same border/shadow treatment as single-line inputs, with focus-within triggering the branded pink shadow.

Cross-references: [[input]] (shares border, shadow, and focus treatment), [[badge]] (tags share the pill shape), [[radius]] (uses `--radius-sm` for container, `--radius-full` for tags), [[typography]] (uses `--ui-text-xs`, `--ui-text-md`).

Visual reference: Section "05 -- Components", subsection "Select, Date & Tags" in `design-reference.html` (lines ~5582-5596).

---

## 1. HTML Structure

### 1.1 Multi-Select with Tags

```html
<div class="form-group">
  <label class="form-label" for="form-tags">Tags</label>
  <div class="multi-select">
    <span class="multi-select-tag">Design<button aria-label="Remove Design tag"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg></button></span>
    <span class="multi-select-tag">Engineering<button aria-label="Remove Engineering tag"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg></button></span>
    <input id="form-tags" type="text" placeholder="Add..." class="multi-select-input">
  </div>
</div>
```

---

## 2. CSS Classes

### 2.1 `.multi-select` (container)

| Property | Value | Token |
|---|---|---|
| `display` | `flex` | -- |
| `flex-wrap` | `wrap` | Tags wrap to next line |
| `gap` | `var(--space-1-5)` | `6px` |
| `min-height` | `var(--control-md)` | `36px` |
| `padding` | `var(--space-1-5) var(--space-3)` | `6px 12px` |
| `background` | `var(--bg-surface)` | -- |
| `border` | `2px solid var(--border-default)` | -- |
| `border-radius` | `var(--radius-sm)` | `10px` |
| `align-items` | `center` | -- |
| `transition` | `border-color var(--motion-fast) var(--ease-out), box-shadow var(--motion-instant) linear` | -- |
| `box-shadow` | `var(--shadow-sm)` | `2px 2px 0 var(--border-default)` |

Focus-within state:

```css
.multi-select:focus-within {
  border-color: var(--accent-primary);
  box-shadow: 4px 4px 0 var(--accent-primary);
}
```

### 2.2 `.multi-select-tag` (removable tag pill)

| Property | Value | Token |
|---|---|---|
| `display` | `inline-flex` | -- |
| `align-items` | `center` | -- |
| `gap` | `4px` | -- |
| `background` | `var(--bg-muted)` | -- |
| `padding` | `2px 8px` | -- |
| `border-radius` | `var(--radius-full)` | `9999px` |
| `font-size` | `var(--ui-text-xs)` | `0.75rem` (12px) |
| `color` | `var(--text-primary)` | -- |

### 2.3 Tag remove button (`.multi-select-tag button`)

| Property | Value | Token |
|---|---|---|
| `background` | `none` | -- |
| `border` | `none` | -- |
| `color` | `var(--text-muted)` | -- |
| `cursor` | `pointer` | -- |
| `display` | `flex` | -- |
| `padding` | `0` | -- |
| `transition` | `transform var(--motion-instant) linear, color var(--motion-fast) var(--ease-out)` | -- |

Hover: `color: var(--text-primary)`
Active: `transform: scale(0.85)`

### 2.4 `.multi-select-input` (inline text input)

| Property | Value | Token |
|---|---|---|
| `border` | `none` | -- |
| `background` | `transparent` | -- |
| `outline` | `none` | -- |
| `font-size` | `var(--ui-text-md)` | `0.875rem` (14px) |
| `font-family` | `var(--font-sans)` | -- |
| `color` | `var(--text-primary)` | -- |
| `flex` | `1` | Takes remaining space |
| `min-width` | `60px` | Ensures input is always visible |

---

## 3. States

### 3.1 Default

| Property | Value |
|---|---|
| `border-color` | `var(--border-default)` |
| `box-shadow` | `var(--shadow-sm)` |

### 3.2 Focus-within (when the inline input is focused)

| Property | Value |
|---|---|
| `border-color` | `var(--accent-primary)` |
| `box-shadow` | `4px 4px 0 var(--accent-primary)` |

### 3.3 Tag Remove Button Hover

| Property | Value |
|---|---|
| `color` | `var(--text-primary)` |

### 3.4 Tag Remove Button Active

| Property | Value |
|---|---|
| `transform` | `scale(0.85)` |

---

## 4. Responsive Behavior

No multi-select-specific responsive breakpoints. Tags wrap naturally via `flex-wrap: wrap`. The container adapts to its parent width.

---

## 5. Accessibility

- The container should have `role="group"` with `aria-label="Selected tags"` or similar.
- Each tag remove button must have `aria-label="Remove [tag name] tag"` for screen readers.
- The SVG close icon has `aria-hidden="true"`.
- The inline input should have a visible label (via `.form-label` with matching `for`/`id`) or `aria-label`.
- When a tag is removed, focus should return to the inline input or the next logical element.
- Keyboard: users should be able to navigate tags with arrow keys and remove with Backspace or Delete (requires JavaScript).

---

## 6. Token Dependencies

### Tier 2 (Semantic)

- `--border-default`, `--bg-surface`, `--bg-muted`
- `--text-primary`, `--text-muted`
- `--accent-primary` (focus border and shadow)
- `--shadow-sm`

### Tier 3 (Component)

- `--control-md` (`36px`)
- `--space-1-5` (`6px`), `--space-3` (`12px`)
- `--font-sans`
- `--ui-text-xs` (`0.75rem`), `--ui-text-md` (`0.875rem`)
- `--radius-sm` (`10px`), `--radius-full` (`9999px`)
- `--motion-fast` (`160ms`), `--motion-instant` (`100ms`)
- `--ease-out`

---

## 7. Test Specification

### 7.1 Computed Style Assertions

- `.multi-select` has `border-radius` resolving to `10px`
- `.multi-select` has `flex-wrap: wrap`
- `.multi-select-tag` has `border-radius: 9999px`
- `.multi-select-tag` has `font-size` resolving to approximately `12px`
- `.multi-select-input` has `border: none` and `background: transparent`

### 7.2 Interaction Assertions

- `.multi-select:focus-within` has `border-color` matching `--accent-primary` and `box-shadow: 4px 4px 0`
- Tag remove button hover changes color to `--text-primary`
- Tag remove button active has `transform: scale(0.85)`

### 7.3 Visual Regression Scenarios

- Multi-select with 2 tags and input (light mode)
- Multi-select in focus-within state
- Multi-select with many tags (wrapping behavior)
- Dark mode comparison
- Tag remove button hover state

### 7.4 Reduced Motion Compliance

- Transitions resolve in 0.01ms with `prefers-reduced-motion: reduce`

---

## 8. Implementation CSS

```css
@layer component {
  .multi-select {
    display: flex;
    flex-wrap: wrap;
    gap: var(--space-1-5);
    min-height: var(--control-md);
    padding: var(--space-1-5) var(--space-3);
    background: var(--bg-surface);
    border: 2px solid var(--border-default);
    border-radius: var(--radius-sm);
    align-items: center;
    transition: border-color var(--motion-fast) var(--ease-out),
                box-shadow var(--motion-instant) linear;
    box-shadow: var(--shadow-sm);
  }

  .multi-select:focus-within {
    border-color: var(--accent-primary);
    box-shadow: 4px 4px 0 var(--accent-primary);
  }

  .multi-select-tag {
    display: inline-flex;
    align-items: center;
    gap: 4px;
    background: var(--bg-muted);
    padding: 2px 8px;
    border-radius: var(--radius-full);
    font-size: var(--ui-text-xs);
    color: var(--text-primary);
  }

  .multi-select-tag button {
    background: none;
    border: none;
    color: var(--text-muted);
    cursor: pointer;
    display: flex;
    padding: 0;
    transition: transform var(--motion-instant) linear,
                color var(--motion-fast) var(--ease-out);
  }

  .multi-select-tag button:hover {
    color: var(--text-primary);
  }

  .multi-select-tag button:active {
    transform: scale(0.85);
  }

  .multi-select-input {
    border: none;
    background: transparent;
    outline: none;
    font-size: var(--ui-text-md);
    font-family: var(--font-sans);
    color: var(--text-primary);
    flex: 1;
    min-width: 60px;
  }
}
```
