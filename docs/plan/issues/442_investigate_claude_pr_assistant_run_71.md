---
status: Complete
issue: 442
date: 2026-11-13
---

# Issue #442: Investigate Claude PR Assistant run #71

## Problem and outcome

The retained
[Claude PR Assistant runs](https://github.com/denhamparry/website/actions/workflows/claude.yml)
jump from #70 to #72 on 2026-07-08. A missing run number alone does not
establish deletion, execution, compromise, or credential exposure. This
investigation records the available repository evidence and leaves the cause
**unknown** pending retained audit data or GitHub Support evidence.

Issue [#442](https://github.com/denhamparry/website/issues/442) was fetched on
2026-11-13; it had no comments. The issue itself identifies
[run #70](https://github.com/denhamparry/website/actions/runs/28937704510) and
[run #72](https://github.com/denhamparry/website/actions/runs/28938602729).

## Evidence and assessment

| Evidence                                                                                                                                      | Observation                                                                                                                                                                                                                                                                                                                                                | Limit                                                                                                                     |
| --------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------- |
| GitHub Actions workflow-scoped API, queried 2026-11-13                                                                                        | The 100 most recent retained runs span #38–#138; #71 is the sole absent number. A 2026-07-08 10:45–11:30 UTC query returns #69, #70 and #72, but no #71.                                                                                                                                                                                                   | The API does not explain the missing number or expose a deleted run's payload.                                            |
| [Run #70](https://github.com/denhamparry/website/actions/runs/28937704510)                                                                    | `issue_comment` at 11:03:09 UTC, head `7a4753637ed086216f1783dce2453420ea7b954a`, conclusion `skipped`, one skipped job, attempt 1. It follows [issue #330's comment](https://github.com/denhamparry/website/issues/330#issuecomment-4914118900) at 11:03:06 UTC.                                                                                          | The visible comment has no `@claude` mention, consistent with the job condition.                                          |
| [Run #72](https://github.com/denhamparry/website/actions/runs/28938602729)                                                                    | `issue_comment` at 11:19:21 UTC on the same head, conclusion `skipped`, one skipped job, attempt 1. It follows [PR #331's comment](https://github.com/denhamparry/website/pull/331#issuecomment-4914238285) at 11:19:17 UTC.                                                                                                                               | The visible comment has no `@claude` mention, consistent with the job condition.                                          |
| Repository activity, 10:45–11:25 UTC                                                                                                          | [Issue #330](https://github.com/denhamparry/website/issues/330) opened at 10:48:52 and closed at 11:03:07; [PR #331](https://github.com/denhamparry/website/pull/331) opened at 11:13:30 and closed at 11:19:23. Five ordinary PR workflows ran at 11:13:33. The main-branch commits in the interval added PR-body validation and corrected content links. | These events explain visible runs, but cannot identify #71's event.                                                       |
| Workflow at the [run head](https://github.com/denhamparry/website/blob/7a4753637ed086216f1783dce2453420ea7b954a/.github/workflows/claude.yml) | `git show` confirms the Claude workflow used the same `@claude` job guard. Git history shows no edit to this workflow on 2026-07-08.                                                                                                                                                                                                                       | Repository history does not show workflow executions or deletion actions.                                                 |
| Retained evidence access                                                                                                                      | Filename search in this repository and `~/Downloads`, connected Drive searches for audit exports, the workflow name and GitHub Support, and Gmail searches for the adjacent run ID, workflow name plus #71, and Support mail found no matching case or export. This repository belongs to a GitHub user, so the organization audit API is inapplicable.    | Search results are scoped and may miss private or differently named records; their absence elsewhere was not established. |

**Classification: unknown.** The inspected runs were skipped, and no unexpected
workflow edit was found in the checked interval. There is no evidence here of a
confirmed incident or credential exposure. There is also no evidence that
explains why #71 is absent. No credential rotation, OIDC trust change, workflow
containment, or live settings change is justified by this evidence alone.

## Implementation and validation

Expected tracked file: this investigation plan only. No workflow or secret
change is proposed.

1. Recheck the workflow-scoped Actions list and both adjacent runs, including
   job conclusions and attempts.
2. Check issue/PR activity and workflow history in the interval; keep raw
   comments, logs and secrets out of the tracked file.
3. Record the personal-repository audit evidence limit, then retain an external
   owner action for any available export or GitHub Support investigation.
4. Run Markdown/spelling and staged pre-commit checks. Website runtime tests are
   not relevant to this documentation-only change; `npm test` needs Hugo output,
   an active local server, the theme submodule and Puppeteer's browser.

## Issue traceability and acceptance

| Issue item                                                                                                    | Disposition and evidence                                                                                                                                    | Timing, owner, prerequisite, result                                                                 |
| ------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------- |
| Check retained Actions/audit exports or GitHub Support evidence for #71 and explain absence if knowable       | Local locations and current API checked above; cause remains unknown.                                                                                       | External/operator, repository owner, retained export or Support case; pending.                      |
| Review workflow and repository activity at 11:03–11:19 UTC for unexpected changes, execution, or log deletion | Workflow history, adjacent runs, jobs, issue/PR activity reviewed above; no unexpected edit or visible execution found. Deletion cannot be ruled in or out. | Pre-merge, agent, read-only GitHub/repository access; complete within available evidence.           |
| Classify as benign, unknown, or confirmed incident with evidence and owner                                    | Unknown classification and evidence limits above.                                                                                                           | Pre-merge, agent; complete provisionally. Repository owner owns any later reclassification.         |
| If exposure is confirmed, coordinate scoped containment, rotation and OIDC trust review                       | Conditional incident response, deliberately not triggered by this gap alone.                                                                                | External/operator, repository owner, confirmed exposure plus separate authorization; not triggered. |
| No credential rotation or live settings change implied by gap                                                 | No such changes in this PR.                                                                                                                                 | Pre-merge, agent; complete.                                                                         |

## Risk and review

The retained Actions API is a partial historical view, so this report does not
label #71 benign or deleted. The unresolved explanation remains with the
repository owner, who can check any retained export or ask GitHub Support for
the workflow ID `167713496`, run number `71`, and 2026-07-08 11:03–11:19 UTC
window without sharing secrets in the issue. Use `Refs #442` so the issue stays
open for that evidence. Branch review inspected the documentation and source
links; an independent delegated reviewer corrected the organization audit API
interpretation and found no remaining issue after the correction. Post-PR
verification will requery the adjacent runs and gap.
