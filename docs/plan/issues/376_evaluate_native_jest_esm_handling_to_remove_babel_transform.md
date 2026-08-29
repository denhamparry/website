---
status: Complete
issue: 376
date: 2026-08-29
---

<!-- cspell:words ERESOLVE dependabot worktree -->

# GitHub Issue #376: Remove the Babel transform with native Jest ESM handling

## Problem Statement

The functional Jest suites still load Puppeteer's ESM-only entry from CommonJS
tests. Issue #286 added a Babel transform for that boundary, which now requires
three direct Babel packages, a root configuration file, a large lockfile
subtree, and two Dependabot major-version ignores introduced by issue #374.

Plain Node 22 can synchronously load Puppeteer, but Jest 30.4.2 uses its own
module runtime. A Node 22 prototype with Jest transforms disabled reproduced
`SyntaxError: Unexpected token 'export'` in both functional suites, so deleting
Babel without changing Jest execution is not sufficient.

## Decision

Remove the root Babel transform and use Jest's native ESM support. Run the
functional suite through Node's `--experimental-vm-modules` flag and dynamically
import Puppeteer in the two CommonJS test files. Puppeteer 25.9.0 exposes the
same ESM file for both its `import` and `require` export conditions and ships no
separate CommonJS build, so a supported CJS entry-point substitution is
unavailable.

The completed plans for issues #286 and #374 remain unchanged as historical
records. This plan documents why their transform and suppression decisions are
now superseded by current Node 22/Jest behavior.

## Acceptance Criteria

- [x] The evaluation documents whether Babel remains necessary for the current
      Jest 30.4.2 and Puppeteer 25.9.0 pair.
- [x] `@babel/core`, `@babel/preset-env`, `babel-jest`, and `babel.config.js`
      are removed and `package-lock.json` is regenerated.
- [x] The Babel semantic-major ignore entries are removed from
      `.github/dependabot.yml` without changing unrelated update policy.
- [x] A clean `npm ci` on Node 22.x completes with no `ERESOLVE` output.
- [x] The full test suite passes on Node 22.x against a running Hugo server.

## Implementation Plan

1. Change the functional-test script to invoke Jest through Node with
   `--experimental-vm-modules`, and replace the two top-level Puppeteer
   `require()` calls with dynamic imports inside their existing async setup.
2. Remove the three direct Babel dependencies and Jest's Puppeteer transform
   exception from `package.json`; regenerate the lockfile with Node 22 npm and
   delete `babel.config.js`.
3. Remove only the Babel-specific comment and ignore list from the npm
   Dependabot block.
4. Validate the failure path without VM modules, the corrected functional path,
   plain-Node accessibility behavior, clean installation and dependency absence,
   the full server-backed suite, spelling, configuration structure, and
   repository pre-commit checks.
5. Review the complete dependency/configuration diff and record branch-review
   and independent post-PR evidence in this lifecycle plan.

## Files Expected To Change

1. `.github/dependabot.yml`
2. `babel.config.js` (deleted)
3. `package.json`
4. `package-lock.json`
5. `tests/functional/content.test.js`
6. `tests/functional/navigation.test.js`
7. `docs/plan/issues/376_evaluate_native_jest_esm_handling_to_remove_babel_transform.md`

## Validation Plan

```bash
nix shell nixpkgs#nodejs_22 -c npm ci
nix shell nixpkgs#nodejs_22 -c npm ls @babel/core @babel/preset-env babel-jest
nix shell nixpkgs#nodejs_22 -c node -e \
  'import("puppeteer").then(({ launch }) => console.log(typeof launch))'
nix shell nixpkgs#nodejs_22 nixpkgs#hugo -c bash -c \
  'hugo server --bind 127.0.0.1 & server_pid=$!; \
  trap '\''kill "$server_pid" 2>/dev/null || true'\'' EXIT; \
  until curl -fsS http://127.0.0.1:1313/ >/dev/null; do sleep 1; done; \
  npm test'
nix shell nixpkgs#nodejs_22 -c npm run test:spell
python3 -c "import yaml; yaml.safe_load(open('.github/dependabot.yml'))"
git diff --check
pre-commit run --all-files
```

Failure-shaped validation will invoke the functional Jest command without
`--experimental-vm-modules` and require the ESM-loading failure. The corrected
script must then pass all 20 functional tests. The full suite confirms the
plain-Node accessibility runner still loads Puppeteer without Jest or Babel.

## Issue Traceability

| Issue item                                                                          | Disposition                                         | Evidence target                                                                                                        |
| ----------------------------------------------------------------------------------- | --------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------- |
| Document whether the Jest Babel transform remains required                          | Implemented in this PR                              | Decision and research evidence distinguish plain Node loading from Jest's VM runtime                                   |
| Confirm the current Jest/Puppeteer constraint rather than assuming #286 still holds | Validated and implemented in this PR                | Transform-disabled prototype reproduces the old parse failure; VM-module implementation proves the current replacement |
| Prototype native Jest ESM with the existing suites                                  | Implemented with the minimum test-loader adaptation | Unchanged suites fail; only the two Puppeteer imports and functional test launcher change                              |
| Consider a CJS-compatible Puppeteer entry                                           | Validated without a change                          | Installed package exports map `import` and `require` to the same ESM file and contain no CJS build                     |
| Remove direct `@babel/core` root                                                    | Implemented in this PR                              | Root manifest and root lockfile package metadata omit it; any Jest-internal transitive remains tool-owned              |
| Remove direct `@babel/preset-env` root                                              | Implemented in this PR                              | Root manifest and lockfile graph omit the transform preset and its broad subtree                                       |
| Remove direct `babel-jest` root                                                     | Implemented in this PR                              | Root manifest and root lockfile package metadata omit it; Jest may retain its internal transform package               |
| Remove `babel.config.js`                                                            | Implemented in this PR                              | Deleted tracked configuration                                                                                          |
| Regenerate `package-lock.json`                                                      | Implemented in this PR                              | Node 22 npm-generated dependency graph and reviewed lockfile delta                                                     |
| Remove both Babel semantic-major ignores                                            | Implemented in this PR                              | Parsed Dependabot configuration has no Babel ignore entries                                                            |
| If the transform must stay, record why                                              | Not applicable                                      | The plan selects and validates the removable path                                                                      |
| Clean Node 22 install without `ERESOLVE`                                            | Validated in this PR                                | Fresh install output and successful dependency tree                                                                    |
| Full Node 22 suite with Hugo running                                                | Validated in this PR                                | Nine Hugo checks, 20 functional tests, and accessibility checks                                                        |
| `tests/functional/` affected path                                                   | Implemented in this PR                              | Both suites use native dynamic import while preserving all test assertions                                             |
| Issue #286 plan                                                                     | Validated without a change                          | Historical rationale is preserved; this plan records the changed runtime conclusion                                    |
| Issue #374 plan and PR #375                                                         | Validated without a change                          | Historical pin/ignore decision is preserved; current PR removes the now-obsolete live configuration                    |
| Issue #360                                                                          | Validated without a change                          | Removing the root Babel chain eliminates rather than reintroduces its peer mismatch                                    |
| Deployment                                                                          | Intentionally out of scope                          | No deploy is requested; Netlify remains user-managed after merge                                                       |

## Analogous-Pattern Sweep

- Search scope: all root manifests and lockfile entries, Jest configuration,
  test imports, Babel configuration, Dependabot policy, workflows, and lifecycle
  plans mentioning Babel, Jest, Puppeteer, transforms, or VM modules.
- Representative query:
  `rg -n "babel|jest|puppeteer|experimental-vm-modules|transformIgnorePatterns"`.
- Result: the root Babel dependencies, one Babel config, one Jest transform
  exception, and two Dependabot ignores are the complete live root-cause set.
  The accessibility script uses plain Node and needs validation but no loader
  change. References in completed plans are historical evidence and must not be
  rewritten.

## Risks And Open Questions

- Jest still labels VM modules experimental, so the functional script must keep
  the explicit Node flag. The failure-shaped run guards against accidentally
  dropping it.
- Dynamic import makes Puppeteer initialization asynchronous, but both suites
  already use async `beforeAll` hooks, limiting the behavior change to module
  loading before browser launch.
- Lockfile removal will be large because `@babel/preset-env` owns a broad
  transitive graph. Review must prove the delta is confined to packages no
  longer reachable from another root. Jest's own transitive `@babel/core` and
  `babel-jest` packages are expected to remain; they are not direct roots or
  Dependabot targets and do not restore the removed preset transform.
- No deployment, merge, manual issue closure, or follow-up issue creation is
  authorized by this plan.

## Research Validation

- Iteration 1 approved the plan after replacing the initial assumption that Node
  22 `require(esm)` alone would satisfy Jest. Plain Node 22.23.2 reports a
  callable Puppeteer `launch`, while Jest 30.4.2 with transforms disabled fails
  both suites on Puppeteer's `export` token before running any tests.
- Installed Puppeteer 25.9.0 metadata maps both package export conditions to
  `lib/puppeteer/puppeteer.js`; the package contains no separate CommonJS build.
- The reviewed design therefore uses Jest's VM-module support and the existing
  async setup hooks instead of adding an adapter or broad package-mode change.
- The analogous-pattern sweep found no other live Babel consumer. The plan is
  approved for implementation.

## Progress Log

- 2026-08-29 - Phase 0 created the isolated `gh-issue-376` worktree on branch
  `denhamparry.co.uk/fix/gh-issue-376` from current `origin/main`.
- 2026-08-29 - Baseline Node 22.23.2 `npm ci` installed 561 packages with no
  `ERESOLVE` output and zero vulnerabilities. The transform-disabled Jest
  prototype reproduced `Unexpected token 'export'` in both functional suites.
- 2026-08-29 - Removing the three direct Babel roots reduced the clean package
  inventory by 102 packages. Jest retains internal Babel transform packages, but
  the root package metadata no longer declares them and `@babel/preset-env` is
  absent from the remaining dependency graph.
- 2026-08-29 - The native VM-module functional run passed both suites and all 20
  tests. A clean Node 22 install added 459 packages with no `ERESOLVE` output or
  vulnerabilities; the complete server-backed suite passed nine Hugo checks, 20
  functional tests, and 100 accessibility checks.

## Implementation Notes

- The functional test script now starts Jest through Node with
  `--experimental-vm-modules`. Both suites dynamically import Puppeteer inside
  their existing async `beforeAll` hooks and guard teardown when setup fails.
- Removed the three direct Babel development dependencies, the root Jest
  transform exception, and `babel.config.js`; Node 22 npm regenerated the
  lockfile from 586 to 484 package entries.
- Lockfile comparison found 102 removed entries, zero added entries, and only
  the root package record changed among retained entries. The removed graph is
  the now-unreachable preset transform subtree. Jest's internal Babel packages
  remain unchanged transitives.
- Removed only the Babel-specific comment and ignore list from the npm
  Dependabot block. The npm and GitHub Actions schedules, labels, directories,
  and commit-message settings are unchanged.

## Validation Results

- `nix shell nixpkgs#nodejs_22 -c npm ci` - passed on Node 22.23.2 with 459
  installed packages, no `ERESOLVE` output, and zero vulnerabilities.
- Root dependency assertions - passed for direct `@babel/core`,
  `@babel/preset-env`, and `babel-jest` absence; `npm ls --all` passed, and
  `npm ls @babel/preset-env --all` reports an empty tree.
- Failure-shaped Jest run without `--experimental-vm-modules` - failed as
  required with
  `A dynamic import callback was invoked without --experimental-vm-modules`;
  guarded teardown added no secondary failure.
- `npm run test:functional` with a running Hugo server - two suites and 20 tests
  passed.
- Complete Node 22 server-backed `npm test` - nine Hugo checks, 20 functional
  tests, and 100 accessibility checks passed with zero accessibility violations.
- Dependabot Ruby YAML/policy assertion and pre-commit `check yaml` - passed;
  the npm block has no `ignore` key and the GitHub Actions block is preserved.
  PyYAML was unavailable locally, so the planned Python parser was replaced by
  the equivalent installed Ruby parser plus the repository hook.
- Complete changed-plan executable-fence check - one `bash` fence inspected and
  passed `bash -n`; no placeholder normalization was required.
- `npm run test:spell` - 46 files checked with zero issues.
- `git diff --check` and `pre-commit run --all-files` - passed all configured
  whitespace, file, YAML, JSON, TOML, conflict, line-ending, executable, secret,
  Markdown, ShellCheck, cspell, and Prettier hooks.

## Branch Review

- Classification: code-relevant JavaScript test loading, dependency manifests,
  lockfile, and dependency-automation configuration, plus the lifecycle plan.
- Repo-local pre-PR review guide: not present.
- Trail of Bits `differential-review` and `supply-chain-risk-auditor` skills:
  unavailable in this session. The concrete manual fallback inspected the
  complete diff and both Puppeteer callers, verified the Node 22 CI execution
  path, compared every lockfile package record, checked installed dependency
  validity and direct-root absence, parsed the exact Dependabot semantics,
  confirmed no package, install script, registry, integrity, workflow,
  permission, credential, or unrelated update-policy addition, and exercised the
  original failure plus corrected functional and complete-suite paths.
- Final analogous-pattern sweep repeated across manifests, lockfile entries,
  Jest settings, Puppeteer imports, workflows, Babel configuration, Dependabot
  policy, and historical plans. The accessibility runner is intentionally
  different because plain Node 22 already loads Puppeteer; completed #286, #360,
  and #374 plans remain historical records. No missed live root-cause occurrence
  or independent follow-up was found.
- Review iteration 1 found one directly related failure-quality issue: failed
  setup caused `afterAll` to call `close()` on an undefined browser. Both suites
  now guard teardown, and the failure-shaped rerun confirms only the intended
  missing-VM-module error. Repeated scope and review gates then passed with no
  blocking or non-blocking finding.

## Post-PR Verification

- PR: <https://github.com/denhamparry/website/pull/381>
- Implementation head independently reviewed:
  `0918190b1a4efdf8c3b35f37e7b8bfb301d89060`.
- Local, remote branch, and GitHub PR head matched before verification. GitHub's
  stored body contained real newlines, recognized `Closes #376`, and listed
  exactly the seven planned paths.

| Issue criterion or requirement                                      | Independent evidence                                                                                                                                                                                                          | Result |
| ------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------ |
| Document whether the transform is still required                    | Re-fetched the live issue and reviewed the published decision, installed Puppeteer exports, and implementation: unchanged CommonJS Jest still fails, while native VM-module loading replaces Babel                            | Pass   |
| Confirm current Jest/Puppeteer behavior rather than relying on #286 | Fresh transform-free and missing-VM runs reproduced the parser/loader failures on Jest 30.4.2 and Puppeteer 25.9.0; plain Node 22 import remains callable                                                                     | Pass   |
| Evaluate native ESM and a CJS-compatible entry                      | Published diff uses the supported VM-module path; installed export metadata maps `import` and `require` to the same ESM file and exposes no separate CJS build                                                                | Pass   |
| Remove direct `@babel/core`, `@babel/preset-env`, and `babel-jest`  | Re-read GitHub's manifest/lockfile diff and reran root assertions; all three are absent from root metadata and `@babel/preset-env` is absent from the complete graph                                                          | Pass   |
| Delete `babel.config.js` and regenerate the lockfile                | GitHub reports the config deleted; independent lock comparison found 102 entries removed, zero added, and no retained-package change beyond the root record                                                                   | Pass   |
| Remove the Babel semantic-major ignores only                        | Re-parsed the published Dependabot YAML; the npm block has no `ignore` key while both ecosystem schedules, labels, directories, and commit prefixes remain                                                                    | Pass   |
| If Babel must stay, preserve the pin rationale                      | Not applicable because the independently verified native path passes and the root transform is removed                                                                                                                        | Pass   |
| Clean Node 22 install without `ERESOLVE`                            | Fresh post-PR Node 22.23.2 `npm ci` installed 459 packages with no `ERESOLVE` output and zero vulnerabilities; `npm ls --all` remains valid                                                                                   | Pass   |
| Full Node 22 suite with a running Hugo server                       | Fresh post-PR run passed nine Hugo checks, both functional suites and all 20 tests, and 100 accessibility checks with zero violations                                                                                         | Pass   |
| Preserve the functional assertions                                  | GitHub diff changes only Puppeteer loading and teardown safety in the two suites; all existing assertions pass unchanged                                                                                                      | Pass   |
| Reconcile #286, #360, #374, and PR #375                             | Re-read the live issue and historical plans: they remain immutable lifecycle evidence, while the current live transform and suppression are superseded                                                                        | Pass   |
| Related and analogous paths                                         | Repeated repository-wide sweep across loaders, manifests, lockfile, workflows, Dependabot, accessibility, and lifecycle plans found no missed live root cause; plain-Node accessibility is intentionally different and passes | Pass   |
| Out-of-scope deployment, merge, and manual issue closure            | No deploy, merge, manual closure, credential, secret, or unrelated repository operation occurred                                                                                                                              | Pass   |

- Independent failure-shaped validation without the VM flag failed only with the
  required dynamic-import callback error; guarded teardown introduced no
  secondary error.
- Independent corrected-behavior validation reran the complete suite rather than
  relying on the PR body or earlier local evidence.
- Outcome: all issue items pass with no blocking or new non-blocking finding.
  This plan update is evidence-only; after it is pushed, the final PR head and
  inspection of this evidence delta are recorded in the mutable PR body to avoid
  a tracked-file/SHA loop.
