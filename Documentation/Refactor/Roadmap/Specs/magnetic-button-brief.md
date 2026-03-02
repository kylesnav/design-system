---
title: "Magnetic Button Feature Brief"
type: spec
scope: roadmap
status: brief
---

# Magnetic Button Feature Brief

> **Roadmap Package** — These items are deferred post-v1.0. They should not be built until the MVP showcase is complete and stable. The specifications here are briefs, not build guides. When the time comes, these items will be fully re-specced based on what was learned during the MVP build.

---

## What It Is

A button that physically moves toward the cursor when the pointer enters an attraction radius. The button translates proportionally toward the cursor position (30% of the distance from center), creating a "magnetic pull" effect. On pointer leave, the button springs back to center with a bouncy easing.

---

## Why Deferred

Requires JavaScript for cursor proximity detection and position interpolation. The JS interaction model is not fully specced in the existing documentation — only the CSS styling and the inline demo JS are documented.

---

## Implementation

CSS defines the `.magnetic-zone` container (detection area) and `.magnetic-btn` (the button). JavaScript:
1. Pads `.magnetic-zone` by 60px on all sides to create the detection area
2. On `mousemove`, calculates Euclidean distance from cursor to button center
3. If distance < 120px (attraction radius), applies `transform: translate(dx * 0.3, dy * 0.3)`
4. On `mouseleave`, resets to `translate(0, 0)` with bounce easing (`cubic-bezier(0.34, 1.56, 0.64, 1)`)

Current implementation uses CSS transitions for the magnetic movement, not spring physics:
- Tracking: `transform 0.2s cubic-bezier(0.22,1,0.36,1)` (matches `--ease-smooth`)
- Reset: `transform 0.4s cubic-bezier(0.34,1.56,0.64,1)` (matches `--ease-bounce`)

---

## Open Questions

- **Lerp vs spring.js:** The current implementation uses a linear interpolation (30% pull strength) with CSS transition easing. Should this be replaced with `spring.js` for consistency with tilt-card? The spring approach would give more physically accurate behavior but adds a module dependency for what is currently a simple effect.
- **Attraction radius customization:** The 120px radius is hardcoded. Should it be exposed as a CSS custom property (`--magnetic-radius`) for consumer customization?
- **Event listener cleanup:** The existing demo code does not clean up event listeners. The re-spec must address element removal in SPA contexts.
- **Multiple instances:** The demo uses `document.getElementById` for single-instance selection. The re-spec should use class-based selection with per-instance state.
- **Active state interaction:** The `:active` state uses `transform: scale(0.95) !important` to override magnetic positioning. This `!important` is needed because inline `style.transform` has higher specificity than CSS rules. Is there a cleaner pattern?

---

## Dependencies

- **Optionally `spring.js`** — for smooth magnetic attraction (or the current lerp approach is sufficient)
- **`prefers-reduced-motion` guard** — entire effect is skipped when reduced motion is preferred
- **Stable component token architecture** — `--accent-primary`, `--text-on-accent`, `--radius-full`, `--space-*`, `--font-sans`

---

## Source Reference

`Documentation/Specs/components/magnetic-button.md` has the complete existing spec including full JS implementation code. The spec is rated 11/11 EXCELLENT in the quality audit. This component IS present in `design-reference.html` (unlike tilt-card and spotlight).
