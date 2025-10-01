{
  description = "Hugo website development environment";

  inputs = {
    nixpkgs.url = "github:NixOS/nixpkgs/nixos-unstable";
    flake-utils.url = "github:numtide/flake-utils";
  };

  outputs = { self, nixpkgs, flake-utils }:
    flake-utils.lib.eachDefaultSystem (system:
      let
        pkgs = nixpkgs.legacyPackages.${system};

        # Pin Hugo version for consistency with Netlify deployment
        hugo = pkgs.hugo;

        # Development scripts
        dev-scripts = pkgs.writeShellScriptBin "hugo-dev" ''
          echo "🚀 Hugo Website Development Environment"
          echo ""
          echo "Available commands:"
          echo "  hugo-init     - Initialize git submodules and setup"
          echo "  hugo-serve    - Start development server"
          echo "  hugo-new     - Create new content (usage: hugo-new posts/my-post.md)"
          echo "  hugo-build    - Build site for production"
          echo ""
          echo "Hugo version: $(hugo version)"
          echo "Site will be available at: http://localhost:1313"
        '';

        hugo-init = pkgs.writeShellScriptBin "hugo-init" ''
          echo "🔧 Initializing Hugo website..."

          # Initialize git submodules for themes
          if [ -d .git ]; then
            echo "Initializing git submodules..."
            git submodule update --init --recursive
            if [ $? -eq 0 ]; then
              echo "✅ Git submodules initialized"
            else
              echo "⚠️  Git submodule initialization failed, trying alternative approach..."
              # If submodule fails, clone theme directly
              if [ ! -d "themes/PaperMod" ] || [ -z "$(ls -A themes/PaperMod)" ]; then
                echo "Cloning PaperMod theme..."
                rm -rf themes/PaperMod
                git clone https://github.com/adityatelange/hugo-PaperMod.git themes/PaperMod
                rm -rf themes/PaperMod/.git
                echo "✅ PaperMod theme installed"
              fi
            fi
          else
            echo "Not in a git repository, skipping submodule initialization"
          fi

          # Check if themes are properly installed
          if [ -d "themes/PaperMod" ] && [ -n "$(ls -A themes/PaperMod)" ]; then
            echo "✅ Theme installation verified"
          else
            echo "❌ Theme installation failed"
            exit 1
          fi

          echo ""
          echo "🎉 Setup complete! Run 'hugo-serve' to start development server"
        '';

        hugo-serve = pkgs.writeShellScriptBin "hugo-serve" ''
          echo "🚀 Starting Hugo development server..."

          # Check if themes are available
          if [ ! -d "themes/PaperMod" ] || [ -z "$(ls -A themes/PaperMod)" ]; then
            echo "❌ PaperMod theme not found. Run 'hugo-init' first."
            exit 1
          fi

          # Start Hugo server with development-friendly settings
          echo "Starting server at http://localhost:1313"
          echo "Press Ctrl+C to stop"
          echo ""

          hugo server \
            --bind 0.0.0.0 \
            --port 1313 \
            --buildDrafts \
            --buildFuture \
            --disableFastRender \
            --navigateToChanged \
            --environment development
        '';

        hugo-new = pkgs.writeShellScriptBin "hugo-new" ''
          if [ -z "$1" ]; then
            echo "Usage: hugo-new <content-path>"
            echo "Example: hugo-new posts/my-new-post.md"
            exit 1
          fi

          echo "📝 Creating new content: $1"
          hugo new "$1"

          if [ $? -eq 0 ]; then
            echo "✅ Content created successfully"
            echo "Edit: content/$1"
          else
            echo "❌ Failed to create content"
            exit 1
          fi
        '';

        hugo-build = pkgs.writeShellScriptBin "hugo-build" ''
          echo "🏗️  Building Hugo site for production..."

          # Check if themes are available
          if [ ! -d "themes/PaperMod" ] || [ -z "$(ls -A themes/PaperMod)" ]; then
            echo "❌ PaperMod theme not found. Run 'hugo-init' first."
            exit 1
          fi

          # Build with production settings (matches Netlify config)
          hugo --gc --minify

          if [ $? -eq 0 ]; then
            echo "✅ Site built successfully in ./public/"
          else
            echo "❌ Build failed"
            exit 1
          fi
        '';

      in
      {
        devShells.default = pkgs.mkShell {
          buildInputs = with pkgs; [
            # Core tools
            hugo
            git
            gnumake

            # Development scripts
            dev-scripts
            hugo-init
            hugo-serve
            hugo-new
            hugo-build

            # Nice to have for content creation
            tree
            fd
            ripgrep
          ];

          shellHook = ''
            echo "🎨 Hugo Website Development Environment"
            echo ""
            echo "📋 Quick Start:"
            echo "  1. hugo-init      # First-time setup"
            echo "  2. hugo-serve     # Start development server"
            echo ""
            echo "📚 Available Commands:"
            echo "  hugo-dev          # Show all available commands"
            echo "  hugo-init         # Initialize themes and setup"
            echo "  hugo-serve        # Start development server"
            echo "  hugo-new          # Create new content"
            echo "  hugo-build        # Build for production"
            echo ""
            echo "🔧 Hugo version: $(hugo version | head -n1)"
            echo ""

            # Auto-check if initialization is needed
            if [ ! -d "themes/PaperMod" ] || [ -z "$(ls -A themes/PaperMod 2>/dev/null)" ]; then
              echo "⚠️  Theme not initialized. Run 'hugo-init' to get started."
              echo ""
            fi
          '';
        };

        # Alternative shells for different use cases
        devShells.minimal = pkgs.mkShell {
          buildInputs = with pkgs; [ hugo git ];
          shellHook = ''
            echo "Minimal Hugo environment loaded"
            echo "Hugo version: $(hugo version | head -n1)"
          '';
        };

        devShells.extended = pkgs.mkShell {
          buildInputs = with pkgs; [
            hugo
            git
            gnumake
            nodejs_20
            imagemagick
            optipng
            jpegoptim
            dev-scripts
            hugo-init
            hugo-serve
            hugo-new
            hugo-build
          ];
          shellHook = ''
            echo "Extended Hugo environment with image optimization tools"
            echo "Hugo version: $(hugo version | head -n1)"
          '';
        };

        # Make development scripts available as packages
        packages = {
          default = dev-scripts;
          hugo-init = hugo-init;
          hugo-serve = hugo-serve;
          hugo-new = hugo-new;
          hugo-build = hugo-build;
        };
      });
}
