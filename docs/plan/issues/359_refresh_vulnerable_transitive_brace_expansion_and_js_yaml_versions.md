---
status: Complete
issue: 359
date: 2026-08-08
---

<!-- cspell:words linkinator worktree -->

# GitHub Issue #359: Refresh vulnerable transitive brace-expansion and js-yaml versions

## Problem Statement

A clean npm install reports two high-severity vulnerability groups in transitive
test-suite dependencies. Three installed `brace-expansion` copies and one
`js-yaml` copy fall within the current advisory ranges. These packages are
development-only, so the production Hugo output is unaffected, but every clean
contributor and CI install continues to surface the findings.

## Acceptance Criteria

- [x] A clean `npm ci` followed by `npm audit --audit-level=high` reports no
      high-severity vulnerabilities.
- [x] The full repository test suite and spell check pass on Node 22.x after the
      lockfile refresh.
- [x] The lockfile delta updates only the affected transitive packages and
      preserves the root exact-version dependency policy.

## Solution Design

1. Run npm's non-forced audit fix under Node 22 so the existing compatible
   dependency ranges select patched `brace-expansion` and `js-yaml` releases.
2. Keep `package.json` unchanged because all vulnerable packages are transitive
   and their parent ranges already admit patched releases.
3. Review every changed lockfile node, resolved URL, integrity value, and
   dependency edge to confirm the refresh does not alter unrelated packages.

## Implementation Plan

1. Refresh `package-lock.json` with `npm audit fix` under Node 22.
2. Confirm all four affected installed paths resolve outside the advisory ranges
   and that a clean audit reports zero high-severity findings.
3. Run the full Node 22 test suite, spell check, repository pre-commit hooks,
   and differential scope checks.
4. Record implementation, review, and independent post-PR evidence in this
   lifecycle plan.

## Files Expected To Change

1. `package-lock.json`
2. `docs/plan/issues/359_refresh_vulnerable_transitive_brace_expansion_and_js_yaml_versions.md`

## Validation Plan

```bash
nix shell nixpkgs#nodejs_22 -c npm ci
nix shell nixpkgs#nodejs_22 -c npm audit --audit-level=high
nix shell nixpkgs#nodejs_22 nixpkgs#hugo -c npm test
nix shell nixpkgs#nodejs_22 -c npm run test:spell
npm ls brace-expansion js-yaml --all
git diff --check
pre-commit run --all-files
```

The baseline failure evidence is the clean pre-change install and audit, which
report two high-severity groups at the four issue-named paths. The corrected
success path must be a clean Node 22 install and zero-high audit. The negative
scope check confirms no direct dependency, npm policy, source, workflow, or
production-site file changes.

## Issue Traceability

| Issue item                                                  | Disposition                          | Evidence target                                                             |
| ----------------------------------------------------------- | ------------------------------------ | --------------------------------------------------------------------------- |
| Refresh vulnerable `brace-expansion` copies                 | Implemented in this PR               | Patched versions at the root, Linkinator, and `test-exclude` lockfile nodes |
| Refresh vulnerable `js-yaml` copy                           | Implemented in this PR               | Patched `node_modules/js-yaml` lockfile node                                |
| Use `npm audit fix`                                         | Implemented in this PR               | Non-forced Node 22 audit-fix command and reviewed lockfile delta            |
| Preserve exact-version policy                               | Validated without a change           | `.npmrc` remains `save-exact=true`; `package.json` remains unchanged        |
| `npm audit` reports zero high findings after clean `npm ci` | Implemented and validated in this PR | Clean Node 22 install followed by audit gate                                |
| Full test suite passes on Node 22.x                         | Implemented and validated in this PR | Node 22 full suite plus PR checks                                           |
| `package-lock.json` affected path                           | Implemented in this PR               | Only vulnerable transitive package nodes change                             |
| PR #358 and issue #353 context                              | Validated without a change           | Live repository contains the merged Node 22 enforcement work                |
| Production site exposure                                    | Not applicable                       | The affected packages remain dev-only test tooling                          |

## Analogous-Pattern Sweep

- Search scope: every `brace-expansion` and `js-yaml` node and parent chain in
  `package-lock.json`, plus the root manifest and npm configuration.
- Representative queries: `npm audit --json`,
  `npm ls brace-expansion js-yaml --all`, and repository-wide searches for the
  package names.
- Baseline result: all three installed `brace-expansion` copies and the sole
  installed `js-yaml` copy are independently vulnerable and belong in this fix.
  No direct dependency or production runtime occurrence was found.

## Risks And Open Questions

- The audit database can change independently of the repository. Validation
  records the current advisory result and the exact resolved versions used.
- A lockfile-only refresh can still alter integrity values and dependency
  placement; the complete diff and clean install must be reviewed before commit.
- Existing Babel 8/Jest Babel 7 peer warnings are unrelated and must remain
  non-blocking unless the refresh changes them.
- No deploy is requested or described by the issue.

## Research Validation

- Iteration 1 approved the plan without substantive revision.
- The freshly fetched issue is open and every acceptance criterion,
  recommendation, affected path, reference, and scope statement is represented
  in the traceability table.
- A clean baseline `npm ci` followed by `npm audit --audit-level=high`
  reproduced two high-severity vulnerability groups at the three
  `brace-expansion` paths and sole `js-yaml` path named by the issue.
- The parent requirements are `brace-expansion` ranges `^1.1.7`, `^2.0.2`, and
  `^5.0.5`, plus `js-yaml` range `^3.13.1`. Registry metadata confirms those
  ranges admit patched releases 1.1.18, 2.1.4, 5.0.9, and 3.15.1, respectively,
  so a non-forced lockfile-only refresh is sufficient.
- The analogous-pattern sweep found no other installed copy or direct manifest
  dependency. `.npmrc` already preserves `save-exact=true` and enforces Node 22
  through `engine-strict=true`; neither file needs a change.
- Failure-shaped validation compares the reproduced two-high baseline with a
  clean zero-high post-fix audit, then exercises the complete supported Node 22
  suite and verifies unchanged direct-dependency and production paths.
- PR #358 is merged and issue #353 is closed as of 2026-08-08; current
  `origin/main` contains their Node 22 engine enforcement, so the required
  validation runtime is already repository-owned.
- Review outcome: approved for implementation.

## Implementation Notes

- Ran the non-forced `npm audit fix` under Node 22.23.1.
- Updated the root `brace-expansion` lockfile node from 2.0.3 to 2.1.4,
  Linkinator's nested copy from 5.0.8 to 5.0.9, and `test-exclude`'s nested copy
  from 1.1.14 to 1.1.18.
- Updated the sole `js-yaml` lockfile node from 3.14.2 to 3.15.1.
- Left `package.json`, `.npmrc`, dependency requirements, install scripts,
  source files, workflows, and production paths unchanged.
- Planned and actual paths match: `package-lock.json` plus this lifecycle plan.

## Validation Results

- Baseline clean install and audit - reproduced two high-severity groups across
  all four issue-named paths before the refresh.
- Node 22.23.1 `npm audit fix` - changed four transitive packages and reported
  zero vulnerabilities without using `--force`.
- Clean Node 22 `npm ci` - passed and validated the refreshed registry URLs and
  integrity hashes; the existing Babel peer-resolution warnings remained.
- Clean Node 22 `npm audit --audit-level=high` - passed with zero
  vulnerabilities at every severity.
- `npm ls brace-expansion js-yaml --all` - resolved exactly 2.1.4, 5.0.9,
  1.1.18, and 3.15.1 through the same parent dependency chains.
- Full Node 22 suite with a Hugo server - passed nine Hugo checks, 20 functional
  tests, and 100 accessibility checks with zero violations. The first invocation
  intentionally surfaced the local harness prerequisite by failing the browser
  tests with `ERR_CONNECTION_REFUSED`; the CI-equivalent server-backed rerun
  passed without implementation changes.
- `npm run test:spell` - passed all 42 checked files.
- `pre-commit run --all-files` - passed every hook on the complete staged file
  set after Prettier normalized this plan and one spelling term was clarified.
- `git diff --check` - passed.
- Negative scope check - `package.json` and `.npmrc` are unchanged; the lockfile
  delta is exactly 12 additions and 12 deletions across four version, registry
  URL, and integrity triplets.

## Branch Review

- Classification: code-relevant npm lockfile and supply-chain metadata plus this
  lifecycle plan.
- Repo-local `docs/pre-pr-branch-review.md`: not present.
- `differential-review` and `supply-chain-risk-auditor` skills: unavailable in
  this session; performed the workflow reference's concrete manual reviews.
- Differential review inspected the complete diff, all affected parent chains,
  direct manifest and npm policy, dependency placement, install behavior, audit
  result, tests, and unchanged source, workflow, and production paths.
- Supply-chain review confirmed npm registry URLs, fresh integrity values
  verified by a clean install, unchanged dependency edges and package scripts,
  compatible parent ranges, no forced major update, and no unrelated lockfile
  churn.
- The final analogous-pattern sweep covered every installed `brace-expansion`
  and `js-yaml` copy. All four vulnerable copies are fixed in scope; no missed
  direct or production occurrence was found.
- No blocking findings were identified.

## Follow-Up Ideas

- Non-blocking and pre-existing: investigate the Babel 8/Jest Babel 7 peer
  resolution warnings separately; this lockfile refresh neither introduced nor
  changed them.

## Post-PR Verification

Independent issue-to-PR verification reviewed implementation head
`77fdde11e2a62cbad91d202004c958fe3262d0ec` from PR #361 and confirmed the local,
remote, and GitHub head matched before review.

| Criterion or issue item                                    | Independent evidence                                                                                                                                        | Result |
| ---------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------- | ------ |
| All three vulnerable `brace-expansion` paths are refreshed | Re-read the complete PR diff and clean installed tree; the root, Linkinator, and `test-exclude` copies resolve to 2.1.4, 5.0.9, and 1.1.18                  | Pass   |
| The vulnerable `js-yaml` path is refreshed                 | Re-read the complete PR diff and dependency tree; the sole installed copy resolves to 3.15.1 through `@istanbuljs/load-nyc-config`                          | Pass   |
| Clean audit has no high-severity findings                  | Re-ran Node 22.23.1 `npm ci` and `npm audit --audit-level=high`; npm reported zero vulnerabilities at every severity                                        | Pass   |
| Full test suite passes on Node 22.x                        | Independently reran the server-backed suite: nine Hugo checks, 20 functional tests, and 100 accessibility checks all passed                                 | Pass   |
| Audit fix remains lockfile-only                            | Compared the complete branch against `origin/main`; `package.json`, `.npmrc`, parent ranges, scripts, source, workflows, and production paths are unchanged | Pass   |
| Exact-version policy remains intact                        | Re-read `.npmrc`; `save-exact=true` remains present alongside the existing Node 22 engine enforcement                                                       | Pass   |
| Lockfile scope is limited to affected packages             | Rechecked the 12-addition/12-deletion lockfile delta; only version, npm registry URL, and integrity triplets for the four affected nodes changed            | Pass   |
| PR #358 and issue #353 context remains valid               | Re-fetched issue #359 and PR #361; the issue is open, the PR targets `main`, and the prior Node 22 enforcement is present on the base                       | Pass   |
| Production site remains outside exposure                   | Revisited dependency placement and changed paths; all refreshed packages remain test-only dev dependencies with no Hugo production-source change            | Pass   |

- Repeated the analogous-pattern sweep across every installed `brace-expansion`
  and `js-yaml` occurrence; no missed in-scope copy was found.
- Revalidated registry integrity through a fresh clean install and confirmed no
  new dependency edge, package script, or forced major upgrade was introduced.
- Outcome: no blocking or new non-blocking findings. The pre-existing Babel
  peer-resolution warning remains the sole follow-up idea.
