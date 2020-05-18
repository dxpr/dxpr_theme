<?php

/**
 * @file
 * This needs to be here because Drupal subthemes don't automaitically inherit.
 */

// Base theme theme-settings.php which contains form submit functions.
if (!function_exists('dxpr_theme_settings_form_submit')) {
  require_once DRUPAL_ROOT . '/' . drupal_get_path('theme', 'dxpr_theme') . '/theme-settings.php';
}
