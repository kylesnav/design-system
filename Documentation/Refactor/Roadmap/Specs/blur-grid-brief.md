---
title: "Blur Grid Feature Brief"
type: spec
scope: roadmap
status: brief
---

# Blur Grid Feature Brief

> **Roadmap Package** — These items are deferred post-v1.0. They should not be built until the MVP showcase is complete and stable. The specifications here are briefs, not build guides. When the time comes, these items will be fully re-specced based on what was learned during the MVP build.

---

## What It Is

A CSS grid where hovering one card applies `blur(2px)` and `opacity: 0.7` to all sibling cards, creating a depth-of-field focus effect. The hovered card remains sharp and fully opaque. No JavaScript required.

---

## Why Deferred

Blur-grid is CSS-only — it has no technical dependency on the Animation JS system. It is deferred alongside the other Batch H components (tilt-card, spotlight, magnetic-button) for thematic coherence. These four form the "Signature Effects" section of the showcase and should ship together.

---

## Implementation Note

The existing spec uses `.blur-grid:hover .blur-card:not(:hover)` as the selector pattern. This triggers when the cursor is anywhere inside the grid container, including gaps between cards.

A more precise pattern would use `:has()`:
```css
.blur-grid:has(.blur-card:hover) .blur-card:not(:hover) {
  filter: blur(2px);
  opacity: 0.7;
}
```

This only activates when a specific card is hovered, not when the cursor is in the grid's gap space.

The entire blur effect is gated behind `@media (prefers-reduced-motion: no-preference)`.

---

## Dependencies

- `foundation.css` — grid layout tokens, motion tokens (`--motion-base` for transition duration, `--ease-out` for easing)
- No JavaScript
- No animation modules

---

## Unknowns

- **`:has()` browser support floor.** Currently at 90%+ global support. The decision is whether to use the simpler `.blur-grid:hover` pattern (works everywhere) or the more precise `:has()` pattern (requires `:has()` support).
- **Fallback behavior.** If `:has()` is unsupported: no blur effect at all (graceful degradation) or use the simpler `:hover` pattern as a fallback?
- **Touch devices.** On touch devices (`pointer: coarse`), `:hover` states do not persist. The blur effect will not appear during normal touch interaction. This is acceptable — the effect is a mouse-pointer enhancement — but should be documented.

---

## Source Reference

`Documentation/Specs/components/blur-grid.md` has the complete existing spec — use it as the base when re-speccing. The spec is rated 10/11 EXCELLENT in the quality audit.
