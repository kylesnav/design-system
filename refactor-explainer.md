# Delightful Design System — Refactor Plan Explained

> Written for a product manager. Start here, dive deeper as needed.

---

## What Is This Refactor?

### The Problem

Right now, the Delightful Design System lives inside a single massive HTML file (`delightful-design-system.html`). Every color, every spacing value, every component style, every animation — it's all in one file. Think of it like a restaurant where the kitchen, dining room, storage, and office are all in one room. It works, but it's fragile:

- **Changing one color means searching through thousands of lines** to find every place it's used.
- **Adding a new component risks breaking an existing one** because everything shares the same space.
- **Other platforms (VS Code, Obsidian, terminals) are updated by hand** — someone manually copies color values between files, which means they drift out of sync.
- **No automated testing** — you can't verify that a change didn't break something without eyeballing every page in both light and dark mode.

### What the Refactor Produces

A proper build system where:

1. **Colors are defined once** in a single JSON file (`palette.json`). That's the single source of truth.
2. **A build pipeline** reads that JSON and automatically generates theme files for every platform — VS Code, Obsidian, Ghostty, iTerm2, Starship, Tailwind, and the web CSS.
3. **Each component is its own file** — button.css, card.css, toast.css — that can be tested, imported, and maintained independently.
4. **Automated tests** catch regressions before they ship.
5. **Eventually, installable npm packages** (`@delightful/tokens`, `@delightful/css`, `@delightful/react`) that anyone can `npm install`.

**The analogy**: We're going from a hand-built house where every wall is load-bearing, to a modular building where you can swap out a room without collapsing the structure.

---

## Phase-by-Phase Breakdown

The refactor is organized into 8 phases (0–7, with Phase 6 deferred to post-v1.0). Each phase builds on the previous one. Think of it like constructing a building — you can't install plumbing before pouring the foundation.

### Phase 0: Scaffold
**What it does**: Creates the empty project structure — folders, configuration files, and the CI/CD pipeline that will run tests on every change.

**Why it matters**: Every phase after this pushes code through the same build/test/lint pipeline. If the pipeline isn't working from day one, errors compound silently. This is the "pour the foundation and connect utilities" step.

**What "done" looks like**: You can run `npm run lint`, `npm test`, and push to GitHub — and all of it passes (trivially, since there's no code yet).

**Effort**: Small. ~1 Claude Code session.

---

### Phase 1: Color Data
**What it does**: Extracts every color from the existing design system into a structured JSON file (`palettes/delightful.json`), plus a schema that validates the format is correct.

**Why it matters**: This JSON file becomes the **single source of truth** for all color everywhere. Instead of 7 different files each containing their own copy of "Delightful Pink," there's one definition, and everything else is generated from it.

**What "done" looks like**: The JSON exists, passes validation, and every color from the current system is captured — 7 color families (neutral, pink, red, gold, cyan, green, purple), each with 5 intensity levels, plus terminal-specific hex values.

**Effort**: Small-medium. ~1 session.

---

### Phase 2: Emitter Pipeline
**What it does**: Builds 7 "emitters" — small programs that each know how to translate the palette JSON into a specific platform's format.

| Emitter | What it generates |
|---------|-------------------|
| CSS | Web tokens (OKLCH custom properties) |
| VS Code | Editor theme JSON (hex colors) |
| Obsidian | Note-taking app theme (CSS) |
| Ghostty | Terminal theme (plain text config) |
| iTerm2 | Terminal theme (XML color profiles) |
| Starship | Shell prompt theme (TOML config) |
| Tailwind | CSS framework preset (JS) |

All 7 run from a single command: `npm run build`. Change a pink value in the JSON, rebuild, and every platform updates automatically.

**Why it matters**: This eliminates the manual copy-paste workflow that causes platforms to drift out of sync. It's the difference between updating 7 files by hand vs. updating 1 file and pressing a button.

**What "done" looks like**: `npm run build` generates all 7 outputs. You can change one color in the JSON, rebuild, and verify every output changed.

**Effort**: Medium. ~1–2 sessions.

---

### Phase 3: Foundation & Reset
**What it does**: Creates the base CSS that every component will sit on — the browser reset (normalizing defaults), the spacing scale, the typography scale, and ~28 utility classes.

**Why it matters**: This is the "grammar" of the design system. Without consistent spacing, font sizes, and baseline styles, every component would invent its own rules and nothing would look cohesive.

**What "done" looks like**: A blank HTML page that imports the foundation CSS shows correct fonts (Inter for body, JetBrains Mono for code), warm cream background, and proper spacing — without any components added yet.

**Effort**: Medium. ~1 session.

---

### Phase 4: Motion System
**What it does**: Builds all 59 CSS animations as a standalone stylesheet — fade-ins, scale-ups, spring pops, shakes, shimmers, slide-ins, and more.

**Why it matters**: Consistent motion is what makes a design system feel alive and cohesive rather than a collection of parts. The motion system also includes accessibility guards — users who've told their OS "I prefer reduced motion" will see no animations at all.

**What "done" looks like**: 59 named animations all work. `prefers-reduced-motion` disables them. The motion file imports cleanly alongside the foundation.

**Effort**: Medium. ~1 session.

---

### Phase 5: Components ← *This is the big one*
**What it does**: Builds all 43 UI components, each as its own CSS file. Buttons, cards, modals, toasts, tables, accordions, dropdowns, tooltips — the full library.

**Why it matters**: These are the actual pieces people use to build interfaces. This phase is where the design system becomes tangible and usable.

**How it's organized**: The 43 components are grouped into 8 batches, ordered from simplest to most complex:

| Batch | Components | Complexity |
|-------|-----------|------------|
| **A** | Badge, Avatar, Divider, Skip Link, Notification Badge | Simple — mostly static styling |
| **B** | Button, Checkbox, Radio, Toggle, Range | Interactive form controls |
| **C** | Input, Textarea, Select, Multi-Select | Text input controls |
| **D** | Card, Tile, Bento Grid, Alert, Progress, Skeleton | Content containers and feedback |
| **E** | Toast, Tooltip, Popover, Dropdown, Modal, Drawer | Overlays and popups |
| **F** | Accordion, Tabs, Segmented Control, Stepper, Pagination | Navigation and multi-step |
| **G** | Topnav, Sidebar, Sidebar Layout, Breadcrumbs, Back to Top | Page-level navigation |
| **I** | Command Palette, Table, Empty State, Staggered Reveal, Code Block, Scroll Progress, Page Transitions | Complex/specialty components |

**Key detail**: Batches are independent of each other. Batch E doesn't need Batch D to exist. This means **batches can be built in parallel** across multiple Claude Code sessions — dramatically reducing wall-clock time.

**What "done" looks like**: 43 CSS files exist. Each component works in isolation (import tokens + foundation + that one component file = it renders correctly). Every interactive element has hover, active, focus, and disabled states. Light and dark mode both work. All tests pass.

**Effort**: Large. ~3–8 sessions depending on parallelization.

---

### Phase 6: *Deferred to Roadmap*
Originally planned for advanced JavaScript-driven animations (spring physics, particle effects, etc.). Deferred because the CSS foundation needs to be proven stable before layering JS on top.

---

### Phase 7: Documentation Assembly
**What it does**: Creates the interactive documentation pages — a component showcase, a color reference page, and light/dark preview pages. These are the "marketing site" for the design system itself.

**Why it matters**: Documentation is how people discover and learn the system. If someone asks "what components does Delightful have?", they can open the showcase page and see every component rendered, interactive, and themeable.

**What "done" looks like**: Static HTML pages that open in any browser (no server needed), demonstrating every component, every color token, and both themes. No hardcoded values — everything pulls from the token system.

**Effort**: Medium. ~1–2 sessions.

---

### Phase 8: Launch *(after MVP)*
**What it does**: Packages everything as installable npm libraries and submits platform themes to their respective marketplaces.

| Package | What it contains |
|---------|-----------------|
| `@delightful/tokens` | Raw design tokens (JSON + TypeScript types) |
| `@delightful/css` | Complete CSS (tokens + foundation + components + motion) |
| `@delightful/tailwind` | Tailwind CSS preset/plugin |
| `@delightful/react` | React component wrappers |

**Why it matters**: This is the distribution step. MVP builds it; Launch ships it.

**Status**: Planning shell — details to be finalized after MVP lessons.

---

## How the Technologies Work Together

### The Short Version

```
palette.json  →  7 emitters  →  platform theme files
                     ↓
               tokens.css  →  foundation.css  →  components/*.css  →  docs pages
```

One source of truth feeds everything. Change a color in the JSON, run `npm run build`, and the entire system updates.

### The Technologies

#### OKLCH Color Space
**What it is**: A way of defining colors using three values — Lightness, Chroma (saturation), and Hue. Think of it as GPS coordinates for color.

**Why we use it instead of hex (#FF69B4) or RGB**: OKLCH is *perceptually uniform*. That's a fancy way of saying: if you set pink and cyan to the same lightness number, they actually *look* equally bright to human eyes. With hex/RGB, you'd have to eyeball-tune every color pair to achieve the same thing.

**Where it shows up**: Every CSS color definition. The palette JSON stores OKLCH values, and the CSS emitter writes them directly into `tokens.css`. Browsers render OKLCH natively — no conversion needed.

**Exception**: Terminal apps (VS Code editor, Ghostty, iTerm2, Starship) can't read OKLCH. Their emitters convert to hex using a library called `culori`, or use hand-tuned hex values stored separately in the palette JSON.

#### CSS Custom Properties (Design Tokens)
**What they are**: Variables in CSS. Instead of writing `color: oklch(0.640 0.270 350)` everywhere, you write `color: var(--accent-primary)` and define the actual value once.

**The 3-tier system**:

| Tier | Example | Purpose |
|------|---------|---------|
| **Primitives** | `--primitive-pink-400` | Raw color values. "This specific shade of pink." |
| **Semantic** | `--accent-primary` | What colors mean. "The main brand accent." Changes between light/dark mode. |
| **Component** | `--btn-primary-bg` | How colors are used. "The background of a primary button." Points to semantic tokens. |

**Why 3 tiers**: When you switch from light to dark mode, only the semantic tier changes. Components don't need to know about themes — they just reference `--accent-primary` and the system handles the rest. If a component referenced `--primitive-pink-400` directly, dark mode would break.

#### CSS Cascade Layers
**What they are**: A CSS feature that controls which styles "win" when there's a conflict. Think of it like floors in a building — higher floors override lower floors, regardless of how specific the selector is.

**Our layer order** (lowest priority → highest):

| Layer | What's in it | Why it's at this level |
|-------|-------------|----------------------|
| `reset` | Browser defaults normalization | Must be overridable by everything |
| `primitives` | Raw OKLCH color values | Foundation that semantic tokens reference |
| `semantic` | Theme-aware token mappings | Must be overridable by components |
| `component` | All 43 component styles | Must be overridable by utilities |
| `utilities` | Helper classes (`.hidden`, `.sr-only`) | Highest priority so they always win |

**Why this matters**: Without layers, adding a new component could accidentally break an existing one because of CSS specificity wars. Layers make the priority system explicit and predictable.

#### Emitters (Build Pipeline)
**What they are**: Small JavaScript functions that take the palette JSON as input and output a file in a specific platform's format. They're "translators."

**Key design decision**: Emitters are *pure functions* — they don't read or write files themselves. They take data in, return data out. A separate "orchestrator" handles all the file writing. This makes them easy to test and impossible to accidentally corrupt files.

**The flow**:
```
palette.json → validate → [css, vscode, obsidian, ghostty, iterm2, starship, tailwind] → orchestrator writes files
```

If validation fails (missing colors, invalid format, contrast too low), the entire pipeline stops before writing anything. No partial updates.

#### Playwright (Testing)
**What it is**: A browser automation tool. It opens real browser windows and interacts with your pages like a user would — clicking buttons, checking colors, taking screenshots.

**How we use it**: Automated tests that verify components render correctly in both light and dark mode, that hover/active states work, that animations play (and don't play when reduced-motion is on), and that no visual regressions sneak in.

#### Biome (Linting)
**What it is**: A code quality tool that checks CSS and JavaScript for errors and style violations. Think spell-check for code.

**How we use it**: Enforces design system rules automatically — like flagging any component that references a `--primitive-*` token directly (which would break dark mode).

---

## Execution Strategy: One Phase Per Prompt

### Why Not One Mega-Prompt?

Claude Code has a context window — the amount of information it can hold "in memory" during a session. A mega-prompt trying to execute all 8 phases would:

1. **Overflow context** — Claude would start forgetting earlier work partway through
2. **Compound errors** — a mistake in Phase 2 would cascade through Phases 3–7 with no checkpoint
3. **Make review impossible** — you can't meaningfully review 43 components + a build pipeline + documentation in one pass

### The Pattern: One Session Per Phase

Each phase is designed to be **self-contained**. A fresh Claude Code session reads the phase prompt, executes it, and stops. You review the output, verify it passes, then start a new session for the next phase.

```
Session 1:  "Read Documentation/Refactor/MVP/Prompts/phase-0-scaffold.md and execute it."
   → Review → Verify → Commit

Session 2:  "Read Documentation/Refactor/MVP/Prompts/phase-1-color-data.md and execute it."
   → Review → Verify → Commit

Session 3:  "Read Documentation/Refactor/MVP/Prompts/phase-2-emitters.md and execute it."
   → Review → Verify → Commit

...and so on.
```

**Between every session**, run the verification trifecta:
```bash
npm run build    # Does it build?
npm test         # Do tests pass?
npm run lint     # Is the code clean?
```

All three must pass before starting the next phase. This catches problems early instead of letting them compound.

### Phase 5 Is the Exception: Parallelize It

Phase 5 (the 43 components) can be split across multiple simultaneous sessions — one per batch. Each batch is independent. This is the biggest time savings in the whole plan.

```
Session 5A:  "Execute Phase 5, Batch A only (Badge, Avatar, Divider, Skip Link, Notification Badge)"
Session 5B:  "Execute Phase 5, Batch B only (Button, Checkbox, Radio, Toggle, Range)"
Session 5C:  "Execute Phase 5, Batch C only (Input, Textarea, Select, Multi-Select)"
...up to 8 parallel sessions
```

After all batches finish, run the full component QA checklist across all 43 in one pass.

### What Each Prompt Should Include

Every phase prompt you paste into Claude Code should tell it to:

1. **Read CLAUDE.md** — project conventions and rules
2. **Read the agent workflow SOP** — standard operating procedure for how to work
3. **Read the specific phase prompt** — detailed build instructions
4. **Read the acceptance criteria** — what "done" looks like
5. **Create Linear issues** for tracking (see next section)
6. **Commit frequently** — small commits protect against context loss

The phase prompt files already contain all the technical instructions. You're just pointing Claude at the right document.

---

## How to Structure This in Linear

### Recommended Structure

Based on the refactor's architecture and your existing `KS-*` workflow, here's the optimal Linear setup:

#### Project-Level Organization

| Element | Value |
|---------|-------|
| **Project** | Delightful Design System v1.0 |
| **Team** | Your existing team |
| **Labels** | `Phase`, `Bug`, `Blocked`, `QA`, `Deferred` |
| **Statuses** | Backlog → Todo → In Progress → In Review → Done → Blocked |

#### Milestone Issues (9 total)

Create one milestone issue per phase. These are your "epics" — the high-level tracking items:

| Issue | Title | Dependencies |
|-------|-------|-------------|
| KS-101 | **Phase 0: Project Scaffold** | None |
| KS-102 | **Phase 1: Color Data & Palette JSON** | Blocked by KS-101 |
| KS-103 | **Phase 2: Emitter Pipeline** | Blocked by KS-102 |
| KS-104 | **Phase 3: Foundation & Reset CSS** | Blocked by KS-103 |
| KS-105 | **Phase 4: Motion System** | Blocked by KS-104 |
| KS-106 | **Phase 5: Components (43)** | Blocked by KS-105 |
| KS-107 | **Phase 7: Documentation Pages** | Blocked by KS-106 |
| KS-108 | **Phase 8: Launch & npm Packages** | Blocked by KS-107 |
| KS-109 | **Phase 6: Animation JS (Roadmap)** | Blocked by KS-107 |

#### Sub-Issues Within Phases

**Phases 0–4, 7**: Keep these as single issues with checklists. They're small enough that sub-issues would be overhead without value.

**Phase 5 — use sub-issues by batch** (not by individual component — 43 sub-issues would bury the board):

| Sub-Issue | Title | Components |
|-----------|-------|-----------|
| KS-106-A | Batch A: Simple Elements | Badge, Avatar, Divider, Skip Link, Notification Badge |
| KS-106-B | Batch B: Form Controls | Button, Checkbox, Radio, Toggle, Range |
| KS-106-C | Batch C: Text Inputs | Input, Textarea, Select, Multi-Select |
| KS-106-D | Batch D: Containers & Feedback | Card, Tile, Bento Grid, Alert, Progress, Skeleton |
| KS-106-E | Batch E: Overlays | Toast, Tooltip, Popover, Dropdown, Modal, Drawer |
| KS-106-F | Batch F: Navigation Patterns | Accordion, Tabs, Segmented Control, Stepper, Pagination |
| KS-106-G | Batch G: Page Navigation | Topnav, Sidebar, Sidebar Layout, Breadcrumbs, Back to Top |
| KS-106-I | Batch I: Complex/Specialty | Command Palette, Table, Empty State, Staggered Reveal, Code Block, Scroll Progress, Page Transitions |

Each batch sub-issue should have a checklist of its individual components.

**Phase 8 — sub-issues by deliverable**:

| Sub-Issue | Title |
|-----------|-------|
| KS-108-1 | @delightful/tokens npm package |
| KS-108-2 | @delightful/css npm package |
| KS-108-3 | @delightful/tailwind npm package |
| KS-108-4 | @delightful/react npm package |
| KS-108-5 | Platform distribution (VS Code, Obsidian, Ghostty, iTerm2, Starship) |

#### Issue Templates

Each milestone issue should contain:

```markdown
## Objective
[One sentence — what this phase produces]

## Phase Prompt
`Documentation/Refactor/MVP/Prompts/phase-X-<name>.md`

## Acceptance Criteria
- [ ] `npm run build` passes
- [ ] `npm test` passes
- [ ] `npm run lint` passes
- [ ] [Phase-specific criteria from how-to-execute.md]

## Notes
[Handoff notes from previous phase agent — filled in after prior phase completes]
```

#### Workflow Tips

- **Move issues to "In Progress" when you start the Claude Code session**, not when you create the issue.
- **Use "Blocked" actively.** If Phase 3 reveals a palette issue that needs fixing in Phase 1, block Phase 3 on a new bug issue, fix it, then unblock.
- **Add handoff notes as comments** when closing each phase. The next phase's agent (or your next session) reads these to understand what was built and any gotchas.
- **Don't pre-create all sub-issues.** Create the 9 milestones upfront, but only create sub-issues when you're about to start that phase. The plan may evolve.

---

## The Dependency Chain at a Glance

```
Phase 0 (Scaffold)
    ↓
Phase 1 (Colors)
    ↓
Phase 2 (Emitters)  ← produces tokens.css, which everything after depends on
    ↓
Phase 3 (Foundation)
    ↓
Phase 4 (Motion)
    ↓
Phase 5 (Components) ← batches A–I can run in parallel
    ↓
Phase 7 (Docs)
    ↓
Phase 8 (Launch)    ← npm packages + marketplace distribution

Phase 6 (Animation JS) ← deferred until after Phase 7 is stable
```

Each arrow means "the phase below cannot start until the phase above passes all acceptance criteria." The only parallelism opportunity is within Phase 5.

---

## Quick Glossary

| Term | What it means |
|------|--------------|
| **Token** | A named variable for a design value — `--accent-primary` instead of a raw color |
| **Emitter** | A small program that translates the palette JSON into a platform-specific format |
| **Cascade Layer** | A CSS feature that controls which styles take priority when they conflict |
| **OKLCH** | A color format where equal numbers = equal perceived brightness (unlike hex/RGB) |
| **Neo-brutalist** | The visual style — thick borders, solid shadows, bold colors, intentionally "physical" feel |
| **Lift/press** | The interaction pattern — hover lifts elements up (shadow grows), clicking presses them flat (shadow disappears) |
| **Semantic token** | A token that describes *meaning* ("primary accent") not *value* ("pink-400") — enables theming |
| **Primitive token** | A token that is a raw value ("pink-400") — components should never reference these directly |
| **Foundation** | The base CSS (spacing, typography, utilities) that components build on top of |
| **Orchestrator** | The build script that runs all 7 emitters and writes their output files |
| **Reduced motion** | An OS setting that tells websites the user prefers no animations — we respect this globally |

---

## Tech Appendix: Deeper Dive

### OKLCH — Why It's a Genuine Advantage

Traditional color formats (hex, RGB, HSL) have a problem: colors that share the same "lightness" number don't actually look equally bright. HSL's `hsl(350, 80%, 50%)` (pink) and `hsl(210, 80%, 50%)` (cyan) have the same L=50%, but the pink looks noticeably brighter to human eyes.

OKLCH fixes this with perceptual uniformity. The `L` channel represents actual perceived lightness, calibrated to human vision. This means:
- **Consistent palettes automatically** — setting all accent colors to L=0.640 makes them genuinely equal in perceived brightness
- **Predictable darkening/lightening** — dropping L by 0.1 always produces the same perceived change
- **Better accessibility** — WCAG contrast ratios are more predictable because lightness values are truthful

The format is `oklch(Lightness Chroma Hue)`:
- **L** (0–1): How bright. 0 = black, 1 = white
- **C** (0–0.4ish): How vivid. 0 = gray, higher = more saturated
- **H** (0–360): The color. 0/360 = red, 120 = green, 240 = blue

### CSS Cascade Layers — The Specificity Problem They Solve

CSS has a long-standing problem: when two rules target the same element, the more *specific* selector wins. This means a component style like `.card .btn-primary` could accidentally override a utility class like `.hidden`, because the component selector is more specific.

Cascade layers (`@layer`) add a priority system *above* specificity. Rules in the `utilities` layer always beat rules in the `component` layer, even if the component selector is more specific. This makes the design system predictable — you always know which style will win.

### Pure Function Emitters — Why This Design Choice

Each emitter is a "pure function" — it takes data in, returns data out, and touches nothing else. No reading files, no writing files, no network calls. Why?

1. **Testable**: You can test an emitter by passing it fake palette data and checking the output string — no filesystem mocking needed
2. **Safe**: An emitter can't accidentally overwrite the wrong file or corrupt data
3. **Composable**: You can add a new emitter (say, for Warp terminal) without changing any existing code
4. **Debuggable**: If the VS Code theme is wrong, the bug is in exactly one function

The orchestrator (a separate script) is the only thing that reads and writes files. It runs validation first — if the palette JSON is invalid, the build stops before any emitter runs and no files are written. This "fail fast" approach prevents partial updates where some platforms get new colors and others don't.

### The Data Flow

```
palettes/delightful.json       ← Human edits this (the only manual input)
        │
        ▼
  schema validation            ← Does the JSON have all required fields?
        │
        ▼
  WCAG contrast checks         ← Do text/background combos meet accessibility?
        │
        ▼
  ┌─────┼─────┬──────┬──────┬──────┬──────┬──────┐
  ▼     ▼     ▼      ▼      ▼      ▼      ▼      ▼
 CSS  VSCode Obsidian Ghostty iTerm2 Starship Tailwind
  │     │      │       │       │       │        │
  ▼     ▼      ▼       ▼       ▼       ▼        ▼
tokens.css  *.json  theme.css config *.iterm  *.toml  preset.js
  │
  ▼
foundation.css  →  components/*.css  →  docs/*.html
```

Everything flows from `palette.json`. The CSS output (`tokens.css`) then feeds the hand-authored foundation and components, which feed the documentation pages.
