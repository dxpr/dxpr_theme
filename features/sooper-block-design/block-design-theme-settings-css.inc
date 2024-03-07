<?php

/**
 * @file
 * Block design settings css styles.
 */

/**
 * Generate block design theme css styles.
 *
 * @param string $theme
 *   Theme machine name.
 * @param string $css
 *   Generated css styles string.
 * @param array $palette
 *   Theme palette array.
 */
function block_design_theme_settings_css($theme, &$css, array $palette) {
  if ((theme_get_setting('block_preset')) && ($regions = array_filter(theme_get_setting('block_design_regions')))) {
    // Block Styling.
    $selector = _dxpr_theme_regions2selectors($regions, '.block');

    $css .= "/* Block Styling */\n";
    $css .= $selector . " {\n";

    if ($border_width = _dxpr_theme_settings_add_css('block_border', 'border-width')) {
      $css .= $border_width;
      $css .= "  border-style: solid;\n";
    }
    $css .= _dxpr_theme_settings_add_css('block_border_radius', 'border-radius');
    $css .= _dxpr_theme_settings_add_css('block_padding', 'padding');
    $css .= _dxpr_theme_settings_add_css('block_background', 'background-color');
    $css .= _dxpr_theme_settings_add_css('block_border_color', 'border-color');
    $css .= "}\n\n";

    // Block Title Styling.
    $selector = _dxpr_theme_regions2selectors($regions, '.block-title');
    $title_elem = theme_get_setting('title_font_size');

    $css .= "/* Block Title Styling */\n";
    $css .= $selector . " {\n";

    if ($border_width = _dxpr_theme_settings_add_css('title_border', 'border-width')) {
      $css .= $border_width;
      $css .= "  border-style: solid;\n";
    }
    $css .= _dxpr_theme_settings_add_css($title_elem . '_font_size', 'font-size');
    $css .= _dxpr_theme_settings_add_css('title_align', 'text-align');
    $css .= _dxpr_theme_settings_add_css('title_border_radius', 'border-radius');
    $css .= _dxpr_theme_settings_add_css('title_sticker', 'display');
    $css .= _dxpr_theme_settings_add_css('title_padding', 'padding');
    $css .= _dxpr_theme_settings_add_css('title_background', 'background-color');
    $css .= _dxpr_theme_settings_add_css('title_border_color', 'border-color');
    $css .= "}\n\n";

    // Mobile.
    $css .= "@media screen and (max-width: 768px) {\n  ";
    $css .= $selector . " {\n  ";
    $css .= _dxpr_theme_settings_add_css($title_elem . '_mobile_font_size', 'font-size');
    $css .= "  }\n}\n\n";

    // Divider Styling.
    if (theme_get_setting('block_divider') && theme_get_setting('block_divider_custom')) {
      $selector = _dxpr_theme_regions2selectors($regions, '.block-hr');

      $css .= "/* Divider Styling */\n";
      $css .= $selector . " {\n";
      $css .= _dxpr_theme_settings_add_css('block_divider_color', 'border-top-color');

      if (theme_get_setting('block_divider_custom')) {
        $css .= _dxpr_theme_settings_add_css('block_divider_thickness', 'border-top-width');
        $css .= _dxpr_theme_settings_add_css('block_divider_length', 'width');
        $css .= _dxpr_theme_settings_add_css('block_divider_spacing', 'margin-top');
        $css .= _dxpr_theme_settings_add_css('block_divider_spacing', 'margin-bottom');
      }
      $css .= "}\n\n";
    }
  }
}

/**
 * Generate CSS selectors for element and regions.
 *
 * @param array $regions
 *   Array of regions.
 * @param string $element
 *   Element CSS selector.
 *
 * @return string
 *   Generated CSS selector for the regions and element.
 */
function _dxpr_theme_regions2selectors(array $regions, $element) {
  $selector_array = [];
  foreach ($regions as $region) {
    $selector_array[] = '.region-' . str_replace('_', '-', $region) . ' ' . $element;
  }
  $selector_array[] = '.blocks-preview ' . $element;
  $selector = implode(', ', $selector_array);
  return $selector;
}
