# Orchestration Planning Prompt

Copy everything below the line into a Claude Code session in plan mode at `~/Desktop/Workflow/Github/delightful-design-system`.

---

Build the orchestration layer for the Delightful Design System rebuild. Read all files in Documentation/ (Architecture docs, Specs/, and Prompts/) to understand the full system, then produce a Documentation/Orchestration/ folder containing everything needed to execute the rebuild.

## What to Produce

### 1. `phase-playbook.md`
One section per phase (0–8). Each section contains:
- **Goal**: One sentence
- **Input**: What files/artifacts must exist before this phase starts
- **Spec files**: Which docs from Documentation/Specs/ this phase implements
- **Deliverables**: Exact files the agent produces (paths relative to repo root)
- **Acceptance criteria**: Concrete checks (file exists, test passes, token count matches, etc.)
- **Review checklist**: What the human reviews before greenlighting the next phase
- **Estimated sub-issues**: Likely ticket breakdown (not prescriptive — agents refine as they go)

### 2. `agent-workflow.md`
The standard operating procedure every agent follows on every ticket:
1. `/linear-issue read KS-XX` — read ticket, comments, and checklist
2. Plan the implementation (use plan mode for non-trivial work)
3. Execute the work
4. `/simplify` — review changed code for reuse and quality
5. Self-review: run tests, verify acceptance criteria from phase-playbook.md
6. Browser test if the phase produces HTML (Phases 6–7)
7. `/linear-issue check KS-XX all` — mark checklist items done
8. `/linear-issue KS-XX status:done` — close the ticket
9. `/linear-issue comment KS-NEXT "Handoff: <context for next agent>"` — prime the next ticket
10. File any bugs, scope creep, or test gaps as new issues via `/linear-issue`

Include: what to do when blocked, how to handle test failures, when to create bug tickets vs fix inline. Also specify which steps run as sonnet sub-agents vs in the main opus session (see model routing constraint below).

### 3. `linear-setup.md`
Instructions for creating the Linear project:
- Project name, team
- 9 milestone issues (Phase 0–8) with titles, descriptions, and acceptance criteria pulled from phase-playbook.md
- Label taxonomy (Bug, Feature, Improvement, Test, Scope, User — already in /linear-issue skill)
- How agents create sub-issues under milestones as they work
- Status workflow: Backlog → Todo → In Progress → Done / Blocked

### 4. `dependency-graph.md`
Visual and textual representation of what depends on what:
- Phase dependencies (which phases gate which)
- File dependencies (tokens.css → foundation.css → components → docs)
- Test dependencies (what must pass before proceeding)
- A mermaid diagram of the full build DAG

### 5. `run-prompt.md`
The actual prompt to paste into a Claude Code session to kick off Phase 0. It should:
- Reference the orchestration docs and specs by path
- Tell the agent to read phase-playbook.md Phase 0 section
- Tell the agent to follow agent-workflow.md
- Tell the agent to create the Phase 0 milestone issue in Linear if it doesn't exist
- Tell the agent to create sub-issues for each deliverable
- Include the repo path, branch (`delightful-refactor`), and working conventions
- End with: "When Phase 0 is complete and reviewed, I will provide the Phase 1 run prompt." (Each phase gets a fresh session to avoid context exhaustion.)

### 6. `CLAUDE.md`
A repo-level CLAUDE.md for the `delightful-refactor` branch. **Must be under 100 lines.** This is what every fresh agent session reads first — it should orient, not explain. Link to deeper docs instead of duplicating their content.

Contents:
- Repo purpose (one line: Delightful Design System v1.0 rebuild)
- Branch rule: `delightful-refactor` only — never merge to or push to main
- Directory layout (compact table: path → purpose)
- Phase workflow: "Read `Documentation/Orchestration/phase-playbook.md` for your current phase"
- Agent SOP: "Follow `Documentation/Orchestration/agent-workflow.md` for every ticket"
- Ticket ops: "Use `/linear-issue` for all Linear operations"
- Model routing: opus for implementation, sonnet sub-agents for review/validation
- Git workflow: worktree per phase, frequent commits, merge to `delightful-refactor` on review approval
- Key conventions (compact list): OKLCH color space, 3-tier tokens (primitives → semantic → component), cascade layers, 2px borders, zero-blur shadows, lift/press interaction pattern
- Deep reference links to Core Concepts and Rebuild Plan

Keep it terse. A fresh agent should know where to go, not have everything repeated inline. This file goes at the repo root.

## Constraints
- **All work happens on the `delightful-refactor` branch. Never merge to or push to main.** Main preserves the beta codebase. The refactor branch will be merged only when the full rebuild is complete and reviewed.
- **Each phase works in a git worktree** branched from `delightful-refactor`. The agent creates a worktree, does all phase work there, commits with clear messages, then merges back to `delightful-refactor` when the phase passes review. This gives each phase a clean branch history (e.g., `phase-0/scaffold`, `phase-1/color-data`, etc.) and a clear merge commit trail on `delightful-refactor`. Agents should commit frequently throughout their worktree — after each meaningful unit of work, not just at the end. Small, regular commits protect against context loss and make review easier.
- Sequential execution: each phase completes and gets human review before the next starts
- Every phase runs in a fresh Claude Code session (context resets between phases)
- Agents use /linear-issue for all ticket operations
- **Model routing for cost efficiency:** The main session runs Opus 4.6 for planning and implementation. Review and validation steps should be dispatched as **Sonnet 4.6 sub-agents** (use `model: "sonnet"` on the Agent tool). Specifically: `/simplify` review, test verification, browser testing, and ticket read/update operations should all run as sonnet sub-agents. Reserve opus for architecture decisions, complex implementation, and phase planning.
- The orchestration docs ARE the build spec — they must be complete enough that a fresh agent with no prior context can execute any phase
- Read the Rebuild Plan carefully — your phases must align with its phases exactly
- Read the Specs carefully — your deliverables must map 1:1 to what the specs describe
