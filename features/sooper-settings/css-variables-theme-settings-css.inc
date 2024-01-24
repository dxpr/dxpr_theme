<?php

/**
 * @file
 * Handles saving settings as CSS variables.
 */

use Drupal\Component\Utility\Color;
use Drupal\Core\Config\StorageException;

/**
 * Generate CSS settings variables.
 *
 * @param string $theme
 *   Theme machine name.
 * @param string $css
 *   Generated css styles string.
 */
function css_variables_theme_settings_css(string $theme, string &$css) {
  // Retrieve configured theme-specific settings, if any.
  try {
    $theme_settings = \Drupal::config($theme . '.settings')->get();
  }
  catch (StorageException $e) {
    $theme_settings = [];
  }

  ksort($theme_settings);

  $css_variables = [];
  foreach ($theme_settings as $k => $v) {
    if (_dxpr_theme_is_css_variable($k)) {
      if ($value = _dxpr_theme_massage_values($k, $v, $theme, $theme_settings)) {
        $var_name = str_replace('_', '-', $k);
        $prefix = _dxpr_theme_get_const('cssSettingPrefix');
        $css_variables[] = '  ' . $prefix . $var_name . ': ' . $value;
      }
    }
  }

  if ($css_variables = implode(";\n", $css_variables)) {
    $css .= "/* Theme Settings */\n:root {\n" . $css_variables . ";\n}\n\n";
  }
}

/**
 * Returns if specified theme setting should be stored as a CSS variable or not.
 *
 * @param string $key
 *   The settings index key, or "name".
 *
 * @return bool
 *   Returns TRUE if the setting should be used as a CSS variable,
 *   FALSE otherwise.
 */
function _dxpr_theme_is_css_variable(string $key): bool {
  return array_key_exists($key, _dxpr_theme_get_css_settings());
}

/**
 * Massage values to be used as CSS variables.
 *
 * @param string $key
 *   Field key.
 * @param mixed $value
 *   Field value.
 * @param string $theme
 *   Theme machine name.
 * @param array $submitted
 *   Array of submitted values.
 *
 * @return string
 *   A value suitable for use as a CSS variable value.
 */
function _dxpr_theme_massage_values(string $key, $value, string $theme, array $submitted): string {
  $prefix = $suffix = '';
  $settings = _dxpr_theme_get_css_settings();

  // Add prefix and suffix.
  $p = $settings[$key]['prefix'] ?? '';
  $s = $settings[$key]['suffix'] ?? '';

  // Massage values further if needed.
  switch ($key) {
    // Generic: Replace underscore with space.
    case 'background_image_position':
    case 'page_title_image_position':
      $value = str_replace('_', ' ', $value);
      break;

    // Generic: Bold.
    case 'headings_bold':
      $value = !empty($value) ? 'bold' : 'inherit';
      break;

    // Generic: Uppercase.
    case 'headings_uppercase':
      $value = !empty($value) ? 'uppercase' : 'inherit';
      break;

    // Generic: Display style.
    case 'title_sticker':
      $value = !empty($value) ? 'inline-block' : 'block';
      break;

    // Divider; 0 = full width.
    case 'divider_length':
      if (empty($value)) {
        $value = 100;
        $s = '%'; // Override px value.
      }
      break;

    // Handle Font settings.
    case 'body_font_face':
    case 'blockquote_font_face':
    case 'headings_font_face':
    case 'nav_font_face':
    case 'sitename_font_face':
      $value = _dxpr_theme_get_font($value, $theme);
      break;
  }

  // Handle custom color fields with an associated '*_custom' field.
  if (isset($submitted[$key . '_custom'])) {
    // For custom color selections, use the associated field value.
    if ('custom' === $value) {
      $value = strtolower($submitted[$key . '_custom'] ?: '');

      // Check if this is a valid hex color.
      if (str_starts_with($value, '#') && !Color::validateHex($value)) {
        $value = '';
      }
    }
    // Otherwise, it's a predefined color scheme color, or a pass-through value.
    elseif (!empty($value)) {
      // Convert to CSS variable if valid color value.
      if (array_key_exists(strtolower($value), _dxpr_theme_get_color_names())) {
        $value = strtolower($value);
        $prefix = 'var(' . _dxpr_theme_get_const('cssColorPrefix');
        $suffix = ')';
      }
    }
  }

  // Only add prefixes/suffixes if there's a value.
  if (!empty($value)) {
    $value = $prefix . $p . $value . $s . $suffix;
  }

  return $value;
}

/**
 * Returns all settings that should be saved as CSS variables.
 *
 * @return array[]
 *   Array key is the settings' name, the array values are additional settings.
 */
function _dxpr_theme_get_css_settings(): array {
  return [
    'background_image_attachment' => [],
    'background_image_position' => [],
    'block_background' => [],
    'block_border' => ['suffix' => 'px'],
    'block_border_color' => [],
    'block_border_radius' => ['suffix' => 'px'],
    'block_divider_color' => [],
    'block_divider_length' => ['suffix' => 'px'],
    'block_divider_spacing' => ['suffix' => 'px'],
    'block_divider_thickness' => ['suffix' => 'px'],
    'block_padding' => ['suffix' => 'px'],
    'blockquote_font_face' => [],
    'blockquote_font_size' => ['suffix' => 'px'],
    'blockquote_line_height' => [],
    'blockquote_mobile_font_size' => ['suffix' => 'px'],
    'body_font_face' => [],
    'body_font_size' => ['suffix' => 'px'],
    'body_line_height' => [],
    'body_mobile_font_size' => ['suffix' => 'px'],
    'box_max_width' => ['suffix' => 'px'],
    'boxed_layout_boxbg' => [],
    'divider_color' => [],
    'divider_length' => ['suffix' => 'px'],
    'divider_thickness' => ['suffix' => 'px'],
    'dropdown_background' => [],
    'dropdown_hover_background' => [],
    'dropdown_hover_text_color' => [],
    'dropdown_text_color' => [],
    'dropdown_width' => ['suffix' => 'px'],
    'gutter_container' => ['suffix' => 'px'],
    'gutter_container_mobile' => ['suffix' => 'px'],
    'gutter_horizontal' => ['suffix' => 'px'],
    'gutter_horizontal_mobile' => ['suffix' => 'px'],
    'gutter_vertical' => ['suffix' => 'px'],
    'gutter_vertical_mobile' => ['suffix' => 'px'],
    'h1_font_size' => ['suffix' => 'px'],
    'h1_mobile_font_size' => ['suffix' => 'px'],
    'h2_font_size' => ['suffix' => 'px'],
    'h2_mobile_font_size' => ['suffix' => 'px'],
    'h3_font_size' => ['suffix' => 'px'],
    'h3_mobile_font_size' => ['suffix' => 'px'],
    'h4_font_size' => ['suffix' => 'px'],
    'h4_mobile_font_size' => ['suffix' => 'px'],
    'header_block_background' => [],
    'header_block_text_color' => [],
    'header_mobile_breakpoint' => ['suffix' => 'px'],
    'header_mobile_height' => ['suffix' => 'px'],
    'header_side_align' => [],
    'header_side_direction' => [],
    'header_side_width' => ['suffix' => 'px'],
    'header_top_bg_opacity' => [],
    'header_top_bg_opacity_scroll' => [],
    'header_top_height' => ['suffix' => 'px'],
    'header_top_height_scroll' => ['suffix' => 'px'],
    'header_top_height_sticky_offset' => ['suffix' => 'px'],
    'headings_bold' => [],
    'headings_font_face' => [],
    'headings_letter_spacing' => ['suffix' => 'em'],
    'headings_line_height' => [],
    'headings_uppercase' => [],
    'layout_max_width' => ['suffix' => 'px'],
    'menu_background' => [],
    'menu_border_color' => [],
    'menu_border_position_offset' => ['suffix' => 'px'],
    'menu_border_position_offset_sticky' => ['suffix' => 'px'],
    'menu_border_size' => ['suffix' => 'px'],
    'menu_hover_background' => [],
    'menu_hover_text_color' => [],
    'menu_text_color' => [],
    'nav_font_face' => [],
    'nav_font_size' => ['suffix' => 'px'],
    'nav_mobile_font_size' => ['suffix' => 'px'],
    'navbar_background' => [],
    'page_title_align' => [],
    'page_title_breadcrumbs_align' => [],
    'page_title_breadcrumbs_separator' => ['prefix' => '"', 'suffix' => '"'],
    'page_title_height' => ['suffix' => 'px'],
    'page_title_image_opacity' => [],
    'page_title_image_position' => [],
    'page_title_image_style' => [],
    'scale_factor' => [],
    'sitename_font_face' => [],
    'title_align' => [],
    'title_background' => [],
    'title_border' => ['suffix' => 'px'],
    'title_border_color' => [],
    'title_border_radius' => ['suffix' => 'px'],
    'title_padding' => ['suffix' => 'px'],
    'title_sticker' => [],
  ];
}
