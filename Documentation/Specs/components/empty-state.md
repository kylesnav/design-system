# Empty State

> Centered placeholder for zero-data screens with icon, title, description, and optional call-to-action button. Used when a list, table, or content area has no data to display.

Cross-references: [[token-tiers]] (spacing and typography tokens), [[typography]] (uses fluid and UI text scales), [[button]] (optional CTA button).

Visual reference: Section "Micro-Components & Patterns", subsection "Empty State" in `design-reference.html` (lines ~6791-6802).

---

## 1. HTML Structure

### 1.1 Complete Empty State (with CTA)

```html
<div class="empty-state">
  <div class="empty-state-icon">
    <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="var(--text-muted)" stroke-width="1.5" stroke-linecap="round">
      <circle cx="11" cy="11" r="8"/>
      <line x1="21" y1="21" x2="16.65" y2="16.65"/>
    </svg>
  </div>
  <div class="empty-state-title">No results found</div>
  <div class="empty-state-desc">Try adjusting your search or filter criteria to find what you're looking for.</div>
  <button class="btn btn-sm btn-primary">Clear filters</button>
</div>
```

### 1.2 Empty State Without CTA

```html
<div class="empty-state">
  <div class="empty-state-icon">
    <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="var(--text-muted)" stroke-width="1.5" stroke-linecap="round">
      <circle cx="11" cy="11" r="8"/>
      <line x1="21" y1="21" x2="16.65" y2="16.65"/>
    </svg>
  </div>
  <div class="empty-state-title">No results found</div>
  <div class="empty-state-desc">Try adjusting your search or filter criteria to find what you're looking for.</div>
</div>
```

### 1.3 Inside a Card Container (as used in reference)

```html
<div class="card" style="max-width:560px">
  <div class="empty-state">
    <div class="empty-state-icon"><!-- SVG icon --></div>
    <div class="empty-state-title">No results found</div>
    <div class="empty-state-desc">Try adjusting your search or filter criteria to find what you're looking for.</div>
    <button class="btn btn-sm btn-primary">Clear filters</button>
  </div>
</div>
```

---

## 2. CSS Classes

### 2.1 `.empty-state` (container)

| Property | Value | Token |
|---|---|---|
| `display` | `flex` | -- |
| `flex-direction` | `column` | -- |
| `align-items` | `center` | -- |
| `justify-content` | `center` | -- |
| `padding` | `var(--space-12) var(--space-6)` | `48px 24px` |
| `text-align` | `center` | -- |

### 2.2 `.empty-state-icon`

| Property | Value | Token |
|---|---|---|
| `font-size` | `var(--step-3)` | Fluid ~27.6px - 39px |
| `margin-bottom` | `var(--space-4)` | `16px` |
| `color` | `var(--text-muted)` | -- |

The icon is typically an SVG with `stroke="var(--text-muted)"` at 48x48 viewBox, using `stroke-width="1.5"` for a light, unobtrusive appearance.

### 2.3 `.empty-state-title`

| Property | Value | Token |
|---|---|---|
| `font-size` | `var(--step-1)` | Fluid ~19.2px - 25px |
| `font-weight` | `700` | -- |
| `letter-spacing` | `var(--tracking-tight)` | `-0.02em` |
| `line-height` | `var(--leading-tight)` | `1.15` |
| `color` | `var(--text-primary)` | -- |
| `margin-bottom` | `var(--space-2)` | `8px` |

### 2.4 `.empty-state-desc`

| Property | Value | Token |
|---|---|---|
| `font-size` | `var(--ui-text-md)` | `0.875rem` (14px) |
| `color` | `var(--text-secondary)` | -- |
| `max-width` | `360px` | Hardcoded for readability |
| `line-height` | `var(--leading-normal)` | `1.55` |
| `margin-bottom` | `var(--space-6)` | `24px` |

---

## 3. Variants

The empty state has a single layout variant. Content variation comes from:
- Different icons (search, inbox, document, etc.)
- Different title/description text
- Presence or absence of CTA button
- The CTA button can be any button variant (primary, secondary, ghost, etc.)

---

## 4. States

The empty state is a static display component. It has no interactive states. Any interactive elements within it (e.g., CTA button) follow their own state specifications (see [[button]]).

---

## 5. Responsive Behavior

No explicit responsive breakpoints. The `max-width: 360px` on `.empty-state-desc` constrains the description width. The fluid type scale (`--step-1`, `--step-3`) handles size adaptation across viewports. The centered flex layout works at all screen widths.

---

## 6. Accessibility

- The empty state should be announced to screen readers as a meaningful region. If it replaces content that was previously present, consider using `role="status"` or `aria-live="polite"` on the container.
- The icon is decorative and should have `aria-hidden="true"` on the SVG element.
- The title should be a clear, actionable statement (e.g., "No results found" rather than "Empty").
- The description should provide guidance on what to do next.
- The CTA button must have clear action text (e.g., "Clear filters" not "Click here").

---

## 7. Token Dependencies

### Tier 2 (Semantic)

- `--text-muted` (icon color)
- `--text-primary` (title color)
- `--text-secondary` (description color)

### Tier 3 (Component)

- `--space-2` (`8px`), `--space-4` (`16px`), `--space-6` (`24px`), `--space-12` (`48px`)
- `--step-1` (title font-size, fluid)
- `--step-3` (icon font-size, fluid)
- `--ui-text-md` (`0.875rem`)
- `--tracking-tight` (`-0.02em`)
- `--leading-tight` (`1.15`)
- `--leading-normal` (`1.55`)

---

## 8. Test Specification

### 8.1 Computed Style Assertions

- `.empty-state` has `text-align: center`
- `.empty-state` has `flex-direction: column`
- `.empty-state` has `align-items: center`
- `.empty-state-title` has `font-weight: 700`
- `.empty-state-desc` has `max-width: 360px`
- `.empty-state-icon` color matches `--text-muted` resolved value

### 8.2 Visual Regression Scenarios

- Empty state with icon, title, description, and CTA (light mode)
- Empty state with icon, title, description, and CTA (dark mode)
- Empty state without CTA
- Empty state inside a card container
- Empty state at narrow viewport (320px)

### 8.3 Reduced Motion Compliance

No animation on this component -- no motion assertions needed.

---

## 9. Implementation CSS

```css
@layer component {
  .empty-state {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: var(--space-12) var(--space-6);
    text-align: center;
  }

  .empty-state-icon {
    font-size: var(--step-3);
    margin-bottom: var(--space-4);
    color: var(--text-muted);
  }

  .empty-state-title {
    font-size: var(--step-1);
    font-weight: 700;
    letter-spacing: var(--tracking-tight);
    line-height: var(--leading-tight);
    color: var(--text-primary);
    margin-bottom: var(--space-2);
  }

  .empty-state-desc {
    font-size: var(--ui-text-md);
    color: var(--text-secondary);
    max-width: 360px;
    line-height: var(--leading-normal);
    margin-bottom: var(--space-6);
  }
}
```
