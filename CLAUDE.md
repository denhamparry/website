# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with
code in this repository.

## Project Overview

This is Lewis Denham-Parry's personal website built with Hugo static site
generator using the PaperMod theme. The site is deployed on Netlify at
<https://denhamparry.co.uk>.

**Version notes**: Local dev uses Hugo v0.87.0 (Dockerfile), Netlify uses
v0.82.1 (netlify.toml)

## Essential Commands

### Local Development

```bash
# Start Hugo development server (runs in Docker)
make hugo_serve         # Access at http://localhost:1313
make stop_container     # Stop running Docker containers
make git_submodules     # Update theme submodules
```

### Content Creation

```bash
# Create new blog post
hugo new posts/my-post-title.md

# Or using Docker:
make hugo_create POST="posts/my-post-title.md"
```

### Build Commands

```bash
# Production build (used by Netlify)
hugo --gc --minify

# Preview build with future posts
hugo --gc --minify --buildFuture
```

### Testing

```bash
npm test                  # Run all tests (Hugo build, functional, accessibility)
npm run test:hugo         # Test Hugo build only
npm run test:functional   # Run Jest functional tests
npm run test:accessibility # Run accessibility tests with Puppeteer
npm run test:links        # Check for broken links in public/ directory
npm run test:spell        # Run cspell spell check
```

### Linting and Quality Checks

- **Spell check**: Uses cspell with en-GB locale (config: cspell.json, custom
  words: .spelling.txt)
- **Commit messages**: Validated via conform GitHub Action (.conform.yaml) -
  must follow conventional commit format
- Both checks run automatically on pull requests

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

**Link validation notes:**

- Monthly automated checks create GitHub issues if broken links found
- Uses lychee link checker (faster than linkinator for CI)
- Checks all markdown files in content/ directory
- Retries 3 times for transient failures
- Accepts HTTP 200-299 and 429 (rate limited)
- Configuration: .lychee.toml

**Handling broken links:**

1. Review workflow logs to identify broken links
2. Check if links are permanently broken or temporarily unavailable
3. Fix or remove broken links in content files
4. Consider using archive.org for archived content
5. Close automated issue once resolved

## Architecture & Key Files

### Configuration

- **config.yaml**: Main Hugo configuration - site settings, theme, social links,
  privacy settings, Google Analytics
- **netlify.toml**: Deployment configuration - build commands, Hugo version
  (0.82.1), CORS headers, context-specific builds
- **Makefile**: Development automation - all commands use Docker for consistency
- **Dockerfile**: Development container (Ubuntu 18.04 + Hugo 0.87.0 +
  Ruby/Asciidoctor)
- **cspell.json**: Spell check configuration (en-GB, custom dictionary at
  .spelling.txt)
- **.conform.yaml**: Commit message policy (conventional commits, 72 char limit)

### Content Structure

- **/content/**: Main content directory (currently contains talks.md)
- **/static/**: Static assets - images organized by year/month, favicon,
  keybase.txt
- **/themes/PaperMod/**: Theme files (git submodule - don't edit directly)
- **/archetypes/default.md**: Template for new content (sets draft: true by
  default)
- **/tests/**: Test suite (Hugo build, functional, accessibility tests)
- **\_redirects**: Netlify redirect rules for legacy URLs

### Deployment

- **Auto-deployment**: Push to main branch triggers Netlify deployment
- **Preview deployments**: PRs get preview URLs automatically (includes future
  posts via --buildFuture)
- **Build output**: Generated in /public/ directory (gitignored)
- **GitHub Actions**: Run on PRs to validate commits (conform) and spell check
  (misspell)

## GitHub Actions Optimizations

The CI/CD workflows have been optimized to reduce costs and improve efficiency:

- **test.yml**: Runs comprehensive tests on PRs, light validation on direct
  pushes to main with path filtering (skips docs/workflow changes)
- **Lighthouse**: Runs only on PRs with content/frontend changes (content/,
  static/, themes/, layouts/, config.yaml)
- **Build artifacts**: Hugo builds shared between jobs via GitHub Actions
  artifacts to avoid redundant builds
- **Security checks**: Consolidated into test job to reduce runner overhead
- **create-issues**: Runs only on schedule (daily 5:30am), not on every push to
  main

**Key optimizations:**

1. Eliminated duplicate workflow runs when PRs merge to main
2. Hugo site built once per workflow run and shared via artifacts
3. Lighthouse conditionally runs only when content changes
4. Security header checks integrated into test job (removed standalone job)
5. Path-based filtering prevents workflows from running on documentation-only
   changes

**Cost savings:** ~40-60% reduction in GitHub Actions minutes usage

## Development Workflow

1. **Start development server**: `make hugo_serve`
2. **Create/edit content**: Files in /content/ directory
3. **Preview changes**: View at <http://localhost:1313>
4. **Commit changes**: Follow conventional commit format
5. **Push to GitHub**: Auto-deploys via Netlify

## Important Notes

- **Theme management**: PaperMod theme is a git submodule - use
  `make git_submodules` to update, never edit theme files directly
- **Docker-based development**: All `make` commands run in Docker containers for
  consistency across environments
- **Spelling**: Site uses UK English (en-GB) - add custom words to
  .spelling.txt, not cspell.json
- **Commit format**: All commits must follow conventional commit format
  (enforced by conform action)
  - Types: feat, fix, docs, style, refactor, test, chore, ci, perf, revert,
    build
  - Optional scopes: website, content, tests, ci, deps
  - Format: `type(scope): subject` (max 72 chars, lowercase, imperative)
- **Content defaults**: New posts created via `hugo new` are marked as draft by
  default
- **Privacy configuration**: Embedded content (X/Twitter, YouTube) uses
  privacy-enhanced modes
- **Node dependencies**: If package.json changes, run `npm install` to update
  test dependencies
