<?php

// This is here because Drupal's theme settings form has some strange issues
if (!function_exists('glazed_settings_form_submit')) {
  function glazed_settings_form_submit(&$form, $form_state) {
    // Save Page Title Image
    // @See glazed_config.module
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
  }
}