---
title: "Package Validation Checklist"
date: 2026-03-02
type: qa
scope: launch
status: shell
---

> **Shell QA** -- This checklist will be revised before execution. MVP must be complete before this phase begins.

---

## @delightful/tokens

- [ ] `npm install @delightful/tokens` succeeds in a blank project
- [ ] `import '@delightful/tokens/css'` resolves the CSS file
- [ ] `import tokens from '@delightful/tokens'` gives a JS object with all token values
- [ ] `tokens.json` validates against W3C DTCG schema
- [ ] TypeScript: token names are typed (no `any`)
- [ ] Zero peer dependencies
- [ ] Zero dependencies
- [ ] `package.json` has correct `exports` map
- [ ] `npm pack --dry-run` shows only `dist/` files and `README.md`

## @delightful/tailwind

- [ ] Preset installs and extends Tailwind config without errors
- [ ] `bg-accent-primary` utility class resolves to correct `var()` reference
- [ ] Dark mode: switching `data-theme` on `<html>` changes utility-applied colors
- [ ] Every semantic token has a corresponding Tailwind utility
- [ ] Peer dependencies correctly list `tailwindcss` and `@delightful/tokens`
- [ ] `package.json` has correct `exports` map

## @delightful/css

- [ ] `import '@delightful/css'` gives the full component bundle
- [ ] Individual component imports work: `import '@delightful/css/components/button'`
- [ ] `foundation`, `motion`, `reset` sub-path exports resolve
- [ ] Tree-shaking: importing only `button.css` does not include other components
- [ ] All component files from `src/components/` are present in `dist/components/`
- [ ] Peer dependency correctly lists `@delightful/tokens`
- [ ] `package.json` has correct `exports` map

## @delightful/react

- [ ] All must-have components render without errors
- [ ] TypeScript: all props are typed, no implicit `any`
- [ ] `forwardRef` works: ref passed to Button reaches the DOM element
- [ ] `variant` prop accepts all documented variants (TypeScript enforced)
- [ ] `size` prop works correctly
- [ ] Reduced-motion: no animation when `prefers-reduced-motion: reduce`
- [ ] SSR: components render server-side without `window`/`document` errors
- [ ] `className` prop merges with internal classes (does not replace)
- [ ] `...props` spread passes through `aria-*` attributes and event handlers
- [ ] Peer dependencies correctly list `@delightful/tokens`, `@delightful/css`, `react`, `react-dom`
- [ ] `package.json` has correct `exports` map

## Cross-package

- [ ] Installing all four packages together does not produce peer dependency warnings
- [ ] A minimal project with all packages renders a Button with correct styles
- [ ] Token values in `tokens.json` match `tokens.css` custom property values
- [ ] React components apply CSS classes that exist in `@delightful/css`
