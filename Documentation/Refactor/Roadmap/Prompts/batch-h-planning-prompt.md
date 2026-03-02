---
title: "Batch H Planning Prompt"
type: prompt
scope: roadmap
status: guide
---

# Batch H Planning Prompt

> **Roadmap Package** — This is a planning guide prompt, not a build command. When executed, it guides an agent through re-speccing all 4 Batch H components. Do not run this until the MVP is complete, stable, and `spring.js` is built and tested.

---

## Before You Begin

### Prerequisites

- [ ] MVP showcase is complete and passes all tests
- [ ] `spring.js` is built, tested, and has a stable API
- [ ] The reduced-motion JS pattern is standardized
- [ ] The `@layer component` pattern is confirmed (from 43 MVP components)
- [ ] The component token architecture is stable

### Decisions That Must Be Made First

- [ ] **Tilt-card rotation angle:** ±12° or ±15°? Test the `delightful-animation.html` demo and confirm the intended behavior.
- [ ] **Spotlight color source:** Data attributes (current pattern) or CSS custom properties?
- [ ] **Magnetic-button physics:** Simple lerp (current pattern) or `spring.js`?
- [ ] **Blur-grid selector:** `:has()` pattern or simpler `:hover` pattern?
- [ ] **Event listener cleanup:** What pattern should all JS-enhanced components follow for SPA contexts?
- [ ] **Reduced-motion scope:** Is cursor tracking (spotlight) an "animation" that should be gated, or a "positional response" that is always active?

---

## Step 1: Review the MVP Component System

Before speccing Batch H, understand the patterns established by the MVP build:

1. Read 3-4 representative MVP component CSS files to understand the `@layer component` pattern, token usage, and code style
2. Read 2-3 MVP component test files to understand the Playwright test pattern
3. Note any conventions that emerged during the MVP build that the existing Batch H briefs don't account for

Questions to answer:
- Does the MVP use any shared utility patterns for transitions or hover states that Batch H should also use?
- Are there any component token patterns (e.g., `--component-property` naming) that Batch H should follow?
- Did the MVP build reveal any cascade layer interactions that affect inline JS styles?

---

## Step 2: Confirm `spring.js` API

Read the final `spring.js` implementation and API docs. Confirm:

- The `createSpring()` API signature
- How to instantiate a spring with the "standard" preset (used by tilt-card)
- How settlement detection works
- How to clean up a spring (for element removal)
- How reduced-motion is handled

Map the spring API to tilt-card usage:
- Two independent springs (rotX, rotY) with the standard preset
- `mousemove` sets targets, `mouseleave` resets targets to 0
- Animation loop applies `rotateX` and `rotateY` transforms

Map the spring API to magnetic-button usage (if spring approach is chosen):
- Single spring for position interpolation
- Or confirm that the current lerp approach is preferred

---

## Step 3: Resolve the Tilt-Card Rotation Question

Open `delightful-animation.html` and test the tilt card demo:

1. Move cursor to the extreme right edge of the card
2. Observe the maximum visual rotation
3. Compare to the source code: `rotY.target = x * 30` where `x` is at most `0.5`, giving target of `15°`
4. The spring will not reach the full 15° target in practice — measure the actual peak rotation

**Decision:** Does the perceived rotation match the task brief's ±12°, or is it noticeably greater? Set the multiplier accordingly:
- `* 24` for ±12° target
- `* 30` for ±15° target (current code)

Document the decision with the rationale.

---

## Step 4: Write Full Component Specs

For each component, write a complete implementation spec following the MVP component spec pattern. Each spec must include:

1. **HTML structure** — semantic markup with class names
2. **CSS classes** — all properties with token references
3. **States** — default, hover, active, disabled, reduced-motion
4. **JavaScript behavior** (if applicable) — event listeners, calculations, cleanup
5. **Variants** — size, color, or layout variants
6. **Responsive behavior** — breakpoint-specific changes
7. **Accessibility** — reduced-motion, keyboard, ARIA
8. **Token dependencies** — organized by tier
9. **Test specification** — computed style, interaction, visual regression, reduced-motion
10. **Implementation CSS** — complete `@layer component` block
11. **Implementation JS** — complete module code (if applicable)

### Build order:

1. **Blur-grid** — CSS-only, validate the `@layer component` pattern for Batch H
2. **Spotlight** — JS cursor tracking, validate the inline style injection pattern
3. **Magnetic-button** — JS proximity detection, validate the spring (or lerp) integration
4. **Tilt-card** — Full spring physics integration, most complex

---

## Step 5: Write Playwright Tests

For each component, write Playwright test specifications following the MVP test pattern:

### Blur-grid tests
- Computed styles: blur-card has correct transition properties
- Interaction: hovering one card blurs siblings
- Interaction: hovering the hovered card keeps it sharp
- Interaction: leaving the grid restores all cards
- Reduced-motion: no blur effect applied
- Visual regression: rest state, hover state (light and dark mode)

### Spotlight tests
- Computed styles: spotlight-wrap and spotlight-overlay have correct positioning
- Interaction: mousemove sets overlay gradient at cursor position
- Interaction: mousemove sets shadow opposite cursor direction
- Interaction: mouseleave clears gradient and shadow
- Accent colors: gradient uses correct RGB values per card
- Visual regression: rest state, cursor at center, cursor at edge

### Magnetic-button tests
- Computed styles: magnetic-btn has correct accent background and pill radius
- Interaction: cursor within 120px causes button translation
- Interaction: translation direction matches cursor offset
- Interaction: mouseleave resets button to center with bounce easing
- Active state: scale(0.95) overrides magnetic transform
- Reduced-motion: no event listeners attached, button stays static

### Tilt-card tests
- Computed styles: tilt-card has preserve-3d, parent has perspective
- Interaction: mousemove applies rotateX and rotateY transforms
- Interaction: rotation targets match cursor position (confirm ±12° or ±15°)
- Interaction: mouseleave springs back to rotateX(0) rotateY(0)
- Shine overlay: gradient angle and opacity shift with cursor
- Spring settlement: animation deactivates when settled
- Reduced-motion: no transform applied, no animation loop

---

## Output

When complete, you should have produced:
1. Four complete component implementation specs
2. Four Playwright test specifications
3. A documented decision for each open question (rotation angle, color source, physics approach, selector pattern)
