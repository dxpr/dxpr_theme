<?php

/**
 * @file
 */

/**
 * Implements template_preprocess_html().
 */
function dxpr_theme_preprocess_html(&$vars) {
  global $theme;
  // If bootstrap basetheme is not loading bootstrap from CDN load it locally
  // This is default behavior starting from DXPR Theme 8.x-1.1.3 and 7.x-2.7.3.
  $bootstrap_cdn = theme_get_setting('cdn_provider');
  if (!$bootstrap_cdn) {
    $path = drupal_get_path('theme', 'dxpr_theme');
    drupal_add_js(
      $path . '/vendor/bootstrap3/js/bootstrap.min.js', array(
        'group' => JS_THEME,
        'every_page' => TRUE,
        'weight' => -18,
      ));
    drupal_add_css(
      $path . '/vendor/bootstrap3/css/bootstrap.min.css', array(
        'group' => CSS_DEFAULT,
        'media' => 'all',
        'every_page' => TRUE,
        'weight' => -18,
      ));
  }
  // Load DXPR Theme Settings CSS File.
  $files_path = variable_get('file_public_path', conf_path() . '/files');
  if (is_file($files_path . '/dxpr-theme-themesettings-' . $theme . '.css')) {
    drupal_add_css(
      $files_path . '/dxpr-theme-themesettings-' . $theme . '.css', array(
        'group' => CSS_THEME,
        'weight' => 100,
      )
    );
  }

  // Add body class for core toolbar to help with header spacing.
  if (module_exists('admin_menu_toolbar') && user_access('access administration menu')) {
    $vars['classes_array'][] = 'admin-menu-toolbar';
  }
  // Load DXPR Theme Page Settings Overrides
  // We abort on finding arg(2) to avoid using fancy headers on /edit and /devel etc.
  if ((arg(0) == 'node') && is_numeric(arg(1)) && !arg(2)) {
    $node = node_load(arg(1));
    if (isset($node->field_dxpr_theme_content_design)
      && !empty($node->field_dxpr_theme_content_design)
      && (!empty($node->field_dxpr_theme_content_design[0]) or !empty($node->field_dxpr_theme_content_design['und']))
      && module_exists('field_collection')) {
      $field_array = array(
        'field_dxpr_theme_header_mode',
        'field_dxpr_theme_header_position',
        'field_dxpr_theme_header_style',
        'field_dxpr_theme_hide_regions',
      );
      // @see render_dxpr_theme_content_css.inc node_load
      if (isset($node->field_dxpr_theme_content_design['und']) && isset($node->field_dxpr_theme_content_design['und'][0])) {
        $entity_id = $node->field_dxpr_theme_content_design['und'][0]['value'];
      }
      elseif (isset($node->field_dxpr_theme_content_design[0])) {
        $entity_id = $node->field_dxpr_theme_content_design[0]['value'];
      }
      $content_design = dxpr_theme_rows_from_field_collection($entity_id, $field_array);
    }
  }

  if (theme_get_setting('sticky_footer') && (theme_get_setting('boxed_layout') == FALSE)) {
    $vars['html_attributes_array']['class'] = 'html--dxpr-theme-sticky-footer';
  }

  if (!in_array('page-media-browser', $vars['classes_array'])
    && !(isset($content_design) && (in_array('header', $content_design['field_dxpr_theme_hide_regions'])))) {
    if (isset($content_design['field_dxpr_theme_header_mode'])) {
      $header_position = $content_design['field_dxpr_theme_header_mode'];
    }
    else {
      if (theme_get_setting('header_position')) {
        $header_position = 'side';
      }
      else {
        $header_position = 'top';
      }
    }

    if ($header_position == 'side') {
      // Side Header.
      $vars['classes_array'][] = 'body--dxpr-theme-header-side';
    }
    else {
      // Top Header.
      $vars['classes_array'][] = 'body--dxpr-theme-header-top';
      if (isset($content_design['field_dxpr_theme_header_style'])) {
        if ($content_design['field_dxpr_theme_header_style'] != 'overlay') {
          $vars['classes_array'][] = 'body--dxpr-theme-header-not-overlay';
          $vars['classes_array'][] = 'body--dxpr-theme-header-' . $content_design['field_dxpr_theme_header_style'];
        }
        else {
          $vars['classes_array'][] = 'body--dxpr-theme-header-' . $content_design['field_dxpr_theme_header_style'];
        }
      }
      else {
        if (theme_get_setting('header_style') != 'overlay') {
          $vars['classes_array'][] = 'body--dxpr-theme-header-not-overlay';
          $vars['classes_array'][] = 'body--dxpr-theme-header-' . theme_get_setting('header_style');
        }
        else {
          $vars['classes_array'][] = 'body--dxpr-theme-header-' . theme_get_setting('header_style');
        }
      }
      if (isset($content_design['field_dxpr_theme_header_position'])) {

      }
      else {
        if (theme_get_setting('header_top_fixed') && (!theme_get_setting('header_top_sticky'))) {
          $vars['classes_array'][] = 'body--dxpr-theme-header-fixed';
        }
      }
    }
  }

  if ($header_height = theme_get_setting('header_top_height')) {
    $vars['#attached']['js'][] = array(
      'type' => 'setting',
      'data' => array('dxpr_theme' => array('headerHeight' => $header_height)),
    );
    drupal_add_js(array('dxpr_theme' => array('headerHeight' => $header_height)), 'setting');
  }

  if ($header_scroll_offset = theme_get_setting('header_top_height_sticky_offset')) {
    $vars['#attached']['js'][] = array(
      'type' => 'setting',
      'data' => array('dxpr_theme' => array('headerOffset' => $header_scroll_offset)),
    );
    drupal_add_js(array('dxpr_theme' => array('headerOffset' => $header_scroll_offset)), 'setting');
  }

  // Fixed mobile header.
  if ($header_mobile_fixed = theme_get_setting('header_mobile_fixed')) {
    $vars['#attached']['js'][] = array(
      'type' => 'setting',
      'data' => array('dxpr_theme' => array('headerMobileFixed' => $header_mobile_fixed)),
    );
    drupal_add_js(array('dxpr_theme' => array('headerMobileFixed' => $header_mobile_fixed)), 'setting');
  }
  // Mobile header height.
  if ($header_mobile_height = theme_get_setting('header_mobile_height')) {
    $vars['#attached']['js'][] = array(
      'type' => 'setting',
      'data' => array('dxpr_theme' => array('headerMobileHeight' => $header_mobile_height)),
    );
    drupal_add_js(array('dxpr_theme' => array('headerMobileHeight' => $header_mobile_height)), 'setting');
  }

  // Second header sticky.
  if ($second_header_sticky = theme_get_setting('second_header_sticky')) {
    $vars['#attached']['js'][] = array(
      'type' => 'setting',
      'data' => array('dxpr_theme' => array('secondHeaderSticky' => $second_header_sticky)),
    );
    drupal_add_js(array('dxpr_theme' => array('secondHeaderSticky' => $second_header_sticky)), 'setting');
  }

  // Breadcrumb separator.
  if ($breadcrumbs_separator = theme_get_setting('page_title_breadcrumbs_separator')) {
    $vars['#attached']['js'][] = array(
      'type' => 'setting',
      'data' => array('dxpr_theme' => array('breadcrumbsSeparator' => $breadcrumbs_separator)),
    );
    drupal_add_js(array('dxpr_theme' => array('breadcrumbsSeparator' => $breadcrumbs_separator)), 'setting');
  }
}