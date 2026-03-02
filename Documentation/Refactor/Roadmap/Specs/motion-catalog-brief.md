---
title: "Motion Catalog Page Feature Brief"
type: spec
scope: roadmap
status: brief
---

# Motion Catalog Page Feature Brief

> **Roadmap Package** — These items are deferred post-v1.0. They should not be built until the MVP showcase is complete and stable. The specifications here are briefs, not build guides. When the time comes, these items will be fully re-specced based on what was learned during the MVP build.

---

## What It Is

`docs/motion.html` — an interactive documentation page showing all 59 CSS animations with play/replay controls. Organized by 10 categories, with easing curve visualizations and timing token reference.

---

## Why Deferred

Needs `motion.css` to be stable — all 59 keyframes must be finalized with no planned changes. Building a catalog against a moving target means constant rework. The catalog UI itself is also non-trivial, with per-animation controls, category navigation, and easing visualizations.

---

## Structure

### 10 Category Sections

1. **Entrance** — fadeInUp, scaleIn, slideInLeft, etc.
2. **Exit** — fadeOutRight, etc.
3. **Stamp/Impact** — stamp-in, drop-in, slide-slam, punch-up, etc.
4. **Feedback** — confirm-thud, error-jolt, warning-bob, info-slide, etc.
5. **State/Interaction** — trapdoor, snap-shrink, wiggle, etc.
6. **Component** — toggle-thwack, check-pop, drag-lift, etc.
7. **Text/Scroll** — pendulum, ticker-scroll, typewriter-mono, etc.
8. **Loading** — shimmer, pulse, progress-fill-slam, etc.
9. **Attention** — shake, headbutt, spotlight, etc.
10. **Advanced** — spring-snap, rubber-band, morph-expand, card-flip, etc.

### Per-Animation Display

Each animation entry shows:
- Demo element with the animation applied
- Play/replay button to trigger the animation on demand
- Keyframe name (e.g., `fadeInUp`)
- Duration display (e.g., `240ms`)
- Easing function used

### Easing Visualizations

Canvas or SVG bezier curve plots for each easing token:
- `--ease-out` (cubic-bezier)
- `--ease-in-out` (cubic-bezier)
- `--ease-bounce` (cubic-bezier)
- `--ease-smooth` (cubic-bezier)
- `--ease-snappy` (cubic-bezier)
- `--ease-spring-gentle` (`linear()` multi-point)
- `--ease-spring-bouncy` (`linear()` multi-point)

---

## Dependencies

- **Stable `motion.css`** (Phase 4) — all 59 keyframes finalized
- **`foundation.css`** — motion tokens (timing, easing)
- **`tokens.css`** — for accent colors in demo elements

---

## What Needs Deciding

- **Documentation or showcase?** Is the motion catalog part of the developer documentation or part of the showcase site? Where does it live relative to `docs/index.html`?
- **Catalog navigation.** Jump links to categories? Sidebar TOC? Search/filter by keyframe name?
- **Play controls.** Click-to-play? Auto-play on scroll-into-view? Loop toggle?
- **Easing curve rendering.** Canvas-based (JavaScript) or SVG-based (declarative)? The `linear()` spring curves need special handling since they are multi-point, not cubic-bezier.
- **Responsive layout.** How many animations per row at various breakpoints? The 59-animation catalog is content-dense.

---

## Source References

- `Documentation/Specs/motion/keyframes.md` — documents 22 of 59 keyframes (those present in the main showcase)
- `Documentation/Specs/motion/animation-classes.md` — animation utility classes and stagger delays
- `Documentation/Architecture/Rebuild Plan.md` Phase 4 — motion system deliverables
- `Documentation/Architecture/Rebuild Plan.md` Phase 7.3 — motion catalog assembly
