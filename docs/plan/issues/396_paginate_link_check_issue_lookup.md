---
status: Complete
issue: 396
date: 2026-09-05
---

<!-- cspell:words actionlint Octokit -->

# GitHub Issue #396: Paginate the Link-Check Issue Lookup

## Problem

The monthly link-check workflow makes one unpaginated `listForRepo` request
before checking for the exact automated issue title. Repository issue listings
also include pull requests, so an issue outside the first page can be missed and
a same-titled pull request can incorrectly suppress issue creation.

## Source Snapshot

- [Issue #396](https://github.com/denhamparry/website/issues/396) was fetched on
  2026-09-05 at 21:08 BST. It was open, assigned to Lewis, labelled
  `enhancement`, `ci`, and `github-actions`, and had no comments.
- The live repository had one open issue and no open pull requests at that time,
  so the failure is dormant rather than active.
- [PR #395](https://github.com/denhamparry/website/pull/395) merged as
  `f51d222e48d1397070d310bfcc9cbd4a1124230e`; linked issue #394 is closed and
  its analogous outdated-page fix is the base for this change.
- GitHub's
  [REST pagination documentation](https://docs.github.com/en/rest/using-the-rest-api/using-pagination-in-the-rest-api)
  explains REST pagination. The
  [Octokit pagination plugin](https://github.com/octokit/plugin-paginate-rest.js/blob/main/README.md)
  supports `github.paginate(github.rest.issues.listForRepo, parameters)`. The
  pinned
  [`actions/github-script` v9 documentation](https://github.com/actions/github-script/blob/main/README.md)
  confirms its injected client includes pagination support.

## Issue Traceability

| Issue item                                      | Disposition                     | Evidence target                                                     |
| ----------------------------------------------- | ------------------------------- | ------------------------------------------------------------------- |
| Iterate every page before creation              | Implement in this PR            | Use `github.paginate` with `listForRepo` and `per_page: 100`        |
| Exclude pull requests                           | Implement in this PR            | Require `!issue.pull_request` in the exact-title match              |
| Preserve exact-title behavior                   | Implement and validate          | Keep strict equality against the existing automated title           |
| Second-page issue prevents creation             | Validate without a tracked test | Execute the full script with a temporary multi-page Octokit harness |
| Same-titled PR does not suppress creation       | Validate without a tracked test | Harness returns only a PR match and expects one issue creation      |
| Existing issue receives the established comment | Validate without a tracked test | Harness checks first- and second-page issue comment behavior        |
| `actionlint` passes                             | Validate without a change       | Run against the complete changed workflow                           |
| Hosted workflow behavior remains sound          | Validate after push             | Dispatch the branch and verify success without issue mutation       |
| Merge, closure, cleanup, and deploy             | Intentionally out of scope      | Leave the PR open and use only `Closes #396` metadata               |

## Implementation Plan

1. Replace the single response-object request with the flattened array returned
   by `github.paginate`, retaining repository and state inputs and adding
   `per_page: 100`.
2. Search the array for an exact-title item that does not expose a
   `pull_request` field, leaving existing comment and creation behavior intact.
3. Build a temporary harness around the complete embedded script. Prove the base
   implementation creates a duplicate for a second-page match, then prove the
   changed implementation suppresses it, excludes pull-request matches, and
   preserves first-page, comment, and no-match behavior.
4. Run workflow linting, repository tests, spelling, fence validation, diff
   hygiene, staged pre-commit checks, and a hosted branch dispatch.

## Files Expected To Change

1. `.github/workflows/link-check.yml`
2. `docs/plan/issues/396_paginate_link_check_issue_lookup.md`

## Validation Plan

```bash
nix shell nixpkgs#actionlint --command actionlint \
  .github/workflows/link-check.yml
nix develop --command bash -lc 'npm test'
npm run test:spell
git diff --check
pre-commit run --all-files
```

The temporary JavaScript harness will execute the embedded script with mocked
GitHub methods. It must detect the base failure, then pass second-page and
first-page issue matching, same-title pull-request exclusion, and no-match issue
creation. It will also assert the pagination endpoint and parameters and the
existing comment behavior. A manual branch dispatch will validate the hosted
workflow path; because the issue-management step runs only when link checking
fails, the open automated-issue count will be compared before and after.

## Risks And Review

- `github.paginate` returns a flattened array, unlike the prior endpoint result
  whose items were under `.data`; the harness must reject an incorrect response
  shape.
- The change must preserve the established behavior of commenting on an existing
  issue after each failed monthly run rather than silently returning.
- Permissions remain `contents: read` and `issues: write`; triggers, checkout,
  immutable action pins, environment transfer, and mutation boundaries do not
  need to change.
- The analogous runtime workflow is already fixed by merged PR #395. Historical
  plan examples retain their original snippets and are not executable paths.
- Research review iteration 1 approved the plan. The implementation follows the
  issue's suggested API, covers both acceptance scenarios and compatibility
  behavior, and has deterministic local plus hosted validation targets. No
  blocking question remains.

## Outcome

Implemented the planned two-file change. The link-check workflow now obtains a
flattened array from `github.paginate` with `per_page: 100`, then treats only
non-PR items with the exact automated title as duplicates. Existing issue
commenting and creation, titles, bodies, labels, assignees, triggers,
permissions, checkout behavior, and immutable action pins remain unchanged.

Validation completed on 2026-09-05:

- The full base script reproduced the defect by creating an issue when the
  matching title existed only in the harness's second-page data.
- The changed full-script harness passed second-page and first-page issue
  matching, same-titled pull-request exclusion, and no-match issue creation. It
  also asserted the pagination endpoint and parameters and the existing comment
  target.
- YAML parsing, changed and repository-wide `actionlint`, immutable-action-pin
  checks, Bash-fence parsing, and `git diff --check` passed. The workflow has no
  shell `run` steps requiring ShellCheck.
- The first direct `npm test` attempt passed the Hugo checks but demonstrated
  that browser tests require the documented local server. With Hugo running on
  port 1313, the complete suite passed 9 Hugo checks, 20 functional tests, and
  100 accessibility checks with no violations.
- `npm run test:spell` checked 51 files with no findings, and a clean `npm ci`
  reported zero vulnerabilities.
- The final staged `pre-commit run --all-files` passed after accepting the
  plan's mechanical Prettier formatting.
- The workflow-specific manual fallback for unavailable differential and action
  auditing skills found no trigger, permission, token, immutable-pin, checkout,
  branch/fork, untrusted-input, API-shape, or mutation-boundary regression.

The analogous executable lookup in the outdated-page workflow is already fixed
on `main`; the remaining unpaginated snippet is historical plan documentation.
No follow-up implementation is required from this review.
