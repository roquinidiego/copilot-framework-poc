---
description: C#/.NET code review launcher. Use within @code-reviewer; loads project review guidance through AGENTS.md.
agent: ask
---

Review the code in scope (default: `#changes`).

Apply the persona, rules, and output format defined by the active code-reviewer agent.

## Procedure

1. Read root [AGENTS.md](../../AGENTS.md).
2. Follow its **Code review spec routing** section.
3. Load only the backend review spec file listed there for this C#/.NET review scope.
4. Use that review spec as the C#/.NET-specific checklist.
5. Do not load unrelated implementation or review spec files unless the reviewed diff crosses into those areas.

Use the active code-reviewer agent's review mode. Do not edit files unless the user explicitly asks for fixes.

#changes