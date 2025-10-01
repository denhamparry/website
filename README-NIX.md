# Hugo Website Development with Nix

This project uses Nix flakes for a reproducible development environment. No
Docker required!

## Quick Start

### 1. Prerequisites

- [Nix](https://nixos.org/download.html) with flakes enabled
- [direnv](https://direnv.net/) (optional but recommended)

### 2. Setup

**With direnv (recommended):**

```bash
# Allow direnv to load the environment
direnv allow

# Initialize the site (first time only)
hugo-init

# Start development server
hugo-serve
```

**Without direnv:**

```bash
# Enter development shell
nix develop

# Initialize the site (first time only)
hugo-init

# Start development server
hugo-serve
```

### 3. Development Commands

Once in the Nix environment, you have these commands available:

```bash
hugo-dev     # Show all available commands
hugo-init    # Initialize git submodules and setup (run once)
hugo-serve   # Start development server at http://localhost:1313
hugo-new    # Create new content (usage: hugo-new posts/my-post.md)
hugo-build   # Build site for production
```

## Development Workflow

### Creating New Content

```bash
# Create a new blog post
hugo-new posts/my-awesome-post.md

# Create a new page
hugo-new about.md
```

### Live Development

```bash
# Start the development server
hugo-serve

# Visit http://localhost:1313
# Changes are automatically reloaded
```

### Production Build

```bash
# Build optimized site
hugo-build

# Output goes to ./public/
```

## Environment Variants

The flake provides multiple development environments:

```bash
# Default development environment (recommended)
nix develop

# Minimal environment (just Hugo + Git)
nix develop .#minimal

# Extended environment (includes image optimization tools)
nix develop .#extended
```

## Troubleshooting

### Theme Issues

If you see template errors, ensure the theme is properly initialized:

```bash
hugo-init
```

This will:

- Initialize git submodules
- Clone PaperMod theme if submodules fail
- Verify theme installation

### Port Already in Use

If port 1313 is busy, stop any existing Hugo processes:

```bash
# Find and kill Hugo processes
pkill hugo

# Or use a different port
hugo server --port 1314
```

### Clean Start

To reset everything:

```bash
# Clean build artefacts
rm -rf public/ resources/

# Reinitialize themes
hugo-init

# Start fresh
hugo-serve
```

## Hugo Version

This environment uses Hugo from nixpkgs-unstable, which should be compatible
with the production Netlify deployment (v0.82.1+).

Check your version:

```bash
hugo version
```

## Integration with Existing Workflow

The Nix environment is designed to work alongside your existing:

- Git workflow
- Netlify deployment
- Content structure
- Configuration files

No changes needed to your Hugo site configuration!
