# Publishing Guide

This document covers both consuming and maintaining `@roquinidiego/copilot-framework-poc` via GitHub Packages.

---

## For consumers — adding the package to your project

### 1. Authenticate with GitHub Packages

**Option A — npm login (recommended for local machines)**

```bash
npm login --registry=https://npm.pkg.github.com
```

npm opens your browser, you approve via GitHub OAuth, and the token is stored in `~/.npmrc` automatically. One-time setup per machine.

**Option B — Personal Access Token (alternative or for scripts)**

Generate a GitHub PAT with `read:packages` scope, then add it to your user-level `~/.npmrc`:

```
//npm.pkg.github.com/:_authToken=YOUR_TOKEN
```

> Never commit a token to the repo.

**In GitHub Actions (CI):** `GITHUB_TOKEN` is provided automatically — no setup needed.

### 2. Configure your project's `.npmrc`

Add an `.npmrc` file to the root of your consumer repository so npm knows where to resolve the `@roquinidiego` scope:

```
@roquinidiego:registry=https://npm.pkg.github.com
//npm.pkg.github.com/:_authToken=${GITHUB_TOKEN}
```

### 3. Install the package

```bash
npm install -D @roquinidiego/copilot-framework-poc
```

To pin to a specific version:

```bash
npm install -D @roquinidiego/copilot-framework-poc@1.0.0
```

### 4. Run the initial sync

```bash
npx coreboardingservices-copilot sync
```

This copies the managed files into your repo and creates missing `spec/` files. Commit the result, including `.hps-ai-kit.json`.

### 5. Staying up to date

Check for a newer version at any time:

```bash
npm outdated
```

To upgrade:

```bash
npm install -D @roquinidiego/copilot-framework-poc@<new-version>
npx coreboardingservices-copilot sync
```

Review the change summary, then commit.

---

## For maintainers — publishing a new version

### Prerequisites

- Write access to the `roquinidiego` account on GitHub
- Authenticated to GitHub Packages locally — run once:
  ```bash
  npm login --registry=https://npm.pkg.github.com
  ```
  Or use a PAT with `write:packages` scope in `~/.npmrc` if you prefer.
- Node.js >= 18

### Workflow

#### 1. Make your changes

Edit files under `templates/`, `src/`, `bin/`, or `policy.json` as needed.

#### 2. Run the test suite

```bash
npm test
```

All tests must pass before publishing.

#### 3. Bump the version

Use `npm version` — it updates `package.json` and creates a git tag automatically:

```bash
npm version patch   # bug fix:        1.0.0 → 1.0.1
npm version minor   # new feature:    1.0.0 → 1.1.0
npm version major   # breaking change: 1.0.0 → 2.0.0
```

#### 4. Push the commit and tag

```bash
git push origin main
git push origin --tags
```

#### 5. Publish to GitHub Packages

```bash
npm publish
```

Verify the new version appears at:
`https://github.com/roquinidiego?tab=packages`

#### 6. Create a GitHub Release (recommended)

```bash
gh release create v<version> --title "v<version>" --notes "Brief description of changes"
```

Or do it via the GitHub UI: **Releases → Draft a new release → pick the tag**.

> Creating a release is optional but recommended — it makes the changelog visible and allows consumers to watch for notifications.

### Versioning convention (SemVer)

| Change type | Example | Bump |
|---|---|---|
| Bug fix, no behavior change | Fix file hash mismatch | `patch` |
| New feature, backward-compatible | Add `--verbose` flag | `minor` |
| Breaking change | Rename CLI command or manifest format | `major` |
