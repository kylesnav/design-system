---
title: "Tilt Card Feature Brief"
type: spec
scope: roadmap
status: brief
---

# Tilt Card Feature Brief

> **Roadmap Package** — These items are deferred post-v1.0. They should not be built until the MVP showcase is complete and stable. The specifications here are briefs, not build guides. When the time comes, these items will be fully re-specced based on what was learned during the MVP build.

---

## What It Is

A card with CSS perspective that tilts toward the cursor in 3D space via spring physics. Two independent spring oscillators drive `rotateX` and `rotateY` transforms. A shine overlay (linear gradient) dynamically shifts angle and opacity to simulate a light source following the cursor. On mouseleave, springs animate back to zero.

---

## Why Deferred

Requires `spring.js` to be stable. The tilt effect is driven by a damped harmonic oscillator — not CSS transitions — which means the Animation JS system must be complete before this component can be built.

---

## Key Parameters

| Parameter | Value | Source |
|-----------|-------|--------|
| Spring preset | Standard | `{ stiffness: 200, damping: 20, mass: 1 }` |
| Rotation range | ±15° target | `x * 30` on `[-0.5, 0.5]` normalized cursor position |
| Perspective | 800px | Set on parent wrapper, not on card |
| Settlement threshold | 0.1° position, 0.1 deg/s velocity | Four conditions checked per frame |

---

## Rotation Angle Conflict

The original task brief specifies **±12°** maximum rotation. The `delightful-animation.html` source code uses `x * 30` on a `[-0.5, 0.5]` normalized range, yielding **±15° maximum target**.

The existing spec notes: "The spring will approach but typically not reach this full target value before the cursor moves again." The perceived rotation may be closer to ±12° even though the mathematical target is ±15°.

**This must be confirmed against the actual demo before building.** Test the demo, measure the perceived rotation at various cursor positions, and decide whether the target should be 30 (±15°) or 24 (±12°).

---

## 3D Layer Structure

The card uses three visual layers:
1. **Base card** — `var(--bg-surface)` background, `var(--shadow-md)` shadow, `var(--border-default)` border with `4px solid var(--accent-primary)` top accent
2. **Content layer** — text and badges with `position: relative; z-index: 1` to render above the shine overlay
3. **Shine overlay** — `.tilt-shine` element with `position: absolute; inset: 0`, `linear-gradient` that shifts angle (105°-165°) and opacity (0.10-0.25) based on horizontal cursor position

Parent wrapper sets `perspective: 800px`. The card sets `transform-style: preserve-3d` to participate in the 3D context.

---

## Dependencies

- **`spring.js`** — for the damped harmonic oscillator that drives rotation
- **Stable component token architecture** — `--bg-surface`, `--border-default`, `--accent-primary`, `--shadow-md`, `--radius-md`
- **`requestAnimationFrame`** — the spring loop runs at 60fps via rAF

---

## Source Reference

`Documentation/Specs/components/tilt-card.md` has the complete existing spec including full JS implementation code. The spec is rated 10/11 in the quality audit. Note: this component does NOT appear in `design-reference.html` — it is sourced from `delightful-animation.html`.
