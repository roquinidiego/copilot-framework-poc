---
applyTo: "src/Portal/src/**/*.{ts,vue}"
---

# Frontend Instructions

## References

Load these files only when they are useful for the current task. They can be loaded on demand during any frontend task.

| Topic | File | Summary |
|---|---|---|
| Testing | [topics/testing.md](topics/testing.md) | How to run frontend tests and create test cases. |
| Developing rules | [topics/developing-rules.md](topics/developing-rules.md) | Common coding principles and frontend development rules. |
| Architecture | [topics/architecture.md](topics/architecture.md) | Frontend project roles, dependency shape, and UI flow. |

## Overview

Vue 3/Vite frontend for the Product Configuration Tool portal.

| Area | Path | Summary |
|---|---|---|
| App root | `src/Portal` | Vite app, package scripts, config, tests. |
| Source | `src/Portal/src` | Vue app source. |
| Entry | `src/Portal/src/main.ts` | Creates app, loads env, configures API client, installs plugins. |
| Router | `src/Portal/src/router` | Vue Router routes and Okta/PCT role guard. |
| Components | `src/Portal/src/components` | Vega-based layouts, catalog, detail, dialog, button components. |
| Views | `src/Portal/src/views` | Route-level pages. |
| State | `src/Portal/src/stores`, `src/Portal/src/services/StateService.ts` | Pinia stores plus legacy reactive state service. |
| Services | `src/Portal/src/services`, `src/Portal/src/apiBase.ts` | Axios API access, storage, family/SKU/user services. |
| Types | `src/Portal/src/interfaces`, `src/Portal/src/types` | API/domain interfaces and global types. |
| Tests | `src/Portal/src/__tests__` | Jest unit/component tests. |

## Tech Stack

| Concern | Stack |
|---|---|
| Runtime/build | Vue 3, TypeScript, Vite. |
| UI library | Heartland Vega and Vega Vue. |
| Routing | Vue Router 4. |
| State | Pinia plus existing reactive services. |
| Auth | Okta Vue/Auth JS. |
| HTTP | Axios via shared `apiBase`; axios-retry is installed. |
| Events | mitt event bus. |
| Testing | Jest, jsdom, Vue Testing Library, Vue Test Utils, jest-dom. |
| Type check | `vue-tsc`. |
| Lint | ESLint with Vue/TypeScript config. |

## Commands

Run commands from `src/Portal` unless a task says otherwise.

| Task | Command |
|---|---|
| Install packages | `npm install` |
| Start dev server | `npm run dev` |
| Start localdev mode | `npm run localdev` |
| Build app | `npm run build` |
| Build GCP mode | `npm run build:gcp` |
| Build only | `npm run build-only` |
| Type check | `npm run type-check` |
| Lint and fix | `npm run lint` |
| Run tests with coverage | `npm test` |
| Preview build | `npm run preview` |

## Entry Points

| Entry point | Purpose |
|---|---|
| `src/Portal/src/main.ts` | Loads runtime env, initializes Axios base client, installs Vega, Pinia, router, Okta, mounts app. |
| `src/Portal/src/App.vue` | Root component; renders `RouterView`. |
| `src/Portal/src/router/index.ts` | Defines protected app routes, nested software catalog routes, login callback, unauthorized, not found. |
| `src/Portal/src/router/authGuard.ts` | Enforces Okta auth and PCT role access. |
| `src/Portal/src/apiBase.ts` | Shared Axios instance with base URL and bearer token interceptor. |
| `src/Portal/src/stores/user.ts` | User, roles, permissions, and role refresh state. |

