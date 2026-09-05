---
status: Complete
issue: 392
date: 2026-09-05
---

<!-- cspell:words actionlint argjson GitHub Octokit -->

# GitHub Issue #392: Enrich Outdated-Page Review Issues

## Problem

The scheduled outdated-page workflow currently passes only a comma-separated
page list to its issue-creation step and generates a fixed “This page requires
review” body. Issue [#392](https://github.com/denhamparry/website/issues/392)
requires each generated issue to explain why the page was flagged and what a
completed review must prove.

## Source Snapshot

- Issue #392 was fetched on 2026-09-05. It was open, assigned to Lewis, labelled
  `enhancement`, `ci`, and `github-actions`, and had no comments.
- The live workflow uses `MODIFIED_DAYS: 14`, calculates age from the page's
  latest git commit, checks for an exact open-issue title, and supports
  scheduled and manual dispatches.
- The latest scheduled run was successful at main commit
  `5729716745a9bd7175d477464b7eb4532f8d6777` on 2026-09-05, but issues #388 and
  #389 confirm that its generated body contains no page or staleness details.
- GitHub's current
  [workflow syntax documentation](https://docs.github.com/en/actions/reference/workflows-and-actions/workflow-syntax)
  states that `workflow_dispatch` inputs can use Boolean types and the `inputs`
  context preserves Boolean values. GitHub also documents single-line step
  outputs through
  [`$GITHUB_OUTPUT`](https://docs.github.com/en/actions/reference/workflows-and-actions/workflow-commands-for-github-actions);
  a compact JSON value is safe for this metadata.
- The pinned
  [`actions/github-script` v9 documentation](https://github.com/actions/github-script/blob/main/README.md)
  recommends passing values through environment variables rather than
  interpolating expressions directly into the JavaScript body.

## Acceptance Criteria And Traceability

| Issue item                             | Disposition                | Evidence target                                                              |
| -------------------------------------- | -------------------------- | ---------------------------------------------------------------------------- |
| Body includes page path                | Implement in this PR       | Render the repository-relative path as inline code                           |
| Body includes last-commit date         | Implement in this PR       | Finder emits an ISO date for each page                                       |
| Body includes days since commit        | Implement in this PR       | Finder emits its existing age calculation per page                           |
| Body includes configured threshold     | Implement in this PR       | Pass `MODIFIED_DAYS` to `github-script` and render it                        |
| Body includes an acceptance checklist  | Implement in this PR       | Add content, `reviewed`, Hugo build, and PR-closing items                    |
| At most one open issue per page        | Preserve and validate      | Keep the exact-title `listForRepo`/`find` check                              |
| Dry-run dispatch logs the new body     | Implement and validate     | Add a Boolean manual input and log every generated body before mutation      |
| Optionally show `reviewed` frontmatter | Intentionally out of scope | The issue marks this optional; commit metadata supplies every required field |
| Merge, issue closure, or deployment    | Intentionally out of scope | Leave the PR open; use `Closes #392` only in PR metadata                     |

## Implementation Plan

1. Add a `workflow_dispatch.inputs.dry_run` Boolean input that defaults to true,
   while scheduled executions continue with dry-run disabled.
2. Replace the comma-separated output with a compact JSON array containing
   `path`, `lastCommitDate`, and `daysSinceCommit` for every outdated page.
3. Parse the JSON in `github-script`, build the detailed Markdown body using the
   configured threshold, and log it for both live and dry-run paths.
4. Preserve the existing exact-title duplicate lookup and issue-create fields.
5. Exercise the base failure and corrected behavior with deterministic shell and
   mocked-Octokit harnesses, then run workflow, repository, fence, and staged
   pre-commit validation.

## Files Expected To Change

1. `.github/workflows/create-issues-for-outdated-pages.yml`
2. `docs/plan/issues/392_enrich_outdated_page_review_issues.md`

## Validation Plan

```bash
nix shell nixpkgs#actionlint --command actionlint \
  .github/workflows/create-issues-for-outdated-pages.yml
shellcheck /tmp/find-outdated-pages.sh
nix develop --command bash -lc 'npm test'
npm run test:spell
git diff --check
pre-commit run --all-files
```

The finder step will also run locally with a forced threshold and a temporary
`GITHUB_OUTPUT`; its JSON must contain every required field. A Node harness will
execute the complete `github-script` body with mocked API calls and cover dry
run, an existing exact-title duplicate, and one live creation. The same body
assertion must reject the base workflow before it is accepted for the changed
workflow.

## Risks And Boundaries

- Repository paths are git-controlled but still pass through shell, JSON,
  environment, JavaScript, and Markdown layers. Null-delimited discovery,
  `jq --arg`, compact JSON, and environment-variable transfer preserve the path
  without evaluating it.
- The workflow retains only `contents: read` and `issues: write`; no token,
  checkout, fork, or third-party action boundary needs to expand.
- The existing issue listing is not paginated. Issue #392 explicitly requires
  retention of the current exact-title duplicate behavior, so pagination is not
  broadened in this focused change.
- Live issue creation is not needed for validation. Dry-run and mocked API
  checks prove the body and mutation boundaries without creating repository
  noise.

## Research Review

- Iteration 1 found that keeping a comma-separated page list would require a
  second keyed output and risk mismatched ordering. One JSON array binds every
  page to its dates and is easier to validate atomically.
- Iteration 2 added a typed manual `dry_run` input. This makes the issue's
  workflow-dispatch acceptance criterion reproducible without editing the
  workflow or risking live issue creation; scheduled runs explicitly evaluate to
  false.
- The planned body matches every required checklist item, keeps exact titles,
  labels, assignees, and API calls intact, and logs before the duplicate branch
  so a dry run still shows the proposed body when an issue already exists.
- Review outcome: approved. No blocking open question remains.

## Outcome

Implemented the issue-body enrichment in the planned two-file scope. Manual
dispatches now expose a Boolean `dry_run` input that defaults to true, while
scheduled runs remain live. The finder emits compact per-page JSON containing
the path, last-commit date, and age; the issue step logs and uses that metadata
to render the requested context and four-item acceptance checklist. Exact-title
duplicate suppression, labels, assignees, checkout history, and permissions are
unchanged.

Validation completed on 2026-09-05:

- Failure-shaped assertions rejected the base workflow for its missing staleness
  details and acceptance checklist.
- The finder produced schema-valid JSON for both current content pages under a
  forced threshold and emitted no output under a no-op threshold.
- A mocked GitHub API harness passed dry-run, exact-title duplicate, and live
  creation scenarios without making external mutations.
- `actionlint`, `shellcheck`, YAML parsing, Bash fence parsing,
  `git diff --check`, and `npm run test:spell` passed.
- `npm test` passed 9 Hugo checks, 20 functional tests, and 100 accessibility
  checks with no violations.
- `pre-commit run --all-files` passed every configured hook after Prettier's
  formatting was accepted and the workflow's `jq --argjson` option was added to
  its inline spelling allow-list.
- The workflow-specific review found no trigger, permission, immutable-action,
  fetch-depth, fork/base, untrusted-input, or dry-run boundary regression. The
  repository's other `github-script` workflow handles link-check failures and
  does not share this issue-generation contract. Dedicated action-auditor and
  differential-review skills were unavailable, so the same checks were completed
  manually with no findings.
