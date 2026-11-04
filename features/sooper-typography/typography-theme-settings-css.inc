<?php

/**
 * @file
 * Typography settings css styles.
 */

/**
 * Generate typography theme css styles.
 *
 * @param string $theme
 *   Theme machine name.
 * @param string $css
 *   Generated css styles string.
 * @param array $palette
 *   Theme palette array.
 */
function typography_theme_settings_css($theme, &$css, array $palette) {
  $css .= "/* Typography Styles */\n";

  if (theme_get_setting('menu_type', $theme) != 'lead') {
    // Scope both rules to the header mode classes set by the mobile
    // breakpoint script instead of a hard-coded media query, so the mobile
    // size applies whenever the mobile menu is active.
    $selectors = [
      '.dxpr-theme-header--top #dxpr-theme-main-menu .nav > li > a',
      '.dxpr-theme-header--top #dxpr-theme-main-menu .nav > li > span',
      '.dxpr-theme-header--top .nav .dropdown-menu li a',
      '.dxpr-theme-header--top .nav .dropdown-menu li span',
    ];
    $desktop = array_map(fn($selector) => '.body--dxpr-theme-nav-desktop ' . $selector, $selectors);
    $mobile = array_map(fn($selector) => '.body--dxpr-theme-nav-mobile ' . $selector, $selectors);

    $css .= implode(",\n", $desktop) . " {\n" .
      _dxpr_theme_settings_add_css('nav_font_size', 'font-size') .
      "}\n\n";

    $css .= implode(",\n", $mobile) . " {\n" .
      _dxpr_theme_settings_add_css('nav_mobile_font_size', 'font-size') .
      "}\n\n";
  }
}
