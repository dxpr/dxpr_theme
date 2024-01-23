<?php

/**
 * @file
 * DXPR Theme helper functions.
 */

use Drupal\Component\Serialization\Json;
use Drupal\Core\File\FileSystemInterface;

/**
 * Helper function returns path of css cache file.
 *
 * @param string $theme
 *   Theme machine name.
 *
 * @return string
 *   A valid path of css cache file.
 */
function _dxpr_theme_css_cache_file($theme) {
  return 'public://dxpr_theme/css/themesettings-' . $theme . '.css';
}

/**
 * Write css files for the color settings.
 *
 * @param string $theme
 *   Theme machine name.
 * phpcs:ignore
 * @deprecated This function is no longer needed. Kept for legacy reasons.
 */
function dxpr_theme_color_module_css_write($theme) {

}

/**
 * Theme CSS generator from DXPR Theme-settings.php.
 *
 * Custom theme settings might need a lot of CSS.
 * So we put it in a file for optimal performance.
 *
 * @param string $theme
 *   Theme name.
 */
function dxpr_theme_css_cache_build(string $theme) {
  $dxpr_theme_css_file = _dxpr_theme_css_cache_file($theme);
  $dir = 'public://dxpr_theme/css/';
  $dir_writable = \Drupal::service('file_system')
    ->prepareDirectory($dir, FileSystemInterface::CREATE_DIRECTORY);

  $palette = unserialize((theme_get_setting('color_palette', $theme) ?? ''), [
    'allowed_classes' => FALSE,
  ]) ?: NULL;

  // Fetch default palette.
  if (empty($palette)) {
    $path = \Drupal::service('extension.list.theme')->getPath('dxpr_theme');
    $filepath = sprintf('%s/%s/features/sooper-colors/color-settings.json', DRUPAL_ROOT, $path);

    if ($path && file_exists($filepath)) {
      $json = file_get_contents($filepath);
      $settings = Json::decode($json);
      $palette = $settings['schemes']['default']['colors'] ?? [];
    }

    if (empty($palette)) {
      \Drupal::messenger()->addWarning(t('Could not create theme styles; please resave theme settings.'));
    }
  }

  // Construct CSS file:
  $css = '';
  // Load Sooper Features CSS.
  foreach (\Drupal::service('file_system')->scanDirectory(\Drupal::service('extension.list.theme')->getPath('dxpr_theme') . '/features', '/css.inc/i') as $file) {
    require_once $file->uri;
    $function_name = basename($file->filename, '.inc');
    $function_name = str_replace('-', '_', $function_name);
    if (function_exists($function_name)) {
      $function_name($theme, $css, $palette);
    }
  }
  $file_object = \Drupal::service('file.repository')->writeData($css, $dxpr_theme_css_file, FileSystemInterface::EXISTS_REPLACE);
  if ($dir_writable && $file_object) {
    $message = t('DXPR Theme CSS file cache built for %theme', ['%theme' => $theme]);
    \Drupal::messenger()->addMessage($message);
    \Drupal::logger('dxpr_theme')->notice($message);
  }
  else {
    $message = t('Cannot write theme-settings file, please check your file system. (See status report page)');
    \Drupal::messenger()->addMessage($message, 'error');
    \Drupal::logger('dxpr_theme')->error($message);
  }

  // If the CSS & JS aggregation are enabled we need to clear the caches.
  drupal_flush_all_caches();
  \Drupal::service('asset.css.collection_optimizer')->deleteAll();
  \Drupal::service('asset.js.collection_optimizer')->deleteAll();
}

/**
 * Returns a settings value.
 *
 * @param string $key
 *   Key index in color.inc $info array.
 *
 * @return mixed
 *   Value for the given setting.
 */
function _dxpr_theme_get_const(string $key): mixed {
  $settings = &drupal_static(__FUNCTION__, []);

  if (empty($settings)) {
    $path = \Drupal::service('extension.list.theme')->getPath('dxpr_theme');
    $filepath = sprintf('%s/%s/features/sooper-settings/theme-settings.json', DRUPAL_ROOT, $path);

    if ($path && file_exists($filepath)) {
      $json = file_get_contents($filepath);
      $settings = Json::decode($json);
    }
  }

  return $settings[$key] ?? NULL;
}

/**
 * Adds the specified theme setting as a css variable for given property.
 *
 * @param string $setting
 *   Theme setting machine name.
 * @param string $property
 *   CSS property to add.
 *
 * @return false|string
 *   CSS formatted property and value for given setting, or FALSE.
 */
function _dxpr_theme_settings_add_css(string $setting, string $property): bool|string {
  if ($css_var = _dxpr_theme_setting_get_css_var($setting)) {
    return sprintf("  %s: %s;\n", $property, $css_var);
  }
  return FALSE;
}

/**
 * Returns the CSS variable corresponding to given theme setting.
 *
 * Note that this only works for theme settings and not colors.
 *
 * @param string $setting
 *   Theme setting machine name.
 *
 * @return string
 *   CSS variable, e.g. "var(--prefix-name)".
 */
function _dxpr_theme_setting_get_css_var(string $setting): string {
  if (theme_get_setting($setting)) {
    $css_var = str_replace('_', '-', $setting);
    $prefix = _dxpr_theme_get_const('cssSettingPrefix');
    return sprintf("var(%s%s)", $prefix, $css_var);
  }
  return '';
}
