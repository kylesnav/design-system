---
title: "Roadmap Sequencing Guide"
type: prompt
scope: roadmap
status: guide
---

# Roadmap Sequencing Guide

> **Roadmap Package** — This is a planning guide, not a build command. It outlines the recommended order for re-speccing and building deferred items after the MVP is complete and stable.

---

## Recommended Sequence

### Step 1: Verify MVP Completeness

Before any Roadmap work begins, confirm:

- [ ] MVP showcase (`docs/index.html`) is complete and passes all Phase 7 tests
- [ ] All 43 MVP components pass their Playwright tests
- [ ] `motion.css` is finalized (all 59 keyframes stable, no planned changes)
- [ ] The cascade layer architecture (`@layer reset, primitives, semantic, component, utilities`) is confirmed stable
- [ ] Motion tokens in `foundation.css` are confirmed correct values
- [ ] The emitter pipeline builds all outputs from `palettes/delightful.json` without errors
- [ ] CI/CD pipeline runs green on main

**"Stable" means:** No open tickets or known issues that would change the token names, keyframe names, layer order, or component token values that Roadmap items depend on.

**Questions to answer before proceeding:**
- Are there any CSS changes planned that would affect how inline JS styles interact with cascade layers?
- Did the MVP build reveal any motion token values that need adjustment?
- Is the `prefers-reduced-motion` gate pattern working correctly across all 43 components?

---

### Step 2: Re-spec `spring.js`

The spring physics engine is the linchpin — tilt-card and magnetic-button depend on it directly, and the design decision for magnetic-button (lerp vs spring) depends on knowing the `spring.js` API.

**What to re-spec:**
- Final module API: `springStep()` pure function, `createSpring()` high-level animator, presets
- Module format: ESM-only vs dual-format
- Shared animation manager pattern (single rAF loop vs per-instance loops)
- Reduced-motion handling: instant-complete vs skip entirely
- Event: how to detect when a spring has settled (threshold values)

**What "stable" means for this dependency:**
- API is finalized and documented
- Three presets (snappy, standard, gentle) produce correct behavior when validated against `delightful-animation.html` demo
- Unit tests pass for convergence, energy conservation, and reduced-motion bypass

**Questions to answer before proceeding:**
- ESM-only or also CJS?
- `requestAnimationFrame` loop or CSS Houdini approach?
- CSS custom property integration for spring config, or JS-only config objects?

---

### Step 3: Build `spring.js` and Validate

Build the module from the spec. Validate by:
1. Running the three presets against known-good outputs from the demo
2. Confirming spring settlement behavior matches the demo's threshold (0.1° position, 0.1 deg/s velocity)
3. Testing reduced-motion behavior
4. Confirming the module works both as an ESM import and in the showcase's inline `<script>` context

**Do not proceed to Step 4 until `spring.js` is tested and stable.**

---

### Step 4: Re-spec and Build Blur-grid

CSS-only, no JS dependency. Quick win that validates the `@layer component` pattern for Batch H.

**What to re-spec:**
- Final selector pattern: `:has()` vs `:hover` (decide based on current browser support data)
- Fallback behavior for `:has()`-unsupported browsers
- Touch device behavior documentation
- Whether to tokenize the blur radius (2px) and dimmed opacity (0.7)

**What "stable" means for this dependency:**
- `:has()` browser support confirmed at an acceptable level
- Fallback behavior decided and documented

**Questions to answer before proceeding:**
- Is the blur-grid spec in `Documentation/Specs/components/blur-grid.md` still accurate after the MVP build?

---

### Step 5: Re-spec Spotlight and Magnetic-button

Both require JS but are simpler than tilt-card. Build them together to establish the cursor-tracking and proximity-detection patterns that tilt-card also uses.

**Spotlight — what to re-spec:**
- Color source pattern: data attributes vs CSS custom properties (resolve the data attribute question)
- Performance budget for `mousemove` → style update loop
- Reduced-motion decision (is cursor tracking an "animation" or a "positional response"?)

**Magnetic-button — what to re-spec:**
- Lerp vs `spring.js` for magnetic attraction (now that `spring.js` API is known)
- Whether attraction radius should be a CSS custom property
- Event listener cleanup pattern for SPA contexts
- Multi-instance support (class-based selection)

**What "stable" means for this dependency:**
- `spring.js` is built and tested (if magnetic-button uses it)
- Cursor tracking pattern decided and documented
- Event listener cleanup pattern established

---

### Step 6: Re-spec and Build Tilt-card

Most complex component. Uses `spring.js` for rotation, perspective context, and shine overlay calculation.

**What to re-spec:**
- Confirm rotation angle: ±12° vs ±15° (test against actual demo)
- Confirm 3D layer structure against `delightful-animation.html`
- Define shine gradient calculation parameters
- Spring settlement threshold
- Event listener cleanup
- Multi-instance support

**What "stable" means for this dependency:**
- `spring.js` is built, tested, and has a stable API
- Rotation angle conflict is resolved with a definitive answer
- 3D layer structure is confirmed

---

### Step 7: Re-spec and Build Motion Catalog Page

Needs all 59 keyframes stable in `motion.css`.

**What to re-spec:**
- Page layout and navigation (category sections, jump links)
- Per-animation play controls
- Easing curve visualization approach (canvas vs SVG)
- Whether the page is standalone or integrated into the main showcase
- Responsive layout for 59 animations

**What "stable" means for this dependency:**
- All 59 keyframes in `motion.css` are finalized — no additions, removals, or name changes planned
- Motion tokens in `foundation.css` are confirmed correct

---

### Step 8: Re-spec and Build Animation Demos Page

Needs all three JS modules complete.

**What to re-spec:**
- Demo inventory (confirm the 23 demos, add or remove as needed)
- Slider parameter ranges and defaults
- Demo isolation strategy (one broken demo should not break others)
- Accessibility: keyboard navigation, pauseable demos, canvas alternatives
- Mobile experience

**What "stable" means for this dependency:**
- `spring.js` is complete and tested
- `flip.js` is complete and tested (spec and build as part of this step — it has no brief yet)
- `particles.js` is complete and tested (spec and build as part of this step — it has no brief yet)

---

## Dependency Graph

```
MVP Complete & Stable
        │
        ▼
   spring.js spec ──────── spring.js build & validate
        │                           │
        │         ┌─────────────────┤
        ▼         ▼                 ▼
   blur-grid   spotlight &    tilt-card
  (CSS-only)   magnetic-button  (most complex)
                                    │
        ┌───────────────────────────┘
        ▼
  flip.js & particles.js spec + build
        │
        ├──► Motion Catalog Page (needs stable motion.css)
        │
        └──► Animation Demos Page (needs all 3 JS modules)
```

Note: `flip.js` and `particles.js` do not have standalone briefs in this package because they are specced as part of the animation-system brief. They should be fully specced during Step 8 when the animation demos page is planned.
