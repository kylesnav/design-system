---
title: "Launch Architecture"
date: 2026-03-02
type: architecture
scope: launch
status: shell
---

> **Planning Baseline** -- This architecture document will be revisited and refined after MVP is complete and stable. All decisions here are provisional. The Launch phase will not begin until the MVP showcase is shipped and the team has had time to refine the approach based on what was learned during the build.

---

## 1. Phase 8 Overview

Launch delivers two things that MVP does not: **installable packages** and **platform reach**.

MVP builds the Delightful Design System for internal use -- a working design system with tokens, components, motion, and documentation pages assembled from source files. Everything runs from the repo. Consumers are people who clone or fork the project.

Launch makes the system consumable by others. npm packages let any project `npm install` the tokens, CSS, or React components. Platform distribution repos submit the design system's ports to their respective marketplaces and theme galleries. A Claude Code plugin lets AI agents generate Delightful-compliant code.

Phase 8 combines what the Rebuild Plan originally scoped as Phase 8 (Packages) and Phase 9 (Platform Distribution) into a single launch phase. The numbering is now Phases 0--8, with Phase 8 being Launch.

---

## 2. npm Package Architecture

### Why four separate packages

The system splits into four packages because the layers of the design system have different consumers and different stability profiles:

- **@delightful/tokens** -- The foundation. Contains only design token values (CSS custom properties, JSON, JS, TypeScript declarations). Zero dependencies. A project that uses Tailwind, vanilla CSS, or any framework can consume just the tokens. This package changes the least frequently.

- **@delightful/tailwind** -- A Tailwind CSS preset that maps every semantic token to a utility class via `var()` references. Only useful for Tailwind projects. Peer-depends on `tailwindcss` and `@delightful/tokens`.

- **@delightful/css** -- The full CSS component library: bundled or tree-shakeable individual files, plus foundation, motion, and reset layers. Peer-depends on `@delightful/tokens`. Useful for any project that wants pre-built component styles without a JS framework.

- **@delightful/react** -- Typed React component wrappers around the CSS components. Peer-depends on `@delightful/tokens`, `@delightful/css`, `react`, and `react-dom`. The most volatile package -- API surface evolves as component patterns mature.

This separation means a Tailwind-only project never downloads React code, a vanilla HTML project never downloads Tailwind config, and everyone gets tokens without paying for anything else.

### Monorepo workspace structure

```
packages/
  tokens/     @delightful/tokens
  tailwind/   @delightful/tailwind
  css/        @delightful/css
  react/      @delightful/react
```

The root `package.json` declares `"workspaces": ["packages/*"]`. Each package has its own `package.json`, `dist/` output directory, and `README.md`.

### Exports map philosophy

Each package exposes specific entry points via the `"exports"` field in `package.json`. No barrel exports. Consumers import exactly what they need, and bundlers resolve exactly what was imported. Wildcard patterns (e.g., `./components/*`) enable tree-shaking at the file level.

### Zero-dependency design for @delightful/tokens

`@delightful/tokens` has zero `dependencies` and zero `peerDependencies`. It ships static files (CSS, JSON, JS, TypeScript declarations). Any project can install it without pulling in a dependency tree.

### Peer dependency chain

```
@delightful/tokens        (zero deps)
       |
       +---- @delightful/tailwind   (peers: tailwindcss, @delightful/tokens)
       |
       +---- @delightful/css        (peers: @delightful/tokens)
                    |
                    +---- @delightful/react  (peers: @delightful/tokens, @delightful/css, react, react-dom)
```

Tokens are the root. Everything else depends on tokens. React depends on CSS (it applies CSS classes from the CSS package). Tailwind is a sibling to CSS -- they do not depend on each other.

### Consumer import patterns

**Vanilla HTML / CSS project:**
```css
/* Import tokens and reset first */
@import '@delightful/tokens/css';
@import '@delightful/css/reset';
@import '@delightful/css/foundation';

/* Import all components */
@import '@delightful/css';

/* Or import individual components for smaller bundles */
@import '@delightful/css/components/button';
@import '@delightful/css/components/card';

/* Optional: motion system */
@import '@delightful/css/motion';
```

**Tailwind project:**
```js
// tailwind.config.js
import delightful from '@delightful/tailwind';

export default {
  presets: [delightful],
  // ...
};
```

**React project:**
```tsx
import { Button, Card } from '@delightful/react';
import '@delightful/tokens/css';
import '@delightful/css/reset';
import '@delightful/css/foundation';

function App() {
  return (
    <Card variant="interactive">
      <Button variant="primary" size="md">Click me</Button>
    </Card>
  );
}
```

**Token access in JavaScript:**
```ts
import tokens from '@delightful/tokens';

console.log(tokens.semantic.light['bg-page']);
// → "oklch(0.982 0.008 70)"
```

---

## 3. Exports Maps

### @delightful/tokens

```json
{
  "exports": {
    ".": {
      "import": "./dist/tokens.mjs",
      "require": "./dist/tokens.cjs",
      "types": "./dist/tokens.d.ts"
    },
    "./css": "./dist/tokens.css",
    "./json": "./dist/tokens.json"
  }
}
```

- Default import (`.`) resolves to the JS module (ESM or CJS depending on consumer's module system), with TypeScript declarations.
- `./css` gives the raw CSS custom properties file.
- `./json` gives the W3C DTCG-format JSON for tooling integrations.

### @delightful/css

```json
{
  "exports": {
    ".": "./dist/components.css",
    "./components/*": "./dist/components/*.css",
    "./foundation": "./dist/foundation.css",
    "./motion": "./dist/motion.css",
    "./reset": "./dist/reset.css"
  }
}
```

- Default import (`.`) gives the full component bundle.
- `./components/*` wildcard enables individual component imports for tree-shaking.
- Foundation, motion, and reset are separate entry points so consumers control what they load.

### @delightful/tailwind

```json
{
  "exports": {
    ".": "./dist/preset.js"
  }
}
```

- Single entry point. The preset is the entire package.

### @delightful/react (provisional)

```json
{
  "exports": {
    ".": {
      "import": "./dist/index.mjs",
      "require": "./dist/index.cjs",
      "types": "./dist/index.d.ts"
    },
    "./button": {
      "import": "./dist/components/button.mjs",
      "types": "./dist/components/button.d.ts"
    }
  }
}
```

- Default import gives all components (barrel, but each component is a named export).
- Individual component imports for consumers who want minimal bundles.
- TypeScript declarations at every entry point.

---

## 4. Changesets Versioning Strategy

### Why Changesets over lockstep

The Rebuild Plan originally specified lockstep versioning via `scripts/bump-version.mjs`. Launch replaces this with Changesets (`@changesets/cli`) for independent per-package versioning.

Rationale: packages evolve at different rates. `@delightful/tokens` is the most stable -- once the palette is finalized, token changes are rare and always significant. `@delightful/react` is the most volatile -- API refinements, new components, and prop changes happen frequently. Forcing both to share a version number means either tokens get meaningless bumps or React changes are artificially delayed.

### Workflow

1. Developer makes changes to one or more packages.
2. Developer runs `npx changeset` and selects affected packages.
3. Changeset CLI prompts for version bump type (patch, minor, major) and a changelog entry.
4. A `.changeset/*.md` file is committed with the PR.
5. On merge to main, a GitHub Actions workflow runs `npx changeset version` (updates package.json versions and CHANGELOG.md) and `npx changeset publish` (publishes to npm).

### Semver policy

| Package | Semver approach |
|---------|----------------|
| `@delightful/tokens` | Semver-strict. Adding a token is minor. Removing or renaming a token is major. Changing a token value (e.g., adjusting a color) is patch. |
| `@delightful/css` | Follows tokens major version. Adding a component is minor. Changing component class names is major. Visual tweaks are patch. |
| `@delightful/tailwind` | Follows tokens major version. Adding utilities is minor. Removing a utility is major. |
| `@delightful/react` | Independent semver. Adding a component is minor. Changing a prop API is major. Bug fixes are patch. |

---

## 5. React Component API Principles

### forwardRef on every component

Every React component uses `forwardRef` so consumers can attach refs for positioning libraries (Floating UI, Radix), focus management, and measurement. The forwarded ref points to the root DOM element of the component.

```tsx
const Button = forwardRef<HTMLButtonElement, ButtonProps>((props, ref) => {
  return <button ref={ref} {...filteredProps} />;
});
```

### Variant props via a single `variant` prop

Components use a single `variant` prop with a string enum, not boolean flags:

```tsx
// Correct
<Button variant="primary" />
<Button variant="danger" />
<Button variant="ghost" />

// Incorrect -- do not do this
<Button isPrimary />
<Button isDanger />
```

### Size props

Components that support sizing use `size="sm" | "md" | "lg"` with `md` as the default:

```tsx
<Button size="sm">Small</Button>
<Button>Medium (default)</Button>
<Button size="lg">Large</Button>
```

### Compound components where appropriate

Complex components with multiple related parts use compound patterns:

```tsx
<Select>
  <Select.Trigger>Choose an option</Select.Trigger>
  <Select.Content>
    <Select.Option value="a">Option A</Select.Option>
    <Select.Option value="b">Option B</Select.Option>
  </Select.Content>
</Select>
```

Simple components (Button, Badge, Input) are standalone -- no compound pattern needed.

### No style prop passthrough

Components do not accept a `style` prop. Consumer overrides happen via `className`:

```tsx
<Button className="my-custom-class" variant="primary">
  Custom styled
</Button>
```

This keeps specificity predictable and avoids inline style conflicts with the design system's CSS.

### Unstyled-ready

All components apply CSS classes from `@delightful/css`. They do not contain inline styles or CSS-in-JS. Consumers can override any visual by writing CSS that targets the same class names at a higher specificity or later in the cascade.

---

## 6. Claude Code Plugin Philosophy

### Skills are prompts, not code

The `/build` and `/refactor` skills are prompt files that instruct Claude using the design system's own documentation as context. They do not contain application logic -- they are structured instructions that reference spec files, token definitions, and component patterns.

### Auditor agent enforces the no-primitive rule

The auditor agent checks generated or refactored code for token tier violations: any reference to a `--primitive-*` token in component-layer CSS is flagged. This mirrors the linter rule in `biome.json` but runs as an AI review step that can also catch semantic misuse (e.g., using `--accent-primary` for a background that should be `--bg-surface`).

### Builder agent uses component specs as source of truth

The builder agent receives a component description and generates a complete implementation (CSS + optional React wrapper) by referencing the component spec files in `Documentation/Specs/components/`. It follows the same patterns established in the MVP build: `@layer component`, `var()` references, variant classes, accessibility attributes.

### Plugin is self-contained

The plugin includes a copy of `tokens.css` and key spec excerpts so it works without requiring the consumer to have the full documentation set. The plugin's reference doc (`design-system.md`) is a condensed version of the architecture and token documentation.

---

## 7. Platform Distribution Philosophy

### Each port is an emitter output

The emitter pipeline (Phase 2) already generates platform-specific outputs. Distribution repos are not maintained separately -- they receive emitter output. Changing a color in `palettes/delightful.json` and running `npm run build` updates every port automatically.

### Distribution repos are thin wrappers

Each distribution repo contains:
- Emitter output file(s)
- `README.md` with platform-specific install instructions
- Light and dark screenshots (1280x720 from `docs/preview-light.html` and `docs/preview-dark.html`)
- Platform-specific metadata files (e.g., `manifest.json` for Obsidian, `package.json` for VS Code)

### Submission checklist per platform varies

| Platform | Submission format | Update process |
|----------|------------------|----------------|
| VS Code Marketplace | `.vsix` package via `vsce` | Publish new version via `vsce publish` |
| Obsidian Community Themes | PR to `obsidian-releases` repo | Update `theme.css` + bump `manifest.json` version |
| Ghostty | Theme file to `ghostty.style` | Submit updated theme file |
| iTerm2 Color Schemes | PR to `mbadolato/iTerm2-Color-Schemes` | Update `.itermcolors` file in PR |
| Starship presets | TOML preset submission | Update preset file |
| Claude Plugin Directory | Plugin package submission | Update plugin files |
