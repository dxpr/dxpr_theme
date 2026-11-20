<?php

namespace Drupal\dxpr_theme;

use Drupal\Core\Extension\ThemeSettingsProvider;

/**
 * Reads theme settings on newer and older versions of Drupal core.
 */
final class ThemeSettings {

  /**
   * Gets a theme setting, defaulting to the active theme.
   */
  public static function get(string $name, ?string $theme = NULL) {
    if (\Drupal::hasService(ThemeSettingsProvider::class)) {
      return \Drupal::service(ThemeSettingsProvider::class)->getSetting($name, $theme);
    }
    return theme_get_setting($name, $theme);
  }

}
