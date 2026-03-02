---
title: "Phase 8b: React Components"
date: 2026-03-02
type: prompt
scope: launch
status: shell
---

> **Shell Prompt** -- This prompt will be revised before execution. Resolve all open questions in the "Before running this prompt" section first.

---

## Before running this prompt, resolve:

- [ ] React version support: 18+ only, or also React 17?
- [ ] SSR compatibility requirements: must all components work server-side?
- [ ] Test framework: React Testing Library + Vitest, or React Testing Library + Jest?
- [ ] Bundler: tsup, rollup, or Vite library mode?
- [ ] JSX transform: classic or automatic?
- [ ] State management: uncontrolled-by-default with controlled override, or fully controlled?
- [ ] Complex interactions (Select, Command Palette): inline logic or headless UI library (e.g., Radix)?
- [ ] Animation approach for React components: CSS-only (from @delightful/css) or React animation library?
- [ ] Do you export a `ThemeProvider` component?

---

## Objective

Build `@delightful/react` with typed React wrappers for all Delightful components. Start with must-haves to establish the pattern, then expand.

---

## Instructions

### Step 1: Project Setup

Create `packages/react/` with:
- `package.json` with exports map from `react-package.md`
- `tsconfig.json` for TypeScript compilation
- Bundler configuration (tsup, rollup, or Vite depending on resolved decision)
- Test configuration

### Step 2: Establish Pattern with Button

Build `Button` first. It exercises every API pattern:
- `forwardRef<HTMLButtonElement, ButtonProps>`
- `variant` prop (7 variants + ghost)
- `size` prop (sm, md, lg)
- `loading` state
- `className` merge (consumer classes appended, not replaced)
- `...props` spread for HTML attributes and event handlers
- Exported `ButtonProps` interface

Write tests:
- Renders without errors
- Forwards ref to the DOM `<button>` element
- Applies correct CSS classes for each variant and size
- Merges consumer className
- Passes through aria attributes
- TypeScript: variant prop accepts only valid values

### Step 3: Establish Compound Pattern with Card

Build `Card` as the second component. If Card does not need compound structure, use `Select` instead to establish the compound pattern early.

### Step 4: Build Remaining Must-Haves

Build in order: Badge, Toggle, Input, Select, Textarea, Code Block. Each follows the pattern established by Button. Each gets tests.

### Step 5: Expand to All Components

Work through remaining components following the CSS batch order (A through I). Each component:
1. Read the component spec in `Documentation/Specs/components/`.
2. Create the React wrapper following the Button pattern.
3. Write tests.
4. Export from the package index.

### Step 6: Validate

Run the React API review checklist from `QA/react-api-review.md` for every component. Run the package validation checklist's React section from `QA/package-validation.md`.
