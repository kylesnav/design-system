---
name: build-with-delightful
description: Build new web projects and UI using the Delightful design system. Use when a user says "build with delightful", "create a new page", "new project with delightful", "scaffold a UI", or wants to create components, pages, or prototypes following neo-brutalist warm boldness with oklch tokens.
allowed-tools: "Bash WebFetch"
metadata:
  author: Delightful Design System
  version: 1.0.0
  category: frontend-design
  tags: [design-system, css, neo-brutalist, oklch, ui]
---

# Build with Delightful

Build a new project or UI from the ground up using the Delightful design system.

## Instructions

### Step 1 — Read the Reference

Read `reference/design-system.md` (relative to plugin root) from this plugin. This contains all tokens, component patterns, and rules.

### Step 2 — Scaffold the Token System

Set up the project foundation:

1. Add Google Fonts link (Inter + JetBrains Mono)
2. Add the full CSS custom property system — all 3 tiers:
   - **Tier 1 — Primitives:** Raw oklch color scales (neutral, pink, red, gold, cyan, green)
   - **Tier 2 — Semantic:** Light mode + dark mode tokens (backgrounds, text, accents, borders, shadows)
   - **Tier 3 — Component:** Typography scale, spacing scale, radius scale, motion tokens, button/toggle tokens
3. Add the base reset (`*, *::before, *::after { margin: 0; padding: 0; box-sizing: border-box; }`)
4. Set body styles (font-family, font-size, line-height, color, background, font-smoothing, font-feature-settings)
5. Add global `:focus-visible` style
6. Add `prefers-reduced-motion: reduce` global guard
7. Add dark mode toggle using `data-theme` attribute on `<html>`
8. Add animation keyframes inside `@media (prefers-reduced-motion: no-preference)`

You can copy the complete token system from `themes/css/delightful-tokens.css` in this plugin.

### Step 3 — Build

Create components and pages using **only** Delightful tokens and patterns:

- Every color is a `var(--*)` token
- Every spacing value uses `var(--space-*)`
- Every font size uses `var(--step-*)`
- Every border-radius uses `var(--radius-*)`
- Shadows are solid (zero blur): `Xpx Ypx 0`
- Borders are `2px solid` on cards/buttons
- All interactive elements have: `:hover` (lift + shadow), `:active` (press + no shadow), `:focus-visible` (outline), `:disabled` (opacity 0.4)
- Neo-brutalist hover pattern: `transform: translate(-4px, -4px); box-shadow: var(--shadow-lg);`
- Neo-brutalist active pattern: `transform: translate(2px, 2px); box-shadow: 0 0 0 var(--text-primary);`

### Step 4 — Verify

Launch the `delightful-auditor` agent to scan every file produced. The auditor checks:

- Zero hardcoded colors (no hex, rgb, hsl — only `var(--*)`)
- Zero arbitrary spacing (only `var(--space-*)`)
- Zero arbitrary font sizes (only `var(--step-*)`)
- All interactive elements have hover/active/focus-visible states
- Dark mode works (semantic tokens, not primitives)
- `prefers-reduced-motion` guards on all animations
- All shadows are solid (zero blur radius)
- Border-radius uses scale (`var(--radius-*)`)

### Step 5 — Fix

If the auditor finds violations:
1. Fix each violation using the suggested token mapping
2. Re-run the auditor
3. Repeat until the report shows zero errors

### Step 6 — Visual Check

If browser tools are available (Playwright MCP), open the result and screenshot to verify it looks correct. Check both light and dark mode.

## Quick Token Reference

**Colors:** `--accent-primary`, `--accent-danger`, `--accent-gold`, `--accent-cyan`, `--accent-green` (each with `-hover`, `-subtle`, `-text` variants)

**Backgrounds:** `--bg-page`, `--bg-surface`, `--bg-elevated`, `--bg-subtle`, `--bg-muted`

**Text:** `--text-primary`, `--text-secondary`, `--text-muted`, `--text-on-accent`, `--text-on-gold`

**Spacing:** `--space-1` (4px) through `--space-20` (80px)

**Font sizes:** `--step--2` through `--step-5` (fluid clamp)

**Shadows:** `--shadow-sm` (2px), `--shadow-md` (4px), `--shadow-lg` (8px), `--shadow-pink`, `--shadow-danger`, `--shadow-gold`, `--shadow-cyan`, `--shadow-green`

**Radius:** `--radius-sm` (10px), `--radius-md` (16px), `--radius-lg` (24px), `--radius-xl` (32px), `--radius-full` (pill)

**Motion:** `--motion-instant` (100ms), `--motion-fast` (160ms), `--motion-base` (240ms), `--motion-slow` (360ms)

**Easing:** `--ease-out`, `--ease-bounce`, `--ease-smooth`

## Examples

### Example 1: Login Page
User says "Build me a login page with delightful"
Actions:
1. Scaffold token system with dark mode toggle
2. Build login form with `.input`, `.btn-primary`, `.card` components
3. Run auditor — zero violations
Result: Complete login page with dark mode, all interaction states, neo-brutalist styling

### Example 2: Dashboard
User says "Create a dashboard UI"
Actions:
1. Scaffold tokens + build KPI cards, data table, sidebar nav
2. Audit and fix any violations
Result: Full dashboard with cards, table, sidebar — all using design system tokens

### Example 3: Landing Page
User says "Build a landing page for my product"
Actions:
1. Scaffold tokens + build hero section, feature grid, CTA buttons, footer
2. Verify all typography uses fluid `--step-*` scale
3. Audit confirms zero hardcoded values
Result: Responsive landing page with warm neo-brutalist aesthetic, solid shadows, spring animations

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
