---
title: "Design Review Guide for Roadmap Items"
type: qa
scope: roadmap
status: active
---

# Design Review Guide for Roadmap Items

Review checklists for when Roadmap specs are written. Use these to assess spec quality before implementation begins.

---

## Animation JS System Review

When the `spring.js` / `flip.js` / `particles.js` specs are written, assess:

- [ ] API is minimal — does each function do one thing?
- [ ] No global state — each module is instance-based (no shared mutable singletons)
- [ ] Reduced-motion handled at the module level, not the caller level (callers should not need to check `prefers-reduced-motion` themselves)
- [ ] CSS custom property integration is clean (reads vars, does not fight the cascade or write to properties that CSS rules also control)
- [ ] Each module is individually importable (no forced bundling — importing `spring.js` does not pull in `particles.js`)
- [ ] Error handling: what happens when the element is removed mid-animation? (The spec must define behavior, not leave it as an unhandled edge case)
- [ ] Settlement detection is well-defined (threshold values documented, convergence guaranteed for valid configs)
- [ ] Memory management: animation loops are stopped and references released when `destroy()` is called
- [ ] The three presets (snappy, standard, gentle) are validated against the demo — same config values produce same visual behavior
- [ ] Module format supports both the showcase use case (inline `<script>`) and the npm package use case (`import`)

---

## Batch H Component Review

When Batch H component specs are written, assess:

- [ ] Does each component follow the same `@layer component` pattern as MVP components?
- [ ] Does each component's JS interaction degrade gracefully when JS is disabled? (Card renders, just no interaction)
- [ ] Does the CSS-only state (before JS initializes) look reasonable? (No broken layout, no missing content)
- [ ] Are the interaction parameters exposed as CSS custom properties for consumer customization? (e.g., blur radius, attraction radius, rotation range)
- [ ] Does tilt-card properly clean up event listeners on disconnect/removal?
- [ ] Does spotlight properly cancel animation frames on disconnect/removal?
- [ ] Does magnetic-button properly clean up event listeners on disconnect/removal?
- [ ] Is the reduced-motion behavior consistent across all four components?
- [ ] Are computed style assertions testable? (Can Playwright verify the interaction states?)
- [ ] Multi-instance support: can multiple instances of the same component exist on one page without interference?
- [ ] Token usage: no hardcoded color values — all colors come from semantic tokens (except the spotlight RGB question, which must be resolved)
- [ ] Hover/focus parity: is it documented whether keyboard focus triggers any of the interaction effects?

### Per-Component Checks

**Blur-grid:**
- [ ] The `:has()` vs `:hover` selector decision is documented with rationale
- [ ] Fallback behavior for unsupported browsers is specified
- [ ] Touch device behavior is documented

**Tilt-card:**
- [ ] The rotation angle decision (±12° vs ±15°) is documented with test evidence
- [ ] The perspective context requirement (parent wrapper) is clearly documented
- [ ] The shine overlay gradient formula is correct and produces the documented angle/opacity ranges
- [ ] Spring settlement threshold is specified (position and velocity)

**Spotlight:**
- [ ] The color source decision (data attributes vs CSS custom properties) is documented
- [ ] The `mousemove` handler performance is assessed (does it cause jank on low-power devices?)
- [ ] The shadow direction formula is correct (inverse of cursor position)

**Magnetic-button:**
- [ ] The physics approach decision (lerp vs spring) is documented
- [ ] The `:active` state interaction with inline transforms is addressed (the `!important` override pattern)
- [ ] The zone padding (60px) and attraction radius (120px) relationship is clear

---

## Showcase Page Review

When `motion.html` and `animation.html` specs are written, assess:

- [ ] Do pages import from `src/` files only (no inline token definitions, no hardcoded color values)?
- [ ] Is the demo isolation clean — can one broken demo affect others? (Test: introduce a JS error in one demo and verify others still work)
- [ ] Are real-time parameter sliders debounced (not firing on every pixel of drag)?
- [ ] Is the page accessible?
  - [ ] Demos are pauseable
  - [ ] Keyboard navigable (all controls reachable via Tab)
  - [ ] Canvas demos have text alternatives
  - [ ] Sliders have proper ARIA labels and value readouts
  - [ ] Reduced-motion: all CSS animations respect the preference; JS animations respect the preference
- [ ] Are pages responsive? (The 59-animation catalog and 23-demo page are content-dense — layout must adapt)
- [ ] Do pages follow the same HTML template, import pattern, and convention as the MVP showcase (`docs/index.html`)?
- [ ] Theme toggle works on these pages (light/dark switching)
- [ ] No console errors on page load
- [ ] Visual regression screenshots are defined for key states
