---
title: "Build Pipeline Specification"
date: 2026-03-02
type: spec
scope: mvp
status: active
---

# Build Pipeline Specification

> End-to-end specification for `npm run build` — every step, every file dependency, every expected output.

Cross-references: [[emitters/orchestrator]], [[emitters/css-emitter]], [[tokens/palette-schema]], [[directory-structure]]

---

## 1. Overview

The build pipeline is a single command that transforms source files into all platform outputs. It is deterministic: the same input always produces the same output. No manual steps, no manual hex translation.

```
npm run build
```

Defined in `package.json`:
```json
{
  "scripts": {
    "build": "node emitters/orchestrator.mjs"
  }
}
```

---

## 2. Build Steps — Ordered

### Step 1: Validate Palette JSON

**Script**: `emitters/validate.mjs` (called by orchestrator)
**Input**: `palettes/delightful.json`, `palettes/palette.schema.json`
**Output**: pass/fail

Operations:
1. Load `palettes/delightful.json`
2. Validate against `palettes/palette.schema.json` via `ajv` (JSON Schema draft 2020-12)
3. Verify every OKLCH string is well-formed (regex: `^oklch\(\d+\.\d+\s+\d+\.\d+\s+\d+(\.\d+)?\)$`)
4. Run WCAG contrast checks on semantic pairs (see §2.1)
5. Verify terminal distinctness: adjacent ANSI colors are visually distinguishable

**Failure mode**: Throws error with specific validation message. Aborts pipeline. No files written.

#### 2.1 WCAG Contrast Pairs Checked

Both light AND dark mode for each pair:

| Pair | Threshold |
|------|-----------|
| `text-primary` on `bg-page` | ≥ 4.5:1 |
| `text-primary` on `bg-surface` | ≥ 4.5:1 |
| `text-secondary` on `bg-page` | ≥ 4.5:1 |
| `text-on-accent` on `accent-primary` | ≥ 4.5:1 |
| `text-on-accent` on `accent-danger` | ≥ 4.5:1 |
| `text-on-accent` on `accent-success` | ≥ 4.5:1 |
| `text-on-gold` on `accent-gold` | ≥ 4.5:1 |
| `text-on-accent` on `accent-cyan` | ≥ 4.5:1 |
| `text-on-accent` on `accent-purple` | ≥ 4.5:1 |
| `border-default` on `bg-page` | ≥ 3:1 (non-text) |

---

### Step 2: Emit `tokens.css`

**Emitter**: `emitters/css.mjs`
**Input**: `palettes/delightful.json`
**Output**: `src/tokens.css`

Writes:
- `@layer primitives` block: all 44 `--primitive-*` custom properties on `:root`
- `@layer semantic` block:
  - `:root, [data-theme="light"]` selector: all light semantic tokens
  - `[data-theme="dark"]` selector: all dark semantic overrides
- Shadow tokens are authored structure with color values from palette (e.g., `--shadow-md: 4px 4px 0 var(--border-default)`)

This is the ONLY file generated from OKLCH palette values for CSS consumption. All component CSS files reference `var()` from this output.

---

### Step 3: Emit VS Code Theme

**Emitter**: `emitters/vscode.mjs`
**Input**: `palettes/delightful.json`
**Output**:
- `ports/vscode/themes/delightful-light-color-theme.json`
- `ports/vscode/themes/delightful-dark-color-theme.json`

Converts OKLCH → sRGB hex via `culori` with `clampChroma()` for gamut mapping (editor/UI colors). Terminal ANSI colors use the hand-tuned hex values from `palette.terminal` directly — no conversion.

---

### Step 4: Emit Obsidian Theme

**Emitter**: `emitters/obsidian.mjs`
**Input**: `palettes/delightful.json`
**Output**: `ports/obsidian/theme.css`

Renames `--primitive-*` → `--d-*`. Uses OKLCH directly (no hex conversion). Includes Style Settings plugin config block.

---

### Step 5: Emit Ghostty Config

**Emitter**: `emitters/ghostty.mjs`
**Input**: `palettes/delightful.json` → `terminal.light` and `terminal.dark` hex values
**Output**:
- `ports/ghostty/delightful-light.conf`
- `ports/ghostty/delightful-dark.conf`

Plain-text `key = value` format. Uses hand-tuned terminal hex values.

---

### Step 6: Emit iTerm2 Config

**Emitter**: `emitters/iterm2.mjs`
**Input**: `palettes/delightful.json` → `terminal.light` and `terminal.dark` hex values
**Output**:
- `ports/iterm2/Delightful Light.itermcolors`
- `ports/iterm2/Delightful Dark.itermcolors`

Apple plist XML format. Converts hex → RGB float (each channel / 255.0). Uses same hand-tuned terminal hex values as Ghostty — ANSI palettes must be identical.

---

### Step 7: Emit Starship Config

**Emitter**: `emitters/starship.mjs`
**Input**: `palettes/delightful.json` → `terminal.light` and `terminal.dark` hex values
**Output**: `ports/starship/starship.toml`

TOML format with hex color values for prompt segments.

---

### Step 8: Emit Tailwind Preset

**Emitter**: `emitters/tailwind.mjs`
**Input**: `palettes/delightful.json`
**Output**: `packages/tailwind/dist/preset.js`

Generates `var()` references to token custom properties. 1:1 token coverage: every semantic token has a corresponding Tailwind utility class.

---

### Step 9: Bundle Components

Not handled by orchestrator — separate script:

```
npm run build:components
```

Concatenates all `src/components/*.css` into:
- `dist/components.css` (full bundle)
- `dist/components/*.css` (individual files, tree-shakeable)

Order of concatenation follows build batch order (A → B → C → D → E → F → G → H → I).

---

### Step 10: Build Output Report

After all emitters run, orchestrator prints:

```
✓ Palette validated (44 primitives, 52 semantic tokens)
✓ WCAG contrast: 10 pairs checked, all passing
✓ tokens.css written (176 custom properties)
✓ VS Code themes written (light + dark)
✓ Obsidian theme written
✓ Ghostty config written (light + dark)
✓ iTerm2 colors written (light + dark)
✓ Starship config written
✓ Tailwind preset written
✓ Build complete. 11 files written, 0 warnings.
```

---

## 3. File Dependency Graph

```
palettes/delightful.json          ← EDIT HERE for color changes
        │
        ├──→ emitters/css.mjs
        │         └──→ src/tokens.css           ← DO NOT EDIT (generated)
        │                   │
        │                   └──→ src/foundation.css    (imports tokens)
        │                         └──→ src/components/*.css (import foundation)
        │
        ├──→ emitters/vscode.mjs
        │         └──→ ports/vscode/themes/*.json
        │
        ├──→ emitters/obsidian.mjs
        │         └──→ ports/obsidian/theme.css
        │
        ├──→ emitters/ghostty.mjs
        │         └──→ ports/ghostty/*.conf
        │
        ├──→ emitters/iterm2.mjs
        │         └──→ ports/iterm2/*.itermcolors
        │
        ├──→ emitters/starship.mjs
        │         └──→ ports/starship/starship.toml
        │
        └──→ emitters/tailwind.mjs
                  └──→ packages/tailwind/dist/preset.js

src/components/*.css              ← AUTHORED source
        └──→ dist/components.css  ← bundled output
        └──→ dist/components/*.css ← individual outputs
```

**Authored files** (never generated, never overwritten by build):
- `palettes/delightful.json`
- `palettes/palette.schema.json`
- `src/foundation.css`
- `src/reset.css`
- `src/utilities.css`
- `src/motion/motion.css`
- `src/components/*.css`
- All emitter scripts

**Generated files** (overwritten on every build):
- `src/tokens.css`
- `ports/vscode/themes/*.json`
- `ports/obsidian/theme.css`
- `ports/ghostty/*.conf`
- `ports/iterm2/*.itermcolors`
- `ports/starship/starship.toml`
- `packages/tailwind/dist/preset.js`
- `dist/components.css`
- `dist/components/*.css`

---

## 4. Emitter Contract

All emitters implement the same interface:

```typescript
interface EmitterOutput {
  files: Array<{ path: string; content: string }>;
  warnings: string[];
}

type Emitter = (palette: PaletteJSON, options?: EmitterOptions) => EmitterOutput;
```

- Emitters are **pure functions** — no file I/O, no side effects
- The orchestrator handles all file writes
- `path` in output is relative to repo root
- `warnings` are non-fatal issues (collected and printed, build continues)
- Thrown errors abort the pipeline with the emitter name in the error message

---

## 5. Verifying a Successful Build

After `npm run build`, verify:

```bash
# Token file exists and has correct property count
grep -c "^  --" src/tokens.css  # should be ≥ 176

# VS Code themes exist
ls ports/vscode/themes/          # two JSON files

# Terminal configs exist
ls ports/ghostty/                # two .conf files
ls ports/iterm2/                 # two .itermcolors files

# Run tests to validate correctness
npm test
```

---

## 6. Adding a New Color to the Palette

1. Edit `palettes/delightful.json` — add/modify the primitive or semantic token
2. Run `npm run build` — all ports regenerate automatically
3. Run `npm test` — validate contrast, schema, and port consistency
4. If a new semantic token: also update `src/foundation.css` if it needs a component alias
5. Commit both `palettes/delightful.json` and any generated file changes

**Never** edit `src/tokens.css` directly — it will be overwritten on next build.
