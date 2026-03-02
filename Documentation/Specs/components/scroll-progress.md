# Scroll Progress

> Fixed progress bar at the top of the viewport that fills from left to right as the user scrolls down the page. Uses pure CSS `animation-timeline: scroll()` -- no JavaScript required. Starts as accent-primary color and transitions to accent-green at 100% scroll.

Cross-references: [[token-tiers]] (z-index, accent tokens).

Visual reference: Section "Scroll-driven progress bar" in `design-reference.html` (lines ~692-723 CSS, line ~4126 HTML).

---

## 1. HTML Structure

```html
<div class="scroll-progress" aria-hidden="true"></div>
```

This element is placed before the topnav, outside the main content wrapper.

---

## 2. CSS Classes

### 2.1 `.scroll-progress` (base)

| Property | Value | Token |
|---|---|---|
| `position` | `fixed` | -- |
| `top` | `0` | -- |
| `left` | `0` | -- |
| `right` | `0` | -- |
| `height` | `3px` | -- |
| `background` | `var(--accent-primary)` | -- |
| `transform-origin` | `left` | -- |
| `transform` | `scaleX(0)` | Initial state (empty) |
| `z-index` | `var(--z-overlay)` | `300` |

### 2.2 Scroll-Linked Animation

Wrapped in `@supports (animation-timeline: scroll())` and `@media (prefers-reduced-motion: no-preference)`:

```css
.scroll-progress {
  animation: scroll-progress-fill linear;
  animation-timeline: scroll();
}
```

### 2.3 Keyframes

```css
@keyframes scroll-progress-fill {
  0% { transform: scaleX(0); background-color: var(--accent-primary); }
  99% { background-color: var(--accent-primary); }
  100% { transform: scaleX(1); background-color: var(--accent-green); }
}
```

The bar scales from 0 to 1 as the page scrolls. The color transitions from `--accent-primary` (pink) to `--accent-green` at the very end (100%), creating a completion indicator effect.

---

## 3. States

| State | Visual |
|---|---|
| Page at top | Bar invisible (`scaleX(0)`) |
| Mid-scroll | Partial fill, accent-primary color |
| Page at bottom | Full fill (`scaleX(1)`), accent-green color |

---

## 4. Variants

No variants. Single style.

---

## 5. Responsive Behavior

No responsive changes. The bar spans the full viewport width at all sizes.

---

## 6. Accessibility

- Element has `aria-hidden="true"` since it is decorative (provides no actionable information to screen readers)
- The scroll position is already communicated by the browser's native scrollbar

---

## 7. Progressive Enhancement

The `animation-timeline: scroll()` property is wrapped in `@supports`:

```css
@supports (animation-timeline: scroll()) {
  @media (prefers-reduced-motion: no-preference) {
    /* animation applied */
  }
}
```

In browsers that do not support `animation-timeline`, the bar remains at `scaleX(0)` (invisible). This is intentional graceful degradation -- the bar is a visual enhancement, not a functional requirement.

In `prefers-reduced-motion: reduce`, the bar is also invisible because the animation is not applied. The global reduced-motion rule (`animation-duration: 0.01ms !important`) would also neutralize it.

---

## 8. Token Dependencies

### Tier 2 (Semantic)

- `--accent-primary`
- `--accent-green`

### Tier 3 (Component)

- `--z-overlay` (`300`)

---

## 9. Test Specification

### 9.1 Computed Style Assertions

- `.scroll-progress` has `position: fixed; top: 0`
- `.scroll-progress` has `height: 3px`
- `.scroll-progress` has `z-index: 300`
- `.scroll-progress` has `transform-origin` containing `left`

### 9.2 Interaction Assertions

- In supporting browsers with no reduced-motion preference, scrolling to 50% fills the bar approximately halfway
- At 100% scroll, bar background changes to `--accent-green`
- In browsers without `animation-timeline` support, bar remains invisible

### 9.3 Visual Regression Scenarios

- Page at top (bar invisible)
- Page at ~50% scroll (bar half-filled, pink)
- Page at bottom (bar full, green)

### 9.4 Reduced Motion Compliance

- With `prefers-reduced-motion: reduce`, the scroll animation is not applied; bar remains invisible
