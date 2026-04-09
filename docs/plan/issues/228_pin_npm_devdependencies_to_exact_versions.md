# GitHub Issue #228: Pin npm devDependencies to exact versions

**Issue:** [#228](https://github.com/denhamparry/website/issues/228) **Status:**
Planning **Date:** 2026-04-09

## Problem Statement

All npm devDependencies in `package.json` use caret (`^`) version ranges,
allowing automatic minor/patch updates on fresh installs or CI environments
without a lockfile. A Shoulder.dev scan flagged this as a supply chain risk.

### Current Behavior

- All 7 devDependencies use caret ranges (e.g. `^4.8.2`)
- Fresh `npm install` without lockfile could pull newer, untested versions
- Version changes are implicit and hidden in diffs

### Expected Behavior

- Dependencies pinned to exact versions
- `.npmrc` enforces exact pinning for future `npm install --save` commands
- Version bumps are explicit and visible in diffs via Dependabot/Renovate

## Current State Analysis

### Relevant Code/Config

- **`package.json`** (lines 16-24): 7 devDependencies all using `^` ranges
- **`package-lock.json`**: Exists, locks resolved versions at install time
- **`.npmrc`**: Does not exist
- **Dependabot**: No `.github/dependabot.yml` configured for npm

### Packages to Pin

| Package             | Current Specifier | Pinned Version |
| ------------------- | ----------------- | -------------- |
| @axe-core/puppeteer | ^4.8.2            | 4.8.2          |
| axios               | ^1.6.2            | 1.6.2          |
| chalk               | ^4.1.2            | 4.1.2          |
| cspell              | ^8.3.2            | 8.3.2          |
| jest                | ^29.7.0           | 29.7.0         |
| linkinator          | ^5.0.0            | 5.0.0          |
| puppeteer           | ^23.8.0           | 23.8.0         |

## Solution Design

### Approach

1. Remove caret prefixes from all devDependencies in `package.json`
2. Create `.npmrc` with `save-exact=true` to enforce exact pinning for future
   installs
3. Add Dependabot configuration for npm ecosystem to automate controlled updates

### Rationale

- Exact pinning makes version changes explicit in git diffs
- `.npmrc` prevents future contributors from accidentally adding ranged deps
- Dependabot provides automated, reviewable PRs for dependency updates
- `package-lock.json` already mitigates runtime risk, but pinning adds
  defence-in-depth

### Trade-offs

- **Pro**: Explicit version control, supply chain hardening
- **Con**: More frequent Dependabot PRs for minor/patch updates
- **Mitigation**: Dependabot groups can batch related updates

## Implementation Plan

### Step 1: Pin devDependencies in package.json

**File:** `package.json`

**Changes:**

Remove `^` prefix from all devDependency version specifiers:

```json
"devDependencies": {
  "@axe-core/puppeteer": "4.8.2",
  "axios": "1.6.2",
  "chalk": "4.1.2",
  "cspell": "8.3.2",
  "jest": "29.7.0",
  "linkinator": "5.0.0",
  "puppeteer": "23.8.0"
}
```

**Testing:**

```bash
# Verify package.json is valid JSON
node -e "require('./package.json')"
```

### Step 2: Create .npmrc with save-exact

**File:** `.npmrc`

**Changes:**

Create new file:

```ini
save-exact=true
```

**Testing:**

```bash
# Verify npm reads the config
npm config list --location project
```

### Step 3: Add Dependabot configuration for npm

**File:** `.github/dependabot.yml`

**Changes:**

Create Dependabot config for npm ecosystem (alongside any existing ecosystems):

```yaml
version: 2
updates:
  - package-ecosystem: "npm"
    directory: "/"
    schedule:
      interval: "weekly"
    labels:
      - "dependencies"
      - "javascript"
    commit-message:
      prefix: "fix(deps)"
```

**Testing:**

```bash
# Validate YAML syntax
python3 -c "import yaml; yaml.safe_load(open('.github/dependabot.yml'))"
```

### Step 4: Regenerate package-lock.json

**File:** `package-lock.json`

**Changes:**

Run `npm install` to regenerate the lockfile with exact versions. The resolved
versions should remain unchanged since the pinned versions match what was
already locked.

```bash
npm install
```

**Testing:**

```bash
# Verify no version changes in lockfile
git diff package-lock.json | head -50
npm test
```

## Testing Strategy

### Unit Testing

- Verify `package.json` is valid JSON after edits
- Verify `.npmrc` is parsed correctly by npm
- Verify `dependabot.yml` is valid YAML

### Integration Testing

**Test Case 1: Clean install**

1. Delete `node_modules/`
2. Run `npm install`
3. Verify all packages install at exact pinned versions

**Test Case 2: Existing tests pass**

1. Run `npm test` (Hugo build + functional + accessibility)
2. Verify no regressions

### Regression Testing

- All existing npm scripts (`test`, `test:hugo`, `test:functional`, etc.) should
  work unchanged
- No changes to runtime behaviour since versions are already locked

## Success Criteria

- [ ] All devDependencies in `package.json` use exact versions (no `^` or `~`)
- [ ] `.npmrc` exists with `save-exact=true`
- [ ] `.github/dependabot.yml` includes npm ecosystem configuration
- [ ] `package-lock.json` regenerated without version drift
- [ ] `npm test` passes
- [ ] Pre-commit hooks pass

## Files Modified

1. `package.json` - Remove caret prefixes from devDependencies
2. `.npmrc` - New file: enforce exact version pinning
3. `.github/dependabot.yml` - New file: Dependabot config for npm updates
4. `package-lock.json` - Regenerated with exact version specifiers

## Related Issues and Tasks

### Related

- Shoulder.dev scan identified the issue
- Issue labels: dependencies, javascript, security

### Enables

- Automated dependency updates via Dependabot
- Explicit version change tracking in PRs

## References

- [GitHub Issue #228](https://github.com/denhamparry/website/issues/228)
- [Shoulder.dev scan](https://beta.shoulder.dev/github/denhamparry/website#dangerous-routes)
- [npm save-exact docs](https://docs.npmjs.com/cli/v10/using-npm/config#save-exact)
- [Dependabot configuration](https://docs.github.com/en/code-security/dependabot/dependabot-version-updates/configuration-options-for-the-dependabot.yml-file)

## Notes

### Key Insights

- `package-lock.json` already mitigates the runtime risk for `npm ci` (which CI
  should use), but pinning adds defence-in-depth for `npm install` scenarios
- The pinned versions match what's currently specified (just without `^`), so no
  functional change

### Alternative Approaches Considered

1. **Only pin, no Dependabot** - Versions would go stale without automated
   updates. Not recommended for security-sensitive dependencies like puppeteer.
   ❌
2. **Pin + `.npmrc` + Dependabot** - Complete solution with automated update
   path ✅
