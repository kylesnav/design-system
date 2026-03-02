# Skip Link

> Accessibility skip-to-content link that is visually hidden until focused. Appears at the top of the page when a keyboard user presses Tab, allowing them to bypass navigation and jump directly to the main content.

Cross-references: [[topnav]] (skip link appears before the topnav in DOM order), [[token-tiers]] (spacing, typography, radius, z-index, motion tokens).

Visual reference: Section "SKIP LINK" in `design-reference.html` (lines ~3661-3678 CSS, line ~4123 HTML).

---

## 1. HTML Structure

```html
<a href="#landing" class="skip-link">Skip to content</a>
```

This element is placed as the very first focusable element in the document, before the topnav.

---

## 2. CSS Classes

### 2.1 `.skip-link`

| Property | Value | Token |
|---|---|---|
| `position` | `absolute` | -- |
| `top` | `-100%` | Hidden off-screen |
| `left` | `var(--space-4)` | `16px` |
| `padding` | `var(--space-2) var(--space-4)` | `8px 16px` |
| `background` | `var(--accent-primary)` | -- |
| `color` | `var(--text-on-accent)` | -- |
| `font-weight` | `600` | -- |
| `font-size` | `var(--ui-text-md)` | `14px` |
| `border-radius` | `var(--radius-sm)` | `10px` |
| `z-index` | `var(--z-toast)` | `1100` |
| `text-decoration` | `none` | -- |
| `transition` | `top var(--motion-fast) var(--ease-out)` | -- |

### 2.2 `.skip-link:focus`

| Property | Value |
|---|---|
| `top` | `var(--space-4)` = `16px` |

When focused, the skip link slides into view at `top: 16px; left: 16px`.

---

## 3. States

| State | CSS Changes |
|---|---|
| Default (unfocused) | `top: -100%` -- completely hidden above viewport |
| Focused | `top: var(--space-4)` -- visible at top-left of viewport |

---

## 4. Variants

No variants. Single style.

---

## 5. Responsive Behavior

No responsive changes. The skip link uses fixed positioning with `var(--space-4)` from the left edge, which works at all viewport sizes.

---

## 6. Accessibility

- This IS the accessibility feature -- it provides keyboard users a way to bypass repetitive navigation
- Must be the first focusable element in the DOM
- The `href` should point to the `id` of the main content area
- The link text should be descriptive: "Skip to content" or "Skip to main content"
- Uses `z-index: var(--z-toast)` (1100) to appear above all other UI elements including the sticky topnav

---

## 7. Token Dependencies

### Tier 2 (Semantic)

- `--accent-primary`
- `--text-on-accent`

### Tier 3 (Component)

- `--space-2` (`8px`), `--space-4` (`16px`)
- `--radius-sm` (`10px`)
- `--ui-text-md` (`14px`)
- `--z-toast` (`1100`)
- `--motion-fast` (`160ms`)
- `--ease-out`

---

## 8. Test Specification

### 8.1 Computed Style Assertions

- `.skip-link` has `position: absolute`
- `.skip-link` (unfocused) has `top` resolving to a negative value (off-screen)
- `.skip-link` has `z-index: 1100`
- `.skip-link` has `background` matching `--accent-primary`
- `.skip-link` has `color` matching `--text-on-accent`
- `.skip-link` has `border-radius: 10px`

### 8.2 Interaction Assertions

- Pressing Tab from page load focuses the skip link
- When focused, `.skip-link` has `top` resolving to `16px`
- Pressing Enter on the focused skip link scrolls/jumps to the target element
- Pressing Tab again moves focus past the skip link to the next focusable element

### 8.3 Visual Regression Scenarios

- Skip link focused (visible) at top of page (light mode)
- Skip link focused (visible) at top of page (dark mode)

### 8.4 Reduced Motion Compliance

- With `prefers-reduced-motion: reduce`, the top transition completes in 0.01ms (skip link appears instantly)
