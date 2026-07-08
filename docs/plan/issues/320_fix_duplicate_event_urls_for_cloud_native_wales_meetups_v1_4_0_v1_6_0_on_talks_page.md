<!-- cspell:words cloudnativewales Wayback worktree -->

# GitHub Issue #320: Fix duplicate event URLs for Cloud Native Wales meetups

**Issue:** [#320](https://github.com/denhamparry/website/issues/320) **Status:**
Complete **Date:** 2026-07-08

## Problem Statement

Three adjacent `content/talks.md` Cloud Native Wales meetup entries currently
link to the same Meetup event URL:

- Cloud Native Wales Meetup v1.6.0, 14th Nov 2019.
- Cloud Native Wales Meetup v1.5.0, 10th Oct 2019.
- Cloud Native Wales Meetup v1.4.0, 12th Sept 2019.

The shared URL resolves to the v1.6.0 event, so it is wrong for v1.5.0 and
v1.4.0.

## Acceptance Criteria

- [x] v1.6.0, v1.5.0, and v1.4.0 do not share one wrong Meetup URL.
- [x] Correct distinct event URLs are used where they can be verified.
- [x] If individual event pages cannot be verified, wrong links are removed.
- [x] `npm run test:links` passes on the built output.

## Current State Analysis

### Relevant Files

- `content/talks.md` - Talks page entries with the duplicated URLs.
- `docs/plan/issues/320_fix_duplicate_event_urls_for_cloud_native_wales_meetups_v1_4_0_v1_6_0_on_talks_page.md`
  - This plan.

### Sources Checked

- GitHub issue #320 body.
- Current Meetup URL
  `https://www.meetup.com/cloudnativewales/events/266266702/`, which redirects
  to the current canonical v1.6.0 event URL and renders as "Cloud Native Wales
  Meetup v1.6.0" on 14 Nov 2019.
- Current Meetup pages for adjacent known old Cloud Native Wales event IDs:
  v1.1.0 (`260517362`), v1.2.0 (`260517364`), the August 2019 cancelled meetup
  (`262666779`), and v1.6.0 (`266266702`).
- Public web search for v1.4.0 and v1.5.0 event pages.
- Wayback Machine CDX API for `www.meetup.com/cloudnativewales/events/*` around
  September through November 2019.
- Guessed recurring Meetup slugs for September and October 2019.

The v1.6.0 event URL is verified. The v1.5.0 and v1.4.0 event URLs were not
verified from the checked public sources.

## Solution Design

### Approach

1. Keep the verified v1.6.0 Meetup link.
2. Remove the duplicated v1.6.0 URL from the v1.5.0 and v1.4.0 entries.
3. Leave v1.5.0 and v1.4.0 as plain `Cardiff, UK` locations rather than linking
   them to a known-wrong event.
4. Validate the generated site and link checker.

### Rationale

The issue explicitly allows plain `Cardiff, UK` when individual event pages are
not available. Removing the two unverified wrong links is safer than inventing
event IDs.

## Implementation Plan

### Step 1: Update `content/talks.md`

- Keep: `https://www.meetup.com/cloudnativewales/events/266266702/` for v1.6.0.
- Change v1.5.0 `Where` from linked `Cardiff, UK` to plain `Cardiff, UK`.
- Change v1.4.0 `Where` from linked `Cardiff, UK` to plain `Cardiff, UK`.

### Step 2: Verify

Run:

```bash
npm run test:hugo
npm run test:links
git diff --check
```

If local Hugo is unavailable, use the repository's Nix or Docker fallback.

## Success Criteria

- [x] v1.6.0 keeps the verified event URL.
- [x] v1.5.0 no longer links to the v1.6.0 event URL.
- [x] v1.4.0 no longer links to the v1.6.0 event URL.
- [x] Link validation passes.

## Validation Results

- `git diff --check` - passed.
- `npm run test:hugo` - failed in the plain shell before dependencies were
  installed because `chalk` was missing.
- `npm ci` - passed; installed worktree-local Node dependencies. NPM reported
  existing peer-dependency warnings and one moderate audit finding.
- `npm run test:hugo` - failed in the plain shell because `hugo` was not on
  `PATH`.
- `nix develop --command bash -lc 'npm run test:hugo'` - initially failed
  because the PaperMod theme submodule was not initialized in the fresh
  worktree.
- `git submodule update --init --recursive themes/PaperMod` - passed.
- `nix develop --command bash -lc 'npm run test:hugo'` - passed.
- `npm run test:links` - passed after the Hugo build generated `public/`.

## Branch Review

- Classification: non-code content/documentation changes (`content/talks.md` and
  this plan).
- Trail of Bits review skills: skipped - no code-relevant changes.
- Manual review found no blocking issues. The final diff removes only the two
  unverified wrong links and documents the source checks behind that decision.

## Files Expected To Change

1. `content/talks.md`
2. `docs/plan/issues/320_fix_duplicate_event_urls_for_cloud_native_wales_meetups_v1_4_0_v1_6_0_on_talks_page.md`

## Risks And Open Questions

- The true v1.5.0 and v1.4.0 Meetup event IDs may still exist but were not
  discoverable through public search, current Meetup redirects, or Wayback CDX
  checks.

## References

- [GitHub Issue #320](https://github.com/denhamparry/website/issues/320)
- [Verified v1.6.0 Meetup event](https://www.meetup.com/cloudnativewales/events/266266702/)
