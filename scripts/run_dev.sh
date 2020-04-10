#!/bin/bash

rm -rf .build-done || true

npm install -g grunt

npm install
npm rebuild node-sass

grunt terser
grunt sass
grunt postcss

touch .build-done


if [ "$WATCH" = 'true' ]; then
  grunt watch
fi
