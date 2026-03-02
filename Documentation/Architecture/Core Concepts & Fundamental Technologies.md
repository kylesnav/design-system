# Core Concepts & Fundamental Technologies

Delightful is a single design language defined once and propagated to every tool in a developer's workspace. This document defines what the system is, how it works, and what technologies make it possible.

---

## 1. What It Is

A design system that ensures visual coherence across an entire development environment — editor, terminal, notes app, shell prompt, and any web application built with it. The same warm palette, the same solid shadows, the same typographic voice appear everywhere.

The aesthetic is **neo-brutalist**: solid shadows (never blurred), thick borders (always 2px), warm backgrounds (cream in light mode, amber-dark in dark mode), and bold typography. It's intentionally physical and tactile — the opposite of flat, generic SaaS design.

The system is built on **OKLCH color science**, a perceptually uniform color space where equal numeric steps produce equal perceived differences in lightness. This is a genuine technical advantage over HSL — it means a pink-400 and a cyan-400 look equally vivid without manual tuning.

---

## 2. Three Parallel Systems

The design system is composed of three distinct subsystems, each with different portability characteristics, plus a shared foundation layer.

### 2.1 Color System

**What it is:** The OKLCH palette, the 3-tier token architecture, light/dark semantic mappings, and the color authority model.

**What it contains:**
- 44 primitive tokens across 7 families (Neutral, Pink, Red, Gold, Cyan, Green, Purple)
- ~55 semantic tokens mapping primitives to meaning (backgrounds, text, borders, accents, status, shadows)
- Light and dark mode as separate semantic mapping sets against the same primitives

**Portability:** Universal. Every platform has some concept of colors. This is the system's most portable layer — it propagates to all 6 platform ports (CSS, hex, or RGB floats depending on platform).

**Source format:** JSON (`palettes/delightful.json`). Color is data — structured key-value pairs. Any platform can consume it. Emitters convert palette JSON into platform-native formats.

**Color authority model:**
- OKLCH is authoritative for CSS-native platforms (web, Obsidian, Claude plugin)
- Hex is authoritative for terminal platforms (VS Code, Ghostty, iTerm2, Starship) — hand-tuned for specific terminal renderers, not derived via conversion

### 2.2 Motion System

**What it is:** CSS-only state communication. Animations, timing, and easing that tell users what's happening.

**What it contains:**
- 59 `@keyframes` definitions across the full motion catalog (22 present in the main design-reference showcase), organized into 10 categories (entrance, exit, feedback, attention, loading, text, scroll, state, component, advanced)
- 5 timing tokens: instant (100ms), fast (160ms), base (240ms), slow (360ms), deliberate (500ms)
- 7 easing curves: 5 cubic-bezier functions + 2 multi-point spring curves via `linear()`

**Portability:** Web-only. Exists wherever CSS animations run. Does not propagate to terminal ports.

**Source format:** CSS (`motion/motion.css`). Keyframes are CSS-native — there's no intermediate format that would be more useful. The CSS is the source.

**Key property:** Motion keyframes are mostly palette-agnostic. They animate transforms, opacity, and scale — not colors. This means the motion system works with any palette.

### 2.3 Animation System

**What it is:** JavaScript-powered interactive physics. Spring simulations, layout transitions, particle systems, canvas rendering.

**What it contains:**
- Spring physics engine (stiffness, damping, mass parameters)
- FLIP (First, Last, Invert, Play) layout transition utilities
- Particle system implementations
- Canvas-based rendering for generative effects
- 23 interactive demonstrations

**Portability:** Browser-only. Requires a JavaScript runtime with `requestAnimationFrame` and DOM/Canvas APIs.

**Source format:** JavaScript modules (`animation/spring.js`, `animation/flip.js`, `animation/particles.js`). Physics is math in code — no intermediate format helps.

**Key property:** The physics code is entirely palette-agnostic. It animates position, velocity, and acceleration. Visual styling comes from CSS tokens.

### 2.4 Foundation (Shared)

**What it is:** Structural tokens that cut across all three subsystems.

**What it contains:**
- **Typography:** Inter (sans) and JetBrains Mono (mono). Fluid scale via `clamp()` for headings/body. Fixed scale for UI controls (11–17px).
- **Spacing:** 4px base unit. 12 stops from 4px to 80px.
- **Radius:** 10px, 16px, 24px, 32px, 9999px. Deliberately large — softness within a bold system.
- **Control heights:** 32px, 36px, 44px, 56px.
- **Shadows:** Solid (zero blur). 3 sizes: 2px, 4px, 8px offset. 6 colored variants.
- **Z-index:** 7 named levels from base (1) to tooltip (1500).
- **Container widths:** 640px, 960px, 1200px.

---

## 3. The Token Architecture

Design decisions are encoded as **CSS custom properties** organized into three strict tiers using **CSS cascade layers**.

### 3.1 Cascade Layer Order

```css
@layer reset, primitives, semantic, component, utilities;
```

Each layer has deterministic specificity — higher layers override lower ones without specificity hacks or `!important`. This is the backbone of the system's predictability.

### 3.2 Tier 1 — Primitives

Raw values with no semantic meaning. Named by family and intensity.

```css
--primitive-pink-400: oklch(0.640 0.270 350);
--primitive-neutral-100: oklch(0.960 0.010 70);
```

44 tokens total. 7 color families:

| Family | Hue | Role | Stops |
|--------|-----|------|-------|
| Neutral | 70 | Backgrounds, text, borders | 14 (0–950) |
| Pink | 350 | Primary brand | 5 (100–500) |
| Red | 20 | Danger/error | 5 (100–500) |
| Gold | 85 | Warning | 5 (100–500) |
| Cyan | 210 | Tertiary | 5 (100–500) |
| Green | 148 | Success | 5 (100–500) |
| Purple | 300 | Creative | 5 (100–500) |

Neutral uses warm hue 70 (cream/amber) — never cold gray. Each accent family has 5 stops with lightness decreasing and chroma increasing as the stop number rises.

### 3.3 Tier 2 — Semantic

What values mean in context. Light and dark modes are separate sets of mappings against the same primitives.

```css
/* Light */
--bg-page: oklch(0.982 0.008 70);       /* warm cream */
--accent-primary: oklch(0.640 0.270 350); /* hot pink */
--shadow-md: 4px 4px 0 var(--text-primary); /* dark shadow on light */

/* Dark */
--bg-page: oklch(0.140 0.014 65);       /* warm dark */
--accent-primary: oklch(0.700 0.230 350); /* brighter pink */
--shadow-md: 4px 4px 0 oklch(0.92 0.010 65); /* cream shadow on dark */
```

Categories:
- **Backgrounds** (5): page, surface, elevated, subtle, muted
- **Text** (5): primary, secondary, muted, on-accent, on-gold
- **Borders** (3): default, strong, subtle
- **Accents** (24): 6 families × 4 variants (base, hover, subtle, text)
- **Status** (4): info → primary, error → danger, warning → gold, success → green
- **Shadows** (9): sm/md/lg sizes + 6 colored variants
- **Focus/Overlay** (2): focus ring, overlay background

Key design decisions:
- Dark mode accents are brighter (higher lightness) for contrast
- Dark mode shadows invert: cream on dark instead of dark on light
- Borders in light mode use `var(--text-primary)` — bold, neo-brutalist

### 3.4 Tier 3 — Component

How the system is used by UI elements. References semantic tokens — never primitives.

```css
--btn-primary-bg: var(--accent-primary);
--btn-primary-text: var(--text-on-accent);
--toggle-on-bg: var(--accent-primary);
```

Includes button color mappings (7 variants), badge spacing, toggle states, plus all foundation tokens (typography, spacing, radius, motion, easing, z-index).

### 3.5 The Strict Rule

**Components never reference primitives.** Every component token goes through the semantic layer. This is what makes palette swapping possible — change the semantic mappings and every component updates.

One known violation exists: `--toggle-knob: var(--primitive-neutral-0)` bypasses the semantic layer, causing the toggle knob to render as pure white in dark mode. This is a blocking fix.

---

## 4. Neo-Brutalist Interaction Model

All interactive elements follow the same physical metaphor — objects that lift when you reach for them and press flat when you push them.

### 4.1 The Lift/Press Pattern

| State | Transform | Shadow |
|-------|-----------|--------|
| Base | none | `var(--shadow-sm)` or `var(--shadow-md)` |
| Hover | `translateY(-2px)` | Escalates one size (sm → md, md → lg) |
| Active | `translate(2px, 2px)` | `0 0 0` (shadow disappears — object is flush) |
| Disabled | none | Base shadow | `opacity: 0.4; pointer-events: none` |

This applies uniformly to: buttons, cards, tiles, badges, pagination buttons, sidebar items. The consistency creates a learnable physical language.

### 4.2 Shadow Sizes

All shadows are solid (zero blur) — the signature neo-brutalist treatment.

- **sm**: `2px 2px 0` — subtle depth (buttons, badges)
- **md**: `4px 4px 0` — standard depth (cards, alerts)
- **lg**: `8px 8px 0` — maximum depth (hovered cards, tiles)
- **Colored**: `4px 4px 0` in accent color (featured cards, colored alerts)

---

## 5. Theme System

### 5.1 Two-State Toggle

A strict two-state toggle: light ↔ dark. The user's OS preference (`prefers-color-scheme`) is used only as a silent initialization fallback — if no `localStorage` value exists, the system reads the OS preference to set the initial theme. Once the user clicks the toggle, the choice is locked to `light` or `dark` and persisted to `localStorage`. There is no user-selectable "system" mode. State is stored in the `data-theme` attribute on the document root element.

### 5.2 Light Mode

Warm cream backgrounds (`oklch(0.982 0.008 70)`). Dark text. Dark borders. Dark shadows. The warmth comes from the hue 70 tint in every neutral — never cold gray.

### 5.3 Dark Mode

Warm dark backgrounds (`oklch(0.140 0.014 65)`) — amber-tinted, not blue-black. Light text. Muted borders. Inverted shadows (cream on dark). Accents are brighter (higher lightness values) to maintain contrast.

Dark mode is designed from scratch — it is not an inversion of light mode. Each semantic token has an independent dark value chosen for the dark context.

---

## 6. Sync & Propagation

### 6.1 The Dependency Graph

Sources feed documentation and distribution — never the reverse.

```
palettes/delightful.json           (color authority)
motion/motion.css                  (motion authority)
animation/*.js                     (animation authority)
foundation tokens (in component)   (structural authority)
        │
        ├──→ Emitters ──→ Platform-native outputs
        │       ├── CSS emitter → tokens.css, obsidian theme
        │       ├── HTML assembler → documentation pages
        │       ├── VS Code emitter → color theme JSON (hex via culori)
        │       ├── Terminal emitters → Ghostty, iTerm2 configs
        │       └── Package bundler → npm packages
        │
        └──→ Documentation HTML pages (assembled, import sources)
                ├── delightful-design-system.html
                ├── delightful-color.html
                ├── delightful-motion.html
                └── delightful-animation.html
```

All emitters implement a shared contract: `emit(palette, options) → { files: [{ path, content }], warnings: [] }`. The orchestrator handles file I/O and warning aggregation; emitters are pure functions that produce output strings.

### 6.2 The Color Authority Model

| Platform | Native Format | Conversion | Sync Method |
|----------|--------------|------------|-------------|
| Web (CSS) | OKLCH | None needed | CSS emitter |
| Obsidian | OKLCH (CSS) | None needed | CSS emitter |
| Claude Plugin | OKLCH (CSS) | None needed | CSS emitter |
| VS Code | Hex (JSON) | OKLCH → hex via culori | VS Code emitter |
| iTerm2 | RGB floats (XML) | OKLCH → hex → RGB | Terminal emitter |
| Ghostty | Hex (plain text) | Hand-tuned | Terminal emitter |
| Starship | Hex (TOML) | Hand-tuned | Terminal emitter |

OKLCH is authoritative for CSS-native platforms. Hex is authoritative for terminals — because OKLCH → hex conversion can lose nuance in terminal color renderers, terminal palettes are hand-tuned and maintained as hex.

### 6.3 Version Management

All distribution packages share a version number. A bump script atomically updates the version in 6 canonical files and creates a git tag. No manual version edits.

---

## 7. Fundamental Technologies

Every technology listed here is essential — removing any one would break a core capability.

### 7.1 Color

| Technology | Role |
|-----------|------|
| **OKLCH** | Color space for all 44 primitives. Perceptual uniformity ensures equal numeric steps produce equal perceived lightness differences. |
| **CSS Custom Properties** | Token delivery mechanism. 270+ properties across 3 tiers. Enable runtime theme switching via `data-theme` attribute. |
| **CSS Cascade Layers** | Specificity control. `@layer reset, primitives, semantic, component, utilities` provides deterministic override order without `!important`. |
| **culori** (JS library) | OKLCH → sRGB hex conversion with `clampChroma()` for gamut mapping. Used by VS Code and iTerm2 emitters. |

### 7.2 Typography & Layout

| Technology | Role |
|-----------|------|
| **`clamp()` CSS function** | Fluid typography. `clamp(1rem, 0.913rem + 0.43vi, 1.25rem)` scales with viewport while respecting min/max bounds. |
| **Inter** (Google Fonts) | Primary sans-serif typeface. Variable font with weight 100–900. |
| **JetBrains Mono** (Google Fonts) | Monospace typeface. Used in code blocks, terminal references, UI labels. Stylistic sets cv02/cv03/cv04/cv11 for terminal ports. |
| **CSS Grid / Flexbox** | Layout primitives for component grids (2/3/4-column), bento layouts, and responsive breakpoints. |
| **CSS Container Queries** | Component-level responsive design. Components adapt to their container size, not viewport size. |

### 7.3 Motion & Animation

| Technology | Role |
|-----------|------|
| **`linear()` CSS function** | Multi-point spring easing curves without JavaScript. Approximates spring physics as a CSS timing function. Two presets: `--ease-spring-gentle`, `--ease-spring-bouncy`. |
| **CSS `@keyframes`** | 59 named animations across the full motion catalog (22 in the main design-reference showcase), organized into 10 categories. Standard CSS animation mechanism — no library needed. |
| **`prefers-reduced-motion`** | Accessibility gate. All animations are disabled (duration → 0.01ms) when the user's OS preference requests reduced motion. |
| **`requestAnimationFrame`** | Browser API for smooth 60fps JavaScript animations. Used by spring physics, FLIP, and particle systems. |
| **Canvas API** | 2D rendering context for particle systems and generative effects. |

### 7.4 Infrastructure

| Technology | Role |
|-----------|------|
| **HTML** | Assembled documentation format. Pages import source CSS/JS files — they don't define tokens or components. Inspectable and forkable. |
| **Node.js** | Script runtime for emitter pipeline, validation, version bumping. |
| **Biome** | Linter and formatter. Runs on every push via CI/CD. Catches token tier violations and code quality issues mechanically. |
| **Playwright** | Component and integration testing. Per-component visual regression, token consistency, interaction states, motion accessibility, port parity. |
| **Git** | Version control. Feature branches per ticket, clean main branch (merge commits only), annotated version tags. |
| **JSON Schema** | Palette validation. Ensures structural correctness of `palettes/delightful.json` before emitters run. |
| **npm workspaces** | Monorepo package management. Coordinates `@delightful/tokens`, `@delightful/css`, `@delightful/tailwind`, and `@delightful/react` under one repo. |

### 7.5 Platform-Specific

| Technology | Platform | Role |
|-----------|----------|------|
| **VS Code Color Theme API** | VS Code | 324 color property mappings for editor, UI, syntax, terminal ANSI, debug. |
| **Obsidian CSS Variables** | Obsidian | Native theme mechanism. `--d-*` namespace avoids conflicts with Obsidian internals. |
| **Style Settings plugin API** | Obsidian | Exposes accent color, shadow style, border weight, heading scale as user-configurable options. |
| **iTerm2 `.itermcolors` (plist XML)** | iTerm2 | Apple property list format for terminal color profiles. RGB floats 0.0–1.0. |
| **Ghostty config format** | Ghostty | Plain-text `key = value` for colors, font, and window settings. Optional GLSL shaders (bloom, vignette). |
| **Starship TOML** | Shell prompt | Prompt segment configuration with hex color values. |

---

## 8. Component Architecture

### 8.1 Inventory (47 components)

Organized by function:

**Layout:** page wrap, section containers, 2/3/4-column grids, bento grid
**Navigation:** sticky topnav (backdrop-blur), tabs, breadcrumbs, pagination, sidebar
**Content:** cards (base, interactive, featured, compact), code blocks (syntax highlighted), empty states
**Actions:** buttons (7 color variants, 3 sizes, ghost/icon/loading states)
**Forms:** input, textarea, select, multi-select (tag-style), checkbox, radio, toggle, range slider
**Data:** sortable/selectable data table, stepper with progress
**Feedback:** toast notifications (4 types, auto-dismiss, progress bar), alerts (6 colors), modal dialog, drawer panel
**Display:** badges (6 colors), avatars (3 sizes, group), tooltips, popovers
**Loading:** skeleton (shimmer + pulse modes), staggered reveal
**Signature:** blur-focus grid, 3D tilt card, cursor spotlight, magnetic button
**Compositions:** sidebar + main layout, full app frame

### 8.2 Interaction Consistency

Every interactive component implements the lift/press pattern from §4.1. Buttons, cards, tiles, badges, sidebar items, and pagination all share the same physical metaphor. This is enforced by convention, not by a shared base class.

### 8.3 Accessibility

- Skip link to main content
- ARIA roles (combobox on command palette, proper table semantics, labeled buttons)
- Full keyboard navigation (command palette, data table, stepper)
- `prefers-reduced-motion` respected globally
- Focus visible: 2px solid outline with 2px offset
- Screen reader text via `.sr-only` class
- Form controls with proper `<label>` associations

---

## 9. What 1.0 Requires

The system becomes 1.0 when it crosses a credibility threshold: installable, discoverable, documented, validated, and trustworthy.

### 9.1 Installable
- `@delightful/tokens` on npm (CSS + JSON + JS exports)
- `@delightful/css` on npm (individual component stylesheets)
- One-click install on all 6 platform directories

### 9.2 Discoverable
- Present in Obsidian Community Themes, Ghostty built-in, iTerm2-Color-Schemes, VS Code Marketplace (current version), Starship presets

### 9.3 Documented
- Anchor blog post: "Building an OKLCH Design System in 8 Days with Claude Code"
- This technical documentation

### 9.4 Validated
- Noted Terminal as a real product built with the system
- Claude Code plugin dog-fooded on a real project

### 9.5 Trustworthy
- CI/CD running on every PR
- Visual regression tests with real baselines
- Token tier violations caught mechanically
- Zero known blocking issues
