# Toggle

> Switch toggle with a sliding knob, on/off states, and accent color when on. Implements the WAI-ARIA switch pattern using `role="switch"` and `aria-checked`. The knob slides horizontally with a bouncy spring animation.

**Known Primitive Violation**: The toggle component uses two primitive token references directly:
- `--toggle-knob: var(--primitive-neutral-0)` -- The knob is always white regardless of theme
- `--toggle-off-bg: var(--primitive-neutral-300)` -- The off-state background is a fixed neutral

These are intentional exceptions documented in [[token-tiers]] section 2 ("The Strict Rule"). The knob must be white in both light and dark themes, and the off-state needs a fixed neutral that doesn't invert.

Cross-references: [[token-tiers]] (toggle tokens in Tier 3, primitive violations), [[checkbox]] (alternative binary control).

Visual reference: Section "05 -- Components", subsection "Checkboxes, Radios & Toggle" in `design-reference.html` (lines ~5626-5630).

---

## 1. HTML Structure

### 1.1 Toggle (on state)

```html
<label class="toggle-group" style="display:flex;align-items:center;gap:var(--space-2)">
  <button class="toggle toggle-bg-anim" role="switch" aria-checked="true" aria-label="Auto-save"
    onclick="this.setAttribute('aria-checked', this.getAttribute('aria-checked') === 'true' ? 'false' : 'true')">
    <span class="toggle-knob toggle-knob-anim" aria-hidden="true"></span>
  </button>
  <span style="font-size:0.875rem">Auto-save</span>
</label>
```

### 1.2 Toggle (off state)

```html
<button class="toggle toggle-bg-anim" role="switch" aria-checked="false" aria-label="Dark mode">
  <span class="toggle-knob toggle-knob-anim" aria-hidden="true"></span>
</button>
```

---

## 2. CSS Classes

### 2.1 `.toggle` (track)

| Property | Value | Token |
|---|---|---|
| `width` | `40px` | -- |
| `height` | `22px` | -- |
| `border-radius` | `var(--radius-full)` | `9999px` |
| `background` | `var(--toggle-off-bg)` | `var(--primitive-neutral-300)` **[PRIMITIVE VIOLATION]** |
| `cursor` | `pointer` | -- |
| `position` | `relative` | For absolute knob positioning |
| `border` | `none` | -- |
| `padding` | `0` | -- |
| `flex-shrink` | `0` | -- |
| `transition` | `transform var(--motion-instant) linear, background var(--motion-fast) var(--ease-out)` | -- |

### 2.2 `.toggle[aria-checked="true"]` (on state)

| Property | Value | Token |
|---|---|---|
| `background` | `var(--toggle-on-bg)` | `var(--accent-primary)` |

Child `.toggle-knob` transform:

| Property | Value |
|---|---|
| `transform` | `translateX(18px)` |

### 2.3 `.toggle.on` (legacy class fallback)

Same as `aria-checked="true"` -- background changes to `var(--toggle-on-bg)` and knob translates `18px`.

### 2.4 `.toggle-knob`

| Property | Value | Token |
|---|---|---|
| `position` | `absolute` | -- |
| `top` | `3px` | -- |
| `left` | `3px` | -- |
| `width` | `16px` | -- |
| `height` | `16px` | -- |
| `border-radius` | `50%` | Circle |
| `background` | `var(--toggle-knob)` | `var(--primitive-neutral-0)` **[PRIMITIVE VIOLATION]** |
| `box-shadow` | `0 1px 3px oklch(0 0 0 / 0.15)` | Hardcoded subtle shadow |

### 2.5 `.toggle-knob-anim` (animation utility)

```css
.toggle-knob-anim {
  transition: transform var(--motion-fast) var(--ease-bounce);
}
```

Gated behind `@media (prefers-reduced-motion: no-preference)`.

### 2.6 `.toggle-bg-anim` (animation utility)

```css
.toggle-bg-anim {
  transition: background-color var(--motion-fast) var(--ease-out);
}
```

Gated behind `@media (prefers-reduced-motion: no-preference)`.

---

## 3. States

### 3.1 Off (default)

| Property | Value |
|---|---|
| `background` | `var(--toggle-off-bg)` = `var(--primitive-neutral-300)` = `oklch(0.860 0.014 70)` |
| Knob position | `left: 3px` (natural position) |

### 3.2 On

| Property | Value |
|---|---|
| `background` | `var(--toggle-on-bg)` = `var(--accent-primary)` |
| Knob position | `translateX(18px)` (slides right) |

### 3.3 Active (pressed)

| Property | Value |
|---|---|
| `transform` | `scale(0.92)` |

### 3.4 Disabled

Not explicitly defined in the reference CSS. When disabled, apply `opacity: 0.5; cursor: not-allowed; pointer-events: none;`.

---

## 4. Responsive Behavior

At `@media (pointer: coarse)`:
- `.toggle` gets `min-height: 44px; min-width: 44px` for touch targets.

---

## 5. Accessibility

- The toggle uses `<button>` with `role="switch"` and `aria-checked="true"/"false"`.
- `aria-label` provides the accessible name when there is no visible label adjacent.
- When a visible label exists (as in the toggle-group pattern), the label text provides the accessible name via the wrapping `<label>`.
- The `.toggle-knob` has `aria-hidden="true"` since it is decorative.
- Keyboard: Space or Enter toggles the switch (native `<button>` behavior).
- State change is communicated automatically through `aria-checked` value change.

---

## 6. Token Dependencies

### Tier 2 (Semantic)

- `--accent-primary` (on-state background, via `--toggle-on-bg`)

### Tier 3 (Component)

- `--toggle-off-bg` (`var(--primitive-neutral-300)`) **[PRIMITIVE VIOLATION]**
- `--toggle-on-bg` (`var(--accent-primary)`)
- `--toggle-knob` (`var(--primitive-neutral-0)`) **[PRIMITIVE VIOLATION]**
- `--radius-full` (`9999px`)
- `--motion-instant` (`100ms`), `--motion-fast` (`160ms`)
- `--ease-out`, `--ease-bounce` (`cubic-bezier(0.34, 1.56, 0.64, 1)`)
- `--space-2` (`8px`) -- for label gap in toggle-group pattern

### Hardcoded Values

- `width: 40px; height: 22px` on `.toggle`
- `width: 16px; height: 16px` on `.toggle-knob`
- `top: 3px; left: 3px` on `.toggle-knob`
- `translateX(18px)` on `.toggle-knob` in on state
- `box-shadow: 0 1px 3px oklch(0 0 0 / 0.15)` on `.toggle-knob`

---

## 7. Primitive Token Violations

| Token | Value | Reason |
|---|---|---|
| `--toggle-knob` | `var(--primitive-neutral-0)` | Knob must always be white (`oklch(1.00 0.000 0)`) in both light and dark themes. No semantic token maps to "always white". |
| `--toggle-off-bg` | `var(--primitive-neutral-300)` | Off-state background must be a fixed neutral gray (`oklch(0.860 0.014 70)`) that does not invert in dark mode. Semantic neutrals invert, which would make the off-state too light in dark mode. |

These violations are intentional and documented in the token tier architecture. They are the only primitive references permitted at the component level.

---

## 8. Test Specification

### 8.1 Computed Style Assertions

- `.toggle` has `width: 40px` and `height: 22px`
- `.toggle` has `border-radius: 9999px`
- `.toggle` (off) background matches `--toggle-off-bg` resolved value
- `.toggle[aria-checked="true"]` background matches `--toggle-on-bg` resolved value
- `.toggle-knob` has `width: 16px`, `height: 16px`, `border-radius: 50%`
- `.toggle-knob` background matches `--toggle-knob` resolved value (white)
- `.toggle[aria-checked="true"] .toggle-knob` has `transform: translateX(18px)`

### 8.2 Interaction Assertions

- Clicking toggle changes `aria-checked` from `"false"` to `"true"` (and vice versa)
- `.toggle:active` has `transform: scale(0.92)`
- Knob slides with transition when toggled

### 8.3 Visual Regression Scenarios

- Toggle off state (light mode)
- Toggle on state (light mode)
- Toggle off state (dark mode)
- Toggle on state (dark mode)
- Toggle with visible label
- Toggle in active (pressed) state

### 8.4 Reduced Motion Compliance

- With `prefers-reduced-motion: reduce`, knob slide and background transitions resolve in 0.01ms
- Toggle still changes state visually (just without animation)

---

## 9. Implementation CSS

```css
@layer component {
  .toggle {
    width: 40px;
    height: 22px;
    border-radius: var(--radius-full);
    background: var(--toggle-off-bg);
    cursor: pointer;
    position: relative;
    border: none;
    padding: 0;
    flex-shrink: 0;
    transition: transform var(--motion-instant) linear,
                background var(--motion-fast) var(--ease-out);
  }

  .toggle:active {
    transform: scale(0.92);
  }

  .toggle[aria-checked="true"] {
    background: var(--toggle-on-bg);
  }
  .toggle[aria-checked="true"] .toggle-knob {
    transform: translateX(18px);
  }

  /* Legacy class fallback */
  .toggle.on {
    background: var(--toggle-on-bg);
  }
  .toggle.on .toggle-knob {
    transform: translateX(18px);
  }

  .toggle-knob {
    position: absolute;
    top: 3px;
    left: 3px;
    width: 16px;
    height: 16px;
    border-radius: 50%;
    background: var(--toggle-knob);
    box-shadow: 0 1px 3px oklch(0 0 0 / 0.15);
  }

  @media (prefers-reduced-motion: no-preference) {
    .toggle-knob-anim {
      transition: transform var(--motion-fast) var(--ease-bounce);
    }
    .toggle-bg-anim {
      transition: background-color var(--motion-fast) var(--ease-out);
    }
  }
}
```
