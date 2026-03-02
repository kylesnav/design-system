# Animation Classes

> Complete reference for all animation utility classes defined in design-reference.html.

Cross-references: [[keyframes]] (the `@keyframes` these classes consume), [[motion]] (timing/easing tokens), [[inline-behaviors]] (JS that interacts with these classes).

---

## Reduced-Motion Wrapper

All animation utility classes in this document (sections 1--10) are defined inside:

```css
@layer component {
  @media (prefers-reduced-motion: no-preference) {
    /* animation classes here */
  }
}
```

When `prefers-reduced-motion: reduce` is active, a global override collapses all durations:

```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}
```

---

## 1. `.anim-in` -- Fade-In-Up Entrance

```css
.anim-in {
  animation: fadeInUp 0.5s var(--ease-smooth) both;
}
```

- **Keyframe**: `fadeInUp` -- opacity 0 -> 1, translateY(16px) -> 0
- **Duration**: `0.5s` (500ms)
- **Easing**: `var(--ease-smooth)` -- `cubic-bezier(0.22, 1, 0.36, 1)`
- **Fill mode**: `both` (retains start state before animation, end state after)
- **Usage**: Primary entrance animation. Combine with `.anim-d1` through `.anim-d12` for staggered reveals.

---

## 2. `.anim-text-stamp` -- Per-Character Stamp

```css
.anim-text-stamp {
  animation: text-stamp 200ms var(--ease-bounce) both;
}
```

- **Keyframe**: `text-stamp` -- translateY(-20px) + opacity 0 -> translateY(0) + opacity 1
- **Duration**: `200ms`
- **Easing**: `var(--ease-bounce)` -- `cubic-bezier(0.34, 1.56, 0.64, 1)`
- **Fill mode**: `both`
- **Usage**: Applied per-character. JS wraps each character in a `<span>` and adds this class with a stagger delay (~40ms per character).

---

## 3. Stagger Delay Classes

A series of 12 delay classes for sequential animation entrance. Each increments by 60ms.

| Class | `animation-delay` |
|---|---|
| `.anim-d1` | `0.06s` (60ms) |
| `.anim-d2` | `0.12s` (120ms) |
| `.anim-d3` | `0.18s` (180ms) |
| `.anim-d4` | `0.24s` (240ms) |
| `.anim-d5` | `0.30s` (300ms) |
| `.anim-d6` | `0.36s` (360ms) |
| `.anim-d7` | `0.42s` (420ms) |
| `.anim-d8` | `0.48s` (480ms) |
| `.anim-d9` | `0.54s` (540ms) |
| `.anim-d10` | `0.60s` (600ms) |
| `.anim-d11` | `0.66s` (660ms) |
| `.anim-d12` | `0.72s` (720ms) |

### CSS

```css
.anim-d1  { animation-delay: 0.06s; }
.anim-d2  { animation-delay: 0.12s; }
.anim-d3  { animation-delay: 0.18s; }
.anim-d4  { animation-delay: 0.24s; }
.anim-d5  { animation-delay: 0.30s; }
.anim-d6  { animation-delay: 0.36s; }
.anim-d7  { animation-delay: 0.42s; }
.anim-d8  { animation-delay: 0.48s; }
.anim-d9  { animation-delay: 0.54s; }
.anim-d10 { animation-delay: 0.60s; }
.anim-d11 { animation-delay: 0.66s; }
.anim-d12 { animation-delay: 0.72s; }
```

- **Increment**: 60ms per step
- **Usage**: Combine with `.anim-in` for staggered entrance: `<div class="anim-in anim-d3">` delays this element's `fadeInUp` by 180ms.
- **Maximum stagger**: 720ms (12 elements). For more than 12 elements, use JS-based stagger (see `staggerRevealGroup()` in [[inline-behaviors]]).

---

## 4. `.hover-lift` -- Hover Lift Utility

```css
.hover-lift {
  transition: transform var(--motion-fast) var(--ease-smooth),
              box-shadow var(--motion-fast) var(--ease-out);

  &:hover {
    transform: translateY(-3px) scale(1.01);
  }

  &:active {
    transform: translateY(0) scale(0.99);
  }
}
```

- **Transition duration**: `var(--motion-fast)` (160ms)
- **Transition easing**: `var(--ease-smooth)` for transform, `var(--ease-out)` for box-shadow
- **Hover state**: `translateY(-3px) scale(1.01)` -- lifts 3px up with subtle 1% scale increase
- **Active state**: `translateY(0) scale(0.99)` -- press down to origin with 1% scale decrease
- **Note**: Do NOT combine with `.tile` or `.card` classes -- they have their own hover/active transitions.

---

## 5. `.badge-pop` -- Badge Scale Pop

```css
.badge-pop {
  transition: transform var(--motion-fast) var(--ease-bounce);

  &:hover {
    transform: scale(1.08);
  }
}
```

- **Transition duration**: `var(--motion-fast)` (160ms)
- **Transition easing**: `var(--ease-bounce)` -- `cubic-bezier(0.34, 1.56, 0.64, 1)`
- **Hover state**: `scale(1.08)` -- 8% scale increase with bouncy overshoot
- **Usage**: Apply to badge elements for playful hover interaction.

---

## 6. `.toggle-knob-anim` -- Toggle Knob Slide

```css
.toggle-knob-anim {
  transition: transform var(--motion-fast) var(--ease-bounce);
}
```

- **Transition duration**: `var(--motion-fast)` (160ms)
- **Transition easing**: `var(--ease-bounce)` -- `cubic-bezier(0.34, 1.56, 0.64, 1)`
- **Usage**: Applied to the toggle switch knob element. The bouncy easing gives the knob a spring-like snap when toggling.

---

## 7. `.toggle-bg-anim` -- Toggle Background Color

```css
.toggle-bg-anim {
  transition: background-color var(--motion-fast) var(--ease-out);
}
```

- **Transition duration**: `var(--motion-fast)` (160ms)
- **Transition easing**: `var(--ease-out)` -- `cubic-bezier(0.16, 1, 0.3, 1)`
- **Usage**: Applied to the toggle switch track. Smoothly transitions background color between off (`--toggle-off-bg`) and on (`--toggle-on-bg`) states.

---

## 8. `.feedback-enter` -- Scale-In Feedback

```css
.feedback-enter {
  animation: scale-in var(--motion-fast) var(--ease-out) forwards;
}
```

- **Keyframe**: `scale-in` -- scale(0.8) + opacity 0 -> scale(1) + opacity 1
- **Duration**: `var(--motion-fast)` (160ms)
- **Easing**: `var(--ease-out)` -- `cubic-bezier(0.16, 1, 0.3, 1)`
- **Fill mode**: `forwards` (retains end state)
- **Usage**: Applied to success/confirmation feedback messages that pop in.

---

## 9. `.shake-anim` -- Error Shake

```css
.shake-anim {
  animation: shake var(--motion-base) var(--ease-out);
}
```

- **Keyframe**: `shake` -- translateX oscillation: 0 -> -6px -> 5px -> -4px -> 2px -> 0
- **Duration**: `var(--motion-base)` (240ms)
- **Easing**: `var(--ease-out)` -- `cubic-bezier(0.16, 1, 0.3, 1)`
- **Usage**: Error feedback. Apply to form fields or elements after validation failure.

---

## 10. Blur Grid Dimming

```css
.blur-grid:hover .blur-card:not(:hover) {
  filter: blur(2px);
  opacity: 0.7;
}

.blur-card {
  transition: filter var(--motion-base) var(--ease-out),
              opacity var(--motion-base) var(--ease-out),
              border-color var(--motion-fast) var(--ease-out);
}
```

- **Trigger**: Hovering any `.blur-card` inside a `.blur-grid`
- **Effect on non-hovered cards**: `filter: blur(2px)` + `opacity: 0.7`
- **Transition duration**: `var(--motion-base)` (240ms) for filter/opacity, `var(--motion-fast)` (160ms) for border-color
- **Transition easing**: `var(--ease-out)` -- `cubic-bezier(0.16, 1, 0.3, 1)`
- **Usage**: Apply `.blur-grid` to a container and `.blur-card` to each child. Hovering one card dims/blurs the others.

---

## 11. Skeleton Animation Classes

These classes are defined in the skeleton loading section. The keyframe-consuming declarations are inside `@media (prefers-reduced-motion: no-preference)`, while the base gradient setup is outside.

### `.skel-shimmer` -- Shimmer Mode

```css
/* Base (always applied) */
.skel-shimmer {
  background: linear-gradient(110deg, var(--bg-muted) 30%, var(--bg-subtle) 50%, var(--bg-muted) 70%);
  background-size: 200% 100%;
}

/* Animation (reduced-motion gated) */
@media (prefers-reduced-motion: no-preference) {
  .skel-shimmer {
    animation: playful-shimmer 2s linear infinite;
  }
}
```

- **Keyframe**: `playful-shimmer` -- background-position 200% -> -200%
- **Duration**: `2s` infinite loop
- **Easing**: `linear`

### `.skel-pulse` -- Pulse Mode

```css
@media (prefers-reduced-motion: no-preference) {
  .skel-pulse {
    animation: playful-pulse 1.6s var(--ease-bounce) infinite;
    transform-origin: center left;
  }
}
```

- **Keyframe**: `playful-pulse` -- scale(1) + opacity 1 -> scale(0.98) + opacity 0.6 -> back
- **Duration**: `1.6s` infinite loop
- **Easing**: `var(--ease-bounce)` -- `cubic-bezier(0.34, 1.56, 0.64, 1)`
- **Transform origin**: `center left` (pulse shrinks toward the left edge)

---

## 12. Tile Animation Classes

### `.tile-anim-bar` -- Tile Bar Pulse

```css
/* Base (always applied) */
.tile-anim-bar {
  height: 100%;
  border-radius: 2px;
  min-width: 4px;
}

/* Animation (reduced-motion gated) */
@media (prefers-reduced-motion: no-preference) {
  .tile-anim-bar {
    animation: tile-pulse 1.4s ease-in-out infinite;
    transform-origin: bottom;
  }

  .tile-anim-bar:nth-child(2) { animation-delay: 0.15s; }
  .tile-anim-bar:nth-child(3) { animation-delay: 0.3s; }
  .tile-anim-bar:nth-child(4) { animation-delay: 0.45s; }
  .tile-anim-bar:nth-child(5) { animation-delay: 0.6s; }
}
```

- **Keyframe**: `tile-pulse` -- scaleY(0.3) -> scaleY(1) -> scaleY(0.3)
- **Duration**: `1.4s` infinite loop
- **Easing**: `ease-in-out`
- **Transform origin**: `bottom` (bars grow upward)
- **Stagger**: 150ms per child (0s, 0.15s, 0.3s, 0.45s, 0.6s)

---

## 13. Splash Engine Classes

These classes are **not** wrapped in a reduced-motion media query at the CSS level. The JS splash engine checks `prefersReduced` before creating DOM elements.

### `.splash-container`

```css
.splash-container {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  overflow: visible;
  z-index: 100;
}
```

### `.splash-dot`

```css
.splash-dot {
  position: absolute;
  border-radius: 50%;
  background: var(--text-primary);
  pointer-events: none;
  animation: pop-anim 0.4s var(--ease-out) forwards;
  z-index: 101;
}
```

- **Keyframe**: `pop-anim` -- scale(1) translate(0,0) opacity 1 -> scale(0) translate(--tx, --ty) opacity 0
- **Duration**: `0.4s`
- **Easing**: `var(--ease-out)` -- `cubic-bezier(0.16, 1, 0.3, 1)`
- **Color overrides**: `.btn-primary`, `.btn-danger`, `.btn-gold` children use `var(--text-on-accent)` or `var(--text-on-gold)` background

### `.splash-ripple`

```css
.splash-ripple {
  position: absolute;
  width: 20px;
  height: 20px;
  margin-left: -10px;
  margin-top: -10px;
  border: 3px solid var(--border-strong);
  border-radius: 50%;
  pointer-events: none;
  animation: ripple-anim 0.5s var(--ease-out) forwards;
  z-index: 100;
}
```

- **Keyframe**: `ripple-anim` -- scale(0.5) border-width 6px opacity 1 -> scale(4) border-width 0px opacity 0
- **Duration**: `0.5s`
- **Easing**: `var(--ease-out)` -- `cubic-bezier(0.16, 1, 0.3, 1)`
- **Color overrides**: `.btn-primary`, `.btn-danger`, `.btn-gold` children use `var(--text-on-accent)` or `var(--text-on-gold)` border-color

---

## 14. Scroll-Driven Animation Classes

### `.scroll-progress`

```css
.scroll-progress {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: 3px;
  background: var(--accent-primary);
  transform-origin: left;
  transform: scaleX(0);
  z-index: var(--z-overlay);
}

@supports (animation-timeline: scroll()) {
  @media (prefers-reduced-motion: no-preference) {
    .scroll-progress {
      animation: scroll-progress-fill linear;
      animation-timeline: scroll();
    }
  }
}
```

- **Keyframe**: `scroll-progress-fill` -- scaleX(0) primary -> scaleX(1) green
- **Easing**: `linear` (mapped to scroll position)
- **Feature detection**: Wrapped in `@supports (animation-timeline: scroll())`
- **`prefers-reduced-motion`**: Double-gated (feature support + no-preference)

### `.scroll-reveal`

```css
@supports (animation-timeline: scroll()) {
  @media (prefers-reduced-motion: no-preference) {
    .scroll-reveal {
      animation: fadeInUp linear both;
      animation-timeline: view();
      animation-range: entry 0% entry 35%;
    }
  }
}
```

- **Keyframe**: `fadeInUp` -- opacity 0 + translateY(16px) -> opacity 1 + translateY(0)
- **Timeline**: `view()` (element's visibility in viewport)
- **Range**: `entry 0%` to `entry 35%` (animation completes when element is 35% into viewport)

---

## 15. Button Loading State

### `.btn-loading`

```css
.btn-loading {
  pointer-events: none;
  position: relative;
  color: transparent !important;

  &::after {
    content: "";
    position: absolute;
    inset: 0;
    margin: auto;
    width: 18px;
    height: 18px;
    border: 2px solid var(--text-on-accent);
    border-right-color: transparent;
    border-radius: 50%;
    animation: spin 0.6s linear infinite;
  }
}
```

- **Keyframe**: `spin` -- rotate(0deg) -> rotate(360deg)
- **Duration**: `0.6s` infinite loop
- **Easing**: `linear`
- **`prefers-reduced-motion`**: The `spin` keyframe is not inside a `no-preference` block, but the global `reduce` override (0.01ms duration) handles it.

---

## Class Interaction Guide

| Scenario | Classes | Notes |
|---|---|---|
| Staggered card entrance | `.anim-in .anim-d3` | Combine entrance + delay |
| Per-character text reveal | `.anim-text-stamp` + JS stagger | JS wraps chars, adds class per-char with incremental delay |
| Interactive card hover | `.blur-card` inside `.blur-grid` | Non-hovered siblings blur/dim |
| Playful badge | `.badge-pop` | Bouncy scale on hover |
| Lift card on hover | `.hover-lift` | Do not combine with `.tile` or `.card` |
| Toggle switch | `.toggle-knob-anim` + `.toggle-bg-anim` | Knob bounces, background fades |
| Success feedback | `.feedback-enter` | Scale-in pop |
| Error feedback | `.shake-anim` | Horizontal shake |
| Loading skeleton | `.skel-shimmer` or `.skel-pulse` | Toggle between modes with JS |
| Button loading | `.btn-loading` | Spinner replaces text |
| Click particles | `.splash-dot` + `.splash-ripple` | Created by JS splash engine |
