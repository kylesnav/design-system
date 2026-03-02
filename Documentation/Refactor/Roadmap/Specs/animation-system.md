---
title: "Animation System Feature Brief"
type: spec
scope: roadmap
status: brief
---

# Animation System Feature Brief

> **Roadmap Package** — These items are deferred post-v1.0. They should not be built until the MVP showcase is complete and stable. The specifications here are briefs, not build guides. When the time comes, these items will be fully re-specced based on what was learned during the MVP build.

---

## What It Is

Three importable JavaScript modules providing animation primitives not achievable in CSS alone:

| Module | Purpose | Key Capability |
|--------|---------|---------------|
| `spring.js` | Spring physics engine | Damped harmonic oscillator with configurable stiffness, damping, mass |
| `flip.js` | FLIP layout transitions | Smooth position/size animations when DOM layout changes |
| `particles.js` | Canvas particle effects | Burst and constellation effects reading colors from CSS custom properties |

Together with a barrel `index.js` that re-exports all modules for tree-shakeable consumption.

---

## Why Deferred

Building CSS-first lets the component layer stabilize before adding JS interaction. The CSS motion system (59 keyframes, animation classes, timing tokens, easing curves) must be proven correct and stable before layering JavaScript physics on top. If the CSS foundation shifts, the JS layer would need to be rebuilt.

The animation system is also not required for the core value proposition: a single design language propagated to every tool. The token system, emitter pipeline, and CSS components deliver that without JS.

---

## Dependencies

- **Stable motion tokens from `foundation.css`** — the spring presets reference timing concepts (what "fast" vs "slow" means in the system) even though they use stiffness/damping/mass rather than duration
- **Stable `@layer component` architecture** — JS-applied inline styles must coexist cleanly with cascade layers
- **`requestAnimationFrame` API** — all three modules use rAF for smooth 60fps animation loops
- **Canvas API** — `particles.js` uses 2D canvas rendering context

---

## What Needs Deciding Before Full Spec

1. **Module format:** ESM-only vs ESM + CJS dual-format? The showcase pages currently use inline `<script>` blocks, not `import` statements. The npm package use case requires ESM. Both must be supported.

2. **Browser target:** Does the spring physics engine need `requestAnimationFrame` only, or should it explore CSS Houdini (`registerProperty`, `CSS.paintWorklet`) for declarative spring animations? Houdini has limited browser support but would integrate more cleanly with the CSS system.

3. **CSS custom property integration:** Should spring configs be driven by CSS custom properties (e.g., `--spring-stiffness: 200` on the element) or passed as JS config objects? CSS-driven would let consumers customize spring behavior via CSS, but adds complexity to the module API.

4. **Reduced motion strategy:** Two options:
   - **Instant-complete:** Spring immediately sets value to target (no animation, but final state is reached)
   - **No-animation:** Skip entirely (element stays at initial state)
   The existing demo code uses a simple `if (reducedMotion) return;` guard that skips the interaction entirely.

---

## Spring API Sketch

```js
// Core physics step (pure function, no side effects)
springStep(current, target, velocity, { stiffness, damping, mass })
// → { value, velocity }

// High-level spring animator
createSpring({ stiffness, damping, mass })
// → { start(target), stop(), onUpdate(callback), destroy() }

// Presets
SPRING_PRESETS = {
  snappy:   { stiffness: 300, damping: 20, mass: 1 },
  standard: { stiffness: 200, damping: 20, mass: 1 },
  gentle:   { stiffness: 100, damping: 15, mass: 1 }
}
```

Open question: Should `createSpring` manage its own `requestAnimationFrame` loop, or should there be a shared animation manager (like the existing demo's `registerAnimation`/`globalLoop` pattern)?

---

## FLIP API Sketch

Two possible interfaces:

**Fluent interface:**
```js
flip(element)
  .first()     // snapshot current position
  .last()      // snapshot after layout change
  .invert()    // calculate transform delta
  .play(config) // animate from inverted to final
```

**Separate functions:**
```js
const first = measureFirst(element)
// ... DOM change happens ...
const last = measureLast(element)
const transform = invert(first, last)
play(element, transform, config)
```

Open question: Which interface pattern is more consistent with the rest of the system? The fluent interface is more ergonomic; separate functions are more testable and composable.

---

## Particle API Sketch

```js
// Initialize a particle system on a canvas element
createParticleSystem(canvas, {
  count: 50,
  velocity: { min: 1, max: 5 },
  colors: null  // defaults to reading CSS custom properties
})

// Trigger a burst effect from an element's position
splashEffect(element, event, {
  count: 20,
  colors: ['var(--accent-primary)', 'var(--accent-gold)'],
  velocity: { min: 2, max: 8 }
})
```

Colors default to reading CSS custom properties from the element or its ancestors. If explicit colors are passed, they override the CSS-derived colors.

---

## Source References

- Existing spring physics implementation: `delightful-animation.html` inline JS (lines ~4200-4260)
- Spring presets: `SPRING_PRESETS` object in `delightful-animation.html`
- FLIP concept: standard web animation pattern (First, Last, Invert, Play)
- Particle system: `delightful-animation.html` canvas demos
- Architecture overview: `Documentation/Architecture/Core Concepts & Fundamental Technologies.md` Section 2.3
- Build plan: `Documentation/Architecture/Rebuild Plan.md` Phase 6
