#!/bin/bash
set -e

# This is a Hugo site - we don't need npm dependencies for building
echo "Building Hugo site without npm dependencies..."

# Just run Hugo
hugo --gc --minify --buildFuture -b $DEPLOY_PRIME_URL