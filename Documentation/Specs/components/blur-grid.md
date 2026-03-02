# Blur Grid

> Signature CSS-only depth-of-field effect for card grids. When any card in the grid is hovered, all non-hovered siblings dim to 70% opacity and blur by 2px, simulating camera depth-of-field focus. No JavaScript — achieved entirely with the CSS `:has()` relational pseudo-class. Gated behind `@media (prefers-reduced-motion: no-preference)` so users who prefer reduced motion see no blur or transition.

Cross-references: [[card]] (`.blur-card` is always combined with `.card`), [[motion]] (blur/opacity transitions use `--motion-base` 240ms), [[shadows]] (card shadow unchanged by blur effect).

Visual reference: Section "11 — Signature Effects", subsection "Blur Focus Grid" in `design-reference.html` (lines ~6841–6867 HTML, CSS at lines ~671–678).

---

## 1. HTML Structure

### 1.1 Standard 2-column Blur Grid

```html
<div class="grid-2 blur-grid">
  <div class="blur-card card">
    <div class="card-title">Analytics Dashboard</div>
    <div class="card-desc">
      Real-time metrics visualization with interactive filtering
      and drill-down capabilities.
    </div>
    <span class="badge badge-pink badge-pop">Production</span>
  </div>
  <div class="blur-card card">
    <div class="card-title">Design Token Pipeline</div>
    <div class="card-desc">
      Automated generation from Figma variables to CSS custom properties
      via Style Dictionary.
    </div>
    <span class="badge badge-cyan badge-pop">Active</span>
  </div>
  <div class="blur-card card">
    <div class="card-title">Component Storybook</div>
    <div class="card-desc">
      Interactive documentation with visual testing, accessibility audits,
      and usage examples.
    </div>
    <span class="badge badge-pink badge-pop">Beta</span>
  </div>
  <div class="blur-card card">
    <div class="card-title">Marketing Site</div>
    <div class="card-desc">
      Brand-forward landing pages with scroll-driven narratives
      and view transitions.
    </div>
    <span class="badge badge-gold badge-pop">Planning</span>
  </div>
</div>
```

### 1.2 Pattern (any grid width)

```html
<div class="[grid-class] blur-grid">
  <div class="blur-card card">…</div>
  <div class="blur-card card">…</div>
  <div class="blur-card card">…</div>
</div>
```

The `.blur-grid` class is applied alongside whatever grid layout class is already used (`.grid-2`, `.grid-3`, etc.). It adds no grid properties of its own — it is purely a behavior hook.

---

## 2. CSS Classes

### 2.1 `.blur-grid` (parent hook)

`.blur-grid` itself has no CSS properties. It acts as a selector hook for the blur effect. The effect is triggered by hovering any `.blur-card` inside it.

### 2.2 `.blur-card` (individual card)

The transition definition lives on `.blur-card` (always active, whether or not blur-grid is hovering):

| Property | Value | Token |
|---|---|---|
| `transition` | `filter var(--motion-base) var(--ease-out), opacity var(--motion-base) var(--ease-out), border-color var(--motion-fast) var(--ease-out)` | -- |

- `filter` transition: `240ms var(--ease-out)`
- `opacity` transition: `240ms var(--ease-out)`
- `border-color` transition: `160ms var(--ease-out)` (separate timing for snappier border response)

### 2.3 Blur Effect Rule

Only active when `prefers-reduced-motion: no-preference`:

```css
@media (prefers-reduced-motion: no-preference) {
  .blur-grid:hover .blur-card:not(:hover) {
    filter: blur(2px);
    opacity: 0.7;
  }
}
```

Selector breakdown:
- `.blur-grid:hover` — the parent grid is in a hover state (i.e., the cursor is inside the grid)
- `.blur-card:not(:hover)` — any card that is NOT the one directly hovered

Effect values:
| Property | Value |
|---|---|
| `filter` | `blur(2px)` |
| `opacity` | `0.7` |

There is no explicit "focused card" rule — the hovered card simply receives no filter/opacity override, so it stays at `filter: none; opacity: 1` (its default).

---

## 3. Variants

There is one variant in the reference. The effect can be applied to any grid width by changing the parent grid class:

| Combination | Effect |
|---|---|
| `.grid-2.blur-grid` | 2-column grid with blur focus (as shown in reference) |
| `.grid-3.blur-grid` | 3-column grid with blur focus |
| `.grid-4.blur-grid` | 4-column grid with blur focus |

---

## 4. States

| State | Element | CSS Values |
|---|---|---|
| **Grid not hovered** | All `.blur-card` | `filter: none; opacity: 1` (defaults) |
| **Grid hovered, card is hovered** | `.blur-card:hover` | `filter: none; opacity: 1` (unchanged) |
| **Grid hovered, card is NOT hovered** | `.blur-card:not(:hover)` | `filter: blur(2px); opacity: 0.7` |
| **Reduced motion** | All | No filter or opacity change; transitions are suppressed |

---

## 5. Responsive Behavior

No breakpoint-specific changes to the blur effect. The blur scales with whatever grid layout is in use. On touch devices (`pointer: coarse`), `:hover` states do not persist — the blur effect will not appear during normal touch interaction, which is appropriate.

---

## 6. Accessibility

- The blur/dim effect is purely decorative — it does not hide or remove content from the DOM.
- Screen readers are unaffected by CSS `filter` and `opacity` changes.
- Under `prefers-reduced-motion: reduce`, the effect is completely suppressed (no transitions, no blur).
- Keyboard navigation: `:hover` does not respond to keyboard focus (`:focus` is a separate state). Keyboard users moving through the grid will not trigger the blur effect. This is acceptable — the effect is a mouse-pointer enhancement only. Consider adding a `:focus-within` rule on `.blur-grid` for keyboard parity if desired (not in the reference).
- Ensure `.blur-card` content always meets contrast requirements in its un-blurred state; the blurred state at 70% opacity is not a content state.

---

## 7. Token Dependencies

### Tier 3 (Component)

- `--motion-base` (`240ms`) — filter and opacity transition duration
- `--motion-fast` (`160ms`) — border-color transition duration
- `--ease-out` — easing for all transitions

### Not tokenized

- `blur(2px)` — the blur radius is a hardcoded value in the reference (not a CSS custom property)
- `0.7` — the dimmed opacity is hardcoded

---

## 8. Test Specification

### 8.1 Computed Style Assertions

- `.blur-card` has `transition` containing `filter 240ms` and `opacity 240ms`
- `.blur-card` has `transition` containing `border-color 160ms`
- At default (no hover): `.blur-card` has `filter: none` and `opacity: 1`

### 8.2 Interaction Assertions (with `prefers-reduced-motion: no-preference`)

- When cursor enters `.blur-grid`, non-hovered `.blur-card` elements gain `filter: blur(2px)` and `opacity: 0.7`
- The hovered `.blur-card` retains `filter: none` and `opacity: 1`
- When cursor leaves `.blur-grid`, all `.blur-card` elements return to `filter: none; opacity: 1`
- Transition completes in `240ms`

### 8.3 Reduced Motion Compliance

- With `prefers-reduced-motion: reduce`: hovering `.blur-grid` does NOT apply `filter: blur(2px)` or `opacity: 0.7` to non-hovered cards

### 8.4 Visual Regression Scenarios

- 2-column blur grid: rest state (no hover)
- 2-column blur grid: hover on top-left card (3 siblings blurred)
- 2-column blur grid: hover on bottom-right card (3 siblings blurred)
- Dark mode: hover state

---

## 9. Implementation CSS

```css
/* Transition always active (not motion-gated) */
@layer component {
  .blur-card {
    transition:
      filter var(--motion-base) var(--ease-out),
      opacity var(--motion-base) var(--ease-out),
      border-color var(--motion-fast) var(--ease-out);
  }
}

/* Blur effect only when motion is allowed */
@layer component {
  @media (prefers-reduced-motion: no-preference) {
    .blur-grid:hover .blur-card:not(:hover) {
      filter: blur(2px);
      opacity: 0.7;
    }
  }
}
```
