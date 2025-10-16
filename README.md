# DXPR Theme

For user documentation and support please check:
https://app.dxpr.com/hc/documentation

For development documentation and support please check:
https://app.dxpr.com/hc/documentation/internal

## Contributing Guidelines

Before you write any code for this project please also check
https://github.com/dxpr/dxpr_maven/blob/main/CONTRIBUTING.md


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
