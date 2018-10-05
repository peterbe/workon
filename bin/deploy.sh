#!/usr/bin/env bash
set -eo pipefail

REACT_APP_KINTO_URL=https://kinto.workon.app/v1 yarn run build

./bin/uninline_scripts.js build/index.html build/asset-manifest.json

./bin/insert_csp.js build/index.html

./bin/update_version.js > build/version.json

gh-pages --add --dist build/
