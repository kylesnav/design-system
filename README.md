<p align="center">
  <picture>
    <source media="(prefers-color-scheme: dark)" srcset="screenshots/Delightful-Dark.png" />
    <source media="(prefers-color-scheme: light)" srcset="screenshots/Delightful-Light.png" />
    <img src="screenshots/Delightful-Light.png" width="700" alt="Delightful Design System" />
  </picture>
</p>

<h1 align="center">Delightful</h1>

<p align="center">
  A warm, joyful design system built on OKLCH color science.
</p>

<p align="center">
  <a href="https://github.com/kylesnav/delightful-design-system/releases"><img src="https://img.shields.io/github/v/tag/kylesnav/delightful-design-system?label=version&style=flat&color=f600a3&labelColor=fdf8f3" alt="Version" /></a>
  <a href="LICENSE"><img src="https://img.shields.io/github/license/kylesnav/delightful-design-system?style=flat&color=00a6c0&labelColor=fdf8f3" alt="License" /></a>
</p>

<p align="center">
  <a href="https://kylesnav.github.io/delightful-design-system/delightful-design-system.html">Live Demo</a> ·
  <a href="https://kylesnav.github.io/delightful-design-system/delightful-motion.html">Motion</a> ·
  <a href="https://kylesnav.github.io/delightful-design-system/delightful-animation.html">Animation</a> ·
  <a href="#ports">Ports</a> ·
  <a href="#palette">Palette</a> ·
  <a href="#development">Development</a>
</p>

---

## What is Delightful?

Delightful is a design system that takes color seriously. Every value flows through a 3-tier OKLCH token architecture — 7 color families tuned for perceptual uniformity, not eyeballed hex codes. Neo-brutalist aesthetics (solid shadows, 2px borders, bold type) meet spring-physics motion and warm cream backgrounds that never feel cold. Light and dark modes, both designed from scratch.

## Core Systems

### Design System

50+ components built on a 3-tier OKLCH token architecture — 7 primitive color families feeding into semantic tokens for light and dark mode, feeding into component tokens. Neo-brutalist aesthetic with solid shadows, 2px borders, and bold type. Nothing skips a tier.

**[Browse the design system →](https://kylesnav.github.io/delightful-design-system/delightful-design-system.html)**

### Motion

59 named CSS animations across 10 categories — entrances, exits, attention-seekers, morphs, reveals, bounces, loading indicators, micro-interactions, text effects, and decorative. All respect `prefers-reduced-motion`.

**[See the motion demos →](https://kylesnav.github.io/delightful-design-system/delightful-motion.html)**

### Animation

JS-powered spring physics, FLIP layout transitions, particle systems, SVG morphing, gesture handling, and generative art. 23 interactive demos with `linear()` spring easing custom properties.

**[Play with animations →](https://kylesnav.github.io/delightful-design-system/delightful-animation.html)**

## Palette

7 families, each with 5 stops in OKLCH. Warm hues throughout — no cold grays.

| Family | Role | Hue | Stops |
|--------|------|-----|-------|
| **Neutral** | Backgrounds, text, borders | 60–70 | 14 (0–950) |
| **Pink** | Primary brand, actions | 350 | 5 (100–500) |
| **Red** | Danger, errors | 20 | 5 (100–500) |
| **Gold** | Warning, highlights | 85 | 5 (100–500) |
| **Cyan** | Tertiary, info | 210 | 5 (100–500) |
| **Green** | Success, confirmations | 148 | 5 (100–500) |
| **Purple** | Creative, special | 300 | 5 (100–500) |

<details>
<summary><strong>Light mode primitives</strong></summary>

<br>

**Neutral** — warm grays, never cold

| Stop | OKLCH |
|------|-------|
| 0 | `oklch(1.00 0.000 0)` |
| 25 | `oklch(0.988 0.006 70)` |
| 50 | `oklch(0.980 0.008 70)` |
| 100 | `oklch(0.960 0.010 70)` |
| 150 | `oklch(0.940 0.012 70)` |
| 200 | `oklch(0.920 0.012 70)` |
| 300 | `oklch(0.860 0.014 70)` |
| 400 | `oklch(0.750 0.014 70)` |
| 500 | `oklch(0.600 0.012 70)` |
| 600 | `oklch(0.480 0.010 70)` |
| 700 | `oklch(0.350 0.010 70)` |
| 800 | `oklch(0.250 0.012 60)` |
| 900 | `oklch(0.180 0.012 60)` |
| 950 | `oklch(0.140 0.012 60)` |

**Pink** — primary brand

| Stop | OKLCH |
|------|-------|
| 100 | `oklch(0.920 0.060 350)` |
| 200 | `oklch(0.840 0.140 350)` |
| 300 | `oklch(0.720 0.220 350)` |
| 400 | `oklch(0.640 0.270 350)` |
| 500 | `oklch(0.560 0.280 350)` |

**Red** — danger

| Stop | OKLCH |
|------|-------|
| 100 | `oklch(0.930 0.050 20)` |
| 200 | `oklch(0.850 0.110 20)` |
| 300 | `oklch(0.720 0.180 20)` |
| 400 | `oklch(0.620 0.220 20)` |
| 500 | `oklch(0.540 0.230 20)` |

**Gold** — warning, highlights

| Stop | OKLCH |
|------|-------|
| 100 | `oklch(0.960 0.050 85)` |
| 200 | `oklch(0.920 0.110 85)` |
| 300 | `oklch(0.870 0.160 85)` |
| 400 | `oklch(0.840 0.175 85)` |
| 500 | `oklch(0.820 0.165 84)` |

**Cyan** — tertiary, info

| Stop | OKLCH |
|------|-------|
| 100 | `oklch(0.930 0.038 210)` |
| 200 | `oklch(0.850 0.085 210)` |
| 300 | `oklch(0.740 0.125 210)` |
| 400 | `oklch(0.650 0.148 210)` |
| 500 | `oklch(0.570 0.155 210)` |

**Green** — success

| Stop | OKLCH |
|------|-------|
| 100 | `oklch(0.930 0.042 148)` |
| 200 | `oklch(0.840 0.095 148)` |
| 300 | `oklch(0.730 0.145 148)` |
| 400 | `oklch(0.630 0.170 148)` |
| 500 | `oklch(0.540 0.165 148)` |

**Purple** — creative

| Stop | OKLCH |
|------|-------|
| 100 | `oklch(0.940 0.040 300)` |
| 200 | `oklch(0.860 0.080 300)` |
| 300 | `oklch(0.720 0.160 300)` |
| 400 | `oklch(0.640 0.220 300)` |
| 500 | `oklch(0.560 0.260 300)` |

</details>

<details>
<summary><strong>Dark mode semantic accents</strong></summary>

<br>

Dark backgrounds use warm amber hue (65) instead of cold black. Accents are brightened for readability.

| Token | Light | Dark |
|-------|-------|------|
| `--bg-page` | `oklch(0.982 0.008 70)` | `oklch(0.140 0.014 65)` |
| `--bg-surface` | `oklch(0.995 0.004 70)` | `oklch(0.165 0.015 65)` |
| `--bg-elevated` | `oklch(1.00 0.00 0)` | `oklch(0.190 0.015 65)` |
| `--text-primary` | `oklch(0.200 0.015 60)` | `oklch(0.935 0.008 70)` |
| `--accent-primary` | `oklch(0.640 0.270 350)` | `oklch(0.700 0.230 350)` |
| `--accent-danger` | `oklch(0.620 0.220 20)` | `oklch(0.660 0.200 20)` |
| `--accent-gold` | `oklch(0.840 0.175 85)` | `oklch(0.840 0.170 85)` |
| `--accent-cyan` | `oklch(0.650 0.148 210)` | `oklch(0.720 0.140 210)` |
| `--accent-green` | `oklch(0.630 0.170 148)` | `oklch(0.680 0.155 148)` |
| `--accent-purple` | `oklch(0.640 0.220 300)` | `oklch(0.700 0.200 300)` |

</details>

## Ports

<table>
<tr>
<td align="center" width="50%">

**VS Code**

<a href="https://github.com/kylesnav/delightful-vscode">
<picture>
  <source media="(prefers-color-scheme: dark)" srcset="screenshots/VSCode-Dark.png" />
  <img src="screenshots/VSCode-Light.png" width="400" alt="VS Code — Delightful" />
</picture>
</a>

[Source](vscode-theme/) · [Repo](https://github.com/kylesnav/delightful-vscode)

</td>
<td align="center" width="50%">

**Obsidian**

<a href="https://github.com/kylesnav/obsidian-delightful">
<picture>
  <source media="(prefers-color-scheme: dark)" srcset="screenshots/Obsidian-Dark.png" />
  <img src="screenshots/Obsidian-Light.png" width="400" alt="Obsidian — Delightful" />
</picture>
</a>

[Source](obsidian-theme/) · [Repo](https://github.com/kylesnav/obsidian-delightful)

</td>
</tr>
<tr>
<td align="center">

**Ghostty**

<a href="https://github.com/kylesnav/delightful-ghostty">
<picture>
  <source media="(prefers-color-scheme: dark)" srcset="screenshots/Ghostty-Dark.png" />
  <img src="screenshots/Ghostty-Light.png" width="400" alt="Ghostty — Delightful" />
</picture>
</a>

[Source](ghostty/) · [Repo](https://github.com/kylesnav/delightful-ghostty)

</td>
<td align="center">

**iTerm2**

<a href="https://github.com/kylesnav/delightful-iterm2">
<picture>
  <source media="(prefers-color-scheme: dark)" srcset="screenshots/iTerm2-Dark.png" />
  <img src="screenshots/iTerm2-Light.png" width="400" alt="iTerm2 — Delightful" />
</picture>
</a>

[Source](iterm2/) · [Repo](https://github.com/kylesnav/delightful-iterm2)

</td>
</tr>
<tr>
<td align="center">

**Claude Code Plugin**

`claude plugin install kylesnav/delightful-claude-plugin`

Build with Delightful in your own projects. Includes `/build` and `/refactor` skills, auditor and builder agents, plus exportable CSS tokens, a Tailwind preset, and Figma tokens.

[Source](claude-plugin/) · [Repo](https://github.com/kylesnav/delightful-claude-plugin)

</td>
<td align="center">

**Shell / Starship**

`bash scripts/setup-terminal.sh`

Starship prompt, zsh config, smart-open.

[Source](shell/) · [Repo](https://github.com/kylesnav/delightful-shell)

</td>
</tr>
</table>

## Repo Structure

```
delightful-design-system/
├── delightful-design-system.html   # Source of truth — all tokens and components
├── delightful-motion.html          # 59 CSS animations
├── delightful-animation.html       # JS spring physics, FLIP, particles
├── claude-plugin/                  # Claude Code plugin (skills, agents, tokens)
├── vscode-theme/                   # VS Code extension
├── obsidian-theme/                 # Obsidian theme
├── ghostty/                        # Ghostty terminal theme + shaders
├── iterm2/                         # iTerm2 color profiles
├── shell/                          # Starship prompt + zsh config
├── scripts/                        # sync-tokens, bump-version, setup-terminal
├── screenshots/                    # Platform screenshots (light + dark)
└── tests/                          # Playwright visual regression + token consistency
```

## Development

### Source of truth

`delightful-design-system.html` contains every primitive, semantic, and component token. Edit tokens there, then propagate.

### Propagation

After changing tokens in the source HTML:

1. `npm run sync` — auto-updates CSS tokens, Obsidian theme, motion/animation HTML
2. `cd vscode-theme/scripts && node generate-themes.mjs` — regenerates VS Code themes
3. Manually update: Tailwind preset, Figma tokens, reference docs, agents, skills

### Versioning

```bash
npm run bump 0.6.0
```

Updates all 6 version files and creates a git tag. Never update versions manually.

### Testing

```bash
npx playwright test
```

Visual regression, token consistency, press behavior, animation, terminal theme, and color audit tests.

## License

[MIT](LICENSE)
