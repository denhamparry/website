---
status: Complete
issue: 229
title: Review and update npm dependencies with known advisories
labels: dependencies, javascript, security
---

<!-- cspell:ignore GHSA xvwj qjmp exploitability worktree -->

# Issue #229: Review and Update npm Dependencies with Known Advisories

## Summary

A Shoulder.dev scan and `npm audit` identified 3 vulnerable packages (6 total
advisories) in the project's devDependencies. All affected packages are used
exclusively in the testing/development pipeline and are not bundled into the
production Hugo site output.

## Current State (npm audit findings)

### 1. axios (Direct dependency)

- **Installed**: 1.9.0
- **Pinned in package.json**: 1.9.0 (exact)
- **Fix version**: 1.15.0
- **Severity**: High (2 high, 1 moderate)

| Advisory                                                                                                           | Severity | CVSS | CWE     | Fixed in |
| ------------------------------------------------------------------------------------------------------------------ | -------- | ---- | ------- | -------- |
| [GHSA-4hjh-wcwx-xvwj](https://github.com/advisories/GHSA-4hjh-wcwx-xvwj) - DoS via lack of data size check         | High     | 7.5  | CWE-770 | 1.12.0   |
| [GHSA-43fc-jf86-j433](https://github.com/advisories/GHSA-43fc-jf86-j433) - DoS via `__proto__` key in mergeConfig  | High     | 7.5  | CWE-754 | 1.13.5   |
| [GHSA-qj83-cq47-w5f8](https://github.com/advisories/GHSA-qj83-cq47-w5f8) - HTTP/2 session cleanup state corruption | Moderate | 5.9  | CWE-400 | 1.13.2   |

### 2. brace-expansion (Transitive dependency)

- **Installed**: 1.1.12 (root, via minimatch) and 2.0.2 (linkinator subtree)
- **Fix versions**: 1.1.13 and 2.0.3 respectively
- **Severity**: Moderate

| Advisory                                                                                                                                | Severity | CVSS | CWE     | Fixed in       |
| --------------------------------------------------------------------------------------------------------------------------------------- | -------- | ---- | ------- | -------------- |
| [GHSA-f886-m6hf-6m8v](https://github.com/advisories/GHSA-f886-m6hf-6m8v) - Zero-step sequence causes process hang and memory exhaustion | Moderate | 6.5  | CWE-400 | 1.1.13 / 2.0.3 |

### 3. yaml (Transitive dependency, via cspell)

- **Installed**: 2.8.0
- **Fix version**: 2.8.3
- **Severity**: Moderate

| Advisory                                                                                                                     | Severity | CVSS | CWE     | Fixed in |
| ---------------------------------------------------------------------------------------------------------------------------- | -------- | ---- | ------- | -------- |
| [GHSA-48c2-rrv3-qjmp](https://github.com/advisories/GHSA-48c2-rrv3-qjmp) - Stack overflow via deeply nested YAML collections | Moderate | 4.3  | CWE-674 | 2.8.3    |

## Implementation Tasks

### Step 1: Update axios (direct dependency)

Update the pinned version in `package.json` from `1.9.0` to `1.15.0` (latest
available, resolves all 3 advisories).

```bash
npm install --save-dev --save-exact axios@1.15.0
```

**Validation**: Verify no breaking changes in axios changelog between 1.9.0 and
1.15.0. The update is a minor version bump within the 1.x range.

### Step 2: Fix transitive dependencies via npm audit fix

Run `npm audit fix` to resolve brace-expansion and yaml vulnerabilities. This
updates the lock file without changing `package.json` semver ranges (the
transitive deps are not direct dependencies).

```bash
npm audit fix
```

**Expected result**: brace-expansion updates to 1.1.13 / 2.0.3 and yaml updates
to 2.8.3 in `package-lock.json`.

### Step 3: Verify clean audit

```bash
npm audit
```

Confirm 0 vulnerabilities reported.

### Step 4: Run test suite

```bash
npm test
```

Confirm all tests (Hugo build, functional, accessibility) still pass with
updated dependencies.

### Step 5: Run spell check

```bash
npm run test:spell
```

Confirm cspell (which depends on yaml transitively) still functions correctly.

## Files Modified

| File                | Change                                                                              |
| ------------------- | ----------------------------------------------------------------------------------- |
| `package.json`      | Update axios version from `1.9.0` to `1.15.0`                                       |
| `package-lock.json` | Updated lock file reflecting axios 1.15.0, brace-expansion 1.1.13/2.0.3, yaml 2.8.3 |

## Acceptance Criteria

1. `npm audit` reports 0 vulnerabilities
2. `npm test` passes (Hugo build, functional, accessibility tests)
3. `npm run test:spell` passes (cspell with updated yaml dependency)
4. No changes to production site output (these are devDependencies only)
5. `package.json` axios version updated to 1.15.0 (exact pin maintained)
6. `package-lock.json` reflects all patched transitive dependency versions

## Risk Assessment

**Overall risk: Low**

- **Production impact: None** - All 3 affected packages are devDependencies used
  only during testing and CI. They are never bundled into the Hugo static site
  output deployed to Netlify.
- **axios update**: Minor version bump (1.9.0 to 1.15.0) within the same major
  version. Used in functional tests only. Low risk of breaking changes.
- **brace-expansion update**: Patch-level bumps (1.1.12 to 1.1.13, 2.0.2 to
  2.0.3). Minimal risk.
- **yaml update**: Patch-level bump (2.8.0 to 2.8.3). Transitive dependency of
  cspell. Minimal risk.
- **Exploitability context**: The DoS vulnerabilities in axios and
  brace-expansion require attacker-controlled input to exploit. In a CI/testing
  context with controlled inputs, the practical exploitability is very low.
  However, updating is still recommended as a best practice.

## Critical Review

**Reviewer**: Claude Opus 4.6 (1M context) **Date**: 2026-04-09 **Verdict**:
Approved

### Verification Results

1. **package.json state matches plan**: Confirmed axios is pinned at exactly
   `1.9.0` as a devDependency. All other devDependencies match the plan's
   assumptions.

2. **npm audit output matches plan**: `npm audit --json` confirms exactly 3
   vulnerable packages:

   - **axios**: 3 advisories (GHSA-4hjh-wcwx-xvwj high, GHSA-43fc-jf86-j433
     high, GHSA-qj83-cq47-w5f8 moderate). Fix available: 1.15.0. Matches plan.
   - **brace-expansion**: 2 advisory sources (same GHSA-f886-m6hf-6m8v for
     ranges <1.1.13 and >=2.0.0 <2.0.3). Nodes at root and linkinator subtree.
     Matches plan.
   - **yaml**: 1 advisory (GHSA-48c2-rrv3-qjmp, range 2.0.0-2.8.2). Matches
     plan.

3. **axios 1.15.0 exists**: Confirmed via `npm view axios versions`. 1.15.0 is
   the latest published version. The target version is valid and available.

4. **Fix is semver-minor**: axios 1.9.0 to 1.15.0 is a minor version bump within
   the same major. npm audit confirms `isSemVerMajor: false`.

### Assessment

**Approach is sound and complete.** The plan correctly identifies all
vulnerabilities, proposes the right fix versions, and follows a sensible
execution order (direct dep first, then transitive via audit fix, then verify).

### Minor Observations (Non-blocking)

- **Advisory count phrasing**: The summary says "6 total advisories" which
  counts individual advisory sources across all packages. npm audit metadata
  reports `total: 3` (counting unique vulnerable packages). Both readings are
  defensible; just noting the distinction for clarity.

- **node_modules not present in worktree**: The worktree does not currently have
  `node_modules` installed. Step 1
  (`npm install --save-dev --save-exact axios@1.15.0`) will handle this
  implicitly, but the implementer should run `npm install` first if they want a
  clean baseline comparison, or simply proceed with the plan as written since
  npm install is implicit in the update command.

- **npm audit fix scope**: `npm audit fix` may update more transitive
  dependencies than just brace-expansion and yaml if new advisories have
  appeared since the plan was written. This is acceptable and expected behavior
  for a security update.

### Conclusion

The plan is well-structured, accurately reflects the current vulnerability
state, targets valid fix versions, and has appropriate risk assessment. The
scope is limited to devDependencies with no production impact. Approved for
implementation.
