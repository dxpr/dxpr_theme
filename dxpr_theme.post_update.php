<?php

/**
 * @file
 * Post update functions for the dxpr_theme.
 */

/**
 * Migrate colors from color module to theme settings.
 */
function dxpr_theme_post_update_n1_migrate_colors() {
  /** @var Drupal\Core\Extension\ThemeHandler $theme_handler */
  $theme_handler = \Drupal::service('theme_handler');
  $theme_name = $theme_handler->getDefault();

  $config = \Drupal::configFactory()->getEditable($theme_name . '.settings');

  // Get color module palette.
  \Drupal::moduleHandler()->loadInclude('module', 'color');
  $color_palette = color_get_palette($theme_name);

  $config->set('color_scheme', 'custom');
  $config->set('color_palette', serialize($color_palette));

  foreach ($color_palette as $name => $clr) {
    $config->set('color_palette_' . $name, $clr);
  }

  $config->save();

  // Rebuild theme CSS.
  require_once $theme_handler
    ->getTheme('dxpr_theme')
    ->getPath() . '/dxpr_theme_callbacks.inc';

  if (function_exists('dxpr_theme_css_cache_build')) {
    dxpr_theme_css_cache_build($theme_name);
  }

  return t('The theme color settings have been migrated. You can now safely uninstall the Color module unless used elsewhere.');
}
