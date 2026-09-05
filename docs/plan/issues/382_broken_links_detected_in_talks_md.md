---
status: Complete
issue: 382
date: 2026-09-05
---

# GitHub Issue #382: Broken links detected in talks.md

## Problem

The monthly Link Checker run
[33455592639](https://github.com/denhamparry/website/actions/runs/33455592639)
reported one hard failure in `content/talks.md`: the NDC London 2022 workshop
URL returns HTTP 404. The talks page should retain the historical workshop and
venue while no longer publishing a dead link.

## Source Snapshot

- Issue [#382](https://github.com/denhamparry/website/issues/382) was fetched on
  2026-09-05 at 15:43 BST and was open with `documentation` and `help wanted`
  labels.
- The issue had no comments, so its body and linked workflow run are the full
  live specification.
- The failed run checked commit `5729716745a9bd7175d477464b7eb4532f8d6777` and
  reported 89 successful links plus one 404 at `content/talks.md:508`.
- The same URL still returned HTTP 404 on 2026-09-05. The NDC London home page
  remained available, but it did not provide the historical session route.
- Archive.org's availability API reported one HTTP-200 capture from 2026-03-17,
  but the archive service was temporarily offline and the captured content could
  not be inspected. The unverified capture will not replace the dead link.

## Acceptance Criteria And Issue Traceability

| Source item                                         | Disposition                | Evidence target                                                                               |
| --------------------------------------------------- | -------------------------- | --------------------------------------------------------------------------------------------- |
| Review the failed workflow log                      | Validated without a change | Run 33455592639 identifies the single 404 at line 508                                         |
| Determine whether the failure is transient          | Validated without a change | A fresh request still returns 404 while the site root returns 200                             |
| Fix or remove the broken link in `content/talks.md` | Implemented in this PR     | Preserve `NDC London, Queen Elizabeth II Centre, London` as plain text                        |
| Consider an archived copy                           | Validated without a change | One 2026 capture exists but could not be inspected; do not publish an unverified archive link |
| Keep the historical talk entry                      | Implemented in this PR     | Change only the dead event link, not the heading, date, venue, or description                 |
| Close issue after the fix                           | Implemented in this PR     | PR body will use `Closes #382`; no manual issue close                                         |
| Other redirected or successful links from the run   | Intentionally out of scope | The source run reported them as successful, not broken                                        |

## Implementation Plan

1. Replace the linked NDC London event value with plain text, preserving the
   event name and venue.
2. Compare the actual diff with the expected two-file scope.
3. Run failure-shaped and corrected link checks, Hugo/site tests, spelling,
   whitespace checks, complete-file shell-fence validation where applicable, and
   the staged pre-commit workflow.
4. Re-fetch the issue before branch review, then create an open PR with
   automatic issue-closing linkage.

## Files Expected To Change

1. `content/talks.md`
2. `docs/plan/issues/382_broken_links_detected_in_talks_md.md`

## Validation Plan

```bash
curl -sS -L --max-time 30 -o /dev/null -w '%{http_code}\n' \
  'https://ndclondon.com/agenda/an-introduction-to-kubernetes-part-i-02zg/0vh9oah807o'
rg -n 'an-introduction-to-kubernetes-part-i-02zg|NDC London 2022' content/talks.md
nix develop --command bash -lc 'npm test'
npm run test:spell
git diff --check
pre-commit run --all-files
```

The first command documents the original 404. After the edit, the removed URL
must have zero repository matches, the workshop heading and venue must remain,
and the repository link checker or closest available lychee equivalent must
pass. The `content/talks.md` file has no executable shell fences; the plan's
single Bash fence must pass `bash -n` after deterministic substitution of the
multiline display command.

## Risks And Open Questions

- Removing the hyperlink reduces direct navigation but is safer than linking a
  current conference home page that does not prove the 2022 workshop details.
- Archive.org was temporarily unavailable during planning. Its availability API
  confirmed a 2026 capture exists, but the capture contents could not be
  validated, so the deterministic plain-text fallback is used.
- This is a low-risk content-only change with no deployment, credential, or
  runtime-state mutation. No open question blocks implementation.

## Research Validation

- Iteration 1 found that the first draft over-weighted the archive capture date:
  a 2026 capture could still contain a historical page. The plan now rejects it
  only because its content and current reachability could not be validated.
- Iteration 2 confirmed the archive-or-plain-text fallback matches prior issue
  #218, and plain `Event:` values already appear throughout `content/talks.md`.
- An analogous-pattern sweep found one separate NDC London 2019 home-page link.
  The source workflow reported that link successful, it uses a different domain
  and route, and it is intentionally unchanged.
- The exact dead URL appears only in `content/talks.md` and this plan. The
  planned two-file scope, failure/success checks, historical-content
  preservation, and closing linkage cover the complete live issue. No blocking
  gap remains; the plan is approved for implementation.

## Validation Results

- Original-failure check - passed: the removed session URL returned HTTP 404;
  the NDC London home page returned HTTP 200.
- `npm ci` - passed: 451 packages installed, zero reported vulnerabilities.
- Initial `nix develop --command bash -lc 'npm test'` - Hugo's nine checks
  passed, then all browser tests failed with `ERR_CONNECTION_REFUSED` because
  the required Hugo server was not running. This was a harness setup failure,
  not a content failure.
- Server-backed `npm test` in `nix develop` - passed: nine Hugo checks, 20
  functional tests, and 100 accessibility checks with zero violations.
- `npm run test:links` - passed: 12 rendered-site links scanned with zero
  errors.
- CI-equivalent `lychee` invocation - passed: 89 links checked, 85 unique, 89
  successful, zero errors, and 39 redirects. This is exactly one link fewer than
  the failing source run because the sole 404 was removed.
- `npm run test:spell` - passed: 47 files checked with zero spelling issues.
- Complete changed-Markdown shell-fence validation - passed: zero executable
  fences in `content/talks.md`; the plan's one Bash fence passed `bash -n`
  without placeholder substitution.
- Content assertions - passed: the dead URL has zero matches, while the NDC
  London 2022 heading and full venue remain.
- `git diff --check` - passed.
- Staged `pre-commit run --all-files` - the first run passed every hook except
  Prettier, which reformatted this plan. After selectively restaging the two
  intended files, the second run passed every hook without further changes.

## Branch Review

- The live issue was re-fetched on 2026-09-05 and remained open, unchanged, and
  without comments.
- Classification: non-code content plus an implementation plan.
- Repo-local `docs/pre-pr-branch-review.md`: not present.
- Trail of Bits review skills: skipped - no code-relevant changes.
- Manual differential review confirmed that `content/talks.md` changes only the
  dead event link to the same plain-text event and venue; the plan is the only
  other changed file.
- The final analogous-pattern sweep found only the intentionally distinct,
  source-run-successful NDC London 2019 home-page link.
- Blocking findings: none.
- Follow-up ideas: none.

## Outcome

The confirmed 404 is removed without deleting or rewriting the historical
workshop entry. All local content, site, accessibility, spelling, link, fence,
and diff checks pass. The change is ready for the staged pre-commit gate and an
open pull request linked to issue #382.
