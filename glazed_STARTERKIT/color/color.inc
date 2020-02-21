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
      'title' => t('Glazed Default'),
      'colors' => [
        'base' => '#0180ef',
        'link' => '#0180ef',
        'accent1' => '#05e993',
        'accent2' => '#0181ee',
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
      ],
    ],
  ],

  // CSS files (excluding @import) to rewrite with new color scheme.
  'css' => [
    'css/bootstrap-3.css',
    'css/bootstrap-theme.css',
    'css/jquery-ui.css',
    // GLAZED BASE
    'css/footer-menu.css',
    'css/forms.css',
    'css/layout.css',
    'css/page-title.css',
    'css/typography.css',
    // GLAZED Components
    'css/stpe-buttons.css',
    'css/glazed-full-screen-search.css',
    'css/glazed-header.css',
    'css/glazed-header--top.css',
    'css/glazed-header--side.css',
    'css/glazed-header--mobile.css',
    'css/glazed-secondary-header.css',
    'css/pager-prevnext.css',
    'css/glazed-admin.css',
    // Overrides
    'css/cubeportfolio.css',
    'css/drupal-breadcrumbs.css',
    'css/drupal-comments.css',
    'css/drupal-pager.css',
    'css/drupal-webform.css',
    'css/cms-bootstrap-core.css',
    'css/cms-bootstrap-blog.css',
    'css/cms-bootstrap-events.css',
    'css/cms-bootstrap-news.css',
    'css/cms-bootstrap-portfolio.css',
    'css/sooperthemes-premium-elements.css',
    'css/glazed-builder.css',
    // HELPERS
    'css/helper-classes.css',
  ],

  // Files to copy.
  'copy' => [
    'logo.svg',
    'glazed-favicon.png',
  ],
];
