---
title: "Launch Package Review Notes"
date: 2026-03-02
type: review
scope: launch
status: shell
---

## Package Status

This Launch package is a **planning shell**, not an implementation-ready spec set. Every spec is marked `status: shell`. Every prompt has a "Before running this prompt, resolve" section with open questions. The package establishes the scope, structure, and decision surface for Phase 8 -- it does not prescribe final answers.

---

## Open Questions That Must Be Resolved Before Phase 8 Begins

### Package Infrastructure

1. **npm scope availability**: Is `@delightful` available on npm? If not, what alternative?
2. **Minimum Node.js version**: 18+ is likely, but must be confirmed against consumer base.
3. **CJS support**: Do `@delightful/tokens` and `@delightful/react` need CommonJS exports (`require()` support), or is ESM-only acceptable?

### Token Package

4. **W3C DTCG JSON depth**: Flat token list with dot-notation names, or nested groups matching the tier structure? Tooling compatibility depends on this.
5. **TypeScript literal types**: Should token declarations use literal string types (`"oklch(0.982 0.008 70)"`) for autocomplete, or plain `string` for smaller declaration files?
6. **Non-color tokens in JSON**: Should `tokens.json` include spacing, radius, motion timing, and other non-color tokens, or only colors?

### Tailwind Package

7. **Extend vs replace**: Does the preset add to Tailwind defaults (`theme.extend`) or replace them (`theme`)? This affects adoption friction vs design system purity.
8. **Dark mode configuration**: The design system uses `data-theme="dark"`. What Tailwind `darkMode` setting maps to this? Likely `selector` with `'[data-theme="dark"]'`.
9. **Tailwind version**: v3 and v4 have different preset formats. Do we target one or ship two presets?

### CSS Package

10. **Source maps**: Ship them for debugging, or omit for smaller package size?
11. **Minification**: Readable only, minified only, or both?
12. **Utilities sub-path**: Should `@delightful/css/utilities` be an export, or are utilities only consumed via the Tailwind preset?

### React Package

13. **React version support**: 18+ only, or also 17?
14. **SSR compatibility**: Must all components render without `window`/`document`?
15. **Test framework**: Vitest or Jest?
16. **Bundler**: tsup, rollup, or Vite library mode?
17. **JSX transform**: Classic or automatic?
18. **Complex component interactions**: Inline logic or headless UI library (Radix)?
19. **State management pattern**: Uncontrolled-by-default with controlled override?
20. **ThemeProvider**: Export one, or leave theme management to consumers?

### Versioning

21. **palette.json version sync**: With Changesets handling package versions independently, how does the `version` field in `palettes/delightful.json` stay in sync?

### Distribution

22. **Platform account readiness**: Are publisher accounts created for VS Code Marketplace, Open VSX, and other submission targets?
23. **Ghostty submission process**: ghostty.style submission requirements need confirmation.
24. **Claude Plugin Directory**: Submission format and process need confirmation.

---

## Assessment: Do the Shell Specs Give Enough Context?

**Yes, with caveats.** The specs define:
- What each package contains (inputs and outputs)
- The exports map for each package (the public API surface)
- The React component API pattern (forwardRef, variant/size props, className merge)
- The versioning strategy (Changesets, independent per-package, semver policy)
- The build pipeline (dependency order, per-package steps)
- The Claude plugin architecture (skills as prompts, auditor/builder agents)
- Platform distribution requirements per platform

What the specs do NOT define (intentionally, as open questions):
- Final technology choices (bundler, test framework, Tailwind version)
- Exact format decisions (DTCG nesting, TypeScript depth, CJS support)
- Consumer-facing trade-offs (extend vs replace, source maps, minification)

These are the decisions that need to be made when the team is ready to execute Phase 8, informed by what was learned during the MVP build.

---

## Contradictions and Assumptions Check

### Rebuild Plan Phase 8 vs Launch Package

The Rebuild Plan (Phase 8) specifies lockstep publishing: "publishes all packages at same version (lockstep)." The Launch package specifies Changesets with independent versioning. **This is an intentional override** -- the team lead's instructions specify Changesets with independent versioning.

### Rebuild Plan Phase 9 vs Launch Package

The Rebuild Plan has Phase 9 (Platform Distribution) as a separate phase. The Launch package combines it into Phase 8c. **This is an intentional override** -- the team lead's instructions merge old Phases 8+9 into a single Launch phase (Phase 8).

### React component count

The Launch package lists 8 must-have React components, then "remaining 43 MVP components." The MVP component count is 43 total (not 43 remaining). The must-haves (Button, Card, Badge, Toggle, Input, Select, Textarea, Code Block) are a subset of the 43. The remaining count would be 35. The specs and prompts correctly note "remaining" as second priority without specifying an incorrect number.

### @delightful/react in Rebuild Plan

The Rebuild Plan marks `@delightful/react` as "deferred to later phase" (Section 8.4). The Launch package includes it as part of Phase 8b. **This is an intentional inclusion** per the team lead's instructions, which list React as a Launch deliverable.

### CSS package peer dependency

The specs correctly list `@delightful/tokens` as a peer dependency for `@delightful/css`. The Rebuild Plan's Phase 8.3 confirms this. No contradiction.

### Tailwind peer dependency

The specs list both `tailwindcss` and `@delightful/tokens` as peer dependencies for `@delightful/tailwind`. The Rebuild Plan's Phase 8.2 confirms this. No contradiction.

---

## Verdict

**PASS** (as a planning shell).

The Launch package provides a complete decision surface for Phase 8. Every deliverable from the team lead's scope definition is accounted for. Open questions are explicitly cataloged. The shell specs give enough structure that Phase 8 execution can begin once the open questions are resolved and MVP is stable. No contradictions block execution -- the intentional overrides of the Rebuild Plan (Changesets over lockstep, combined Phase 8+9, React inclusion) are clearly documented and aligned with the team lead's instructions.

---
## External Review (Package Reviewer)

### Completeness

The Launch package contains 17 files across Architecture (1), Specs (7), Prompts (4), QA (3), and review-notes (1). All expected deliverables are present:

- 4 package specs (tokens, css, tailwind, react)
- versioning.md (Changesets workflow)
- build-publish-pipeline.md (dependency-ordered build steps)
- platform-distribution.md (6 platforms with per-platform details)
- claude-plugin.md (plugin structure with skills and agents)
- 4 prompts covering the 3 sub-phases plus a sequence guide
- 3 QA checklists (package validation, react API review, distribution)

**Shell status**: Every file has `status: shell` in frontmatter. Every spec and prompt file has a shell callout at the top. The architecture document uses "Planning Baseline" instead of "Shell Spec" for its callout -- this is a very minor formatting inconsistency but the intent is the same.

**Open questions**: The open questions in each prompt shell are specific and actionable. The phase-8a prompt lists 10 concrete decisions (npm scope, CJS support, Node version, DTCG format, TypeScript depth, Tailwind extend/replace, Tailwind dark mode, Tailwind version, source maps, utilities). The phase-8b prompt lists 9 React-specific decisions. The phase-8c prompt has a pre-flight checklist with 8 items. These are not vague -- an implementer knows exactly what must be decided.

**react-package.md**: Clearly identifies the 8 must-have components (Button, Card, Badge, Toggle, Input, Select, Textarea, Code Block) and describes the pattern for extending to remaining components (follow the Button pattern, work through CSS batch order A-I). The component API pattern section includes a complete code example with forwardRef, variant/size props, className merge, and props spread.

**versioning.md**: Clearly explains the Changesets workflow with setup commands, the `npx changeset` interactive flow, the file format of a changeset, the review process, and the GitHub Actions publish workflow with YAML. The semver policy table covers all 4 packages. This is sufficient for someone unfamiliar with Changesets.

**platform-distribution.md**: Covers all 6 platforms with per-platform sections. VS Code has the most detail (packaging, submission process, required files, update process). Obsidian has good detail including the manifest.json structure. Ghostty and Starship sections are lighter -- they describe the file format and submission target but lack specific submission URLs or step-by-step instructions. Claude Plugin section is the lightest -- "Submit to Claude Plugin Directory following the plugin format requirements" is vague.

**MVP assumptions**: The Launch package correctly assumes MVP deliverables exist at their actual paths (`src/tokens.css`, `src/components/*.css`, `src/foundation.css`, `src/reset.css`, `src/motion/motion.css`) without redefining them. The phase-8-sequence.md includes a pre-execution checklist that verifies these files exist.

### Cohesion

The 4 package specs, architecture doc, build-publish-pipeline, and versioning spec tell a consistent story. The peer dependency chain is correctly described across all files (tokens -> tailwind/css -> react). The exports maps in the package specs match the import patterns described in the architecture doc's consumer usage examples.

The prompts reference the correct spec files. Phase-8a references tokens-package.md, tailwind-package.md, css-package.md, and versioning.md. Phase-8b references react-package.md. Phase-8c references claude-plugin.md and platform-distribution.md. Each prompt references its corresponding QA checklist for validation.

The QA checklists cover the acceptance criteria implied by the specs. Package-validation.md tests the exports maps, tree-shaking, and cross-package integration. React-api-review.md tests the component API patterns described in react-package.md. Distribution-checklist.md tests the per-platform requirements from platform-distribution.md.

No scope leaks found -- no Launch file references MVP build instructions or Roadmap content.

### Guidance Quality

An agent picking up the Launch package would know:
1. Read phase-8-sequence.md for the overall execution order
2. Resolve open questions in each sub-phase prompt before starting
3. For each sub-phase, follow the numbered steps in the prompt
4. Validate against the corresponding QA checklist
5. The sequence of dependencies is clear: tokens first, then tailwind/css in parallel, then react after css

Phase dependencies are well-defined. The architecture doc's "Peer dependency chain" diagram makes the build order obvious. The build-publish-pipeline spec explicitly states which packages can run in parallel.

The shell status is appropriate -- these specs acknowledge that decisions will be refined after MVP learning.

### Issues Found

1. **Minor -- Architecture doc callout inconsistency**: `launch-architecture.md` uses "Planning Baseline" in its callout (line 9) while all other Launch files use "Shell Spec" / "Shell Prompt" / "Shell QA". Recommended fix: change to "Shell Architecture" or "Shell Spec" for consistency.

2. **Minor -- Platform distribution detail gap**: Ghostty submission (line 94): just "Submit theme file to ghostty.style" without URL or specific process. Starship submission (line 131): "Submit to Starship presets" without URL or format. Claude Plugin (line 141): "Submit to Claude Plugin Directory following the plugin format requirements" is vague. These sections lack the specificity of the VS Code and Obsidian sections. Recommended fix: add submission URLs and step-by-step instructions when these become available.

3. **Minor -- React component count wording**: The phase-8b prompt Step 5 says "Expand to All Components" and "work through remaining components." The react-package.md Section 3 says "remaining 43 MVP components." Since the 8 must-haves are a subset of 43, the "remaining" count is actually 35. The review-notes correctly flag this but the spec text is slightly misleading. Recommended fix: change react-package.md Section 3 to "remaining 35 MVP components."

4. **Minor -- Missing `flip.js` and `particles.js` standalone briefs**: Not a Launch issue per se, but the claude-plugin.md's builder agent references generating React wrappers from component spec files at `Documentation/Specs/components/` -- this path assumes the original (pre-refactor) spec directory structure, not the refactored `Documentation/Refactor/MVP/Specs/components/` path. This should be updated when the plugin is built.

### Verdict

PASS -- The Launch package is a well-structured planning shell that provides a complete decision surface for Phase 8. All 24 open questions are cataloged, all deliverables are covered, shell status is consistently applied, and MVP assumptions are correct. No critical issues found. Four minor issues noted -- none would block execution.
