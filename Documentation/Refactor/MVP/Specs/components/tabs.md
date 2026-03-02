---
title: "Tabs"
date: 2026-03-02
type: spec
scope: mvp
status: active
---

# Tabs

> Horizontal tab bar with underline active indicator and accent-primary color. Tabs switch between content panels with immediate visual feedback via border-bottom highlight.

Cross-references: [[segmented-control]] (alternative for mode-switching vs content navigation), [[token-tiers]] (spacing, typography, motion tokens).

Visual reference: Section "05 -- Components", subsection "Navigation > Tabs" in `design-reference.html` (lines ~2593-2625 CSS, lines ~5929-5932 HTML).

---

## 1. HTML Structure

```html
<div class="tabs">
  <button class="tab active">Overview</button>
  <button class="tab">Components</button>
  <button class="tab">Tokens</button>
  <button class="tab">Motion</button>
</div>
```

---

## 2. CSS Classes

### 2.1 `.tabs` (container)

| Property | Value | Token |
|---|---|---|
| `display` | `flex` | -- |
| `gap` | `0` | -- |
| `border-bottom` | `2px solid var(--border-subtle)` | `--border-subtle` |

### 2.2 `.tab` (individual tab)

| Property | Value | Token |
|---|---|---|
| `padding` | `var(--space-3) var(--space-4)` | `12px 16px` |
| `font-size` | `0.875rem` | `--ui-text-md` = `14px` |
| `font-weight` | `500` | -- |
| `color` | `var(--text-secondary)` | -- |
| `cursor` | `pointer` | -- |
| `border` | `none` | -- |
| `background` | `none` | -- |
| `border-bottom` | `2px solid transparent` | -- |
| `margin-bottom` | `-1px` | Overlaps container border for seamless active line |
| `font-family` | `var(--font-sans)` | -- |
| `transition` | `transform var(--motion-instant) linear, color var(--motion-fast) var(--ease-out), border-color var(--motion-fast) var(--ease-out)` | -- |

---

## 3. States

| State | CSS Changes |
|---|---|
| Default | `color: var(--text-secondary); border-bottom-color: transparent` |
| Hover | `color: var(--text-primary)` |
| Active (pressed) | `transform: translateY(1px)` |
| Active tab (`.active`) | `color: var(--accent-primary); border-bottom-color: var(--accent-primary); font-weight: 600` |

---

## 4. Variants

No color or size variants exist in the reference. A single style with the accent-primary underline indicator.

---

## 5. Responsive Behavior

### Touch targets (`@media (pointer: coarse)`):

- `.tab` gets `min-height: 44px; min-width: 44px`

At narrow viewports, tabs remain horizontal and scroll horizontally if they overflow (via the parent container).

---

## 6. Accessibility

- Tabs should use `role="tablist"` on the container and `role="tab"` on each tab button for proper ARIA semantics
- Active tab should have `aria-selected="true"`, inactive tabs `aria-selected="false"`
- Associated tab panels should use `role="tabpanel"` with `aria-labelledby` pointing to the corresponding tab
- Keyboard: Arrow keys should move between tabs, Enter/Space to activate
- The current reference uses simple `.active` class toggling -- implementing agents should add ARIA roles

---

## 7. Token Dependencies

### Tier 2 (Semantic)

- `--text-secondary`, `--text-primary`
- `--accent-primary`
- `--border-subtle`

### Tier 3 (Component)

- `--space-3` (`12px`), `--space-4` (`16px`)
- `--font-sans`
- `--ui-text-md` (`14px`)
- `--motion-instant` (`100ms`), `--motion-fast` (`160ms`)
- `--ease-out`

---

## 8. Test Specification

### 8.1 Computed Style Assertions

- `.tabs` has `border-bottom: 2px solid` with color matching `--border-subtle`
- `.tab` has `font-size` resolving to `14px`
- `.tab.active` has `color` matching `--accent-primary` and `border-bottom-color` matching `--accent-primary`
- `.tab.active` has `font-weight: 600`
- `.tab` (non-active) has `border-bottom-color: transparent`

### 8.2 Interaction Assertions

- Clicking a `.tab` should toggle `.active` class (via JS)
- `.tab:hover` changes color to `--text-primary`

### 8.3 Visual Regression Scenarios

- Tab bar with first tab active (light mode)
- Tab bar with first tab active (dark mode)
- Tab bar with second tab active

### 8.4 Reduced Motion Compliance

- With `prefers-reduced-motion: reduce`, all transitions complete in 0.01ms

## Implementation CSS

```css
@layer component {
  .tabs {
    display: flex;
    gap: 0;
    border-bottom: 2px solid var(--border-default);
  }
  .tab {
    padding: var(--space-3) var(--space-5);
    border: none;
    background: transparent;
    color: var(--text-secondary);
    font-weight: 600;
    font-size: 0.875rem;
    cursor: pointer;
    position: relative;
    transition: color var(--motion-fast) var(--ease-out);
  }
  .tab::after {
    content: '';
    position: absolute;
    bottom: -2px;
    left: 0;
    width: 100%;
    height: 2px;
    background: transparent;
    transition: background var(--motion-fast) var(--ease-out);
  }
  .tab:hover { color: var(--text-primary); }
  .tab.active {
    color: var(--accent-primary);
  }
  .tab.active::after { background: var(--accent-primary); }
}
```
