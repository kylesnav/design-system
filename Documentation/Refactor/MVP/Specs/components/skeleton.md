---
title: "Skeleton"
date: 2026-03-02
type: spec
scope: mvp
status: active
---

# Skeleton

> Loading placeholder components that communicate content shape while data loads. Two animation modes: shimmer (gradient sweep, direction right-to-left via `playful-shimmer`) and pulse (scale + opacity oscillation via `playful-pulse`). Five size/shape variants: text line, heading, avatar small, avatar large, and card container. JavaScript toggles between shimmer and pulse modes at runtime by swapping `.skel-shimmer` / `.skel-pulse` class. A "load content" pattern fades out skeletons and animates real content in with per-card stagger (120ms between cards).

Cross-references: [[motion]] (`playful-shimmer` and `playful-pulse` keyframes, `--ease-bounce` for pulse easing), [[card]] (`.skel-card` mirrors card shape with `border-radius: var(--radius-lg)`), [[staggered-reveal]] (the skeleton→content swap uses the same stagger pattern).

Visual reference: Section "09 — Loading & Transitions", subsection "Skeleton Loading" in `design-reference.html` (lines ~6487–6521, CSS at lines ~3486–3594).

---

## 1. HTML Structure

### 1.1 Shimmer Skeleton Card (base pattern)

```html
<div class="card" id="skel-card-1">
  <div class="skel skel-shimmer skel-heading" style="margin-bottom:var(--space-3)"></div>
  <div class="skel skel-shimmer skel-text" style="margin-bottom:var(--space-2)"></div>
  <div class="skel skel-shimmer skel-text" style="width:75%"></div>
</div>
```

### 1.2 Pulse Skeleton Card

```html
<div class="card" id="skel-card-1">
  <div class="skel skel-pulse skel-heading" style="margin-bottom:var(--space-3)"></div>
  <div class="skel skel-pulse skel-text" style="margin-bottom:var(--space-2)"></div>
  <div class="skel skel-pulse skel-text" style="width:75%"></div>
</div>
```

### 1.3 Avatar + Text Row Skeleton

```html
<div style="display:flex;align-items:center;gap:var(--space-3)">
  <div class="skel skel-shimmer skel-avatar-sm"></div>
  <div style="flex:1;display:flex;flex-direction:column;gap:var(--space-2)">
    <div class="skel skel-shimmer skel-heading"></div>
    <div class="skel skel-shimmer skel-text"></div>
  </div>
</div>
```

### 1.4 Standalone Card Shape Skeleton

```html
<div class="skel-card">
  <div class="skel skel-shimmer skel-circle"></div>
  <div class="skel skel-shimmer skel-heading"></div>
  <div class="skel skel-shimmer skel-text"></div>
  <div class="skel skel-shimmer skel-text"></div>
</div>
```

### 1.5 Demo Grid (3-card shimmer grid)

```html
<div class="grid-3" id="skel-grid">
  <div class="card" id="skel-card-1">
    <div class="skel skel-shimmer skel-heading" style="margin-bottom:var(--space-3)"></div>
    <div class="skel skel-shimmer skel-text" style="margin-bottom:var(--space-2)"></div>
    <div class="skel skel-shimmer skel-text" style="width:75%"></div>
  </div>
  <div class="card" id="skel-card-2">
    <div class="skel skel-shimmer skel-heading" style="margin-bottom:var(--space-3)"></div>
    <div class="skel skel-shimmer skel-text" style="margin-bottom:var(--space-2)"></div>
    <div class="skel skel-shimmer skel-text" style="width:85%"></div>
  </div>
  <div class="card" id="skel-card-3">
    <div class="skel skel-shimmer skel-heading" style="margin-bottom:var(--space-3)"></div>
    <div class="skel skel-shimmer skel-text" style="margin-bottom:var(--space-2)"></div>
    <div class="skel skel-shimmer skel-text" style="width:65%"></div>
  </div>
</div>
```

---

## 2. CSS Classes

### 2.1 `.skel` (base)

| Property | Value | Token |
|---|---|---|
| `background` | `var(--bg-muted)` | Muted surface color |
| `border-radius` | `var(--radius-sm)` | `10px` |

This is the base class applied to every skeleton element. It sets the fill color. No animation by itself.

### 2.2 `.skel-shimmer` (animation mode 1)

| Property | Value | Notes |
|---|---|---|
| `background` | `linear-gradient(110deg, var(--bg-muted) 30%, var(--bg-subtle) 50%, var(--bg-muted) 70%)` | Two-stop gradient for the sweep |
| `background-size` | `200% 100%` | Oversized for sweep animation |
| `animation` (when `prefers-reduced-motion: no-preference`) | `playful-shimmer 2s linear infinite` | Defined below |

**`@keyframes playful-shimmer`:**

```css
@keyframes playful-shimmer {
  0%   { background-position: 200% 0; }
  100% { background-position: -200% 0; }
}
```

Direction: starts right (200%) and sweeps to left (-200%), creating a right-to-left shimmer. Duration: `2s`. Easing: `linear`. Iteration: `infinite`.

### 2.3 `.skel-pulse` (animation mode 2)

No background override — uses `.skel` base color (`var(--bg-muted)`).

| Property | Value |
|---|---|
| `animation` (when `prefers-reduced-motion: no-preference`) | `playful-pulse 1.6s var(--ease-bounce) infinite` |
| `transform-origin` | `center left` |

**`@keyframes playful-pulse`:**

```css
@keyframes playful-pulse {
  0%, 100% { transform: scale(1);    opacity: 1;   }
  50%       { transform: scale(0.98); opacity: 0.6; }
}
```

Scale range: `1` → `0.98`. Opacity range: `1` → `0.6`. Easing: `var(--ease-bounce)` = `cubic-bezier(0.34, 1.56, 0.64, 1)`. Duration: `1.6s`.

### 2.4 Size/Shape Variant Classes

| Class | Description | Key CSS |
|---|---|---|
| `.skel-text` | Single text line placeholder | `height: 1em; border-radius: var(--radius-sm)` |
| `.skel-text:nth-child(odd)` | Full-width text line | `width: 100%` |
| `.skel-text:nth-child(even)` | 75%-width text line (shorter last line illusion) | `width: 75%` |
| `.skel-heading` | Heading placeholder | `height: 1.5em; width: 60%; border-radius: var(--radius-sm)` |
| `.skel-circle` | Circular avatar or icon placeholder | `border-radius: 50%; width: 40px; height: 40px` |
| `.skel-avatar-sm` | Small circular avatar | `border-radius: 50%; width: var(--control-sm); height: var(--control-sm)` = `32px` |
| `.skel-avatar-lg` | Large circular avatar | `border-radius: 50%; width: var(--control-xl); height: var(--control-xl)` = `56px` |
| `.skel-card` | Card container shape | `border: 2px solid var(--border-subtle); border-radius: var(--radius-lg); padding: var(--space-4); display: flex; flex-direction: column; gap: var(--space-3)` |

---

## 3. States

| State | Behavior |
|---|---|
| **Shimmer mode** | `.skel-shimmer` class applied; gradient sweeps right-to-left at 2s linear |
| **Pulse mode** | `.skel-pulse` class applied; scale+opacity oscillates at 1.6s |
| **Reduced motion** | All animations are disabled via global `animation-duration: 0.01ms !important` — skeletons appear as static fills |
| **Loading → content** | JS fades out skeleton cards, then fades real content in with per-card stagger |

---

## 4. JavaScript Behavior

### 4.1 Mode Toggle

```js
let skelMode = 'shimmer'; // or 'pulse'

document.getElementById('skel-toggle').addEventListener('click', () => {
  skelMode = skelMode === 'shimmer' ? 'pulse' : 'shimmer';
  document.querySelectorAll('.skel').forEach(s => {
    s.className = skelMode === 'shimmer' ? 'skel skel-shimmer' : 'skel skel-pulse';
  });
});
```

Toggle swaps ALL `.skel` elements between `skel-shimmer` and `skel-pulse`. The shape variant class (`.skel-heading`, `.skel-text`, etc.) is NOT preserved — only the base `skel` class and the animation mode class are set. Shape classes must be re-applied inline or the toggle must be implemented to preserve them.

**Important note**: The reference toggle naively replaces the full `className`. In production, preserve shape classes: iterate `.skel` elements, remove old animation class, add new one without wiping shape variant classes.

### 4.2 Skeleton → Content Transition

```js
const cards = [
  { title: 'Design Tokens', desc: 'Centralized design decisions as data' },
  { title: 'Component Library', desc: 'Production-ready building blocks' },
  { title: 'Animation System', desc: 'Spring-based motion patterns' }
];

// Phase 1: fade out skeleton cards
const cardEls = [1, 2, 3].map(i => document.getElementById(`skel-card-${i}`));
cardEls.forEach(card => {
  card.style.transition = 'opacity var(--motion-fast) var(--ease-out)';
  card.style.opacity = '0';
});

// Phase 2: swap content + staggered fade-in (after fade-out)
setTimeout(() => {
  cards.forEach((c, i) => {
    const card = cardEls[i];
    setTimeout(() => {
      card.innerHTML = `
        <div class="card-title">${c.title}</div>
        <div class="card-desc" style="color:var(--text-secondary);font-size:0.875rem;margin-top:var(--space-2)">
          ${c.desc}
        </div>`;
      card.style.transition = 'none';
      card.style.opacity = '0';
      card.style.transform = 'translateY(12px)';
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          card.style.transition =
            `opacity var(--motion-base) var(--ease-out), transform var(--motion-base) var(--ease-smooth)`;
          card.style.opacity = '1';
          card.style.transform = 'translateY(0)';
        });
      });
    }, i * 120); // 120ms stagger between cards
  });
}, 200); // wait for fade-out to complete
```

Key timings:
- Fade-out duration: `var(--motion-fast)` = `160ms`
- Delay before content swap: `200ms`
- Content fade-in: `var(--motion-base)` = `240ms`
- Per-card stagger: `120ms`
- Content enters from `translateY(12px)` → `translateY(0)`

---

## 5. Responsive Behavior

Skeleton elements are inline-flow elements placed inside standard grid/flex containers (e.g., `.grid-3`). Responsive behavior inherits from the container grid — no skeleton-specific breakpoint rules.

---

## 6. Accessibility

- Skeleton containers should have `aria-busy="true"` on the parent region and `aria-label="Loading..."` or use a live region to announce when content is ready.
- Individual skeleton `<div>` elements should have `aria-hidden="true"` so screen readers skip the placeholder shapes.
- When content loads, remove `aria-busy` and optionally announce content arrival via `aria-live="polite"`.
- Under `prefers-reduced-motion: reduce`, animations are suppressed — skeletons remain as static fills. This is acceptable behavior.

---

## 7. Token Dependencies

### Tier 2 (Semantic)

- `--bg-muted` (skeleton fill color)
- `--bg-subtle` (shimmer highlight color)
- `--border-subtle` (`.skel-card` border)

### Tier 3 (Component)

- `--radius-sm` (`10px`) — default skeleton border-radius
- `--radius-lg` (`24px`) — `.skel-card` border-radius
- `--space-3` (`12px`) — `.skel-card` gap
- `--space-4` (`16px`) — `.skel-card` padding
- `--control-sm` (`32px`) — `.skel-avatar-sm` size
- `--control-xl` (`56px`) — `.skel-avatar-lg` size
- `--ease-bounce` — `.skel-pulse` animation easing
- `--motion-fast` (`160ms`) — skeleton fade-out (JS)
- `--motion-base` (`240ms`) — content fade-in (JS)
- `--ease-out`, `--ease-smooth` — content entrance easing (JS)

---

## 8. Test Specification

### 8.1 Computed Style Assertions

- `.skel` has `background` matching `--bg-muted` resolved value
- `.skel` has `border-radius` resolving to `10px`
- `.skel-shimmer` has `background` that is a gradient containing `--bg-muted` and `--bg-subtle`
- `.skel-shimmer` has `background-size: 200% 100%`
- `.skel-heading` has `height` of `1.5em` relative to context and `width: 60%`
- `.skel-text:nth-child(odd)` has `width: 100%`
- `.skel-text:nth-child(even)` has `width: 75%`
- `.skel-circle` has `border-radius: 50%` and `width: 40px; height: 40px`
- `.skel-avatar-sm` has `width: 32px; height: 32px`
- `.skel-avatar-lg` has `width: 56px; height: 56px`
- `.skel-card` has `border: 2px solid` and `border-radius` resolving to `24px`

### 8.2 Animation Assertions (when `prefers-reduced-motion: no-preference`)

- `.skel-shimmer` has `animation-name: playful-shimmer` and `animation-duration: 2s`
- `.skel-pulse` has `animation-name: playful-pulse` and `animation-duration: 1.6s`
- `@keyframes playful-shimmer` 0% has `background-position: 200% 0`
- `@keyframes playful-shimmer` 100% has `background-position: -200% 0`
- `@keyframes playful-pulse` 50% has `transform: scale(0.98)` and `opacity: 0.6`

### 8.3 Reduced Motion Compliance

- With `prefers-reduced-motion: reduce`, `.skel-shimmer` and `.skel-pulse` have no visible animation

### 8.4 Visual Regression Scenarios

- Shimmer mode: 3 skeleton cards in a grid (light mode)
- Pulse mode: 3 skeleton cards in a grid (light mode)
- Avatar + text row skeleton
- Standalone `.skel-card`
- Skeleton→content transition (capture start, mid, and end frames)
- Dark mode: both shimmer and pulse

---

## 9. Implementation CSS

```css
/* Base skeleton fill */
@layer component {
  .skel {
    background: var(--bg-muted);
    border-radius: var(--radius-sm);
  }

  /* Shimmer gradient (static) */
  .skel-shimmer {
    background: linear-gradient(
      110deg,
      var(--bg-muted) 30%,
      var(--bg-subtle) 50%,
      var(--bg-muted) 70%
    );
    background-size: 200% 100%;
  }

  /* Size/shape variants */
  .skel-circle {
    border-radius: 50%;
    width: 40px;
    height: 40px;
  }

  .skel-text {
    height: 1em;
    border-radius: var(--radius-sm);
  }
  .skel-text:nth-child(odd)  { width: 100%; }
  .skel-text:nth-child(even) { width: 75%; }

  .skel-heading {
    height: 1.5em;
    width: 60%;
    border-radius: var(--radius-sm);
  }

  .skel-card {
    border: 2px solid var(--border-subtle);
    border-radius: var(--radius-lg);
    padding: var(--space-4);
    display: flex;
    flex-direction: column;
    gap: var(--space-3);
  }

  .skel-avatar-sm {
    border-radius: 50%;
    width: var(--control-sm);
    height: var(--control-sm);
  }
  .skel-avatar-lg {
    border-radius: 50%;
    width: var(--control-xl);
    height: var(--control-xl);
  }
}

/* Animations — only when motion is allowed */
@layer component {
  @media (prefers-reduced-motion: no-preference) {
    @keyframes playful-shimmer {
      0%   { background-position: 200% 0; }
      100% { background-position: -200% 0; }
    }

    @keyframes playful-pulse {
      0%, 100% { transform: scale(1);    opacity: 1;   }
      50%       { transform: scale(0.98); opacity: 0.6; }
    }

    .skel-shimmer {
      animation: playful-shimmer 2s linear infinite;
    }

    .skel-pulse {
      animation: playful-pulse 1.6s var(--ease-bounce) infinite;
      transform-origin: center left;
    }
  }
}
```
