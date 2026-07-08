<!-- cspell:words PaperMod searchHidden worktree -->

# GitHub Issue #326: Add a nav entry point to search

**Issue:** [#326](https://github.com/denhamparry/website/issues/326) **Status:**
Complete **Date:** 2026-07-08

## Problem Statement

Issue #321 enabled PaperMod site search by generating the home JSON search index
and adding `content/search.md`, but the site header still does not expose a link
to `/search/`. Visitors can only reach search by typing the URL.

## Acceptance Criteria

- [x] `/search/` is reachable from the site header/nav on every page.
- [x] Searching returns the Talks page and future indexed pages.
- [x] `npm test` passes.

## Current State Analysis

### Relevant Files

- `config.yaml` - Hugo site configuration and the right place for a global
  main-menu entry.
- `content/search.md` - PaperMod search page already present from issue #321.
- `content/talks.md` - Talks page is already indexed with `searchHidden: false`
  and already appears in the main menu through page frontmatter; it needs an
  explicit menu weight so placement relative to Search is stable.
- `tests/functional/navigation.test.js` - browser-backed navigation tests.
- `docs/plan/issues/326_add_a_nav_entry_point_to_search_so_on_site_search_is_discoverable.md`
  - this plan.

### Theme Behaviour

The checked-out PaperMod header renders `.Site.Menus.main` entries and adds
`Alt + /` access-key metadata when the menu item's key resolves to a page whose
layout is `search`. It renders menu entry content from `.Pre`, `.Name`, and
`.Post`; this theme revision does not automatically substitute an icon for a
`search` identifier.

## Solution Design

Add a global `menu.main` entry in `config.yaml`:

```yaml
menu:
  main:
    - identifier: search
      name: Search
      url: /search/
      weight: 20
```

Use a weight after the existing Talks page's default menu placement so the
header order stays simple: Talks, then Search. If the default Talks page menu
weight does not produce that order, set the Talks page menu weight explicitly.

Add focused functional coverage for:

- the homepage header containing a `/search/` link;
- navigating through that header link to the PaperMod search page;
- entering a search term that should return the Talks page.

## Implementation Plan

### Step 1: Add the search menu entry

- Add a `menu.main` search entry to `config.yaml`.
- Keep `content/search.md` unchanged.
- Set `content/talks.md` to an explicit lower menu weight if needed to keep the
  header order as Talks, then Search.

### Step 2: Add navigation/search coverage

- Extend `tests/functional/navigation.test.js` with a header-link test.
- Extend the same test file with a search-result test for `Talks`.

### Step 3: Validate

Run:

```bash
git diff --check
npm test
```

Also verify the generated or served site includes:

- a header link to `/search/`;
- `public/index.json` containing the Talks page;
- a `/search/` page that returns Talks for a representative search term.

## Files Expected To Change

1. `config.yaml`
2. `content/talks.md`
3. `tests/functional/navigation.test.js`
4. `docs/plan/issues/326_add_a_nav_entry_point_to_search_so_on_site_search_is_discoverable.md`

## Risks And Open Questions

- The issue mentions a PaperMod search icon convention, but this pinned PaperMod
  revision does not render a search icon automatically from the `identifier`. A
  text menu link still satisfies the issue's acceptance criterion of an icon or
  menu link without patching the theme.
- Browser-backed tests require a running Hugo server on `localhost:1313`.

## Research Review

- Iteration 1: Plan matches issue #326 acceptance criteria, keeps the
  implementation scoped to a Hugo menu entry plus direct functional coverage,
  and avoids theme edits. No blocking gaps found before implementation.

## Implementation Notes

- Added a `search` entry to `menu.main` in `config.yaml`.
- Set the existing Talks page frontmatter menu entry to weight `10`, with the
  Search menu entry at weight `20`, so the header order is Talks then Search.
- Added browser-backed functional tests that confirm the header includes the
  `/search/` entry with PaperMod's search access key, preserves the intended
  Talks/Search order, and returns the Talks page when searching for `Talks`.

## Validation Results

- `git diff --check` - passed.
- First `nix develop --command bash -lc 'npm test'` run - failed because the new
  header-link assertion expected a localhost URL, while PaperMod renders menu
  links using the configured production `baseURL`.
- Updated the assertion to verify `https://denhamparry.co.uk/search/` and the
  `/search/` path.
- `nix develop --command bash -lc 'npm test'` - passed.
- `nix develop --command bash -lc 'npm run test:spell'` - passed.
- `nix develop --command bash -lc 'npm run test:links'` - passed.
- Generated `public/` check - passed; homepage contains the search link, Talks
  appears before Search in the header, `/search/` contains the search UI, and
  `public/index.json` includes Talks.
- Served localhost check - passed; the homepage contains the search link and
  Talks/Search menu order, and `http://localhost:1313/index.json` includes
  Talks.
- Post-PR GitHub Actions `test (22.x)` initially failed because `hugo server` in
  CI rendered localhost URLs while the new functional tests expected production
  `baseURL` URLs. Updated the tests to assert URL paths instead of origins for
  the search and Talks links.
