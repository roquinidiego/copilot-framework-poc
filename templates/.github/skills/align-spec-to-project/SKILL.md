---
name: align-spec-to-project
description: >-
  Use when project spec or documentation files describe a different/foreign project, point to
  another repository, or have drifted from the real code. Triggers: "align specs", "specs point
  to another project", "sync spec folder", "realign spec to project", "update docs to match the
  codebase", "the spec is from a different repo". Scans the actual codebase and updates existing
  spec/doc and routing/index files so their facts match reality. Reusable across any tech stack.
---

## Objective

Bring a repository's **spec / documentation files** back in sync with the **actual code** in that
same repository. Use this when the docs were copied or generated from a different project and still
reference foreign names, paths, modules, commands, frameworks, or test layouts.

This skill is a **procedure**, not project knowledge. It must work for any language, framework, or
repository layout. Discover every concrete fact from the code at run time. Do not assume any
particular stack, folder name, build tool, or command.

## Boundaries

- **Update-only by default.** Edit files that already exist. Never create or scaffold a missing
  spec/doc file. When an expected file is missing, report the gap instead of generating one.
- **Deletion only for absent areas, only with consent.** The single exception to update-only: when
  an entire documented area (for example a backend or a frontend spec section) describes code that
  does not exist anywhere in the repository, you may delete that area's spec folder/files — but only
  after the user explicitly approves it for that specific area (see step 3a). Never delete anything
  else, and never delete without a clear yes.
- **Preserve shape.** Keep each target file's existing structure, headings, ordering, table
  formatting, voice, and level of detail. Change only the project-specific facts inside it.
- **Evidence-based.** Every fact you write into a doc must be discovered in the code. Never invent
  paths, module names, commands, versions, or stacks. If something cannot be verified, leave the
  existing text and flag it as unverified rather than guessing.
- **Do not touch agent customization internals.** Never modify files that define agents, prompts,
  or other skills (for example, anything under an agent/prompt/skill customization directory),
  except routing/index docs explicitly identified in step 4. When in doubt, ask.
- **One confirmation gate.** Present the full plan once, get approval, then apply all edits. Do not
  edit incrementally before approval and do not ask for per-file approval after it.

## Procedure

### Step 1 — Inventory the documentation

1. Locate the spec/documentation set the user wants aligned. Look for a docs or spec directory and
   any routing/index document that points into it. If the target set is ambiguous, ask the user
   which directory/files to align before continuing.
2. For each existing doc file, extract every **concrete, project-specific claim** it makes, such as:
   - Project / solution / package / module names.
   - Directory and file paths, and entry points.
   - Build, run, lint, and test commands.
   - Tech stack: languages, frameworks, libraries, datastores, auth, observability, versions.
   - Test layout: test projects/suites, frameworks, how tests are run.
   - Architecture claims: layers/modules, their roles, and dependency direction.
   - Cross-references between docs and any routing/index file.
3. Record these claims as a checklist of "asserted facts" to verify. Do not edit anything yet.

### Step 2 — Discover the real structure (stack-agnostic)

Use language-agnostic search and file reading to establish ground truth. Do not assume a stack;
detect it from what is actually present.

1. **Top-level manifests / build descriptors.** Find the files that define the build or workspace
   (solution/workspace files, package or project manifests, build scripts, container/orchestration
   files). Their names reveal the real project/solution/package names.
2. **Source modules.** Map the real source directories and the role of each (entry points,
   application/domain/infrastructure layers, UI app root, services, etc.) based on what the code
   actually contains, not on what the docs claim.
3. **Commands / scripts.** Read the real scripts from the manifests (package scripts, build targets,
   task runners) to capture the actual build, run, lint, and test commands.
4. **Test layout.** Find the real test projects/suites, the test framework(s) in use, and how they
   are executed.
5. **Tech stack.** Derive languages, frameworks, libraries, datastores, auth, and observability
   from dependency manifests and entry-point/bootstrap files — not from the docs.
6. **Entry points & flow.** Open the real entry/bootstrap files to confirm how the app starts,
   routes, and wires dependencies, so architecture/flow docs can be corrected accurately.

Prefer fast workspace search and manifest reads over deep guessing. Read entry-point and manifest
files directly; sample representative source files where a doc makes a specific architectural claim.

### Step 3 — Detect drift

Compare each asserted fact from Step 1 against the discovered reality from Step 2. Produce a concise
**drift list**: for every mismatch, capture the file, the current (wrong) text, and the corrected
fact with its source of truth (the real file/manifest you found it in). Note any asserted fact that
could not be verified, and any expected-but-missing doc file (for an update-only gap report).

### Step 3a — Detect documented areas that do not exist in the code

Some repositories only have part of what the docs describe (for example, a backend with no frontend,
or a frontend with no backend). For each major area the spec set documents as its own section/folder:

1. Decide whether that area exists in the actual code, using the discovery from Step 2 (its source
   modules, manifests, entry points, and tests). Base this on real evidence, not on the doc's claim.
2. If an area's spec exists but the corresponding code is **entirely absent** (not merely renamed or
   moved), mark that area's spec folder/files as a **deletion candidate**. Do not delete yet.
3. Distinguish "absent" from "drifted": if the code exists under different names/paths, it is drift
   (fix it in steps 3–5), not a deletion candidate. Only a truly missing area becomes a candidate.
4. Carry each deletion candidate into the Step 5 confirmation so the user can decide per area.

### Step 4 — Reconcile routing / index docs

If any routing or index document references the spec/doc files (for example, a top-level project
guide or index that lists where each topic lives):

- Verify every referenced doc path still exists and still describes what the index claims.
- Update only the parts that drifted: stale paths, renamed docs, project-goal/overview wording, or
  routing tables that no longer match reality.
- If the user approves deleting an absent area (step 3a / step 5), also remove that area's entries
  from routing/index docs in the same pass, so no index points to deleted files.
- Keep its structure and routing intent intact. Do not restructure it.

Treat such a routing/index doc as in-scope **only** when it is a documentation/routing file, not an
agent/prompt/skill customization file.

### Step 5 — Confirm once, then apply

1. Present the user a single summary: the drift list (proposed change per file), any unverified
   items, any missing-file gaps you will not fill (update-only), and any **deletion candidates**
   from step 3a (areas whose code is entirely absent). Use a structured prompt so the user can
   approve, adjust scope, or cancel.
2. For each deletion candidate, ask a separate, explicit yes/no question naming the exact folder/
   files to be deleted and the area they cover (for example, "No backend code was found. Delete the
   backend spec folder?"). Offer at least: delete it, keep it as-is, or decide later. Only treat a
   clear affirmative as approval to delete.
3. On approval, apply **all** edits in place:
   - Replace only the drifted facts; keep surrounding structure, headings, tables, and tone.
   - Match each file's existing formatting conventions (same table columns, same heading depth).
   - Do not add new sections, remove sections, or reformat beyond what a fact correction requires.
   - Do not write any fact that was not verified against the code in Step 2.
   - For each area the user approved for deletion, delete that area's spec folder/files and remove
     its references from routing/index docs (step 4). Skip deletion for any area the user kept.
4. If the user declined a portion, apply only the approved subset. Never delete an area the user did
   not explicitly approve.

### Step 6 — Report

Summarize what changed:
- Files updated, with a short per-file note of which facts were corrected.
- Areas deleted because their code was absent and the user approved removal, plus the routing/index
  references cleaned up. List deletion candidates the user kept, too.
- Asserted facts that were already correct (no change).
- Unverified items left as-is and why.
- Missing expected files reported but not created (update-only).
- Confirmation that no agent/prompt/skill customization files were modified.

## Guardrails recap

- Generic and reusable: never hardcode a specific project, path, language, framework, or command.
- Update existing docs only; never scaffold missing ones.
- Delete a spec area only when its code is entirely absent and the user explicitly approved that
  specific deletion; otherwise never delete.
- Every written fact must trace to real code discovered in this run.
- Preserve each document's existing structure and voice.
- One approval gate before writing; apply all approved edits together.
- Never modify agent/prompt/skill customization files; limit routing edits to documentation/index docs.
