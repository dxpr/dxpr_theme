#!/bin/bash

source scripts/prepare_drupal-lint.sh

phpcbf --standard=Drupal \
  --extensions=php,module,inc,install,test,profile,theme,css,info,txt,md,yml \
  --ignore=node_modules,css,vendor \
  .

phpcbf --standard=DrupalPractice \
  --extensions=php,module,inc,install,test,profile,theme,css,info,txt,md,yml \
  --ignore=node_modules,css,vendor \
  .
