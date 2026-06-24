---
applyTo: "**/*.{cs}"
---

# Backend Instructions

## References

Load these files only when they are useful for the current task. They can be loaded on demand during any backend task.

| Topic | File | Summary |
|---|---|---|
| Testing | [topics/testing.md](topics/testing.md) | How to run backend tests and create test cases. |
| Developing rules | [topics/developing-rules.md](topics/developing-rules.md) | Common coding principles and backend development rules. |
| Architecture | [topics/architecture.md](topics/architecture.md) | Backend project roles, dependency shape, and request flow. |

## Overview

Multi-project .NET backend for the Product Configuration Tool.

| Area | Path | Summary |
|---|---|---|
| Main solution | `ProductTool.sln` | Backend solution and test projects. |
| Admin API | `src/Api` | Internal product/platform/admin HTTP API. |
| Integration API | `src/IntegrationApi` | External versioned product/config HTTP API. |
| Application | `Application` | Application services and command flows. |
| CQRS | `src/CQRS/Queries`, `src/CQRS/Shared` | Queries, shared DTOs, domain types, and events. |
| ORM data | `src/Data/Data.ORM` | EF Core PostgreSQL persistence. |
| Query data | `src/Data/Data.Dapper` | Dapper/Npgsql read access. |
| Infrastructure | `src/Infrastructure` | Config, auth, integrations, resilience, telemetry, logging. |
| DB support | `ProductTool.PostgreSQL` | Database/changelog support executable; not an HTTP host. |

## Tech Stack

| Concern | Stack |
|---|---|
| Runtime | .NET 10, nullable enabled, implicit usings. |
| Web API | ASP.NET Core controllers and middleware. |
| OpenAPI | Swashbuckle/Swagger. |
| Versioning | ASP.NET API versioning in `IntegrationApi`. |
| Persistence | EF Core + Npgsql/PostgreSQL. |
| Read access | Dapper + Npgsql. |
| CQRS | MediatR. |
| Validation | FluentValidation. |
| Mapping | Mapster/MapsterMapper. |
| Auth | Okta JWT for `Api`; MuleSoft auth for `IntegrationApi`. |
| Integrations | `HttpClient`, Polly, MuleSoft/PCT clients, AnyPoint MQ. |
| Configuration | appsettings, user secrets, env vars, Google Secret Manager. |
| Observability | Serilog, OpenTelemetry, Datadog. |
| Tests | xUnit, Moq, FluentAssertions. |

## Commands

Run commands from the repository root unless a task says otherwise.

| Task | Command |
|---|---|
| Restore packages | `dotnet restore ProductTool.sln` |
| Build solution | `dotnet build ProductTool.sln` |
| Build admin API | `dotnet build src/Api/Api.csproj` |
| Build integration API | `dotnet build src/IntegrationApi/IntegrationApi.csproj` |
| Run all tests | `dotnet test ProductTool.sln` |
| Run API unit tests | `dotnet test tests/Api.UnitTests/Api.UnitTests.csproj` |
| Run command unit tests | `dotnet test tests/Commands.UnitTests/Commands.UnitTests.csproj` |
| Run query unit tests | `dotnet test tests/Query.UnitTests/Queries.UnitTests.csproj` |
| Run one test/class | `dotnet test ProductTool.sln --filter "FullyQualifiedName~ClassOrMethodName"` |
| Run tests with coverage | `dotnet test ProductTool.sln --collect:"XPlat Code Coverage"` |

## Entry Points

| Entry point | Purpose |
|---|---|
| `src/Api/Program.cs` | Starts admin API; registers config, data, MediatR, auth, Swagger, telemetry, middleware, controllers; applies EF migrations. |
| `src/Api/Controllers` | Admin routes for products, platforms, families, users, boarding contracts, health. |
| `src/IntegrationApi/Program.cs` | Starts integration API; registers config, data, MediatR, MuleSoft auth/clients, versioned Swagger, telemetry, middleware, controllers. |
| `src/IntegrationApi/Controllers/v1` | v1 integration routes for products/configs/health. |
| `src/IntegrationApi/Controllers/v2` | v2 integration routes for products/configs/health. |
