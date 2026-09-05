---
status: Complete
issues:
  - 388
  - 389
date: 2026-09-05
---

<!-- cspell:words MaxLPS Pentland Sessionize -->

# GitHub Issues #388 and #389: Review Talks and Search Pages

## Problem

GitHub issues [#388](https://github.com/denhamparry/website/issues/388) and
[#389](https://github.com/denhamparry/website/issues/389) report that
`content/talks.md` and `content/search.md` require review. Lewis also asked for
his accepted KCD UK Edinburgh 2026 session to be added to the Talks page using
the published conference schedule.

## Source Snapshot

- Both issues were fetched on 2026-09-05. They were open, assigned to Lewis,
  labelled `documentation` and `help wanted`, and had no comments. Their bodies
  contain only “This page requires review”.
- The KCD UK 2026 schedule at <https://ckranz.github.io/kcduk/> loads live data
  from Sessionize. The data was fetched on 2026-09-05 and lists Lewis
  Denham-Parry's accepted, confirmed talk, “GPUs have the Power! Lessons learned
  from DPS and MaxLPS”, from 11:15 to 11:45 on 2026-10-19 in Pentland West.
- The schedule supplies the talk abstract. Its `liveUrl` and `recordingUrl` are
  null, and the speaker entry supplies no additional links, so no resource link
  is currently available.
- `content/search.md` still selects PaperMod's `search` layout and retains the
  expected title, summary, placeholder, and navigation behaviour.

## Acceptance Criteria And Traceability

| Source item                                  | Disposition               | Evidence target                                                          |
| -------------------------------------------- | ------------------------- | ------------------------------------------------------------------------ |
| Review `content/talks.md` (#388)             | Implement in this PR      | Set `reviewed` to `2026-09-05` after checking the page                   |
| Add the requested KCD UK Edinburgh 2026 talk | Implement in this PR      | Add the sourced title, date, event link, and abstract at the top of 2026 |
| Avoid unsupported resources                  | Implement in this PR      | Omit `Resources` until the schedule publishes one                        |
| Review `content/search.md` (#389)            | Implement in this PR      | Preserve its search metadata and set `reviewed` to `2026-09-05`          |
| Keep search functionality working            | Validate without new code | Existing functional coverage must still find the Talks page              |
| Close both issues after the updates          | Implement in PR metadata  | Use `Closes #388` and `Closes #389`; do not close either manually        |
| Deployment or merge                          | Out of scope              | Leave the PR open for user-managed review and merge                      |

## Implementation Plan

1. Update the Talks page review date and add the sourced KCD UK 2026 entry in
   reverse chronological order.
2. Update only the Search page's inert review marker after confirming its
   PaperMod search configuration remains correct.
3. Compare the actual branch diff with the planned three-file scope.
4. Run the full site, functional, accessibility, spelling, link, Markdown-fence,
   whitespace, and staged pre-commit checks.
5. Re-fetch both issues for branch review, then open one PR with automatic
   closing linkage for both explicitly grouped review issues.

## Files Expected To Change

1. `content/talks.md`
2. `content/search.md`
3. `docs/plan/issues/388_389_review_talks_and_search.md`

## Validation Plan

```bash
nix develop --command bash -lc 'npm test'
npm run test:links
npm run test:spell
git diff --check
pre-commit run --all-files
```

Also assert that the rendered Talks page contains the new title and date, the
rendered Search page still includes its search input, and the generated search
index still includes the Talks page. Every executable shell fence in changed
Markdown must pass syntax validation.

## Risks And Open Questions

- The schedule is dynamic external data. The plan records the fetch date and
  copies only the published title, date, event identity, and abstract required
  for the website entry.
- No resource link is published. Adding a guessed slide or recording location
  would create an unsupported claim, so the entry deliberately omits it.
- The event begins on 19 October and spans two days, but the published session
  itself starts on 19 October; the talk entry therefore uses the session date.
- This is a low-risk content-only change. No deployment, credential, runtime, or
  security mutation is required.

## Research Review

- Iteration 1 confirmed that both live issues are stale-page review reminders
  with no hidden comment requirements and that the user explicitly grouped them.
- The exact Sessionize speaker ID maps to one accepted and confirmed session;
  its room ID maps to Pentland West, and its time and abstract are present in
  the same source payload.
- Prior review issues #340 and #341 establish the repository convention of
  preserving page behaviour while refreshing `reviewed`. The existing full suite
  directly covers Talks generation, navigation, search results, and
  accessibility.
- Existing talk entries are reverse chronological and permit entries without a
  `Resources` field. The expected file list is complete, and no theme or test
  change is justified.
- Review outcome: approved for implementation with no blocking open question.

## Implementation Notes

- Added the sourced KCD UK Edinburgh 2026 session above the earlier 2026 talks,
  preserving reverse chronological order.
- Included the published title, session date, schedule link, and full abstract.
  No unsupported resources field, time, or room metadata was added.
- Updated both page review markers to `2026-09-05` without changing the Search
  page's title, layout, summary, or placeholder.

## Validation Results

- `git submodule update --init --recursive themes/PaperMod` - passed at the
  repository-pinned PaperMod commit.
- `npm ci` - passed: 451 packages installed and zero vulnerabilities reported.
- Server-backed `nix develop --command bash -lc 'npm test'` - passed all nine
  Hugo checks, 20 functional tests, and 100 accessibility checks with zero
  violations.
- Rendered-content assertions - passed: the Talks HTML contains the new title,
  event, and date; the Search HTML contains its search input; `index.json`
  contains the Talks page and new session text.
- `npm run test:links` - passed: 12 rendered-site links scanned with zero
  errors.
- CI-equivalent `lychee` validation - passed: 90 links checked, 86 unique, 90
  successful, zero errors, and 39 redirects.
- `npm run test:spell` - passed: 48 files checked with zero spelling issues.
- Complete changed-Markdown shell-fence validation - passed: the two content
  pages contain no executable fences, and this plan's Bash fence passes
  `bash -n`.
- `git diff --check` - passed.
- Staged `pre-commit run --all-files` - the first run passed every hook except
  Prettier, which reformatted the new content and plan. After selectively
  restaging the three intended files, the second run passed every hook without
  further changes.

## Branch Review

- Both live issues were re-fetched on 2026-09-05 and remained open, unchanged,
  and without comments.
- Classification: non-code content plus an implementation plan.
- Repo-local `docs/pre-pr-branch-review.md`: not present.
- Trail of Bits review skills: skipped because there are no code-relevant
  changes.
- Manual differential review confirmed that the sourced talk is placed in the
  correct year and order, its public details match the schedule payload, both
  review dates are current, and the Search metadata is otherwise unchanged.
- A related-content sweep found earlier KCD UK entries but no duplicate 2026
  session. Blocking findings: none. Follow-up ideas: none.

## Outcome

Both stale pages record their 2026-09-05 review, and the Talks page publishes
the sourced KCD UK Edinburgh 2026 session without inventing unavailable
resources. All local content, site, search, accessibility, spelling, link,
shell-fence, diff, and pre-commit checks pass. The change is ready for commit,
an open pull request, and independent post-PR verification.
