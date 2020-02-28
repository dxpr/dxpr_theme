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
    // Overrides
    'vendor-extensions/bootstrap-3.css',
    'vendor-extensions/bootstrap-theme.css',
    'vendor-extensions/jquery-ui.css',
    // GLAZED BASE
    'base/footer-menu.css',
    'base/forms.css',
    'base/layout.css',
    'base/page-title.css',
    'base/typography.css',
    // GLAZED Components
    'components/stpe-buttons.css',
    'components/glazed-full-screen-search.css',
    'components/glazed-header.css',
    'components/glazed-header--top.css',
    'components/glazed-header--side.css',
    'components/glazed-header--mobile.css',
    'components/glazed-secondary-header.css',
    // Overrides
    'vendor-extensions/cubeportfolio.css',
    'vendor-extensions/drupal-breadcrumbs.css',
    'vendor-extensions/drupal-comments.css',
    'vendor-extensions/drupal-media.css',
    'vendor-extensions/drupal-pager.css',
    'vendor-extensions/drupal-webform.css',
    'vendor-extensions/cms-bootstrap-core.css',
    'vendor-extensions/cms-bootstrap-blog.css',
    'vendor-extensions/cms-bootstrap-events.css',
    'vendor-extensions/cms-bootstrap-news.css',
    'vendor-extensions/cms-bootstrap-portfolio.css',
    'vendor-extensions/sooperthemes-premium-elements.css',
    'vendor-extensions/revolution-slider-4.css',
    'vendor-extensions/glazed-builder.css',
    // HELPERS
    'helpers/helper-classes.css',
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
