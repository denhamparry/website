---
issue: 286
title:
  "fix(tests): puppeteer v25 breaks Jest functional tests (ESM entry + Node 20
  engine)"
status: Complete
decision: "Option B — migrate to puppeteer v25"
branch: denhamparry.co.uk/fix/gh-issue-286
---

# Plan: Fix puppeteer v25 Jest functional test failure (#286)

## Decision (Acceptance Criterion #1)

**Option B — migrate to puppeteer v25.** Chosen over Option A (pin to 24.x)
because the CI Node-engine blocker is already resolved: commit `44b98fbf` ("ci:
bump ci and local node to 22 lts") moved the test matrix to Node 22.x, which
satisfies puppeteer@25's `engines.node >= 22.12.0`. Only the Jest ESM
entry-point problem remains, and it is fixable with a small Babel transform.
Migrating now unblocks Dependabot PR #285 and all future v25+ bumps.

## Problem Recap

Puppeteer v25's main entry is ESM (`export * from 'puppeteer-core';`). The Jest
functional suites use CommonJS `require("puppeteer")` and Jest runs without a
transform, so it parses the ESM `export` as a script and throws
`SyntaxError: Unexpected token 'export'`. Suites affected:
`tests/functional/content.test.js`, `tests/functional/navigation.test.js`.

## Findings That Refine the Issue's Suggested Steps

1. **Node engine — already handled.** The matrix in `.github/workflows/test.yml`
   (line 19) is already `[22.x]`. The puppeteer-based suites run only in this
   `test (22.x)` job. **No further Node change is required for puppeteer.**

2. **Do NOT bump the deploy step's `node-version: "20.x"` (line 155).** Despite
   the issue's Option B step 1, that pin is _intentional and documented_: it
   exists for `@lhci/cli@0.12.x` (Lighthouse CI), which predates Node 22, and is
   tracked separately as **#287**. The Lighthouse step does not use puppeteer.
   Leaving it untouched avoids breaking the (non-blocking) Lighthouse run.

3. **Accessibility test needs no change.**
   `tests/accessibility/test-accessibility.js` runs under plain `node` (not
   Jest) via `node tests/...`. Node 22.12+ (and local v26) support `require()`
   of ESM, so `require("puppeteer")` resolves there without a transform. We
   verify this rather than assume it.

4. **`@axe-core/puppeteer@4.11.3` is compatible** — its peer range is
   `puppeteer: ">=1.10.0"`, so v25 satisfies it; no bump needed.

## Approach

Add a minimal `babel-jest` transform so Jest can load puppeteer's ESM entry, and
bump puppeteer to the latest v25 (`25.1.0`).

## Files Modified

- **`package.json`**
  - Bump `puppeteer` `24.43.0` → `25.1.0` (exact, matching repo's pin style).
  - Add devDeps: `@babel/core`, `@babel/preset-env`, `babel-jest` (exact
    versions resolved at install time).
  - Extend the `jest` config block with `transformIgnorePatterns` that allows
    transforming puppeteer's ESM entry:
    `"transformIgnorePatterns": ["/node_modules/(?!(puppeteer|puppeteer-core|@puppeteer)/)"]`.
    (Babel's default `transform` of `.js` via `babel-jest` is picked up from
    `babel.config.js`.)
- **`babel.config.js`** (new)
  - `module.exports = { presets: [["@babel/preset-env", { targets: { node: "current" } }]] };`
- **`package-lock.json`**
  - Refreshed by `npm install` to pin puppeteer 25.1.0 + Babel deps.
- **`docs/failing-tests-investigation.md`**
  - **Remove** — the investigation it tracks is resolved by this PR (Acceptance
    Criterion: "updated or removed once resolved").

## Files Explicitly NOT Modified

- `.github/workflows/test.yml` — matrix already on 22.x; deploy-step 20.x pin is
  intentional (Lighthouse / #287). Documented above.

## Implementation Steps

1. Add `babel.config.js`.
2. Edit `package.json`: bump puppeteer, add Babel devDeps, add
   `transformIgnorePatterns` to the `jest` block.
3. Run `npm install` to refresh `package-lock.json`.
4. Run `npm run test:functional` — must pass with no `Unexpected token` error.
5. Verify `npm run test:accessibility` still loads puppeteer (smoke check that
   require(esm) works; it needs a built/served site, so a load-only check is
   acceptable if a full run requires Hugo).
6. Remove `docs/failing-tests-investigation.md`.
7. Confirm `npm ls puppeteer` shows 25.1.0 and no `EBADENGINE` warnings appear
   during install (Acceptance Criterion #3).

## Testing Strategy

### Unit / Functional Testing

- `npm run test:functional` (Jest) — primary gate. Previously failed with
  `SyntaxError: Unexpected token 'export'`; must now pass.

### Integration Testing (Smoke Test)

- **Assertion that would visibly fail on regression:** `npm run test:functional`
  exits 0 and Jest reports both `content.test.js` and `navigation.test.js`
  passing. This is the exact signal that was red in CI run 26321776948.
- Secondary: `npm install` produces no `npm warn EBADENGINE` line mentioning
  `puppeteer`.

## Acceptance Criteria Mapping

- [x] Decision recorded → Option B (this document).
- [x] `npm run test:functional` passes locally (17/17 against served Hugo site
      with PaperMod theme); CI verification pending on PR.
- [x] No `EBADENGINE` warnings for puppeteer in install step (verified).
- [ ] `Website Tests` action green on this PR (pending CI run).
- [x] `docs/failing-tests-investigation.md` removed.

Additional verification: `npm run test:accessibility` passes (99 checks, 0
violations) — confirms plain-node `require("puppeteer")` of the ESM entry works
under Node 22.12+ without a transform.

## Relationship to PR #285

This PR supersedes Dependabot PR #285 (puppeteer 24.43.0 → 25.0.4): it lands an
equivalent-or-newer bump (25.1.0) _plus_ the Jest transform needed to make it
pass. #285 can be closed once this merges.

## Review Summary

**Overall Assessment: Approved.**

Critical checks performed:

- **Babel transform mechanism is sound.** Jest 30's default `transform` already
  maps `\.[jt]sx?$` to `babel-jest`; adding `babel.config.js` with
  `@babel/preset-env` (targets node current) makes it emit CJS, and the
  `transformIgnorePatterns` negative-lookahead opts puppeteer/puppeteer-core
  back into transformation. This is the standard, documented fix for ESM-only
  deps in CJS Jest.
- **Engine blocker confirmed resolved** for the puppeteer suites (test matrix on
  22.x). Deploy-step 20.x correctly left untouched (Lighthouse/#287) — verified
  against the in-file comment.
- **No peer-dependency conflict** — `@axe-core/puppeteer@4.11.3` peer is
  `puppeteer >=1.10.0`.
- **Residual risk (low):** transforming puppeteer-core through Babel could be
  slow or surface an edge syntax. Mitigation: this is verified empirically in
  Step 4 (`npm run test:functional`) before the PR is opened — implementation is
  gated on a green local run, not on assumption.

Approved for implementation on iteration 1/3.
