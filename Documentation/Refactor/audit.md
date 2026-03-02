# Documentation Audit for Refactor Packaging

> Complete categorization of every file in `Documentation/` into the three delivery packages: **MVP** (Phases 0-5, 7 excluding Phase 6), **Launch** (Phase 8), and **Roadmap** (Post-v1.0 deferred work). Every file was read in full before categorization.

---

## Package Scope Definitions (Reference)

- **MVP**: Phases 0-7 (excluding Phase 6). Scaffold, color data, emitter pipeline, foundation/reset, motion CSS (59 keyframes), components (Batches A-G, I; Batch H excluded), showcase docs (`index.html`, `color.html`, `preview-light.html`, `preview-dark.html`). Testing for all of the above.
- **Launch**: Phase 8. npm packages (`@delightful/tokens`, `@delightful/tailwind`, `@delightful/css`, `@delightful/react`), changesets, build/publish scripts, Claude Code plugin, platform distribution repos, READMEs/screenshots.
- **Roadmap**: Phase 6 (Animation JS: spring physics, FLIP, particles), Phase 5 Batch H (blur-grid, tilt-card, spotlight, magnetic-button), `docs/motion.html`, `docs/animation.html`.

---

## Per-File Audit

### 1. `Documentation/design-reference.html`

- **Package**: Mixed (MVP + Roadmap)
- **Description**: The 8,000+ line monolithic HTML reference file. Contains all token values, component designs, interaction patterns, keyframes, and inline JS behaviors. This is the ground truth the entire documentation set was extracted from.
- **Mixed-scope notes**: The vast majority of this file is MVP scope (tokens, all 43 MVP components, 22 keyframes from the showcase, inline JS behaviors). However, the file also contains the Batch H signature components (blur-grid, tilt-card, spotlight, magnetic-button) which are Roadmap. The reference itself is read-only and does not need to be split -- it serves as reference for all packages.
- **Date references**: None.
- **Split required**: No. Read-only reference used by all packages.
- **Notes**: File exceeds 353KB. Cannot be read in a single pass. Must be read in chunks. The cohesion-review.md notes that tilt-card and spotlight are NOT actually in this file (they're in `delightful-animation.html` instead), while blur-grid and magnetic-button ARE present.

---

### 2. `Documentation/Architecture/Core Concepts & Fundamental Technologies.md`

- **Package**: Mixed (MVP + Launch + Roadmap)
- **Mixed-scope notes**:
  - **MVP**: Sections 1-5 (system description, three parallel systems, token architecture, interaction model, theme system), Section 6 (sync/propagation), Section 7 (technologies), Section 8 (component architecture). These cover the core design system that MVP builds.
  - **Launch**: Section 6.3 (version management -- "bump script atomically updates version in 6 canonical files"), Section 9 (What 1.0 Requires -- installable on npm, platform directory submissions, blog post, CI/CD, visual regression). These describe distribution/packaging goals.
  - **Roadmap**: Section 2.3 (Animation System -- spring physics, FLIP, particles, canvas rendering, 23 interactive demos). The entire Animation subsystem description is Roadmap (Phase 6).
- **Date references**: **Yes** -- Section 9.3 references "Building an OKLCH Design System in 8 Days with Claude Code" (time-based framing in a title, though this is a blog post title rather than a schedule).
- **Split required**: Yes. Section 2.3 (Animation System) and references to animation JS modules should be extracted to a Roadmap document. Section 9 should be split -- installable/CI/CD portions go to Launch, validation portions stay MVP.
- **Notes**: Contains a known documentation error (W-01 from cohesion-review): `--shadow-md` incorrectly documented as `var(--text-primary)` instead of `var(--border-default)` in Section 3.3. Also contains contradictory language about toggle primitive violations (Section 3.5 calls them "a blocking fix" while token-tiers.md calls them "intentional exceptions").

---

### 3. `Documentation/Architecture/Rebuild Plan.md`

- **Package**: Mixed (MVP + Launch + Roadmap)
- **Mixed-scope notes**:
  - **MVP**: Phases 0-5 (scaffold through components), Phase 7 (documentation assembly), repository structure (palettes/, emitters/, src/, docs/, tests/), build pipeline, CI/CD pipeline.
  - **Launch**: Phase 8 (packages -- `@delightful/tokens`, `@delightful/tailwind`, `@delightful/css`, `@delightful/react`), Phase 9 (platform distribution -- Claude Code plugin, distribution repos, READMEs). Note: the team lead's scope definition combines old Phases 8+9 into a single "Launch" Phase 8.
  - **Roadmap**: Phase 6 (Animation System -- spring physics, FLIP, particles as JS modules).
- **Date references**: **Yes, extensively**:
  - "Day 1, morning" (Phase 0)
  - "Day 1, afternoon – Day 2" (Phase 1)
  - "Days 2–3" (Phase 2)
  - "Day 3" (Phase 3)
  - "Day 4" (Phase 4)
  - "Days 4–6" (Phase 5)
  - "Day 6–7" (Phase 6)
  - "Days 7–8" (Phase 7)
  - "Day 8–9" (Phase 8)
  - "Day 9–10" (Phase 9)
  - "from Day 1" (CI/CD)
  - "Do this on Day 1" (npm scope check)
  - Timeline Summary table with Day column
  - "Building an OKLCH Design System in 8 Days with Claude Code" (blog post title)
- **Split required**: Yes. Phase 6 section should be extracted to Roadmap. Phase 8 and Phase 9 should be extracted to Launch. Timeline Summary table must be removed entirely (contains all day references). Phase-specific day references in remaining MVP phases must be removed.
- **Notes**: The Rebuild Plan is the most date-reference-heavy document. The "What This Eliminates" section at the end is package-neutral (applies to all) and should stay in the MVP doc or become a standalone rationale document.

---

### 4. `Documentation/Prompts/Review Prompt.md`

- **Package**: Mixed (MVP + Launch + Roadmap)
- **Description**: A meta-prompt for reviewing the documentation set. Instructs an agent to read all architecture docs and spec files, then perform a 5-criterion review (completeness, cohesion, cross-reference, accuracy, build prompt quality).
- **Mixed-scope notes**: The prompt references all phases indiscriminately -- it asks the agent to review Phase 6 (Animation) content alongside MVP phases. The cross-reference section asks about beta plans (v0.7.0, v0.8.0) that map to Launch scope. The scope enforcement section mentions "companion files" (`delightful-animation.html`, `delightful-motion.html`) which are Roadmap.
- **Date references**: None.
- **Split required**: No. This is a process document, not a spec. It can be updated to reference the correct package-specific documentation when used. However, the file paths it references (`~/Desktop/delightful-design-system/` and `~/Desktop/Working/Base/Projects/Delightful/Plans/`) are now stale -- the Working directory plans no longer exist at those paths.
- **Notes**: Contains broken references to external files in `~/Desktop/Working/Base/Projects/Delightful/Plans/` -- these files are not in the current repo. The prompt should be updated or archived.

---

### 5. `Documentation/Prompts/Orchestration Planning Prompt.md`

- **Package**: Mixed (MVP + Launch)
- **Description**: A meta-prompt for producing an orchestration layer (phase playbook, agent workflow, Linear setup, dependency graph, run prompt, CLAUDE.md). Instructs an agent to read all Documentation/ files and produce execution scaffolding.
- **Mixed-scope notes**: The prompt references "Phases 0-8" which spans MVP (0-5, 7) and Launch (8). It references the Claude Code plugin, platform distribution repos, and package publishing -- all Launch scope. The CLAUDE.md it asks to produce would cover all packages.
- **Date references**: None directly, but it references the Rebuild Plan which contains extensive date references.
- **Split required**: No. This is a process document. It should be updated to reference only the package being orchestrated.
- **Notes**: References "model routing for cost efficiency" with Opus/Sonnet 4.6 sub-agent patterns. References `/linear-issue` and `/simplify` skills. These are workflow concerns, not spec content.

---

### 6. `Documentation/Prompts/Documentation Build Prompt.md`

- **Package**: MVP (primarily)
- **Description**: The prompt that drove the creation of all 74 spec files in Documentation/Specs/. Instructs a fresh agent to read the reference HTML and architecture docs, then produce the complete spec set.
- **Mixed-scope notes**: The prompt explicitly scopes itself to MVP: "We are NOT building external packages, a showcase site, platform distribution repos, or the standalone JS animation system." However, it includes Batch H (blur-grid, tilt-card, spotlight, magnetic-button) in the component list, which the team lead defines as Roadmap. It also includes `docs/motion.html` and `docs/animation.html` in the directory-structure.md scope, which are Roadmap.
- **Date references**: None.
- **Split required**: No (the prompt already executed and produced its output). But the Batch H references should be noted as Roadmap scope if this prompt is reused.
- **Notes**: The prompt correctly identifies that `design-reference.html` is the scope boundary, but some sub-agents produced specs for tilt-card and spotlight from `delightful-animation.html` instead (those components don't exist in the reference HTML). This is documented in sonnet-quality-audit.md.

---

### 7. `Documentation/QA/sonnet-quality-audit.md`

- **Package**: MVP (meta-document about MVP spec quality)
- **Description**: Quality audit of all 74 spec files. Scores every file on structural markers. Identifies issues with tilt-card.md and spotlight.md (originally stubs, later rewritten). Tracks the @layer component omission pattern across 21 specs.
- **Mixed-scope notes**: Covers all 74 specs including Batch H (Roadmap) and emitter/package specs (Launch). But the audit itself is a quality gate document for the documentation effort -- it belongs with whatever package is consuming the specs.
- **Date references**: None.
- **Split required**: No. Quality audit of the spec library as a whole.
- **Notes**: The audit found 72/74 files rated EXCELLENT. The two GOOD-rated files are page-transitions.md (9/11) and staggered-reveal.md (9/11). Most common issue: missing `@layer component` implementation block in 21 component specs.

---

### 8. Token Specs (`Documentation/Specs/tokens/`)

#### 8a. `tokens/palette-schema.md`
- **Package**: MVP (Phase 1)
- **Description**: Complete JSON structure for `palettes/delightful.json`. All 44 primitives, all semantic tokens, terminal hex values, color authority model, validation rules.
- **Date references**: None.
- **Split required**: No.
- **Notes**: Clean MVP scope. The "Platform Consumption" section (Section 8) mentions iOS Swift, Android Kotlin, and Figma -- these are aspirational and not in any current package scope.

#### 8b. `tokens/token-tiers.md`
- **Package**: MVP (Phases 1-3)
- **Description**: Complete 3-tier token inventory. 44 primitives, 52 semantic, 80 component tokens. Cascade layer order. The strict rule.
- **Date references**: None.
- **Split required**: No.
- **Notes**: Contains "Documentation-Only Component Tokens" section (Section 6) showing suggested tokens for buttons, inputs, cards, badges that are NOT yet defined as CSS custom properties. This is implementation guidance for the build phase. Also contains the badge padding discrepancy (W-02 from cohesion review).

#### 8c. `tokens/dark-mode.md`
- **Package**: MVP (Phases 1-3)
- **Description**: Theme switching mechanism, complete token diff (light vs dark), shadow inversion logic, accent brightening strategy, JS theme controller code.
- **Date references**: None.
- **Split required**: No.
- **Notes**: Clean MVP scope. Includes exact JS code for the theme toggle.

---

### 9. Foundation Specs (`Documentation/Specs/foundation/`)

All 8 files are **MVP (Phase 3)** scope. No date references. No splits required.

| File | Description | Notes |
|------|-------------|-------|
| `typography.md` | Font declarations, fluid scale, fixed UI scale, tracking, leading | Clean MVP |
| `spacing.md` | 13-stop spacing scale, 4px base unit | Clean MVP |
| `radius.md` | 5 radius tokens, component usage mapping | Clean MVP |
| `shadows.md` | 9 shadow tokens, zero-blur rule, dark mode inversion | Clean MVP |
| `motion.md` | 5 timing tokens, 7 easing functions (5 cubic-bezier + 2 spring) | Clean MVP |
| `z-index.md` | 7 z-index stops | Clean MVP |
| `reset.md` | CSS reset rules, focus-visible, reduced-motion gate | Clean MVP |
| `utilities.md` | ~28 utility classes in @layer utilities | Clean MVP |

---

### 10. Component Specs (`Documentation/Specs/components/`)

47 component spec files total. Categorized by package:

#### MVP Components (43 files)

**Batch A -- Simple Display (6 files)**:
| File | Package | Notes |
|------|---------|-------|
| `badge.md` | MVP | 11/11 EXCELLENT |
| `avatar.md` | MVP | 11/11 EXCELLENT |
| `tooltip.md` | MVP | 11/11 EXCELLENT |
| `empty-state.md` | MVP | 11/11 EXCELLENT |
| `divider.md` | MVP | 11/11 EXCELLENT |
| `notification-badge.md` | MVP | 11/11 EXCELLENT |

**Batch B -- Interactive (3 files)**:
| File | Package | Notes |
|------|---------|-------|
| `button.md` | MVP | 11/11 EXCELLENT |
| `card.md` | MVP | 11/11 EXCELLENT |
| `tile.md` | MVP | 11/11 EXCELLENT |

**Batch C -- Forms (8 files)**:
| File | Package | Notes |
|------|---------|-------|
| `input.md` | MVP | 11/11 EXCELLENT |
| `textarea.md` | MVP | 11/11 EXCELLENT |
| `select.md` | MVP | 11/11 EXCELLENT |
| `multi-select.md` | MVP | 11/11 EXCELLENT |
| `checkbox.md` | MVP | 11/11 EXCELLENT |
| `radio.md` | MVP | 11/11 EXCELLENT |
| `toggle.md` | MVP | 11/11 EXCELLENT |
| `range.md` | MVP | 11/11 EXCELLENT |

**Batch D -- Navigation (8 files)**:
| File | Package | Notes |
|------|---------|-------|
| `topnav.md` | MVP | 10/11, missing @layer block |
| `tabs.md` | MVP | 10/11, missing @layer block |
| `breadcrumbs.md` | MVP | 10/11, missing @layer block |
| `pagination.md` | MVP | 10/11, missing @layer block |
| `sidebar.md` | MVP | 10/11, missing @layer block |
| `segmented-control.md` | MVP | 10/11, missing @layer block |
| `command-palette.md` | MVP | 10/11, missing @layer block |
| `skip-link.md` | MVP | 10/11, missing @layer block |

**Batch E -- Data (4 files)**:
| File | Package | Notes |
|------|---------|-------|
| `table.md` | MVP | 10/11, missing @layer block |
| `stepper.md` | MVP | 10/11, missing @layer block |
| `scroll-progress.md` | MVP | 10/11, missing @layer block |
| `back-to-top.md` | MVP | 10/11, missing @layer block |

**Batch F -- Feedback (5 files)**:
| File | Package | Notes |
|------|---------|-------|
| `toast.md` | MVP | 10/11, missing @layer block |
| `alert.md` | MVP | 10/11, missing @layer block |
| `modal.md` | MVP | 10/11, missing @layer block |
| `drawer.md` | MVP | 10/11, missing @layer block |
| `progress.md` | MVP | 10/11, missing @layer block |

**Batch G -- Display (6 files)**:
| File | Package | Notes |
|------|---------|-------|
| `popover.md` | MVP | 11/11 EXCELLENT |
| `code-block.md` | MVP | 11/11 EXCELLENT |
| `skeleton.md` | MVP | 11/11 EXCELLENT |
| `accordion.md` | MVP | 11/11 EXCELLENT |
| `dropdown.md` | MVP | 11/11 EXCELLENT |
| `bento-grid.md` | MVP | 10/11, layout-only |

**Batch I -- Composition (3 files)**:
| File | Package | Notes |
|------|---------|-------|
| `sidebar-layout.md` | MVP | 11/11 EXCELLENT |
| `staggered-reveal.md` | MVP | 9/11 GOOD, JS-only animation |
| `page-transitions.md` | MVP | 9/11 GOOD, JS-inline transitions |

#### Roadmap Components -- Batch H (4 files)

| File | Package | Notes |
|------|---------|-------|
| `blur-grid.md` | **Roadmap** | 10/11. CSS-only component, present in design-reference.html. Scope definition places it in Roadmap (Batch H). |
| `tilt-card.md` | **Roadmap** | 10/11. NOT in design-reference.html; sourced from delightful-animation.html. Requires JS spring physics (Phase 6). |
| `spotlight.md` | **Roadmap** | 10/11. NOT in design-reference.html; sourced from delightful-animation.html. Requires JS. |
| `magnetic-button.md` | **Roadmap** | 11/11. Present in design-reference.html. Requires JS for cursor tracking. Scope definition places it in Roadmap (Batch H). |

---

### 11. Motion Specs (`Documentation/Specs/motion/`)

#### 11a. `motion/keyframes.md`
- **Package**: MVP (Phase 4)
- **Description**: 22 `@keyframes` definitions from design-reference.html. Exact keyframe definitions, component usage, duration/easing recommendations.
- **Date references**: None.
- **Split required**: No.
- **Notes**: Documents 22 of the 59 total keyframes (the ones in the showcase). The remaining 37 keyframes are a Phase 4 build deliverable sourced from the beta motion page, not a separate doc deliverable.

#### 11b. `motion/animation-classes.md`
- **Package**: MVP (Phase 4)
- **Description**: All `.anim-*` utility classes, stagger delay classes (`.anim-d1` through `.anim-d12`), hover utilities, `prefers-reduced-motion` wrapper.
- **Date references**: None.
- **Split required**: No.

#### 11c. `motion/inline-behaviors.md`
- **Package**: Mixed (MVP + Roadmap)
- **Description**: All JavaScript behaviors embedded in design-reference.html. 16 behaviors documented.
- **Mixed-scope notes**: Most behaviors are MVP (theme toggle, toast, command palette, table sorting, row selection, stepper, splash particles, skeleton loading, page transitions, easing demos, scroll progress, back-to-top). However, Sections 8-9 (3D tilt card, cursor spotlight) reference `delightful-animation.html` and are Roadmap. Section 10 (magnetic button) references design-reference.html but is Batch H (Roadmap). Section 11 (spring physics demos) is Roadmap (Phase 6).
- **Date references**: None.
- **Split required**: Yes. Sections 8 (tilt card), 9 (spotlight), 10 (magnetic button), and 11 (spring physics demos) should be extracted to a Roadmap document.

---

### 12. Emitter Specs (`Documentation/Specs/emitters/`)

#### 12a. `emitters/css-emitter.md`
- **Package**: MVP (Phase 2)
- **Description**: How palette JSON becomes tokens.css. Input format, output format, token naming, shadow generation.
- **Date references**: None.
- **Split required**: No.

#### 12b. `emitters/vscode-emitter.md`
- **Package**: MVP (Phase 2)
- **Description**: How palette JSON becomes VS Code theme. ~324 color property mappings, OKLCH-to-hex conversion.
- **Date references**: None.
- **Split required**: No.

#### 12c. `emitters/obsidian-emitter.md`
- **Package**: MVP (Phase 2)
- **Description**: How palette JSON becomes Obsidian theme. `--d-*` namespace, Style Settings plugin config.
- **Date references**: None.
- **Split required**: No.

#### 12d. `emitters/terminal-emitters.md`
- **Package**: MVP (Phase 2)
- **Description**: Ghostty and iTerm2 emitter specs. Plain-text and plist XML formats. Shared ANSI palette.
- **Date references**: None.
- **Split required**: No.

#### 12e. `emitters/orchestrator.md`
- **Package**: Mixed (MVP + Launch)
- **Description**: Build pipeline coordinator. Validation, emitter execution, file I/O, reporting.
- **Mixed-scope notes**: The orchestrator runs ALL emitters including Starship and Tailwind. The Starship emitter is MVP (Phase 2). The Tailwind emitter output goes to `packages/tailwind/dist/preset.js` -- the emitter itself is MVP (Phase 2) but the package wrapper is Launch (Phase 8). The orchestrator also references `npm run build:packages` which is Launch scope.
- **Date references**: None.
- **Split required**: No. The orchestrator is MVP -- it just needs to be noted that some of its output feeds into Launch packaging.
- **Notes**: cohesion-review identified two missing emitter specs: `starship-emitter.md` (W-12) and `tailwind-emitter.md` (W-13). Both are MVP gaps.

---

### 13. Testing Specs (`Documentation/Specs/testing/`)

#### 13a. `testing/test-strategy.md`
- **Package**: MVP (Phases 0-7)
- **Description**: Overall testing approach. Playwright coverage categories, configuration, CI/CD integration.
- **Date references**: None.
- **Split required**: No.

#### 13b. `testing/token-tests.md`
- **Package**: MVP (Phases 1-2)
- **Description**: Schema validation, WCAG contrast, CSS correctness, cross-port consistency assertions.
- **Date references**: None.
- **Split required**: No.

#### 13c. `testing/component-tests.md`
- **Package**: Mixed (MVP + Roadmap)
- **Description**: Per-component test specs for all 47 components.
- **Mixed-scope notes**: Test specs for Batch H components (blur-grid, tilt-card, spotlight, magnetic-button) are Roadmap. All other component tests are MVP.
- **Date references**: None.
- **Split required**: Yes. Batch H component test sections should be extracted to Roadmap.

#### 13d. `testing/motion-tests.md`
- **Package**: MVP (Phase 4)
- **Description**: Reduced-motion compliance, keyframe verification, spring easing validation, timing tokens.
- **Date references**: None.
- **Split required**: No.

---

### 14. Integration Specs (`Documentation/Specs/integration/`)

#### 14a. `integration/build-pipeline.md`
- **Package**: Mixed (MVP + Launch)
- **Description**: End-to-end `npm run build` specification. 10 steps from validation through output report.
- **Mixed-scope notes**: Steps 1-7 and 9-10 are MVP (validate, emit tokens, emit ports, bundle components, report). Step 8 (emit Tailwind preset to `packages/tailwind/dist/preset.js`) bridges MVP (the emitter) and Launch (the package). The "Build Output Report" references package outputs.
- **Date references**: None.
- **Split required**: No. Minor Launch references can be annotated.
- **Notes**: Contains the same shadow token error as the architecture docs -- Step 2 output shows `--shadow-md: 4px 4px 0 var(--text-primary)` instead of `var(--border-default)`.

#### 14b. `integration/cascade-layers.md`
- **Package**: Mixed (MVP + Launch)
- **Description**: Layer order, what goes in each layer, how component files declare membership, consumer import patterns.
- **Mixed-scope notes**: Section 4 (How Consumers Import) references `@delightful/tokens`, `@delightful/css` package paths. These are Launch scope. The layer architecture itself is MVP.
- **Date references**: None.
- **Split required**: No. Consumer import examples can be annotated as Launch-phase documentation.

#### 14c. `integration/directory-structure.md`
- **Package**: Mixed (MVP + Launch + Roadmap)
- **Description**: Every file and directory in the rebuilt repo with purpose, authored/generated status, consumer entry points.
- **Mixed-scope notes**:
  - **MVP**: `palettes/`, `emitters/`, `src/` (tokens, foundation, reset, utilities, motion, components), `docs/` (index.html, color.html, preview-light.html, preview-dark.html), `ports/`, `tests/`, root configs.
  - **Launch**: `packages/` (tokens, css, tailwind) with package.json manifests, exports maps, dist/ outputs. `scripts/bump-version.mjs`. Distribution READMEs.
  - **Roadmap**: `src/animation/` (spring.js, flip.js, particles.js, index.js). `docs/motion.html`, `docs/animation.html`.
- **Date references**: None.
- **Split required**: Yes. The directory structure should be maintained per-package or annotated with package ownership markers.

---

### 15. Review Spec (`Documentation/Specs/review/`)

#### 15a. `review/cohesion-review.md`
- **Package**: MVP (meta-document about spec quality)
- **Description**: Systematic cross-check of all 74 spec files. 10 review sections covering tokens, layers, tier compliance, interaction patterns, dark mode, test coverage, dependencies, rebuild plan alignment, placeholder components, and design reference scope coverage.
- **Date references**: None.
- **Split required**: No.
- **Notes**: Identified 1 critical finding (shadow token error), 16 warnings, and 8 informational notes. Key gaps: missing starship-emitter.md, missing tailwind-emitter.md, toggle primitive violation language conflict, badge padding discrepancy. Also notes that pagination.md and sidebar.md existence was uncertain during review (both files DO exist in the Specs directory).

---

## Summary

### Files Per Package

| Package | File Count | Notes |
|---------|-----------|-------|
| **MVP** | 61 | 43 component specs + 3 token specs + 8 foundation specs + 2 motion specs (keyframes, animation-classes) + 4 emitter specs + 4 testing specs + 1 review spec |
| **Launch** | 0 (standalone) | No file is purely Launch scope. Launch content is embedded in mixed files. |
| **Roadmap** | 4 (standalone) | blur-grid.md, tilt-card.md, spotlight.md, magnetic-button.md |
| **Mixed** | 14 | See breakdown below |

### Mixed Files Breakdown

| File | Contains MVP | Contains Launch | Contains Roadmap |
|------|:---:|:---:|:---:|
| `design-reference.html` | Yes | -- | Yes (Batch H) |
| `Architecture/Core Concepts & Fundamental Technologies.md` | Yes | Yes (1.0 requirements) | Yes (Animation System) |
| `Architecture/Rebuild Plan.md` | Yes | Yes (Phases 8-9) | Yes (Phase 6) |
| `Prompts/Review Prompt.md` | Yes | Yes (beta plan refs) | Yes (companion files) |
| `Prompts/Orchestration Planning Prompt.md` | Yes | Yes (plugin, distro) | -- |
| `Prompts/Documentation Build Prompt.md` | Yes | -- | Yes (Batch H refs) |
| `Specs/motion/inline-behaviors.md` | Yes | -- | Yes (tilt, spotlight, magnetic, spring demos) |
| `Specs/emitters/orchestrator.md` | Yes | Yes (package outputs) | -- |
| `Specs/testing/component-tests.md` | Yes | -- | Yes (Batch H tests) |
| `Specs/integration/build-pipeline.md` | Yes | Yes (Tailwind package) | -- |
| `Specs/integration/cascade-layers.md` | Yes | Yes (consumer imports) | -- |
| `Specs/integration/directory-structure.md` | Yes | Yes (packages/) | Yes (animation/) |
| `QA/sonnet-quality-audit.md` | Yes | -- | Yes (Batch H scores) |
| `Specs/tokens/palette-schema.md` | Yes | -- | -- (minor: aspirational platforms in Section 8) |

### Files Requiring Splits

| File | Split Description |
|------|------------------|
| `Architecture/Core Concepts & Fundamental Technologies.md` | Extract Section 2.3 (Animation System) to Roadmap. Extract Section 9 (What 1.0 Requires) distribution items to Launch. |
| `Architecture/Rebuild Plan.md` | Extract Phase 6 to Roadmap. Extract Phases 8-9 to Launch. Remove all day/time references. Remove Timeline Summary table. |
| `Specs/motion/inline-behaviors.md` | Extract Sections 8-11 (tilt card, spotlight, magnetic button, spring physics demos) to Roadmap. |
| `Specs/testing/component-tests.md` | Extract Batch H component test sections to Roadmap. |
| `Specs/integration/directory-structure.md` | Annotate or split by package ownership (animation/ to Roadmap, packages/ to Launch). |

### Files With Date/Time References

| File | Date References Found |
|------|----------------------|
| `Architecture/Rebuild Plan.md` | "Day 1, morning", "Day 1, afternoon – Day 2", "Days 2-3", "Day 3", "Day 4", "Days 4-6", "Day 6-7", "Days 7-8", "Day 8-9", "Day 9-10", "from Day 1", Timeline Summary table, "8 Days" in blog title |
| `Architecture/Core Concepts & Fundamental Technologies.md` | "8 Days" in blog post title reference (Section 9.3) |

No other files contain date/time references.

---

## Gap Analysis

### MVP Gaps

1. **Missing: `starship-emitter.md`** -- The Starship emitter is registered in orchestrator.md and listed in the Rebuild Plan (Phase 2), but no dedicated spec file exists. This is an acknowledged gap from the cohesion review (W-12).

2. **Missing: `tailwind-emitter.md`** -- The Tailwind emitter is registered in orchestrator.md and listed in the Rebuild Plan (Phase 2), but no dedicated spec file exists. This is an unacknowledged gap from the cohesion review (W-13).

3. **Shadow token documentation error** -- `--shadow-md` is documented as `var(--text-primary)` in Core Concepts Section 3.3 and cascade-layers.md. The correct value is `var(--border-default)` per the CSS emitter spec and design-reference.html. This is critical (W-01/W-14 from cohesion review). Also appears in build-pipeline.md Step 2 output.

4. **Toggle primitive violation stance** -- Core Concepts calls the toggle's use of `--primitive-neutral-0` and `--primitive-neutral-300` "a blocking fix." Token-tiers.md calls them "intentional exceptions." These must be reconciled before build begins (W-08/W-16).

5. **Badge padding discrepancy** -- `token-tiers.md` defines `--badge-py: 2px`, `--badge-px: 10px`. Badge component spec uses `var(--space-1)` (4px) and `var(--space-3)` (12px). Values do not match (W-02).

6. **Missing showcase docs spec** -- The MVP includes `docs/index.html`, `docs/color.html`, `docs/preview-light.html`, `docs/preview-dark.html` but there is no dedicated spec for how these documentation pages should be assembled. The Rebuild Plan describes them (Phase 7) and test-strategy.md covers testing them, but no `docs/showcase-assembly.md` or equivalent spec exists.

7. **21 component specs missing @layer component implementation block** -- The sonnet-quality-audit identified that 21 of 47 component specs lack a consolidated `@layer component { }` CSS block. The content is documented in tables but not assembled into implementation-ready CSS. This affects: alert, back-to-top, breadcrumbs, command-palette, drawer, modal, pagination, progress, scroll-progress, segmented-control, sidebar, skip-link, stepper, table, tabs, toast, topnav, page-transitions, staggered-reveal, and 2 others.

### Launch Gaps

1. **No standalone Launch documentation** -- There are zero files dedicated to Launch (Phase 8) scope. All Launch content is embedded in mixed documents. The refactored documentation needs:
   - Package architecture spec (npm workspace config, exports maps, peer dependencies)
   - Publish pipeline spec (changesets, version bumping, lockstep publishing)
   - Claude Code plugin spec (skills, agents, reference doc)
   - Platform distribution spec (per-platform submission requirements, READMEs, screenshots)
   - `@delightful/react` spec (typed wrappers, forwardRef patterns, compound components)

2. **Package exports maps only in directory-structure.md** -- The exports map documentation for `@delightful/tokens`, `@delightful/css`, and `@delightful/tailwind` exists only as a subsection of directory-structure.md. This needs to be promoted to a dedicated Launch spec.

3. **No changesets/versioning spec** -- The Rebuild Plan mentions "atomic version bump" via `scripts/bump-version.mjs` but there is no spec for the changesets workflow, version strategy, or release process.

### Roadmap Gaps

1. **Tilt-card and spotlight specs reference wrong source** -- Both specs reference `delightful-animation.html` as their source because these components do not exist in `design-reference.html`. If/when these are built, they need a proper reference source.

2. **No Phase 6 architecture spec** -- The spring physics engine, FLIP utilities, and particle system have brief descriptions in Core Concepts Section 2.3 and Rebuild Plan Phase 6, but no detailed architecture or API spec exists.

3. **No `docs/motion.html` or `docs/animation.html` spec** -- These showcase pages are listed in the directory structure but have no assembly specification.

4. **37 additional keyframes undocumented** -- `keyframes.md` covers 22 keyframes from the showcase. The remaining 37 (of 59 total) that exist in the beta motion page have no spec. These are Phase 4 build deliverables but the spec only covers the showcase subset.

---

## Recommendations

1. **Split the Rebuild Plan first** -- It is the most date-heavy and mixed-scope document. Create three derivative documents: `MVP-Build-Plan.md`, `Launch-Build-Plan.md`, `Roadmap-Build-Plan.md`. Strip all day/time references.

2. **Fix the shadow token error immediately** -- Update Core Concepts Section 3.3, cascade-layers.md Section 2, and build-pipeline.md Step 2 to use `var(--border-default)` for `--shadow-md`.

3. **Resolve the toggle violation stance** -- Pick one: either "intentional exception" or "blocking fix." Update both Core Concepts and token-tiers.md to match.

4. **Create Launch package stubs** -- Even if Launch specs are written later, create placeholder files that identify the scope boundary so MVP work doesn't accidentally include Launch deliverables.

5. **Move Batch H specs to a Roadmap directory** -- `blur-grid.md`, `tilt-card.md`, `spotlight.md`, `magnetic-button.md` should be clearly marked or relocated so MVP builders don't attempt to implement them.

6. **Write the two missing emitter specs** -- `starship-emitter.md` and `tailwind-emitter.md` are MVP Phase 2 gaps that should be filled before build begins.

7. **Add @layer component blocks to 21 component specs** -- This is a mechanical task that significantly improves implementation readiness.
