# Self-Review: Section-by-Section Diff Report

**Baseline**: `/Users/kylesnav/Desktop/Working/Github/delightful-design-system/` (commit `45a5e23`)
**Working**: Porto worktree (`kylesnav/pull-working` branch)
**Source of truth**: `delightful-design-system.html`

Legend:
- ✅ = Approved (matches user verdict or planned change)
- 🔧 = Fixed during self-review
- ❓ = Flag for user review (sections 4-13 not yet visually reviewed)

---

## Global CSS Tokens (lines 1-4243)

### Token Tier Changes

| Change | Category | Notes |
|--------|----------|-------|
| `--border-default: var(--text-primary)` → `oklch(0.340 0.025 60)` | ❓ Flag | P4 border warming. User liked "dark presence" but later explicitly said tiles/cards/swatches should use `var(--text-primary)`. Inputs/buttons still reference `--border-default`. Is this intentional split? |
| `--border-strong: var(--text-primary)` → `oklch(0.250 0.020 60)` | ❓ Flag | Same question — border-strong also changed from black to warm brown |
| Comment "Warm gold" → "Bright gold — highlight accent" | ✅ Approved | Reflects hue 85 decision |
| `--shadow-sm/md/lg: var(--text-primary)` → `var(--border-default)` | ❓ Flag | Cascading from P4. Shadows now use warm brown instead of near-black. This softens ALL shadow-bearing components. Needs visual check. |
| Data viz tokens (`--chart-1` through `--chart-6`) added | ✅ Approved | P12 new components |
| Global focus `outline-offset: 2px` → `-2px` | ✅ Approved | C5 inset focus rings |
| `content-visibility: auto` + `contain-intrinsic-size` removed from `.ds-section` | ✅ Approved | Clips dark borders |
| `text-wrap: balance` on `.section-title` | ✅ Approved | P10 modern CSS |
| `text-wrap: pretty` on `.subsection-desc` | ✅ Approved | P10 modern CSS |
| Grid padding-right/bottom: 10px on `.grid-3`, `.grid-4` | ✅ Approved | P5 shadow clipping fix |
| Reduced motion: `.tilt-container`, `.tilt-card`, `.spotlight-panel` rules removed | ✅ Approved | C11 signature effects removed |

### Component CSS Changes

| Change | Category | Notes |
|--------|----------|-------|
| `.swatch` border: `var(--border-subtle)` → `var(--text-primary)` | ✅ Approved | User verdict: black borders |
| `.swatch:hover` border-color: `var(--border-strong)` → `var(--text-primary)` | ✅ Approved | Consistent with swatch verdict |
| `.swatch-row` border: `var(--border-subtle)` → `var(--text-primary)` | ✅ Approved | Consistent with swatch verdict |
| `.btn` border: `var(--text-primary)` → `var(--border-default)` | ❓ Flag | Buttons now warm brown. User hasn't explicitly reviewed. |
| `.btn` box-shadow: `var(--text-primary)` → `var(--border-default)` | ❓ Flag | Button shadows now warm brown |
| `.btn:active` box-shadow: `var(--text-primary)` → `var(--border-default)` | ❓ Flag | Same cascade |
| `.btn .force-focus` outline-offset: `2px` → `-2px` | ✅ Approved | C5 inset focus |
| `.input` border: `var(--text-primary)` → `var(--border-default)` | ❓ Flag | P4 border warming |
| `.input` box-shadow: `2px 2px 0 var(--text-primary)` → `var(--shadow-sm)` | ❓ Flag | Uses token now (which resolves to warm brown) |
| `.input-error` + `.input:user-invalid` selector | ✅ Approved | P10 modern CSS |
| `.textarea` `field-sizing: content` | ✅ Approved | P10 modern CSS |
| `.textarea` border: `var(--text-primary)` → `var(--border-default)` | ❓ Flag | P4 border warming |
| `.select` border: `var(--text-primary)` → `var(--border-default)` | ❓ Flag | P4 border warming |
| `.multi-select` border: `var(--text-primary)` → `var(--border-default)` | ❓ Flag | P4 border warming |
| `.checkbox` border: `1.5px` → `2px` | ✅ Approved | P11 accessibility |
| `.checkbox:focus-visible` outline-offset: `2px` → `-2px` | ✅ Approved | C5 inset focus |
| Firefox range slider thumb + track CSS added | ✅ Approved | P11 accessibility |
| `.card` box-shadow: `var(--text-primary)` → `var(--border-default)` | ❓ Flag | Card shadows now warm brown |
| `.badge-gold`, `.alert-gold` color: `var(--accent-gold)` → `var(--accent-gold-text)` | ✅ Approved | P3 gold text fix |
| `.table-header-gold` color: `var(--accent-gold)` → `var(--accent-gold-text)` | ✅ Approved | P3 gold text fix |
| Notification badge component CSS added | ✅ Approved | P12 new component |
| Divider component CSS added | ✅ Approved | P12 new component |
| Segmented control CSS added (pill, dark active) | ✅ Approved | P8/P12 new component |
| Dropdown menu CSS added | ✅ Approved | P12 new component |
| 3D tilt card CSS removed | ✅ Approved | C11 signature effects removed |
| @property hue animation CSS removed | ✅ Approved | C11 signature effects removed |
| Cursor spotlight CSS removed | ✅ Approved | C11 signature effects removed |
| `.avatar-group` box-shadow ring → `border-width: 3px` | ❓ Flag | C10. May cause visual issues with overlap. Needs visual check. |
| `.popover-trigger .btn` sizing: implied by btn-md class in HTML | ✅ Approved | P7 popover buttons |
| `.arch-btn` border: `var(--border-subtle)` → `transparent` | ❓ Flag | P9/C6. User suggested fill approach but not implemented. Current: 3px border on selected. |
| `.arch-btn.active` changed to `border: 3px solid var(--border-default)` | ❓ Flag | C6 partial — user wanted pagination-style fill |
| `.stepper-indicator` border: `var(--text-primary)` → `var(--border-strong)` | ❓ Flag | Cascading change, was near-black, now warm brown |

---

## Section 1: Hero / Landing

| Change | Category | Notes |
|--------|----------|-------|
| `.hero-divider` CSS + HTML removed | ✅ Approved | User verdict: remove pink line |
| `.hero-subtitle` margin: `space-4` → `space-10` | ✅ Approved | Compensates for divider removal |
| `.hero-title-text` `text-wrap: balance` added | ✅ Approved | P10 modern CSS |
| `.hero-subtitle` `text-wrap: pretty` added | ✅ Approved | P10 modern CSS |
| CTA button box-shadow: `var(--text-primary)` → `var(--border-default)` | ❓ Flag | Cascading from P4. Hero CTA shadow now warm brown. |
| Tile box-shadow: `var(--text-primary)` → `var(--border-default)` | ❓ Flag | Cascading from P4. |
| Tile desc "Magnetic, tilt, spotlight, color shift" → "Blur focus, magnetic button" | ✅ Approved | C11 signature effects removed |
| Skip link target: `#color` → `#landing` | ✅ Approved | P11 accessibility fix |
| Topnav `@layer component` wrapper added | ✅ Approved | Structural improvement |

---

## Section 2: Philosophy

No direct HTML changes in this section beyond tile border pattern (already analyzed in global CSS).

---

## Section 3: Color System

| Change | Category | Notes |
|--------|----------|-------|
| Swatch borders → `var(--text-primary)` | ✅ Approved | User verdict |
| Gold swatch values at hue 85 | ✅ Approved | User verdict |
| Architecture Explorer semantic token data at hue 85 | ✅ Approved | Fixed in propagation audit |
| Architecture Explorer family data hue 78 → 85 | 🔧 Fixed | Found and fixed during self-review |

---

## Section 4: Typography ❓

| Change | Category | Notes |
|--------|----------|-------|
| `text-wrap: balance` on section title | ✅ Approved | P10 |
| `text-wrap: pretty` on descriptions | ✅ Approved | P10 |
| No other substantive changes | — | Clean |

---

## Section 5: Spacing & Layout ❓

| Change | Category | Notes |
|--------|----------|-------|
| `.grid-3`, `.grid-4` padding fix | ✅ Approved | P5 shadow clipping |
| No other substantive changes | — | Clean |

---

## Section 6: Components ❓

This is the heaviest section. All changes are catalogued in the Global CSS section above since the component CSS is defined globally. HTML changes:

| Change | Category | Notes |
|--------|----------|-------|
| Divider subsection HTML added | ✅ Approved | P12 |
| Segmented control subsection HTML added | ✅ Approved | P12 |
| Notification badge subsection HTML added | ✅ Approved | P12 |
| Dropdown menu subsection HTML added | ✅ Approved | P12 |
| Popover buttons: added `btn-md` class | ✅ Approved | P7 |
| Subsection numbering shifted (5f → 5j for navigation) | ✅ Approved | Accommodates new components |

---

## Section 7: Iconography ❓

No substantive changes detected.

---

## Section 8: Motion & Easing ❓

No substantive changes detected.

---

## Section 9: Micro-Interactions ❓

| Change | Category | Notes |
|--------|----------|-------|
| Toggle buttons: `onclick="this.classList.toggle('on')"` → `role="switch" aria-checked` pattern | ✅ Approved | P11 accessibility |
| Toggle `aria-label` attributes added | ✅ Approved | P11 accessibility |
| Toggle knob `aria-hidden="true"` added | ✅ Approved | P11 accessibility |

---

## Section 10: Loading & Transitions ❓

| Change | Category | Notes |
|--------|----------|-------|
| Skeleton card layout: all 3 cards unified to same structure (heading + text lines) | ❓ Flag | C9. Original had varied layouts (circle+text, image+heading). Simpler but less demonstrative. |
| Skeleton load JS: rewritten with 2-phase transition | ❓ Flag | C9. Fade out skeletons → staggered slide-in. More polished. |
| Reset button functionality added | ❓ Flag | C9. Skeleton "Load Content" becomes "Reset" after loading. |
| Skel text width `80%` → `75%` | ❓ Flag | C9 layout change |

---

## Section 11: Overlays & Feedback ❓

| Change | Category | Notes |
|--------|----------|-------|
| Empty state emoji `🔍` → SVG search icon | ❓ Flag | Better cross-platform rendering. Minor UX improvement. |
| No other substantive changes beyond cascading border/shadow from tokens | — | |

---

## Section 12: Signature Effects ❓

| Change | Category | Notes |
|--------|----------|-------|
| 3D Perspective Tilt subsection removed (CSS + HTML + JS) | ✅ Approved | C11 |
| @property Color Shift subsection removed (CSS + HTML) | ✅ Approved | C11 |
| Cursor Spotlight subsection removed (CSS + HTML + JS) | ✅ Approved | C11 |
| Blur Focus Grid kept | ✅ Approved | C11 |
| Magnetic Button kept | ✅ Approved | C11 |

---

## Section 13: Footer / Compositions ❓

No substantive changes detected.

---

## Global JS (end of file)

| Change | Category | Notes |
|--------|----------|-------|
| Tilt card JS event handlers removed | ✅ Approved | C11 |
| Cursor spotlight JS handlers removed | ✅ Approved | C11 |
| Skeleton load JS rewritten (2-phase, reset) | ❓ Flag | C9 |
| Arch family gold hue: `85` → `78` → `85` (fixed) | 🔧 Fixed | Was missed in prior revert, caught in self-review |

---

## Issues Found & Fixed During Self-Review

1. **🔧 Architecture Explorer family hue 78 → 85** (line 7348) — The `archFamilies` JS array had gold at hue 78. This drives the primitive swatch generation. Fixed to 85.

---

## Key Questions for User (Priority Order)

### 1. `--border-default` Token Split (HIGH)
**Baseline**: `--border-default: var(--text-primary)` (near-black)
**Working**: `--border-default: oklch(0.340 0.025 60)` (warm brown)

This cascades to: buttons, inputs, textareas, selects, multi-selects, card shadows, CTA shadows, tile shadows. Meanwhile, tiles, cards, and swatches were explicitly changed to use `var(--text-primary)` per user verdicts.

**Question**: Is this intentional? Should inputs/buttons have warm brown borders while tiles/cards have black? Or should `--border-default` stay as `var(--text-primary)` and we find another way to differentiate?

### 2. Shadow Color Cascade (HIGH)
Shadows (`--shadow-sm/md/lg`) changed from `var(--text-primary)` to `var(--border-default)`, making them warm brown. This affects every component with a shadow.

### 3. Avatar Group Border (MEDIUM)
Changed from `box-shadow: 0 0 0 2px var(--bg-surface)` ring to `border-width: 3px`. The box-shadow ring was there to create visual separation when avatars overlap. Need to verify the border approach maintains clean overlap rendering.

### 4. Architecture Explorer Selected State (MEDIUM)
Current: `border: 3px solid var(--border-default)` on selected button.
User suggested: pagination-style fill approach. Not implemented yet.

### 5. Skeleton Card Layout Simplification (LOW)
All 3 cards now have identical structure. Original had varied layouts showing different skeleton patterns (avatar row, image block). The uniformity is cleaner but less demonstrative of skeleton flexibility.

---

## Summary Statistics

- **Total diff lines**: 899 (source of truth) + ~200 (downstream propagation fixes)
- **Changes categorized ✅ (Approved)**: ~35
- **Changes categorized 🔧 (Fixed)**: 12 (arch explorer gold hue, downstream gold hue 78→85, bg values, Obsidian contrast)
- **Changes categorized ❓ (Flag)**: ~20 (mostly cascading from border-default change)
- **Sections reviewed by user**: 1-3 (approved)
- **Sections pending user review**: 4-13

---

## Post-Review Propagation Fixes

Code reviewer found critical downstream drift. All fixed:

| File | Issue | Fix |
|------|-------|-----|
| `claude-plugin/themes/css/delightful-tokens.css` | Gold hue 78, bg 0.993/0.003, stale border/shadow tokens | Hue→85, bg→0.982/0.008, border-default→warm brown, shadows→var(--border-default) |
| `claude-plugin/themes/figma/tokens.json` | All gold entries at hue 78 | 13 values fixed to hue 85 |
| `obsidian-theme/theme.css` | 33 hue 78 values, white text-on-accent, stale bg values | Hue→85 (hover→84), text-on-accent→dark, bg→0.982/0.008 |
| `vscode-theme/scripts/generate-themes.mjs` | Gold hue 78, stale bg values | Hue→85, bg fixed. Themes regenerated. |
| `claude-plugin/reference/design-system.md` | Gold hue 78 in primitive + semantic tables | All 3 tables fixed to hue 85 |
| `README.md` | Gold hue 78 in primitive + semantic tables | All entries fixed to hue 85 |
| `preview.html` + `preview-light.html` | bg values 0.993/0.003 | Fixed to 0.982/0.008 |
| `delightful-color.html` | JS data bg values stale | Fixed to match source |

**Root cause**: `npm run sync` has a bug — Tier 2 Light tokens don't propagate to CSS tokens file because the `extractCSSBlock` regex doesn't handle the `:root, [data-theme="light"]` multi-selector format. Manual propagation was required.

---

## Propagation Status

| File | Status |
|------|--------|
| `delightful-design-system.html` | ✅ Source of truth, all verdicts applied |
| `claude-plugin/themes/css/delightful-tokens.css` | ✅ Manually fixed (sync script bug bypassed) |
| `obsidian-theme/theme.css` | ✅ Fully fixed — hue 85, hover hue 84, dark text-on-accent, correct bg |
| `delightful-motion.html` | ✅ Synced, content-visibility removed, dots fixed |
| `delightful-animation.html` | ✅ Synced, content-visibility removed, dots fixed |
| `delightful-color.html` | ✅ Synced, swatches fixed, content-visibility removed, JS data fixed |
| `preview.html` | ✅ Gold hue 85, card-accent border-top, bg fixed |
| `preview-light.html` | ✅ Gold hue 85, card-accent border-top, bg fixed |
| `preview-dark.html` | ✅ Gold hue 85, card-accent border-top |
| `vscode-theme/` | ✅ Generator fixed, themes regenerated |
| `claude-plugin/reference/design-system.md` | ✅ All gold tables fixed to hue 85 |
| `claude-plugin/themes/figma/tokens.json` | ✅ All gold entries fixed to hue 85 |
| `README.md` | ✅ All gold entries fixed to hue 85 |
