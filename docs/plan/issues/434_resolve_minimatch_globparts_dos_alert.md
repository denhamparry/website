---
status: Complete
issue: 434
date: 2026-11-02
---

<!-- cspell:words globparts -->

# Issue #434: Resolve the minimatch globparts DoS alert

## Problem and approach

Two development-only `minimatch` copies in the lockfile are below the patched
11.0.1 release. A minimatch-only override to 11.0.4 breaks `glob` 10 wildcard
matching. Override `glob` to 14.0.3 as well, since that release declares
`minimatch ^11.0.2`. Validate both npm dependency consumers and the site suite.
If the combined override breaks tooling, document the limited exposure and
return the dismissal decision to the owner.

Issue snapshot: [#434](https://github.com/denhamparry/website/issues/434),
fetched 2026-11-02; no comments. Alert
[#73](https://github.com/denhamparry/website/security/dependabot/73) was open.

## Implementation and validation

1. Record baseline lockfile paths and Jest test count. Review the minimatch 11
   release notes and the npm parent constraints.
2. Add both overrides to `package.json` and regenerate `package-lock.json` with
   Node 22 npm. Inspect the entire dependency diff and every minimatch/glob
   path.
3. Run a clean `npm ci`, `npm ls minimatch --all`, lockfile version check,
   functional tests with the same test count, and coverage. Build Hugo output,
   run the link checker, and run `npm test` with a ready local Hugo server.
4. Review the diff and affected dependency consumers, then run staged pre-commit
   hooks and check GitHub PR checks after publication.

Expected files: `package.json`, `package-lock.json`, and this plan. Validation
setup: use `nix shell nixpkgs#nodejs_22 nixpkgs#hugo` because local Homebrew
Node does not start. Initialize the PaperMod submodule; start a local Hugo
server, verify port 1313 readiness, and stop it after tests. Puppeteer needs its
browser. GitHub CI uses Node 22 and Hugo; Netlify sets `SKIP_NPM_INSTALL=true`,
so these packages are not in production output.

## Issue traceability and acceptance

| Issue item                                                                         | Disposition and evidence                                                                   | Timing, owner, prerequisite, result                                                                                                   |
| ---------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------- |
| Alert #73 closed by fix or documented dismissal                                    | Fix path: lockfile contains only patched minimatch; owner verifies alert state after merge | Post-merge, owner, merged lockfile/Dependabot refresh; pending                                                                        |
| Override to 11.0.4 and `npm install`                                               | Add glob 14 override to retain wildcard matching; inspect manifest and lockfile            | Pre-merge, agent, Node 22 npm; complete: clean `npm ci` installed 430 packages                                                        |
| `npm test`, link checker, unchanged Jest test count, coverage                      | Validate locally and observe PR CI; capture baseline count                                 | Pre-merge local complete: 20/20 Jest before and after, 9/9 Hugo checks, 100 accessibility checks, 12/12 links; CI observation pending |
| Every lockfile minimatch >= 11.0.1                                                 | Query all lockfile package keys and `npm ls`                                               | Pre-merge, agent, regenerated lockfile; complete: sole copy is 11.0.4                                                                 |
| Review minimatch 11 changelog and major-version consumer compatibility             | Review release notes, Jest/glob and linkinator behavior                                    | Pre-merge, agent; complete: glob and test-exclude enumerate both expected tests, linkinator passes                                    |
| Dismiss if override breaks tooling; later remove override when upstream catches up | Conditional alternative and later maintenance, outside this fix path                       | External/operator, owner, failure or future upstream releases; not triggered                                                          |
| Check glob optimization-level mitigation                                           | Inspect installed glob callers/defaults; avoid asserting mitigation without evidence       | Pre-merge, agent; complete: glob 13 explicitly used level 2, so no mitigation claimed                                                 |
| Alert #70 deepmerge                                                                | Intentionally out of scope                                                                 | Not applicable                                                                                                                        |

## Risk and boundaries

Both overrides cross parent packages' declared major ranges. A passing install
alone cannot establish behavior compatibility; test discovery, coverage, and
link checking must work. The original failure requires untrusted glob input,
which repository test commands do not accept; lockfile version evidence is the
safe regression check. The source alert cannot be confirmed closed until GitHub
processes the merged lockfile. This PR will use `Refs #434` while that required
outcome remains pending. No deploy, alert dismissal, or issue closure is
authorized by this plan.

## Research review

Initial plan approved after checking the manifest, lockfile, test scripts, CI
setup, and installed `glob` call sites. `glob` 13 explicitly passes
`optimizationLevel: 2` when creating a minimatch instance; the current
dependency chain therefore cannot claim the lower default level as mitigation.
The
[minimatch 11 changelog](https://github.com/isaacs/minimatch/blob/main/changelog.md)
documents removed `makeRe`, `regexp`, `AST`, and internal methods, plus changed
`Minimatch.set` entries. Compatibility checks must exercise callers, not just
package resolution. Baseline version checks fail as expected; the safe negative
check is to reapply the version assertion to the original lockfile.

The first implementation exposed a blocking incompatibility: `glob` 10 expects
`RegExp` wildcard entries in `Minimatch.set`; version 11 returns `Matcher`
objects. Direct `glob` 10 wildcard calls and `test-exclude.globSync()` returned
no files while 20 Jest tests still passed. A coverage run produced 0/0 because
the suite instruments no source files; the direct `test-exclude` probe verifies
the failed discovery path. Independent read-only review confirmed this. Research
iteration 2 revised the plan to use `glob` 14, whose declared minimatch range
includes 11.0.4. Direct wildcard and `test-exclude.globSync()` probes found both
test files with the combined overrides. A second independent review found no
blocker after the revision. Clean Node 22 `npm ci`, full `npm test`, and the
link checker passed locally. PR checks and post-merge alert closure remain
externally observable acceptance.
