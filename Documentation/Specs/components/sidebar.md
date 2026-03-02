# Sidebar

> Vertical navigation panel with icon+label items, section labels, and accent-primary active state. Items use a light lift/press pattern: `translateY(-1px)` on hover, `translateY(1px)` on active.

Cross-references: [[button]] (lift/press pattern reference -- sidebar uses 1px variant), [[pagination]] (same 1px lift/press), [[token-tiers]] (spacing, typography, radius, motion tokens).

Visual reference: Section "05 -- Components", subsection "Navigation > Sidebar" in `design-reference.html` (lines ~2538-2588 CSS, lines ~5907-5925 HTML).

---

## 1. HTML Structure

```html
<div class="sidebar-demo">
  <div class="sidebar-section-label">Workspace</div>
  <a class="sidebar-item active">
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
      <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
      <polyline points="9 22 9 12 15 12 15 22" />
    </svg> Dashboard
  </a>
  <a class="sidebar-item">
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
    </svg> Team
  </a>
  <a class="sidebar-item">
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
      <circle cx="12" cy="12" r="3" />
      <!-- settings gear path -->
    </svg> Settings
  </a>
</div>
```

---

## 2. CSS Classes

### 2.1 `.sidebar-demo` (container)

| Property | Value | Token |
|---|---|---|
| `width` | `240px` | -- |
| `background` | `var(--bg-surface)` | -- |
| `border` | `2px solid var(--border-default)` | -- |
| `border-radius` | `var(--radius-lg)` | `24px` |
| `padding` | `var(--space-3)` | `12px` |

### 2.2 `.sidebar-section-label`

| Property | Value | Token |
|---|---|---|
| `font-size` | `0.625rem` | `10px` |
| `font-weight` | `600` | -- |
| `letter-spacing` | `0.06em` | -- |
| `text-transform` | `uppercase` | -- |
| `color` | `var(--text-muted)` | -- |
| `padding` | `var(--space-3) var(--space-3) var(--space-1)` | `12px 12px 4px` |

### 2.3 `.sidebar-item`

| Property | Value | Token |
|---|---|---|
| `display` | `flex` | -- |
| `align-items` | `center` | -- |
| `gap` | `var(--space-2)` | `8px` |
| `padding` | `var(--space-2) var(--space-3)` | `8px 12px` |
| `border-radius` | `var(--radius-sm)` | `10px` |
| `font-size` | `0.8125rem` | `--ui-text-sm` = `13px` |
| `color` | `var(--text-secondary)` | -- |
| `cursor` | `pointer` | -- |
| `text-decoration` | `none` | -- |
| `transition` | `transform var(--motion-instant) linear, background var(--motion-fast) var(--ease-out), color var(--motion-fast) var(--ease-out)` | -- |

SVG inside sidebar items: `width: 16px; height: 16px; flex-shrink: 0`.

---

## 3. States

| State | CSS Changes |
|---|---|
| Default | `color: var(--text-secondary); background: transparent` |
| Hover | `background: var(--bg-subtle); color: var(--text-primary); transform: translateY(-1px)` |
| Active (pressed) | `transform: translateY(1px)` |
| Active item (`.active`) | `background: var(--accent-primary-subtle); color: var(--accent-primary); font-weight: 550` |

---

## 4. Variants

No size or color variants exist in the reference. Single style with accent-primary active highlight.

---

## 5. Responsive Behavior

### Touch targets (`@media (pointer: coarse)`):

- `.sidebar-item` gets `min-height: 44px; min-width: 44px`

The sidebar container has a fixed width of `240px`. At narrow viewports, it would typically be hidden behind a toggle or placed in a drawer (not specified in the reference).

---

## 6. Accessibility

- Sidebar should use `<nav>` with `aria-label="Sidebar navigation"`
- Active item should have `aria-current="page"` to indicate the current location
- Icon-only items need descriptive text labels (the reference includes text labels alongside icons)
- Focus style comes from the global `:focus-visible` rule

---

## 7. Token Dependencies

### Tier 2 (Semantic)

- `--bg-surface`, `--bg-subtle`
- `--text-secondary`, `--text-primary`, `--text-muted`
- `--border-default`
- `--accent-primary`, `--accent-primary-subtle`

### Tier 3 (Component)

- `--space-1` (`4px`), `--space-2` (`8px`), `--space-3` (`12px`)
- `--radius-sm` (`10px`), `--radius-lg` (`24px`)
- `--ui-text-sm` (`13px`)
- `--motion-instant` (`100ms`), `--motion-fast` (`160ms`)
- `--ease-out`

---

## 8. Test Specification

### 8.1 Computed Style Assertions

- `.sidebar-demo` has `width: 240px` and `border-radius: 24px`
- `.sidebar-item` has `font-size` resolving to `13px`
- `.sidebar-item.active` has `background` matching `--accent-primary-subtle` and `color` matching `--accent-primary`
- `.sidebar-item.active` has `font-weight: 550`
- `.sidebar-section-label` has `text-transform: uppercase` and color matching `--text-muted`

### 8.2 Interaction Assertions

- `.sidebar-item:hover` has `transform: translateY(-1px)` and `background` matching `--bg-subtle`
- `.sidebar-item:active` has `transform: translateY(1px)`

### 8.3 Visual Regression Scenarios

- Sidebar with Dashboard active (light mode)
- Sidebar with Dashboard active (dark mode)
- Sidebar with hover on non-active item

### 8.4 Reduced Motion Compliance

- With `prefers-reduced-motion: reduce`, all transitions complete in 0.01ms
