---
title: "Button"
date: 2026-03-02
type: spec
scope: mvp
status: active
---

# Button

> Primary interactive control with 8 color variants (including secondary and ghost), 3 sizes, icon-only mode, and loading state with spinner. Implements the full lift/press interaction pattern: base shadow at rest, shadow escalation + translateY(-2px) on hover, translate(2px, 2px) + shadow collapse on active.

Cross-references: [[shadows]] (lift/press pattern, shadow-sm/md), [[token-tiers]] (button tokens in Tier 3), [[typography]] (UI text scale for sizing), [[radius]] (uses `--radius-md`), [[spacing]] (control height tokens).

Visual reference: Section "05 — Components", subsection "Buttons" in `design-reference.html` (lines ~5407-5518).

---

## 1. HTML Structure

### 1.1 Color Variants (all at medium size)

```html
<button class="btn btn-md btn-primary">Primary</button>
<button class="btn btn-md btn-danger">Danger</button>
<button class="btn btn-md btn-gold">Highlight</button>
<button class="btn btn-md btn-cyan">Cyan</button>
<button class="btn btn-md btn-green">Success</button>
<button class="btn btn-md btn-purple">Purple</button>
<button class="btn btn-md btn-secondary">Secondary</button>
<button class="btn btn-md btn-ghost">Ghost</button>
```

### 1.2 Size Variants

```html
<button class="btn btn-sm btn-primary">Small</button>
<button class="btn btn-md btn-primary">Medium</button>
<button class="btn btn-lg btn-primary">Large</button>
```

### 1.3 Icon Buttons

```html
<button class="btn btn-icon btn-sm btn-primary">
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
    <line x1="12" y1="5" x2="12" y2="19" />
    <line x1="5" y1="12" x2="19" y2="12" />
  </svg>
</button>
<button class="btn btn-icon btn-md btn-secondary">
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
    <circle cx="11" cy="11" r="8" />
    <line x1="21" y1="21" x2="16.65" y2="16.65" />
  </svg>
</button>
<button class="btn btn-icon btn-md btn-ghost">
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
    <path d="M12 20h9" />
    <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
  </svg>
</button>
```

### 1.4 Loading State

```html
<button class="btn btn-md btn-primary btn-loading">Saving</button>
<button class="btn btn-md btn-secondary btn-loading">Loading</button>
<button class="btn btn-md btn-danger btn-loading">Deleting</button>
<button class="btn btn-md btn-gold btn-loading">Processing</button>
```

### 1.5 Disabled State

```html
<button class="btn btn-md btn-primary" disabled>Disabled</button>
```

### 1.6 Button States (static demo)

```html
<button class="btn btn-md btn-primary">Default</button>
<button class="btn btn-md btn-primary force-hover">Hover</button>
<button class="btn btn-md btn-primary force-active">Active</button>
<button class="btn btn-md btn-primary force-focus">Focus</button>
<button class="btn btn-md btn-primary" disabled>Disabled</button>
```

### 1.7 Button with Icon and Text

```html
<button class="btn btn-md btn-primary">
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
    <line x1="12" y1="5" x2="12" y2="19" />
    <line x1="5" y1="12" x2="19" y2="12" />
  </svg>
  Add Item
</button>
```

---

## 2. CSS Classes

### 2.1 `.btn` (base)

| Property | Value | Token |
|---|---|---|
| `display` | `inline-flex` | -- |
| `align-items` | `center` | -- |
| `justify-content` | `center` | -- |
| `gap` | `var(--btn-gap)` | `var(--space-1-5)` = `6px` |
| `font-family` | `var(--font-sans)` | -- |
| `font-weight` | `700` | -- |
| `border` | `2px solid var(--border-default)` | `--border-default` |
| `cursor` | `pointer` | -- |
| `border-radius` | `var(--radius-md)` | `16px` |
| `white-space` | `nowrap` | -- |
| `transition` | `transform var(--motion-instant) linear, background var(--motion-fast) var(--ease-out), box-shadow var(--motion-instant) linear` | -- |
| `will-change` | `transform` | -- |
| `box-shadow` | `var(--shadow-sm)` | `2px 2px 0 var(--border-default)` |

### 2.2 Size Variants

| Class | `height` | `padding` | `font-size` | Tokens |
|---|---|---|---|---|
| `.btn-sm` | `var(--control-sm)` = `32px` | `0 var(--space-3)` = `0 12px` | `var(--ui-text-sm)` = `13px` | -- |
| `.btn-md` | `var(--control-md)` = `36px` | `0 var(--space-4)` = `0 16px` | `var(--ui-text-md)` = `14px` | -- |
| `.btn-lg` | `var(--control-lg)` = `44px` | `0 var(--space-6)` = `0 24px` | `var(--ui-text-lg)` = `15px` | -- |

### 2.3 Color Variants

| Class | `background` | `color` | Hover `background` |
|---|---|---|---|
| `.btn-primary` | `var(--btn-primary-bg)` | `var(--btn-primary-text)` | `var(--accent-primary-hover)` |
| `.btn-danger` | `var(--btn-danger-bg)` | `var(--btn-danger-text)` | `var(--accent-danger-hover)` |
| `.btn-gold` | `var(--btn-gold-bg)` | `var(--btn-gold-text)` | `var(--accent-gold-hover)` |
| `.btn-cyan` | `var(--btn-cyan-bg)` | `var(--btn-cyan-text)` | `var(--accent-cyan-hover)` |
| `.btn-green` | `var(--btn-green-bg)` | `var(--btn-green-text)` | `var(--accent-green-hover)` |
| `.btn-purple` | `var(--btn-purple-bg)` | `var(--btn-purple-text)` | `var(--accent-purple-hover)` |
| `.btn-secondary` | `var(--bg-surface)` | `var(--text-primary)` | `var(--bg-muted)` |
| `.btn-ghost` | `transparent` | `var(--text-primary)` | `var(--bg-subtle)` |

Button token resolution:
- `--btn-primary-bg` = `var(--accent-primary)` = `oklch(0.640 0.270 350)` (light)
- `--btn-primary-text` = `var(--text-on-accent)` = `oklch(1.00 0.000 0)` (white)
- `--btn-gold-text` = `var(--text-on-gold)` = `oklch(0.220 0.020 70)` (dark text on gold)

### 2.4 `.btn-ghost` Special Properties

| Property | Value |
|---|---|
| `background` | `transparent` |
| `border-color` | `transparent` |
| `box-shadow` | `none` |
| `:hover background` | `var(--bg-subtle)` |
| `:hover border-color` | `var(--border-subtle)` |
| `:hover box-shadow` | `var(--shadow-sm)` |

### 2.5 `.btn-icon` (icon-only button)

| Property | Value |
|---|---|
| `width` | `36px` (default) |
| `padding` | `0` |
| `justify-content` | `center` |

Size overrides:
- `.btn-icon.btn-sm` width: `28px`
- `.btn-icon.btn-lg` width: `44px`

SVG sizing: `width: 16px; height: 16px`

### 2.6 `.btn-loading` (loading state with spinner)

| Property | Value |
|---|---|
| `pointer-events` | `none` |
| `position` | `relative` |
| `color` | `transparent !important` (hides text) |

Spinner (via `::after` pseudo-element):

| Property | Value |
|---|---|
| `content` | `""` |
| `position` | `absolute` |
| `inset` | `0` |
| `margin` | `auto` |
| `width` | `18px` |
| `height` | `18px` |
| `border` | `2px solid var(--text-on-accent)` |
| `border-right-color` | `transparent` |
| `border-radius` | `50%` |
| `animation` | `spin 0.6s linear infinite` |

Loading spinner color overrides:
- `.btn-secondary.btn-loading::after`, `.btn-ghost.btn-loading::after`: `border-color: var(--border-default); border-right-color: transparent;`
- `.btn-gold.btn-loading::after`: `border-color: var(--text-on-gold); border-right-color: transparent;`

Spin keyframes:

```css
@keyframes spin {
  to { transform: rotate(360deg); }
}
```

---

## 3. States

### 3.1 Default (rest)

| Property | Value |
|---|---|
| `box-shadow` | `var(--shadow-sm)` = `2px 2px 0 var(--border-default)` |
| `transform` | `none` |

### 3.2 Hover

| Property | Value |
|---|---|
| `transform` | `translateY(-2px)` |
| `box-shadow` | `var(--shadow-md)` = `4px 4px 0 var(--border-default)` |
| `background` | Changes to the `-hover` variant (e.g., `--accent-primary-hover`) |

### 3.3 Active (pressed)

| Property | Value |
|---|---|
| `transform` | `translate(2px, 2px)` |
| `box-shadow` | `0 0 0 var(--border-default)` (shadow collapses to nothing) |

### 3.4 Focus

| Property | Value |
|---|---|
| `outline` | `2px solid var(--focus-ring)` |
| `outline-offset` | `-2px` |

Focus is handled by the global `:focus-visible` rule in the reset layer.

### 3.5 Disabled

| Property | Value |
|---|---|
| `opacity` | `0.4` |
| `cursor` | `not-allowed` |
| `pointer-events` | `none` |
| `transform` | `none !important` |
| `box-shadow` | `var(--shadow-sm) !important` |

### 3.6 Loading

| Property | Value |
|---|---|
| `pointer-events` | `none` |
| `color` | `transparent !important` |
| Spinner overlay | `::after` pseudo-element with rotating border |

### 3.7 Force-state classes (for demos)

| Class | Effect |
|---|---|
| `.force-hover` | `transform: translateY(-2px); box-shadow: var(--shadow-md)` |
| `.btn-primary.force-hover` | Additionally: `background: var(--accent-primary-hover)` |
| `.force-active` | `transform: translate(2px, 2px); box-shadow: 0 0 0 var(--border-default)` |
| `.force-focus` | `outline: 2px solid var(--focus-ring); outline-offset: -2px` |

---

## 4. The Lift/Press Interaction Pattern

This is the signature neo-brutalist interaction for buttons:

1. **Rest**: Button sits with `--shadow-sm` (2px 2px offset). Appears slightly elevated.
2. **Hover**: Button lifts up (`translateY(-2px)`) and shadow escalates to `--shadow-md` (4px 4px offset). Creates the illusion of lifting off the surface.
3. **Active/Press**: Button slams down (`translate(2px, 2px)`) and shadow collapses to `0 0 0`. The 2px,2px translate matches the shadow offset, creating the illusion of pressing flat into the surface.
4. **Release**: Snaps back to rest state.

Timing: `transform` and `box-shadow` use `var(--motion-instant)` (100ms) with `linear` easing for instant tactile feel. `background` color transitions use `var(--motion-fast)` (160ms) with `var(--ease-out)` for smooth color shifts.

---

## 5. Responsive Behavior

### Viewport Breakpoints

At `max-width: 480px`:
- `.btn-row` changes to `flex-direction: column`
- `.btn-row .btn` gets `width: 100%; justify-content: center` (full-width stacking)

### Touch Targets

At `@media (pointer: coarse)`:
- `.btn-sm` gets `min-height: 44px; min-width: 44px` (WCAG touch target minimum)

---

## 6. Accessibility

- Use `<button>` elements for actions and `<a>` for navigation. Never use `<div>` or `<span>` as buttons.
- Disabled buttons use the native `disabled` attribute, which removes them from the tab order and announces "dimmed" to screen readers.
- Icon-only buttons must have `aria-label` describing the action: `<button class="btn btn-icon btn-sm btn-primary" aria-label="Add item">`.
- Loading buttons should have `aria-busy="true"` and optionally `aria-label="Saving..."` to communicate the loading state.
- Focus is visible via the global `:focus-visible` rule (2px solid `--focus-ring` with -2px offset).
- Button text must be descriptive ("Save changes" not "Click here").

---

## 7. Token Dependencies

### Tier 2 (Semantic)

- `--border-default` (border, shadow color)
- `--shadow-sm` (`2px 2px 0 var(--border-default)`)
- `--shadow-md` (`4px 4px 0 var(--border-default)`)
- `--accent-primary`, `--accent-primary-hover`
- `--accent-danger`, `--accent-danger-hover`
- `--accent-gold`, `--accent-gold-hover`
- `--accent-cyan`, `--accent-cyan-hover`
- `--accent-green`, `--accent-green-hover`
- `--accent-purple`, `--accent-purple-hover`
- `--text-on-accent`, `--text-on-gold`
- `--text-primary`
- `--bg-surface`, `--bg-muted`, `--bg-subtle`
- `--border-subtle`
- `--focus-ring`

### Tier 3 (Component)

- `--btn-primary-bg`, `--btn-primary-text`
- `--btn-danger-bg`, `--btn-danger-text`
- `--btn-gold-bg`, `--btn-gold-text`
- `--btn-cyan-bg`, `--btn-cyan-text`
- `--btn-green-bg`, `--btn-green-text`
- `--btn-purple-bg`, `--btn-purple-text`
- `--btn-gap` (`var(--space-1-5)` = `6px`)
- `--font-sans`
- `--radius-md` (`16px`)
- `--control-sm` (`32px`), `--control-md` (`36px`), `--control-lg` (`44px`)
- `--ui-text-sm` (`13px`), `--ui-text-md` (`14px`), `--ui-text-lg` (`15px`)
- `--space-3` (`12px`), `--space-4` (`16px`), `--space-6` (`24px`)
- `--motion-instant` (`100ms`), `--motion-fast` (`160ms`)
- `--ease-out` (`cubic-bezier(0.16, 1, 0.3, 1)`)

---

## 8. Test Specification

### 8.1 Computed Style Assertions

- `.btn` has `border-radius` resolving to `16px`
- `.btn` has `border: 2px solid` with color matching `--border-default`
- `.btn` has `font-weight: 700`
- `.btn-sm` has `height: 32px`
- `.btn-md` has `height: 36px`
- `.btn-lg` has `height: 44px`
- `.btn-primary` background matches `--accent-primary` resolved value
- `.btn-gold` color matches `--text-on-gold` resolved value
- `.btn:disabled` has `opacity: 0.4` and `pointer-events: none`
- `.btn-ghost` has `background-color: transparent` and `box-shadow: none`

### 8.2 Interaction Assertions

- `.btn:hover` has `transform: translateY(-2px)` and `box-shadow` matching `--shadow-md`
- `.btn:active` has `transform: translate(2px, 2px)` and `box-shadow: 0 0 0 <border-default-color>`
- `.btn-primary:hover` background matches `--accent-primary-hover` resolved value
- `.btn-ghost:hover` has `background` matching `--bg-subtle` and `box-shadow` matching `--shadow-sm`
- `.btn:disabled` does not change transform on hover or active
- `.btn-loading` has `pointer-events: none`
- `.btn-loading::after` exists and has `animation` containing `spin`

### 8.3 Visual Regression Scenarios

- All 8 variants at medium size in a row (light mode)
- All 8 variants at medium size in a row (dark mode)
- All 3 sizes (sm, md, lg) side-by-side
- All 5 states (default, hover, active, focus, disabled) of primary button
- Icon buttons (3 variants)
- Loading buttons (4 variants)
- Full-width stacking at 480px viewport
- Ghost button hover gaining shadow and border

### 8.4 Reduced Motion Compliance

- With `prefers-reduced-motion: reduce`, hover/active transitions complete in 0.01ms
- Loading spinner animation completes in 0.01ms (effectively static)

---

## 9. Implementation CSS

```css
@layer component {
  @keyframes spin {
    to { transform: rotate(360deg); }
  }

  .btn {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: var(--btn-gap);
    font-family: var(--font-sans);
    font-weight: 700;
    border: 2px solid var(--border-default);
    cursor: pointer;
    border-radius: var(--radius-md);
    white-space: nowrap;
    transition: transform var(--motion-instant) linear,
                background var(--motion-fast) var(--ease-out),
                box-shadow var(--motion-instant) linear;
    will-change: transform;
    box-shadow: var(--shadow-sm);
  }

  .btn:hover {
    transform: translateY(-2px);
    box-shadow: var(--shadow-md);
  }

  .btn:active {
    transform: translate(2px, 2px);
    box-shadow: 0 0 0 var(--border-default);
  }

  .btn:disabled {
    opacity: 0.4;
    cursor: not-allowed;
    pointer-events: none;
    transform: none !important;
    box-shadow: var(--shadow-sm) !important;
  }

  .btn-sm { height: var(--control-sm); padding: 0 var(--space-3); font-size: var(--ui-text-sm); }
  .btn-md { height: var(--control-md); padding: 0 var(--space-4); font-size: var(--ui-text-md); }
  .btn-lg { height: var(--control-lg); padding: 0 var(--space-6); font-size: var(--ui-text-lg); }

  .btn-primary { background: var(--btn-primary-bg); color: var(--btn-primary-text); }
  .btn-primary:hover { background: var(--accent-primary-hover); }
  .btn-danger { background: var(--btn-danger-bg); color: var(--btn-danger-text); }
  .btn-danger:hover { background: var(--accent-danger-hover); }
  .btn-gold { background: var(--btn-gold-bg); color: var(--btn-gold-text); }
  .btn-gold:hover { background: var(--accent-gold-hover); }
  .btn-cyan { background: var(--btn-cyan-bg); color: var(--btn-cyan-text); }
  .btn-cyan:hover { background: var(--accent-cyan-hover); }
  .btn-green { background: var(--btn-green-bg); color: var(--btn-green-text); }
  .btn-green:hover { background: var(--accent-green-hover); }
  .btn-purple { background: var(--btn-purple-bg); color: var(--btn-purple-text); }
  .btn-purple:hover { background: var(--accent-purple-hover); }
  .btn-secondary { background: var(--bg-surface); color: var(--text-primary); }
  .btn-secondary:hover { background: var(--bg-muted); }
  .btn-ghost { background: transparent; color: var(--text-primary); border-color: transparent; box-shadow: none; }
  .btn-ghost:hover { background: var(--bg-subtle); border-color: var(--border-subtle); box-shadow: var(--shadow-sm); }

  .btn-icon {
    width: 36px;
    padding: 0;
    justify-content: center;
  }
  .btn-icon.btn-sm { width: 28px; }
  .btn-icon.btn-lg { width: 44px; }
  .btn-icon svg {
    width: 16px;
    height: 16px;
  }

  .btn-loading {
    pointer-events: none;
    position: relative;
    color: transparent !important;
  }
  .btn-loading::after {
    content: "";
    position: absolute;
    inset: 0;
    margin: auto;
    width: 18px;
    height: 18px;
    border: 2px solid var(--text-on-accent);
    border-right-color: transparent;
    border-radius: 50%;
    animation: spin 0.6s linear infinite;
  }
  .btn-secondary.btn-loading::after,
  .btn-ghost.btn-loading::after {
    border-color: var(--border-default);
    border-right-color: transparent;
  }
  .btn-gold.btn-loading::after {
    border-color: var(--text-on-gold);
    border-right-color: transparent;
  }
}
```
