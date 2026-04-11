# Plan: Allow 'artifact' in conform spellcheck

- **Issue:** #256
- **Status:** Reviewed (Approved)
- **Branch:** denhamparry.co.uk/fix/gh-issue-256

## Problem

The Conform GitHub Action fails on Dependabot PRs that update
`actions/upload-artifact` because the GB-locale spellcheck flags `artifact` as a
misspelling of `artefact`. This blocks legitimate dependency update PRs (e.g. PR
#247).

## Root Cause

Conform's spellcheck uses the misspell library with only a `locale` field — it
has **no allow-list or exception mechanism**. With `locale: GB`, "artifact" is
always flagged. There is no configuration option to add exception words.

## Proposed Solution

Remove the `spellcheck` block from `.conform.yaml` entirely.

**Rationale:**

1. Conform's spellcheck cannot be configured with exceptions — it's all or
   nothing
2. The repo already has a dedicated **cspell** spell-check workflow
   (`.github/workflows/misspell.yml`) that checks source files with a
   configurable dictionary (`cspell.json` + `.spelling.txt`)
3. Commit message spellcheck via Conform provides minimal value when source
   spelling is already covered by cspell
4. The spellcheck is actively harmful — it blocks valid upstream terminology
   (`artifact`) used by GitHub Actions

**What remains in Conform:**

- Header length (72 chars)
- Imperative mood
- Lowercase case enforcement
- Invalid last characters (`.`)
- Conventional commit types and scopes
- Description length (72 chars)

These are all valuable commit message constraints that are unaffected by
removing the spellcheck block.

## Files Modified

- `.conform.yaml` — remove the `spellcheck:` block (lines 15-16)

## Acceptance Criteria

- [ ] `Conform` no longer fails on commit messages containing `artifact`
- [ ] All other commit message rules remain unchanged
- [ ] Existing cspell workflow continues to check source file spelling

## Risks

- **Low:** Commit message typos will no longer be caught by Conform. Mitigated
  by cspell covering source files and PR review catching commit message issues.
