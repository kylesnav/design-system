---
title: "Roadmap Package Review Notes"
type: review
scope: roadmap
status: active
---

# Roadmap Package Review Notes

Self-review of the Roadmap documentation package against completeness, cohesion, guidance quality, and known issues.

---

## Completeness

### Files Produced

| Directory | File | Status |
|-----------|------|--------|
| Architecture/ | `roadmap-architecture.md` | Complete |
| Specs/ | `animation-system.md` | Complete |
| Specs/ | `batch-h-overview.md` | Complete |
| Specs/ | `blur-grid-brief.md` | Complete |
| Specs/ | `tilt-card-brief.md` | Complete |
| Specs/ | `spotlight-brief.md` | Complete |
| Specs/ | `magnetic-button-brief.md` | Complete |
| Specs/ | `motion-catalog-brief.md` | Complete |
| Specs/ | `animation-demos-brief.md` | Complete |
| Prompts/ | `roadmap-sequencing-guide.md` | Complete |
| Prompts/ | `animation-system-planning-prompt.md` | Complete |
| Prompts/ | `batch-h-planning-prompt.md` | Complete |
| Prompts/ | `showcase-pages-planning-prompt.md` | Complete |
| QA/ | `readiness-criteria.md` | Complete |
| QA/ | `design-review-guide.md` | Complete |
| Root | `review-notes.md` | This file |

All 16 files in the output structure are present.

### Do the Briefs Give Enough Context to Revisit Intelligently?

**Yes.** Each feature brief answers the four core questions: what it is, why it was deferred, what it depends on, and what needs to be decided before speccing it fully. The briefs reference the existing spec files in `Documentation/Specs/components/` for detailed implementation code, avoiding unnecessary duplication while ensuring the trail is followable.

### Are There Gaps?

**`flip.js` and `particles.js` do not have standalone briefs.** They are covered as part of the `animation-system.md` brief, which treats all three modules as a system. The sequencing guide notes that `flip.js` and `particles.js` should be fully specced during Step 8 (animation demos page planning). This is acceptable because their primary consumer is the animation demos page, not individual components. However, if FLIP utilities are needed by MVP components (accordion, modal) before the full Roadmap build, a standalone `flip.js` brief may be needed.

**No brief for the `index.js` barrel module.** It is mentioned in the animation-system brief but is trivial (re-exports only). No standalone brief is warranted.

**`staggered-reveal` and `page-transitions` are MVP components** (Batch I) that may benefit from `spring.js` in the future. The architecture doc mentions staggered-reveal's relationship to spring physics but does not create a brief for upgrading it. This is correct — upgrading existing MVP components is a separate concern from building new Roadmap items.

---

## Cohesion

### Do the Sequencing Guide and Planning Prompts Align with the Briefs?

**Yes.** The sequencing guide's 8-step order matches the dependency graph described in the architecture doc:

1. MVP verification (architecture doc Section 3)
2. `spring.js` spec (animation-system brief)
3. `spring.js` build (animation-system brief)
4. Blur-grid (blur-grid brief — CSS-only, quick win)
5. Spotlight + magnetic-button (spotlight brief, magnetic-button brief)
6. Tilt-card (tilt-card brief — most complex, depends on `spring.js`)
7. Motion catalog page (motion-catalog brief)
8. Animation demos page (animation-demos brief)

The planning prompts reference the correct briefs and readiness criteria. The batch-h-planning-prompt correctly requires `spring.js` as a prerequisite before speccing tilt-card and magnetic-button.

### Cross-References Are Consistent

- The architecture doc references all briefs
- The briefs reference the existing spec files
- The planning prompts reference the briefs and readiness criteria
- The readiness criteria cover every item mentioned in the sequencing guide
- The design review guide covers all three categories (JS modules, Batch H components, showcase pages)

---

## Guidance Quality

### Would a Future Agent or Team Understand What Was Deferred and Why?

**Yes.** The architecture doc (Section 1) provides a clear rationale for deferral: CSS-first validation, dependency chains, thematic coherence, documentation page completeness, and MVP scope discipline. Each brief repeats the specific reason for that item's deferral.

### Would a Future Agent Know How to Proceed?

**Yes.** The sequencing guide provides a concrete 8-step order with prerequisites, "what stable means" definitions, and questions to answer before each step. The planning prompts provide structured workflows for the three major work streams (animation system, Batch H components, showcase pages).

### Are the "Before You Begin" Sections Actionable?

**Yes.** Each planning prompt starts with a decision checklist. If the decisions are not yet made, the prompt instructs the agent to stop and resolve them first. This prevents proceeding with incomplete information.

---

## Known Issues Flagged in the Briefs

### 1. Tilt-Card Rotation Angle Conflict

**Location:** `tilt-card-brief.md`, `roadmap-architecture.md` Section 5, `batch-h-planning-prompt.md` Step 3

**Issue:** Task brief says ±12°. Source code produces ±15° target. Spring physics means the card likely never reaches the full target, so perceived rotation may be closer to ±12°.

**Resolution path:** Test the demo, measure the perceived rotation, and decide which value to use. Documented in the batch-h-planning-prompt as Step 3 with explicit instructions.

### 2. Spotlight Data Attribute Pattern

**Location:** `spotlight-brief.md`, `roadmap-architecture.md` Section 5, `readiness-criteria.md`

**Issue:** The spotlight uses `data-accent-r/g/b` HTML attributes for RGB color values, bypassing the design system's OKLCH color authority model. This duplicates color information and breaks the single-source-of-truth principle.

**Resolution path:** Two options documented — read from CSS custom properties (clean but requires OKLCH-to-RGB parsing) or define spotlight-specific CSS custom properties (intermediate approach). Decision deferred to re-spec time.

### 3. Magnetic-Button JS Interaction Model

**Location:** `magnetic-button-brief.md`, `roadmap-architecture.md` Section 5

**Issue:** Existing spec covers only CSS styling and inline demo JS. The full interaction model (lerp vs spring, event cleanup, multi-instance support, attraction radius customization) is not specced.

**Resolution path:** Decision deferred to re-spec time. The batch-h-planning-prompt includes this as a prerequisite decision.

### 4. Blur-Grid `:has()` Browser Support

**Location:** `blur-grid-brief.md`, `readiness-criteria.md`

**Issue:** The more precise `:has()` selector pattern requires browser support that is currently at ~90%. The simpler `:hover` pattern works everywhere but is less precise (triggers in grid gaps).

**Resolution path:** Assess browser support at re-spec time. Documented in readiness criteria as a prerequisite decision.

### 5. Spotlight Reduced-Motion Behavior

**Location:** `spotlight-brief.md`, `batch-h-overview.md`, `readiness-criteria.md`

**Issue:** The existing spotlight implementation has no `prefers-reduced-motion` guard. The spec notes this is intentional because cursor tracking is a "positional response, not an animation." However, the tilt-card (which also responds to cursor position) does gate on reduced-motion.

**Resolution path:** A consistent policy must be decided for all Batch H components. Documented in the batch-h-overview as a shared concern and in readiness criteria as a prerequisite decision.

---

## Verdict

**PASS.**

The Roadmap package is self-contained, internally consistent, and provides sufficient context for a future agent or team to revisit these deferred items intelligently. All known design conflicts are flagged with explicit resolution paths. The sequencing guide provides a clear dependency-aware build order. The planning prompts are structured workflows, not vague instructions. The readiness criteria provide concrete gatekeeping checklists.

No modifications to files in `Documentation/Specs/` or `Documentation/Architecture/` were made. All files have correct frontmatter. No date references are present. No claims about when items will be built — only what needs to happen before they can be.

---
## External Review (Package Reviewer)

### Completeness

The Roadmap package contains 16 files across Architecture (1), Specs (8), Prompts (4), QA (2), and review-notes (1). All expected items are covered:

- 1 architecture overview with rationale for deferral, dependency graph, MVP prerequisites, and design decisions to revisit
- 6 feature briefs (animation-system, batch-h-overview, blur-grid, tilt-card, spotlight, magnetic-button) + 2 showcase page briefs (motion-catalog, animation-demos)
- 4 planning prompts (sequencing guide, animation system, batch H, showcase pages)
- 2 QA documents (readiness-criteria, design-review-guide)

**Feature brief quality**: Each brief answers the four core questions (what, why deferred, dependencies, unknowns). The briefs reference existing spec files in `Documentation/Specs/components/` for detailed implementation code, which avoids duplication. The tilt-card and magnetic-button briefs are the most detailed. The animation-demos brief is appropriately lighter since its dependencies (flip.js, particles.js) do not yet have standalone specs.

**`flip.js` and `particles.js` gap**: As the builder's review notes correctly flag, these two modules lack standalone briefs. They are covered as part of the animation-system.md feature brief, and the sequencing guide notes they should be fully specced during Step 8. This is adequate given their primary consumer is the animation demos page.

**Tilt-card rotation conflict**: The conflict between +-12 degrees (task brief) and +-15 degrees (source code) is clearly documented in three places: tilt-card-brief.md Section "Rotation Angle Conflict", roadmap-architecture.md Section 5, and batch-h-planning-prompt.md Step 3. The resolution path (test the demo, measure perceived rotation, decide) is explicit. This is well-handled.

### Cohesion

**No build commands**: Every Roadmap prompt contains explicit "not a build command" / "planning guide" language in its callout. The prompts use phrasing like "re-spec", "define", "write specifications", and "assess" -- never "implement", "code", or "deploy". The specs use "feature brief" and "briefs, not build guides" consistently. No Roadmap file reads as "build this now."

**Dependency chain**: The sequencing guide's 8-step order correctly shows:
- `spring.js` must be built before tilt-card and magnetic-button (Steps 2-3 before Steps 5-6)
- blur-grid is CSS-only and can proceed after MVP stability without waiting for `spring.js` (Step 4)
- motion catalog needs stable motion.css but not animation JS modules (Step 7)
- animation demos page needs all 3 JS modules (Step 8)

The dependency graph in the sequencing guide (lines 169-187) visually confirms this chain and matches the prose description.

**Blur-grid CSS-only status**: Clearly documented in blur-grid-brief.md ("No JavaScript required"), roadmap-architecture.md ("The outlier in Batch H. Requires no JavaScript"), and the sequencing guide Step 4 ("CSS-only, no JS dependency. Quick win"). There is no ambiguity.

**MVP prerequisites**: The readiness-criteria.md includes all the right "MVP must prove X first" items:
- MVP showcase complete and passing tests
- All 43 components pass Playwright tests
- motion.css finalized (59 keyframes stable)
- Cascade layer architecture confirmed stable
- Motion tokens confirmed correct
- Emitter pipeline builds without errors
- CI/CD green

These cover the specific technical risks the architecture doc identifies in Section 3 (cascade layer stability, motion token interoperability, reduced motion extension, keyframe stability, component token architecture).

**Cross-references**: Architecture doc references all briefs. Briefs reference existing spec files. Planning prompts reference briefs and readiness criteria. Readiness criteria cover every item in the sequencing guide. The design-review-guide covers all three categories (JS modules, Batch H, showcase pages). All cross-references are consistent.

### Guidance Quality

**Would an agent know what to do?** Yes. The sequencing guide provides a concrete 8-step order with "what to re-spec", "what stable means", and "questions to answer" sections for each step. The planning prompts provide structured workflows with prerequisite checklists, decision checkpoints, step-by-step instructions, and expected outputs.

**"Before You Begin" sections**: Each planning prompt starts with prerequisite checkboxes and a "Decisions That Must Be Made First" section. The prompts instruct agents to stop and resolve decisions before proceeding. This is effective gating.

**Spring presets**: The architecture doc (Section 2) and animation-system brief both document the three spring presets (snappy, standard, gentle) with their stiffness/damping/mass values and use cases. The batch-h-planning-prompt includes Step 2 specifically for confirming the spring.js API before speccing components that depend on it.

**No date or timeline references**: Confirmed -- no file contains date references in body text, time estimates, or scheduling claims.

### Issues Found

1. **Minor -- `--motion-slow` value in showcase-pages-planning-prompt.md**: Line 90 lists `--motion-slow` as `360ms`. This is correct per the MVP specs, but the Roadmap file references it as a timing token reference for the motion catalog page. Since the Roadmap explicitly defers to MVP's final values, having the value stated here creates a coupling -- if the MVP build adjusts the value, this reference becomes stale. Recommended: reference the token name without the value, or add a note to verify against the built foundation.css.

2. **Minor -- animation-system-planning-prompt.md references old spec paths**: Step 1 lists paths like `Documentation/Specs/foundation/motion.md` and `Documentation/Specs/motion/keyframes.md`. After the refactor, these files live at `Documentation/Refactor/MVP/Specs/foundation/motion.md` and `Documentation/Refactor/MVP/Specs/motion/keyframes.md`. The paths should be updated, or a note added that paths may change during the refactor.

3. **Minor -- batch-h-planning-prompt.md Step 5 references `Documentation/Specs/components/`**: Line 73 references "Read 2-3 MVP component test files" but does not specify the path. The overall prompt references component specs at the pre-refactor path. Same issue as #2 -- the refactored path structure should be noted.

4. **Observation -- `flip.js` not in dependency path for blur-grid**: The dependency graph shows blur-grid as CSS-only and independent of all JS modules. However, the animation-classes.md in MVP includes `.blur-grid`/`.blur-card` utility classes that use CSS transitions. These motion utilities exist in the MVP scope, separate from the Batch H component spec. This distinction is correctly documented in the MVP review-notes but could benefit from a cross-reference in the blur-grid brief.

### Verdict

PASS -- The Roadmap package is well-constructed planning documentation that correctly defers all items while preserving enough context for intelligent re-speccing. The tilt-card rotation conflict is explicitly documented with a clear resolution path. The dependency chain is correct (spring.js before tilt-card and magnetic-button). Blur-grid is clearly marked as CSS-only. MVP prerequisites are comprehensive. No Roadmap file contains build commands. Three minor path reference issues noted -- none would cause incorrect builds, just temporary confusion about file locations after the refactor.
