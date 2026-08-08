---
status: Complete
issue: 353
date: 2026-08-08
---

<!-- cspell:words EBADENGINE styleText worktree -->

# GitHub Issue #353: Declare a Node engines floor for styleText usage

## Problem Statement

The CommonJS Hugo and accessibility test scripts use `util.styleText`, while the
package metadata does not declare the Node 22 floor used by the test CI matrix.
Contributors on older runtimes can therefore reach the scripts before receiving
a repository-owned compatibility message.

The live repository differs from two details in the issue's affected-path
snapshot: `.nvmrc` already contains `22`, and `.npmrc` already contains
`save-exact=true`. The missing package engine declaration remains reproducible.

## Acceptance Criteria

- [x] `package.json` declares `engines.node` as `>=22`, matching the test CI
      matrix.
- [x] `npm ci` on an older Node runtime reports the root package's version
      mismatch before a test script can fail at `styleText`.
- [x] The test suite remains green on Node 22.x.

## Solution Design

1. Add the root `engines.node` declaration to `package.json` and regenerate the
   root package metadata in `package-lock.json` with npm.
2. Add `engine-strict=true` to the existing `.npmrc` so `npm ci` stops with an
   actionable `EBADENGINE` error instead of continuing to a later test-script
   failure. Preserve the existing exact-version policy.
3. Leave `.nvmrc` unchanged because it already selects Node 22.
4. Leave test scripts and CI workflow pins unchanged; they already use
   `styleText` and Node 22.x respectively.

## Implementation Plan

1. Update the npm package and repository configuration.
2. Refresh the lockfile through npm so its root package metadata matches
   `package.json`.
3. Simulate the original unsupported-runtime path with Node 20 and verify npm
   rejects it for the root engine requirement.
4. Install and run the repository validation under Node 22, then review the
   complete differential against `origin/main`.

## Files Expected To Change

1. `.npmrc`
2. `package.json`
3. `package-lock.json`
4. `docs/plan/issues/353_declare_node_engines_floor_for_styletext_usage.md`

## Validation Plan

```bash
nix shell nixpkgs#nodejs_20 -c npm ci
nix shell nixpkgs#nodejs_22 -c npm ci
nix shell nixpkgs#nodejs_22 nixpkgs#hugo -c npm test
nix shell nixpkgs#nodejs_22 -c npm run test:spell
git diff --check
pre-commit run --all-files
```

The Node 20 command is expected to fail with `EBADENGINE` naming the root
package and its `>=22` requirement. The remaining commands must succeed.

## Issue Traceability

| Issue item                                               | Disposition                          | Evidence target                                                             |
| -------------------------------------------------------- | ------------------------------------ | --------------------------------------------------------------------------- |
| Declare `engines.node` as `>=22`                         | Implemented in this PR               | `package.json` and root lockfile package metadata                           |
| Older `npm ci` reports the mismatch                      | Implemented in this PR               | Node 20 failure-shaped `EBADENGINE` check                                   |
| CI remains green on Node 22.x                            | Implemented and validated in this PR | Local Node 22 suite plus PR checks                                          |
| Add a matching `.nvmrc`                                  | Validated without a change           | Existing `.nvmrc` contains `22`                                             |
| Consider strict engine enforcement                       | Implemented in this PR               | Existing `.npmrc` gains `engine-strict=true`                                |
| `tests/hugo/test-hugo-build.js` related path             | Validated without a change           | Existing `styleText` import establishes the runtime dependency              |
| `tests/accessibility/test-accessibility.js` related path | Validated without a change           | Existing `styleText` import establishes the runtime dependency              |
| PR #352 and issue #351 context                           | Validated without a change           | Current `origin/main` contains the merged `styleText` implementation        |
| Netlify and Lighthouse behavior                          | Intentionally out of scope           | Neither path runs the affected npm test suite under the Node 22 test matrix |

## Risks And Open Questions

- `engine-strict=true` turns all dependency engine incompatibilities into
  install failures. This is intentional for a test-only package whose runtime is
  already pinned to Node 22 locally and in CI, but the Node 22 validation must
  confirm current dependencies remain installable.
- `engines.node: >=22` permits future major Node versions. This matches the
  issue requirement and the repository's rolling Node 22-or-newer toolchain;
  dependency-specific constraints remain independently enforced.
- The unsupported-runtime check removes or replaces `node_modules` as part of
  `npm ci`; the subsequent Node 22 install restores the validated dependency
  tree in the isolated worktree.
- No deploy is requested or described by the plan.

## Research Validation

- Iteration 1 approved the plan without substantive revision.
- The freshly fetched issue was reconciled item by item in the traceability
  table. Its claims that `.nvmrc` and `.npmrc` are absent are stale against
  `origin/main`: `.nvmrc` contains `22`, while `.npmrc` contains the existing
  exact-version policy.
- Repository-wide search found one package manifest, one Node test matrix at
  `22.x`, a separate intentionally unrelated Lighthouse pin at `20.x`, and the
  two expected `styleText` consumers. The root package is the only missing
  repository-owned engine declaration.
- PR #352 is merged and issue #351 is closed as of 2026-08-08; commit `2612e235`
  on the current default branch supplies the `styleText` usage that motivates
  this issue.
- The existing `.nvmrc` and CI test matrix make strict rejection of older
  runtimes consistent with the repository's supported path. The plan preserves
  `save-exact=true` and validates that strict engine handling does not reject
  the supported Node 22 dependency tree.
- The validation is failure-shaped: Node 20 must fail during `npm ci` with the
  root `>=22` requirement, Node 22 must install and pass the full suite, and
  no-op scope is checked for the existing scripts, workflow pins, `.nvmrc`,
  Docker, and Netlify configuration.
- Review outcome: approved for implementation.

## Implementation Notes

- Added `engines.node: >=22` to `package.json` and regenerated the lockfile's
  root package metadata with Node 22 npm.
- Added `engine-strict=true` to `.npmrc` while preserving `save-exact=true`.
  Unsupported runtimes now stop during install rather than reaching the test
  scripts.
- Left `.nvmrc`, both `styleText` consumers, the Node 22 test matrix, the
  separate Lighthouse job, Docker, and Netlify unchanged as planned.
- Planned and actual paths match exactly: the three npm metadata/configuration
  files plus this plan.

## Validation Results

- Failure-shaped Node 20.20.2 `npm ci` - failed as expected with `EBADENGINE`,
  the root package name, required `{"node":">=22"}`, and actual Node/npm
  versions. The rolling Nix package set had removed Node 20 after end of life,
  so the deterministic check used the pinned `nixos-25.11` package set.
- Node 22 `npm ci` - passed. Existing Babel peer-resolution warnings,
  deprecation warnings, and two transitive high-severity audit findings were
  unchanged and are recorded as non-blocking follow-up ideas.
- Full Node 22 test suite with Hugo server - passed after initializing the
  PaperMod submodule in the new worktree: nine Hugo checks, 20 functional tests,
  and 100 accessibility checks with zero violations. The first attempt correctly
  exposed the uninitialized worktree submodule and was rerun after setup.
- Manifest consistency check - passed; `package.json` and the root lockfile
  package both contain the exact `>=22` range.
- `npm config get engine-strict` under Node 22 - returned `true`.
- Adjacent-path no-op check - confirmed no changes to `.nvmrc`, `.github/`, test
  scripts, Docker, or Netlify configuration.
- Lockfile scope check - exactly three added lines in the root package metadata;
  no dependency graph or integrity data changed.
- `npm run test:spell` under Node 22 - passed all 41 checked files.
- `pre-commit run --all-files` - passed every hook, including JSON checks,
  gitleaks, cspell, ShellCheck, and Prettier.
- `git diff --check` - passed.
- PR #358 GitHub `test (22.x)` check on implementation head `32261c4f` - passed
  in 1 minute 36 seconds. Conform, cspell, lint, PR-body validation, and the
  Netlify preview checks also passed or were correctly skipped.

## Branch Review

- Classification: code-relevant npm package metadata, install policy, lockfile,
  and this lifecycle plan.
- Repo-local `docs/pre-pr-branch-review.md`: not present.
- `differential-review` and `supply-chain-risk-auditor` skills: unavailable in
  this session; performed concrete manual fallback reviews against
  `origin/main`.
- Differential review checked the full diff, root manifest/lockfile consistency,
  strict-engine behavior on supported and unsupported runtimes, unchanged
  dependency versions and integrity data, existing exact-version policy
  preservation, the Node 22 CI and `.nvmrc` alignment, and unchanged adjacent
  runtime consumers.
- Analogous-pattern sweep covered every repository-owned package manifest, Node
  pin, npm setting, and `styleText` consumer. The sole root package is fixed
  here; the Lighthouse Node 20 job is intentionally different because it does
  not install or run this test suite; no additional occurrence belongs in scope.
- No blocking findings were identified.

## Follow-Up Ideas

- Non-blocking and pre-existing: investigate the Babel 8/Jest Babel 7 peer
  warnings and refresh transitive `brace-expansion` and `js-yaml` versions
  reported by `npm audit`. No dependency graph changed in this PR.

## Post-PR Verification

Independent issue-to-PR verification reviewed implementation head
`32261c4f1896c0154fa97b131c62ff8804c6e00d` from PR #358 and confirmed it matched
the local and remote branch before review.

| Criterion or issue item              | Independent evidence                                                                                                                                                                | Result |
| ------------------------------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------ |
| Root `engines.node` is `>=22`        | Re-read the complete PR diff and parsed both `package.json` and `package-lock.json`; both root values are exactly `>=22`                                                            | Pass   |
| Older `npm ci` reports the mismatch  | Re-ran Node 20.20.2 `npm ci`; exit 1 named `denhamparry-website-tests@1.0.0`, required `>=22`, actual Node 20.20.2, and `EBADENGINE`                                                | Pass   |
| Supported Node 22 path remains green | Re-ran Node 22.23.1 `npm ci` and the full suite: 9 Hugo checks, 20 functional tests, and 100 accessibility checks; GitHub `test (22.x)` also passed                                 | Pass   |
| Matching local runtime selector      | Re-read `.nvmrc`; its existing value is `22`, so no change is required                                                                                                              | Pass   |
| Optional strict enforcement          | Re-read `.npmrc` and queried npm under Node 22; `engine-strict` resolves to `true` while `save-exact=true` remains intact                                                           | Pass   |
| Affected `styleText` consumers       | Revisited both CommonJS scripts; they remain unchanged and are protected by the root install gate                                                                                   | Pass   |
| CI, Lighthouse, and Netlify scope    | Revisited all Node pins and confirmed the Node 22 test matrix installs the package; the unchanged Node 20 Lighthouse job and Node-free Netlify build do not run this npm test suite | Pass   |
| PR #352 and issue #351 context       | Re-fetched GitHub state: PR #352 is merged and issue #351 is closed; the current default branch contains their `styleText` change                                                   | Pass   |

- Repeated the analogous-pattern sweep across the sole package manifest, all
  Node pins, all npm settings, and both `styleText` consumers. No missed
  in-scope occurrence was found.
- Rechecked the lockfile delta: only the root engine metadata changed; package
  versions, resolved artifacts, integrity values, and dependency edges are
  unchanged.
- Rechecked unchanged adjacent paths for `.nvmrc`, workflows, test scripts,
  Docker, and Netlify configuration.
- Outcome: no blocking or new non-blocking findings. The previously recorded
  Babel peer warnings and transitive audit findings remain the sole follow-up
  idea.
