# Magnetic Button

> Signature interaction where a button visually pulls toward the cursor when the pointer enters a surrounding detection zone. The button translates proportionally toward the cursor position within a 120px attraction radius, with a 0.3 pull strength multiplier. On pointer leave, the button springs back to center with a bouncy easing. Requires JavaScript for cursor tracking. Disabled when `prefers-reduced-motion: reduce`.

Cross-references: [[button]] (`.magnetic-btn` shares visual style with `.btn`), [[motion]] (spring easing `--ease-bounce`, smooth easing `--ease-smooth`), [[token-tiers]] (spacing and accent tokens).

Visual reference: Section "11 -- Signature Effects", subsection "Magnetic Button" in `design-reference.html` (lines ~6869-6877 HTML, CSS at lines ~3599-3621, JS at lines ~8006-8026).

---

## 1. HTML Structure

```html
<div class="magnetic-zone" id="magnetic-zone">
  <button class="magnetic-btn" id="magnetic-btn">Pull me closer</button>
</div>
```

Wrapper context in reference:

```html
<div style="padding:var(--space-12);text-align:center">
  <div class="magnetic-zone" id="magnetic-zone">
    <button class="magnetic-btn" id="magnetic-btn">Pull me closer</button>
  </div>
</div>
```

---

## 2. CSS Classes

### 2.1 `.magnetic-zone` (detection area)

| Property | Value | Token |
|---|---|---|
| `display` | `inline-block` | -- |
| `position` | `relative` | -- |

The zone is dynamically padded via JS to `60px` on all sides, creating the detection area around the button. This padding is not in the CSS stylesheet -- it is set by JavaScript at initialization:

```js
magneticZone.style.padding = '60px';
```

### 2.2 `.magnetic-btn` (the button)

| Property | Value | Token |
|---|---|---|
| `display` | `inline-flex` | -- |
| `align-items` | `center` | -- |
| `gap` | `var(--space-2)` | `8px` |
| `padding` | `var(--space-3) var(--space-8)` | `12px 32px` |
| `font-family` | `var(--font-sans)` | -- |
| `font-size` | `1rem` | `16px` |
| `font-weight` | `600` | -- |
| `background` | `var(--accent-primary)` | Pink accent |
| `color` | `var(--text-on-accent)` | White |
| `border` | `none` | -- |
| `border-radius` | `var(--radius-full)` | `9999px` (pill shape) |
| `cursor` | `pointer` | -- |

### 2.3 `.magnetic-btn:active`

| Property | Value |
|---|---|
| `transform` | `scale(0.95) !important` |

The `!important` ensures the active press effect overrides any magnetic transform applied by JS.

---

## 3. States

| State | Transform | Transition |
|---|---|---|
| **Default** | `translate(0, 0)` | None applied |
| **Cursor within 120px** | `translate(dx * 0.3, dy * 0.3)` | `transform 0.2s cubic-bezier(0.22,1,0.36,1)` |
| **Cursor outside 120px** | No transform change | -- |
| **Mouse leave zone** | `translate(0, 0)` | `transform 0.4s cubic-bezier(0.34,1.56,0.64,1)` |
| **Active (click)** | `scale(0.95)` | Overrides magnetic transform via `!important` |
| **Reduced motion** | No magnetic effect | Button stays static |

---

## 4. JavaScript Behavior

### 4.1 Initialization

```js
const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const magneticZone = document.getElementById('magnetic-zone');
const magneticBtn = document.getElementById('magnetic-btn');

if (magneticZone && magneticBtn && !prefersReduced) {
  magneticZone.style.padding = '60px';
  // attach event listeners
}
```

Guard: the entire magnetic effect is skipped if `prefersReduced` is `true`.

### 4.2 `mousemove` on `.magnetic-zone`

```js
magneticZone.addEventListener('mousemove', e => {
  const rect = magneticBtn.getBoundingClientRect();
  const btnCx = rect.left + rect.width / 2;
  const btnCy = rect.top + rect.height / 2;
  const dx = e.clientX - btnCx;
  const dy = e.clientY - btnCy;
  const dist = Math.sqrt(dx * dx + dy * dy);
  if (dist < 120) {
    const pull = 0.3;
    magneticBtn.style.transition = 'transform 0.2s cubic-bezier(0.22,1,0.36,1)';
    magneticBtn.style.transform = `translate(${dx * pull}px, ${dy * pull}px)`;
  }
});
```

Physics values:

| Parameter | Value | Description |
|---|---|---|
| Attraction radius | `120px` | Distance from button center within which magnetic pull activates |
| Pull strength | `0.3` | Multiplier applied to dx/dy offset. Button moves 30% of cursor distance from center |
| Tracking easing | `cubic-bezier(0.22,1,0.36,1)` | Matches `--ease-smooth` |
| Tracking duration | `0.2s` (`200ms`) | Smooth following, between `--motion-fast` (160ms) and `--motion-base` (240ms) |

Calculation:
1. Get button bounding rect
2. Compute button center: `(rect.left + rect.width/2, rect.top + rect.height/2)`
3. Compute delta: `dx = e.clientX - btnCx`, `dy = e.clientY - btnCy`
4. Compute Euclidean distance: `Math.sqrt(dx*dx + dy*dy)`
5. If `dist < 120`: apply `translate(dx * 0.3, dy * 0.3)`
6. If `dist >= 120`: no transform update (button stays at last position until mouse leaves)

### 4.3 `mouseleave` on `.magnetic-zone`

```js
magneticZone.addEventListener('mouseleave', () => {
  magneticBtn.style.transition = 'transform 0.4s cubic-bezier(0.34,1.56,0.64,1)';
  magneticBtn.style.transform = 'translate(0, 0)';
});
```

| Parameter | Value | Description |
|---|---|---|
| Reset duration | `0.4s` (`400ms`) | Slower than tracking for a satisfying spring-back |
| Reset easing | `cubic-bezier(0.34,1.56,0.64,1)` | Matches `--ease-bounce` -- overshoots past center then settles |

### 4.4 Element Selection

Both elements are selected by `id`:
- `document.getElementById('magnetic-zone')`
- `document.getElementById('magnetic-btn')`

For multiple magnetic buttons on a page, use a class-based query with iteration:

```js
document.querySelectorAll('.magnetic-zone').forEach(zone => {
  const btn = zone.querySelector('.magnetic-btn');
  // attach same logic
});
```

---

## 5. Accessibility

### 5.1 `prefers-reduced-motion: reduce`

The entire magnetic effect is disabled. The button renders as a static pill button with no transform on hover. The check is performed once at initialization:

```js
const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
if (magneticZone && magneticBtn && !prefersReduced) { /* attach */ }
```

### 5.2 Keyboard Interaction

The magnetic effect is mouse-only. Keyboard users interact with `.magnetic-btn` as a standard `<button>` element:
- Focusable via Tab
- Activatable via Enter/Space
- Focus ring via global `:focus-visible` rule
- No magnetic transform is applied during keyboard interaction

### 5.3 Button Semantics

The `.magnetic-btn` uses a native `<button>` element. No additional ARIA attributes are needed for the magnetic effect itself. The button text "Pull me closer" is the accessible name.

---

## 6. Token Dependencies

### Tier 2 (Semantic)

- `--accent-primary` -- button background color
- `--text-on-accent` -- button text color

### Tier 3 (Component)

- `--space-2` (`8px`) -- button gap
- `--space-3` (`12px`) -- button vertical padding
- `--space-8` (`32px`) -- button horizontal padding
- `--font-sans` -- font family
- `--radius-full` (`9999px`) -- pill border-radius

### Easing (used in JS, matching tokens)

- `cubic-bezier(0.22,1,0.36,1)` -- matches `--ease-smooth` (tracking transition)
- `cubic-bezier(0.34,1.56,0.64,1)` -- matches `--ease-bounce` (reset transition)

### Hardcoded Values

- `120px` -- attraction radius (not tokenized)
- `0.3` -- pull strength multiplier (not tokenized)
- `60px` -- zone padding (not tokenized)
- `0.2s` -- tracking transition duration (not tokenized)
- `0.4s` -- reset transition duration (not tokenized)

---

## 7. Test Specification

### 7.1 Computed Style Assertions

- `.magnetic-zone` has `display: inline-block` and `position: relative`
- `.magnetic-btn` has `background` matching `--accent-primary` resolved value
- `.magnetic-btn` has `color` matching `--text-on-accent` resolved value
- `.magnetic-btn` has `border: none`
- `.magnetic-btn` has `border-radius: 9999px`
- `.magnetic-btn` has `font-weight: 600`
- `.magnetic-btn` has `padding` resolving to `12px 32px`

### 7.2 Interaction Assertions

- When cursor enters `.magnetic-zone` and is within 120px of button center, button `transform` contains `translate(` with non-zero values
- Pull direction matches cursor offset (cursor right of center = button moves right)
- Maximum translation at edge of 120px radius: `120 * 0.3 = 36px` in either axis
- When cursor leaves `.magnetic-zone`, button `transform` resets to `translate(0, 0)`
- Reset transition uses `0.4s` duration with bounce easing
- `.magnetic-btn:active` has `transform: scale(0.95)`

### 7.3 Visual Regression Scenarios

- Magnetic button at rest (light mode)
- Magnetic button at rest (dark mode)
- Button displaced toward cursor (simulated offset)
- Button in active/pressed state

### 7.4 Reduced Motion Compliance

- With `prefers-reduced-motion: reduce`, no event listeners are attached
- Button remains static at `translate(0, 0)` regardless of cursor position
- Zone padding remains at default (not set to 60px by JS)

---

## 8. Implementation CSS

```css
@layer component {
  .magnetic-zone {
    display: inline-block;
    position: relative;
  }

  .magnetic-btn {
    display: inline-flex;
    align-items: center;
    gap: var(--space-2);
    padding: var(--space-3) var(--space-8);
    font-family: var(--font-sans);
    font-size: 1rem;
    font-weight: 600;
    background: var(--accent-primary);
    color: var(--text-on-accent);
    border: none;
    border-radius: var(--radius-full);
    cursor: pointer;

    &:active {
      transform: scale(0.95) !important;
    }
  }
}
```

## 9. Implementation JavaScript

```js
const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const magneticZone = document.getElementById('magnetic-zone');
const magneticBtn = document.getElementById('magnetic-btn');

if (magneticZone && magneticBtn && !prefersReduced) {
  magneticZone.style.padding = '60px';

  magneticZone.addEventListener('mousemove', e => {
    const rect = magneticBtn.getBoundingClientRect();
    const btnCx = rect.left + rect.width / 2;
    const btnCy = rect.top + rect.height / 2;
    const dx = e.clientX - btnCx;
    const dy = e.clientY - btnCy;
    const dist = Math.sqrt(dx * dx + dy * dy);
    if (dist < 120) {
      const pull = 0.3;
      magneticBtn.style.transition = 'transform 0.2s cubic-bezier(0.22,1,0.36,1)';
      magneticBtn.style.transform = `translate(${dx * pull}px, ${dy * pull}px)`;
    }
  });

  magneticZone.addEventListener('mouseleave', () => {
    magneticBtn.style.transition = 'transform 0.4s cubic-bezier(0.34,1.56,0.64,1)';
    magneticBtn.style.transform = 'translate(0, 0)';
  });
}
```
