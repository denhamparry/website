# Hugo Website Development

This Hugo website now has a modern Nix-based development environment that
replaces the previous Docker setup.

## 🚀 Quick Start

### Prerequisites

- [Nix](https://nixos.org/download.html) with flakes enabled
- [direnv](https://direnv.net/) (recommended for automatic environment loading)

### Setup with direnv (Recommended)

```bash
# Allow direnv to automatically load the Nix environment
direnv allow

# Start development server (theme is already initialized)
hugo-serve
```

### Setup without direnv

```bash
# Enter the Nix development shell
nix develop

# Start development server
hugo-serve
```

Your site will be available at <http://localhost:1313> with hot reloading.

## 📋 Available Commands

Once in the Nix environment, these commands are available:

| Command      | Description                                            |
| ------------ | ------------------------------------------------------ |
| `hugo-dev`   | Show all available commands                            |
| `hugo-serve` | Start development server at <http://localhost:1313>    |
| `hugo-new`   | Create new content (e.g., `hugo-new posts/my-post.md`) |
| `hugo-build` | Build site for production                              |
| `hugo-init`  | Initialize/reinstall themes (if needed)                |

## 🛠 Development Workflow

### Daily Development

```bash
# Start the server
hugo-serve

# Create new content
hugo-new posts/my-awesome-post.md

# Edit content in your favourite editor
# Changes are automatically reloaded in browser
```

### Production Build

```bash
# Build optimized site (same as Netlify)
hugo-build

# Output is in ./public/ directory
```

## 🔧 What's Included

The Nix flake provides:

- **Hugo** (latest stable version, compatible with Netlify)
- **Git** with submodule support
- **Development scripts** for common tasks
- **Make** (for existing Makefile compatibility)
- **Search tools** (ripgrep, fd) for content discovery

## 🎯 Key Improvements

### Compared to Docker Setup

- ✅ **Faster startup** (no container overhead)
- ✅ **Automatic theme initialization**
- ✅ **Native file watching** (better hot reload)
- ✅ **Hugo version compatibility** with Netlify
- ✅ **Simplified commands** (`hugo-serve` vs `make hugo_serve`)
- ✅ **Cross-platform** (works on macOS, Linux, NixOS)

### Fixed Compatibility Issues

- ✅ Updated config for Hugo v0.124+ (pagination, privacy settings)
- ✅ Fixed missing `google_news.html` template
- ✅ Resolved `.Site.Social` deprecation warnings
- ✅ Corrected date format in content files
- ✅ Simplified OpenGraph templates

## 🔄 Migration from Docker

The old Docker-based commands still work, but the new Nix commands are
recommended:

| Old (Docker)                | New (Nix)      | Notes          |
| --------------------------- | -------------- | -------------- |
| `make hugo_serve`           | `hugo-serve`   | Faster, native |
| `make hugo_create POST=...` | `hugo-new ...` | Simpler syntax |
| `make hugo_build`           | `hugo-build`   | Same output    |

## 🐛 Troubleshooting

### Theme Issues

If you see template errors:

```bash
hugo-init  # Reinstalls PaperMod theme
```

### Port Already in Use

```bash
# Kill existing Hugo processes
pkill hugo

# Or use different port
hugo server --port 1314
```

### Environment Issues

```bash
# Exit and re-enter Nix shell
exit
nix develop

# Or with direnv
direnv reload
```

## 🌍 Environment Variants

```bash
# Default (recommended)
nix develop

# Minimal (just Hugo + Git)
nix develop .#minimal

# Extended (includes image optimization)
nix develop .#extended
```

## 📁 Project Structure

```text
.
├── flake.nix              # Nix development environment
├── .envrc                 # Direnv configuration
├── config.yaml            # Hugo configuration (updated for v0.124+)
├── content/               # Site content
├── themes/PaperMod/       # Theme (git submodule)
├── layouts/               # Template overrides for compatibility
└── static/                # Static assets
```

## 🚢 Deployment

The site deploys automatically to Netlify when you push to the main branch. The
Nix environment ensures your local development matches the production build.
