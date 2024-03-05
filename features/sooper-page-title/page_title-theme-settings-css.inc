<?php

/**
 * @file
 * Page title settings css styles.
 */

/**
 * Generate page title theme css styles.
 *
 * @param string $theme
 *   Theme machine name.
 * @param string $css
 *   Generated css styles string.
 * @param array $palette
 *   Theme palette array.
 */
function page_title_theme_settings_css($theme, &$css, array $palette) {
  $css .= "/* Page Title Styles */\n";

  if ($page_title_breadcrumb_align = theme_get_setting('page_title_breadcrumbs_align', $theme)) {
    $gutter_container = _dxpr_theme_setting_get_css_var('gutter_container');

    $page_title_bc = match ($page_title_breadcrumb_align) {
      'right'  => "  right: $gutter_container;\n  left: auto;\n",
      'left'   => "  left: $gutter_container;\n  right: auto;\n",
      'center' => "  left: 0;\n  right: 0;\n  width:100%;\n  text-align:center;\n",
    };

    if ($page_title_bc) {
      $css .= ".page-title-full-width-container .breadcrumb {\n";
      $css .= $page_title_bc;
      $css .= "}\n\n";
    }
  }

  $css .= "#page-title {\n";
  $css .= _dxpr_theme_settings_add_css('page_title_align', 'text-align');
  $css .= "}\n\n";

  /*
   * Page Title.
   */
  $title_type = theme_get_setting('title_type', $theme);

  $css .= "#page-title .page-title {\n";

  $title_type_styles = [
    'uppercase' => 'text-transform: uppercase;',
    'bold'      => 'font-weight: bold;',
    'italic'    => 'font-style: italic;',
  ];

  foreach ($title_type as $type) {
    if (isset($title_type_styles[$type])) {
      $css .= "  " . $title_type_styles[$type] . "\n";
    }
  }

  $css .= _dxpr_theme_settings_add_css('page_title_height', 'height');
  $css .= "}\n\n";

  // Page Title container.
  $css .= ".page-title-full-width-container:after {\n";
  $css .= _dxpr_theme_settings_add_css('page_title_image_opacity', 'opacity');

  if ($page_title_img_pos = _dxpr_theme_settings_add_css('page_title_image_position', 'background-position')) {
    $css .= $page_title_img_pos;
  }

  if (theme_get_setting('page_title_image_mode') == 'fixed') {
    $css .= "  background-attachment: fixed;\n";
  }

  if ($page_title_image_style = theme_get_setting('page_title_image_style')) {
    switch ($page_title_image_style) {
      case 'no_repeat':
        $css .= "  background-size: auto; background-repeat: no-repeat;\n";
        break;

      case 'repeat':
        $css .= "  background-size: auto;\n";
        break;

      case 'contain':
        $css .= "  background-size: contain;\n";
        break;
    }
  }

  if ($page_title_image_path = theme_get_setting('page_title_image_path', $theme)) {
    $css .= "  background-image: url('" . \Drupal::service('file_url_generator')->generateString($page_title_image_path) . "');\n";
  }

  $css .= "}\n\n";

}
