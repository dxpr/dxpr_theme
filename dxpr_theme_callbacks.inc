<?php

/**
 * @file
 * DXPR Theme helper functions.
 */

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
  ]) ?: theme_get_setting('color_palette', 'dxpr_theme');

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
