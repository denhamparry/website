# Plan: Add "Beyond Containers" Talk Entry (#258)

**Status:** Reviewed (Approved) **Issue:** #258 — talks: add "Beyond Containers"
(2026-04-14, Cloud Native Edinburgh) **Branch:**
denhamparry.co.uk/feat/gh-issue-258

## Summary

Add the 14th April 2026 talk — _Beyond Containers: Why MicroVMs Are Essential
for Multi-Tenant Workloads_ at Cloud Native and Kubernetes Edinburgh — to the
talks page.

## Files Modified

- `content/talks.md` — Insert new `###` entry at top of `## 2026` section;
  update `reviewed:` frontmatter field to `2026-04-14`

## Implementation Tasks

### Task 1: Update `reviewed` frontmatter

Change `reviewed: 2026-02-27` to `reviewed: 2026-04-14` in `content/talks.md`
frontmatter.

### Task 2: Insert talk entry

Insert the new
`### Beyond Containers: Why MicroVMs Are Essential for Multi-Tenant Workloads`
entry immediately after the `## 2026` heading and before the existing "The Road
to Multitenancy" entry. Content is provided verbatim in the issue.

### Task 3: Verify build

Run Hugo build to verify the page renders correctly.

### Task 4: Run pre-commit hooks

Run pre-commit hooks on all files to ensure code quality.

## Acceptance Criteria

1. The talk appears as the first entry under `## 2026`
2. The `Slides` link points to the correct URL
3. The Meetup link points to the correct event page
4. The description matches the prose style of other 2026 entries
5. The page passes existing link checks
6. Pre-commit hooks pass

## Risk Assessment

**Low risk** — This is a straightforward content addition with exact content
provided in the issue. No code changes, no configuration changes, no
architectural decisions.
