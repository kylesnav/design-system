# Accordion

> Expandable disclosure sections built on native `<details>`/`<summary>` elements. Height animation uses the CSS grid `grid-template-rows: 0fr → 1fr` technique (via `.accordion-squish`) for browsers that support it, and falls back to browser-native `<details>` expand/collapse. Items connect visually by sharing borders with negative margin overlap. The `+` chevron indicator rotates to `×` (45 degrees) when open. Fully keyboard-accessible without any JavaScript — native `<details>` handles all disclosure behavior.

Cross-references: [[button]] (trigger shares lift/press micro interaction at 1px), [[motion]] (`--ease-smooth` for grid-row transition, `--motion-base` timing), [[token-tiers]] (spacing, radius, typography tokens).

Visual reference: Section "05 — Components", subsection "Accordion" in `design-reference.html` (lines ~5978–5995 HTML, CSS at lines ~3306–3380 and lines ~3925–3936).

---

## 1. HTML Structure

### 1.1 Accordion Group (3 items, first open)

```html
<details class="accordion-item" open>
  <summary class="accordion-trigger">
    What is the Delightful Design System?
  </summary>
  <div class="accordion-content">
    A comprehensive design system built with OKLCH color, neo-brutalist aesthetics,
    and modern CSS features. Every token, component, and interaction is designed to spark joy.
  </div>
</details>

<details class="accordion-item">
  <summary class="accordion-trigger">
    How are colors defined?
  </summary>
  <div class="accordion-content">
    All colors use the OKLCH color space exclusively. The 3-tier token architecture maps raw
    primitives to semantic tokens to component-level values, ensuring perceptual consistency
    across the palette.
  </div>
</details>

<details class="accordion-item">
  <summary class="accordion-trigger">
    Does it support dark mode?
  </summary>
  <div class="accordion-content">
    Yes. Dark mode uses warm amber-tinted backgrounds with adjusted accent colors. The toggle
    cycles between light, dark, and system preference modes. All semantic tokens have
    dark-mode equivalents.
  </div>
</details>
```

### 1.2 Single Accordion Item (standalone)

```html
<details class="accordion-item">
  <summary class="accordion-trigger">Accordion Title</summary>
  <div class="accordion-content">Content goes here.</div>
</details>
```

### 1.3 Grid-animated Variant (`.accordion-squish`)

For JS-powered or framework-controlled accordions where open/close is toggled programmatically (not using native `<details>`):

```html
<div class="accordion-item">
  <button class="accordion-trigger" aria-expanded="false" aria-controls="content-1">
    Accordion Title
  </button>
  <div class="accordion-squish" id="content-1">
    <div class="accordion-content">
      Content goes here.
    </div>
  </div>
</div>
```

Toggle open by adding `.accordion-open` to `.accordion-squish`:

```js
document.querySelector('.accordion-squish').classList.add('accordion-open');
```

---

## 2. CSS Classes

### 2.1 `.accordion-item` (wrapper — `<details>` element)

| Property | Value | Token |
|---|---|---|
| `border` | `2px solid var(--border-default)` | `--border-default` |
| `border-radius` | `var(--radius-md)` | `16px` |
| `overflow` | `hidden` | Clips content during animation |

**Connected group behavior** (adjacent items share border):

```css
/* Second item and beyond: collapse top border, remove top radius */
.accordion-item + .accordion-item {
  margin-top: -2px;
  border-top-left-radius: 0;
  border-top-right-radius: 0;
}

/* Item that has a sibling after it: remove bottom radius */
.accordion-item:has(+ .accordion-item) {
  border-bottom-left-radius: 0;
  border-bottom-right-radius: 0;
}

/* Single item (no siblings): full radius on all corners */
.accordion-item:only-child {
  border-radius: var(--radius-md);
}
```

**Open state indicator** — when `[open]`, the trigger's `::after` pseudo-element rotates:

```css
.accordion-item[open] .accordion-trigger::after {
  transform: rotate(45deg);
}
```

### 2.2 `.accordion-trigger` (the `<summary>` element)

| Property | Value | Token |
|---|---|---|
| `display` | `flex` | -- |
| `align-items` | `center` | -- |
| `justify-content` | `space-between` | Pushes chevron to right |
| `width` | `100%` | Full-width row |
| `padding` | `var(--space-4) var(--space-5)` | `16px 20px` |
| `font-weight` | `600` | -- |
| `font-size` | `var(--ui-text-md)` | `14px` |
| `cursor` | `pointer` | -- |
| `background` | `var(--bg-surface)` | -- |
| `list-style` | `none` | Removes native disclosure triangle |
| `font-family` | `var(--font-sans)` | -- |
| `transition` | `transform var(--motion-instant) linear, background var(--motion-fast) var(--ease-out)` | -- |

Hover state:

| Property | Value |
|---|---|
| `background` | `var(--bg-subtle)` |

Active/press state:

| Property | Value |
|---|---|
| `transform` | `translateY(1px)` |

WebKit disclosure triangle removal:

```css
.accordion-trigger::-webkit-details-marker {
  display: none;
}
```

Chevron indicator (`::after` pseudo-element):

| Property | Value |
|---|---|
| `content` | `"+"` |
| `font-size` | `1.25rem` |
| `font-weight` | `400` |
| `color` | `var(--text-muted)` |
| `transition` | `transform var(--motion-fast) var(--ease-out)` |
| `flex-shrink` | `0` |

Open state (parent `[open]`):

| Property | Value |
|---|---|
| `transform` | `rotate(45deg)` (the `+` becomes `×`) |

### 2.3 `.accordion-content` (body)

| Property | Value | Token |
|---|---|---|
| `padding` | `0 var(--space-5) var(--space-5)` | `0 20px 20px` — no top padding |
| `font-size` | `var(--ui-text-md)` | `14px` |
| `color` | `var(--text-secondary)` | -- |
| `line-height` | `var(--leading-relaxed)` | `1.65` |

### 2.4 `.accordion-squish` (grid-based height animation)

Used as a wrapper around `.accordion-content` for smooth CSS-animated height transitions. Not used in the native `<details>` pattern — only for JS-controlled variants.

| State | Property | Value |
|---|---|---|
| **Closed** | `grid-template-rows` | `0fr` |
| **Open** (`.accordion-open`) | `grid-template-rows` | `1fr` |
| Transition | `grid-template-rows` | `240ms var(--ease-smooth)` |

The direct child of `.accordion-squish` must have `overflow: hidden`:

```css
.accordion-squish > * {
  overflow: hidden;
}
```

**Progressive enhancement** — the reference enables `interpolate-size: allow-keywords` on `:root` to support `height: auto` animation in browsers that support it:

```css
:root {
  interpolate-size: allow-keywords;
}
```

---

## 3. Variants

There is one visual variant in the reference — the standard accordion. The connected group vs. standalone distinction is handled automatically through sibling CSS selectors, not modifier classes.

---

## 4. States

| State | CSS Mechanism |
|---|---|
| **Closed** | `<details>` closed (default); `.accordion-squish` without `.accordion-open` |
| **Open** | `<details open>` attribute present; `.accordion-squish.accordion-open` |
| **Trigger hover** | `background: var(--bg-subtle)` |
| **Trigger active/press** | `transform: translateY(1px)` |
| **Chevron open** | `::after` rotates `rotate(45deg)` |
| **Chevron closed** | `::after` at `rotate(0deg)` (no transform) |

---

## 5. Height Animation

The reference implements smooth accordion height animation via two complementary mechanisms:

**Mechanism 1 — CSS Grid squish** (`.accordion-squish`):
- `grid-template-rows: 0fr` (collapsed) → `1fr` (expanded)
- The inner element has `overflow: hidden`, which clips content at zero height
- Transition: `240ms var(--ease-smooth)`
- Works in browsers that support `grid-template-rows` animation (Chrome 111+, Firefox 116+, Safari 16+)
- Does NOT use `height: 0` → `height: auto` (avoids the classic auto-height problem)

**Mechanism 2 — `interpolate-size` (progressive enhancement)**:
- `:root { interpolate-size: allow-keywords; }` enables `height: auto` animation in browsers that support this property (Chrome 129+)
- This allows the native `<details>` expand/collapse to animate smoothly without JavaScript

For maximum compatibility: use the native `<details>` pattern (mechanism 2) as baseline, and layer `.accordion-squish` when JS control is needed.

---

## 6. Responsive Behavior

No breakpoint-specific accordion rules in the reference. The accordion fills its container width. The demo uses a `max-width: 560px` constraint on the wrapper, but this is a layout decision not part of the component itself.

---

## 7. Accessibility

- Native `<details>`/`<summary>` provides full keyboard and screen reader support without additional ARIA.
- Pressing Enter or Space on a focused `<summary>` toggles the accordion.
- Screen readers announce "expanded" / "collapsed" state automatically.
- For JS-controlled variants (`.accordion-squish`), add `aria-expanded="true/false"` to the trigger button and `aria-controls="<content-id>"` to link it to the panel.
- The `list-style: none` and `&::-webkit-details-marker { display: none }` remove the native disclosure triangle — the `+`/`×` pseudo-element provides the visual indicator.
- Ensure the trigger has sufficient touch target height (current padding yields a ~46px touch height, which exceeds the 44px WCAG minimum).

---

## 8. Token Dependencies

### Tier 2 (Semantic)

- `--border-default` (item border)
- `--bg-surface` (trigger default background)
- `--bg-subtle` (trigger hover background)
- `--text-secondary` (content text color)
- `--text-muted` (chevron color)

### Tier 3 (Component)

- `--radius-md` (`16px`) — accordion item border-radius
- `--space-4` (`16px`) — trigger vertical padding
- `--space-5` (`20px`) — trigger/content horizontal padding
- `--font-sans` — trigger font
- `--ui-text-md` (`14px`) — trigger and content font-size
- `--leading-relaxed` (`1.65`) — content line-height
- `--motion-instant` (`100ms`) — trigger transform transition
- `--motion-fast` (`160ms`) — trigger background + chevron transition
- `--ease-out` — trigger background easing
- `--ease-smooth` — chevron + squish height easing

---

## 9. Test Specification

### 9.1 Computed Style Assertions

- `.accordion-item` has `border: 2px solid` with color matching `--border-default`
- `.accordion-item` has `border-radius` resolving to `16px`
- `.accordion-trigger` has `padding` resolving to `16px 20px`
- `.accordion-trigger` has `font-weight: 600`
- `.accordion-trigger` has `font-size` resolving to `14px`
- `.accordion-content` has `color` matching `--text-secondary` resolved value
- `.accordion-content` has `line-height: 1.65`
- Group of 3 `.accordion-item` elements: middle item has `border-radius: 0` on all corners

### 9.2 Interaction Assertions

- Clicking `.accordion-trigger` inside closed `<details>` opens it (sets `[open]`)
- Clicking `.accordion-trigger` inside open `<details>` closes it (removes `[open]`)
- `.accordion-item[open] .accordion-trigger::after` has `transform: rotate(45deg)`
- `.accordion-trigger:hover` has `background` matching `--bg-subtle`
- `.accordion-trigger:active` has `transform: translateY(1px)`
- `.accordion-squish.accordion-open` has `grid-template-rows` resolving to `1fr`
- `.accordion-squish` (without `.accordion-open`) has `grid-template-rows: 0fr`

### 9.3 Visual Regression Scenarios

- 3-item group: all closed
- 3-item group: first item open
- 3-item group: all open
- Single standalone accordion item
- Trigger hover state
- Dark mode: all states

### 9.4 Reduced Motion Compliance

- With `prefers-reduced-motion: reduce`, trigger transitions complete in `0.01ms`
- `.accordion-squish` transition completes in `0.01ms`

---

## 10. Implementation CSS

```css
@layer component {
  /* Progressive enhancement for height: auto animation */
  :root {
    interpolate-size: allow-keywords;
  }

  .accordion-item {
    border: 2px solid var(--border-default);
    border-radius: var(--radius-md);
    overflow: hidden;
  }

  /* Connected group border management */
  .accordion-item + .accordion-item {
    margin-top: -2px;
    border-top-left-radius: 0;
    border-top-right-radius: 0;
  }
  .accordion-item:has(+ .accordion-item) {
    border-bottom-left-radius: 0;
    border-bottom-right-radius: 0;
  }
  .accordion-item:only-child {
    border-radius: var(--radius-md);
  }

  /* Open state: rotate chevron */
  .accordion-item[open] .accordion-trigger::after {
    transform: rotate(45deg);
  }

  .accordion-trigger {
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 100%;
    padding: var(--space-4) var(--space-5);
    font-weight: 600;
    font-size: var(--ui-text-md);
    cursor: pointer;
    background: var(--bg-surface);
    list-style: none;
    font-family: var(--font-sans);
    transition: transform var(--motion-instant) linear,
                background var(--motion-fast) var(--ease-out);
  }
  .accordion-trigger:hover  { background: var(--bg-subtle); }
  .accordion-trigger:active { transform: translateY(1px); }
  .accordion-trigger::-webkit-details-marker { display: none; }

  .accordion-trigger::after {
    content: "+";
    font-size: 1.25rem;
    font-weight: 400;
    color: var(--text-muted);
    transition: transform var(--motion-fast) var(--ease-out);
    flex-shrink: 0;
  }

  .accordion-content {
    padding: 0 var(--space-5) var(--space-5);
    font-size: var(--ui-text-md);
    color: var(--text-secondary);
    line-height: var(--leading-relaxed);
  }

  /* Grid-based height animation (JS-controlled variant) */
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
}
```
