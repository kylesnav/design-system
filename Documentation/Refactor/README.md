---
title: "Delightful Design System — Refactor Documentation Index"
date: 2026-03-02
type: index
status: active
---

# Delightful Design System — Documentation Packages

This folder contains the complete refactored documentation for building, launching, and evolving the Delightful Design System. The documentation is organized into three scoped packages — MVP, Launch, and Roadmap — each representing a distinct phase of work with its own architecture, specs, prompts, and quality checklists. The three packages form a strict dependency chain: MVP must ship before Launch begins, and Launch must be substantially complete before Roadmap work starts. This separation ensures each phase can be executed with clear boundaries and verifiable acceptance criteria.

## Package Overview

| Package | Scope | Files | Status | Description |
|---------|-------|-------|--------|-------------|
| **MVP** | Phases 0--7 | 85 | Active | Full build from scaffold through showcase. Tokens, emitters, foundation, motion, 43 components, documentation pages. |
| **Launch** | Phase 8 | 17 | Planning Shell | npm packages (`@delightful/tokens`, `@delightful/css`, `@delightful/tailwind`, `@delightful/react`), platform distribution, Claude Code plugin. |
| **Roadmap** | Post-v1.0 | 16 | Deferred | Batch H components (blur-grid, tilt-card, spotlight, magnetic-button), Animation JS system (`spring.js`, `flip.js`, `particles.js`), motion catalog, animation demos. |

## MVP — Build Through the Showcase

The MVP package delivers the entire Delightful Design System as a working, testable product: a single design language defined once and propagated to every tool in a developer's workspace. It covers seven build phases (0 through 7, excluding Phase 6 which is deferred to Roadmap), starting from an empty scaffold and ending with interactive documentation pages assembled from source files.

The MVP builds 43 CSS components organized into eight batches (A through G, I), a complete emitter pipeline that generates platform outputs for VS Code, Obsidian, Ghostty, iTerm2, Starship, and Tailwind from a single palette JSON, and a motion system with 59 CSS keyframes. Every component follows the neo-brutalist aesthetic: 2px borders, solid shadows, lift/press interaction pattern, and strict 3-tier token architecture.

The MVP package is the largest and most detailed of the three. It contains full implementation specs for every component, emitter, and system layer, plus detailed prompt files that can be executed by AI agents in sequence to build the entire system from scratch.

### How to Use the MVP Package
- Start with `Architecture/mvp-architecture.md` for the complete system overview
- Execute phases in order using `Prompts/master-sequence.md`
- Each phase prompt references specific specs in `Specs/` -- read those specs before starting the phase
- After each phase, verify against the relevant `QA/` checklists
- Phase 5 batches can be parallelized across agents (see the parallelization strategy in `Prompts/master-sequence.md`)

## Launch — Phase 8 (Planning Shell)

The Launch package delivers what MVP does not: installable npm packages and platform reach. It defines four npm packages (`@delightful/tokens`, `@delightful/css`, `@delightful/tailwind`, `@delightful/react`) with exports maps, peer dependency chains, and versioning strategy. It also covers platform distribution repos for submitting design system ports to their respective marketplaces, and a Claude Code plugin with skills and agents for generating Delightful-compliant code.

All Launch specs are marked as "shell" status -- they are planning baselines that will be revised after the MVP build is complete. The MVP build will surface practical decisions (bundler choice, React version support, module format) that these shells intentionally leave as open questions. Do not execute Launch prompts until those open questions are resolved.

Launch combines what the original Rebuild Plan scoped as Phase 8 (Packages) and Phase 9 (Platform Distribution) into a single launch phase numbered Phase 8.

### How to Use the Launch Package
- Read `Architecture/launch-architecture.md` first for the package architecture and philosophy
- Review all open questions in each `Specs/` shell document
- Resolve open questions before running any `Prompts/` -- the prompts assume decisions have been made
- Use `QA/` checklists to validate each sub-phase (packages, React API, distribution)

## Roadmap — Post-v1.0

The Roadmap package contains everything deferred from v1.0: the four Batch H "signature interaction" components (blur-grid, tilt-card, spotlight, magnetic-button), the Animation JS system (`spring.js`, `flip.js`, `particles.js`), and two documentation pages (motion catalog, animation demos). These items were deferred because they depend on JavaScript infrastructure that should not be built until the CSS foundation is proven stable.

The Roadmap specs are feature briefs, not full implementation specs. When the time comes to build them, each item will be fully re-specced based on what was learned during the MVP build. The briefs capture scope, open design decisions, and dependency requirements so that re-speccing starts from a strong foundation rather than from scratch.

The sequencing guide establishes a strict dependency chain: `spring.js` first (the linchpin), then blur-grid (CSS-only quick win), then spotlight and magnetic-button (simpler JS), then tilt-card (most complex), then the documentation pages.

### How to Use the Roadmap Package
- Read `Architecture/roadmap-architecture.md` to understand the deferral rationale and dependency graph
- Use `Prompts/roadmap-sequencing-guide.md` when MVP is stable to plan the execution order
- Do not begin Roadmap work until all MVP tests pass and the system is confirmed stable
- Each planning prompt (`Prompts/animation-system-planning-prompt.md`, `Prompts/batch-h-planning-prompt.md`) guides an agent through the re-speccing process

## How to Execute the Build

See [`how-to-execute.md`](how-to-execute.md) for the operator's guide — prerequisites, phase-by-phase instructions, the between-phase checklist, rules to enforce, and what "MVP done" looks like.

## Execution Order

**MVP → Launch → Roadmap.** This order is strict.

MVP must ship before Launch begins. The Launch package specs are planning shells that depend on decisions and patterns established during the MVP build. Starting Launch before MVP is complete would mean building on unvalidated assumptions.

Launch must be substantially revised and its open questions resolved before Phase 8 execution begins. The shell specs need real answers from the MVP experience before they become actionable build guides.

Roadmap work must not begin until the MVP showcase is complete, all 43 components pass their tests, and the CSS architecture is confirmed stable. The Roadmap items layer JavaScript on top of the CSS foundation -- if that foundation is still shifting, the JS layer will break.

## Original Documentation

The original documentation in `Documentation/Specs/` and `Documentation/Architecture/` is preserved intact. The Refactor packages are additive -- they refit, reframe, and extend the original specs into scoped, executable packages. The original specs remain the canonical reference for detailed component behavior, token definitions, and architectural decisions. The Refactor packages organize that information into a buildable sequence with clear phase boundaries, acceptance criteria, and quality gates.
