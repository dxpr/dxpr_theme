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
  $prefix = _dxpr_theme_get_const('cssSettingPrefix');

  $css_variables = [];
  foreach ($theme_settings as $k => $v) {
    if (_dxpr_theme_is_css_variable($k)) {
      if ($value = _dxpr_theme_massage_values($k, $v, $theme, $theme_settings)) {

        if (is_array($value)) {
          foreach ($value as $name => $val) {
            $var_name = trim(str_replace('_', '-', $k . '_' . $name), '-');
            $css_variables[] = '  ' . $prefix . $var_name . ': ' . $val;
          }
        }
        else {
          $var_name = str_replace('_', '-', $k);
          $css_variables[] = '  ' . $prefix . $var_name . ': ' . $value;
        }
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
 * @return string|array
 *   A value suitable for use as a CSS variable value.
 */
function _dxpr_theme_massage_values(string $key, $value, string $theme, array $submitted): string|array {
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
      $value = !empty($value) ? 'bold' : 'normal';
      break;

    // Generic: Uppercase.
    case 'headings_uppercase':
      $value = !empty($value) ? 'uppercase' : 'none';
      break;

    // Generic: Display style.
    case 'title_sticker':
      $value = !empty($value) ? 'inline-block' : 'block';
      break;

    // Divider; 0 = full width.
    case 'divider_length':
      if (empty($value)) {
        $value = 100;
        $s = '%';
      }
      break;

    // Divider: Position = margin-left value.
    // Also adds a divider-position-block variable that uses the
    // same values except for the right-aligned value which uses the block
    // divider length.
    case 'divider_position':
      switch ($value) {
        case 1:
          $value = [
            '' => '0',
            'block' => '0',
          ];
          break;

        case 2:
          $value = [
            '' => 'auto',
            'block' => 'auto',
          ];
          break;

        case 3:
          $value = [
            '' => 'calc(100% - var(--dxt-setting-divider-length))',
            'block' => 'calc(100% - var(--dxt-setting-block-divider-length))',
          ];
          break;
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

    case 'title_font_size':
      $value = [
        '' => 'var(' . _dxpr_theme_get_const('cssSettingPrefix') . $value . '-font-size)',
        'mobile' => 'var(' . _dxpr_theme_get_const('cssSettingPrefix') . $value . '-mobile-font-size)',
      ];
      break;

    case 'page_title_breadcrumbs_separator':
      $str = str_replace(['\\', '"'], ['\\\\', '\\"'], $value);
      $value = htmlspecialchars($str, ENT_QUOTES, 'UTF-8');
      break;

    case 'page_title_breadcrumbs_separator':
      $str = str_replace(['\\', '"'], ['\\\\', '\\"'], $value);
      $value = htmlspecialchars($str, ENT_QUOTES, 'UTF-8');
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

  // Add prefixes/suffixes for non-empty string values.
  if (!empty($value) && is_string($value)) {
    if ($s === 'rem') {
      // Match decimal count of postcss-pxtorem.
      $value = round($value / 16, 5);
    }
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
    'block_border' => ['suffix' => 'rem'],
    'block_border_color' => [],
    'block_border_radius' => ['suffix' => 'rem'],
    'block_divider_color' => [],
    'block_divider_length' => ['suffix' => 'rem'],
    'block_divider_spacing' => ['suffix' => 'rem'],
    'block_divider_thickness' => ['suffix' => 'rem'],
    'block_padding' => ['suffix' => 'rem'],
    'blockquote_font_face' => [],
    'blockquote_font_size' => ['suffix' => 'rem'],
    'blockquote_line_height' => [],
    'blockquote_mobile_font_size' => ['suffix' => 'rem'],
    'body_font_face' => [],
    'body_font_size' => ['suffix' => 'rem'],
    'body_line_height' => [],
    'body_mobile_font_size' => ['suffix' => 'rem'],
    'box_max_width' => ['suffix' => 'rem'],
    'boxed_layout_boxbg' => [],
    'divider_color' => [],
    'divider_length' => ['suffix' => 'rem'],
    'divider_position' => [],
    'divider_thickness' => ['suffix' => 'rem'],
    'dropdown_background' => [],
    'dropdown_hover_background' => [],
    'dropdown_hover_text_color' => [],
    'dropdown_text_color' => [],
    'dropdown_width' => ['suffix' => 'rem'],
    'gutter_container' => ['suffix' => 'rem'],
    'gutter_container_mobile' => ['suffix' => 'rem'],
    'gutter_horizontal' => ['suffix' => 'rem'],
    'gutter_horizontal_mobile' => ['suffix' => 'rem'],
    'gutter_vertical' => ['suffix' => 'rem'],
    'gutter_vertical_mobile' => ['suffix' => 'rem'],
    'h1_font_size' => ['suffix' => 'rem'],
    'h1_mobile_font_size' => ['suffix' => 'rem'],
    'h2_font_size' => ['suffix' => 'rem'],
    'h2_mobile_font_size' => ['suffix' => 'rem'],
    'h3_font_size' => ['suffix' => 'rem'],
    'h3_mobile_font_size' => ['suffix' => 'rem'],
    'h4_font_size' => ['suffix' => 'rem'],
    'h4_mobile_font_size' => ['suffix' => 'rem'],
    'header_block_background' => [],
    'header_block_text_color' => [],
    'header_mobile_breakpoint' => ['suffix' => 'rem'],
    'header_mobile_height' => ['suffix' => 'rem'],
    'header_side_align' => [],
    'header_side_direction' => [],
    'header_side_logo_height' => ['suffix' => 'rem'],
    'header_side_width' => ['suffix' => 'rem'],
    'header_top_bg_opacity' => [],
    'header_top_bg_opacity_scroll' => [],
    'header_top_height' => ['suffix' => 'rem'],
    'header_top_height_scroll' => ['suffix' => 'rem'],
    'header_top_height_sticky_offset' => ['suffix' => 'rem'],
    'headings_bold' => [],
    'headings_font_face' => [],
    'headings_letter_spacing' => ['suffix' => 'em'],
    'headings_line_height' => [],
    'headings_uppercase' => [],
    'layout_max_width' => ['suffix' => 'rem'],
    'logo_height' => ['suffix' => '%'],
    'menu_background' => [],
    'menu_border_color' => [],
    'menu_border_position_offset' => ['suffix' => 'rem'],
    'menu_border_position_offset_sticky' => ['suffix' => 'rem'],
    'menu_border_size' => ['suffix' => 'rem'],
    'menu_hover_background' => [],
    'menu_hover_text_color' => [],
    'menu_text_color' => [],
    'nav_font_face' => [],
    'nav_font_size' => ['suffix' => 'rem'],
    'nav_mobile_font_size' => ['suffix' => 'rem'],
    'navbar_background' => [],
    'page_title_align' => [],
    'page_title_breadcrumbs_align' => [],
    'page_title_breadcrumbs_separator' => ['prefix' => '"', 'suffix' => '"'],
    'page_title_height' => ['suffix' => 'rem'],
    'page_title_image_opacity' => [],
    'page_title_image_position' => [],
    'page_title_image_style' => [],
    'scale_factor' => [],
    'sitename_font_face' => [],
    'title_align' => [],
    'title_background' => [],
    'title_border' => ['suffix' => 'rem'],
    'title_border_color' => [],
    'title_border_radius' => ['suffix' => 'rem'],
    'title_font_size' => [],
    'title_padding' => ['suffix' => 'rem'],
    'title_sticker' => [],
    'title_type' => [],
  ];
}
