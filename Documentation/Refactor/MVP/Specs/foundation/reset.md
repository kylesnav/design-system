---
title: "Reset"
date: 2026-03-02
type: spec
scope: mvp
status: active
---

# Reset

> Complete specification of the reset layer, base element styles, and global accessibility rules for the Delightful Design System.

Cross-references: [[token-tiers]] (cascade layer order), [[typography]] (body font settings), [[motion]] (reduced-motion gate details).

---

## 1. Layer Declaration

The reset layer is the **lowest priority** layer in the cascade:

```css
@layer reset, primitives, semantic, component, utilities;
```

Everything in `@layer reset` can be overridden by any rule in primitives, semantic, component, or utility layers. This is intentional -- the reset establishes sensible defaults that higher layers build upon.

---

## 2. Universal Box Model Reset

```css
@layer reset {
  *,
  *::before,
  *::after {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }
}
```

### What this does

| Property | Value | Effect |
|---|---|---|
| `margin` | `0` | Removes all default margins from every element (headings, paragraphs, lists, body, etc.) |
| `padding` | `0` | Removes all default padding from every element |
| `box-sizing` | `border-box` | Width/height include padding and border, not just content. This is the modern standard. |

The `*::before` and `*::after` selectors ensure pseudo-elements also inherit the box model.

---

## 3. HTML Element Styles

```css
@layer reset {
  html {
    scroll-behavior: smooth;
    scroll-padding-top: 68px;
  }
}
```

| Property | Value | Effect |
|---|---|---|
| `scroll-behavior` | `smooth` | Enables smooth scrolling for anchor links and `scrollTo()` calls |
| `scroll-padding-top` | `68px` | Offsets scroll targets by 68px from the top -- accounts for a fixed navigation bar so anchored sections are not hidden behind it |

---

## 4. Body Element Styles

```css
@layer reset {
  body {
    font-family: var(--font-sans);
    font-size: var(--step-0);
    line-height: var(--leading-normal);
    color: var(--text-primary);
    background: var(--bg-page);
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: auto;
    font-feature-settings: "cv02", "cv03", "cv04", "cv11";
  }
}
```

| Property | Value | Token Reference | Effect |
|---|---|---|---|
| `font-family` | `var(--font-sans)` | `--font-sans` = `'Inter', system-ui, -apple-system, sans-serif` | Sets Inter as the base typeface |
| `font-size` | `var(--step-0)` | `--step-0` = `clamp(1rem, 0.913rem + 0.43vi, 1.25rem)` | Fluid base size: 16px - 20px |
| `line-height` | `var(--leading-normal)` | `--leading-normal` = `1.55` | Generous line height for readability |
| `color` | `var(--text-primary)` | `--text-primary` (theme-aware) | Primary text color, adapts to light/dark mode |
| `background` | `var(--bg-page)` | `--bg-page` (theme-aware) | Page background color, adapts to light/dark mode |
| `-webkit-font-smoothing` | `antialiased` | (none) | Disables subpixel antialiasing on WebKit browsers for crisper text |
| `-moz-osx-font-smoothing` | `auto` | (none) | Uses default font smoothing on Firefox/macOS |
| `font-feature-settings` | `"cv02", "cv03", "cv04", "cv11"` | (none) | Enables Inter's alternate character variants for improved readability |

### Token cross-reference verification

All tokens used by body styles exist in the token tier system:
- `--font-sans` -- defined in `@layer component` ([[token-tiers]] section 5.1)
- `--step-0` -- defined in `@layer component` ([[token-tiers]] section 5.2)
- `--leading-normal` -- defined in `@layer component` ([[token-tiers]] section 5.4)
- `--text-primary` -- defined in `@layer semantic` ([[token-tiers]] section 4.2)
- `--bg-page` -- defined in `@layer semantic` ([[token-tiers]] section 4.1)

---

## 5. Focus-Visible Outline

```css
@layer reset {
  :focus-visible {
    outline: 2px solid var(--focus-ring);
    outline-offset: -2px;
  }
}
```

| Property | Value | Token Reference | Effect |
|---|---|---|---|
| `outline` | `2px solid var(--focus-ring)` | `--focus-ring` = `var(--accent-primary)` (light) / `oklch(0.700 0.230 350)` (dark) | 2px solid pink outline on keyboard focus |
| `outline-offset` | `-2px` | (none) | Outline sits inside the element boundary (inset), preventing layout shift |

### Design decisions

1. **`:focus-visible` not `:focus`**: Only shows the focus ring on keyboard navigation, not on mouse clicks. This is the modern best practice for accessibility without visual noise.
2. **2px width**: Meets WCAG 2.4.7 focus appearance requirements -- thick enough to be clearly visible.
3. **Negative offset (-2px)**: The outline is inset into the element rather than extending outward. This prevents focus rings from being clipped by `overflow: hidden` containers and avoids layout shifts.
4. **Accent primary color**: The focus ring uses the brand pink color, making it both functional and on-brand.

---

## 6. Reduced-Motion Global Gate

While technically defined in `@layer component` (not `@layer reset`), this reduced-motion rule functions as a global safety net and is architecturally part of the reset philosophy.

```css
@layer component {
  @media (prefers-reduced-motion: reduce) {
    *,
    *::before,
    *::after {
      animation-duration: 0.01ms !important;
      transition-duration: 0.01ms !important;
    }
  }
}
```

| Property | Value | Effect |
|---|---|---|
| `animation-duration` | `0.01ms !important` | All animations complete instantly (0.01ms, not 0ms -- so `animationend` events still fire) |
| `transition-duration` | `0.01ms !important` | All transitions complete instantly |

### Why 0.01ms, not 0ms

Setting duration to `0ms` can prevent `animationend` and `transitionend` events from firing, breaking JavaScript that depends on these events for state management. `0.01ms` is imperceptibly instant but still fires completion events.

### Why `!important`

The `!important` flag ensures no component can override this safety net. Even inline styles cannot bypass it. This is one of the very few legitimate uses of `!important` in the system.

---

## 7. Complete Reset Layer CSS

Complete CSS for an implementing agent to copy:

```css
@layer reset {
  *,
  *::before,
  *::after {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  html {
    scroll-behavior: smooth;
    scroll-padding-top: 68px;
  }

  body {
    font-family: var(--font-sans);
    font-size: var(--step-0);
    line-height: var(--leading-normal);
    color: var(--text-primary);
    background: var(--bg-page);
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: auto;
    font-feature-settings: "cv02", "cv03", "cv04", "cv11";
  }

  :focus-visible {
    outline: 2px solid var(--focus-ring);
    outline-offset: -2px;
  }
}
```

Note: The `prefers-reduced-motion: reduce` global gate is in `@layer component`, not `@layer reset`. See [[motion]] for full details. It is included here for completeness:

```css
@layer component {
  @media (prefers-reduced-motion: reduce) {
    *,
    *::before,
    *::after {
      animation-duration: 0.01ms !important;
      transition-duration: 0.01ms !important;
    }
  }
}
```
