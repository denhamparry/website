<!-- cspell:words kuberneteslondon myconf fosdem -->

# GitHub Issue #293: Broken links detected in talks.md

**Issue:** [#293](https://github.com/denhamparry/website/issues/293) **Status:**
Complete **Date:** 2026-06-02

## Problem Statement

The monthly link checker workflow detected failures during validation of
`content/talks.md`. Workflow run
[26729660786](https://github.com/denhamparry/website/actions/runs/26729660786)
failed (exit code 2) and auto-created issue #293.

### Current Behavior

The lychee link checker reported three items in run 26729660786:

1. **Path resolution error (hard failure — causes exit 2)** — the root-relative
   slides link on line 164 of `content/talks.md`:

   ```text
   [ERROR] Error building URL for "/slides/202506_kuberneteslondon.pdf"
     (Attribute: Some("href")): Cannot convert path
     '/slides/202506_kuberneteslondon.pdf' to a URI: To resolve root-relative
     links in local files, provide a root dir
   ```

2. **Timeout** — KCDC 2019 session page on line 871:

   ```text
   [TIMEOUT] https://kcdc2019.myconf.app/session/ses-134099 | Timeout
   ```

3. **Redirect (reported [200], not a failure)** — FOSDEM 2023 event page on
   lines 298 and 300:

   ```text
   [200] https://fosdem.org/2023/schedule/event/security_rugby_sigstore/
     | Redirect: ... --[301]--> https://archive.fosdem.org/2023/schedule/...
   ```

### Expected Behavior

- The monthly link checker workflow passes without failures.
- The valid root-relative slides link stops producing a false-positive error on
  every monthly run.
- Transient timeouts on healthy external links do not fail the workflow.
- Issue #293 is closed after the fix lands.

## Current State Analysis

### Verification performed during planning

- **`static/slides/202506_kuberneteslondon.pdf` exists** (913 KB) — the link is
  **not broken**. Hugo serves it at `/slides/202506_kuberneteslondon.pdf`.
- **`https://kcdc2019.myconf.app/session/ses-134099` returns HTTP 200** in ~1.0
  s when checked directly — the workflow's 5 s timeout was a transient blip, not
  a dead link.
- **`https://fosdem.org/2023/schedule/event/security_rugby_sigstore/` returns
  HTTP 200** via a single 301 redirect to
  `https://archive.fosdem.org/2023/schedule/event/security_rugby_sigstore/`,
  which itself returns **200 with zero redirects**. lychee reported it as
  `[200]` — it is **not a failure**.
- **Only one root-relative link exists in all of `content/`**: the slides PDF.
  `rg -n '\]\(/' content/` returns exactly one match. A `--root-dir` fix is
  therefore surgical and cannot break Hugo page routes (there are none in raw
  markdown).

### Root Cause

**None of the three items is an actually-broken link.** The workflow failure is
a **recurring CI configuration false positive** plus a **transient timeout**:

**Item 1 (slides path) — the #272 fix did not work.** Issue
[#272](https://github.com/denhamparry/website/issues/272) (May 2026) added
`base = "static"` to `.lychee.toml` intending to resolve this exact link. The
identical error has now recurred in #293, proving that fix was ineffective. Two
compounding reasons:

1. **`.lychee.toml` is never read.** lychee's default config discovery looks for
   `lychee.toml` (no leading dot) in the working directory; a dotfile
   `.lychee.toml` is not auto-discovered, and the workflow does not pass
   `--config`. The file's other settings (`max_retries`, `timeout`, `accept`,
   `exclude_path`) only take effect because they are **also duplicated** in the
   workflow's `args:` — confirming the config file itself is dead.
2. **`base` is the wrong key anyway.** In lychee, `base` / `--base-url` sets a
   base **URL** for remote relative links. Resolving root-relative **local**
   file links (`/slides/...`) requires `--root-dir`, which must be an
   **absolute** path. The #272 review flagged this as Risk #1 ("if the config
   key is wrong, the false positive would persist on the next monthly run") —
   that risk has now materialised.

   Because `--root-dir` requires an absolute path, it cannot be hardcoded in a
   committed config file (the CI workspace path varies). It must be supplied in
   the workflow `args:` via `${{ github.workspace }}`.

**Item 2 (KCDC timeout):** The session page is healthy (200 in ~1 s). The 5 s
`--timeout` was too aggressive for a one-off slow response. Raising the timeout
removes this class of transient false positive.

**Item 3 (FOSDEM redirect):** Not a failure. The live URL 301-redirects to the
canonical `archive.fosdem.org` page. Updating the content to the archive URL
removes reliance on the redirect (which could be dropped if FOSDEM rotates the
live path) and matches the project's existing archive-URL precedent.

### Related Context

- #272 — previous broken-links issue (May 2026); added the ineffective
  `base = "static"`. This plan supersedes that approach.
- #218 / #209 / #205 — prior broken-link issues fixed by archive-or-remove.
- `.github/workflows/link-check.yml` — invokes `lycheeverse/lychee-action` with
  all settings passed inline via `args:`.

## Solution Design

### Approach

Fix the root cause in the **workflow** (where the absolute root-dir can live),
make the `.lychee.toml` honest, and apply one small content improvement:

1. **`.github/workflows/link-check.yml`** — add
   `--root-dir "${{ github.workspace }}/static"` to the lychee `args:` so the
   root-relative `/slides/...` link resolves to
   `static/slides/202506_kuberneteslondon.pdf`. Raise `--timeout` from `5` to
   `20` to absorb transient slowness (KCDC).
2. **`.lychee.toml`** — remove the ineffective `base = "static"` line (and its
   misleading comment) and document that root-relative resolution is handled in
   the workflow via `--root-dir` (because it needs an absolute CI path). This
   prevents a future reader from believing the config resolves root-relative
   paths when it does not.
3. **`content/talks.md`** — update the two FOSDEM links (lines 298, 300) from
   `https://fosdem.org/2023/...` to `https://archive.fosdem.org/2023/...`
   (verified 200, zero redirects).

### Rationale

- **Why fix the workflow, not the content, for the slides link:** the PDF is
  valid and served correctly. Removing or altering the link would degrade real
  UX to silence a tool misconfiguration. `--root-dir` is the lychee-documented
  mechanism for exactly this case, and the error message itself asks for it.
- **Why `--root-dir` in the workflow rather than `.lychee.toml`:** lychee
  requires an absolute path for `--root-dir`. A committed config cannot carry
  the CI workspace path; `${{ github.workspace }}` is only available in the
  workflow. The workflow `args:` are already the de-facto single source of truth
  (the dotfile config is not read).
- **Why bump the timeout:** the KCDC link is healthy; 5 s simply lost a race
  once. 20 s + the existing 3 retries makes transient timeouts a non-event
  without materially slowing a monthly job.
- **Why update FOSDEM to the archive URL:** removes dependence on a 301 that may
  not persist, uses the canonical archived page, and matches the repo's existing
  archive-URL precedent (BSides London 2021 already uses `web.archive.org`).

### Trade-offs Considered

- **Delete `.lychee.toml` entirely** — it is dead config. Rejected in favour of
  keeping an accurate, documented file: `CLAUDE.md` references it as the link
  config, and an honest config-as-documentation is more useful than no file. (If
  a future change wires it in via `--config`, the scaffolding is ready.)
- **Exclude `/slides/*` from lychee** — suppresses the error but also suppresses
  real future breakage of slide PDFs. Rejected: prefer correctness over noise
  suppression (same reasoning as #272).
- **Leave FOSDEM untouched** — it passes ([200]); the change is optional polish.
  Included because it is one trivial edit per line in the flagged file, removes
  redirect fragility, and the run explicitly surfaced the redirect.

### Benefits

- Stops the **recurring** monthly false positive for the slides link — the
  actual cause of #272 _and_ #293.
- Removes transient-timeout flakiness for healthy external links.
- Leaves `.lychee.toml` honest so the next reader is not misled (as #272 was).

## Implementation Plan

### Step 1: Update `.github/workflows/link-check.yml`

Add `--root-dir` and raise the timeout in the `args:` block:

```yaml
args: >-
  --verbose --no-progress --max-retries 3 --timeout 20 --accept 200,429
  --root-dir "${{ github.workspace }}/static" --exclude-path '.git'
  --exclude-path 'themes' 'content/**/*.md'
```

### Step 2: Update `.lychee.toml`

Remove the non-functional `base = "static"` and document where root-relative
resolution actually happens:

```toml
# Lychee link checker configuration
# Used by: .github/workflows/link-check.yml
#
# NOTE: the workflow passes all settings inline via `args:` and does not load
# this file (lychee auto-discovers `lychee.toml`, not `.lychee.toml`). Keep this
# file in sync with the workflow if it is ever wired in via `--config`.
#
# Root-relative links (e.g. /slides/foo.pdf) are resolved in the workflow with
# `--root-dir "${{ github.workspace }}/static"`. `--root-dir` requires an
# absolute path, so it cannot live here as a committed value.

# Request settings
max_retries = 3
timeout = 20
accept = [200, 429]

# Exclusions
exclude_path = [".git", "themes"]
```

### Step 3: Update FOSDEM links in `content/talks.md` (lines 298, 300)

Replace both occurrences:

```text
https://fosdem.org/2023/schedule/event/security_rugby_sigstore/
```

with:

```text
https://archive.fosdem.org/2023/schedule/event/security_rugby_sigstore/
```

### Step 4: Verify

```bash
# Hugo build still succeeds and serves the PDF
hugo --gc --minify

# Pre-commit hooks (includes cspell — note new words myconf/fosdem)
pre-commit run --all-files || pre-commit run --all-files
```

lychee is not installed locally; the authoritative verification is the
`link-check.yml` workflow, triggerable on the branch via
`gh workflow run link-check.yml --ref <branch>` or the next monthly cron.

### Step 5: Commit and PR

Stage only the three changed files. Commit on
`denhamparry.co.uk/docs/gh-issue-293`.

## Testing Strategy

### Manual Verification

- Confirm `static/slides/202506_kuberneteslondon.pdf` exists (done).
- Confirm `archive.fosdem.org/.../security_rugby_sigstore/` returns 200 (done —
  0 redirects).
- Confirm `kcdc2019.myconf.app/...` returns 200 (done — ~1 s).

### Integration Testing

**Test Case 1: Hugo build**

```bash
hugo --gc --minify
```

Expected: no errors; talks.md renders; PDF served at
`/slides/202506_kuberneteslondon.pdf`.

**Test Case 2: Link checker workflow (authoritative)**

```bash
gh workflow run link-check.yml --ref denhamparry.co.uk/docs/gh-issue-293
```

Expected: workflow passes — the slides path resolves via `--root-dir`, KCDC no
longer times out, FOSDEM resolves directly with no redirect.

### Regression Testing

- `rg -n '\]\(/' content/` still returns exactly one root-relative link (the
  PDF) — no other content relies on root-dir resolution.
- No `content/talks.md` lines other than the two FOSDEM links are modified.

## Success Criteria

- [ ] `link-check.yml` passes `--root-dir "${{ github.workspace }}/static"` and
      `--timeout 20`.
- [ ] `.lychee.toml` no longer contains `base = "static"`; comment explains
      root-dir handling.
- [ ] Both FOSDEM links in `content/talks.md` use `archive.fosdem.org`.
- [ ] No other `content/talks.md` modifications.
- [ ] Pre-commit hooks pass (cspell includes `myconf`, `fosdem` if needed).
- [ ] Hugo build succeeds.
- [ ] Link checker workflow passes on manual dispatch or next monthly run.
- [ ] Issue #293 closed after merge.

## Files Modified

1. `.github/workflows/link-check.yml` — add `--root-dir`, raise `--timeout`
   to 20.
2. `.lychee.toml` — remove ineffective `base = "static"`; document root-dir
   handling; sync `timeout` to 20.
3. `content/talks.md` — FOSDEM links → `archive.fosdem.org` (lines 298, 300).

## Related Issues and Tasks

### Related

- #272 — previous broken-links issue; its `base = "static"` fix was ineffective
  and is superseded by this `--root-dir` approach.
- #218 / #209 / #205 — prior broken-link resolutions (archive-or-remove).
- #199 — original automated link validation workflow.

### Closes

- #293 — broken links detected in talks.md

## References

- [GitHub Issue #293](https://github.com/denhamparry/website/issues/293)
- [Workflow Run 26729660786](https://github.com/denhamparry/website/actions/runs/26729660786)
- [lychee `--root-dir` documentation](https://lychee.cli.rs/usage/config/)

## Notes

### Key Insights

- **A "broken links" issue is often neither broken nor links.** All three #293
  items are valid; the failure is CI config (root-relative resolution) plus a
  transient timeout. Reading the run log line-by-line before touching content is
  essential.
- **The #272 fix was a no-op for the slides path.** `.lychee.toml` is not loaded
  (dotfile vs `lychee.toml`) and `base` is the wrong key for local root-relative
  links. The real fix must live in the workflow `args:` because `--root-dir`
  needs an absolute CI path.
- **Verify config files are actually read.** Settings duplicated between a
  config file and CLI args are a smell that the config file may be dead.

---

## Plan Review

**Reviewer:** Claude Code (workflow-research-plan) **Review Date:** 2026-06-02

### Review Summary

- **Overall Assessment:** Approved
- **Confidence Level:** High
- **Recommendation:** Proceed to implementation.

### Critical check — does `--root-dir` resolve the slides link?

The #272 plan was approved with high confidence yet its `base = "static"` fix
was a no-op, so the riskiest assumption here was checked adversarially:

- lychee resolves an absolute local link `/slides/foo.pdf` against `--root-dir`
  as `<root_dir>/slides/foo.pdf`. With
  `--root-dir '${{ github.workspace }}/static'` this is
  `<ws>/static/slides/202506_kuberneteslondon.pdf`, which exists. ✓
- `--root-dir` requires an **absolute** path, available only via
  `${{ github.workspace }}` — confirming the fix must live in the workflow
  `args:`, not the committed `.lychee.toml`. This is precisely why #272 failed.
- `--root-dir` has existed in lychee since ~0.13 and is supported by
  `lycheeverse/lychee-action@v2.8.0` (bundles a current lychee). ✓
- Only one root-relative link exists in `content/` (verified), so the change is
  surgical and cannot break Hugo page routes.

### Edge cases verified

- KCDC link returns 200 (~1 s) — transient timeout; `--timeout 20` + 3 retries
  absorbs it.
- FOSDEM archive URL returns 200 with **0 redirects** — safe replacement.
- `.lychee.toml` is not loaded by the workflow, so editing it is documentation
  only (no functional risk); `base = "static"` removal cannot regress anything.

### Risks

- **Low:** if lychee-action's arg tokeniser mishandled the quoted workspace
  path, root-dir would be wrong and the false positive would persist
  (Whova-style CI verification covers this). Mitigation:
  `${{ github.workspace }}` contains no spaces; quoting matches the existing
  `--exclude-path '...'` style.

**Recommendation: Proceed to implementation — no plan revision required.**
