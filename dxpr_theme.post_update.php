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

  if (!\Drupal::moduleHandler()->moduleExists('color')) {
    return t('The Color module is not installed.');
  }

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

      if (color_get_info($theme_name)) {
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

/**
 * Remove obsolete settings and rebuild theme CSS.
 */
function dxpr_theme_post_update_n3_settings_update() {
  /** @var \Drupal\Core\Extension\ThemeHandler $theme_handler */
  $theme_handler = \Drupal::service('theme_handler');
  $theme_list = $theme_handler->listInfo();

  require_once $theme_handler
    ->getTheme('dxpr_theme')
    ->getPath() . '/dxpr_theme_callbacks.inc';

  $obsolete_settings = [
    'header_position',
    'header_side_align',
    'header_side_width',
    'header_side_logo_height',
    'header_side_direction',
  ];

  /** @var \Drupal\Core\Extension\Extension $theme */
  foreach ($theme_list as $theme) {
    $theme_name = $theme->getName();
    if ('dxpr_theme' === ($theme->info['base theme'] ?? '') || 'dxpr_theme' === $theme_name) {
      $config = \Drupal::configFactory()
        ->getEditable($theme_name . '.settings');
      foreach ($obsolete_settings as $key) {
        $config->clear($key);
      }
      $config->save();

      if (function_exists('dxpr_theme_css_cache_build')) {
        dxpr_theme_css_cache_build($theme_name);
      }
    }
  }

  return t('Theme settings CSS file has been updated.');
}

/**
 * Migrate existing sites from "default" to "dxpr-theme-2025" color scheme.
 *
 * The default scheme changed from blue/green to monochrome. Existing sites
 * that use the old default are migrated to "dxpr-theme-2025" to preserve their look.
 */
function dxpr_theme_post_update_n4_migrate_default_scheme() {
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
      $config = \Drupal::configFactory()
        ->getEditable($theme_name . '.settings');
      $scheme = $config->get('color_scheme');

      if ($scheme === 'default' || $scheme === NULL) {
        $config->set('color_scheme', 'dxpr-theme-2025');
        $config->save();
      }

      if (function_exists('dxpr_theme_css_cache_build')) {
        dxpr_theme_css_cache_build($theme_name);
      }
    }
  }

  return t('Sites using the old default color scheme have been migrated to "dxpr-theme-2025".');
}

/**
 * Rebuild theme CSS to pick up font-weight/style cascade changes.
 *
 * The generated CSS no longer emits hardcoded font-weight and font-style
 * with !important. Existing sites keep a stale file until this runs.
 */
function dxpr_theme_post_update_n5_rebuild_font_css() {
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

  return t('Theme CSS rebuilt to apply font-weight and font-style cascade changes.');
}

/**
 * Strip script tags from the Custom JavaScript setting.
 *
 * The theme now wraps the value of Advanced > Custom JavaScript in a script
 * element itself. Values saved before that had to carry their own script tags,
 * so remove those to store the raw JavaScript the field now expects. Values
 * that load external scripts (script tags with a src attribute) are left
 * untouched because they are still rendered as they are.
 */
function dxpr_theme_post_update_n6_strip_custom_javascript_script_tags() {
  /** @var \Drupal\Core\Extension\ThemeHandler $theme_handler */
  $theme_handler = \Drupal::service('theme_handler');
  $theme_list = $theme_handler->listInfo();
  $updated = [];

  /** @var \Drupal\Core\Extension\Extension $theme */
  foreach ($theme_list as $theme) {
    $theme_name = $theme->getName();
    if ('dxpr_theme' !== ($theme->info['base theme'] ?? '') && 'dxpr_theme' !== $theme_name) {
      continue;
    }

    $config = \Drupal::configFactory()->getEditable($theme_name . '.settings');
    $custom_js = $config->get('custom_javascript_site');
    if (!is_string($custom_js) || stripos($custom_js, '<script') === FALSE) {
      continue;
    }

    // Keep values that include external scripts; they still render verbatim.
    if (preg_match('/<script\b[^>]*\bsrc\s*=/i', $custom_js)) {
      continue;
    }

    $stripped = preg_replace('/<\/?script\b[^>]*>/i', '', $custom_js);
    $stripped = trim($stripped);
    if ($stripped !== $custom_js) {
      $config->set('custom_javascript_site', $stripped)->save();
      $updated[] = $theme_name;
    }
  }

  if (!$updated) {
    return t('No Custom JavaScript settings needed updating.');
  }

  return t('Removed script tags from the Custom JavaScript setting of: @themes.', [
    '@themes' => implode(', ', $updated),
  ]);
}
