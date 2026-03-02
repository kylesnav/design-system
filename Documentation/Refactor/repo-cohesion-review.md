---
title: "Repo Cohesion Review"
date: 2026-03-02
type: review
status: active
---

# Repo Cohesion Review

## Scope

This review covers the entire `Documentation/Refactor/` directory (118 files across 3 packages) and its relationship to the original `Documentation/Specs/` (74 files) and `Documentation/Architecture/` (2 files). The review verifies:

1. No original spec files are orphaned (every original spec has a Refactor counterpart)
2. No contradictions exist between the three Refactor packages (MVP, Launch, Roadmap)
3. All minor issues flagged by the per-package reviewer have been fixed
4. The documentation set is navigable via an index README

## Orphaned Files Check

**Result: No orphaned files.**

Every file in `Documentation/Specs/` has a corresponding file in at least one Refactor package. Five files do not have exact name matches in the Refactor directory:

| Original Spec | Refactor Counterpart | Package |
|---------------|---------------------|---------|
| `components/blur-grid.md` | `Specs/blur-grid-brief.md` | Roadmap |
| `components/tilt-card.md` | `Specs/tilt-card-brief.md` | Roadmap |
| `components/spotlight.md` | `Specs/spotlight-brief.md` | Roadmap |
| `components/magnetic-button.md` | `Specs/magnetic-button-brief.md` | Roadmap |
| `review/cohesion-review.md` | N/A (review artifact, not a spec) | -- |

The four Batch H components are represented as feature briefs in the Roadmap package, which is correct -- they are deferred items that will be fully re-specced when the time comes. The original `cohesion-review.md` is a pre-refactor review artifact; it does not require a Refactor counterpart.

## Cross-Package Consistency Check

**Result: No contradictions found.**

Verified the following consistency points:

- **File paths**: MVP's `directory-structure.md` defines `src/tokens.css`, `src/components/*.css`, `src/foundation.css`, `src/reset.css`, `src/motion/motion.css`, and `src/components/index.css`. Launch's package specs (css-package.md, tokens-package.md) reference these exact same paths as inputs. No path mismatches.

- **Token architecture**: All three packages reference the same 3-tier model (primitive, semantic, component), the same no-primitive rule, and the same known exception (toggle component). No conflicting definitions.

- **Component count**: MVP consistently states 43 components. Launch's react-package.md now correctly states 8 must-haves + 35 remaining = 43 total (fixed from previous error of "remaining 43").

- **Prerequisite chains**: Launch explicitly states "MVP must be complete before this phase begins" throughout. Roadmap's architecture and sequencing guide list specific MVP stability criteria (43 components passing, motion.css finalized, layer architecture confirmed). Neither package redefines MVP's deliverables.

- **Cascade layer order**: All three packages reference the same layer order: `@layer reset, primitives, semantic, component, utilities`. No contradictions.

- **Lift/press pattern**: Described identically in MVP architecture (Section 8) and referenced consistently in component specs and Launch's React API principles. No conflicting hover/active transform values.

- **Shadow convention**: Consistently described as solid (zero blur) across all packages. No contradicting shadow definitions.

- **Emitter pipeline**: MVP defines 7 emitters with the pure-function contract. Launch references the same emitter outputs as inputs to distribution repos. No pipeline mismatches.

## Minor Issues Fixed

Eight issues were fixed during this review pass:

### MVP Package

1. **`Prompts/phase-5-components.md`**: Removed `code-block.css` from Batch A's "Also" list. Code Block appears only in Batch G (where it belongs as a display component).

2. **`Prompts/master-sequence.md`**: Added a "Parallelization Strategy" section under Phase 5. Clarifies that batches A through G and I can be assigned to separate agents in parallel, while components within a batch should be built sequentially (simplest to most complex).

3. **`Specs/motion/animation-classes.md`**: Added a clarifying note at the top of Section 10 (Blur Grid Dimming) explaining that `.blur-grid` and `.blur-card` here refer to motion utility classes, not the `blur-grid` layout component which is deferred to the Roadmap package.

### Launch Package

4. **`Specs/packages/react-package.md`**: Changed "remaining 43 MVP components" to "remaining 35 MVP components (43 total minus the 8 must-haves above)".

5. **`Specs/claude-plugin.md`**: Updated Builder Agent spec path reference from `Documentation/Specs/components/` to `Documentation/Refactor/MVP/Specs/components/`.

6. **`Specs/platform-distribution.md`**: Added specific submission information for three platforms:
   - Ghostty: Submit via PR to the `ghostty-org/themes` GitHub repository (populates ghostty.style)
   - Starship: Submit via PR to Starship GitHub discussions or propose at starship.rs/presets
   - Claude Plugin Directory: Marked as TBD -- the directory is not yet publicly open for submissions

### Roadmap Package

7. **`Prompts/animation-system-planning-prompt.md`**: Updated three path references from `Documentation/Specs/` to `Documentation/Refactor/MVP/Specs/` (motion.md, keyframes.md, animation-classes.md, inline-behaviors.md).

8. **`Prompts/batch-h-planning-prompt.md`**: Verified -- no `Documentation/Specs/` path references were present in this file (the flagged issue did not apply).

## Remaining Known Issues

None. All flagged issues have been addressed. The batch-h-planning-prompt.md path issue (item 8) turned out to not exist in the file -- the file does not contain `Documentation/Specs/` path references.

## Overall Assessment

The Documentation/Refactor/ directory is complete and internally consistent. The three packages (MVP: 85 files, Launch: 17 files, Roadmap: 16 files) cover the full scope of the Delightful Design System from initial scaffold through post-v1.0 evolution. Every original spec file is accounted for. No contradictions exist between packages. All minor issues identified during per-package review have been fixed.

The documentation set is well-structured for agent-driven execution: each package has an Architecture document for orientation, Specs for detailed requirements, Prompts for executable build sequences, and QA checklists for verification. The index README provides a clear entry point and explains the relationships between packages.

The Launch package specs are appropriately marked as "shell" status with open questions that must be resolved after MVP. The Roadmap package specs are appropriately scoped as briefs with planning prompts rather than build commands. Both packages correctly defer to MVP as the prerequisite.

## Verdict

**PASS**

## Recommended Next Step

Begin executing the MVP package by reading `Documentation/Refactor/MVP/Architecture/mvp-architecture.md` and then running phases in order via `Documentation/Refactor/MVP/Prompts/master-sequence.md`.
