# Orchestrator Specification

> Defines the build pipeline coordinator that validates the palette, runs all emitters in sequence, handles file I/O, and reports results. This is the entry point for `npm run build`.

Cross-references: [[css-emitter]], [[vscode-emitter]], [[obsidian-emitter]], [[terminal-emitters]] (individual emitters), [[palette-schema]] (validation rules), [[token-tiers]] (tier architecture).

---

## 1. File & Module

```
emitters/orchestrator.mjs
```

This is the only module in the emitter pipeline that performs file I/O. All individual emitters are pure functions — the orchestrator calls them and writes their outputs.

---

## 2. Entry Point: `npm run build`

### 2.1 package.json Script

```json
{
  "scripts": {
    "build": "node emitters/orchestrator.mjs",
    "build:tokens": "node emitters/orchestrator.mjs --only=css",
    "build:ports": "node emitters/orchestrator.mjs --skip=css"
  }
}
```

### 2.2 CLI Options

| Flag | Purpose |
|---|---|
| `--only={emitter}` | Run only the specified emitter (for faster iteration) |
| `--skip={emitter}` | Skip the specified emitter |
| `--dry-run` | Validate and run emitters but do not write files |
| `--verbose` | Print detailed per-emitter timing and token counts |

---

## 3. The Shared Emitter Contract

Every emitter implements the same interface:

```js
/**
 * @param {object} palette - Parsed, validated palette JSON
 * @param {object} [options] - Emitter-specific options
 * @returns {{ files: Array<{ path: string, content: string }>, warnings: string[] }}
 */
export function emit(palette, options = {}) {
  return {
    files: [
      { path: 'relative/path/to/output', content: 'file contents as string' }
    ],
    warnings: ['optional warning messages']
  };
}
```

### Contract Rules

- **Pure function**: Emitters must not read files, write files, or perform network calls.
- **`files` array**: Each entry has a `path` (relative to repo root) and `content` (full file content as a string).
- **`warnings` array**: Human-readable strings describing non-fatal issues. Empty array if no warnings.
- **Errors**: Emitters throw on fatal conditions. The orchestrator catches and reports with the emitter name.

---

## 4. Execution Order

The orchestrator runs steps sequentially. Each step depends on the previous step succeeding.

```
npm run build
  │
  ├── Step 1: Load and validate palette JSON
  │     ├── Read palettes/delightful.json
  │     ├── Validate against palettes/palette.schema.json (ajv)
  │     └── FAIL FAST if validation fails
  │
  ├── Step 2: Run WCAG contrast checks
  │     ├── Convert OKLCH pairs to sRGB for luminance calculation
  │     ├── Check all required contrast pairs
  │     └── FAIL FAST if any pair fails minimum threshold
  │
  ├── Step 3: CSS emitter → src/tokens.css
  │     └── emit(palette) → write files
  │
  ├── Step 4: VS Code emitter → ports/vscode/themes/*.json
  │     └── emit(palette) → write files
  │
  ├── Step 5: Obsidian emitter → ports/obsidian/theme.css
  │     └── emit(palette) → write files
  │
  ├── Step 6: Ghostty emitter → ports/ghostty/*.conf
  │     └── emit(palette) → write files
  │
  ├── Step 7: iTerm2 emitter → ports/iterm2/*.itermcolors
  │     └── emit(palette) → write files
  │
  ├── Step 8: Starship emitter → ports/starship/starship.toml
  │     └── emit(palette) → write files
  │
  ├── Step 9: Tailwind emitter → packages/tailwind/dist/preset.js
  │     └── emit(palette) → write files
  │
  └── Step 10: Report
        ├── Files written: count and paths
        ├── Tokens emitted: count per tier
        ├── Warnings: aggregated from all emitters
        └── Timing: total build duration
```

---

## 5. Step 1: Load and Validate Palette JSON

### 5.1 Loading

```js
import { readFile } from 'node:fs/promises';
import Ajv from 'ajv';

const paletteJson = JSON.parse(
  await readFile('palettes/delightful.json', 'utf-8')
);
const schema = JSON.parse(
  await readFile('palettes/palette.schema.json', 'utf-8')
);
```

### 5.2 Schema Validation (ajv)

```js
const ajv = new Ajv({ allErrors: true });
const validate = ajv.compile(schema);
const valid = validate(paletteJson);

if (!valid) {
  console.error('Palette schema validation failed:');
  for (const error of validate.errors) {
    console.error(`  ${error.instancePath} ${error.message}`);
  }
  process.exit(1);
}
```

Schema validation checks:
- Required top-level fields (`$schemaVersion`, `name`, `version`, `author`, `primitives`, `semantic`, `terminal`)
- Required primitive families (neutral, pink, red, gold, cyan, green, purple)
- OKLCH string format regex: `^oklch\(\d+\.?\d*\s+\d+\.?\d*\s+\d+\.?\d*(\s*/\s*\d+\.?\d*)?\)$`
- Terminal hex format regex: `^#[0-9a-fA-F]{6}$`
- Terminal ANSI array length: exactly 16 elements
- `semantic.light` and `semantic.dark` must both exist
- `version` must be valid semver

**Failure mode**: Prints all validation errors and exits with code 1. The build does not continue.

---

## 6. Step 2: WCAG Contrast Checks

### 6.1 Contrast Pairs Checked

The orchestrator checks these specific semantic token pairs against WCAG 2.1 contrast ratio thresholds. Both light and dark mode pairs are checked.

**Text contrast (4.5:1 minimum — WCAG AA for normal text):**

| Foreground Token | Background Token | Threshold |
|---|---|---|
| `text-primary` | `bg-page` | 4.5:1 |
| `text-primary` | `bg-surface` | 4.5:1 |
| `text-secondary` | `bg-page` | 4.5:1 |
| `text-on-accent` | `accent-primary` | 4.5:1 |
| `text-on-accent` | `accent-danger` | 4.5:1 |
| `text-on-accent` | `accent-success` (resolves to `accent-green`) | 4.5:1 |
| `text-on-gold` | `accent-gold` | 4.5:1 |
| `text-on-accent` | `accent-cyan` | 4.5:1 |
| `text-on-accent` | `accent-purple` | 4.5:1 |

**Non-text contrast (3:1 minimum — WCAG AA for UI components):**

| Element Token | Background Token | Threshold |
|---|---|---|
| `border-default` | `bg-page` | 3:1 |

### 6.2 Contrast Calculation

OKLCH values must be converted to sRGB for WCAG relative luminance calculation:

```js
import { oklch, rgb } from 'culori';

function getRelativeLuminance(oklchString) {
  const color = oklch(oklchString);
  const srgb = rgb(color);
  // WCAG relative luminance formula
  const linearize = (c) => c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
  const R = linearize(srgb.r);
  const G = linearize(srgb.g);
  const B = linearize(srgb.b);
  return 0.2126 * R + 0.7152 * G + 0.0722 * B;
}

function contrastRatio(lum1, lum2) {
  const lighter = Math.max(lum1, lum2);
  const darker = Math.min(lum1, lum2);
  return (lighter + 0.05) / (darker + 0.05);
}
```

### 6.3 Failure Mode

If any contrast pair fails, the orchestrator prints the failing pairs with their actual ratios and the required threshold, then exits with code 1:

```
WCAG contrast check failed:
  light: text-primary on bg-page — 3.8:1 (requires 4.5:1)
  dark: text-on-accent on accent-primary — 2.9:1 (requires 4.5:1)
```

---

## 7. Steps 3-9: Running Emitters

### 7.1 Emitter Registry

```js
const emitters = [
  { name: 'css',      module: './css.mjs',      label: 'CSS Tokens' },
  { name: 'vscode',   module: './vscode.mjs',   label: 'VS Code Themes' },
  { name: 'obsidian', module: './obsidian.mjs',  label: 'Obsidian Theme' },
  { name: 'ghostty',  module: './ghostty.mjs',   label: 'Ghostty Config' },
  { name: 'iterm2',   module: './iterm2.mjs',    label: 'iTerm2 Profiles' },
  { name: 'starship', module: './starship.mjs',  label: 'Starship Config' },
  { name: 'tailwind', module: './tailwind.mjs',  label: 'Tailwind Preset' },
];
```

### 7.2 Execution Loop

```js
const allFiles = [];
const allWarnings = [];

for (const emitter of emitters) {
  if (options.only && options.only !== emitter.name) continue;
  if (options.skip && options.skip === emitter.name) continue;

  try {
    const { emit } = await import(emitter.module);
    const result = emit(palette, {});

    allFiles.push(...result.files);
    allWarnings.push(
      ...result.warnings.map(w => `[${emitter.label}] ${w}`)
    );
  } catch (error) {
    console.error(`\nEmitter "${emitter.label}" failed:`);
    console.error(`  ${error.message}`);
    process.exit(1);
  }
}
```

### 7.3 File Write Logic

The orchestrator maps relative `path` values from emitter output to absolute filesystem paths rooted at the repository root:

```js
import { writeFile, mkdir } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';

const repoRoot = resolve(import.meta.dirname, '..');

for (const file of allFiles) {
  const absolutePath = resolve(repoRoot, file.path);
  await mkdir(dirname(absolutePath), { recursive: true });
  await writeFile(absolutePath, file.content, 'utf-8');
}
```

Key behaviors:
- Creates parent directories recursively if they don't exist (`mkdir -p` equivalent)
- Overwrites existing files (generated output is always the source of truth)
- Uses UTF-8 encoding for all files
- In `--dry-run` mode, skips the write step but still runs all emitters

---

## 8. Step 10: Output Report

### 8.1 Console Output Format (successful build)

```
Delightful build complete

  Palette: delightful v1.0.0
  Tokens:  44 primitives, 52 semantic (light + dark)

  Files written:
    src/tokens.css
    ports/vscode/themes/delightful-light-color-theme.json
    ports/vscode/themes/delightful-dark-color-theme.json
    ports/obsidian/theme.css
    ports/ghostty/delightful-light.conf
    ports/ghostty/delightful-dark.conf
    ports/iterm2/Delightful Light.itermcolors
    ports/iterm2/Delightful Dark.itermcolors
    ports/starship/starship.toml
    packages/tailwind/dist/preset.js

  Total: 10 files in 0.34s

  Warnings: none
```

### 8.2 Console Output Format (with warnings)

```
Delightful build complete

  ...

  Warnings:
    [VS Code Themes] accent-primary required gamut clamping
    [Obsidian Theme] unknown semantic token 'bg-experimental'

  Total: 10 files in 0.38s (2 warnings)
```

### 8.3 Report Data

| Field | Value |
|---|---|
| Palette name | From `palette.name` |
| Palette version | From `palette.version` |
| Primitive token count | Count of keys across all families in `palette.primitives` |
| Semantic token count | Count of keys in `palette.semantic.light` |
| Files written | List of all `path` values from emitter outputs |
| File count | Total files |
| Build time | Wall-clock milliseconds from start to finish |
| Warning count | Total warnings across all emitters |
| Warning messages | Prefixed with emitter label |

---

## 9. Error Handling Summary

### Fail-Fast Errors (abort pipeline immediately)

| Stage | Condition | Exit Code |
|---|---|---|
| Load | `palettes/delightful.json` not found | 1 |
| Load | JSON parse failure | 1 |
| Validate | Schema validation fails (any error) | 1 |
| Contrast | Any WCAG contrast pair below threshold | 1 |
| Emitter | Emitter throws an error | 1 |
| Write | File system write fails | 1 |

### Collected Warnings (do not abort)

Warnings from individual emitters are collected and reported at the end. They indicate potential issues that do not prevent the build from completing:

- Gamut clamping occurred during OKLCH-to-hex conversion
- Unknown or extra semantic token keys
- Light/dark key count mismatch
- Primitive family with unexpected stop count

### Exit Codes

| Code | Meaning |
|---|---|
| 0 | Build succeeded (with or without warnings) |
| 1 | Build failed (validation, contrast, emitter error, or write error) |

---

## 10. Dependency Graph

```
palettes/delightful.json
palettes/palette.schema.json
        │
        ▼
  orchestrator.mjs
        │
        ├── validate (ajv)
        ├── contrast check (culori)
        │
        ├── css.mjs        → src/tokens.css
        ├── vscode.mjs      → ports/vscode/themes/*.json
        ├── obsidian.mjs     → ports/obsidian/theme.css
        ├── ghostty.mjs      → ports/ghostty/*.conf
        ├── iterm2.mjs       → ports/iterm2/*.itermcolors
        ├── starship.mjs     → ports/starship/starship.toml
        └── tailwind.mjs     → packages/tailwind/dist/preset.js
```

All emitters receive the same parsed palette object. No emitter depends on another emitter's output. The orchestrator is the only module that performs I/O.

---

## 11. npm Dependencies

| Package | Purpose | Used By |
|---|---|---|
| `ajv` | JSON Schema validation (draft 2020-12) | Orchestrator (palette validation) |
| `culori` | OKLCH parsing, sRGB conversion, `clampChroma()`, `formatHex()` | VS Code emitter, contrast checks |

These are the only runtime dependencies required by the build pipeline. All other emitters use only Node.js built-in APIs (string manipulation, JSON serialization).
