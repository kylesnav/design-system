---
title: "Back to Top"
date: 2026-03-02
type: spec
scope: mvp
status: active
---

# Back to Top

> Fixed-position button in the bottom-right corner that appears when the user scrolls past the hero section. Uses IntersectionObserver to toggle visibility and smooth-scrolls to the top on click. Implements a lift/press interaction pattern.

Cross-references: [[button]] (lift/press pattern -- back-to-top uses hover -2px/+1px, matching button hover lift), [[shadows]] (shadow-sm at rest, shadow-md on hover), [[token-tiers]] (spacing, radius, z-index, motion tokens).

Visual reference: Section "BACK TO TOP" in `design-reference.html` (lines ~3683-3722 CSS, lines ~7284-7288 HTML, lines ~7515-7526 JS).

---

## 1. HTML Structure

```html
<button class="back-to-top" id="back-to-top" aria-label="Back to top">
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round">
    <polyline points="18 15 12 9 6 15" />
  </svg>
</button>
```

---

## 2. CSS Classes

### 2.1 `.back-to-top`

| Property | Value | Token |
|---|---|---|
| `position` | `fixed` | -- |
| `bottom` | `var(--space-8)` | `32px` |
| `right` | `var(--space-6)` | `24px` |
| `width` | `44px` | WCAG minimum touch target |
| `height` | `44px` | -- |
| `border-radius` | `var(--radius-full)` | `9999px` |
| `background` | `var(--bg-surface)` | -- |
| `color` | `var(--text-primary)` | -- |
| `border` | `2px solid var(--border-default)` | -- |
| `cursor` | `pointer` | -- |
| `display` | `flex` | -- |
| `align-items` | `center` | -- |
| `justify-content` | `center` | -- |
| `z-index` | `100` | `--z-sticky` |
| `opacity` | `0` | Hidden by default |
| `pointer-events` | `none` | -- |
| `transition` | `opacity var(--motion-fast) var(--ease-out), transform var(--motion-instant) linear, box-shadow var(--motion-instant) linear` | -- |
| `box-shadow` | `var(--shadow-sm)` | `2px 2px 0 var(--border-default)` |

SVG inside: `width: 18px; height: 18px`.

---

## 3. States

| State | CSS Changes |
|---|---|
| Hidden (default) | `opacity: 0; pointer-events: none` |
| Visible (`.visible`) | `opacity: 1; pointer-events: auto` |
| Hover | `transform: translateY(-2px); box-shadow: var(--shadow-md)` |
| Active (pressed) | `transform: translateY(1px); box-shadow: none` |

---

## 4. Variants

No variants. Single circular button style.

---

## 5. Responsive Behavior

No explicit responsive breakpoints. Positioned with fixed spacing tokens (`--space-8` bottom, `--space-6` right).

---

## 6. JavaScript Behavior

### 6.1 IntersectionObserver for Visibility

```js
const btt = document.getElementById('back-to-top');
const heroSection = document.querySelector('.hero');
if (btt && heroSection) {
  const bttObserver = new IntersectionObserver(([entry]) => {
    btt.classList.toggle('visible', !entry.isIntersecting);
  }, { threshold: 0 });
  bttObserver.observe(heroSection);
}
```

The button becomes visible when the hero section scrolls out of view (i.e., when `.hero` is no longer intersecting the viewport).

### 6.2 Scroll to Top

```js
btt.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});
```

---

## 7. Accessibility

- Uses `aria-label="Back to top"` for screen reader context
- 44x44px size meets WCAG minimum touch target
- Hidden from interaction (`pointer-events: none`) when not visible to prevent accidental activation

---

## 8. Token Dependencies

### Tier 2 (Semantic)

- `--bg-surface`
- `--text-primary`
- `--border-default`
- `--shadow-sm`, `--shadow-md`

### Tier 3 (Component)

- `--space-6` (`24px`), `--space-8` (`32px`)
- `--radius-full` (`9999px`)
- `--z-sticky` (`100`)
- `--motion-instant` (`100ms`), `--motion-fast` (`160ms`)
- `--ease-out`

---

## 9. Test Specification

### 9.1 Computed Style Assertions

- `.back-to-top` has `position: fixed`
- `.back-to-top` has `width: 44px` and `height: 44px` and `border-radius: 9999px`
- `.back-to-top` (default) has `opacity: 0` and `pointer-events: none`
- `.back-to-top.visible` has `opacity: 1` and `pointer-events: auto`
- `.back-to-top` has `box-shadow` matching `--shadow-sm`

### 9.2 Interaction Assertions

- Scrolling past the hero section adds `.visible` class
- Scrolling back to top removes `.visible` class
- Clicking the button scrolls to top (`window.scrollY` approaches 0)
- `.back-to-top:hover` has `transform: translateY(-2px)` and `box-shadow` matching `--shadow-md`

### 9.3 Visual Regression Scenarios

- Button hidden (at top of page)
- Button visible in bottom-right (light mode)
- Button visible (dark mode)
- Button hover state

### 9.4 Reduced Motion Compliance

- With `prefers-reduced-motion: reduce`, opacity/transform transitions complete in 0.01ms
- Scroll behavior should fall back to instant jump (some browsers respect `prefers-reduced-motion` for `behavior: 'smooth'`)

## Implementation CSS

```css
@layer component {
  .back-to-top {
    position: fixed;
    bottom: var(--space-6);
    right: var(--space-6);
    z-index: var(--z-toast);
    width: 44px;
    height: 44px;
    border-radius: var(--radius-full);
    background: var(--bg-surface);
    border: 2px solid var(--border-default);
    box-shadow: var(--shadow-sm);
    color: var(--text-primary);
    cursor: pointer;
    display: grid;
    place-items: center;
    opacity: 0;
    pointer-events: none;
    transition: opacity var(--motion-fast) var(--ease-out),
                transform var(--motion-fast) var(--ease-smooth),
                box-shadow var(--motion-fast) var(--ease-smooth);
  }
  .back-to-top.visible { opacity: 1; pointer-events: auto; }
  .back-to-top:hover { transform: translateY(-2px); box-shadow: var(--shadow-md); }
  .back-to-top:active { transform: translate(2px, 2px); box-shadow: none; }
}
```
