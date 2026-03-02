---
title: "Phase Cohesion Checklist"
type: qa
scope: mvp
status: active
---

# Phase Cohesion Checklist

> Validates that the MVP documentation package is internally consistent -- no contradictions between specs, no orphaned references, no scope leaks.

---

## Cross-Spec Consistency

### Token Values
- [ ] Shadow tokens consistently use `var(--border-default)` across ALL specs (never `var(--text-primary)`)
- [ ] Toggle primitive exception is documented consistently in: mvp-architecture.md, token-tiers.md, component-checklist.md, toggle.md
- [ ] Primitive count (44) is consistent across: palette-schema.md, token-tiers.md, mvp-architecture.md
- [ ] Semantic token count (~52) is consistent across all references
- [ ] Component token count (~80) is consistent across all references

### Cascade Layers
- [ ] Layer order `reset, primitives, semantic, component, utilities` is consistent across: mvp-architecture.md, cascade-layers.md, reset.md, phase-3-foundation.md
- [ ] Every component spec wraps rules in `@layer component` (not `@layer reset`, `@layer primitives`, etc.)
- [ ] Foundation tokens live in `@layer component` (documented consistently)

### Interaction Pattern
- [ ] Lift/press values are consistent across: mvp-architecture.md, button.md, card.md, tile.md, pagination.md, component-checklist.md
  - Hover: `translateY(-2px)`, shadow escalates
  - Active: `translate(2px, 2px)`, shadow collapses
  - Disabled: `opacity: 0.4`, `cursor: not-allowed`, `pointer-events: none`
- [ ] All interactive component specs describe the same pattern

### Color Authority
- [ ] OKLCH-authoritative for CSS platforms: documented in mvp-architecture.md, css-emitter.md, obsidian-emitter.md
- [ ] Hex-authoritative for terminal platforms: documented in mvp-architecture.md, terminal-emitters.md, starship-emitter.md
- [ ] No spec suggests converting OKLCH to hex for CSS output
- [ ] No spec suggests deriving terminal hex from OKLCH

### Emitter Contract
- [ ] All emitter specs use the same interface: `emit(palette, options) -> { files, warnings }`
- [ ] All emitters described as pure functions (no I/O)
- [ ] Output paths in emitter specs match paths in directory-structure.md and build-pipeline.md

---

## Scope Boundary Enforcement

### No Phase 6 Content
- [ ] No references to `src/animation/` directory (spring.js, flip.js, particles.js)
- [ ] No references to `docs/animation.html`
- [ ] No references to spring physics engine, FLIP utilities, or canvas particle systems
- [ ] inline-behaviors.md does NOT contain sections for 3D Tilt Card, Cursor Spotlight, or Magnetic Button

### No Batch H Components
- [ ] No specs for: blur-grid.md, tilt-card.md, spotlight.md, magnetic-button.md
- [ ] directory-structure.md does not list: blur-grid.css, tilt-card.css, spotlight.css, magnetic-button.css
- [ ] Component count is 43 (not 47) in all references

### No Launch/Packaging Content
- [ ] No references to `@delightful/*` npm packages as installable dependencies
- [ ] No references to npm publishing, changesets, or distribution repos
- [ ] No references to `@delightful/react`
- [ ] directory-structure.md does not contain `packages/` section (except tailwind preset output path)
- [ ] No references to platform directory submissions or marketplace listings

### No Date/Time References
- [ ] No "Day 1", "Day 2", "Week 1" references in any file
- [ ] No "morning", "afternoon", "evening" references
- [ ] No month/year references in body text (frontmatter `date` field is acceptable)
- [ ] No timeline estimates or schedule references

---

## Reference Integrity

### File Cross-References
- [ ] All `[[wikilink]]` references in specs point to files that exist in the MVP package
- [ ] No broken cross-references to files that were excluded from MVP
- [ ] Emitter specs reference correct output paths
- [ ] Testing specs reference correct component file paths

### Prompt-to-Spec Alignment
- [ ] Each phase prompt references specs that exist in `Specs/`
- [ ] Phase prompt deliverables match spec content
- [ ] Phase acceptance criteria are testable
- [ ] master-sequence.md lists all phases in correct order

### QA-to-Spec Alignment
- [ ] component-checklist.md lists exactly 43 components
- [ ] build-validation.md covers all 7 emitters
- [ ] accessibility-review.md covers all WCAG requirements from component specs
- [ ] This file covers all consistency requirements

---

## Architecture Document Accuracy

- [ ] mvp-architecture.md Section 2 (3-Tier Tokens) matches token-tiers.md
- [ ] mvp-architecture.md Section 3 (Cascade Layers) matches cascade-layers.md
- [ ] mvp-architecture.md Section 4 (Color Authority) matches css-emitter.md and terminal-emitters.md
- [ ] mvp-architecture.md Section 5 (Emitter Contract) matches orchestrator.md
- [ ] mvp-architecture.md Section 6 (Component Architecture) matches component specs
- [ ] mvp-architecture.md Section 7 (Theme System) matches dark-mode.md
- [ ] mvp-architecture.md Section 8 (Lift/Press) matches button.md, card.md, tile.md
- [ ] mvp-architecture.md Section 9 (Build Pipeline) matches build-pipeline.md

---

## Verdict

After completing all checks above:

- [ ] **PASS**: All checks pass, no contradictions found, scope boundaries enforced
- [ ] **NEEDS WORK**: List specific issues below

### Issues Found
<!-- Document any issues found during the cohesion review here -->
