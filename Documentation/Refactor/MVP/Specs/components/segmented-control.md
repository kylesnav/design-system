---
title: "Segmented Control"
date: 2026-03-02
type: spec
scope: mvp
status: active
---

# Segmented Control

> Mode-switching control for toggling between mutually exclusive views. Pill-shaped container with button items; the active item inverts to a filled background. Distinct from tabs -- used for filtering or display mode, not navigating between content panels.

Cross-references: [[tabs]] (tabs navigate content panels; segmented control switches display modes), [[token-tiers]] (spacing, typography, radius, motion tokens).

Visual reference: Section "05 -- Components", subsection "Segmented Control" in `design-reference.html` (lines ~2434-2470 CSS, lines ~5847-5857 HTML).

---

## 1. HTML Structure

### 1.1 Three-item variant (View Mode)

```html
<div class="segmented-control" role="group" aria-label="View mode">
  <button class="segmented-control-item" aria-pressed="true" onclick="this.parentElement.querySelectorAll('.segmented-control-item').forEach(b=>b.setAttribute('aria-pressed','false'));this.setAttribute('aria-pressed','true')">Grid</button>
  <button class="segmented-control-item" aria-pressed="false" onclick="this.parentElement.querySelectorAll('.segmented-control-item').forEach(b=>b.setAttribute('aria-pressed','false'));this.setAttribute('aria-pressed','true')">List</button>
  <button class="segmented-control-item" aria-pressed="false" onclick="this.parentElement.querySelectorAll('.segmented-control-item').forEach(b=>b.setAttribute('aria-pressed','false'));this.setAttribute('aria-pressed','true')">Table</button>
</div>
```

### 1.2 Four-item variant (Time Range)

```html
<div class="segmented-control" role="group" aria-label="Time range">
  <button class="segmented-control-item" aria-pressed="false">Day</button>
  <button class="segmented-control-item" aria-pressed="true">Week</button>
  <button class="segmented-control-item" aria-pressed="false">Month</button>
  <button class="segmented-control-item" aria-pressed="false">Year</button>
</div>
```

---

## 2. CSS Classes

### 2.1 `.segmented-control` (container)

| Property | Value | Token |
|---|---|---|
| `display` | `inline-flex` | -- |
| `background` | `var(--bg-surface)` | -- |
| `border` | `2px solid var(--border-default)` | -- |
| `border-radius` | `var(--radius-full)` | `9999px` |
| `padding` | `3px` | -- |
| `gap` | `0` | -- |
| `width` | `fit-content` | -- |

### 2.2 `.segmented-control-item`

| Property | Value | Token |
|---|---|---|
| `padding` | `var(--space-2) var(--space-5)` | `8px 20px` |
| `border-radius` | `var(--radius-full)` | `9999px` |
| `font-size` | `var(--ui-text-sm)` | `13px` |
| `font-weight` | `600` | -- |
| `font-family` | `var(--font-sans)` | -- |
| `color` | `var(--text-muted)` | -- |
| `background` | `transparent` | -- |
| `border` | `2px solid transparent` | -- |
| `cursor` | `pointer` | -- |
| `transition` | `color var(--motion-fast) var(--ease-out), background var(--motion-fast) var(--ease-out), border-color var(--motion-fast) var(--ease-out)` | -- |

---

## 3. States

| State | CSS Changes |
|---|---|
| Default | `color: var(--text-muted); background: transparent; border-color: transparent` |
| Hover | `color: var(--text-primary); background: var(--bg-subtle)` |
| Active item (`[aria-pressed="true"]` or `.active`) | `background: var(--text-primary); color: var(--bg-surface); border-color: var(--text-primary); font-weight: 700` |

Note: The active state inverts the text/background relationship -- `--text-primary` becomes the background and `--bg-surface` becomes the text color. This creates a strong filled appearance.

---

## 4. Variants

No color or size variants. The control adapts to its content width via `fit-content`.

---

## 5. Responsive Behavior

No explicit responsive breakpoints. The control is `inline-flex` with `fit-content` width, so it naturally adapts.

---

## 6. Accessibility

- Container uses `role="group"` with descriptive `aria-label`
- Each item uses `aria-pressed="true"` / `"false"` to communicate toggle state
- Inline `onclick` handlers manage the toggle behavior: deselect all items, then select the clicked one
- Implementing agents should add keyboard support: arrow keys to move between items, Enter/Space to activate

---

## 7. Token Dependencies

### Tier 2 (Semantic)

- `--bg-surface`, `--bg-subtle`
- `--text-primary`, `--text-muted`
- `--border-default`

### Tier 3 (Component)

- `--space-2` (`8px`), `--space-5` (`20px`)
- `--radius-full` (`9999px`)
- `--ui-text-sm` (`13px`)
- `--font-sans`
- `--motion-fast` (`160ms`)
- `--ease-out`

---

## 8. Test Specification

### 8.1 Computed Style Assertions

- `.segmented-control` has `border-radius: 9999px`
- `.segmented-control` has `border: 2px solid` with color matching `--border-default`
- `.segmented-control-item` has `font-size` resolving to `13px`
- `.segmented-control-item[aria-pressed="true"]` has `background` matching `--text-primary` and `color` matching `--bg-surface`
- `.segmented-control-item[aria-pressed="true"]` has `font-weight: 700`

### 8.2 Interaction Assertions

- Clicking an inactive item sets `aria-pressed="true"` on it and `"false"` on all others
- Hover on inactive item shows `background: var(--bg-subtle)`

### 8.3 Visual Regression Scenarios

- 3-item control with first item active (light mode)
- 3-item control with first item active (dark mode)
- 4-item control with second item active
- Hover on inactive item

### 8.4 Reduced Motion Compliance

- With `prefers-reduced-motion: reduce`, all transitions complete in 0.01ms

## Implementation CSS

```css
@layer component {
  .segmented-control {
    display: inline-flex;
    border: 2px solid var(--border-default);
    border-radius: var(--radius-md);
    background: var(--bg-subtle);
    padding: 2px;
    gap: 2px;
  }
  .segmented-control-item {
    padding: var(--space-2) var(--space-4);
    border: none;
    border-radius: calc(var(--radius-md) - 2px);
    background: transparent;
    color: var(--text-secondary);
    font-size: 0.875rem;
    font-weight: 600;
    cursor: pointer;
    transition: background var(--motion-fast) var(--ease-out),
                color var(--motion-fast) var(--ease-out);
  }
  .segmented-control-item:hover { color: var(--text-primary); }
  .segmented-control-item.active {
    background: var(--bg-surface);
    color: var(--text-primary);
    box-shadow: var(--shadow-sm);
  }
}
```
