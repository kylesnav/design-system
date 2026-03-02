# Divider

> Horizontal rule for separating content sections. Three variants: default (subtle), strong (thicker/darker), and text-inset (labeled break with centered text).

Cross-references: [[token-tiers]] (border tokens), [[spacing]] (uses `--space-4`, `--space-6`), [[typography]] (uses `--ui-text-xs`).

Visual reference: Section "05 — Components", subsection "Divider" in `design-reference.html` (lines ~5827-5840).

---

## 1. HTML Structure

### 1.1 Default Divider (subtle)

```html
<hr class="divider">
```

### 1.2 Strong Divider

```html
<hr class="divider divider-strong">
```

### 1.3 Divider with Text

```html
<div class="divider-with-text">or continue with</div>
```

### 1.4 Full Contextual Example

```html
<p>Content above the divider</p>
<hr class="divider">
<p>Subtle divider (default)</p>
<hr class="divider divider-strong">
<p>Strong divider</p>
<div class="divider-with-text">or continue with</div>
<p>Divider with inline text</p>
```

---

## 2. CSS Classes

### 2.1 `.divider` (base)

| Property | Value | Token |
|---|---|---|
| `border` | `none` | Removes all default `<hr>` borders |
| `border-top` | `2px solid var(--border-subtle)` | `--border-subtle` |
| `margin` | `var(--space-6) 0` | `24px` vertical spacing |

### 2.2 `.divider-strong`

Applied alongside `.divider`. Changes only the border color.

| Property | Value | Token |
|---|---|---|
| `border-top-color` | `var(--border-default)` | Darker/stronger than `--border-subtle` |

### 2.3 `.divider-with-text`

A `<div>` element (not `<hr>`) that creates a horizontal line with centered text.

| Property | Value | Token |
|---|---|---|
| `display` | `flex` | -- |
| `align-items` | `center` | -- |
| `gap` | `var(--space-4)` | `16px` |
| `color` | `var(--text-muted)` | -- |
| `font-size` | `var(--ui-text-xs)` | `0.75rem` (12px) |
| `font-weight` | `600` | -- |
| `text-transform` | `uppercase` | -- |
| `letter-spacing` | `0.06em` | -- |

Pseudo-elements (lines on either side of text):

```css
.divider-with-text::before,
.divider-with-text::after {
  content: '';
  flex: 1;
  border-top: 2px solid var(--border-subtle);
}
```

---

## 3. Variants

| Variant | Class(es) | Element | What Changes |
|---|---|---|---|
| Default (subtle) | `.divider` | `<hr>` | Subtle border color (`--border-subtle`) |
| Strong | `.divider .divider-strong` | `<hr>` | Darker border color (`--border-default`) |
| With Text | `.divider-with-text` | `<div>` | Flex layout with centered text and lines on both sides |

---

## 4. States

The divider is a static display component. It has no interactive states (no hover, focus, active, or disabled).

---

## 5. Responsive Behavior

No explicit responsive breakpoints. Dividers are full-width within their container. The text variant wraps naturally if the container is extremely narrow (though text is typically short labels like "or continue with").

---

## 6. Accessibility

- The `<hr>` element has an implicit `separator` role. Screen readers will announce it as a separator/divider.
- The `.divider-with-text` variant uses a `<div>`, which does not have implicit separator semantics. Add `role="separator"` if the divider marks a meaningful content boundary.
- The text within `.divider-with-text` is visible and part of the document flow -- no additional ARIA is needed for the text itself.

### Recommended Enhanced Markup for Text Variant

```html
<div class="divider-with-text" role="separator">or continue with</div>
```

---

## 7. Token Dependencies

### Tier 2 (Semantic)

- `--border-subtle` (default divider color and text variant lines)
- `--border-default` (strong variant color)
- `--text-muted` (text variant text color)

### Tier 3 (Component)

- `--space-4` (`16px`) -- gap in text variant
- `--space-6` (`24px`) -- vertical margin
- `--ui-text-xs` (`0.75rem`) -- text variant font size

---

## 8. Test Specification

### 8.1 Computed Style Assertions

- `.divider` has `border-top-width: 2px`
- `.divider` has `border-top-style: solid`
- `.divider` border-top-color matches `--border-subtle` resolved value
- `.divider-strong` border-top-color matches `--border-default` resolved value
- `.divider-with-text` has `display: flex`
- `.divider-with-text` has `text-transform: uppercase`
- `.divider-with-text` has `font-size` resolving to approximately `12px`
- `.divider-with-text::before` and `::after` have `flex: 1` and `border-top` matching `--border-subtle`

### 8.2 Visual Regression Scenarios

- All 3 variants stacked vertically (light mode)
- All 3 variants stacked vertically (dark mode)
- Text variant with long text (wrapping behavior)
- Dividers within a card container

### 8.3 Reduced Motion Compliance

No animation on this component -- no motion assertions needed.

---

## 9. Implementation CSS

```css
@layer component {
  .divider {
    border: none;
    border-top: 2px solid var(--border-subtle);
    margin: var(--space-6) 0;
  }

  .divider-strong {
    border-top-color: var(--border-default);
  }

  .divider-with-text {
    display: flex;
    align-items: center;
    gap: var(--space-4);
    color: var(--text-muted);
    font-size: var(--ui-text-xs);
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.06em;
  }

  .divider-with-text::before,
  .divider-with-text::after {
    content: '';
    flex: 1;
    border-top: 2px solid var(--border-subtle);
  }
}
```
