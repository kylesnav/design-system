---
title: "Motion"
date: 2026-03-02
type: spec
scope: mvp
status: active
---

# Motion

> Complete motion timing, easing, and accessibility specification for the Delightful Design System.

Cross-references: [[token-tiers]] (where these tokens live in the cascade), [[shadows]] (lift/press interaction timing).

---

## 1. Timing Tokens

Five duration tokens defined on `:root` inside `@layer component`. Each serves a specific interaction speed tier.

| CSS Custom Property | Value | Usage |
|---|---|---|
| `--motion-instant` | `100ms` | Micro-interactions: opacity fades, color changes, focus ring appearance |
| `--motion-fast` | `160ms` | Hover transitions: button hover, badge pop, toggle knob, blur-card filter |
| `--motion-base` | `240ms` | Standard transitions: shake animation, blur-grid opacity/filter |
| `--motion-slow` | `360ms` | Enter/exit animations: (reserved for component enter/exit) |
| `--motion-deliberate` | `500ms` | Page-level transitions: scroll-reveal, major state changes |

### Timing selection guidance

| Need | Token | Why |
|---|---|---|
| Feels instantaneous but visible | `--motion-instant` (100ms) | Below ~100ms, users perceive change as instant. This is the sweet spot for feedback without delay. |
| Responsive hover feedback | `--motion-fast` (160ms) | Fast enough to feel immediate, slow enough for the eye to register the transition. |
| Balanced state change | `--motion-base` (240ms) | Standard web animation duration. Visible, comfortable, not sluggish. |
| Attention-drawing entrance | `--motion-slow` (360ms) | Slow enough to draw attention to a new element appearing. |
| Intentional, paced reveal | `--motion-deliberate` (500ms) | For animations that should feel "considered" -- page transitions, progressive disclosure. |

---

## 2. Easing Tokens -- Cubic Bezier

Five cubic-bezier easing tokens defined on `:root` inside `@layer component`.

| CSS Custom Property | Value | Character | Usage |
|---|---|---|---|
| `--ease-out` | `cubic-bezier(0.16, 1, 0.3, 1)` | Standard deceleration -- fast start, gentle stop | Default for most transitions: hover states, shadow changes, opacity fades |
| `--ease-bounce` | `cubic-bezier(0.34, 1.56, 0.64, 1)` | Slight overshoot past target then settle | Badge pop (`.badge-pop`), toggle knob (`.toggle-knob-anim`), text-stamp animation |
| `--ease-smooth` | `cubic-bezier(0.22, 1, 0.36, 1)` | Smooth, natural deceleration (softer than `--ease-out`) | `.anim-in` (fadeInUp), `.hover-lift` transform, scroll-reveal |
| `--ease-slam` | `cubic-bezier(0.55, 0.06, 0.68, 0.19)` | Fast-in, hard stop -- abrupt arrival | Impact animations, error states, slam-down effects |
| `--ease-elastic` | `cubic-bezier(0.68, -0.55, 0.265, 1.55)` | Elastic overshoot on both ends -- pulls back before moving, overshoots target | Playful micro-interactions, spring-like button clicks |

---

## 3. Easing Tokens -- Spring Presets

Two spring easing tokens using the `linear()` function for true multi-oscillation spring curves. These create physically realistic spring motion that cubic-bezier cannot achieve.

Defined on `:root` inside `@layer component`.

### 3.1 Gentle Spring

```css
--ease-spring-gentle: linear(
  0, 0.006, 0.025 2.8%, 0.101 6.1%, 0.539 18.9%,
  0.721 25.3%, 0.849 31.5%, 0.937 38.1%, 0.968 41.8%,
  0.991 45.7%, 1.006 50%, 1.015 55%, 1.017 63.9%,
  1.001 85.9%, 1
);
```

**Character**: Subtle overshoot (peaks at ~1.017 around 64% of duration), then settles smoothly. Feels like a soft spring with high damping.

**When to use**: Natural-feeling entrances, dialog open, dropdown reveal -- anywhere you want organic motion without calling attention to the bounce.

### 3.2 Bouncy Spring

```css
--ease-spring-bouncy: linear(
  0, 0.004, 0.016, 0.035, 0.063 9.1%,
  0.141, 0.25, 0.391, 0.563, 0.765, 1,
  0.891, 0.813 45.5%, 0.785, 0.766, 0.754, 0.75,
  0.754, 0.766, 0.785, 0.813 63.6%, 0.891, 1 72.7%,
  0.973, 0.953, 0.941, 0.938, 0.941, 0.953, 0.973, 1,
  0.988, 0.984, 0.988, 1
);
```

**Character**: Multi-oscillation bounce with 3 visible oscillations. Overshoots to 1.0 at ~45%, bounces back to ~0.75, returns to 1.0 at ~73%, bounces to ~0.938, then settles. Feels like a spring with low damping.

**When to use**: Playful, attention-grabbing animations. Toast entrances, success celebrations, toggle snaps. Use sparingly -- this is a "delight" easing.

---

## 4. Timing + Easing Combinations

Recommended pairings for common interactions:

| Interaction | Timing | Easing | Example |
|---|---|---|---|
| Hover color/opacity change | `--motion-fast` (160ms) | `--ease-out` | `.blur-card` border-color transition |
| Hover lift + shadow | `--motion-fast` (160ms) | `--ease-smooth` (transform) + `--ease-out` (shadow) | `.hover-lift` |
| Badge scale pop | `--motion-fast` (160ms) | `--ease-bounce` | `.badge-pop` hover scale(1.08) |
| Toggle knob slide | `--motion-fast` (160ms) | `--ease-bounce` | `.toggle-knob-anim` |
| Toggle background color | `--motion-fast` (160ms) | `--ease-out` | `.toggle-bg-anim` |
| Fade-in-up entrance | `500ms` | `--ease-smooth` | `.anim-in` (fadeInUp) |
| Text stamp per-character | `200ms` | `--ease-bounce` | `.anim-text-stamp` |
| Scale-in feedback | `--motion-fast` (160ms) | `--ease-out` | `.feedback-enter` (scale-in) |
| Error shake | `--motion-base` (240ms) | `--ease-out` | `.shake-anim` |
| Blur-grid filter/opacity | `--motion-base` (240ms) | `--ease-out` | `.blur-card` filter + opacity |

---

## 5. The `prefers-reduced-motion` Gate

All animations and transitions in the system are gated behind the `prefers-reduced-motion` media query.

### 5.1 The enable gate

All `@keyframes` definitions and animation utility classes are wrapped inside:

```css
@media (prefers-reduced-motion: no-preference) {
  /* all @keyframes and animation classes live here */
}
```

This means: animations only run when the user has **not** requested reduced motion.

### 5.2 The disable gate

A global override disables all motion for users who prefer reduced motion:

```css
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}
```

This does two things:
1. Animations still technically "run" (completing instantly at 0.01ms), so `animationend` events still fire and JS logic depending on them is not broken.
2. The `!important` ensures no component can override this -- it is a global safety net.

Both rules live inside `@layer component`.

---

## 6. Keyframe Animations Reference

These keyframes are defined inside `@media (prefers-reduced-motion: no-preference)` within `@layer component`:

| Keyframe Name | Description | Used By |
|---|---|---|
| `fadeInUp` | Opacity 0 -> 1 + translateY(16px) -> 0 | `.anim-in`, `.scroll-reveal` |
| `fadeIn` | Opacity 0 -> 1 | General fade entrance |
| `shimmer` | background-position -200% -> 200% | Skeleton loading shimmer |
| `pulse-skel` | Opacity 1 -> 0.5 -> 1 | Skeleton loading pulse |
| `shake` | translateX oscillation: 0 -> -6 -> 5 -> -4 -> 2 -> 0 | `.shake-anim` error feedback |
| `checkmark-draw` | stroke-dashoffset 24 -> 0 | Checkbox success animation |
| `scale-in` | scale(0.8) + opacity 0 -> scale(1) + opacity 1 | `.feedback-enter` |
| `progress-shrink` | scaleX(1) -> scaleX(0) | Progress bar countdown |
| `typing` | width: 0 -> 28ch | Typewriter text effect |
| `blink` | border-color -> transparent at 50% | Cursor blink for typewriter |
| `easing-loop` | left: 0 -> calc(100% - 12px) -> 0 | Easing demo ball animation |
| `spin-slow` | rotate(0deg) -> rotate(360deg) | Slow rotation for decorative elements |
| `fadeOutRight` | opacity 1 + translateX(0) -> opacity 0 + translateX(100%) | Exit animation (right) |
| `slideInLeft` | opacity 0 + translateX(-100%) -> opacity 1 + translateX(0) | Slide-in entrance (left) |
| `text-stamp` | translateY(-20px) + opacity 0 -> translateY(0) + opacity 1 | Per-character stamp-in effect |
| `scroll-progress-fill` | scaleX(0) -> scaleX(1) with color shift (primary -> green) | `.scroll-progress` bar |

### Animation delay classes

Stagger classes for sequential animation entrance:

| Class | Delay |
|---|---|
| `.anim-d1` | `0.06s` |
| `.anim-d2` | `0.12s` |
| `.anim-d3` | `0.18s` |
| `.anim-d4` | `0.24s` |
| `.anim-d5` | `0.30s` |
| `.anim-d6` | `0.36s` |
| `.anim-d7` | `0.42s` |
| `.anim-d8` | `0.48s` |
| `.anim-d9` | `0.54s` |
| `.anim-d10` | `0.60s` |
| `.anim-d11` | `0.66s` |
| `.anim-d12` | `0.72s` |

Delay increment: 60ms per step.

---

## 7. Implementation CSS

Complete token definitions for an implementing agent to copy:

```css
@layer component {
  :root {
    --motion-instant: 100ms;
    --motion-fast: 160ms;
    --motion-base: 240ms;
    --motion-slow: 360ms;
    --motion-deliberate: 500ms;

    --ease-out: cubic-bezier(0.16, 1, 0.3, 1);
    --ease-bounce: cubic-bezier(0.34, 1.56, 0.64, 1);
    --ease-smooth: cubic-bezier(0.22, 1, 0.36, 1);
    --ease-slam: cubic-bezier(0.55, 0.06, 0.68, 0.19);
    --ease-elastic: cubic-bezier(0.68, -0.55, 0.265, 1.55);

    --ease-spring-gentle: linear(
      0, 0.006, 0.025 2.8%, 0.101 6.1%, 0.539 18.9%,
      0.721 25.3%, 0.849 31.5%, 0.937 38.1%, 0.968 41.8%,
      0.991 45.7%, 1.006 50%, 1.015 55%, 1.017 63.9%,
      1.001 85.9%, 1
    );
    --ease-spring-bouncy: linear(
      0, 0.004, 0.016, 0.035, 0.063 9.1%,
      0.141, 0.25, 0.391, 0.563, 0.765, 1,
      0.891, 0.813 45.5%, 0.785, 0.766, 0.754, 0.75,
      0.754, 0.766, 0.785, 0.813 63.6%, 0.891, 1 72.7%,
      0.973, 0.953, 0.941, 0.938, 0.941, 0.953, 0.973, 1,
      0.988, 0.984, 0.988, 1
    );
  }
}
```
