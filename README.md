# coreboardingservices-copilot

Distributes shared Copilot **agents, prompts, skills**, and **`spec/` conventions** (plus the root `AGENTS.md` routing index) into consumer repositories, with versioned updates.

- `.github/agents`, `.github/prompts`, `.github/skills`, `AGENTS.md` are **managed** — kept up to date on every sync.
- `spec/**` is **protected** — created only if missing, so your local customizations are never overwritten.

## Install

### 1. Authenticate with GitHub Packages

Add a `.npmrc` file to your project root (or to `~/.npmrc` globally):

```
@globalpayments-internal:registry=https://npm.pkg.github.com
//npm.pkg.github.com/:_authToken=${GITHUB_TOKEN}
```

Set `GITHUB_TOKEN` to a GitHub Personal Access Token with at least `read:packages` scope.

### 2. Install the package

```bash
npm install -D @globalpayments-internal/coreboardingservices-copilot
```

## Usage

Run from the root of the consumer repository:

```bash
# Copy managed files + create missing spec files
npx coreboardingservices-copilot sync

# Preview without writing anything
npx coreboardingservices-copilot sync --dry-run

# Also overwrite protected spec files
npx coreboardingservices-copilot sync --force

# Read-only drift report (exit code 1 if out of date) — good for CI
npx coreboardingservices-copilot check
```

### Options

| Option | Applies to | Description |
|---|---|---|
| `--dir <path>` | sync, check | Target directory (default: current working directory). |
| `--dry-run` | sync | Print the plan; write nothing. |
| `--force` | sync | Overwrite protected `spec/**` files too. |
| `--yes`, `-y` | sync | Skip confirmation prompts (reserved; sync is non-interactive). |
| `--version`, `-v` | — | Print the package version. |

## Override policy

Defined in [`policy.json`](policy.json):

| Class | Paths | Behavior |
|---|---|---|
| managed | `.github/agents/**`, `.github/prompts/**`, `.github/skills/**`, `AGENTS.md` | Created if missing; updated when the package version ships changes. Local edits are overwritten (reported as drift). |
| protected | `spec/**` | Created only if missing. Never overwritten unless `--force`. |

## Update tracking

`sync` writes a `.hps-ai-kit.json` manifest into the consumer repo recording the installed version and a hash of every managed file. This enables:

- **Clean updates** — only changed managed files are rewritten.
- **Local-drift detection** — a managed file edited in the consumer is overwritten on the next sync and reported.
- **Pruning** — a managed file recorded in the manifest but no longer shipped by the kit is removed on the next sync. Locally modified stale files are kept and reported unless `--force` is used.
- **`check`** — compares managed files and the manifest version against the package; also flags stale (orphaned) files still recorded in the manifest. Exits non-zero if out of date.

Commit `.hps-ai-kit.json` to the consumer repo.

## Updating to a new version

1. Bump the kit version: `npm install -D @globalpayments-internal/coreboardingservices-copilot@1.1.0`
2. Run `npx coreboardingservices-copilot sync`
3. Review the change summary; commit.

## Maintaining the kit

`templates/` is the **source of truth**. Edit the agent/prompt/skill/spec files directly under `templates/`, then bump `package.json` `version` and tag a release.

Run the test suite before tagging a release:

```bash
npm test
```

To bulk re-import the payload from another repository (initial seed or occasional refresh):

```bash
npm run seed -- <path-to-source-repo>
```

This copies `.github/agents`, `.github/prompts`, `.github/skills`, `spec/`, and `AGENTS.md` from the source into `templates/`. It is a dev helper only and not part of the release flow.

## Layout

```
coreboardingservices-copilot/
  bin/cli.js          # CLI entry: sync, check
  src/                # sync/check logic, policy, manifest, fs helpers, report
  scripts/seed.js     # dev-only payload importer
  templates/          # canonical payload shipped to consumers
  test/               # node:test suite (npm test)
  policy.json         # managed vs protected path globs
```
