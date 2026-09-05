---
status: Complete
issue: 394
date: 2026-09-05
---

<!-- cspell:words actionlint Octokit -->

# GitHub Issue #394: Paginate the Duplicate-Issue Lookup

## Problem

The outdated-page workflow makes one unpaginated `listForRepo` request before
checking for an exact issue title. The issues endpoint defaults to 30 results
and also returns pull requests, so an issue outside the first page can be missed
and a same-titled pull request can incorrectly suppress issue creation.

## Source Snapshot

- [Issue #394](https://github.com/denhamparry/website/issues/394) was fetched on
  2026-09-05 at 20:50 BST. It was open, assigned to Lewis, labelled
  `enhancement`, `ci`, and `github-actions`, and had no comments.
- The live repository had one open issue and no open pull request at that time,
  so the failure remains dormant rather than active.
- [PR #393](https://github.com/denhamparry/website/pull/393) merged as
  `1b0a629916bc29c34ba65e27d1f5db71cd5413a2`; linked issue #392 is closed and
  the merged workflow is the base for this fix.
- GitHub's
  [REST pagination documentation](https://docs.github.com/en/rest/using-the-rest-api/using-pagination-in-the-rest-api)
  documents the 30-result default for repository issues. The
  [Octokit pagination plugin](https://github.com/octokit/plugin-paginate-rest.js/blob/main/README.md)
  supports `github.paginate(github.rest.issues.listForRepo, parameters)` and a
  `per_page` value up to 100. The pinned
  [`actions/github-script` v9 documentation](https://github.com/actions/github-script/blob/main/README.md)
  confirms its injected client includes pagination support.

## Issue Traceability

| Issue item                                           | Disposition                     | Evidence target                                                         |
| ---------------------------------------------------- | ------------------------------- | ----------------------------------------------------------------------- |
| Iterate every page before creation                   | Implement in this PR            | Use `github.paginate` with `listForRepo` and `per_page: 100`            |
| Exclude pull requests                                | Implement in this PR            | Require `!issue.pull_request` in the exact-title match                  |
| Preserve exact-title behavior                        | Implement and validate          | Keep strict equality against the generated title                        |
| Matching title on a second page makes no create call | Validate without a tracked test | Execute the complete script with a temporary multi-page Octokit harness |
| Same-titled PR does not mask a missing issue         | Validate without a tracked test | The harness returns only a PR match and expects issue creation          |
| `actionlint` passes                                  | Validate without a change       | Run against the complete changed workflow                               |
| Manual dry-run completes                             | Validate after push             | Dispatch the branch with `dry_run=true` and confirm no mutation         |
| Link-check workflow uses the same pattern            | Non-blocking follow-up          | Record in the PR body; do not broaden this outdated-page fix            |
| Merge, closure, cleanup, and deploy                  | Intentionally out of scope      | Leave the PR open and use only `Closes #394` metadata                   |

## Implementation Plan

1. Fetch the flattened open-issue array once with `github.paginate`, retaining
   the current repository, state, and title inputs and adding `per_page: 100`.
2. Search the result for an exact-title item that does not expose a
   `pull_request` field.
3. Build a temporary harness around the full embedded script. Prove the base
   implementation creates a duplicate for a second-page match, then prove the
   changed implementation suppresses it, excludes PR matches, and preserves
   dry-run behavior.
4. Run workflow linting, repository tests, spelling, fence validation, diff
   hygiene, and staged pre-commit checks.

## Files Expected To Change

1. `.github/workflows/create-issues-for-outdated-pages.yml`
2. `docs/plan/issues/394_paginate_duplicate_issue_lookup.md`

## Validation Plan

```bash
nix shell nixpkgs#actionlint --command actionlint \
  .github/workflows/create-issues-for-outdated-pages.yml
nix develop --command bash -lc 'npm test'
npm run test:spell
git diff --check
pre-commit run --all-files
```

The temporary JavaScript harness will exercise the embedded script itself with
mocked GitHub methods. It must detect the base failure, then pass second-page
issue suppression, same-title pull-request exclusion, first-page compatibility,
dry-run no-mutation, and live creation scenarios. A branch dispatch provides a
safe hosted no-op check because both content pages are currently below the
14-day threshold.

## Risks And Review

- `github.paginate` returns a flattened array, unlike the prior endpoint result
  whose items were under `.data`; the harness must reject an incorrect response
  shape.
- Fetching once avoids repeating every API page for each stale content page. The
  discovered pages are unique, so retaining one snapshot does not change
  same-title behavior within a run.
- Permissions remain `contents: read` and `issues: write`; triggers, checkout
  depth, immutable action pins, environment transfer, and mutation boundaries do
  not need to change.
- The analogous unpaginated lookup in `.github/workflows/link-check.yml` has the
  same theoretical pagination and pull-request collision risk, but it generates
  one repository-wide title and is not named by issue #394. It is a separate,
  non-blocking follow-up idea.
- Research review iteration 1 approved the plan. The implementation follows the
  issue's suggested API, adds the required PR filter, and has failure, success,
  compatibility, dry-run, and live/no-op evidence targets. No blocking question
  remains.

## Outcome

Implemented the planned two-file change. The workflow now obtains one flattened
array from `github.paginate` with `per_page: 100`, then treats only non-PR items
with the exact generated title as duplicates. Existing issue creation, dry-run
logging, titles, bodies, labels, assignees, triggers, permissions, checkout
depth, and immutable action pins remain unchanged.

Validation completed on 2026-09-05:

- The full base script reproduced the defect by creating an issue when the
  matching title existed only in the harness's combined second-page data.
- The changed full-script harness passed second-page and first-page issue
  suppression, same-titled pull-request exclusion, dry-run no-mutation, and
  live-create scenarios. It also asserted one pagination call with the expected
  endpoint, repository, state, and page size.
- YAML parsing, `actionlint`, `shellcheck`, Bash fence parsing, and
  `git diff --check` passed.
- `npm test` passed 9 Hugo checks, 20 functional tests, and 100 accessibility
  checks with no violations; `npm run test:spell` checked 50 files with no
  findings.
- The final staged `pre-commit run --all-files` passed after accepting
  Prettier's plan formatting.
- The workflow-specific manual fallback for unavailable differential and action
  auditing skills found no trigger, permission, token, immutable-pin,
  checkout-depth, branch/fork, untrusted-input, API-shape, or mutation-boundary
  regression.

The analogous lookup in `.github/workflows/link-check.yml` remains a
non-blocking follow-up idea for the PR body. It is intentionally outside issue
#394's outdated-page workflow scope.
