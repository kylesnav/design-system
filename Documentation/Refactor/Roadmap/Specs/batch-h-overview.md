---
title: "Batch H Components Overview"
type: spec
scope: roadmap
status: brief
---

# Batch H Components Overview

> **Roadmap Package** — These items are deferred post-v1.0. They should not be built until the MVP showcase is complete and stable. The specifications here are briefs, not build guides. When the time comes, these items will be fully re-specced based on what was learned during the MVP build.

---

## What Connects Them

Batch H is the "Signature" component set — four components that define the system's most distinctive interaction moments. They share a common trait: all require JavaScript beyond CSS for their core interaction.

| Component | JS Requirement | CSS-Only Fallback |
|-----------|---------------|-------------------|
| Blur-grid | None (CSS-only) | Full functionality without JS |
| Tilt-card | Spring physics for rotation | Static card with no tilt |
| Spotlight | Cursor tracking for gradient | Static accent background |
| Magnetic-button | Proximity detection for position | Standard pill button |

Despite blur-grid being CSS-only, it is grouped with the other three because they form a cohesive "signature effects" section in the showcase. Shipping three of four would create an incomplete design story.

---

## Build Order Recommendation

1. **Blur-grid** — CSS-only, simplest of the four. No JS dependency. Quick win that validates the `@layer component` pattern for Batch H and confirms `:has()` browser support strategy.

2. **Spotlight** — JS cursor tracking (no spring physics). Simpler JS than tilt-card. Tests the pattern of JS writing to CSS custom properties or inline styles on `mousemove`.

3. **Magnetic-button** — JS proximity detection with a lerp or optional spring. Tests the event listener cleanup pattern and the `prefers-reduced-motion` JS guard.

4. **Tilt-card** — Most complex. Requires `spring.js` to be stable. Two independent spring oscillators, perspective context, shine overlay calculation. This is the final component and validates the full animation system integration.

---

## Shared Concerns

### Reduced Motion
All four components must respect `prefers-reduced-motion`:
- **Blur-grid:** Wraps blur/opacity effect in `@media (prefers-reduced-motion: no-preference)` — CSS handles it
- **Tilt-card:** JS checks `reducedMotion` flag; `mousemove` handler returns early
- **Spotlight:** Currently has no reduced-motion guard (cursor tracking is "positional, not animated") — this decision needs revisiting
- **Magnetic-button:** JS checks `prefersReduced` flag; entire effect is skipped

A consistent approach is needed: either all JS-driven interactions check reduced-motion, or a clear rationale distinguishes which interactions are "animations" vs "positional responses."

### Graceful Degradation
All components must have a reasonable CSS-only state before JS initializes:
- Blur-grid: fully functional without JS
- Tilt-card: renders as a standard card (no tilt, static shine gradient)
- Spotlight: renders as a card with accent background (no cursor glow)
- Magnetic-button: renders as a standard pill button (no magnetic pull)

### Event Listener Cleanup
Tilt-card, spotlight, and magnetic-button all attach `mousemove` and `mouseleave` listeners. When elements are removed from the DOM (e.g., in a SPA), listeners must be cleaned up. The existing demo code does not handle this — it is an IIFE that runs once. The re-spec must address cleanup.

---

## What the MVP Must Deliver Before These Are Built

- **Stable `@layer component` architecture** — Batch H CSS must follow the same pattern as the 43 MVP components
- **Stable token system** — `--bg-surface`, `--border-default`, `--accent-primary`, `--shadow-md`, `--radius-md`, `--motion-*` tokens must be finalized
- **`spring.js` module** — tilt-card and magnetic-button depend on it (or the decision must be made that magnetic-button uses a simple lerp instead)
- **Reduced motion pattern** — the JS-side `prefers-reduced-motion` handling must be standardized before building components that depend on it

---

## Source References

Existing specs for each component:
- `Documentation/Specs/components/blur-grid.md`
- `Documentation/Specs/components/tilt-card.md`
- `Documentation/Specs/components/spotlight.md`
- `Documentation/Specs/components/magnetic-button.md`
