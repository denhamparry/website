---
status: Complete
issue: 436
date: 2026-11-02
---

# Issue #436: Relax glob and minimatch overrides

## Problem and choice

The exact `glob` and `minimatch` overrides protect against GHSA-g3hv-75wg-m249
but prevent later compatible patch and minor releases. The latest Jest 30.5.2,
`test-exclude` 8.0.0, `babel-plugin-istanbul` 8.0.0, and linkinator 8.1.0 still
declare older major ranges on 2026-11-02. Keep both overrides with caret ranges
until all consumers adopt compatible ranges. Removing them now would restore
vulnerable minimatch copies.

Issue snapshot: [#436](https://github.com/denhamparry/website/issues/436),
fetched 2026-11-02; no comments.
[#434](https://github.com/denhamparry/website/issues/434) and merged
[#435](https://github.com/denhamparry/website/pull/435) document why both
overrides are required and establish the 20-test baseline.

## Implementation and validation

1. Change both manifest overrides to `^11.0.4` and `^14.0.3`; run Node 22
   `npm install --ignore-scripts` and retain the lockfile when resolution does
   not change.
2. Assert every locked minimatch is at least 11.0.1; run clean
   `npm ci --ignore-scripts` and dependency-tree, Jest discovery, and
   `test-exclude` glob probes.
3. Initialize PaperMod, build Hugo output, start a local Hugo server, then run
   `npm test` and `npm run test:links`; stop the server afterward. Observe PR
   CI.
4. Review the full branch diff and staged result, run repository pre-commit,
   then verify the published PR against every criterion.

Expected files: `package.json` and this plan. Local Homebrew Node is broken; use
Nix Node 22 and Hugo. Puppeteer requires its Chrome browser. The test suite
needs built `public/` and a server on port 1313.

## Issue traceability and acceptance

| Issue item                                                  | Disposition and evidence                                                                       | Timing, owner, prerequisite, result                                                                             |
| ----------------------------------------------------------- | ---------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------- |
| Remove overrides when all consumers adopt compatible ranges | Conditional option; not applicable while latest upstream ranges remain on glob 13/minimatch 10 | Pre-merge, agent, npm registry inspection; observed incompatible ranges                                         |
| Otherwise use caret ranges and document why                 | Implement in manifest and this plan; unchanged lockfile resolution                             | Pre-merge, agent, Node 22 npm; complete                                                                         |
| Every locked minimatch is at least 11.0.1                   | Inspect all package keys after install                                                         | Pre-merge, agent, lockfile; complete: only 11.0.4                                                               |
| `npm test` and link test pass in CI, with 20 Jest tests     | Run locally and observe the PR workflow at the published SHA                                   | Pre-merge, agent, local build/server/browser complete: 20 Jest, 9 Hugo, 100 accessibility, 12 links; CI pending |
| Linked #434 security fix remains intact                     | Preserve both overrides and check all resolved versions                                        | Pre-merge, agent, npm tree; complete: glob 14.0.3 and minimatch 11.0.4                                          |
| Future upstream adoption                                    | Non-blocking follow-up in existing #436 context; remove overrides in a later change            | External, owner, new compatible upstream releases; pending                                                      |

## Risk and research review

Caret ranges retain the same major versions and permit later compatible
releases. The existing override already crosses parents' declared major ranges,
so clean installation and behavior checks remain necessary. A lockfile-only
assertion would miss test-discovery regressions; the Jest and `test-exclude`
probes cover that path. Review of the registry ranges and merged #435
compatibility evidence supports the caret approach. The original failure mode is
represented by removing the overrides from a temporary manifest and observing
that npm resolves older minimatch majors; no vulnerable pattern will be
executed. `npm install --package-lock-only --ignore-scripts` changed only
unrelated platform metadata, which was restored; `npm ci --ignore-scripts`
installed 430 packages from the unchanged lockfile. An independent read-only
review found no blocker. The published CI link-test log still needs direct
inspection because that workflow step permits errors.
