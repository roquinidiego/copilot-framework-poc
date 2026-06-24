# Backend Developing Rules

## Principles

| Principle | Use it to | Practical rule |
|---|---|---|
| SOLID | Keep code focused and replaceable. | Prefer small classes/methods with one reason to change; depend on abstractions at boundaries. |
| YAGNI | Avoid speculative design. | Build what the story needs now; do not add unused extension points or generic frameworks. |
| KISS | Keep behavior easy to read. | Choose the simplest clear implementation before adding patterns or indirection. |
| DRY | Remove meaningful duplication. | Extract shared code only when duplication represents the same business rule or workflow. |

## Backend Rules

| Rule | Guidance |
|---|---|
| Follow existing structure | Put changes in the owning project/folder and mirror nearby patterns. |
| Keep scope small | Avoid unrelated refactors, formatting churn, or public API changes. |
| Prefer explicit behavior | Make validation, error paths, and side effects visible in code and tests. |
| Use async correctly | Await I/O and propagate `CancellationToken` where the local API supports it. |
| Respect boundaries | Controllers delegate; handlers/services own behavior; repositories own data access. |
| Test changed behavior | Add or update the smallest useful tests for the touched path. |
| Configuration over constants | Put environment-specific values in configuration, not code. |
| Fail clearly | Use existing exception/error handling patterns and meaningful messages. |