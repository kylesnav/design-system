---
title: "Versioning Strategy"
date: 2026-03-02
type: spec
scope: launch
status: shell
---

> **Shell Spec** -- This specification will be revised before execution. MVP must be complete before this phase begins.

---

## 1. Tool: Changesets

The Delightful Design System uses [Changesets](https://github.com/changesets/changesets) (`@changesets/cli`) for independent per-package versioning, auto-generated changelogs, and automated publishing via GitHub Actions.

### Setup

```bash
npm install --save-dev @changesets/cli
npx changeset init
```

This creates a `.changeset/` directory at the repo root with a `config.json`:

```json
{
  "$schema": "https://unpkg.com/@changesets/config@3/schema.json",
  "changelog": "@changesets/cli/changelog",
  "commit": false,
  "fixed": [],
  "linked": [],
  "access": "public",
  "baseBranch": "main",
  "updateInternalDependencies": "patch",
  "ignore": []
}
```

Key settings:
- `"fixed": []` -- No fixed groups. Each package versions independently.
- `"linked": []` -- No linked groups. Version bumps are per-package.
- `"access": "public"` -- All packages publish to the public npm registry.

---

## 2. Workflow

### Adding a changeset

After making changes, the developer runs:

```bash
npx changeset
```

The CLI prompts:
1. Which packages were affected? (multi-select from workspace packages)
2. For each package: is this a `major`, `minor`, or `patch` change?
3. Write a changelog entry describing the change.

This creates a file like `.changeset/happy-dogs-dance.md`:

```markdown
---
"@delightful/tokens": minor
---

Add `--surface-elevated` semantic token for elevated card backgrounds.
```

The changeset file is committed with the PR.

### Reviewing changesets

During PR review, reviewers check:
- Correct packages are listed
- Version bump type matches the change (adding = minor, fixing = patch, breaking = major)
- Changelog entry is clear and consumer-facing

### Publishing

On merge to `main`, a GitHub Actions workflow:
1. Runs `npx changeset version` -- consumes all pending changeset files, updates `package.json` versions, and prepends entries to each package's `CHANGELOG.md`.
2. Opens a "Version Packages" PR with the version bumps.
3. When the Version Packages PR is merged, runs `npx changeset publish` -- publishes updated packages to npm.

---

## 3. Semver Policy Per Package

| Package | Token addition | Token removal/rename | Token value change | Component addition | Component class rename | Visual tweak | Prop API change |
|---------|---------------|---------------------|-------------------|-------------------|----------------------|-------------|----------------|
| `@delightful/tokens` | minor | **major** | patch | -- | -- | -- | -- |
| `@delightful/css` | -- | -- | -- | minor | **major** | patch | -- |
| `@delightful/tailwind` | minor (new utility) | **major** (removed utility) | patch | -- | -- | -- | -- |
| `@delightful/react` | -- | -- | -- | minor | -- | patch | **major** |

---

## 4. GitHub Actions Publish Workflow

```yaml
name: Publish Packages
on:
  push:
    branches: [main]

jobs:
  publish:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 22
          registry-url: 'https://registry.npmjs.org'
      - run: npm ci
      - run: npm run build:packages
      - name: Create Release PR or Publish
        uses: changesets/action@v1
        with:
          publish: npx changeset publish
          version: npx changeset version
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
          NPM_TOKEN: ${{ secrets.NPM_TOKEN }}
```

---

## 5. Relationship to bump-version.mjs

The Rebuild Plan references `scripts/bump-version.mjs` for lockstep version bumping across all packages and `palettes/delightful.json`. With Changesets, this script is superseded for package versioning. However, the palette JSON version field may still need manual synchronization or a custom changeset hook. This is an open question.
