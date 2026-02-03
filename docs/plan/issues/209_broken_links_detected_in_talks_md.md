# Implementation Plan: Fix Broken Links in talks.md

**Issue**: #209 - Broken links detected in talks.md **Status**: Planning
**Created**: 2026-02-03 **Type**: Documentation Fix

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
