# Staggered Reveal

> Spring-physics entrance animation where child elements animate in sequentially with configurable delay, duration, and easing. Three spring presets are defined in the reference: Snappy (30ms delay, 200ms duration, bouncy easing), Standard (50ms delay, 300ms duration, smooth easing), and Gentle (80ms delay, 400ms duration, soft easing). Each element transitions from `opacity: 0; translateY(16px) scale(0.95)` to `opacity: 1; translateY(0) scale(1)`. Triggered by JavaScript on page load and via a replay button.

Cross-references: [[motion]] (easing curves matching `--ease-bounce`, `--ease-smooth`, `--ease-out`), [[card]] (staggered items are `.card.card-compact.card-interactive`), [[token-tiers]] (spacing tokens).

Visual reference: Section "09 -- Loading & Transitions", subsection "Staggered Entry" in `design-reference.html` (lines ~6567-6626 HTML, JS at lines ~7953-7979).

---

## 1. HTML Structure

### 1.1 Three Spring Presets Side-by-Side

```html
<div class="grid-3" style="margin-top:var(--space-4)">
  <!-- Snappy -->
  <div>
    <div class="state-label" style="margin-bottom:var(--space-3)">Snappy (500/30) · 30ms delay</div>
    <div id="stagger-snappy" style="display:flex;flex-direction:column;gap:var(--space-2)">
      <div class="card card-compact card-interactive stagger-snappy">
        <div class="card-title">Analytics</div>
      </div>
      <div class="card card-compact card-interactive stagger-snappy">
        <div class="card-title">Reports</div>
      </div>
      <div class="card card-compact card-interactive stagger-snappy">
        <div class="card-title">Settings</div>
      </div>
      <div class="card card-compact card-interactive stagger-snappy">
        <div class="card-title">Profile</div>
      </div>
    </div>
  </div>

  <!-- Standard -->
  <div>
    <div class="state-label" style="margin-bottom:var(--space-3)">Standard (400/35) · 50ms delay</div>
    <div id="stagger-standard" style="display:flex;flex-direction:column;gap:var(--space-2)">
      <div class="card card-compact card-interactive stagger-standard">
        <div class="card-title">Analytics</div>
      </div>
      <div class="card card-compact card-interactive stagger-standard">
        <div class="card-title">Reports</div>
      </div>
      <div class="card card-compact card-interactive stagger-standard">
        <div class="card-title">Settings</div>
      </div>
      <div class="card card-compact card-interactive stagger-standard">
        <div class="card-title">Profile</div>
      </div>
    </div>
  </div>

  <!-- Gentle -->
  <div>
    <div class="state-label" style="margin-bottom:var(--space-3)">Gentle (300/28) · 80ms delay</div>
    <div id="stagger-gentle" style="display:flex;flex-direction:column;gap:var(--space-2)">
      <div class="card card-compact card-interactive stagger-gentle">
        <div class="card-title">Analytics</div>
      </div>
      <div class="card card-compact card-interactive stagger-gentle">
        <div class="card-title">Reports</div>
      </div>
      <div class="card card-compact card-interactive stagger-gentle">
        <div class="card-title">Settings</div>
      </div>
      <div class="card card-compact card-interactive stagger-gentle">
        <div class="card-title">Profile</div>
      </div>
    </div>
  </div>
</div>

<button class="btn btn-secondary btn-sm" style="margin-top:var(--space-4)" id="stagger-replay">
  Replay All Springs
</button>
```

### 1.2 Minimal Pattern

```html
<div id="stagger-container">
  <div class="stagger-item">Item 1</div>
  <div class="stagger-item">Item 2</div>
  <div class="stagger-item">Item 3</div>
</div>
```

---

## 2. CSS Classes

The staggered reveal uses no dedicated CSS classes for the animation itself. The CSS classes `.stagger-snappy`, `.stagger-standard`, and `.stagger-gentle` are used as selector hooks for JavaScript -- they have no CSS rules defined in the stylesheet.

The items use existing card classes:

| Class | Purpose |
|---|---|
| `.card` | Base card styling |
| `.card-compact` | Compact padding variant |
| `.card-interactive` | Hover effects (lift/press) |
| `.stagger-snappy` / `.stagger-standard` / `.stagger-gentle` | JS selector hooks (no CSS rules) |

All animation is applied via inline `style` attributes by JavaScript.

---

## 3. Animation Values

### 3.1 Initial State (before animation)

Applied by JS before each reveal:

| Property | Value |
|---|---|
| `opacity` | `0` |
| `transform` | `translateY(16px) scale(0.95)` |
| `transition` | `none` (to prevent premature animation) |

### 3.2 Final State (after animation)

| Property | Value |
|---|---|
| `opacity` | `1` |
| `transform` | `translateY(0) scale(1)` |

### 3.3 Spring Presets

| Preset | Class Selector | Delay Between Items | Duration | Easing | Spring Character |
|---|---|---|---|---|---|
| **Snappy** | `.stagger-snappy` | `30ms` | `200ms` | `cubic-bezier(0.34,1.56,0.64,1)` | High stiffness (500/30), noticeable overshoot |
| **Standard** | `.stagger-standard` | `50ms` | `300ms` | `cubic-bezier(0.22,1,0.36,1)` | Moderate stiffness (400/35), smooth deceleration |
| **Gentle** | `.stagger-gentle` | `80ms` | `400ms` | `cubic-bezier(0.16,1,0.3,1)` | Low stiffness (300/28), soft and gradual |

Easing token equivalents:
- Snappy easing matches `--ease-bounce`
- Standard easing matches `--ease-smooth`
- Gentle easing matches `--ease-out`

### 3.4 Timing Calculation

For N items with delay D and duration T:
- Item 0 starts at: `0ms`
- Item 1 starts at: `D ms`
- Item i starts at: `i * D ms`
- Total sequence duration: `(N-1) * D + T ms`
- Cleanup runs at: `N * D + T + 50ms`

For 4 items with Snappy preset:
- Total: `3 * 30 + 200 = 290ms`
- Cleanup: `4 * 30 + 200 + 50 = 370ms`

---

## 4. JavaScript Behavior

### 4.1 Core `staggerRevealGroup` Function

```js
function staggerRevealGroup(selector, delay, easing, duration) {
  const items = document.querySelectorAll(selector);

  // Phase 1: Reset all items to hidden state (no transition)
  items.forEach(item => {
    item.style.transition = 'none';
    item.style.opacity = '0';
    item.style.transform = 'translateY(16px) scale(0.95)';
  });

  // Phase 2: Animate in with stagger
  requestAnimationFrame(() => {
    items.forEach((item, i) => {
      setTimeout(() => {
        item.style.transition = `opacity ${duration}ms ease-out, transform ${duration}ms ${easing}`;
        item.style.opacity = '1';
        item.style.transform = 'translateY(0) scale(1)';
      }, i * delay);
    });

    // Phase 3: Cleanup inline styles
    setTimeout(() => {
      items.forEach(item => {
        item.style.transition = '';
        item.style.transform = '';
        item.style.opacity = '';
      });
    }, items.length * delay + duration + 50);
  });
}
```

Function signature:

| Parameter | Type | Description |
|---|---|---|
| `selector` | `string` | CSS selector for items to animate (e.g., `.stagger-snappy`) |
| `delay` | `number` | Milliseconds between each item's animation start |
| `easing` | `string` | CSS easing function for `transform` transition |
| `duration` | `number` | Milliseconds for each item's animation duration |

Note: The `opacity` transition always uses `ease-out` (not the spring easing), while `transform` uses the specified spring easing. This creates a visual effect where opacity fades in smoothly while position/scale bounces.

### 4.2 `staggerRevealAll` Orchestrator

```js
function staggerRevealAll() {
  staggerRevealGroup('.stagger-snappy', 30, 'cubic-bezier(0.34,1.56,0.64,1)', 200);
  staggerRevealGroup('.stagger-standard', 50, 'cubic-bezier(0.22,1,0.36,1)', 300);
  staggerRevealGroup('.stagger-gentle', 80, 'cubic-bezier(0.16,1,0.3,1)', 400);
}
```

All three groups animate simultaneously (not sequentially). Each group has its own internal stagger delay.

### 4.3 Trigger Mechanisms

**On page load:**

```js
staggerRevealAll();
```

Called immediately during script execution.

**Replay button:**

```js
document.getElementById('stagger-replay').addEventListener('click', staggerRevealAll);
```

### 4.4 Animation Lifecycle

1. **Reset**: All items set to `opacity: 0; transform: translateY(16px) scale(0.95)` with `transition: none`
2. **Frame boundary**: `requestAnimationFrame` ensures the reset state is painted before transitions begin
3. **Stagger**: Each item gets a `setTimeout` at `i * delay` ms, which applies the final state with a transition
4. **Cleanup**: After all animations complete (`N * delay + duration + 50ms`), all inline styles are removed, returning items to their CSS-defined state

---

## 5. CSS-Only Alternative: `.anim-in` + `.anim-d*` Delay Classes

The reference also provides a CSS-only stagger pattern using the `.anim-in` class with `.anim-d1` through `.anim-d12` delay modifiers. This is used in the hero section, not in the stagger demo, but is a related pattern.

### CSS Classes

```css
.anim-in {
  animation: fadeInUp 0.5s var(--ease-smooth) both;
}

.anim-d1 { animation-delay: 0.06s; }
.anim-d2 { animation-delay: 0.12s; }
.anim-d3 { animation-delay: 0.18s; }
.anim-d4 { animation-delay: 0.24s; }
.anim-d5 { animation-delay: 0.30s; }
.anim-d6 { animation-delay: 0.36s; }
.anim-d7 { animation-delay: 0.42s; }
.anim-d8 { animation-delay: 0.48s; }
.anim-d9 { animation-delay: 0.54s; }
.anim-d10 { animation-delay: 0.60s; }
.anim-d11 { animation-delay: 0.66s; }
.anim-d12 { animation-delay: 0.72s; }
```

### `fadeInUp` Keyframes

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

### Delay Increment Pattern

Each step adds `0.06s` (60ms). The CSS-only approach uses a fixed 60ms stagger with `--ease-smooth` easing and 500ms duration -- it does not support multiple spring presets.

### Usage (Hero section)

```html
<p class="hero-subtitle anim-in anim-d4">Bold warmth...</p>
<a href="#philosophy" class="tile tile-pink anim-in anim-d1">...</a>
<a href="#color" class="tile tile-gold anim-in anim-d2">...</a>
```

---

## 6. Accessibility

### 6.1 `prefers-reduced-motion: reduce`

The global reduced-motion rule suppresses all animations:

```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}
```

For the JS-driven stagger: the JavaScript does not check `prefersReduced` for the stagger reveal specifically. However, the CSS `transition-duration: 0.01ms !important` override means the transitions applied by JS will complete instantly, so elements appear without visible animation.

For the CSS-only `.anim-in` pattern: the `animation-duration: 0.01ms !important` override makes the `fadeInUp` animation instant. Elements appear in their final state immediately.

### 6.2 Content Visibility

- No content is hidden permanently. All items reach their final visible state.
- During the animation sequence, items are temporarily at `opacity: 0` -- screen readers still announce them.
- The cleanup phase removes all inline styles, so items return to their CSS-defined state.

---

## 7. Token Dependencies

### Tier 3 (Component)

- `--space-2` (`8px`) -- gap between stagger items
- `--space-3` (`12px`) -- state label margin-bottom
- `--space-4` (`16px`) -- grid margin-top, replay button margin-top
- `--ease-bounce` / `cubic-bezier(0.34,1.56,0.64,1)` -- Snappy spring easing
- `--ease-smooth` / `cubic-bezier(0.22,1,0.36,1)` -- Standard spring easing
- `--ease-out` / `cubic-bezier(0.16,1,0.3,1)` -- Gentle spring easing

### CSS-Only Pattern Tokens

- `--ease-smooth` -- `.anim-in` animation easing
- `fadeInUp` keyframe -- shared with `.scroll-reveal`

### Hardcoded Values

- `16px` -- translateY offset (not tokenized)
- `0.95` -- initial scale (not tokenized)
- `30ms`, `50ms`, `80ms` -- stagger delays (not tokenized)
- `200ms`, `300ms`, `400ms` -- animation durations (not tokenized)
- `0.06s` (60ms) -- CSS delay class increment (not tokenized)
- `0.5s` (500ms) -- `.anim-in` animation duration (not tokenized)

---

## 8. Test Specification

### 8.1 Computed Style Assertions

- Items before animation have `opacity: 0` and `transform` containing `translateY(16px) scale(0.95)`
- Items after animation have `opacity: 1` and no transform override
- Cleanup removes all inline `style` attributes for `transition`, `transform`, and `opacity`

### 8.2 Interaction Assertions

- On page load, all three groups animate simultaneously
- Within each group, items animate in sequence with the specified delay
- Snappy group: 30ms between items, total sequence ~290ms for 4 items
- Standard group: 50ms between items, total sequence ~450ms for 4 items
- Gentle group: 80ms between items, total sequence ~640ms for 4 items
- Clicking "Replay All Springs" re-triggers all three groups

### 8.3 Visual Regression Scenarios

- All three groups at rest (animation complete, light mode)
- All three groups at rest (dark mode)
- Mid-animation frame capture (items at various stages of reveal)
- CSS-only `.anim-in` pattern with delay classes in hero section

### 8.4 Reduced Motion Compliance

- With `prefers-reduced-motion: reduce`, transitions complete in `0.01ms`
- Items appear instantly without visible animation
- The replay button still functions but animation is imperceptible

---

## 9. Implementation JavaScript

```js
function staggerRevealGroup(selector, delay, easing, duration) {
  const items = document.querySelectorAll(selector);
  items.forEach(item => {
    item.style.transition = 'none';
    item.style.opacity = '0';
    item.style.transform = 'translateY(16px) scale(0.95)';
  });
  requestAnimationFrame(() => {
    items.forEach((item, i) => {
      setTimeout(() => {
        item.style.transition = `opacity ${duration}ms ease-out, transform ${duration}ms ${easing}`;
        item.style.opacity = '1';
        item.style.transform = 'translateY(0) scale(1)';
      }, i * delay);
    });
    setTimeout(() => {
      items.forEach(item => {
        item.style.transition = '';
        item.style.transform = '';
        item.style.opacity = '';
      });
    }, items.length * delay + duration + 50);
  });
}

function staggerRevealAll() {
  staggerRevealGroup('.stagger-snappy', 30, 'cubic-bezier(0.34,1.56,0.64,1)', 200);
  staggerRevealGroup('.stagger-standard', 50, 'cubic-bezier(0.22,1,0.36,1)', 300);
  staggerRevealGroup('.stagger-gentle', 80, 'cubic-bezier(0.16,1,0.3,1)', 400);
}

// Trigger on load
staggerRevealAll();

// Replay button
document.getElementById('stagger-replay').addEventListener('click', staggerRevealAll);
```
