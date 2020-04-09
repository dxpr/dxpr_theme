#!/bin/bash

if [ -z "$TARGET_DRUPAL_CORE_VERSION" ]; then
  # default to target Drupal 7, you can override this by setting the secrets value on your github repo
  TARGET_DRUPAL_CORE_VERSION=7
fi

echo "\$COMPOSER_HOME: $COMPOSER_HOME"

composer global require drupal/coder


export PATH="$PATH:$COMPOSER_HOME/vendor/bin"

composer global require dealerdirect/phpcodesniffer-composer-installer

composer global show -P
phpcs -i


phpcs --config-set colors 1
phpcs --config-set ignore_warnings_on_exit 1
phpcs --config-set drupal_core_version $TARGET_DRUPAL_CORE_VERSION

phpcs --config-show
