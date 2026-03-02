---
title: "React API Design Review"
date: 2026-03-02
type: qa
scope: launch
status: shell
---

> **Shell QA** -- This review checklist will be revised before execution. MVP must be complete before this phase begins.

---

## Per-Component Review

For each component in `@delightful/react`, assess the following:

### Naming and Props

- [ ] Prop names follow consistent conventions (`variant`, `size`, `disabled`, `className`)
- [ ] No boolean props that could be a variant (`isLoading` should be `variant="loading"` or a separate `loading` boolean only if it crosses variant boundaries)
- [ ] Variant values are string enums, not booleans
- [ ] Size values follow the `sm | md | lg` pattern with `md` as default
- [ ] Default props set for all optional props

### Ref Forwarding

- [ ] `forwardRef` implemented correctly
- [ ] Ref type is the HTML element, not the component instance (e.g., `HTMLButtonElement`, not `typeof Button`)
- [ ] Ref reaches the root DOM element of the component

### TypeScript

- [ ] Props interface is exported (consumers can use `ButtonProps`, `CardProps`, etc.)
- [ ] Props interface extends the correct HTML element props (via `ComponentPropsWithoutRef`)
- [ ] Variant prop is typed as a string union, not `string`
- [ ] Event handlers typed correctly (e.g., `onClick: React.MouseEventHandler<HTMLButtonElement>`)

### CSS Integration

- [ ] Component applies CSS class names from `@delightful/css`
- [ ] `className` prop allows consumer overrides without `!important`
- [ ] No inline styles -- all styling via CSS classes
- [ ] No CSS-in-JS or styled-components

### Accessibility

- [ ] `aria-*` props passed through to DOM element via `...props` spread
- [ ] Interactive components have appropriate default ARIA roles
- [ ] Keyboard navigation works (Tab, Enter, Space, Escape where applicable)
- [ ] Focus management is correct (focus-visible styles apply)

### Compound Components (where applicable)

- [ ] Compound structure is necessary (not overengineered for simple components)
- [ ] Sub-components are accessible via dot notation (`Select.Option`)
- [ ] Sub-components have their own typed props interfaces
- [ ] Context is used correctly for parent-child communication

### Component Completeness

- [ ] All variants from the CSS spec are supported
- [ ] All sizes from the CSS spec are supported
- [ ] Disabled state handled correctly (both visual and functional)
- [ ] Loading state handled correctly (where applicable)
- [ ] `displayName` set for React DevTools
