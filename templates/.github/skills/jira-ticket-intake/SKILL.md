---
name: jira-ticket-intake
description: >-
  Use when we need Jira issue keys, Jira ticket URLs, Atlassian story intake,
  read-only Jira context, ticket normalization, or Jira preview confirmation.
---

## Objective
Centralize the shared read-only Jira / Atlassian rules used by custom agents in this workspace. This skill defines the safe intake workflow for turning a Jira ticket into story context without duplicating the same guardrails in multiple agent files.

## Boundaries
- This skill does not grant tools. The calling agent's frontmatter tool list remains authoritative.
- Use only the exact Jira / Atlassian tool IDs exposed by the calling agent.
- This skill is read-only. Never create, edit, delete, transition, assign, link, unlink, comment on, or add worklog to any Jira or Atlassian resource.

## Shared Jira / Atlassian Policy
- If Jira / Atlassian tools are deferred in this client, first use `#tool:tool_search` to load the needed read-only Atlassian tools before calling them.
- Use explicit read-only Atlassian tool IDs allowed by the calling agent, not a broad server wildcard.
- Fetch only the Jira data needed for the current task.
- Allowed Jira actions are strictly read-only operations such as fetching issue details, descriptions, comments, attachments, links, status, assignee, labels, and project metadata.
- Never invoke Jira / Atlassian tools or commands whose names imply mutation, including create, edit, update, delete, transition, assign, comment, add, remove, worklog, link, or unlink.
- If the needed Jira information cannot be obtained with a read-only fetch operation, stop and ask the user to provide the missing data manually.

## Jira Ticket Intake Procedure
Run this procedure before story analysis whenever the user's input contains a Jira issue key, a Jira ticket URL, or wording that asks the agent to use a Jira ticket as the story source.

1. Extract the issue key and, when a URL is present, the Atlassian site hostname.
   - URL example: `https://example.atlassian.net/browse/ABC-123` gives hostname `example.atlassian.net` and issue key `ABC-123`.
   - Key-only example: `ABC-123` gives issue key `ABC-123` and no hostname.
2. Resolve `cloudId` using read-only data only.
   - If a hostname was provided, first use that hostname as `cloudId` for the read-only issue fetch.
   - If only an issue key was provided, call the read-only accessible-resources tool. If exactly one Atlassian resource is available, use it. If multiple resources are available, ask the user which site to use with `#tool:vscode/askQuestions`. If no resource is available, stop and ask the user to paste the ticket contents manually.
3. Fetch the issue with the read-only Jira issue tool. Request these fields when supported: `summary`, `description`, `status`, `issuetype`, `priority`, `assignee`, `reporter`, `labels`, `project`, `comment`, `attachment`, `issuelinks`, `parent`, `subtasks`, and `created`.
   - If the issue type is a defect, bug, or incident, treat Jira `fields.description` as the primary source for the defect narrative and reproduction details unless the ticket clearly uses another field for that content.
   - In Jira UIs, a section labeled `Key Details` may simply render the standard `description` field. Do not assume `Key Details` is a separate custom field unless field metadata explicitly shows a dedicated field with that name.
4. If comments, attachments, or linked issue details are not included in the issue response, fetch only the missing read-only details that are necessary to understand the story. Do not mutate the issue.
5. If the issue response is inaccessible, empty, or missing the story or acceptance criteria, ask the user to provide the missing ticket text manually. Do not continue with assumptions.
6. Build a normalized story input before planning or analysis with:
   - Jira key and URL or site, when available.
   - Summary.
   - Description.
   - For defect-like issue types, the reproduction steps, expected result, actual result, and error details found in `description` before looking for secondary sources.
   - Acceptance criteria found in the description, custom fields, or comments.
   - Relevant comments and linked-ticket context.
   - Explicitly missing information.
7. Print a concise "Jira Ticket Preview" before proceeding. Include the key, URL or site, summary, status, assignee, acceptance-criteria highlights, and explicitly missing information.
8. Immediately after printing the preview, ask for explicit confirmation with `#tool:vscode/askQuestions` before continuing.
   - Question: `Is this the correct Jira ticket to use for this story?`
   - Options: `Yes, use this ticket`, `No, I will provide another ticket`, `No, use the text I pasted instead`, plus an `Other / explain` free-text option.
9. If the user does not confirm the ticket, stop Jira-based intake and resolve the new input first. Do not continue story analysis until the story source is confirmed.
10. Treat the confirmed normalized Jira content as the raw story input. When the agent writes a planning brief, include the ticket key or URL and the fetched Jira content under `Original User Story` and `Context` so the plan remains auditable.

## Usage Guidance By Agent Type
- Story-orchestrator agents should run the full intake procedure whenever Jira is the story source.
- Implementation agents should follow the shared read-only policy and use only the subset of the intake procedure needed to fetch supplemental Jira context already justified by the approved brief or current task.
- If a shared Jira rule appears to conflict with agent-local execution rules, keep the agent-local phase or workflow rule and update the skill or agent so the boundary is explicit.