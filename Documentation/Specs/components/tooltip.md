# Tooltip

> Minimal floating label that appears on hover or focus. Pure CSS implementation -- no JavaScript required. Positioned above the trigger with centered alignment.

Cross-references: [[token-tiers]] (z-index for tooltip layer), [[shadows]] (uses `--shadow-sm`), [[radius]] (uses `--radius-sm`), [[typography]] (uses `--ui-text-2xs`).

Visual reference: Section "Micro-Components & Patterns", subsection "Tooltip" in `design-reference.html` (lines ~6775-6788).

---

## 1. HTML Structure

### 1.1 Tooltip on a Button

```html
<span class="tooltip-wrap">
  <button class="btn btn-sm btn-primary">Hover me<span class="tooltip">Primary action</span></button>
</span>
```

### 1.2 Tooltip on a Secondary Button

```html
<span class="tooltip-wrap">
  <button class="btn btn-sm btn-secondary">Or me<span class="tooltip">Secondary action</span></button>
</span>
```

### 1.3 Tooltip on an Icon Button

```html
<span class="tooltip-wrap">
  <button class="btn btn-sm btn-icon btn-ghost" style="width:var(--control-sm);height:var(--control-sm)">?<span class="tooltip">Help</span></button>
</span>
```

---

## 2. CSS Classes

### 2.1 `.tooltip-wrap` (container)

| Property | Value | Token |
|---|---|---|
| `position` | `relative` | -- |
| `display` | `inline-block` | -- |

Trigger behavior:

```css
.tooltip-wrap:hover .tooltip,
.tooltip-wrap:focus-within .tooltip {
  opacity: 1;
}
```

### 2.2 `.tooltip` (the label itself)

| Property | Value | Token |
|---|---|---|
| `position` | `absolute` | -- |
| `bottom` | `calc(100% + var(--space-2))` | `--space-2: 8px` (gap between trigger and tooltip) |
| `left` | `50%` | -- |
| `transform` | `translateX(-50%)` | Centers horizontally |
| `padding` | `var(--space-1) var(--space-2)` | `4px 8px` |
| `background` | `var(--text-primary)` | Near-black in light, near-white in dark |
| `color` | `var(--bg-surface)` | Inverted -- light text on dark bg |
| `font-size` | `var(--ui-text-2xs)` | `0.6875rem` (11px) |
| `font-weight` | `600` | -- |
| `border-radius` | `var(--radius-sm)` | `10px` |
| `white-space` | `nowrap` | Prevents text wrapping |
| `pointer-events` | `none` | Tooltip does not intercept mouse events |
| `opacity` | `0` | Hidden by default |
| `transition` | `opacity var(--motion-fast) var(--ease-out)` | `160ms cubic-bezier(0.16, 1, 0.3, 1)` |
| `z-index` | `var(--z-tooltip)` | `1500` |
| `box-shadow` | `var(--shadow-sm)` | `2px 2px 0 var(--border-default)` |

---

## 3. Variants

The tooltip component has a single variant. All tooltips appear above the trigger, centered. The reference does not define bottom, left, or right positioned variants.

---

## 4. States

### 4.1 Hidden (default)

| Property | Value |
|---|---|
| `opacity` | `0` |
| `pointer-events` | `none` |

### 4.2 Visible (hover / focus-within)

| Property | Value |
|---|---|
| `opacity` | `1` |

The tooltip becomes visible when:
- The `.tooltip-wrap` is hovered (`:hover .tooltip`)
- Any focusable child within `.tooltip-wrap` receives focus (`:focus-within .tooltip`)

### 4.3 Reduced Motion

When `prefers-reduced-motion: reduce`, `transition-duration` is forced to `0.01ms`, making the tooltip appear/disappear instantly.

---

## 5. Responsive Behavior

No responsive breakpoints. Tooltips are positioned absolutely relative to their wrapper. On narrow viewports, a tooltip may overflow the viewport edge -- this is a known limitation of the CSS-only approach. For production use, consider adding `right: 0; left: auto;` overrides for tooltips near the right viewport edge.

---

## 6. Accessibility

- Tooltips are supplementary labels. The trigger element must have an accessible name independent of the tooltip (e.g., button text or `aria-label`).
- The tooltip itself should have `role="tooltip"` and the trigger should reference it with `aria-describedby`.
- The tooltip uses `pointer-events: none` so it never steals focus or blocks the trigger.
- `:focus-within` ensures keyboard users can trigger the tooltip by tabbing to the trigger element.
- For essential information, do not rely solely on a tooltip -- use visible labels or descriptions instead.

### Recommended Enhanced Markup

```html
<span class="tooltip-wrap">
  <button class="btn btn-sm btn-primary" aria-describedby="tooltip-1">
    Hover me
  </button>
  <span class="tooltip" role="tooltip" id="tooltip-1">Primary action</span>
</span>
```

---

## 7. Token Dependencies

### Tier 2 (Semantic)

- `--text-primary` (tooltip background)
- `--bg-surface` (tooltip text color)
- `--shadow-sm` (`2px 2px 0 var(--border-default)`)
- `--border-default` (via shadow token)

### Tier 3 (Component)

- `--space-1` (`4px`), `--space-2` (`8px`)
- `--ui-text-2xs` (`0.6875rem`)
- `--radius-sm` (`10px`)
- `--motion-fast` (`160ms`)
- `--ease-out` (`cubic-bezier(0.16, 1, 0.3, 1)`)
- `--z-tooltip` (`1500`)

---

## 8. Test Specification

### 8.1 Computed Style Assertions

- `.tooltip` has `opacity: 0` by default
- `.tooltip` has `z-index: 1500`
- `.tooltip` has `position: absolute`
- `.tooltip` has `pointer-events: none`
- `.tooltip` has `border-radius` resolving to `10px`
- `.tooltip` has `font-size` resolving to approximately `11px`
- `.tooltip` background color matches `--text-primary` resolved value

### 8.2 Interaction Assertions

- On `.tooltip-wrap:hover`, `.tooltip` has `opacity: 1`
- On focus of a child element within `.tooltip-wrap`, `.tooltip` has `opacity: 1`
- Tooltip does not intercept pointer events (clicking through tooltip hits the element behind it)

### 8.3 Visual Regression Scenarios

- Tooltip hidden (default state)
- Tooltip visible on button hover (light mode)
- Tooltip visible on button hover (dark mode)
- Tooltip on icon-only button
- Multiple tooltip triggers side-by-side

### 8.4 Reduced Motion Compliance

- With `prefers-reduced-motion: reduce`, tooltip appears instantly (no fade)

---

## 9. Implementation CSS

```css
@layer component {
  .tooltip-wrap {
    position: relative;
    display: inline-block;
  }

  .tooltip-wrap:hover .tooltip,
  .tooltip-wrap:focus-within .tooltip {
    opacity: 1;
  }

  .tooltip {
    position: absolute;
    bottom: calc(100% + var(--space-2));
    left: 50%;
    transform: translateX(-50%);
    padding: var(--space-1) var(--space-2);
    background: var(--text-primary);
    color: var(--bg-surface);
    font-size: var(--ui-text-2xs);
    font-weight: 600;
    border-radius: var(--radius-sm);
    white-space: nowrap;
    pointer-events: none;
    opacity: 0;
    transition: opacity var(--motion-fast) var(--ease-out);
    z-index: var(--z-tooltip);
    box-shadow: var(--shadow-sm);
  }
}
```
