# Orchestration Planning Prompt

Copy everything below the line into a Claude Code session in plan mode at
`~/Desktop/Working/Github/delightful-design-system`.

---

Build the orchestration layer for the Delightful Design System rebuild. The
documentation and phase prompts already exist — your job is to produce the
missing coordination layer that lets a fresh agent pick up any phase and
execute it cleanly.

## Read First

Before producing anything, read these files thoroughly in order:

1. `README.md` — project overview and current status
2. `Documentation/Refactor/README.md` — documentation package index
3. `Documentation/Refactor/how-to-execute.md` — existing operator guide
   (your output should complement this, not duplicate it)
4. `Documentation/Refactor/MVP/Architecture/mvp-architecture.md` — full
   system architecture
5. `Documentation/Refactor/MVP/Prompts/master-sequence.md` — phase order,
   acceptance criteria, critical rules
6. Skim all 7 phase prompts in `Documentation/Refactor/MVP/Prompts/` to
   understand what each phase already specifies

The phase prompts are complete and executable as-is. Do not rewrite or
summarize them. Reference them by path.

## What to Produce

Output folder: `Documentation/Refactor/Orchestration/`

---

### 1. `CLAUDE.md` (repo root, not in Orchestration/)

Under 100 lines. This is what every fresh agent reads first — orient, don't
explain. Link to deeper docs rather than duplicating content.

Contents:
- Repo purpose (one line)
- Branch rule: `delightful-refactor` only — never merge to or push to main
- Current status: documentation-only, no source code yet
- Compact directory table: path → purpose (8–10 rows max)
- Phase workflow: "Read `Documentation/Refactor/how-to-execute.md` and your
  phase prompt in `Documentation/Refactor/MVP/Prompts/`"
- Agent SOP: "Follow `Documentation/Refactor/Orchestration/agent-workflow.md`"
- Ticket ops: "Use `/linear-issue` for all Linear operations"
- Model routing: opus for implementation and architecture decisions; sonnet
  sub-agents for review, validation, browser testing, and ticket operations
- Git workflow: worktree per phase, frequent commits, merge back to
  `delightful-refactor` on review approval
- Key conventions (compact list — values only, no explanation):
  OKLCH color space, 3-tier tokens (primitives → semantic → component),
  @layer order (reset, primitives, semantic, component, utilities), 2px
  borders, zero-blur solid shadows, lift/press interaction
  (hover: translateY(-2px), active: translate(2px, 2px)),
  shadow color: var(--border-default)
- Link to `Documentation/Refactor/MVP/Architecture/mvp-architecture.md` for
  deep reference

---

### 2. `agent-workflow.md`

Standard operating procedure every agent follows on every ticket. Updated
for our repo structure. (Already exists at
`Documentation/Refactor/Orchestration/agent-workflow.md` — review it and
patch if needed rather than recreating it.)

---

### 3. `dependency-graph.md`

Visual and textual representation of what depends on what. Derive this from
`mvp-architecture.md` and `master-sequence.md` — do not invent dependencies.

Contents:
- Phase dependency chain (which phases gate which, with the Phase 6
  deferral noted)
- File dependency graph (palette.json → emitters → tokens.css →
  foundation.css → components → docs)
- Test dependency chain (what must pass before proceeding to next phase)
- A Mermaid diagram of the full build DAG (phases 0–7, then 8)
- The authored vs. generated file distinction from Architecture Section 9
  (what `npm run build` overwrites vs. what agents author)

---

### 4. `linear-setup.md`

Instructions for creating the Linear project before execution begins.

Contents:
- Project name and team
- 8 milestone issues (Phase 0 through Phase 7, one per phase) with titles,
  descriptions, and acceptance criteria pulled from
  `Documentation/Refactor/how-to-execute.md` and `master-sequence.md`
- A separate milestone for Phase 8 (Launch) — marked as blocked until
  Phase 7 is complete
- Label taxonomy: Bug, Feature, Improvement, Test, Scope, User (the
  standard set already in `/linear-issue` skill)
- How agents create sub-issues under phase milestones as they work
- Status workflow: Backlog → Todo → In Progress → Done / Blocked
- Note: Phase 5 may generate 43 sub-issues (one per component). Recommend
  grouping by batch (A through G, I) rather than individual component
  issues to keep the board manageable

---

### 5. `phase-0-run-prompt.md`

The actual prompt to paste into a Claude Code session to kick off Phase 0.

It should:
- State the working directory and branch (`delightful-refactor`)
- Tell the agent to read `CLAUDE.md` first
- Tell the agent to read
  `Documentation/Refactor/Orchestration/agent-workflow.md`
- Tell the agent to read
  `Documentation/Refactor/MVP/Prompts/phase-0-scaffold.md` and execute it
- Tell the agent to read the Phase 0 section of
  `Documentation/Refactor/how-to-execute.md` for acceptance criteria
- Tell the agent to create a Phase 0 milestone issue in Linear if it
  doesn't exist, and sub-issues for each deliverable
- Tell the agent to create a git worktree (`phase-0/scaffold`) for the work
- End with: "When Phase 0 is complete and all acceptance criteria pass,
  report back. I will provide the Phase 1 run prompt in a fresh session."

---

## Constraints

- All work on `delightful-refactor`. Never merge to or push to main.
- Each phase runs in a fresh Claude Code session (context resets between
  phases). This is by design — phase prompts are self-contained.
- Each phase works in a git worktree branched from `delightful-refactor`.
  Agents commit frequently within their worktree — after each meaningful
  unit of work, not just at the end. Small commits protect against context
  loss.
- **Do not rewrite or duplicate content that already exists.** The phase
  prompts, execution guide, and architecture docs are complete. Reference
  them by path. Your job is the coordination layer that sits above them.
- **Model routing**: Main session (opus) for architecture decisions and
  implementation. Sonnet sub-agents for: `/simplify` review, test
  verification, browser testing, QA checklist review, and Linear ticket
  operations.
- The Orchestration docs plus the existing Refactor docs together must be
  complete enough that a fresh agent with no prior context can execute any
  phase correctly.
