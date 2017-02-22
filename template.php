<?php

/**
 * @file template.php
 */

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
