#!/bin/bash

source scripts/prepare_drupal-lint.sh

EXIT_CODE=0

# Check PHP Compatibility for PHP 8.3+
echo "Checking PHP Compatibility (PHP 8.3+)..."
phpcs --standard=PHPCompatibility \
  --runtime-set testVersion 8.3- \
  --extensions=php,module,inc,install,test,profile,theme \
  --ignore="node_modules,vendor,.github,color.inc" \
  .

status=$?
if [ $status -ne 0 ]; then
  EXIT_CODE=$status
fi

# Check Drupal coding standards (without Slevomat rules)
echo "Checking Drupal coding standards..."
phpcs --standard=/tmp/vendor/drupal/coder/coder_sniffer/Drupal \
  --extensions=php,module,inc,install,test,profile,theme,info,txt,md,yml \
  --ignore="node_modules,vendor,.github,color.inc" \
  .

status=$?
if [ $status -ne 0 ]; then
  EXIT_CODE=$status
fi

# Check Drupal best practices
echo "Checking Drupal best practices..."
phpcs --standard=DrupalPractice \
  --extensions=php,module,inc,install,test,profile,theme,info,txt,md,yml \
  --ignore="node_modules,vendor,.github,color.inc" \
  .

status=$?
if [ $status -ne 0 ]; then
  EXIT_CODE=$status
fi

# failed if one of the checks failed
exit $EXIT_CODE