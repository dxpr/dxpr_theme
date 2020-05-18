<?php

/**
 * @file
 */

/**
 * Implements template_preprocess_page().
 */
function dxpr_theme_preprocess_page(&$vars) {
  global $theme, $theme_path, $user;
  if ($hidden_regions = theme_get_setting('hidden_regions')) {
    $hidden_regions = array_filter(theme_get_setting('hidden_regions'));
  }
  else {
    $hidden_regions = array();
  }

  // Render field collection object into simple array structure
  // We abort on finding arg(2) to avoid using fancy headers on /edit and /devel etc.
  if ((arg(0) == 'node') && is_numeric(arg(1)) && !arg(2)
    && !empty($vars['node']->field_dxpr_theme_content_design)
    && isset($vars['node']->field_dxpr_theme_content_design['und'][0]['value'])
    && module_exists('field_collection')) {
    $field_array = array(
      'field_page_layout',
      'field_header_layout',
      'field_menu_hover_effect',
      'field_full_width_header',
      'field_dxpr_theme_hide_regions',
      'field_dxpr_theme_content_region',
      'field_dxpr_theme_header_mode',
      'field_dxpr_theme_header_position',
      'field_dxpr_theme_header_style',
    );
    $entity_id = $vars['node']->field_dxpr_theme_content_design['und'][0]['value'];
    $content_design = dxpr_theme_rows_from_field_collection($entity_id, $field_array);
    if (!empty($content_design['field_dxpr_theme_hide_regions'])) {
      $hidden_regions = array_merge($hidden_regions, $content_design['field_dxpr_theme_hide_regions']);
    }
  }
  if (!empty($hidden_regions)) {
    if (in_array('page_title', $hidden_regions)) {
      $vars['hide_page_title'] = TRUE;
    }
    if (in_array('header', $hidden_regions)) {
      $vars['hide_header'] = TRUE;
    }
    if (in_array('navigation', $hidden_regions)) {
      $vars['hide_navigation'] = TRUE;
    }
    foreach ($hidden_regions as $region) {
      unset($vars['page'][$region]);
    }
  }

  // Boxed / Full-width Layout.
  $vars['boxed_cnt'] = $vars['boxed_cnt_end'] = '';
  if (isset($content_design['field_page_layout'])) {
    if ($content_design['field_page_layout'] == 'boxed') {
      $vars['boxed_cnt'] = '<div class="dxpr-theme-boxed-container">';
      $vars['boxed_cnt_end'] = '</div>';
    }
  }
  elseif (theme_get_setting('boxed_layout')) {
    $vars['boxed_cnt'] = '<div class="dxpr-theme-boxed-container">';
    $vars['boxed_cnt_end'] = '</div>';
  }
  // Full width regions.
  (theme_get_setting('full_width_containers')) ? $fwc = theme_get_setting('full_width_containers') : $fwc = array(
    'cnt_footer' => 0,
    'cnt_secondary_header' => 0,
    'cnt_header_nav' => 0,
    'cnt_page_title' => 0,
    'cnt_content_top' => 0,
    'cnt_content' => 0,
    'cnt_content_bottom' => 0,
  );
  if (isset($content_design) && ($content_design['field_full_width_header'] == 'fullwidth')) {
    $fwc['cnt_header_nav'] = 1;
  }
  if (isset($content_design) && ($content_design['field_full_width_header'] == 'normal')) {
    $fwc['cnt_header_nav'] = 0;
  }
  foreach ($fwc as $key => $checked) {
    $vars["{$key}_squeeze_start"] = '<div class="row container-row"><div class="col-sm-12 container-col">';
    $vars["{$key}_squeeze_end"] = '</div></div>';
    if ($checked) {
      $vars[$key] = 'dxpr-theme-fluid';
      $vars["{$key}_squeeze_start"] = '';
      $vars["{$key}_squeeze_end"] = '';
    }
    else {
      $vars[$key] = 'container';
    }
  }
  // Full width content types.
  if (!($types = theme_get_setting('full_width_content_types'))) {
    $sitetypes = array_keys(node_type_get_types());
    $types = array();
    foreach ($sitetypes as $value) {
      if (strpos($value, 'drag_drop') !== FALSE) {
        $types[$value] = $value;
      }
    }
  }

  $vars['content_row_class'] = ' class="row"';
  $vars['content_container_class'] = ' class="container main-container clearfix"';
  if (($fwc['cnt_content'] == 1)
      or (isset($vars['node'])
      && (((array_key_exists($vars['node']->type, $types))
      && ($types[$vars['node']->type]))
      or (isset($content_design) && ($content_design['field_dxpr_theme_content_region'] == 'dxpr-theme-util-full-width-content'))))
      && empty($vars['page']['sidebar_first'])
      && empty($vars['page']['sidebar_second'])) {
    $vars['content_column_class'] = '';
    $vars['content_row_class'] = '';
    $vars['content_container_class'] = ' class="main-container clearfix"';
    $vars['cnt_page_title_full_width'] = ' dxpr-theme-no-margin';
  }
  else {
    $vars['cnt_page_title_full_width'] = '';
  }

  // Override any of the above conditions.
  if (isset($content_design)
    && isset($content_design['field_dxpr_theme_content_region'])
    && ($content_design['field_dxpr_theme_content_region'] != 'dxpr-theme-util-full-width-content')) {
    switch ($content_design['field_dxpr_theme_content_region']) {
      case 'dxpr-theme-util-content-center-4-col':
        $vars['content_column_class'] = ' class="col-md-4 col-md-offset-4"';
        break;

      case 'dxpr-theme-util-content-center-6-col':
        $vars['content_column_class'] = ' class="col-md-6 col-md-offset-3"';
        break;

      case 'dxpr-theme-util-content-center-8-col':
        $vars['content_column_class'] = ' class="col-md-8 col-md-offset-2"';
        break;

      case 'dxpr-theme-util-content-center-10-col':
        $vars['content_column_class'] = ' class="col-md-10 col-md-offset-1"';
        break;
    }
    $vars['content_row_class'] = ' class="row"';
  }

  // Page Title Hiding.
  if ((theme_get_setting('page_title_home_hide') !== 0) && $vars['is_front']) {
    $vars['title'] = '';
  }

  if ($vars['is_front'] && theme_get_setting('stlink')) {
    $vars['sooperthemes_attribution_link'] = dxpr_theme_attribution_link();
  }
  else {
    $vars['sooperthemes_attribution_link'] = '';
  }

  // DXPR Theme Header.
  $vars['dxpr_theme_header_classes'] = array('navbar', 'dxpr-theme-header');
  if (isset($content_design['field_dxpr_theme_header_mode'])) {
    $header_mode = $content_design['field_dxpr_theme_header_mode'];
  }
  else {
    if (theme_get_setting('header_position')) {
      $header_mode = 'side';
    }
    else {
      $header_mode = 'top';
    }
  }
  if ($header_mode == 'side') {
    // Side Header.
    $vars['dxpr_theme_header_classes'][] = 'dxpr-theme-header--side';
    $vars['dxpr_theme_header_classes'][] = theme_get_setting('header_side_align');
  }
  else {
    // Top Header.
    $vars['dxpr_theme_header_classes'][] = 'dxpr-theme-header--top';

    // Header Layout Logo left/center/right etc.
    if (isset($content_design['field_header_layout'])) {
      $header_layout = $content_design['field_header_layout'];
      $vars['dxpr_theme_header_classes'][] = 'dxpr-theme-header--' . drupal_html_class($header_layout);
    }
    elseif ($header_layout = theme_get_setting('header_top_layout')) {
      $vars['dxpr_theme_header_classes'][] = 'dxpr-theme-header--' . drupal_html_class($header_layout);
    }

    // Header Style Normal/Overlay/Pull-Down.
    if (isset($content_design['field_dxpr_theme_header_style'])) {
      $header_style = $content_design['field_dxpr_theme_header_style'];
      $vars['dxpr_theme_header_classes'][] = 'dxpr-theme-header--' . drupal_html_class($header_style);
    }
    elseif ($header_style = theme_get_setting('header_style')) {
      $vars['dxpr_theme_header_classes'][] = 'dxpr-theme-header--' . drupal_html_class($header_style);
    }

    // Layout Position Static/Fixed/Sticky
    // Header Style Normal/Overlay/Pull-Down.
    if (isset($content_design['field_dxpr_theme_header_position'])) {
      $vars['dxpr_theme_header_classes'][] = 'dxpr-theme-header--' . $content_design['field_dxpr_theme_header_position'];
      if ($content_design['field_dxpr_theme_header_position'] == 'sticky') {
        $scroll = theme_get_setting('header_top_height_sticky_offset');
        $vars['header_affix'] = ' data-spy="affix" data-offset-top="' . $scroll . '"';
      }
    }
    else {
      if (theme_get_setting('header_top_fixed')) {
        if (theme_get_setting('header_top_sticky')) {
          $vars['dxpr_theme_header_classes'][] = 'dxpr-theme-header--sticky';
          $scroll = theme_get_setting('header_top_height_sticky_offset');
          $vars['header_affix'] = ' data-spy="affix" data-offset-top="' . $scroll . '"';
        }
        else {
          $vars['dxpr_theme_header_classes'][] = 'dxpr-theme-header--fixed';
        }
      }

    }
  }
  if (theme_get_setting('mark_menu_with_children', $theme)) {
    $vars['menu_has_children'] = 'dxpr-theme-menu--has-children';
  }
  else {
    $vars['menu_has_children'] = '';
  }
  // Menu Hover Style.
  if (isset($content_design['field_menu_hover_effect'])) {
    $header_menu_hover_effect = $content_design['field_menu_hover_effect'];
    $vars['dxpr_theme_header_classes'][] = 'dxpr-theme-header--hover-' . drupal_html_class($header_menu_hover_effect);
  }
  elseif ($header_menu_hover_effect = theme_get_setting('menu_hover')) {
    $vars['dxpr_theme_header_classes'][] = 'dxpr-theme-header--hover-' . drupal_html_class($header_menu_hover_effect);
  }

  $vars['dxpr_theme_header_classes'] = implode(' ', $vars['dxpr_theme_header_classes']);

  // DXPR Theme Secondary Header.
  $vars['dxpr_theme_secondary_header_classes'] = array('dxpr-theme-secondary-header');
  switch (theme_get_setting('secondary_header_hide')) {
    case 'hidden_xs':
      $vars['dxpr_theme_secondary_header_classes'][] = 'hidden-xs';
      break;

    case 'hidden_sm':
      $vars['dxpr_theme_secondary_header_classes'] += array('hidden-xs', 'hidden-sm');
      break;

    case 'hidden_md':
      $vars['dxpr_theme_secondary_header_classes'] += array('hidden-xs', 'hidden-sm', 'hidden-md');
      break;
  }
  if (theme_get_setting('secondary_header_hide')) {
    $vars['dxpr_theme_secondary_header_classes'][] = drupal_html_class(theme_get_setting('secondary_header_hide'));
  }
  else {
    $vars['dxpr_theme_secondary_header_classes'][] = 'hidden-xs';
  }
  $vars['dxpr_theme_secondary_header_classes'] = implode(' ', $vars['dxpr_theme_secondary_header_classes']);

  // Page Title.
  $vars['dxpr_theme_title_classes'] = array('page-title');
  if (theme_get_setting('page_title_animate')) {
    $vars['dxpr_theme_title_classes'][] = 'animated';
    $vars['dxpr_theme_title_classes'][] = theme_get_setting('page_title_animate');
  }
  $vars['dxpr_theme_title_classes'] = implode(' ', $vars['dxpr_theme_title_classes']);

  // CSS to load on every page.
  $page_css = array(
    // Overrides.
    '/css/vendor-extensions/bootstrap-3.css',
    '/css/vendor-extensions/bootstrap-theme.css',
    // GLAZED BASE.
    '/css/base/forms.css',
    '/css/base/layout.css',
    '/css/base/page-title.css',
    '/css/base/typography.css',
    // GLAZED Components.
    '/css/components/dxpr_theme-sidebar--menu.css',
    // HELPERS.
    '/css/helpers/helper-classes.css',
  );
  if (($vars['page']['secondary_header']) || ($vars['secondary_nav'])) {
    $page_css[] = '/css/components/dxpr_theme-secondary-header.css';
  }
  if (($vars['page']['navigation']) || ($vars['primary_nav'])) {
    $page_css[] = '/css/components/dxpr_theme-header.css';
    $page_css[] = '/css/components/dxpr_theme-header--top.css';
    $page_css[] = '/css/components/dxpr_theme-header--side.css';
    $page_css[] = '/css/components/dxpr_theme-header--mobile.css';
  }
  if ($vars['page']['footer']) {
    $page_css[] = '/css/base/footer-menu.css';
  }
  if ($vars['tabs']['#secondary']) {
    // Secondary tabs use bootstrap "pager" styling.
    $page_css[] = '/css/vendor-extensions/drupal-pager.css';
  }
  foreach ($page_css as $css) {
    drupal_add_css($theme_path . $css, array('group' => CSS_THEME, 'every_page' => TRUE));
  }
  // CSS that is only relevant in backend interfaces (field, views config, node forms, etc.)
  $auth_css = array(
    '/css/vendor-extensions/jquery-ui.css',
    '/css/vendor-extensions/drupal-media-browser.css',
  );
  if ($user->uid > 0) {
    foreach ($auth_css as $css) {
      drupal_add_css($theme_path . $css, array('group' => CSS_THEME, 'every_page' => TRUE));
    }

  }
}
