# Progress

> Track-and-fill progress bar with 5 color variants (pink, gold, cyan, green, purple). Features a bordered track with full-radius corners, a smooth fill transition, and an optional label row showing name and percentage. Uses the neo-brutalist 2px border style.

Cross-references: [[token-tiers]] (spacing, radius, accent tokens, motion tokens).

Visual reference: Section "PROGRESS BARS" in `design-reference.html` (lines ~3017-3047 CSS, lines ~6714-6742 HTML).

---

## 1. HTML Structure

### 1.1 Progress Bar with Label

```html
<div class="progress-group">
  <div class="progress-label">
    <span>Design Tokens</span>
    <span>92%</span>
  </div>
  <div class="progress-track">
    <div class="progress-fill progress-fill-pink" style="width:92%"></div>
  </div>
</div>
```

### 1.2 Progress Bar without Label

```html
<div class="progress-track">
  <div class="progress-fill progress-fill-cyan" style="width:45%"></div>
</div>
```

### 1.3 All Color Variants

```html
<div class="progress-track">
  <div class="progress-fill progress-fill-pink" style="width:92%"></div>
</div>
<div class="progress-track">
  <div class="progress-fill progress-fill-gold" style="width:68%"></div>
</div>
<div class="progress-track">
  <div class="progress-fill progress-fill-cyan" style="width:45%"></div>
</div>
<div class="progress-track">
  <div class="progress-fill progress-fill-green" style="width:78%"></div>
</div>
<div class="progress-track">
  <div class="progress-fill progress-fill-purple" style="width:55%"></div>
</div>
```

---

## 2. CSS Classes

### 2.1 `.progress-group`

| Property | Value | Token |
|---|---|---|
| `margin-bottom` | `var(--space-4)` | `16px` |

### 2.2 `.progress-label`

| Property | Value | Token |
|---|---|---|
| `display` | `flex` | -- |
| `justify-content` | `space-between` | -- |
| `font-size` | `var(--step--1)` | Fluid ~13-16px |
| `font-weight` | `600` | -- |
| `margin-bottom` | `var(--space-2)` | `8px` |

### 2.3 `.progress-track`

| Property | Value | Token |
|---|---|---|
| `height` | `16px` | -- |
| `background` | `var(--bg-muted)` | -- |
| `border` | `2px solid var(--border-default)` | -- |
| `border-radius` | `var(--radius-full)` | `9999px` |
| `overflow` | `hidden` | -- |

### 2.4 `.progress-fill` (base)

| Property | Value | Token |
|---|---|---|
| `height` | `100%` | -- |
| `border-radius` | `var(--radius-full)` | `9999px` |
| `transition` | `width var(--motion-base) var(--ease-out)` | `240ms` |

The fill width is set via inline `style="width:XX%"`.

### 2.5 Color Variants

| Class | `background` |
|---|---|
| `.progress-fill-pink` | `var(--accent-primary)` |
| `.progress-fill-gold` | `var(--accent-gold)` |
| `.progress-fill-cyan` | `var(--accent-cyan)` |
| `.progress-fill-green` | `var(--accent-green)` |
| `.progress-fill-purple` | `var(--accent-purple)` |

Note: There is no danger/red variant in the reference.

---

## 3. States

| State | Visual |
|---|---|
| Empty (0%) | Track visible, no fill |
| Partial | Fill extends to the specified percentage |
| Full (100%) | Fill covers the entire track |

The fill transitions smoothly when the `width` style changes, using `--motion-base` (240ms) with `--ease-out`.

---

## 4. Variants

5 color variants plus the optional label group. No size variants (fixed 16px height).

---

## 5. Responsive Behavior

No explicit responsive breakpoints. The progress bar takes the width of its container.

---

## 6. Accessibility

- Implementing agents should use `role="progressbar"` on the `.progress-track` element
- Include `aria-valuenow`, `aria-valuemin="0"`, `aria-valuemax="100"` attributes
- Include `aria-label` or `aria-labelledby` pointing to the progress label
- The visual percentage text in `.progress-label` provides context for sighted users

---

## 7. Token Dependencies

### Tier 2 (Semantic)

- `--bg-muted`
- `--border-default`
- `--accent-primary`, `--accent-gold`, `--accent-cyan`, `--accent-green`, `--accent-purple`

### Tier 3 (Component)

- `--space-2` (`8px`), `--space-4` (`16px`)
- `--radius-full` (`9999px`)
- `--step--1` (fluid font size for label)
- `--motion-base` (`240ms`)
- `--ease-out`

---

## 8. Test Specification

### 8.1 Computed Style Assertions

- `.progress-track` has `height: 16px`
- `.progress-track` has `border: 2px solid` with color matching `--border-default`
- `.progress-track` has `border-radius: 9999px`
- `.progress-fill` has `border-radius: 9999px`
- `.progress-fill-pink` has `background` matching `--accent-primary`
- `.progress-fill-gold` has `background` matching `--accent-gold`
- `.progress-fill-cyan` has `background` matching `--accent-cyan`
- `.progress-fill-green` has `background` matching `--accent-green`
- `.progress-fill-purple` has `background` matching `--accent-purple`

### 8.2 Interaction Assertions

- Changing the `width` style on `.progress-fill` triggers a smooth transition
- Transition duration matches `--motion-base` (240ms)

### 8.3 Visual Regression Scenarios

- All 5 color variants at various percentages (light mode)
- All 5 color variants (dark mode)
- Progress bar at 0% (empty)
- Progress bar at 100% (full)
- Progress group with label

### 8.4 Reduced Motion Compliance

- With `prefers-reduced-motion: reduce`, width transitions complete in 0.01ms
