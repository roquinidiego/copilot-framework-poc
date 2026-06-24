# Project Overview

## Project Goal

**CoreBoarding Product Configuration Tool** manages product and platform configuration data with a multi-tier backend (API + Integration API) and a Vue 3 portal frontend.

It provides APIs for internal/admin clients and integration clients, leveraging a layered CQRS architecture with PostgreSQL persistence, async domain events, and OpenTelemetry observability.

## Primary Capabilities

- Manage product and platform configuration data.
- Serve internal/admin clients through the main API host.
- Serve external integration clients through the versioned Integration API host.
- Provide a Vue 3 portal frontend for product configuration workflows.
- Persist configuration data in PostgreSQL.
- Publish integration side effects through async domain events.
- Emit observability data through OpenTelemetry and Datadog integration.
