# Tilt Card

> Signature interaction where a card tilts in 3D space toward the cursor using spring physics. The card applies `rotateX` and `rotateY` transforms driven by two independent spring oscillators that track cursor position within the card bounds. A shine overlay dynamically shifts angle and opacity to simulate a light source following the cursor. On mouseleave, springs animate back to zero. Requires JavaScript. Disabled when `prefers-reduced-motion: reduce`.

Source: `delightful-animation.html` — Section "07 Signature Interactions / 3D Tilt". This component does not appear in `design-reference.html`.

Cross-references: [[magnetic-button]] (same `registerAnimation`/spring manager), [[staggered-reveal]] (same `springStep` solver and shared `SPRING_PRESETS`), [[motion]] (spring physics system).

Visual reference: Section "07 — Signature Effects", card "3D Tilt" in `delightful-animation.html` (CSS lines 978–996, HTML lines 1874–1889, JS lines 4477–4516).

---

## 1. HTML Structure

```html
<!-- Perspective is set on the PARENT wrapper, not on .tilt-card itself -->
<div class="demo-card-stage" style="min-height:220px; perspective:800px">
  <div class="tilt-card" id="tilt-card-1" style="border-top-color:var(--accent-primary)">
    <div class="tilt-shine"></div>
    <span style="font-weight:700; font-size:var(--ui-text-md); position:relative; z-index:1">Tilt me</span>
  </div>
</div>
```

Key structural points:

- `perspective: 800px` is an **inline style on the parent wrapper**, not a CSS class property. The `.tilt-card` element does not set `perspective` — it only sets `transform-style: preserve-3d`.
- `.tilt-shine` is a `div` that sits as the first child inside `.tilt-card`, covering the full card face with `position: absolute; inset: 0`.
- Card content (labels, text) must be wrapped in an element with `position: relative; z-index: 1` to render above the shine overlay.
- The card is addressed by JavaScript via `id="tilt-card-1"`. For multiple tilt cards, each needs a unique id or the selector must be updated to a class-based query.

---

## 2. CSS Classes

### 2.1 `.tilt-card` (the card)

| Property | Value | Token / Notes |
|---|---|---|
| `width` | `160px` | Hardcoded in demo |
| `height` | `100px` | Hardcoded in demo |
| `background` | `var(--bg-surface)` | Semantic surface token |
| `border` | `2px solid var(--border-default)` | Default border |
| `border-top` | `4px solid var(--accent-primary)` | Accent color accent bar — overridden per-instance via inline `style` |
| `border-radius` | `var(--radius-md)` | Component radius token |
| `box-shadow` | `var(--shadow-md)` | Component shadow token |
| `display` | `flex` | -- |
| `align-items` | `center` | -- |
| `justify-content` | `center` | -- |
| `position` | `relative` | Required for `.tilt-shine` absolute positioning |
| `overflow` | `hidden` | Clips shine overlay |
| `cursor` | `pointer` | -- |
| `transform-style` | `preserve-3d` | Enables 3D child context for the perspective set on the parent |
| `will-change` | `transform` | Performance hint; `rotateX`/`rotateY` are applied by JS on every animation frame |

No `transition` property is declared on `.tilt-card`. All motion is driven by the spring animation loop — CSS transitions are not used for the tilt.

### 2.2 `.tilt-shine` (shine overlay)

| Property | Value | Notes |
|---|---|---|
| `position` | `absolute` | Fills card |
| `inset` | `0` | Covers all four edges |
| `background` | `linear-gradient(135deg, oklch(1 0 0 / 0.15), transparent 60%)` | Default resting state gradient |
| `pointer-events` | `none` | Passes all events through to card |
| `transition` | `opacity var(--motion-fast) var(--ease-out)` | Smooth opacity changes (unused in current JS, gradient is replaced wholesale) |

The `background` property is overwritten on every `mousemove` by JavaScript (see §4.2). The CSS value above is the initial resting state that renders before any cursor interaction.

---

## 3. Perspective Context

The 3D perspective effect requires the parent container to have a `perspective` value:

```html
<div style="perspective: 800px">
  <div class="tilt-card">…</div>
</div>
```

- Perspective value: `800px`
- Set as an **inline style** on the wrapper in the reference implementation
- `.tilt-card` sets `transform-style: preserve-3d` to participate in the 3D context
- Without the parent `perspective`, `rotateX`/`rotateY` transforms have no visible depth effect

---

## 4. States

| State | Transform | Shine |
|---|---|---|
| **Default (no interaction)** | `rotateX(0deg) rotateY(0deg)` | `linear-gradient(135deg, oklch(1 0 0 / 0.15), transparent 60%)` |
| **Cursor over card** | `rotateX(Xdeg) rotateY(Ydeg)` spring-animated | Gradient angle and opacity shift dynamically with cursor x position |
| **Mouse leave** | Springs to `rotateX(0deg) rotateY(0deg)` | Gradient holds last computed value until spring settles |
| **Reduced motion** | No transform applied | Static default gradient |

The maximum theoretical rotation is bounded by the `x * 30` and `y * 30` multipliers in the JS. With `x` and `y` clamped by the card bounds (normalized to `[-0.5, 0.5]`), the maximum target rotation is **±15°** on each axis. In practice, spring physics means the card never reaches the full target; the spring damps toward the target.

Note: the spec comment in the task description mentions "±12°" but the actual source code uses `* 30` on a `[-0.5, 0.5]` normalized value, yielding a **±15° maximum target**. The spring will approach but typically not reach this value before the cursor moves again.

---

## 5. JavaScript Implementation

### 5.1 Infrastructure (shared across all animations in the file)

The tilt card uses the global spring manager declared at the top of the script block:

```js
// Spring solver — damped harmonic oscillator: F = −kx − cv
function springStep(state, config, dt) {
  const { stiffness, damping, mass } = config;
  const springForce = -stiffness * (state.value - state.target);
  const dampingForce = -damping * state.velocity;
  const acceleration = (springForce + dampingForce) / mass;
  state.velocity += acceleration * dt;
  state.value += state.velocity * dt;
}

// Animation manager — single shared rAF loop
const animations = new Map();
let globalAnimId = null;
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

function registerAnimation(key, updateFn) {
  animations.set(key, { update: updateFn, active: false });
}

function activateAnimation(key) {
  const a = animations.get(key);
  if (a) a.active = true;
  if (!globalAnimId) globalLoop();
}

function deactivateAnimation(key) {
  const a = animations.get(key);
  if (a) a.active = false;
}

let lastTime = 0;
function globalLoop(now) {
  if (!now) now = performance.now();
  const dt = Math.min((now - lastTime) / 1000, 0.05); // cap at 50ms
  lastTime = now;

  let anyActive = false;
  animations.forEach((a) => {
    if (a.active) {
      a.update(dt, now);
      anyActive = true;
    }
  });

  if (anyActive) {
    globalAnimId = requestAnimationFrame(globalLoop);
  } else {
    globalAnimId = null;
  }
}
```

### 5.2 Spring Preset: `SPRING_PRESETS.tilt`

```js
const SPRING_PRESETS = {
  // … other presets …
  tilt: { stiffness: 200, damping: 20, mass: 1 },
  // …
};
```

| Parameter | Value | Effect |
|---|---|---|
| `stiffness` | `200` | Moderate snap toward target — less stiff than buttons (300), softer feel |
| `damping` | `20` | Critically damped-ish — minimal overshoot, smooth settle |
| `mass` | `1` | Standard mass |

### 5.3 Full Tilt Card Implementation Block

```js
(function() {
  const card = document.getElementById('tilt-card-1');
  if (!card) return;
  const shine = card.querySelector('.tilt-shine');

  // Independent spring state for each rotation axis
  const rotX = { value: 0, velocity: 0, target: 0 };
  const rotY = { value: 0, velocity: 0, target: 0 };
  const tiltCfg = SPRING_PRESETS.tilt;

  card.addEventListener('mousemove', (e) => {
    if (reducedMotion) return;
    const rect = card.getBoundingClientRect();
    // Normalize cursor to [-0.5, 0.5] range relative to card center
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    // Set spring targets: rotY follows horizontal cursor, rotX follows vertical (inverted)
    rotY.target = x * 30;
    rotX.target = -y * 30;
    // Dynamically recompute shine gradient based on horizontal cursor position
    if (shine) {
      shine.style.background = `linear-gradient(${135 + x * 60}deg, oklch(1 0 0 / ${0.1 + Math.abs(x) * 0.15}), transparent 60%)`;
    }
    activateAnimation('tilt');
  });

  card.addEventListener('mouseleave', () => {
    // Reset both spring targets to zero; spring will animate back
    rotX.target = 0;
    rotY.target = 0;
    activateAnimation('tilt');
  });

  registerAnimation('tilt', (dt) => {
    springStep(rotX, tiltCfg, dt);
    springStep(rotY, tiltCfg, dt);
    card.style.transform = `rotateX(${rotX.value}deg) rotateY(${rotY.value}deg)`;
    // Deactivate when both springs have settled (value near target, velocity near zero)
    if (Math.abs(rotX.value - rotX.target) < 0.1 &&
        Math.abs(rotY.value - rotY.target) < 0.1 &&
        Math.abs(rotX.velocity) < 0.1 &&
        Math.abs(rotY.velocity) < 0.1) {
      deactivateAnimation('tilt');
    }
  });
})();
```

### 5.4 Rotation Calculation

| Step | Code | Notes |
|---|---|---|
| Get cursor position within card | `const x = (e.clientX - rect.left) / rect.width - 0.5` | Normalizes to `[-0.5, 0.5]`, center = 0 |
| Get cursor Y within card | `const y = (e.clientY - rect.top) / rect.height - 0.5` | Same normalization |
| Set Y-axis rotation target | `rotY.target = x * 30` | Cursor right → card tilts right (positive rotY) |
| Set X-axis rotation target | `rotX.target = -y * 30` | Cursor down → card tilts back (negative = tilt toward viewer at bottom) |
| Maximum target | `±15°` | When cursor is at card edge (`x = ±0.5`, `0.5 * 30 = 15`) |

### 5.5 Shine Calculation

On every `mousemove`, the shine gradient is recomputed:

```js
shine.style.background = `linear-gradient(
  ${135 + x * 60}deg,
  oklch(1 0 0 / ${0.1 + Math.abs(x) * 0.15}),
  transparent 60%
)`;
```

| Parameter | Range | Effect |
|---|---|---|
| Gradient angle | `135° ± 30°` (i.e. `105°`–`165°`) | Rotates with horizontal cursor — simulates light source tracking |
| Shine opacity | `0.10`–`0.25` | Increases as cursor moves further from center horizontally |
| Transparent stop | `60%` | Constant — shine fades to transparent at 60% of the gradient |

At center (`x = 0`): angle = `135deg`, opacity = `0.10`.
At left edge (`x = -0.5`): angle = `105deg`, opacity = `0.175`.
At right edge (`x = 0.5`): angle = `165deg`, opacity = `0.175`.

### 5.6 Animation Loop Deactivation

The tilt animation uses the **on-demand activation** pattern. The rAF loop only runs while the tilt animation is active. It deactivates itself when all four conditions are met:

```js
Math.abs(rotX.value - rotX.target) < 0.1  // X close to target
Math.abs(rotY.value - rotY.target) < 0.1  // Y close to target
Math.abs(rotX.velocity) < 0.1             // X velocity nearly zero
Math.abs(rotY.velocity) < 0.1             // Y velocity nearly zero
```

Threshold: `0.1` degrees for position, `0.1 deg/s` for velocity.

---

## 6. Accessibility

### 6.1 `prefers-reduced-motion: reduce`

Two layers of protection:

**CSS layer** (global rule in the file):
```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}
```
This collapses the `.tilt-shine` `transition` to nearly zero.

**JavaScript layer** (inline guard on every `mousemove`):
```js
card.addEventListener('mousemove', (e) => {
  if (reducedMotion) return;
  // … rest of handler
});
```

The `reducedMotion` flag is set once at initialization:
```js
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
```

When reduced motion is active: the `mousemove` handler exits immediately, `rotX.target` and `rotY.target` are never updated, and `activateAnimation('tilt')` is never called. The card remains static. The `mouseleave` handler still fires (it does not have the `reducedMotion` guard), but since targets are already at 0 and values are at 0, the spring loop deactivates instantly.

### 6.2 Keyboard

The tilt effect is mouse-only. Keyboard users interact with the card normally — no tilt occurs on `:focus`.

---

## 7. Token Dependencies

### Tier 2 (Semantic)

| Token | Usage |
|---|---|
| `--bg-surface` | Card background |
| `--border-default` | Card border (sides and bottom) |
| `--accent-primary` | Default `border-top` color (overridden per-instance) |
| `--shadow-md` | Card drop shadow |

### Tier 3 (Component)

| Token | Usage |
|---|---|
| `--radius-md` | Card border-radius |
| `--motion-fast` | Shine `transition-duration` (CSS only, not used in tilt JS) |
| `--ease-out` | Shine `transition-timing-function` (CSS only) |

### Non-Tokenized Values

| Value | Usage |
|---|---|
| `160px` | Card width |
| `100px` | Card height |
| `800px` | Perspective distance on parent |
| `30` | Rotation multiplier (degrees per normalized unit) |
| `±15°` | Maximum rotation target |
| `0.1` | Spring settlement threshold (degrees and deg/s) |
| `135deg ± 30` | Shine gradient angle range |
| `0.10`–`0.25` | Shine opacity range |
| `SPRING_PRESETS.tilt` | `{ stiffness: 200, damping: 20, mass: 1 }` |

---

## 8. Test Specification

### 8.1 Computed Style Assertions

- `.tilt-card` has `transform-style: preserve-3d`
- `.tilt-card` has `will-change: transform`
- `.tilt-card` has `position: relative` and `overflow: hidden`
- Parent wrapper has `perspective: 800px`
- `.tilt-shine` has `position: absolute`, `inset: 0`, and `pointer-events: none`
- `.tilt-shine` initial `background` is `linear-gradient(135deg, oklch(1 0 0 / 0.15), transparent 60%)`

### 8.2 Interaction Assertions

- On `mousemove` within card bounds, `card.style.transform` contains `rotateX(` and `rotateY(`
- With cursor at right edge (`x = 0.5`), `rotY.target` equals `15`
- With cursor at bottom edge (`y = 0.5`), `rotX.target` equals `-15`
- With cursor at center, both targets equal `0`
- On `mouseleave`, both targets reset to `0`; card animates back to `rotateX(0deg) rotateY(0deg)`
- `.tilt-shine` `background` changes on `mousemove` with a different angle than `135deg` when cursor is off-center
- Animation deactivates after spring settles (both position and velocity within 0.1 threshold)

### 8.3 Visual Regression Scenarios

- Card at rest — default gradient, no transform (light mode)
- Card at rest — default gradient, no transform (dark mode)
- Card tilted: cursor at top-right corner (positive rotY, positive rotX)
- Card tilted: cursor at bottom-left corner (negative rotY, negative rotX)
- Card mid-spring-return (captured 100ms after mouseleave)

### 8.4 Reduced Motion Compliance

- With `prefers-reduced-motion: reduce`:
  - `mousemove` handler returns immediately — no transform applied
  - Card `transform` remains at browser default (no `rotateX`/`rotateY`)
  - `activateAnimation('tilt')` is never called
  - `mouseleave` fires but spring is already settled (no visible animation)
  - CSS `transition-duration` collapses to `0.01ms` via global media query

---

## 9. Implementation CSS

```css
/* Parent wrapper — perspective must be on the PARENT, not the card */
.tilt-stage {
  perspective: 800px;
}

@layer component {
  .tilt-card {
    width: 160px;
    height: 100px;
    background: var(--bg-surface);
    border: 2px solid var(--border-default);
    border-top: 4px solid var(--accent-primary);
    border-radius: var(--radius-md);
    box-shadow: var(--shadow-md);
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
    overflow: hidden;
    cursor: pointer;
    transform-style: preserve-3d;
    will-change: transform;
  }

  .tilt-shine {
    position: absolute;
    inset: 0;
    background: linear-gradient(135deg, oklch(1 0 0 / 0.15), transparent 60%);
    pointer-events: none;
    transition: opacity var(--motion-fast) var(--ease-out);
  }
}
```

## 10. Implementation JavaScript

```js
// Requires: springStep(), registerAnimation(), activateAnimation(), deactivateAnimation(),
//           reducedMotion, SPRING_PRESETS — all from the shared animation manager

(function() {
  const card = document.getElementById('tilt-card-1');
  if (!card) return;
  const shine = card.querySelector('.tilt-shine');

  const rotX = { value: 0, velocity: 0, target: 0 };
  const rotY = { value: 0, velocity: 0, target: 0 };
  const tiltCfg = SPRING_PRESETS.tilt; // { stiffness: 200, damping: 20, mass: 1 }

  card.addEventListener('mousemove', (e) => {
    if (reducedMotion) return;
    const rect = card.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    rotY.target = x * 30;
    rotX.target = -y * 30;
    if (shine) {
      shine.style.background = `linear-gradient(${135 + x * 60}deg, oklch(1 0 0 / ${0.1 + Math.abs(x) * 0.15}), transparent 60%)`;
    }
    activateAnimation('tilt');
  });

  card.addEventListener('mouseleave', () => {
    rotX.target = 0;
    rotY.target = 0;
    activateAnimation('tilt');
  });

  registerAnimation('tilt', (dt) => {
    springStep(rotX, tiltCfg, dt);
    springStep(rotY, tiltCfg, dt);
    card.style.transform = `rotateX(${rotX.value}deg) rotateY(${rotY.value}deg)`;
    if (Math.abs(rotX.value - rotX.target) < 0.1 &&
        Math.abs(rotY.value - rotY.target) < 0.1 &&
        Math.abs(rotX.velocity) < 0.1 &&
        Math.abs(rotY.velocity) < 0.1) {
      deactivateAnimation('tilt');
    }
  });
})();
```
