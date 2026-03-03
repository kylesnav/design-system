---
title: "Execution Guide — MVP Build"
type: operator-guide
scope: mvp
status: active
---

# Execution Guide — Delightful Design System MVP

How to orchestrate the MVP build using Claude Code and AI agents. This guide is written for a technical operator who understands what needs to be built but has not run this type of agent-driven workflow before.

---

## What You're Doing

The MVP documentation is a set of executable specifications. Each phase has a prompt file designed to be fed to a Claude Code agent. The agent reads the prompt, reads the referenced spec files, builds the deliverables, and runs the acceptance checks. You review the output, verify the phase passed, then start the next phase.

**You are the orchestrator.** The agents do the building. Your job is to:
- Start each phase with the right prompt
- Review what the agent produces
- Verify QA criteria before moving to the next phase
- Catch and correct any rule violations

---

## Prerequisites

- **Node.js 20+** and npm installed
- **Claude Code CLI** (`npm install -g @anthropic-ai/claude-code`)
- This repo cloned locally and `cd`'d into it
- A Claude account with enough context (Sonnet is sufficient for most phases; Opus for Phase 5 component batches)

---

## How to Start a Phase

Each phase is a markdown prompt file. The workflow is:

```bash
# Start Claude Code in this repo directory
claude

# Then in the Claude Code session, tell it to read and execute the phase prompt:
# "Read Documentation/Refactor/MVP/Prompts/phase-0-scaffold.md and execute it."
```

Claude Code will read the prompt, load the referenced spec files, and begin building. Keep the session open until the phase's acceptance criteria are met.

**One Claude Code session per phase.** Do not carry the same session across multiple phases — each prompt is self-contained and a fresh session avoids context contamination from the previous phase.

---

## Phase Execution Order

### Phase 0: Scaffold

**Prompt file:** `Documentation/Refactor/MVP/Prompts/phase-0-scaffold.md`

**What it builds:** The empty repo structure — `package.json`, Biome linter config, Playwright test config, `CLAUDE.md` conventions file, GitHub Actions CI workflow, and all directory scaffolding.

**Done when:**
- `npm run lint` passes (nothing to lint yet, but the command works)
- `npm test` passes (no tests yet, but the runner works)
- CI runs green on push

**No QA checklist** — acceptance is built into the prompt itself.

---

### Phase 1: Color Data

**Prompt file:** `Documentation/Refactor/MVP/Prompts/phase-1-color-data.md`

**What it builds:** `palettes/delightful.json` (the single source of truth for all color), the JSON schema that validates it, a shared validation utility, and palette tests.

**Done when:**
- `npm run build` validates the palette successfully with no errors
- `npm test` passes all palette constraint checks (color family counts, required keys, OKLCH format)

**QA:** `Documentation/Refactor/MVP/QA/build-validation.md` — palette section

---

### Phase 2: Emitter Pipeline

**Prompt file:** `Documentation/Refactor/MVP/Prompts/phase-2-emitters.md`

**What it builds:** 7 emitters (`css`, `vscode`, `obsidian`, `ghostty`, `iterm2`, `starship`, `tailwind`) as pure ES modules, plus the orchestrator that runs them all. One `npm run build` command generates all platform outputs.

**Done when:**
- `npm run build` runs cleanly and writes all output files
- All 7 platform port files are present in `ports/` and `packages/tailwind/dist/`
- Changing one color value in `palettes/delightful.json` and rebuilding updates every port automatically

**QA:** `Documentation/Refactor/MVP/QA/build-validation.md` — emitter section

---

### Phase 3: Foundation & Reset

**Prompt file:** `Documentation/Refactor/MVP/Prompts/phase-3-foundation.md`

**What it builds:** `src/reset.css` (cascade layer declaration + browser defaults reset), `src/foundation.css` (all Tier 3 component tokens + foundation rules), `src/utilities.css` (~28 utility classes).

**Done when:**
- A blank HTML page that imports `tokens.css` + `reset.css` + `foundation.css` + `utilities.css` renders with correct fonts, colors, spacing, and no visual artifacts
- `npm run lint` passes on all authored CSS files

**QA:** Visual check against `Documentation/design-reference.html`. No dedicated checklist for this phase.

---

### Phase 4: Motion System

**Prompt file:** `Documentation/Refactor/MVP/Prompts/phase-4-motion.md`

**What it builds:** `src/motion/motion.css` containing all 59 CSS keyframes and animation utility classes (`.animate-fade-in`, `.animate-spring-pop`, etc.).

**Done when:**
- `motion.css` imports correctly alongside tokens + foundation
- All 59 keyframes are present and named correctly
- A test page demonstrates animations working
- Users with `prefers-reduced-motion: reduce` see no animation

**QA:** `Documentation/Refactor/MVP/QA/motion-checklist.md`

---

### Phase 5: Components

**Prompt file:** `Documentation/Refactor/MVP/Prompts/phase-5-components.md`

**What it builds:** All 43 MVP components as individual CSS files in `src/components/`, plus `src/components/index.css` (imports all 43), plus tests for each component.

Components are organized into 8 batches (A through G, I), from simplest to most complex:

| Batch | Components |
|-------|-----------|
| A | Badge, Avatar, Divider, Skip Link, Notification Badge |
| B | Button, Checkbox, Radio, Toggle, Range |
| C | Input, Textarea, Select, Multi-Select |
| D | Card, Tile, Bento Grid, Alert, Progress, Skeleton |
| E | Toast, Tooltip, Popover, Dropdown, Modal, Drawer |
| F | Accordion, Tabs, Segmented Control, Stepper, Pagination |
| G | Topnav, Sidebar, Sidebar Layout, Breadcrumbs, Back to Top |
| I | Command Palette, Table, Empty State, Staggered Reveal, Code Block, Scroll Progress, Page Transitions |

#### Option A — Sequential (simpler, recommended for first run)

Feed the Phase 5 prompt to a single Claude Code session. It builds all batches in order. Takes more wall-clock time but requires no coordination overhead.

#### Option B — Parallel (faster, for experienced operators)

Assign each batch to a separate Claude Code session running simultaneously. Each batch is fully independent — no batch output depends on another batch's output. They all share the same foundation from Phases 0–4, which must be complete before any batch begins.

If running in parallel:
- Within each batch, still build sequentially (simplest component first — it establishes patterns for the more complex ones)
- After all batches finish, run the full component QA checklist across all 43

**Done when:**
- 43 files exist in `src/components/*.css`
- Each component works in isolation: importing tokens + foundation + that single component file produces a correct, styled component
- `src/components/index.css` imports all 43
- `npm test` passes all component tests

**QA:** `Documentation/Refactor/MVP/QA/component-checklist.md` — run this for all 43 components

---

### Phase 7: Documentation Assembly

**Prompt file:** `Documentation/Refactor/MVP/Prompts/phase-7-showcase.md`

**What it builds:** Interactive documentation pages — `docs/index.html` (component showcase), `docs/color.html` (token reference), light/dark preview pages.

**Done when:**
- Documentation pages open in a browser and render correctly
- No token values are defined inline — all values come from imported CSS
- Light and dark mode both work on all pages
- Pages can be opened as static files (no server required)

**QA:** Visual review against `Documentation/design-reference.html`. The documentation pages should demonstrate the same components, tokens, and interactions shown in the reference.

---

## Between Every Phase: The Checklist

Before starting the next phase, run through this every time:

```bash
npm run build    # Must succeed, no errors
npm test         # All tests pass
npm run lint     # Zero violations
```

If any of these fail: **fix it before proceeding.** Do not carry broken state into the next phase. Broken state compounds — a lint error in Phase 3 that gets ignored will affect every component file in Phase 5.

**Commit each completed phase** before starting the next. A clean commit per phase makes it easy to revert a bad phase without losing earlier work.

---

## Rules to Enforce

These are non-negotiable. If an agent produces output that violates any of these, reject it and have the agent fix it in the same session before proceeding.

| Rule | Why |
|------|-----|
| No `--primitive-*` references in components | Components must respond to theme switching. Direct primitive references bypass the semantic layer and break dark mode. *Exception: toggle knob — `--primitive-neutral-0`, `--primitive-neutral-300`* |
| Shadow tokens use `var(--border-default)` | Not `var(--text-primary)`. This was a documented error in the original specs — the corrected value is `var(--border-default)` |
| All component CSS wrapped in `@layer component {}` | No exceptions. Rules outside `@layer` would have higher priority than utilities, breaking the cascade |
| No hex colors in `tokens.css` | OKLCH only. The web platform renders OKLCH natively — no conversion needed |
| Borders are always 2px | 1px borders break the neo-brutalist aesthetic |
| Shadows are always solid (zero blur) | `4px 4px 0` not `4px 4px 4px`. The zero-blur solid shadow is the signature visual element |
| Lift/press values are exact | Hover: `translateY(-2px)`. Active: `translate(2px, 2px)`. Do not change these values |
| `prefers-reduced-motion` respected | The global gate in `reset.css` handles CSS animations. JS-driven behaviors need their own reduced-motion check |

---

## What "MVP Done" Looks Like

The MVP is complete when all of these are true:

- [ ] 43 component files exist in `src/components/*.css` and all tests pass
- [ ] `npm run build` generates all 7 platform outputs without errors
- [ ] `npm test` passes (palette, emitters, components, motion)
- [ ] `npm run lint` passes with zero violations
- [ ] Documentation pages load and render correctly in a browser
- [ ] Light and dark mode work on all components and pages
- [ ] `prefers-reduced-motion` disables all animations system-wide
- [ ] CI runs green

---

## After MVP: What Comes Next

**Launch (Phase 8)** — npm packages and platform distribution. The Launch specs (`Documentation/Refactor/Launch/`) are currently planning shells. Before executing Launch, the open questions in each Launch spec must be resolved — decisions that depend on what you learned during the MVP build (bundler choice, React version support, etc.). Read `Documentation/Refactor/Launch/Architecture/launch-architecture.md` first.

**Roadmap (Post-v1.0)** — Batch H components (blur-grid, tilt-card, spotlight, magnetic-button) and the Animation JS system (`spring.js`, `flip.js`, `particles.js`). These are deferred because they require JavaScript infrastructure that should not be built before the CSS foundation is proven stable. Read `Documentation/Refactor/Roadmap/Architecture/roadmap-architecture.md` for the full rationale and dependency graph.
