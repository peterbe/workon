#!/usr/bin/env bash
set -eo pipefail

INLINE_RUNTIME_CHUNK=false REACT_APP_KINTO_URL=https://kinto.workon.app/v1 yarn run build

# ./bin/uninline_scripts.js build/index.html build/asset-manifest.json

./bin/insert_csp.js build/index.html

./bin/update_version.js > build/version.json

./bin/insert_version.js build/version.json build/index.html

./bin/move_print_css_last.js build/index.html

gh-pages --add --dist build/
