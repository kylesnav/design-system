---
title: "Phase 4: Motion System"
type: prompt
scope: mvp
status: active
---

# Phase 4: Motion System

> Build all 59 CSS keyframe animations and their utility classes as a standalone importable stylesheet.

---

## Context

Read these specs before starting:
- `Specs/motion/keyframes.md` -- all 59 keyframes organized by 10 categories with exact values
- `Specs/motion/animation-classes.md` -- utility classes, stagger delays, scroll-driven animations
- `Specs/motion/inline-behaviors.md` -- JS behaviors that trigger animations
- `Specs/foundation/motion.md` -- timing and easing token definitions
- `Specs/testing/motion-tests.md` -- test specifications
- `Architecture/mvp-architecture.md` -- Section 8 (Lift/Press Interaction Pattern)

---

## Deliverables

### 4.1 -- Motion CSS (`src/motion/motion.css`)

A single CSS file containing all animations, importable independently alongside tokens + foundation.

**Structure**:

All content wrapped in `@media (prefers-reduced-motion: no-preference) { }`:

```css
@media (prefers-reduced-motion: no-preference) {
  /* 1. All 59 @keyframes definitions */
  /* 2. Animation utility classes */
  /* 3. Stagger delay classes */
  /* 4. Scroll-driven animations (wrapped in @supports) */
}
```

**Keyframe Categories** (59 total):

1. **Entrance** (8): fadeInUp, scaleIn, slideInLeft, slideInRight, slideInDown, dropIn, stampIn, shutterReveal
2. **Exit** (3): fadeOutRight, fadeOutDown, scaleOut
3. **Stamp/Impact** (5): stamp-in, drop-in, slide-slam, punch-up, slam-down
4. **Feedback** (4): confirm-thud, error-jolt, warning-bob, info-slide
5. **State/Interaction** (7): trapdoor, snap-shrink, wiggle, pulse-ring, toggle-thwack, check-pop, drag-lift
6. **Component** (6): toggle-thwack, check-pop, drag-lift, card-flip, morph-expand, spring-snap
7. **Text/Scroll** (5): pendulum, ticker-scroll, typewriter-mono, text-stamp, text-bounce-in
8. **Loading** (5): shimmer, pulse, progress-fill-slam, spinner, bounce-dot
9. **Attention** (5): shake, headbutt, spotlight, rubber-band, border-march
10. **Advanced/Scroll-driven** (6+): scroll-parallax-shadow, scroll-rotate-in, scroll-progress-track, stamp-in (reuse), shutter-reveal (reuse), plus view-timeline variants

**Animation Utility Classes**:
- `.anim-in` -- generic entrance (stamp-in, 500ms, ease-smooth)
- `.anim-text-stamp` -- text stamp effect
- `.hover-lift` -- lift on hover (translateY(-2px), shadow escalation)
- `.badge-pop` -- badge entrance animation
- `.anim-d1` through `.anim-d12` -- stagger delay classes (50ms increments)

**Scroll-Driven Animations** (wrapped in `@supports (animation-timeline: scroll())`):
- `.scroll-anim-stamp-in`
- `.scroll-anim-parallax-shadow`
- `.scroll-anim-reveal-wipe`
- `.scroll-anim-rotate-in`
- `.scroll-anim-progress-track`

All scroll-driven animations additionally wrapped in `@media (prefers-reduced-motion: no-preference)`.

**Token References**:
- Uses `var(--motion-fast)`, `var(--motion-base)`, etc. for durations
- Uses `var(--ease-out)`, `var(--ease-bounce)`, `var(--ease-smooth)`, etc. for easings
- Uses `var(--shadow-sm)`, `var(--shadow-md)`, `var(--shadow-lg)` for shadow escalation

### 4.2 -- Tests (`tests/motion.spec.ts`)

- **Reduced-motion compliance**: With `prefers-reduced-motion: reduce`, all animations are disabled (duration forced to 0.01ms by reset.css gate)
- **Keyframe existence**: Spot-check that key animations exist in computed styles
- **Spring easing tokens**: `--spring-snappy` and `--spring-gentle` resolve to `linear()` values
- **Stagger delays**: `.anim-d1` through `.anim-d12` increment by 50ms
- **Scroll-driven gating**: Scroll animations are wrapped in `@supports`

---

## Important Notes

- **No JavaScript in this phase**: Phase 4 is CSS-only. The JS behaviors that trigger animations (splash particles, theme toggle, etc.) are documented in inline-behaviors.md but implemented during Phase 7 (showcase).
- **motion.css references foundation tokens**: It uses `var(--motion-*)` and `var(--ease-*)` from foundation.css. It must import after foundation.
- **All animations are in the `@media (prefers-reduced-motion: no-preference)` gate**: This is a hard requirement. Users with reduced-motion preference must see no animation.

---

## Acceptance Criteria

- [ ] `src/motion/motion.css` contains all 59 keyframe definitions
- [ ] All utility classes are defined (`.anim-in`, `.hover-lift`, `.badge-pop`, stagger delays)
- [ ] Everything is gated inside `@media (prefers-reduced-motion: no-preference)`
- [ ] Scroll-driven animations are additionally gated in `@supports (animation-timeline: scroll())`
- [ ] motion.css imports independently alongside tokens + foundation
- [ ] `npm test` passes all motion tests
- [ ] Reduced-motion users see no animation
