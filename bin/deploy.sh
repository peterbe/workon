#!/usr/bin/env bash
set -eo pipefail

./bin/build.sh

rm -fr build.zip
pushd build
time zopfli -i500 index.html
time zopfli -i500 static/js/*.js
time zopfli -i500 static/css/*.css
time brotli index.html
time brotli static/js/*.js
time brotli static/css/*.css
popd
apack build.zip build

scp build.zip django@68.183.151.74:/home/django/workon/
