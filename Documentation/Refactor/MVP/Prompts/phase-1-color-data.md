---
title: "Phase 1: Color Data"
type: prompt
scope: mvp
status: active
---

# Phase 1: Color Data

> Create the palette JSON (single source of truth for all color), the JSON Schema for validation, the validation script (schema + WCAG contrast), and shared utility modules.

---

## Context

Read these specs before starting:
- `Specs/tokens/palette-schema.md` -- complete JSON structure with all fields
- `Specs/tokens/token-tiers.md` -- all 176 CSS custom properties across 3 tiers
- `Specs/tokens/dark-mode.md` -- light/dark semantic mappings, shadow inversion
- `Architecture/mvp-architecture.md` -- Section 2 (3-Tier Token Architecture), Section 4 (Color Authority Model)

---

## Deliverables

### 1.1 -- Palette JSON (`palettes/delightful.json`)

Create the complete palette file containing every color value from the existing system:

**Structure**:
- `$schema`, `$schemaVersion`, `name`, `version`, `author` metadata
- `primitives` -- 7 color families (neutral, pink, red, gold, cyan, green, purple), 44 tokens total. All values in OKLCH format.
- `semantic.light` and `semantic.dark` -- ~52 semantic token mappings per theme. All values in OKLCH format.
- `terminal.light` and `terminal.dark` -- hand-tuned hex values for terminal platforms (foreground, background, cursor, ansi[16])

**Color authority rules**:
- OKLCH is authoritative for `primitives` and `semantic` sections
- Hex is authoritative for `terminal` section (hand-tuned, not derived)
- Extract all values from the existing `design-reference.html` (the ground truth)

**Key token counts**:
- Neutral family: 14 stops (0 through 950)
- Accent families (pink, red, gold, cyan, green, purple): 5 stops each (100 through 500)
- Semantic light: ~52 tokens
- Semantic dark: ~52 tokens (same keys, different values)
- Terminal ANSI: 16 colors per theme

### 1.2 -- JSON Schema (`palettes/palette.schema.json`)

JSON Schema draft 2020-12 validating the palette structure:
- OKLCH format regex: `^oklch\(\d+\.\d+\s+\d+\.\d+\s+\d+(\.\d+)?\)$`
- Hex format regex: `^#[0-9a-fA-F]{6}$`
- Required primitive families: neutral, pink, red, gold, cyan, green, purple
- Minimum stops per accent family: 5
- Neutral family minimum: 14 stops
- Required semantic categories in both light and dark
- Terminal requires: foreground, background, cursor, ansi (16-element array)

### 1.3 -- Validation Script (`emitters/validate.mjs`)

Pure function module:

```js
export function validate(palette) {
  // Returns { valid: boolean, errors: string[], warnings: string[] }
}
```

**Validation checks**:
1. Schema validation via ajv
2. OKLCH parse-ability (every OKLCH string is well-formed)
3. WCAG contrast checks for 10 semantic pairs (both themes):
   - `text-primary` on `bg-page` >= 4.5:1
   - `text-primary` on `bg-surface` >= 4.5:1
   - `text-secondary` on `bg-page` >= 4.5:1
   - `text-on-accent` on `accent-primary` >= 4.5:1
   - `text-on-accent` on `accent-danger` >= 4.5:1
   - `text-on-accent` on `accent-green` >= 4.5:1
   - `text-on-gold` on `accent-gold` >= 4.5:1
   - `text-on-accent` on `accent-cyan` >= 4.5:1
   - `text-on-accent` on `accent-purple` >= 4.5:1
   - `border-default` on `bg-page` >= 3:1 (non-text contrast)

### 1.4 -- Shared Utilities

**`emitters/palette-loader.mjs`**:
- Reads `palettes/delightful.json`
- Validates against schema
- Returns parsed palette object or throws

**`emitters/oklch-utils.mjs`**:
- OKLCH string parsing
- OKLCH to hex conversion (wraps culori with `clampChroma()` for sRGB gamut)
- Hex to RGB float conversion (for iTerm2 emitter)

### 1.5 -- Tests (`tests/palette.spec.ts`)

- Schema validation passes on the palette file
- All OKLCH strings parse correctly
- All 10 WCAG contrast thresholds met (both themes)
- Terminal ANSI arrays have exactly 16 entries
- Terminal hex values are valid hex format

---

## Acceptance Criteria

- [ ] `palettes/delightful.json` contains every color value (44 primitives, ~52 semantic per theme, 16 ANSI per theme)
- [ ] `npm run build` runs validation successfully
- [ ] `npm test` passes all palette tests
- [ ] WCAG contrast ratios meet thresholds for all 10 pairs in both themes
- [ ] OKLCH format is used for primitives and semantic (no hex)
- [ ] Hex format is used for terminal values (hand-tuned, not converted)
