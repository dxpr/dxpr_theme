#!/bin/bash

source scripts/prepare_drupal-lint.sh

phpcs --standard=Drupal \
  --extensions=php,module,inc,install,test,profile,theme,info,txt,md,yml \
  --ignore="node_modules,vendor" \
  -v \
  .

phpcs --standard=DrupalPractice \
  --extensions=php,module,inc,install,test,profile,theme,info,txt,md,yml \
  --ignore="node_modules,vendor" \
  -v \
  .
