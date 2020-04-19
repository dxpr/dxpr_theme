<?php

/**
 * @file
 */

if (theme_get_setting('custom_css_site', $theme)) {
  $css .= theme_get_setting('custom_css_site', $theme);
}
