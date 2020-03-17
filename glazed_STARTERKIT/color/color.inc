<?php
  //color schemes
  $info = array(

  // Images to copy over
  'copy' => array(
    'logo.png',
    'logo.svg',
    'glazed-favicon.png',
  ),

  // CSS files (excluding @import) to rewrite with new color scheme.
  'css' => array(
    // GLAZED BASE
    'css/base/footer-menu.css',
    'css/base/forms.css',
    'css/base/layout.css',
    'css/base/page-title.css',
    'css/base/typography.css',
    // GLAZED Components
    'css/components/glazed-full-screen-search.css',
    'css/components/glazed-header.css',
    'css/components/glazed-header--top.css',
    'css/components/glazed-header--side.css',
    'css/components/glazed-header--mobile.css',
    'css/components/glazed-secondary-header.css',
    'css/components/glazed-sidebar--menu.css',
    // Overrides
    'css/vendor-extensions/bootstrap-3.css',
    'css/vendor-extensions/bootstrap-theme.css',
    'css/vendor-extensions/jquery-ui.css',
    'css/vendor-extensions/drupal-breadcrumbs.css',
    'css/vendor-extensions/drupal-comments.css',
    'css/vendor-extensions/drupal-media-browser.css',
    'css/vendor-extensions/drupal-pager.css',
    'css/components/drupal-prevnext.css',
    // HELPERS
    'css/helpers/helper-classes.css',
  ),

  // Color areas to fill (x, y, width, height)
  'fill' => array(
  ),

  // Gradient definitions.
  'gradients' => array(
  ),

  // Coordinates of all the theme slices (x, y, width, height)
  // with their filename as used in the stylesheet.
  'slices' => array(
  ),

  // color preview css
  'preview_css' => '',

  // Base file for image generation
  'base_image' => 'glazed-favicon-transparent.png',

  //  blend target
  'blend_target' => '#ffffff',

  // Available colors and color labels used in theme.
  'fields' => array(
    'base' => t('Primary color'),
    'link' => t('Link color'),
    'accent1' => t('Accent color 1'),
    'accent2' => t('Accent color 2'),
    'text' => t('Text color'),
    'headings' => t('Headings color'),
    'well' => t('Well color'),
    'welltext' => t('Well text'),
    'footer' => t('Footer background'),
    'footertext' => t('Footer text'),
    'secheader' => t('Secondary Header bg'),
    'secheadertext' => t('Secondary Header text'),
    'header' => t('Top Header background'),
    'headertext' => t('Top Header text'),
    'headerside' => t('Side Header/Mobile Menu background'),
    'headersidetext' => t('Side Header/Mobile Menu text'),
    'pagetitle' => t('Page Title background'),
    'pagetitletext' => t('Page Title text'),
    'graylight' => t('Gray Light'),
    'graylighter' => t('Gray Lighter'),
    'silver' => t('Silver'),
    'body' => t('Body Background'),
  ),

  'schemes' => array(
    'default' => array(
      'title' => t('Glazed (Default)'),
      'colors' => array(
        'base' => '#0180ef',
        'link' => '#0180ef',
        'accent1' => '#05e993',
        'accent2' => '#0181ef',
        'text' => '#555555',
        'headings' => '#333333',
        'footer' => '#21252a',
        'footertext' => '#747a85',
        'secheader' => '#0181ef',
        'secheadertext' => '#fffffe',
        'well' => '#eeeeee',
        'welltext' => '#444444',
        'header' => '#ffffff',
        'headertext' => '#696969',
        'headerside' => '#20252a',
        'headersidetext' => '#737a85',
        'pagetitle' => '#0181f0',
        'pagetitletext' => '#fffeff',
        'graylight' => '#777777',
        'graylighter' => '#ededed',
        'silver' => '#f1f1f1',
        'body' => '#efefef',
      ),
    ),
  ),
);
