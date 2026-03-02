# Keyframes

> Complete `@keyframes` reference for all 59 named animations across both `design-reference.html` (22 keyframes) and `delightful-motion.html` (37 additional unique definitions, 2 reuses). Total unique keyframe rules: 55.

Cross-references: [[motion]] (timing/easing tokens), [[animation-classes]] (utility classes that consume these keyframes), [[inline-behaviors]] (JS that triggers animations).

---

## Reduced-Motion Gate

All keyframes in sections 1--16 are defined inside:

```css
@layer component {
  @media (prefers-reduced-motion: no-preference) {
    /* keyframes here */
  }
}
```

Keyframes in sections 17--20 are defined inside `@media (prefers-reduced-motion: no-preference)` in their respective component sections. Sections 21--22 (`pop-anim`, `ripple-anim`) are **not** gated by `prefers-reduced-motion` at the CSS level -- the JS splash engine checks `prefersReduced` before creating DOM elements.

A global reduced-motion override also exists:

```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}
```

---

## 1. fadeInUp

```css
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(16px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
```

- **Used by**: `.anim-in` (entrance animation), `.scroll-reveal` (scroll-driven)
- **Recommended duration**: `500ms` (as used by `.anim-in`) or `linear` with `animation-timeline: scroll()` for scroll-driven
- **Recommended easing**: `var(--ease-smooth)` -- `cubic-bezier(0.22, 1, 0.36, 1)`
- **`prefers-reduced-motion`**: Gated inside `no-preference` block

---

## 2. fadeIn

```css
@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}
```

- **Used by**: General fade entrance utility
- **Recommended duration**: `var(--motion-fast)` (160ms) to `var(--motion-base)` (240ms)
- **Recommended easing**: `var(--ease-out)` -- `cubic-bezier(0.16, 1, 0.3, 1)`
- **`prefers-reduced-motion`**: Gated inside `no-preference` block

---

## 3. shimmer

```css
@keyframes shimmer {
  0% {
    background-position: -200% 0;
  }
  100% {
    background-position: 200% 0;
  }
}
```

- **Used by**: Skeleton loading shimmer (older variant -- see also `playful-shimmer` in section 19)
- **Recommended duration**: `1.5s--2s` infinite loop
- **Recommended easing**: `linear`
- **`prefers-reduced-motion`**: Gated inside `no-preference` block

---

## 4. pulse-skel

```css
@keyframes pulse-skel {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
}
```

- **Used by**: Skeleton loading pulse mode (older variant -- see also `playful-pulse` in section 20)
- **Recommended duration**: `1.5s--2s` infinite loop
- **Recommended easing**: `ease-in-out`
- **`prefers-reduced-motion`**: Gated inside `no-preference` block

---

## 5. shake

```css
@keyframes shake {
  0%, 100% {
    transform: translateX(0);
  }
  20% {
    transform: translateX(-6px);
  }
  40% {
    transform: translateX(5px);
  }
  60% {
    transform: translateX(-4px);
  }
  80% {
    transform: translateX(2px);
  }
}
```

- **Used by**: `.shake-anim` (error feedback)
- **Recommended duration**: `var(--motion-base)` (240ms)
- **Recommended easing**: `var(--ease-out)` -- `cubic-bezier(0.16, 1, 0.3, 1)`
- **`prefers-reduced-motion`**: Gated inside `no-preference` block

---

## 6. checkmark-draw

```css
@keyframes checkmark-draw {
  from {
    stroke-dashoffset: 24;
  }
  to {
    stroke-dashoffset: 0;
  }
}
```

- **Used by**: Checkbox success animation (SVG stroke reveal)
- **Recommended duration**: `var(--motion-fast)` (160ms) to `var(--motion-base)` (240ms)
- **Recommended easing**: `var(--ease-out)` -- `cubic-bezier(0.16, 1, 0.3, 1)`
- **`prefers-reduced-motion`**: Gated inside `no-preference` block

---

## 7. scale-in

```css
@keyframes scale-in {
  from {
    transform: scale(0.8);
    opacity: 0;
  }
  to {
    transform: scale(1);
    opacity: 1;
  }
}
```

- **Used by**: `.feedback-enter` (success/confirmation feedback)
- **Recommended duration**: `var(--motion-fast)` (160ms)
- **Recommended easing**: `var(--ease-out)` -- `cubic-bezier(0.16, 1, 0.3, 1)`
- **`prefers-reduced-motion`**: Gated inside `no-preference` block

---

## 8. progress-shrink

```css
@keyframes progress-shrink {
  from {
    transform: scaleX(1);
  }
  to {
    transform: scaleX(0);
  }
}
```

- **Used by**: Toast progress bar countdown (`.toast-progress-bar`)
- **Recommended duration**: `5s` (matches toast auto-dismiss duration)
- **Recommended easing**: `linear`
- **`prefers-reduced-motion`**: Gated inside `no-preference` block. JS also checks `prefersReduced` before applying the animation.

---

## 9. typing

```css
@keyframes typing {
  to {
    width: 28ch;
  }
}
```

- **Used by**: Typewriter text effect
- **Recommended duration**: `2s--3s` (depends on text length)
- **Recommended easing**: `steps()` (step function matching character count)
- **`prefers-reduced-motion`**: Gated inside `no-preference` block

---

## 10. blink

```css
@keyframes blink {
  50% {
    border-color: transparent;
  }
}
```

- **Used by**: Cursor blink for typewriter effect (paired with `typing`)
- **Recommended duration**: `0.8s--1s` infinite loop
- **Recommended easing**: `step-end`
- **`prefers-reduced-motion`**: Gated inside `no-preference` block

---

## 11. easing-loop

```css
@keyframes easing-loop {
  0% {
    left: 0;
  }
  45% {
    left: calc(100% - 12px);
  }
  55% {
    left: calc(100% - 12px);
  }
  100% {
    left: 0;
  }
}
```

- **Used by**: Easing demonstration dots (bouncing ball animation showing different curves)
- **Recommended duration**: `2s` infinite loop
- **Recommended easing**: Applied per-dot with the easing being demonstrated (e.g. `var(--ease-out)`, `var(--ease-bounce)`, etc.)
- **`prefers-reduced-motion`**: Gated inside `no-preference` block

---

## 12. spin-slow

```css
@keyframes spin-slow {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}
```

- **Used by**: Slow rotation for decorative/loading elements
- **Recommended duration**: `3s--5s` infinite loop
- **Recommended easing**: `linear`
- **`prefers-reduced-motion`**: Gated inside `no-preference` block

---

## 13. fadeOutRight

```css
@keyframes fadeOutRight {
  from {
    opacity: 1;
    transform: translateX(0);
  }
  to {
    opacity: 0;
    transform: translateX(100%);
  }
}
```

- **Used by**: Exit animation (slide out to right)
- **Recommended duration**: `var(--motion-base)` (240ms) to `var(--motion-slow)` (360ms)
- **Recommended easing**: `var(--ease-out)` -- `cubic-bezier(0.16, 1, 0.3, 1)`
- **`prefers-reduced-motion`**: Gated inside `no-preference` block

---

## 14. slideInLeft

```css
@keyframes slideInLeft {
  from {
    opacity: 0;
    transform: translateX(-100%);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}
```

- **Used by**: Slide-in entrance from the left
- **Recommended duration**: `var(--motion-base)` (240ms) to `var(--motion-slow)` (360ms)
- **Recommended easing**: `var(--ease-smooth)` -- `cubic-bezier(0.22, 1, 0.36, 1)`
- **`prefers-reduced-motion`**: Gated inside `no-preference` block

---

## 15. text-stamp

```css
@keyframes text-stamp {
  0% {
    transform: translateY(-20px);
    opacity: 0;
  }
  100% {
    transform: translateY(0);
    opacity: 1;
  }
}
```

- **Used by**: `.anim-text-stamp` (per-character stamp-in effect, staggered via JS at ~40ms intervals)
- **Recommended duration**: `200ms`
- **Recommended easing**: `var(--ease-bounce)` -- `cubic-bezier(0.34, 1.56, 0.64, 1)`
- **`prefers-reduced-motion`**: Gated inside `no-preference` block

---

## 16. scroll-progress-fill

```css
@keyframes scroll-progress-fill {
  0% {
    transform: scaleX(0);
    background-color: var(--accent-primary);
  }
  99% {
    background-color: var(--accent-primary);
  }
  100% {
    transform: scaleX(1);
    background-color: var(--accent-green);
  }
}
```

- **Used by**: `.scroll-progress` (fixed top bar that fills as user scrolls)
- **Recommended duration**: N/A -- driven by `animation-timeline: scroll()`
- **Recommended easing**: `linear` (scroll-driven, so easing maps to scroll position)
- **`prefers-reduced-motion`**: Gated inside both `@supports (animation-timeline: scroll())` and `@media (prefers-reduced-motion: no-preference)`
- **Note**: Color shifts from `--accent-primary` to `--accent-green` only at the very end (99%--100% range)

---

## 17. tile-pulse

```css
@keyframes tile-pulse {
  0%, 100% {
    transform: scaleY(0.3);
  }
  50% {
    transform: scaleY(1);
  }
}
```

- **Used by**: `.tile-anim-bar` (animated bars in tile grid decorations)
- **Recommended duration**: `1.4s` infinite loop
- **Recommended easing**: `ease-in-out`
- **`prefers-reduced-motion`**: Gated inside its own `@media (prefers-reduced-motion: no-preference)` block
- **Stagger**: nth-child delays: `:nth-child(2)` 0.15s, `:nth-child(3)` 0.3s, `:nth-child(4)` 0.45s, `:nth-child(5)` 0.6s

---

## 18. spin

```css
@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}
```

- **Used by**: `.btn-loading::after` (button loading spinner)
- **Recommended duration**: `0.6s` infinite loop
- **Recommended easing**: `linear`
- **`prefers-reduced-motion`**: **Not** inside a `no-preference` block at the keyframe level. The global `prefers-reduced-motion: reduce` override (0.01ms duration) handles it.

---

## 19. playful-shimmer

```css
@keyframes playful-shimmer {
  0% {
    background-position: 200% 0;
  }
  100% {
    background-position: -200% 0;
  }
}
```

- **Used by**: `.skel-shimmer` (skeleton loading shimmer -- playful variant)
- **Recommended duration**: `2s` infinite loop
- **Recommended easing**: `linear`
- **`prefers-reduced-motion`**: Gated inside `@media (prefers-reduced-motion: no-preference)` in the skeleton section
- **Note**: Direction is reversed compared to the generic `shimmer` keyframe (200% -> -200% vs -200% -> 200%)

---

## 20. playful-pulse

```css
@keyframes playful-pulse {
  0%, 100% {
    transform: scale(1);
    opacity: 1;
  }
  50% {
    transform: scale(0.98);
    opacity: 0.6;
  }
}
```

- **Used by**: `.skel-pulse` (skeleton loading pulse -- playful variant)
- **Recommended duration**: `1.6s` infinite loop
- **Recommended easing**: `var(--ease-bounce)` -- `cubic-bezier(0.34, 1.56, 0.64, 1)`
- **`prefers-reduced-motion`**: Gated inside `@media (prefers-reduced-motion: no-preference)` in the skeleton section
- **Note**: Uses both `transform: scale()` and `opacity` (unlike `pulse-skel` which only uses opacity). `transform-origin: center left` is set on the class.

---

## 21. pop-anim

```css
@keyframes pop-anim {
  0% {
    transform: scale(1) translate(0, 0);
    opacity: 1;
  }
  100% {
    transform: scale(0) translate(var(--tx), var(--ty));
    opacity: 0;
  }
}
```

- **Used by**: `.splash-dot` (particle dots in splash/pop interaction engine)
- **Recommended duration**: `0.4s`
- **Recommended easing**: `var(--ease-out)` -- `cubic-bezier(0.16, 1, 0.3, 1)`
- **`prefers-reduced-motion`**: **Not** gated at CSS level. The JS splash engine checks `prefersReduced` and skips DOM creation entirely.
- **Note**: Uses CSS custom properties `--tx` and `--ty` set per-particle by the JS engine. Direction and velocity are randomized.

---

## 22. ripple-anim

```css
@keyframes ripple-anim {
  0% {
    transform: scale(0.5);
    opacity: 1;
    border-width: 6px;
  }
  100% {
    transform: scale(4);
    opacity: 0;
    border-width: 0px;
  }
}
```

- **Used by**: `.splash-ripple` (ripple ring in splash/pop interaction engine)
- **Recommended duration**: `0.5s`
- **Recommended easing**: `var(--ease-out)` -- `cubic-bezier(0.16, 1, 0.3, 1)`
- **`prefers-reduced-motion`**: **Not** gated at CSS level. The JS splash engine checks `prefersReduced` and skips DOM creation entirely.
- **Note**: Expands from `scale(0.5)` to `scale(4)` while border thins from `6px` to `0px` and fades out.

---

## 2. Extended Keyframe Catalog (from delightful-motion.html)

> All 37 new unique keyframe definitions from `delightful-motion.html`, organized by the 10 motion categories used in that file. Two scroll-driven demos (`scroll-stamp-in`, `scroll-reveal-wipe`) reuse existing keyframes from Category 1 rather than defining new ones; those are noted as reuses.

**Reduced-motion gate (motion.html global):** All keyframes in this section are defined inside a single top-level `@media (prefers-reduced-motion: no-preference)` block. A global `reduce` override also collapses all animation durations to `0.01ms`:

```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
}
```

Scroll-driven keyframes (`scroll-parallax-shadow`, `scroll-rotate-in`, `scroll-progress-track`) are additionally gated inside `@supports (animation-timeline: scroll())`.

---

### Category 1 — Entrances

---

#### 23. stamp-in

```css
@keyframes stamp-in {
  0% {
    transform: scale(1.4) translateY(-20px);
    box-shadow: 0 0 0 transparent;
    opacity: 0;
  }
  60% {
    opacity: 1;
  }
  100% {
    transform: scale(1) translateY(0);
    box-shadow: var(--shadow-md);
    opacity: 1;
  }
}
```

- **Category**: Entrance
- **Utility class**: `.anim-stamp-in { animation: stamp-in 360ms var(--ease-bounce) both; }`
- **Used by**: Hero sections, modals. Also reused by scroll category as `.scroll-anim-stamp-in` (see Category 9).
- **Recommended duration**: `360ms`
- **Recommended easing**: `var(--ease-bounce)` -- `cubic-bezier(0.34, 1.56, 0.64, 1)`
- **`prefers-reduced-motion`**: Gated inside `@media (prefers-reduced-motion: no-preference)`
- **Tags**: hero, modal

---

#### 24. drop-in

```css
@keyframes drop-in {
  0% {
    transform: translateY(-60px) rotate(2deg);
    opacity: 0;
  }
  50% {
    opacity: 1;
  }
  100% {
    transform: translateY(0) rotate(0deg);
    opacity: 1;
  }
}
```

- **Category**: Entrance
- **Utility class**: `.anim-drop-in { animation: drop-in 360ms var(--ease-bounce) both; }`
- **Used by**: Cards, notifications
- **Recommended duration**: `360ms`
- **Recommended easing**: `var(--ease-bounce)` -- `cubic-bezier(0.34, 1.56, 0.64, 1)`
- **`prefers-reduced-motion`**: Gated inside `@media (prefers-reduced-motion: no-preference)`
- **Tags**: card, notification

---

#### 25. slide-slam

```css
@keyframes slide-slam {
  0% {
    transform: translateX(-100px) rotate(-3deg);
    opacity: 0;
  }
  40% {
    opacity: 1;
  }
  100% {
    transform: translateX(0) rotate(0deg);
    opacity: 1;
  }
}
```

- **Category**: Entrance
- **Utility class**: `.anim-slide-slam { animation: slide-slam 360ms var(--ease-out) both; }`
- **Used by**: Drawers, panels. Component recipe: Toast entrance.
- **Recommended duration**: `360ms`
- **Recommended easing**: `var(--ease-out)` -- `cubic-bezier(0.16, 1, 0.3, 1)`
- **`prefers-reduced-motion`**: Gated inside `@media (prefers-reduced-motion: no-preference)`
- **Tags**: drawer, panel

---

#### 26. punch-up

```css
@keyframes punch-up {
  0% {
    transform: translateY(40px);
    opacity: 0;
  }
  40% {
    opacity: 1;
  }
  70% {
    transform: translateY(-8px);
  }
  100% {
    transform: translateY(0);
    opacity: 1;
  }
}
```

- **Category**: Entrance
- **Utility class**: `.anim-punch-up { animation: punch-up 240ms var(--ease-bounce) both; }`
- **Used by**: Tooltips, popovers
- **Recommended duration**: `240ms`
- **Recommended easing**: `var(--ease-bounce)` -- `cubic-bezier(0.34, 1.56, 0.64, 1)`
- **`prefers-reduced-motion`**: Gated inside `@media (prefers-reduced-motion: no-preference)`
- **Tags**: tooltip, popover

---

#### 27. unfold

```css
@keyframes unfold {
  0% {
    transform: scaleY(0);
    opacity: 0;
  }
  100% {
    transform: scaleY(1);
    opacity: 1;
  }
}
```

- **Category**: Entrance
- **Utility class**: `.anim-unfold { animation: unfold 240ms var(--ease-smooth) both; transform-origin: top; }`
- **Used by**: Accordions, menus. `transform-origin: top` is set on the class.
- **Recommended duration**: `240ms`
- **Recommended easing**: `var(--ease-smooth)` -- `cubic-bezier(0.22, 1, 0.36, 1)`
- **`prefers-reduced-motion`**: Gated inside `@media (prefers-reduced-motion: no-preference)`
- **Tags**: accordion, menu

---

#### 28. brick-stack

```css
@keyframes brick-stack {
  0% {
    transform: translateY(20px);
    opacity: 0;
  }
  100% {
    transform: translateY(0);
    opacity: 1;
  }
}
```

- **Category**: Entrance
- **Utility class**: `.anim-brick-stack { animation: brick-stack 160ms var(--ease-out) both; }`
- **Used by**: Lists, grids. Component recipe: Card entrance. Stagger via JS at 60ms per child.
- **Recommended duration**: `160ms`
- **Recommended easing**: `var(--ease-out)` -- `cubic-bezier(0.16, 1, 0.3, 1)`
- **`prefers-reduced-motion`**: Gated inside `@media (prefers-reduced-motion: no-preference)`
- **Tags**: list, grid

---

#### 29. pop-stamp

```css
@keyframes pop-stamp {
  0% {
    transform: scale(0);
    border-radius: 50%;
    opacity: 0;
  }
  60% {
    transform: scale(1.15);
    opacity: 1;
  }
  100% {
    transform: scale(1);
    border-radius: var(--radius-md);
    opacity: 1;
  }
}
```

- **Category**: Entrance
- **Utility class**: `.anim-pop-stamp { animation: pop-stamp 360ms var(--ease-bounce) both; }`
- **Used by**: Badges, notification indicators
- **Recommended duration**: `360ms`
- **Recommended easing**: `var(--ease-bounce)` -- `cubic-bezier(0.34, 1.56, 0.64, 1)`
- **`prefers-reduced-motion`**: Gated inside `@media (prefers-reduced-motion: no-preference)`
- **Note**: `border-radius` morphs from `50%` (circle) to `var(--radius-md)` (rounded rect) at end
- **Tags**: badge, notification

---

#### 30. shutter-reveal

```css
@keyframes shutter-reveal {
  0% {
    clip-path: inset(0 100% 0 0);
  }
  100% {
    clip-path: inset(0 0 0 0);
  }
}
```

- **Category**: Entrance
- **Utility class**: `.anim-shutter-reveal { animation: shutter-reveal 360ms var(--ease-out) both; }`
- **Used by**: Images, content blocks. Also reused by scroll category as `.scroll-anim-reveal-wipe` (see Category 9).
- **Recommended duration**: `360ms`
- **Recommended easing**: `var(--ease-out)` -- `cubic-bezier(0.16, 1, 0.3, 1)`
- **`prefers-reduced-motion`**: Gated inside `@media (prefers-reduced-motion: no-preference)`
- **Tags**: image, content

---

### Category 2 — Exits

---

#### 31. fling-right

```css
@keyframes fling-right {
  0% {
    transform: translateX(0) rotate(0deg);
    opacity: 1;
  }
  100% {
    transform: translateX(200px) rotate(8deg);
    opacity: 0;
  }
}
```

- **Category**: Exit
- **Utility class**: `.anim-fling-right { animation: fling-right 240ms var(--ease-out) both; }`
- **Used by**: Dismiss/swipe interactions. Component recipe: Toast exit.
- **Recommended duration**: `240ms`
- **Recommended easing**: `var(--ease-out)` -- `cubic-bezier(0.16, 1, 0.3, 1)`
- **`prefers-reduced-motion`**: Gated inside `@media (prefers-reduced-motion: no-preference)`
- **Tags**: dismiss, swipe

---

#### 32. press-away

```css
@keyframes press-away {
  0% {
    transform: scale(1);
    box-shadow: var(--shadow-md);
    opacity: 1;
  }
  100% {
    transform: scale(0.9);
    box-shadow: 0 0 0 transparent;
    opacity: 0;
  }
}
```

- **Category**: Exit
- **Utility class**: `.anim-press-away { animation: press-away 240ms var(--ease-out) both; }`
- **Used by**: Close/dismiss actions. Component recipe: Modal exit, Alert exit.
- **Recommended duration**: `240ms`
- **Recommended easing**: `var(--ease-out)` -- `cubic-bezier(0.16, 1, 0.3, 1)`
- **`prefers-reduced-motion`**: Gated inside `@media (prefers-reduced-motion: no-preference)`
- **Tags**: close, modal

---

#### 33. crumple

```css
@keyframes crumple {
  0% {
    transform: scale(1) rotate(0deg);
    opacity: 1;
  }
  20% {
    transform: scale(0.8) rotate(5deg);
    opacity: 0.8;
  }
  40% {
    transform: scale(0.6) rotate(-3deg);
    opacity: 0.6;
  }
  60% {
    transform: scale(0.45) rotate(7deg);
    opacity: 0.4;
  }
  80% {
    transform: scale(0.35) rotate(0deg);
    opacity: 0.2;
  }
  100% {
    transform: scale(0.3) rotate(0deg);
    opacity: 0;
  }
}
```

- **Category**: Exit
- **Utility class**: `.anim-crumple { animation: crumple 360ms var(--ease-slam) both; }`
- **Used by**: Delete / discard destructive actions
- **Recommended duration**: `360ms`
- **Recommended easing**: `var(--ease-slam)` (fast-in, linear-out)
- **`prefers-reduced-motion`**: Gated inside `@media (prefers-reduced-motion: no-preference)`
- **Tags**: delete, discard

---

#### 34. trapdoor

```css
@keyframes trapdoor {
  0% {
    transform: perspective(600px) rotateX(0deg);
    opacity: 1;
  }
  80% {
    opacity: 1;
  }
  100% {
    transform: perspective(600px) rotateX(90deg);
    opacity: 0;
  }
}
```

- **Category**: Exit
- **Utility class**: `.anim-trapdoor { animation: trapdoor 300ms var(--ease-slam) both; transform-origin: bottom center; }`
- **Used by**: Removing list items. Component recipe: Card exit.
- **Recommended duration**: `300ms`
- **Recommended easing**: `var(--ease-slam)`
- **`prefers-reduced-motion`**: Gated inside `@media (prefers-reduced-motion: no-preference)`
- **Note**: `transform-origin: bottom center` is set on the class. Opacity holds until 80% then snaps out.
- **Tags**: remove, list

---

#### 35. snap-shrink

```css
@keyframes snap-shrink {
  0% {
    transform: scale(1);
    opacity: 1;
  }
  100% {
    transform: scale(0);
    opacity: 0;
  }
}
```

- **Category**: Exit
- **Utility class**: `.anim-snap-shrink { animation: snap-shrink 160ms var(--ease-out) both; }`
- **Used by**: Quick/decisive removal interactions
- **Recommended duration**: `160ms`
- **Recommended easing**: `var(--ease-out)` -- `cubic-bezier(0.16, 1, 0.3, 1)`
- **`prefers-reduced-motion`**: Gated inside `@media (prefers-reduced-motion: no-preference)`
- **Tags**: instant, decisive

---

#### 36. gravity-fall

```css
@keyframes gravity-fall {
  0% {
    transform: translateY(0) rotate(0deg);
    box-shadow: var(--shadow-md);
    opacity: 1;
  }
  30% {
    box-shadow: var(--shadow-lg);
  }
  100% {
    transform: translateY(300px) rotate(12deg);
    box-shadow: 0 0 0 transparent;
    opacity: 0;
  }
}
```

- **Category**: Exit
- **Utility class**: `.anim-gravity-fall { animation: gravity-fall 500ms var(--ease-slam) both; }`
- **Used by**: Dramatic removal, error states
- **Recommended duration**: `500ms`
- **Recommended easing**: `var(--ease-slam)`
- **`prefers-reduced-motion`**: Gated inside `@media (prefers-reduced-motion: no-preference)`
- **Note**: Shadow briefly grows at 30% (lifting off surface) before collapsing as element falls
- **Tags**: dramatic, error

---

### Category 3 — Attention / Spotlight

---

#### 37. knock

```css
@keyframes knock {
  0%   { transform: translateX(0); }
  15%  { transform: translateX(12px); }
  30%  { transform: translateX(-10px); }
  50%  { transform: translateX(6px); }
  70%  { transform: translateX(-3px); }
  85%  { transform: translateX(1px); }
  100% { transform: translateX(0); }
}
```

- **Category**: Attention
- **Utility class**: `.anim-knock { animation: knock 400ms linear both; }`
- **Used by**: Drawing attention to interactive elements; more emphatic than `wiggle`
- **Recommended duration**: `400ms`
- **Recommended easing**: `linear`
- **`prefers-reduced-motion`**: Gated inside `@media (prefers-reduced-motion: no-preference)`

---

#### 38. stamp-pulse

```css
@keyframes stamp-pulse {
  0% {
    transform: scale(1);
    box-shadow: var(--shadow-md);
  }
  35% {
    transform: scale(1.08);
    box-shadow: var(--shadow-lg);
  }
  65% {
    transform: scale(0.96);
    box-shadow: var(--shadow-sm);
  }
  100% {
    transform: scale(1);
    box-shadow: var(--shadow-md);
  }
}
```

- **Category**: Attention
- **Utility class**: `.anim-stamp-pulse { animation: stamp-pulse 500ms var(--ease-bounce) both; }`
- **Used by**: Highlighting interactive cards, drawing attention to a focused element
- **Recommended duration**: `500ms`
- **Recommended easing**: `var(--ease-bounce)` -- `cubic-bezier(0.34, 1.56, 0.64, 1)`
- **`prefers-reduced-motion`**: Gated inside `@media (prefers-reduced-motion: no-preference)`

---

#### 39. wiggle

```css
@keyframes wiggle {
  0%   { transform: rotate(0deg); }
  15%  { transform: rotate(3deg); }
  30%  { transform: rotate(-3deg); }
  50%  { transform: rotate(2deg); }
  70%  { transform: rotate(-1deg); }
  100% { transform: rotate(0deg); }
}
```

- **Category**: Attention
- **Utility class**: `.anim-wiggle { animation: wiggle 500ms var(--ease-out) both; }`
- **Used by**: Small rotational attention grab (lighter than `knock`)
- **Recommended duration**: `500ms`
- **Recommended easing**: `var(--ease-out)` -- `cubic-bezier(0.16, 1, 0.3, 1)`
- **`prefers-reduced-motion`**: Gated inside `@media (prefers-reduced-motion: no-preference)`

---

#### 40. spotlight

```css
@keyframes spotlight {
  0% {
    box-shadow: var(--shadow-md);
  }
  50% {
    box-shadow: 0 0 0 6px var(--accent-primary);
  }
  100% {
    box-shadow: var(--shadow-md);
  }
}
```

- **Category**: Attention
- **Utility class**: `.anim-spotlight { animation: spotlight 1200ms var(--ease-smooth) both; }`
- **Used by**: Onboarding highlights, feature callouts. Component recipe: Card spotlight.
- **Recommended duration**: `1200ms`
- **Recommended easing**: `var(--ease-smooth)` -- `cubic-bezier(0.22, 1, 0.36, 1)`
- **`prefers-reduced-motion`**: Gated inside `@media (prefers-reduced-motion: no-preference)`

---

#### 41. headbutt

```css
@keyframes headbutt {
  0%   { transform: translateY(0); }
  25%  { transform: translateY(-16px); }
  50%  { transform: translateY(0); }
  70%  { transform: translateY(-6px); }
  100% { transform: translateY(0); }
}
```

- **Category**: Attention
- **Utility class**: `.anim-headbutt { animation: headbutt 400ms var(--ease-bounce) both; }`
- **Used by**: Notification badges, icon attention-grab
- **Recommended duration**: `400ms`
- **Recommended easing**: `var(--ease-bounce)` -- `cubic-bezier(0.34, 1.56, 0.64, 1)`
- **`prefers-reduced-motion`**: Gated inside `@media (prefers-reduced-motion: no-preference)`

---

#### 42. border-march

```css
@keyframes border-march {
  0% {
    background-position: 0 0, 100% 0, 0 100%, 0 0;
  }
  100% {
    background-position: 16px 0, 100% 16px, -16px 100%, 0 -16px;
  }
}
```

- **Category**: Attention
- **Utility class**:

```css
.anim-border-march {
  background-image:
    repeating-linear-gradient(90deg, var(--text-primary) 0 4px, transparent 4px 8px),
    repeating-linear-gradient(180deg, var(--text-primary) 0 4px, transparent 4px 8px),
    repeating-linear-gradient(90deg, var(--text-primary) 0 4px, transparent 4px 8px),
    repeating-linear-gradient(180deg, var(--text-primary) 0 4px, transparent 4px 8px);
  background-size: 8px 2px, 2px 8px, 8px 2px, 2px 8px;
  background-position: 0 0, 100% 0, 0 100%, 0 0;
  background-repeat: repeat-x, repeat-y, repeat-x, repeat-y;
  animation: border-march 800ms linear infinite;
}
```

- **Used by**: Selected elements, drag-and-drop targets, "marching ants" selection indicator
- **Recommended duration**: `800ms` infinite loop
- **Recommended easing**: `linear`
- **`prefers-reduced-motion`**: Gated inside `@media (prefers-reduced-motion: no-preference)`
- **Note**: The animated border is constructed entirely from `repeating-linear-gradient` background layers; no actual `border` property is used

---

### Category 4 — Feedback

---

#### 43. confirm-thud

```css
@keyframes confirm-thud {
  0% {
    transform: scale(0);
    background-color: var(--accent-green-subtle);
    opacity: 0;
  }
  50% {
    transform: scale(1.1);
    opacity: 1;
  }
  70% {
    transform: scale(0.95);
  }
  100% {
    transform: scale(1);
    background-color: transparent;
    opacity: 1;
  }
}
```

- **Category**: Feedback
- **Utility class**: `.anim-confirm-thud { animation: confirm-thud 360ms var(--ease-bounce) both; }`
- **Used by**: Success confirmation states. Component recipe: Toast feedback.
- **Recommended duration**: `360ms`
- **Recommended easing**: `var(--ease-bounce)` -- `cubic-bezier(0.34, 1.56, 0.64, 1)`
- **`prefers-reduced-motion`**: Gated inside `@media (prefers-reduced-motion: no-preference)`
- **Note**: `background-color` briefly shows `--accent-green-subtle` at start, fades to transparent at 100%

---

#### 44. error-jolt

```css
@keyframes error-jolt {
  0%   { transform: translateX(0); background-color: transparent; }
  20%  { transform: translateX(8px); background-color: var(--accent-danger-subtle); }
  40%  { transform: translateX(-8px); background-color: transparent; }
  60%  { transform: translateX(4px); }
  80%  { transform: translateX(-2px); }
  100% { transform: translateX(0); }
}
```

- **Category**: Feedback
- **Utility class**: `.anim-error-jolt { animation: error-jolt 500ms linear both; }`
- **Used by**: Form validation failures, error alerts. Component recipe: Alert feedback.
- **Recommended duration**: `500ms`
- **Recommended easing**: `linear`
- **`prefers-reduced-motion`**: Gated inside `@media (prefers-reduced-motion: no-preference)`
- **Note**: Background flashes `--accent-danger-subtle` at peak displacement (20%) and clears by 40%

---

#### 45. warning-bob

```css
@keyframes warning-bob {
  0%   { transform: translateY(0) rotate(0deg); }
  20%  { transform: translateY(-6px) rotate(1deg); }
  40%  { transform: translateY(0) rotate(0deg); }
  60%  { transform: translateY(-3px) rotate(-0.5deg); }
  80%  { transform: translateY(0) rotate(0deg); }
  100% { transform: translateY(0) rotate(0deg); }
}
```

- **Category**: Feedback
- **Utility class**: `.anim-warning-bob { animation: warning-bob 600ms var(--ease-smooth) both; }`
- **Used by**: Warning banners, caution states
- **Recommended duration**: `600ms`
- **Recommended easing**: `var(--ease-smooth)` -- `cubic-bezier(0.22, 1, 0.36, 1)`
- **`prefers-reduced-motion`**: Gated inside `@media (prefers-reduced-motion: no-preference)`

---

#### 46. info-slide

```css
@keyframes info-slide {
  0% {
    transform: translateX(-30px);
    opacity: 0;
  }
  70% {
    transform: translateX(4px);
    opacity: 1;
  }
  100% {
    transform: translateX(0);
    opacity: 1;
  }
}
```

- **Category**: Feedback
- **Utility class**: `.anim-info-slide { animation: info-slide 240ms var(--ease-out) both; }`
- **Used by**: Informational alerts, inline notices. Component recipe: Alert entrance.
- **Recommended duration**: `240ms`
- **Recommended easing**: `var(--ease-out)` -- `cubic-bezier(0.16, 1, 0.3, 1)`
- **`prefers-reduced-motion`**: Gated inside `@media (prefers-reduced-motion: no-preference)`
- **Note**: Overshoots by 4px at 70% before settling

---

#### 47. loading-slam

```css
@keyframes loading-slam {
  0%, 100% {
    transform: translateY(0);
  }
  40% {
    transform: translateY(-20px);
  }
  60% {
    transform: translateY(0);
  }
}
```

- **Category**: Feedback
- **Utility class**:

```css
.anim-loading-slam {
  animation: loading-slam 1s var(--ease-bounce) infinite;
}
.anim-loading-slam:nth-child(2) {
  animation-delay: 120ms;
}
.anim-loading-slam:nth-child(3) {
  animation-delay: 240ms;
}
```

- **Used by**: Three-dot loading indicators
- **Recommended duration**: `1s` infinite loop
- **Recommended easing**: `var(--ease-bounce)` -- `cubic-bezier(0.34, 1.56, 0.64, 1)`
- **`prefers-reduced-motion`**: Gated inside `@media (prefers-reduced-motion: no-preference)`
- **Stagger**: 120ms delay increments per nth-child

---

#### 48. progress-fill-slam

```css
@keyframes progress-fill-slam {
  0% {
    transform: scaleX(0);
  }
  85% {
    transform: scaleX(1.02);
  }
  100% {
    transform: scaleX(1);
  }
}
```

- **Category**: Feedback / Loading
- **Utility class**: `.anim-progress-fill-slam { animation: progress-fill-slam 500ms var(--ease-out) forwards; transform-origin: left; }`
- **Used by**: Progress bars (determinate fill-in)
- **Recommended duration**: `500ms`
- **Recommended easing**: `var(--ease-out)` -- `cubic-bezier(0.16, 1, 0.3, 1)`
- **`prefers-reduced-motion`**: Gated inside `@media (prefers-reduced-motion: no-preference)`
- **Note**: Overshoots `scaleX(1.02)` at 85% then springs back; `transform-origin: left` is set on the class

---

### Category 5 — Component (Micro-interactions)

---

#### 49. toggle-thwack

```css
@keyframes toggle-thwack {
  0% {
    transform: translateX(0) scaleX(1);
  }
  40% {
    transform: translateX(12px) scaleX(1.3);
  }
  100% {
    transform: translateX(24px) scaleX(1);
  }
}
```

- **Category**: Component / Micro-interaction
- **Utility class**: `.anim-toggle-thwack { animation: toggle-thwack 240ms var(--ease-bounce) both; }`
- **Used by**: Toggle/switch knob travel animation
- **Recommended duration**: `240ms`
- **Recommended easing**: `var(--ease-bounce)` -- `cubic-bezier(0.34, 1.56, 0.64, 1)`
- **`prefers-reduced-motion`**: Gated inside `@media (prefers-reduced-motion: no-preference)`
- **Note**: Knob stretches horizontally (`scaleX(1.3)`) mid-transit, returns to natural width on arrival

---

#### 50. check-pop

```css
@keyframes check-pop {
  0% {
    transform: scale(0);
    opacity: 0;
  }
  60% {
    transform: scale(1.2);
    opacity: 1;
  }
  100% {
    transform: scale(1);
    opacity: 1;
  }
}
```

- **Category**: Component / Micro-interaction
- **Utility class**: `.anim-check-pop { animation: check-pop 240ms var(--ease-bounce) both; }`
- **Used by**: Checkbox confirmation, success icon pop-in
- **Recommended duration**: `240ms`
- **Recommended easing**: `var(--ease-bounce)` -- `cubic-bezier(0.34, 1.56, 0.64, 1)`
- **`prefers-reduced-motion`**: Gated inside `@media (prefers-reduced-motion: no-preference)`

---

#### 51. drag-lift

```css
@keyframes drag-lift {
  0% {
    transform: scale(1) rotate(0deg);
    box-shadow: var(--shadow-md);
  }
  100% {
    transform: scale(1.05) rotate(2deg);
    box-shadow: var(--shadow-lg);
  }
}
```

- **Category**: Component / Micro-interaction
- **Utility class**: `.anim-drag-lift { animation: drag-lift var(--motion-fast) var(--ease-bounce) both; }`
- **Used by**: Drag-and-drop item lift state
- **Recommended duration**: `var(--motion-fast)` (160ms)
- **Recommended easing**: `var(--ease-bounce)` -- `cubic-bezier(0.34, 1.56, 0.64, 1)`
- **`prefers-reduced-motion`**: Gated inside `@media (prefers-reduced-motion: no-preference)`

---

#### 52. resize-grip-pulse

```css
@keyframes resize-grip-pulse {
  0%, 100% {
    opacity: 0.4;
  }
  50% {
    opacity: 1;
  }
}
```

- **Category**: Component / Micro-interaction
- **Utility class**: `.anim-resize-grip-pulse { animation: resize-grip-pulse 1200ms var(--ease-smooth) infinite; }`
- **Used by**: Resize handle affordance indicators
- **Recommended duration**: `1200ms` infinite loop
- **Recommended easing**: `var(--ease-smooth)` -- `cubic-bezier(0.22, 1, 0.36, 1)`
- **`prefers-reduced-motion`**: Gated inside `@media (prefers-reduced-motion: no-preference)`

---

#### 53. ripple-stamp

```css
@keyframes ripple-stamp {
  0% {
    transform: scale(0);
    opacity: 1;
  }
  100% {
    transform: scale(4);
    opacity: 0;
  }
}
```

- **Category**: Component / Micro-interaction
- **Utility class**:

```css
.anim-ripple-stamp {
  border: 2px solid var(--accent-primary);
  border-radius: 50%;
  animation: ripple-stamp 400ms var(--ease-out) both;
  pointer-events: none;
}
```

- **Used by**: Click/tap ripple feedback on interactive elements
- **Recommended duration**: `400ms`
- **Recommended easing**: `var(--ease-out)` -- `cubic-bezier(0.16, 1, 0.3, 1)`
- **`prefers-reduced-motion`**: Gated inside `@media (prefers-reduced-motion: no-preference)`
- **Note**: Uses a `border`-based circle (not `background`) so interior remains transparent; `pointer-events: none` prevents blocking interaction

---

### Category 6 — Looping / Ambient

---

#### 54. hover-orbit

```css
@keyframes hover-orbit {
  0% {
    offset-distance: 0%;
    transform: rotate(0deg);
  }
  100% {
    offset-distance: 100%;
    transform: rotate(-360deg);
  }
}
```

- **Category**: Looping / Ambient
- **Utility class**: `.anim-hover-orbit { offset-path: circle(20px); animation: hover-orbit 4s linear infinite; }`
- **Used by**: Decorative orbiting dot around a center element
- **Recommended duration**: `4s` infinite loop
- **Recommended easing**: `linear`
- **`prefers-reduced-motion`**: Gated inside `@media (prefers-reduced-motion: no-preference)`
- **Note**: Uses `offset-path` (motion path) with counter-rotation on the element itself so the dot always faces the same direction

---

#### 55. breathe-shadow

```css
@keyframes breathe-shadow {
  0% {
    box-shadow: var(--shadow-sm);
  }
  100% {
    box-shadow: var(--shadow-md);
  }
}
```

- **Category**: Looping / Ambient
- **Utility class**: `.anim-breathe-shadow { animation: breathe-shadow 3s var(--ease-smooth) infinite alternate; }`
- **Used by**: Cards or elements with a gentle living presence (idle state)
- **Recommended duration**: `3s` infinite alternate
- **Recommended easing**: `var(--ease-smooth)` -- `cubic-bezier(0.22, 1, 0.36, 1)`
- **`prefers-reduced-motion`**: Gated inside `@media (prefers-reduced-motion: no-preference)`
- **Note**: `animation-direction: alternate` makes shadow grow and shrink without a keyframe reversal

---

#### 56. pendulum

```css
@keyframes pendulum {
  0%   { transform: rotate(0deg); }
  25%  { transform: rotate(3deg); }
  50%  { transform: rotate(0deg); }
  75%  { transform: rotate(-3deg); }
  100% { transform: rotate(0deg); }
}
```

- **Category**: Looping / Ambient
- **Utility class**: `.anim-pendulum { animation: pendulum 2.5s var(--ease-smooth) infinite; transform-origin: top center; }`
- **Used by**: Hanging decorative elements, tags, pendants
- **Recommended duration**: `2.5s` infinite loop
- **Recommended easing**: `var(--ease-smooth)` -- `cubic-bezier(0.22, 1, 0.36, 1)`
- **`prefers-reduced-motion`**: Gated inside `@media (prefers-reduced-motion: no-preference)`
- **Note**: `transform-origin: top center` is set on the class

---

#### 57. idle-bounce

```css
@keyframes idle-bounce {
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-4px);
  }
}
```

- **Category**: Looping / Ambient
- **Utility class**: `.anim-idle-bounce { animation: idle-bounce 2s var(--ease-bounce) infinite; }`
- **Used by**: Floating UI elements, scroll-down indicators, idle characters
- **Recommended duration**: `2s` infinite loop
- **Recommended easing**: `var(--ease-bounce)` -- `cubic-bezier(0.34, 1.56, 0.64, 1)`
- **`prefers-reduced-motion`**: Gated inside `@media (prefers-reduced-motion: no-preference)`

---

#### 58. ticker-scroll

```css
@keyframes ticker-scroll {
  0% {
    transform: translateX(0);
  }
  100% {
    transform: translateX(-100%);
  }
}
```

- **Category**: Looping / Ambient
- **Utility class**: `.anim-ticker-scroll { animation: ticker-scroll 15s linear infinite; white-space: nowrap; }`
- **Used by**: Marquee/ticker text banners
- **Recommended duration**: `15s` infinite loop (adjust based on content length)
- **Recommended easing**: `linear`
- **`prefers-reduced-motion`**: Gated inside `@media (prefers-reduced-motion: no-preference)`
- **Note**: `white-space: nowrap` is set on the class to prevent wrapping; duplicate content required for seamless looping

---

### Category 7 — Text / Scroll Effects

---

#### 59. typewriter-mono

```css
@keyframes typewriter-mono {
  0% {
    width: 0;
  }
  100% {
    width: 100%;
  }
}
```

- **Category**: Text
- **Paired with**: `typewriter-cursor-blink` (see below)
- **Utility class**:

```css
.anim-typewriter-mono {
  overflow: hidden;
  white-space: nowrap;
  border-right: 2px solid var(--text-primary);
  width: 0;
  animation:
    typewriter-mono 2s steps(20, end) forwards,
    typewriter-cursor-blink 700ms steps(1) infinite;
}
```

- **Used by**: Code snippet reveals, terminal-style text
- **Recommended duration**: `2s` (adjust steps to match character count)
- **Recommended easing**: `steps(20, end)` -- step count matches character count
- **`prefers-reduced-motion`**: Gated inside `@media (prefers-reduced-motion: no-preference)`
- **Note**: Unlike `typing` (section 9 in design-reference.html which targets a fixed `28ch` width), this variant expands to `100%` of the container

---

#### 60. typewriter-cursor-blink

```css
@keyframes typewriter-cursor-blink {
  0%, 100% {
    border-right-color: var(--text-primary);
  }
  50% {
    border-right-color: transparent;
  }
}
```

- **Category**: Text
- **Paired with**: `typewriter-mono`
- **Utility class**: Applied via `.anim-typewriter-mono` compound animation (see above)
- **Used by**: Blinking cursor for typewriter effect; uses `border-right` as cursor (unlike `blink` in section 10 which uses `border-color`)
- **Recommended duration**: `700ms` infinite loop
- **Recommended easing**: `steps(1)`
- **`prefers-reduced-motion`**: Gated inside `@media (prefers-reduced-motion: no-preference)`

---

#### 61. highlight-sweep

```css
@keyframes highlight-sweep {
  0% {
    background-size: 0% 100%;
  }
  100% {
    background-size: 100% 100%;
  }
}
```

- **Category**: Text
- **Utility class**:

```css
.anim-highlight-sweep {
  background-image: linear-gradient(var(--accent-gold-subtle), var(--accent-gold-subtle));
  background-repeat: no-repeat;
  background-position: left;
  animation: highlight-sweep 400ms var(--ease-out) both;
}
```

- **Used by**: Text highlight reveal, emphasizing key phrases
- **Recommended duration**: `400ms`
- **Recommended easing**: `var(--ease-out)` -- `cubic-bezier(0.16, 1, 0.3, 1)`
- **`prefers-reduced-motion`**: Gated inside `@media (prefers-reduced-motion: no-preference)`
- **Note**: Background sweeps using `background-size` expansion from `0% 100%` to `100% 100%`; the gold color is set on the utility class, not the keyframe

---

### Category 8 — Advanced / Physics

---

#### 62. spring-snap

```css
@keyframes spring-snap {
  0% {
    transform: translateX(-100px);
  }
  40% {
    transform: translateX(8px);
  }
  60% {
    transform: translateX(-4px);
  }
  80% {
    transform: translateX(2px);
  }
  100% {
    transform: translateX(0);
  }
}
```

- **Category**: Advanced / Physics
- **Utility class**: `.anim-spring-snap { animation: spring-snap 400ms var(--ease-elastic) both; }`
- **Used by**: Snapping elements to position, side-drawer entrance with spring feel
- **Recommended duration**: `400ms`
- **Recommended easing**: `var(--ease-elastic)` -- `cubic-bezier(0.68, -0.55, 0.265, 1.55)`
- **`prefers-reduced-motion`**: Gated inside `@media (prefers-reduced-motion: no-preference)`
- **Note**: Damped spring -- overshoots decrease with each oscillation (8px → -4px → 2px → 0)

---

#### 63. gravity-drop

```css
@keyframes gravity-drop {
  0% {
    transform: translateY(-200px);
    opacity: 0;
  }
  15% {
    opacity: 1;
  }
  40% {
    transform: translateY(0);
  }
  55% {
    transform: translateY(-30px);
  }
  70% {
    transform: translateY(0);
  }
  80% {
    transform: translateY(-8px);
  }
  100% {
    transform: translateY(0);
  }
}
```

- **Category**: Advanced / Physics
- **Utility class**: `.anim-gravity-drop { animation: gravity-drop 500ms cubic-bezier(0.4, 0, 1, 1) both; }`
- **Used by**: Objects with simulated gravity and bounce-on-impact
- **Recommended duration**: `500ms`
- **Recommended easing**: `cubic-bezier(0.4, 0, 1, 1)` (accelerating / ease-in)
- **`prefers-reduced-motion`**: Gated inside `@media (prefers-reduced-motion: no-preference)`
- **Note**: Three-bounce sequence with decreasing heights (30px → 8px → 0); opacity resolves at 15%

---

#### 64. rubber-band

```css
@keyframes rubber-band {
  0% {
    transform: scaleX(1) scaleY(1);
  }
  25% {
    transform: scaleX(1.3) scaleY(0.8);
  }
  50% {
    transform: scaleX(0.85) scaleY(1.15);
  }
  75% {
    transform: scaleX(1.05) scaleY(0.95);
  }
  100% {
    transform: scaleX(1) scaleY(1);
  }
}
```

- **Category**: Advanced / Physics
- **Utility class**: `.anim-rubber-band { animation: rubber-band 500ms var(--ease-bounce) both; }`
- **Used by**: Playful elastic interactions, button press feedback, character animation
- **Recommended duration**: `500ms`
- **Recommended easing**: `var(--ease-bounce)` -- `cubic-bezier(0.34, 1.56, 0.64, 1)`
- **`prefers-reduced-motion`**: Gated inside `@media (prefers-reduced-motion: no-preference)`
- **Note**: Volume-preserving squash-and-stretch: when `scaleX` grows, `scaleY` shrinks proportionally

---

#### 65. morph-expand

```css
@keyframes morph-expand {
  0% {
    border-radius: 50%;
    transform: scale(0.5);
    opacity: 0;
  }
  50% {
    opacity: 1;
  }
  100% {
    border-radius: var(--radius-md);
    transform: scale(1);
    opacity: 1;
  }
}
```

- **Category**: Advanced / Transitions
- **Utility class**: `.anim-morph-expand { animation: morph-expand 360ms var(--ease-bounce) both; }`
- **Used by**: FAB-to-card expansion, circle-to-panel morphs
- **Recommended duration**: `360ms`
- **Recommended easing**: `var(--ease-bounce)` -- `cubic-bezier(0.34, 1.56, 0.64, 1)`
- **`prefers-reduced-motion`**: Gated inside `@media (prefers-reduced-motion: no-preference)`
- **Note**: `border-radius` morphs from `50%` (circle) to `var(--radius-md)` while scaling up

---

#### 66. state-swap-out

```css
@keyframes state-swap-out {
  0% {
    transform: translateY(0);
    opacity: 1;
  }
  100% {
    transform: translateY(-10px);
    opacity: 0;
  }
}
```

- **Category**: Advanced / Transitions
- **Paired with**: `state-swap-in`
- **Utility class**: `.anim-state-swap-out { animation: state-swap-out 160ms var(--ease-out) both; }`
- **Used by**: Text/label state transitions (e.g. button label changing from "Save" to "Saved")
- **Recommended duration**: `160ms`
- **Recommended easing**: `var(--ease-out)` -- `cubic-bezier(0.16, 1, 0.3, 1)`
- **`prefers-reduced-motion`**: Gated inside `@media (prefers-reduced-motion: no-preference)`

---

#### 67. state-swap-in

```css
@keyframes state-swap-in {
  0% {
    transform: translateY(10px);
    opacity: 0;
  }
  100% {
    transform: translateY(0);
    opacity: 1;
  }
}
```

- **Category**: Advanced / Transitions
- **Paired with**: `state-swap-out`
- **Utility class**: `.anim-state-swap-in { animation: state-swap-in 160ms var(--ease-out) both; }`
- **Used by**: Incoming state in a text/label swap sequence
- **Recommended duration**: `160ms`
- **Recommended easing**: `var(--ease-out)` -- `cubic-bezier(0.16, 1, 0.3, 1)`
- **`prefers-reduced-motion`**: Gated inside `@media (prefers-reduced-motion: no-preference)`
- **Note**: Run `state-swap-out` first, then `state-swap-in` after the outgoing element has been swapped in the DOM (or with a brief delay)

---

#### 68. card-flip-front

```css
@keyframes card-flip-front {
  0% {
    transform: perspective(600px) rotateY(0deg);
  }
  100% {
    transform: perspective(600px) rotateY(180deg);
  }
}
```

- **Category**: Advanced / Transitions
- **Paired with**: `card-flip-back`
- **Utility class**: `.anim-card-flip-front { animation: card-flip-front 360ms var(--ease-smooth) both; backface-visibility: hidden; }`
- **Used by**: 3D card flip (front face)
- **Recommended duration**: `360ms`
- **Recommended easing**: `var(--ease-smooth)` -- `cubic-bezier(0.22, 1, 0.36, 1)`
- **`prefers-reduced-motion`**: Gated inside `@media (prefers-reduced-motion: no-preference)`
- **Note**: `backface-visibility: hidden` is set on the class; run both front and back animations simultaneously

---

#### 69. card-flip-back

```css
@keyframes card-flip-back {
  0% {
    transform: perspective(600px) rotateY(-180deg);
  }
  100% {
    transform: perspective(600px) rotateY(0deg);
  }
}
```

- **Category**: Advanced / Transitions
- **Paired with**: `card-flip-front`
- **Utility class**: `.anim-card-flip-back { animation: card-flip-back 360ms var(--ease-smooth) both; backface-visibility: hidden; }`
- **Used by**: 3D card flip (back face)
- **Recommended duration**: `360ms`
- **Recommended easing**: `var(--ease-smooth)` -- `cubic-bezier(0.22, 1, 0.36, 1)`
- **`prefers-reduced-motion`**: Gated inside `@media (prefers-reduced-motion: no-preference)`
- **Note**: Back face starts pre-rotated at -180deg so it is invisible at start and reveals as front rotates away

---

#### 70. collapse-to-chip

```css
@keyframes collapse-to-chip {
  0% {
    transform: scale(1);
    border-radius: var(--radius-md);
    opacity: 1;
  }
  60% {
    opacity: 0.6;
  }
  100% {
    transform: scale(0.4, 0.3);
    border-radius: var(--radius-full);
    opacity: 0;
  }
}
```

- **Category**: Advanced / Transitions
- **Utility class**: `.anim-collapse-to-chip { animation: collapse-to-chip 360ms var(--ease-out) both; }`
- **Used by**: Card-to-chip minimization, panel collapse to badge
- **Recommended duration**: `360ms`
- **Recommended easing**: `var(--ease-out)` -- `cubic-bezier(0.16, 1, 0.3, 1)`
- **`prefers-reduced-motion`**: Gated inside `@media (prefers-reduced-motion: no-preference)`
- **Note**: Non-uniform scale `scale(0.4, 0.3)` compresses element to a wide chip shape; `border-radius` morphs to `--radius-full` (pill/chip)

---

### Category 9 — Scroll-linked

> All keyframes in this category are additionally gated inside `@supports (animation-timeline: scroll())`. Two entries reuse keyframes defined in Category 1.

---

#### Scroll-stamp-in *(reuses `stamp-in`)*

- **New keyframe**: None. Reuses `@keyframes stamp-in` from Category 1 (section 23).
- **Utility class**: `.scroll-anim-stamp-in { animation: stamp-in linear both; animation-timeline: view(); animation-range: entry 0% entry 100%; }`
- **Used by**: Elements that stamp in as they enter the viewport on scroll
- **Recommended easing**: `linear` (scroll position maps to progress; easing has no effect in scroll-driven mode)
- **`prefers-reduced-motion`**: Gated inside `@media (prefers-reduced-motion: no-preference)` and `@supports (animation-timeline: scroll())`

---

#### 71. scroll-parallax-shadow

```css
@keyframes scroll-parallax-shadow {
  0% {
    box-shadow: var(--shadow-sm);
  }
  50% {
    box-shadow: var(--shadow-lg);
  }
  100% {
    box-shadow: var(--shadow-sm);
  }
}
```

- **Category**: Scroll-linked
- **Utility class**: `.scroll-anim-parallax-shadow { animation: scroll-parallax-shadow linear both; animation-timeline: view(); }`
- **Used by**: Cards whose shadow depth reacts to scroll position
- **Recommended easing**: `linear` (scroll-driven)
- **`prefers-reduced-motion`**: Gated inside `@media (prefers-reduced-motion: no-preference)` and `@supports (animation-timeline: scroll())`

---

#### Scroll-reveal-wipe *(reuses `shutter-reveal`)*

- **New keyframe**: None. Reuses `@keyframes shutter-reveal` from Category 1 (section 30).
- **Utility class**: `.scroll-anim-reveal-wipe { animation: shutter-reveal linear both; animation-timeline: view(); animation-range: entry 0% entry 100%; }`
- **Used by**: Images or content blocks revealed via clip-path wipe on scroll entry
- **Recommended easing**: `linear` (scroll-driven)
- **`prefers-reduced-motion`**: Gated inside `@media (prefers-reduced-motion: no-preference)` and `@supports (animation-timeline: scroll())`

---

#### 72. scroll-rotate-in

```css
@keyframes scroll-rotate-in {
  0% {
    transform: rotate(12deg);
    opacity: 0;
  }
  100% {
    transform: rotate(0deg);
    opacity: 1;
  }
}
```

- **Category**: Scroll-linked
- **Utility class**: `.scroll-anim-rotate-in { animation: scroll-rotate-in linear both; animation-timeline: view(); animation-range: entry 0% entry 100%; }`
- **Used by**: Tilted elements that rotate to upright as they enter the viewport
- **Recommended easing**: `linear` (scroll-driven)
- **`prefers-reduced-motion`**: Gated inside `@media (prefers-reduced-motion: no-preference)` and `@supports (animation-timeline: scroll())`

---

#### 73. scroll-progress-track

```css
@keyframes scroll-progress-track {
  0% {
    transform: scaleX(0);
    background-color: var(--accent-primary);
  }
  99% {
    background-color: var(--accent-primary);
  }
  100% {
    transform: scaleX(1);
    background-color: var(--accent-green);
  }
}
```

- **Category**: Scroll-linked
- **Utility class**: `.scroll-anim-progress-track { transform-origin: left; animation: scroll-progress-track linear both; animation-timeline: scroll(); }`
- **Used by**: Page-level reading progress bar at the top of the viewport
- **Recommended easing**: `linear` (scroll-driven)
- **`prefers-reduced-motion`**: Gated inside `@media (prefers-reduced-motion: no-preference)` and `@supports (animation-timeline: scroll())`
- **Note**: Color transitions from `--accent-primary` to `--accent-green` only at the very end (99%--100%); semantically equivalent to `scroll-progress-fill` from design-reference.html (section 16) but uses `animation-timeline: scroll()` (page-level) instead of the named `scroll()` approach; `transform-origin: left` is set on the class

---

## Keyframe Cross-Reference

| Keyframe | Source file | Category | Utility class |
|---|---|---|---|
| fadeInUp | design-reference.html | Entrance | `.anim-in` |
| fadeIn | design-reference.html | Entrance | — |
| shimmer | design-reference.html | Loading | — |
| pulse-skel | design-reference.html | Loading | — |
| shake | design-reference.html | Feedback | `.shake-anim` |
| checkmark-draw | design-reference.html | Component | — |
| scale-in | design-reference.html | Feedback | `.feedback-enter` |
| progress-shrink | design-reference.html | Component | `.toast-progress-bar` |
| typing | design-reference.html | Text | — |
| blink | design-reference.html | Text | — |
| easing-loop | design-reference.html | Demo | — |
| spin-slow | design-reference.html | Loading | — |
| fadeOutRight | design-reference.html | Exit | — |
| slideInLeft | design-reference.html | Entrance | — |
| text-stamp | design-reference.html + motion.html | Text | `.anim-text-stamp` |
| scroll-progress-fill | design-reference.html | Scroll | `.scroll-progress` |
| tile-pulse | design-reference.html | Ambient | `.tile-anim-bar` |
| spin | design-reference.html | Loading | `.btn-loading::after` |
| playful-shimmer | design-reference.html | Loading | `.skel-shimmer` |
| playful-pulse | design-reference.html | Loading | `.skel-pulse` |
| pop-anim | design-reference.html | Component | `.splash-dot` |
| ripple-anim | design-reference.html | Component | `.splash-ripple` |
| stamp-in | delightful-motion.html | Entrance | `.anim-stamp-in`, `.scroll-anim-stamp-in` |
| drop-in | delightful-motion.html | Entrance | `.anim-drop-in` |
| slide-slam | delightful-motion.html | Entrance | `.anim-slide-slam` |
| punch-up | delightful-motion.html | Entrance | `.anim-punch-up` |
| unfold | delightful-motion.html | Entrance | `.anim-unfold` |
| brick-stack | delightful-motion.html | Entrance | `.anim-brick-stack` |
| pop-stamp | delightful-motion.html | Entrance | `.anim-pop-stamp` |
| shutter-reveal | delightful-motion.html | Entrance | `.anim-shutter-reveal`, `.scroll-anim-reveal-wipe` |
| fling-right | delightful-motion.html | Exit | `.anim-fling-right` |
| press-away | delightful-motion.html | Exit | `.anim-press-away` |
| crumple | delightful-motion.html | Exit | `.anim-crumple` |
| trapdoor | delightful-motion.html | Exit | `.anim-trapdoor` |
| snap-shrink | delightful-motion.html | Exit | `.anim-snap-shrink` |
| gravity-fall | delightful-motion.html | Exit | `.anim-gravity-fall` |
| knock | delightful-motion.html | Attention | `.anim-knock` |
| stamp-pulse | delightful-motion.html | Attention | `.anim-stamp-pulse` |
| wiggle | delightful-motion.html | Attention | `.anim-wiggle` |
| spotlight | delightful-motion.html | Attention | `.anim-spotlight` |
| headbutt | delightful-motion.html | Attention | `.anim-headbutt` |
| border-march | delightful-motion.html | Attention | `.anim-border-march` |
| confirm-thud | delightful-motion.html | Feedback | `.anim-confirm-thud` |
| error-jolt | delightful-motion.html | Feedback | `.anim-error-jolt` |
| warning-bob | delightful-motion.html | Feedback | `.anim-warning-bob` |
| info-slide | delightful-motion.html | Feedback | `.anim-info-slide` |
| loading-slam | delightful-motion.html | Feedback | `.anim-loading-slam` |
| progress-fill-slam | delightful-motion.html | Feedback/Loading | `.anim-progress-fill-slam` |
| toggle-thwack | delightful-motion.html | Component | `.anim-toggle-thwack` |
| check-pop | delightful-motion.html | Component | `.anim-check-pop` |
| drag-lift | delightful-motion.html | Component | `.anim-drag-lift` |
| resize-grip-pulse | delightful-motion.html | Component | `.anim-resize-grip-pulse` |
| ripple-stamp | delightful-motion.html | Component | `.anim-ripple-stamp` |
| hover-orbit | delightful-motion.html | Looping | `.anim-hover-orbit` |
| breathe-shadow | delightful-motion.html | Looping | `.anim-breathe-shadow` |
| pendulum | delightful-motion.html | Looping | `.anim-pendulum` |
| idle-bounce | delightful-motion.html | Looping | `.anim-idle-bounce` |
| ticker-scroll | delightful-motion.html | Looping | `.anim-ticker-scroll` |
| typewriter-mono | delightful-motion.html | Text | `.anim-typewriter-mono` |
| typewriter-cursor-blink | delightful-motion.html | Text | `.anim-typewriter-mono` (compound) |
| highlight-sweep | delightful-motion.html | Text | `.anim-highlight-sweep` |
| spring-snap | delightful-motion.html | Physics | `.anim-spring-snap` |
| gravity-drop | delightful-motion.html | Physics | `.anim-gravity-drop` |
| rubber-band | delightful-motion.html | Physics | `.anim-rubber-band` |
| morph-expand | delightful-motion.html | Transitions | `.anim-morph-expand` |
| state-swap-out | delightful-motion.html | Transitions | `.anim-state-swap-out` |
| state-swap-in | delightful-motion.html | Transitions | `.anim-state-swap-in` |
| card-flip-front | delightful-motion.html | Transitions | `.anim-card-flip-front` |
| card-flip-back | delightful-motion.html | Transitions | `.anim-card-flip-back` |
| collapse-to-chip | delightful-motion.html | Transitions | `.anim-collapse-to-chip` |
| scroll-parallax-shadow | delightful-motion.html | Scroll-linked | `.scroll-anim-parallax-shadow` |
| scroll-rotate-in | delightful-motion.html | Scroll-linked | `.scroll-anim-rotate-in` |
| scroll-progress-track | delightful-motion.html | Scroll-linked | `.scroll-anim-progress-track` |
