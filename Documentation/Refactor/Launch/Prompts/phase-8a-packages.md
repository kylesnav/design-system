---
title: "Phase 8a: npm Packages"
date: 2026-03-02
type: prompt
scope: launch
status: shell
---

> **Shell Prompt** -- This prompt will be revised before execution. Resolve all open questions in the "Before running this prompt" section first.

---

## Before running this prompt, resolve:

- [ ] Is the `@delightful` npm scope available? If not, what alternative scope will you use?
- [ ] Do you need CJS (`tokens.cjs`) support for `@delightful/tokens`, or is ESM-only sufficient?
- [ ] What is the minimum Node.js version? (Recommended: 18+)
- [ ] W3C DTCG JSON format: flat or nested token structure?
- [ ] TypeScript declarations: literal string types or plain `string` for token values?
- [ ] Tailwind preset: extend (additive) or replace (override Tailwind defaults)?
- [ ] Tailwind dark mode: `selector` strategy with `'[data-theme="dark"]'`?
- [ ] Tailwind version target: v3, v4, or both?
- [ ] CSS package: publish source maps? Minified or readable?
- [ ] CSS package: include `utilities.css` as a sub-path export?

---

## Objective

Build three npm packages from existing source files: `@delightful/tokens`, `@delightful/tailwind`, `@delightful/css`. Set up Changesets for versioning. Configure the GitHub Actions publish workflow.

---

## Instructions

### Step 1: Workspace Configuration

Verify the root `package.json` has the workspaces field:

```json
{
  "workspaces": ["packages/*"]
}
```

### Step 2: Build @delightful/tokens

Create `packages/tokens/package.json` with the exports map from `tokens-package.md`. Write the build script that:
1. Copies `src/tokens.css` to `packages/tokens/dist/tokens.css`.
2. Generates `tokens.json` in W3C DTCG format from `palettes/delightful.json`.
3. Generates `tokens.mjs` exporting the token object.
4. Generates `tokens.d.ts` with typed token keys.

Verify: `import tokens from '@delightful/tokens'` resolves. `import '@delightful/tokens/css'` resolves. Zero dependencies.

### Step 3: Build @delightful/tailwind

Create `packages/tailwind/package.json` with the exports map from `tailwind-package.md`. Copy the Tailwind emitter output to `packages/tailwind/dist/preset.js`.

Verify: Adding the preset to a Tailwind config produces utility classes that reference `var()` tokens.

### Step 4: Build @delightful/css

Create `packages/css/package.json` with the exports map from `css-package.md`. Write the build script that:
1. Bundles all component CSS into `packages/css/dist/components.css`.
2. Copies individual component files to `packages/css/dist/components/`.
3. Copies foundation, motion, and reset to their respective `dist/` paths.

Verify: `import '@delightful/css'` gives the full bundle. `import '@delightful/css/components/button'` gives only button styles.

### Step 5: Set Up Changesets

Install `@changesets/cli`. Run `npx changeset init`. Configure for independent versioning with public access.

### Step 6: Configure Publish Workflow

Create `.github/workflows/publish.yml` with the Changesets GitHub Action. Configure NPM_TOKEN secret.

### Step 7: Validate

Run the package validation checklist from `QA/package-validation.md`. All checks must pass before considering this phase complete.
