# Frontend - Code Review Guidance

Load this file only when performing a Vue/TypeScript frontend code review for this project.

## What to Look For

### Naming
- Variables, functions, composables, props, emits, stores, and components unclear out of context.
- Names that hide side effects.
- Inconsistent naming across files.

### Unused or Dead Code
- Unused variables, imports, props, refs, computed values, watchers, methods, stores, or types.
- Code introduced but not used.

### Duplicated Logic
- Repeated transformations, validations, mappings, or business rules across modified files.
- Inconsistent implementations of the same logic.

### Vue-Specific
- Unnecessary or duplicated reactive state (`ref`/`reactive`) or duplicated state between component and Pinia store.
- Derived state stored in mutable state instead of `computed`.
- Misuse or overuse of `watch`/`watchEffect` where `computed` or direct bindings are enough.
- Missing cleanup for side effects such as timers, event listeners, subscriptions, or async work in composables/components.
- Direct prop mutation or patterns that break one-way data flow.
- Incorrect use of `v-model` or custom model update events.
- Missing or unstable `:key` in `v-for`, including index or random keys.
- Components mixing too many responsibilities, such as data access plus business rules plus UI.
- In `<script setup lang="ts">`, improper typing for `defineProps`, `defineEmits`, or `defineModel`.

### State Management (Pinia)
- Business rules duplicated between components and stores.
- Direct state mutation outside store actions when the project convention expects actions.
- Missing handling for loading/error/empty store states.
- Stores growing too broad with poor boundaries between domains.

### Routing and Auth
- Route guards missing for protected flows.
- Broken assumptions around `vue-router` params/query typing.
- Navigation side effects scattered across components instead of centralized patterns.
- Okta authentication flows lacking proper failure and token-expiry handling.

### Correctness and Edge Cases
- Null or undefined risks.
- Unsafe assumptions about API data shape.
- Missing loading, empty, or error states.
- Async race conditions, stale results, or updates after unmount.
- Hidden regressions in existing behavior.

### Maintainability and Design
- Large or complex components/composables.
- Deep nesting or hard-to-follow template and script logic.
- Business rules embedded in UI instead of isolated in composables, stores, or utilities.
- Magic values, such as strings or numbers without named constants.
- Hidden coupling between files.

### Type Safety
- Usage of `any`.
- Unsafe casts (`as Foo`).
- Optional values used without checks.
- Inconsistent or weak typing for props, emits, API responses, and store state.

### Performance (Only If Meaningful)
- Unnecessary rerenders from broad reactive dependencies.
- Expensive computations in template/render path instead of memoized `computed`.
- Repeated API calls triggered by watchers/effects without guards or debounce.
- Large lists missing virtualization or pagination when appropriate.

### Testing
- Logic changes without test updates.
- Missing edge case coverage.
- Newly added testable elements missing a `data-testid` attribute required for QA automation; report this as an issue.
- Duplicate `data-testid` values within the same component; report this as an issue.
- Store/composable logic changed without unit/integration test coverage.

### Accessibility / UX
- Incorrect semantics, such as clickable non-interactive elements.
- Missing labels, roles, or aria-* attributes on interactive elements.
- Keyboard navigation/focus issues in dialogs, menus, and forms.
- Poor loading or error feedback.
