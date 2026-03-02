---
title: "Spotlight Feature Brief"
type: spec
scope: roadmap
status: brief
---

# Spotlight Feature Brief

> **Roadmap Package** — These items are deferred post-v1.0. They should not be built until the MVP showcase is complete and stable. The specifications here are briefs, not build guides. When the time comes, these items will be fully re-specced based on what was learned during the MVP build.

---

## What It Is

A card where a `radial-gradient` spotlight follows the cursor position. The gradient is rendered in the card's accent color at 25% opacity within a 120px circle centered at the absolute cursor position. A box shadow simultaneously shifts opposite to cursor direction, simulating a physical light source.

---

## Why Deferred

Requires cursor tracking JavaScript and a consistent pattern for inline style injection on `mousemove`. While simpler than tilt-card (no spring physics), it is deferred with Batch H for thematic coherence as part of the "Signature Effects" set.

---

## Implementation Pattern

JavaScript writes gradient position directly to the overlay element's `style.background` on every `mousemove`:

```
radial-gradient(circle 120px at Xpx Ypx, rgba(R,G,B,0.25), transparent)
```

Position uses absolute pixel coordinates (`e.clientX - rect.left`), not percentages or CSS custom properties.

Shadow direction is the inverse of cursor position relative to card center, with a maximum offset of ±2px and zero blur (hard edge, neo-brutalist style).

---

## Data Attribute Pattern — Decision Needed

The existing implementation uses `data-accent-r`, `data-accent-g`, `data-accent-b` HTML attributes to pass RGB color values to JavaScript:

```html
<div class="spotlight-wrap"
  data-accent="pink"
  data-accent-r="200"
  data-accent-g="80"
  data-accent-b="180">
```

This pattern has drawbacks:
- **Bypasses the design system's color authority model.** Colors are hand-authored as integers, not derived from CSS custom properties.
- **Duplicates color information.** The `data-accent="pink"` drives CSS theming via attribute selectors, while the RGB values drive the JS gradient. They represent the same color through different channels.
- **OKLCH mismatch.** The design system uses OKLCH; these are approximate sRGB RGB values.

Possible revision: JS reads the computed accent color from `getComputedStyle(el).getPropertyValue('--accent-primary')`, then parses the OKLCH value (via `culori` or a lightweight parser) to produce RGB for the `rgba()` gradient. This keeps colors in the token system but adds a parsing dependency.

Alternatively: define spotlight-specific CSS custom properties in the component's `@layer component` block (e.g., `--spotlight-r`, `--spotlight-g`, `--spotlight-b`) that are derived from the accent tokens. JS reads these via `getComputedStyle`.

---

## Dependencies

- **No `spring.js` dependency** — cursor tracking is immediate (no spring physics)
- **Cursor tracking JS** — `mousemove` and `mouseleave` event listeners
- **Stable component token architecture** — `--accent-*-subtle`, `--accent-*`, `--border-default`, `--shadow-md`, `--radius-md`

---

## Source Reference

`Documentation/Specs/components/spotlight.md` has the complete existing spec including full JS implementation code. The spec is rated 10/11 in the quality audit. Note: this component does NOT appear in `design-reference.html` — it is sourced from `delightful-animation.html`.
