#!/bin/bash

source scripts/prepare_drupal-lint.sh

phpcs --standard=Drupal \
  --extensions=php,module,inc,install,test,profile,theme,css,info,txt,md,yml \
  --ignore=node_modules,css,glazed_builder/vendor,glazed_builder/css \
  -v \
  .

phpcs --standard=DrupalPractice \
  --extensions=php,module,inc,install,test,profile,theme,css,info,txt,md,yml \
  --ignore=node_modules,css,glazed_builder/vendor,glazed_builder/css \
  -v \
  .
