# Plan: Fix Dependabot Label Mismatch (#253)

**Status:** Complete **Issue:** #253 — fix(deps): Dependabot label mismatch —
`github-actions` not found **Branch:** denhamparry.co.uk/fix/gh-issue-253

## Problem

Dependabot cannot apply the `github-actions` label to PRs because the label does
not exist. The repository has `github_actions` (underscore) but
`.github/dependabot.yml` references `github-actions` (hyphen).

## Root Cause

Label naming mismatch: `github_actions` (repo) vs `github-actions`
(dependabot.yml).

## Proposed Fix

Rename the existing `github_actions` label to `github-actions` using the GitHub
CLI. This approach:

1. Preserves the label on any existing PRs/issues that use it
2. Aligns with the conventional Dependabot ecosystem naming (`github-actions`)
3. Requires no change to `dependabot.yml` — it already uses the correct name

## Implementation Steps

### Task 1: Rename the GitHub label

Rename `github_actions` → `github-actions` via `gh label edit`:

```bash
gh label edit "github_actions" --name "github-actions"
```

### Task 2: Verify the fix

Confirm the label exists with the correct name:

```bash
gh label list | grep "github-actions"
```

## Files Modified

- No file changes required — this is a GitHub label rename only

## Acceptance Criteria

- [ ] Label `github-actions` exists in the repository
- [ ] Label `github_actions` no longer exists (renamed, not duplicated)
- [ ] `dependabot.yml` references match existing labels
- [ ] Existing issues/PRs with the old label retain the renamed label

## Risk Assessment

- **Low risk**: Label rename is non-destructive; GitHub preserves label
  associations through renames
- **No code changes**: Only a GitHub API operation
