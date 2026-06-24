# Backend Architecture

## Architecture Style

| Aspect | Description |
|---|---|
| Style | Pragmatic layered backend with CQRS-style commands/queries. |
| Hosts | Two ASP.NET Core HTTP hosts: admin API and integration API. |
| Business flow | Controllers delegate into application services, command handlers, query handlers, repositories, and infrastructure services. |
| Data access | EF Core handles ORM persistence; Dapper handles read/query access. |
| Cross-cutting | Configuration, auth, HTTP clients, resilience, telemetry, and logging live mostly in infrastructure and host extensions. |

## Project Roles

| Project | Role |
|---|---|
| `src/Api` | Internal/admin HTTP host, controllers, middleware, host composition. |
| `src/IntegrationApi` | External versioned HTTP host, controllers, middleware, MuleSoft auth composition. |
| `Application` | Application services, command-side flows, business orchestration. |
| `src/CQRS/Queries` | Query handlers, query-specific mapping and read behavior. |
| `src/CQRS/Shared` | Shared DTOs, entities, events, validation contracts, shared abstractions. |
| `src/Data/Data.ORM` | EF Core DbContext, ORM entities/mapping, database persistence. |
| `src/Data/Data.Dapper` | Dapper query access and Npgsql-based reads. |
| `src/Infrastructure` | Configuration, secret loading, auth clients, integrations, HTTP resilience, telemetry, logging. |

## Dependency Shape

| From | Depends on | Notes |
|---|---|---|
| `Api`, `IntegrationApi` | Application, queries, data, infrastructure | Hosts compose the runtime and expose controllers. |
| `Application` | Shared, Data.ORM | Application code can use domain/shared types and ORM persistence. |
| `Queries` | Application, Data.ORM, Infrastructure, Shared | Query handlers use app services, data, infrastructure, and shared contracts. |
| `Data.ORM` | Shared, Data.Dapper | ORM layer shares domain/contracts and can coordinate query data access. |
| `Data.Dapper` | Shared | Read/query layer depends on shared contracts. |
| `Infrastructure` | Application, Shared | Infrastructure supports app contracts and shared types. |

## Request Flow

| Step | Flow |
|---|---|
| 1 | HTTP request enters `Api` or `IntegrationApi` controller. |
| 2 | Host middleware handles auth, exceptions, current user, request constraints, and telemetry. |
| 3 | Controller delegates to MediatR, application services, or query services. |
| 4 | Handler/service calls repositories, EF Core, Dapper, or infrastructure clients. |
| 5 | Response DTO is mapped and returned through controller/middleware pipeline. |

## Development Guidance

| Rule | Guidance |
|---|---|
| Keep controllers thin | Controllers should route, validate HTTP concerns, and delegate behavior. |
| Put behavior near owner | Commands/application services own writes; query handlers own reads; infrastructure owns external concerns. |
| Follow existing composition | Register dependencies through existing extension methods in the host projects. |
| Respect host differences | `Api` uses Okta auth and applies EF migrations at startup; `IntegrationApi` uses MuleSoft auth and versioned controllers. |
| Do not force purity | Follow current project dependencies; avoid large architecture rewrites for local changes. |