# Frontend Architecture

## Architecture Style

| Aspect | Description |
|---|---|
| Style | Vue 3 SPA with route-level views, reusable components, service-based API access, and Pinia stores. |
| App shell | `main.ts` loads environment, initializes API client, installs plugins, and mounts `App.vue`. |
| UI system | Vega Vue components provide the primary UI building blocks. |
| Routing | Vue Router handles nested app routes and protected navigation. |
| State | Pinia stores hold app/user/dialog state; `StateService` holds legacy reactive layout/breadcrumb state. |
| API access | Services call backend endpoints through shared Axios `apiBase`. |

## Project Roles

| Path | Role |
|---|---|
| `src/Portal/src/main.ts` | Application bootstrap and plugin setup. |
| `src/Portal/src/router` | Routes, auth guard, protected navigation. |
| `src/Portal/src/views` | Route-level pages. |
| `src/Portal/src/components/layout` | Shell layout, header, footer, repository selectors, loading. |
| `src/Portal/src/components/catalog` | Family/product catalog search, filters, tables. |
| `src/Portal/src/components/details` | Product detail and edit/read-only panels. |
| `src/Portal/src/components/dialogs` | Shared dialogs backed by store state. |
| `src/Portal/src/stores` | Pinia stores for user/auth-derived state and dialogs. |
| `src/Portal/src/services` | API services, storage, and legacy UI state service. |
| `src/Portal/src/interfaces` | API response and domain data shapes. |
| `src/Portal/src/utils` | Environment and permission helpers. |

## Dependency Shape

| From | Depends on | Notes |
|---|---|---|
| Components/views | Router, stores, services, interfaces, Vega | UI owns rendering and user interaction. |
| Stores | Services, utilities, Okta | Stores own shared app state and derived permissions. |
| Services | `apiBase`, storage wrappers, interfaces | Services own API calls and persistence boundaries. |
| `apiBase` | Okta auth and runtime env | Adds base URL and bearer token to HTTP calls. |
| Router guard | Okta and user store | Centralizes auth and role checks. |

## UI Flow

| Step | Flow |
|---|---|
| 1 | `main.ts` loads `/env/env.json` fallback config and initializes `apiBase`. |
| 2 | Router guard checks Okta authentication and PCT roles. |
| 3 | Route renders layout/view/component tree. |
| 4 | Components read route/store state and call services for data. |
| 5 | Services call backend APIs through `apiBase`; components render loading, data, empty, or error states. |
| 6 | User interactions update route, Pinia store, `StateService`, local storage, or emit component events. |

## Development Guidance

| Rule | Guidance |
|---|---|
| Keep route concerns central | Add protected routes in router config and auth behavior in `authGuard`. |
| Keep API calls in services | Avoid scattering raw `apiBase` calls across new components unless matching nearby code. |
| Prefer typed data boundaries | Add or update interfaces for API response shapes. |
| Respect Vega events | Use existing `vega-*` event names and custom event details. |
| Handle permissions in one place | Use user store getters and permission utilities. |
| Avoid architecture rewrites | Follow current Pinia/StateService split unless the task is specifically a migration. |