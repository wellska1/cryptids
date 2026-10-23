#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "$0")/.."
bundle config set --local path vendor/bundle
bundle install
JEKYLL_ENV=production bundle exec jekyll build
printf '\nStatic site generated in _site/\n'
