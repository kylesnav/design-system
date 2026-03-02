---
title: "React Package Specification"
date: 2026-03-02
type: spec
scope: launch
status: shell
---

> **Shell Spec** -- This specification will be revised before execution. MVP must be complete before this phase begins.

---

## 1. Purpose

`@delightful/react` provides typed React component wrappers for the Delightful Design System. Each component applies CSS classes from `@delightful/css`, accepts variant and size props, forwards refs, and exports a TypeScript props interface.

---

## 2. Must-Have Components (Launch Priority)

These eight components ship in the initial release. They establish the patterns that all subsequent components follow.

| Component | HTML Element | Variants | Sizes | Notes |
|-----------|-------------|----------|-------|-------|
| Button | `<button>` | primary, secondary, danger, success, gold, cyan, purple, ghost | sm, md, lg | Loading state, icon-only mode |
| Card | `<div>` | base, interactive, featured, compact, accent | -- | Interactive variant adds lift/press |
| Badge | `<span>` | primary, danger, success, warning, info, purple | -- | Inline display |
| Toggle | `<button>` | -- | sm, md, lg | Controlled + uncontrolled, `checked` prop |
| Input | `<input>` | -- | sm, md, lg | Error state, disabled, placeholder |
| Select | compound | -- | sm, md, lg | `<Select>`, `<Select.Trigger>`, `<Select.Content>`, `<Select.Option>` |
| Textarea | `<textarea>` | -- | sm, md, lg | Auto-resize option, error state |
| Code Block | `<pre>` + `<code>` | -- | -- | Language prop, copy button |

---

## 3. Remaining Components (Second Priority)

After the must-haves establish the pattern, wrap all remaining 35 MVP components (43 total minus the 8 must-haves above). Priority order follows the CSS batch structure: Batch A (simple display) through Batch I (composition).

---

## 4. Component API Pattern

Every component follows this structure:

```tsx
import { forwardRef } from 'react';
import type { ComponentPropsWithoutRef } from 'react';

export interface ButtonProps extends ComponentPropsWithoutRef<'button'> {
  variant?: 'primary' | 'secondary' | 'danger' | 'success' | 'gold' | 'cyan' | 'purple' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = 'primary', size = 'md', loading, className, children, ...props }, ref) => {
    const classes = [
      'btn',
      `btn-${variant}`,
      `btn-${size}`,
      loading && 'btn-loading',
      className,
    ].filter(Boolean).join(' ');

    return (
      <button ref={ref} className={classes} {...props}>
        {children}
      </button>
    );
  }
);

Button.displayName = 'Button';
```

Key patterns:
- `forwardRef` with explicit generic types (element type + props type)
- Props interface extends the base HTML element's props (via `ComponentPropsWithoutRef`)
- Variant and size props have defaults
- `className` is merged, not replaced -- consumer classes are appended
- Spread `...props` passes through all standard HTML attributes including `aria-*` and event handlers
- `displayName` set for React DevTools

---

## 5. Compound Component Pattern

For components with multiple related parts (Select, Accordion, Tabs):

```tsx
const SelectRoot = forwardRef<HTMLDivElement, SelectProps>(/* ... */);
const SelectTrigger = forwardRef<HTMLButtonElement, SelectTriggerProps>(/* ... */);
const SelectContent = forwardRef<HTMLDivElement, SelectContentProps>(/* ... */);
const SelectOption = forwardRef<HTMLDivElement, SelectOptionProps>(/* ... */);

export const Select = Object.assign(SelectRoot, {
  Trigger: SelectTrigger,
  Content: SelectContent,
  Option: SelectOption,
});
```

---

## 6. Key Decisions (to be resolved)

- **React version support**: React 18+ only, or also support React 17? React 18 introduced `useId` and concurrent features. Supporting 17 limits the API surface.
- **SSR compatibility**: All components must render server-side without `window` or `document` references. This constrains interactive components (Toggle, Select) that need client-side state.
- **Test framework**: React Testing Library + Vitest, or React Testing Library + Jest? Vitest aligns with the Vite ecosystem if we use that for bundling.
- **Bundler**: tsup, rollup, or Vite library mode? tsup is the simplest (wrapper around esbuild + rollup for DTS). Rollup gives the most control. Vite library mode keeps the toolchain unified.
- **JSX transform**: Classic (`React.createElement`) or automatic (no React import needed)? Automatic is standard for React 17+ with the new transform.

---

## 7. Open Questions

- Should components manage their own state (uncontrolled by default, controllable via props) or be fully controlled? The common React pattern is uncontrolled with optional controlled override.
- Do we export a `ThemeProvider` component, or is theme management (`data-theme` attribute) left to the consumer?
- Should animation-dependent components (e.g., Toast with auto-dismiss, Modal with scale transition) use CSS animations or a React animation library?
- How do we handle components that need JS behavior (Select dropdown, Command Palette keyboard navigation) -- inline logic, or dependency on a headless UI library like Radix?

---

## 8. Exports Map (provisional)

```json
{
  "name": "@delightful/react",
  "exports": {
    ".": {
      "import": "./dist/index.mjs",
      "require": "./dist/index.cjs",
      "types": "./dist/index.d.ts"
    },
    "./button": {
      "import": "./dist/components/button.mjs",
      "types": "./dist/components/button.d.ts"
    },
    "./card": {
      "import": "./dist/components/card.mjs",
      "types": "./dist/components/card.d.ts"
    }
  },
  "peerDependencies": {
    "@delightful/tokens": "^1.0.0",
    "@delightful/css": "^1.0.0",
    "react": ">=18.0.0",
    "react-dom": ">=18.0.0"
  }
}
```
