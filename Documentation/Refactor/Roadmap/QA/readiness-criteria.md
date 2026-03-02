---
title: "Roadmap Readiness Criteria"
type: qa
scope: roadmap
status: active
---

# Roadmap Readiness Criteria

For each deferred item, what must be true before full speccing begins.

---

## Before Any Roadmap Work Begins

- [ ] MVP showcase (`docs/index.html`) is complete and passes all Phase 7 tests
- [ ] All 43 MVP components pass their Playwright tests
- [ ] `motion.css` is finalized (all 59 keyframes stable, no planned changes)
- [ ] The cascade layer architecture is confirmed stable
- [ ] Motion tokens in `foundation.css` are confirmed correct values
- [ ] The emitter pipeline builds all outputs from `palettes/delightful.json` without errors
- [ ] CI/CD pipeline runs green on main

---

## Before `spring.js` Spec Begins

- [ ] The three spring presets (snappy/standard/gentle) are confirmed correct by testing against the `delightful-animation.html` demo
- [ ] The reduced-motion pattern is confirmed (instant-complete vs no-animation)
- [ ] Decision: ESM-only module or also CJS?
- [ ] Decision: `requestAnimationFrame` loop vs CSS Houdini approach
- [ ] Decision: shared animation manager (single rAF loop) or per-instance loops
- [ ] Decision: CSS custom property-driven config or JS-only config objects

---

## Before Blur-grid Spec Begins

- [ ] `:has()` browser support assessed (current support floor confirmed)
- [ ] Fallback behavior for `:has()`-unsupported browsers decided
- [ ] Touch device behavior documented (no `:hover` persistence on touch — acceptable?)

---

## Before Tilt-card Spec Begins

- [ ] `spring.js` is built and tested
- [ ] ±12° vs ±15° rotation angle confirmed from demo source (test actual visual behavior)
- [ ] 3D layer structure confirmed against `delightful-animation.html`
- [ ] Shine gradient parameters confirmed (angle range 105°-165°, opacity range 0.10-0.25)
- [ ] Event listener cleanup pattern established

---

## Before Spotlight Spec Begins

- [ ] Cursor tracking pattern decided (CSS custom properties vs data attributes for color)
- [ ] Performance impact assessed (`mousemove` handler writing to `style.background` every frame)
- [ ] Reduced-motion decision: is cursor tracking gated or always active?

---

## Before Magnetic-button Spec Begins

- [ ] JS proximity detection pattern decided (lerp vs `spring.js`)
- [ ] Attraction radius value confirmed (120px in current spec)
- [ ] Pull strength multiplier confirmed (0.3 in current spec)
- [ ] Event listener cleanup pattern established
- [ ] Multi-instance support pattern decided (class-based selection)

---

## Before Motion Catalog (`motion.html`) Spec Begins

- [ ] All 59 keyframes in `motion.css` are finalized (no planned additions, removals, or name changes)
- [ ] All keyframes are categorized into the 10 categories
- [ ] Decision: standalone page or integrated into main showcase
- [ ] Decision: easing visualization approach (Canvas vs SVG)
- [ ] Decision: play control mechanism (click, intersection observer, or both)

---

## Before Animation Demos (`animation.html`) Spec Begins

- [ ] `spring.js` is complete and tested
- [ ] `flip.js` is complete and tested
- [ ] `particles.js` is complete and tested
- [ ] Decision: standalone page or integrated into main showcase
- [ ] Decision: demo isolation strategy (IIFE, module scope, or iframe)
- [ ] Decision: slider update strategy (debounce interval)
- [ ] All 23 demos inventoried with required parameters and expected behavior
