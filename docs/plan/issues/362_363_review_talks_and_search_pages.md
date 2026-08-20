---
status: In Progress
issues:
  - 362
  - 363
date: 2026-08-20
---

<!-- cspell:words PaperMod worktree -->

# GitHub Issues #362 and #363: Review talks and search pages

## Problem

The automated content-maintenance workflow opened
[#362](https://github.com/denhamparry/website/issues/362) for `content/talks.md`
and [#363](https://github.com/denhamparry/website/issues/363) for
`content/search.md` because neither page had changed for more than 14 days. Both
pages need a current review marker without unnecessary content changes.

## Current State

- Both pages record `reviewed: 2026-07-26`.
- The latest listed talk took place on 14th April 2026.
- The user confirmed on 20th August 2026 that there are no new talks to add.
- The search page still uses PaperMod's minimal search frontmatter.
- The stale-page workflow uses each file's latest commit date, so committing the
  completed reviews resets the maintenance interval.

## Acceptance Criteria

- `content/talks.md` records a review date of `2026-08-20`.
- No new or speculative talk entries are added, and existing talk content is
  unchanged.
- `content/search.md` records a review date of `2026-08-20`.
- The search title, layout, summary, and placeholder remain unchanged.
- `/search/` remains available and searching for `Talks` still returns the Talks
  page.
- Relevant repository validation passes.
- One pull request closes both #362 and #363.

## Issue Traceability

| Source item                        | Disposition                | Evidence target                                         |
| ---------------------------------- | -------------------------- | ------------------------------------------------------- |
| #362: review `content/talks.md`    | Implemented in this PR     | Updated `reviewed` marker and unchanged content diff    |
| #363: review `content/search.md`   | Implemented in this PR     | Updated `reviewed` marker and preserved search metadata |
| User: no new talks                 | Implemented in this PR     | No talk entries added or modified                       |
| User: create a single PR           | Implemented in this PR     | One branch and PR with closing lines for both issues    |
| Search layout and result behavior  | Validated without a change | Hugo, functional, and rendered-output checks            |
| New talks or broader content edits | Intentionally out of scope | User confirmed there are no new talks                   |

## Implementation Plan

1. Update the `reviewed` frontmatter field in `content/talks.md` from
   `2026-07-26` to `2026-08-20` without changing the talk list.
2. Update the `reviewed` frontmatter field in `content/search.md` from
   `2026-07-26` to `2026-08-20` without changing its search metadata.
3. Verify the actual changed files and content diff match this plan.
4. Run the site, functional, accessibility, spelling, whitespace, and pre-commit
   validation appropriate to the two reviewed pages.
5. Create one pull request containing `Closes #362` and `Closes #363`.

## Files Expected To Change

1. `content/talks.md`
2. `content/search.md`
3. `docs/plan/issues/362_363_review_talks_and_search_pages.md`

## Validation Plan

```bash
npm test
npm run test:spell
pre-commit run --all-files
git diff --check
```

Also inspect the generated `/search/` output and `index.json` to confirm that
the search input remains present and the Talks page remains indexed. If Hugo is
unavailable in the plain shell, run the tests from the repository's Nix
development environment.

## Risks And Open Questions

- An inert frontmatter date should not change rendering, but the existing
  browser-backed tests and generated-output checks will detect regressions.
- Adding a public "no upcoming talks" placeholder would be user-facing content
  that was not requested, so the review marker is the only talks-page change.
- No open questions remain; the user explicitly selected one PR and confirmed
  that there are no new talks.

## Research Validation

- Iteration 1: both live issues are open documentation-review requests with the
  same minimal body, and their named files match the repository paths.
- The prior #340 and #341 review plans establish the narrow review-marker
  pattern and the relevant search verification.
- The stale-page workflow confirms that a committed page review resets its
  14-day maintenance interval.
- The planned file set, validation, and two closing keywords cover the complete
  issue and user-request scope. No blocking gaps remain.

## Validation Results

- `git submodule update --init --recursive themes/PaperMod` - passed.
- `npm ci` - passed; installed 561 packages with existing deprecation notices
  and no reported vulnerabilities.
- `nix develop --command bash -lc 'npm test'` - passed:
  - 9 Hugo build checks.
  - 20 functional tests across two suites, including search navigation and the
    Talks search result.
  - 100 accessibility checks with zero violations.
- `npm run test:spell` - passed; 44 files checked with no issues.
- Generated `/search/` and `index.json` inspection - passed; the search input is
  present and the Talks page remains indexed.
- The first generated-search assertion expected a quoted HTML attribute and
  failed because Hugo minified it to `id=searchInput`; the corrected
  minification-safe assertion passed.
- Complete changed-Markdown shell-fence validation - one executable `bash` fence
  in this plan passed `bash -n`; the content pages contain none.
- The first shell-fence extraction wrapper had a shell-quoting parse error; the
  direct extraction without nested quoting passed.
- `git diff --check` - passed.
- The first staged `pre-commit run --all-files` passed every hook except
  Prettier, which reformatted this plan.
- After selectively restaging the formatter change, `pre-commit run --all-files`
  passed all hooks without further changes.

## Branch Review

- Live issues #362 and #363 were re-fetched and remain open with their original
  documentation-review scope.
- Classification: non-code content/frontmatter and workflow documentation.
- Repo-local `docs/pre-pr-branch-review.md`: not present.
- Trail of Bits review skills: skipped - no code-relevant changes.
- Manual differential review confirmed that both content files change only the
  `reviewed` date, with no talk entries or search metadata changed.
- The full test suite, rendered-output checks, spelling, shell-fence syntax, and
  whitespace checks found no regression.
- Blocking findings: none.
- Follow-up ideas: none.

## Post-PR Verification

Pending PR creation.

## Outcome

Pending implementation and pull request creation.
