<?php
/**
 * @file
 * template.php
 */

/**
 * Implements hook_preprocess_HOOK().
 */
function glazed_STARTERKIT_preprocess_page(&$variables) {
  $path = drupal_get_path('theme', 'glazed_STARTERKIT') . '/css/';
  foreach (_glazed_get_stylesheets() as $stylesheet) {
    drupal_add_css($path . $stylesheet, array('group' => CSS_THEME));
  }
}

/**
 * Override or insert variables into the page template.
 */
function glazed_STARTERKIT_process_page(&$vars) {
  // Hook into color.module.
  if (module_exists('color')) {
    _color_page_alter($vars);
  }
}
