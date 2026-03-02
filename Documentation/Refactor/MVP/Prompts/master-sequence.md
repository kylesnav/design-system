---
title: "Master Build Sequence"
type: prompt
scope: mvp
status: active
---

# Master Build Sequence

> Orchestration prompt for building the Delightful Design System MVP. Execute phases in order. Each phase has its own prompt file with detailed instructions. Do not skip phases -- later phases depend on earlier ones.

---

## Build Order

Execute these phases strictly in order. Each phase must pass its acceptance criteria before proceeding.

### Phase 0: Scaffold
**Prompt**: [[phase-0-scaffold]]
**Goal**: Empty repo that builds, lints, and tests on every push.
**Key deliverables**: package.json, biome.json, playwright.config.ts, CLAUDE.md, CI workflow, directory structure.
**Acceptance**: `npm run lint` and `npm test` pass (trivially). CI runs green.

### Phase 1: Color Data
**Prompt**: [[phase-1-color-data]]
**Goal**: Palette exists as validated JSON -- the single source of truth for all color.
**Key deliverables**: palettes/delightful.json, palette.schema.json, emitters/validate.mjs, shared utilities, palette tests.
**Acceptance**: `npm run build` validates the palette. `npm test` verifies all constraints. Every color value from the existing system is captured.

### Phase 2: Emitter Pipeline
**Prompt**: [[phase-2-emitters]]
**Goal**: One command generates all platform outputs from palette JSON.
**Key deliverables**: 7 emitters (css, vscode, obsidian, ghostty, iterm2, starship, tailwind), orchestrator, emitter tests.
**Acceptance**: `npm run build` generates all platform outputs. Changing a color in the JSON and rebuilding updates every port automatically.

### Phase 3: Foundation & Reset
**Prompt**: [[phase-3-foundation]]
**Goal**: The structural CSS that everything builds on.
**Key deliverables**: src/reset.css, src/foundation.css, src/utilities.css.
**Acceptance**: A blank HTML page importing tokens + reset + foundation + utilities renders with correct fonts, colors, and spacing.

### Phase 4: Motion System
**Prompt**: [[phase-4-motion]]
**Goal**: All 59 CSS animations as a standalone importable stylesheet.
**Key deliverables**: src/motion/motion.css, motion tests.
**Acceptance**: motion.css imports independently alongside tokens + foundation. All 59 animations work. Reduced-motion users see no animation.

### Phase 5: Components
**Prompt**: [[phase-5-components]]
**Goal**: Every MVP component (43 total) as an individual CSS file with tests.
**Key deliverables**: 43 component CSS files, component index, component tests.
**Acceptance**: Every component works in isolation (tokens + foundation + component). Lift/press pattern is consistent. Tests pass.

#### Parallelization Strategy
Phase 5 batches (A through G, I) can be assigned to separate agents and built in parallel. Each batch is independent -- no batch depends on another batch's output. Within a batch, build components sequentially from simplest to most complex, as the simpler components establish patterns the more complex ones reuse. All batches share the same foundation (tokens + foundation CSS from Phases 0--3), so that foundation must be complete before any batch begins.

### Phase 7: Documentation Assembly
**Prompt**: [[phase-7-showcase]]
**Goal**: Interactive documentation pages assembled from source files.
**Key deliverables**: docs/index.html, docs/color.html, preview pages, docs tests.
**Acceptance**: Documentation pages render correctly, importing from source. No tokens defined inline -- everything from imported CSS.

---

## Critical Rules (Apply to ALL Phases)

1. **No primitive references in components**: Components must never reference `--primitive-*` tokens. Only semantic tokens via `var()`. Known exception: toggle knob (`--primitive-neutral-0`, `--primitive-neutral-300`).
2. **Shadow tokens use `var(--border-default)`**: All shadow token definitions use `var(--border-default)` for the shadow color, NOT `var(--text-primary)`.
3. **All component CSS wrapped in `@layer component { }`**: Every rule in every component file lives inside `@layer component`.
4. **Layer order declared once in reset.css**: `@layer reset, primitives, semantic, component, utilities;`
5. **OKLCH-authoritative for CSS**: No hex colors in tokens.css. OKLCH values written directly.
6. **Hex-authoritative for terminals**: Terminal colors are hand-tuned hex, not derived from OKLCH.
7. **Pure emitters**: All emitters are pure functions. No file I/O -- orchestrator handles writes.
8. **2px borders, solid shadows**: Neo-brutalist aesthetic. Borders are always 2px. Shadows are always solid (zero blur).
9. **Lift/press pattern**: Hover = translateY(-2px) + shadow escalation. Active = translate(2px, 2px) + shadow collapse.
10. **`prefers-reduced-motion` respected everywhere**: Global gate in reset.css. Individual checks in JS behaviors.

---

## Reference Specs

All specs live in `Documentation/Refactor/MVP/Specs/`. Each phase prompt references the specific specs it needs. The architecture overview is at `Documentation/Refactor/MVP/Architecture/mvp-architecture.md`.
