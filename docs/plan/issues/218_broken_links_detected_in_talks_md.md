# GitHub Issue #218: Broken links detected in talks.md

**Issue:** [#218](https://github.com/denhamparry/website/issues/218) **Status:**
Planning **Date:** 2026-03-02

## Problem Statement

The monthly link checker workflow detected broken links in `content/talks.md`.
All three broken links point to skillsmatter.com, which returned `403 Forbidden`
responses. SkillsMatter went into administration and their website is no longer
functional.

### Current Behavior

Three links in `content/talks.md` return 403 Forbidden from lychee's
perspective, causing the link checker workflow to fail and create this automated
issue.

**Broken links identified:**

1. `https://skillsmatter.com/conferences/11982-con-london-2019-the-conference-on-microservices-ddd-and-software-architecture#program`
   - Talk: µCon London 2019 - How do we become Cloud Native? (line ~903)
2. `https://skillsmatter.com/conferences/10107-prognet-london-2018#skillscasts`
   - Talk: ProgNet London 2018 - Use Kubernetes to Deploy .NET Applications
     (line ~1071)
3. `https://skillsmatter.com/conferences/10336-mucon-london-2018-the-microservices-conference#skillscasts`
   - Talk: µCon London 2018 - One Monolith / One Macroservice / Many
     Microservices (line ~1044)

### Expected Behavior

- All links in `content/talks.md` return HTTP 200 or 429
- The monthly link checker workflow passes without failures
- GitHub issue #218 is resolved and closed

## Current State Analysis

### Relevant Code/Config

- **File:** `content/talks.md` - Contains all talk entries with links
- **File:** `.lychee.toml` - Link checker config: `accept = [200, 429]` only
- **File:** `.github/workflows/link-check.yml` - Monthly link check workflow

### Root Cause

SkillsMatter (skillsmatter.com) went into administration. Their website is no
longer operational and returns 403 for all requests. These links are from 2018
and 2019 conference appearances.

### Related Context

- Previous similar issues: #205 (broken links Jan 2025), #209 (broken links
  Feb 2026)
- The lychee config accepts only 200 and 429 - 403 always fails

## Solution Design

### Approach

Replace the three broken skillsmatter.com links with web.archive.org archived
versions. This preserves the historical record while fixing the broken links.
Archive.org typically has snapshots of these pages.

If archive.org does not have a usable snapshot for any link, remove the link
text entirely and keep just the plain text event name.

### Rationale

- Archive.org links are stable and return 200
- Preserves the event history and context for visitors
- Consistent with how other archived links are handled in the file (see BSides
  London 2021 which already uses archive.org)

### Implementation

For each of the three links, replace with the archive.org equivalent URL.

The archive.org URL format is:
`https://web.archive.org/web/<YYYYMMDDHHMMSS>/<original-url>`

## Implementation Plan

### Step 1: Find archive.org URLs for each broken link

Check web.archive.org for archived snapshots of:

1. `https://web.archive.org/web/*/https://skillsmatter.com/conferences/11982-con-london-2019-the-conference-on-microservices-ddd-and-software-architecture`
2. `https://web.archive.org/web/*/https://skillsmatter.com/conferences/10107-prognet-london-2018`
3. `https://web.archive.org/web/*/https://skillsmatter.com/conferences/10336-mucon-london-2018-the-microservices-conference`

### Step 2: Update content/talks.md

**File:** `content/talks.md`

Replace each broken skillsmatter.com link with the corresponding archive.org URL
(or remove the link if no archive exists).

**Change 1** (~line 903): µCon London 2019

```markdown
# Before:

- Where:
  [London, UK](https://skillsmatter.com/conferences/11982-con-london-2019-the-conference-on-microservices-ddd-and-software-architecture#program)

# After (example with archive.org):

- Where:
  [London, UK](https://web.archive.org/web/20190601000000*/https://skillsmatter.com/conferences/11982-con-london-2019-the-conference-on-microservices-ddd-and-software-architecture)
```

**Change 2** (~line 1044): µCon London 2018

```markdown
# Before:

- Where:
  [London, UK](https://skillsmatter.com/conferences/10336-mucon-london-2018-the-microservices-conference#skillscasts)

# After (example with archive.org):

- Where:
  [London, UK](https://web.archive.org/web/20181101000000*/https://skillsmatter.com/conferences/10336-mucon-london-2018-the-microservices-conference)
```

**Change 3** (~line 1071): ProgNet London 2018

```markdown
# Before:

- Where:
  [London, UK](https://skillsmatter.com/conferences/10107-prognet-london-2018#skillscasts).

# After (example with archive.org):

- Where:
  [London, UK](https://web.archive.org/web/20180912000000*/https://skillsmatter.com/conferences/10107-prognet-london-2018).
```

### Step 3: Verify fixes

```bash
# Build hugo site to check for errors
hugo --gc --minify

# Run pre-commit hooks
pre-commit run --all-files
```

### Step 4: Commit and PR

Stage only the modified file and create a conventional commit on the
`denhamparry.co.uk/docs/gh-issue-218` branch.

## Testing Strategy

### Manual Verification

For each replaced link, verify the archive.org URL returns HTTP 200:

```bash
curl -sI "<archive-url>" | head -1
```

### Integration Testing

**Test Case 1: Local link check**

```bash
# Build first
hugo --gc --minify
# Check links (requires lychee installed locally)
lychee --accept 200,429 content/**/*.md
```

**Test Case 2: PR preview**

- PR will trigger the link checker workflow on preview build
- Verify workflow passes in GitHub Actions

### Regression Testing

- Verify no other links in talks.md were accidentally modified
- Check that the three replaced talks still display correctly on the site

## Success Criteria

- [ ] All three skillsmatter.com links replaced with working alternatives
- [ ] `content/talks.md` has no other modifications
- [ ] Pre-commit hooks pass
- [ ] Archive.org links return HTTP 200
- [ ] Link checker workflow passes on the PR
- [ ] Issue #218 closed after merge

## Files Modified

1. `content/talks.md` - Replace 3 broken skillsmatter.com links with archive.org
   URLs

## Related Issues and Tasks

### Related

- #205 - Broken links detected in content files (Jan 2025)
- #209 - Broken links detected in talks.md (Feb 2026)

### Closes

- #218 - Broken links detected in talks.md

## References

- [GitHub Issue #218](https://github.com/denhamparry/website/issues/218)
- [Workflow Run](https://github.com/denhamparry/website/actions/runs/22532369829)
- [Wayback Machine](https://web.archive.org/)

## Notes

### Key Insights

- SkillsMatter went into administration; all skillsmatter.com URLs are broken
- The existing `.lychee.toml` only accepts 200 and 429 - 403 always fails
- BSides London 2021 entry already uses `web.archive.org` as a precedent
- The `#skillscasts` and `#program` fragment identifiers may not work in
  archive.org URLs - use the base URL without fragments

### Alternative Approaches Considered

1. **Add skillsmatter.com to lychee exclusions** - Not chosen because the links
   are genuinely broken and users would hit dead links ❌
2. **Remove links entirely** - Not chosen as archive.org preserves historical
   context ✅ (preferred when archive exists)
3. **Replace with archive.org links** - Chosen: stable, returns 200, preserves
   history ✅
