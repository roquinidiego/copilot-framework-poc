# Backend - Code Review Guidance

Load this file only when performing a C#/.NET backend code review for this project.

## What to Look For

### Naming
- Classes, methods, parameters, interfaces unclear out of context.
- Methods named after implementation rather than intent.
- Inconsistent naming across files.

### Unused or Dead Code
- Unused fields, parameters, methods, types, services, or `using` directives.
- Code introduced but not used.

### Duplicated Logic
- Repeated transformations, validations, or business rules across files or layers.
- Inconsistent implementations of the same logic.

### Architecture and Separation of Concerns
- CQRS violations, such as handlers doing work outside their responsibility.
- Domain logic leaking into controllers, infrastructure, or repositories.
- Controllers, services, or repositories with mixed responsibilities.
- Large or god classes.
- Inconsistent use of `Result<T>` versus exceptions for flow control.

### Async Correctness
- `.Result` or `.Wait()` blocking calls.
- Missing `await` causing accidental fire-and-forget behavior.
- Unnecessary `async` when the method only returns a task without awaiting.
- `async void` outside event handlers.
- Missing `ConfigureAwait(false)` in libraries.
- `CancellationToken` not propagated through the call chain.
- Sync-over-async patterns.

### Null Handling
- Possible `NullReferenceException` paths.
- Missing null checks on inputs returned from external sources.
- Misuse or inconsistent use of nullable reference types (`?` annotations).

### Exception Handling
- Swallowed exceptions, such as catch blocks without rethrowing or logging.
- Overly generic `catch (Exception)` without justification.
- Throwing without context, such as no message or no inner exception.
- Missing logging on error paths.
- Exceptions used for control flow.

### Data Access (EF Core / Equivalent)
- N+1 queries caused by missing or excessive `.Include` usage.
- Missing `.AsNoTracking()` on read-only queries.
- `IQueryable` leaking out of repository or data layer boundaries.
- Loading full entities when projecting required fields with `Select(...)` would be enough.
- Over-fetching data, including unused columns or navigation properties.
- Filtering or sorting in memory instead of in SQL.
- Missing pagination (`Skip`/`Take`) for large result sets.
- Mixing includes and projections without a deliberate query strategy.
- Missing `AsSplitQuery()` when multiple includes would cause cartesian explosion.
- Large join graphs that duplicate data across rows.
- Missing `.Include` when navigation properties are accessed later.
- Non-additive migrations, such as drop column or rename, without an explicit plan.

### Dependency Injection
- Incorrect lifetimes (Scoped / Singleton / Transient mismatch, captive dependencies).
- Services doing too much, often visible through over-injected constructors.
- Tight coupling to concrete types instead of abstractions.

### API / Controllers
- Inconsistent or wrong HTTP status codes.
- Missing input validation on endpoints.
- Weak or missing DTOs.
- Exposing domain models directly through the API.
- Missing or inconsistent error response shape, such as ProblemDetails where the project expects it.

### Validation and Business Logic
- Business rules inside controllers instead of services, handlers, or domain objects.
- Missing input validation.
- Duplicated validation logic across layers.

### Configuration and Environment
- Hardcoded values that should come from configuration.
- Missing options pattern (`IOptions<T>`) where appropriate.
- Secrets or environment-specific values committed in code.

### Logging and Observability
- Missing logs in important flows.
- Logging PII, secrets, or other sensitive data.
- Inconsistent logging patterns, such as mixing structured logging with string concatenation.
- Misused log levels, such as Error for non-errors or noisy Info logs.

### Maintainability and Design
- Long methods, deep nesting, or hard-to-follow logic.
- Magic values, such as strings or numbers without named constants.
- Hidden coupling between projects.

### Performance (Only If Meaningful)
- Hot-path allocations, closures, LINQ chains, or boxing.
- Multiple enumeration of `IEnumerable`.
- Inefficient LINQ, such as `.Where` after `.ToList()`.
- Synchronous work blocking async flows.

### Security
- Unvalidated input reaching handlers or DB.
- Missing authorization or authentication checks.
- PII or secrets in logs.
- Hard-coded credentials or connection strings.
- SQL string concatenation instead of parameterized queries.
- Exposure of sensitive data in API responses.

### Testing
- Logic changes without test updates.
- Missing edge case coverage.
- Tests asserting on implementation rather than behavior.
- Tightly coupled code that is hard to test.
