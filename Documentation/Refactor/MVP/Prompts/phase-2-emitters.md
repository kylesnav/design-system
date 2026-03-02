---
title: "Phase 2: Emitter Pipeline"
type: prompt
scope: mvp
status: active
---

# Phase 2: Emitter Pipeline

> Build all 7 emitters and the orchestrator. One command (`npm run build`) generates all platform outputs from palette JSON.

---

## Context

Read these specs before starting:
- `Specs/emitters/orchestrator.md` -- build pipeline coordinator
- `Specs/emitters/css-emitter.md` -- palette to tokens.css
- `Specs/emitters/vscode-emitter.md` -- ~324 VS Code color mappings
- `Specs/emitters/obsidian-emitter.md` -- OKLCH with --d-* namespace
- `Specs/emitters/terminal-emitters.md` -- Ghostty (.conf) and iTerm2 (.itermcolors)
- `Specs/emitters/starship-emitter.md` -- hex TOML for shell prompt
- `Specs/emitters/tailwind-emitter.md` -- var() references preset
- `Architecture/mvp-architecture.md` -- Section 5 (Emitter Contract)

---

## Emitter Contract

Every emitter implements this interface:

```js
/**
 * @param {object} palette - Parsed, validated palette JSON
 * @param {object} [options] - Emitter-specific options
 * @returns {{ files: Array<{ path: string, content: string }>, warnings: string[] }}
 */
export function emit(palette, options = {}) { ... }
```

**Rules**:
- Pure functions -- no file reads, writes, or network calls
- Return file content as strings; orchestrator handles all I/O
- Warnings array for non-fatal issues (empty if none)
- Throw on fatal conditions (missing required data)

---

## Deliverables

### 2.1 -- CSS Emitter (`emitters/css.mjs`)

Generates `src/tokens.css` containing:
- `@layer primitives { :root { ... } }` -- all 44 primitive OKLCH tokens
- `@layer semantic { :root, [data-theme="light"] { ... } }` -- light semantic tokens
- `@layer semantic { [data-theme="dark"] { ... } }` -- dark semantic tokens
- Shadow tokens use CSS composite values with `var(--border-default)` for color
- File header comment with palette name and version

**Output path**: `src/tokens.css`

### 2.2 -- VS Code Emitter (`emitters/vscode.mjs`)

Generates 2 VS Code theme JSON files with ~324 color property mappings:
- Converts OKLCH to hex via culuri with `clampChroma()` for sRGB gamut
- Maps semantic tokens to VS Code's editor, UI, syntax, terminal, debug color keys
- Terminal ANSI colors come from `palette.terminal` (hex-authoritative, no conversion)

**Output paths**: `ports/vscode/themes/delightful-light-color-theme.json`, `ports/vscode/themes/delightful-dark-color-theme.json`

### 2.3 -- Obsidian Emitter (`emitters/obsidian.mjs`)

Generates Obsidian theme CSS:
- Renames `--primitive-*` to `--d-*` (Obsidian namespace convention)
- OKLCH values used directly (no hex conversion)
- Includes Style Settings plugin configuration block
- Maps to Obsidian-specific selectors (`.workspace`, `.nav-file-title`, etc.)

**Output path**: `ports/obsidian/theme.css`

### 2.4 -- Ghostty Emitter (`emitters/ghostty.mjs`)

Generates 2 Ghostty terminal config files:
- Reads `palette.terminal.light` and `palette.terminal.dark` hex values
- Plain-text config with `palette = index=hex` format
- 16 ANSI colors + foreground, background, cursor

**Output paths**: `ports/ghostty/delightful-light.conf`, `ports/ghostty/delightful-dark.conf`

### 2.5 -- iTerm2 Emitter (`emitters/iterm2.mjs`)

Generates 2 iTerm2 color profile files:
- Reads `palette.terminal` hex values
- Converts hex to RGB floats (0.0-1.0 range)
- Apple plist XML format
- Must produce identical ANSI palette as Ghostty (verified by tests)

**Output paths**: `ports/iterm2/Delightful Light.itermcolors`, `ports/iterm2/Delightful Dark.itermcolors`

### 2.6 -- Starship Emitter (`emitters/starship.mjs`)

Generates Starship shell prompt config:
- Reads `palette.terminal` hex values
- TOML format with color-coded prompt segments
- Maps ANSI colors to prompt segments (character, username, directory, git, languages)
- Light theme as default, dark theme values in comments

**Output path**: `ports/starship/starship.toml`

### 2.7 -- Tailwind Emitter (`emitters/tailwind.mjs`)

Generates Tailwind CSS preset:
- Reads `palette.semantic.light` keys (not values)
- Generates `var()` references to CSS custom properties
- Groups tokens by prefix (bg-, text-, border-, accent-, status-, focus-, overlay-)
- Shadow tokens map to `boxShadow` config
- Foundation tokens (spacing, radius, font) included
- 1:1 coverage check: every semantic token has a Tailwind utility

**Output path**: `packages/tailwind/dist/preset.js`

### 2.8 -- Orchestrator (`emitters/orchestrator.mjs`)

Build pipeline coordinator:
1. Load and validate palette (fail-fast on schema/contrast errors)
2. Run all emitters in sequence
3. Write all output files
4. Report: files written, tokens emitted, warnings

Wired to `npm run build`.

### 2.9 -- Tests

**`tests/tokens.spec.ts`**:
- Generated `tokens.css` contains all expected custom properties
- Primitive tokens are OKLCH format
- Semantic tokens exist for both light and dark themes
- Shadow tokens use `var(--border-default)`, not `var(--text-primary)`

**`tests/ports.spec.ts`**:
- Ghostty and iTerm2 ANSI palettes are identical
- VS Code theme has all required color property keys
- Obsidian uses `--d-*` namespace (no `--primitive-*`)
- Starship TOML contains expected prompt segments
- Tailwind preset has 1:1 semantic token coverage

---

## Acceptance Criteria

- [ ] `npm run build` generates all platform outputs from palette JSON
- [ ] Changing a color in the JSON and rebuilding updates every port
- [ ] All 7 emitters implement the pure function contract
- [ ] Zero manual hex translation -- all conversions are automated
- [ ] Ghostty and iTerm2 produce identical ANSI palettes
- [ ] Tailwind preset has 1:1 coverage with semantic tokens
- [ ] All tests pass
