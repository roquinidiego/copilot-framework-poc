# Frontend Testing

## Test Locations

| Area | Path | Use for |
|---|---|---|
| Component tests | `src/Portal/src/__tests__/components` | Rendering, props, events, Vega UI behavior. |
| Service tests | `src/Portal/src/__tests__/services` | API URL construction, storage, service behavior. |
| Config | `src/Portal/jest.config.js` | Jest/jsdom transforms, aliases, coverage collection. |
| Vitest config | `src/Portal/vitest.config.ts` | Present but package script currently uses Jest. |

## Test Stack

| Concern | Tooling |
|---|---|
| Runner | Jest via `npm test`. |
| Environment | jsdom. |
| Vue transform | `@vue/vue3-jest`. |
| Component testing | Vue Testing Library and Vue Test Utils. |
| Assertions | Jest and `@testing-library/jest-dom`. |
| UI readiness | `waitForVega` where Vega web components need settling. |
| Coverage | Jest coverage enabled; report written to `src/Portal/coverage`. |

## How To Run

| Scope | Command |
|---|---|
| All frontend tests | `npm test` |
| One test file | `npx jest src/__tests__/path/to/file.spec.ts --coverage` |
| Filter by test name | `npx jest --testNamePattern="name" --coverage` |
| Type check | `npm run type-check` |
| Lint | `npm run lint` |
| Build verification | `npm run build` |

## Choosing Test Level

| Scenario | Preferred test |
|---|---|
| Pure utility logic | Service/utility unit test. |
| API service URL or response handling | Service test with mocked `apiBase`. |
| Component rendering | Vue Testing Library test using visible text and `data-testid`. |
| Vega component interaction | Component test with `waitForVega` and emitted/custom events. |
| Router/auth behavior | Focused router/store test with mocked Okta and user store. |
| Pinia behavior | Store test for state, getters, actions, and failure paths. |

## Creating Test Cases

| Expectation | Guidance |
|---|---|
| Happy path | Cover the main successful user or service behavior for changed code. |
| Edge cases | Test empty, null/undefined, invalid input, disabled states, failed API calls, and permission branches. |
| Regression risk | Add a test that would fail before the fix for bug-prone behavior. |
| Changed-code coverage | Keep coverage for changed code at 80% or higher. |
| Meaningful assertions | Assert user-visible output, emitted events, service calls, or state changes. |

| Step | Guidance |
|---|---|
| Place the file | Mirror source structure under `src/Portal/src/__tests__`. |
| Name the file | Use `<Subject>.spec.ts`. |
| Mock dependencies | Mock `apiBase`, router, Okta, storage, or services at the boundary under test. |
| Render components | Prefer Testing Library for user-visible behavior; use Vue Test Utils when instance/control access is needed. |
| Test ids | Use existing `data-testid`; add stable ids to new testable elements. |
| Async | Await rendering, events, promises, and `waitForVega` when Vega components are involved. |
| Cleanup | Clear mocks/storage between tests when shared state is touched. |

## Coverage Notes

| Concern | Detail |
|---|---|
| Included | `src/**/*.{ts,js,vue}`. |
| Excluded | `main.ts`, `App.vue`, router index, tests, node_modules. |
| Gate | Changed code should stay at or above 80% coverage. |