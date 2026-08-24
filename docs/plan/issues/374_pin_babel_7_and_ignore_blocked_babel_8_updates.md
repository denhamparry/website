---
status: Complete
issue: 374
date: 2026-08-24
---

<!-- cspell:words ERESOLVE dependabot fallbacks worktree -->

# GitHub Issue #374: Pin Babel 7 and ignore blocked Babel 8 updates

## Problem Statement

Dependabot opened separate major-version updates for `@babel/core` and
`@babel/preset-env`, even though the two packages must move together. Each
half-update fails `npm ci`, and a coordinated Babel 8 update would still rely on
npm overriding the Babel 7-only peer contracts declared by the syntax plugins
below Jest's `babel-preset-current-node-syntax` dependency.

Issue #360 deliberately restored exact Babel 7.29.7 pins so the Jest transform
has a fully declared peer-dependency contract. Without a targeted Dependabot
rule, the known-blocked major updates can be reopened every week.

## Decision

Retain the exact `@babel/core@7.29.7` and `@babel/preset-env@7.29.7` pins and
ignore semantic-major Dependabot version updates for those two direct
dependencies. Minor and patch update proposals remain enabled.

Revisit Babel 8 only when either:

1. `babel-preset-current-node-syntax` and its complete transitive
   `@babel/plugin-syntax-*` set declare support for stable `@babel/core@8`; or
2. Jest removes `babel-preset-current-node-syntax` from the `babel-jest`
   transform chain.

When either condition is met, update `@babel/core` and `@babel/preset-env`
together and rerun the clean-install, peer-tree, and full-suite validation in
this plan. Replacing the Babel transform with native Jest ESM support remains a
separate, non-blocking alternative rather than part of this configuration fix.

## Acceptance Criteria

- [x] The pin/ignore/remove decision and upstream unblock condition are
      documented.
- [x] PRs #372 and #373 are closed and associated with the decision recorded in
      issue #374.
- [x] The npm ecosystem in `.github/dependabot.yml` ignores semantic-major
      updates for both `@babel/core` and `@babel/preset-env` without suppressing
      minor or patch updates.
- [x] A clean `npm ci` on Node 22.x completes without `ERESOLVE` output.
- [x] `npm ls @babel/core @babel/preset-env babel-jest     babel-preset-current-node-syntax`
      reports no invalid peers.
- [x] The full test suite passes on Node 22.x against a running Hugo server.

## Implementation Plan

1. Add dependency-specific `version-update:semver-major` ignore entries to the
   existing npm Dependabot configuration.
2. Leave `package.json`, `package-lock.json`, `babel.config.js`, and Jest's
   transform configuration unchanged so issue #360's compatible Babel 7 tree
   remains intact.
3. Validate the YAML structure, the exact ignore semantics, a clean Node 22
   install, the installed peer tree, and the complete server-backed test suite.
4. Review the final configuration diff and record branch-review and independent
   post-PR evidence in this lifecycle plan.

## Files Expected To Change

1. `.github/dependabot.yml`
2. `docs/plan/issues/374_pin_babel_7_and_ignore_blocked_babel_8_updates.md`

## Validation Plan

```bash
python3 -c "import yaml; yaml.safe_load(open('.github/dependabot.yml'))"
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

The original failure is evidenced by the failed Node 22 `npm ci` checks on PRs
#372 and #373 and will be reproduced safely with temporary manifest copies when
practical. The corrected path must retain the Babel 7 pins, install without any
`ERESOLVE` text, and produce a valid selected and complete dependency tree. A
negative scope check confirms that the manifest, lockfile, Babel configuration,
Jest configuration, other ecosystems, and non-major Babel update policy remain
unchanged.

## Issue Traceability

| Issue item                                            | Disposition                                               | Evidence target                                                                                    |
| ----------------------------------------------------- | --------------------------------------------------------- | -------------------------------------------------------------------------------------------------- |
| Decide whether to pin, ignore, or remove Babel        | Implemented in this PR                                    | Decision section retains Babel 7 pins and explains the targeted ignore policy                      |
| Close or supersede PR #372                            | Validated without a change                                | Live PR state is `CLOSED`; issue #374 records why the update is blocked                            |
| Close or supersede PR #373                            | Validated without a change                                | Live PR state is `CLOSED`; issue #374 records why the update is blocked                            |
| Ignore `@babel/core` major updates                    | Implemented in this PR                                    | npm Dependabot ignore entry with `version-update:semver-major` only                                |
| Ignore `@babel/preset-env` major updates              | Implemented in this PR                                    | npm Dependabot ignore entry with `version-update:semver-major` only                                |
| Preserve weekly npm dependency maintenance            | Validated without unrelated change                        | Existing npm schedule, labels, commit prefix, and minor/patch updates remain enabled               |
| Record the upstream unblock condition                 | Implemented in this PR                                    | Decision section covers both the complete syntax-plugin peer chain and a Jest chain change         |
| Upgrade both Babel roots together once unblocked      | Intentionally deferred until the unblock condition is met | Decision and future validation requirements are explicit                                           |
| Clean Node 22 install has no `ERESOLVE` output        | Validated in this PR                                      | Fresh `npm ci` output captured and searched                                                        |
| Selected Babel/Jest peer tree is valid                | Validated in this PR                                      | Selected `npm ls` command exits successfully without invalid peers                                 |
| Full Node 22 suite passes with Hugo running           | Validated in this PR                                      | Server-backed Hugo, functional, and accessibility tests                                            |
| `package.json` and `package-lock.json` affected paths | Validated without a change                                | Existing exact Babel 7 pins and resolved peer tree remain byte-for-byte unchanged                  |
| `babel.config.js` affected path                       | Validated without a change                                | It does not set Babel 8's removed `useBuiltIns` option and needs no change while pinned to Babel 7 |
| Issue #360 and commit `58eb9e34`                      | Validated without a change                                | Current default branch contains the deliberate Babel 7 alignment and its completed plan            |
| Issue #286 transform origin                           | Validated without a change                                | Babel remains required by the current Jest/Puppeteer ESM transform design                          |
| Remove Babel by adopting native Jest ESM handling     | Non-blocking follow-up idea                               | Requires a separate design and test migration; no follow-up issue is created by default            |

## Analogous-Pattern Sweep

- Search scope: every direct Babel/Jest dependency, Babel peer declaration in
  `package-lock.json`, Babel configuration, Dependabot ecosystem block, and
  existing dependency plans.
- Representative queries: repository-wide searches for `@babel/core`,
  `@babel/preset-env`, `babel-preset-current-node-syntax`, `babel-jest`,
  `ignore:`, and `version-update`.
- Initial result: the two root Babel packages are the only direct packages that
  form the blocked coordinated major update. The npm ecosystem has no existing
  ignore rules, and other package ecosystems are intentionally unrelated.

## Risks And Open Questions

- An indefinite ignore could hide a future compatible Babel 8 path. The narrow
  major-only rule and documented unblock condition make the reason and review
  trigger explicit while preserving minor and patch proposals.
- Dependabot configuration is consumed remotely. Local validation can prove YAML
  and policy shape, while GitHub is the authority for runtime behavior.
- Registry metadata can change after this dated decision; future migration work
  must re-query every peer contract rather than assume this snapshot is current.
- No deployment is requested or described by the issue.

## Research Validation

- Iteration 1 approved the plan without substantive revision.
- The freshly fetched issue is open, and every acceptance criterion, suggested
  action, affected path, reference, conditional requirement, and explicit
  alternative is represented in the traceability table.
- GitHub's current Dependabot options reference confirms that an `ignore` entry
  can combine an exact npm `dependency-name` with `version-update:semver-major`,
  leaving other semantic update levels enabled.
- Temporary archives of the exact PR #372 and #373 heads reproduced non-zero
  Node 22 `npm ci` failures with `ERESOLVE`: the core-only branch conflicts with
  `@babel/preset-env@7.29.7`, and the preset-only branch requires
  `@babel/core@^8.0.0` while the root remains on 7.29.7.
- A temporary coordinated manifest using `@babel/core@8.0.1` and
  `@babel/preset-env@8.0.2` generated a lockfile only by emitting repeated
  `ERESOLVE overriding peer dependency` warnings. This deterministically
  confirms that pairing the updates does not restore the declared peer contract.
- Registry metadata on 2026-08-24 confirms
  `babel-preset-current-node-syntax@1.2.0` remains latest and all 15 of its
  current `@babel/plugin-syntax-*` dependencies still declare only
  `@babel/core@^7.0.0-0`.
- The analogous-pattern sweep found only the two issue-named direct Babel roots
  in the coordinated major-update pattern. `babel.config.js` does not use
  `useBuiltIns`; other dependencies and the GitHub Actions ecosystem are
  intentionally different.
- Failure-shaped validation now covers both failed half-updates, the warned
  paired update, the retained clean Babel 7 install, and negative scope checks.
- Review outcome: approved for implementation.

## Implementation Notes

- Added two exact dependency-name entries to the existing npm Dependabot
  ecosystem, each ignoring only `version-update:semver-major`.
- Added an adjacent explanation and plan link so the rule's upstream reason and
  removal trigger are discoverable from the configuration.
- Left the npm schedule, labels, commit prefix, GitHub Actions ecosystem,
  package manifest, lockfile, Babel configuration, Jest configuration, and all
  dependency versions unchanged.
- Planned and actual paths match exactly: `.github/dependabot.yml` and this
  lifecycle plan.

## Validation Results

- Ruby YAML parsing and a structural assertion passed: the npm block contains
  exactly the two planned major-only ignore entries, retains its weekly
  schedule, and every pre-existing npm and GitHub Actions setting is unchanged.
- `pre-commit run check-yaml --files .github/dependabot.yml` passed.
- Clean `npm ci` on Node 22.23.2 installed 561 packages, reported zero
  vulnerabilities, and emitted no `ERESOLVE` text.
- The selected Babel/Jest `npm ls` command and `npm ls --all` both passed. The
  root and complete transform chain resolve valid `@babel/core@7.29.7` peers.
- The full Node 22 server-backed suite passed nine Hugo checks, 20 functional
  tests, and 100 accessibility checks with zero violations.
- The first suite attempt correctly exposed an uninitialised PaperMod submodule
  in the new worktree by producing no HTML. After initialising the repository's
  pinned submodule commit, the unchanged CI-equivalent command passed.
- `npm run test:spell` passed all 45 checked files, and `git diff --check`
  passed.
- Full staged `pre-commit run --all-files` passed every hook after Prettier
  normalised this plan and two technical spelling terms were declared.
- The plan's one complete-file `bash` fence passed `bash -n`; it has no
  placeholders requiring normalisation, and its material commands were run.
- Negative scope checks confirm `package.json`, `package-lock.json`,
  `babel.config.js`, the rest of the npm settings, and all other Dependabot
  ecosystems are unchanged.

## Branch Review

- Classification: code-relevant dependency automation and supply-chain
  configuration plus its lifecycle plan.
- Repo-local `docs/pre-pr-branch-review.md`: not present.
- `differential-review` and `supply-chain-risk-auditor` skills: unavailable in
  this session; performed the workflow reference's concrete manual fallbacks.
- Differential review inspected the complete configuration and plan diff, exact
  dependency names, ignore semantics, base/head scope, live issue and prior-PR
  state, shell-bearing Markdown, unchanged related files, and all affected
  validation paths.
- Supply-chain review confirmed the rule changes no package version, registry,
  integrity value, lockfile edge, install script, credential, action, or
  workflow permission. It suppresses only the two known-blocked semantic-major
  version proposals while preserving the current Babel 7 peer contract and all
  unrelated dependency maintenance configuration.
- The final analogous-pattern sweep again covered every direct Babel/Jest
  dependency, Babel peer declaration, Babel configuration path, Dependabot
  ecosystem, and related plan. No missed in-scope major-update pair or
  independently broken adjacent configuration was found.
- Failure, success, and negative/no-op evidence all match the approved plan.
- No blocking findings were identified.

## Follow-Up Ideas

- Non-blocking: evaluate native Jest ESM handling for Puppeteer in a separate
  change so the Babel transform and dependency subtree could potentially be
  removed. No follow-up issue is created in the workflow's default mode.

## Post-PR Verification

Independent issue-to-PR verification reviewed implementation head
`be7367369d4f5ab24c1ca0f5a199f7f1574c1036` from PR #375 and confirmed the local,
remote, and GitHub heads matched before review.

| Criterion or issue item                                             | Independent evidence                                                                                                                                                                 | Result |
| ------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------ |
| Pin/ignore/remove decision exists                                   | Re-read the PR plan from the GitHub head; it explicitly retains exact Babel 7 pins, applies major-only ignores, and rejects an undeclared peer override                              | Pass   |
| PR #372 is closed and references the decision                       | Re-fetched live PR state and comments; it is closed in favour of issue #374 with the peer-contract rationale                                                                         | Pass   |
| PR #373 is closed and references the decision                       | Re-fetched live PR state and comments; it is closed in favour of issue #374 with the mirrored peer-contract rationale                                                                | Pass   |
| Both Babel major updates are ignored narrowly                       | Re-parsed the PR configuration independently; the npm block has exactly two matching `dependency-name` entries and each has only `version-update:semver-major`                       | Pass   |
| Minor, patch, and unrelated maintenance remain configured           | Compared parsed base and PR configurations; the pre-existing npm schedule, labels, commit prefix, and complete GitHub Actions ecosystem are identical                                | Pass   |
| Upstream unblock condition remains accurate                         | Re-queried the registry: `babel-preset-current-node-syntax@1.2.0` is latest and all 15 current syntax-plugin dependencies still declare Babel 7-only core peers                      | Pass   |
| Clean Node 22 install has no peer override                          | Independently reran `npm ci` on Node 22; 561 packages installed with zero vulnerabilities and no `ERESOLVE` text                                                                     | Pass   |
| Babel/Jest peer trees are valid                                     | Independently reran both the selected Babel/Jest `npm ls` command and `npm ls --all`; both exited successfully with the complete chain on valid `@babel/core@7.29.7` peers           | Pass   |
| Full Node 22 suite passes with Hugo running                         | Independently reran the server-backed suite; nine Hugo checks, 20 functional tests, and 100 accessibility checks passed with zero violations                                         | Pass   |
| Affected package, lockfile, and Babel config paths remain unchanged | Re-read the complete GitHub diff and negative-scope assertions; only the Dependabot configuration and lifecycle plan change, and `babel.config.js` still has no `useBuiltIns` option | Pass   |
| Future Babel 8 migration remains coordinated                        | Re-read the decision and traceability; both roots must move together only after the full peer chain changes, followed by the named install/tree/suite checks                         | Pass   |
| Native Jest ESM alternative remains outside this fix                | Reconciled the issue's alternative with the plan and PR body; it is retained as one non-blocking follow-up idea without expanding this PR                                            | Pass   |

- Repeated the analogous-pattern sweep across every direct Babel/Jest
  dependency, Babel peer declaration, related configuration path, Dependabot
  ecosystem, and prior plan; no missed in-scope occurrence was found.
- Independently validated the complete changed Markdown shell fence, YAML, PR
  path set, base/head diff, closing relationship, and negative/no-op scope.
- Outcome: no blocking or new non-blocking findings. The previously identified
  native Jest ESM alternative remains the sole follow-up idea.
