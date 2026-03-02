---
title: "Showcase Pages Planning Prompt"
type: prompt
scope: roadmap
status: guide
---

# Showcase Pages Planning Prompt

> **Roadmap Package** — This is a planning guide prompt, not a build command. When executed, it guides an agent through re-speccing `docs/motion.html` and `docs/animation.html`. Do not run this until the motion system is stable and all three animation JS modules are complete.

---

## Before You Begin

### Prerequisites

- [ ] All 59 keyframes in `motion.css` are finalized (no planned additions, removals, or name changes)
- [ ] Motion tokens in `foundation.css` are confirmed correct values
- [ ] `spring.js` is complete and tested
- [ ] `flip.js` is complete and tested
- [ ] `particles.js` is complete and tested
- [ ] The MVP showcase (`docs/index.html`) is complete and can serve as a pattern reference

### Decisions That Must Be Made First

- [ ] **Standalone or integrated?** Are `motion.html` and `animation.html` separate pages, or sections within the main showcase?
- [ ] **Catalog vs demos:** Are the motion catalog and animation demos separate pages (as currently planned), or should they be combined into a single comprehensive motion/animation page?
- [ ] **Navigation model:** How do users navigate between the main showcase, motion catalog, and animation demos? Topnav links? Sidebar?

---

## Step 1: Review the Full Motion Catalog

Read `motion.css` in its entirety. Catalog every keyframe:

1. List all 59 keyframe names
2. Categorize each into one of the 10 categories (entrance, exit, stamp/impact, feedback, state/interaction, component, text/scroll, loading, attention, advanced)
3. Note the duration and easing each keyframe typically uses
4. Identify any keyframes that depend on specific token values

Compare against the 22 keyframes documented in `Documentation/Specs/motion/keyframes.md`. The remaining 37 need to be identified and categorized.

---

## Step 2: Review the MVP Showcase Pattern

Read `docs/index.html` (the MVP showcase) to understand:

1. How CSS and JS imports are structured
2. The HTML template pattern for sections
3. How interactive features (theme toggle, command palette) are implemented
4. The responsive layout approach
5. Any accessibility patterns (skip links, ARIA, keyboard navigation)

The motion catalog and animation demos should follow the same conventions.

---

## Step 3: Design the Motion Catalog (`docs/motion.html`)

### Page Structure

Decide on the layout:
- How are the 10 categories organized? (Collapsible sections? Tab panels? Single scrolling page with jump links?)
- How many animations are shown per row at each breakpoint?
- Is there a search/filter mechanism for finding a specific keyframe?

### Per-Animation Display

For each of the 59 animations, define:
- The demo element (what shape/component demonstrates the animation)
- Play/replay control (button click? Intersection observer? Both?)
- Information displayed: keyframe name, duration, easing, category
- Code snippet toggle (show the `@keyframes` definition?)

### Easing Visualizations

For the 7 easing curves, define:
- Rendering approach: Canvas (dynamic) or SVG (static)?
- How the 2 `linear()` spring curves are visualized (they are multi-point, not cubic-bezier)
- Interactive: can users modify easing parameters, or are they display-only?

### Timing Token Reference

A reference table or visualization for the 5 timing tokens:
- `--motion-instant` (100ms)
- `--motion-fast` (160ms)
- `--motion-base` (240ms)
- `--motion-slow` (360ms)
- `--motion-deliberate` (500ms)

---

## Step 4: Design the Animation Demos (`docs/animation.html`)

### Demo Inventory

Confirm the 23 demos. For each demo, define:
- What it demonstrates (which module, which feature)
- The interactive controls (sliders, buttons, toggles)
- Default parameter values and valid ranges
- Expected behavior description

### Demo Isolation

Define the isolation strategy:
- Each demo runs in its own scope (IIFE or module)
- A JS error in one demo does not propagate to others
- Each demo can be paused/reset independently
- Canvas-based demos clean up properly when navigated away

### Parameter Sliders

For demos with real-time controls:
- Define slider ranges (e.g., stiffness: 50-500, damping: 5-50, mass: 0.1-10)
- Define update strategy: debounced or throttled? What interval?
- Define the numeric readout format
- Define reset-to-default behavior

### Accessibility

- All sliders must be keyboard-navigable with proper ARIA labels
- Canvas demos must have text alternatives
- Demos must be pauseable (both animation and particle system)
- Focus management when interacting with slider panels

---

## Step 5: Write Assembly Specs

For each page, write a complete assembly spec following the same pattern as the MVP Phase 7 showcase specs. Each spec must include:

1. **Import list** — every CSS and JS file the page imports
2. **HTML template** — complete page structure with all sections
3. **Inline JavaScript** — interactive behavior code
4. **Responsive breakpoints** — layout changes at each breakpoint
5. **Accessibility** — ARIA attributes, keyboard navigation, reduced-motion
6. **Test specification** — page loads without errors, interactive features work, visual regression scenarios

---

## Output

When complete, you should have produced:
1. A complete assembly spec for `docs/motion.html`
2. A complete assembly spec for `docs/animation.html`
3. A test spec for each page
4. A documented decision for each open question (standalone vs integrated, catalog layout, demo isolation strategy)
