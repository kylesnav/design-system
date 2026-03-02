---
title: "Build Validation Checklist"
type: qa
scope: mvp
status: active
---

# Build Validation Checklist

> Validates the emitter pipeline, generated outputs, and build integrity.

---

## Pre-Build Validation

### Palette JSON
- [ ] `palettes/delightful.json` passes JSON Schema validation
- [ ] All OKLCH strings are well-formed and parseable
- [ ] All terminal hex strings are valid 6-digit hex
- [ ] 10 WCAG contrast pairs meet thresholds (both themes):
  - [ ] `text-primary` on `bg-page` >= 4.5:1
  - [ ] `text-primary` on `bg-surface` >= 4.5:1
  - [ ] `text-secondary` on `bg-page` >= 4.5:1
  - [ ] `text-on-accent` on `accent-primary` >= 4.5:1
  - [ ] `text-on-accent` on `accent-danger` >= 4.5:1
  - [ ] `text-on-accent` on `accent-green` >= 4.5:1
  - [ ] `text-on-gold` on `accent-gold` >= 4.5:1
  - [ ] `text-on-accent` on `accent-cyan` >= 4.5:1
  - [ ] `text-on-accent` on `accent-purple` >= 4.5:1
  - [ ] `border-default` on `bg-page` >= 3:1

### Schema
- [ ] `palettes/palette.schema.json` exists and is valid JSON Schema draft 2020-12
- [ ] Schema requires all 7 primitive families
- [ ] Schema requires both `semantic.light` and `semantic.dark`
- [ ] Schema requires `terminal.light` and `terminal.dark` with 16-entry ANSI arrays

---

## Build Execution

### Orchestrator
- [ ] `npm run build` completes without errors
- [ ] Validation runs before any emitter (fail-fast)
- [ ] All 7 emitters execute in sequence
- [ ] File write count and warning count reported
- [ ] Build is deterministic (same input = same output)

---

## Generated Output Validation

### CSS Emitter (`src/tokens.css`)
- [ ] Contains `@layer primitives { :root { ... } }` with all 44 primitives
- [ ] Contains `@layer semantic { :root, [data-theme="light"] { ... } }` with light tokens
- [ ] Contains `@layer semantic { [data-theme="dark"] { ... } }` with dark tokens
- [ ] All primitive values are OKLCH format (no hex)
- [ ] Shadow tokens use `var(--border-default)` for color (not `var(--text-primary)`)
- [ ] File header comment includes palette name and version
- [ ] File is valid CSS (loads in browser without errors)

### VS Code Emitter (`ports/vscode/themes/`)
- [ ] Light theme JSON exists and is valid JSON
- [ ] Dark theme JSON exists and is valid JSON
- [ ] Both contain all required VS Code `workbench.colorCustomizations` keys
- [ ] All color values are hex format (no OKLCH)
- [ ] Terminal ANSI colors match `palette.terminal` hex values

### Obsidian Emitter (`ports/obsidian/theme.css`)
- [ ] File exists and is valid CSS
- [ ] Uses `--d-*` namespace (no `--primitive-*` tokens)
- [ ] Contains Style Settings plugin configuration block
- [ ] Color values are OKLCH (no hex conversion)

### Ghostty Emitter (`ports/ghostty/`)
- [ ] Light config exists: `delightful-light.conf`
- [ ] Dark config exists: `delightful-dark.conf`
- [ ] Both contain 16 ANSI palette entries
- [ ] Both contain foreground, background, cursor entries
- [ ] Hex values match `palette.terminal` values

### iTerm2 Emitter (`ports/iterm2/`)
- [ ] Light profile exists: `Delightful Light.itermcolors`
- [ ] Dark profile exists: `Delightful Dark.itermcolors`
- [ ] Both are valid XML plist format
- [ ] RGB float values are 0.0-1.0 range
- [ ] ANSI palette is identical to Ghostty (same hex source)

### Starship Emitter (`ports/starship/starship.toml`)
- [ ] File exists and is valid TOML
- [ ] Contains prompt format string
- [ ] Contains color-coded segments (character, username, directory, git, languages)
- [ ] Hex values match `palette.terminal` ANSI entries

### Tailwind Emitter (`packages/tailwind/dist/preset.js`)
- [ ] File exists and is valid CommonJS module
- [ ] Contains `module.exports` with `theme.extend.colors`
- [ ] All values are `var()` references (no hex, no OKLCH)
- [ ] 1:1 coverage: every `palette.semantic.light` key has a Tailwind mapping
- [ ] Contains `boxShadow`, `fontFamily`, `borderRadius`, `spacing` extensions

---

## Cross-Port Consistency

- [ ] Ghostty and iTerm2 ANSI palettes produce identical colors
- [ ] VS Code terminal colors match Ghostty/iTerm2 ANSI palette
- [ ] All terminal emitters use the same hex source (`palette.terminal`)

---

## Rebuild Validation

- [ ] Change a color value in `palettes/delightful.json`
- [ ] Run `npm run build`
- [ ] Verify the change propagated to ALL generated files:
  - [ ] `src/tokens.css`
  - [ ] VS Code theme JSONs
  - [ ] Obsidian theme CSS
  - [ ] Ghostty configs
  - [ ] iTerm2 profiles
  - [ ] Starship TOML (if terminal color changed)
  - [ ] Tailwind preset (if semantic key changed)
- [ ] Revert the color change
