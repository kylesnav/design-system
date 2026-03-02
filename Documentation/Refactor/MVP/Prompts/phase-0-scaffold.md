---
title: "Phase 0: Scaffold"
type: prompt
scope: mvp
status: active
---

# Phase 0: Scaffold

> Initialize the repository with build tooling, test runner, linter, CI, and directory structure. The repo must build, lint, and test on every push before any design system code exists.

---

## Context

Read these specs before starting:
- `Specs/integration/directory-structure.md` -- every file and directory with purpose
- `Specs/integration/build-pipeline.md` -- the build command structure
- `Specs/integration/cascade-layers.md` -- layer order declaration
- `Architecture/mvp-architecture.md` -- Section 9 (Build Pipeline)

---

## Deliverables

### 0.1 -- package.json

Create the root `package.json`:

```json
{
  "name": "delightful",
  "version": "1.0.0",
  "private": true,
  "scripts": {
    "build": "node emitters/orchestrator.mjs",
    "test": "npx playwright test",
    "lint": "npx biome check ."
  },
  "devDependencies": {
    "@biomejs/biome": "^1.x",
    "@playwright/test": "^1.x",
    "ajv": "^8.x",
    "culori": "^4.x"
  }
}
```

Install dependencies after creating the file.

### 0.2 -- biome.json

Configure Biome linter. Key rules:
- Format: indent with 2 spaces, single quotes for JS
- No `--primitive-*` references in component CSS (custom rule or grep-based check)
- Standard JS/TS lint rules enabled

### 0.3 -- playwright.config.ts

```typescript
import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  timeout: 30000,
  retries: 0,
  workers: 1,
  reporter: 'html',
  use: {
    browserName: 'chromium',
    headless: true,
  },
});
```

### 0.4 -- CI Workflow

Create `.github/workflows/test.yml`:
- Triggers on push and PR to main
- Node 20
- Install dependencies
- Run `npm run lint`
- Run `npm test`

### 0.5 -- CLAUDE.md

Repo conventions document covering:
- Architecture overview (3-tier tokens, cascade layers, emitter contract)
- What to edit (palettes/delightful.json for colors, src/ for authored CSS)
- What not to edit (src/tokens.css -- generated, ports/ -- generated)
- The no-primitive rule
- Shadow token note (`var(--border-default)`, not `var(--text-primary)`)
- Build command (`npm run build`)

### 0.6 -- Directory Structure

Create all directories (empty with `.gitkeep` where needed):
```
palettes/
emitters/
src/
src/motion/
src/components/
docs/
ports/
ports/vscode/themes/
ports/obsidian/
ports/ghostty/
ports/iterm2/
ports/starship/
tests/
tests/components/
scripts/
.github/workflows/
```

### 0.7 -- Root Files

- `README.md` -- project description
- `.gitignore` -- node_modules, dist, test-results, playwright-report
- `LICENSE` -- MIT

---

## Acceptance Criteria

- [ ] `npm run lint` passes (trivially, on empty project)
- [ ] `npm test` passes (trivially, with no test files or a placeholder)
- [ ] Directory structure matches spec
- [ ] CI workflow file exists at `.github/workflows/test.yml`
- [ ] CLAUDE.md contains architecture overview and editing rules
- [ ] All dependencies install cleanly
