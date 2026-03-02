---
title: "Animation System Planning Prompt"
type: prompt
scope: roadmap
status: guide
---

# Animation System Planning Prompt

> **Roadmap Package** — This is a planning guide prompt, not a build command. When executed, it guides an agent through re-speccing the Animation JS system. Do not run this until the MVP is complete and stable.

---

## Before You Begin

### Decisions That Must Be Made First

These decisions must be resolved before the full spec can be written. If they are not yet resolved, stop and resolve them before proceeding.

- [ ] **Module format:** ESM-only, or ESM + CJS dual-format?
- [ ] **Browser target:** `requestAnimationFrame` only, or explore CSS Houdini for declarative spring animations?
- [ ] **Spring config source:** CSS custom properties on the element, or JS config objects passed to `createSpring()`?
- [ ] **Reduced motion strategy:** Instant-complete (spring jumps to target) or skip entirely (no animation)?
- [ ] **Animation manager pattern:** Single shared `requestAnimationFrame` loop (like the existing demo), or per-instance loops?
- [ ] **FLIP interface:** Fluent (`flip(el).first().last().invert().play()`) or separate functions (`measureFirst()`, `measureLast()`, `invert()`, `play()`)?

---

## Step 1: Read Existing Documentation

Read the following files in order to understand the current state of the motion system:

1. `Documentation/Refactor/Roadmap/Specs/animation-system.md` — the feature brief for the animation system
2. `Documentation/Refactor/Roadmap/Architecture/roadmap-architecture.md` — Section 2 (how items fit together) and Section 3 (what MVP must prove first)
3. `Documentation/Refactor/MVP/Specs/foundation/motion.md` — motion timing tokens and easing functions
4. `Documentation/Refactor/MVP/Specs/motion/keyframes.md` — the 22 documented keyframes
5. `Documentation/Refactor/MVP/Specs/motion/animation-classes.md` — animation utility classes
6. `Documentation/Refactor/MVP/Specs/motion/inline-behaviors.md` — Sections 8-11 (tilt card, spotlight, magnetic button, spring physics demos)

Also read the built `foundation.css` (if it exists) to confirm the actual motion token values.

---

## Step 2: Assess Spring Presets Against Component Needs

The three presets (snappy, standard, gentle) are currently defined by the demo code. Assess whether they cover all use cases:

| Preset | Current Config | Used By |
|--------|---------------|---------|
| Snappy | stiffness 300, damping 20, mass 1 | Buttons, toggles |
| Standard | stiffness 200, damping 20, mass 1 | Tilt-card rotation |
| Gentle | stiffness 100, damping 15, mass 1 | Page-level transitions |

Questions to answer:
- Does the staggered-reveal component need a different preset?
- Does the magnetic-button use a spring (requiring a preset) or a simple lerp?
- Are there component interactions discovered during the MVP build that suggest additional presets?
- Should presets be extensible (consumers can add their own)?

---

## Step 3: Define Final APIs

For each module, write the complete API specification:

### spring.js

Define:
- `springStep(state, config, dt)` — core physics function (pure, no side effects)
- `createSpring(config)` — high-level animator with lifecycle methods
- `SPRING_PRESETS` — the preset configurations
- Settlement detection: threshold values and the check function
- `destroy()` method for cleanup
- Reduced-motion behavior

### flip.js

Define:
- Position snapshot format (what data is captured)
- The measure-invert-play sequence
- Configuration: duration, easing, onComplete callback
- How it interacts with CSS transitions (does it suppress them during FLIP?)
- Cleanup and cancellation

### particles.js

Define:
- `createParticleSystem(canvas, config)` — initialization and canvas setup
- `splashEffect(element, event, config)` — burst effect
- Particle lifecycle: spawn, update, render, destroy
- Color resolution from CSS custom properties
- Canvas cleanup on element removal
- Reduced-motion behavior

### index.js

Define:
- Re-exports for each module
- Tree-shaking: confirm that importing one module does not pull in others

---

## Step 4: Write Full Implementation Specs

For each module, write a complete implementation spec following the pattern established by the MVP component specs. Each spec should include:

1. Public API with TypeScript-style type signatures
2. Internal state management
3. Animation loop integration
4. Error handling (element removed mid-animation, invalid config)
5. Reduced-motion handling
6. Browser compatibility requirements
7. Bundle size budget (keep each module small)

---

## Step 5: Write Test Specs

For each module, write test specifications:

### spring.js tests
- Spring converges to target within expected number of frames
- Spring respects stiffness/damping/mass parameters (higher stiffness = faster convergence)
- `destroy()` stops the animation loop
- Reduced-motion: spring jumps to target immediately (or skips, depending on decision)
- Settlement detection triggers at the correct threshold
- Multiple springs can run simultaneously without interference

### flip.js tests
- Position snapshot captures correct bounding rect
- Invert calculation produces correct transform delta
- Play animation reaches final position
- Cancellation mid-animation does not leave element in wrong position
- Works with elements that change size (not just position)

### particles.js tests
- Canvas rendering initializes without throwing
- `splashEffect` creates particles at the correct position
- Particles are cleaned up after their lifecycle
- Reduced-motion: no particles rendered
- Color resolution from CSS custom properties produces correct values
- Canvas is cleaned up when particle system is destroyed

---

## Output

When complete, you should have produced:
1. Three full implementation specs (one per module)
2. Three test specs (one per module)
3. A barrel module spec (`index.js`)
4. An updated version of the animation-system brief reflecting any decisions made during this process
