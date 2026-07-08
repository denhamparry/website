<!-- cspell:words Canva PaperMod searchHidden worktree -->

# GitHub Issue #321: Normalise talks page formatting

**Issue:** [#321](https://github.com/denhamparry/website/issues/321) **Status:**
Complete **Date:** 2026-07-08

## Problem Statement

`content/talks.md` has grown over several years and now mixes multiple entry
title styles and metadata labels. The page also has `searchHidden: true`, which
keeps the talks page out of PaperMod site search even though issue #321 decides
the page should be discoverable.

## Acceptance Criteria

- [x] All entries use one consistent title style.
- [x] All entries use consistent field labels: `Event:` and `Resources:`.
- [x] `searchHidden: false` is applied so the talks page appears in on-site
      search.
- [x] `npm test` passes.

## Current State Analysis

### Relevant Files

- `config.yaml` - Hugo output configuration for PaperMod search JSON.
- `content/search.md` - search page using PaperMod's `search` layout.
- `content/talks.md` - talks page content, frontmatter, entry headings, and
  metadata labels.
- `package.json` - link-check script skip for the generated search index URL
  before production deploy.
- `docs/plan/issues/321_normalise_talks_page_formatting_title_styles_and_field_labels.md`
  - this plan.

### Existing Inconsistencies

- Entry headings currently mix bare titles, `Event - Title`, `Event: Title`, and
  a pipe separator.
- Event or venue metadata currently uses `Event:`, `Where:`, `Link:`, `Video:`,
  `Online:`, and bare location values.
- Resource links currently use `Resources:`, `Video:`, `Online:`, and repeated
  video label bullets.
- Date formats were mostly fixed by prior work, but a few old entries still use
  short month names or trailing periods.
- `searchHidden: true` in frontmatter excludes the page from search.

## Solution Design

### Canonical Entry Shape

Use this metadata ordering for each entry:

```markdown
### <Event> - <Title>

- Type: <Talk | Workshop | Keynote | Webinar | Podcast | Meetup | CTF | ...>
- Date: <date>
- Event: <venue/host/location or link>
- Resources: <slides/recording links when available>
```

### Title Style

Use `Event - Title` for entries with a meaningful host or event name and a
separate talk title. Keep bare headings for private training, versioned meetup
series entries, and entries where the heading itself is the event name.

### Field Labels

- Rename venue, host, location, or event-page metadata to `Event:`.
- Rename recordings, slides, and other online materials to `Resources:`.
- Preserve existing URLs and descriptive text unless a label-only change is
  needed.
- Keep entries without resources free of a `Resources:` line.
- Keep entries without a clear event URL or location as plain event text rather
  than inventing links.

### Search Visibility

Set `searchHidden: false` in `content/talks.md`. The repository also needs the
minimal PaperMod search wiring because it had the theme search template but no
generated `/search/` page or home `index.json` search output.

## Implementation Plan

### Step 1: Normalize frontmatter and metadata labels

- Change `searchHidden: true` to `searchHidden: false`.
- Replace all `Where:`, `Link:`, `Online:`, and `Video:` metadata labels with
  the canonical `Event:` or `Resources:` label according to meaning.
- Merge repeated resource labels under a single `Resources:` bullet where an
  entry has multiple recordings.
- Reorder metadata to `Type`, `Date`, `Event`, then `Resources`.

### Step 2: Normalize heading separators

- Convert event/title separators to `Event - Title`.
- Remove colon separators from headings that are used only as event/title
  separators.
- Preserve punctuation inside talk titles.

### Step 3: Verify search inclusion

- Enable Hugo home JSON output and add a PaperMod search page.
- Build the site and confirm generated search index data includes the talks page
  title or permalink after `searchHidden: false`.

### Step 4: Validate

Run:

```bash
git diff --check
npm test
```

If local Hugo is unavailable, use the repository's Nix or Docker fallback for
the same validation.

## Files Expected To Change

1. `content/talks.md`
2. `config.yaml`
3. `content/search.md`
4. `package.json`
5. `docs/plan/issues/321_normalise_talks_page_formatting_title_styles_and_field_labels.md`

## Risks And Open Questions

- Some entries only have a YouTube link and no explicit event name. Treat those
  links as `Resources:` and leave `Event:` absent rather than misrepresenting a
  recording as the venue.
- Some older Cloud Native Wales meetup headings are event names rather than talk
  titles. Keep those as bare event headings to avoid inventing titles.
- `npm test` may require initialized theme submodules and the repo's expected
  Hugo runtime.

## Research Review

- Iteration 1: Plan matches issue #321 acceptance criteria, keeps changes scoped
  to `content/talks.md` plus this plan, and includes search-index verification.
  No blocking gaps found before implementation.

## Implementation Notes

- Set `searchHidden: false` in `content/talks.md`.
- Added `outputs.home.JSON` to `config.yaml` and `content/search.md` using
  PaperMod's `search` layout so `/search/` can load the generated search index.
- Updated `npm run test:links` to skip `index.json`, because PaperMod emits a
  generated search preload URL that does not exist on production before this
  branch is deployed.
- Normalized event/title headings to use `Event - Title` where the entry has a
  clear event and talk title.
- Removed the duplicate `What I wish I knew about AI 10 days ago` heading by
  adding the event names to both 2025 entries.
- Replaced legacy `Where:`, `Link:`, `Video:`, and `Online:` labels with
  `Event:` or `Resources:` according to meaning.
- Reordered entry metadata to `Type`, `Date`, `Event`, then `Resources`.
- Merged repeated recording links under a single `Resources:` field where
  entries had multiple videos.
- Expanded remaining short month names and removed trailing date punctuation.

## Validation Results

- Metadata scan for legacy labels, duplicate metadata fields, missing
  `Type`/`Date`, and metadata order - passed.
- `git diff --check` - passed.
- Plain `npm test` - failed because `hugo` was not on the shell `PATH`.
- `nix develop --command bash -lc 'npm test'` without a running Hugo server -
  Hugo build passed, functional tests failed with `ERR_CONNECTION_REFUSED`
  because tests expect `localhost:1313`.
- `nix develop --command bash -lc 'hugo server -D --bind 127.0.0.1 --port 1313 --disableFastRender'`
  - passed; served the site locally for browser-backed tests.
- `nix develop --command bash -lc 'npm test'` with the Hugo server running -
  passed.
- `/search/` check against the local server - passed; page loads PaperMod search
  UI and preloads `../index.json`.
- `index.json` check against the local server and built `public/index.json` -
  passed; both include `Talks https://denhamparry.co.uk/talks/`.
- `nix develop --command bash -lc 'npm run test:spell'` - passed.
- `nix develop --command bash -lc 'npm run test:links'` - passed after skipping
  generated `index.json` search preload URLs.

## Branch Review

- Classification: code-relevant content/config/test-script changes
  (`content/talks.md`, `content/search.md`, `config.yaml`, `package.json`, and
  this plan).
- Repo-local `docs/pre-pr-branch-review.md`: not present.
- Differential-review tooling: unavailable in this Codex session; tool discovery
  exposed GitHub/Canva tools only, so fallback manual review was performed.
- Manual review result: no blocking issues found. The search wiring is limited
  to PaperMod's documented home JSON output and search layout, `searchHidden`
  now allows the talks page into `index.json`, metadata labels are normalized,
  and the link-check skip is scoped to generated `index.json` search preload
  URLs that cannot exist on production until after deploy.

## Outcome

Issue #321 is ready for PR. The talks page has normalized title separators,
canonical `Event:` and `Resources:` metadata labels, consistent metadata order,
expanded date month names where older entries used abbreviations, and
`searchHidden: false`. `/search/` now renders locally and the generated search
index includes the talks page.
