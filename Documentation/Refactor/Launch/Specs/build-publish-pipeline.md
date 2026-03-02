---
title: "Build and Publish Pipeline"
date: 2026-03-02
type: spec
scope: launch
status: shell
---

> **Shell Spec** -- This specification will be revised before execution. MVP must be complete before this phase begins.

---

## 1. `npm run build:packages`

This script copies and bundles source files from `src/` into each `packages/*/dist/` directory. It runs after the main `npm run build` (which runs emitters and generates `src/tokens.css`).

### Execution order

The build must run in dependency order: tokens first, then packages that depend on tokens.

```
1. @delightful/tokens
2. @delightful/tailwind  (can run in parallel with css)
3. @delightful/css       (can run in parallel with tailwind)
4. @delightful/react     (must run after css)
```

### Per-package build steps

**@delightful/tokens:**
1. Copy `src/tokens.css` to `packages/tokens/dist/tokens.css`
2. Read `palettes/delightful.json`
3. Generate `packages/tokens/dist/tokens.json` (W3C DTCG format)
4. Generate `packages/tokens/dist/tokens.mjs` (ES module exporting token object)
5. Generate `packages/tokens/dist/tokens.d.ts` (TypeScript declarations)
6. Optionally generate `packages/tokens/dist/tokens.cjs` (CommonJS wrapper)

**@delightful/tailwind:**
1. Copy Tailwind emitter output to `packages/tailwind/dist/preset.js`

**@delightful/css:**
1. Concatenate all `src/components/*.css` into `packages/css/dist/components.css`
2. Copy individual `src/components/*.css` files to `packages/css/dist/components/`
3. Copy `src/foundation.css` to `packages/css/dist/foundation.css`
4. Copy `src/motion/motion.css` to `packages/css/dist/motion.css`
5. Copy `src/reset.css` to `packages/css/dist/reset.css`

**@delightful/react:**
1. Compile TypeScript/JSX source files to ESM output in `packages/react/dist/`
2. Generate TypeScript declarations
3. Optionally generate CJS output

---

## 2. `npm run publish:packages`

Publishing is handled by the Changesets GitHub Actions workflow (see versioning.md). The manual fallback:

```bash
npx changeset version    # Update versions and changelogs
npx changeset publish    # Publish to npm
```

---

## 3. Pre-publish Validation

Before any publish, the following checks must pass:

- [ ] `npm run build` succeeds (emitters + packages)
- [ ] `npm test` passes (all Playwright tests)
- [ ] Each package's `dist/` directory exists and is non-empty
- [ ] `tokens.json` values match `tokens.css` custom property values
- [ ] CSS bundle contains all component imports (no missing files)
- [ ] Each `package.json` has correct `name`, `version`, `exports`, and `peerDependencies`
- [ ] No `dependencies` on `@delightful/tokens` (it must be `peerDependencies`)
- [ ] `npm pack --dry-run` in each package directory shows expected files
- [ ] `files` field in each `package.json` includes `dist/` and excludes source/test files

---

## 4. Clean Build

```bash
# Remove all dist directories
rm -rf packages/*/dist

# Full rebuild
npm run build
npm run build:packages

# Verify
ls packages/tokens/dist/
ls packages/css/dist/
ls packages/tailwind/dist/
ls packages/react/dist/
```
