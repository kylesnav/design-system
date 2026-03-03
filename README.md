# Delightful Design System

A single design language, defined once, propagated to every tool in a developer's workspace.

Delightful is a **neo-brutalist CSS design system** built on OKLCH color science, a strict 3-tier token architecture, and a physical interaction language. The same warm palette — cream and amber in light mode, deep amber-dark in dark mode — appears in your editor, terminal, notes app, shell prompt, and web projects. Change one value in one JSON file and every platform updates.

---

## What It Produces

**For the web:** 43 CSS components, a complete token system (CSS custom properties), a 59-keyframe motion library, and foundation styles. Every component is individually importable. Every value flows from a single source of truth.

**For the terminal and editor:** VS Code themes (editor UI + ANSI colors), iTerm2 color schemes, Ghostty terminal configs, Starship prompt themes.

**For tools:** Obsidian themes (CSS), a Tailwind preset that maps design tokens to utility classes.

**As installable packages** *(post-MVP):* `@delightful/tokens`, `@delightful/css`, `@delightful/tailwind`, `@delightful/react`.

---

## Aesthetic

Neo-brutalist. Solid shadows (never blurred), 2px borders, warm cream/amber backgrounds, and tactile interactions: elements lift on hover (`translateY(-2px)`) and press flat on click (`translate(2px, 2px)`). Intentionally physical — the opposite of flat, generic SaaS design.

---

## Architecture

### Token Model — 3 Tiers, Strictly Enforced

| Tier | Count | What it is | Used by |
|------|-------|------------|---------|
| **Primitives** | 44 | Raw OKLCH color values (`--primitive-pink-400`) | Nothing directly — feeds Tier 2 only |
| **Semantic** | ~52 | What colors *mean* in context (`--accent-primary`, `--bg-page`) | Components, via Tier 3 |
| **Component** | ~80 | Usage aliases (`--btn-primary-bg: var(--accent-primary)`) | CSS components |

Components never reference Tier 1 primitives. This is enforced by the Biome linter. When dark mode switches, only the semantic layer swaps — components respond automatically.

### Build Pipeline — One Command, All Platforms

```
palettes/delightful.json
        ↓
   npm run build
        ↓
src/tokens.css          ← web CSS tokens
ports/vscode/           ← VS Code themes
ports/obsidian/         ← Obsidian theme
ports/ghostty/          ← Ghostty configs
ports/iterm2/           ← iTerm2 color schemes
ports/starship/         ← Starship prompt config
packages/tailwind/dist/ ← Tailwind preset
```

7 emitters are pure functions. The orchestrator handles all file I/O. Validation runs before any emitter — if the palette fails its schema or WCAG contrast checks, nothing is written.

### Color Authority

- **OKLCH** is canonical for CSS/web. Values are written directly — no hex conversion.
- **Hex** is canonical for terminals. Terminal colors are hand-tuned, not derived from OKLCH conversion, because terminal renderers don't interpret OKLCH reliably.

### Component Architecture

Each of 43 components lives in its own CSS file (`src/components/button.css`). All rules are wrapped in `@layer component {}`. No component imports another component. Each is importable in isolation: tokens + foundation + component = works.

---

## Current Status

**Documentation phase. No source code exists yet.**

The full build specification is complete across three packages:

| Package | Phases | Status | Scope |
|---------|--------|--------|-------|
| **MVP** | 0–7 | Ready to execute | Scaffold → color data → emitters → foundation → motion → 43 components → docs |
| **Launch** | 8 | Planning shell | npm packages, platform distribution, Claude Code plugin |
| **Roadmap** | Post-v1.0 | Deferred briefs | Batch H components (blur-grid, tilt-card, spotlight, magnetic-button), Animation JS system |

The documentation is precise enough for AI agents to execute each phase from scratch. The execution order is strict: MVP → Launch → Roadmap. Launch specs are intentionally left as planning shells pending decisions that will only be possible after the MVP build.

---

## Where to Start

| Goal | Start here |
|------|-----------|
| Understand the system architecture | [`Documentation/Refactor/MVP/Architecture/mvp-architecture.md`](Documentation/Refactor/MVP/Architecture/mvp-architecture.md) |
| Execute the build | [`Documentation/Refactor/how-to-execute.md`](Documentation/Refactor/how-to-execute.md) |
| Navigate all documentation | [`Documentation/Refactor/README.md`](Documentation/Refactor/README.md) |
| See what the finished system looks like | [`Documentation/design-reference.html`](Documentation/design-reference.html) |

---

## Repository Structure

```
Documentation/
  Refactor/
    how-to-execute.md        # Operator's guide — start here to run the build
    README.md                # Documentation package index
    MVP/                     # Phases 0–7 (85 files — full build spec)
      Architecture/
      Prompts/               # Executable phase prompts (feed to Claude Code)
      QA/                    # Acceptance checklists
      Specs/                 # Component, emitter, token, motion specs
    Launch/                  # Phase 8 (17 files — planning shell)
    Roadmap/                 # Post-v1.0 (16 files — deferred briefs)
  QA/
    sonnet-quality-audit.md  # Pre-build documentation quality audit
  design-reference.html      # Visual/behavioral reference (previous version, read-only)
```

---

## Design Reference

[`Documentation/design-reference.html`](Documentation/design-reference.html) is a snapshot of the previous version of Delightful — an ~8,000-line monolithic HTML file that served as both source of truth and showcase. It is the visual and behavioral reference for every token value, component design, interaction pattern, and animation. The entire build specification was derived from it. **Do not edit it.**
