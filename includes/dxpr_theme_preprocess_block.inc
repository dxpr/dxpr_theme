<?php

/**
 * @file
 */

/**
 * Implements template_preprocess_block()
 */
function dxpr_theme_preprocess_block(&$vars) {
  global $theme, $theme_path;
  // There is a bug that makes global variable $theme_path return the base theme
  // path instead of the active theme path, hence the custom variable below.
  $theme_path_custom = drupal_get_path('theme', $theme);
  if ($vars['block_html_id'] == 'block-dxpr-theme-helper-full-screen-search') {
    drupal_add_css($theme_path_custom . '/css/components/dxpr-theme-full-screen-search.css', array('group' => CSS_THEME));
    drupal_add_js($theme_path . '/js/minified/dxpr-theme-full-screen-search.min.js');
  }
  if ((theme_get_setting('block_design_regions'))
    && in_array($vars['block']->region, array_filter(theme_get_setting('block_design_regions')))) {
    if ($block_well = theme_get_setting('block_well')) {
      $vars['classes_array'][] = $block_well;
    }
    if ($title_well = theme_get_setting('title_well')) {
      $vars['title_attributes_array']['class'][] = $title_well;
    }
    if (theme_get_setting('title_sticker')) {
      $vars['title_prefix']['wrap_1']['#markup'] = '<div class="wrap-block-title">';
      $vars['title_suffix']['wrap_2']['#markup'] = '</div>';
    }
    if ((theme_get_setting('block_divider'))
      && (theme_get_setting('block_divider_thickness'))) {
      $vars['title_suffix']['hr']['#markup'] = '<hr class="block-hr">';
    }
  }
}
