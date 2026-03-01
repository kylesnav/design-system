# Changelog

All notable changes to the Delightful Design System are documented in this file.

Format follows [Keep a Changelog](https://keepachangelog.com/). Versions follow [Semantic Versioning](https://semver.org/).

## [0.6.0] — 2026-03-01

### Added

- **Light and dark preview showcases** — `preview-light.html` and `preview-dark.html` for quick visual reference
- **Component preview poster** and VS Code example screenshots
- **Platform screenshots** for Ghostty, iTerm2, and Obsidian (light + dark)
- **Per-package screenshots** in each package directory for distribution repo sync
- **iTerm2 profile generation script** (`iterm2/scripts/generate-profiles.mjs`) and color profiles moved to `colors/`
- **iTerm2 documentation** — font recommendations, tmux integration settings, dual-mode color switching
- **iTerm2 smart-open** setup added to shell docs
- **Distribution repo sync documentation** — all 6 sync relationships documented
- **Codex and Gemini CLI aliases** in zshrc-snippet (`x`, `xx`, `g`, `gg`, and resume variants)
- **LICENSE files** added to vscode-theme, ghostty, iterm2, and shell packages
- **Per-package .gitignore files** for all 6 packages

### Changed

- **Monorepo README rewritten** with ecosystem table and comprehensive documentation (KS-13)
- **Monorepo polished** for external visitors (KS-6)
- **Ghostty package restructured** — split into installable themes + personal config
- **iTerm2 light preset renamed** to Delightful-Light with dual-mode docs
- Added 'joyful' to design system description
- Updated zshrc-snippet with improved clear reliability
- Simplified CLAUDE.md — split automated/manual propagation, trimmed conventions
- Removed Data Visualization section (unused)
- Removed personal name from demos

### Fixed

- **Obsidian theme** reviewed and fixed for submission compliance (KS-1)
- **Ghostty theme** — improved contrast and blue/cyan consistency (KS-2)
- **Terminal themes** — fixed blue/cyan identity across Ghostty and iTerm2 (KS-3)
- **VS Code theme** — fixed ANSI palette and promoted syntax tokens to semantic layer
- **ANSI yellow** — restored on-brand gold across monorepo (light mode)
- **Stepper shadow** fix in preview showcases

## [0.5.0] — 2026-02-27

### Fixed

- **Cascade layer integrity** — removed duplicate unwrapped semantic token blocks from `delightful-motion.html` and `delightful-animation.html` that were overriding `@layer semantic` definitions
- **Layer declaration** — added `@layer reset, primitives, semantic, component, utilities;` to motion and animation HTML files for consistent cascade ordering
- **VSCode themes** regenerated from latest OKLCH tokens
- **Downstream sync** — synced `delightful-claude-plugin` and `obsidian-delightful` distribution repos to match monorepo

### Changed

- Universal pounce/sink interactions and overflow clipping
- Consistent press behavior across interactive elements
- Obsidian theme: alt-checkbox toggle, notice/button variant coverage, reduced motion support

## [0.4.9] — 2026-02-27

### Added

- **Animation system** (`delightful-animation.html`) — 3,433-line self-contained showcase with 10 categories, 23 interactive demos: spring physics, particle systems, physics playground, FLIP layout transitions, gestures and drag, generative art, cursor and interactive effects, SVG morphing, splashy effects, and combined demos
- **@layer cascade architecture** — All CSS organized into `@layer reset, primitives, semantic, component, utilities` for predictable specificity
- **Native CSS nesting** — All component CSS converted to nested syntax with `&` parent selector, reducing ~78 lines while improving readability
- **Container queries** — `@container` queries on grid layouts for responsive behavior based on container width rather than viewport
- **Utility class layer** — Common layout and typography utilities (flex, gap, margin, text, sizing) in a dedicated cascade layer
- **Bento grid** component with span/tall/wide modifiers and responsive column collapse
- **Accordion** component using native `<details>`/`<summary>` for built-in accessibility, with animated +/x indicator and `interpolate-size: allow-keywords`
- **Skeleton loading variants** — `.skel-circle`, `.skel-text`, `.skel-heading`, `.skel-card`, `.skel-avatar-sm/lg` semantic classes
- **Slider group** component with value label, tick marks, and `font-variant-numeric: tabular-nums`
- **Button loading state** — `.btn-loading` modifier with CSS-only spinner using `currentColor`-aware border technique
- **Skip navigation link** as first element in `<body>`, visible on focus
- **ARIA live regions** on toast container for screen reader announcements
- **`@starting-style`** entry animations for modals and command palette, replacing ~30 lines of JS animation orchestration with pure CSS
- **`linear()` spring easing** custom properties (`--ease-spring-gentle`, `--ease-spring-bouncy`) with SVG visualizations
- **View Transitions API** for theme toggle crossfade effect
- **`content-visibility: auto`** on motion sections for scroll performance
- **`interpolate-size: allow-keywords`** for native `height: auto` transitions
- **Touch targets** — `@media (pointer: coarse)` rules for 44px minimum targets on interactive elements
- **Responsive stacked data table** layout for viewports under 600px
- Smart-open iTerm2 Semantic History handler (Cmd+click file paths)

### Changed

- Form controls now use native `<input type="checkbox">` and `<input type="radio">` instead of span-based custom controls
- Toggle switches use `role="switch"` and `aria-checked` attributes instead of `.on` class
- All form labels have `id`/`for` pairs; decorative SVGs have `aria-hidden="true"`
- Heading hierarchy fixed — replaced `<div class="subsection-title">` with `<h3>` for proper semantics
- Magic numbers replaced with token references (e.g., `calc(100% - 32px)` to `calc(100% - var(--space-8))`)
- Motion hero section upgraded with animated preview grid, CTA button, and bouncing dots

### Fixed

- Skip link, ARIA live regions, and heading hierarchy (3 critical a11y fixes)
- Animation count comment corrected from "55 animations" to "59 named demos"
- Token sync script updated to handle `@layer` wrapping around token blocks
- Setup script now maps Shift+Enter across all iTerm2 profiles, not just index 0

## [0.4.5] — 2025-12-15

### Added

- **Purple color family** — 5 primitive stops and 4 semantic tokens (base, hover, subtle, text), usable as creative/special accent
- **Animation system** (initial) — Token block and page structure for JS-powered animation showcase
- Dark mode border fix — muted `--border-default` and bright `--border-strong` for emphasis
- Version bump tooling (`npm run bump <version>`) to update all 6 version files at once

## [0.4.0] — 2025-11-28

### Changed

- Motion system border bug fixed
- Clipboard and skeleton JS hardened against edge cases
- README polished with ecosystem table and terminal setup instructions
- Archive artifacts cleaned up

## [0.3.1] — 2025-11-20

### Changed

- All 6 version files unified to 0.3.1
- Junk files deleted, manifests cleaned

## [0.3.0] — 2025-11-15

### Added

- Design system screenshots (light and dark mode)
- VSCode color theme extension with light and dark variants, generated from OKLCH tokens
- iTerm2 color profile
- Ghostty terminal theme with optional GLSL shaders
- Terminal setup documentation for iTerm2 and Ghostty
- Missing CSS tokens and components to design system
- Obsidian theme LICENSE and screenshot
- V3 Neo-Brutalist branding with token sync script

### Fixed

- Dark gold colors corrected, responsive CSS added, propagated to all derivatives
- Obsidian theme light pink bleed in HSL-derived accents
- Obsidian theme hover colors and delete confirmation button

## [0.2.0] — 2025-10-28

Initial public release with V2 palette, docs, Ghostty theme, and LICENSE.
