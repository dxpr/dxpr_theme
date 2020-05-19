<?php

/**
 * @file
 * Lists available colors and color schemes for the Bartik theme.
 */

$info = [
  // Available colors and color labels used in theme.
  'fields' => [
    'base' => t('Primary Color'),
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
  ],
  // Pre-defined color schemes.
  'schemes' => [
    'default' => [
      'title' => t('DXPR Theme Default'),
      'colors' => [
        'base' => '#284ed9',
        'link' => '#284ed9',
        'accent1' => '#05e993',
        'accent2' => '#284fd8',
        'text' => '#555555',
        'headings' => '#333333',
        'footer' => '#21252a',
        'footertext' => '#747a85',
        'secheader' => '#284fd9',
        'secheadertext' => '#fffffe',
        'well' => '#eeeeee',
        'welltext' => '#444444',
        'header' => '#ffffff',
        'headertext' => '#696969',
        'headerside' => '#20252a',
        'headersidetext' => '#737a85',
        'pagetitle' => '#284fdb',
        'pagetitletext' => '#fffeff',
        'graylight' => '#777777',
        'graylighter' => '#ededed',
        'silver' => '#f1f1f1',
        'body' => '#efefef',
      ],
    ],
  ],

  // CSS files (excluding @import) to rewrite with new color scheme.
  'css' => [
    // DXPR THEME BASE.
    'css/base/footer-menu.css',
    'css/base/forms.css',
    'css/base/layout.css',
    'css/base/page-title.css',
    'css/base/typography.css',
    // DXPR THEME Components.
    'css/components/stpe-buttons.css',
    'css/components/dxpr-theme-full-screen-search.css',
    'css/components/dxpr-theme-header.css',
    'css/components/dxpr-theme-header--top.css',
    'css/components/dxpr-theme-header--side.css',
    'css/components/dxpr-theme-header--mobile.css',
    'css/components/dxpr-theme-secondary-header.css',
    'css/components/pager-prevnext.css',
    'css/components/dxpr-theme-admin.css',
    // Overrides.
    'css/vendor-extensions/bootstrap-3.css',
    'css/vendor-extensions/bootstrap-theme.css',
    'css/vendor-extensions/jquery-ui.css',
    'css/vendor-extensions/cubeportfolio.css',
    'css/vendor-extensions/drupal-breadcrumbs.css',
    'css/vendor-extensions/drupal-comments.css',
    'css/vendor-extensions/drupal-pager.css',
    'css/vendor-extensions/drupal-webform.css',
    'css/vendor-extensions/cms-bootstrap-core.css',
    'css/vendor-extensions/cms-bootstrap-blog.css',
    'css/vendor-extensions/cms-bootstrap-events.css',
    'css/vendor-extensions/cms-bootstrap-news.css',
    'css/vendor-extensions/cms-bootstrap-portfolio.css',
    'css/vendor-extensions/sooperthemes-premium-elements.css',
    'css/vendor-extensions/dxpr-theme-builder.css',
    // HELPERS.
    'css/helpers/helper-classes.css',
  ],

  // Files to copy.
  'copy' => [
    'logo.svg',
  ],
];
