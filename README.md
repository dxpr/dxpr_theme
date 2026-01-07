# DXPR Theme

For user documentation and support please check:
https://app.dxpr.com/hc/documentation

For development documentation and support please check:
https://app.dxpr.com/hc/documentation/internal

## Contributing Guidelines

Before you write any code for this project please also check
https://github.com/dxpr/dxpr_maven/blob/main/CONTRIBUTING.md


## AI-Powered Color Palette Generator

DXPR Theme includes an AI-powered color palette generator that creates harmonious
color schemes from natural language descriptions. Access it in theme settings
under Colors > Color Set.

**Requirements:**
- [Drupal AI module](https://www.drupal.org/project/ai) installed and configured with a chat provider

**Usage:** Enter a description like "Modern tech startup" or "Warm bakery tones"
and click Generate to create a complete color palette.

## Subtheme CSS File (/css/dxpr_theme_subtheme.css)

**Important**: The `dxpr_theme_subtheme.css` file in your custom subtheme is
intended **only for manual custom styles**. This file will remain empty by
design and is not automatically populated when you change theme settings
through the admin interface.

### How it works:
- All theme setting changes are applied directly from the parent theme
- The `dxpr_theme_subtheme.css` file is included on the site but remains empty
  unless you manually add custom CSS
- If you need custom styles, you must manually add them to
  `dxpr_theme_subtheme.css`
- Manual styles in this file will persist even after saving theme settings
  and clearing cache

# Continuous Integration / Automation

## References

- https://www.drupal.org/docs/develop/standards
- https://www.drupal.org/node/1587138
- https://www.drupal.org/node/1955232
- https://github.com/shaundrong/eslint-config-drupal-bundle#readme

## Development Setup

You need to install `docker` and `docker-compose` to your workstation.
You can keep using whatever to run your webserver,
we just use docker to run our scripts.

### npm Scripts

| Command | Description |
|---------|-------------|
| `npm run build` | Build JS with webpack, babel, terser |
| `npm run lint:scss` | Stylelint SCSS files |
| `npm run lint:scss:fix` | Stylelint SCSS with auto-fix |

### Shell Scripts

| Script | Description |
|--------|-------------|
| `scripts/update-vendor-assets.sh` | Update vendor packages and copy to `vendor/` |
| `scripts/create_subtheme.sh` | Create a new subtheme |

### How to watch and build files

```bash
DEV_WATCH=true docker compose up dev
```

### How to run eslint check

```bash
docker compose up dev eslint
```

### How to run eslint check with html report

```bash
REPORT_ENABLED=true docker compose up dev eslint
```

After it finishes, open `out/eslint-report.html` file to see report in details.


### How to run eslint auto fix

```bash
docker compose up dev eslint-auto-fix
```

### How to run Drupal lint check

```bash
docker compose up drupal-lint
```

### How to run Drupal lint auto fix

```bash
docker compose up drupal-lint-auto-fix

### How to run drupal-check

```bash
docker compose up drupal-check
# or
docker compose run --rm drupal-check
```

### Stylelint check for SCSS files

```bash
$ docker compose run --rm stylelint
```

### Stylelint check for SCSS files with HTML report.

```bash
$ REPORT_ENABLED=true docker compose run --rm stylelint
```

### Stylelint auto fix for SCSS files

```bash
$ docker compose run --rm stylelint-auto-fix
```

## CSS Custom Properties (Variables) Reference

DXPR Theme uses CSS custom properties extensively for theming and customization.
Variables are organized into several namespaces:

- `--dxt-color-*` - Theme color variables
- `--dxt-setting-*` - Theme setting variables
- `--bs-*` - Bootstrap 5 variables (mapped to DXPR variables where applicable)

### Color Variables

Color variables are defined per color scheme (default, softwarm, powerfulenergetic,
brighthealthy, calmapproachable, neon, earthy, minimalistmonochrome, darkmode,
aivibe, oceanblue, highcontrast).

| Variable | Description | Bootstrap Mapping |
|----------|-------------|-------------------|
| `--dxt-color-base` | Primary base color | `--bs-primary` |
| `--dxt-color-basetext` | Text color for base elements | |
| `--dxt-color-basesubtle` | Subtle base variation (80% white mix) | `--bs-primary-bg-subtle` |
| `--dxt-color-basesubtletext` | Subtle text for base (60% black mix) | `--bs-primary-text-emphasis` |
| `--dxt-color-accent1` | Primary accent color | `--bs-secondary` |
| `--dxt-color-accent1text` | Text for accent1 elements | |
| `--dxt-color-accent1subtle` | Subtle accent1 variant | `--bs-secondary-bg-subtle` |
| `--dxt-color-accent1subtletext` | Subtle accent1 text | `--bs-secondary-text-emphasis` |
| `--dxt-color-accent2` | Secondary accent color | |
| `--dxt-color-accent2text` | Text for accent2 elements | |
| `--dxt-color-accent2subtle` | Subtle accent2 variant | |
| `--dxt-color-accent2subtletext` | Subtle accent2 text | |
| `--dxt-color-text` | Main body text color | `--bs-body-color`, `--bs-secondary-color`, `--bs-tertiary-color`, `--bs-light-text-emphasis` |
| `--dxt-color-headings` | Heading text color | `--bs-heading-color`, `--bs-dark`, `--bs-dark-text-emphasis`, `--bs-emphasis-color` |
| `--dxt-color-headingssubtle` | Subtle heading color variant | |
| `--dxt-color-headingssubtletext` | Subtle heading text | |
| `--dxt-color-link` | Link color | `--bs-link-color`, `--bs-code-color` |
| `--dxt-color-header` | Header background color | |
| `--dxt-color-header-rgb` | Header color as RGB values | |
| `--dxt-color-headertext` | Header text color | |
| `--dxt-color-headerside` | Sidebar/side header background | |
| `--dxt-color-headersidetext` | Sidebar/side header text color | |
| `--dxt-color-card` | Card background color | `--bs-secondary-bg` |
| `--dxt-color-cardtext` | Card text color | |
| `--dxt-color-footer` | Footer background color | |
| `--dxt-color-footertext` | Footer text color | |
| `--dxt-color-secheader` | Secondary header background | |
| `--dxt-color-secheadertext` | Secondary header text | |
| `--dxt-color-pagetitle` | Page title background color | |
| `--dxt-color-pagetitletext` | Page title text color | |
| `--dxt-color-body` | Page body background | `--bs-body-bg` |
| `--dxt-color-silver` | Light gray color | `--bs-light`, `--bs-light-bg-subtle`, `--bs-tertiary-bg` |
| `--dxt-color-graylight` | Light gray variant | |
| `--dxt-color-graylighter` | Very light gray | `--bs-border-color`, `--bs-light-border-subtle` |

### Layout & Spacing Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `--dxt-setting-layout-max-width` | 1320px | Maximum content width |
| `--dxt-setting-box-max-width` | 1580px | Maximum box width |
| `--dxt-setting-boxed-layout-boxbg` | #fff | Boxed layout background |
| `--dxt-setting-gutter-horizontal` | 30px | Horizontal gutter |
| `--dxt-setting-gutter-horizontal-mobile` | 30px | Mobile horizontal gutter |
| `--dxt-setting-gutter-vertical` | 30px | Vertical gutter |
| `--dxt-setting-gutter-vertical-mobile` | 30px | Mobile vertical gutter |
| `--dxt-setting-gutter-container` | 60px | Container gutter |
| `--dxt-setting-gutter-container-mobile` | 30px | Mobile container gutter |
| `--dxt-setting-scale-factor` | 1.34 | Scale factor for calculations |

### Header Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `--dxt-setting-header-top-height` | 100px | Top header height |
| `--dxt-setting-header-top-height-scroll` | 50px | Header height when scrolled |
| `--dxt-setting-header-top-height-sticky-offset` | 60px | Sticky offset |
| `--dxt-setting-header-top-bg-opacity` | 1 | Header background opacity |
| `--dxt-setting-header-top-bg-opacity-scroll` | 1 | Header opacity when scrolled |
| `--dxt-setting-header-mobile-height` | 60px | Mobile header height |
| `--dxt-setting-header-mobile-breakpoint` | 1200px | Mobile breakpoint |
| `--dxt-setting-header-side-align` | left | Header side alignment |
| `--dxt-setting-header-block-background` | inherit | Header block background |
| `--dxt-setting-header-block-text-color` | inherit | Header block text color |
| `--dxt-setting-logo-height` | 35% | Logo height |

### Navigation Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `--dxt-setting-nav-font-face` | (system) | Nav font family |
| `--dxt-setting-nav-font-size` | 16px | Nav font size |
| `--dxt-setting-nav-mobile-font-size` | 14px | Mobile nav font size |
| `--dxt-setting-navbar-background` | (theme) | Navbar background color |
| `--dxt-setting-navbar-text-color` | (theme) | Navbar text color |
| `--dxt-setting-menu-background` | (theme) | Menu background color |
| `--dxt-setting-menu-text-color` | (theme) | Menu text color |
| `--dxt-setting-menu-hover-background` | (theme) | Menu hover background |
| `--dxt-setting-menu-hover-text-color` | (theme) | Menu hover text color |
| `--dxt-setting-menu-border-color` | (theme) | Menu border color |
| `--dxt-setting-menu-border-size` | 2px | Menu border size |
| `--dxt-setting-menu-border-position-offset` | 0px | Menu border offset |
| `--dxt-setting-menu-border-position-offset-sticky` | 0px | Menu border sticky offset |
| `--dxt-setting-mobile-menu-background` | (theme) | Mobile menu background |
| `--dxt-setting-mobile-menu-text-color` | (theme) | Mobile menu text color |
| `--dxt-setting-mobile-menu-hover-background` | (theme) | Mobile menu hover background |
| `--dxt-setting-mobile-menu-hover-text-color` | (theme) | Mobile menu hover text |
| `--dxt-setting-dropdown-background` | (theme) | Dropdown background |
| `--dxt-setting-dropdown-text-color` | (theme) | Dropdown text color |
| `--dxt-setting-dropdown-hover-background` | (theme) | Dropdown hover background |
| `--dxt-setting-dropdown-hover-text-color` | (theme) | Dropdown hover text |
| `--dxt-setting-dropdown-width` | 285px | Dropdown width |

### Typography Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `--dxt-setting-body-font-face` | (system) | Body font family |
| `--dxt-setting-body-font-weight` | 400 | Body font weight |
| `--dxt-setting-body-font-style` | normal | Body font style |
| `--dxt-setting-body-font-size` | 16px | Body font size |
| `--dxt-setting-body-mobile-font-size` | 14px | Mobile body font size |
| `--dxt-setting-body-line-height` | 1.6 | Body line height |
| `--dxt-setting-headings-font-face` | (system) | Headings font family |
| `--dxt-setting-headings-font-weight` | 700 | Headings font weight |
| `--dxt-setting-headings-font-style` | normal | Headings font style |
| `--dxt-setting-headings-line-height` | 1.1 | Headings line height |
| `--dxt-setting-headings-letter-spacing` | 0em | Headings letter spacing |
| `--dxt-setting-headings-bold` | normal | Headings bold weight |
| `--dxt-setting-headings-uppercase` | none | Headings uppercase |
| `--dxt-setting-sitename-font-face` | (system) | Site name font family |
| `--dxt-setting-sitename-font-weight` | 400 | Site name font weight |
| `--dxt-setting-sitename-font-style` | normal | Site name font style |
| `--dxt-setting-nav-font-face` | (system) | Navigation font family |
| `--dxt-setting-nav-font-weight` | 400 | Navigation font weight |
| `--dxt-setting-nav-font-style` | normal | Navigation font style |
| `--dxt-setting-h1-font-size` | 52px | H1 font size |
| `--dxt-setting-h1-mobile-font-size` | 52px | H1 mobile font size |
| `--dxt-setting-h2-font-size` | 38px | H2 font size |
| `--dxt-setting-h2-mobile-font-size` | 38px | H2 mobile font size |
| `--dxt-setting-h3-font-size` | 29px | H3 font size |
| `--dxt-setting-h3-mobile-font-size` | 29px | H3 mobile font size |
| `--dxt-setting-h4-font-size` | 21px | H4 font size |
| `--dxt-setting-h4-mobile-font-size` | 24px | H4 mobile font size |
| `--dxt-setting-blockquote-font-face` | (system) | Blockquote font family |
| `--dxt-setting-blockquote-font-weight` | 400 | Blockquote font weight |
| `--dxt-setting-blockquote-font-style` | italic | Blockquote font style |
| `--dxt-setting-blockquote-font-size` | 20px | Blockquote font size |
| `--dxt-setting-blockquote-mobile-font-size` | 18px | Mobile blockquote font |
| `--dxt-setting-blockquote-line-height` | 1.5 | Blockquote line height |

### Block & Card Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `--dxt-setting-block-background` | transparent | Block background |
| `--dxt-setting-block-padding` | 0px | Block padding |
| `--dxt-setting-block-border` | 0px | Block border |
| `--dxt-setting-block-border-radius` | 0px | Block border radius |
| `--dxt-setting-block-border-color` | (theme) | Block border color |
| `--dxt-setting-block-divider-color` | (theme) | Block divider color |
| `--dxt-setting-block-divider-thickness` | 0px | Block divider thickness |
| `--dxt-setting-block-divider-length` | 0px | Block divider length |
| `--dxt-setting-block-divider-spacing` | 0px | Block divider spacing |

### Title & Divider Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `--dxt-setting-title-align` | left | Title alignment |
| `--dxt-setting-title-background` | transparent | Title background |
| `--dxt-setting-title-padding` | 0px | Title padding |
| `--dxt-setting-title-border` | 0px | Title border |
| `--dxt-setting-title-border-color` | transparent | Title border color |
| `--dxt-setting-title-border-radius` | 0px | Title border radius |
| `--dxt-setting-title-font-size` | (h3 size) | Title font size |
| `--dxt-setting-title-font-size-mobile` | (h3 mobile) | Title mobile font size |
| `--dxt-setting-title-sticker` | block | Title sticker display |
| `--dxt-setting-title-type-uppercase` | uppercase | Title uppercase |
| `--dxt-setting-title-type-bold` | bold | Title bold |
| `--dxt-setting-title-type-italic` | italic | Title italic |
| `--dxt-setting-divider-color` | (theme) | Divider color |
| `--dxt-setting-divider-length` | 100% | Divider length |
| `--dxt-setting-divider-position` | auto | Divider position |
| `--dxt-setting-divider-position-block` | auto | Block divider position |
| `--dxt-setting-divider-thickness` | 4px | Divider thickness |

### Page Title Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `--dxt-setting-page-title-height` | 120px | Page title height |
| `--dxt-setting-page-title-align` | left | Page title alignment |
| `--dxt-setting-page-title-image-position` | center center | Image position |
| `--dxt-setting-page-title-image-style` | cover | Image style |
| `--dxt-setting-page-title-image-opacity` | 1 | Image opacity |
| `--dxt-setting-page-title-breadcrumbs-align` | right | Breadcrumbs alignment |
| `--dxt-setting-page-title-breadcrumbs-separator` | / | Breadcrumbs separator |

### Background Image Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `--dxt-setting-background-image-attachment` | fixed | Background attachment |
| `--dxt-setting-background-image-position` | center center | Background position |
| `--dxt-setting-background-image-style` | cover | Background style |

### Border Radius Variables

| Variable | Value | Description |
|----------|-------|-------------|
| `--dxt-radius-sm` | 8px | Small radius |
| `--dxt-radius-md` | 12px | Medium radius |
| `--dxt-radius-lg` | 16px | Large radius |
| `--dxt-radius-xl` | 24px | Extra large radius |
| `--dxt-radius-full` | 9999px | Full radius (pill) |

### Decorative Variables

| Variable | Value | Description |
|----------|-------|-------------|
| `--dxt-rainbow-color-1` | #94C8EF | Rainbow color 1 (blue) |
| `--dxt-rainbow-color-2` | #F97ED0 | Rainbow color 2 (pink) |
| `--dxt-rainbow-color-3` | #715EFF | Rainbow color 3 (purple) |

### Bootstrap Variable Mappings Summary

The following Bootstrap 5 variables are mapped to DXPR theme variables for
seamless integration:

| Bootstrap Variable | DXPR Variable | Description |
|--------------------|---------------|-------------|
| `--bs-primary` | `--dxt-color-base` | Primary color |
| `--bs-secondary` | `--dxt-color-accent1` | Secondary color |
| `--bs-primary-text-emphasis` | (60% black mix of base) | Primary text emphasis |
| `--bs-secondary-text-emphasis` | (60% black mix of accent1) | Secondary text emphasis |
| `--bs-primary-bg-subtle` | `--dxt-color-basesubtle` | Primary subtle bg |
| `--bs-secondary-bg-subtle` | `--dxt-color-accent1subtle` | Secondary subtle bg |
| `--bs-primary-border-subtle` | (60% white mix of base) | Primary subtle border |
| `--bs-secondary-border-subtle` | (60% white mix of accent1) | Secondary subtle border |
| `--bs-body-color` | `--dxt-color-text` | Body text color |
| `--bs-body-bg` | `--dxt-color-body` | Body background |
| `--bs-heading-color` | `--dxt-color-headings` | Heading color |
| `--bs-link-color` | `--dxt-color-link` | Link color |
| `--bs-link-hover-color` | `--dxt-color-accent1` | Link hover color |
| `--bs-code-color` | `--dxt-color-base` | Code color |
| `--bs-light` | `--dxt-color-silver` | Light color |
| `--bs-dark` | `--dxt-color-headings` | Dark color |
| `--bs-light-text-emphasis` | `--dxt-color-text` | Light text emphasis |
| `--bs-dark-text-emphasis` | `--dxt-color-headings` | Dark text emphasis |
| `--bs-light-bg-subtle` | `--dxt-color-silver` | Light subtle bg |
| `--bs-dark-bg-subtle` | (80% white mix of headings) | Dark subtle bg |
| `--bs-light-border-subtle` | `--dxt-color-graylighter` | Light subtle border |
| `--bs-dark-border-subtle` | `--dxt-color-headings` | Dark subtle border |
| `--bs-secondary-color` | `--dxt-color-text` | Secondary text |
| `--bs-secondary-bg` | `--dxt-color-card` | Secondary bg |
| `--bs-tertiary-color` | `--dxt-color-text` | Tertiary text |
| `--bs-tertiary-bg` | `--dxt-color-silver` | Tertiary bg |
| `--bs-emphasis-color` | `--dxt-color-headings` | Emphasis color |
| `--bs-border-color` | `--dxt-color-graylighter` | Border color |
| `--bs-border-color-translucent` | rgb(0 0 0 / 17.5%) | Translucent border |

### Drupal Displacement Variables

These Drupal system variables are used for admin toolbar integration:

| Variable | Description |
|----------|-------------|
| `--drupal-displace-offset-top` | Top displacement from Drupal toolbar |
| `--drupal-displace-offset-right` | Right displacement (settings sidebar) |
| `--drupal-displace-offset-left` | Left displacement |
| `--drupal-displace-offset-bottom` | Bottom displacement |
