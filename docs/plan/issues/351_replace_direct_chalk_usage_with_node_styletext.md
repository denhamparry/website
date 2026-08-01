---
status: Complete
issue: 351
date: 2026-08-01
---

<!-- cspell:words styleText worktree -->

# GitHub Issue #351: Replace direct Chalk usage with Node styleText

## Problem Statement

Dependabot PR [#349](https://github.com/denhamparry/website/pull/349) upgrades
Chalk from 4.1.2 to 6.0.0, but Chalk 5 and later are ESM-only. The repository's
Hugo and accessibility test scripts are CommonJS, so Node 22 returns Chalk's
module namespace from `require("chalk")` and calls such as `chalk.blue(...)`
fail before the tests run.

## Current State

- `tests/hugo/test-hugo-build.js` imports Chalk and uses six colour or emphasis
  styles across its build checks and summary output.
- `tests/accessibility/test-accessibility.js` imports Chalk and uses the same
  styles throughout its page and accessibility reporting.
- `package.json` declares Chalk 4.1.2 as a direct development dependency and
  `package-lock.json` records that root dependency.
- CI and `.nvmrc` target Node 22, whose standard `node:util` module provides
  CommonJS-compatible `styleText(format, text)` with all six required formats.
- PR #349 remains open and failing as of 2026-08-01. This replacement makes its
  direct Chalk upgrade unnecessary; the workflow must leave that PR for manual
  closure because automatic PR closure is out of scope.

## Acceptance Criteria

- [x] `npm run test:hugo` passes on Node 22 without importing Chalk.
- [x] `npm run test:accessibility` passes and retains styled terminal output.
- [x] The complete `npm test` suite passes with a running Hugo server.
- [x] Chalk is removed from direct development dependencies in `package.json`
      and from the root dependency set in `package-lock.json`.
- [x] Any remaining Chalk entries in the lockfile are demonstrably transitive,
      not used directly by these test scripts.
- [x] PR #349 is identified as superseded for the user to close manually after
      reviewing this replacement PR.

## Solution Design

Use the issue's recommended standard-library approach:

1. Import `styleText` from `node:util` in both CommonJS scripts.
2. Replace each `chalk.<format>(text)` call with `styleText("<format>", text)`
   for `blue`, `red`, `green`, `yellow`, `gray`, and `bold`.
3. Convert the one multi-argument Chalk call into one interpolated string,
   because `styleText` accepts a single text argument.
4. Remove the direct Chalk dependency with npm so both dependency manifests stay
   synchronized.

This keeps the scripts CommonJS, avoids package-level module changes, and
removes the direct dependency that caused the compatibility failure.

## Implementation Plan

1. Replace direct Chalk imports and calls in the Hugo build test script.
2. Replace direct Chalk imports and calls in the accessibility test script.
3. Remove the direct Chalk development dependency and refresh the lockfile.
4. Confirm planned and actual files match, then run the repository validation
   and review the differential against `origin/main`.

## Files Expected To Change

1. `tests/hugo/test-hugo-build.js`
2. `tests/accessibility/test-accessibility.js`
3. `package.json`
4. `package-lock.json`
5. `docs/plan/issues/351_replace_direct_chalk_usage_with_node_styletext.md`

## Validation Plan

```bash
npm ci
npm run test:hugo
npm test
npm run test:spell
git diff --check
pre-commit run --all-files
```

Run the complete test suite inside the repository's Nix development environment
when the plain shell lacks Hugo. Start Hugo as a background process for the
functional and accessibility phases. Use `FORCE_COLOR=1` in a focused invocation
to confirm `styleText` emits ANSI styling, and inspect `npm ls chalk` plus the
lockfile root package to distinguish direct from transitive Chalk dependencies.

## Risks And Open Questions

- `styleText` validates terminal colour support by default, so CI logs without a
  TTY may be uncoloured. That matches the standard library's intended behaviour;
  a forced-colour focused check verifies the formatting path.
- Local Node is newer than CI's Node 22. The full GitHub Actions run on the PR
  is the final Node 22 compatibility gate.
- Removing the direct dependency will not remove every transitive Chalk package
  from `package-lock.json`; unrelated test tools still depend on Chalk. The root
  dependency entry and application imports are the relevant scope.
- No implementation question remains open.

## Research Validation

- Iteration 1 confirmed the plan matches every issue acceptance criterion that
  can be completed without merging or closing another pull request.
- Node 22.23.1 was invoked directly through Nix and successfully loaded
  `styleText` through `require("node:util")`; all six planned formats emitted
  ANSI sequences with stream validation disabled for the focused check.
- The Node 22 documentation confirms `styleText(format, text[, options])` was
  added before Node 22 and supports CommonJS plus the required formats (checked
  2026-08-01 at
  `https://nodejs.org/download/release/latest-jod/docs/api/util.html#utilstyletextformat-text-options`).
- The two scripts contain all direct Chalk imports and application call sites;
  repository-wide search found no other direct code usage.
- `package.json`, its lockfile, both scripts, and this lifecycle plan are the
  complete expected file set. The theme, Hugo content, Jest configuration, and
  CI workflow do not require edits.
- PR #349 is still open and failing as of 2026-08-01. Creating a replacement PR
  with `Closes #351` is safe, while closing #349 remains an explicit manual
  follow-up under the workflow's no-close rule.
- Review outcome: approved for implementation.

## Implementation Notes

- Replaced both `require("chalk")` imports with a destructured CommonJS import
  of `styleText` from `node:util`.
- Mapped every existing colour and emphasis call to the corresponding
  `styleText` format without changing test control flow or result handling.
- Converted the Hugo build failure's two Chalk arguments into one interpolated
  string so the visible message remains `Build failed: <message>`.
- Removed Chalk from the root development dependencies in both npm manifests.
  The lockfile's remaining Chalk packages belong to Jest, cspell, and Linkinator
  dependency trees.

## Validation Results

- `nix shell nixpkgs#nodejs_22 -c node --version` - passed with Node 22.23.1.
- Focused Node 22 format check - all six `styleText` formats emitted ANSI
  sequences with stream validation disabled.
- `nix shell nixpkgs#nodejs_22 -c npm ci` - passed with existing Babel peer
  warnings, deprecation notices, and two high-severity audit findings unrelated
  to this dependency removal.
- `nix shell nixpkgs#nodejs_22 nixpkgs#hugo -c npm test` - passed after final
  formatting: nine Hugo checks, 20 functional tests, and 100 accessibility
  checks with zero violations.
- Forced-colour `npm run test:hugo` invocation - passed and contained ANSI
  styling from the migrated script.
- `npm ls chalk --all` - confirmed all remaining Chalk packages are transitive
  dependencies of Jest, cspell, or Linkinator.
- `npm run test:spell` - passed all 40 checked files.
- `pre-commit run --all-files` - first pass formatted the accessibility script;
  the second pass passed every hook, including gitleaks, cspell, and Prettier.
- `git diff --check` - passed.

## Branch Review

- Classification: code-relevant JavaScript test scripts and npm dependency
  manifests, plus this plan.
- Repo-local `docs/pre-pr-branch-review.md`: not present.
- `differential-review` and Trail of Bits specialist skills: unavailable in this
  session; performed the workflow reference's manual differential-review
  fallback against `origin/main`.
- Manual review checked CommonJS compatibility, format-name support, all Chalk
  call sites, the multi-argument output conversion, manifest-lockfile
  consistency, transitive dependencies, unchanged test control flow, final
  formatting, and planned-file scope.
- No blocking findings or non-blocking follow-up ideas were identified.
