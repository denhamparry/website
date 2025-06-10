# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview
This is Lewis Denham-Parry's personal website built with Hugo static site generator (v0.87.0) using the PaperMod theme. The site is deployed on Netlify at https://denhamparry.co.uk.

## Essential Commands

### Local Development
```bash
make hugo_serve         # Start Hugo development server at http://localhost:1313 (runs in Docker)
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

### Linting and Testing
Run these commands before committing:
```bash
# Check for spelling errors (via GitHub Actions)
# Commit message conformance is checked automatically
```

## Architecture & Key Files

### Configuration
- **config.yaml**: Main Hugo configuration - site settings, theme, social links, privacy settings
- **netlify.toml**: Deployment configuration - build commands, Hugo version, CORS headers
- **Makefile**: Development automation - Docker-based Hugo commands
- **Dockerfile**: Development container setup (Ubuntu 18.04 + Hugo 0.87.0 + Ruby gems)

### Content Structure
- **/content/**: Main content directory (currently contains talks.md)
- **/static/**: Static assets - images organized by year/month, favicon, keybase.txt
- **/themes/PaperMod/**: Theme files (git submodule - don't edit directly)
- **_redirects**: Netlify redirect rules for legacy URLs

### Deployment
- **Auto-deployment**: Push to main branch triggers Netlify deployment
- **Preview deployments**: PRs get preview URLs automatically
- **Build output**: Generated in /public/ directory (gitignored)

## Development Workflow

1. **Start development server**: `make hugo_serve`
2. **Create/edit content**: Files in /content/ directory
3. **Preview changes**: View at http://localhost:1313
4. **Commit changes**: Follow conventional commit format
5. **Push to GitHub**: Auto-deploys via Netlify

## Important Notes

- Theme is loaded as a git submodule - use `make git_submodules` to update
- Development uses Docker for consistency - all make commands run in containers
- Site uses UK English spelling (configured in GitHub Actions)
- Privacy-focused configuration for embedded content (Twitter, YouTube)
- Google Analytics tracking is enabled