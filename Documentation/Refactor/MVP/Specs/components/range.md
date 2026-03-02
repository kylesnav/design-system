---
title: "Range"
date: 2026-03-02
type: spec
scope: mvp
status: active
---

# Range

> Custom-styled range slider with an accent-colored thumb, thin track, and cross-browser support (WebKit and Firefox). Used for numeric value selection within a bounded range. Often paired with a value display and min/max labels.

Cross-references: [[token-tiers]] (accent-primary for thumb), [[radius]] (uses `--radius-full` for track).

Visual reference: Section "05 -- Components", subsection "Range Slider" in `design-reference.html` (lines ~5633-5648).

---

## 1. HTML Structure

### 1.1 Range Slider with Label and Value Display

```html
<div class="slider-group">
  <div class="slider-header">
    <label class="form-label" for="form-volume">Volume</label>
    <span class="slider-value" id="form-volume-val">65</span>
  </div>
  <input id="form-volume" type="range" class="range" min="0" max="100" value="65"
    oninput="document.getElementById('form-volume-val').textContent = this.value">
  <div class="slider-labels">
    <span>0</span>
    <span>50</span>
    <span>100</span>
  </div>
</div>
```

### 1.2 Minimal Range (no labels)

```html
<input type="range" class="range" min="0" max="100" value="50">
```

---

## 2. CSS Classes

### 2.1 `.range` (the input element)

| Property | Value | Token |
|---|---|---|
| `-webkit-appearance` | `none` | Removes native styling |
| `appearance` | `none` | -- |
| `width` | `100%` | -- |
| `height` | `4px` | Track height |
| `border-radius` | `var(--radius-full)` | `9999px` |
| `background` | `var(--border-default)` | Track color |
| `outline` | `none` | -- |

### 2.2 WebKit Thumb (`::-webkit-slider-thumb`)

| Property | Value | Token |
|---|---|---|
| `-webkit-appearance` | `none` | -- |
| `width` | `18px` | -- |
| `height` | `18px` | -- |
| `border-radius` | `50%` | Circle |
| `background` | `var(--accent-primary)` | Pink accent |
| `cursor` | `pointer` | -- |
| `border` | `2px solid var(--bg-surface)` | White border ring |
| `box-shadow` | `0 1px 4px oklch(0 0 0 / 0.15)` | Subtle elevation |

### 2.3 Firefox Thumb (`::-moz-range-thumb`)

| Property | Value | Token |
|---|---|---|
| `width` | `18px` | -- |
| `height` | `18px` | -- |
| `border-radius` | `50%` | Circle |
| `background` | `var(--accent-primary)` | Pink accent |
| `cursor` | `pointer` | -- |
| `border` | `2px solid var(--bg-surface)` | White border ring |
| `box-shadow` | `0 1px 4px oklch(0 0 0 / 0.15)` | Subtle elevation |

### 2.4 Firefox Track (`::-moz-range-track`)

| Property | Value | Token |
|---|---|---|
| `height` | `4px` | -- |
| `border-radius` | `var(--radius-full)` | `9999px` |
| `background` | `var(--border-default)` | -- |

### 2.5 `.slider-group` (layout wrapper)

| Property | Value | Token |
|---|---|---|
| `display` | `flex` | -- |
| `flex-direction` | `column` | -- |
| `gap` | `var(--space-2)` | `8px` |

### 2.6 `.slider-header`

| Property | Value |
|---|---|
| `display` | `flex` |
| `align-items` | `baseline` |
| `justify-content` | `space-between` |

### 2.7 `.slider-labels`

| Property | Value | Token |
|---|---|---|
| `display` | `flex` | -- |
| `justify-content` | `space-between` | -- |
| `font-size` | `var(--ui-text-xs)` | `0.75rem` (12px) |
| `color` | `var(--text-muted)` | -- |

### 2.8 `.slider-value`

| Property | Value | Token |
|---|---|---|
| `font-size` | `var(--ui-text-sm)` | `0.8125rem` (13px) |
| `font-weight` | `600` | -- |
| `font-variant-numeric` | `tabular-nums` | Fixed-width digits |
| `color` | `var(--accent-primary)` | Pink accent |
| `min-width` | `3ch` | Prevents layout shift |
| `text-align` | `right` | -- |

---

## 3. States

The range slider has limited CSS state control due to browser handling:

### 3.1 Default

Track is `var(--border-default)` colored, thumb is `var(--accent-primary)`.

### 3.2 Focus

Browser default focus handling (outline removed). For accessibility, the thumb should show a focus indicator. Consider adding:

```css
.range:focus-visible::-webkit-slider-thumb {
  outline: 2px solid var(--focus-ring);
  outline-offset: 2px;
}
```

### 3.3 Dragging

Browser handles the drag interaction natively. The thumb tracks the pointer.

---

## 4. Responsive Behavior

No range-specific responsive breakpoints. The range is `width: 100%` and adapts to its container width.

---

## 5. Accessibility

- The `<input type="range">` has native slider semantics (`role="slider"`).
- Associate a `<label>` with the input using `for`/`id`.
- The `min`, `max`, and `value` attributes communicate the range to assistive technology.
- The `.slider-value` display is visual -- for screen readers, the native input value is sufficient.
- Keyboard: Left/Right arrow keys adjust the value; Home/End jump to min/max.
- The `oninput` handler updates the visual display -- ensure the update is also reflected in `aria-valuenow` (the native input handles this automatically).

---

## 6. Token Dependencies

### Tier 2 (Semantic)

- `--border-default` (track color)
- `--accent-primary` (thumb color, value display color)
- `--bg-surface` (thumb border ring)
- `--text-muted` (label colors)

### Tier 3 (Component)

- `--radius-full` (`9999px`)
- `--space-2` (`8px`)
- `--ui-text-xs` (`0.75rem`), `--ui-text-sm` (`0.8125rem`)

### Hardcoded Values

- Track height: `4px`
- Thumb dimensions: `18px` x `18px`
- Thumb border: `2px solid var(--bg-surface)`
- Thumb shadow: `0 1px 4px oklch(0 0 0 / 0.15)` (non-zero blur -- exception to the zero-blur shadow rule, used only on this small thumb element for physical presence)

---

## 7. Shadow Exception Note

The range thumb uses a subtle blurred shadow (`0 1px 4px oklch(0 0 0 / 0.15)`), which is an exception to the system's zero-blur neo-brutalist shadow rule. This is the same approach used by the toggle knob. Both use a tiny blurred shadow to give small circular elements physical presence that the hard-edged shadows would not achieve at this scale.

---

## 8. Test Specification

### 8.1 Computed Style Assertions

- `.range` has `appearance: none`
- `.range` has `height: 4px`
- `.range` has `border-radius: 9999px`
- `.range` background matches `--border-default` resolved value
- `.range::-webkit-slider-thumb` has `width: 18px`, `height: 18px`, `border-radius: 50%`
- `.range::-webkit-slider-thumb` background matches `--accent-primary` resolved value
- `.slider-value` color matches `--accent-primary`

### 8.2 Interaction Assertions

- Dragging the thumb updates the value
- Keyboard arrow keys increment/decrement the value
- `.slider-value` text updates on input change (requires JavaScript)

### 8.3 Visual Regression Scenarios

- Range at value 0, 50, and 100 (light mode)
- Range with full slider-group (header, labels, value display)
- Dark mode comparison
- Range at narrow width (320px container)

### 8.4 Reduced Motion Compliance

No CSS animations on this component -- no motion assertions needed. The drag interaction is native and not affected by `prefers-reduced-motion`.

---

## 9. Implementation CSS

```css
@layer component {
  .range {
    -webkit-appearance: none;
    appearance: none;
    width: 100%;
    height: 4px;
    border-radius: var(--radius-full);
    background: var(--border-default);
    outline: none;
  }

  .range::-webkit-slider-thumb {
    -webkit-appearance: none;
    width: 18px;
    height: 18px;
    border-radius: 50%;
    background: var(--accent-primary);
    cursor: pointer;
    border: 2px solid var(--bg-surface);
    box-shadow: 0 1px 4px oklch(0 0 0 / 0.15);
  }

  .range::-moz-range-thumb {
    width: 18px;
    height: 18px;
    border-radius: 50%;
    background: var(--accent-primary);
    cursor: pointer;
    border: 2px solid var(--bg-surface);
    box-shadow: 0 1px 4px oklch(0 0 0 / 0.15);
  }

  .range::-moz-range-track {
    height: 4px;
    border-radius: var(--radius-full);
    background: var(--border-default);
  }

  .slider-group {
    display: flex;
    flex-direction: column;
    gap: var(--space-2);
  }

  .slider-header {
    display: flex;
    align-items: baseline;
    justify-content: space-between;
  }

  .slider-labels {
    display: flex;
    justify-content: space-between;
    font-size: var(--ui-text-xs);
    color: var(--text-muted);
  }

  .slider-value {
    font-size: var(--ui-text-sm);
    font-weight: 600;
    font-variant-numeric: tabular-nums;
    color: var(--accent-primary);
    min-width: 3ch;
    text-align: right;
  }
}
```
