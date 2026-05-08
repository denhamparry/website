<!-- cspell:words kuberneteslondon -->

# GitHub Issue #272: Broken links detected in talks.md

**Issue:** [#272](https://github.com/denhamparry/website/issues/272) **Status:**
Complete **Date:** 2026-05-08

## Problem Statement

The monthly link checker workflow detected failures during validation of
`content/talks.md`. The workflow run
[25196761806](https://github.com/denhamparry/website/actions/runs/25196761806)
failed and auto-created issue #272.

### Current Behavior

The Lychee link checker reported two distinct failure modes:

1. **HTTP 410 Gone** — the Whova speaker page for OWASP AppSec EU (2022) on line
   398 of `content/talks.md`:

   ```text
   [410] https://whova.com/web/sT1P4N7cLm%2FUyeUd0yq6HLfmBOP%2FXqL042hVxqUa0ZA%3D/Speakers?utm_source=owasp-web&utm_medium=event-page&utm_campaign=none
     | Rejected status code: 410 Gone
   ```

2. **Path resolution error** — the root-relative slides link on line 138 of
   `content/talks.md`:

   ```text
   [ERROR] Error building URL for "/slides/202506_kuberneteslondon.pdf"
     (Attribute: Some("href")): Cannot convert path
     '/slides/202506_kuberneteslondon.pdf' to a URI: To resolve root-relative
     links in local files, provide a root dir
   ```

### Expected Behavior

- The monthly link checker workflow passes without failures.
- All links in `content/talks.md` either resolve correctly or are intentionally
  excluded by lychee config.
- Issue #272 is closed after the fix lands.
- Future link-check runs do not produce false positives for valid root-relative
  paths to static assets.

## Current State Analysis

### Relevant Code/Config

- **`content/talks.md`** — line 138 (slides path), line 398 (Whova URL).
- **`.lychee.toml`** — currently has no `base` configuration, so root-relative
  paths fail to resolve.
- **`.github/workflows/link-check.yml`** — invokes lychee with
  `--accept 200,429`; does not pass `--base` or build Hugo first.
- **`static/slides/202506_kuberneteslondon.pdf`** — file exists in the
  repository. Hugo serves it at `/slides/202506_kuberneteslondon.pdf` at
  runtime.

### Root Cause

**Issue 1 (Whova HTTP 410):** The OWASP AppSec EU 2022 conference Whova page has
been taken down. HTTP 410 Gone is the conventional "permanent removal" status —
the URL will not come back.

**Issue 2 (slides path):** Lychee runs against raw markdown files and treats
`/slides/...` as a path that should resolve to a local file relative to the
configured `base`. Because no `base` is set in `.lychee.toml`, lychee errors
rather than skipping or resolving. The link is **not actually broken** — Hugo
serves the file correctly. This is a CI configuration false positive.

### Related Context

- Previous broken-link issues that informed the project's pattern for handling
  these:
  - #205 — broken links in content files (Jan 2025)
  - #209 — broken links in talks.md (Feb 2026)
  - #218 — broken links in talks.md, fixed by removing dead skillsmatter.com
    URLs (no archive.org snapshots existed)
- Existing precedent in `content/talks.md`: BSides London 2021 entry already
  uses `web.archive.org` for an archived event page.

## Solution Design

### Approach

Two distinct fixes for two distinct problems:

1. **Whova URL**: replace with an `web.archive.org` snapshot if one exists for
   the speaker page; otherwise remove the URL and keep the entry as plain text.
   This is the same pattern used to fix issues #209 and #218.

2. **Slides path**: configure lychee to resolve root-relative paths against the
   `static/` directory. Adding `base = "static"` to `.lychee.toml` tells lychee
   to look for `/slides/202506_kuberneteslondon.pdf` at
   `static/slides/202506_kuberneteslondon.pdf`, which exists.

### Rationale

- **Why archive.org first, plain text fallback (Whova):** preserves historical
  context where possible; matches the precedent set by #218 for unrecoverable
  pages.
- **Why fix the lychee config rather than just the link:** the slides PDF is not
  actually broken. Removing the link would degrade real user experience to
  silence a CI false positive. Configuring lychee correctly fixes the root cause
  and prevents this class of false positive for any future root-relative links
  to static assets (other speakers' slides, images, etc.).

### Trade-offs Considered

- **Build Hugo first then check `public/`** — would also work and would catch
  any other Hugo-rendering issues. Rejected for this issue because (a) it
  significantly increases CI workflow runtime, (b) the simpler `base` fix
  addresses the actual problem, and (c) the existing `npm run test:links` script
  already checks `public/` for full coverage when run locally. This could be a
  follow-up enhancement.
- **Excluding `/slides/*` from lychee** — would suppress the error but also
  suppress real broken slide links if any future slide PDF goes missing.
  Rejected: prefer correctness over noise suppression.

### Implementation

Three concrete edits:

1. Update line 398 of `content/talks.md`: replace Whova link with
   `web.archive.org` snapshot, or remove the URL entirely.
2. Add `base = "static"` to `.lychee.toml` so root-relative paths resolve.
3. Add a comment to `.lychee.toml` documenting why `base` is set.

### Benefits

- Resolves the immediate broken link (Whova).
- Eliminates a CI false positive class (root-relative paths to static assets).
- Reduces future "broken links" issues for valid links — researcher / future
  Lewis won't waste time investigating false positives.

## Implementation Plan

### Step 1: Verify slides PDF exists

```bash
ls -la static/slides/202506_kuberneteslondon.pdf
```

Confirms the file is present. (Already verified during planning.)

### Step 2: Research archive.org for Whova OWASP page

```bash
xh -F GET "https://archive.org/wayback/available?url=https://whova.com/web/sT1P4N7cLm%2FUyeUd0yq6HLfmBOP%2FXqL042hVxqUa0ZA%3D/Speakers"
```

Expected outcomes:

- **Snapshot exists**: use the archive.org snapshot URL.
- **No snapshot**: remove the URL, keep entry as plain text (per #218 pattern).

### Step 3: Update `content/talks.md` line 398

**File:** `content/talks.md`

**Change:**

```markdown
# Before (line 397-398):

- Link:
  [Online](https://whova.com/web/sT1P4N7cLm%2FUyeUd0yq6HLfmBOP%2FXqL042hVxqUa0ZA%3D/Speakers?utm_source=owasp-web&utm_medium=event-page&utm_campaign=none)

# After (if archive.org snapshot exists):

- Link:
  [Online](https://web.archive.org/web/<TIMESTAMP>/https://whova.com/web/sT1P4N7cLm%2FUyeUd0yq6HLfmBOP%2FXqL042hVxqUa0ZA%3D/Speakers)

# After (if no snapshot — fallback):

- Where: Online
```

If using the fallback, remove the entire `Link:` line since `Where: Online` is
already implied by the existing `Where: Online` line at line 399. After removal,
line 399 (`Where: Online`) becomes the sole location indicator.

### Step 4: Update `.lychee.toml`

**File:** `.lychee.toml`

**Change:**

```toml
# Lychee link checker configuration
# Used by: .github/workflows/link-check.yml

# Request settings
max_retries = 3
timeout = 5
accept = [200, 429]

# Resolve root-relative paths (e.g., /slides/foo.pdf) against the static/
# directory so Hugo's static asset links validate correctly in raw markdown.
base = "static"

# Exclusions
exclude_path = [".git", "themes"]
```

### Step 5: Verify locally (best-effort)

```bash
# Build Hugo site
hugo --gc --minify

# Run pre-commit hooks
pre-commit run --all-files

# If lychee is installed locally, verify directly:
lychee --base static --accept 200,429 content/talks.md
```

Lychee may not be installed locally; if not, rely on PR CI to verify.

### Step 6: Commit and PR

Stage only `content/talks.md` and `.lychee.toml`. Commit on the
`denhamparry.co.uk/docs/gh-issue-272` branch.

## Testing Strategy

### Manual Verification

- For an archive.org replacement, confirm the snapshot URL returns HTTP 200 with
  `xh GET <url>` or by opening in a browser.
- For the `.lychee.toml` change, sanity-check that `static/slides/` exists and
  the referenced PDF is present.

### Integration Testing

**Test Case 1: Local Hugo build**

```bash
hugo --gc --minify
```

Expected: no errors, talks.md renders cleanly.

**Test Case 2: Local lychee run (if lychee available)**

```bash
lychee --base static --accept 200,429 'content/**/*.md'
```

Expected: zero errors. Both the slides path and (if replaced) the new Whova link
resolve.

**Test Case 3: PR CI**

The `.github/workflows/link-check.yml` workflow runs on the monthly schedule and
on `workflow_dispatch`. After merge:

```bash
gh workflow run link-check.yml
```

Expected: workflow passes.

### Regression Testing

- Verify no other links in `content/talks.md` were modified.
- Verify the slides PDF still serves correctly via `make hugo_serve` and
  visiting `http://localhost:1313/slides/202506_kuberneteslondon.pdf`.
- Verify no other root-relative paths in `content/` are silently broken by the
  new `base` setting (lychee will report any that don't resolve).

## Success Criteria

- [ ] Whova URL on line 398 replaced or removed.
- [ ] `.lychee.toml` has `base = "static"` with explanatory comment.
- [ ] `content/talks.md` has no other modifications.
- [ ] Pre-commit hooks pass.
- [ ] Hugo build succeeds (no errors).
- [ ] Link checker workflow passes on PR or after manual dispatch.
- [ ] Issue #272 closed after merge.

## Files Modified

1. `content/talks.md` — replace or remove broken Whova URL (line 398).
2. `.lychee.toml` — add `base = "static"` to resolve root-relative paths.

## Related Issues and Tasks

### Related

- #205 — broken links in content files (Jan 2025)
- #209 — broken links in talks.md (Feb 2026)
- #218 — broken links in talks.md (March 2026)
- #199 — original automated link validation workflow

### Closes

- #272 — broken links detected in talks.md

## References

- [GitHub Issue #272](https://github.com/denhamparry/website/issues/272)
- [Workflow Run 25196761806](https://github.com/denhamparry/website/actions/runs/25196761806)
- [Lychee documentation — base option](https://lychee.cli.rs/usage/config/)
- [Wayback Machine](https://web.archive.org/)

## Notes

### Key Insights

- **Two distinct failure modes share an issue.** Future link-check issues should
  be inspected for both real broken links and CI configuration false positives.
  Counting them together as "two broken links" mischaracterises the work.
- **Hugo's static asset serving works at runtime, not at markdown lint time.**
  Lychee needs the `base` setting to mirror Hugo's mental model of root-
  relative paths.
- **HTTP 410 is permanent.** No retry / wait-and-see — replace or remove now.

### Alternative Approaches Considered

1. **Just remove the slides link** — Rejected. The link is valid; removing it
   harms users to silence a tool error.
2. **Build Hugo, then check `public/`** — Rejected for this PR. More invasive
   and slower than the `base` fix; could be a separate follow-up if the `base`
   approach proves insufficient for other content.
3. **Add `--exclude '/slides/.*'`** — Rejected. Suppresses real future breakage
   of slide PDFs.
4. **Replace Whova with archive.org if snapshot exists, otherwise remove**
   (chosen) — preserves history when possible, removes dead link otherwise.

### Best Practices

- After this lands, the next monthly link-check run is a free regression test.
  If new breakage appears, it's net-new content rot, not a recurrence.

---

## Plan Review

**Reviewer:** Claude Code (workflow-research-plan) **Review Date:** 2026-05-08
**Original Plan Date:** 2026-05-08

### Review Summary

- **Overall Assessment:** Approved (with one required clarification)
- **Confidence Level:** High
- **Recommendation:** Proceed to implementation; apply the clarification to Step
  3 during implementation rather than rewriting the plan.

### Strengths

1. **Correct disambiguation of failure modes.** The plan splits one "broken
   links" issue into two root causes (content rot vs CI false positive) and
   proposes targeted fixes for each. Treating them as one bug would have
   produced an incorrect or wasteful fix.
2. **Conservative scope.** Only `content/talks.md` and `.lychee.toml` are
   modified. No content beyond the offending entry is touched.
3. **Follows existing precedent.** Uses the same archive.org-or-remove pattern
   that resolved #209 and #218.
4. **Trade-offs documented.** The plan explicitly considered and rejected
   excluding `/slides/*` from lychee and rebuilding Hugo first — both reasonable
   alternatives, both rejected with clear rationale.
5. **Future-proofing rationale.** The `base = "static"` change prevents an
   entire class of future false positives, not just the immediate symptom.

### Critical Finding: Archive.org Has No Snapshot for the Whova URL

Independent verification via the Wayback Machine availability API:

```text
{"url": "whova.com/web/sT1P4N7cLm%2FUyeUd0yq6HLfmBOP%2FXqL042hVxqUa0ZA%3D/Speakers",
 "archived_snapshots": {}}
```

**Impact:** the plan's primary path (replace with archive.org snapshot) is not
available. The fallback path (remove the URL) MUST be used. This is the same
situation as #218.

### Required Changes

Apply during Step 3 implementation — plan rewrite not required.

- [x] **Use the fallback path only.** Skip the archive.org check at runtime
      (already verified empty during this review) and go straight to the URL
      removal.

- [x] **Fix the misleading fallback example.** The plan's Step 3 currently shows
      the "After" state as `- Where: Online`, but `Where: Online` already exists
      at line 399 of `content/talks.md`. Implementing the example literally
      would produce a duplicate `Where: Online` line.

      The actual edit is to **delete lines 397–398 only** (the `- Link:`
      list item and its `[Online](...)` continuation), leaving line 399
      (`- Where: Online`) untouched. The resulting OWASP entry is:

      ```markdown
      ### OWASP AppSec EU - The Hand That Feeds - How to Misuse Kubernetes

      - Type: Talk
      - Where: Online
      - Date: 09th June 2022
      ```

### Edge Cases Verified

1. **No other broken links missed.** Reviewed the full lychee output from
   workflow run 25196761806. Only two errors: the slides path resolution error
   and the Whova HTTP 410. All other entries returned 200 (some via redirects,
   which lychee follows).
2. **Hugo `staticDir` defaults to `static`.** The repo's `config.yaml` does not
   override `staticDir`, so Hugo serves files in `./static/` at root. Setting
   `base = "static"` in `.lychee.toml` correctly mirrors Hugo's runtime path
   resolution.
3. **`base = "static"` does not break URL link resolution.** Lychee's `base`
   setting only applies to root-relative paths (paths starting with `/`).
   Absolute URLs (`https://...`) and relative paths (`./foo.md`) continue to
   resolve as before.
4. **Slides PDF exists.** `static/slides/202506_kuberneteslondon.pdf` is present
   in the repo (verified via `ls`).

### Risks and Concerns

1. **Risk: lychee `base` config setting name verification.**

   - **Likelihood:** Low — `base` is the documented config key for the
     directory/URL that root-relative paths resolve against; lychee's own error
     message ("provide a root dir") confirms this is the intended mechanism.
   - **Impact:** Medium — if the config key is wrong, the false positive would
     persist on the next monthly run, but the Whova fix would still land.
   - **Mitigation:** PR CI is the verification mechanism. If the
     `link-check.yml` workflow can be triggered via `workflow_dispatch` on the
     PR branch, run it manually before merging to confirm. Otherwise, accept the
     risk — the next monthly cron run will surface any issue and a follow-up fix
     is cheap.

2. **Risk: removing the OWASP entry's only outbound link is a small regression
   in user experience.**
   - **Likelihood:** N/A — already happening; the link returns 410.
   - **Impact:** Low — the entry retains all other context (date, where,
     description). No archive replacement is available.
   - **Mitigation:** None required. This matches how #209 and #218 handled
     equivalent dead-link cases.

### Optional Improvements

- [ ] Consider running `gh workflow run link-check.yml` on the PR branch after
      push to verify the `base = "static"` fix lands cleanly before merge. Not
      required but cheap.
- [ ] Consider a follow-up issue (or PR-local note) to rebuild Hugo first and
      run lychee against `public/` for stronger end-to-end coverage. Not
      required for this PR — the `base` fix addresses the immediate problem.

### Verification Checklist

- [x] Solution addresses both root causes (content rot + CI false positive)
- [x] Archive.org availability independently verified (no snapshot)
- [x] File paths and line numbers verified against actual file
- [x] Hugo `staticDir` default verified — matches the proposed `base` value
- [x] Full workflow log reviewed — no missed broken links
- [x] Security implications N/A (documentation + CI config)
- [x] Performance impact N/A
- [x] Test strategy adequate (pre-commit + PR CI)
- [x] No breaking changes
- [x] Consistent with prior issue #209 / #218 resolution patterns

---

**Review completed by Claude Code workflow-research-plan** **Confidence: High**
| **Recommendation: Proceed to implementation (apply Required Changes inline; no
plan rewrite needed)**
