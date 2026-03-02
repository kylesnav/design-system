# Z-Index Scale

> Complete z-index token inventory, stacking context guidance, and usage rules for the Delightful Design System.

Cross-references: [[token-tiers]] (where these tokens live in the cascade).

---

## 1. Complete Z-Index Scale

Seven tokens defined on `:root` inside `@layer component`. Values use intentional gaps to allow insertion of future layers without renumbering.

| CSS Custom Property | Value | UI Element | Notes |
|---|---|---|---|
| `--z-base` | `1` | Default positioned elements | Anything that needs to participate in stacking but has no special priority |
| `--z-sticky` | `100` | Sticky headers, sticky sidebars | Elements that stick to viewport edges during scroll |
| `--z-fixed` | `200` | Fixed navigation bars, scroll-progress bar | Permanently viewport-attached elements |
| `--z-overlay` | `300` | Overlay backdrops, drawer scrims | Semi-transparent layers that dim content behind modals/drawers. The `.scroll-progress` bar also uses this level. |
| `--z-modal` | `1000` | Modal dialogs, command palettes | Primary modal content layer. Large gap (300 -> 1000) prevents component z-index inflation from bleeding into modals. |
| `--z-toast` | `1100` | Toast notifications, snackbars | Must appear above modals (a toast might fire while a modal is open) |
| `--z-tooltip` | `1500` | Tooltips, popovers | Highest layer -- tooltips must be visible above everything including toasts |

---

## 2. Stacking Context Interactions

### 2.1 How z-index works with stacking contexts

A `z-index` value only competes with siblings within the same stacking context. A new stacking context is created by any of:
- `position: relative/absolute/fixed/sticky` with a `z-index` value
- `transform`, `filter`, `opacity < 1`, `will-change`, `contain: paint`
- `isolation: isolate`

This means: a tooltip (`--z-tooltip: 1500`) inside a card with `transform` will NOT appear above a modal (`--z-modal: 1000`) because the card's `transform` creates a new stacking context that caps the tooltip's effective z-index.

### 2.2 Practical rules

1. **Modals and overlays should be rendered at the root level** (direct children of `<body>` or a portal container) to avoid stacking context traps.
2. **Tooltips and popovers**: Use a portal or render outside transformed containers.
3. **Sticky elements**: `--z-sticky` (100) is intentionally below `--z-fixed` (200) -- a sticky sidebar should scroll behind a fixed top nav.
4. **Never use raw z-index numbers** in component CSS. Always reference the token scale.

### 2.3 Gap reasoning

| Gap | From | To | Purpose |
|---|---|---|---|
| 1 -> 100 | base -> sticky | Room for layered content (e.g., stacked cards at z-index 2, 3, 4) |
| 100 -> 200 | sticky -> fixed | Room for nested sticky elements |
| 200 -> 300 | fixed -> overlay | Minimal gap -- overlays appear directly above fixed nav |
| 300 -> 1000 | overlay -> modal | Large gap to absorb z-index inflation from component hover states and interactive elements |
| 1000 -> 1100 | modal -> toast | Toasts must float above modal dialogs |
| 1100 -> 1500 | toast -> tooltip | Tooltips are the absolute highest layer |

---

## 3. Usage in the Reference

| Component | Token Used | Context |
|---|---|---|
| `.scroll-progress` | `var(--z-overlay)` | Fixed progress bar at top of viewport |

---

## 4. Implementation CSS

Complete CSS for an implementing agent to copy:

```css
@layer component {
  :root {
    --z-base: 1;
    --z-sticky: 100;
    --z-fixed: 200;
    --z-overlay: 300;
    --z-modal: 1000;
    --z-toast: 1100;
    --z-tooltip: 1500;
  }
}
```
