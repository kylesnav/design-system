---
title: "Avatar"
date: 2026-03-02
type: spec
scope: mvp
status: active
---

# Avatar

> Circular identity indicator displaying initials or images. Three sizes, five color variants, and a group stacking pattern for team/member lists.

Cross-references: [[token-tiers]] (control height tokens for sizing), [[radius]] (uses `--radius-full`), [[typography]] (uses UI text scale), [[notification-badge]] (avatars can host notification overlays).

Visual reference: Section "Micro-Components & Patterns", subsection "Avatar" in `design-reference.html` (lines ~6745-6772).

---

## 1. HTML Structure

### 1.1 Single Avatar (initials)

```html
<div class="avatar avatar-md avatar-pink">AM</div>
```

### 1.2 All 3 Sizes

```html
<div class="avatar avatar-sm avatar-pink">AM</div>
<div class="avatar avatar-md avatar-pink">AM</div>
<div class="avatar avatar-lg avatar-pink">AM</div>
```

### 1.3 All 5 Color Variants (at medium size)

```html
<div class="avatar avatar-md avatar-pink">AM</div>
<div class="avatar avatar-md avatar-gold">JD</div>
<div class="avatar avatar-md avatar-cyan">AR</div>
<div class="avatar avatar-md avatar-green">ML</div>
<div class="avatar avatar-md avatar-purple">KS</div>
```

### 1.4 Avatar Group (overlapping stack)

```html
<div class="avatar-group">
  <div class="avatar avatar-md avatar-pink">AM</div>
  <div class="avatar avatar-md avatar-gold">JD</div>
  <div class="avatar avatar-md avatar-cyan">AR</div>
  <div class="avatar avatar-md avatar-green">ML</div>
</div>
```

### 1.5 Avatar with Image

```html
<div class="avatar avatar-md">
  <img src="photo.jpg" alt="Alex Morgan">
</div>
```

---

## 2. CSS Classes

### 2.1 `.avatar` (base)

| Property | Value | Token |
|---|---|---|
| `display` | `inline-flex` | -- |
| `align-items` | `center` | -- |
| `justify-content` | `center` | -- |
| `border-radius` | `var(--radius-full)` | `9999px` |
| `border` | `2px solid var(--border-default)` | `--border-default` |
| `overflow` | `hidden` | -- |
| `background` | `var(--bg-subtle)` | `--bg-subtle` |
| `color` | `var(--text-secondary)` | `--text-secondary` |
| `font-weight` | `700` | -- |
| `font-family` | `var(--font-sans)` | -- |
| `letter-spacing` | `var(--tracking-tight)` | `-0.02em` |
| `flex-shrink` | `0` | -- |
| `user-select` | `none` | -- |

Image child styling:

```css
.avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
```

### 2.2 Size Variants

| Class | `width` | `height` | `font-size` | Control Token |
|---|---|---|---|---|
| `.avatar-sm` | `var(--control-sm)` | `var(--control-sm)` | `var(--ui-text-2xs)` | `32px`, `11px` |
| `.avatar-md` | `var(--control-lg)` | `var(--control-lg)` | `var(--ui-text-md)` | `44px`, `14px` |
| `.avatar-lg` | `var(--control-xl)` | `var(--control-xl)` | `var(--ui-text-lg)` | `56px`, `15px` |

### 2.3 Color Variants

| Class | `background` | `color` |
|---|---|---|
| `.avatar-pink` | `var(--accent-primary-subtle)` | `var(--accent-primary)` |
| `.avatar-gold` | `var(--accent-gold-subtle)` | `var(--accent-gold)` |
| `.avatar-cyan` | `var(--accent-cyan-subtle)` | `var(--accent-cyan)` |
| `.avatar-green` | `var(--accent-green-subtle)` | `var(--accent-green)` |
| `.avatar-purple` | `var(--accent-purple-subtle)` | `var(--accent-purple)` |

### 2.4 `.avatar-group`

| Property | Value |
|---|---|
| `display` | `flex` |

Child `.avatar` overrides inside `.avatar-group`:

| Property | Value | Notes |
|---|---|---|
| `margin-left` | `-8px` | Negative margin creates overlap |
| `border-width` | `3px` | Thicker border to visually separate overlapping avatars |
| `&:first-child margin-left` | `0` | First avatar has no negative margin |

---

## 3. Variants

| Variant | Classes | What Changes |
|---|---|---|
| Small | `.avatar-sm` | 32x32px, 11px font |
| Medium | `.avatar-md` | 44x44px, 14px font |
| Large | `.avatar-lg` | 56x56px, 15px font |
| Pink | `.avatar-pink` | Subtle pink bg, pink text |
| Gold | `.avatar-gold` | Subtle gold bg, gold text |
| Cyan | `.avatar-cyan` | Subtle cyan bg, cyan text |
| Green | `.avatar-green` | Subtle green bg, green text |
| Purple | `.avatar-purple` | Subtle purple bg, purple text |
| Group | `.avatar-group` parent | Children overlap by -8px with 3px border |

---

## 4. States

Avatars are display-only components. They have no hover, active, or focus states in the base definition. When used as children of interactive elements (e.g., inside a button or link), the parent handles interaction states.

---

## 5. Responsive Behavior

Avatars have no responsive breakpoints. Their size is controlled by the size class (`.avatar-sm/md/lg`), not the viewport. The avatar group stacking works at all widths since it uses negative margin overlap.

---

## 6. Accessibility

- When an avatar represents a user and no name is visible alongside it, add `aria-label="User Name"` or `role="img" aria-label="User Name"`.
- Avatar images should have descriptive `alt` text: `<img src="photo.jpg" alt="Alex Morgan">`.
- For avatar groups, the containing element should have `role="group"` and `aria-label="Team members"` or similar.
- Initials are decorative when the user name is displayed elsewhere; in that case, add `aria-hidden="true"` to the avatar.
- Color alone does not convey meaning for avatars -- they are paired with initials or images.

---

## 7. Token Dependencies

### Tier 2 (Semantic)

- `--border-default`
- `--bg-subtle`
- `--text-secondary`
- `--accent-primary-subtle`, `--accent-primary`
- `--accent-gold-subtle`, `--accent-gold`
- `--accent-cyan-subtle`, `--accent-cyan`
- `--accent-green-subtle`, `--accent-green`
- `--accent-purple-subtle`, `--accent-purple`

### Tier 3 (Component)

- `--radius-full` (`9999px`)
- `--control-sm` (`32px`), `--control-lg` (`44px`), `--control-xl` (`56px`)
- `--ui-text-2xs` (`0.6875rem`), `--ui-text-md` (`0.875rem`), `--ui-text-lg` (`0.9375rem`)
- `--font-sans`
- `--tracking-tight` (`-0.02em`)

---

## 8. Test Specification

### 8.1 Computed Style Assertions

- `.avatar` has `border-radius: 9999px`
- `.avatar-sm` has `width` and `height` of `32px`
- `.avatar-md` has `width` and `height` of `44px`
- `.avatar-lg` has `width` and `height` of `56px`
- `.avatar-pink` background matches `--accent-primary-subtle` resolved value
- `.avatar` has `border-width: 2px`
- `.avatar-group .avatar` (non-first) has `margin-left: -8px`
- `.avatar-group .avatar` has `border-width: 3px`

### 8.2 Visual Regression Scenarios

- All 3 sizes in a row (sm, md, lg)
- All 5 color variants at md size
- Avatar group with 4 overlapping avatars
- Avatar with image child
- Light mode vs. dark mode comparison

### 8.3 Reduced Motion Compliance

No animation on this component -- no motion assertions needed.

---

## 9. Implementation CSS

```css
@layer component {
  .avatar {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    border-radius: var(--radius-full);
    border: 2px solid var(--border-default);
    overflow: hidden;
    background: var(--bg-subtle);
    color: var(--text-secondary);
    font-weight: 700;
    font-family: var(--font-sans);
    letter-spacing: var(--tracking-tight);
    flex-shrink: 0;
    user-select: none;
  }

  .avatar img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  .avatar-sm { width: var(--control-sm); height: var(--control-sm); font-size: var(--ui-text-2xs); }
  .avatar-md { width: var(--control-lg); height: var(--control-lg); font-size: var(--ui-text-md); }
  .avatar-lg { width: var(--control-xl); height: var(--control-xl); font-size: var(--ui-text-lg); }

  .avatar-group {
    display: flex;
  }
  .avatar-group .avatar {
    margin-left: -8px;
    border-width: 3px;
  }
  .avatar-group .avatar:first-child {
    margin-left: 0;
  }

  .avatar-pink { background: var(--accent-primary-subtle); color: var(--accent-primary); }
  .avatar-gold { background: var(--accent-gold-subtle); color: var(--accent-gold); }
  .avatar-cyan { background: var(--accent-cyan-subtle); color: var(--accent-cyan); }
  .avatar-green { background: var(--accent-green-subtle); color: var(--accent-green); }
  .avatar-purple { background: var(--accent-purple-subtle); color: var(--accent-purple); }
}
```
