---
status: Complete
issue: 360
date: 2026-08-20
---

<!-- cspell:words ERESOLVE inflight worktree -->

# GitHub Issue #360: Resolve Babel 8 and Jest Babel 7 peer dependency warnings

## Problem Statement

The root test package pins Babel 8, while Jest 30's current
`babel-preset-current-node-syntax` dependency still installs Babel 7 syntax
plugins whose peer ranges accept only Babel 7. A clean Node 22 `npm ci`
therefore succeeds by overriding those peer contracts and prints repeated
`ERESOLVE overriding peer dependency` warnings.

The mismatch is in the Babel transform used to load Puppeteer's ESM entry in
Jest. Leaving the override in place makes the test toolchain depend on behavior
outside the installed plugins' declared compatibility contract.

## Acceptance Criteria

- [x] A clean `npm ci` completes without `ERESOLVE overriding peer dependency`
      warnings.
- [x] The full test suite passes on Node 22.x after the change.

## Solution Design

1. Align the direct Babel transform dependencies to the latest Babel 7 releases
   (`@babel/core@7.29.7` and `@babel/preset-env@7.29.7`).
2. Keep Jest and `babel-jest` at their current latest releases because their
   current peer ranges already accept Babel 7, while their
   `babel-preset-current-node-syntax` chain has no release whose complete plugin
   set accepts stable Babel 8.
3. Regenerate `package-lock.json` with Node 22 and npm, preserving exact root
   versions and reviewing the dependency-graph delta for unrelated churn.
4. Leave `babel.config.js` and Jest's Puppeteer transform configuration
   unchanged unless validation shows a Babel 7 compatibility problem.

## Implementation Plan

1. Replace the two direct Babel 8 pins with the latest compatible Babel 7 pins
   using Node 22 npm so the manifest and lockfile remain synchronized.
2. Run a clean Node 22 install and verify the original `ERESOLVE` warning is
   absent while the resolved Babel/Jest peer tree is valid.
3. Run the full repository test suite and spelling checks under Node 22, then
   inspect the complete dependency diff and staged pre-commit result.
4. Record branch-review and independent post-PR verification evidence in this
   lifecycle plan.

## Files Expected To Change

1. `package.json`
2. `package-lock.json`
3. `docs/plan/issues/360_resolve_babel_8_and_jest_babel_7_peer_dependency_warnings.md`

## Validation Plan

```bash
nix shell nixpkgs#nodejs_22 -c npm ci
nix shell nixpkgs#nodejs_22 -c npm ls @babel/core @babel/preset-env babel-jest babel-preset-current-node-syntax
nix shell nixpkgs#nodejs_22 nixpkgs#hugo -c bash -c \
  'hugo server --bind 127.0.0.1 & server_pid=$!; \
  trap '\''kill "$server_pid" 2>/dev/null || true'\'' EXIT; \
  until curl -fsS http://127.0.0.1:1313/ >/dev/null; do sleep 1; done; \
  npm test'
nix shell nixpkgs#nodejs_22 -c npm run test:spell
git diff --check
pre-commit run --all-files
```

The first command must have no `ERESOLVE overriding peer dependency` output. The
dependency-tree command must exit successfully without invalid peers, and the
full test suite must pass on Node 22.x.

## Issue Traceability

| Issue item                                                      | Disposition                          | Evidence target                                                                                                     |
| --------------------------------------------------------------- | ------------------------------------ | ------------------------------------------------------------------------------------------------------------------- |
| Clean `npm ci` has no `ERESOLVE` override warnings              | Implemented and validated in this PR | Fresh Node 22 install output                                                                                        |
| Full test suite passes on Node 22.x                             | Validated in this PR                 | Node 22 Hugo, functional, and accessibility suite                                                                   |
| Investigate whether the Jest toolchain supports Babel 8 cleanly | Validated without a change to Jest   | npm registry metadata and installed peer ranges for Jest, `babel-jest`, `babel-preset-jest`, and the syntax plugins |
| Align Babel or update Jest to a compatible chain                | Implemented in this PR               | Direct Babel 7 pins accepted by Jest 30 and all current syntax-plugin peers                                         |
| `package.json` affected path                                    | Implemented in this PR               | Exact direct dependency changes only                                                                                |
| `package-lock.json` affected path                               | Implemented in this PR               | npm-generated dependency graph with no invalid peer overrides                                                       |
| PR #358 and issue #353 context                                  | Validated without a change           | Current default branch already enforces Node `>=22`; this change preserves that runtime policy                      |
| Future Jest or Babel upgrades                                   | Intentionally out of scope           | Dependabot and later dependency maintenance can revisit stable Babel 8 support when the full chain declares it      |

## Risks And Open Questions

- Babel 8 was a deliberate dependency update, so moving the transform back to
  Babel 7 trades the newest major release for a fully declared compatibility
  contract. The transform exists only in the development test suite, and full
  behavior validation is required.
- Moving the root transform from Babel 8 to Babel 7 rewrites a substantial
  dependency subtree. The lockfile review must distinguish expected
  deduplication from unrelated package churn and confirm no invalid peer edges
  remain.
- `@babel/core@7.29.7` and `@babel/preset-env@7.29.7` were the latest Babel 7
  releases returned by the npm registry on 2026-08-20. Future versions are not
  part of this PR.
- No deployment is requested or described by this plan.

## Research Validation

- Iteration 1 approved the plan without substantive revision.
- Failure-shaped reproduction under Node 22.23.1 and npm 11.7.0 produced the
  issue's repeated `ERESOLVE overriding peer dependency` blocks while the
  install otherwise completed successfully with zero audit findings.
- Repository search found one Babel configuration and one reason for the root
  Babel dependencies: the Jest transform introduced for Puppeteer's ESM entry in
  issue #286. No production Hugo path uses Babel.
- npm registry metadata on 2026-08-20 shows Jest 30.4.2 and `babel-jest` 30.4.1
  are already current. `babel-jest` accepts `@babel/core ^7.11.0` or Babel 8,
  but `babel-preset-current-node-syntax@1.2.0` installs multiple syntax plugins
  with `@babel/core ^7.0.0-0` peers. Updating Jest therefore cannot remove the
  stable-Babel-8 mismatch today.
- The same registry metadata identifies Babel 7.29.7 as the latest Babel 7
  release for both direct packages. Those versions satisfy `babel-jest`,
  `babel-preset-jest`, `babel-preset-current-node-syntax`, and its Babel 7
  syntax plugins.
- The analogous-pattern sweep covered every root Babel declaration,
  `babel.config.js`, Jest configuration, all lockfile `@babel/core` peer ranges,
  and the earlier issue #286 plan. The two direct Babel pins are the only
  current root-cause occurrence; nested Babel 7 copies are expected transitive
  dependencies rather than independent bugs.
- Review outcome: approved for implementation.

## Implementation Notes

- Replaced the direct `@babel/core@8.0.1` and `@babel/preset-env@8.0.2`
  development dependencies with exact 7.29.7 pins through Node 22 npm.
  `babel.config.js`, Jest configuration, test code, npm policy, and runtime pins
  remain unchanged.
- npm regenerated the Babel transform subtree: the lockfile package inventory
  falls from 805 to 586 entries, with 244 removed nodes, 25 expected Babel 7
  support nodes added, and 80 version changes. The changes are confined to the
  Babel/preset dependency graph and its Browserslist compatibility data; all
  resolved artifacts use `https://registry.npmjs.org/`.
- Planned and actual tracked paths match exactly: the two npm manifests and this
  lifecycle plan.

## Validation Results

- Failure-shaped pre-change Node 22 install - reproduced the repeated
  `ERESOLVE overriding peer dependency` blocks against the Babel 7 syntax
  plugins while installation otherwise succeeded.
- Corrected Node 22.23.2/npm 10.9.8 `npm ci` - passed with 561 installed
  packages, zero vulnerabilities, and no `ERESOLVE` output. Only pre-existing
  npm deprecation notices for `inflight` and old `glob` releases remain.
- `npm ls @babel/core @babel/preset-env babel-jest babel-preset-current-node-syntax`
  and `npm ls --all` - passed. The root, `babel-jest`, Jest transforms, preset,
  and every syntax plugin now share the valid deduplicated `@babel/core@7.29.7`
  peer.
- Initial bare `npm test` - Hugo's nine build checks passed, then all 20
  functional tests failed with `ERR_CONNECTION_REFUSED` because the repository
  browser tests require a server on port 1313. This was a harness precondition,
  not an implementation failure.
- Server-backed full Node 22 suite - passed nine Hugo checks, 20 functional
  tests, and 100 accessibility checks with zero violations.
- `npm run test:spell` - passed all 43 checked files.
- `npm audit --audit-level=high` - passed with zero vulnerabilities.
- Lockfile integrity/scope inspection - found no non-npm registry artifacts; the
  package inventory and version changes are confined to the direct Babel
  downgrade, expected Babel 7 helpers/plugins, and Babel's Browserslist data.
- Staged `pre-commit run --all-files` - the first pass had Prettier normalize
  this plan and cspell reject the package name `inflight`; the term was added to
  the file-local dictionary, the formatter output was inspected and restaged,
  and the complete hook suite then passed without further modification.
- Hosted Conform initially rejected the evidence-only commit's `docs(plan)`
  scope because this repository permits only `website`, `content`, `tests`,
  `ci`, and `deps`. The implementation tree remained unchanged; the evidence
  commit was amended to the allowed `docs(tests)` scope and pushed with a
  branch-scoped force-with-lease.
- `git diff --check` - passed.

## Branch Review

- Classification: code-relevant npm manifest, lockfile, and supply-chain
  metadata plus this lifecycle plan.
- Repo-local `docs/pre-pr-branch-review.md`: not present.
- `differential-review` and `supply-chain-risk-auditor` skills: unavailable in
  this session; performed the workflow reference's concrete manual fallback
  reviews against `origin/main`.
- Differential review inspected the complete manifest change, the full
  npm-generated package inventory, Babel configuration, Jest transform path,
  affected browser tests, issue #286 provenance, supported Node runtime, and the
  failure/success evidence. The transform behavior is exercised by all 20
  passing Puppeteer functional tests.
- Supply-chain review confirmed every resolved artifact remains on the npm
  registry and has an integrity value, the three existing install-script
  packages are unchanged, no Babel 8 package remains installed, a second
  package-lock-only regeneration is stable, `npm ls --all` has no invalid peer,
  and `npm audit` reports zero vulnerabilities.
- The final analogous-pattern sweep covered the root manifest, lockfile,
  `babel.config.js`, Jest configuration, all `@babel/core` peer declarations,
  and the issue #286 plan. The two direct pins are the sole root-cause
  occurrence; no adjacent production or test configuration needs a change.
- The changed plan contains one executable Bash fence. The complete fence was
  extracted and passed `bash -n`; no placeholders required normalization.
- The initial serverless full-suite failure is pre-existing harness behavior and
  was rerun with the required local Hugo server. It does not require a code
  change or follow-up.
- No blocking or non-blocking findings were identified.

## Post-PR Verification

Independent issue-to-PR verification reviewed implementation head
`856a110afb88dad90fadf6b9955f46c5e628aa54` from PR #367 and confirmed the local,
remote, and GitHub heads matched before review.

| Criterion or issue item                                   | Independent evidence                                                                                                                                                                              | Result |
| --------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------ |
| Clean `npm ci` has no `ERESOLVE` override warnings        | Re-ran Node 22 `npm ci` from the exact PR head; it installed 561 packages with only unrelated deprecation notices and zero `ERESOLVE` output                                                      | Pass   |
| Full test suite passes on Node 22.x                       | Independently reran the server-backed suite: nine Hugo checks, 20 functional tests, and 100 accessibility checks passed                                                                           | Pass   |
| Jest/Babel 8 support was investigated                     | Re-read the current registry peer metadata and live lockfile chain: current Jest accepts Babel 7, while the syntax plugins still require Babel 7 and no Babel 8 package node remains              | Pass   |
| Babel dependencies are aligned to the declared peer chain | Parsed both npm manifests and reran the selected and complete `npm ls` trees; all transform consumers resolve valid `@babel/core@7.29.7` peers                                                    | Pass   |
| Affected manifests are synchronized                       | Re-read the complete PR diff and parsed the root lock entry; both direct packages are exactly 7.29.7 in `package.json` and `package-lock.json`                                                    | Pass   |
| Dependency graph is safe and scoped                       | Rechecked registry URLs, integrity fields, install-script packages, package inventory, stable lock regeneration, and `npm audit`; no unrelated script or registry change and zero vulnerabilities | Pass   |
| PR #358 and issue #353 context is preserved               | Re-fetched live issue #360 and PR #367 and revisited the current Node 22 engine policy; this dependency-only change leaves the earlier runtime enforcement intact                                 | Pass   |
| Future Babel/Jest upgrades remain out of scope            | Rechecked the issue and diff; no speculative override, Jest upgrade, runtime change, production Hugo change, or deploy work was added                                                             | Pass   |

- Repeated the analogous-pattern sweep across the root manifest, full lockfile,
  Babel configuration, Jest configuration, issue #286 provenance, and every
  installed `@babel/core` occurrence. No missed in-scope or independently broken
  occurrence was found.
- Independently checked the important failure and success shapes: the original
  head emitted repeated peer overrides, while the PR head installs cleanly and
  exercises the Puppeteer ESM transform through all 20 passing functional tests.
- Outcome: the blocking commit-policy finding was corrected without changing
  implementation behavior and documented on the PR. No issue-to-implementation
  finding or non-blocking follow-up remains.
