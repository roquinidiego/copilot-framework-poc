---
description: 'Turn a PO user story into a structured, ready-to-implement brief'
agent: agent
model: [GPT-5.5, GPT-5.4]
---

# User Story → Implementation Brief

You will receive a user story written by a Product Owner. Analyze it and produce a complete, well-structured implementation brief in Markdown that a separate Copilot Agent session can consume as a clear, actionable task.

## Inputs

**User story:**
${input:userStory:Paste the user story here}

**Extra context (optional — links, dependencies, designs, related tickets):**
${input:extraContext:Leave empty if none}

## Reference specs (load only what applies)

Read root [AGENTS.md](../../AGENTS.md), follow its **Story-to-code spec routing** section, classify the story first, then open only the spec file(s) listed there for the selected scope. Do **not** read every spec file.

## Procedure

### Step 1 — Classify
Decide which of these the story touches: **backend** or **frontend**. 
It can be one or both. Write one short sentence justifying each "yes".

### Step 2 — Read context
Open and read each selected spec file from root `AGENTS.md`. Treat its content as authoritative for architecture, naming, patterns, and conventions. Quote specific conventions in the brief when they constrain a decision.

### Step 3 — Write the brief
Create a new file at `docs/tasks/{YYYY-MM-DD}-{kebab-case-title}.md` using the template below. Fill **every** section. If the story is silent or ambiguous on something, put it under **Open Questions** as a temporary drafting buffer — do **not** invent business rules. Before the plan goes to approval, every item in **Open Questions** must be asked to the user and then either resolved in the brief or explicitly deferred by the user.

### Output template

```markdown
# {Concise title derived from the story}

## Summary
2–4 sentences: what is being built and why, in plain language.

## Scope
- **Backend:** yes / no — short reason
- **Frontend:** yes / no — short reason

## Original User Story
> {Verbatim user story}

{If extra context was provided, include it here under a "Context" subheading.}

## Acceptance Criteria
Given / When / Then. Cover the happy path and every alternative path the story implies.

- **AC1 — {short label}**
  - Given …
  - When …
  - Then …
- **AC2 — …**

## Technical Approach
For each applicable area, describe:
- Affected modules, components, endpoints, or tables (best guess from the relevant spec file)
- New code vs. existing code to modify
- Contracts (request/response shapes, props, events, DB columns) where relevant
- Specific conventions from the relevant spec file that must be respected — cite them

### Backend
…

### Frontend
…

## Implementation Checklist
Ordered, executable steps. Each step is one verifiable change. A developer (or Copilot in agent mode) should be able to follow this top-to-bottom.

- [ ] …
- [ ] …

## Test Cases
Group by layer. Include positive, negative, and edge cases. Each test should map back to at least one AC.

### Unit
- **T1** — {what it asserts} → covers AC1

### Integration / API
- …

### End-to-end / UI
- …

## Edge Cases & Error Handling
- Boundary inputs (empty, max length, invalid format, special chars)
- Auth / permission scenarios
- Concurrency, race conditions, idempotency, retries
- Network or upstream failures, timeouts
- Loading / empty / error UI states (frontend)

## Definition of Done
- [ ] All acceptance criteria pass
- [ ] All test cases above are implemented and green
- [ ] Code follows conventions in the referenced spec file(s)
- [ ] No regressions in adjacent features
- [ ] Logs / telemetry added where the spec file requires it
- [ ] Docs / README updated where applicable

## Open Questions
Temporary drafting buffer for anything ambiguous in the story that the PO needs to clarify. Be specific — frame each as a yes/no or multiple-choice question if possible. Before approval, every item must be asked to the PO and then either resolved in the brief or marked as explicitly deferred by the PO. If nothing remains, write `- None.`
```

## Rules

- **Be specific.** Replace vague phrases like "handle errors properly" with which errors and how.
- **Do not invent business rules.** Anything not in the story goes under **Open Questions** during drafting, then must be asked and resolved or explicitly deferred before approval.
- **Match terminology** to the relevant spec file(s) — don't rename concepts.
- **One brief, no code changes.** Output only the new file at `docs/tasks/...`. Do not modify source code.
- **Language:** write the brief in English, even when the user story is written in another language.