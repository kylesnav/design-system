# Breadcrumbs

> Path navigation showing the hierarchical location within a site. Links for ancestor pages, plain text for the current page, with `/` separator characters.

Cross-references: [[topnav]] (breadcrumbs complement topnav for deep navigation), [[token-tiers]] (typography, spacing tokens).

Visual reference: Section "05 -- Components", subsection "Navigation > Breadcrumbs" in `design-reference.html` (lines ~2627-2655 CSS, lines ~5936-5939 HTML).

---

## 1. HTML Structure

```html
<div class="breadcrumbs">
  <a href="#">Home</a>
  <span class="sep">/</span>
  <a href="#">Design System</a>
  <span class="sep">/</span>
  <span class="current">Components</span>
</div>
```

---

## 2. CSS Classes

### 2.1 `.breadcrumbs` (container)

| Property | Value | Token |
|---|---|---|
| `display` | `flex` | -- |
| `align-items` | `center` | -- |
| `gap` | `var(--space-2)` | `8px` |
| `font-size` | `var(--ui-text-sm)` | `13px` |

### 2.2 `.breadcrumbs a` (ancestor links)

| Property | Value | Token |
|---|---|---|
| `color` | `var(--text-secondary)` | -- |
| `text-decoration` | `none` | -- |
| `transition` | `transform var(--motion-instant) linear, color var(--motion-fast) var(--ease-out)` | -- |

### 2.3 `.sep` (separator)

| Property | Value |
|---|---|
| `color` | `var(--text-muted)` |

### 2.4 `.current` (current page)

| Property | Value |
|---|---|
| `color` | `var(--text-primary)` |
| `font-weight` | `550` |

---

## 3. States

| State | Element | CSS Changes |
|---|---|---|
| Hover | `.breadcrumbs a` | `color: var(--text-primary)` |
| Active (pressed) | `.breadcrumbs a` | `transform: translateY(1px)` |

---

## 4. Variants

No variants. Single style with `/` separator.

---

## 5. Responsive Behavior

Breadcrumbs remain inline at all viewports. On very narrow screens, they may wrap naturally since they use `flex` with `gap`.

---

## 6. Accessibility

- Use `<nav aria-label="Breadcrumb">` wrapper for screen reader context
- Use an `<ol>` or structured list for proper semantics (the reference uses flat `<div>`, implementing agents should consider `<ol>` with `<li>` wrappers)
- The `.current` span should have `aria-current="page"` to indicate the current location
- Links are focusable by default; focus style comes from the global `:focus-visible` rule

---

## 7. Token Dependencies

### Tier 2 (Semantic)

- `--text-secondary`, `--text-primary`, `--text-muted`

### Tier 3 (Component)

- `--space-2` (`8px`)
- `--ui-text-sm` (`13px`)
- `--motion-instant` (`100ms`), `--motion-fast` (`160ms`)
- `--ease-out`

---

## 8. Test Specification

### 8.1 Computed Style Assertions

- `.breadcrumbs` has `font-size` resolving to `13px`
- `.breadcrumbs` has `gap` resolving to `8px`
- `.current` has `font-weight: 550` and color matching `--text-primary`
- `.sep` has color matching `--text-muted`

### 8.2 Interaction Assertions

- `.breadcrumbs a:hover` color changes to `--text-primary`

### 8.3 Visual Regression Scenarios

- Breadcrumb trail with 3 levels (light mode)
- Breadcrumb trail with 3 levels (dark mode)

### 8.4 Reduced Motion Compliance

- With `prefers-reduced-motion: reduce`, all transitions complete in 0.01ms
