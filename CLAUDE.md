# CLAUDE.md

## Project

This is a personal design system called **Delightful**. It serves as the foundation for all of my projects — web apps, marketing sites, dashboards, data visualization, and mobile — and is a core expression of my personal brand.

The design system is built through an **iterative exploration process**. I provide feedback on visual samples, and you refine until every token, component, and interaction is dialed in. Read `archive/research.md` for the full design landscape analysis before generating anything.

**Canonical reference:** `delightful-design-system.html` — the unified, interactive design system file in the project root.

---

## Stack (locked in, do not suggest alternatives)

- **React 19+** via Next.js (App Router, Server Components)
- **Tailwind CSS v4** — CSS-first config (`@theme` directive), oklch color space
- **shadcn/ui** — copy-paste component primitives, CVA for variants
- **Radix UI** — accessible primitives underneath shadcn
- **Framer Motion / Motion** — component-level animation, spring physics
- **CSS View Transitions API** — page/route transitions (zero JS cost)
- **oklch** — all colors defined in oklch, no hex/hsl except legacy references
- **CSS custom properties** — token transport layer between Tailwind and components
- **Turborepo** — monorepo structure with pnpm workspaces
- **Storybook 9** — component documentation and visual testing
- **Lucide** — icon library (consistent with shadcn/ui default)

---

## Aesthetic North Star

### What I want
- **Warm offwhite/cream base** — not pure white, not cool/blue-tinted. Think Anthropic's `#faf9f5`
- **Near-black text** — not pure `#000000`. Warm dark, like `oklch(0.13 0.01 90)`
- **Single vivid accent used surgically** — buttons, links, selected states. That's it
- **Typography does the heavy lifting** — hierarchy through size, weight, spacing — not color or ornament
- **Generous whitespace** — when in doubt, add more space
- **Subtle, purposeful motion** — under 240ms, spring-based for movement, CSS ease-out for opacity/color
- **Border/color separation over shadows** — shadows reserved for overlays only

### What I don't want
- Gradients, glassmorphism, heavy decoration
- Overly colorful palettes or rainbow accent systems
- Generic "SaaS template" energy
- Shadows as a crutch for depth
- Anything busy, attention-seeking, or trying too hard
- Lorem ipsum — write real content in all samples

### Reference brands (in priority order)
1. **Anthropic** — warm institutional minimalism, cream backgrounds, editorial restraint
2. **Linear** — developer-tool precision, maximum restraint, typographic confidence
3. **Arc Browser** — playful but controlled, distinctive personality within minimalism
4. **Vercel** — systematic rigor, Geist type system, comprehensive token architecture
5. **Stripe** — layout craft, accessible color systems, subtle shadow mastery

---

## Design Tokens Architecture

Follow the **three-tier token model** from `research.md`:

### Tier 1 — Primitives
Raw oklch values. Named by scale, no semantic meaning. Example: `--primitive-neutral-50`, `--primitive-accent-500`.

### Tier 2 — Semantic
Purpose-driven tokens that swap for dark mode. Example: `--bg-page`, `--text-primary`, `--accent-solid`. Every semantic token that has a foreground use case gets a `-foreground` pair (shadcn convention).

### Tier 3 — Component
Scoped to specific components. Example: `--btn-bg`, `--card-border`. Compose from semantic tokens.

### Token rules
- All colors in `oklch()` — no hex, no hsl, no rgb in token definitions
- Warm neutrals: hue ~80–100°, chroma 0.003–0.020
- Accent: chroma ≥ 0.20, used sparingly
- Dark mode: increase accent lightness by ~0.10–0.15, reduce chroma slightly
- All tokens as CSS custom properties, consumed by Tailwind's `@theme`
- P3 wide gamut as progressive enhancement via `@supports`

---

## Typography Rules

- **Two fonts maximum**: one sans-serif + one monospace
- Sans candidates: Geist Sans, Inter (v4 variable)
- Mono candidates: Geist Mono, Berkeley Mono, Monaspace
- **Fluid type scale** using `clamp()` (Utopia methodology)
- Scale ratio: Minor Third (1.2) for app UI, Major Third (1.25) for marketing
- Body text: 16–18px, line-height 1.5–1.6
- Headings: tighter line-height (1.1–1.2), negative letter-spacing at large sizes
- All fonts loaded as **variable fonts** for weight/style flexibility in a single file

---

## Spacing & Layout

- **8px base grid**, 4px sub-grid for fine adjustments
- Spacing scale: `4, 8, 12, 16, 24, 32, 48, 64, 80`
- Fluid spacing via Utopia alongside fluid type
- Border radius: `4px` (inputs), `8px` (cards/modals), `9999px` (pills/avatars)
- Concentric radius rule: `inner = outer - padding`
- **Container queries** for component-level responsiveness
- **Media queries** only for page-level macro layout
- CSS Grid + Subgrid for alignment-critical layouts

---

## Motion Rules

- Default: **no motion**. Add only for `prefers-reduced-motion: no-preference`
- Durations: instant (100ms), fast (160ms), base (240ms), slow (360ms)
- Springs for movement/scale: `stiffness: 500, damping: 30` (snappy), `400/35` (standard), `300/28` (gentle)
- CSS `ease-out` for color/opacity transitions
- `AnimatePresence mode="wait"` for exit animations
- View Transitions API for page navigation
- Motion for component animation
- Define motion tokens as CSS custom properties

---

## Component Conventions

- Every component starts from **shadcn/ui** — customize, don't rebuild from scratch
- Use **CVA** (Class Variance Authority) for variant management
- All components must support: light mode, dark mode, keyboard navigation, focus-visible states
- Command palette: `cmdk`
- Data tables: TanStack Table
- Charts: Recharts (wrapped by shadcn)
- Forms: React Hook Form + Zod
- Toasts: Sonner
- Drawers: Vaul
- Icons: Lucide React, 24px default, 1.5–2px stroke, never mix outline/filled

---

## Code Style

- TypeScript strict mode, no `any`
- Functional components only, hooks for state
- `"use client"` only where necessary (motion wrappers, interactive components)
- Server Components by default
- File naming: `kebab-case.tsx` for components, `camelCase.ts` for utilities
- Export components as named exports, not default
- CSS: Tailwind utility classes first, CSS custom properties for tokens, no inline styles except oklch values not yet in the theme
- No `styled-components`, no `emotion`, no runtime CSS-in-JS

---

## File Structure

```
packages/
  tokens/          # Design token definitions (DTCG JSON → CSS vars)
  ui/              # Component library (shadcn-based)
    src/
      components/  # Individual components
      lib/         # Utilities (cn, cva configs)
      styles/      # Global styles, token CSS, font imports
  icons/           # Icon wrappers if extending Lucide
apps/
  docs/            # Storybook or documentation site
  web/             # Example consuming app
```

---

## Iterative Workflow Protocol

When I ask you to generate samples:

1. **Create self-contained files** I can preview (`.html` with inline styles/scripts, or `.jsx`)
2. **Show real content** — never lorem ipsum
3. **Include token definitions** as CSS custom properties at the top of every file
4. **Annotate design choices** as HTML comments or a small legend
5. **Always show both light and dark mode**
6. **Name files descriptively**: `direction-a-light.html`, `round-3-modal-variants.jsx`

When I give feedback:
- "Keep" / "More of this" → amplify that direction
- "Less" / "Too much" → dial it back
- "Try X instead" → explore the new direction while preserving what I've already approved
- Anything I've approved in a previous round is **locked in** unless I explicitly revisit it

---

## Quality Checklist (apply to everything you produce)

- [ ] All colors in oklch
- [ ] Meets WCAG AA contrast (4.5:1 body text, 3:1 large text)
- [ ] Focus-visible states on all interactive elements
- [ ] `prefers-reduced-motion` respected
- [ ] No orphaned tokens (every defined token is used)
- [ ] Dark mode works and looks intentional, not inverted
- [ ] Typography hierarchy is clear without relying on color
- [ ] Spacing follows the 8px grid
- [ ] Components work with keyboard alone
- [ ] Real content, not placeholder text