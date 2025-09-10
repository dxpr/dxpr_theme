#!/bin/bash

echo "\$COMPOSER_HOME: $COMPOSER_HOME"

# Allow the plugin installer
composer global config --no-plugins allow-plugins.dealerdirect/phpcodesniffer-composer-installer true

# Install Drupal coding standards
composer global require drupal/coder

# Install PHP compatibility checker
composer global require phpcompatibility/php-compatibility

export PATH="$PATH:$COMPOSER_HOME/vendor/bin"

# Install PHPCS plugin installer
composer global require dealerdirect/phpcodesniffer-composer-installer

# Note: The installed_paths are automatically set by the dealerdirect plugin installer
# We don't need to manually set them as it can cause conflicts

composer global show -P
phpcs -i

# Configure PHPCS settings
phpcs --config-set colors 1
phpcs --config-set ignore_warnings_on_exit 1
phpcs --config-set drupal_core_version 11

phpcs --config-show
