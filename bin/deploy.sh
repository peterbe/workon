#!/usr/bin/env bash
set -eo pipefail

yarn run build

./bin/insert_csp.js build/index.html

./bin/update_version.js > build/version.json

gh-pages --add --dist build/
