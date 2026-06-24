# Agent Project Instructions

This file is the project-level routing index for reusable agents and prompts. Keep reusable workflow logic in `.github/agents/` and `.github/prompts/`; keep project-specific implementation guidance under `spec/`.

## Project Goal

Read `spec/project.md` only when project/domain context is needed. Keep detailed project-specific implementation and review guidance under `spec/`.

## Story-to-code spec routing

For story-to-code planning and implementation:

1. Classify the story scope first: backend, frontend, or both.
2. Read only the spec files for the selected scope:

   | Scope | Spec file | What it defines |
   |---|---|---|
   | Backend | `spec/backend/instructions.md` | Backend architecture, project/module layout, naming conventions, commands, test frameworks, data/migration guidance, API conventions, and local backend patterns. |
   | Frontend | `spec/frontend/instructions.md` | Frontend architecture, project/module layout, naming conventions, commands, test frameworks, UI/component patterns, routing, state management, and local frontend patterns. |

3. Treat the selected spec files as authoritative for architecture, naming, project/module layout, commands, test frameworks, and local conventions.
4. Cite the selected spec files in generated briefs under **Conventions to honor**.
5. Downstream projects should customize `spec/<area>/instructions.md` files instead of editing reusable custom agents or prompts.

## Code review spec routing

For code reviews:

1. Classify the review scope first: backend, frontend, or both.
2. Read only the review spec files for the selected scope:

   | Scope | Review spec file | What it defines |
   |---|---|---|
   | Backend | `spec/backend/review.md` | Backend code review guidance for architecture, async, data access, APIs, configuration, observability, security, and tests. |
   | Frontend | `spec/frontend/review.md` | Frontend code review guidance for Vue, Pinia, routing/auth, type safety, testing, accessibility, and UX. |

3. Load review spec files only when performing a code review for that area.
4. Project conventions come from the selected implementation spec files and review spec files under `spec/`.
