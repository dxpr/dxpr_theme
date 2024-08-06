<?php

/**
 * @file
 * Post update functions for the dxpr_theme.
 */

/**
 * Migrate colors from color module to theme settings.
 */
function dxpr_theme_post_update_n1_migrate_colors() {
  /** @var \Drupal\Core\Extension\ThemeHandler $theme_handler */
  $theme_handler = \Drupal::service('theme_handler');
  $theme_list = $theme_handler->listInfo();

  // Load Color module.
  \Drupal::moduleHandler()->loadInclude('module', 'color');

  // Load callbacks.
  require_once $theme_handler
    ->getTheme('dxpr_theme')
    ->getPath() . '/dxpr_theme_callbacks.inc';

  /** @var \Drupal\Core\Extension\Extension $theme */
  foreach ($theme_list as $theme) {
    $theme_name = $theme->getName();
    if ('dxpr_theme' === ($theme->info['base theme'] ?? '') || 'dxpr_theme' === $theme_name) {

      $config = \Drupal::configFactory()
        ->getEditable($theme_name . '.settings');

      // Get color module palette.
      $color_palette = color_get_palette($theme_name);
      $config->set('color_scheme', 'custom');
      $config->set('color_palette', serialize($color_palette));

      foreach ($color_palette as $name => $clr) {
        $config->set('color_palette_' . $name, $clr);
      }

      $config->save();

      // Rebuild theme CSS.
      if (function_exists('dxpr_theme_css_cache_build')) {
        dxpr_theme_css_cache_build($theme_name);
      }
    }
  }

  // Uninstall the Color module.
  \Drupal::service('module_installer')->uninstall(['color']);

  return t('The theme color settings have been migrated, and the Color module has been uninstalled.');
}

/**
 * Update theme settings.
 */
function dxpr_theme_post_update_n2_settings_update() {
  /** @var \Drupal\Core\Extension\ThemeHandler $theme_handler */
  $theme_handler = \Drupal::service('theme_handler');
  $theme_list = $theme_handler->listInfo();

  require_once $theme_handler
      ->getTheme('dxpr_theme')
      ->getPath() . '/dxpr_theme_callbacks.inc';

  /** @var \Drupal\Core\Extension\Extension $theme */
  foreach ($theme_list as $theme) {
    $theme_name = $theme->getName();
    if ('dxpr_theme' === ($theme->info['base theme'] ?? '') || 'dxpr_theme' === $theme_name) {
      if (function_exists('dxpr_theme_css_cache_build')) {
        dxpr_theme_css_cache_build($theme_name);
      }
    }
  }

  return t('Theme settings CSS file has been updated.');
}
