#!/bin/bash

rm -rf .build-done || true

npm install -g grunt

npm install

grunt concat
grunt uglify
grunt sass
grunt postcss

touch .build-done


if [ "$WATCH" = 'true' ]; then
  grunt watch
fi
