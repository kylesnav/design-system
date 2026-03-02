---
title: "Claude Code Plugin Specification"
date: 2026-03-02
type: spec
scope: launch
status: shell
---

> **Shell Spec** -- This specification will be revised before execution. MVP must be complete before this phase begins.

---

## 1. Plugin Structure

```
ports/claude-plugin/
  tokens.css              GENERATED (copy of src/tokens.css)
  design-system.md        AUTHORED (condensed architecture + token reference)
  skills/
    build.md              AUTHORED (prompt: generate component code)
    refactor.md           AUTHORED (prompt: convert to Delightful tokens)
  agents/
    auditor.md            AUTHORED (agent: check token tier violations)
    builder.md            AUTHORED (agent: generate full component implementations)
```

---

## 2. `/build` Skill

**Purpose**: Generate Delightful-compliant component code given a natural language description.

**How it works**:
1. The skill prompt loads `design-system.md` as context.
2. The user describes a component (e.g., "a notification card with an icon, title, message, and dismiss button").
3. Claude generates CSS (in `@layer component`, using `var()` token references) and optional HTML markup.
4. The output follows the same patterns as the component specs: variant classes, semantic token usage, `prefers-reduced-motion` respect, accessibility attributes.

**Acceptance criteria**:
- Generated CSS uses only semantic and component tokens (no primitive refs).
- Generated CSS is wrapped in `@layer component { }`.
- Generated HTML includes appropriate ARIA attributes.
- Output matches the coding style of existing `src/components/*.css` files.

---

## 3. `/refactor` Skill

**Purpose**: Convert existing CSS/HTML to use Delightful tokens and patterns.

**How it works**:
1. The skill prompt loads `design-system.md` and `tokens.css` as context.
2. The user provides existing CSS or HTML code.
3. Claude identifies hardcoded values (hex colors, pixel values, font stacks) and replaces them with the appropriate `var()` token references.
4. Claude restructures the code to use the Delightful layer model and class naming conventions.

**What it detects**:
- Hardcoded color values that map to design tokens
- Hardcoded spacing values that map to the spacing scale
- Hardcoded font declarations that map to the type scale
- Missing `@layer` declarations
- Missing reduced-motion handling

**Limitations**:
- Cannot refactor JavaScript behavior -- only CSS and HTML structure.
- Does not handle third-party component libraries (Tailwind classes, Material UI, etc.) -- only raw CSS.

---

## 4. Auditor Agent

**Purpose**: Review generated or existing code for token tier violations.

**What it checks**:
- References to `--primitive-*` tokens in component-layer CSS (violation of the strict rule)
- Semantic misuse: using accent tokens for backgrounds, text tokens for borders, etc.
- Missing `@layer component` wrapper on component CSS
- Hardcoded values that should be token references
- Missing `prefers-reduced-motion` gate on animations

**What it reports**:
- Line-by-line findings with severity (error, warning, info)
- Suggested fix for each finding
- Overall pass/fail assessment

---

## 5. Builder Agent

**Purpose**: Generate complete component implementations from specs.

**Inputs**:
- A component spec file (from `Documentation/Refactor/MVP/Specs/components/`)
- The design system reference (`design-system.md`)
- Token definitions (`tokens.css`)

**Outputs**:
- `src/components/{name}.css` -- complete component stylesheet
- Optionally: React wrapper component (`packages/react/src/components/{name}.tsx`)
- Optionally: test file (`tests/components/{name}.spec.ts`)

**How it uses component specs**:
- Reads the spec's "CSS Implementation" section for class names, variants, and states
- Reads the spec's "Token Usage" section for which tokens to reference
- Reads the spec's "Accessibility" section for ARIA attributes
- Reads the spec's "Motion" section for animation requirements and reduced-motion handling

---

## 6. Reference Document

`design-system.md` is a condensed version of the architecture documentation, included in the plugin so it works without the full Documentation/ directory. It contains:

- Token tier model (primitive, semantic, component) and the strict rule
- Complete list of semantic tokens with their purposes
- Cascade layer order
- Component CSS patterns (class naming, variant structure, `@layer component`)
- Motion system overview (timing tokens, easing functions, reduced-motion gate)
- Code examples for common patterns

This file is regenerated from the spec files during the build process. It is not hand-maintained.
