---
status: Complete
issue: 437
date: 2026-11-02
---

<!-- cspell:words deepmerge mergeObject -->

# Issue #437: Track the deepmerge alert

## Problem and decision

Dependabot alert
[#70](https://github.com/denhamparry/website/security/dependabot/70) reports
`deepmerge@4.3.1` through the development-only `jest-config@30.5.2` dependency.
The repository's Jest configuration is local and trusted. The published package
and current Jest release still provide no patched path, so the actionable
resolution today is to dismiss alert #70 as tolerable risk, link this issue in
the dismissal, and retain this issue for an upstream recheck.

Issue [#437](https://github.com/denhamparry/website/issues/437) was fetched
2026-11-02T20:41:06Z with no comments. The alert was open and its GitHub
advisory listed no first patched version. The npm registry returned
`deepmerge@4.3.1` and `jest-config@30.5.2` as latest. An
[upstream comment](https://github.com/TehShrike/deepmerge/issues/273#issuecomment-6584747954)
on 2026-11-02 says the CVE issuer rejected the advisory; GitHub has not
withdrawn it. Record that dispute without treating it as an upstream package fix
or an alert closure.

## Implementation and validation

1. Verify the lockfile contains one development-only `deepmerge` path via
   `jest-config`, and inspect test imports for direct `deepmerge` use.
2. Dismiss alert #70 with reason `tolerable_risk` and a comment linking #437;
   query the stored alert to verify state, reason, and comment.
3. Keep the issue open for a later check when `deepmerge` releases above 4.3.1,
   `jest-config` removes it, or GitHub withdraws the advisory. If a safe fix
   exists then, update the lockfile and run `npm test` before checking that
   Dependabot closes the alert.
4. Review this plan, run focused dependency assertions and staged pre-commit
   hooks, then publish a documentation-only PR with `Refs #437`.

Expected tracked file: this plan. No package or lockfile change is warranted
without a patched upstream release. `npm test` is conditional on a dependency
change; it needs Node 22, the PaperMod submodule, a running local Hugo server,
and Puppeteer's browser. The Nix Node 22 executable works locally; Homebrew Node
currently fails to load `libsimdjson.34.dylib`.

## Issue traceability and acceptance

| Issue item                                                                                  | Disposition and evidence                                                       | Timing, owner, prerequisite, result                                                   |
| ------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------- |
| Dismiss alert #70 as tolerable risk with a #437 link, or remove vulnerable lockfile version | Dismissal path; stored alert confirms reason and comment                       | Pre-merge, agent; complete 2026-11-02T20:41:47Z                                       |
| If an upstream fix lands, update lockfile, pass `npm test`, and confirm alert auto-closes   | Conditional later dependency change; this issue tracks the trigger             | External/operator, maintainer, patched release or removed dependency; pending trigger |
| Recheck a newer `deepmerge` release or a `jest-config` replacement                          | Retain in this issue and record current versions above                         | External/operator, maintainer, upstream or advisory change; pending                   |
| Development-only Jest path and trusted configuration                                        | Manifest and lockfile show one dev-only path; `rg` found no direct test import | Pre-merge, agent; complete                                                            |
| Fork override alternative                                                                   | Intentionally out of scope; no drop-in compatibility evidence                  | Not applicable                                                                        |

## Risk and review

The upstream dispute is evidence about advisory status, not proof that every
possible use of `deepmerge` is safe. The dismissal is limited to this
repository's trusted test configuration and development dependency. This PR will
use `Refs #437` because a future upstream fix and alert auto-closure remain
conditional acceptance. Branch review is documentation-only; post-PR review will
independently verify the alert, dependency path, and issue coverage.
