# Spotlight

> Signature interaction where a cursor-tracked radial gradient in the card's accent color creates a "spotlight" glow on the card surface. A solid-color box shadow simultaneously shifts in the direction opposite the cursor, simulating a physical light source moving with the mouse. No spring physics — all updates are instant on `mousemove`. Requires JavaScript. No `prefers-reduced-motion` guard in JS (cursor tracking is not animation; see §6).

Source: `delightful-animation.html` — Section "05 Interactions / Spotlight Card". This component does not appear in `design-reference.html`.

Cross-references: [[magnetic-button]] (same event listener pattern, same file's interaction section), [[tilt-card]] (same section, different technique — no spring physics here).

Visual reference: Section "05 — Interactions", card "spotlight-card" in `delightful-animation.html` (CSS lines 849–858, HTML lines 1688–1702, JS lines 3903–3932).

---

## 1. HTML Structure

```html
<div
  class="spotlight-wrap"
  data-accent="pink"
  data-accent-r="200"
  data-accent-g="80"
  data-accent-b="180"
>
  <div class="spotlight-overlay"></div>
  Hover
</div>
```

Additional demo instance (cyan variant):

```html
<div
  class="spotlight-wrap"
  data-accent="cyan"
  data-accent-r="100"
  data-accent-g="160"
  data-accent-b="220"
>
  <div class="spotlight-overlay"></div>
  Glow
</div>
```

Wrapper context in reference:

```html
<div class="demo-card-stage" style="display:flex; gap:var(--space-4); flex-wrap:wrap; justify-content:center; padding:var(--space-6)">
  <div class="spotlight-wrap" data-accent="pink" data-accent-r="200" data-accent-g="80" data-accent-b="180">
    <div class="spotlight-overlay"></div>Hover
  </div>
  <div class="spotlight-wrap" data-accent="cyan" data-accent-r="100" data-accent-g="160" data-accent-b="220">
    <div class="spotlight-overlay"></div>Glow
  </div>
</div>
```

Key structural points:

- `.spotlight-overlay` must be the **first child** of `.spotlight-wrap` so it renders beneath text content without requiring `z-index` on siblings.
- The accent RGB values are separate `data-accent-r`, `data-accent-g`, `data-accent-b` attributes — not derived from CSS custom properties at runtime. JavaScript reads them directly via `dataset`.
- `data-accent` drives the CSS color theming (background, border, text via the `[data-accent]` attribute selectors). It does not affect the spotlight gradient color — that comes from the `data-accent-r/g/b` attributes.
- Text content ("Hover", "Glow") sits directly inside `.spotlight-wrap` after the overlay element.

---

## 2. CSS Classes

### 2.1 `.spotlight-wrap` (card wrapper)

| Property | Value | Token / Notes |
|---|---|---|
| `width` | `160px` | Hardcoded in demo |
| `height` | `120px` | Hardcoded in demo |
| `position` | `relative` | Required for `.spotlight-overlay` absolute positioning |
| `border` | `2px solid` | Color comes from `[data-accent]` theming |
| `border-radius` | `var(--radius-md)` | Component radius token |
| `box-shadow` | `var(--shadow-md)` | Default; overridden inline by JS on `mousemove` |
| `display` | `flex` | -- |
| `align-items` | `center` | Centers text content |
| `justify-content` | `center` | Centers text content |
| `font-weight` | `800` | Bold label |
| `overflow` | `hidden` | Clips the radial gradient overlay at card edges |
| `cursor` | `default` | No pointer cursor — this is a display card, not a button |

### 2.2 `.spotlight-overlay` (gradient layer)

| Property | Value | Notes |
|---|---|---|
| `position` | `absolute` | Fills the card |
| `inset` | `0` | Covers all four edges |
| `pointer-events` | `none` | Passes all mouse events through to `.spotlight-wrap` |
| `border-radius` | `inherit` | Matches parent's `var(--radius-md)` to clip gradient at corners |
| `background` | `''` (empty string, default state) | Set to `radial-gradient(…)` by JS on `mousemove`; cleared on `mouseleave` |

### 2.3 `[data-accent]` color theming

The `data-accent` attribute on `.spotlight-wrap` is used by pre-existing CSS attribute selectors in the file:

```css
[data-accent="pink"]   { background: var(--accent-primary-subtle); border-color: var(--accent-primary); color: var(--accent-primary-text); }
[data-accent="gold"]   { background: var(--accent-gold-subtle);    border-color: var(--accent-gold);    color: var(--accent-gold-text); }
[data-accent="cyan"]   { background: var(--accent-cyan-subtle);    border-color: var(--accent-cyan);    color: var(--accent-cyan-text); }
[data-accent="green"]  { background: var(--accent-green-subtle);   border-color: var(--accent-green);   color: var(--accent-green-text); }
[data-accent="purple"] { background: var(--accent-purple-subtle);  border-color: var(--accent-purple);  color: var(--accent-purple-text); }
[data-accent="danger"] { background: var(--accent-danger-subtle);  border-color: var(--accent-danger);  color: var(--accent-danger-text); }
```

These set the card's resting background, border color, and text color. The spotlight gradient color is **separate** and defined by `data-accent-r/g/b` as raw integer RGB channel values.

---

## 3. States

| State | `.spotlight-overlay` background | `.spotlight-wrap` box-shadow |
|---|---|---|
| **Default (no hover)** | `''` (empty — no visible gradient) | `var(--shadow-md)` (CSS default) |
| **Cursor over card** | `radial-gradient(circle 120px at Xpx Ypx, rgba(R,G,B,0.25), transparent)` | `${sx}px ${sy}px 0 var(--border-default)` |
| **Mouse leave** | `''` (cleared) | `''` (cleared — reverts to CSS `var(--shadow-md)`) |

The shadow direction is the **inverse** of cursor position relative to card center, simulating a light source above and behind the cursor.

---

## 4. JavaScript Implementation

### 4.1 Element Selection

```js
const cards = document.querySelectorAll('.spotlight-wrap');
```

All `.spotlight-wrap` elements on the page are queried and iterated. Each card is independently initialized — no shared state between cards.

### 4.2 Accent Color Extraction

```js
const r = parseInt(card.dataset.accentR || '200');
const g = parseInt(card.dataset.accentG || '100');
const b = parseInt(card.dataset.accentB || '200');
```

| Attribute | `dataset` key | Default fallback |
|---|---|---|
| `data-accent-r` | `card.dataset.accentR` | `200` |
| `data-accent-g` | `card.dataset.accentG` | `100` |
| `data-accent-b` | `card.dataset.accentB` | `200` |

Values are parsed as integers via `parseInt`. They are used directly in the `rgba()` call in the gradient.

### 4.3 `mousemove` Handler

```js
card.addEventListener('mousemove', (e) => {
  const rect = card.getBoundingClientRect();
  // Absolute cursor position in pixels within the card
  const x = e.clientX - rect.left;
  const y = e.clientY - rect.top;
  // Normalized cursor position relative to card center: [-0.5, 0.5]
  const nx = (x / rect.width - 0.5);
  const ny = (y / rect.height - 0.5);
  // Spotlight: radial gradient centered at absolute cursor position
  overlay.style.background = `radial-gradient(circle 120px at ${x}px ${y}px, rgba(${r},${g},${b},0.25), transparent)`;
  // Shadow: offset opposite cursor direction, simulating light source behind cursor
  const sx = -nx * 4;
  const sy = ny * 4;
  card.style.boxShadow = `${sx}px ${sy}px 0 var(--border-default)`;
});
```

### 4.4 Spotlight Gradient Formula

```
radial-gradient(circle 120px at Xpx Ypx, rgba(R, G, B, 0.25), transparent)
```

| Parameter | Value | Notes |
|---|---|---|
| Shape | `circle` | Circular gradient |
| Radius | `120px` | Fixed spotlight circle size |
| Position | `${x}px ${y}px` | Absolute pixel position within card (not percentage) |
| Color stop 1 | `rgba(R,G,B,0.25)` | 25% opacity accent color at cursor |
| Color stop 2 | `transparent` | Fades to fully transparent (implicit position — browser distributes) |

The gradient position uses **absolute pixels** (`x` and `y` computed from `e.clientX - rect.left`), not percentage values or CSS custom properties.

### 4.5 Shadow Direction Formula

```js
const nx = (x / rect.width - 0.5);   // [-0.5, 0.5], left = negative, right = positive
const ny = (y / rect.height - 0.5);  // [-0.5, 0.5], top = negative, bottom = positive

const sx = -nx * 4;  // Shadow X: opposite to cursor horizontal offset
const sy = ny * 4;   // Shadow Y: same direction as cursor vertical offset
card.style.boxShadow = `${sx}px ${sy}px 0 var(--border-default)`;
```

| Cursor position | `nx` | `ny` | `sx` | `sy` | Shadow direction |
|---|---|---|---|---|---|
| Center | `0` | `0` | `0` | `0` | No offset |
| Far right | `+0.5` | `0` | `-2` | `0` | Left (light from right) |
| Far left | `-0.5` | `0` | `+2` | `0` | Right (light from left) |
| Bottom | `0` | `+0.5` | `0` | `+2` | Down (note: same direction as cursor) |
| Top-right | `+0.5` | `-0.5` | `-2` | `-2` | Up-left |

Shadow maximum offset: `±2px` (`0.5 * 4 = 2`).
Shadow blur: `0` — hard edge, no blur.
Shadow color: `var(--border-default)` — not the accent color.

### 4.6 `mouseleave` Handler

```js
card.addEventListener('mouseleave', () => {
  overlay.style.background = '';
  card.style.boxShadow = '';
});
```

Both properties are reset to empty strings, which causes the browser to revert to the CSS-declared values:
- `overlay.background` returns to `''` (no visible gradient)
- `card.boxShadow` returns to `var(--shadow-md)` from the `.spotlight-wrap` CSS rule

### 4.7 Full Implementation Block

```js
(function() {
  const cards = document.querySelectorAll('.spotlight-wrap');
  cards.forEach(card => {
    const overlay = card.querySelector('.spotlight-overlay');
    if (!overlay) return;
    const r = parseInt(card.dataset.accentR || '200');
    const g = parseInt(card.dataset.accentG || '100');
    const b = parseInt(card.dataset.accentB || '200');

    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const nx = (x / rect.width - 0.5);
      const ny = (y / rect.height - 0.5);
      overlay.style.background = `radial-gradient(circle 120px at ${x}px ${y}px, rgba(${r},${g},${b},0.25), transparent)`;
      const sx = -nx * 4;
      const sy = ny * 4;
      card.style.boxShadow = `${sx}px ${sy}px 0 var(--border-default)`;
    });

    card.addEventListener('mouseleave', () => {
      overlay.style.background = '';
      card.style.boxShadow = '';
    });
  });
})();
```

---

## 5. Accent Color Reference (Demo Instances)

| `data-accent` | `data-accent-r` | `data-accent-g` | `data-accent-b` | RGBA at 0.25 |
|---|---|---|---|---|
| `pink` | `200` | `80` | `180` | `rgba(200, 80, 180, 0.25)` |
| `cyan` | `100` | `160` | `220` | `rgba(100, 160, 220, 0.25)` |

Default fallback values (when attributes are absent): `rgba(200, 100, 200, 0.25)`.

The RGB values are approximate sRGB representations of the design token accent colors. They are **not** derived from CSS custom property resolution — they are hand-authored as integers on the HTML element.

---

## 6. Accessibility

### 6.1 `prefers-reduced-motion: reduce`

The JavaScript `mousemove` handler has **no `reducedMotion` guard**. This is intentional: cursor-tracking a gradient position is a positional response, not an animation. The CSS global rule collapses `transition-duration` values but `.spotlight-overlay` has no CSS transition — its `background` is set directly via `style`.

The global CSS reduced motion rule in the file:
```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}
```
This has no effect on the spotlight because there is no CSS animation or transition on either `.spotlight-wrap` or `.spotlight-overlay`.

If the design intent is to disable the spotlight for reduced-motion users, add the following guard:

```js
// Optional: add this check inside the mousemove handler
if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
```

### 6.2 Keyboard

The spotlight effect is mouse-only. `.spotlight-wrap` uses `cursor: default` — it is a display element, not interactive. No keyboard events are attached.

---

## 7. Token Dependencies

### Tier 2 (Semantic)

| Token | Usage |
|---|---|
| `--border-default` | Shadow color on `mousemove` |
| `--shadow-md` | Default `box-shadow` (CSS) — reverts on `mouseleave` |
| `--accent-primary-subtle` | Card background (via `[data-accent="pink"]`) |
| `--accent-primary` | Card border color (via `[data-accent="pink"]`) |
| `--accent-primary-text` | Card text color (via `[data-accent="pink"]`) |
| `--accent-cyan-subtle` | Card background (via `[data-accent="cyan"]`) |
| `--accent-cyan` | Card border color (via `[data-accent="cyan"]`) |
| `--accent-cyan-text` | Card text color (via `[data-accent="cyan"]`) |

### Tier 3 (Component)

| Token | Usage |
|---|---|
| `--radius-md` | Card and overlay border-radius |

### Non-Tokenized Values

| Value | Usage |
|---|---|
| `160px` | Card width |
| `120px` | Card height |
| `120px` | Spotlight circle radius in gradient |
| `0.25` | Gradient color opacity |
| `4` | Shadow offset multiplier |
| `0` | Shadow blur (hard edge) |
| `200`, `80`, `180` | Pink accent RGB (hardcoded on element) |
| `100`, `160`, `220` | Cyan accent RGB (hardcoded on element) |
| `200`, `100`, `200` | Default fallback RGB (in JS) |

---

## 8. Test Specification

### 8.1 Computed Style Assertions

- `.spotlight-wrap` has `position: relative` and `overflow: hidden`
- `.spotlight-overlay` has `position: absolute`, `inset: 0`, `pointer-events: none`
- `.spotlight-overlay` has `border-radius` matching the parent's resolved `var(--radius-md)`
- `[data-accent="pink"]` has `background` resolving to `var(--accent-primary-subtle)`
- `[data-accent="cyan"]` has `background` resolving to `var(--accent-cyan-subtle)`

### 8.2 Interaction Assertions

- On `mousemove` over `.spotlight-wrap`, `overlay.style.background` is set to a `radial-gradient(circle 120px at Xpx Ypx, ...)` string
- Gradient position coordinates match `e.clientX - rect.left` and `e.clientY - rect.top`
- Gradient color matches the `data-accent-r/g/b` values of the hovered card (`rgba(200,80,180,0.25)` for pink, `rgba(100,160,220,0.25)` for cyan)
- `card.style.boxShadow` is set on `mousemove` with a value in the form `Xpx Ypx 0 var(--border-default)`
- Shadow X offset is negative when cursor is on the right half (`nx > 0`)
- Shadow Y offset is positive when cursor is on the bottom half (`ny > 0`)
- On `mouseleave`, `overlay.style.background` equals `''`
- On `mouseleave`, `card.style.boxShadow` equals `''`
- Each `.spotlight-wrap` independently responds to its own hover — hovering one card does not affect siblings

### 8.3 Visual Regression Scenarios

- Pink card: default state (no cursor, light mode)
- Pink card: default state (no cursor, dark mode)
- Pink card: cursor at top-left corner
- Pink card: cursor at bottom-right corner
- Pink card: cursor at exact center
- Cyan card: cursor at center
- Both cards side by side: one hovered, one at rest

### 8.4 Reduced Motion

- With `prefers-reduced-motion: reduce`, the spotlight gradient still renders (JS has no guard)
- If reduced motion guard is added, `mousemove` should return early and overlay should remain empty

---

## 9. Implementation CSS

```css
/* [data-accent] color theming — applies to any element with data-accent attribute */
[data-accent="pink"]   { background: var(--accent-primary-subtle); border-color: var(--accent-primary);  color: var(--accent-primary-text); }
[data-accent="gold"]   { background: var(--accent-gold-subtle);    border-color: var(--accent-gold);     color: var(--accent-gold-text); }
[data-accent="cyan"]   { background: var(--accent-cyan-subtle);    border-color: var(--accent-cyan);     color: var(--accent-cyan-text); }
[data-accent="green"]  { background: var(--accent-green-subtle);   border-color: var(--accent-green);    color: var(--accent-green-text); }
[data-accent="purple"] { background: var(--accent-purple-subtle);  border-color: var(--accent-purple);   color: var(--accent-purple-text); }
[data-accent="danger"] { background: var(--accent-danger-subtle);  border-color: var(--accent-danger);   color: var(--accent-danger-text); }

@layer component {
  .spotlight-wrap {
    width: 160px;
    height: 120px;
    position: relative;
    border: 2px solid;       /* color from [data-accent] */
    border-radius: var(--radius-md);
    box-shadow: var(--shadow-md);
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: 800;
    overflow: hidden;
    cursor: default;
  }

  .spotlight-overlay {
    position: absolute;
    inset: 0;
    pointer-events: none;
    border-radius: inherit;
    /* background is set entirely by JS — no default gradient here */
  }
}
```

## 10. Implementation JavaScript

```js
(function() {
  const cards = document.querySelectorAll('.spotlight-wrap');
  cards.forEach(card => {
    const overlay = card.querySelector('.spotlight-overlay');
    if (!overlay) return;

    // Read RGB accent values from data attributes; fall back to defaults
    const r = parseInt(card.dataset.accentR || '200');
    const g = parseInt(card.dataset.accentG || '100');
    const b = parseInt(card.dataset.accentB || '200');

    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      // Absolute pixel position within card
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      // Normalized position relative to center: [-0.5, 0.5]
      const nx = (x / rect.width - 0.5);
      const ny = (y / rect.height - 0.5);
      // Radial spotlight gradient centered at cursor
      overlay.style.background = `radial-gradient(circle 120px at ${x}px ${y}px, rgba(${r},${g},${b},0.25), transparent)`;
      // Hard-edge shadow shifts opposite cursor — simulates light source
      const sx = -nx * 4;
      const sy = ny * 4;
      card.style.boxShadow = `${sx}px ${sy}px 0 var(--border-default)`;
    });

    card.addEventListener('mouseleave', () => {
      overlay.style.background = '';   // reverts: no gradient
      card.style.boxShadow = '';       // reverts to CSS var(--shadow-md)
    });
  });
})();
```
