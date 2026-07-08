<!-- cspell:words worktree -->

# GitHub Issue #328: Generated PR bodies use literal newline escapes

**Issue:** [#328](https://github.com/denhamparry/website/issues/328) **Status:**
Complete **Date:** 2026-07-08

## Problem Statement

Some PRs created by the plan/Codex PR-authoring workflow have contained literal
backslash-n newline escapes in the PR description. When that happens, the
closing keyword can be parsed as part of the escaped text instead of as
`Closes #NNN`, so GitHub does not auto-close the linked issue on merge.

## Acceptance Criteria

- [x] PR descriptions generated for this repository do not reach merge with
      literal escaped newline sequences in the body.
- [x] `Closes #NNN` remains a standalone closing keyword before merge, so GitHub
      can auto-close the linked issue.
- [x] A lightweight guard catches regressions when a PR body is created or
      edited.

## Current State Analysis

### Relevant Files

- `.github/workflows/` - repository CI workflow definitions.
- `docs/plan/issues/328_generated_pr_bodies_use_literal_newlines_breaking_closes_auto_close.md`
  - this plan.

### Findings

- `gh issue view 328` confirms the issue is open and labelled `bug`.
- Repository search did not find a repo-local PR-authoring script or command
  that builds `gh pr create` bodies for normal workflow runs.
- The only `gh pr create` matches are historical test commands in
  `docs/plan/issues/195_review_and_optimize_github_actions_workflows_to_reduce_costs.md`.
- Because the generator itself is outside this repository, the repo-scoped fix
  is a CI guard that blocks PRs with escaped newline sequences until the body is
  corrected.

## Solution Design

Add a GitHub Actions workflow that runs when a pull request is opened, edited,
reopened, marked ready for review, or updated. The workflow reads the PR body
from the event payload and fails if the body contains a literal backslash-n
sequence.

Use only a shell step and the built-in event context, avoiding third-party
actions and checkout. This keeps the workflow small, avoids supply-chain churn,
and makes the check independent of PR branch contents.

## Implementation Plan

### Step 1: Add PR body validation workflow

- Create `.github/workflows/validate-pr-body.yml`.
- Trigger on `pull_request` body-relevant events.
- Grant only `pull-requests: read` permission.
- Fail with an actionable message if the body contains an escaped newline
  sequence.

### Step 2: Verify locally

Run:

```bash
ruby -e "require 'yaml'; YAML.load_file('.github/workflows/validate-pr-body.yml')"
awk '/run: \\|/{flag=1; next} flag && /^      [^ ]/{flag=0} flag {sub(/^        /, \"\"); print}' .github/workflows/validate-pr-body.yml | bash -n
git diff --check
```

If Ruby is unavailable, use a syntax-focused review of the workflow YAML plus
the extracted shell script and `git diff --check`.

## Files Expected To Change

1. `.github/workflows/validate-pr-body.yml`
2. `docs/plan/issues/328_generated_pr_bodies_use_literal_newlines_breaking_closes_auto_close.md`

## Risks And Open Questions

- The guard does not modify the external PR-authoring command; it prevents bad
  PR bodies from being merged in this repository.
- A PR body that intentionally documents an escaped newline sequence would fail
  and need to reword that text before merge. That is acceptable for this
  repository because the original failure mode breaks issue auto-close.

## Research Review

- Iteration 1: Plan matches the issue's practical repository scope, because the
  offending PR-authoring implementation is not present in this repository. A CI
  guard is explicitly allowed by the issue as an optional backstop and directly
  prevents PRs with malformed closing keywords from reaching merge. The workflow
  is intentionally dependency-free and scoped to PR metadata.

## Implementation Notes

- Added `.github/workflows/validate-pr-body.yml`.
- The workflow runs on PR open, edit, reopen, ready-for-review, and synchronize
  events.
- The check uses the PR body from the event payload and fails when it contains
  an escaped newline sequence, with an error telling the author to edit the
  description so section breaks are real newlines.
- No checkout or third-party actions are used.

## Validation Results

- `ruby -e "require 'yaml'; YAML.load_file('.github/workflows/validate-pr-body.yml')"`
  - passed.
- Extracted workflow shell script piped to `bash -n` - passed.
- Simulated PR body with real newlines - passed.
- Simulated PR body with escaped newline text - failed as expected.
- `git diff --check` - passed.
- `nix run nixpkgs#actionlint -- .github/workflows/validate-pr-body.yml` -
  passed.
- `npm ci` - passed with existing peer-dependency warnings and one moderate
  audit finding.
- `npm run test:spell -- docs/plan/issues/328_generated_pr_bodies_use_literal_newlines_breaking_closes_auto_close.md .github/workflows/validate-pr-body.yml`
  - passed.

## Branch Review

- Classification: code-relevant CI workflow change plus this plan.
- Trail of Bits review skills: not available in this Codex session; performed
  manual differential review against `origin/main`.
- Manual review found no blocking issues. The workflow has minimal permissions,
  does not execute PR-controlled code, avoids checkout, and checks only PR
  metadata from the GitHub event payload.
