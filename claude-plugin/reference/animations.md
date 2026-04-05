# Delightful Design System — CSS Animations

56 named animations across 10 categories. Neo-brutalist: snappy, decisive, weighted. Never floaty. Category 5 also includes 3 transition-based utility patterns (not `@keyframes`).

All animations live inside `@media (prefers-reduced-motion: no-preference)`. When the user prefers reduced motion, every animation collapses to an instant opacity toggle. See the [Reduced-Motion Guard](#reduced-motion-guard) at the bottom of this document.

All colors use OKLCH. Durations and easings reference design tokens (`var(--motion-*)`, `var(--ease-*)`). Shadows reference `var(--shadow-sm)`, `var(--shadow-md)`, `var(--shadow-lg)`.

---

## Category 1: Entrances (8 animations)

| Name | Effect | Duration | Easing |
|------|--------|----------|--------|
| `stamp-in` | Scale 1.4 -> 1 + Y drop, shadow appears on impact | 360ms | `var(--ease-bounce)` |
| `drop-in` | Falls from above with slight rotation, bounces at landing | 360ms | `var(--ease-bounce)` |
| `slide-slam` | Slides from left with rotation, corrects sharply | 360ms | `var(--ease-out)` |
| `punch-up` | Punches up from below, overshoots, settles | 240ms | `var(--ease-bounce)` |
| `unfold` | scaleY(0) -> scaleY(1), paper-unfolding feel | 240ms | `var(--ease-smooth)` |
| `brick-stack` | Simple Y + opacity entrance, stagger via JS | 160ms | `var(--ease-out)` |
| `pop-stamp` | Scale 0 -> 1.15 -> 1 with border-radius morph | 360ms | `var(--ease-bounce)` |
| `shutter-reveal` | clip-path reveal from left | 360ms | `var(--ease-out)` |

### stamp-in

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
.anim-stamp-in {
  animation: stamp-in 360ms var(--ease-bounce) both;
}
```

Use for: hero entrances, modal opens, card reveals. The signature Delightful entrance -- heavy, decisive, with shadow impact.

### drop-in

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
.anim-drop-in {
  animation: drop-in 360ms var(--ease-bounce) both;
}
```

Use for: dropdown menus, notification panels, elements that arrive from above.

### slide-slam

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
.anim-slide-slam {
  animation: slide-slam 360ms var(--ease-out) both;
}
```

Use for: sidebar reveals, drawer panels, toast notifications sliding in from the side.

### punch-up

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
.anim-punch-up {
  animation: punch-up 240ms var(--ease-bounce) both;
}
```

Use for: tooltips appearing from below, bottom sheets, action bar reveals.

### unfold

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
.anim-unfold {
  animation: unfold 240ms var(--ease-smooth) both;
  transform-origin: top;
}
```

Use for: accordion content, expanding menus, dropdown panels. Set `transform-origin: top` on the element.

### brick-stack

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
.anim-brick-stack {
  animation: brick-stack 160ms var(--ease-out) both;
}
```

Use for: list items, grid children, any staggered sequence. Apply incrementing `animation-delay` per child for the stagger effect.

### pop-stamp

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
.anim-pop-stamp {
  animation: pop-stamp 360ms var(--ease-bounce) both;
}
```

Use for: badges, tags, FABs, small interactive elements appearing. The radius morph from circle to rounded-rect adds neo-brutalist personality.

### shutter-reveal

```css
@keyframes shutter-reveal {
  0% {
    clip-path: inset(0 100% 0 0);
  }
  100% {
    clip-path: inset(0 0 0 0);
  }
}
.anim-shutter-reveal {
  animation: shutter-reveal 360ms var(--ease-out) both;
}
```

Use for: image reveals, content wipes, section reveals. The clip-path approach means layout is unaffected during the animation.

---

## Category 2: Exits (6 animations)

| Name | Effect | Duration | Easing |
|------|--------|----------|--------|
| `fling-right` | Flings element off to the right with rotation | 240ms | `var(--ease-out)` |
| `press-away` | Presses down, shadow collapses, fades | 240ms | `var(--ease-out)` |
| `crumple` | Shrinks with alternating rotation, like crumpling paper | 360ms | `var(--ease-slam)` |
| `trapdoor` | Rotates away on X axis like a trapdoor | 300ms | `var(--ease-slam)` |
| `snap-shrink` | Instant decisive shrink to nothing | 160ms | `var(--ease-out)` |
| `gravity-fall` | Falls with rotation, shadow detaches | 500ms | `var(--ease-slam)` |

### fling-right

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
.anim-fling-right {
  animation: fling-right 240ms var(--ease-out) both;
}
```

Use for: swipe-to-dismiss, card removal, toast dismissal.

### press-away

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
.anim-press-away {
  animation: press-away 240ms var(--ease-out) both;
}
```

Use for: subtle card dismissals, closing overlays, confirmed deletions.

### crumple

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
.anim-crumple {
  animation: crumple 360ms var(--ease-slam) both;
}
```

Use for: destructive delete confirmations, "discard" actions. The paper-crumpling rotation adds drama.

### trapdoor

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
.anim-trapdoor {
  animation: trapdoor 300ms var(--ease-slam) both;
  transform-origin: bottom center;
}
```

Use for: dropdown close, panel collapse, content disappearing downward. Set `transform-origin: bottom center`.

### snap-shrink

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
.anim-snap-shrink {
  animation: snap-shrink 160ms var(--ease-out) both;
}
```

Use for: quick badge removal, chip deletion, fast UI dismissals. Decisively instant.

### gravity-fall

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
.anim-gravity-fall {
  animation: gravity-fall 500ms var(--ease-slam) both;
}
```

Use for: dramatic removal, "drop into trash" interactions. Shadow grows then detaches as the element falls.

---

## Category 3: Attention (6 animations)

| Name | Effect | Duration | Easing |
|------|--------|----------|--------|
| `knock` | Front-loaded horizontal shake | 400ms | `linear` |
| `stamp-pulse` | Scale up (shadow grows) -> compress (shadow shrinks) -> settle | 500ms | `var(--ease-bounce)` |
| `wiggle` | Small alternating rotation, eager tremor | 500ms | `var(--ease-out)` |
| `spotlight` | Shadow grows to accent ring, then retreats | 1200ms | `var(--ease-smooth)` |
| `headbutt` | Vertical jump with bounce settle | 400ms | `var(--ease-bounce)` |
| `border-march` | Marching ants via background-position | 800ms | `linear` (infinite) |

### knock

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
.anim-knock {
  animation: knock 400ms linear both;
}
```

Use for: form validation errors, "wrong password" shake, attention-needed indicators.

### stamp-pulse

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
.anim-stamp-pulse {
  animation: stamp-pulse 500ms var(--ease-bounce) both;
}
```

Use for: notification badges updating, count changes, "new content" indicators.

### wiggle

```css
@keyframes wiggle {
  0%   { transform: rotate(0deg); }
  15%  { transform: rotate(3deg); }
  30%  { transform: rotate(-3deg); }
  50%  { transform: rotate(2deg); }
  70%  { transform: rotate(-1deg); }
  100% { transform: rotate(0deg); }
}
.anim-wiggle {
  animation: wiggle 500ms var(--ease-out) both;
}
```

Use for: playful attention, icon emphasis, "pick me" affordance on interactive elements.

### spotlight

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
.anim-spotlight {
  animation: spotlight 1200ms var(--ease-smooth) both;
}
```

Use for: onboarding highlights, feature callouts, focus-ring-style emphasis on newly available elements.

### headbutt

```css
@keyframes headbutt {
  0%   { transform: translateY(0); }
  25%  { transform: translateY(-16px); }
  50%  { transform: translateY(0); }
  70%  { transform: translateY(-6px); }
  100% { transform: translateY(0); }
}
.anim-headbutt {
  animation: headbutt 400ms var(--ease-bounce) both;
}
```

Use for: bouncing notification icons, "look up here" attention on nav items, playful button emphasis.

### border-march

```css
@keyframes border-march {
  0% {
    background-position: 0 0, 100% 0, 0 100%, 0 0;
  }
  100% {
    background-position: 16px 0, 100% 16px, -16px 100%, 0 -16px;
  }
}
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

Use for: selection state, active drag targets, "processing" border indicator. The class includes all required background setup -- just add the class.

---

## Category 4: Feedback (6 animations)

| Name | Effect | Duration | Easing |
|------|--------|----------|--------|
| `confirm-thud` | Multi-bounce landing with green flash | 360ms | `var(--ease-bounce)` |
| `error-jolt` | Horizontal shake with danger flash | 500ms | `linear` |
| `warning-bob` | Gentle vertical bob with slight rotation | 600ms | `var(--ease-smooth)` |
| `info-slide` | Slide-in from left with subtle overshoot | 240ms | `var(--ease-out)` |
| `loading-slam` | Bounce for loading dots, stagger via nth-child | 1s | `var(--ease-bounce)` (infinite) |
| `progress-fill-slam` | scaleX with overshoot for progress bars | 500ms | `var(--ease-out)` |

### confirm-thud

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
.anim-confirm-thud {
  animation: confirm-thud 360ms var(--ease-bounce) both;
}
```

Use for: success confirmations, saved state indicators, completed action feedback. The green flash communicates success semantically.

### error-jolt

```css
@keyframes error-jolt {
  0%   { transform: translateX(0); background-color: transparent; }
  20%  { transform: translateX(8px); background-color: var(--accent-danger-subtle); }
  40%  { transform: translateX(-8px); background-color: transparent; }
  60%  { transform: translateX(4px); }
  80%  { transform: translateX(-2px); }
  100% { transform: translateX(0); }
}
.anim-error-jolt {
  animation: error-jolt 500ms linear both;
}
```

Use for: form validation failures, incorrect input, error state feedback. The danger-red background flash pairs with the shake.

### warning-bob

```css
@keyframes warning-bob {
  0%   { transform: translateY(0) rotate(0deg); }
  20%  { transform: translateY(-6px) rotate(1deg); }
  40%  { transform: translateY(0) rotate(0deg); }
  60%  { transform: translateY(-3px) rotate(-0.5deg); }
  80%  { transform: translateY(0) rotate(0deg); }
  100% { transform: translateY(0) rotate(0deg); }
}
.anim-warning-bob {
  animation: warning-bob 600ms var(--ease-smooth) both;
}
```

Use for: warning banners, cautionary notices, "are you sure?" prompts. Gentler than error-jolt.

### info-slide

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
.anim-info-slide {
  animation: info-slide 240ms var(--ease-out) both;
}
```

Use for: info banners, helper text appearing, inline notifications.

### loading-slam

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

Use for: loading indicators with three dots. The nth-child delays create a wave. Apply to three sibling elements.

### progress-fill-slam

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
.anim-progress-fill-slam {
  animation: progress-fill-slam 500ms var(--ease-out) forwards;
  transform-origin: left;
}
```

Use for: progress bars, skill meters, completion indicators. The slight overshoot at 85% adds a satisfying "slam" to the fill. Set `transform-origin: left`.

---

## Category 5: Micro-interactions (8 animations)

4 keyframe-based animations + 4 transition-based utilities.

| Name | Type | Effect | Duration | Easing |
|------|------|--------|----------|--------|
| `toggle-thwack` | keyframe | Toggle knob slides with squash-stretch | 240ms | `var(--ease-bounce)` |
| `check-pop` | keyframe | Checkmark container pops in | 240ms | `var(--ease-bounce)` |
| `drag-lift` | keyframe | Element lifts when dragged | `var(--motion-fast)` | `var(--ease-bounce)` |
| `resize-grip-pulse` | keyframe | Gentle opacity pulse for resize handles | 1200ms | `var(--ease-smooth)` (infinite) |
| `ripple-stamp` | keyframe | Border circle scales out and fades | 400ms | `var(--ease-out)` |
| `btn-press` | transition | Hover lift + active press with shadow shift | `var(--motion-instant)` | `linear` |
| `hover-tilt` | transition | 3D tilt on hover | `var(--motion-fast)` | `var(--ease-smooth)` |
| `input-focus` | transition | Shadow grows to accent on focus | `var(--motion-instant)` | `var(--ease-out)` |

### toggle-thwack

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
.anim-toggle-thwack {
  animation: toggle-thwack 240ms var(--ease-bounce) both;
}
```

Use for: toggle switches. The squash-stretch at 40% gives the knob a rubbery, physical feel.

### check-pop

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
.anim-check-pop {
  animation: check-pop 240ms var(--ease-bounce) both;
}
```

Use for: checkbox activation, task completion, "done" confirmations.

### drag-lift

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
.anim-drag-lift {
  animation: drag-lift var(--motion-fast) var(--ease-bounce) both;
}
```

Use for: drag-and-drop pickups. Apply on dragstart, reverse on drop. The shadow grows and slight rotation communicates "lifted off surface."

### resize-grip-pulse

```css
@keyframes resize-grip-pulse {
  0%, 100% {
    opacity: 0.4;
  }
  50% {
    opacity: 1;
  }
}
.anim-resize-grip-pulse {
  animation: resize-grip-pulse 1200ms var(--ease-smooth) infinite;
}
```

Use for: resize handle affordance, draggable grip indicators, split-pane dividers.

### ripple-stamp

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
.anim-ripple-stamp {
  border: 2px solid var(--accent-primary);
  border-radius: 50%;
  animation: ripple-stamp 400ms var(--ease-out) both;
  pointer-events: none;
}
```

Use for: click/tap feedback ripples. Spawn a positioned element at click coordinates and apply this class.

### btn-press (transition utility)

```css
.micro-btn-press {
  transition: transform var(--motion-instant) linear,
              box-shadow var(--motion-instant) linear;
  cursor: pointer;
}
.micro-btn-press:hover {
  transform: translate(-2px, -2px);
  box-shadow: var(--shadow-md);
}
.micro-btn-press:active {
  transform: translate(2px, 2px);
  box-shadow: 0 0 0 var(--text-primary);
}
```

Use for: any clickable card or button. Hover lifts; active presses down and flattens shadow. Core neo-brutalist interaction pattern.

### hover-tilt (transition utility)

```css
.micro-hover-tilt {
  transition: transform var(--motion-fast) var(--ease-smooth);
}
.micro-hover-tilt:hover {
  transform: perspective(600px) rotateY(4deg) rotateX(-2deg);
}
```

Use for: cards, thumbnails, interactive tiles. Subtle 3D tilt adds depth on hover.

### input-focus (transition utility)

```css
.micro-input-focus {
  box-shadow: var(--shadow-sm);
  transition: box-shadow var(--motion-instant) var(--ease-out);
}
.micro-input-focus:focus,
.micro-input-focus:focus-within {
  box-shadow: 4px 4px 0 var(--accent-primary);
}
```

Use for: text inputs, selects, textareas. Shadow shifts to accent color on focus.

---

## Category 6: Ambient / Looping (5 animations)

| Name | Effect | Duration | Easing |
|------|--------|----------|--------|
| `hover-orbit` | Dot orbits an element via offset-path | 4s | `linear` (infinite) |
| `breathe-shadow` | Shadow alternates between sm and md | 3s | `var(--ease-smooth)` (infinite alternate) |
| `pendulum` | Swing from top center | 2.5s | `var(--ease-smooth)` (infinite) |
| `idle-bounce` | Gentle vertical bounce | 2s | `var(--ease-bounce)` (infinite) |
| `ticker-scroll` | Horizontal text scroll | 15s | `linear` (infinite) |

### hover-orbit

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
.anim-hover-orbit {
  offset-path: circle(20px);
  animation: hover-orbit 4s linear infinite;
}
```

Use for: decorative accent dots, loading indicators with character, active-state orbiters around avatars or icons.

### breathe-shadow

```css
@keyframes breathe-shadow {
  0% {
    box-shadow: var(--shadow-sm);
  }
  100% {
    box-shadow: var(--shadow-md);
  }
}
.anim-breathe-shadow {
  animation: breathe-shadow 3s var(--ease-smooth) infinite alternate;
}
```

Use for: idle card states, "alive" indicators, subtle depth pulsing for selected elements.

### pendulum

```css
@keyframes pendulum {
  0%   { transform: rotate(0deg); }
  25%  { transform: rotate(3deg); }
  50%  { transform: rotate(0deg); }
  75%  { transform: rotate(-3deg); }
  100% { transform: rotate(0deg); }
}
.anim-pendulum {
  animation: pendulum 2.5s var(--ease-smooth) infinite;
  transform-origin: top center;
}
```

Use for: hanging tags, pendulum clock decorations, gentle idle motion for suspended elements. Set `transform-origin: top center`.

### idle-bounce

```css
@keyframes idle-bounce {
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-4px);
  }
}
.anim-idle-bounce {
  animation: idle-bounce 2s var(--ease-bounce) infinite;
}
```

Use for: CTA buttons, "scroll down" indicators, floating action buttons that need gentle attention.

### ticker-scroll

```css
@keyframes ticker-scroll {
  0% {
    transform: translateX(0);
  }
  100% {
    transform: translateX(-100%);
  }
}
.anim-ticker-scroll {
  animation: ticker-scroll 15s linear infinite;
  white-space: nowrap;
}
```

Use for: news tickers, marquee announcements, horizontal scrolling text banners. Duplicate the content for seamless looping.

---

## Category 7: Text (5 animations)

| Name | Type | Effect | Duration | Easing |
|------|------|--------|----------|--------|
| `typewriter-mono` | keyframe | Width expands with steps, blinking cursor | 2s | `steps(20, end)` |
| `typewriter-cursor-blink` | keyframe | Cursor blink companion for typewriter | 700ms | `steps(1)` (infinite) |
| `text-stamp` | keyframe | Per-character drop-in | 200ms | `var(--ease-bounce)` |
| `highlight-sweep` | keyframe | Background highlight sweeps in from left | 400ms | `var(--ease-out)` |
| `underline-draw` | transition | Underline draws in from left on hover | 240ms | `var(--ease-out)` |

### typewriter-mono + typewriter-cursor-blink

```css
@keyframes typewriter-mono {
  0% {
    width: 0;
  }
  100% {
    width: 100%;
  }
}
@keyframes typewriter-cursor-blink {
  0%, 100% {
    border-right-color: var(--text-primary);
  }
  50% {
    border-right-color: transparent;
  }
}
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

Use for: code demos, terminal-style text reveals, hero text on landing pages. Adjust `steps()` count to match character length.

### text-stamp

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
.anim-text-stamp {
  animation: text-stamp 200ms var(--ease-bounce) both;
}
```

Use for: per-character animated headings. Wrap each character in a `<span>` and apply 40ms stagger delay per character via JS.

### highlight-sweep

```css
@keyframes highlight-sweep {
  0% {
    background-size: 0% 100%;
  }
  100% {
    background-size: 100% 100%;
  }
}
.anim-highlight-sweep {
  background-image: linear-gradient(var(--accent-gold-subtle), var(--accent-gold-subtle));
  background-repeat: no-repeat;
  background-position: left;
  animation: highlight-sweep 400ms var(--ease-out) both;
}
```

Use for: text highlighting, search result emphasis, "new" content markers. The class includes the gold background setup.

### underline-draw (transition utility)

```css
.text-underline-draw {
  position: relative;
  display: inline-block;
}
.text-underline-draw::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 3px;
  background: var(--accent-primary);
  transform: scaleX(0);
  transform-origin: left;
  transition: transform 240ms var(--ease-out);
}
.text-underline-draw:hover::after {
  transform: scaleX(1);
}
```

Use for: nav links, inline text links, any hover-underline effect. The pseudo-element draws from left to right.

---

## Category 8: Physics (3 animations)

| Name | Effect | Duration | Easing |
|------|--------|----------|--------|
| `spring-snap` | Damped spring oscillation | 400ms | `var(--ease-elastic)` |
| `gravity-drop` | Accelerating fall with multi-bounce | 500ms | `cubic-bezier(0.4, 0, 1, 1)` |
| `rubber-band` | Squash and stretch | 500ms | `var(--ease-bounce)` |

Note: Two additional physics effects (`magnetic-snap` and `momentum-scroll`) are JS-driven and have no `@keyframes`.

### spring-snap

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
.anim-spring-snap {
  animation: spring-snap 400ms var(--ease-elastic) both;
}
```

Use for: element snapping to position, magnetic alignment feedback, spring-back after overscroll. True damped oscillation pattern.

### gravity-drop

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
.anim-gravity-drop {
  animation: gravity-drop 500ms cubic-bezier(0.4, 0, 1, 1) both;
}
```

Use for: heavy object entrances, dramatic hero reveals, elements with perceived weight. Multi-bounce creates realistic physics.

### rubber-band

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
.anim-rubber-band {
  animation: rubber-band 500ms var(--ease-bounce) both;
}
```

Use for: playful attention, button clicks with character, bouncy hover effects. Classic squash-and-stretch from animation principles.

---

## Category 9: Scroll-triggered (5 animations)

These use the `animation-timeline: scroll()` / `animation-timeline: view()` API. Wrapped in `@supports (animation-timeline: scroll())` for progressive enhancement.

| Name | Source Keyframe | Trigger | Range |
|------|-----------------|---------|-------|
| `scroll-stamp-in` | Reuses `stamp-in` | `view()` | `entry 0%` to `entry 100%` |
| `scroll-parallax-shadow` | `scroll-parallax-shadow` | `view()` | full |
| `scroll-reveal-wipe` | Reuses `shutter-reveal` | `view()` | `entry 0%` to `entry 100%` |
| `scroll-rotate-in` | `scroll-rotate-in` | `view()` | `entry 0%` to `entry 100%` |
| `scroll-progress-track` | `scroll-progress-track` | `scroll()` | full page |

### scroll-parallax-shadow

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

### scroll-rotate-in

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

### scroll-progress-track

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

### Scroll-driven utility classes

```css
@supports (animation-timeline: scroll()) {

  /* stamp-in triggered by scroll viewport entry */
  .scroll-anim-stamp-in {
    animation: stamp-in linear both;
    animation-timeline: view();
    animation-range: entry 0% entry 100%;
  }

  /* Shadow depth tied to scroll position */
  .scroll-anim-parallax-shadow {
    animation: scroll-parallax-shadow linear both;
    animation-timeline: view();
  }

  /* clip-path reveal tied to scroll */
  .scroll-anim-reveal-wipe {
    animation: shutter-reveal linear both;
    animation-timeline: view();
    animation-range: entry 0% entry 100%;
  }

  /* Rotate and fade on scroll entry */
  .scroll-anim-rotate-in {
    animation: scroll-rotate-in linear both;
    animation-timeline: view();
    animation-range: entry 0% entry 100%;
  }

  /* Progress bar at page top */
  .scroll-anim-progress-track {
    transform-origin: left;
    animation: scroll-progress-track linear both;
    animation-timeline: scroll();
  }

}
```

Use for: scroll-driven reveals, parallax depth effects, reading progress bars. These are progressively enhanced -- they simply won't animate in browsers without `animation-timeline` support.

---

## Category 10: Transitions (5 animations)

| Name | Type | Effect | Duration | Easing |
|------|------|--------|----------|--------|
| `morph-expand` | keyframe | Circle morphs to rounded rectangle | 360ms | `var(--ease-bounce)` |
| `state-swap-out` / `state-swap-in` | keyframe pair | Paired exit/enter for state changes | 160ms each | `var(--ease-out)` |
| `accordion-squish` | transition | Grid-based smooth height animation | 240ms | `var(--ease-smooth)` |
| `card-flip-front` / `card-flip-back` | keyframe pair | 3D card flip with backface hidden | 360ms each | `var(--ease-smooth)` |
| `collapse-to-chip` | keyframe | Card compresses to chip | 360ms | `var(--ease-out)` |

### morph-expand

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
.anim-morph-expand {
  animation: morph-expand 360ms var(--ease-bounce) both;
}
```

Use for: FAB expanding to panel, avatar expanding to profile card, circle-to-card shape transitions.

### state-swap-out / state-swap-in

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
.anim-state-swap-out {
  animation: state-swap-out 160ms var(--ease-out) both;
}
.anim-state-swap-in {
  animation: state-swap-in 160ms var(--ease-out) both;
}
```

Use for: text content swaps (price updates, counter changes), tab content transitions. Apply `state-swap-out` to outgoing, then `state-swap-in` to incoming after 160ms.

### accordion-squish (transition utility)

```css
.accordion-squish {
  display: grid;
  grid-template-rows: 0fr;
  transition: grid-template-rows 240ms var(--ease-smooth);
}
.accordion-squish > * {
  overflow: hidden;
}
.accordion-squish.accordion-open {
  grid-template-rows: 1fr;
}
```

Use for: expandable sections, FAQ accordions, collapsible panels. Toggle `.accordion-open` on the container. The `grid-template-rows` technique enables smooth height animation without JavaScript measurement.

### card-flip-front / card-flip-back

```css
@keyframes card-flip-front {
  0% {
    transform: perspective(600px) rotateY(0deg);
  }
  100% {
    transform: perspective(600px) rotateY(180deg);
  }
}
@keyframes card-flip-back {
  0% {
    transform: perspective(600px) rotateY(-180deg);
  }
  100% {
    transform: perspective(600px) rotateY(0deg);
  }
}
.anim-card-flip-front {
  animation: card-flip-front 360ms var(--ease-smooth) both;
  backface-visibility: hidden;
}
.anim-card-flip-back {
  animation: card-flip-back 360ms var(--ease-smooth) both;
  backface-visibility: hidden;
}
```

Use for: card reveals, before/after comparisons, two-sided interactive cards. Apply `card-flip-front` to the visible side and `card-flip-back` to the hidden side simultaneously.

### collapse-to-chip

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
.anim-collapse-to-chip {
  animation: collapse-to-chip 360ms var(--ease-out) both;
}
```

Use for: card minimizing to a chip/tag, modal collapsing to a summary badge, detail-to-compact transitions.

---

## Bonus: Skeleton & Loading Keyframes

These come from the animation showcase and are used for loading states.

| Name | Effect | Duration | Easing |
|------|--------|----------|--------|
| `shimmer` | Background-position sweep for skeleton loading | 1.5s | `ease-in-out` (infinite) |
| `skel-pulse` | Opacity pulse for skeleton loading | 1.5s | `ease-in-out` (infinite) |
| `hue-cycle` | OKLCH hue rotation via custom property | 4s | `linear` (infinite) |

### shimmer

```css
@keyframes shimmer {
  0% { background-position: 200% 0; }
  100% { background-position: -200% 0; }
}
.skel-shimmer {
  background: linear-gradient(90deg, var(--bg-muted) 25%, var(--bg-subtle) 50%, var(--bg-muted) 75%);
  background-size: 200% 100%;
  animation: shimmer 1.5s ease-in-out infinite;
}
```

Use for: skeleton loading placeholders. Apply to block-level placeholder elements to create the shimmer sweep effect.

### skel-pulse

```css
@keyframes skel-pulse {
  0%, 100% { opacity: 0.4; }
  50% { opacity: 1; }
}
.skel-pulse {
  animation: skel-pulse 1.5s ease-in-out infinite;
}
```

Use for: simpler skeleton loading. An opacity pulse alternative to shimmer when the gradient effect is unnecessary.

### hue-cycle

```css
@keyframes hue-cycle {
  from { --sig-hue: 350; }
  to { --sig-hue: 710; }
}
```

Use for: decorative color-cycling text or backgrounds. Requires a registered custom property (`@property --sig-hue`) and an OKLCH color referencing `var(--sig-hue)` as the hue channel.

---

## Page-Load Entrance Utility

The `.anim-in` class paired with `.anim-d1` through `.anim-d10` creates staggered entrance sequences on page load.

### fadeInUp (page entrance keyframe)

```css
@keyframes fadeInUp {
  from { opacity: 0; transform: translateY(16px); }
  to { opacity: 1; transform: translateY(0); }
}
```

### Utility classes

```css
.anim-in {
  opacity: 0;
  animation: fadeInUp 0.5s var(--ease-smooth) both;
}

/* Stagger delays — 60ms increments */
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
```

### Usage

```html
<h1 class="anim-in">Hero title</h1>
<p class="anim-in anim-d3">Subtitle appears 180ms later</p>
<a class="anim-in anim-d4">CTA appears 240ms later</a>
```

Each `.anim-d{n}` adds a 60ms increment. Use for page-load choreography where elements cascade in sequentially.

---

## Reduced-Motion Guard

All animations are wrapped in `@media (prefers-reduced-motion: no-preference)`. When the user prefers reduced motion, this global fallback applies:

```css
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
}
```

Additionally, the page-entrance utilities collapse:

```css
@media (prefers-reduced-motion: reduce) {
  .anim-in { opacity: 1; }
}
```

**Pattern for new animations:** Always wrap keyframe-driven animations inside `@media (prefers-reduced-motion: no-preference) { ... }`. The global reduced-motion rule handles transitions, but scoping keyframes inside the media query makes the intent explicit and prevents flash-of-animated-state.

---

## Quick Reference: All 56 Animations

| # | Keyframe | Category | Class |
|---|----------|----------|-------|
| 1 | `stamp-in` | Entrance | `.anim-stamp-in` |
| 2 | `drop-in` | Entrance | `.anim-drop-in` |
| 3 | `slide-slam` | Entrance | `.anim-slide-slam` |
| 4 | `punch-up` | Entrance | `.anim-punch-up` |
| 5 | `unfold` | Entrance | `.anim-unfold` |
| 6 | `brick-stack` | Entrance | `.anim-brick-stack` |
| 7 | `pop-stamp` | Entrance | `.anim-pop-stamp` |
| 8 | `shutter-reveal` | Entrance | `.anim-shutter-reveal` |
| 9 | `fling-right` | Exit | `.anim-fling-right` |
| 10 | `press-away` | Exit | `.anim-press-away` |
| 11 | `crumple` | Exit | `.anim-crumple` |
| 12 | `trapdoor` | Exit | `.anim-trapdoor` |
| 13 | `snap-shrink` | Exit | `.anim-snap-shrink` |
| 14 | `gravity-fall` | Exit | `.anim-gravity-fall` |
| 15 | `knock` | Attention | `.anim-knock` |
| 16 | `stamp-pulse` | Attention | `.anim-stamp-pulse` |
| 17 | `wiggle` | Attention | `.anim-wiggle` |
| 18 | `spotlight` | Attention | `.anim-spotlight` |
| 19 | `headbutt` | Attention | `.anim-headbutt` |
| 20 | `border-march` | Attention | `.anim-border-march` |
| 21 | `confirm-thud` | Feedback | `.anim-confirm-thud` |
| 22 | `error-jolt` | Feedback | `.anim-error-jolt` |
| 23 | `warning-bob` | Feedback | `.anim-warning-bob` |
| 24 | `info-slide` | Feedback | `.anim-info-slide` |
| 25 | `loading-slam` | Feedback | `.anim-loading-slam` |
| 26 | `progress-fill-slam` | Feedback | `.anim-progress-fill-slam` |
| 27 | `toggle-thwack` | Micro-interaction | `.anim-toggle-thwack` |
| 28 | `check-pop` | Micro-interaction | `.anim-check-pop` |
| 29 | `drag-lift` | Micro-interaction | `.anim-drag-lift` |
| 30 | `resize-grip-pulse` | Micro-interaction | `.anim-resize-grip-pulse` |
| 31 | `ripple-stamp` | Micro-interaction | `.anim-ripple-stamp` |
| 32 | `hover-orbit` | Ambient/Looping | `.anim-hover-orbit` |
| 33 | `breathe-shadow` | Ambient/Looping | `.anim-breathe-shadow` |
| 34 | `pendulum` | Ambient/Looping | `.anim-pendulum` |
| 35 | `idle-bounce` | Ambient/Looping | `.anim-idle-bounce` |
| 36 | `ticker-scroll` | Ambient/Looping | `.anim-ticker-scroll` |
| 37 | `typewriter-mono` | Text | `.anim-typewriter-mono` |
| 38 | `typewriter-cursor-blink` | Text | (paired with typewriter-mono) |
| 39 | `text-stamp` | Text | `.anim-text-stamp` |
| 40 | `highlight-sweep` | Text | `.anim-highlight-sweep` |
| 41 | `spring-snap` | Physics | `.anim-spring-snap` |
| 42 | `gravity-drop` | Physics | `.anim-gravity-drop` |
| 43 | `rubber-band` | Physics | `.anim-rubber-band` |
| 44 | `scroll-parallax-shadow` | Scroll-triggered | `.scroll-anim-parallax-shadow` |
| 45 | `scroll-rotate-in` | Scroll-triggered | `.scroll-anim-rotate-in` |
| 46 | `scroll-progress-track` | Scroll-triggered | `.scroll-anim-progress-track` |
| 47 | `morph-expand` | Transition | `.anim-morph-expand` |
| 48 | `state-swap-out` | Transition | `.anim-state-swap-out` |
| 49 | `state-swap-in` | Transition | `.anim-state-swap-in` |
| 50 | `card-flip-front` | Transition | `.anim-card-flip-front` |
| 51 | `card-flip-back` | Transition | `.anim-card-flip-back` |
| 52 | `collapse-to-chip` | Transition | `.anim-collapse-to-chip` |
| 53 | `fadeInUp` | Page-load utility | `.anim-in` |
| 54 | `shimmer` | Skeleton/Loading | `.skel-shimmer` |
| 55 | `skel-pulse` | Skeleton/Loading | `.skel-pulse` |
| 56 | `hue-cycle` | Decorative | (custom property driven) |
