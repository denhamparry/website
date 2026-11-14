---
status: Complete
issue: 423
date: 2026-11-14
---

<!-- cspell:words MaxLPS Sessionize -->

# Issue #423: Review talks and remove cancelled Porto session

## Problem and scope

Issue [#423](https://github.com/denhamparry/website/issues/423) was fetched on
2026-11-14. It is open with no comments. The user confirms they can no longer
give the 19 November Porto talk and have no other upcoming talks. The page
currently lists that future talk above the historical talks.

## Implementation and issue traceability

| Item                                          | Disposition and evidence                                                                    | Timing                                                              |
| --------------------------------------------- | ------------------------------------------------------------------------------------------- | ------------------------------------------------------------------- |
| Check accuracy and fix stale entries or links | Remove the cancelled Porto entry; inspect other entries and links for obvious stale content | Pre-merge; Codex                                                    |
| No other upcoming talks                       | Validate the remaining entries are dated before 2026-11-14; retain historical talks         | Pre-merge; Codex                                                    |
| Set `reviewed` marker                         | Change `content/talks.md` to 2026-11-14                                                     | Pre-merge; Codex                                                    |
| Page builds and renders                       | Run `npm run test:hugo` and inspect generated talks HTML                                    | Pre-merge; Codex; needs Node dependencies, Hugo and theme submodule |
| PR closes issue                               | Use `Closes #423` after all above pass                                                      | Pre-merge; Codex                                                    |

No issue comments, conditional requirements, operator actions or explicit
out-of-scope items exist. Merge and publication remain user-managed.

## Files and validation

- Change `content/talks.md` and this plan only.
- Remove the complete Porto entry and update the frontmatter review date.
- Use `git submodule update --init --recursive` and `npm ci` if dependencies are
  absent. Use `nix develop` for Hugo if it is not on the plain shell path.
- Run `npm run test:hugo`, inspect `public/talks/index.html` for no Porto title
  or session URL and for the retained historical entries, then run spelling,
  link validation where practical, `git diff --check` and staged pre-commit.
- Inspect the complete branch diff and re-fetch the issue before PR creation.

## Research review

The user's current cancellation supersedes the earlier accepted Sessionize
schedule recorded in issue #405. The October 2026 KCD UK Edinburgh entry is a
different, historical event and must remain. This is a content-only change; the
plan covers the issue criteria and is approved for implementation.

## Completion evidence

- Removed the complete Porto entry and set `reviewed: 2026-11-14`. The first
  remaining entry is dated 19 October 2026; all later entries are older.
- `npm run test:hugo` passed 9/9 checks in the Nix environment. The generated
  page retains KCD UK Edinburgh and has no Porto title or session URL.
- `lychee --config .lychee.toml --root-dir static content/talks.md` passed all
  90 links. `npm run test:links` passed 12 rendered-site links.
- `npm run test:spell` passed 59 files; `git diff --check` passed.
- Branch review: content and plan only. The full diff preserves historical
  entries and removes no other event. Code-specific review skills do not apply.
  No follow-up ideas were identified. Issue #423 was re-fetched and still has no
  comments or additional requirements.
