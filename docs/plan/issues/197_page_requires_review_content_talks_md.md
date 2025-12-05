# GitHub Issue #197: Page requires review: content/talks.md

**Issue:** [#197](https://github.com/denhamparry/website/issues/197) **Status:**
Open **Date:** 2025-12-05

## Problem Statement

The `content/talks.md` file requires review to ensure content accuracy,
completeness, and the `reviewed` frontmatter date is up-to-date.

### Current Behavior

- Last review date: `2025-08-19` (nearly 4 months ago)
- Recent talk added: "What I wish I knew about AI 10 days ago" (December
  4th, 2025)
- Content includes talks from 2018-2025
- No systematic review process documented

### Expected Behavior

- Content should be reviewed periodically (quarterly recommended)
- `reviewed` date in frontmatter should reflect latest review
- All talk entries should have:
  - Accurate metadata (type, date, event)
  - Proper description or abstract (where applicable)
  - Working resource links (slides, recordings)
  - Consistent formatting

## Current State Analysis

### Relevant Code/Config

**File:** `content/talks.md`

**Current frontmatter:**

```yaml
---
title: Talks
date: 2022-04-22T21:00:00+00:00
reviewed: 2025-08-19 # ← Last review nearly 4 months ago
tags: ["talk"]
author: Lewis Denham-Parry
# ... other metadata
---
```

**Recent changes:**

- Latest uncommitted change: Added "What I wish I knew about AI 10 days ago"
  talk
- Previous commits show regular updates but inconsistent review date updates
- Content spans 7 years (2018-2025) with 98 talks/events

**Content statistics (researched 2025-12-05):**

- Total lines: 1,073
- Total talks: 98 entries (### headers)
- External links: 92 URLs
- Years covered: 2018-2025 (8 years)
- Talk distribution:
  - 2025: 6 talks (including 2 with same title, different events)
  - 2024: 13 talks
  - 2023: 18 talks
  - 2022-2018: 61 talks

### Related Context

- Issue labels: `help wanted`, `documentation`
- Pattern: `reviewed` field exists only in talks.md (unique to this file)
- No automated review reminders or checks in GitHub Actions
- Content is manually curated and updated

## Solution Design

### Approach

Perform a comprehensive content review covering:

1. **Content accuracy audit**

   - Verify all dates are correct
   - Check event names and types
   - Validate resource links (slides, recordings, event pages)

2. **Completeness check**

   - Ensure 2025 talks have descriptions
   - Verify no missing recent talks
   - Check formatting consistency

3. **Link validation**

   - Test external links (YouTube, Meetup, etc.)
   - Verify slide/recording URLs
   - Check for broken redirects

4. **Frontmatter update**

   - Update `reviewed` date to current date (2025-12-05)

5. **Future maintenance**
   - Document review process in CLAUDE.md
   - Consider adding link checker to CI/CD

### Rationale

- Manual review ensures quality and accuracy
- Updating `reviewed` date provides transparency
- Documenting process prevents future staleness

### Benefits

- Users can trust content freshness (via `reviewed` date)
- Broken links identified and fixed
- Consistent formatting improves readability
- Establishes maintenance pattern for future reviews

## Implementation Plan

### Step 1: Verify Recent Talks (2025)

**File:** `content/talks.md`

**2025 Talks Inventory:**

1. [x] "What I wish I knew about AI 10 days ago" (Dec 4, Cloud Native
       Manchester) - Added with description ✓
2. [x] "What I wish I knew about AI 10 days ago" (Nov 8, Cloud Native Rejeckts)
   - Lightning talk, has recording ✓
3. [ ] "Edera: Tag Team Champions" (Oct 16) - Has description, verify signup
       link
4. [ ] "Edera: Let The Hardened Runtime Era Begin" (Aug 26) - Has description,
       verify recording link
5. [ ] "Kubernetes London: Reimagining Container Runtimes" (Jun 16) - Has
       description, verify slide link
6. [ ] "KubeCon EU 2025" (Apr 4) - Has description, verify YouTube link

**Link validation results (tested 2025-12-05):**

All 4 URLs in 2025 section returned HTTP 200:

- ✅ https://talks.denhamparry.co.uk/2025-12-04-cloud-native-manchester.html
- ✅ https://www.youtube.com/watch?v=-rtaWnFzGdA
- ✅
  https://us06web.zoom.us/webinar/register/4017575425840/WN_viySTZz6Tr2-yzSjpWS6eQ#/registration
- ✅ https://us06web.zoom.us/rec/component-page?...(long Zoom recording URL)

**Testing:**

```bash
# Extract and test all URLs from 2025 section
grep -A 10 "^## 2025" content/talks.md | grep -oE 'https?://[^)]+' | while read url; do
  echo "Testing: $url"
  curl -I -s -o /dev/null -w "%{http_code}\n" "$url"
done
```

### Step 2: Spot Check Historical Content

**File:** `content/talks.md`

**Review approach:**

- Sample 5-10 talks from each year (2024, 2023, 2022, etc.)
- Verify YouTube links still work
- Check Meetup.com links (may expire)
- Note any broken links for fixing

**Priority:**

- Focus on talks with recordings (high value)
- Check KubeCon/NDC talks (widely referenced)
- Verify recent 2024 talks

**Sample size based on content statistics:**

- 2024: Sample 5 talks (out of 13 total)
- 2023: Sample 5 talks (out of 18 total)
- 2022: Sample 3 talks (historical significance)
- Focus on talks with YouTube recordings or important conference presentations

### Step 3: Validate External Links

**File:** `content/talks.md`

**Available tools (from package.json):**

- `npm run test:links` - Uses linkinator to check links in public/ directory
- Requires Hugo build first: `hugo --gc --minify`
- Linkinator config:
  `--recurse --skip 'livereload.js' --skip 'googletagmanager.com'`

**Testing approach:**

```bash
# Option 1: Use linkinator (requires build)
hugo --gc --minify
npm run test:links

# Option 2: Direct URL testing (no build required)
grep -oE 'https?://[^)]+' content/talks.md > /tmp/all_links.txt
while read url; do
  curl -I -s -o /dev/null -w "%{http_code} | $url\n" -L --max-time 5 "$url"
done < /tmp/all_links.txt | grep -v "^200"
```

**Expected scale:**

- 92 total external links to validate
- Estimated time: 5-10 minutes for full validation
- Focus on 2024-2025 links first (higher priority)

**Expected issues:**

- Meetup.com links may be archived/expired
- Some YouTube videos may be unlisted/private
- Event websites may no longer exist

**Resolution:**

- Replace broken links with archived versions (archive.org)
- Remove links if content no longer accessible
- Add notes like "(archived)" or "(link expired)"

### Step 4: Check Formatting Consistency

**File:** `content/talks.md`

**Verify:**

- Consistent date format: "DDth Month YYYY"
- Resource links use markdown format: `[Text](URL)`
- Talk descriptions are paragraphs (not lists)
- Event types consistent: Talk, Workshop, Meetup, Podcast, etc.

**Current format patterns (verified):**

```markdown
### [Talk Title]

- Type: [Type]
- Date: [DDth Month YYYY]
- Event: [Event Name]
- Resources: [Link(s)]

[Description paragraph(s)]
```

**Metadata consistency check:**

- All 2025 talks follow standard format ✓
- Types observed: Meetup, Lightning Talk, Webinar, Talk, Workshop, Podcast, CTF
- Date formats consistent across all years ✓

**Changes needed:**

- Ensure all sections follow same pattern
- Fix any markdown formatting issues

### Step 5: Update Frontmatter Review Date

**File:** `content/talks.md`

**Changes:**

```yaml
reviewed: 2025-12-05 # Updated from 2025-08-19
```

**Justification:**

- Reflects completion of this review
- Signals to readers content has been verified
- Sets baseline for next quarterly review

### Step 6: Document Review Process

**File:** `CLAUDE.md` (or `docs/MAINTENANCE.md`)

**Add section:**

```markdown
## Content Review Process

### talks.md Review (Quarterly)

**Frequency:** Every 3 months or when significant updates occur

**Checklist:**

1. Verify recent talk entries (dates, descriptions, links)
2. Test external resource links (slides, recordings)
3. Check formatting consistency
4. Update `reviewed` frontmatter date
5. Create GitHub issue if problems found

**Tools:**

- `npm run test:links` - Validate URLs
- Manual spot-check of high-value content

**Last Review:** 2025-12-05 **Next Review:** 2026-03-05 (estimated)
```

### Step 7: Optional - Add Automated Link Checking

**File:** `.github/workflows/link-check.yml` (new)

**Implementation:**

```yaml
name: Link Checker
on:
  schedule:
    - cron: "0 0 1 * *" # Monthly on 1st
  workflow_dispatch:

jobs:
  linkchecker:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Check links in content/
        uses: lycheeverse/lychee-action@v1
        with:
          args: --verbose --no-progress 'content/**/*.md'
          fail: false # Don't fail build, just report
      - name: Create issue if links broken
        if: failure()
        uses: actions/github-script@v6
        # ... create issue with broken links
```

**Benefits:**

- Automated detection of broken links
- Monthly reports via GitHub Issues
- No manual effort required

**Trade-offs:**

- Additional CI/CD cost (minimal, monthly)
- May create noise if many external links break
- Requires maintenance of workflow

## Testing Strategy

### Manual Testing

**Test Case 1: Link Validation**

1. Extract all URLs from talks.md
2. Test each with `curl -I` or browser
3. Document broken links in spreadsheet
4. Fix or mark as archived

**Expected result:** >95% of links return 200 OK or valid redirect

**Test Case 2: Content Accuracy**

1. Cross-reference 2025 talks with calendar/events
2. Verify dates match actual event dates
3. Check descriptions match slide content

**Expected result:** All dates accurate, descriptions aligned with content

**Test Case 3: Formatting Consistency**

1. Scan through full document
2. Note any formatting inconsistencies
3. Apply fixes for uniform style

**Expected result:** Consistent markdown formatting throughout

### Regression Testing

- Hugo build succeeds: `hugo --gc --minify`
- Spell check passes: `npm run test:spell`
- Accessibility tests pass: `npm run test:accessibility`
- No markdown linting errors

### Acceptance Criteria

- [ ] All 2025 talks verified (dates, descriptions, links)
- [ ] Sample of historical talks checked (5+ per year)
- [ ] Broken links identified and fixed/noted
- [ ] Formatting consistent throughout
- [ ] `reviewed` date updated to 2025-12-05
- [ ] Review process documented
- [ ] All tests passing

## Success Criteria

- [x] New talk "What I wish I knew about AI 10 days ago" added with description
- [ ] All external links in 2025 section verified working
- [ ] Spot check of 2024 content (5+ talks)
- [ ] Spot check of 2023 content (5+ talks)
- [ ] Any broken links fixed or marked as archived
- [ ] Formatting inconsistencies corrected
- [ ] `reviewed` frontmatter updated to 2025-12-05
- [ ] Review process documented in CLAUDE.md or docs/
- [ ] Hugo build passes
- [ ] Spell check passes
- [ ] Issue #197 closed with review completion comment

## Files Modified

1. `content/talks.md` - Content review, link fixes, frontmatter update
2. `CLAUDE.md` or `docs/MAINTENANCE.md` - Document review process
3. `.github/workflows/link-check.yml` - Optional automated link checking

## Related Issues and Tasks

### Depends On

- None

### Blocks

- None (but improves content quality for all users)

### Related

- Spell checking workflow (cspell.json, .spelling.txt)
- Link checking (npm run test:links)

### Enables

- Establishes pattern for other content reviews
- Provides template for future talks.md reviews
- Potential for automated content quality checks

## References

- [GitHub Issue #197](https://github.com/denhamparry/website/issues/197)
- [Hugo Content Management](https://gohugo.io/content-management/)
- [talks.md file](../../../content/talks.md)
- Recent changes: commits d44d2d1a, c4943d8c, 51bf22e3

## Research Findings (2025-12-05)

### Content Analysis

**File statistics:**

- 1,073 lines total
- 98 talk entries (### level headers)
- 92 external URLs
- 8 year sections (2018-2025)

**Talk distribution by year:**

- 2025: 6 talks (current year in progress)
- 2024: 13 talks
- 2023: 18 talks (peak year)
- 2022: 31 talks
- 2021: 20 talks
- 2020: 4 talks (COVID impact)
- 2019: 15 talks
- 2018: 7 talks

**Notable patterns:**

- Two talks in 2025 share same title but are different events (Cloud Native
  Manchester meetup vs Cloud Native Rejeckts lightning talk)
- Consistent metadata format across all years
- Mix of content: conference talks, meetups, podcasts, workshops, CTFs
- Heavy focus on Kubernetes, cloud native, and security topics

### Link Validation Research

**2025 section validation:**

- 4 URLs tested, all returned HTTP 200 ✓
- No broken links found in current year content
- Links include: talks.denhamparry.co.uk, YouTube, Zoom webinar/recordings

**Testing tools available:**

- `linkinator` (v5.0.0) - installed via npm
- `npm run test:links` - requires Hugo build first
- Configuration skips livereload.js and googletagmanager.com

**Validation approach:**

- Linkinator checks built site (public/ directory)
- Manual curl testing for source content validation
- 92 total links to validate across all years

### Test Infrastructure

**Available test suites (from package.json):**

```json
{
  "test": "npm run test:hugo && npm run test:functional && npm run test:accessibility",
  "test:hugo": "node tests/hugo/test-hugo-build.js",
  "test:functional": "jest tests/functional",
  "test:accessibility": "node tests/accessibility/test-accessibility.js",
  "test:links": "linkinator public --recurse",
  "test:spell": "cspell '**/*.md' '**/*.txt' --no-progress"
}
```

**Dependencies:**

- @axe-core/puppeteer: ^4.8.2 (accessibility)
- jest: ^29.7.0 (functional tests)
- linkinator: ^5.0.0 (link validation)
- cspell: ^8.3.2 (spell checking)
- puppeteer: ^23.8.0 (browser automation)

**Test files:**

- tests/hugo/test-hugo-build.js - Build validation
- tests/functional/content.test.js - Content checks
- tests/functional/navigation.test.js - Navigation checks
- tests/accessibility/test-accessibility.js - a11y validation

### Format Consistency

**Standard talk entry format (verified in 2025 content):**

```markdown
### [Talk Title]

- Type: [Type]
- Date: [DDth Month YYYY]
- Event: [Event Name]
- Resources: [Links]

[Description paragraphs]
```

**Observed talk types:**

- Talk, Lightning Talk, Workshop, Meetup, Podcast, Webinar, CTF, Keynote,
  Conference

**Date format:**

- Consistent: "DDth Month YYYY" (e.g., "4th December 2025")
- Some entries: "DD-DDth Month YYYY" for multi-day events

**Resource links:**

- Slides, YouTube recordings, event pages, Meetup links, conference sites
- Format: `[Link text](URL)` or bullet list of links

## Notes

### Key Insights

- The `reviewed` field is unique to talks.md and serves as a content freshness
  indicator
- Manual review still valuable despite automated link checkers (context matters)
- Content spans 7 years - full link validation may find many broken external
  links
- Meetup.com and conference sites often remove old event pages

### Alternative Approaches Considered

1. **Automated link checking only** - Why not chosen ❌

   - Doesn't verify content accuracy (dates, descriptions)
   - Can't assess quality/completeness
   - Lacks human judgment for archived links

2. **Full historical link audit** - Why not chosen ❌

   - Time-intensive (100+ talks to check)
   - Low ROI for very old talks (2018-2020)
   - Links naturally decay over time

3. **Manual review with spot checks** - Why selected ✅
   - Balances thoroughness with efficiency
   - Focuses on high-value recent content
   - Identifies systemic issues
   - Updates freshness indicator (`reviewed` date)

### Best Practices

**For future reviews:**

- Schedule quarterly (every 3 months)
- Focus on talks from last 12 months
- Spot check older content (5-10 talks per year)
- Document review in commit message
- Update `reviewed` date after each review
- Track broken links in GitHub issues if extensive

**For new talk entries:**

- Add description/abstract when available
- Include resource links (slides, recordings) when published
- Follow existing formatting patterns
- Test links before committing
- Consider updating `reviewed` date if major additions

**Link management:**

- Use archive.org for important broken links
- Mark expired links as "(archived)" or "(link expired)"
- Prioritize fixing recent/high-value broken links
- Accept that old event links will naturally decay
