# Setup Plan - denhamparry.co.uk Website

## Overview

This document outlines the plan for optimizing this Hugo-based personal website
repository for effective use with Claude Code.

## Current State Assessment

### ✅ Already Configured

- **CLAUDE.md**: Comprehensive project documentation with commands,
  architecture, and workflow guidelines
- **Docker Development Environment**: Consistent development via Makefile
- **Testing Infrastructure**: Jest, Puppeteer, and accessibility tests
  configured
- **Quality Checks**: cspell (en-GB), conform (conventional commits),
  markdownlint
- **CI/CD**: Netlify auto-deployment, GitHub Actions for PR validation
- **Git Conventions**: Conventional commits enforced via conform

### ⚠️ Gaps Identified

- No docs/ directory for planning documents
- No custom slash commands specific to Hugo workflows
- No MCP server integrations configured
- No GitHub Claude Code review integration

## Implementation Plan

### Phase 1: Documentation Structure

#### 1.1 Create Documentation Directory

- [x] Create `docs/` directory
- [x] Create `docs/plan.md` (this file)
- [ ] Create `docs/architecture.md` - Hugo theme integration, content structure
- [ ] Create `docs/content-guidelines.md` - Writing style, formatting standards

#### 1.2 Enhance CLAUDE.md

Current CLAUDE.md is excellent but could add:

- [ ] Section on common content patterns (talk entries, blog posts)
- [ ] Guidelines for working with Hugo shortcodes
- [ ] Notes about PaperMod theme customization limitations
- [ ] Link to docs/ directory for extended documentation

### Phase 2: Custom Slash Commands

#### 2.1 Create `.claude/commands/` Directory

- [ ] Create `.claude/commands/` in project root
- [ ] Document custom commands in CLAUDE.md

#### 2.2 Command: `/newpost`

Create workflow for new blog posts:

```markdown
---
name: newpost
description: Create and preview new blog post
---

Create a new blog post:

1. Ask for post title and slug
2. Run `make hugo_create POST="posts/{slug}.md"`
3. Open the created file
4. Update frontmatter (remove draft: true when ready)
5. Ask if preview server should be started
6. If yes, run `make hugo_serve`
7. Remind: Preview at http://localhost:1313
```

#### 2.3 Command: `/newtalk`

Create workflow for adding talk entries:

```markdown
---
name: newtalk
description: Add new talk entry to talks.md
---

Add a new talk entry:

1. Read content/talks.md to understand format
2. Ask for talk details (title, event, date, location, links)
3. Add entry in chronological order (newest first)
4. Run spell check: `npm run test:spell`
5. Preview changes with `make hugo_serve`
```

#### 2.4 Command: `/deploy-preview`

Check deployment preview:

```markdown
---
name: deploy-preview
description: View Netlify deploy preview for current branch
---

Get deployment preview URL:

1. Check current branch name
2. Run `netlify status` or check GitHub PR for preview URL
3. Remind about --buildFuture flag for preview deployments
4. Suggest running accessibility tests if making UI changes
```

### Phase 3: GitHub Integration

#### 3.1 GitHub App Setup

- [ ] Run `/install-github-app` in Claude Code session
- [ ] Create `.github/claude-code-review.yml`:

```yaml
direct_prompt: |
  Review this PR for:
  1. CLAUDE.md compliance
  2. Conventional commit format (enforced by conform)
  3. Spelling (en-GB only, check .spelling.txt)
  4. Markdown formatting
  5. Hugo frontmatter correctness
  6. Test coverage if code changes

  Be concise. Focus on actual issues.
```

### Phase 4: Quality Enhancements

#### 4.1 Testing Improvements

- [ ] Document when to run each test type in CLAUDE.md
- [ ] Add pre-commit hook that runs `npm run test:spell` automatically
- [ ] Create test script for link checking before deployment

#### 4.2 Content Validation

- [ ] Create script to validate Hugo frontmatter
- [ ] Add custom dictionary words proactively (.spelling.txt)
- [ ] Document content structure in docs/architecture.md

### Phase 5: Workflow Optimization

#### 5.1 Development Workflow

Document in CLAUDE.md under "Common Workflows":

**Adding new content:**

```bash
# 1. Create branch
git checkout -b denhamparry.co.uk/feat/new-post-title

# 2. Create content
make hugo_create POST="posts/my-post.md"

# 3. Start preview
make hugo_serve

# 4. Edit content, preview at localhost:1313

# 5. Quality checks
npm run test:spell
npm run test:accessibility

# 6. Commit with conventional format
git add content/posts/my-post.md
git commit -m "feat(content): add post about topic"
```

**Updating talks:**

```bash
# 1. Edit content/talks.md
# 2. Run spell check
npm run test:spell
# 3. Preview
make hugo_serve
# 4. Commit
git commit -m "feat(content): add talk at conference name"
```

#### 5.2 Maintenance Workflow

- [ ] Add monthly task: Update Hugo version consistency (Dockerfile vs
      netlify.toml)
- [ ] Add task: Review and prune .spelling.txt
- [ ] Add task: Update PaperMod theme (`make git_submodules`)

### Phase 6: Advanced Configuration (Optional)

#### 6.1 MCP Servers

Consider adding MCP integrations for:

- [ ] **GitHub MCP**: Enhanced PR and issue management
- [ ] **Web Search MCP**: Research topics before writing posts
- [ ] **Screenshot MCP**: Capture accessibility test results

#### 6.2 Hooks Configuration

Create hooks for:

- [ ] PreToolUse: Warn before editing theme files directly
- [ ] PostToolUse: Auto-run spell check after editing .md files
- [ ] PreCommit: Ensure draft: false before committing posts

## Success Criteria

### Must Have

- [x] CLAUDE.md exists and is comprehensive
- [ ] docs/ directory with architecture and guidelines
- [ ] At least 2 custom slash commands (newpost, newtalk)
- [ ] GitHub integration for PR reviews

### Nice to Have

- [ ] All custom commands implemented
- [ ] MCP server integrations
- [ ] Automated content validation hooks
- [ ] Extended testing documentation

## Timeline

### Week 1

- [x] Create docs/ structure
- [x] Create docs/plan.md
- [ ] Create custom slash commands
- [ ] Update CLAUDE.md with command references

### Week 2

- [ ] Set up GitHub integration
- [ ] Create docs/architecture.md
- [ ] Create docs/content-guidelines.md
- [ ] Test all workflows end-to-end

### Week 3

- [ ] Add optional MCP servers
- [ ] Configure hooks if beneficial
- [ ] Document lessons learned
- [ ] Final CLAUDE.md polish

## Notes

### Hugo-Specific Considerations

- Development uses Docker (v0.87.0), Netlify uses v0.82.1 - maintain both
- Theme is git submodule - NEVER edit theme files directly
- All content must pass en-GB spell check
- Commits must follow conventional format or CI fails

### Content Guidelines

- Posts created as drafts by default (draft: true in frontmatter)
- Remove `draft: true` before committing to publish
- Images stored in `/static/` organized by year/month
- URLs should use angle brackets in markdown for markdownlint compliance

### Testing Strategy

- Run `npm test` before major commits
- Run `npm run test:spell` after any markdown changes
- Run `npm run test:accessibility` for UI/theme changes
- Run `npm run test:links` before releases

## Next Steps

1. Create the custom slash commands in `.claude/commands/`
2. Write docs/architecture.md documenting Hugo + PaperMod structure
3. Set up GitHub integration for PR reviews
4. Test complete workflow: create post → preview → commit → PR → deploy

---

**Created:** 2025-10-01 **Status:** In Progress **Last Updated:** 2025-10-01
