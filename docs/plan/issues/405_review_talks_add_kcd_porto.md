---
status: Complete
issue: 405
date: 2026-10-03
---

<!-- cspell:words Sessionize MaxLPS -->

# Issue #405: Review talks and add KCD Porto 2026

## Problem and outcome

The Talks page is due for a content review. Add the user's confirmed KCD Porto
session and update the review marker after checking existing entries and links.
Issue [#405](https://github.com/denhamparry/website/issues/405) was fetched on
2026-10-03; it is open and has no comments. The user supplied the
[Sessionize session](https://kcd-porto-2026.sessionize.com/session/1298379). Its
schedule API lists Lewis Denham-Parry as a confirmed speaker, the talk on
2026-11-19 at 16:40, and no recording or live URL.

## Implementation and traceability

| Requirement                                    | Disposition                  | Timing, owner, prerequisite and evidence                                                |
| ---------------------------------------------- | ---------------------------- | --------------------------------------------------------------------------------------- |
| Review accuracy and fix stale entries or links | Implement in this PR         | Pre-merge; Codex; inspect source and run link check against the page; record result     |
| Add the requested KCD Porto talk               | Implement in this PR         | Pre-merge; Codex; Sessionize session and schedule; verify rendered title, date and link |
| Set `reviewed` to review date                  | Implement in this PR         | Pre-merge; Codex; page review; inspect frontmatter                                      |
| Page builds and renders                        | Validate without code change | Pre-merge; Codex; Hugo and dependencies; `npm run test:hugo` and generated HTML         |
| PR closes #405                                 | Implement in PR metadata     | Pre-merge; Codex; all criteria pass; `Closes #405` and closing reference                |

No operator action, conditional requirement, or out-of-scope request appears in
the issue. Merge and deployment remain user-managed.

## Files and validation

- Edit `content/talks.md` and this plan only. Add the entry in reverse date
  order, using the published title, session date, direct event link, and
  existing abstract. Omit unsupported resources.
- Check existing event and resource links for stale targets; change only
  confirmed broken content in scope.
- Run `npm run test:hugo`, inspect `public/talks/index.html`, run
  `npm run test:links` and `npm run test:spell`, then `git diff --check` and
  staged pre-commit hooks. The Hugo test creates `public/`; link checking uses
  that generated output. Node dependencies and a local Hugo binary are required;
  use the repository's Nix environment when the binary is absent.
- Inspect the branch diff and re-fetch the issue before PR creation.

## Research review

The existing October 2026 entry carries the same title and abstract for a
different event, so the new entry must retain a distinct event link and date.
The Sessionize API confirms the session date and speaker rather than only the
conference's two-day span. Existing entries permit no `Resources` field. This
content-only plan is approved for implementation. An external link check can
fail because of remote availability; record each such result separately from the
Hugo build.

## Completion evidence

- Added the confirmed 19 November session and its published abstract above the
  October entry. The Sessionize schedule reports no live or recording URL.
- `npm run test:hugo`: 9 passed, 0 failed. The generated Talks HTML contains the
  new event title, date and direct session URL.
- The CI-equivalent Lychee audit of `content/talks.md` checked 91 links: 91 OK,
  0 errors. No existing stale target required a change.
- `npm run test:links`: 12 rendered-site links passed.
- `npm run test:spell`: 52 files checked, 0 issues.
- `git diff --check`: passed. The refreshed issue has no comments or new scope.
- Branch review: content and planning documentation only; code-specific review
  skills do not apply. Diff is limited to the two planned files. The new entry
  is distinct from the October talk by event, date and link.
