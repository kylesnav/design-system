# Pagination

> Numeric page navigation with prev/next arrows and active page highlighting. Page buttons use a lift/press micro-interaction: `translateY(-1px)` on hover with border escalation, `translateY(1px)` on active press.

Cross-references: [[button]] (lift/press pattern reference -- pagination uses a lighter variant: -1px/+1px instead of button's -2px/+2px), [[shadows]] (no shadow escalation on page-btn unlike full buttons), [[token-tiers]] (control height, spacing, typography tokens).

Visual reference: Section "05 -- Components", subsection "Navigation > Pagination" in `design-reference.html` (lines ~2657-2693 CSS, lines ~5943-5949 HTML).

---

## 1. HTML Structure

```html
<div class="pagination">
  <button class="page-btn">&laquo;</button>
  <button class="page-btn active">1</button>
  <button class="page-btn">2</button>
  <button class="page-btn">3</button>
  <button class="page-btn">&raquo;</button>
</div>
```

---

## 2. CSS Classes

### 2.1 `.pagination` (container)

| Property | Value | Token |
|---|---|---|
| `display` | `flex` | -- |
| `gap` | `var(--space-1)` | `4px` |
| `align-items` | `center` | -- |

### 2.2 `.page-btn`

| Property | Value | Token |
|---|---|---|
| `width` | `var(--control-sm)` | `32px` |
| `height` | `var(--control-sm)` | `32px` |
| `display` | `flex` | -- |
| `align-items` | `center` | -- |
| `justify-content` | `center` | -- |
| `font-size` | `var(--ui-text-sm)` | `13px` |
| `border` | `2px solid var(--border-default)` | -- |
| `border-radius` | `var(--radius-sm)` | `10px` |
| `background` | `var(--bg-surface)` | -- |
| `color` | `var(--text-secondary)` | -- |
| `cursor` | `pointer` | -- |
| `font-family` | `var(--font-sans)` | -- |
| `transition` | `transform var(--motion-instant) linear, background var(--motion-fast) var(--ease-out), border-color var(--motion-fast) var(--ease-out)` | -- |

---

## 3. States

| State | CSS Changes |
|---|---|
| Default | `background: var(--bg-surface); color: var(--text-secondary); border-color: var(--border-default)` |
| Hover | `background: var(--bg-subtle); border-color: var(--border-strong); transform: translateY(-1px)` |
| Active (pressed) | `transform: translateY(1px)` |
| Active page (`.active`) | `background: var(--accent-primary); color: var(--text-on-accent); border-color: var(--accent-primary)` |

Note: The lift/press pattern here is lighter than the button component. Page buttons lift 1px on hover (vs 2px for buttons) and press 1px on active (vs 2px for buttons). There is no shadow escalation on page buttons.

---

## 4. Variants

No color or size variants. All page buttons share the same style. The `.active` variant indicates the current page.

---

## 5. Responsive Behavior

### Touch targets (`@media (pointer: coarse)`):

- `.page-btn` gets `min-height: 44px; min-width: 44px`

---

## 6. Accessibility

- Page buttons should have `aria-label` for prev/next (e.g., `aria-label="Previous page"`, `aria-label="Next page"`)
- The active page button should have `aria-current="page"`
- Disabled prev/next buttons (at start/end of pagination) should use the `disabled` attribute
- The container should have `role="navigation"` and `aria-label="Pagination"`

---

## 7. Token Dependencies

### Tier 2 (Semantic)

- `--bg-surface`, `--bg-subtle`
- `--text-secondary`, `--text-on-accent`
- `--border-default`, `--border-strong`
- `--accent-primary`

### Tier 3 (Component)

- `--control-sm` (`32px`)
- `--space-1` (`4px`)
- `--radius-sm` (`10px`)
- `--ui-text-sm` (`13px`)
- `--font-sans`
- `--motion-instant` (`100ms`), `--motion-fast` (`160ms`)
- `--ease-out`

---

## 8. Test Specification

### 8.1 Computed Style Assertions

- `.page-btn` has `width: 32px` and `height: 32px`
- `.page-btn` has `border-radius: 10px`
- `.page-btn` has `font-size` resolving to `13px`
- `.page-btn.active` has `background` matching `--accent-primary` and `color` matching `--text-on-accent`

### 8.2 Interaction Assertions

- `.page-btn:hover` has `transform: translateY(-1px)` and `border-color` matching `--border-strong`
- `.page-btn:active` has `transform: translateY(1px)`
- `.page-btn.active` retains accent background on hover

### 8.3 Visual Regression Scenarios

- Pagination with page 1 active (light mode)
- Pagination with page 1 active (dark mode)
- Pagination with page 2 active

### 8.4 Reduced Motion Compliance

- With `prefers-reduced-motion: reduce`, all transitions complete in 0.01ms
