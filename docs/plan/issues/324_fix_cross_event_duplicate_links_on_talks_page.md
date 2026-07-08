<!-- cspell:words cloudnativewales oembed Wayback worktree -->

# GitHub Issue #324: Fix cross-event duplicate links on talks page

**Issue:** [#324](https://github.com/denhamparry/website/issues/324) **Status:**
Complete **Date:** 2026-07-08

## Problem Statement

Four `content/talks.md` entries contain two sets of cross-event duplicated
links:

- Cloud Native Wales Meetup v0.10.0, 07th February 2019, and v0.9.0, 10th
  January 2019, both link to the same Meetup event URL.
- KubeCon Cloud Native Security Conference Day - Capture The Flag NA 2021 and
  KubeCon Cloud Native Security Day - Capture The Flag EU 2021 both link to the
  same two YouTube videos.

Distinct events should not share one event or recording URL unless that shared
URL is deliberately correct.

## Acceptance Criteria

- [x] No two distinct events among the four issue entries share one wrong URL.
- [x] Correct distinct links are used where they can be verified.
- [x] Incorrect links are removed when a distinct correct target cannot be
      verified.
- [x] `npm run test:links` passes on the built output.

## Current State Analysis

### Relevant Files

- `content/talks.md` - Talks page entries with duplicated links.
- `docs/plan/issues/324_fix_cross_event_duplicate_links_on_talks_page.md` - This
  plan.

### Sources Checked

- GitHub issue #324 body.
- Current Meetup redirects for
  `https://www.meetup.com/cloudnativewales/events/lxwbppyzdbsb/`, which
  redirects to numeric event ID `250631360`, and
  `https://www.meetup.com/cloudnativewales/events/250631354/`.
- Wayback Machine CDX API for the duplicated Meetup slug and for Cloud Native
  Wales Meetup event pages during January and February 2019.
- Public web search for Cloud Native Wales Meetup v0.9.0 and v0.10.0.
- YouTube oEmbed and `yt-dlp` metadata for:
  - `https://youtu.be/Bn_0NjvoDoo`
  - `https://youtu.be/phKBYX6Pd_A`
  - `https://youtu.be/bFyYaECAPpo`
  - `https://youtu.be/pOi1aKpcuC0`
- Linux Foundation archive page for Cloud Native Security Conference North
  America 2021.
- Cloud Native Security Talks index for Cloud Native Security Day 2021 and Cloud
  Native Security Conference North America 2021.

The current Meetup page confirms that the shared slug is Cloud Native Wales
Meetup v0.10.0 on 2019-02-07. Checking neighboring numeric event IDs found the
verified v0.9.0 page at `250631354`, dated 2019-01-10. The two duplicated
YouTube videos were uploaded on 2021-05-14, shortly after the EU event and
months before the NA event, so they should remain on the EU entry and be removed
from the NA entry. A separate live-stream recording exists for Cloud Native
Security Day EU 2021, but it is not a distinct NA recording.

## Solution Design

### Approach

1. Keep the existing verified Meetup URL on v0.10.0.
2. Replace v0.9.0's duplicated Meetup URL with its verified numeric event URL.
3. Keep the YouTube recordings on the EU 2021 CTF entry, where the May 2021
   upload dates fit the event chronology and link text.
4. Remove the YouTube recordings from the NA 2021 CTF entry because the videos
   pre-date that October event and no distinct NA recordings were verified.
5. Validate Hugo output and link checking.

### Rationale

The issue asks for correct distinct links where they can be verified and allows
delinking entries when the true target cannot be verified. The CNW entries now
have verified distinct links. The NA 2021 CTF entry does not, so removing its
wrong resources is safer than preserving duplicated cross-event references.

## Implementation Plan

### Step 1: Update `content/talks.md`

- Keep v0.10.0 linked to
  `https://www.meetup.com/cloudnativewales/events/lxwbppyzdbsb/`.
- Change v0.9.0 `Event` to
  `https://www.meetup.com/cloudnativewales/events/250631354/`.
- Remove the `Resources` line from the NA 2021 CTF entry.
- Keep the EU 2021 CTF entry's existing two YouTube resource links.

### Step 2: Verify

Run:

```bash
git diff --check
npm run test:hugo
npm run test:links
```

If Hugo is unavailable in the plain shell, use the repository's Nix or Docker
fallback.

## Success Criteria

- [x] CNW v0.10.0 keeps its verified Meetup URL.
- [x] CNW v0.9.0 links to its verified Meetup URL.
- [x] NA 2021 CTF no longer points at May 2021 EU recordings.
- [x] EU 2021 CTF keeps the May 2021 recording links.
- [x] Link validation passes.

## Validation Results

- `git diff --check` - passed.
- `git submodule update --init --recursive themes/PaperMod` - passed;
  initialized the PaperMod submodule in the fresh issue worktree.
- `npm ci` - passed; npm reported existing peer-dependency warnings and one
  moderate audit finding.
- `nix develop --command bash -lc 'npm run test:hugo'` - passed.
- `npm run test:links` - passed.
- `npm run test:spell` - passed.

## Branch Review

- Classification: non-code content/documentation changes (`content/talks.md` and
  this plan).
- Trail of Bits review skills: skipped - no code-relevant changes.
- Manual review found no blocking issues. The final content diff replaces only
  the duplicated v0.9.0 Meetup URL and removes the incorrect NA 2021 CTF
  recording links while preserving the verified v0.10.0 and EU 2021 links.

## Files Expected To Change

1. `content/talks.md`
2. `docs/plan/issues/324_fix_cross_event_duplicate_links_on_talks_page.md`

## Risks And Open Questions

- The v0.9.0 link uses a numeric Meetup event URL because the old recurring
  token was not available in the existing content or public search results.
- Distinct NA 2021 CTF recordings may exist outside the searched public indexes.
  If found later, they can be added in a follow-up content update.

## References

- [GitHub Issue #324](https://github.com/denhamparry/website/issues/324)
- [Cloud Native Security Conference North America 2021 archive](https://events.linuxfoundation.org/archive/2021/cloud-native-security-conference-north-america/)
- [Cloud Native Security Talks index](https://talks.container-security.site/categories/)
