<!-- cspell:words PaperMod worktree -->

# GitHub Issue #322: Add recording link for 2025 Runtime Rumble Tag Team Champions talk

**Issue:** [#322](https://github.com/denhamparry/website/issues/322) **Status:**
Complete **Date:** 2026-07-08

## Problem Statement

The `content/talks.md` entry for
`Edera - Tag Team Champions: Confidential Computing meets Edera` has no
`Resources:` line, unlike the adjacent Runtime Rumble webinar entries that link
recordings.

## Acceptance Criteria

- [x] Add a `Resources:` recording link for the Tag Team Champions entry if a
      public recording or landing page exists.
- [x] Leave the issue to close through the PR because a public URL is available.
- [x] `npm run test:links` passes if a link is added.

## Current State Analysis

### Relevant Files

- `content/talks.md` - talks page entry missing the recording link.
- `docs/plan/issues/322_add_recording_link_for_2025_runtime_rumble_tag_team_champions_talk.md`
  - this plan.

### Sources Checked

- GitHub issue #322 body.
- Public web search for the exact title
  `Tag Team Champions: Confidential Computing meets Edera`, which returns a
  YouTube recording at `https://www.youtube.com/watch?v=t_2TfygTlV8`.
- Edera events page, which lists `On-Demand RR: Tag Team Champions` in the
  Runtime Rumble Rewind section and links to `https://edera.link/vev3em`.

## Solution Design

Add the direct public YouTube recording URL to the affected talks entry using
the same single-line `Resources: [Recording](...)` pattern as nearby Runtime
Rumble entries.

## Implementation Plan

### Step 1: Update `content/talks.md`

- Add `- Resources: [Recording](https://www.youtube.com/watch?v=t_2TfygTlV8)`
  below the Tag Team Champions `Event:` line.

### Step 2: Verify

Run:

```bash
npm run test:hugo
npm run test:links
git diff --check
```

If local Hugo is unavailable, use the repository's Nix or Docker fallback.

## Files Expected To Change

1. `content/talks.md`
2. `docs/plan/issues/322_add_recording_link_for_2025_runtime_rumble_tag_team_champions_talk.md`

## Risks And Open Questions

- YouTube links can occasionally fail link checks because of bot detection or
  transient rate limiting. The repository already contains YouTube recording
  links, so this URL is consistent with existing content.

## Research Review

- Iteration 1: Plan matches issue #322 acceptance criteria, uses a publicly
  discoverable recording URL, and keeps changes scoped to the talks entry plus
  this plan. No blocking gaps found before implementation.

## Implementation Notes

- Added the direct YouTube recording link to the Tag Team Champions Runtime
  Rumble entry in `content/talks.md`.
- Kept the existing talks page entry shape and used the same
  `Resources: [Recording](...)` label as nearby webinar entries.

## Validation Results

- `git submodule update --init --recursive themes/PaperMod` - passed.
- `npm ci` - passed with existing peer-dependency warnings and one moderate
  audit finding.
- `nix develop --command bash -lc 'npm run test:hugo'` - passed.
- `npm run test:links` - passed.
- `git diff --check` - passed.

## Branch Review

- Classification: non-code content/documentation changes (`content/talks.md` and
  this plan).
- Trail of Bits review skills: skipped - no code-relevant changes.
- Manual review found no blocking issues. The final diff adds only the verified
  recording link and documents the source checks behind that decision.
