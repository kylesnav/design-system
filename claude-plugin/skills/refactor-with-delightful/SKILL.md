---
name: refactor-with-delightful
description: Refactor existing project UI to use the Delightful design system. Use when a user says "refactor with delightful", "migrate to delightful", "apply design system", "replace hardcoded styles", or wants to convert ad-hoc CSS to systematic tokens with dark mode and neo-brutalist patterns.
allowed-tools: "Bash WebFetch"
metadata:
  author: Delightful Design System
  version: 0.4.5
  category: frontend-design
  tags: [design-system, css, refactoring, migration, oklch]
---

# Refactor with Delightful

Refactor an existing project's UI to use the Delightful design system.

## Instructions

### Step 1 — Audit First

Launch the `delightful-auditor` agent to scan the existing codebase. The auditor produces a report that maps:

- All hardcoded colors to which Delightful tokens they should become
- All arbitrary spacing to which `--space-*` values
- All font sizes to which `--step-*` or `--ui-text-*` values
- Components that don't follow Delightful patterns
- Missing dark mode support
- Missing interaction states (hover, active, focus-visible)
- Blurred shadows that should be solid
- Missing `prefers-reduced-motion` guards

### Step 2 — Present the Migration Plan

Show the user the audit findings organized by priority:

1. **Critical (Errors):** Hardcoded colors, arbitrary spacing/font sizes, blurred shadows
2. **Important (Warnings):** Missing interaction states, missing dark mode, missing reduced-motion
3. **Nice-to-have (Info):** Non-oklch colors, border pattern inconsistencies

Propose a migration order:
1. Inject the token system first
2. Migrate colors to semantic tokens
3. Migrate spacing to `--space-*` scale
4. Migrate content typography to fluid `--step-*` scale, control typography to `--ui-text-*` scale
5. Add interaction states
6. Add dark mode support
7. Add reduced-motion guards

### Step 3 — Inject Tokens

Add the full CSS custom property system to the project:

1. Import or inline the token CSS from `themes/css/delightful-tokens.css` (relative to plugin root)
2. Add Google Fonts link if not present (Inter + JetBrains Mono)
3. Add the base reset if not present
4. Set body styles using tokens
5. Add global `:focus-visible` style
6. Set up `data-theme` attribute on `<html>` for dark mode
7. Add reduced-motion media query

### Step 4 — Migrate Systematically

Replace values file-by-file, component-by-component:

**Colors to Semantic tokens:**
- Near-black/dark text to `var(--text-primary)`
- Gray text to `var(--text-secondary)` or `var(--text-muted)`
- White text on colored bg to `var(--text-on-accent)`
- Background whites to `var(--bg-surface)` or `var(--bg-page)`
- Subtle grays to `var(--bg-subtle)` or `var(--bg-muted)`
- Pink/primary to `var(--accent-primary)` family
- Red/error/danger to `var(--accent-danger)` family
- Gold/warning to `var(--accent-gold)` family
- Cyan to `var(--accent-cyan)` family
- Green/success to `var(--accent-green)` family
- Purple/creative to `var(--accent-purple)` family

**Spacing to Scale:**
- Map each pixel value to nearest `--space-*` token
- 4px=1, 6px=1-5, 8px=2, 12px=3, 16px=4, 20px=5, 24px=6, 32px=8, 40px=10, 48px=12, 64px=16, 80px=20

**Content typography to Fluid scale:**
- Body text to `--step-0`
- Subheadings to `--step-1` or `--step-2`
- Headings to `--step-3` through `--step-5`

**Control typography to UI text scale:**
- Badges, table headers to `--ui-text-2xs` (11px)
- Captions, hints, form errors to `--ui-text-xs` (12px)
- Tables, sidebar items, small buttons to `--ui-text-sm` (13px)
- Inputs, selects, alerts, tabs to `--ui-text-md` (14px)
- Medium buttons to `--ui-text-lg` (15px)
- Large buttons to `--ui-text-xl` (17px)

**Control heights:**
- Small controls (32px) to `--control-sm`
- Default controls (36px) to `--control-md`
- Medium controls (44px) to `--control-lg`
- Large controls (56px) to `--control-xl`

**Shadows to Neo-brutalist solid:**
- Replace any `box-shadow` with blur radius to solid offsets
- `--shadow-sm` (2px 2px 0), `--shadow-md` (4px 4px 0), `--shadow-lg` (8px 8px 0)

**Z-index to scale:**
- Replace hardcoded z-index values with `var(--z-*)` tokens
- 1 → `--z-base`, 100 → `--z-sticky`, 200 → `--z-fixed`, 300 → `--z-overlay`, 1000 → `--z-modal`, 1100 → `--z-toast`, 1500 → `--z-tooltip`

**Borders to 2px solid pattern:**
- Cards, buttons: `border: 2px solid var(--text-primary)`
- Subtle dividers: `border: 1px solid var(--border-subtle)`

**Interactions to Delightful patterns:**
- Hover: `transform: translate(-4px, -4px)` + `box-shadow: var(--shadow-lg)` (or `translateY(-2px)` for subtler lift)
- Active: `transform: translate(2px, 2px)` + `box-shadow: 0 0 0 var(--text-primary)`
- Focus: `:focus-visible { outline: 2px solid var(--focus-ring); outline-offset: 2px; }`

### Step 5 — Re-audit

Run the `delightful-auditor` agent again to verify zero violations remain. If violations exist, fix them and re-audit.

### Step 6 — Visual Regression

If browser tools are available, screenshot the result in both light and dark mode to confirm the refactor looks intentional and cohesive.

## Migration Tips

- **Don't change semantics** — only change styling. The HTML structure should stay the same unless needed for dark mode support.
- **Work one file at a time** — complete the migration for each file before moving to the next.
- **Test dark mode as you go** — toggle `data-theme` after each file to catch issues early.
- **Preserve existing layouts** — the grid/flex structure doesn't need to change. Focus on colors, spacing, typography, and interaction patterns.
- **Handle third-party styles carefully** — don't modify vendor CSS. Override with higher specificity using Delightful tokens.

## Examples

### Example 1: Generic Tailwind Project
User says "Refactor this project to use delightful"
Actions:
1. Audit finds: 47 hardcoded colors, 23 arbitrary spacing values, 0 dark mode support
2. Present migration plan to user
3. Inject tokens, migrate file-by-file
4. Re-audit: zero violations
Result: Project fully migrated with dark mode, neo-brutalist interactions, systematic tokens

### Example 2: React Component Library
User says "Migrate my components to the delightful design system"
Actions:
1. Audit finds: inline styles with hex colors, px-based spacing, no interaction states
2. Plan: inject tokens into global CSS, update each component stylesheet
3. Replace inline colors with CSS custom properties, spacing with scale tokens
4. Add hover/active/focus-visible states to all interactive components
5. Re-audit confirms compliance
Result: Component library now uses systematic tokens, has dark mode, follows neo-brutalist patterns

### Example 3: Static HTML Site
User says "Apply delightful to my portfolio site"
Actions:
1. Audit finds: mixed hex/rgb colors, arbitrary margin/padding, blurred drop-shadows
2. Inject full token system into main stylesheet
3. Replace colors file-by-file, convert shadows to solid offsets
4. Add dark mode toggle and reduced-motion guards
5. Re-audit: clean
Result: Portfolio site with warm cream backgrounds, solid shadows, full dark mode support

## Troubleshooting

### Colors still look wrong in dark mode
Cause: Using primitive tokens (`--primitive-*`) directly instead of semantic tokens
Solution: Replace all `--primitive-*` references with `--bg-*`, `--text-*`, or `--accent-*` semantic tokens

### Shadows have blur/glow effect
Cause: `box-shadow` has a non-zero blur radius (e.g., `0 4px 12px`)
Solution: Use solid shadows only: `4px 4px 0` — zero blur radius is the neo-brutalist rule

### Animations feel janky on some devices
Cause: Missing `prefers-reduced-motion` guard
Solution: Wrap all `@keyframes` and animation properties in `@media (prefers-reduced-motion: no-preference)`

### Auditor reports false positives on token definitions
Cause: Auditor flagging oklch values inside `:root` or `[data-theme]` custom property definitions
Solution: These are allowed exceptions — the auditor should skip `:root` and `[data-theme]` blocks

### Existing hover effects conflict with Delightful patterns
Cause: Old CSS transitions clash with neo-brutalist translate + shadow pattern
Solution: Remove old `transition` and `:hover` rules before applying Delightful interaction patterns. Use `transition: all var(--motion-fast) var(--ease-out)` as the base.

## Quick Token Reference

**Colors:** `--accent-primary`, `--accent-danger`, `--accent-gold`, `--accent-cyan`, `--accent-green`, `--accent-purple` (each with `-hover`, `-subtle`, `-text` variants)

**Backgrounds:** `--bg-page`, `--bg-surface`, `--bg-elevated`, `--bg-subtle`, `--bg-muted`

**Text:** `--text-primary`, `--text-secondary`, `--text-muted`, `--text-on-accent`, `--text-on-gold`

**Spacing:** `--space-1` (4px), `--space-1-5` (6px), `--space-2` (8px) through `--space-20` (80px)

**Content font sizes:** `--step--2` through `--step-5` (fluid clamp)

**UI font sizes:** `--ui-text-2xs` (11px), `--ui-text-xs` (12px), `--ui-text-sm` (13px), `--ui-text-md` (14px), `--ui-text-lg` (15px), `--ui-text-xl` (17px)

**Control heights:** `--control-sm` (32px), `--control-md` (36px), `--control-lg` (44px), `--control-xl` (56px)

**Shadows:** `--shadow-sm` (2px), `--shadow-md` (4px), `--shadow-lg` (8px), `--shadow-pink`, `--shadow-danger`, `--shadow-gold`, `--shadow-cyan`, `--shadow-green`, `--shadow-purple`

**Radius:** `--radius-sm` (10px), `--radius-md` (16px), `--radius-lg` (24px), `--radius-xl` (32px), `--radius-full` (pill)

**Motion:** `--motion-instant` (100ms), `--motion-fast` (160ms), `--motion-base` (240ms), `--motion-slow` (360ms), `--motion-deliberate` (500ms)

**Easing:** `--ease-out`, `--ease-bounce`, `--ease-smooth`, `--ease-slam`, `--ease-elastic`
