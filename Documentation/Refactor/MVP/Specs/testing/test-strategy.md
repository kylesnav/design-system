---
title: "Test Strategy"
date: 2026-03-02
type: spec
scope: mvp
status: active
---

# Test Strategy

> Overall testing approach for the Delightful Design System rebuild. Playwright handles visual regression, interaction testing, token consistency, and motion accessibility. Tests run on every push via GitHub Actions.

Cross-references: [[Rebuild Plan]] (phase structure and CI/CD), [[token-tiers]] (token inventory for assertion values), [[dark-mode]] (theme switching mechanism), [[motion]] (reduced-motion compliance).

---

## 1. What Playwright Covers

| Category | What it tests | Example |
|---|---|---|
| **Visual regression** | Screenshot comparison of components in all states/themes | Button in 8 variants, light vs dark |
| **Interaction testing** | Hover/active/focus state computed styles, click handlers | Lift/press shadow escalation, toggle aria-checked flip |
| **Token consistency** | Generated CSS contains correct custom properties with correct values | `--primitive-pink-400` = `oklch(0.640 0.270 350)` |
| **Schema validation** | Palette JSON validates against schema, required keys present | All 7 primitive families, OKLCH format regex |
| **WCAG contrast** | Foreground/background pairs meet minimum contrast ratios | `text-primary` on `bg-page` >= 4.5:1 |
| **Motion accessibility** | `prefers-reduced-motion: reduce` disables all animation | `animation-duration` resolves to `0.01ms` |
| **Cross-port parity** | Terminal palettes match across Ghostty, iTerm2, VS Code | Identical ANSI hex values in different formats |
| **Documentation assembly** | Pages load without console errors, interactive features work | Command palette opens on Cmd+K |

---

## 2. Test Configuration

### 2.1 `playwright.config.ts`

```typescript
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  fullyParallel: false,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  workers: 1,
  reporter: process.env.CI ? 'html' : [['html', { open: 'never' }]],

  use: {
    baseURL: 'http://localhost:3000',
    actionTimeout: 5_000,
    navigationTimeout: 10_000,
    screenshot: 'only-on-failure',
    trace: 'retain-on-failure',
  },

  expect: {
    timeout: 5_000,
    toHaveScreenshot: {
      maxDiffPixels: 50,
      threshold: 0.2,
    },
  },

  snapshotDir: './tests/__snapshots__',
  snapshotPathTemplate: '{snapshotDir}/{testFileDir}/{testFileName}-snapshots/{arg}{-projectName}{ext}',

  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],

  webServer: {
    command: 'npx serve docs -l 3000',
    port: 3000,
    reuseExistingServer: !process.env.CI,
    timeout: 10_000,
  },
});
```

### 2.2 Configuration Decisions

| Setting | Value | Rationale |
|---|---|---|
| **Browser** | Chromium only | Single browser as per Rebuild Plan. OKLCH support is Chromium-first. Cross-browser testing is a future concern. |
| **Workers** | `1` (sequential) | No parallelism issues. Tests share a web server. Screenshot baselines are deterministic. |
| **Test timeout** | `5000ms` (default) | Most tests are computed-style checks, not long-running interactions. |
| **Action timeout** | `5000ms` | Click, hover, fill actions. Generous for CI but catches hangs. |
| **Navigation timeout** | `10000ms` | Page loads with all CSS. Generous for CI cold starts. |
| **Reporter** | HTML reporter | Visual diff review for screenshot failures. |
| **Snapshot directory** | `./tests/__snapshots__/` | Co-located with test files. Committed to git. |
| **Base URL** | `http://localhost:3000` | Local dev server serving `docs/` directory. |
| **Screenshot diff** | `maxDiffPixels: 50`, `threshold: 0.2` | Tolerates sub-pixel rendering differences across CI environments. |

---

## 3. Test File Organization

```
tests/
├── palette.spec.ts              -- Schema validation + WCAG contrast checks
├── tokens.spec.ts               -- Emitter output correctness (CSS custom properties)
├── components/
│   ├── button.spec.ts           -- Button variants, states, lift/press, visual regression
│   ├── card.spec.ts             -- Card variants, interactive lift/press, grid dimming
│   ├── toggle.spec.ts           -- Toggle on/off, aria-checked, primitive violations
│   ├── input.spec.ts            -- Focus/error/disabled states
│   ├── checkbox.spec.ts         -- Checked state, checkmark animation
│   ├── toast.spec.ts            -- Auto-dismiss, stacking, progress bar
│   ├── modal.spec.ts            -- Open/close, backdrop, focus trap, escape key
│   ├── table.spec.ts            -- Sort, select, aria-selected
│   ├── accordion.spec.ts        -- Expand/collapse, grid-template-rows, aria-expanded
│   └── command-palette.spec.ts  -- Cmd+K open, search filter, keyboard nav
├── motion.spec.ts               -- Reduced-motion, keyframe existence, spring easings, stagger delays
├── ports.spec.ts                -- Cross-port palette consistency (Ghostty, iTerm2, VS Code, Obsidian)
├── docs.spec.ts                 -- Assembled pages: load, no console errors, theme toggle, screenshots
└── __snapshots__/               -- Visual regression baseline images (committed to git)
    ├── components/
    │   ├── button.spec.ts-snapshots/
    │   ├── card.spec.ts-snapshots/
    │   └── ...
    ├── motion.spec.ts-snapshots/
    └── docs.spec.ts-snapshots/
```

### 3.1 File Responsibilities

| File | What it tests | Depends on |
|---|---|---|
| `palette.spec.ts` | JSON schema, OKLCH format, WCAG contrast, terminal hex format | `palettes/delightful.json`, `palettes/palette.schema.json` |
| `tokens.spec.ts` | Generated CSS correctness, custom property values, layer structure | `src/tokens.css` (post-build) |
| `components/*.spec.ts` | Per-component computed styles, interactions, visual regression | `src/tokens.css`, `src/foundation.css`, `src/components/*.css` |
| `motion.spec.ts` | Reduced-motion gate, keyframe names, spring tokens, stagger delays | `src/tokens.css`, `src/foundation.css`, `src/motion/motion.css` |
| `ports.spec.ts` | Cross-port ANSI palette consistency, VS Code keys, Obsidian namespace | `ports/ghostty/`, `ports/iterm2/`, `ports/vscode/`, `ports/obsidian/` |
| `docs.spec.ts` | Assembled page health: no console errors, theme toggle, Cmd+K | `docs/*.html` |

---

## 4. Test Page Setup

Each component test creates a **minimal HTML page** with only the CSS needed for that component. This verifies that components work in isolation with no cross-component dependencies.

### 4.1 Minimal Test Page Template

```typescript
async function loadComponentPage(page: Page, componentCss: string, html: string): Promise<void> {
  await page.setContent(`
    <!DOCTYPE html>
    <html lang="en" data-theme="light">
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1">
      <style>${await readFile('src/tokens.css', 'utf-8')}</style>
      <style>${await readFile('src/reset.css', 'utf-8')}</style>
      <style>${await readFile('src/foundation.css', 'utf-8')}</style>
      <style>${componentCss}</style>
    </head>
    <body style="padding: 40px; background: var(--bg-page);">
      ${html}
    </body>
    </html>
  `, { waitUntil: 'domcontentloaded' });
}
```

### 4.2 Dark Mode Variant

```typescript
async function switchToDarkMode(page: Page): Promise<void> {
  await page.evaluate(() => {
    document.documentElement.setAttribute('data-theme', 'dark');
  });
  // Allow repaint
  await page.waitForTimeout(100);
}
```

### 4.3 Reduced Motion Emulation

```typescript
async function enableReducedMotion(page: Page): Promise<void> {
  await page.emulateMedia({ reducedMotion: 'reduce' });
}
```

---

## 5. CI/CD Integration

### 5.1 Pipeline Order

```
push/PR
  |
  ├── 1. npm ci                     (install dependencies)
  ├── 2. npx playwright install     (install Chromium)
  ├── 3. npm run lint               (Biome linter)
  ├── 4. npm run build              (validate palette + run emitters + bundle components)
  └── 5. npm test                   (Playwright test suite)
```

Build must pass before tests run. Tests depend on generated files (`src/tokens.css`, `ports/*`).

### 5.2 GitHub Actions Workflow

```yaml
# .github/workflows/test.yml
name: Test
on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - uses: actions/setup-node@v4
        with:
          node-version: 22

      - run: npm ci

      - run: npx playwright install --with-deps chromium

      - run: npm run lint

      - run: npm run build

      - run: npm test

      - uses: actions/upload-artifact@v4
        if: failure()
        with:
          name: playwright-report
          path: playwright-report/
          retention-days: 14

      - uses: actions/upload-artifact@v4
        if: failure()
        with:
          name: test-results
          path: test-results/
          retention-days: 14
```

### 5.3 Key CI Decisions

| Decision | Rationale |
|---|---|
| **Single job, sequential steps** | Build outputs feed into tests. No parallelism needed for a single-browser, single-worker setup. |
| **Upload artifacts on failure only** | HTML report and test results are only useful for debugging failures. Saves storage. |
| **14-day retention** | Enough time to investigate failures. Not long enough to bloat storage. |
| **No caching** | `npm ci` is fast enough for this project size. Caching adds complexity. |
| **Ubuntu runner** | Cheapest, fastest. Chromium screenshot baselines are generated on Ubuntu to match CI. |

---

## 6. Visual Regression Baseline Management

### 6.1 Creating Baselines

Initial baseline creation (run locally on first setup):

```bash
# Generate baselines on Ubuntu (via Docker) to match CI
npx playwright test --update-snapshots
```

Baselines are committed to git in `tests/__snapshots__/`. They are authoritative.

### 6.2 Updating Baselines

When a visual change is intentional (new color, new component, layout change):

```bash
# Update only the failing snapshots
npx playwright test --update-snapshots

# Review the diff
git diff tests/__snapshots__/

# Commit the updated baselines
git add tests/__snapshots__/
git commit -m "chore: update visual regression baselines for <reason>"
```

### 6.3 Reviewing Failures

When a test fails in CI:

1. Download the `playwright-report` artifact from the GitHub Actions run
2. Open `index.html` in the report -- it shows side-by-side expected/actual/diff images
3. Determine if the change is intentional or a regression:
   - **Intentional**: Update baselines locally and commit
   - **Regression**: Fix the code and re-run tests

### 6.4 Cross-Platform Baseline Consistency

Baselines must be generated on the same OS as CI (Ubuntu/Linux). Font rendering differs between macOS and Linux. To generate Linux-consistent baselines locally:

```bash
# Option 1: Use Docker
docker run --rm -v $(pwd):/work -w /work mcr.microsoft.com/playwright:v1.50.0-noble \
  npx playwright test --update-snapshots

# Option 2: Accept CI as the baseline source
# Run tests in CI, download the actual screenshots from the test-results artifact,
# and copy them into __snapshots__/
```

---

## 7. Test Helpers and Utilities

### 7.1 Token Resolution Helper

```typescript
async function getResolvedTokenValue(page: Page, property: string, selector = ':root'): Promise<string> {
  return page.evaluate(
    ([prop, sel]) => {
      const el = document.querySelector(sel) ?? document.documentElement;
      return getComputedStyle(el).getPropertyValue(prop).trim();
    },
    [property, selector]
  );
}
```

### 7.2 OKLCH to sRGB Conversion (for contrast checks)

```typescript
import { parse, converter, wcagContrast } from 'culori';

function contrastRatio(color1: string, color2: string): number {
  const toSrgb = converter('rgb');
  const c1 = toSrgb(parse(color1));
  const c2 = toSrgb(parse(color2));
  if (!c1 || !c2) throw new Error(`Failed to parse colors: ${color1}, ${color2}`);
  return wcagContrast(c1, c2);
}
```

### 7.3 Computed Style Assertion Helper

```typescript
async function expectComputedStyle(
  page: Page,
  selector: string,
  property: string,
  expected: string
): Promise<void> {
  const actual = await page.evaluate(
    ([sel, prop]) => getComputedStyle(document.querySelector(sel)!).getPropertyValue(prop),
    [selector, property]
  );
  expect(actual.trim()).toBe(expected);
}
```

---

## 8. Test Naming Conventions

Tests follow a consistent naming pattern:

```typescript
test.describe('ComponentName', () => {
  test('renders base state with correct <property>', async ({ page }) => {});
  test('hover state applies <expected change>', async ({ page }) => {});
  test('active state collapses shadow', async ({ page }) => {});
  test('disabled state has opacity 0.4', async ({ page }) => {});
  test('dark mode inverts shadow color', async ({ page }) => {});
  test('visual regression - <variant>', async ({ page }) => {});
  test('reduced motion - transitions resolve in 0.01ms', async ({ page }) => {});
});
```

---

## 9. Test Dependencies

### 9.1 npm Packages

```json
{
  "devDependencies": {
    "@playwright/test": "^1.50.0",
    "ajv": "^8.17.0",
    "ajv-formats": "^3.0.0",
    "culori": "^4.0.0",
    "serve": "^14.0.0"
  }
}
```

| Package | Purpose |
|---|---|
| `@playwright/test` | Test runner, browser automation, screenshot comparison |
| `ajv` + `ajv-formats` | JSON Schema validation for `palette.spec.ts` |
| `culori` | OKLCH parsing and WCAG contrast calculation |
| `serve` | Static file server for `docs/` directory during tests |

### 9.2 npm Scripts

```json
{
  "scripts": {
    "test": "npx playwright test",
    "test:ui": "npx playwright test --ui",
    "test:update-snapshots": "npx playwright test --update-snapshots",
    "test:report": "npx playwright show-report"
  }
}
```
