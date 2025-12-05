# GitHub Issue #199: Add automated link validation workflow for talks.md

**Issue:** [#199](https://github.com/denhamparry/website/issues/199) **Status:**
Open **Date:** 2025-12-05

## Problem Statement

Implement automated link validation for `content/talks.md` to catch broken links
before they impact users. Currently, the talks page contains 92 external URLs
spanning 8 years of content (2018-2025), which naturally decay over time as
external sites change or expire.

### Current Behavior

- **Manual link validation is time-intensive**: Testing all 92 links manually
  during quarterly reviews takes significant effort
- **Links decay over time**: Meetup.com events archive, conference sites shut
  down, YouTube videos go private
- **No proactive detection**: Currently only find broken links when users report
  them or during manual reviews
- **External dependency**: Many links are outside our control (event pages,
  recordings, slides)

### Expected Behavior

- Automated monthly link checking via GitHub Actions workflow
- Proactive detection of broken links before users encounter them
- GitHub issues created automatically when broken links detected
- Low overhead automation that doesn't delay PR reviews
- Manual trigger option for on-demand validation

## Current State Analysis

### Relevant Code/Config

**File:** `content/talks.md`

Current content statistics (2025-12-05):

- 1,073 lines total
- 98 talk entries (### level headers)
- 92 external URLs to validate
- 8 years of content (2018-2025)

**Existing link checking:**

From `package.json:10`:

```json
"test:links": "linkinator public --recurse --skip 'livereload.js' --skip 'googletagmanager.com'"
```

- Uses `linkinator` v5.0.0
- Requires Hugo build first (`hugo --gc --minify`)
- Only runs manually via `npm run test:links`
- Checks built site in `public/` directory
- No automated CI/CD integration

**GitHub Actions workflows:**

From `.github/workflows/test.yml:80-82`:

```yaml
- name: Run link checker
  run: npm run test:links
  continue-on-error: true # Don't fail on broken external links
```

- Link checker runs in test workflow on PRs
- Set to `continue-on-error: true` (doesn't fail builds)
- Runs on every PR (potentially slow for 92 links)
- No automated issue creation for broken links
- No scheduled monthly checks

**Related workflows:**

From `.github/workflows/create-issues-for-outdated-pages.yml:1-15`:

```yaml
name: Create issues for outdated pages
permissions:
  contents: read
  issues: write
on:
  schedule:
    - cron: "30 5 * * *" # Daily at 5:30am UTC
  workflow_dispatch:
env:
  LABELS: '["documentation", "help wanted"]'
  ASSIGNEES: '["denhamparry"]'
```

- Example of scheduled workflow with issue creation
- Uses `actions/github-script@v6` for issue creation
- Checks for existing issues before creating duplicates
- Supports dry-run mode for testing

### Related Context

- Issue #197: Recent content review of talks.md completed (2025-12-05)
- All 2025 links validated manually (4 URLs, all HTTP 200)
- Linkinator already installed and configured
- GitHub Actions optimized for cost reduction (issue #195)
- Automated issue creation pattern exists in
  create-issues-for-outdated-pages.yml

## Solution Design

### Approach

Implement a monthly automated link checker using GitHub Actions workflow with
the following design:

**1. New workflow:** `.github/workflows/link-check.yml`

- Monthly schedule: 1st of each month at midnight UTC
- Manual trigger via `workflow_dispatch`
- Uses `lychee-action` (faster and more reliable than linkinator for CI)
- Creates GitHub issue if broken links detected
- Doesn't fail builds (informational only)

**2. Why lychee over linkinator:**

- **Performance**: lychee is written in Rust (faster for 92 URLs)
- **CI-optimized**: Designed for GitHub Actions with better caching
- **Better reporting**: Detailed output with status codes and retry info
- **GitHub integration**: lychee-action handles issue creation natively

**3. Configuration strategy:**

- Check `content/**/*.md` files directly (no Hugo build required)
- Exclude known problematic domains (e.g., archived Meetup.com links)
- Retry logic for transient failures (3 retries)
- Timeout: 5 seconds per request
- Accept status codes: 200-299, 429 (rate limited but alive)

### Implementation

**File:** `.github/workflows/link-check.yml` (new)

```yaml
name: Link Checker
permissions:
  contents: read
  issues: write

on:
  schedule:
    - cron: "0 0 1 * *" # Monthly on 1st at midnight UTC
  workflow_dispatch: # Allow manual trigger

jobs:
  linkchecker:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout repository
        uses: actions/checkout@v4

      - name: Check links in content/
        uses: lycheeverse/lychee-action@v1
        with:
          args: >-
            --verbose --no-progress --max-retries 3 --timeout 5 --accept 200,429
            --exclude-path '.git' --exclude-path 'themes' 'content/**/*.md'
          fail: true # Fail job if broken links found
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}

      - name: Create issue if links broken
        if: failure()
        uses: actions/github-script@v6
        env:
          LABELS: '["documentation", "help wanted"]'
          ASSIGNEES: '["denhamparry"]'
        with:
          script: |
            const LABELS = JSON.parse(process.env.LABELS);
            const ASSIGNEES = JSON.parse(process.env.ASSIGNEES);
            const TITLE = 'Broken links detected in talks.md';

            // Check if issue already exists
            const issues = await github.rest.issues.listForRepo({
              owner: context.repo.owner,
              repo: context.repo.repo,
              state: 'open',
            });

            const existingIssue = issues.data.find(issue => issue.title === TITLE);
            if (existingIssue) {
              console.log('Issue already exists with number:', existingIssue.number);
              // Add comment to existing issue
              await github.rest.issues.createComment({
                owner: context.repo.owner,
                repo: context.repo.repo,
                issue_number: existingIssue.number,
                body: `Broken links still detected on ${new Date().toISOString().split('T')[0]}. See [workflow run](${context.payload.repository.html_url}/actions/runs/${context.runId}) for details.`
              });
            } else {
              // Create new issue
              const issue = await github.rest.issues.create({
                owner: context.repo.owner,
                repo: context.repo.repo,
                title: TITLE,
                body: `## Automated Link Validation Failure\n\nBroken links detected during monthly validation check.\n\n**Workflow Run:** [View Details](${context.payload.repository.html_url}/actions/runs/${context.runId})\n\n**Date:** ${new Date().toISOString().split('T')[0]}\n\n### Action Required\n\n1. Review the workflow run logs to identify broken links\n2. Check if links are permanently broken or temporarily unavailable\n3. Fix or remove broken links in content/talks.md\n4. Consider using archive.org for important archived content\n5. Close this issue once links are fixed\n\n### Common Link Issues\n\n- Meetup.com events archived/expired\n- YouTube videos set to private/unlisted\n- Conference websites taken down\n- Domain name expired\n\n*This issue was automatically created by the Link Checker workflow.*`,
                labels: LABELS,
                assignees: ASSIGNEES
              });
              console.log('Issue created with number:', issue.data.number);
            }
```

**File:** `CLAUDE.md` (documentation update)

Add to "Essential Commands" section:

````markdown
### Link Validation

```bash
# Manual link check (requires Hugo build)
hugo --gc --minify
npm run test:links

# Automated monthly check (GitHub Actions)
# Workflow: .github/workflows/link-check.yml
# Schedule: 1st of each month at midnight UTC
# Manual trigger: Actions tab → Link Checker → Run workflow
```
````

**Link validation notes:**

- Monthly automated checks create GitHub issues if broken links found
- Uses lychee link checker (faster than linkinator for CI)
- Checks all markdown files in content/ directory
- Retries 3 times for transient failures
- Accepts HTTP 200-299 and 429 (rate limited)

````

### Rationale

**Why monthly schedule?**
- Weekly too frequent (creates unnecessary noise)
- Quarterly too infrequent (delays detection)
- Monthly balances proactive detection with CI cost
- Aligns with other scheduled workflows (daily outdated pages check)

**Why lychee over linkinator?**
- **Performance**: Rust-based, parallel checking of 92 URLs
- **Reliability**: Better retry logic and timeout handling
- **CI integration**: Designed for GitHub Actions
- **Cost**: Faster execution = lower Actions minutes usage

**Why create issues vs failing PRs?**
- External links outside developer control
- Shouldn't block PR merges
- Provides tracking and visibility
- Async resolution (not time-critical)

### Trade-offs

**Potential noise:**
- May create issues for temporary outages or rate limiting
- *Mitigation*: Retry logic (3 attempts), accept 429 status codes

**CI cost:**
- Monthly workflow runs consume GitHub Actions minutes
- *Mitigation*: Minimal cost (~1-2 minutes per run), only once per month

**Maintenance overhead:**
- Workflow itself requires occasional updates
- *Mitigation*: Use maintained lychee-action, minimal config

**False positives:**
- Some sites may block automated checkers
- *Mitigation*: Document exclusion patterns, manual override option

### Benefits

✅ **Proactive detection**: Find broken links before users encounter them
✅ **Monthly monitoring**: Automated checks ensure content stays fresh
✅ **Low overhead**: Runs on GitHub Actions (minimal cost, ~1-2 min/month)
✅ **Issue tracking**: Automatically creates issues for investigation
✅ **Manual override**: Can trigger validation on-demand via workflow_dispatch
✅ **No PR blocking**: External link issues don't delay development
✅ **Visibility**: GitHub issues provide tracking and history

## Implementation Plan

### Step 1: Create Link Checker Workflow

**File:** `.github/workflows/link-check.yml` (new)

**Changes:**
- Create new workflow file with monthly schedule
- Configure lychee-action with retry logic and timeout
- Set up GitHub issue creation on failure
- Add workflow_dispatch for manual triggers

**Testing:**
```bash
# Create workflow file
mkdir -p .github/workflows
cat > .github/workflows/link-check.yml <<'EOF'
[workflow content from Solution Design]
EOF

# Validate workflow syntax
gh workflow view link-check.yml  # Check syntax
````

### Step 2: Test Workflow Locally (Dry Run)

**File:** `.github/workflows/link-check.yml`

**Testing approach:**

```bash
# Option 1: Install lychee locally for testing
brew install lychee  # macOS
# or
cargo install lychee  # Any platform with Rust

# Test link checking
lychee --verbose --max-retries 3 --timeout 5 --accept 200,429 'content/**/*.md'

# Option 2: Use act to test GitHub Actions locally
brew install act
act workflow_dispatch -W .github/workflows/link-check.yml
```

**Expected results:**

- All 92 links checked
- HTTP 200 responses for working links
- Broken links reported with status codes
- Execution time < 2 minutes

### Step 3: Add Configuration File (Optional)

**File:** `.lychee.toml` (new, optional)

**Purpose:** Centralize lychee configuration for reusability

**Changes:**

```toml
# Lychee link checker configuration
# Used by: .github/workflows/link-check.yml

# Request settings
max_retries = 3
timeout = 5
accept = [200, 429]

# Exclusions
exclude_path = [".git", "themes"]

# Exclude known problematic domains (add as needed)
# exclude = ["^https://www.meetup.com/.*events/.*"]

# Headers (if needed for authentication)
# headers = ["Authorization: Bearer token"]
```

**Update workflow to use config:**

```yaml
- name: Check links in content/
  uses: lycheeverse/lychee-action@v1
  with:
    args: --config .lychee.toml 'content/**/*.md'
    fail: true
```

### Step 4: Update Documentation

**File:** `CLAUDE.md:56` (after "Testing" section)

**Changes:** Add new section:

````markdown
### Link Validation

```bash
# Manual link check (requires Hugo build)
hugo --gc --minify
npm run test:links

# Automated monthly check (GitHub Actions)
# Workflow: .github/workflows/link-check.yml
# Schedule: 1st of each month at midnight UTC
# Manual trigger: Actions tab → Link Checker → Run workflow
```
````

**Link validation notes:**

- Monthly automated checks create GitHub issues if broken links found
- Uses lychee link checker (faster than linkinator for CI)
- Checks all markdown files in content/ directory
- Retries 3 times for transient failures
- Accepts HTTP 200-299 and 429 (rate limited)
- Configuration: .lychee.toml (optional)
- To exclude specific domains, update .lychee.toml

**Handling broken links:**

1. Review workflow logs to identify broken links
2. Check if links are permanently broken or temporarily unavailable
3. Fix or remove broken links in content files
4. Consider using archive.org for archived content
5. Close automated issue once resolved

````

### Step 5: Test Workflow with Manual Trigger

**Actions:**

1. Commit and push workflow file to branch
2. Trigger workflow manually:
   ```bash
   gh workflow run link-check.yml
````

3. Monitor workflow execution:
   ```bash
   gh run watch
   ```
4. Verify issue creation (if broken links found)

**Expected outcomes:**

- Workflow completes successfully
- If broken links: GitHub issue created with details
- If no broken links: No issue created
- Workflow run time < 2 minutes

### Step 6: Monitor First Monthly Run

**Date:** 2025-01-01 00:00 UTC (first scheduled run)

**Monitoring:**

```bash
# Check workflow runs
gh run list --workflow=link-check.yml

# View latest run
gh run view --workflow=link-check.yml

# Check for created issues
gh issue list --label documentation --label "help wanted"
```

**Success criteria:**

- Workflow runs on schedule
- Completes within 2 minutes
- Creates issue if broken links found
- Does not create duplicate issues

### Step 7: Optional - Update test.yml Workflow

**File:** `.github/workflows/test.yml:80-82`

**Consider removing from PR workflow** (optional):

Current:

```yaml
- name: Run link checker
  run: npm run test:links
  continue-on-error: true # Don't fail on broken external links
```

**Rationale for removal:**

- Now covered by monthly scheduled workflow
- Reduces PR CI time (92 links = ~1-2 minutes)
- External links shouldn't block PRs
- Aligns with GitHub Actions cost optimization (issue #195)

**Alternative:** Keep but reduce scope:

```yaml
- name: Run link checker (internal only)
  run: npm run test:links -- --skip '*.meetup.com' --skip '*.youtube.com'
  continue-on-error: true
```

## Testing Strategy

### Unit Testing

**Test lychee configuration:**

```bash
# Install lychee locally
brew install lychee

# Test configuration
lychee --verbose --max-retries 3 --timeout 5 'content/talks.md'

# Expected: List of all URLs checked with status codes
```

### Integration Testing

**Test Case 1: Workflow executes successfully**

1. Push workflow file to branch
2. Trigger workflow manually: `gh workflow run link-check.yml`
3. Monitor execution: `gh run watch`
4. Verify completion status

**Expected result:** Workflow completes in < 2 minutes, exit code 0 (if no
broken links)

**Test Case 2: Issue creation on broken links**

1. Temporarily break a link in talks.md (for testing)
2. Trigger workflow manually
3. Verify GitHub issue created
4. Check issue content matches template
5. Fix link and close issue

**Expected result:** Issue created with correct title, labels, assignees, and
body content

**Test Case 3: Duplicate issue prevention**

1. Create test issue with title "Broken links detected in talks.md"
2. Trigger workflow with broken links
3. Verify no duplicate issue created
4. Verify comment added to existing issue

**Expected result:** No duplicate issue, existing issue updated with new comment

**Test Case 4: Manual trigger works**

1. Navigate to Actions tab in GitHub
2. Select "Link Checker" workflow
3. Click "Run workflow"
4. Verify workflow starts and completes

**Expected result:** Workflow runs successfully via manual trigger

### Regression Testing

**Verify no impact on existing workflows:**

```bash
# Test existing link checker still works
hugo --gc --minify
npm run test:links

# Test PR workflow still passes
git checkout -b test-link-check
git push origin test-link-check
# Create PR and verify tests pass
```

**Verify GitHub Actions budget:**

- Monthly run: ~1-2 minutes
- Cost impact: Minimal (<0.5% of monthly quota)
- Compare with issue #195 optimization goals

### Acceptance Criteria

- [ ] Workflow file created at `.github/workflows/link-check.yml`
- [ ] Workflow runs on monthly schedule (1st of month)
- [ ] Manual trigger works via workflow_dispatch
- [ ] Lychee checks all markdown files in content/
- [ ] Retry logic configured (3 retries, 5s timeout)
- [ ] GitHub issue created when broken links detected
- [ ] Issue includes workflow run link and helpful context
- [ ] Duplicate issues prevented (checks existing open issues)
- [ ] Documentation updated in CLAUDE.md
- [ ] Optional: .lychee.toml configuration file created
- [ ] Manual test run successful
- [ ] No regression in existing workflows

## Success Criteria

- [x] Workflow successfully checks all markdown files in `content/`
- [ ] Monthly schedule runs reliably (verify after first run on 2026-01-01)
- [ ] Issues created with useful context (which links failed, status codes)
- [ ] Documentation updated with workflow details
- [ ] Manual trigger works via workflow_dispatch
- [ ] No duplicate issues created
- [ ] Workflow execution time < 2 minutes
- [ ] No impact on PR workflow performance
- [ ] Aligns with GitHub Actions cost optimization goals
- [ ] Issue #199 closed with implementation completion comment

## Files Modified

1. `.github/workflows/link-check.yml` - New workflow for automated link checking
2. `.lychee.toml` - Optional configuration file for lychee settings
3. `CLAUDE.md` - Document link validation workflow and usage
4. Optional: `.github/workflows/test.yml` - Consider removing link check from PR
   workflow

## Related Issues and Tasks

### Depends On

- None

### Blocks

- None

### Related

- Issue #197: Content review of talks.md (completed 2025-12-05)
- Issue #195: GitHub Actions workflow optimization for cost reduction
- Workflow: `create-issues-for-outdated-pages.yml` (pattern reference)
- Package: `linkinator` v5.0.0 (existing manual link checker)

### Enables

- Proactive broken link detection
- Reduced manual review effort for quarterly content reviews
- Pattern for other automated content quality checks
- Potential future expansion to other content files

## References

- [GitHub Issue #199](https://github.com/denhamparry/website/issues/199)
- [Lychee GitHub Action](https://github.com/lycheeverse/lychee-action)
- [Lychee Link Checker](https://github.com/lycheeverse/lychee)
- [Linkinator (existing tool)](https://github.com/JustinBeckwith/linkinator)
- [create-issues-for-outdated-pages.yml](.github/workflows/create-issues-for-outdated-pages.yml) -
  Issue creation pattern
- [test.yml](.github/workflows/test.yml) - Current link checking in PR workflow
- Content: [talks.md](content/talks.md) - 92 external URLs, 98 talks

## Notes

### Key Insights

- **Scale**: 92 external URLs across 8 years naturally decay over time
- **Pattern exists**: create-issues-for-outdated-pages.yml provides proven issue
  creation pattern
- **Cost-conscious**: Monthly schedule balances detection with Actions minutes
  usage
- **External dependencies**: Links outside developer control shouldn't block PRs
- **Tool choice matters**: lychee (Rust) significantly faster than linkinator
  (Node.js) for CI
- **Retry logic critical**: Transient failures common with external URLs (rate
  limiting, timeouts)

### Alternative Approaches Considered

1. **Real-time validation on PR** - Why not chosen ❌

   - Too slow for 92 links (adds 1-2 minutes to every PR)
   - External links shouldn't block PR merges
   - Would delay developer workflow
   - Conflicts with GitHub Actions cost optimization (issue #195)

2. **Weekly schedule** - Why not chosen ❌

   - Too frequent, would create unnecessary noise
   - Link decay is gradual, weekly overkill
   - Higher CI cost (4x more runs per month)

3. **Quarterly manual review** - Why not chosen ❌

   - Current approach, time-intensive
   - Reactive rather than proactive
   - Delays detection of broken links
   - Inconsistent execution

4. **Monthly automated check with lychee** - Why selected ✅
   - Balances proactive detection with reasonable frequency
   - Uses fast, CI-optimized tool (lychee in Rust)
   - Minimal cost (~1-2 min/month)
   - Proven issue creation pattern from existing workflow
   - Manual override for on-demand checks

### Best Practices

**Workflow design:**

- Use `continue-on-error: false` to trigger issue creation
- Check for existing issues before creating duplicates
- Include workflow run link in issue body
- Use descriptive issue title for easy filtering
- Add helpful context (common link issues, resolution steps)

**Configuration:**

- Set reasonable retry count (3) and timeout (5s)
- Accept 429 (rate limited) as non-error
- Exclude paths that don't need checking (.git, themes)
- Consider .lychee.toml for centralized config

**Monitoring:**

- First run validation critical (verify 2026-01-01)
- Review issues created for false positive patterns
- Adjust exclusions if specific domains consistently problematic
- Monitor Actions minutes usage (should be minimal)

**Link management:**

- Prioritize fixing recent/high-value broken links
- Use archive.org for important archived content
- Mark expired links as "(archived)" or "(link expired)"
- Accept that very old event links will naturally decay
- Close automated issues promptly after fixing

**Future enhancements:**

- Expand to other content files if successful
- Add link validation badge to README
- Integrate with status dashboard
- Consider link health metrics over time
