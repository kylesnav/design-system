# Delightful Design System — JS Motion Patterns

Vanilla JS animation patterns for spring physics, FLIP layout transitions, particle systems, gesture handling, and generative effects. No dependencies. Every pattern respects `prefers-reduced-motion`.

For CSS-based animations and keyframes, see `interactions.md`. For token values (durations, easings), see `tokens.md`.

---

## Spring Physics

The foundation of Delightful JS motion. Springs produce natural, physically-grounded movement that CSS transitions cannot replicate — they overshoot, oscillate, and settle organically.

### The Spring Solver

Damped harmonic oscillator. Call it every frame for each animated value.

```js
function springStep(state, config, dt) {
  // Damped harmonic oscillator: F = -kx - cv
  const { stiffness, damping, mass } = config;
  const springForce = -stiffness * (state.value - state.target);
  const dampingForce = -damping * state.velocity;
  const acceleration = (springForce + dampingForce) / mass;
  state.velocity += acceleration * dt;
  state.value += state.velocity * dt;
}
```

### State Shape

Each animated value is a plain object:

```js
const state = {
  value: 0,       // current position
  velocity: 0,    // current speed (units/sec)
  target: 1,      // where the spring is pulling toward
};
```

Set `target` to change the destination. The solver handles the rest. You can also inject `velocity` for impulse effects (e.g., flick gestures, button pops).

### Config Shape

```js
const config = {
  stiffness: 300,  // spring constant (higher = snappier, faster)
  damping: 15,     // friction (higher = less oscillation, faster settle)
  mass: 1,         // inertia (higher = slower, heavier feel)
};
```

**Parameter guide:**
- **stiffness** — How aggressively the spring pulls toward target. 100 = lazy, 500 = very snappy.
- **damping** — How quickly oscillation dies out. Low values (10-15) bounce visibly. High values (30+) settle fast with minimal overshoot.
- **mass** — Resistance to change. Keep at 1 unless you want a heavy/sluggish feel.

### Spring Presets

Named configs for common use cases. These are the system defaults:

```js
const SPRING_PRESETS = {
  button:   { stiffness: 300, damping: 15, mass: 1 },  // press/release, slight bounce
  toggle:   { stiffness: 380, damping: 18, mass: 1 },  // switch knob travel
  open:     { stiffness: 260, damping: 20, mass: 1 },  // accordion/panel expand
  close:    { stiffness: 320, damping: 28, mass: 1 },  // accordion/panel collapse (faster, less bounce)
  bounce:   { stiffness: 200, damping: 14, mass: 1 },  // playful overshoot (bubbles, badges)
  wave:     { stiffness: 300, damping: 12, mass: 1 },  // ripple displacement
  elastic:  { stiffness: 300, damping: 22, mass: 1 },  // overscroll snap-back
  tilt:     { stiffness: 200, damping: 20, mass: 1 },  // mouse-tracked perspective
  badge:    { stiffness: 400, damping: 16, mass: 1 },  // counter pop-in
  snappy:   { stiffness: 500, damping: 30, mass: 1 },  // fast stagger entrance
  standard: { stiffness: 400, damping: 35, mass: 1 },  // general-purpose stagger
  gentle:   { stiffness: 300, damping: 28, mass: 1 },  // slow stagger entrance
  chain:    { stiffness: 120, damping: 12, mass: 1 },  // follow-the-leader trail
};
```

### Pattern: Spring Button

Press scales down, release springs back. The `pressing` flag prevents deactivation while the pointer is held.

```js
const state = { value: 1, velocity: 0, target: 1 };
const config = SPRING_PRESETS.button;
let pressing = false;

registerAnimation('spring-btn', (dt) => {
  if (reducedMotion) { state.value = state.target; state.velocity = 0; }
  else { springStep(state, config, dt); }
  el.style.transform = `scale(${state.value})`;
  if (Math.abs(state.value - state.target) < 0.001 && Math.abs(state.velocity) < 0.01) {
    state.value = state.target;
    el.style.transform = `scale(${state.target})`;
    if (!pressing) deactivateAnimation('spring-btn');
  }
});

stage.addEventListener('pointerdown', () => {
  pressing = true;
  state.target = 0.85;
  activateAnimation('spring-btn');
});
stage.addEventListener('pointerup', () => {
  pressing = false;
  state.target = 1;
  activateAnimation('spring-btn');
});
stage.addEventListener('pointerleave', () => {
  if (pressing) { pressing = false; state.target = 1; activateAnimation('spring-btn'); }
});
```

### Pattern: Spring Chain

Nodes follow each other with staggered spring constants. The leader tracks the mouse; followers trail with decreasing stiffness and increasing damping.

```js
const NODES = 8;
const nodes = []; // { x, y, vx, vy, color }

// Leader follows mouse
const leader = nodes[0];
const stiffness = 120, damping = 12;
leader.vx += (mx - leader.x) * stiffness * dt - leader.vx * damping * dt;
leader.vy += (my - leader.y) * stiffness * dt - leader.vy * damping * dt;
leader.x += leader.vx * dt;
leader.y += leader.vy * dt;

// Followers chase the node ahead of them
for (let i = 1; i < NODES; i++) {
  const prev = nodes[i - 1];
  const node = nodes[i];
  const s = 80 - i * 5;   // stiffness decreases down the chain
  const d = 10 + i;        // damping increases down the chain
  node.vx += (prev.x - node.x) * s * dt - node.vx * d * dt;
  node.vy += (prev.y - node.y) * s * dt - node.vy * d * dt;
  node.x += node.vx * dt;
  node.y += node.vy * dt;
}
```

### Pattern: Spring Toggle

Knob slides between two positions with velocity injection for a satisfying pop.

```js
const TRAVEL = 26; // px distance between off and on positions
const springConfig = SPRING_PRESETS.toggle;
const state = { value: 0, velocity: 0, target: 0 };
let isOn = false;

el.addEventListener('click', () => {
  isOn = !isOn;
  state.target = isOn ? TRAVEL : 0;
  el.setAttribute('aria-checked', String(isOn));
  // Inject velocity in the direction of travel for a pop effect
  const dir = isOn ? 1 : -1;
  state.velocity += dir * 80;
  activateAnimation(key);
});

registerAnimation(key, (dt) => {
  if (reducedMotion) { state.value = state.target; state.velocity = 0; }
  else { springStep(state, springConfig, dt); }
  knob.style.transform = `translateX(${state.value}px)`;
  const settled = Math.abs(state.value - state.target) < 0.3 && Math.abs(state.velocity) < 0.5;
  if (settled) { state.value = state.target; state.velocity = 0; deactivateAnimation(key); }
});
```

### Pattern: Spring Accordion

Height animation driven by spring physics. Each panel has its own spring state. Uses different presets for opening vs closing.

```js
const SPRING_OPEN = SPRING_PRESETS.open;    // softer, more bounce
const SPRING_CLOSE = SPRING_PRESETS.close;  // faster, less bounce

// Per-panel state
const panelState = {
  isOpen: false,
  naturalH: 0,   // measured natural height of content
  spring: { value: 0, velocity: 0, target: 0 },
};

// Measure natural heights (call on init and resize)
function measureHeights() {
  body.style.height = 'auto';
  panelState.naturalH = inner.getBoundingClientRect().height + 4;
  body.style.height = panelState.isOpen ? panelState.naturalH + 'px' : '0px';
}

// On header click
header.addEventListener('click', () => {
  panelState.isOpen = !panelState.isOpen;
  panelState.spring.target = panelState.isOpen ? panelState.naturalH : 0;
  if (panelState.isOpen) panelState.spring.velocity += 60; // pop on open
  header.setAttribute('aria-expanded', String(panelState.isOpen));
  activateAnimation(key);
});

registerAnimation(key, (dt) => {
  if (reducedMotion) { panelState.spring.value = panelState.spring.target; panelState.spring.velocity = 0; }
  else { springStep(panelState.spring, panelState.isOpen ? SPRING_OPEN : SPRING_CLOSE, dt); }
  const h = Math.max(0, panelState.spring.value);
  body.style.height = h + 'px';
  // Animate chevron rotation based on progress
  const progress = panelState.naturalH > 0 ? Math.max(0, Math.min(1, h / panelState.naturalH)) : 0;
  chevron.style.transform = `rotate(${progress * 180}deg)`;
  const settled = Math.abs(panelState.spring.value - panelState.spring.target) < 0.5
               && Math.abs(panelState.spring.velocity) < 1;
  if (settled) {
    panelState.spring.value = panelState.spring.target;
    panelState.spring.velocity = 0;
    body.style.height = panelState.spring.target <= 0 ? '0px' : panelState.naturalH + 'px';
    deactivateAnimation(key);
  }
});
```

---

## Animation Manager

A single `requestAnimationFrame` loop drives all JS animations. Register once, activate/deactivate on demand. This avoids multiple competing rAF loops and makes it easy to pause everything offscreen.

### API

```js
const animations = new Map();
let globalAnimId = null;

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
```

### The Global Loop

Runs only when at least one animation is active. Caps `dt` at 50ms to prevent jumps after tab-switch.

```js
let lastTime = 0;
function globalLoop(now) {
  if (!now) now = performance.now();
  const dt = Math.min((now - lastTime) / 1000, 0.05); // seconds, capped
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
    globalAnimId = null; // loop stops when nothing is running
  }
}
```

### Lazy Activation with IntersectionObserver

Only start animations when their canvas/container scrolls into view. Deactivate when offscreen.

```js
function observeCanvas(canvasOrParent, key, initFn) {
  let initialized = false;
  const obs = new IntersectionObserver(([entry]) => {
    if (entry.isIntersecting) {
      if (!initialized) {
        initFn();
        initialized = true;
        // Reduced motion: draw one static frame, then stop
        if (reducedMotion) {
          const a = animations.get(key);
          if (a) { a.update(0.016, performance.now()); }
          return;
        }
      }
      activateAnimation(key);
    } else {
      deactivateAnimation(key);
    }
  }, { threshold: 0.05 });
  obs.observe(canvasOrParent);
}
```

### Canvas Resize Helper

Standard DPR-aware canvas sizing:

```js
function setupCanvas(canvas) {
  const dpr = window.devicePixelRatio || 1;
  const rect = canvas.parentElement.getBoundingClientRect();
  const w = rect.width;
  const h = rect.height;
  canvas.width = w * dpr;
  canvas.height = h * dpr;
  canvas.style.width = w + 'px';
  canvas.style.height = h + 'px';
  const ctx = canvas.getContext('2d');
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  return { ctx, w, h, dpr };
}
```

---

## FLIP Layout Animation

FLIP (First, Last, Invert, Play) animates layout changes that CSS cannot transition — DOM reordering, filtering, adding/removing elements.

### How It Works

1. **First** — Record the bounding rect of each element before the DOM change.
2. **Last** — Make the DOM change (reorder, filter, add/remove). The browser reflows.
3. **Invert** — Calculate the delta between old and new positions. Apply an instant `transform` to make elements appear in their old positions.
4. **Play** — Remove the transform with a transition so elements glide to their new positions.

### The flipAnimate Helper

```js
function flipAnimate(elements, firstRects, options = {}) {
  const { duration = 400, easing = 'cubic-bezier(0.22, 1, 0.36, 1)' } = options;
  elements.forEach((el, i) => {
    const first = firstRects instanceof Map ? firstRects.get(el) : firstRects[i];
    if (!first) return;
    const last = el.getBoundingClientRect();
    const dx = first.left - last.left;
    const dy = first.top - last.top;
    if (Math.abs(dx) < 1 && Math.abs(dy) < 1) return;
    el.style.transform = `translate(${dx}px, ${dy}px)`;
    el.style.transition = 'none';
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        el.style.transition = `transform ${duration}ms ${easing}`;
        el.style.transform = '';
        el.addEventListener('transitionend', () => { el.style.transition = ''; }, { once: true });
      });
    });
  });
}
```

The double `requestAnimationFrame` is critical — the first frame applies the inverted transform, the second starts the transition. Without it, the browser batches both changes and nothing animates.

Default easing is `--ease-smooth` (`cubic-bezier(0.22, 1, 0.36, 1)`). Default duration is 400ms (between `--motion-base` 240ms and `--motion-deliberate` 500ms).

Accepts either a `Map<Element, DOMRect>` (for filtered/partial sets) or an array of rects indexed to match the elements array.

### Use Case: Shuffle / Reorder

```js
const cards = [...grid.children];
// FIRST: capture current positions
const firstRects = new Map(cards.map(c => [c, c.getBoundingClientRect()]));

// DOM CHANGE: Fisher-Yates shuffle
for (let i = cards.length - 1; i > 0; i--) {
  const j = Math.floor(Math.random() * (i + 1));
  grid.appendChild(cards[j]);
}

// PLAY: animate to new positions
flipAnimate([...grid.children], firstRects);
```

### Use Case: Filter Grid

Show/hide items based on a filter, with FLIP on the surviving items and scale-out on removed ones.

```js
const cards = [...grid.children];
const firstRects = new Map(cards.map(c => [c, c.getBoundingClientRect()]));

const visible = [];
cards.forEach(c => {
  if (filter === 'all' || c.dataset.color === filter) {
    c.style.display = '';
    c.style.transform = '';
    c.style.opacity = '';
    visible.push(c);
  } else {
    c.style.transform = 'scale(0)';
    c.style.opacity = '0';
    setTimeout(() => { c.style.display = 'none'; }, 400);
  }
});

requestAnimationFrame(() => flipAnimate(visible, firstRects));
```

### Use Case: Reorder List (Swap)

Move an item up or down in a list with FLIP on both the moved item and its swap partner.

```js
function flipSwap(item, direction) {
  const items = [...list.children];
  const idx = items.indexOf(item);
  const swapIdx = idx + direction;
  if (swapIdx < 0 || swapIdx >= items.length) return;

  const other = items[swapIdx];
  const rects = new Map([
    [item, item.getBoundingClientRect()],
    [other, other.getBoundingClientRect()],
  ]);

  if (direction === -1) list.insertBefore(item, other);
  else list.insertBefore(other, item);

  flipAnimate([item, other], rects, { duration: 380 });
}
```

### Use Case: Toast Stack

Add/remove toasts with FLIP on the remaining items as they reflow.

```js
// Adding a toast — FLIP existing items, spring-in the new one
const existing = [...container.querySelectorAll('.toast-item')];
const firstRects = existing.map(el => el.getBoundingClientRect());
container.appendChild(newToast);
flipAnimate(existing, firstRects, { duration: 300 });

// Removing a toast — slide out, then FLIP remaining
const remaining = [...container.querySelectorAll('.toast-item')].filter(el => el !== toast);
const rects = remaining.map(el => el.getBoundingClientRect());
// ... animate toast out ...
toast.addEventListener('transitionend', () => {
  toast.remove();
  flipAnimate(remaining, rects, { duration: 300 });
}, { once: true });
```

---

## Particle Systems

Canvas-based effects using object pools for zero-allocation animation loops.

### Object Pool Pattern

Pre-allocate all particles. Activate/deactivate by flipping the `active` flag. No `new` calls during animation.

```js
function createConfettiPool(size) {
  const pool = [];
  for (let i = 0; i < size; i++) {
    pool.push({
      active: false,
      x: 0, y: 0, vx: 0, vy: 0,
      r: 0, color: '', life: 0, maxLife: 0,
      rotation: 0, rotSpeed: 0, shape: 0,
    });
  }
  return pool;
}
```

### Confetti

Gravity-affected, rotating particles in three shapes (rectangle, circle, triangle). Uses the full accent palette.

**Emitter:**

```js
function emitConfetti(pool, cx, cy, count, opts = {}) {
  const { spread = 1.2, speedMin = 200, speedMax = 600, lifeMin = 1, lifeMax = 2.5 } = opts;
  const palette = getAccentPalette(); // [primary, gold, cyan, danger, green, purple]
  let emitted = 0;
  for (const p of pool) {
    if (p.active || emitted >= count) continue;
    p.active = true;
    p.x = cx; p.y = cy;
    const angle = -Math.PI / 2 + (Math.random() - 0.5) * spread;
    const speed = speedMin + Math.random() * (speedMax - speedMin);
    p.vx = Math.cos(angle) * speed;
    p.vy = Math.sin(angle) * speed;
    p.r = 3 + Math.random() * 5;
    p.color = palette[Math.floor(Math.random() * palette.length)];
    p.life = 0;
    p.maxLife = lifeMin + Math.random() * (lifeMax - lifeMin);
    p.rotation = Math.random() * Math.PI * 2;
    p.rotSpeed = (Math.random() - 0.5) * 10;
    p.shape = Math.floor(Math.random() * 3); // 0=rect, 1=circle, 2=triangle
    emitted++;
  }
  return emitted;
}
```

**Renderer:**

```js
function renderConfetti(ctx, pool, dt, w, h) {
  let active = 0;
  for (const p of pool) {
    if (!p.active) continue;
    p.life += dt;
    if (p.life > p.maxLife) { p.active = false; continue; }
    active++;
    p.vy += 400 * dt;           // gravity
    p.vx *= 0.99;               // air resistance
    p.x += p.vx * dt;
    p.y += p.vy * dt;
    p.rotation += p.rotSpeed * dt;
    const alpha = 1 - p.life / p.maxLife; // fade out

    ctx.save();
    ctx.translate(p.x, p.y);
    ctx.rotate(p.rotation);
    ctx.globalAlpha = alpha;
    ctx.fillStyle = p.color;
    if (p.shape === 0) ctx.fillRect(-p.r, -p.r / 3, p.r * 2, p.r * 0.66);
    else if (p.shape === 1) {
      ctx.beginPath(); ctx.arc(0, 0, p.r / 2, 0, Math.PI * 2); ctx.fill();
    } else {
      ctx.beginPath();
      ctx.moveTo(0, -p.r);
      ctx.lineTo(p.r * 0.7, p.r * 0.5);
      ctx.lineTo(-p.r * 0.7, p.r * 0.5);
      ctx.fill();
    }
    ctx.restore();
  }
  return active; // return 0 to signal deactivation
}
```

**Integration with animation manager:**

```js
const pool = createConfettiPool(200);

registerAnimation('confetti', (dt) => {
  ctx.clearRect(0, 0, w, h);
  if (renderConfetti(ctx, pool, dt, w, h) === 0) deactivateAnimation('confetti');
});

// Fire on click
canvas.addEventListener('click', (e) => {
  const rect = canvas.getBoundingClientRect();
  emitConfetti(pool, e.clientX - rect.left, e.clientY - rect.top, 40);
  activateAnimation('confetti');
});
```

### Fireworks

Two-phase system: rockets ascend, then explode into sparks. Uses array-based pools (not pre-allocated) since fireworks are infrequent.

```js
const rockets = [];
const sparks = [];

// Launch on click
canvas.addEventListener('click', (e) => {
  const rect = canvas.getBoundingClientRect();
  const tx = e.clientX - rect.left;
  const ty = e.clientY - rect.top;
  rockets.push({
    x: w / 2, y: h,
    tx, ty,
    vy: -400 - Math.random() * 200,
    vx: (tx - w / 2) * 0.5,
    life: 0,
    color: palette[Math.floor(Math.random() * 4)],
  });
  activateAnimation('fireworks');
});

registerAnimation('fireworks', (dt) => {
  // Semi-transparent fill for trail effect
  ctx.fillStyle = bgColor + '18';
  ctx.fillRect(0, 0, w, h);

  // Update rockets
  for (let i = rockets.length - 1; i >= 0; i--) {
    const r = rockets[i];
    r.x += r.vx * dt;
    r.y += r.vy * dt;
    r.vy += 150 * dt; // gravity
    r.life += dt;

    // Draw rocket
    ctx.beginPath();
    ctx.arc(r.x, r.y, 3, 0, Math.PI * 2);
    ctx.fillStyle = r.color;
    ctx.fill();

    // Explode when velocity reverses or timeout
    if (r.vy > 0 || r.life > 2) {
      const count = 40 + Math.floor(Math.random() * 30);
      for (let j = 0; j < count; j++) {
        const angle = Math.random() * Math.PI * 2;
        const speed = 60 + Math.random() * 180;
        sparks.push({
          x: r.x, y: r.y,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          life: 0, maxLife: 0.8 + Math.random() * 0.8,
          color: r.color, r: 2 + Math.random() * 2,
        });
      }
      rockets.splice(i, 1);
    }
  }

  // Update sparks
  for (let i = sparks.length - 1; i >= 0; i--) {
    const s = sparks[i];
    s.life += dt;
    if (s.life > s.maxLife) { sparks.splice(i, 1); continue; }
    s.vy += 120 * dt;  // gravity
    s.vx *= 0.98;      // drag
    s.x += s.vx * dt;
    s.y += s.vy * dt;
    const alpha = 1 - s.life / s.maxLife;
    ctx.beginPath();
    ctx.arc(s.x, s.y, s.r * alpha, 0, Math.PI * 2);
    ctx.fillStyle = s.color;
    ctx.globalAlpha = alpha;
    ctx.fill();
    ctx.globalAlpha = 1;
  }

  if (rockets.length === 0 && sparks.length === 0) deactivateAnimation('fireworks');
});
```

### Bubbles (Token Bubbles)

Floating labeled circles representing color families. Spring-scale on click with micro-particle burst.

```js
// Each bubble has its own spring for the pop effect
const bubble = {
  x: posX, y: posY,
  vx: (Math.random() - 0.5) * 0.5,
  vy: (Math.random() - 0.5) * 0.5,
  r: radius, color: accentColor, name: 'Pink',
  scale: { value: 1, velocity: 0, target: 1 },
};

// On click — spring-pop the hit bubble
canvas.addEventListener('click', (e) => {
  for (const b of bubbles) {
    const dx = mx - b.x, dy = my - b.y;
    if (Math.sqrt(dx * dx + dy * dy) < b.r * b.scale.value) {
      b.scale.target = 1.3;
      b.scale.velocity = 5;   // impulse
      activateAnimation('token-bubbles');
      // emit micro-particles from the bubble
      break;
    }
  }
});

// In the render loop
springStep(b.scale, SPRING_PRESETS.bounce, dt);
if (b.scale.target > 1 && b.scale.value >= b.scale.target - 0.05) {
  b.scale.target = 1; // spring back after overshoot
}
```

---

## Gesture Handling

Interactive patterns driven by pointer events. All gestures still function when reduced motion is active — they just skip the animated transitions.

### Drag with Inertia + Spring Damping

Track velocity during drag. On release, apply inertia with exponential decay.

```js
let dragging = false;
let startX, startY, cardX, cardY;
let velX = 0, velY = 0, lastX = 0, lastY = 0, lastTime = 0;
let inertiaId = null;

card.addEventListener('pointerdown', (e) => {
  e.preventDefault();
  dragging = true;
  card.setPointerCapture(e.pointerId);
  const rect = card.getBoundingClientRect();
  const parentRect = stage.getBoundingClientRect();
  cardX = rect.left - parentRect.left;
  cardY = rect.top - parentRect.top;
  startX = e.clientX - cardX;
  startY = e.clientY - cardY;
  lastX = e.clientX; lastY = e.clientY;
  lastTime = performance.now();
  velX = 0; velY = 0;
  if (inertiaId) cancelAnimationFrame(inertiaId);
});

card.addEventListener('pointermove', (e) => {
  if (!dragging) return;
  const nx = e.clientX - startX;
  const ny = e.clientY - startY;
  card.style.left = nx + 'px';
  card.style.top = ny + 'px';

  // Track velocity for inertia
  const now = performance.now();
  const dt = (now - lastTime) / 1000;
  if (dt > 0) {
    velX = (e.clientX - lastX) / dt;
    velY = (e.clientY - lastY) / dt;
  }
  lastX = e.clientX; lastY = e.clientY; lastTime = now;
});

card.addEventListener('pointerup', () => {
  if (!dragging) return;
  dragging = false;

  // Inertia — skip when reduced motion
  if (reducedMotion) return;
  let ix = velX * 0.15;
  let iy = velY * 0.15;
  function inertia() {
    ix *= 0.92;   // exponential decay
    iy *= 0.92;
    const cl = parseFloat(card.style.left) || 0;
    const ct = parseFloat(card.style.top) || 0;
    card.style.left = (cl + ix) + 'px';
    card.style.top = (ct + iy) + 'px';
    if (Math.abs(ix) > 0.5 || Math.abs(iy) > 0.5) {
      inertiaId = requestAnimationFrame(inertia);
    }
  }
  if (Math.abs(ix) > 1 || Math.abs(iy) > 1) inertia();
});
```

### Swipe-to-Dismiss with FLIP Reflow

Cards can be swiped horizontally. Past the threshold, they fly out. Remaining cards FLIP into new positions.

```js
let startX = 0, offsetX = 0, dragging = false;

card.addEventListener('pointerdown', (e) => {
  dragging = true;
  startX = e.clientX;
  offsetX = 0;
  card.setPointerCapture(e.pointerId);
  card.style.transition = 'none';
});

card.addEventListener('pointermove', (e) => {
  if (!dragging) return;
  offsetX = e.clientX - startX;
  const rotation = (offsetX / 300) * 15;          // tilt proportional to drag
  const opacity = Math.max(0, 1 - Math.abs(offsetX) / 300);
  card.style.transform = `translateX(${offsetX}px) rotate(${rotation}deg)`;
  card.style.opacity = opacity;
});

card.addEventListener('pointerup', () => {
  if (!dragging) return;
  dragging = false;
  if (Math.abs(offsetX) > 120) {
    // Dismiss — fly out + FLIP remaining
    if (reducedMotion) {
      card.remove();
    } else {
      const dir = offsetX > 0 ? 1 : -1;
      card.style.transition = 'transform 300ms ease-out, opacity 300ms ease-out';
      card.style.transform = `translateX(${dir * 600}px) rotate(${dir * 30}deg)`;
      card.style.opacity = '0';
      card.addEventListener('transitionend', () => {
        const remaining = [...stack.querySelectorAll('.swipe-card')].filter(c => c !== card);
        const rects = new Map(remaining.map(c => [c, c.getBoundingClientRect()]));
        card.remove();
        flipAnimate(remaining, rects, { duration: 300 });
      }, { once: true });
    }
  } else {
    // Snap back
    card.style.transition = reducedMotion ? 'none'
      : 'transform 300ms cubic-bezier(0.22, 1, 0.36, 1), opacity 300ms ease';
    card.style.transform = '';
    card.style.opacity = '';
  }
});
```

### Elastic Overscroll

Horizontal scroll container with rubber-band physics at the edges. Uses asymptotic clamping during drag and spring snap-back on release.

```js
const springState = { value: 0, velocity: 0, target: 0 };
const springCfg = SPRING_PRESETS.elastic;
const MAX_OVER = 120;

inner.addEventListener('pointermove', (e) => {
  if (!dragging) return;
  const dx = e.clientX - startX;
  const maxScroll = inner.scrollWidth - inner.clientWidth;
  const newScroll = scrollStart - dx;

  if (newScroll < 0) {
    // Past left edge — asymptotic resistance
    inner.scrollLeft = 0;
    overscroll = -newScroll;
    const clamped = overscroll / (1 + overscroll / MAX_OVER);
    inner.style.transform = `translateX(${clamped}px)`;
  } else if (newScroll > maxScroll) {
    // Past right edge
    inner.scrollLeft = maxScroll;
    overscroll = -(newScroll - maxScroll);
    const clamped = -Math.abs(overscroll) / (1 + Math.abs(overscroll) / MAX_OVER);
    inner.style.transform = `translateX(${clamped}px)`;
  } else {
    inner.scrollLeft = newScroll;
    inner.style.transform = '';
  }
});

inner.addEventListener('pointerup', () => {
  if (overscroll !== 0) {
    // Spring snap-back
    springState.value = /* current clamped offset */;
    springState.velocity = 0;
    springState.target = 0;
    activateAnimation('elastic-scroll');
  }
});

registerAnimation('elastic-scroll', (dt) => {
  if (reducedMotion) { springState.value = 0; springState.velocity = 0; }
  else { springStep(springState, springCfg, dt); }
  inner.style.transform = `translateX(${springState.value}px)`;
  if (Math.abs(springState.value) < 0.5 && Math.abs(springState.velocity) < 1) {
    inner.style.transform = '';
    deactivateAnimation('elastic-scroll');
  }
});
```

The asymptotic clamping formula `overscroll / (1 + overscroll / MAX_OVER)` gives iOS-like rubber-band feel — movement slows as you drag further past the edge, approaching `MAX_OVER` but never reaching it.

### Magnetic Buttons (Snap Zones)

Buttons that pull toward the cursor when it enters a threshold radius. Disabled entirely under reduced motion.

```js
if (reducedMotion) return; // no magnetic effect

const threshold = 100; // px radius

stage.addEventListener('mousemove', (e) => {
  buttons.forEach(btn => {
    const rect = btn.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const dx = e.clientX - cx;
    const dy = e.clientY - cy;
    const dist = Math.sqrt(dx * dx + dy * dy);
    if (dist < threshold) {
      const pull = (threshold - dist) / threshold;  // 0 at edge, 1 at center
      btn.style.transform = `translate(${dx * pull * 0.4}px, ${dy * pull * 0.4}px)`;
    } else {
      btn.style.transform = '';
    }
  });
});

stage.addEventListener('mouseleave', () => {
  buttons.forEach(btn => { btn.style.transform = ''; });
});
```

The pull factor (0.4) controls how far the button displaces. Higher values = more dramatic magnetic effect.

---

## Generative Effects

Canvas-based visual effects that run continuously. All use the animation manager for lifecycle control and respect reduced motion.

### Flow Field (Noise-Based)

Particles follow a time-varying vector field. Uses a simple sin-based noise function (no Perlin library needed).

```js
const COUNT = 300;
const particles = []; // { x, y, color }
let time = 0;

// Simple noise using sin — approximates Perlin without dependencies
function noise(x, y, t) {
  return Math.sin(x * 0.02 + t * 0.3) * Math.cos(y * 0.02 - t * 0.2) +
         Math.sin(x * 0.01 - y * 0.01 + t * 0.1) * 0.5;
}

registerAnimation('flowfield', (dt) => {
  time += dt;
  // Semi-transparent fill for trail effect
  ctx.fillStyle = bgColor + '08';
  ctx.fillRect(0, 0, w, h);

  for (const p of particles) {
    const angle = noise(p.x, p.y, time) * Math.PI * 2;
    p.x += Math.cos(angle) * 1.5;
    p.y += Math.sin(angle) * 1.5;

    // Wrap particles that leave the canvas
    if (p.x < 0 || p.x > w || p.y < 0 || p.y > h) {
      p.x = Math.random() * w;
      p.y = Math.random() * h;
    }

    ctx.fillStyle = p.color;
    ctx.fillRect(p.x, p.y, 2, 2);
  }
});
```

The semi-transparent fill (`alpha 0x08`) creates organic trail ribbons as particles move through the field.

### Token Wave (Radial Spring Displacement)

A grid of dots displaced by spring physics radiating from a click point. Creates a ripple effect.

```js
const COLS = 15, ROWS = 13;
const dots = []; // { homeX, homeY, color, spring: { value, velocity, target } }

function triggerWave(cx, cy) {
  const maxDist = Math.sqrt(w * w + h * h) * 0.6;
  dots.forEach(d => {
    const dx = d.homeX - cx, dy = d.homeY - cy;
    const dist = Math.sqrt(dx * dx + dy * dy);
    const delay = dist / maxDist;
    const amp = Math.max(0, 1 - dist / maxDist) * 20;
    setTimeout(() => {
      d.spring.velocity += amp * 40;  // impulse proportional to proximity
      d.spring.target = 0;
      activateAnimation('token-wave');
    }, delay * 400);  // stagger by distance
  });
}

const springCfg = SPRING_PRESETS.wave; // { stiffness: 300, damping: 12, mass: 1 }

registerAnimation('token-wave', (dt) => {
  ctx.clearRect(0, 0, w, h);

  for (const d of dots) {
    if (Math.abs(d.spring.value) > 0.1 || Math.abs(d.spring.velocity) > 0.1) {
      springStep(d.spring, springCfg, dt);
    } else {
      d.spring.value = 0; d.spring.velocity = 0;
    }
    const y = d.homeY + d.spring.value;
    ctx.beginPath();
    ctx.arc(d.homeX, y, 4, 0, Math.PI * 2);
    ctx.fillStyle = d.color;
    ctx.fill();
  }
});
```

Each dot returns to its home position after the wave passes. Auto-triggers from a random point every 3 seconds for ambient motion.

### Tilt Card (Mouse-Tracked Perspective)

3D card rotation driven by mouse position, with spring-smoothed rotation values.

```js
const rotX = { value: 0, velocity: 0, target: 0 };
const rotY = { value: 0, velocity: 0, target: 0 };
const tiltCfg = SPRING_PRESETS.tilt; // { stiffness: 200, damping: 20, mass: 1 }

card.addEventListener('mousemove', (e) => {
  if (reducedMotion) return;
  const rect = card.getBoundingClientRect();
  const x = (e.clientX - rect.left) / rect.width - 0.5;   // -0.5 to 0.5
  const y = (e.clientY - rect.top) / rect.height - 0.5;
  rotY.target = x * 30;   // max 15deg each direction
  rotX.target = -y * 30;
  // Optional: shine overlay tracks mouse position
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
```

The parent element needs `perspective: 800px` (or similar) in CSS for the 3D effect to be visible. Add a `.tilt-shine` overlay with a `linear-gradient` that shifts angle based on mouse position for a specular highlight.

### Aurora Gradient

Ambient animated gradient using moving radial color blobs from the accent palette.

```js
registerAnimation('aurora', (dt) => {
  time += dt * 0.5;
  ctx.clearRect(0, 0, w, h);

  const palette = [
    { color: colors.primary, x: w * (0.3 + Math.sin(time * 0.7) * 0.2), y: h * (0.3 + Math.cos(time * 0.5) * 0.2) },
    { color: colors.gold,    x: w * (0.7 + Math.cos(time * 0.6) * 0.2), y: h * (0.4 + Math.sin(time * 0.4) * 0.2) },
    { color: colors.cyan,    x: w * (0.5 + Math.sin(time * 0.8) * 0.3), y: h * (0.7 + Math.cos(time * 0.3) * 0.2) },
    { color: colors.purple,  x: w * (0.2 + Math.cos(time * 0.5) * 0.15), y: h * (0.6 + Math.sin(time * 0.6) * 0.15) },
  ];

  for (const blob of palette) {
    const grad = ctx.createRadialGradient(blob.x, blob.y, 0, blob.x, blob.y, w * 0.4);
    grad.addColorStop(0, blob.color + '60');  // 37% opacity center
    grad.addColorStop(1, blob.color + '00');  // transparent edge
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, w, h);
  }
});
```

---

## Reduced Motion

Every JS animation pattern checks `prefers-reduced-motion` and adapts.

### The Check

```js
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
```

Set once at initialization. This is a page-level constant — if the user changes their system preference, they reload to pick it up (matching the CSS behavior where `@media (prefers-reduced-motion: reduce)` zeros out all durations).

### Behavior When Active

| Category | Reduced motion behavior |
|----------|------------------------|
| **Spring animations** | Snap instantly: `state.value = state.target; state.velocity = 0;` |
| **Particle systems** | Disabled. Canvas shows one static frame via `observeCanvas`. |
| **FLIP transitions** | Still use `flipAnimate` — the CSS transition handles duration via the system media query. |
| **Drag/gesture** | Gestures still work (pointer tracking, position updates). Inertia and throw animations are skipped. |
| **Magnetic buttons** | Disabled entirely (early return). |
| **Tilt card** | Disabled (early return on mousemove). |
| **Generative effects** | One static frame rendered, then loop stops. |
| **Stagger entrances** | Items appear instantly: `opacity: 1; transform: none;` |

### Pattern: Spring with Reduced Motion Guard

```js
registerAnimation('my-spring', (dt) => {
  if (reducedMotion) {
    state.value = state.target;
    state.velocity = 0;
  } else {
    springStep(state, config, dt);
  }
  el.style.transform = `scale(${state.value})`;
  // ... settlement check + deactivation
});
```

### Pattern: Canvas with Static Frame

```js
observeCanvas(canvas.parentElement, 'my-effect', init);
// observeCanvas automatically handles reduced motion:
// 1. Calls initFn() to set up the canvas
// 2. Calls a.update(0.016, performance.now()) for one frame
// 3. Does NOT call activateAnimation — the loop never starts
```
