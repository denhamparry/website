# GitHub Issue #205: Broken links detected in content files

**Issue:** [#205](https://github.com/denhamparry/website/issues/205) **Status:**
Complete **Date:** 2026-01-07 **Labels:** bug, documentation, ci

## Problem Statement

The monthly link validation workflow detected 3 broken links in the website
content. These links are either returning 404 errors or experiencing network
issues, preventing users from accessing referenced conference materials and
causing the automated link checker to fail.

### Current Behavior

**Failed Links (from workflow run):**

- `[404] https://kernelcon.org/training#k8sec` - Anchor link no longer exists
- `[404] https://www.kcdc.info/sessions` - Sessions page has been removed or
  moved
- `[ERROR] https://blueconf.co.uk/` - Network error (domain potentially
  expired/offline)

**Impact:**

- Automated link checker workflow fails monthly validation
- Users clicking links encounter 404 errors or network failures
- Professional credibility affected by broken reference links
- Historical speaking engagement context is lost

### Expected Behavior

- All links in content should resolve successfully (HTTP 200-299)
- Historical conference links should use archived versions when original sites
  are offline
- Link checker workflow should pass monthly validation
- Users can access referenced materials or understand when links are archived

## Current State Analysis

### Relevant Code/Config

**Broken links found in:** `content/talks.md`

1. **Line 306 & 330:** KCDC 2022 references

   ```markdown
   - Where: [Kansas City, USA](https://www.kcdc.info/sessions)
   ```

   Two occurrences - both talks from August 2022

2. **Line 469 & 513:** KernelCon 2022 references

   ```markdown
   - Where: [Omaha, USA](https://kernelcon.org/) # Line 469 - working
   - Where: [Omaha, USA](https://kernelcon.org/training#k8sec) # Line 513 -
     broken anchor
   ```

3. **Line 863 & 869:** BlueConf 2019 references
   ```markdown
   - Where: [BlueConf](https://blueconf.co.uk/)
   - Where: [Cardiff, UK](https://blueconf.co.uk/)
   ```

**Link validation workflow:** `.github/workflows/link-check.yml`

- Uses lychee-action v2.0.2
- Runs monthly on 1st at midnight UTC (cron: "0 0 1 \* \*")
- Checks all markdown files in `content/**/*.md`
- Accepts HTTP 200 and 429 (rate limited) responses
- Max 3 retries with 5 second timeout
- Creates GitHub issues automatically when broken links detected

**Lychee configuration:** `.lychee.toml`

- Current exclusions: `.git`, `themes`
- No domain-specific exclusions configured

### Related Context

**Archive.org availability:**

- ❌ `kernelcon.org/training` - No archived snapshots available
- ❌ `kcdc.info/sessions` - No archived snapshots available
- ✅ `blueconf.co.uk` - **Archived snapshot available!**
  - Archive URL:
    `http://web.archive.org/web/20220521180658/https://blueconf.co.uk/`
  - Timestamp: May 21, 2022
  - Status: 200 (working)

**Conference context:**

- KernelCon 2022: Security conference in Omaha (March 30-31, April 2, 2022)
- KCDC 2022: Kansas City Developer Conference (August 8-10, 2022)
- BlueConf 2019: Tech conference in Cardiff, UK (June 8, 2019)

All conferences are historical events from 2019-2022, so current links are less
critical than archived references.

## Solution Design

### Approach

**Hybrid solution combining three strategies:**

1. **Use Archive.org for BlueConf** (archived version exists)
2. **Update KernelCon link** (remove broken anchor, keep domain)
3. **Remove or update KCDC links** (no archive available, check for alternative)

**Rationale:**

- Preserves historical context where possible (BlueConf archived)
- Fixes validation errors without losing talk information
- Maintains professional credibility with working or archived links
- Balances between perfection and pragmatism

**Trade-offs considered:**

- ❌ Remove all broken links entirely - loses historical context
- ❌ Wait for sites to come back online - unlikely for 2019-2022 events
- ✅ Use archives + update where available - best balance

### Implementation

**File to modify:** `content/talks.md`

#### Change 1: Fix KernelCon Training Link (Line 513)

**Current:**

```markdown
- Where: [Omaha, USA](https://kernelcon.org/training#k8sec)
```

**Updated:**

```markdown
- Where: [Omaha, USA](https://kernelcon.org/training)
```

**Rationale:** Remove the broken anchor `#k8sec`. The main training page still
exists at `kernelcon.org/training`. This maintains the reference to the
conference while fixing the 404 error.

#### Change 2: Fix KCDC Sessions Links (Lines 306 & 330)

**Current:**

```markdown
- Where: [Kansas City, USA](https://www.kcdc.info/sessions)
```

**Updated:**

```markdown
- Where: [Kansas City, USA](https://www.kcdc.info/)
```

**Rationale:** Change to the main KCDC domain which still resolves. The specific
sessions page is gone, but the conference domain remains active. This provides a
valid reference point for the event.

#### Change 3: Update BlueConf Links to Archive.org (Lines 863 & 869)

**Current:**

```markdown
### BlueConf - Contributing With No Code

- Type: Lightning Talks
- Where: [BlueConf](https://blueconf.co.uk/)
- Date 08th Jun 2019

### BlueConf - WTF is Cloud Native

- Type: Talk
- Where: [Cardiff, UK](https://blueconf.co.uk/)
- Date 08th Jun 2019
```

**Updated:**

```markdown
### BlueConf - Contributing With No Code

- Type: Lightning Talks
- Where:
  [BlueConf](https://web.archive.org/web/20220521180658/https://blueconf.co.uk/)
- Date 08th Jun 2019

### BlueConf - WTF is Cloud Native

- Type: Talk
- Where:
  [Cardiff, UK](https://web.archive.org/web/20220521180658/https://blueconf.co.uk/)
- Date 08th Jun 2019
```

**Rationale:** Use the archived snapshot from May 2022. This preserves the
historical context and provides a working link to the original content.
Archive.org links are stable and long-lasting.

### Benefits

1. **Fixes CI/CD:** Monthly link checker workflow will pass validation
2. **Preserves history:** Archived links maintain conference context
3. **User experience:** No more 404 errors for visitors
4. **Professional credibility:** All reference links work or point to archives
5. **Low maintenance:** Archive.org links are stable long-term
6. **Future-proof:** Sets precedent for handling aged conference links

## Implementation Plan

### Step 1: Update KernelCon Training Link

**File:** `content/talks.md:513`

**Changes:**

- Remove broken anchor `#k8sec` from KernelCon training URL
- Change `https://kernelcon.org/training#k8sec` to
  `https://kernelcon.org/training`

**Testing:**

```bash
# Verify the link resolves
curl -I https://kernelcon.org/training

# Expected: HTTP 200
```

### Step 2: Update KCDC Sessions Links

**File:** `content/talks.md:306,330`

**Changes:**

- Update both KCDC references to use main domain
- Change `https://www.kcdc.info/sessions` to `https://www.kcdc.info/`

**Testing:**

```bash
# Verify the main domain resolves
curl -I https://www.kcdc.info/

# Expected: HTTP 200
```

### Step 3: Update BlueConf Links to Archive.org

**File:** `content/talks.md:863,869`

**Changes:**

- Replace both BlueConf links with archive.org snapshot
- Change `https://blueconf.co.uk/` to
  `https://web.archive.org/web/20220521180658/https://blueconf.co.uk/`

**Testing:**

```bash
# Verify the archive link works
curl -I https://web.archive.org/web/20220521180658/https://blueconf.co.uk/

# Expected: HTTP 200
```

### Step 4: Run Local Link Validation

**Commands:**

```bash
# Build the Hugo site
hugo --gc --minify

# Run link validation (if npm test:links is available)
npm run test:links

# OR use lychee directly
lychee --verbose --no-progress --max-retries 3 --timeout 5 --accept 200,429 --exclude-path '.git' --exclude-path 'themes' 'content/**/*.md'
```

**Expected result:** All links should pass validation with no 404 errors

### Step 5: Verify Changes in Content

**Manual review:**

1. Read through the modified sections in `content/talks.md`
2. Verify formatting is preserved (markdown structure intact)
3. Ensure context remains clear for archived links
4. Check that all 3 sets of links (KernelCon, KCDC, BlueConf) are updated

### Step 6: Commit Changes

**Commit message:**

```
fix(content): update broken conference links in talks.md

- Fix KernelCon training link by removing broken #k8sec anchor
- Update KCDC sessions links to main domain (sessions page removed)
- Replace BlueConf links with archive.org snapshot from May 2022

Resolves monthly link checker failures for 3 broken URLs:
- kernelcon.org/training#k8sec (404)
- kcdc.info/sessions (404)
- blueconf.co.uk (network error)

All links now resolve successfully (HTTP 200). BlueConf uses
archived version to preserve historical context.

Fixes #205

🤖 Generated with [Claude Code](https://claude.com/claude-code)

Co-Authored-By: Claude Sonnet 4.5 <noreply@anthropic.com>
```

### Step 7: Push and Verify CI

**Commands:**

```bash
# Push to current branch
git push origin denhamparry.co.uk/feat/gh-issue-205

# Monitor GitHub Actions workflow
gh run watch
```

**Expected:** Link checker workflow should pass when triggered

## Testing Strategy

### Unit Testing

**Manual link verification:**

```bash
# Test each fixed link individually
curl -I https://kernelcon.org/training
curl -I https://www.kcdc.info/
curl -I https://web.archive.org/web/20220521180658/https://blueconf.co.uk/

# All should return HTTP 200
```

### Integration Testing

**Test Case 1: Local Hugo Build**

1. Run `hugo --gc --minify`
2. Verify build succeeds without errors
3. Check that `public/` directory is generated
4. Spot-check `public/talks/index.html` for correct link URLs

**Expected result:** Build succeeds, links in HTML output match updated markdown

**Test Case 2: Local Link Checker**

1. Run `lychee` or `npm run test:links` against content/
2. Review output for any remaining broken links
3. Verify the 3 previously broken links now pass

**Expected result:** Zero broken links reported

**Test Case 3: Spell Check**

1. Run `npm run test:spell` (cspell validation)
2. Verify no new spelling errors introduced
3. Archive.org URLs should pass (not flagged as typos)

**Expected result:** No new spelling errors

### Regression Testing

**Verify existing functionality:**

- [ ] All other links in `content/talks.md` still work (no accidental changes)
- [ ] Markdown formatting preserved (headings, lists, dates)
- [ ] Hugo build time remains consistent (~same duration)
- [ ] Page renders correctly in browser (manual visual check)

**Edge cases:**

- [ ] Archive.org link renders correctly as hyperlink (not plaintext)
- [ ] KCDC and KernelCon links maintain proper link text (location names)
- [ ] No trailing whitespace or formatting issues introduced

### GitHub Actions Validation

**Automated tests (run on PR):**

1. `test.yml` workflow - comprehensive test suite
2. `conform.yml` - commit message validation
3. Link checker (manual trigger) - verify broken links fixed

**Expected:** All workflows pass green ✅

## Success Criteria

- [ ] KernelCon training link updated (anchor removed)
- [ ] KCDC sessions links updated (main domain used)
- [ ] BlueConf links replaced with archive.org snapshot
- [ ] Local link validation passes (0 broken links)
- [ ] Hugo build succeeds without errors
- [ ] Spell check passes (no new errors)
- [ ] Changes committed with conventional commit message
- [ ] GitHub Actions workflows pass
- [ ] Issue #205 closed with resolution comment
- [ ] Monthly link checker workflow will pass next run

## Files Modified

1. `content/talks.md` - Update 3 sets of broken links (6 total link changes)

## Related Issues and Tasks

### Depends On

- None (standalone fix)

### Blocks

- Monthly link checker workflow (currently failing)
- Issue #205 (requires this fix to close)

### Related

- Link checker workflow: `.github/workflows/link-check.yml`
- Lychee configuration: `.lychee.toml`
- Similar future broken links for aged conference sites

### Enables

- Clean CI/CD pipeline (no failing monthly checks)
- Future pattern for handling aged conference links
- Potential to add more archive.org links proactively

## References

- [GitHub Issue #205](https://github.com/denhamparry/website/issues/205)
- [Failed Workflow Run](https://github.com/denhamparry/website/actions/runs/20629754286)
- [Archive.org Wayback Machine](https://web.archive.org/)
- [Lychee Link Checker](https://github.com/lycheeverse/lychee)
- [BlueConf Archived Snapshot](https://web.archive.org/web/20220521180658/https://blueconf.co.uk/)

## Notes

### Key Insights

1. **Archive.org is invaluable** for preserving historical conference references
2. **Not all broken links can be archived** - only 1 of 3 had snapshots
   available
3. **Removing anchors can fix links** - main pages often persist longer than
   deep links
4. **Main domains outlive subpages** - KCDC domain works but sessions page is
   gone
5. **Monthly checks are effective** at catching link rot before users report it

### Alternative Approaches Considered

1. **Remove all broken links entirely** ❌

   - Pros: Simplest solution, no broken links
   - Cons: Loses historical context, removes conference references
   - Why not chosen: Historical accuracy is valuable for professional portfolio

2. **Add note "(link no longer available)" but keep broken links** ❌

   - Pros: Maintains original URLs, explains situation
   - Cons: Still fails link checker, looks unprofessional
   - Why not chosen: Fails CI/CD validation, bad user experience

3. **Exclude these URLs in .lychee.toml** ❌

   - Pros: Quick fix, stops workflow failures
   - Cons: Hides the problem instead of fixing it
   - Why not chosen: Doesn't solve user-facing broken links

4. **Hybrid approach: Archive + domain updates** ✅
   - Pros: Fixes validation, preserves context where possible, pragmatic
   - Cons: Some URLs point to generic domains instead of specific pages
   - Why chosen: Best balance of fixing errors and preserving information

### Best Practices

**For future link maintenance:**

1. **Proactively archive important conference links** using archive.org's "Save
   Page Now" feature
2. **Prefer main domains over deep links** for longevity (e.g., `kcdc.info` vs
   `kcdc.info/sessions/2022/speaker`)
3. **Document archived links** in commit messages so future maintainers
   understand context
4. **Monitor monthly link checker** and fix broken links within 30 days
5. **Consider adding archive.org links proactively** for conferences older than
   3 years

**For link checker configuration:**

- Current setup works well (lychee with 3 retries, 5 sec timeout)
- Could add domain exclusions in `.lychee.toml` for known problematic domains
  (meetup.com archives)
- Monthly schedule is appropriate (more frequent would be excessive)

**Monitoring approach:**

- GitHub Actions creates issues automatically ✅
- Assignee notified for manual review ✅
- Could enhance with Slack/email notifications if desired
- Consider annual review of all links 3+ years old

## Implementation Notes

**Estimated time:** 15-20 minutes

- Link research and validation: 5 min
- Content updates: 5 min
- Testing and verification: 5 min
- Commit and push: 2 min

**Risk level:** Low

- Changes are isolated to markdown links only
- No code or configuration changes
- Easy to revert if issues arise
- Hugo build is deterministic (no rendering risks)

**Dependencies:**

- Internet connection (for testing links)
- Hugo installed locally (for build testing)
- lychee or npm (for link validation)
- gh CLI (for monitoring workflow)
