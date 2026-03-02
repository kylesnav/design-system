# Bento Grid

> Responsive multi-column feature grid for showcasing content at varied sizes and weights. Starts at 4 columns on wide screens, collapses to 2 columns at `container-width: 780px`, and falls to 1 column at `container-width: 480px`. Span modifier classes allow items to occupy multiple columns or rows. Grid cells are typically `.card` or `.card card-featured` components. Uses CSS container queries (not viewport queries) for intrinsic responsiveness.

Cross-references: [[card]] (grid cells are `.card` components), [[token-tiers]] (`--space-4` gap).

Visual reference: Section "Bonus — Sample Compositions", subsection "Bento Grid" in `design-reference.html` (lines ~6891–6925 HTML, CSS at lines ~3534–3559).

---

## 1. HTML Structure

### 1.1 Full Bento Grid Demo

```html
<div class="bento-grid">
  <!-- Featured item spanning 2 columns and 2 rows -->
  <div class="card card-featured bento-span-2 bento-tall"
       style="display:flex;flex-direction:column;justify-content:space-between">
    <div>
      <div class="card-title" style="font-size:var(--step-1)">Design System</div>
      <div class="card-desc">
        OKLCH tokens, neo-brutalist components, and signature interactions —
        all in one self-contained file.
      </div>
    </div>
    <div class="badge badge-pink" style="align-self:flex-start">v0.4.5</div>
  </div>

  <!-- Standard single-cell cards -->
  <div class="card card-accent-gold">
    <div class="kpi-value" style="color:var(--accent-gold)">42</div>
    <div class="kpi-label">Color Primitives</div>
  </div>
  <div class="card card-accent-cyan">
    <div class="kpi-value" style="color:var(--accent-cyan)">3</div>
    <div class="kpi-label">Token Tiers</div>
  </div>

  <!-- Wide card spanning 2 columns -->
  <div class="card card-accent-green bento-span-2">
    <div class="card-title">Motion System</div>
    <div class="card-desc">
      5 duration tokens, 5 easing curves, scroll-driven animations,
      spring physics, and 59 CSS animations.
    </div>
  </div>

  <!-- Standard cell -->
  <div class="card card-accent-purple"
       style="display:flex;align-items:center;justify-content:center">
    <div style="text-align:center">
      <div style="font-size:var(--step-2);font-weight:800;color:var(--accent-purple)">7</div>
      <div style="font-size:var(--ui-text-xs);color:var(--text-muted)">Color Families</div>
    </div>
  </div>
  <div class="card" style="background:var(--bg-subtle)">
    <div class="card-title">OKLCH Only</div>
    <div class="card-desc">
      No hex, no rgb, no hsl. Perceptually uniform color throughout.
    </div>
  </div>
</div>
```

### 1.2 Minimal 4-cell Grid

```html
<div class="bento-grid">
  <div class="card bento-span-2">Wide Card</div>
  <div class="card">Cell A</div>
  <div class="card">Cell B</div>
</div>
```

---

## 2. CSS Classes

### 2.1 `.bento-grid` (container)

| Property | Value | Token |
|---|---|---|
| `display` | `grid` | -- |
| `grid-template-columns` | `repeat(4, 1fr)` | 4 equal columns on wide screens |
| `grid-auto-rows` | `minmax(120px, auto)` | Min row height 120px; grows with content |
| `gap` | `var(--space-4)` | `16px` on all sides |
| `container-type` | `inline-size` | Enables container queries for self-responsive behavior |

### 2.2 Span Modifier Classes

| Class | Effect |
|---|---|
| `.bento-span-2` | `grid-column: span 2` — spans 2 columns |
| `.bento-span-3` | `grid-column: span 3` — spans 3 columns |
| `.bento-tall` | `grid-row: span 2` — spans 2 rows |
| `.bento-wide` | `grid-column: span 2; grid-row: span 2` — spans 2 columns and 2 rows |

### 2.3 Container Query Breakpoints

**At `max-width: 780px` (container width, not viewport):**

```css
@container (max-width: 780px) {
  .bento-grid { grid-template-columns: repeat(2, 1fr); }
  .bento-span-3 { grid-column: span 2; } /* cap at 2 columns */
}
```

**At `max-width: 480px` (container width):**

```css
@container (max-width: 480px) {
  .bento-grid { grid-template-columns: 1fr; }
  .bento-span-2, .bento-span-3, .bento-wide { grid-column: span 1; }
  .bento-tall { grid-row: span 1; }
}
```

---

## 3. Variants

The bento grid itself has no color or style variants — it is a pure layout container. Variation comes from the child components placed within it:

- Standard `.card` cells
- `.card card-featured` with accent top border
- `.card card-accent-*` with colored shadow
- Any content placed freely inside cells (KPI numbers, charts, images, etc.)

---

## 4. Responsive Behavior

| Breakpoint | Mechanism | Columns |
|---|---|---|
| Wide (>780px container) | Default | 4 columns |
| Medium (≤780px container) | `@container (max-width: 780px)` | 2 columns; `.bento-span-3` caps at 2 |
| Narrow (≤480px container) | `@container (max-width: 480px)` | 1 column; all spans collapse to 1; `.bento-tall` row span collapses to 1 |

The breakpoints respond to the **container width**, not the viewport width, because `.bento-grid` has `container-type: inline-size`. This makes it intrinsically responsive — it responds to however wide its parent makes it, not the full browser viewport.

---

## 5. States

The `.bento-grid` itself has no interactive states. Child cards may have hover/active states per their own spec. The reactive grid dimming pattern from `.card` applies when child `.card-interactive` elements are hovered:

```css
.bento-grid:has(.card-interactive:hover) .card:not(:hover) {
  opacity: 0.7;
  transform: translate(2px, 2px);
  box-shadow: 0 0 0 var(--border-default);
  filter: grayscale(0.8);
}
```

Note: This selector uses `.grid-2`, `.grid-3`, `.grid-4` in the card spec — apply the same pattern with `.bento-grid` for consistency.

---

## 6. Accessibility

- The bento grid is a presentational layout — it does not require ARIA roles.
- Screen readers will encounter cells in DOM order (row by row, left to right). Ensure the visual order and reading order convey the same hierarchy.
- Featured items that span multiple cells should not rely on their visual size alone to convey importance — use heading levels inside cells (`<h2>`, `<h3>`) appropriately.
- Interactive cells must be keyboard-reachable in a logical tab order matching the visual layout.

---

## 7. Token Dependencies

### Tier 3 (Component)

- `--space-4` (`16px`) — grid gap

### Not tokenized

- `grid-auto-rows: minmax(120px, auto)` — the `120px` minimum row height is a hardcoded value specific to the bento grid layout. It is not a CSS custom property in the reference.

---

## 8. Test Specification

### 8.1 Computed Style Assertions

- `.bento-grid` has `display: grid`
- `.bento-grid` has `grid-template-columns` resolving to 4 equal `fr` units (at wide container width)
- `.bento-grid` has `gap` resolving to `16px`
- `.bento-grid` has `container-type: inline-size`
- `.bento-span-2` has `grid-column: span 2`
- `.bento-span-3` has `grid-column: span 3`
- `.bento-tall` has `grid-row: span 2`
- `.bento-wide` has `grid-column: span 2` and `grid-row: span 2`

### 8.2 Container Query Assertions

- At container width ≤ 780px: `.bento-grid` has `grid-template-columns` resolving to 2 equal `fr` units
- At container width ≤ 780px: `.bento-span-3` has `grid-column: span 2`
- At container width ≤ 480px: `.bento-grid` has `grid-template-columns` resolving to `1fr`
- At container width ≤ 480px: `.bento-span-2` has `grid-column: span 1`
- At container width ≤ 480px: `.bento-tall` has `grid-row: span 1`

### 8.3 Visual Regression Scenarios

- Full demo grid at 1200px container width (4 columns)
- Full demo grid at 700px container width (2 columns)
- Full demo grid at 360px container width (1 column)
- Dark mode at 4-column width

---

## 9. Implementation CSS

```css
@layer component {
  .bento-grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    grid-auto-rows: minmax(120px, auto);
    gap: var(--space-4);
    container-type: inline-size;
  }

  .bento-span-2 { grid-column: span 2; }
  .bento-span-3 { grid-column: span 3; }
  .bento-tall   { grid-row: span 2; }
  .bento-wide   { grid-column: span 2; grid-row: span 2; }

  @container (max-width: 780px) {
    .bento-grid  { grid-template-columns: repeat(2, 1fr); }
    .bento-span-3 { grid-column: span 2; }
  }

  @container (max-width: 480px) {
    .bento-grid  { grid-template-columns: 1fr; }
    .bento-span-2,
    .bento-span-3,
    .bento-wide  { grid-column: span 1; }
    .bento-tall  { grid-row: span 1; }
  }
}
```
