---
title: "Roadmap Architecture"
type: architecture
scope: roadmap
status: active
---

# Roadmap Architecture

> **Roadmap Package** — These items are deferred post-v1.0. They should not be built until the MVP showcase is complete and stable. The specifications here are briefs, not build guides. When the time comes, these items will be fully re-specced based on what was learned during the MVP build.

---

## 1. Why These Items Were Deferred

The Batch H components — blur-grid, tilt-card, spotlight, magnetic-button — are the "signature interaction moments" of Delightful. Each requires JavaScript that goes beyond what CSS can achieve alone: spring physics engines, cursor tracking with position interpolation, canvas rendering, and proximity detection.

The Animation JS system (Phase 6) is the shared infrastructure these components depend on. It provides three importable modules — `spring.js`, `flip.js`, and `particles.js` — that deliver physics-based animation primitives not achievable with CSS `@keyframes` or `linear()` easing alone.

Rather than build the JS animation layer before proving the CSS system works, the roadmap defers both together. The reasoning:

- **CSS-first validation.** The MVP proves the token architecture, emitter pipeline, cascade layers, CSS motion system, and 43 components work correctly before adding a JS interaction layer on top. If the CSS foundation has issues, they surface before JS complicates debugging.
- **Dependency chain.** Tilt-card requires `spring.js` for rotation physics. Spotlight requires cursor tracking JS. Magnetic-button requires proximity detection JS. Building these components before their JS infrastructure exists would produce incomplete implementations.
- **Thematic coherence.** Blur-grid is CSS-only (no JS required), but it is deferred alongside the other three Batch H components because they form a cohesive set of "signature effects." Shipping three of four makes no design sense.
- **Documentation pages depend on completeness.** The motion catalog (`docs/motion.html`) needs all 59 keyframes stable. The animation demos page (`docs/animation.html`) needs all three JS modules complete. Both are deferred because their dependencies are not yet built.
- **MVP scope discipline.** The MVP proves the core value proposition: a single design language defined once, propagated to every tool. Adding JS animations before that core is stable risks scope creep and distraction.

---

## 2. How These Items Fit Together

The Animation JS system and Batch H components form a dependency graph:

### Spring Physics Engine (`spring.js`)

The linchpin module. Powers:
- **Tilt-card** — two independent spring oscillators drive `rotateX` and `rotateY` transforms, tracking cursor position with stiffness 200, damping 20, mass 1 (the "standard" preset)
- **Staggered-reveal** — spring entrance animation for card sequences (currently CSS `linear()` approximation; JS spring would be higher fidelity)
- **Spring-snap keyframe** — the `spring-snap` animation class in motion.css could be driven by real spring physics instead of a CSS approximation

Three presets are defined in the existing demo code:
| Preset | Stiffness | Damping | Mass | Character |
|--------|-----------|---------|------|-----------|
| Snappy | 300 | 20 | 1 | Sharp, responsive — buttons, toggles |
| Standard | 200 | 20 | 1 | Balanced — tilt-card, general interactions |
| Gentle | 100 | 15 | 1 | Soft, slow — page-level transitions |

### FLIP Utilities (`flip.js`)

Layout transition animations. Powers:
- **Accordion** — smooth height animation when panels open/close
- **Modal/drawer entrance** — layout-aware entrance transitions
- **List reordering** — animated repositioning when items are sorted or filtered

### Particle System (`particles.js`)

Canvas-based generative effects. Powers:
- **Button/card click splash** — the particle burst effect on interaction events in the showcase
- **Constellation background** — decorative particle field effect

The particle system reads colors from CSS custom properties, keeping it palette-aware without hardcoding values.

### Blur-grid (CSS-only)

The outlier in Batch H. Requires no JavaScript — it uses `.blur-grid:has(.blur-grid__item:hover) .blur-grid__item:not(:hover)` (or the simpler `.blur-grid:hover .blur-card:not(:hover)` pattern from the existing spec). Deferred with Batch H for thematic coherence, not technical dependency.

### Motion Catalog Page (`docs/motion.html`)

Requires all 59 keyframes in `motion.css` to be stable, plus CSS animation utility classes. The catalog UI is non-trivial: 10 category sections, play/replay controls per animation, easing curve visualizations, timing token reference.

### Animation Demos Page (`docs/animation.html`)

Requires `spring.js`, `flip.js`, and `particles.js` to all be complete. Contains 23 interactive demos with real-time parameter sliders. This is the capstone demonstration of the animation system.

---

## 3. What MVP Must Prove First

Before any Roadmap work begins, the MVP build must answer these questions:

### Cascade Layer Stability
Are the cascade layers stable? Adding JS-driven inline styles (e.g., `element.style.transform`) must not fight the `@layer` system. Inline styles have highest specificity in CSS, which means JS-applied transforms override layer-declared transforms. The MVP must confirm that this interaction model is clean — JS sets transforms, CSS sets everything else, and they don't conflict.

### Motion Token Interoperability
Do motion tokens from `foundation.css` work correctly as JS spring configuration? For example, `--motion-standard-duration` (240ms) might serve as a reference for spring settle time, but spring physics don't use duration — they use stiffness/damping/mass. The relationship between CSS timing tokens and JS spring presets must be understood.

### Reduced Motion Extension
Does the `prefers-reduced-motion` gate pattern extend cleanly to JS animations? The CSS approach (collapse `animation-duration` to `0.01ms`) doesn't apply to `requestAnimationFrame` loops. The JS modules need their own reduced-motion handling — either instant-complete (spring jumps to target) or no-animation (skip entirely).

### Keyframe Stability
Are all 59 keyframes in `motion.css` stable enough to build a catalog against? If keyframe names, timing, or easing are still being adjusted during the MVP build, the motion catalog would need to be rebuilt after every change.

### Component Token Architecture
Is the component token architecture stable enough that Batch H components can reference it? Specifically: are `--bg-surface`, `--border-default`, `--accent-primary`, `--shadow-md`, `--radius-md`, and `--motion-*` tokens finalized?

---

## 4. Re-speccing Approach

When the time comes to build these items, they should not be built from these briefs alone. Each item should be fully re-specced based on what was learned during the MVP build.

### Recommended Approach

1. **Start with `spring.js`.** Everything else depends on it. The spring physics engine is the linchpin — tilt-card and magnetic-button cannot be specced without knowing its API.

2. **Validate against existing presets.** The three spring presets (snappy, standard, gentle) are already used in the `delightful-animation.html` demo. Build `spring.js`, then validate that the module produces the same behavior as the inline demo code. If the behavior diverges, the demo is the source of truth.

3. **Spec Batch H components after `spring.js` is stable.** With a working spring module, tilt-card and magnetic-button can be specced with real API references instead of hypothetical interfaces. The interaction models will be more complete.

4. **Spec motion catalog and animation demos together.** These pages share the same motion system and should be designed as a coherent pair. Decide whether they are standalone pages or integrated into the main showcase before speccing either one.

---

## 5. Known Design Decisions to Revisit

### Tilt-Card Rotation Angle Conflict

The existing tilt-card spec documents a discrepancy:
- The original task brief specifies **±12°** maximum rotation
- The `delightful-animation.html` source code uses `x * 30` on a `[-0.5, 0.5]` normalized range, yielding **±15°** maximum target

The spec notes: "The spring will approach but typically not reach this full target value before the cursor moves again." This means the *perceived* rotation may be closer to ±12° even though the *target* is ±15°.

**Decision needed:** Should the spec define the target angle (±15°, matching existing code) or the perceived angle (closer to ±12°, matching the task brief)? This must be confirmed by testing the actual demo behavior.

### Spotlight Data Attribute Pattern

The spotlight component uses `data-accent-r`, `data-accent-g`, `data-accent-b` attributes on the HTML element to pass RGB values to JavaScript. These are hand-authored integers, not derived from CSS custom properties at runtime.

**Decision needed:** Should the JS module read colors from CSS custom properties instead? For example, `getComputedStyle(el).getPropertyValue('--accent-primary')` would keep colors in the token system. The current pattern bypasses the design system's color authority model. However, CSS custom property values return OKLCH strings (not RGB), which would require a conversion step in JS.

### Magnetic Button Interaction Model

The existing magnetic-button spec covers only the CSS styling and the inline JS behavior from the demo. The JS interaction model is straightforward (cursor proximity detection with a linear lerp), but the spec does not address:
- Whether `spring.js` should power the magnetic attraction (for consistency with tilt-card) or whether the current lerp approach is sufficient
- What happens when the cursor moves quickly through the zone without stopping
- Whether the attraction radius (120px) should be a CSS custom property for consumer customization
- Event listener cleanup when the element is removed from the DOM

### Blur-Grid `:has()` Support

The blur-grid spec documents a simpler pattern (`.blur-grid:hover .blur-card:not(:hover)`) that does not require `:has()`. However, a `:has()`-based pattern (`.blur-grid:has(.blur-card:hover) .blur-card:not(:hover)`) would be more precise — it only activates when a specific card is hovered, not when the grid container itself is hovered in the gap between cards.

**Decision needed:** Which selector pattern to use, and what fallback behavior to provide for browsers that don't support `:has()` (currently 90%+ support).

### Module Format

The animation JS modules need a module format decision:
- **ESM-only** — simplest, modern, tree-shakeable. Requires consumers to use `import` syntax.
- **ESM + CJS** — broader compatibility but requires a build step or dual-format publishing.
- **IIFE fallback** — for direct `<script>` tag inclusion in the showcase pages.

The showcase pages (`docs/animation.html`) currently use inline `<script>` blocks, not ESM imports. The module format must support both the showcase use case and the npm package use case.
