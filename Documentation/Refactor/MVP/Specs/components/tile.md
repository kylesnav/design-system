---
title: "Tile"
date: 2026-03-02
type: spec
scope: mvp
status: active
---

# Tile

> Navigation tiles with colored top borders and animated accent bars on hover. Used in the hero section as a table-of-contents grid. Implements the lift/press interaction pattern with shadow-md at rest, shadow-lg on hover, and shadow collapse on active.

Cross-references: [[shadows]] (lift/press pattern, shadow-md/lg), [[card]] (shares the lift/press paradigm with slightly different transform values), [[radius]] (uses `--radius-lg`), [[spacing]] (uses `--space-4`, `--space-6`).

Visual reference: Section "Hero & Tiles" in `design-reference.html` (lines ~1275-1402).

---

## 1. HTML Structure

### 1.1 Single Tile

```html
<a href="#color" class="tile tile-gold anim-in anim-d2">
  <span class="tile-num">02</span>
  <div class="tile-name">Color System</div>
  <div class="tile-desc">oklch tokens, semantic mapping, contrast</div>
  <div class="tile-anim">
    <div class="tile-anim-bar" style="width:12px;background:var(--accent-primary)"></div>
    <div class="tile-anim-bar" style="width:12px;background:var(--accent-gold)"></div>
    <div class="tile-anim-bar" style="width:12px;background:var(--accent-cyan)"></div>
  </div>
</a>
```

### 1.2 Tile Grid (4-column)

```html
<div class="tile-grid">
  <a href="#philosophy" class="tile tile-pink anim-in anim-d1">
    <span class="tile-num">01</span>
    <div class="tile-name">Philosophy</div>
    <div class="tile-desc">Warm boldness, neo-brutalist confidence</div>
  </a>
  <a href="#color" class="tile tile-gold anim-in anim-d2">
    <span class="tile-num">02</span>
    <div class="tile-name">Color System</div>
    <div class="tile-desc">oklch tokens, semantic mapping, contrast</div>
  </a>
  <a href="#typography" class="tile tile-cyan anim-in anim-d3">
    <span class="tile-num">03</span>
    <div class="tile-name">Typography</div>
    <div class="tile-desc">Fluid scale, Inter variable, live tester</div>
  </a>
  <a href="#spacing" class="tile tile-pink anim-in anim-d4">
    <span class="tile-num">04</span>
    <div class="tile-name">Spacing & Layout</div>
    <div class="tile-desc">8px grid, radius, responsive systems</div>
  </a>
</div>
```

---

## 2. CSS Classes

### 2.1 `.tile-grid` (grid container)

| Property | Value | Token |
|---|---|---|
| `display` | `grid` | -- |
| `grid-template-columns` | `repeat(4, 1fr)` | 4-column layout |
| `gap` | `var(--space-4)` | `16px` |
| `max-width` | `960px` | -- |
| `margin` | `0 auto` | Centered |

Reactive dimming on the grid:

```css
.tile-grid:has(.tile:hover) .tile:not(:hover) {
  opacity: 0.7;
  transform: translate(2px, 2px);
  box-shadow: 0 0 0 var(--border-default);
  filter: grayscale(0.8);
}
```

### 2.2 `.tile` (base)

| Property | Value | Token |
|---|---|---|
| `background` | `var(--bg-surface)` | -- |
| `border` | `2px solid var(--text-primary)` | Strong contrast border |
| `border-radius` | `var(--radius-lg)` | `24px` |
| `padding` | `var(--space-6)` | `24px` |
| `cursor` | `pointer` | -- |
| `text-decoration` | `none` | For `<a>` elements |
| `color` | `inherit` | -- |
| `display` | `block` | -- |
| `border-top` | `4px solid var(--text-primary)` | Thicker top border for accent stripe |
| `position` | `relative` | For animated overlays |
| `overflow` | `hidden` | Clips animated accent bars |
| `box-shadow` | `var(--shadow-md)` | `4px 4px 0 var(--border-default)` |
| `transition` | `transform var(--motion-instant) linear, box-shadow var(--motion-instant) linear, border-color var(--motion-fast) var(--ease-out), opacity var(--motion-fast) var(--ease-out), filter var(--motion-fast) var(--ease-out)` | -- |
| `will-change` | `transform, opacity, filter, box-shadow` | -- |

### 2.3 Tile Color Variants (top border color)

| Class | `border-top-color` |
|---|---|
| `.tile-pink` | `var(--accent-primary)` |
| `.tile-red` | `var(--accent-danger)` |
| `.tile-gold` | `var(--accent-gold)` |
| `.tile-cyan` | `var(--accent-cyan)` |

### 2.4 `.tile-num`

| Property | Value | Token |
|---|---|---|
| `font-family` | `var(--font-mono)` | -- |
| `font-size` | `var(--step--2)` | Fluid ~11px - 12.8px |
| `color` | `var(--text-muted)` | -- |
| `font-weight` | `500` | -- |
| `margin-bottom` | `var(--space-2)` | `8px` |

### 2.5 `.tile-name`

| Property | Value | Token |
|---|---|---|
| `font-size` | `0.9375rem` | 15px |
| `font-weight` | `620` | -- |
| `letter-spacing` | `var(--tracking-tight)` | `-0.02em` |
| `margin-bottom` | `var(--space-1)` | `4px` |

### 2.6 `.tile-desc`

| Property | Value | Token |
|---|---|---|
| `font-size` | `0.75rem` | 12px |
| `color` | `var(--text-secondary)` | -- |
| `line-height` | `1.45` | -- |

### 2.7 `.tile-anim` (animated bars container)

| Property | Value | Token |
|---|---|---|
| `height` | `24px` | -- |
| `margin-top` | `var(--space-3)` | `12px` |
| `display` | `flex` | -- |
| `align-items` | `center` | -- |
| `gap` | `3px` | -- |

### 2.8 `.tile-anim-bar`

| Property | Value |
|---|---|
| `height` | `100%` |
| `border-radius` | `2px` |
| `min-width` | `4px` |

With `prefers-reduced-motion: no-preference`, bars animate with pulse keyframes:

```css
@keyframes tile-pulse {
  0%, 100% { transform: scaleY(0.3); }
  50% { transform: scaleY(1); }
}
.tile-anim-bar {
  animation: tile-pulse 1.4s ease-in-out infinite;
  transform-origin: bottom;
}
.tile-anim-bar:nth-child(2) { animation-delay: 0.15s; }
.tile-anim-bar:nth-child(3) { animation-delay: 0.3s; }
.tile-anim-bar:nth-child(4) { animation-delay: 0.45s; }
.tile-anim-bar:nth-child(5) { animation-delay: 0.6s; }
```

---

## 3. States

### 3.1 Default (rest)

| Property | Value |
|---|---|
| `box-shadow` | `var(--shadow-md)` = `4px 4px 0 var(--border-default)` |
| `transform` | `none` |

### 3.2 Hover

| Property | Value |
|---|---|
| `transform` | `translate(-4px, -4px)` |
| `box-shadow` | `var(--shadow-lg)` = `8px 8px 0 var(--border-default)` |
| `border-color` | `var(--border-strong)` |
| `z-index` | `10` |

### 3.3 Active (pressed)

| Property | Value |
|---|---|
| `transform` | `translate(2px, 2px)` |
| `box-shadow` | `0 0 0 var(--border-default)` (shadow collapses) |

### 3.4 Grid Dimming (sibling tiles)

When one tile is hovered, non-hovered siblings:

| Property | Value |
|---|---|
| `opacity` | `0.7` |
| `transform` | `translate(2px, 2px)` |
| `box-shadow` | `0 0 0 var(--border-default)` |
| `filter` | `grayscale(0.8)` |

---

## 4. The Tile Lift/Press Pattern

Tiles share the card lift/press paradigm:

1. **Rest**: `--shadow-md` (4px 4px). Standard elevation.
2. **Hover**: `translate(-4px, -4px)` + `--shadow-lg` (8px 8px). Tile lifts away from growing shadow.
3. **Active**: `translate(2px, 2px)` + shadow collapses to `0 0 0`. Tile slams flat.

This is identical to the card interactive pattern. The transform values move the tile in the opposite direction of the shadow growth on hover (up-left to expose the down-right shadow).

---

## 5. Responsive Behavior

### Viewport Breakpoints

| Breakpoint | Change |
|---|---|
| `769px - 1024px` | `.tile-grid` becomes 3-column: `grid-template-columns: repeat(3, 1fr)` |
| `max-width: 768px` | `.tile-grid` becomes 2-column: `grid-template-columns: 1fr 1fr !important` |
| `max-width: 480px` | `.tile-grid` becomes 1-column: `grid-template-columns: 1fr !important` |

---

## 6. Accessibility

- Tiles are navigation links (`<a>` elements). They have a natural link role and are focusable.
- The `.tile-num` is decorative numbering -- screen readers will read the tile name and description.
- The `.tile-anim` section is purely decorative. SVGs and animated bars within should have `aria-hidden="true"`.
- Focus state is handled by the global `:focus-visible` rule (2px solid `--focus-ring`).
- Ensure `href` values point to valid targets for keyboard navigation.

---

## 7. Token Dependencies

### Tier 2 (Semantic)

- `--bg-surface`, `--text-primary`, `--text-secondary`, `--text-muted`
- `--border-default`, `--border-strong`
- `--shadow-md`, `--shadow-lg`
- `--accent-primary`, `--accent-danger`, `--accent-gold`, `--accent-cyan`

### Tier 3 (Component)

- `--radius-lg` (`24px`)
- `--space-1` (`4px`), `--space-2` (`8px`), `--space-3` (`12px`), `--space-4` (`16px`), `--space-6` (`24px`)
- `--font-mono`
- `--step--2` (fluid ~11px-12.8px)
- `--tracking-tight` (`-0.02em`)
- `--motion-instant` (`100ms`), `--motion-fast` (`160ms`)
- `--ease-out`, `--ease-smooth`

---

## 8. Test Specification

### 8.1 Computed Style Assertions

- `.tile` has `border-radius` resolving to `24px`
- `.tile` has `border-top-width: 4px`
- `.tile-pink` border-top-color matches `--accent-primary` resolved value
- `.tile` has `box-shadow` matching `--shadow-md` resolved value
- `.tile` has `cursor: pointer`
- `.tile-grid` has `grid-template-columns: repeat(4, 1fr)`

### 8.2 Interaction Assertions

- `.tile:hover` has `transform: translate(-4px, -4px)` and `box-shadow` matching `--shadow-lg`
- `.tile:active` has `transform: translate(2px, 2px)` and `box-shadow: 0 0 0`
- Grid dimming: when one tile is hovered, non-hovered siblings have `opacity: 0.7` and `filter: grayscale(0.8)`

### 8.3 Visual Regression Scenarios

- 4-tile grid with all color variants (light mode)
- 4-tile grid in dark mode
- Single tile in default, hover, and active states
- Grid dimming effect (one tile hovered)
- Responsive: 3-column at 900px, 2-column at 768px, 1-column at 480px
- Tile with animated bars

### 8.4 Reduced Motion Compliance

- With `prefers-reduced-motion: reduce`, `tile-pulse` animation duration is 0.01ms
- Hover/active transform transitions resolve in 0.01ms

---

## 9. Implementation CSS

```css
@layer component {
  .tile-grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: var(--space-4);
    max-width: 960px;
    margin: 0 auto;
  }

  .tile-grid:has(.tile:hover) .tile:not(:hover) {
    opacity: 0.7;
    transform: translate(2px, 2px);
    box-shadow: 0 0 0 var(--border-default);
    filter: grayscale(0.8);
  }

  .tile {
    background: var(--bg-surface);
    border: 2px solid var(--text-primary);
    border-radius: var(--radius-lg);
    padding: var(--space-6);
    cursor: pointer;
    text-decoration: none;
    color: inherit;
    display: block;
    border-top: 4px solid var(--text-primary);
    position: relative;
    overflow: hidden;
    box-shadow: var(--shadow-md);
    transition: transform var(--motion-instant) linear,
                box-shadow var(--motion-instant) linear,
                border-color var(--motion-fast) var(--ease-out),
                opacity var(--motion-fast) var(--ease-out),
                filter var(--motion-fast) var(--ease-out);
    will-change: transform, opacity, filter, box-shadow;
  }
  .tile:hover {
    transform: translate(-4px, -4px);
    box-shadow: var(--shadow-lg);
    border-color: var(--border-strong);
    z-index: 10;
  }
  .tile:active {
    transform: translate(2px, 2px);
    box-shadow: 0 0 0 var(--border-default);
  }

  .tile-num {
    font-family: var(--font-mono);
    font-size: var(--step--2);
    color: var(--text-muted);
    font-weight: 500;
    margin-bottom: var(--space-2);
  }

  .tile-name {
    font-size: 0.9375rem;
    font-weight: 620;
    letter-spacing: var(--tracking-tight);
    margin-bottom: var(--space-1);
  }

  .tile-desc {
    font-size: 0.75rem;
    color: var(--text-secondary);
    line-height: 1.45;
  }

  .tile-pink { border-top-color: var(--accent-primary); }
  .tile-red { border-top-color: var(--accent-danger); }
  .tile-gold { border-top-color: var(--accent-gold); }
  .tile-cyan { border-top-color: var(--accent-cyan); }

  .tile-anim {
    height: 24px;
    margin-top: var(--space-3);
    display: flex;
    align-items: center;
    gap: 3px;
  }

  .tile-anim-bar {
    height: 100%;
    border-radius: 2px;
    min-width: 4px;
  }

  @media (prefers-reduced-motion: no-preference) {
    @keyframes tile-pulse {
      0%, 100% { transform: scaleY(0.3); }
      50% { transform: scaleY(1); }
    }
    .tile-anim-bar {
      animation: tile-pulse 1.4s ease-in-out infinite;
      transform-origin: bottom;
    }
    .tile-anim-bar:nth-child(2) { animation-delay: 0.15s; }
    .tile-anim-bar:nth-child(3) { animation-delay: 0.3s; }
    .tile-anim-bar:nth-child(4) { animation-delay: 0.45s; }
    .tile-anim-bar:nth-child(5) { animation-delay: 0.6s; }
  }

  @media (min-width: 769px) and (max-width: 1024px) {
    .tile-grid {
      grid-template-columns: repeat(3, 1fr);
    }
  }

  @media (max-width: 768px) {
    .tile-grid {
      grid-template-columns: 1fr 1fr !important;
    }
  }

  @media (max-width: 480px) {
    .tile-grid {
      grid-template-columns: 1fr !important;
    }
  }
}
```
