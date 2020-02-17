<?php

/**
 * @file template.php
 */

/**
 * Load template.php logic from theme features
 */

foreach (file_scan_directory(drupal_get_path('theme', 'glazed') . '/features', '/controller.inc/i') as $file) {
  require_once($file->uri);
}
/**
 * Load template.php Glazed theme functions
 */

foreach (file_scan_directory(drupal_get_path('theme', 'glazed') . '/includes', '/.inc/i') as $file) {
  require_once($file->uri);
}

function glazedNavFastInit() {
  if ($breakpoint = theme_get_setting('header_mobile_breakpoint')) {
    if ($breakpoint > 4099) {
      $breakpoint = 99999;
    }
  }
  else {
    $breakpoint = 1200;
  }
  $nav_init = <<<EOT
  <script>
  var glazedNavBreakpoint = {$breakpoint};
  var glazedWindowWidth = window.innerWidth;
  if (glazedWindowWidth > glazedNavBreakpoint) {
    document.body.className += ' body--glazed-nav-desktop';
  }
  else {
    document.body.className += ' body--glazed-nav-mobile';
  }
  </script>
EOT;
  return $nav_init;
}

/**
 * Return all styles files names.
 *
 * @return array
 *  Array of all glazed theme style files names.
 */
function _glazed_get_stylesheets() {
  return array(
    // bootstrap TAILORING
    'bootstrap-3.css',
    'bootstrap-theme.css',
    'jquery-ui.css',
    // GLAZED BASE
    'footer-menu.css',
    'forms.css',
    'layout.css',
    'page-title.css',
    'typography.css',
    // GLAZED Components
    'stpe-buttons.css',
    'glazed-full-screen-search.css',
    'glazed-header.css',
    'glazed-header--top.css',
    'glazed-header--side.css',
    'glazed-header--mobile.css',
    'glazed-secondary-header.css',
    // Overrides
    'cubeportfolio.css',
    'drupal-breadcrumbs.css',
    'drupal-comments.css',
    'drupal-media.css',
    'drupal-pager.css',
    'drupal-webform.css',
    'cms-bootstrap-core.css',
    'cms-bootstrap-blog.css',
    'cms-bootstrap-events.css',
    'cms-bootstrap-news.css',
    'cms-bootstrap-portfolio.css',
    'sooperthemes-premium-elements.css',
    'revolution-slider-4.css',
    'glazed-builder.css',
    // HELPERS
    'helper-classes.css',
  );
}

/**
 * Replace stylesheet by the colorized version.
 *
 * @param array $vars
 *  Variables array.
 */
function _glazed_color_html_alter(&$vars) {
  global $theme_key;
  $theme_path = drupal_get_path('theme', $theme_key);
  // Override stylesheets.
  $color_paths = variable_get('color_' . $theme_key . '_stylesheets', array());
  if (!empty($color_paths)) {
    $color_paths_map = array();
    foreach ($color_paths as $color_path) {
      $color_paths_map[drupal_basename($color_path)] = $color_path;
    }
    foreach ($vars['css'] as $old_path => $data) {
      if (strpos($old_path, $theme_path) === 0 && isset($color_paths_map[drupal_basename($old_path)])) {
        $vars['css'][$old_path]['data'] = $color_paths_map[drupal_basename($old_path)];
      }
    }

    $vars['styles'] = drupal_get_css($vars['css']);
  }
}
