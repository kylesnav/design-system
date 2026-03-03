---
title: "Agent Workflow — Standard Operating Procedure"
type: sop
scope: all-phases
status: active
---

# Agent Workflow — Standard Operating Procedure

Every agent follows this sequence on every ticket, every time. No exceptions. The steps are ordered to catch problems as early as possible and leave the next agent in a better position than you found it.

---

## The Sequence

### 1. Read the ticket

```
/linear-issue KS-XX
```

Read everything: description, checklist, sub-issues, comments (especially handoff notes from the previous agent), and relations (what this ticket blocks, what blocks it). Do not start work until you understand the full scope. If the ticket has no checklist, that's a signal to create one before starting.

### 2. Read the phase prompt and spec files

For this project: read your phase prompt from `Documentation/Refactor/MVP/Prompts/` and the referenced spec files from `Documentation/Refactor/MVP/Specs/`. Do not implement from memory — specs are the source of truth. If a spec and the ticket conflict, the spec wins; flag the discrepancy in a comment.

### 3. Plan

For non-trivial work (anything touching more than 2–3 files, or with architectural decisions), enter plan mode before writing code. Think through:
- What you're building and why
- Which files change
- What breaks if you get it wrong
- Edge cases and error states

For trivial work (a single-file fix, a clearly-scoped addition), skip plan mode and execute directly.

### 4. Execute

Build it. Commit frequently — after each meaningful unit of work, not just at the end. Small commits protect against context loss and make review readable. Commit messages should be imperative and specific: `add button hover state` not `updates`.

### 5. `/simplify`

Run `/simplify` on the code you changed. This triggers a code review pass that looks for redundancy, clarity issues, and deviations from project conventions. Fix what it flags. If you disagree with a flag, leave a comment in the code explaining why — don't silently ignore it.

### 6. Verify

Run the full check sequence:

```bash
npm run build    # Must succeed, no errors
npm test         # All tests pass
npm run lint     # Zero violations
```

All three must pass before closing the ticket. A ticket is not done until the checks pass — "it works on my machine" is not a close condition.

### 7. Browser test (phases that produce HTML)

For Phases 3, 4, 5, and 7: open the affected pages in a browser and verify visually. Check light mode, dark mode, and reduced-motion behavior. Compare against `Documentation/design-reference.html`. Do not skip this step for phases with visual output.

### 8. Check off the ticket

```
/linear-issue check KS-XX all
```

Or check items individually as you complete them:

```
/linear-issue check KS-XX 3
```

Do not close a ticket with unchecked checklist items unless you explicitly leave a comment explaining why an item was skipped or deferred.

### 9. Close the ticket

```
/linear-issue KS-XX status:done
```

Only close when the full check sequence passes and all checklist items are handled.

### 10. Leave a handoff comment on the next ticket

```
/linear-issue comment KS-NEXT "Handoff: <what you built, what the next agent needs to know, any gotchas>"
```

Write this as if you won't be available to answer questions. The next agent has no context about what you just built. A good handoff note covers:
- What was built and where the files are
- Any decisions you made that weren't obvious from the spec
- Known issues you didn't fix (and why)
- What the next agent should watch out for

---

## When Things Go Wrong

### Tests fail

Fix them in the same session. Do not close the ticket until tests pass. If a test failure reveals a problem outside your ticket's scope, create a new bug ticket and link it as blocking before moving on.

### You hit a bug that's not in scope

```
/linear-issue Add bug: <title>
/linear-issue KS-NEW blocks KS-XX
/linear-issue KS-XX status:blocked
```

File the bug, link it as blocking your current ticket, move your ticket to Blocked. Do not absorb out-of-scope bugs into your ticket — scope creep compounds across phases.

### You need a human decision

```
/linear-issue Add [User] <title> — needs decision on <topic>
/linear-issue KS-NEW blocks KS-XX
/linear-issue KS-XX status:blocked
```

Label it **User**, link it as blocking, and stop. Do not guess on architectural decisions. The wrong guess in Phase 2 cascades into Phase 5.

### The spec is ambiguous or wrong

Leave a comment on the ticket documenting the ambiguity, make the most conservative interpretation (the one that changes the least), and flag it in your handoff note. Do not silently interpret your way through ambiguity.

### You run out of context mid-phase

Commit what you have with a clear message (`wip: completed batch A, starting batch B`). Leave a detailed comment on the current ticket explaining exactly where you stopped, what's complete, and what remains. The next session picks up from your commit.

---

## Sub-issues

Create sub-issues for any work that becomes too large to track as checklist items. A Phase 5 batch (8 components) might spawn sub-issues per component — or per batch, if individual issues would clutter the board. Use judgment: a sub-issue is warranted when the work can fail independently of its siblings.

```
/linear-issue sub KS-XX Build button component
```

Sub-issues inherit team and project from the parent. Close them as you go.

---

## Model Routing

Reserve the main Opus session for:
- Architecture decisions
- Complex multi-file implementation
- Phase planning and scope assessment

Dispatch to Sonnet sub-agents for:
- `/simplify` review pass
- Test verification
- Browser testing
- Linear ticket read/update/comment operations

This keeps Opus focused on the hard problems and cuts cost on mechanical steps.

---

## Critical Rules (Apply to Every Phase)

These are the non-negotiable constraints from `master-sequence.md`. If your output violates any of these, fix it before closing the ticket:

| Rule | Detail |
|------|--------|
| No `--primitive-*` in components | Exception: toggle knob only |
| Shadow color is `var(--border-default)` | Not `var(--text-primary)` |
| Component CSS wrapped in `@layer component {}` | No exceptions |
| No hex in `tokens.css` | OKLCH only |
| Borders are 2px | Never 1px |
| Shadows are zero-blur | `4px 4px 0` not `4px 4px 4px` |
| Lift/press values are exact | Hover: `translateY(-2px)`, Active: `translate(2px, 2px)` |
| `prefers-reduced-motion` respected | CSS gate in reset.css; JS behaviors need their own check |
