<?php

/**
 * @file
 */

/**
 * Helper function export settings to .info format.
 *
 * @return string
 *   The full .info settings.
 */
function _dxpr_theme_settings_export($theme) {
  $settings = variable_get('theme_' . $theme . '_settings');
  if (!$settings) {
    return FALSE;
  }
  unset(
    $settings['dxpr_theme_settings__active_tab'],
    $settings['global__active_tab'],
    $settings['info'],
    $settings['jquery_update_jquery_version'],
    $settings['theme']
  );
  $info = array();
  $info['settings'] = !empty($info['settings']) ? $info['settings'] : array();
  $info['settings'] = $settings;
  $info = _dxpr_theme_build_info_file($info);
  return $info;
}

/**
 * Helper function to build the contents of the .info file.
 * Based on Magic module's _magic_build_info_file.
 *
 * This function will take the current theme information, and create the export
 * based upon the current info file and settings saved within the database.
 *
 * @param array $array
 *   An array of all the current theme settings to be parsed.
 * @param string $prefix
 *   (Optional)
 *
 * @return string
 *   The full, prettified .info file.
 */
function _dxpr_theme_build_info_file($array, $prefix = '') {
  $info = '';
  foreach ($array as $key => $value) {
    if (is_array($value)) {
      $info .= _dxpr_theme_build_info_file($value, (empty($prefix) ? $key : "{$prefix}[{$key}]"));
    }
    else {
      if (is_string($value)) {
        $value = '"' . str_replace('"', "'", $value) . '"';
      }
      $info .= $prefix ? ("{$prefix}[$key]") : $key;
      $info .= " = " . str_replace("'", "\'", $value) . "\n";
    }
  }
  return $info;
}

$form['dxpr_theme_settings']['import_export'] = array(
  '#title' => t('Import/Export'),
  '#type' => 'fieldset',
  '#collapsible' => TRUE,
  '#collapsed' => TRUE,
  '#weight' => 70,
);

$form['dxpr_theme_settings']['import_export']['settings_export'] = array(
  '#title' => t('Export Theme Settings'),
  '#type' => 'fieldset',
  '#collapsible' => TRUE,
  '#collapsed' => TRUE,
);

$form['dxpr_theme_settings']['import_export']['settings_export']['settings_export_box'] = array(
  '#title' => t("Export for the theme's .info file", array('@theme' => $theme)),
  '#prefix' => '<p>' . t("For import in Theme Settings form or for your  subtheme's .info file") . '</p>',
  '#markup' => '<textarea class="dxpr-theme-settings-export"  onClick="this.select();">' . _dxpr_theme_settings_export($subject_theme) . '</textarea>',
);

$form['dxpr_theme_settings']['import_export']['settings_import'] = array(
  '#title' => t('Import Theme Settings'),
  '#type' => 'fieldset',
  '#collapsible' => TRUE,
  '#collapsed' => TRUE,
);

$form['dxpr_theme_settings']['import_export']['settings_import']['settings_import_box'] = array(
  '#type' => 'textarea',
  '#description' => t('Enter settings in .info file format. Any settings you enter here will override your current theme settings. This cannot be undone.'),
  '#rows' => 20,
  '#default_value' => '',
);
