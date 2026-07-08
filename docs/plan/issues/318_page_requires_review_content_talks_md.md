<!-- cspell:words CCOSS KCD Nefarious Do-Well KubeCon SQUER worktree µCon -->

# GitHub Issue #318: Page requires review: content/talks.md

**Issue:** [#318](https://github.com/denhamparry/website/issues/318) **Status:**
Complete **Date:** 2026-07-08

## Problem Statement

The `content/talks.md` page has automated review findings after becoming stale.
The issue identifies broken Markdown headings, several concrete data and typo
errors, and broader consistency polish opportunities.

### Current Behavior

- `reviewed` is `2026-06-22`.
- Three long `###` headings are split by a blank line, causing the second half
  of each title to render as body text.
- Several talk entries contain typos or malformed dates.
- The µCon London 2019 entry is missing a date.

### Expected Behavior

- Broken headings render as complete headings.
- Confirmed data errors and typos from the issue are corrected.
- `reviewed` is updated to `2026-07-08`.
- Hugo build and spell-check validation pass.

## Current State Analysis

### Relevant Files

- `content/talks.md` - Talks page content and `reviewed` frontmatter.
- `docs/plan/issues/318_page_requires_review_content_talks_md.md` - This plan.

### Sources Checked

- GitHub issue #318: issue body lists P1/P2/P3/P4 findings.
- CCOSS + KCD Guadalajara 2024 final report: confirms the event dates as
  February 23 and 24, 2024, and lists the Security Showdown session.
- CCOSS + KCD Guadalajara 2024 prospectus: confirms the event dates as Friday 23
  and Saturday 24 February 2024.
- Skills Matter Flickr material describes µCon London 2019 as a three-day
  conference and is dated 29 May 2019.
- SQUER's public conference-talk listing includes a µCon London 2019 talk dated
  31 May 2019.

## Solution Design

### Approach

1. Fix the three broken headings by rejoining each title onto one Markdown
   heading line.
2. Correct concrete P2 issues:
   - KCD Guadalajara date: `23-24th February 2024`.
   - µCon London 2019 event date range: `29-31st May 2019`.
   - `Lighting Talk` typo to `Lightning Talk`.
   - `decried` typo to `decided`.
   - `03th Mar 2022` to `03rd March 2022`.
3. Use the corroborated µCon London 2019 event date range rather than inventing
   an exact session time.
4. Apply narrow consistency polish for issue-listed malformed field labels:
   - Change bare current-resource bullets to `Resources:`.
   - Fix `Youtube` capitalization.
   - Add missing colons to `Date` and `Online` labels called out by the issue.
   - Remove the trailing period from `10 January 2022.`.
5. Update the frontmatter `reviewed` date to `2026-07-08`.

### Rationale

This keeps the PR tightly scoped to confirmed rendering and content-quality
fixes. The broader P3 title-format and full-page label normalization work would
touch many entries and is better handled separately if desired.

## Implementation Plan

### Step 1: Update `content/talks.md`

- Change frontmatter:

  ```yaml
  reviewed: 2026-07-08
  ```

- Rejoin the three broken headings:
  - KubeCon EU 2025 container runtimes title.
  - NDC Minnesota 2019 message queues title.
  - NDC London 2019 message queues title.
- Correct confirmed typos, dates, and malformed labels listed in the approach.

### Step 2: Verify

Run:

```bash
npm run test:hugo
npm run test:spell
git diff --check
```

If local Hugo is unavailable, use the repository's Nix environment or Docker
fallback documented by the repo.

## Success Criteria

- [x] `content/talks.md` reviewed date is `2026-07-08`.
- [x] Three broken Markdown headings are fixed.
- [x] Confirmed P2 data and typo issues are corrected.
- [x] µCon London 2019 has the corroborated event date range.
- [x] Hugo build passes.
- [x] Spell check passes.
- [x] `git diff --check` passes.

## Validation Results

- `npm run test:hugo` - failed in the plain shell because `hugo` was not on
  `PATH`.
- `npm ci` - passed; installed the worktree-local Node dependencies. NPM
  reported existing peer-dependency warnings and one moderate audit finding.
- `git submodule update --init --recursive themes/PaperMod` - passed.
- `npm run test:spell` - passed.
- `git diff --check` - passed.
- `nix develop --command bash -lc 'npm run test:hugo'` - passed.

## Branch Review

- Classification: non-code content/documentation changes (`content/talks.md` and
  this plan).
- Trail of Bits review skills: skipped - no code-relevant changes.
- Manual review found no blocking issues after the validation above.

## Files Expected To Change

1. `content/talks.md`
2. `docs/plan/issues/318_page_requires_review_content_talks_md.md`

## Risks And Open Questions

- The µCon London 2019 source material supports an event range, not the exact
  session time for the individual talk.
- P3 asks for broad title and field-label standardization across the page; this
  plan intentionally limits polish to malformed or issue-called-out labels.

## References

- [GitHub Issue #318](https://github.com/denhamparry/website/issues/318)
- [CCOSS + KCD Guadalajara 2024 final report](https://www.cncf.io/wp-content/uploads/2024/03/CCOSSKCD-2024-FINAL-REPORT.pdf)
- [CCOSS + KCD Guadalajara 2024 prospectus](https://ccoss.org/files/CCOSSKCD2024-Prospectus.pdf)
- [Skills Matter µCon London 2019 photo](https://www.flickr.com/photos/skillsmatter/47957262977)
- [SQUER conference talks](https://www.squer.io/conferences?f2d91a48_page=4)
