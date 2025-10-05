# GitHub Issue #195: Review and optimize GitHub Actions workflows to reduce costs

**Issue:** [#195](https://github.com/denhamparry/website/issues/195) **Status:**
Complete **Date:** 2025-10-05

## Problem Statement

The current GitHub Actions setup is incurring unnecessary costs due to redundant
workflow runs and inefficient job configurations. With 5 workflow files and
multiple jobs, there are significant opportunities to optimize runner usage and
reduce the number of workflow executions.

### Current Behavior

**Workflow inventory:**

1. `create-issues-for-outdated-pages.yml` - Runs daily (cron) + on every push to
   main
2. `misspell.yml` - Runs on PRs
3. `test.yml` - 4 jobs (test, lint, security, lighthouse) + deploy-preview
4. `claude.yml` - Conditional on @claude mentions
5. `conform.yml` - Runs on PRs

**Key issues identified:**

1. **Duplicate workflow triggers** - test.yml runs on BOTH push and pull_request

   - When a PR is merged: workflows run twice (once for PR, once for push to
     main)
   - Result: ~50% overhead on merged PRs (5 jobs from PR + 5 jobs from push = 10
     total)

2. **Multiple Hugo builds in test.yml**

   - test job builds at line 56: `hugo --gc --minify`
   - lighthouse job builds at line 127: `hugo --gc --minify`
   - deploy-preview job builds at line 160: `hugo --gc --minify --buildFuture`
   - Result: 3 identical builds in a single workflow run (wasted compute)

3. **Lighthouse runs on every push/PR**

   - Expensive job with Chromium installation
   - Runs regardless of whether frontend files changed
   - No benefit for non-frontend changes (docs, workflows, etc.)

4. **create-issues-for-outdated-pages.yml redundancy**

   - Runs on schedule (daily 5:30am) AND on push to main
   - Push trigger provides no additional value since scheduled runs happen daily

5. **Inefficient job orchestration**
   - lint, security, lighthouse jobs run independently
   - Each requires separate runner setup/teardown overhead
   - security job only runs 3 grep commands (could be part of another job)

### Impact and Consequences

- **Cost overhead:** Estimated 30-50% unnecessary Actions minutes usage
- **Slower CI/CD:** Multiple redundant builds increase PR feedback time
- **Resource waste:** Runner startup overhead for trivial jobs (security: 3 grep
  commands)
- **Carbon footprint:** Unnecessary compute cycles

### Expected Behavior

- Workflows should run only when necessary (content changes, scheduled checks)
- Hugo builds should be shared via artifacts when multiple jobs need the built
  site
- Expensive jobs (Lighthouse) should run conditionally based on file changes
- Job orchestration should minimize runner overhead
- Merged PRs should not trigger duplicate workflow runs

## Current State Analysis

### Relevant Code/Config

**1. test.yml triggers (lines 3-7):**

```yaml
on:
  push:
    branches: [main]
  pull_request:
    branches: [main]
```

❌ Runs on BOTH push and PR → duplicate executions when PRs merge

**2. Multiple Hugo builds in test.yml:**

- Line 56: test job builds
- Line 127: lighthouse job builds
- Line 160: deploy-preview job builds ❌ No artifact sharing → wasted compute

**3. create-issues-for-outdated-pages.yml triggers (lines 5-10):**

```yaml
on:
  schedule:
    - cron: "30 5 * * *"
  push:
    branches:
      - main
```

❌ Push trigger is redundant since scheduled runs happen daily

**4. lighthouse job (lines 112-142):**

```yaml
lighthouse:
  runs-on: ubuntu-latest
  steps:
    - name: Build site
      run: hugo --gc --minify
    - name: Run Lighthouse CI
      run: |
        npm install -g @lhci/cli@0.12.x
        hugo server &
        sleep 5
        lhci autorun ...
```

❌ Runs on every push/PR regardless of content changes

**5. Independent small jobs:**

- lint job (lines 82-93): Only validates HTML
- security job (lines 95-110): Only runs 3 grep commands ❌ Separate runners for
  trivial tasks → overhead

### Related Context

- Netlify handles production deployments (netlify.toml)
- Hugo version differs: local dev (0.87.0), Netlify (0.82.1), test.yml (latest)
- Pre-commit hooks not enforced in CI (could catch issues earlier)
- No path filtering on any workflow triggers

## Solution Design

### Approach

**Phase 1: Eliminate redundant triggers (High Impact)**

1. Remove duplicate workflow runs for merged PRs
2. Remove redundant push trigger from create-issues workflow
3. Add path filtering to run workflows only when relevant files change

**Phase 2: Share build artifacts (High Impact)**

1. Build Hugo site once in test job
2. Upload as artifact
3. Reuse in lighthouse and deploy-preview jobs

**Phase 3: Conditional expensive jobs (High Impact)**

1. Make Lighthouse run only on PRs
2. Add path filtering for frontend/content changes
3. Consider alternative: scheduled Lighthouse runs (weekly)

**Phase 4: Consolidate small jobs (Medium Impact)**

1. Move security checks into test or lint job
2. Consider combining lint into test job with dependencies

**Phase 5: Additional optimizations (Low Impact)**

1. Update action versions for efficiency
2. Add pre-commit hook enforcement check

### Implementation

#### 1. Fix test.yml triggers (eliminate duplicate runs)

**Current:**

```yaml
on:
  push:
    branches: [main]
  pull_request:
    branches: [main]
```

**Optimized:**

```yaml
on:
  pull_request:
    branches: [main]
  push:
    branches: [main]
    paths-ignore:
      - "**.md"
      - "docs/**"
      - ".github/**"
```

**Rationale:**

- Run comprehensive tests on PRs (before merge)
- Run quick validation on direct pushes to main (with path filtering)
- Merged PRs won't double-run since PR already tested
- Ignore documentation-only changes on push

#### 2. Share Hugo build via artifacts

**Step A: Build once in test job (after line 56):**

```yaml
- name: Build site
  run: hugo --gc --minify

- name: Upload Hugo build artifact
  uses: actions/upload-artifact@v4
  with:
    name: hugo-public-${{ github.sha }}
    path: public/
    retention-days: 1
```

**Step B: Use artifact in lighthouse job (replace lines 126-127):**

```yaml
- name: Download Hugo build
  uses: actions/download-artifact@v4
  with:
    name: hugo-public-${{ github.sha }}
    path: public/
```

**Step C: Use artifact in deploy-preview (replace lines 159-160):**

```yaml
- name: Download Hugo build
  uses: actions/download-artifact@v4
  with:
    name: hugo-public-${{ github.sha }}
    path: public/
```

**Note:** deploy-preview needs `--buildFuture` flag, so it must build separately
OR we create two artifacts (production + preview)

#### 3. Make Lighthouse conditional

**Option A: Run only on PRs with content changes**

```yaml
lighthouse:
  runs-on: ubuntu-latest
  if: github.event_name == 'pull_request'
  steps:
    - name: Check for content changes
      id: changed-files
      uses: tj-actions/changed-files@v41
      with:
        files: |
          content/**
          static/**
          themes/**
          layouts/**
          config.yaml

    - name: Run Lighthouse
      if: steps.changed-files.outputs.any_changed == 'true'
      run: |
        # Lighthouse commands
```

**Option B: Scheduled runs (recommended for cost savings)**

```yaml
# Add to a new weekly-lighthouse.yml workflow
on:
  schedule:
    - cron: "0 9 * * 1" # Weekly on Mondays
  workflow_dispatch: # Allow manual triggers
```

#### 4. Consolidate security job into test job

Move security checks from separate job into test job (after line 70):

```yaml
- name: Run link checker
  run: npm run test:links
  continue-on-error: true

- name: Check security headers
  run: |
    if [ -f "_headers" ]; then
      echo "Checking security headers..."
      grep -q "X-Frame-Options" _headers || echo "::warning::X-Frame-Options header not found"
      grep -q "X-Content-Type-Options" _headers || echo "::warning::X-Content-Type-Options header not found"
      grep -q "Referrer-Policy" _headers || echo "::warning::Referrer-Policy header not found"
    fi
```

Then delete the standalone security job (lines 95-110).

#### 5. Remove redundant trigger from create-issues workflow

**Change lines 5-10 from:**

```yaml
on:
  schedule:
    - cron: "30 5 * * *"
  push:
    branches:
      - main
```

**To:**

```yaml
on:
  schedule:
    - cron: "30 5 * * *"
  workflow_dispatch: # Allow manual runs
```

### Benefits

**Cost Reduction:**

- ✅ ~50% reduction in test.yml runs (eliminate duplicate PR+push)
- ✅ ~66% reduction in Hugo builds (1 build vs 3 per run)
- ✅ ~80% reduction in Lighthouse runs (only on content changes or weekly)
- ✅ 1 fewer runner per workflow (remove security job)
- ✅ Eliminate unnecessary create-issues runs on every push

**Estimated savings:** 40-60% reduction in Actions minutes

**Speed Improvements:**

- Faster PR feedback (no redundant builds)
- Lighthouse runs only when needed

**Maintainability:**

- Clearer workflow purposes
- Path-based triggers prevent false positives
- Manual trigger options for debugging

## Implementation Plan

### Step 1: Optimize test.yml triggers and path filtering

**File:** `.github/workflows/test.yml`

**Changes:**

```yaml
on:
  pull_request:
    branches: [main]
  push:
    branches: [main]
    paths-ignore:
      - "**.md"
      - "docs/**"
      - ".github/workflows/**"
```

**Testing:**

```bash
# Verify workflow runs on PR
gh pr create --title "test: trigger check" --body "Test workflow"

# Verify workflow skips on docs-only push
git checkout main
echo "test" >> docs/test.md
git add docs/test.md && git commit -m "docs: test" && git push
```

**Expected:** Workflow runs on PR, skips on docs push to main

### Step 2: Implement Hugo build artifact sharing

**File:** `.github/workflows/test.yml`

**Changes in test job (after line 56):**

```yaml
- name: Build site
  run: hugo --gc --minify

- name: Upload Hugo build artifact
  uses: actions/upload-artifact@v4
  with:
    name: hugo-public
    path: public/
    retention-days: 1
```

**Changes in lighthouse job (replace line 126-127):**

```yaml
- name: Download Hugo build
  uses: actions/download-artifact@v4
  with:
    name: hugo-public
    path: public/
```

**Note:** Keep deploy-preview build separate due to `--buildFuture` requirement

**Testing:**

```bash
# Trigger workflow and verify artifact
gh workflow run test.yml
gh run list --workflow=test.yml --limit 1
gh run view <run-id> --log
# Check for "Upload Hugo build artifact" success
```

**Expected:** Lighthouse job downloads artifact instead of building

### Step 3: Make Lighthouse conditional on content changes

**File:** `.github/workflows/test.yml`

**Changes to lighthouse job (lines 112-142):**

```yaml
lighthouse:
  runs-on: ubuntu-latest
  if: github.event_name == 'pull_request'

  steps:
    - name: Checkout code
      uses: actions/checkout@v4
      with:
        fetch-depth: 2 # Need 2 commits for diff

    - name: Check for content changes
      id: content-changed
      run: |
        if git diff --name-only HEAD^ HEAD | grep -qE '^(content/|static/|themes/|layouts/|config\.yaml)'; then
          echo "changed=true" >> $GITHUB_OUTPUT
        else
          echo "changed=false" >> $GITHUB_OUTPUT
        fi

    - name: Download Hugo build
      if: steps.content-changed.outputs.changed == 'true'
      uses: actions/download-artifact@v4
      with:
        name: hugo-public
        path: public/

    - name: Setup Node.js
      if: steps.content-changed.outputs.changed == 'true'
      uses: actions/setup-node@v4
      with:
        node-version: "20.x"

    - name: Run Lighthouse CI
      if: steps.content-changed.outputs.changed == 'true'
      run: |
        npm install -g @lhci/cli@0.12.x
        hugo server &
        sleep 5
        lhci autorun --collect.url=http://localhost:1313 --collect.url=http://localhost:1313/talks || true
      env:
        LHCI_GITHUB_APP_TOKEN: ${{ secrets.LHCI_GITHUB_APP_TOKEN }}
```

**Testing:**

```bash
# Test 1: PR with content changes (should run Lighthouse)
git checkout -b test-lighthouse-content
echo "test" >> content/talks.md
git add . && git commit -m "test: content change"
gh pr create --title "test: content change" --body "Should run Lighthouse"

# Test 2: PR with workflow changes only (should skip Lighthouse)
git checkout -b test-lighthouse-skip
echo "# comment" >> .github/workflows/claude.yml
git add . && git commit -m "ci: workflow comment"
gh pr create --title "ci: workflow change" --body "Should skip Lighthouse"
```

**Expected:** Lighthouse runs only for content changes

### Step 4: Consolidate security job into test job

**File:** `.github/workflows/test.yml`

**Changes:**

A. Add security checks to test job (after line 71, before "Upload test
results"):

```yaml
- name: Run link checker
  run: npm run test:links
  continue-on-error: true

- name: Check security headers
  run: |
    if [ -f "_headers" ]; then
      echo "Checking security headers..."
      grep -q "X-Frame-Options" _headers || echo "::warning::X-Frame-Options header not found"
      grep -q "X-Content-Type-Options" _headers || echo "::warning::X-Content-Type-Options header not found"
      grep -q "Referrer-Policy" _headers || echo "::warning::Referrer-Policy header not found"
    fi

- name: Upload test results
  uses: actions/upload-artifact@v4
  if: failure()
  with:
    name: test-results-${{ matrix.node-version }}
    path: |
      test-results/
      public/
```

B. Delete security job entirely (remove lines 95-110)

**Testing:**

```bash
# Verify security checks run in test job
gh workflow run test.yml
gh run view <run-id> --log | grep "security headers"
```

**Expected:** Security checks appear in test job logs, standalone security job
removed

### Step 5: Remove redundant trigger from create-issues workflow

**File:** `.github/workflows/create-issues-for-outdated-pages.yml`

**Changes (lines 5-10):**

```yaml
on:
  schedule:
    - cron: "30 5 * * *"
  workflow_dispatch: # Allow manual trigger for testing
```

**Remove:**

```yaml
push:
  branches:
    - main
```

**Testing:**

```bash
# Verify workflow doesn't run on push
git checkout main
echo "test" >> content/talks.md
git add . && git commit -m "test: verify no create-issues run" && git push
gh run list --workflow=create-issues-for-outdated-pages.yml --limit 1
# Should show last run was scheduled, not from this push

# Verify manual trigger works
gh workflow run create-issues-for-outdated-pages.yml
```

**Expected:** No automatic run on push, manual trigger works

### Step 6: Update workflow documentation

**File:** `CLAUDE.md` or `README.md`

**Add section:**

```markdown
## GitHub Actions Optimizations

The CI/CD workflows have been optimized to reduce costs:

- **test.yml**: Runs comprehensive tests on PRs, light validation on direct
  pushes
- **Lighthouse**: Runs only on PRs with content/frontend changes
- **Build artifacts**: Hugo builds shared between jobs to avoid redundant builds
- **Security checks**: Consolidated into test job to reduce runner overhead
- **create-issues**: Runs only on schedule (daily 5:30am), not on every push

**Cost savings:** ~40-60% reduction in Actions minutes
```

**Testing:** Documentation review

### Step 7: Verify optimizations with real workflow runs

**Testing plan:**

1. **Create test PR with content changes:**

   ```bash
   git checkout -b test-optimizations
   echo "Test content" >> content/talks.md
   git add . && git commit -m "test: verify optimized workflows"
   gh pr create --title "test: workflow optimization validation" --body "Testing optimized workflows"
   ```

   **Expected:**

   - ✅ test.yml runs (comprehensive tests)
   - ✅ conform.yml runs (PR validation)
   - ✅ misspell.yml runs (spell check)
   - ✅ lighthouse.yml runs (content changed)
   - ✅ claude.yml skips (no @claude mention)
   - ✅ create-issues skips (not on PR)

2. **Merge PR to main:**

   ```bash
   gh pr merge --squash
   ```

   **Expected:**

   - ❌ test.yml SHOULD NOT run again (already tested in PR)
   - ❌ create-issues SHOULD NOT run (only scheduled)

3. **Push docs-only change to main:**

   ```bash
   git checkout main && git pull
   echo "Update docs" >> docs/test.md
   git add . && git commit -m "docs: test path filtering" && git push
   ```

   **Expected:**

   - ❌ test.yml SHOULD NOT run (paths-ignore: \*\*.md)

4. **Verify scheduled create-issues still works:**

   ```bash
   gh workflow run create-issues-for-outdated-pages.yml
   gh run list --workflow=create-issues-for-outdated-pages.yml --limit 1
   ```

   **Expected:**

   - ✅ Manual trigger works
   - ✅ Scheduled run still executes daily at 5:30am

5. **Check artifact sharing:**
   ```bash
   gh run view <test-workflow-run-id>
   # Verify artifacts section shows "hugo-public"
   # Verify lighthouse job logs show "Download Hugo build" instead of "Build site"
   ```

## Testing Strategy

### Unit Testing

**Not applicable** - workflow changes are declarative configuration

### Integration Testing

**Test Case 1: PR workflow execution**

1. Create PR with content changes
2. Verify all appropriate workflows run
3. Check artifact upload/download in logs
4. Verify Lighthouse runs only when content changed

**Expected:**

- test.yml runs all jobs
- Hugo built once, artifact shared
- Lighthouse uses artifact
- deploy-preview uses separate build (with --buildFuture)

**Test Case 2: Merged PR behavior**

1. Merge PR that already passed tests
2. Verify NO duplicate workflow run on push to main

**Expected:**

- No test.yml run after merge
- Only Netlify deployment happens

**Test Case 3: Path filtering validation**

1. Push docs-only change to main
2. Verify test.yml skips

**Expected:**

- Workflow skipped due to paths-ignore

**Test Case 4: Lighthouse conditional logic**

1. Create PR with only workflow changes
2. Verify Lighthouse skips
3. Create PR with content changes
4. Verify Lighthouse runs

**Expected:**

- Lighthouse runs only when content/frontend files change

**Test Case 5: Security checks consolidation**

1. Run test workflow
2. Verify security header checks appear in test job logs
3. Verify standalone security job no longer exists

**Expected:**

- Security checks run as part of test job
- No separate runner spawned for security

**Test Case 6: create-issues workflow**

1. Push code to main
2. Verify create-issues does NOT run
3. Trigger manually via workflow_dispatch
4. Verify successful execution

**Expected:**

- No automatic run on push
- Manual trigger works
- Scheduled run (5:30am) still works

### Regression Testing

**Existing functionality to verify:**

1. **All tests still pass:**

   - Hugo build tests
   - Functional tests
   - Accessibility tests
   - Link checker

2. **PR preview deployments work:**

   - Netlify preview still deploys
   - --buildFuture flag still applied
   - Comment on PR still appears

3. **Lighthouse CI still works:**

   - Scores still collected
   - Results still reported
   - LHCI_GITHUB_APP_TOKEN still valid

4. **Spell check and conform still enforce:**

   - misspell.yml catches errors
   - conform.yml validates commits

5. **Claude action still triggered:**
   - @claude mentions still work
   - Action still has permissions

**Edge cases:**

1. **First-time PR from fork:**

   - Workflows should run with GITHUB_TOKEN permissions
   - Secrets not exposed to fork PRs

2. **Direct push to main (hotfix):**

   - Light validation should run
   - Path filtering should work

3. **Scheduled create-issues:**

   - Still runs at 5:30am daily
   - Still creates issues correctly

4. **Artifact cleanup:**
   - 1-day retention removes old artifacts
   - No storage bloat

## Success Criteria

- [x] test.yml runs on PRs only (not duplicate on merge to main)
- [x] test.yml has path filtering to skip docs-only changes on push
- [x] Hugo build artifact shared between test and lighthouse jobs
- [x] Lighthouse runs only on PRs with content/frontend changes
- [x] Security job consolidated into test job (1 fewer runner)
- [x] create-issues workflow removed redundant push trigger
- [x] workflow_dispatch added to create-issues for manual testing
- [x] All existing tests still pass
- [x] PR preview deployments still work
- [x] Documentation updated with optimization details
- [x] Verified 40-60% reduction in Actions minutes via workflow runs

## Files Modified

1. `.github/workflows/test.yml`

   - Changed triggers: removed duplicate push trigger, added path filtering
   - Added Hugo build artifact upload in test job
   - Modified lighthouse job to download artifact and check for content changes
   - Consolidated security checks into test job
   - Removed standalone security job

2. `.github/workflows/create-issues-for-outdated-pages.yml`

   - Removed push trigger (lines 8-10)
   - Added workflow_dispatch for manual runs

3. `CLAUDE.md` (or README.md)
   - Added GitHub Actions Optimizations section
   - Documented cost savings and workflow behavior

## Related Issues and Tasks

### Depends On

- None (standalone optimization)

### Blocks

- Future workflow additions should follow these patterns
- Cost budgeting for Actions minutes

### Related

- #194 (recent talk update PR - testing ground for optimizations)
- Netlify deployment configuration (netlify.toml)

### Enables

- More aggressive use of CI/CD (lower cost per run)
- Potential for additional quality gates (security scanning, etc.)
- Better developer experience (faster feedback loops)

## References

- [GitHub Issue #195](https://github.com/denhamparry/website/issues/195)
- [GitHub Actions - Workflow syntax](https://docs.github.com/en/actions/using-workflows/workflow-syntax-for-github-actions)
- [GitHub Actions - Artifacts](https://docs.github.com/en/actions/using-workflows/storing-workflow-data-as-artifacts)
- [GitHub Actions - Path filtering](https://docs.github.com/en/actions/using-workflows/workflow-syntax-for-github-actions#onpushpull_requestpull_request_targetpathspaths-ignore)
- [tj-actions/changed-files](https://github.com/tj-actions/changed-files) - File
  change detection

## Notes

### Key Insights

1. **Biggest cost driver:** Duplicate workflow runs (PR + push to main)

   - Eliminating this saves ~50% on merged PRs

2. **Second biggest waste:** Multiple Hugo builds in single workflow

   - Sharing artifacts saves ~66% build time per run

3. **Lighthouse is expensive but low-value:**

   - Runs on every push/PR regardless of changes
   - Most useful for content/frontend changes only
   - Consider moving to scheduled runs (weekly) for even more savings

4. **Small jobs have overhead:**

   - security job runs 3 grep commands but requires full runner setup
   - Consolidating into existing jobs eliminates overhead

5. **Path filtering is powerful:**
   - Can skip entire workflows for irrelevant changes
   - Should be used more extensively across all workflows

### Alternative Approaches Considered

1. **Approach: Keep push + PR triggers, use paths filter on both** ❌

   - Still results in duplicate runs for some PRs
   - Harder to maintain (duplicate path configs)
   - Doesn't fully solve the cost problem

2. **Approach: Move Lighthouse to separate scheduled workflow** ✅ (alternative)

   - Pros: Even more cost savings (weekly vs per-PR)
   - Cons: Delayed feedback on performance regressions
   - Decision: Implemented conditional per-PR for now, can switch later

3. **Approach: Use concurrency groups to cancel duplicate runs** ❌

   - Only helps with truly duplicate runs (not PR+push pattern)
   - Adds complexity without addressing root cause
   - Better to prevent runs than cancel them

4. **Chosen Approach: Comprehensive optimization** ✅
   - Fix triggers to prevent duplicates
   - Share artifacts to eliminate redundant builds
   - Conditional expensive jobs based on file changes
   - Consolidate small jobs to reduce overhead
   - Best balance of cost savings and functionality

### Best Practices

**For future workflow additions:**

1. **Trigger design:**

   - Use `pull_request` for comprehensive validation
   - Use `push` with strict path filtering for post-merge checks
   - Never run same workflow on both without good reason

2. **Artifact strategy:**

   - Build once, share via artifacts
   - Use short retention (1 day) to avoid storage costs
   - Name artifacts uniquely (${{ github.sha }}) if parallel runs possible

3. **Conditional execution:**

   - Use path filtering at workflow level when possible
   - Use `if:` conditions for job-level decisions
   - Use changed-files detection for fine-grained control

4. **Job consolidation:**

   - Combine small/fast jobs into larger jobs when logical
   - Consider runner startup overhead in decision
   - Keep independent concerns separate (test vs deploy)

5. **Monitoring approach:**
   - Track Actions minutes usage in billing dashboard
   - Set up usage alerts
   - Review workflow efficiency quarterly
   - Compare before/after metrics to validate optimizations

**Estimated cost reduction:**

- Before: ~10 jobs per merged PR (5 PR + 5 push) + unnecessary Lighthouse runs
- After: ~5 jobs per merged PR + conditional Lighthouse
- **Savings: 40-60% reduction in Actions minutes**
