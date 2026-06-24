# Backend Testing

## Test Projects

| Project | Use for | Notes |
|---|---|---|
| `tests/Api.UnitTests` | API middleware, extensions, controllers, API models. | References `src/Api`. |
| `tests/Commands.UnitTests` | Application commands, handlers, validators, services. | References `Application`. |
| `tests/Query.UnitTests` | Query handlers, validators, repositories, mappers, extensions. | References `src/CQRS/Queries`. |
| `tests/Domain.UnitTests` | Domain entities and shared domain behavior. | References `src/CQRS/Shared`. |
| `tests/Infrastructure.UnitTests` | Infrastructure auth, services, metrics, HTTP/config behavior. | References `src/Infrastructure`, `Application`, queries. |
| `tests/IntegrationTests/ProductTool.IntegrationTests` | API + database integration coverage. | Uses `WebApplicationFactory<Program>` and a local SQL Server test DB. |

## Test Stack

| Concern | Tooling |
|---|---|
| Test framework | xUnit with `Microsoft.NET.Test.Sdk`. |
| Assertions | FluentAssertions and xUnit assertions; prefer the local file's style. |
| Mocking | Moq for dependencies, loggers, repositories, delegates, clients. |
| Data generation | Bogus and local builders where already present. |
| In-memory data | EF Core InMemory in selected unit projects. |
| Integration host | `Microsoft.AspNetCore.Mvc.Testing` / `WebApplicationFactory<Program>`. |
| Coverage | coverlet collector via `--collect:"XPlat Code Coverage"`. |

## How To Run

| Scope | Command |
|---|---|
| All solution tests | `dotnet test ProductTool.sln` |
| API unit tests | `dotnet test tests/Api.UnitTests/Api.UnitTests.csproj` |
| Command unit tests | `dotnet test tests/Commands.UnitTests/Commands.UnitTests.csproj` |
| Query unit tests | `dotnet test tests/Query.UnitTests/Queries.UnitTests.csproj` |
| Domain unit tests | `dotnet test tests/Domain.UnitTests/Domain.UnitTests.csproj` |
| Infrastructure unit tests | `dotnet test tests/Infrastructure.UnitTests/Infrastructure.UnitTests.csproj` |
| Integration tests | `dotnet test tests/IntegrationTests/ProductTool.IntegrationTests/ProductTool.IntegrationTests.csproj` |
| Filtered test run | `dotnet test ProductTool.sln --filter "FullyQualifiedName~ClassOrMethodName"` |
| Coverage run | `dotnet test ProductTool.sln --collect:"XPlat Code Coverage"` |

## Choosing Test Level

| Scenario | Preferred test |
|---|---|
| Pure entity/rule behavior | Domain unit test. |
| Validator behavior | Unit test every valid path and important failure message. |
| Handler/service branching | Unit test with mocked repositories/services and explicit interaction checks. |
| Middleware/extension behavior | API or infrastructure unit test with framework test objects/mocks. |
| Query/repository mapping logic | Query unit test; use existing fake data/builders. |
| API contract plus database behavior | Integration test. |

## Creating Test Cases

| Expectation | Guidance |
|---|---|
| Happy path | Cover the main successful behavior for changed code. |
| Edge cases | Identify and test important boundaries, null/empty input, missing data, invalid state, and exception paths. |
| Changed-code coverage | Keep coverage for changed code at 80% or higher. |
| Meaningful assertions | Assert business-visible outcomes, not implementation details. |

| Step | Guidance |
|---|---|
| Place the file | Mirror the production folder under the matching `tests/*` project. |
| Name the class | Use `<Subject>Tests`. |
| Name the method | Use clear behavior names, usually `Method_ShouldExpected_WhenCondition` or the existing local style. |
| Structure | Prefer Arrange, Act, Assert for non-trivial tests. |
| Assertions | Assert observable results first; verify mock interactions only when interaction is part of behavior. |
| Data | Keep inputs minimal; use builders/Bogus only when hand-built data obscures intent. |
| Async | Await the system under test and use `Assert.ThrowsAsync` for async exceptions. |
| Logging | Verify logs only when logging is meaningful behavior or error handling. |
| EF InMemory | Use for unit-level persistence behavior, not SQL/provider-specific guarantees. |
| Integration cleanup | Reuse the fixture/reset pattern; do not leave test data behind. |

## Integration Test Notes

| Concern | Detail |
|---|---|
| Host | Tests create an in-memory API host with `WebApplicationFactory<Program>`. |
| Environment | The base test host uses the `Test` environment. |
| Database | Fixture creates `ProductToolTestDB` on local SQL Server Express. |
| Reset | `Helpers/reset-database.sql` runs after each base integration test. |
| Config | Check local test configuration before running; the base loads `appsettings.test.json` if available. |
