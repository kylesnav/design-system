# Card

> Content container with multiple variants: base (static), interactive (with lift/press), featured (accent top border), compact (reduced padding), and accent-color shadows. Interactive cards implement the same lift/press pattern as buttons but with larger shadow progression (md to lg).

Cross-references: [[shadows]] (lift/press pattern, shadow-md/lg, colored shadows), [[token-tiers]] (card tokens documented but not yet defined as custom properties), [[radius]] (uses `--radius-md`), [[spacing]] (uses `--space-6`, `--space-4`), [[button]] (shares the lift/press interaction paradigm).

Visual reference: Section "05 — Components", subsection "Cards" in `design-reference.html` (lines ~5667-5705).

---

## 1. HTML Structure

### 1.1 Base Card (static)

```html
<div class="card">
  <div class="card-title">Design Tokens</div>
  <div class="card-desc">Centralized design decisions expressed as data -- colors, typography, spacing, motion.</div>
  <div class="card-meta">47 tokens - Updated today</div>
</div>
```

### 1.2 Interactive Card (lift/press)

```html
<div class="card card-interactive">
  <div class="card-title">Design Tokens</div>
  <div class="card-desc">Centralized design decisions expressed as data -- colors, typography, spacing, motion.</div>
  <div class="card-meta">47 tokens - Updated today</div>
</div>
```

### 1.3 Featured Card (pink accent border)

```html
<div class="card card-featured card-interactive">
  <div class="card-title">Component Library</div>
  <div class="card-desc">Production-ready building blocks built on shadcn/ui with Radix primitives.</div>
  <div class="card-meta">24 components - v3.0</div>
</div>
```

### 1.4 Featured Card with Color Variants

```html
<div class="card card-featured card-interactive"><!-- Pink (default) --></div>
<div class="card card-featured card-featured-red card-interactive"><!-- Red --></div>
<div class="card card-featured card-featured-gold card-interactive"><!-- Gold --></div>
<div class="card card-featured card-featured-cyan card-interactive"><!-- Cyan --></div>
<div class="card card-featured card-featured-green card-interactive"><!-- Green --></div>
<div class="card card-featured card-featured-purple card-interactive"><!-- Purple --></div>
```

### 1.5 Compact Card

```html
<div class="card card-compact">
  <div class="card-title">Warm cream base</div>
  <div class="card-desc">Not pure white, not cool. OKLCH cream-tinted backgrounds that feel like sunlight on paper.</div>
</div>
```

### 1.6 Compact Interactive Card

```html
<div class="card card-compact card-interactive">
  <div class="card-title">Compact Interactive</div>
  <div class="card-desc">Reduced padding with full lift/press interaction.</div>
</div>
```

### 1.7 Accent-Color Shadow Cards

```html
<div class="card card-interactive card-accent-pink"><!-- Pink shadow --></div>
<div class="card card-interactive card-accent-gold"><!-- Gold shadow --></div>
<div class="card card-interactive card-accent-cyan"><!-- Cyan shadow --></div>
<div class="card card-interactive card-accent-green"><!-- Green shadow --></div>
<div class="card card-interactive card-accent-purple"><!-- Purple shadow --></div>
```

### 1.8 Cards in a Grid (reactive dimming)

```html
<div class="grid-3">
  <div class="card card-interactive">
    <div class="card-title">Design Tokens</div>
    <div class="card-desc">...</div>
    <div class="card-meta">...</div>
  </div>
  <div class="card card-featured card-interactive">
    <div class="card-title">Component Library</div>
    <div class="card-desc">...</div>
    <div class="card-meta">...</div>
  </div>
  <div class="card card-featured card-featured-cyan card-interactive">
    <div class="card-title">Animation System</div>
    <div class="card-desc">...</div>
    <div class="card-meta">...</div>
  </div>
</div>
```

---

## 2. CSS Classes

### 2.1 `.card` (base)

| Property | Value | Token |
|---|---|---|
| `background` | `var(--bg-surface)` | -- |
| `border` | `2px solid var(--text-primary)` | Strong contrast border |
| `border-radius` | `var(--radius-md)` | `16px` |
| `padding` | `var(--space-6)` | `24px` |
| `box-shadow` | `var(--shadow-md)` | `4px 4px 0 var(--border-default)` |
| `transition` | `transform var(--motion-instant) linear, box-shadow var(--motion-instant) linear, border-color var(--motion-fast) var(--ease-out), opacity var(--motion-fast) var(--ease-out), filter var(--motion-fast) var(--ease-out)` | For grid-dimming animations |

### 2.2 `.card-interactive`

Extends `.card` with cursor and hover/active behavior.

| Property | Value |
|---|---|
| `cursor` | `pointer` |
| `transition` | `transform var(--motion-instant) linear, box-shadow var(--motion-instant) linear, border-color var(--motion-fast) var(--ease-out)` |
| `will-change` | `transform` |

### 2.3 `.card-title`

| Property | Value | Token |
|---|---|---|
| `font-size` | `0.9375rem` | 15px |
| `font-weight` | `620` | -- |
| `letter-spacing` | `var(--tracking-tight)` | `-0.02em` |
| `margin-bottom` | `var(--space-2)` | `8px` |

### 2.4 `.card-desc`

| Property | Value | Token |
|---|---|---|
| `font-size` | `0.8125rem` | 13px |
| `color` | `var(--text-secondary)` | -- |
| `line-height` | `1.55` | -- |

### 2.5 `.card-meta`

| Property | Value | Token |
|---|---|---|
| `font-size` | `0.75rem` | 12px |
| `font-family` | `var(--font-mono)` | -- |
| `color` | `var(--text-muted)` | -- |
| `margin-top` | `var(--space-4)` | `16px` |
| `padding-top` | `var(--space-4)` | `16px` |
| `border-top` | `2px solid var(--border-subtle)` | -- |

### 2.6 `.card-featured` (accent top border)

| Property | Value | Token |
|---|---|---|
| `border-top` | `3px solid var(--accent-primary)` | Pink by default |

Featured color overrides:

| Class | `border-top-color` |
|---|---|
| `.card-featured` (default) | `var(--accent-primary)` |
| `.card-featured-red` | `var(--accent-danger)` |
| `.card-featured-gold` | `var(--accent-gold)` |
| `.card-featured-cyan` | `var(--accent-cyan)` |
| `.card-featured-green` | `var(--accent-green)` |
| `.card-featured-purple` | `var(--accent-purple)` |

### 2.7 `.card-accent-*` (colored shadows)

| Class | `box-shadow` (rest) | `box-shadow` (hover) |
|---|---|---|
| `.card-accent-pink` | `var(--shadow-pink)` = `4px 4px 0 var(--accent-primary)` | `6px 6px 0 var(--accent-primary)` |
| `.card-accent-gold` | `var(--shadow-gold)` = `4px 4px 0 var(--accent-gold)` | `6px 6px 0 var(--accent-gold)` |
| `.card-accent-cyan` | `var(--shadow-cyan)` = `4px 4px 0 var(--accent-cyan)` | `6px 6px 0 var(--accent-cyan)` |
| `.card-accent-green` | `var(--shadow-green)` = `4px 4px 0 var(--accent-green)` | `6px 6px 0 var(--accent-green)` |
| `.card-accent-purple` | `var(--shadow-purple)` = `4px 4px 0 var(--accent-purple)` | `6px 6px 0 var(--accent-purple)` |

### 2.8 `.card-compact`

| Property | Value | Token |
|---|---|---|
| `padding` | `var(--space-4)` | `16px` (instead of 24px) |

Child override: `.card-compact .card-title` has `font-size: 0.8125rem` (13px instead of 15px).

---

## 3. States

### 3.1 Default (rest) -- `.card-interactive`

| Property | Value |
|---|---|
| `box-shadow` | `var(--shadow-md)` = `4px 4px 0 var(--border-default)` |
| `transform` | `none` |

### 3.2 Hover -- `.card-interactive:hover`

| Property | Value |
|---|---|
| `transform` | `translate(-4px, -4px)` |
| `box-shadow` | `var(--shadow-lg)` = `8px 8px 0 var(--border-default)` |
| `border-color` | `var(--border-strong)` |
| `z-index` | `10` |

### 3.3 Active -- `.card-interactive:active`

| Property | Value |
|---|---|
| `transform` | `translate(2px, 2px)` |
| `box-shadow` | `0 0 0 var(--border-default)` (shadow collapses) |

### 3.4 Grid Dimming (sibling cards when one is hovered)

When a `.card-interactive` is hovered inside a grid, non-hovered `.card` siblings dim:

| Property | Value |
|---|---|
| `opacity` | `0.7` |
| `transform` | `translate(2px, 2px)` |
| `box-shadow` | `0 0 0 var(--border-default)` |
| `filter` | `grayscale(0.8)` |

CSS selector: `.grid-2:has(.card-interactive:hover) .card:not(:hover)` (and `.grid-3`, `.grid-4`).

---

## 4. The Card Lift/Press Pattern

Cards use a larger lift/press range than buttons because they are bigger elements:

1. **Rest**: `--shadow-md` (4px 4px offset) -- standard elevation.
2. **Hover**: `translate(-4px, -4px)` + `--shadow-lg` (8px 8px offset) -- card lifts away from shadow, creating the illusion of 3D displacement. The negative translate moves up-left to expose the growing shadow below-right.
3. **Active/Press**: `translate(2px, 2px)` + shadow collapses to `0 0 0` -- card slams flat into the surface.

---

## 5. Responsive Behavior

### Viewport Breakpoints

At `max-width: 768px`:
- `.card` gets `padding: var(--space-4)` (16px instead of 24px)

### Grid Responsive

Cards within `.grid-2`, `.grid-3`, `.grid-4` collapse to single-column at `max-width: 768px` viewport and at `@container (max-width: 540px)` container query.

---

## 6. Accessibility

- Interactive cards (`card-interactive`) should use `<a>` elements if they navigate, or `<button>`/`role="button"` if they trigger actions.
- If the entire card is clickable, use a single wrapping `<a>` or apply `tabindex="0"` and keyboard handlers (`Enter`/`Space`) to the card div.
- Card content (title, desc, meta) should use semantic HTML where appropriate.
- The grid dimming effect is purely visual enhancement -- it does not affect screen reader behavior.
- Focus should be visible via the global `:focus-visible` rule.

---

## 7. Token Dependencies

### Tier 2 (Semantic)

- `--bg-surface`, `--text-primary`, `--text-secondary`, `--text-muted`
- `--border-default`, `--border-strong`, `--border-subtle`
- `--shadow-md`, `--shadow-lg`
- `--shadow-pink`, `--shadow-gold`, `--shadow-cyan`, `--shadow-green`, `--shadow-purple`
- `--accent-primary`, `--accent-danger`, `--accent-gold`, `--accent-cyan`, `--accent-green`, `--accent-purple`

### Tier 3 (Component)

- `--radius-md` (`16px`)
- `--space-2` (`8px`), `--space-4` (`16px`), `--space-6` (`24px`)
- `--font-mono`
- `--tracking-tight` (`-0.02em`)
- `--motion-instant` (`100ms`), `--motion-fast` (`160ms`)
- `--ease-out`, `--ease-smooth`

---

## 8. Test Specification

### 8.1 Computed Style Assertions

- `.card` has `border-radius` resolving to `16px`
- `.card` has `border: 2px solid` with color matching `--text-primary`
- `.card` has `padding` resolving to `24px`
- `.card-compact` has `padding` resolving to `16px`
- `.card` has `box-shadow` matching `--shadow-md` resolved value
- `.card-featured` has `border-top-width: 3px`
- `.card-featured` border-top-color matches `--accent-primary` resolved value
- `.card-featured-cyan` border-top-color matches `--accent-cyan` resolved value

### 8.2 Interaction Assertions

- `.card-interactive:hover` has `transform: translate(-4px, -4px)` and `box-shadow` matching `--shadow-lg`
- `.card-interactive:active` has `transform: translate(2px, 2px)` and shadow at `0 0 0`
- Grid dimming: when one card is hovered, non-hovered siblings have `opacity: 0.7`, `filter: grayscale(0.8)`
- `.card-accent-pink:hover` has `box-shadow: 6px 6px 0` with color matching `--accent-primary`

### 8.3 Visual Regression Scenarios

- Base card (light mode)
- Interactive card in default, hover, and active states
- Featured card with all 6 color variants
- Compact card vs. standard card
- 3-card grid with reactive dimming (hover on middle card)
- Accent-color shadow cards (all 5 colors)
- Cards at 768px (mobile padding)
- Dark mode comparison

### 8.4 Reduced Motion Compliance

- With `prefers-reduced-motion: reduce`, all transitions resolve in 0.01ms

---

## 9. Implementation CSS

```css
@layer component {
  .card {
    background: var(--bg-surface);
    border: 2px solid var(--text-primary);
    border-radius: var(--radius-md);
    padding: var(--space-6);
    box-shadow: var(--shadow-md);
    transition: transform var(--motion-instant) linear,
                box-shadow var(--motion-instant) linear,
                border-color var(--motion-fast) var(--ease-out),
                opacity var(--motion-fast) var(--ease-out),
                filter var(--motion-fast) var(--ease-out);
  }

  .card-interactive {
    cursor: pointer;
    transition: transform var(--motion-instant) linear,
                box-shadow var(--motion-instant) linear,
                border-color var(--motion-fast) var(--ease-out);
    will-change: transform;
  }
  .card-interactive:hover {
    transform: translate(-4px, -4px);
    box-shadow: var(--shadow-lg);
    border-color: var(--border-strong);
    z-index: 10;
  }
  .card-interactive:active {
    transform: translate(2px, 2px);
    box-shadow: 0 0 0 var(--border-default);
  }

  .card-title {
    font-size: 0.9375rem;
    font-weight: 620;
    letter-spacing: var(--tracking-tight);
    margin-bottom: var(--space-2);
  }

  .card-desc {
    font-size: 0.8125rem;
    color: var(--text-secondary);
    line-height: 1.55;
  }

  .card-meta {
    font-size: 0.75rem;
    font-family: var(--font-mono);
    color: var(--text-muted);
    margin-top: var(--space-4);
    padding-top: var(--space-4);
    border-top: 2px solid var(--border-subtle);
  }

  .card-featured {
    border-top: 3px solid var(--accent-primary);
  }
  .card-featured-red { border-top-color: var(--accent-danger); }
  .card-featured-gold { border-top-color: var(--accent-gold); }
  .card-featured-cyan { border-top-color: var(--accent-cyan); }
  .card-featured-green { border-top-color: var(--accent-green); }
  .card-featured-purple { border-top-color: var(--accent-purple); }

  .card-accent-pink { box-shadow: var(--shadow-pink); }
  .card-accent-pink:hover { box-shadow: 6px 6px 0 var(--accent-primary); }
  .card-accent-gold { box-shadow: var(--shadow-gold); }
  .card-accent-gold:hover { box-shadow: 6px 6px 0 var(--accent-gold); }
  .card-accent-cyan { box-shadow: var(--shadow-cyan); }
  .card-accent-cyan:hover { box-shadow: 6px 6px 0 var(--accent-cyan); }
  .card-accent-green { box-shadow: var(--shadow-green); }
  .card-accent-green:hover { box-shadow: 6px 6px 0 var(--accent-green); }
  .card-accent-purple { box-shadow: var(--shadow-purple); }
  .card-accent-purple:hover { box-shadow: 6px 6px 0 var(--accent-purple); }

  .card-compact {
    padding: var(--space-4);
  }
  .card-compact .card-title {
    font-size: 0.8125rem;
  }
}
```
