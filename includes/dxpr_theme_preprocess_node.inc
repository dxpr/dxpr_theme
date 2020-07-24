<?php

/**
 * @file
 */

/**
 * Implements template_preprocess_node()
 */
function dxpr_theme_preprocess_node(&$vars) {
  global $theme, $theme_path;
  // There is a bug that makes global variable $theme_path return the base theme
  // path instead of the active theme path, hence the custom variable below.
  $theme_path_custom = drupal_get_path('theme', $theme);
  // ALL NODES
  // remove "add comment link. it's silly because the comment form will be right there in our theme".
  if (isset($vars['content']['links']['comment'])) {
    unset($vars['content']['links']['comment']);
  }
  // Hide byline on all teasers.
  if ($vars['teaser']) {
    $vars['display_submitted'] = FALSE;
  }


  // BLOG NODES.
  if ($vars['type'] == 'blog') {
    $_created_date = format_date($vars['node']->created, 'custom', 'M j, Y');
    $vars['submitted'] = '<em class="text-muted">' . $_created_date . ' ' . t('By') . ' </em> <span class="dxpr-theme-util-text-uppercase">' . check_plain(format_username($vars['node'])) . '</span>';
  }
  // NEWS NODES.
  if ($vars['type'] == 'news') {
    $vars['submitted'] = t('Posted on !datetime', array('!datetime' => format_date($vars['node']->created, 'custom', 'l, F j, Y')));
  }
  // EVENT NODES.
  if ($vars['type'] == 'event') {
    if (!empty($vars['field_event_registration']['und'][0]['registration_type'])
      && function_exists('registration_event_count')) {
      // @see registration.module ~ #646
      $entity_id = $vars['nid'];
      $entity_type = 'node';
      $settings = registration_entity_settings($entity_type, $entity_id);
      $count = registration_event_count($entity_type, $entity_id);
      $capacity = $settings['capacity'];
      if ($capacity == 0) {
        $capacity = t('No limit set');
        $available = t('No limit set');
      }
      else {
        $available = $settings['capacity'] - $count;
      }
      $vars['registration_event_count'] = '<h3 class="field-label">' . t('Spaces') . '</h3><div class="field-event-spaces">' . $capacity . '</div>';
      $vars['registration_event_capacity'] = '<h3 class="field-label">' . t('Available spaces') . '</h3><div class="field-event-spaces-available">' . $available . '</div>';
    }
  }
  // PORTFOLIO NODES.
  if (($vars['type'] == 'portfolio') && ($vars['view_mode'] == 'full')) {
    // Hide portfolio images if hide mode is selected. this is useful if you
    // want to show the images in a custom case study layout.
    $hide = FALSE;
    if (!empty($vars['field_image_display_style']) && $vars['field_image_display_style']['und'][0]['value'] == 'hide') {
      $hide = TRUE;
    }
    elseif (theme_get_setting('portfolio_images') == 'hide') {
      $hide = TRUE;
    }
    if ($hide && isset($vars['content']['group_portfolio_images']['field_portfolio_images'])) {
      hide($vars['content']['group_portfolio_images']['field_portfolio_images']);
    }
    // Load Lightbox assets if gallery grid is selected.
    $lightbox = FALSE;
    if (!empty($vars['field_image_display_style']) && $vars['field_image_display_style']['und'][0]['value'] == 'grid') {
      $lightbox = TRUE;
    }
    elseif (theme_get_setting('portfolio_images') == 'grid') {
      $lightbox = TRUE;
    }
    if ($lightbox) {
      $path = drupal_get_path('theme', 'dxpr_theme');
      drupal_add_js($path . '/vendor/ilightbox/js/jquery.requestAnimationFrame.js');
      drupal_add_js($path . '/vendor/ilightbox/js/jquery.mousewheel.js');
      drupal_add_js($path . '/vendor/ilightbox/js/ilightbox.min.js');
      drupal_add_js($path . '/js/minified/dxpr-theme-ilightbox.min.js');
      drupal_add_css($path . '/vendor/ilightbox/css/ilightbox.css');
    }
  }

  // Render node CSS.
  // Get node object
  // Somehow node_load causes $node->field_dxpr_theme_content_design['und][0]['value']
  // to move to $node->field_dxpr_theme_content_design[0]['value'] in dxpr_theme_preprocess_html.
  // @see dxpr_theme_preprocess_html.inc
  // We abort on finding arg(2) to avoid using fancy headers on /edit and /devel etc
  if ((arg(0) == 'node') && is_numeric(arg(1)) && !arg(2)) {
    // $node = node_load(arg(1));
    $node = $vars['node'];
    if (!empty($node->field_dxpr_theme_content_design)
      && isset($node->field_dxpr_theme_content_design['und'][0]['value'])
      && module_exists('field_collection')) {
      $field_array = array(
        'field_dxpr_theme_body_image',
        'field_dxpr_theme_header_image',
        'field_header_height',
        'field_dxpr_theme_header_style',
        'field_header_background',
        'field_header_text',
        'field_navbar_background',
        'field_header_block_background',
        'field_header_block_text_color',
        'field_menu_background',
        'field_menu_text_color',
        'field_menu_hover_background',
        'field_menu_hover_text_color',
        'field_dropdown_background',
        'field_dropdown_text_color',
        'field_dropdown_hover_background',
        'field_dropdown_hover_text_color',
        'field_side_header_background',
        'field_side_header_text_color',
        'field_side_header_width',
        'field_side_header_layout',
      );
      $entity_id = $node->field_dxpr_theme_content_design['und'][0]['value'];
      $content_design = dxpr_theme_rows_from_field_collection($entity_id, $field_array);

      // COLLECT CSS.
      $CSS = '';
      // BODY BACKGROUND AND PAGE TITLE BACKGROUND.
      if (isset($content_design['field_dxpr_theme_body_image'])) {
        $url = file_create_url($content_design['field_dxpr_theme_body_image']['uri']);
        $CSS .= "body { background-image: url('" . $url . "') !important; }\n\n";
      }
      if (isset($content_design['field_dxpr_theme_header_image'])) {
        $url = file_create_url($content_design['field_dxpr_theme_header_image']['uri']);
        $CSS .= ".page-title-full-width-container:after { background-image: url('" . $url . "') !important; }\n\n";
      }
      // STYLES THAT USE HEADER HEIGHT.
      if ($header_top_height = $content_design['field_header_height']) {
        $header_top_height_scroll = theme_get_setting('header_top_height_scroll');
        $CSS .= <<<EOT
.body--dxpr-theme-nav-desktop #navbar.dxpr-theme-header--top .nav > li > a,
.body--dxpr-theme-nav-desktop #navbar.dxpr-theme-header--top .wrap-branding {
  height: {$header_top_height}px;
  line-height: {$header_top_height}px;
}
.body--dxpr-theme-nav-desktop #navbar.dxpr-theme-header--top #block-dxpr-theme-helper-full-screen-search {
  height: {$header_top_height}px;
  line-height: {$header_top_height}px;
}
.body--dxpr-theme-nav-desktop #navbar.dxpr-theme-header--top.affix .nav > li > a,
.body--dxpr-theme-nav-desktop #navbar.dxpr-theme-header--top.affix .navbar-header .wrap-branding {
  height: {$header_top_height_scroll}px;
  line-height: {$header_top_height_scroll}px;
}
.body--dxpr-theme-nav-desktop #navbar.dxpr-theme-header--top.affix #block-dxpr-theme-helper-full-screen-search {
    height: {$header_top_height_scroll}px;
    line-height: {$header_top_height_scroll}px;
}
.body--dxpr-theme-nav-desktop .nav-child-fixed-width {
  top: {$header_top_height}px;
}
.body--dxpr-theme-nav-desktop #navbar.dxpr-theme-header--top.affix .nav-child-fixed-width {
  top: $header_top_height_scroll;
}

EOT;
      }
      else {
        $header_top_height = theme_get_setting('header_top_height');
      }
      if ($content_design['field_dxpr_theme_header_style'] == 'navbar_pull_down') {
        $CSS .= ".body--dxpr-theme-nav-desktop.body--dxpr-theme-header-not-overlay #navbar.dxpr-theme-header--top .col-sm-12 {\n margin-bottom: -" . ($header_top_height / 2) . "px; }\n\n";
      }
      elseif ($content_design['field_dxpr_theme_header_style']) {
        $CSS .= ".body--dxpr-theme-nav-desktop.body--dxpr-theme-header-not-overlay #navbar.dxpr-theme-header--top .col-sm-12 {\n margin-bottom: 0; }\n\n";
      }

      // CUSTOM NAVIGATION COLORS.
      if ($value = $content_design['field_header_background']) {
        $CSS .= ".html.body--dxpr-theme-nav-desktop  #navbar.dxpr-theme-header--top { background-color: $value }\n\n";
      }
      if ($value = $content_design['field_header_text']) {
        $CSS .= ".html.body--dxpr-theme-nav-desktop  .dxpr-theme-header--top,.html.body--dxpr-theme-nav-desktop .dxpr-theme-header--top a { color: $value }\n\n";
      }
      if ($value = $content_design['field_navbar_background']) {
        $CSS .= "#navbar.dxpr-theme-header--top .container-row > .col-sm-12 { background-color: $value }\n\n";
      }
      if ($value = $content_design['field_header_block_background']) {
        $CSS .= "#navbar.dxpr-theme-header--top .block { background-color: $value }\n\n";
      }
      if ($value = $content_design['field_header_block_text_color']) {
        $CSS .= "#navbar.dxpr-theme-header--top .block, #navbar.dxpr-theme-header--top .block a, #navbar.dxpr-theme-header--top .block .btn-link { color: $value }\n\n";
      }
      if ($value = $content_design['field_menu_background']) {
        $CSS .= "#navbar.dxpr-theme-header--top .menu { background-color: $value }\n\n";
      }
      if ($value = $content_design['field_menu_text_color']) {
        $CSS .= "#navbar.dxpr-theme-header--top .menu, #navbar.dxpr-theme-header--top .menu a { color: $value }\n\n";
      }
      if ($value = $content_design['field_menu_hover_background']) {
        $CSS .= ".html #navbar.dxpr-theme-header--top .menu a:hover, #navbar.dxpr-theme-header--top .menu a:focus { background-color: $value }\n\n";
      }
      if ($value = $content_design['field_menu_hover_text_color']) {
        $CSS .= ".html #navbar.dxpr-theme-header--top .menu a:hover, #navbar.dxpr-theme-header--top .menu a:focus { color: $value }\n\n";
      }
      if ($value = $content_design['field_dropdown_background']) {
        $CSS .= "#navbar.dxpr-theme-header--top .dropdown-menu { background-color: $value }\n\n";
      }
      if ($value = $content_design['field_dropdown_text_color']) {
        $CSS .= ".html #navbar.dxpr-theme-header--top .dropdown, #navbar.dxpr-theme-header--top .dropdown-menu a { color: $value }\n\n";
      }
      if ($value = $content_design['field_dropdown_hover_background']) {
        $CSS .= ".html #navbar.dxpr-theme-header--top .dropdown-menu a:hover,#navbar.dxpr-theme-header--top .dropdown-menu a:focus { background-color: $value }\n\n";
      }
      if ($value = $content_design['field_dropdown_hover_text_color']) {
        $CSS .= ".html #navbar.dxpr-theme-header--top .dropdown-menu a:hover,#navbar.dxpr-theme-header--top .dropdown-menu a:focus { color: $value }\n\n";
      }
      // SIDE HEADER.
      if ($value = $content_design['field_side_header_background']) {
        $CSS .= "#navbar.dxpr-theme-header--side .menu__level, #navbar.dxpr-theme-header--side .dxpr-theme-main-menu { background-color: $value }\n\n";
      }
      if ($value = $content_design['field_side_header_text_color']) {
        $CSS .= "#navbar.dxpr-theme-header--side .menu__level, #navbar.dxpr-theme-header--side .dxpr-theme-main-menu, #navbar.dxpr-theme-header--side a, #navbar.dxpr-theme-header--side h1, #navbar.dxpr-theme-header--side h2, #navbar.dxpr-theme-header--side h3, #navbar.dxpr-theme-header--side h4, #navbar.dxpr-theme-header--side h5, #navbar.dxpr-theme-header--side h6 { color: $value }\n\n";
      }
      if ($value = $content_design['field_side_header_width']) {
        $CSS .= "#navbar.dxpr-theme-header--side .dxpr-theme-main-menu, #navbar.dxpr-theme-header--side .menu__level, .body--dxpr-theme-nav-desktop #navbar.dxpr-theme-header--side  { width: {$value}px }\n\n";
        $CSS .= "html .body--dxpr-theme-nav-desktop.body--dxpr-theme-header-side { padding-left: {$value}px }\n\n";
      }
      drupal_add_css($CSS, array('type' => 'inline'));
    }
  }

}