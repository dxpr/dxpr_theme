<?php

/**
 * @file
 */

/**
 * Optional Footer Link to DXPR.
 */
function dxpr_theme_attribution_link() {
  $key = ord($_SERVER["SERVER_NAME"]) % 10;
  $links = array(
    '<a href="http://dxpr.com/">Drupal Themes by DXPR</a>',
    '<a href="http://dxpr.com">Drupal templates</a> by DXPR',
    '<a href="http://dxpr.com/">Drupal Premium Themes</a>',
    'Bootstrap <a href="http://dxpr.com/">Premium Drupal theme</a> by DXPR',
    '<a href="http://dxpr.com">Drupal templates</a> by DXPR',
    'DXPR <a href="http://dxpr.com">Premium Drupal themes</a>',
    'Premium <a href="http://dxpr.com">Drupal themes</a> by DXPR.com',
    '<a href="http://dxpr.com/">Drupal theme</a> by DXPR',
    '<a href="http://dxpr.com">Drupal Premium Themes</a> by DXPR',
    '<a href="http://dxpr.com/">Premium Drupal themes</a>',
  );
  return '<p class="clear-both dxpr-attribution-link dxpr-theme-util-text-muted small text-center">' . $links[$key] . '</p>';
}
