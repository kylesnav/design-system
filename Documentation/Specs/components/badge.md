# Badge

> Inline status indicator pill with 6 color variants. Used for labeling status, categories, and metadata throughout the design system.

Cross-references: [[token-tiers]] (badge tokens in Tier 3), [[typography]] (uses `--ui-text-2xs`), [[radius]] (uses `--radius-full`).

Visual reference: Section "05 — Components", subsection "Badges" in `design-reference.html` (lines ~5800-5825).

---

## 1. HTML Structure

### 1.1 Base Badge

```html
<span class="badge badge-pink">Production</span>
```

### 1.2 All 6 Color Variants

```html
<span class="badge badge-pink badge-pop">Production</span>
<span class="badge badge-gold badge-pop">Draft</span>
<span class="badge badge-cyan badge-pop">Active</span>
<span class="badge badge-green badge-pop">Stable</span>
<span class="badge badge-purple badge-pop">New</span>
<span class="badge badge-red badge-pop">Breaking</span>
```

### 1.3 Badge with Status Dot

```html
<span class="badge badge-pink badge-pop">
  <span class="status-dot" style="background:var(--accent-primary);margin-right:2px"></span> With Dot
</span>
```

---

## 2. CSS Classes

### 2.1 `.badge` (base)

| Property | Value | Token |
|---|---|---|
| `display` | `inline-flex` | -- |
| `align-items` | `center` | -- |
| `gap` | `4px` | -- |
| `padding` | `var(--badge-py) var(--badge-px)` | `--badge-py: 2px`, `--badge-px: 10px` |
| `font-size` | `var(--ui-text-2xs)` | `0.6875rem` (11px) |
| `font-weight` | `600` | -- |
| `border-radius` | `var(--radius-full)` | `9999px` |

### 2.2 Color Variants

| Class | `background` | `color` |
|---|---|---|
| `.badge-pink` | `var(--accent-primary-subtle)` | `var(--accent-primary)` |
| `.badge-red` | `var(--accent-danger-subtle)` | `var(--accent-danger)` |
| `.badge-gold` | `var(--accent-gold-subtle)` | `var(--accent-gold-text)` |
| `.badge-cyan` | `var(--accent-cyan-subtle)` | `var(--accent-cyan)` |
| `.badge-green` | `var(--accent-green-subtle)` | `var(--accent-green)` |
| `.badge-purple` | `var(--accent-purple-subtle)` | `var(--accent-purple)` |

Note: `.badge-gold` uses `--accent-gold-text` (not `--accent-gold`) for its text color, ensuring sufficient contrast against the gold subtle background.

### 2.3 `.badge-pop` (animation utility)

Applied alongside `.badge` for a hover scale animation.

```css
.badge-pop {
  transition: transform var(--motion-fast) var(--ease-bounce);
}
.badge-pop:hover {
  transform: scale(1.08);
}
```

| Property | Value | Token |
|---|---|---|
| `transition` | `transform var(--motion-fast) var(--ease-bounce)` | `--motion-fast: 160ms`, `--ease-bounce: cubic-bezier(0.34, 1.56, 0.64, 1)` |
| `:hover transform` | `scale(1.08)` | -- |

This animation is gated behind `@media (prefers-reduced-motion: no-preference)`.

---

## 3. Variants

| Variant | Class | What Changes |
|---|---|---|
| Pink (primary) | `.badge-pink` | Background: accent-primary-subtle, Text: accent-primary |
| Red (danger) | `.badge-red` | Background: accent-danger-subtle, Text: accent-danger |
| Gold (highlight) | `.badge-gold` | Background: accent-gold-subtle, Text: accent-gold-text |
| Cyan (tertiary) | `.badge-cyan` | Background: accent-cyan-subtle, Text: accent-cyan |
| Green (success) | `.badge-green` | Background: accent-green-subtle, Text: accent-green |
| Purple (violet) | `.badge-purple` | Background: accent-purple-subtle, Text: accent-purple |

---

## 4. States

### 4.1 Default

No border, no shadow. The badge is a flat pill with subtle background and colored text.

### 4.2 Hover (with `.badge-pop`)

| Property | Change |
|---|---|
| `transform` | `scale(1.08)` |

### 4.3 Reduced Motion

When `prefers-reduced-motion: reduce` is active, `transition-duration` is forced to `0.01ms`, effectively disabling the pop animation.

---

## 5. Responsive Behavior

Badges have no responsive breakpoints. They are inline elements that flow naturally with text. The container layout (e.g., `.flex-wrap-gap`) handles wrapping.

---

## 6. Accessibility

- Badges are decorative status labels. They do not require ARIA roles when used within a context that provides meaning (e.g., a table cell or card).
- When a badge conveys critical status information not available elsewhere, wrap it in an element with `role="status"` or provide an `aria-label`.
- The `.status-dot` within a badge is purely decorative and should have `aria-hidden="true"` if used.
- Color is not the only differentiator -- badge text provides the semantic meaning.

---

## 7. Token Dependencies

### Tier 2 (Semantic)

- `--accent-primary-subtle`, `--accent-primary`
- `--accent-danger-subtle`, `--accent-danger`
- `--accent-gold-subtle`, `--accent-gold-text`
- `--accent-cyan-subtle`, `--accent-cyan`
- `--accent-green-subtle`, `--accent-green`
- `--accent-purple-subtle`, `--accent-purple`

### Tier 3 (Component)

- `--badge-py` (`2px`)
- `--badge-px` (`10px`)
- `--ui-text-2xs` (`0.6875rem`)
- `--radius-full` (`9999px`)
- `--motion-fast` (`160ms`)
- `--ease-bounce` (`cubic-bezier(0.34, 1.56, 0.64, 1)`)

---

## 8. Test Specification

### 8.1 Computed Style Assertions

- `.badge` has `border-radius: 9999px`
- `.badge` has `font-size` resolving to approximately `11px`
- `.badge` has `padding` of `2px 10px`
- `.badge-pink` has `background-color` matching `--accent-primary-subtle` resolved value
- `.badge-gold` text color matches `--accent-gold-text` resolved value (not `--accent-gold`)

### 8.2 Interaction Assertions

- `.badge-pop` on hover: `transform` includes `scale(1.08)`
- `.badge-pop` with `prefers-reduced-motion: reduce`: no visible transform change

### 8.3 Visual Regression Scenarios

- All 6 variants side-by-side in light mode
- All 6 variants side-by-side in dark mode
- Badge with status dot prefix
- Badge in flex-wrap container at narrow width (wrapping test)

### 8.4 Reduced Motion Compliance

- With `prefers-reduced-motion: reduce`, `.badge-pop:hover` must not produce visible animation

---

## 9. Implementation CSS

```css
@layer component {
  .badge {
    display: inline-flex;
    align-items: center;
    gap: 4px;
    padding: var(--badge-py) var(--badge-px);
    font-size: var(--ui-text-2xs);
    font-weight: 600;
    border-radius: var(--radius-full);
  }

  .badge-pink {
    background: var(--accent-primary-subtle);
    color: var(--accent-primary);
  }

  .badge-red {
    background: var(--accent-danger-subtle);
    color: var(--accent-danger);
  }

  .badge-gold {
    background: var(--accent-gold-subtle);
    color: var(--accent-gold-text);
  }

  .badge-cyan {
    background: var(--accent-cyan-subtle);
    color: var(--accent-cyan);
  }

  .badge-green {
    background: var(--accent-green-subtle);
    color: var(--accent-green);
  }

  .badge-purple {
    background: var(--accent-purple-subtle);
    color: var(--accent-purple);
  }

  @media (prefers-reduced-motion: no-preference) {
    .badge-pop {
      transition: transform var(--motion-fast) var(--ease-bounce);
    }
    .badge-pop:hover {
      transform: scale(1.08);
    }
  }
}
```
