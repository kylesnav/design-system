# Delightful Design System — Token Governance

How to safely extend the token system, add new colors, and maintain the 3-tier architecture.

---

## The 3-Tier Rule

Every value in the system flows through three tiers. Never skip a tier.

```
Primitives → Semantic → Component
```

- **Primitives** are raw OKLCH values named by family and lightness stop (e.g., `--primitive-pink-400`). They carry no semantic meaning and are never used directly in UI code.
- **Semantic tokens** map intent to primitives (e.g., `--accent-primary` → `--primitive-pink-400` in light mode). They define both light and dark mode values.
- **Component tokens** are scoped to specific UI elements (e.g., `--btn-primary-bg`) and always reference semantic tokens via `var()`.

---

## Adding a New Primitive Color

1. Choose an OKLCH hue angle that doesn't conflict with existing families (70, 350, 20, 85, 210, 148, 300)
2. Create 5 stops (100-500) following the existing lightness/chroma pattern:
   - 100: L ~0.93, C ~0.04-0.06 (very light tint)
   - 200: L ~0.85, C ~0.08-0.14 (light)
   - 300: L ~0.72, C ~0.12-0.22 (medium)
   - 400: L ~0.64, C ~0.17-0.27 (strong — typically the base accent)
   - 500: L ~0.56, C ~0.16-0.28 (deep)
3. Add the new custom properties to `${CLAUDE_PLUGIN_ROOT}/themes/css/delightful-tokens.css` in the `@layer primitives` block
4. Create corresponding semantic and component tokens

## Adding a New Semantic Token

1. Define both light and dark values
2. Light mode goes in the `:root` / `[data-theme="light"]` block
3. Dark mode goes in the `[data-theme="dark"]` block
4. Reference only primitives via `var(--primitive-*)` or other semantic tokens — never hardcode oklch values

## Adding a New Component Token

1. Add to the `@layer component :root` block
2. Use `var()` references to semantic tokens where possible (e.g., `--btn-new-bg: var(--accent-cyan)`)

---

## Known Limitations

**Figma component tokens are pinned to light mode.** The DTCG token format has no "current mode" reference — `component.button.primary-bg` wires to `{semantic.light.accent.primary}`, not a mode-agnostic path. Figma consumers must override component tokens per-mode or build their own from the semantic layer. This is a format limitation, not a bug.

---

## What NOT to Do

- Add hex, rgb, or hsl colors anywhere — always oklch
- Skip tiers — components must reference semantic tokens, not primitives directly
- Use blurred shadows — the hard offset layer always has zero blur
- Hardcode spacing or font-size values — use `var(--space-*)` and `var(--step-*)`/`var(--ui-text-*)`
- Add animations without `prefers-reduced-motion` guards
- Resolve `var()` references to literal values in exports — preserve the semantic chain
