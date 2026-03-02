# Documentation Review Prompt

Paste everything below the line into the existing strategic session (the one with full memory context). Run in plan mode.

---

## Objective

Perform a comprehensive review of the documentation set at `~/Desktop/delightful-design-system/Documentation/` to ensure it is complete, cohesive, and sufficient to rebuild the Delightful Design System from scratch to v1.0.0. This is the quality gate before handing the Documentation Build Prompt to a fresh agent.

## What to Read

Read these files thoroughly, in order:

1. `~/Desktop/delightful-design-system/Documentation/design-reference.html` — the full ~8,000-line reference. This is ground truth for every value, component, interaction, and animation.

2. `~/Desktop/delightful-design-system/Documentation/Architecture/Core Concepts & Fundamental Technologies.md` — the conceptual architecture.

3. `~/Desktop/delightful-design-system/Documentation/Architecture/Rebuild Plan.md` — the phase-by-phase build plan.

4. `~/Desktop/delightful-design-system/Documentation/Documentation Build Prompt.md` — the prompt that will drive the documentation extraction.

5. The old beta plans for cross-reference (read but don't modify these):
   - `~/Desktop/Working/Base/Projects/Delightful/Plans/Theme System Architecture.md`
   - `~/Desktop/Working/Base/Projects/Delightful/Plans/Theme System Execution Plan.md`
   - `~/Desktop/Working/Base/Projects/Delightful/Plans/Package Publishing Architecture.md`
   - `~/Desktop/Working/Base/Projects/Delightful/Plans/Package Publishing Execution Plan.md`
   - `~/Desktop/Working/Base/Projects/Delightful/Plans/Phase 2 Architecture.md`

## Review Criteria

### 1. Completeness Against design-reference.html

Walk through `design-reference.html` section by section and verify:

- **Every CSS custom property** declared in the file is accounted for in the token specification sections of the Build Prompt (palette-schema, token-tiers, or foundation specs). Flag any token that exists in the HTML but has no home in the documentation plan.
- **Every component** rendered in the file has a corresponding entry in the Build Prompt's component batches (A–I). Flag any component present in the HTML but missing from the batches.
- **Every `@keyframes` definition** in the file is accounted for in the keyframes.md spec requirement. Count them — don't assume.
- **Every `<script>` block behavior** in the file is listed in the inline-behaviors.md spec requirement. Flag any JS behavior in the HTML that isn't mentioned.
- **Every CSS class** that represents a utility, animation, or variant is accounted for somewhere in the documentation plan.

### 2. Architecture Cohesion

- **Core Concepts ↔ Rebuild Plan**: Do they agree on the 3-tier model, cascade layer order, color authority model, and technology stack? Flag any contradiction.
- **Core Concepts ↔ Build Prompt**: Does the Build Prompt ask for specs that cover every concept described in Core Concepts? Flag any architectural concept with no corresponding spec requirement.
- **Rebuild Plan ↔ Build Prompt**: Does every phase in the Rebuild Plan have corresponding spec sections in the Build Prompt? Flag any phase whose deliverables aren't covered.
- **Build Prompt internal consistency**: Do the 8 documentation sections (tokens, foundation, components, motion, emitters, testing, integration, review) cover the full scope without gaps or overlaps?

### 3. Cross-Reference Against Beta Plans

Read the v0.7.0 (Theme System) and v0.8.0 (Package Publishing) plans and check:

- **What's already incorporated**: Which parts of those plans are already reflected in the Rebuild Plan and Build Prompt? (These should be most of it — the rebuild subsumes v0.7.0 palette migration and v0.8.0 CSS extraction.)
- **What's missing**: Are there any technical details from those plans that should be in the architecture docs but aren't? Specifically:
  - The JSON Schema validation rules from the Theme System plan
  - The emitter pipeline details (shared utilities, error handling) from the Theme System plan
  - The CSS extraction strategy from the Package Publishing plan
  - The npm workspace configuration from the Package Publishing plan
  - The W3C DTCG token format from the Package Publishing plan
- **What's intentionally excluded**: Confirm that community palettes, palette switcher UI, and Starship/Tailwind emitters are correctly out of scope for v1.0.0.

### 4. Technical Accuracy

Spot-check values from `design-reference.html` against claims in the architecture docs:

- **Color families**: Are all 7 families listed with correct hue values?
- **Spacing scale**: Does the documented scale match the actual `--space-*` tokens in the HTML?
- **Shadow system**: Do the documented shadow sizes and colored variants match the HTML?
- **Typography**: Do the documented font stacks, fluid scale, and fixed scale match the HTML?
- **Spring easing**: Do the documented `linear()` point lists match the HTML?
- **Component count**: Does the actual component count in the HTML match what's claimed?

### 5. Build Prompt Quality

Review the Documentation Build Prompt as if you were the fresh agent receiving it:

- **Is anything ambiguous?** Would a fresh agent need to ask clarifying questions, or can it execute autonomously?
- **Is the scope clear?** Is there any place where the agent might accidentally document out-of-scope content (companion files, standalone animation system)?
- **Are the spec templates complete?** Does the component spec template (visual reference, HTML structure, CSS classes, variants, states, responsive, accessibility, tokens, tests) cover everything an implementer needs?
- **Is the output structure clear?** `Documentation/Specs/` with subdirectories — is the hierarchy unambiguous?
- **Agent architecture**: Is the recommended team structure realistic? Are there dependencies between agents that could cause deadlocks?

## What to Update

Based on findings, make direct edits to:

- **Core Concepts & Fundamental Technologies.md** — update any technical definitions that are inaccurate or incomplete. Add missing concepts. All values must come from `design-reference.html`.
- **Rebuild Plan.md** — update phases, deliverables, or acceptance criteria if they're missing coverage. Add technical details absorbed from the beta plans that are relevant to the rebuild.
- **Documentation Build Prompt.md** — add missing components, fix section numbering, add missing spec requirements, clarify ambiguities. Update component batches if the HTML has components not currently listed.

Do NOT modify `design-reference.html` — it's read-only reference.

## Output

Produce a plan that:

1. Lists every finding organized by review criteria (1–5 above)
2. Categorizes each finding as: **Critical** (blocks the build), **Important** (degrades spec quality), or **Minor** (cosmetic/nice-to-have)
3. For each finding, states the specific edit to make (file, section, what to add/change/remove)
4. After plan approval, executes all edits

The documentation set is ready for the fresh agent when this review passes with zero Critical findings.
