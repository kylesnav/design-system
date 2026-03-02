---
title: "CSS Package Specification"
date: 2026-03-02
type: spec
scope: launch
status: shell
---

> **Shell Spec** -- This specification will be revised before execution. MVP must be complete before this phase begins.

---

## 1. Purpose

`@delightful/css` is the distributable CSS component library for the Delightful Design System. It provides all component styles, foundation CSS, motion system, and reset -- either as a single bundle or as individual tree-shakeable files.

---

## 2. Inputs

| Source | Path | Description |
|--------|------|-------------|
| Component CSS files | `src/components/*.css` | One CSS file per component, each in `@layer component`. |
| Component index | `src/components/index.css` | `@import` bundle entry that imports all component files. |
| Foundation | `src/foundation.css` | Tier 3 tokens: typography, spacing, radius, shadows, motion timing, z-index. |
| Motion | `src/motion/motion.css` | 59 keyframes + animation utility classes. |
| Reset | `src/reset.css` | CSS reset, layer order declaration, `prefers-reduced-motion` gate. |

---

## 3. Outputs

All outputs are written to `packages/css/dist/`.

| File | Format | Description |
|------|--------|-------------|
| `components.css` | CSS | Bundled -- all component CSS files concatenated. Single import for full library. |
| `components/*.css` | CSS | Individual component files. One-to-one copies from `src/components/`. Enables tree-shaking by importing only needed components. |
| `foundation.css` | CSS | Copy of `src/foundation.css`. |
| `motion.css` | CSS | Copy of `src/motion/motion.css`. |
| `reset.css` | CSS | Copy of `src/reset.css`. |

---

## 4. Consumer Usage

**Full bundle:**
```css
@import '@delightful/tokens/css';
@import '@delightful/css/reset';
@import '@delightful/css/foundation';
@import '@delightful/css';
@import '@delightful/css/motion';
```

**Tree-shaken (individual components):**
```css
@import '@delightful/tokens/css';
@import '@delightful/css/reset';
@import '@delightful/css/foundation';
@import '@delightful/css/components/button';
@import '@delightful/css/components/card';
@import '@delightful/css/components/input';
```

---

## 5. Key Decisions (to be resolved)

- **Tree-shaking strategy**: Are individual component files exact copies from `src/components/`, or are they processed (e.g., removing `@import` statements, inlining shared dependencies)? Copies are simplest; processing reduces duplication but adds build complexity.
- **Source maps**: Do we publish source maps alongside CSS files? Source maps help debugging but increase package size.
- **Minification**: Do we ship minified CSS, readable CSS, or both? Readable is better for debugging and learning. Minified is better for production. Publishing both (e.g., `components.css` and `components.min.css`) doubles the file count.

---

## 6. Open Questions

- Should `foundation.css` be split further (e.g., `typography.css`, `spacing.css`) for even finer-grained imports?
- Do individual component CSS files need to declare their own `@layer component` wrapper, or does the reset's layer order declaration handle this globally?
- Should the package include a `dist/utilities.css` for the utility classes, or are those only consumed via the Tailwind preset?

---

## 7. Exports Map

```json
{
  "name": "@delightful/css",
  "exports": {
    ".": "./dist/components.css",
    "./components/*": "./dist/components/*.css",
    "./foundation": "./dist/foundation.css",
    "./motion": "./dist/motion.css",
    "./reset": "./dist/reset.css"
  },
  "peerDependencies": {
    "@delightful/tokens": "^1.0.0"
  }
}
```
