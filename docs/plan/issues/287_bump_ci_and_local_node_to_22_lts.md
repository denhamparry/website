# Plan: Bump CI and local Node to 22 LTS

- **Issue:** #287
- **Status:** Complete
- **Branch:** denhamparry.co.uk/fix/gh-issue-287

## Problem

CI runs on a mix of Node versions and the `test` job is pinned to Node 20.x.
This blocks the puppeteer v25 upgrade (#286, PR #285), which requires Node
`>=22.12.0`. Local dev (`.nvmrc`) and the spell-check workflow are pinned to an
even older Node 18. We should standardise on Node 22 LTS.

Current Node pins:

| Location                                   | Current | Used for                             |
| ------------------------------------------ | ------- | ------------------------------------ |
| `.nvmrc`                                   | `18`    | local dev default (nvm)              |
| `.github/workflows/misspell.yml`           | `"18"`  | cspell spell check                   |
| `.github/workflows/test.yml` (test matrix) | `20.x`  | jest / puppeteer / linkinator / hugo |
| `.github/workflows/test.yml` (Lighthouse)  | `20.x`  | `@lhci/cli@0.12.x`                   |

## Scope — Not Affected

- **Netlify deploys** — `netlify.toml` runs only `hugo --gc --minify`; no Node
  step. Unaffected.
- **Local Docker dev** — `Dockerfile` has no Node (Hugo + Ruby/Asciidoctor).
  Unaffected.

Node is used only by CI test tooling, so the blast radius is GitHub Actions.

## Proposed Solution

1. **Bump the `test` job matrix** in `.github/workflows/test.yml`:
   `node-version: [20.x]` → `[22.x]`. This is the change that unblocks puppeteer
   v25.
2. **Bump `.nvmrc`**: `18` → `22` to align local dev with CI.
3. **Bump `.github/workflows/misspell.yml`**: `node-version: "18"` → `"22"`.
   cspell@10 already requires Node `>=20`, so this also fixes existing drift.
4. **Leave the Lighthouse step on Node 20.x.** It pins `@lhci/cli@0.12.x`, which
   predates Node 22 and may warn/fail on it. The step is already non-blocking
   (`lhci autorun ... || true`) and lives in a separate job, so the matrix bump
   does not force it. Bumping LHCI itself is a distinct change with its own risk
   and is intentionally out of scope here. A code comment will record why this
   pin lags.

### Why not bump LHCI in this PR

`@lhci/cli` major upgrades change config schema and assertion defaults; pairing
that with a Node bump would conflate two unrelated risks. Keeping Lighthouse on
its known-good Node 20 runtime is the lower-risk choice and keeps this PR
focused on unblocking puppeteer.

## Files Modified

- `.github/workflows/test.yml` — test matrix `20.x` → `22.x`; add comment on the
  Lighthouse step explaining the retained `20.x` pin
- `.github/workflows/misspell.yml` — `node-version: "18"` → `"22"`
- `.nvmrc` — `18` → `22`

## Testing Strategy

### Validation

- `actionlint` / pre-commit hooks pass on the workflow edits.
- CI on the PR: the `test` job runs on Node 22 and is green (jest functional,
  accessibility, link check, hugo build).
- No `EBADENGINE` warnings for puppeteer/cspell in the npm install step.
- Spell Check workflow runs on Node 22 and passes.

### Integration Testing

This change is validated by CI itself — the PR's own `Website Tests` and
`Spell Check` runs are the smoke test. No deploy step (Netlify is Node-free).

## Acceptance Criteria

- [ ] `test.yml` matrix runs on Node 22.x and is green
- [ ] `.nvmrc` and `misspell.yml` aligned to Node 22
- [ ] Lighthouse step left on Node 20 with an explanatory comment
- [ ] No `EBADENGINE` warnings in the CI npm install step
- [ ] Unblocks puppeteer v25 (#286, PR #285)

## Related

- #286 — puppeteer v25 breaks Jest functional tests (ESM entry + Node 20 engine)
- PR #285 — Dependabot puppeteer 24.43.0 → 25.0.4

## Review Summary

- **Overall Assessment:** Approved
- **Findings:**
  - Confirmed exactly three files require edits: `test.yml` (matrix line 19),
    `misspell.yml` (line 14), `.nvmrc`. No other Node references exist in
    `.github/`, `netlify.toml`, or `package.json`.
  - `test.yml` line 97 (`test-results-${{ matrix.node-version }}`) will rename
    the artifact to `test-results-22.x` — cosmetic, no functional impact.
  - Lighthouse step (line 152, `20.x` + `@lhci/cli@0.12.x`) is correctly left
    untouched; it is non-blocking (`|| true`) and in a separate job.
  - Scope exclusions (Netlify, Docker) verified — no Node usage in either.
- **Required changes:** None.
