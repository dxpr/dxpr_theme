#!/bin/bash

set -euxo pipefail

rm -rf .build-done || true

[ ! -f "$NPM_INSTALL_STAMP" ] && { npm install; npm rebuild node-sass; touch "$NPM_INSTALL_STAMP"; }

npx grunt babel
npx grunt terser
npx grunt sass
npx grunt postcss

touch .build-done


if [ "$WATCH" = 'true' ]; then
  npx grunt watch
fi
