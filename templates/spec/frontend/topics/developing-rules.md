# Frontend Developing Rules

## Principles

| Principle | Use it to | Practical rule |
|---|---|---|
| SOLID | Keep modules focused and replaceable. | Split UI, state, services, and utilities by responsibility. |
| YAGNI | Avoid speculative UI and abstractions. | Build only the flow, state, and components the task needs. |
| KISS | Keep components understandable. | Prefer simple props, emits, computed values, and small helper functions. |
| DRY | Remove meaningful duplication. | Extract shared logic only when it represents the same behavior or rule. |

## Frontend Rules

| Rule | Guidance |
|---|---|
| Follow existing structure | Place code under the matching component, view, service, store, interface, or test folder. |
| Prefer Vega components | Use `@heartlandone/vega-vue` patterns already present before custom controls. |
| Keep components focused | Move API calls to services and reusable state to Pinia/composables/services. |
| Use derived state | Prefer `computed` for values derived from props, route, or store state. |
| Handle async states | Cover loading, empty, error, and stale response cases when fetching data. |
| Keep auth central | Respect router/auth guard and user store permission helpers. |
| Type API data | Use interfaces from `interfaces`; avoid `any` unless matching existing unavoidable interop. |
| Add test ids | Add stable `data-testid` values for new testable UI elements. |
| Avoid broad churn | Do not reformat unrelated Vue files or migrate Options/Composition API style unless needed. |
| Test changed behavior | Add or update the smallest useful tests for the touched path. |