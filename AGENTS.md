# Delightful

This repo powers `https://delightful.build/` and contains the source-of-truth HTML references for the Delightful design system.

## Source of Truth

- `index.html` is the public homepage.
- `delightful-design-system.html` is the canonical component/token/interaction reference.
- `delightful-color.html`, `delightful-motion.html`, and `delightful-animation.html` are companion references.
- Standalone platform ports live in sibling repos. Do not add local copies back here.

## Validate

```sh
npm install
npm test
```

Use Browser screenshots for visual changes. Check homepage, design-system, color, motion, and animation pages in light, dark, mobile, and reduced-motion views when their shared tokens or layout systems change.

## Editing Rules

- Colors use OKLCH in source.
- Keep token flow primitives -> semantic -> component.
- HTML files are self-contained with inline CSS/JS.
- Keep `CNAME` unchanged.
- `scripts/tokens.mjs` is kept for token extraction. The old monorepo sync workflow is retired.

## Release Notes

`npm run bump <version>` updates only this repo's root package version and creates a site tag. Platform ports are released from their own repos.
