<?php

/**
 * @file
 * Layout settings css styles.
 */

/**
 * Generate layouts theme css styles.
 *
 * @param string $theme
 *   Theme machine name.
 * @param string $css
 *   Generated css styles string.
 * @param array $palette
 *   Theme palette array.
 */
function layout_theme_settings_css($theme, &$css, array $palette) {
  if (theme_get_setting('boxed_layout', $theme) && ($cnt_bg = theme_get_setting('boxed_layout_boxbg', $theme))) {
    $css .= ".dxpr-theme-boxed-container { background: $cnt_bg; }\n\n";
    $css .= ".dxpr-theme-boxed-container .nav-tabs >li.active a { border-bottom-color: $cnt_bg; }\n\n";
    $css .= ".dxpr-theme-boxed-container .tabs-left > .nav-tabs .active>a { border-right-color: $cnt_bg; }\n\n";
    $css .= ".dxpr-theme-boxed-container .tabs-right > .nav-tabs .active>a { border-left-color: $cnt_bg; }\n\n";
  }

  $box_width = theme_get_setting('box_max_width', $theme);
  $max_width = theme_get_setting('layout_max_width', $theme);
  $gutter_horizontal = theme_get_setting('gutter_horizontal', $theme) / 2;
  $gutter_vertical = theme_get_setting('gutter_vertical', $theme);
  $gutter_container = theme_get_setting('gutter_container', $theme);

  $css .= <<<EOT
.container {
  max-width: {$max_width}px;
  padding-left: {$gutter_container}px;
  padding-right: {$gutter_container}px;
}
.navbar-container.dxpr-theme-fluid,
.page-title-container.dxpr-theme-fluid,
.container-fluid {
  padding-left: {$gutter_horizontal}px;
  padding-right: {$gutter_horizontal}px;
}
.dxpr-theme-boxed-container {
  max-width: {$box_width}px;
}
.row {
  margin-left: -{$gutter_horizontal}px;
  margin-right: -{$gutter_horizontal}px;
}
.col-xs-1, .col-sm-1, .col-md-1, .col-lg-1, .col-xs-2, .col-sm-2, .col-md-2, .col-lg-2, .col-xs-3, .col-sm-3, .col-md-3, .col-lg-3, .col-xs-4, .col-sm-4, .col-md-4, .col-lg-4, .col-xs-5, .col-sm-5, .col-md-5, .col-lg-5, .col-xs-6, .col-sm-6, .col-md-6, .col-lg-6, .col-xs-7, .col-sm-7, .col-md-7, .col-lg-7, .col-xs-8, .col-sm-8, .col-md-8, .col-lg-8, .col-xs-9, .col-sm-9, .col-md-9, .col-lg-9, .col-xs-10, .col-sm-10, .col-md-10, .col-lg-10, .col-xs-11, .col-sm-11, .col-md-11, .col-lg-11, .col-xs-12, .col-sm-12, .col-md-12, .col-lg-12 {
  padding-left: {$gutter_horizontal}px;
  padding-right: {$gutter_horizontal}px;
  margin-bottom: {$gutter_vertical}px;
}
.region-sidebar-first .block,
.region-sidebar-second .block,
.dxpr-theme-util-gutter-bottom {
  margin-bottom: {$gutter_vertical}px;
}
.page-title-full-width-container {
  margin-bottom: {$gutter_vertical}px;
}

EOT;

  $gutter_horizontal = theme_get_setting('gutter_horizontal_mobile', $theme) / 2;
  $gutter_vertical = theme_get_setting('gutter_vertical_mobile', $theme) / 2;
  $gutter_container = theme_get_setting('gutter_container_mobile', $theme);

  $css .= <<<EOT
@media screen and (max-width: 1200px) {
  .container {
    padding-left: {$gutter_horizontal}px;
    padding-right: {$gutter_horizontal}px;
  }
  .navbar-container.dxpr-theme-fluid,
  .page-title-container.dxpr-theme-fluid,
  .container-fluid {
    padding-left: {$gutter_horizontal}px;
    padding-right: {$gutter_horizontal}px;
  }
  .row {
    margin-left: -{$gutter_horizontal}px;
    margin-right: -{$gutter_horizontal}px;
  }
  .col-xs-1, .col-sm-1, .col-md-1, .col-lg-1, .col-xs-2, .col-sm-2, .col-md-2, .col-lg-2, .col-xs-3, .col-sm-3, .col-md-3, .col-lg-3, .col-xs-4, .col-sm-4, .col-md-4, .col-lg-4, .col-xs-5, .col-sm-5, .col-md-5, .col-lg-5, .col-xs-6, .col-sm-6, .col-md-6, .col-lg-6, .col-xs-7, .col-sm-7, .col-md-7, .col-lg-7, .col-xs-8, .col-sm-8, .col-md-8, .col-lg-8, .col-xs-9, .col-sm-9, .col-md-9, .col-lg-9, .col-xs-10, .col-sm-10, .col-md-10, .col-lg-10, .col-xs-11, .col-sm-11, .col-md-11, .col-lg-11, .col-xs-12, .col-sm-12, .col-md-12, .col-lg-12 {
    padding-left: {$gutter_horizontal}px;
    padding-right: {$gutter_horizontal}px;
  }
}

EOT;

  if ($position = theme_get_setting('background_image_position')) {
    $position = str_replace('_', ' ', $position);
    $css .= "body { background-position: $position; }\n\n";
  }

  if ($mode = theme_get_setting('background_image_attachment')) {
    $css .= "body { background-attachment: $mode; }\n\n";
  }

  if ($bgstyle = theme_get_setting('background_image_style')) {
    switch ($bgstyle) {
      case 'no_repeat':
        $css .= "body { background-size: auto;background-repeat: no-repeat; }\n\n";
        break;

      case 'repeat':
        $css .= "body { background-size: auto; }\n\n";
        break;

      case 'contain':
        $css .= "body { background-size: contain; }\n\n";
        break;
    }
  }

  if ($background_image_path = theme_get_setting('background_image_path', $theme)) {
    $css .= "body { background-image: url('" . \Drupal::service('file_url_generator')->generateString($background_image_path) . "'); }\n\n";
  }
}
