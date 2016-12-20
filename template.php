<?php

/**
 * @file template.php
 */

// Load Glazed Theme Settings CSS File
global $theme;
$files_path = variable_get('file_public_path', conf_path() . '/files');
if (is_file($files_path . '/glazed-themesettings-' . $theme . '.css')) {
  drupal_add_css(
    $files_path . '/glazed-themesettings-' . $theme . '.css', array(
      'preprocess' => variable_get('preprocess_css', '') == 1 ? TRUE : FALSE,
      'group' => CSS_THEME,
      'media' => 'all',
      'every_page' => TRUE,
      'weight' => 100
    )
  );
}

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


/**
 * This would ideally be in theme-settings.php but it isn't because
 */
function glazed_settings_form_submit(&$form, &$form_state) {
  if ($import = $form_state['values']['settings_import_box']) {
    $import_settings = drupal_parse_info_format($import);
    if (is_array($import_settings) && isset($import_settings['settings'])) {
      $form_state['values'] = array_merge($form_state['values'], $import_settings['settings']);
    }
  }

  if (isset($form_state['values']['page_title_image'])) {
    $page_title_image = $form_state['values']['page_title_image'];
    if ($page_title_image && is_numeric($page_title_image) && ($page_title_image > 0)) {
      $image_fid = $page_title_image;
      $image = file_load($image_fid);
      if (is_object($image)) {
        // Check to make sure that the file is set to be permanent.
        if ($image->status == 0) {
          // Update the status.
          $image->status = FILE_STATUS_PERMANENT;
          // Save the update.
          file_save($image);
          // Add a reference to prevent warnings.
          file_usage_add($image, 'glazed', 'theme', 1);
         }
      }
    }
  }

  // If requested import additional demo content
  if (module_exists('uuid_features')) {
    module_load_include('module', 'uuid');
    module_load_include('inc', 'features', 'features.admin');
    $demo_content_modules = array_filter(_features_get_features_list(), "_glazed_is_demo_content");
    if (!empty($demo_content_modules)) {
      usort($demo_content_modules, function($a, $b) {
        $return = (count($a->info['features']['uuid_node']) < count($b->info['features']['uuid_node'])) ? 1 : -1;
        return $return;
      });
      foreach ($demo_content_modules as $module) {
        if (isset($module->info['features']) && isset($module->info['features']['uuid_node'])) {
          $node_sample = $module->info['features']['uuid_node'][0];
          if ($form_state['values'][$module->name] && !entity_get_id_by_uuid('node', array($node_sample))) {
            drupal_set_message($module->name . ' ' . t('installed'));
            module_enable(array($module->name));
            module_disable(array($module->name), FALSE);
          }
        }
      }
    }
  }

}