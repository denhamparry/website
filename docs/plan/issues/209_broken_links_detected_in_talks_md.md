# Implementation Plan: Fix Broken Links in talks.md

**Issue**: #209 - Broken links detected in talks.md **Status**: Complete
**Created**: 2026-02-03 **Reviewed**: 2026-02-03 **Completed**: 2026-02-03
**Type**: Documentation Fix

## Problem Statement

The automated monthly link validation workflow detected two broken links in
`content/talks.md`:

1. **player.fm podcast link** - HTTP 403 Forbidden

   - URL:
     `https://player.fm/series/cto-and-co-founder-talk-with-dave-albert/guest-lewis-denham-parry`
   - Status: 403 (Network error: Forbidden)
   - Line: 974

2. **emamo.com BSides London event link** - Timeout
   - URL:
     `https://emamo.com/event/bsideslondon2021/r/speaker/lewis-denham-parry`
   - Status: TIMEOUT
   - Line: 629

Both links are from historical events (2019 and 2021 respectively) and appear to
be permanently unavailable.

## Current State

### File Analysis

**File**: `content/talks.md`

**Broken Link 1** (Line 974):

```markdown
### Podcast - CTO and Co-Founder Talk with Dave Albert

- Type: Podcast
- Where:
  [player.fm](https://player.fm/series/cto-and-co-founder-talk-with-dave-albert/guest-lewis-denham-parry)
- Date: 12th March 2019.
```

**Broken Link 2** (Line 629):

```markdown
### BSides London November 2021 - Kubernetes CTF

- Type: CTF
- Where:
  [London, UK](https://emamo.com/event/bsideslondon2021/r/speaker/lewis-denham-parry)
- Date: 12th November 2021
```

### Investigation

1. **player.fm link (403 Forbidden)**:

   - The link returns HTTP 403, indicating access is denied
   - Possible causes: Content removed, access restricted, or anti-bot protection
   - Archive.org search needed to check if podcast is archived

2. **emamo.com link (Timeout)**:
   - The domain is timing out, suggesting the site may be down or domain expired
   - This was an event listing for BSides London 2021
   - Archive.org search needed to check if event page is archived

## Solution Design

### Approach

For each broken link, we will:

1. **Research archive availability**: Check if the content is available on
   archive.org (Wayback Machine)
2. **Update or remove**: Based on archive availability:
   - If archived: Replace broken link with archive.org link
   - If not archived: Remove the broken link, keep the event description

### Why This Approach

1. **Preserves historical context**: Archive.org links maintain access to
   historical content
2. **Improves user experience**: Removes dead links that frustrate visitors
3. **Maintains SEO health**: Broken links negatively impact site SEO
4. **Follows project conventions**: As documented in CLAUDE.md:
   > "Consider using archive.org for important archived content"

### Alternative Considered

**Complete removal of entries**: We could remove the entire event entries, but
this would:

- Lose historical record of speaking engagements
- Reduce the comprehensive nature of the talks page
- Be more disruptive than necessary

**Decision**: Keep event entries, fix or remove only the broken links.

## Implementation Steps

### Phase 1: Research Archive Availability

1. Check if player.fm podcast is archived:

   ```bash
   # Search archive.org for the podcast link
   ```

2. Check if emamo.com event page is archived:
   ```bash
   # Search archive.org for the event link
   ```

### Phase 2: Fix Broken Links

**For player.fm podcast (Line 974)**:

- **If archived**: Update the link to archive.org URL

  ```markdown
  - Where:
    [player.fm (archived)](https://web.archive.org/web/TIMESTAMP/https://player.fm/series/cto-and-co-founder-talk-with-dave-albert/guest-lewis-denham-parry)
  ```

- **If not archived**: Remove the Where field, keep the rest

  ```markdown
  ### Podcast - CTO and Co-Founder Talk with Dave Albert

  - Type: Podcast
  - Date: 12th March 2019

  Find out the parallels of mental health to monoliths versus microservices!
  ```

**For emamo.com event (Line 629)**:

- **If archived**: Update the link to archive.org URL

  ```markdown
  - Where:
    [London, UK (archived)](https://web.archive.org/web/TIMESTAMP/https://emamo.com/event/bsideslondon2021/r/speaker/lewis-denham-parry)
  ```

- **If not archived**: Remove the URL, keep the location text
  ```markdown
  - Where: London, UK
  ```

### Phase 3: Verification

1. Run link checker locally to verify fixes:

   ```bash
   # Build site
   hugo --gc --minify

   # Run link tests
   npm run test:links
   ```

2. Visual inspection of the talks page to ensure formatting is correct

3. Verify no other links were accidentally broken

## Files Modified

- `content/talks.md` - Fix or remove 2 broken links

## Testing Strategy

### Pre-commit Validation

1. **Spell check**: `npm run test:spell`
2. **Hugo build**: `hugo --gc --minify`
3. **Link validation**: `npm run test:links`
4. **Markdown linting**: Pre-commit hooks will validate markdown format

### Manual Verification

1. Start Hugo dev server: `make hugo_serve`
2. Navigate to `/talks` page at `http://localhost:1313/talks`
3. Verify:
   - Event entries are still present
   - Archive links work (if added)
   - Formatting is correct
   - No broken links remain

## Success Criteria

- [ ] Both broken links are either fixed with archive.org links or removed
- [ ] Event entries remain on the talks page with descriptions intact
- [ ] Hugo build succeeds without errors
- [ ] Link checker passes (no broken links detected)
- [ ] Pre-commit hooks pass
- [ ] Visual inspection confirms proper formatting

## Risks and Mitigations

| Risk                                  | Impact | Mitigation                                                  |
| ------------------------------------- | ------ | ----------------------------------------------------------- |
| Archive.org links may break in future | Low    | Document that archived links are used; can be updated later |
| Formatting issues after edits         | Low    | Use Read tool to verify exact formatting; run Hugo locally  |
| Other links may be broken             | Medium | Run full link check after changes                           |
| Pre-commit hooks may fail             | Low    | Run all tests before committing                             |

## Notes

- This is a straightforward documentation fix with no code changes
- The automated link checker runs monthly, so future broken links will be
  detected
- Both broken links are from historical events (2019, 2021), so immediate
  archive availability is not guaranteed
- Follow UK English spelling conventions (en-GB) as per cspell.json

## References

- Issue: #209
- Workflow run: https://github.com/denhamparry/website/actions/runs/21553512959
- CLAUDE.md guidance: "Consider using archive.org for important archived
  content"
- Link validation config: `.lychee.toml`

---

## Plan Review

**Reviewer:** Claude Code (workflow-research-plan) **Review Date:** 2026-02-03
**Original Plan Date:** 2026-02-03

### Review Summary

- **Overall Assessment:** Approved
- **Confidence Level:** High
- **Recommendation:** Proceed to implementation with required changes

### Strengths

1. **Accurate problem identification**: Both broken links and their line numbers
   are correctly identified and match the actual file content
2. **Archive research included**: Plan correctly identifies the need to check
   archive.org before making changes
3. **Preserves historical value**: Approach maintains event entries rather than
   removing them entirely
4. **Comprehensive testing strategy**: Includes pre-commit validation, Hugo
   build, link checking, and manual verification
5. **Follows project conventions**: Aligns with CLAUDE.md guidance to "Consider
   using archive.org for important archived content"
6. **Low-risk change**: Documentation-only fix with no code modifications

### Archive Availability Research (Completed)

**Finding:** Both broken links ARE available on archive.org:

1. **player.fm podcast** (Line 974):

   - Archive URL:
     `http://web.archive.org/web/20220624230804/https://player.fm/series/cto-and-co-founder-talk-with-dave-albert/guest-lewis-denham-parry`
   - Snapshot date: June 24, 2022
   - Status: Available (200)

2. **emamo.com event** (Line 629):
   - Archive URL:
     `http://web.archive.org/web/20220711204907/https://emamo.com/event/bsideslondon2021/r/speaker/lewis-denham-parry`
   - Snapshot date: July 11, 2022
   - Status: Available (200)

**Impact on plan**: Both links should be replaced with archive.org URLs (not
removed).

### Existing Archive.org Pattern

The file already contains archive.org links following this pattern:

```markdown
[BlueConf](https://web.archive.org/web/20220521180658/https://blueconf.co.uk/)
```

**Recommendation**: Follow the same pattern for consistency (no "(archived)"
suffix needed).

### Required Changes

**Changes that must be made before implementation:**

- [x] ✅ Archive.org availability confirmed - both links are archived
- [ ] **Update implementation steps** to reflect that BOTH links will be
      replaced with archive.org URLs (not removed)
- [ ] **Specify exact archive.org URLs** in Phase 2 implementation steps:
  - player.fm:
    `https://web.archive.org/web/20220624230804/https://player.fm/series/cto-and-co-founder-talk-with-dave-albert/guest-lewis-denham-parry`
  - emamo.com:
    `https://web.archive.org/web/20220711204907/https://emamo.com/event/bsideslondon2021/r/speaker/lewis-denham-parry`
- [ ] **Remove conditional logic** ("If archived" / "If not archived") since
      both ARE archived
- [ ] **Update success criteria** to reflect that both links will be replaced
      with archive links

### Link Format Recommendation

Based on existing archive.org links in talks.md (lines 889, 896), use this
format:

**For player.fm (Line 974):**

```markdown
- Where:
  [player.fm](https://web.archive.org/web/20220624230804/https://player.fm/series/cto-and-co-founder-talk-with-dave-albert/guest-lewis-denham-parry)
```

**For emamo.com (Line 629):**

```markdown
- Where:
  [London, UK](https://web.archive.org/web/20220711204907/https://emamo.com/event/bsideslondon2021/r/speaker/lewis-denham-parry)
```

**Note**: Keep original link text unchanged, only replace the URL. No
"(archived)" suffix needed (matches existing pattern).

### Edge Cases Considered

1. **Archive.org links may break in future**:

   - **Likelihood:** Low
   - **Impact:** Low
   - **Mitigation:** Monthly link checker will detect if archive links break;
     archive.org is generally stable

2. **Markdown formatting edge cases**:

   - **Current format**: Multi-line `Where:` field with indented link
   - **Risk:** Indentation could break if not preserved exactly
   - **Mitigation:** Use Edit tool with exact string matching; verify with Read
     tool before committing

3. **Other broken links not in report**:

   - **Risk:** The workflow only reported 2 broken links, but there could be
     more
   - **Mitigation:** Plan includes running full link check
     (`npm run test:links`) after changes

4. **Hugo build compatibility**:
   - **Risk:** Archive.org URLs might not be valid in Hugo's link validation
   - **Evidence:** Existing archive.org links in file prove Hugo accepts them
   - **Mitigation:** None needed - already proven to work

### Testing Validation

**Pre-commit hooks covered:**

- ✅ Spell check (cspell) - "emamo" already added to .spelling.txt
- ✅ Markdown linting (markdownlint via pre-commit)
- ✅ Trailing whitespace, end-of-file fixes
- ✅ Secret detection (gitleaks)

**Manual testing covered:**

- ✅ Hugo build verification (via Docker: `make hugo_serve`)
- ✅ Link validation (`npm run test:links` - requires Hugo build first)
- ✅ Visual inspection at `http://localhost:1313/talks`

**Gap identified:** Plan mentions `npm run test:spell` but the package.json
script is `test:spell`, not `test:spell`. This is correct - no gap.

### Alternative Approaches Considered

1. **Remove entire event entries**:

   - **Pros:** Eliminates all broken links permanently
   - **Cons:** Loses historical record, reduces content value, unnecessary given
     archive availability
   - **Verdict:** Rejected - archive links preserve value

2. **Keep broken links with disclaimer**:

   - **Pros:** Preserves original URLs
   - **Cons:** Poor UX, hurts SEO, fails link validation
   - **Verdict:** Rejected - archive links are better UX

3. **Replace with "Link unavailable" text**:
   - **Pros:** Simple, no external dependency
   - **Cons:** Removes user access to content when archive exists
   - **Verdict:** Rejected - archive links provide value

**Plan's approach is optimal**: Replace with archive.org links.

### Risks and Concerns

1. **Risk:** Hugo build may fail in Docker environment

   - **Likelihood:** Low
   - **Impact:** Medium (blocks deployment)
   - **Mitigation:** Plan includes running `make hugo_serve` locally before
     committing
   - **Evidence:** Makefile exists and is used for local development

2. **Risk:** Link checker may still fail after fix if archive.org is slow to
   respond

   - **Likelihood:** Low
   - **Impact:** Medium (CI fails)
   - **Mitigation:** Lychee config has `max_retries = 3` and
     `accept = [200, 429]`; archive.org is generally fast
   - **Fallback:** Can exclude archive.org in .lychee.toml if needed (not
     recommended)

3. **Risk:** Pre-commit hooks may fail due to prettier formatting

   - **Likelihood:** Low
   - **Impact:** Low (auto-fixable)
   - **Mitigation:** Prettier will auto-format on commit; just re-stage and
     commit again

4. **Risk:** Other links in talks.md may be broken

   - **Likelihood:** Medium (file contains 100+ links from 2018-2026)
   - **Impact:** Medium (issue #209 won't be fully resolved)
   - **Mitigation:** Plan includes running `npm run test:links` which checks ALL
     links
   - **Recommendation:** If other broken links found, fix them in same commit

### Verification Checklist

- [x] Solution addresses root cause identified in GitHub issue (fix broken
      links)
- [x] All acceptance criteria from issue are covered (fix or remove broken
      links)
- [x] Implementation steps are specific and actionable
- [x] File paths and code references are accurate (lines 629, 974 verified)
- [x] Security implications considered and addressed (N/A - documentation only)
- [x] Performance impact assessed (N/A - no code changes)
- [x] Test strategy covers critical paths and edge cases
- [x] Documentation updates planned (talks.md is documentation)
- [x] Related issues/dependencies identified (none)
- [x] Breaking changes documented (none)

### Optional Improvements

**Suggestions that would enhance the plan but aren't strictly required:**

- [ ] **Proactive link audit**: While fixing these 2 links, run a full link
      check on talks.md and fix any other broken links found in the same commit
      (reduces future maintenance)
- [ ] **Document archive pattern**: Add a comment in talks.md or CLAUDE.md
      explaining when to use archive.org links for future reference
- [ ] **Exclude known-flaky domains**: If certain domains (meetup.com,
      player.fm) frequently break, consider excluding them from monthly checks
      via .lychee.toml
- [ ] **Check other markdown files**: Issue title says "talks.md" but workflow
      checks all `content/**/*.md` - verify no other files have broken links

**Priority:** Low - Issue #209 specifically mentions talks.md, so focus on that
first.

### Implementation Guidance

**Recommended execution order:**

1. **Read talks.md** around lines 629 and 974 to get exact formatting
2. **Edit line 974** - Replace player.fm URL with archive.org URL
3. **Edit line 629** - Replace emamo.com URL with archive.org URL
4. **Run Hugo build** via Docker: `make hugo_serve`
5. **Verify visually** at `http://localhost:1313/talks`
6. **Run link check**: Build site, then `npm run test:links`
7. **Run spell check**: `npm run test:spell`
8. **Stage files**: `git add content/talks.md`
9. **Commit**: Pre-commit hooks will run automatically
10. **If hooks fail**: Fix issues, re-stage, commit again
11. **Push** to remote branch

**Exact edit commands:**

```bash
# Edit 1: player.fm link (line 974)
Edit: file_path="content/talks.md"
  old_string="  [player.fm](https://player.fm/series/cto-and-co-founder-talk-with-dave-albert/guest-lewis-denham-parry)"
  new_string="  [player.fm](https://web.archive.org/web/20220624230804/https://player.fm/series/cto-and-co-founder-talk-with-dave-albert/guest-lewis-denham-parry)"

# Edit 2: emamo.com link (line 629)
Edit: file_path="content/talks.md"
  old_string="  [London, UK](https://emamo.com/event/bsideslondon2021/r/speaker/lewis-denham-parry)"
  new_string="  [London, UK](https://web.archive.org/web/20220711204907/https://emamo.com/event/bsideslondon2021/r/speaker/lewis-denham-parry)"
```

### Final Recommendation

**Status: APPROVED** (with required plan updates)

The plan is technically sound and will solve the issue. The approach is correct,
file references are accurate, and testing strategy is comprehensive.

**Required before implementation:**

1. Update plan document to remove conditional logic (both links ARE archived)
2. Specify exact archive.org URLs in implementation steps
3. Update success criteria to reflect archive link replacement (not removal)

**Ready for implementation:** Yes, after plan updates

**Expected outcome:** Both broken links replaced with working archive.org links,
Hugo build succeeds, link checker passes, issue #209 resolved.

---

**Review completed by Claude Code workflow-research-plan** **Confidence: High**
| **Recommendation: Proceed to implementation**
