#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "$0")/.."
test -f _site/index.html || { echo 'Run scripts/build.sh first'; exit 1; }
(cd _site && zip -qr ../ohio-cryptid-atlas-site.zip .)
echo 'Created ohio-cryptid-atlas-site.zip'
