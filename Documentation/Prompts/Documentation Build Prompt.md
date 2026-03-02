# Documentation Build Prompt

Copy everything below the line into a new Claude Code session at `~/Desktop/Workflow/Github/delightful-design-system`.

---

## Context

I'm rebuilding the Delightful Design System from scratch. The previous version was built showcase-first with a monolithic 8,006-line HTML file as the source of truth. That architectural inversion created compounding technical debt. The rebuild fixes the architecture: data and source files are authoritative, documentation is assembled from them.

**Working directory:** `~/Desktop/delightful-design-system`

Everything you need is in the `Documentation/` folder:

- `Documentation/design-reference.html` — a copy of the previous version's main showcase. This is your visual and technical reference for every token value, every component design, every interaction pattern, and every animation. Treat it as a spec, not a source.
- `Documentation/Architecture/Core Concepts & Fundamental Technologies.md` — the system's conceptual architecture (3 parallel systems, 3-tier tokens, cascade layers, color authority model, technology stack)
- `Documentation/Architecture/Rebuild Plan.md` — the phase-by-phase build plan (repo structure, build pipeline, 10 phases with deliverables)

Read all three files thoroughly before starting. The architecture docs define the target system. The reference HTML is the source of every token value, component design, and interaction pattern you'll be documenting.

## Task

Write the complete documentation set required to rebuild the Delightful Design System from scratch to v1.0.0. This documentation must be extensive and detailed enough that an agent-driven workflow can execute the rebuild systematically — building every primitive, semantic token, component, emitter, and test — with review checkpoints throughout.

**We are NOT building external packages, a showcase site, platform distribution repos, or the standalone JS animation system (spring physics modules, FLIP utilities, particle system).** The scope is everything inside `design-reference.html`: palette data, token pipeline, foundation CSS, all CSS animations and keyframes present in the file, all inline JavaScript behaviors (theme toggle, toast, command palette, splash particles, 3D effects, table sorting, skeleton loading), and every component. The goal is a fully functional design system that generates correct CSS tokens from palette JSON, has individually importable component stylesheets, and passes comprehensive tests. If it's in `design-reference.html`, document it. If it's only in a companion file (`delightful-animation.html`, `delightful-motion.html`, `delightful-color.html`), it's out of scope for this phase.

**The documentation you produce IS the build spec.** An orchestration layer (agent team or sequential agents) will consume these docs to execute the build. Every doc must be specific enough to implement from — no hand-waving, no "and then style the component appropriately." Every token value, every CSS class, every interaction state, every test assertion.

## What to Research

Before writing, you need to deeply understand what you're documenting. Use the reference material extensively:

1. **Read `Documentation/design-reference.html` completely** — all ~8,000 lines. Extract every token value, every component's HTML structure, every CSS rule, every JavaScript behavior. This is where the truth lives.

2. **Read `Documentation/Architecture/Core Concepts & Fundamental Technologies.md`** — understand the target architecture (sources → emitters → outputs), the 3-tier token model, the three parallel systems (color, motion, animation), and the technology stack.

3. **Read `Documentation/Architecture/Rebuild Plan.md`** — understand the repo structure, phase ordering, and acceptance criteria. Your docs are the detailed expansion of each phase.

That's it. Everything you need is in those three files. Do not look for or reference files outside this directory.

## Documentation to Produce

Write all documentation into `~/Desktop/delightful-design-system/Documentation/Specs/`. Create subdirectories as needed.

### 1. Token Specification (`tokens/`)

**`palette-schema.md`** — Complete specification for `palettes/delightful.json`:
- Exact JSON structure with every key documented
- Every primitive token: name, OKLCH value, which family, which stop
- Every semantic token: name, light value, dark value, what it's used for
- Every terminal hex value: light and dark, which platforms consume it
- The color authority model: which values are OKLCH-authoritative vs hex-authoritative
- JSON Schema rules (required fields, format constraints, version field)

**`token-tiers.md`** — The 3-tier architecture specification:
- Tier 1 (Primitives): complete inventory with values extracted from reference
- Tier 2 (Semantic): complete inventory, light and dark, with the primitive each maps to
- Tier 3 (Component): complete inventory — foundation tokens (typography, spacing, radius, shadows, z-index, motion, easing, control heights, containers), component-specific tokens (button colors, badge spacing, toggle states), code-block syntax highlighting tokens (7 color tokens: `--code-keyword` → pink, `--code-string` → gold, `--code-function` → cyan, `--code-comment` → muted neutral, `--code-number` → green, `--code-operator` → neutral, `--code-property` → pink-adjacent; these must be tokenized as CSS custom properties, not left as hardcoded OKLCH values), chart palette tokens (6 `--chart-*` aliases mapping to accent tokens), and status alias tokens (`--status-info` → accent-primary, `--status-error` → accent-danger, `--status-warning` → accent-gold, `--status-success` → accent-green)
- The cascade layer order and what each layer contains
- The strict rule: components never reference primitives (and how to enforce it)

**`dark-mode.md`** — How theming works:
- The `data-theme` attribute mechanism
- Every semantic token that changes between light and dark (side-by-side values)
- Shadow inversion logic (dark on light → cream on dark)
- Accent brightening logic (how dark mode increases lightness)
- The two-state toggle: light ↔ dark, with OS preference as initialization default
- `localStorage` persistence

### 2. Foundation Specification (`foundation/`)

**`typography.md`** — Complete typography spec:
- Font declarations (Inter, JetBrains Mono) with all fallbacks
- Fluid type scale: every `--step-*` token with its `clamp()` formula
- Fixed UI text scale: every `--ui-text-*` token with px value
- Letter spacing tokens with values
- Line height tokens with values
- Where each scale is used (fluid for content, fixed for controls)

**`spacing.md`** — Complete spacing spec:
- Every `--space-*` token with px value
- The 4px base unit rationale
- The 8px grid system
- How spacing tokens map to component padding/margins

**`radius.md`** — Border radius spec:
- Every `--radius-*` token with px value
- Which components use which radius
- The "deliberately large" design decision

**`shadows.md`** — Shadow system spec:
- Every `--shadow-*` token with value (light and dark)
- The zero-blur neo-brutalist rule
- The 3 size tiers (sm/md/lg) and their offset values
- The 6 colored variants and their accent mappings
- Shadow inversion in dark mode

**`motion.md`** — Motion token spec:
- Every `--motion-*` timing token with ms value
- Every `--ease-*` easing token with the exact cubic-bezier or linear() value
- The two spring presets with their full `linear()` point lists
- When to use each timing/easing combination
- The `prefers-reduced-motion` gate

**`z-index.md`** — Z-index scale spec:
- Every `--z-*` token with numeric value
- What UI element lives at each level

**`reset.md`** — CSS reset spec:
- Every rule in the reset layer
- Box-sizing, margin/padding reset, scroll behavior
- Focus-visible outline specification
- The reduced-motion global gate

**`utilities.md`** — Utility classes spec (`@layer utilities`):
- Complete inventory of every utility class from `design-reference.html` (~25 classes)
- Includes: `.flex`, `.gap-*`, `.mt-*`, `.mb-*`, `.text-center`, `.font-mono`, `.text-sm`, `.w-full`, `.mx-auto`, `.visually-hidden`/`.sr-only`, and all others present in the reference
- For each: exact CSS rule and which token it references (if any)
- The layer declaration: `@layer utilities { ... }`
- How utility specificity interacts with component styles via cascade layers

### 3. Component Specifications (`components/`)

**One file per component.** Each file must contain:

- **Visual reference**: Which section of `design-reference.html` to look at (line numbers or section IDs)
- **HTML structure**: The exact markup for the component and all its variants
- **CSS classes**: Every class name, what it does, which tokens it references
- **Variants**: Every visual variant (colors, sizes) with the exact class names
- **States**: Every interactive state (hover, active, focus, disabled) with exact CSS changes (transform values, shadow changes, opacity, pointer-events)
- **Responsive behavior**: How the component adapts at different widths
- **Accessibility**: ARIA attributes, keyboard behavior, screen reader considerations
- **Token dependencies**: Which tokens from Tier 2 and Tier 3 this component requires
- **Test specification**: What to assert — computed styles, interaction behavior, visual regression, reduced-motion compliance

Write specs for ALL of these components (extract the full list from `design-reference.html`):

**Batch A — Simple display:**
- `badge.md`, `avatar.md`, `tooltip.md`, `empty-state.md`, `divider.md` (3 variants: `.divider`, `.divider-strong`, `.divider-with-text`), `notification-badge.md` (`.notification-badge`, `.notification-badge-count`)

**Batch B — Interactive (lift/press):**
- `button.md`, `card.md`, `tile.md`

**Batch C — Forms:**
- `input.md`, `textarea.md`, `select.md`, `multi-select.md`, `checkbox.md`, `radio.md`, `toggle.md`, `range.md`

**Batch D — Navigation:**
- `topnav.md`, `tabs.md`, `breadcrumbs.md`, `pagination.md`, `sidebar.md`, `segmented-control.md` (`.segmented-control`, `.segmented-control-item`), `command-palette.md` (ARIA combobox, keyboard nav, search), `skip-link.md` (accessibility skip-to-content link)

**Batch E — Data:**
- `table.md`, `stepper.md`, `scroll-progress.md` (`animation-timeline: scroll()` progress bar), `back-to-top.md` (IntersectionObserver-powered button)

**Batch F — Feedback:**
- `toast.md`, `alert.md`, `modal.md`, `drawer.md`, `progress.md`

**Batch G — Display:**
- `popover.md`, `code-block.md`, `skeleton.md`, `accordion.md`, `dropdown.md` (JS-powered dropdown, distinct from `<select>`), `bento-grid.md` (responsive 2-col/1-col breakpoints)

**Batch H — Signature:**
- `blur-grid.md`, `tilt-card.md`, `spotlight.md`, `magnetic-button.md`

**Batch I — Composition:**
- `sidebar-layout.md`, `staggered-reveal.md`, `page-transitions.md` (View Transitions API demo: crossfade, slide-left, slide-right)

### 4. Motion & Inline JS Specification (`motion/`)

**`keyframes.md`** — Every `@keyframes` definition found in `design-reference.html`:
- Name, exact keyframe definition (from/to or percentage stops with property values)
- Which components use it
- Duration and easing recommendations
- **Only document keyframes that exist in `design-reference.html`** — not the full 59 from the beta's motion page. The documentation phase documents the 22 keyframes present in design-reference.html (fadeInUp, fadeIn, shimmer, pulse-skel, shake, checkmark-draw, scale-in, progress-shrink, typing, blink, easing-loop, spin-slow, fadeOutRight, slideInLeft, text-stamp, scroll-progress-fill, tile-pulse, spin, playful-shimmer, playful-pulse, pop-anim, ripple-anim). The full 59-keyframe motion system is a build-phase deliverable using the beta's motion page as additional reference.

**`animation-classes.md`** — Utility classes found in `design-reference.html`:
- Every `.anim-*` class with what it applies
- Stagger delay classes (`.anim-d1` through `.anim-d12`) with values
- Hover utilities (`.hover-lift`, `.badge-pop`)
- The `@media (prefers-reduced-motion: no-preference)` wrapper

**`inline-behaviors.md`** — All JavaScript behaviors embedded in `design-reference.html`:
- Theme toggle (2-state: light/dark with OS preference as initialization fallback, localStorage, data-theme attribute)
- Toast system (showToast function, 4 types, auto-dismiss, progress bar, max 3 visible)
- Command palette (Cmd+K, ARIA combobox, keyboard navigation, real-time filter)
- Data table sorting (sortTable function, ascending/descending, data-sort attribute)
- Row selection (toggleRow, toggleAllRows, checkbox + keyboard support)
- Stepper navigation (prev/next/reset, step indicators, completed states)
- Splash/pop particles (mousedown on buttons/cards, 6 particles + ripple, CSS variable velocity)
- 3D tilt card (mousemove rotation, ±12° clamp, perspective 800px)
- Cursor spotlight (radial gradient follows mouse)
- Magnetic button (120px attraction radius, 0.3 pull strength)
- Skeleton loading toggle (shimmer/pulse switch, staggered reveal)
- Page transitions (crossfade, slide-left, slide-right)
- Easing demonstrations (5 curves animated)
- Spring physics demos (3 boxes with different configs)
- Scroll progress bar (animation-timeline: scroll())
- Back-to-top button (IntersectionObserver)
- For each: exact function signatures, event listeners, DOM manipulation approach, animation parameters, and how it respects `prefers-reduced-motion`

### 5. Emitter Specifications (`emitters/`)

**`css-emitter.md`** — How palette JSON becomes tokens.css:
- Input format (palette JSON structure)
- Output format (exact CSS structure with @layer wrappers, selectors)
- Token naming transformation rules
- Shadow token generation (structure from foundation + colors from palette)
- The exact file that gets written and where

**`vscode-emitter.md`** — How palette JSON becomes VS Code theme:
- The ~324 color property mappings (every editor, UI, syntax, terminal, debug mapping)
- OKLCH → hex conversion via culori with clampChroma
- Light and dark theme file structure
- Reference: the existing mappings are visible in `design-reference.html`'s token declarations

**`obsidian-emitter.md`** — How palette JSON becomes Obsidian theme:
- The `--primitive-*` → `--d-*` rename rule
- Style Settings plugin configuration block
- Which Obsidian-specific overrides are needed
- Light/dark selector structure (`.theme-light` / `.theme-dark`)

**`terminal-emitters.md`** — How palette JSON becomes Ghostty + iTerm2:
- Ghostty plain-text format spec
- iTerm2 plist XML format spec (hex → RGB float conversion)
- The shared ANSI palette (both must be identical)
- Font and window configuration that accompanies colors

**`orchestrator.md`** — The build pipeline:
- Validation step (schema + contrast + distinctness)
- Emitter execution order
- Error handling and reporting
- The `npm run build` contract

### 6. Test Specifications (`testing/`)

**`test-strategy.md`** — Overall testing approach:
- What Playwright covers (visual regression, interaction, token consistency)
- Test configuration (Chromium, single worker, timeouts)
- CI/CD integration (what runs on every push)
- Visual regression baseline management

**`token-tests.md`** — Token verification:
- Schema validation assertions
- WCAG contrast ratio checks (which pairs, what thresholds)
- Generated CSS correctness (every expected custom property exists with correct value)
- Cross-port consistency (Ghostty ↔ iTerm2 palette match)

**`component-tests.md`** — Per-component test specs:
- For each component: what computed styles to verify, what interactions to test
- The lift/press pattern assertions (base shadow, hover escalation, active press, disabled)
- Visual regression: which states to screenshot
- Accessibility: focus visibility, keyboard operability, ARIA correctness

**`motion-tests.md`** — Animation testing:
- Reduced-motion compliance (every animation disabled)
- Keyframe existence verification
- Spring easing token validation (resolves to `linear()`)
- Timing token correctness

### 7. Integration Specification (`integration/`)

**`build-pipeline.md`** — End-to-end build:
- `npm run build` step-by-step (validate → emit tokens → emit ports → bundle components)
- File dependency graph (what depends on what, build order)
- How to verify a successful build

**`cascade-layers.md`** — Layer interaction:
- The exact layer order and what CSS goes in each
- How component CSS files declare their layer membership
- How consumers import layers correctly
- Edge cases: what happens if a consumer doesn't use layers

**`directory-structure.md`** — Final repo layout:
- Every file and directory with its purpose
- Which files are authored vs generated
- Which files are entry points for consumers

### 8. Architecture Cohesion Review (`review/`)

After all spec files are written, perform a final review pass as the last step. This can be a dedicated review agent or the lead agent's final task.

**`cohesion-review.md`** — Architecture validation report:
- **Cross-reference check**: Do all component specs reference tokens that actually exist in the token-tiers spec? Flag any component that references a token not in the inventory.
- **Cascade layer consistency**: Does every component spec declare the correct layer? Do any specs put CSS in the wrong layer?
- **Token tier compliance**: Does any component spec reference a primitive directly? Flag every violation of the strict rule.
- **Interaction pattern consistency**: Do all interactive components (buttons, cards, tiles, sidebar items, pagination) implement the same lift/press pattern with the same values? Flag deviations.
- **Dark mode completeness**: Does every semantic token in token-tiers.md have both a light and dark value? Does every component that uses color tokens account for dark mode?
- **Test coverage**: Does every component spec include a test specification? Are there gaps where a component exists but has no test assertions?
- **Dependency graph validation**: Can every component be built in isolation with only tokens + foundation? Flag any component that depends on another component.
- **Rebuild Plan alignment**: Does the documentation set cover every deliverable listed in the Rebuild Plan's phases? Flag any phase deliverable that has no corresponding spec.
- **Completeness**: Walk through `design-reference.html` section by section and verify that every token, component, animation, and behavior is captured in at least one spec file. Flag anything missed.

This review is the quality gate. The documentation set is not complete until this review passes with zero critical flags.

---

## Agent Architecture (Required)

**CRITICAL: You MUST use sequential sub-agents for this task.** The reference HTML is ~8,000 lines. Attempting to read it fully and write ~65 spec files in a single context will exhaust your context window. You are the lead agent — you coordinate, review, and write integration specs. Sub-agents do the heavy reading and spec writing.

**Do NOT ask the user for permission to use sub-agents. Do NOT ask clarifying questions before starting. Just begin.**

### Scope Enforcement

**Only document what exists in `design-reference.html`.** If a feature, component, or animation only exists in a companion file (`delightful-animation.html`, `delightful-motion.html`, `delightful-color.html`), it is out of scope. Do not document aspirational features, beta plans, or anything not present in the reference HTML. When in doubt, check whether it's in `design-reference.html` — if not, skip it.

### Execution Flow — Strictly Sequential

Run sub-agents **one at a time, in order**. Each phase completes and you review its output before dispatching the next. This ensures each phase can build on prior outputs and no agent makes assumptions that conflict with another's work.

Read the two architecture docs yourself first (Core Concepts + Rebuild Plan — they're short). Do NOT read design-reference.html yourself. Instead, dispatch sub-agents with specific line ranges and section references so each sub-agent reads only what it needs.

**Phase 1 — Tokens:**

Sub-agent 1: **Token Extractor**
- Read `design-reference.html` lines 1–800 (CSS custom properties in `<style>` block)
- Extract every primitive, semantic, and component token with exact values
- Write: `tokens/palette-schema.md`, `tokens/token-tiers.md`, `tokens/dark-mode.md`
- Include: syntax highlighting tokens (7 code-block colors), chart tokens (6 `--chart-*`), status tokens (4 `--status-*`)

→ **Review checkpoint:** Verify token inventory is complete before proceeding.

**Phase 2 — Foundation:**

Sub-agent 2: **Foundation Extractor**
- Read `design-reference.html` lines 1–800 (structural CSS) + lines 4087–4116 (utilities)
- Read Phase 1 token specs for cross-referencing
- Write: `foundation/typography.md`, `foundation/spacing.md`, `foundation/radius.md`, `foundation/shadows.md`, `foundation/motion.md`, `foundation/z-index.md`, `foundation/reset.md`, `foundation/utilities.md`

→ **Review checkpoint:** Verify foundation specs reference tokens that exist in Phase 1 output.

**Phase 3A — Components Batch A–C** (simple display, interactive, forms):

Sub-agent 3A:
- Read relevant sections of `design-reference.html` (component CSS definitions + demo HTML)
- Read Phase 1 + 2 specs for token/foundation references
- Write specs for: badge, avatar, tooltip, empty-state, divider, notification-badge, button, card, tile, input, textarea, select, multi-select, checkbox, radio, toggle, range

→ **Review checkpoint.**

**Phase 3B — Components Batch D–F** (navigation, data, feedback):

Sub-agent 3B:
- Read relevant sections of `design-reference.html`
- Read Phase 1 + 2 specs + Phase 3A output (for pattern consistency)
- Write specs for: topnav, tabs, breadcrumbs, pagination, sidebar, segmented-control, command-palette, skip-link, table, stepper, scroll-progress, back-to-top, toast, alert, modal, drawer, progress

→ **Review checkpoint.**

**Phase 3C — Components Batch G–I** (display, signature, composition):

Sub-agent 3C:
- Read relevant sections of `design-reference.html`
- Read Phase 1 + 2 specs + Phase 3A/3B output (for pattern consistency)
- Write specs for: popover, code-block, skeleton, accordion, dropdown, bento-grid, blur-grid, tilt-card, spotlight, magnetic-button, sidebar-layout, staggered-reveal, page-transitions

→ **Review checkpoint.**

**Phase 4 — Motion & Behaviors:**

Sub-agent 4: **Motion/JS Extractor**
- Read `design-reference.html` `@keyframes` blocks + all inline `<script>` blocks
- Write: `motion/keyframes.md`, `motion/animation-classes.md`, `motion/inline-behaviors.md`

→ **Review checkpoint.**

**Phase 5 — Emitters:**

Sub-agent 5: **Emitter Spec Writer**
- Read token specs from Phase 1 output + architecture docs
- Write: `emitters/css-emitter.md`, `emitters/vscode-emitter.md`, `emitters/obsidian-emitter.md`, `emitters/terminal-emitters.md`, `emitters/orchestrator.md`

→ **Review checkpoint.**

**Phase 6 — Tests:**

Sub-agent 6: **Test Spec Writer**
- Read all specs from Phases 1–5
- Write: `testing/test-strategy.md`, `testing/token-tests.md`, `testing/component-tests.md`, `testing/motion-tests.md`

→ **Review checkpoint.**

**Phase 7 — Integration (you, the lead agent):**

Write these yourself based on all sub-agent outputs:
- `integration/build-pipeline.md`, `integration/cascade-layers.md`, `integration/directory-structure.md`

**Phase 8 — Review (final sub-agent):**

Sub-agent 7: **Cohesion Reviewer**
- Read ALL specs produced in Phases 1–7
- Write: `review/cohesion-review.md`
- Flag: missing tokens, tier violations, inconsistent patterns, gaps vs Rebuild Plan

### Sub-Agent Instructions Template

When dispatching each sub-agent, include:
1. The output directory path (`Documentation/Specs/{section}/`)
2. Which files from `Documentation/` to read (with line ranges for design-reference.html)
3. Which architecture doc sections are relevant
4. The exact list of spec files to produce
5. The scope rule: "Only document what exists in design-reference.html. If it's not in the reference, don't include it."
6. A reminder: "Every token value must be exact — copy OKLCH coordinates from the reference, don't paraphrase."

## Output Expectations

- Every doc should be implementation-ready — specific enough that an agent can write code from it without asking clarifying questions
- Every token value should be the exact value from `design-reference.html` (copy, don't paraphrase OKLCH coordinates)
- Every component spec should include exact HTML structure and exact CSS class names
- Cross-references between docs where specs depend on each other (e.g., button.md references shadows.md for the lift/press pattern)
- No aspirational content — document what exists in the reference, not what we wish existed
