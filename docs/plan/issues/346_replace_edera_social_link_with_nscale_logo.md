---
status: Complete
issue: 346
date: 2026-07-26
---

<!-- cspell:words logomark Nscale wordmark worktree -->

# GitHub Issue #346: Replace Edera social link with Nscale

## Problem Statement

The homepage profile still links to `https://edera.dev` through a social-icon
entry named `cv`. The pinned PaperMod theme has no matching `cv` icon, so it
renders the generic chain-link fallback instead of a company mark.

## Current State

- `config.yaml` defines the stale `cv` social icon and Edera URL.
- `tests/functional/navigation.test.js` asserts the Edera URL.
- PaperMod's `svg.html` partial has no `cv` or `nscale` branch.
- The site already uses local partial overrides under `layouts/partials/`.

## Acceptance Criteria

- The profile social icon links to `https://nscale.com`.
- No configured social icon references `edera.dev`.
- The link renders the Nscale logomark rather than PaperMod's fallback icon.
- The logomark inherits the active theme colour and remains visible in both
  light and dark themes.
- The functional and complete test suites pass.

## Solution Design

### Configuration

Rename the `cv` social-icon entry to `nscale` and update its URL.

### Icon Rendering

Add a site-level `layouts/partials/social_icons.html` override based on
PaperMod's seven-line partial. Handle `nscale` locally with the three paths from
the official Nscale logomark, using:

- a `0 0 36 20` view box around the icon rather than the full wordmark;
- `fill="currentColor"` for theme-aware black/white rendering;
- the source opacity values of `0.6` and `0.4` on the secondary paths;
- the existing PaperMod `svg.html` partial for every other social icon.

This avoids copying and maintaining PaperMod's 412-line SVG catalogue while
retaining the standard site-override mechanism.

### Tests

Update the navigation test to verify:

- the Nscale link resolves to `https://nscale.com/`;
- its title is `Nscale`;
- its inline SVG has the expected view box, fill, and three paths;
- no Edera profile link remains.

## Implementation Plan

1. Update the social-icon name and URL in `config.yaml`.
2. Add the focused social-icons partial override with the Nscale logomark.
3. Update the functional navigation assertions.
4. Add `Nscale` to the repository spelling dictionary.
5. Build and test the site.
6. Inspect the rendered icon and computed colour in light and dark themes.

## Files Expected To Change

1. `config.yaml`
2. `layouts/partials/social_icons.html`
3. `tests/functional/navigation.test.js`
4. `.spelling.txt`
5. `docs/plan/issues/346_replace_edera_social_link_with_nscale_logo.md`

## Validation Plan

```bash
npm run test:functional
npm test
npm run test:spell
git diff --check
```

Use the repository's Nix development environment for Hugo and browser
dependencies when the plain shell lacks them. Start a local Hugo server for the
focused browser inspection.

## Risks And Open Questions

- A full `svg.html` override would drift whenever PaperMod adds or changes
  icons. The focused `social_icons.html` override reduces this maintenance
  surface.
- Nscale's official media kit says the standalone icon is acceptable when the
  complete logo cannot fit. A compact social-icon slot meets that constraint,
  and the surrounding PaperMod link spacing supplies visual separation.
- No open questions block implementation.

## Research Validation

- The plan directly addresses all acceptance criteria in issue #346.
- Nscale's official media kit permits separate icon use and specifies black or
  white rendering depending on the design: `https://www.nscale.com/media-kit`.
- The official logomark source was checked on 2026-07-26 at:
  `https://cdn.prod.website-files.com/666078e26595dfe9b1e8171f/698b6cdbf98ec68e6342932f_Logo.svg`.
- The expected files match Hugo and PaperMod ownership boundaries without
  modifying the theme submodule.
- Automated assertions plus rendered light/dark inspection cover the primary
  regression risks.
- Review outcome: approved for implementation.

## Success Criteria

- [x] The profile social icon links to `https://nscale.com`.
- [x] No configured social icon references `edera.dev`.
- [x] The Nscale logomark renders instead of PaperMod's fallback icon.
- [x] The logomark uses `currentColor` for theme-aware rendering.
- [x] The functional and complete test suites pass.

## Validation Results

- `git submodule update --init --recursive themes/PaperMod` - passed.
- `npm ci` - passed with existing peer-dependency, deprecation, and audit
  warnings.
- `npm run test:functional` - passed 20 tests across two suites, including
  computed SVG fill checks in dark and light themes.
- `nix develop --command bash -lc 'npm test'` - passed all nine Hugo build
  checks, all 20 functional tests, and 100 accessibility checks with no
  violations.
- `npm run test:spell` - initially failed on `wordmark` in this plan, then
  passed after adding a local cspell annotation; 38 files checked with no
  remaining issues.
- `git diff --check` - passed.
- `pre-commit run --all-files` - initially failed because `Nscale` was absent
  from the repository spelling dictionary; `.spelling.txt` was updated and the
  full hook suite then passed.
- Local rendered HTML contains the `0 0 36 20` current-colour SVG and no Edera
  URL.
- In-app browser inspection was unavailable because no browser was connected in
  this session. No alternative browser controller was substituted; the
  functional assertions and post-PR Netlify/Lighthouse checks provide the
  rendered gates.

## Branch Review

- Classification: code-relevant configuration, Hugo layout, and functional test
  changes.
- Repo-local `docs/pre-pr-branch-review.md`: not present.
- `differential-review` and Trail of Bits specialist skills: unavailable in this
  session; performed the detailed-reference manual fallback.
- Manual review checked URL replacement, fallback-icon exclusion, Hugo partial
  precedence, current-colour rendering, accessibility, theme-submodule
  isolation, test coverage, and historical Edera scope.
- No blocking findings or non-blocking follow-up ideas were identified.
