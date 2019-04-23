#!/usr/bin/env bash
set -eo pipefail

./bin/build.sh

gh-pages --add --dist build/
