<!-- cspell:words Amberwolf worktree -->

# GitHub Issue #301: Page requires review: content/talks.md

**Issue:** [#301](https://github.com/denhamparry/website/issues/301) **Status:**
Complete **Date:** 2026-06-22

## Problem Statement

The `content/talks.md` page requires review. The page should reflect the latest
known public talk/webinar content and the frontmatter `reviewed` date should
match this review.

### Current Behavior

- `reviewed` is `2026-04-14`.
- The latest listed item is the 14th April 2026 "Beyond Containers" talk.
- External review found an Edera Runtime Rumble on-demand entry, "Multi-Tenant
  Melee", hosted by Lewis Denham-Parry with Iain Smart, that is not currently
  listed.

### Expected Behavior

- The page includes the missing Runtime Rumble webinar in chronological order.
- `reviewed` is updated to `2026-06-22`.
- Hugo and spell-check validation pass.

## Current State Analysis

### Relevant Files

- `content/talks.md` - Talks page content and `reviewed` frontmatter.

### Sources Checked

- GitHub issue #301: the issue body says "This page requires review".
- Edera events page, checked 2026-06-22: `https://edera.dev/events`.
- Edera story page dated 2025-11-19, checked 2026-06-22:
  `https://edera.dev/stories/kubecon-north-america-2025-a-decade-in-its-time-to-rebuild-the-foundations`.
- Runtime Rumble registration/short-link page, checked 2026-06-22:
  `https://edera.link/vev4oth`.
- LinkedIn search result snippet from Edera, checked 2026-06-22, corroborates
  the Runtime Rumble "Multi-Tenant Melee" session date as November 20.

## Solution Design

### Approach

1. Add the missing "Edera: Multi-Tenant Melee" webinar to the 2025 section,
   placed between the 4th December 2025 Cloud Native Manchester meetup and the
   8th November 2025 Cloud Native Rejeckts lightning talk.
2. Include the public on-demand Runtime Rumble link as a recording/resource.
3. Add a concise original description based on the public event summaries.
4. Update `reviewed` in the page frontmatter to `2026-06-22`.

### Rationale

This is a content review issue, not a layout or behavior change. The smallest
useful fix is to bring the page up to date for a missing public webinar and
record the date of review.

## Implementation Plan

### Step 1: Update `content/talks.md`

- Change frontmatter:

  ```yaml
  reviewed: 2026-06-22
  ```

- Add a 2025 entry:
  - Title:
    `Edera: Multi-Tenant Melee: Achieving Secure Isolation for Modern Container Platforms`
  - Type: `Webinar`
  - Date: `20th November 2025`
  - Event: `Edera Runtime Rumble`
  - Resources: `Recording` linking to `https://edera.link/vev4oth`

### Step 2: Verify

Run:

```bash
npm run test:hugo
npm run test:spell
```

If spell-check catches new proper nouns, add them to `.spelling.txt`.

## Success Criteria

- [x] `content/talks.md` reviewed date is `2026-06-22`.
- [x] Missing Runtime Rumble webinar appears in the correct chronological
      position.
- [x] Hugo build passes.
- [x] Spell check passes.

## Validation Results

- `npm run test:spell` - passed.
- `npm run test:hugo` - failed in the plain shell because `hugo` was not on
  PATH.
- `nix develop --command bash -lc 'npm run test:hugo'` - initially failed before
  the theme submodule was initialized in the new worktree.
- `git submodule update --init --recursive themes/PaperMod` - populated the
  required Hugo theme submodule.
- `nix develop --command bash -lc 'npm run test:hugo'` - passed.
- `npm run test:spell` - failed once on `worktree` in this plan file; the local
  cspell word comment was updated.
- `npm run test:spell` - passed after the cspell word comment update.
- `git diff --check` - passed.

## Files Expected To Change

1. `content/talks.md`
2. `docs/plan/issues/301_page_requires_review_content_talks_md.md`
3. `.spelling.txt` only if spell-check requires a new proper noun.

## Risks And Open Questions

- The Runtime Rumble short-link page states `Nov 20` without a year, but the
  Edera story page dated 2025-11-19 refers to the webinar as "this Thursday,
  November 20", so the review treats the event as 20th November 2025.
- The public source describes the session as on-demand; the short-link page may
  require registration before showing the recording.

## References

- [GitHub Issue #301](https://github.com/denhamparry/website/issues/301)
- [Edera events](https://edera.dev/events)
- [Edera KubeCon North America 2025 story](https://edera.dev/stories/kubecon-north-america-2025-a-decade-in-its-time-to-rebuild-the-foundations)
- [Runtime Rumble Multi-Tenant Melee](https://edera.link/vev4oth)
